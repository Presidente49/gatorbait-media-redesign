// Local before/after render: live pin skin (base) vs color build. Run: PLAYWRIGHT_PKG=/opt/node22/lib/node_modules node deploy/color-blue-20261018/qa.mjs [outdir]
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire((process.env.PLAYWRIGHT_PKG || '/opt/node22/lib/node_modules') + '/');
const { chromium } = require('playwright');
const R = fileURLToPath(new URL('../../', import.meta.url)), D = R + 'deploy/color-blue-20261018/';
const OUT = process.argv[2] || D + 'qa/'; fs.mkdirSync(OUT, { recursive: true });
const posts = JSON.parse(fs.readFileSync(R + 'gazette-live/posts.json', 'utf8')).posts.filter(p => Date.parse(p.firstPublishedDate) <= Date.now()).sort((a, b) => Date.parse(b.firstPublishedDate) - Date.parse(a.firstPublishedDate));
const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const xml = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${posts.map(p => `<item><title>${x(p.title)}</title><link>${p.url}</link><pubDate>${new Date(p.firstPublishedDate).toUTCString()}</pubDate><dc:creator>${x(p.author)}</dc:creator><description>${x(p.excerpt || '')}</description>${p.image?.src ? `<enclosure url="${p.image.src}" type="image/jpeg"/>` : ''}</item>`).join('')}</channel></rss>`;
const code = fs.readFileSync(R + 'automation/sports-home/runtime.js', 'utf8').replace('__GAZETTE_PAYLOAD__', () => JSON.stringify({ css: fs.readFileSync(R + 'automation/sports-home/homepage.css', 'utf8'), fallback: { posts } }));
const skins = { before: fs.readFileSync(D + 'base-10bf364.js', 'utf8'), after: fs.readFileSync(R + 'sports-live/broadcast-home-color.js', 'utf8') };
const page = k => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>${code.replace(/<\/script/g, '<\\/script')}</script><script>${skins[k].replace(/<\/script/g, '<\\/script')}</script></body></html>`;
// photo placeholder: soft mid-grey so image-edge accents are visible
const png = fs.readFileSync(R + 'deploy/color-blue-20261018/ph.png');
const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
const cr = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); };
const probe = () => {
  const P = s => { const m = s.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2], m.length > 3 ? m[3] : 1]; };
  const over = (f, b) => [0, 1, 2].map(i => f[i] * f[3] + b[i] * (1 - f[3]));
  const bgOf = el => { const chain = []; for (let e = el; e; e = e.parentElement) chain.push(e); let base = [8, 12, 30]; for (const e of chain.reverse()) { const c = P(getComputedStyle(e).backgroundColor); if (c[3] > 0) base = over(c, base).concat(1), base = base.slice(0, 3); } return base; };
  const res = [];
  const root = document.querySelector('#gbm-live');
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (w.nextNode()) { const t = w.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (seen.has(el)) continue; seen.add(el); const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') continue; const op = P(cs.color); const fg = over(op, bgOf(el)); res.push({ k: (el.className || el.tagName) + '|' + t.textContent.trim().slice(0, 24), fg, bg: bgOf(el), size: parseFloat(cs.fontSize), bold: +cs.fontWeight >= 700 }); }
  return res;
};
const b = await chromium.launch(); const out = {}; const mins = {};
for (const w of [390, 430, 1366, 1920]) for (const k of ['before', 'after']) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 800 }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.route('**/*', r => { const u = r.request().url();
    if (u === 'https://www.gatorbaitmedia.com/') return r.fulfill({ contentType: 'text/html', body: page(k) });
    if (u.includes('/blog-feed.xml')) return r.fulfill({ contentType: 'application/xml', body: xml });
    if (u.includes('scoreboard.json')) return r.fulfill({ contentType: 'application/json', body: fs.readFileSync(R + 'sports-live/scoreboard.json') });
    if (u.includes('front-page.config.json')) return r.fulfill({ contentType: 'application/json', body: fs.readFileSync(R + 'sports-live/front-page.config.json') });
    if (u.startsWith('https://static.wixstatic.com/')) return r.fulfill({ contentType: 'image/png', body: png });
    return r.abort(); });
  await p.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'commit' });
  await p.waitForSelector('#gbm-live .bc-hero', { timeout: 15000 }); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}${k}-${w}.png`, fullPage: true });
  const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight, lead: (document.querySelector('#gbm-live .bc-hero h1') || {}).textContent, order: [...document.querySelectorAll('#gbm-live .bc-row h3, #gbm-live .sh-wire-item h3')].map(e => e.textContent.trim().slice(0, 30)), sections: [...document.querySelectorAll('#gbm-live h2, #gbm-live .sh-section-title, #gbm-live .bc-h')].map(e => e.textContent.trim().slice(0, 20)), fonts: [...new Set([...document.querySelectorAll('#gbm-live *')].map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))] }));
  const t = await p.evaluate(probe); m.errs = errs;
  m.lowContrast = t.map(e => ({ k: e.k, c: +cr(e.fg, e.bg).toFixed(2), size: e.size, bold: e.bold })).filter(e => e.c < (e.size >= 24 || (e.size >= 18.66 && e.bold) ? 3 : 4.5));
  out[`${k}-${w}`] = m; await ctx.close();
}
await b.close();
const rep = {}; for (const w of [390, 430, 1366, 1920]) { const a = out[`before-${w}`], c = out[`after-${w}`]; rep[w] = { hBefore: a.h, hAfter: c.h, ovBefore: a.sw - a.cw, ovAfter: c.sw - c.cw, sameLead: a.lead === c.lead, sameOrder: JSON.stringify(a.order) === JSON.stringify(c.order), sameSections: JSON.stringify(a.sections) === JSON.stringify(c.sections), fonts: c.fonts, errs: c.errs, lowBefore: a.lowContrast.length, lowAfter: c.lowContrast.length, newLow: c.lowContrast.filter(e => !a.lowContrast.some(z => z.k === e.k && z.c <= e.c + .001)) }; }
fs.writeFileSync(OUT + 'metrics.json', JSON.stringify(rep, null, 1)); console.log(JSON.stringify(rep, null, 1));
