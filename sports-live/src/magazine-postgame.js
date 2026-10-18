  /* ================= Postgame layout (issue.layout === 'postgame') =================
   * Same contract as the weekly and pregame layouts: sports-live/magazine-issue-postgame.json holds every word and
   * number; this file only lays them out, and a missing or empty block renders nothing. Helpers (esc, text, num, list,
   * obj, safeUrl, media, frame) come from src/magazine.js. Bundled only into sports-live/magazine-postgame.js
   * (MAG_VARIANT=postgame), together with src/capture.js for the signup. No timers, no feed swap: the lead is curated
   * (Buddy Martin) and stays put. The portrait entrance animates only after activation. */
  function pmEntrance(D) {
    var C = obj(D.cover) || {}, I = obj(D.issue) || {};
    return '<section class="pm-entrance" aria-label="Magazine cover"><a class="pm-exit" href="/">← GatorBait Media</a><div class="pm-book"><div class="pm-poster">' +
      frame(C.image, { eager: true, main: 1200, sizes: '(max-width: 699px) 100vw, 460px' }) +
      '<div class="pm-poster-ink"><div><p class="pm-covermark">Gator<span>Bait</span></p><p class="pm-covermag">Magazine</p><p class="pm-coverdate">' + esc(text(I.date, 60)) + '</p></div>' +
      '<div class="pm-poster-bottom"><p class="pm-edition">' + esc(text(I.number, 60)) + '</p><p class="pm-coverwriter">' + esc(text(C.kicker, 80)) + '</p><h1>' + esc(text(C.headline, 200)) + '</h1>' +
      '<p class="pm-coverweek">' + esc(text(I.week, 120)) + '</p><p class="pm-covercredit">' + esc(text(C.image && C.image.credit, 120)) + '</p><span class="pm-open-label">Open this issue <span aria-hidden="true">↗</span></span></div></div>' +
      '<button type="button" class="pm-open" aria-label="Open this issue" aria-controls="pm-contents"></button></div></div><p class="pm-entry-hint">Tap the cover. Get the whole picture.</p></section>';
  }
  function pmPdfLink(D, cls) {
    var P = obj(D.pdf); if (!P || !safeUrl(P.url) || !text(P.label, 50)) return '';
    return '<a class="' + cls + '" href="' + esc(safeUrl(P.url)) + '">' + esc(text(P.label, 50)) + '</a>';
  }
  function pmReaderBar(D) {
    return '<div class="pm-readerbar"><a class="pm-readerbrand" href="/">Gator<span>Bait</span></a><details class="pm-reader-menu"><summary>Contents</summary>' + pmContents(D).replace('id="pm-contents" tabindex="-1"', '') + '</details><button type="button" data-pm-cover>Cover ↑</button>' + pmPdfLink(D, 'pm-pdf') + '</div>';
  }
  function pmStart(m) {
    var entry = m.querySelector('.pm-entrance'), cover = m.querySelector('.pm-open'), contents = m.querySelector('#pm-contents');
    if (!entry || !cover || !contents) return;
    var opening = false;
    function open() {
      if (opening) return; opening = true;
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function finish() {
        m.classList.remove('pm-opening'); m.classList.add('pm-opened'); opening = false;
        if (!m.isConnected) return;
        // The entrance is removed from layout at this point. Force the reader to the
        // actual start of the issue instead of asking scrollIntoView() to resolve a
        // target whose position just changed during the cover transition.
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
            catch (_) { window.scrollTo(0, 0); }
            contents.focus({preventScroll:true});
          });
        });
      }
      if (reduced) { finish(); return; }
      m.classList.add('pm-opening');
      setTimeout(finish, 480);
    }
    cover.addEventListener('click', open);
    m.addEventListener('click', function(e) {
      if (e.target.closest('[data-pm-cover]')) {
        m.classList.remove('pm-opened'); entry.scrollIntoView({block:'start',behavior:'instant'}); cover.focus({preventScroll:true});
      }
      var a = e.target.closest('a[href^="#pm-"]');
      if (a) {
        var menu = m.querySelector('.pm-reader-menu'); if (menu) menu.open = false;
        var target = m.querySelector(a.getAttribute('href'));
        if (target) { target.tabIndex = -1; target.focus({preventScroll:true}); }
      }
    });
    m.addEventListener('keydown', function(e) {
      var menu = m.querySelector('.pm-reader-menu');
      if (e.key === 'Escape' && menu && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
    // Direct links into the issue bypass the entrance. Content is always present and scrollable.
    if (/^#pm-/.test(location.hash)) m.classList.add('pm-opened');
  }
  function pmHead(id, D) {
    var k = text(D.kicker, 60), t = text(D.title, 120), d = text(D.dek, 400);
    return t ? '<header class="pm-sh">' + (k ? '<p class="pm-kick">' + esc(k) + '</p>' : '') + '<h2 id="pm-' + id + '-t">' + esc(t) + '</h2>' + (d ? '<p class="pm-dek">' + esc(d) + '</p>' : '') + '</header>' : '';
  }
  function pmMore(m, cls) {
    m = obj(m); var u = m && safeUrl(m.url), l = m && text(m.label, 120);
    return u && l ? '<a class="pm-more' + (cls ? ' ' + cls : '') + '" href="' + esc(u) + '">' + esc(l) + ' <span aria-hidden="true">→</span></a>' : '';
  }
  function pmSrc(s) { s = text(s, 240); return s ? '<p class="pm-src">' + esc(s) + '</p>' : ''; }
  // UAA photos carry the full linked credit (UAA, Hannah White, UF galleries). Links are fixed here, not read from the issue.
  function pmUaaCredit(cls) {
    var UAA = 'https://floridagators.com', HW = 'https://www.instagram.com/hannahmorganphoto/', GAL = 'https://floridagators.com/galleries';
    return '<span class="' + cls + '">Photo courtesy <a href="' + UAA + '" rel="noopener">UAA</a> and <a href="' + HW + '" rel="noopener">Hannah White</a> <a href="' + GAL + '" rel="noopener">More UF photos</a></span>';
  }

  function pmCover(D) {
    var C = obj(D.cover); if (!C) return '';
    var hl = text(C.headline, 200), url = safeUrl(C.url); if (!hl || !url) return '';
    var fig = frame(C.image, { eager: true, main: 1600, sizes: '(max-width: 999px) 100vw, 58vw' });
    var lines = list(C.lines, 6).map(function (l) { return text(l, 80); }).filter(Boolean);
    return '<section class="pm-cover" id="pm-cover" aria-labelledby="pm-cover-h"><div class="pm-in pm-cover-in">' +
      (fig ? '<figure class="pm-cover-fig"><a href="' + esc(url) + '" tabindex="-1" aria-hidden="true">' + fig + '</a>' + (C.image && !C.image.uaa && text(C.image.credit, 120) ? '<figcaption>' + esc(text(C.image.credit, 120)) + '</figcaption>' : '') + '</figure>' : '') +
      '<div class="pm-cover-type">' + (text(C.kicker, 80) ? '<p class="pm-kick">' + esc(text(C.kicker, 80)) + '</p>' : '') +
      '<h2 id="pm-cover-h"><a href="' + esc(url) + '">' + esc(hl) + '</a></h2>' +
      (text(C.dek, 600) ? '<p class="pm-cover-dek">' + esc(text(C.dek, 600)) + '</p>' : '') +
      (text(C.byline, 80) ? '<p class="pm-by">' + esc(text(C.byline, 80)) + '</p>' : '') +
      '<a class="pm-btn" href="' + esc(url) + '">' + esc(text(C.cta, 60) || hl) + ' <span aria-hidden="true">→</span></a></div>' +
      (lines.length ? '<div class="pm-lines">' + (text(C.linesLabel, 40) ? '<p>' + esc(text(C.linesLabel, 40)) + '</p>' : '') + '<ul>' + lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' : '') +
      (C.image && C.image.uaa ? '<p class="pm-cover-cr">' + pmUaaCredit('pm-crl') + '</p>' : '') + '</div></section>';
  }
  function pmFinal(D) {
    var F = obj(D.final), teams = F ? list(F.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && num(t.score) !== null; }) : [];
    if (teams.length < 2) return '';
    var meta = list(F.meta, 4).map(function (m) { return text(m, 60); }).filter(Boolean);
    var label = text(F.label, 20);
    return '<section class="pm-final" aria-label="' + esc(label + ': ' + teams.map(function (t) { return t.name + ' ' + t.score; }).join(', ')) + '"><div class="pm-in">' +
      (label ? '<p class="pm-final-l" aria-hidden="true">' + esc(label) + '</p>' : '') + '<div class="pm-sc" aria-hidden="true">' + teams.map(function (t) {
        return '<p class="pm-team' + (t.won ? ' pm-won' : '') + '"><span>' + (text(t.rank, 12) ? '<small>' + esc(text(t.rank, 12)) + '</small>' : '') + esc(text(t.name, 30)) + '</span><b>' + t.score + '</b></p>';
      }).join('') + '</div>' + (meta.length ? '<p class="pm-final-m">' + meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</p>' : '') + '</div></section>';
  }
  function pmContents(D) {
    var C = obj(D.contents), items = C ? list(C.items, 10).map(obj).filter(function (i) { return i && /^[a-z]+$/.test(text(i.id, 20)) && text(i.label, 40) && obj(D[i.id]); }) : [];
    if (!items.length) return '';
    return '<nav class="pm-toc" id="pm-contents" tabindex="-1" aria-label="' + esc(text(C.label, 40) || 'Contents') + '"><div class="pm-in">' + (text(C.label, 40) ? '<p class="pm-kick">' + esc(text(C.label, 40)) + '</p>' : '') + '<ol>' + items.map(function (i, n) {
      return '<li><a href="#pm-' + i.id + '"><b aria-hidden="true">' + (n + 1) + '</b>' + esc(text(i.label, 40)) + '</a></li>';
    }).join('') + '</ol></div></nav>';
  }
  function pmDamage(D) {
    var M = obj(D.damage); if (!M) return '';
    var Y = obj(M.yards), rows = Y ? list(Y.rows, 2).map(obj).filter(function (r) { return r && text(r.name, 30) && num(r.value) !== null; }) : [];
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1]));
    var stats = list(M.stats, 8).map(obj).filter(function (s) { return s && text(s.value, 12) && text(s.label, 60); });
    var Cm = obj(M.compare), cr = Cm ? list(Cm.rows, 4).map(obj).filter(function (r) { return r && text(r.label, 30) && text(r.before, 12) && text(r.after, 12); }) : [];
    return '<section class="pm-damage" id="pm-damage" aria-labelledby="pm-damage-t"><div class="pm-in">' + pmHead('damage', M) +
      (rows.length ? '<div class="pm-yards"><p class="pm-yl">' + esc(text(Y.label, 40)) + '</p>' + rows.map(function (r) {
        return '<div class="pm-yr' + (r.us ? ' pm-us' : '') + '"><span class="pm-yn">' + esc(text(r.name, 30)) + '</span><span class="pm-yb"><i style="width:' + (Math.round(r.value / max * 1000) / 10) + '%"></i></span><b>' + r.value + '</b></div>';
      }).join('') + '</div>' : '') +
      (stats.length ? '<ul class="pm-stats">' + stats.map(function (s) {
        return '<li><b>' + esc(text(s.value, 12)) + '</b><span>' + esc(text(s.label, 60)) + '</span>' + (text(s.detail, 80) ? '<small>' + esc(text(s.detail, 80)) + '</small>' : '') + '</li>';
      }).join('') + '</ul>' : '') +
      (cr.length ? '<div class="pm-cmp"><p class="pm-yl">' + esc(text(Cm.label, 60)) + '</p><table><thead><tr><td></td><th scope="col">' + esc(text(Cm.beforeLabel, 40)) + '</th><th scope="col">' + esc(text(Cm.afterLabel, 40)) + '</th></tr></thead><tbody>' + cr.map(function (r) {
        return '<tr><th scope="row">' + esc(text(r.label, 30)) + '</th><td>' + esc(text(r.before, 12)) + '</td><td class="pm-after">' + esc(text(r.after, 12)) + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '') +
      '<div class="pm-foot-row">' + pmMore(M.more, 'pm-more-lt') + pmSrc(M.source) + '</div></div></section>';
  }
  function pmFlow(D) {
    var F = obj(D.flow), pts = F ? list(F.points, 600).filter(function (v) { return num(v) !== null && v >= 0 && v <= 100; }) : [];
    if (pts.length < 2 || pts.length !== list(F.points, 600).length) return '';
    var n = pts.length - 1;
    function X(i) { return Math.round(i / n * 10000) / 10; } // viewBox 0..1000
    function Y(v) { return Math.round((100 - v) * 40) / 10; } // viewBox 0..400
    var line = pts.map(function (v, i) { return (i ? 'L' : 'M') + X(i) + ',' + Y(v); }).join('');
    var area = line + 'L1000,200L0,200Z';
    var qs = list(F.quarterStarts, 4).filter(function (q) { return num(q) !== null && q >= 0 && q <= n; });
    var ql = list(F.quarters, 4).map(function (q) { return text(q, 6); });
    var grid = [0, 100, 300, 400].map(function (y) { return '<line x1="0" x2="1000" y1="' + y + '" y2="' + y + '" class="pm-gl"/>'; }).join('') + '<line x1="0" x2="1000" y1="200" y2="200" class="pm-g50"/>' +
      qs.slice(1).map(function (q) { return '<line x1="' + X(q) + '" x2="' + X(q) + '" y1="0" y2="400" class="pm-gl"/>'; }).join('');
    var marks = list(F.marks, 6).map(obj).filter(function (m) { return m && num(m.i) !== null && m.i >= 0 && m.i <= n && text(m.title, 20); });
    var axis = list(F.axis, 3).map(function (a) { return text(a, 8); });
    var svg = '<svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><clipPath id="pm-clip-up"><rect x="0" y="0" width="1000" height="200"/></clipPath><clipPath id="pm-clip-dn"><rect x="0" y="200" width="1000" height="200"/></clipPath></defs>' + grid +
      '<path d="' + area + '" class="pm-up" clip-path="url(#pm-clip-up)"/><path d="' + area + '" class="pm-dn" clip-path="url(#pm-clip-dn)"/><path d="' + line + '" class="pm-ln" vector-effect="non-scaling-stroke"/></svg>';
    var plot = '<div class="pm-plot" role="img" aria-label="' + esc(text(F.summary, 600)) + '"><div class="pm-area">' + svg +
      axis.map(function (a, k) { return a ? '<span class="pm-ax" style="top:' + (k * 50) + '%" aria-hidden="true">' + esc(a) + '</span>' : ''; }).join('') +
      marks.map(function (m, k) { return '<span class="pm-mk" style="left:' + (X(m.i) / 10) + '%;top:' + (Y(pts[m.i]) / 4) + '%" aria-hidden="true">' + (k + 1) + '</span>'; }).join('') + '</div>' +
      (qs.length === ql.length && ql.length ? '<div class="pm-qx" aria-hidden="true">' + qs.map(function (q, k) { var end = k + 1 < qs.length ? qs[k + 1] : n; return '<span style="left:' + ((X(q) + X(end)) / 20) + '%">' + esc(ql[k]) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    return '<section class="pm-flow" id="pm-flow" aria-labelledby="pm-flow-t"><div class="pm-in">' + pmHead('flow', F) + '<figure class="pm-chart">' + plot +
      (marks.length ? '<ol class="pm-key">' + marks.map(function (m) { return '<li><b>' + esc(text(m.title, 20)) + '</b> ' + esc(text(m.note, 160)) + '</li>'; }).join('') + '</ol>' : '') +
      (text(F.source, 200) ? '<figcaption class="pm-src">' + esc(text(F.source, 200)) + '</figcaption>' : '') + '</figure>' + pmMore(F.more) + '</div></section>';
  }
  function pmQuotes(D) {
    var Q = obj(D.quotes), items = Q ? list(Q.items, 6).map(obj).filter(function (q) { return q && text(q.text, 400) && text(q.who, 60); }) : [];
    if (!items.length) return '';
    return '<section class="pm-quotes" id="pm-quotes" aria-labelledby="pm-quotes-t"><div class="pm-in">' + pmHead('quotes', Q) + '<div class="pm-qw">' + items.map(function (q, k) {
      var u = safeUrl(q.url);
      return '<figure class="pm-q pm-q' + k + '"><blockquote><p>' + esc(text(q.text, 400)) + '</p></blockquote><figcaption><b>' + esc(text(q.who, 60)) + '</b>' + (text(q.role, 120) ? '<span>' + esc(text(q.role, 120)) + '</span>' : '') +
        (u && text(q.link, 60) ? '<a href="' + esc(u) + '">' + esc(text(q.link, 60)) + ' <span aria-hidden="true">→</span></a>' : '') + '</figcaption></figure>';
    }).join('') + '</div></div></section>';
  }
  function pmPackage(D, key) {
    var P = obj(D[key]), items = P ? list(P.items, 12).map(obj).filter(function (s) { return s && safeUrl(s.url) && text(s.title, 200); }) : [];
    if (!items.length) return '';
    return '<section class="pm-pack" id="pm-' + key + '" aria-labelledby="pm-' + key + '-t"><div class="pm-in">' + pmHead(key, P) + '<ol class="pm-list">' + items.map(function (s, k) {
      var fig = s.image ? frame(s.image, { main: 480, sizes: '(max-width: 699px) 112px, 200px' }) : '';
      return '<li class="pm-it' + (s.lead ? ' pm-lead' : '') + (fig ? ' pm-has-img' : '') + '"><a href="' + esc(safeUrl(s.url)) + '"><span class="pm-n" aria-hidden="true">' + (k < 9 ? '0' : '') + (k + 1) + '</span><span class="pm-it-b"><span class="pm-kick">' + esc([text(s.rubric, 40), text(s.author, 60)].filter(Boolean).join(' · ')) + '</span>' +
        '<h3>' + esc(text(s.title, 200)) + '</h3>' + (text(s.dek, 400) ? '<span class="pm-it-d">' + esc(text(s.dek, 400)) + '</span>' : '') + (text(s.read, 30) ? '<span class="pm-it-r">' + esc(text(s.read, 30)) + '</span>' : '') + (fig && text(s.image.credit, 120) ? '<span class="pm-it-cr">' + esc(text(s.image.credit, 120)) + '</span>' : '') + '</span>' +
        (fig ? '<span class="pm-thumb">' + fig + '</span>' : '') + '</a></li>';
    }).join('') + '</ol></div></section>';
  }
  function pmSignup() {
    // The site's existing signup (src/capture.js, form "GatorBait Email List", double opt-in). Tagged source "magazine"
    // so a Magazine signup is not counted as a homepage one; capture.js submits whatever data-gbm-capture says.
    var C = window.GBM_CAPTURE; if (!C || typeof C.html !== 'function') return '';
    var h = ''; try { h = String(C.html('home', { short: true, extra: 'pm-cap' }) || ''); } catch (_) { return ''; }
    return h.replace('data-gbm-capture="home"', 'data-gbm-capture="magazine"').replace(' fp-mod-capture', '');
  }
  function pmScoring(D) {
    var S = obj(D.scoring); if (!S) return '';
    var cols = list(S.cols, 6).map(function (c) { return text(c, 4); });
    var rows = list(S.rows, 2).map(obj).filter(function (r) { return r && text(r.team, 30) && list(r.q, 6).length === cols.length - 1 && num(r.f) !== null; });
    var plays = list(S.plays, 24).map(obj).filter(function (p) { return p && text(p.when, 16) && text(p.play, 140) && text(p.score, 20); });
    if (!rows.length && !plays.length) return '';
    return '<section class="pm-sbs" id="pm-scoring" aria-labelledby="pm-scoring-t"><div class="pm-in">' + pmHead('scoring', S) +
      (rows.length ? '<table class="pm-line"><caption class="pm-vh">Score by quarter</caption><thead><tr><th scope="col"><span class="pm-vh">Team</span></th>' + cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr' + (r.us ? ' class="pm-us"' : '') + '><th scope="row">' + (text(r.rank, 8) ? '<small>' + esc(text(r.rank, 8)) + '</small> ' : '') + esc(text(r.team, 30)) + '</th>' + list(r.q, 6).map(function (v) { return '<td>' + esc(String(v)) + '</td>'; }).join('') + '<td class="pm-fin">' + r.f + '</td></tr>';
      }).join('') + '</tbody></table>' : '') +
      (plays.length ? '<ol class="pm-plays">' + plays.map(function (p) {
        return '<li' + (p.uf ? ' class="pm-uf"' : '') + '><span class="pm-pw">' + esc(text(p.when, 16)) + '</span><span class="pm-pp">' + esc(text(p.play, 140)) + '</span><b class="pm-ps">' + esc(text(p.score, 20)) + '</b></li>';
      }).join('') + '</ol>' : '') + pmSrc(S.source) + '</div></section>';
  }
  function pmBox(D) {
    var B = obj(D.box); if (!B) return '';
    var cols = list(B.cols, 2).map(function (c) { return text(c, 20); });
    var rows = list(B.rows, 14).filter(function (r) { return Array.isArray(r) && r.length === 3 && text(r[0], 30) && text(r[1], 30) && text(r[2], 30); });
    var lead = list(B.leaders, 2).map(obj).filter(function (t) { return t && text(t.team, 20) && list(t.items, 8).length; });
    if (cols.length !== 2 || !rows.length) return '';
    return '<section class="pm-box" id="pm-box" aria-labelledby="pm-box-t"><div class="pm-in">' + pmHead('box', B) +
      '<table class="pm-tstats"><caption class="pm-vh">Team stats</caption><thead><tr><td></td><th scope="col">' + esc(cols[0]) + '</th><th scope="col">' + esc(cols[1]) + '</th></tr></thead><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + esc(text(r[0], 30)) + '</th><td>' + esc(text(r[1], 30)) + '</td><td>' + esc(text(r[2], 30)) + '</td></tr>';
      }).join('') + '</tbody></table>' +
      (lead.length ? '<div class="pm-leaders">' + lead.map(function (t) {
        return '<div><h3>' + esc(text(t.team, 20)) + ' leaders</h3><dl>' + list(t.items, 8).filter(function (i) { return Array.isArray(i) && text(i[0], 20) && text(i[1], 160); }).map(function (i) {
          return '<dt>' + esc(text(i[0], 20)) + '</dt><dd>' + esc(text(i[1], 160)) + '</dd>';
        }).join('') + '</dl></div>';
      }).join('') + '</div>' : '') + pmSrc(B.source) + '</div></section>';
  }
  function pmWatch(D) {
    var W = obj(D.watch), items = W ? list(W.items, 4).map(obj).filter(function (v) { return v && text(v.title, 120) && /^https:\/\/www\.instagram\.com\/reel\/[\w-]+\/$/.test(String(v.url || '')); }) : [];
    if (!items.length) return '';
    return '<section class="pm-watch" id="pm-watch" aria-labelledby="pm-watch-t"><div class="pm-in">' + pmHead('watch', W) + '<ul class="pm-vids">' + items.map(function (v) {
      return '<li><a href="' + esc(v.url) + '" target="_blank" rel="noopener"><span class="pm-play" aria-hidden="true"></span><span class="pm-vt"><span class="pm-kick">' + esc(text(v.meta, 60)) + '</span><b>' + esc(text(v.title, 120)) + '</b><small>Opens on Instagram</small></span></a></li>';
    }).join('') + '</ul></div></section>';
  }
  function pmDownload(D) {
    var X = obj(D.download); if (!X || !text(X.label, 60) || !/^https:\/\/18fb3a4e-d7f6-414a-aeb9-3047db3ea115\.usrfiles\.com\/ugd\/[\w.]+\.pdf$/.test(String(X.url || ''))) return '';
    // A plain link with the download attribute: it saves the file, never opens a print dialog.
    return '<section class="pm-dl" id="pm-download" aria-label="Download the magazine"><div class="pm-in">' + (text(X.kicker, 40) ? '<p class="pm-kick">' + esc(text(X.kicker, 40)) + '</p>' : '') +
      '<div class="pm-dl-row"><a class="pm-dl-btn" href="' + esc(X.url) + '" download="' + esc(text(X.file, 80) || 'GatorBait-Magazine.pdf') + '">' + esc(text(X.label, 60)) + '</a>' + (text(X.note, 40) ? '<span class="pm-dl-note">' + esc(text(X.note, 40)) + '</span>' : '') + '</div></div></section>';
  }
  function pmNext(D) {
    var N = obj(D.next); if (!N || !text(N.title, 120)) return '';
    var meta = list(N.meta, 6).map(function (m) { return text(m, 60); }).filter(Boolean), P = obj(N.pickem);
    return '<section class="pm-next" id="pm-next" aria-labelledby="pm-next-t"><div class="pm-in"><div class="pm-next-grid"><div class="pm-game">' + (text(N.kicker, 40) ? '<p class="pm-kick">' + esc(text(N.kicker, 40)) + '</p>' : '') +
      '<h2 id="pm-next-t">' + esc(text(N.title, 120)) + '</h2>' + (meta.length ? '<ul class="pm-meta">' + meta.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '') +
      (text(N.note, 300) ? '<p class="pm-dek">' + esc(text(N.note, 300)) + '</p>' : '') +
      (P && text(P.title, 60) ? '<div class="pm-pick"><span class="pm-badge">' + esc(text(P.badge, 40)) + '</span><h3>' + esc(text(P.title, 60)) + '</h3><p>' + esc(text(P.text, 300)) + '</p></div>' : '') +
      '</div>' + pmSignup() + '</div></div></section>';
  }
  function pmCredits(D) {
    var C = obj(D.credits); if (!C) return '';
    var other = list(C.other, 4).map(function (t) { return text(t, 80); }).filter(Boolean);
    if (!C.uaa && !other.length) return '';
    return '<div class="pm-credits"><p class="pm-kick">' + esc(text(C.label, 30) || 'Photo credits') + '</p>' + (C.uaa ? '<p>' + pmUaaCredit('pm-crl') + '</p>' : '') + other.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>';
  }
  function pmFoot(D) {
    var R = obj(D.reference), links = R ? list(R.links, 6).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 40); }) : [];
    return '<footer class="pm-foot"><div class="pm-in">' + (links.length ? '<nav aria-label="' + esc(text(R.label, 40) || 'More') + '"><p class="pm-kick">' + esc(text(R.label, 40)) + '</p><ul>' + links.map(function (l) { return '<li><a href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 40)) + '</a></li>'; }).join('') + '</ul></nav>' : '') +
      pmCredits(D) + pmSrc(D.asOf) + pmPdfLink(D, 'pm-print') + (R && text(R.top, 40) ? '<a class="pm-top" href="#pm-cover">' + esc(text(R.top, 40)) + ' <span aria-hidden="true">↑</span></a>' : '') + '</div></footer>';
  }
  function renderPostgame(D) {
    return '<div class="pm-wrap">' + pmEntrance(D) + pmReaderBar(D) + pmContents(D) + pmCover(D) + pmFinal(D) + pmPackage(D, 'columns') + pmPackage(D, 'coverage') + pmDamage(D) + pmScoring(D) + pmBox(D) + pmFlow(D) + pmQuotes(D) + pmWatch(D) + pmNext(D) + pmDownload(D) + pmFoot(D) + '</div>';
  }
