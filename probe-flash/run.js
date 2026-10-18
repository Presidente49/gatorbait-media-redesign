// READ-ONLY DOM timeline of the shell mount on inner pages: where #SITE_PAGES sits over time, which body children exist, which styles are present.
const { chromium } = require('playwright'); const fs = require('fs'); fs.mkdirSync('shots', { recursive: true });
const PAGES = [['pricing', '/pricing-plans'], ['magazine', '/magazine'], ['cat-recruit', '/gatorbait-media-blogs/categories/gator-recruiting'], ['pricing', '/pricing-plans'], ['magazine', '/magazine'], ['cat-recruit', '/gatorbait-media-blogs/categories/gator-recruiting']];
const VIEWS = [{ n: '1366', w: 1366, h: 900, m: false }];
const INIT = () => {
  const T = window.__tl = [];
  const now = () => Math.round(performance.now());
  const desc = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  let last = '';
  const snap = () => {
    if (!document.body) return;
    const sp = document.getElementById('SITE_PAGES') || document.getElementById('PAGES_CONTAINER');
    const kids = [...document.body.children].filter(e => !/^(SCRIPT|STYLE|LINK|NOSCRIPT)$/.test(e.tagName)).map(e => { const r = e.getBoundingClientRect(); return desc(e).slice(0, 40) + '@' + Math.round(r.top + scrollY) + '+' + Math.round(r.height); });
    const styles = [...document.querySelectorAll('style[id],link[id]')].map(s => s.id).filter(i => /gbm|gb-|swamp|sh-|shell/i.test(i));
    const pb = sp && sp.parentElement ? 0 : 0; const sc = document.getElementById('SITE_CONTAINER'); const o = { t: now(), pb: sc ? getComputedStyle(sc, '::before').height + '/' + getComputedStyle(sc, '::before').content : null, track: !!document.querySelector('#gbm-site-header .sh-track'), hdr: !!document.getElementById('gbm-site-header'), shell: !!document.getElementById('gbm-swamp-night-shell-v1'), link: !!document.getElementById('gbm-swamp-night-shell-link'), cls: document.documentElement.className.slice(0, 60), spTop: sp ? Math.round(sp.getBoundingClientRect().top + scrollY) : null, kids: kids.slice(0, 9), styles: styles.slice(0, 12) };
    const key = JSON.stringify([o.cls, o.spTop, o.pb, o.track, o.hdr, o.shell]); if (key !== last) { T.push(o); last = key; }
  };
  const iv = setInterval(snap, 10); setTimeout(() => clearInterval(iv), 6000);
};
(async () => {
  const browser = await chromium.launch(); const out = [];
  for (const v of VIEWS) for (const [name, path] of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1, isMobile: v.m, hasTouch: v.m }); await ctx.addInitScript(INIT);
    const page = await ctx.newPage(); let r = { page: name, w: v.n };
    try { const resp = await page.goto('https://www.gatorbaitmedia.com' + path + '?gbm_qc=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 }); r.http = resp.status(); await page.waitForTimeout(6200);
      r.tl = await page.evaluate(() => window.__tl);
      r.sizes = await page.evaluate(() => { const g = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }; }; return { band: g('#gbm-band'), header: g('#gbm-site-header'), ticker: g('.sh-track') , mobileHost: g('#gbm-mobile-shell-host'), sp: g('#SITE_PAGES'), nativeHeader: g('#SITE_HEADER') }; });
    } catch (e) { r.err = String(e.message).slice(0, 150); }
    out.push(r); console.log('### TL ' + name + ' @' + v.n + ' ' + JSON.stringify(r)); await ctx.close();
  }
  fs.writeFileSync('shots/audit.json', JSON.stringify(out, null, 1)); await browser.close();
})();
