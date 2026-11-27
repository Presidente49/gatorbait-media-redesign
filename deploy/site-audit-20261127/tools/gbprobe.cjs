#!/usr/bin/env node
/*
 gbprobe — shared, rate-limited page checker for www.gatorbaitmedia.com (READ-ONLY).
 Usage:  node gbprobe.cjs <outDir> <widths> <path> [<path> ...]
   widths: comma list, e.g. 320,390,430 or 1366,1920 or 768   (<=820 = phone/tablet emulation)
   path:   site path such as /about or a full https://www.gatorbaitmedia.com/... URL
 Env:    GB_EVAL=/abs/file.js   file containing ONE function expression, e.g. () => ({...}); result saved as "custom"
         GB_WAIT=ms             extra settle time after load (default 3500)
         GB_CSS=/abs/file.css   inject this CSS after load, BEFORE measuring (stage a fix without saving anything)
         GB_INIT=/abs/file.js   run this script before any page script (stage a JS fix without saving anything)
         GB_SHOTS_Y=0,700,1400  also save viewport screenshots scrolled to these Y offsets (CSS px) as <slug>-<width>-y<N>.png
         In GB_EVAL code use window.__gbScroll(y) / window.__gbScrollY() / window.__gbDocH(): several pages scroll an inner
         container, so window.scrollTo and window.scrollY do nothing there.
         GB_FULL=1              also save a full-page screenshot (unreliable on pages where body is the scroller)
 Output: one JSON line per (path,width) on stdout, plus <outDir>/<slug>-<width>.json and PNGs:
         <slug>-<width>-top.png, -bottom.png, -gapN.png (viewport centred on each blank gap candidate)
 Limits: max 5 page loads at once across ALL processes, >=0.8 s between starts, automatic cool-down on 429/challenge.
         Wix's eager link prefetches are aborted so one load = one page.
*/
const { chromium, devices } = require('playwright');
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const B = 'https://www.gatorbaitmedia.com';
const LOCK = '' + require('os').tmpdir() + '/gbprobe-locks';
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(LOCK, { recursive: true });
async function acquire() {
  for (;;) {
    try { const cd = +fs.readFileSync(path.join(LOCK, 'cooldown'), 'utf8'); if (Date.now() < cd) { await sleep(Math.min(cd - Date.now(), 15000)); continue; } } catch (e) {}
    for (let i = 0; i < 5; i++) {
      const d = path.join(LOCK, 'slot' + i);
      try { fs.mkdirSync(d); fs.writeFileSync(path.join(d, 'pid'), String(process.pid));
        for (;;) { let last = 0; try { last = +fs.readFileSync(path.join(LOCK, 'last'), 'utf8'); } catch (e) {} const w = last + 800 - Date.now(); if (w <= 0) break; await sleep(w); }
        fs.writeFileSync(path.join(LOCK, 'last'), String(Date.now())); return d; } catch (e) {
        try { const st = fs.statSync(d); if (Date.now() - st.mtimeMs > 180000) { fs.rmSync(d, { recursive: true, force: true }); } } catch (e2) {}
      }
    }
    await sleep(700 + Math.floor(Math.random() * 600));
  }
}
function release(d) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) {} }
function cooldown(ms) { try { fs.writeFileSync(path.join(LOCK, 'cooldown'), String(Date.now() + ms)); } catch (e) {} }
const slugOf = p => (p.replace(/^https?:\/\/[^/]+/, '').replace(/[?#].*$/, '').replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 70) || 'home');

const IN_PAGE = async (T) => {
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const docH = () => window.__gbDocH();
  // find the real scroller (some pages scroll body / an inner container)
  for (let y = 0; y < docH(); y += 700) { window.__gbScroll(y); await sl(110); }
  window.__gbScroll(0); await sl(500);
  const H = docH(), W = innerWidth, VH = innerHeight;
  const d = n => { if (!n || !n.tagName) return ''; let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).slice(0, 2).join('.') : ''; if (c) s += '.' + c; const dh = n.getAttribute && n.getAttribute('data-hook'); if (dh) s += '[' + dh + ']'; return s.slice(0, 60); };
  const vis = el => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
  const sy = window.__gbScrollY();
  // ---- painted-content intervals on the Y axis
  const iv = [];
  const add = (t, b) => { if (b - t >= 2 && b > 0 && t < H) iv.push([Math.max(0, t), Math.min(H, b)]); };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n, cnt = 0; const rg = document.createRange();
  while ((n = tw.nextNode()) && cnt < 9000) { if (!n.textContent.trim()) continue; const p = n.parentElement; if (!p || !vis(p)) continue; if (p.closest('script,style,noscript,template')) continue; rg.selectNodeContents(n); const r = rg.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue; if (r.right < 0 || r.left > W) continue; add(r.top + sy, r.bottom + sy); cnt++; }
  const pageBg = getComputedStyle(document.body).backgroundColor;
  document.querySelectorAll('img,video,canvas,svg,iframe,input,button,select,textarea,hr,[style*="background"],section,div,a,li,header,footer,figure').forEach(el => {
    const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 2) return; if (r.right < 0 || r.left > W) return; const tag = el.tagName; if (!vis(el)) return;
    if (/^(IMG|VIDEO|CANVAS|IFRAME|INPUT|BUTTON|SELECT|TEXTAREA|HR)$/.test(tag) || tag.toLowerCase() === 'svg') { if (tag === 'IMG' && !(el.complete && el.naturalWidth > 0)) return; if (r.height > 6000) return; add(r.top + sy, r.bottom + sy); return; }
    const cs = getComputedStyle(el); const hasImg = cs.backgroundImage && cs.backgroundImage !== 'none';
    const bg = cs.backgroundColor; const solid = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== pageBg && !/^rgba?\(\s*(24\d|25\d),\s*(24\d|25\d),\s*(24\d|25\d)/.test(bg);
    const bord = (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') || (parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== 'none');
    if ((hasImg || solid) && r.height <= 1400) add(r.top + sy, r.bottom + sy);
    else if (bord && r.height <= 1400) { add(r.top + sy, r.top + sy + 2); add(r.bottom + sy - 2, r.bottom + sy); }
  });
  iv.sort((a, b) => a[0] - b[0]);
  const gapsRaw = []; let cur = 0;
  for (const [t, b] of iv) { if (t - cur >= T) gapsRaw.push([cur, t - cur]); if (b > cur) cur = b; }
  if (H - cur >= T) gapsRaw.push([cur, H - cur]);
  const footer = document.querySelector('footer, #SITE_FOOTER, [data-hook="footer"]'); const fr = footer ? footer.getBoundingClientRect() : null;
  const gaps = [];
  for (const [y, h] of gapsRaw.slice(0, 8)) {
    window.__gbScroll(Math.max(0, y + h / 2 - VH / 2)); await sl(160);
    const cy = y + h / 2 - window.__gbScrollY(); let el = document.elementFromPoint(W / 2, Math.min(VH - 2, Math.max(1, cy))); const chain = []; let m = el;
    while (m && m !== document.documentElement && chain.length < 5) { const r = m.getBoundingClientRect(), cs = getComputedStyle(m); chain.push(`${d(m)} h=${Math.round(r.height)} minH=${cs.minHeight} pt=${cs.paddingTop} pb=${cs.paddingBottom} mt=${cs.marginTop} mb=${cs.marginBottom} rows=${(cs.gridTemplateRows || '').slice(0, 70)}`); m = m.parentElement; }
    gaps.push({ y: Math.round(y), h: Math.round(h), atBottom: y + h >= H - 4, scrollTo: Math.round(Math.max(0, y + h / 2 - VH / 2)), chain });
  }
  window.__gbScroll(0); await sl(200);
  // ---- horizontal overflow
  const ovf = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.__gbScroller().scrollWidth) - W; const wide = [];
  if (ovf > 1) { document.querySelectorAll('body *').forEach(el => { if (wide.length > 40) return; const r = el.getBoundingClientRect(); if (r.width > 4 && r.height > 2 && (r.right > W + 2 || r.left < -2) && vis(el)) { const cs = getComputedStyle(el); if (cs.position === 'fixed') return; wide.push({ el: d(el), l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) }); } }); }
  // ---- text problems
  const tiny = [], clipped = []; const seenT = new Set();
  document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,h5,button,label,td,div').forEach(el => { if (tiny.length > 12 && clipped.length > 12) return; const own = [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim().length > 2); if (!own || !vis(el)) return; const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return; const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize); const txt = el.textContent.trim().slice(0, 40);
    if (fs < 11 && tiny.length <= 12 && !seenT.has(d(el) + fs)) { seenT.add(d(el) + fs); tiny.push({ el: d(el), px: fs, txt }); }
    if (clipped.length <= 12 && (cs.overflow === 'hidden' || cs.overflowX === 'hidden') && cs.textOverflow !== 'ellipsis' && cs.whiteSpace === 'nowrap' && el.scrollWidth > el.clientWidth + 3) clipped.push({ el: d(el), need: el.scrollWidth, has: el.clientWidth, txt }); });
  // ---- low-contrast text (invisible text like white-on-white)
  const lum = c => { const mm = (c.match(/[\d.]+/g) || []).map(Number); if (mm.length < 3) return null; const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return { L: 0.2126 * f(mm[0]) + 0.7152 * f(mm[1]) + 0.0722 * f(mm[2]), a: mm.length > 3 ? mm[3] : 1 }; };
  const bgOf = el => { let m = el; while (m && m !== document.documentElement) { const cs = getComputedStyle(m); if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; const l = lum(cs.backgroundColor); if (l && l.a > 0.6) return l.L; m = m.parentElement; } const l = lum(getComputedStyle(document.body).backgroundColor); return l && l.a > 0.6 ? l.L : 1; };
  const lowc = []; const seenC = new Set(); let scanned = 0;
  document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,h5,button,label,td,div').forEach(el => { if (lowc.length > 14 || scanned > 2500) return; const own = [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim().length > 2); if (!own || !vis(el)) return; const r = el.getBoundingClientRect(); if (r.width < 6 || r.height < 6) return; scanned++; const cs = getComputedStyle(el); const fg = lum(cs.webkitTextFillColor && cs.webkitTextFillColor !== 'currentcolor' ? cs.webkitTextFillColor : cs.color); if (!fg) return; const bg = bgOf(el); if (bg === null) return; const ratio = (Math.max(fg.L, bg) + 0.05) / (Math.min(fg.L, bg) + 0.05); if (ratio < 1.6) { const k = d(el) + cs.color; if (seenC.has(k)) return; seenC.add(k); lowc.push({ el: d(el), color: cs.color, ratio: +ratio.toFixed(2), y: Math.round(r.top + window.__gbScrollY()), txt: el.textContent.trim().slice(0, 40) }); } });
  // ---- images / iframes / overlays
  const imgs = [...document.images].filter(i => vis(i)); const broken = imgs.filter(i => i.complete && i.naturalWidth === 0 && (i.currentSrc || i.src) && !/^data:/.test(i.currentSrc || i.src)).slice(0, 10).map(i => ({ src: (i.currentSrc || i.src).slice(0, 140), at: d(i.closest('[id]') || i) }));
  const dpr = devicePixelRatio || 1; const oversized = imgs.map(i => { const r = i.getBoundingClientRect(); return { src: (i.currentSrc || i.src || '').slice(0, 160), nat: i.naturalWidth, shown: Math.round(r.width), over: r.width > 20 ? +(i.naturalWidth / (r.width * dpr)).toFixed(1) : 0 }; }).filter(x => x.over >= 2.5 && x.nat >= 900).sort((a, b) => b.nat - a.nat).slice(0, 10);
  const frames = [...document.querySelectorAll('iframe')].map(f => { const r = f.getBoundingClientRect(); return { src: (f.src || '').slice(0, 110), w: Math.round(r.width), h: Math.round(r.height), hidden: r.width < 2 || r.height < 2 || !vis(f) }; }).slice(0, 14);
  const overlays = []; document.querySelectorAll('body *').forEach(el => { if (overlays.length > 8) return; const cs = getComputedStyle(el); if ((cs.position === 'fixed' || cs.position === 'sticky') && vis(el)) { const r = el.getBoundingClientRect(); const area = Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, VH) - Math.max(r.top, 0)); if (area / (W * VH) > 0.12) overlays.push({ el: d(el), pos: cs.position, pct: Math.round(100 * area / (W * VH)), top: Math.round(r.top), h: Math.round(r.height) }); } });
  return { docH: H, vw: W, vh: VH, htmlClass: document.documentElement.className.slice(0, 120), title: document.title.slice(0, 90), h1: (document.querySelector('h1') || {}).textContent ? document.querySelector('h1').textContent.trim().slice(0, 80) : '', footerTop: fr ? Math.round(fr.top + window.__gbScrollY()) : null, gaps, overflowPx: ovf, wide: wide.slice(0, 8), tiny: tiny.slice(0, 8), clipped: clipped.slice(0, 8), lowContrast: lowc.slice(0, 10), broken, oversized, frames, overlays, dom: document.querySelectorAll('*').length, scripts: document.scripts.length, lcp: window.__lcp || 0, cls: +(window.__cls || 0).toFixed(3), longTaskMs: Math.round(window.__lt || 0) };
};

(async () => {
  const [outDir, widthsArg, ...paths] = process.argv.slice(2);
  if (!outDir || !widthsArg || !paths.length) { console.error('usage: node gbprobe.cjs <outDir> <widths> <path> [<path>...]'); process.exit(2); }
  fs.mkdirSync(outDir, { recursive: true });
  const widths = widthsArg.split(',').map(Number).filter(Boolean); const WAIT = +(process.env.GB_WAIT || 3500);
  let custom = null; if (process.env.GB_EVAL) custom = fs.readFileSync(process.env.GB_EVAL, 'utf8');
  const browser = await chromium.launch();
  for (const p of paths) for (const w of widths) {
    const url = /^https?:/.test(p) ? p : B + (p.startsWith('/') ? p : '/' + p); const slug = slugOf(p) + '-' + w; let out = { path: p, width: w };
    for (let attempt = 1; attempt <= 3; attempt++) {
      const slot = await acquire(); let ctx;
      try {
        const phone = w <= 820; ctx = await browser.newContext(phone ? { viewport: { width: w, height: w >= 700 ? 1024 : 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: devices['iPhone 13'].userAgent } : { viewport: { width: w, height: w >= 1900 ? 1080 : 900 } });
        const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable');
        const rq = {}; let prefetchAborted = 0, beacons = 0; const errs = [], fails = [];
        cdp.on('Network.responseReceived', e => { rq[e.requestId] = { u: e.response.url, s: e.response.status, t: e.type, b: 0 }; });
        cdp.on('Network.loadingFinished', e => { if (rq[e.requestId]) rq[e.requestId].b = e.encodedDataLength; });
        await page.route('**/*', r => { const h = r.request().headers(); if ((h['sec-purpose'] || '').includes('prefetch')) { prefetchAborted++; return r.abort(); } if (/google-analytics\.com\/(g\/)?collect|analytics\.google\.com\/g\/collect|facebook\.com\/tr|frog\.wix\.com|stats\.g\.doubleclick\.net|\/ccm\/collect|bat\.bing\.com/.test(r.request().url())) { beacons++; return r.abort(); } r.continue(); });
        page.on('requestfailed', r => { const f = (r.failure() || {}).errorText || ''; if (!/ERR_ABORTED|ERR_FAILED/.test(f)) fails.push('FAIL ' + f.slice(0, 30) + ' ' + r.url().replace(/\?.*/, '').slice(0, 110)); });
        page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 130)));
        page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 130)); });
        await page.addInitScript(() => {
          window.__gbScroller = function () { var c = [document.scrollingElement, document.documentElement, document.body].concat([].slice.call(document.querySelectorAll('#SITE_CONTAINER,#masterPage,#PAGES_CONTAINER,#site-root,main'))); var best = null, bh = 0; for (var i = 0; i < c.length; i++) { var e = c[i]; if (!e) continue; var cs = getComputedStyle(e); var can = e === document.scrollingElement || /(auto|scroll)/.test(cs.overflowY); var extra = e.scrollHeight - e.clientHeight; if (can && extra > bh) { bh = extra; best = e; } } return best || document.scrollingElement || document.documentElement; };
          window.__gbScroll = function (y) { window.scrollTo(0, y); var s = window.__gbScroller(); if (Math.abs((window.scrollY || 0) - y) > 2 && s) { try { s.scrollTop = y; } catch (e) {} } return window.__gbScrollY(); };
          window.__gbScrollY = function () { var s = window.__gbScroller(); return window.scrollY || (s ? s.scrollTop : 0) || 0; };
          window.__gbDocH = function () { var s = window.__gbScroller(); return Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0, s ? s.scrollHeight : 0); };
        });
        await page.addInitScript(() => { window.__lt = 0; window.__lcp = 0; window.__cls = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true }); new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {} });
        if (process.env.GB_INIT) await page.addInitScript(fs.readFileSync(process.env.GB_INIT, 'utf8'));
        const t0 = Date.now(); const sep = url.includes('?') ? '&' : '?';
        const resp = await page.goto(url + sep + 'gbp=' + Date.now(), { waitUntil: 'load', timeout: 70000 }).catch(e => null);
        const loadMs = Date.now() - t0; const status = resp ? resp.status() : 0; const ttl = await page.title().catch(() => '');
        if (status === 429 || status === 403 || /just a moment|attention required/i.test(ttl)) { cooldown(75000); throw new Error('rate-limited status=' + status); }
        await page.waitForTimeout(WAIT);
        if (process.env.GB_CSS) { await page.addStyleTag({ content: fs.readFileSync(process.env.GB_CSS, 'utf8') }); await page.waitForTimeout(600); }
        await page.screenshot({ path: path.join(outDir, slug + '-top.png') }).catch(() => null);
        const T = phone ? 140 : 200; const m = await page.evaluate(IN_PAGE, T);
        let i = 0; for (const g of m.gaps.slice(0, 5)) { await page.evaluate(y => window.__gbScroll(y), g.scrollTo); await page.waitForTimeout(350); g.shot = slug + '-gap' + (++i) + '.png'; await page.screenshot({ path: path.join(outDir, g.shot) }).catch(() => null);
          try { const cyc = Math.max(0, Math.round((g.y + g.h / 2 - g.scrollTo) * (phone ? 2 : 1) - 40)); const sd = execFileSync('convert', [path.join(outDir, g.shot), '-crop', `x80+0+${cyc}`, '+repage', '-colorspace', 'Gray', '-format', '%[fx:standard_deviation]', 'info:'], { encoding: 'utf8', timeout: 15000 }); g.pixelStdDev = +(+sd).toFixed(4); g.pixelsUniform = +sd < 0.012; } catch (e) { g.pixelStdDev = null; } }
        await page.evaluate(() => window.__gbScroll(window.__gbDocH())); await page.waitForTimeout(700);
        await page.screenshot({ path: path.join(outDir, slug + '-bottom.png') }).catch(() => null);
        if (process.env.GB_SHOTS_Y) { for (const yy of process.env.GB_SHOTS_Y.split(',').map(Number).filter(v => v >= 0)) { await page.evaluate(y => window.__gbScroll(y), yy); await page.waitForTimeout(450); await page.screenshot({ path: path.join(outDir, slug + '-y' + yy + '.png') }).catch(() => null); } }
        if (process.env.GB_FULL) await page.screenshot({ path: path.join(outDir, slug + '-full.png'), fullPage: true }).catch(() => null);
        let cust; if (custom) { try { cust = await page.evaluate('(' + custom + ')()'); } catch (e) { cust = { evalError: String(e).slice(0, 200) }; } }
        const all = Object.values(rq); const bytes = all.reduce((a, r) => a + (r.b || 0), 0); const hosts = {}; const dup = {};
        all.forEach(r => { try { const h = new URL(r.u).hostname.replace(/^www\./, ''); hosts[h] = hosts[h] || { n: 0, kb: 0 }; hosts[h].n++; hosts[h].kb += (r.b || 0) / 1024; } catch (e) {} const k = r.u.replace(/[?#].*$/, ''); if (!/^data:/.test(k)) dup[k] = (dup[k] || 0) + 1; });
        const http4 = all.filter(r => r.s >= 400).map(r => r.s + ' ' + r.u.replace(/\?.*/, '').slice(0, 120));
        out = Object.assign(out, { status, finalUrl: page.url().replace(/[?&]gbp=\d+/, ''), loadMs, requests: all.length, kb: Math.round(bytes / 1024), prefetchAborted, beaconsBlocked: beacons, injectedCss: !!process.env.GB_CSS, injectedInit: !!process.env.GB_INIT,
          hosts: Object.entries(hosts).sort((a, b) => b[1].kb - a[1].kb).slice(0, 10).map(([h, v]) => `${h}:${v.n}req/${Math.round(v.kb)}KB`),
          biggest: all.slice().sort((a, b) => b.b - a.b).slice(0, 10).map(r => `${Math.round(r.b / 1024)}KB ${r.t} ${r.u.replace(/\?.*/, '').slice(-110)}`),
          duplicates: Object.entries(dup).filter(([k, v]) => v > 1 && !/\/(collect|event|bolt-performance|bi|pixel)/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => v + 'x ' + k.slice(-100)),
          failed: Array.from(new Set(http4.concat(fails))).slice(0, 12), errors: Array.from(new Set(errs)).slice(0, 10) }, m);
        if (cust !== undefined) out.custom = cust;
        await ctx.close(); release(slot); break;
      } catch (e) { out.error = String(e && e.message || e).slice(0, 200); try { if (ctx) await ctx.close(); } catch (e2) {} release(slot); if (attempt < 3) await sleep(4000 * attempt); }
    }
    fs.writeFileSync(path.join(outDir, slug + '.json'), JSON.stringify(out, null, 1));
    const brief = { path: out.path, width: out.width, status: out.status, error: out.error, docH: out.docH, kb: out.kb, requests: out.requests, loadMs: out.loadMs, lcp: out.lcp, cls: out.cls, longTaskMs: out.longTaskMs, overflowPx: out.overflowPx, gaps: (out.gaps || []).map(g => ({ y: g.y, h: g.h, atBottom: g.atBottom, uniform: g.pixelsUniform, shot: g.shot, in: (g.chain || [])[0] })), wide: out.wide, lowContrast: out.lowContrast, broken: out.broken, clipped: out.clipped, tiny: (out.tiny || []).length, oversized: (out.oversized || []).length, hiddenFrames: (out.frames || []).filter(f => f.hidden && /^https?:/.test(f.src)).length, overlays: out.overlays, failed: out.failed, errors: out.errors, file: path.join(outDir, slug + '.json'), custom: out.custom };
    console.log(JSON.stringify(brief));
  }
  await browser.close();
})();
