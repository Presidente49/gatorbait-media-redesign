#!/usr/bin/env node
// Browser QA for the Make the Call module. Serves preview.html AS https://www.gatorbaitmedia.com/ (real origin, like
// sports-live/qa-front-page.mjs) at 320/390/430/1365, and routes every API request from the page into worker.mjs's
// fetch handler running on the in-memory D1 shim, so the browser talks to the real Worker code end to end.
// Usage: NODE_PATH=<scratchpad>/node_modules node deploy/dept-ideas/web/qa-module.mjs [shotsDir]
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createD1 } from './d1-shim.mjs';
import worker from './worker.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const here = dirname(fileURLToPath(import.meta.url)), repo = join(here, '../../..');
const shots = process.argv[2] || join(here, 'shots'); mkdirSync(shots, { recursive: true });
const ORIGIN = 'https://www.gatorbaitmedia.com', API = 'https://gatorbait-make-the-call.workers.dev';
const NOW = Date.parse('2026-09-30T20:00:00Z'), KICK = Date.parse('2026-10-03T19:30:00Z');
const env = { DB: createD1(readFileSync(join(here, 'schema.sql'), 'utf8')), NOW_OVERRIDE: NOW };
const files = { '/': 'preview.html', '/module.js': 'module.js', '/module.css': 'module.css', '/sports-live/src/front-page.css': join(repo, 'sports-live/src/front-page.css') };
const types = { html: 'text/html', js: 'application/javascript', css: 'text/css' };

// Seed a crowd through the Worker itself (48 devices), the same spread test-worker.mjs uses.
const spread = [[41, 17], [38, 21], [35, 24], [31, 24], [30, 27], [27, 24], [24, 27], [20, 24], [17, 24], [13, 27], [10, 31], [21, 23], [34, 20], [34, 20], [34, 20], [28, 14], [31, 21], [24, 21], [27, 17], [38, 10]];
for (let i = 0; i < 48; i++) {
  const s = spread[i % spread.length];
  const r = await worker.fetch(new Request(API + '/v1/pick', { method: 'POST', headers: { origin: ORIGIN, 'cf-connecting-ip': '198.51.100.' + i }, body: JSON.stringify({ gameId: '401856708', fla: s[0], opp: s[1], token: 'seed_' + String(i).padStart(4, '0') + '_abcdefghijkl' }) }), env);
  if (r.status !== 201) throw new Error('seed failed ' + r.status);
}
const failures = []; let apiCalls = 0, runNo = 0;
const browser = await chromium.launch();
async function run(width, opts = {}) {
  const tag = (opts.name || 'pick') + '@' + width, ip = '203.0.113.' + (++runNo);
  const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 }, colorScheme: 'dark', reducedMotion: opts.reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const e = Object.assign({}, env, { NOW_OVERRIDE: opts.now || NOW });
  await ctx.route('**/*', async (route) => {
    const req = route.request(), u = new URL(req.url());
    if (u.origin === ORIGIN && files[u.pathname]) { const p = files[u.pathname]; return route.fulfill({ contentType: types[p.split('.').pop()], body: readFileSync(p.startsWith('/') ? p : join(here, p), 'utf8') }); }
    if (u.origin === API) {
      apiCalls++;
      const h = Object.assign({}, req.headers(), { 'cf-connecting-ip': ip });
      const r = await worker.fetch(new Request(req.url(), { method: req.method(), headers: h, body: req.postData() || undefined }), e);
      return route.fulfill({ status: r.status, headers: Object.fromEntries(r.headers), body: await r.text() });
    }
    return route.abort();
  });
  await page.addInitScript(({ now }) => { window.__GBM_FP_NOW__ = now; }, { now: opts.now || NOW });
  await page.goto(ORIGIN + '/?gbm_api=live', { waitUntil: 'load' });
  // Height the instant the module painted (before the crowd feed lands) vs after: must be identical (no jump).
  const h0 = await page.evaluate(() => document.querySelector('#gbm-call')?.getBoundingClientRect().height);
  await page.waitForFunction(() => document.querySelector('#gbm-call')?.getAttribute('data-loaded') === '1', null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const r = await page.evaluate(() => {
    const S = document.querySelector('#gbm-call'), vw = document.documentElement.clientWidth, off = [], small = [], fonts = new Set();
    for (const el of S.querySelectorAll('*')) { const b = el.getBoundingClientRect(); if (b.width && (b.right > vw + 1 || b.left < -1)) off.push(el.className || el.tagName); fonts.add(getComputedStyle(el).fontFamily); }
    for (const el of S.querySelectorAll('button,input')) { const b = el.getBoundingClientRect(); if (b.height < 44 || b.width < 44) small.push(el.tagName + ':' + Math.round(b.width) + 'x' + Math.round(b.height)); }
    return { h: S.getBoundingClientRect().height, scrollW: document.documentElement.scrollWidth, vw, off: off.slice(0, 5), small, fonts: [...fonts], state: S.dataset.state, loaded: S.dataset.loaded,
      count: S.querySelector('[data-c=count]').textContent, avg: S.querySelector('[data-c=avg]').textContent, fla: S.querySelector('[data-c=fla]').textContent, top: S.querySelector('[data-c=top]').textContent,
      lock: S.querySelector('[data-c=lock]').textContent, bars: [...S.querySelectorAll('.bins .bar i')].map((i) => i.style.width), ns: [...S.querySelectorAll('.bins b')].map((b) => b.textContent), goDisabled: S.querySelector('.go').disabled, go: S.querySelector('.go').textContent };
  });
  const bad = [];
  if (r.scrollW > r.vw) bad.push(`horizontal overflow ${r.scrollW}>${r.vw}`);
  if (r.off.length) bad.push('past viewport: ' + r.off.join(', '));
  if (r.small.length) bad.push('tap targets under 44px: ' + r.small.join(', '));
  if (errors.length) bad.push('page errors: ' + errors.join(' | '));
  if (r.fonts.some((f) => /georgia|times|arial|(^|,)\s*serif\s*(,|$)/i.test(f))) bad.push('fonts: ' + r.fonts.join(' / '));
  if (Math.abs(r.h - h0) > 0.5) bad.push(`layout jump: ${h0}px at paint, ${r.h}px after feed`);
  if (r.loaded !== '1') bad.push('feed did not land: data-loaded=' + r.loaded);
  if (opts.now && opts.now >= KICK) {
    if (r.state !== 'locked' || !r.goDisabled) bad.push('should be locked: state=' + r.state + ' go=' + r.go);
  } else {
    if (r.count !== '48') bad.push('count ' + r.count + ' != 48');
    if (!/Most common call: Florida 34, Missouri 20/.test(r.top)) bad.push('top line: ' + r.top);
    if (!/Locks at kickoff · 2d 23h 30m/.test(r.lock)) bad.push('lock line: ' + r.lock);
    if (r.ns.map(Number).reduce((a, b) => a + b, 0) !== 48) bad.push('bin counts ' + r.ns.join(','));
    // Interaction: tap the steppers to Florida 31, Missouri 24, submit, expect the count to rise to 49 and the call to be remembered.
    for (let i = 0; i < 31; i++) await page.click('[data-t=fla][data-d="1"]');
    await page.fill('#gc-opp', '24');
    await page.click('.go');
    await page.waitForFunction(() => /Your call/.test(document.querySelector('#gbm-call .msg').textContent), null, { timeout: 5000 }).catch(() => {});
    const after = await page.evaluate(() => ({ msg: document.querySelector('#gbm-call .msg').textContent, count: document.querySelector('[data-c=count]').textContent, state: document.querySelector('#gbm-call').dataset.state, mine: document.querySelector('#gbm-call .bins li.mine .lb')?.textContent, h: document.querySelector('#gbm-call').getBoundingClientRect().height, fla: document.querySelector('#gc-fla').value }));
    if (after.fla !== '31') bad.push('stepper value ' + after.fla);
    if (!/Your call: Florida 31, Missouri 24 · counted/.test(after.msg)) bad.push('submit message: ' + after.msg);
    if (after.count !== '49' || after.state !== 'set' || after.mine !== 'Florida by 7-13') bad.push(`after submit count=${after.count} state=${after.state} mine=${after.mine}`);
    if (Math.abs(after.h - h0) > 0.5) bad.push(`layout jump after submit: ${h0} -> ${after.h}`);
    // Tie and update paths.
    await page.fill('#gc-opp', '31'); await page.click('.go'); await page.waitForTimeout(200);
    const tie = await page.evaluate(() => document.querySelector('#gbm-call .msg').textContent);
    if (!/No ties/.test(tie)) bad.push('tie message: ' + tie);
    await page.fill('#gc-opp', '10'); await page.click('.go');
    await page.waitForFunction(() => /updated/.test(document.querySelector('#gbm-call .msg').textContent), null, { timeout: 5000 }).catch(() => {});
    const upd = await page.evaluate(() => ({ msg: document.querySelector('#gbm-call .msg').textContent, count: document.querySelector('[data-c=count]').textContent, mine: document.querySelector('#gbm-call .bins li.mine .lb')?.textContent }));
    if (!/Florida 31, Missouri 10 · updated/.test(upd.msg) || upd.count !== '49' || upd.mine !== 'Florida by 14+') bad.push(`update: ${upd.msg} count=${upd.count} mine=${upd.mine}`);
    // Reload: the device remembers its call, the button reads Update, the crowd shows 49.
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#gbm-call')?.getAttribute('data-loaded') === '1', null, { timeout: 5000 }).catch(() => {});
    const re = await page.evaluate(() => ({ state: document.querySelector('#gbm-call').dataset.state, go: document.querySelector('.go').textContent, fla: document.querySelector('#gc-fla').value, count: document.querySelector('[data-c=count]').textContent }));
    if (re.state !== 'set' || re.go !== 'Update my call' || re.fla !== '31' || re.count !== '49') bad.push('after reload: ' + JSON.stringify(re));
    // Reset the crowd for the next width so every run starts at 48.
    env.DB._raw.exec('DELETE FROM picks WHERE rowid > 48');
  }
  await page.screenshot({ path: join(shots, `call-${tag.replace('@', '-')}.png`), fullPage: true });
  console.log((bad.length ? 'FAIL ' : 'ok   ') + tag.padEnd(16) + ` h=${Math.round(r.h)} count=${r.count} avg=${r.avg} fla=${r.fla} state=${r.state} lock="${r.lock}" ${bad.join('; ')}`);
  if (bad.length) failures.push(tag + ': ' + bad.join('; '));
  await ctx.close();
}
for (const w of [320, 390, 430, 1365]) await run(w);
await run(390, { name: 'locked', now: KICK + 600000 });
await run(390, { name: 'reduced-motion', reduced: true });
await browser.close();
console.log(`\nAPI calls served by worker.mjs during the browser run: ${apiCalls}`);
if (failures.length) { console.error(`${failures.length} failing checks:\n` + failures.join('\n')); process.exit(1); }
console.log('All Make the Call module checks passed.');
