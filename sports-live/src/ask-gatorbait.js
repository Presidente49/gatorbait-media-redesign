/* Ask GatorBait client. Source of record: deploy/dept-ideas/ai/client.js (worker.mjs there is the API contract).
 * This copy is bundled into sports-live/homepage.js and exposes window.GBM_ASK.mount(afterEl): front-page.js calls it
 * after first paint once deploy/cloudflare/endpoints.json names an `ask` Worker (window.__GBM_ASK_URL__). Without an
 * anchor it falls back to the standalone rule: after The Tunnel, else #gbm-ask, else the end of #gbm-live.
 * Barlow / Barlow Condensed only, Swamp Night tokens (--fp-*) with fallbacks. Phone-first: one column at 320/390/430,
 * two columns from 900px. JSON to the Worker, no cookies, no account.
 * window.__GBM_ASK_TRANSPORT__(path, body) may replace fetch (preview.html uses recorded answers). */
(function () {
  'use strict';
  // Read at request time: the bundle evaluates before front-page.js learns the Worker URL from endpoints.json.
  function api() { return String(window.__GBM_ASK_URL__ || 'https://ask-gatorbait.gatorbaitmedia.workers.dev').replace(/\/+$/, ''); }
  var FONTS = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap';
  var SUGGEST = ['When is the next game?', 'Who won the Heisman for Florida?', 'How did the Ole Miss game go?', 'What is the injury news?'];
  var CSS = '#gbm-live .fp-ask,.fp-ask{--ask-band:var(--fp-band,#07122e);--ask-card:var(--fp-card,#0e2257);--ask-chip:var(--fp-chip,#16295e);--ask-ink:var(--fp-ink,#f3f5fa);--ask-ink-2:var(--fp-ink-2,#b9c4dc);--ask-link:var(--fp-link,#a9bbff);--ask-navy:var(--fp-navy,#0021a5);--ask-orange:var(--fp-orange,#fa4616);--ask-rule:var(--fp-rule,#26386b);--ask-cond:var(--fp-cond,"Barlow Condensed","Barlow",sans-serif);--ask-sans:var(--fp-sans,"Barlow",sans-serif);--ask-pad:var(--fp-pad,16px);background:var(--ask-band);color:var(--ask-ink);font:400 16px/1.45 var(--ask-sans);border-top:6px solid var(--ask-orange);padding:22px var(--ask-pad) 30px;-webkit-font-smoothing:antialiased}' +
    '.fp-ask *{box-sizing:border-box}.fp-ask-in{max-width:980px;margin:0 auto;display:grid;gap:16px}.fp-ask-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 16px}' +
    '.fp-ask-kicker{margin:0;font:700 12px/1.3 var(--ask-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--ask-orange)}.fp-ask-title{margin:0;font:800 30px/1 var(--ask-cond);letter-spacing:-.01em;text-transform:uppercase}.fp-ask-sub{margin:4px 0 0;font-size:14px;color:var(--ask-ink-2)}' +
    '.fp-ask-tabs{display:flex;gap:6px;padding:0;margin:0;list-style:none}.fp-ask-tab{flex:1;min-height:44px;border:1px solid var(--ask-rule);border-radius:10px;background:var(--ask-chip);color:var(--ask-ink);font:700 15px/1 var(--ask-cond);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.fp-ask-tab[aria-selected=true]{background:var(--ask-orange);border-color:var(--ask-orange);color:#fff}' +
    '.fp-ask-grid{display:grid;gap:16px}.fp-ask-pane{display:none;background:var(--ask-card);border:1px solid var(--ask-rule);border-radius:14px;padding:16px;min-width:0}.fp-ask-pane[data-on]{display:grid;gap:12px;align-content:start}' +
    '.fp-ask-chips{display:flex;flex-wrap:wrap;gap:6px}.fp-ask-chip{border:1px solid var(--ask-rule);border-radius:999px;background:var(--ask-chip);color:var(--ask-ink);font:500 13px/1 var(--ask-sans);padding:10px 14px;min-height:44px;cursor:pointer}' +
    '.fp-ask-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}.fp-ask-input{min-height:46px;width:100%;border:1px solid var(--ask-rule);border-radius:10px;background:var(--ask-band);color:var(--ask-ink);font:400 16px/1.3 var(--ask-sans);padding:10px 12px}.fp-ask-input::placeholder{color:var(--ask-ink-2)}' +
    '.fp-ask-btn{min-height:46px;border:0;border-radius:10px;background:var(--ask-orange);color:#fff;font:700 15px/1 var(--ask-cond);letter-spacing:.08em;text-transform:uppercase;padding:0 16px;cursor:pointer}.fp-ask-btn[disabled]{opacity:.6;cursor:wait}' +
    '.fp-ask-log{display:grid;gap:10px;margin:0;padding:0;list-style:none}.fp-ask-q{justify-self:end;max-width:92%;background:var(--ask-navy);color:#fff;border-radius:14px 14px 3px 14px;padding:9px 13px;font-weight:500}.fp-ask-a{max-width:100%;background:var(--ask-band);border:1px solid var(--ask-rule);border-radius:14px 14px 14px 3px;padding:11px 13px}.fp-ask-a p{margin:0}.fp-ask-a[data-refused] p{color:var(--ask-ink-2)}' +
    '.fp-ask-src{margin:8px 0 0;padding:0;list-style:none;display:grid;gap:4px;font-size:13px}.fp-ask-src a{color:var(--ask-link);text-decoration:none;font-weight:600}.fp-ask-src a:hover{text-decoration:underline}.fp-ask-src span{color:var(--ask-ink-2);font:700 10px/1.6 var(--ask-cond);letter-spacing:.12em;text-transform:uppercase;margin-right:6px}' +
    '.fp-ask-foot{margin:0;font-size:12px;color:var(--ask-ink-2)}' +
    '.fp-ask-tq{margin:0;font:600 19px/1.3 var(--ask-sans)}.fp-ask-tmeta{display:flex;justify-content:space-between;gap:8px;font:700 12px/1.3 var(--ask-cond);letter-spacing:.12em;text-transform:uppercase;color:var(--ask-ink-2)}.fp-ask-streak{color:var(--ask-orange)}' +
    '.fp-ask-opts{display:grid;gap:8px;margin:0;padding:0;list-style:none}.fp-ask-opt{width:100%;min-height:46px;text-align:left;border:1px solid var(--ask-rule);border-radius:10px;background:var(--ask-band);color:var(--ask-ink);font:500 16px/1.3 var(--ask-sans);padding:10px 12px;cursor:pointer}.fp-ask-opt[data-right]{border-color:#2fbf71;box-shadow:inset 0 0 0 1px #2fbf71}.fp-ask-opt[data-wrong]{border-color:var(--ask-orange);color:var(--ask-ink-2)}.fp-ask-opt[disabled]{cursor:default}' +
    '.fp-ask-res{display:grid;gap:8px;border-top:1px solid var(--ask-rule);padding-top:12px}.fp-ask-res p{margin:0}.fp-ask-verdict{font:800 22px/1 var(--ask-cond);text-transform:uppercase}.fp-ask-share{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}.fp-ask-share code{font:500 13px/1.4 var(--ask-sans);color:var(--ask-ink-2);word-break:break-word}' +
    '.fp-ask-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '@media(min-width:900px){#gbm-live .fp-ask,.fp-ask{padding-top:30px}.fp-ask-title{font-size:38px}.fp-ask-tabs{display:none}.fp-ask-grid{grid-template-columns:3fr 2fr;gap:24px}.fp-ask-pane{display:grid;gap:12px;align-content:start;padding:20px}}' +
    '@media(prefers-reduced-motion:no-preference){.fp-ask-a{animation:fpAskIn .25s ease-out}@keyframes fpAskIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}}';

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(value) {
    try { var u = new URL(String(value), 'https://www.gatorbaitmedia.com'); if (u.protocol !== 'https:') return ''; return /^(www\.)?(gatorbaitmedia\.com|floridagators\.com|ncaa\.com|heisman\.com|secsports\.com|ufl\.edu)$/.test(u.hostname) ? u.href : ''; } catch (_) { return ''; }
  }
  function call(path, body) {
    if (typeof window.__GBM_ASK_TRANSPORT__ === 'function') return Promise.resolve(window.__GBM_ASK_TRANSPORT__(path, body));
    return fetch(api() + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { method: 'GET' })
      .then(function (r) { return r.json().then(function (j) { if (r.status === 429) j.error = 'Easy, Gator. Give it a minute and ask again.'; return j; }); });
  }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }

  function mount(afterEl) {
    if (window.__GBM_ASK_MOUNTED__ || document.querySelector('.fp-ask')) return null; window.__GBM_ASK_MOUNTED__ = true;
    if (!document.getElementById('gbm-ask-styles')) { var s = document.createElement('style'); s.id = 'gbm-ask-styles'; s.textContent = CSS; document.head.appendChild(s); }
    if (!document.querySelector('link[href^="https://fonts.googleapis.com/css2?family=Barlow"]')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS; document.head.appendChild(l); }
    var sec = el('<section class="fp-ask" aria-labelledby="fp-ask-title">' +
      '<div class="fp-ask-in"><div class="fp-ask-head"><div><p class="fp-ask-kicker">Free · No account · Our stories only</p><h2 class="fp-ask-title" id="fp-ask-title">Ask GatorBait</h2><p class="fp-ask-sub">Answers come only from GatorBait stories, the ESPN scoreboard feed and our Gators history file. No guessing.</p></div></div>' +
      '<ul class="fp-ask-tabs" role="tablist"><li><button class="fp-ask-tab" role="tab" aria-selected="true" data-tab="ask">Ask</button></li><li><button class="fp-ask-tab" role="tab" aria-selected="false" data-tab="trivia">Gator Trivia</button></li></ul>' +
      '<div class="fp-ask-grid"><div class="fp-ask-pane" data-on data-pane="ask" role="tabpanel"><div class="fp-ask-chips">' + SUGGEST.map(function (q) { return '<button class="fp-ask-chip" type="button">' + esc(q) + '</button>'; }).join('') + '</div>' +
      '<ol class="fp-ask-log" aria-live="polite"></ol><form class="fp-ask-form"><label class="fp-ask-live" for="fp-ask-input">Ask a Gators question</label><input class="fp-ask-input" id="fp-ask-input" type="text" maxlength="280" autocomplete="off" placeholder="Ask about the schedule, a story or Gators history"><button class="fp-ask-btn" type="submit">Ask</button></form>' +
      '<p class="fp-ask-foot">Answers cite the story or feed they came from. If it is not in our material, it says so.</p></div>' +
      '<div class="fp-ask-pane" data-pane="trivia" role="tabpanel"><div class="fp-ask-tmeta"><span>Gator Trivia · <span class="fp-ask-tdate"></span></span><span class="fp-ask-streak"></span></div><p class="fp-ask-tq">Loading today\'s question…</p><ol class="fp-ask-opts"></ol><div class="fp-ask-res" hidden></div><p class="fp-ask-foot">One question a day, new at midnight ET. Keep the streak.</p></div></div></div></section>');
    var root = document.getElementById('gbm-live'), tunnel = root && root.querySelector('.fp-tunnel'), slot = document.getElementById('gbm-ask');
    if (afterEl && afterEl.parentNode) afterEl.parentNode.insertBefore(sec, afterEl.nextSibling);
    else if (tunnel && tunnel.parentNode) tunnel.parentNode.insertBefore(sec, tunnel.nextSibling); else if (slot) slot.appendChild(sec); else if (root) root.appendChild(sec); else document.body.appendChild(sec);
    wire(sec);
    return sec;
  }

  function wire(sec) {
    var log = sec.querySelector('.fp-ask-log'), form = sec.querySelector('.fp-ask-form'), input = sec.querySelector('.fp-ask-input'), btn = sec.querySelector('.fp-ask-btn');
    sec.querySelectorAll('.fp-ask-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        sec.querySelectorAll('.fp-ask-tab').forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        sec.querySelectorAll('.fp-ask-pane').forEach(function (p) { if (p.getAttribute('data-pane') === t.getAttribute('data-tab')) p.setAttribute('data-on', ''); else p.removeAttribute('data-on'); });
      });
    });
    sec.querySelectorAll('.fp-ask-chip').forEach(function (c) { c.addEventListener('click', function () { input.value = c.textContent; ask(); }); });
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(); });
    function ask() {
      var q = input.value.replace(/\s+/g, ' ').trim(); if (q.length < 3 || btn.disabled) return;
      btn.disabled = true; input.value = '';
      log.appendChild(el('<li class="fp-ask-q">' + esc(q) + '</li>'));
      var a = el('<li class="fp-ask-a"><p>Checking the desk…</p></li>'); log.appendChild(a); a.scrollIntoView({ block: 'nearest' });
      call('/ask', { q: q }).then(function (r) {
        if (r.error) { a.setAttribute('data-refused', ''); a.innerHTML = '<p>' + esc(r.error) + '</p>'; return; }
        if (!r.grounded) a.setAttribute('data-refused', '');
        var srcs = (r.sources || []).filter(function (s) { return safeUrl(s.url); });
        a.innerHTML = '<p>' + esc(String(r.answer || '').replace(/\s*\[\d+\]/g, '')) + '</p>' + (srcs.length ? '<ul class="fp-ask-src">' + srcs.map(function (s) { return '<li><span>' + esc(s.type === 'story' ? 'Story' : s.type === 'scoreboard' ? 'Scoreboard' : 'History') + '</span><a href="' + esc(safeUrl(s.url)) + '">' + esc(s.title) + '</a></li>'; }).join('') + '</ul>' : '');
      }).catch(function () { a.setAttribute('data-refused', ''); a.innerHTML = '<p>The desk is offline for a moment. Try again shortly.</p>'; })
        .then(function () { btn.disabled = false; });
    }
    trivia(sec);
  }

  function trivia(sec) {
    var q = sec.querySelector('.fp-ask-tq'), opts = sec.querySelector('.fp-ask-opts'), res = sec.querySelector('.fp-ask-res'), date = sec.querySelector('.fp-ask-tdate'), streak = sec.querySelector('.fp-ask-streak');
    function paintStreak(n) { streak.textContent = n > 0 ? 'Streak: ' + n + ' day' + (n === 1 ? '' : 's') : 'Start a streak'; }
    function paintResult(t, r) {
      opts.querySelectorAll('.fp-ask-opt').forEach(function (b, i) { b.disabled = true; if (i === r.answer) b.setAttribute('data-right', ''); else if (i === r.choice) b.setAttribute('data-wrong', ''); });
      res.hidden = false; paintStreak(r.streak);
      var link = r.url && safeUrl(r.url) ? ' <a class="fp-ask-src" style="display:inline" href="' + esc(safeUrl(r.url)) + '">Read the story</a>' : '';
      res.innerHTML = '<p class="fp-ask-verdict">' + (r.correct ? 'Correct.' : 'Not this time.') + '</p><p>' + esc(r.why) + link + '</p><div class="fp-ask-share"><code>' + esc(r.share) + '</code><button class="fp-ask-btn" type="button">Share</button></div>';
      res.querySelector('button').addEventListener('click', function () {
        var text = r.share;
        if (navigator.share) navigator.share({ text: text }).catch(function () {});
        else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { res.querySelector('button').textContent = 'Copied'; });
      });
    }
    call('/trivia/today').then(function (t) {
      if (!t || !t.q) { q.textContent = 'No question yet today. Check back soon.'; return; }
      date.textContent = t.label || t.date; paintStreak(t.streak || 0); q.textContent = t.q;
      opts.innerHTML = t.options.map(function (o) { return '<li><button class="fp-ask-opt" type="button">' + esc(o) + '</button></li>'; }).join('');
      opts.querySelectorAll('.fp-ask-opt').forEach(function (b, i) {
        b.addEventListener('click', function () {
          opts.querySelectorAll('.fp-ask-opt').forEach(function (x) { x.disabled = true; });
          call('/trivia/answer', { choice: i }).then(function (r) { if (r.error) { q.textContent = r.error; return; } paintResult(t, r); });
        });
      });
      if (t.answered) paintResult(t, { correct: t.answered.correct, choice: t.answered.choice, answer: t.answered.answer, why: t.answered.why, streak: t.streak, share: t.answered.share, url: null });
    }).catch(function () { q.textContent = 'Trivia is offline for a moment.'; });
  }

  window.GBM_ASK = { mount: mount };
})();
