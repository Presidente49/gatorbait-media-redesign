/* GatorBait Buddy Martin Show page. Data: sports-live/buddy-videos.json (YouTube channel feed snapshot). */
(function () {
  'use strict';
  var BUILD = '98d35998', FEED = 'https://presidente49.github.io/gatorbait-media-redesign/sports-live/buddy-videos.json';
  var SNAP = /*SHOW*/{"channelId":"UCtR8b1sKFuwaRjKy5BiXRvA","fetchedAt":"2026-10-31T15:33:31.505Z","videos":[{"id":"wwyroepoBXA","title":"Florida vs Georgia: Who Gets the Ball in Atlanta?","published":"2026-10-31T02:10:04+00:00"},{"id":"XKMbfJYa1sQ","title":"Florida-Georgia: The Name Game | The Buddy Martin Show","published":"2026-10-30T14:42:49+00:00"},{"id":"EwF0KOj-fEI","title":"Florida-Georgia: The Name Game | The Buddy Martin Show","published":"2026-10-30T01:00:55+00:00"},{"id":"FJ1pMdYJNCw","title":"Who's Going To Take The Gators' Snaps?","published":"2026-10-29T17:52:10+00:00"},{"id":"q1Wz7NaEL94","title":"Florida-Georgia: What's With the QQQ Name?","published":"2026-10-28T15:51:27+00:00"},{"id":"Uc-hO2his0I","title":"Florida Gators: Sumrall Won't Name a QB for Georgia","published":"2026-10-27T16:59:28+00:00"},{"id":"IjZ_oYcuwD0","title":"SEC Cannibalism: Will the League Eat Its Own Playoff Spots?","published":"2026-10-23T14:22:43+00:00"},{"id":"H8garNWcJFg","title":"SEC chaos won't kill playoff hopes.","published":"2026-10-23T13:10:37+00:00"},{"id":"1oLtTmLK8Co","title":"The most unlikely path to Florida","published":"2026-10-23T13:07:44+00:00"},{"id":"cht2LCGsJhI","title":"16 teams better than 24 playoffs.","published":"2026-10-23T13:04:28+00:00"},{"id":"Zr99Dbncqwo","title":"Florida can beat Georgia.","published":"2026-10-23T13:01:15+00:00"},{"id":"Gn1citXWzEc","title":"Chris Doering learns he was an SEC legend.","published":"2026-10-23T12:54:48+00:00"}]}/*SHOW-END*/;
  var CH = 'https://www.youtube.com/@TheBuddyMartinShow';
  var LINKS = { live: CH + '/live', sub: CH + '?sub_confirmation=1', channel: CH,
    lowdown: 'https://www.youtube.com/playlist?list=PLIekxRlp1omM', podcast: 'https://www.youtube.com/playlist?list=PL1twZqsaZwxneDPF2RojFUTMXgr-OK41I',
    shorts: 'https://www.youtube.com/playlist?list=PL1twZqsaZwxnM5F4xVYTJlia_-IIIHgKa', apple: 'https://podcasts.apple.com/us/podcast/id1321645302' };
  var ROUTE = /^\/the-buddy-martin-show\/?$/;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onRoute() { return ROUTE.test(location.pathname || ''); }
  function etParts(d) {
    var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(d), o = {};
    p.forEach(function (x) { o[x.type] = x.value; });
    return { wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  function status() {
    var t = etParts(new Date()), show = t.wd >= 1 && t.wd <= 4;
    if (show && t.min >= 21 * 60 && t.min < 22 * 60) return ['on', 'On air now', 'Tonight\u2019s show is live on YouTube.'];
    if (show && t.min >= 20 * 60 + 30 && t.min < 21 * 60) return ['soon', 'Going live soon', 'Tonight\u2019s show starts at 9 p.m. ET.'];
    if (show && t.min < 21 * 60) return ['soon', 'Live tonight', 'Tonight\u2019s show starts at 9 p.m. ET.'];
    var next = t.wd === 4 ? 'Monday' : (t.wd === 5 || t.wd === 6 || t.wd === 0) ? 'Monday' : 'tomorrow';
    return ['off', 'Next show ' + next, 'Live Monday through Thursday at 9 p.m. ET.'];
  }
  function fmtDate(iso) { var d = new Date(iso); if (isNaN(d)) return ''; return new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric' }).format(d).replace('Sept', 'Sept.').replace(/^(Jan|Feb|Aug|Oct|Nov|Dec) /, '$1. '); }
  var CSS = '' +
    'html:has(#gbm-showpage) #gbm-media-hub{display:none!important}' +
    '#gbm-showpage{--navy:#10264b;--or:#fa4616;--or-ink:#b93a0e;--line:#e3e7ee;--soft:#f6f7fa;--mute:#4b5a73;position:relative;z-index:3;background:#fff;color:var(--navy);font:400 16px/1.5 Barlow,Arial,sans-serif}' +
    '#gbm-showpage *{box-sizing:border-box}#gbm-showpage a{color:var(--navy)}#gbm-showpage a:focus-visible{outline:3px solid var(--or);outline-offset:2px}' +
    '#gbm-showpage .s-wrap{max-width:1240px;margin:0 auto;padding:0 20px}' +
    '#gbm-showpage .s-hero{background:var(--navy);color:#fff;border-top:6px solid var(--or);padding:34px 0 30px}' +
    '#gbm-showpage .s-hero .s-wrap{display:grid;grid-template-columns:1.25fr 1fr;gap:28px;align-items:center}' +
    '#gbm-showpage .s-kick{font:700 13px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#ffb08f}' +
    '#gbm-showpage h1{margin:6px 0 10px;font:800 clamp(42px,8vw,76px)/.92 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:#fff}' +
    '#gbm-showpage .s-lede{margin:0 0 20px;font:500 18px/1.5 Barlow,sans-serif;color:#dce4f2;max-width:34em}' +
    '#gbm-showpage .s-btns{display:flex;flex-wrap:wrap;gap:10px}' +
    '#gbm-showpage .s-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;font:800 17px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;border:2px solid var(--or)}' +
    '#gbm-showpage a.s-btn.pri{background:var(--or);color:#10264b}#gbm-showpage a.s-btn.sec{background:transparent;color:#fff;border-color:#fff}' +
    '#gbm-showpage .s-card{background:#fff;color:var(--navy);padding:20px 22px;border-top:5px solid var(--or)}' +
    '#gbm-showpage .s-stat{display:inline-flex;align-items:center;gap:8px;font:800 14px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--or-ink)}#gbm-showpage .s-stat i{width:10px;height:10px;border-radius:50%;background:#9aa5b8}#gbm-showpage .s-stat.on i,#gbm-showpage .s-stat.soon i{background:var(--or);box-shadow:0 0 0 5px #fa461630}' +
    '#gbm-showpage .s-card h2{margin:6px 0 4px;font:800 30px/1.05 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}#gbm-showpage .s-card p{margin:0 0 6px;color:var(--mute)}' +
    '#gbm-showpage .s-sched{margin:12px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}#gbm-showpage .s-sched li{padding:4px 10px;border:1px solid var(--line);font:700 14px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase}#gbm-showpage .s-sched li.on{background:var(--navy);color:#fff;border-color:var(--navy)}' +
    '#gbm-showpage section.s-sec{padding:34px 0 6px}#gbm-showpage h2.s-h{margin:0 0 14px;font:800 clamp(28px,4vw,38px)/1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;border-left:6px solid var(--or);padding-left:12px}' +
    '#gbm-showpage .s-feat{display:grid;grid-template-columns:1.4fr 1fr;gap:20px;align-items:center;margin-bottom:22px}' +
    '#gbm-showpage .s-th{position:relative;display:block;aspect-ratio:16/9;background:#0b1a33;overflow:hidden}#gbm-showpage .s-th img{width:100%;height:100%;object-fit:cover;display:block}' +
    '#gbm-showpage .s-th:after{content:"";position:absolute;left:50%;top:50%;width:62px;height:62px;margin:-31px 0 0 -31px;border-radius:50%;background:var(--or) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%2310264b\' d=\'M9 6.5v11l9-5.5z\'/%3E%3C/svg%3E") center/32px no-repeat}' +
    '#gbm-showpage .s-feat h3{margin:4px 0 8px;font:800 clamp(26px,3.4vw,38px)/1.05 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}#gbm-showpage .s-feat h3 a,#gbm-showpage .s-vid h3 a{text-decoration:none}' +
    '#gbm-showpage .s-date{font:600 14px Barlow,sans-serif;color:var(--mute)}' +
    '#gbm-showpage .s-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;margin:0;padding:0;list-style:none}' +
    '#gbm-showpage .s-vid h3{margin:8px 0 2px;font:700 18px/1.2 Barlow,sans-serif}' +
    '#gbm-showpage .s-pl{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}' +
    '#gbm-showpage .s-pc{display:block;text-decoration:none;border:1px solid var(--line);border-top:5px solid var(--or);padding:16px 18px;background:#fff}#gbm-showpage .s-pc b{display:block;font:800 24px/1.1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}#gbm-showpage .s-pc span{display:block;margin-top:4px;color:var(--mute);font-size:15px}#gbm-showpage .s-pc:hover{background:var(--soft)}' +
    '#gbm-showpage .s-about{margin:34px 0 0;padding:26px 0 40px;border-top:1px solid var(--line);color:var(--mute);font-size:16px;max-width:60em}#gbm-showpage .s-about b{color:var(--navy)}' +
    '@media(max-width:860px){#gbm-showpage .s-hero .s-wrap,#gbm-showpage .s-feat{grid-template-columns:1fr}#gbm-showpage .s-wrap{padding:0 16px}#gbm-showpage .s-hero{padding:26px 0 24px}#gbm-showpage .s-btn{flex:1 1 100%}}';
  function styles() { if (document.getElementById('gbm-showpage-css')) return; var s = document.createElement('style'); s.id = 'gbm-showpage-css'; s.textContent = CSS; document.head.appendChild(s); }
  function fonts() { if (document.getElementById('gbm-showpage-font')) return; var l = document.createElement('link'); l.id = 'gbm-showpage-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap'; document.head.appendChild(l); }
  function thumb(id, alt, w, h) { return '<a class="s-th" href="https://www.youtube.com/watch?v=' + esc(id) + '" aria-label="Watch: ' + esc(alt) + '"><img loading="lazy" decoding="async" width="' + w + '" height="' + h + '" src="https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg" alt=""></a>'; }
  function render(D) {
    var st = status(), vids = (D.videos || []).filter(function (v) { return /^[\w-]{6,20}$/.test(v.id || ''); }), f = vids[0], rest = vids.slice(1, 9), t = etParts(new Date());
    var days = ['Mon', 'Tue', 'Wed', 'Thu'].map(function (d, i) { return '<li' + (t.wd === i + 1 ? ' class="on"' : '') + '>' + d + ' 9 p.m. ET</li>'; }).join('');
    var h = '<section class="s-hero"><div class="s-wrap"><div><div class="s-kick">Independent Florida Gators talk</div><h1>The Buddy Martin Show</h1>' +
      '<p class="s-lede">Veteran sportswriter Buddy Martin takes on the Gators live, Monday through Thursday nights. Watch on YouTube, then catch the replay or the podcast.</p>' +
      '<div class="s-btns"><a class="s-btn pri" href="' + LINKS.live + '">Watch live on YouTube</a><a class="s-btn sec" href="' + LINKS.sub + '">Subscribe free</a></div></div>' +
      '<div class="s-card"><span class="s-stat ' + st[0] + '"><i></i>' + esc(st[1]) + '</span><h2>9 p.m. ET, Monday through Thursday</h2><p>' + esc(st[2]) + '</p><ul class="s-sched">' + days + '</ul></div></div></section>';
    h += '<div class="s-wrap">';
    if (f) h += '<section class="s-sec"><h2 class="s-h">Latest episode</h2><div class="s-feat">' + thumb(f.id, f.title, 640, 360) + '<div><div class="s-date">' + esc(fmtDate(f.published)) + '</div><h3><a href="https://www.youtube.com/watch?v=' + esc(f.id) + '">' + esc(f.title) + '</a></h3><a class="s-btn pri" href="https://www.youtube.com/watch?v=' + esc(f.id) + '">Watch now</a></div></div></section>';
    if (rest.length) h += '<section class="s-sec"><h2 class="s-h">More recent shows</h2><ul class="s-grid">' + rest.map(function (v) { return '<li class="s-vid">' + thumb(v.id, v.title, 320, 180) + '<h3><a href="https://www.youtube.com/watch?v=' + esc(v.id) + '">' + esc(v.title) + '</a></h3><div class="s-date">' + esc(fmtDate(v.published)) + '</div></li>'; }).join('') + '</ul></section>';
    h += '<section class="s-sec"><h2 class="s-h">Watch and listen</h2><div class="s-pl">' +
      '<a class="s-pc" href="' + LINKS.lowdown + '"><b>The Lowdown</b><span>Playlist on YouTube</span></a>' +
      '<a class="s-pc" href="' + LINKS.podcast + '"><b>Podcast episodes</b><span>Full shows, playlist on YouTube</span></a>' +
      '<a class="s-pc" href="' + LINKS.shorts + '"><b>Shorts</b><span>Quick clips, playlist on YouTube</span></a>' +
      '<a class="s-pc" href="' + LINKS.apple + '"><b>Apple Podcasts</b><span>Listen on your phone</span></a></div></section>';
    h += '<div class="s-about"><b>About the show.</b> The Buddy Martin Show is GatorBait Media\u2019s live Florida Gators program, hosted by longtime sports journalist Buddy Martin. New episodes post to <a href="' + LINKS.channel + '">YouTube</a>.</div></div>';
    return h;
  }
  function valid(D) { return D && Array.isArray(D.videos) && D.videos.length > 0; }
  function mount(D) {
    var old = document.getElementById('gbm-showpage'); if (old) old.remove();
    styles(); fonts();
    var m = document.createElement('main'); m.id = 'gbm-showpage'; m.setAttribute('data-build', BUILD); m.setAttribute('aria-label', 'The Buddy Martin Show');
    m.innerHTML = render(D);
    var anchor = document.getElementById('gbm-mobile-shell-host') || document.getElementById('gbm-site-header');
    if (anchor && anchor.parentNode === document.body) document.body.insertBefore(m, anchor.nextSibling); else document.body.insertBefore(m, document.body.firstChild);
    document.title = 'The Buddy Martin Show: Live Florida Gators Talk | GatorBait Media';
    window.__GBM_SHOW__.ready = true;
  }
  var data = null;
  function load() {
    if (!onRoute() || document.getElementById('gbm-showpage')) return;
    if (valid(SNAP)) { data = SNAP; mount(SNAP); }
    fetch(FEED + '?cb=' + Math.floor(Date.now() / 600000), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (D) {
      if (!valid(D) || !onRoute()) return; if (data && data.fetchedAt === D.fetchedAt && document.getElementById('gbm-showpage')) return; data = D; mount(D);
    }).catch(function () { if (!document.getElementById('gbm-showpage')) { styles(); var m = document.createElement('main'); m.id = 'gbm-showpage'; m.innerHTML = '<div class="s-wrap"><p style="padding:30px 0">Watch The Buddy Martin Show on <a href="' + CH + '">YouTube</a>.</p></div>'; document.body.insertBefore(m, document.body.firstChild); } });
  }
  function sync() { if (onRoute()) { load(); return; } var r = document.getElementById('gbm-showpage'); if (r) r.remove(); window.__GBM_SHOW__.ready = false; }
  window.__GBM_SHOW__ = { sync: sync, ready: false, build: BUILD };
  window.addEventListener('popstate', sync); window.addEventListener('gbmroutechange', sync);
  load(); [600, 1800, 4000].forEach(function (ms) { setTimeout(function () { if (onRoute() && !document.getElementById('gbm-showpage')) load(); }, ms); });
})();
