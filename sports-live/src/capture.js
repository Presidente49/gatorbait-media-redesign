/* GatorBait Capture 2026: "Get GatorBait Magazine free" signup for story pages and the homepage hub.
 * One component, four placements, each tagged with its source:
 *   home           the hub module the Front Page renderer paints (front-page.js calls GBM_CAPTURE.html('home'));
 *   story-inline   mid-article, after the 4th prose paragraph (stories with 6+ prose paragraphs only);
 *   story-end      folded into the Story Kit's "Keep up with the Gators" block;
 *   story-slideup  a small bar that slides up on /post/ pages after 50% scroll or 45 s.
 * Where a signup goes: the site's existing Wix form "GatorBait Email List" (6babfee8-...), which already holds the
 * email field, the unchecked CONTACTS_SUBSCRIBE consent box with DOUBLE_CONFIRMATION, and the user automation that
 * adds the list's audience labels. The browser mints an anonymous visitor token from the site's headless OAuth
 * client (POST https://www.wixapis.com/oauth2/token, grantType "anonymous"; a client ID is public, no secret) and
 * calls Wix Forms' Create Submission (POST /form-submission-service/v4/submissions) as that visitor. Wix then sends
 * its own confirmation email; nobody is subscribed until they click it. Evidence: deploy/capture-2026/README.md.
 * Consent: the checkbox starts unchecked and nothing is sent until the reader checks it; the submission carries
 * subscribe_gatorbait: true only because the reader said yes. A hidden honeypot drops bot fills without a request.
 * Source tagging: every submission tries to carry signup_source (home | story-inline | story-end | story-slideup).
 * Until that hidden field exists on the form, Wix rejects the key as UNKNOWN_VALUE_ERROR and the module resends
 * once without it (and remembers that for the page view). A "gbm:capture" DOM event and a dataLayer push (when a
 * dataLayer exists) record source and outcome either way.
 * Memory (localStorage, every access in try/catch): gbm-capture-joined (signed up here: no slide-up, no story cards,
 * the home module shows its thank-you line) and gbm-capture-dismissed (slide-up closed: quiet for 14 days).
 * The slide-up never covers the Share sheet (#gbm-share.on): it sits below it and steps aside while the sheet is open.
 * Test hooks: window.__GBM_CAPTURE_CFG__ {clientId, formId, sourceField, delayMs} overrides the defaults;
 * window.GBM_CAPTURE exposes {version, html(source), mountStory(ctx), state()}. Nothing here edits a Wix page. */
(function () {
  'use strict';
  if (window.GBM_CAPTURE) return;
  var VERSION = 'capture-2026.1';
  var SITE = 'https://www.gatorbaitmedia.com';
  var API = 'https://www.wixapis.com';
  var seed = window.__GBM_CAPTURE_CFG__ || {};
  var CFG = {
    clientId: seed.clientId || '1565816d-bbbc-45c1-b82a-31f10d3e2c71', // headless OAuth client on site 18fb3a4e (public ID)
    formId: seed.formId || '6babfee8-147f-428a-9e14-6b72f6225835', // "GatorBait Email List", double opt-in
    emailField: 'email_gatorbait', consentField: 'subscribe_gatorbait',
    sourceField: seed.sourceField === undefined ? 'signup_source' : seed.sourceField,
    delayMs: Number(seed.delayMs) > 0 ? Number(seed.delayMs) : 45000,
    quietDays: 14,
  };
  var PRIVACY = SITE + '/policies';
  var K_JOINED = 'gbm-capture-joined', K_DISMISSED = 'gbm-capture-dismissed', K_TOKEN = 'gbm-capture-token';
  function now() { return Date.now(); } // real clock on purpose: the 45 s timer and the 14-day memory follow the reader, not a test's pinned date
  function get(store, k) { try { return window[store].getItem(k); } catch (_) { return null; } }
  function put(store, k, v) { try { window[store].setItem(k, v); } catch (_) {} }
  function joined() { return !!get('localStorage', K_JOINED); }
  function quiet() { var t = Number(get('localStorage', K_DISMISSED)); return Number.isFinite(t) && t > 0 && now() - t < CFG.quietDays * 864e5; }
  function onPost() { return String(location.pathname).indexOf('/post/') === 0; }

  // Barlow only; navy #0021a5, orange #fa4616. The :is(#gbm-live,html) prefix carries an id's weight so the homepage's
  // #gbm-live.fp26 heading and link rules never restyle the card, and it still matches on story pages.
  var P = ':is(#gbm-live,html) ';
  var CSS = [
    P + '.gbc{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;contain:inline-size;margin:24px 0;padding:18px 16px 16px;border-radius:12px;background:#0021a5;color:#fff;text-align:left;direction:ltr;font:500 16px/1.4 "Barlow",sans-serif;border-top:6px solid #fa4616}',
    P + '.gbc *{box-sizing:border-box}' + P + '.gbc input,' + P + '.gbc button{font-family:"Barlow",sans-serif}',
    P + '.gbc .gbc-k{display:block;margin:0 0 6px;padding:0;border:0;font:800 12px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#ffb27a}',
    P + '.gbc .gbc-h{margin:0 0 6px;padding:0;border:0;font:800 26px/1.05 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.01em;text-transform:none;color:#fff;overflow-wrap:break-word}',
    P + '.gbc .gbc-v{margin:0 0 12px;padding:0;font:500 16px/1.4 "Barlow",sans-serif;color:#e8ecf8}',
    P + '.gbc form{margin:0;padding:0}',
    P + '.gbc .gbc-l{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    P + '.gbc .gbc-row{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}',
    P + '.gbc input[type=email]{flex:1 1 180px;min-width:0;width:100%;height:48px;margin:0;padding:0 12px;border:2px solid #fff;border-radius:8px;background:#fff;color:#0b1a44;font:500 17px/1 "Barlow",sans-serif}',
    P + '.gbc input[type=email]:focus{outline:3px solid #fa4616;outline-offset:1px}',
    P + '.gbc .gbc-b{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin:0;padding:0 18px;border:0;border-radius:8px;background:#fa4616;color:#fff;font:800 17px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap}',
    P + '.gbc .gbc-b:hover,' + P + '.gbc .gbc-b:focus-visible{background:#fff;color:#0021a5;outline:2px solid #fa4616;outline-offset:2px}',
    P + '.gbc .gbc-b[disabled]{opacity:.7;cursor:progress}',
    P + '.gbc .gbc-c{display:flex;align-items:flex-start;gap:10px;min-height:44px;margin:0 0 6px;padding:2px 0;font:500 15px/1.35 "Barlow",sans-serif;color:#fff;cursor:pointer}',
    P + '.gbc .gbc-c input{flex:0 0 auto;width:22px;height:22px;margin:0;accent-color:#fa4616;cursor:pointer}',
    P + '.gbc .gbc-p{margin:0;padding:0;font:500 13px/1.4 "Barlow",sans-serif;color:#c9d3ee}',
    P + '.gbc a,' + P + '.gbc a:visited{color:#fff;text-decoration:underline;text-decoration-color:#fa4616;text-underline-offset:2px}',
    P + '.gbc .gbc-m{margin:8px 0 0;padding:0;font:700 15px/1.35 "Barlow",sans-serif;color:#fff}.gbc .gbc-m:empty{display:none}',
    P + '.gbc .gbc-m[data-tone=err]{color:#ffd2c2}',
    P + '.gbc .gbc-hp{display:none}',
    P + '.gbc[data-state=done] .gbc-f>:not(.gbc-m){display:none}' + P + '.gbc[data-state=done] .gbc-m{margin:0;font:700 17px/1.35 "Barlow",sans-serif}',
    P + '.gbc.gbc-joined{padding:14px 16px}' + P + '.gbc.gbc-joined .gbc-h{font-size:22px;margin:0}',
    // Homepage hub: right under the show on phones, a full row under it on tablets, and on desktop the old email
    // module's slot (last in the grid, columns 10-12 beside the Magazine), so no other module moves.
    '#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{margin:0;border-radius:0}',
    '@media(min-width:600px){#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{grid-column:1/-1}}',
    '@media(min-width:821px){#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{grid-column:10/13;order:1}}',
    // Slide-up bar: fixed, transform-only (no layout shift), under the Share sheet's layers (9998/9999).
    '#gbc-bar{position:fixed;left:0;right:0;bottom:0;z-index:9990;display:flex;justify-content:center;padding:0 8px calc(8px + env(safe-area-inset-bottom));pointer-events:none;transform:translateY(110%);transition:transform .3s ease;visibility:hidden}',
    '#gbc-bar.on{transform:none;visibility:visible}#gbc-bar.aside{transform:translateY(110%);visibility:hidden}',
    '#gbc-bar .gbc{pointer-events:auto;position:relative;max-width:560px;margin:0;padding:12px 12px 10px;border-top-width:4px;box-shadow:0 -6px 24px rgba(3,8,24,.35)}',
    '#gbc-bar .gbc .gbc-k{display:none}#gbc-bar .gbc .gbc-h{font-size:22px;margin:0 0 2px;padding-right:44px}#gbc-bar .gbc .gbc-v{font-size:14px;margin:0 0 8px;padding-right:44px}',
    '#gbc-bar .gbc .gbc-row{flex-wrap:nowrap;margin:0 0 6px}#gbc-bar .gbc input[type=email]{flex:1 1 120px;height:44px}#gbc-bar .gbc .gbc-b{min-height:44px;padding:0 14px;font-size:16px}',
    '#gbc-bar .gbc .gbc-c{font-size:14px;margin:0 0 2px;min-height:40px}#gbc-bar .gbc .gbc-c input{width:20px;height:20px}#gbc-bar .gbc .gbc-p{font-size:12px}',
    '#gbc-bar .gbc-x{position:absolute;top:4px;right:4px;width:44px;height:44px;margin:0;padding:0;border:0;border-radius:8px;background:transparent;color:#fff;font:700 26px/1 "Barlow",sans-serif;cursor:pointer}',
    '#gbc-bar .gbc-x:focus-visible,#gbc-bar .gbc-x:hover{outline:2px solid #fa4616;background:rgba(255,255,255,.12)}',
    '@media(prefers-reduced-motion:reduce){#gbc-bar{transition:none}}',
  ].join('');
  function css() {
    if (document.getElementById('gbm-capture-css')) return;
    var s = document.createElement('style'); s.id = 'gbm-capture-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- The component ---------- */
  var COPY = {
    kicker: 'Free · GatorBait Magazine',
    head: 'Get GatorBait Magazine free',
    value: "Buddy Martin's columns, the game-week package and Chris Spears' photos in your inbox. One email a day at most.",
    consent: 'Yes, email me GatorBait Magazine and GatorBait Media news about the Florida Gators. I can unsubscribe anytime.',
    fine: "We'll email you a link to confirm.",
    button: 'Sign up free',
    sending: 'Signing you up…',
    done: 'Almost done: check your inbox for an email from GatorBait Media and tap the link to confirm.',
    badEmail: 'Enter a valid email address.',
    noConsent: 'Check the box to say yes to GatorBait emails.',
    failed: "That didn't go through. Try again in a minute.",
    joined: "You're on the GatorBait Magazine list",
    joinedLine: 'Thanks for reading. Watch your inbox for the next issue.',
  };
  var SOURCES = { home: 1, 'story-inline': 1, 'story-end': 1, 'story-slideup': 1 };
  function html(source, opts) {
    css();
    source = SOURCES[source] ? source : 'home';
    var home = source === 'home', tag = home ? 'section' : 'aside', o = opts || {};
    var cls = 'gbc' + (home ? ' fp-mod-capture' : '') + (o.extra ? ' ' + o.extra : '');
    var attrs = ' data-gbm-capture="' + source + '"' + (home ? '' : ' data-story-kit="capture"') + ' aria-label="GatorBait Magazine signup"';
    if (home && joined()) return '<' + tag + ' class="' + cls + ' gbc-joined"' + attrs + ' data-state="joined"><p class="gbc-k">' + COPY.kicker + '</p><h2 class="gbc-h">' + COPY.joined + '</h2><p class="gbc-v" style="margin:6px 0 0">' + COPY.joinedLine + '</p></' + tag + '>';
    var id = 'gbc-' + source;
    return '<' + tag + ' class="' + cls + '"' + attrs + ' data-state="ready">' + (o.close ? '<button type="button" class="gbc-x" aria-label="Close">×</button>' : '') +
      '<p class="gbc-k">' + COPY.kicker + '</p><' + (home ? 'h2' : 'h3') + ' class="gbc-h">' + COPY.head + '</' + (home ? 'h2' : 'h3') + '>' +
      '<p class="gbc-v">' + (o.short ? 'Buddy Martin, the game-week package, Chris Spears’ photos. One email a day at most.' : COPY.value) + '</p>' +
      '<form class="gbc-f" novalidate><label class="gbc-l" for="' + id + '-e">Email address</label>' +
      '<div class="gbc-row"><input type="email" id="' + id + '-e" name="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" placeholder="you@example.com" required><button class="gbc-b" type="submit">' + COPY.button + '</button></div>' +
      '<label class="gbc-c"><input type="checkbox" name="consent" value="yes"><span>' + COPY.consent + '</span></label>' +
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
  function onSubmit(ev) {
    var form = ev.target, box = form && form.closest && form.closest('[data-gbm-capture]');
    if (!box || !form.classList.contains('gbc-f')) return;
    ev.preventDefault();
    if (busy || box.getAttribute('data-state') === 'done') return;
    var source = box.getAttribute('data-gbm-capture'), email = String(form.email.value || '').trim(), hp = form.company && form.company.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) { say(box, COPY.badEmail, 'err'); form.email.focus(); return; }
    if (!form.consent.checked) { say(box, COPY.noConsent, 'err'); form.consent.focus(); return; }
    if (hp) { box.setAttribute('data-state', 'done'); say(box, COPY.done); return; } // bot fill: no request
    busy = true; box.setAttribute('data-state', 'sending'); say(box, COPY.sending);
    var btn = form.querySelector('.gbc-b'); if (btn) btn.disabled = true;
    submit(email, source).then(function (res) {
      busy = false; if (btn) btn.disabled = false;
      if (!res.ok) throw new Error('submission ' + res.status);
      put('localStorage', K_JOINED, String(now()));
      box.setAttribute('data-state', 'done'); say(box, COPY.done);
      report(source, 'submitted', res.tagged);
      if (box.closest('#gbc-bar')) setTimeout(function () { hideBar(false); }, 6000); else hideBar(false);
      // Other story cards on the page step back once the reader is signed up (the one that took the email stays).
      [].slice.call(document.querySelectorAll('[data-gbm-capture]')).forEach(function (o) { if (o !== box && o.getAttribute('data-gbm-capture') !== 'home' && !o.closest('#gbc-bar')) o.hidden = true; });
    }).catch(function () {
      busy = false; if (btn) btn.disabled = false;
      box.setAttribute('data-state', 'ready'); say(box, COPY.failed, 'err');
      report(source, 'failed', false);
    });
  }

  /* ---------- Story pages: inline card after the 4th prose paragraph, and inside "Keep up with the Gators" ---------- */
  function prose(ps) {
    return ps.filter(function (p) {
      var t = String(p.textContent || '').replace(/\s+/g, ' ').trim();
      return t.length > 60 && !p.closest('blockquote,figure,figcaption,[data-story-kit]') && !/^(By\s+[A-Z]|[—–-]\s)/.test(t);
    });
  }
  // Insert without moving what the reader sees: if the anchor is above the viewport, pay the new height back.
  function insertQuiet(anchor, el) {
    var above = anchor.getBoundingClientRect().bottom < 0;
    anchor.insertAdjacentElement('afterend', el);
    if (above) { var h = el.getBoundingClientRect().height + 48; if (h > 0) scrollBy(0, h); }
  }
  function mountStory(ctx) {
    if (!onPost() || joined() || !ctx || !ctx.body) return;
    css();
    if (!document.querySelector('[data-gbm-capture="story-inline"]')) {
      var ps = prose(ctx.paras || []);
      if (ps.length >= 6) {
        var a = ps[3];
        if (a.parentNode && a.parentNode !== ctx.body && a.parentNode.children.length === 1) a = a.parentNode;
        insertQuiet(a, node('story-inline'));
      }
    }
    var more = ctx.more || document.querySelector('[data-story-kit="more"]');
    if (more && !more.querySelector('[data-gbm-capture="story-end"]')) more.appendChild(node('story-end', { extra: 'gbc-end' }));
    watchBar();
  }

  /* ---------- Slide-up bar (story pages) ---------- */
  var t0 = now(), barShown = false, barTimer = 0;
  function shareOpen() { var s = document.getElementById('gbm-share'); return !!(s && s.classList.contains('on')); }
  function cardInView() {
    return [].slice.call(document.querySelectorAll('[data-gbm-capture="story-inline"],[data-gbm-capture="story-end"]')).some(function (c) {
      var b = c.getBoundingClientRect(); return !c.hidden && b.height && b.bottom > 0 && b.top < innerHeight;
    }) || (document.activeElement && document.activeElement.closest && !!document.activeElement.closest('[data-gbm-capture]:not(#gbc-bar *)'));
  }
  function scrolled() { var h = document.documentElement.scrollHeight - innerHeight; return h > 0 && scrollY / h >= 0.5; }
  function bar() { return document.getElementById('gbc-bar'); }
  function hideBar(remember) {
    var b = bar(); if (!b) return;
    b.classList.remove('on');
    if (remember) put('localStorage', K_DISMISSED, String(now()));
  }
  function showBar() {
    if (barShown) return; barShown = true; css();
    var b = document.createElement('div'); b.id = 'gbc-bar';
    b.innerHTML = html('story-slideup', { close: true, short: true });
    document.body.appendChild(b);
    b.querySelector('.gbc-x').addEventListener('click', function () { hideBar(true); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (!shareOpen()) b.classList.add('on'); }); });
    report('story-slideup', 'shown', false);
  }
  function tick() {
    if (!onPost()) return;
    var b = bar();
    // Once up, the bar steps aside for the Share sheet and while a signup card is on screen (never two forms in view).
    if (b) { var inBar = document.activeElement && b.contains(document.activeElement); b.classList.toggle('aside', shareOpen() || (!inBar && cardInView())); if (!b.isConnected) document.body.appendChild(b); return; }
    if (barShown || joined() || quiet() || shareOpen() || cardInView()) return;
    if (scrolled() || now() - t0 >= CFG.delayMs) showBar();
  }
  function watchBar() {
    if (barTimer) return;
    barTimer = setInterval(tick, 1000);
    addEventListener('scroll', function () { tick(); }, { passive: true });
    document.addEventListener('keydown', function (e) { var b = bar(); if (e.key === 'Escape' && b && b.classList.contains('on') && !b.classList.contains('aside') && !shareOpen()) hideBar(true); });
  }

  document.addEventListener('submit', onSubmit, true);
  window.GBM_CAPTURE = {
    version: VERSION, html: html, mountStory: mountStory,
    state: function () { return { joined: joined(), quiet: quiet(), barShown: barShown, sourceFieldOk: sourceFieldOk, cfg: { clientId: CFG.clientId, formId: CFG.formId, sourceField: CFG.sourceField, delayMs: CFG.delayMs } }; },
  };
  if (onPost()) watchBar();
})();
