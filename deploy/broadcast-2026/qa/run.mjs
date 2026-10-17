// Broadcast S4 QA: real production pages, candidate embeds swapped in (or live with --live).
// node qa/run.mjs [--live] [--widths 320,390,430,1366] [--out dir] [paths...]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCandidates, routeCandidates } from './inject.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const args = process.argv.slice(2);
const live = args.includes('--live');
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const widths = opt('--widths', '320,390,430,1366').split(',').map(Number);
const out = opt('--out', join('/tmp/claude-0/s4/qa', live ? 'live' : 'cand'));
const bust = opt('--bust', String(Date.now()));
const paths = args.filter((a) => !a.startsWith('--'));
const PATHS = paths.length ? paths : ['/about', '/pricing-plans', '/contact', '/policies', '/the-buddy-martin-show', '/groups', '/account/my-account', '/profile/franz/profile', '/search', '/tags', '/gatorbait-media-blogs', '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play', '/'];
const CAND = {
  '7fee4de6': ['7fee4de6/rev36.html', '7fee4de6/rev37.html'],
  'c66d5b7f': ['c66d5b7f/rev8.html', 'c66d5b7f/rev9.html'],
  'a13b04e3': ['a13b04e3/rev5.html', 'a13b04e3/rev6.html'],
  '82c4ca83': ['82c4ca83/rev37.html', '82c4ca83/rev38.html'],
  '360c9265': ['360c9265/rev4.html', '360c9265/rev5.html'],
};
mkdirSync(out, { recursive: true });

// Runs in the page: shell checks.
function audit() {
  const W = innerWidth, doc = document.documentElement, r = { w: W };
  r.hscroll = doc.scrollWidth - W;
  const wide = [];
  document.querySelectorAll('body *').forEach((e) => { const b = e.getBoundingClientRect(); if (b.width && b.right > W + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.sh-track,[aria-hidden=true]')) wide.push((e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + [...e.classList].slice(0, 2).join('.')) + ':' + Math.round(b.right)); });
  r.wide = wide.slice(0, 6);
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [R, G, B] = m.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return [0.2126 * R + 0.7152 * G + 0.0722 * B, m[3] === undefined ? 1 : +m[3]]; };
  const bgOf = (e) => { for (let n = e; n; n = n.parentElement) { const s = getComputedStyle(n); const l = lum(s.backgroundColor); if (l && l[1] > 0.5) return l[0]; if (s.backgroundImage !== 'none') return null; } return 1; };
  const scope = '#gbm-site-header,#gbm-mobile-shell,#gbm-band,#gbm-footer,#gbm-media-hub,.gbm-football-tools,[data-hook=plan],#comp-lii7mqe42';
  const fails = [], fonts = new Set(), taps = [];
  document.querySelectorAll(scope).forEach((S) => S.querySelectorAll('*').forEach((e) => {
    if (e.closest('[aria-hidden=true]')) return;
    const s = getComputedStyle(e), b = e.getBoundingClientRect();
    if (!b.width || s.visibility === 'hidden' || s.display === 'none') return;
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (own) {
      fonts.add(s.fontFamily.split(',')[0].replace(/"/g, ''));
      const fg = lum(s.color), bg = bgOf(e);
      if (fg && bg != null) { const c = (Math.max(fg[0], bg) + 0.05) / (Math.min(fg[0], bg) + 0.05), px = parseFloat(s.fontSize), large = px >= 24 || (px >= 18.66 && +s.fontWeight >= 700); if (c < (large ? 3 : 4.5)) fails.push(`${e.textContent.trim().slice(0, 24)}|${c.toFixed(2)}|${px}`); }
    }
    if (e.matches('a,button') && b.top >= 0 && (b.height < 44 && b.width < 44 || b.height < 24)) taps.push(`${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 20)}:${Math.round(b.width)}x${Math.round(b.height)}`);
  }));
  r.fonts = [...fonts]; r.contrast = fails.slice(0, 8); r.nContrast = fails.length; r.taps = taps.slice(0, 8); r.nTaps = taps.length;
  const h = document.getElementById('gbm-site-header');
  r.header = !!h; r.nav = h ? [...h.querySelectorAll('nav a')].map((a) => a.getAttribute('href') + (a.hasAttribute('aria-current') ? '*' : '')) : [];
  r.util = h ? [...h.querySelectorAll('.sh-util a,.sh-cta')].map((a) => a.textContent.trim().slice(0, 12)) : [];
  r.ticker = h ? h.querySelectorAll('.sh-run a:not([aria-hidden])').length : 0;
  r.band = (document.querySelector('#gbm-band p') || {}).textContent || '';
  r.bc = doc.classList.contains('gbm-bc');
  r.order = [...document.body.children].slice(0, 4).map((e) => e.id || e.tagName);
  return r;
}

const b = await chromium.launch();
const UA_DESK = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const UA_PHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const desk = await b.newContext({ userAgent: UA_DESK });
const phone = await b.newContext({ userAgent: UA_PHONE, isMobile: true, hasTouch: true, deviceScaleFactor: 2, viewport: { width: 390, height: 844 } });
const cands = live ? null : loadCandidates(Object.fromEntries(Object.entries(CAND).filter(([, [, n]]) => existsSync(join(root, n))).map(([k, [o, n]]) => [k, [join(root, o), join(root, n)]])));
const results = [];
for (const p of PATHS) {
  for (const w of widths) {
    const page = await (w < 821 ? phone : desk).newPage();
    await page.setViewportSize({ width: w, height: w < 800 ? 844 : 900 });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
    let swap = {};
    if (cands) await routeCandidates(page, cands, (u, rep) => { swap = rep; });
    const url = 'https://www.gatorbaitmedia.com' + p + (p.includes('?') ? '&' : '?') + 's4qa=' + bust;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(4500);
      const blocked = await page.evaluate(() => /Checking your request|verify your request/i.test(document.body.innerText.slice(0, 400)));
      const r = blocked ? { blocked: true } : await page.evaluate(audit);
      if (!blocked && w < 821 && p !== '/') {
        const t = await page.$('#gbm-mobile-menu-toggle');
        if (t) { await t.tap(); await page.waitForTimeout(500); r.menu = await page.evaluate(() => [...document.querySelectorAll('#gbm-mobile-drawer-root .gbm-ms-nav a')].filter((a) => a.offsetParent).map((a) => a.textContent.trim().slice(0, 14))); }
        const name = `${p.replace(/\W+/g, '_') || 'home'}-${w}-menu.png`;
        await page.screenshot({ path: join(out, name) });
        await page.keyboard.press('Escape');
      }
      const name = `${p.replace(/\W+/g, '_') || 'home'}-${w}.png`;
      await page.screenshot({ path: join(out, name), fullPage: false });
      results.push({ p, w, swap, errs, ...r });
      console.log(JSON.stringify({ p, w, ...r, swap, errs }));
    } catch (e) { console.log(JSON.stringify({ p, w, error: String(e).slice(0, 200) })); results.push({ p, w, error: String(e) }); }
    await page.close();
    await new Promise((s) => setTimeout(s, 1500));
  }
}
writeFileSync(join(out, 'results.json'), JSON.stringify(results, null, 1));
await b.close();
