#!/usr/bin/env node
// node tools/sport-hub/make-loader.mjs <hub> <40-hex sha> [out.html]   -> loader embed HTML (checks size and SHA count)
import fs from 'node:fs';
import { HUBS } from './hubs.mjs';
const [, , hub, sha, out] = process.argv;
if (!HUBS[hub] || !/^[0-9a-f]{40}$/.test(sha || '')) { console.error('usage: make-loader.mjs <hub> <40-hex-sha> [out]'); process.exit(1); }
const c = HUBS[hub].cfg;
const keyU = c.key.toUpperCase().replace(/[^A-Z0-9]/g, '_');
const html = fs.readFileSync('deploy/sport-hub-20261103/loader.template.html', 'utf8')
  .replace(/__KEYU__/g, keyU).replace(/__KEY__/g, c.key).replace(/__SHA__/g, sha).replace(/__FILE__/g, 'sport-hub-' + c.key + '.js')
  .replace(/__ROUTE_RE__/g, c.route.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')).replace(/__ROUTE__/g, c.route);
if (html.length >= 15000) throw new Error('loader too long');
const n = (html.match(new RegExp(sha, 'g')) || []).length;
console.error('loader chars', html.length, 'sha occurrences', n);
if (out) fs.writeFileSync(out, html); else process.stdout.write(html);
