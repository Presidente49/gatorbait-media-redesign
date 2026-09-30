#!/usr/bin/env node
// Builds the Home Code loader (embed 622d8ece) for a given main commit.
// Usage: node deploy/front-page-2026/make-loader.mjs <40-hex commit> [> deploy/front-page-2026/home-code-loader-<sha7>.html]
//
// V3 loader (Sept. 30): Wix kept serving stale homepage HTML to desktop visitors for 30-45 minutes after an
// embed PATCH, so the loader no longer hard-pins the build. It asks GitHub Pages for sports-live/current.json
// (the commit main says is live), loads homepage.js from jsDelivr at that commit, and falls back to the commit
// baked in here when the pointer is slow (800 ms), missing or malformed, or when that build fails to download.
// Deploying a new build is then a commit to main that changes current.json; the embed only changes when the
// fallback commit should move. Rollback of the pointer: change current.json back; rollback of the embed: PATCH
// the previous loader file.
import { createHash } from 'node:crypto';

const commit = process.argv[2] || '';
if (!/^[0-9a-f]{40}$/.test(commit)) { console.error('need a 40-hex commit'); process.exit(1); }
const short = commit.slice(0, 7);
// V4 (Sept. 30, speed cut): the same loader, preceded by preconnects for the three hosts the front page needs and the one
// Barlow + Barlow Condensed stylesheet in <head> (media=print until it loads, so it never blocks first paint), so the font
// chain starts with the HTML instead of after the bundle runs
// (speed run 36757168414: the fonts CSS request began at 6.8 s on a throttled phone). front-page.js skips its own font
// link when this one exists. The embed is injected on every page, which is intended: the header, footer and cards all use Barlow.
const links = `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin><link rel="preconnect" href="https://presidente49.github.io"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link id="gbm-fonts" rel="stylesheet" media="print" onload="this.media='all'" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap">`;
const html = `<!-- GBM_HOME_CODE_V4 front-page-2026 src=${short} pointer=sports-live/current.json -->${links}<script>window.__GBM_HOME_JS__=function(){var d='${commit}',u='https://presidente49.github.io/gatorbait-media-redesign/sports-live/current.json?t='+Math.floor(Date.now()/6e4),done=false;function go(c){if(done)return;done=true;var s=document.createElement('script');s.id='gbm-fp26-bundle';s.async=true;s.setAttribute('data-commit',c);s.src='https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@'+c+'/sports-live/homepage.js';s.onerror=function(){s.remove();if(c!==d){done=false;go(d);}else window.__GBM_GAZETTE_BOOT__&&window.__GBM_GAZETTE_BOOT__.fallback('front page download failed');};document.head.appendChild(s);}var t=setTimeout(function(){go(d);},800);fetch(u,{cache:'no-store',credentials:'omit'}).then(function(r){return r.json();}).then(function(j){clearTimeout(t);go(j&&/^[0-9a-f]{40}$/.test(j.commit)?j.commit:d);}).catch(function(){clearTimeout(t);go(d);});};window.__GBM_HOME_PART__&&window.__GBM_HOME_PART__();</script>`;
let h = 5381; for (let i = 0; i < html.length; i++) h = ((h * 33) ^ html.charCodeAt(i)) >>> 0;
if (process.argv.includes('--info')) console.error(`loader ${html.length} chars, djb2 ${h}, sha1 ${createHash('sha1').update(html).digest('hex').slice(0, 8)}`);
process.stdout.write(html);
