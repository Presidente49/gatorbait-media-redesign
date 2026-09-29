#!/usr/bin/env node
// Front Page 2026 browser QA. Serves sports-live/frame.html AS https://www.gatorbaitmedia.com/
// (Lesson 34: fixtures use the real origin) with every network dependency routed locally:
// /blog-feed.xml is generated from gazette-live/posts.json, images get local stand-ins,
// tsParticles comes from TSP_FILE when given (the CDN is used live).
// Usage: node sports-live/qa-front-page.mjs [screenshotDir]
//   env PLAYWRIGHT=/path/to/playwright  TSP_FILE=/path/tsparticles.slim.bundle.min.js  PHOTO_DIR=/dir/with/jpgs  OLD_CSS_FILE=/path/old.css
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
const feed = JSON.parse(readFileSync(join(repo, 'gazette-live/posts.json'), 'utf8'));
const tsp = process.env.TSP_FILE && existsSync(process.env.TSP_FILE) ? readFileSync(process.env.TSP_FILE) : null;
const photos = process.env.PHOTO_DIR ? readdirSync(process.env.PHOTO_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f)).map((f) => readFileSync(join(process.env.PHOTO_DIR, f))) : [];
// OLD_CSS_FILE: the previous renderer's CSS, injected as #gbgz-styles like the split Wix-served embeds do.
const oldCss = process.env.OLD_CSS_FILE && existsSync(process.env.OLD_CSS_FILE) ? readFileSync(process.env.OLD_CSS_FILE, 'utf8') : null;

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

const scenarios = [
  { name: 'day-light', now: T.day, scheme: 'light', expect: { night: false, gameday: false, lead: 'buddy' } },
  { name: 'day-dark', now: T.day, scheme: 'dark', expect: { night: true, gameday: false, lead: 'buddy', embers: false } },
  { name: 'night', now: T.night, scheme: 'light', expect: { night: true, gameday: false, embers: true, showLive: true } },
  { name: 'gameday-pre', now: T.gamePre, scheme: 'light', expect: { night: false, gameday: true } },
  { name: 'gameday-live', now: T.gameLive, scheme: 'light', desk: DESK_LIVE, expect: { night: true, gameday: true, embers: true, boardLive: true } },
  { name: 'reduced-motion', now: T.night, scheme: 'light', reduced: true, expect: { night: true, embers: false, noAnimations: true } },
  { name: 'rss-down', now: T.day, scheme: 'light', rss: 500, widths: [390], expect: { lead: 'buddy' } },
  { name: 'all-feeds-down', now: T.day, scheme: 'light', rss: 500, pages: 500, widths: [390], expect: {} },
  { name: 'pin-timed', now: '2026-10-06T15:00:00Z', pins: { timed: { path: '/post/who-are-these-guys-trautwein', until: '2026-10-07T00:00:00Z' } }, widths: [390], expect: { lead: 'pin' } },
  { name: 'pin-breaking', now: T.day, pins: { breaking: { path: '/post/first-look-missouri', until: '2026-10-01T00:00:00Z' } }, widths: [390], expect: { lead: 'breaking' } },
  { name: 'newest-no-buddy', now: '2026-10-06T15:00:00Z', pins: { timed: null }, widths: [390], expect: { lead: 'newest' } },
  { name: 'scoreboard-json', now: T.day, scoreboard: { updatedAt: '2026-09-29T12:00:00Z', team: { rank: 8, record: '4-0' }, standings: [{ team: 'Florida', conf: '2-0', overall: '4-0' }, { team: 'QA Team', conf: '1-1', overall: '3-1' }] }, widths: [1366], expect: { scoreboard: 'feed', standings: true } },
  { name: 'split-embeds', now: T.day, oldStyles: true, widths: [390, 1366], expect: {} },
];
const WIDTHS = [320, 390, 430, 1366];

const failures = [];
const browser = await chromium.launch();
for (const sc of scenarios) {
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
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/scoreboard.json')) return sc.scoreboard ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(sc.scoreboard) }) : route.fulfill({ status: 404, body: '' });
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
    await page.waitForTimeout(sc.expect.embers ? 2600 : 1800);
    const r = await page.evaluate(() => {
      const root = document.querySelector('#gbm-live');
      const vw = document.documentElement.clientWidth;
      const off = [];
      if (root) for (const el of root.querySelectorAll('*')) {
        if (el.closest('.fp-tk-view,#fp-embers,.fp-sr,.fp-skip')) continue;
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
      };
    });
    const e = sc.expect, bad = [];
    if (!r.root || r.ids !== 1) bad.push('root missing or duplicated');
    if (r.scrollW > r.vw) bad.push(`horizontal overflow ${r.scrollW}>${r.vw}`);
    if (r.off.length) bad.push('elements past viewport: ' + r.off.join(', '));
    if (errors.length) bad.push('page errors: ' + errors.join(' | '));
    if (r.badLinks.length) bad.push('off-policy links: ' + r.badLinks.join(', '));
    const badFonts = r.fonts.filter((f) => /georgia|times|anton|arial|serif(?!-)/i.test(f.replace(/sans-serif/gi, '')));
    if (badFonts.length) bad.push('fonts: ' + badFonts.join(' / '));
    if (e.lead && r.lead !== e.lead) bad.push(`lead ${r.lead} != ${e.lead}`);
    if (e.night !== undefined && r.cls.includes('fp-night') !== e.night) bad.push('night mode ' + r.cls);
    if (e.gameday !== undefined && r.cls.includes('fp-gameday') !== e.gameday) bad.push('gameday mode ' + r.cls);
    if (e.gameday && !r.board) bad.push('game-day board missing');
    if (e.boardLive && r.boardState !== 'live') bad.push('board not live: ' + r.boardState);
    if (e.embers === true && tsp && !r.embers) bad.push('ember canvas missing');
    if (e.embers === false && r.embers) bad.push('embers should be off');
    if (e.showLive && !r.showLive) bad.push('show should be live');
    if (e.noAnimations && r.anims) bad.push(r.anims + ' running animations under reduced motion');
    if (e.scoreboard && r.sbSource !== e.scoreboard) bad.push('scoreboard source ' + r.sbSource);
    if (e.standings && !r.standings) bad.push('standings missing');
    if (sc.oldStyles && oldCss && r.oldMedia !== 'not all') bad.push('old #gbgz-styles still active');
    if (width < 800 && r.h1Top > r.vh * 1.6) bad.push(`lead headline too low (${r.h1Top}px)`);
    const tag = `${sc.name}@${width}`;
    console.log((bad.length ? 'FAIL ' : 'ok   ') + tag.padEnd(26) + ` lead=${r.lead} cls="${r.cls.replace('gbm-gazette gbm-sports-home fp26 ', '')}" h1=${r.h1Top} cd="${r.cd}" ${bad.join('; ')}`);
    if (bad.length) failures.push(tag + ': ' + bad.join('; '));
    if (shots && !sc.pins && !sc.rss) {
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
      await page.waitForTimeout(400);
    }
    if (shots && !sc.pins && !sc.rss) await page.screenshot({ path: join(shots, `fp-${tag.replace('@', '-')}.png`), fullPage: true });
    await ctx.close();
  }
}
await browser.close();
if (failures.length) { console.error(`\n${failures.length} failing checks`); process.exit(1); }
console.log('\nAll front-page checks passed.');
