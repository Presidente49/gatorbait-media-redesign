// Read-only typography audit of production. Run through live-shots.mjs with path "/__type-audit":
//   node automation/vision/type-audit.mjs   (TA_PAGES="/,/magazine" TA_WIDTHS="390,430,1365" to narrow)
// Output: build/live-shots/type-audit.json plus one top and one body shot per page and width.
// For every page it records the loaded font faces, a census of visible text styles (family, weight,
// size, line height, tracking, case) with a sample, the first post paragraphs and the drop cap
// (including ::first-letter), buttons, fixed elements (cookie banner, ticker) and clipped text.
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = 'build/live-shots';
mkdirSync(OUT, { recursive: true });
import { readFileSync, existsSync } from 'node:fs';
// Optional automation/vision/type-audit.config.json: {pages:[...], widths:"390,1365", css:"assets/sitewide-type.css", suffix:"after", cascade:true}
// "css" is injected into the live page (the page's own sitewide-type link is removed first) so a proposed
// stylesheet can be measured and photographed without any production write.
const CFG = existsSync('automation/vision/type-audit.config.json') ? JSON.parse(readFileSync('automation/vision/type-audit.config.json', 'utf8')) : {};
const VARIANTS = (CFG.variants || [{ suffix: '', css: CFG.css || '' }]).map((v) => ({ suffix: v.suffix ? '-' + v.suffix : '', css: v.css ? readFileSync(v.css, 'utf8') : '' }));
let CSS = '', SUFFIX = '';
const PAGES = (CFG.pages ? CFG.pages.join(',') : process.env.TA_PAGES || [
  '/', '/magazine', '/gatorbait-media-blogs',
  '/post/the-college-football-crisis-corn-dogs-vs-commissioners-and-why-it-s-a-big-deal',
  '/post/thoughts-of-the-day-october-7-2026',
  '/post/thoughts-of-the-day-october-6-2026',
  '/post/the-looming-brilliance-of-buster-faulkner-if-it-works-one-time-we-retire-it',
  '/post/homecoming-test-no-16-florida-hosts-south-carolina-saturday-at-12-45-p-m',
  '/post/reeling-gamecocks-rattled-gators-homecoming-comes-with-a-fix-list',
  '/post/florida-ole-miss-final-baugh-gators-run-over-rebels',
].join(',')).split(',');
const WIDTHS = (CFG.widths || process.env.TA_WIDTHS || '390,430,1365').split(',').map(Number);
const IOS_UA = devices['iPhone 13'].userAgent, DESKTOP_UA = devices['Desktop Chrome'].userAgent;
const profile = (w) => w < 800
  ? { userAgent: IOS_UA, viewport: { width: w, height: w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: DESKTOP_UA, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };

const probe = () => {
  const px = (v) => Math.round(parseFloat(v) * 100) / 100;
  const vis = (el) => { const r = el.getBoundingClientRect(), c = getComputedStyle(el); return r.width > 1 && r.height > 1 && c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0; };
  const sty = (el, pseudo) => { const c = getComputedStyle(el, pseudo); return { family: c.fontFamily.split(',')[0].replace(/["']/g, '').trim(), stack: c.fontFamily.slice(0, 80), weight: c.fontWeight, size: px(c.fontSize), lh: c.lineHeight === 'normal' ? 'normal' : px(c.lineHeight), ls: c.letterSpacing === 'normal' ? 0 : px(c.letterSpacing), tt: c.textTransform, color: c.color }; };
  const key = (s) => [s.family, s.weight, s.size, s.lh, s.ls, s.tt].join('|');
  const hint = (el) => { const id = el.id ? '#' + el.id : '', hook = el.getAttribute('data-hook') ? '[data-hook=' + el.getAttribute('data-hook') + ']' : '', cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''; return el.tagName.toLowerCase() + id + hook + cls; };
  const out = { fonts: [], census: [], bad: [], post: null, buttons: [], fixed: [], clipped: [], nav: [], docScrollWidth: document.documentElement.scrollWidth, innerWidth };
  try { document.fonts.forEach((f) => out.fonts.push({ family: f.family.replace(/["']/g, ''), weight: f.weight, style: f.style, status: f.status })); } catch (_) {}
  // census of visible text-bearing leaf-ish elements
  const map = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; const seen = new Set();
  while ((n = walker.nextNode())) {
    const t = (n.nodeValue || '').trim(); if (t.length < 2) continue;
    const el = n.parentElement; if (!el || seen.has(el) || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName) || !vis(el)) continue;
    seen.add(el);
    const s = sty(el), k = key(s), cur = map.get(k);
    if (cur) { cur.n++; if (cur.samples.length < 3) cur.samples.push({ t: t.slice(0, 48), h: hint(el) }); }
    else map.set(k, { ...s, n: 1, samples: [{ t: t.slice(0, 48), h: hint(el) }] });
    if (!/barlow/i.test(s.family) && !/^(inherit|initial)$/.test(s.family)) out.bad.push({ family: s.stack, t: t.slice(0, 40), h: hint(el), size: s.size });
  }
  out.census = [...map.values()].sort((a, b) => b.n - a.n).slice(0, 60);
  out.bad = out.bad.slice(0, 30);
  // post body
  const desc = document.querySelector('[data-hook=post-description]');
  if (desc) {
    const ps = [...desc.querySelectorAll('p')].filter((p) => vis(p) && (p.textContent || '').trim().length > 60);
    const pm = new Map();
    ps.forEach((p) => { const s = sty(p), k = key(s); const c = pm.get(k) || { ...s, n: 0, sample: (p.textContent || '').trim().slice(0, 50) }; c.n++; pm.set(k, c); });
    const dc = desc.querySelector('p.gbm-dropcap');
    const first = ps[0];
    const lineLen = first ? (() => { const r = first.getBoundingClientRect(); const s = sty(first); return { widthPx: Math.round(r.width), charsPerLine: Math.round(r.width / (s.size * 0.46)) }; })() : null;
    out.post = {
      bodyStyles: [...pm.values()], paragraphs: ps.length, firstParaText: first ? first.textContent.trim().slice(0, 70) : null, lineLen,
      weekRich: document.documentElement.hasAttribute('data-gbm-week-rich'),
      dropcap: dc ? { el: sty(dc), first: sty(dc, '::first-letter'), floatDir: getComputedStyle(dc, '::first-letter').cssFloat, text: dc.textContent.trim().slice(0, 40) } : null,
      title: (() => { const t = document.querySelector('[data-hook=post-title]'); return t ? { ...sty(t), text: t.textContent.trim().slice(0, 70) } : null; })(),
      kicker: (() => { const h = document.querySelector('[data-hook=post] > div > header'); if (!h) return null; const s = sty(h, '::before'); return { ...s, content: getComputedStyle(h, '::before').content }; })(),
      byline: (() => { const u = document.querySelector('[data-hook=user-name]'); return u ? sty(u) : null; })(),
      date: (() => { const u = document.querySelector('[data-hook=time-ago],[data-hook=post-publish-date]'); return u ? { ...sty(u), text: u.textContent.trim() } : null; })(),
      h2: (() => { const h = desc.querySelector('h2'); return h && vis(h) ? { ...sty(h), text: h.textContent.trim().slice(0, 40) } : null; })(),
      h3: (() => { const h = desc.querySelector('h3'); return h && vis(h) ? { ...sty(h), text: h.textContent.trim().slice(0, 40) } : null; })(),
      quote: (() => { const h = desc.querySelector('blockquote'); return h && vis(h) ? { ...sty(h), text: h.textContent.trim().slice(0, 40) } : null; })(),
      caption: (() => { const h = document.querySelector('figcaption'); return h && vis(h) ? { ...sty(h), text: h.textContent.trim().slice(0, 40) } : null; })(),
    };
  }
  // buttons
  out.buttons = [...document.querySelectorAll('button, [role=button], a[class*=btn], .gbc-b, input[type=submit]')].filter(vis).slice(0, 14).map((b) => ({ ...sty(b), text: (b.textContent || b.value || '').trim().slice(0, 30), h: hint(b), w: Math.round(b.getBoundingClientRect().width), hgt: Math.round(b.getBoundingClientRect().height) }));
  // fixed or sticky overlays: cookie banner, ticker, headers
  const all = [...document.querySelectorAll('body *')];
  for (const el of all) {
    const c = getComputedStyle(el); if (c.position !== 'fixed' && c.position !== 'sticky') continue; if (!vis(el)) continue;
    const r = el.getBoundingClientRect(); if (r.width < 120 || r.height < 18) continue;
    out.fixed.push({ h: hint(el), pos: c.position, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), hgt: Math.round(r.height), pctOfViewport: Math.round((r.width * r.height) / (innerWidth * innerHeight) * 100), text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90), ...sty(el) });
  }
  out.fixed = out.fixed.slice(0, 14);
  // clipped text: overflow hidden/clip with scrollWidth > clientWidth, or text running past the viewport
  for (const el of all) {
    if (!vis(el)) continue; const c = getComputedStyle(el);
    const t = (el.childElementCount === 0 ? el.textContent : '').trim(); if (!t) continue;
    const r = el.getBoundingClientRect();
    const hiddenX = /hidden|clip/.test(c.overflowX) && el.scrollWidth > el.clientWidth + 2;
    const ellip = c.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 2;
    const past = r.right > innerWidth + 2 && c.position !== 'fixed';
    if (hiddenX || ellip || past) out.clipped.push({ h: hint(el), t: t.slice(0, 50), sw: el.scrollWidth, cw: el.clientWidth, right: Math.round(r.right), ellip, past, size: px(c.fontSize), family: c.fontFamily.split(',')[0] });
  }
  out.clipped = out.clipped.slice(0, 30);
  // header nav items
  document.querySelectorAll('#SITE_HEADER nav a, #SITE_HEADER [role=menuitem], #gbm-mobile-shell a, #gbm-nav a, header a').forEach((a) => {
    if (!vis(a)) return; const r = a.getBoundingClientRect(); const t = (a.textContent || '').trim(); if (!t || t.length > 30) return;
    if (out.nav.length < 24) out.nav.push({ t, x: Math.round(r.left), right: Math.round(r.right), y: Math.round(r.top), w: Math.round(r.width), cw: a.clientWidth, sw: a.scrollWidth, ...sty(a) });
  });
  return out;
};

// Which stylesheet rules set a font family on the lede paragraph's text, and where non-Barlow text sits.
const cascade = () => {
  const out = { lede: null, foreign: [] };
  const p = document.querySelector('[data-hook=post-description] p.gbm-dropcap') || document.querySelector('[data-hook=post-description] p');
  const chain = (el) => { const a = []; for (let e = el; e && e !== document.body && a.length < 7; e = e.parentElement) a.push(e.tagName.toLowerCase() + (e.getAttribute('data-hook') ? '[' + e.getAttribute('data-hook') + ']' : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/)[0] : '')); return a.join(' < '); };
  const rules = (el) => { const hits = []; for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch (_) { continue; } const owner = sh.ownerNode && (sh.ownerNode.id || sh.ownerNode.getAttribute && sh.ownerNode.getAttribute('href') || sh.ownerNode.tagName) || 'sheet'; const walk = (list) => { for (const r of list) { if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; } if (!r.selectorText || !r.style) continue; let m = false; try { m = el.matches(r.selectorText); } catch (_) {} if (m && /Condensed|font-family|^font$/i.test(r.cssText.slice(0, 600)) && (r.style.fontFamily || /font:/.test(r.cssText))) hits.push({ owner: String(owner).slice(-60), sel: r.selectorText.slice(0, 160), ff: r.style.fontFamily.slice(0, 60), prio: r.style.getPropertyPriority('font-family') || r.style.getPropertyPriority('font') }); } }; walk(rs); } return hits.slice(0, 12); };
  if (p) { const sp = p.querySelector('span') || p; out.lede = { pHtml: p.outerHTML.slice(0, 420), pInline: p.getAttribute('style'), spanInline: sp.getAttribute('style'), spanClass: sp.className, spanFamily: getComputedStyle(sp).fontFamily.slice(0, 50), rules: rules(sp) }; }
  const seen = new Set();
  document.querySelectorAll('body *').forEach((el) => { if (el.childElementCount) return; const t = (el.textContent || '').trim(); if (t.length < 2) return; const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (/barlow|bebas/i.test(f) && !/bebas/i.test(f)) return; const k = f; if (seen.has(k) && out.foreign.filter((x) => x.family === f).length >= 2) return; seen.add(k); out.foreign.push({ family: f, t: t.slice(0, 30), chain: chain(el) }); });
  out.foreign = out.foreign.slice(0, 14);
  return out;
};
const browser = await chromium.launch();
const res = { at: new Date().toISOString(), pages: [] };
for (const V of VARIANTS) {
CSS = V.css; SUFFIX = V.suffix;
for (const path of PAGES) {
  for (const w of WIDTHS) {
    const slug = (path === '/' ? 'home' : path.replace(/^\/(post\/)?/, '').replace(/[^\w]+/g, '-').slice(0, 40)) + '-' + w + SUFFIX;
    const ctx = await browser.newContext(profile(w));
    const page = await ctx.newPage();
    const m = { path, w, slug, variant: SUFFIX || '-before' };
    try {
      const r = await page.goto('https://www.gatorbaitmedia.com' + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
      m.status = r && r.status();
      await page.waitForTimeout(6500);
      if (CSS) {
        await page.evaluate(() => document.querySelectorAll('link[href*="sitewide-type"]').forEach((l) => l.remove()));
        await page.addStyleTag({ content: CSS });
        await page.waitForTimeout(1500);
      }
      await page.evaluate(() => document.fonts.ready).catch(() => {});
      await page.screenshot({ path: `${OUT}/${slug}-top.jpg`, type: 'jpeg', quality: 60 });
      // scroll through so lazy sections draw, then back to the body start
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight && y < 9000; y += 700) { scrollTo(0, y); await new Promise((f) => setTimeout(f, 120)); } });
      const hasBody = await page.$('[data-hook=post-description] p');
      if (hasBody) { await page.evaluate(() => { const p = document.querySelector('[data-hook=post-description] p'); p.scrollIntoView({ block: 'start' }); scrollBy(0, -90); }); }
      else await page.evaluate(() => scrollTo(0, 900));
      await page.waitForTimeout(1200);
      m.probe = await page.evaluate(probe);
      m.cascade = await page.evaluate(cascade);
      await page.screenshot({ path: `${OUT}/${slug}-body.jpg`, type: 'jpeg', quality: 60 });
      if (hasBody) {
        const dc = await page.$('p.gbm-dropcap');
        if (dc) await dc.screenshot({ path: `${OUT}/${slug}-dropcap.jpg`, type: 'jpeg', quality: 70 }).catch(() => {});
      }
    } catch (e) { m.error = String(e).slice(0, 300); }
    res.pages.push(m);
    await ctx.close();
  }
}
}
await browser.close();
writeFileSync(`${OUT}/type-audit.json`, JSON.stringify(res, null, 1));
console.log('type-audit pages:', res.pages.length, 'errors:', res.pages.filter((p) => p.error).length);
