#!/usr/bin/env node
// Official FloridaGators.com football statistics -> sports-live/hub-data/football-uf-stats.json (hub shape: tiles, teamRows, lead, through, updated).
//   node tools/sport-hub/fetch-uf-football-stats.mjs            download UF's cume.pdf (plain curl, no scrape credits) and parse it
//   node tools/sport-hub/fetch-uf-football-stats.mjs file.txt   parse an existing `pdftotext -layout` dump instead
// Run it after each game, commit the JSON and merge: the football hub re-reads it from GitHub Pages on every load.
// FloridaGators.com is the source of record for stats and name spellings (Brenden, Nov. 3, 2026); nothing here comes from ESPN.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const PDF = 'https://s3.us-east-2.amazonaws.com/sidearm.nextgen.sites/gatorzone.com/stats/football/2026/pdf/cume.pdf';
const OUT = 'sports-live/hub-data/football-uf-stats.json';
let txt;
if (process.argv[2]) txt = fs.readFileSync(process.argv[2], 'utf8');
else {
  execFileSync('curl', ['-sS', '--fail', '-m', '90', '-o', '/tmp/football-cume.pdf', PDF]);
  txt = execFileSync('pdftotext', ['-layout', '/tmp/football-cume.pdf', '-']).toString();
}
const lines = txt.split(/\r?\n/).map((l) => l.replace(/(\d)\s%/g, '$1%'));
const asOf = (txt.match(/Overall Statistics \(as of ([^)]+)\)/) || [])[1] || '';

// "Baugh, Jadan" -> "Jadan Baugh"; "Jones Jr., Tramell" -> "Tramell Jones Jr."
const nm = (s) => { const i = s.indexOf(', '); return i < 0 ? s.trim() : (s.slice(i + 2).trim() + ' ' + s.slice(0, i).trim()); };
const num = (x) => { const n = parseFloat(String(x).replace(/,/g, '')); return isNaN(n) ? 0 : n; };
const dash = (x) => (x === '—' || x === '-' || x === '–' || x == null ? '0' : String(x));
const trim0 = (x) => String(x).replace(/\.0$/, '');

// ---- team block (first page, left columns only)
const team = {}; let sec = '';
for (const l of lines) {
  if (/^#\s+\S/.test(l)) break;
  const m = l.match(/^(\s*)([A-Za-z0-9#:\-, ]+?)\s{2,}(\S+)\s+(\S+)/);
  if (!m) continue;
  if (!m[1].length) sec = m[2].trim();
  team[(m[1].length ? sec + '/' : '') + m[2].trim()] = [m[3], m[4]];
  if (!m[1].length) team[m[2].trim()] = [m[3], m[4]];
}
const T = (k) => { if (!team[k]) throw new Error('team stat not found: ' + k); return team[k]; };
const results = lines.filter((l) => /^\S*\s*\d\d\/\d\d\/\d{4}/.test(l.replace(/^.{0,60}?(\d\d\/\d\d\/\d{4})/, '$1'))).map((l) => l.match(/(\d\d\/\d\d\/\d{4})\s+(.+?)\s{2,}([WLT])\s+(\d+-\d+)\s+(\d+-\d+)\s*,\s*(\d+-\d+)/)).filter(Boolean);
if (!results.length) throw new Error('no results rows');
const gp = results.length, last = results[results.length - 1], record = last[5], conf = last[6];
const MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const tc = (s) => (s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s.-])([a-z])/g, (a, b, c) => b + c.toUpperCase()) : s);
const lastDate = last[1].split('/'), lastOpp = last[2].trim();
const through = MON[+lastDate[0] - 1] + ' ' + +lastDate[1] + ' ' + (/^at /i.test(lastOpp) ? 'at ' + tc(lastOpp.slice(3)) : 'vs. ' + tc(lastOpp.replace(/^vs /i, '')));
const avg = (v) => (v / gp).toFixed(1);
const pts = T('SCORING'), tot = T('TOTAL OFFENSE/Avg Per Game'), rush = T('RUSHING YARDAGE/Avg Per Game'), ypc = T('RUSHING YARDAGE/Avg Per Attempt'), passAvgG = T('PASSING YARDAGE/Avg Per Game');
const aci = T('PASSING YARDAGE/Att-Comp-Int'), fd = T('FIRST DOWNS'), third = T('3RD-DOWN CONVERSIONS'), thirdPct = T('3RD-DOWN CONVERSIONS/3rd-Down Pct'), pen = T('PENALTIES-YARDS'), top = T('TIME OF POSSESSION/Per Game');
const fum = T('FUMBLES-LOST'), intr = T('INT RETURNS: #-YARDS');
const lost = (f) => num(f.split('-')[1]);
const flTO = lost(fum[0]) + num(intr[1].split('-')[0]), opTO = lost(fum[1]) + num(intr[0].split('-')[0]);
const ca = (v) => { const [a, c] = v.split('-').slice(0, 2); return c + '-' + a + ' (' + (num(c) / num(a) * 100).toFixed(1) + '%)'; };
const pct = (v) => v.replace(/%$/, '') + '%';
const margin = opTO - flTO;
const tiles = [['Record', record, conf + ' SEC'], ['Points per game', avg(num(pts[0])), avg(num(pts[1])) + ' allowed'], ['Yards per game', tot[0], tot[1] + ' allowed'], ['Turnover margin', (margin > 0 ? '+' : '') + margin, gp + ' games']];
const teamRows = [
  ['Points per game', avg(num(pts[0])), avg(num(pts[1]))], ['Total yards per game', tot[0], tot[1]], ['Rushing yards per game', rush[0], rush[1]], ['Yards per carry', ypc[0], ypc[1]],
  ['Passing yards per game', avg(num(passAvgG[0]) * gp), avg(num(passAvgG[1]) * gp)], ['Completions-attempts', ca(aci[0]), ca(aci[1])],
  ['First downs per game', avg(num(fd[0])), avg(num(fd[1]))], ['Third-down conversions', third[0] + ' (' + (num(thirdPct[0]) ).toFixed(1) + '%)', third[1] + ' (' + num(thirdPct[1]).toFixed(1) + '%)'],
  ['Turnovers', String(flTO), String(opTO)], ['Penalties-yards', pen[0], pen[1]], ['Time of possession (avg.)', top[0], top[1]],
];

// ---- player tables (left column of each page; the right-hand tables on the same lines are ignored)
const lead = { pass: [], rush: [], rec: [], def: [] };
let mode = null;
for (const l of lines) {
  const h = l.match(/^#\s+(Rushing|Passing|Receiving|Defensive Leaders)\b/);
  if (h) { mode = { Rushing: 'rush', Passing: 'pass', Receiving: 'rec', 'Defensive Leaders': 'def' }[h[1]]; continue; }
  if (/^#\s+\S/.test(l)) { mode = null; continue; }
  if (!mode || !/^\d+\s+\S/.test(l)) continue;
  const m = l.match(/^\d+\s+(.+?,\s+.+?)\s{2,}(.*)$/); if (!m) continue;
  const name = nm(m[1]), c = m[2].trim().split(/\s{1,}/);
  if (mode === 'pass') { const [g, rating, cai, p, yds, td] = c; const [cc, aa, ii] = cai.split('-'); lead.pass.push([name, cc + '-' + aa, Number(yds).toLocaleString('en-US'), td, ii]); }
  if (mode === 'rush') { const [g, att, gain, loss, net, av, td, lg] = c; lead.rush.push([name, att, net, num(att) ? (num(net) / num(att)).toFixed(1) : '0.0', td, lg]); }
  if (mode === 'rec') { const [g, no, yds, av, td, lg] = c; lead.rec.push([name, no, yds, num(no) ? (num(yds) / num(no)).toFixed(1) : '0.0', td, lg]); }
  if (mode === 'def') { const [g, solo, ast, tot2, tfl, sk, intyds, bu] = c; lead.def.push([name, trim0(tot2), trim0(dash(tfl).split('-')[0]), trim0(dash(sk).split('-')[0]), dash(intyds).split('-')[0], dash(bu)]); }
}
for (const k of Object.keys(lead)) if (!lead[k].length) throw new Error('no rows parsed for ' + k);
// the layout text can list a player's left-hand row twice when a right-hand table shares the line; keep the first of each name per table
for (const k of Object.keys(lead)) { const seen = new Set(); lead[k] = lead[k].filter((r) => (seen.has(r[0]) ? false : (seen.add(r[0]), true))); }
lead.pass = lead.pass.slice(0, 3); lead.rush = lead.rush.slice(0, 6); lead.rec = lead.rec.slice(0, 6); lead.def = lead.def.slice(0, 6);

const now = new Date();
const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now).reduce((o, p) => (o[p.type] = p.value, o), {});
const h12 = f.hour % 12 || 12, label = MON[f.month - 1] + ' ' + f.day + ', ' + f.year + ', ' + h12 + ':' + f.minute + ' ' + (f.hour < 12 ? 'a.m.' : 'p.m.') + ' ET';
const out = { v: 2, season: 2026, source: 'FloridaGators.com', record, confRecord: conf, through, asOf, updated: now.toISOString(), updatedLabel: label, tiles, teamRows, lead,
  src: [['FloridaGators.com cumulative statistics', 'https://floridagators.com/sports/football/stats'], ['official PDF', PDF]] };
fs.writeFileSync(OUT, JSON.stringify(out));
console.log('wrote', OUT, 'record', record, conf, 'through', through, 'as of', asOf);
console.log(JSON.stringify(tiles)); console.log(JSON.stringify(teamRows)); console.log(JSON.stringify(lead));
