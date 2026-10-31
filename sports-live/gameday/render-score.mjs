#!/usr/bin/env node
// Renders the Florida-Georgia (Oct. 31, 2026) score graphic to a 1080x1350 PNG via Playwright.
// Local-only: reads JSON / ESPN, writes PNGs. It never uploads, posts or touches Wix.
//
// Desk usage is one command: deploy/gameday-live-20261031/render-now.sh <phase> <espn-json-file>  (see its README).
// Direct usage:
//   node render-score.mjs --phase pregame  --espn-file espn.json
//   node render-score.mjs --phase live     --espn-file espn.json
//   node render-score.mjs --phase halftime --espn-file espn.json
//   node render-score.mjs --phase final    --espn-file espn.json
//   node render-score.mjs --phase final --espn                       # fetch ESPN directly (only where ESPN is reachable)
//   node render-score.mjs --phase final --fla 24 --uga 27            # manual fallback, no ESPN check
//   node render-score.mjs --all --test --fla 10 --uga 14             # TEST smoke render of all four phases
// Options: --data file.json (base data, default scoreboard-2026-10-31-georgia.json)
//          --out dir (default ./out; TEST renders default to the OS temp dir)  --period N  --clock "5:12"
//          --preview (also write a 390 px wide phone-size PNG)  --check-widths (overflow report at 1080 and 390)
//          --test (fabricated data: stamps TEST on the pixels, prefixes TEST- on file names)
//          --force (skip the ESPN phase/state gate only; never skips the layout and font audits)
// ESPN files may be the raw summary JSON, just {"header": ...}, or a saved Firecrawl result whose markdown is the JSON.
// A top-level "_test_fixture" key in the JSON forces --test automatically.
// Exit codes: 2 bad input or wrong game, 3 layout/font audit failed, 4 ESPN state does not match the phase.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=401856734';
const BOOL = new Set(['espn', 'all', 'check-widths', 'preview', 'test', 'force']);

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const k = a.slice(2), nx = process.argv[i + 1];
  if (BOOL.has(k) || nx === undefined || nx.startsWith('--')) args[k] = true; else { args[k] = nx; i++; }
}
const die = (code, msg) => { console.error(msg); process.exit(code); };

async function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright', ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean).map(p => path.join(p, 'playwright'))];
  for (const t of tries) { try { return require(t); } catch {} }
  throw new Error('Playwright not found. Run: npm i -D playwright && npx playwright install chromium');
}

// ---------- ESPN ----------
function parseLoose(text) {
  let t = text.trim();
  const fence = t.match(/^```(?:json)?\s*\n([\s\S]*?)\n?```\s*$/);
  if (fence) t = fence[1];
  const j = JSON.parse(t);
  if (j && typeof j.markdown === 'string' && !j.header) return parseLoose(j.markdown); // raw Firecrawl result file
  return j;
}
const num = v => (v === undefined || v === null || v === '' || !Number.isFinite(Number(v))) ? null : Number(v);
const rankOf = r => (Number.isFinite(+r) && +r >= 1 && +r <= 25 ? +r : null);

const AP_MONTH = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
function apKick(iso) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date(iso)).map(x => [x.type, x.value]));
  const h = +p.hour, m = +p.minute;
  const time = h === 12 && m === 0 ? 'noon ET' : h === 0 && m === 0 ? 'midnight ET'
    : `${h % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'a.m.' : 'p.m.'} ET`;
  return { time, date: `${p.weekday}, ${AP_MONTH[+p.month - 1]} ${+p.day}` };
}

function fromEspn(j) {
  const hdr = j && j.header, c = hdr && hdr.competitions && hdr.competitions[0];
  if (!c) throw new Error('not an ESPN summary: header.competitions[0] is missing (save the full summary JSON, or at least its "header" object)');
  const st = c.status || hdr.status || {}, type = st.type || {};
  const side = ha => {
    const t = (c.competitors || []).find(x => x.homeAway === ha);
    if (!t) throw new Error(`ESPN data has no ${ha} competitor`);
    const rec = (t.record || []).find(r => r.type === 'total' || r.name === 'overall') || (t.record || [])[0] || {};
    return { name: t.team.location || t.team.shortDisplayName || t.team.displayName, rank: rankOf(t.rank), record: rec.displayValue || rec.summary || null,
      score: num(t.score), ls: (t.linescores || []).map(l => l.displayValue ?? l.value) };
  };
  const bc = (c.broadcasts || []).find(b => b.type?.shortName === 'TV') || (c.broadcasts || [])[0];
  const v = (j.gameInfo || {}).venue || {};
  return { eventId: String(hdr.id || ''), away: side('away'), home: side('home'),
    state: type.state || null, name: type.name || null, detail: type.detail || null, completed: type.completed,
    period: st.period ?? null, clock: st.displayClock ?? null, network: bc?.media?.shortName || null,
    kickoffIso: c.dateValid === false ? null : (c.date || null), venue: v.fullName || null, city: v.address?.city || null,
    test: !!(j._test_fixture || j.test_fixture) };
}

// ESPN's own status must agree with the card being rendered. A Final card from a live game is the worst mistake available here.
function gate(phase, e) {
  const n = e.name || '', s = e.state, bad = [];
  if (/DELAY|POSTPON|CANCEL|SUSPEND|FORFEIT|RAIN/.test(n)) bad.push(`ESPN status is ${n} (${e.detail || 'no detail'}). Tell the controller; no card until the game is back on.`);
  const atHalf = n === 'STATUS_HALFTIME' || (s === 'in' && e.period === 2 && n === 'STATUS_END_PERIOD' && /^0?[:.]?0+$/.test(String(e.clock || '').replace(/[:.]/g, '')));
  if (phase === 'pregame' && s !== 'pre') bad.push(`ESPN says the game is not pregame (state "${s}", ${n}). A pregame card would be wrong now.`);
  if (phase === 'live' && !(s === 'in' && !atHalf)) bad.push(`ESPN state is "${s}" ${n}${atHalf ? ' (halftime: use the halftime card)' : ''}. A live card needs a game in progress.`);
  if (phase === 'halftime' && !atHalf) bad.push(`ESPN is not at halftime (state "${s}", ${n}, period ${e.period}, clock ${e.clock}). Wait for STATUS_HALFTIME.`);
  if (phase === 'final' && !(s === 'post' && e.completed !== false)) bad.push(`ESPN does not say final (state "${s}", ${n}, period ${e.period}, clock ${e.clock}). Do not render a Final card yet.`);
  return bad;
}

async function getEspn() {
  if (args['espn-file']) {
    const f = path.resolve(String(args['espn-file']));
    if (!fs.existsSync(f)) die(2, `ESPN file not found: ${f}`);
    const raw = fs.readFileSync(f, 'utf8');
    return { json: parseLoose(raw), src: f, sha: crypto.createHash('sha256').update(raw).digest('hex') };
  }
  const r = await fetch(ESPN_URL, { signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`ESPN returned HTTP ${r.status}`);
  const raw = await r.text();
  return { json: parseLoose(raw), src: ESPN_URL, sha: crypto.createHash('sha256').update(raw).digest('hex') };
}

// ---------- data ----------
const base = JSON.parse(fs.readFileSync(path.resolve(args.data || path.join(here, 'scoreboard-2026-10-31-georgia.json')), 'utf8'));
let espn = null, espnSrc = null;
if (args.espn || args['espn-file']) {
  try {
    const g = await getEspn(); espnSrc = { src: g.src, sha: g.sha }; espn = fromEspn(g.json);
  } catch (e) { die(2, `ESPN data unusable (${e.message}). Pass --espn-file <saved summary JSON>, or --fla/--uga for the manual fallback.`); }
  if (espn.eventId && base.eventId && espn.eventId !== String(base.eventId)) die(2, `Wrong game: ESPN event ${espn.eventId}, this kit is for ${base.eventId}.`);
}
const test = !!(args.test || (espn && espn.test));
const notes = [];
if (args.all && !test) die(2, '--all puts the same scores on every card, so it is TEST-only. Add --test.');
const phases = args.all ? ['pregame', 'live', 'halftime', 'final'] : [args.phase || 'pregame'];
for (const p of phases) if (!['pregame', 'halftime', 'final', 'live'].includes(p)) die(2, `Unknown phase ${p}. Use pregame, live, halftime or final.`);

if (espn && !args.all) {
  const bad = gate(phases[0], espn);
  if (bad.length && !args.force) die(4, bad.map(b => 'REFUSED: ' + b).join('\n') + '\n(--force skips this check; only if the controller confirms the real game state.)');
  if (bad.length) notes.push('FORCED past ESPN gate: ' + bad.join(' | '));
}

function build(phase) {
  const d = JSON.parse(JSON.stringify(base));
  d.phase = phase; d.test = test;
  if (espn) {
    for (const s of ['away', 'home']) { d[s].rank = espn[s].rank; d[s].record = espn[s].record ?? (phase === 'final' ? null : d[s].record); d[s].score = espn[s].score; }
    d.linescores = { away: espn.away.ls, home: espn.home.ls };
    d.network = espn.network || d.network;
    d.status = { state: espn.state, period: espn.period, clock: espn.clock };
    if (espn.kickoffIso) {
      const k = apKick(espn.kickoffIso);
      if (k.time !== d.kickoff || k.date !== d.date) notes.push(`Kickoff from ESPN (${k.time}, ${k.date}) replaces the saved card text (${d.kickoff}, ${d.date}).`);
      d.kickoff = k.time; d.date = k.date;
    }
    if (espn.venue) d.venue = espn.venue;
    if (espn.city) d.city = espn.city;
  }
  if (args.fla !== undefined) d.away.score = num(args.fla);
  if (args.uga !== undefined) d.home.score = num(args.uga);
  if (args.period) d.status.period = Number(args.period);
  if (args.clock) d.status.clock = String(args.clock);
  if (phase === 'pregame') { d.away.score = null; d.home.score = null; }
  else if (d.away.score == null || d.home.score == null) die(2, `Phase "${phase}" needs scores: pass --espn-file <ESPN JSON> (best), or --fla N --uga N.`);
  if (phase === 'final') {
    // Records are pregame facts until ESPN updates them. A record equal to the pregame one on a final card is stale, so leave it off.
    for (const s of ['away', 'home']) {
      if (!espn) d[s].record = null;
      else if (d[s].record && d[s].record === base[s].record) { notes.push(`${d[s].name} record still shows the pregame ${d[s].record} on ESPN; left off the Final card.`); d[s].record = null; }
    }
  }
  return d;
}

// ---------- render ----------
const outDir = path.resolve(args.out || (test ? path.join(os.tmpdir(), 'gatorbait-gameday-TEST') : path.join(here, 'out')));
fs.mkdirSync(outDir, { recursive: true });
const pw = await loadPlaywright();
const browser = await pw.chromium.launch();
const pageUrl = pathToFileURL(path.join(here, 'score-graphic-2026-10-31-georgia.html')).href;

async function openCard(data, dsf = 1, vw = 1080, vh = 1350) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dsf });
  const page = await ctx.newPage();
  await page.addInitScript(d => { window.__SCORE__ = d; }, data);
  await page.goto(pageUrl);
  await page.waitForSelector('body[data-ready="1"]', { timeout: 15000 }).catch(async () => { throw new Error('card did not render: ' + await page.evaluate(() => document.body.dataset.error || 'timeout')); });
  return { ctx, page };
}

// Every glyph on the card must come from Barlow Condensed. A missing font file silently falls back to a system face; this catches it.
async function fontsUsed(ctx, page) {
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '#c, #c *' });
  const seen = new Map();
  for (const nodeId of nodeIds) {
    let r; try { r = await cdp.send('CSS.getPlatformFontsForNode', { nodeId }); } catch { continue; }
    for (const f of r.fonts || []) { const k = `${f.familyName}${f.isCustomFont ? '' : ' [system]'}`; seen.set(k, (seen.get(k) || 0) + f.glyphCount); }
  }
  return seen;
}

const receipts = [];
for (const phase of phases) {
  const data = build(phase);
  let card;
  try { card = await openCard(data); }
  catch (e) { await browser.close(); die(3, `REFUSED: ${phase} card could not render (${e.message}). Check that sports-live/gameday/fonts/ still holds BarlowCondensed-700.ttf and -800.ttf.`); }
  const { ctx, page } = card;
  const audit = JSON.parse(await page.evaluate(() => document.body.dataset.audit || '[]'));
  const fonts = await fontsUsed(ctx, page);
  const fontNames = [...fonts.keys()];
  const fontOk = fontNames.length > 0 && fontNames.every(n => /^Barlow Condensed/.test(n) && !n.includes('[system]'));
  if (audit.length || !fontOk) {
    await ctx.close(); await browser.close();
    die(3, `REFUSED: ${phase} card failed its checks.\n` + (audit.length ? '  layout: ' + audit.join('; ') + '\n' : '') + (fontOk ? '' : '  fonts: ' + (fontNames.join(', ') || 'none detected') + ' (only Barlow Condensed allowed)\n'));
  }
  const stem = `${test ? 'TEST-' : ''}${phase}-2026-10-31-georgia`;
  const file = path.join(outDir, `${stem}.png`);
  await page.locator('#c').screenshot({ path: file });
  console.log(`wrote ${file}`);
  if (args.preview) {
    const pv = await openCard(data, 390 / 1080);
    const pf = path.join(outDir, `${stem}-390.png`);
    await pv.page.locator('#c').screenshot({ path: pf });
    await pv.ctx.close();
    console.log(`wrote ${pf}`);
  }
  if (args['check-widths']) {
    for (const w of [1080, 390]) {
      await page.setViewportSize({ width: w, height: Math.round(1350 * Math.min(1, w / 1080)) });
      await page.waitForTimeout(120);
      const r = await page.evaluate(() => ({ docW: document.documentElement.scrollWidth, vw: innerWidth, audit: JSON.parse(document.body.dataset.audit || '[]') }));
      notes.push(`${phase} @${w}px: docW=${r.docW} vw=${r.vw} ${r.docW <= r.vw && !r.audit.length ? 'OK' : 'OVERFLOW ' + r.audit.join(',')}`);
    }
  }
  const a = data.away, h = data.home;
  const hi = a.score >= h.score ? a : h, lo = hi === a ? h : a;
  const scoreLine = phase === 'pregame' ? null : (a.score === h.score ? `${a.name} ${a.score}, ${h.name} ${h.score}` : `${hi.name} ${hi.score}, ${lo.name} ${lo.score}`);
  const receipt = { phase, test, file, scoreLine, ranks: { [a.name]: a.rank, [h.name]: h.rank }, records: { [a.name]: a.record, [h.name]: h.record },
    espnStatus: espn ? { name: espn.name, state: espn.state, period: espn.period, clock: espn.clock } : 'none (manual or pregame data)',
    source: espnSrc ? { file: espnSrc.src, sha256: espnSrc.sha } : null, fonts: fontNames, audit: 'clean', renderedAtUtc: new Date().toISOString() };
  fs.writeFileSync(path.join(outDir, `${stem}.receipt.json`), JSON.stringify(receipt, null, 2) + '\n');
  receipts.push(receipt);
  await ctx.close();
}
await browser.close();

for (const n of notes) console.log('note: ' + n);
for (const r of receipts) {
  console.log(`RECEIPT ${r.test ? '[TEST] ' : ''}${r.phase}${r.scoreLine ? ' | ' + r.scoreLine : ''} | ${espn ? `ESPN ${espn.name} period ${espn.period} clock ${espn.clock}` : 'no ESPN check (manual or pregame)'} | fonts: Barlow Condensed only | layout audit: clean`);
}
if (test) console.log('TEST OUTPUT: fabricated data, stamped on the card and in the file name. Never post or commit it.');
else if (!espn && receipts.some(r => r.phase !== 'pregame')) console.log('WARNING: manual scores were not checked against ESPN. Confirm both numbers against the ESPN box score before anyone posts this.');
