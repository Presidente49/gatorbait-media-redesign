/* GatorBait Story Kit 2026: keeps every story pointed back at the things we built here.
 * Drop-in module in the Share GatorBait style (sports-live/src/share.js); appended after it in both
 * sports-live/share.js (blog post pages) and sports-live/homepage.js. It runs ONLY on Wix blog post pages
 * (location.pathname starts with /post/) and does three reversible, DOM-only things:
 *   1. GatorBait Guide strip: one compact row right after the Share button (share.js's [data-share]):
 *      a live "Next: at No. 25 Missouri · Sat., Oct. 3 · 3:30 p.m. ET" chip and, after a final,
 *      "Last: W 52-28 vs. No. 4 Ole Miss" (both from sports-live/scoreboard.json, 3 s timeout, silent on
 *      failure), then Roster, Schedule, Stats, The Road Ahead, The Buddy Martin Show.
 *   2. First-mention links in the article body: the first plain-text "roster", "schedule", "depth chart",
 *      "stats"/"statistics" and the next opponent's name (with its nickname when it follows, e.g. "Missouri
 *      Tigers") become links to the same destinations. Whole words, case-insensitive, at most 5 per story.
 *   3. "Keep up with the Gators": three cards (Roster & Schedule, Florida Stats, The Road Ahead) after the
 *      last body paragraph.
 * Wix re-renders the post after hydration and drops early inserts, so a MutationObserver re-mounts what is
 * gone; every step is guarded by [data-story-kit] and never duplicates.
 * What it never does: it writes nothing to Wix, edits no article text (links wrap existing words in place),
 * never touches text inside existing links, headings, captions, bylines or quote attributions, and stays off
 * the homepage (#gbm-live) and every non-/post/ path.
 * Test hooks: window.__GBM_KIT__ {scoreboard, now} pre-seeds data; window.__GBM_KIT_RUNTIME__ exposes
 * {version, mount(), links}. */
(function () {
  'use strict';
  if (String(location.pathname).indexOf('/post/') !== 0) return;
  var VERSION = 'story-kit-2026.1';
  var PAGES = 'https://presidente49.github.io/gatorbait-media-redesign/';
  var SITE = 'https://www.gatorbaitmedia.com';
  var TZ = 'America/New_York';
  var GUIDE = SITE + '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play';
  var LINKS = { roster: GUIDE + '#roster', schedule: GUIDE + '#schedule', stats: SITE + '/florida-football-stats', road: SITE + '/#gbm-road', show: SITE + '/the-buddy-martin-show' };
  var NICK = { Missouri: 'Tigers', Georgia: 'Bulldogs', Texas: 'Longhorns', 'South Carolina': 'Gamecocks', Kentucky: 'Wildcats', Tennessee: 'Volunteers', LSU: 'Tigers', Auburn: 'Tigers', 'Ole Miss': 'Rebels', Vanderbilt: 'Commodores', 'Texas A&M': 'Aggies', Alabama: 'Crimson Tide', Arkansas: 'Razorbacks', 'Mississippi State': 'Bulldogs', Oklahoma: 'Sooners', 'Florida State': 'Seminoles' };
  var MAX_LINKS = 5;
  var CSS = '.gbm-kit{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;contain:inline-size;margin:10px 0 18px;padding:0;text-align:left;direction:ltr;font:15px/1.3 "Barlow","Barlow Condensed",sans-serif;color:#0021a5}' +
    '.gbm-kit-k{display:block;margin:0 0 6px;font:800 12px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fa4616}' +
    '.gbm-kit-row{display:flex;flex-wrap:nowrap;justify-content:flex-start;gap:8px;width:0;min-width:100%;max-width:100%;box-sizing:border-box;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 0 4px;margin:0;list-style:none}.gbm-kit-row::-webkit-scrollbar{display:none}' +
    '.gbm-kit-chip{display:inline-flex;flex:0 0 auto;align-items:center;min-height:44px;padding:0 14px;border:1px solid #0021a5;border-radius:999px;background:#fff;color:#0021a5;font:700 15px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;white-space:nowrap}' +
    '.gbm-kit-chip:hover,.gbm-kit-chip:focus-visible{background:#0021a5;color:#fff;outline:2px solid #fa4616;outline-offset:2px}' +
    '.gbm-kit-chip.lead{background:#fa4616;border-color:#fa4616;color:#fff;text-transform:none;letter-spacing:.02em;font-weight:800}.gbm-kit-chip.lead:hover,.gbm-kit-chip.lead:focus-visible{background:#0021a5;border-color:#0021a5}' +
    '.gbm-kit-chip.last{text-transform:none;letter-spacing:.02em}' +
    '@media(min-width:900px){.gbm-kit-row{flex-wrap:wrap;overflow:visible}}' +
    'a.gbm-kit-link,a.gbm-kit-link:visited{color:#0021a5;text-decoration:underline;text-decoration-color:#fa4616;text-decoration-thickness:2px;text-underline-offset:2px}a.gbm-kit-link:hover{color:#fa4616}' +
    '.gbm-kit-more{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;text-align:left;margin:28px 0 8px;padding:16px 0 0;border-top:3px solid #fa4616;font:15px/1.35 "Barlow","Barlow Condensed",sans-serif;color:#0021a5}' +
    '.gbm-kit-more h3{margin:0 0 12px;font:800 22px/1.1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#0021a5}' +
    '.gbm-kit-cards{display:grid;grid-template-columns:1fr;gap:10px}@media(min-width:700px){.gbm-kit-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}' +
    '.gbm-kit-card{display:flex;flex-direction:column;justify-content:center;gap:4px;box-sizing:border-box;min-height:64px;padding:12px 14px;border:1px solid #0021a5;border-left:6px solid #fa4616;border-radius:8px;background:#fff;color:#0021a5;text-decoration:none}' +
    '.gbm-kit-card b{font:800 18px/1.1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.03em;text-transform:uppercase}.gbm-kit-card span{font:500 14px/1.35 "Barlow",sans-serif;color:#1c2a5c}' +
    '.gbm-kit-card:hover,.gbm-kit-card:focus-visible{background:#0021a5;color:#fff;outline:2px solid #fa4616;outline-offset:2px}.gbm-kit-card:hover span,.gbm-kit-card:focus-visible span{color:#f3f5fa}';
  if (window.__GBM_KIT_RUNTIME__) { window.__GBM_KIT_RUNTIME__.mount(); return; }

  var seed = window.__GBM_KIT__ || {};
  var data = { scoreboard: seed.scoreboard || null }, loading = null;
  function now() { var t = Number(seed.now ? Date.parse(seed.now) : window.__GBM_FP_NOW__); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, attrs, html) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }
  function safePost(u) { try { var x = new URL(String(u), SITE); return /^(www\.)?gatorbaitmedia\.com$/.test(x.hostname) && x.pathname.indexOf('/post/') === 0 ? SITE + x.pathname : ''; } catch (_) { return ''; } }

  /* ---------- Time (America/New_York), AP style: "Sat., Oct. 3 · 3:30 p.m. ET" ---------- */
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var WDS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  function et(ms) {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false }).formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { wd: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], mo: Number(o.month) - 1, d: Number(o.day), h: Number(o.hour) % 24, m: Number(o.minute) };
  }
  function clock(ms) { var e = et(ms), h = e.h % 12 || 12; return h + (e.m ? ':' + String(e.m).padStart(2, '0') : '') + (e.h < 12 ? ' a.m.' : ' p.m.'); }
  function gameWhen(iso) { var t = Date.parse(iso); if (!Number.isFinite(t)) return ''; var e = et(t); return WDS[e.wd] + ', ' + MONTHS[e.mo] + ' ' + e.d + ' · ' + clock(t) + ' ET'; }
  function oppName(g) { return (g.opponentRank ? 'No. ' + g.opponentRank + ' ' : '') + g.opponent; }

  /* ---------- Data: the scoreboard feed the homepage uses, fetched once, silent on failure ---------- */
  function fetchJson(url, ms) {
    var ctl = 'AbortController' in window ? new AbortController() : null, timer = ctl && setTimeout(function () { ctl.abort(); }, ms);
    return fetch(url, { signal: ctl && ctl.signal, credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).finally(function () { if (timer) clearTimeout(timer); });
  }
  function load() {
    if (!loading) loading = data.scoreboard ? Promise.resolve() : fetchJson(PAGES + 'sports-live/scoreboard.json?t=' + Math.floor(now() / 60000), 3000).then(function (s) { data.scoreboard = s; }).catch(function () {});
    return loading;
  }
  // Next game: skipped once its kickoff is more than five hours gone (the feed refreshes it after the final).
  function nextGame() {
    var n = data.scoreboard && data.scoreboard.next, k = n && Date.parse(n.kickoffIso || n.kickoff);
    return n && n.opponent && Number.isFinite(k) && k + 5 * 36e5 > now() ? { name: oppName(n), opponent: String(n.opponent), home: n.home === true, when: gameWhen(n.kickoffIso || n.kickoff), tv: n.tv || '', url: safePost(n.previewUrl) || LINKS.schedule } : null;
  }
  function lastGame() {
    var l = data.scoreboard && data.scoreboard.last, s = l && l.score;
    return s && Number.isFinite(s.fla) && Number.isFinite(s.opp) && (!l.status || l.status === 'final') ? { line: (s.fla > s.opp ? 'W ' : s.fla < s.opp ? 'L ' : 'T ') + s.fla + '-' + s.opp + (l.home === true ? ' vs. ' : ' at ') + oppName(l), url: safePost(l.recapUrl) || LINKS.schedule } : null;
  }

  /* ---------- Where things live on a Wix post page ---------- */
  function shareButton() { return document.querySelector('#gbm-share-btn, [data-share="story"]'); }
  function textOf(n) { return String(n.textContent || '').replace(/\s+/g, ' ').trim(); }
  // The rich-content body: Wix's post-description hook first, then the older class, then the common ancestor of the article's paragraphs.
  function body() {
    if (document.getElementById('gbm-live')) return null;
    var b = document.querySelector('[data-hook="post-description"]') || document.querySelector('.blog-post-page-content, [data-hook="post-content"]');
    if (!b) {
      var ps = [].slice.call(document.querySelectorAll('article p, main p')).filter(function (p) { return textOf(p).length > 40 && !p.closest('[data-story-kit]'); });
      if (ps.length >= 2) { b = ps[0].parentNode; while (b && b !== document.body && !b.contains(ps[ps.length - 1])) b = b.parentNode; }
      if (b === document.body) b = null;
    }
    return b && b.querySelector('p') ? b : null;
  }
  function paragraphs(b) { return [].slice.call(b.querySelectorAll('p')).filter(function (p) { return textOf(p) && !p.closest('[data-story-kit]'); }); }

  /* ---------- 1. GatorBait Guide strip ---------- */
  function chip(cls, href, text, title) { return '<a class="gbm-kit-chip' + (cls ? ' ' + cls : '') + '" href="' + esc(href) + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + esc(text) + '</a>'; }
  function strip() {
    var s = el('nav', { 'class': 'gbm-kit', 'data-story-kit': 'strip', 'aria-label': 'GatorBait Guide' },
      '<span class="gbm-kit-k">GatorBait Guide</span><div class="gbm-kit-row">' + chip('', LINKS.roster, 'Roster') + chip('', LINKS.schedule, 'Schedule') + chip('', LINKS.stats, 'Stats') + chip('', LINKS.road, 'The Road Ahead') + chip('', LINKS.show, 'The Buddy Martin Show') + '</div>');
    return s;
  }
  // The live chips lead the row once the feed lands; nothing else in the row moves (it scrolls sideways on phones).
  function chips(s) {
    if (!data.scoreboard || s.getAttribute('data-kit-live')) return;
    var n = nextGame(), l = lastGame(), html = '';
    if (n) html += chip('lead', n.url, 'Next: ' + (n.home ? 'vs. ' : 'at ') + n.name + ' · ' + n.when, n.tv ? 'Florida ' + (n.home ? 'vs. ' : 'at ') + n.name + ', ' + n.when + ', ' + n.tv : '');
    if (l) html += chip('last', l.url, 'Last: ' + l.line);
    s.setAttribute('data-kit-live', n || l ? 'on' : 'none');
    if (html) s.querySelector('.gbm-kit-row').insertAdjacentHTML('afterbegin', html);
  }
  function mountStrip() {
    var btn = shareButton(), s = document.querySelector('[data-story-kit="strip"]');
    if (!btn) return; // the strip waits for share.js's button, which itself waits for Wix's post header
    if (!s) { s = strip(); btn.insertAdjacentElement('afterend', s); }
    else if (s.previousElementSibling !== btn) btn.insertAdjacentElement('afterend', s); // Wix re-rendered the header around it
    chips(s);
  }

  /* ---------- 2. First-mention links ---------- */
  var SKIP = 'a,h1,h2,h3,h4,h5,h6,figcaption,figure,cite,blockquote footer,button,code,pre,script,style,[data-story-kit],[data-hook*="user"],[data-hook*="byline"],[data-hook*="metadata"],[rel="author"]';
  function terms() {
    var t = [{ id: 'roster', re: 'roster', href: LINKS.roster }, { id: 'schedule', re: 'schedule', href: LINKS.schedule }, { id: 'depth-chart', re: 'depth\\s+chart', href: LINKS.roster }, { id: 'stats', re: 'stat(?:istic)?s', href: LINKS.stats }];
    var n = nextGame(), nick = n && NICK[n.opponent];
    if (n) t.push({ id: 'opponent', re: n.opponent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (nick ? '(?:\\s+' + nick + ')?' : ''), href: n.url });
    return t;
  }
  // Skips: anything already linked, headings, captions, quote attributions (cite/footer or a dash-led line) and bylines
  // (a short block that opens "By Buddy Martin"; "By the time…" is prose and stays eligible).
  function skippable(node, b) {
    var p = node.parentNode; if (!p || p.nodeType !== 1 || p.closest(SKIP)) return true;
    var block = p.closest('p,li,div,blockquote') || p;
    if (block !== b && /^(By\s+[A-Z]|[—–-]\s)/.test(textOf(block)) && textOf(block).length < 160) return true;
    return /^\s*[—–]/.test(node.nodeValue);
  }
  function textNodes(b) {
    var out = [], w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT, null, false), n;
    while ((n = w.nextNode())) if (/\S/.test(n.nodeValue) && !skippable(n, b)) out.push(n);
    return out;
  }
  function linkTerm(b, t) {
    var re = new RegExp('(^|[^A-Za-z0-9])(' + t.re + ')(?![A-Za-z0-9])', 'i'), nodes = textNodes(b);
    for (var i = 0; i < nodes.length; i++) {
      var m = re.exec(nodes[i].nodeValue); if (!m) continue;
      var start = m.index + m[1].length, mid = nodes[i].splitText(start); mid.splitText(m[2].length);
      var a = el('a', { 'class': 'gbm-kit-link', 'data-story-kit': 'link', 'data-term': t.id, href: t.href });
      mid.parentNode.insertBefore(a, mid); a.appendChild(mid);
      return true;
    }
    return false;
  }
  function mountLinks() {
    var b = body(); if (!b) return;
    // One sweep for the static terms; the opponent's name gets its own once the feed has landed ("static" -> "all"). After that
    // the body is left alone until Wix replaces the node, which clears the mark.
    var done = [].slice.call(b.querySelectorAll('a.gbm-kit-link')).map(function (a) { return a.getAttribute('data-term'); }), swept = b.getAttribute('data-story-kit-linked') || '';
    terms().forEach(function (t) {
      if (done.length >= MAX_LINKS || done.indexOf(t.id) >= 0) return;
      if (swept && (t.id !== 'opponent' || swept === 'all')) return;
      if (linkTerm(b, t)) done.push(t.id);
    });
    b.setAttribute('data-story-kit-linked', data.scoreboard ? 'all' : 'static');
  }

  /* ---------- 3. Keep up with the Gators ---------- */
  function card(href, title, blurb) { return '<a class="gbm-kit-card" href="' + esc(href) + '"><b>' + esc(title) + '</b><span>' + esc(blurb) + '</span></a>'; }
  function mountMore() {
    if (document.querySelector('[data-story-kit="more"]')) return;
    var b = body(); if (!b) return;
    var ps = paragraphs(b), last = ps[ps.length - 1]; if (!last) return;
    // Wix wraps each paragraph in its own block; land right after that block so the cards share the text column's gutters.
    if (last.parentNode && last.parentNode !== b && last.parentNode.children.length === 1) last = last.parentNode;
    var m = el('aside', { 'class': 'gbm-kit-more', 'data-story-kit': 'more', 'aria-label': 'Keep up with the Gators' },
      '<h3>Keep up with the Gators</h3><div class="gbm-kit-cards">' + card(LINKS.roster, 'Roster & Schedule', 'The 2026 season guide: who is on the field and who is next.') + card(LINKS.stats, 'Florida Stats', 'The numbers behind every Gators game, updated all season.') + card(LINKS.road, 'The Road Ahead', 'Results so far and the road to Atlanta, on the front page.') + '</div>');
    last.insertAdjacentElement('afterend', m);
  }

  /* ---------- Mount: idempotent, re-run by the observer whenever Wix re-renders ---------- */
  function mount() {
    if (document.getElementById('gbm-live')) return;
    if (!document.getElementById('gbm-story-kit-css')) document.head.appendChild(el('style', { id: 'gbm-story-kit-css' }, CSS));
    mountStrip(); mountLinks(); mountMore();
  }
  window.__GBM_KIT_RUNTIME__ = { version: VERSION, mount: mount, links: LINKS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
  load().then(mount);
  var tries = 0, retry = setInterval(function () { mount(); if (++tries > 16 || (document.querySelector('[data-story-kit="strip"]') && document.querySelector('[data-story-kit="more"]'))) clearInterval(retry); }, 500);
  if ('MutationObserver' in window) {
    var queued = false, mo = new MutationObserver(function () {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; mount(); });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
