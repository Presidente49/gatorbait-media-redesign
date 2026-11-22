/* GatorBait front page: live Top 25 scoreboard with the Gators game on top (owner direction, Nov. 21, 2026:
 * "a front page that is interactive and constantly has a score update").
 *
 * One self-contained file, no dependencies, loaded by the small loader embed pinned to a commit. It does three things:
 *   1. Mounts a panel between the header and #sh-main, only on the front page ("/"), and only while there is something to show
 *      (a game in progress, a kickoff within the day, or a final from the last 14 hours). On other days it stays out of the way.
 *   2. Reads ESPN's public college football header scoreboard (the same feed the site already uses), which carries every ranked
 *      game: rank, score, clock, TV, line, ESPN link. Nothing else is read and nothing is written anywhere.
 *   3. Keeps itself fresh: every 20 seconds while a game is live or about to start, every minute on a slate day, every five
 *      minutes otherwise; it pauses in a hidden tab and catches up the moment the tab is back.
 * Interaction: tabs (All, Live, Final), tap a game for the line, TV, venue and the ESPN link, a flash on every score change.
 * Style: Barlow only, scoped under #gbm-lsb, no images except ESPN team logos (hidden if they fail).
 * No jump (Nov. 21, 2026): the panel is inserted in the same frame in which #sh-main first appears, from ESPN's answer (the fetch starts the
 * moment this file loads) or, failing that, from the last slate saved in localStorage, so nothing already on screen is pushed down. Only a first
 * visit on which ESPN answers later than the page builds still moves content once (and then the scroll position is kept for a reader who scrolled).
 * Failure is quiet: if ESPN cannot be reached the last good scores stay up with a "reconnecting" note, and if nothing was ever
 * read the panel is not drawn. Rankings are the College Football Playoff rankings as ESPN lists them. Stats: ESPN only. */
(function () {
  'use strict';
  if (window.__GBM_LSB__) return;
  window.__GBM_LSB__ = { v: 1 };

  var HOSTS = ['https://site.web.api.espn.com', 'https://site.api.espn.com'];
  var PATH = '/apis/v2/scoreboard/header?sport=football&league=college-football&limit=100';
  var FLA = '57', ID = 'gbm-lsb', HOUR = 3600000;
  var S = { events: [], tab: 'all', more: 0, open: {}, last: {}, flash: {}, fail: 0, at: 0, root: null, html: '', timer: 0, busy: 0, seen: 0 };

  var CK = 'gbm_lsb_v1';
  function trim(e) {
    var f = e.fullStatus && e.fullStatus.type || {}, o = e.odds || {};
    return { id: e.id, date: e.date, status: e.status, broadcast: e.broadcast, location: e.location, link: e.link, odds: { details: o.details, overUnder: o.overUnder },
      fullStatus: { type: { shortDetail: f.shortDetail, detail: f.detail } },
      competitors: (e.competitors || []).map(function (c) { return { id: c.id, homeAway: c.homeAway, rank: c.rank, location: c.location, displayName: c.displayName, score: c.score, winner: c.winner }; }) };
  }
  function saveCache(events) {
    try { localStorage.setItem(CK, JSON.stringify({ at: Date.now(), events: events.filter(function (e) { return inWindow(e, Date.now()); }).map(trim) })); } catch (_) {}
  }
  function loadCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CK) || 'null');
      if (c && Array.isArray(c.events) && c.events.length && Date.now() - c.at < 12 * HOUR) { S.events = c.events; S.cacheAt = c.at; }
    } catch (_) {}
  }

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onHome() { return /^\/?$/.test(location.pathname || '/'); }
  function side(e, ha) { var c = e.competitors || []; for (var i = 0; i < c.length; i++) if (c[i].homeAway === ha) return c[i]; return null; }
  function num(v) { var n = parseInt(v, 10); return isNaN(n) ? null : n; }
  function when(e) { return Date.parse(e.date); }

  // A game is worth showing while it is live, starts within the day, or ended within the last 14 hours.
  function inWindow(e, now) {
    var t = when(e); if (isNaN(t)) return false;
    if (e.status === 'in') return true;
    if (e.status === 'pre') return t - now < 20 * HOUR && now - t < 3 * HOUR;
    if (e.status === 'post') return now - t < 14 * HOUR;
    return false;
  }
  function isFla(e) { var a = side(e, 'away'), h = side(e, 'home'); return !!((a && String(a.id) === FLA) || (h && String(h.id) === FLA)); }
  function bestRank(e) { var r = 99; (e.competitors || []).forEach(function (c) { var n = num(c.rank); if (n && n < r) r = n; }); return r; }

  // 12:00 p.m. is "noon"; ":00" is dropped, as in AP style.
  function clock(ms) {
    var h, m, s;
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(new Date(ms)).forEach(function (x) {
        if (x.type === 'hour') h = x.value; else if (x.type === 'minute') m = x.value; else if (x.type === 'dayPeriod') s = x.value.toLowerCase();
      });
    } catch (_) { return ''; }
    if (!h) return '';
    if (h === '12' && m === '00' && s === 'pm') return 'noon ET';
    return h + (m === '00' ? '' : ':' + m) + ' ' + (s === 'am' ? 'a.m.' : 'p.m.') + ' ET';
  }
  function status(e, now) {
    var f = e.fullStatus && e.fullStatus.type || {}, t = when(e);
    if (e.status === 'in') return { k: 'in', t: f.shortDetail || 'Live' };
    if (e.status === 'post') return { k: 'post', t: /final/i.test(f.shortDetail || '') ? f.shortDetail : (f.shortDetail || 'Final') };
    var d = t - now;
    if (d > 0 && d < 90 * 60000) return { k: 'pre', t: 'Kickoff in ' + Math.max(1, Math.round(d / 60000)) + ' min' };
    var ds = new Date(t), today = new Date(now), tag = '';
    try {
      var f2 = function (x) { return new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric' }).format(x); };
      tag = f2(ds) === f2(today) ? '' : new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short' }).format(ds) + ' ';
    } catch (_) { tag = ''; }
    return { k: 'pre', t: tag + clock(t) };
  }

  function logo(c) {
    return '<img class="lg" alt="" width="22" height="22" loading="lazy" src="https://a.espncdn.com/i/teamlogos/ncaa/500/' + esc(c.id) + '.png" onerror="this.style.display=\'none\'">';
  }
  function team(e, c) {
    if (!c) return '';
    var live = e.status !== 'pre', sc = live ? esc(c.score === '' ? '0' : c.score) : '', r = num(c.rank);
    return '<span class="tm' + (c.winner ? ' w' : '') + '">' + logo(c) + (r ? '<i class="rk">' + r + '</i>' : '') + '<span class="nm">' + esc(c.location || c.displayName) + '</span><b class="sc">' + sc + '</b></span>';
  }
  function details(e) {
    var o = e.odds || {}, bits = [];
    if (o.details) bits.push('<span><em>Line</em> ' + esc(o.details) + (o.overUnder ? ' &middot; O/U ' + esc(o.overUnder) : '') + '</span>');
    if (e.broadcast) bits.push('<span><em>TV</em> ' + esc(e.broadcast) + '</span>');
    if (e.location) bits.push('<span><em>Where</em> ' + esc(e.location) + '</span>');
    var f = e.fullStatus && e.fullStatus.type || {};
    if (e.status === 'in' && f.detail) bits.push('<span><em>Now</em> ' + esc(f.detail) + '</span>');
    var links = '';
    if (/^https:\/\/www\.espn\.com\//.test(e.link || '')) links += '<a href="' + esc(e.link) + '" target="_blank" rel="noopener">Gamecast on ESPN</a>';
    if (isFla(e)) links += '<a href="/magazine">' + (e.status === 'post' ? 'Postgame magazine' : 'Game day magazine') + '</a><a href="/roster">Roster</a>';
    return '<div class="dt">' + bits.join('') + '<span class="lk">' + links + '</span></div>';
  }

  function hero(e, now) {
    var a = side(e, 'away'), h = side(e, 'home'), st = status(e, now);
    return '<section class="hero ' + st.k + (S.flash[e.id] ? ' fl' : '') + '" aria-label="Florida game">' +
      '<div class="hk"><b>The Gators</b>' + (st.k === 'in' ? '<span class="dot" aria-hidden="true"></span>' : '') + '<span class="hs" aria-live="polite">' + esc(st.t) + '</span></div>' +
      '<div class="hb"><div class="hteams">' + team(e, a) + team(e, h) + '</div>' + details(e) + '</div></section>';
  }
  function row(e, now) {
    var a = side(e, 'away'), h = side(e, 'home'), st = status(e, now), id = esc(e.id), open = !!S.open[e.id];
    return '<li class="g ' + st.k + (S.flash[e.id] ? ' fl' : '') + '"><button type="button" class="gb" data-k="' + id + '" aria-expanded="' + open + '" aria-controls="lsb-' + id + '">' +
      '<span class="gt">' + team(e, a) + team(e, h) + '</span><span class="gs">' + (st.k === 'in' ? '<span class="dot" aria-hidden="true"></span>' : '') + esc(st.t) + '</span></button>' +
      '<div class="gd" id="lsb-' + id + '"' + (open ? '' : ' hidden') + '>' + details(e) + '</div></li>';
  }

  function slate(now) { return S.events.filter(function (e) { return inWindow(e, now); }); }
  function order(a, b) {
    var rank = { 'in': 0, pre: 1, post: 2 }, d = rank[a.status] - rank[b.status];
    if (d) return d;
    if (a.status === 'in') return bestRank(a) - bestRank(b);
    if (a.status === 'pre') return when(a) - when(b) || bestRank(a) - bestRank(b);
    return when(b) - when(a);
  }

  function build() {
    var now = Date.now(), all = slate(now), fla = null, rest = [], n = { all: 0, live: 0, final: 0 }, i;
    for (i = 0; i < all.length; i++) {
      if (!fla && isFla(all[i])) fla = all[i]; else rest.push(all[i]);
    }
    rest.sort(order);
    rest.forEach(function (e) { n.all++; if (e.status === 'in') n.live++; if (e.status === 'post') n.final++; });
    var match = rest.filter(function (e) { return S.tab === 'all' || (S.tab === 'live' && e.status === 'in') || (S.tab === 'final' && e.status === 'post'); });
    var CAP = window.innerWidth < 700 ? 3 : 6, shown = S.more ? match : match.slice(0, CAP);
    var anyLive = all.some(function (e) { return e.status === 'in'; });
    var upd = S.at ? new Date(S.at).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', second: '2-digit' }) : '';
    var note = S.fail >= 2 ? 'Reconnecting to ESPN. Showing the last scores we have.' : (!S.at && S.cacheAt ? 'Checking ESPN for the latest scores.' : 'Updates by itself. Last checked ' + esc(upd) + ' ET.');
    var tabs = [['all', 'All ranked games', n.all], ['live', 'Live now', n.live], ['final', 'Final', n.final]].map(function (t) {
      return '<button type="button" class="tb" data-tab="' + t[0] + '" aria-pressed="' + (S.tab === t[0]) + '">' + t[1] + ' <i>' + t[2] + '</i></button>';
    }).join('');
    return '<div class="w"><div class="hd"><b class="tag">' + (anyLive ? '<span class="dot" aria-hidden="true"></span>Live' : 'Scores') + '</b><h2>Top 25 scoreboard</h2><span class="up">' + note + '</span></div>' +
      (fla ? hero(fla, now) : '') +
      '<div class="tbs" role="group" aria-label="Filter games">' + tabs + '</div>' +
      (shown.length ? '<ul class="gl">' + shown.map(function (e) { return row(e, now); }).join('') + '</ul>' : '<p class="em">' + (S.tab === 'live' ? 'No ranked game is in progress right now.' : S.tab === 'final' ? 'No ranked game has finished yet.' : 'No other ranked games on the slate.') + '</p>') +
      (match.length > CAP ? '<div class="mw"><button type="button" class="mr" data-more="1" aria-expanded="' + !!S.more + '">' + (S.more ? 'Show fewer games' : 'Show all ' + match.length + ' games') + '</button></div>' : '') +
      '<p class="ft">Scores and lines: ESPN. Rankings: College Football Playoff. Tap a game for details.</p></div>';
  }

  var CSS = '#gbm-lsb{max-width:1240px;margin:0 auto;padding:14px 16px 4px;box-sizing:border-box;font:500 15px/1.35 Barlow,Arial,sans-serif;color:#10233f}' +
    '@media(min-width:900px){#gbm-lsb{padding:18px 28px 6px}}' +
    '#gbm-lsb *{box-sizing:border-box;font-family:Barlow,Arial,sans-serif}' +
    '#gbm-lsb .w{background:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(11,31,75,.08);overflow:hidden}' +
    '#gbm-lsb .hd{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;padding:12px 16px;background:#081b35;border-bottom:3px solid #fa4616}' +
    '#gbm-lsb .hd h2{margin:0;padding:0;font:800 20px/1 "Barlow Condensed",Barlow,Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#fff!important;-webkit-text-fill-color:#fff!important;background:none!important}' +
    '#gbm-lsb .tag{display:inline-flex;align-items:center;gap:6px;background:#fa4616;color:#fff;padding:4px 8px;font:800 12px/1 Barlow,Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}' +
    '#gbm-lsb .up{margin-left:auto;font:600 12px/1.2 Barlow,Arial,sans-serif;color:#c3cde2}' +
    '#gbm-lsb .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#fa4616;animation:lsbp 1.4s ease-in-out infinite}' +
    '#gbm-lsb .tag .dot{background:#fff}' +
    '@keyframes lsbp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}' +
    '@keyframes lsbf{0%{background-color:#ffe3d6}100%{background-color:transparent}}' +
    '#gbm-lsb .hero{margin:14px 16px 0;padding:14px 16px 16px;border-radius:12px;background:linear-gradient(135deg,#0021a5 0%,#081b35 100%);color:#fff}' +
    '#gbm-lsb .hk{display:flex;align-items:center;gap:10px;margin-bottom:10px}' +
    '#gbm-lsb .hk b{font:800 13px/1 Barlow,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#ffb38f}' +
    '#gbm-lsb .hs{margin-left:auto;font:800 15px/1 Barlow,Arial,sans-serif;letter-spacing:.04em;color:#fff}' +
    '#gbm-lsb .hero.in .hs{color:#ffb38f}' +
    '#gbm-lsb .hb{display:grid;gap:12px}' +
    '@media(min-width:760px){#gbm-lsb .hb{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:center;gap:24px}}' +
    '#gbm-lsb .hero .tm{display:flex;align-items:center;gap:10px;padding:5px 0;color:#fff}' +
        '#gbm-lsb .hero .rk{background:#fa4616;color:#fff}' +
    '#gbm-lsb .hero .nm{flex:1;min-width:0;font:800 24px/1.05 "Barlow Condensed",Barlow,Arial,sans-serif;letter-spacing:.02em;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#gbm-lsb .hero .sc{font:800 44px/1 "Barlow Condensed",Barlow,Arial,sans-serif;font-variant-numeric:tabular-nums;min-width:1.2em;text-align:right}' +
    '#gbm-lsb .hero .tm:not(.w) .sc{opacity:.95}' +
    '#gbm-lsb .hero.post .tm:not(.w){opacity:.72}' +
    '#gbm-lsb .hero .dt{color:#dbe3f5;font:500 14px/1.4 Barlow,Arial,sans-serif}' +
    '#gbm-lsb .hero .dt a{color:#fff;border-color:#ffffff66}' +
    '#gbm-lsb .hero .dt em{color:#ffb38f}' +
    '#gbm-lsb .hero.fl{animation:lsbh 2.4s ease-out 1}@keyframes lsbh{0%{box-shadow:0 0 0 0 #fa4616}60%{box-shadow:0 0 0 10px #fa461600}100%{box-shadow:none}}' +
    '#gbm-lsb .tbs{display:flex;flex-wrap:wrap;gap:8px;padding:14px 16px 0}' +
    '#gbm-lsb .tb{appearance:none;cursor:pointer;border:1px solid #cfd8ea;background:#fff;color:#10233f;padding:9px 14px;border-radius:999px;font:700 13px/1 Barlow,Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase}' +
    '#gbm-lsb .tb i{font-style:normal;background:#eef2fa;border-radius:999px;padding:2px 7px;margin-left:4px;font-size:12px}' +
    '#gbm-lsb .tb[aria-pressed=true]{background:#0021a5;border-color:#0021a5;color:#fff}#gbm-lsb .tb[aria-pressed=true] i{background:#ffffff26;color:#fff}' +
    '#gbm-lsb .gl{list-style:none;margin:0;padding:12px 16px 4px;display:grid;gap:10px;grid-template-columns:minmax(0,1fr)}' +
    '@media(min-width:700px){#gbm-lsb .gl{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
    '@media(min-width:1100px){#gbm-lsb .gl{grid-template-columns:repeat(3,minmax(0,1fr))}}' +
    '#gbm-lsb .g{margin:0;padding:0;border:1px solid #dfe5f0;border-radius:10px;background:#fff;overflow:hidden}' +
    '#gbm-lsb .g.in{border-left:4px solid #fa4616;background:#fff8f4}' +
    '#gbm-lsb .g.fl{animation:lsbf 6s ease-out 1}' +
    '#gbm-lsb .gb{appearance:none;display:flex;align-items:center;gap:10px;width:100%;margin:0;padding:10px 12px;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit}' +
    '#gbm-lsb .gt{flex:1;min-width:0;display:grid;gap:2px}' +
    '#gbm-lsb .g .tm{display:flex;align-items:center;gap:8px;min-width:0;color:#10233f}' +
    '#gbm-lsb .g .tm.w{font-weight:800}#gbm-lsb .g.post .tm:not(.w){color:#5b6882}' +
    '#gbm-lsb .rk{flex:none;min-width:22px;padding:2px 4px;border-radius:4px;background:#e7ecf8;color:#0021a5;font:800 12px/1.1 Barlow,Arial,sans-serif;font-style:normal;text-align:center}' +
    '#gbm-lsb .nm{flex:1;min-width:0;font:700 16px/1.2 Barlow,Arial,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#gbm-lsb .g .sc{font:800 20px/1 "Barlow Condensed",Barlow,Arial,sans-serif;font-variant-numeric:tabular-nums;min-width:1.4em;text-align:right}' +
    '#gbm-lsb .lg{flex:none!important;width:22px!important;height:22px!important;min-width:22px!important;max-width:22px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;object-fit:contain!important;box-shadow:none!important}' +
    '#gbm-lsb .hero .lg{width:36px!important;height:36px!important;min-width:36px!important;max-width:36px!important}' +
    '#gbm-lsb .tm>*{flex:none}#gbm-lsb .tm>.nm{flex:1 1 0!important}' +
    '#gbm-lsb .mw{padding:6px 16px 0;text-align:center}#gbm-lsb .mr{appearance:none;cursor:pointer;border:1px solid #0021a5;background:#fff;color:#0021a5;padding:11px 20px;border-radius:999px;font:800 13px/1 Barlow,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}#gbm-lsb .mr:hover{background:#0021a5;color:#fff}' +
    '#gbm-lsb .gs{flex:none;display:flex;align-items:center;gap:6px;max-width:42%;text-align:right;font:700 12px/1.25 Barlow,Arial,sans-serif;letter-spacing:.04em;color:#5b6882}' +
    '#gbm-lsb .g.in .gs{color:#c2410c}' +
    '#gbm-lsb .gd{padding:0 12px 12px}#gbm-lsb .gd[hidden]{display:none}' +
    '#gbm-lsb .dt{display:flex;flex-wrap:wrap;gap:4px 14px;font:500 13.5px/1.4 Barlow,Arial,sans-serif;color:#33425e}' +
    '#gbm-lsb .dt em{font-style:normal;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:11.5px;color:#0021a5;margin-right:2px}' +
    '#gbm-lsb .lk{flex-basis:100%;display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:6px}' +
    '#gbm-lsb .lk a,#gbm-lsb .dt a{color:#0021a5;font-weight:700;text-decoration:none;border-bottom:2px solid #fa4616}' +
    '#gbm-lsb .em{margin:0;padding:18px 16px 6px;color:#5b6882}' +
    '#gbm-lsb .ft{margin:0;padding:6px 16px 14px;font:500 12px/1.4 Barlow,Arial,sans-serif;color:#6b7893}' +
    '#gbm-lsb button:focus-visible,#gbm-lsb a:focus-visible{outline:3px solid #fa4616;outline-offset:2px}' +
    '@media(prefers-reduced-motion:reduce){#gbm-lsb *{animation:none!important}}';

  function paint() {
    if (!S.root) return;
    var active = document.activeElement, key = active && S.root.contains(active) ? (active.getAttribute('data-k') || active.getAttribute('data-tab') || (active.hasAttribute('data-more') ? 'more' : null)) : null;
    var html = build();
    if (html === S.html) return;
    S.html = html;
    S.root.innerHTML = '<style>' + CSS + '</style>' + html;
    if (key) { var again = S.root.querySelector('[data-k="' + key + '"],[data-tab="' + key + '"]') || (key === 'more' ? S.root.querySelector('[data-more]') : null); if (again && again.focus) again.focus({ preventScroll: true }); }
  }

  function visible() { return slate(Date.now()).length > 0 && S.events.length > 0; }

  function ensure() {
    if (!onHome()) { if (S.root && S.root.parentNode) S.root.parentNode.removeChild(S.root); return; }
    var main = document.getElementById('sh-main');
    if (!main || !main.parentNode) return;
    if (!visible()) { if (S.root && S.root.parentNode) S.root.parentNode.removeChild(S.root); return; }
    if (!S.root) {
      S.root = document.createElement('section');
      S.root.id = ID;
      S.root.setAttribute('aria-label', 'Live college football scoreboard');
      S.root.addEventListener('click', function (ev) {
        var t = ev.target.closest ? ev.target.closest('[data-tab],[data-k],[data-more]') : null;
        if (!t) return;
        if (t.hasAttribute('data-more')) { S.more = S.more ? 0 : 1; }
        else if (t.getAttribute('data-tab')) { S.tab = t.getAttribute('data-tab'); S.more = 0; }
        else { var k = t.getAttribute('data-k'); S.open[k] = !S.open[k]; }
        paint();
      });
    }
    if (!S.root.isConnected || S.root.nextElementSibling !== main) {
      var y0 = window.pageYOffset || 0, was = main.getBoundingClientRect().top;
      main.parentNode.insertBefore(S.root, main);
      paint();
      if (y0 > 40) { var moved = main.getBoundingClientRect().top - was; if (moved > 0) window.scrollBy(0, moved); }
      return;
    }
    paint();
  }

  function remember(events) {
    events.forEach(function (e) {
      var a = side(e, 'away'), h = side(e, 'home'), sig = (a ? a.score : '') + '-' + (h ? h.score : '');
      if (S.last[e.id] !== undefined && S.last[e.id] !== sig && e.status === 'in') {
        S.flash[e.id] = 1; (function (id) { setTimeout(function () { delete S.flash[id]; S.html = ''; paint(); }, 6500); })(e.id);
      }
      S.last[e.id] = sig;
    });
  }

  function get(i) {
    var ac = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (ac) ac.abort(); }, 8000);
    var bucket = Math.floor(Date.now() / 15000);
    return fetch(HOSTS[i] + PATH + '&_=' + bucket, { cache: 'no-store', signal: ac ? ac.signal : undefined })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        var lg = j && j.sports && j.sports[0] && j.sports[0].leagues && j.sports[0].leagues[0];
        if (!lg || !Array.isArray(lg.events)) throw 0;
        return lg.events;
      })
      .then(function (v) { clearTimeout(tm); return v; }, function () { clearTimeout(tm); return i < HOSTS.length - 1 ? get(i + 1) : null; });
  }

  function delay() {
    var now = Date.now(), live = false, soon = false, pre = false;
    slate(now).forEach(function (e) {
      if (e.status === 'in') live = true;
      else if (e.status === 'pre') { pre = true; if (when(e) - now < 25 * 60000) soon = true; }
    });
    if (document.hidden) return 60000;
    if (live || soon) return 20000;
    return pre ? 60000 : 300000;
  }

  function poll() {
    clearTimeout(S.timer);
    if (S.busy) return;
    if (!onHome()) { S.timer = setTimeout(poll, 30000); return; }
    if (document.hidden && S.seen) { S.timer = setTimeout(poll, 30000); return; }
    S.busy = 1;
    get(0).then(function (events) {
      S.busy = 0; S.seen = 1;
      if (events) { S.fail = 0; S.at = Date.now(); remember(events); S.events = events; saveCache(events); }
      else S.fail++;
      ensure();
      S.timer = setTimeout(poll, events ? delay() : Math.min(120000, 20000 * (S.fail + 1)));
    });
  }

  loadCache();
  try {
    var mo = new MutationObserver(function () { if (!S.root || !S.root.isConnected) ensure(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 60000);
  } catch (_) {}
  ensure();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { clearTimeout(S.timer); poll(); } });
  setInterval(function () { ensure(); }, 1500);
  setInterval(function () { if (S.root && S.root.isConnected) { S.html = ''; paint(); } }, 30000);
  poll();
})();
