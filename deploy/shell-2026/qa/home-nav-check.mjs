// Homepage nav check: which Front Page nav links show, and whether Store stays inside the nav, at laptop/desktop widths.
// Usage: NODE_PATH=<playwright dir> PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node deploy/shell-2026/qa/home-nav-check.mjs sports-live/frame.html
// Legend: + visible inside the nav, - hidden by CSS, ! clipped by the nav edge.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const frame = readFileSync(process.argv[2], 'utf8');
const b = await chromium.launch();
for (const w of [821, 850, 880, 899, 900, 1024, 1099, 1100, 1279, 1280, 1366, 1440, 1920]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/*', (r) => new URL(r.request().url()).origin === 'https://www.gatorbaitmedia.com' && new URL(r.request().url()).pathname === '/' ? r.fulfill({ status: 200, contentType: 'text/html', body: frame }) : r.fulfill({ status: 404, body: '' }));
  const p = await ctx.newPage(); await p.goto('https://www.gatorbaitmedia.com/'); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => { const nav = document.querySelector('.fp-links'); if (!nav) return null; const nb = nav.getBoundingClientRect();
    return [...nav.querySelectorAll('a')].map((a) => { const x = a.getBoundingClientRect(); return (getComputedStyle(a).display === 'none' ? '-' : x.right <= nb.right + 0.5 ? '+' : '!') + a.textContent.trim() + (a.target ? '[' + a.target + ']' : ''); }).join(' '); });
  console.log(w, r); await ctx.close();
}
await b.close();
