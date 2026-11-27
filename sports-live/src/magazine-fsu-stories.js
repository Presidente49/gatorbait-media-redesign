
  /* Florida–Florida State digital edition. This renderer keeps coverage links next to their game-day references. */
  function pgFsuStorySlots(D) {
    var slots = [{ id: 'pg-lead', story: D.lead }, { id: 'pg-feature', story: D.feature }];
    [['pg-feat-', D.features], ['pg-excl-', D.exclusives]].forEach(function (group) {
      list((obj(group[1]) || {}).items, 24).forEach(function (story, i) {
        slots.push({ id: group[0] + (i + 1), story: story });
      });
    });
    return slots.filter(function (slot) { return obj(slot.story) && safeUrl(slot.story.url) && text(slot.story.title, 240); });
  }
  function pgFsuMast(D) {
    var I = obj(D.issue) || {};
    return '<header class="fsu-mast"><a class="fsu-brand" href="/" aria-label="GatorBait Media home">GatorBait <span>Magazine</span></a>' +
      '<p>' + esc(text(I.date, 60)) + '<span>' + esc(text(I.week, 120)) + '</span></p>' +
      '<nav aria-label="Magazine"><a href="#fsu-contents">Articles</a><a href="#pg-game">Game-day guide</a></nav></header>';
  }
  function pgFsuCover(D, lead) {
    var C = obj(D.cover) || {}, art = frame(C.image, { eager: true, main: 800, sizes: '(max-width: 520px) 94vw, 480px' });
    return '<section class="pg-cover pg-poster fsu-cover" id="pg-cover" aria-labelledby="pg-cover-h"><h1 class="pg-hide" id="pg-cover-h">' + esc(text(C.headline, 200)) + '</h1>' +
      '<a class="pg-cover-fig" href="' + esc(safeUrl(lead.story.url)) + '" aria-label="Read ' + esc(text(lead.story.title, 240)) + '">' + art + '</a></section>';
  }
  function pgFsuStory(slot, guide, front) {
    var s = slot.story, id = slot.id, lead = id === 'pg-lead';
    var image = frame(s.image, { main: 480, sizes: '(max-width: 520px) 90px, 108px' });
    var photoCredit = s.image && text(s.image.credit, 160);
    var dek = (lead || !front) && text(s.dek, 340);
    var authorPrefix = text(s.author, 80) + ': ';
    if (dek && dek.indexOf(authorPrefix) === 0) dek = dek.slice(authorPrefix.length);
    var widgets = guide.filter(function (widget) { return widget.story === id || widget.alsoFor === id; });
    var related = widgets.length ? '<nav class="fsu-related" aria-label="Related game-day widgets">' + widgets.map(function (widget) {
      return '<a href="#' + widget.id + '">' + esc(widget.label) + '</a>';
    }).join('') + '</nav>' : '';
    return '<article class="fsu-story' + (lead ? ' fsu-lead' : '') + '" id="' + id + '"><a class="fsu-story-link" href="' + esc(safeUrl(s.url)) + '" aria-labelledby="' + id + '-h">' +
      '<div class="fsu-story-copy"><h3 id="' + id + '-h">' + esc(text(s.title, 240)) + '</h3>' +
      '<p class="fsu-by">' + esc(text(s.author, 80)) + (text(s.date, 60) ? ' <span>· ' + esc(text(s.date, 60)) + '</span>' : '') + '</p>' +
      (dek ? '<p class="fsu-dek">' + esc(dek) + '</p>' : '') + '</div>' +
      (image ? '<figure class="fsu-story-art">' + image + (photoCredit ? '<figcaption>' + esc(photoCredit) + '</figcaption>' : '') + '</figure>' : '') + '</a>' + related + '</article>';
  }
  function pgFsuGuide(D) {
    return [
      { story: 'pg-feat-3', id: 'pg-game', label: 'Kickoff and TV', source: 'Read the game guide', html: pgGame(D), place: 'spread' },
      { story: 'pg-feature', id: 'pg-numbers', label: 'By the numbers', source: 'Read Behind the Sticks', html: pgNumbers(D), place: 'rail' },
      { story: 'pg-lead', id: 'pg-slate', label: 'Rivalry Week picks', source: 'Read the Soothsayer', html: pgSlate(D), folded: true },
      { story: 'pg-feature', id: 'pg-tape', label: 'Tale of the tape', source: 'Read Behind the Sticks', html: pgTape(D), half: true },
      { story: 'pg-feat-2', id: 'pg-injuries', label: 'Availability report', source: 'Read Loren Meadows’ analysis', html: pgInjuries(D), half: true },
      { story: 'pg-feat-2', id: 'pg-keys', label: 'Keys to the game', source: 'Read Loren Meadows’ analysis', html: pgKeys(D) },
      { story: 'pg-feat-3', id: 'pg-series', label: 'The series', source: 'Read the game guide', html: pgSeries(D) },
      { story: 'pg-feat-3', id: 'pg-team-schedules', label: 'Both schedules', source: 'Read the game guide', html: pgTeamSchedules(D) },
      { story: 'pg-excl-4', alsoFor: 'pg-feat-2', id: 'pg-team-rosters', label: 'Both rosters', source: 'Read Eddie Gilley’s column', html: pgTeamRosters(D) }
    ].filter(function (widget) { return widget.html; });
  }
  function pgFsuWidget(widget, stories) {
    var slot = stories.find(function (item) { return item.id === widget.story; });
    var source = slot ? '<a class="fsu-widget-source" href="' + esc(safeUrl(slot.story.url)) + '">' + esc(widget.source) + ' <span aria-hidden="true">↗</span></a>' : '';
    if (widget.folded) return '<details class="fsu-widget"><summary>' + esc(widget.label) + '</summary>' + widget.html + source + '</details>';
    return '<div class="fsu-widget' + (widget.half ? ' fsu-widget-half' : '') + '">' + widget.html + source + '</div>';
  }
  function renderFsuStories(D) {
    var stories = pgFsuStorySlots(D), guide = pgFsuGuide(D);
    function renderCards(slots, front) { return slots.map(function (slot) { return pgFsuStory(slot, guide, front); }).join(''); }
    function renderGuide(place) { return guide.filter(function (w) { return (w.place || 'reference') === place; }).map(function (widget) { return pgFsuWidget(widget, stories); }).join(''); }
    return '<div class="pg-wrap fsu-article-edition">' + pgFsuMast(D) +
      '<div class="fsu-spread">' + pgFsuCover(D, stories[0]) + '<section class="fsu-paper fsu-contents" id="fsu-contents" aria-labelledby="fsu-contents-h"><h2 id="fsu-contents-h">In this issue</h2>' +
      renderCards(stories.slice(0, 1), true) + '<div class="fsu-front-grid">' + renderCards(stories.slice(1, 5), true) + '</div></section>' + renderGuide('spread') + '</div>' +
      '<div class="fsu-coverage"><section class="fsu-paper fsu-more" aria-labelledby="fsu-more-h"><h2 id="fsu-more-h">More in this issue</h2><div class="fsu-story-grid">' + renderCards(stories.slice(5), false) + '</div></section>' +
      '<aside class="fsu-sidebar" aria-label="Matchup statistics">' + renderGuide('rail') + '</aside></div>' +
      '<section class="fsu-reference" aria-labelledby="fsu-reference-h"><h2 id="fsu-reference-h">Game-day reference</h2><div class="fsu-reference-grid">' + renderGuide('reference') + '</div></section>' + pgFoot(D) + '</div>';
  }
