#!/usr/bin/env node
// GatorBot: builds the weekly Game Thread, Buddy's Porch call, Discuss-this-story
// posts and house rules for the GatorBait Wix Groups board as ready JSON payloads.
// Dry run only. It never calls the network. Posting is owned by Jarvis (#34 scope).
//
// Inputs (read only):
//   sports-live/scoreboard.json   ESPN-sourced record, rank, last/next game
//   gazette-live/posts.json       newest GatorBait stories
//   deploy/dept-ideas/community/evidence/groups.snapshot.json  real List Groups read
//   deploy/dept-ideas/community/evidence/rules.schema.json     CreateOrReplaceAllRules body
//   deploy/dept-ideas/community/evidence/group-contract.json   Group enums from the spec
// Output: deploy/dept-ideas/community/payloads/*.json  (+ manifest.json)
//
// Usage: node deploy/dept-ideas/community/gatorbot.mjs [--dry-run] [--since=YYYY-MM-DD]
//        --post is refused on purpose; see manifest.postingPolicy.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const args = process.argv.slice(2);
if (args.includes("--post")) {
  console.error("GatorBot: --post is not implemented. Posting to live Groups is a Jarvis-owned write under #34 scope, and the public REST spec exposes no feed-create endpoint (see evidence/group-contract.json). Run without --post for a dry run.");
  process.exit(2);
}
const sinceArg = (args.find(a => a.startsWith("--since=")) || "").split("=")[1];

const J = p => JSON.parse(readFileSync(p, "utf8"));
const score = J(join(ROOT, "sports-live/scoreboard.json"));
const feed = J(join(ROOT, "gazette-live/posts.json"));
const snap = J(join(HERE, "evidence/groups.snapshot.json"));
const rulesSchema = J(join(HERE, "evidence/rules.schema.json"));
const contract = J(join(HERE, "evidence/group-contract.json"));

// ---------- helpers ----------
const ET = "America/New_York";
const fmt = (iso, opts) => new Intl.DateTimeFormat("en-US", { timeZone: ET, ...opts }).format(new Date(iso));
const AP_MONTH = { January: "Jan.", February: "Feb.", March: "March", April: "April", May: "May", June: "June", July: "July", August: "Aug.", September: "Sept.", October: "Oct.", November: "Nov.", December: "Dec." };
const AP_DAY = { Sunday: "Sun.", Monday: "Mon.", Tuesday: "Tue.", Wednesday: "Wed.", Thursday: "Thu.", Friday: "Fri.", Saturday: "Sat." };
function apDate(iso, withDay = true) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: ET, weekday: "long", month: "long", day: "numeric" }).formatToParts(new Date(iso)).map(p => [p.type, p.value]));
  return `${withDay ? AP_DAY[parts.weekday] + ", " : ""}${AP_MONTH[parts.month]} ${parts.day}`;
}
function apTime(iso) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: ET, hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(new Date(iso)).map(p => [p.type, p.value]));
  const ampm = parts.dayPeriod.toLowerCase() === "am" ? "a.m." : "p.m.";
  const min = parts.minute === "00" ? "" : ":" + parts.minute;
  return `${parts.hour}${min} ${ampm} ET`;
}
const rank = r => (r ? `No. ${r} ` : "");
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Bloody Tuesday = the Tuesday of game week, 9 a.m. ET. Close = when the recap posts.
function tuesdayBefore(kickIso) {
  const d = new Date(kickIso);
  const dow = Number(fmt(kickIso, { weekday: "short" }) === "Sat" ? 6 : new Date(fmt(kickIso, { year: "numeric", month: "2-digit", day: "2-digit" })).getUTCDay());
  const back = ((dow - 2) + 7) % 7 || 7;
  const t = new Date(d.getTime() - back * 86400000);
  const ymd = fmt(t.toISOString(), { year: "numeric", month: "2-digit", day: "2-digit" }); // MM/DD/YYYY
  const [m, dd, y] = ymd.split("/");
  return { localDate: `${y}-${m}-${dd}`, localTime: "09:00", timeZone: ET };
}

// ---------- targets (real groups only) ----------
const bySlug = Object.fromEntries(snap.groups.map(g => [g.slug, g]));
function target(slug) {
  const g = bySlug[slug];
  if (!g) throw new Error(`group slug not in snapshot: ${slug}`);
  return { groupId: g.id, slug: g.slug, name: g.name, privacyStatus: g.privacyStatus, accessRestriction: g.accessRestriction?.type || null };
}
const T = {
  game: target("game-day-threads"),
  porch: target("gatorbait-gold-vip-lounge"),
  football: target("gator-football-talk"),
  recruiting: target("recruiting-central"),
  hoops: target("gator-hoops"),
  other: target("all-gator-sports"),
  lounge: target("the-swamp-lounge"),
};

// ---------- validation ----------
const problems = [];
function must(cond, msg) { if (!cond) problems.push(msg); return cond; }
function validateTarget(t, label) {
  must(GUID.test(t.groupId), `${label}: groupId is not a GUID`);
  must(contract.privacyStatus.includes(t.privacyStatus), `${label}: privacyStatus ${t.privacyStatus} not in spec enum`);
  if (t.accessRestriction) must(contract.accessRestrictionType.includes(t.accessRestriction), `${label}: accessRestriction ${t.accessRestriction} not in spec enum`);
  const g = bySlug[t.slug];
  must(contract.allowPolicy.includes(g.allowedToCreatePosts), `${label}: allowedToCreatePosts ${g.allowedToCreatePosts} not in spec enum`);
}
function validateFeedPost(p, label) {
  validateTarget(p.target, label);
  must(contract.contentType.includes(p.post.contentType), `${label}: contentType not in spec enum`);
  must(typeof p.post.text === "string" && p.post.text.length > 0 && p.post.text.length <= 20480, `${label}: text empty or over 20,480 chars (Group.description cap used as ceiling)`);
  must(p.post.links.every(l => /^https:\/\/www\.gatorbaitmedia\.com\//.test(l.url)), `${label}: non-canonical link`);
  must(!/\$\d/.test(p.post.text), `${label}: dollar figure in post text`);
}
function validateRules(body, label) {
  const s = rulesSchema;
  must(Array.isArray(body.rules), `${label}: rules not array`);
  must(body.rules.length <= s.properties.rules.maxItems, `${label}: more than ${s.properties.rules.maxItems} rules`);
  for (const r of body.rules) for (const k of s.properties.rules.items.required) must(typeof r[k] === "string" && r[k].length, `${label}: rule missing ${k}`);
}

// ---------- 1) Game thread ----------
const nx = score.next;
const last = score.last;
const kickoff = `${apDate(nx.kickoffIso)}, ${apTime(nx.kickoffIso)}`;
const site = nx.home ? "in The Swamp" : `at ${rank(nx.opponentRank)}${nx.opponent}`;
const previewPost = feed.posts.find(p => p.url === nx.previewUrl);
const recapPost = feed.posts.find(p => p.url === last.recapUrl);
const gameLinks = [
  previewPost && { label: "Preview", title: previewPost.title, url: previewPost.url },
  recapPost && { label: "Last week", title: recapPost.title, url: recapPost.url },
].filter(Boolean);
const gameText = [
  `GAME THREAD: ${rank(score.team.rank)}Florida (${score.team.record}) ${site}`,
  `Kickoff ${kickoff}${nx.tv ? ", " + nx.tv : ""}. ${nx.venue}.`,
  `Last week: Florida ${last.score.fla}, ${rank(last.opponentRank)}${last.opponent} ${last.score.opp}.`,
  ``,
  `This thread opened on Bloody Tuesday and closes when the recap posts. Read free; post with a GatorBait account. House rules are pinned in the group.`,
  ...gameLinks.map(l => `${l.label}: ${l.title} ${l.url}`),
  ``,
  `Record, ranking, kickoff and TV: ESPN via the GatorBait scoreboard feed (updated ${score.updatedAt}).`,
  `Posted by GatorBot (automated). Staff replies are signed by name.`,
].join("\n");
const gameThread = {
  kind: "group-feed-post",
  target: T.game,
  post: { contentType: "PLAIN_TEXT", pinned: true, text: gameText, links: gameLinks },
  lifecycle: { opens: tuesdayBefore(nx.kickoffIso), closes: "when the recap for this eventId is present in gazette-live/posts.json (score.last.recapUrl)", eventId: nx.eventId },
  sources: ["sports-live/scoreboard.json (ESPN)", "gazette-live/posts.json"],
  schemaNote: contract.feedCreateEndpoint,
};
validateFeedPost(gameThread, "game-thread");

// ---------- 2) Buddy's Porch call (members-only group) ----------
const buddyCol = feed.posts.find(p => p.author === "Buddy Martin");
const porchText = [
  `BUDDY'S PORCH, ${nx.opponent} week: ask before the show.`,
  `Drop your questions here. Buddy reads the Porch before The Buddy Martin Show, live Mondays, Wednesdays and Thursdays at 9 p.m. ET on YouTube and Facebook, and takes the best ones on air.`,
  buddyCol ? `Start with his column: ${buddyCol.title} ${buddyCol.url}` : ``,
  ``,
  `This is the members' room. GatorBot opens the call; Buddy answers on the show, not in the thread. Questions that get answered are listed in the game thread on Thursday.`,
  `Posted by GatorBot (automated).`,
].filter(l => l !== undefined).join("\n");
const porch = {
  kind: "group-feed-post",
  target: T.porch,
  post: { contentType: "PLAIN_TEXT", pinned: true, text: porchText, links: buddyCol ? [{ label: "Column", title: buddyCol.title, url: buddyCol.url }] : [] },
  gating: {
    today: `${T.porch.name} is ${T.porch.privacyStatus} with accessRestriction ${T.porch.accessRestriction} (real read).`,
    proposed: "Switch accessRestriction to PAID_PLANS in the Groups dashboard and attach the current buyable plans (ids in payloads/plans.json). No prices change.",
  },
  lifecycle: { opens: tuesdayBefore(nx.kickoffIso), closes: "after Thursday's show", eventId: nx.eventId },
  sources: ["gazette-live/posts.json", "evidence/groups.snapshot.json"],
  schemaNote: contract.feedCreateEndpoint,
};
validateFeedPost(porch, "porch");

// ---------- 3) Discuss this story ----------
const since = sinceArg ? new Date(sinceArg) : new Date(new Date(last.date).getTime() - 36 * 3600000);
function route(p) {
  const t = `${p.title} ${p.excerpt}`.toLowerCase();
  if (/recruit|commit|portal|prospect|class of/.test(t)) return T.recruiting;
  if (/basketball|hoops|golden|todd golden/.test(t)) return T.hoops;
  if (/baseball|softball|gymnast|track|tennis|golf|volleyball|soccer/.test(t)) return T.other;
  if (/senate|act|injunction|court|ncaa|nil\b/.test(t)) return T.football;
  const opp = nx.opponent.toLowerCase();
  if (t.includes(opp) || /bloody tuesday|game week/.test(t)) return T.game;
  return T.football;
}
const discuss = feed.posts
  .filter(p => new Date(p.firstPublishedDate) >= since)
  .map(p => {
    const target = route(p);
    const text = [
      `DISCUSS: ${p.title}`,
      p.excerpt,
      p.url,
      `By ${p.author}. Read it on GatorBait, then talk about it here. One thread per story; GatorBot posts the link, people post the takes.`,
    ].join("\n");
    const payload = { kind: "group-feed-post", target, post: { contentType: "PLAIN_TEXT", pinned: false, text, links: [{ label: "Story", title: p.title, url: p.url }] }, story: { author: p.author, firstPublishedDate: p.firstPublishedDate, section: p.section }, schemaNote: contract.feedCreateEndpoint };
    validateFeedPost(payload, `discuss:${p.url}`);
    return payload;
  });

// ---------- 4) House rules (API-validated, PUT body) ----------
const rulesBody = {
  rules: [
    { title: "Real fans, real names optional, real respect", description: "No personal attacks on players, coaches, staff or other posters. Argue the take, not the person." },
    { title: "No rumors as fact", description: "Injury, recruiting, transfer or legal claims need a link to a published report. Say 'I heard' if that is all you have." },
    { title: "No doxxing, no harassment", description: "Never post anyone's contact information, location, workplace or family. First offense is removal." },
    { title: "Keep paid content paid", description: "Do not paste Magazine or members-only text into public threads. Link to it instead." },
    { title: "No spam, no promo", description: "No product plugs, ticket resale, betting touts or link farms. AI spam protection is on, and staff delete without notice." },
    { title: "One game, one thread", description: "Game talk goes in the pinned game thread. It opens Tuesday and closes after the recap." },
    { title: "Staff decisions are final", description: "Moderators may remove posts and members. Appeals go to the Contact page, not the thread." },
  ],
};
validateRules(rulesBody, "rules");
const rulesPayloads = [T.game, T.football, T.porch].map(t => ({ kind: "rules", method: "PUT", url: `https://www.wixapis.com/social-groups/v2/rules/${t.groupId}`, docsUrl: "https://dev.wix.com/docs/api-reference/crm/community/groups/rules/create-or-replace-all-rules", target: t, body: rulesBody, currentRulesOnSite: snap.rulesRead[t.slug] ?? "not read", note: "Replaces all rules on that group. Owner: Jarvis. Not sent by this script." }));

// ---------- write ----------
if (problems.length) {
  console.error("GatorBot validation failed:\n- " + problems.join("\n- "));
  process.exit(1);
}
const out = join(HERE, "payloads");
if (existsSync(out)) rmSync(out, { recursive: true });
mkdirSync(out, { recursive: true });
const files = [];
const w = (name, obj) => { writeFileSync(join(out, name), JSON.stringify(obj, null, 2) + "\n"); files.push(name); };
w(`game-thread-${nx.eventId}.json`, gameThread);
w(`porch-${nx.eventId}.json`, porch);
discuss.forEach(d => w(`discuss-${d.post.links[0].url.split("/post/")[1].slice(0, 60)}.json`, d));
rulesPayloads.forEach(r => w(`rules-${r.target.slug}.json`, r));
w("manifest.json", {
  generatedAt: new Date().toISOString(),
  mode: "dry-run",
  postingPolicy: "Nothing here was sent. Rules payloads are valid CreateOrReplaceAllRules bodies. Feed-post payloads are handoff bodies because the public REST spec exposes no Groups feed-create endpoint; they are posted from the Groups dashboard or a Velo backend by the production owner.",
  proposedRoutine: { name: "gatorbot-bloody-tuesday", cron: "CRON_TZ=America/New_York 50 8 * * 2", prompt: "Run node deploy/dept-ideas/community/gatorbot.mjs, attach payloads/ to the community issue for Jarvis. Do not post." },
  counts: { gameThread: 1, porch: 1, discuss: discuss.length, rules: rulesPayloads.length },
  files,
  validation: { problems: 0, checks: ["groupId GUID and present in real snapshot", "privacyStatus/accessRestriction/allowPolicy/contentType in spec enums", "text 1..20,480 chars", "canonical gatorbaitmedia.com links only", "no dollar figures", "rules body matches CreateOrReplaceAllRulesRequest"] },
});
console.log(`GatorBot dry run: ${files.length} payloads in ${out}`);
console.log(files.join("\n"));
