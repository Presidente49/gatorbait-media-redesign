// Local Magazine test: saved live /magazine <main> (02:08Z Sept. 27 TinyFish capture) + our embed, served at the real origin.
// Usage: node harness.mjs <embed.html> <label>
// No Wix API calls; every non-local request is fulfilled locally or aborted.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const [embedPath, label] = process.argv.slice(2);
const SAVED = '/root/.claude/projects/-home-user/fed92d52-1701-51e0-a673-f020aa6a1fc8/tool-results/mcp-TinyFish-fetch_content-1790474901963.txt';
const nativeMain = JSON.parse(readFileSync(SAVED, 'utf8')).results[0].text.replace(/<script[\s\S]*?<\/script>/gi, '');
const embed = readFileSync(embedPath, 'utf8');
const ORIGIN = 'https://www.gatorbaitmedia.com';
const OUT = join(HERE, 'shots'); mkdirSync(OUT, { recursive: true });

// Postgame feed stand-in (titles/authors from the 23:45Z snapshot and home-fallback.json).
const posts = [
  ['THE SWEET MUSIC CHIMES AGAIN!', 'Buddy Martin', 'the-sweet-music-chimes-again', '2026-09-27T01:30:00Z'],
  ['Halftime: Baugh Punches Ole Miss Twice', 'Franz Beard', 'halftime-baugh', '2026-09-26T21:31:00Z'],
  ['Lacy-Less in The Swamp', 'Franz Beard', 'lacy-less', '2026-09-26T18:14:00Z'],
  ['The Soothsayer is feeling some very good vibes', 'Franz Beard', 'the-soothsayer', '2026-09-26T15:00:00Z'],
  ['Fascinating Numbers', 'EDDIE GILLEY', 'fascinating-numbers', '2026-09-26T13:00:00Z'],
  ['Week 4 Preview: Florida v. Ole Miss', 'Loren Meadows', 'week-4-preview', '2026-09-26T11:00:00Z'],
  ['The Swamp Knows Something the Big Ten Doesn’t', 'Buddy Martin', 'the-swamp-knows', '2026-09-25T11:00:00Z'],
];
const rss = '<?xml version="1.0"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>' + posts.map(([t, a, s, d]) =>
  `<item><title>${t}</title><description>Test excerpt for ${t}</description><link>${ORIGIN}/post/${s}</link><dc:creator>${a}</dc:creator><pubDate>${new Date(d).toUTCString()}</pubDate><enclosure url="https://static.wixstatic.com/media/test_${s}.jpg"/></item>`).join('') + '</channel></rss>';
const IMG = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#9aa7bb"/><text x="50%" y="50%" font-size="40" text-anchor="middle" fill="#fff">img</text></svg>';

function page(e) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gatorbait Magazine | Gatorbait Media</title>${e}</head>
<body style="margin:0"><div id="SITE_CONTAINER"><div id="masterPage">${nativeMain}<footer id="gbm-footer" style="padding:20px;background:#11274a;color:#fff">GatorBait footer</footer></div></div></body></html>`;
}

async function run(browser, { name, width, path = '/magazine', feed = 'ok', noHas = false, breakMount = false, spa = false, shotAt = 'settled' }) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: width < 500, hasTouch: width < 500 });
  const pg = await ctx.newPage();
  let html = embed;
  // Simulate a browser without :has() support: the parser drops any rule whose selector list contains :has.
  if (noHas) html = html.replace(/:has\(/g, ':hasx(');
  if (breakMount) await pg.addInitScript(() => { const o = Node.prototype.insertBefore; Node.prototype.insertBefore = function (n, r) { if (n && n.id === 'gbm-magazine-page') throw new Error('simulated mount failure'); return o.call(this, n, r); }; });
  await pg.route('**/*', async route => {
    const u = new URL(route.request().url());
    if (u.origin === ORIGIN && u.pathname === '/blog-feed.xml') {
      if (feed === 'hang') return; // never answers; embed must fall back at 1.5s
      return route.fulfill({ status: 200, contentType: 'application/rss+xml', body: rss });
    }
    if (u.origin === ORIGIN) return route.fulfill({ status: 200, contentType: 'text/html', body: page(html) });
    if (u.hostname === 'static.wixstatic.com') return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: IMG });
    return route.abort();
  });
  await pg.goto(ORIGIN + (spa ? '/post/some-article' : path), { waitUntil: shotAt === 'first' ? 'commit' : 'domcontentloaded' });
  if (shotAt === 'first') await pg.waitForFunction(() => document.body && document.getElementById('SITE_PAGES'));
  if (spa) {
    await pg.waitForTimeout(300);
    await pg.evaluate(() => { history.pushState({}, '', '/magazine'); window.dispatchEvent(new Event('gbmroutechange')); });
  }
  if (shotAt !== 'first') await pg.waitForTimeout(breakMount ? 5000 : feed === 'hang' ? 2200 : 800);
  const r = await pg.evaluate(() => {
    const vis = el => { if (!el) return false; const b = el.getBoundingClientRect(), s = getComputedStyle(el); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && +s.opacity > 0 && el.checkVisibility({ opacityProperty: true, visibilityProperty: true }); };
    const items = [...document.querySelectorAll('[data-hook="item-container"],[data-hook="item-action"],[id^="pgi"]')];
    const mag = document.getElementById('gbm-magazine-page');
    return {
      nativeItems: items.length, nativeVisible: items.filter(vis).length,
      nativeTitlesVisible: [...document.querySelectorAll('#SITE_PAGES h2')].filter(vis).map(h => h.textContent.trim()).slice(0, 3),
      magazineVisible: vis(mag), cover: mag ? (mag.querySelector('.lead h1') || {}).textContent : null,
      footerVisible: vis(document.getElementById('gbm-footer')),
      htmlClass: document.documentElement.className,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  const blank = !r.magazineVisible && r.nativeVisible === 0;
  await pg.screenshot({ path: join(OUT, `${label}-${name}.png`), fullPage: shotAt !== 'first' });
  await ctx.close();
  return { name, width, ...r, blank };
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const cases = [
  { name: 'feed-390', width: 390 }, { name: 'feed-1366', width: 1366 },
  { name: 'timeout-390', width: 390, feed: 'hang' }, { name: 'timeout-1366', width: 1366, feed: 'hang' },
  { name: 'firstpaint-390', width: 390, shotAt: 'first', feed: 'hang' },
  { name: 'nohas-390', width: 390, noHas: true }, { name: 'nohas-1366', width: 1366, noHas: true },
  { name: 'mountfail-390', width: 390, breakMount: true },
  { name: 'spa-390', width: 390, spa: true },
];
const results = [];
for (const c of cases) results.push(await run(browser, c));
await browser.close();
writeFileSync(join(HERE, `results-${label}.json`), JSON.stringify(results, null, 1));
for (const r of results) console.log(label.padEnd(7), r.name.padEnd(15), 'native', `${r.nativeVisible}/${r.nativeItems}`.padEnd(6), 'mag', String(r.magazineVisible).padEnd(5), 'footer', String(r.footerVisible).padEnd(5), 'blank', String(r.blank).padEnd(5), 'sw', r.scrollWidth, (r.cover || '').slice(0, 30));
