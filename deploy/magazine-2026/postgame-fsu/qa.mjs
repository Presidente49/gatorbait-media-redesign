#!/usr/bin/env node
// QA for the Florida State postgame edition: renders the built QA frame (sports-live/magazine-fsu-postgame-frame.html) with the local
// bundle (sports-live/magazine-fsu-postgame.js) in Chromium at 320/390/430/1366/1920 and checks what the renderer can get wrong:
// horizontal overflow, every section the issue JSON carries is on the page, one h1, links stay on the site, anchors resolve, text
// contrast (the shared signup form is reported separately), 44 px tap targets, the win-probability chart (line + one numbered dot
// per mark), the signup tagged "magazine", no feed swap of the curated lead, unmount/remount, console errors. Photos are stand-ins
// (the cloud container cannot reach Wix media). Screenshots: 390 and 1366 px, full page, cover and one image per section.
// Usage (from the repository root, after build-magazine.mjs): node deploy/magazine-2026/postgame-fsu/qa.mjs [outdir]   (default /tmp/fsupg-qa)
// Playwright comes from NODE_PATH or the cloud image's global install; exit code 1 on any failure.
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const out = process.argv[2] || '/tmp/fsupg-qa'; mkdirSync(out, { recursive: true });
const bundle = readFileSync('sports-live/magazine-fsu-postgame.js', 'utf8');
const frame = readFileSync('sports-live/magazine-fsu-postgame-frame.html', 'utf8');
const ISSUE = JSON.parse(readFileSync('sports-live/magazine-issue-fsu-postgame.json', 'utf8'));
const stand = (w, h, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16328f"/><stop offset=".65" stop-color="#3a4f8f"/><stop offset="1" stop-color="#fa4616"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="52%" fill="#fff" fill-opacity=".85" font-family="sans-serif" font-size="${Math.round(w / 16)}" text-anchor="middle">${label}</text></svg>`;
const OPTIONAL = { columns: '#pm-columns', coverage: '#pm-coverage', damage: '#pm-damage', scoring: '#pm-scoring', box: '#pm-box', flow: '#pm-flow', quotes: '#pm-quotes' };
const present = Object.entries(OPTIONAL).filter(([k]) => ISSUE[k]);
const SECTIONS = ['.pm-entrance', '#pm-cover', '.pm-final', '.pm-toc', '#pm-next', '.pm-foot'].concat(present.map(([, s]) => s));
const SHOT = ['.pm-final', '#pm-next', '.pm-foot'].concat(present.map(([, s]) => s));
const NMARKS = ISSUE.flow ? ISSUE.flow.marks.length : 0;
const browser = await chromium.launch();
const results = [];
for (const [name, width, height] of [['320', 320, 720], ['390', 390, 844], ['430', 430, 932], ['1366', 1366, 900], ['1920', 1920, 1080]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: width < 700 ? 2 : 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const requests = [], errors = [];
  page.on('request', (r) => requests.push(r.url()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine' || u === 'https://qa.local/') return route.fulfill({ contentType: 'text/html', body: frame });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine-fsu-postgame\.js/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: bundle });
    const m = /static\.wixstatic\.com\/media\/([0-9a-f]+_[0-9a-f]{32})~mv2\.[a-z]+\/v1\/fit\/w_(\d+),h_(\d+)/.exec(u);
    if (m) return route.fulfill({ contentType: 'image/svg+xml', body: stand(+m[2], +m[3], 'Photo stand-in') });
    if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u)) return route.continue().catch(() => route.abort());
    if (/^data:|^about:/.test(u)) return route.continue();
    return route.abort();
  });
  await page.goto('https://qa.local/magazine', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-magazine-page.pm', { timeout: 8000 });
  await page.evaluate(async () => { const imgs = [...document.querySelectorAll('#gbm-magazine-page img')]; imgs.forEach((i) => { i.loading = 'eager'; }); await Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : 0))); await document.fonts.ready; });
  await page.waitForTimeout(700);
  const info = await page.evaluate(([SECTIONS, NMARKS]) => {
    const root = document.getElementById('gbm-magazine-page'), doc = document.documentElement;
    const over = [...root.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > doc.clientWidth + 1 || r.left < -1); }).slice(0, 6).map((e) => e.tagName + '.' + e.className);
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const bgOf = (el) => { for (let n = el; n && n !== document; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] > 0.95)) return c; } return [255, 255, 255]; };
    const low = [], lowSignup = [];
    root.querySelectorAll('*').forEach((el) => {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('svg,[aria-hidden="true"] svg')) return;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height || el.closest('.gbc-hp,.gbc-l')) return;
      const a = lum(rgb(cs.color).slice(0, 3)), b = lum(bgOf(el).slice(0, 3)), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700, large = size >= 24 || (bold && size >= 18.66);
      if (ratio < (large ? 3 : 4.5)) (el.closest('[data-gbm-capture]') ? lowSignup : low).push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}" ${ratio.toFixed(2)} ${size}px`);
    });
    const smallTaps = [...root.querySelectorAll('a[href],button,input,label.gbc-c')].filter((a) => a.type !== 'checkbox').filter((a) => { const r = a.getBoundingClientRect(); return r.width && r.height < 43.5 && !a.closest('.pm-cover-type h1,.pm-it,.gbc-p'); }).map((a) => a.textContent.trim().slice(0, 30) + ' ' + Math.round(a.getBoundingClientRect().height));
    const cap = root.querySelector('[data-gbm-capture]'), flow = root.querySelector('#pm-flow'), lineRows = [...root.querySelectorAll('.pm-line tbody tr')].map((r) => r.textContent.replace(/\s+/g, ' ').trim() + ' @' + Math.round(r.getBoundingClientRect().height));
    const fonts = [...new Set([...root.querySelectorAll('*')].map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()))];
    return {
      scrollW: doc.scrollWidth, clientW: doc.clientWidth, over, missing: SECTIONS.filter((s) => !root.querySelector(s)), h1: root.querySelectorAll('h1').length, h1Text: (root.querySelector('h1') || {}).textContent,
      imgs: root.querySelectorAll('img').length, imgsBroken: [...root.querySelectorAll('img')].filter((i) => !i.complete || !i.naturalWidth).length,
      bad: [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !/^(\/|#pm-|https:\/\/www\.gatorbaitmedia\.com\/|https:\/\/floridagators\.com\/?(galleries)?$|https:\/\/www\.instagram\.com\/hannahmorganphoto\/$)/.test(h)),
      anchorsOk: [...root.querySelectorAll('a[href^="#"]')].every((a) => !!root.querySelector(a.getAttribute('href'))),
      chart: flow ? { line: !!flow.querySelector('path.pm-ln'), dots: flow.querySelectorAll('.pm-mk').length, keys: flow.querySelectorAll('.pm-key li').length, marks: NMARKS, h: Math.round(flow.querySelector('.pm-area').getBoundingClientRect().height), quarterLabels: flow.querySelectorAll('.pm-qx span').length } : null,
      lineRows, plays: root.querySelectorAll('.pm-plays li').length, tstats: root.querySelectorAll('.pm-tstats tbody tr').length, tiles: root.querySelectorAll('.pm-stats li').length, chip: (root.querySelector('.pm-scorechip') || {}).textContent, capture: cap ? cap.getAttribute('data-gbm-capture') : null,
      fonts, low: low.slice(0, 12), lowCount: low.length, lowSignup: lowSignup.slice(0, 3), smallTaps: smallTaps.slice(0, 8), height: root.scrollHeight, title: document.title,
      nativeHidden: getComputedStyle(document.getElementById('SITE_PAGES')).display === 'none', order: [...root.querySelectorAll('#pm-cover h2,.pm-it h3')].map((h) => h.textContent.slice(0, 30))
    };
  }, [SECTIONS, NMARKS]);
  const life = await page.evaluate(async () => {
    history.pushState({}, '', '/'); window.dispatchEvent(new Event('gbmroutechange')); await new Promise((r) => setTimeout(r, 50));
    const gone = !document.getElementById('gbm-magazine-page') && !document.documentElement.classList.contains('gbm-magazine-live');
    history.pushState({}, '', '/magazine'); window.dispatchEvent(new Event('gbmroutechange')); await new Promise((r) => setTimeout(r, 50));
    return { gone, back: document.querySelectorAll('#gbm-magazine-page.pm').length };
  });
  if (width === 390 || width === 1366) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/pm-${name}-full.png`, fullPage: true });
    await page.screenshot({ path: `${out}/pm-${name}-cover.png`, fullPage: false });
    await page.addStyleTag({ content: '#gbm-magazine-page .pm-readerbar{position:static!important}' }); // the sticky bar would cover the top of every section capture
    for (const sel of SHOT) await page.locator(sel).screenshot({ path: `${out}/pm-${name}-${sel.replace(/^[#.]pm-?/, '').replace(/^[#.]/, '')}.png` });
  }
  const feed = requests.filter((u) => /blog-feed\.xml|scoreboard|espn/.test(u));
  results.push({ name, ...info, life, feed, errors });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results.map((r) => ({ ...r, order: undefined })), null, 1));
const fail = results.filter((r) => r.scrollW > r.clientW + 1 || r.over.length || r.missing.length || r.bad.length || r.h1 !== 1 || !r.anchorsOk || r.capture !== 'magazine' || r.lowCount || r.smallTaps.length || r.feed.length || r.errors.length || !r.life.gone || r.life.back !== 1 || !r.nativeHidden || r.imgsBroken || (ISSUE.scoring && r.lineRows.length !== 2) || (ISSUE.scoring && r.plays !== ISSUE.scoring.plays.length) || (ISSUE.flow && (!r.chart || !r.chart.line || r.chart.dots !== r.chart.marks || r.chart.keys !== r.chart.marks)));
console.log('Cover headline:', results[1].h1Text, '| score chip:', results[1].chip, '| document title:', results[1].title);
console.log('Fonts in use (first family):', [...new Set(results.flatMap((r) => r.fonts))].join(', '));
if (fail.length) { console.error('FAIL at', fail.map((f) => f.name).join(', ')); process.exit(1); }
console.log('FSU postgame QA passed at 320/390/430/1366/1920. Screenshots in ' + out);
