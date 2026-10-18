// Phone art test (broadcast-home.js): uses the committed real feed (gazette-live/posts.json, written by the
// refresh workflow) served as /blog-feed.xml, in the shape Wix serves it (covers come as ~mv2.jpg/v1/fit/.../file.png).
// Asserts the two-up pair is the newest photo stories after the lead, no repeats in the Rundown, thumbs render,
// no horizontal scroll at 320/390/430/768. Run: NODE_PATH=/opt/node22/lib/node_modules node sports-live/test-mobile-art.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(process.env.NODE_PATH ? process.env.NODE_PATH + '/' : import.meta.url);
const { chromium } = require('playwright');
const R = fileURLToPath(new URL('..', import.meta.url));
const posts = JSON.parse(fs.readFileSync(R + 'gazette-live/posts.json', 'utf8')).posts
  .filter(p => Date.parse(p.firstPublishedDate) <= Date.now())
  .sort((a, b) => Date.parse(b.firstPublishedDate) - Date.parse(a.firstPublishedDate));
const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const xml = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${posts.map(p => `<item><title>${x(p.title)}</title><link>${p.url}</link><pubDate>${new Date(p.firstPublishedDate).toUTCString()}</pubDate><dc:creator>${x(p.author)}</dc:creator><description>${x(p.excerpt || '')}</description>${p.image?.src ? `<enclosure url="${p.image.src}" type="image/jpeg"/>` : ''}</item>`).join('')}</channel></rss>`;
const code = fs.readFileSync(R + 'automation/sports-home/runtime.js', 'utf8').replace('__GAZETTE_PAYLOAD__', () => JSON.stringify({ css: fs.readFileSync(R + 'automation/sports-home/homepage.css', 'utf8'), fallback: { posts } }));
const js = fs.readFileSync(R + 'sports-live/broadcast-home.js', 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>${code.replace(/<\/script/g, '<\\/script')}</script><script>${js.replace(/<\/script/g, '<\\/script')}</script></body></html>`;
const jpg = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
const path = u => new URL(u).pathname;
// expectation, computed independently: newest photo stories after the lead (JPG base, not PNG graphics)
const photo = p => /~mv2\.jpe?g(\/|$)/i.test(p.image?.src || '');
const lead = posts[0], after = posts.slice(1).filter(photo);
const want = [after.find(p => /franz beard/i.test(p.author)) && /buddy martin/i.test(lead.author) ? after.find(p => /franz beard/i.test(p.author)) : after[0]];
want.push(after.find(p => !want.includes(p)));
const wantPaths = want.map(p => path(p.url)).sort();
let fail = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail = 1; };
const b = await chromium.launch();
for (const w of [320, 390, 430, 768]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 800 })).newPage();
  await p.route('**/*', r => {
    const u = r.request().url();
    if (u === 'https://www.gatorbaitmedia.com/') return r.fulfill({ contentType: 'text/html', body: html });
    if (u.includes('/blog-feed.xml')) return r.fulfill({ contentType: 'application/xml', body: xml });
    if (u.includes('scoreboard.json')) return r.fulfill({ contentType: 'application/json', body: fs.readFileSync(R + 'sports-live/scoreboard.json') });
    if (u.includes('front-page.config.json')) return r.fulfill({ contentType: 'application/json', body: fs.readFileSync(R + 'sports-live/front-page.config.json') });
    if (u.startsWith('https://static.wixstatic.com/')) return r.fulfill({ contentType: 'image/jpeg', body: jpg });
    return r.abort();
  });
  await p.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'commit' });
  await p.waitForSelector('#gbm-live .bc-duo', { timeout: 10000 });
  await p.waitForTimeout(800);
  const m = await p.evaluate(() => ({
    pair: [...document.querySelectorAll('.bc-duo a')].map(a => new URL(a.href).pathname).sort(),
    rows: [...document.querySelectorAll('.bc-rows a')].map(a => new URL(a.href).pathname),
    thumbs: document.querySelectorAll('.bc-rows .bc-tn img').length,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
  }));
  ok(JSON.stringify(m.pair) === JSON.stringify(wantPaths), `${w}: pair = ${m.pair.join(', ')}`);
  ok(!m.rows.some(r => m.pair.includes(r)), `${w}: rundown repeats no pair story`);
  ok(m.thumbs >= 1, `${w}: rundown thumbnails (${m.thumbs})`);
  ok(m.sw <= m.cw, `${w}: no horizontal scroll`);
  await p.context().close();
}
await b.close();
process.exit(fail);
