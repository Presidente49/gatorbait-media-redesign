// Measures whether native Wix content paints before the GatorBait custom surface on each route.
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

// Google's web-vitals (attribution build) reports CLS/FCP/LCP and which element shifted. CI-only; never shipped to the site.
const WEB_VITALS = readFileSync('node_modules/web-vitals/dist/web-vitals.attribution.iife.js', 'utf8') + ';window.webVitals=webVitals;';
function vitals() {
  window.__wv = {};
  const put = m => { const a = m.attribution || {}; window.__wv[m.name] = { value: Math.round(m.value * 1000) / 1000, target: a.largestShiftTarget || a.element || a.target || null }; };
  const go = () => { const w = window.webVitals; if (!w) return; w.onCLS(put, { reportAllChanges: true }); w.onFCP(put); w.onLCP(put, { reportAllChanges: true }); };
  if (window.webVitals) go(); else addEventListener('DOMContentLoaded', go, { once: true });
}

const OUT = 'build/first-paint';
mkdirSync(OUT, { recursive: true });
const BASE = 'https://www.gatorbaitmedia.com';
const ROUTES = [
  { name: 'home', path: '/', root: '#gbm-live' },
  { name: 'magazine', path: '/magazine', root: '#gbm-magazine-page' },
  { name: 'tv', path: '/the-buddy-martin-show', root: '#gbm-media-hub' },
  { name: 'blogs', path: '/gatorbait-media-blogs', root: null },
  { name: 'article', path: '/post/the-soothsayer-is-feeling-some-very-good-vibes-about-the-florida-gators', root: null },
  { name: 'contact', path: '/contact', root: null }
];
const MARKERS = ['gbm-viewport-v1', 'gbm-gazette-bootstrap', 'gbm-mobile-shell-critical', 'gbm-magazine-wix-served', 'gbm-media-hub-v1', 'gbm-footer', 'gbm-prepaint'];
const PROFILES = [
  { name: 'phone390', context: { userAgent: devices['iPhone 13'].userAgent, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  { name: 'desktop', context: { viewport: { width: 1365, height: 900 } } }
];

async function rawHtml(path) {
  const res = await fetch(BASE + path, { headers: { 'user-agent': devices['iPhone 13'].userAgent } });
  const html = await res.text();
  const body = html.search(/<body[\s>]/i);
  const out = { status: res.status, bytes: html.length, bodyAt: body, markers: {} };
  // A literal id="…" is markup the browser parses; an escaped \"… means Wix serialized it for later client-side injection.
  for (const m of MARKERS) {
    const i = html.indexOf('id="' + m);
    const j = html.indexOf('\\"' + m);
    out.markers[m] = i >= 0 ? (body >= 0 && i < body ? 'head-markup' : 'body-markup') : j >= 0 ? 'deferred' : html.includes(m) ? 'text-only' : 'absent';
  }
  return out;
}

function sampler() {
  const t0 = performance.now();
  const frames = [];
  window.__fp = frames;
  const vis = el => { if (!el) return false; const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0; };
  const nativeText = () => { const p = document.querySelector('#SITE_PAGES'); if (!vis(p)) return 0; return (p.innerText || '').replace(/\s+/g, ' ').trim().length; };
  function tick() {
    if (!document.documentElement) return requestAnimationFrame(tick);
    const t = Math.round(performance.now() - t0);
    frames.push({
      t,
      nativeHeader: vis(document.querySelector('#SITE_HEADER')),
      nativePagesText: nativeText(),
      shell: vis(document.getElementById('gbm-mobile-shell')),
      live: vis(document.getElementById('gbm-live')),
      magazine: vis(document.getElementById('gbm-magazine-page')),
      hub: vis(document.getElementById('gbm-media-hub')),
      footer: vis(document.getElementById('gbm-footer')),
      nativeFooter: vis(document.querySelector('#SITE_FOOTER')),
      viewport: (document.querySelector('meta[name=viewport]') || {}).content || null,
      width: innerWidth
    });
    if (t < 9000) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function summarize(frames, root) {
  const key = root === '#gbm-live' ? 'live' : root === '#gbm-magazine-page' ? 'magazine' : root === '#gbm-media-hub' ? 'hub' : null;
  const first = f => { const x = frames.find(f); return x ? x.t : null; };
  const s = { frames: frames.length };
  s.firstNativeHeader = first(f => f.nativeHeader);
  s.firstShell = first(f => f.shell);
  s.firstNativeFooter = first(f => f.nativeFooter);
  s.firstFooter = first(f => f.footer);
  s.firstViewportChange = (() => { const v0 = frames[0] && frames[0].viewport; const x = frames.find(f => f.viewport !== v0); return x ? { t: x.t, from: v0, to: x.viewport } : null; })();
  s.widths = [...new Set(frames.map(f => f.width))];
  if (key) {
    s.firstRoot = first(f => f[key]);
    s.nativeTextBeforeRootMs = (() => { const hits = frames.filter(f => f.nativePagesText > 40 && (s.firstRoot === null || f.t < s.firstRoot)); return hits.length ? { from: hits[0].t, to: hits[hits.length - 1].t, maxChars: Math.max(...hits.map(h => h.nativePagesText)) } : null; })();
    s.nativeTextAfterRoot = frames.some(f => f[key] && f.nativePagesText > 40);
  }
  s.nativeHeaderVisibleThenHidden = (() => { const on = frames.findIndex(f => f.nativeHeader); if (on < 0) return false; return frames.slice(on).some(f => !f.nativeHeader); })();
  return s;
}

const report = { at: new Date().toISOString(), raw: {}, runs: [] };
for (const r of ROUTES) { try { report.raw[r.name] = await rawHtml(r.path); } catch (e) { report.raw[r.name] = { error: String(e) }; } }

const browser = await chromium.launch();
for (const profile of PROFILES) {
  for (const r of ROUTES) {
    const ctx = await browser.newContext(profile.context);
    await ctx.addInitScript(sampler);
    await ctx.addInitScript(WEB_VITALS);
    await ctx.addInitScript(vitals);
    const page = await ctx.newPage();
    const external = [];
    page.on('request', q => { if (/cdn\.jsdelivr\.net/.test(q.url())) external.push(q.url().slice(0, 140)); });
    try {
      await page.goto(BASE + r.path + '?fp=' + Date.now(), { waitUntil: 'commit', timeout: 45000 });
      await page.waitForTimeout(9500);
      const frames = await page.evaluate(() => window.__fp || []);
      const vitalsOut = await page.evaluate(() => window.__wv || null);
      report.runs.push({ route: r.name, profile: profile.name, jsdelivrRequests: external.length, jsdelivr: external, vitals: vitalsOut, ...summarize(frames, r.root) });
      await page.screenshot({ path: `${OUT}/${r.name}-${profile.name}.jpg`, type: 'jpeg', quality: 60 });
    } catch (e) {
      report.runs.push({ route: r.name, profile: profile.name, error: String(e).slice(0, 200) });
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
