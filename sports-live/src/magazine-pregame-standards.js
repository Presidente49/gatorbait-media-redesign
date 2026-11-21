
  /* ================= Pregame standards: both teams' schedules and rosters (owner rule, Nov. 20, 2026) =================
   * "Rosters for both teams up and visible, and a schedule up and visible; these are standards."
   * Opt-in by data: sports-live/build-magazine.mjs appends this file and src/magazine-pregame-standards.css, and hooks the three
   * functions below into renderPregame, only when the issue JSON carries teamSchedules or teamRosters. An edition without those
   * keys builds byte-identical to before. Same contract as the rest of the layout: every word and number comes from the issue
   * JSON; this file only lays them out. Nothing is collapsed: both sections are open tables, no <details>, no tap.
   * Rows are arrays, not objects, to protect the bundle cap:
   *   teamSchedules.teams[].games[]  = [date, site ("" at home, "at", "vs."), opponent, result ("W", "L", "T" or ""), score or kickoff, second line (TV or place), 1 when it is this issue's game]
   *   teamRosters.teams[].groups[]   = [group label, [[number, name, position, class, height, weight, hometown], ...]]
   * No top-level state here: the runtime can mount before this file's own statements run, so everything lives inside the functions.
   * The roster rows are a CSS grid on phones (hometown on a second line), so every table part carries its ARIA role explicitly. */
  function pgStdId(prefix, name) { return prefix + text(name, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
  function pgStdSchedTeams(D) {
    var S = obj(D.teamSchedules);
    return S && list(S.cols, 3).length === 3 ? list(S.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && list(t.games, 16).filter(Array.isArray).length; }) : [];
  }
  function pgStdRosterTeams(D) {
    var R = obj(D.teamRosters);
    return R && list(R.cols, 7).length === 7 ? list(R.teams, 2).map(obj).filter(function (t) {
      return t && text(t.name, 30) && list(t.groups, 6).some(function (g) { return Array.isArray(g) && list(g[1], 90).filter(Array.isArray).length; });
    }) : [];
  }
  function pgStdSrc(s) { s = text(s, 300); return s ? '<p class="pg-src">' + esc(s) + '</p>' : ''; }
  // Jump strip under the cover: the two standards sit below the columns, so the top of the issue links straight to them.
  function pgStdNav(D) {
    var S = obj(D.teamSchedules) || {}, R = obj(D.teamRosters) || {}, label = text(S.navLabel, 30) || text(R.navLabel, 30), links = [];
    if (!label) return '';
    if (pgShotsTop(D) && text(D.shots.jump, 30)) links.push('<a href="#pg-shots">' + esc(text(D.shots.jump, 30)) + '</a>');
    if (pgStdSchedTeams(D).length && text(S.jump, 30)) links.push('<a href="#pg-team-schedules">' + esc(text(S.jump, 30)) + '</a>');
    // Page order: the schedules, the availability report, the magazine-only stories, then the rosters.
    if (text((obj(D.injuries) || {}).jump, 30)) links.push('<a href="#pg-injuries">' + esc(text(D.injuries.jump, 30)) + '</a>');
    if (pgStoryItems(D.features).length && text(D.features.jump, 30)) links.push('<a href="#pg-features">' + esc(text(D.features.jump, 30)) + '</a>');
    if (pgExclItems(D).length && text(D.exclusives.jump, 30)) links.push('<a href="#pg-exclusives">' + esc(text(D.exclusives.jump, 30)) + '</a>');
    pgStdRosterTeams(D).forEach(function (t) { if (text(t.jump, 30)) links.push('<a href="#' + pgStdId('pg-rt-', t.name) + '">' + esc(text(t.jump, 30)) + '</a>'); });
    return links.length ? '<nav class="pg-jump" aria-label="' + esc(label) + '"><b>' + esc(label) + '</b>' + links.join('') + '</nav>' : '';
  }
  function pgTeamSchedules(D) {
    var S = obj(D.teamSchedules), teams = pgStdSchedTeams(D);
    if (!teams.length) return '';
    var head = '<thead><tr>' + list(S.cols, 3).map(function (c, i) { return '<th scope="col"' + (i === 2 ? ' class="pg-sc-r"' : '') + '>' + esc(text(c, 16)) + '</th>'; }).join('') + '</tr></thead>';
    return '<section class="pg-std pg-sched" id="pg-team-schedules" aria-labelledby="pg-team-schedules-t">' + pgHeadSec('pg-team-schedules', text(S.label, 40), text(S.note, 160)) + '<div class="pg-std-grid">' + teams.map(function (t) {
      var id = pgStdId('pg-sc-', t.name);
      return '<div class="pg-std-team"><h3 id="' + id + '">' + esc(text(t.name, 30)) + (text(t.record, 40) ? ' <small>' + esc(text(t.record, 40)) + '</small>' : '') + '</h3><table class="pg-std-t pg-sc" aria-labelledby="' + id + '">' + head + '<tbody>' +
        list(t.games, 16).filter(Array.isArray).map(function (g) {
          var site = text(g[1], 4), res = text(g[3], 1), sub = text(g[5], 30);
          return '<tr' + (g[6] ? ' class="pg-sc-now"' : '') + '><td class="pg-sc-d">' + esc(text(g[0], 12)) + '</td><th scope="row">' + (site ? '<small>' + esc(site) + '</small> ' : '') + esc(text(g[2], 60)) + '</th><td class="pg-sc-r">' +
            (res ? '<b class="pg-sc-' + (res === 'W' ? 'w' : 'l') + '">' + esc(res) + '</b> ' : '') + esc(text(g[4], 20)) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }).join('') + '</div>' + pgStdSrc(S.source) + '</section>';
  }
  function pgTeamRosters(D) {
    var R = obj(D.teamRosters), teams = pgStdRosterTeams(D);
    if (!teams.length) return '';
    var head = '<thead role="rowgroup"><tr role="row">' + list(R.cols, 7).map(function (c, i) { return '<th role="columnheader" scope="col"' + (i === 0 ? ' class="pg-rt-n"' : i === 6 ? ' class="pg-rt-h"' : '') + '>' + esc(text(c, 12)) + '</th>'; }).join('') + '</tr></thead>';
    return '<section class="pg-std pg-rost" id="pg-team-rosters" aria-labelledby="pg-team-rosters-t">' + pgHeadSec('pg-team-rosters', text(R.label, 40), text(R.note, 160)) + '<div class="pg-std-grid">' + teams.map(function (t) {
      var id = pgStdId('pg-rt-', t.name);
      return '<div class="pg-std-team" id="' + id + '"><h3 id="' + id + '-t">' + esc(text(t.name, 30)) + (text(t.note, 80) ? ' <small>' + esc(text(t.note, 80)) + '</small>' : '') + '</h3><table class="pg-std-t pg-rt" role="table" aria-labelledby="' + id + '-t">' + head +
        list(t.groups, 6).filter(Array.isArray).map(function (g) {
          var rows = list(g[1], 90).filter(Array.isArray);
          if (!rows.length) return '';
          return '<tbody role="rowgroup"><tr role="row" class="pg-rt-g"><th role="rowheader" scope="rowgroup" colspan="7" aria-colspan="7">' + esc(text(g[0], 30)) + '</th></tr>' + rows.map(function (p) {
            return '<tr role="row"><td role="cell" class="pg-rt-n">' + esc(text(p[0], 3)) + '</td><th role="rowheader" scope="row">' + esc(text(p[1], 60)) + '</th><td role="cell">' + esc(text(p[2], 6)) + '</td><td role="cell">' + esc(text(p[3], 6)) + '</td><td role="cell">' + esc(text(p[4], 6)) + '</td><td role="cell">' + esc(text(p[5], 4)) + '</td><td role="cell" class="pg-rt-h">' + esc(text(p[6], 40)) + '</td></tr>';
          }).join('') + '</tbody>';
        }).join('') + '</table></div>';
    }).join('') + '</div>' + pgStdSrc(R.source) + '</section>';
  }
  /* Magazine-only stories (owner direction, Nov. 20, 2026: "add them as magazine only"). Full-text pieces that run in the issue and are
   * not posts on the site, laid out like the lead column. Opt-in by data, same as the standards above:
   *   exclusives = { label, note, jump, items: [{ kicker, title, dek, author, date, html, image, caption }] }
   * html is issue copy and keeps only the tags the lead column keeps (p, a, strong, em, blockquote, h3), with site-relative links. */
  // Game day (Nov. 21, 2026): an issue whose shots block says top: true runs the photo mosaic right under the jump strip instead of at
  // the end of the page. The mosaic itself is the layout's own pgShots; these two only choose where it goes.
  function pgShotsTop(D) { var B = obj(D.shots); return B && B.top ? pgShots(D) : ''; }
  function pgShotsEnd(D) { var B = obj(D.shots); return B && B.top ? '' : pgShots(D); }
  // Two blocks of full stories share one shape and one renderer: issue.features (the writers' own pieces, word for word as
  // published, ids pg-feat-N) and issue.exclusives (stories written for the issue, ids pg-excl-N). A story may run without a photo.
  function pgStoryItems(X) {
    X = obj(X);
    return X ? list(X.items, 6).map(obj).filter(function (s) { return s && text(s.title, 200) && text(s.html, 20000); }) : [];
  }
  function pgExclItems(D) { return pgStoryItems(D.exclusives); }
  function pgExclusives(D) { return pgStories(D.exclusives, 'pg-exclusives', 'pg-excl-'); }
  function pgFeatures(D) { return pgStories(D.features, 'pg-features', 'pg-feat-'); }
  function pgStories(X, secId, prefix) {
    X = obj(X); var items = pgStoryItems(X);
    if (!items.length) return '';
    return '<section class="pg-excl" id="' + secId + '" aria-labelledby="' + secId + '-t">' + pgHeadSec(secId, text(X.label, 40), text(X.note, 160)) + items.map(function (s, i) {
      var id = prefix + (i + 1), fig = frame(s.image, { main: 1200, sizes: '(max-width: 900px) 100vw, 780px' });
      var clean = String(s.html).replace(/<(?!\/?(?:p|a|strong|em|blockquote|h3)\b)[^>]*>/gi, '').replace(/<a\b(?![^>]*href="\/)[^>]*>/gi, '<a>');
      return '<article class="pg-lead pg-feature" id="' + id + '" aria-labelledby="' + id + '-h"><header><span class="pg-kick">' + esc(text(s.kicker, 80)) + '</span><h2 id="' + id + '-h">' + esc(text(s.title, 200)) + '</h2>' +
        (text(s.dek, 300) ? '<p class="pg-dek">' + esc(text(s.dek, 300)) + '</p>' : '') + '<p class="pg-by">By ' + esc(text(s.author, 60)) + (text(s.date, 40) ? ' \u00b7 ' + esc(text(s.date, 40)) : '') + '</p></header>' +
        (fig ? '<figure class="pg-fig">' + fig + '<figcaption>' + esc(text(s.caption, 200)) + (s.image && text(s.image.credit, 160) ? ' <span>' + esc(text(s.image.credit, 160)) + '</span>' : '') + '</figcaption></figure>' : '') +
        '<div class="pg-prose">' + clean + '</div></article>';
    }).join('') + '</section>';
  }
