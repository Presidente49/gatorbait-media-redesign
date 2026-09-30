/* GatorBait Share 2026: one-tap share cards for stories, The Road Ahead, The Tunnel and the show.
 * Drop-in module in the Front Page 2026 style (sports-live/src/front-page.js). Standalone: it adds a
 * Share button to the homepage modules the runtime paints (#gbm-road, .fp-tunnel, .fp-show) and to a
 * Wix blog post page, draws a 1200x630 card on the device with Canvas from the live feeds
 * (gazette-live/posts.json, sports-live/scoreboard.json), then calls the Web Share API with the PNG
 * attached, or opens an in-page sheet: Copy link, Post on X, Facebook, Save image.
 * Every shared URL carries utm_source=gatorbait_share, utm_medium, utm_campaign.
 * Test hooks: window.__GBM_SHARE__ {posts, scoreboard, now} pre-seeds data; window.__GBM_SHARE_RUNTIME__
 * exposes {version, open(kind), card(kind) -> Promise<dataURL>, mount()}. Nothing here writes to Wix. */
(function () {
  'use strict';
  var VERSION = 'share-2026.1';
  var PAGES = 'https://presidente49.github.io/gatorbait-media-redesign/';
  var SITE = 'https://www.gatorbaitmedia.com';
  var TZ = 'America/New_York';
  var C = { navy: '#07122e', blue: '#0021a5', orange: '#fa4616', ink: '#f3f5fa', muted: '#b9c4dc', win: '#7ef0a6' };
  var SHOW = { name: 'The Buddy Martin Show', path: '/the-buddy-martin-show', when: 'Mondays, Wednesdays and Thursdays at 9 p.m. ET', days: [1, 3, 4], hour: 21 };
  var CSS = '.gbm-share-btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border:0;border-radius:6px;background:#fa4616;color:#fff;font:800 15px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}' +
    '.gbm-share-btn.ghost{background:transparent;border:1px solid #2b3f80;color:#f3f5fa}.gbm-share-btn span{white-space:nowrap}.gbm-share-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '#gbm-share-veil{position:fixed;inset:0;background:rgba(3,8,24,.72);z-index:9998}' +
    '#gbm-share{position:fixed;left:0;right:0;bottom:0;z-index:9999;max-width:480px;margin:0 auto;background:#0b1a44;color:#f3f5fa;border-radius:18px 18px 0 0;padding:12px 16px calc(20px + env(safe-area-inset-bottom));font:16px/1.4 "Barlow",sans-serif;transform:translateY(105%);transition:transform .25s}' +
    '#gbm-share.on{transform:none}#gbm-share i{display:block;width:40px;height:4px;border-radius:2px;background:#2b3f80;margin:0 auto 10px}' +
    '#gbm-share canvas{width:100%;height:auto;display:block;border-radius:10px;background:#07122e}' +
    '#gbm-share p{margin:10px 0;font-size:13px;color:#b9c4dc;white-space:pre-wrap;word-break:break-word}' +
    '#gbm-share .g{display:grid;grid-template-columns:1fr 1fr;gap:8px}#gbm-share .g .gbm-share-btn{justify-content:center;font:600 15px "Barlow",sans-serif;text-transform:none;letter-spacing:0;border-radius:10px}' +
    '#gbm-share .g .w{grid-column:1/-1}#gbm-share-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:10000;background:#fa4616;color:#fff;padding:10px 16px;border-radius:999px;font:600 15px "Barlow",sans-serif;opacity:0;transition:opacity .2s;pointer-events:none}' +
    '@media(min-width:900px){#gbm-share{bottom:auto;top:50%;transform:translate(0,-45%);opacity:0;border-radius:18px;transition:opacity .2s}#gbm-share.on{transform:translateY(-50%);opacity:1}}' +
    '@media(prefers-reduced-motion:reduce){#gbm-share{transition:none}}';
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>';
  if (window.__GBM_SHARE_RUNTIME__) { window.__GBM_SHARE_RUNTIME__.mount(); return; }

  var seed = window.__GBM_SHARE__ || {};
  var data = { posts: seed.posts || null, scoreboard: seed.scoreboard || null };
  var cur = 'story', cv = null, ctx = null, opened = false;
  function now() { var t = Number(seed.now ? Date.parse(seed.now) : window.__GBM_FP_NOW__); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, attrs, html) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }

  /* ---------- Time (America/New_York), AP style ---------- */
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var WDS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  function et(ms) {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false }).formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { wd: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], mo: Number(o.month) - 1, d: Number(o.day), h: Number(o.hour) % 24, m: Number(o.minute) };
  }
  function clock(ms) { var e = et(ms), h = e.h % 12 || 12; return h + (e.m ? ':' + String(e.m).padStart(2, '0') : '') + (e.h < 12 ? ' a.m.' : ' p.m.'); }
  function gameWhen(iso) { var t = Date.parse(iso); if (!Number.isFinite(t)) return ''; var e = et(t); return WDS[e.wd] + ', ' + MONTHS[e.mo] + ' ' + e.d + ', ' + clock(t) + ' ET'; }
  function left(iso) {
    var ms = Date.parse(iso) - now(); if (!Number.isFinite(ms) || ms <= 0) return '';
    return Math.floor(ms / 864e5) + 'd ' + Math.floor(ms % 864e5 / 36e5) + 'h ' + Math.floor(ms % 36e5 / 6e4) + 'm';
  }
  function showNext() {
    var t = now(), e = et(t);
    for (var i = 0; i < 8; i++) { var d = (e.wd + i) % 7; if (SHOW.days.indexOf(d) >= 0 && (i > 0 || e.h < SHOW.hour)) return WDS[d] + ' 9 p.m. ET'; }
    return '9 p.m. ET';
  }

  /* ---------- Data: the same feeds the homepage uses, fetched once, on first tap ---------- */
  function fetchJson(url, ms) {
    var ctl = 'AbortController' in window ? new AbortController() : null, timer = ctl && setTimeout(function () { ctl.abort(); }, ms);
    return fetch(url, { signal: ctl && ctl.signal, credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).finally(function () { if (timer) clearTimeout(timer); });
  }
  function load() {
    var jobs = [];
    if (!data.scoreboard) jobs.push(fetchJson(PAGES + 'sports-live/scoreboard.json?t=' + Math.floor(now() / 60000), 3000).then(function (s) { data.scoreboard = s; }).catch(function () {}));
    if (!data.posts) {
      var cached = null; try { cached = JSON.parse(sessionStorage.getItem('gbm-public-feed') || 'null'); } catch (_) {}
      if (cached && cached.data && cached.data.posts) data.posts = cached.data.posts;
      else jobs.push(fetchJson(PAGES + 'gazette-live/posts.json', 3000).then(function (p) { data.posts = p.posts || []; }).catch(function () {}));
    }
    return Promise.all(jobs);
  }
  function safePost(u) { try { var x = new URL(String(u), SITE); return /^(www\.)?gatorbaitmedia\.com$/.test(x.hostname) && x.pathname.indexOf('/post/') === 0 ? SITE + x.pathname : ''; } catch (_) { return ''; } }
  // The story on a Wix blog post page: canonical URL, headline, byline. Falls back to the feed's newest story on the homepage.
  function storyOf() {
    var canon = document.querySelector('link[rel="canonical"]'), url = safePost(canon ? canon.href : location.href);
    var h = document.querySelector('article h1, h1'), by = document.querySelector('[data-hook="user-name"], [rel="author"]');
    var feed = (data.posts || []).filter(function (p) { return safePost(p.url); });
    var match = url && feed.filter(function (p) { return safePost(p.url) === url; })[0];
    if (!url && feed.length) match = feed[0];
    if (match) return { title: match.title, author: match.author || '', url: safePost(match.url), kicker: kickerFor(match) };
    if (!url) return null;
    return { title: (h && h.textContent || document.title).trim(), author: (by && by.textContent || '').trim(), url: url, kicker: 'GatorBait' };
  }
  function kickerFor(p) { var d = Date.parse(p.firstPublishedDate); return Number.isFinite(d) ? 'GatorBait · ' + MONTHS[et(d).mo] + ' ' + et(d).d : 'GatorBait'; }
  function season() {
    var sb = data.scoreboard || {}, games = (sb.schedule || []).filter(function (g) { return g.status === 'final' && g.score; });
    var W = 0, Ls = 0, rows = games.map(function (g) { var w = g.score.fla > g.score.opp; if (w) W++; else Ls++; return { w: w, s: g.score.fla + '-' + g.score.opp, o: (g.opponentRank ? 'No. ' + g.opponentRank + ' ' : '') + (g.home ? '' : 'at ') + g.opponent }; });
    var n = sb.next || null;
    return { rec: sb.team && sb.team.record || W + '-' + Ls, rank: sb.team && sb.team.rank, rows: rows, next: n && { opp: (n.opponentRank ? 'No. ' + n.opponentRank + ' ' : '') + n.opponent, home: n.home, when: gameWhen(n.kickoffIso), tv: n.tv || '', kick: n.kickoffIso, url: safePost(n.previewUrl) }, last: sb.last || null, live: sb.live || null };
  }
  // The Tunnel's three states: countdown before kickoff, live score, final. Same object the homepage uses.
  function tunnel() {
    var s = season(), n = s.next, l = s.last, lv = s.live;
    if (lv && lv.score) return { phase: 'live', a: 'Florida', b: n ? n.opp : 'Opponent', fa: lv.score.fla, fb: lv.score.opp, clock: (lv.period ? 'Q' + lv.period + ' ' : '') + (lv.clock || 'Live'), when: n ? n.when : '', tv: n ? n.tv : '' };
    if (n && left(n.kick)) return { phase: 'pre', a: 'Florida', b: n.opp, home: n.home, cd: left(n.kick), when: n.when, tv: n.tv, url: n.url };
    if (l && l.score) return { phase: 'final', a: 'Florida', b: (l.opponentRank ? 'No. ' + l.opponentRank + ' ' : '') + l.opponent, home: l.home, fa: l.score.fla, fb: l.score.opp, when: gameWhen(l.date), url: safePost(l.recapUrl) };
    return null;
  }

  /* ---------- Share text and tagged URLs ---------- */
  function utm(kind, medium, base) {
    var u = new URL(base || SITE + '/');
    u.searchParams.set('utm_source', 'gatorbait_share'); u.searchParams.set('utm_medium', medium); u.searchParams.set('utm_campaign', kind);
    if (kind === 'season') u.hash = 'gbm-road';
    return u.href;
  }
  function payload(kind, medium) {
    var s = season(), t, st;
    if (kind === 'story') { st = storyOf(); return st ? { text: st.title + ' — ' + (st.author ? st.author + ' on ' : '') + 'GatorBait', url: utm(kind, medium, st.url) } : null; }
    if (kind === 'season') return { text: 'Florida ' + s.rec + (s.rank ? ', No. ' + s.rank : '') + (s.next ? '. Next: ' + (s.next.home ? 'vs. ' : 'at ') + s.next.opp + ', ' + s.next.when + (s.next.tv ? ', ' + s.next.tv : '') : '') + '. The Road Ahead on GatorBait', url: utm(kind, medium) };
    if (kind === 'tunnel') {
      t = tunnel(); if (!t) return null;
      if (t.phase === 'pre') return { text: 'Kickoff in ' + t.cd + ': Florida ' + (t.home ? 'vs. ' : 'at ') + t.b + ', ' + t.when + (t.tv ? ', ' + t.tv : '') + '. The Tunnel on GatorBait', url: utm(kind, medium, t.url || undefined) };
      if (t.phase === 'live') return { text: 'Live: Florida ' + t.fa + ', ' + t.b + ' ' + t.fb + ', ' + t.clock + '. Follow on GatorBait', url: utm(kind, medium) };
      return { text: 'Final: Florida ' + t.fa + ', ' + t.b + ' ' + t.fb + '. The recap on GatorBait', url: utm(kind, medium, t.url || undefined) };
    }
    return { text: SHOW.name + ', next live ' + showNext() + '. Watch on GatorBait', url: utm(kind, medium, SITE + SHOW.path) };
  }

  /* ---------- The card: 1200x630, Swamp Night, drawn on the device ---------- */
  function F(w, px, color) { ctx.font = w + ' ' + px + 'px "Barlow Condensed","Barlow",sans-serif'; ctx.fillStyle = color; }
  function wrap(s, x, y, w, lh, max) {
    var words = String(s).split(' '), line = '', lines = [];
    for (var i = 0; i < words.length; i++) { var t = line + words[i] + ' '; if (ctx.measureText(t).width > w && line) { lines.push(line); line = words[i] + ' '; } else line = t; }
    lines.push(line);
    if (lines.length > max) { lines = lines.slice(0, max); lines[max - 1] = lines[max - 1].replace(/\s+$/, '').replace(/[.,;:]?$/, '…'); }
    lines.forEach(function (l, i) { ctx.fillText(l.replace(/\s+$/, ''), x, y + i * lh); });
    return y + lines.length * lh;
  }
  function frame(footer) {
    ctx.fillStyle = C.navy; ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = C.blue; ctx.beginPath(); ctx.moveTo(860, 0); ctx.lineTo(1200, 0); ctx.lineTo(1200, 630); ctx.lineTo(700, 630); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.orange; ctx.fillRect(0, 0, 18, 630);
    F(800, 34, C.orange); ctx.fillText('GATORBAIT', 70, 80); F(600, 26, C.muted); ctx.fillText('Independent Florida Gators coverage', 290, 80);
    F(600, 28, C.muted); var f = footer; while (ctx.measureText(f).width > 1060 && f.length > 8) f = f.slice(0, -2).replace(/…$/, '') + '…'; ctx.fillText(f, 70, 585);
  }
  function scoreLine(t, y) {
    F(800, 150, C.ink); ctx.fillText(String(t.fa), 70, y); var w = ctx.measureText(String(t.fa)).width;
    F(600, 44, C.muted); ctx.fillText('FLORIDA', 70, y + 50);
    F(800, 150, C.ink); ctx.fillText(String(t.fb), 70 + w + 90, y); F(600, 44, C.muted); ctx.fillText(t.b.toUpperCase(), 70 + w + 90, y + 50);
  }
  function draw(kind) {
    var s = season(), t, st;
    if (kind === 'story') {
      st = storyOf(); if (!st) return false;
      frame(st.url.replace(/^https:\/\/www\./, ''));
      F(600, 32, C.orange); ctx.fillText(st.kicker.toUpperCase(), 70, 180);
      F(800, st.title.length > 70 ? 74 : 88, C.ink); var y = wrap(st.title, 70, 270, 1000, st.title.length > 70 ? 80 : 94, 3);
      F(600, 36, C.muted); if (st.author) ctx.fillText('By ' + st.author, 70, Math.min(y + 8, 540));
      return true;
    }
    if (kind === 'season') {
      frame('gatorbaitmedia.com   ·   Source: ESPN');
      F(800, 190, C.ink); ctx.fillText(s.rec, 70, 300); F(800, 54, C.orange); ctx.fillText((s.rank ? 'NO. ' + s.rank + ' ' : '') + 'FLORIDA', 70, 360);
      F(600, 40, C.ink); s.rows.slice(-5).forEach(function (r, i) { ctx.fillStyle = r.w ? C.win : C.orange; ctx.fillText(r.w ? 'W' : 'L', 560, 185 + i * 56); ctx.fillStyle = C.ink; ctx.fillText(r.s + '  ' + r.o, 620, 185 + i * 56); });
      F(600, 34, C.muted); if (s.next) wrap('Next: ' + (s.next.home ? 'vs. ' : 'at ') + s.next.opp + '  ·  ' + s.next.when + (s.next.tv ? ', ' + s.next.tv : ''), 70, 450, 1060, 40, 2);
      return true;
    }
    if (kind === 'tunnel') {
      t = tunnel(); if (!t) return false;
      frame('gatorbaitmedia.com   ·   Source: ESPN');
      if (t.phase === 'pre') {
        F(800, 190, C.ink); ctx.fillText(s.rec, 70, 300); F(800, 54, C.orange); ctx.fillText((s.rank ? 'NO. ' + s.rank + ' ' : '') + 'FLORIDA', 70, 360);
        F(600, 34, C.muted); ctx.fillText('KICKOFF IN', 620, 190); F(800, 120, C.orange); ctx.fillText(t.cd, 620, 310);
        F(600, 40, C.ink); wrap('Florida ' + (t.home ? 'vs. ' : 'at ') + t.b, 620, 380, 520, 44, 2); F(600, 34, C.muted); ctx.fillText(t.when + (t.tv ? ', ' + t.tv : ''), 70, 450);
      } else {
        F(600, 34, t.phase === 'live' ? C.orange : C.muted); ctx.fillText(t.phase === 'live' ? 'LIVE  ·  ' + t.clock.toUpperCase() : 'FINAL', 70, 180);
        scoreLine(t, 340); F(600, 34, C.muted); ctx.fillText(t.when, 70, 470);
      }
      return true;
    }
    frame('gatorbaitmedia.com' + SHOW.path);
    F(600, 32, C.orange); ctx.fillText('GATORBAIT TV & PODCASTS', 70, 180); F(800, 96, C.ink); wrap(SHOW.name, 70, 290, 1000, 100, 2);
    F(600, 40, C.ink); ctx.fillText('Next live: ' + showNext(), 70, 420); F(600, 34, C.muted); ctx.fillText(SHOW.when, 70, 470);
    return true;
  }
  function ready() { return document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 80px "Barlow Condensed"'), document.fonts.load('600 40px "Barlow Condensed"')]).catch(function () {}) : Promise.resolve(); }
  function canvas() { if (!cv) { cv = el('canvas', { width: 1200, height: 630 }); ctx = cv.getContext('2d'); } return cv; }
  function card(kind) { canvas(); return load().then(ready).then(function () { return draw(kind) ? cv.toDataURL('image/png') : ''; }); }
  function file(cb) { cv.toBlob(function (b) { cb(b ? new File([b], 'gatorbait-' + cur + '.png', { type: 'image/png' }) : null); }, 'image/png'); }

  /* ---------- The sheet: native share first, in-page fallback always available ---------- */
  function track(kind, medium) {
    try { document.dispatchEvent(new CustomEvent('gbm:share', { detail: { kind: kind, medium: medium } })); } catch (_) {}
    try { if (typeof window.gtag === 'function') window.gtag('event', 'share', { method: medium, content_type: kind, item_id: (payload(kind, medium) || {}).url }); } catch (_) {}
  }
  function toast(msg) { var t = document.getElementById('gbm-share-toast') || document.body.appendChild(el('div', { id: 'gbm-share-toast', role: 'status' })); t.textContent = msg; t.style.opacity = '1'; setTimeout(function () { t.style.opacity = '0'; }, 1600); }
  function sheet() {
    var s = document.getElementById('gbm-share'); if (s) return s;
    document.body.appendChild(el('div', { id: 'gbm-share-veil', hidden: '' }));
    s = el('div', { id: 'gbm-share', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Share' }, '<i></i>');
    s.appendChild(canvas()); s.appendChild(el('p', { id: 'gbm-share-text' }));
    s.appendChild(el('div', { 'class': 'g' }, '<button type="button" class="gbm-share-btn" data-act="native">Share…</button><button type="button" class="gbm-share-btn ghost" data-act="copy">Copy link</button><button type="button" class="gbm-share-btn ghost" data-act="x">Post on X</button><button type="button" class="gbm-share-btn ghost" data-act="facebook">Facebook</button><button type="button" class="gbm-share-btn ghost w" data-act="save">Save image</button><button type="button" class="gbm-share-btn ghost w" data-act="close">Close</button>'));
    s.addEventListener('click', function (e) { var b = e.target.closest('[data-act]'); if (b) act(b.getAttribute('data-act')); });
    document.getElementById('gbm-share-veil').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) close(); });
    document.body.appendChild(s); return s;
  }
  function open(kind) {
    cur = kind; var s = sheet();
    return card(kind).then(function (png) {
      var p = payload(kind, 'native'); if (!png || !p) { toast('Nothing to share yet'); return false; }
      document.getElementById('gbm-share-text').textContent = p.text + '\n' + p.url;
      document.getElementById('gbm-share-veil').hidden = false; s.classList.add('on'); opened = true;
      return true;
    });
  }
  function close() { var s = document.getElementById('gbm-share'); if (s) s.classList.remove('on'); var v = document.getElementById('gbm-share-veil'); if (v) v.hidden = true; opened = false; }
  function act(a) {
    var p;
    if (a === 'close') return close();
    if (a === 'copy') { p = payload(cur, 'copy'); track(cur, 'copy'); var txt = p.text + ' ' + p.url; return (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast('Link copied'); }, function () { window.prompt('Copy this link', txt); }); }
    if (a === 'x' || a === 'facebook') {
      p = payload(cur, a); track(cur, a);
      var href = a === 'x' ? 'https://x.com/intent/post?text=' + encodeURIComponent(p.text) + '&url=' + encodeURIComponent(p.url) : 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(p.url);
      return window.open(href, '_blank', 'noopener,width=600,height=560');
    }
    if (a === 'save') { track(cur, 'image'); return file(function (f) { if (!f) return; var link = el('a', { href: URL.createObjectURL(f), download: f.name }); document.body.appendChild(link); link.click(); link.remove(); toast('Image saved'); }); }
    if (a === 'native') {
      if (!navigator.share) return act('copy');
      p = payload(cur, 'native'); track(cur, 'native');
      return file(function (f) {
        var d = { title: 'GatorBait', text: p.text, url: p.url };
        if (f && navigator.canShare && navigator.canShare({ files: [f] })) d.files = [f];
        navigator.share(d).then(close).catch(function () {});
      });
    }
  }

  /* ---------- Mount: one button per surface, only where that surface exists ---------- */
  function button(kind, label, ghost) {
    var b = el('button', { type: 'button', 'class': 'gbm-share-btn' + (ghost ? ' ghost' : ''), 'data-share': kind, 'aria-label': label }, ICON + '<span>' + esc(label) + '</span>');
    b.addEventListener('click', function () { open(kind); }); return b;
  }
  function mount() {
    if (!document.getElementById('gbm-share-css')) document.head.appendChild(el('style', { id: 'gbm-share-css' }, CSS));
    var road = document.querySelector('#gbm-road .hd'), tn = document.querySelector('.fp-tunnel .fp-tn-cta'), show = document.querySelector('.fp-show .fp-actions');
    var narrow = window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
    if (road && !road.querySelector('[data-share]')) road.appendChild(button('season', narrow ? 'Share' : 'Share the season'));
    if (show && !show.querySelector('[data-share]')) show.appendChild(button('show', narrow ? 'Share' : 'Share the show', true));
    if (tn && !tn.querySelector('[data-share]')) tn.appendChild(button('tunnel', 'Share', true));
    // Blog post page: canonical /post/ URL and a headline, no homepage root.
    if (!document.getElementById('gbm-live') && safePost(location.href) && !document.getElementById('gbm-share-btn')) {
      var h = document.querySelector('article h1, [data-hook="post-title"], h1'), host = h && (h.closest('header') || h.parentNode);
      if (host) { var b = button('story', 'Share this story'); b.id = 'gbm-share-btn'; b.style.margin = '12px 0'; host.appendChild(b); }
    }
  }
  window.__GBM_SHARE_RUNTIME__ = { version: VERSION, open: open, card: card, payload: payload, mount: mount };
  document.addEventListener('gbm:gazette-ready', mount);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
  var tries = 0, retry = setInterval(function () { mount(); if (++tries > 8 || document.querySelector('[data-share]')) clearInterval(retry); }, 500);
  // Wix blog pages hydrate late and React re-renders the post header, which drops a button inserted early.
  // On story pages keep watching for the page's life and re-insert when it is gone; on the homepage stop once mounted.
  if ('MutationObserver' in window) {
    var post = !document.getElementById('gbm-live') && !!safePost(location.href), queued = false;
    var mo = new MutationObserver(function () {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; if (document.querySelector('[data-share]')) { if (!post) mo.disconnect(); return; } mount(); });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    if (!post) setTimeout(function () { mo.disconnect(); }, 90000);
  }
})();

/* GatorBait Capture (sports-live/src/capture.js): the "Get GatorBait Magazine free" signup for story pages and the homepage hub. */
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

/* GatorBait Story Kit (sports-live/src/story-kit.js): guide strip, first-mention links and the Keep up with the Gators cards on /post/ pages only. */
/* GatorBait Story Kit 2026: keeps every story pointed back at the things we built here.
 * Drop-in module in the Share GatorBait style (sports-live/src/share.js); appended after it in both
 * sports-live/share.js (blog post pages) and sports-live/homepage.js. It runs ONLY on Wix blog post pages
 * (location.pathname starts with /post/) and does three reversible, DOM-only things:
 *   1. GatorBait Guide strip: one compact row right after the Share button (share.js's [data-share]):
 *      a live "Next: at No. 25 Missouri · Sat., Oct. 3 · 3:30 p.m. ET" chip and, after a final,
 *      "Last: W 52-28 vs. No. 4 Ole Miss" (both from sports-live/scoreboard.json, 3 s timeout, silent on
 *      failure), then Roster, Schedule, Stats, The Road Ahead, The Buddy Martin Show.
 *   2. First-mention links in the article body: the first plain-text "roster", "schedule", "depth chart",
 *      "stats"/"statistics" and the next opponent's name (with its nickname when it follows, e.g. "Missouri
 *      Tigers") become links to the same destinations. Whole words, case-insensitive, at most 5 per story.
 *   3. "Keep up with the Gators": three cards (Roster & Schedule, Florida Stats, The Road Ahead) after the
 *      last body paragraph.
 *   4. The "Get GatorBait Magazine free" signup (window.GBM_CAPTURE, sports-live/src/capture.js) mid-article and
 *      inside the Keep up block; the kit only tells it where the body, its paragraphs and the block are.
 * Wix re-renders the post after hydration and drops early inserts, so a MutationObserver re-mounts what is
 * gone; every step is guarded by [data-story-kit] and never duplicates.
 * What it never does: it writes nothing to Wix, edits no article text (links wrap existing words in place),
 * never touches text inside existing links, headings, captions, bylines or quote attributions, and stays off
 * the homepage (#gbm-live) and every non-/post/ path.
 * Test hooks: window.__GBM_KIT__ {scoreboard, now} pre-seeds data; window.__GBM_KIT_RUNTIME__ exposes
 * {version, mount(), links}. */
(function () {
  'use strict';
  if (String(location.pathname).indexOf('/post/') !== 0) return;
  var VERSION = 'story-kit-2026.1';
  var PAGES = 'https://presidente49.github.io/gatorbait-media-redesign/';
  var SITE = 'https://www.gatorbaitmedia.com';
  var TZ = 'America/New_York';
  var GUIDE = SITE + '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play';
  var LINKS = { roster: GUIDE + '#roster', schedule: GUIDE + '#schedule', stats: SITE + '/florida-football-stats', road: SITE + '/#gbm-road', show: SITE + '/the-buddy-martin-show' };
  var NICK = { Missouri: 'Tigers', Georgia: 'Bulldogs', Texas: 'Longhorns', 'South Carolina': 'Gamecocks', Kentucky: 'Wildcats', Tennessee: 'Volunteers', LSU: 'Tigers', Auburn: 'Tigers', 'Ole Miss': 'Rebels', Vanderbilt: 'Commodores', 'Texas A&M': 'Aggies', Alabama: 'Crimson Tide', Arkansas: 'Razorbacks', 'Mississippi State': 'Bulldogs', Oklahoma: 'Sooners', 'Florida State': 'Seminoles' };
  var MAX_LINKS = 5;
  var CSS = '.gbm-kit{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;contain:inline-size;margin:10px 0 18px;padding:0;text-align:left;direction:ltr;font:15px/1.3 "Barlow","Barlow Condensed",sans-serif;color:#0021a5}' +
    '.gbm-kit-k{display:block;margin:0 0 6px;font:800 12px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fa4616}' +
    '.gbm-kit-row{display:flex;flex-wrap:nowrap;justify-content:flex-start;gap:8px;width:0;min-width:100%;max-width:100%;box-sizing:border-box;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 0 4px;margin:0;list-style:none}.gbm-kit-row::-webkit-scrollbar{display:none}' +
    '.gbm-kit-chip{display:inline-flex;flex:0 0 auto;align-items:center;min-height:44px;padding:0 14px;border:1px solid #0021a5;border-radius:999px;background:#fff;color:#0021a5;font:700 15px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;white-space:nowrap}' +
    '.gbm-kit-chip:hover,.gbm-kit-chip:focus-visible{background:#0021a5;color:#fff;outline:2px solid #fa4616;outline-offset:2px}' +
    '.gbm-kit-chip.lead{background:#fa4616;border-color:#fa4616;color:#fff;text-transform:none;letter-spacing:.02em;font-weight:800}.gbm-kit-chip.lead:hover,.gbm-kit-chip.lead:focus-visible{background:#0021a5;border-color:#0021a5}' +
    '.gbm-kit-chip.last{text-transform:none;letter-spacing:.02em}' +
    '@media(min-width:900px){.gbm-kit-row{flex-wrap:wrap;overflow:visible}}' +
    'a.gbm-kit-link,a.gbm-kit-link:visited{color:#0021a5;text-decoration:underline;text-decoration-color:#fa4616;text-decoration-thickness:2px;text-underline-offset:2px}a.gbm-kit-link:hover{color:#fa4616}' +
    '.gbm-kit-more{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;text-align:left;margin:28px 0 8px;padding:16px 0 0;border-top:3px solid #fa4616;font:15px/1.35 "Barlow","Barlow Condensed",sans-serif;color:#0021a5}' +
    '.gbm-kit-more h3{margin:0 0 12px;font:800 22px/1.1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#0021a5}' +
    '.gbm-kit-cards{display:grid;grid-template-columns:1fr;gap:10px}@media(min-width:700px){.gbm-kit-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}' +
    '.gbm-kit-card{display:flex;flex-direction:column;justify-content:center;gap:4px;box-sizing:border-box;min-height:64px;padding:12px 14px;border:1px solid #0021a5;border-left:6px solid #fa4616;border-radius:8px;background:#fff;color:#0021a5;text-decoration:none}' +
    '.gbm-kit-card b{font:800 18px/1.1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.03em;text-transform:uppercase}.gbm-kit-card span{font:500 14px/1.35 "Barlow",sans-serif;color:#1c2a5c}' +
    '.gbm-kit-card:hover,.gbm-kit-card:focus-visible{background:#0021a5;color:#fff;outline:2px solid #fa4616;outline-offset:2px}.gbm-kit-card:hover span,.gbm-kit-card:focus-visible span{color:#f3f5fa}';
  if (window.__GBM_KIT_RUNTIME__) { window.__GBM_KIT_RUNTIME__.mount(); return; }

  var seed = window.__GBM_KIT__ || {};
  var data = { scoreboard: seed.scoreboard || null }, loading = null;
  function now() { var t = Number(seed.now ? Date.parse(seed.now) : window.__GBM_FP_NOW__); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, attrs, html) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }
  function safePost(u) { try { var x = new URL(String(u), SITE); return /^(www\.)?gatorbaitmedia\.com$/.test(x.hostname) && x.pathname.indexOf('/post/') === 0 ? SITE + x.pathname : ''; } catch (_) { return ''; } }

  /* ---------- Time (America/New_York), AP style: "Sat., Oct. 3 · 3:30 p.m. ET" ---------- */
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var WDS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  function et(ms) {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false }).formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { wd: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], mo: Number(o.month) - 1, d: Number(o.day), h: Number(o.hour) % 24, m: Number(o.minute) };
  }
  function clock(ms) { var e = et(ms), h = e.h % 12 || 12; return h + (e.m ? ':' + String(e.m).padStart(2, '0') : '') + (e.h < 12 ? ' a.m.' : ' p.m.'); }
  function gameWhen(iso) { var t = Date.parse(iso); if (!Number.isFinite(t)) return ''; var e = et(t); return WDS[e.wd] + ', ' + MONTHS[e.mo] + ' ' + e.d + ' · ' + clock(t) + ' ET'; }
  function oppName(g) { return (g.opponentRank ? 'No. ' + g.opponentRank + ' ' : '') + g.opponent; }

  /* ---------- Data: the scoreboard feed the homepage uses, fetched once, silent on failure ---------- */
  function fetchJson(url, ms) {
    var ctl = 'AbortController' in window ? new AbortController() : null, timer = ctl && setTimeout(function () { ctl.abort(); }, ms);
    return fetch(url, { signal: ctl && ctl.signal, credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).finally(function () { if (timer) clearTimeout(timer); });
  }
  function load() {
    if (!loading) loading = data.scoreboard ? Promise.resolve() : fetchJson(PAGES + 'sports-live/scoreboard.json?t=' + Math.floor(now() / 60000), 3000).then(function (s) { data.scoreboard = s; }).catch(function () {});
    return loading;
  }
  // Next game: skipped once its kickoff is more than five hours gone (the feed refreshes it after the final).
  function nextGame() {
    var n = data.scoreboard && data.scoreboard.next, k = n && Date.parse(n.kickoffIso || n.kickoff);
    return n && n.opponent && Number.isFinite(k) && k + 5 * 36e5 > now() ? { name: oppName(n), opponent: String(n.opponent), home: n.home === true, when: gameWhen(n.kickoffIso || n.kickoff), tv: n.tv || '', url: safePost(n.previewUrl) || LINKS.schedule } : null;
  }
  function lastGame() {
    var l = data.scoreboard && data.scoreboard.last, s = l && l.score;
    return s && Number.isFinite(s.fla) && Number.isFinite(s.opp) && (!l.status || l.status === 'final') ? { line: (s.fla > s.opp ? 'W ' : s.fla < s.opp ? 'L ' : 'T ') + s.fla + '-' + s.opp + (l.home === true ? ' vs. ' : ' at ') + oppName(l), url: safePost(l.recapUrl) || LINKS.schedule } : null;
  }

  /* ---------- Where things live on a Wix post page ---------- */
  function shareButton() { return document.querySelector('#gbm-share-btn, [data-share="story"]'); }
  function textOf(n) { return String(n.textContent || '').replace(/\s+/g, ' ').trim(); }
  // The rich-content body: Wix's post-description hook first, then the older class, then the common ancestor of the article's paragraphs.
  function body() {
    if (document.getElementById('gbm-live')) return null;
    var b = document.querySelector('[data-hook="post-description"]') || document.querySelector('.blog-post-page-content, [data-hook="post-content"]');
    if (!b) {
      var ps = [].slice.call(document.querySelectorAll('article p, main p')).filter(function (p) { return textOf(p).length > 40 && !p.closest('[data-story-kit]'); });
      if (ps.length >= 2) { b = ps[0].parentNode; while (b && b !== document.body && !b.contains(ps[ps.length - 1])) b = b.parentNode; }
      if (b === document.body) b = null;
    }
    return b && b.querySelector('p') ? b : null;
  }
  function paragraphs(b) { return [].slice.call(b.querySelectorAll('p')).filter(function (p) { return textOf(p) && !p.closest('[data-story-kit]'); }); }

  /* ---------- 1. GatorBait Guide strip ---------- */
  function chip(cls, href, text, title) { return '<a class="gbm-kit-chip' + (cls ? ' ' + cls : '') + '" href="' + esc(href) + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + esc(text) + '</a>'; }
  function strip() {
    var s = el('nav', { 'class': 'gbm-kit', 'data-story-kit': 'strip', 'aria-label': 'GatorBait Guide' },
      '<span class="gbm-kit-k">GatorBait Guide</span><div class="gbm-kit-row">' + chip('', LINKS.roster, 'Roster') + chip('', LINKS.schedule, 'Schedule') + chip('', LINKS.stats, 'Stats') + chip('', LINKS.road, 'The Road Ahead') + chip('', LINKS.show, 'The Buddy Martin Show') + '</div>');
    return s;
  }
  // The live chips lead the row once the feed lands; nothing else in the row moves (it scrolls sideways on phones).
  function chips(s) {
    if (!data.scoreboard || s.getAttribute('data-kit-live')) return;
    var n = nextGame(), l = lastGame(), html = '';
    if (n) html += chip('lead', n.url, 'Next: ' + (n.home ? 'vs. ' : 'at ') + n.name + ' · ' + n.when, n.tv ? 'Florida ' + (n.home ? 'vs. ' : 'at ') + n.name + ', ' + n.when + ', ' + n.tv : '');
    if (l) html += chip('last', l.url, 'Last: ' + l.line);
    s.setAttribute('data-kit-live', n || l ? 'on' : 'none');
    if (html) s.querySelector('.gbm-kit-row').insertAdjacentHTML('afterbegin', html);
  }
  function mountStrip() {
    var btn = shareButton(), s = document.querySelector('[data-story-kit="strip"]');
    if (!btn) return; // the strip waits for share.js's button, which itself waits for Wix's post header
    if (!s) { s = strip(); btn.insertAdjacentElement('afterend', s); }
    else if (s.previousElementSibling !== btn) btn.insertAdjacentElement('afterend', s); // Wix re-rendered the header around it
    chips(s);
  }

  /* ---------- 2. First-mention links ---------- */
  var SKIP = 'a,h1,h2,h3,h4,h5,h6,figcaption,figure,cite,blockquote footer,button,code,pre,script,style,[data-story-kit],[data-hook*="user"],[data-hook*="byline"],[data-hook*="metadata"],[rel="author"]';
  function terms() {
    var t = [{ id: 'roster', re: 'roster', href: LINKS.roster }, { id: 'schedule', re: 'schedule', href: LINKS.schedule }, { id: 'depth-chart', re: 'depth\\s+chart', href: LINKS.roster }, { id: 'stats', re: 'stat(?:istic)?s', href: LINKS.stats }];
    var n = nextGame(), nick = n && NICK[n.opponent];
    if (n) t.push({ id: 'opponent', re: n.opponent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (nick ? '(?:\\s+' + nick + ')?' : ''), href: n.url });
    return t;
  }
  // Skips: anything already linked, headings, captions, quote attributions (cite/footer or a dash-led line) and bylines
  // (a short block that opens "By Buddy Martin"; "By the time…" is prose and stays eligible).
  function skippable(node, b) {
    var p = node.parentNode; if (!p || p.nodeType !== 1 || p.closest(SKIP)) return true;
    var block = p.closest('p,li,div,blockquote') || p;
    if (block !== b && /^(By\s+[A-Z]|[—–-]\s)/.test(textOf(block)) && textOf(block).length < 160) return true;
    return /^\s*[—–]/.test(node.nodeValue);
  }
  function textNodes(b) {
    var out = [], w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT, null, false), n;
    while ((n = w.nextNode())) if (/\S/.test(n.nodeValue) && !skippable(n, b)) out.push(n);
    return out;
  }
  function linkTerm(b, t) {
    var re = new RegExp('(^|[^A-Za-z0-9])(' + t.re + ')(?![A-Za-z0-9])', 'i'), nodes = textNodes(b);
    for (var i = 0; i < nodes.length; i++) {
      var m = re.exec(nodes[i].nodeValue); if (!m) continue;
      var start = m.index + m[1].length, mid = nodes[i].splitText(start); mid.splitText(m[2].length);
      var a = el('a', { 'class': 'gbm-kit-link', 'data-story-kit': 'link', 'data-term': t.id, href: t.href });
      mid.parentNode.insertBefore(a, mid); a.appendChild(mid);
      return true;
    }
    return false;
  }
  function mountLinks() {
    var b = body(); if (!b) return;
    // One sweep for the static terms; the opponent's name gets its own once the feed has landed ("static" -> "all"). After that
    // the body is left alone until Wix replaces the node, which clears the mark.
    var done = [].slice.call(b.querySelectorAll('a.gbm-kit-link')).map(function (a) { return a.getAttribute('data-term'); }), swept = b.getAttribute('data-story-kit-linked') || '';
    terms().forEach(function (t) {
      if (done.length >= MAX_LINKS || done.indexOf(t.id) >= 0) return;
      if (swept && (t.id !== 'opponent' || swept === 'all')) return;
      if (linkTerm(b, t)) done.push(t.id);
    });
    b.setAttribute('data-story-kit-linked', data.scoreboard ? 'all' : 'static');
  }

  /* ---------- 3. Keep up with the Gators ---------- */
  function card(href, title, blurb) { return '<a class="gbm-kit-card" href="' + esc(href) + '"><b>' + esc(title) + '</b><span>' + esc(blurb) + '</span></a>'; }
  function mountMore() {
    if (document.querySelector('[data-story-kit="more"]')) return;
    var b = body(); if (!b) return;
    var ps = paragraphs(b), last = ps[ps.length - 1]; if (!last) return;
    // Wix wraps each paragraph in its own block; land right after that block so the cards share the text column's gutters.
    if (last.parentNode && last.parentNode !== b && last.parentNode.children.length === 1) last = last.parentNode;
    var m = el('aside', { 'class': 'gbm-kit-more', 'data-story-kit': 'more', 'aria-label': 'Keep up with the Gators' },
      '<h3>Keep up with the Gators</h3><div class="gbm-kit-cards">' + card(LINKS.roster, 'Roster & Schedule', 'The 2026 season guide: who is on the field and who is next.') + card(LINKS.stats, 'Florida Stats', 'The numbers behind every Gators game, updated all season.') + card(LINKS.road, 'The Road Ahead', 'Results so far and the road to Atlanta, on the front page.') + '</div>');
    last.insertAdjacentElement('afterend', m);
  }

  /* ---------- Mount: idempotent, re-run by the observer whenever Wix re-renders ---------- */
  function mount() {
    if (document.getElementById('gbm-live')) return;
    if (!document.getElementById('gbm-story-kit-css')) document.head.appendChild(el('style', { id: 'gbm-story-kit-css' }, CSS));
    mountStrip(); mountLinks(); mountMore(); mountCapture();
  }
  // 4. GatorBait Magazine signup (sports-live/src/capture.js): a card after the 4th prose paragraph and one inside
  // "Keep up with the Gators". The capture module owns the markup, the submit and its own no-duplicate guards.
  function mountCapture() {
    var b = body(); if (!b || !window.GBM_CAPTURE) return;
    try { window.GBM_CAPTURE.mountStory({ body: b, paras: paragraphs(b), more: document.querySelector('[data-story-kit="more"]') }); } catch (_) {}
  }
  window.__GBM_KIT_RUNTIME__ = { version: VERSION, mount: mount, links: LINKS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
  load().then(mount);
  var tries = 0, retry = setInterval(function () { mount(); if (++tries > 16 || (document.querySelector('[data-story-kit="strip"]') && document.querySelector('[data-story-kit="more"]'))) clearInterval(retry); }, 500);
  if ('MutationObserver' in window) {
    var queued = false, mo = new MutationObserver(function () {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; mount(); });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
