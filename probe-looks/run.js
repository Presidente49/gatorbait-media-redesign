// Read-only full live audit of https://www.gatorbaitmedia.com/magazine. Cache-busting URL, no UA override, generous timeouts.
const { chromium } = require('playwright');
const fs = require('fs');
const TAG = 'a';
fs.mkdirSync('shots', { recursive: true });
const views = [
  { name: '390', w: 390, h: 844, mobile: true }, { name: '430', w: 430, h: 932, mobile: true },
  { name: '1366', w: 1366, h: 900, mobile: false }, { name: '1920', w: 1920, h: 1080, mobile: false },
];
const sleep = ms => new Promise(s => setTimeout(s, ms));
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const v of views) {
    const r = { width: v.name, tag: TAG };
    for (let attempt = 1; attempt <= 3; attempt++) {
      let ctx;
      try {
        ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1, isMobile: v.mobile, hasTouch: v.mobile });
        await ctx.addInitScript(() => { window.__lcp = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {} });
        const page = await ctx.newPage();
        const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable');
        let bytes = 0; cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength || 0; });
        const consoleErrs = [], pageErrs = [], failed = [], bad = [];
        page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 200)); });
        page.on('pageerror', e => pageErrs.push(String(e.message).slice(0, 200)));
        page.on('requestfailed', q => failed.push(q.url().slice(0, 120) + ' ' + (q.failure() || {}).errorText));
        page.on('response', q => { if (q.status() >= 400) bad.push(q.status() + ' ' + q.url().slice(0, 120)); });
        const t0 = Date.now();
        const resp = await page.goto('https://www.gatorbaitmedia.com/magazine?gbm_qc=' + Date.now() + v.name, { waitUntil: 'domcontentloaded', timeout: 90000 });
        r.http = resp.status(); r.dclMs = Date.now() - t0;
        if (r.http >= 500) { r.attempt = attempt; await ctx.close(); await sleep(5000); continue; }
        const html = await resp.text();
        r.servedPins = [...new Set((html.match(/src=[0-9a-f]{8}/g) || []))]; r.servedMarker = (html.match(/GBM_MAGAZINE_2026_V1[^>]{0,80}/) || [''])[0];
        await page.waitForSelector('.pm-wrap', { timeout: 60000 }); r.pmWrapMs = Date.now() - t0;
        await page.waitForTimeout(4000);
        await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 150)); } });
        await page.waitForTimeout(4000);
        r.nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0] || {}; return { dcl: Math.round(n.domContentLoadedEventEnd || 0), load: Math.round(n.loadEventEnd || 0), lcp: window.__lcp || null }; });
        r.transferKB = Math.round(bytes / 1024);
        r.page = await page.evaluate(async () => {
          const d = document.documentElement, root = document.getElementById('gbm-magazine-page') || document.querySelector('.pm-wrap');
          const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
          const kids = [...root.querySelectorAll(':scope > *, :scope > .pm-wrap > *')];
          const sections = (root.querySelector('.pm-wrap') ? [...root.querySelector('.pm-wrap').children] : [...root.children]).map(c => ({ el: desc(c), y: Math.round(c.getBoundingClientRect().top + scrollY), h: Math.round(c.getBoundingClientRect().height), text: (c.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50) }));
          const imgs = [...document.querySelectorAll('img')].filter(i => root.contains(i));
          const broken = imgs.filter(i => i.getAttribute('src') && (!i.complete || i.naturalWidth === 0)).map(i => (i.currentSrc || i.src).slice(0, 110));
          const cover = imgs[0] ? { src: (imgs[0].currentSrc || imgs[0].src).slice(0, 140), loaded: imgs[0].complete && imgs[0].naturalWidth > 0, nat: imgs[0].naturalWidth + 'x' + imgs[0].naturalHeight, inFirstScreen: imgs[0].getBoundingClientRect().top < innerHeight } : null;
          const fam = {}; for (const el of root.querySelectorAll('*')) { if (!(el.textContent || '').trim() || el.children.length > 0 && ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue; const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim(); fam[f] = (fam[f] || 0) + 1; }
          const barlowLoaded = [...document.fonts].filter(f => f.status === 'loaded' && /barlow/i.test(f.family)).length;
          const reels = [...document.querySelectorAll('.pm-reel')].map(li => ({ href: (li.querySelector('.pm-rf') || {}).getAttribute && li.querySelector('.pm-rf').getAttribute('data-href'), btn: !!li.querySelector('.pm-rp') }));
          const dl = document.querySelector('.pm-dl-btn');
          return { rootDesc: desc(root), h1: ((root.querySelector('h1') || {}).textContent || '').trim().slice(0, 70), sections, sectionCount: sections.length, imgCount: imgs.length, broken, cover, fonts: fam, barlowFacesLoaded: barlowLoaded, reels, dlHref: dl && dl.getAttribute('href'), dlText: dl && dl.textContent.trim().slice(0, 80), dlDownloadAttr: !!(dl && dl.hasAttribute('download')), scrollW: d.scrollWidth, clientW: d.clientWidth, overflow: d.scrollWidth - d.clientWidth, pageHeight: d.scrollHeight };
        });
        r.taps = [];
        const n = await page.locator('.pm-rf[data-href*="youtube"] .pm-rp').count();
        for (let k = 0; k < n; k++) {
          const b = page.locator('.pm-rf[data-href*="youtube"] .pm-rp').nth(k);
          await b.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await b.click(); await page.waitForTimeout(2500);
          r.taps.push(await page.evaluate(k => { const f = document.querySelectorAll('.pm-rf[data-href*="youtube"]')[k], i = f.querySelector('iframe'); return { src: i && i.getAttribute('src'), nocookie: !!(i && /^https:\/\/www\.youtube-nocookie\.com\/embed\//.test(i.getAttribute('src') || '')) }; }, k));
        }
        // download button: visibility, click-ability (trial click), and the PDF response
        const dl = page.locator('.pm-dl-btn').first();
        r.dl = { count: await page.locator('.pm-dl-btn').count(), sectionCount: await page.locator('#pm-download').count() };
        if (r.dl.count) {
          await dl.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
          r.dl.visible = await dl.isVisible(); r.dl.box = await dl.boundingBox();
          try { await dl.click({ trial: true, timeout: 5000 }); r.dl.clickable = true; } catch (e) { r.dl.clickable = false; r.dl.clickErr = String(e.message).split('\n').slice(0, 3).join(' | ').slice(0, 250); }
          const href = await dl.getAttribute('href');
          if (href) { try { const pr = await ctx.request.get(new URL(href, 'https://www.gatorbaitmedia.com/').href, { timeout: 60000 }); r.dl.status = pr.status(); r.dl.ctype = pr.headers()['content-type']; r.dl.bytes = (await pr.body()).length; r.dl.finalUrl = pr.url().slice(0, 140); } catch (e) { r.dl.fetchErr = String(e.message).slice(0, 200); } }
        }
        r.consoleErrors = consoleErrs.slice(0, 8); r.pageErrors = pageErrs.slice(0, 5); r.requestFailed = failed.slice(0, 6); r.bad4xx = bad.slice(0, 8);
        await page.screenshot({ path: 'shots/mag-full-' + v.name + '.png', fullPage: true });
        const H = r.page.pageHeight, hh = Math.min(1400, H);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.screenshot({ path: 'shots/mag-bottom-' + v.name + '.png', fullPage: true, clip: { x: 0, y: H - hh, width: v.w, height: hh } });
        await page.screenshot({ path: 'shots/mag-top-' + v.name + '.png', fullPage: true, clip: { x: 0, y: 0, width: v.w, height: Math.min(v.h, H) } });
        r.attempt = attempt; await ctx.close(); break;
      } catch (e) { r.error = String(e.message || e).slice(0, 300); r.attempt = attempt; try { await ctx.close(); } catch (_) {} }
    }
    results.push(r);
    console.log('### /magazine @' + v.name + ' ' + JSON.stringify(r));
  }
  await browser.close();
  fs.writeFileSync('shots/full-check.json', JSON.stringify(results, null, 1));
  console.log('DONE');
})();
