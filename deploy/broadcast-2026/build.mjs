// Swamp Night S2 build: saved production CSS + asserted replacements -> proposed embed HTML.
// node deploy/broadcast-2026/build.mjs   (writes <id>/proposed.html, prints length and djb2)
import fs from 'fs';
const D = new URL('.', import.meta.url).pathname;
const djb2 = t => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return (h >>> 0).toString(16); };
function apply(src, reps) {
  for (const [from, to, n = 1] of reps) {
    const got = src.split(from).length - 1;
    if (got !== n) throw new Error(`expected ${n} x ${JSON.stringify(from.slice(0, 80))}, found ${got}`);
    src = src.split(from).join(to);
  }
  return src;
}
const min = css => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n+/g, '').trim();
const SET = 'linear-gradient(115deg,transparent 0 62%,rgba(255,255,255,.035) 62% 63%,transparent 63%),linear-gradient(180deg,#0021a5 0,#0a1a6b 560px,#061247 100%)';
const NIGHT = 'radial-gradient(ellipse at 0 100%,rgba(250,70,22,.13),transparent 55%),linear-gradient(180deg,#07122e,#0b0d12)';
const out = {};

// c4b41f6a Section nav: replace the existing skin; preserve the current markup and script.
out['c4b41f6a'] = apply(fs.readFileSync(D + 'c4b41f6a/rev1.html', 'utf8'), [
  [`'<div class="sn-top"><span class="sn-k">'+esc(i.k)+'</span>`, `'<div class="sn-top"><span class="sn-k"><b>GB</b><i>'+esc(i.k)+'</i></span>`],
  ['</style><script id="gbm-sn-js">', '</style><style id="gbm-bc-s2">' + min(fs.readFileSync(D + 'c4b41f6a/broadcast-skin.css', 'utf8')) + '</style><script id="gbm-sn-js">'],
]);

// Rebuild the current feed depth layer from its saved pre-depth base, with the Swamp Night set.
const SET2 = NIGHT;
const depth = min(fs.readFileSync(D + '602fb362/depth.css', 'utf8')).replace(/\bP /g, 'html body #SITE_PAGES #gbm-lp ').replace(/\bS /g, 'html body #SITE_PAGES #gbm-sn ');
let cand = apply(fs.readFileSync(D + '602fb362/rev16.html', 'utf8'), [
  [`#SITE_PAGES{background:${SET}!important}`, `#SITE_PAGES{background:${SET2}!important}`],
  ['</style>', '</style><style id="gbm-bc-s2-depth">' + depth + '</style>'],
]);
// Keep native fallback cards in the same restrained palette. No markup or runtime edits.
const nightFallback = html => html.replaceAll('#e8edff', '#f5f4ef').replaceAll('#9fb0ff', '#bdc5d5').replaceAll('#ffb39a', '#f5f4ef').replaceAll('#040c30', '#07122e').replaceAll('#f2b632', '#fa4616');
cand = nightFallback(cand);
out['602fb362'] = cand;
if (cand.length > 15000) throw new Error(`candidate is ${cand.length} chars`);
fs.writeFileSync(`${D}602fb362/rev17-candidate.html`, cand);
console.log('602fb362 rev17 candidate', cand.length, djb2(cand));

for (const [id, html] of Object.entries(out)) {
  if (html.length > 15000) throw new Error(`${id} is ${html.length} chars`);
  fs.writeFileSync(`${D}${id}/proposed.html`, html);
  console.log(id, html.length, djb2(html));
}
