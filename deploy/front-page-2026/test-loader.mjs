#!/usr/bin/env node
// Exercises a Home Code V3 loader in a real browser against a mocked Wix page:
// pointer honoured, pointer missing, pointer malformed, pointer slow, pointed build failing to download.
// Usage: NODE_PATH=<dir with playwright> node deploy/front-page-2026/test-loader.mjs deploy/front-page-2026/home-code-loader-<sha7>.html
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const loader = readFileSync(process.argv[2], 'utf8');
const homepage = readFileSync(join(repo, 'sports-live/homepage.js'), 'utf8');
const feed = JSON.parse(readFileSync(join(repo, 'gazette-live/posts.json'), 'utf8'));
const sb = JSON.parse(readFileSync(join(repo, 'sports-live/scoreboard.json'), 'utf8'));
const DEFAULT = (loader.match(/var d='([0-9a-f]{40})'/) || [])[1];
if (!DEFAULT) { console.error('not a V3 loader (no baked commit)'); process.exit(1); }
const OTHER = 'f'.repeat(40), BAD = 'e'.repeat(40);
const x = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rss = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${feed.posts.map((p) =>
  `<item><title>${x(p.title)}</title><link>${x(p.url)}</link><description>${x(p.excerpt)}</description><dc:creator>${x(p.author)}</dc:creator><pubDate>${new Date(p.firstPublishedDate).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;
const pageHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="gbm-mobile-shell-host"></div>${loader}<script>window.__GBM_HOME_JS__();</script></body></html>`;
const cases = [
  { name: 'pointer honoured', pointer: { commit: OTHER }, expect: OTHER },
  { name: 'pointer missing (404)', pointer: null, expect: DEFAULT },
  { name: 'pointer malformed', pointer: { commit: 'not-a-sha' }, expect: DEFAULT },
  { name: 'pointer slow (2 s)', pointer: { commit: OTHER }, delay: 2000, expect: DEFAULT },
  { name: 'pointed build fails to download', pointer: { commit: BAD }, expect: DEFAULT },
];
const browser = await chromium.launch();
let failed = 0;
for (const c of cases) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await ctx.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/') return route.fulfill({ contentType: 'text/html', body: pageHtml });
    if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/current.json')) {
      const send = () => c.pointer ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(c.pointer) }) : route.fulfill({ status: 404, body: '' });
      if (c.delay) setTimeout(send, c.delay); else send(); return;
    }
    if (u.hostname === 'cdn.jsdelivr.net') {
      const m = u.pathname.match(/@([0-9a-f]{40})\/sports-live\/homepage\.js$/);
      if (m && m[1] !== BAD) return route.fulfill({ contentType: 'application/javascript', body: homepage });
      return route.fulfill({ status: 404, body: '' });
    }
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/blog-feed.xml') return route.fulfill({ contentType: 'application/rss+xml', body: rss });
    if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/gazette-live/posts.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(feed) });
    if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/scoreboard.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(sb) });
    return route.abort();
  });
  const t0 = Date.now();
  await page.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-live.fp26', { timeout: 9000 }).catch(() => {});
  const r = await page.evaluate(() => ({ mounted: !!document.querySelector('#gbm-live.fp26'), commit: document.querySelector('#gbm-fp26-bundle')?.getAttribute('data-commit') || null, bundles: document.querySelectorAll('#gbm-fp26-bundle').length }));
  const ok = r.mounted && r.commit === c.expect && r.bundles === 1 && !errors.length;
  if (!ok) failed++;
  console.log((ok ? 'ok   ' : 'FAIL ') + c.name.padEnd(34) + ` mounted=${r.mounted} commit=${(r.commit || '').slice(0, 7)} expect=${c.expect.slice(0, 7)} bundles=${r.bundles} ${Date.now() - t0}ms ${errors.join(' | ')}`);
  await ctx.close();
}
await browser.close();
if (failed) { console.error(failed + ' loader checks failed'); process.exit(1); }
console.log('All loader checks passed.');
