/* Forward previously shared season-book links to GatorBait membership. */
(function () {
  if (new URLSearchParams(window.location.search).get('book') === 'sumrall-year-one') {
    window.location.replace('/pricing-plans/subscribe');
  }
})();
