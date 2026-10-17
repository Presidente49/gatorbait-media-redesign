/* Staged only. No button is added until the verified support destination is enabled.
 * This module adds one CTA to existing GatorBait headers; it does not own a header.
 * Activation follows the reviewed offer and fulfillment procedure in README.md.
 */
(function () {
  'use strict';
  var config = window.GBM_READER_SUPPORT;
  if (!config || config.enabled !== true || !config.approvalReference || !config.fulfillmentVerified || !config.supportUrl) return;
  var destination;
  try { destination = new URL(config.supportUrl, location.origin); } catch (_) { return; }
  if (destination.origin !== location.origin || destination.protocol !== 'https:' || destination.username || destination.password) return;
  if (window.__GBM_READER_SUPPORT_LINK__) return;
  window.__GBM_READER_SUPPORT_LINK__ = true;

  var style = document.createElement('style');
  style.id = 'gbm-reader-support-link-styles';
  style.textContent = '.gbm-reader-support-link{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:44px;padding:10px 15px;border:1px solid #ad3307;border-radius:4px;background:#bd3d0b;color:#fff!important;text-decoration:none!important;font:700 14px/1.15 Barlow,Arial,sans-serif;white-space:nowrap;box-sizing:border-box}.gbm-reader-support-link:hover{background:#942d08}.gbm-reader-support-link:focus-visible{outline:3px solid #125db5;outline-offset:3px}.gbm-reader-support-link svg{width:14px;height:18px;flex:none}#gbm-mobile-shell .gbm-reader-support-link{padding:8px 10px;font-size:12px;flex:none}#gbm-mobile-shell:has(.gbm-reader-support-link){gap:7px}#gbm-mobile-shell:has(.gbm-reader-support-link) .gbm-ms-logo{min-width:0;width:min(160px,40vw)}#gbm-mobile-shell:has(.gbm-reader-support-link) .gbm-ms-trigger{min-width:54px;padding:0 8px}#gbm-mobile-shell:has(.gbm-reader-support-link) .gbm-ms-bars{display:none}';
  document.head.appendChild(style);

  function link(mobile) {
    var a = document.createElement('a');
    a.className = 'gbm-reader-support-link';
    a.href = destination.href;
    a.setAttribute('aria-label', 'Support GatorBait');
    a.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 30" fill="none"><path d="M13 1C15 8 22 10 22 18a10 10 0 1 1-20 0c0-4 2-8 6-12 0 5 1 7 3 8 3-4 3-8 2-13Z" fill="currentColor"/></svg><span>' + (mobile ? 'Support' : 'Support GatorBait') + '</span>';
    return a;
  }
  function sync() {
    document.querySelectorAll('#gbm-site-header .sh-brand,#gbm-live .sh-header .sh-brand').forEach(function (brand) {
      if (brand.querySelector('.gbm-reader-support-link')) return;
      var join = brand.querySelector('.sh-join');
      brand.insertBefore(link(false), join || null);
    });
    var shell = document.getElementById('gbm-mobile-shell');
    if (shell && !shell.querySelector('.gbm-reader-support-link')) shell.insertBefore(link(true), shell.querySelector('.gbm-ms-trigger'));
  }
  var timers = [];
  function schedule() {
    timers.forEach(clearTimeout);
    timers = [0, 200, 800, 1800, 4000, 8000].map(function (ms) { return setTimeout(sync, ms); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true }); else schedule();
  window.addEventListener('gbmroutechange', schedule);
  window.addEventListener('popstate', schedule);
  document.addEventListener('gbm:gazette-ready', schedule);
})();
