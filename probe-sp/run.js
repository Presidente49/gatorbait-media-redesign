// READ-ONLY probe of live gatorbaitmedia.com (no site writes). Per page x width x cold/warm:
// frames at 0.1/0.3/0.6/1/2/4 s, CLS, font swaps, native-flash samples, overflow, contrast, links/forms.
// If EMBED_FILE is set, the document response for in-scope paths is rewritten in the browser only (pre-flight of an embed that is not live).
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://www.gatorbaitmedia.com';
const ALL = [
  ['about', '/about'], ['contact', '/contact'], ['plans', '/pricing-plans'], ['subscribe', '/pricing-plans/subscribe'],
  ['policies', '/policies'], ['tags', '/tags'], ['groups', '/groups'], ['search', '/search?q=gators'], ['events', '/event-list'],
  ['mag2021', '/2021-gatorbait-magazine'], ['notfound', '/zz-not-a-page-404'], ['tv', '/the-buddy-martin-show'],
  ['cat', '/gatorbait-media-blogs/categories/buddy-s-blog'], ['latest', '/gatorbait-media-blogs'],
  ['post', '/post/florida-is-one-win-from-bowl-eligibility-with-a-bye-before-georgia'], ['home', '/'], ['magazine', '/magazine'],
];
const ONLY = (process.env.PAGES || '').split(',').filter(Boolean);
const PAGES = ONLY.length ? ALL.filter(p => ONLY.includes(p[0])) : ALL;
const ALLV = [{ n: '390', w: 390, h: 844, m: true }, { n: '430', w: 430, h: 932, m: true }, { n: '1366', w: 1366, h: 900, m: false }, { n: '1920', w: 1920, h: 1080, m: false }];
const VONLY = (process.env.VIEWS || '').split(',').filter(Boolean);
const VIEWS = VONLY.length ? ALLV.filter(v => VONLY.includes(v.n)) : ALLV;
const TAG = process.env.TAG || 'base';
const EMBED = process.env.EMBED_FILE ? fs.readFileSync(process.env.EMBED_FILE, 'utf8') : '';
const OUT = 'shots-' + TAG; fs.mkdirSync(OUT, { recursive: true });
const FR = [100, 300, 600, 1000, 2000, 4000];
const sleep = ms => new Promise(s => setTimeout(s, ms));

const INIT = () => {
  const G = window.__g = { shifts: [], samples: [], fonts: [] };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) G.shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), src: (e.sources || []).slice(0, 2).map(s => { const n = s.node; const pr = s.previousRect, cr = s.currentRect; return (n && n.nodeType === 1 ? (n.id ? '#' + n.id : n.tagName.toLowerCase()) : '?') + '[' + [pr.y, pr.height, cr.y, cr.height].map(Math.round).join(',') + ']'; }).join(',') }); }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const rgb = s => { const m = String(s).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const t0 = performance.now();
  let prevFont = '';
  const tick = () => {
    try {
      const d = document.documentElement, b = document.body; if (!b) return;
      const sp = document.getElementById('SITE_PAGES');
      const cs = sp ? getComputedStyle(sp) : null;
      const h1 = document.querySelector('#SITE_PAGES h1,#SITE_PAGES h2');
      const h1cs = h1 ? getComputedStyle(h1) : null;
      const bg = rgb(getComputedStyle(b).backgroundColor) || [0, 0, 0, 0], hbg = rgb(getComputedStyle(d).backgroundColor) || [0, 0, 0, 0];
      const eff = bg[3] > .5 ? bg : hbg;
      const s = { t: Math.round(performance.now()), cls: String(d.className).slice(0, 90), light: eff[3] > .5 ? +lum(eff).toFixed(2) : 1, spVis: cs ? cs.visibility : 'none', band: !!document.getElementById('gbm-band'), hdr: !!document.querySelector('#gbm-site-header .sh-track,#gbm-mobile-shell'), h1: h1 ? (h1cs.fontFamily.split(',')[0].replace(/["']/g, '') + '/' + h1cs.fontStyle) : '' };
      const prev = G.samples[G.samples.length - 1];
      if (!prev || JSON.stringify([prev.cls, prev.light, prev.spVis, prev.band, prev.hdr, prev.h1]) !== JSON.stringify([s.cls, s.light, s.spVis, s.band, s.hdr, s.h1])) G.samples.push(s);
    } catch (e) {}
  };
  G.trace = []; const q = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return [Math.round(r.top + scrollY), Math.round(r.height), c.display === 'none' ? 'N' : c.visibility === 'hidden' ? 'H' : 'v']; };
  const tr = setInterval(() => { try { G.trace.push([Math.round(performance.now()), q('#gbm-footer'), q('#SITE_FOOTER'), q('#SITE_PAGES'), q('#gbm-band'), document.documentElement.scrollHeight, document.querySelectorAll('#gbm-footer').length, Math.round(scrollY), innerHeight, String(document.documentElement.className).slice(-40), (document.body.getAttribute('style')||'').slice(0,60), (document.documentElement.getAttribute('style')||'').slice(0,60)]); } catch (e) {} }, 120); setTimeout(() => clearInterval(tr), 8000);
  const iv = setInterval(tick, 30); setTimeout(() => clearInterval(iv), 7000);
};

const AUDIT = () => {
  const out = {}; const d = document.documentElement;
  window.scrollTo(9999, 0); out.overflow = window.scrollX; window.scrollTo(0, 0); out.scrollWidthMinusClient = d.scrollWidth - d.clientWidth; out.h = d.scrollHeight; out.cls = String(d.className).slice(0, 120);
  const rgb = s => { const m = String(s).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const lum = c => .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]);
  const bgOf = el => { for (let n = el; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && c[3] > .6) return c; if (getComputedStyle(n).backgroundImage !== 'none') return null; } return [255, 255, 255, 1]; };
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return null; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return null; return r; };
  const ff = {}, bad = []; let n = 0;
  for (const el of document.body.querySelectorAll('#SITE_PAGES *,#SITE_FOOTER *')) {
    if (el.children.length || !(el.textContent || '').trim() || !vis(el)) continue; if (++n > 1500) break;
    const cs = getComputedStyle(el); const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(); ff[fam] = (ff[fam] || 0) + 1;
    const fg = rgb(cs.color), bg = bgOf(el); if (!fg || !bg) continue;
    const L1 = lum(fg), L2 = lum(bg), cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    if (cr < (big ? 3 : 4.5) && bad.length < 12) bad.push({ cr: +cr.toFixed(2), t: el.textContent.trim().slice(0, 28), fg: cs.color, bg: 'rgb(' + bg.slice(0, 3).join(',') + ')', el: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + '<' + [el.parentElement, el.parentElement && el.parentElement.parentElement].map(n => n ? n.tagName.toLowerCase() + '.' + String(n.className).slice(0, 40) : '').join('<') });
  }
  out.fonts = ff; out.lowContrast = bad;
  const wide = []; for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.right > innerWidth + 20 && r.width > 2 && wide.length < 6 && !el.closest('#gbm-mobile-drawer-root')) wide.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 30)) + ':' + Math.round(r.left) + '-' + Math.round(r.right)); } out.wide = wide;
  const white = []; for (const el of document.querySelectorAll('#SITE_PAGES *')) { if (white.length > 8) break; const c = rgb(getComputedStyle(el).backgroundColor); const r = el.getBoundingClientRect(); if (c && c[3] > .6 && c[0] > 235 && c[1] > 235 && c[2] > 235 && r.width > 150 && r.height > 40) white.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 40)) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); } out.whiteBoxes = white;
  const sp = document.getElementById('SITE_PAGES'); out.spBg = sp ? getComputedStyle(sp).backgroundColor : null; out.bodyBg = getComputedStyle(document.body).backgroundColor;
  out.links = document.querySelectorAll('#SITE_PAGES a[href]').length; out.forms = document.querySelectorAll('#SITE_PAGES form,#SITE_PAGES input,#SITE_PAGES textarea,#SITE_PAGES button').length;
  out.h1 = (document.querySelector('#SITE_PAGES h1') || {}).textContent; out.band = !!document.getElementById('gbm-band'); out.textLen = (sp ? sp.textContent : '').length;
  return out;
};

async function run(browser, view, pg, mode, holder) {
  const [name, path] = pg; const r = { page: name, w: view.n, mode, tag: TAG };
  let ctx = holder.ctx;
  if (!ctx) {
    ctx = await browser.newContext(Object.assign({ viewport: { width: view.w, height: view.h }, deviceScaleFactor: 1, isMobile: view.m, hasTouch: view.m }, view.m ? { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' } : {}));
    await ctx.addInitScript(INIT);
    if (EMBED) await ctx.route('**/*', async route => {
      const q = route.request();
      if (q.resourceType() !== 'document' || q.frame() !== q.frame().page().mainFrame()) return route.continue();
      const u = new URL(q.url()); if (u.hostname !== 'www.gatorbaitmedia.com') return route.continue();
      const resp = await route.fetch(); const ct = resp.headers()['content-type'] || '';
      if (!/html/.test(ct)) return route.fulfill({ response: resp });
      let body = await resp.text(); body = body.replace(/<\/head>/i, EMBED + '</head>');
      route.fulfill({ response: resp, body });
    });
    holder.ctx = ctx;
  }
  const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
  const frames = []; cdp.on('Page.screencastFrame', async f => { frames.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {} });
  const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 100)));
  try {
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 55, everyNthFrame: 1 });
    const t0 = Date.now();
    const resp = await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + 'gbm_qc=' + t0 + view.n + mode, { waitUntil: 'commit', timeout: 60000 });
    r.http = resp.status();
    await sleep(4600);
    await cdp.send('Page.stopScreencast');
    const g = await page.evaluate(() => { const G = window.__g || {}; return { shifts: G.shifts, samples: G.samples, trace: G.trace }; }).catch(() => ({}));
    r.trace = g.trace; r.cls = +((g.shifts || []).reduce((a, s) => a + s.v, 0)).toFixed(4); r.shifts = (g.shifts || []).filter(s => s.v > .005).slice(0, 5);
    const S = g.samples || []; r.timeline = S.slice(0, 14).map(s => [s.t, s.light, s.spVis, s.band ? 'B' : '-', s.hdr ? 'H' : '-', s.h1, s.cls.replace(/\s+/g, ',').slice(0, 60)].join('|'));
    // native flash = sampled state where page content is visible on a light page or with unstyled headline while the shell is still absent
    r.flash = S.filter(s => s.spVis === 'visible' && (s.light > .35 || (/class="?$/.test('') ))).length;
    r.flashLightMs = (() => { let ms = 0; for (let i = 0; i < S.length; i++) { const a = S[i], b = S[i + 1]; if (a.spVis === 'visible' && a.light > .35 && b) ms += b.t - a.t; } return ms; })();
    const first = S.find(s => s.spVis === 'visible'); r.firstVisible = first ? { t: first.t, light: first.light, band: first.band, h1: first.h1 } : null;
    r.audit = await page.evaluate(AUDIT).catch(e => ({ err: String(e).slice(0, 80) }));
    r.errs = errs.slice(0, 3);
    const navTs = frames.length ? frames[0].ts : 0; // first frame ~ navigation commit
    FR.forEach(ms => { let best = null, bd = 1e9; for (const f of frames) { const dlt = Math.abs((f.ts - navTs) - ms); if (dlt < bd) { bd = dlt; best = f; } } if (best) fs.writeFileSync(`${OUT}/${name}-${view.n}-${mode}-f${ms}.jpg`, Buffer.from(best.data, 'base64')); });
    if (mode === 'warm' || view.n === '1366' || view.n === '390') await page.screenshot({ path: `${OUT}/${name}-${view.n}-${mode}-full.jpg`, type: 'jpeg', quality: 55, fullPage: true }).catch(() => {});
  } catch (e) { r.error = String(e.message).slice(0, 120); }
  await page.close(); return r;
}

(async () => {
  const browser = await chromium.launch(); const res = [];
  for (const view of VIEWS) for (const pg of PAGES) { const holder = {}; for (const mode of ['cold', 'warm']) res.push(await run(browser, view, pg, mode, holder)); if (holder.ctx) await holder.ctx.close(); }
  fs.writeFileSync(`${OUT}/audit.json`, JSON.stringify(res, null, 1));
  const line = r => `${r.page.padEnd(10)} ${r.w.padEnd(5)} ${r.mode.padEnd(5)} http=${r.http} cls=${r.cls} flashLightMs=${r.flashLightMs} ovf=${r.audit && r.audit.overflow} lowC=${r.audit && r.audit.lowContrast && r.audit.lowContrast.length} band=${r.audit && r.audit.band} err=${r.error || ''}`;
  fs.writeFileSync(`${OUT}/summary.txt`, res.map(line).join('\n')); console.log(res.map(line).join('\n'));
  await browser.close();
})();
