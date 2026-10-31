/* QA harness for the light homepage skin (Oct. 31, 2026). Read-only against production:
 * loads the REAL https://www.gatorbaitmedia.com/?cb=<ts>, intercepts the loader's githack/jsDelivr request for
 * sports-live/broadcast-home-color.js and serves a local file instead. No Wix write, no publish.
 *
 *   node deploy/home-light-redesign-20261031/qa.cjs            -> candidate (serves sports-live/broadcast-home-light.js), writes after-*.png
 *   node deploy/home-light-redesign-20261031/qa.cjs --before   -> no interception (what production serves now), writes before-*.png
 *   node ... --file sports-live/broadcast-home-color.js        -> serve any local file
 *   node ... --widths 390,1366                                  -> subset of widths
 * Exit code 1 if any hard assertion fails. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BEFORE = flag('--before');
const REPO = path.resolve(__dirname, '../..');
const FILE = path.resolve(REPO, opt('--file', 'sports-live/broadcast-home-light.js'));
const WIDTHS = (opt('--widths', '390,430,1366,1920')).split(',').map(Number);
const OUT = __dirname;
const PREFIX = BEFORE ? 'before' : opt('--prefix', 'after');
const LOADER_RE = /^https:\/\/(rawcdn\.githack\.com\/Presidente49\/gatorbait-media-redesign\/[0-9a-f]{40}|cdn\.jsdelivr\.net\/gh\/Presidente49\/gatorbait-media-redesign@[0-9a-f]{40})\/sports-live\/broadcast-home-color\.js(\?.*)?$/;

const results = [];
function check(width, name, ok, detail) {
  results.push({ width, name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(width).padStart(4)}  ${name}${detail ? '  ' + detail : ''}`);
}

/* Runs in the page. Returns text elements below AA against their resolved background. */
function contrastProbe(rootSel) {
  const parse = (s) => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] == null || isNaN(p[3]) ? 1 : p[3] }; };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const bgOf = (el) => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        if (/url\(/.test(cs.backgroundImage) || /gradient/.test(cs.backgroundImage)) {
          // gradients: use the average only when every stop is opaque; otherwise flag complex
          const cols = cs.backgroundImage.match(/rgba?\([^)]+\)/g) || [];
          if (/url\(/.test(cs.backgroundImage) || !cols.length) return { complex: true };
          const parsed = cols.map(parse);
          if (parsed.some((c) => c.a < 1)) return { complex: true };
          // worst case against text colour decided by caller: return all stops
          return { stops: parsed };
        }
      }
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
    if (bodyBg && bodyBg.a > 0) base = over(bodyBg, base);
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return { color: base };
  };
  const out = []; let tested = 0, complex = 0;
  const root = document.querySelector(rootSel); if (!root) return { tested, complex, fails: [{ text: 'root missing' }] };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.nodeValue.trim(); if (!t) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || r.width < 2 || r.height < 2) continue;
    if (el.closest('[inert],[hidden],[aria-hidden="true"]')) continue;
    let clipped = false; for (let e = el; e && e !== root; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden') { clipped = true; break; } }
    if (clipped) continue;
    let fg = parse(cs.color); if (!fg) continue;
    const bg = bgOf(el);
    if (bg.complex) { complex++; continue; }
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    tested++;
    const cols = bg.stops || [bg.color];
    let worst = 99;
    for (const b of cols) { const f = fg.a < 1 ? over(fg, b) : fg; worst = Math.min(worst, ratio(f, b)); }
    if (worst < need) out.push({ text: t.slice(0, 48), cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 40), ratio: +worst.toFixed(2), need, size });
  }
  return { tested, complex, fails: out };
}

async function settle(page, width) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  // Scroll the whole page in steps so lazy images and the lazy Facebook iframe load.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h + 400; y += Math.round(page.viewportSize().height * 0.7)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(350);
  }
  await page.waitForFunction(() => [...document.querySelectorAll('#gbm-live img')].every((i) => i.complete), null, { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

(async () => {
  if (!BEFORE && !fs.existsSync(FILE)) { console.error('missing ' + FILE); process.exit(2); }
  const body = BEFORE ? null : fs.readFileSync(FILE);
  const browser = await chromium.launch();
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: width < 700, hasTouch: width < 700 });
    const page = await ctx.newPage();
    const errors = []; let served = 0; const fb = []; const yt = [];
    page.on('pageerror', (e) => errors.push(String(e.message || e)));
    page.on('requestfailed', (r) => { if (/facebook|ytimg|youtube/.test(r.url())) fb.push('FAILED ' + r.url().slice(0, 100)); });
    page.on('request', (r) => { if (/facebook\.com\/plugins/.test(r.url())) fb.push(r.url()); if (/youtube\.com\/feeds/.test(r.url())) yt.push(r.url()); });
    if (!BEFORE) await page.route((u) => LOADER_RE.test(u.toString()), (route) => { served++; route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', headers: { 'cache-control': 'no-store', 'access-control-allow-origin': '*' }, body }); });
    const t0 = Date.now();
    const resp = await page.goto('https://www.gatorbaitmedia.com/?cb=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
    check(width, 'HTTP 200', resp && resp.status() === 200, String(resp && resp.status()));
    await page.waitForSelector('#gbm-live[data-bc]', { timeout: 30000 }).catch(() => {});
    await settle(page, width);
    if (!BEFORE) check(width, 'candidate file intercepted and served', served >= 1, 'served=' + served);
    check(width, 'no uncaught page errors from the skin', errors.filter((e) => !/Wix|wix|Sentry|fedops/i.test(e)).length === 0, errors.slice(0, 2).join(' | '));

    const m = await page.evaluate(() => {
      const root = document.querySelector('#gbm-live');
      const vw = document.documentElement.clientWidth;
      const imgs = [...document.querySelectorAll('#gbm-live img')].filter((i) => { const r = i.getBoundingClientRect(); const cs = getComputedStyle(i); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 4; });
      const broken = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => (i.closest('[class]').className + ' ' + i.loading + ' ' + i.naturalWidth + ' ' + (i.currentSrc || i.src).slice(-40)));
      const wide = [...root.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return cs.position !== 'fixed' && r.width > 0 && (r.right > vw + 1 || r.left < -1) && !e.closest('.gl-vrow,.bc-tw,.sh-skip,.gl-srow'); }).slice(0, 5).map((e) => e.tagName + '.' + (e.className || '') + ' ' + Math.round(e.getBoundingClientRect().left) + '→' + Math.round(e.getBoundingClientRect().right));
      const band = root.querySelector('.bc-nx'), cd = root.querySelector('.bc-cd');
      const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 4 && r.height > 4 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
      const fbf = root.querySelector('.gl-fb iframe');
      const vids = [...root.querySelectorAll('.gl-vid')];
      const more = [...root.querySelectorAll('.gl-srow a')];
      const fontOK = ['Barlow', 'Barlow Condensed'].map((f) => document.fonts.check('700 16px "' + f + '"'));
      const families = new Set([...root.querySelectorAll('*')].slice(0, 600).map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()));
      const bcs = band ? getComputedStyle(band) : null;
      return {
        scrollW: document.documentElement.scrollWidth, vw, bodyScrollW: document.body.scrollWidth,
        imgCount: imgs.length, broken, wide,
        band: vis(band), bandBg: bcs && bcs.backgroundColor, countdown: vis(cd), cdText: cd ? cd.textContent.replace(/\s+/g, ' ').trim() : '', cdK: cd && cd.getAttribute('data-k'),
        follow: !!root.querySelector('.gl-follow'), followVis: vis(root.querySelector('.gl-follow')),
        fbSrc: fbf ? fbf.getAttribute('src') : '', fbBox: fbf ? Math.round(fbf.getBoundingClientRect().width) + 'x' + Math.round(fbf.getBoundingClientRect().height) : '',
        vidCount: vids.length, vidVisible: vids.filter(vis).length, vidSrc: vids.map((v) => v.getAttribute('href')), vidNote: (root.querySelector('.gl-vsrc') || {}).textContent || '',
        moreCount: more.length, moreVisible: more.filter(vis).length,
        fontOK, families: [...families],
        bodyBg: getComputedStyle(document.body).backgroundColor, rootClass: root.className,
        order: [...root.querySelectorAll('main > section, main > div')].filter(vis).map((e) => e.className.split(' ')[0]),
        ldjson: !!document.querySelector('script[type="application/ld+json"]'),
      };
    });
    check(width, 'no horizontal overflow', m.scrollW <= m.vw + 1 && m.bodyScrollW <= m.vw + 1 && m.wide.length === 0, `scrollW=${m.scrollW} vw=${m.vw} ${m.wide.join('; ')}`);
    check(width, 'no broken images', m.broken.length === 0, `${m.imgCount} imgs ${m.broken.join(', ')}`);
    check(width, 'game-day band present and visible', m.band, m.bandBg);
    check(width, 'countdown present (kickoff still ahead)', m.countdown || !m.cdK, m.cdText || 'none (kickoff passed)');
    check(width, 'Barlow loaded', m.fontOK[0] && m.fontOK[1], m.families.slice(0, 6).join(' / '));
    if (!BEFORE) {
      check(width, 'light surface (body bg)', /rgb\(2[34]\d, 2[34]\d, 2[45]\d\)/.test(m.bodyBg), m.bodyBg);
      check(width, 'Follow GatorBait module present', m.followVis, m.order.join(' > '));
      check(width, 'Facebook Page Plugin iframe present', /facebook\.com\/plugins\/page\.php\?href=/.test(m.fbSrc), m.fbBox + ' ' + decodeURIComponent(m.fbSrc).slice(0, 110));
      check(width, 'YouTube strip: 3 videos with thumbnails and links', m.vidCount === 3 && m.vidVisible === 3 && m.vidSrc.every((h) => /youtube\.com\/watch\?v=/.test(h || '')), m.vidSrc.join(' ') + ' | ' + m.vidNote);
      check(width, 'More stories row present', m.moreVisible >= 3, String(m.moreVisible));
      const cp = await page.evaluate(contrastProbe, '#gbm-live');
      check(width, 'text contrast AA (' + cp.tested + ' tested, ' + cp.complex + ' on photo/gradient skipped)', cp.fails.length === 0, cp.fails.slice(0, 8).map((f) => `"${f.text}" ${f.ratio}<${f.need} .${f.cls}`).join(' || '));
    }
    console.log('       failed: '+fb.filter((x)=>x.startsWith('FAILED')).join(' ; '));console.log('       network: facebook plugin requests=' + fb.filter((x) => !x.startsWith('FAILED')).length + ', failed media=' + fb.filter((x) => x.startsWith('FAILED')).length + ', youtube feed requests=' + yt.length);

    // Screenshots: hide only the Wix cookie banner (known overlap noise) for capture; assertions above ran with it present.
    await page.addStyleTag({ content: '[class*="consent-banner"]{display:none!important}' });
    await page.evaluate(() => { [...document.querySelectorAll('body *')].forEach((e) => { if (getComputedStyle(e).position === 'fixed' && /10% OFF|GAMEDAY10/i.test(e.textContent) && e.textContent.length < 300) e.style.display = 'none'; }); });
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${PREFIX}-${width}-fold.png`), fullPage: false });
    await page.screenshot({ path: path.join(OUT, `${PREFIX}-${width}-full.png`), fullPage: true });
    if (width < 700) { const H = await page.evaluate(() => document.documentElement.scrollHeight); for (let i = 0; i * 1100 < H && i < 6; i++) await page.screenshot({ path: path.join(OUT, `${PREFIX}-${width}-s${i + 1}.png`), fullPage: true, clip: { x: 0, y: i * 1100, width, height: Math.min(1100, H - i * 1100) } }); }
    console.log(`       load+settle ${((Date.now() - t0) / 1000).toFixed(1)}s, page height ${await page.evaluate(() => document.documentElement.scrollHeight)}px`);
    await ctx.close();
  }
  await browser.close();
  const failed = results.filter((r) => !r.ok);
  fs.writeFileSync(path.join(OUT, `${PREFIX}-results.json`), JSON.stringify({ ranAt: new Date().toISOString(), file: BEFORE ? '(production, no interception)' : path.relative(REPO, FILE), results }, null, 1));
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length && !BEFORE ? 1 : 0);
})();
