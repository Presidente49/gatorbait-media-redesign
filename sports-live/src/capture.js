/* Shared website newsletter capture. Static cards keep the existing Wix form,
 * anonymous API client, explicit unchecked consent, anti-spam and double opt-in.
 * A small invitation appears after 55 visible seconds plus reader engagement on
 * home, magazine and article routes. It links to the existing hosted email form;
 * it is not a modal, a membership gate or evidence of a confirmed subscriber.
 * Shown/dismissed invitations are quiet for 14 days in this browser. Legacy joined
 * markers mean confirmation pending, never confirmed. No cross-device identity.
 * Test overrides: window.__GBM_CAPTURE_CFG__ (existing contract). Deploy before
 * legacy copies: existing listeners cannot be safely hot-upgraded in place.
 */
(function () {
  'use strict';
  if (window.GBM_CAPTURE) {
    // Old copies own anonymous listeners/timers. Never hot-upgrade those in place.
    if (window.GBM_CAPTURE.version !== 'capture-2026.2') {
      window.__GBM_CAPTURE_CANDIDATE_BLOCKED__ = 'Existing capture loaded first';
      document.documentElement.setAttribute('data-gbm-capture-blocked', 'legacy-first');
    }
    return;
  }
  var VERSION = 'capture-2026.2';
  var SITE = 'https://www.gatorbaitmedia.com';
  var API = 'https://www.wixapis.com';
  var seed = window.__GBM_CAPTURE_CFG__ || {};
  var CFG = {
    clientId: seed.clientId || '1565816d-bbbc-45c1-b82a-31f10d3e2c71', // headless OAuth client on site 18fb3a4e (public ID)
    formId: seed.formId || '6babfee8-147f-428a-9e14-6b72f6225835', // "GatorBait Email List", double opt-in
    emailField: 'email_gatorbait', consentField: 'subscribe_gatorbait',
    sourceField: seed.sourceField === undefined ? 'signup_source' : seed.sourceField,
    delayMs: Number(seed.delayMs) > 0 ? Number(seed.delayMs) : 55000,
    quietDays: 14,
  };
  var PRIVACY = SITE + '/policies';
  var K_JOINED = 'gbm-capture-joined', K_PENDING = 'gbm-capture-pending', K_SEEN = 'gbm-capture-prompt-seen', K_DISMISSED = 'gbm-capture-dismissed', K_TOKEN = 'gbm-capture-token';
  var SIGNUP = 'https://buddymartinshow.wixforms.com/f/7517931185469654016';
  function now() { return Date.now(); } // visible-time accounting and14-day memory follow the reader's actual clock
  function get(store, k) { try { return window[store].getItem(k); } catch (_) { return null; } }
  function put(store, k, v) { try { window[store].setItem(k, v); } catch (_) {} }
  // Neither a successful submission nor the legacy "joined" marker proves opt-in.
  function pending() { return !!(get('localStorage', K_PENDING) || get('localStorage', K_JOINED)); }
  function quiet() {
    return [K_DISMISSED, K_SEEN].some(function (key) {
      var t = Number(get('localStorage', key));
      return Number.isFinite(t) && t > 0 && now() - t < CFG.quietDays * 864e5;
    });
  }
  function onPost() { return String(location.pathname).indexOf('/post/') === 0; }
  function eligibleRoute() {
    var path = String(location.pathname).replace(/\/$/, '') || '/';
    return path === '/' || path === '/magazine' || /^\/post\//.test(path);
  }

  // This scope also outranks the old article card's explicit mobile colors.
  // Never style a native Wix form or page outside this component.
  var P = ':is(#gbm-live,html) .gbc.gbc-v2[data-gbm-capture]';
  var CSS = [
    P + '{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;contain:inline-size;margin:24px 0!important;padding:24px!important;border:1px solid #ded8cc!important;border-top:3px solid #d14722!important;border-radius:4px!important;background:#fffdf8!important;color:#172c43!important;text-align:left;direction:ltr;font:400 16px/1.5 "Barlow",sans-serif;box-shadow:none!important}',
    P + ' *{box-sizing:border-box}',
    P + ' input,' + P + ' button{font-family:"Barlow",sans-serif}',
    P + ' .gbc-k{display:block!important;margin:0 0 10px!important;padding:0;border:0;font:700 11px/1.2 "Barlow",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a53318!important;-webkit-text-fill-color:#a53318!important}',
    P + ' .gbc-h{margin:0 0 10px!important;padding:0!important;border:0!important;font:700 28px/1.1 "Barlow",sans-serif!important;letter-spacing:-.025em!important;text-transform:none!important;color:#172c43!important;-webkit-text-fill-color:#172c43!important;overflow-wrap:break-word}',
    P + ' .gbc-v{display:block!important;margin:0 0 18px!important;padding:0;font:400 16px/1.5 "Barlow",sans-serif!important;color:#46566a!important;-webkit-text-fill-color:#46566a!important}',
    P + ' form{margin:0;padding:0}',
    P + ' .gbc-l{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    P + ' .gbc-row{display:flex;flex-wrap:wrap!important;gap:8px!important;margin:0 0 12px!important}',
    P + ' input[type=email]{flex:1 1 180px;min-width:0;width:100%;height:48px!important;margin:0;padding:0 12px;border:1px solid #9a9e9f!important;border-radius:3px!important;background:#fff!important;color:#172c43!important;-webkit-text-fill-color:#172c43!important;font:400 17px/1 "Barlow",sans-serif!important}',
    P + ' input[type=email]:focus{outline:3px solid #bb3f1e;outline-offset:2px}',
    P + ' .gbc-b{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:48px!important;margin:0;padding:0 18px!important;border:1px solid #172c43!important;border-radius:3px!important;background:#172c43!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font:700 16px/1 "Barlow",sans-serif!important;letter-spacing:0;text-transform:none;cursor:pointer;white-space:nowrap}',
    P + ' .gbc-b:hover,' + P + ' .gbc-b:focus-visible{background:#294a6b!important;outline:2px solid #bb3f1e;outline-offset:3px}',
    P + ' .gbc-b[disabled]{opacity:.7;cursor:progress}',
    P + ' .gbc-c{display:flex;align-items:flex-start;gap:10px;min-height:44px;margin:0 0 8px!important;padding:4px 0;font:400 14px/1.5 "Barlow",sans-serif!important;color:#46566a!important;-webkit-text-fill-color:#46566a!important;cursor:pointer}',
    P + ' .gbc-c span{font:inherit!important;color:inherit!important;-webkit-text-fill-color:inherit!important}',
    P + ' .gbc-c input{flex:0 0 auto;width:22px;height:22px;margin:0;accent-color:#172c43;cursor:pointer}',
    P + ' .gbc-p{margin:0!important;padding:0;font:400 12px/1.5 "Barlow",sans-serif!important;color:#586477!important;-webkit-text-fill-color:#586477!important}',
    P + ' a,' + P + ' a:visited{color:#172c43!important;-webkit-text-fill-color:#172c43!important;text-decoration:underline;text-decoration-color:#bb3f1e;text-underline-offset:3px}',
    P + ' .gbc-m{margin:12px 0 0!important;padding:0;font:600 15px/1.5 "Barlow",sans-serif!important;color:#172c43!important;-webkit-text-fill-color:#172c43!important}' + P + ' .gbc-m:empty{display:none}',
    P + ' .gbc-m[data-tone=err]{color:#a12616!important;-webkit-text-fill-color:#a12616!important}',
    P + ' .gbc-hp{display:none}',
    P + '[data-state=pending] .gbc-f>:not(.gbc-m){display:none}' + P + '[data-state=pending] .gbc-m{margin:0!important}',
    '#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{margin:0;border-radius:0}',
    '@media(min-width:600px){#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{grid-column:1/-1}}',
    '@media(min-width:821px){#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{grid-column:10/13;order:1}}',
    '#gbc-bar{position:fixed;left:0;right:0;bottom:0;z-index:9990;display:flex;justify-content:center;padding:8px 12px calc(12px + env(safe-area-inset-bottom));pointer-events:none;transform:translateY(110%);transition:transform .2s ease;visibility:hidden}',
    '#gbc-bar.on{transform:none;visibility:visible}#gbc-bar.aside{transform:translateY(110%);visibility:hidden}',
    '#gbc-bar .gbc-prompt{position:relative;pointer-events:auto;width:100%;max-width:560px;padding:18px 56px 18px 20px;border:1px solid #ded8cc;border-top:3px solid #d14722;border-radius:4px;background:#fffdf8;color:#172c43;text-align:left;box-shadow:0 8px 32px #172c4326;font-family:"Barlow",sans-serif}',
    '#gbc-bar .gbc-prompt h2{margin:0 0 5px;color:#172c43;font:700 21px/1.15 "Barlow",sans-serif;letter-spacing:-.02em}',
    '#gbc-bar .gbc-prompt p{margin:0 0 10px;color:#46566a;font:400 14px/1.4 "Barlow",sans-serif}',
    '#gbc-bar .gbc-prompt a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border-radius:3px;background:#172c43;color:#fff;font:700 14px/1 "Barlow",sans-serif;text-decoration:none}',
    '#gbc-bar .gbc-x{position:absolute;top:4px;right:4px;width:44px;height:44px;margin:0;padding:0;border:0;border-radius:3px;background:transparent;color:#172c43;font:400 26px/1 "Barlow",sans-serif;cursor:pointer}',
    '#gbc-bar :is(a,button):focus-visible{outline:3px solid #bb3f1e;outline-offset:2px}',
    '#gbc-bar .gbc-x:hover{background:#eee8df}',
    '#gbm-free-email-utility{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;border:1px solid #cfc7ba;border-radius:3px;color:#172c43!important;background:#fffdf8;font:700 13px/1.2 "Barlow",sans-serif;white-space:nowrap;text-decoration:none}',
    '#gbm-free-email-utility:focus-visible{outline:3px solid #bb3f1e;outline-offset:2px}',
    '#gbm-live.gbm-gazette .sh-header nav #gbm-free-email-utility{padding:0 10px!important;background:#fffdf8!important;color:#172c43!important;font:700 12px/1.2 "Barlow",sans-serif!important;letter-spacing:0!important;text-transform:none!important}',
    '#gbm-free-email-row{display:none}',
    '@media(max-width:820px){#gbm-free-email-row{display:block;position:relative;box-sizing:border-box;height:44px;background:#fffdf8;border-bottom:1px solid #ded8cc}#gbm-free-email-row #gbm-free-email-utility{display:flex;justify-content:center;width:100%;height:44px;min-height:44px;margin:0;padding:0 12px;border:0;border-radius:0;color:#172c43!important;background:#fffdf8!important;font:600 13px/1.2 "Barlow",sans-serif!important}}',
    '#gbm-live .gbc-tv-short{display:none}',
    '@media(max-width:820px){#gbm-live .gbc-tv-long{display:none}#gbm-live .gbc-tv-short{display:inline}#gbm-live.fp26 .fp-links:has(#gbm-free-email-utility){gap:12px}#gbm-free-email-utility{padding-inline:8px;font-size:12px}#gbm-live.fp26 .fp-nav:has(#gbm-free-email-utility) .fp-nav-identity{display:none}}',
    '@media(max-width:600px){' + P + '{padding:20px!important}' + P + ' .gbc-h{font-size:25px!important}' + P + ' .gbc-b{flex:1 1 auto}#gbc-bar .gbc-prompt{padding:14px 48px 14px 16px}#gbc-bar .gbc-prompt h2{font-size:19px}}',
    '@media(prefers-reduced-motion:reduce){#gbc-bar{transition:none}}'
  ].join('');
  function css() {
    if (document.getElementById('gbm-capture-css')) return;
    var s = document.createElement('style'); s.id = 'gbm-capture-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- The component ---------- */
  var COPY = {
    kicker: 'Free GatorBait email updates',
    head: 'Stay close to the Gators.',
    value: "Florida reporting, Buddy Martin's columns and the stories behind game week, delivered by email.",
    consent: 'Yes, email me GatorBait Magazine and GatorBait Media news about the Florida Gators. I can unsubscribe anytime.',
    fine: 'Free email updates. Paid memberships are separate. Check your inbox to confirm.',
    button: 'Get free updates',
    sending: 'Sending your signup...',
    done: 'Check your inbox for a GatorBait confirmation email. Your signup is pending until you confirm with the link.',
    badEmail: 'Enter a valid email address.',
    noConsent: 'Check the box to say yes to GatorBait emails.',
    failed: "That didn't go through. Try again in a minute.",
    pending: 'Check your inbox to confirm.',
    pendingLine: 'A signup was submitted in this browser. We cannot verify confirmation here. Open the GatorBait confirmation email and follow the link; if you already confirmed, no action is needed.'
  };
  // Bot/SEO spam patterns detected in Oct 1-6 registrations.
  var SPAM_KEYWORDS = /viagra|casino|crypto|pharmacy|cialis|poker|betting|loans?|pills?|xyz|xxx|forex|seo|backlink|lens|cheap|discount|generic|adult|adult\s*content|dating|escort|hemp|cbd|bitcoin|ethereum|nft|dropship|affiliate|mlm|weight.?loss|diet.?pills?/i;
  var SPAM_PATTERNS = {
    excessiveDots: /(\.\w+){3,}/,            // 3+ dot-separated segments
    excessiveNumbers: /\d{5,}/,              // 5+ consecutive digits
    suspiciousChars: /[_+-]{2,}/,            // 2+ repeated special chars
  };
  var SOURCES = { home: 1, 'story-inline': 1, 'story-end': 1, 'story-slideup': 1 };
  function html(source, opts) {
    css();
    source = SOURCES[source] ? source : 'home';
    var home = source === 'home', tag = home ? 'section' : 'aside', o = opts || {};
    var cls = 'gbc gbc-v2' + (home ? ' fp-mod-capture' : '') + (o.extra ? ' ' + o.extra : '');
    var attrs = ' data-gbm-capture="' + source + '"' + (home ? '' : ' data-story-kit="capture"') + ' aria-label="Free GatorBait email updates"';
    if (home && pending()) return '<' + tag + ' class="' + cls + ' gbc-pending"' + attrs + ' data-state="pending"><p class="gbc-k">' + COPY.kicker + '</p><h2 class="gbc-h">' + COPY.pending + '</h2><p class="gbc-v" style="margin:6px 0 0">' + COPY.pendingLine + '</p></' + tag + '>';
    var id = 'gbc-' + source;
    return '<' + tag + ' class="' + cls + '"' + attrs + ' data-state="ready">' + (o.close ? '<button type="button" class="gbc-x" aria-label="Close">×</button>' : '') +
      '<p class="gbc-k">' + COPY.kicker + '</p><' + (home ? 'h2' : 'h3') + ' class="gbc-h">' + COPY.head + '</' + (home ? 'h2' : 'h3') + '>' +
      '<p class="gbc-v">' + (o.short ? 'Free Florida reporting and game-week updates by email.' : COPY.value) + '</p>' +
      '<form class="gbc-f" novalidate><label class="gbc-l" for="' + id + '-e">Email address</label>' +
      '<div class="gbc-row"><input type="email" id="' + id + '-e" name="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" placeholder="you@example.com" required><button class="gbc-b" type="submit">' + COPY.button + '</button></div>' +
      '<label class="gbc-c"><input type="checkbox" name="consent" value="yes" required><span>' + COPY.consent + '</span></label>' +
      '<div class="gbc-hp" aria-hidden="true"><label>Company<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>' +
      '<p class="gbc-p">' + COPY.fine + ' <a href="' + PRIVACY + '">Privacy policy</a></p>' +
      '<p class="gbc-m" role="status" aria-live="polite"></p></form></' + tag + '>';
  }
  function node(source, opts) { var t = document.createElement('div'); t.innerHTML = html(source, opts); return t.firstChild; }

  /* ---------- Submitting: visitor token, then Create Submission ---------- */
  var sourceFieldOk = true, busy = false;
  function token() {
    try { var c = JSON.parse(get('sessionStorage', K_TOKEN) || 'null'); if (c && c.t && c.x > Date.now() + 60000) return Promise.resolve(c.t); } catch (_) {}
    return fetch(API + '/oauth2/token', { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: CFG.clientId, grantType: 'anonymous' }) })
      .then(function (r) { if (!r.ok) throw new Error('token ' + r.status); return r.json(); })
      .then(function (j) { if (!j || !j.access_token) throw new Error('token'); put('sessionStorage', K_TOKEN, JSON.stringify({ t: j.access_token, x: Date.now() + (Number(j.expires_in) || 14400) * 1000 })); return j.access_token; });
  }
  function submitOnce(tok, email, source, withSource) {
    var values = {}; values[CFG.emailField] = email; values[CFG.consentField] = true;
    if (withSource && CFG.sourceField) values[CFG.sourceField] = source;
    return fetch(API + '/form-submission-service/v4/submissions', { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json', Authorization: tok }, body: JSON.stringify({ submission: { formId: CFG.formId, submissions: values } }) })
      .then(function (r) { return r.text().then(function (t) { return { ok: r.ok, status: r.status, text: t }; }); });
  }
  function submit(email, source) {
    return token().then(function (tok) {
      var tagged = sourceFieldOk && !!CFG.sourceField;
      return submitOnce(tok, email, source, tagged).then(function (res) {
        // The form has no signup_source field yet: Wix names the stray key; resend once without it.
        if (!res.ok && tagged && /UNKNOWN_VALUE_ERROR|signup_source/.test(res.text) && res.status < 500) { sourceFieldOk = false; return submitOnce(tok, email, source, false).then(function (r2) { r2.tagged = false; return r2; }); }
        if (!res.ok && res.status === 401) { put('sessionStorage', K_TOKEN, ''); }
        res.tagged = tagged; return res;
      });
    });
  }
  function report(source, outcome, tagged) {
    var detail = { source: source, outcome: outcome, tagged: !!tagged, version: VERSION };
    try { document.dispatchEvent(new CustomEvent('gbm:capture', { detail: detail })); } catch (_) {}
    try { if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'gbm_capture', gbm_capture_source: source, gbm_capture_outcome: outcome }); } catch (_) {}
  }
  // Probe (never creates a contact): a page opened with ?gbm_capture=probe mints a visitor token and sends an empty
  // submission (no email, no consent). Wix validates only after CORS and the token pass, so a 400 here proves the
  // path works end to end without a contact. The result lands on <html data-gbm-capture-probe> for live shots.
  if (/[?&]gbm_capture=probe(&|$)/.test(location.search)) {
    token().then(function (tok) {
      return fetch(API + '/form-submission-service/v4/submissions', { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json', Authorization: tok }, body: JSON.stringify({ submission: { formId: CFG.formId, submissions: {} } }) })
        .then(function (r) { return r.text().then(function (t) { return { token: true, status: r.status, text: t.slice(0, 220) }; }); });
    }).catch(function (e) { return { token: false, error: String(e).slice(0, 140) }; })
      .then(function (res) { document.documentElement.setAttribute('data-gbm-capture-probe', JSON.stringify(res)); });
  }
  function say(box, text, tone) { var m = box.querySelector('.gbc-m'); if (m) { m.textContent = text; if (tone) m.setAttribute('data-tone', tone); else m.removeAttribute('data-tone'); } }
  function isSpamEmail(email) {
    if (SPAM_KEYWORDS.test(email)) return true;
    for (var pattern in SPAM_PATTERNS) {
      if (SPAM_PATTERNS[pattern].test(email)) return true;
    }
    return false;
  }
  function onSubmit(ev) {
    var form = ev.target, box = form && form.closest && form.closest('[data-gbm-capture]');
    if (!box || !form.classList.contains('gbc-f')) return;
    ev.preventDefault();
    if (busy || box.getAttribute('data-state') === 'pending') return;
    var source = box.getAttribute('data-gbm-capture'), email = String(form.email.value || '').trim(), hp = form.company && form.company.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) { say(box, COPY.badEmail, 'err'); form.email.focus(); return; }
    if (isSpamEmail(email)) { say(box, COPY.badEmail, 'err'); form.email.focus(); return; }
    if (!form.consent.checked) { say(box, COPY.noConsent, 'err'); form.consent.focus(); return; }
    if (hp) { box.setAttribute('data-state', 'pending'); say(box, COPY.done); return; } // bot fill: no request
    busy = true; box.setAttribute('data-state', 'sending'); say(box, COPY.sending);
    var btn = form.querySelector('.gbc-b'); if (btn) btn.disabled = true;
    submit(email, source).then(function (res) {
      busy = false; if (btn) btn.disabled = false;
      if (!res.ok) throw new Error('submission ' + res.status);
      put('localStorage', K_PENDING, String(now()));
      box.setAttribute('data-state', 'pending'); say(box, COPY.done);
      report(source, 'submitted', res.tagged);
      if (box.closest('#gbc-bar')) setTimeout(function () { hideBar(false); }, 6000); else hideBar(false);
      // Other story cards on the page step back after this browser has submitted a signup (confirmation still unknown) (the one that took the email stays).
      [].slice.call(document.querySelectorAll('[data-gbm-capture]')).forEach(function (o) { if (o !== box && o.getAttribute('data-gbm-capture') !== 'home' && !o.closest('#gbc-bar')) o.hidden = true; });
    }).catch(function () {
      busy = false; if (btn) btn.disabled = false;
      box.setAttribute('data-state', 'ready'); say(box, COPY.failed, 'err');
      report(source, 'failed', false);
    });
  }

  /* ---------- Story pages: inline card after the 4th prose paragraph, and inside "Keep up with the Gators" ---------- */
  function mountStory(ctx) {
    if (!onPost() || pending() || !ctx || !ctx.body) return;
    css();
    // No mid-article card (Brenden, Oct. 2: hard to read mid-story; keep the slide-up bar and the end card).
    var more = ctx.more || document.querySelector('[data-story-kit="more"]');
    if (more && !more.querySelector('[data-gbm-capture="story-end"]')) more.appendChild(node('story-end', { extra: 'gbc-end' }));
    watchBar();
  }

  /* ---------- One small, delayed invitation across public editorial routes ---------- */
  var elapsed = 0, lastTick = now(), engaged = false, barShown = false, barTimer = 0, route = '', routeObserver, observerStop;
  function visible(el) {
    if (!el || el.hidden) return false;
    var rect = el.getBoundingClientRect(), style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
  }
  function shareOpen() { var s = document.getElementById('gbm-share'); return !!(s && s.classList.contains('on')); }
  function cardInView() {
    return [].slice.call(document.querySelectorAll('[data-gbm-capture]:not([data-gbm-capture$="-prompt"])')).some(function (c) {
      var rect = c.getBoundingClientRect();
      return visible(c) && rect.bottom > 0 && rect.top < innerHeight;
    });
  }
  function blocked() {
    if (shareOpen() || document.visibilityState === 'hidden') return true;
    var active = document.activeElement;
    // Never compete with a form, search field, account dialog or native cookie choice.
    if (active && active.matches('input,select,textarea,[contenteditable=true]')) return true;
    return [].slice.call(document.querySelectorAll('[role="dialog"],[aria-modal="true"],[data-hook*="cookie-banner"],[data-hook*="consent-banner"],[id*="cookie-banner"],[id*="consent-banner"],#consent-policy-manager-container')).some(visible) || cardInView();
  }
  function bar() { return document.getElementById('gbc-bar'); }
  function hideBar(remember) {
    var b = bar();
    if (b) {
      if (b.contains(document.activeElement) && document.activeElement.blur) document.activeElement.blur();
      b.classList.remove('on'); b.setAttribute('data-dismissed', 'true');
    }
    if (remember) put('localStorage', K_DISMISSED, String(now()));
    clearTimeout(barTimer); barTimer = 0;
  }
  function promptSource() { return onPost() ? 'story-prompt' : location.pathname.replace(/\/$/, '') === '/magazine' ? 'magazine-prompt' : 'home-prompt'; }
  function showBar() {
    if (barShown || bar()) return;
    barShown = true; css();
    var source = promptSource(), b = document.createElement('div'); b.id = 'gbc-bar';
    b.innerHTML = '<aside class="gbc-prompt" aria-label="Free GatorBait email updates" data-gbm-capture="' + source + '">' +
      '<button type="button" class="gbc-x" aria-label="Dismiss email signup invitation">×</button>' +
      '<h2>Florida news. In your inbox.</h2><p>Free GatorBait reporting and game-week updates.</p>' +
      '<a href="' + SIGNUP + '">Get free email updates</a></aside>';
    document.body.appendChild(b);
    b.querySelector('.gbc-x').addEventListener('click', function () { hideBar(true); });
    b.querySelector('a').addEventListener('click', function () { report(source, 'signup_opened', false); hideBar(true); });
    requestAnimationFrame(function () {
      if (!blocked()) { b.classList.add('on'); recordShown(b); setTimeout(function () { recordShown(b); }, 250); }
    });
  }
  function recordShown(b) {
    if (b.getAttribute('data-impression-recorded') || !b.classList.contains('on') || b.classList.contains('aside') || b.getAttribute('data-dismissed') || blocked()) return;
    var prompt = b.querySelector('.gbc-prompt'), rect = prompt.getBoundingClientRect();
    if (!visible(prompt) || rect.top < 0 || rect.bottom > innerHeight) return;
    b.setAttribute('data-impression-recorded', 'true');
    put('localStorage', K_SEEN, String(now()));
    report(prompt.getAttribute('data-gbm-capture'), 'shown', false);
  }
  function tick() {
    var time = now();
    if (eligibleRoute() && document.visibilityState !== 'hidden') elapsed += Math.min(Math.max(time - lastTick, 0), 2000);
    lastTick = time;
    if (!eligibleRoute()) { hideBar(false); return; }
    var b = bar();
    if (b) {
      var collision = blocked() || pending();
      if (b.classList.contains('aside') !== collision) b.classList.toggle('aside', collision);
      if (!collision && b.getAttribute('data-dismissed') !== 'true' && !b.classList.contains('on')) {
        b.classList.add('on'); setTimeout(function () { recordShown(b); }, 250);
      }
      recordShown(b);
      return;
    }
    if (barShown || pending() || quiet()) return;
    if (elapsed >= CFG.delayMs && engaged && !blocked()) showBar();
  }
  function watchBar() {
    if (barTimer || !eligibleRoute() || document.visibilityState === 'hidden' || barShown || pending() || quiet()) return;
    barTimer = setTimeout(function () {
      barTimer = 0; tick();
      // Bound automatic observation to five minutes; reader interaction still
      // rechecks eligibility afterward. Never poll a hidden tab or account page.
      if (elapsed < 300000) watchBar();
    }, 1000);
  }
  function mountUtility() {
    if (location.pathname !== '/') return;
    var mobile = document.getElementById('gbm-mobile-shell-host'), row = document.getElementById('gbm-free-email-row');
    var phone = matchMedia('(max-width:820px)').matches && mobile;
    var link = document.getElementById('gbm-free-email-utility'), nav;
    if (phone) {
      if (!row) { row = document.createElement('div'); row.id = 'gbm-free-email-row'; mobile.insertAdjacentElement('afterend', row); }
      nav = row;
    } else {
      nav = document.querySelector('#gbm-live .fp-links') || document.querySelector('#gbm-live nav[aria-label="GatorBait sections"]');
      if (row) row.remove();
    }
    if (!nav) return;
    css();
    if (!link) {
      link = document.createElement('a'); link.id = 'gbm-free-email-utility'; link.href = SIGNUP;
      link.setAttribute('aria-label', 'Get free GatorBait email updates');
      link.addEventListener('click', function () { report('home-utility', 'signup_opened', false); });
    }
    var label = phone ? 'Free GatorBait email updates →' : 'Free email';
    if (link.textContent !== label) link.textContent = label;
    if (link.parentNode !== nav) nav.appendChild(link);
    var tv = nav.classList.contains('fp-links') && nav.querySelector('a[href*="the-buddy-martin-show"]');
    if (tv && !tv.querySelector('.gbc-tv-long')) {
      tv.setAttribute('aria-label', tv.textContent.trim());
      var long = document.createElement('span'); long.className = 'gbc-tv-long'; long.textContent = tv.textContent;
      var short = document.createElement('span'); short.className = 'gbc-tv-short'; short.textContent = 'TV'; short.setAttribute('aria-hidden', 'true');
      tv.replaceChildren(long, short);
    }
  }
  function syncRoute() {
    var path = String(location.pathname);
    if (path !== route) {
      route = path; elapsed = 0; lastTick = now(); engaged = false;
      clearTimeout(barTimer); barTimer = 0;
      if (bar()) bar().remove();
      var utility = document.getElementById('gbm-free-email-utility'); if (utility) utility.remove();
      var utilityRow = document.getElementById('gbm-free-email-row'); if (utilityRow) utilityRow.remove();
    }
    mountUtility(); watchBar(); tick();
    if (routeObserver) routeObserver.disconnect();
    clearTimeout(observerStop);
    // Wix can hydrate the home navigation after this script. One bounded observer
    // handles that and late native dialogs, without a permanent DOM polling loop.
    if ('MutationObserver' in window && eligibleRoute()) {
      var queued = false;
      routeObserver = new MutationObserver(function () {
        if (queued) return; queued = true;
        requestAnimationFrame(function () { queued = false; mountUtility(); tick(); });
      });
      routeObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','hidden','aria-hidden','style'] });
      observerStop = setTimeout(function () { routeObserver.disconnect(); }, 120000);
    }
  }
  function engage() {
    if (!eligibleRoute()) return;
    engaged = true; tick(); watchBar();
    setTimeout(tick, 200); // a native dialog/share/cookie click may finish after pointerdown
  }
  document.addEventListener('submit', onSubmit, true);
  document.addEventListener('keydown', function (e) {
    var b = bar();
    if (e.key === 'Escape' && b && b.classList.contains('on') && !b.classList.contains('aside') && !shareOpen()) hideBar(true);
    else engage();
  });
  addEventListener('scroll', engage, { passive: true });
  document.addEventListener('pointerdown', engage, { passive: true });
  document.addEventListener('focusin', function () { tick(); });
  document.addEventListener('focusout', function () { setTimeout(tick, 0); });
  document.addEventListener('visibilitychange', function () { lastTick = now(); tick(); watchBar(); });
  addEventListener('popstate', syncRoute);
  addEventListener('gbmroutechange', syncRoute);
  addEventListener('resize', mountUtility);
  window.GBM_CAPTURE = {
    version: VERSION, html: html, mountStory: mountStory, mount: syncRoute,
    state: function () { return { pending: pending(), confirmation: 'unknown', quiet: quiet(), barShown: barShown, sourceFieldOk: sourceFieldOk, elapsedMs: elapsed, cfg: { clientId: CFG.clientId, formId: CFG.formId, sourceField: CFG.sourceField, delayMs: CFG.delayMs } }; }
  };
  document.documentElement.setAttribute('data-gbm-capture-runtime', VERSION);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncRoute, { once: true }); else syncRoute();
})();
