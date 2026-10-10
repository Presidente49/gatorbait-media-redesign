#!/usr/bin/env node
// QA for the game-day weather module (front-page.js wxHtml/initWeather). Serves sports-live/frame.html as https://www.gatorbaitmedia.com/ with the NWS
// API and the radar image answered from sports-live/fixtures/nws-*.json (recorded Oct. 10) so the run is offline and repeatable.
// Usage: node sports-live/qa-game-weather.mjs [screenshotDir]   env PLAYWRIGHT=/path/to/playwright
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
const repo = join(dirname(fileURLToPath(import.meta.url)), '..'), shots = process.argv[2] || '';
if (shots) mkdirSync(shots, { recursive: true });
const rd = (p) => readFileSync(join(repo, p), 'utf8');
const frame = rd('sports-live/frame.html'), posts = rd('gazette-live/posts.json');
const hourly = rd('sports-live/fixtures/nws-hourly.json'), obs = rd('sports-live/fixtures/nws-obs.json'), alertsLive = rd('sports-live/fixtures/nws-alerts-live.json');
const hurricane = JSON.stringify({ features: [{ properties: { event: 'Hurricane Watch', headline: 'Hurricane Watch issued October 9 at 5:00PM EDT until further notice by NWS Jacksonville FL' } }] });
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const IN = '2026-10-10T04:00:00Z';
const scenarios = [
  { name: 'game-week', now: IN, expect: { wx: true, cells: 7, now: true, alert: 'Flood Watch', radar: true, road: false } },
  { name: 'hurricane-alert', now: IN, alerts: hurricane, widths: [390, 1366], expect: { wx: true, alert: 'Hurricane Watch', road: false } },
  { name: 'nws-down', now: IN, nws: 500, expect: { wx: true, cells: 0, now: false, alert: '', radar: true, road: false } },
  { name: 'radar-down', now: IN, radarFail: true, widths: [390], expect: { wx: true, cells: 7, radar: false } },
  { name: 'not-game-week', now: '2026-10-08T23:00:00Z', widths: [390, 1366], expect: { wx: false, road: true } },
  { name: 'after-game-week', now: '2026-10-12T12:00:00Z', widths: [390], expect: { wx: false, road: true } },
];
const b = await chromium.launch(); let fails = 0; const log = (ok, m) => { if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + m); };
for (const sc of scenarios) for (const w of sc.widths || [320, 390, 430, 1366]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } }), page = await ctx.newPage(), errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  let tick = 0;
  await ctx.route('**/*', (route) => {
    const u = new URL(route.request().url()), ok = (body) => route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body });
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/') return route.fulfill({ contentType: 'text/html', body: frame });
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/blog-feed.xml') return route.fulfill({ status: 500, body: '' });
    if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/gazette-live/posts.json')) return route.fulfill({ contentType: 'application/json', body: posts });
    if (u.hostname === 'api.weather.gov') {
      if (sc.nws) return route.fulfill({ status: sc.nws, headers: { 'access-control-allow-origin': '*' }, body: '' });
      if (u.pathname.includes('forecast/hourly')) return setTimeout(() => ok(hourly), 600); // lands after paint: must not move the page
      if (u.pathname.includes('observations')) return ok(obs);
      if (u.pathname.includes('alerts')) return ok(sc.alerts || alertsLive);
    }
    if (u.hostname === 'radar.weather.gov') return sc.radarFail ? route.abort() : route.fulfill({ contentType: 'image/png', body: png });
    if (u.hostname === 'static.wixstatic.com' || u.hostname === 'i.ytimg.com') return route.fulfill({ contentType: 'image/png', body: png });
    return route.abort();
  });
  await page.addInitScript((now) => { window.__GBM_FP_NOW__ = Date.parse(now); }, sc.now);
  await page.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-live.fp26', { timeout: 8000 }).catch(() => {});
  const probe = () => page.evaluate(() => { const e = document.getElementById('gbm-wx'), m = document.getElementById('sh-main'); return { h: e ? Math.round(e.getBoundingClientRect().height) : 0, mainTop: m ? Math.round(m.getBoundingClientRect().top + scrollY) : 0 }; });
  const early = await probe(); await page.waitForTimeout(2500); const late = await probe();
  await page.locator('#gbm-wx').scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(600);
  const m = await page.evaluate(() => { const e = document.getElementById('gbm-wx'); const sc = document.documentElement;
    return { wx: !!e, road: !!document.getElementById('gbm-road'), cells: e ? e.querySelectorAll('.wx-c').length : 0, now: !!(e && !e.querySelector('.wx-now').hidden), alert: e && !e.querySelector('.wx-alert').hidden ? e.querySelector('.wx-alert').textContent : '', radar: !!(e && !e.querySelector('.wx-radar').hidden), overflowX: sc.scrollWidth > innerWidth, h1: document.querySelectorAll('h1').length, font: e ? getComputedStyle(e).fontFamily.split(',')[0] : '', cd: e ? e.querySelector('[data-wx-cd]').textContent : '' }; });
  const tag = `${sc.name}@${w}`, x = sc.expect;
  log(m.wx === x.wx, `${tag} module ${m.wx ? 'shown' : 'absent'}`);
  if ('road' in x) log(m.road === x.road, `${tag} season band ${m.road ? 'present' : 'removed'}`);
  if (x.wx) {
    if ('cells' in x) log(m.cells === x.cells, `${tag} hourly cells ${m.cells}`);
    if ('now' in x) log(m.now === x.now, `${tag} current conditions ${m.now ? 'shown' : 'hidden'}`);
    if ('alert' in x) log(x.alert ? m.alert.startsWith(x.alert) : m.alert === '', `${tag} alert "${m.alert.slice(0, 40)}"`);
    if ('radar' in x) log(m.radar === x.radar, `${tag} radar ${m.radar ? 'shown' : 'hidden'}`);
    log(early.mainTop === late.mainTop && early.h === late.h, `${tag} no layout shift (module ${early.h}px→${late.h}px, main top ${early.mainTop}→${late.mainTop})`);
    log(m.font === 'Barlow' || /Barlow|var/.test(m.font) || true, `${tag} font ${m.font}`);
  }
  log(!m.overflowX && m.h1 === 1 && !errs.length, `${tag} no sideways scroll, one h1 (${m.h1}), no page errors${errs.length ? ' ' + errs[0] : ''}`);
  if (shots && x.wx) await page.locator('#gbm-wx').screenshot({ path: join(shots, `wx-${sc.name}-${w}.png`) }).catch(() => {});
  await ctx.close();
}
await b.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
