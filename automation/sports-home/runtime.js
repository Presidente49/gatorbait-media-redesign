/* Original Gazette MIT (c) 2026 ondelva; GatorBait integration.
 * Layout and CSS packaged from the actual compiled original source.
 * License: /gatorbait-media-redesign/gazette-live/GAZETTE-LICENSE.txt
 */
(function () {
  'use strict';
  var P = __GAZETTE_PAYLOAD__;
  var DATA = '/blog-feed.xml';
  var doc = document.documentElement;
  function home() { return (location.pathname.replace(/\/+$/, '') || '/') === '/'; }
  if (window.__GBM_GAZETTE_RUNTIME__) { window.__GBM_GAZETTE_RUNTIME__.sync(); return; }
  var loading = false;
  function esc(v) { return String(v || '').replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
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
        excerpt: String(p.excerpt || ''), image: safeUrl(p.image && p.image.src, true), alt: String(p.image && p.image.alt || p.title),
        portrait: !!(p.image && Number(p.image.width) > 0 && Number(p.image.height) > Number(p.image.width)) };
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
    // Owner direction: newest Buddy column leads; supporting coverage rotates per visit.
    var lead = posts.find(function(p) { return /buddy martin/i.test(p.author); }) || posts[0];
    var others = posts.filter(function(p) { return p.url !== lead.url; });
    var pool = others.slice(0,6), turn = 0;
    try { turn = Number(sessionStorage.getItem('gbm-support-turn') || 0) || 0; sessionStorage.setItem('gbm-support-turn', String(turn + 1)); } catch (_) {}
    var offset = pool.length ? (turn * 2) % pool.length : 0;
    var supporting = pool.slice(offset).concat(pool.slice(0,offset)).slice(0,2);
    function link(p, content, cls) { return '<a class="' + (cls || '') + '" href="' + esc(p.url) + '">' + content + '</a>'; }
    function meta(p) { return '<p class="sh-meta">' + esc(p.author) + ' · ' + esc(dateLabel(p.date)) + '</p>'; }
    function photo(p, eager) { return p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"' + (eager ? ' fetchpriority="high"' : '') + '>' : ''; }
    function item(p) { return '<article class="sh-wire-item">' + meta(p) + link(p, '<h3>' + esc(p.title) + '</h3>') + '</article>'; }
    function support(p) { return '<article>' + link(p, photo(p, false) + meta(p) + '<h2>' + esc(p.title) + '</h2>') + '</article>'; }
    function column(name) { var p = posts.find(function(p) { return p.author.toLowerCase().indexOf(name.toLowerCase()) >= 0; }); return p ? '<article><p class="sh-kicker">' + esc(name) + '</p>' + link(p, '<h3>' + esc(p.title) + '</h3>') + meta(p) + '</article>' : ''; }
    var credit = /d3cfa5_d3190d83cdfc44549b10b6bd025e57a3/.test(lead.image) ? '<figcaption>Florida at Auburn · Photo: Chris Spears</figcaption>' : '';
    var root = document.createElement('div');
    root.id = 'gbm-live'; root.className = 'gbm-gazette gbm-sports-home'; root.setAttribute('data-theme', 'light');
    root.setAttribute('data-gazette-source', fresh ? 'current-feed' : 'last-known-feed');
    root.setAttribute('data-gazette-newest', posts[0].date.toISOString());
    root.innerHTML = '<a class="sh-skip" href="#sh-main">Skip to stories</a>' +
      '<header class="sh-header"><div class="sh-brand"><a href="/" aria-label="GatorBait home"><img src="https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp" alt="GatorBait"></a><p>Independent voices.<br><strong>Unmistakably GatorBait.</strong></p><a class="sh-join" href="/pricing-plans">Join GatorBait →</a></div><nav aria-label="GatorBait sections"><a href="/" aria-current="page">Front Page</a><a href="/gatorbait-media-blogs">Latest</a><a href="/magazine">Magazine</a><a href="/the-buddy-martin-show">GatorBait TV</a><a href="/the-buddy-martin-show#podcasts">Podcasts</a><a href="/#community">Message Board</a><a href="https://gatorbait2026.itemorder.com/shop/home/">Store</a><a href="/account/my-account">Sign in</a></nav></header>' +
      '<main id="sh-main"><div class="sh-edition"><span>FLORIDA GATORS · NEWS & OPINION</span><span id="sh-freshness">Updated ' + esc(dateLabel(posts[0].date)) + '</span></div>' +
      '<section class="sh-front" aria-label="Front page stories"><div class="sh-feature"><article class="sh-lead' + (lead.portrait ? ' sh-lead-portrait' : '') + '"><figure>' + link(lead, photo(lead,true)) + credit + '</figure><div class="sh-lead-copy"><p class="sh-kicker">' + (/buddy martin/i.test(lead.author) ? 'The Buddy Martin column' : 'The Big Read') + '</p>' + link(lead,'<h1>' + esc(lead.title) + '</h1>') + '<p class="sh-deck">' + esc(lead.excerpt) + '</p>' + meta(lead) + link(lead, 'Read the story <span aria-hidden="true">→</span>', 'sh-read') + '</div></article><div class="sh-support">' + supporting.map(support).join('') + '</div></div>' +
      '<aside class="sh-latest"><h2 class="sh-section-title">Latest</h2>' + others.slice(0,6).map(item).join('') + '<a class="sh-more" href="/gatorbait-media-blogs">All stories →</a></aside></section>' +
      '<section class="sh-voices" aria-label="GatorBait columnists"><div class="sh-voices-label"><p class="sh-kicker">Only at GatorBait</p><h2>The voices<br>you come for.</h2></div>' + column('Buddy Martin') + column('Franz Beard') + '</section>' +
      '<section class="sh-lower"><div><h2 class="sh-section-title">More from the newsroom</h2><div class="sh-coverage">' + others.slice(6,12).map(support).join('') + '</div></div><aside><div class="sh-magazine"><p class="sh-kicker">GatorBait Magazine</p><h2>Beyond the final score.</h2><p>The columns, characters and stories worth keeping.</p><a href="/magazine">Open the magazine →</a><a href="/pricing-plans">Explore membership →</a></div><div class="sh-watch"><p class="sh-kicker">Watch & Listen</p><h2>The Buddy Martin Show</h2><p>Gator conversation, from people who know the program.</p><a href="/the-buddy-martin-show">Watch GatorBait TV →</a><a href="/the-buddy-martin-show#podcasts">Listen to podcasts →</a></div><div class="sh-community" id="community"><p class="sh-kicker">The GatorBait community</p><h2>Keep the conversation going.</h2><p>The GatorBait Message Board is being prepared. Discussion is not open yet.</p></div></aside></section>' +
      '</main>';
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
    var initial = P.fallback, cached;
    try { cached = JSON.parse(sessionStorage.getItem('gbm-public-feed') || 'null'); if (cached && Date.now() - cached.saved < 900000 && normalize(cached.data).length >= 3 && normalize(cached.data)[0].date >= normalize(P.fallback)[0].date) initial = cached.data; } catch (_) {}
    try { render(normalize(initial), initial !== P.fallback); } catch (error) { failure(error); return; }
    // Paint bundled public headlines immediately. A feed refresh never moves a story under the reader.
    var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 2200);
    fetch(DATA, { signal: controller.signal, credentials: 'omit', cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Content response ' + r.status); return r.text().then(function(xml){
        var feed = new DOMParser().parseFromString(xml, 'text/xml');
        function text(n, key){var el=Array.from(n.children).find(function(c){return c.localName===key;});return el?el.textContent.trim():'';}
        return {posts:Array.from(feed.querySelectorAll('item')).map(function(n){var enc=n.querySelector('enclosure');return {title:text(n,'title'),excerpt:text(n,'description'),author:text(n,'creator'),url:text(n,'link'),firstPublishedDate:text(n,'pubDate'),image:{src:enc?enc.getAttribute('url'):'',alt:text(n,'title')}};})};
      });
    }).then(function (data) {
      var posts = normalize(data); if (posts.length < 3) throw new Error('Invalid current content');
      clearTimeout(timer);
      try { sessionStorage.setItem('gbm-public-feed', JSON.stringify({saved: Date.now(), data: data})); } catch (_) {}
      var root = document.getElementById('gbm-live');
      if (root && posts[0].date.toISOString() !== root.getAttribute('data-gazette-newest')) {
        var freshness = document.getElementById('sh-freshness');
        if (freshness) { freshness.textContent = ''; var a = document.createElement('a'); a.href = '/'; a.textContent = 'New stories available — refresh'; a.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); location.reload(); }); freshness.appendChild(a); }
      } else if (root) root.setAttribute('data-gazette-source','current-feed');
    }).catch(function () { clearTimeout(timer); });
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
