// Real-browser screenshots of the production site for review from sessions that cannot reach it.
// Usage: node automation/vision/live-shots.mjs [path] [selector] [widths]
//   path      page path on www.gatorbaitmedia.com, query allowed (default "/")
//   selector  element to scroll into view and capture on its own (default "#gbm-road"; "" for none)
//   widths    comma list (default "390,1365"); widths under 800 use an iPhone profile
// Output: build/live-shots/<name>.jpg plus metrics.json (bounding boxes, computed fonts, scroll state).
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const path = process.argv[2] || '/';
const selector = process.argv[3] === undefined ? '#gbm-road' : process.argv[3];
const widths = (process.argv[4] || '390,1365').split(',').map(Number).filter(Boolean);
const OUT = 'build/live-shots';
mkdirSync(OUT, { recursive: true });
const url = 'https://www.gatorbaitmedia.com' + path;
const IOS_UA = devices['iPhone 13'].userAgent;
const profile = (w) => w < 800
  ? { userAgent: IOS_UA, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };

const browser = await chromium.launch();
const metrics = { url, selector, at: new Date().toISOString(), shots: [] };
for (const w of widths) {
  const ctx = await browser.newContext(profile(w));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  const m = { width: w, errors };
  try {
    const res = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    m.http = res && res.status();
    await page.waitForSelector('#gbm-live.fp26', { timeout: 15000 }).catch(() => { m.note = 'front page root not seen in 15s'; });
    await page.waitForTimeout(3500);
    // Which build ran: the loader's pinned commit as served in the HTML, and the renderer's own build stamp.
    Object.assign(m, await page.evaluate(() => ({
      loaderSrc: (document.documentElement.outerHTML.match(/front-page-2026 src=([0-9a-f]+)/) || [])[1] || null,
      fpBuild: document.querySelector('#gbm-live')?.getAttribute('data-fp-build') || null,
      fpVersion: document.querySelector('#gbm-live')?.getAttribute('data-fp') || null,
    })));
    await page.screenshot({ path: `${OUT}/top-${w}.jpg`, type: 'jpeg', quality: 70 });
    if (selector) {
      const found = await page.$(selector);
      m.selectorFound = Boolean(found);
      if (found) {
        await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), selector);
        await page.evaluate(() => scrollBy(0, -70));
        await page.waitForTimeout(2200);
        m.box = await page.evaluate((s) => {
          const el = document.querySelector(s), r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          const kids = [...el.querySelectorAll('h1,h2,h3,.g,.line,.track')].slice(0, 6).map((k) => {
            const b = k.getBoundingClientRect(), c = getComputedStyle(k);
            return { cls: (k.className || k.tagName).toString().slice(0, 40), x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), font: c.fontFamily.slice(0, 60), size: c.fontSize };
          });
          const track = el.querySelector('.track');
          return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, font: cs.fontFamily.slice(0, 60), kids,
            track: track ? { scrollWidth: track.scrollWidth, clientWidth: track.clientWidth, scrollLeft: track.scrollLeft } : null, docScrollWidth: document.documentElement.scrollWidth, innerWidth };
        }, selector);
        await page.screenshot({ path: `${OUT}/view-${w}.jpg`, type: 'jpeg', quality: 70 });
        await found.screenshot({ path: `${OUT}/element-${w}.jpg`, type: 'jpeg', quality: 75 }).catch((e) => { m.elementShot = String(e).slice(0, 120); });
      }
    }
  } catch (e) {
    m.error = String(e).slice(0, 300);
  }
  metrics.shots.push(m);
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/metrics.json`, JSON.stringify(metrics, null, 1));
console.log(JSON.stringify(metrics, null, 1));
