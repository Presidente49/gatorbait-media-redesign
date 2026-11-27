  /* Nov. 27 FSU story-first edition. Function-only: the shared runtime mounts before appended statements run. */
  function pgFsuStoryItems(X) {
    X = obj(X);
    return X ? list(X.items, 24).map(obj).filter(function (s) { return s && text(s.title, 200) && typeof s.html === 'string' && s.html.trim(); }) : [];
  }
  function pgFsuStorySlots(D) {
    var slots = [];
    if (obj(D.lead)) slots.push({ id: 'pg-lead', story: D.lead });
    if (obj(D.feature)) slots.push({ id: 'pg-feature', story: D.feature });
    pgFsuStoryItems(D.features).forEach(function (s, i) { slots.push({ id: 'pg-feat-' + (i + 1), story: s }); });
    pgFsuStoryItems(D.exclusives).forEach(function (s, i) { slots.push({ id: 'pg-excl-' + (i + 1), story: s }); });
    return slots;
  }
  function pgFsuProseUrl(value) {
    try {
      var raw = String(value || '').trim(); if (!raw) return '';
      var u = new URL(raw, SITE);
      if (u.protocol !== 'https:' || u.username || u.password) return '';
      if (raw.charAt(0) === '#') return u.hash;
      return safeUrl(raw) || u.href;
    } catch (_) { return ''; }
  }
  function pgFsuProse(value) {
    var box = document.createElement('div'); box.innerHTML = String(value || '');
    box.querySelectorAll('script,style,iframe,video,audio,object,embed,template,noscript').forEach(function (n) { n.remove(); });
    function clean(parent) {
      Array.from(parent.childNodes).forEach(function (n) {
        if (n.nodeType === 8) { n.remove(); return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName.toLowerCase(), href = tag === 'a' ? pgFsuProseUrl(n.getAttribute('href')) : '', blank = n.getAttribute('target') === '_blank';
        clean(n);
        if (!/^(p|a|strong|em|b|i|blockquote|h2|h3|h4|ul|ol|li|br)$/.test(tag) || (tag === 'a' && !href)) {
          while (n.firstChild) parent.insertBefore(n.firstChild, n);
          n.remove(); return;
        }
        Array.from(n.attributes).forEach(function (a) { n.removeAttribute(a.name); });
        if (tag === 'a') { n.setAttribute('href', href); if (blank) { n.setAttribute('target', '_blank'); n.setAttribute('rel', 'noopener noreferrer'); } }
      });
    }
    clean(box);
    var first = box.firstElementChild;
    if (first && first.tagName === 'P' && /^(?:photo|illustration|cover(?: image| photo)?|image|artwork|graphic)(?:\s*:|\s+by\b|\s+courtesy\b)/i.test(first.textContent.trim())) first.className = 'fsu-native-credit';
    return box.innerHTML;
  }
  function pgFsuStory(slot, widgets) {
    var s = slot.story, id = slot.id, image = frame(s.image, { main: 1200, sizes: '(max-width: 900px) 100vw, 780px' }), figure = frame(s.figure, { main: 1200, sizes: '(max-width: 900px) 100vw, 780px' });
    var prose = pgFsuProse(s.html), nativeCredit = prose.indexOf('class="fsu-native-credit"') !== -1;
    function cap(im, note) { return '<figcaption>' + esc(text(note, 300)) + (!nativeCredit && im && text(im.credit, 240) ? ' <span>' + esc(text(im.credit, 240)) + '</span>' : '') + '</figcaption>'; }
    var kicker = text(s.kicker, 120) || text(s.label, 80), url = pgFsuProseUrl(s.url);
    var related = widgets.length ? '<nav class="fsu-related" aria-label="Game-day reference">' + pgFsuWidgetLinks(widgets) + '</nav>' : '';
    return '<article class="pg-lead pg-feature fsu-story" id="' + id + '" aria-labelledby="' + id + '-h"><header>' + (kicker ? '<span class="pg-kick">' + esc(kicker) + '</span>' : '') + '<h2 id="' + id + '-h">' + esc(text(s.title, 240)) + '</h2>' + (text(s.dek, 600) ? '<p class="pg-dek">' + esc(text(s.dek, 600)) + '</p>' : '') + '<p class="pg-by">By ' + esc(text(s.author, 80)) + (text(s.date, 60) ? ' · ' + esc(text(s.date, 60)) : '') + '</p>' + related + '</header>' +
      (image ? '<figure class="pg-fig">' + image + cap(s.image, s.caption) + '</figure>' : '') + '<div class="pg-prose">' + prose + '</div>' + (figure ? '<figure class="pg-fig">' + figure + cap(s.figure, s.figureCaption) + '</figure>' : '') + (url ? '<a class="pg-btn" href="' + esc(url) + '">' + esc(text(s.continue, 160) || 'Read the original article') + '</a>' : '') + '</article>';
  }
  function pgFsuGuide(D) {
    return [
      { story: 'pg-lead', id: 'pg-slate', label: 'Rivalry Week picks', html: pgSlate(D), folded: true },
      { story: 'pg-feature', id: 'pg-numbers', label: 'By the numbers', html: pgNumbers(D) },
      { story: 'pg-feature', id: 'pg-tape', label: 'Tale of the tape', html: pgTape(D) },
      { story: 'pg-feat-2', id: 'pg-keys', label: 'Keys to the game', html: pgKeys(D) },
      { story: 'pg-feat-2', id: 'pg-injuries', label: 'Injury and availability', html: pgInjuries(D) },
      { story: 'pg-feat-3', id: 'pg-game', label: 'Kickoff and TV', html: pgGame(D) },
      { story: 'pg-feat-3', id: 'pg-series', label: 'The series', html: pgSeries(D) },
      { story: 'pg-feat-3', id: 'pg-team-schedules', label: 'Both schedules', html: pgTeamSchedules(D) },
      { story: 'pg-excl-4', alsoFor: 'pg-feat-2', id: 'pg-team-rosters', label: 'Both rosters', html: pgTeamRosters(D) }
    ].filter(function (widget) { return widget.html; });
  }
  function pgFsuWidgetLinks(widgets) {
    return widgets.map(function (widget) {
      return '<a href="#' + widget.id + '">' + esc(widget.label) + '</a>';
    }).join('');
  }
  function pgFsuWidget(widget) {
    return widget.folded ? '<details class="fsu-picks"><summary>' + esc(widget.label) + '</summary>' + widget.html + '</details>' : widget.html;
  }
  function pgFsuContents(D, stories, guide) {
    var B = obj(D.blackFriday), target = B && text(B.target, 80), validOffer = target && stories.some(function (s) { return s.id === target; }), quick = [];
    function add(id, label) { if (stories.some(function (s) { return s.id === id; })) quick.push({ id: id, label: label }); }
    add('pg-lead', 'The Soothsayer');
    add('pg-feature', 'Behind the Sticks');
    add('pg-feat-1', 'Buddy Martin');
    add('pg-feat-2', 'Pregame analysis');
    add('pg-feat-3', 'Game time & TV');
    return '<nav class="fsu-contents" id="fsu-contents" aria-labelledby="fsu-contents-t"><h2 id="fsu-contents-t">In this magazine</h2><div class="fsu-quick-links">' + quick.map(function (q) { return '<a href="#' + q.id + '">' + esc(q.label) + '</a>'; }).join('') + '</div>' +
      (validOffer ? '<p class="fsu-offer-line"><a href="#' + esc(target) + '">' + esc(text(B.text, 600)) + '</a></p>' : '') +
      '<details class="fsu-all-stories"><summary>All ' + stories.length + ' articles</summary><ol class="fsu-full-toc">' + stories.map(function (slot, i) {
        return '<li><a href="#' + slot.id + '"><span class="fsu-toc-n" aria-hidden="true">' + (i < 9 ? '0' : '') + (i + 1) + '</span><span><b>' + esc(text(slot.story.author, 80)) + '</b><span>' + esc(text(slot.story.title, 240)) + '</span></span></a></li>';
      }).join('') + '</ol></details><details class="fsu-guide-details"><summary>Game-day reference</summary><div class="fsu-guide-toc">' + pgFsuWidgetLinks(guide) + '</div></details></nav>';
  }
  function renderFsuStories(D) {
    var stories = pgFsuStorySlots(D), guide = pgFsuGuide(D);
    var body = stories.map(function (slot) {
      var widgets = guide.filter(function (widget) { return widget.story === slot.id; });
      var links = guide.filter(function (widget) { return widget.story === slot.id || widget.alsoFor === slot.id; });
      return pgFsuStory(slot, links) + widgets.map(pgFsuWidget).join('');
    }).join('');
    return '<div class="pg-wrap fsu-story-first">' + pgTop(D) + pgMast(D) + pgCover(D) + pgFsuContents(D, stories, guide) + '<div class="fsu-complete-stories">' + body + '</div><a class="fsu-back" href="#fsu-contents">Back to contents ↑</a>' + pgFoot(D) + '</div>';
  }
