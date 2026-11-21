#!/usr/bin/env node
// QA for the Vanderbilt Pregame edition (layout "pregame" plus the pregame standards: both teams' schedules and rosters).
// Renders sports-live/magazine-vanderbilt-frame.html with the real loader, serves the local bundle in place of the CDN pin and
// checks, at 320/390/430/1366: the sections this issue carries, the blocks it must leave out, both standards (present, non-zero
// height, open without a tap, every team and every row from the issue JSON on the page, nothing wider than its panel), page
// overflow, links, fonts (Barlow and Barlow Condensed only), photo alt text and credits, and the console.
// Photos and fonts come from the network when it is reachable; otherwise a stand-in is served, so the layout checks still run
// (the one font-dependent check, the team-name fit in the game card, is then skipped and the run says so).
// Usage (from the repo root): node sports-live/qa-magazine-vanderbilt.mjs [outdir]
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || '/tmp/pg-vanderbilt-shots'; mkdirSync(out, { recursive: true });
const bundle = readFileSync('sports-live/magazine-vanderbilt.js', 'utf8');
const frame = readFileSync('sports-live/magazine-vanderbilt-frame.html', 'utf8');
const issue = JSON.parse(readFileSync('sports-live/magazine-issue-vanderbilt.json', 'utf8'));
const standIn = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b3aa8"/><stop offset="1" stop-color="#fa4616"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="${Math.round(w / 14)}" text-anchor="middle">PHOTO STAND-IN</text></svg>`;

// What the issue JSON says must be on the page.
const S = issue.teamSchedules, R = issue.teamRosters;
const expected = {
  teams: ['Florida', 'Vanderbilt'],
  schedule: S.teams.map((t) => ({ name: t.name, rows: t.games.length, opponents: t.games.map((g) => g[2]), results: t.games.map((g) => g[4]) })),
  roster: R.teams.map((t) => ({ name: t.name, groups: t.groups.map((g) => g[0]), rows: t.groups.reduce((n, g) => n + g[1].length, 0), players: t.groups.flatMap((g) => g[1].map((p) => p[1])) })),
  sections: ['#pg-cover', '#pg-game', '#pg-series', '#pg-numbers', '#pg-team-schedules', '#pg-tape', '#pg-injuries', '#pg-lead', '#pg-slate', '#pg-exclusives', '#pg-excl-1', '#pg-excl-2', '#pg-excl-3', '#pg-excl-4', '#pg-more', '#pg-team-rosters'],
  absent: ['#pg-keys', '#pg-shots', '#pg-rosters'], // no Keys piece for this game, no photo mosaic, no collapsed roster (the availability report and the four issue stories were added Nov. 20)
  picks: issue.slate.games.length, cards: issue.cards.items.length,
};

const browser = await chromium.launch();
const results = [];
for (const [name, width, height] of [['320', 320, 800], ['390', 390, 844], ['430', 430, 932], ['1366', 1366, 900]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const consoleErrors = [], net = { photos: 0, standIns: 0, fonts: 0, fontStandIns: 0, blocked: [] };
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 300)));
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine') return route.fulfill({ contentType: 'text/html', body: frame });
    if (u === 'https://qa.local/favicon.ico') return route.fulfill({ status: 204, body: '' });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: bundle });
    if (/^data:|^about:/.test(u)) return route.continue();
    if (/^https:\/\/static\.wixstatic\.com\//.test(u)) {
      try { const r = await route.fetch({ timeout: 20000 }); if (r.ok()) { net.photos++; return route.fulfill({ response: r }); } } catch (_) {}
      const m = /w_(\d+),h_(\d+)/.exec(u); net.standIns++;
      return route.fulfill({ contentType: 'image/svg+xml', body: standIn(m ? +m[1] : 800, m ? +m[2] : 500) });
    }
    if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u)) {
      try { const r = await route.fetch({ timeout: 20000 }); if (r.ok()) { net.fonts++; return route.fulfill({ response: r }); } } catch (_) {}
      net.fontStandIns++;
      return route.fulfill({ contentType: /googleapis/.test(u) ? 'text/css' : 'font/woff2', body: '' });
    }
    // Live-score lookups only run inside the game window; answer them with an empty board so the run is the same on any day.
    if (/site\.web\.api\.espn\.com|presidente49\.github\.io/.test(u)) return route.fulfill({ contentType: 'application/json', body: '{"events":[]}' });
    net.blocked.push(u.slice(0, 120));
    return route.abort();
  });
  await page.goto('https://qa.local/magazine', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-magazine-page.pg', { timeout: 8000 });
  await page.evaluate(async () => { const imgs = [...document.querySelectorAll('#gbm-magazine-page img')]; imgs.forEach((i) => { i.loading = 'eager'; }); await Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : 0))); if (document.fonts && document.fonts.ready) await document.fonts.ready; });
  await page.waitForTimeout(700);
  const info = await page.evaluate((expected) => {
    const root = document.getElementById('gbm-magazine-page'), doc = document.documentElement;
    const wide = (scope) => [...scope.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > doc.clientWidth + 1 || r.left < -1); });
    const tag = (e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').join('.') : '');
    // A standard is "up and visible" when it is on the page with height, sits in no <details>, every table and row has height,
    // nothing in it is hidden, nothing pokes out of its own panel, and every team named in the issue JSON is there.
    function standard(id, teams) {
      const el = root.querySelector(id); if (!el) return { present: false };
      const r = el.getBoundingClientRect(), txt = el.textContent, tables = [...el.querySelectorAll('table')], rows = [...el.querySelectorAll('tbody tr')];
      const hidden = [...el.querySelectorAll('*')].filter((e) => { const cs = getComputedStyle(e); return cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0; }).filter((e) => e.textContent.trim());
      const clipped = [...el.querySelectorAll('.pg-std-team')].filter((p) => p.scrollWidth > p.clientWidth + 1 || [...p.querySelectorAll('th,td')].some((c) => { const a = c.getBoundingClientRect(), b = p.getBoundingClientRect(); return a.width > 0 && (a.right > b.right + 1 || a.left < b.left - 1); }));
      return { present: true, height: Math.round(r.height), top: Math.round(r.top + window.scrollY), collapsed: !!el.closest('details') || el.querySelectorAll('details').length, tables: tables.length, tableHeights: tables.map((t) => Math.round(t.getBoundingClientRect().height)),
        rows: rows.length, zeroRows: rows.filter((x) => x.getBoundingClientRect().height < 8).length, hidden: hidden.slice(0, 5).map(tag), wide: wide(el).slice(0, 5).map(tag), clipped: clipped.length,
        teams: teams.map((n) => [...el.querySelectorAll('h3')].some((h) => h.textContent.trim().indexOf(n) === 0)), text: txt };
    }
    const sched = standard('#pg-team-schedules', expected.teams), rost = standard('#pg-team-rosters', expected.teams);
    const schedTables = [...root.querySelectorAll('#pg-team-schedules .pg-std-team')].map((p) => ({ name: p.querySelector('h3').firstChild.textContent.trim(), rows: p.querySelectorAll('tbody tr').length, text: p.textContent }));
    const rostTables = [...root.querySelectorAll('#pg-team-rosters .pg-std-team')].map((p) => ({ name: p.querySelector('h3').firstChild.textContent.trim(), rows: p.querySelectorAll('tbody tr:not(.pg-rt-g)').length, groups: [...p.querySelectorAll('tr.pg-rt-g')].map((g) => g.textContent.trim()), text: p.textContent, cells: [...p.querySelectorAll('tbody tr:not(.pg-rt-g)')].filter((tr) => tr.children.length !== 7).length }));
    const schedMissing = [], rostMissing = [];
    expected.schedule.forEach((t) => { const d = schedTables.find((x) => x.name === t.name); if (!d || d.rows !== t.rows) schedMissing.push(t.name + ' rows'); t.opponents.concat(t.results).forEach((o) => { if (!d || d.text.indexOf(o) < 0) schedMissing.push(t.name + ': ' + o); }); });
    expected.roster.forEach((t) => { const d = rostTables.find((x) => x.name === t.name); if (!d || d.rows !== t.rows || d.cells) rostMissing.push(t.name + ' rows ' + (d ? d.rows : 0) + '/' + t.rows); if (!d || JSON.stringify(d.groups) !== JSON.stringify(t.groups)) rostMissing.push(t.name + ' groups'); t.players.forEach((p) => { if (!d || d.text.indexOf(p) < 0) rostMissing.push(t.name + ': ' + p); }); });
    delete sched.text; delete rost.text;
    // Fonts: every element that holds its own text must resolve to Barlow or Barlow Condensed first.
    const fonts = {}; [...root.querySelectorAll('*')].forEach((e) => { if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim(); fonts[f] = (fonts[f] || 0) + 1; });
    // Game card: a team name never breaks inside a word (one line for each word at most).
    const brokenNames = [...root.querySelectorAll('.pg-teams .pg-team b')].filter((b) => { const cs = getComputedStyle(b), lines = Math.round(b.getBoundingClientRect().height / parseFloat(cs.lineHeight)); return lines > b.textContent.trim().split(/\s+/).length; }).map((b) => b.textContent);
    const imgs = [...root.querySelectorAll('img')];
    const jump = [...root.querySelectorAll('.pg-jump a')].map((a) => a.getAttribute('href'));
    return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, over: wide(root).slice(0, 5).map(tag), sections: expected.sections.map((id) => !!root.querySelector(id)), absent: expected.absent.map((id) => !root.querySelector(id)),
      order: [...root.querySelectorAll('.pg-wrap > *, .pg-grid > *')].map((e) => e.id || e.className.split(' ')[0]).filter((x) => x !== 'pg-grid'),
      sched, rost, schedMissing, rostMissing, jump, jumpOk: jump.length === 5 && jump.every((h) => !!root.querySelector(h)), jumpTop: root.querySelector('.pg-jump') ? Math.round(root.querySelector('.pg-jump').getBoundingClientRect().top + window.scrollY) : null,
      fonts, brokenNames, imgs: imgs.length, brokenImgs: imgs.filter((i) => !i.naturalWidth).length, noAlt: imgs.filter((i) => !(i.getAttribute('alt') || '').trim()).length, credits: root.querySelectorAll('.pg-cr').length,
      picks: root.querySelectorAll('#pg-slate .pg-pick').length, cards: root.querySelectorAll('#pg-more .pg-card').length, links: root.querySelectorAll('a[href]').length, count: root.querySelector('[data-pg-count]').textContent, h1: root.querySelectorAll('h1').length, height: root.scrollHeight,
      bad: [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !/^(\/|#|https:\/\/www\.youtube\.com\/)/.test(h)), banned: /gator\s*-?\s*country/i.test(root.textContent), emDash: [...root.querySelectorAll('.pg-std, .pg-jump, .pg-game, .pg-series, .pg-numbers, .pg-tape, .pg-cover, .pg-inj, .pg-excl')].filter((e) => e.textContent.indexOf('—') >= 0).length };
  }, expected);
  // Screenshots: the top of the issue, each standard on its own, and the whole page in slices (one tall image would be unreadable).
  const shots = [];
  const snap = async (file, opt) => { await page.screenshot({ path: `${out}/${file}`, animations: 'disabled', ...opt }); shots.push(`${out}/${file}`); };
  await page.evaluate(() => window.scrollTo(0, 0));
  await snap(`vandy-${name}-top.png`, {});
  const clipOf = async (sel, max) => page.evaluate(([s, m]) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: 0, y: Math.round(r.top + window.scrollY) - 8, width: document.documentElement.clientWidth, height: Math.min(Math.round(r.height) + 16, m) }; }, [sel, max]);
  await snap(`vandy-${name}-schedules.png`, { fullPage: true, clip: await clipOf('#pg-team-schedules', 2400) });
  await snap(`vandy-${name}-rosters-start.png`, { fullPage: true, clip: await clipOf('#pg-team-rosters', 1700) });
  const second = await clipOf('#pg-rt-vanderbilt', 1500); second.y -= width < 1000 ? 420 : 0; // on phones, show where Florida's roster ends and Vanderbilt's begins
  if (width < 1000) await snap(`vandy-${name}-rosters-second-team.png`, { fullPage: true, clip: second });
  const total = info.height, step = 4000;
  for (let y = 0, i = 1; y < total; y += step, i++) await snap(`vandy-${name}-page-${String(i).padStart(2, '0')}.png`, { fullPage: true, clip: { x: 0, y, width, height: Math.min(step, total - y) } });
  results.push({ name, ...info, consoleErrors, net, shots });
  await ctx.close();
}
await browser.close();

const problems = [];
for (const r of results) {
  const bad = (cond, what) => { if (cond) problems.push(`${r.name}: ${what}`); };
  bad(r.scrollW > r.clientW + 1 || r.over.length, 'horizontal overflow ' + JSON.stringify(r.over));
  bad(r.sections.some((x) => !x), 'missing section ' + expected.sections.filter((_, i) => !r.sections[i]).join(','));
  bad(r.absent.some((x) => !x), 'a block that must be left out is on the page: ' + expected.absent.filter((_, i) => !r.absent[i]).join(','));
  for (const [label, s, tables] of [['schedules', r.sched, 2], ['rosters', r.rost, 2]]) {
    bad(!s.present, label + ' section missing'); if (!s.present) continue;
    bad(s.height < 200, label + ' has no height'); bad(s.collapsed, label + ' is collapsed'); bad(s.tables !== tables || s.tableHeights.some((h) => h < 100), label + ' tables ' + JSON.stringify(s.tableHeights));
    bad(s.zeroRows, label + ' has rows with no height'); bad(s.hidden.length, label + ' has hidden text ' + JSON.stringify(s.hidden)); bad(s.wide.length || s.clipped, label + ' overflows ' + JSON.stringify(s.wide) + ' clipped panels ' + s.clipped);
    bad(s.teams.some((x) => !x), label + ' is missing a team name');
  }
  bad(r.schedMissing.length, 'schedule rows not on the page: ' + r.schedMissing.join('; '));
  bad(r.rostMissing.length, 'roster rows not on the page: ' + r.rostMissing.join('; '));
  bad(!r.jumpOk, 'jump links ' + JSON.stringify(r.jump));
  bad(Object.keys(r.fonts).some((f) => !/^Barlow( Condensed)?$/.test(f)), 'a font other than Barlow: ' + JSON.stringify(r.fonts));
  // The name fit is measured in Barlow Condensed; with stand-in fonts (offline) the fallback face is wider, so the check only counts online.
  bad(!r.net.fontStandIns && r.brokenNames.length, 'a team name breaks inside a word in the game card: ' + r.brokenNames.join(', '));
  bad(r.brokenImgs || r.noAlt, `photos: ${r.brokenImgs} broken, ${r.noAlt} without alt text`);
  bad(r.picks !== expected.picks || r.cards !== expected.cards, `board ${r.picks}/${expected.picks}, cards ${r.cards}/${expected.cards}`);
  bad(r.bad.length, 'off-site links ' + JSON.stringify(r.bad)); bad(r.h1 !== 1, 'h1 count ' + r.h1); bad(r.emDash, 'em dash in copy written for the issue'); bad(r.banned, 'an outlet the house never names is on the page');
  bad(r.consoleErrors.length, 'console errors ' + JSON.stringify(r.consoleErrors)); bad(r.net.blocked.length, 'unexpected requests ' + JSON.stringify(r.net.blocked));
}
console.log(JSON.stringify(results.map(({ shots, ...r }) => r), null, 1));
console.log('Screenshots:\n' + results.flatMap((r) => r.shots).join('\n'));
if (problems.length) { console.error('FAIL\n' + problems.join('\n')); process.exit(1); }
console.log('Vanderbilt Pregame QA passed at ' + results.map((r) => r.name).join(', ') + ' (photos: ' + results.map((r) => r.net.photos + ' real/' + r.net.standIns + ' stand-in').join(', ') + ').');
if (results.some((r) => r.net.fontStandIns || r.net.standIns)) console.log('NOTE: fonts or photos were not reachable, so stand-ins were used and the team-name fit was not judged. Run again online before release.');
