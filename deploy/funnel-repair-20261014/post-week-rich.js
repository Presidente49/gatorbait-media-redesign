(function () {
  if (window.__GBM_WEEK_RICH__) { window.__GBM_WEEK_RICH__.start(); return; }
  var observer, expiry, queued;
  function recent() {
    var canonical = document.querySelector('link[rel="canonical"]');
    var published = document.querySelector('meta[property="article:published_time"]');
    if (canonical) {
      try {
        var url = new URL(canonical.href, location.href);
        if (url.origin !== location.origin || url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '')) return false;
      } catch (_) { return false; }
      var stamp = Date.parse(published && published.content);
      if (Number.isFinite(stamp)) {
        var age = Date.now() - stamp;
        return age >= 0 && age <= 7 * 86400000;
      }
    }
    var label = document.querySelector('[data-hook=post-page] article[data-hook=post] header [data-hook=time-ago]');
    var text = (label && label.textContent || '').toLowerCase();
    if (/just now|minute|hour|today|yesterday/.test(text)) return true;
    var days = text.match(/(\d+)\s*day/);
    return !!days && +days[1] <= 7;
  }
  function run() {
    queued = 0;
    var active = /^\/post\//.test(location.pathname || '') && recent();
    document.documentElement.toggleAttribute('data-gbm-week-rich', active);
    var paragraphs = document.querySelectorAll('[data-hook=post-page] [data-hook=post-description] p');
    var chosen = null;
    if (active) for (var i = 0; i < paragraphs.length; i++) {
      var text = (paragraphs[i].textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length >= 80 && !/^by\s+/i.test(text) && !/^(photo|image|source|statistics|stats|tags?)\b/i.test(text)) { chosen = paragraphs[i]; break; }
    }
    for (var j = 0; j < paragraphs.length; j++) {
      if (paragraphs[j].classList.contains('gbm-dropcap') !== (paragraphs[j] === chosen)) paragraphs[j].classList.toggle('gbm-dropcap', paragraphs[j] === chosen);
    }
  }
  function schedule() { if (!queued) queued = setTimeout(run, 0); }
  function start() {
    if (observer) observer.disconnect();
    clearTimeout(expiry); clearTimeout(queued); queued = 0;
    run();
    if (!/^\/post\//.test(location.pathname || '')) return;
    observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['content', 'href']});
    expiry = setTimeout(function () { observer.disconnect(); clearTimeout(queued); queued = 0; }, 30000);
  }
  window.__GBM_WEEK_RICH__ = {start: start};
  window.addEventListener('popstate', start);
  window.addEventListener('gbmroutechange', start);
  start();
})();
