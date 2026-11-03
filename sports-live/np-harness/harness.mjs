#!/usr/bin/env node
// Local test harness for the News Wire newspaper preview (sports-live/src/news-paper.js). Read-only: it never touches Wix.
// It serves a stand-in for the Wix blog feed routes (native list markup, 12 per page desktop / 5 on phones, pagination links) and
// /blog-feed.xml (newest 20) from real post data in posts.json, loads the real loader embed and the built bundle, and screenshots it.
// Usage: NODE_PATH=/opt/node22/lib/node_modules:/tmp/esb/node_modules node sports-live/np-harness/harness.mjs [--serve] [--out <dir>] [--cache <dir>]
//   --serve  only run the server on :8765 (open /gatorbait-media-blogs in a browser; Wix photos load from the network)
//   --cache  directory with the Wix photos (<media id with ~ as _>), Barlow woff2 files and YouTube thumbs; used for offline shots.
import http from 'node:http';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const here = dirname(fileURLToPath(import.meta.url)), repo = join(here, '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const NOW = Date.parse('2026-11-03T00:30:00Z'); // Mon Nov. 2, 2026, 7:30 p.m. ET (the day the data was read)
const posts = JSON.parse(readFileSync(join(here, 'posts.json'), 'utf8')).posts.map((p) => ({ ...p, ts: Date.parse(p.date) })).sort((a, b) => b.ts - a.ts);
const CATS = { 'franz-beard-blog': 'Franz Beard - Blog', 'buddy-s-blog': "Buddy's Blog", 'gator-football': 'Gator Football', 'gator-basketball': 'Gator Basketball', 'the-buddy-martin-show': 'The Buddy Martin Show', 'thoughts-of-the-day-franz-beard-1': 'Thoughts Of The Day', 'eddie-gilley-blog': 'Eddie Gilley - Blog', 'loren-meadows-blogs': 'Loren Meadows - Blogs', 'gator-baseball': 'Gator Baseball', 'gator-gymnastics': 'Gator Gymnastics', 'gator-breaking-news': 'Gator Breaking News' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wix = (img, w = 640) => (img ? `https://static.wixstatic.com/media/${img}/v1/fill/w_${w},h_${w},al_c,q_80,enc_auto/file.jpg` : '');
const ago = (ts) => { const s = (NOW - ts) / 1000; if (s < 3600) return Math.round(s / 60) + ' minutes ago'; if (s < 86400) { const h = Math.round(s / 3600); return h + (h === 1 ? ' hour ago' : ' hours ago'); } const d = Math.floor(s / 86400); return d === 1 ? 'Yesterday' : d < 7 ? d + ' days ago' : new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' }); };
const rss = () => `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>GatorBait Media</title>${posts.slice(0, 20).map((p) => `<item><title>${esc(p.title)}</title><link>https://www.gatorbaitmedia.com/post/${p.slug}</link><description>${esc(p.desc)}</description><pubDate>${new Date(p.ts).toUTCString()}</pubDate><dc:creator>${esc(p.by)}</dc:creator>${p.cats.map((c) => `<category>${esc(c)}</category>`).join('')}${p.img ? `<enclosure url="https://static.wixstatic.com/media/${p.img}" type="image/jpeg"/>` : ''}</item>`).join('')}</channel></rss>`;
function page(url, ua) {
  const m = url.match(/^\/gatorbait-media-blogs(?:\/categories\/([^/]+))?(?:\/page\/(\d+))?\/?$/);
  if (!m) return null;
  const slug = m[1] || '', pg = +(m[2] || 1), per = /iPhone|Mobile/.test(ua) ? 5 : 12;
  let list = posts;
  if (slug) { const name = CATS[slug]; list = name ? posts.filter((p) => p.cats.includes(name)) : []; }
  const total = Math.max(1, Math.ceil(list.length / per)), items = list.slice((pg - 1) * per, pg * per);
  const baseP = '/gatorbait-media-blogs' + (slug ? '/categories/' + slug : ''), hrefP = (n) => (n <= 1 ? baseP : baseP + '/page/' + n);
  const li = items.map((p) => `<div data-hook="item-container"><img data-hook="gallery-item-image-img" src="${wix(p.img)}" alt="Featured image for ${esc(p.title)}"><div data-hook="post-list-item"><a href="https://www.gatorbaitmedia.com/post/${p.slug}"><h2 data-hook="post-title">${esc(p.title)}</h2></a><div data-hook="post-category-label"><a href="/gatorbait-media-blogs/categories/x">${esc(p.cats[0])}</a></div><span data-hook="user-name">${esc(p.by)}</span><span data-hook="time-ago">${ago(p.ts)}</span><span data-hook="time-to-read">${p.min} min read</span></div></div>`).join('');
  const pag = (pg > 1 ? `<a data-hook="pagination__previous" href="${hrefP(pg - 1)}">Prev</a>` : '') + (pg < total ? `<a data-hook="pagination__next" href="${hrefP(pg + 1)}">Next</a>` : '') + `<a data-hook="pagination__last" href="${hrefP(total)}">${total}</a>`;
  const loader = readFileSync(join(here, 'loader.local.html'), 'utf8');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Latest | GatorBait Media</title>
<style>@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(/cache/barlow-condensed-latin-700-normal.woff2)}@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(/cache/barlow-condensed-latin-800-normal.woff2)}@font-face{font-family:"Barlow";font-weight:400;src:url(/cache/barlow-latin-400-normal.woff2)}@font-face{font-family:"Barlow";font-weight:500;src:url(/cache/barlow-latin-400-normal.woff2)}@font-face{font-family:"Barlow";font-weight:600;src:url(/cache/barlow-latin-600-normal.woff2)}@font-face{font-family:"Barlow";font-weight:700;src:url(/cache/barlow-latin-700-normal.woff2)}@font-face{font-family:"Barlow";font-weight:800;src:url(/cache/barlow-latin-800-normal.woff2)}
body{margin:0;background:#0b1226;font-family:Barlow,Arial,sans-serif}.site-hdr{height:64px;background:#10264b;color:#fff;display:flex;align-items:center;padding:0 24px;font:800 22px "Barlow Condensed";letter-spacing:.1em;text-transform:uppercase;border-bottom:3px solid #fa4616}.site-ftr{height:120px;background:#10264b}</style>
${loader}</head><body><div class="site-hdr">GatorBait Media &middot; stand-in for the Wix site header</div><div id="SITE_PAGES"><main><div data-hook="feed-page-root"><div data-hook="post-list-pro-gallery-container"><div data-hook="post-list">${li}</div></div><div data-hook="${slug ? 'category' : 'feed'}-pagination-container">${pag}</div></div></main></div><div class="site-ftr"></div></body></html>`;
}
export function serve(port = 8765) {
  const srv = http.createServer((req, res) => {
    const u = req.url.split('?')[0];
    const send = (t, b) => { res.writeHead(200, { 'content-type': t, 'cache-control': 'no-store' }); res.end(b); };
    if (u === '/blog-feed.xml') return send('application/xml', rss());
    if (u === '/sports-live/news-paper-widget.js') return send('application/javascript', readFileSync(join(repo, 'sports-live/news-paper-widget.js')));
    if (u === '/sports-live/buddy-videos.json') return send('application/json', readFileSync(join(repo, 'sports-live/buddy-videos.json')));
    const h = page(u, req.headers['user-agent'] || '');
    if (h) return send('text/html; charset=utf-8', h);
    res.writeHead(404); res.end('nope');
  });
  return new Promise((r) => srv.listen(port, () => r(srv)));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (arg('serve')) { await serve(); console.log('http://localhost:8765/gatorbait-media-blogs'); }
  else await shoot();
}
async function shoot() {
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright');
  const out = arg('out', '/tmp/np-shots'), cache = arg('cache', '/tmp/np-cache'); mkdirSync(out, { recursive: true });
  const srv = await serve(), O = 'http://localhost:8765';
  const results = [];
  const browser = await chromium.launch();
  const jobs = [
    [390, '/gatorbait-media-blogs', 'root'], [430, '/gatorbait-media-blogs', 'root'], [1366, '/gatorbait-media-blogs', 'root'], [1920, '/gatorbait-media-blogs', 'root'],
    [390, '/gatorbait-media-blogs/categories/franz-beard-blog', 'category-franz'], [1366, '/gatorbait-media-blogs/categories/franz-beard-blog', 'category-franz'],
    [1366, '/gatorbait-media-blogs/page/2', 'page-2'], [390, '/gatorbait-media-blogs/page/2', 'page-2'],
  ];
  for (const [w, p, label] of jobs) {
    const phone = w < 700;
    const ctx = await browser.newContext(phone ? { viewport: { width: w, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' } : { viewport: { width: w, height: 900 } });
    await ctx.addInitScript(`(()=>{const R=Date,O=${NOW}-R.now();class F extends R{constructor(...a){a.length?super(...a):super(R.now()+O)}static now(){return R.now()+O}}window.Date=F;window.__cls=0;try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})}catch(e){}})()`);
    await ctx.route('**/*', async (route) => {
      const u = route.request().url();
      if (u.startsWith(O)) return route.continue();
      let m;
      if ((m = u.match(/static\.wixstatic\.com\/media\/([^/]+)/))) { const f = join(cache, m[1].replace('~', '_')); return existsSync(f) ? route.fulfill({ path: f, contentType: 'image/jpeg' }) : route.abort(); }
      if ((m = u.match(/i\.ytimg\.com\/vi\/([^/]+)\//))) { const f = join(cache, 'yt-' + m[1] + '.jpg'); return existsSync(f) ? route.fulfill({ path: f, contentType: 'image/jpeg' }) : route.abort(); }
      if (u.includes('presidente49.github.io') && u.endsWith('buddy-videos.json')) return route.fulfill({ path: join(repo, 'sports-live/buddy-videos.json'), contentType: 'application/json' });
      if (u.includes('cdn.jsdelivr.net/npm/@fontsource')) return route.abort();
      return route.abort();
    });
    await ctx.route(O + '/cache/*', (route) => route.fulfill({ path: join(cache, route.request().url().split('/cache/')[1]) }));
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => { if (m.type() === 'error' || /fell back/.test(m.text())) errs.push(m.text()); });
    await page.goto(O + p, { waitUntil: 'load' });
    await page.waitForSelector('#gbm-np', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); for (const i of document.images) i.loading = 'eager'; await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); });
    const metrics = async () => page.evaluate(() => {
      const r = document.getElementById('gbm-np'), fam = {}, bad = [];
      if (r) { r.querySelectorAll('*').forEach((e) => { if (!e.childNodes.length) return; const has = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()); if (!has) return; const f = getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '').trim(); fam[f] = (fam[f] || 0) + 1; if (/serif/i.test(getComputedStyle(e).fontFamily.replace(/sans-serif/gi, '')) || !/^Barlow/.test(f)) bad.push(e.className + ':' + f); }); }
      const hrefs = r ? [...r.querySelectorAll('a.np-lt,.np-lt a,.np-rt,.np-wt,.np-ct,a.np-card')].map((a) => a.getAttribute('href')) : [];
      return { mounted: !!r, htmlOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, fam, bad, cls: +(window.__cls || 0).toFixed(4), brokenImgs: [...document.images].filter((i) => i.complete && !i.naturalWidth && i.closest('#gbm-np')).length, imgs: r ? r.querySelectorAll('img').length : 0, uniqueHrefs: new Set(hrefs).size, hrefs: hrefs.length, dupMedia: (() => { const s = {}, d = []; r && r.querySelectorAll('img').forEach((i) => { const id = (i.currentSrc || i.src).match(/media\/([^/]+)/); if (id) { if (s[id[1]]) d.push(id[1]); s[id[1]] = 1; } }); return d; })() };
    });
    const m = await metrics();
    await page.screenshot({ path: join(out, `${label}-${w}.png`), fullPage: true });
    let more = null;
    if (label === 'root' && (w === 1366 || w === 390)) {
      const btn = page.locator('#np-more');
      let n = 0; while (await btn.count() && n < 6) { await btn.click(); await page.waitForTimeout(700); n++; }
      await page.waitForTimeout(600);
      more = await page.evaluate(() => ({ cards: document.querySelectorAll('#np-grid>li').length, status: document.getElementById('np-status').textContent, older: !!document.querySelector('.np-older'), olderHref: (document.querySelector('.np-older') || {}).getAttribute && document.querySelector('.np-older').getAttribute('href'), times: [...document.querySelectorAll('#gbm-np time[datetime]')].map((t) => t.getAttribute('datetime')) }));
      more.stories = await page.evaluate(() => [...document.querySelectorAll('#gbm-np a[href*="/post/"]')].map((a) => a.getAttribute('href')).filter((h, i, a) => a.indexOf(h) === i).length);
      await page.screenshot({ path: join(out, `root-loadmore-${w}.png`), fullPage: true });
    }
    results.push({ w, p, label, errs, ...m, more });
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log(JSON.stringify(results.map((r) => ({ ...r, more: r.more && { ...r.more, times: undefined } })), null, 1));
  const fs = await import('node:fs'); fs.writeFileSync(join(out, 'metrics.json'), JSON.stringify(results, null, 1));
}
