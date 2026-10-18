// Proof test for the soft story-page signup prompt (NOT LIVE). Renders a local copy of a story page (fixture/story.html)
// as https://www.gatorbaitmedia.com/post/... with the live post template (live-before.html, reused from deploy/post-template)
// and the live Share + Story Kit + Capture bundle at the current pointer (sports-live/current.json), then:
//   BEFORE: scrolls past 50% so the old slide-up (#gbc-bar) shows, and measures how much of the screen it covers.
//   AFTER : adds soft-signup.embed.html and measures the new prompt (size, first-screen coverage, fonts, dismissal, members,
//           blocked storage, reduced motion, no network calls to Wix APIs).
// Run from the repo root:  NODE_PATH=$(npm root -g) PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node deploy/soft-signup-20261018/test.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');
const POINTER = JSON.parse(readFileSync(join(repo, 'sports-live/current.json'), 'utf8')).commit;
const shareJs = execFileSync('git', ['-C', repo, 'show', `${POINTER}:sports-live/share.js`], { encoding: 'utf8', maxBuffer: 1 << 26 });
const scoreboard = readFileSync(join(repo, 'sports-live/scoreboard.json'), 'utf8');
const fixture = readFileSync(join(here, 'fixture/story.html'), 'utf8');
const template = readFileSync(join(repo, 'deploy/post-template/live-before.html'), 'utf8');
const embed = readFileSync(join(here, 'soft-signup.embed.html'), 'utf8');
const PATH = '/post/hey-missouri-don-t-show-me-anymore';
const SIZES = [[390, 844], [430, 932], [1366, 768], [1920, 1080]];
const out = join(here, 'shots'); mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const results = []; let failures = 0;
const ok = (cond, label, into) => { into.push({ pass: !!cond, label }); if (!cond) failures++; };

async function open(w, h, { withEmbed, cfg = {}, blockStorage = false, reduced = false, ctx: shared } = {}) {
  const ctx = shared || await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 800 ? 2 : 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage(); const apiCalls = []; const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  if (blockStorage) await page.addInitScript(() => { const boom = () => { throw new DOMException('blocked', 'SecurityError'); }; Object.defineProperty(window, 'localStorage', { get: boom }); Object.defineProperty(window, 'sessionStorage', { get: boom }); });
  await page.addInitScript((c) => { window.__GBM_CAPTURE_CFG__ = { delayMs: 600000 }; window.__GBM_SOFT_CFG__ = c; }, { minMs: 1500, ...cfg });
  await page.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (/wixapis\.com$/.test(u.hostname) || /form-submission|oauth2/.test(u.pathname)) { apiCalls.push(u.href); return route.fulfill({ status: 500, body: '{}' }); }
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === PATH) return route.fulfill({ contentType: 'text/html', body: fixture.replace('<!--TEMPLATE-->', template + (withEmbed ? embed : '')) });
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/_qa/share.js') return route.fulfill({ contentType: 'text/javascript', body: shareJs });
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/get-gatorbait-free') return route.fulfill({ contentType: 'text/html', body: '<title>form page placeholder</title>' });
    if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/scoreboard.json')) return route.fulfill({ contentType: 'application/json', body: scoreboard });
    if (/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) return route.continue();
    return route.fulfill({ status: 404, body: '' });
  });
  await page.goto('https://www.gatorbaitmedia.com' + PATH, { waitUntil: 'load' });
  await page.waitForSelector('[data-hook=post-title]'); await page.evaluate(() => document.fonts.ready);
  return { page, ctx, apiCalls, errors };
}
const stamp = (w) => `${w}`;

for (const [w, h] of SIZES) {
  const checks = []; const rec = { width: w, height: h, checks };
  // ---------- BEFORE: the old slide-up ----------
  { const { page, ctx } = await open(w, h, { withEmbed: false });
    await page.waitForTimeout(500);
    await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.6));
    await page.waitForSelector('#gbc-bar.on', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(700);
    const m = await page.evaluate(() => { const b = document.querySelector('#gbc-bar .gbc') || document.getElementById('gbc-bar'); const r = b ? b.getBoundingClientRect() : null; return r ? { h: Math.round(r.height), top: Math.round(r.top), vh: innerHeight, on: document.getElementById('gbc-bar').classList.contains('on') } : null; });
    await page.screenshot({ path: join(out, `before-${w}-slideup.png`) });
    rec.before = m && { slideUpPx: m.h, viewportPx: m.vh, coverPct: +(100 * m.h / m.vh).toFixed(1), shown: m.on };
    await ctx.close(); }
  // ---------- AFTER ----------
  { const { page, ctx, apiCalls, errors } = await open(w, h, { withEmbed: true });
    const early = await page.evaluate(() => !!document.querySelector('.gss'));
    ok(!early, 'time trap: nothing rendered before a real input event and the dwell time', checks);
    await page.waitForTimeout(2200);
    ok(!(await page.evaluate(() => !!document.querySelector('.gss'))), 'time trap: still nothing after 2 s with no human input', checks);
    await page.mouse.move(40, 40); await page.mouse.wheel(0, 40); await page.waitForTimeout(1200);
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
    const m = await page.evaluate(() => {
      const g = document.querySelector('.gss'); if (!g) return null; const r = g.getBoundingClientRect(); const cs = getComputedStyle(g);
      const fams = [...g.querySelectorAll('*')].filter((n) => n.childNodes.length && [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())).map((n) => getComputedStyle(n).fontFamily);
      const a = g.querySelector('a.gss-b'), x = g.querySelector('.gss-x'), ar = a.getBoundingClientRect(), xr = x.getBoundingClientRect();
      const vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      const next = g.nextElementSibling, prev = g.previousElementSibling;
      return { h: Math.round(r.height), top: Math.round(r.top + scrollY), vh: innerHeight, position: cs.position, bg: cs.backgroundColor, fams, href: a.getAttribute('href'), btn: [Math.round(ar.width), Math.round(ar.height)], x: [Math.round(xr.width), Math.round(xr.height)], visibleOnFirstScreenPx: Math.round(vis), overflow: document.documentElement.scrollWidth - innerWidth, afterParas: prev ? prev.textContent.slice(0, 30) : '', text: g.querySelector('.gss-t').textContent, ctaText: a.textContent };
    });
    ok(m, 'prompt renders after human input', checks);
    if (m) {
      rec.after = { promptPx: m.h, viewportPx: m.vh, heightPct: +(100 * m.h / m.vh).toFixed(1), firstScreenCoverPct: +(100 * m.visibleOnFirstScreenPx / m.vh).toFixed(1), topPx: m.top };
      ok(m.position === 'static', `in the page flow, not fixed or sticky (${m.position})`, checks);
      ok(100 * m.h / m.vh <= 12 || w >= 1000, `height ${m.h}px is <= 12% of the ${m.vh}px phone screen (${(100 * m.h / m.vh).toFixed(1)}%)`, checks);
      if (w >= 1000) ok(m.h <= 100, `desktop strip stays slim (${m.h}px)`, checks);
      ok(m.visibleOnFirstScreenPx / m.vh <= 0.12, `covers ${(100 * m.visibleOnFirstScreenPx / m.vh).toFixed(1)}% of the first screen (limit 12%)`, checks);
      ok(m.fams.length && m.fams.every((f) => /^"?Barlow"?,/.test(f)), `Barlow only (${[...new Set(m.fams)].join(' | ')})`, checks);
      ok(m.href === '/get-gatorbait-free', 'link goes to the form page, set only at reveal', checks);
      ok(m.btn[1] >= 44 && m.x[0] >= 44 && m.x[1] >= 44, `44 px tap targets (button ${m.btn.join('x')}, close ${m.x.join('x')})`, checks);
      ok(m.overflow <= 0, `no sideways scroll (${m.overflow})`, checks);
      ok(m.text === 'Get GatorBait free in your inbox', 'headline text', checks);
      ok(/^I have watched Florida/.test(m.afterParas), `sits right after the 3rd paragraph (${m.afterParas})`, checks);
    }
    ok(!(await page.evaluate(() => !!document.getElementById('gbc-bar') && getComputedStyle(document.getElementById('gbc-bar')).display !== 'none')), 'old slide-up is hidden by the embed', checks);
    await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: join(out, `after-${w}-top.png`) });
    await page.evaluate(() => { const g = document.querySelector('.gss'); if (g) scrollTo(0, g.getBoundingClientRect().top + scrollY - 120); }); await page.waitForTimeout(300);
    await page.screenshot({ path: join(out, `after-${w}-prompt.png`) });
    // scroll to 60%: still no overlay
    await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.6)); await page.waitForTimeout(1500);
    const fixedCovers = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => { const s = getComputedStyle(e); return s.position === 'fixed' && s.display !== 'none' && s.visibility !== 'hidden' && e.getBoundingClientRect().height > 40 && e.getBoundingClientRect().bottom >= innerHeight - 2 && e.id !== 'gbm-site-header'; }).map((e) => e.id || e.className));
    ok(fixedCovers.length === 0, `no fixed bottom overlay at 60% scroll (${fixedCovers.join(',') || 'none'})`, checks);
    // dismiss and remember
    await page.evaluate(() => scrollTo(0, 0)); await page.click('.gss-x'); await page.waitForTimeout(200);
    ok(!(await page.evaluate(() => !!document.querySelector('.gss'))), 'close removes the prompt', checks);
    const page2 = await ctx.newPage(); await page2.route('**/*', async (r) => r.fallback());
    await page2.close();
    ok(apiCalls.length === 0, `no calls to Wix APIs or OAuth from the prompt (${apiCalls.length})`, checks);
    ok(errors.length === 0, `no page errors (${errors.join('; ')})`, checks);
    await ctx.close(); }
  // remembered dismissal across reload (same context)
  { const first = await open(w, h, { withEmbed: true }); const ctx = first.ctx;
    await first.page.mouse.wheel(0, 60); await first.page.waitForSelector('.gss', { timeout: 6000 }); await first.page.click('.gss-x'); await first.page.close();
    const second = await open(w, h, { withEmbed: true, ctx }); await second.page.mouse.wheel(0, 60); await second.page.waitForTimeout(3500);
    ok(!(await second.page.evaluate(() => !!document.querySelector('.gss'))), 'dismissal remembered after reload (localStorage)', checks);
    await ctx.close(); }
  // storage blocked
  { const { page, ctx, errors } = await open(w, h, { withEmbed: true, blockStorage: true });
    await page.mouse.wheel(0, 60); await page.waitForSelector('.gss', { timeout: 6000 }).catch(() => {});
    ok(await page.evaluate(() => !!document.querySelector('.gss')), 'storage blocked: prompt still works, no exception', checks);
    await page.click('.gss-x').catch(() => {}); await page.waitForTimeout(300);
    ok(!(await page.evaluate(() => !!document.querySelector('.gss'))), 'storage blocked: close still closes for this page view', checks);
    ok(errors.length === 0, `storage blocked: no page errors (${errors.join('; ')})`, checks);
    await ctx.close(); }
  // member hidden
  { const { page, ctx } = await open(w, h, { withEmbed: true, cfg: { member: true } });
    await page.mouse.wheel(0, 60); await page.waitForTimeout(3500);
    ok(!(await page.evaluate(() => !!document.querySelector('.gss'))), 'logged-in member (simulated): prompt never renders', checks);
    await ctx.close(); }
  // live-shell sign-in heuristic: header button with a name hides it, "Log In" does not
  for (const [label, btn, expectShown] of [['member name button', '<button data-testid="handle-button">Brenden</button>', false], ['log-in button', '<button data-testid="handle-button">Log In</button>', true]]) {
    const { page, ctx } = await open(w, h, { withEmbed: true });
    await page.evaluate((b) => { const hd = document.createElement('div'); hd.id = 'SITE_HEADER'; hd.innerHTML = b; document.body.appendChild(hd); }, btn);
    await page.mouse.wheel(0, 60); await page.waitForTimeout(3500);
    ok((await page.evaluate(() => !!document.querySelector('.gss'))) === expectShown, `header heuristic (${label}): prompt ${expectShown ? 'shown' : 'hidden'}`, checks);
    await ctx.close(); }
  // reduced motion
  { const { page, ctx } = await open(w, h, { withEmbed: true, reduced: true });
    await page.mouse.wheel(0, 60); await page.waitForSelector('.gss', { timeout: 6000 });
    const tr = await page.evaluate(() => [...document.querySelectorAll('.gss, .gss *')].map((e) => getComputedStyle(e)).every((s) => (s.transitionDuration === '0s' || !s.transitionDuration) && (s.animationName === 'none')));
    ok(tr, 'reduced motion: no transitions or animations on the prompt', checks);
    await ctx.close(); }
  results.push(rec);
}
await browser.close();
writeFileSync(join(here, 'results.json'), JSON.stringify({ pointer: POINTER, results }, null, 2));
for (const r of results) { console.log(`\n== ${r.width}x${r.height}  before: ${JSON.stringify(r.before)}  after: ${JSON.stringify(r.after)}`); for (const c of r.checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'} ${c.label}`); }
console.log(failures ? `\n${failures} FAILED` : '\nall checks pass');
process.exit(failures ? 1 : 0);
