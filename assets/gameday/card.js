/* GatorBait game-day card renderer. No dependencies. Reads window.__GAME__ (injected by render.mjs) or ?data=<json url>.
   Text is always set with textContent, so a stray < or & in a quote cannot break the card. */
(function () {
  'use strict';
  var qs = new URLSearchParams(location.search);
  var type = qs.get('type') || 'final';
  var fmt = qs.get('format') || 'landscape';
  document.body.className = 'fmt-' + fmt + ' type-' + type;
  var card = document.getElementById('card');

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== '') n.textContent = text;
    return n;
  }
  function add(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }

  /* ---------- AP-style date and time, always Eastern ---------- */
  var DAY = { Sun: 'Sun.', Mon: 'Mon.', Tue: 'Tue.', Wed: 'Wed.', Thu: 'Thu.', Fri: 'Fri.', Sat: 'Sat.' };
  var MON = { Jan: 'Jan.', Feb: 'Feb.', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'Aug.', Sep: 'Sept.', Oct: 'Oct.', Nov: 'Nov.', Dec: 'Dec.' };
  function parts(iso) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    var o = {};
    f.formatToParts(new Date(iso)).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }
  function dateText(iso) {
    if (!iso) return '';
    var p = parts(iso);
    return (DAY[p.weekday] || p.weekday) + ', ' + (MON[p.month] || p.month) + ' ' + p.day;
  }
  function timeText(iso) {
    if (!iso) return '';
    var p = parts(iso);
    var ap = p.dayPeriod.toLowerCase().replace('am', 'a.m.').replace('pm', 'p.m.');
    return (p.minute === '00' ? p.hour : p.hour + ':' + p.minute) + ' ' + ap + ' ET';
  }

  /* ---------- helpers ---------- */
  function rankText(t) { return t.rank ? 'No. ' + t.rank : ''; }
  function recText(t) {
    var bits = [];
    if (t.record) bits.push(t.record);
    if (t.confRecord) bits.push(t.confRecord + (t.confName ? ' ' + t.confName : ''));
    return bits.join(' · ');
  }
  function teamName(t) { return t.name || t.abbr || ''; }
  function ordered(game) {
    var teams = (game.teams || []).slice();
    var focus = game.focus;
    if (focus) teams.sort(function (a, b) { return (b.abbr === focus) - (a.abbr === focus); });
    return teams;
  }
  function brandTop(kicker) {
    var top = el('header', 'top');
    var brand = el('div', 'brand');
    add(brand, el('span', 'brand-main', 'GatorBait'), el('span', 'brand-sub', 'Media'));
    add(top, brand, el('div', 'kicker', kicker));
    return top;
  }
  var SAMPLE = false;
  function foot(left, right) {
    var f = el('footer', 'foot');
    var l = el('span'); var b = el('b', null, 'gatorbaitmedia.com'); l.appendChild(b);
    if (left && !SAMPLE) l.appendChild(document.createTextNode('  ·  ' + left));
    add(f, l, SAMPLE ? el('span', 'sample-tag', 'Sample data') : null, el('span', null, right));
    return f;
  }

  /* ---------- card types ---------- */
  function scoreboard(game) {
    var teams = ordered(game);
    var board = el('div', 'scoreboard');
    teams.forEach(function (t) {
      var isFocus = t.abbr === game.focus;
      var other = teams.filter(function (x) { return x !== t; })[0];
      var lost = other && Number(t.score) < Number(other.score) && game.status === 'final';
      var row = el('div', 'row ' + (isFocus ? 'focus' : 'other') + (lost ? ' lost' : ''));
      var id = el('div', 'id');
      var meta = el('div', 'meta');
      add(meta, el('span', 'rank', rankText(t)), el('span', 'rec', recText(t)));
      add(id, el('span', 'name', teamName(t)), meta);
      id.querySelector('.name').setAttribute('data-fit', '1');
      add(row, id, el('div', 'score', t.score != null ? String(t.score) : '–'));
      board.appendChild(row);
    });
    return board;
  }
  function statStrip(game) {
    var stats = (game.stats || []).slice(0, 3);
    if (!stats.length) return null;
    var teams = ordered(game);
    var strip = el('div', 'stats');
    stats.forEach(function (s) {
      var cell = el('div', 'stat');
      var vals = el('div', 'vals');
      teams.forEach(function (t, i) {
        if (i) vals.appendChild(el('i', null, '–'));
        vals.appendChild(el('span', t.abbr === game.focus ? 'v-focus' : 'v-other', (s.values || {})[t.abbr]));
      });
      add(cell, el('div', 'lab', s.label), vals);
      strip.appendChild(cell);
    });
    return strip;
  }
  function renderScore(game) {
    var live = type === 'halftime';
    var kicker = game.kicker || 'Florida Gators';
    card.appendChild(brandTop(kicker));
    var body = el('section', 'body');
    var row = el('div', 'status-row');
    add(row, el('span', 'pill', game.statusText || (live ? 'Halftime' : 'Final')),
      el('span', 'ctx', [dateText(game.date), game.venue].filter(Boolean).join(' · ')));
    var strip = statStrip(game);
    if (!strip) document.body.classList.add('no-stats');
    add(body, row, scoreboard(game), strip);
    card.appendChild(body);
    card.appendChild(foot(game.tv || '', game.stats && game.stats.length ? 'Stats: ESPN' : 'Score: ESPN'));
  }
  function renderPregame(game) {
    var kicker = game.kicker || 'Game day';
    card.appendChild(brandTop(kicker));
    var body = el('section', 'body');
    body.appendChild(el('div', 'pre-kicker', game.headline || 'Game day'));
    var m = el('div', 'matchup');
    var away = (game.teams || []).filter(function (t) { return t.homeAway === 'away'; })[0] || game.teams[0];
    var home = (game.teams || []).filter(function (t) { return t.homeAway === 'home'; })[0] || game.teams[1];
    function block(t, cls) {
      var d = el('div', 'team ' + cls + (t.abbr === game.focus ? ' focus' : ''));
      add(d, el('span', 'rank', rankText(t)), el('span', 'name', teamName(t)), el('span', 'rec', recText(t)));
      d.querySelector('.name').setAttribute('data-fit', '1');
      return d;
    }
    add(m, block(away, 'away'), el('div', 'at', 'at'), block(home, 'home'));
    body.appendChild(m);
    var when = el('div', 'when');
    var left = el('div');
    add(left, el('div', 't1', [dateText(game.date), timeText(game.date)].filter(Boolean).join(' · ')),
      el('div', 't2', [game.tv, game.venue, fmt === 'landscape' ? '' : game.city].filter(Boolean).join(' · ')));
    when.appendChild(left);
    if (game.line && (game.line.details || game.line.overUnder)) {
      var chips = el('div', 'chips');
      if (game.line.details) { var c1 = el('div', 'chip'); add(c1, el('small', null, 'Line'), document.createTextNode(game.line.details)); chips.appendChild(c1); }
      if (game.line.overUnder) { var c2 = el('div', 'chip'); add(c2, el('small', null, 'Total'), document.createTextNode(String(game.line.overUnder))); chips.appendChild(c2); }
      when.appendChild(chips);
    }
    body.appendChild(when);
    card.appendChild(body);
    card.appendChild(foot('', game.line ? 'Odds and records: ESPN' : 'Records: ESPN'));
  }
  function renderQuote(game) {
    var q = game.quote || {};
    card.appendChild(brandTop(game.kicker || 'In his words'));
    var body = el('section', 'body');
    var wrap = el('div', 'q-wrap');
    add(wrap, el('div', 'qmark', '“'), el('blockquote', 'qtext', q.text));
    var who = el('div', 'qwho');
    add(who, el('div', 'n', q.who), q.context ? el('div', 'c', q.context) : null);
    wrap.appendChild(who);
    body.appendChild(wrap);
    card.appendChild(body);
    card.appendChild(foot('', q.credit || game.source || ''));
  }

  /* ---------- fit ---------- */
  function fit() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-fit], .qtext'), function (n) { n.style.fontSize = ''; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-fit]'), function (n) {
      var size = parseFloat(getComputedStyle(n).fontSize);
      var guard = 80;
      while (n.scrollWidth > n.clientWidth + 1 && size > 40 && guard-- > 0) { size -= 2; n.style.fontSize = size + 'px'; }
    });
    var mu = document.querySelector('.matchup');
    if (mu) {
      var names = mu.querySelectorAll('.name');
      var min = Math.min.apply(null, Array.prototype.map.call(names, function (n) { return parseFloat(getComputedStyle(n).fontSize); }));
      Array.prototype.forEach.call(names, function (n) { n.style.fontSize = min + 'px'; });
    }
    var qt = document.querySelector('.qtext');
    if (qt) {
      var wrap = document.querySelector('.q-wrap');
      var contentH = function () {
        var k = wrap.children;
        return k[k.length - 1].getBoundingClientRect().bottom - k[0].getBoundingClientRect().top;
      };
      var s = parseFloat(getComputedStyle(qt).fontSize), g = 120;
      while (contentH() > wrap.clientHeight - 4 && s > 40 && g-- > 0) { s -= 2; qt.style.fontSize = s + 'px'; }
    }
  }

  function render(game) {
    SAMPLE = !!game.sample;
    if (type === 'pregame') renderPregame(game);
    else if (type === 'quote') renderQuote(game);
    else renderScore(game);
    fit();
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      fit();
      document.documentElement.setAttribute('data-ready', '1');
    });
  }

  if (window.__GAME__) render(window.__GAME__);
  else if (qs.get('data')) fetch(qs.get('data')).then(function (r) { return r.json(); }).then(render);
  else document.documentElement.setAttribute('data-ready', 'none');
})();
