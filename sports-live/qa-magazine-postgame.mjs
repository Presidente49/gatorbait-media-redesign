#!/usr/bin/env node
// QA for the postgame layout (sports-live/magazine-postgame.js). Loads sports-live/magazine-postgame-frame.html, which carries the
// loader that is live on embed 1dd74333, serves the local bundle in place of the jsDelivr pin, and stands in for
// static.wixstatic.com photos (the cloud container cannot reach Wix media; a known graphic is served from SHOTS_DIR when present).
// Checks at 320/390/430/1366: no horizontal overflow, every section present, one h1, links site-relative, text contrast (WCAG AA
// against the nearest solid background), 44px tap targets, signup tagged "magazine", no feed swap of the curated lead, route
// unmount/remount, reduced motion. Writes full-page and section screenshots.
// Usage: [NODE_PATH=$(npm root -g)] node sports-live/qa-magazine-postgame.mjs [outdir] [dir with local art, e.g. sumrall-earned-1600x900.jpg]
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const pw = (() => { try { return require('playwright'); } catch (_) { return require('/opt/node22/lib/node_modules/playwright'); } })(); // NODE_PATH, else the cloud image's global install
const { chromium } = pw;
const out = process.argv[2] || '/tmp/pm-shots'; mkdirSync(out, { recursive: true });
const SHOTS_DIR = process.argv[3] || process.env.SHOTS_DIR || '';
const bundle = readFileSync('sports-live/magazine-postgame.js', 'utf8');
const frame = readFileSync('sports-live/magazine-postgame-frame.html', 'utf8');
const local = {}; // Wix media id -> local file (optional real art for the screenshots)
for (const [id, f] of Object.entries({ d3cfa5_fb8dcc167ff64b5c90cc1b6904390bf7: 'sumrall-earned-1600x900.jpg' })) {
  const p = SHOTS_DIR + '/' + f; if (SHOTS_DIR && existsSync(p)) local[id] = readFileSync(p);
}
const stand = (w, h, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16328f"/><stop offset=".65" stop-color="#3a4f8f"/><stop offset="1" stop-color="#fa4616"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="52%" fill="#fff" fill-opacity=".85" font-family="sans-serif" font-size="${Math.round(w / 16)}" text-anchor="middle">${label}</text></svg>`;
const SECTIONS = ['.pm-mast', '#pm-cover', '.pm-final', '.pm-toc', '#pm-damage', '#pm-flow', '#pm-grades', '#pm-quotes', '#pm-package', '#pm-next', '.pm-foot'];
const browser = await chromium.launch();
const results = [];
for (const [name, width, height] of [['320', 320, 720], ['390', 390, 844], ['430', 430, 932], ['1366', 1366, 900]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine' || u === 'https://qa.local/') return route.fulfill({ contentType: 'text/html', body: frame });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: bundle });
    const m = /static\.wixstatic\.com\/media\/([0-9a-f]+_[0-9a-f]{32})~mv2\.[a-z]+\/v1\/fit\/w_(\d+),h_(\d+)/.exec(u);
    if (m) return local[m[1]] ? route.fulfill({ contentType: 'image/jpeg', body: local[m[1]] }) : route.fulfill({ contentType: 'image/svg+xml', body: stand(+m[2], +m[3], 'Photo stand-in') });
    if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u)) return route.continue().catch(() => route.abort());
    if (/^data:|^about:/.test(u)) return route.continue();
    return route.abort();
  });
  await page.goto('https://qa.local/magazine', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-magazine-page.pm', { timeout: 8000 });
  await page.evaluate(async () => { const imgs = [...document.querySelectorAll('#gbm-magazine-page img')]; imgs.forEach((i) => { i.loading = 'eager'; }); await Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : 0))); await document.fonts.ready; });
  await page.waitForTimeout(700);
  const info = await page.evaluate((SECTIONS) => {
    const root = document.getElementById('gbm-magazine-page'), doc = document.documentElement;
    const over = [...root.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > doc.clientWidth + 1 || r.left < -1); }).slice(0, 6).map((e) => e.tagName + '.' + e.className);
    // WCAG contrast: text color vs the nearest ancestor with an opaque background color.
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const bgOf = (el) => { for (let n = el; n && n !== document; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] > 0.95)) return c; } return [255, 255, 255]; };
    const low = [];
    root.querySelectorAll('*').forEach((el) => {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()); if (!own) return;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('svg,[aria-hidden="true"] svg')) return;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      if (el.closest('.gbc-hp,.gbc-l')) return; // honeypot and visually hidden label
      const fg = rgb(cs.color), bg = bgOf(el), a = lum(fg.slice(0, 3)), b = lum(bg.slice(0, 3)), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700, large = size >= 24 || (bold && size >= 18.66);
      if (ratio < (large ? 3 : 4.5)) low.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}" ${ratio.toFixed(2)} ${size}px`);
    });
    const smallTaps = [...root.querySelectorAll('a[href],button,input,label.gbc-c')].filter((a) => a.type !== 'checkbox').filter((a) => { const r = a.getBoundingClientRect(); return r.width && r.height < 43.5 && !a.closest('.pm-cover-type h1,.pm-it,.gbc-p'); }).map((a) => a.textContent.trim().slice(0, 30) + ' ' + Math.round(a.getBoundingClientRect().height));
    const cap = root.querySelector('[data-gbm-capture]');
    return {
      scrollW: doc.scrollWidth, clientW: doc.clientWidth, over, missing: SECTIONS.filter((s) => !root.querySelector(s)), h1: root.querySelectorAll('h1').length,
      h1Text: (root.querySelector('h1') || {}).textContent, imgs: root.querySelectorAll('img').length,
      bad: [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !/^(\/|#pm-|https:\/\/www\.gatorbaitmedia\.com\/)/.test(h)),
      anchorsOk: [...root.querySelectorAll('a[href^="#"]')].every((a) => !!root.querySelector(a.getAttribute('href'))),
      capture: cap ? cap.getAttribute('data-gbm-capture') : null, captureH: cap ? Math.round(cap.getBoundingClientRect().height) : 0,
      grades: [...root.querySelectorAll('.pm-gg li')].map((l) => l.querySelector('.pm-gu').textContent + ' ' + l.querySelector('.pm-gl').textContent).join(' | '),
      packageOrder: [...root.querySelectorAll('.pm-it h3')].map((h) => h.textContent.slice(0, 28)),
      low: low.slice(0, 12), lowCount: low.length, smallTaps: smallTaps.slice(0, 8), height: root.scrollHeight, title: document.title,
      nativeHidden: getComputedStyle(document.getElementById('SITE_PAGES')).display === 'none', shellHidden: getComputedStyle(document.getElementById('gbm-mobile-shell-host')).display === 'none'
    };
  }, SECTIONS);
  // Route lifecycle: leave /magazine (unmount, native page back), then return (remount once).
  const life = await page.evaluate(async () => {
    history.pushState({}, '', '/'); window.dispatchEvent(new Event('gbmroutechange')); await new Promise((r) => setTimeout(r, 50));
    const gone = !document.getElementById('gbm-magazine-page') && !document.documentElement.classList.contains('gbm-magazine-live');
    history.pushState({}, '', '/magazine'); window.dispatchEvent(new Event('gbmroutechange')); await new Promise((r) => setTimeout(r, 50));
    return { gone, back: document.querySelectorAll('#gbm-magazine-page.pm').length };
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${out}/pm-${name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${out}/pm-${name}-cover.png`, fullPage: false });
  await page.locator('#pm-grades').screenshot({ path: `${out}/pm-${name}-grades.png` });
  await page.locator('#pm-damage').screenshot({ path: `${out}/pm-${name}-damage.png` });
  await page.locator('#pm-flow').screenshot({ path: `${out}/pm-${name}-flow.png` });
  await page.locator('#pm-next').screenshot({ path: `${out}/pm-${name}-next.png` });
  await page.locator('#pm-quotes').screenshot({ path: `${out}/pm-${name}-quotes.png` });
  await page.locator('#pm-package').screenshot({ path: `${out}/pm-${name}-package.png` });
  const feed = requests.filter((u) => /blog-feed\.xml|scoreboard|espn/.test(u));
  results.push({ name, ...info, life, feed, errors });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
const fail = results.filter((r) => r.scrollW > r.clientW + 1 || r.over.length || r.missing.length || r.bad.length || r.h1 !== 1 || !r.anchorsOk || r.capture !== 'magazine' || r.lowCount || r.smallTaps.length || r.feed.length || r.errors.length || !r.life.gone || r.life.back !== 1 || !r.nativeHidden);
if (fail.length) { console.error('FAIL', fail.map((f) => f.name).join(',')); process.exit(1); }
console.log('Postgame QA passed at 320/390/430/1366.');
