// Local-only before/after render of the homepage skin (sports-live/broadcast-home.js). No network to Wix.
// Run: PLAYWRIGHT_PKG=/opt/node22/lib/node_modules node deploy/color-proof-20261018/proof.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire((process.env.PLAYWRIGHT_PKG || '/opt/node22/lib/node_modules') + '/');
const { chromium } = require('playwright');
const R = fileURLToPath(new URL('../../', import.meta.url));
const D = R + 'deploy/color-proof-20261018/';
const posts = JSON.parse(fs.readFileSync(R + 'gazette-live/posts.json', 'utf8')).posts
  .filter(p => Date.parse(p.firstPublishedDate) <= Date.now())
  .sort((a, b) => Date.parse(b.firstPublishedDate) - Date.parse(a.firstPublishedDate));
const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const xml = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${posts.map(p => `<item><title>${x(p.title)}</title><link>${p.url}</link><pubDate>${new Date(p.firstPublishedDate).toUTCString()}</pubDate><dc:creator>${x(p.author)}</dc:creator><description>${x(p.excerpt || '')}</description>${p.image?.src ? `<enclosure url="${p.image.src}" type="image/jpeg"/>` : ''}</item>`).join('')}</channel></rss>`;
const code = fs.readFileSync(R + 'automation/sports-home/runtime.js', 'utf8').replace('__GAZETTE_PAYLOAD__', () => JSON.stringify({ css: fs.readFileSync(R + 'automation/sports-home/homepage.css', 'utf8'), fallback: { posts } }));
const js = fs.readFileSync(R + 'sports-live/broadcast-home.js', 'utf8');
const proofCss = fs.readFileSync(D + 'color-proof.css', 'utf8');
const page = after => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>${code.replace(/<\/script/g, '<\\/script')}</script><script>${js.replace(/<\/script/g, '<\\/script')}</script>${after ? `<style id="gbm-color-proof">${proofCss}</style>` : ''}</body></html>`;
// neutral grey placeholder photo (same bytes in both runs, so only CSS differs)
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8/+3bfwAIPQN+4c5lVQAAAABJRU5ErkJggg==', 'base64');
const b = await chromium.launch();
const out = {};
for (const w of [390, 1366]) for (const after of [false, true]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 800 });
  const p = await ctx.newPage();
  await p.route('**/*', r => {
    const u = r.request().url();
    if (u === 'https://www.gatorbaitmedia.com/') return r.fulfill({ contentType: 'text/html', body: page(after) });
    if (u.includes('/blog-feed.xml')) return r.fulfill({ contentType: 'application/xml', body: xml });
    if (u.includes('scoreboard.json')) return r.fulfill({ contentType: 'application/json', body: fs.readFileSync(R + 'sports-live/scoreboard.json') });
    if (u.includes('front-page.config.json')) return r.fulfill({ contentType: 'application/json', body: fs.readFileSync(R + 'sports-live/front-page.config.json') });
    if (u.startsWith('https://static.wixstatic.com/')) return r.fulfill({ contentType: 'image/png', body: png });
    return r.abort();
  });
  await p.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'commit' });
  await p.waitForSelector('#gbm-live .bc-duo, #gbm-live .bc-hero', { timeout: 15000 });
  await p.waitForTimeout(1500);
  const k = `${after ? 'after' : 'before'}-${w}`;
  await p.screenshot({ path: `${D}${k}.png`, fullPage: true });
  out[k] = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight,
    fonts: [...new Set([...document.querySelectorAll('#gbm-live *')].map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))] }));
  await ctx.close();
}
await b.close();
fs.writeFileSync(D + 'metrics.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
