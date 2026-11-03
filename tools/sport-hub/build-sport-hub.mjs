#!/usr/bin/env node
// Builds one sport-hub bundle.
//   node tools/sport-hub/build-sport-hub.mjs <hub> [--fetch]
// --fetch pulls fresh ESPN JSON (curl) into sports-live/hub-data/ for ESPN-backed sports (schedule, rankings and, when cfg.boxStats, the box score of every final game).
// FloridaGators.com data is cached by hand/Firecrawl, never re-scraped here.
// Output: sports-live/sport-hub-<key>.js (ASCII only). The widget's own normSchedule/normRank (/*NORM*/) and bbNew/bbAdd (/*STATS*/) run here, so snapshot and live refresh cannot drift.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { HUBS } from './hubs.mjs';

const hub = process.argv[2];
if (!HUBS[hub]) { console.error('hub must be one of', Object.keys(HUBS).join(', ')); process.exit(1); }
const { cfg, snapshot } = HUBS[hub];
const src = fs.readFileSync('sports-live/src/sport-hub.js', 'utf8');
const cut = (a, b) => src.slice(src.indexOf(a) + a.length, src.indexOf(b));
const fns = new Function('LOGO', cut('/*NORM*/', '/*NORM-END*/') + cut('/*STATS*/', '/*STATS-END*/') + '; return {normSchedule: normSchedule, normRank: normRank, bbNew: bbNew, bbAdd: bbAdd};')('https://a.espncdn.com/i/teamlogos/ncaa/500/');
const curl = (u) => JSON.parse(execFileSync('curl', ['-sS', '--fail', '-m', '40', u], { maxBuffer: 64 * 1024 * 1024 }).toString());
const dir = 'sports-live/hub-data';

if (process.argv.includes('--fetch') && cfg.espn) {
  const base = 'https://site.api.espn.com/apis/site/v2/sports/' + cfg.espn.path;
  fs.mkdirSync(dir, { recursive: true });
  const sched = curl(base + '/teams/57/schedule');
  fs.writeFileSync(`${dir}/${hub}-espn-schedule.json`, JSON.stringify(sched));
  fs.writeFileSync(`${dir}/${hub}-espn-rankings.json`, JSON.stringify(curl(base + '/rankings')));
  console.log('fetched ESPN', hub);
  if (cfg.boxStats) {
    fs.mkdirSync(`${dir}/${hub}-box`, { recursive: true });
    fns.normSchedule(sched, null).filter((g) => g.state === 'post').forEach((g) => { fs.writeFileSync(`${dir}/${hub}-box/${g.id}.json`, JSON.stringify(curl(base + '/summary?event=' + g.id))); console.log('box score', g.id); });
  }
}

const raw = snapshot();
const snap = { ...raw, fetchedAt: new Date().toISOString() };
if (raw.sched) { snap.games = fns.normSchedule(raw.sched, null); snap.rank = fns.normRank(raw.rank, null); delete snap.sched; }
if (!(snap.games.length || snap.fgGames)) throw new Error('no games for ' + hub);
if (cfg.boxStats) {
  const acc = fns.bbNew(), bd = `${dir}/${hub}-box`;
  (fs.existsSync(bd) ? fs.readdirSync(bd) : []).sort().forEach((f) => { fns.bbAdd(acc, JSON.parse(fs.readFileSync(`${bd}/${f}`, 'utf8'))); });
  snap.bb = acc;
  console.log('box scores counted', acc.ids.join(','), 'players', Object.keys(acc.pl).length, 'team pts', acc.tm.pts, 'opp pts', acc.op.pts);
}
// The ESPN record must agree with the team stats file (football) or the counted box scores (basketball); stop on drift.
const wl = (g) => g.filter((x) => x.state === 'post' && x.score);
if (hub === 'football' && snap.stats) {
  const w = wl(snap.games).filter((g) => g.score.win).length, l = wl(snap.games).filter((g) => !g.score.win).length;
  const st = JSON.parse(fs.readFileSync('sports-live/florida-stats.json', 'utf8'));
  console.log('ESPN record', w + '-' + l, 'stats file record', st.record, 'conf', st.confRecord);
}
if (snap.bb && snap.bb.source) {
  // FloridaGators.com is the source of record for stats; ESPN only cross-checks the final scores and game count. Warn (do not block) when UF's cached page is behind.
  const fin = wl(snap.games);
  console.log('final games on ESPN schedule', fin.length, 'UF games cached', snap.bb.games.length);
  if (fin.length !== snap.bb.games.length) console.warn('WARNING: re-scrape the FloridaGators.com stats page; ESPN lists a different number of final games');
  snap.bb.games.forEach((u) => { const e = fin.find((g) => String(g.score.fl) === String(u.fl) && String(g.score.opp) === String(u.op)); if (!e) console.warn('WARNING: UF game', u.opp, u.fl + '-' + u.op, 'has no matching ESPN final score'); });
} else if (snap.bb) {
  const fin = wl(snap.games);
  console.log('final games on schedule', fin.length, 'box scores counted', snap.bb.ids.length);
  if (fin.length !== snap.bb.ids.length) throw new Error('final games and counted box scores differ; run with --fetch');
}
const jsCfg = JSON.stringify(cfg), jsSnap = JSON.stringify(snap);
const build = crypto.createHash('sha256').update(src + jsCfg + jsSnap).digest('hex').slice(0, 8);
const out = src.replace('/*CFG*/null/*CFG-END*/', () => '/*CFG*/' + jsCfg + '/*CFG-END*/').replace('/*SNAP*/null/*SNAP-END*/', () => '/*SNAP*/' + jsSnap + '/*SNAP-END*/').replace('__BUILD__', build);
const ascii = out.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const file = `sports-live/sport-hub-${cfg.key}.js`;
fs.writeFileSync(file, ascii);
console.log(file, ascii.length, 'chars; games', (snap.games || []).length + (snap.fgGames || []).length, 'roster', (snap.roster || []).length, 'build', build);
