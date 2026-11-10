#!/usr/bin/env node
// Print the phone edition HTML (build.mjs) to a 390 x 844 pt PDF with Chromium, after checking in the browser
// that every page fits: no block overflows its page body, nothing sticks out past a page edge, no page is empty,
// every image decoded and only Barlow families are in use. Exits non-zero on any failure.
//
//   PLAYWRIGHT_PKG=/path/to/playwright node render.mjs <in.html> <out.pdf> [pngDir]
// With pngDir, pages 1, 2, 3 and the last page are also saved as PNGs for review.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PKG || 'playwright');

const [inHtml, outPdf, pngDir] = process.argv.slice(2);
if (!outPdf) { console.error('usage: render.mjs <in.html> <out.pdf> [pngDir]'); process.exit(2); }
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 520, height: 1126 }, deviceScaleFactor: 2 });
const requests = [];
page.on('request', (r) => { if (!/^(file|data):/.test(r.url())) requests.push(r.url()); });
await page.goto('file://' + path.resolve(inHtml), { waitUntil: 'load' });
await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 60000 });

const qa = await page.evaluate(() => {
  const out = { pages: 0, overflow: [], edge: [], empty: [], brokenImages: [], smallText: [], fonts: [], minBodyPt: 99 };
  const pages = [...document.querySelectorAll('.page')];
  out.pages = pages.length;
  const pt = (px) => px * 0.75;
  const fams = new Set();
  pages.forEach((p, k) => {
    const n = k + 1, pr = p.getBoundingClientRect(), body = p.querySelector('.body');
    if (body) {
      if (body.scrollHeight > body.clientHeight + 1) out.overflow.push({ page: n, by: pt(body.scrollHeight - body.clientHeight) });
      if (!body.children.length) out.empty.push(n);
      const last = body.lastElementChild; out['fill' + n] = last ? Math.round(100 * (last.getBoundingClientRect().bottom - body.getBoundingClientRect().top) / body.clientHeight) : 0;
    }
    if (p.scrollWidth > p.clientWidth + 1 || p.scrollHeight > p.clientHeight + 1) out.edge.push({ page: n, what: 'page scroll', w: p.scrollWidth, h: p.scrollHeight });
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    for (let t; (t = walker.nextNode());) {
      if (!t.nodeValue.trim()) continue;
      const el = t.parentElement, cs = getComputedStyle(el), r = document.createRange(); r.selectNodeContents(t);
      fams.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      for (const q of r.getClientRects()) {
        if (q.left < pr.left - 0.5 || q.right > pr.right + 0.5 || q.top < pr.top - 0.5 || q.bottom > pr.bottom + 0.5) { out.edge.push({ page: n, text: t.nodeValue.trim().slice(0, 50) }); break; }
      }
      const size = el.closest('svg') ? parseFloat(cs.fontSize) * (350 / 350) : pt(parseFloat(cs.fontSize));
      if (el.matches('.dek,.d,.p,blockquote,.lead dd,.lines li,.tz li,.meta li,.toc span') && size < out.minBodyPt) out.minBodyPt = size;
      if (size < 10.4) out.smallText.push({ page: n, size, text: t.nodeValue.trim().slice(0, 30) });
    }
  });
  out.brokenImages = [...document.images].filter((i) => !i.naturalWidth).length;
  out.fonts = [...fams];
  out.links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  return out;
});
const ext = [...new Set(qa.links.filter((h) => !h.startsWith('#')))];
qa.badLinks = ext.filter((h) => !/^https:\/\/www\.gatorbaitmedia\.com\//.test(h) && !/^https:\/\/www\.youtube\.com\/watch\?v=/.test(h));
qa.externalLinks = ext.length; qa.networkRequests = requests.length; delete qa.links;

if (pngDir) {
  fs.mkdirSync(pngDir, { recursive: true });
  const pages = await page.$$('.page');
  for (const n of [...new Set([1, 2, 3, pages.length])]) if (pages[n - 1]) await pages[n - 1].screenshot({ path: path.join(pngDir, `page-${String(n).padStart(2, '0')}.png`) });
  if (process.env.ALL_PNG) for (let n = 1; n <= pages.length; n++) await pages[n - 1].screenshot({ path: path.join(pngDir, `all-${String(n).padStart(2, '0')}.png`) });
}
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: outPdf, printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close();
qa.bytes = fs.statSync(outPdf).size;
console.log(JSON.stringify(qa, null, 1));
const bad = qa.overflow.length || qa.edge.length || qa.empty.length || qa.brokenImages || qa.badLinks.length || qa.networkRequests || qa.fonts.some((f) => !/^Barlow( Condensed)?$/.test(f)) || qa.minBodyPt < 15;
if (bad) { console.error('QA FAILED'); process.exit(1); }
