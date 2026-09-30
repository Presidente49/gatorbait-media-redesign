#!/usr/bin/env node
/**
 * Ask Buddy — moderation pipeline for fan questions to The Buddy Martin Show.
 *
 * Input: a JSON file in the shape returned by Wix Forms
 *   POST https://www.wixapis.com/form-submission-service/v4/submissions/namespace/query
 *   body { "query": { "filter": { "namespace": "wix.form_app.form", "formId": "8ab68d60-d973-4cf4-bbd5-47dcdbf94774" },
 *                     "sort": [{ "fieldName": "createdDate", "order": "DESC" }],
 *                     "cursorPaging": { "limit": 100 } } }
 *   (schema read via mcp__Wix__ReadFullDocsMethodSchema; each submission carries
 *    id, formId, namespace, status, submissions{target: value}, createdDate, submitter, seen).
 * This script never calls the network. Fetching is a separate, controller-authorized step.
 *
 * Steps: normalize -> dedupe (exact + near-duplicate) -> flag (profanity, personal data,
 * length, shouting, consent, status) -> rank by relevance to the next opponent
 * (sports-live/scoreboard.json, ESPN) and the newest stories (gazette-live/posts.json)
 * -> emit show-sheet.md, show-sheet.html, queue.json, flagged.json, stats.json.
 *
 * Usage:
 *   node ask-buddy.mjs [--in submissions.sample.json] [--out .] [--top 8] [--now 2026-09-30T14:00:00Z]
 *   node ask-buddy.mjs --self-test
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) =>
  a.startsWith("--") ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true] : []).filter(Boolean));

/* ---------- lexicons ---------- */
const STOP = new Set(("a an the and or but of to in on at for with by from as is are was were be been it its this that these those he she they them his her their we our you your i my me not no yes do does did so if then than too very can could would should will just about into over after before up down out off again more most some such only own same what which who whom why how when where here there all any both each few other has have had got much many".split(" ")));
const PROFANITY = ["damn", "hell", "ass", "bastard", "bitch", "crap", "shit", "fuck", "piss", "dick", "slut", "whore", "retard", "fag", "nigg"];
const SLUR_HARD = new Set(["retard", "fag", "nigg"]);
const HOSTILE = ["coward", "clown", "idiot", "moron", "loser", "trash", "sucks", "hate"];
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
const PHONE = /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const ADDRESS = /\b\d{1,5}\s+\w+(\s\w+)?\s(st|street|ave|avenue|rd|road|blvd|dr|drive|ln|lane|ct|court|way)\b\.?/i;
const URL = /\b(https?:\/\/|www\.)\S+/i;
const HANDLE_RE = /^[A-Za-z0-9_]{3,18}$/;

/* ---------- helpers ---------- */
const norm = (s) => String(s || "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const tokens = (s) => norm(s).split(" ").filter((t) => t.length > 2 && !STOP.has(t)).map(stem);
function stem(t) { return t.replace(/(ings|ing|ies|ers|ed|es|s)$/, (m) => (m === "es" || m === "s" ? "" : m === "ies" ? "y" : "")); }
/** Similarity: Jaccard, or containment (shared / smaller set) once both sides have 5+ keywords. */
function similar(a, b) { const A = new Set(a), B = new Set(b); let i = 0; for (const x of A) if (B.has(x)) i++; const small = Math.min(A.size, B.size); return Math.max(i / (A.size + B.size - i || 1), small >= 5 ? i / small : 0); }
const AP_MONTH = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
/** AP-style date in Eastern time: "Sat., Oct. 3, 3:30 p.m." */
function et(iso) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  const min = p.minute === "00" ? "" : ":" + p.minute;
  return `${p.weekday}., ${AP_MONTH[Number(p.month) - 1]} ${p.day}, ${p.hour}${min} ${p.dayPeriod.toLowerCase().replace("am", "a.m.").replace("pm", "p.m.")}`;
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Next show slot: Mon/Wed/Thu 9 p.m. ET, from `now`. */
export function nextShow(now = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: false });
  for (let d = 0; d < 8; d++) {
    const t = new Date(now.getTime() + d * 864e5);
    const p = Object.fromEntries(fmt.formatToParts(t).map((x) => [x.type, x.value]));
    if (!["Mon", "Wed", "Thu"].includes(p.weekday)) continue;
    if (d === 0 && Number(p.hour) >= 21) continue;
    return { weekday: p.weekday, date: `${p.year}-${p.month}-${p.day}`, label: `${p.weekday}., ${AP_MONTH[Number(p.month) - 1]} ${Number(p.day)}, 9 p.m. ET` };
  }
}

/* ---------- context: next game + story keywords ---------- */
export function buildContext(sb, posts, now) {
  const next = sb.next || {};
  const opp = next.opponent || "";
  const game = {
    opponent: opp, opponentRank: next.opponentRank, home: !!next.home, kickoffIso: next.kickoffIso, tv: next.tv, venue: next.venue,
    record: sb.team && sb.team.record, rank: sb.team && sb.team.rank, previewUrl: next.previewUrl,
    remaining: (sb.schedule || []).filter((g) => g.status === "scheduled" && g.eventId !== next.eventId).map((g) => g.opponent),
  };
  const weights = new Map();
  const add = (t, w) => weights.set(t, Math.max(weights.get(t) || 0, w));
  for (const t of tokens(opp)) add(t, 5);
  for (const t of tokens(next.venue || "")) add(t, 2);
  for (const o of game.remaining) for (const t of tokens(o)) add(t, 2);
  const stories = [];
  const list = posts.posts || posts.items || [];
  for (const p of list) {
    const ageH = Math.max(0, (now - new Date(p.firstPublishedDate || 0)) / 36e5);
    const w = ageH < 24 ? 3 : ageH < 72 ? 2 : 1; // newest stories weigh more
    const kw = tokens(p.title + " " + (p.excerpt || ""));
    stories.push({ title: p.title, url: p.url, author: p.author, kw: new Set(kw), w });
    for (const t of kw) add(t, w);
  }
  return { game, weights, stories, nextShow: nextShow(now) };
}

/* ---------- normalize ---------- */
export function normalize(raw) {
  return (raw.submissions || []).map((s) => {
    const v = s.submissions || {};
    return {
      id: s.id, status: s.status, createdDate: s.createdDate,
      visitor: (s.submitter && (s.submitter.visitorId || s.submitter.memberId)) || "anon",
      handle: String(v.handle || "").trim(), question: String(v.question || "").replace(/\s+/g, " ").trim(),
      topic: String(v.topic || "Other"), consent: v.okToReadOnAir !== false,
    };
  });
}

/* ---------- dedupe ---------- */
export function dedupe(items) {
  const kept = [];
  for (const it of items.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))) {
    const tk = tokens(it.question);
    const dup = kept.find((k) => norm(k.question) === norm(it.question) || similar(k._tk, tk) >= 0.6);
    if (dup) { dup.askedBy.push(it.handle); dup.asked += 1; dup.dupIds.push(it.id); continue; }
    kept.push({ ...it, _tk: tk, asked: 1, askedBy: [it.handle], dupIds: [] });
  }
  return kept;
}

/* ---------- flag ---------- */
export function flag(it) {
  const reasons = [];
  const q = it.question, low = norm(q);
  if (it.status !== "CONFIRMED") reasons.push(`status ${it.status}`);
  if (!it.consent) reasons.push("no consent to read on air");
  if (!HANDLE_RE.test(it.handle)) reasons.push("handle not 3-18 letters/digits");
  if (EMAIL.test(q)) reasons.push("contains an email address");
  if (PHONE.test(q)) reasons.push("contains a phone number");
  if (ADDRESS.test(q)) reasons.push("contains a street address");
  if (URL.test(q)) reasons.push("contains a link");
  const words = low.split(" ");
  const prof = PROFANITY.filter((p) => words.some((w) => (SLUR_HARD.has(p) ? w.includes(p) : w === p)));
  if (prof.length) reasons.push(`profanity (${prof.join(", ")})`);
  const host = HOSTILE.filter((h) => words.includes(h));
  if (host.length) reasons.push(`hostile wording (${host.join(", ")})`);
  if (q.length < 25) reasons.push("too short to be a question");
  if (q.length > 280) reasons.push("over 280 characters");
  const letters = q.replace(/[^A-Za-z]/g, "");
  if (letters.length > 20 && letters === letters.toUpperCase()) reasons.push("all caps");
  if (!/\?/.test(q) && !/^(how|why|what|when|where|who|is|are|does|do|can|should|will|would)\b/i.test(q)) reasons.push("not phrased as a question");
  const hard = reasons.some((r) => /email|phone|address|link|profanity|status|consent/.test(r));
  return { reasons, decision: hard ? "hold" : reasons.length ? "review" : "ok" };
}

/* ---------- rank ---------- */
export function rank(it, ctx) {
  let score = 0; const hits = [];
  for (const t of new Set(it._tk)) { const w = ctx.weights.get(t); if (w) { score += w; hits.push(t); } }
  score += Math.min(it.asked - 1, 3) * 2; // asked by several fans
  const len = it.question.length; if (len >= 60 && len <= 220) score += 1;
  const story = ctx.stories.map((s) => ({ s, m: it._tk.filter((t) => s.kw.has(t)).length })).filter((x) => x.m > 1).sort((a, b) => b.m - a.m || b.s.w - a.s.w)[0];
  const nq = norm(it.question), oppRe = new RegExp(tokens(ctx.game.opponent).join("|") + (ctx.game.venue ? "|" + norm(ctx.game.venue).split(" ")[0] : ""));
  if (oppRe.test(nq)) score += 3; // names the next opponent or its stadium
  const bucket = /injur|sprain|pcl|knee|mri|hurt|out for/.test(nq) ? "Injuries" : oppRe.test(nq) ? ctx.game.opponent : /poll|rank|no 8|top ten|top 25|playoff/.test(nq) ? "Poll and playoff" : /texas|georgia|south carolina|rest of the season|schedule|road/.test(nq) ? "Road ahead" : /line|trench|front|o line|offensive line|defense|special teams|return/.test(nq) ? "Line play and units" : "Other";
  return { score: Math.round(score * 10) / 10, hits, story: story ? { title: story.s.title, url: story.s.url, author: story.s.author } : null, bucket };
}

/* ---------- run ---------- */
export function run({ raw, sb, posts, now = new Date(), top = 8 }) {
  const ctx = buildContext(sb, posts, now);
  const items = dedupe(normalize(raw));
  const rows = items.map((it) => { const f = flag(it), r = rank(it, ctx); return { ...it, ...f, ...r }; });
  const queue = rows.filter((r) => r.decision === "ok").sort((a, b) => b.score - a.score || new Date(a.createdDate) - new Date(b.createdDate));
  const review = rows.filter((r) => r.decision === "review");
  const held = rows.filter((r) => r.decision === "hold");
  const clean = (r) => ({ id: r.id, handle: r.handle, question: r.question, bucket: r.bucket, score: r.score, asked: r.asked, askedBy: r.askedBy, matched: r.hits, story: r.story, createdDate: r.createdDate, reasons: r.reasons });
  const stats = { generatedAt: now.toISOString(), input: (raw.submissions || []).length, unique: rows.length, duplicatesFolded: (raw.submissions || []).length - rows.length, ok: queue.length, review: review.length, held: held.length, buckets: Object.fromEntries(Object.entries(rows.reduce((m, r) => (m[r.bucket] = (m[r.bucket] || 0) + 1, m), {})).sort((a, b) => b[1] - a[1])) };
  return { ctx, queue: queue.slice(0, top).map(clean), backup: queue.slice(top).map(clean), review: review.map(clean), held: held.map(clean), stats };
}

export function renderMarkdown(out) {
  const { ctx, queue, backup, review, held, stats } = out; const g = ctx.game;
  const L = [];
  L.push(`# Ask Buddy — show sheet`, ``, `**For:** The Buddy Martin Show, ${ctx.nextShow.label} (YouTube and facebook.com/thebuddymartinshow)`, `**Next game:** Florida (${g.record}, No. ${g.rank}) ${g.home ? "vs." : "at"} ${g.opponentRank ? "No. " + g.opponentRank + " " : ""}${g.opponent}, ${et(g.kickoffIso)} ET, ${g.tv} (ESPN via sports-live/scoreboard.json)`, `**Generated:** ${stats.generatedAt} · ${stats.input} submissions in, ${stats.duplicatesFolded} duplicates folded, ${stats.ok} ready, ${stats.review} to review, ${stats.held} held`, ``);
  L.push(`## Read these on air (ranked)`, ``);
  queue.forEach((q, i) => { L.push(`${i + 1}. **@${q.handle}** (${q.bucket}${q.asked > 1 ? `, asked by ${q.asked} fans` : ""}): ${q.question}`); if (q.story) L.push(`   - Tie-in: [${q.story.title}](${q.story.url}) — ${q.story.author}`); L.push(`   - Score ${q.score} · matched: ${q.matched.slice(0, 6).join(", ") || "none"}`); });
  if (backup.length) { L.push(``, `## Backups`, ``); backup.forEach((q) => L.push(`- **@${q.handle}** (${q.bucket}): ${q.question}`)); }
  if (review.length) { L.push(``, `## Editor review before use`, ``); review.forEach((q) => L.push(`- **@${q.handle}**: ${q.question}  \n  _${q.reasons.join("; ")}_`)); }
  L.push(``, `## Held (not for air, not public)`, ``);
  held.forEach((q) => L.push(`- …${q.id.slice(-4)} @${q.handle}: ${q.reasons.join("; ")}`));
  L.push(``, `## Rules`, ``, `- Nothing above is public until an editor marks it used. Held items stay in Wix and are never displayed.`, `- Fans give a handle and a question only; no email, phone or account is collected on this form.`, `- Questions may be trimmed for length and taste. Handle is read on air only when the fan ticked "OK to read on air."`, `- Ranking weights: opponent and venue from the ESPN scoreboard feed, keywords from the newest stories in gazette-live/posts.json, repeat questions from several fans.`);
  return L.join("\n") + "\n";
}

export function renderHtml(out) {
  const { ctx, queue, review, held, stats } = out; const g = ctx.game;
  const li = queue.map((q, i) => `<li><b>${i + 1}</b><div><span class="h">@${esc(q.handle)}<em>${esc(q.bucket)}${q.asked > 1 ? ` · asked by ${q.asked} fans` : ""}</em></span><p>${esc(q.question)}</p>${q.story ? `<a href="${esc(q.story.url)}">${esc(q.story.title)}</a>` : ""}</div><i>${q.score}</i></li>`).join("");
  const rv = review.map((q) => `<li><b>?</b><div><span class="h">@${esc(q.handle)}</span><p>${esc(q.question)}</p><small>${esc(q.reasons.join("; "))}</small></div></li>`).join("");
  const hd = held.map((q) => `<li><b>×</b><div><span class="h">@${esc(q.handle)}</span><small>${esc(q.reasons.join("; "))}</small></div></li>`).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ask Buddy Show Sheet</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap" rel="stylesheet">
<style>
:root{--navy:#07122e;--blue:#0021a5;--orange:#fa4616;--ink:#f3f5fa;--mut:#b9c4dc;--cond:"Barlow Condensed","Arial Narrow",sans-serif;--body:"Barlow",Arial,sans-serif}
*{box-sizing:border-box;margin:0}body{background:var(--navy);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.45;padding:20px 16px 40px}
main{max-width:520px;margin:0 auto}.k{font-family:var(--cond);font-weight:700;font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:var(--orange)}
h1{font-family:var(--cond);font-weight:800;font-size:42px;line-height:.92;text-transform:uppercase;margin:4px 0 8px}h1 span{color:var(--orange)}
.sub{color:var(--mut);font-size:14px}.sub b{color:var(--ink)}
h2{font-family:var(--cond);font-weight:800;font-size:24px;text-transform:uppercase;margin:22px 0 6px;display:flex;justify-content:space-between;align-items:baseline}h2 small{font-size:12px;letter-spacing:.12em;color:var(--orange)}
ol,ul{list-style:none}li{display:grid;grid-template-columns:28px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid #17285c}
li b{font-family:var(--cond);font-weight:800;font-size:22px;color:var(--orange)}li i{font-style:normal;font-family:var(--cond);font-weight:700;font-size:18px;color:var(--mut)}
.h{font-family:var(--cond);font-weight:700;font-size:15px;letter-spacing:.06em;text-transform:uppercase}.h em{font-style:normal;color:var(--mut);margin-left:8px;font-size:12px}
li p{margin-top:2px}li a{display:block;margin-top:4px;font-size:12px;color:var(--orange);text-decoration:none}li small{display:block;color:var(--mut);font-size:12px;margin-top:3px}
.st{display:flex;gap:10px;margin-top:14px}.st div{flex:1;border-top:2px solid var(--orange);padding-top:6px}.st b{display:block;font-family:var(--cond);font-weight:800;font-size:24px;line-height:1}.st span{font-size:12px;color:var(--mut)}
footer{margin-top:20px;font-size:11.5px;color:var(--mut);line-height:1.5}
</style></head><body><main>
<div class="k">Ask Buddy · show sheet · sample data run</div>
<h1>Tonight's <span>questions.</span></h1>
<p class="sub"><b>${esc(ctx.nextShow.label)}</b> · Florida (${esc(g.record)}, No. ${g.rank}) ${g.home ? "vs." : "at"} ${g.opponentRank ? "No. " + g.opponentRank + " " : ""}${esc(g.opponent)}, ${esc(et(g.kickoffIso))} ET, ${esc(g.tv)}. Source: ESPN via the site scoreboard feed.</p>
<div class="st"><div><b>${stats.input}</b><span>submissions in</span></div><div><b>${stats.duplicatesFolded}</b><span>duplicates folded</span></div><div><b>${stats.ok}</b><span>ready for air</span></div><div><b>${stats.held}</b><span>held</span></div></div>
<h2>Read on air <small>ranked by relevance</small></h2><ol>${li}</ol>
<h2>Editor review <small>${review.length}</small></h2><ul>${rv || "<li><div>None</div></li>"}</ul>
<h2>Held <small>never public</small></h2><ul>${hd}</ul>
<footer><p>Produced by deploy/dept-ideas/fans/ask-buddy.mjs from submissions.sample.json (fictional test handles and questions, shaped like Wix Forms QuerySubmissionsByNamespace output). Ranking uses the next opponent from sports-live/scoreboard.json (ESPN) and keywords from the newest stories in gazette-live/posts.json. Fans give a handle and a question only; nothing is public until an editor marks it used.</p></footer>
</main></body></html>
`;
}

/* ---------- self-test ---------- */
function selfTest() {
  const assert = (c, m) => { if (!c) { console.error("FAIL:", m); process.exitCode = 1; } else console.log("ok  ", m); };
  const raw = JSON.parse(fs.readFileSync(path.join(HERE, "submissions.sample.json"), "utf8"));
  const sb = JSON.parse(fs.readFileSync(path.join(REPO, "sports-live/scoreboard.json"), "utf8"));
  const posts = JSON.parse(fs.readFileSync(path.join(REPO, "gazette-live/posts.json"), "utf8"));
  const now = new Date("2026-09-30T14:00:00Z");
  const out = run({ raw, sb, posts, now, top: 8 });
  const all = [...out.queue, ...out.backup, ...out.review, ...out.held];
  assert(out.stats.input === 16, "reads 16 sample submissions");
  assert(out.stats.duplicatesFolded === 2, "folds the exact and the near-duplicate Vernell Brown questions");
  assert(all.find((r) => r.question.startsWith("How much does Vernell")).asked === 3, "folded question shows asked by 3 fans");
  const heldIds = out.held.map((h) => h.handle);
  assert(heldIds.includes("BullGatorBill"), "phone number is held");
  assert(heldIds.includes("VeroBeachVic"), "email address is held");
  assert(heldIds.includes("LakeCityLarry"), "profanity is held");
  assert(heldIds.includes("PendingPaul"), "PENDING status is held");
  assert(heldIds.includes("QuietQuinn"), "no on-air consent is held");
  assert(out.review.some((r) => r.handle === "ArcherRoadAndy"), "all-caps goes to review, not air");
  assert(out.review.some((r) => r.handle === "OcalaOrange"), "too-short goes to review");
  assert(out.queue[0].bucket === "Missouri", "top-ranked question names the next opponent");
  assert(out.queue.every((q) => q.reasons.length === 0), "nothing flagged reaches the air list");
  assert(!JSON.stringify(out.queue).includes("@example.com"), "no email leaks into the queue payload");
  assert(out.ctx.nextShow.weekday === "Wed" && out.ctx.nextShow.date === "2026-09-30", "next show resolves to Wed., Sept. 30");
  assert(nextShow(new Date("2026-10-03T02:00:00Z")).weekday === "Mon", "after Thursday's show the next slot is Monday");
  const md = renderMarkdown(out);
  assert(md.includes("No. 25 Missouri") && md.includes("ABC"), "show sheet carries opponent, rank and network from the feed");
  assert(md.includes("Sat., Oct. 3, 3:30 p.m.") && md.includes("Wed., Sept. 30"), "dates are AP style");
  assert(!md.includes("352-555"), "held phone number is not printed in the show sheet");
  console.log(process.exitCode ? "SELF-TEST FAILED" : "SELF-TEST PASSED");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (args["self-test"]) { selfTest(); }
  else {
    const inFile = path.resolve(HERE, String(args.in || "submissions.sample.json"));
    const outDir = path.resolve(HERE, String(args.out || "."));
    const now = args.now ? new Date(String(args.now)) : new Date();
    const raw = JSON.parse(fs.readFileSync(inFile, "utf8"));
    const sb = JSON.parse(fs.readFileSync(path.join(REPO, "sports-live/scoreboard.json"), "utf8"));
    const posts = JSON.parse(fs.readFileSync(path.join(REPO, "gazette-live/posts.json"), "utf8"));
    const out = run({ raw, sb, posts, now, top: Number(args.top || 8) });
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "show-sheet.md"), renderMarkdown(out));
    fs.writeFileSync(path.join(outDir, "show-sheet.html"), renderHtml(out));
    fs.writeFileSync(path.join(outDir, "queue.json"), JSON.stringify({ show: out.ctx.nextShow, game: out.ctx.game, onAir: out.queue, backup: out.backup, review: out.review }, null, 2));
    fs.writeFileSync(path.join(outDir, "flagged.json"), JSON.stringify(out.held.map((h) => ({ id: h.id, handle: h.handle, reasons: h.reasons })), null, 2));
    fs.writeFileSync(path.join(outDir, "stats.json"), JSON.stringify(out.stats, null, 2));
    console.log(`Ask Buddy: ${out.stats.input} in, ${out.stats.duplicatesFolded} folded, ${out.stats.ok} ready, ${out.stats.review} review, ${out.stats.held} held -> ${outDir}`);
  }
}
