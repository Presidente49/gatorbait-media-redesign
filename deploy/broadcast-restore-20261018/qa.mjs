// Blue restore QA (Oct. 18), adapted from deploy/broadcast-2026/qa.mjs.
// Loads the live page, swaps each live embed body (rollback/<id>-rev<N>.html) for its target in the served
// document (what a PATCH would do), then checks overflow, JS errors, fonts, contrast, tap targets, links and order.
// node deploy/broadcast-restore-20261018/qa.mjs <outdir> [live|target]
import fs from 'fs';
import { chromium, devices } from '/opt/node-tools/node_modules/playwright/index.mjs';
const D = new URL('.', import.meta.url).pathname;
const [, , outDir = D + 'qa', mode = 'target'] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const pairs = [['rollback/602fb362-rev18.html', '602fb362-target.html'], ['rollback/c4b41f6a-rev4.html', 'c4b41f6a-target.html'], ['rollback/53e15504-rev12.html', '53e15504-target.html']];
const swaps = mode === 'live' ? [] : pairs.map(([a, z]) => [fs.readFileSync(D + a, 'utf8'), fs.readFileSync(D + z, 'utf8')]).filter(([a, z]) => a !== z);
// The white theme c66d5b7f (site-shell.css) also styles #gbm-lp/#gbm-sn. SHELL_DIR=<dir with c66d5b7f-rev12.html and
// c66d5b7f-target.html from the shell restore package> swaps it too, so the news pages are judged as they will be
// once both packages are applied.
if (mode !== 'live' && process.env.SHELL_DIR) swaps.push(['c66d5b7f-rev12.html', 'c66d5b7f-target.html'].map(f => fs.readFileSync(`${process.env.SHELL_DIR}/${f}`, 'utf8')));
const routes = { 'all-news': '/gatorbait-media-blogs', football: '/gatorbait-media-blogs/categories/gator-football', buddy: '/gatorbait-media-blogs/categories/buddy-s-blog', page2: '/gatorbait-media-blogs/page/2' };
const ctxFor = w => w < 768
  ? { userAgent: devices['iPhone 13'].userAgent, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: devices['Desktop Chrome'].userAgent, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };
const args = process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args });
const report = {};
for (const [name, path] of Object.entries(routes)) for (const w of [320, 390, 430, 1366]) {
  const ctx = await b.newContext({ ...ctxFor(w), ignoreHTTPSErrors: true });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e.message).slice(0, 160)));
  let swapped = 0;
  await p.route('https://www.gatorbaitmedia.com/**', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const r = await route.fetch();
    let body = await r.text();
    for (const [a, z] of swaps) if (body.includes(a)) { body = body.replace(a, () => z); swapped++; }
    route.fulfill({ response: r, body });
  });
  await p.goto(`https://www.gatorbaitmedia.com${path}?qa=${Date.now()}`, { waitUntil: 'load', timeout: 90000 });
  await p.waitForSelector('#gbm-lp', { timeout: 20000 }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(4500);
  await p.evaluate(() => { for (const el of document.querySelectorAll('[id*="consent"],[class*="consent"],[data-hook*="consent"]')) el.style.display = 'none'; });
  const m = await p.evaluate(async () => {
    const L = c => { const v = c.match(/[\d.]+/g).slice(0, 3).map(x => +x / 255).map(x => x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none' && /gradient|url/.test(cs.backgroundImage) && e.id !== 'gbm-lp') return null; const c = cs.backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) { const a = c.match(/[\d.]+/g); if (a.length > 3 && +a[3] < 0.5) continue; return c; } } return getComputedStyle(document.getElementById('SITE_PAGES') || document.body).backgroundImage !== 'none' ? 'rgb(7, 18, 46)' : 'rgb(255, 255, 255)'; };
    const roots = ['#gbm-sn', '#gbm-lp'].map(s => document.querySelector(s)).filter(Boolean);
    const lows = [], fams = new Set(), small = [];
    for (const r of roots) for (const el of r.querySelectorAll('*')) {
      const t = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const cs = getComputedStyle(el);
      if (t) { fams.add(cs.fontFamily.split(',')[0].replace(/"/g, '')); const bg = bgOf(el); if (bg && cs.visibility !== 'hidden' && el.getClientRects().length) { const a = L(cs.color), z = L(bg), ratio = (Math.max(a, z) + .05) / (Math.min(a, z) + .05); if (ratio < 4.5) lows.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 24)}" ${cs.color} on ${bg} = ${ratio.toFixed(2)}`); } }
      if ((el.matches('a,button,input') && el.getClientRects().length)) { const bx = el.getBoundingClientRect(); if (bx.height < 44 && !el.matches('.lp-lead,.lp-row,.lp-card')) small.push(`${el.tagName} "${(el.textContent || el.value || '').trim().slice(0, 20)}" ${Math.round(bx.height)}px`); }
    }
    const lp = document.getElementById('gbm-lp');
    const stories = lp ? [...lp.querySelectorAll('a.lp-lead,a.lp-row,a.lp-card')].map(a => a.getAttribute('href').replace(/^https?:\/\/[^/]+/, '')) : [];
    let order = null;
    if (location.pathname === '/gatorbait-media-blogs' && stories.length) {
      try {
        const x = new DOMParser().parseFromString(await (await fetch('/blog-feed.xml')).text(), 'text/xml');
        const d = {}; for (const i of x.getElementsByTagName('item')) d[i.getElementsByTagName('link')[0].textContent.trim().replace(/^https?:\/\/[^/]+/, '')] = Date.parse(i.getElementsByTagName('pubDate')[0].textContent);
        const ts = stories.map(s => d[s]).filter(Boolean);
        const bad = []; for (let i = 1; i < ts.length; i++) if (ts[i] > ts[i - 1]) bad.push(i);
        order = { dated: ts.length, of: stories.length, newestFirst: bad.length === 0, outOfOrderAt: bad, lead: stories[0], leadIsNewest: ts[0] === Math.max(...Object.values(d)) };
      } catch (e) { order = { error: String(e) }; }
    }
    return {
      cw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth,
      sn: !!document.getElementById('gbm-sn'), lp: !!lp, h1: document.querySelector('#gbm-sn h1')?.textContent,
      links: lp ? lp.querySelectorAll('a[href]').length : 0, stories: stories.length, order,
      ld: !!document.getElementById('gbm-sn-ld'), fams: [...fams], lowContrast: lows.slice(0, 12), smallTargets: [...new Set(small)].slice(0, 12),
      italicLoaded: [...document.fonts].some(f => f.family.includes('GB Broadcast') && f.status === 'loaded'),
      depth: !!document.getElementById('gbm-bc-s2-depth'), bcEdge: getComputedStyle(document.documentElement).getPropertyValue('--x') || null,
      pageBg: getComputedStyle(document.getElementById('SITE_PAGES') || document.body).backgroundImage.slice(0, 60),
    };
  });
  m.swapped = swapped; m.errors = errors;
  report[`${name}-${w}`] = m;
  if (mode !== 'live') await p.screenshot({ path: `${outDir}/news-${name}-${w}.jpg`, type: 'jpeg', quality: 70, fullPage: true });
  await ctx.close();
  console.log(name, w, JSON.stringify({ ...m, lowContrast: m.lowContrast.length, smallTargets: m.smallTargets.length }));
}
await b.close();
fs.writeFileSync(`${outDir}/report-${mode}.json`, JSON.stringify(report, null, 1));
