// Usage:
//   node make-loader.mjs <40-hex main commit>        -> loader-<sha7>.html (v1, single pinned sha; kept for rollback use)
//   node make-loader.mjs --v2 <40-hex baked sha>     -> rev16.html (v2, runtime-pin bootstrap; asks sports-live/broadcast-pin.json for the sha)
//   node make-loader.mjs --rev15                     -> rev15.html (exact live text of embed revision 15, for rollback)
// Prints output path, length and djb2 fingerprint. Markers GBM_BROADCAST_HOME_V1, gbm-bc-wait and gbm-bc-loader stay stable in all outputs.
import { writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
const v2 = args[0] === '--v2';
const rev15 = args[0] === '--rev15';
const sha = rev15 ? 'd86a94461fa2c8e205fc5bfb678bd56f68a40118' : v2 ? args[1] : args[0];
if (!/^[0-9a-f]{40}$/.test(sha || '')) { console.error('need a 40-hex commit'); process.exit(1); }
const CDN = 'https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@';
const PIN = 'https://presidente49.github.io/gatorbait-media-redesign/sports-live/broadcast-pin.json';
const STYLE = `<style id="gbm-bc-wait">html.gbm-bc-wait #gbm-live.gbm-gazette{visibility:hidden}</style>`;
const GUARD = `var p=(location.pathname||'/').replace(/\\/+$/,'')||'/';if(p!=='/'||window.__GBM_BC_HOME__)return;`;
const WAIT = `var d=document.documentElement,u=function(){d.classList.remove('gbm-bc-wait');};d.classList.add('gbm-bc-wait');setTimeout(u,2500);`;
let html, name;
if (!v2) {
  const tag = rev15 ? '10bf364' : sha.slice(0, 7);
  html = `<!-- GBM_BROADCAST_HOME_V1 src=${tag} Broadcast S1; source deploy/broadcast-2026/0c13f955/; rollback rev2.html -->` + STYLE +
  `<script id="gbm-bc-loader">(function(){${GUARD}${WAIT}` +
  `var s=document.createElement('script');s.src='${CDN}${sha}/sports-live/broadcast-home.js';s.onerror=u;(document.head||d).appendChild(s);})();</script>`;
  name = rev15 ? 'rev15.html' : `loader-${sha.slice(0, 7)}.html`;
} else {
  // Ask the pin file for the current sha. Fall back to the baked sha after 1200 ms or on any failure. Inject once.
  // A bad pinned sha (script error) falls back to the baked sha once; if that errors too, unhide.
  const js = `(function(){${GUARD}${WAIT}` +
  `var B='${sha}',n=0,t,L=function(h,f){var s=document.createElement('script');s.src='${CDN}'+h+'/sports-live/broadcast-home.js';s.onerror=f;(document.head||d).appendChild(s);},` +
  `g=function(h){if(n)return;n=1;clearTimeout(t);L(h,h===B?u:function(){L(B,u);});};` +
  `t=setTimeout(function(){g(B);},1200);` +
  `try{fetch('${PIN}?t='+Math.floor(Date.now()/6e4),{cache:'no-store',credentials:'omit'}).then(function(r){if(!r.ok)throw 0;return r.json();})` +
  `.then(function(j){g(j&&typeof j.sha==='string'&&/^[0-9a-f]{40}$/.test(j.sha)?j.sha:B);}).catch(function(){g(B);});}catch(e){g(B);}})();`;
  html = `<!-- GBM_BROADCAST_HOME_V1 pin=runtime baked=${sha.slice(0, 7)} Broadcast S1; source deploy/broadcast-2026/0c13f955/make-loader.mjs --v2; rollback rev15.html, or edit sports-live/broadcast-pin.json -->` +
  STYLE + `<script id="gbm-bc-loader">${js}</script>`;
  name = 'rev16.html';
}
let h = 5381; for (let i = 0; i < html.length; i++) h = ((h << 5) + h + html.charCodeAt(i)) | 0;
const out = new URL(`./${name}`, import.meta.url);
writeFileSync(out, html);
console.log(out.pathname, html.length, (h >>> 0).toString(16));
