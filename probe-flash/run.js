// READ-ONLY flash + uniformity audit of live gatorbaitmedia.com. Cache-busting URLs, default TLS verification, no UA override.
// Per page x width x (cold, warm): CDP screencast frames, 100ms text/lead/font sampler, layout shifts, fetch + storage log, SSR vs hydrated.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://www.gatorbaitmedia.com';
const PAGES = [
  ['home', '/'], ['magazine', '/magazine'], ['allnews', '/gatorbait-media-blogs'], 
  ['post', '/post/longhorns-tumble-gators-return-florida-is-no-20-in-the-ap-poll'],
  ['cat-buddy', '/gatorbait-media-blogs/categories/buddy-s-blog'], ['cat-recruit', '/gatorbait-media-blogs/categories/gator-recruiting'],
  ['about', '/about'], ['pricing', '/pricing-plans'], ['contact', '/contact'], 
  
];
const VIEWS = [{ name: '390', w: 390, h: 844, mobile: true }, { name: '430', w: 430, h: 932, mobile: true }, { name: '1366', w: 1366, h: 900, mobile: false }, { name: '1920', w: 1920, h: 1080, mobile: false }];
const T = [200, 500, 1000, 2000, 4000];
fs.mkdirSync('shots', { recursive: true });
const sleep = ms => new Promise(s => setTimeout(s, ms));

const INIT = () => {
  const G = window.__g = { t0: performance.timeOrigin, samples: [], titleChanges: [], leadChanges: [], fontChanges: [], classLog: [], shifts: [], fetches: [], storage: [], paints: {}, lcp: 0 };
  const now = () => Math.round(performance.now());
  const short = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n || 70);
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (!e.hadRecentInput) G.shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), src: (e.sources || []).slice(0, 2).map(s => { const n = s.node; return n && n.nodeType === 1 ? (n.id ? '#' + n.id : n.tagName.toLowerCase() + '.' + String(n.className || '').split(/\s+/)[0]) : '?'; }).join(',') }); } }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) G.lcp = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) G.paints[e.name] = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (e) {}
  // storage reads/writes
  try {
    for (const [nm, st] of [['ls', 'localStorage'], ['ss', 'sessionStorage']]) {
      const P = Storage.prototype, g = P.getItem, s = P.setItem;
      if (!P.__gbmPatched) {
        P.getItem = function (k) { const v = g.call(this, k); if (G.storage.length < 60) G.storage.push({ t: now(), op: (this === window.localStorage ? 'ls' : 'ss') + '.get', key: short(k, 50), hit: v !== null, len: v ? v.length : 0 }); return v; };
        P.setItem = function (k, v) { if (G.storage.length < 60) G.storage.push({ t: now(), op: (this === window.localStorage ? 'ls' : 'ss') + '.set', key: short(k, 50), len: String(v).length }); return s.call(this, k, v); };
        P.__gbmPatched = true;
      }
      break;
    }
  } catch (e) {}
  // fetch log
  try {
    const of = window.fetch;
    window.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const rec = { t: now(), url: short(url, 110), cache: (init && init.cache) || (input && input.cache) || '' };
      if (G.fetches.length < 40) G.fetches.push(rec);
      return of.apply(this, arguments).then(r => { rec.st = r.status; rec.dur = now() - rec.t; rec.age = r.headers.get('age') || ''; rec.cc = short(r.headers.get('cache-control') || '', 40); rec.lm = short(r.headers.get('last-modified') || '', 30); return r; }, e => { rec.err = short(e && e.message, 40); throw e; });
    };
  } catch (e) {}
  const veilOn = () => /prepaint|veil|gbm-boot|gbm-hold/i.test((document.documentElement && document.documentElement.className) || '');
  const hookHtml = () => { const h = document.documentElement; if (!h) return setTimeout(hookHtml, 5); G.classLog.push({ t: now(), cls: short(h.className, 120) }); try { new MutationObserver(() => { G.classLog.push({ t: now(), cls: short(h.className, 120) }); if (G.classLog.length > 30) G.classLog.shift(); }).observe(h, { attributes: true, attributeFilter: ['class'] }); } catch (e) {} }; hookHtml();
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return null; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.05) return null; return r; };
  const where = el => { const out = []; for (let n = el; n && n !== document.body && out.length < 4; n = n.parentElement) { if (n.id) out.push('#' + n.id); else if (n.getAttribute && n.getAttribute('data-hook')) out.push('[' + n.getAttribute('data-hook') + ']'); else if (typeof n.className === 'string' && n.className.trim()) out.push('.' + n.className.trim().split(/\s+/)[0]); } return out.join('<'); };
  let prevTitles = new Set(), prevLead = '', prevFont = '';
  const sample = () => { try { sample0(); } catch (e) { G.err = String(e && e.message).slice(0, 100); } };
  const sample0 = () => {
    if (!document.body) return;
    const t = now();
    const titles = new Set(); let lead = null;
    const sel = 'h1,h2,h3,h4,[class*="title" i],[class*="headline" i],[class*="hl" i],[data-hook*="title"],[data-hook*="post-title"],.pm-h,.fp-h';
    const els = document.body.querySelectorAll(sel);
    for (const el of els) {
      if (el.closest('#SITE_HEADER,#SITE_FOOTER,header,footer,nav')) continue;
      const txt = short(el.textContent, 160); if (txt.length < 8 || txt.length > 160) continue;
      const r = vis(el); if (!r) continue; titles.add(txt);
      if (r.top < innerHeight && r.bottom > 0) { const fs = parseFloat(getComputedStyle(el).fontSize) || 0; if (!lead || fs > lead.fs || (fs === lead.fs && r.top < lead.top)) lead = { text: txt, fs: Math.round(fs), top: Math.round(r.top), where: where(el) }; }
    }
    const veil = veilOn();
    const added = [...titles].filter(x => !prevTitles.has(x)), removed = [...prevTitles].filter(x => !titles.has(x));
    if ((added.length || removed.length) && G.titleChanges.length < 40) G.titleChanges.push({ t, veil, add: added.slice(0, 4).map(x => short(x, 60)), del: removed.slice(0, 4).map(x => short(x, 60)), n: titles.size });
    prevTitles = titles;
    const lt = lead ? lead.text : '';
    if (lt !== prevLead && G.leadChanges.length < 20) { G.leadChanges.push({ t, veil, text: short(lt, 80), fs: lead && lead.fs, where: lead && lead.where }); prevLead = lt; }
    // fonts: first-family histogram on leaf-text elements + whether Barlow is usable
    const hist = {}; let n = 0;
    for (const el of document.body.querySelectorAll('h1,h2,h3,h4,p,a,span,li,button,div')) {
      if (n > 400) break; if (el.children.length) continue; const tx = (el.textContent || '').trim(); if (!tx) continue; if (!vis(el)) continue; n++;
      const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim(); hist[f] = (hist[f] || 0) + 1;
    }
    let barlowOK = false; try { barlowOK = document.fonts.check('16px Barlow') && [...document.fonts].some(f => /barlow/i.test(f.family) && f.status === 'loaded'); } catch (e) {}
    const fk = JSON.stringify(hist) + barlowOK;
    if (fk !== prevFont && G.fontChanges.length < 25) { G.fontChanges.push({ t, veil, barlowOK, hist }); prevFont = fk; }
    G.samples.push({ t, veil, titles: titles.size, lead: short(lt, 40) });
    if (G.samples.length > 140) G.samples.shift();
  };
  const iv = setInterval(sample, 100); setTimeout(() => clearInterval(iv), 9000);
  document.addEventListener('DOMContentLoaded', () => { G.dcl = now(); sample(); });
  window.addEventListener('load', () => { G.load = now(); });
};

const UNI = () => {
  const out = {};
  const rgb = s => { const m = String(s).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const PAL = { '#FA4616': 'orange', '#0021A5': 'blue', '#002657': 'darkblue', '#22884C': 'green', '#FFFFFF': 'white' };
  const cls = c => { if (!c || c[3] < 0.05) return null; const h = hex(c); if (PAL[h]) return PAL[h]; const [r, g, b] = c; if (Math.max(r, g, b) - Math.min(r, g, b) < 14) return 'neutral'; for (const [ph, nm] of Object.entries(PAL)) { const p = [1, 3, 5].map(i => parseInt(ph.slice(i, i + 2), 16)); if (Math.hypot(r - p[0], g - p[1], b - p[2]) < 18) return nm + '~'; } return 'OTHER'; };
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return null; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return null; return r; };
  const sig = el => { const cs = getComputedStyle(el); return { ff: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), fs: cs.fontSize, fw: cs.fontWeight, col: hex(rgb(cs.color) || [0, 0, 0]), ls: cs.letterSpacing, tt: cs.textTransform, lh: cs.lineHeight }; };
  const d = document.documentElement;
  out.title = document.title.slice(0, 70); out.url = location.pathname; out.h = d.scrollHeight; out.overflow = d.scrollWidth - d.clientWidth;
  out.bodyBg = getComputedStyle(document.body).backgroundColor; out.htmlBg = getComputedStyle(d).backgroundColor;
  const hd = document.getElementById('SITE_HEADER'), ft = document.getElementById('SITE_FOOTER');
  const box = el => { if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { y: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width), bg: cs.backgroundColor, pos: cs.position }; };
  out.header = box(hd); out.footer = box(ft);
  out.logo = !!document.querySelector('#SITE_HEADER .gbm-official-logo'); out.headerOwner = hd ? (hd.querySelector('[class*="gbm"]') ? (hd.querySelector('[class*="gbm"]').className + '').slice(0, 50) : 'native') : null;
  out.headerLinks = hd ? [...hd.querySelectorAll('a')].filter(vis).slice(0, 12).map(a => (a.textContent || '').trim().slice(0, 18)).filter(Boolean) : [];
  out.headerFont = hd ? sig([...hd.querySelectorAll('a')].filter(vis)[0] || hd) : null;
  out.footerLinks = ft ? [...ft.querySelectorAll('a')].filter(vis).slice(0, 14).map(a => (a.textContent || '').trim().slice(0, 18)).filter(Boolean) : [];
  out.footerFont = ft ? sig([...ft.querySelectorAll('a,p,span')].filter(vis)[0] || ft) : null;
  const main = document.getElementById('PAGES_CONTAINER') || document.querySelector('main');
  if (main) { const mr = main.getBoundingClientRect(); out.mainTop = Math.round(mr.top + scrollY); out.mainW = Math.round(mr.width); }
  const hb = hd ? hd.getBoundingClientRect().bottom + scrollY : 0; let firstTop = null;
  for (const el of document.querySelectorAll('#PAGES_CONTAINER h1,#PAGES_CONTAINER h2,#PAGES_CONTAINER img,#PAGES_CONTAINER p,#gbm-live,#gbm-magazine-page,[data-hook="post-page"],[data-hook="post-list-item"]')) { const r = vis(el); if (r) { firstTop = Math.round(r.top + scrollY); break; } }
  out.headerToFirst = firstTop === null ? null : firstTop - Math.round(hb);
  const lastBottom = (() => { let m = 0; for (const el of document.querySelectorAll('#PAGES_CONTAINER *')) { const r = el.getBoundingClientRect(); if (r.height > 1 && r.width > 1) m = Math.max(m, r.bottom + scrollY); } return Math.round(m); })();
  out.contentToFooter = ft ? Math.round(ft.getBoundingClientRect().top + scrollY) - lastBottom : null;
  // fonts + colors across visible leaf text
  const ff = {}, colText = {}, colBg = {}, other = {}; let leaf = 0;
  for (const el of document.body.querySelectorAll('*')) {
    if (leaf > 2500) break; if (!vis(el)) continue; const cs = getComputedStyle(el);
    if (!el.children.length && (el.textContent || '').trim()) { leaf++; const f = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(); ff[f] = (ff[f] || 0) + 1; const c = cls(rgb(cs.color)); if (c) { colText[c] = (colText[c] || 0) + 1; if (c === 'OTHER') { const k = hex(rgb(cs.color)); other['t' + k] = (other['t' + k] || 0) + 1; } } }
    const bg = cls(rgb(cs.backgroundColor)); if (bg) { colBg[bg] = (colBg[bg] || 0) + 1; if (bg === 'OTHER') { const k = hex(rgb(cs.backgroundColor)); other['b' + k] = (other['b' + k] || 0) + 1; } }
  }
  out.offenders = []; for (const el of document.body.querySelectorAll('*')) { if (out.offenders.length >= 10) break; if (el.children.length || !(el.textContent || '').trim() || !vis(el)) continue; const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (!/^(Barlow|Barlow Condensed|GB Broadcast)$/i.test(f)) out.offenders.push({ f, tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), id: (el.closest('[id^="comp-"]') || {}).id || '', text: el.textContent.trim().slice(0, 30), inline: (el.getAttribute('style') || '').slice(0, 70) }); }
  out.fonts = ff; out.colText = colText; out.colBg = colBg; out.otherTop = Object.entries(other).sort((a, b) => b[1] - a[1]).slice(0, 8);
  // headings
  const hs = {}; for (const h of document.querySelectorAll('#PAGES_CONTAINER h1,#PAGES_CONTAINER h2,#PAGES_CONTAINER h3,#gbm-live h1,#gbm-live h2,#gbm-magazine-page h1,#gbm-magazine-page h2')) { if (!vis(h)) continue; const k = h.tagName.toLowerCase(); if (hs[k]) continue; hs[k] = Object.assign({ text: (h.textContent || '').trim().slice(0, 40) }, sig(h)); }
  out.headings = hs;
  // buttons
  const btns = []; for (const b of document.querySelectorAll('#PAGES_CONTAINER a[class*="btn" i],#PAGES_CONTAINER button,#PAGES_CONTAINER [role="button"],#PAGES_CONTAINER a[class*="button" i],#gbm-live a[class*="btn" i],#gbm-live button,#gbm-magazine-page button,#gbm-magazine-page a[class*="btn" i]')) { if (btns.length >= 6) break; const r = vis(b); if (!r || !(b.textContent || '').trim()) continue; const cs = getComputedStyle(b); btns.push(Object.assign({ text: b.textContent.trim().slice(0, 24), bg: hex(rgb(cs.backgroundColor) || [0, 0, 0]) + '/' + (rgb(cs.backgroundColor) || [0, 0, 0, 0])[3], rad: cs.borderRadius, pad: cs.padding, h: Math.round(r.height) }, sig(b))); }
  out.buttons = btns;
  // sitewide css owner present?
  out.gbmStyles = [...document.querySelectorAll('style[id],link[id]')].map(s => s.id).filter(i => /gbm|gb-|swamp|prepaint|shell|sitewide/i.test(i)).slice(0, 14);
  out.htmlCls = String(d.className).slice(0, 120);
  return out;
};

async function load(browser, view, pageDef, mode, ctxHolder) {
  const [pname, path] = pageDef; const r = { page: pname, w: view.name, mode };
  let ctx = ctxHolder.ctx;
  if (!ctx) { ctx = await browser.newContext({ viewport: { width: view.w, height: view.h }, deviceScaleFactor: 1, isMobile: view.mobile, hasTouch: view.mobile }); await ctx.addInitScript(INIT); ctxHolder.ctx = ctx; }
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const frames = []; let t0node = 0;
  cdp.on('Page.screencastFrame', async f => { frames.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {} });
  const reqs = []; const errs = [];
  page.on('response', q => { const u = q.url(); if (/jsdelivr|raw\.githubusercontent|\.xml|current\.json|feed|\.woff2?|_api\/|communities-blog|fonts\.(gstatic|googleapis)/i.test(u) && reqs.length < 60) { const h = q.headers(); reqs.push({ t: Date.now() - t0node, u: u.replace(/^https?:\/\//, '').slice(0, 100), st: q.status(), age: h['age'] || '', cc: (h['cache-control'] || '').slice(0, 36), xc: (h['x-cache'] || h['cf-cache-status'] || h['x-served-by'] || '').slice(0, 24), fromCache: q.fromServiceWorker() ? 'sw' : '' }); } });
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  try {
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 45, everyNthFrame: 1 });
    t0node = Date.now();
    const resp = await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + 'gbm_qc=' + Date.now() + view.name + mode, { waitUntil: 'commit', timeout: 60000 });
    r.http = resp.status(); r.ttfbMs = Date.now() - t0node;
    let ssr = ''; try { ssr = await resp.text(); } catch (e) {}
    const H = [...ssr.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/g)].map(m => m[2].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&quot;/g, "'").replace(/\s+/g, ' ').trim()).filter(x => x.length > 7);
    r.ssr = { len: ssr.length, titles: H.slice(0, 5).map(x => x.slice(0, 60)), gbmRoot: /id="gbm-live"|id="gbm-magazine-page"/.test(ssr), pins: [...new Set((ssr.match(/gatorbait-media-redesign@[0-9a-f]{7,40}\/[\w./-]+/g) || []))].slice(0, 6), embedsInHtml: (ssr.match(/jsdelivr/g) || []).length };
    await sleep(Math.max(0, 6500 - (Date.now() - t0node)));
    // final state
    const g = await page.evaluate(() => { const G = window.__g || {}; return { dcl: G.dcl, load: G.load, fcp: (G.paints || {})['first-contentful-paint'], fp: (G.paints || {})['first-paint'], lcp: G.lcp, shifts: G.shifts, cls: +(G.shifts || []).reduce((a, s) => a + s.v, 0).toFixed(4), titleChanges: G.titleChanges, leadChanges: G.leadChanges, fontChanges: G.fontChanges, classLog: G.classLog, fetches: G.fetches, storage: G.storage, samples: (G.samples || []).length, timeOrigin: G.t0 }; });
    // finalize lead + title list now
    r.final = await page.evaluate(() => { const last = (window.__g.samples || []).slice(-1)[0] || {}; return { lead: last.lead, titles: last.titles, veil: last.veil, err: window.__g.err }; });
    r.nav = { dcl: g.dcl, load: g.load, fcp: g.fcp, fp: g.fp, lcp: g.lcp, cls: g.cls };
    r.shifts = (g.shifts || []).filter(s => s.v >= 0.002).slice(0, 8);
    const T0 = g.timeOrigin || t0node;
    const rel = f => Math.round(f.ts - T0);
    // veil release
    const rel1 = (g.classLog || []).find(c => !/prepaint|veil|gbm-boot|gbm-hold/i.test(c.cls) && (g.classLog || []).some(x => /prepaint|veil|gbm-boot|gbm-hold/i.test(x.cls) && x.t < c.t));
    r.veilReleaseMs = rel1 ? rel1.t : null; r.classLog = (g.classLog || []).slice(0, 6);
    // lead timeline: visible-to-user only (veil off)
    const leads = (g.leadChanges || []); r.leadChanges = leads;
    const shown = leads.filter(l => !l.veil && l.text); r.firstShownLead = shown[0] || null; r.finalLead = leads.length ? leads[leads.length - 1] : null;
    r.leadFlip = !!(shown.length && r.finalLead && shown[0].text !== r.finalLead.text);
    r.leadFlipCount = shown.length ? new Set(shown.map(x => x.text)).size - 1 : 0;
    const leadText = r.firstShownLead ? r.firstShownLead.text.slice(0, 30) : null;
    r.leadInSSR = leadText ? ssr.replace(/&amp;/g, '&').replace(/&#39;/g, "'").includes(leadText) : null;
    // title swaps after veil release
    r.titleSwapsVisible = (g.titleChanges || []).filter(c => !c.veil).slice(0, 14);
    r.fontChanges = (g.fontChanges || []).slice(0, 10).map(f => ({ t: f.t, veil: f.veil, bar: f.barlowOK, h: f.hist }));
    r.fetches = (g.fetches || []).slice(0, 14); r.storage = (g.storage || []).slice(0, 30); r.reqs = reqs.slice(0, 40);
    // frames at target times (nearest at or before target; node clock approximated from timeOrigin)
    const picks = [];
    for (const tt of T) {
      let best = null; for (const f of frames) { if (rel(f) <= tt) best = f; }
      const f = best || frames[0]; if (f) { const fn = `shots/${pname}-${view.name}-${mode}-${tt}.jpg`; fs.writeFileSync(fn, Buffer.from(f.data, 'base64')); picks.push({ tt, at: rel(f), kb: Math.round(f.data.length * 0.75 / 1024) }); }
    }
    if (mode === 'cold') { const real = frames.filter(f => f.data.length * 0.75 > 6000); let last = -1e9, n = 0; for (const f of real) { if (rel(f) - last < 140 || n >= 9) continue; last = rel(f); n++; fs.writeFileSync(`shots/seq-${pname}-${view.name}-${String(rel(f)).padStart(5, '0')}.jpg`, Buffer.from(f.data, 'base64')); } }
    r.framePicks = picks; r.frameOffsets = frames.map(f => rel(f)).slice(0, 40); r.frameCount = frames.length;
    await cdp.send('Page.stopScreencast').catch(() => {});
    if (mode === 'cold') { r.uni = await page.evaluate(UNI); }
    await page.screenshot({ path: `shots/${pname}-${view.name}-${mode}-final.jpg`, type: 'jpeg', quality: 50 }).catch(() => {});
  } catch (e) { r.error = String(e.message || e).slice(0, 250); }
  r.pageErrors = errs.slice(0, 3);
  await page.close().catch(() => {});
  return r;
}

(async () => {
  const browser = await chromium.launch();
  const all = [];
  await Promise.all(VIEWS.map(async view => {
    for (const pd of PAGES) {
      const holder = {};
      for (const mode of (view.name === '1366' ? ['cold', 'warm'] : ['cold'])) {
        let r = await load(browser, view, pd, mode, holder);
        if (r.http >= 500 || r.error) { await sleep(4000); r = await load(browser, view, pd, mode, holder); r.retried = true; }
        all.push(r);
        const { uni, ...rest } = r;
        console.log(`### FLASH ${pd[0]} @${view.name} ${mode} ` + JSON.stringify(rest));
        if (uni) console.log(`### UNI ${pd[0]} @${view.name} ` + JSON.stringify(uni));
        if (mode === 'cold') await sleep(1500);
      }
      await holder.ctx.close().catch(() => {});
    }
  }));
  fs.writeFileSync('shots/audit.json', JSON.stringify(all, null, 1));
  await browser.close();
  console.log('DONE');
})();
// after theme rev14 + typography rev7
// after theme rev15
// after theme rev16
// after theme rev17
