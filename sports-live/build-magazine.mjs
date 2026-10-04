#!/usr/bin/env node
// Builds sports-live/magazine.js (GatorBait Magazine 2026, the weekly web issue on /magazine) and its QA fixture from:
//   sports-live/src/magazine.css, sports-live/src/magazine.js and sports-live/magazine-issue.json (the issue, bundled
//   like front-page.config.json is bundled into homepage.js; meta keys $comment / todo / note are stripped).
// The fixture sports-live/magazine-frame.html mimics the Wix /magazine route (mobile shell host, a hidden native
// #SITE_PAGES, #SITE_HEADER / #SITE_FOOTER placeholders) and carries the real loader from deploy/magazine-2026, so QA
// exercises pointer -> bundle -> mount the way the embed does. homepage.js is not touched.
// Usage: NODE_PATH=<dir with esbuild> node sports-live/build-magazine.mjs [--check]
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const minify = (code, banner) => banner + code; // Dependency-free, deterministic full-issue bundle.

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const VARIANT = process.env.MAG_VARIANT || ''; // '' = the weekly full-story issue; 'pregame' = Friday Pregame edition
if (!VARIANT) execFileSync('python3', [join(here, 'check-magazine-parity.py')], {stdio:'inherit'});
const read = (p) => readFileSync(join(repo, p), 'utf8');

// 'postgame' (the postgame issue) swaps the pregame skin for src/magazine-postgame.css and adds src/magazine-postgame.js plus the
// site's existing signup component (src/capture.js, guarded by window.GBM_CAPTURE, so a page that already loaded it keeps one copy).
// The weekly and pregame bundles are built exactly as before.
const POSTGAME = VARIANT === 'postgame';
const css = (read('sports-live/src/magazine.css') + read(POSTGAME ? 'sports-live/src/magazine-postgame.css' : 'sports-live/src/magazine-pregame.css')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '\n').trim();
// capture.js goes first: magazine.js mounts synchronously at its end, and the postgame signup needs window.GBM_CAPTURE by then.
const runtime = (POSTGAME ? read('sports-live/src/capture.js') + '\n;' : '') + read('sports-live/src/magazine.js') + read('sports-live/src/magazine-feed.js') + read('sports-live/src/magazine-pregame.js') +
  (POSTGAME ? '\n' + read('sports-live/src/magazine-postgame.js') : '');
// Photo credits the homepage already verified (front-page.config.json), so the live card refresh can credit a new card's photo.
const credits = JSON.parse(read('sports-live/front-page.config.json')).credits || {};
const MAX_JS = 180 * 1024;

// Strip editorial meta (notes to the compiler) so the bundle carries only what renders; everything else goes through untouched.
const META = new Set(['$comment', 'todo']);
const strip = (v) => Array.isArray(v) ? v.map(strip) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !META.has(k)).map(([k, x]) => [k, strip(x)])) : v;
const issue = strip(JSON.parse(read(VARIANT ? 'sports-live/magazine-issue-' + VARIANT + '.json' : 'sports-live/magazine-issue.json')));
if (!issue.id || !issue.cover || !issue.cover.url) { console.error('magazine-issue.json needs an id and a cover with a url'); process.exit(1); }

const build = createHash('sha1').update(css + runtime + JSON.stringify(issue) + JSON.stringify(credits)).digest('hex').slice(0, 8);
const banner = `/* GatorBait Magazine 2026: the weekly web issue on /magazine. Issue ${issue.id}, build ${build}.
 * BUILT, MINIFIED FILE: edit sports-live/src/magazine.{css,js} or sports-live/magazine-issue.json, then run:
 * NODE_PATH=<dir with esbuild> node sports-live/build-magazine.mjs
 */
`;
const js = minify(`(function () {
  'use strict';
  var CSS = ${JSON.stringify(css)};
  var ISSUE = ${JSON.stringify(issue)};
  var BUILD = ${JSON.stringify(build)};
  var CREDITS = ${JSON.stringify(credits)};
${runtime}})();
`, banner);

// Fixture: the Home Code loader's Barlow link (it is injected on every page, /magazine included), the mobile shell's
// critical CSS, the real Magazine loader, and a stand-in for the native Wix page the loader must hide.
const homeLoader = read('deploy/wix-served/homepage-embed-cdn.html');
const shellCss = (homeLoader.match(/<style id="gbm-mobile-shell-critical-v2">[\s\S]*?<\/style>/) || [''])[0];
// The postgame fixture carries the loader that is live on embed 1dd74333 (rev 73), so QA runs the real pointer -> bundle path.
const loader = read(POSTGAME ? 'deploy/magazine-2026/postgame-missouri/live-rev73-loader.html' : 'deploy/magazine-2026/magazine-loader-v1.html');
const frame = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>GatorBait Magazine fixture</title>
<link id="gbm-fonts" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&family=Bebas+Neue&display=swap">
${shellCss}
${loader}
<style>body{margin:0;font-family:Arial,sans-serif}#SITE_HEADER,#SITE_FOOTER{padding:18px 16px;background:#eef;color:#123}#SITE_PAGES{padding:24px 16px;min-height:900px}#SITE_PAGES h1{font-family:Georgia,serif}#gbm-footer{padding:32px 16px;background:#08132f;color:#fff;font:600 14px/1.4 "Barlow",sans-serif}</style>
</head><body>
<div id="gbm-mobile-shell-host"><div id="gbm-mobile-shell"><a class="gbm-ms-logo" href="/"><img src="https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp" alt="GatorBait" width="180" height="48"></a><button class="gbm-ms-trigger" type="button" aria-label="Open menu"><span class="gbm-ms-bars"><i></i><i></i><i></i></span>Menu</button></div></div>
<div id="SITE_CONTAINER"><div id="masterPage"><header id="SITE_HEADER">Native header (fixture stub)</header><div id="PAGES_CONTAINER"><div id="SITE_PAGES_TRANSITION_GROUP"><div id="SITE_PAGES"><div id="pageBackground_nh0hy"></div><main id="qa-native"><h1>Native Wix magazine page (fixture stub)</h1><p>This native content must be hidden while the issue is mounted and visible again when the bundle cannot load.</p></main></div></div></div><footer id="SITE_FOOTER">Native footer (fixture stub)</footer></div></div>
<footer id="gbm-footer">GatorBait footer (fixture stub)</footer>
</body></html>
`;

if (Buffer.byteLength(js) > MAX_JS) { console.error(`magazine.js is ${Buffer.byteLength(js)} bytes; the limit is ${MAX_JS}`); process.exit(1); }
const outputs = VARIANT ? { ['sports-live/magazine-' + VARIANT + '.js']: js, ['sports-live/magazine-' + VARIANT + '-frame.html']: frame } : { 'sports-live/magazine.js': js, 'sports-live/magazine-frame.html': frame };
if (process.argv.includes('--check')) {
  const stale = Object.entries(outputs).filter(([p, s]) => read(p) !== s).map(([p]) => p);
  if (stale.length) { console.error('Out of date; run node sports-live/build-magazine.mjs:', stale.join(', ')); process.exit(1); }
  console.log('Magazine build is current.');
} else {
  for (const [p, s] of Object.entries(outputs)) writeFileSync(join(repo, p), s);
  console.log(`magazine.js ${js.length} chars (${Buffer.byteLength(js)} bytes), magazine-frame.html ${frame.length} chars; issue ${issue.id}; build ${build}`);
}
