/* Phone tap-target / font-size / layout-shift probe (read-only against production). node deploy/sitewide-light-20261031/mobile-probe.cjs */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = path.resolve(__dirname, '../../sports-live/site-light.js');
const LOADER = fs.readFileSync(path.join(__dirname, 'loader.html'), 'utf8');
const RE = /^https:\/\/rawcdn\.githack\.com\/Presidente49\/gatorbait-media-redesign\/[0-9a-f]{40}\/sports-live\/site-light\.js/;
const PAGES = ['/pricing-plans', '/post/pregame-analysis-florida-gators-5-2-3-2-vs-georgia-bulldogs-6-1-4-1', '/gatorbait-media-blogs', '/about', '/contact'];
function measure() {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && r.bottom > 0; };
  const skipTap = '[data-hook=post-description] p,[data-hook=post-description] li,#gbm-footer,.consent-banner-root';
  const small = [...document.querySelectorAll('a,button')].filter(vis).filter((e) => e.getBoundingClientRect().height < 44 && !e.closest(skipTap + ',.sh-run')).map((e) => (e.textContent || '').trim().slice(0, 20) + ':' + Math.round(e.getBoundingClientRect().height));
  const tiny = new Set();
  const wk = document.createTreeWalker(document.body, 4);
  for (let n; (n = wk.nextNode());) {
    const e = n.parentElement;
    if (!/\S/.test(n.nodeValue) || !vis(e) || e.closest('#gbm-gd10-bar,.consent-banner-root,#gbm-footer,#gbm-site-header,#gbm-mobile-shell')) continue;
    const f = parseFloat(getComputedStyle(e).fontSize);
    if (/^(P|LI)$/.test(e.tagName) && f < 16) tiny.add(e.tagName + ':' + f + ':' + n.nodeValue.trim().slice(0, 20));
  }
  return { cls: +window.__cls.toFixed(3), sw: document.documentElement.scrollWidth, smallTap: small.length, smallSample: small.slice(0, 6), bodyTextUnder16: tiny.size, tinySample: [...tiny].slice(0, 4) };
}
(async () => {
  const b = await chromium.launch();
  for (const w of [390, 320]) for (const pg of PAGES) {
    const c = await b.newContext({ viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
    const p = await c.newPage();
    await p.addInitScript(() => { window.__cls = 0; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {} });
    await p.route(RE, (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(FILE) }));
    await p.route((u) => u.origin === 'https://www.gatorbaitmedia.com' && !/\.\w{2,5}$/.test(u.pathname), async (r) => {
      if (r.request().resourceType() !== 'document') return r.continue();
      const resp = await r.fetch(); let t = await resp.text(); t = t.replace(/<head[^>]*>/i, (m) => m + LOADER); r.fulfill({ response: resp, body: t });
    });
    await p.goto('https://www.gatorbaitmedia.com' + pg + '?cb=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(5000);
    console.log(w, pg.slice(0, 30), JSON.stringify(await p.evaluate(measure)));
    await c.close();
  }
  await b.close();
})();
