#!/usr/bin/env node
// Renders the Florida-Georgia (Oct. 31, 2026) score graphic to 1080x1350 PNG via Playwright.
// Local-only: reads JSON / ESPN, writes PNGs. It never uploads, posts or touches Wix.
//
//   node render-score.mjs --phase pregame
//   node render-score.mjs --phase halftime --fla 10 --uga 14
//   node render-score.mjs --phase final --fla 24 --uga 27
//   node render-score.mjs --phase final --espn                 # live ESPN summary feed
//   node render-score.mjs --phase halftime --espn-file ./summary.json   # saved ESPN JSON
//   node render-score.mjs --all --fla 10 --uga 14              # pregame + halftime + final(with same scores; test only)
// Options: --data file.json (base data, default scoreboard-2026-10-31-georgia.json)
//          --out dir (default ./out)  --period N  --clock "5:12"  --check-widths (also screenshots at 390 and 1080 and reports overflow)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=401856734';

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const k = a.slice(2), nx = process.argv[i + 1];
  if (nx === undefined || nx.startsWith('--')) args[k] = true; else { args[k] = nx; i++; }
}

async function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright', ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean).map(p => path.join(p, 'playwright'))];
  for (const t of tries) { try { return require(t); } catch {} }
  throw new Error('Playwright not found. Run: npm i -D playwright && npx playwright install chromium');
}

const rankOf = r => (Number.isFinite(+r) && +r >= 1 && +r <= 25 ? +r : null);
function fromEspn(j) {
  const c = j.header.competitions[0], st = c.status || j.header.status || {};
  const side = ha => {
    const t = c.competitors.find(x => x.homeAway === ha);
    const rec = (t.record || []).find(r => r.type === 'total' || r.name === 'overall') || (t.record || [])[0] || {};
    return { name: t.team.location || t.team.shortDisplayName, rank: rankOf(t.rank), record: rec.displayValue || rec.summary || null,
      score: t.score === undefined || t.score === '' ? null : Number(t.score), ls: (t.linescores || []).map(l => l.displayValue ?? l.value) };
  };
  const away = side('away'), home = side('home');
  const bc = (c.broadcasts || []).find(b => b.type?.shortName === 'TV') || (c.broadcasts || [])[0];
  return { away, home, state: st.type?.state, name: st.type?.name, period: st.period ?? null, clock: st.displayClock ?? null,
    network: bc?.media?.shortName || null };
}

async function getEspn() {
  if (args['espn-file']) return JSON.parse(fs.readFileSync(args['espn-file'], 'utf8'));
  const r = await fetch(ESPN_URL, { signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`ESPN returned HTTP ${r.status}`);
  return r.json();
}

const base = JSON.parse(fs.readFileSync(path.resolve(args.data || path.join(here, 'scoreboard-2026-10-31-georgia.json')), 'utf8'));
const outDir = path.resolve(args.out || path.join(here, 'out'));
fs.mkdirSync(outDir, { recursive: true });

let espn = null;
if (args.espn || args['espn-file']) {
  try { espn = fromEspn(await getEspn()); }
  catch (e) { console.error(`ESPN unavailable (${e.message}). Pass --fla/--uga, or --espn-file <saved summary JSON>.`); process.exit(2); }
}

function build(phase) {
  const d = JSON.parse(JSON.stringify(base));
  d.phase = phase;
  if (espn) {
    for (const s of ['away', 'home']) { d[s].rank = espn[s].rank ?? d[s].rank; d[s].record = espn[s].record ?? d[s].record; d[s].score = espn[s].score; }
    d.linescores = { away: espn.away.ls, home: espn.home.ls };
    d.network = espn.network || d.network;
    d.status = { state: espn.state, period: espn.period, clock: espn.clock };
  }
  if (args.fla !== undefined) d.away.score = Number(args.fla);
  if (args.uga !== undefined) d.home.score = Number(args.uga);
  if (args.period) d.status.period = Number(args.period);
  if (args.clock) d.status.clock = String(args.clock);
  if (phase === 'pregame') { d.away.score = null; d.home.score = null; }
  else if (!Number.isFinite(d.away.score) || !Number.isFinite(d.home.score) || d.away.score == null || d.home.score == null) {
    console.error(`Phase "${phase}" needs scores: pass --fla N --uga N, or --espn / --espn-file.`); process.exit(2);
  }
  // Ranks and records are pregame facts; after kickoff keep what ESPN reports, never invent a post-game rank.
  if (phase === 'final') { d.away.record = espn ? d.away.record : null; d.home.record = espn ? d.home.record : null; }
  return d;
}

const phases = args.all ? ['pregame', 'halftime', 'final'] : [args.phase || 'pregame'];
const pw = await loadPlaywright();
const browser = await pw.chromium.launch();
const pageUrl = pathToFileURL(path.join(here, 'score-graphic-2026-10-31-georgia.html')).href;
const report = [];
for (const phase of phases) {
  if (!['pregame', 'halftime', 'final', 'live'].includes(phase)) { console.error(`Unknown phase ${phase}`); process.exit(2); }
  const data = build(phase);
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript(d => { window.__SCORE__ = d; }, data);
  await page.goto(pageUrl);
  await page.waitForSelector('body[data-ready="1"]', { timeout: 15000 });
  const file = path.join(outDir, `${phase}-2026-10-31-georgia.png`);
  await page.locator('#c').screenshot({ path: file });
  console.log(`wrote ${file}`);
  if (args['check-widths']) {
    for (const w of [1080, 390]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(100);
      const r = await page.evaluate(() => {
        const c = document.getElementById('c').getBoundingClientRect(), bad = [];
        document.querySelectorAll('#c *').forEach(el => { const b = el.getBoundingClientRect(); if (b.width && (b.right > c.right + 1 || b.left < c.left - 1 || el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).display !== 'inline')) bad.push(el.className || el.tagName); });
        return { docW: document.documentElement.scrollWidth, vw: innerWidth, bad };
      });
      const ok = r.docW <= r.vw && r.bad.length === 0;
      report.push(`${phase} @${w}: docW=${r.docW} vw=${r.vw} ${ok ? 'OK' : 'OVERFLOW ' + r.bad.join(',')}`);
      if (args.shots) await page.screenshot({ path: path.join(outDir, `${phase}-w${w}.png`) });
    }
  }
  await ctx.close();
}
await browser.close();
if (report.length) console.log(report.join('\n'));
