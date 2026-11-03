// Builds the 1200x630 /magazine link-share image from an issue config.
// Usage: node deploy/magazine-seo-20261103/build-share-image.mjs [issue.json] [out.jpg]
// Weekly: edit issue.json (title, edition, score, photo) and re-run. Barlow only; navy, white, one orange accent.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');

const here = dirname(fileURLToPath(import.meta.url));
const cfgPath = resolve(process.argv[2] || resolve(here, 'issue.json'));
const outPath = resolve(process.argv[3] || resolve(here, 'magazine-share-1200x630.jpg'));
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const asset = (f) => pathToFileURL(resolve(here, 'assets', f)).href;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const titleLines = (cfg.titleLines || []).map((l) => `<span>${esc(l)}</span>`).join('');
const issueHtml = () => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Barlow;font-weight:400;src:url(${asset('Barlow-400.woff2')}) format('woff2')}
@font-face{font-family:Barlow;font-weight:700;src:url(${asset('Barlow-700.woff2')}) format('woff2')}
@font-face{font-family:Barlow;font-weight:800;src:url(${asset('Barlow-800.woff2')}) format('woff2')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;background:#071439;overflow:hidden;font-family:Barlow,sans-serif;color:#fff}
.photo{position:absolute;left:0;top:0;width:470px;height:630px;object-fit:cover;object-position:50% 12%}
.fade{position:absolute;left:0;top:0;width:520px;height:630px;background:linear-gradient(90deg,#07143900 0,#07143900 62%,#071439 96%)}
.credit{position:absolute;left:28px;bottom:22px;font-size:16px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#ffffffcc;text-shadow:0 1px 4px #000a}
.txt{position:absolute;left:520px;top:48px;right:64px;bottom:44px;display:flex;flex-direction:column}
.mark{font-weight:800;font-size:60px;line-height:1;letter-spacing:.01em;text-transform:uppercase}
.mark b{color:#fa4616;font-weight:800}
.mag{margin-top:8px;font-weight:700;font-size:22px;letter-spacing:.34em;text-transform:uppercase;color:#ffffffd9}
.rule{width:96px;height:4px;background:#fa4616;margin:26px 0 20px}
.ed{font-weight:700;font-size:24px;letter-spacing:.16em;text-transform:uppercase;color:#fa4616}
h1{margin-top:10px;font-weight:800;font-size:104px;line-height:.93;text-transform:uppercase;letter-spacing:-.005em}
h1 span{display:block}
.chip{margin-top:auto;align-self:flex-start;display:flex;align-items:center;gap:18px;border:2px solid #ffffff55;padding:10px 20px 10px 18px}
.chip i{font-style:normal;font-weight:700;font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:#fa4616}
.chip s{text-decoration:none;font-weight:800;font-size:34px;letter-spacing:.03em;text-transform:uppercase}
.url{margin-top:14px;font-weight:400;font-size:22px;letter-spacing:.04em;color:#ffffffb3}
</style></head><body>
<img class="photo" src="${asset(cfg.photo)}" alt="">
<div class="fade"></div>
<div class="credit">${esc(cfg.credit)}</div>
<div class="txt">
  <div class="mark">Gator<b>Bait</b></div>
  <div class="mag">Magazine</div>
  <div class="rule"></div>
  <div class="ed">${esc(cfg.edition)}</div>
  <h1>${titleLines}</h1>
  <div class="chip"><i>${esc(cfg.score.label)}</i><s>${esc(cfg.score.text)}</s></div>
  <div class="url">${esc(cfg.url)}</div>
</div>
</body></html>`;

// Evergreen brand card (no game photo, so it never goes stale): used for the site default and homepage proposal.
const brandHtml = cfg.layout === 'brand' ? `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Barlow;font-weight:400;src:url(${asset('Barlow-400.woff2')}) format('woff2')}
@font-face{font-family:Barlow;font-weight:700;src:url(${asset('Barlow-700.woff2')}) format('woff2')}
@font-face{font-family:Barlow;font-weight:800;src:url(${asset('Barlow-800.woff2')}) format('woff2')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;background:#071439;overflow:hidden;font-family:Barlow,sans-serif;color:#fff}
.in{position:absolute;left:88px;right:88px;top:64px;bottom:64px;display:flex;flex-direction:column;justify-content:center}
.mark{font-weight:800;font-size:176px;line-height:.9;text-transform:uppercase;letter-spacing:.005em}
.mark b{color:#fa4616;font-weight:800}
.media{margin-top:10px;font-weight:700;font-size:40px;letter-spacing:.42em;text-transform:uppercase;color:#ffffffd9}
.rule{width:132px;height:6px;background:#fa4616;margin:40px 0 34px}
.tag{font-weight:800;font-size:54px;line-height:1.05;text-transform:uppercase}
.sub{margin-top:22px;font-weight:700;font-size:28px;letter-spacing:.12em;text-transform:uppercase;color:#ffffffb3}
</style></head><body><div class="in"><div class="mark">Gator<b>Bait</b></div><div class="media">Media</div><div class="rule"></div>
<div class="tag">${esc(cfg.tagline)}</div><div class="sub">${esc(cfg.sub)}</div></div></body></html>` : null;

const htmlPath = resolve(here, '.share-render.html');
writeFileSync(htmlPath, brandHtml || issueHtml());
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href);
await page.evaluate(() => document.fonts.ready);
const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight));
await page.screenshot({ path: outPath, type: 'jpeg', quality: 88 });
await browser.close();
console.log(JSON.stringify({ out: outPath, bytes: statSync(outPath).size, fontsLoaded: fonts }));
