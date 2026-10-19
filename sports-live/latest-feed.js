/* GatorBait Latest Feed v1, build 030d90be. BUILT FILE: edit sports-live/src/latest-feed.{css,js}, then run node sports-live/build-latest-feed.mjs */
(function () {
  'use strict';
  try {
    var s = document.createElement('style'); s.id = 'gbm-lf-style'; s.textContent = "#gbm-lf{--o:#FA4616;--g:#22884C;--ink:#07122E;--s:#101529;--s2:#161e31;--ln:rgba(255,255,255,.14);--tx:#fff;--mu:#c9d1e4;--pk:#ffb39a;--c:\"Barlow Condensed\",\"Barlow\",Arial,sans-serif;--f:\"Barlow\",Arial,sans-serif;position:relative;display:block;width:var(--lf-vw,100vw);max-width:100vw;margin:0 0 0 calc(50% - var(--lf-vw,100vw)/2);padding:0;box-sizing:border-box;color:var(--tx);font-family:var(--f);text-align:left;text-transform:none;letter-spacing:0;line-height:1.25;-webkit-font-smoothing:antialiased}#gbm-lf *,#gbm-lf *::before,#gbm-lf *::after{box-sizing:border-box}#gbm-lf a{color:inherit;text-decoration:none;font-family:inherit}#gbm-lf h2,#gbm-lf h3,#gbm-lf p{margin:0;padding:0;font-family:var(--c);color:var(--tx);text-transform:none;letter-spacing:0}#gbm-lf img{display:block;max-width:none}#gbm-lf .lf-in{width:100%;max-width:1240px;margin:0 auto;padding:0 24px}#gbm-lf a:focus-visible,#gbm-lf button:focus-visible,#gbm-lf input:focus-visible{outline:3px solid #fff;outline-offset:2px;border-radius:4px}#gbm-lf .lf-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:16px 32px;padding:34px 0 22px;position:relative;min-height:150px}#gbm-lf .lf-head::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--ln)}#gbm-lf .lf-head::before{content:\"\";position:absolute;left:0;bottom:-1px;width:96px;height:4px;background:var(--o);z-index:1}#gbm-lf .lf-kick{display:flex;align-items:center;gap:10px;margin-bottom:8px;font:700 13px/1 var(--f);letter-spacing:.16em;text-transform:uppercase;color:var(--pk)}#gbm-lf .lf-dot{width:9px;height:9px;border-radius:50%;background:var(--g);flex:none}#gbm-lf .lf-title{font:italic 800 clamp(40px,4.7vw,68px)/.92 var(--c);text-transform:uppercase;color:#fff}#gbm-lf .lf-side-h{display:flex;flex-direction:column;align-items:flex-end;gap:12px}#gbm-lf .lf-date{font:700 13px/1.3 var(--f);letter-spacing:.1em;text-transform:uppercase;color:var(--mu)}#gbm-lf .lf-search{display:flex;gap:8px}#gbm-lf .lf-search input[type=search]{width:240px;min-height:44px;padding:0 14px;border:1px solid var(--ln);border-radius:8px;background:var(--s);color:#fff;font:500 16px/1 var(--f)}#gbm-lf .lf-search input::placeholder{color:#aab4cc;opacity:1}#gbm-lf .lf-search button{min-height:44px;padding:0 18px;border:0;border-radius:8px;background:var(--o);color:var(--ink);font:800 16px/1 var(--c);letter-spacing:.06em;text-transform:uppercase;cursor:pointer}#gbm-lf .lf-chipbar{position:relative;margin:18px 0 26px}#gbm-lf .lf-chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 10px;scrollbar-width:thin;scrollbar-color:#3b4668 transparent;-webkit-overflow-scrolling:touch}#gbm-lf .lf-chip{flex:none;display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border:1px solid var(--ln);border-radius:999px;background:var(--s);color:#fff;font:800 15px/1 var(--c);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:background .15s,border-color .15s}#gbm-lf .lf-chip:hover{border-color:var(--o);background:var(--s2)}#gbm-lf .lf-chip[aria-current=page]{background:var(--o);border-color:var(--o);color:var(--ink)}#gbm-lf .lf-chip.lf-gap{margin-left:8px;position:relative}#gbm-lf .lf-chip.lf-gap::before{content:\"\";position:absolute;left:-9px;top:10px;bottom:10px;width:1px;background:var(--ln)}#gbm-lf .lf-tags{display:flex;flex-wrap:wrap;gap:6px}#gbm-lf .lf-head>*,#gbm-lf .lf-side-h>*{min-width:0}#gbm-lf .lf-tag{white-space:nowrap;display:inline-block;padding:5px 9px 4px;border-radius:4px;background:var(--o);color:var(--ink);font:800 12px/1 var(--f);letter-spacing:.1em;text-transform:uppercase}#gbm-lf .lf-tag.lf-alt{background:rgba(255,255,255,.14);color:#fff}#gbm-lf .lf-meta{display:flex;flex-wrap:nowrap;gap:0 10px;overflow:hidden;white-space:nowrap;color:var(--mu);font:600 13px/1.3 var(--f);letter-spacing:.03em}#gbm-lf .lf-meta b{color:#fff;font-weight:800;letter-spacing:.06em;text-transform:uppercase}#gbm-lf .lf-meta span+span::before{content:\"\";display:inline-block;width:4px;height:4px;margin:0 10px 2px 0;border-radius:50%;background:var(--g)}#gbm-lf .lf-img{position:relative;display:block;overflow:hidden;background:#0b1226;aspect-ratio:16/9}#gbm-lf .lf-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .35s ease}#gbm-lf a:hover .lf-img img{transform:scale(1.03)}#gbm-lf .lf-top{display:grid;grid-template-columns:minmax(0,1.85fr) minmax(0,1fr);gap:20px;margin-bottom:44px}#gbm-lf .lf-lead{position:relative;display:block;aspect-ratio:16/9;border:1px solid var(--ln);border-radius:14px;overflow:hidden;background:#0b1226}#gbm-lf .lf-lead .lf-media{position:absolute;inset:0;display:block}#gbm-lf .lf-lead .lf-bgfx{position:absolute;inset:-20px;background-size:cover;background-position:center;filter:blur(26px) saturate(1.1);opacity:.65}#gbm-lf .lf-lead .lf-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}#gbm-lf .lf-lead::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:68%;background:linear-gradient(180deg,rgba(7,12,30,0),rgba(7,12,30,.86) 62%,rgba(7,12,30,.96));pointer-events:none}#gbm-lf .lf-lead .lf-body{position:absolute;z-index:2;left:0;right:0;bottom:0;padding:0 30px 28px;display:flex;flex-direction:column;gap:12px}#gbm-lf .lf-lead .lf-lt{font:italic 800 clamp(30px,3.3vw,54px)/.96 var(--c);text-transform:uppercase;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.5);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}#gbm-lf .lf-dek{font:500 18px/1.4 var(--f);color:#e6eaf5;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;max-width:62ch}#gbm-lf .lf-btn{align-self:flex-start;display:inline-flex;align-items:center;min-height:44px;padding:0 22px;border-radius:8px;background:var(--o);color:var(--ink);font:800 17px/1 var(--c);letter-spacing:.07em;text-transform:uppercase}#gbm-lf .lf-lead:hover .lf-btn{background:#fff}#gbm-lf .lf-stack{display:flex;flex-direction:column;gap:14px;min-width:0}#gbm-lf .lf-sec-h{display:flex;align-items:center;gap:12px;margin:0 0 2px;font:800 15px/1 var(--f);letter-spacing:.16em;text-transform:uppercase;color:#fff}#gbm-lf .lf-sec-h i{width:8px;height:22px;background:var(--o);display:block}#gbm-lf .lf-sec-h span{font-weight:600;letter-spacing:.1em;color:var(--mu);margin-left:auto;font-size:12px}#gbm-lf .lf-sc{flex:1 1 auto;display:grid;grid-template-columns:42% minmax(0,1fr);gap:14px;align-items:start;padding:12px;border:1px solid var(--ln);border-radius:12px;background:var(--s);min-height:0}#gbm-lf .lf-sc:hover{border-color:var(--o);background:var(--s2)}#gbm-lf .lf-sc .lf-img{border-radius:8px}#gbm-lf .lf-sc .lf-tx{display:flex;flex-direction:column;gap:7px;min-width:0}#gbm-lf .lf-sc .lf-ct{font:800 21px/1.05 var(--c);color:#fff;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}#gbm-lf .lf-sc .lf-meta,#gbm-lf .lf-card .lf-meta{flex-wrap:wrap;white-space:normal;row-gap:2px}#gbm-lf .lf-more-h{display:flex;align-items:center;gap:14px;margin:0 0 22px;font:italic 800 30px/1 var(--c);text-transform:uppercase;color:#fff}#gbm-lf .lf-more-h::before{content:\"\";width:8px;height:30px;background:var(--o);flex:none}#gbm-lf .lf-more-h::after{content:\"\";flex:1;height:1px;background:var(--ln)}#gbm-lf .lf-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px 20px;list-style:none;margin:0;padding:0}#gbm-lf .lf-grid>li{margin:0;padding:0;min-width:0}#gbm-lf .lf-card{display:flex;flex-direction:column;height:100%;border:1px solid var(--ln);border-radius:12px;background:var(--s);overflow:hidden;transition:border-color .15s,background .15s}#gbm-lf .lf-card:hover{border-color:var(--o);background:var(--s2)}#gbm-lf .lf-card .lf-img{border-bottom:3px solid var(--o)}#gbm-lf .lf-card .lf-tx{display:flex;flex-direction:column;gap:9px;padding:14px 16px 16px;flex:1}#gbm-lf .lf-card .lf-ct{font:800 26px/1.04 var(--c);color:#fff;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}#gbm-lf .lf-card .lf-ex{font:500 15px/1.4 var(--f);color:var(--mu);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}#gbm-lf .lf-card .lf-meta{margin-top:auto;padding-top:4px}#gbm-lf .lf-foot{display:flex;flex-direction:column;align-items:center;gap:14px;margin:36px 0 0;padding:26px 0 56px;border-top:1px solid var(--ln);position:relative}#gbm-lf .lf-foot::before{content:\"\";position:absolute;left:0;top:-1px;width:96px;height:4px;background:var(--o)}#gbm-lf .lf-loadmore{min-height:52px;padding:0 34px;border:0;border-radius:8px;background:var(--o);color:var(--ink);font:800 19px/1 var(--c);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}#gbm-lf .lf-loadmore:hover{background:#fff}#gbm-lf .lf-loadmore[disabled]{opacity:.6;cursor:wait}#gbm-lf .lf-status{font:600 14px/1.3 var(--f);letter-spacing:.05em;color:var(--mu);text-align:center}#gbm-lf .lf-older,#gbm-lf .lf-pg a{display:inline-flex;align-items:center;min-height:44px;padding:0 20px;border:1px solid var(--ln);border-radius:8px;background:var(--s);color:#fff;font:800 16px/1 var(--c);letter-spacing:.08em;text-transform:uppercase}#gbm-lf .lf-older:hover,#gbm-lf .lf-pg a:hover{border-color:var(--o);background:var(--s2)}#gbm-lf .lf-pg{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}#gbm-lf .lf-pg a[aria-current=page]{background:var(--o);border-color:var(--o);color:var(--ink)}#gbm-lf .lf-empty{padding:40px 0;font:700 22px/1.3 var(--c);color:var(--mu)}#gbm-lf .lf-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}@media(min-width:1700px){#gbm-lf .lf-in{max-width:1440px}#gbm-lf .lf-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:1023px){#gbm-lf .lf-top{grid-template-columns:1fr;gap:18px}#gbm-lf .lf-stack{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}#gbm-lf .lf-sec-h{grid-column:1/-1}#gbm-lf .lf-sc{grid-template-columns:1fr}#gbm-lf .lf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:767px){#gbm-lf .lf-in{padding:0 16px}#gbm-lf .lf-head{grid-template-columns:1fr;padding:22px 0 16px;min-height:0}#gbm-lf .lf-title{font-size:clamp(38px,11vw,52px)}#gbm-lf .lf-side-h{align-items:stretch;width:100%}#gbm-lf .lf-date{display:none}#gbm-lf .lf-search{width:100%}#gbm-lf .lf-search input[type=search]{flex:1;width:auto;min-width:0}#gbm-lf .lf-search button{flex:none}#gbm-lf .lf-chipbar{margin:14px -16px 20px}#gbm-lf .lf-chips{padding:2px 16px 10px}#gbm-lf .lf-lead{aspect-ratio:auto;border-radius:12px;display:flex;flex-direction:column;background:var(--s)}#gbm-lf .lf-lead .lf-media{position:relative;inset:auto;aspect-ratio:16/10}#gbm-lf .lf-lead::after{display:none}#gbm-lf .lf-lead .lf-body{position:relative;padding:16px 16px 18px;gap:10px;border-top:4px solid var(--o)}#gbm-lf .lf-lead .lf-lt{font-size:34px;-webkit-line-clamp:5}#gbm-lf .lf-dek{font-size:16px}#gbm-lf .lf-stack{display:flex;flex-direction:column;gap:12px}#gbm-lf .lf-sc{grid-template-columns:104px minmax(0,1fr);gap:12px;padding:10px}#gbm-lf .lf-tag{font-size:11px;letter-spacing:.07em;padding:4px 7px 3px}#gbm-lf .lf-sc .lf-ct{font-size:20px;-webkit-line-clamp:5}#gbm-lf .lf-top{margin-bottom:34px}#gbm-lf .lf-more-h{font-size:26px;margin-bottom:16px}#gbm-lf .lf-grid{grid-template-columns:1fr;gap:12px}#gbm-lf .lf-card{flex-direction:row;align-items:stretch}#gbm-lf .lf-card .lf-img{width:108px;flex:none;aspect-ratio:auto;border-bottom:0;border-right:3px solid var(--o)}#gbm-lf .lf-card .lf-tx{padding:11px 12px 12px;gap:7px;min-width:0}#gbm-lf .lf-card .lf-ct{font-size:20px;-webkit-line-clamp:4}#gbm-lf .lf-card .lf-ex{display:none}#gbm-lf .lf-meta{font-size:12px;flex-wrap:wrap;white-space:normal;row-gap:2px}#gbm-lf .lf-loadmore{width:100%}}@media(prefers-reduced-motion:reduce){#gbm-lf *{transition:none!important}}";
    if (!document.getElementById('gbm-lf-style')) (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
var FEED = /^\/gatorbait-media-blogs(\/|$)/;
var D = document, H = D.documentElement, W = window;
if (!W.__GBM_LF__ && FEED.test(location.pathname) && !W.__GBM_LF_FAIL__) {
  W.__GBM_LF__ = 1;
  var ROOT_PATH = '/gatorbait-media-blogs';
  var path = location.pathname.replace(/\/+$/, '');
  var pageNo = +((path.match(/\/page\/(\d+)$/) || [0, 1])[1]);
  var base = path.replace(/\/page\/\d+$/, '');
  var catSlug = (base.match(/\/categories\/([^/]+)$/) || [])[1] || '';
  var isRoot = base === ROOT_PATH && pageNo === 1;
  var FIRST = 16, STEP = 12, CAP = 48;
  var CATS = [
    ['Franz Beard - Blog', 'Franz Beard', 'franz-beard-blog', 1],
    ["Buddy's Blog", 'Buddy Martin', 'buddy-s-blog', 1],
    ['Loren Meadows - Blogs', 'Loren Meadows', 'loren-meadows-blogs', 1],
    ['Eddie Gilley - Blog', 'Eddie Gilley', 'eddie-gilley-blog', 1],
    ['Gator Football', 'Gator Football', 'gator-football', 1],
    ['Gator Basketball', 'Basketball', 'gator-basketball', 1],
    ['Gator Recruiting', 'Recruiting', 'gator-recruiting', 1],
    ['Gatorbait Magazine', 'Magazine', 'gatorbait-magazine', 1],
    ['The Buddy Martin Show', 'The Buddy Martin Show', 'the-buddy-martin-show', 1],
    ['Gator Breaking News', 'Breaking News', 'gator-breaking-news', 2],
    ['Thoughts Of The Day', 'Thoughts of the Day', 'thoughts-of-the-day-franz-beard-1', 2],
    ['Carlton Reese', 'Carlton Reese', 'carlton-reese', 2],
    ['Gator Baseball', 'Baseball', 'gator-baseball', 2],
    ['Gator Softball', 'Softball', 'gator-softball', 2],
    ['Gator Gymnastics', 'Gymnastics', 'gator-gymnastics', 2],
    ['Gators in The NFL', 'Gators in the NFL', 'gators-in-the-nfl', 2]
  ];
  var CAT_BY_NAME = {}, CAT_BY_SLUG = {};
  CATS.forEach(function (c) { CAT_BY_NAME[c[0].toLowerCase()] = c; CAT_BY_SLUG[c[2]] = c; });
  // Card tag order: the voice first, then the sport. Featured Article and Archive tags never show.
  var TAG_ORDER = ['Franz Beard - Blog', "Buddy's Blog", 'Loren Meadows - Blogs', 'Eddie Gilley - Blog', 'Carlton Reese', 'The Buddy Martin Show', 'Gatorbait Magazine', 'Thoughts Of The Day', 'Gator Basketball', 'Gator Recruiting', 'Gator Breaking News', 'Gator Football', 'Gator Baseball', 'Gator Softball', 'Gator Gymnastics', 'Gators in The NFL'];
  var root = null, state = null, PS = 12, nextPage = 2, lastPage = 1, loading = false, exhausted = false;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function txt(el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
  function fail(why) {
    try { console.warn('[GatorBait] latest feed fell back to the native list:', why); } catch (e) {}
    W.__GBM_LF_FAIL__ = 1;
    if (root && root.parentNode) root.parentNode.removeChild(root);
    var fr = feedRoot(); if (fr) { fr.removeAttribute('inert'); fr.removeAttribute('aria-hidden'); }
    H.classList.remove('gbm-lf-pre', 'gbm-lf-on');
  }
  // Wix image URLs: whole photo (fit), sized for the slot, webp.
  function size(u, w) {
    if (!u) return '';
    if (u.indexOf('static.wixstatic.com/media/') < 0) return u;
    u = u.replace(/\/v1\/(?:fill|fit)\/[^/]+\//, '/v1/fit/w_' + w + ',h_' + w + ',al_c,q_80/');
    return u.replace(/\/file\.(png|jpe?g)$/i, '/file.webp');
  }
  function srcset(u, ws) { return ws.map(function (w) { return size(u, w) + ' ' + w + 'w'; }).join(', '); }

  /* ---------- time ---------- */
  var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function approxTs(t) {
    if (!t) return 0;
    var now = Date.now(), m = t.match(/^(\d+|an?|one)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
    if (m) {
      var n = /^(a|an|one)$/i.test(m[1]) ? 1 : +m[1], u = m[2].toLowerCase();
      var ms = { second: 1e3, minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5, month: 2592e6, year: 31536e6 }[u];
      return now - n * ms;
    }
    if (/^(just now|now)$/i.test(t)) return now;
    if (/^yesterday/i.test(t)) return now - 864e5;
    m = t.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:,?\s+(\d{4}))?/);
    if (m && MONTHS[m[1].toLowerCase()] != null) {
      var y = m[3] ? +m[3] : new Date().getFullYear(), d = new Date(Date.UTC(y, MONTHS[m[1].toLowerCase()], +m[2], 16));
      if (!m[3] && d.getTime() > now + 864e5) d = new Date(Date.UTC(y - 1, MONTHS[m[1].toLowerCase()], +m[2], 16));
      return d.getTime();
    }
    return 0;
  }
  function ago(ts) {
    var s = Math.max(0, (Date.now() - ts) / 1000);
    if (s < 90) return 'Just now';
    if (s < 3600) return Math.round(s / 60) + ' min ago';
    if (s < 86400) { var h = Math.round(s / 3600); return h + (h === 1 ? ' hour ago' : ' hours ago'); }
    if (s < 172800) return 'Yesterday';
    if (s < 604800) return Math.floor(s / 86400) + ' days ago';
    var d = new Date(ts), o = { month: 'short', day: 'numeric', timeZone: 'America/New_York' };
    if (new Date().getFullYear() !== d.getFullYear()) o.year = 'numeric';
    return d.toLocaleDateString('en-US', o);
  }

  /* ---------- data ---------- */
  function canon(u) { try { var a = new URL(u, location.origin); return a.pathname.replace(/\/+$/, ''); } catch (e) { return u; } }
  function parseRss(xml) {
    var doc = new DOMParser().parseFromString(xml, 'text/xml'), out = [];
    var its = doc.getElementsByTagName('item');
    for (var i = 0; i < its.length; i++) {
      var it = its[i], g = function (n) { var e = it.getElementsByTagName(n)[0]; return e ? (e.textContent || '').trim() : ''; };
      var link = g('link'), enc = it.getElementsByTagName('enclosure')[0], cr = it.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0];
      var cats = [], cs = it.getElementsByTagName('category');
      for (var k = 0; k < cs.length; k++) cats.push((cs[k].textContent || '').trim());
      var ts = Date.parse(g('pubDate'));
      if (!link || !ts) continue;
      out.push({ key: canon(link), url: link, title: g('title'), desc: g('description'), img: enc ? enc.getAttribute('url') : '', alt: '', cats: cats, by: cr ? (cr.textContent || '').trim() : '', ts: ts, exact: 1, read: '', ago: '' });
    }
    return out.sort(function (a, b) { return b.ts - a.ts; });
  }
  // Native Wix list items from a document or fragment (the page itself, or a fetched native page).
  function nativeItems(scope) {
    var out = [], seen = {}, ws = scope.querySelectorAll('[data-hook=post-list-item]');
    for (var i = 0; i < ws.length; i++) {
      var w = ws[i], t = w.querySelector('[data-hook=post-title]') || w.querySelector('h2,h3');
      var a = (t && t.closest('a')) || w.querySelector('a[href*="/post/"]'), href = a && a.getAttribute('href');
      if (!href) continue;
      var key = canon(href); if (seen[key]) continue; seen[key] = 1;
      var box = w.closest('[data-hook=item-container]') || w.closest('.item-link-wrapper') || w;
      var im = box.querySelector('img[data-hook=gallery-item-image-img]') || box.querySelector('img');
      var src = im ? (im.getAttribute('src') || '') : '';
      var cl = w.querySelector('[data-hook=post-category-label] a');
      var tx = txt(w.querySelector('[data-hook=time-ago]'));
      out.push({ key: key, url: new URL(href, location.origin).href, title: txt(t), desc: '', img: src, alt: im ? (im.getAttribute('alt') || '') : '', cats: cl ? [txt(cl)] : [], catHref: cl ? cl.getAttribute('href') : '', by: txt(w.querySelector('[data-hook=user-name]')), ts: approxTs(tx), exact: 0, read: txt(w.querySelector('[data-hook=time-to-read]')), ago: tx });
    }
    return out;
  }
  var RE_ROOT = /<div[^>]*data-hook="feed-page-root"/, RE_PAG = /<div[^>]*data-hook="(?:feed|category)-pagination-container"/;
  function nativeFromHtml(html) {
    var m = RE_ROOT.exec(html);
    if (!m) return [];
    var rest = html.slice(m.index), e = RE_PAG.exec(rest);
    return nativeItems(new DOMParser().parseFromString(rest.slice(0, e ? e.index : 900000), 'text/html'));
  }
  // Merge: RSS items are exact. Native items fill in what RSS lacks (read time, credited alt) and extend the list.
  function merge(list, extra) {
    var by = {}; list.forEach(function (x) { by[x.key] = x; });
    extra.forEach(function (n) {
      var x = by[n.key];
      if (x) {
        if (!x.read && n.read) x.read = n.read;
        if (n.alt && (!x.alt || /^featured image for/i.test(x.alt))) x.alt = n.alt;
        if (!x.img && n.img) x.img = n.img;
        if (!x.cats.length && n.cats.length) x.cats = n.cats;
        if (!x.by && n.by) x.by = n.by;
      } else { list.push(n); by[n.key] = n; }
    });
    return list;
  }
  // Strict newest first. Native-only items carry an approximate time clamped so the native sequence never rises.
  function order(list) {
    var prev = Infinity;
    list.forEach(function (x, i) {
      x.i = i;
      if (!x.exact) { var t = x.ts || (prev === Infinity ? Date.now() : prev); x.ts = Math.min(t, prev); }
      if (x.ts < prev) prev = x.ts;
    });
    return list.sort(function (a, b) { return b.ts - a.ts || a.i - b.i; });
  }

  /* ---------- render ---------- */
  function tagsFor(x) {
    var names = (x.cats || []).filter(function (c) { return !/^(featured article|archive \d{4})$/i.test(c); });
    names.sort(function (a, b) { var ia = TAG_ORDER.indexOf(a), ib = TAG_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    return names.slice(0, 2).map(function (n) { var c = CAT_BY_NAME[n.toLowerCase()]; return c ? c[1] : n.replace(/\s+-\s+Blogs?$/i, ''); });
  }
  function tagHtml(x, max) {
    var t = tagsFor(x).slice(0, max || 1);
    if (!t.length) t = ['GatorBait'];
    return '<span class="lf-tags">' + t.map(function (n, i) { return '<span class="lf-tag' + (i ? ' lf-alt' : '') + '">' + esc(n) + '</span>'; }).join('') + '</span>';
  }
  function metaHtml(x) {
    var when = x.exact ? ago(x.ts) : x.ago;
    return '<span class="lf-meta">' + (x.by ? '<span><b>' + esc(x.by) + '</b></span>' : '') + (when ? '<span><time' + (x.exact ? ' datetime="' + new Date(x.ts).toISOString() + '"' : '') + '>' + esc(when) + '</time></span>' : '') + (x.read ? '<span data-r="1">' + esc(x.read.replace(/\s*read$/i, ' read')) + '</span>' : '') + '</span>';
  }
  function altFor(x) {
    var a = (x.alt || '').trim();
    if (!a || /^featured image for/i.test(a)) a = x.title + ' (photo: GatorBait Media)';
    return a;
  }
  function imgHtml(x, ws, sizes, eager) {
    if (!x.img) return '<span class="lf-img"></span>';
    return '<span class="lf-img"><img alt="' + esc(altFor(x)) + '" src="' + esc(size(x.img, ws[1])) + '" srcset="' + esc(srcset(x.img, ws)) + '" sizes="' + sizes + '" ' + (eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"') + '></span>';
  }
  function leadHtml(x) {
    var big = size(x.img, 1280);
    return '<a class="lf-lead" href="' + esc(x.url) + '"><span class="lf-media">' + (x.img ? '<i class="lf-bgfx" style="background-image:url(' + esc(size(x.img, 480)) + ')"></i><img alt="' + esc(altFor(x)) + '" src="' + esc(big) + '" srcset="' + esc(srcset(x.img, [640, 960, 1280, 1600])) + '" sizes="(min-width:1024px) 62vw,100vw" fetchpriority="high" decoding="async">' : '') + '</span>' +
      '<span class="lf-body">' + tagHtml(x, 2) + '<h3 class="lf-lt">' + esc(x.title) + '</h3>' + (x.desc ? '<span class="lf-dek">' + esc(x.desc) + '</span>' : '') + metaHtml(x) + '<span class="lf-btn">Read the story &rarr;</span></span></a>';
  }
  function sideHtml(x) {
    return '<a class="lf-sc" href="' + esc(x.url) + '">' + imgHtml(x, [320, 480, 640], '(min-width:1024px) 17vw,(min-width:768px) 30vw,128px') + '<span class="lf-tx">' + tagHtml(x, 1) + '<h3 class="lf-ct">' + esc(x.title) + '</h3>' + metaHtml(x) + '</span></a>';
  }
  function cardHtml(x) {
    return '<li><a class="lf-card" href="' + esc(x.url) + '">' + imgHtml(x, [320, 480, 640], '(min-width:1700px) 24vw,(min-width:1024px) 31vw,(min-width:768px) 46vw,124px') + '<span class="lf-tx">' + tagHtml(x, 1) + '<h3 class="lf-ct">' + esc(x.title) + '</h3>' + (x.desc ? '<span class="lf-ex">' + esc(x.desc) + '</span>' : '') + metaHtml(x) + '</span></a></li>';
  }
  function pageTitle() {
    if (catSlug) {
      var c = CAT_BY_SLUG[catSlug];
      if (c) return c[1];
      var n = D.querySelector('[data-hook="header-navigation__/categories/' + catSlug + '"]');
      return txt(n) || catSlug.replace(/-/g, ' ');
    }
    var tg = base.match(/\/tags\/([^/]+)/);
    if (tg) { var dt = (D.title || '').split('|')[0].trim(); return dt && !/gatorbait/i.test(dt) ? dt : decodeURIComponent(tg[1]).replace(/-+$/, '').replace(/-/g, ' '); }
    return 'Latest Florida Gators News';
  }
  function chipsHtml() {
    var h = '<a class="lf-chip" href="' + ROOT_PATH + '"' + (base === ROOT_PATH ? ' aria-current="page"' : '') + '>All news</a>';
    CATS.forEach(function (c, i) {
      h += '<a class="lf-chip' + (c[3] === 2 && CATS[i - 1][3] === 1 ? ' lf-gap' : '') + '" href="' + ROOT_PATH + '/categories/' + c[2] + '"' + (catSlug === c[2] ? ' aria-current="page"' : '') + '>' + esc(c[1]) + '</a>';
    });
    return h;
  }
  function pagerHtml() {
    if (isRoot) return '';
    var lastEl = D.querySelector('a[data-hook="pagination__last"]'), lm = lastEl && (lastEl.getAttribute('href') || '').match(/\/page\/(\d+)/), total = lm ? +lm[1] : 0;
    var h = function (n) { return n <= 1 ? base : base + '/page/' + n; }, out = '<nav class="lf-pg" aria-label="More pages">';
    if (pageNo > 1) out += '<a href="' + h(pageNo - 1) + '">&larr; Newer</a>';
    for (var n = Math.max(1, pageNo - 2); n <= pageNo + 2 && (!total || n <= total); n++) out += '<a href="' + h(n) + '"' + (n === pageNo ? ' aria-current="page"' : '') + '>' + n + '</a>';
    out += '<a href="' + h(pageNo + 1) + '">Older &rarr;</a></nav>';
    return out;
  }
  function canFetch() { return !exhausted && state.items.length < CAP; }
  function footHtml() {
    var s = state, shown = Math.min(s.shown, s.items.length);
    var h = '<div class="lf-status" role="status" aria-live="polite" id="lf-status">' + shown + ' stories shown, newest first</div>';
    if (pageNo > 1) return h + pagerHtml();
    if (s.shown < s.items.length || canFetch()) h += '<button type="button" class="lf-loadmore" id="lf-more">Load more stories</button>';
    else if (!exhausted) h += '<a class="lf-older" href="' + base + '/page/' + (lastPage + 1) + '">Older stories &rarr;</a>';
    return h;
  }
  function render() {
    var it = state.items, dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
    var useLead = pageNo === 1 && it.length >= 4;
    var head = '<header class="lf-head"><div><div class="lf-kick"><i class="lf-dot"></i>GatorBait Media' + (catSlug ? ' &middot; Section' : ' &middot; Newsroom') + '</div><h2 class="lf-title">' + esc(pageTitle()) + '</h2></div>' +
      '<div class="lf-side-h"><div class="lf-date">' + esc(dateStr) + '</div><form class="lf-search" role="search" action="https://www.google.com/search" method="get"><label class="lf-sr" for="lf-q">Search the GatorBait archive</label><input id="lf-q" name="q" type="search" placeholder="Search the archive" required><input type="hidden" name="as_sitesearch" value="gatorbaitmedia.com"><button type="submit">Search</button></form></div></header>';
    var h = '<div class="lf-in">' + head + '<nav class="lf-chipbar" aria-label="Browse by writer or section"><div class="lf-chips">' + chipsHtml() + '</div></nav>';
    if (!it.length) h += '<p class="lf-empty">No stories here yet.</p>';
    else {
      var gridFrom = 0;
      if (useLead) {
        h += '<div class="lf-top">' + leadHtml(it[0]) + '<div class="lf-stack"><div class="lf-sec-h"><i></i>Just in<span>Newest first</span></div>' + it.slice(1, 4).map(sideHtml).join('') + '</div></div>';
        gridFrom = 4;
      }
      h += '<h2 class="lf-more-h">' + (useLead ? 'More stories' : 'Stories') + '</h2><ul class="lf-grid" id="lf-grid">' + it.slice(gridFrom, state.shown).map(cardHtml).join('') + '</ul>';
    }
    h += '<div class="lf-foot" id="lf-foot">' + footHtml() + '</div></div>';
    root.innerHTML = h;
    var btn = root.querySelector('#lf-more'); if (btn) btn.addEventListener('click', loadMore);
  }
  function appendGrid(from) {
    var grid = root.querySelector('#lf-grid'); if (!grid) return;
    var tmp = D.createElement('ul'); tmp.innerHTML = state.items.slice(from, state.shown).map(cardHtml).join('');
    var firstNew = tmp.firstElementChild;
    while (tmp.firstChild) grid.appendChild(tmp.firstChild);
    return firstNew;
  }
  function refreshFoot() {
    var f = root.querySelector('#lf-foot'); if (!f) return;
    f.innerHTML = footHtml();
    var btn = f.querySelector('#lf-more'); if (btn) btn.addEventListener('click', loadMore);
  }
  function loadMore() {
    if (loading) return;
    var s = state, from = s.shown, btn = root.querySelector('#lf-more');
    var go = function () {
      loading = false;
      s.items = order(s.items);
      s.shown = Math.min(s.items.length, from + STEP);
      var added = appendGrid(from), a = added && added.querySelector('a');
      refreshFoot();
      if (a) { try { a.focus({ preventScroll: true }); } catch (e) { a.focus(); } }
    };
    if (s.items.length > from) return go();
    loading = true; if (btn) { btn.disabled = true; btn.textContent = 'Loading\u2026'; }
    (function pull() { if (s.items.length > from || !canFetch()) return go(); fetchPage(nextPage++, function (got) { if (got) lastPage = nextPage - 1; pull(); }); })();
  }
  // Native Wix pages (the page size depends on the layout: 12 on desktop, 5 on phones). Reads only as far as the post list, then stops the download.
  function fetchPage(p, cb, quiet) {
    var u = base + '/page/' + p + '?gbmlf=' + Date.now();
    fetch(u, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      if (!r.body || !r.body.getReader || !W.TextDecoder) return r.text();
      var rd = r.body.getReader(), dec = new TextDecoder(), buf = '';
      return (function pump() {
        return rd.read().then(function (c) {
          if (c.done) return buf;
          buf += dec.decode(c.value, { stream: true });
          var m = RE_ROOT.exec(buf);
          if ((m && RE_PAG.test(buf.slice(m.index))) || buf.length > 1800000) { try { rd.cancel(); } catch (e) {} return buf; }
          return pump();
        });
      })();
    }).then(function (t) {
      var got = nativeFromHtml(t);
      if (quiet) { var by = {}; state.items.forEach(function (x) { by[x.key] = x; }); got.forEach(function (x) { var y = by[x.key]; if (!y) return; if (x.read) y.read = x.read; if (x.alt) y.alt = x.alt; }); return cb(got.length); }
      if (!got.length) exhausted = true;
      state.items = merge(state.items, got);
      cb(got.length);
    }).catch(function () { if (!quiet) exhausted = true; cb(0); });
  }

  /* ---------- mount ---------- */
  function feedRoot() { return D.querySelector('[data-hook=feed-page-root]'); }
  function place() {
    var fr = feedRoot(); if (!fr || !fr.parentNode) return false;
    if (!root) { root = D.createElement('section'); root.id = 'gbm-lf'; root.setAttribute('aria-label', 'Latest stories'); }
    if (root.parentNode !== fr.parentNode || root.nextSibling !== fr) fr.parentNode.insertBefore(root, fr);
    if (!fr.hasAttribute('inert')) { fr.setAttribute('inert', ''); fr.setAttribute('aria-hidden', 'true'); }
    return true;
  }
  function setVw() { var w = H.clientWidth; if (w > 300) H.style.setProperty('--lf-vw', w + 'px'); }
  function fonts() {
    if (!D.fonts || !D.fonts.load) return Promise.resolve();
    var f = ['800 24px "Barlow Condensed"', '700 24px "Barlow Condensed"', '400 16px Barlow', '600 14px Barlow', '700 14px Barlow'].map(function (s) { return D.fonts.load(s).catch(function () {}); });
    return Promise.race([Promise.all(f), new Promise(function (r) { setTimeout(r, 900); })]);
  }
  function waitNative(cb, ms) {
    var t0 = Date.now();
    (function tick() {
      var fr = feedRoot(), n = fr ? nativeItems(fr) : [];
      if (n.length || Date.now() - t0 > ms) return cb(n);
      setTimeout(tick, 60);
    })();
  }
  function getRss() {
    var p = W.__GBM_LF_RSS__ || fetch('/blog-feed.xml?gbmlf=' + Date.now(), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
    return p.then(function (x) { return typeof x === 'string' ? x : x.text(); });
  }
  function start() {
    var rss = getRss().then(parseRss).catch(function () { return []; });
    var tasks = [fonts(), new Promise(function (r) { waitNative(r, 2000); }), rss];
    Promise.all(tasks).then(function (res) {
      if (W.__GBM_LF_FAIL__) return;
      var nat = res[1], feed = res[2], items;
      if (isRoot) {
        if (!feed.length) return fail('empty feed');
        items = merge(feed, nat.filter(function (n) { return feed.some(function (x) { return x.key === n.key; }); }));
      } else {
        if (!nat.length) return fail('no native items');
        var by = {}; feed.forEach(function (x) { by[x.key] = x; });
        nat.forEach(function (n) { var x = by[n.key]; if (x) { n.ts = x.ts; n.exact = 1; n.desc = x.desc; n.img = x.img || n.img; n.cats = n.cats.length ? n.cats.concat(x.cats.filter(function (c) { return n.cats.indexOf(c) < 0; })) : x.cats; n.by = x.by || n.by; } });
        items = nat;
      }
      PS = Math.max(1, nat.length);
      nextPage = isRoot ? Math.floor(items.length / PS) + 1 : 2;
      lastPage = nextPage - 1;
      if (!isRoot && !D.querySelector('a[data-hook="pagination__next"]')) exhausted = true;
      state = { items: order(items), shown: pageNo > 1 ? 99 : FIRST };
      if (!place()) return fail('no mount point');
      setVw();
      render();
      H.classList.add('gbm-lf-on'); H.classList.remove('gbm-lf-pre');
      W.__GBM_LF_OK__ = 1;
      afterMount();
    }).catch(function (e) { fail(e && e.message || e); });
  }
  function afterMount() {
    // Wix hydration can replace the app subtree after our mount: keep the same node in place (bounded observer, 14 s), and keep width true on resize.
    var mo = null, t0 = Date.now();
    if (W.MutationObserver && D.body) {
      mo = new MutationObserver(function () {
        if (Date.now() - t0 > 14000) return mo.disconnect();
        if (root && (!root.isConnected || root.nextSibling !== feedRoot())) place();
      });
      mo.observe(D.body, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 14000);
    }
    var rz = 0; W.addEventListener('resize', function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(setVw); });
    // Quietly read native pages 2..n for read times and credited alt of stories 6-20 (idle; skipped on data saver and slow links).
    var c = navigator.connection || {};
    if (isRoot && !c.saveData && !/^(slow-2g|2g|3g)$/.test(c.effectiveType || '')) {
      var last = Math.ceil(Math.min(20, state.items.length) / PS), p = 2;
      var step = function () {
        if (p > last || !root || !root.isConnected) return;
        fetchPage(p++, function () { patchMeta(); step(); }, 1);
      };
      (W.requestIdleCallback || function (f) { setTimeout(f, 2500); })(step, { timeout: 4000 });
    }
  }
  function patchMeta() {
    if (!root) return;
    var by = {}; state.items.forEach(function (x) { by[x.key] = x; });
    var as = root.querySelectorAll('a.lf-card,a.lf-sc,a.lf-lead');
    for (var i = 0; i < as.length; i++) {
      var x = by[canon(as[i].getAttribute('href'))]; if (!x) continue;
      var m = as[i].querySelector('.lf-meta'), im = as[i].querySelector('img');
      if (m && x.read && !m.querySelector('[data-r]')) { var sp = D.createElement('span'); sp.setAttribute('data-r', '1'); sp.textContent = x.read.replace(/\s*read$/i, ' read'); m.appendChild(sp); }
      if (im && x.alt && !/^featured image for/i.test(x.alt)) im.setAttribute('alt', x.alt);
    }
  }
  // Any link into the feed gets a full page load so the first-paint guard and this build always run (no stale SPA swap).
  D.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || !FEED.test(u.pathname) || (u.pathname === location.pathname && !u.search)) return;
    if (!root || !root.contains(a)) return;
    e.preventDefault(); e.stopPropagation(); location.assign(u.href);
  }, true);
  start();
}

})();
