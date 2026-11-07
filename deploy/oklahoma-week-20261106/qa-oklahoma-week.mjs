#!/usr/bin/env node
// Render QA for the Oklahoma-week web bundle (sports-live/magazine-oklahoma-week.js), served in place of the jsDelivr pin
// inside the real loader fixture (sports-live/magazine-oklahoma-week-frame.html). Real Wix photos and Barlow load through the
// network (set --offline for stand-in photos). The cover poster is served from the committed file next to the bundle.
// Checks at 320/390/430/1366/1920: one #gbm-magazine-page.pm, exactly one h1, no horizontal overflow, every section the issue defines,
// all 12 distinct story destinations, one complete card per story, and the exact image count the JSON defines.
// Editorial mode additionally checks the full 12-story index, Buddy/Franz priority, full-width mobile text, images above text,
// two desktop card columns, the real newsletter-bar selector suppressed, and the sticky bar remaining at the viewport top.
// Every link stays site-relative or on the small allow-list; no unresolved placeholders, banned credits or betting copy; every
// image loaded, no repeated image asset, Barlow applied, no page errors. The shared renderer silently cuts strings at fixed lengths
// (cover lines 80, credit lines 80, titles 200 ...), so the rendered cover lines, credit lines, card titles and decks, section heads,
// "up next" lines and the poster alt text must equal the JSON text; the verified game facts (7:45 p.m. ET, SEC Network, Ben Hill Griffin
// Stadium) must be on the page. Owner order Nov. 7: no basketball in this edition, so no basketball story link and none of the words
// basketball, Condon, McMiller, Chattanooga or O'Dome anywhere in the rendered text, image alt text or bundle.
// Placeholder mode (default): the two PDF URLs are still [[...]], so #pm-download must be ABSENT. --final: #pm-download must exist,
// point at the usrfiles PDF host, and no "[[" may remain in the bundle.
// Usage: node deploy/oklahoma-week-20261106/qa-oklahoma-week.mjs [outdir] [--final] [--offline]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = (() => { if (process.env.PLAYWRIGHT_PKG) return require(process.env.PLAYWRIGHT_PKG); try { return require('playwright'); } catch (_) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const args = process.argv.slice(2), FINAL = args.includes('--final'), OFFLINE = args.includes('--offline');
const out = args.find((a) => !a.startsWith('--')) || 'deploy/oklahoma-week-20261106/shots';
mkdirSync(out, { recursive: true });
const bundle = readFileSync('sports-live/magazine-oklahoma-week.js', 'utf8');
const frame = readFileSync('sports-live/magazine-oklahoma-week-frame.html', 'utf8');
const ISSUE = JSON.parse(readFileSync('sports-live/magazine-issue-oklahoma-week.json', 'utf8'));
const EDITORIAL = ISSUE.readerStyle === 'editorial';
const popupFixture = '<div id="gbc-bar" style="position:fixed;bottom:0;left:0;right:0;z-index:2147483000;background:#fff4bd"><aside class="gbc-prompt" data-gbm-capture="magazine-prompt">Newsletter prompt fixture: must be hidden while the magazine is mounted.</aside></div>';
const frameWithPopup = frame.replace('</body>', popupFixture + '</body>');
const posterFile = ISSUE.cover.poster && ISSUE.cover.poster.file;
const poster = posterFile && existsSync('sports-live/reels/' + posterFile) ? readFileSync('sports-live/reels/' + posterFile) : null;
const ITEMS = [...ISSUE.columns.items, ...ISSUE.coverage.items];
const STORIES = [ISSUE.cover.url, ...ITEMS.map((i) => i.url)];
const STORY_RECORDS = [{ title: ISSUE.cover.headline, author: String(ISSUE.cover.byline || '').replace(/^By\s+/i, ''), url: ISSUE.cover.url }, ...ITEMS];
const MIN_STORIES = 12; // Complete Nov. 7 release, including Meyer by the Numbers, Loren, Part 2 and the starter update.
const NO_BASKETBALL = /basketball|condon|mcmiller|chattanooga|o.dome|\/post\/condon-flirts|showtime-at-the-o-dome/i;
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
const SECTIONS = (EDITORIAL ? ['.pm-editorial', '#pm-contents', '.pm-foot'] : ['.pm-entrance', '#pm-cover', '.pm-toc', '.pm-foot']).concat(Object.entries(SEC).filter(([k]) => k !== 'download' && ISSUE[k]).map(([, s]) => s)).concat(FINAL ? ['#pm-download'] : []);
const stand = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#16328f"/></svg>`;
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || '';
const browser = await chromium.launch({ ...(proxy ? { proxy: { server: proxy }, args: ['--ignore-certificate-errors'] } : {}), ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
const results = [];
for (const [name, width, height] of [['320', 320, 720], ['390', 390, 844], ['430', 430, 932], ['1366', 1366, 900], ['1920', 1920, 1080]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', ignoreHTTPSErrors: !!proxy }); const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u === 'https://qa.local/magazine' || u === 'https://qa.local/') return route.fulfill({ contentType: 'text/html', body: EDITORIAL ? frameWithPopup : frame });
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
  await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }); });
  // Walk the page so every lazy photo is requested, then wait (up to 15 s) until every image has decoded.
  await page.evaluate(async () => {
    const limit = Math.min(document.body.scrollHeight, 50000);
    for (let y = 0; y <= limit; y += Math.round(innerHeight * 0.7)) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    for (let n = 0; n < 60 && [...document.images].some((i) => !i.complete || !i.naturalWidth); n++) await new Promise((r) => setTimeout(r, 250));
    window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
  });
  const info = await page.evaluate(({ SECTIONS, STORIES, STORY_RECORDS, SAME, FACTS, EDITORIAL, NO_BASKETBALL: NB }) => {
    const NO_BASKETBALL = new RegExp(NB, 'i');
    const root = document.getElementById('gbm-magazine-page'), doc = document.documentElement, t = root.innerText;
    const hrefs = [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
    const norm = (v) => String(v || '').replace(/\s+/g, ' ').trim();
    const storyNodes = STORY_RECORDS.map((_, i) => root.querySelector('#pm-story-' + (i + 1)));
    const rawStoryLinkCounts = EDITORIAL ? STORIES.map((s, i) => storyNodes[i] ? [...storyNodes[i].querySelectorAll('a[href]')].filter((a) => a.getAttribute('href') === s).length : 0) : STORIES.map((s) => hrefs.filter((h) => h === s).length);
    // The cover has separate photo, headline and CTA anchors to the same article; they are one destination.
    const storyCounts = EDITORIAL ? STORIES.map((s, i) => storyNodes[i] ? new Set([...storyNodes[i].querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => h === s)).size : 0) : rawStoryLinkCounts;
    const assets = [...root.querySelectorAll('img')].map((i) => (/\/media\/([0-9a-f]+_[0-9a-f]{32})~mv2/.exec(i.currentSrc || i.src) || [])[1]).filter(Boolean);
    const body = getComputedStyle(root.querySelector('h2, h1')).fontFamily;
    const index = root.querySelector('#pm-contents');
    const indexLinks = index ? [...index.querySelectorAll('a[href^="#pm-story-"]')] : [];
    const expectedIndex = STORY_RECORDS.map((story, i) => ({ href: '#pm-story-' + (i + 1), title: story.title, author: story.author }));
    const missingIndex = EDITORIAL ? expectedIndex.filter((story) => !indexLinks.some((a) => a.getAttribute('href') === story.href && norm(a.textContent).includes(norm(story.title)) && norm(a.textContent).includes(norm(story.author)))) : [];
    const missingStoryHeadings = EDITORIAL ? STORY_RECORDS.filter((story, i) => !storyNodes[i] || norm(storyNodes[i].querySelector('h1,h2,h3')?.textContent) !== norm(story.title)) : [];
    const orderedStories = [...root.querySelectorAll('[id^="pm-story-"]')].map((el) => ({ title: norm(el.querySelector('h1,h2,h3')?.textContent), text: norm(el.textContent) }));
    const firstBuddyFranz = !EDITORIAL || (orderedStories.length === 12 && /Monster/i.test(orderedStories[0].title) && /Buddy Martin/i.test(orderedStories[0].text) && /Soothsayer/i.test(orderedStories[1].title) && /Franz Beard/i.test(orderedStories[1].text));
    const textWidths = [...root.querySelectorAll('.pm-it-b')].map((el) => Math.round(el.getBoundingClientRect().width * 10) / 10);
    const mobileTextTooNarrow = EDITORIAL && innerWidth < 700 ? textWidths.filter((w) => w < innerWidth - 40) : [];
    const imageLayoutErrors = EDITORIAL ? [...root.querySelectorAll('.pm-it.pm-has-img')].filter((el) => {
      const photo = el.querySelector('.pm-thumb'), text = el.querySelector('.pm-it-b');
      if (!photo || !text) return true;
      const p = photo.getBoundingClientRect(), b = text.getBoundingClientRect();
      return p.bottom > b.top + 2 || (innerWidth < 700 && p.width < innerWidth - 40);
    }).map((el) => el.id || norm(el.querySelector('h3')?.textContent)) : [];
    const desktopColumnErrors = EDITORIAL && innerWidth >= 1000 ? [...root.querySelectorAll('.pm-list')].filter((el) => getComputedStyle(el).gridTemplateColumns.split(/\s+/).filter(Boolean).length !== 2).length : 0;
    const popup = document.getElementById('gbc-bar');
    const rgb = (value) => {
      const values = String(value).match(/[\d.]+/g);
      return values && values.length >= 3 ? values.slice(0, 3).map(Number) : null;
    };
    const luminance = (color) => color.map((v) => v / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    const editionCtas = EDITORIAL ? [...root.querySelectorAll('.pm-edition-actions .pm-btn')].map((a) => {
      const css = getComputedStyle(a), fill = css.getPropertyValue('-webkit-text-fill-color') || css.color;
      const foreground = rgb(fill), background = rgb(css.backgroundColor);
      const levels = foreground && background ? [luminance(foreground), luminance(background)].sort((a, b) => b - a) : null;
      return { text: norm(a.textContent), color: css.color, textFillColor: fill, background: css.backgroundColor, contrast: levels ? Math.round((levels[0] + .05) / (levels[1] + .05) * 100) / 100 : 0 };
    }) : [];
    return {
      roots: document.querySelectorAll('#gbm-magazine-page.pm').length, issue: root.getAttribute('data-issue'), h1: root.querySelectorAll('h1').length,
      overflow: doc.scrollWidth > doc.clientWidth + 1, rootOverflow: root.scrollWidth > root.clientWidth + 1, missing: SECTIONS.filter((s) => !root.querySelector(s)),
      downloadPresent: !!root.querySelector('#pm-download'),
      storyCounts, rawStoryLinkCounts, badStoryLinks: storyCounts.filter((c, i) => (EDITORIAL ? c !== 1 : i === 0 ? c < 1 : c !== 1)).length,
      badLinks: hrefs.filter((h) => !/^(\/|#pm-|https:\/\/(www\.gatorbaitmedia\.com|18fb3a4e-d7f6-414a-aeb9-3047db3ea115\.usrfiles\.com\/ugd\/[\w.]+\.pdf))/.test(h)),
      leftover: /\[\[|(^|\s)-1(\s|$)/.test(t), bannedCredit: /gator\s*country|gatorcountry/i.test(t), betting: /\b(spread|moneyline|over\/under|odds|sportsbook|parlay)\b/i.test(t),
      imgsTotal: root.querySelectorAll('img').length, imgsBroken: [...root.querySelectorAll('img')].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => (i.currentSrc || i.src).slice(-60)),
      repeatedAssets: assets.filter((a, i) => assets.indexOf(a) !== i), barlow: /Barlow/i.test(body) && document.fonts.check('16px Barlow'),
      captions: [...root.querySelectorAll('figcaption, .pm-it-cr')].map((c) => c.textContent.trim()).filter(Boolean).length,
      cards: root.querySelectorAll('.pm-it').length,
      editorial: EDITORIAL,
      storyTargets: storyNodes.filter(Boolean).length,
      indexCount: indexLinks.length,
      indexDistinctTargets: new Set(indexLinks.map((a) => a.getAttribute('href'))).size,
      missingIndex: missingIndex.map((s) => s.title),
      missingStoryHeadings: missingStoryHeadings.map((s) => s.title),
      firstBuddyFranz,
      firstTwoStories: orderedStories.slice(0, 2).map((s) => s.title),
      mobileTextWidths: textWidths,
      mobileTextTooNarrow,
      imageLayoutErrors,
      desktopColumnErrors,
      popupSuppressed: !EDITORIAL || !!popup && getComputedStyle(popup).display === 'none' && popup.getClientRects().length === 0,
      editionCtas,
      editionCtaErrors: editionCtas.filter((a) => !a.text || a.contrast < 4.5),
      notRendered: (() => {
        const norm = (v) => String(v).replace(/\s+/g, ' ').trim(), got = (sel) => [...root.querySelectorAll(sel)].map((e) => norm(e.textContent));
        const miss = [], need = (name, want, have) => want.forEach((w) => { if (!have.includes(norm(w))) miss.push(name + ': ' + norm(w).slice(0, 60)); });
        if (!EDITORIAL) need('cover line', SAME.coverLines, got('.pm-lines li'));
        need('credit line', SAME.credits, got('.pm-credits p'));
        need('up next line', SAME.nextMeta, got('.pm-meta li')); need('card title', SAME.titles, got('.pm-it h3')); need('card dek', SAME.deks, got('.pm-it-d'));
        need('section head', SAME.heads, got('.pm-sh h2, .pm-sh .pm-dek'));
        const pa = root.querySelector('.pm-entrance img, .pm-edition-cover img'); if (!EDITORIAL && SAME.posterAlt && (!pa || pa.getAttribute('alt') !== norm(SAME.posterAlt))) miss.push('poster alt');
        return miss;
      })(),
      factsMissing: FACTS.filter((f) => !t.includes(f)),
      basketball: [t, ...[...root.querySelectorAll('img')].map((i) => i.getAttribute('alt') || ''), ...hrefs].filter((x) => NO_BASKETBALL.test(x)).map((x) => x.slice(0, 60)),
    };
  }, { SECTIONS, STORIES, STORY_RECORDS, SAME, FACTS, EDITORIAL, NO_BASKETBALL: NO_BASKETBALL.source });
  info.stickySamples = [];
  if (EDITORIAL) {
    const origin = await page.locator('.pm-readerbar').evaluate((bar) => bar.getBoundingClientRect().top + scrollY);
    for (const y of [origin + 60, origin + 220, origin + 600, origin + 1000]) {
      info.stickySamples.push(await page.evaluate(async (y) => {
        scrollTo(0, y); await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const bar = document.querySelector('.pm-readerbar'), rect = bar.getBoundingClientRect();
        return { scrollY, top: rect.top, height: rect.height };
      }, y));
    }
    info.stickyStable = info.stickySamples.every((s) => Math.abs(s.top) <= 1) && Math.max(...info.stickySamples.map((s) => s.top)) - Math.min(...info.stickySamples.map((s) => s.top)) <= 1;
    // Open the real index once: inspect and record the navigable 12-story contents before returning to the first screen.
    await page.locator('#pm-contents .pm-issue-index').evaluate((details) => { details.open = true; });
    info.indexVisibleWhenOpened = await page.locator('#pm-contents a[href^="#pm-story-"]').evaluateAll((links) => links.length === 12 && links.every((a) => a.getBoundingClientRect().height >= 44));
    await page.locator('#pm-contents').screenshot({ path: `${out}/oklahoma-week-${name}-contents.jpg`, type: 'jpeg', quality: 82 });
    await page.locator('#pm-contents .pm-issue-index').evaluate((details) => { details.open = false; });
    await page.evaluate(() => scrollTo(0, 0));
  }
  const editorialFail = EDITORIAL && (info.storyTargets !== 12 || info.indexCount !== 12 || info.indexDistinctTargets !== 12 || info.missingIndex.length || info.missingStoryHeadings.length || !info.firstBuddyFranz || info.mobileTextTooNarrow.length || info.imageLayoutErrors.length || info.desktopColumnErrors || !info.popupSuppressed || !info.stickyStable || !info.indexVisibleWhenOpened || info.editionCtaErrors.length);
  const fail = info.roots !== 1 || info.h1 !== 1 || info.overflow || info.rootOverflow || info.missing.length || info.badStoryLinks || info.badLinks.length || errors.length || info.bannedCredit || info.betting || info.leftover || info.imgsBroken.length || info.repeatedAssets.length || info.imgsTotal !== EXPECT_IMGS || (!EDITORIAL && info.cards !== ITEMS.length) || info.notRendered.length || info.factsMissing.length || info.basketball.length || !info.barlow || (!FINAL && info.downloadPresent) || (FINAL && !info.downloadPresent) || editorialFail;
  if (EDITORIAL && (name === '390' || name === '1366')) {
    await page.screenshot({ path: `${out}/oklahoma-week-${name}-top.jpg`, type: 'jpeg', quality: 85, fullPage: false });
    await page.locator('.pm-it').nth(0).screenshot({ path: `${out}/oklahoma-week-${name}-buddy.jpg`, type: 'jpeg', quality: 85 });
    await page.locator('.pm-it').nth(1).screenshot({ path: `${out}/oklahoma-week-${name}-franz.jpg`, type: 'jpeg', quality: 85 });
    await page.evaluate(() => scrollTo(0, 0));
  }
  results.push({ name, fail, ...info, errors }); await page.screenshot({ path: `${out}/oklahoma-week-${name}.jpg`, type: "jpeg", quality: 78, fullPage: true }); await ctx.close();
}
await browser.close(); console.log(JSON.stringify(results, null, 1)); writeFileSync(`${out}/qa-results${FINAL ? '-final' : ''}.json`, JSON.stringify(results, null, 1) + '\n');
const bad = results.filter((r) => r.fail);
const bytes = Buffer.byteLength(bundle), cap = 212 * 1024;
console.log(`bundle ${bytes} bytes (cap ${cap}); placeholders in bundle: ${(bundle.match(/\[\[[A-Z_]+\]\]/g) || []).length}`);
if (NO_BASKETBALL.test(bundle)) { console.error('Bundle still mentions the removed basketball stories'); process.exit(1); }
if (bytes > cap) { console.error('Bundle is over the byte cap'); process.exit(1); }
if (FINAL && /\[\[[A-Z_]+\]\]/.test(bundle)) { console.error('--final: placeholders remain in the bundle'); process.exit(1); }
if (bad.length) { console.error('FAIL at', bad.map((b) => b.name).join(', ')); process.exit(1); }
console.log(`Oklahoma-week render QA passed at 320/390/430/1366/1920 (${STORIES.length} stories, ${EXPECT_IMGS} images, ${FINAL ? 'final' : 'placeholder'} mode, ${OFFLINE ? 'stand-in photos' : 'real photos'}).`);
