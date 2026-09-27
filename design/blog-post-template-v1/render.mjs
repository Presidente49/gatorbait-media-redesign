// Render mock.html at 390 and 1366 with Playwright; checks overflow, layout shift, and that the template applied.
// Run: PW_MODULES=<dir containing node_modules/playwright> node render.mjs
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
const { chromium } = createRequire(join(process.env.PW_MODULES || '.', 'x.js'))('playwright');
const HERE = new URL('.', import.meta.url).pathname;
const REPO = join(HERE, '../..');
const ORIGIN = 'https://www.gatorbaitmedia.test';
const POST = '/post/sumrall-postgame-press-conference-ole-miss-not-fully-awake';
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const out = [];
for (const off of [false, true]) for (const w of [390, 1366]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: w < 800 ? 2 : 1 });
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.addInitScript(() => { window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
  await pg.route(ORIGIN + '/**', r => {
    const p = new URL(r.request().url()).pathname;
    let f = p === POST ? join(HERE, 'mock.html') : p.startsWith('/post/') ? join(HERE, p.slice(6)) : join(REPO, p);
    if (off && /post-template\.(css|js)$/.test(f)) return r.fulfill({ status: 404, body: '' });
    if (!existsSync(f)) return r.fulfill({ status: 404, body: '' });
    r.fulfill({ contentType: TYPES[extname(f)] || 'application/octet-stream', body: readFileSync(f) });
  });
  await pg.route('https://cdn.jsdelivr.net/**', r => r.fulfill({ status: 404, body: '' }));
  await pg.goto(ORIGIN + POST, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(4500);
  const m = await pg.evaluate(() => {
    const q = s => document.querySelector(s);
    const h1 = q('h1[data-hook=post-title]');
    return {
      scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
      cls: +window.__cls.toFixed(4),
      heroH: Math.round(q('[data-hook=post-hero-image]').getBoundingClientRect().height),
      h1Top: Math.round(h1.getBoundingClientRect().top), panel: (r => [Math.round(r.left), Math.round(r.width), Math.round(r.height)])(q('[data-hook=post]>div>header').getBoundingClientRect()), coverAfter: getComputedStyle(q('[data-hook=post]>div>header'), '::after').backgroundImage.slice(0, 60),
      titleFont: getComputedStyle(h1).fontFamily.split(',')[0] + ' ' + getComputedStyle(h1).fontWeight + ' ' + getComputedStyle(h1).fontSize,
      bodyFont: getComputedStyle(q('#viewer-p7')).fontSize,
      stats: document.querySelectorAll('[data-gbm-stat]').length,
      upnext: !!q('.gbm-upnext'),
      kicker: getComputedStyle(q('[data-hook=post]>div>header'), '::before').content,
      overflowing: [...document.querySelectorAll('#SITE_PAGES *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).length,
    };
  });
  const name = `screenshot-${off ? 'before-' : ''}${w}.png`;
  await pg.screenshot({ path: join(HERE, name), fullPage: true });
  if (!off) await pg.screenshot({ path: join(HERE, `screenshot-${w}-fold.png`) });
  out.push({ w, template: !off, ...m, errs, name });
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
