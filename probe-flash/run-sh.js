// READ-ONLY: layout-shift rect diagnostics (which nodes move, from where to where) on cold desktop/mobile loads.
const { chromium } = require('playwright'); const fs = require('fs'); fs.mkdirSync('shots', { recursive: true });
const PAGES = [['pricing', '/pricing-plans'], ['about', '/about'], ['magazine', '/magazine'], ['allnews', '/gatorbait-media-blogs'], ['cat-recruit', '/gatorbait-media-blogs/categories/gator-recruiting'], ['post', '/post/longhorns-tumble-gators-return-florida-is-no-20-in-the-ap-poll']];
const VIEWS = [{ n: '1366', w: 1366, h: 900, m: false }];
const INIT = () => {
  const S = window.__sh = []; const now = () => Math.round(performance.now());
  const d = n => n && n.nodeType === 1 ? n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (typeof n.className === 'string' && n.className.trim() ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '') : '?';
  const r = x => x ? [Math.round(x.x), Math.round(x.y), Math.round(x.width), Math.round(x.height)] : null;
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.hadRecentInput || e.value < 0.02) continue; const hd = document.getElementById('gbm-site-header'), tr = document.querySelector('.sh-track'), sp = document.getElementById('SITE_PAGES');
    S.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), src: (e.sources || []).slice(0, 4).map(s => ({ n: d(s.node), p: r(s.previousRect), c: r(s.currentRect) })), hd: hd ? [Math.round(hd.getBoundingClientRect().height), hd.children.length, hd.innerHTML.length] : null, tr: tr ? r(tr.getBoundingClientRect()) : null, trKids: tr ? tr.children.length : null, trStyle: tr ? (tr.getAttribute('style') || '').slice(0, 80) : null, trAnim: tr ? getComputedStyle(tr).animationName + '/' + getComputedStyle(tr).transform.slice(0, 40) : null, sp: sp ? Math.round(sp.getBoundingClientRect().top) : null }); } }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
};
(async () => {
  const browser = await chromium.launch(); const out = [];
  for (const v of VIEWS) for (const rep of [0, 1]) for (const [name, path] of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 }); await ctx.addInitScript(INIT);
    const page = await ctx.newPage(); const r = { page: name, w: v.n, rep };
    try { const resp = await page.goto('https://www.gatorbaitmedia.com' + path + '?gbm_qc=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 }); r.http = resp.status(); await page.waitForTimeout(6000); r.sh = await page.evaluate(() => window.__sh); r.html = await page.evaluate(() => { const t = document.querySelector('.sh-track'); const h = document.getElementById('gbm-site-header'); return { track: t ? t.outerHTML.slice(0, 500) : null, headerCss: h ? getComputedStyle(h).position + '/' + getComputedStyle(h).height : null }; }); } catch (e) { r.err = String(e.message).slice(0, 120); }
    out.push(r); console.log('### SH ' + JSON.stringify(r).slice(0, 3000)); await ctx.close();
  }
  fs.writeFileSync('shots/audit.json', JSON.stringify(out, null, 1)); await browser.close();
})();
