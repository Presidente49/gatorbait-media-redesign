#!/usr/bin/env node
// Builds sports-live/homepage.js (Front Page 2026) and its fixtures from:
//   sports-live/src/front-page.css, sports-live/src/front-page.js,
//   sports-live/front-page.config.json and the newest stories in gazette-live/posts.json.
// Usage: node sports-live/build-front-page.mjs [--check]
//   --check exits 1 if the committed outputs differ from a fresh build. The bundled story snapshot
//   follows gazette-live/posts.json, which the feed workflow refreshes every 5 minutes, so run
//   --check right after a rebuild, not as a standing CI gate.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const read = (p) => readFileSync(join(repo, p), 'utf8');

const css = read('sports-live/src/front-page.css').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '\n').trim();
const runtime = read('sports-live/src/front-page.js');
const config = JSON.parse(read('sports-live/front-page.config.json'));
const feed = JSON.parse(read('gazette-live/posts.json'));

const posts = feed.posts.slice(0, 16).map((p) => ({
  title: p.title, excerpt: String(p.excerpt || '').slice(0, 320), url: p.url, author: p.author,
  firstPublishedDate: p.firstPublishedDate,
  image: p.image ? { src: p.image.src, width: p.image.width, height: p.image.height, alt: p.image.alt } : null,
}));
const newest = posts.map((p) => p.firstPublishedDate).sort().pop();
const { $comment, ...cfg } = config;
const bundle = { snapshot: newest, ...cfg, posts };

const js = `/* GatorBait Front Page 2026: magazine front page, broadcast layer, Swamp Night palette, hub.
 * BUILT FILE: edit sports-live/src/front-page.{css,js} or sports-live/front-page.config.json,
 * then run: node sports-live/build-front-page.mjs
 * Bundled story snapshot: ${newest} (fallback only; live stories come from /blog-feed.xml).
 */
(function () {
  'use strict';
  var CSS = ${JSON.stringify(css)};
  var BUNDLE = ${JSON.stringify(bundle)};
${runtime}})();
`;

// Fixture: the real loader's mobile-shell critical CSS, a shell host stub and the built renderer inline.
const loader = read('deploy/wix-served/homepage-embed-cdn.html');
const shellCss = (loader.match(/<style id="gbm-mobile-shell-critical-v2">[\s\S]*?<\/style>/) || [''])[0];
const frame = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>GatorBait Front Page 2026 fixture</title>
${shellCss}
<style>body{margin:0}#gbm-footer{padding:32px 16px;color:#fff;font:600 14px/1.4 "Barlow",sans-serif}</style>
</head><body>
<div id="gbm-mobile-shell-host"><div id="gbm-mobile-shell"><a class="gbm-ms-logo" href="/"><img src="https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp" alt="GatorBait" width="180" height="48"></a><button class="gbm-ms-trigger" type="button" aria-label="Open menu"><span class="gbm-ms-bars"><i></i><i></i><i></i></span>Menu</button></div></div>
<footer id="gbm-footer">GatorBait footer (fixture stub)</footer>
<script>
${js}</script>
</body></html>
`;
const qa = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>GatorBait Front Page 2026 QA</title>
<style>body{margin:16px;font:14px/1.4 "Barlow",sans-serif;background:#ddd}iframe{display:block;margin:0 0 24px;border:1px solid #999;background:#fff}h2{margin:24px 0 8px}</style></head><body>
<p>Same built renderer (frame.html) at isolated viewports. Add <code>?gbm_fp=day|night|gameday</code> to force a mode. For real-origin interaction tests run <code>node sports-live/qa-front-page.mjs</code>.</p>
${[['Day', 'day'], ['Swamp Night', 'night'], ['Game day', 'gameday']].map(([label, m]) => `<h2>${label}</h2>` + [320, 390, 430, 1366].map((w) => `<iframe title="${label} ${w}" width="${w}" height="1400" src="frame.html?gbm_fp=${m}"></iframe>`).join('')).join('\n')}
</body></html>
`;

const outputs = { 'sports-live/homepage.js': js, 'sports-live/frame.html': frame, 'sports-live/qa.html': qa };
if (process.argv.includes('--check')) {
  const stale = Object.entries(outputs).filter(([p, s]) => read(p) !== s).map(([p]) => p);
  if (stale.length) { console.error('Out of date; run node sports-live/build-front-page.mjs:', stale.join(', ')); process.exit(1); }
  console.log('Front page build is current.');
} else {
  for (const [p, s] of Object.entries(outputs)) writeFileSync(join(repo, p), s);
  console.log(`homepage.js ${js.length} chars, frame.html ${frame.length} chars; snapshot ${newest}; ${posts.length} bundled stories`);
}
