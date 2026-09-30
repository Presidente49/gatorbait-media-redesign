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
})();
