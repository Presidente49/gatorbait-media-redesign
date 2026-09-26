#!/usr/bin/env python3
"""Build Wix-served (self-contained) homepage + Magazine embeds.

Readers no longer fetch any GitHub/jsDelivr asset: the approved renderers are
inlined into the existing Wix custom embeds, and stories still come from the
site's own same-origin /blog-feed.xml. Sources are pinned commits, so the
output is deterministic.
"""
import json, pathlib, subprocess

HOME_PIN = '485b38a036431c667584aa3990922772288399f3'   # live homepage/magazine pin (rev68/rev26)
UI_PIN = 'f0a2deca30b8080b10efa8216f308414b7a95636'     # live native-route UI layer pin
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).resolve().parent


def show(pin, path):
    return subprocess.check_output(['git', 'show', f'{pin}:{path}'], cwd=ROOT, text=True)


def js_fn(src):
    assert '</script' not in src.lower()
    return 'function(){\n' + src + '\n}'


home_js = show(HOME_PIN, 'sports-live/homepage.js')
mag_js = show(HOME_PIN, 'automation/site-design/magazine.js')
ui_js = show(UI_PIN, 'newsroom-preview/wix-live-ui.js')
ui_css = show(UI_PIN, 'newsroom-preview/wix-live-ui.css')
shell = (OUT / 'shell-and-account.html').read_text()

STARTUP = '''<style id="gbm-gazette-startup-v1">
html:has(#gbm-gazette-bundle) #BACKGROUND_GROUP{display:none!important}
html:has(#gbm-gazette-bundle) #SITE_HEADER,html:has(#gbm-gazette-bundle) #SITE_PAGES,html:has(#gbm-gazette-bundle) #PAGES_CONTAINER{display:none!important}
html:has(#gbm-gazette-bundle) #SITE_CONTAINER,html:has(#gbm-gazette-bundle) #masterPage,html:has(#gbm-gazette-bundle) #SITE_PAGES_TRANSITION_GROUP{height:0!important;min-height:0!important;padding-block:0!important;margin-block:0!important}
html:has(#gbm-gazette-bundle):not(:has(#gbm-live)) #gbm-footer{visibility:hidden!important}
</style>'''

BOOT = '''<script id="gbm-gazette-bootstrap-v2">(function () {
  'use strict';
  if (window.__GBM_GAZETTE_BOOT__) return;
  var initialHome = (location.pathname.replace(/\\/+$/, '') || '/') === '/';
  var timer, done = false;
  function uiLayer() {
    window.__GBM_STANDALONE_NEWSROOM__ = 0;
    window.__GBM_UI_LAYER__ = 0;
    var style = document.createElement('style'); style.id = 'gbm-ui-layer-css'; style.textContent = window.__GBM_UI_CSS__ || ''; document.head.appendChild(style);
    try { if (window.__GBM_UI_JS__) window.__GBM_UI_JS__(); } catch (error) { console.warn('[GatorBait] UI layer', error); }
  }
  function ready() { done = true; clearTimeout(timer); }
  // Failure never leaves a blank page or redirects: reveal the native Wix homepage.
  function fallback(error) {
    if (done || !initialHome) return;
    done = true; clearTimeout(timer);
    console.warn('[GatorBait] Showing native homepage', error && String(error));
    ['gbm-live', 'gbm-gazette-bundle'].forEach(function (id) { var el = document.getElementById(id); if (el) el.remove(); });
  }
  window.__GBM_GAZETTE_BOOT__ = { ready: ready, fallback: fallback };
  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var a = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
    var target; try { target = new URL(a.href, location.href); } catch (_) { return; }
    if (target.origin !== location.origin || !/^https?:$/.test(target.protocol)) return;
    var targetHome = (target.pathname.replace(/\\/+$/, '') || '/') === '/';
    if (targetHome !== initialHome) { event.preventDefault(); event.stopImmediatePropagation(); location.assign(target.href); }
  }, true);
  function route() {
    var nowHome = (location.pathname.replace(/\\/+$/, '') || '/') === '/';
    if (nowHome !== initialHome) location.reload();
  }
  window.addEventListener('popstate', route);
  window.addEventListener('gbmroutechange', route);
  if (!initialHome) { uiLayer(); return; }
  window.__GBM_EDITORIAL_FILTER_V1__ = 1;
  window.__GBM_STANDALONE_NEWSROOM__ = 1;
  window.__GBM_UI_LAYER__ = 1;
  var marker = document.createElement('script');
  marker.id = 'gbm-gazette-bundle'; marker.type = 'text/plain';
  document.head.appendChild(marker);
  timer = setTimeout(function () { fallback('startup timeout'); }, 7000);
  try { window.__GBM_HOME_JS__(); } catch (error) { fallback(error); }
})();</script>'''

BUNDLE = ('<script id="gbm-wix-served-bundle-v1">window.__GBM_UI_CSS__=' + json.dumps(ui_css)
          + ';\nwindow.__GBM_UI_JS__=' + js_fn(ui_js)
          + ';\nwindow.__GBM_HOME_JS__=' + js_fn(home_js) + ';</script>')

home = '<!-- GBM_SPORTS_HOME_PRODUCTION_V2_WIX_SERVED src=' + HOME_PIN[:7] + ' ui=' + UI_PIN[:7] + ' -->' + STARTUP + BUNDLE + BOOT + shell
(OUT / 'homepage-embed.html').write_text(home)

mag_head = (OUT / 'magazine-style.html').read_text()
assert '</script' not in mag_js.lower()
mag = mag_head + '<script id="gbm-magazine-wix-served-v1">\n' + mag_js + '\n</script>'
(OUT / 'magazine-embed.html').write_text(mag)
print('homepage', len(home), 'magazine', len(mag))
