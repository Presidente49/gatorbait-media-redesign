// Live check for the Florida stats embed (756655cf): does /florida-football-stats mount, which data is baked,
// does the live-score reader fire in a game window, and does the embed stay out of other routes?
// Prints one JSON line per route and profile; exits 1 on a hard failure. CI-only.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = 'build/stats-live';
mkdirSync(OUT, { recursive: true });
const BASE = 'https://www.gatorbaitmedia.com';
const bust = 'v=' + Date.now();
const PROFILES = [
  { name: 'phone390', context: { userAgent: devices['iPhone 13'].userAgent, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  { name: 'desktop', context: { viewport: { width: 1365, height: 900 } } }
];
// 'stats-spa' loads the homepage, then moves to the stats route in-page the way the site shell does
// (pushState + gbmroutechange). It exercises the live embed even while the Wix page itself is missing.
const ROUTES = [
  { name: 'stats', path: '/florida-football-stats', expectMount: true },
  { name: 'home', path: '/', expectMount: false },
  { name: 'stats-spa', path: '/', spa: '/florida-football-stats', expectMount: true }
];
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=401856708';

const browser = await chromium.launch();
let failed = 0;
for (const prof of PROFILES) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext(prof.context);
    const page = await ctx.newPage();
    const errors = [], reads = [];
    page.on('pageerror', e => errors.push(String(e.message).slice(0, 200)));
    page.on('requestfinished', async r => {
      const u = r.url();
      if (/site\.api\.espn\.com|site\.web\.api\.espn\.com|florida-stats\.json/.test(u)) {
        const res = await r.response().catch(() => null);
        reads.push({ url: u.replace(/\?b=\d+/, '?b=…'), status: res && res.status() });
      }
    });
    page.on('requestfailed', r => { if (/espn\.com|florida-stats\.json/.test(r.url())) reads.push({ url: r.url(), failed: r.failure() && r.failure().errorText }); });
    const resp = await page.goto(`${BASE}${route.path}?${bust}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000);
    const http = resp && resp.status();
    if (route.spa) {
      await page.evaluate(p => { history.pushState({}, '', p); window.dispatchEvent(new Event('gbmroutechange')); }, route.spa);
      await page.waitForTimeout(5000);
    }
    // Can a reader's browser on this origin read ESPN directly? CDP records the real response even when CORS hides it.
    let espnFromSite, espnDiag;
    if (route.name === 'home') {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      const seen = {};
      cdp.on('Network.responseReceived', e => {
        if (/espn\.com/.test(e.response.url)) seen[e.response.url] = { status: e.response.status, acao: e.response.headers['access-control-allow-origin'] || e.response.headers['Access-Control-Allow-Origin'] || null, server: e.response.headers.server || e.response.headers.Server || null };
      });
      cdp.on('Network.loadingFailed', e => { seen['failed:' + e.requestId] = { error: e.errorText, blocked: e.blockedReason || null, cors: e.corsErrorStatus || null }; });
      const urls = [ESPN, ESPN.replace('//site.api.', '//site.web.api.'), 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups=8'];
      const results = await page.evaluate(us => Promise.all(us.map(u => fetch(u).then(x => x.status + ' ' + x.headers.get('access-control-allow-origin')).catch(e => 'error ' + e.message))), urls);
      await page.waitForTimeout(1000);
      espnFromSite = results[0];
      espnDiag = { results: Object.fromEntries(urls.map((u, i) => [u.split('/')[2] + ' ' + u.split('/').pop(), results[i]])), seen, ua: await page.evaluate(() => navigator.userAgent), brands: await page.evaluate(() => navigator.userAgentData ? navigator.userAgentData.brands.map(b => b.brand).join(',') : null) };
    }
    const r = await page.evaluate(() => {
      const m = document.getElementById('gbm-stats');
      const row = m && [...m.querySelectorAll('.fs-log tbody tr')].find(t => /Missouri/.test(t.textContent));
      return {
        embedLoaded: !!window.__GBM_FLSTATS__,
        dataUpdated: window.__GBM_FLSTATS__ && window.__GBM_FLSTATS__.updated,
        mounted: !!m,
        title: document.title,
        meta: m && m.querySelector('.fs-meta') && m.querySelector('.fs-meta').textContent,
        record: m && m.querySelector('.fs-tile b') && m.querySelector('.fs-tile b').textContent,
        missouriRow: row && row.textContent.replace(/\s+/g, ' ').trim(),
        liveBadge: !!(m && m.querySelector('.fs-live')),
        nativeHidden: !!document.getElementById('SITE_PAGES') && getComputedStyle(document.getElementById('SITE_PAGES')).display === 'none',
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        font: m ? getComputedStyle(m.querySelector('h1')).fontFamily : null
      };
    });
    await page.screenshot({ path: `${OUT}/${route.name}-${prof.name}.png`, fullPage: false });
    const ourErrors = errors.filter(e => /FLSTATS|gbm-stats|flstats/i.test(e));
    const bad = [];
    // Wix serves no custom embeds on its 404 page, so a missing page is reported, not failed: it needs the editor.
    const pageMissing = route.name === 'stats' && http === 404;
    if (!pageMissing && !r.embedLoaded) bad.push('embed script missing');
    if (!pageMissing && route.expectMount !== r.mounted) bad.push(`mounted=${r.mounted}`);
    if (espnFromSite !== undefined && !/^200 \*$/.test(espnFromSite)) bad.push(`espn from site: ${espnFromSite}`);
    if (route.expectMount && r.overflow) bad.push('horizontal overflow');
    if (route.expectMount && !/Barlow/.test(r.font || '')) bad.push(`font=${r.font}`);
    if (ourErrors.length) bad.push('stats errors');
    if (bad.length) failed++;
    console.log(JSON.stringify({ route: route.name, profile: prof.name, http, pageMissing, ok: !bad.length, bad, ...r, espnFromSite, espnDiag, reads, pageErrors: errors }));
    await ctx.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
