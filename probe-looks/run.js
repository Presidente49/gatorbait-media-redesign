// Read-only live probe of https://www.gatorbaitmedia.com/magazine after the rev-117 swap (embed 1dd74333, pin 814353c9: new PDF, portrait cover, sticky fix). (rerun: 390 got a transient Wix HTTP 503)
// Chrome at 390/430/1366/1920, cache-busting URL, no UA override (Wix bot 403). Screenshots to ./shots for the artifact.
const { chromium } = require('playwright');
const fs = require('fs');
fs.mkdirSync('shots', { recursive: true });
const PIN = '5dfd57f3bfccfb69c5bd4641775f795747339684';
const YTS = ['https://www.youtube-nocookie.com/embed/JexQFsm_wts?autoplay=1&rel=0&playsinline=1','https://www.youtube-nocookie.com/embed/y4GpdY2bzdU?autoplay=1&rel=0&playsinline=1'];
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
      r.http = resp.status(); r.servedPin = (html.match(new RegExp(PIN, 'g')) || []).length; r.servedMarker = /GBM_MAGAZINE_2026_V1 postgame texas-web src=5dfd57f3/.test(html);
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
      r.cover = await page.evaluate(() => { const i = document.querySelector('#gbm-magazine-page .pm-poster img, #gbm-magazine-page .pm-entrance img'); return i ? { src: i.currentSrc || i.src, nw: i.naturalWidth, nh: i.naturalHeight, ok: i.complete && i.naturalWidth > 0 } : null; });
      r.coverOk = !!(r.cover && r.cover.ok && /postgame-cover-20261018/.test(r.cover.src) && Math.abs(r.cover.nh / r.cover.nw - 4 / 3) < 0.02);
      const NEWPDF = 'https://18fb3a4e-d7f6-414a-aeb9-3047db3ea115.usrfiles.com/ugd/d3cfa5_6fd61c786a0441b5a8dbead1182f2e1d.pdf';
      const pr = await ctx.request.get(NEWPDF, { headers: { Range: 'bytes=0-1023' } });
      const pb = await pr.body();
      r.pdf = { status: pr.status(), ct: pr.headers()['content-type'], cd: pr.headers()['content-disposition'] || '', magic: pb.slice(0, 5).toString() };
      Object.assign(r, pre);
      r.dlOk = pre.dlHref === NEWPDF && pre.dlDownload && (r.pdf.status === 200 || r.pdf.status === 206) && r.pdf.magic === '%PDF-'; r.thirdPartyBeforeTap = third.slice(); r.bad = bad.slice(0, 5);
      await page.screenshot({ path: 'shots/mag-' + v.name + '-full.png', fullPage: true });
      await page.screenshot({ path: 'shots/mag-' + v.name + '-top.png' });
      r.taps = [];
      for (let k = 0; k < 2; k++) {
        const yt = page.locator('.pm-rf[data-href*="youtube.com"] .pm-rp').nth(k);
        await yt.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
        const beforeTap = await yt.evaluate(b => { const q = b.parentNode.getBoundingClientRect(); return { w: q.width, h: q.height }; });
        await yt.click(); await page.waitForTimeout(2000);
        const tap = await page.evaluate((k) => { const f = document.querySelectorAll('.pm-rf[data-href*="youtube.com"]')[k], i = f.querySelector('iframe'), q = f.getBoundingClientRect();
          return { iframeSrc: i && i.getAttribute('src'), w: q.width, h: q.height, buttonHidden: f.querySelector('.pm-rp').style.display === 'none', fbIframes: document.querySelectorAll('.pm-rf[data-href*="facebook"] iframe').length }; }, k);
        r.taps.push(Object.assign(tap, { shiftW: +(tap.w - beforeTap.w).toFixed(2), shiftH: +(tap.h - beforeTap.h).toFixed(2), srcOk: tap.iframeSrc === YTS[k] }));
      }
      r.ytCards = pre.reels.filter(x => /youtube\.com/.test(x.href || '')).length;
      await page.locator('#pm-watch').screenshot({ path: 'shots/mag-' + v.name + '-watch-tapped.png' });
      r.errors = errors;
      r.pass = r.coverOk && r.dlOk && r.http === 200 && r.servedPin >= 2 && r.servedMarker && r.roots === 1 && r.reels.length === 2 && r.reels.every(x => x.posterLoaded) && r.overflow <= 0 && r.iframesBefore === 0 && r.thirdPartyBeforeTap.length === 0 && r.ytCards === 2 && r.taps.length === 2 && r.taps.every(t => t.srcOk && t.buttonHidden && Math.abs(t.shiftW) < 1 && Math.abs(t.shiftH) < 1) && r.imgsBroken === 0 && !r.georgiaRank && r.dlDownload && (v.w < 1200 || r.pmInWidth >= (v.w >= 1600 ? 1400 : 1200));
      await ctx.close();
    } catch (e) { r.pass = false; r.error = String(e.message || e).slice(0, 300); }
    results.push(r);
    console.log('### /magazine @' + v.name + ' ' + JSON.stringify(r));
  }
  await browser.close();
  fs.writeFileSync('shots/live-qc.json', JSON.stringify(results, null, 1)); fs.writeFileSync('shots/audit.json', JSON.stringify(results.map(r => ({ width: r.width, pass: r.pass, http: r.http, servedPin: r.servedPin, coverOk: r.coverOk, cover: r.cover, dlOk: r.dlOk, dlHref: r.dlHref, pdf: r.pdf, overflow: r.overflow, pmInWidth: r.pmInWidth, h1: r.h1, imgsBroken: r.imgsBroken, ytCards: r.ytCards, errors: r.errors, error: r.error })), null, 1));
  const bad = results.filter(x => !x.pass).map(x => x.width);
  console.log(bad.length ? 'LIVE QC FAILED at ' + bad.join(', ') : 'LIVE QC PASSED at ' + results.map(x => x.width).join('/'));
})();
