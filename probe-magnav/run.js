// READ-ONLY probe of live gatorbaitmedia.com /magazine for native-Wix flash on the paths real visitors take.
// Default TLS verification, no cache-busting params, no writes. Output: out/results.json, out/summary.txt, out/*.jpg
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://www.gatorbaitmedia.com';
const TAG = process.env.PROBE_TAG || 'run';
const sleep = ms => new Promise(s => setTimeout(s, ms));
fs.mkdirSync('out', { recursive: true });

const TICKS = []; for (let t = 0; t <= 3000; t += 100) TICKS.push(t); for (let t = 3500; t <= 8000; t += 500) TICKS.push(t); for (let t = 9000; t <= 14000; t += 1000) TICKS.push(t); // 100 ms to 3 s, 500 ms to 8 s, then 1 s to 14 s for slow-network runs
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const VIEWS = {
  d: { name: '1366', viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 },
  m: { name: '390', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: IPHONE_UA }
};

// ---- in-page recorder (installed in every top document of the context) ----
const INIT = (TICKS) => {
  if (window !== window.top) return;
  const F = window.__fx = { rec: null, pushes: [], pageshows: [], shifts: [], auto: !!window.__FX_AUTO };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (!e.hadRecentInput) F.shifts.push({ at: performance.timeOrigin + e.startTime, v: +e.value.toFixed(4), src: (e.sources || []).slice(0, 3).map(s => { const n = s.node; return n && n.nodeType === 1 ? (n.id ? '#' + n.id : n.tagName.toLowerCase() + '.' + String(n.className || '').split(/\s+/)[0]) : '?'; }).join(',') }); } }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
  ['pushState', 'replaceState'].forEach(k => { const o = history[k]; if (typeof o !== 'function') return; history[k] = function () { const r = o.apply(this, arguments); F.pushes.push({ at: Date.now(), k, path: location.pathname + location.search }); return r; }; });
  window.addEventListener('popstate', () => F.pushes.push({ at: Date.now(), k: 'popstate', path: location.pathname }));
  window.addEventListener('pageshow', e => { F.pageshows.push({ at: Date.now(), persisted: !!e.persisted }); if (e.persisted) F.start('pageshow-persisted'); });

  const isMag = () => /^\/magazine\/?$/.test(location.pathname);
  const veil = () => { try { const h = document.documentElement, b = document.body; if (!b || !h.classList.contains('gbm-pre')) return false; if (document.getElementById('gbm-magazine-page')) return false; const cs = getComputedStyle(b, '::after'); return cs.position === 'fixed' && cs.content !== 'none' && cs.content !== 'normal' && cs.display !== 'none'; } catch (e) { return false; } };
  const effOpacityOK = (el, stop) => { for (let a = el, i = 0; a && a !== stop && i < 12; a = a.parentElement, i++) { const c = getComputedStyle(a); if (+c.opacity < 0.05 || c.display === 'none') return false; } return true; };
  const own = el => Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim();
  const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '');
  // native Wix content that a visitor could actually see inside the viewport
  const native = () => {
    const sp = document.getElementById('SITE_PAGES'); const out = { n: 0, items: [] };
    if (!sp || getComputedStyle(sp).display === 'none') return out;
    const els = sp.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,span,li,img,canvas,video,[data-hook]'); let c = 0;
    for (const el of els) {
      if (++c > 600) break; const cs = getComputedStyle(el);
      if (cs.visibility !== 'visible' || cs.display === 'none' || +cs.opacity < 0.05) continue;
      const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue;
      const tag = el.tagName; const t = own(el); const media = (tag === 'IMG' && el.naturalWidth > 1) || tag === 'CANVAS' || tag === 'VIDEO';
      if (t.length < 3 && !media) continue; if (!effOpacityOK(el.parentElement, sp)) continue;
      out.n++; if (out.items.length < 5) out.items.push({ e: name(el), t: media ? '[' + tag + ']' : t.slice(0, 40), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
    }
    return out;
  };
  // visible text nodes outside our magazine wrap, header and footer (anything native or foreign sitting on the page)
  const stray = () => {
    const out = []; if (!document.body) return out; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, c = 0;
    while ((n = w.nextNode()) && c < 2500) {
      c++; const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t.length < 3) continue; const el = n.parentElement; if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue;
      if (el.closest('#SITE_HEADER,#SITE_FOOTER,#gbm-magazine-page,[id^="gbm-"],.gbm-football-tools,header,footer')) continue;
      const cs = getComputedStyle(el); if (cs.visibility !== 'visible' || cs.display === 'none' || +cs.opacity < 0.05) continue;
      const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.bottom <= 0 || r.top >= innerHeight) continue;
      out.push({ e: name(el), t: t.slice(0, 40), y: Math.round(r.top), h: Math.round(r.height), inSP: !!el.closest('#SITE_PAGES') }); if (out.length >= 6) break;
    }
    return out;
  };
  const box = id => { const el = document.getElementById(id) || document.querySelector(id); if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { y: Math.round(r.top), h: Math.round(r.height), vis: cs.visibility === 'visible' && cs.display !== 'none', inView: r.bottom > 0 && r.top < innerHeight && r.height > 2 }; };
  const snap = (full) => {
    const h = document.documentElement; const nv = native(); const s = {
      path: location.pathname, cls: String(h.className).replace(/\s+/g, ' ').slice(0, 80), veil: veil(),
      mag: (() => { const m = document.getElementById('gbm-magazine-page'); if (!m) return null; const r = m.getBoundingClientRect(); return { y: Math.round(r.top), h: Math.round(r.height) }; })(),
      nv: nv.n, nvItems: nv.items, hdr: box('SITE_HEADER'), ftr: box('SITE_FOOTER'), tools: box('.gbm-football-tools'),
      sh: document.scrollingElement ? document.scrollingElement.scrollHeight : 0
    };
    s.flash = s.nv > 0 && !s.veil;                          // native content visible and nothing covering it
    if (full) { s.stray = stray(); s.strayFlash = s.stray.length > 0 && !s.veil; }
    return s;
  };
  F.snap = snap;
  F.start = (label) => {
    if (F.rec && F.rec.raf) cancelAnimationFrame(F.rec.raf);
    const R = F.rec = { label, t0: performance.now(), epoch: performance.timeOrigin + performance.now(), ticks: [], rafFlash: [], flags: [], done: false, htmlLog: [], mag1: null, veilOn: null, veilOff: null };
    try { new MutationObserver(() => { const t = Math.round(performance.now() - R.t0); const v = veil(); if (v && R.veilOn === null) R.veilOn = t; if (!v && R.veilOn !== null && R.veilOff === null) R.veilOff = t; R.htmlLog.push({ t, cls: String(document.documentElement.className).slice(0, 70) }); if (R.htmlLog.length > 25) R.htmlLog.shift(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
    let i = 0; const next = () => { if (R.done) return; if (i >= TICKS.length) { R.done = true; return; } const due = R.t0 + TICKS[i]; const wait = Math.max(0, due - performance.now()); setTimeout(() => { const t = Math.round(performance.now() - R.t0); const s = snap(true); s.t = TICKS[i]; s.at = t; R.ticks.push(s); if (s.mag && R.mag1 === null) R.mag1 = t; i++; next(); }, wait); };
    next();
    // per-frame detector so a single-frame flash between the 100 ms ticks is still caught
    let last = null; const loop = () => { if (R.done) return; const t = Math.round(performance.now() - R.t0); const v = veil(); if (!v) { const nv = native(); if (nv.n > 0) { if (!last || t - last.t1 > 40) { last = { t0: t, t1: t, n: nv.n, items: nv.items.slice(0, 3), path: location.pathname }; R.rafFlash.push(last); } else { last.t1 = t; last.n = Math.max(last.n, nv.n); } } } if (t > 14200) { return; } R.raf = requestAnimationFrame(loop); };
    R.raf = requestAnimationFrame(loop);
    return R.epoch;
  };
  F.dump = () => { const R = F.rec; if (!R) return null; return { label: R.label, epoch: R.epoch, ticks: R.ticks, rafFlash: R.rafFlash, veilOn: R.veilOn, veilOff: R.veilOff, mag1: R.mag1, htmlLog: R.htmlLog, pushes: F.pushes.map(p => ({ t: Math.round(p.at - R.epoch), k: p.k, path: p.path })), pageshows: F.pageshows.map(p => ({ t: Math.round(p.at - R.epoch), persisted: p.persisted })), shifts: F.shifts.filter(s => s.at >= R.epoch - 50).map(s => ({ t: Math.round(s.at - R.epoch), v: s.v, src: s.src })), bundle: (() => { const e = performance.getEntriesByType('resource').filter(x => /magazine-postgame\.js/.test(x.name)).pop(); return e ? { start: Math.round(performance.timeOrigin + e.startTime - R.epoch), end: Math.round(performance.timeOrigin + e.responseEnd - R.epoch), size: e.transferSize } : null; })() }; };
  if (F.auto) F.start('auto');
};

async function newCtx(browser, v, extra) {
  const ctx = await browser.newContext(Object.assign({ viewport: v.viewport, deviceScaleFactor: v.deviceScaleFactor || 1, isMobile: !!v.isMobile, hasTouch: !!v.hasTouch }, v.userAgent ? { userAgent: v.userAgent } : {}, extra || {}));
  await ctx.addInitScript(INIT, TICKS);
  return ctx;
}
async function throttle(page, on) {
  const cdp = await page.context().newCDPSession(page);
  if (on) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: Math.round(1.6 * 1024 * 1024 / 8), uploadThroughput: Math.round(750 * 1024 / 8) }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  return cdp;
}
async function startShots(page) {
  const cdp = await page.context().newCDPSession(page); const frames = [];
  cdp.on('Page.screencastFrame', async f => { frames.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {} });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 40, everyNthFrame: 1 });
  return { frames, cdp };
}
function savePicks(sc, name, d, frames) {
  if (!d) return []; const picks = []; const want = new Set();
  const flagged = d.ticks.filter(t => t.flash || t.strayFlash).map(t => t.t);
  flagged.slice(0, 5).forEach(t => want.add(t)); [200, 1000, 3000, 8000, 14000].forEach(t => want.add(t));
  (d.rafFlash || []).slice(0, 3).forEach(f => want.add(Math.round(f.t0)));
  for (const tt of [...want].sort((a, b) => a - b)) {
    let best = null; const abs = d.epoch + tt; for (const f of frames) { if (f.ts <= abs + 30) best = f; }
    if (!best) continue; const fn = `${name}-${tt}.jpg`; fs.writeFileSync('out/' + fn, Buffer.from(best.data, 'base64')); picks.push({ t: tt, file: fn, frameAt: Math.round(best.ts - d.epoch) });
  }
  return picks;
}
async function finish(name, meta, page, shots, waitMs) {
  await sleep(waitMs || 14800);
  let d = null; try { d = await page.evaluate(() => window.__fx && window.__fx.dump()); } catch (e) { meta.dumpErr = String(e.message).slice(0, 100); }
  meta.rec = d; meta.picks = savePicks(null, name, d, shots ? shots.frames : []);
  try { await page.screenshot({ path: `out/${name}-final.jpg`, type: 'jpeg', quality: 45 }); } catch (e) {}
  try { if (shots) await shots.cdp.send('Page.stopScreencast'); } catch (e) {}
  return meta;
}

// ---- click helpers ----
const MAG_RE = '/magazine';
async function findMagLink(page, scope) {
  return await page.evaluateHandle(({ scope }) => {
    const ok = a => { try { const u = new URL(a.href, location.href); return /^\/magazine\/?$/.test(u.pathname) && u.hostname.replace(/^www\./, '') === 'gatorbaitmedia.com'; } catch (e) { return false; } };
    const vis = a => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const all = [...document.querySelectorAll('a[href]')].filter(ok);
    const inHdr = a => !!a.closest('#SITE_HEADER,#gbm-site-header,#gbm-mobile-shell-host,header,nav,[id*="drawer" i],[id*="mobile" i]'), inFtr = a => !!a.closest('#SITE_FOOTER,footer');
    let pool = all;
    if (scope === 'header') pool = all.filter(inHdr); else if (scope === 'footer') pool = all.filter(inFtr); else if (scope === 'card') pool = all.filter(a => !inHdr(a) && !inFtr(a));
    return { vis: pool.filter(vis)[0] || null, hidden: pool[0] || null, total: all.length, pool: pool.length };
  }, { scope });
}
async function safeClick(el, meta) { try { await el.click({ timeout: 3000 }); } catch (e) { meta.link.fallback = 'dom-click after: ' + String(e.message).split('\n')[0].slice(0, 60); await el.evaluate(a => a.click()); } }
async function clickMag(page, v, scope, meta) {
  const info = await findMagLink(page, scope); const vis = (await info.getProperty('vis')).asElement(); const hidden = (await info.getProperty('hidden')).asElement();
  meta.link = { scope, total: await (await info.getProperty('total')).jsonValue(), pool: await (await info.getProperty('pool')).jsonValue(), mode: null };
  if (vis) { await vis.scrollIntoViewIfNeeded().catch(() => {}); await sleep(250); meta.link.mode = 'direct'; await page.evaluate(() => window.__fx.start('click')); await safeClick(vis, meta); return true; }
  if (scope === 'header' && v.isMobile) {
    const burgers = ['#SITE_HEADER [aria-label*="menu" i]', '#SITE_HEADER [data-testid*="menu" i]', '#SITE_HEADER [class*="burger" i]', '#SITE_HEADER [class*="hamburger" i]', '#gbm-mobile-drawer-root, [class*="gbm-mobile" i] button', '#SITE_HEADER button'];
    for (const sel of burgers) { const b = page.locator(sel).first(); if (await b.count() && await b.isVisible().catch(() => false)) { await b.click({ timeout: 4000 }).catch(() => {}); await sleep(1200); const i2 = await findMagLink(page, 'any'); const l = (await i2.getProperty('vis')).asElement(); if (l) { meta.link.mode = 'menu:' + sel; await page.evaluate(() => window.__fx.start('click')); await safeClick(l, meta); return true; } } }
  }
  if (hidden) { meta.link.mode = 'dom-click (link not visible)'; await page.evaluate(() => window.__fx.start('click')); await hidden.evaluate(a => a.click()); return true; }
  meta.link.mode = 'NOT FOUND'; return false;
}
async function clickByPath(page, re, meta, key) {
  const h = await page.evaluateHandle(src => { const rx = new RegExp(src); const vis = a => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && cs.display !== 'none'; }; const all = [...document.querySelectorAll('a[href]')].filter(a => { try { return rx.test(new URL(a.href, location.href).pathname); } catch (e) { return false; } }); return all.find(vis) || all[0] || null; }, re);
  const el = h.asElement(); meta[key] = !!el; if (!el) return false; await el.evaluate(a => a.click()); return true;
}

async function loadHome(page, path) { await page.goto(BASE + (path || '/'), { waitUntil: 'load', timeout: 90000 }); await sleep(3500); }
const POST = '/post/florida-is-one-win-from-bowl-eligibility-with-a-bye-before-georgia';

// ---- scenarios ----
const SC = [];
const add = (id, fn, opts) => SC.push(Object.assign({ id, fn }, opts || {}));

for (const vk of ['d', 'm']) {
  const v = VIEWS[vk];
  // (a) in-site SPA navigation
  add(`a1-home-header-${v.name}`, async (b, v, meta) => { const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/'); const sh = await startShots(p); await clickMag(p, v, 'header', meta); return { ctx, p, sh }; }, { v });
  add(`a2-home-card-${v.name}`, async (b, v, meta) => { const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/'); const sh = await startShots(p); await clickMag(p, v, 'card', meta); return { ctx, p, sh }; }, { v });
  add(`a3-home-footer-${v.name}`, async (b, v, meta) => { const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/'); const sh = await startShots(p); await clickMag(p, v, 'footer', meta); return { ctx, p, sh }; }, { v });
  add(`a4-blogs-header-${v.name}`, async (b, v, meta) => { const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/gatorbait-media-blogs'); const sh = await startShots(p); await clickMag(p, v, 'header', meta); return { ctx, p, sh }; }, { v });
  add(`a5-post-header-${v.name}`, async (b, v, meta) => { const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, POST); const sh = await startShots(p); await clickMag(p, v, 'header', meta); return { ctx, p, sh }; }, { v });
  // second SPA visit in the same session: home -> magazine -> home -> magazine
  add(`a6-second-visit-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/'); const m0 = {};
    await clickMag(p, v, 'header', m0); await sleep(6000); meta.firstVisit = await p.evaluate(() => ({ path: location.pathname, mag: !!document.getElementById('gbm-magazine-page'), cls: document.documentElement.className.slice(0, 60) }));
    const wentHome = await clickByPath(p, '^/$', meta, 'homeLink'); if (!wentHome) await p.goBack(); await sleep(3500);
    meta.afterHome = await p.evaluate(() => ({ path: location.pathname, cls: document.documentElement.className.slice(0, 60), mag: !!document.getElementById('gbm-magazine-page') }));
    const sh = await startShots(p); await clickMag(p, v, 'header', meta); return { ctx, p, sh };
  }, { v });
  // (b) back / forward
  add(`b1-spa-back-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/'); await clickMag(p, v, 'header', {}); await sleep(6000);
    const ok = await clickByPath(p, '^/gatorbait-media-blogs/?$', meta, 'blogLink'); await sleep(4000);
    meta.beforeBack = await p.evaluate(() => location.pathname); const sh = await startShots(p);
    await p.evaluate(() => window.__fx.start('goBack')); await p.goBack({ waitUntil: 'commit' }).catch(() => {}); return { ctx, p, sh };
  }, { v });
  add(`b2-spa-forward-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/'); await clickMag(p, v, 'header', {}); await sleep(6000);
    await p.goBack({ waitUntil: 'commit' }).catch(() => {}); await sleep(4000); meta.beforeFwd = await p.evaluate(() => location.pathname); const sh = await startShots(p);
    await p.evaluate(() => window.__fx.start('goForward')); await p.goForward({ waitUntil: 'commit' }).catch(() => {}); return { ctx, p, sh };
  }, { v });
  add(`b3-doc-back-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p = await ctx.newPage(); await p.addInitScript(() => { if (window.__fx && window === window.top) window.__fx.start('auto'); });
    await p.goto(BASE + '/magazine', { waitUntil: 'load', timeout: 90000 }); await sleep(5000);
    await p.goto(BASE + '/about', { waitUntil: 'load', timeout: 90000 }); await sleep(2500); const sh = await startShots(p);
    await p.goBack({ waitUntil: 'commit' }).catch(() => {}); return { ctx, p, sh };
  }, { v });
  // (c) throttled
  add(`c1-slow-direct-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p = await ctx.newPage(); await p.addInitScript(() => { if (window.__fx && window === window.top) window.__fx.start('auto'); }); await throttle(p, true); const sh = await startShots(p);
    p.goto(BASE + '/magazine', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); return { ctx, p, sh, wait: 15500 };
  }, { v, ticksNote: 'Slow 4G + 4x CPU' });
  add(`c2-slow-spa-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p = await ctx.newPage(); await loadHome(p, '/'); await throttle(p, true); const sh = await startShots(p); await clickMag(p, v, 'header', meta); return { ctx, p, sh, wait: 15500 };
  }, { v, ticksNote: 'Slow 4G + 4x CPU' });
  // (d) warm reload, (e) UTM / trailing slash / hash entry
  add(`d1-warm-reload-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p = await ctx.newPage(); await p.goto(BASE + '/magazine', { waitUntil: 'load', timeout: 90000 }); await sleep(6000);
    await p.evaluate(() => { window.name = 'x'; }); await p.addInitScript(() => { if (window.__fx && window === window.top) window.__fx.start('auto'); }); const sh = await startShots(p); p.reload({ waitUntil: 'commit' }).catch(() => {}); return { ctx, p, sh };
  }, { v });
  add(`d2-warm-newtab-${v.name}`, async (b, v, meta) => {
    const ctx = await newCtx(b, v); const p0 = await ctx.newPage(); await p0.goto(BASE + '/magazine', { waitUntil: 'load', timeout: 90000 }); await sleep(6000); await p0.close();
    const p = await ctx.newPage(); await p.addInitScript(() => { if (window.__fx && window === window.top) window.__fx.start('auto'); }); const sh = await startShots(p); p.goto(BASE + '/magazine', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); return { ctx, p, sh };
  }, { v });
  for (const [k, q] of [['e1-utm', '/magazine?utm_source=newsletter&utm_medium=email&utm_campaign=postgame-texas&utm_content=cover'], ['e2-utm-slash', '/magazine/?utm_source=newsletter&utm_medium=email&utm_campaign=postgame-texas'], ['e3-hash', '/magazine#top']]) {
    add(`${k}-${v.name}`, async (b, v, meta) => { const ctx = await newCtx(b, v); const p = await ctx.newPage(); await p.addInitScript(() => { if (window.__fx && window === window.top) window.__fx.start('auto'); }); const sh = await startShots(p); p.goto(BASE + q, { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); meta.url = q; return { ctx, p, sh }; }, { v });
  }
  add(`e4-direct-cold-${v.name}`, async (b, v, meta) => { const ctx = await newCtx(b, v); const p = await ctx.newPage(); await p.addInitScript(() => { if (window.__fx && window === window.top) window.__fx.start('auto'); }); const sh = await startShots(p); p.goto(BASE + '/magazine', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); return { ctx, p, sh }; }, { v });
}

// (f) bfcache (separate browser with back/forward cache enabled)
const BF = [];
for (const vk of ['d', 'm']) { const v = VIEWS[vk]; BF.push({ id: `f1-bfcache-${v.name}`, v, fn: async (b, v, meta) => {
  const ctx = await newCtx(b, v); const p = await ctx.newPage(); await p.addInitScript(() => { if (window.__fx && window === window.top) window.__fx.start('auto'); });
  await p.goto(BASE + '/magazine', { waitUntil: 'load', timeout: 90000 }); await sleep(6000);
  await p.evaluate(() => { location.href = '/about'; }); await p.waitForLoadState('load').catch(() => {}); await sleep(2500);
  meta.beforeBack = await p.evaluate(() => location.pathname); const sh = await startShots(p);
  await p.goBack({ waitUntil: 'commit' }).catch(() => {}); return { ctx, p, sh };
} }); }

async function runList(browser, list, summary) {
  for (const s of list) {
    const meta = { id: s.id, view: s.v.name, note: s.ticksNote || '' }; let h = null; const t0 = Date.now();
    try { h = await s.fn(browser, s.v, meta); await finish(s.id, meta, h.p, h.sh, h.wait); }
    catch (e) { meta.error = String(e && e.message || e).slice(0, 300); }
    try { if (h && h.ctx) await h.ctx.close(); } catch (e) {}
    const d = meta.rec; const fl = d ? d.ticks.filter(t => t.flash) : []; const sf = d ? d.ticks.filter(t => t.strayFlash) : [];
    const raf = d ? d.rafFlash : [];
    const sum = {
      id: s.id, mode: meta.link && meta.link.mode, err: meta.error || meta.dumpErr || null,
      ticks: d ? d.ticks.length : 0, tickFlash: fl.map(t => t.t), tickFlashPath: [...new Set(fl.map(t => t.path))], strayTicks: sf.map(t => t.t), strayWhat: sf[0] ? sf[0].stray.slice(0, 2).map(x => x.e + ':' + x.t) : [],
      rafFlash: raf.map(f => ({ from: f.t0, to: f.t1, n: f.n, path: f.path, items: f.items.slice(0, 2).map(i => i.e + ':' + i.t) })),
      veilOn: d && d.veilOn, veilOff: d && d.veilOff, mag1: d && d.mag1, bundle: d && d.bundle,
      pushes: d && d.pushes.slice(0, 4), pageshows: d && d.pageshows, cls: d ? +d.shifts.reduce((a, x) => a + x.v, 0).toFixed(4) : null, shifts: d ? d.shifts.filter(x => x.v >= 0.003).slice(0, 5) : null,
      footerInViewWithoutMag: d ? d.ticks.filter(t => t.ftr && t.ftr.inView && !t.mag && !t.veil && /^\/magazine/.test(t.path)).map(t => t.t) : null,
      toolsAppear: d ? (d.ticks.find(t => t.tools) || {}).t : null,
      final: d && d.ticks.length ? (({ path, cls, veil, nv, mag, hdr, ftr, tools }) => ({ path, cls, veil, nv, mag, hdr, ftr, tools }))(d.ticks[d.ticks.length - 1]) : null,
      extra: { firstVisit: meta.firstVisit, afterHome: meta.afterHome, beforeBack: meta.beforeBack, beforeFwd: meta.beforeFwd, link: meta.link, blogLink: meta.blogLink, homeLink: meta.homeLink }, picks: (meta.picks || []).length, secs: Math.round((Date.now() - t0) / 1000)
    };
    summary.push(sum); fs.writeFileSync(`out/${s.id}.json`, JSON.stringify(meta, null, 0));
    console.log('### ' + JSON.stringify(sum));
  }
}

(async () => {
  const summary = [];
  const browser = await chromium.launch();
  await runList(browser, SC, summary); await browser.close();
  const b2 = await chromium.launch({ ignoreDefaultArgs: ['--disable-back-forward-cache'], args: ['--enable-features=BackForwardCache', '--disable-features=BackForwardCacheMemoryControls'] });
  await runList(b2, BF, summary); await b2.close();
  fs.writeFileSync('out/summary.json', JSON.stringify({ tag: TAG, at: new Date().toISOString(), summary }, null, 1));
  const lines = summary.map(s => `${s.id.padEnd(26)} link=${(s.mode || '-').slice(0, 12).padEnd(12)} tickFlash=${JSON.stringify(s.tickFlash)} raf=${JSON.stringify(s.rafFlash.map(f => f.from + '-' + f.to))} stray=${JSON.stringify(s.strayTicks)} veil=${s.veilOn}/${s.veilOff} mag@${s.mag1} cls=${s.cls} ftrNoMag=${JSON.stringify(s.footerInViewWithoutMag)} tools@${s.toolsAppear} ${s.err || ''}`);
  fs.writeFileSync('out/summary.txt', lines.join('\n') + '\n');
  console.log(lines.join('\n'));
})();
