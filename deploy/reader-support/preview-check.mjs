// Isolated preview checks. No production route or payment endpoint is contacted.
import { chromium } from 'playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const output = 'build/reader-support';
await mkdir(output, { recursive: true });
const html = await readFile('support/standalone.html', 'utf8');
const header = await readFile('deploy/reader-support/header-link.js', 'utf8');
const results = [];
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    const requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => requests.push(request.url()));
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow at ${width}`);
    assert.equal(await page.locator('.gb-checkout').isDisabled(), true);
    const cta = await page.locator('.gb-support-button').boundingBox();
    assert.ok(cta.height >= 44 && cta.width >= 44);
    if (width < 981) {
      const menu = page.locator('.gb-menu-toggle');
      const box = await menu.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      assert.equal(await menu.evaluate(node => node === document.activeElement), true);
    }
    await page.locator('[data-amount="100"]').click();
    assert.match(await page.locator('#gb-benefit').getAttribute('class'), /gb-benefit-active/);
    await page.locator('[data-amount="other"]').click();
    await page.locator('#gb-amount-input').fill('99.99');
    assert.doesNotMatch(await page.locator('#gb-benefit').getAttribute('class'), /gb-benefit-active/);
    await page.locator('#gb-amount-input').fill('100.01');
    assert.match(await page.locator('#gb-benefit').getAttribute('class'), /gb-benefit-active/);
    await page.locator('#gb-amount-input').fill('10001');
    assert.equal(await page.locator('#gb-amount-input').getAttribute('aria-invalid'), 'true');
    await page.locator('[data-amount="25"]').click();
    await page.locator('#gb-current-member').check();
    assert.equal(await page.locator('#gb-member-note').isVisible(), true);
    await page.locator('#gb-current-member').uncheck();
    assert.equal(await page.locator('.gb-checkout').isDisabled(), true);
    await page.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
    await page.screenshot({ path: `${output}/preview-${width}.png`, fullPage: true });
    assert.deepEqual(errors, []);
    assert.deepEqual(requests.filter(url => /^https?:/.test(url)), []);
    results.push({ width, overflow: false, checkoutDisabled: true, errors, externalRequests: 0 });
    await page.close();
  }
  // Exercise guard and duplicate protection against a synthetic same-origin header.
  const fixture = '<header id="gbm-site-header"><div class="sh-brand"><a class="sh-join">Join</a></div></header><div id="gbm-mobile-shell"><button class="gbm-ms-trigger">Menu</button></div>';
  const page = await browser.newPage();
  await page.route('https://preview.test/**', route => route.fulfill({ contentType: 'text/html', body: fixture }));
  await page.goto('https://preview.test/');
  await page.addScriptTag({ content: header });
  assert.equal(await page.locator('.gbm-reader-support-link').count(), 0);
  await page.evaluate(() => { window.GBM_READER_SUPPORT = { enabled: true, approvalReference: 'TEST-ONLY', fulfillmentVerified: true, supportUrl: 'https://elsewhere.test/support' }; });
  await page.addScriptTag({ content: header });
  assert.equal(await page.locator('.gbm-reader-support-link').count(), 0);
  await page.evaluate(() => { window.GBM_READER_SUPPORT.supportUrl = '/support'; });
  await page.addScriptTag({ content: header });
  await page.locator('.gbm-reader-support-link').first().waitFor();
  await page.addScriptTag({ content: header });
  assert.equal(await page.locator('.gbm-reader-support-link').count(), 2);
  assert.equal(await page.locator('.sh-join').count(), 1);
  assert.equal(await page.locator('.gbm-ms-trigger').count(), 1);
  await writeFile(`${output}/checks.json`, JSON.stringify({ results, headerGuardAndDeduplication: 'passed', scope: 'isolated preview only; live Wix and fulfillment untested' }, null, 2));
} finally {
  await browser.close();
}
