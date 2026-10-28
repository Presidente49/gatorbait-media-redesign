// Controlled Chromium regression for the current Broadcast color skin, not the retired .fp renderer.
// Uses fixture game data and images; this is component behavior evidence, not live delivery/device proof.
// PLAYWRIGHT=/existing/playwright CHROMIUM_PATH=/existing/chromium node sports-live/test-homepage-accessibility.mjs
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
const skin = readFileSync(new URL('./broadcast-home-color.js', import.meta.url), 'utf8');
const now = Date.now(), day = 86400000;
const records = Array.from({ length: 9 }, (_, i) => ({
  title: `Fixture story ${i + 1}`, path: `/post/accessibility-fixture-${i + 1}`,
  date: new Date(now - (i + 1) * 60000).toUTCString(),
  image: `https://static.wixstatic.com/media/16b519_${String(i + 1).padStart(32, '0')}~mv2.jpg`,
}));
const rss = '<rss xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>' + records.map(p =>
  `<item><title>${p.title}</title><link>https://www.gatorbaitmedia.com${p.path}</link><pubDate>${p.date}</pubDate><dc:creator>Loren Meadows</dc:creator><description>Component regression fixture.</description><enclosure url="${p.image}"/></item>`
).join('') + '</channel></rss>';
const story = (p, lead = false) => `<article class="${lead ? 'sh-lead' : ''}"><figure><a href="${p.path}"><img src="${p.image}" alt="Fixture photograph"></a></figure><div class="sh-lead-copy"><a href="${p.path}"><${lead ? 'h1' : 'h2'}>${p.title}</${lead ? 'h1' : 'h2'}></a><p class="sh-meta">Loren Meadows</p></div></article>`;
const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0}#gbm-live main{padding:0 28px;margin:auto}.sh-lead{position:relative}.sh-front{display:grid}figure{margin:0}.sh-support article>a{display:block}img{max-width:100%}</style></head><body><div id="gbm-live" class="gbm-gazette gbm-sports-home"><main id="sh-main">${story(records[0], true)}<div class="sh-front"><div class="sh-support">${records.slice(1).map(p => story(p)).join('')}</div><div class="sh-latest"><h2 class="sh-section-title">Latest stories</h2><a class="sh-more" href="/gatorbait-media-blogs">More stories</a></div></div></main></div><button id="after">After homepage</button><script>${skin.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
const fixtureImage = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="#0021a5"/></svg>';
const makeScore = () => ({ team: { name: 'Florida' },
  last: { opponent: 'Fixture Opponent', date: new Date(now - 2 * day).toISOString(), score: { fla: 27, opp: 24 }, home: true },
  next: { opponent: 'Next Fixture', kickoffIso: new Date(now + 3 * day).toISOString(), home: true },
});
const executablePath = process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
let checks = 0;
try {
  for (const width of [320, 390, 430, 1366]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e)));
    let score = makeScore();
    await page.route('**/*', route => {
      const u = new URL(route.request().url());
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/') return route.fulfill({ contentType: 'text/html', body: html });
      if (u.pathname === '/blog-feed.xml') return route.fulfill({ contentType: 'application/xml', body: rss });
      if (u.pathname.endsWith('/scoreboard.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(score) });
      if (u.pathname.endsWith('/front-page.config.json')) return route.fulfill({ contentType: 'application/json', body: '{}' });
      if (u.hostname === 'static.wixstatic.com') return route.fulfill({ contentType: 'image/svg+xml', body: fixtureImage });
      return route.abort();
    });
    await page.goto('https://www.gatorbaitmedia.com/');
    await page.waitForSelector('.bc-photo-rows .bc-compact img');
    const pause = page.getByRole('button', { name: 'Pause ticker', exact: true });
    await pause.waitFor();
    const buttonBox = await pause.boundingBox();
    assert.ok(buttonBox.height >= 44 && buttonBox.width >= 44, `${width}: ticker control has a usable touch target`);
    await pause.focus(); await page.keyboard.press('Space');
    assert.equal(await page.locator('.bc-tk').getAttribute('data-paused'), 'true');
    assert.equal(await page.locator('.bc-trk').evaluate(e => getComputedStyle(e).animationPlayState), 'paused');
    assert.equal(await page.getByRole('button', { name: 'Resume ticker', exact: true }).count(), 1);
    await page.keyboard.press('Space');
    assert.equal(await page.locator('.bc-tk').getAttribute('data-paused'), 'false');
    checks += 4;

    const firstTickerLink = page.locator('.bc-trk>div:not([aria-hidden]) a').first();
    await firstTickerLink.focus();
    await page.evaluate(() => { window.fixtureFocus = document.activeElement; });
    assert.equal(await page.locator('.bc-trk').evaluate(e => getComputedStyle(e).animationName), 'none', `${width}: keyboard reading stops moving content`);
    score.last.score.fla = 31;
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await page.waitForFunction(() => document.querySelector('.bc-sc .bc-pt')?.textContent === '24' && [...document.querySelectorAll('.bc-sc .bc-pt')].some(e => e.textContent === '31'));
    assert.equal(await page.evaluate(() => document.activeElement === window.fixtureFocus), true, `${width}: game refresh preserves keyboard focus`);
    assert.match(await page.locator('.bc-trk').textContent(), /Florida 27/, `${width}: focused ticker defers content replacement`);
    await page.locator('#after').focus();
    await page.waitForFunction(() => document.querySelector('.bc-trk')?.textContent.includes('Florida 31'));
    checks += 3;

    const teamNames = await page.locator('.bc-sc .bc-nm').evaluateAll(es => es.map(e => ({ text: e.textContent, display: getComputedStyle(e).display })));
    assert.deepEqual(teamNames.map(e => e.text), ['Fixture Opponent', 'Florida']);
    assert.ok(teamNames.every(e => e.display !== 'none'), `${width}: team names remain available to assistive technology`);
    const ax = await page.locator('.bc-sc').ariaSnapshot();
    assert.match(ax, /Fixture Opponent/); assert.match(ax, /Florida/);
    checks += 3;

    const compact = page.locator('.bc-photo-rows .bc-compact img').first();
    await compact.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.bc-compact img')].some(e => e.complete && e.naturalWidth > 0));
    const image = await compact.evaluate(e => ({ src: e.currentSrc, width: e.getBoundingClientRect().width, sizes: e.sizes }));
    assert.match(image.src, /w_160,h_160/, `${width}: compact thumbnail requests a display-appropriate source at 1x`);
    assert.equal(Math.round(image.width), width <= 820 ? 92 : 128);
    assert.match(await page.locator('.bc-feature img').first().getAttribute('src'), /w_800,h_800/, 'feature photography keeps its existing quality');
    await page.keyboard.press('Tab');
    await page.locator('.bc-feature>a').first().focus();
    const ring = await page.locator('.bc-feature>a').first().evaluate(e => ({ visible: e.matches(':focus-visible'), offset: getComputedStyle(e).outlineOffset, width: getComputedStyle(e).outlineWidth }));
    assert.equal(ring.visible, true); assert.equal(ring.offset, '-4px'); assert.equal(ring.width, '3px');
    checks += 5;
    assert.equal(await page.locator('.bc-photo-rows .bc-row').count(), 8, 'one lead plus eight unchanged story slots');
    assert.equal(await page.locator('.bc-photo-rows .bc-author').count(), 8, 'verified bylines stay visible');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width}: no horizontal overflow`);
    assert.deepEqual(errors, []);
    checks += 4;

    score.last.date = new Date(now - 10 * day).toISOString();
    await page.locator('#after').focus();
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await page.waitForFunction(() => document.querySelector('.bc-tk')?.hidden === true);
    checks++;

    await page.emulateMedia({ reducedMotion: 'reduce' });
    score = makeScore();
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await page.waitForFunction(() => document.querySelector('.bc-tk')?.hidden === false);
    assert.equal(await page.locator('.bc-trk').evaluate(e => getComputedStyle(e).animationName), 'none');
    assert.equal(await pause.isVisible(), false, 'reduced-motion readers get a static scrollable ticker without an ineffective play control');
    assert.equal(await page.locator('.bc-tw').evaluate(e => getComputedStyle(e).overflowX), 'auto');
    checks += 3;
    await context.close();
    console.log(`PASS ${width}px: ticker control/focus, scoreboard names, responsive thumbnails, story-card focus, motion and unchanged story slots`);
  }
} finally { await browser.close(); }
console.log(`PASS ${checks} component assertions (Chromium fixture; no live deployment or device proof).`);
