#!/usr/bin/env node
// Render QA for the Oklahoma-week web bundle (sports-live/magazine-oklahoma-week.js), served in place of the jsDelivr pin
// inside the real loader fixture (sports-live/magazine-oklahoma-week-frame.html). Real Wix photos and Barlow load through the
// network (set --offline for stand-in photos). The cover poster is served from the committed file next to the bundle.
// Checks at 320/390/430/1366/1920: one #gbm-magazine-page.pm, exactly one h1, no horizontal overflow, every section the issue defines,
// at least MIN_STORIES (10) distinct story links, all taken from the issue JSON (the cover story from its photo, headline and button; each
// other story exactly once), one card per story item, the exact image count the JSON defines (poster + cover photo + every item image,
// 8 today), every link site-relative or on the small allow-list, no "[[" or "-1" text, no banned-credit text, no betting terms, every
// image loaded, no repeated image asset, Barlow applied, no page errors. The shared renderer silently cuts strings at fixed lengths
// (cover lines 80, credit lines 80, titles 200 ...), so the rendered cover lines, credit lines, card titles and decks, section heads,
// "up next" lines and the poster alt text must equal the JSON text; the verified game facts (7:45 p.m. ET, SEC Network, Ben Hill Griffin
// Stadium) must be on the page.
// Placeholder mode (default): the two PDF URLs are still [[...]], so #pm-download must be ABSENT. --final: #pm-download must exist,
// point at the usrfiles PDF host, and no "[[" may remain in the bundle.
// Usage: node deploy/oklahoma-week-20261106/qa-oklahoma-week.mjs [outdir] [--final] [--offline]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const args = process.argv.slice(2), FINAL = args.includes('--final'), OFFLINE = args.includes('--offline');
const out = args.find((a) => !a.startsWith('--')) || 'deploy/oklahoma-week-20261106/shots';
mkdirSync(out, { recursive: true });
const bundle = readFileSync('sports-live/magazine-oklahoma-week.js', 'utf8');
const frame = readFileSync('sports-live/magazine-oklahoma-week-frame.html', 'utf8');
const ISSUE = JSON.parse(readFileSync('sports-live/magazine-issue-oklahoma-week.json', 'utf8'));
const poster = existsSync('sports-live/reels/' + ISSUE.cover.poster.file) ? readFileSync('sports-live/reels/' + ISSUE.cover.poster.file) : null;
const ITEMS = [...ISSUE.columns.items, ...ISSUE.coverage.items];
const STORIES = [ISSUE.cover.url, ...ITEMS.map((i) => i.url)];
const MIN_STORIES = 10;
if (STORIES.length < MIN_STORIES || new Set(STORIES).size !== STORIES.length) { console.error(`Issue JSON must list at least ${MIN_STORIES} distinct story URLs (found ${STORIES.length}, ${new Set(STORIES).size} distinct)`); process.exit(1); }
// Image slots the page must render: the poster, the cover photo and every item photo.
const EXPECT_IMGS = (ISSUE.cover.poster ? 1 : 0) + (ISSUE.cover.image ? 1 : 0) + ITEMS.filter((i) => i.image).length;
// Strings the shared renderer cuts at a fixed length (src/magazine-postgame.js): what is rendered must equal what the JSON says.
const SAME = {
  coverLines: ISSUE.cover.lines, credits: ISSUE.credits.other, nextMeta: ISSUE.next.meta,
  titles: ITEMS.map((i) => i.title), deks: ITEMS.map((i) => i.dek), heads: [ISSUE.columns.title, ISSUE.columns.dek, ISSUE.coverage.title, ISSUE.coverage.dek],
  posterAlt: ISSUE.cover.poster ? ISSUE.cover.poster.alt : '',
};
const FACTS = ['7:45 p.m. ET', 'SEC Network', 'Ben Hill Griffin Stadium']; // FloridaGators.com and ESPN, checked Nov. 7, 2026
const SEC = { columns: '#pm-columns', coverage: '#pm-coverage', next: '#pm-next', download: '#pm-download' };
const SECTIONS = ['.pm-entrance', '#pm-cover', '.pm-toc', '.pm-foot'].concat(Object.entries(SEC).filter(([k]) => k !== 'download' && ISSUE[k]).map(([, s]) => s)).concat(FINAL ? ['#pm-download'] : []);
const stand = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#16328f"/></svg>`;
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || '';
const browser = await chromium.launch(proxy ? { proxy: { server: proxy }, args: ['--ignore-certificate-errors'] } : {});
const results = [];
for (const [name, width, height] of [['320', 320, 720], ['390', 390, 844], ['430', 430, 932], ['1366', 1366, 900], ['1920', 1920, 1080]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', ignoreHTTPSErrors: !!proxy }); const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine' || u === 'https://qa.local/') return route.fulfill({ contentType: 'text/html', body: frame });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine-oklahoma-week\.js/.test(u)) return route.fulfill({ contentType: 'application/javascript', body: bundle });
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/reels\/[\w-]+\.jpg/.test(u)) return poster ? route.fulfill({ contentType: 'image/jpeg', body: poster }) : route.abort();
    const m = /static\.wixstatic\.com\/media\/[0-9a-f]+_[0-9a-f]{32}~mv2\.[a-z]+\/v1\/fit\/w_(\d+),h_(\d+)/.exec(u);
    if (m && OFFLINE) return route.fulfill({ contentType: 'image/svg+xml', body: stand(+m[1], +m[2]) });
    if (/^(data|about|blob):/.test(u)) return route.continue();
    if (!OFFLINE && /^https:\/\/(static\.wixstatic\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//.test(u)) return route.continue();
    return route.abort();
  });
  await page.goto('https://qa.local/magazine', { waitUntil: 'load' });
  await page.waitForSelector('#gbm-magazine-page.pm', { timeout: 8000 });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))); });
  // Walk the page so every lazy photo is requested, then wait (up to 15 s) until every image has decoded.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += Math.round(innerHeight * 0.7)) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)); }
    for (let n = 0; n < 60 && [...document.images].some((i) => !i.complete || !i.naturalWidth); n++) await new Promise((r) => setTimeout(r, 250));
    window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
  });
  const info = await page.evaluate(({ SECTIONS, STORIES, SAME, FACTS }) => {
    const root = document.getElementById('gbm-magazine-page'), doc = document.documentElement, t = root.innerText;
    const hrefs = [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
    const storyCounts = STORIES.map((s) => hrefs.filter((h) => h === s).length);
    const assets = [...root.querySelectorAll('img')].map((i) => (/\/media\/([0-9a-f]+_[0-9a-f]{32})~mv2/.exec(i.currentSrc || i.src) || [])[1]).filter(Boolean);
    const body = getComputedStyle(root.querySelector('h2, h1')).fontFamily;
    return {
      roots: document.querySelectorAll('#gbm-magazine-page.pm').length, issue: root.getAttribute('data-issue'), h1: root.querySelectorAll('h1').length,
      overflow: doc.scrollWidth > doc.clientWidth + 1, rootOverflow: root.scrollWidth > root.clientWidth + 1, missing: SECTIONS.filter((s) => !root.querySelector(s)),
      downloadPresent: !!root.querySelector('#pm-download'),
      storyCounts, badStoryLinks: storyCounts.filter((c, i) => (i === 0 ? c < 1 : c !== 1)).length, // the cover story links from its photo, headline and button
      badLinks: hrefs.filter((h) => !/^(\/|#pm-|https:\/\/(www\.gatorbaitmedia\.com|18fb3a4e-d7f6-414a-aeb9-3047db3ea115\.usrfiles\.com\/ugd\/[\w.]+\.pdf))/.test(h)),
      leftover: /\[\[|(^|\s)-1(\s|$)/.test(t), bannedCredit: /gator\s*country|gatorcountry/i.test(t), betting: /\b(spread|moneyline|over\/under|odds|sportsbook|parlay)\b/i.test(t),
      imgsTotal: root.querySelectorAll('img').length, imgsBroken: [...root.querySelectorAll('img')].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => (i.currentSrc || i.src).slice(-60)),
      repeatedAssets: assets.filter((a, i) => assets.indexOf(a) !== i), barlow: /Barlow/i.test(body) && document.fonts.check('16px Barlow'),
      captions: [...root.querySelectorAll('figcaption, .pm-it-cr')].map((c) => c.textContent.trim()).filter(Boolean).length,
      cards: root.querySelectorAll('.pm-it').length,
      notRendered: (() => {
        const norm = (v) => String(v).replace(/\s+/g, ' ').trim(), got = (sel) => [...root.querySelectorAll(sel)].map((e) => norm(e.textContent));
        const miss = [], need = (name, want, have) => want.forEach((w) => { if (!have.includes(norm(w))) miss.push(name + ': ' + norm(w).slice(0, 60)); });
        need('cover line', SAME.coverLines, got('.pm-lines li')); need('credit line', SAME.credits, got('.pm-credits p'));
        need('up next line', SAME.nextMeta, got('.pm-meta li')); need('card title', SAME.titles, got('.pm-it h3')); need('card dek', SAME.deks, got('.pm-it-d'));
        need('section head', SAME.heads, got('.pm-sh h2, .pm-sh .pm-dek'));
        const pa = root.querySelector('.pm-entrance img'); if (SAME.posterAlt && (!pa || pa.getAttribute('alt') !== norm(SAME.posterAlt))) miss.push('poster alt');
        return miss;
      })(),
      factsMissing: FACTS.filter((f) => !t.includes(f)),
    };
  }, { SECTIONS, STORIES, SAME, FACTS });
  const fail = info.roots !== 1 || info.h1 !== 1 || info.overflow || info.rootOverflow || info.missing.length || info.badStoryLinks || info.badLinks.length || errors.length || info.bannedCredit || info.betting || info.leftover || info.imgsBroken.length || info.repeatedAssets.length || info.imgsTotal !== EXPECT_IMGS || info.cards !== ITEMS.length || info.notRendered.length || info.factsMissing.length || !info.barlow || (!FINAL && info.downloadPresent) || (FINAL && !info.downloadPresent);
  results.push({ name, fail, ...info, errors }); await page.screenshot({ path: `${out}/oklahoma-week-${name}.jpg`, type: "jpeg", quality: 78, fullPage: true }); await ctx.close();
}
await browser.close(); console.log(JSON.stringify(results, null, 1)); writeFileSync(`${out}/qa-results${FINAL ? '-final' : ''}.json`, JSON.stringify(results, null, 1) + '\n');
const bad = results.filter((r) => r.fail);
const bytes = Buffer.byteLength(bundle), cap = 212 * 1024;
console.log(`bundle ${bytes} bytes (cap ${cap}); placeholders in bundle: ${(bundle.match(/\[\[[A-Z_]+\]\]/g) || []).length}`);
if (bytes > cap) { console.error('Bundle is over the byte cap'); process.exit(1); }
if (FINAL && /\[\[[A-Z_]+\]\]/.test(bundle)) { console.error('--final: placeholders remain in the bundle'); process.exit(1); }
if (bad.length) { console.error('FAIL at', bad.map((b) => b.name).join(', ')); process.exit(1); }
console.log(`Oklahoma-week render QA passed at 320/390/430/1366/1920 (${STORIES.length} stories, ${EXPECT_IMGS} images, ${FINAL ? 'final' : 'placeholder'} mode, ${OFFLINE ? 'stand-in photos' : 'real photos'}).`);
