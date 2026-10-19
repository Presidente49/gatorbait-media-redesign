/* GatorBait Latest Feed v1: the news feed experience for /gatorbait-media-blogs, its category, tag and page routes.
   Reads /blog-feed.xml (cache-busted, no-store), sorts newest first, and falls back to the native Wix list on any failure.
   Posts are never touched. The native feed DOM stays in the page, visually hidden and crawlable. No h1 is added. */
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
