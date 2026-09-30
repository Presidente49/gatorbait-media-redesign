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
    await page.waitForTimeout(sc.expect.embers ? 2600 : 1800);
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
];
for (const sc of only(storyScenarios)) {
  for (const width of sc.widths) {
    const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await ctx.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === sc.path) return route.fulfill({ contentType: 'text/html', body: storyFixture });
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/_qa/share.js') return route.fulfill({ contentType: 'application/javascript', body: shareJs });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/scoreboard.json')) return repoScoreboard && sc.scoreboard !== 404 ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(repoScoreboard) }) : route.fulfill({ status: 404, body: '' });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/gazette-live/posts.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(feed) });
      return route.abort();
    });
    await page.addInitScript((now) => { window.__GBM_FP_NOW__ = Date.parse(now); }, T.day);
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
        runtime: !!window.__GBM_KIT_RUNTIME__, kitNodes: document.querySelectorAll('[data-story-kit]').length, css: document.querySelectorAll('#gbm-story-kit-css').length,
        strips: document.querySelectorAll('[data-story-kit="strip"]').length, afterShare: !!strip && !!strip.previousElementSibling && strip.previousElementSibling.matches('[data-share]'),
        shareBtns: document.querySelectorAll('[data-share]').length,
        chips: strip ? [...strip.querySelectorAll('.gbm-kit-chip')].map((a) => a.textContent) : [], chipHrefs: strip ? [...strip.querySelectorAll('.gbm-kit-chip')].map((a) => a.getAttribute('href')) : [],
        chipMin: Math.min(...(strip ? [...strip.querySelectorAll('.gbm-kit-chip')].map((a) => a.getBoundingClientRect().height) : [99])),
        links: body ? [...body.querySelectorAll('a.gbm-kit-link')].map((a) => [a.getAttribute('data-term'), a.getAttribute('href'), a.textContent]) : [],
        linkedAll: body ? body.getAttribute('data-story-kit-linked') : '', existing: (document.getElementById('qa-existing') || {}).innerHTML,
        inSkipped: document.querySelectorAll('h1 .gbm-kit-link, h2 .gbm-kit-link, figcaption .gbm-kit-link, [data-hook="post-metadata"] .gbm-kit-link, blockquote .gbm-kit-link, a a').length,
        bodyText: body ? body.textContent.replace(/\s+/g, ' ').trim() : '',
        mores: document.querySelectorAll('[data-story-kit="more"]').length, cards: document.querySelectorAll('[data-story-kit="more"] .gbm-kit-card').length,
        moreAfterLast: !!more && !!ps.length && more.previousElementSibling !== null && more.previousElementSibling.contains(ps[ps.length - 1]),
        moreTitle: more ? more.querySelector('h3').textContent : '',
      };
    });
    const bodyTextOf = () => page.evaluate(() => document.querySelector('[data-hook="post-description"]').textContent.replace(/\s+/g, ' ').trim());
    const check = (r, bad, phase) => {
      if (r.scrollW > r.vw) bad.push(`${phase}horizontal overflow ${r.scrollW}>${r.vw}`);
      if (r.off.length) bad.push(`${phase}elements past viewport: ` + r.off.join(', '));
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
      await page.evaluate(() => { window.__GBM_KIT_RUNTIME__.mount(); window.__GBM_KIT_RUNTIME__.mount(); });
      r = await read();
      check(r, bad, 'after remount: ');
    } else if (r.runtime || r.kitNodes || r.css) bad.push(`kit mounted off /post/: runtime=${r.runtime} nodes=${r.kitNodes} css=${r.css}`);
    const tag = `${sc.name}@${width}`;
    console.log((bad.length ? 'FAIL ' : 'ok   ') + tag.padEnd(26) + ` strips=${r.strips} chips=${r.chips.length} links=${r.links.length} cards=${r.cards} ${bad.join('; ')}`);
    if (bad.length) failures.push(tag + ': ' + bad.join('; '));
    if (shots && sc.mounted) await page.screenshot({ path: join(shots, `story-${width}.png`), fullPage: true });
    await ctx.close();
  }
}
await browser.close();
if (failures.length) { console.error(`\n${failures.length} failing checks`); process.exit(1); }
console.log('\nAll front-page checks passed.');
