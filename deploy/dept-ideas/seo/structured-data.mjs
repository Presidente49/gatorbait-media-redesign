#!/usr/bin/env node
// GatorBait Game Graph: JSON-LD generator for the homepage HEAD embed and per-article SportsEvent tags.
// Sources: gazette-live/posts.json (stories) and sports-live/scoreboard.json (ESPN-sourced schedule).
// Usage:  node deploy/dept-ideas/seo/structured-data.mjs [--out <dir>] [--now <ISO>]
//         (writes homepage-graph.json, homepage-embed.html, article-<slug>.json and index.json to --out,
//          default deploy/dept-ideas/seo/out; exits 1 when validation fails or the embed exceeds the Wix limit)
// Rules encoded here:
//   - No invented kickoff: a game whose ESPN time is a midnight-ET placeholder (04:00/05:00Z) with no TV gets a
//     date-only startDate.
//   - No duplicate NewsArticle on article pages: Wix already renders one, so articles get only a SportsEvent
//     (docs/ARTICLE-PAGE-STANDARD.md).
//   - One canonical story per game: subjectOf points at exactly one URL (recap/preview from the scoreboard feed).
//   - Lead story follows Brenden's direction: the newest Buddy Martin piece from the last seven days, else newest.
//   - The homepage embed must stay under WIX_EMBED_MAX (Wix custom embed html limit) with headroom.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE = 'https://www.gatorbaitmedia.com';
export const WIX_EMBED_MAX = 15000; // Wix Custom Embeds API: embedData.html "Maximum length is 15000 characters".
export const EMBED_BUDGET = 12000; // our own ceiling, leaves headroom for the HTML comment and Wix wrapping.
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
const TEAM_ID = `${SITE}/#florida-gators`;
const VENUE_ID = `${SITE}/#ben-hill-griffin-stadium`;
const SEC_ID = `${SITE}/#sec`;
const HOME_VENUE = { '@type': 'Place', '@id': VENUE_ID, name: 'Ben Hill Griffin Stadium', address: { '@type': 'PostalAddress', addressLocality: 'Gainesville', addressRegion: 'FL', addressCountry: 'US' } };
const SEC = { '@type': 'SportsOrganization', '@id': SEC_ID, name: 'Southeastern Conference' };
// Writer profile pages that exist on the site (sports-live/front-page.config.json columnists).
const WRITER_URLS = {
  'Buddy Martin': `${SITE}/gatorbait-media-blogs/tags/buddy-martin`,
  'Franz Beard': `${SITE}/gatorbait-media-blogs/tags/franz-beard`,
  'Loren Meadows': `${SITE}/gatorbait-media-blogs/tags/loren-meadows`,
};
const OPPONENT_ALIASES = { 'Florida Atlantic': ['florida atlantic', 'fau'], 'Ole Miss': ['ole miss', 'rebels'], 'Florida State': ['florida state', 'fsu', 'seminoles'], 'South Carolina': ['south carolina', 'gamecocks'], 'Texas': ['texas longhorns', ' texas ', 'longhorns'], 'Missouri': ['missouri', 'mizzou', 'tigers'], 'Georgia': ['georgia', 'bulldogs'], 'Oklahoma': ['oklahoma', 'sooners'], 'Kentucky': ['kentucky', 'wildcats'], 'Vanderbilt': ['vanderbilt', 'commodores'], 'Auburn': ['auburn'], 'Campbell': ['campbell'] };

export function kickoffKnown(game) {
  // ESPN marks TBA kickoffs as midnight ET, which lands at 04:00Z (EDT) or 05:00Z (EST); with no TV that is a placeholder.
  const t = String(game.date || '');
  const placeholder = /T0[45]:00:00Z$/.test(t);
  return !(placeholder && !game.tv);
}

export function gameStartDate(game) {
  if (!game.date) return null;
  if (kickoffKnown(game)) return game.date;
  const et = new Date(new Date(game.date).getTime() - 4 * 3600 * 1000); // shift to ET calendar day
  return et.toISOString().slice(0, 10);
}

export function gameName(game) {
  const opp = game.opponentRank ? `No. ${game.opponentRank} ${game.opponent}` : game.opponent;
  return game.home ? `${opp} at Florida Gators` : `Florida Gators at ${opp}`;
}

export function gameId(game) { return `${SITE}/#game-${game.eventId}`; }

// `standalone` inlines the shared venue/team/conference nodes (article pages have no @graph to reference);
// the homepage graph references them by @id so the embed stays small.
export function buildSportsEvent(game, { venueByEventId = {}, standalone = false } = {}) {
  const florida = standalone ? { '@type': 'SportsTeam', '@id': TEAM_ID, name: 'Florida Gators' } : { '@id': TEAM_ID };
  const opponent = { '@type': 'SportsTeam', name: game.opponent };
  const ev = {
    '@type': 'SportsEvent',
    '@id': gameId(game),
    name: gameName(game),
    sport: 'American Football',
    startDate: gameStartDate(game),
    eventStatus: 'https://schema.org/EventScheduled',
    homeTeam: game.home ? florida : opponent,
    awayTeam: game.home ? opponent : florida,
    organizer: standalone ? SEC : { '@id': SEC_ID },
    sameAs: `https://www.espn.com/college-football/game/_/gameId/${game.eventId}`,
  };
  if (game.home) ev.location = standalone ? HOME_VENUE : { '@id': VENUE_ID };
  else if (venueByEventId[game.eventId]) ev.location = { '@type': 'Place', name: venueByEventId[game.eventId] };
  if (game.status === 'final' && game.score) {
    const won = game.score.fla > game.score.opp;
    ev.description = `Final: Florida ${game.score.fla}, ${game.opponent} ${game.score.opp}. ${won ? 'Florida won' : 'Florida lost'}.`;
  } else if (game.tv && kickoffKnown(game)) {
    ev.description = `Kickoff ${new Date(game.date).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} ET on ${game.tv}.`;
  }
  if (game.storyUrl) ev.subjectOf = { '@id': game.storyUrl }; // exactly one canonical story, referenced by its URL
  return ev;
}

export function authorNode(name) {
  const n = String(name || '').trim() || 'GatorBait Staff';
  if (/staff/i.test(n)) return { '@type': 'Organization', '@id': ORG_ID, name: 'GatorBait Media' };
  const a = { '@type': 'Person', name: n };
  if (WRITER_URLS[n]) a.url = WRITER_URLS[n];
  return a;
}

export function articleStub(post) {
  const a = {
    '@type': 'NewsArticle',
    '@id': post.url,
    url: post.url,
    headline: String(post.title || '').slice(0, 110),
    datePublished: post.firstPublishedDate,
    author: authorNode(post.author),
    publisher: { '@id': ORG_ID },
  };
  if (post.image && post.image.src) a.image = post.image.src;
  return a;
}

export function pickLead(posts, now = new Date()) {
  const week = 7 * 86400 * 1000;
  const buddy = posts.find((p) => /buddy martin/i.test(p.author || '') && now - new Date(p.firstPublishedDate) < week);
  return buddy || posts[0];
}

export function orderStories(posts, now, limit = 8) {
  const sorted = [...posts].sort((a, b) => new Date(b.firstPublishedDate) - new Date(a.firstPublishedDate));
  const lead = pickLead(sorted, now);
  return [lead, ...sorted.filter((p) => p !== lead)].slice(0, limit); // lead first, then newest-first
}

export function buildHomepageGraph({ posts, scoreboard, now = new Date(), storyLimit = 6 }) {
  const venues = {};
  if (scoreboard.next && scoreboard.next.venue) venues[scoreboard.next.eventId] = scoreboard.next.venue;
  if (scoreboard.last && scoreboard.last.venue) venues[scoreboard.last.eventId] = scoreboard.last.venue;
  const games = (scoreboard.schedule || []).map((g) => buildSportsEvent(g, { venueByEventId: venues }));
  const stories = orderStories(posts, now, storyLimit);
  const graph = [
    { '@type': 'NewsMediaOrganization', '@id': ORG_ID, name: 'GatorBait Media', url: `${SITE}/`, foundingDate: '1980', sameAs: ['https://www.youtube.com/channel/UCtR8b1sKFuwaRjKy5BiXRvA', 'https://www.facebook.com/thebuddymartinshow', 'https://x.com/buddyshow'] },
    { '@type': 'WebSite', '@id': SITE_ID, url: `${SITE}/`, name: 'GatorBait Media', publisher: { '@id': ORG_ID } },
    { '@type': 'SportsTeam', '@id': TEAM_ID, name: 'Florida Gators', alternateName: 'Florida', sport: 'American Football', memberOf: { '@id': SEC_ID }, url: 'https://floridagators.com/', subjectOf: { '@id': `${SITE}/#webpage` } },
    SEC,
    HOME_VENUE,
    { '@type': 'CollectionPage', '@id': `${SITE}/#webpage`, url: `${SITE}/`, name: 'GatorBait Media | Florida Gators News, Recruiting & Analysis', isPartOf: { '@id': SITE_ID }, about: { '@id': TEAM_ID }, dateModified: now.toISOString(), mainEntity: { '@type': 'ItemList', name: 'Latest Florida Gators stories', itemListOrder: 'https://schema.org/ItemListOrderDescending', itemListElement: stories.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: articleStub(p) })) } },
    { '@type': 'ItemList', '@id': `${SITE}/#schedule-${scoreboard.season}`, name: `Florida Gators ${scoreboard.season} football schedule`, numberOfItems: games.length, itemListElement: games.map((g, i) => ({ '@type': 'ListItem', position: i + 1, item: g })) },
  ];
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function matchGame(post, scoreboard) {
  const hay = `${post.title} ${post.excerpt || ''} ${post.url}`.toLowerCase();
  const sched = scoreboard.schedule || [];
  const direct = sched.find((g) => g.storyUrl && g.storyUrl === post.url);
  if (direct) return direct;
  const hits = sched.filter((g) => (OPPONENT_ALIASES[g.opponent] || [g.opponent.toLowerCase()]).some((a) => hay.includes(a)));
  if (!hits.length) return null;
  // Prefer the game nearest the publish date (a Missouri preview written after the Ole Miss final maps to Missouri).
  const t = new Date(post.firstPublishedDate).getTime();
  return hits.sort((a, b) => Math.abs(new Date(a.date) - t) - Math.abs(new Date(b.date) - t))[0];
}

export function buildArticleEvent(post, scoreboard) {
  const game = matchGame(post, scoreboard);
  if (!game) return null;
  const venues = {};
  if (scoreboard.next && scoreboard.next.venue) venues[scoreboard.next.eventId] = scoreboard.next.venue;
  if (scoreboard.last && scoreboard.last.venue) venues[scoreboard.last.eventId] = scoreboard.last.venue;
  const ev = buildSportsEvent(game, { venueByEventId: venues, standalone: true });
  ev.subjectOf = articleStub(post); // the page itself is the one story for this event
  delete ev.subjectOf.publisher; // no @graph on the article page to resolve the publisher @id
  return { '@context': 'https://schema.org', ...ev };
}

export function toJsonLd(obj) { return JSON.stringify(obj).replace(/</g, '\\u003c'); }
export function toScriptTag(obj, id) { return `<script type="application/ld+json"${id ? ` id="${id}"` : ''}>${toJsonLd(obj)}</script>`; }
// Shape for Wix Blog seoData.tags (see deploy/writer-attributions/before/*.json for the native NewsArticle tag).
export function toWixSeoTag(obj) { return { type: 'script', props: { type: 'application/ld+json' }, children: toJsonLd(obj), custom: true, disabled: false }; }

const REQUIRED = {
  SportsEvent: ['name', 'startDate', 'homeTeam', 'awayTeam', 'eventStatus'],
  NewsArticle: ['headline', 'url', 'datePublished', 'author'],
  NewsMediaOrganization: ['name', 'url'], WebSite: ['url', 'name'], SportsTeam: ['name'], CollectionPage: ['url', 'mainEntity'], ItemList: ['itemListElement'],
};
export function validate(doc) {
  const errors = [];
  const nodes = doc['@graph'] ? doc['@graph'] : [doc];
  if (doc['@context'] !== 'https://schema.org') errors.push('missing @context');
  const walk = (n, path) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach((x, i) => walk(x, `${path}[${i}]`));
    const t = n['@type'];
    if (t && REQUIRED[t]) for (const k of REQUIRED[t]) if (n[k] === undefined || n[k] === null || n[k] === '') errors.push(`${path}: ${t} missing ${k}`);
    if (t === 'SportsEvent') {
      if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/.test(n.startDate)) errors.push(`${path}: bad startDate ${n.startDate}`);
      if (Array.isArray(n.subjectOf)) errors.push(`${path}: more than one canonical story`);
      if (n.subjectOf && !(n.subjectOf['@id'] || n.subjectOf.url)) errors.push(`${path}: subjectOf has no url`);
      if (n.homeTeam && n.awayTeam && n.homeTeam.name === n.awayTeam.name) errors.push(`${path}: team plays itself`);
    }
    if (t === 'NewsArticle' && n.author && !n.author.name && !n.author['@id']) errors.push(`${path}: blank author`);
    for (const [k, v] of Object.entries(n)) if (k !== '@type' && typeof v === 'object') walk(v, `${path}.${k}`);
  };
  nodes.forEach((n, i) => walk(n, `graph[${i}]`));
  return { ok: errors.length === 0, errors };
}

export function loadInputs(repo) {
  const posts = JSON.parse(readFileSync(join(repo, 'gazette-live/posts.json'), 'utf8')).posts;
  const scoreboard = JSON.parse(readFileSync(join(repo, 'sports-live/scoreboard.json'), 'utf8'));
  return { posts, scoreboard };
}

export function generate({ posts, scoreboard, now = new Date() }) {
  const homepage = buildHomepageGraph({ posts, scoreboard, now });
  const embed = `<!-- GBM_SEO_GAME_GRAPH generated ${now.toISOString()} from gazette-live/posts.json + sports-live/scoreboard.json (${scoreboard.updatedAt}) -->\n${toScriptTag(homepage, 'gbm-game-graph')}`;
  const articles = posts.map((p) => ({ post: p, event: buildArticleEvent(p, scoreboard) })).filter((x) => x.event);
  return { homepage, embed, articles };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const here = dirname(fileURLToPath(import.meta.url));
  const repo = join(here, '..', '..', '..');
  const args = process.argv.slice(2);
  const opt = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
  const out = opt('--out', join(here, 'out'));
  const now = new Date(opt('--now', new Date().toISOString()));
  const { posts, scoreboard } = loadInputs(repo);
  const { homepage, embed, articles } = generate({ posts, scoreboard, now });
  mkdirSync(out, { recursive: true });
  const v = validate(homepage);
  const index = { generatedAt: now.toISOString(), scoreboardUpdatedAt: scoreboard.updatedAt, feedNewest: posts[0] && posts[0].firstPublishedDate, homepageValid: v.ok, errors: v.errors, embedChars: embed.length, wixEmbedMax: WIX_EMBED_MAX, budget: EMBED_BUDGET, articles: [] };
  writeFileSync(join(out, 'homepage-graph.json'), JSON.stringify(homepage, null, 2) + '\n');
  writeFileSync(join(out, 'homepage-embed.html'), embed + '\n');
  for (const { post, event } of articles) {
    const av = validate(event);
    const slug = post.url.split('/post/')[1].slice(0, 60);
    writeFileSync(join(out, `article-${slug}.json`), JSON.stringify({ url: post.url, author: post.author, wixSeoTag: toWixSeoTag(event), jsonld: event }, null, 2) + '\n');
    index.articles.push({ url: post.url, author: post.author, game: event.name, startDate: event.startDate, valid: av.ok, errors: av.errors, tagChars: toScriptTag(event).length });
    if (!av.ok) v.errors.push(...av.errors.map((e) => `${slug}: ${e}`));
  }
  writeFileSync(join(out, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  console.log(`homepage graph: ${homepage['@graph'].length} nodes, embed ${embed.length} chars (budget ${EMBED_BUDGET}, Wix max ${WIX_EMBED_MAX}); ${articles.length}/${posts.length} stories matched to a game; valid=${v.ok && embed.length <= EMBED_BUDGET}`);
  if (v.errors.length) console.error(v.errors.join('\n'));
  if (!v.ok || embed.length > EMBED_BUDGET) process.exit(1);
}
