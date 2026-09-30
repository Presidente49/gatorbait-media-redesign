#!/usr/bin/env node
// Shell 2026 browser QA: header-v2 / footer-v2 against the live header (7fee4de6 rev 30) and footer (f8b950c9 rev 27).
// Serves a mock Wix page AS https://www.gatorbaitmedia.com/<route> (real origin, Lesson 34) with the live mobile shell from
// fdc2127a rev 85 and the Light Theme footer rules, then checks each variant at 320/390/430/1024/1366.
// Usage: NODE_PATH=<dir with playwright> PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node deploy/shell-2026/qa/qa-shell.mjs
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..');
const read = (p) => readFileSync(join(dir, p), 'utf8');
const shell = read('qa/fixtures/fdc2127a-rev85-mobile-shell.html');
const light = read('qa/fixtures/light-theme-c66d5b7f-rev8-footer-rules.css');
const VARIANTS = { live: [read('header-live.html'), read('footer-live.html')], v2: [read('header-v2.html'), read('footer-v2.html')] };
const STORE = 'https://gatorbait2026.itemorder.com/shop/home/';
const WIDTHS = [320, 390, 430, 1024, 1366];
const ROUTES = ['/post/sample-story', '/contact', '/pricing-plans', '/the-buddy-martin-show', '/gatorbait-media-blogs', '/'];
mkdirSync(join(here, 'shots'), { recursive: true });

// Mock Wix page: native header (with the old SHOP -> /category/all-products item), page fixtures, native footer.
const fixtures = `
<div data-hook="post-page"><article data-hook="post"><h1 data-hook="post-title">Florida Beats Ole Miss 52-28</h1>
<div data-hook="post-content"><p>Story text with a <a class="story-store" href="${STORE}">store link inside the copy</a>.</p><h2>Subhead</h2><ul><li>Item</li></ul>
<div data-hook="image-viewer-pwtw9126"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="400" height="300" alt=""></div></div></article>
<div data-hook="recent-post-list-item"><div data-hook="recent-post__title"><a href="/post/x">Recent story</a></div></div></div>
<h1 data-hook="app-title">Join GatorBait</h1>
<div data-hook="plan"><div><div data-hook="ribbon">Best value</div><div><div><span data-hook="plan-title"><span>All Access</span></span><span data-hook="plan-price">$5</span><button data-hook="plan-cta"><span>Choose</span></button></div></div></div></div>
<div id="comp-lii7mqeb"><h1><span>Contact</span></h1></div>
<div id="comp-lii7mqe42"><div data-mesh-id="comp-lii7mqe42inlineContent-gridContainer"><div id="comp-lii7mqfa2"><div data-mesh-id="comp-lii7mqfa2inlineContent-gridContainer"><div><label>Name<input></label></div></div></div>
<div id="comp-lii7mqfb3"><textarea></textarea></div><div id="comp-lii7mqfp4"><button data-testid="buttonElement"><span>&gt;</span></button></div></div></div>
<div id="gbm-tv"><div class="hero"><h1>GatorBait TV</h1><p class="dek">Watch the show.</p></div></div>
<div role="dialog" id="nl-dialog"><h2>Join GatorBait Weekly</h2><p>Enter your email address to subscribe to our newsletter.</p><span>Quick Chomps</span><button aria-label="Close">x</button></div>`;
const page = (v) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;font-family:Arial,sans-serif}#SITE_HEADER{display:block;height:96px;background:#fff}#SITE_HEADER nav a{margin:0 8px}#SITE_FOOTER{height:80px}</style>
${VARIANTS[v][0]}${shell}<style>${light}</style></head><body>
<header id="SITE_HEADER"><div id="comp-mmz3w23y"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="200" height="60" alt="old logo"></div>
<nav><a href="/">HOME</a><a href="/gatorbait-media-blogs">Latest</a><a class="native-shop" href="https://www.gatorbaitmedia.com/category/all-products">SHOP</a><a href="/pricing-plans/subscribe">JOIN</a></nav></header>
<main id="SITE_PAGES">${fixtures}</main><footer id="SITE_FOOTER">Native Wix footer</footer>${VARIANTS[v][1]}</body></html>`;

// Elements outside the header/footer whose computed look must be identical between the live header and v2.
const SAME = ['#SITE_HEADER', 'body', '[data-hook=post-page]', '[data-hook=post-title]', '[data-hook=post-content]', '[data-hook=post-content] p', '[data-hook=post-content] h2',
  'article[data-hook=post]', '[data-hook=image-viewer-pwtw9126]', '[data-hook=image-viewer-pwtw9126] img', '[data-hook=recent-post-list-item]', '[data-hook="recent-post__title"] a',
  '[data-hook=app-title]', '[data-hook=plan]>div', '[data-hook=plan-title]', '[data-hook=plan-price]', '[data-hook=plan-cta]', '[data-hook=ribbon]', '#comp-lii7mqeb h1',
  '#comp-lii7mqe42', '#comp-lii7mqe42 label', '#comp-lii7mqe42 textarea', '#comp-lii7mqfp4 button', '#gbm-tv', '#gbm-tv h1', '#gbm-tv .dek', '.gbm-news-close',
  '#gbm-mobile-shell', '#gbm-mobile-shell .gbm-ms-trigger'];
const PROPS = ['display', 'visibility', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'background-color', 'border-top', 'border-radius',
  'padding', 'margin', 'width', 'max-width', 'min-height', 'height', 'object-fit', 'box-shadow', 'position', 'top', 'right'];

const browser = await chromium.launch();
const results = []; const fails = []; const report = {};
const check = (name, ok, info = '') => { results.push({ name, ok, info }); if (!ok) fails.push(`${name} ${info}`); };

async function open(v, route, width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, isMobile: width <= 430, hasTouch: width <= 430 });
  await ctx.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.origin === 'https://www.gatorbaitmedia.com') return r.fulfill({ status: 200, contentType: 'text/html', body: page(v) });
    return r.fulfill({ status: 200, contentType: 'text/plain', body: '' }); // fonts, logo, store: nothing leaves the machine
  });
  const p = await ctx.newPage();
  await p.goto('https://www.gatorbaitmedia.com' + route, { waitUntil: 'load' });
  await p.waitForTimeout(1100); // header sync runs at 0/200/800 ms
  return { ctx, p };
}
// body height follows the (intentionally taller) footer, so body is compared without height.
const snapshot = (p) => p.evaluate(([sel, props]) => sel.map((s) => { const e = document.querySelector(s); if (!e) return [s, null]; const cs = getComputedStyle(e); return [s, props.filter((k) => !(s === 'body' && k === 'height')).map((k) => k + ':' + cs.getPropertyValue(k)).join('|')]; }), [SAME, PROPS]);

for (const route of ROUTES) for (const w of WIDTHS) {
  const tag = `${route}@${w}`;
  const a = await open('live', route, w); const before = await snapshot(a.p); await a.ctx.close();
  const { ctx, p } = await open('v2', route, w);
  const after = await snapshot(p);
  const diffs = before.filter(([s, v], i) => v !== after[i][1]).map(([s, v], i) => { const b = String(v).split('|'), a = String(after[before.findIndex((x) => x[0] === s)][1]).split('|'); return s + ' {' + b.filter((x, j) => x !== a[j]).map((x, j) => x + ' -> ' + a[b.indexOf(x)]).join('; ') + '}'; });
  check(`unchanged-look ${tag}`, diffs.length === 0, diffs.join(', '));

  const r = await p.evaluate(({ STORE }) => {
    const vis = (e) => { if (!e) return false; const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const box = (e) => e ? e.getBoundingClientRect().toJSON() : null;
    const out = { sw: document.documentElement.scrollWidth, iw: innerWidth };
    out.storeLinks = [...document.querySelectorAll('a[href*="itemorder.com"]')].filter((a) => !a.closest('main')).map((a) => ({ t: a.target, rel: a.rel, vis: vis(a), cls: a.className }));
    out.deskShop = box(document.querySelector('#gbm-site-header .sh-shop')); out.deskShopVis = vis(document.querySelector('#gbm-site-header .sh-shop'));
    out.phoneShop = box(document.querySelector('#gbm-mobile-shell .gbm-ms-shop')); out.phoneShopVis = vis(document.querySelector('#gbm-mobile-shell .gbm-ms-shop'));
    out.footShop = box(document.querySelector('#gbm-footer .gbf-btn'));
    out.footBg = getComputedStyle(document.getElementById('gbm-footer')).backgroundColor;
    out.nav = [...document.querySelectorAll('#gbm-site-header nav a')].filter(vis).map((a) => a.textContent.trim() + (a.getAttribute('aria-current') ? '*' : ''));
    out.acts = [...document.querySelectorAll('#gbm-site-header .sh-acts a')].map((a) => a.textContent.trim());
    // Barlow only: first declared family of every visible text element in the shell.
    const roots = ['#gbm-site-header', '#gbm-footer', '#gbm-mobile-shell', '#gbm-mobile-drawer-root'].map((s) => document.querySelector(s)).filter(Boolean);
    out.badFonts = [...new Set(roots.flatMap((r) => [r, ...r.querySelectorAll('*')]).filter((e) => vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      .map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()).filter((f) => !/^Barlow( Condensed)?$/.test(f)))];
    out.sendLabel = document.querySelector('#comp-lii7mqfp4 button')?.getAttribute('aria-label');
    out.closeBtn = !!document.querySelector('#nl-dialog .gbm-news-close');
    out.renamed = document.body.innerText.includes('Quick Reads') && !document.body.innerText.includes('Quick Chomps');
    out.mapLinks = [...document.querySelectorAll('#gbm-footer .gbf-map a')].map((a) => a.getAttribute('href'));
    return out;
  }, { STORE });
  check(`no-overflow ${tag}`, r.sw <= r.iw, `${r.sw}/${r.iw}`);
  check(`store-links-new-tab ${tag}`, r.storeLinks.length > 0 && r.storeLinks.every((l) => l.t === '_blank' && /noopener/.test(l.rel)), JSON.stringify(r.storeLinks));
  check(`barlow-only ${tag}`, r.badFonts.length === 0, r.badFonts.join(','));
  check(`footer-uniform ${tag}`, r.footBg === 'rgb(8, 19, 47)', r.footBg);
  check(`footer-shop ${tag}`, !!r.footShop && r.footShop.height >= 44 && r.footShop.right <= r.iw, JSON.stringify(r.footShop));
  check(`site-map ${tag}`, r.mapLinks.length >= 20 && !r.mapLinks.includes('/florida-football-stats'), String(r.mapLinks.length));
  check(`newsletter-close+rename ${tag}`, r.closeBtn && r.renamed);
  if (route === '/contact') check(`contact-label ${tag}`, r.sendLabel === 'Send message', String(r.sendLabel));
  if (w > 820 && route !== '/') {
    check(`desktop-shop ${tag}`, r.deskShopVis && r.deskShop.right <= r.iw && r.deskShop.height >= 40, JSON.stringify(r.deskShop));
    const want = ['Front Page', 'Latest', 'Magazine', 'TV & Podcasts', 'Scores & Schedule', 'Roster', 'Community', 'Shop Gear ↗'];
    const got = r.nav.map((n) => n.replace('*', ''));
    check(`desktop-menu ${tag}`, JSON.stringify(got) === JSON.stringify(want) && r.acts.join('|') === 'Search|Sign in|Join GatorBait →', got.join(' | '));
    const cur = r.nav.filter((n) => n.endsWith('*'));
    const wantCur = /^\/(post|gatorbait-media-blogs)/.test(route) ? ['Latest*'] : route === '/the-buddy-martin-show' ? ['TV & Podcasts*'] : [];
    check(`aria-current ${tag}`, JSON.stringify(cur) === JSON.stringify(wantCur), cur.join(','));
  }
  if (w <= 820) {
    check(`phone-shop ${tag}`, r.phoneShopVis && r.phoneShop.height >= 44 && r.phoneShop.right <= r.iw && r.phoneShop.left >= 0, JSON.stringify(r.phoneShop));
    await p.click('#gbm-mobile-menu-toggle'); await p.waitForTimeout(400);
    const d = await p.evaluate(() => {
      const vis = (e) => { const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && cs.display !== 'none'; };
      const links = [...document.querySelectorAll('#gbm-mobile-drawer-root .gbm-ms-nav a')].filter(vis);
      const shop = document.querySelector('#gbm-mobile-drawer-root .gbm-ms-shop');
      return { items: links.map((a) => a.textContent.replace(/\s+/g, ' ').trim()), shopH: shop && shop.getBoundingClientRect().height, shopT: shop && shop.target, sw: document.documentElement.scrollWidth };
    });
    const want = ['Front Page', 'Latest', 'Magazine', 'TV & Podcasts', 'Scores & Schedule', 'Roster', 'Community', 'Shop GatorBait Gear ↗', 'Join GatorBait', 'Sign In / Account', 'Contact'];
    check(`drawer-menu ${tag}`, JSON.stringify(d.items) === JSON.stringify(want), d.items.join(' | '));
    check(`drawer-shop ${tag}`, d.shopH >= 44 && d.shopT === '_blank', `${d.shopH} ${d.shopT}`);
    if (route === '/post/sample-story' || (route === '/' && w === 390)) await p.screenshot({ path: join(here, 'shots', `drawer${route === '/' ? '-home' : ''}-${w}.png`) });
    await p.click('#gbm-mobile-drawer-root .gbm-ms-close'); await p.waitForTimeout(300);
  }
  if (route === '/post/sample-story' || route === '/') {
    const n = route === '/' ? 'home' : 'post';
    await p.screenshot({ path: join(here, 'shots', `${n}-top-${w}.png`) });
    await p.locator('#gbm-footer').screenshot({ path: join(here, 'shots', `${n}-footer-${w}.png`) });
  }
  // Store guard: an old native /category/all-products link and a story-copy store link both open the store in a new tab.
  if (w === 1366 || w === 390) for (const sel of ['#SITE_HEADER a.native-shop', 'a.story-store']) {
    if (sel.startsWith('#SITE_HEADER')) await p.evaluate(() => { document.getElementById('SITE_HEADER').style.cssText = 'display:block!important'; });
    const pop = p.context().waitForEvent('page', { timeout: 3000 }).catch(() => null);
    await p.evaluate((s) => document.querySelector(s).click(), sel);
    const np = await pop; await p.waitForTimeout(200);
    check(`store-guard ${sel} ${tag}`, !!np && np.url().startsWith(STORE) && p.url().startsWith('https://www.gatorbaitmedia.com' + route.replace(/\/$/, '')), `${np && np.url()} stay=${p.url()}`);
    if (np) await np.close();
  }
  report[tag] = r;
  await ctx.close();
}
await browser.close();
writeFileSync(join(here, 'results.json'), JSON.stringify({ ran: new Date().toISOString(), passed: results.filter((r) => r.ok).length, failed: fails.length, results }, null, 1));
for (const r of results) if (!r.ok) console.log('FAIL', r.name, r.info);
console.log(`${results.length - fails.length}/${results.length} shell checks passed`);
process.exit(fails.length ? 1 : 0);
