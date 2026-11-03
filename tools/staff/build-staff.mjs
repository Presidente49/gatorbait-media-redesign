#!/usr/bin/env node
// Builds sports-live/staff-widget.js: src/staff.js with staff-data.json inlined as the offline snapshot.
import fs from 'node:fs';
import crypto from 'node:crypto';
const src = fs.readFileSync('sports-live/src/staff.js', 'utf8');
const data = JSON.parse(fs.readFileSync('sports-live/staff-data.json', 'utf8'));
const snap = JSON.stringify({ org: data.org, people: data.people });
const build = crypto.createHash('sha256').update(src + snap).digest('hex').slice(0, 8);
const out = src.replace('/*STAFF*/null/*STAFF-END*/', '/*STAFF*/' + snap + '/*STAFF-END*/').replace('__BUILD__', build);
const ascii = out.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
fs.writeFileSync('sports-live/staff-widget.js', ascii);
console.log('staff-widget.js', ascii.length, 'chars; people', data.people.length, 'build', build);
