#!/usr/bin/env node
// Builds sports-live/homepage.js (Front Page 2026) and its fixtures from:
//   sports-live/src/front-page.css, sports-live/src/front-page.js, sports-live/src/share.js, sports-live/src/capture.js, sports-live/src/story-kit.js,
//   the fan modules sports-live/src/{make-the-call.js,make-the-call.css,ask-gatorbait.js,the-stands.js}
//   (mounted only when deploy/cloudflare/endpoints.json names their Workers),
//   sports-live/front-page.config.json and the newest stories in gazette-live/posts.json.
// Usage: node sports-live/build-front-page.mjs [--check]
//   --check exits 1 if the committed outputs differ from a fresh build. The bundled story snapshot
//   follows gazette-live/posts.json, which the feed workflow refreshes every 5 minutes, so run
//   --check right after a rebuild, not as a standing CI gate.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// esbuild minifies the outputs (NODE_PATH=<dir with esbuild>); the shell build uses the same package.
const esbuild = createRequire(import.meta.url)('esbuild');
const minify = (code, banner) => banner + esbuild.transformSync(code, { minify: true, target: 'es2017', legalComments: 'none', charset: 'utf8' }).code;

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const read = (p) => readFileSync(join(repo, p), 'utf8');

const minCss = (p) => read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '\n').trim();
const css = minCss('sports-live/src/front-page.css');
const mtcCss = minCss('sports-live/src/make-the-call.css');
const runtime = read('sports-live/src/front-page.js');
// Story pages: Share GatorBait, the Magazine signup (capture.js), then the Story Kit (guide strip, first-mention links, "Keep up with the Gators"); both ship in
// the standalone sports-live/share.js that the blog post embed loads and ride along in homepage.js (the kit exits off /post/).
// Story pages get all three in sports-live/share.js. The homepage bundle carries only Share + Capture: the Story Kit exits on
// line 1 off /post/ and was 18 KB of dead weight there (bundle analysis, Sept. 30).
const shareHome = read('sports-live/src/share.js') + '\n/* GatorBait Capture (sports-live/src/capture.js): the "Get GatorBait Magazine free" signup for story pages and the homepage hub. */\n' + read('sports-live/src/capture.js');
const share = shareHome + '\n/* GatorBait Story Kit (sports-live/src/story-kit.js): guide strip, first-mention links, "Keep up with the Gators" cards on story pages. */\n' + read('sports-live/src/story-kit.js');
// Fan modules: each an IIFE that only defines window.GBM_CALL / GBM_ASK / GBM_STANDS; front-page.js mounts them after paint.
const modules = ['make-the-call', 'ask-gatorbait', 'the-stands'].map((m) => `/* ${m} (sports-live/src/${m}.js) */\n` + read(`sports-live/src/${m}.js`)).join('\n');
// The fan modules ship as their own chunk, sports-live/fan-modules.js, fetched by front-page.js only once
// deploy/cloudflare/endpoints.json names a Worker (44 KB raw that every homepage visit carried for nothing until then).
const fanChunk = `(function () { if (document.getElementById('gbm-fp-mtc-css')) return; var s = document.createElement('style'); s.id = 'gbm-fp-mtc-css'; s.textContent = ${JSON.stringify(mtcCss)}; document.head.appendChild(s); })();
${modules}
`;
const MAX_JS = 260 * 1024;
const config = JSON.parse(read('sports-live/front-page.config.json'));
const feed = JSON.parse(read('gazette-live/posts.json'));

const posts = feed.posts.slice(0, 20).map((p) => ({
  title: p.title, excerpt: String(p.excerpt || '').slice(0, 320), url: p.url, author: p.author,
  firstPublishedDate: p.firstPublishedDate,
  image: p.image ? { src: p.image.src, width: p.image.width, height: p.image.height, alt: p.image.alt } : null,
}));
const newest = posts.map((p) => p.firstPublishedDate).sort().pop();
const { $comment, ...cfg } = config;
// Curated Magazine preview: snapshot of the current live issue, never an arbitrary news post.
cfg.magazine = JSON.parse(read('sports-live/magazine-card.json'));
// Bundle the season schedule from the scoreboard job's feed, so The Road Ahead band paints even when the
// live scoreboard fetch misses the 1.5 s paint budget (phones did on Sept. 30); the fetch then patches it.
const repoScoreboard = existsSync(join(repo, 'sports-live/scoreboard.json')) ? JSON.parse(read('sports-live/scoreboard.json')) : null;
if (repoScoreboard && Array.isArray(repoScoreboard.schedule)) {
  cfg.scoreboard = { ...cfg.scoreboard, schedule: repoScoreboard.schedule.slice(0, 20).map((g) => ({
    date: g.date, opponent: g.opponent, opponentRank: g.opponentRank ?? null, home: g.home === true, status: g.status || '',
    score: g.score && Number.isFinite(g.score.fla) && Number.isFinite(g.score.opp) ? { fla: g.score.fla, opp: g.score.opp } : null, tv: g.tv || '', storyUrl: g.storyUrl || '',
  })) };
  // The Tunnel prints the opponent's record under its name (front-page.js reads next.opponentRecord) and Make the Call keys
  // its picks on the ESPN event id. Both ride in the bundle only for the same opponent the config names, so a stale config
  // never wears another team's record or game.
  const nx = repoScoreboard.next, cn = cfg.scoreboard.next;
  if (nx && cn && nx.opponent === cn.opponent) {
    if (/^\d+-\d+$/.test(String(nx.opponentRecord || ''))) cfg.scoreboard.next = { ...cfg.scoreboard.next, opponentRecord: nx.opponentRecord };
    if (/^\d{6,12}$/.test(String(nx.eventId || ''))) cfg.scoreboard.next = { ...cfg.scoreboard.next, eventId: String(nx.eventId) };
  }
}
// Build stamp: the page exposes it as data-fp-build, so live QC and screenshots prove which build actually ran
// (Wix edges served an older embed revision for a while after a PATCH on Sept. 30).
const build = createHash('sha1').update(css + runtime + share + modules + JSON.stringify(cfg)).digest('hex').slice(0, 8);
const bundle = { snapshot: newest, build, ...cfg, posts };

const banner = `/* GatorBait Front Page 2026: magazine front page, broadcast layer, Swamp Night palette, hub.
 * BUILT, MINIFIED FILE: edit sports-live/src/front-page.{css,js} or sports-live/front-page.config.json,
 * then run: NODE_PATH=<dir with esbuild> node sports-live/build-front-page.mjs
 * Bundled story snapshot: ${newest} (fallback only; live stories come from /blog-feed.xml). Build ${build}.
 */
`;
const js = minify(`(function () {
  'use strict';
  var CSS = ${JSON.stringify(css)};
  var BUNDLE = ${JSON.stringify(bundle)};
${runtime}})();
/* Share GatorBait (sports-live/src/share.js) + Capture: the standalone sports-live/share.js for blog post pages adds the Story Kit. */
${shareHome}
`, banner);
const shareOut = minify(share, `/* GatorBait Share + Capture + Story Kit for /post/ pages. BUILT, MINIFIED FILE: edit sports-live/src/{share,capture,story-kit}.js, then run the front page build. Build ${build}. */\n`);
const fanOut = minify(fanChunk, `/* GatorBait fan modules (Make the Call, Ask GatorBait, The Stands). BUILT, MINIFIED FILE: edit sports-live/src/{make-the-call,ask-gatorbait,the-stands}.js, then run the front page build. Build ${build}. */\n`);

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

if (Buffer.byteLength(js) > MAX_JS) { console.error(`homepage.js is ${Buffer.byteLength(js)} bytes; the limit is ${MAX_JS}`); process.exit(1); }
const outputs = { 'sports-live/homepage.js': js, 'sports-live/share.js': shareOut, 'sports-live/fan-modules.js': fanOut, 'sports-live/frame.html': frame, 'sports-live/qa.html': qa };
if (process.argv.includes('--check')) {
  const stale = Object.entries(outputs).filter(([p, s]) => read(p) !== s).map(([p]) => p);
  if (stale.length) { console.error('Out of date; run node sports-live/build-front-page.mjs:', stale.join(', ')); process.exit(1); }
  console.log('Front page build is current.');
} else {
  for (const [p, s] of Object.entries(outputs)) writeFileSync(join(repo, p), s);
  console.log(`homepage.js ${js.length} chars (${Buffer.byteLength(js)} bytes), share.js ${Buffer.byteLength(shareOut)} bytes, fan-modules.js ${Buffer.byteLength(fanOut)} bytes, frame.html ${frame.length} chars; snapshot ${newest}; ${posts.length} bundled stories`);
}
