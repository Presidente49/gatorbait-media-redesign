#!/usr/bin/env node
// Render check for the Georgia postgame magazine bundle (sports-live/magazine-georgia-postgame.js), served in place of the
// jsDelivr pin inside the real loader fixture. Photos are stood in (the container cannot reach Wix media).
// Checks at 320/390/430/1366: one #gbm-magazine-page.pm, exactly one h1, no horizontal overflow, every section the issue defines is
// present, every link site-relative or on the small allow-list, no "[[" or "-1" left on the page, no Gator Country, no betting terms,
// all images loaded, no page errors. Use --allow-placeholders ONLY for the skeleton smoke test.
// Usage: node deploy/postgame-georgia-20261031/qa-georgia-postgame.mjs [outdir] [--allow-placeholders]
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const args = process.argv.slice(2), allow = args.includes('--allow-placeholders'), out = args.find((a) => !a.startsWith('--')) || '/tmp/georgia-postgame-shots';
mkdirSync(out, { recursive: true });
const bundle = readFileSync('sports-live/magazine-georgia-postgame.js', 'utf8');
const frame = readFileSync('sports-live/magazine-georgia-postgame-frame.html', 'utf8');
const ISSUE = JSON.parse(readFileSync('sports-live/magazine-issue-georgia-postgame.json', 'utf8'));
const SEC = { damage: '#pm-damage', scoring: '#pm-scoring', box: '#pm-box', flow: '#pm-flow', quotes: '#pm-quotes', watch: '#pm-watch', columns: '#pm-columns', coverage: '#pm-coverage', download: '#pm-download', next: '#pm-next' };
const SECTIONS = ['.pm-entrance', '#pm-cover', '.pm-final', '.pm-toc', '.pm-foot'].concat(Object.entries(SEC).filter(([k]) => ISSUE[k]).map(([, s]) => s));
const stand = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#16328f"/></svg>`;
const browser = await chromium.launch(); const results = [];
for (const [name, width, height] of [['320', 320, 720], ['390', 390, 844], ['430', 430, 932], ['1366', 1366, 900]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' }); const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine' || u === 'https://qa.local/') return route.fulfill({ contentType: 'text/html', body: frame });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine-georgia-postgame\.js/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: bundle });
    const m = /static\.wixstatic\.com\/media\/[0-9a-f]+_[0-9a-f]{32}~mv2\.[a-z]+\/v1\/fit\/w_(\d+),h_(\d+)/.exec(u);
    if (m) return route.fulfill({ contentType: 'image/svg+xml', body: stand(+m[1], +m[2]) });
    if (/^data:|^about:/.test(u)) return route.continue();
    return route.abort();
  });
  await page.goto('https://qa.local/magazine', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-magazine-page.pm', { timeout: 8000 });
  await page.waitForTimeout(500);
  const info = await page.evaluate((SECTIONS) => {
    const root = document.getElementById('gbm-magazine-page'), doc = document.documentElement, t = root.innerText;
    return {
      roots: document.querySelectorAll('#gbm-magazine-page.pm').length, issue: root.getAttribute('data-issue'), h1: root.querySelectorAll('h1').length,
      overflow: doc.scrollWidth > doc.clientWidth + 1, missing: SECTIONS.filter((s) => !root.querySelector(s)),
      badLinks: [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !/^(\/|#pm-|https:\/\/(www\.gatorbaitmedia\.com|floridagators\.com|www\.youtube\.com\/watch\?v=[\w-]{11}|18fb3a4e-d7f6-414a-aeb9-3047db3ea115\.usrfiles\.com\/ugd\/[\w.]+\.pdf))/.test(h)),
      leftover: /\[\[|(^|\s)-1(\s|$)/.test(t), gatorCountry: /gator\s*country/i.test(t), betting: /\b(spread|moneyline|over\/under|odds|sportsbook|parlay)\b/i.test(t),
      imgsTotal: root.querySelectorAll('img').length, imgsBroken: [...root.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length
    };
  }, SECTIONS);
  results.push({ name, ...info, errors }); await page.screenshot({ path: `${out}/georgia-postgame-${name}.png`, fullPage: true }); await ctx.close();
}
await browser.close(); console.log(JSON.stringify(results, null, 1));
const bad = results.filter((r) => r.roots !== 1 || r.h1 !== 1 || r.overflow || r.missing.length || r.badLinks.length || r.errors.length || r.gatorCountry || r.betting || (!allow && (r.leftover || r.imgsBroken)));
if (bad.length) { console.error('FAIL at', bad.map((b) => b.name).join(', ')); process.exit(1); }
console.log(allow ? 'Skeleton smoke render passed (placeholders allowed).' : 'Georgia postgame render QA passed at 320/390/430/1366.');
