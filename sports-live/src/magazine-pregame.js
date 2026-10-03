
  /* ================= Friday Pregame layout (issue.layout === 'pregame') =================
   * Same contract as the weekly layout: the issue JSON holds every word and number; this file only lays them out.
   * Helpers (esc, text, num, list, obj, safeUrl, media, picture, frame, credit) come from the runtime above. */
  var pgTimer = null;
  function pgCount(iso) {
    var t = Date.parse(iso || ''); if (!t) return '';
    var ms = t - Date.now(); if (ms <= 0) return 'Kickoff';
    var m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
    return (d ? d + 'd ' : '') + h + 'h ' + ('0' + mm).slice(-2) + 'm to kickoff';
  }
  function pgTick(root) {
    var iso = root.getAttribute('data-kickoff');
    root.querySelectorAll('[data-pg-count]').forEach(function (el) { el.textContent = pgCount(iso); });
  }
  function pgPrintInit(root) {
    if (root.__pgPrint) return; root.__pgPrint = 1;
    root.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-pg-print]') : null; if (!b) return; e.preventDefault();
      var im = root.querySelectorAll('img'); for (var i = 0; i < im.length; i++) { im[i].loading = 'eager'; }
      var dt = root.querySelectorAll('details'); for (var j = 0; j < dt.length; j++) { dt[j].open = true; }
      setTimeout(function () { window.print(); }, 350);
    });
  }
  function pgStart(root) {
    pgPrintInit(root); pgStop(); pgTick(root); pgTimer = setInterval(function () { if (!root.isConnected) { pgStop(); return; } pgTick(root); }, 30000);
  }
  function pgStop() { if (pgTimer) { clearInterval(pgTimer); pgTimer = null; } }
  function fx(n, d) { return typeof n === 'number' && isFinite(n) ? n.toFixed(d == null ? 1 : d) : ''; }
  function pgHeadSec(id, label, note) { return label ? '<div class="pg-sh"><h2 id="' + id + '-t">' + esc(label) + '</h2>' + (note ? '<p>' + esc(note) + '</p>' : '') + '</div>' : ''; }
  function pgSrc(s) { s = text(s, 160); return s ? '<p class="pg-src">' + esc(s) + '</p>' : ''; }

  function pgTop(D) {
    var G = obj(D.game) || {}, I = obj(D.issue) || {};
    return '<div class="pg-ticker"><span class="pg-live"><i aria-hidden="true"></i>' + esc(text(I.number, 60)) + '</span><span>' + esc(text(I.name, 60)) + '</span><span class="pg-ticker-c" data-pg-count>' + esc(pgCount(G.kickoffISO)) + '</span></div>';
  }
  function pgMast(D) {
    var I = obj(D.issue) || {};
    return '<header class="pg-mast"><div class="pg-mast-top"><span>' + esc(text(I.tagline, 120)) + '</span><span>' + esc(text(I.date, 60)) + '</span></div>' +
      '<svg class="pg-wm" viewBox="0 0 1000 246" role="img" aria-label="GatorBait Magazine" preserveAspectRatio="xMinYMin meet" focusable="false">' +
      '<text class="pg-wm-g" x="6" y="238" textLength="994" lengthAdjust="spacing">MAGAZINE</text>' +
      '<text class="pg-wm-o" x="0" y="232" textLength="994" lengthAdjust="spacing">MAGAZINE</text>' +
      '<text class="pg-wm-a" x="0" y="168" textLength="520" lengthAdjust="spacingAndGlyphs">GATOR</text>' +
      '<text class="pg-wm-b" x="540" y="168" textLength="460" lengthAdjust="spacingAndGlyphs">BAIT</text></svg>' +
      '<p class="pg-issue"><b>' + esc(text(I.number, 60)) + '</b><span>' + esc(text(I.week, 120)) + '</span></p><button type="button" class="pg-print" data-pg-print>Print the whole magazine</button></header>';
  }
  function pgCover(D) {
    var C = obj(D.cover); if (!C) return '';
    var hl = text(C.headline, 200); if (!hl) return '';
    var fig = frame(C.image, { eager: true, main: 1600, sizes: '(max-width: 900px) 100vw, 62vw' });
    return '<section class="pg-cover" id="pg-cover" aria-labelledby="pg-cover-h">' + (fig ? '<a class="pg-cover-fig" href="#pg-lead" tabindex="-1" aria-hidden="true">' + fig + '</a>' : '') +
      '<div class="pg-cover-type">' + (text(C.kicker, 80) ? '<span class="pg-kick">' + esc(text(C.kicker, 80)) + '</span>' : '') + '<h1 id="pg-cover-h"><a href="#pg-lead">' + esc(hl) + '</a></h1>' +
      (text(C.dek, 600) ? '<p class="pg-dek">' + esc(text(C.dek, 600)) + '</p>' : '') + (text(C.byline, 80) ? '<p class="pg-by">' + esc(text(C.byline, 80)) + '</p>' : '') +
      '<a class="pg-btn" href="#pg-lead">Read the column</a></div>' + (fig && C.image && text(C.image.credit, 160) ? '<p class="pg-cr">' + esc(text(C.image.credit, 160)) + '</p>' : '') + '</section>';
  }
  function pgGame(D) {
    var G = obj(D.game); if (!G) return '';
    var teams = list(G.teams, 2).map(obj).filter(Boolean); if (teams.length < 2) return '';
    var chips = list(G.chips, 4).map(obj).filter(function (c) { return c && text(c.k, 20) && text(c.v, 40); });
    var P = obj(G.predictor), f = P ? num(P.florida) : null, m = P ? num(P.missouri) : null;
    function team(t, cls) { return '<div class="pg-team ' + cls + '">' + (text(t.rank, 12) ? '<small>' + esc(text(t.rank, 12)) + '</small>' : '') + '<b>' + esc(text(t.name, 30)) + '</b><span class="pg-rec">' + esc(text(t.record, 12)) + '</span><em>' + esc(text(t.conf, 20)) + '</em></div>'; }
    return '<section class="pg-game" id="pg-game" aria-labelledby="pg-game-t"><div class="pg-game-top"><h2 id="pg-game-t">' + esc(text(G.label, 40)) + '</h2><b class="pg-count" data-pg-count>' + esc(pgCount(G.kickoffISO)) + '</b></div>' +
      '<div class="pg-teams">' + team(teams[0], 'pg-fla') + '<div class="pg-at" aria-hidden="true">at</div>' + team(teams[1], 'pg-miz') + '</div>' +
      '<p class="pg-when"><b>' + esc(text(G.kickoff, 60)) + '</b><span>' + esc(text(G.tv, 20)) + '</span><span>' + esc(text(G.venue, 120)) + '</span>' + (text(G.forecast, 120) ? '<span>' + esc(text(G.forecast, 120)) + '</span>' : '') + '</p>' +
      (chips.length ? '<ul class="pg-chips">' + chips.map(function (c) { return '<li><small>' + esc(text(c.k, 20)) + '</small><b>' + esc(text(c.v, 40)) + '</b></li>'; }).join('') + '</ul>' : '') +
      (f !== null && m !== null ? '<div class="pg-prob" role="img" aria-label="' + esc(text(P.label, 40) + ': Florida ' + fx(f) + ' percent, Missouri ' + fx(m) + ' percent') + '"><p>' + esc(text(P.label, 40)) + '</p><div class="pg-bar"><i style="width:' + fx(f) + '%"></i></div><div class="pg-prob-n"><b>Florida ' + fx(f) + '%</b><b>Missouri ' + fx(m) + '%</b></div></div>' : '') +
      pgSrc(G.source) + '</section>';
  }
  function pgSeries(D) {
    var S = obj(D.series), games = S ? list(S.games, 16).map(obj).filter(function (g) { return g && num(g.year) && num(g.fla) !== null && num(g.mizz) !== null; }) : [];
    if (!games.length) return '';
    var w = 0, l = 0;
    var tiles = games.map(function (g) { var win = g.fla > g.mizz; if (win) w++; else l++; return '<li class="' + (win ? 'pg-w' : 'pg-l') + '"><b>' + esc("’" + String(g.year).slice(2)) + '</b><span>' + g.fla + '-' + g.mizz + '</span><small>' + (g.site === 'H' ? 'Home' : 'Road') + '</small><i class="sr-only">' + (win ? 'Florida win' : 'Missouri win') + '</i></li>'; }).join('');
    return '<section class="pg-series" id="pg-series" aria-labelledby="pg-series-t">' + pgHeadSec('pg-series', text(S.label, 40), text(S.headline, 80)) + '<p class="pg-lede">' + esc(text(S.line, 300)) + '</p>' +
      '<ol class="pg-yrs">' + tiles + '</ol><p class="pg-tally"><b class="pg-w">Florida ' + w + '</b><b class="pg-l">Missouri ' + l + '</b></p>' + pgSrc(S.source) + '</section>';
  }
  function pgTape(D) {
    var T = obj(D.tape), rows = T ? list(T.rows, 12).map(obj).filter(function (r) { return r && num(r.fla) !== null && num(r.miz) !== null && text(r.label, 40); }) : [];
    if (!rows.length) return '';
    var body = rows.map(function (r) {
      var mx = Math.max(r.fla, r.miz) || 1, fw = Math.round(r.fla / mx * 1000) / 10, mw = Math.round(r.miz / mx * 1000) / 10;
      var fWin = r.lower ? r.fla < r.miz : r.fla > r.miz, mWin = r.lower ? r.miz < r.fla : r.miz > r.fla;
      return '<li class="pg-row"><b class="pg-row-l">' + esc(text(r.label, 40)) + '</b><div class="pg-rbars"><span class="pg-v' + (fWin ? ' pg-win' : '') + '">' + fx(r.fla) + '</span><div class="pg-half pg-hf"><i class="' + (fWin ? 'pg-win' : '') + '" style="width:' + fw + '%"></i></div><div class="pg-half pg-hm"><i class="' + (mWin ? 'pg-win' : '') + '" style="width:' + mw + '%"></i></div><span class="pg-v' + (mWin ? ' pg-win' : '') + '">' + fx(r.miz) + '</span></div></li>';
    }).join('');
    return '<section class="pg-tape" id="pg-tape" aria-labelledby="pg-tape-t">' + pgHeadSec('pg-tape', text(T.label, 40), text(T.note, 100)) + '<p class="pg-legend"><b class="pg-lf">Florida</b><b class="pg-lm">Missouri</b><small>Brighter bar = edge. Lower is better for points, yards allowed and penalties.</small></p><ul class="pg-rows">' + body + '</ul>' + pgSrc(T.source) + '</section>';
  }
  function pgKeys(D) {
    var K = obj(D.keys), items = K ? list(K.items, 6).map(obj).filter(function (k) { return k && text(k.h, 120) && text(k.p, 600); }) : [];
    if (!items.length) return '';
    return '<section class="pg-keys" id="pg-keys" aria-labelledby="pg-keys-t">' + pgHeadSec('pg-keys', text(K.label, 40)) + '<ol>' + items.map(function (k, i) {
      var u = safeUrl(k.url);
      return '<li><span class="pg-n" aria-hidden="true">' + (i + 1) + '</span><h3>' + esc(text(k.h, 120)) + '</h3><p>' + esc(text(k.p, 600)) + '</p>' + (u ? '<a class="pg-more" href="' + esc(u) + '">Read more</a>' : '') + '</li>';
    }).join('') + '</ol>' + pgSrc(K.source) + '</section>';
  }
  function pgInjuries(D) {
    var J = obj(D.injuries), teams = J ? list(J.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && list(t.items, 20).length; }) : [];
    if (!teams.length) return '';
    return '<section class="pg-inj" id="pg-injuries" aria-labelledby="pg-inj-t">' + pgHeadSec('pg-inj', text(J.label, 40), text(J.asOf, 200)) + '<div class="pg-inj-grid">' + teams.map(function (t) {
      return '<div><h3>' + esc(text(t.name, 30)) + '</h3><ul>' + list(t.items, 20).map(obj).filter(function (p) { return p && text(p.name, 60); }).map(function (p) {
        var st = text(p.status, 24);
        return '<li><i>' + esc(text(p.pos, 8)) + '</i><b>' + esc(text(p.name, 60)) + '</b>' + (st ? '<span class="pg-st" data-s="' + esc(st.toLowerCase()) + '">' + esc(st) + '</span>' : '') + (text(p.detail, 120) ? '<small>' + esc(text(p.detail, 120)) + '</small>' : '') + '</li>';
      }).join('') + '</ul></div>';
    }).join('') + '</div>' + pgSrc(J.source) + '</section>';
  }
  function pgWatch(D) {
    var W = obj(D.watch), items = W ? list(W.items, 8).map(obj).filter(function (i) { return i && text(i.k, 20) && text(i.v, 120); }) : [];
    if (!items.length) return '';
    var links = list(W.links, 4).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 60); });
    return '<section class="pg-watch" id="pg-watch" aria-labelledby="pg-watch-t">' + pgHeadSec('pg-watch', text(W.label, 40)) + '<dl>' + items.map(function (i) {
      return '<div><dt>' + esc(text(i.k, 20)) + '</dt><dd>' + esc(text(i.v, 120)) + '</dd></div>';
    }).join('') + '</dl>' + (links.length ? '<p class="pg-wl">' + links.map(function (l) { return '<a class="pg-more" href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 60)) + '</a>'; }).join('') + '</p>' : '') + pgSrc(W.source) + '</section>';
  }
  function pgRosters(D) {
    var R = obj(D.rosters), teams = R ? list(R.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && list(t.players, 160).length; }) : [];
    if (!teams.length) return '';
    var SIDES = [['offense', 'Offense'], ['defense', 'Defense'], ['specialTeam', 'Special teams']];
    return '<section class="pg-ros" id="pg-rosters" aria-labelledby="pg-ros-t">' + pgHeadSec('pg-ros', text(R.label, 40), text(R.note, 160)) + '<div class="pg-ros-grid">' + teams.map(function (t) {
      var ps = list(t.players, 160).map(obj).filter(function (p) { return p && text(p.name, 60); });
      var hurt = ps.filter(function (p) { return text(p.st, 20); }).length;
      return '<details class="pg-team"><summary><b>' + esc(text(t.name, 30)) + '</b><span>' + ps.length + ' players' + (hurt ? ' · ' + hurt + ' on the report' : '') + '</span></summary>' + SIDES.map(function (sd) {
        var grp = ps.filter(function (p) { return text(p.side, 20) === sd[0]; });
        if (!grp.length) return '';
        return '<h3>' + sd[1] + '</h3><ul>' + grp.map(function (p) {
          var st = text(p.st, 20);
          return '<li' + (st ? ' class="pg-hurt"' : '') + '><span class="pg-no">' + esc(text(p.n, 3)) + '</span><b>' + esc(text(p.name, 60)) + '</b><i>' + esc(text(p.pos, 6)) + '</i><small>' + esc(text(p.cls, 4)) + '</small>' + (st ? '<span class="pg-st" data-s="' + esc(st.toLowerCase()) + '">' + esc(st) + '</span>' : '') + '</li>';
        }).join('') + '</ul>';
      }).join('') + '</details>';
    }).join('') + '</div>' + pgSrc(R.source) + '</section>';
  }
  function pgLead(D) {
    var L = obj(D.lead); if (!L || !text(L.html, 20000)) return '';
    var url = safeUrl(L.url), fig = frame(L.image, { main: 1200, sizes: '(max-width: 900px) 100vw, 780px' });
    // html is trusted issue copy built from the canonical post (links already site-relative); keep only the tags the post uses.
    var clean = String(L.html).replace(/<(?!\/?(?:p|a|strong|em|blockquote|h3)\b)[^>]*>/gi, '').replace(/<a\b(?![^>]*href="\/)[^>]*>/gi, '<a>');
    return '<article class="pg-lead" id="pg-lead" aria-labelledby="pg-lead-h"><header><span class="pg-kick">' + esc(text(L.label, 40)) + ' · ' + esc(text(L.kicker, 80)) + '</span><h2 id="pg-lead-h">' + esc(text(L.title, 200)) + '</h2><p class="pg-by">By Franz Beard · ' + esc(text(L.date, 40)) + '</p></header>' +
      (fig ? '<figure class="pg-fig">' + fig + '<figcaption>' + esc(text(L.caption, 200)) + (L.image && text(L.image.credit, 160) ? ' <span>' + esc(text(L.image.credit, 160)) + '</span>' : '') + '</figcaption></figure>' : '') +
      '<div class="pg-prose">' + clean + '</div>' + (url ? '<a class="pg-btn" href="' + esc(url) + '">' + esc(text(L.continue, 160)) + '</a>' : '') + '</article>';
  }
  function pgSlate(D) {
    var S = obj(D.slate), games = S ? list(S.games, 12).map(obj).filter(function (g) { return g && obj(g.away) && obj(g.home) && text(g.pick, 40); }) : [];
    if (!games.length) return '';
    function side(t, pick) { var r = num(t.rank); return '<li class="' + (text(t.name, 40) === pick ? 'pg-picked' : '') + '"><span class="pg-rk">' + (r ? r : '') + '</span><b>' + esc(text(t.name, 40)) + '</b><span class="pg-rc">' + esc(text(t.rec, 12)) + '</span></li>'; }
    return '<section class="pg-slate" id="pg-slate" aria-labelledby="pg-slate-t">' + pgHeadSec('pg-slate', text(S.label, 40), text(S.note, 160)) + '<div class="pg-games">' + games.map(function (g) {
      return '<article class="pg-g' + (g.hero ? ' pg-hero' : '') + '"><p class="pg-gt"><b>' + esc(text(g.time, 20)) + '</b><span>' + esc(text(g.tv, 20)) + '</span></p><ul>' + side(g.away, text(g.pick, 40)) + side(g.home, text(g.pick, 40)) + '</ul>' +
        '<p class="pg-gl"><span>' + esc(text(g.line, 20)) + '</span><span>O/U ' + fx(num(g.ou)) + '</span></p><p class="pg-pick"><small>Soothsayer picks</small><b>' + esc(text(g.pick, 40)) + '</b>' + (text(g.note, 40) ? '<em>' + esc(text(g.note, 40)) + '</em>' : '') + '</p></article>';
    }).join('') + '</div>' + pgSrc(S.source) + '</section>';
  }
  function pgCards(D) {
    var C = obj(D.cards), items = C ? list(C.items, 9).map(obj).filter(function (c) { return c && safeUrl(c.url) && text(c.title, 200); }) : [];
    if (!items.length) return '';
    return '<section class="pg-cards" id="pg-more" aria-labelledby="pg-more-t">' + pgHeadSec('pg-more', text(C.label, 40)) + '<div class="pg-cgrid">' + items.map(function (c) {
      return '<a class="pg-card" href="' + esc(safeUrl(c.url)) + '">' + frame(c.image, { main: 800, sizes: '(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw' }) + '<span class="pg-kick">' + esc(text(c.kicker, 80)) + (text(c.date, 20) ? ' · ' + esc(text(c.date, 20)) : '') + '</span><h3>' + esc(text(c.title, 200)) + '</h3><p>' + esc(text(c.excerpt, 300)) + '</p>' + (c.image && text(c.image.credit, 160) ? '<small class="pg-cr">' + esc(text(c.image.credit, 160)) + '</small>' : '') + '<span class="pg-more">Read</span></a>';
    }).join('') + '</div></section>';
  }
  function pgShots(D) {
    var B = obj(D.shots), photos = B ? list(B.photos, 8).map(obj).filter(function (p) { return p && media(p); }) : [], url = B ? safeUrl(B.url) : '';
    if (!photos.length) return '';
    return '<section class="pg-shots" id="pg-shots" aria-labelledby="pg-shots-t">' + pgHeadSec('pg-shots', text(B.label, 40), text(B.note, 120)) + '<div class="pg-mosaic">' + photos.map(function (p, i) {
      var inner = frame(p, { main: 800, sizes: '(max-width: 599px) 50vw, 33vw' }) + (text(p.caption, 80) ? '<span>' + esc(text(p.caption, 80)) + '</span>' : '');
      return (url ? '<a class="pg-shot pg-s' + i + '" href="' + esc(url) + '">' : '<div class="pg-shot pg-s' + i + '">') + inner + (url ? '</a>' : '</div>');
    }).join('') + '</div><p class="pg-cr pg-cr-c">' + esc(text(B.credit, 120)) + '</p></section>';
  }
  function pgFoot(D) {
    var R = obj(D.reference), links = R ? list(R.links, 5).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 40); }) : [];
    return '<footer class="pg-foot"><h2>' + esc(text(R && R.label, 40)) + '</h2><nav aria-label="' + esc(text(R && R.label, 40)) + '">' + links.map(function (l) { return '<a href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 40)) + '</a>'; }).join('') + '<a href="https://www.youtube.com/@TheBuddyMartinShow/live">Watch The Buddy Martin Show live</a></nav>' + (R && text(R.next, 200) ? '<p>' + esc(text(R.next, 200)) + '</p>' : '') + '<p class="pg-src">' + esc(text(D.asOf, 240)) + '</p><a class="pg-top" href="#pg-cover">Back to top ↑</a></footer>';
  }
  function renderPregame(D) {
    return '<div class="pg-wrap">' + pgTop(D) + pgMast(D) + pgCover(D) + '<div class="pg-grid">' + pgGame(D) + pgSeries(D) + '</div>' + pgWatch(D) + pgTape(D) + pgKeys(D) + pgInjuries(D) + pgRosters(D) + pgLead(D) + pgSlate(D) + pgCards(D) + pgShots(D) + pgFoot(D) + '</div>';
  }
