// READ-ONLY: where do Barlow/Barlow Condensed @font-face rules come from, with what display, and when do the faces load vs first paint?
const { chromium } = require('playwright'); const fs = require('fs'); fs.mkdirSync('shots', { recursive: true });
const INIT = () => { const L = window.__fl = { loads: [], paint: 0 }; const now = () => Math.round(performance.now());
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') L.paint = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (e) {}
  const hook = () => { if (!document.fonts) return setTimeout(hook, 5); document.fonts.addEventListener('loadingdone', ev => { for (const f of ev.fontfaces) L.loads.push({ t: now(), f: f.family + ' ' + f.weight + ' ' + f.style }); }); document.fonts.addEventListener('loading', () => L.loads.push({ t: now(), f: 'loading-start' })); }; hook(); };
(async () => { const browser = await chromium.launch(); const out = [];
  for (const [name, path] of [['pricing', '/pricing-plans'], ['post', '/post/longhorns-tumble-gators-return-florida-is-no-20-in-the-ap-poll']]) {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } }); await ctx.addInitScript(INIT); const page = await ctx.newPage(); const reqs = [];
    page.on('request', q => { if (/\.woff2?|fonts\.(googleapis|gstatic)|fontsource/.test(q.url())) reqs.push({ t: Date.now() - t0, u: q.url().replace(/^https?:\/\//, '').slice(0, 110) }); });
    const t0 = Date.now(); const r = { page: name };
    const resp = await page.goto('https://www.gatorbaitmedia.com' + path + '?gbm_qc=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 }); r.http = resp.status(); await page.waitForTimeout(5000);
    r.reqs = reqs.slice(0, 30);
    r.fl = await page.evaluate(() => window.__fl);
    r.faces = await page.evaluate(() => { const out = []; for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { out.push({ sheet: (sh.href || 'inline').slice(0, 90), blocked: true }); continue; } for (const ru of rules) { if (ru.constructor.name === 'CSSFontFaceRule' && /barlow/i.test(ru.style.fontFamily)) out.push({ sheet: (sh.href || 'inline:' + ((sh.ownerNode || {}).id || '')).slice(0, 80), fam: ru.style.fontFamily, w: ru.style.fontWeight, st: ru.style.fontStyle, disp: ru.style.fontDisplay, src: ru.style.src.slice(0, 90) }); } } return out.slice(0, 40); });
    r.preload = await page.evaluate(() => [...document.querySelectorAll('link[rel=preload],link[rel=stylesheet],link[rel=preconnect]')].map(l => l.rel + ' ' + (l.as || '') + ' ' + l.href.slice(0, 100)));
    out.push(r); console.log('### FONT ' + JSON.stringify(r).slice(0, 6000)); await ctx.close(); }
  fs.writeFileSync('shots/audit.json', JSON.stringify(out, null, 1)); await browser.close(); })();
