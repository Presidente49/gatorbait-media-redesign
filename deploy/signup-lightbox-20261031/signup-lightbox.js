/*! GatorBait sign-up lightbox v1 (Oct. 31, 2026).
 * Invites visitors who are not signed-in members to the EXISTING free GatorBait email form
 * (Wix hosted form, double opt-in, unchecked consent) or the existing Join path.
 * It collects nothing, stores no address, makes no network request, and opens no popup:
 * both calls to action are plain same-tab links. Vanilla JS, no dependencies.
 * Rollback: remove the loader embed. See deploy/signup-lightbox-20261031/README.md.
 */
(function () {
  'use strict';
  if (window.__gbmSignupLightbox) return;
  window.__gbmSignupLightbox = true;

  var CFG = {
    version: 'signup-lightbox-1',
    formUrl: 'https://buddymartinshow.wixforms.com/f/7517931185469654016', // existing native free-email form
    joinUrl: '/pricing-plans?utm_source=site&utm_medium=lightbox&utm_campaign=signup_lightbox',
    signInUrl: '/account/my-account',
    settleTicks: 6,       // the visitor signal must hold for 6 ticks (3 s) before anything shows: Wix serves cached anonymous HTML, then hydrates members
    delay: 10000,         // visible dwell before it may appear without a scroll
    minDelay: 4000,       // never earlier than this, even if the visitor scrolls fast
    scrollPx: 0.6,        // "meaningful scroll" = this many viewport heights
    dismissDays: 7,       // "Not now"
    doneDays: 30,         // visitor followed the free-email link
    bannerWaitMs: 25000   // wait this long for the cookie banner to be answered before sitting above it
  };
  var override = window.GBM_SIGNUP_CFG; // QA only; production never defines it
  if (override && typeof override === 'object') for (var k in override) if (Object.prototype.hasOwnProperty.call(override, k)) CFG[k] = override[k];

  var DAY = 86400000;
  var K_DISMISS = 'gbm-su-dismissed', K_DONE = 'gbm-su-done', K_MEMBER = 'gbm-su-member', K_SESSION = 'gbm-su-session';
  var EXCLUDED = /^\/(pricing-plans|signin|sign-in|login|account|my-account|members|checkout|cart|thank-you|thankyou|payment)(\/|$)/i;
  var mem = {}, settled = 0, shownThisRuntime = false, root = null, mode = '', lastFocus = null, ticks = 0, visibleMs = 0, timer = 0, bannerSince = 0;

  /* ---------- storage that survives being blocked (social in-app browsers) ---------- */
  function cookieGet(n) {
    try { var m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; }
  }
  function cookieSet(n, v, days) {
    try { document.cookie = n + '=' + encodeURIComponent(v) + (days ? '; max-age=' + Math.round(days * 86400) : '') + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) {}
  }
  function get(store, key) {
    try { var v = window[store].getItem(key); if (v !== null) return v; } catch (e) {}
    var c = cookieGet(key.replace(/-/g, '_')); if (c !== null && (store === 'localStorage' || key === K_SESSION)) return c;
    return mem[store + key] === undefined ? null : mem[store + key];
  }
  function put(store, key, val, days) {
    mem[store + key] = val;
    try { window[store].setItem(key, val); } catch (e) {}
    cookieSet(key.replace(/-/g, '_'), val, store === 'localStorage' ? days : 0);
  }
  function recent(key, days) { var t = Number(get('localStorage', key)); return !!t && Date.now() - t < days * DAY && Date.now() >= t - 60000; }

  /* ---------- environment ---------- */
  function query() { try { return new URLSearchParams(location.search); } catch (e) { return { get: function () { return null; } }; } }
  function phone() { return Math.min(window.innerWidth || 0, screen && screen.width || 9999) <= 820 || window.innerWidth <= 820; }
  function forced() { return query().get('gbm_su') === '1'; }
  function routeOk() { return !EXCLUDED.test(location.pathname || '/'); }
  function searchReferrer() { return /^https?:\/\/([a-z0-9-]+\.)*(google|bing|duckduckgo|ecosia|yahoo)\.[a-z.]+(\/|$)/i.test(document.referrer || ''); }
  function bannerEl() {
    var e = document.querySelector('[data-hook="consent-banner-root"],#consent-policy-manager-container');
    return e && e.offsetHeight > 0 ? e : null;
  }
  function liveGame() {
    var scope = document.getElementById('gbm-live') || document;
    if (scope.querySelector('[data-game-state="live"],[data-state="live"],[data-status="live"],.gbm-game-live,.is-live')) return true;
    var n = scope.querySelectorAll('[class*="live" i]'), i, t;
    for (i = 0; i < n.length && i < 40; i++) { t = (n[i].textContent || '').trim(); if (t.length < 12 && /^live( now)?$/i.test(t) && n[i].offsetHeight > 0) return true; }
    return false;
  }
  // Member signal: the Wix login bar renders a "Log In" button for visitors and the member's name/avatar once signed in.
  // The Wix session cookie is httpOnly, so script cannot read it.
  function memberState() {
    if (get('localStorage', K_MEMBER)) return 'member';
    var btns = document.querySelectorAll('.wixui-login-social-bar [data-testid="handle-button"],[data-testid="handle-button"]');
    for (var i = 0; i < btns.length; i++) {
      var t = (btns[i].textContent || '').replace(/\s+/g, ' ').trim();
      if (!t && !btns[i].getAttribute('aria-label')) continue; // still hydrating
      if (/^(log|sign)\s*in$/i.test(t)) return 'visitor';
      return 'member'; // bar is present and no longer offers Log In
    }
    return 'unknown';
  }
  function busy() {
    var a = document.activeElement;
    if (a && root && root.contains(a)) return false;
    if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return true;
    var d = document.querySelectorAll('[role="dialog"],[aria-modal="true"]'), i;
    for (i = 0; i < d.length; i++) if (!(root && root.contains(d[i])) && d[i].offsetHeight > 0 && getComputedStyle(d[i]).visibility !== 'hidden') return true;
    var c = document.querySelector('[data-gbm-capture$="-prompt"]'); // the earlier 55-second invitation
    return !!(c && c.offsetHeight > 0);
  }

  /* ---------- eligibility ---------- */
  function suppressed() {
    if (mem.memberSeen || get('localStorage', K_MEMBER)) return true; // never bypassed, not even by ?gbm_su=1
    if (forced()) return false;
    if (recent(K_DISMISS, CFG.dismissDays) || recent(K_DONE, CFG.doneDays)) return true;
    if (get('sessionStorage', K_SESSION)) return true;
    if (recent('gbm-capture-dismissed', CFG.dismissDays) || get('localStorage', 'gbm-capture-joined') || get('localStorage', 'gbm-capture-pending')) return true;
    return false;
  }

  /* ---------- UI ---------- */
  var CSS = '' +
    '#gbm-su,#gbm-su *{box-sizing:border-box}' +
    '#gbm-su{position:fixed;left:0;right:0;top:0;bottom:0;z-index:2147482000;font-family:Barlow,Arial,sans-serif;pointer-events:none;-webkit-text-size-adjust:100%}' +
    '#gbm-su .su-scrim{position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,.55);pointer-events:auto;touch-action:none;opacity:0;transition:opacity .2s}' +
    '#gbm-su .su-card{position:absolute;pointer-events:auto;background:#fff;color:#111;border-top:6px solid #FA4616;box-shadow:0 12px 40px rgba(0,0,0,.35);outline:none;max-height:calc(100% - 24px);overflow:auto;-webkit-overflow-scrolling:touch;opacity:0;transform:translateY(12px);transition:opacity .2s,transform .2s}' +
    '#gbm-su.su-on .su-scrim,#gbm-su.su-on .su-card{opacity:1;transform:none}' +
    '#gbm-su.su-center .su-card{left:50%;top:50%;width:calc(100% - 32px);max-width:440px;padding:26px 24px 18px;border-radius:10px;transform:translate(-50%,-46%)}' +
    '#gbm-su.su-center.su-on .su-card{transform:translate(-50%,-50%)}' +
    '#gbm-su.su-sheet .su-scrim{display:none}' +
    '#gbm-su.su-sheet .su-card{left:0;right:0;bottom:var(--su-b,0px);width:100%;max-width:560px;margin:0 auto;padding:14px 16px calc(8px + env(safe-area-inset-bottom,0px));border-radius:14px 14px 0 0;max-height:60%}' +
    '#gbm-su .su-x{position:absolute;right:4px;top:4px;width:44px;height:44px;border:0;background:transparent;color:#111;font:400 30px/44px Barlow,Arial,sans-serif;cursor:pointer;border-radius:8px;padding:0;margin:0}' +
    '#gbm-su .su-tag{display:flex;align-items:center;gap:7px;margin:0 44px 6px 0;font:700 13px/1.2 Barlow,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#0021A5}' +
    '#gbm-su .su-tag:before{content:"";width:8px;height:8px;border-radius:50%;background:#22884C;display:inline-block}' +
    '#gbm-su h2{margin:0 44px 8px 0;font:800 28px/1.08 Barlow,Arial,sans-serif;color:#0021A5;letter-spacing:-.01em}' +
    '#gbm-su.su-sheet h2{font-size:22px;margin-bottom:4px}' +
    '#gbm-su .su-p{margin:0 0 14px;font:400 17px/1.4 Barlow,Arial,sans-serif;color:#111}' +
    '#gbm-su.su-sheet .su-p{font-size:15px;margin-bottom:10px}' +
    '#gbm-su .su-btns{display:flex;flex-direction:column;gap:10px}' +
    '#gbm-su.su-sheet .su-btns{flex-direction:row}' +
    '#gbm-su a.su-btn{display:flex;align-items:center;justify-content:center;min-height:48px;padding:10px 16px;border-radius:8px;font:700 18px/1.15 Barlow,Arial,sans-serif;text-align:center;text-decoration:none!important;border:2px solid #0021A5;flex:1 1 0}' +
    '#gbm-su a.su-go{background:#0021A5;color:#fff!important}' +
    '#gbm-su a.su-alt{background:#fff;color:#0021A5!important}' +
    '#gbm-su.su-sheet a.su-btn{font-size:16px;min-height:46px;padding:8px 10px}' +
    '#gbm-su .su-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;flex-wrap:wrap}' +
    '#gbm-su .su-foot a,#gbm-su .su-later{display:inline-flex;align-items:center;min-height:44px;padding:0 6px;font:600 16px/1.1 Barlow,Arial,sans-serif;color:#0021A5!important;text-decoration:underline;background:transparent;border:0;cursor:pointer;margin:0}' +
    '#gbm-su .su-later{color:#111!important}' +
    '#gbm-su a:focus-visible,#gbm-su button:focus-visible{outline:3px solid #FA4616;outline-offset:2px}#gbm-su .su-card:focus,#gbm-su .su-card:focus-visible{outline:none}' +
    '@media (prefers-reduced-motion:reduce){#gbm-su .su-scrim,#gbm-su .su-card{transition:none}}' +
    '@media (max-width:360px){#gbm-su h2{font-size:24px}#gbm-su.su-sheet .su-btns{flex-direction:column}}';

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function link(cls, text, href) { var a = el('a', cls, text); a.href = href; return a; } // same tab: no target, no window.open

  function build(m) {
    if (!document.getElementById('gbm-su-css')) { var s = el('style'); s.id = 'gbm-su-css'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s); }
    root = el('div', 'su-' + m); root.id = 'gbm-su'; root.setAttribute('data-gbm-signup', CFG.version);
    var scrim = el('div', 'su-scrim'); scrim.setAttribute('data-su-close', 'session');
    var card = el('div', 'su-card'); card.setAttribute('role', 'dialog'); card.setAttribute('aria-labelledby', 'gbm-su-h'); card.setAttribute('aria-describedby', 'gbm-su-d'); card.tabIndex = -1;
    if (m === 'center') card.setAttribute('aria-modal', 'true');
    var x = el('button', 'su-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.setAttribute('data-su-close', 'session');
    var h = el('h2', '', 'Get GatorBait in your inbox'); h.id = 'gbm-su-h';
    var p = el('p', 'su-p', 'Gators news, analysis and game-day updates. Free. Stop anytime with one click.'); p.id = 'gbm-su-d';
    var btns = el('div', 'su-btns');
    var go = link('su-btn su-go', 'Get the free email', CFG.formUrl); go.setAttribute('data-su-go', 'email');
    var alt = link('su-btn su-alt', 'Join GatorBait', CFG.joinUrl); alt.setAttribute('data-su-go', 'join');
    btns.appendChild(go); btns.appendChild(alt);
    var foot = el('div', 'su-foot'); var si = link('', 'Already a member? Sign in', CFG.signInUrl); si.setAttribute('data-su-go', 'signin');
    var later = el('button', 'su-later', 'Not now'); later.type = 'button'; later.setAttribute('data-su-close', 'later');
    foot.appendChild(si); foot.appendChild(later);
    if (m === 'center') card.appendChild(el('div', 'su-tag', 'Free · GatorBait Media'));
    card.appendChild(x); card.appendChild(h); card.appendChild(p); card.appendChild(btns); card.appendChild(foot);
    root.appendChild(scrim); root.appendChild(card);
    root.addEventListener('click', onClick);
    document.body.appendChild(root);
    return card;
  }

  function placeAboveBanner() {
    if (!root) return;
    var px = 0, list = [bannerEl(), document.getElementById('gbm-gd10-bar')], i, r, cs;
    if (mode === 'sheet') for (i = 0; i < list.length; i++) { // sit above the cookie banner and the orange game-day bar
      if (!list[i] || !list[i].offsetHeight) continue;
      cs = getComputedStyle(list[i]); if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      r = list[i].getBoundingClientRect(); if (r.top > window.innerHeight * 0.4) px = Math.max(px, window.innerHeight - r.top);
    }
    root.style.setProperty('--su-b', px + 'px');
  }

  function open(m) {
    mode = m; shownThisRuntime = true;
    put('sessionStorage', K_SESSION, String(Date.now()));
    lastFocus = document.activeElement;
    var card = build(m);
    placeAboveBanner();
    try { window.requestAnimationFrame(function () { if (root) root.classList.add('su-on'); }); } catch (e) { root.classList.add('su-on'); }
    try { card.focus({ preventScroll: true }); } catch (e) { card.focus(); }
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', placeAboveBanner);
    track('shown');
  }

  function close(kind) {
    if (!root) return;
    if (kind === 'later') put('localStorage', K_DISMISS, String(Date.now()), CFG.dismissDays);
    if (kind === 'later') put('localStorage', 'gbm-capture-dismissed', String(Date.now()), CFG.dismissDays); // keep the older 55-second invitation quiet too
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', placeAboveBanner);
    var r = root; root = null; r.parentNode && r.parentNode.removeChild(r);
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    track(kind === 'later' ? 'not_now' : 'closed');
  }

  function onClick(ev) {
    var t = ev.target && ev.target.closest ? ev.target.closest('[data-su-close],[data-su-go]') : null;
    if (!t) return;
    if (t.hasAttribute('data-su-close')) { ev.preventDefault(); close(t.getAttribute('data-su-close')); return; }
    // Followed a link: browser navigates in this tab. Remember it so the visitor is not asked again right away.
    var which = t.getAttribute('data-su-go');
    if (which === 'email' || which === 'join') put('localStorage', K_DONE, String(Date.now()), CFG.doneDays);
    track('go_' + which);
  }

  function onKey(ev) {
    if (!root) return;
    if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); close('session'); return; }
    if (ev.key !== 'Tab' || mode !== 'center') return; // the small sheet is non-modal on purpose
    var f = [].slice.call(root.querySelectorAll('a[href],button:not([disabled])')).filter(function (n) { return n.offsetHeight > 0; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (!root.contains(a) || a === root.querySelector('.su-card')) { ev.preventDefault(); (ev.shiftKey ? last : first).focus(); return; }
    if (ev.shiftKey && a === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && a === last) { ev.preventDefault(); first.focus(); }
  }

  // Browser events only (same pattern as the other homepage modules). Not proof of a confirmed subscriber.
  function track(name) {
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'gbm_signup_lightbox', gbm_action: name, gbm_mode: mode }); } catch (e) {}
    try { document.documentElement.setAttribute('data-gbm-signup-last', name); } catch (e) {}
  }

  /* ---------- timing ---------- */
  function scrolled() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    return y >= CFG.scrollPx * (window.innerHeight || 600);
  }
  function tick() {
    ticks++;
    if (!document.body) return;
    if (root) {
      if (memberState() === 'member') { put('localStorage', K_MEMBER, String(Date.now()), 365); close('member'); stop(); return; }
      if (!routeOk()) close('route'); else placeAboveBanner();
      return;
    }
    if (shownThisRuntime) { stop(); return; }
    if (!document.hidden) visibleMs += 500;
    if (visibleMs > 600000) { stop(); return; }
    if (!(forced() ? visibleMs >= CFG.minDelay : (visibleMs >= CFG.delay || (visibleMs >= CFG.minDelay && scrolled())))) return;
    if (!routeOk() || suppressed() || busy()) return;
    // Members are never asked. The signal must be a settled, positive "visitor" (login bar rendered and offering Log In, seen on
    // settleTicks consecutive ticks); a member, a missing/still-hydrating login bar or any doubt means: do not show, keep watching.
    var ms = memberState();
    if (ms === 'member') { put('localStorage', K_MEMBER, String(Date.now()), 365); mem.memberSeen = 1; stop(); return; }
    if (ms !== 'visitor' || document.readyState !== 'complete') { settled = 0; return; }
    if (++settled < CFG.settleTicks) return;
    var ban = bannerEl(), m;
    if (ban) {
      if (!bannerSince) bannerSince = Date.now();
      if (Date.now() - bannerSince < CFG.bannerWaitMs) return; // give the visitor time to answer the cookie banner
    }
    m = (phone() || searchReferrer() || liveGame() || ban) ? 'sheet' : 'center'; // phones, Google entries, the live game and an open cookie banner get the small bottom sheet
    open(m);
  }
  function stop() { if (timer) { clearInterval(timer); timer = 0; } }

  function start() {
    if (suppressed()) return;
    timer = setInterval(tick, 500);
  }

  window.__gbmSignup = {
    debug: function () { return { version: CFG.version, member: memberState(), routeOk: routeOk(), suppressed: suppressed(), banner: !!bannerEl(), live: liveGame(), search: searchReferrer(), visibleMs: visibleMs, mode: mode, open: !!root }; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
