/* QA harness for the sitewide light skin (Oct. 31, 2026). Read-only against production:
 * loads the REAL https://www.gatorbaitmedia.com/<path>?cb=<ts>, injects deploy/sitewide-light-20261031/loader.html into <head>
 * (what the new ESSENTIAL HEAD embed would do), and intercepts the loader's githack request for sports-live/site-light.js to serve the local file.
 * No Wix write, no publish, no email, no automation.
 *
 *   node deploy/sitewide-light-20261031/qa.cjs                 -> candidate (after-*.png, after-results.json)
 *   node deploy/sitewide-light-20261031/qa.cjs --before        -> production as it is (before-*.png, before-results.json)
 *   --widths 390,1366   --only plans,latest   --no-shots   --file sports-live/site-light.js   --conc 3
 * Exit code 1 if any hard assertion fails. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BEFORE = flag('--before');
const REPO = path.resolve(__dirname, '../..');
const FILE = path.resolve(REPO, opt('--file', 'sports-live/site-light.js'));
const WIDTHS = opt('--widths', '390,430,1366,1920').split(',').map(Number);
const ONLY = opt('--only', '') ? opt('--only').split(',') : null;
const CONC = +opt('--conc', 3);
const OUT = __dirname;
const PREFIX = BEFORE ? 'before' : 'after';
const HOST = 'https://www.gatorbaitmedia.com';
const SHOTS = !flag('--no-shots');
const LOADER = fs.existsSync(path.join(__dirname, 'loader.html')) ? fs.readFileSync(path.join(__dirname, 'loader.html'), 'utf8') : '';
const LOADER_RE = /^https:\/\/rawcdn\.githack\.com\/Presidente49\/gatorbait-media-redesign\/[0-9a-f]{40}\/sports-live\/site-light\.js/;

/* Page inventory (chosen from sitemap.xml and its sub-sitemaps, Oct. 31, 2026). */
const PAGES = [
  { id: 'plans', path: '/pricing-plans', type: 'pricing plans (native Wix widget)' },
  { id: 'plans-sub', path: '/pricing-plans/subscribe', type: 'pricing plans (sitemap URL)' },
  { id: 'post-loren', path: '/post/loren-meadows-scouting-report-on-florida-utah-matchup-where-do-the-gators-have-an-edge-if-any', type: 'article, Loren Meadows pregame' },
  { id: 'post-pregame', path: '/post/pregame-analysis-florida-gators-5-2-3-2-vs-georgia-bulldogs-6-1-4-1', type: 'article, current pregame' },
  { id: 'post-recap', path: '/post/south-carolina-beats-no-16-florida-38-19-spoiling-homecoming-in-the-swamp', type: 'article, game recap' },
  { id: 'post-gated', path: '/post/members-read-the-texas-pregame-magazine', type: 'article, members gate' },
  { id: 'latest', path: '/gatorbait-media-blogs', type: 'Latest feed page' },
  { id: 'category', path: '/gatorbait-media-blogs/categories/gator-football', type: 'blog category page' },
  { id: 'about', path: '/about', type: 'About' },
  { id: 'contact', path: '/contact', type: 'Contact (form)' },
  { id: 'tv', path: '/the-buddy-martin-show', type: 'TV / show page' },
  { id: 'policies', path: '/policies', type: 'Policies (legal text)' },
  { id: 'tags', path: '/tags', type: 'Topics index' },
  { id: 'account', path: '/account/my-account', type: 'account / sign-in (no login)' },
  { id: 'members', path: '/members', type: 'members directory' },
  { id: 'groups', path: '/groups', type: 'community groups list' },
  { id: 'group-thread', path: '/group/gator-football-talk/discussion', type: 'group discussion' },
  { id: 'product', path: '/product-page/gb-tailgate-mug-with-a-handle', type: 'store product page (on-site)' },
  { id: 'shop', path: '/category/all-products', type: 'store category (on-site)' },
  { id: 'checkout', path: '/checkout', type: 'checkout' },
  { id: 'thanks', path: '/thank-you-page', type: 'thank-you page' },
  { id: 'notfound', path: '/this-page-does-not-exist-404-check', type: '404', status: 404 },
  /* must stay untouched */
  { id: 'home', path: '/', type: 'homepage (must be untouched)', untouched: true },
  { id: 'magazine', path: '/magazine', type: 'magazine (must be untouched)', untouched: true },
];

/* ---------- in-page probes (serialised into the page) ---------- */
function probes() {
  const parse = (s) => { const m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] == null || isNaN(p[3]) ? 1 : p[3] }; };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const short = (e) => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).slice(0, 2).join('.'); if (c) s += '.' + c; return s; };
  const visible = (e) => {
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
    for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; if (cs.clipPath === 'inset(100%)' || (cs.position === 'absolute' && cs.clip && /rect\(0(px)?,? ?0(px)?,? ?0(px)?,? ?0(px)?\)/.test(cs.clip))) return false; }
    return true;
  };
  /* effective background: composite ancestors; images/complex gradients reported as complex; gradients with all-opaque stops return stops */
  const bgOf = (el) => {
    const stack = [];
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      const bi = cs.backgroundImage;
      if (bi && bi !== 'none') {
        if (/url\(/.test(bi)) return { complex: 'image', by: short(e) };
        const cols = bi.match(/rgba?\([^)]+\)/g) || [];
        if (cols.length) { const ps = cols.map(parse); if (ps.every((c) => c.a >= 0.99)) { return { stops: ps, by: short(e) }; } if (ps.some((c) => c.a > 0.2) ) { /* translucent gradient: composite each stop over what is below */ const below = bgOf(e.parentElement || document.documentElement); if (below.color) return { stops: ps.map((c) => over(c, below.color)), by: short(e) }; return { complex: 'gradient', by: short(e) }; } }
      }
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a >= 0.99) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    const rootBg = parse(getComputedStyle(document.documentElement).backgroundColor); if (rootBg && rootBg.a > 0) base = over(rootBg, base);
    const bodyBg = parse(getComputedStyle(document.body).backgroundColor); if (bodyBg && bodyBg.a > 0 && stack.length === 0) base = over(bodyBg, base);
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return { color: base };
  };
  const opacityOf = (e) => { let o = 1; for (let x = e; x && x.nodeType === 1; x = x.parentElement) o *= +getComputedStyle(x).opacity; return o; };
  function contrast() {
    const fails = [], skipped = []; let tested = 0;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!/\S/.test(n.nodeValue)) continue;
      const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|OPTION)$/.test(el.tagName)) continue;
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect(); if (r.right < 0 || r.bottom + scrollY < 0) continue;
      const cs = getComputedStyle(el);
      if (/transparent/.test(cs.webkitTextFillColor) || (cs.webkitBackgroundClip === 'text' && cs.backgroundImage !== 'none')) { skipped.push({ el: short(el), why: 'clip-text' }); continue; }
      let fg = parse(cs.webkitTextFillColor && cs.webkitTextFillColor !== 'rgba(0, 0, 0, 0)' ? cs.webkitTextFillColor : cs.color); if (!fg) continue;
      fg = { ...fg, a: fg.a * opacityOf(el) };
      const bg = bgOf(el);
      if (bg.complex) { skipped.push({ el: short(el), why: bg.complex + ' via ' + bg.by, text: n.nodeValue.trim().slice(0, 30) }); continue; }
      const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
      const bgs = bg.stops || [bg.color];
      let worst = 99;
      for (const b of bgs) { const f = fg.a < 1 ? over(fg, b) : fg; worst = Math.min(worst, ratio(f, b)); }
      tested++;
      if (worst < need - 0.01) fails.push({ el: short(el), text: n.nodeValue.trim().slice(0, 40), ratio: +worst.toFixed(2), need, fg: cs.color, bg: bg.by || 'solid' });
    }
    return { tested, fails, skipped: skipped.length, skippedSample: skipped.slice(0, 6) };
  }
  function darkSurfaces() {
    const out = [];
    for (const e of document.querySelectorAll('body *')) {
      if (e.closest('video,iframe,canvas,svg,picture,[data-gbm-dark-ok]')) continue;
      const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const r = e.getBoundingClientRect(); if (r.width < 160 || r.height < 28) continue;
      const bg = parse(cs.backgroundColor); const bi = cs.backgroundImage;
      let dark = null;
      if (bg && bg.a > 0.6 && lum(bg) < 0.03) dark = cs.backgroundColor;
      else if (/gradient/.test(bi) && !/url\(/.test(bi)) { const cols = (bi.match(/rgba?\([^)]+\)/g) || []).map(parse); if (cols.length && cols.every((c) => c.a > 0.6 && lum(c) < 0.03)) dark = bi.slice(0, 60); }
      if (dark) out.push({ el: short(e), w: Math.round(r.width), h: Math.round(r.height), bg: dark });
    }
    const root = parse(getComputedStyle(document.documentElement).backgroundColor), body = parse(getComputedStyle(document.body).backgroundColor);
    return { list: out.slice(0, 12), count: out.length, htmlBg: getComputedStyle(document.documentElement).backgroundColor, bodyBg: getComputedStyle(document.body).backgroundColor, pageDark: !!((body && body.a > .5 && lum(body) < .03) || (root && root.a > .5 && lum(root) < .03 && !(body && body.a > .5))) };
  }
  function images() {
    const bad = []; let n = 0;
    for (const im of document.images) {
      const r = im.getBoundingClientRect(); if (r.width < 8 || r.height < 8) continue; if (!visible(im)) continue; n++;
      if (im.complete && im.naturalWidth === 0) bad.push((im.currentSrc || im.src).slice(0, 90));
    }
    return { n, bad };
  }
  function forms() {
    const res = [];
    for (const e of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]),textarea,select')) {
      if (!visible(e)) continue; const r = e.getBoundingClientRect(); if (r.width < 40 || r.height < 16) continue;
      const cs = getComputedStyle(e); const bgc = bgOf(e); const bg = bgc.color || (bgc.stops && bgc.stops[0]); const fg = parse(cs.color);
      const bd = parse(cs.borderTopColor); const bdw = parseFloat(cs.borderTopWidth);
      /* page background behind the field */
      const parentBg = bgOf(e.parentElement || document.body); const pbg = parentBg.color || (parentBg.stops && parentBg.stops[0]);
      const own = bg && fg ? ratio(fg, over(bg, { r: 255, g: 255, b: 255, a: 1 })) : 0;
      const edge = bd && bdw >= 1 && pbg ? ratio(over(bd, pbg), pbg) : 0;
      const fill = bg && pbg ? ratio(bg, pbg) : 1;
      res.push({ el: short(e), type: e.type || e.tagName, textRatio: +own.toFixed(2), edgeRatio: +edge.toFixed(2), fillRatio: +fill.toFixed(2), ok: own >= 4.5 && (edge >= 1.6 || fill >= 1.12) });
    }
    return res;
  }
  function overflow() { const de = document.documentElement; return { sw: Math.max(de.scrollWidth, document.body.scrollWidth), cw: de.clientWidth }; }
  return { contrast, darkSurfaces, images, forms, overflow, bgOf, parse, lum, ratio, visible, short };
}

const probeSrc = `(${probes.toString()})()`;

const results = [];
const log = (m) => console.log(m);

async function runOne(browser, page, width) {
  const mobile = width < 500;
  const ctx = await browser.newContext({
    viewport: { width, height: mobile ? 844 : 900 }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile,
    userAgent: mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' : undefined,
  });
  const p = await ctx.newPage();
  const errors = []; let served = 0;
  p.on('pageerror', (e) => errors.push(String(e.message || e).slice(0, 160)));
  if (!BEFORE) {
    await p.route(LOADER_RE, async (route) => { served++; await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(FILE) }); });
    await p.route((u) => u.origin === HOST && !/\.(js|css|png|jpe?g|webp|svg|gif|woff2?|json|ico|mp4)(\?|$)/.test(u.pathname), async (route) => {
      const req = route.request();
      if (req.resourceType() !== 'document' || req.frame() !== p.mainFrame()) return route.continue();
      try {
        const resp = await route.fetch(); let body = await resp.text();
        if (/<head[^>]*>/i.test(body)) body = body.replace(/<head[^>]*>/i, (m) => m + LOADER);
        await route.fulfill({ response: resp, body });
      } catch (e) { await route.continue().catch(() => {}); }
    });
  }
  const url = HOST + page.path + (page.path.includes('?') ? '&' : '?') + 'cb=' + Date.now();
  let status = 0;
  try { const r = await p.goto(url, { waitUntil: 'load', timeout: 60000 }); status = r ? r.status() : 0; } catch (e) { errors.push('goto: ' + String(e.message).slice(0, 100)); }
  await p.waitForTimeout(4500);
  /* trigger lazy images and late embeds: scroll down then back up */
  try {
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(h, 9000); y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(120); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(900);
  } catch (e) { /* ignore */ }
  const checks = [];
  const add = (name, ok, detail, soft) => checks.push({ name, ok: !!ok, detail: detail || '', soft: !!soft });
  const base = `${PREFIX}-${page.id}-${width}`;
  const info = await p.evaluate(`(function(){var P=${probeSrc};var de=document.documentElement;
    return {cls:de.className,hasSL:de.classList.contains('gb-sl'),slStyle:!!document.getElementById('gbm-sl-css'),
      overflow:P.overflow(),images:P.images(),dark:P.darkSurfaces(),contrast:P.contrast(),forms:P.forms(),
      renew:(function(){var c=document.getElementById('gbm-renew-card');if(!c)return null;var r=c.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),bg:getComputedStyle(c).backgroundColor,vis:P.visible(c)}})(),
      gd:(function(){var c=document.getElementById('gbm-gd10-bar');if(!c)return null;var r=c.getBoundingClientRect();var cs=getComputedStyle(c);return {w:Math.round(r.width),h:Math.round(r.height),left:Math.round(r.left),right:Math.round(r.right),bg:cs.backgroundColor,vis:P.visible(c),textColor:cs.color}})(),
      title:document.title,font:getComputedStyle(document.body).fontFamily.slice(0,40),
      barlow:document.fonts?[...document.fonts].some(function(f){return /Barlow/.test(f.family)&&f.status==='loaded'}):null}})()`);
  const expect = page.status || 200;
  add('HTTP ' + expect, status === expect || (expect === 200 && status >= 200 && status < 300), 'got ' + status);
  if (page.untouched) {
    add('skin inactive (no gb-sl class, no #gbm-sl-css)', !info.hasSL && !info.slStyle, `class=${info.hasSL} style=${info.slStyle}`);
  } else {
    if (!BEFORE) add('skin active', info.hasSL && info.slStyle, `class=${info.hasSL} style=${info.slStyle} servedLocal=${served > 0}`);
    add('page background is light', !info.dark.pageDark, `html ${info.dark.htmlBg} body ${info.dark.bodyBg}`);
    add('no near-black surfaces', info.dark.count === 0, info.dark.count ? JSON.stringify(info.dark.list.slice(0, 4)) : '');
    add('AA contrast (text vs effective bg)', info.contrast.fails.length === 0, `${info.contrast.tested} tested, ${info.contrast.skipped} skipped over images; ` + (info.contrast.fails.length ? 'FAILS ' + JSON.stringify(info.contrast.fails.slice(0, 6)) : 'none failing'));
    add('no broken images', info.images.bad.length === 0, `${info.images.n} visible; ` + info.images.bad.slice(0, 3).join(' | '));
    const bad = info.forms.filter((f) => !f.ok);
    add('form fields visible and readable', bad.length === 0, `${info.forms.length} fields; ` + (bad.length ? JSON.stringify(bad.slice(0, 4)) : ''));
  }
  add('no horizontal overflow', info.overflow.sw <= info.overflow.cw + 1, `scrollWidth ${info.overflow.sw} vs ${info.overflow.cw}`);
  if (info.gd) {
    add('#gbm-gd10-bar renders inside viewport', info.gd.vis && info.gd.left >= -1 && info.gd.right <= width + 1, JSON.stringify(info.gd));
  } else add('#gbm-gd10-bar', true, 'not present on this page (n/a)', true);
  if (info.renew) add('#gbm-renew-card renders', info.renew.vis && info.renew.w > 100 && /255, 255, 255/.test(info.renew.bg), JSON.stringify(info.renew));
  else add('#gbm-renew-card', true, 'not present for a signed-out visitor (n/a)', true);
  if (errors.length) add('no skin page errors', !errors.some((e) => /site-light|gbm-sl/.test(e)), errors.slice(0, 2).join(' | '), true);

  /* phone menu drawer */
  let drawer = null;
  if (width <= 820 && !page.untouched) {
    try {
      const t = await p.$('#gbm-mobile-menu-toggle');
      if (t) {
        await t.scrollIntoViewIfNeeded().catch(() => {});
        await t.click({ timeout: 4000 }); await p.waitForTimeout(900);
        drawer = await p.evaluate(`(function(){var P=${probeSrc};var d=document.querySelector('#gbm-mobile-drawer-root .gbm-ms-panel')||document.querySelector('#gbm-mobile-drawer-root');
          if(!d)return null;var r=d.getBoundingClientRect();var links=[...d.querySelectorAll('a,button')].filter(P.visible);
          var bad=[];var tested=0;links.forEach(function(a){var cs=getComputedStyle(a);var fg=P.parse(cs.webkitTextFillColor&&cs.webkitTextFillColor!=='rgba(0, 0, 0, 0)'?cs.webkitTextFillColor:cs.color);var b=P.bgOf(a);var bg=b.color||(b.stops&&b.stops[0]);if(!fg||!bg)return;tested++;var rr=P.ratio(fg,bg);if(rr<4.5)bad.push({t:a.textContent.trim().slice(0,24),r:+rr.toFixed(2)})});
          var b=P.bgOf(d);var bg=b.color||(b.stops&&b.stops[0]);return {x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),bg:bg?'rgb('+Math.round(bg.r)+','+Math.round(bg.g)+','+Math.round(bg.b)+')':'?',lum:bg?P.lum(bg):null,links:links.length,tested:tested,bad:bad,open:document.documentElement.classList.contains('gbm-mobile-menu-open')}})()`);
        if (SHOTS && ['plans', 'post-pregame', 'latest', 'account'].includes(page.id)) await p.screenshot({ path: path.join(OUT, `${base}-menu.png`) });
        await p.evaluate(() => { const c = document.querySelector('#gbm-mobile-drawer-root .gbm-ms-close'); if (c) c.click(); });
        await p.waitForTimeout(500);
      }
    } catch (e) { drawer = { err: String(e.message).slice(0, 100) }; }
    if (drawer && !drawer.err) add('phone menu drawer opens, light and readable', drawer.open && drawer.w > 200 && drawer.lum > 0.6 && drawer.links >= 6 && drawer.bad.length === 0, JSON.stringify(drawer));
    else add('phone menu drawer opens, light and readable', false, drawer ? JSON.stringify(drawer) : 'toggle #gbm-mobile-menu-toggle not found');
  }
  if (SHOTS) {
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    const full = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.screenshot({ path: path.join(OUT, `${base}-fold.png`) });
    await p.screenshot({ path: path.join(OUT, `${base}-full.png`), fullPage: true, clip: { x: 0, y: 0, width: Math.min(width, 1920), height: Math.min(full, width < 500 ? 5200 : 3600) } }).catch(() => {});
  }
  await ctx.close();
  return { page: page.id, path: page.path, type: page.type, width, status, checks, summary: { contrastTested: info.contrast.tested, contrastFails: info.contrast.fails, darkSurfaces: info.dark.list, drawer, forms: info.forms }, errors: errors.slice(0, 3) };
}

(async () => {
  const browser = await chromium.launch();
  const jobs = [];
  for (const pg of PAGES) { if (ONLY && !ONLY.includes(pg.id)) continue; for (const w of WIDTHS) jobs.push({ pg, w }); }
  let next = 0;
  async function worker() {
    for (;;) {
      const j = jobs[next++]; if (!j) return;
      let r;
      try { r = await runOne(browser, j.pg, j.w); } catch (e) { r = { page: j.pg.id, path: j.pg.path, type: j.pg.type, width: j.w, status: 0, checks: [{ name: 'harness', ok: false, detail: String(e.message).slice(0, 200) }], summary: {}, errors: [] }; }
      results.push(r);
      const hard = r.checks.filter((c) => !c.ok && !c.soft);
      log(`${hard.length ? 'FAIL' : 'PASS'}  ${j.pg.id.padEnd(13)} ${String(j.w).padStart(4)}  ${r.checks.filter((c) => c.ok).length}/${r.checks.length}` + hard.map((c) => '\n        x ' + c.name + ': ' + c.detail.slice(0, 220)).join(''));
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  await browser.close();
  results.sort((a, b) => PAGES.findIndex((x) => x.id === a.page) - PAGES.findIndex((x) => x.id === b.page) || a.width - b.width);
  fs.writeFileSync(path.join(OUT, `${PREFIX}-results.json`), JSON.stringify({ generated: new Date().toISOString(), mode: BEFORE ? 'before (production as served)' : 'after (loader injected, local site-light.js served)', file: BEFORE ? null : path.relative(REPO, FILE), widths: WIDTHS, results }, null, 1));
  const hardFails = results.flatMap((r) => r.checks.filter((c) => !c.ok && !c.soft));
  const total = results.reduce((n, r) => n + r.checks.length, 0);
  log(`\n${total - hardFails.length - results.flatMap((r) => r.checks.filter((c) => !c.ok && c.soft)).length}/${total} checks passed; ${hardFails.length} hard failures across ${results.length} page-widths`);
  process.exit(BEFORE ? 0 : hardFails.length ? 1 : 0);
})();
