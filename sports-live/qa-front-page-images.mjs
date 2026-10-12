// Browser regressions for the real image handler at actual 390/430px layout widths.
// Chromium with touch emulation; this does not claim Safari or physical-iPhone coverage.
// PLAYWRIGHT=/existing/playwright node sports-live/qa-front-page-images.mjs [output-dir]
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
const runtime = readFileSync(process.env.IMAGE_RUNTIME || new URL('./src/front-page.js', import.meta.url), 'utf8');
const handler = runtime.slice(runtime.indexOf('  function imgFallback(root) {'), runtime.indexOf('  // Owner request: omit Brenden'));
assert.ok(handler.startsWith('  function imgFallback(root) {'));
const qc = readFileSync(new URL('../automation/vision/live-qc.mjs', import.meta.url), 'utf8');
const audit = qc.slice(qc.indexOf('function audit(input){'), qc.indexOf('// The homepage and Magazine lead'));
assert.ok(audit.startsWith('function audit(input){'));
const out = process.argv[2] || 'build/front-page-image-qa';
mkdirSync(out, { recursive: true });
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNoaGgAAAMCAYEaRYa4AAAAAElFTkSuQmCC', 'base64');
const browser = await chromium.launch();
const results = [];
async function scenario(width, mode) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, screen: { width, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const requests = [];
  await page.route('**/*', async (route) => {
    const u = new URL(route.request().url()); requests.push(u.pathname);
    if (u.pathname === '/') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}.fp-frame{display:block;width:100%;height:250px}img{width:100%;height:100%;object-fit:cover}img[hidden]{display:none}</style><main id="root"></main>' });
    if (u.pathname === '/bad.jpg') return route.fulfill({ status: 404, body: '' });
    if (u.pathname === '/slow.jpg' || u.pathname === '/original.jpg') await gate;
    return route.fulfill({ contentType: 'image/png', body: png });
  });
  const row = { browser: 'Chromium touch emulation', width, mode };
  try {
    await page.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ handler, mode }) => {
      window.install = new Function('root', handler + ';imgFallback(root);');
      const lazy = mode === 'lazy';
      const source = mode === 'retry' || mode === 'failed' ? '/bad.jpg' : mode === 'cached' ? '/cached.jpg' : '/slow.jpg';
      document.querySelector('#root').innerHTML = (lazy ? '<div style="height:6000px">Scroll to story</div>' : '') + '<a class="fp-frame" href="/post/fixture"><img src="' + source + '"' + (mode === 'retry' ? ' data-fp-orig="https://www.gatorbaitmedia.com/original.jpg"' : '') + ' loading="' + (lazy ? 'lazy' : 'eager') + '" width="1000" height="667" alt="Image delivery fixture"></a>';
      if (mode !== 'cached') window.install(document.querySelector('#root'));
    }, { handler, mode });
    if (mode === 'cached') {
      await page.waitForFunction(() => document.querySelector('img').complete && document.querySelector('img').naturalWidth > 0);
      await page.evaluate(() => window.install(document.querySelector('#root')));
    }
    if (mode === 'lazy') {
      assert.equal(await page.locator('img').getAttribute('data-fp-watched'), null);
      await page.locator('.fp-frame').scrollIntoViewIfNeeded();
    }
    if (mode !== 'failed') {
      await page.waitForFunction(() => document.querySelector('img').dataset.fpWatched === '1');
      // A real wall-clock delay beyond the previous destructive timeout, with the response held.
      await page.waitForTimeout(7500);
      const pending = await page.locator('img').evaluate((i) => ({ src: i.getAttribute('src'), hidden: i.hidden, failed: i.dataset.fpFailed, complete: i.complete, width: innerWidth }));
      assert.equal(pending.width, width, 'requested viewport must be the actual layout viewport');
      assert.ok(pending.src, 'pending/cached image retains source');
      assert.equal(pending.hidden, false, 'pending/cached image remains eligible to render');
      assert.equal(pending.failed, undefined, 'pending image is not a failed image');
      release();
      await page.waitForFunction(() => document.querySelector('img').complete && document.querySelector('img').naturalWidth > 0);
      assert.equal(await page.locator('.fp-media-note').count(), 0);
      if (mode === 'retry') assert.equal(requests.filter((p) => p === '/original.jpg').length, 1);
    } else {
      await page.waitForFunction(() => document.querySelector('img').dataset.fpFailed === '1');
      assert.equal(await page.locator('.fp-media-note').textContent(), 'Photo unavailable');
      const hard = await page.evaluate(({ audit, width }) => new Function('input', audit + ';return audit(input).hard;')({ target: { name: 'home', root: '#root', expectedText: 'Photo unavailable' }, requestedWidth: width }), { audit, width });
      assert.ok(hard.some((m) => /expected story photographs missing, hidden or unloaded/.test(m)), 'live QC must reject a hidden failed story photo');
      // A subsequently valid source must restore the same reserved photo box.
      await page.locator('img').evaluate((i) => { i.src = '/cached.jpg'; });
      await page.waitForFunction(() => !document.querySelector('img').hidden && document.querySelector('img').naturalWidth > 0);
      assert.equal(await page.locator('.fp-media-note').count(), 0);
    }
    row.loaded = await page.locator('img').evaluate((i) => i.complete && i.naturalWidth > 0 && !i.hidden);
    await page.screenshot({ path: `${out}/${mode}-${width}.png` });
    row.status = 'PASS';
  } catch (e) { row.status = 'FAIL'; row.error = String(e); }
  finally { release(); results.push(row); await context.close(); }
}
try { await Promise.all([390, 430].flatMap((w) => ['eager', 'lazy', 'retry', 'cached', 'failed'].map((m) => scenario(w, m)))); }
finally { await browser.close(); }
writeFileSync(`${out}/report.json`, JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
if (results.some((r) => r.status !== 'PASS')) process.exitCode = 1;
