// Real-browser screenshots of the production site for review from sessions that cannot reach it.
// Usage: node automation/vision/live-shots.mjs [path] [selector] [widths]
//   path      page path on www.gatorbaitmedia.com, query allowed (default "/")
//   selector  element to scroll into view and capture on its own (default "#gbm-road"; "" for none)
//   widths    comma list (default "390,1365"); widths under 800 use an iPhone profile
//   PERF=1    also measure load performance under Lighthouse-like throttling (phone: 1.6 Mbps, 150 ms RTT,
//             4x CPU slowdown; desktop: 10 Mbps, 40 ms, no CPU slowdown): TTFB, FCP, LCP, CLS, long tasks,
//             when our front page root and story button appeared, and every request grouped by host.
// Output: build/live-shots/<name>.jpg plus metrics.json (bounding boxes, computed fonts, scroll state, perf).
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const path = process.argv[2] || '/';
const selector = process.argv[3] === undefined ? '#gbm-road' : process.argv[3];
const widths = (process.argv[4] || '390,1365').split(',').map(Number).filter(Boolean);
const PERF = process.env.PERF === '1';
const OUT = 'build/live-shots';
mkdirSync(OUT, { recursive: true });
// deploy/covers/*.html renders a story cover from the checkout instead of the live site (the query carries the copy).
const url = /^deploy\/covers\//.test(path) ? 'file://' + process.cwd() + '/' + path : 'https://www.gatorbaitmedia.com' + path;
const IOS_UA = devices['iPhone 13'].userAgent;
// A real Chrome UA on desktop: with the default HeadlessChrome UA, Wix answered with an older cached
// snapshot for a while after an embed update (Sept. 30), which real browsers did not get.
const DESKTOP_UA = devices['Desktop Chrome'].userAgent;
const profile = (w) => w < 800
  ? { userAgent: IOS_UA, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: DESKTOP_UA, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };

// Read-only CDN availability/integrity gate; fail before starting Chromium.
const SOURCE_PIN = '312018fa66e644a3f32fe473b6a855d1b114c356';
const EXPECTED_ASSETS = [
  {
    "path": "sports-live/broadcast-home.js",
    "sha256": "de9430dd9d539f01c7feb3d2a332de5e7bd3a46974d559767f55b735f63bbef8"
  },
  {
    "path": "sports-live/magazine-pregame.js",
    "sha256": "8168521f4a02e6f6fde0ec2013cf9173f1849a0d44c85a097f4dbcfb71482818"
  },
  {
    "path": "deploy/broadcast-network-20261017/site-shell.css",
    "sha256": "b09dfeb710afe1a91b22af2039ec218dde7837a449c90e7ef5fce2abb6b6dbbe"
  },
  {
    "path": "deploy/broadcast-network-20261017/news-chronology.js",
    "sha256": "7ddde8064232daf8c4a69ef182f2f0dc3170740b1984842e762e85326a166da5"
  }
];
const preflight = { pin: SOURCE_PIN, at: new Date().toISOString(), ok: false, files: [] };
for (const asset of EXPECTED_ASSETS) {
  const receipt = { path: asset.path, status: null, bytes: 0, expectedSha256: asset.sha256, sha256: null, ok: false };
  try {
    const response = await fetch(`https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@${SOURCE_PIN}/${asset.path}`, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
    receipt.status = response.status;
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    receipt.bytes = bytes.length;
    receipt.sha256 = createHash('sha256').update(bytes).digest('hex');
    receipt.ok = receipt.sha256 === asset.sha256;
    if (!receipt.ok) receipt.error = 'SHA256 mismatch';
  } catch (error) { receipt.error = String(error.message || error).slice(0, 180); }
  preflight.files.push(receipt);
}
preflight.ok = preflight.files.length === EXPECTED_ASSETS.length && preflight.files.every((file) => file.ok);
writeFileSync(`${OUT}/preflight.json`, JSON.stringify(preflight, null, 1));
console.log(JSON.stringify({ event: preflight.ok ? 'BROADCAST_CDN_PREFLIGHT_OK' : 'BROADCAST_CDN_PREFLIGHT_ALERT', ...preflight }));
if (!preflight.ok) process.exit(1);

const TARGETS = [
  { name: 'home', path: '/', selector: '#gbm-live' },
  { name: 'magazine', path: '/magazine', selector: '#gbm-magazine-page' },
  
  { name: 'story', path: '/post/the-soothsayer-texas-big-unless-the-uf-defense-finds-an-exorcist', selector: '[data-hook=post-page]' },
];
const browser = await chromium.launch();
const metrics = { at: new Date().toISOString(), preflight, targets: TARGETS, shots: [] };
for (const target of TARGETS) {
  const url = 'https://www.gatorbaitmedia.com' + target.path + '?broadcastproof=20261017';
  const selector = target.selector;
for (const w of widths) {
  if(target.name==='story' && w!==390)continue;
  const ctx = await browser.newContext(profile(w));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  const m = { target: target.name, url, selector, width: w, errors };
  try {
    if (PERF) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      const phone = w < 800;
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: phone ? 150 : 40, downloadThroughput: (phone ? 1.6 : 10) * 1024 * 1024 / 8, uploadThroughput: (phone ? 0.75 : 10) * 1024 * 1024 / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: phone ? 4 : 1 });
      await page.addInitScript(() => {
        const P = (window.__gbmPerf = { lcp: null, cls: 0, longTasks: [], fpRootAt: null, shareAt: null, fcp: null });
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) P.lcp = { t: Math.round(e.startTime), size: e.size, url: (e.url || '').slice(0, 120), tag: e.element ? e.element.tagName + (e.element.className ? '.' + String(e.element.className).slice(0, 40) : '') : null }; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (_) {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) P.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (_) {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) P.longTasks.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch (_) {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') P.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); } catch (_) {}
        const mo = new MutationObserver(() => {
          if (P.fpRootAt === null && document.querySelector('#gbm-live.fp26')) P.fpRootAt = Math.round(performance.now());
          if (P.shareAt === null && document.querySelector('[data-share]')) P.shareAt = Math.round(performance.now());
          if (P.fpRootAt !== null && P.shareAt !== null) mo.disconnect();
        });
        document.addEventListener('DOMContentLoaded', () => mo.observe(document.documentElement, { childList: true, subtree: true }));
      });
    }
    const res = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    m.http = res && res.status();
    await page.waitForSelector(selector || '#gbm-live', { timeout: 15000 }).catch(() => { m.note = 'requested page root not seen in 15s'; });
    await page.waitForTimeout(3500);
    const decline = page.getByRole('button', {name: /^Decline All$/i}).first();
    if (await decline.isVisible().catch(() => false)) {
      await decline.click();
      m.optionalCookiesDeclinedForCapture = true;
      await page.waitForTimeout(400);
    }
    if (target.name === 'magazine') {
      await page.evaluate(() => { const img = document.querySelector('#gbm-magazine-page .pg-cover img'); if (img) img.loading = 'eager'; });
      await page.waitForFunction(() => { const img = document.querySelector('#gbm-magazine-page .pg-cover img'); return img && img.complete && img.naturalWidth > 0; }, null, { timeout: 10000 }).catch(() => { m.coverWait = 'cover not decoded within 10s'; });
    }
    if (PERF) {
      await page.waitForTimeout(6500);
      m.perf = await page.evaluate(() => {
        const P = window.__gbmPerf || {}, nav = performance.getEntriesByType('navigation')[0] || {};
        const res = performance.getEntriesByType('resource');
        const byHost = {};
        for (const r of res) {
          let h = 'other'; try { h = new URL(r.name).host; } catch (_) {}
          const b = byHost[h] || (byHost[h] = { n: 0, bytes: 0, ms: 0 });
          b.n++; b.bytes += r.transferSize || 0; b.ms += Math.round(r.duration);
        }
        const kind = (r) => r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name) ? 'script' : r.initiatorType === 'css' || r.initiatorType === 'link' && /\.css|fonts\.googleapis/.test(r.name) ? 'css' : /fonts\.gstatic|\.woff2?(\?|$)/.test(r.name) ? 'font' : r.initiatorType === 'img' || /\.(avif|webp|jpe?g|png|gif|svg)(\?|$)|wixstatic\.com\/media/.test(r.name) ? 'image' : r.initiatorType === 'fetch' || r.initiatorType === 'xmlhttprequest' ? 'fetch' : 'other';
        const byKind = {};
        for (const r of res) { const k = kind(r), b = byKind[k] || (byKind[k] = { n: 0, bytes: 0 }); b.n++; b.bytes += r.transferSize || 0; }
        const top = [...res].sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0)).slice(0, 15).map((r) => ({ url: r.name.replace(/^https?:\/\//, '').slice(0, 110), kind: kind(r), bytes: r.transferSize || 0, start: Math.round(r.startTime), ms: Math.round(r.duration) }));
        const ours = res.filter((r) => /githubusercontent|jsdelivr|presidente49\.github\.io|fonts\.g/.test(r.name)).map((r) => ({ url: r.name.replace(/^https?:\/\//, '').slice(0, 110), bytes: r.transferSize || 0, start: Math.round(r.startTime), ms: Math.round(r.duration) }));
        const tbt = (P.longTasks || []).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
        return { ttfb: Math.round(nav.responseStart || 0), domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0), fcp: P.fcp, lcp: P.lcp, cls: Math.round((P.cls || 0) * 1000) / 1000,
          longTasks: (P.longTasks || []).length, longTaskMs: (P.longTasks || []).reduce((a, [, d]) => a + d, 0), tbt: Math.round(tbt), fpRootAt: P.fpRootAt, shareAt: P.shareAt,
          requests: res.length, bytes: res.reduce((a, r) => a + (r.transferSize || 0), 0), byKind, byHost: Object.fromEntries(Object.entries(byHost).sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 20)), top, ours,
          scripts: document.scripts.length, inlineScriptChars: [...document.scripts].filter((x) => !x.src).reduce((a, x) => a + x.textContent.length, 0), styles: document.querySelectorAll('style').length, inlineStyleChars: [...document.querySelectorAll('style')].reduce((a, x) => a + x.textContent.length, 0), images: document.images.length, lazyImages: [...document.images].filter((i) => i.loading === 'lazy').length, domNodes: document.getElementsByTagName('*').length };
      });
    }
    // Cover renders: wait for web fonts and the photo before shooting.
    if (url.startsWith('file://')) { await page.evaluate(() => document.fonts.ready).catch(() => {}); await page.waitForTimeout(2500); }
    // Which build ran: the loader's pinned commit as served in the HTML, and the renderer's own build stamp.
    Object.assign(m, await page.evaluate(() => ({
      loaderSrc: (document.documentElement.outerHTML.match(/front-page-2026 src=([0-9a-f]+)/) || [])[1] || null,
      fpBuild: document.querySelector('#gbm-live')?.getAttribute('data-fp-build') || null,
      fpVersion: document.querySelector('#gbm-live')?.getAttribute('data-fp') || null,
    })));
    // Stable style/palette receipt, using rendered values and actual requested assets.
    m.broadcastProof = await page.evaluate(() => {
      const root = document.getElementById('gbm-live');
      const magazine = document.getElementById('gbm-magazine-page');
      const inspect = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const cs = getComputedStyle(el), b = el.getBoundingClientRect();
        return { bg: cs.backgroundColor, gradient: cs.backgroundImage, color: cs.color, border: cs.borderColor, radius: cs.borderRadius, clipPath: cs.clipPath, font: cs.fontFamily, width: Math.round(b.width) };
      };
      const rootStyle = root && getComputedStyle(root);
      const tokens = rootStyle ? Object.fromEntries(['--nt', '--tx', '--mu', '--pk', '--o'].map((name) => [name, rootStyle.getPropertyValue(name).trim()])) : null;
      const cover = document.querySelector('#gbm-magazine-page .pg-cover img, .sh-magazine img, img.sh-mcover, .sh-mcover img');
      const coverImage = cover ? { src: cover.getAttribute('src'), currentSrc: cover.currentSrc, alt: cover.alt, loaded: cover.complete && cover.naturalWidth > 0, naturalWidth: cover.naturalWidth, naturalHeight: cover.naturalHeight, box: { width: Math.round(cover.getBoundingClientRect().width), height: Math.round(cover.getBoundingClientRect().height) } } : null;
      const panels = Object.fromEntries(['#gbm-live', '.bc-nx', '.bc-side', '.sh-magazine', '.sh-coverage article', '#gbm-magazine-page', '.pg-game', '.pg-lead', '#gbm-lp', '.lp-lead', '.lp-row', '#SITE_PAGES', '[data-hook=post-page] article[data-hook=post]>div>header', '[data-hook=post-page] article[data-hook=post]>div', '#gbm-mobile-shell', '#gbm-site-header'].map((selector) => [selector, inspect(selector)]));
      const mainPaths = root ? [...root.querySelectorAll('.sh-lead h1 a,.bc-rows a,.sh-coverage article>a')].map(a => a.getAttribute('href')) : []; const pregamePaths = root ? [...root.querySelectorAll('.bn-pregame ol a')].map(a => a.getAttribute('href')) : []; const storyHead = root?.querySelector('h1') || magazine?.querySelector('h1'); const headline = storyHead ? {text:storyHead.textContent,font:getComputedStyle(storyHead).fontFamily,size:getComputedStyle(storyHead).fontSize,whiteSpace:getComputedStyle(storyHead).whiteSpace}:null; const styleTagIds = [...document.querySelectorAll('style[id]')].map((el) => el.id).filter((id) => /^gbm-|^gbc-/.test(id)).sort();
      const assetUrls = [...document.querySelectorAll('script[src],link[href]')].map((el) => el.src || el.href).filter((url) => /broadcast-home\.js|magazine-pregame\.js|broadcast-network/.test(url));
      const resourceUrls = performance.getEntriesByType('resource').map((entry) => entry.name).filter((url) => /broadcast-home\.js|magazine-pregame\.js|broadcast-network.*site-shell\.css/.test(url));
      const magStyle = magazine && getComputedStyle(magazine);
      const magazineTokens = magStyle ? Object.fromEntries(['--pg-night', '--pg-navy', '--pg-orange', '--pg-text', '--pg-mute', '--pg-card'].map((name) => [name, magStyle.getPropertyValue(name).trim()])) : null;
      const bodyParagraph = [...document.querySelectorAll('[data-hook=post-description] p')].find((el) => el.textContent.trim().length > 90 && el.getBoundingClientRect().width > 0);
      const storyBody = bodyParagraph ? (() => { const cs = getComputedStyle(bodyParagraph); let readingBackground = null; for (let el = bodyParagraph; el; el = el.parentElement) { const c = getComputedStyle(el); if (c.backgroundColor !== 'rgba(0, 0, 0, 0)') { readingBackground = c.backgroundColor; break; } } return { color: cs.color, background: readingBackground, font: cs.fontFamily, size: cs.fontSize, lineHeight: cs.lineHeight, width: Math.round(bodyParagraph.getBoundingClientRect().width), text: bodyParagraph.textContent.trim().slice(0, 80) }; })() : null;
      const rootWidths = Object.fromEntries(['#gbm-live', '#gbm-magazine-page', '#gbm-lp', '[data-hook=post-page]'].map((selector) => { const el = document.querySelector(selector); return [selector, el ? { client: el.clientWidth, scroll: el.scrollWidth, box: Math.round(el.getBoundingClientRect().width) } : null]; }));
      const share = document.getElementById('gbm-share-btn');
      const shareProof = share ? {color:getComputedStyle(share).color,bg:getComputedStyle(share).backgroundColor,children:[...share.querySelectorAll('*')].map(e=>({tag:e.tagName,text:e.textContent.trim(),color:getComputedStyle(e).color,fill:getComputedStyle(e).webkitTextFillColor})),overrideLoaded:Boolean(document.getElementById('gbm-share-contrast-20261017'))}:null;
      return { shareProof, headline, mainPaths, pregamePaths, tokens, magazineTokens, storyBody, rootWidths, panels, styleTagIds, coverImage, coverExpected: coverImage ? coverImage.src.includes('d3cfa5_6d3a6ab429634722ada0394526bc480d') : null, assetUrls, resourceUrls, viewport: { innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, scrollX, meta: document.querySelector('meta[name=viewport]')?.content || null }, hasHomeStyle: Boolean(document.getElementById('gbm-broadcast-home-css')), hasShellStyle: Boolean(document.getElementById('gbm-broadcast-network-shell-v1')), paletteLooksWhite: panels['#gbm-live']?.bg === 'rgb(255, 255, 255)' || panels['#gbm-magazine-page']?.bg === 'rgb(255, 255, 255)' };
    });
    await page.screenshot({ path: `${OUT}/${target.name}-top-${w}.jpg`, type: 'jpeg', quality: 70 });
    if (selector) {
      const found = await page.$(selector);
      m.selectorFound = Boolean(found);
      if (found) {
        await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), selector);
        await page.evaluate(() => scrollBy(0, -70));
        await page.waitForTimeout(800);
        m.box = await page.evaluate((s) => {
          const el = document.querySelector(s), r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          const kids = [...el.querySelectorAll('h1,h2,h3,.g,.line,.track')].slice(0, 6).map((k) => {
            const b = k.getBoundingClientRect(), c = getComputedStyle(k);
            return { cls: (k.className || k.tagName).toString().slice(0, 40), x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), font: c.fontFamily.slice(0, 60), size: c.fontSize };
          });
          const track = el.querySelector('.track');
          // Story pages: the Wix header, the Share button and the Story Kit strip, so a phone layout fault can be read without guessing.
          let story = null;
          if (document.querySelector('[data-story-kit]') || document.querySelector('[data-share]')) {
            const rect = (n) => { if (!n) return null; const b = n.getBoundingClientRect(), c = getComputedStyle(n); return { x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height), opacity: c.opacity, vis: c.visibility, size: c.fontSize, text: (n.textContent || '').trim().slice(0, 60) }; };
            const row = document.querySelector('.gbm-kit-row'), chips = row ? [...row.children] : [];
            story = { h1: rect(document.querySelector('[data-hook="post-title"]') || document.querySelector('article h1') || document.querySelector('h1')), share: rect(document.querySelector('[data-share]')), strip: rect(document.querySelector('[data-story-kit="strip"]')),
              row: row ? { scrollLeft: row.scrollLeft, scrollWidth: row.scrollWidth, clientWidth: row.clientWidth, dir: getComputedStyle(row).direction, justify: getComputedStyle(row).justifyContent } : null,
              firstChip: rect(chips[0]), lastChip: rect(chips[chips.length - 1]), more: rect(document.querySelector('[data-story-kit="more"]')), links: [...document.querySelectorAll('a.gbm-kit-link')].map((a) => a.getAttribute('data-term')), scrollX,
              capture: { probe: document.documentElement.getAttribute('data-gbm-capture-probe'), cards: document.querySelectorAll('[data-gbm-capture]').length, slideup: rect(document.querySelector('[data-gbm-capture="story-slideup"]')) } };
          }
          return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, font: cs.fontFamily.slice(0, 60), kids,
            track: track ? { scrollWidth: track.scrollWidth, clientWidth: track.clientWidth, scrollLeft: track.scrollLeft } : null, story, docScrollWidth: document.documentElement.scrollWidth, innerWidth };
        }, selector);
        await page.screenshot({ path: `${OUT}/${target.name}-view-${w}.jpg`, type: 'jpeg', quality: 70 });
        await found.screenshot({ path: `${OUT}/${target.name}-element-${w}.jpg`, type: 'jpeg', quality: 75 }).catch((e) => { m.elementShot = String(e).slice(0, 120); });
      }
    }
  } catch (e) {
    m.error = String(e).slice(0, 300);
  }
  metrics.shots.push(m);
  await ctx.close();
}
}
await browser.close();
writeFileSync(`${OUT}/metrics.json`, JSON.stringify(metrics, null, 1));
console.log(JSON.stringify({ event: 'BROADCAST_POSTDEPLOY_RECEIPT', targets: TARGETS.map((target) => target.name), preflightOk: preflight.ok, shots: metrics.shots.map((shot) => ({ target: shot.target, width: shot.width, http: shot.http, selectorFound: shot.selectorFound, box: shot.box ? { docScrollWidth: shot.box.docScrollWidth, innerWidth: shot.box.innerWidth } : null, broadcastProof: shot.broadcastProof, errors: shot.errors, error: shot.error || null })) }));
