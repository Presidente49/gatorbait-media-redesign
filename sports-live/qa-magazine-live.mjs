#!/usr/bin/env node
// Browser QA for the Magazine live refresh (pregame layout). Serves sports-live/magazine-pregame-frame.html with the local
// bundle, a fake /blog-feed.xml (sports-live/fixtures/blog-feed-2026-10-03.xml) and a fake scoreboard, then checks at
// 320/390/430/1366: the lead and cards swap to the freshest stories with no scroll movement, a block the reader is looking at is
// never swapped, a block above the viewport swaps with the reader's position held, a failed feed keeps the baked issue, and the
// live score takes the countdown slot inside the game window. No live network.
// Usage: NODE_PATH=<dir with playwright> PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node sports-live/qa-magazine-live.mjs
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const bundle = readFileSync('sports-live/magazine-pregame.js', 'utf8');
const frame = readFileSync('sports-live/magazine-pregame-frame.html', 'utf8');
const feed = readFileSync('sports-live/fixtures/blog-feed-2026-10-03.xml', 'utf8');
const issue = JSON.parse(readFileSync('sports-live/magazine-issue-pregame.json', 'utf8'));
const WIZ = '/post/something-s-got-to-give'; // freshest credited column (Buddy's Oct. 3 photo has no verified credit)
const CARDS = ['/post/coaches-and-fans-have-different-playbooks-so-have-another-round-thirsty-gators', '/post/when-it-came-to-finding-a-quarterback-sumrall-trusted-buster-and-it-paid-off', '/post/the-looming-brilliance-of-buster-faulkner-if-it-works-one-time-we-retire-it'];
const svg = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#1b3aa8"/></svg>`;
const fail = [];
const check = (ok, msg) => { if (!ok) fail.push(msg); };

async function open(browser, width, { feedStatus = 200, gate = null, time = '2026-10-03T13:00:00Z', score = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date(time));
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine') return route.fulfill({ contentType: 'text/html', body: frame });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: bundle });
    if (/^https:\/\/qa\.local\/blog-feed\.xml\?t=\d+$/.test(u)) { if (gate) await gate; return route.fulfill({ status: feedStatus, contentType: 'application/rss+xml', body: feedStatus === 200 ? feed : 'error' }); }
    if (/presidente49\.github\.io\/.*sports-live\/scoreboard\.json/.test(u)) return score ? route.fulfill({ contentType: 'application/json', body: JSON.stringify(score), headers: { 'access-control-allow-origin': '*' } }) : route.abort();
    const m = /static\.wixstatic\.com\/media\/.*\/fit\/w_(\d+),h_(\d+)/.exec(u);
    if (m) return route.fulfill({ contentType: 'image/svg+xml', body: svg(+m[1], +m[2]) });
    return route.abort();
  });
  await page.goto('https://qa.local/magazine', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-magazine-page.pg', { timeout: 8000 });
  return { ctx, page };
}
const state = (page) => page.evaluate(() => {
  const r = document.getElementById('gbm-magazine-page'), d = document.documentElement;
  const posts = [...r.querySelectorAll('#pg-cover a[href^="/post/"], #pg-lead a.pg-btn, #pg-more a.pg-card')].map((a) => a.getAttribute('href'));
  return { live: r.getAttribute('data-mz-live'), lead: r.querySelector('#pg-lead h2').textContent, by: r.querySelector('#pg-lead .pg-by').textContent, leadUrl: r.querySelector('#pg-lead a.pg-btn').getAttribute('href'),
    cards: [...r.querySelectorAll('#pg-more a.pg-card')].map((a) => a.getAttribute('href')), cover: r.querySelector('#pg-cover h1 a').getAttribute('href'), posts,
    y: scrollY, overflow: d.scrollWidth > d.clientWidth + 1, count: r.querySelector('[data-pg-count]').textContent };
});

const browser = await chromium.launch();
for (const width of [320, 390, 430, 1366]) {
  // A: reader at the top, lead and cards below the fold -> both swap, nothing moves.
  { const { ctx, page } = await open(browser, width);
    await page.waitForFunction(() => document.getElementById('gbm-magazine-page').getAttribute('data-mz-live') === 'feed', null, { timeout: 8000 });
    await page.waitForTimeout(200);
    const s = await state(page);
    check(s.leadUrl === WIZ && /Something’s Got to Give/.test(s.lead), width + ' A lead: ' + s.lead);
    check(/By Eddie Gilley/.test(s.by), width + ' A byline: ' + s.by);
    check(JSON.stringify(s.cards) === JSON.stringify(CARDS), width + ' A cards: ' + s.cards);
    check(new Set([s.cover, s.leadUrl, ...s.cards]).size === 2 + s.cards.length, width + ' A duplicate story: ' + s.posts);
    check(s.cover === issue.cover.url, width + ' A cover should link its own canonical post once the lead moved on: ' + s.cover);
    check(s.y === 0 && !s.overflow, width + ' A moved or overflowed: y=' + s.y);
    await ctx.close(); }
  // B: reader looking at the lead when the feed lands -> the lead stays put.
  { let release; const gate = new Promise((r) => { release = r; });
    const { ctx, page } = await open(browser, width, { gate });
    await page.evaluate(() => document.getElementById('pg-lead').scrollIntoView({ block: 'start' }));
    const y0 = await page.evaluate(() => scrollY); release();
    await page.waitForFunction(() => document.getElementById('gbm-magazine-page').getAttribute('data-mz-live') === 'feed', null, { timeout: 8000 });
    const s = await state(page);
    check(s.leadUrl === issue.lead.url, width + ' B swapped a lead the reader was reading');
    check(Math.abs(s.y - y0) <= 1, width + ' B scroll moved ' + (s.y - y0));
    await ctx.close(); }
  // C: lead and cards above the viewport -> swapped with the reader's spot held.
  { let release; const gate = new Promise((r) => { release = r; });
    const { ctx, page } = await open(browser, width, { gate });
    await page.evaluate(() => { const f = document.querySelector('#gbm-magazine-page .pg-foot'); window.scrollTo(0, f.getBoundingClientRect().top + scrollY - 40); });
    await page.waitForTimeout(100);
    const before = await page.evaluate(() => document.querySelector('#gbm-magazine-page .pg-foot').getBoundingClientRect().top); release();
    await page.waitForFunction(() => document.getElementById('gbm-magazine-page').getAttribute('data-mz-live') === 'feed', null, { timeout: 8000 });
    await page.waitForTimeout(150);
    const after = await page.evaluate(() => document.querySelector('#gbm-magazine-page .pg-foot').getBoundingClientRect().top);
    const s = await state(page);
    check(s.leadUrl === WIZ, width + ' C lead not swapped above the viewport');
    check(Math.abs(after - before) <= 1, width + ' C reader jumped ' + (after - before) + 'px');
    await ctx.close(); }
  // D: feed fails -> baked issue, quietly.
  { const { ctx, page } = await open(browser, width, { feedStatus: 500 });
    await page.waitForFunction(() => document.getElementById('gbm-magazine-page').getAttribute('data-mz-live') === 'baked', null, { timeout: 8000 });
    const s = await state(page);
    check(s.leadUrl === issue.lead.url && JSON.stringify(s.cards) === JSON.stringify(issue.cards.items.map((c) => c.url)), width + ' D baked issue changed');
    await ctx.close(); }
  // E: live score inside the game window, text only in the countdown slots.
  { const score = { next: { opponent: 'Missouri', kickoffIso: '2026-10-03T19:30:00Z' }, live: { clock: '5:32', period: 2, score: { fla: 14, opp: 7 } } };
    const { ctx, page } = await open(browser, width, { time: '2026-10-03T20:30:00Z', score });
    await page.waitForFunction(() => document.querySelector('#gbm-magazine-page [data-pg-count]').textContent.startsWith('FLA'), null, { timeout: 8000 }).catch(() => {});
    const s = await state(page);
    check(s.count === 'FLA 14 MIZ 7 · Q2 5:32', width + ' E score line: ' + s.count);
    check(!s.overflow, width + ' E overflow');
    await ctx.close(); }
  console.log((fail.length ? 'checked ' : 'PASS ') + width);
}
await browser.close();
if (fail.length) { console.error('FAIL\n' + fail.join('\n')); process.exit(1); }
console.log('Live refresh QA passed: swap, hold-when-reading, hold-scroll-above, baked fallback, live score at 320/390/430/1366.');
