/*! GatorBait magazine subscribe prompt v1 (Nov. 3, 2026). Adapted from the PR #471 sign-up lightbox design.
 * /magazine only. Invites visitors who are NOT signed in to start the 7-day free trial on the existing /pricing-plans page, or to sign in.
 * Fail closed: a member, an unknown login state or a still-hydrating login bar never sees it. It never hides or locks the issue.
 * It collects nothing, makes no network request, sets no cookie, opens no popup window. Both calls to action are plain same-tab links.
 * Vanilla JS, ASCII only, no dependencies. Rollback: disable the one loader embed (see deploy/magazine-subscribe-20261103/README.md).
 */
(function () {
  'use strict';
  var W = window;
  if (W.__gbmMagSub && W.__gbmMagSub.ready) { try { W.__gbmMagSub.sync(); } catch (e) {} return; }

  var CFG = {
    version: 'magazine-subscribe-1',
    subscribeUrl: '/pricing-plans?utm_source=site&utm_medium=lightbox&utm_campaign=magazine_prompt', // the plans page the whole site already links to
    signInUrl: '/account/my-account',                                                               // the same sign-in link the site header uses
    settleTicks: 6,        // the "visitor" reading must hold for 6 ticks (3 s) before anything shows
    delay: 8000,           // visible dwell before it may appear without a scroll
    minDelay: 4000,        // never earlier than this, even after a fast scroll
    scrollPx: 0.5,         // "meaningful scroll" = this many viewport heights
    dismissDays: 7,        // Not now
    closeDays: 1,          // X, Esc, tap outside (desktop)
    followDays: 7,         // followed the Subscribe link
    memberDays: 30,        // a member reading is remembered this long (re-read after that)
    bannerWaitMs: 15000    // wait this long for the cookie banner to be answered before sitting above it
  };
  var override = W.GBM_MAGSUB_CFG; // QA only; production never defines it
  if (override && typeof override === 'object') for (var k in override) if (Object.prototype.hasOwnProperty.call(override, k)) CFG[k] = override[k];

  var DAY = 86400000;
  var K_DISMISS = 'gbm-msub-dismissed', K_CLOSE = 'gbm-msub-closed', K_FOLLOW = 'gbm-msub-followed', K_MEMBER = 'gbm-msub-member', K_SESSION = 'gbm-msub-session';
  var ROUTE = /^\/magazine\/?$/i;
  // Live site scripts (embeds a13b04e3 and the header embed) hide ANY role=dialog / aria-modal box whose text contains these words, to suppress the native Wix newsletter popup.
  // Nothing in this prompt's copy may contain them ("Subscriptions" is fine, "Subscribe" is not). Checked in qa.js.
  var HIDE_WORDS = /(newsletter|subscribe|gatorbait magazine|gatorbait weekly|today'?s edition|todays edition)/i;
  var mem = {}, settled = 0, memberTicks = 0, shown = false, root = null, mode = '', lastFocus = null, visibleMs = 0, timer = 0, bannerSince = 0, quietUntil = 0, lastPath = '';

  /* ---------- storage that survives being blocked (memory fallback, no cookies) ---------- */
  function get(store, key) {
    try { var v = W[store].getItem(key); if (v !== null) return v; } catch (e) {}
    return mem[store + key] === undefined ? null : mem[store + key];
  }
  function put(store, key, val) {
    mem[store + key] = val;
    try { W[store].setItem(key, val); } catch (e) {}
  }
  function recent(key, days) { var t = Number(get('localStorage', key)); return !!t && Date.now() - t < days * DAY && Date.now() >= t - 60000; }

  /* ---------- environment ---------- */
  function query() { try { return new URLSearchParams(location.search); } catch (e) { return { get: function () { return null; } }; } }
  function phone() { return (W.innerWidth || 0) <= 820 || Math.min(W.innerWidth || 0, (screen && screen.width) || 9999) <= 820; }
  function forced() { return query().get('gbm_msub') === '1'; }
  function routeOk() { return ROUTE.test(location.pathname || '/'); }
  function bannerEl() {
    var e = document.querySelector('[data-hook="consent-banner-root"],#consent-policy-manager-container');
    return e && e.offsetHeight > 0 ? e : null;
  }
  function issueTitle() { // the current issue's own headline, read from the page so the copy never goes stale; empty when unsure
    try {
      var h = document.querySelector('#gbm-magazine-page h1'), t = h ? (h.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (t.length >= 3 && t.length <= 60 && !/[<>{}]/.test(t) && !/^gatorbait/i.test(t) && !HIDE_WORDS.test(t)) return t;
    } catch (e) {}
    return '';
  }

  /* ---------- member signal ----------
   * The Wix session cookie is httpOnly. The Site API host module (authentication.loggedIn) exists only for Wix CLI embedded scripts,
   * and the Members SDK needs Wix OAuth/Velo, so neither is reachable from a Settings > Custom Code embed (Wix docs, Nov. 3, 2026).
   * Used here, all read-only from the page:
   *   1. the Wix login bar button: "Log In" for visitors, the member's name once signed in;
   *   2. two server-rendered hints (viewerModel siteMembers.smToken, sessionManager.sessionModel member ids): they can only HIDE the prompt.
   * Never observed signed in (no member login available). Anything but a settled, positive "Log In" reading means: do not show. */
  function loginBar() {
    var b = document.querySelector('.wixui-login-social-bar [data-testid="handle-button"]');
    if (!b) return { present: false, text: '', aria: '', img: false };
    return { present: true, text: (b.textContent || '').replace(/\s+/g, ' ').trim(), aria: b.getAttribute('aria-label') || '', img: !!b.querySelector('img[src]') };
  }
  function sessionHint() {
    try {
      var f = (W.viewerModel && W.viewerModel.siteFeaturesConfigs) || {}, sm = f.siteMembers || {}, m = (f.sessionManager && f.sessionManager.sessionModel) || {};
      if (sm.smToken) return 'siteMembers.smToken';
      if (m.smToken || m.siteMemberId || m.memberId) return 'sessionModel';
    } catch (e) {}
    return '';
  }
  function memberState() {
    if (mem.member || recent(K_MEMBER, CFG.memberDays)) return 'member';
    if (sessionHint()) return 'member';
    var lb = loginBar();
    if (!lb.present || (!lb.text && !lb.aria)) return 'unknown'; // no login bar, or still hydrating
    if (/^(log|sign)\s*in$/i.test(lb.text)) return lb.img ? 'unknown' : 'visitor';
    return 'member'; // the bar is present and no longer offers Log In
  }
  function cookieNames() { try { return document.cookie ? document.cookie.split('; ').map(function (c) { return c.split('=')[0]; }) : []; } catch (e) { return []; } }

  function busy() {
    var a = document.activeElement;
    if (a && root && root.contains(a)) return false;
    if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return true;
    var d = document.querySelectorAll('[role="dialog"],[aria-modal="true"]'), i;
    for (i = 0; i < d.length; i++) if (!(root && root.contains(d[i])) && d[i].offsetHeight > 0 && getComputedStyle(d[i]).visibility !== 'hidden') return true;
    var c = document.querySelectorAll('[data-gbm-capture$="-prompt"],#gbm-su,#gbm-share.on'); // the 55-second free-email invitation, the PR #471 lightbox, Share
    for (i = 0; i < c.length; i++) if (c[i].offsetHeight > 0 && getComputedStyle(c[i]).visibility !== 'hidden' && !(c[i].closest && c[i].closest('#gbc-bar.aside'))) return true; // a prompt tucked aside (hidden) does not count
    return false;
  }
  function suppressReason() {
    if (mem.member || recent(K_MEMBER, CFG.memberDays)) return 'member'; // never bypassed, not even by ?gbm_msub=1
    if (forced()) return '';
    if (recent(K_DISMISS, CFG.dismissDays)) return 'dismissed';
    if (recent(K_CLOSE, CFG.closeDays)) return 'closed';
    if (recent(K_FOLLOW, CFG.followDays)) return 'followed';
    if (get('sessionStorage', K_SESSION)) return 'session';
    return '';
  }

  /* ---------- UI ---------- */
  var CSS = '' +
    '#gbm-msub,#gbm-msub *{box-sizing:border-box}' +
    '#gbm-msub{position:fixed;left:0;right:0;top:0;bottom:0;z-index:2147482000;font-family:Barlow,sans-serif;pointer-events:none;-webkit-text-size-adjust:100%}' +
    '#gbm-msub .ms-scrim{position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(6,20,68,.62);pointer-events:auto;touch-action:none;opacity:0;transition:opacity .2s}' +
    '#gbm-msub .ms-card{position:absolute;pointer-events:auto;background:#fff;color:#061444;border-top:4px solid #fa4616;box-shadow:0 12px 40px rgba(6,20,68,.38);outline:none;max-height:calc(100% - 24px);overflow:auto;-webkit-overflow-scrolling:touch;opacity:0;transform:translateY(12px);transition:opacity .2s,transform .2s,bottom .2s}' +
    '#gbm-msub.ms-on .ms-scrim,#gbm-msub.ms-on .ms-card{opacity:1;transform:none}' +
    '#gbm-msub.ms-center .ms-card{left:50%;top:calc(50% - var(--ms-b,0px)/2);width:calc(100% - 32px);max-width:460px;padding:26px 26px 14px;border-radius:10px;transform:translate(-50%,-46%)}' +
    '#gbm-msub.ms-center.ms-on .ms-card{transform:translate(-50%,-50%)}' +
    '#gbm-msub.ms-sheet .ms-scrim{display:none}' +
    '#gbm-msub.ms-sheet .ms-card{left:0;right:0;bottom:var(--ms-b,0px);width:100%;max-width:560px;margin:0 auto;padding:12px 16px calc(6px + env(safe-area-inset-bottom,0px));border-radius:14px 14px 0 0;max-height:60%}' +
    '#gbm-msub .ms-x{position:absolute;right:2px;top:2px;width:44px;height:44px;border:0;background:transparent;color:#061444;font:400 30px/44px Barlow,sans-serif;cursor:pointer;border-radius:8px;padding:0;margin:0}' +
    '#gbm-msub .ms-tag{margin:0 48px 4px 0;font:700 13px/1.2 Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#35466f}' +
    '#gbm-msub h2{margin:0 48px 6px 0;font:800 26px/1.1 Barlow,sans-serif;color:#061444;letter-spacing:-.01em}' +
    '#gbm-msub.ms-sheet h2{font-size:22px;margin-bottom:4px}' +
    '#gbm-msub .ms-p{margin:0 0 12px;font:400 17px/1.4 Barlow,sans-serif;color:#061444}' +
    '#gbm-msub.ms-sheet .ms-p{font-size:15px;margin-bottom:10px}' +
    '#gbm-msub .ms-p b{font-weight:700}' +
    '#gbm-msub a.ms-go{display:flex;align-items:center;justify-content:center;min-height:48px;width:100%;padding:10px 16px;border-radius:8px;background:#061444;color:#fff!important;font:700 18px/1.15 Barlow,sans-serif;text-align:center;text-decoration:none!important}' +
    '#gbm-msub.ms-sheet a.ms-go{font-size:17px}' +
    '#gbm-msub .ms-fine{margin:8px 0 0;font:400 13px/1.35 Barlow,sans-serif;color:#35466f}' +
    '#gbm-msub .ms-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;flex-wrap:wrap}' +
    '#gbm-msub .ms-foot a,#gbm-msub .ms-later{display:inline-flex;align-items:center;min-height:44px;padding:0 6px;font:600 16px/1.1 Barlow,sans-serif;color:#061444!important;text-decoration:underline;background:transparent;border:0;cursor:pointer;margin:0}' +
    '#gbm-msub a:focus-visible,#gbm-msub button:focus-visible{outline:3px solid #0021a5;outline-offset:2px;box-shadow:0 0 0 2px #fff}' +
    '#gbm-msub .ms-card:focus,#gbm-msub .ms-card:focus-visible{outline:none}' +
    '@media (prefers-reduced-motion:reduce){#gbm-msub .ms-scrim,#gbm-msub .ms-card{transition:none}}' +
    '@media (max-width:360px){#gbm-msub h2{font-size:21px}#gbm-msub .ms-p{font-size:14px}}';

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function link(cls, text, href) { var a = el('a', cls, text); a.href = href; return a; } // same tab: no target, no window.open

  function build(m) {
    if (!document.getElementById('gbm-msub-css')) { var s = el('style'); s.id = 'gbm-msub-css'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s); }
    root = el('div', 'ms-' + m); root.id = 'gbm-msub'; root.setAttribute('data-gbm-msub', CFG.version);
    var scrim = el('div', 'ms-scrim'); scrim.setAttribute('data-ms-close', 'close');
    var card = el('div', 'ms-card'); card.setAttribute('role', 'dialog'); card.setAttribute('aria-labelledby', 'gbm-msub-h'); card.setAttribute('aria-describedby', 'gbm-msub-d'); card.tabIndex = -1;
    if (m === 'center') card.setAttribute('aria-modal', 'true');
    var x = el('button', 'ms-x', '\u00d7'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.setAttribute('data-ms-close', 'close');
    var h = el('h2', '', 'Never miss a magazine issue'); h.id = 'gbm-msub-h';
    var p = el('p', 'ms-p'); p.id = 'gbm-msub-d';
    var t = issueTitle();
    if (t) { p.appendChild(document.createTextNode('Current issue: ')); p.appendChild(el('b', '', t)); p.appendChild(document.createTextNode('. Join GatorBait to read every issue.')); }
    else p.appendChild(document.createTextNode('Join GatorBait to read every issue of the magazine.'));
    var go = link('ms-go', 'Start your 7-day free trial', CFG.subscribeUrl); go.setAttribute('data-ms-go', 'subscribe');
    var fine = el('p', 'ms-fine', '$0 today, then $99 per year or $9.99 per month. Renews until canceled. Cancel in My Account, My Subscriptions.');
    var foot = el('div', 'ms-foot'); var si = link('', 'Already a member? Sign in', CFG.signInUrl); si.setAttribute('data-ms-go', 'signin');
    var later = el('button', 'ms-later', 'Not now'); later.type = 'button'; later.setAttribute('data-ms-close', 'dismiss');
    foot.appendChild(si); foot.appendChild(later);
    if (m === 'center') card.appendChild(el('div', 'ms-tag', 'GatorBait Media'));
    card.appendChild(x); card.appendChild(h); card.appendChild(p); card.appendChild(go); card.appendChild(fine); card.appendChild(foot);
    root.appendChild(scrim); root.appendChild(card);
    root.addEventListener('click', onClick);
    document.body.appendChild(root);
    return card;
  }

  function placeAbove() {
    if (!root) return;
    var px = 0, list = [bannerEl(), document.getElementById('gbm-gd10-bar')], i, r, cs;
    for (i = 0; i < list.length; i++) { // sit above the cookie banner (and the game-day bar when present); never over their buttons
      if (!list[i] || !list[i].offsetHeight) continue;
      cs = getComputedStyle(list[i]); if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      r = list[i].getBoundingClientRect(); if (r.top > (W.innerHeight || 600) * 0.4) px = Math.max(px, (W.innerHeight || 600) - r.top);
    }
    root.style.setProperty('--ms-b', px + 'px');
  }

  function open(m) {
    mode = m; shown = true;
    put('sessionStorage', K_SESSION, String(Date.now()));
    lastFocus = document.activeElement;
    var card = build(m);
    placeAbove();
    try { W.requestAnimationFrame(function () { if (root) root.classList.add('ms-on'); }); } catch (e) { root.classList.add('ms-on'); }
    try { card.focus({ preventScroll: true }); } catch (e) { card.focus(); }
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocusIn, true);
    W.addEventListener('resize', placeAbove);
    track('shown');
  }

  function close(kind) {
    if (!root) return;
    var now = String(Date.now());
    if (kind === 'dismiss') put('localStorage', K_DISMISS, now);
    if (kind === 'close') put('localStorage', K_CLOSE, now);
    if (kind === 'dismiss' || kind === 'close') put('localStorage', 'gbm-capture-dismissed', now); // keep the 55-second free-email invitation quiet after any dismissal
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('focusin', onFocusIn, true);
    W.removeEventListener('resize', placeAbove);
    var r = root; root = null; if (r.parentNode) r.parentNode.removeChild(r);
    if (lastFocus && lastFocus.focus && document.contains(lastFocus) && (kind === 'dismiss' || kind === 'close')) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    track(kind === 'dismiss' ? 'not_now' : kind);
  }

  function onClick(ev) {
    var t = ev.target && ev.target.closest ? ev.target.closest('[data-ms-close],[data-ms-go]') : null;
    if (!t) return;
    if (t.hasAttribute('data-ms-close')) { ev.preventDefault(); close(t.getAttribute('data-ms-close')); return; }
    var which = t.getAttribute('data-ms-go');
    if (which === 'subscribe') put('localStorage', K_FOLLOW, String(Date.now()));
    track('go_' + which);
    ev.stopPropagation(); // keep the platform link handler (it re-opens links through window.open) out: plain native same-tab navigation
  }

  function onFocusIn(ev) {
    if (!root || mode !== 'center' || root.contains(ev.target)) return;
    var f = root.querySelector('a[href],button:not([disabled])'); if (f) f.focus();
  }

  function onKey(ev) {
    if (!root) return;
    if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); close('close'); return; }
    if (ev.key !== 'Tab' || mode !== 'center') return; // the phone sheet is non-modal on purpose; the desktop dialog traps focus
    var f = [].slice.call(root.querySelectorAll('a[href],button:not([disabled])')).filter(function (n) { return n.offsetHeight > 0; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (!root.contains(a) || a === root.querySelector('.ms-card')) { ev.preventDefault(); (ev.shiftKey ? last : first).focus(); return; }
    if (ev.shiftKey && a === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && a === last) { ev.preventDefault(); first.focus(); }
  }

  // Browser events only (a local array; nothing is sent unless a tag manager forwards dataLayer). No identifiers, no address.
  function track(name) {
    try { (W.dataLayer = W.dataLayer || []).push({ event: 'gbm_magazine_prompt', gbm_action: name, gbm_mode: mode }); } catch (e) {}
    try { document.documentElement.setAttribute('data-gbm-msub-last', name); } catch (e) {}
  }

  /* ---------- timing ---------- */
  function scrolled() { return (W.pageYOffset || document.documentElement.scrollTop || 0) >= CFG.scrollPx * (W.innerHeight || 600); }
  function stopTimer() { if (timer) { clearInterval(timer); timer = 0; } }
  function tick() {
    if (!document.body) return;
    if (!routeOk()) { close('route'); stopTimer(); return; }
    var ms = memberState();
    if (root) { // while open: a member reading closes it at once and for good
      if (ms === 'member') { mem.member = 1; close('member'); stopTimer(); return; }
      placeAbove();
      return;
    }
    if (shown) { stopTimer(); return; }
    if (!document.hidden) visibleMs += 500;
    if (visibleMs > 600000) { stopTimer(); return; }
    if (ms === 'member') { // hide immediately; remember only after two consecutive readings so one odd frame cannot lock a visitor out for 30 days
      memberTicks++; settled = 0;
      if (memberTicks >= 2) { mem.member = 1; put('localStorage', K_MEMBER, String(Date.now())); stopTimer(); }
      return;
    }
    memberTicks = 0;
    if (ms === 'visitor' && document.readyState === 'complete') settled++; else settled = 0; // unknown / hydrating: keep watching, show nothing
    if (!(forced() ? visibleMs >= CFG.minDelay : (visibleMs >= CFG.delay || (visibleMs >= CFG.minDelay && scrolled())))) return;
    if (suppressReason()) return;
    if (busy()) { quietUntil = Date.now() + 8000; return; } // another prompt or dialog is up: let it finish, then wait a beat so two never run back to back
    if (Date.now() < quietUntil) return;
    if (settled < CFG.settleTicks) return;
    var ban = bannerEl();
    if (ban) {
      if (!bannerSince) bannerSince = Date.now();
      if (Date.now() - bannerSince < CFG.bannerWaitMs) return; // give the visitor time to answer the cookie banner
    }
    open(phone() ? 'sheet' : 'center');
  }

  function start() {
    if (timer || shown || !routeOk() || suppressReason()) return;
    if (lastPath !== location.pathname) { lastPath = location.pathname; visibleMs = 0; settled = 0; memberTicks = 0; bannerSince = 0; }
    timer = setInterval(tick, 500);
  }
  function sync() { if (routeOk()) start(); else { stopTimer(); close('route'); } }

  function debug() {
    var lb = loginBar();
    return {
      version: CFG.version, path: location.pathname, routeOk: routeOk(),
      member: memberState(), loginBar: lb, sessionHint: sessionHint() || '', cookieNames: cookieNames(),
      suppressed: suppressReason(), banner: !!bannerEl(), busy: busy(), issueTitle: issueTitle(),
      visibleMs: visibleMs, settled: settled, mode: mode, open: !!root, shownThisLoad: shown
    };
  }

  W.__gbmMagSub = { ready: true, version: CFG.version, sync: sync, debug: debug };
  W.addEventListener('popstate', sync);
  W.addEventListener('gbmroutechange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
