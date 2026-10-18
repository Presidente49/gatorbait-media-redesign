// Read-only live probe of https://www.gatorbaitmedia.com/magazine after the rev-114 swap (embed 1dd74333, pin 3fc54418).
// Chrome at 390/430/1366/1920, cache-busting URL, no UA override (Wix bot 403). Screenshots to ./shots for the artifact.
const { chromium } = require('playwright');
const fs = require('fs');
fs.mkdirSync('shots', { recursive: true });
const PIN = '3fc54418008a793dcca2b2e5e35132a961af0dce';
const YT = 'https://www.youtube-nocookie.com/embed/JexQFsm_wts?autoplay=1&rel=0&playsinline=1';
const widths = [
  { name: '390', w: 390, h: 844, dpr: 3, mobile: true },
  { name: '430', w: 430, h: 932, dpr: 3, mobile: true },
  { name: '1366', w: 1366, h: 768, dpr: 1, mobile: false },
  { name: '1920', w: 1920, h: 1080, dpr: 1, mobile: false },
];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const v of widths) {
    const r = { width: v.name };
    try {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: v.dpr, isMobile: v.mobile, hasTouch: v.mobile });
      const page = await ctx.newPage();
      const third = [], errors = [], bad = [];
      page.on('request', q => { const u = q.url(); if (/facebook\.com|youtube\.com|youtube-nocookie\.com|fbcdn/.test(u)) third.push(u.slice(0, 100)); });
      page.on('pageerror', e => errors.push(String(e.message).slice(0, 160)));
      page.on('response', q => { if (q.status() >= 400 && /jsdelivr|usrfiles|wixstatic/.test(q.url())) bad.push(q.status() + ' ' + q.url().slice(0, 120)); });
      const resp = await page.goto('https://www.gatorbaitmedia.com/magazine?gbm_qc=' + Date.now() + v.name, { waitUntil: 'domcontentloaded', timeout: 90000 });
      const html = await resp.text();
      r.http = resp.status(); r.servedPin = (html.match(new RegExp(PIN, 'g')) || []).length; r.servedMarker = /GBM_MAGAZINE_2026_V1 postgame texas-web src=3fc54418/.test(html);
      await page.waitForSelector('#gbm-magazine-page.pm[data-issue="2026-10-18-postgame-texas"]', { timeout: 60000 });
      await page.waitForTimeout(4000);
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 120)); } });
      await page.waitForTimeout(3000);
      const pre = await page.evaluate(() => {
        const d = document.documentElement, pg = document.getElementById('gbm-magazine-page');
        const reels = [...document.querySelectorAll('.pm-reel')].map(li => { const img = li.querySelector('.pm-rp img'); const f = li.querySelector('.pm-rf'); const b = f.getBoundingClientRect();
          return { href: f.getAttribute('data-href'), posterLoaded: !!(img && img.complete && img.naturalWidth > 0), w: Math.round(b.width), h: Math.round(b.height), ratio: +(b.height / b.width).toFixed(3), link: (li.querySelector('.pm-rl') || {}).textContent, credit: (li.querySelector('small') || {}).textContent }; });
        const pmIn = document.querySelector('.pm-watch .pm-in') || document.querySelector('.pm-in');
        const imgs = [...document.querySelectorAll('#gbm-magazine-page img')];
        const dl = document.querySelector('.pm-dl-btn');
        return { roots: document.querySelectorAll('#gbm-magazine-page.pm[data-issue="2026-10-18-postgame-texas"]').length, h1: ((document.querySelector('#gbm-magazine-page h1') || {}).textContent || '').trim().slice(0, 60),
          bundleSrc: (document.getElementById('gbm-mag26-bundle') || {}).src, scrollW: d.scrollWidth, clientW: d.clientWidth, overflow: d.scrollWidth - d.clientWidth,
          pmInWidth: pmIn && Math.round(pmIn.getBoundingClientRect().width), reels, imgs: imgs.length, imgsBroken: imgs.filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).length,
          iframesBefore: document.querySelectorAll('.pm-rf iframe').length, dlHref: dl && dl.getAttribute('href'), dlDownload: !!(dl && dl.hasAttribute('download')),
          uaa: !![...document.querySelectorAll('a')].find(a => a.getAttribute('href') === 'https://floridagators.com'),
          georgiaRank: /(No\. ?\d+|#\d+|top-ranked)[^.]{0,20}Georgia|Georgia[^.]{0,20}(No\. ?\d+|\(\d+-\d+)/i.test(pg ? pg.textContent : ''), pageHeight: d.scrollHeight };
      });
      Object.assign(r, pre); r.thirdPartyBeforeTap = third.slice(); r.bad = bad.slice(0, 5);
      await page.screenshot({ path: 'shots/mag-' + v.name + '-full.png', fullPage: true });
      await page.screenshot({ path: 'shots/mag-' + v.name + '-top.png' });
      const yt = page.locator('.pm-rf[data-href*="youtube.com"] .pm-rp');
      await yt.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      const beforeTap = await yt.evaluate(b => { const q = b.parentNode.getBoundingClientRect(); return { w: q.width, h: q.height }; });
      await yt.click(); await page.waitForTimeout(2000);
      const tap = await page.evaluate(() => { const f = document.querySelector('.pm-rf[data-href*="youtube.com"]'), i = f.querySelector('iframe'), q = f.getBoundingClientRect();
        return { iframeSrc: i && i.getAttribute('src'), w: q.width, h: q.height, buttonHidden: f.querySelector('.pm-rp').style.display === 'none', fbIframes: document.querySelectorAll('.pm-rf[data-href*="facebook"] iframe').length }; });
      r.tap = Object.assign(tap, { shiftW: +(tap.w - beforeTap.w).toFixed(2), shiftH: +(tap.h - beforeTap.h).toFixed(2), srcOk: tap.iframeSrc === YT });
      await page.locator('#pm-watch').screenshot({ path: 'shots/mag-' + v.name + '-watch-tapped.png' });
      r.errors = errors;
      r.pass = r.http === 200 && r.servedPin >= 2 && r.servedMarker && r.roots === 1 && r.reels.length === 2 && r.reels.every(x => x.posterLoaded) && r.overflow <= 0 && r.iframesBefore === 0 && r.thirdPartyBeforeTap.length === 0 && r.tap.srcOk && r.tap.buttonHidden && Math.abs(r.tap.shiftW) < 1 && Math.abs(r.tap.shiftH) < 1 && r.imgsBroken === 0 && !r.georgiaRank && r.dlDownload && (v.w < 1200 || r.pmInWidth >= (v.w >= 1600 ? 1400 : 1200));
      await ctx.close();
    } catch (e) { r.pass = false; r.error = String(e.message || e).slice(0, 300); }
    results.push(r);
    console.log('### /magazine @' + v.name + ' ' + JSON.stringify(r));
  }
  await browser.close();
  fs.writeFileSync('shots/live-qc.json', JSON.stringify(results, null, 1));
  const bad = results.filter(x => !x.pass).map(x => x.width);
  console.log(bad.length ? 'LIVE QC FAILED at ' + bad.join(', ') : 'LIVE QC PASSED at ' + results.map(x => x.width).join('/'));
})();
