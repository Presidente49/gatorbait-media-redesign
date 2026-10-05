  /* Runtime for GatorBait Magazine 2026: the weekly web issue on /magazine. CSS, ISSUE and BUILD are injected by
   * sports-live/build-magazine.mjs. Contract: one root #gbm-magazine-page.mz26, mounted on /magazine only and removed on
   * every other route (popstate / gbmroutechange, like the urban embed it replaces); html.gbm-magazine-live while mounted,
   * which is the class the loader and the old embed hide the native page by; window.__GBM_MAG26__ {sync, ready, build};
   * window.__GBM_MAG_EDITION__ + the gbm:magazine-edition event kept from the urban embed for anything that still reads
   * the lead. The renderer prints only what the issue JSON holds: a missing, empty or pending slot renders nothing, and
   * no line of copy, label or number comes from this file. */
  var VERSION = 'magazine-2026.1';
  var SITE = 'https://www.gatorbaitmedia.com';
  var MEDIA = 'https://static.wixstatic.com/media/';
  var FONTS = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap';
  var doc = document.documentElement;
  if (window.__GBM_MAG26__) { window.__GBM_MAG26__.sync(); return; }

  function onRoute() { return window.__GBM_MAG_PREVIEW__ === true || window.__GBM_MAG_EMBED__ === true || /^\/magazine\/?$/.test(location.pathname || ''); } // __GBM_MAG_PREVIEW__: repo preview page only (deploy/covers/pregame-preview.html), never set on the site
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function text(v, max) { return v == null || typeof v === 'object' ? '' : String(v).replace(/\s+/g, ' ').trim().slice(0, max || 400); }
  function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : null; }
  function list(v, max) { return Array.isArray(v) ? v.filter(function (x) { return x != null; }).slice(0, max || 24) : []; }
  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }
  // Links: our own site only, kept site-relative so one canonical /post/ URL is one href everywhere.
  function safeUrl(value) {
    try {
      var u = new URL(String(value || ''), SITE);
      if (u.protocol !== 'https:' || u.username || u.password) return '';
      return /^(www\.)?gatorbaitmedia\.com$/.test(u.hostname) ? u.pathname + u.search + u.hash : '';
    } catch (_) { return ''; }
  }

  /* ---------- Images: Wix cuts, contain (never crop), srcset ----------
   * An image is {id, ext, width, height, alt, credit} (id = Wix media id without ~mv2) or a full static.wixstatic.com URL.
   * Every cut asks Wix to fit the photo in a box of its own ratio and pick the encoding (enc_auto). */
  function media(img) {
    if (typeof img === 'string') { var m = /^https:\/\/static\.wixstatic\.com\/media\/([0-9a-f]+_[0-9a-f]{32}~mv2\.(?:jpe?g|png|webp|avif))(?:[\/?#].*)?$/i.exec(img); return m ? m[1] : ''; }
    var o = obj(img); if (!o) return '';
    var id = text(o.id, 80), ext = (text(o.ext, 5) || 'jpg').toLowerCase();
    return /^[0-9a-f]+_[0-9a-f]{32}$/.test(id) && /^(jpe?g|png|webp|avif)$/.test(ext) ? id + '~mv2.' + ext : '';
  }
  function cut(file, w, h) { return MEDIA + file + '/v1/fit/w_' + w + ',h_' + h + ',al_c,q_80,enc_auto/gatorbait.jpg'; }
  function picture(img, o) {
    var file = media(img); if (!file) return '';
    var W = num(img.width) || o.w || 1600, H = num(img.height) || o.h || 900, r = H / W;
    var widths = [480, 800, 1200, 1600].filter(function (x) { return x <= Math.max(W, 480); });
    var main = o.main || 1200, set = widths.map(function (x) { return cut(file, x, Math.round(x * r)) + ' ' + x + 'w'; }).join(', ');
    return '<img src="' + esc(cut(file, Math.min(main, W), Math.round(Math.min(main, W) * r))) + '" srcset="' + esc(set) + '" sizes="' + esc(o.sizes || '(max-width: 820px) 100vw, 60vw') + '" alt="' + esc(text(img.alt, 200)) + '" width="' + W + '" height="' + H + '" loading="' + (o.eager ? 'eager' : 'lazy') + '" decoding="async"' + (o.eager ? ' fetchpriority="high"' : '') + '>';
  }
  function frame(img, o) {
    var pic = picture(img, o || {}); if (!pic) return '';
    var W = num(img.width) || 1600, H = num(img.height) || 900;
    return '<span class="mz-frame" style="aspect-ratio:' + W + '/' + H + '">' + pic + '</span>';
  }
  function credit(img) { var c = img && text(img.credit, 160); return c ? '<p class="mz-cr">' + esc(c) + '</p>' : ''; }
  function fonts() {
    if (!document.getElementById('gbm-mag26-fonts') && !document.querySelector('link[rel="stylesheet"][href*="Barlow+Condensed"]')) {
      var l = document.createElement('link'); l.id = 'gbm-mag26-fonts'; l.rel = 'stylesheet'; l.href = FONTS; document.head.appendChild(l);
    }
  }
  function styles() {
    if (document.getElementById('gbm-mag26-css')) return;
    var s = document.createElement('style'); s.id = 'gbm-mag26-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  /* ---------- Sections. Each returns '' when its data is missing, empty or pending. ---------- */
  function sectionHead(id, label, note) { return label ? '<div class="mz-sec-h"><h2 id="' + id + '-title">' + esc(label) + '</h2>' + (note ? '<p>' + esc(note) + '</p>' : '') + '</div>' : ''; }
  function source(s) { s = text(s, 60); return s ? '<small class="mz-src">' + esc(s) + '</small>' : ''; }

  function head(D) {
    var I = obj(D.issue) || {}, M = obj(D.masthead) || {};
    // The masthead is a logo file, used as given (no re-cut): a plain static.wixstatic.com media URL or an {id, ext} like any photo.
    var mast = typeof M.image === 'string' && /^https:\/\/static\.wixstatic\.com\/media\/[0-9a-f]+_[0-9a-f]{32}~mv2\.(?:webp|png|jpe?g)$/i.test(M.image) ? M.image : media(M.image) ? MEDIA + media(M.image) : '';
    var top = text(I.tagline, 120), num = text(I.number, 40), name = text(I.name, 120), date = text(I.date, 60), week = text(I.week, 120);
    if (!mast && !name && !date) return '';
    return '<header class="mz-head">' + (top || num ? '<div class="mz-head-top"><span>' + esc(top) + '</span><span>' + esc(num) + '</span></div>' : '') +
      '<div class="mz-mast"><b>Magazine</b></div>' +
      (name || date || week ? '<p class="mz-issue">' + [name, date].filter(Boolean).map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + (week ? '<span class="mz-week">' + esc(week) + '</span>' : '') + '</p>' : '') + '</header>';
  }
  function cover(D, L) {
    var C = obj(D.cover); if (!C || C.pending) return '';
    var url = safeUrl(C.url), hl = text(C.headline, 200); if (!url || !hl) return '';
    var fig = frame(C.image, { eager: true, main: 1600, sizes: '(max-width: 820px) 100vw, 700px' });
    return '<section class="mz-cover" id="mz-cover" data-mz="cover" aria-labelledby="mz-cover-h">' +
      (fig ? '<div class="mz-cover-fig"><a href="' + esc(url) + '" tabindex="-1" aria-hidden="true">' + fig + '</a>' + credit(C.image) + '</div>' : '') +
      '<div class="mz-cover-type">' + (text(C.kicker, 80) ? '<span class="mz-kick">' + esc(text(C.kicker, 80)) + '</span>' : '') +
      '<h1 id="mz-cover-h"><a href="' + esc(url) + '">' + esc(hl) + '</a></h1>' +
      (text(C.dek, 600) ? '<p class="mz-dek">' + esc(text(C.dek, 600)) + '</p>' : '') + (text(C.byline, 80) ? '<p class="mz-by">' + esc(text(C.byline, 80)) + '</p>' : '') +
      (text(L.read, 40) ? '<a class="mz-btn" href="' + esc(url) + '">' + esc(text(L.read, 40)) + '</a>' : '') + '</div></section>';
  }
  function contents(items, L) {
    if (!items.length || !text(L.contents, 40)) return '';
    return '<nav class="mz-toc" id="mz-contents" data-mz="contents" aria-label="' + esc(text(L.contents, 40)) + '"><span class="mz-kick">' + esc(text(L.contents, 40)) + '</span><ol>' +
      items.map(function (s, i) { return '<li><a href="#' + s.id + '"><b aria-hidden="true">' + (i < 9 ? '0' : '') + (i + 1) + '</b><span><small>' + esc(s.label) + '</small>' + esc(s.note) + '</span></a></li>'; }).join('') + '</ol></nav>';
  }
  function columns(D, L) {
    var C = obj(D.columns), items = C ? list(C.items, 4).map(function (c) {
      c = obj(c); if (!c || c.pending) return null;
      var url = safeUrl(c.url), hl = text(c.headline, 200); return url && hl ? { url: url, hl: hl, who: text(c.columnist, 60), ex: text(c.excerpt, 400), image: obj(c.image) } : null;
    }).filter(Boolean) : [];
    if (items.length < 1) return null;
    return { note: items.map(function (c) { return c.who; }).filter(Boolean).join(' · '), html: '<section class="mz-sec" id="mz-columns" data-mz="columns" aria-labelledby="mz-columns-title">' + sectionHead('mz-columns', text(C.label, 60), text(C.note, 200)) +
      '<div class="mz-cols">' + items.map(function (c) {
        return '<a class="mz-col" href="' + esc(c.url) + '">' + (c.image ? frame(c.image, { main: 800, sizes: '(max-width: 599px) 100vw, (max-width: 1099px) 50vw, 25vw' }) : '') +
          (c.who ? '<span class="mz-who">' + esc(c.who) + '</span>' : '') + '<h3>' + esc(c.hl) + '</h3>' + (c.ex ? '<p>' + esc(c.ex) + '</p>' : '') + (c.image && text(c.image.credit, 160) ? '<span class="mz-cr">' + esc(text(c.image.credit, 160)) + '</span>' : '') +
          (text(L.readColumn, 40) ? '<span class="mz-more">' + esc(text(L.readColumn, 40)) + '</span>' : '') + '</a>';
      }).join('') + '</div></section>' };
  }
  function feature(D, L) {
    var F = obj(D.feature); if (!F || F.pending) return null;
    var url = safeUrl(F.url), hl = text(F.headline, 200); if (!url || !hl) return null;
    var fig = frame(F.image, { main: 1200, sizes: '(max-width: 599px) 100vw, 50vw' });
    return { note: hl, html: '<section class="mz-sec" id="mz-feature" data-mz="feature" aria-labelledby="mz-feature-title">' + sectionHead('mz-feature', text(F.label, 60), text(F.note, 200)) +
      '<div class="mz-feat">' + (fig ? '<div class="mz-feat-fig"><a href="' + esc(url) + '" tabindex="-1" aria-hidden="true">' + fig + '</a>' + credit(F.image) + '</div>' : '') +
      '<div class="mz-feat-type">' + (text(F.kicker, 80) ? '<span class="mz-kick">' + esc(text(F.kicker, 80)) + '</span>' : '') + '<h3><a href="' + esc(url) + '">' + esc(hl) + '</a></h3>' +
      (text(F.dek, 600) ? '<p class="mz-dek">' + esc(text(F.dek, 600)) + '</p>' : '') + (text(F.byline, 80) ? '<p class="mz-by">' + esc(text(F.byline, 80)) + '</p>' : '') +
      (text(L.read, 40) ? '<a class="mz-btn" href="' + esc(url) + '">' + esc(text(L.read, 40)) + '</a>' : '') + '</div></div></section>' };
  }
  function pregame(D) {
    var P = obj(D.pregame); if (!P || P.pending) return null;
    var teams = list(P.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 40); });
    var when = obj(P.when) || {}, whenParts = [text(when.kickoff, 60), text(when.tv, 40), text(when.venue, 120)].filter(Boolean);
    var series = text(P.series, 400), keys = list(P.keys, 6).map(function (k) { return text(k, 300); }).filter(Boolean);
    var pv = obj(P.preview), pvUrl = pv ? safeUrl(pv.url) : '', pvTitle = pv ? text(pv.title, 200) : '';
    var matchup = text(P.matchup, 120);
    if (!matchup && teams.length < 2 && !whenParts.length && !pvUrl) return null;
    return { note: matchup || whenParts[0] || pvTitle, html: '<section class="mz-sec" id="mz-pregame" data-mz="pregame" aria-labelledby="mz-pregame-title">' + sectionHead('mz-pregame', text(P.label, 60), text(P.note, 200)) +
      '<div class="mz-pre">' + (matchup ? '<span class="mz-kick">' + esc(matchup) + '</span>' : '') +
      (teams.length === 2 ? '<div class="mz-pre-match"><div class="mz-pre-team"><b>' + esc(text(teams[0].name, 40)) + '</b>' + (text(teams[0].line, 80) ? '<small>' + esc(text(teams[0].line, 80)) + '</small>' : '') + '</div>' + (text(P.separator, 6) ? '<span class="mz-pre-at">' + esc(text(P.separator, 6)) + '</span>' : '<span></span>') + '<div class="mz-pre-team"><b>' + esc(text(teams[1].name, 40)) + '</b>' + (text(teams[1].line, 80) ? '<small>' + esc(text(teams[1].line, 80)) + '</small>' : '') + '</div></div>' : '') +
      (whenParts.length ? '<p class="mz-pre-when">' + whenParts.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</p>' : '') +
      (series ? '<p class="mz-pre-series">' + esc(series) + '</p>' : '') +
      (keys.length ? (text(P.keysLabel, 60) ? '<h4>' + esc(text(P.keysLabel, 60)) + '</h4>' : '') + '<ol class="mz-pre-keys">' + keys.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ol>' : '') +
      (pvUrl && pvTitle ? '<a class="mz-pre-link" href="' + esc(pvUrl) + '">' + (text(pv.label, 60) ? '<small>' + esc(text(pv.label, 60)) + '</small>' : '') + '<b>' + esc(pvTitle) + '</b>' + (text(pv.excerpt, 400) ? '<p>' + esc(text(pv.excerpt, 400)) + '</p>' : '') + (text(pv.byline, 80) ? '<span class="mz-by">' + esc(text(pv.byline, 80)) + '</span>' : '') + '</a>' : '') +
      '</div></section>' };
  }
  function schedule(S, L) {
    S = obj(S); var games = S ? list(S.games, 16).map(obj).filter(function (g) { return g && text(g.opponent, 40); }) : [];
    if (!games.length) return null;
    var team = obj(S.team) || {}, h = obj(S.headers) || {};
    var rows = games.map(function (g) {
      var r = obj(g.result), fla = r ? num(r.fla) : null, opp = r ? num(r.opp) : null, done = fla !== null && opp !== null;
      var opponent = (g.home === true ? text(L.vs, 6) : text(L.at, 6)) + (num(g.opponentRank) ? ' ' + text(L.rank, 6) + ' ' + num(g.opponentRank) : '') + ' ' + text(g.opponent, 40);
      var cell = done ? '<span class="' + (fla > opp ? 'mz-w' : fla < opp ? 'mz-l' : '') + '">' + esc(fla > opp ? text(L.win, 2) : fla < opp ? text(L.loss, 2) : '') + ' ' + fla + '-' + opp + '</span>' : esc(text(g.kickoff, 40)) + (text(g.tv, 24) ? '<small>' + esc(text(g.tv, 24)) + '</small>' : '');
      return '<tr' + (g.next === true ? ' class="mz-next"' : '') + '><td class="mz-d">' + esc(text(g.date, 20)) + '</td><td class="mz-o">' + esc(opponent.trim()) + (text(g.site, 40) ? '<small>' + esc(text(g.site, 40)) + '</small>' : '') + '</td><td class="mz-r mz-num">' + cell + '</td></tr>';
    }).join('');
    return { label: text(S.label, 60), html: '<div class="mz-dep mz-dep-sched" data-mz="schedule"><div class="mz-sub"><h3>' + esc(text(S.label, 60)) + '</h3>' + (text(team.line, 80) ? '<small>' + esc(text(team.line, 80)) + '</small>' : '') + '</div>' +
      '<table class="mz-sched"><thead><tr><th class="mz-d">' + esc(text(h.date, 20)) + '</th><th>' + esc(text(h.opponent, 20)) + '</th><th class="mz-r">' + esc(text(h.result, 20)) + '</th></tr></thead><tbody>' + rows + '</tbody></table>' + (text(S.foot, 200) ? '<p class="mz-cr">' + esc(text(S.foot, 200)) + '</p>' : '') + '</div>' };
  }
  function injuries(J) {
    J = obj(J); if (!J) return null;
    var groups = list(J.teams, 2).map(obj).map(function (t) {
      var items = t ? list(t.items, 16).map(obj).filter(function (p) { return p && text(p.name, 60); }) : [];
      return t && items.length ? { team: text(t.name, 40), items: items, source: text(t.source, 80) } : null;
    }).filter(Boolean);
    if (!groups.length) return null;
    return { label: text(J.label, 60), html: '<div class="mz-dep" data-mz="injuries"><div class="mz-sub"><h3>' + esc(text(J.label, 60)) + '</h3></div><div class="mz-inj">' + groups.map(function (t) {
      return '<div><h4>' + esc(t.team) + '</h4><ul>' + t.items.map(function (p) {
        var st = text(p.status, 30);
        return '<li><b>' + (text(p.pos, 8) ? '<i>' + esc(text(p.pos, 8)) + '</i>' : '') + esc(text(p.name, 60)) + '</b>' + (st ? '<span class="mz-st" data-s="' + esc(st.toLowerCase()) + '">' + esc(st) + '</span>' : '') + (text(p.detail, 120) ? '<span>' + esc(text(p.detail, 120)) + '</span>' : '') + source(text(p.source, 60) || t.source) + '</li>';
      }).join('') + '</ul></div>';
    }).join('') + '</div></div>' };
  }
  function numbers(N) {
    N = obj(N); var stats = N ? list(N.items, 8).map(obj).filter(function (s) { return s && text(s.value, 20) && text(s.label, 80); }) : [];
    if (!stats.length) return null;
    return { label: text(N.label, 60), html: '<div class="mz-dep" data-mz="numbers"><div class="mz-sub"><h3>' + esc(text(N.label, 60)) + '</h3>' + (text(N.note, 80) ? '<small>' + esc(text(N.note, 80)) + '</small>' : '') + '</div><div class="mz-stats">' +
      stats.map(function (s) { return '<div class="mz-stat"><b>' + esc(text(s.value, 20)) + '</b><span>' + esc(text(s.label, 80)) + '</span>' + (text(s.source, 60) ? '<small>' + esc(text(s.source, 60)) + '</small>' : '') + '</div>'; }).join('') + '</div></div>' };
  }
  function roster(R) {
    R = obj(R); var items = R ? list(R.items, 12).map(obj).filter(function (n) { return n && text(n.text, 300); }) : [];
    if (!items.length) return null;
    return { label: text(R.label, 60), html: '<div class="mz-dep" data-mz="roster"><div class="mz-sub"><h3>' + esc(text(R.label, 60)) + '</h3></div><ul class="mz-notes">' +
      items.map(function (n) { return '<li>' + esc(text(n.text, 300)) + source(n.source) + '</li>'; }).join('') + '</ul></div>' };
  }
  function departments(D, L) {
    var P = obj(D.departments); if (!P) return null;
    var parts = [schedule(P.schedule, L), injuries(P.injuries), numbers(P.numbers), roster(P.roster)].filter(Boolean);
    if (!parts.length) return null;
    return { note: parts.map(function (p) { return p.label; }).filter(Boolean).join(' · '), html: '<section class="mz-sec" id="mz-departments" data-mz="departments" aria-labelledby="mz-departments-title">' + sectionHead('mz-departments', text(P.label, 60), text(P.note, 200)) + '<div class="mz-dept">' + parts.map(function (p) { return p.html; }).join('') + '</div></section>' };
  }
  function shots(D) {
    var B = obj(D.bestShots); var photos = B ? list(B.photos, 6).map(obj).filter(function (p) { return p && media(p) && safeUrl(p.url); }) : [];
    if (photos.length < 1) return null;
    return { note: text(B.credit, 120) || text(B.note, 120), html: '<section class="mz-sec" id="mz-shots" data-mz="shots" aria-labelledby="mz-shots-title">' + sectionHead('mz-shots', text(B.label, 60), text(B.note, 200)) + '<div class="mz-shots">' +
      photos.map(function (p) { return '<a class="mz-shot" href="' + esc(safeUrl(p.url)) + '">' + frame(p, { main: 800, sizes: '(max-width: 359px) 100vw, (max-width: 599px) 50vw, 33vw' }) + (text(p.caption, 120) ? '<span>' + esc(text(p.caption, 120)) + '</span>' : '') + '</a>'; }).join('') + '</div>' +
      (text(B.credit, 120) ? '<p class="mz-cr mz-shots-cr">' + esc(text(B.credit, 120)) + '</p>' : '') + '</section>' };
  }
  function footer(D) {
    var F = obj(D.footer), links = F ? list(F.links, 4).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 40); }) : [];
    if (!links.length && !(F && text(F.line, 200))) return '';
    return '<nav class="mz-foot" data-mz="footer" aria-label="' + esc(text(F.label, 40)) + '">' + links.map(function (l) { return '<a class="mz-more" href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 40)) + '</a>'; }).join('') + (text(F.line, 200) ? '<small>' + esc(text(F.line, 200)) + '</small>' : '') + '</nav>';
  }

  // Shared writer CTA contract: reuse these fields in writer archives/profile templates.
  function writerPromo(name, episode) {
    var shows = {
      'Buddy Martin': {line:'Catch Buddy Martin on The Buddy Martin Show.', role:'Editor', show:'The Buddy Martin Show'},
      'Loren Meadows': {line:'Catch Loren Meadows on Florida Gator Lowdown.', role:'Football Analyst', show:'Florida Gator Lowdown'}
    };
    var p = shows[name];
    var channel='https://www.youtube.com/@TheBuddyMartinShow';
    var watch=channel+'/videos', label='Browse '+(p ? p.show+' and other shows' : 'GatorBait TV shows');
    if(name==='Buddy Martin'){watch=channel+'/live';label='Watch The Buddy Martin Show';}
    if(episode && p && episode.show===p.show && /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(episode.url) && text(episode.title,160)){
      watch=episode.url;label='Watch '+p.show+': '+text(episode.title,160);
    }
    return '<aside class="mz-writer-promo" aria-label="Watch GatorBait TV">'+
      '<p class="mz-kick">GatorBait TV</p><h3>' + esc(p ? p.line : 'Keep up with GatorBait on YouTube.') + '</h3>'+
      (p ? '<p>'+esc(name)+' · '+esc(p.role)+'</p>' : '')+
      '<div><a href="'+esc(watch)+'">'+esc(label)+' →</a>'+
      '<a href="'+channel+'?sub_confirmation=1">Subscribe on YouTube →</a></div></aside>';
  }

  // Five cleared photographs, in editorial order; incomplete packages stay out of the issue.
  function fiveBeats(D) {
    var b=obj(D.fiveBeats), photos=b&&list(b.photos,6);
    if(!b || b.approved!==true || !photos || photos.length!==5 || !text(b.title,160) ||
      !photos.every(function(p){return obj(p)&&media(p)&&text(p.alt,200)&&text(p.caption,400)&&text(p.credit,160)&&safeUrl(p.sourceUrl);}))return '';
    return '<section class="mz-five" id="mz-five-beats" aria-labelledby="mz-five-title"><span class="mz-kick">Five Beats</span><h2 id="mz-five-title">'+esc(b.title)+'</h2>'+photos.map(function(p,i){return '<figure>'+frame(p,{main:1200,sizes:'(max-width: 820px) 100vw, 900px'})+'<figcaption><b>'+String(i+1).padStart(2,'0')+'</b> '+esc(p.caption)+' <span>'+esc(p.credit)+'</span> <a href="'+esc(safeUrl(p.sourceUrl))+'">Source story →</a></figcaption></figure>';}).join('')+'</section>';
  }

  function render(D) {
    if (D && D.layout === 'pregame') return renderPregame(D);
    if (D && D.layout === 'postgame' && typeof renderPostgame === 'function') return renderPostgame(D); // src/magazine-postgame.js, postgame bundle only
    var stories=D.stories||[], L=D.labels||{};
    var items=stories.map(function(p){return {id:'story-'+p.id,label:p.author,note:p.title};});
    var front=cover(D,L).replaceAll('href="'+safeUrl(D.cover.url)+'"','href="#story-'+stories[0].id+'"');
    var mast='<aside class="mz-staff" aria-label="Magazine masthead"><p><b>Brenden Martin</b> · Publisher</p><p><b>Buddy Martin</b> · Editor</p><p><b>Franz Beard</b> · Senior Columnist</p><p><b>Loren Meadows</b> · Football Analyst</p><p><b>Chris Spears</b> · Photographer</p></aside>';
    var body=stories.map(function(p,i){return '<article class="mz-full-story" id="story-'+esc(p.id)+'" data-post="'+esc(p.id)+'"><header><span class="mz-kick">'+String(i+1).padStart(2,'0')+' / '+esc(p.author)+'</span><h2>'+esc(p.title)+'</h2><p class="mz-story-meta">'+esc(p.author==='GatorBait Media Staff'?'GatorBait Staff':p.author)+' · '+esc(p.date)+'</p><a class="mz-site" href="https://www.gatorbaitmedia.com/">gatorbaitmedia.com</a></header><div class="mz-reading">'+p.html+'</div>'+writerPromo(p.author,p.showEpisode)+'<nav class="mz-story-nav" aria-label="Article navigation"><a href="#mz-contents">Back to contents ↑</a><a href="'+esc(safeUrl(p.url))+'">Original article and discussion ↗</a>'+(stories[i+1]?'<a href="#story-'+esc(stories[i+1].id)+'">Next: '+esc(stories[i+1].author)+' →</a>':'')+'</nav></article>';}).join('');
    var guide='/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play';
    var utility='<section class="mz-utilities" aria-label="GatorBait reference desk"><h2>The reference desk</h2><p><a href="'+guide+'#roster">Florida Gators roster</a> · <a href="'+guide+'#schedule">Schedule and results</a></p><h3>The Buddy Martin Show on GatorBait TV</h3><a href="https://www.youtube.com/@TheBuddyMartinShow/live">Watch The Buddy Martin Show</a></section>';
    return '<div class="mz-wrap">'+head(D)+mast+front+'<div class="mz-tools"><button type="button" data-print>Print / Save as PDF</button><span>Six complete articles · October 1 edition</span></div>'+contents(items,L)+body+fiveBeats(D)+utility+'<div class="mz-tools"><button type="button" data-print>Print / Save as PDF</button><a href="#mz-contents">Back to contents ↑</a></div>'+footer(D)+'</div>';
  }

  // Edition-local reading passport. Reached is a navigation signal, not comprehension.
  var passportCleanup = function () {};
  function passport(root, D) {
    passportCleanup();
    var stories = D.stories || [], toc = root.querySelector('.mz-toc');
    if (!stories.length || !toc || !window.IntersectionObserver) return;
    var key = 'gbm:magazine:reached:' + D.id, reached = [], canStore = true;
    var ids = stories.map(function (s) { return s.id; });
    try {
      var saved = JSON.parse(localStorage.getItem(key) || '[]');
      reached = Array.isArray(saved) ? saved.filter(function (id,i) { return ids.indexOf(id) >= 0 && saved.indexOf(id)===i; }) : [];
      localStorage.setItem(key, JSON.stringify(reached));
    } catch (_) { canStore = false; return; }
    var box = document.createElement('div'); box.className = 'mz-passport';
    var count = document.createElement('span'), resume = document.createElement('a');
    box.append(count, resume); toc.insertBefore(box, toc.querySelector('ol'));
    function paint() {
      count.textContent = reached.length + ' of ' + stories.length + ' story endings reached';
      var next = stories.find(function (s) { return reached.indexOf(s.id) < 0; });
      resume.textContent = next ? 'Resume: ' + next.title : 'Return to contents';
      resume.href = next ? '#story-' + next.id : '#mz-contents';
      stories.forEach(function (s) {
        var link = toc.querySelector('a[href="#story-' + s.id + '"]');
        if (!link) return;
        var label = link.querySelector('.mz-reached');
        if (reached.indexOf(s.id) >= 0 && !label) {
          label = document.createElement('small'); label.className = 'mz-reached';
          label.textContent = 'Reached'; link.querySelector('span').appendChild(label);
        }
      });
    }
    var pending = new Map(), visible = new Set(), seenStarts = new Set();
    function cancel() { pending.forEach(clearTimeout); pending.clear(); }
    function schedule(nav) {
      var id = nav.closest('article').getAttribute('data-post');
      if (document.hidden || !seenStarts.has(id) || pending.has(id) || reached.indexOf(id) >= 0) return;
      pending.set(id, setTimeout(function () {
        pending.delete(id);
        if (document.hidden || !visible.has(nav) || !root.isConnected) return;
        reached.push(id);
        try { if (canStore) localStorage.setItem(key, JSON.stringify(reached)); } catch (_) { canStore = false; }
        paint();
      }, 2000));
    }
    var starts = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !document.hidden) seenStarts.add(e.target.closest('article').getAttribute('data-post')); });
    });
    var ends = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { visible.add(e.target); schedule(e.target); }
        else { visible.delete(e.target); var id = e.target.closest('article').getAttribute('data-post'); clearTimeout(pending.get(id)); pending.delete(id); }
      });
    }, { threshold: 0.5 });
    root.querySelectorAll('.mz-full-story>header').forEach(function (el) { starts.observe(el); });
    root.querySelectorAll('.mz-story-nav').forEach(function (el) { ends.observe(el); });
    function visibility() { cancel(); if (!document.hidden) visible.forEach(schedule); }
    document.addEventListener('visibilitychange', visibility);
    paint();
    passportCleanup = function () { cancel(); starts.disconnect(); ends.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }

  /* ---------- Lifecycle ---------- */
  var retries = [600, 1800, 4000], timers = [];
  function issue() { var o = obj(window.__GBM_MAG_ISSUE__); return o || ISSUE; } // __GBM_MAG_ISSUE__: QA / preview override, same shape
  function expose(D) {
    var C = obj(D.cover) || {}, I = obj(D.issue) || {}, file = media(C.image);
    window.__GBM_MAG_EDITION__ = { id: text(D.id, 80), date: text(I.date, 60), edition: text(I.name, 120), lead: { title: text(C.headline, 200), url: safeUrl(C.url), image: file ? cut(file, 1000, Math.round(1000 * ((num(C.image && C.image.height) || 900) / (num(C.image && C.image.width) || 1600)))) : '', deck: text(C.dek, 600), label: text(C.kicker, 80) }, cover: { headline: text(C.headline, 200), kicker: text(C.kicker, 80) } };
    try { document.dispatchEvent(new Event('gbm:magazine-edition')); } catch (_) {}
  }
  function mount() {
    if (!onRoute()) return;
    var old = document.getElementById('gbm-magazine-page');
    if (old && old.isConnected) return;
    if (old) old.remove();
    var D = issue(), html;
    try { html = render(D); } catch (error) { doc.classList.remove('gbm-mq'); window.__GBM_MAG26__.error = String(error); return; }
    styles(); fonts();
    var m = document.createElement('main'); m.id = 'gbm-magazine-page'; m.className = 'mz26' + (D.layout === 'pregame' ? ' pg' : D.layout === 'postgame' ? ' pm' : '');
    if (D.layout === 'pregame' && obj(D.game)) m.setAttribute('data-kickoff', text(D.game.kickoffISO, 40));
    m.setAttribute('data-issue', text(D.id, 80)); m.setAttribute('data-mz-build', BUILD); m.setAttribute('data-mz-version', VERSION);
    if (text((obj(D.issue) || {}).pageTitle, 120)) m.setAttribute('aria-label', text(D.issue.pageTitle, 120));
    m.innerHTML = html;
    m.addEventListener('click', async function(e){
      var printButton=e.target.closest('[data-print]');
      if(printButton){
        var label=printButton.textContent;printButton.disabled=true;printButton.textContent='Preparing photographs…';
        var images=Array.from(m.querySelectorAll('img'));
        images.forEach(function(img){img.loading='eager';});
        await Promise.race([Promise.all(images.map(function(img){return img.decode ? img.decode().catch(function(){}) : Promise.resolve();})),new Promise(function(resolve){setTimeout(resolve,10000);})]);
        try{window.print();}finally{printButton.disabled=false;printButton.textContent=label;}
      }
      var a=e.target.closest('a[href^="#story-"]');
      if(a){var target=m.querySelector(a.getAttribute('href'));var h=target&&target.querySelector('h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
    });
    // Same seat as the urban embed: right after the mobile shell host (or the shared header) when that is a body child.
    var anchor = document.getElementById('gbm-mobile-shell-host') || document.getElementById('gbm-site-header');
    if (anchor && anchor.parentNode === document.body) document.body.insertBefore(m, anchor.nextSibling); else document.body.insertBefore(m, document.body.firstChild);
    doc.classList.add('gbm-mq', 'gbm-magazine-live');
    if (text((obj(D.issue) || {}).pageTitle, 120)) document.title = text(D.issue.pageTitle, 120);
    expose(D);
    passport(m, D);
    if (D.layout === 'pregame') pgStart(m);
    if (D.layout === 'postgame') pmStart(m);
    window.__GBM_MAG26__.ready = true;
  }
  function start() {
    mount();
    // Wix can replace body children during a late hydration; look again a few times (bounded, no observer, no polling loop).
    timers.forEach(clearTimeout); timers = retries.map(function (ms) { return setTimeout(function () { if (onRoute()) mount(); }, ms); });
  }
  function sync() {
    if (onRoute()) { start(); return; }
    timers.forEach(clearTimeout); timers = [];
    passportCleanup(); pgStop();
    var root = document.getElementById('gbm-magazine-page'); if (root) root.remove();
    doc.classList.remove('gbm-magazine-live', 'gbm-mq');
    window.__GBM_MAG26__.ready = false;
  }
  window.__GBM_MAG26__ = { sync: sync, ready: false, build: BUILD, version: VERSION };
  window.addEventListener('popstate', sync);
  window.addEventListener('gbmroutechange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
