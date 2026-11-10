  /* GatorBait News (issue.news === true): midweek news edition on the postgame blocks. Bundled only by MAG_VARIANT=gatorbait-news; notes in build-magazine.mjs. */
  function nwAs(fn, D, key, as) {
    var o = {}; o[as] = D[key];
    return obj(D[key]) ? fn(o).split('id="pm-' + as + '"').join('id="pm-' + key + '"').split('pm-' + as + '-t').join('pm-' + key + '-t').replace('>Team stats<', '>' + esc(text(D[key].caption, 60) || text(D[key].title, 60)) + '<') : '';
  }
  function nwMatch(D) {
    var G = obj(D.matchup), teams = G ? list(G.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && text(t.record, 8); }) : [];
    if (teams.length < 2) return '';
    var meta = list(G.meta, 4).map(function (m) { return text(m, 60); }).filter(Boolean), k = text(G.kickoffISO, 30);
    return '<section class="pm-final nw-mu" id="pm-matchup" aria-label="' + esc(text(G.label, 60) + ': ' + teams.map(function (t) { return (text(t.rank, 12) ? text(t.rank, 12) + ' ' : '') + t.name + ' (' + t.record + ')'; }).join(' at ') + '. ' + meta.join(', ')) + '"><div class="pm-in">' +
      '<p class="pm-final-l" aria-hidden="true">' + esc(text(G.label, 60)) + '</p><div class="pm-sc" aria-hidden="true">' + teams.map(function (t) {
        return '<p class="pm-team pm-won"><span><small>' + esc(text(t.rank, 12) || text(t.side, 12)) + '</small>' + esc(text(t.name, 30)) + (text(t.note, 30) ? '<small>' + esc(text(t.note, 30)) + '</small>' : '') + '</span><b>' + esc(text(t.record, 8)) + '</b></p>';
      }).join('') + '</div><p class="pm-final-m">' + meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') +
      (/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(k) ? '<span class="nw-cd" data-nw-k="' + k + '"></span>' : '') + '</p></div></section>';
  }
  function nwJoin(D) {
    var J = obj(D.join), u = J && safeUrl(J.url); if (!u || !text(J.title, 120) || !text(J.cta, 60)) return '';
    var meta = list(J.meta, 6).map(function (m) { return text(m, 60); }).filter(Boolean);
    return '<section class="pm-next" id="pm-join" aria-labelledby="pm-join-t"><div class="pm-in"><div class="pm-next-grid"><div class="pm-game">' + (text(J.kicker, 40) ? '<p class="pm-kick">' + esc(text(J.kicker, 40)) + '</p>' : '') +
      '<h2 id="pm-join-t">' + esc(text(J.title, 120)) + '</h2>' + (meta.length ? '<ul class="pm-meta">' + meta.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '') +
      (text(J.note, 300) ? '<p class="pm-dek">' + esc(text(J.note, 300)) + '</p>' : '') + '<a class="pm-btn" href="' + esc(u) + '">' + esc(text(J.cta, 60)) + ' <span aria-hidden="true">→</span></a></div>' + pmSignup() + '</div></div></section>';
  }
  function nwStart(m) {
    var e = m.querySelector('[data-nw-k]'), t = e && Date.parse(e.getAttribute('data-nw-k')); if (!t) return;
    function tick() {
      var s = t - Date.now(), d = Math.floor(s / 864e5), h = Math.floor(s % 864e5 / 36e5), n = Math.floor(s % 36e5 / 6e4);
      e.textContent = s > 0 ? 'Kickoff in ' + (d ? d + (d === 1 ? ' day, ' : ' days, ') : '') + h + (h === 1 ? ' hour' : ' hours') + (d ? '' : ', ' + n + ' min') : '';
    }
    tick(); clearInterval(window.__GBM_NW_T__); window.__GBM_NW_T__ = setInterval(function () { if (m.isConnected) tick(); }, 6e4);
  }
  function renderNews(D) {
    var word = esc(text((obj(D.issue) || {}).word, 20) || 'News');
    return '<div class="pm-wrap">' + pmEntrance(D).replace('<p class="pm-covermag">Magazine</p>', '<p class="pm-covermag">' + word + '</p>') + pmReaderBar(D) + pmContents(D) + pmCover(D) + nwMatch(D) + pmQuotes(D) +
      pmPackage(D, 'football') + nwAs(pmBox, D, 'schedule', 'box') + nwAs(pmDamage, D, 'bowl', 'damage') +
      (obj(D.wrap) ? pmFinal(D) : '') + nwAs(pmDamage, D, 'wrap', 'damage') + pmDownload(D) +
      pmPackage(D, 'basketball') + nwAs(pmBox, D, 'hoops', 'box') + pmWatch(D) + pmPackage(D, 'writers') + nwJoin(D) + pmFoot(D) + '</div>';
  }
