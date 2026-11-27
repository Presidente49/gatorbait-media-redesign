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
const NEWS = VARIANT === 'gatorbait-news'; // GatorBait News, the midweek news edition: the postgame skin and blocks plus src/magazine-news.{js,css}
const POSTGAME = VARIANT === 'postgame' || /-postgame$/.test(VARIANT) || NEWS; // 'georgia-postgame' etc. use the postgame skin and loader fixture, built to sports-live/magazine-<variant>.js
// Strip editorial meta (notes to the compiler) so the bundle carries only what renders; everything else goes through untouched.
const META = new Set(['$comment', 'todo']);
const strip = (v) => Array.isArray(v) ? v.map(strip) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !META.has(k)).map(([k, x]) => [k, strip(x)])) : v;
const issue = strip(JSON.parse(read(VARIANT ? 'sports-live/magazine-issue-' + VARIANT + '.json' : 'sports-live/magazine-issue.json')));
if (!issue.id || !issue.cover || !issue.cover.url) { console.error('magazine-issue.json needs an id and a cover with a url'); process.exit(1); }

// Pregame standards (owner rule, Nov. 20, 2026: both teams' rosters and a schedule, up and visible). Opt-in by data: the two
// sections' renderer and skin (src/magazine-pregame-standards.{js,css}) are bundled, and hooked into renderPregame, only when the
// issue carries teamSchedules or teamRosters. An edition without those keys builds byte-identical to before. The same file renders
// issue.exclusives (stories written for the issue), so an edition that wants those carries the standards too.
const STANDARDS = !POSTGAME && issue.layout === 'pregame' && Boolean(issue.teamSchedules || issue.teamRosters);
const FSU_STORIES = !POSTGAME && VARIANT === 'fsu' && issue.id === '2026-11-27-florida-at-florida-state' && issue.storiesFirst === true;
const VIDEOS = !FSU_STORIES && !POSTGAME && issue.layout === 'pregame' && Boolean(issue.videos && Array.isArray(issue.videos.items) && issue.videos.items.length);
const css = (read('sports-live/src/magazine.css') + read(POSTGAME ? 'sports-live/src/magazine-postgame.css' : 'sports-live/src/magazine-pregame.css') + (NEWS ? read('sports-live/src/magazine-news.css') : '') + (STANDARDS ? read('sports-live/src/magazine-pregame-standards.css') : '') + (VIDEOS ? read('sports-live/src/magazine-pregame-videos.css') : '') + (FSU_STORIES ? read('sports-live/src/magazine-fsu-stories.css') : '')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '\n').trim();
// capture.js goes first: magazine.js mounts synchronously at its end, and the postgame signup needs window.GBM_CAPTURE by then.
const runtimeBase = (POSTGAME ? read('sports-live/src/capture.js') + '\n;' : '') + read('sports-live/src/magazine.js') + read('sports-live/src/magazine-feed.js') + read('sports-live/src/magazine-pregame.js') +
  (POSTGAME ? '\n' + read('sports-live/src/magazine-postgame.js') : '');
// The Wednesday Edition is a link-card issue: only the one hard-coded edition note differs from the weekly renderer.
const baseRuntime = VARIANT === 'wednesday' ? runtimeBase.replace('Six complete articles \u00b7 October 1 edition', 'Twelve stories \u00b7 Wednesday Edition, October 7') :
  // GatorBait News: route the postgame render and start hooks to src/magazine-news.js when the issue sets "news": true. That file reuses the
  // postgame blocks under new section ids (nwAs(pmBox, D, 'schedule', 'box') reads D.schedule and emits #pm-schedule) and adds the matchup card,
  // its kickoff countdown (the only timer: one tick a minute, cleared on remount, blank after kickoff) and the membership block.
  NEWS ? newsRuntime(runtimeBase + '\n' + read('sports-live/src/magazine-news.js')) :
  STANDARDS ? standardsRuntime(runtimeBase + read('sports-live/src/magazine-pregame-standards.js')) : runtimeBase;
const runtime = FSU_STORIES ? fsuStoriesRuntime(baseRuntime + read('sports-live/src/magazine-fsu-stories.js')) : VIDEOS ? videosRuntime(baseRuntime + read('sports-live/src/magazine-pregame-videos.js')) : baseRuntime;
function fsuStoriesRuntime(code) {
  if (!STANDARDS || issue.liveFeed !== false || issue.videos || issue.cards) throw new Error('FSU story-first requires standards, liveFeed:false and no video/card blocks');
  const groups = [issue.features?.items || [], issue.exclusives?.items || []];
  if (groups.some(items => !Array.isArray(items) || items.length > 24)) throw new Error('FSU story group exceeds its explicit 24-story limit');
  const stories = [issue.lead, issue.feature, ...groups.flat()];
  if (stories.some(s => !s || !String(s.title || '').trim() || !String(s.author || '').trim() || typeof s.html !== 'string' || !s.html.trim())) throw new Error('FSU requires a complete title/byline/body for every story slot');
  if (new Set(stories.map(s => s.title.trim())).size !== stories.length) throw new Error('FSU story titles must be unique');
  const ids = ['pg-lead', 'pg-feature', ...groups[0].map((_, i) => 'pg-feat-' + (i + 1)), ...groups[1].map((_, i) => 'pg-excl-' + (i + 1))];
  if (issue.blackFriday && !ids.includes(issue.blackFriday.target)) throw new Error('Black Friday target is not a rendered FSU story');
  const from = 'return renderPregame(D);';
  if (code.split(from).length !== 2) throw new Error('FSU story-first dispatch not found exactly once');
  return code.replace(from, 'return renderFsuStories(D);');
}
function videosRuntime(code) {
  const swaps = [['pgNumbers(D) + pgWatch(D)', 'pgNumbers(D) + pgVideos(D) + pgWatch(D)'], ['pgPrintInit(root); pgStop();', 'pgPrintInit(root); pgVideosStart(root); pgStop();']];
  if (STANDARDS) swaps.push(["if (!label) return '';\n    if (pgShotsTop(D)", "if (!label) return '';\n    if (pgVideoItems(D).length) links.push('<a href=\"#pg-videos\">Videos</a>');\n    if (pgShotsTop(D)"]);
  else swaps.push(["pgCover(D) + '<div class=\"pg-grid\">'", "pgCover(D) + pgVideoNav(D) + '<div class=\"pg-grid\">'"]);
  for (const [from, to] of swaps) { if (code.split(from).length !== 2) throw new Error('Pregame videos hook not found exactly once: ' + from); code = code.replace(from, to); }
  return code;
}
function newsRuntime(code) {
  const swaps = [['return renderPostgame(D); //', 'return (D.news ? renderNews : renderPostgame)(D); //'], ["if (D.layout === 'postgame') pmStart(m);", "if (D.layout === 'postgame') { pmStart(m); if (D.news) nwStart(m); }"]];
  for (const [from, to] of swaps) { if (code.split(from).length !== 2) throw new Error('GatorBait News hook not found exactly once: ' + from); code = code.replace(from, to); }
  return code;
}
// Pregame standards: a jump strip under the cover, the schedules ahead of the tale of the tape, the rosters after the story cards.
function standardsRuntime(code) {
  const swaps = [["pgCover(D) + '<div class=\"pg-grid\">'", "pgCover(D) + pgStdNav(D) + pgShotsTop(D) + '<div class=\"pg-grid\">'"], ['pgWatch(D) + pgTape(D)', 'pgWatch(D) + pgTeamSchedules(D) + pgTape(D)'], ['pgCards(D) + pgShots(D)', 'pgCards(D) + pgTeamRosters(D) + pgShotsEnd(D)'],
    ["'\">Read the column</a></div>'", "'\">' + esc(text(C.cta, 30) || 'Read the column') + '</a></div>'"], // the cover button can carry its own label (cover.cta), e.g. "Live updates" on game day
    ['pgSlate(D) + pgCards(D)', 'pgSlate(D) + pgFeatures(D) + pgExclusives(D) + pgCards(D)']]; // the writers' pieces in full (issue.features), then the magazine-only stories (issue.exclusives), between the Sooth Board and the story cards
  for (const [from, to] of swaps) { if (code.split(from).length !== 2) throw new Error('Pregame standards hook not found exactly once: ' + from); code = code.replace(from, to); }
  return code;
}
// Photo credits the homepage already verified (front-page.config.json), so the live card refresh can credit a new card's photo.
const credits = JSON.parse(read('sports-live/front-page.config.json')).credits || {};
// Every edition repeats these page selectors hundreds of times. Store each as one character and
// expand it before injection, preserving the exact CSS bytes. A literal token in future source
// falls back to plain CSS rather than changing its meaning; the normal size budget still applies.
const PM_SEL = '#gbm-magazine-page.pm';
const MZ_SEL = '#gbm-magazine-page.mz26 '; // second token (tilde, absent from the CSS): 290 more repeats, ~6 KB
const cssExpression = css.includes('`') || css.includes('~') ? JSON.stringify(css) :
  JSON.stringify(css.split(PM_SEL).join('`').split(MZ_SEL).join('~')) + '.split("~").join("' + MZ_SEL + '").split("`").join("' + PM_SEL + '")';
// The story-first FSU issue alone has a 304 KiB budget for complete native articles and all reference widgets. Legacy FSU remains272 KiB.
const MAX_JS = (FSU_STORIES ? 304 : VARIANT === 'fsu' ? 272 : POSTGAME ? 212 : 216) * 1024; // pregame cap 192 -> 216 KB on Nov. 21 for the Vanderbilt game-day edition: four writers' pregame pieces in full (owner direction: "add all the pregame articles to that magazine") // pregame cap 184 -> 192 KB on Nov. 20 for the Vanderbilt edition: the availability report, four issue stories and their art, on top of both rosters and schedules (owner direction) // postgame cap 200 -> 212 KB on Nov. 2 for the white-and-orange overhaul and 11 added stories // postgame cap 190 -> 200 KB on Oct. 18 for the Texas web edition (score by score, box score, watch, download) // weekly cap raised 180 -> 184 KB on Oct. 16 for the pregame network skin; the weekly loader is retired, the cap guards the shared source // postgame bundle carries the weekly + pregame renderers plus the postgame layout (SC issue added a Texas look-ahead section)

// A Magazine edition gets one visual treatment for each source asset. Repeated art makes a
// roundup feel accidentally templated, even when the same file arrives by a different Wix cut.
// Keep the test at build time so the issue cannot be pinned live with an accidental repeat.
function imageAssetId(image) {
  const value = typeof image === 'string' ? image : image && typeof image === 'object' ? image.id : '';
  const match = String(value || '').match(/(?:^|\/)([0-9a-f]+_[0-9a-f]{32})(?:~mv2\.(?:jpe?g|png|webp|avif))?/i);
  return match ? match[1].toLowerCase() : '';
}
function assertUniqueRenderedImages(value, path = '$', seen = new Map()) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) { value.forEach((item, index) => assertUniqueRenderedImages(item, `${path}[${index}]`, seen)); return; }
  for (const [key, child] of Object.entries(value)) {
    const imageLike = key === 'image' || key === 'figure' || (key === 'photos' && Array.isArray(child));
    const images = key === 'photos' && Array.isArray(child) ? child : imageLike ? [child] : [];
    for (let index = 0; index < images.length; index++) {
      const id = imageAssetId(images[index]);
      if (!id) continue;
      const slot = key === 'photos' ? `${path}.${key}[${index}]` : `${path}.${key}`;
      const prior = seen.get(id);
      if (prior) throw new Error(`Duplicate rendered Magazine image asset ${id}: ${prior} and ${slot}`);
      seen.set(id, slot);
    }
    if (key !== 'image' && key !== 'figure' && key !== 'photos') assertUniqueRenderedImages(child, `${path}.${key}`, seen);
  }
}
assertUniqueRenderedImages(issue);

const build = createHash('sha1').update(css + runtime + JSON.stringify(issue) + JSON.stringify(credits)).digest('hex').slice(0, 8);
const banner = `/* GatorBait Magazine 2026: the weekly web issue on /magazine. Issue ${issue.id}, build ${build}.
 * BUILT, MINIFIED FILE: edit sports-live/src/magazine.{css,js} or sports-live/magazine-issue.json, then run:
 * NODE_PATH=<dir with esbuild> node sports-live/build-magazine.mjs
 */
`;
const js = minify(`(function () {
  'use strict';
  var CSS = ${cssExpression};
  var ISSUE = ${JSON.stringify(issue)};
  var BUILD = ${JSON.stringify(build)};
  var CREDITS = ${JSON.stringify(credits)};
${runtime}})();
`, banner);

// Fixture: the Home Code loader's Barlow link (it is injected on every page, /magazine included), the mobile shell's
// critical CSS, the real Magazine loader, and a stand-in for the native Wix page the loader must hide.
const homeLoader = read('deploy/wix-served/homepage-embed-cdn.html');
const shellCss = (homeLoader.match(/<style id="gbm-mobile-shell-critical-v2">[\s\S]*?<\/style>/) || [''])[0];
// Postgame uses the confirmed postgame pointer, not the retired pregame rev-73 loader.
const loader = POSTGAME ? read('deploy/magazine-2026/postgame-texas-web/candidate-loader.html').split('magazine-postgame.js').join('magazine-' + VARIANT + '.js') : read('deploy/magazine-2026/magazine-loader-v1.html'); // the fixture loader names the bundle it pins
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
