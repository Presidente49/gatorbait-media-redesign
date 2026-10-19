#!/usr/bin/env node
// Latest Feed QA. Loads a real feed route in Chromium at several widths, optionally with the candidate loader + local bundle injected
// (--candidate), and records frames, CLS, overflow, order vs the RSS feed, fonts, h1 and native-DOM presence. Read-only: no Wix write.
// Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node sports-live/qa-latest-feed.mjs [--candidate] [--proxy] [--out dir]
//          [--widths 390,430,1366,1920] [--paths /gatorbait-media-blogs,/gatorbait-media-blogs/categories/franz-beard-blog] [--scenario rss500|bundle404|slow]
//   --proxy  fetch every request through Playwright's request client (needed in the sandbox, whose browser cannot reach the web directly).
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const candidate = process.argv.includes('--candidate'), proxy = process.argv.includes('--proxy');
const out = arg('out', '/tmp/lf-qa'); mkdirSync(out, { recursive: true });
const widths = String(arg('widths', '390,430,1366,1920')).split(',').map(Number);
const paths = String(arg('paths', '/gatorbait-media-blogs')).split(',');
const scenario = arg('scenario', '');
const warm = process.argv.includes('--warm');
const ORIGIN = 'https://www.gatorbaitmedia.com';
const bundle = readFileSync(join(repo, 'sports-live/latest-feed.js'), 'utf8');
const loader = readFileSync(join(repo, 'deploy/latest-feed-20261018/latest-feed-loader-v1.html'), 'utf8');
const label = (p) => (p.replace(/^\/gatorbait-media-blogs\/?/, '').replace(/[^a-z0-9]+/gi, '-') || 'all').replace(/^-|-$/g, '') || 'all';

const initScript = () => {
  window.__cls = { sum: 0, list: [] };
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls.sum += e.value; window.__cls.list.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), n: (e.sources || []).map((s) => { const n = s.node; return n ? (n.id ? '#' + n.id : (n.className && String(n.className).split(' ')[0] ? '.' + String(n.className).split(' ')[0] : n.nodeName)) : '?'; }).slice(0, 3) }); } }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
};

async function run(browser, width, path) {
  const phone = width < 700;
  const ctx = await browser.newContext(phone ? { viewport: { width, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' } : { viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(initScript);
  await ctx.route('**/*', async (route) => {
    const req = route.request(), u = req.url();
    if (candidate && /cdn\.jsdelivr\.net\/gh\/Presidente49\/gatorbait-media-redesign@[0-9a-f]{40}\/sports-live\/latest-feed\.js/.test(u)) {
      if (scenario === 'bundle404') return route.fulfill({ status: 404, body: 'nope' });
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: bundle });
    }
    if (/\/blog-feed\.xml/.test(u) && scenario === 'rss500') return route.fulfill({ status: 500, body: 'err' });
    try {
      const r = (proxy || (candidate && req.resourceType() === 'document')) ? await ctx.request.fetch(req, { timeout: 30000, maxRedirects: 0 }) : await route.fetch();
      if (candidate && req.resourceType() === 'document' && u.startsWith(ORIGIN + '/gatorbait-media-blogs')) {
        let body = await r.text();
        body = body.replace('</head>', loader + '</head>');
        return route.fulfill({ response: r, body });
      }
      return route.fulfill({ response: r });
    } catch (e) { return route.abort(); }
  });
  if (warm) { const pp = await ctx.newPage(); await pp.goto(ORIGIN + path + '?prime=' + Date.now(), { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await pp.waitForTimeout(3500); await pp.close(); }
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e).slice(0, 140)));
  const tag = `${label(path)}-${width}${warm ? '-warm' : ''}`;
  const frames = [];
  const t0 = Date.now();
  const nav = page.goto(ORIGIN + path + '?qa=' + Date.now(), { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  for (const t of [200, 500, 1000, 2000, 4000]) {
    const wait = t - (Date.now() - t0); if (wait > 0) await page.waitForTimeout(wait);
    const f = join(out, `${tag}-f${t}.png`);
    await page.screenshot({ path: f }).catch(() => {}); frames.push({ t, file: f, at: Date.now() - t0 });
  }
  await nav; await page.waitForTimeout(2500);
  const m = await page.evaluate(async () => {
    const q = (s) => document.querySelector(s), vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const lf = q('#gbm-lf');
    const cards = lf ? [...lf.querySelectorAll('a.lf-lead,a.lf-sc,a.lf-card')] : [];
    const times = cards.map((a) => { const t = a.querySelector('time[datetime]'); return t ? Date.parse(t.getAttribute('datetime')) : null; });
    let inversions = 0, prev = Infinity; times.forEach((t) => { if (t == null) return; if (t > prev + 1) inversions++; prev = Math.min(prev, t); });
    const feedRoot = q('[data-hook=feed-page-root]'), gal = q('[data-hook=post-list-pro-gallery-container]') || q('[data-hook=post-list]');
    const fams = new Set(); lf && lf.querySelectorAll('*').forEach((e) => fams.add(getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()));
    const imgs = lf ? [...lf.querySelectorAll('img')] : [];
    const lead = lf && lf.querySelector('.lf-lead'), leadImg = lead && lead.querySelector('img');
    const jl = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => (s.textContent.match(/"@type":\s*"([A-Za-z]+)"/) || [])[1]);
    const lfr = lf ? lf.getBoundingClientRect() : null;
    return {
      mounted: !!lf, htmlClass: document.documentElement.className.split(' ').filter((c) => /^gbm-(lf|lp|feed)/.test(c)).join(' '),
      scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, docH: document.documentElement.scrollHeight,
      lfLeft: lfr && Math.round(lfr.left), lfWidth: lfr && Math.round(lfr.width),
      cls: +(window.__cls.sum).toFixed(4), clsList: window.__cls.list.slice(0, 8),
      cards: cards.length, orderInversions: inversions, firstTitles: cards.slice(0, 4).map((a) => (a.querySelector('h3') || {}).textContent),
      h1Dom: document.querySelectorAll('h1').length, h1Visible: [...document.querySelectorAll('h1')].filter(vis).length, h2Title: (lf && (lf.querySelector('.lf-title') || {}).textContent) || '',
      nativeItems: document.querySelectorAll('[data-hook=post-list-item]').length, nativeGalDisplay: gal ? getComputedStyle(gal).display : null, nativeRootH: feedRoot ? Math.round(feedRoot.getBoundingClientRect().height) : null, nativeInert: feedRoot ? feedRoot.hasAttribute('inert') : null,
      lpVisible: vis(q('#gbm-lp')), snVisible: vis(q('#gbm-sn')),
      fonts: [...fams], barlowLoaded: [...document.fonts].filter((f) => f.status === 'loaded' && /barlow/i.test(f.family)).length,
      imgsTotal: imgs.length, imgsBroken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length, leadImgOk: !!(leadImg && leadImg.complete && leadImg.naturalWidth > 0), leadAlt: leadImg && leadImg.alt,
      chips: lf ? [...lf.querySelectorAll('.lf-chip')].map((c) => c.textContent + '|' + c.getAttribute('href')).slice(0, 12) : [], activeChip: lf ? (lf.querySelector('.lf-chip[aria-current]') || {}).textContent : null,
      loadMore: !!(lf && lf.querySelector('#lf-more')), jsonld: jl, canonical: (q('link[rel=canonical]') || {}).href || null,
      title: document.title,
    };
  });
  await page.screenshot({ path: join(out, `${tag}.png`), fullPage: false });
  await page.screenshot({ path: join(out, `${tag}-full.png`), fullPage: true }).catch(() => {});
  // Load more: click and confirm more stories, strict order kept.
  let more = null;
  if (m.mounted && m.loadMore) {
    const before = m.cards;
    for (let k = 0; k < 5; k++) { const clicked = await page.evaluate(() => { const b = document.querySelector('#lf-more:not([disabled])'); if (b) b.click(); return !!b; }); if (!clicked) break; await page.waitForFunction(() => { const b = document.querySelector('#lf-more'); return !b || !b.disabled; }, null, { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(600); }
    more = await page.evaluate(() => { const lf = document.querySelector('#gbm-lf'), cards = [...lf.querySelectorAll('a.lf-lead,a.lf-sc,a.lf-card')]; const ts = cards.map((a) => { const t = a.querySelector('time[datetime]'); return t ? Date.parse(t.getAttribute('datetime')) : null; }); let inv = 0, prev = Infinity; ts.forEach((t) => { if (t == null) return; if (t > prev + 1) inv++; prev = Math.min(prev, t); }); const urls = cards.map((a) => a.getAttribute('href')); return { cards: cards.length, dupes: urls.length - new Set(urls).size, inversions: inv, foot: (lf.querySelector('#lf-foot') || {}).textContent, older: (lf.querySelector('.lf-older') || {}).href || null, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth }; });
    more.before = before;
  }
  let feedOrder = null;
  if (path === '/gatorbait-media-blogs' && m.mounted) {
    try {
      const x = await (await ctx.request.get(ORIGIN + '/blog-feed.xml?qa=' + Date.now(), { headers: { 'cache-control': 'no-store' } })).text();
      const items = [...x.matchAll(/<item>[\s\S]*?<\/item>/g)].map((i) => ({ u: (i[0].match(/<link>([^<]+)<\/link>/) || [])[1], t: Date.parse((i[0].match(/<pubDate>([^<]+)<\/pubDate>/) || [])[1]) })).sort((a, b) => b.t - a.t).map((i) => i.u);
      const shown = await page.evaluate(() => [...document.querySelectorAll('#gbm-lf a.lf-lead,#gbm-lf a.lf-sc,#gbm-lf a.lf-card')].map((a) => a.href));
      const first = shown.slice(0, 16), want = items.slice(0, 16);
      feedOrder = { match: JSON.stringify(first.map((u) => u.replace(/\/$/, ''))) === JSON.stringify(want.map((u) => u.replace(/\/$/, ''))), firstShown: first.slice(0, 3), firstFeed: want.slice(0, 3) };
    } catch (e) { feedOrder = { error: String(e).slice(0, 80) }; }
  }
  const res = { feedOrder, path, width, scenario: scenario || 'normal', candidate, frames: frames.map((f) => f.file), errs, ...m, more };
  writeFileSync(join(out, `${tag}.json`), JSON.stringify(res, null, 1));
  await ctx.close();
  return res;
}

const browser = await chromium.launch();
const all = [];
for (const p of paths) for (const w of widths) {
  const r = await run(browser, w, p); all.push(r);
  console.log(`${label(p)} @${w}: mounted=${r.mounted} cards=${r.cards} cls=${r.cls} overflow=${r.scrollW - r.clientW} inv=${r.orderInversions} h1dom=${r.h1Dom}/vis=${r.h1Visible} lp=${r.lpVisible} sn=${r.snVisible} nativeGal=${r.nativeGalDisplay} imgsBroken=${r.imgsBroken} feedOrder=${r.feedOrder ? r.feedOrder.match : '-'} more=${r.more ? r.more.cards + '/inv' + r.more.inversions + '/dupes' + r.more.dupes : '-'} errs=${r.errs.length}`);
}
writeFileSync(join(out, 'summary.json'), JSON.stringify(all, null, 1));
await browser.close();
