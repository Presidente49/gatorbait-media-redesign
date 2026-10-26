// Real Chromium, deterministic clock, all requests local/mock. Never submits to Wix.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const source = readFileSync(new URL('../../sports-live/src/capture.js', import.meta.url), 'utf8');
const candidate = readFileSync(new URL('./capture-candidate.js', import.meta.url), 'utf8');
const legacyShare = readFileSync(new URL('../../sports-live/share.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../../sports-live/src/front-page.css', import.meta.url), 'utf8');
const headerBaseline = JSON.parse(readFileSync(new URL('./header-baseline.fixture.json', import.meta.url), 'utf8'));
const baseStyles = JSON.parse(readFileSync(new URL('../homepage-story-rhythm-20261021/fixtures/base-styles.json', import.meta.url), 'utf8')).embedData.html.match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
const skin = readFileSync(new URL('../../sports-live/broadcast-home-color.js', import.meta.url), 'utf8');
const skinContext = {};
vm.runInNewContext(skin.slice(skin.indexOf('var R='), skin.indexOf('function css()')), skinContext);
const currentSkinCss = skinContext.C.replace(/@ /g, skinContext.R + ' ').replace(/@\{/g, skinContext.R + '{').replace(/@\)/g, skinContext.R + ')');
const proof = process.env.CAPTURE_PROOF_DIR;
if (proof) mkdirSync(proof, { recursive: true });
const receipts = [];
const browser = await chromium.launch({ headless: true });
test.after(async () => { await browser.close(); if (proof) writeFileSync(proof + '/checks.json', JSON.stringify(receipts, null, 2)); });

function fixture(legacy) {
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:Barlow;font-weight:400;src:url(/_qa/Barlow-400.woff2)}@font-face{font-family:Barlow;font-weight:700;src:url(/_qa/Barlow-700.woff2)}' + css +
    'body{margin:0}main{padding:20px}#form-host{max-width:560px;margin:auto}#read{height:2500px}' +
    // Existing native article card override: candidate must actually beat it.
    'html body #SITE_PAGES [data-hook=post-page] .gbc{background:#0021a5!important}html body #SITE_PAGES [data-hook=post-page] .gbc .gbc-h{color:#fff!important}</style></head><body>' +
    '<div id="gbm-live" class="fp26 fp-day"><nav class="fp-nav"><div class="fp-wrap"><div class="fp-links">' +
    '<a href="/">Latest</a><a href="/magazine">Magazine</a><a href="/the-buddy-martin-show">TV &amp; Podcasts</a>' +
    '<a class="fp-nav-extra" href="#read">Our writers</a><a class="fp-nav-extra" href="#read">Schedule</a><a class="fp-nav-extra" href="#read">Store</a></div>' +
    '<a class="fp-mobile-join" href="/pricing-plans">Join</a><span class="fp-nav-identity">Independent Florida coverage since 1979</span></div></nav>' +
    '<main><h1>GatorBait reporting</h1><div id="form-host"></div><div id="read">A long public editorial page.</div></main></div>' +
    (legacy ? '<script src="/_qa/legacy.js"></script>' : '') + '<script src="/_qa/capture.js"></script></body></html>';
}
function currentFixture() {
  const headerRules = headerBaseline.stylesInObservedDomOrder.map(style => '<style>' + style.relevantCSS + '</style>').join('');
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>@font-face{font-family:Barlow;font-weight:400;src:url(/_qa/Barlow-400.woff2)}@font-face{font-family:Barlow;font-weight:700;src:url(/_qa/Barlow-700.woff2)}@font-face{font-family:Barlow;font-weight:800;src:url(/_qa/Barlow-800.woff2)}' + baseStyles + currentSkinCss + '</style>' + headerRules +
    '<style>#read{height:2500px}#form-host{max-width:560px;margin:auto}</style></head><body>' + headerBaseline.headerOuterHTML +
    '<div id="gbm-live" class="gbm-gazette gbm-sports-home bc-fresh-news bc-story-rhythm"><header class="sh-header"><div class="sh-brand">' +
    '<a href="/" aria-label="GatorBait Media home"><span class="bc-wm">Gator<b>Bait</b><small>Media</small></span></a><a class="sh-join" href="/pricing-plans">Join GatorBait →</a></div>' +
    '<nav aria-label="GatorBait sections"><a href="/" aria-current="page">Front Page</a><a href="/gatorbait-media-blogs">Latest</a><a href="/magazine">Magazine</a>' +
    '<a href="/the-buddy-martin-show">GatorBait TV</a><a href="/the-buddy-martin-show#podcasts">Podcasts</a><a href="/gatorbait-media-blogs#gbm-lp-search">Search</a>' +
    '<a href="https://gatorbait2026.itemorder.com/shop/home/">Store</a><a href="/account/my-account">Sign in</a></nav></header>' +
    '<main id="sh-main"><h1>GatorBait reporting</h1><div id="form-host"></div><div id="read">A long public editorial page.</div></main></div>' +
    '<script>window.__headerBefore={top:document.getElementById("gbm-live").getBoundingClientRect().top,controls:[...document.querySelectorAll("#gbm-mobile-shell > *")].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,html:e.outerHTML}))};</script>' +
    '<script src="/_qa/capture.js"></script></body></html>';
}
async function setup({ path = '/', width = 390, storage = {}, legacy = false, sourceMode = false, current = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage(), requests = [];
  await page.clock.install({ time: new Date('2026-10-26T12:00:00Z') });
  await page.addInitScript(({ storage, legacy }) => {
    Object.entries(storage).forEach(([k, v]) => localStorage.setItem(k, v));
    window.dataLayer = [];
  }, { storage, legacy });
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'www.gatorbaitmedia.com' && url.pathname === '/_qa/capture.js') return route.fulfill({ contentType: 'application/javascript', body: sourceMode ? source : candidate });
    if (url.hostname === 'www.gatorbaitmedia.com' && url.pathname === '/_qa/legacy.js') return route.fulfill({ contentType: 'application/javascript', body: legacyShare });
    if (/^\/_qa\/Barlow-(400|700|800)\.woff2$/.test(url.pathname)) return route.fulfill({ contentType: 'font/woff2', body: readFileSync(new URL('../../assets/weather/' + url.pathname.split('/').pop(), import.meta.url)) });
    if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: current ? currentFixture() : fixture(legacy) });
    if (url.hostname === 'www.wixapis.com') {
      requests.push({ path: url.pathname, body: JSON.parse(route.request().postData() || '{}') });
      if (url.pathname === '/oauth2/token') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ access_token: 'qa-only-visitor', expires_in: 14400 }) });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ submission: { status: 'CONFIRMED', id: 'mock-only' } }) });
    }
    return route.abort();
  });
  await page.goto('https://www.gatorbaitmedia.com' + path);
  await page.clock.runFor(50);
  return { page, requests, close: () => context.close() };
}
async function engage(page) { await page.evaluate(() => dispatchEvent(new Event('scroll'))); await page.clock.runFor(50); }
async function promptVisible(page) {
  return page.evaluate(() => {
    const el = document.querySelector('#gbc-bar.on:not(.aside) .gbc-prompt');
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return getComputedStyle(el).visibility !== 'hidden' && rect.top >= 0 && rect.bottom <= innerHeight && rect.width > 0;
  });
}
async function card(page, source = 'home') { await page.evaluate(source => { document.getElementById('form-host').innerHTML = GBM_CAPTURE.html(source); }, source); }

test('55 visible seconds AND engagement, no immediate 50% scroll trigger; all public editorial routes', async () => {
  for (const path of ['/', '/magazine', '/post/current-story']) {
    const { page, requests, close } = await setup({ path });
    try {
      await page.clock.runFor(54000); await engage(page);
      assert.equal(await promptVisible(page), false);
      await page.clock.runFor(1500);
      assert.equal(await promptVisible(page), true, path);
      assert.equal(await page.locator('#gbc-bar').count(), 1);
      assert.equal(await page.locator('#gbc-bar input').count(), 0, 'compact invitation is not a first-load signup wall');
      assert.equal(await page.locator('#gbc-bar a').getAttribute('href'), 'https://buddymartinshow.wixforms.com/f/7517931185469654016');
      assert.equal(requests.length, 0);
      receipts.push({ check: 'delayed-engaged-editorial-route', path, pass: true });
    } finally { await close(); }
  }
});

test('time alone, hidden-tab time and account/payment routes do not trigger invitations', async () => {
  for (const path of ['/', '/account/my-account', '/account/my-subscriptions', '/pricing-plans', '/checkout', '/members']) {
    const { page, requests, close } = await setup({ path });
    try {
      await page.clock.runFor(60000);
      assert.equal(await promptVisible(page), false);
      if (path !== '/') { await engage(page); assert.equal(await promptVisible(page), false); }
      else {
        await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
        const elapsed = await page.evaluate(() => GBM_CAPTURE.state().elapsedMs);
        await page.clock.runFor(60000);
        assert.equal(await page.evaluate(() => GBM_CAPTURE.state().elapsedMs), elapsed);
      }
      assert.equal(requests.length, 0);
    } finally { await close(); }
  }
});

test('44px close and Escape, 14-day frequency cap, SPA cleanup and unavailable storage', async () => {
  const { page, close } = await setup();
  try {
    await engage(page); await page.clock.runFor(56000);
    const rect = await page.locator('#gbc-bar .gbc-x').boundingBox();
    assert.ok(rect.width >= 44 && rect.height >= 44);
    await page.locator('#gbc-bar a').focus();
    await page.keyboard.press('Escape');
    assert.equal(await promptVisible(page), false);
    assert.equal(await page.evaluate(() => document.activeElement === document.body), true, 'dismissed prompt cannot retain keyboard focus');
    assert.equal(await page.evaluate(() => GBM_CAPTURE.state().quiet), true);
    await page.reload(); await page.clock.runFor(50); await engage(page); await page.clock.runFor(56000);
    assert.equal(await promptVisible(page), false, 'frequency cap survives actual reload');
  } finally { await close(); }
});

test('dismissal survives reload, expires after14days, and SPA prevents duplicate prompts', async () => {
  for (const age of [1, 15]) {
    const stamp = String(Date.parse('2026-10-26T12:00:00Z') - age * 86400000);
    const { page, close } = await setup({ storage: { 'gbm-capture-dismissed': stamp } });
    try {
      await engage(page); await page.clock.runFor(56000);
      assert.equal(await promptVisible(page), age > 14);
      await page.evaluate(() => { history.pushState({}, '', '/account/my-account'); dispatchEvent(new Event('gbmroutechange')); });
      assert.equal(await page.locator('#gbc-bar').count(), 0);
      await page.evaluate(() => { history.pushState({}, '', '/post/next-story'); dispatchEvent(new PopStateEvent('popstate')); });
      await engage(page); await page.clock.runFor(56000);
      assert.equal(await promptVisible(page), false);
    } finally { await close(); }
  }
  const { page, close } = await setup();
  try {
    await page.evaluate(() => { Storage.prototype.setItem = function () { throw Error('unavailable'); }; Storage.prototype.getItem = function () { throw Error('unavailable'); }; });
    await engage(page); await page.clock.runFor(56000);
    assert.equal(await promptVisible(page), true);
    await page.locator('.gbc-x').click();
    await page.evaluate(() => { history.pushState({}, '', '/magazine'); dispatchEvent(new Event('gbmroutechange')); });
    await engage(page); await page.clock.runFor(56000);
    assert.equal(await promptVisible(page), false, 'in-memory single prompt survives storage denial');
  } finally { await close(); }
});

test('share, native cookie/dialog, form visibility/focus and hidden tab suppress without competing', async () => {
  const { page, close } = await setup();
  try {
    await engage(page);
    await page.evaluate(() => { const el = document.createElement('section'); el.id = 'cookie-banner'; el.textContent = 'Cookie choices'; document.body.prepend(el); });
    await page.clock.runFor(56000);
    assert.equal(await promptVisible(page), false);
    await page.evaluate(() => document.getElementById('cookie-banner').remove()); await page.clock.runFor(200);
    assert.equal(await promptVisible(page), true);
    await page.evaluate(() => { const el = document.createElement('aside'); el.id = 'gbm-share'; el.className = 'on'; el.textContent = 'Share'; document.body.prepend(el); });
    await page.clock.runFor(200); assert.equal(await promptVisible(page), false);
    await page.evaluate(() => document.getElementById('gbm-share').remove()); await page.clock.runFor(200); assert.equal(await promptVisible(page), true);
    await page.evaluate(() => { const el = document.createElement('input'); el.id = 'other-form'; document.body.prepend(el); el.focus(); });
    await page.clock.runFor(200); assert.equal(await promptVisible(page), false);
    await page.evaluate(() => document.getElementById('other-form').remove()); await page.clock.runFor(200); assert.equal(await promptVisible(page), true);
    await page.evaluate(() => { const el = document.createElement('section'); el.setAttribute('role', 'dialog'); el.textContent = 'Native account dialog'; document.body.prepend(el); });
    await page.clock.runFor(200); assert.equal(await promptVisible(page), false);
  } finally { await close(); }
});

test('form contract preserved: unchecked explicit consent, mock-only acceptance remains pending, legacy marker never confirmed', async () => {
  const { page, requests, close } = await setup({ sourceMode: true });
  try {
    await card(page);
    assert.equal(await page.locator('input[name=consent]').isChecked(), false);
    await page.locator('input[type=email]').fill('reader@example.com');
    await page.locator('.gbc-b').click();
    assert.equal(requests.length, 0);
    assert.match(await page.locator('.gbc-m').textContent(), /Check the box/);
    await page.locator('input[name=consent]').check(); await page.locator('.gbc-b').click();
    await page.waitForFunction(() => document.querySelector('.gbc').getAttribute('data-state') === 'pending');
    const state = await page.evaluate(() => GBM_CAPTURE.state());
    assert.equal(state.pending, true); assert.equal(state.confirmation, 'unknown');
    assert.match(await page.locator('.gbc-m').textContent(), /pending until you confirm/);
    assert.equal(await page.evaluate(() => localStorage.getItem('gbm-capture-joined')), null);
    assert.equal(requests.length, 2);
    assert.equal(requests[0].body.clientId, '1565816d-bbbc-45c1-b82a-31f10d3e2c71');
    assert.equal(requests[1].body.submission.formId, '6babfee8-147f-428a-9e14-6b72f6225835');
    assert.equal(requests[1].body.submission.submissions.subscribe_gatorbait, true);
    assert.equal(requests[1].body.submission.submissions.email_gatorbait, 'reader@example.com');
    receipts.push({ check: 'mock-only-submission-pending', pass: true, liveRequests: 0, confirmed: 'unknown' });
  } finally { await close(); }
  const legacy = await setup({ storage: { 'gbm-capture-joined': '1' } });
  try {
    await card(legacy.page);
    assert.match(await legacy.page.locator('.gbc').textContent(), /cannot verify confirmation/);
    assert.equal(await legacy.page.locator('.gbc').getAttribute('data-state'), 'pending');
    await engage(legacy.page); await legacy.page.clock.runFor(56000);
    assert.equal(await promptVisible(legacy.page), false);
  } finally { await legacy.close(); }
});

test('a collision before first paint does not record shown or consume14-day frequency', async () => {
  const { page, close } = await setup();
  try {
    await page.evaluate(() => {
      const raf = requestAnimationFrame;
      window.requestAnimationFrame = callback => raf(time => {
        if (document.getElementById('gbc-bar') && !window.__raceBlocked) {
          window.__raceBlocked = true;
          const dialog = document.createElement('section'); dialog.id = 'race-dialog'; dialog.setAttribute('role', 'dialog'); dialog.textContent = 'Cookie choices'; document.body.prepend(dialog);
        }
        callback(time);
      });
    });
    await engage(page); await page.clock.runFor(56000);
    assert.equal(await promptVisible(page), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('gbm-capture-prompt-seen')), null);
    assert.equal(await page.evaluate(() => dataLayer.filter(e => e.gbm_capture_outcome === 'shown').length), 0);
    await page.evaluate(() => document.getElementById('race-dialog').remove()); await page.clock.runFor(500);
    assert.equal(await promptVisible(page), true);
    assert.equal(await page.evaluate(() => dataLayer.filter(e => e.gbm_capture_outcome === 'shown').length), 1);
  } finally { await close(); }
});

test('old runtime is never hot-upgraded and hosted-form discovery is not a subscription', async () => {
  const legacy = await setup({ legacy: true });
  try {
    assert.equal(await legacy.page.evaluate(() => GBM_CAPTURE.version), 'capture-2026.1');
    assert.match(await legacy.page.evaluate(() => window.__GBM_CAPTURE_CANDIDATE_BLOCKED__), /loaded first/);
    assert.equal(await legacy.page.locator('#gbm-free-email-utility').count(), 0);
  } finally { await legacy.close(); }
  const { page, close } = await setup();
  try {
    await page.evaluate(() => {
      const link = document.getElementById('gbm-free-email-utility');
      link.addEventListener('click', event => event.preventDefault());
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.equal(await page.evaluate(() => GBM_CAPTURE.state().pending), false);
  } finally { await close(); }
});

test('capture-first bootstrap wins over actual existing legacy Share copy without duplicate submissions', async () => {
  const { page, requests, close } = await setup();
  try {
    await page.evaluate(() => { window.__firstCapture = GBM_CAPTURE; });
    await page.addScriptTag({ content: legacyShare });
    assert.equal(await page.evaluate(() => GBM_CAPTURE === window.__firstCapture), true);
    assert.equal(await page.evaluate(() => GBM_CAPTURE.version), 'capture-2026.2');
    assert.equal(await page.locator('#gbm-free-email-utility').count(), 1);
    await card(page);
    await page.locator('input[type=email]').fill('reader@example.com');
    await page.locator('input[name=consent]').check();
    await page.locator('.gbc-b').click();
    await page.waitForFunction(() => document.querySelector('.gbc').getAttribute('data-state') === 'pending');
    assert.equal(requests.filter(r => r.path === '/form-submission-service/v4/submissions').length, 1, 'only one mocked submission handler');
    assert.equal(await page.evaluate(() => GBM_CAPTURE.state().confirmation), 'unknown');
    receipts.push({ check: 'capture-before-actual-legacy-share', pass: true, mockSubmissions: 1, liveRequests: 0 });
  } finally { await close(); }
});

test('320/390/430/1366 layout: visible utility, preserved paidJoin, readable warm card and compact prompt', async () => {
  for (const width of [320, 390, 430, 1366]) {
    const { page, close } = await setup({ width });
    try {
      const utility = page.locator('#gbm-free-email-utility'), paid = page.locator('.fp-mobile-join');
      assert.equal(await utility.isVisible(), true);
      const box = await utility.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width + 1, 'utility in viewport ' + width);
      assert.equal(await paid.getAttribute('href'), '/pricing-plans');
      assert.equal(await page.locator('a[href="/the-buddy-martin-show"]').getAttribute('aria-label'), 'TV & Podcasts');
      await engage(page); await page.clock.runFor(56000);
      const banner = await page.locator('.gbc-prompt').boundingBox(); assert.ok(banner.height <= 200 && banner.width <= width);
      assert.ok(banner.y >= 0 && banner.y + banner.height <= 844, 'banner actually within viewport');
      if (proof) await page.screenshot({ path: proof + '/prompt-' + width + '.png', fullPage: false, animations: 'disabled' });
      await page.keyboard.press('Escape'); await card(page);
      const state = await page.locator('.gbc').evaluate(el => ({ background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color, width: el.getBoundingClientRect().width, scroll: document.documentElement.scrollWidth }));
      assert.equal(state.background, 'rgb(255, 253, 248)'); assert.equal(state.color, 'rgb(23, 44, 67)');
      assert.ok(state.width <= width && state.scroll <= width, JSON.stringify({ width, ...state }));
      if (proof) await page.screenshot({ path: proof + '/card-' + width + '.png', fullPage: false });
      receipts.push({ check: 'viewport', width, pass: true, promptHeight: banner.height, utilityVisible: true, documentOverflow: 0 });
    } finally { await close(); }
  }
});

test('actual Gazette/Broadcast header fixture:44px phone row, preserved shell controls, desktop entry and SPA/resize cleanup', async () => {
  for (const width of [320, 390, 430, 1366]) {
    const { page, close } = await setup({ width, current: true });
    try {
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => {
        const utility = document.getElementById('gbm-free-email-utility'), row = document.getElementById('gbm-free-email-row');
        const rect = utility.getBoundingClientRect(), shell = document.getElementById('gbm-mobile-shell-host');
        return {
          rootClass: document.getElementById('gbm-live').className,
          oldNavCount: document.querySelectorAll('#gbm-live .fp-links').length,
          utility: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, color: getComputedStyle(utility).color },
          rows: document.querySelectorAll('#gbm-free-email-row').length, rowHeight: row?.getBoundingClientRect().height,
          immediatelyAfterShell: !!row && shell.nextElementSibling === row,
          before: window.__headerBefore, rootTop: document.getElementById('gbm-live').getBoundingClientRect().top,
          controls: [...document.querySelectorAll('#gbm-mobile-shell > *')].map(el => el.outerHTML),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      assert.equal(state.oldNavCount, 0);
      assert.match(state.rootClass, /bc-fresh-news/);
      if (proof) { writeFileSync(proof + '/current-header-' + width + '.json', JSON.stringify(state, null, 2)); await page.screenshot({ path: proof + '/current-header-' + width + '.png', animations: 'disabled' }); }
      assert.ok(state.utility.x >= 0 && state.utility.x + state.utility.width <= width + 1, JSON.stringify({ width, utility: state.utility }));
      assert.ok(state.utility.height >= 44);
      assert.equal(state.utility.color, 'rgb(23, 44, 67)');
      assert.equal(state.overflow, 0, 'current header has no horizontal overflow ' + width);
      if (width <= 820) {
        assert.equal(state.rows, 1); assert.equal(state.rowHeight, 44); assert.equal(state.immediatelyAfterShell, true);
        assert.equal(state.rootTop - state.before.top, 44, 'only intended44px news flow shift');
        assert.deepEqual(state.controls, state.before.controls.map(control => control.html), 'logo/Shop/Menu markup untouched');
      } else {
        assert.equal(state.rows, 0);
        assert.equal(await page.locator('.sh-header nav #gbm-free-email-utility').count(), 1);
      }
      if (proof) await page.screenshot({ path: proof + '/current-header-' + width + '.png', animations: 'disabled' });
      await page.setViewportSize({ width: width <= 820 ? 1366 : 390, height: 844 }); await page.clock.runFor(100);
      assert.equal(await page.locator('#gbm-free-email-utility').count(), 1);
      assert.equal(await page.locator('#gbm-free-email-row').count(), width <= 820 ? 0 : 1);
      await page.evaluate(() => { history.pushState({}, '', '/post/current-story'); dispatchEvent(new Event('gbmroutechange')); });
      assert.equal(await page.locator('#gbm-free-email-row,#gbm-free-email-utility').count(), 0);
      await page.evaluate(() => { history.pushState({}, '', '/'); dispatchEvent(new PopStateEvent('popstate')); });
      assert.equal(await page.locator('#gbm-free-email-utility').count(), 1);
      receipts.push({ check: 'current-gazette-header', width, pass: true, phoneFlowShift: width <= 820 ? 44 : 0, preservedLogoShopMenu: true, documentOverflow: 0 });
    } finally { await close(); }
  }
});
