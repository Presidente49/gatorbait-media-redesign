#!/usr/bin/env node
// Parse a FloridaGators.com (Sidearm) roster page scraped to markdown (Firecrawl) into roster JSON.
//   node tools/sport-hub/parse-roster-md.mjs <scrape.json|scrape.md> <sport-key> [out.json]
// Fields copied as published: jersey, name, position, class, height, weight, hometown, last (high) school, previous school, headshot, bio URL.
// Headshots stay on floridagators.com's own image host (cloudfront); nothing is re-hosted.
import fs from 'node:fs';

const [, , inFile, key, outArg] = process.argv;
if (!inFile || !key) { console.error('usage: parse-roster-md.mjs <scrape> <key> [out]'); process.exit(1); }
let md = fs.readFileSync(inFile, 'utf8');
if (inFile.endsWith('.json')) md = JSON.parse(md).markdown || '';

const start = md.indexOf('## Players');
const body = start > -1 ? md.slice(start) : md;
const end = body.search(/\n## (Coaches|Coaching Staff|Staff|Support Staff)/);
const part = end > -1 ? body.slice(0, end) : body;
const cstart = md.indexOf('## Coaching Staff');
const cpart = cstart > -1 ? md.slice(cstart, cstart + md.slice(cstart + 5).search(/\n## /) + 5) : '';
const coaches = [...cpart.matchAll(/\[\*\*([^*]+)\*\*\]\(https:\/\/floridagators\.com[^)]+\)\s*\n+\s*([^\n\[]+)/g)].map((m) => ({ name: m[1].trim(), title: m[2].trim() }));
const chunks = part.split(/\n- \[!\[/).slice(1);

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const players = chunks.map((c) => {
  const imgM = c.match(/^\]?\(?\s*https:\/\/images\.sidearmdev\.com\/[^?]*\?url=([^&)\s]+)/) || c.match(/images\.sidearmdev\.com\/[a-z]+\?url=([^&)\s]+)/);
  const img = imgM ? decodeURIComponent(imgM[1]) : '';
  const jersey = (c.match(/Jersey Number\s*([0-9A-Za-z]+)/) || [])[1] || '';
  const nameM = c.match(/\[\*\*([^*]+)\*\*\]\((https:\/\/floridagators\.com[^)]+)\)/);
  if (!nameM) return null;
  const meta = clean(c.slice(c.indexOf(nameM[0]) + nameM[0].length).split('[Full Bio')[0]);
  const f = (label, next) => { const m = meta.match(new RegExp(label + '\\s+(.*?)\\s*(?:' + next + '|$)')); return m ? clean(m[1]) : ''; };
  const pos = f('Position', 'Academic Year|Height|Weight|Hometown');
  const cls = f('Academic Year', 'Height|Weight|Hometown');
  const ht = f('Height', "Weight|Hometown").replace(/\s*''\s*$/, '"').replace(/'\s+(\d+)\s*''/, "'$1\"").replace(/\s+/g, '');
  const wt = (f('Weight', 'Hometown|Last School|Previous School').match(/\d+/) || [''])[0];
  const home = f('Hometown', 'Last School|Previous School|Highschool|High School');
  const last = f('Last School', 'Previous School');
  const prev = ((meta.match(/Previous School\s+Previous School:\s*(.*)$/) || meta.match(/Previous School:\s*(.*)$/) || [])[1] || '').trim();
  return { no: jersey, name: clean(nameM[1]), pos, cls, ht, wt, home, school: last, prev: prev.replace(/^Previous School:\s*/, ''), img, url: nameM[2] };
}).filter(Boolean);

const out = outArg || `sports-live/hub-data/${key}-roster.json`;
fs.mkdirSync(out.replace(/\/[^/]*$/, ''), { recursive: true });
const title = (md.match(/^(.*Roster.*)$/m) || [''])[0];
fs.writeFileSync(out, JSON.stringify({ sport: key, source: 'FloridaGators.com', title: clean(title).slice(0, 80), count: players.length, coaches, players }, null, 0));
console.log('wrote', out, players.length, 'players');
console.log(JSON.stringify(players.slice(0, 2)));
