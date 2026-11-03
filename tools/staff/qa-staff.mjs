#!/usr/bin/env node
// QA for the staff/About module. Usage:
//   node tools/staff/qa-staff.mjs local <outdir> [path]   -> loads the LIVE page, injects the loader and serves the local bundle for the jsDelivr URL
//   node tools/staff/qa-staff.mjs live  <outdir> [path]   -> loads the live page as a visitor (after the embed is live)
// Env PLAYWRIGHT=/path/to/playwright. Retries Cloudflare/proxy fallbacks. Reports CLS, overflow, structure and screenshots.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright');
const [mode = 'local', out = '.', path = '/about'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const bundle = fs.readFileSync('sports-live/staff-widget.js', 'utf8');
const loader = fs.readFileSync('deploy/staff-20261103/loader.template.html', 'utf8').replace(/<!--[\s\S]*?-->/, '').replace(/<\/?script[^>]*>/g, '').replace(/__SHA__/g, 'localtest');
const browser = await chromium.launch();
const fails = [];
for (const width of [390, 430, 1366, 1920]) {
  let ok = false;
  for (let attempt = 0; attempt < 5 && !ok; attempt++) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    if (mode === 'local') {
      await page.route('**/cdn.jsdelivr.net/gh/**/staff-widget.js', (r) => r.fulfill({ contentType: 'application/javascript', body: bundle }));
      await page.addInitScript(`document.addEventListener('DOMContentLoaded',function(){var s=document.createElement('script');s.textContent=${JSON.stringify(loader)};document.head.appendChild(s)});`);
    }
    // __cls = whole page (the existing About page already shifts on its own rich text); __ours = shifts that involve our module or the footer it sits above.
    await page.addInitScript(() => { window.__cls = 0; window.__ours = 0; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; if (e.sources.some((s) => s.node && s.node.nodeType === 1 && (s.node.closest('#gbm-team') || s.node.closest('#gbm-footer')))) window.__ours += e.value; } }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { } });
    try {
      await page.goto('https://www.gatorbaitmedia.com' + path + '?cb=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(7000);
      const t = await page.evaluate(() => document.body.innerText);
      if (/Just a moment/i.test(t)) { await ctx.close(); continue; }
      const r = await page.evaluate(() => {
        const el = document.getElementById('gbm-team'), d = document.documentElement;
        if (!el) return { mounted: false };
        const cards = [...el.querySelectorAll('.t-card')];
        const links = [...el.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
        const ff = getComputedStyle(el).fontFamily;
        const bad = [...el.querySelectorAll('img')].filter((i) => !i.complete || !i.naturalWidth).length;
        const ld = document.getElementById('gbm-team-ld');
        const r = el.getBoundingClientRect();
        return { mounted: true, mode: el.dataset.mode, build: el.dataset.build, cards: cards.length, stories: el.querySelectorAll('.t-list a').length, links: links.length, ff: ff.slice(0, 40), badImgs: bad, ld: ld ? JSON.parse(ld.textContent)['@graph'].length : 0,
          overflow: d.scrollWidth > d.clientWidth + 1, top: Math.round(r.top + scrollY), h: Math.round(r.height), cls: +window.__cls.toFixed(4), ours: +window.__ours.toFixed(4), docH: d.scrollHeight,
          cardH: cards.map((c) => Math.round(c.getBoundingClientRect().height)), z: getComputedStyle(el).zIndex, existingAbout: /EDITOR-IN-CHIEF/i.test(document.body.innerText) };
      });
      console.log(width, JSON.stringify(r));
      if (!r.mounted) { await ctx.close(); continue; }
      ok = true;
      if (r.overflow) fails.push(width + ' overflow');
      if (r.ours >= 0.01) fails.push(width + ' CLS from our module ' + r.ours);
      if (r.cards !== 8) fails.push(width + ' cards ' + r.cards);
      if (r.badImgs) fails.push(width + ' broken images');
      await page.evaluate(() => document.getElementById('gbm-team').scrollIntoView());
      await page.waitForTimeout(600);
      const box = await page.evaluate(() => { const r = document.getElementById('gbm-team').getBoundingClientRect(); return { y: Math.round(r.top + scrollY), h: Math.round(r.height) }; });
      await page.screenshot({ path: `${out}/staff-${width}-top.png` });
      await page.screenshot({ path: `${out}/staff-${width}-full.png`, fullPage: true });
      await page.evaluate((b) => window.scrollTo(0, b.y + b.h / 2), box);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}/staff-${width}-mid.png` });
    } catch (e) { console.log(width, 'attempt', attempt, 'error', e.message.slice(0, 80)); }
    await ctx.close();
  }
  if (!ok) fails.push(width + ' never mounted');
}
await browser.close();
if (fails.length) { console.log('FAIL', fails); process.exit(1); }
console.log('PASS');
