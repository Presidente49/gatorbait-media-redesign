#!/usr/bin/env node
// Builds sports-live/roster-widget.js: sports-live/src/roster.js with a roster snapshot inlined as the offline fallback.
// The live widget re-fetches sports-live/florida-roster.json (GitHub Pages) on every load, so a merged data change shows within minutes.
import fs from 'node:fs';
import crypto from 'node:crypto';
const src = fs.readFileSync('sports-live/src/roster.js', 'utf8');
const data = JSON.parse(fs.readFileSync('sports-live/florida-roster.json', 'utf8'));
const snap = JSON.stringify(data);
const build = crypto.createHash('sha256').update(src + snap).digest('hex').slice(0, 8);
const out = src.replace('/*ROSTER*/null/*ROSTER-END*/', '/*ROSTER*/' + snap + '/*ROSTER-END*/').replace('__BUILD__', build);
// ASCII-only output so the bundle renders the same whatever charset the host page declares.
const ascii = out.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
fs.writeFileSync('sports-live/roster-widget.js', ascii);
console.log('roster-widget.js', ascii.length, 'chars; players', data.players.length, 'build', build);
