#!/usr/bin/env node
// GatorBait Magazine 2026 browser QA. Serves sports-live/magazine-frame.html AS https://www.gatorbaitmedia.com/magazine
// (fixtures use the real origin) with every network dependency routed locally: the loader's pointer
// (sports-live/current.json from Pages) and the bundle (jsDelivr at a commit) come from the repo, images get a 1-pixel
// stand-in, Google Fonts an empty stylesheet. The fixture carries the real loader, so each run proves
// pointer -> bundle -> mount, then checks the page at 320 / 390 / 430 / 1366.
// Usage: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers NODE_PATH=<dir with playwright> node sports-live/qa-magazine.mjs [screenshotDir]
//   env PLAYWRIGHT=/path/to/playwright  QA_ONLY=<scenario name prefix>
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = process.argv[2] || '';
if (shots) mkdirSync(shots, { recursive: true });
const frame = readFileSync(join(repo, 'sports-live/magazine-frame.html'), 'utf8');
const bundle = readFileSync(join(repo, 'sports-live/magazine.js'), 'utf8');
const pointer = readFileSync(join(repo, 'sports-live/current.json'), 'utf8');
const loader = readFileSync(join(repo, 'deploy/magazine-2026/magazine-loader-v1.html'), 'utf8');
const issue = JSON.parse(readFileSync(join(repo, 'sports-live/magazine-issue.json'), 'utf8'));
// Image stand-in: a 1600x900 SVG (a 1-pixel PNG reads naturalWidth 0 once the srcset density divides it).
const svgStandIn = '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#123dc9"/><circle cx="800" cy="450" r="260" fill="#f15a24"/></svg>';
const ORIGIN = 'https://www.gatorbaitmedia.com';

console.log(`bundle sports-live/magazine.js ${Buffer.byteLength(bundle)} bytes (${gzipSync(bundle).length} gzip); loader ${loader.length} chars`);
if (loader.length >= 15000) { console.log('FAIL loader is not under the 15,000-character Wix embed limit'); process.exit(1); }

// What the bundled issue says must render. Sections render only when their data exists; pending / empty slots are absent.
const n = (a) => Array.isArray(a) ? a.length : 0;
const want = {
  cover: !!(issue.cover && issue.cover.url && !issue.cover.pending),
  columns: n((issue.columns || {}).items),
  feature: !!(issue.feature && !issue.feature.pending && issue.feature.url),
  pregame: !!issue.pregame && !issue.pregame.pending,
  keys: n((issue.pregame || {}).keys),
  series: !!((issue.pregame || {}).series || '').trim(),
  schedule: n(((issue.departments || {}).schedule || {}).games),
  injuries: (((issue.departments || {}).injuries || {}).teams || []).map((t) => n(t.items)).filter(Boolean),
  numbers: n(((issue.departments || {}).numbers || {}).items),
  roster: n(((issue.departments || {}).roster || {}).items),
  shots: n((issue.bestShots || {}).photos),
  footer: ((issue.footer || {}).links || []).map((l) => l.url),
};

// A full issue: every slot filled with fixture copy, so the renderer's other paths are exercised too (feature, keys, series, roster, 8 stats, 6 shots).
const FULL = JSON.parse(JSON.stringify(issue));
FULL.feature = { label: 'Feature', kicker: 'QA fixture feature', headline: 'QA fixture feature headline', dek: 'QA fixture dek.', byline: 'By QA Fixture', url: '/post/qa-fixture-feature', image: { id: 'd3cfa5_56a64986c874417c9a8299fae22649ed', ext: 'jpg', width: 1600, height: 900, alt: 'QA', credit: 'QA fixture credit' } };
FULL.pregame.series = 'QA fixture series line.';
FULL.pregame.keys = ['QA key one.', 'QA key two.', 'QA key three.'];
FULL.departments.roster.items = [{ text: 'QA roster note one.', source: 'QA' }, { text: 'QA roster note two.', source: 'QA' }];
FULL.departments.numbers.items = FULL.departments.numbers.items.concat([4, 5, 6, 7, 8].map((i) => ({ value: String(i), label: 'QA stat ' + i, source: 'QA' })));
FULL.bestShots.photos = FULL.bestShots.photos.concat([4, 5, 6].map((i) => ({ id: 'd3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b', ext: 'jpg', width: 1600, height: 900, alt: 'QA ' + i, caption: 'QA shot ' + i, url: '/post/chris-spears-photo-gallery-florida-ole-miss' })));
// A sparse issue: only the masthead, cover and footer; everything else must be absent, nothing may throw.
const SPARSE = { id: 'qa-sparse', issue: issue.issue, masthead: issue.masthead, labels: issue.labels, cover: issue.cover, columns: { label: 'Columns', items: [] }, feature: { pending: true }, pregame: null, departments: { label: 'Departments', schedule: { games: [] }, injuries: { teams: [] }, numbers: { items: [] }, roster: { items: [] } }, bestShots: { photos: [] }, footer: issue.footer };
// Hostile copy: markup and off-site links in the JSON must come out as text / be dropped.
const HOSTILE = JSON.parse(JSON.stringify(issue));
HOSTILE.cover.headline = '<img src=x onerror="window.__qaXss=1"> "quoted" & <b>bold</b>';
HOSTILE.columns.items[0].url = 'https://evil.example.com/post/x';
HOSTILE.columns.items[1].url = 'javascript:alert(1)';
HOSTILE.footer.links.push({ label: 'Off-site', url: 'https://www.google.com/' });

const WIDTHS = [320, 390, 430, 1366];
const scenarios = [
  { name: 'issue', path: '/magazine', expect: want },
  { name: 'issue-trailing-slash', path: '/magazine/', widths: [390], expect: want },
  { name: 'issue-reduced-motion', path: '/magazine', widths: [390, 1366], reduced: true, expect: want },
  { name: 'full', path: '/magazine', override: FULL, expect: { ...want, feature: true, keys: 3, series: true, roster: 2, numbers: 8, shots: 6 } },
  { name: 'sparse', path: '/magazine', override: SPARSE, widths: [320, 1366], expect: { cover: true, columns: 0, feature: false, pregame: false, keys: 0, series: false, schedule: 0, injuries: [], numbers: 0, roster: 0, shots: 0, footer: want.footer } },
  { name: 'hostile', path: '/magazine', override: HOSTILE, widths: [390], expect: { ...want, columns: 2, hostile: true } },
  // Pointer slow (past the loader's 800 ms) and pointer down: the baked fallback commit loads the bundle.
  { name: 'pointer-slow', path: '/magazine', widths: [390], pointerDelay: 1500, expect: { ...want, commit: '__COMMIT__' } },
  { name: 'pointer-down', path: '/magazine', widths: [390], pointer: 500, expect: { ...want, commit: '__COMMIT__' } },
  // Bundle down at both commits: no root, the native page comes back (gbm-mq removed), no page error.
  { name: 'bundle-down', path: '/magazine', widths: [390], bundle: 404, expect: { none: true, nativeVisible: true } },
  // Off the route: the loader must not even fetch the bundle; nothing mounts; the native page shows.
  { name: 'off-route', path: '/post/some-story', widths: [390, 1366], expect: { none: true, nativeVisible: true, noFetch: true } },
  { name: 'off-route-prefix', path: '/magazine-archive', widths: [390], expect: { none: true, nativeVisible: true, noFetch: true } },
  // Client-side route change away and back (the shell's gbmroutechange + popstate): removed, then remounted exactly once.
  { name: 'route-change', path: '/magazine', widths: [390], routeChange: true, expect: want },
];
const only = (list) => process.env.QA_ONLY ? list.filter((sc) => sc.name.startsWith(process.env.QA_ONLY)) : list;

const failures = [];
const browser = await chromium.launch();
for (const sc of only(scenarios)) {
  for (const width of sc.widths || WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 }, reducedMotion: sc.reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [], fetched = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    // The pointer-down / bundle-down scenarios make the browser log the intended 500 / 404; every other console error counts.
    page.on('console', (m) => { if (m.type() === 'error' && !((sc.pointer || sc.bundle) && /Failed to load resource/.test(m.text()))) errors.push('console: ' + m.text()); });
    if (sc.override) await page.addInitScript((o) => { window.__GBM_MAG_ISSUE__ = o; }, sc.override);
    await ctx.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === 'www.gatorbaitmedia.com') return route.fulfill({ contentType: 'text/html', body: frame });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/current.json')) {
        fetched.push('pointer');
        const send = () => sc.pointer ? route.fulfill({ status: sc.pointer, body: '' }) : route.fulfill({ contentType: 'application/json', body: pointer });
        if (sc.pointerDelay) setTimeout(send, sc.pointerDelay); else send();
        return;
      }
      if (u.hostname === 'cdn.jsdelivr.net' && u.pathname.endsWith('/sports-live/magazine.js')) {
        fetched.push('bundle@' + (u.pathname.match(/@([^/]+)\//) || [])[1]);
        return sc.bundle ? route.fulfill({ status: sc.bundle, body: '' }) : route.fulfill({ contentType: 'application/javascript', body: bundle });
      }
      if (u.hostname === 'fonts.googleapis.com') return route.fulfill({ contentType: 'text/css', body: '' });
      if (u.hostname === 'static.wixstatic.com') return route.fulfill({ contentType: 'image/svg+xml', body: svgStandIn });
      return route.abort();
    });
    await page.goto(ORIGIN + sc.path, { waitUntil: 'load' });
    if (!sc.expect.none) await page.waitForSelector('#gbm-magazine-page.mz26', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(sc.pointerDelay ? 2600 : 1400);
    if (sc.routeChange) {
      await page.evaluate(() => { history.pushState({}, '', '/post/some-story'); window.dispatchEvent(new Event('gbmroutechange')); });
      await page.waitForTimeout(200);
      const away = await page.evaluate(() => ({ roots: document.querySelectorAll('#gbm-magazine-page').length, live: document.documentElement.classList.contains('gbm-magazine-live'), mq: document.documentElement.classList.contains('gbm-mq'), native: getComputedStyle(document.getElementById('SITE_PAGES')).display }));
      if (away.roots || away.live || away.mq || away.native === 'none') failures.push(`route-change@${width}: after leaving, roots=${away.roots} live=${away.live} mq=${away.mq} native=${away.native}`);
      await page.goBack({ waitUntil: 'commit' }).catch(() => {});
      await page.waitForTimeout(600);
      // A second route-change event while mounted must not mount twice.
      await page.evaluate(() => window.dispatchEvent(new Event('gbmroutechange')));
      await page.waitForTimeout(4500); // past the renderer's last 4 s re-check
    }
    // Sweep the page once so lazy images below the fold load and every block has been laid out, then measure from the top.
    if (!sc.expect.none) {
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
      await page.waitForTimeout(500);
    }
    const r = await page.evaluate(() => {
      const root = document.querySelector('#gbm-magazine-page.mz26');
      const vw = document.documentElement.clientWidth;
      const off = [], smallTaps = [];
      if (root) for (const el of root.querySelectorAll('*')) {
        const b = el.getBoundingClientRect();
        if (b.width && (b.right > vw + 1 || b.left < -1)) off.push((el.className || el.tagName) + '@' + Math.round(b.left) + '-' + Math.round(b.right));
      }
      if (root) for (const a of root.querySelectorAll('a[href]')) {
        if (a.getAttribute('tabindex') === '-1') continue; // figure duplicates of a text link beside them
        const b = a.getBoundingClientRect();
        if (b.width && b.height && (b.height < 44 || b.width < 44)) smallTaps.push(a.className + ':' + Math.round(b.width) + 'x' + Math.round(b.height));
      }
      const links = root ? [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')) : [];
      const badLinks = links.filter((h) => !(h.startsWith('/') || h.startsWith('#') || h.startsWith('https://www.gatorbaitmedia.com/')));
      const fonts = new Set(); if (root) for (const el of root.querySelectorAll('*')) fonts.add(getComputedStyle(el).fontFamily);
      const sec = (k) => root ? root.querySelectorAll(`[data-mz="${k}"]`).length : 0;
      const cover = root && root.querySelector('[data-mz="cover"] img');
      const native = document.getElementById('SITE_PAGES');
      const nativeCs = native ? getComputedStyle(native) : null;
      const h1 = root && root.querySelector('h1');
      return {
        roots: document.querySelectorAll('#gbm-magazine-page').length, build: root && root.getAttribute('data-mz-build'), issue: root && root.getAttribute('data-issue'),
        live: document.documentElement.classList.contains('gbm-magazine-live'), mq: document.documentElement.classList.contains('gbm-mq'),
        nativeDisplay: nativeCs ? nativeCs.display : '', nativeOpacity: nativeCs ? nativeCs.opacity : '',
        scrollW: document.documentElement.scrollWidth, vw, off: off.slice(0, 6), smallTaps: smallTaps.slice(0, 6), badLinks, fonts: [...fonts], links: links.length,
        cover: !!cover, coverLoaded: !!(cover && cover.complete && cover.naturalWidth > 0), coverSrcset: !!(cover && cover.getAttribute('srcset')), coverContain: cover ? getComputedStyle(cover).objectFit : '',
        coverCredit: root ? (root.querySelector('[data-mz="cover"] .mz-cr') || {}).textContent || '' : '',
        h1: h1 ? h1.textContent : '', h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + scrollY) : -1, vh: innerHeight,
        contents: sec('contents'), tocItems: root ? root.querySelectorAll('[data-mz="contents"] li').length : 0,
        columns: root ? root.querySelectorAll('[data-mz="columns"] .mz-col').length : 0, columnsSec: sec('columns'),
        feature: sec('feature'), pregame: sec('pregame'), keys: root ? root.querySelectorAll('[data-mz="pregame"] .mz-pre-keys li').length : 0, series: root ? root.querySelectorAll('[data-mz="pregame"] .mz-pre-series').length : 0,
        pregameWhen: root ? (root.querySelector('[data-mz="pregame"] .mz-pre-when') || {}).textContent || '' : '', pregameLink: root ? root.querySelectorAll('[data-mz="pregame"] a.mz-pre-link').length : 0,
        departments: sec('departments'), schedule: root ? root.querySelectorAll('[data-mz="schedule"] tbody tr').length : 0, nextRow: root ? root.querySelectorAll('[data-mz="schedule"] tr.mz-next').length : 0,
        injuries: root ? [...root.querySelectorAll('[data-mz="injuries"] .mz-inj > div')].map((d) => d.querySelectorAll('li').length) : [], injurySources: root ? [...root.querySelectorAll('[data-mz="injuries"] li')].every((li) => li.querySelector('.mz-src')) : false,
        numbers: root ? root.querySelectorAll('[data-mz="numbers"] .mz-stat').length : 0, roster: root ? root.querySelectorAll('[data-mz="roster"] li').length : 0,
        shots: root ? root.querySelectorAll('[data-mz="shots"] a.mz-shot').length : 0, shotsLoaded: root ? [...root.querySelectorAll('[data-mz="shots"] img')].every((i) => i.complete && i.naturalWidth > 0) : false,
        footer: root ? [...root.querySelectorAll('[data-mz="footer"] a')].map((a) => a.getAttribute('href')) : [],
        anims: document.getAnimations().filter((a) => a.playState === 'running').length, title: document.title, xss: window.__qaXss || 0,
        edition: !!(window.__GBM_MAG_EDITION__ && window.__GBM_MAG_EDITION__.lead && window.__GBM_MAG_EDITION__.lead.url),
        bundleCommit: (document.getElementById('gbm-mag26-bundle') || {}).getAttribute?.('data-commit') || '',
        css: document.querySelectorAll('#gbm-mag26-css').length, fontLinks: document.querySelectorAll('link[href*="Barlow+Condensed"]').length,
      };
    });
    const e = sc.expect, bad = [];
    if (e.none) {
      if (r.roots) bad.push(`root mounted (${r.roots})`);
      if (e.nativeVisible && (r.nativeDisplay === 'none' || r.mq)) bad.push(`native page hidden: display=${r.nativeDisplay} mq=${r.mq}`);
      if (e.noFetch && fetched.length) bad.push('loader fetched off route: ' + fetched.join(', '));
      if (!e.noFetch && !fetched.some((f) => f.startsWith('bundle@'))) bad.push('bundle never requested');
    } else {
      if (r.roots !== 1) bad.push(`root count ${r.roots}`);
      if (!r.build || !r.live) bad.push(`not live: build=${r.build} live=${r.live}`);
      if (r.nativeDisplay !== 'none') bad.push(`native page visible (display ${r.nativeDisplay})`);
      if (r.scrollW > r.vw) bad.push(`horizontal overflow ${r.scrollW}>${r.vw}`);
      if (r.off.length) bad.push('elements past viewport: ' + r.off.join(', '));
      if (r.smallTaps.length) bad.push('tap targets under 44px: ' + r.smallTaps.join(', '));
      if (r.badLinks.length) bad.push('off-policy links: ' + r.badLinks.join(', '));
      const badFonts = r.fonts.filter((f) => !/^"?Barlow( Condensed)?"?/.test(f));
      if (badFonts.length) bad.push('fonts: ' + badFonts.join(' / '));
      if (r.css !== 1 || r.fontLinks !== 1) bad.push(`css blocks ${r.css}, Barlow links ${r.fontLinks}`);
      if (e.cover) {
        if (!r.cover || !r.coverLoaded || !r.coverSrcset || r.coverContain !== 'contain') bad.push(`cover image present=${r.cover} loaded=${r.coverLoaded} srcset=${r.coverSrcset} fit=${r.coverContain}`);
        if (!r.coverCredit) bad.push('cover credit line missing');
        if (!r.h1) bad.push('cover headline missing');
        if (width < 800 && r.h1Top > r.vh * 1.6) bad.push(`cover headline too low (${r.h1Top}px)`);
        if (!r.edition) bad.push('__GBM_MAG_EDITION__ not exposed');
      }
      const expectSec = (name, got, wantIt) => { if (!!got !== !!wantIt) bad.push(`${name} ${got ? 'rendered' : 'absent'}, expected ${wantIt ? 'present' : 'absent'}`); };
      expectSec('columns', r.columnsSec, e.columns > 0);
      if (r.columns !== e.columns) bad.push(`columns ${r.columns} != ${e.columns}`);
      expectSec('feature', r.feature, e.feature);
      expectSec('pregame', r.pregame, e.pregame);
      if (e.pregame && (!r.pregameWhen || !r.pregameLink)) bad.push(`pregame when="${r.pregameWhen}" previewLink=${r.pregameLink}`);
      if (r.keys !== e.keys) bad.push(`pregame keys ${r.keys} != ${e.keys}`);
      if (!!r.series !== !!e.series) bad.push(`pregame series ${r.series ? 'rendered' : 'absent'}`);
      expectSec('departments', r.departments, e.schedule || e.injuries.length || e.numbers || e.roster);
      if (r.schedule !== e.schedule) bad.push(`schedule rows ${r.schedule} != ${e.schedule}`);
      if (e.schedule && r.nextRow !== 1) bad.push(`next-game rows ${r.nextRow}`);
      if (JSON.stringify(r.injuries) !== JSON.stringify(e.injuries)) bad.push(`injury lists ${JSON.stringify(r.injuries)} != ${JSON.stringify(e.injuries)}`);
      if (e.injuries.length && !r.injurySources) bad.push('an injury line has no source label');
      if (r.numbers !== e.numbers) bad.push(`numbers ${r.numbers} != ${e.numbers}`);
      if (r.roster !== e.roster) bad.push(`roster notes ${r.roster} != ${e.roster}`);
      if (r.shots !== e.shots) bad.push(`best shots ${r.shots} != ${e.shots}`);
      if (e.shots && !r.shotsLoaded) bad.push('a best-shots image did not load');
      if (JSON.stringify(r.footer) !== JSON.stringify(e.footer)) bad.push(`footer links ${JSON.stringify(r.footer)} != ${JSON.stringify(e.footer)}`);
      const sections = [e.cover, e.columns > 0, e.feature, e.pregame, e.schedule || e.injuries.length || e.numbers || e.roster, e.shots > 0].filter(Boolean).length;
      if (r.tocItems !== sections) bad.push(`contents strip ${r.tocItems} entries != ${sections} sections`);
      if (r.anims) bad.push(r.anims + ' running animations');
      if (e.commit && r.bundleCommit !== e.commit) bad.push(`bundle loaded at ${r.bundleCommit}, expected the baked fallback ${e.commit}`);
      if (!e.commit && !/^[0-9a-f]{40}$/.test(r.bundleCommit)) bad.push(`bundle loaded at "${r.bundleCommit}", expected the pointer commit`);
      if (e.hostile) {
        if (r.xss || !/<img src=x onerror=/.test(r.h1)) bad.push(`markup in copy not escaped (xss=${r.xss}, h1="${r.h1.slice(0, 40)}")`);
      }
      if (!r.title.includes('GatorBait Magazine')) bad.push('document title ' + r.title);
    }
    if (errors.length) bad.push('page errors: ' + errors.join(' | '));
    const tag = `${sc.name}@${width}`;
    console.log((bad.length ? 'FAIL ' : 'ok   ') + tag.padEnd(28) + (e.none ? ` none roots=${r.roots} native=${r.nativeDisplay} fetched=[${fetched.join(' ')}]` : ` build=${r.build} w=${r.scrollW}/${r.vw} h1=${r.h1Top} toc=${r.tocItems} cols=${r.columns} feat=${r.feature} pre=${r.pregame}/${r.keys}k sched=${r.schedule} inj=${r.injuries.join('+')} num=${r.numbers} roster=${r.roster} shots=${r.shots} links=${r.links} commit=${r.bundleCommit.slice(0, 9)}`));
    if (bad.length) failures.push(tag + ': ' + bad.join('; '));
    if (shots && !e.none) {
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(shots, `mz-${tag.replace('@', '-')}.png`), fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close();
if (failures.length) { console.log('\nFAILURES\n' + failures.join('\n')); process.exit(1); }
console.log('\nMagazine QA passed.');
