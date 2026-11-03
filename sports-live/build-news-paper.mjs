#!/usr/bin/env node
// Builds sports-live/news-paper-widget.js (the News Wire newspaper layout for the Latest / All News page) from sports-live/src/news-paper.js,
// and the Wix loader embed deploy/newspaper-20261103/loader.html from loader-template.html (pinned to a commit with --pin <40-hex>).
// Usage: NODE_PATH=<dir with esbuild> node sports-live/build-news-paper.mjs [--check] [--pin <40-hex>] [--local <url>]
//   --local  write the loader with this bundle URL instead of the jsDelivr pin (test harness only).
// PREVIEW ONLY: nothing here is deployed. The loader must stay under 15,000 characters (Wix custom embed limit).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const esbuild = createRequire(import.meta.url)('esbuild');
const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const read = (p) => readFileSync(join(repo, p), 'utf8');
const arg = (k) => (process.argv.includes('--' + k) ? process.argv[process.argv.indexOf('--' + k) + 1] : '');
const check = process.argv.includes('--check');

const src = read('sports-live/src/news-paper.js').replace(/^\/\*[\s\S]*?\*\/\n/, '');
// Collapse the embedded stylesheet (comments and line breaks) before minifying.
const squeezed = src.replace(/(var CSS = `)([\s\S]*?)(`;)/, (_, a, css, c) => a + css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '') + c);
const build = createHash('sha1').update(squeezed).digest('hex').slice(0, 8);
const wrapped = `(function () {\n'use strict';\n${squeezed}\n})();`;
const min = esbuild.transformSync(wrapped, { minify: true, target: 'es2017', legalComments: 'none', charset: 'ascii' }).code;
const bundle = `/* GatorBait News Wire preview, build ${build}. BUILT FILE: edit sports-live/src/news-paper.js, then run node sports-live/build-news-paper.mjs */\n${min}`;
try { new vm.Script(bundle); } catch (e) { console.error('FAIL bundle does not parse:', e.message); process.exit(1); }
const out = join(repo, 'sports-live/news-paper-widget.js');
if (check) {
  const cur = existsSync(out) ? readFileSync(out, 'utf8') : '';
  if (cur !== bundle) { console.error('FAIL sports-live/news-paper-widget.js is stale; run node sports-live/build-news-paper.mjs'); process.exit(1); }
  console.log(`OK bundle current (build ${build}, ${Buffer.byteLength(bundle)} bytes)`);
} else { writeFileSync(out, bundle); console.log(`wrote sports-live/news-paper-widget.js build ${build} ${Buffer.byteLength(bundle)} bytes`); }

const pre = read('deploy/newspaper-20261103/loader-template.html');
const pinFile = join(repo, 'deploy/newspaper-20261103/PIN');
const sha = arg('pin') || (existsSync(pinFile) ? readFileSync(pinFile, 'utf8').trim() : '0'.repeat(40));
if (!/^[0-9a-f]{40}$/.test(sha)) { console.error('FAIL pin must be 40 hex'); process.exit(1); }
const bundleUrl = arg('local') || `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@${sha}/sports-live/news-paper-widget.js`;
const loader = pre.replace('__SHA7__', sha.slice(0, 7)).replace('__BUILD__', build).replace('__BUNDLE__', bundleUrl);
try { new vm.Script(loader.match(/<script id="gbm-np-boot">([\s\S]*?)<\/script>/)[1]); } catch (e) { console.error('FAIL loader script does not parse:', e.message); process.exit(1); }
if (loader.length > 14500) { console.error('FAIL loader is ' + loader.length + ' chars (limit 14,500 here, 15,000 at Wix)'); process.exit(1); }
if (!check) {
  writeFileSync(arg('local') ? join(repo, 'sports-live/np-harness/loader.local.html') : join(repo, 'deploy/newspaper-20261103/loader.html'), loader);
  if (arg('pin')) writeFileSync(pinFile, sha + '\n');
}
console.log(`loader ${loader.length} chars (limit 15,000), pin ${sha.slice(0, 7)}`);
