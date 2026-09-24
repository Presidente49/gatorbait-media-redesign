/* Original Gazette MIT (c) 2026 ondelva; GatorBait integration.
 * Layout and CSS packaged from the actual compiled original source.
 * License: /gatorbait-media-redesign/gazette-live/GAZETTE-LICENSE.txt
 */
(function () {
  'use strict';
  var P = __GAZETTE_PAYLOAD__;
  var DATA = 'https://presidente49.github.io/gatorbait-media-redesign/gazette-live/posts.json';
  var doc = document.documentElement;
  function home() { return (location.pathname.replace(/\/+$/, '') || '/') === '/'; }
  if (window.__GBM_GAZETTE_RUNTIME__) { window.__GBM_GAZETTE_RUNTIME__.sync(); return; }
  var loading = false;
  function safeUrl(value, image) {
    try {
      var u = new URL(String(value), 'https://www.gatorbaitmedia.com');
      if (u.protocol !== 'https:' || u.username || u.password) return '';
      if (image) return u.hostname === 'static.wixstatic.com' ? u.href : '';
      return /^(www\.)?gatorbaitmedia\.com$/.test(u.hostname) && u.pathname.indexOf('/post/') === 0 ? u.href : '';
    } catch (_) { return ''; }
  }
  function normalize(data) {
    var seen = new Set();
    return (data && Array.isArray(data.posts) ? data.posts : []).map(function (p) {
      var u = safeUrl(p.url, false), date = new Date(p.firstPublishedDate);
      if (!u || !p.title || !Number.isFinite(date.getTime()) || date.getTime() > Date.now() + 86400000 || seen.has(u)) return null;
      seen.add(u);
      return { title: String(p.title), url: u, author: String(p.author || 'GatorBait Staff'), date: date,
        image: safeUrl(p.image && p.image.src, true), alt: String(p.image && p.image.alt || p.title) };
    }).filter(Boolean).sort(function (a, b) { return b.date - a.date; }).slice(0, 30);
  }
  function dateLabel(date) { return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' }); }
  function failure(error) {
    loading = false;
    if (window.__GBM_GAZETTE_BOOT__ && window.__GBM_GAZETTE_BOOT__.fallback) window.__GBM_GAZETTE_BOOT__.fallback(error);
    else console.error('[Gazette]', error);
  }
  function render(posts, fresh) {
    if (!home()) { loading = false; return; }
    if (posts.length < 3) throw new Error('Insufficient public stories');
    var existing = document.getElementById('gbm-live');
    if (existing && existing.classList.contains('gbm-gazette')) { loading = false; return; }
    if (existing) throw new Error('Another homepage owner already mounted');
    var lead = posts.find(function (p) { return /\bbuddy\s+martin\b/i.test(p.author) && Date.now() - p.date.getTime() < 7 * 86400000; }) || posts[0];
    var root = document.createElement('div');
    root.id = 'gbm-live'; root.className = 'gbm-gazette'; root.setAttribute('data-theme', 'light');
    root.setAttribute('data-gazette-source', fresh ? 'current-feed' : 'last-known-feed');
    root.setAttribute('data-gazette-newest', posts[0].date.toISOString());
    root.innerHTML = P.layout;
    root.querySelector('[data-gbgz-date]').textContent = dateLabel(posts[0].date);
    root.querySelector('[data-gbgz-title]').textContent = lead.title;
    var coverLink = root.querySelector('[data-gbgz-cover-link]');
    coverLink.href = lead.url; coverLink.textContent = 'Read the cover story →';
    root.querySelector('[data-gbgz-byline]').textContent = ' by ' + lead.author;
    var image = root.querySelector('[data-gbgz-image]');
    if (lead.image) {
      image.src = lead.image; image.removeAttribute('srcset'); image.removeAttribute('sizes');
      image.alt = lead.alt; image.width = 1600; image.height = 900;
      image.loading = 'eager'; image.setAttribute('fetchpriority', 'high');
    } else image.remove();
    var rows = root.querySelector('[data-gbgz-rows]');
    posts.slice(0, 12).forEach(function (p, i) {
      var t = document.createElement('template'); t.innerHTML = P.row;
      var row = t.content.firstElementChild;
      var a = row.querySelector('[data-gbgz-row-link]'); a.href = p.url; a.textContent = p.title;
      row.querySelector('[data-gbgz-row-meta]').textContent = p.author + ' · ' + dateLabel(p.date);
      row.querySelector('[data-gbgz-row-number]').textContent = String(i + 1).padStart(2, '0');
      rows.appendChild(row);
    });
    var more = document.createElement('a'); more.className = 'gbgz-more'; more.href = '/gatorbait-media-blogs'; more.textContent = 'All latest stories →'; rows.parentNode.appendChild(more);
    if (!document.getElementById('gbgz-styles')) {
      var style = document.createElement('style'); style.id = 'gbgz-styles'; style.textContent = P.css; document.head.appendChild(style);
    }
    var shell = document.getElementById('gbm-mobile-shell-host');
    if (shell && shell.parentNode) shell.parentNode.insertBefore(root, shell.nextSibling);
    else document.body.insertBefore(root, document.body.firstChild);
    doc.classList.add('gbm-gazette-live', 'gbm-standalone-live');
    loading = false;
    window.__GBM_GAZETTE_RUNTIME__.ready = true;
    if (window.__GBM_GAZETTE_BOOT__ && window.__GBM_GAZETTE_BOOT__.ready) window.__GBM_GAZETTE_BOOT__.ready();
    requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.remove('gbm-prepaint-v2'); }); });
    document.dispatchEvent(new CustomEvent('gbm:gazette-ready', { detail: { stories: posts.length, fresh: fresh } }));
  }
  function start() {
    if (!home() || loading || document.querySelector('#gbm-live.gbm-gazette')) return;
    loading = true;
    var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 2200);
    fetch(DATA, { signal: controller.signal, credentials: 'omit', cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Content response ' + r.status); return r.json();
    }).then(function (data) {
      var posts = normalize(data); if (posts.length < 3) throw new Error('Invalid current content');
      clearTimeout(timer); render(posts, true);
    }).catch(function () {
      clearTimeout(timer);
      try { render(normalize(P.fallback), false); } catch (error) { failure(error); }
    });
  }
  function sync() {
    if (!home()) {
      var root = document.querySelector('#gbm-live.gbm-gazette'); if (root) root.remove();
      doc.classList.remove('gbm-gazette-live', 'gbm-standalone-live');
      window.__GBM_GAZETTE_RUNTIME__.ready = false;
    } else start();
  }
  window.__GBM_GAZETTE_RUNTIME__ = { sync: sync, ready: false };
  window.addEventListener('popstate', sync);
  window.addEventListener('gbmroutechange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
