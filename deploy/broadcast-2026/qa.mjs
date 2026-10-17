// Broadcast S2 candidate QA: load the live page, swap the live embed HTML for proposed.html in the served
// document (same as a PATCH would), then check overflow, fonts, contrast, tap targets and links per width.
// node deploy/broadcast-2026/qa.mjs <path> <outdir> [live|depth]
import fs from 'fs';
import { chromium, devices } from '/opt/node-tools/node_modules/playwright/index.mjs';
const D = new URL('.', import.meta.url).pathname;
const [, , path = '/gatorbait-media-blogs', outDir = '/tmp/claude-0/s2/qa', mode = ''] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
// modes: live (no swap), depth (602fb362 rev16 -> rev17-candidate), default (first S2 pass: rev15/rev1 -> proposed)
const pairs = mode === 'live' ? [] : mode === 'depth' ? [['602fb362/rev16.html', '602fb362/rev17-candidate.html']] : [['602fb362/rev15.html', '602fb362/proposed.html'], ['c4b41f6a/rev1.html', 'c4b41f6a/proposed.html']];
const swaps = pairs.map(([a, z]) => [fs.readFileSync(D + a, 'utf8'), fs.readFileSync(D + z, 'utf8')]);
const ctxFor = w => w < 768
  ? { userAgent: devices['iPhone 13'].userAgent, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: devices['Desktop Chrome'].userAgent, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const report = {};
for (const w of [320, 390, 430, 1366]) {
  const ctx = await b.newContext(ctxFor(w));
  const p = await ctx.newPage();
  let swapped = 0;
  await p.route('https://www.gatorbaitmedia.com/**', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const r = await route.fetch();
    let body = await r.text();
    for (const [a, z] of swaps) if (body.includes(a)) { body = body.replace(a, () => z); swapped++; }
    route.fulfill({ response: r, body });
  });
  await p.goto(`https://www.gatorbaitmedia.com${path}${path.includes('?') ? '&' : '?'}qa=${Date.now()}`, { waitUntil: 'load', timeout: 90000 });
  await p.waitForSelector('#gbm-lp', { timeout: 20000 }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(3500);
  await p.evaluate(() => { for (const el of document.querySelectorAll('[id*="consent"],[class*="consent"],[data-hook*="consent"]')) el.style.display = 'none'; });
  const m = await p.evaluate(() => {
    const L = c => { const v = c.match(/[\d.]+/g).slice(0, 3).map(x => +x / 255).map(x => x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none' && /gradient/.test(cs.backgroundImage) && e.id !== 'gbm-lp') return null; const c = cs.backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; } return 'rgb(255, 255, 255)'; };
    const roots = ['#gbm-sn', '#gbm-lp'].map(s => document.querySelector(s)).filter(Boolean);
    const lows = [], fams = new Set(), small = [];
    for (const r of roots) for (const el of r.querySelectorAll('*')) {
      const t = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const cs = getComputedStyle(el);
      if (t) { fams.add(cs.fontFamily.split(',')[0].replace(/"/g, '')); const bg = bgOf(el); if (bg && cs.visibility !== 'hidden' && el.getClientRects().length) { const a = L(cs.color), z = L(bg), ratio = (Math.max(a, z) + .05) / (Math.min(a, z) + .05); if (ratio < 4.5) lows.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 24)}" ${cs.color} on ${bg} = ${ratio.toFixed(2)}`); } }
      if ((el.matches('a,button,input') && el.getClientRects().length)) { const bx = el.getBoundingClientRect(); if (bx.height < 44 && !el.matches('.lp-lead,.lp-row,.lp-card')) small.push(`${el.tagName} "${(el.textContent || el.value || '').trim().slice(0, 20)}" ${Math.round(bx.height)}px`); }
    }
    const lp = document.getElementById('gbm-lp');
    return {
      cw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth,
      sn: !!document.getElementById('gbm-sn'), lp: !!lp, h1: document.querySelector('#gbm-sn h1')?.textContent,
      links: lp ? [...lp.querySelectorAll('a[href]')].map(a => a.getAttribute('href')) : [],
      ld: !!document.getElementById('gbm-sn-ld'), fams: [...fams], lowContrast: lows.slice(0, 12), smallTargets: [...new Set(small)].slice(0, 12),
      italicLoaded: [...document.fonts].some(f => f.family.includes('GB Broadcast') && f.status === 'loaded'),
      pageBg: getComputedStyle(document.getElementById('SITE_PAGES') || document.body).backgroundImage.slice(0, 40),
    };
  });
  m.swapped = swapped;
  report[w] = m;
  await p.screenshot({ path: `${outDir}/${w}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1));
for (const [w, m] of Object.entries(report)) console.log(w, JSON.stringify({ ...m, links: m.links.length }));
