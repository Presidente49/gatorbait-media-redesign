#!/usr/bin/env node
// Front Page 2026 browser QA. Serves sports-live/frame.html AS https://www.gatorbaitmedia.com/
// (Lesson 34: fixtures use the real origin) with every network dependency routed locally:
// /blog-feed.xml is generated from gazette-live/posts.json, images get local stand-ins,
// tsParticles comes from TSP_FILE when given (the CDN is used live).
// Usage: node sports-live/qa-front-page.mjs [screenshotDir]
//   env PLAYWRIGHT=/path/to/playwright  TSP_FILE=/path/tsparticles.slim.bundle.min.js  PHOTO_DIR=/dir/with/jpgs  OLD_CSS_FILE=/path/old.css
//   env QA_ONLY=<scenario name prefix> runs only matching scenarios (e.g. QA_ONLY=story for the blog post page checks).
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = process.argv[2] || '';
if (shots) mkdirSync(shots, { recursive: true });
const frame = readFileSync(join(repo, 'sports-live/frame.html'), 'utf8');
// Story pages: the Wix-post fixture and the built Share + Story Kit embed (sports-live/share.js) it loads.
const storyFixture = readFileSync(join(repo, 'sports-live/qa-story.html'), 'utf8');
const shareJs = readFileSync(join(repo, 'sports-live/share.js'), 'utf8');
// Fan modules: the chunk front-page.js fetches once endpoints.json names a Worker.
const fanJs = readFileSync(join(repo, 'sports-live/fan-modules.js'), 'utf8');
const feed = JSON.parse(readFileSync(join(repo, 'gazette-live/posts.json'), 'utf8'));
const tsp = process.env.TSP_FILE && existsSync(process.env.TSP_FILE) ? readFileSync(process.env.TSP_FILE) : null;
const photos = process.env.PHOTO_DIR ? readdirSync(process.env.PHOTO_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f)).map((f) => readFileSync(join(process.env.PHOTO_DIR, f))) : [];
// OLD_CSS_FILE: the previous renderer's CSS, injected as #gbgz-styles like the split Wix-served embeds do.
const oldCss = process.env.OLD_CSS_FILE && existsSync(process.env.OLD_CSS_FILE) ? readFileSync(process.env.OLD_CSS_FILE, 'utf8') : null;

// Fan modules: endpoints.json names the Workers; the three fake hosts answer with the desks' recorded Worker responses.
const EP = { call: 'https://gatorbait-make-the-call.qa.workers.dev', ask: 'https://ask-gatorbait.qa.workers.dev', stands: 'https://the-stands.qa.workers.dev' };
const callRec = JSON.parse(readFileSync(join(repo, 'deploy/dept-ideas/web/recorded.json'), 'utf8'));
const askRec = JSON.parse(readFileSync(join(repo, 'deploy/dept-ideas/ai/recorded.json'), 'utf8'));
const CORS = { 'access-control-allow-origin': 'https://www.gatorbaitmedia.com', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' };
const jsonRes = (body, status = 200) => ({ status, contentType: 'application/json', headers: CORS, body: JSON.stringify(body) });

// GatorBait Magazine signup (sports-live/src/capture.js): a stand-in for www.wixapis.com's visitor token and Wix Forms
// Create Submission. mode 'ok' accepts; 'no-source-field' rejects the signup_source key like a form without that field
// (UNKNOWN_VALUE_ERROR), then accepts the resend; 'down' fails both. Every request is recorded for the checks.
const WIX_CORS = { 'access-control-allow-origin': 'https://www.gatorbaitmedia.com', 'access-control-allow-methods': 'POST,OPTIONS', 'access-control-allow-headers': 'authorization,content-type' };
function wixStub(route, u, mode, log) {
  const req = route.request();
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: WIX_CORS, body: '' });
  const body = JSON.parse(req.postData() || '{}');
  log.push({ path: u.pathname, body, auth: req.headers()['authorization'] || '' });
  const res = (status, j) => route.fulfill({ status, contentType: 'application/json', headers: WIX_CORS, body: JSON.stringify(j) });
  if (mode === 'down') return res(503, { message: 'unavailable' });
  if (u.pathname === '/oauth2/token') return body.grantType === 'anonymous' && body.clientId ? res(200, { access_token: 'OauthNG.JWS.qa-visitor', token_type: 'Bearer', expires_in: 14400, refresh_token: 'JWS.qa' }) : res(400, { message: 'bad grant' });
  if (u.pathname === '/form-submission-service/v4/submissions') {
    const v = (body.submission || {}).submissions || {};
    if (mode === 'no-source-field' && 'signup_source' in v) return res(400, { message: 'validation', details: { validationError: { fieldViolations: [{ field: 'submission.submissions', description: 'UNKNOWN_VALUE_ERROR', data: { errorPath: 'signup_source', errorType: 'UNKNOWN_VALUE_ERROR' } }] } } });
    return res(200, { submission: { id: 'qa-sub', formId: body.submission.formId, namespace: 'wix.form_app.form', status: 'CONFIRMED', submissions: v } });
  }
  return res(404, { message: 'not found' });
}
const FORM_ID = '6babfee8-147f-428a-9e14-6b72f6225835';
// Fill and send one capture card; returns the recorded requests that the click caused.
async function signUp(page, sel, log, { email = 'reader@example.com', consent = true } = {}) {
  const from = log.length;
  await page.fill(sel + ' input[type=email]', email);
  if (consent) await page.check(sel + ' input[name=consent]');
  await page.click(sel + ' .gbc-b');
  await page.waitForFunction((s) => { const b = document.querySelector(s); return b && b.getAttribute('data-state') !== 'sending'; }, sel, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(150);
  return log.slice(from);
}
function checkSignup(reqs, source, bad, phase, { tagged = true } = {}) {
  const subs = reqs.filter((r) => r.path === '/form-submission-service/v4/submissions');
  const last = subs[subs.length - 1];
  if (!last) { bad.push(`${phase}no submission sent`); return; }
  const v = last.body.submission.submissions || {};
  if (last.body.submission.formId !== FORM_ID) bad.push(`${phase}formId ${last.body.submission.formId}`);
  if (v.email_gatorbait !== 'reader@example.com' || v.subscribe_gatorbait !== true) bad.push(`${phase}submission values ${JSON.stringify(v)}`);
  if (tagged ? v.signup_source !== source : 'signup_source' in v) bad.push(`${phase}signup_source ${JSON.stringify(v.signup_source)} (want ${tagged ? source : 'none'})`);
  if (!/^OauthNG\.JWS\.qa-visitor$/.test(last.auth)) bad.push(`${phase}submission not sent with the visitor token`);
  if (Object.keys(v).some((k) => !['email_gatorbait', 'subscribe_gatorbait', 'signup_source'].includes(k))) bad.push(`${phase}stray keys ${Object.keys(v)}`);
}

// The committed feed from the scoreboard job (automation/scoreboard_feed.py).
const repoScoreboard = existsSync(join(repo, 'sports-live/scoreboard.json')) ? JSON.parse(readFileSync(join(repo, 'sports-live/scoreboard.json'), 'utf8')) : null;
const x = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rss = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${feed.posts.map((p) =>
  `<item><title>${x(p.title)}</title><link>${x(p.url)}</link><description>${x(p.excerpt)}</description><dc:creator>${x(p.author)}</dc:creator><pubDate>${new Date(p.firstPublishedDate).toUTCString()}</pubDate>${p.image ? `<enclosure url="${x(p.image.src)}" type="image/jpeg"/>` : ''}</item>`).join('')}</channel></rss>`;
const png1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

const T = {
  day: '2026-09-29T15:00:00Z', // Tue 11 a.m. ET
  night: '2026-10-01T01:15:00Z', // Wed 9:15 p.m. ET: show is live
  gamePre: '2026-10-03T17:00:00Z', // Sat 1 p.m. ET, before Missouri kickoff
  gameLive: '2026-10-03T21:10:00Z', // Sat 5:10 p.m. ET: game night
};
const DESK_LIVE = { kickoff: '2026-10-03T19:30:00Z', until: '2026-10-05T04:00:00Z', status: 'live', clock: 'Q3 8:14', when: 'Saturday, Oct. 3 · 3:30 p.m. ET · ABC', venue: 'Faurot Field, Columbia, Mo.',
  away: { name: 'Florida', rank: 8, record: '4-0', score: 24, quarters: [7, 10, 7] }, home: { name: 'Missouri', rank: 25, record: '3-1', score: 17, quarters: [3, 7, 7] },
  headline: 'QA fixture only', drive: 'QA fixture drive line', updates: [['Q3', 'QA fixture update one'], ['Q2', 'QA fixture update two']], links: [['Missouri first look', '/post/first-look-missouri-florida-gators-show-me-state-of-mind']] };

const BUDDY_NEWEST = Math.max(...feed.posts.filter((p) => /buddy martin/i.test(p.author)).map((p) => Date.parse(p.firstPublishedDate)));
const LATE = new Date(BUDDY_NEWEST + 8 * 86400000).toISOString();
const LATE_PLUS_DAY = new Date(BUDDY_NEWEST + 9 * 86400000).toISOString();
const NEWEST_OTHER_PATH = new URL(feed.posts.find((p) => !/buddy martin/i.test(p.author)).url).pathname;

const scenarios = [
  { name: 'day-light', now: T.day, scheme: 'light', expect: { night: true, gameday: false, embers: true, lead: 'buddy', road: 1, roadCards: 12, roadWins: 4 } }, // Swamp Night is the everyday look (config look: swamp-night); band from the bundled schedule
  { name: 'day-dark', now: T.day, scheme: 'dark', expect: { night: true, gameday: false, lead: 'buddy', embers: true } },
  { name: 'night', now: T.night, scheme: 'light', expect: { night: true, gameday: false, embers: true, showLive: true } },
  { name: 'gameday-pre', now: T.gamePre, scheme: 'light', expect: { night: true, gameday: true, road: 1, tunnel: 'pre', tunnelOpp: 'Missouri', tunnelOppRecord: '3-1' } }, // record from the bundled scoreboard.json (next.opponentRecord, fed by The Scout)
  { name: 'gameday-live', now: T.gameLive, scheme: 'light', desk: DESK_LIVE, expect: { night: true, gameday: true, embers: true, boardLive: true, tunnel: 'live', tunnelScore: '24' } },
  { name: 'reduced-motion', now: T.night, scheme: 'light', reduced: true, expect: { night: true, embers: false, noAnimations: true } },
  { name: 'rss-down', now: T.day, scheme: 'light', rss: 500, widths: [390], expect: { lead: 'buddy' } },
  { name: 'all-feeds-down', now: T.day, scheme: 'light', rss: 500, pages: 500, widths: [390], expect: {} },
  // Lead-rule scenarios derive their clock from the bundled feed: 8 days after Buddy's newest piece, so no Buddy column is fresh and the rule falls to the pin, then to the newest story.
  { name: 'pin-timed', now: LATE, pins: { timed: { path: NEWEST_OTHER_PATH, until: LATE_PLUS_DAY } }, widths: [390], expect: { lead: 'pin' } },
  { name: 'pin-breaking', now: T.day, pins: { breaking: { path: '/post/first-look-missouri', until: '2026-10-01T00:00:00Z' } }, widths: [390], expect: { lead: 'breaking' } },
  { name: 'newest-no-buddy', now: LATE, pins: { timed: null }, widths: [390], expect: { lead: 'newest' } },
  { name: 'scoreboard-json', now: T.day, scoreboard: repoScoreboard, widths: [390, 1366], expect: { scoreboard: 'feed', standings: true, road: 1, roadCards: 12, roadLinks: 2, roadRank: true } },
  // Feed lands after the 1.5 s paint budget (phones did on Sept. 30): the band paints from the bundle, then swaps off screen to the fresh result.
  { name: 'scoreboard-late', now: T.day, scoreboardDelay: 2200, scoreboard: repoScoreboard && { ...repoScoreboard, schedule: repoScoreboard.schedule.map((g) => g.opponent === 'Missouri' ? { ...g, status: 'final', score: { fla: 31, opp: 24 } } : g) }, widths: [390, 1366], expect: { scoreboard: 'feed', road: 1, roadCards: 12, roadWins: 5 } },
  { name: 'scoreboard-live', now: T.gameLive, scoreboard: repoScoreboard && { ...repoScoreboard, live: { eventId: 'qa', clock: '8:14', period: 3, score: { fla: 24, opp: 17 }, possession: 'fla', lastPlay: 'QA fixture play' } }, widths: [390, 1366], expect: { scoreboard: 'feed', gameday: true, boardLive: true, tunnel: 'live', tunnelScore: '24' } },
  { name: 'split-embeds', now: T.day, oldStyles: true, widths: [390, 1366], expect: {} },
  // Fan modules. endpoints.json arrives 500 ms after paint (inside the renderer's 800 ms budget): Make the Call goes under The Road Ahead and Ask GatorBait under the show
  // module while both are off screen (nothing in view moves), from the recorded Worker responses. data-fp-modules lists what the file
  // names; The Stands is named but stays out because a Tuesday is not game day.
  { name: 'endpoints', now: T.day, endpoints: EP, endpointsDelay: 500, widths: [390, 1366], expect: { lead: 'buddy', road: 1, modules: 'call ask stands', call: '49', callState: 'set-or-pick', askTrivia: true, askAfter: 'fp-mod-show', stands: false, stable: true } },
  // Game day, live: The Stands sits inside The Tunnel under the CTA row, Ask GatorBait under The Tunnel, Make the Call (locked at kickoff) under the band.
  { name: 'endpoints-gameday', now: T.gameLive, endpoints: EP, scoreboard: repoScoreboard && { ...repoScoreboard, live: { eventId: 'qa', clock: '8:14', period: 3, score: { fla: 24, opp: 17 }, possession: 'fla', lastPlay: 'QA fixture play' } }, widths: [390, 1366], expect: { gameday: true, tunnel: 'live', modules: 'call ask stands', call: '49', callState: 'locked', askTrivia: true, askAfter: 'fp-tunnel', stands: true, stable: true, lowLeadOk: true } },
  // No endpoints.json (404): nothing mounts, no placeholder, nothing moves.
  { name: 'endpoints-404', now: T.gameLive, endpoints: 404, scoreboard: repoScoreboard, expect: { gameday: true, modules: 'none', noModules: true, stable: true } },
  // GatorBait Magazine signup from the hub: consent gate, a tagged submission, the thank-you state after reload.
  { name: 'capture-home', now: T.day, widths: [320, 390, 1366], expect: { signup: 'tagged' } },
  // The form has no signup_source field yet: Wix rejects the key, the module resends once without it.
  { name: 'capture-home-untagged', now: T.day, wix: 'no-source-field', widths: [390], expect: { signup: 'untagged' } },
  { name: 'capture-home-down', now: T.day, wix: 'down', widths: [390], expect: { signupDown: true } },
  { name: 'capture-home-joined', now: T.day, joined: true, widths: [390, 1366], expect: {} },
];
const WIDTHS = [320, 390, 430, 1366];
const only = (list) => process.env.QA_ONLY ? list.filter((sc) => sc.name.startsWith(process.env.QA_ONLY)) : list;

const failures = [];
const browser = await chromium.launch();
for (const sc of only(scenarios)) {
  for (const width of sc.widths || WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 }, colorScheme: sc.scheme || 'light', reducedMotion: sc.reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    let photoTurn = 0;
    const wixLog = [];
    if (sc.joined) await page.addInitScript(() => { try { localStorage.setItem('gbm-capture-joined', '1'); } catch (_) {} });
    await ctx.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/') {
        let html = frame;
        if (sc.oldStyles && oldCss) html = html.replace('</head>', `<style id="gbgz-styles">${oldCss}</style></head>`);
        return route.fulfill({ contentType: 'text/html', body: html });
      }
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/blog-feed.xml') return sc.rss ? route.fulfill({ status: sc.rss, body: '' }) : route.fulfill({ contentType: 'application/rss+xml', body: rss });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/gazette-live/posts.json')) return sc.pages ? route.fulfill({ status: sc.pages, body: '' }) : route.fulfill({ contentType: 'application/json', body: JSON.stringify(feed) });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/scoreboard.json')) {
        const send = () => sc.scoreboard ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(sc.scoreboard) }) : route.fulfill({ status: 404, body: '' });
        if (sc.scoreboardDelay) setTimeout(send, sc.scoreboardDelay); else send();
        return;
      }
      if (u.pathname.endsWith('/sports-live/fan-modules.js')) return route.fulfill({ contentType: 'application/javascript', body: fanJs });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/deploy/cloudflare/endpoints.json')) {
        const send = () => sc.endpoints && sc.endpoints !== 404 ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(sc.endpoints) }) : route.fulfill({ status: 404, body: '' });
        if (sc.endpointsDelay) setTimeout(send, sc.endpointsDelay); else send();
        return;
      }
      if (u.origin === EP.call) return route.fulfill(u.pathname === '/v1/game/' + callRec.gameId ? jsonRes(callRec) : jsonRes({ error: 'not found' }, 404));
      if (u.origin === EP.ask) {
        const m = route.request().method();
        if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS, body: '' });
        if (u.pathname === '/trivia/today') return route.fulfill(jsonRes(askRec.trivia.today));
        if (u.pathname === '/trivia/answer') return route.fulfill(jsonRes(askRec.trivia.answer));
        if (u.pathname === '/ask') { const q = JSON.parse(route.request().postData() || '{}').q; const hit = askRec.asks.find((a) => a.q === q); return route.fulfill(jsonRes(hit || { answer: '', grounded: false, sources: [], error: 'Not in our material.' })); }
        return route.fulfill(jsonRes({ error: 'not found' }, 404));
      }
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/_functions/standsToken') return route.fulfill({ status: 404, body: '' }); // no Velo bridge in the fixture: the room shows "Sign in to chat"
      if (u.hostname === 'www.wixapis.com') return wixStub(route, u, sc.wix || 'ok', wixLog);
      if (u.hostname === 'cdn.jsdelivr.net' && u.pathname.includes('@tsparticles/slim@3.9.1')) return tsp ? route.fulfill({ contentType: 'application/javascript', body: tsp }) : route.abort();
      if (u.pathname.includes('95dd8a25863b4556b7ba6398fcfd0316')) return route.fulfill({ contentType: 'image/png', body: png1 });
      if (u.hostname === 'static.wixstatic.com' || u.hostname === 'i.ytimg.com') return route.fulfill({ contentType: 'image/jpeg', body: photos.length ? photos[photoTurn++ % photos.length] : png1 });
      return route.abort();
    });
    await page.addInitScript(({ now, pins, desk }) => {
      window.__GBM_FP_NOW__ = Date.parse(now);
      if (pins) window.__GBM_HOME_PINS__ = pins;
      if (desk) window.__GBM_GAMEDAY__ = desk;
    }, { now: sc.now, pins: sc.pins || null, desk: sc.desk || null });
    await page.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'load' });
    await page.waitForSelector('#gbm-live.fp26', { timeout: 8000 }).catch(() => {});
    // Layout stability: viewport-relative tops of every block in view, keyed per element, so a module that mounts
    // (or a feed that lands) after paint must not move anything the reader can see. Sideways ticker, embers,
    // the tunnel scene and the countdown digits are excluded, like the overflow check.
    const snap = () => page.evaluate(() => {
      const out = {}, root = document.querySelector('#gbm-live'); if (!root) return out;
      window.__qaN = window.__qaN || 0;
      for (const el of root.querySelectorAll('section,article,main,nav,header,h1,h2,h3,li,figure,table,form,.fp-mod')) {
        if (el.closest('.fp-tk-view,#fp-embers,.fp-tn-scene,#gr-track,.fp-cd')) continue;
        const b = el.getBoundingClientRect(); if (!b.height || b.bottom <= 0 || b.top >= innerHeight) continue;
        out[el.__qaId || (el.__qaId = 'n' + (++window.__qaN))] = Math.round(b.top);
      }
      return out;
    });
    const moved = (a, b) => Object.keys(a).filter((k) => k in b && Math.abs(a[k] - b[k]) > 1).length;
    const jumps = [];
    const atPaint = sc.expect.stable ? await snap() : null;
    await page.waitForTimeout(sc.expect.embers ? 3400 : 1800); // embers load after a 1 s settle plus an idle slot
    if (sc.expect.stable) {
      const n = moved(atPaint, await snap()); if (n) jumps.push(`${n} blocks moved in view after paint`);
      // Scroll the page in steps; on each step nothing in view may move once the scroll settles (a module that mounts
      // above the viewport as its anchor leaves must pay its own height back).
      const total = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 500; y < total + 500; y += 500) {
        const before = await page.evaluate((y) => { scrollTo(0, y); return scrollY; }, y);
        const a = await snap(); await page.waitForTimeout(250); const b = await snap();
        const n = moved(a, b); if (n) jumps.push(`${n} blocks moved at scroll ${before}`);
      }
      await page.waitForTimeout(400);
      await page.evaluate(() => scrollTo(0, 0));
    }
    const r = await page.evaluate(() => {
      const root = document.querySelector('#gbm-live');
      const vw = document.documentElement.clientWidth;
      const off = [];
      if (root) for (const el of root.querySelectorAll('*')) {
        if (el.closest('.fp-tk-view,#fp-embers,.fp-sr,.fp-skip,#gr-track,.fp-tn-scene')) continue; // #gr-track scrolls sideways by design; the tunnel scene is clipped by its section
        const b = el.getBoundingClientRect();
        if (b.width && (b.right > vw + 1 || b.left < -1)) off.push(el.className || el.tagName);
      }
      const links = root ? [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')) : [];
      const badLinks = links.filter((h) => !(h.startsWith('/') || h.startsWith('#') || /^https:\/\/(www\.gatorbaitmedia\.com|www\.youtube\.com|www\.facebook\.com|gatorbait2026\.itemorder\.com)\//.test(h)));
      const fonts = new Set(); if (root) for (const el of root.querySelectorAll('*')) fonts.add(getComputedStyle(el).fontFamily);
      const h1 = root && root.querySelector('h1');
      return {
        root: !!root, cls: root ? root.className : '', lead: root && root.getAttribute('data-fp-lead'), sbSource: root && root.getAttribute('data-fp-scoreboard'),
        scrollW: document.documentElement.scrollWidth, vw, off: off.slice(0, 5), badLinks, fonts: [...fonts],
        h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + scrollY) : -1, vh: innerHeight,
        embers: !!document.querySelector('#fp-embers canvas'), board: !!document.querySelector('.fp-board'), boardState: (document.querySelector('.fp-board .fp-status') || {}).dataset?.state,
        showLive: document.querySelector('.fp-show')?.getAttribute('data-live') === '1', standings: !!document.querySelector('.fp-stand'),
        anims: document.getAnimations().filter((a) => a.playState === 'running').length, oldMedia: document.getElementById('gbgz-styles')?.media ?? null,
        cd: document.querySelector('[data-fp-count]')?.textContent || '', ids: document.querySelectorAll('#gbm-live').length,
        road: document.querySelectorAll('#gbm-road').length, shareBtns: document.querySelectorAll('[data-share]').length, shareMin: Math.min.apply(null, [].slice.call(document.querySelectorAll('[data-share]')).map(function (b) { return b.getBoundingClientRect().height; }).concat([99])), roadCards: document.querySelectorAll('#gbm-road .g').length, roadWins: document.querySelectorAll('#gbm-road .g.w').length,
        roadLinks: document.querySelectorAll('#gbm-road a.g[href]').length, roadRank: !!document.querySelector('#gbm-road .rk'), roadNext: (document.querySelector('#gbm-road .g.nx .op') || {}).textContent || '',
        tunnel: !!document.querySelector('.fp-tunnel'), tunnelPhase: document.querySelector('.fp-tunnel')?.dataset.phase || '', tunnelCd: document.querySelector('.fp-tunnel [data-fp-count]')?.textContent || '',
        tunnelScore: document.querySelector('.fp-tunnel [data-tn=away]')?.textContent || '', tunnelStories: document.querySelectorAll('.fp-tunnel .fp-tn-stories a').length,
        // The opponent's line in the Tunnel matchup: <small>No. 25 · 3-1</small><b>Missouri</b>; the record is the last ' · ' part.
        tunnelOpp: [...document.querySelectorAll('.fp-tunnel .fp-tn-match .fp-tn-team')].map((t) => ({ name: t.querySelector('b')?.textContent || '', line: t.querySelector('small')?.textContent || '' })).find((t) => t.name !== 'Florida') || null,
        modules: root && root.getAttribute('data-fp-modules'),
        call: !!document.querySelector('#gbm-call'), callPrev: document.querySelector('#gbm-call')?.previousElementSibling?.id || '', callLoaded: document.querySelector('#gbm-call')?.dataset.loaded || '', callState: document.querySelector('#gbm-call')?.dataset.state || '',
        callCount: document.querySelector('#gbm-call [data-c=count]')?.textContent || '', callBars: [...document.querySelectorAll('#gbm-call .bins .bar i')].filter((i) => parseFloat(i.style.width) > 0).length,
        ask: !!document.querySelector('.fp-ask'), askPrev: document.querySelector('.fp-ask')?.previousElementSibling?.className || '', askTrivia: document.querySelector('.fp-ask-tq')?.textContent || '', askOpts: document.querySelectorAll('.fp-ask-opt').length,
        stands: !!document.querySelector('#gbm-stands .gbs'), standsIn: !!document.querySelector('.fp-tunnel .fp-tn-cta + #gbm-stands .gbs'), standsCount: document.querySelector('#gbm-stands [data-gbs=count]')?.textContent || '', standsQuiet: document.querySelector('#gbm-stands .gbs')?.dataset.quiet || '',
        globals: { call: window.__GBM_CALL_API__ || '', ask: window.__GBM_ASK_URL__ || '', stands: window.__GBM_STANDS__ ? window.__GBM_STANDS__.api + ' ' + window.__GBM_STANDS__.room : '' },
        capture: (() => {
          const c = document.querySelectorAll('[data-gbm-capture]'), home = document.querySelector('#gbm-live .fp-hub-grid > [data-gbm-capture="home"]'), show = document.querySelector('#gbm-live .fp-mod-show');
          const b = home && home.getBoundingClientRect(), consent = home && home.querySelector('input[name=consent]');
          return { count: c.length, home: !!home, state: home ? home.getAttribute('data-state') : '', afterShow: !!(home && show && (show.compareDocumentPosition(home) & 4)), oldNews: document.querySelectorAll('#gbm-live .fp-mod-news').length,
            w: b ? Math.round(b.width) : 0, left: b ? Math.round(b.left) : 0, checked: consent ? consent.checked : null, privacy: home ? (home.querySelector('a[href$="/policies"]') || {}).href || '' : '',
            text: home ? home.textContent.replace(/\s+/g, ' ') : '', css: document.querySelectorAll('#gbm-capture-css').length, bar: document.querySelectorAll('#gbc-bar').length };
        })(),
      };
    });
    const e = sc.expect, bad = [];
    if (!r.root || r.ids !== 1) bad.push('root missing or duplicated');
    if (r.scrollW > r.vw) bad.push(`horizontal overflow ${r.scrollW}>${r.vw}`);
    if (r.off.length) bad.push('elements past viewport: ' + r.off.join(', '));
    if (errors.length) bad.push('page errors: ' + errors.join(' | '));
    if (r.badLinks.length) bad.push('off-policy links: ' + r.badLinks.join(', '));
    const bannedFace = /georgia|times|anton|arial|(^|,)\s*serif\s*(,|$)/i;
    const badFonts = r.fonts.filter((f) => bannedFace.test(f));
    if (badFonts.length) bad.push('fonts: ' + badFonts.join(' / '));
    if (e.lead && r.lead !== e.lead) bad.push(`lead ${r.lead} != ${e.lead}`);
    if (e.night !== undefined && r.cls.includes('fp-night') !== e.night) bad.push('night mode ' + r.cls);
    if (e.gameday !== undefined && r.cls.includes('fp-gameday') !== e.gameday) bad.push('gameday mode ' + r.cls);
    if (e.gameday && !r.tunnel) bad.push('game-day tunnel missing');
    if (e.gameday && !r.board && r.tunnelPhase !== 'pre') bad.push('game-day board missing');
    if (e.tunnel && r.tunnelPhase !== e.tunnel) bad.push(`tunnel phase ${r.tunnelPhase} != ${e.tunnel}`);
    if (e.tunnel === 'pre' && !/\d/.test(r.tunnelCd)) bad.push('tunnel countdown empty');
    if (e.tunnelScore !== undefined && r.tunnelScore !== e.tunnelScore) bad.push(`tunnel away score ${r.tunnelScore} != ${e.tunnelScore}`);
    if (e.tunnelOpp && (r.tunnelOpp || {}).name !== e.tunnelOpp) bad.push(`tunnel opponent ${JSON.stringify(r.tunnelOpp)} != ${e.tunnelOpp}`);
    if (e.tunnelOppRecord !== undefined && ((r.tunnelOpp || {}).line || '').split(' · ').pop() !== e.tunnelOppRecord) bad.push(`tunnel opponent record "${(r.tunnelOpp || {}).line}" lacks ${e.tunnelOppRecord}`);
    if (e.boardLive && r.boardState !== 'live') bad.push('board not live: ' + r.boardState);
    if (e.embers === true && tsp && !r.embers) bad.push('ember canvas missing');
    if (e.embers === false && r.embers) bad.push('embers should be off');
    if (e.showLive && !r.showLive) bad.push('show should be live');
    if (e.noAnimations && r.anims) bad.push(r.anims + ' running animations under reduced motion');
    if (e.scoreboard && r.sbSource !== e.scoreboard) bad.push('scoreboard source ' + r.sbSource);
    if (e.standings && !r.standings) bad.push('standings missing');
    if (e.road === 1 && (r.shareBtns < 1 || r.shareMin < 44)) bad.push(`share buttons ${r.shareBtns}, min height ${r.shareMin}`);
    if (e.road !== undefined && r.road !== e.road) bad.push(`season band count ${r.road} != ${e.road}`);
    if (e.roadCards !== undefined && r.roadCards !== e.roadCards) bad.push(`season band cards ${r.roadCards} != ${e.roadCards}`);
    if (e.roadWins !== undefined && r.roadWins !== e.roadWins) bad.push(`season band wins ${r.roadWins} != ${e.roadWins}`);
    if (e.roadLinks && r.roadLinks < e.roadLinks) bad.push(`season band story links ${r.roadLinks} < ${e.roadLinks}`);
    if (e.roadRank && !r.roadRank) bad.push('season band ranked opponent missing');
    if (sc.oldStyles && oldCss && r.oldMedia !== 'not all') bad.push('old #gbgz-styles still active');
    if (width < 800 && !e.lowLeadOk && r.h1Top > r.vh * 1.6) bad.push(`lead headline too low (${r.h1Top}px)`);
    if (e.modules !== undefined && r.modules !== e.modules) bad.push(`data-fp-modules "${r.modules}" != "${e.modules}"`);
    if (e.noModules && (r.call || r.ask || r.stands)) bad.push('a fan module mounted without endpoints');
    if (e.call !== undefined) {
      if (!r.call || r.callPrev !== 'gbm-road') bad.push('Make the Call not under The Road Ahead');
      if (r.callLoaded !== '1' || r.callCount !== e.call || r.callBars < 6) bad.push(`Make the Call crowd loaded=${r.callLoaded} count=${r.callCount} bars=${r.callBars}`);
      if (e.callState === 'locked' ? r.callState !== 'locked' : r.callState === 'locked') bad.push('Make the Call state ' + r.callState);
      if (r.globals.call !== EP.call + '/v1') bad.push('__GBM_CALL_API__ ' + r.globals.call);
    }
    if (e.askTrivia) {
      if (!r.ask || !r.askPrev.includes(e.askAfter)) bad.push(`Ask GatorBait after "${r.askPrev}" != ${e.askAfter}`);
      if (r.askTrivia !== askRec.trivia.today.q || r.askOpts !== 4) bad.push('Gator Trivia not loaded: ' + r.askTrivia);
      if (r.globals.ask !== EP.ask) bad.push('__GBM_ASK_URL__ ' + r.globals.ask);
    }
    if (e.stands === true && (!r.stands || !r.standsIn || r.standsCount !== 'Sign in to chat' || r.globals.stands !== EP.stands + ' game-2026-10-03')) bad.push(`The Stands: in tunnel=${r.standsIn} count="${r.standsCount}" cfg="${r.globals.stands}"`);
    if (e.stands === false && r.stands) bad.push('The Stands mounted outside game day');
    if (e.stable && jumps.length) bad.push('layout jump: ' + jumps.join(', '));
    // GatorBait Magazine signup in the hub: exactly one, after the show module, replacing the old link-only email module;
    // unchecked consent, privacy link, value line; no slide-up on the homepage.
    const cap = r.capture;
    if (!cap.home || cap.count !== 1 || !cap.afterShow || cap.oldNews || cap.css !== 1 || cap.bar) bad.push(`capture module count=${cap.count} home=${cap.home} afterShow=${cap.afterShow} oldNews=${cap.oldNews} css=${cap.css} bar=${cap.bar}`);
    else if (sc.joined ? cap.state !== 'joined' || !/on the GatorBait Magazine list/.test(cap.text) : cap.state !== 'ready' || cap.checked !== false || cap.privacy !== 'https://www.gatorbaitmedia.com/policies' || !/Buddy Martin's columns, the game-week package and Chris Spears' photos/.test(cap.text) || !/One email a day at most/.test(cap.text)) bad.push(`capture module state=${cap.state} consent=${cap.checked} privacy=${cap.privacy}`);
    if (cap.w > r.vw || cap.left < 0) bad.push(`capture module ${cap.w}px at x ${cap.left}`);
    if (e.signup) {
      // No consent, no request; then a real signup tagged "home"; a reload shows the thank-you line.
      const none = await signUp(page, '[data-gbm-capture="home"]', wixLog, { consent: false });
      const msg = await page.textContent('[data-gbm-capture="home"] .gbc-m');
      if (none.length || !/Check the box/.test(msg)) bad.push(`signup without consent sent ${none.length} requests, message "${msg}"`);
      const reqs = await signUp(page, '[data-gbm-capture="home"]', wixLog);
      checkSignup(reqs, 'home', bad, 'home signup: ', { tagged: e.signup !== 'untagged' });
      if (e.signup === 'untagged' && reqs.filter((q) => q.path.includes('submissions')).length !== 2) bad.push('home signup: expected one resend without signup_source');
      const done = await page.evaluate(() => ({ state: document.querySelector('[data-gbm-capture="home"]').getAttribute('data-state'), msg: document.querySelector('[data-gbm-capture="home"] .gbc-m').textContent, joined: localStorage.getItem('gbm-capture-joined') }));
      if (done.state !== 'done' || !/check your inbox/.test(done.msg) || !done.joined) bad.push(`home signup: ${JSON.stringify(done)}`);
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      if (scrollW > r.vw) bad.push(`home signup: overflow ${scrollW}`);
      await page.reload({ waitUntil: 'load' }); await page.waitForSelector('#gbm-live.fp26', { timeout: 8000 }).catch(() => {}); await page.waitForTimeout(1800);
      const again = await page.evaluate(() => (document.querySelector('[data-gbm-capture="home"]') || {}).getAttribute?.('data-state'));
      if (again !== 'joined') bad.push('home signup: reload state ' + again);
    }
    if (e.signupDown) {
      const reqs = await signUp(page, '[data-gbm-capture="home"]', wixLog);
      const st = await page.evaluate(() => ({ state: document.querySelector('[data-gbm-capture="home"]').getAttribute('data-state'), msg: document.querySelector('[data-gbm-capture="home"] .gbc-m').textContent, joined: localStorage.getItem('gbm-capture-joined') }));
      if (!reqs.length || st.state !== 'ready' || !/didn't go through/.test(st.msg) || st.joined) bad.push(`signup with Wix down: ${JSON.stringify(st)}`);
    }
    const tag = `${sc.name}@${width}`;
    console.log((bad.length ? 'FAIL ' : 'ok   ') + tag.padEnd(26) + ` lead=${r.lead} cls="${r.cls.replace('gbm-gazette gbm-sports-home fp26 ', '')}" h1=${r.h1Top} cd="${r.cd}"` + (r.tunnelOpp ? ` tunnel=${r.tunnelPhase}:${r.tunnelOpp.name}[${r.tunnelOpp.line}]` : '') + (sc.endpoints ? ` modules=${r.modules} call=${r.call ? r.callState + ':' + r.callCount : '-'} ask=${r.ask ? 'after ' + r.askPrev.split(' ')[0] : '-'} stands=${r.stands ? r.standsCount : '-'}` : '') + ` ${bad.join('; ')}`);
    if (bad.length) failures.push(tag + ': ' + bad.join('; '));
    if (shots && !sc.pins && !sc.rss) {
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
      await page.waitForTimeout(400);
    }
    if (shots && !sc.pins && !sc.rss) await page.screenshot({ path: join(shots, `fp-${tag.replace('@', '-')}.png`), fullPage: true });
    await ctx.close();
  }
}

// ---------- Story pages: Share button + Story Kit (guide strip, first-mention links, Keep up with the Gators) ----------
// The fixture stamps its article 300 ms after load (Wix hydration) and __qaRestamp() wipes and re-stamps it; the kit must
// mount once after the Share button, link exactly the first plain mentions, add the cards once, and come back after the wipe.
const GUIDE = 'https://www.gatorbaitmedia.com/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play';
const STORY_LINKS = [['roster', GUIDE + '#roster', 'roster'], ['schedule', GUIDE + '#schedule', 'schedule'], ['opponent', 'https://www.gatorbaitmedia.com/post/first-look-missouri-florida-gators-show-me-state-of-mind', 'Missouri Tigers']];
const STORY_CHIPS = ['Next: at No. 25 Missouri · Sat., Oct. 3 · 3:30 p.m. ET', 'Last: W 52-28 vs. No. 4 Ole Miss', 'Roster', 'Schedule', 'Stats', 'The Road Ahead', 'The Buddy Martin Show'];
const storyScenarios = [
  { name: 'story', path: '/post/qa-story-kit-fixture', widths: WIDTHS, mounted: true },
  // scoreboard.json down: the strip still mounts with the five guide links, no live chips, and no opponent link.
  { name: 'story-feed-down', path: '/post/qa-story-kit-fixture', widths: [390], mounted: true, scoreboard: 404, chips: STORY_CHIPS.slice(2), links: STORY_LINKS.slice(0, 2), sweep: 'static' },
  { name: 'story-not-post', path: '/blog-qa-story-kit-fixture', widths: [390], mounted: false },
  // GatorBait Magazine signup on story pages (sports-live/src/capture.js). The slide-up waits 45 s live; QA shortens it.
  // Signup from the mid-article card, tagged story-inline; the other card steps back and no slide-up follows.
  { name: 'story-capture-inline', path: '/post/qa-story-kit-fixture', widths: [320, 390, 1366], mounted: true, capture: 'inline' },
  // 50% scroll brings the slide-up; it steps aside while the Share sheet is open, signs up as story-slideup.
  { name: 'story-capture-slideup', path: '/post/qa-story-kit-fixture', widths: [320, 390, 430, 1366], mounted: true, capture: 'slideup', delayMs: 60000 },
  // The timer alone (no scroll) brings it; the close button and Escape remember the dismissal for 14 days.
  { name: 'story-capture-timer', path: '/post/qa-story-kit-fixture', widths: [390], height: 420, mounted: true, capture: 'timer', delayMs: 1500 },
  // Already signed up in this browser: no story cards, no slide-up; the rest of the kit is unchanged.
  { name: 'story-capture-joined', path: '/post/qa-story-kit-fixture', widths: [390], mounted: true, joined: true, capture: 'joined', delayMs: 800 },
];
// Story-page capture behaviour after the kit checks: inline signup, slide-up by scroll (and the Share sheet), by timer, dismissal memory.
async function captureFlow(page, sc, bad, wixLog, read) {
  const barState = () => page.evaluate(() => { const b = document.querySelector('#gbc-bar'); if (!b) return 'none'; const r = b.getBoundingClientRect(); return (b.classList.contains('aside') ? 'aside' : b.classList.contains('on') ? 'on' : 'off') + (b.classList.contains('on') && !b.classList.contains('aside') && r.bottom > innerHeight + 1 ? '-offscreen' : ''); });
  const vwOk = async (phase) => { const o = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth, bar: (() => { const b = document.querySelector('#gbc-bar .gbc'); if (!b) return null; const r = b.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; })(), fonts: [...new Set([...document.querySelectorAll('#gbc-bar, #gbc-bar *')].map((e) => getComputedStyle(e).fontFamily))] })); if (o.w > o.vw || (o.bar && (o.bar[0] < 0 || o.bar[1] > o.vw))) bad.push(`${phase}overflow page ${o.w}/${o.vw} bar ${o.bar}`); const bf = o.fonts.filter((f) => /georgia|times|anton|arial|(^|,)\s*serif\s*(,|$)/i.test(f)); if (bf.length) bad.push(`${phase}bar fonts ${bf}`); };
  if (sc.capture === 'inline') {
    await page.evaluate(() => document.querySelector('[data-gbm-capture="story-inline"]').scrollIntoView({ block: 'center' }));
    const reqs = await signUp(page, '[data-gbm-capture="story-inline"]', wixLog);
    checkSignup(reqs, 'story-inline', bad, 'inline signup: ');
    const st = await page.evaluate(() => ({ state: document.querySelector('[data-gbm-capture="story-inline"]').getAttribute('data-state'), endHidden: document.querySelector('[data-gbm-capture="story-end"]').hidden, joined: localStorage.getItem('gbm-capture-joined') }));
    if (st.state !== 'done' || !st.endHidden || !st.joined) bad.push(`inline signup: ${JSON.stringify(st)}`);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1300);
    if ((await barState()) !== 'none') bad.push('slide-up shown after the reader signed up');
    await vwOk('inline signup: ');
  }
  if (sc.capture === 'slideup') {
    // Wix puts comments, related posts and the footer under a story; stand in for them so the reader can leave both cards behind.
    await page.evaluate(() => { const f = document.createElement('div'); f.id = 'qa-below'; f.style.height = '1600px'; document.body.appendChild(f); });
    // Park the reader past the halfway mark: the bar comes up unless a signup card is in view.
    await page.evaluate(() => { const h = document.documentElement.scrollHeight - innerHeight; scrollTo(0, Math.ceil(h * 0.55)); });
    await page.waitForTimeout(400);
    let st = await barState();
    const cardsVisible = await page.evaluate(() => [...document.querySelectorAll('[data-gbm-capture="story-inline"],[data-gbm-capture="story-end"]')].some((c) => { const b = c.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight; }));
    if (cardsVisible) { // a card in view holds the bar back; step past the end card, where nothing but the footer is left
      if (st !== 'none') bad.push('slide-up shown while a signup card was in view');
      await page.evaluate(() => { const e = document.querySelector('[data-gbm-capture="story-end"]'); scrollTo(0, e.getBoundingClientRect().bottom + scrollY + 5); });
      await page.waitForTimeout(1300); st = await barState();
    }
    if (st !== 'on') bad.push('slide-up after 50% scroll: ' + st);
    await vwOk('slide-up: ');
    // The Share sheet opens over everything; the bar steps aside and comes back when it closes.
    await page.click('[data-share]');
    await page.waitForTimeout(1300);
    const share = await page.evaluate(() => !!document.querySelector('#gbm-share.on'));
    if (!share) bad.push('the Share sheet did not open (native share?), so the aside check did not run');
    const aside = await barState();
    if (share && aside !== 'aside') bad.push('slide-up not aside while the Share sheet is open: ' + aside);
    const z = await page.evaluate(() => { const b = document.querySelector('#gbc-bar'), sh = document.querySelector('#gbm-share'); return b && sh ? [Number(getComputedStyle(b).zIndex), Number(getComputedStyle(sh).zIndex)] : [0, 0]; });
    if (share && !(z[0] < z[1])) bad.push('slide-up z-index ' + z.join(' vs '));
    await page.keyboard.press('Escape'); await page.evaluate(() => { const v = document.getElementById('gbm-share-veil'); if (document.querySelector('#gbm-share.on') && v) v.click(); });
    await page.waitForTimeout(1300);
    if ((await barState()) !== 'on' && share) bad.push('slide-up did not return after the Share sheet closed: ' + (await barState()));
    if (!(await page.$('#gbc-bar input[type=email]'))) { bad.push('slide-up never mounted'); return; }
    const reqs = await signUp(page, '#gbc-bar', wixLog);
    checkSignup(reqs, 'story-slideup', bad, 'slide-up signup: ');
    const done = await page.evaluate(() => document.querySelector('#gbc-bar [data-gbm-capture]').getAttribute('data-state'));
    if (done !== 'done') bad.push('slide-up signup state ' + done);
    await vwOk('slide-up done: ');
  }
  if (sc.capture === 'timer') {
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(1500);
    const st = await barState();
    if (st !== 'on') bad.push('slide-up after the timer: ' + st);
    await page.click('#gbc-bar .gbc-x'); await page.waitForTimeout(500);
    const closed = await barState(), memo = await page.evaluate(() => localStorage.getItem('gbm-capture-dismissed'));
    if (closed !== 'off' || !memo) bad.push(`dismiss: bar ${closed}, remembered ${memo}`);
    // A new page view inside 14 days: no bar, whatever the scroll or the wait.
    await page.reload({ waitUntil: 'load' }); await page.waitForSelector('[data-story-kit="strip"]', { timeout: 8000 }).catch(() => {});
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(2600);
    if ((await barState()) !== 'none') bad.push('slide-up came back inside the 14-day quiet period');
    const r2 = await read(); if (r2.cap.inline !== 1 || r2.cap.end !== 1) bad.push('dismissing the bar removed the story cards');
    // 15 days later it may return.
    await page.evaluate(() => localStorage.setItem('gbm-capture-dismissed', String(Date.now() - 15 * 864e5)));
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(400); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(2400);
    if ((await barState()) !== 'on') bad.push('slide-up did not return after 14 days: ' + (await barState()));
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    if ((await barState()) !== 'off') bad.push('Escape did not close the slide-up');
  }
  if (sc.capture === 'joined') {
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1600);
    if ((await barState()) !== 'none') bad.push('slide-up shown to a signed-up reader');
    if (wixLog.length) bad.push('requests sent for a signed-up reader');
  }
}
for (const sc of only(storyScenarios)) {
  for (const width of sc.widths) {
    const ctx = await browser.newContext({ viewport: { width, height: sc.height || (width > 800 ? 900 : 844) }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    const wixLog = [];
    await ctx.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === 'www.wixapis.com') return wixStub(route, u, sc.wix || 'ok', wixLog);
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === sc.path) return route.fulfill({ contentType: 'text/html', body: storyFixture });
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/_qa/share.js') return route.fulfill({ contentType: 'application/javascript', body: shareJs });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/scoreboard.json')) return repoScoreboard && sc.scoreboard !== 404 ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(repoScoreboard) }) : route.fulfill({ status: 404, body: '' });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/gazette-live/posts.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(feed) });
      return route.abort();
    });
    await page.addInitScript(({ now, delayMs, joined }) => {
      window.__GBM_FP_NOW__ = Date.parse(now);
      window.__GBM_CAPTURE_CFG__ = { delayMs: delayMs || 60000 };
      if (joined) try { localStorage.setItem('gbm-capture-joined', '1'); } catch (_) {}
    }, { now: T.day, delayMs: sc.delayMs, joined: !!sc.joined });
    await page.goto('https://www.gatorbaitmedia.com' + sc.path, { waitUntil: 'load' });
    if (sc.mounted) await page.waitForSelector(sc.scoreboard === 404 ? '[data-story-kit="strip"]' : '[data-story-kit="strip"][data-kit-live]', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const read = () => page.evaluate(() => {
      const vw = document.documentElement.clientWidth, off = [];
      for (const el of document.querySelectorAll('[data-story-kit] *, [data-story-kit]')) {
        if (el.closest('.gbm-kit-row') && !el.classList.contains('gbm-kit-row')) continue; // chips scroll sideways by design
        const b = el.getBoundingClientRect(); if (b.width && (b.right > vw + 1 || b.left < -1)) off.push(el.className || el.tagName);
      }
      const strip = document.querySelector('[data-story-kit="strip"]'), body = document.querySelector('[data-hook="post-description"]');
      const fonts = new Set(); for (const el of document.querySelectorAll('[data-story-kit], [data-story-kit] *')) fonts.add(getComputedStyle(el).fontFamily);
      const more = document.querySelector('[data-story-kit="more"]'), ps = body ? [...body.querySelectorAll('p')].filter((p) => !p.closest('[data-story-kit]')) : [];
      return {
        scrollW: document.documentElement.scrollWidth, vw, off: off.slice(0, 5), fonts: [...fonts],
        h1W: Math.round((document.querySelector('h1') || document.body).getBoundingClientRect().width), stripW: strip ? Math.round(strip.getBoundingClientRect().width) : 0, stripX: strip ? Math.round(strip.getBoundingClientRect().left) : 0,
        runtime: !!window.__GBM_KIT_RUNTIME__, kitNodes: document.querySelectorAll('[data-story-kit]').length, css: document.querySelectorAll('#gbm-story-kit-css').length,
        strips: document.querySelectorAll('[data-story-kit="strip"]').length, afterShare: !!strip && !!strip.previousElementSibling && strip.previousElementSibling.matches('[data-share]'),
        shareBtns: document.querySelectorAll('[data-share]').length,
        chips: strip ? [...strip.querySelectorAll('.gbm-kit-chip')].map((a) => a.textContent) : [], chipHrefs: strip ? [...strip.querySelectorAll('.gbm-kit-chip')].map((a) => a.getAttribute('href')) : [],
        chipMin: Math.min(...(strip ? [...strip.querySelectorAll('.gbm-kit-chip')].map((a) => a.getBoundingClientRect().height) : [99])),
        links: body ? [...body.querySelectorAll('a.gbm-kit-link')].map((a) => [a.getAttribute('data-term'), a.getAttribute('href'), a.textContent]) : [],
        linkedAll: body ? body.getAttribute('data-story-kit-linked') : '', existing: (document.getElementById('qa-existing') || {}).innerHTML,
        inSkipped: document.querySelectorAll('h1 .gbm-kit-link, h2 .gbm-kit-link, figcaption .gbm-kit-link, [data-hook="post-metadata"] .gbm-kit-link, blockquote .gbm-kit-link, a a').length,
        bodyText: body ? (() => { const c = body.cloneNode(true); c.querySelectorAll('[data-gbm-capture]').forEach((n) => n.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); })() : '',
        cap: (() => {
          const inl = document.querySelectorAll('[data-gbm-capture="story-inline"]'), end = document.querySelectorAll('[data-gbm-capture="story-end"]');
          // The inline card follows the 4th prose paragraph (longer than 60 characters, not the byline, not a quote).
          const prose = body ? [...body.querySelectorAll('p')].filter((p) => { const t = p.textContent.replace(/\s+/g, ' ').trim(); return t.length > 60 && !p.closest('blockquote,figure,[data-story-kit]') && !/^(By\s+[A-Z]|[—–-]\s)/.test(t); }) : [];
          const i = inl[0], prev = i && i.previousElementSibling;
          return { inline: inl.length, end: end.length, endInMore: !!document.querySelector('[data-story-kit="more"] > [data-gbm-capture="story-end"]'),
            afterFourth: !!(prev && prose[3] && prev.contains(prose[3])), inBody: !!(i && body && body.contains(i)),
            checked: [...document.querySelectorAll('[data-gbm-capture] input[name=consent]')].some((c) => c.checked),
            bar: document.querySelectorAll('#gbc-bar').length, barOn: !!document.querySelector('#gbc-bar.on'), barAside: !!document.querySelector('#gbc-bar.aside'),
            css: document.querySelectorAll('#gbm-capture-css').length };
        })(),
        mores: document.querySelectorAll('[data-story-kit="more"]').length, cards: document.querySelectorAll('[data-story-kit="more"] .gbm-kit-card').length,
        moreAfterLast: !!more && !!ps.length && more.previousElementSibling !== null && more.previousElementSibling.contains(ps[ps.length - 1]),
        moreTitle: more ? more.querySelector('h3').textContent : '',
      };
    });
    const bodyTextOf = () => page.evaluate(() => { const c = document.querySelector('[data-hook="post-description"]').cloneNode(true); c.querySelectorAll('[data-gbm-capture]').forEach((n) => n.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); });
    const check = (r, bad, phase) => {
      if (r.scrollW > r.vw) bad.push(`${phase}horizontal overflow ${r.scrollW}>${r.vw}`);
      if (r.off.length) bad.push(`${phase}elements past viewport: ` + r.off.join(', '));
      // Wix's post header is a grid item: an unbreakable chip row must not widen it (production at 390 showed a 1,385 px header).
      if (r.h1W > r.vw || r.stripW > r.vw || r.stripX < 0) bad.push(`${phase}header widened: h1 ${r.h1W}, strip ${r.stripW} at x ${r.stripX} (viewport ${r.vw})`);
      const badFonts = r.fonts.filter((f) => /georgia|times|anton|arial|(^|,)\s*serif\s*(,|$)/i.test(f));
      if (badFonts.length) bad.push(`${phase}fonts: ` + badFonts.join(' / '));
      if (r.strips !== 1 || !r.afterShare) bad.push(`${phase}strip count ${r.strips}, after share button ${r.afterShare}`);
      if (r.shareBtns !== 1) bad.push(`${phase}share buttons ${r.shareBtns}`);
      if (JSON.stringify(r.chips) !== JSON.stringify(sc.chips || STORY_CHIPS)) bad.push(`${phase}chips ${JSON.stringify(r.chips)}`);
      if (r.chipMin < 44) bad.push(`${phase}chip min height ${r.chipMin}`);
      if (r.chipHrefs.some((h) => !/^https:\/\/www\.gatorbaitmedia\.com\//.test(h))) bad.push(`${phase}chip hrefs ` + r.chipHrefs.join(', '));
      if (JSON.stringify(r.links) !== JSON.stringify(sc.links || STORY_LINKS)) bad.push(`${phase}links ${JSON.stringify(r.links)}`);
      if (r.linkedAll !== (sc.sweep || 'all')) bad.push(`${phase}body sweep "${r.linkedAll}"`);
      if (r.existing !== 'schedule' || r.inSkipped) bad.push(`${phase}existing link "${r.existing}", links in skipped zones ${r.inSkipped}`);
      if (r.mores !== 1 || r.cards !== 3 || !r.moreAfterLast || r.moreTitle !== 'Keep up with the Gators') bad.push(`${phase}cards block ${r.mores}x${r.cards} afterLast=${r.moreAfterLast} "${r.moreTitle}"`);
      if (r.css !== 1) bad.push(`${phase}css tags ${r.css}`);
      const c = r.cap;
      if (sc.joined) { if (c.inline || c.end || c.bar) bad.push(`${phase}signed-up reader still sees capture: inline ${c.inline}, end ${c.end}, bar ${c.bar}`); }
      else if (!sc.capture) { /* the original kit scenarios: the cards must be there once */ if (c.inline !== 1 || c.end !== 1) bad.push(`${phase}capture cards inline ${c.inline}, end ${c.end}`); }
      if (!sc.joined && (c.inline !== 1 || !c.inBody || !c.afterFourth || c.end !== 1 || !c.endInMore || c.css !== 1)) bad.push(`${phase}capture inline=${c.inline} inBody=${c.inBody} afterFourth=${c.afterFourth} end=${c.end} inMore=${c.endInMore} css=${c.css}`);
      if (c.checked) bad.push(`${phase}a consent box starts checked`);
    };
    const bad = [];
    let r = await read();
    if (errors.length) bad.push('page errors: ' + errors.join(' | '));
    if (sc.mounted) {
      const before = await bodyTextOf();
      check(r, bad, '');
      // Article text must read exactly as authored: the links wrap words, the cards sit after the last paragraph.
      const expectedText = await page.evaluate(() => { const t = document.getElementById('qa-post').content.querySelector('[data-hook="post-description"]'); return t.textContent.replace(/\s+/g, ' ').trim(); });
      const seen = r.bodyText.replace(/Keep up with the Gators.*$/, '').trim();
      if (seen !== expectedText) bad.push('body text changed');
      // Hydration wipe: Wix replaces the article; the Share button and the kit come back exactly once.
      await page.evaluate(() => window.__qaRestamp());
      await page.waitForSelector(sc.scoreboard === 404 ? '[data-story-kit="strip"]' : '[data-story-kit="strip"][data-kit-live]', { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1200);
      r = await read();
      check(r, bad, 'after wipe: ');
      if ((await bodyTextOf()).replace(/Keep up with the Gators.*$/, '').trim() !== before.replace(/Keep up with the Gators.*$/, '').trim()) bad.push('after wipe: body text changed');
      // Extra mount calls are no-ops.
      await page.evaluate(() => { window.__GBM_KIT_RUNTIME__.mount(); window.__GBM_KIT_RUNTIME__.mount(); const b = document.querySelector('[data-hook="post-description"]'); window.GBM_CAPTURE.mountStory({ body: b, paras: [...b.querySelectorAll('p')] }); });
      r = await read();
      check(r, bad, 'after remount: ');
      if (!sc.capture && (r.cap.bar || r.cap.barOn)) bad.push('slide-up showed with no scroll and before its delay');
      await captureFlow(page, sc, bad, wixLog, read);
    } else if (r.runtime || r.kitNodes || r.css) bad.push(`kit mounted off /post/: runtime=${r.runtime} nodes=${r.kitNodes} css=${r.css}`);
    const tag = `${sc.name}@${width}`;
    console.log((bad.length ? 'FAIL ' : 'ok   ') + tag.padEnd(26) + ` strips=${r.strips} chips=${r.chips.length} links=${r.links.length} cards=${r.cards} capture=${r.cap ? r.cap.inline + '/' + r.cap.end : '-'} ${bad.join('; ')}`);
    if (bad.length) failures.push(tag + ': ' + bad.join('; '));
    if (shots && sc.mounted) await page.screenshot({ path: join(shots, `story-${width}.png`), fullPage: true });
    await ctx.close();
  }
}
await browser.close();
if (failures.length) { console.error(`\n${failures.length} failing checks`); process.exit(1); }
console.log('\nAll front-page checks passed.');
