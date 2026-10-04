#!/usr/bin/env node
// Writers rail "NEW" badge, writer links and the dormant co-lead (Brenden, Oct. 4) against the built fixture.
// Serves sports-live/frame.html AS https://www.gatorbaitmedia.com/ (Lesson 34) with a fixed fixture feed, so the
// 48-hour rule and the co-lead pick are deterministic. Nothing leaves the machine; every other request is stubbed or aborted.
// Usage: node sports-live/qa-writer-badges.mjs [screenshotDir]    env PLAYWRIGHT=/path/to/playwright
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = process.argv[2] || '';
if (shots) mkdirSync(shots, { recursive: true });
const frame = readFileSync(join(repo, 'sports-live/frame.html'), 'utf8');
const config = JSON.parse(readFileSync(join(repo, 'sports-live/front-page.config.json'), 'utf8'));

const NOW = Date.parse('2026-10-06T16:00:00Z'); // Tue noon ET: no game day, no show
const H = 3600000;
const img = (k) => `https://static.wixstatic.com/media/qa_${k}~mv2.jpg`;
const P = (author, hoursAgo, slug, title, image) => ({ author, slug, title, date: new Date(NOW - hoursAgo * H).toUTCString(), image });
const POSTS = [
  P('Brenden Martin', 1, 'desk-one', 'Fixture: South Carolina kickoff time set for Saturday', img('desk1')),
  P('Buddy Martin', 10, 'buddy-col', 'Fixture: Buddy Martin column on the bye week and what Sumrall must fix', img('buddy')),
  P('Franz Beard', 20, 'franz-piece', 'Fixture: Franz Beard on the offensive line after Missouri', img('franz')),
  P('Brenden Martin', 30, 'desk-two', 'Fixture: Injury report ahead of South Carolina', img('desk2')),
  P('Eddie Gilley', 47, 'eddie-film', 'Fixture: Eddie Gilley film study, the run game', img('eddie')),
  P('Chris Spears', 49, 'chris-spears-best-shots-qa', "Chris Spears' Best Shots: fixture gallery", img('spears')),
  P('Loren Meadows', 60, 'loren-preview', 'Fixture: Loren Meadows on the South Carolina defense', img('loren')),
  P('Brenden Martin', 72, 'desk-three', 'Fixture: Recruiting notebook', img('desk3')),
  P('Franz Beard', 120, 'franz-older', 'Fixture: Older Franz Beard column', img('franz2')),
  P('Brenden Martin', 130, 'desk-four', 'Fixture: SEC power rankings', img('desk4')),
  P('Brenden Martin', 140, 'desk-five', 'Fixture: Basketball practice opens', img('desk5')),
  P('Brenden Martin', 150, 'desk-six', 'Fixture: Baseball fall ball schedule', img('desk6')),
];
const URL_OF = (slug) => `https://www.gatorbaitmedia.com/post/${slug}`;
const x = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rss = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${POSTS.map((p) =>
  `<item><title>${x(p.title)}</title><link>${URL_OF(p.slug)}</link><description>${x(p.title + '. Fixture excerpt for the writers rail and co-lead checks, long enough to fill a few lines of text on a phone.')}</description><dc:creator>${x(p.author)}</dc:creator><pubDate>${p.date}</pubDate><enclosure url="${p.image}" type="image/jpeg"/></item>`).join('')}</channel></rss>`;
const COLORS = { buddy: '#0021a5', franz: '#7a2e12', eddie: '#245c3a', loren: '#5b3a8a', spears: '#333', franz2: '#a0522d' };
const svg = (k) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${COLORS[k] || '#41506e'}"/><text x="600" y="430" font-family="Barlow,sans-serif" font-size="96" font-weight="800" fill="#fff" text-anchor="middle">${x(k.toUpperCase())} PHOTO</text></svg>`;

const FRESH = ['Buddy Martin', 'Franz Beard', 'Eddie Gilley']; // < 48 h; Spears 49 h and Loren 60 h are not
const HREF = Object.fromEntries(config.columnists.map((c) => [c.name, c.href]));
const scenarios = [
  { name: 'badges', expect: { lead: 'buddy', fresh: FRESH } },
  // Three days later: nobody is under 48 h, Buddy's column still leads (<= 7 days). Same layout without badges: the no-jump baseline.
  { name: 'no-badges', now: NOW + 72 * H, expect: { lead: 'buddy', fresh: [] } },
  { name: 'colead', colead: { on: true }, expect: { lead: 'colead', fresh: FRESH, co: ['buddy-col', 'franz-piece'] } },
  { name: 'colead-breaking', colead: { on: true }, pins: { breaking: { path: '/post/desk-one', until: new Date(NOW + 6 * H).toISOString() } }, widths: [390, 1366], expect: { lead: 'breaking' } },
  // Right writer with nothing inside the window (Loren's newest is 60 h old, window 2 days): single lead, no empty column.
  { name: 'colead-right-stale', colead: { on: true, right: 'Loren Meadows', days: 2 }, widths: [390, 1366], expect: { lead: 'buddy' } },
];
const WIDTHS = [320, 390, 430, 1366];

const failures = [];
const rails = {};
const browser = await chromium.launch();
for (const sc of scenarios) {
  for (const width of sc.widths || WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await ctx.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/') return route.fulfill({ contentType: 'text/html', body: frame });
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/blog-feed.xml') return route.fulfill({ contentType: 'application/rss+xml', body: rss });
      if (u.hostname === 'static.wixstatic.com') { const k = (u.pathname.match(/qa_([a-z0-9]+)~/) || [])[1] || 'logo'; return route.fulfill({ contentType: 'image/svg+xml', body: svg(k) }); }
      return route.fulfill({ status: 404, body: '' }); // scoreboard, endpoints, Pages feed, fonts (Barlow is installed locally), tsParticles
    });
    await page.addInitScript(({ now, pins, colead }) => {
      window.__GBM_FP_NOW__ = now;
      window.__GBM_HOME_PINS__ = Object.assign({ timed: null }, pins || {});
      if (colead) window.__GBM_HOME_COLEAD__ = colead;
    }, { now: sc.now || NOW, pins: sc.pins || null, colead: sc.colead || null });
    await page.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'load' });
    await page.waitForSelector('#gbm-live.fp26', { timeout: 8000 }).catch(() => {});
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const geo = () => page.evaluate(() => [...document.querySelectorAll('#gbm-live .fp-lead, #gbm-live .fp-co, #gbm-live .fp-col, #gbm-live .fp-rail')].map((el) => { const b = el.getBoundingClientRect(); return [Math.round(b.top + scrollY), Math.round(b.left), Math.round(b.height)]; }));
    const before = await geo();
    await page.waitForTimeout(1800); // the fresh feed lands after paint; nothing may move
    const after = await geo();
    const r = await page.evaluate(() => {
      const root = document.querySelector('#gbm-live');
      const cols = [...document.querySelectorAll('#gbm-live .fp-col')].map((c) => {
        const name = c.querySelector('.fp-col-name'), badge = c.querySelector('.fp-new'), rb = c.querySelector('.fp-roundel'), story = c.querySelector('.fp-col-story');
        const bs = badge && getComputedStyle(badge), bb = badge && badge.getBoundingClientRect();
        return { name: name.firstChild.textContent, text: name.textContent, href: name.getAttribute('href'), story: story && story.getAttribute('href'), fresh: c.classList.contains('fp-col-new'), badge: !!badge,
          roundelHidden: rb.getAttribute('aria-hidden') === 'true', badgeFont: bs && bs.fontFamily, badgeBg: bs && bs.backgroundColor, badgeColor: bs && bs.color, badgePos: bs && bs.position,
          badgeBox: bb && [Math.round(bb.left), Math.round(bb.right)] };
      });
      const co = [...document.querySelectorAll('#gbm-live .fp-co')].map((a) => { const b = a.getBoundingClientRect(), hl = a.querySelector('h1 a, h2 a'); return { tag: hl && hl.parentElement.tagName, href: hl && hl.getAttribute('href'), top: Math.round(b.top + scrollY), left: Math.round(b.left), right: Math.round(b.right), bottom: Math.round(b.bottom + scrollY) }; });
      const coHrefs = co.map((c) => c.href);
      const dupes = coHrefs.filter((h) => h && document.querySelectorAll('#gbm-live .fp-second .fp-feature a[href="' + h + '"], #gbm-live .fp-list a[href="' + h + '"], #gbm-live .fp-hub a[href="' + h + '"]').length);
      return { lead: root && root.getAttribute('data-fp-lead'), h1: document.querySelectorAll('#gbm-live h1').length, cols, co, dupes,
        overflow: document.documentElement.scrollWidth - innerWidth, leadFont: getComputedStyle(document.querySelector('#gbm-live .fp-lead h1') || document.body).fontFamily };
    });
    const bad = [];
    const e = sc.expect;
    if (errors.length) bad.push('page errors ' + errors.join(' | '));
    if (r.lead !== e.lead) bad.push(`lead ${r.lead} (want ${e.lead})`);
    if (r.h1 !== 1) bad.push(`${r.h1} h1 elements`);
    if (r.overflow > 0) bad.push(`horizontal overflow ${r.overflow}px`);
    if (JSON.stringify(before) !== JSON.stringify(after)) bad.push('layout moved after paint');
    if (e.fresh) {
      const got = r.cols.filter((c) => c.badge).map((c) => c.name).sort();
      if (JSON.stringify(got) !== JSON.stringify([...e.fresh].sort())) bad.push(`badges on ${got} (want ${e.fresh})`);
      for (const c of r.cols) {
        if (c.badge !== c.fresh) bad.push(`${c.name}: badge/class mismatch`);
        if (c.badge && !/, new story$/.test(c.text)) bad.push(`${c.name}: name link has no ", new story" text (${c.text})`);
        if (!c.badge && /new story/.test(c.text)) bad.push(`${c.name}: stray new-story text`);
        if (!c.roundelHidden) bad.push(`${c.name}: roundel not aria-hidden`);
        if (c.badge && (!/Barlow/.test(c.badgeFont) || c.badgeBg !== 'rgb(250, 70, 22)' || c.badgeColor !== 'rgb(255, 255, 255)' || c.badgePos !== 'absolute')) bad.push(`${c.name}: badge style ${c.badgeFont} ${c.badgeBg} ${c.badgeColor} ${c.badgePos}`);
        if (c.badge && (c.badgeBox[0] < 0 || c.badgeBox[1] > width)) bad.push(`${c.name}: badge off screen ${c.badgeBox}`);
        const want = HREF[c.name] || null;
        if (want && c.href !== want) bad.push(`${c.name}: href ${c.href} (want ${want})`);
        if (!want && c.name === 'Chris Spears' && c.href !== URL_OF('chris-spears-best-shots-qa')) bad.push(`Chris Spears: href ${c.href} (want his newest story, never /null)`);
      }
      if (!/Barlow/.test(r.leadFont)) bad.push('lead headline not Barlow: ' + r.leadFont);
      rails[sc.name + width] = before.slice(-6); // the rail and its five columns
    }
    if (e.co) {
      if (r.co.length !== 2) bad.push(`${r.co.length} co-lead articles`);
      else {
        if (r.co[0].tag !== 'H1' || r.co[1].tag !== 'H2') bad.push(`co-lead headings ${r.co[0].tag}/${r.co[1].tag}`);
        e.co.forEach((slug, i) => { if (r.co[i].href !== URL_OF(slug)) bad.push(`co-lead ${i} ${r.co[i].href} (want ${slug})`); });
        if (width > 820) { if (Math.abs(r.co[0].top - r.co[1].top) > 2 || r.co[1].left < r.co[0].right) bad.push('co-lead not side by side on desktop ' + JSON.stringify(r.co)); }
        else if (r.co[1].top < r.co[0].bottom) bad.push('co-lead not stacked on phone ' + JSON.stringify(r.co));
      }
      if (r.dupes.length) bad.push('co-lead story repeated lower on the page: ' + r.dupes);
    } else if (r.co.length) bad.push('co-lead rendered while off');
    if (shots && [390, 1366].includes(width) && !sc.name.startsWith('colead-')) {
      await page.screenshot({ path: join(shots, `${sc.name}-${width}-top.png`) });
      const rail = await page.$('#fp-columnists');
      if (rail) { await rail.scrollIntoViewIfNeeded(); await rail.screenshot({ path: join(shots, `${sc.name}-${width}-writers.png`) }); }
      if (sc.colead) { const lead = await page.$('#gbm-live .fp-colead'); if (lead) await lead.screenshot({ path: join(shots, `${sc.name}-${width}-lead.png`) }); }
    }
    console.log(`${bad.length ? 'FAIL' : 'ok  '} ${sc.name} @${width}${bad.length ? ': ' + bad.join('; ') : ''}`);
    if (bad.length) failures.push(`${sc.name} @${width}`);
    await ctx.close();
  }
}
// No jump from the badge itself: with and without badges every writer row sits at the same place and height.
for (const w of WIDTHS) {
  const a = rails['badges' + w], b = rails['no-badges' + w];
  if (a && b && JSON.stringify(a) !== JSON.stringify(b)) { console.log(`FAIL rail geometry @${w} changes with badges: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`); failures.push('rail-geometry @' + w); }
  else if (a && b) console.log(`ok   rail geometry identical with and without badges @${w}`);
}
await browser.close();
if (failures.length) { console.error(`\n${failures.length} failing: ${failures.join(', ')}`); process.exit(1); }
console.log('\nAll writer-badge and co-lead checks passed.');
