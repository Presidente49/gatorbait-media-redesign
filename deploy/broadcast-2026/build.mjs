// Broadcast S2 build: live revision + asserted replacements -> proposed embed HTML.
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
const FEED = 'html body #SITE_PAGES [data-hook="feed-page-root"]';
const out = {};

// 602fb362 Sports Feed Cards: deep-blue set behind every feed page; native fallback list on dark.
out['602fb362'] = apply(fs.readFileSync(D + '602fb362/rev15.html', 'utf8'), [
  ['html:has([data-hook="feed-page-root"]) #SITE_PAGES{background:#fff!important}', `html:has([data-hook="feed-page-root"]) #SITE_PAGES{background:${SET}!important}`],
  ['[data-hook="feed-page-root"]{color:#11274a!important;background:#fff!important;', '[data-hook="feed-page-root"]{color:#e8edff!important;background:transparent!important;'],
  ['margin:0!important;color:#11274a!important;box-shadow:none', 'margin:0!important;color:#e8edff!important;box-shadow:none'],
  ['margin:0!important;color:#081b35!important;-webkit-text-fill-color:#081b35!important;font:800 25px', 'margin:0!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font:800 25px'],
  ['{color:#5b677a!important;-webkit-text-fill-color:#5b677a!important;', '{color:#9fb0ff!important;-webkit-text-fill-color:#9fb0ff!important;'],
  ['nav[aria-label="Blog"]{border-bottom:1px solid #d6dce4!important;background:#fff!important}', 'nav[aria-label="Blog"]{border-bottom:0!important;background:#040c30!important}'],
  ['text-transform:uppercase;color:#081b35!important;min-height:44px', 'text-transform:uppercase;color:#fff!important;min-height:44px'],
  ['>.inner-box{background:#fff!important;', '>.inner-box{background:transparent!important;'],
  ['.inner-box{background:#fff!important;box-shadow:none!important;border:0!important}\nhtml body #SITE_PAGES [data-hook="feed-page-root"] [data-hook="post-title"] h2', '.inner-box{background:transparent!important;box-shadow:none!important;border:0!important}\nhtml body #SITE_PAGES [data-hook="feed-page-root"] [data-hook="post-title"] h2'],
  [' h1{color:#081b35!important;-webkit-text-fill-color:#081b35!important;', ' h1{color:#fff!important;-webkit-text-fill-color:#fff!important;'],
  ['color:#d8450c!important;-webkit-text-fill-color:#d8450c!important;font:800 12px', 'color:#ffb39a!important;-webkit-text-fill-color:#ffb39a!important;font:800 12px'],
  [':hover [data-hook="post-title"] h2{color:#d8450c!important;-webkit-text-fill-color:#d8450c!important}', ':hover [data-hook="post-title"] h2{color:#ffb39a!important;-webkit-text-fill-color:#ffb39a!important}'],
  ['[data-hook="user-name"]{color:#081b35!important;-webkit-text-fill-color:#081b35!important;', '[data-hook="user-name"]{color:#ffb39a!important;-webkit-text-fill-color:#ffb39a!important;'],
  ['outline:3px solid #e84b10!important', 'outline:3px solid #f2b632!important'],
  ['text-decoration:none!important}\n</style>', `text-decoration:none!important}\n${FEED},${FEED} .blog-background-color,html body #SITE_PAGES .blog-background-category-color:has(#gbm-lp){background:transparent!important}\n</style>`],
]);

// c4b41f6a Section nav: Broadcast skin for #gbm-sn and #gbm-lp; kicker becomes a two-part bug.
out['c4b41f6a'] = apply(fs.readFileSync(D + 'c4b41f6a/rev1.html', 'utf8'), [
  [`'<div class="sn-top"><span class="sn-k">'+esc(i.k)+'</span>`, `'<div class="sn-top"><span class="sn-k"><b>GB</b><i>'+esc(i.k)+'</i></span>`],
  ['</style><script id="gbm-sn-js">', '</style><style id="gbm-bc-s2">' + min(fs.readFileSync(D + 'c4b41f6a/broadcast-skin.css', 'utf8')) + '</style><script id="gbm-sn-js">'],
]);

// Depth pass candidate (602fb362 rev16 -> rev17): stronger field light, then the depth layer. Built from the live rev16 copy.
const SET2 = 'radial-gradient(ellipse 90% 520px at 50% 0,#2b57ff59,#2b57ff00 70%),linear-gradient(115deg,transparent 0 57%,rgba(255,255,255,.06) 57% 59%,transparent 59% 63%,rgba(255,255,255,.035) 63% 64%,transparent 64%),linear-gradient(180deg,#0021a5 0,#0a1a6b 560px,#061247 100%)';
const depth = min(fs.readFileSync(D + '602fb362/depth.css', 'utf8')).replace(/\bP /g, 'html body #SITE_PAGES #gbm-lp ').replace(/\bS /g, 'html body #SITE_PAGES #gbm-sn ');
const cand = apply(fs.readFileSync(D + '602fb362/rev16.html', 'utf8'), [
  [`#SITE_PAGES{background:${SET}!important}`, `#SITE_PAGES{background:${SET2}!important}`],
  ['</style>', '</style><style id="gbm-bc-s2-depth">' + depth + '</style>'],
]);
if (cand.length > 15000) throw new Error(`candidate is ${cand.length} chars`);
fs.writeFileSync(`${D}602fb362/rev17-candidate.html`, cand);
console.log('602fb362 rev17 candidate', cand.length, djb2(cand));

for (const [id, html] of Object.entries(out)) {
  if (html.length > 15000) throw new Error(`${id} is ${html.length} chars`);
  fs.writeFileSync(`${D}${id}/proposed.html`, html);
  console.log(id, html.length, djb2(html));
}
