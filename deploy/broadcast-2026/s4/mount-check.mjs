// Roster card mount check: loads live pages with 360c9265 rev6 swapped in, reports where the card lands.
// node deploy/broadcast-2026/s4/mount-check.mjs <outdir>
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCandidates, routeCandidates } from './inject.mjs';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..');
const out = process.argv[2] || join(here, 'qa', 'mount'); mkdirSync(out, { recursive: true });
const cand = loadCandidates({ '360c9265': [join(root, '360c9265/rev5.html'), join(root, '360c9265/rev6.html')] });
const UA_PHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const b = await chromium.launch();
const runs = process.argv[3] ? JSON.parse(process.argv[3]) : [['/magazine', 320], ['/magazine', 390], ['/magazine', 430], ['/magazine', 1366], ['/', 390], ['/', 1366]];
for (const [p, w] of runs) for (let attempt = 1; attempt <= 3; attempt++) {
  const ctx = await b.newContext(w < 800 ? { userAgent: UA_PHONE, isMobile: true, hasTouch: true, deviceScaleFactor: 2, viewport: { width: w, height: 844 } } : { viewport: { width: w, height: 900 } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  let swap = {}; await routeCandidates(page, cand, (u, r) => { swap = r; });
  await page.goto('https://www.gatorbaitmedia.com' + p, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(9000);
  // raw:0 means the served page did not carry rev5 verbatim, so the live embed ran instead of the candidate.
  if (!(swap['360c9265'] || {}).raw && attempt < 3) { console.log(JSON.stringify({ p, w, attempt, retry: 'candidate not swapped' })); await ctx.close(); await new Promise((r) => setTimeout(r, 8000)); continue; }
  const r = await page.evaluate(() => {
    const t = document.querySelectorAll('.gbm-football-tools'), c = t[0];
    const mag = document.getElementById('gbm-magazine-page');
    if (!c) return { n: 0, variant: mag && mag.className };
    const cr = c.getBoundingClientRect(), pr = c.parentElement.getBoundingClientRect(), h2 = c.querySelector('h2');
    const nx = c.nextElementSibling;
    return { n: t.length, variant: mag && mag.className, parent: c.parentElement.tagName.toLowerCase() + '.' + c.parentElement.className, next: nx && nx.tagName.toLowerCase() + '.' + nx.className,
      cw: Math.round(cr.width), pw: Math.round(pr.width), left: Math.round(cr.left), hscroll: document.documentElement.scrollWidth - innerWidth,
      h2: h2 && getComputedStyle(h2).fontFamily + ' ' + getComputedStyle(h2).color, links: [...c.querySelectorAll('a')].map((a) => a.getAttribute('href')) };
  });
  console.log(JSON.stringify({ p, w, swap, ...r, errs }));
  const el = await page.$('.gbm-football-tools');
  if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: join(out, `${p === '/' ? 'home' : 'magazine'}-${w}.png`) }); }
  await ctx.close(); await new Promise((r) => setTimeout(r, 5000));
  break;
}
await b.close();
