#!/usr/bin/env node
// automation/kickoff-watch.mjs
//
// Kickoff Watch: read-only game-day watchdog for the GatorBait homepage.
//
// Run by .github/workflows/kickoff-watch.yml every 10 minutes on Saturdays. Reads the homepage the
// way a reader does (plain HTTPS, real Chrome user agent, no query string), then the Pages build
// pointer, the bundle at that commit on jsDelivr and scoreboard.json. Compares the Pages copies with
// main (the sparse checkout) so a Pages build that never ran shows up as "Pages behind main".
//
//   node automation/kickoff-watch.mjs            # exits 0 in a second outside a game window
//   node automation/kickoff-watch.mjs --force    # run the checks now, whatever the schedule says
//   node automation/kickoff-watch.mjs --post     # comment on issue #34 on failure (needs GH_TOKEN)
//
// Without --post it prints the comment it would have posted. Exit 1 when a check fails, so the run is
// red either way. No Wix API, no email, no subscriber data, and the token is never printed.

import { readFileSync, appendFileSync } from 'node:fs';

const SITE = 'https://www.gatorbaitmedia.com/';
const PAGES = 'https://presidente49.github.io/gatorbait-media-redesign/';
const JSD = 'https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@';
const REPO = process.env.GITHUB_REPOSITORY || 'Presidente49/gatorbait-media-redesign';
const ISSUE = process.env.WATCH_ISSUE || '34';
const TOKEN = process.env.GH_TOKEN || '';
const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const POST = args.has('--post');
const BEFORE_H = 1, AFTER_H = 5;   // same window as automation/scoreboard_feed.py
const STALE_MIN = 30;              // scoreboard.json older than this during a game is a failure
const SLOW_S = 8;                  // homepage slower than this is a failure
const LOOKBACK_H = 8;              // how far back to look on #34 before repeating a report
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const RUN_URL = process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${REPO}/actions/runs/${process.env.GITHUB_RUN_ID}` : null;

const now = new Date();
const readJson = p => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };
const mins = (a, b) => Math.round((a - b) / 60000);
const short = c => (c || '').slice(0, 7);
// AP style clock in Eastern time: "4:10 p.m. ET".
const et = d => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' })
  .format(d).replace(' AM', ' a.m.').replace(' PM', ' p.m.') + ' ET';
function djb2(s) { let h = 5381; for (const ch of s) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0; return h.toString(36); }

// ---------- game window (no network) ----------
const local = readJson('sports-live/scoreboard.json');
function gameWindow(sb) {
  for (const g of sb?.schedule || []) {
    const kick = Date.parse(g.date);
    if (!Number.isFinite(kick)) continue;
    const h = (now - kick) / 36e5;
    const open = !['final', 'canceled', 'postponed'].includes(g.status) && h >= -BEFORE_H && h <= AFTER_H;
    if (g.status === 'in-progress' || open) return { ...g, kick };
  }
  return null;
}
const game = gameWindow(local);
if (!game && !FORCE) { console.log('kickoff-watch: not in a game window; nothing read.'); process.exit(0); }
const matchup = game ? `Florida ${game.home ? 'vs.' : 'at'} ${game.opponent}` : 'no game window (forced run)';
console.log(`kickoff-watch: ${matchup}, ${et(now)}`);

// ---------- fetch helper ----------
async function get(url, { timeout = 15000 } = {}) {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Cache-Control': 'no-cache' }, cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(timeout) });
    const text = await r.text();
    let json = null; try { json = JSON.parse(text); } catch {}
    return { ok: r.ok, status: r.status, s: (Date.now() - t0) / 1000, text, json };
  } catch (e) {
    return { ok: false, status: 0, s: (Date.now() - t0) / 1000, text: '', json: null, error: String(e?.cause?.message || e?.message || e).slice(0, 100) };
  }
}

// ---------- checks ----------
const checks = [];
const add = (name, ok, detail, next) => { checks.push({ name, ok, detail, next }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`); };

// 1. Homepage as readers get it.
const home = await get(SITE, { timeout: 20000 });
const html = home.text || '';
if (!home.ok) add('Homepage', false, `Wix answered ${home.status || home.error} after ${home.s.toFixed(1)} s`,
  'Open gatorbaitmedia.com on a phone. If it is down for readers too, this is Wix, not our code; wait one tick before acting.');
else if (home.s > SLOW_S) add('Homepage', false, `200, but ${home.s.toFixed(1)} s to load against a ${SLOW_S} s budget`,
  'Slow from one runner is not proof. If the next tick agrees, note it on #34 and leave the build alone.');
else add('Homepage', true, `200 in ${home.s.toFixed(1)} s`);

// 2. The V3 loader must be in the served HTML (Wix edges kept an older embed for 30 to 45 minutes on Sept. 30).
const loader = (html.match(/GBM_HOME_CODE_V3 front-page-2026 src=([0-9a-f]{7,})/) || [])[1] || null;
let readmePin = null;
try {
  const revs = [...readFileSync('deploy/front-page-2026/README.md', 'utf8').matchAll(/^- rev \d+:.*?home-code-loader-([0-9a-f]{7,})\.html/gm)];
  if (revs.length) readmePin = revs[revs.length - 1][1];
} catch {}
if (home.ok) {
  if (!loader) add('Home Code loader', false, 'the V3 loader is not in the HTML readers get; Wix is serving an older Home Code revision or the Gazette body',
    'GET embed 622d8ece and compare its revision with the last one recorded in deploy/front-page-2026/README.md. Rollback is one PATCH, documented there.');
  else {
    const drift = readmePin && !readmePin.startsWith(loader) && !loader.startsWith(readmePin);
    add('Home Code loader', true, `V3 loader served, baked fallback ${loader}` + (drift ? ` (README records ${readmePin}; unrecorded change or edge lag)` : ''));
  }
  const shell = ['fonts.googleapis.com/css2?family=Archivo', 'background-color: #1c1f2e'].filter(m => html.includes(m));
  if (shell.length) add('Old shell', false, `retired-shell marker in served HTML: ${shell.join(', ')}`,
    'The same markers site_health_check.py forbids. The old Wix shell is reaching readers; treat as a Home Code regression.');
}

// 3. Build pointer: Pages must serve the current.json that is on main.
const ptr = await get(PAGES + 'sports-live/current.json?t=' + Date.now());
const mainPtr = readJson('sports-live/current.json');
const pagesCommit = /^[0-9a-f]{40}$/.test(ptr.json?.commit || '') ? ptr.json.commit : null;
if (!pagesCommit) add('Build pointer', false, `Pages did not serve a valid current.json (${ptr.status || ptr.error}); the loader is running its baked fallback`,
  'Readers see the fallback build, not the newest one. Check the pages-build-deployment runs.');
else if (mainPtr?.commit && mainPtr.commit !== pagesCommit) add('Build pointer', false,
  `Pages serves ${short(pagesCommit)}, main has ${short(mainPtr.commit)} (committed ${mins(now, Date.parse(mainPtr.updated))} min ago)`,
  `Pages is behind main. If the next tick agrees, request a build: gh api -X POST repos/${REPO}/pages/builds (the call refresh-newsroom-feed already makes).`);
else add('Build pointer', true, `Pages and main agree on ${short(pagesCommit)}`);

// 4. The bundle at that commit must be downloadable from jsDelivr.
const commit = pagesCommit || mainPtr?.commit || null;
if (commit) {
  const b = await get(JSD + commit + '/sports-live/homepage.js');
  if (!b.ok || !b.text.includes('data-fp-build')) add('Front-page bundle', false,
    `jsDelivr ${b.status || b.error} for homepage.js@${short(commit)}` + (b.ok ? ' (no build stamp in the file)' : ''),
    'The loader falls back to its baked commit, so readers still get a homepage. Point current.json at a known-good commit (deploy/front-page-2026/README.md).');
  else add('Front-page bundle', true, `homepage.js@${short(commit)} served, ${Math.round(b.text.length / 1024)} KB`);
}

// 5. Scoreboard freshness during the game, and whether Pages lags main.
const sb = await get(PAGES + 'sports-live/scoreboard.json?t=' + Date.now());
const pagesUpd = Date.parse(sb.json?.updatedAt || '');
const mainUpd = Date.parse(local?.updatedAt || '');
if (!sb.ok || !Number.isFinite(pagesUpd)) add('Scoreboard feed', false, `Pages did not serve scoreboard.json (${sb.status || sb.error})`,
  'The Road Ahead paints from the bundled schedule, so the page renders; the live score will not move.');
else {
  const age = mins(now, pagesUpd);
  const behind = Number.isFinite(mainUpd) && mainUpd - pagesUpd > 60000;
  const g = (sb.json.schedule || []).find(x => x.eventId === game?.eventId);
  const score = g?.score ? `, ${g.status} ${g.score.fla}-${g.score.opp}` : '';
  if (game && age > STALE_MIN) add('Scoreboard feed', false,
    `updatedAt is ${age} min old during the game` + (behind ? `; main is newer (${mins(now, mainUpd)} min), so Pages is behind` : '; main is just as old, so refresh-newsroom-feed has not written'),
    behind ? 'Request a Pages build (see Build pointer).' : 'Open the Refresh GatorBait publication feeds runs. GitHub delays or skips busy cron ticks; dispatch it by hand to force an ESPN read.');
  else add('Scoreboard feed', true, `updatedAt ${age} min old${score}`);
}

// ---------- report ----------
const fails = checks.filter(c => !c.ok);
const names = fails.map(c => c.name).sort();
const sig = djb2(names.join('|'));
const slug = names.map(n => n.toLowerCase().replace(/\s+/g, '-')).join(',') || 'none';
const ev = game?.eventId || 'forced';
const row = c => `| ${c.name} | ${c.ok ? 'PASS' : '**FAIL**'} | ${c.detail} |`;
const table = ['| Check | Result | Detail |', '|---|---|---|', ...checks.map(row)].join('\n');
const foot = `Read-only run; nothing was changed. Next tick in 10 minutes.${RUN_URL ? ` [Run log](${RUN_URL})` : ''}`;

const failBody = () => [
  `<!-- gbm-kickoff-watch event=${ev} state=fail sig=${sig} checks=${slug} -->`,
  `**Kickoff Watch: ${fails.length} of ${checks.length} homepage checks failed** — ${matchup}, ${et(now)}`, '',
  table, '', '**Next step**', ...fails.map(c => `- ${c.name}: ${c.next}`), '', foot,
].join('\n');
const okBody = prior => [
  `<!-- gbm-kickoff-watch event=${ev} state=ok sig=${sig} checks=${slug} -->`,
  `**Kickoff Watch: all ${checks.length} checks pass again** — ${matchup}, ${et(now)}. Earlier failure: ${(prior.checks || '').split(',').join(', ') || 'see above'}. ${foot}`,
].join('\n');

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Kickoff Watch · ${matchup} · ${et(now)}\n\n${table}\n\n${fails.length ? fails.length + ' failure(s).' : 'All clear; nothing posted.'}\n`);
}

// ---------- #34, only on failure and only once per signature ----------
const API = `https://api.github.com/repos/${REPO}/issues/${ISSUE}/comments`;
const headers = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10', 'User-Agent': 'gatorbait-kickoff-watch' };
async function priorReports() {
  if (!TOKEN) return [];
  try {
    const since = new Date(now - LOOKBACK_H * 36e5).toISOString();
    const r = await fetch(`${API}?since=${since}&per_page=100`, { headers, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return [];
    return (await r.json()).map(c => {
      const m = (c.body || '').match(/<!-- gbm-kickoff-watch event=(\S+) state=(\S+) sig=(\S+) checks=(\S+) -->/);
      return m && m[1] === ev ? { state: m[2], sig: m[3], checks: m[4] } : null;
    }).filter(Boolean);
  } catch { return []; }
}
async function post(body) {
  if (!POST || !TOKEN) { console.log(`\n--- comment for #${ISSUE} (not posted: ${POST ? 'no token' : '--post not set'}) ---\n${body}`); return; }
  const r = await fetch(API, { method: 'POST', headers, body: JSON.stringify({ body }), signal: AbortSignal.timeout(15000) });
  console.log(r.ok ? `posted to #${ISSUE}` : `comment failed: HTTP ${r.status}`);
}

const prior = await priorReports();
const last = prior[prior.length - 1];
if (fails.length) {
  if (prior.some(p => p.state === 'fail' && p.sig === sig)) console.log(`same failure already on #${ISSUE} within ${LOOKBACK_H} h; not repeating`);
  else await post(failBody());
} else if (last?.state === 'fail') {
  await post(okBody(last));
} else {
  console.log('all clear; nothing posted');
}
process.exit(fails.length ? 1 : 0);
