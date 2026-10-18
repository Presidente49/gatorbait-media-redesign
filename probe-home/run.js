// Read-only probe of the live homepage: skin pin, color marker, frames at 0.2/0.5/1/2 s, overflow, console, lead/order.
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  fs.mkdirSync('shots', { recursive: true }); const b = await chromium.launch(); const out = {};
  for (const w of [390, 430, 1366, 1920]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 800 }); const p = await ctx.newPage();
    const errs = [], reqs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
    p.on('request', r => { if (/broadcast-home/.test(r.url())) reqs.push(r.url()); });
    const r = { w, frames: [] }; const t0 = Date.now();
    const resp = await p.goto('https://www.gatorbaitmedia.com/?cb=' + t0, { waitUntil: 'commit' }); r.http = resp && resp.status();
    for (const t of [200, 500, 1000, 2000]) {
      const wait = t - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
      const f = await p.evaluate(() => { const g = document.querySelector('#gbm-live'); const s = document.getElementById('gbm-broadcast-home-css'); return { root: !!g, hidden: document.documentElement.classList.contains('gbm-bc-wait'), vis: g ? getComputedStyle(g).visibility : null, skin: !!s, color: !!(s && s.textContent.includes('22884C')) }; }).catch(e => ({ err: String(e).slice(0, 80) }));
      f.t = t; r.frames.push(f); await p.screenshot({ path: `shots/f-${w}-${t}.png` }).catch(() => {});
    }
    await p.waitForSelector('#gbm-live .bc-hero', { timeout: 20000 }).catch(() => {}); await p.waitForTimeout(2500);
    r.final = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight, lead: (document.querySelector('#gbm-live .bc-hero h1') || {}).textContent, order: [...document.querySelectorAll('#gbm-live .bc-row h3')].map(e => e.textContent.trim().slice(0, 40)), sections: [...document.querySelectorAll('#gbm-live .sh-section-title, #gbm-live .bc-h')].map(e => e.textContent.trim()), skin: !!document.getElementById('gbm-broadcast-home-css'), color: !!(document.getElementById('gbm-broadcast-home-css') || { textContent: '' }).textContent.includes('22884C'), fonts: [...new Set([...document.querySelectorAll('#gbm-live *')].map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))], headerRule: (() => { const h = document.querySelector('#gbm-live .sh-header'); return h ? getComputedStyle(h).borderBottomColor : null; })() }));
    r.reqs = reqs.slice(0, 3); r.errs = errs; await p.screenshot({ path: `shots/full-${w}.png`, fullPage: true }).catch(() => {}); out[w] = r; await ctx.close();
  }
  await b.close(); fs.writeFileSync('shots/probe.json', JSON.stringify(out, null, 1)); console.log(JSON.stringify(out));
})();
