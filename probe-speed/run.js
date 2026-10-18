// Read-only resource breakdown of https://www.gatorbaitmedia.com/magazine (no writes). Cache-busting URL.
const { chromium } = require('playwright'); const fs = require('fs'); fs.mkdirSync('shots', { recursive: true });
const TAG = process.env.TAG || 'a';
const views = [{ n: '390', w: 390, h: 844, m: true }, { n: '430', w: 430, h: 932, m: true }, { n: '1366', w: 1366, h: 900, m: false }, { n: '1920', w: 1920, h: 1080, m: false }];
const only = (process.env.VIEWS || '390,430,1366,1920').split(',');
const sleep = ms => new Promise(s => setTimeout(s, ms));
(async () => {
  const browser = await chromium.launch(); const out = [];
  for (const v of views.filter(v => only.includes(v.n))) {
    const r = { width: v.n, tag: TAG };
    for (let at = 1; at <= 3; at++) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: v.m ? 2 : 1, isMobile: v.m, hasTouch: v.m });
      try {
        await ctx.addInitScript(() => { window.__lcp = 0; window.__lcpEl = ''; window.__cls = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__lcp = Math.round(e.startTime); window.__lcpEl = (e.url || (e.element && e.element.tagName) || '').slice(0, 160); } }).observe({ type: 'largest-contentful-paint', buffered: true }); new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (_) {} });
        const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable');
        const res = {}; cdp.on('Network.responseReceived', e => { res[e.requestId] = { url: e.response.url, type: e.type, status: e.response.status, mime: e.response.mimeType }; });
        cdp.on('Network.loadingFinished', e => { if (res[e.requestId]) res[e.requestId].bytes = e.encodedDataLength || 0; });
        const t0 = Date.now(); const resp = await page.goto('https://www.gatorbaitmedia.com/magazine?gbm_qc=' + Date.now() + v.n + TAG, { waitUntil: 'domcontentloaded', timeout: 90000 });
        r.http = resp.status(); r.dclMs = Date.now() - t0; if (r.http >= 500) { r.attempt = at; await ctx.close(); await sleep(5000); continue; }
        const html = await resp.text(); r.servedPins = [...new Set(html.match(/src=[0-9a-f]{8}/g) || [])];
        await page.waitForSelector('.pm-wrap', { timeout: 60000 }); r.pmWrapMs = Date.now() - t0;
        await page.waitForTimeout(5000);
        const sum = () => Object.values(res).reduce((a, x) => a + (x.bytes || 0), 0);
        r.nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0] || {}; const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime; return { dcl: Math.round(n.domContentLoadedEventEnd || 0), load: Math.round(n.loadEventEnd || 0), lcp: window.__lcp, lcpEl: window.__lcpEl, fcp: Math.round(fcp || 0), cls: +window.__cls.toFixed(4) }; });
        r.transferKB_beforeScroll = Math.round(sum() / 1024);
        await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 150)); } });
        await page.waitForTimeout(4000);
        r.transferKB_afterScroll = Math.round(sum() / 1024);
        r.cls_final = await page.evaluate(() => +window.__cls.toFixed(4));
        r.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        r.resources = Object.values(res).filter(x => x.bytes > 2000).sort((a, b) => b.bytes - a.bytes).slice(0, 40).map(x => ({ kb: +(x.bytes / 1024).toFixed(1), type: x.type, mime: x.mime, url: x.url.slice(0, 190) }));
        const byHost = {}; for (const x of Object.values(res)) { let h = ''; try { h = new URL(x.url).host; } catch (_) {} byHost[h] = (byHost[h] || 0) + (x.bytes || 0); }
        r.byHostKB = Object.fromEntries(Object.entries(byHost).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, b]) => [k, Math.round(b / 1024)]));
        r.imgs = await page.evaluate(() => [...document.querySelectorAll('.pm-wrap img')].map(i => { const b = i.getBoundingClientRect(); return { cls: (i.className || i.parentElement.className || '').toString().slice(0, 30), lazy: i.loading, fp: i.getAttribute('fetchpriority'), dec: i.decoding, w: i.getAttribute('width'), h: i.getAttribute('height'), shown: Math.round(b.width) + 'x' + Math.round(b.height), nat: i.naturalWidth + 'x' + i.naturalHeight, src: (i.currentSrc || i.src).slice(0, 170) }; }));
        await page.screenshot({ path: 'shots/top-' + v.n + '-' + TAG + '.png', clip: { x: 0, y: 0, width: v.w, height: v.h } });
        r.attempt = at; await ctx.close(); break;
      } catch (e) { r.error = String(e.message || e).slice(0, 300); r.attempt = at; try { await ctx.close(); } catch (_) {} }
    }
    out.push(r); console.log(JSON.stringify(r, null, 1));
  }
  fs.writeFileSync('shots/speed-' + TAG + '.json', JSON.stringify(out, null, 1)); await browser.close();
})();
