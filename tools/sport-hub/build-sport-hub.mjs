#!/usr/bin/env node
// Builds one sport-hub bundle.
//   node tools/sport-hub/build-sport-hub.mjs <hub> [--fetch]
// --fetch pulls fresh ESPN JSON (curl) into sports-live/hub-data/ for ESPN-backed sports. FloridaGators.com data is cached by hand/Firecrawl, never re-scraped here.
// Output: sports-live/sport-hub-<key>.js (ASCII only). The widget's own normSchedule/normRank (between /*NORM*/ markers) run here, so snapshot and live refresh cannot drift.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { HUBS } from './hubs.mjs';

const hub = process.argv[2];
if (!HUBS[hub]) { console.error('hub must be one of', Object.keys(HUBS).join(', ')); process.exit(1); }
const { cfg, snapshot } = HUBS[hub];
const src = fs.readFileSync('sports-live/src/sport-hub.js', 'utf8');
const norm = new Function('LOGO', src.slice(src.indexOf('/*NORM*/') + 8, src.indexOf('/*NORM-END*/')) + '; return {normSchedule: normSchedule, normRank: normRank};')('https://a.espncdn.com/i/teamlogos/ncaa/500/');
const curl = (u) => JSON.parse(execFileSync('curl', ['-sS', '--fail', '-m', '40', u], { maxBuffer: 64 * 1024 * 1024 }).toString());

if (process.argv.includes('--fetch') && cfg.espn) {
  const base = 'https://site.api.espn.com/apis/site/v2/sports/' + cfg.espn.path;
  fs.mkdirSync('sports-live/hub-data', { recursive: true });
  fs.writeFileSync(`sports-live/hub-data/${hub}-espn-schedule.json`, JSON.stringify(curl(base + '/teams/57/schedule')));
  fs.writeFileSync(`sports-live/hub-data/${hub}-espn-rankings.json`, JSON.stringify(curl(base + '/rankings')));
  console.log('fetched ESPN', hub);
}

const raw = snapshot();
const snap = { ...raw, fetchedAt: new Date().toISOString() };
if (raw.sched) { snap.games = norm.normSchedule(raw.sched, null); snap.rank = norm.normRank(raw.rank, null); delete snap.sched; }
if (snap.games.length || snap.fgGames) { /* ok */ } else throw new Error('no games for ' + hub);
// Football record from ESPN must agree with the team stats file; stop the build if they drift.
if (hub === 'football' && snap.stats) {
  const w = snap.games.filter((g) => g.state === 'post' && g.score && g.score.win).length, l = snap.games.filter((g) => g.state === 'post' && g.score && !g.score.win).length;
  const st = JSON.parse(fs.readFileSync('sports-live/florida-stats.json', 'utf8'));
  console.log('ESPN record', w + '-' + l, 'stats file record', st.record, 'conf', st.confRecord);
}
const jsCfg = JSON.stringify(cfg), jsSnap = JSON.stringify(snap);
const build = crypto.createHash('sha256').update(src + jsCfg + jsSnap).digest('hex').slice(0, 8);
let out = src.replace('/*CFG*/null/*CFG-END*/', () => '/*CFG*/' + jsCfg + '/*CFG-END*/').replace('/*SNAP*/null/*SNAP-END*/', () => '/*SNAP*/' + jsSnap + '/*SNAP-END*/').replace('__BUILD__', build);
const ascii = out.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const file = `sports-live/sport-hub-${cfg.key}.js`;
fs.writeFileSync(file, ascii);
console.log(file, ascii.length, 'chars; games', (snap.games || []).length + (snap.fgGames || []).length, 'roster', (snap.roster || []).length, 'build', build);
