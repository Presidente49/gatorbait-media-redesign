// Playwright test for the rev16 runtime-pin bootstrap. No live network: the document, the pin file and jsDelivr are all stubbed.
// Run: NODE_PATH=/opt/node22/lib/node_modules node deploy/broadcast-2026/0c13f955/test-pin.mjs
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const req = createRequire((process.env.NODE_PATH || '/opt/node22/lib/node_modules').split(':')[0] + '/');
const { chromium } = req('playwright');

const BAKED = 'd86a94461fa2c8e205fc5bfb678bd56f68a40118';
const PINNED = '1111111111111111111111111111111111111111';
const MARKUP = readFileSync(new URL('./rev16.html', import.meta.url), 'utf8');
const PIN_RE = /^https:\/\/presidente49\.github\.io\/gatorbait-media-redesign\/sports-live\/broadcast-pin\.json\?t=\d+$/;
const JS_RE = /^https:\/\/cdn\.jsdelivr\.net\/gh\/Presidente49\/gatorbait-media-redesign@([^/]+)\/sports-live\/broadcast-home\.js$/;
const CORS = { 'access-control-allow-origin': '*' };
const json = (body) => ({ status: 200, contentType: 'application/json', headers: CORS, body: typeof body === 'string' ? body : JSON.stringify(body) });

// Each case: pin = function(route) handling the pin request; missing = shas whose script 404s; init = script run before page scripts.
const cases = [
  { name: 'pin ok: pinned sha used, baked not requested', pin: (r) => r.fulfill(json({ sha: PINNED })), expect: { ok: [PINNED], requested: [PINNED], pinReq: 1 } },
  { name: 'pin ok but same as baked', pin: (r) => r.fulfill(json({ sha: BAKED })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'pin 404 -> baked', pin: (r) => r.fulfill({ status: 404, headers: CORS, body: 'nope' }), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'pin 500 -> baked', pin: (r) => r.fulfill({ status: 500, headers: CORS, body: 'err' }), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'pin aborted / network error -> baked', pin: (r) => r.abort('failed'), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'pin invalid JSON -> baked', pin: (r) => r.fulfill(json('{not json')), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'pin empty body -> baked', pin: (r) => r.fulfill(json('')), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'pin JSON null -> baked', pin: (r) => r.fulfill(json('null')), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'pin JSON array -> baked', pin: (r) => r.fulfill(json([PINNED])), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha too short -> baked', pin: (r) => r.fulfill(json({ sha: PINNED.slice(0, 39) })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha uppercase -> baked', pin: (r) => r.fulfill(json({ sha: 'ABCDEF0123456789ABCDEF0123456789ABCDEF01' })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha non-hex -> baked', pin: (r) => r.fulfill(json({ sha: 'g'.repeat(40) })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha too long -> baked', pin: (r) => r.fulfill(json({ sha: PINNED + '1' })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha with newline suffix -> baked', pin: (r) => r.fulfill(json({ sha: PINNED + '\n' })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha key missing -> baked', pin: (r) => r.fulfill(json({ commit: PINNED })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha wrong type (number) -> baked', pin: (r) => r.fulfill(json({ sha: 12345 })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha wrong type (array) -> baked', pin: (r) => r.fulfill(json({ sha: [PINNED] })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  { name: 'sha wrong type (null) -> baked', pin: (r) => r.fulfill(json({ sha: null })), expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 } },
  {
    name: 'slow pin (2000 ms): baked once, late pin ignored',
    pin: async (r) => { await new Promise((x) => setTimeout(x, 2000)); try { await r.fulfill(json({ sha: PINNED })); } catch (e) { /* page may be gone */ } },
    settle: 2600, expect: { ok: [BAKED], requested: [BAKED], pinReq: 1 },
  },
  { name: 'fetch undefined -> baked', init: 'delete window.fetch;', expect: { ok: [BAKED], requested: [BAKED], pinReq: 0 } },
  { name: 'fetch throws synchronously -> baked', init: 'window.fetch=function(){throw new Error("boom");};', expect: { ok: [BAKED], requested: [BAKED], pinReq: 0 } },
  { name: 'fetch rejects -> baked', init: 'window.fetch=function(){return Promise.reject(new Error("boom"));};', expect: { ok: [BAKED], requested: [BAKED], pinReq: 0 } },
  { name: 'fetch never settles -> baked at 1200 ms', init: 'window.fetch=function(){return new Promise(function(){});};', expect: { ok: [BAKED], requested: [BAKED], pinReq: 0 } },
  { name: 'pinned script 404 -> baked injected once', pin: (r) => r.fulfill(json({ sha: PINNED })), missing: [PINNED], expect: { ok: [BAKED], requested: [PINNED, BAKED], pinReq: 1 } },
  { name: 'pinned 404 and baked 404 -> nothing loads, page unhides', pin: (r) => r.fulfill(json({ sha: PINNED })), missing: [PINNED, BAKED], expect: { ok: [], requested: [PINNED, BAKED], pinReq: 1 } },
  { name: 'baked 404 on fallback -> unhides, no loop', pin: (r) => r.abort('failed'), missing: [BAKED], expect: { ok: [], requested: [BAKED], pinReq: 1 } },
  { name: 'non-home path /blog: nothing happens', path: '/blog', pin: (r) => r.fulfill(json({ sha: PINNED })), expect: { ok: [], requested: [], pinReq: 0, noWaitClassEver: true } },
  { name: 'non-home path /post/x: nothing happens', path: '/post/x', pin: (r) => r.fulfill(json({ sha: PINNED })), expect: { ok: [], requested: [], pinReq: 0, noWaitClassEver: true } },
  { name: 'home with trailing slashes (//) still home', path: '//', pin: (r) => r.fulfill(json({ sha: PINNED })), expect: { ok: [PINNED], requested: [PINNED], pinReq: 1 } },
  { name: '__GBM_BC_HOME__ already set: nothing happens', init: 'window.__GBM_BC_HOME__=true;', pin: (r) => r.fulfill(json({ sha: PINNED })), expect: { ok: [], requested: [], pinReq: 0, noWaitClassEver: true } },
];

async function runCase(browser, c) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const seen = { requested: [], ok: [], pinReq: 0, pinUrlOk: true };
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  if (c.init) await page.addInitScript(c.init);
  // Record whether the wait class ever appeared (for non-home cases).
  await page.addInitScript('window.__waitSeen=false;setInterval(function(){if(document.documentElement&&document.documentElement.classList.contains("gbm-bc-wait"))window.__waitSeen=true;},5);');
  const path = c.path || '/';
  await page.route('https://www.gatorbaitmedia.com/**', (r) => r.fulfill({
    status: 200, contentType: 'text/html',
    body: `<!doctype html><html><head><meta charset="utf-8">${MARKUP}</head><body><div id="gbm-live" class="gbm-gazette">Gazette</div></body></html>`,
  }));
  await page.route('https://presidente49.github.io/**', async (r) => {
    seen.pinReq++;
    if (!PIN_RE.test(r.request().url())) seen.pinUrlOk = false;
    if (c.pin) await c.pin(r); else await r.fulfill({ status: 404, headers: CORS, body: '' });
  });
  await page.route('https://cdn.jsdelivr.net/**', (r) => {
    const m = JS_RE.exec(r.request().url());
    if (!m) return r.fulfill({ status: 400, body: 'bad url' });
    seen.requested.push(m[1]);
    if ((c.missing || []).includes(m[1])) return r.fulfill({ status: 404, contentType: 'text/plain', body: 'Not found' });
    seen.ok.push(m[1]);
    return r.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.__GBM_BC_HOME__=true;' });
  });
  const t0 = Date.now();
  await page.goto('https://www.gatorbaitmedia.com' + path, { waitUntil: 'commit' });
  let waitGone = true;
  try {
    await page.waitForFunction('!document.documentElement.classList.contains("gbm-bc-wait")', null, { timeout: 2600, polling: 25 });
  } catch (e) { waitGone = false; }
  const goneAt = Date.now() - t0;
  await page.waitForTimeout(c.settle ? Math.max(0, c.settle - goneAt) + 300 : 600); // let late pin results and extra injections show up
  const waitSeen = await page.evaluate('window.__waitSeen').catch(() => null);
  const gazetteVisible = await page.evaluate('getComputedStyle(document.getElementById("gbm-live")).visibility').catch(() => null);
  await ctx.close();

  const e = c.expect, fails = [];
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  if (!same(seen.requested, e.requested)) fails.push(`requested ${JSON.stringify(seen.requested)} != ${JSON.stringify(e.requested)}`);
  if (!same(seen.ok, e.ok)) fails.push(`successful loads ${JSON.stringify(seen.ok)} != ${JSON.stringify(e.ok)}`);
  if (seen.ok.length > 1) fails.push('more than one successful broadcast-home.js load');
  if (seen.pinReq !== e.pinReq) fails.push(`pin requests ${seen.pinReq} != ${e.pinReq}`);
  if (!seen.pinUrlOk) fails.push('pin URL did not match .../broadcast-pin.json?t=<minutes>');
  if (!waitGone) fails.push('wait class still present after 2.6 s');
  if (gazetteVisible === 'hidden') fails.push('#gbm-live still hidden');
  if (e.noWaitClassEver && waitSeen) fails.push('wait class was added on a page that should be untouched');
  if (errors.length) fails.push('page errors: ' + errors.join(' | '));
  return { name: c.name, fails, goneAt };
}

const browser = await chromium.launch();
let failed = 0;
for (const c of cases) {
  let r;
  try { r = await runCase(browser, c); } catch (err) { r = { name: c.name, fails: ['harness error: ' + err.message], goneAt: -1 }; }
  if (r.fails.length) failed++;
  console.log(`${r.fails.length ? 'FAIL' : 'PASS'}  ${r.name}${r.fails.length ? '\n      ' + r.fails.join('\n      ') : ` (wait class gone at ${r.goneAt} ms)`}`);
}
await browser.close();
console.log(`\n${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
