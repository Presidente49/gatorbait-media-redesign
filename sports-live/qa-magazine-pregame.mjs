#!/usr/bin/env node
// QA for the Friday Pregame layout. Renders sports-live/magazine-pregame-frame.html with the real loader, serves the local bundle
// in place of the CDN pin, stands in for static.wixstatic.com photos (the cloud container cannot reach Wix media) and checks
// overflow, sections, links and the countdown at 320/390/430/1366. Usage: NODE_PATH=<playwright dir> node sports-live/qa-magazine-pregame.mjs [outdir]
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || '/tmp/pg-shots'; mkdirSync(out, { recursive: true });
const bundle = readFileSync('sports-live/magazine-pregame.js', 'utf8');
const frame = readFileSync('sports-live/magazine-pregame-frame.html', 'utf8');
const png = (w, h, a) => { // gradient stand-in photo as SVG data (served as image/svg+xml)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b3aa8"/><stop offset="1" stop-color="#fa4616"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="${Math.round(w / 14)}" text-anchor="middle">PHOTO ${a}</text></svg>`;
};
const browser = await chromium.launch();
const results = [];
for (const [name, width, height] of [['320', 320, 800], ['390', 390, 844], ['430', 430, 932], ['1366', 1366, 900]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine') return route.fulfill({ contentType: 'text/html', body: frame });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: bundle });
    const m = /static\.wixstatic\.com\/media\/.*\/fit\/w_(\d+),h_(\d+)/.exec(u);
    if (m) return route.fulfill({ contentType: 'image/svg+xml', body: png(+m[1], +m[2], m[1]) });
    if (/^data:|^about:/.test(u)) return route.continue();
    if (u.startsWith('file:') || u.startsWith('http://localhost')) return route.continue();
    return route.abort();
  });
  await page.goto('https://qa.local/magazine', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-magazine-page.pg', { timeout: 8000 });
  await page.evaluate(async () => { const imgs = [...document.querySelectorAll('#gbm-magazine-page img')]; imgs.forEach(i => { i.loading = 'eager'; }); await Promise.all(imgs.map(i => i.decode ? i.decode().catch(() => {}) : 0)); });
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => {
    const root = document.getElementById('gbm-magazine-page');
    const doc = document.documentElement;
    const over = [...root.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > doc.clientWidth + 1; }).slice(0, 5).map(e => e.className || e.tagName);
    const sec = id => !!root.querySelector(id);
    return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, over, sections: ['#pg-cover', '#pg-game', '#pg-series', '#pg-tape', '#pg-keys', '#pg-injuries', '#pg-lead', '#pg-slate', '#pg-more', '#pg-shots'].map(sec), imgs: root.querySelectorAll('img').length, links: root.querySelectorAll('a[href]').length, count: root.querySelector('[data-pg-count]').textContent, h1: root.querySelectorAll('h1').length, height: root.scrollHeight, bad: [...root.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => !/^(\/|#|https:\/\/www\.youtube\.com\/)/.test(h)) };
  });
  await page.locator('#gbm-magazine-page').screenshot({ path: `${out}/pg-${name}.png`, fullPage: false, animations: 'disabled' }).catch(async () => { await page.screenshot({ path: `${out}/pg-${name}.png`, fullPage: true }); });
  results.push({ name, ...info });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
const fail = results.filter(r => r.scrollW > r.clientW + 1 || r.over.length || r.sections.some(x => !x) || r.bad.length || r.h1 !== 1);
if (fail.length) { console.error('FAIL', fail.map(f => f.name).join(',')); process.exit(1); }
console.log('Pregame QA passed.');
