#!/usr/bin/env node
// Builds sports-live/show-widget.js: src/show.js with buddy-videos.json inlined as the offline fallback.
import fs from 'node:fs';
import crypto from 'node:crypto';
const src = fs.readFileSync('sports-live/src/show.js', 'utf8');
const data = JSON.parse(fs.readFileSync('sports-live/buddy-videos.json', 'utf8'));
const snap = JSON.stringify(data);
const build = crypto.createHash('sha256').update(src + snap).digest('hex').slice(0, 8);
const out = src.replace('/*SHOW*/null/*SHOW-END*/', '/*SHOW*/' + snap + '/*SHOW-END*/').replace('__BUILD__', build);
const ascii = out.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
fs.writeFileSync('sports-live/show-widget.js', ascii);
console.log('show-widget.js', ascii.length, 'chars; videos', data.videos.length, 'build', build);
