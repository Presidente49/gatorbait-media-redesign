#!/usr/bin/env node
// speed-2026 embed QA. Each embed is loaded ALONE (live body, then v2 body) in a mock Wix story page served as
// https://www.gatorbaitmedia.com/<route> (real origin, so the route guards see the production pathname; Lesson 34), at 390 px
// with a phone UA. After `load` the page mutates the DOM 500 times the way Wix blog hydration does (appends/removes nodes in
// #SITE_PAGES, 250 head-only <style> insertions in their own tasks, React-style re-render of the post header, new paragraphs
// in the post body, a replaced viewport meta, a Wix "Join us in our app" banner and a newsletter dialog). It then records, per
// run, the number of MutationObserver callback invocations (and which nodes were observed), the DOM queries
// (querySelector/querySelectorAll), layout reads (innerText, getBoundingClientRect) and timer callbacks those callbacks caused,
// and a snapshot of the resulting DOM with <script> elements and comments removed. A v2 passes when its snapshot equals the
// live snapshot (the 500 px logo URL is normalised to the live URL first), it raised no page error, and its callback count is
// not higher. Fewer queries/layout reads with the same DOM is the point: the work per callback is what costs main-thread time.
// Usage: NODE_PATH=<dir with playwright> PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node deploy/speed-2026/embeds/qa/embed-qa.mjs [id8 ...]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url)), dir = join(here, '..');
const LOGO_LIVE = 'https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp';
const LOGO_CUT = LOGO_LIVE + '/v1/fill/w_500,h_134,al_c,q_85,enc_auto/gatorbait.webp';
const POST = '/post/sample-story';
const EMBEDS = [
  { id: '5a43ae83', pos: 'HEAD', routes: [POST] },
  { id: '7fee4de6', pos: 'HEAD', routes: [POST] },
  { id: 'fdc2127a', pos: 'HEAD', routes: [POST] },
  { id: 'a13b04e3', pos: 'HEAD', routes: [POST], ui: true },
  { id: 'c91ad133', pos: 'HEAD', routes: [POST] },
  { id: 'a5452619', pos: 'HEAD', routes: [POST] },
  { id: '360c9265', pos: 'HEAD', routes: [POST] },
  { id: '53e15504', pos: 'HEAD', routes: [POST] },
  { id: 'f285a38c', pos: 'HEAD', routes: [POST] },
  { id: '4d3ab24a', pos: 'BODY_END', routes: [POST] },
  { id: '5ab10e7b', pos: 'BODY_END', routes: [POST] },
  { id: '59e31550', pos: 'BODY_END', routes: [POST] },
  { id: 'fb8963cc', pos: 'BODY_END', routes: [POST, '/policies'] },
];
const only = process.argv.slice(2);
const read = (f) => readFileSync(join(dir, f), 'utf8');

// Mock Wix story page. Ids/data-hooks are the ones the embeds select on; the post column is a fixed 320 px Wix canvas.
const page = (embed, pos, ui) => `<!doctype html><html lang="en" class="gbm-native-wide"><head><meta charset="utf-8">
<meta name="viewport" content="width=320, user-scalable=no"><title>Florida Beats Ole Miss 52-28 | GatorBait Media</title>
<meta property="og:title" content="Florida Beats Ole Miss 52-28"><meta property="og:description" content="Recap of the win."><meta property="og:image" content="https://static.wixstatic.com/media/x~mv2.jpg">
<meta property="article:published_time" content="2026-09-27T20:00:00.000Z"><link rel="canonical" href="https://www.gatorbaitmedia.com${POST}">
<style>body{margin:0;font-family:Arial,sans-serif}#comp-post{width:320px;margin:0 auto}[data-hook=post-page-root]{width:300px}</style>
${pos === 'HEAD' ? embed : ''}${ui ? '<script>if(window.__GBM_UI_JS__){window.__GBM_STANDALONE_NEWSROOM__=0;window.__GBM_UI_LAYER__=0;var s=document.createElement("style");s.id="gbm-ui-layer-css";s.textContent=window.__GBM_UI_CSS__||"";document.head.appendChild(s);window.__GBM_UI_JS__();}</script>' : ''}
</head><body>
<div id="SITE_CONTAINER"><div id="masterPage"><header id="SITE_HEADER"><nav><ul><li><a href="/">Home</a></li><li><a href="/gatorbait-media-blogs">Latest</a></li></ul></nav></header>
<main id="SITE_PAGES"><div id="SITE_PAGES_TRANSITION_GROUP"><div id="comp-post">
<div data-hook="post-page"><div data-hook="post-page-root"><article data-hook="post"><header><h1 data-hook="post-title">Florida Beats Ole Miss 52-28</h1>
<div><div data-hook="avatar-image"></div><a data-hook="profile-link" href="/profile/franz/profile"><span data-hook="user-name">Franz Beard</span></a></div><a href="/gatorbait-media-blogs/categories/football">Football</a></header>
<div data-hook="post-description"><p id="viewer-1"><span style="font-weight:700">By Franz Beard</span></p><p id="viewer-2"><span style="font-weight:700">gatorbaitmedia.com</span></p>
<p id="viewer-3"><span style="font-size:32px;font-weight:700">A big dek line</span></p><p id="viewer-4"></p>
<p id="viewer-5"><span style="font-weight:700">First bold graf of the story text.</span></p><p id="viewer-6"><span style="font-weight:700">Second bold graf of the story text here.</span></p>
<p id="viewer-7"><span style="font-weight:700">The Big Play</span></p><p id="viewer-8"><span style="font-weight:700">Third graf of the story text with more words in it.</span></p><p id="viewer-9">Plain graf.</p></div>
</article></div></div>
<section><div id="comp-k16hhn48"><p>native policies text</p></div></section>
</div></div></main></div></div><footer id="SITE_FOOTER">Native footer</footer>
${pos === 'BODY_END' ? embed : ''}</body></html>`;

// Counters are installed before any page script runs.
const INIT = `(() => {
  const C = window.__cnt = { mo: 0, observed: {}, timers: 0, innerText: 0, queries: 0, rects: 0 };
  for (const P of [Document.prototype, Element.prototype]) for (const k of ['querySelector', 'querySelectorAll']) { const o = P[k]; P[k] = function () { C.queries++; return o.apply(this, arguments); }; }
  { const o = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = function () { C.rects++; return o.apply(this, arguments); }; }
  window.__st = window.setTimeout.bind(window);
  const MO = window.MutationObserver;
  window.MutationObserver = function (cb) {
    const o = new MO(function (m, obs) { C.mo++; return cb.call(this, m, obs); });
    const observe = o.observe.bind(o);
    o.observe = (t, opt) => { const k = (t === document ? 'document' : t.id ? '#' + t.id : t.nodeName) + (opt && opt.subtree ? '+subtree' : '') + (opt && opt.attributes ? '+attr' : ''); C.observed[k] = (C.observed[k] || 0) + 1; return observe(t, opt); };
    return o;
  };
  window.MutationObserver.prototype = MO.prototype;
  const st = window.setTimeout, si = window.setInterval;
  window.setTimeout = function (fn, ...a) { return st.call(window, typeof fn === 'function' ? function () { C.timers++; return fn.apply(this, arguments); } : fn, ...a); };
  window.setInterval = function (fn, ...a) { return si.call(window, typeof fn === 'function' ? function () { C.timers++; return fn.apply(this, arguments); } : fn, ...a); };
  const d = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
  Object.defineProperty(HTMLElement.prototype, 'innerText', { get() { C.innerText++; return d.get.call(this); }, set(v) { return d.set.call(this, v); }, configurable: true });
})();`;

const MUTATE = () => new Promise((res) => {
  const st = window.__st, pages = document.getElementById('SITE_PAGES');
  const box = document.createElement('div'); box.id = 'wix-hydration'; pages.appendChild(box);
  let i = 0;
  function step() {
    if (i >= 500) return res();
    const el = document.createElement(i % 3 ? 'div' : 'p'); el.textContent = 'hydration ' + i; el.className = 'h' + (i % 7); box.appendChild(el);
    if (i % 25 === 0) { const s = document.createElement('style'); s.textContent = '.h' + i + '{color:#000}'; document.head.appendChild(s); }
    if (i % 2) st(() => { const s = document.createElement('style'); s.textContent = '.k' + i + '{color:#111}'; document.head.appendChild(s); }, 2); // head-only task, like a Wix chunk landing
    if (i % 50 === 10) { const h = document.querySelector('[data-hook=post-page] header'); h.replaceWith(h.cloneNode(true)); }
    if (i % 40 === 20) { const p = document.querySelector('[data-hook=post-description]'); const np = document.createElement('p'); np.id = 'viewer-x' + i; np.innerHTML = '<span style="font-weight:700">Extra bold para ' + i + '</span>'; p.appendChild(np); }
    if (i === 100) { const m = document.querySelector('meta[name=viewport]'); const nm = document.createElement('meta'); nm.name = 'viewport'; nm.content = 'width=320, user-scalable=no'; m.replaceWith(nm); }
    if (i === 250) { const b = document.createElement('div'); b.id = 'app-banner'; b.innerHTML = '<div><span>Join us in our app</span> <button>Open</button></div>'; document.body.appendChild(b); }
    if (i === 300) { const d = document.createElement('div'); d.id = 'nl-dialog'; d.setAttribute('role', 'dialog'); d.innerHTML = '<h2>Join GatorBait Weekly</h2><p>Enter your email address to subscribe.</p><span>Quick Chomps</span><button aria-label="Close">x</button>'; document.body.appendChild(d); }
    if (i % 60 === 30) document.documentElement.classList.toggle('wix-tick');
    if (i % 5 === 0 && box.children.length > 30) box.removeChild(box.firstChild);
    i++; st(step, 4);
  }
  step();
});

const SNAP = () => {
  const root = document.documentElement.cloneNode(true);
  root.querySelectorAll('script').forEach((s) => { if (s.type !== 'application/ld+json') s.remove(); });
  root.querySelectorAll('style:not([id])').forEach((s) => s.remove());
  const w = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT), cs = []; while (w.nextNode()) cs.push(w.currentNode); cs.forEach((c) => c.remove());
  return { title: document.title, html: root.outerHTML, cnt: window.__cnt };
};

const browser = await chromium.launch();
async function run(embedHtml, e, route) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  await ctx.addInitScript(INIT);
  const html = page(embedHtml, e.pos, e.ui);
  await ctx.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.origin === 'https://www.gatorbaitmedia.com' && u.pathname === route) return r.fulfill({ status: 200, contentType: 'text/html', body: html });
    return r.fulfill({ status: 200, contentType: 'text/plain', body: '' }); // feed, fonts, logo, share.js: nothing leaves the machine
  });
  const p = await ctx.newPage(); const errors = [];
  p.on('pageerror', (err) => errors.push(String(err)));
  await p.goto('https://www.gatorbaitmedia.com' + route, { waitUntil: 'load' });
  await p.waitForTimeout(300);
  await p.evaluate(MUTATE);
  await p.waitForTimeout(5000); // the embeds' own fallback timers (up to 4 s) settle
  const snap = await p.evaluate(SNAP);
  await ctx.close();
  return { ...snap, errors };
}
const diffAt = (a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i++; return { at: i, live: a.slice(Math.max(0, i - 100), i + 160), v2: b.slice(Math.max(0, i - 100), i + 160) }; };

const results = []; let fails = 0;
for (const e of EMBEDS) {
  if (only.length && !only.includes(e.id)) continue;
  const live = read(e.id + '-live.html'), hasV2 = existsSync(join(dir, e.id + '-v2.html')), v2 = hasV2 ? read(e.id + '-v2.html') : null;
  for (const route of e.routes) {
    const a = await run(live, e, route);
    const pick = (r) => ({ mo: r.cnt.mo, queries: r.cnt.queries, innerText: r.cnt.innerText, rects: r.cnt.rects, timers: r.cnt.timers, observed: r.cnt.observed, errors: r.errors });
    const row = { id: e.id, route, live: pick(a) };
    if (hasV2) {
      const b = await run(v2, e, route);
      row.v2 = pick(b);
      const bh = b.html.split(LOGO_CUT).join(LOGO_LIVE);
      row.logoSwapped = bh !== b.html;
      row.sameDom = a.html === bh && a.title === b.title;
      if (!row.sameDom) row.diff = diffAt(a.html, bh);
      row.pass = row.sameDom && b.cnt.mo <= a.cnt.mo && !b.errors.length;
      if (!row.pass) fails++;
    }
    results.push(row);
    const fmt = (c) => `MO ${c.mo}, queries ${c.queries}, innerText ${c.innerText}, rects ${c.rects}, timers ${c.timers}`;
    const v = row.v2 ? `v2: ${fmt(row.v2)} | sameDom ${row.sameDom}${row.logoSwapped ? ' (logo URL normalised)' : ''} | ${row.pass ? 'PASS' : 'FAIL'}` : 'no v2 (live only)';
    console.log(`${e.id} ${route} | live: ${fmt(row.live)} | ${v}`);
    console.log('  observed live:', JSON.stringify(row.live.observed), row.v2 ? ' v2: ' + JSON.stringify(row.v2.observed) : '');
    if (row.diff) console.log('  first diff at', row.diff.at, '\n  live:', JSON.stringify(row.diff.live), '\n  v2:  ', JSON.stringify(row.diff.v2));
    if (row.live.errors.length || (row.v2 && row.v2.errors.length)) console.log('  page errors:', row.live.errors, row.v2 && row.v2.errors);
  }
}
await browser.close();
writeFileSync(join(here, 'results.json'), JSON.stringify({ ran: new Date().toISOString(), fails, results }, null, 1));
console.log(fails ? `${fails} FAIL` : 'all v2 rows pass');
process.exit(fails ? 1 : 0);
