#!/usr/bin/env node
// Render GatorBait game-day cards to PNG. One command per card type.
//
//   node assets/gameday/render.mjs final    --event 401856714
//   node assets/gameday/render.mjs pregame  --event 401856714
//   node assets/gameday/render.mjs halftime --event 401856714        (live game at halftime)
//   node assets/gameday/render.mjs quote    --data my-quote.json
//   node assets/gameday/render.mjs all      --event 401856714        (pregame + final + halftime)
//
// Options:
//   --event <id>        ESPN event id; scores, records, ranks, line and stats are pulled from ESPN
//   --data <file>       use a JSON file instead (same shape espn.mjs produces; see README.md)
//   --formats a,b       landscape (1200x675), portrait (1080x1350), square (1080x1080)
//   --stats a,b,c       ESPN stat keys for the strip (default totalYards,rushingYards,turnovers)
//   --out <dir>         output folder (default assets/gameday/out)
//   --as-halftime       demo only: show a finished game's first-half score, stamped "Sample data"
//   --kicker "text"     override the top-right line
//   --save <file>       also write the game JSON, so you can edit it and re-render with --data
// Needs Playwright with Chromium. Set PLAYWRIGHT_PKG to its package path if `import('playwright')` fails.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { buildGame } from './espn.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const FORMATS = { landscape: [1200, 675], portrait: [1080, 1350], square: [1080, 1080] };
const DEFAULT_FORMATS = { pregame: ['landscape', 'portrait'], final: ['landscape', 'portrait'], halftime: ['square', 'landscape'], quote: ['square', 'portrait'] };

function args(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const k = t.slice(2);
      if (['as-halftime'].includes(k)) a[k] = true; else a[k] = argv[++i];
    } else a._.push(t);
  }
  return a;
}

async function loadPlaywright() {
  const attempts = [
    () => process.env.PLAYWRIGHT_PKG && createRequire(import.meta.url)(process.env.PLAYWRIGHT_PKG),
    () => createRequire(import.meta.url)('playwright'),
    () => createRequire(path.join(execSync('npm root -g').toString().trim(), 'x.js'))('playwright'),
  ];
  for (const t of attempts) { try { const m = t(); if (m && m.chromium) return m; } catch { /* try next */ } }
  throw new Error('Playwright not found. Install it or set PLAYWRIGHT_PKG to its package path.');
}

async function launch(chromium) {
  const exe = process.env.CHROMIUM_PATH;
  const tries = [exe && { executablePath: exe }, fs.existsSync('/opt/pw-browsers/chromium') && { executablePath: '/opt/pw-browsers/chromium' }, {}].filter(Boolean);
  let last;
  for (const o of tries) { try { return await chromium.launch(o); } catch (e) { last = e; } }
  throw last;
}

const a = args(process.argv.slice(2));
const type = a._[0];
if (!['pregame', 'final', 'halftime', 'quote', 'all'].includes(type)) {
  console.error('Usage: node assets/gameday/render.mjs <pregame|final|halftime|quote|all> (--event <espn id> | --data file.json) [--formats a,b] [--out dir]');
  process.exit(2);
}
const outDir = path.resolve(a.out || path.join(here, 'out'));
fs.mkdirSync(outDir, { recursive: true });

let game;
if (a.data) game = JSON.parse(fs.readFileSync(path.resolve(a.data), 'utf8'));
else if (a.event) game = await buildGame(a.event, { stats: a.stats && a.stats.split(','), asHalftime: !!a['as-halftime'], kicker: a.kicker });
else { console.error('Give --event <ESPN event id> or --data <file.json>.'); process.exit(2); }
if (a.kicker) game.kicker = a.kicker;
if (a.save) { fs.writeFileSync(path.resolve(a.save), JSON.stringify(game, null, 2) + '\n'); console.log('saved ' + a.save); }

const types = type === 'all' ? ['pregame', 'final', 'halftime'] : [type];
const { chromium } = await loadPlaywright();
const browser = await launch(chromium);
const written = [];
for (const t of types) {
  const formats = a.formats ? a.formats.split(',') : DEFAULT_FORMATS[t];
  for (const f of formats) {
    const [w, h] = FORMATS[f] || [];
    if (!w) throw new Error('Unknown format ' + f);
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.addInitScript((g) => { window.__GAME__ = g; }, game);
    await page.goto(pathToFileURL(path.join(here, 'card.html')).href + '?type=' + t + '&format=' + f);
    await page.waitForSelector('html[data-ready="1"]', { timeout: 15000 });
    const card = await page.$('#card');
    const box = await card.boundingBox();
    if (Math.round(box.width) !== w || Math.round(box.height) !== h) throw new Error(t + '-' + f + ': card measured ' + box.width + 'x' + box.height + ', expected ' + w + 'x' + h);
    const over = await page.evaluate(() => { const c = document.getElementById('card'); return c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1; });
    if (over) console.warn('WARNING ' + t + '-' + f + ': content overflows the card; shorten the text or pick fewer stats.');
    const name = [t, game.eventId || 'custom', f].join('-') + '.png';
    await card.screenshot({ path: path.join(outDir, name) });
    written.push(path.join(outDir, name));
    await page.close();
  }
}
await browser.close();
written.forEach((p) => console.log(path.relative(process.cwd(), p)));
