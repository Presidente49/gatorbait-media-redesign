// Blue restore, site shell QA: real production pages with the Theme target swapped in
// for the live Theme (rev12). The other five shell embeds are unchanged (target = live).
// node deploy/broadcast-restore-20261018/qa-shell.mjs  (read-only against the site)
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCandidates, routeCandidates } from '../broadcast-2026/s4/inject.mjs';

const req = createRequire(import.meta.url);
let pw;
try { pw = req('playwright'); } catch { pw = req('/opt/node22/lib/node_modules/playwright'); }
const { chromium } = pw;
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'qa');
const PATHS = ['/about', '/the-buddy-martin-show', '/pricing-plans'];
const WIDTHS = [320, 390, 430, 1366];
const cands = loadCandidates({ c66d5b7f: [join(here, 'rollback/c66d5b7f-rev12.html'), join(here, 'c66d5b7f-target.html')] });

function audit() {
  const W = innerWidth, doc = document.documentElement, r = { w: W };
  r.hscroll = doc.scrollWidth - W;
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [R, G, B] = m.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return [0.2126 * R + 0.7152 * G + 0.0722 * B, m[3] === undefined ? 1 : +m[3]]; };
  const bgOf = (e) => { for (let n = e; n; n = n.parentElement) { const s = getComputedStyle(n); const l = lum(s.backgroundColor); if (l && l[1] > 0.5) return l[0]; if (s.backgroundImage !== 'none') return null; } return 1; };
  const scope = '#gbm-site-header,#gbm-mobile-shell,#gbm-band,#gbm-footer,#gbm-media-hub,.gbm-football-tools,[data-hook=plan]';
  const fails = [], fonts = new Set(), taps = [];
  document.querySelectorAll(scope).forEach((S) => S.querySelectorAll('*').forEach((e) => {
    if (e.closest('[aria-hidden=true]')) return;
    const s = getComputedStyle(e), b = e.getBoundingClientRect();
    if (!b.width || s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return;
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (own) {
      fonts.add(s.fontFamily.split(',')[0].replace(/"/g, '').trim());
      const fg = lum(s.color), bg = bgOf(e);
      if (fg && bg != null) { const c = (Math.max(fg[0], bg) + 0.05) / (Math.min(fg[0], bg) + 0.05), px = parseFloat(s.fontSize), large = px >= 24 || (px >= 18.66 && +s.fontWeight >= 700); if (c < (large ? 3 : 4.5)) fails.push(`${e.textContent.trim().slice(0, 24)}|${c.toFixed(2)}|${px}`); }
    }
    if (e.matches('a,button') && b.top >= 0 && (b.height < 44 && b.width < 44)) taps.push(`${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 20)}:${Math.round(b.width)}x${Math.round(b.height)}`);
  }));
  r.fonts = [...fonts]; r.nContrast = fails.length; r.contrast = fails.slice(0, 6); r.nTaps = taps.length; r.taps = taps.slice(0, 6);
  r.header = !!document.getElementById('gbm-site-header');
  r.footer = !!document.getElementById('gbm-footer');
  r.whiteShellCss = !!document.getElementById('gbm-broadcast-network-shell-v1');
  r.bc = doc.classList.contains('gbm-bc');
  const hb = document.querySelector('#gbm-site-header .sh-bar,#gbm-site-header,#gbm-mobile-shell');
  r.headerBg = hb ? getComputedStyle(hb).backgroundColor : '';
  return r;
}

const b = await chromium.launch({ args: process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : [] });
const UA_DESK = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const UA_PHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const desk = await b.newContext({ userAgent: UA_DESK, ignoreHTTPSErrors: true });
const phone = await b.newContext({ userAgent: UA_PHONE, isMobile: true, hasTouch: true, deviceScaleFactor: 2, viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true });
const results = [];
const bust = String(Date.now());
for (const p of PATHS) {
  for (const w of WIDTHS) {
    const page = await (w < 821 ? phone : desk).newPage();
    await page.setViewportSize({ width: w, height: w < 800 ? 844 : 900 });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    let swap = {};
    await routeCandidates(page, cands, (u, rep) => { swap = rep; });
    try {
      await page.goto('https://www.gatorbaitmedia.com' + p + '?restoreqa=' + bust, { waitUntil: 'load', timeout: 90000 });
      await page.waitForTimeout(5000);
      const blocked = await page.evaluate(() => /Checking your request|verify your request/i.test(document.body.innerText.slice(0, 400)));
      const r = blocked ? { blocked: true } : await page.evaluate(audit);
      const name = `shell-${p.replace(/\W+/g, '_').replace(/^_/, '')}-${w}.jpg`;
      await page.screenshot({ path: join(out, name), type: 'jpeg', quality: 70 });
      const row = { p, w, swap, errs, ...r };
      results.push(row);
      console.log(JSON.stringify(row));
    } catch (e) { const row = { p, w, error: String(e).slice(0, 200) }; results.push(row); console.log(JSON.stringify(row)); }
    await page.close();
    await new Promise((s) => setTimeout(s, 1500));
  }
}
writeFileSync(join(out, 'shell-results.json'), JSON.stringify(results, null, 1) + '\n');
await b.close();
