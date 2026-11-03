#!/usr/bin/env node
// Builds the Gator Basketball hub bundle.
//   node tools/basketball/build-basketball.mjs --fetch   pull fresh ESPN JSON (curl) into sports-live/florida-basketball.json first
//   node tools/basketball/build-basketball.mjs           inline the existing snapshot into sports-live/basketball-widget.js
// Sources: ESPN public JSON only (site.api.espn.com, men's college basketball, Florida team id 57).
// The widget's own normalize() (between /*NORM*/ markers) is the single source of truth and is run here, so the snapshot and the live refresh cannot drift.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball';
const WEB = 'https://site.web.api.espn.com/apis/v2/sports/basketball/mens-college-basketball';
const JSON_PATH = 'sports-live/florida-basketball.json';
const curl = (u) => JSON.parse(execFileSync('curl', ['-sS', '--fail', '-m', '40', u], { maxBuffer: 64 * 1024 * 1024 }).toString());
const src = fs.readFileSync('sports-live/src/basketball.js', 'utf8');

if (process.argv.includes('--fetch')) {
  const code = src.slice(src.indexOf('/*NORM*/') + 8, src.indexOf('/*NORM-END*/'));
  const norm = new Function('LOGO', code + '; return normalize;')('https://a.espncdn.com/i/teamlogos/ncaa/500/');
  const raw = { sched: curl(BASE + '/teams/57/schedule'), roster: curl(BASE + '/teams/57/roster'), rank: curl(BASE + '/rankings'), stand: curl(WEB + '/standings?group=23') };
  const d = norm(raw, null);
  fs.writeFileSync(JSON_PATH, JSON.stringify(d));
  console.log('wrote', JSON_PATH, 'games', d.games.length, 'roster', d.roster.length, 'ap', d.ap.ranks.length, 'sec', d.sec.length);
}

// Roster: copied from FloridaGators.com (one cached Firecrawl scrape, tools/sport-hub/parse-roster-md.mjs). ESPN stays the source for schedule, polls and standings.
const base = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const fg = JSON.parse(fs.readFileSync('sports-live/hub-data/mens-basketball-roster.json', 'utf8'));
base.roster = fg.players.map((p) => ({ jersey: p.no, name: p.name, pos: p.pos, cls: p.cls, ht: p.ht, wt: p.wt, home: p.home, school: p.school, prev: p.prev, img: p.img, url: p.url }));
base.coaches = fg.coaches.slice(0, 4);
base.rosterUpdated = 'Nov. 3, 2026';
const snap = JSON.stringify(base);
const build = crypto.createHash('sha256').update(src + snap).digest('hex').slice(0, 8);
const out = src.replace('/*BB*/null/*BB-END*/', '/*BB*/' + snap + '/*BB-END*/').replace('__BUILD__', build);
// ASCII-only output so the bundle renders the same whatever charset the host page declares.
const ascii = out.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
fs.writeFileSync('sports-live/basketball-widget.js', ascii);
console.log('basketball-widget.js', ascii.length, 'chars; build', build);
