#!/usr/bin/env node
// Builds sports-live/latest-feed.js (the Latest / category feed experience) from sports-live/src/latest-feed.{css,js}, and the tiny
// Wix loader embed deploy/latest-feed-20261018/latest-feed-loader-v1.html (pinned to a commit with --pin <40-hex>).
// Usage: node sports-live/build-latest-feed.mjs [--check] [--pin <40-hex main/branch commit>]
//   --check   rebuild in memory and fail if sports-live/latest-feed.js differs, the bundle does not parse, or the loader is over 14,500 chars.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const read = (p) => readFileSync(join(repo, p), 'utf8');
const check = process.argv.includes('--check');
const pinArg = process.argv.includes('--pin') ? process.argv[process.argv.indexOf('--pin') + 1] : '';

const css = read('sports-live/src/latest-feed.css').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '').trim();
const runtime = read('sports-live/src/latest-feed.js').replace(/^\/\*[\s\S]*?\*\/\n/, '');
const build = createHash('sha1').update(css + runtime).digest('hex').slice(0, 8);
const bundle = `/* GatorBait Latest Feed v1, build ${build}. BUILT FILE: edit sports-live/src/latest-feed.{css,js}, then run node sports-live/build-latest-feed.mjs */
(function () {
  'use strict';
  try {
    var s = document.createElement('style'); s.id = 'gbm-lf-style'; s.textContent = ${JSON.stringify(css)};
    if (!document.getElementById('gbm-lf-style')) (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
${runtime}
})();
`;
try { new vm.Script(bundle); } catch (e) { console.error('FAIL bundle does not parse:', e.message); process.exit(1); }
const out = join(repo, 'sports-live/latest-feed.js');
if (check) {
  const cur = existsSync(out) ? readFileSync(out, 'utf8') : '';
  if (cur !== bundle) { console.error('FAIL sports-live/latest-feed.js is stale; run node sports-live/build-latest-feed.mjs'); process.exit(1); }
  console.log(`OK bundle current (build ${build}, ${Buffer.byteLength(bundle)} bytes)`);
} else { writeFileSync(out, bundle); console.log(`wrote sports-live/latest-feed.js build ${build} ${Buffer.byteLength(bundle)} bytes`); }

// ---- loader embed ----
const pre = read('deploy/latest-feed-20261018/loader-template.html');
const sha = pinArg || (existsSync(join(repo, 'deploy/latest-feed-20261018/PIN')) ? read('deploy/latest-feed-20261018/PIN').trim() : '0'.repeat(40));
if (!/^[0-9a-f]{40}$/.test(sha)) { console.error('FAIL pin must be 40 hex'); process.exit(1); }
const loader = pre.replace(/__SHA__/g, sha).replace('__SHA7__', sha.slice(0, 7)).replace('__BUILD__', build);
try { new vm.Script(loader.match(/<script id="gbm-lf-boot">([\s\S]*?)<\/script>/)[1]); } catch (e) { console.error('FAIL loader script does not parse:', e.message); process.exit(1); }
if (loader.length > 14500) { console.error('FAIL loader is ' + loader.length + ' chars (limit 14,500 here, 15,000 at Wix)'); process.exit(1); }
const lo = join(repo, 'deploy/latest-feed-20261018/latest-feed-loader-v1.html');
if (!check) { writeFileSync(lo, loader); if (pinArg) writeFileSync(join(repo, 'deploy/latest-feed-20261018/PIN'), sha + '\n'); }
const h = (s) => { let x = 5381; for (const c of s) x = ((x * 33) ^ c.charCodeAt(0)) >>> 0; return x.toString(16); };
console.log(`loader ${loader.length} chars, djb2 ${h(loader)}, pin ${sha.slice(0, 7)}`);
