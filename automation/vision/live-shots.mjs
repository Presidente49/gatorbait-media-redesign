// Real-browser screenshots of the production site for review from sessions that cannot reach it.
// Usage: node automation/vision/live-shots.mjs [path] [selector] [widths]
//   path      page path on www.gatorbaitmedia.com, query allowed (default "/")
//   selector  element to scroll into view and capture on its own (default "#gbm-road"; "" for none)
//   widths    comma list (default "390,1365"); widths under 800 use an iPhone profile
//   PERF=1    also measure load performance under Lighthouse-like throttling (phone: 1.6 Mbps, 150 ms RTT,
//             4x CPU slowdown; desktop: 10 Mbps, 40 ms, no CPU slowdown): TTFB, FCP, LCP, CLS, long tasks,
//             when our front page root and story button appeared, and every request grouped by host.
// Output: build/live-shots/<name>.jpg plus metrics.json (bounding boxes, computed fonts, scroll state, perf).
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const path = process.argv[2] || '/';
const selector = process.argv[3] === undefined ? '#gbm-road' : process.argv[3];
const widths = (process.argv[4] || '390,1365').split(',').map(Number).filter(Boolean);
const PERF = process.env.PERF === '1';
const OUT = 'build/live-shots';
mkdirSync(OUT, { recursive: true });
// deploy/covers/*.html renders a story cover from the checkout instead of the live site (the query carries the copy).
const url = /^deploy\/covers\//.test(path) ? 'file://' + process.cwd() + '/' + path : 'https://www.gatorbaitmedia.com' + path;
const IOS_UA = devices['iPhone 13'].userAgent;
// A real Chrome UA on desktop: with the default HeadlessChrome UA, Wix answered with an older cached
// snapshot for a while after an embed update (Sept. 30), which real browsers did not get.
const DESKTOP_UA = devices['Desktop Chrome'].userAgent;
const profile = (w) => w < 800
  ? { userAgent: IOS_UA, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: DESKTOP_UA, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };

const browser = await chromium.launch();
const metrics = { url, selector, at: new Date().toISOString(), shots: [] };
for (const w of widths) {
  const ctx = await browser.newContext(profile(w));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  const m = { width: w, errors };
  try {
    if (PERF) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      const phone = w < 800;
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: phone ? 150 : 40, downloadThroughput: (phone ? 1.6 : 10) * 1024 * 1024 / 8, uploadThroughput: (phone ? 0.75 : 10) * 1024 * 1024 / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: phone ? 4 : 1 });
      await page.addInitScript(() => {
        const P = (window.__gbmPerf = { lcp: null, cls: 0, longTasks: [], fpRootAt: null, shareAt: null, fcp: null });
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) P.lcp = { t: Math.round(e.startTime), size: e.size, url: (e.url || '').slice(0, 120), tag: e.element ? e.element.tagName + (e.element.className ? '.' + String(e.element.className).slice(0, 40) : '') : null }; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (_) {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) P.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (_) {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) P.longTasks.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch (_) {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') P.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (_) {}
        const mo = new MutationObserver(() => {
          if (P.fpRootAt === null && document.querySelector('#gbm-live.fp26')) P.fpRootAt = Math.round(performance.now());
          if (P.shareAt === null && document.querySelector('[data-share]')) P.shareAt = Math.round(performance.now());
          if (P.fpRootAt !== null && P.shareAt !== null) mo.disconnect();
        });
        document.addEventListener('DOMContentLoaded', () => mo.observe(document.documentElement, { childList: true, subtree: true }));
      });
    }
    const res = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    m.http = res && res.status();
    await page.waitForSelector('#gbm-live.fp26', { timeout: 15000 }).catch(() => { m.note = 'front page root not seen in 15s'; });
    await page.waitForTimeout(3500);
    if (PERF) {
      await page.waitForTimeout(6500);
      m.perf = await page.evaluate(() => {
        const P = window.__gbmPerf || {}, nav = performance.getEntriesByType('navigation')[0] || {};
        const res = performance.getEntriesByType('resource');
        const byHost = {};
        for (const r of res) {
          let h = 'other'; try { h = new URL(r.name).host; } catch (_) {}
          const b = byHost[h] || (byHost[h] = { n: 0, bytes: 0, ms: 0 });
          b.n++; b.bytes += r.transferSize || 0; b.ms += Math.round(r.duration);
        }
        const kind = (r) => r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name) ? 'script' : r.initiatorType === 'css' || r.initiatorType === 'link' && /\.css|fonts\.googleapis/.test(r.name) ? 'css' : /fonts\.gstatic|\.woff2?(\?|$)/.test(r.name) ? 'font' : r.initiatorType === 'img' || /\.(avif|webp|jpe?g|png|gif|svg)(\?|$)|wixstatic\.com\/media/.test(r.name) ? 'image' : r.initiatorType === 'fetch' || r.initiatorType === 'xmlhttprequest' ? 'fetch' : 'other';
        const byKind = {};
        for (const r of res) { const k = kind(r), b = byKind[k] || (byKind[k] = { n: 0, bytes: 0 }); b.n++; b.bytes += r.transferSize || 0; }
        const top = [...res].sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0)).slice(0, 15).map((r) => ({ url: r.name.replace(/^https?:\/\//, '').slice(0, 110), kind: kind(r), bytes: r.transferSize || 0, start: Math.round(r.startTime), ms: Math.round(r.duration) }));
        const ours = res.filter((r) => /githubusercontent|jsdelivr|presidente49\.github\.io|fonts\.g/.test(r.name)).map((r) => ({ url: r.name.replace(/^https?:\/\//, '').slice(0, 110), bytes: r.transferSize || 0, start: Math.round(r.startTime), ms: Math.round(r.duration) }));
        const tbt = (P.longTasks || []).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
        return { ttfb: Math.round(nav.responseStart || 0), domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0), fcp: P.fcp, lcp: P.lcp, cls: Math.round((P.cls || 0) * 1000) / 1000,
          longTasks: (P.longTasks || []).length, longTaskMs: (P.longTasks || []).reduce((a, [, d]) => a + d, 0), tbt: Math.round(tbt), fpRootAt: P.fpRootAt, shareAt: P.shareAt,
          requests: res.length, bytes: res.reduce((a, r) => a + (r.transferSize || 0), 0), byKind, byHost: Object.fromEntries(Object.entries(byHost).sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 20)), top, ours,
          scripts: document.scripts.length, inlineScriptChars: [...document.scripts].filter((x) => !x.src).reduce((a, x) => a + x.textContent.length, 0), styles: document.querySelectorAll('style').length, inlineStyleChars: [...document.querySelectorAll('style')].reduce((a, x) => a + x.textContent.length, 0), images: document.images.length, lazyImages: [...document.images].filter((i) => i.loading === 'lazy').length, domNodes: document.getElementsByTagName('*').length };
      });
    }
    // Cover renders: wait for web fonts and the photo before shooting.
    if (url.startsWith('file://')) { await page.evaluate(() => document.fonts.ready).catch(() => {}); await page.waitForTimeout(2500); }
    // Which build ran: the loader's pinned commit as served in the HTML, and the renderer's own build stamp.
    Object.assign(m, await page.evaluate(() => ({
      loaderSrc: (document.documentElement.outerHTML.match(/front-page-2026 src=([0-9a-f]+)/) || [])[1] || null,
      fpBuild: document.querySelector('#gbm-live')?.getAttribute('data-fp-build') || null,
      fpVersion: document.querySelector('#gbm-live')?.getAttribute('data-fp') || null,
    })));
    await page.screenshot({ path: `${OUT}/top-${w}.jpg`, type: 'jpeg', quality: 70 });
    if (process.env.FULL === '1') { await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); }); await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/full-${w}.jpg`, type: 'jpeg', quality: 55, fullPage: true }); m.pageHeight = await page.evaluate(() => document.documentElement.scrollHeight); }
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
          // Story pages: the Wix header, the Share button and the Story Kit strip, so a phone layout fault can be read without guessing.
          let story = null;
          if (document.querySelector('[data-story-kit]') || document.querySelector('[data-share]')) {
            const rect = (n) => { if (!n) return null; const b = n.getBoundingClientRect(), c = getComputedStyle(n); return { x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height), opacity: c.opacity, vis: c.visibility, size: c.fontSize, text: (n.textContent || '').trim().slice(0, 60) }; };
            const row = document.querySelector('.gbm-kit-row'), chips = row ? [...row.children] : [];
            story = { h1: rect(document.querySelector('[data-hook="post-title"]') || document.querySelector('article h1') || document.querySelector('h1')), share: rect(document.querySelector('[data-share]')), strip: rect(document.querySelector('[data-story-kit="strip"]')),
              row: row ? { scrollLeft: row.scrollLeft, scrollWidth: row.scrollWidth, clientWidth: row.clientWidth, dir: getComputedStyle(row).direction, justify: getComputedStyle(row).justifyContent } : null,
              firstChip: rect(chips[0]), lastChip: rect(chips[chips.length - 1]), more: rect(document.querySelector('[data-story-kit="more"]')), links: [...document.querySelectorAll('a.gbm-kit-link')].map((a) => a.getAttribute('data-term')), scrollX,
              capture: { probe: document.documentElement.getAttribute('data-gbm-capture-probe'), cards: document.querySelectorAll('[data-gbm-capture]').length, slideup: rect(document.querySelector('[data-gbm-capture="story-slideup"]')) } };
          }
          return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, font: cs.fontFamily.slice(0, 60), kids,
            track: track ? { scrollWidth: track.scrollWidth, clientWidth: track.clientWidth, scrollLeft: track.scrollLeft } : null, story, docScrollWidth: document.documentElement.scrollWidth, innerWidth };
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
