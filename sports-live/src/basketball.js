/* GatorBait Gator Basketball hub. Mounts above the News Wire on /gatorbait-media-blogs/categories/gator-basketball.
   Data: ESPN public JSON only. A build-time snapshot renders first; ESPN is re-read live on every load. Stories come from the page's own native list and /blog-feed.xml. */
(function () {
  'use strict';
  var BUILD = '__BUILD__';
  var SNAP = /*BB*/null/*BB-END*/;
  var ROUTE = /^\/gatorbait-media-blogs\/categories\/gator-basketball\/?$/;
  var ESPN = ['https://site.web.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball', 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball'];
  var ESPN_STAND = ['https://site.web.api.espn.com/apis/v2/sports/basketball/mens-college-basketball/standings?group=23', 'https://site.api.espn.com/apis/v2/sports/basketball/mens-college-basketball/standings?group=23'];
  var HEADER = 'https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=basketball&league=mens-college-basketball';
  var LOGO = 'https://a.espncdn.com/i/teamlogos/ncaa/500/';

  /*NORM*/
  function normalize(raw, prev) {
    var out = { source: 'ESPN', fetchedAt: new Date().toISOString() }, st, secIds = {}, sec = [];
    if (raw.stand && raw.stand.standings) {
      sec = raw.stand.standings.entries.map(function (e) {
        st = {}; e.stats.forEach(function (s) { st[s.name] = s; });
        secIds[e.team.id] = 1;
        return { id: e.team.id, name: e.team.shortDisplayName || e.team.location, abbr: e.team.abbreviation, overall: (st.overall || {}).displayValue || '0-0', conf: (st['vs. Conf.'] || {}).displayValue || '0-0', apRank: e.team.rank || null, logo: LOGO + e.team.id + '.png' };
      }).sort(function (a, b) { return (a.apRank || 99) - (b.apRank || 99) || a.name.localeCompare(b.name); });
    } else if (prev) { sec = prev.sec; sec.forEach(function (s) { secIds[s.id] = 1; }); }
    out.sec = sec;
    out.team = { id: '57', name: 'Florida Gators', coach: (prev && prev.team && prev.team.coach) || 'Todd Golden', record: '0-0' };
    if (raw.roster) { out.team.coach = raw.roster.coach && raw.roster.coach[0] ? raw.roster.coach[0].firstName + ' ' + raw.roster.coach[0].lastName : out.team.coach; }
    out.games = (raw.sched ? raw.sched.events : []).map(function (e) {
      var c = e.competitions[0], fl, op, t = c.status.type, sc = function (x) { return x.score && (x.score.displayValue != null ? x.score.displayValue : x.score) || null; };
      c.competitors.forEach(function (x) { if (x.team.id === '57') fl = x; else op = x; });
      var r = op.curatedRank && op.curatedRank.current && op.curatedRank.current < 99 ? op.curatedRank.current : null;
      return { id: e.id, date: e.date, tbd: c.timeValid === false, opp: { id: op.team.id, name: op.team.shortDisplayName || op.team.location, full: op.team.displayName, abbr: op.team.abbreviation, rank: r, logo: LOGO + op.team.id + '.png' },
        where: c.neutralSite ? 'neutral' : fl.homeAway, venue: c.venue ? c.venue.fullName : '', city: c.venue && c.venue.address ? [c.venue.address.city, c.venue.address.state].filter(Boolean).join(', ') : '',
        tv: (c.broadcasts || []).map(function (b) { return b.media && b.media.shortName; }).filter(Boolean), note: ((c.notes || [])[0] || {}).headline || '',
        sec: !!secIds[op.team.id], state: t.state, score: t.state === 'post' ? { fl: sc(fl), opp: sc(op), win: !!fl.winner } : null };
    });
    var pick = function (name) {
      var p = (raw.rank ? raw.rank.rankings : []).filter(function (x) { return x.name === name; })[0];
      if (!p) return null;
      return { name: p.name, headline: p.headline, date: p.date, updated: p.lastUpdated, ranks: p.ranks.map(function (x) {
        return { rank: x.current, prev: x.previous, id: x.team.id, name: x.team.nickname || x.team.location, record: x.recordSummary, points: x.points, fpv: x.firstPlaceVotes || 0, sec: !!secIds[x.team.id], logo: LOGO + x.team.id + '.png' };
      }), others: (p.others || []).map(function (o) { return { name: o.team.location, sec: !!secIds[o.team.id] }; }) };
    };
    out.ap = pick('AP Top 25'); out.coaches = pick('Coaches Poll');
    out.roster = raw.roster ? raw.roster.athletes.map(function (a) {
      return { id: a.id, name: a.fullName, jersey: a.jersey || '', pos: a.position ? a.position.abbreviation : '', ht: a.displayHeight || '', wt: (a.displayWeight || '').replace(' lbs', ''), cls: a.experience ? a.experience.displayValue : '', from: a.birthPlace ? a.birthPlace.displayText : '', img: a.headshot ? a.headshot.href : '',
        url: ((a.links || []).filter(function (l) { return (l.rel || []).indexOf('playercard') > -1; })[0] || {}).href || '' };
    }).sort(function (a, b) { return (+a.jersey || 99) - (+b.jersey || 99); }) : (prev ? prev.roster : []);
    if (prev) { if (!out.ap) out.ap = prev.ap; if (!out.coaches) out.coaches = prev.coaches; if (!out.games.length) out.games = prev.games; }
    return out;
  }
  /*NORM-END*/

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onRoute() { return ROUTE.test(location.pathname || ''); }
  var MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'], WD = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'], WDL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ETF = null;
  function et(ts) {
    try {
      ETF = ETF || new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short' });
      var p = {}; ETF.formatToParts(new Date(ts)).forEach(function (x) { p[x.type] = x.value; });
      return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour % 24, n: +p.minute, w: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday] };
    } catch (e) { var d = new Date(ts); return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), h: d.getHours(), n: d.getMinutes(), w: d.getDay() }; }
  }
  function apTime(p) { if (p.h === 12 && p.n === 0) return 'noon'; var h = p.h % 12 || 12; return h + (p.n ? ':' + (p.n < 10 ? '0' : '') + p.n : '') + ' ' + (p.h < 12 ? 'a.m.' : 'p.m.'); }
  function dayLabel(ts) { var p = et(ts); return WD[p.w] + ' ' + MON[p.m] + ' ' + p.d; }
  function dayLong(ts) { var p = et(ts); return WDL[p.w] + ', ' + MON[p.m] + ' ' + p.d; }
  function timeLabel(g) { return g.tbd ? 'Time TBA' : apTime(et(g.date)) + ' ET'; }
  function iso(ts) { return new Date(ts).toISOString(); }
  function rankName(name, rank) { return (rank ? '<b class="b-rk">No. ' + rank + '</b> ' : '') + esc(name); }
  function site(g) { return g.where === 'home' ? 'vs.' : g.where === 'away' ? 'at' : 'vs.'; }
  function siteWord(g) { return g.where === 'home' ? 'Home' : g.where === 'away' ? 'Away' : 'Neutral'; }
  function tvOf(g) { return g.tv && g.tv.length ? g.tv.join(', ') : 'TV TBA'; }

  var CSS = '' +
    '#gbm-bb{--navy:#10264b;--or:#fa4616;--or-ink:#b93a0e;--line:#e3e7ee;--soft:#f6f7fa;--mute:#4b5a73;position:relative;z-index:3;display:block;width:var(--bb-vw,100vw);max-width:100vw;margin:0 0 8px calc(50% - var(--bb-vw,100vw)/2);background:#fff;color:var(--navy);font:400 16px/1.5 Barlow,Arial,sans-serif;text-align:left;text-transform:none;letter-spacing:0}' +
    '#gbm-bb *{box-sizing:border-box}#gbm-bb a{color:var(--navy)}#gbm-bb a:focus-visible,#gbm-bb button:focus-visible{outline:3px solid var(--or);outline-offset:2px}' +
    '#gbm-bb .b-wrap{max-width:1240px;margin:0 auto;padding:0 20px}#gbm-bb .vh{position:absolute;left:-9999px}' +
    '#gbm-bb .b-top{background:#f3f5f9;color:var(--navy);border-top:6px solid var(--or);padding:30px 0 26px}' +
    '#gbm-bb .b-top .b-wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:28px;align-items:stretch}' +
    '#gbm-bb .b-kick{font:700 13px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--or-ink)}' +
    '#gbm-bb .b-name{margin:6px 0 10px;font:800 clamp(40px,7.4vw,72px)/.92 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:var(--navy)}' +
    '#gbm-bb .b-badges{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px;padding:0;list-style:none}' +
    '#gbm-bb .b-badges li{flex:0 0 auto;width:auto;padding:5px 12px;border:1px solid var(--navy);font:800 17px/1.2 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase}#gbm-bb .b-badges li.hot{background:var(--or);border-color:var(--or);color:#10264b}' +
    '#gbm-bb .b-lede{margin:0 0 18px;font:500 18px/1.5 Barlow,sans-serif;color:#33425e;max-width:36em}' +
    '#gbm-bb .b-nav{display:flex;flex-wrap:wrap;gap:8px}' +
    '#gbm-bb .b-nav a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;font:800 16px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;color:var(--navy);background:#fff;border:2px solid var(--navy)}#gbm-bb .b-nav a:hover{background:#fff4ef;border-color:var(--or)}' +
    '#gbm-bb .b-card{background:#fff;color:var(--navy);padding:18px 22px 20px;border:1px solid var(--line);border-top:5px solid var(--or);display:flex;flex-direction:column;justify-content:center}' +
    '#gbm-bb .b-pill{display:inline-flex;align-items:center;gap:8px;font:800 14px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--or-ink)}#gbm-bb .b-pill i{width:10px;height:10px;border-radius:50%;background:#9aa5b8}#gbm-bb .b-pill.live i{background:var(--or);box-shadow:0 0 0 5px #fa461630}' +
    '#gbm-bb .b-vs{margin:6px 0 2px;font:800 clamp(26px,3.4vw,36px)/1.05 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}' +
    '#gbm-bb .b-score{display:grid;grid-template-columns:1fr auto;gap:4px 16px;margin:8px 0 4px;font:800 clamp(26px,4vw,36px)/1.1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}#gbm-bb .b-score span:nth-child(even){text-align:right}' +
    '#gbm-bb .b-meta{margin:2px 0 0;color:var(--mute);font-size:16px}#gbm-bb .b-meta b{color:var(--navy)}' +
    '#gbm-bb .b-then{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--line);font-size:15px;color:var(--mute)}' +
    '#gbm-bb .b-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin-top:12px;padding:0 20px;background:var(--or);color:#10264b!important;font:800 16px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;align-self:flex-start}' +
    '#gbm-bb section.b-sec{padding:32px 0 4px;scroll-margin-top:90px}#gbm-bb h2.b-h{margin:0 0 6px;font:800 clamp(28px,4vw,38px)/1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;border-left:6px solid var(--or);padding-left:12px}' +
    '#gbm-bb .b-sub{margin:0 0 14px;color:var(--mute);font-size:15px}' +
    '#gbm-bb table{width:100%;border-collapse:collapse;font-size:16px}#gbm-bb caption{position:absolute;left:-9999px}' +
    '#gbm-bb th{text-align:left;padding:8px 10px;font:800 13px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);border-bottom:2px solid var(--navy);white-space:nowrap}' +
    '#gbm-bb td{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:middle}#gbm-bb .sch td.d{width:118px;white-space:nowrap}#gbm-bb .sch td.t{width:112px;white-space:nowrap}#gbm-bb .sch td.v{width:150px}' +
    '#gbm-bb tr.nx td{background:#fff4ef}#gbm-bb tr.rk td:first-child{box-shadow:inset 4px 0 0 var(--or)}#gbm-bb tr.pt{color:#4b5a73}' +
    '#gbm-bb .b-rk{color:var(--or-ink);font-weight:800}' +
    '#gbm-bb .g-o{display:flex;align-items:center;gap:10px;font-weight:700}#gbm-bb .g-o img{width:26px;height:26px;object-fit:contain;flex:none}#gbm-bb .g-o small{display:block;font-weight:400;color:var(--mute);font-size:14px}' +
    '#gbm-bb .chip{display:inline-block;margin-left:6px;padding:0 6px;border:1px solid var(--navy);font:800 12px/18px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;vertical-align:2px}' +
    '#gbm-bb .res.w{color:#116a3a;font-weight:800}#gbm-bb .res.l{color:#9b1c1c;font-weight:800}' +
    '#gbm-bb table.ros{table-layout:fixed}#gbm-bb .ros th.ph,#gbm-bb .ros td.ph{width:72px}#gbm-bb .ros th.no{width:52px}#gbm-bb .ros th.ps{width:68px}#gbm-bb .ros th.cl{width:64px}#gbm-bb .ros th.ht{width:68px}#gbm-bb .ros th.wt{width:56px}#gbm-bb .ros th.hm{width:24%}#gbm-bb .ros th.pv{width:20%}#gbm-bb .ros td.ht,#gbm-bb .ros td.ps,#gbm-bb .ros td.cl,#gbm-bb .ros td.wt{white-space:nowrap}' +
    '#gbm-bb .ros td.ph{padding:6px 10px}#gbm-bb .ros td.ph img,#gbm-bb .ros .p-ni{display:block;width:56px;height:56px;max-width:none;background:#eef1f6;object-fit:cover;object-position:top center}#gbm-bb .ros td.no{font:800 22px "Barlow Condensed",Barlow,sans-serif}#gbm-bb .ros td.nm{font-weight:700}#gbm-bb .ros td.nm small.m{display:none}#gbm-bb .ros td.hm small{display:block;color:var(--mute);font-size:14px}#gbm-bb .ros td.pv{color:var(--mute)}#gbm-bb .b-anc{display:block;height:0;scroll-margin-top:92px}' +
    '#gbm-bb .b-tabs{display:flex;gap:8px;margin:0 0 12px}#gbm-bb .b-tabs button{min-height:44px;padding:0 18px;background:#fff;color:var(--navy);border:2px solid var(--navy);font:800 16px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}#gbm-bb .b-tabs button[aria-pressed=true]{background:var(--or);border-color:var(--or);color:#10264b}' +
    '#gbm-bb ol.poll{margin:0;padding:0;list-style:none;column-count:2;column-gap:28px}#gbm-bb ol.poll li{break-inside:avoid;display:grid;grid-template-columns:32px 26px 1fr auto;gap:10px;align-items:center;padding:7px 4px;border-bottom:1px solid var(--line)}' +
    '#gbm-bb ol.poll li.fl{background:#fff4ef;box-shadow:inset 4px 0 0 var(--or)}#gbm-bb ol.poll .n{font:800 22px "Barlow Condensed",Barlow,sans-serif;text-align:right}#gbm-bb ol.poll img{width:26px;height:26px;object-fit:contain}#gbm-bb ol.poll .r{color:var(--mute);font-size:14px;text-align:right}' +
    '#gbm-bb .b-two{display:grid;grid-template-columns:1.6fr 1fr;gap:34px;align-items:start}' +
    '#gbm-bb .b-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;margin:0;padding:0;list-style:none}' +
    '#gbm-bb .b-st .im{display:block;aspect-ratio:16/9;background:#e3e7ee;overflow:hidden}#gbm-bb .b-st .im img{width:100%;height:100%;object-fit:cover;display:block}' +
    '#gbm-bb .b-st h3{margin:8px 0 2px;font:800 21px/1.12 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}#gbm-bb .b-st h3 a{text-decoration:none}#gbm-bb .b-st .m{font:600 13px Barlow,sans-serif;color:var(--mute);letter-spacing:.04em;text-transform:uppercase}' +
    '#gbm-bb .b-seo{margin:34px 0 0;padding:26px 0 36px;border-top:1px solid var(--line);color:var(--mute);max-width:62em}#gbm-bb .b-seo h2{margin:0 0 8px;font:800 26px/1.1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:var(--navy)}#gbm-bb .b-seo h3{margin:16px 0 4px;font:800 19px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--navy)}#gbm-bb .b-seo p{margin:0 0 8px}' +
    '#gbm-bb .b-src{margin:10px 0 0;font-size:13px;color:var(--mute)}' +
    '@media(max-width:860px){#gbm-bb .b-top .b-wrap,#gbm-bb .b-two{grid-template-columns:1fr}#gbm-bb .b-wrap{padding:0 16px}#gbm-bb .b-top{padding:24px 0 22px}#gbm-bb ol.poll{column-count:1}#gbm-bb .b-nav a{flex:1 1 40%;justify-content:center}}' +
    '@media(max-width:700px){#gbm-bb .sch,#gbm-bb .sch tbody{display:block;width:100%}#gbm-bb .sch thead{display:none}#gbm-bb .sch tr{display:grid;grid-template-columns:78px 1fr auto;grid-template-areas:"d o t" "d o v";gap:0 10px;padding:8px 0;border-bottom:1px solid var(--line)}#gbm-bb .sch td{border:0;padding:1px 0;width:auto}#gbm-bb .sch td.d{grid-area:d;width:auto;font:800 15px/1.2 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.04em;text-transform:uppercase}#gbm-bb .sch td.o{grid-area:o}#gbm-bb .sch .vn{display:none}#gbm-bb .sch .g-o img{display:none}#gbm-bb .sch td.t{grid-area:t;text-align:right;white-space:nowrap}#gbm-bb .sch td.v{grid-area:v;text-align:right;font-size:14px;color:var(--mute)}#gbm-bb .sch tr.nx td{background:none}#gbm-bb .sch tr.nx{background:#fff4ef}#gbm-bb .sch tr.rk{box-shadow:inset 4px 0 0 var(--or);padding-left:8px}#gbm-bb .sch tr.rk td:first-child{box-shadow:none}' +
    '#gbm-bb .ros,#gbm-bb .ros tbody{display:block;width:100%}#gbm-bb .ros thead{display:none}#gbm-bb .ros tr{display:grid;grid-template-columns:56px 40px 1fr;grid-template-areas:"ph no nm" "ph no hm" "ph no pv";gap:0 10px;padding:8px 0;border-bottom:1px solid var(--line)}#gbm-bb .ros td{border:0;padding:0}#gbm-bb .ros td.ph{grid-area:ph;width:56px;padding:0}#gbm-bb .ros td.no{grid-area:no;width:auto;text-align:right}#gbm-bb .ros td.nm{grid-area:nm}#gbm-bb .ros td.nm small.m{display:block;font-weight:400;color:var(--mute);font-size:14px}#gbm-bb .ros td.hm{grid-area:hm;font-size:14px;color:var(--mute)}#gbm-bb .ros td.hm small{display:inline;margin-left:4px}#gbm-bb .ros td.hm small:before{content:"· "}#gbm-bb .ros td.pv{grid-area:pv;font-size:14px}#gbm-bb .ros td.pv:empty{display:none}#gbm-bb .ros td.ps,#gbm-bb .ros td.cl,#gbm-bb .ros td.ht,#gbm-bb .ros td.wt{display:none}}';

  function styles() { if (document.getElementById('gbm-bb-css')) return; var s = document.createElement('style'); s.id = 'gbm-bb-css'; s.textContent = CSS; document.head.appendChild(s); }
  function fonts() { if (document.getElementById('gbm-bb-font')) return; var l = document.createElement('link'); l.id = 'gbm-bb-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap'; document.head.appendChild(l); }

  var D = null, LIVE = null, STORIES = [], POLL = 'ap';

  function recordOf(d) { var w = 0, l = 0; d.games.forEach(function (g) { if (g.state === 'post' && g.score) { if (g.score.win) w++; else l++; } }); return w + '-' + l; }
  function nextGame(d) { for (var i = 0; i < d.games.length; i++) if (d.games[i].state !== 'post') return d.games[i]; return null; }
  function flRank(list) { var r = null; if (list) list.ranks.forEach(function (x) { if (x.id === '57') r = x; }); return r; }
  function countdown(g) {
    var ms = new Date(g.date).getTime() - Date.now();
    if (g.tbd || ms < 0) return '';
    var h = ms / 36e5; if (h < 1) return 'Tipoff in ' + Math.max(1, Math.round(ms / 6e4)) + ' min';
    if (h < 24) return 'Tipoff in ' + Math.round(h) + ' hr';
    return 'Tipoff in ' + Math.round(h / 24) + ' days';
  }
  function gamecast(id) { return 'https://www.espn.com/mens-college-basketball/game?gameId=' + encodeURIComponent(id); }
  function oppLine(g) { return rankName(g.opp.name, g.opp.rank); }

  function liveTv(d, live) { var g = null; d.games.forEach(function (x) { if (x.id === live.id) g = x; }); return g ? tvOf(g) : 'ESPN'; }
  function heroCard(d) {
    var ng = nextGame(d), live = LIVE, h = '';
    if (live && live.state === 'in') {
      h = '<span class="b-pill live" role="status"><i></i>Live now</span><div class="b-score"><span>' + rankName('Florida', live.flRank) + '</span><span>' + esc(live.fl) + '</span><span>' + rankName(live.oppName, live.oppRank) + '</span><span>' + esc(live.opp) + '</span></div>' +
        '<p class="b-meta"><b>' + esc(live.summary) + '</b> on ' + esc(liveTv(d, live)) + '</p><a class="b-btn" href="' + gamecast(live.id) + '">Follow on ESPN</a>';
      return h;
    }
    var last = null; d.games.forEach(function (g) { if (g.state === 'post') last = g; });
    if (live && live.state === 'post' && !(last && last.id === live.id)) last = { id: live.id, score: { fl: live.fl, opp: live.opp, win: +live.fl > +live.opp }, opp: { name: live.oppName, rank: live.oppRank }, date: live.date };
    if (ng && last && new Date(last.date).getTime() > Date.now() - 20 * 36e5) {
      h = '<span class="b-pill"><i></i>Final</span><div class="b-score"><span>Florida</span><span>' + esc(last.score.fl) + '</span><span>' + rankName(last.opp.name, last.opp.rank) + '</span><span>' + esc(last.score.opp) + '</span></div>' +
        '<p class="b-then"><b>Next:</b> ' + site(ng) + ' ' + oppLine(ng) + ', ' + esc(dayLong(ng.date)) + ', ' + esc(timeLabel(ng)) + ', ' + esc(tvOf(ng)) + '.</p>';
      return h;
    }
    if (!ng) return '<span class="b-pill"><i></i>Season complete</span><h3 class="b-vs">Thanks for following the Gators</h3>';
    var cd = countdown(ng);
    h = '<span class="b-pill' + (ng.state === 'in' ? ' live' : '') + '"><i></i>' + (ng.state === 'in' ? 'Live now' : 'Next game') + '</span>' +
      '<h3 class="b-vs">' + site(ng) + ' ' + oppLine(ng) + '</h3>' +
      '<p class="b-meta"><b>' + esc(dayLong(ng.date)) + ', ' + esc(timeLabel(ng)) + '</b>' + (cd ? ' (' + esc(cd) + ')' : '') + '</p>' +
      '<p class="b-meta">TV: <b>' + esc(tvOf(ng)) + '</b></p><p class="b-meta">' + esc([ng.venue, ng.city].filter(Boolean).join(', ')) + (ng.note ? ' &middot; ' + esc(ng.note) : '') + '</p>' +
      '<a class="b-btn" href="#gbm-bb-sched">Full schedule</a>';
    return h;
  }
  function hero(d) {
    var ap = flRank(d.ap), co = flRank(d.coaches), rec = recordOf(d);
    var b = '';
    if (ap) b += '<li class="hot">No. ' + ap.rank + ' AP</li>';
    if (co) b += '<li>No. ' + co.rank + ' Coaches</li>';
    b += '<li>' + esc(rec) + ' overall</li>';
    var lede = 'Schedule, TV, roster, the AP and Coaches polls and the SEC picture for Todd Golden’s Florida Gators, with GatorBait’s coverage below.';
    if (ap && ap.fpv) lede = 'Florida opened the season No. 1 in the AP poll with ' + ap.fpv + ' first-place votes. Schedule, TV, roster, polls and the SEC picture for Todd Golden’s Gators, with GatorBait’s coverage below.';
    return '<div class="b-top"><div class="b-wrap"><div><div class="b-kick">GatorBait Media &middot; Gator basketball hub</div><h2 class="b-name">Florida Gators<br>Basketball</h2><ul class="b-badges">' + b + '</ul><p class="b-lede">' + esc(lede) + '</p>' +
      '<nav class="b-nav" aria-label="Basketball hub sections"><a href="#gbm-bb-sched">Schedule</a><a href="#gbm-bb-roster">Roster</a><a href="#gbm-bb-polls">Polls</a><a href="#gbm-bb-sec">SEC</a><a href="#gbm-bb-stories">Stories</a></nav></div>' +
      '<div class="b-card" id="gbm-bb-top-card" aria-live="polite">' + heroCard(d) + '</div></div></div>';
  }
  function schedule(d) {
    var ng = nextGame(d), rows = d.games.map(function (g) {
      var cls = (g === ng ? 'nx ' : '') + (g.opp.rank ? 'rk ' : '') + (g.state === 'post' ? 'pt' : ''), res = g.state === 'post' && g.score ? '<span class="res ' + (g.score.win ? 'w' : 'l') + '">' + (g.score.win ? 'W' : 'L') + ' ' + esc(g.score.fl) + '-' + esc(g.score.opp) + '</span>' : g.state === 'in' ? '<b class="b-rk">Live</b>' : esc(timeLabel(g));
      return '<tr class="' + cls + '"><td class="d"><time datetime="' + iso(g.date) + '">' + esc(dayLabel(g.date)) + '</time></td>' +
        '<td class="o"><span class="g-o"><img loading="lazy" decoding="async" width="26" height="26" alt="" src="' + esc(g.opp.logo) + '"><span><span>' + site(g) + ' ' + oppLine(g) + (g.sec ? '<span class="chip">SEC</span>' : '') + '</span><small>' + esc(siteWord(g)) + '<span class="vn">' + esc((g.venue ? ' · ' + g.venue : '') + (g.city ? ', ' + g.city : '')) + '</span>' + (g.note ? '<span class="nt">' + esc(' · ' + g.note) + '</span>' : '') + '</small></span></span></td>' +
        '<td class="t">' + res + '</td><td class="v">' + esc(tvOf(g)) + '</td></tr>';
    }).join('');
    var tot = d.games.length, nsec = d.games.filter(function (g) { return g.sec; }).length;
    return '<section class="b-sec" id="gbm-bb-sched" aria-labelledby="gbm-bb-h-sched"><h2 class="b-h" id="gbm-bb-h-sched">Florida basketball schedule and TV</h2><p class="b-sub">' + tot + ' games, ' + nsec + ' against SEC opponents. Times Eastern. A ranked opponent is marked with its AP rank.</p>' +
      '<table class="sch"><caption>Florida Gators men’s basketball schedule</caption><thead><tr><th>Date</th><th>Opponent</th><th>Time / result</th><th>TV</th></tr></thead><tbody>' + rows + '</tbody></table><p class="b-src">Source: ESPN. TV listings are ESPN’s current data and can change.</p></section>';
  }
  function roster(d) {
    if (!d.roster || !d.roster.length) return '';
    var okImg = function (u) { return /^https:\/\/dxbhsrqyrr690\.cloudfront\.net\//.test(u || ''); }, okUrl = function (u) { return /^https:\/\/floridagators\.com\//.test(u || ''); };
    var rows = d.roster.map(function (p) {
      return '<tr><td class="ph">' + (okImg(p.img) ? '<img loading="lazy" decoding="async" width="56" height="56" alt="' + esc(p.name + ', Florida ' + ({ G: 'guard', F: 'forward', C: 'center', 'F/C': 'forward-center', 'G/F': 'guard-forward' }[p.pos] || p.pos)) + '" src="' + esc(p.img) + '">' : '<span class="p-ni"></span>') + '</td>' +
        '<td class="no">' + esc(p.jersey) + '</td><td class="nm">' + (okUrl(p.url) ? '<a href="' + esc(p.url) + '">' + esc(p.name) + '</a>' : esc(p.name)) + '<small class="m">' + esc([p.pos, p.cls, p.ht, p.wt ? p.wt + ' lbs' : ''].filter(Boolean).join(' · ')) + '</small></td>' +
        '<td class="ps">' + esc(p.pos) + '</td><td class="cl">' + esc(p.cls) + '</td><td class="ht">' + esc(p.ht) + '</td><td class="wt">' + esc(p.wt) + '</td>' +
        '<td class="hm">' + esc(p.home) + (p.school ? '<small>' + esc(p.school) + '</small>' : '') + '</td><td class="pv">' + esc(p.prev) + '</td></tr>';
    }).join('');
    var coaches = (d.staff || []).length ? '<p class="b-sub">' + d.staff.slice(0, 4).map(function (c) { return esc(c.title) + ' <b>' + esc(c.name) + '</b>'; }).join(' &middot; ') + '.</p>' : '<p class="b-sub">Head coach ' + esc(d.team.coach) + '.</p>';
    return '<section class="b-sec" id="gbm-bb-roster" aria-labelledby="gbm-bb-h-roster"><span class="b-anc" id="roster"></span><h2 class="b-h" id="gbm-bb-h-roster">2026-27 roster</h2>' + coaches + '<p class="b-sub">' + d.roster.length + ' players, copied from <a href="https://floridagators.com/sports/mens-basketball/roster">the official roster on FloridaGators.com</a>' + (d.rosterUpdated ? ', pulled ' + esc(d.rosterUpdated) : '') + '.</p>' +
      '<table class="ros"><caption>Florida Gators men’s basketball roster</caption><thead><tr><th class="ph"><span class="vh">Photo</span></th><th class="no">No.</th><th>Name</th><th class="ps">Pos.</th><th class="cl">Class</th><th class="ht">Ht.</th><th class="wt">Wt.</th><th class="hm">Hometown / Last school</th><th class="pv">Previous school</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="b-src">Headshots and roster data: <a href="https://floridagators.com/sports/mens-basketball/roster">FloridaGators.com</a>. Photos courtesy UAA (University Athletic Association) and the photographers credited there; images load from FloridaGators.com and are not re-hosted. See the official <a href="https://floridagators.com/galleries">Florida Gators photo galleries</a>.</p></section>';
  }
  function pollList(p) {
    if (!p) return '';
    return '<ol class="poll">' + p.ranks.map(function (x) {
      return '<li' + (x.id === '57' ? ' class="fl"' : '') + '><span class="n">' + x.rank + '</span><img loading="lazy" decoding="async" width="26" height="26" alt="" src="' + esc(x.logo) + '"><span>' + esc(x.name) + (x.fpv ? ' <small>(' + x.fpv + ')</small>' : '') + (x.sec ? '<span class="chip">SEC</span>' : '') + '</span><span class="r">' + esc(x.record) + '</span></li>';
    }).join('') + '</ol>';
  }
  function pollDate(p) { return p && p.date ? (function (t) { var q = et(t); return MON[q.m] + ' ' + q.d; })(p.date) : ''; }
  function polls(d) {
    if (!d.ap) return '';
    var p = POLL === 'co' && d.coaches ? d.coaches : d.ap, nsec = p.ranks.filter(function (x) { return x.sec; }).length;
    return '<section class="b-sec" id="gbm-bb-polls" aria-labelledby="gbm-bb-h-polls"><h2 class="b-h" id="gbm-bb-h-polls">Top 25 polls</h2><p class="b-sub">' + esc(p.headline || p.name) + ', released ' + esc(pollDate(p)) + '. ' + nsec + ' SEC teams ranked. First-place votes in parentheses.</p>' +
      '<div class="b-tabs" role="group" aria-label="Choose a poll"><button type="button" data-poll="ap" aria-pressed="' + (p === d.ap) + '">AP Top 25</button>' + (d.coaches ? '<button type="button" data-poll="co" aria-pressed="' + (p === d.coaches) + '">Coaches Poll</button>' : '') + '</div>' + pollList(p) + '<p class="b-src">Source: ESPN.</p></section>';
  }
  function secBlock(d) {
    if (!d.sec || !d.sec.length) return '';
    var fs = null; d.games.forEach(function (g) { if (!fs && g.sec) fs = g; });
    var rows = d.sec.map(function (t) { return '<tr' + (t.id === '57' ? ' class="nx"' : '') + '><td><span class="g-o"><img loading="lazy" decoding="async" width="26" height="26" alt="" src="' + esc(t.logo) + '"><span>' + esc(t.name) + '</span></span></td><td>' + esc(t.conf) + '</td><td>' + esc(t.overall) + '</td><td>' + (t.apRank ? 'No. ' + t.apRank : '—') + '</td></tr>'; }).join('');
    return '<section class="b-sec" id="gbm-bb-sec" aria-labelledby="gbm-bb-h-sec"><h2 class="b-h" id="gbm-bb-h-sec">SEC at a glance</h2><p class="b-sub">Standings from ESPN, with each team’s AP rank.' + (fs ? ' Florida’s first conference game is ' + esc(fs.where === 'away' ? 'at' : 'vs.') + ' ' + esc(fs.opp.name) + ' on ' + esc(dayLong(fs.date)) + '.' : '') + '</p>' +
      '<table class="sec"><caption>SEC men’s basketball standings</caption><thead><tr><th>Team</th><th>SEC</th><th>Overall</th><th>AP</th></tr></thead><tbody>' + rows + '</tbody></table></section>';
  }
  function storyCards() {
    if (!STORIES.length) return '';
    return '<ul class="b-cards">' + STORIES.slice(0, 6).map(function (s) {
      return '<li class="b-st">' + (s.img ? '<a class="im" href="' + esc(s.url) + '" tabindex="-1" aria-hidden="true"><img loading="lazy" decoding="async" width="400" height="225" alt="" src="' + esc(s.img) + '"></a>' : '') + '<h3><a href="' + esc(s.url) + '">' + esc(s.title) + '</a></h3><div class="m">' + esc([s.by ? 'By ' + s.by : '', s.when || ''].filter(Boolean).join(' · ')) + '</div></li>';
    }).join('') + '</ul>';
  }
  function stories() {
    return '<section class="b-sec" id="gbm-bb-stories" aria-labelledby="gbm-bb-h-st"><h2 class="b-h" id="gbm-bb-h-st">Latest Florida basketball coverage</h2><p class="b-sub">Independent reporting and analysis from GatorBait Media. <a href="#gbm-np">Jump to every basketball story</a>.</p><div id="gbm-bb-cards">' + storyCards() + '</div></section>';
  }
  function seo(d) {
    var ap = flRank(d.ap);
    return '<div class="b-seo"><h2>Florida Gators men’s basketball coverage</h2>' +
      '<p>GatorBait Media covers Florida men’s basketball all season: game stories, analysis, Todd Golden’s press conferences, recruiting and the road to March. ' + (ap ? 'The Gators opened the 2026-27 season ranked No. ' + ap.rank + ' in the AP Top 25. ' : '') + 'This page keeps the Florida basketball schedule, TV channels, roster and the latest polls in one place.</p>' +
      '<h3>Florida basketball schedule and how to watch</h3><p>Every Florida Gators basketball game is listed above with its date, tipoff time in Eastern, TV network and site. Games on ESPN, ESPN2, ESPNU, SEC Network and SEC Network+ are marked where ESPN has set the channel; any game still listed as TV TBA will be filled in as networks are chosen.</p>' +
      '<h3>Florida basketball roster</h3><p>The roster table lists every player on Florida’s 2026-27 team by number, position, height, class and hometown, with links to ESPN player pages.</p>' +
      '<h3>SEC basketball and the national picture</h3><p>Florida plays an 18-game SEC schedule. The polls and SEC standings above show where the Gators stand against Duke, Texas, Tennessee and the rest of the Top 25. For football, see <a href="/gatorbait-media-blogs/categories/gator-football">Gator football</a>; for the full roster hub see the <a href="/roster">Gators roster page</a>.</p></div>';
  }
  function ld(d) {
    var ap = flRank(d.ap), o = { '@context': 'https://schema.org', '@type': 'SportsTeam', name: 'Florida Gators men’s basketball', sport: 'Basketball', url: 'https://www.gatorbaitmedia.com/gatorbait-media-blogs/categories/gator-basketball',
      memberOf: { '@type': 'SportsOrganization', name: 'Southeastern Conference' }, parentOrganization: { '@type': 'CollegeOrUniversity', name: 'University of Florida' }, coach: { '@type': 'Person', name: d.team.coach }, location: { '@type': 'Place', name: 'Stephen C. O’Connell Center, Gainesville, Florida' },
      athlete: (d.roster || []).map(function (p) { return { '@type': 'Person', name: p.name }; }), description: 'Florida Gators men’s basketball schedule, TV, roster, polls and news from GatorBait Media.' + (ap ? ' Ranked No. ' + ap.rank + ' in the AP Top 25.' : '') };
    return JSON.stringify(o).replace(/</g, '\\u003c');
  }
  function render(d) { return hero(d) + '<div class="b-wrap">' + schedule(d) + roster(d) + '<div class="b-two"><div id="gbm-bb-pollbox">' + polls(d) + '</div><div>' + secBlock(d) + '</div></div>' + stories() + seo(d) + '</div>'; }

  function anchorEl() { return document.getElementById('gbm-np') || document.getElementById('gbm-lf') || document.querySelector('[data-hook=feed-page-root]'); }
  function place(el) {
    var a = anchorEl(); if (!a || !a.parentNode) return false;
    if (el.parentNode !== a.parentNode || el.nextSibling !== a) a.parentNode.insertBefore(el, a);
    return true;
  }
  function paint() {
    var el = document.getElementById('gbm-bb'); if (!el || !D) return;
    el.innerHTML = render(D);
    var s = document.getElementById('gbm-bb-ldata'); if (!s) { s = document.createElement('script'); s.id = 'gbm-bb-ldata'; s.type = 'application/ld+json'; document.head.appendChild(s); } s.textContent = ld(D);
  }
  function setVw() { var w = document.documentElement.clientWidth; if (w > 300) document.documentElement.style.setProperty('--bb-vw', w + 'px'); }
  var HUBEL = null;
  function mount() {
    if (!onRoute() || !D) return false;
    setVw();
    var el = document.getElementById('gbm-bb');
    if (el && !el.getAttribute('data-ph')) { HUBEL = el; place(el); return true; }
    if (!el && HUBEL) { if (place(HUBEL)) return true; return false; }
    // The loader may have reserved a full-screen placeholder (data-ph) where the hub goes; adopt it so the fill moves nothing.
    if (!el) { el = document.createElement('section'); el.id = 'gbm-bb'; if (!place(el)) return false; }
    styles(); fonts();
    el.removeAttribute('data-ph'); el.removeAttribute('style'); el.setAttribute('data-build', BUILD); el.setAttribute('aria-label', 'Gator Basketball hub');
    HUBEL = el; paint(); window.__GBM_BB__.ready = true; return true;
  }
  function repaintHero() { var c = document.getElementById('gbm-bb-top-card'); if (c && D) c.innerHTML = heroCard(D); }

  /* ---------- live data ---------- */
  function getJson(urls, i) { i = i || 0; if (i >= urls.length) return Promise.reject(0); return fetch(urls[i], { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).catch(function () { return getJson(urls, i + 1); }); }
  function refreshEspn() {
    return Promise.all([getJson(ESPN.map(function (b) { return b + '/teams/57/schedule'; })).catch(function () { return null; }), getJson(ESPN.map(function (b) { return b + '/rankings'; })).catch(function () { return null; }), getJson(ESPN_STAND).catch(function () { return null; })]).then(function (r) {
      if (!r[0] || !onRoute()) return;
      var nd = normalize({ sched: r[0], rank: r[1], stand: r[2] }, D);
      if (nd.games.length < 10) return;
      nd.staff = D.staff; nd.rosterUpdated = D.rosterUpdated; D = nd; paint();
    }).catch(function () {});
  }
  var polls_n = 0, pollTimer = 0;
  function readHeader() {
    return fetch(HEADER + '&cb=' + Math.floor(Date.now() / 15000), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (h) {
      var found = null;
      (h.sports || []).forEach(function (sp) { (sp.leagues || []).forEach(function (lg) { (lg.events || []).forEach(function (e) {
        var fl = null, op = null; (e.competitors || []).forEach(function (c) { if (c.id === '57') fl = c; else op = c; });
        if (fl && op) found = { id: e.id, state: e.status, summary: e.summary || '', fl: fl.score, opp: op.score, oppName: (op.displayName || '').replace(/ (Hurricanes|Gators)$/, '') || op.abbreviation, oppRank: op.rank && op.rank < 99 ? op.rank : null, flRank: fl.rank && fl.rank < 99 ? fl.rank : null, date: e.date, tv: '' };
      }); }); });
      LIVE = found; repaintHero();
      if (D && D.games) { D.games.forEach(function (g) { if (found && g.id === found.id) g.state = found.state; }); }
      return found;
    });
  }
  function scheduleHeader(found) {
    if (pollTimer) { clearTimeout(pollTimer); pollTimer = 0; }
    var ng = D && nextGame(D), soon = ng && !ng.tbd && (new Date(ng.date).getTime() - Date.now()) < 90 * 6e4;
    if (!onRoute() || polls_n > 480 || !((found && found.state === 'in') || soon)) return;
    pollTimer = setTimeout(function () { if (!onRoute()) return; polls_n++; if (document.hidden) return scheduleHeader(found); readHeader().then(function (f) { if (f && f.state === 'post') refreshEspn(); scheduleHeader(f); }).catch(function () { scheduleHeader(found); }); }, 30000);
  }

  /* ---------- stories ---------- */
  function pathOf(u) { try { return new URL(u, location.origin).pathname.replace(/\/+$/, ''); } catch (e) { return u; } }
  function ago(ts) { var q = et(ts), n = et(Date.now()); return q.y === n.y && q.m === n.m && q.d === n.d ? 'Today' : MON[q.m] + ' ' + q.d + (q.y !== n.y ? ', ' + q.y : ''); }
  function nativeStories() {
    var fr = document.querySelector('[data-hook=feed-page-root]'), out = [];
    if (!fr) return out;
    [].slice.call(fr.querySelectorAll('[data-hook=post-list-item]')).forEach(function (it) {
      var a = it.querySelector('a[href*="/post/"]'), t = it.querySelector('[data-hook=post-title]'), im = it.querySelector('img[src^="http"]');
      if (!a) return; var title = (t ? t.textContent : a.textContent || '').replace(/\s+/g, ' ').trim(); if (!title) return;
      out.push({ url: pathOf(a.getAttribute('href')), title: title, img: im ? im.getAttribute('src') : '' });
    });
    return out;
  }
  function loadStories() {
    var nat = nativeStories(), byPath = {};
    return fetch('/blog-feed.xml?gbbb=' + Date.now(), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) {
      var x = new DOMParser().parseFromString(t, 'text/xml'), items = [].slice.call(x.querySelectorAll('item')).map(function (i) {
        var g = function (n) { var e = i.getElementsByTagName(n)[0]; return e ? e.textContent : ''; }, en = i.getElementsByTagName('enclosure')[0], cats = [].slice.call(i.getElementsByTagName('category')).map(function (c) { return c.textContent; });
        return { url: pathOf(g('link')), title: g('title'), by: g('dc:creator'), ts: Date.parse(g('pubDate')), img: en ? en.getAttribute('url') : '', bb: cats.indexOf('Gator Basketball') > -1 };
      });
      return items;
    }).catch(function () { return []; }).then(function (rss) {
      rss.forEach(function (r) { byPath[r.url] = r; });
      var seen = {}, list = [];
      rss.filter(function (r) { return r.bb; }).sort(function (a, b) { return b.ts - a.ts; }).forEach(function (r) { if (!seen[r.url]) { seen[r.url] = 1; list.push(r); } });
      nat.forEach(function (n) { if (seen[n.url]) return; seen[n.url] = 1; var r = byPath[n.url]; list.push({ url: n.url, title: n.title, img: (r && r.img) || n.img, by: r ? r.by : '', ts: r ? r.ts : 0 }); });
      STORIES = list.slice(0, 6).map(function (s) { s.when = s.ts ? ago(s.ts) : ''; if (s.img && s.img.indexOf('static.wixstatic.com/media/') > -1) s.img = s.img.replace(/\/v1\/(?:fill|fit)\/[^/]+\//, '/v1/fit/w_480,h_270,al_c,q_75/').replace(/\/file\.(png|jpe?g)$/i, '/file.webp'); return s; });
      var c = document.getElementById('gbm-bb-cards'); if (c) c.innerHTML = storyCards();
    });
  }

  /* ---------- wiring ---------- */
  function onClick(e) {
    var b = e.target.closest && e.target.closest('#gbm-bb [data-poll]'); if (!b) return;
    POLL = b.getAttribute('data-poll'); var box = document.getElementById('gbm-bb-pollbox'); if (box && D) box.innerHTML = polls(D);
  }
  function start() {
    if (!onRoute() || !SNAP) return;
    if (!D) D = SNAP;
    // Mount in the same task the native list appears (MutationObserver) so the hub is in place before the browser paints that list. A bounded backup tick re-attaches the SAME element if Wix replaces the page container.
    var mo = null;
    if (window.MutationObserver) {
      mo = new MutationObserver(function () { if (!onRoute()) return; var el = document.getElementById('gbm-bb'); if (!el || el.getAttribute('data-ph') || !el.isConnected || el.nextSibling !== anchorEl()) mount(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { if (mo) mo.disconnect(); mo = null; }, 120000);
    }
    var ticks = 0, iv = setInterval(function () { ticks++; if (!onRoute() || ticks > 120) { clearInterval(iv); return; } mount(); }, 1000);
    mount();
    var first = true;
    function go() { if (!first) return; first = false; refreshEspn(); readHeader().then(scheduleHeader).catch(function () {}); setTimeout(function () { loadStories().catch(function () {}); }, 1200); setTimeout(function () { loadStories().catch(function () {}); }, 6000); }
    setTimeout(go, 400);
  }
  function sync() {
    if (onRoute()) { var e0 = document.getElementById('gbm-bb'); if (!e0 || e0.getAttribute('data-ph')) { if (D || SNAP) { D = D || SNAP; mount(); } } else { place(e0); } return; }
    HUBEL = null; var el = document.getElementById('gbm-bb'); if (el) el.remove(); var s = document.getElementById('gbm-bb-ldata'); if (s) s.remove();
    window.__GBM_BB__.ready = false; if (pollTimer) { clearTimeout(pollTimer); pollTimer = 0; }
  }
  window.__GBM_BB__ = { sync: sync, ready: false, build: BUILD };
  document.addEventListener('click', onClick); window.addEventListener('resize', setVw);
  window.addEventListener('popstate', sync); window.addEventListener('gbmroutechange', sync);
  start();
})();
