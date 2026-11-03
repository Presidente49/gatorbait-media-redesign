/* QA harness for sports-live/magazine-subscribe-prompt.js against the REAL https://www.gatorbaitmedia.com/magazine (read-only:
 * loads pages, injects the script locally with page.addScriptTag after load, never submits anything; the Subscribe and Sign in
 * destinations are intercepted and fulfilled with a stub, so nothing reaches checkout or an account page).
 *   node deploy/magazine-subscribe-20261103/qa.js            (needs the preinstalled Playwright)
 * Writes results.json and shots/*.png next to this file. A Cloudflare "Just a moment" page is retried. */
let pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/node22/lib/node_modules/playwright'); }
const { chromium } = pw;
const fs = require('fs');
const path = require('path');

const SRC = fs.readFileSync(path.join(__dirname, '..', '..', 'sports-live', 'magazine-subscribe-prompt.js'), 'utf8');
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
const ORIGIN = 'https://www.gatorbaitmedia.com';
const UA_FB = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 [FBAN/FBIOS;FBAV/470.0.0.40.108;FBBV/600000000;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]';
const UA_IG = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 Instagram 340.0.0.18.109 (iPhone14,5; iOS 17_5; en_US; en-US; scale=3.00; 1170x2532; 600000000)';
const FAST = { delay: 1500, minDelay: 500, settleTicks: 2, bannerWaitMs: 1500 };
const BANNER = '[data-hook="consent-banner-root"],#consent-policy-manager-container';
const results = [];
const WIX_INFRA = /(^|\.)(wix\.com|wixpress\.com|parastorage\.com|wixstatic\.com|wixapps\.net|wixappcloud\.com|wixforms\.com|google-analytics\.com|googletagmanager\.com|facebook\.com|facebook\.net|fbcdn\.net|doubleclick\.net|sentry-cdn\.com|jsdelivr\.net|githack\.com|github\.io)$/;
const newHosts = (s) => [...s.hosts.after].filter((x) => !s.hosts.before.has(x) && !WIX_INFRA.test(x) && !/gatorbaitmedia\.com$/.test(x));
function ok(name, cond, extra) { results.push({ name, pass: !!cond, extra: extra === undefined ? '' : String(extra) }); if (!cond) console.log('FAIL', name, extra === undefined ? '' : extra); }

async function open(browser, o) {
  const { w, h, ua, referer, storage = true, path: p = '/magazine', cfg = FAST, hideBanner = true, stub = true, sim = '', hint = false, inject = true, captureDelay = 0, query = '' } = o;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, userAgent: ua || undefined, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: w < 800 ? 2 : 1 });
  const stubbed = [];
  if (stub) await ctx.route(/\/pricing-plans(\/subscribe)?\/?(\?.*)?$|\/account\/my-account/, (r) => {
    if (r.request().isNavigationRequest() && !/\/magazine/.test(r.request().url()) && !/\/pricing-plans\/?(\?.*)?$/.test(p)) { stubbed.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/html', body: '<title>stub</title>stub' }); }
    return r.continue();
  });
  const page = await ctx.newPage();
  const hosts = { before: new Set(), after: new Set() };
  let injected = false;
  page.on('request', (rq) => { try { (injected ? hosts.after : hosts.before).add(new URL(rq.url()).host); } catch (e) {} });
  const errors = []; page.on('pageerror', (e) => { if (injected && /gbm-magsub-qa\.js/.test(String(e && e.stack || ''))) errors.push(String(e && e.message || e)); }); // only errors thrown from OUR script (the site raises its own, e.g. wixTagManager)
  const popups = []; ctx.on('page', (np) => { if (np !== page) popups.push(np.url()); });
  await page.addInitScript((f) => {
    window.__opens = []; window.open = function () { window.__opens.push([].slice.call(arguments)); return null; };
    if (!f.storage) {
      const boom = () => { throw new DOMException('blocked', 'SecurityError'); };
      Object.defineProperty(window, 'localStorage', { get: boom, configurable: true });
      Object.defineProperty(window, 'sessionStorage', { get: boom, configurable: true });
    }
    if (f.captureDelay) window.__GBM_CAPTURE_CFG__ = { delayMs: f.captureDelay };
    if (f.sim) setInterval(() => {
      document.querySelectorAll('.wixui-login-social-bar [data-testid="handle-button"]').forEach((b) => {
        if (f.sim === 'member') { if (b.textContent !== 'Brenden M.') b.textContent = 'Brenden M.'; }
        else if (f.sim === 'hydrating') { b.textContent = ''; b.removeAttribute('aria-label'); }
      });
      if (f.sim === 'unknown') document.querySelectorAll('.wixui-login-social-bar').forEach((b) => b.remove());
    }, 25);
  }, { storage, sim, captureDelay });
  let navOk = false;
  for (let i = 0; i < 4 && !navOk; i++) {
    await page.goto(ORIGIN + p + (p.includes('?') ? '&' : '?') + 'cb=' + Date.now() + query, { waitUntil: 'domcontentloaded', timeout: 90000, referer });
    await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4500); // let Wix hydrate (login bar, consent banner)
    navOk = !/just a moment/i.test(await page.title());
    if (!navOk) await page.waitForTimeout(6000);
  }
  if (hideBanner) await page.addStyleTag({ content: BANNER + '{display:none!important}' });
  if (hint) await page.evaluate(() => { window.viewerModel.siteFeaturesConfigs.siteMembers.smToken = 'qa-token'; });
  await page.evaluate((c) => { window.GBM_MAGSUB_CFG = c; }, cfg);
  injected = true;
  if (inject) await page.addScriptTag({ content: SRC + '\n//# sourceURL=gbm-magsub-qa.js' });
  return { ctx, page, hosts, popups, stubbed, errors, navOk };
}
const vis = (page) => page.evaluate(() => { const e = document.getElementById('gbm-msub'); return !!e && e.classList.contains('ms-on') && e.querySelector('.ms-card').offsetHeight > 0; });
const count = (page) => page.evaluate(() => document.querySelectorAll('#gbm-msub').length);
const waitShown = (page, ms = 25000) => page.waitForSelector('#gbm-msub.ms-on', { timeout: ms }).then(() => true).catch(() => false);
const dismissedBanner = (page) => page.addStyleTag({ content: BANNER + '{display:none!important}' });

async function geometry(page) {
  return page.evaluate(() => {
    const root = document.getElementById('gbm-msub'); const card = root.querySelector('.ms-card'); const r = card.getBoundingClientRect();
    const targets = [...root.querySelectorAll('a,button')].map((n) => { const b = n.getBoundingClientRect(); return { t: (n.textContent || n.getAttribute('aria-label')).trim().slice(0, 24), w: Math.round(b.width), h: Math.round(b.height) }; });
    const orange = /rgb\(250, 70, 22\)/;
    const orangeUse = [];
    [card, ...card.querySelectorAll('*')].forEach((n) => { const c = getComputedStyle(n);
      if (orange.test(c.color)) orangeUse.push('color:' + n.className);
      if (orange.test(c.backgroundColor)) orangeUse.push('bg:' + n.className);
      ['Top', 'Right', 'Bottom', 'Left'].forEach((s) => { if (parseFloat(c['border' + s + 'Width']) > 0 && orange.test(c['border' + s + 'Color'])) orangeUse.push('border' + s + ':' + n.className); }); });
    const fonts = [...card.querySelectorAll('*')].map((n) => getComputedStyle(n).fontFamily).filter((f, i, a) => a.indexOf(f) === i);
    return { overflowX: document.documentElement.scrollWidth - window.innerWidth, card: { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height) }, vw: window.innerWidth, vh: window.innerHeight, targets, fonts, mode: root.className, orangeUse,
      text: card.innerText.replace(/\s+/g, ' ').trim(), visibleByLiveScripts: getComputedStyle(card).display !== 'none' && card.getAttribute('aria-hidden') !== 'true', hrefs: [...card.querySelectorAll('a')].map((a) => a.getAttribute('href')), targetsAttr: [...card.querySelectorAll('a')].map((a) => a.getAttribute('target')) };
  });
}

async function scenario(browser, label, w, h, opts) {
  const s = await open(browser, { w, h, ...opts });
  const { page } = s;
  ok(`${label}: real /magazine loaded (no Cloudflare interstitial)`, s.navOk);
  const widget = await page.evaluate(() => ({ main: !!document.getElementById('gbm-magazine-page'), h1: (document.querySelector('#gbm-magazine-page h1') || {}).textContent || '', n: document.querySelectorAll('#gbm-magazine-page *').length }));
  const shown = await waitShown(page);
  ok(`${label}: appears`, shown);
  if (!shown) { await s.ctx.close(); return; }
  await page.waitForTimeout(1800); // let the site's own dialog-scanning scripts (they re-run on DOM changes) have their go
  ok(`${label}: exactly one`, (await count(page)) === 1);
  const g = await geometry(page);
  ok(`${label}: no horizontal overflow`, g.overflowX <= 0, g.overflowX);
  ok(`${label}: card inside viewport`, g.card.l >= 0 && g.card.r <= g.vw && g.card.t >= 0 && g.card.b <= g.vh, JSON.stringify(g.card));
  ok(`${label}: >=44px targets`, g.targets.every((t) => t.h >= 44 && t.w >= 44), JSON.stringify(g.targets.filter((t) => t.h < 44 || t.w < 44)));
  ok(`${label}: Barlow only`, g.fonts.every((f) => /^Barlow/i.test(f)), g.fonts.join(' | '));
  ok(`${label}: orange only as the 4px top rule`, g.orangeUse.length === 1 && /borderTop:ms-card/.test(g.orangeUse[0]), g.orangeUse.join(','));
  ok(`${label}: copy`, /Never miss a magazine issue/.test(g.text) && /Start your 7-day free trial/.test(g.text) && /Already a member\? Sign in/.test(g.text) && /Not now/.test(g.text) && /\$0 today, then \$99 per year or \$9\.99 per month\. Renews until canceled\. Cancel in My Account, My Subscriptions\./.test(g.text), g.text);
  ok(`${label}: copy avoids the words the live newsletter-popup suppressors hide (newsletter, subscribe, gatorbait magazine ...)`, !/(newsletter|subscribe|gatorbait magazine|gatorbait weekly|today'?s edition|todays edition)/i.test(g.text) && g.visibleByLiveScripts, g.text);
  ok(`${label}: current issue named from the page`, !widget.h1 || g.text.includes(widget.h1.trim()), widget.h1 + ' | ' + g.text);
  ok(`${label}: no stats claim in copy`, !/\b\d+\s*(-|to)\s*\d+\b|yards|touchdown|points|record/i.test(g.text.replace(/7-day/, '')), g.text);
  ok(`${label}: links are plain same-tab`, g.hrefs[0].startsWith('/pricing-plans') && g.hrefs[1] === '/account/my-account' && g.targetsAttr.every((t) => t === null), JSON.stringify(g.hrefs));
  if (opts.shot) await page.screenshot({ path: path.join(SHOTS, opts.shot + '.png') });
  if (w < 800) {
    ok(`${label}: phone = bottom sheet`, g.mode.includes('ms-sheet'), g.mode);
    ok(`${label}: covers <=60% of screen`, g.card.h <= 0.6 * g.vh, `${g.card.h}/${g.vh}`);
    // The live strip (embed 79372d76) sits under the header: the sheet must not overlap it.
    const strip = await page.evaluate(() => { const n = [...document.querySelectorAll('a,button')].find((a) => /watch live/i.test(a.textContent || '') && a.offsetHeight > 0); if (!n) return null; let c = n; for (let i = 0; i < 4 && c.parentElement; i++) { const r = c.parentElement.getBoundingClientRect(); if (r.width >= window.innerWidth * 0.9 && r.height < 140) c = c.parentElement; } const r = c.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; });
    if (strip) ok(`${label}: sheet does not overlap the live strip`, g.card.t >= strip.bottom, JSON.stringify({ strip, card: g.card }));
  } else {
    ok(`${label}: desktop = centered dialog`, g.mode.includes('ms-center'), g.mode);
    ok(`${label}: centered horizontally`, Math.abs((g.card.l + g.card.r) / 2 - g.vw / 2) <= 2, JSON.stringify(g.card));
    let inside = true, bad = '';
    for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); const a = await page.evaluate(() => document.activeElement.closest('#gbm-msub') ? '' : document.activeElement.outerHTML.slice(0, 80)); if (a) { inside = false; bad = a; } }
    for (let i = 0; i < 9; i++) { await page.keyboard.press('Shift+Tab'); const a = await page.evaluate(() => document.activeElement.closest('#gbm-msub') ? '' : document.activeElement.outerHTML.slice(0, 80)); if (a) { inside = false; bad = a; } }
    ok(`${label}: focus trapped (9 Tab, 9 Shift+Tab)`, inside, bad);
    ok(`${label}: aria-modal dialog labelled`, await page.evaluate(() => { const c = document.querySelector('#gbm-msub .ms-card'); return c.getAttribute('role') === 'dialog' && c.getAttribute('aria-modal') === 'true' && !!document.getElementById(c.getAttribute('aria-labelledby')); }));
  }
  // coexistence with the magazine widget: still mounted, same node count, untouched by the prompt
  const after = await page.evaluate(() => ({ main: !!document.getElementById('gbm-magazine-page'), n: document.querySelectorAll('#gbm-magazine-page *').length }));
  ok(`${label}: magazine widget intact`, after.main === widget.main && Math.abs(after.n - widget.n) <= 5, JSON.stringify({ widget, after }));
  ok(`${label}: no script errors`, s.errors.length === 0, s.errors.join(' | '));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok(`${label}: Esc closes`, (await count(page)) === 0);
  await page.waitForTimeout(3500);
  ok(`${label}: stays closed`, (await count(page)) === 0);
  ok(`${label}: no new host contacted`, newHosts(s).length === 0, newHosts(s).join(','));
  ok(`${label}: no popups / window.open`, s.popups.length === 0 && (await page.evaluate(() => window.__opens.length)) === 0);
  await s.ctx.close();
}

// the real cookie banner left visible: the prompt must sit above it and never cover its buttons
async function bannerScenario(browser, label, w, h, shot) {
  const s = await open(browser, { w, h, hideBanner: false, cfg: { ...FAST, bannerWaitMs: 1200 } });
  const { page } = s;
  const hasBanner = await page.evaluate((b) => { const e = document.querySelector(b); return !!e && e.offsetHeight > 0; }, BANNER);
  ok(`${label}: real cookie banner is showing`, hasBanner);
  const shown = await waitShown(page);
  ok(`${label}: appears with the banner up`, shown);
  if (shown) {
    const r = await page.evaluate((b) => {
      const ban = document.querySelector(b), br = ban.getBoundingClientRect(), c = document.querySelector('#gbm-msub .ms-card').getBoundingClientRect();
      const btns = [...ban.querySelectorAll('button,a,[role="button"]')].filter((x) => x.offsetHeight > 0).map((x) => { const q = x.getBoundingClientRect(); const el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { t: (x.textContent || '').trim().slice(0, 14), hit: !!el && ban.contains(el) }; }); // the topmost element at each banner control is still inside the banner (the site's own banner lays a close-button box over its Settings link with or without us)
      const root = getComputedStyle(document.getElementById('gbm-msub')).zIndex, bz = getComputedStyle(ban).zIndex;
      return { bannerTop: br.top, cardBottom: c.bottom, cardTop: c.top, btns, root, bz, vh: innerHeight };
    }, BANNER);
    ok(`${label}: card is above the banner, no overlap`, r.cardBottom <= r.bannerTop + 1, JSON.stringify(r));
    ok(`${label}: every banner control is still reached by a tap (nothing of ours on top)`, r.btns.length >= 1 && r.btns.every((b) => b.hit), JSON.stringify(r.btns));
    ok(`${label}: prompt z-index below the banner`, Number(r.root) < Number(r.bz), r.root + ' vs ' + r.bz);
    ok(`${label}: card still on screen`, r.cardTop >= 0, JSON.stringify(r));
    if (shot) await page.screenshot({ path: path.join(SHOTS, shot + '.png') });
  }
  await s.ctx.close();
}

// sample both prompts every 100 ms; they must never be visible together
const SAMPLER = () => {
  window.__s = { both: 0, ours: 0, theirs: 0 };
  setInterval(() => {
    const o = document.querySelector('#gbm-msub .ms-card'), c = document.querySelector('#gbc-bar.on:not(.aside) .gbc-prompt, #gbc-bar.on:not(.aside)');
    const ov = !!o && o.offsetHeight > 0 && document.getElementById('gbm-msub').classList.contains('ms-on');
    const tv = !!c && c.offsetHeight > 0 && getComputedStyle(c).visibility !== 'hidden' && c.getBoundingClientRect().bottom > 0 && c.getBoundingClientRect().top < innerHeight;
    if (ov) window.__s.ours++; if (tv) window.__s.theirs++; if (ov && tv) window.__s.both++;
  }, 100);
};
const engage = async (page) => { await page.mouse.wheel(0, 500); await page.mouse.move(60, 60); await page.waitForTimeout(300); await page.mouse.wheel(0, 500); await page.mouse.wheel(0, -300); };

async function coexist(browser) {
  // A. control: the live capture invitation really does appear on /magazine (delay shortened to 2.5 s through its own config hook), no lightbox script
  { const s = await open(browser, { w: 390, h: 844, inject: false, captureDelay: 2500 });
    await s.page.evaluate(SAMPLER); await engage(s.page);
    await s.page.waitForFunction(() => window.__s.theirs > 0, null, { timeout: 25000 }).catch(() => {});
    const t = await s.page.evaluate(() => window.__s.theirs);
    ok('coexist A (control, no lightbox): the live capture invitation appears on /magazine', t > 0, t);
    await s.ctx.close(); }
  // B. lightbox first: capture is held back while it is open, and stays quiet after Not now
  { const s = await open(browser, { w: 390, h: 844, captureDelay: 9000, cfg: { ...FAST, delay: 1500 } });
    await s.page.evaluate(SAMPLER); await engage(s.page);
    const shown = await waitShown(s.page, 20000);
    ok('coexist B: lightbox shows', shown);
    await engage(s.page); await s.page.waitForTimeout(14000); // past the capture invitation's own 9 s delay
    let st = await s.page.evaluate(() => window.__s);
    ok('coexist B: capture invitation held back while the lightbox is open', st.theirs === 0 && st.both === 0, JSON.stringify(st));
    await s.page.click('#gbm-msub .ms-later', { timeout: 5000 }).catch(() => {}); await s.page.waitForTimeout(10000);
    st = await s.page.evaluate(() => window.__s);
    ok('coexist B: capture stays quiet after Not now (shared dismissal key)', st.theirs === 0 && st.both === 0, JSON.stringify(st));
    await s.ctx.close(); }
  // C. capture first: the lightbox waits for it, never on top, and waits a beat after it closes
  { const s = await open(browser, { w: 390, h: 844, captureDelay: 2500, cfg: { ...FAST, delay: 9000, minDelay: 9000, settleTicks: 2 } });
    await s.page.evaluate(SAMPLER); await engage(s.page);
    await s.page.waitForFunction(() => window.__s.theirs > 0, null, { timeout: 25000 }).catch(() => {});
    const early = await s.page.evaluate(() => ({ s: window.__s, ours: !!document.getElementById('gbm-msub') }));
    ok('coexist C: capture invitation up first', early.s.theirs > 0, JSON.stringify(early));
    await s.page.waitForTimeout(12000);
    let st = await s.page.evaluate(() => ({ s: window.__s, ours: !!document.getElementById('gbm-msub') }));
    ok('coexist C: lightbox does not open on top of the capture invitation', st.s.both === 0 && !st.ours, JSON.stringify(st));
    const x = await s.page.$('#gbc-bar .gbc-x'); if (x) await x.click();
    await s.page.waitForTimeout(3000);
    st = await s.page.evaluate(() => ({ s: window.__s, ours: !!document.getElementById('gbm-msub') }));
    ok('coexist C: lightbox waits a beat after the capture invitation closes', !st.ours && st.s.both === 0, JSON.stringify(st));
    await s.page.waitForTimeout(12000);
    st = await s.page.evaluate(() => ({ s: window.__s, ours: !!document.getElementById('gbm-msub') }));
    ok('coexist C: never both at once through the whole run', st.s.both === 0, JSON.stringify(st));
    await s.ctx.close(); }
}

(async () => {
  const stat = SRC.replace(/\/\*[\s\S]*?\*\//, '').replace(/\/\/.*$/gm, '');
  ok('static: no network / popup / cookie-write APIs', !/\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|window\.open|W\.open|beforeunload|new Image|EventSource|importScripts)\b/.test(stat) && !/document\.cookie\s*=[^=]/.test(stat));
  ok('static: ASCII only', !/[^\x00-\x7f]/.test(SRC));
  ok('static: no font other than Barlow named', !/Arial|Helvetica|Georgia|Times|Roboto|\bInter\b|Playfair|Oswald/i.test(stat));
  const R = /^\/magazine\/?$/i;
  ok('static: route guard matches /magazine and /magazine/ only', ['/magazine', '/magazine/', '/Magazine'].every((x) => R.test(x)) && ['/', '/magazine-issue', '/magazines', '/post/magazine', '/magazine/archive', '/pricing-plans', '/account/my-account'].every((x) => !R.test(x)));
  ok('static: bundle size', SRC.length < 24000, SRC.length);

  const browser = await chromium.launch();
  if (process.env.ONLY === 'coexist') { await coexist(browser); await browser.close(); console.log(results.filter((r) => r.pass).length + '/' + results.length + ' checks passed (coexist only)'); results.forEach((r) => console.log(r.pass ? 'ok  ' : 'FAIL', r.name, r.extra)); return; }
  const sizes = [[320, 640], [390, 844], [430, 932], [1366, 768], [1920, 1080]];
  for (const chunk of [sizes.slice(0, 2), sizes.slice(2, 4), sizes.slice(4)]) await Promise.all(chunk.map(async ([w, h]) => {
    await scenario(browser, `${w} plain`, w, h, { shot: `modal-${w}` });
    if (w < 800 && w !== 430) await scenario(browser, `${w} facebook`, w, h, { ua: UA_FB, shot: `facebook-${w}` });
    await scenario(browser, `${w} storage-blocked`, w, h, { storage: false, shot: `storage-blocked-${w}` });
    await bannerScenario(browser, `${w} with cookie banner`, w, h, `banner-${w}`);
  }));

  // default timings (no QA override): not before the 4 s floor, shows once the visitor reading has settled
  for (const [w, h] of [[390, 844], [1366, 768]]) {
    const s = await open(browser, { w, h, cfg: {} });
    const t0 = Date.now();
    await s.page.waitForTimeout(2500);
    ok(`${w} default timing: not at 2.5 s`, (await count(s.page)) === 0);
    const shown = await waitShown(s.page, 30000); const dt = (Date.now() - t0) / 1000;
    ok(`${w} default timing: appears once settled (about 8-15 s)`, shown && dt >= 6 && dt <= 24, dt.toFixed(1) + ' s');
    await s.ctx.close();
  }

  // persistence: Not now = 7 days, X = 1 day, session flag, Subscribe link same-tab
  {
    const s = await open(browser, { w: 390, h: 844 });
    ok('390 Not now: shows', await waitShown(s.page, 20000));
    await s.page.click('#gbm-msub .ms-later'); await s.page.waitForTimeout(300);
    const keys = await s.page.evaluate(() => ({ d: localStorage.getItem('gbm-msub-dismissed'), c: localStorage.getItem('gbm-capture-dismissed') }));
    ok('390 Not now: remembered (own key) and free-email invitation quieted', !!keys.d && !!keys.c, JSON.stringify(keys));
    ok('390 Not now: no cookie written', await s.page.evaluate(() => !/gbm[-_]msub/.test(document.cookie)));
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(4000); await dismissedBanner(s.page);
    await s.page.evaluate((c) => { window.GBM_MAGSUB_CFG = c; }, FAST); await s.page.addScriptTag({ content: SRC + '\n//# sourceURL=gbm-magsub-qa.js' }); await s.page.waitForTimeout(5000);
    ok('390 Not now: stays away after reload', (await count(s.page)) === 0);
    await s.page.evaluate(() => localStorage.setItem('gbm-msub-dismissed', String(Date.now() - 8 * 86400000)));
    await s.page.evaluate(() => { try { sessionStorage.removeItem('gbm-msub-session'); } catch (e) {} });
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(4000); await dismissedBanner(s.page);
    await s.page.evaluate((c) => { window.GBM_MAGSUB_CFG = c; }, FAST); await s.page.addScriptTag({ content: SRC + '\n//# sourceURL=gbm-magsub-qa.js' });
    ok('390 Not now: returns after 8 days', await waitShown(s.page, 15000));
    await s.ctx.close();
  }
  {
    const s = await open(browser, { w: 390, h: 844 });
    await waitShown(s.page, 20000);
    await s.page.click('#gbm-msub .ms-x'); await s.page.waitForTimeout(300);
    ok('390 X: closes and holds one day', (await count(s.page)) === 0 && await s.page.evaluate(() => !!localStorage.getItem('gbm-msub-closed')));
    await s.ctx.close();
  }
  {
    const s = await open(browser, { w: 390, h: 844 });
    await waitShown(s.page, 20000);
    await s.page.evaluate(() => { document.addEventListener('click', (e) => { window.__docClicks = (window.__docClicks || 0) + 1; }); });
    const nav = s.page.waitForRequest((r) => r.isNavigationRequest() && /pricing-plans/.test(r.url()), { timeout: 8000 }).catch(() => null);
    await s.page.click('#gbm-msub a[data-ms-go="subscribe"]');
    const req = await nav;
    ok('390 Subscribe: native same-tab navigation to /pricing-plans', !!req && req.frame() === s.page.mainFrame(), req && req.url());
    ok('390 Subscribe: no popup, no window.open, platform link handler not reached', s.popups.length === 0 && (await s.page.evaluate(() => window.__opens.length).catch(() => 0)) === 0 && (await s.page.evaluate(() => window.__docClicks || 0).catch(() => 0)) === 0);
    await s.ctx.close();
  }
  {
    const s = await open(browser, { w: 390, h: 844 });
    await waitShown(s.page, 20000);
    const nav = s.page.waitForRequest((r) => r.isNavigationRequest() && /account\/my-account/.test(r.url()), { timeout: 8000 }).catch(() => null);
    await s.page.click('#gbm-msub a[data-ms-go="signin"]');
    ok('390 Sign in: native same-tab navigation to the account page', !!(await nav));
    await s.ctx.close();
  }
  // storage + sessionStorage blocked: shows, Not now honoured in this page load, no cookie written, shows again only on a new load
  {
    const s = await open(browser, { w: 390, h: 844, ua: UA_IG, storage: false });
    ok('390 storage-blocked (Instagram UA): shows', await waitShown(s.page, 20000));
    await s.page.click('#gbm-msub .ms-later'); await s.page.waitForTimeout(4000);
    ok('390 storage-blocked: Not now honoured in this load, no cookie written', (await count(s.page)) === 0 && await s.page.evaluate(() => !/gbm/.test(document.cookie)));
    await s.ctx.close();
  }

  // member / uncertain-state negative tests (simulated: no member login was available)
  for (const [w, h] of [[390, 844], [1366, 768]]) {
    let s = await open(browser, { w, h });
    ok(`${w} visitor (login bar says Log In) is read as visitor and sees it`, (await s.page.evaluate(() => window.__gbmMagSub.debug().member)) === 'visitor' && await waitShown(s.page, 20000));
    await s.ctx.close();
    s = await open(browser, { w, h, sim: 'member', query: '&gbm_msub=1' });
    await s.page.waitForTimeout(9000);
    const d = await s.page.evaluate(() => window.__gbmMagSub.debug());
    ok(`${w} simulated member (login bar shows a name, even with ?gbm_msub=1): never shows`, (await count(s.page)) === 0 && d.member === 'member', JSON.stringify(d));
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(4000); await dismissedBanner(s.page);
    await s.page.evaluate((c) => { window.GBM_MAGSUB_CFG = c; }, FAST); await s.page.addScriptTag({ content: SRC + '\n//# sourceURL=gbm-magsub-qa.js' }); await s.page.waitForTimeout(6000);
    ok(`${w} simulated member: remembered, still nothing after reload`, (await count(s.page)) === 0 && await s.page.evaluate(() => !!localStorage.getItem('gbm-msub-member')));
    await s.ctx.close();
    s = await open(browser, { w, h, sim: 'unknown' });
    await s.page.waitForTimeout(9000);
    ok(`${w} no login bar (unknown): never shows`, (await count(s.page)) === 0 && (await s.page.evaluate(() => window.__gbmMagSub.debug().member)) === 'unknown');
    await s.ctx.close();
    s = await open(browser, { w, h, sim: 'hydrating' });
    await s.page.waitForTimeout(9000);
    ok(`${w} empty login bar (hydrating): never shows`, (await count(s.page)) === 0 && (await s.page.evaluate(() => window.__gbmMagSub.debug().member)) === 'unknown');
    await s.ctx.close();
    s = await open(browser, { w, h, hint: true });
    await s.page.waitForTimeout(9000);
    ok(`${w} server-rendered member hint present: never shows`, (await count(s.page)) === 0 && (await s.page.evaluate(() => window.__gbmMagSub.debug().member)) === 'member');
    await s.ctx.close();
    s = await open(browser, { w, h, storage: false, ua: UA_IG, sim: 'member' });
    await s.page.waitForTimeout(8000);
    ok(`${w} simulated member, storage blocked, Instagram UA: never shows`, (await count(s.page)) === 0);
    await s.ctx.close();
    s = await open(browser, { w, h });
    ok(`${w} member state appears while open: closes at once`, await waitShown(s.page, 20000));
    await s.page.evaluate(() => { const b = document.querySelector('.wixui-login-social-bar [data-testid="handle-button"]'); b.textContent = 'Brenden M.'; });
    await s.page.waitForTimeout(1500);
    ok(`${w} member state appears while open: gone`, (await count(s.page)) === 0);
    await s.page.waitForTimeout(3000);
    ok(`${w} member state appears while open: stays gone`, (await count(s.page)) === 0);
    await s.ctx.close();
  }

  // copy fallbacks: no readable issue headline, or a headline containing a word the live suppressors hide
  for (const [name, h1] of [['no issue headline', ''], ['headline with a suppressed word', 'Subscribe to the Newsletter']]) {
    const s = await open(browser, { w: 390, h: 844, inject: false });
    await s.page.evaluate((t) => { const e = document.querySelector('#gbm-magazine-page h1'); if (e) e.textContent = t; }, h1);
    await s.page.addScriptTag({ content: SRC + '\n//# sourceURL=gbm-magsub-qa.js' });
    ok(`fallback copy (${name}): shows and is not hidden by the site's own scripts`, await waitShown(s.page, 20000));
    await s.page.waitForTimeout(1800);
    const g = await geometry(s.page);
    ok(`fallback copy (${name}): generic line, no suppressed words`, /Join GatorBait to read every issue of the magazine\./.test(g.text) && !/(newsletter|subscribe|gatorbait magazine)/i.test(g.text) && g.visibleByLiveScripts && g.card.h > 0, g.text);
    await s.ctx.close();
  }

  // routes: /magazine only (script injected on the other real pages must stay silent)
  for (const p of ['/', '/pricing-plans', '/gatorbait-media-blogs']) {
    const s = await open(browser, { w: 390, h: 844, path: p });
    await s.page.waitForTimeout(8000);
    ok(`route ${p}: never shows`, (await count(s.page)) === 0 && (await s.page.evaluate(() => window.__gbmMagSub.debug().routeOk)) === false);
    await s.ctx.close();
  }

  await coexist(browser);
  await browser.close();
  const pass = results.filter((r) => r.pass).length;
  fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify({ ran: new Date().toISOString(), pass, total: results.length, failed: results.filter((r) => !r.pass), results }, null, 1));
  console.log(`${pass}/${results.length} checks passed`);
})();
