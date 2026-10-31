/* QA harness for signup-lightbox.js against the REAL https://www.gatorbaitmedia.com/ (read-only: loads pages, injects the
 * script locally, never submits anything; form and join destinations are intercepted and fulfilled with a stub).
 *   node deploy/signup-lightbox-20261031/qa.js            (needs the preinstalled Playwright)
 * Writes results.json and shots/*.png next to this file. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SRC = fs.readFileSync(path.join(__dirname, 'signup-lightbox.js'), 'utf8');
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
const ORIGIN = 'https://www.gatorbaitmedia.com';
const FORM = 'https://buddymartinshow.wixforms.com/f/7517931185469654016';

const UA = {
  none: null,
  facebook: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 [FBAN/FBIOS;FBAV/470.0.0.40.108;FBBV/600000000;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]',
  instagram: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 Instagram 340.0.0.18.109 (iPhone14,5; iOS 17_5; en_US; en-US; scale=3.00; 1170x2532; 600000000)',
  x: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 Twitter for iPhone/10.45.0'
};
const FAST = { delay: 1500, minDelay: 500, settleTicks: 2 };
const results = [];
const WIX_INFRA = /(^|\.)(wix\.com|wixpress\.com|parastorage\.com|wixstatic\.com|wixapps\.net|wixappcloud\.com|wixforms\.com|google-analytics\.com|googletagmanager\.com|facebook\.com|facebook\.net|fbcdn\.net|doubleclick\.net|sentry-cdn\.com)$/;
const newHosts = (s) => [...s.hosts.after].filter((x) => !s.hosts.before.has(x) && !WIX_INFRA.test(x));
function ok(name, cond, extra) { results.push({ name, pass: !!cond, extra: extra === undefined ? '' : String(extra) }); if (!cond) console.log('FAIL', name, extra === undefined ? '' : extra); }

async function open(browser, { w, h, ua, referer, storage = true, cookies = true, path: p = '/', cfg = FAST, hideBanner = true, stub = true, sim = '', shot }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, userAgent: ua || undefined, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: w < 800 ? 2 : 1 });
  const stubbed = [];
  if (stub) await ctx.route(/wixforms\.com|\/pricing-plans\/?(\?.*)?$|\/account\/my-account/, (r) => {
    if (r.request().isNavigationRequest()) { stubbed.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/html', body: '<title>stub</title>stub' }); }
    return r.continue();
  });
  const page = await ctx.newPage();
  const hosts = { before: new Set(), after: new Set() };
  let injected = false;
  page.on('request', (rq) => { try { (injected ? hosts.after : hosts.before).add(new URL(rq.url()).host); } catch (e) {} });
  const opened = []; page.on('console', (m) => { if (/^GBM_OPEN/.test(m.text())) opened.push(m.text()); });
  const popups = []; ctx.on('page', (np) => { if (np !== page) popups.push(np.url()); });
  await page.addInitScript((flags) => {
    window.__opens = []; window.open = function () { window.__opens.push([].slice.call(arguments)); console.log('GBM_OPEN ' + [].slice.call(arguments).join(',')); return null; };
    if (!flags.storage) {
      const boom = () => { throw new DOMException('blocked', 'SecurityError'); };
      Object.defineProperty(window, 'localStorage', { get: boom, configurable: true });
      Object.defineProperty(window, 'sessionStorage', { get: boom, configurable: true });
    }
    if (flags.sim) setInterval(() => { document.querySelectorAll('[data-testid="handle-button"]').forEach((b) => {
      if (flags.sim === 'member') b.textContent = 'Brenden M.'; else if (flags.sim === 'hydrating') { b.textContent = ''; b.removeAttribute('aria-label'); } else if (flags.sim === 'unknown') b.remove(); }); }, 25);
    if (!flags.cookies) { try { Object.defineProperty(document, 'cookie', { get: () => '', set: () => {}, configurable: true }); } catch (e) {} }
  }, { storage, cookies, sim });
  await page.goto(ORIGIN + p + (p.includes('?') ? '&' : '?') + 'cb=' + Date.now() + '&utm_source=qa&fbclid=QA123', { waitUntil: 'domcontentloaded', timeout: 90000, referer });
  await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4500); // let Wix hydrate (login bar, consent banner)
  if (hideBanner) await page.addStyleTag({ content: '[data-hook="consent-banner-root"],#consent-policy-manager-container{display:none!important}' });
  await page.evaluate((c) => { window.GBM_SIGNUP_CFG = c; }, cfg);
  injected = true;
  await page.addScriptTag({ content: SRC });
  return { ctx, page, hosts, popups, stubbed, opened };
}
const vis = (page) => page.evaluate(() => { const e = document.getElementById('gbm-su'); return !!e && e.classList.contains('su-on') && e.querySelector('.su-card').offsetHeight > 0; });
const count = (page) => page.evaluate(() => document.querySelectorAll('#gbm-su').length);

async function geometry(page, w) {
  return page.evaluate((w) => {
    const root = document.getElementById('gbm-su'); const card = root.querySelector('.su-card'); const r = card.getBoundingClientRect();
    const targets = [...root.querySelectorAll('a,button')].map((n) => { const b = n.getBoundingClientRect(); return { t: (n.textContent || n.getAttribute('aria-label')).trim().slice(0, 24), w: Math.round(b.width), h: Math.round(b.height) }; });
    return { overflowX: document.documentElement.scrollWidth - window.innerWidth, card: { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height) }, vw: window.innerWidth, vh: window.innerHeight, targets, font: getComputedStyle(card).fontFamily, mode: root.className };
  }, w);
}

async function scenario(browser, label, w, h, opts) {
  const s = await open(browser, { w, h, ...opts });
  const { page } = s;
  await page.waitForSelector('#gbm-su.su-on', { timeout: 25000 }).catch(() => {});
  const shown = await vis(page);
  ok(`${label}: appears`, shown);
  if (!shown) { await s.ctx.close(); return; }
  ok(`${label}: exactly one`, (await count(page)) === 1);
  const g = await geometry(page, w);
  ok(`${label}: no horizontal overflow`, g.overflowX <= 0, g.overflowX);
  ok(`${label}: card inside viewport`, g.card.l >= 0 && g.card.r <= g.vw && g.card.t >= 0 && g.card.b <= g.vh, JSON.stringify(g.card));
  ok(`${label}: >=44px targets`, g.targets.every((t) => t.h >= 44 && t.w >= 44), JSON.stringify(g.targets.filter((t) => t.h < 44 || t.w < 44)));
  ok(`${label}: Barlow`, /^Barlow/.test(g.font), g.font);
  if (opts.shot) await page.screenshot({ path: path.join(SHOTS, opts.shot + '.png') });
  if (w < 800) {
    ok(`${label}: phone = bottom sheet`, g.mode.includes('su-sheet'), g.mode);
    ok(`${label}: covers <=60% of screen`, g.card.h <= 0.6 * g.vh, `${g.card.h}/${g.vh}`);
    const gd = await page.evaluate(() => { const e = document.getElementById('gbm-gd10-bar'); if (!e || !e.offsetHeight) return null; const r = e.getBoundingClientRect(); const c = document.querySelector('#gbm-su .su-card').getBoundingClientRect(); return { top: r.top, cardBottom: c.bottom, pos: getComputedStyle(e).position }; });
    if (gd && gd.pos === 'fixed') ok(`${label}: clear of orange game-day bar`, gd.cardBottom <= gd.top + 1, JSON.stringify(gd));
  }
  const isModal = g.mode.includes('su-center');
  if (isModal) { // focus trap
    let inside = true, bad = '';
    for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); { const a = await page.evaluate(() => document.activeElement.closest('#gbm-su') ? '' : document.activeElement.outerHTML.slice(0, 80)); if (a) { inside = false; bad = a; } } }
    for (let i = 0; i < 9; i++) { await page.keyboard.press('Shift+Tab'); { const a = await page.evaluate(() => document.activeElement.closest('#gbm-su') ? '' : document.activeElement.outerHTML.slice(0, 80)); if (a) { inside = false; bad = a; } } }
    ok(`${label}: focus trapped`, inside, bad);
  }
  // Esc closes
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok(`${label}: Esc closes`, (await count(page)) === 0);
  await page.waitForTimeout(3500);
  ok(`${label}: stays closed`, (await count(page)) === 0);
  ok(`${label}: no new host contacted`, newHosts(s).length === 0, newHosts(s).join(','));
  ok(`${label}: no popups/window.open`, s.popups.length === 0 && (await page.evaluate(() => window.__opens.length)) === 0);
  await s.ctx.close();
}

ok('static: script has no network/popup APIs', !/\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|window\.open|beforeunload|new Image)\b/.test(SRC.replace(/\/\*[\s\S]*?\*\//, '').replace(/\/\/.*$/gm, '')));
(async () => {
  const browser = await chromium.launch();
  const sizes = [[390, 844], [430, 932], [320, 640], [1366, 768], [1920, 1080]];
  const chunks = [sizes.slice(0, 2), sizes.slice(2, 4), sizes.slice(4)];
  for (const chunk of chunks) await Promise.all(chunk.map(async ([w, h]) => {
    for (const k of Object.keys(UA)) {
      if (k !== 'none' && (w > 800 || (w === 320 && k !== 'facebook') || (w === 430 && k === 'x'))) continue;
      await scenario(browser, `${w} ${k}`, w, h, { ua: UA[k], shot: k === 'none' ? `modal-${w}` : (k === 'facebook' ? `facebook-${w}` : null) });
    }
    await scenario(browser, `${w} storage-blocked`, w, h, { storage: false, shot: `storage-blocked-${w}` });
    if (w === 390 || w === 1366) await scenario(browser, `${w} storage+cookies-blocked`, w, h, { storage: false, cookies: false });
    await scenario(browser, `${w} google-referrer sheet`, w, h, { referer: 'https://www.google.com/', shot: `google-sheet-${w}` });
  }));

  // storage-blocked: with first-party cookie fallback, a reload must still honour a close
  {
    const s = await open(browser, { w: 390, h: 844, ua: UA.instagram, storage: false });
    await s.page.waitForTimeout(2600);
    ok('storage-blocked: shows', await vis(s.page));
    await s.page.click('#gbm-su .su-later');
    await s.page.waitForTimeout(300);
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(3500);
    await s.page.addStyleTag({ content: '[data-hook="consent-banner-root"],#consent-policy-manager-container{display:none!important}' }); await s.page.evaluate((c) => { window.GBM_SIGNUP_CFG = c; }, FAST); await s.page.addScriptTag({ content: SRC }); await s.page.waitForTimeout(3000);
    ok('storage-blocked: Not now honoured after reload via cookie fallback', (await count(s.page)) === 0);
    await s.ctx.close();
  }

  // 7-day suppression, X close = session only, CTA same-tab
  {
    const s = await open(browser, { w: 390, h: 844 });
    await s.page.waitForTimeout(2600);
    ok('close X is 44px', await s.page.evaluate(() => { const b = document.querySelector('#gbm-su .su-x').getBoundingClientRect(); return b.width >= 44 && b.height >= 44; }));
    await s.page.click('#gbm-su .su-x'); await s.page.waitForTimeout(300);
    ok('X closes', (await count(s.page)) === 0);
    ok('X does not write the 7-day key', await s.page.evaluate(() => !localStorage.getItem('gbm-su-dismissed')));
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(3500);
    await s.page.addStyleTag({ content: '[data-hook="consent-banner-root"],#consent-policy-manager-container{display:none!important}' }); await s.page.evaluate((c) => { window.GBM_SIGNUP_CFG = c; }, FAST); await s.page.addScriptTag({ content: SRC }); await s.page.waitForTimeout(3000);
    ok('once per session (X close, reload same session)', (await count(s.page)) === 0);
    // new session, previously "Not now"
    await s.page.evaluate(() => { sessionStorage.clear(); document.cookie.split(';').forEach(c => { const n = c.split('=')[0].trim(); if (/^gbm_su/.test(n)) document.cookie = n + '=; max-age=0; path=/'; }); localStorage.setItem('gbm-su-dismissed', String(Date.now())); });
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(3500);
    await s.page.addStyleTag({ content: '[data-hook="consent-banner-root"],#consent-policy-manager-container{display:none!important}' }); await s.page.evaluate((c) => { window.GBM_SIGNUP_CFG = c; }, FAST); await s.page.addScriptTag({ content: SRC }); await s.page.waitForTimeout(3000);
    ok('Not now suppresses for 7 days', (await count(s.page)) === 0);
    await s.page.evaluate(() => { sessionStorage.clear(); localStorage.setItem('gbm-su-dismissed', String(Date.now() - 8 * 86400000)); document.cookie.split(';').forEach(c => { const n = c.split('=')[0].trim(); if (/^gbm_su/.test(n)) document.cookie = n + '=; max-age=0; path=/'; }); });
    await s.page.reload({ waitUntil: 'load' }); await s.page.waitForTimeout(3500);
    await s.page.addStyleTag({ content: '[data-hook="consent-banner-root"],#consent-policy-manager-container{display:none!important}' }); await s.page.evaluate((c) => { window.GBM_SIGNUP_CFG = c; }, FAST); await s.page.addScriptTag({ content: SRC }); await s.page.waitForTimeout(3000);
    await s.page.waitForSelector('#gbm-su.su-on', { timeout: 9000 }).catch(() => {});
    ok('returns after 7 days', await vis(s.page));
    // CTA: same tab, no popup, navigation to the existing hosted form (stubbed; nothing submitted)
    const href = await s.page.getAttribute('#gbm-su a[data-su-go=email]', 'href');
    const target = await s.page.getAttribute('#gbm-su a[data-su-go=email]', 'target');
    ok('free-email link is the existing hosted form, no target', href === FORM && target === null, href + ' ' + target);
    const navReq = s.page.waitForRequest((r) => r.url().startsWith(FORM) && r.isNavigationRequest() && r.frame() === s.page.mainFrame(), { timeout: 15000 }).catch(() => null);
    await s.page.click('#gbm-su a[data-su-go=email]'); const nr = await navReq;
    ok('CTA navigates the same tab (main frame): no popup, no window.open', !!nr && s.popups.length === 0 && s.opened.length === 0, (nr ? '' : 'no navigation request ') + s.opened.join(';'));
    await s.ctx.close();
  }

  // consent banner: never covers it
  {
    const s = await open(browser, { w: 390, h: 844, hideBanner: false, cfg: { delay: 1500, minDelay: 500, settleTicks: 2, bannerWaitMs: 4000 } });
    await s.page.waitForTimeout(2800);
    ok('waits while cookie banner is up', (await count(s.page)) === 0);
    await s.page.waitForTimeout(3500);
    const r = await s.page.evaluate(() => { const b = document.querySelector('[data-hook="consent-banner-root"]'); const c = document.querySelector('#gbm-su .su-card'); if (!b || !c) return null; return { bt: b.getBoundingClientRect().top, cb: c.getBoundingClientRect().bottom, mode: document.getElementById('gbm-su').className }; });
    ok('sheet sits above banner after the wait', r && r.mode.includes('su-sheet') && r.cb <= r.bt + 1, JSON.stringify(r));
    await s.page.screenshot({ path: path.join(SHOTS, 'above-banner-390.png') });
    await s.ctx.close();
    const s2 = await open(browser, { w: 390, h: 844, hideBanner: false, cfg: { delay: 1500, minDelay: 500, settleTicks: 2, bannerWaitMs: 60000 } });
    await s2.page.waitForTimeout(2800);
    await s2.page.addStyleTag({ content: '[data-hook="consent-banner-root"]{display:none!important}' }); // visitor answered the banner
    await s2.page.waitForTimeout(2200);
    await s2.page.waitForSelector('#gbm-su.su-on', { timeout: 6000 }).catch(() => {});
    ok('box appears once the banner is answered', await vis(s2.page));
    await s2.ctx.close();
  }

  // excluded routes
  for (const p of ['/pricing-plans', '/signin', '/checkout', '/account/my-account']) {
    const s = await open(browser, { w: 390, h: 844, path: p, stub: false, cfg: { delay: 1000, minDelay: 300, settleTicks: 2 } });
    await s.page.waitForTimeout(4500);
    ok(`not shown on ${p}`, (await count(s.page)) === 0, new URL(s.page.url()).pathname);
    await s.ctx.close();
  }

  // MEMBER GATE (ship-blocker): logged-out sees it; simulated member / unknown signal never does, at 390 and 1366
  for (const [w, h] of [[390, 844], [1366, 768]]) {
    const s0 = await open(browser, { w, h });
    ok(`${w} member gate: logged-out visitor read as visitor`, (await s0.page.evaluate(() => window.__gbmSignup.debug().member)) === 'visitor');
    await s0.page.waitForSelector('#gbm-su.su-on', { timeout: 9000 }).catch(() => {});
    ok(`${w} member gate: logged-out visitor sees it`, await vis(s0.page));
    await s0.ctx.close();
    const s1 = await open(browser, { w, h, sim: 'member' });
    await s1.page.waitForTimeout(300);
    ok(`${w} member gate: member DOM state read as member`, (await s1.page.evaluate(() => window.__gbmSignup.debug().member)) === 'member');
    await s1.page.waitForTimeout(9000);
    ok(`${w} member gate: simulated member NEVER sees it`, (await count(s1.page)) === 0);
    await s1.page.reload({ waitUntil: 'load' }); await s1.page.waitForTimeout(3500);
    await s1.page.addStyleTag({ content: '[data-hook="consent-banner-root"]{display:none!important}' });
    await s1.page.evaluate((c) => { window.GBM_SIGNUP_CFG = c; }, FAST); await s1.page.addScriptTag({ content: SRC });
    await s1.page.waitForTimeout(6000);
    ok(`${w} member gate: still never after reload (remembered)`, (await count(s1.page)) === 0);
    await s1.ctx.close();
    const s2 = await open(browser, { w, h, sim: 'unknown', cfg: { ...FAST, minDelay: 300 } }); // unknown signal: login bar absent
    await s2.page.waitForTimeout(9000);
    ok(`${w} member gate: unknown signal (no login bar) -> not shown`, (await count(s2.page)) === 0 && (await s2.page.evaluate(() => window.__gbmSignup.debug().member)) === 'unknown');
    await s2.ctx.close();
    const s3 = await open(browser, { w, h, sim: 'hydrating' }); // still hydrating: empty login bar
    await s3.page.waitForTimeout(8000);
    ok(`${w} member gate: login bar still hydrating -> not shown`, (await count(s3.page)) === 0);
    await s3.ctx.close();
    const s4 = await open(browser, { w, h, sim: 'member', path: '/?gbm_su=1' }); // force flag must not bypass the member gate
    await s4.page.waitForTimeout(8000);
    ok(`${w} member gate: ?gbm_su=1 does not bypass member gate`, (await count(s4.page)) === 0);
    await s4.ctx.close();
    const s5 = await open(browser, { w, h }); // becomes member (late hydration) while it is open -> closes
    await s5.page.waitForSelector('#gbm-su.su-on', { timeout: 9000 }).catch(() => {});
    await s5.page.evaluate(() => { const f = () => document.querySelectorAll('[data-testid="handle-button"]').forEach((b) => { b.textContent = 'Brenden M.'; }); f(); setInterval(f, 25); }); await s5.page.waitForTimeout(1500);
    ok(`${w} member gate: closes if member state appears while open`, (await count(s5.page)) === 0);
    await s5.ctx.close();
    const s6 = await open(browser, { w, h, sim: 'member', storage: false, cookies: false, ua: UA.instagram }); // in-app, storage+cookies blocked, member
    await s6.page.waitForTimeout(8000);
    ok(`${w} member gate: member in storage-blocked in-app browser never sees it`, (await count(s6.page)) === 0);
    await s6.ctx.close();
  }
  {
    const s3 = await open(browser, { w: 390, h: 844, cfg: FAST, hideBanner: true });
    await s3.page.evaluate(() => { const e = document.createElement('span'); e.className = 'gbm-live-pill'; e.textContent = 'LIVE'; (document.getElementById('gbm-live') || document.body).prepend(e); });
    await s3.page.waitForTimeout(3500);
    const live = await s3.page.evaluate(() => { const r = document.getElementById('gbm-su'); return r ? r.className : ''; });
    ok('live game: compact sheet, not a center box', live.includes('su-sheet') && !live.includes('su-center'), live);
    await s3.ctx.close();
  }

  // real default timing at 390: not instant, then appears
  {
    const s = await open(browser, { w: 390, h: 844, cfg: {} });
    await s.page.waitForTimeout(2500);
    ok('default timing: not shown in first seconds', (await count(s.page)) === 0);
    await s.page.waitForSelector('#gbm-su.su-on', { timeout: 12000 }).catch(() => {});
    ok('default timing: shown by ~10s dwell', await vis(s.page));
    await s.ctx.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.pass);
  fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify({ ranAt: new Date().toISOString(), total: results.length, failed: failed.length, results }, null, 1));
  console.log(`${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
})();
