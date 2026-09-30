(function () {
  'use strict';
  /* The Stands: client for the GatorBait live chat room (worker.mjs). Same conventions as front-page.js:
   * one owned root, CSS injected once, paint once then patch in place (no jump), Barlow / Barlow Condensed,
   * Swamp Night palette. Config comes from window.__GBM_STANDS__:
   *   { api: 'https://stands.example.workers.dev', room: 'game-2026-10-03', mount: '#gbm-stands',
   *     token: '<signed token>' | tokenUrl: '/_functions/standsToken', signin: '/account/my-account' }
   * Outside an open window the room shows the score, the kickoff countdown and the next show, never an empty feed. */
  var C = window.__GBM_STANDS__ || {}, VERSION = 'stands-2026.1', TZ = 'America/New_York', RING = 200;
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'], WDS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  var mount = document.querySelector(C.mount || '#gbm-stands'); if (!mount || mount.getAttribute('data-stands')) return;
  mount.setAttribute('data-stands', VERSION);
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function now() { var t = Number(window.__GBM_FP_NOW__); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
  function et(ms) { var o = {}; new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; }); return { wd: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], mo: Number(o.month) - 1, d: Number(o.day), h: Number(o.hour) % 24, m: Number(o.minute) }; }
  function clock(ms) { var e = et(ms), h = e.h % 12 || 12; return h + ':' + String(e.m).padStart(2, '0') + (e.h < 12 ? ' a.m.' : ' p.m.'); }
  function gameWhen(iso) { var t = Date.parse(iso); if (!Number.isFinite(t)) return ''; var e = et(t); return WDS[e.wd] + ', ' + MONTHS[e.mo] + ' ' + e.d + ' · ' + clock(t) + ' ET'; }
  function ranked(rank, name) { return (rank ? 'No. ' + rank + ' ' : '') + name; }
  function pad(x) { return (x < 10 ? '0' : '') + x; }

  var CSS = '.gbs{--n:#07122e;--b:#0021a5;--o:#fa4616;--ink:#f3f5fa;--mut:#b9c4dc;--c:"Barlow Condensed","Barlow",sans-serif;--s:"Barlow",sans-serif;display:flex;flex-direction:column;width:100%;max-width:980px;margin:0 auto;height:min(78vh,640px);min-height:420px;background:#040b1f;color:var(--ink);font:16px/1.45 var(--s);border-top:3px solid var(--o);text-align:left}' +
    '.gbs *{box-sizing:border-box}.gbs-strip{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px 10px;padding:10px 12px;background:radial-gradient(80% 100% at 50% 0,rgba(0,33,165,.6),transparent 70%);border-bottom:1px solid rgba(255,255,255,.12)}' +
    '.gbs-t{display:grid;gap:3px;min-width:0}.gbs-t small{font:700 10px/1 var(--c);letter-spacing:.14em;text-transform:uppercase;color:#ffb08f}.gbs-t b{font:800 22px/1 var(--c);text-transform:uppercase;overflow-wrap:anywhere}.gbs-t.h{text-align:right}' +
    '.gbs-sc{display:flex;gap:8px;align-items:baseline;font:800 36px/1 var(--c);font-variant-numeric:tabular-nums}.gbs-sc i{color:var(--o);font-style:normal;font-size:.6em}' +
    '.gbs-clk{grid-column:1/-1;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;margin:0;font:700 11px/1 var(--c);letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}' +
    '.gbs-clk em{display:inline-flex;align-items:center;gap:6px;padding:4px 8px;background:#c8102e;color:#fff;font-style:normal;font-weight:800}.gbs-clk em::before{content:"";width:6px;height:6px;border-radius:50%;background:#fff}.gbs-clk em.off{background:var(--b)}' +
    '.gbs-hd{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;font:800 14px/1 var(--c);letter-spacing:.12em;text-transform:uppercase}.gbs-hd span{font:600 12px/1 var(--s);letter-spacing:0;text-transform:none;color:var(--mut)}' +
    '.gbs-sys{margin:0 12px 8px;padding:8px 10px;background:rgba(0,33,165,.35);border-left:3px solid var(--o);font:600 12px/1.4 var(--s);color:var(--mut)}.gbs-sys:empty{display:none}' +
    '.gbs-feed{flex:1;overflow-y:auto;padding:4px 12px 8px;display:flex;flex-direction:column;gap:10px;min-height:0}' +
    '.gbs-p{display:grid;grid-template-columns:1fr auto;gap:2px 8px}.gbs-who{display:flex;gap:6px;align-items:center;font:700 12px/1 var(--c);letter-spacing:.1em;text-transform:uppercase;color:#c8d3ef}.gbs-who time{font:600 10px/1 var(--s);letter-spacing:0;text-transform:none;color:var(--mut)}' +
    '.gbs-bd{padding:3px 5px;border-radius:2px;background:var(--o);color:#fff;font:800 9px/1 var(--c);letter-spacing:.1em}.gbs-bd.s{background:var(--b)}.gbs-p p{margin:0;font-size:15px;overflow-wrap:anywhere}' +
    '.gbs-rp{grid-row:1/3;align-self:start;width:26px;height:26px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:none;color:var(--mut);font:800 12px/1 var(--c);cursor:pointer}.gbs-rp.on{background:var(--o);border-color:var(--o);color:#fff}' +
    '.gbs-slow{display:flex;justify-content:space-between;gap:8px;padding:0 12px 6px;font:600 11px/1.3 var(--s);color:var(--mut)}' +
    '.gbs-in{display:flex;gap:8px;padding:8px 12px 12px;border-top:1px solid rgba(255,255,255,.12)}.gbs-in input{flex:1;min-width:0;min-height:44px;padding:0 12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:var(--ink);font:400 15px var(--s)}.gbs-in input:disabled{opacity:.6}' +
    '.gbs-in button,.gbs-in a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border:0;background:var(--o);color:#fff;font:800 15px/1 var(--c);letter-spacing:.06em;text-transform:uppercase;text-decoration:none;cursor:pointer}' +
    '.gbs-quiet{display:none;flex:1;align-content:center;gap:10px;padding:24px 16px;text-align:center}.gbs-quiet h3{margin:0;font:800 30px/1 var(--c);text-transform:uppercase;color:var(--ink)}.gbs-quiet p{margin:0;font-size:14px;color:var(--mut)}.gbs-quiet b{color:var(--ink)}' +
    '.gbs-cd{display:flex;justify-content:center;gap:12px;font:800 44px/1 var(--c);font-variant-numeric:tabular-nums}.gbs-cd span{display:grid}.gbs-cd i{font:700 10px/1 var(--c);letter-spacing:.14em;color:#ffb08f;font-style:normal}' +
    '.gbs[data-quiet="1"] .gbs-quiet{display:grid}.gbs[data-quiet="1"] .gbs-feed,.gbs[data-quiet="1"] .gbs-sys,.gbs[data-quiet="1"] .gbs-slow,.gbs[data-quiet="1"] .gbs-in{display:none}' +
    '@media(min-width:821px){.gbs-t b{font-size:28px}.gbs-sc{font-size:44px}.gbs-p p{font-size:16px}}';
  if (!document.getElementById('gbs-css')) { var st = document.createElement('style'); st.id = 'gbs-css'; st.textContent = CSS; document.head.appendChild(st); }

  mount.innerHTML = '<section class="gbs" data-quiet="0" aria-label="The Stands, GatorBait live chat"><div class="gbs-strip" data-gbs="strip"></div>' +
    '<div class="gbs-hd">The Stands <span data-gbs="count">Connecting</span></div><p class="gbs-sys" data-gbs="sys"></p><div class="gbs-feed" data-gbs="feed" aria-live="polite"></div><div class="gbs-quiet" data-gbs="quiet"></div>' +
    '<div class="gbs-slow"><span data-gbs="slow">Slow mode</span><span>Members: no wait</span></div>' +
    '<form class="gbs-in" data-gbs="form"><input data-gbs="msg" maxlength="240" autocomplete="off" placeholder="Say something, Gators" aria-label="Message"><button type="submit">Send</button></form></section>';
  var root = mount.firstChild, you = null, room = null, settings = { slow: 30, memberOnly: false }, sock = null, tries = 0, wait = 0, waitTimer = 0, lastMsg = 0, seen = {};
  function q(k) { return root.querySelector('[data-gbs="' + k + '"]'); }
  function put(k, text) { var el = q(k); if (el && el.textContent !== text) el.textContent = text; }

  /* ---------- strip: live score when the desk has one, otherwise the next game ---------- */
  function strip() {
    var el = q('strip'), r = room || {}, lv = r.live, tm = r.team || {}, n = r.next, html;
    if (lv && lv.away && lv.home) {
      html = side(lv.away) + '<span class="gbs-sc"><b>' + esc(lv.away.score == null ? 0 : lv.away.score) + '</b><i>–</i><b>' + esc(lv.home.score == null ? 0 : lv.home.score) + '</b></span>' + side(lv.home, true) +
        '<p class="gbs-clk"><em>' + esc(lv.status === 'final' ? 'Final' : 'Live') + '</em><span>' + esc(lv.clock || '') + '</span>' + (n && n.tv ? '<span>' + esc(n.tv) + '</span>' : '') + '</p>';
    } else if (n) {
      var fla = { name: 'Florida', rank: tm.rank, record: tm.record }, opp = { name: n.opponent, rank: n.rank };
      html = side(n.home ? opp : fla) + '<span class="gbs-sc"><i>' + (n.home ? 'vs.' : 'at') + '</i></span>' + side(n.home ? fla : opp, true) +
        '<p class="gbs-clk"><em class="' + (r.open ? '' : 'off') + '">' + esc(r.open ? 'Room open' : 'Next game') + '</em><span>' + esc(gameWhen(r.kickoff)) + '</span>' + (n.tv ? '<span>' + esc(n.tv) + '</span>' : '') + '</p>';
    } else html = '<p class="gbs-clk"><em class="off">The Stands</em><span>GatorBait live chat</span></p>';
    if (el.innerHTML !== html) el.innerHTML = html;
    function side(s, h) { return '<span class="gbs-t' + (h ? ' h' : '') + '"><small>' + esc([s.rank ? 'No. ' + s.rank : '', s.record || ''].filter(Boolean).join(' · ') || ' ') + '</small><b>' + esc(s.name) + '</b></span>'; }
  }
  /* ---------- quiet state: no open room, or nothing said in ten minutes ---------- */
  function quiet() {
    var r = room || {}, k = Date.parse(r.kickoff), on = !r.open || (now() - lastMsg > 600000 && !q('feed').children.length);
    root.setAttribute('data-quiet', on ? '1' : '0'); if (!on) return;
    var s = Number.isFinite(k) ? Math.max(0, Math.floor((k - now()) / 1000)) : 0, l = r.last, n = r.next;
    var html = '<h3>' + (r.open ? 'Quiet in here' : 'The room opens on game day') + '</h3>' +
      (s > 0 ? '<p>Kickoff in</p><div class="gbs-cd"><span>' + pad(Math.floor(s / 86400)) + '<i>days</i></span><span>' + pad(Math.floor(s / 3600) % 24) + '<i>hrs</i></span><span>' + pad(Math.floor(s / 60) % 60) + '<i>min</i></span><span>' + pad(s % 60) + '<i>sec</i></span></div>' : '') +
      (n ? '<p><b>' + esc(ranked(r.team && r.team.rank, 'Florida') + (n.home ? ' vs. ' : ' at ') + ranked(n.rank, n.opponent)) + '</b><br>' + esc(gameWhen(r.kickoff) + (n.tv ? ' · ' + n.tv : '')) + '</p>' : '') +
      (l && l.score ? '<p>Last: Florida ' + esc(l.score.fla) + ', ' + esc(ranked(l.rank, l.opponent)) + ' ' + esc(l.score.opp) + (l.date ? ' (' + esc(MONTHS[et(Date.parse(l.date)).mo] + ' ' + et(Date.parse(l.date)).d) + ')' : '') + '</p>' : '') +
      '<p>The Buddy Martin Show: Mondays, Wednesdays and Thursdays at 9 p.m. ET. The room opens 30 minutes before kickoff and showtime.</p>';
    var el = q('quiet'); if (el.innerHTML !== html) el.innerHTML = html;
  }
  /* ---------- feed: append only, ring of RING, stay pinned to the bottom unless the reader scrolled up ---------- */
  function post(m) {
    if (seen[m.id]) return; seen[m.id] = 1; lastMsg = Math.max(lastMsg, m.ts || now());
    var feed = q('feed'), el = document.createElement('div'), mine = you && m.name === you.name;
    el.className = 'gbs-p'; el.setAttribute('data-id', m.id);
    el.innerHTML = '<div class="gbs-who">' + esc(m.name) + (m.tier === 'member' ? '<i class="gbs-bd">Member</i>' : m.tier === 'staff' ? '<i class="gbs-bd s">GatorBait</i>' : '') + '<time>' + esc(clock(m.ts || now())) + '</time></div><p>' + esc(m.text) + '</p>' +
      (mine ? '' : '<button class="gbs-rp" type="button" title="Report this post" aria-label="Report this post">!</button>');
    var near = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 80;
    feed.appendChild(el); while (feed.children.length > RING) feed.removeChild(feed.firstChild);
    if (near || mine) feed.scrollTop = feed.scrollHeight;
    quiet();
  }
  q('feed').addEventListener('click', function (e) {
    var b = e.target.closest('.gbs-rp'); if (!b || !sock || sock.readyState !== 1) return;
    sock.send(JSON.stringify({ t: 'report', id: b.closest('.gbs-p').getAttribute('data-id') })); b.classList.add('on'); b.textContent = '✓'; b.disabled = true;
  });
  function slowLine() { var priv = you && (you.tier === 'member' || you.tier === 'staff'); put('slow', wait > 0 ? 'Slow mode: next post in ' + wait + ' s' : settings.memberOnly ? 'Members only right now' : settings.slow > 0 ? 'Slow mode: one post every ' + settings.slow + ' seconds' + (priv ? ' (not for you)' : '') : 'Slow mode off'); q('msg').disabled = wait > 0; }
  function holdFor(secs) { clearInterval(waitTimer); wait = secs; slowLine(); waitTimer = setInterval(function () { wait--; if (wait <= 0) { wait = 0; clearInterval(waitTimer); } slowLine(); }, 1000); }
  q('form').addEventListener('submit', function (e) {
    e.preventDefault(); var v = q('msg').value.trim(); if (!v || wait > 0 || !sock || sock.readyState !== 1) return;
    sock.send(JSON.stringify({ t: 'msg', text: v })); q('msg').value = '';
  });

  /* ---------- socket: token from config or the Velo function, reconnect with backoff ---------- */
  function token(cb) {
    if (C.token) return cb(C.token);
    if (!C.tokenUrl) return cb('');
    fetch(C.tokenUrl, { credentials: 'include' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { cb(j && j.token || ''); }).catch(function () { cb(''); });
  }
  function signin() {
    put('count', 'Sign in to chat');
    var f = q('form'); f.innerHTML = '<a href="' + esc(C.signin || '/account/my-account') + '">Sign in to chat</a>';
  }
  function connect() {
    token(function (tk) {
      if (!tk) return signin();
      var base = String(C.api || '').replace(/^http/, 'ws').replace(/\/$/, '');
      var ws = new WebSocket(base + '/room/' + encodeURIComponent(C.room || 'game') + '/ws?token=' + encodeURIComponent(tk));
      sock = ws;
      ws.onopen = function () { tries = 0; };
      ws.onmessage = function (e) {
        var o; try { o = JSON.parse(e.data); } catch (_) { return; }
        if (o.t === 'welcome') { you = o.you; settings = o.settings; room = o.room; (o.msgs || []).forEach(post); strip(); quiet(); slowLine(); put('count', 'Signed in as ' + you.name); }
        else if (o.t === 'msg') post(o.m);
        else if (o.t === 'sys') put('sys', o.text);
        else if (o.t === 'err') { put('sys', o.text); if (o.code === 'slow' && o.wait) holdFor(o.wait); }
        else if (o.t === 'del') { var el = q('feed').querySelector('[data-id="' + o.id + '"]'); if (el) el.remove(); }
        else if (o.t === 'count') put('count', (you ? you.name + ' · ' : '') + o.n + ' in the room');
        else if (o.t === 'room') { room = o.room; settings = o.settings; strip(); quiet(); slowLine(); }
      };
      ws.onclose = function () { sock = null; put('count', 'Reconnecting'); setTimeout(connect, Math.min(30000, 1000 * Math.pow(2, tries++))); };
      ws.onerror = function () { try { ws.close(); } catch (_) { } };
    });
  }
  connect();
  setInterval(function () { quiet(); if (sock && sock.readyState === 1) sock.send('{"t":"ping"}'); }, 1000 * 15);
  setInterval(function () { if (root.getAttribute('data-quiet') === '1') quiet(); }, 1000);
})();
