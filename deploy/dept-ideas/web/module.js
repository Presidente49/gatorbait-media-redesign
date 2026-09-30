/* Make the Call: front-page module (score picks + live crowd distribution) for the section under The Road Ahead.
 * Same conventions as sports-live/src/front-page.js: one IIFE, string markup with esc(), paint once from data the
 * page already has (the scoreboard's `next` game), then the Worker feed only changes values in place. No layout
 * moves after paint. Barlow + Barlow Condensed via the page's tokens. Storage: one random token in localStorage
 * (no name, no email, no Wix member data). API contract: worker.mjs in this folder.
 *
 * Integration in front-page.js (three lines, not applied here):
 *   var game = GBM_CALL.game(sb);                         // from readScoreboard()'s object
 *   ... roadHtml(sb) + (game ? GBM_CALL.html(game) : '') + hubHtml(...)
 *   try { GBM_CALL.init(root); } catch (_) {}            // next to initRoad(root)
 */
(function () {
  'use strict';
  var VERSION = 'make-the-call.1';
  var API = String(window.__GBM_CALL_API__ || 'https://gatorbait-make-the-call.workers.dev/v1').replace(/\/+$/, '');
  var TZ = 'America/New_York';
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var WDS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var BINS = [['fla14', 'Florida by 14+'], ['fla7', 'Florida by 7-13'], ['fla1', 'Florida by 1-6'], ['opp1', '{opp} by 1-6'], ['opp7', '{opp} by 7-13'], ['opp14', '{opp} by 14+']];
  var sessionToken = '';

  function now() { var t = Number(window.__GBM_FP_NOW__); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function et(ms) {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { wd: WD[o.weekday], h: Number(o.hour) % 24, m: Number(o.minute), mo: Number(o.month) - 1, d: Number(o.day) };
  }
  function gameWhen(iso) { var t = Date.parse(iso); if (!Number.isFinite(t)) return ''; var e = et(t), h = e.h % 12 || 12; return WDS[e.wd] + ', ' + MONTHS[e.mo] + ' ' + e.d + ' · ' + h + (e.m ? ':' + String(e.m).padStart(2, '0') : '') + (e.h < 12 ? ' a.m.' : ' p.m.') + ' ET'; }
  function ranked(rank, name) { return (rank ? 'No. ' + rank + ' ' : '') + name; }
  function rand() { try { if (crypto.randomUUID) return crypto.randomUUID().replace(/-/g, ''); var a = new Uint8Array(16); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); } catch (_) { return String(Math.random()).slice(2) + String(Date.now()); } }
  function token() { try { var t = localStorage.getItem('gbm-call-token'); if (!/^[A-Za-z0-9_-]{16,64}$/.test(t || '')) { t = rand(); localStorage.setItem('gbm-call-token', t); } return t; } catch (_) { return sessionToken || (sessionToken = rand()); } }
  function remember(id, pick) { try { if (pick) localStorage.setItem('gbm-call-' + id, JSON.stringify(pick)); else return JSON.parse(localStorage.getItem('gbm-call-' + id) || 'null'); } catch (_) {} return null; }
  function bin(fla, opp) { var m = fla - opp; return m >= 14 ? 'fla14' : m >= 7 ? 'fla7' : m >= 1 ? 'fla1' : m >= -6 ? 'opp1' : m >= -13 ? 'opp7' : 'opp14'; }

  /* The game comes from the scoreboard object front-page.js already holds (readScoreboard(raw)); the ESPN event id keys the Worker. */
  function callGame(sb) {
    var n = sb && sb.next; if (!n || !/^\d{6,12}$/.test(String(n.eventId || '')) || !Number.isFinite(Date.parse(n.kickoffIso))) return null;
    return { id: String(n.eventId), opponent: String(n.opponent || ''), opponentRank: n.opponentRank || null, flaRank: sb.team && sb.team.rank || null, home: n.home === true, kickoff: n.kickoffIso, tv: n.tv || '', venue: n.venue || '' };
  }
  function callHtml(g) {
    var opp = g.opponent, locked = now() >= Date.parse(g.kickoff), mine = remember(g.id);
    function team(key, name, rank) { return '<div class="tm"><label for="gc-' + key + '"><small>' + esc(key === 'fla' ? (g.home ? 'Home' : 'Away') : (g.home ? 'Away' : 'Home')) + '</small>' + esc(ranked(rank, name)) + '</label><div class="step"><button type="button" data-t="' + key + '" data-d="-1" aria-label="' + esc(name) + ' minus one">−</button><input id="gc-' + key + '" name="' + key + '" type="number" inputmode="numeric" pattern="[0-9]*" min="0" max="99" placeholder="0" autocomplete="off"' + (mine ? ' value="' + esc(mine[key]) + '"' : '') + '><button type="button" data-t="' + key + '" data-d="1" aria-label="' + esc(name) + ' plus one">+</button></div></div>'; }
    var fla = team('fla', 'Florida', g.flaRank), oth = team('opp', opp, g.opponentRank);
    return '<section id="gbm-call" aria-label="Make the Call: pick the score" data-state="' + (locked ? 'locked' : mine ? 'set' : 'pick') + '" data-game="' + esc(g.id) + '" data-kickoff="' + esc(g.kickoff) + '" data-loaded="0" data-v="' + VERSION + '"><div class="wrap">' +
      '<div class="hd"><div><p class="kick">Fan module · Make the Call</p><h2>Call <span>the score</span></h2></div><p class="mt"><b>' + esc(ranked(g.flaRank, 'Florida') + (g.home ? ' vs. ' : ' at ') + ranked(g.opponentRank, opp)) + '</b>' + esc(gameWhen(g.kickoff) + (g.tv ? ' · ' + g.tv : '')) + '</p></div>' +
      '<div class="grid"><form class="pick" novalidate>' + (g.home ? oth + fla : fla + oth) +
      '<div class="row"><button class="go" type="submit"' + (locked ? ' disabled' : '') + '>' + (locked ? 'Picks are locked' : mine ? 'Update my call' : 'Lock my call') + '</button><p class="msg" role="status" aria-live="polite"' + (mine ? '>Your call: Florida ' + esc(mine.fla) + ', ' + esc(opp) + ' ' + esc(mine.opp) : '>') + '</p></div>' +
      '<p class="fine">One call per device, changeable until kickoff. No account, no email, nothing shared.</p></form>' +
      '<div class="crowd" aria-label="Gator Nation\'s call"><h3>Gator Nation says <span data-c="tag">' + (locked ? 'Locked' : 'Live') + '</span></h3>' +
      '<div class="stats"><div><b data-c="count">—</b><span>calls in</span></div><div><b data-c="avg">—</b><span>crowd score</span></div><div><b data-c="fla">—</b><span>pick Florida</span></div></div>' +
      '<ul class="bins">' + BINS.map(function (b) { return '<li data-bin="' + b[0] + '" class="' + (b[0].indexOf('opp') === 0 ? 'opp' : '') + (mine && bin(mine.fla, mine.opp) === b[0] ? ' mine' : '') + '"><span class="lb">' + esc(b[1].replace('{opp}', opp)) + '</span><span class="bar"><i></i></span><b data-n="' + b[0] + '">–</b></li>'; }).join('') + '</ul>' +
      '<p class="lock"><span data-c="lock">' + (locked ? 'Picks locked at kickoff' : 'Locks at kickoff') + '</span><span data-c="top"></span></p></div></div></div></section>';
  }

  /* After paint: fetch the crowd, wire the form, tick the lock line. Values only; the boxes were reserved in callHtml. */
  function initCall(root) {
    var S = root.querySelector('#gbm-call'); if (!S || S.__gbmCall) return; S.__gbmCall = true;
    var id = S.getAttribute('data-game'), kick = Date.parse(S.getAttribute('data-kickoff'));
    var form = S.querySelector('form'), go = S.querySelector('.go'), msg = S.querySelector('.msg'), inFla = S.querySelector('#gc-fla'), inOpp = S.querySelector('#gc-opp');
    var oppName = (S.querySelector('[data-bin=opp14] .lb').textContent || '').replace(/ by 14\+$/, '');
    function put(sel, v) { var el = S.querySelector('[data-c="' + sel + '"]'); if (el && el.textContent !== String(v)) el.textContent = String(v); }
    function say(text, kind) { msg.textContent = text || ''; if (kind) msg.setAttribute('data-kind', kind); else msg.removeAttribute('data-kind'); }
    function locked() { return now() >= kick; }
    function lockUI() { S.setAttribute('data-state', 'locked'); go.disabled = true; go.textContent = 'Picks are locked'; inFla.disabled = inOpp.disabled = true; S.querySelectorAll('.step button').forEach(function (b) { b.disabled = true; }); put('tag', 'Locked'); put('lock', 'Picks locked at kickoff'); }
    function show(d) {
      if (!d || typeof d !== 'object') return;
      var n = Number(d.count) || 0, mine = remember(id);
      put('count', n ? n.toLocaleString('en-US') : '0');
      put('avg', d.avg ? d.avg.fla + '–' + d.avg.opp : '—');
      put('fla', typeof d.flaShare === 'number' ? Math.round(d.flaShare * 100) + '%' : '—');
      (d.bins || []).forEach(function (b) { var li = S.querySelector('[data-bin="' + b.key + '"]'); if (!li) return; var i = li.querySelector('.bar i'), c = li.querySelector('b'); if (i) i.style.width = Math.round((b.share || 0) * 100) + '%'; if (c) c.textContent = String(b.n || 0); li.classList.toggle('mine', !!(mine && bin(mine.fla, mine.opp) === b.key)); });
      put('top', d.top && n >= 5 ? 'Most common call: Florida ' + d.top.fla + ', ' + oppName + ' ' + d.top.opp : n && n < 5 ? 'Early returns' : '');
      if (d.locked && !locked()) { kick = now(); }
      if (d.locked) lockUI();
      S.setAttribute('data-loaded', '1');
    }
    function tick() {
      if (locked()) { lockUI(); return; }
      var ms = kick - now(); put('lock', 'Locks at kickoff · ' + Math.floor(ms / 864e5) + 'd ' + Math.floor(ms % 864e5 / 36e5) + 'h ' + Math.floor(ms % 36e5 / 6e4) + 'm');
    }
    function req(method, path, body) {
      var c = new AbortController(), t = setTimeout(function () { c.abort(); }, 4000);
      // text/plain keeps the POST a "simple" CORS request: no preflight round trip on game day.
      return fetch(API + path, { method: method, signal: c.signal, credentials: 'omit', cache: 'no-store', headers: body ? { 'content-type': 'text/plain;charset=UTF-8' } : {}, body: body ? JSON.stringify(body) : undefined })
        .then(function (r) { clearTimeout(t); return r.json().then(function (j) { return { status: r.status, json: j }; }); });
    }
    function clamp(v) { v = parseInt(v, 10); return Number.isFinite(v) ? Math.max(0, Math.min(99, v)) : null; }
    S.querySelectorAll('.step button').forEach(function (b) {
      b.addEventListener('click', function () { var inp = b.getAttribute('data-t') === 'fla' ? inFla : inOpp, v = clamp(inp.value); inp.value = Math.max(0, Math.min(99, (v == null ? 0 : v) + Number(b.getAttribute('data-d')))); say(''); });
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (locked()) { lockUI(); say('Kickoff has passed. Picks are locked.', 'err'); return; }
      var fla = clamp(inFla.value), o = clamp(inOpp.value);
      if (fla === null || o === null) { say('Enter both scores, 0 to 99.', 'err'); return; }
      if (fla === o) { say('No ties. Pick a winner.', 'err'); return; }
      go.disabled = true; say('Sending…');
      req('POST', '/pick', { gameId: id, fla: fla, opp: o, token: token() }).then(function (r) {
        go.disabled = false;
        if (r.status === 200 || r.status === 201) { remember(id, { fla: fla, opp: o }); S.setAttribute('data-state', 'set'); go.textContent = 'Update my call'; say('Your call: Florida ' + fla + ', ' + oppName + ' ' + o + (r.status === 201 ? ' · counted' : ' · updated')); show(r.json); }
        else if (r.status === 409) { lockUI(); say('Kickoff has passed. Picks are locked.', 'err'); }
        else if (r.status === 429) say('Easy. Try again in a minute.', 'err');
        else say((r.json && r.json.error) || 'Could not send your call. Try again.', 'err');
      }).catch(function () { go.disabled = false; say('No connection. Try again.', 'err'); });
    });
    tick(); if (S.__tick) clearInterval(S.__tick); S.__tick = setInterval(function () { if (!S.isConnected) { clearInterval(S.__tick); return; } tick(); }, 30000);
    req('GET', '/game/' + id).then(function (r) { if (r.status === 200) show(r.json); else S.setAttribute('data-loaded', 'err'); }).catch(function () { S.setAttribute('data-loaded', 'err'); });
  }
  window.GBM_CALL = { version: VERSION, game: callGame, html: callHtml, init: initCall, bin: bin };
})();
