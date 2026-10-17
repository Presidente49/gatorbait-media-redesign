// Usage: node make-loader.mjs <40-hex main commit>  -> writes loader-<sha7>.html, prints length and djb2 fingerprint.
import { writeFileSync } from 'node:fs';
const sha = process.argv[2];
if (!/^[0-9a-f]{40}$/.test(sha || '')) { console.error('need a 40-hex commit'); process.exit(1); }
const src = `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@${sha}/sports-live/broadcast-home.js`;
const html = `<!-- GBM_BROADCAST_HOME_V1 src=${sha.slice(0, 7)} Broadcast S1; source deploy/broadcast-2026/0c13f955/; rollback rev2.html -->` +
`<style id="gbm-bc-wait">html.gbm-bc-wait #gbm-live.gbm-gazette{visibility:hidden}</style>` +
`<script id="gbm-bc-loader">(function(){var p=(location.pathname||'/').replace(/\\/+$/,'')||'/';if(p!=='/'||window.__GBM_BC_HOME__)return;` +
`var d=document.documentElement,u=function(){d.classList.remove('gbm-bc-wait');};d.classList.add('gbm-bc-wait');setTimeout(u,2500);` +
`var s=document.createElement('script');s.src='${src}';s.onerror=u;(document.head||d).appendChild(s);})();</script>`;
let h = 5381; for (let i = 0; i < html.length; i++) h = ((h << 5) + h + html.charCodeAt(i)) | 0;
const out = new URL(`./loader-${sha.slice(0, 7)}.html`, import.meta.url);
writeFileSync(out, html);
console.log(out.pathname, html.length, (h >>> 0).toString(16));
