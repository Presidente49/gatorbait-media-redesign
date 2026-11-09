/* GatorBait Magazine, digital edition loader (Nov. 9, 2026; was the Swamp Night loader).
 * Mounts the digital-edition page (magazine/swamp-night/index.html; the Nov. 7 pregame page is kept as pregame-20261107.html, same commit as this file) inside a same-origin
 * blob-URL iframe on /magazine only. Contract is the existing one: one root #gbm-magazine-page, html.gbm-magazine-live
 * while mounted, window.__GBM_MAG26__ {sync, ready, build, version}; removed on every other route.
 * Resources resolve against the pinned jsDelivr directory this script itself was loaded from (document.currentScript),
 * so page, CSS, JS and fonts all come from one immutable commit. If anything fails, ready stays false and the loader's
 * 8-second fallback restores the native page. */
(function () {
  'use strict';
  var BUILD = 'digital-edition-20261109', VERSION = '3';
  if (window.__GBM_MAG26__) { window.__GBM_MAG26__.sync(); return; }
  var cs = document.currentScript, SRC = (cs && cs.src) || '';
  var BASE = SRC.replace(/sports-live\/[^\/?#]*(?:[?#].*)?$/, 'magazine/swamp-night/');
  var doc = document.documentElement, timers = [], retries = [250, 800, 2000], seq = 0, ro = null;
  var CSS = '#gbm-magazine-page.sn26{display:block;position:relative;z-index:3;width:100%;min-width:0;margin:0;padding:0;background:#080f1a;overflow:hidden}' +
    '#gbm-magazine-page.sn26 iframe{display:block;width:100%;max-width:100%;border:0;background:#080f1a;min-height:480px}';
  function onRoute() { return /^\/magazine\/?$/.test(location.pathname || ''); }
  function styles() {
    if (document.getElementById('gbm-sn26-style')) return;
    var s = document.createElement('style'); s.id = 'gbm-sn26-style'; s.textContent = CSS; document.head.appendChild(s);
  }
  function place(m) {
    var anchor = document.getElementById('gbm-mobile-shell-host') || document.getElementById('gbm-site-header');
    if (anchor && anchor.parentNode === document.body) document.body.insertBefore(m, anchor.nextSibling);
    else document.body.insertBefore(m, document.body.firstChild);
  }
  function wire(m, f, my) {
    var d = f.contentDocument; if (!d || !d.body || my !== seq) return;
    function size() {
      var h = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight);
      if (h > 0 && Math.abs(h - (parseFloat(f.style.height) || 0)) > 1) f.style.height = h + 'px';
    }
    size();
    if (ro) { try { ro.disconnect(); } catch (_) {} ro = null; }
    if (window.ResizeObserver) { ro = new ResizeObserver(size); ro.observe(d.body); ro.observe(d.documentElement); }
    window.addEventListener('resize', size);
    d.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null; if (!a) return;
      var h = a.getAttribute('href') || '';
      if (h.charAt(0) === '#' && h.length > 1) {
        e.preventDefault();
        var t = d.getElementById(decodeURIComponent(h.slice(1)));
        if (t) {
          var y = t.getBoundingClientRect().top + f.getBoundingClientRect().top + (window.pageYOffset || 0) - 72;
          window.scrollTo(0, Math.max(0, y));
          if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
          try { t.focus({ preventScroll: true }); } catch (_) {}
        }
      } else if (/^https?:/i.test(h)) {
        a.setAttribute('rel', 'noopener noreferrer'); a.setAttribute('target', '_blank');
      }
    });
    try { if (d.title) document.title = d.title; } catch (_) {}
    window.__GBM_MAG26__.ready = true;
  }
  function mount() {
    if (!onRoute()) return;
    var old = document.getElementById('gbm-magazine-page');
    if (old && old.isConnected) return;
    if (old) old.remove();
    styles();
    var my = ++seq;
    var m = document.createElement('main'); m.id = 'gbm-magazine-page'; m.className = 'mz26 sn26';
    m.setAttribute('aria-label', 'GatorBait Magazine: Swamp Night'); m.setAttribute('data-mz-build', BUILD); m.setAttribute('data-mz-version', VERSION);
    var f = document.createElement('iframe');
    f.title = 'GatorBait Magazine, Florida vs. Oklahoma pregame edition'; f.setAttribute('scrolling', 'no'); f.style.height = '3200px';
    m.appendChild(f); place(m); doc.classList.add('gbm-mq', 'gbm-magazine-live');
    fetch(BASE + 'index.html', { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error('page ' + r.status); return r.text();
    }).then(function (html) {
      if (my !== seq || !m.isConnected) return;
      f.addEventListener('load', function () { wire(m, f, my); }, { once: true });
      var blob = new Blob([html.replace(/<head>/i, '<head><base href="' + BASE + '" target="_blank">')], { type: 'text/html' });
      f.src = URL.createObjectURL(blob);
    }).catch(function (error) {
      window.__GBM_MAG26__.error = String(error);
      if (m.parentNode) m.remove(); doc.classList.remove('gbm-mq', 'gbm-magazine-live');
    });
  }
  function start() {
    mount();
    timers.forEach(clearTimeout);
    timers = retries.map(function (ms) { return setTimeout(function () { if (onRoute()) mount(); }, ms); });
  }
  function sync() {
    if (onRoute()) { start(); return; }
    timers.forEach(clearTimeout); timers = []; seq++;
    if (ro) { try { ro.disconnect(); } catch (_) {} ro = null; }
    var root = document.getElementById('gbm-magazine-page'); if (root) root.remove();
    doc.classList.remove('gbm-magazine-live', 'gbm-mq');
    window.__GBM_MAG26__.ready = false;
  }
  window.__GBM_MAG26__ = { sync: sync, ready: false, build: BUILD, version: VERSION };
  window.addEventListener('popstate', sync);
  window.addEventListener('gbmroutechange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();

