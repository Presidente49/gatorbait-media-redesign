/* GatorBait Florida football roster page. Data: sports-live/florida-roster.json (roster from FloridaGators.com; status from UF and the SEC availability report). */
(function () {
  'use strict';
  var BUILD = '__BUILD__', FEED = 'https://presidente49.github.io/gatorbait-media-redesign/sports-live/florida-roster.json';
  var SNAP = /*ROSTER*/null/*ROSTER-END*/;
  var doc = document.documentElement, ROUTE = /^\/(roster|football-roster)\/?$|^\/post\/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play\/?$/;
  var GROUPS = { Offense: ['QB', 'RB', 'WR', 'TE', 'OL'], Defense: ['DL', 'JACK', 'STAR', 'ILB', 'OLB', 'LB', 'CB', 'S', 'DB'], Specialists: ['K', 'P', 'LS', 'KR', 'PR'] };
  var STATUS = { out: ['Out', 'out'], doubtful: ['Doubtful', 'out'], questionable: ['Questionable', 'q'], limited: ['Limited', 'q'], injured: ['Injured', 'q'], probable: ['Probable', 'ok'], returning: ['Returning', 'ok'] };
  var IMG_OK = /^https:\/\/(dxbhsrqyrr690\.cloudfront\.net|floridagators\.com|images\.sidearmdev\.com)\//;
  var state = { q: '', group: 'All', pos: 'All', sort: 'no', dir: 1, view: '', data: null, statusOnly: false };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onRoute() { return ROUTE.test(location.pathname || ''); }
  function groupOf(pos) { for (var g in GROUPS) if (GROUPS[g].indexOf(pos) > -1) return g; return 'Other'; }
  function safeUrl(u) { return /^https:\/\/(floridagators\.com|www\.floridagators\.com|www\.secsports\.com|secsports\.com)\//.test(u || '') ? u : ''; }
  function num(n) { var v = parseInt(n, 10); return isNaN(v) ? 999 : v; }
  function htIn(h) { var m = /^(\d+)-(\d+)$/.exec(h || ''); return m ? (+m[1]) * 12 + (+m[2]) : 0; }
  function initials(n) { return String(n || '').split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase(); }

  var CSS = '' +
    'html:has(#gbm-rosterpage) #SITE_PAGES{display:none!important}' +
    'html:has(#gbm-rosterpage) #SITE_CONTAINER,html:has(#gbm-rosterpage) #masterPage,html:has(#gbm-rosterpage) #PAGES_CONTAINER,html:has(#gbm-rosterpage) #SITE_PAGES_TRANSITION_GROUP{height:auto!important;min-height:0!important;padding-bottom:0!important;margin-bottom:0!important}' +
    '#gbm-rosterpage{--navy:#10264b;--ink:#10264b;--or:#fa4616;--or-ink:#b93a0e;--line:#e3e7ee;--soft:#f6f7fa;--mute:#4b5a73;position:relative;z-index:3;background:#fff;color:var(--ink);font:400 16px/1.5 Barlow,Arial,sans-serif}' +
    '#gbm-rosterpage *{box-sizing:border-box}#gbm-rosterpage a{color:var(--navy)}#gbm-rosterpage a:focus-visible,#gbm-rosterpage button:focus-visible,#gbm-rosterpage input:focus-visible,#gbm-rosterpage select:focus-visible{outline:3px solid var(--or);outline-offset:2px}' +
    '#gbm-rosterpage .r-wrap{max-width:1240px;margin:0 auto;padding:0 20px}' +
    '#gbm-rosterpage .r-hero{border-top:6px solid var(--or);padding:26px 0 18px}' +
    '#gbm-rosterpage .r-kick{font:700 13px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--or-ink)}' +
    '#gbm-rosterpage h1{margin:6px 0 8px;font:800 clamp(38px,7vw,64px)/.95 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;letter-spacing:-.01em;color:var(--navy)}' +
    '#gbm-rosterpage .r-meta{font:500 15px/1.5 Barlow,sans-serif;color:var(--mute)}#gbm-rosterpage .r-meta b{color:var(--navy)}' +
    '#gbm-rosterpage .r-live{display:inline-flex;align-items:center;gap:7px;margin-right:10px;font:700 12px/1 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--or-ink)}#gbm-rosterpage .r-live i{width:8px;height:8px;border-radius:50%;background:var(--or);box-shadow:0 0 0 4px #fa461626}' +
    '#gbm-rosterpage .r-avail{margin:6px 0 22px;border:1px solid var(--line);border-top:4px solid var(--or);background:#fffaf6;padding:16px 18px 14px}' +
    '#gbm-rosterpage .r-avail h2{margin:0 0 4px;font:800 24px/1.1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:var(--navy)}#gbm-rosterpage .r-avail .r-asof{font:500 14px/1.45 Barlow,sans-serif;color:var(--mute);margin:0 0 12px}' +
    '#gbm-rosterpage .r-ail{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;margin:0;padding:0;list-style:none}' +
    '#gbm-rosterpage .r-ail li{display:flex;gap:12px;align-items:flex-start;background:#fff;border:1px solid var(--line);padding:10px 12px}' +
    '#gbm-rosterpage .r-ail b{display:block;font:700 17px/1.2 Barlow,sans-serif}#gbm-rosterpage .r-ail span.r-n{display:block;font:400 14px/1.4 Barlow,sans-serif;color:var(--mute);margin-top:2px}' +
    '#gbm-rosterpage .r-chip{display:inline-block;padding:3px 8px;font:800 12px/1.2 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}' +
    '#gbm-rosterpage .r-chip.out{background:#b3261e;color:#fff}#gbm-rosterpage .r-chip.q{background:#fff0e5;color:#9a3412;border:1px solid #f5b48a}#gbm-rosterpage .r-chip.ok{background:#e8f5ec;color:#1b6b3a;border:1px solid #a9d7b8}' +
    '#gbm-rosterpage .r-ctl{position:sticky;top:0;z-index:5;background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:10px 0}' +
    '#gbm-rosterpage .r-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
    '#gbm-rosterpage .r-search{flex:1 1 220px;min-width:0;height:44px;padding:0 14px;border:1px solid #c7cfdb;font:500 16px Barlow,sans-serif;color:var(--navy);background:#fff}' +
    '#gbm-rosterpage select{height:44px;padding:0 10px;border:1px solid #c7cfdb;font:600 15px Barlow,sans-serif;color:var(--navy);background:#fff}' +
    '#gbm-rosterpage .r-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}' +
    '#gbm-rosterpage .r-tab{height:38px;padding:0 14px;border:1px solid #c7cfdb;background:#fff;color:var(--navy);font:700 15px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}#gbm-rosterpage .r-tab[aria-pressed=true]{background:var(--navy);border-color:var(--navy);color:#fff}#gbm-rosterpage .r-tab.sm{height:32px;padding:0 10px;font-size:14px}#gbm-rosterpage .r-tab.sm[aria-pressed=true]{background:var(--or);border-color:var(--or);color:#10264b}' +
    '#gbm-rosterpage .r-count{margin:14px 0 8px;font:600 14px Barlow,sans-serif;color:var(--mute)}' +
    '#gbm-rosterpage .r-tw{overflow-x:auto}#gbm-rosterpage table{width:100%;border-collapse:collapse;font:500 15px/1.35 Barlow,sans-serif}#gbm-rosterpage thead th{position:sticky;top:0;background:var(--navy);color:#fff;text-align:left;font:700 13px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;padding:10px 10px;white-space:nowrap}#gbm-rosterpage thead th button{all:unset;cursor:pointer}' +
    '#gbm-rosterpage tbody tr{border-bottom:1px solid var(--line)}#gbm-rosterpage tbody tr:nth-child(even){background:#fafbfd}#gbm-rosterpage td{padding:8px 10px;vertical-align:middle}' +
    '#gbm-rosterpage td.no{font:800 20px "Barlow Condensed",Barlow,sans-serif;color:var(--or-ink);width:56px}#gbm-rosterpage td.nm a{font:700 17px Barlow,sans-serif;text-decoration:none}#gbm-rosterpage td.nm a:hover{text-decoration:underline;text-decoration-color:var(--or)}#gbm-rosterpage td.sub{color:var(--mute)}' +
    '#gbm-rosterpage .r-ph{width:44px;height:44px;border-radius:50%;object-fit:cover;object-position:50% 12%;background:#e9edf4;display:block}#gbm-rosterpage .r-ini{width:44px;height:44px;border-radius:50%;background:#e9edf4;color:var(--mute);display:flex;align-items:center;justify-content:center;font:700 14px Barlow,sans-serif}' +
    '#gbm-rosterpage .r-cards{display:none;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;margin:0;padding:0;list-style:none}' +
    '#gbm-rosterpage .r-card{display:grid;grid-template-columns:64px 1fr;gap:12px;border:1px solid var(--line);padding:10px 12px;background:#fff}#gbm-rosterpage .r-card .r-ph,#gbm-rosterpage .r-card .r-ini{width:64px;height:64px}' +
    '#gbm-rosterpage .r-card .c-no{font:800 22px/1 "Barlow Condensed",Barlow,sans-serif;color:var(--or-ink)}#gbm-rosterpage .r-card .c-nm{font:700 18px/1.2 Barlow,sans-serif;text-decoration:none}#gbm-rosterpage .r-card .c-l{font:400 14px/1.4 Barlow,sans-serif;color:var(--mute)}' +
    '#gbm-rosterpage .r-foot{margin:26px 0 0;padding:16px 0 36px;border-top:1px solid var(--line);font:400 13px/1.55 Barlow,sans-serif;color:var(--mute)}' +
    '#gbm-rosterpage .r-empty,#gbm-rosterpage .r-err{padding:26px 0;font:500 16px Barlow,sans-serif;color:var(--mute)}' +
    '@media(max-width:1119px){#gbm-rosterpage tr>:nth-child(9){display:none}}#gbm-rosterpage.v-cards .r-tw{display:none}#gbm-rosterpage.v-cards table{display:none}#gbm-rosterpage.v-cards .r-cards{display:grid}' +
    '@media(max-width:819px){#gbm-rosterpage .r-tw{display:none}#gbm-rosterpage table{display:none}#gbm-rosterpage .r-cards{display:grid}#gbm-rosterpage .r-viewsel{display:none}#gbm-rosterpage .r-wrap{padding:0 16px}}' +
    '@media(min-width:1500px){#gbm-rosterpage .r-wrap{max-width:1380px}}';

  function fonts() { if (document.getElementById('gbm-roster-fonts')) return; var l = document.createElement('link'); l.id = 'gbm-roster-fonts'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap'; document.head.appendChild(l); }
  function styles() { if (document.getElementById('gbm-roster-css')) return; var s = document.createElement('style'); s.id = 'gbm-roster-css'; s.textContent = CSS; document.head.appendChild(s); }

  function stFor(D, p) { var m = (D.status || {})[p.name]; return m && STATUS[m.status] ? m : null; }
  function chip(m) { var s = STATUS[m.status]; return '<span class="r-chip ' + s[1] + '">' + esc(m.label || s[0]) + '</span>'; }
  function photo(p) { var u = IMG_OK.test(p.img || '') ? p.img : ''; return u ? '<img class="r-ph" loading="lazy" decoding="async" width="64" height="64" src="' + esc(u) + '" alt="' + esc(p.name) + ', Florida ' + esc(p.pos) + '" onerror="this.outerHTML=\'<div class=&quot;r-ini&quot;>' + esc(initials(p.name)) + '</div>\'">' : '<div class="r-ini" aria-hidden="true">' + esc(initials(p.name)) + '</div>'; }

  function list(D) {
    var q = state.q.trim().toLowerCase(), out = D.players.filter(function (p) {
      if (state.group !== 'All' && groupOf(p.pos) !== state.group) return false;
      if (state.pos !== 'All' && p.pos !== state.pos) return false;
      if (state.statusOnly && !stFor(D, p)) return false;
      if (q && (p.name + ' ' + p.pos + ' ' + p.no + ' ' + p.home + ' ' + p.school + ' ' + p.prev).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var k = state.sort, d = state.dir, yrs = ['Fr.', 'RS Fr.', 'So.', 'RS So.', 'Jr.', 'RS Jr.', 'Sr.', 'RS Sr.', 'Gr.'];
    out.sort(function (a, b) {
      var r = 0;
      if (k === 'no') r = num(a.no) - num(b.no); else if (k === 'name') r = a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0]) || a.name.localeCompare(b.name);
      else if (k === 'pos') r = a.pos.localeCompare(b.pos) || num(a.no) - num(b.no); else if (k === 'yr') r = yrs.indexOf(a.yr) - yrs.indexOf(b.yr) || num(a.no) - num(b.no);
      else if (k === 'ht') r = htIn(a.ht) - htIn(b.ht); else if (k === 'wt') r = (a.wt || 0) - (b.wt || 0); else if (k === 'home') r = a.home.localeCompare(b.home);
      return r * d;
    });
    return out;
  }

  function renderList(root, D) {
    var rows = list(D), box = root.querySelector('.r-list');
    root.querySelector('.r-count').textContent = rows.length + (rows.length === 1 ? ' player' : ' players') + (rows.length !== D.players.length ? ' of ' + D.players.length : '');
    if (!rows.length) { box.innerHTML = '<p class="r-empty">No players match. Clear the search or pick All.</p>'; return; }
    var th = function (k, t) { return '<th scope="col"><button type="button" data-sort="' + k + '" aria-label="Sort by ' + t + '">' + t + (state.sort === k ? (state.dir > 0 ? ' ▲' : ' ▼') : '') + '</button></th>'; };
    var body = rows.map(function (p) {
      var m = stFor(D, p), prof = safeUrl(p.url), nm = prof ? '<a href="' + esc(prof) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a>' : esc(p.name);
      return '<tr><td>' + photo(p) + '</td><td class="no">' + esc(p.no) + '</td><td class="nm">' + nm + '</td><td>' + esc(p.pos) + '</td><td>' + esc(p.yr) + '</td><td>' + esc(String(p.ht).replace('-', "'") + (p.ht ? '"' : '')) + '</td><td>' + esc(p.wt || '') + '</td><td class="sub">' + esc(p.home) + '</td><td class="sub">' + esc(p.prev ? p.school + ' / ' + p.prev : p.school) + '</td><td>' + (m ? chip(m) : '') + '</td></tr>';
    }).join('');
    var cards = rows.map(function (p) {
      var m = stFor(D, p), prof = safeUrl(p.url), nm = prof ? '<a class="c-nm" href="' + esc(prof) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a>' : '<span class="c-nm">' + esc(p.name) + '</span>';
      return '<li class="r-card">' + photo(p) + '<div><div><span class="c-no">#' + esc(p.no) + '</span> ' + nm + '</div><div class="c-l">' + esc(p.pos) + ' · ' + esc(p.yr) + ' · ' + esc(String(p.ht).replace('-', "'") + (p.ht ? '"' : '')) + (p.wt ? ', ' + esc(p.wt) + ' lbs' : '') + '</div><div class="c-l">' + esc(p.home) + '</div>' + (m ? '<div style="margin-top:6px">' + chip(m) + (m.note ? ' <span class="c-l">' + esc(m.note) + '</span>' : '') + '</div>' : '') + '</div></li>';
    }).join('');
    box.innerHTML = '<div class="r-tw"><table><thead><tr><th scope="col"><span class="vh" style="position:absolute;left:-9999px">Photo</span></th>' + th('no', 'No.') + th('name', 'Name') + th('pos', 'Pos.') + th('yr', 'Class') + th('ht', 'Ht.') + th('wt', 'Wt.') + th('home', 'Hometown') + '<th scope="col">Last school</th><th scope="col">Status</th></tr></thead><tbody>' + body + '</tbody></table></div><ul class="r-cards">' + cards + '</ul>';
  }

  function posChips(D) {
    var present = {}; D.players.forEach(function (p) { present[p.pos] = 1; });
    var all = []; ['Offense', 'Defense', 'Specialists'].forEach(function (g) { GROUPS[g].forEach(function (x) { if (present[x] && (state.group === 'All' || state.group === g)) all.push(x); }); });
    return '<button type="button" class="r-tab sm" data-pos="All" aria-pressed="' + (state.pos === 'All') + '">All positions</button>' + all.map(function (x) { return '<button type="button" class="r-tab sm" data-pos="' + x + '" aria-pressed="' + (state.pos === x) + '">' + x + '</button>'; }).join('');
  }

  function availBlock(D) {
    var names = Object.keys(D.status || {}).filter(function (n) { return STATUS[D.status[n].status]; }), A = D.availability || {};
    var byName = {}; D.players.forEach(function (p) { byName[p.name] = p; });
    var items = names.map(function (n) { var m = D.status[n], p = byName[n] || {}, src = safeUrl(m.src);
      return '<li>' + (p.name ? photo(p) : '') + '<div><b>' + esc(n) + (p.no ? ' · #' + esc(p.no) : '') + (p.pos ? ' · ' + esc(p.pos) : '') + '</b>' + chip(m) + '<span class="r-n">' + esc(m.note || '') + (m.date ? ' (' + esc(m.date) + (src ? ', <a href="' + esc(src) + '" target="_blank" rel="noopener">source</a>' : '') + ')' : '') + '</span></div></li>'; }).join('');
    return '<section class="r-avail" aria-labelledby="r-avh"><h2 id="r-avh">Injury and availability</h2><p class="r-asof">' + esc(A.label || 'Updated after each SEC availability report and Florida media session.') + (A.asOf ? ' <b>As of ' + esc(A.asOf) + '.</b>' : '') + '</p>' + (items ? '<ul class="r-ail">' + items + '</ul>' : '<p class="r-empty" style="padding:6px 0">No players listed right now.</p>') + '</section>';
  }

  function render(D) {
    var n = D.players.length, tabs = ['All', 'Offense', 'Defense', 'Specialists'].map(function (g) { return '<button type="button" class="r-tab" data-group="' + g + '" aria-pressed="' + (state.group === g) + '">' + g + '</button>'; }).join('');
    return '<div class="r-wrap"><header class="r-hero"><p class="r-kick"><span class="r-live"><i></i>Live roster</span>Florida football</p><h1>' + esc(D.season || 2026) + ' Roster</h1><p class="r-meta"><b>' + n + ' players.</b> Updated ' + esc(D.updatedLabel || '') + '. Roster and headshots from <a href="https://floridagators.com/sports/football/roster" target="_blank" rel="noopener">FloridaGators.com</a>. Injury status from UF and the SEC availability report.</p></header>' + availBlock(D) +
      '<div class="r-ctl"><div class="r-row"><input class="r-search" type="search" placeholder="Search name, number, position, hometown" aria-label="Search the roster" value="' + esc(state.q) + '"><select class="r-sortsel" aria-label="Sort players"><option value="no">Sort: number</option><option value="name">Sort: last name</option><option value="pos">Sort: position</option><option value="yr">Sort: class</option><option value="ht">Sort: height</option><option value="wt">Sort: weight</option><option value="home">Sort: hometown</option></select><button type="button" class="r-tab r-viewsel" data-view="1" aria-pressed="false">Card view</button><button type="button" class="r-tab" data-statusonly="1" aria-pressed="' + state.statusOnly + '">Injured / limited</button></div><div class="r-tabs r-groups">' + tabs + '</div><div class="r-tabs r-poss">' + posChips(D) + '</div></div>' +
      '<p class="r-count" aria-live="polite"></p><div class="r-list"></div><footer class="r-foot">Roster data, class years, heights, weights and headshots: FloridaGators.com and UAA Communications. Injury and availability status: Florida coaches and players at media sessions, the SEC availability report and FloridaGators.com. GatorBait Media is independent. Spotted a mistake? <a href="mailto:info@gatorbaitmedia.com">Tell us</a>.</footer></div>';
  }

  function wire(root, D) {
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.dataset.group) { state.group = t.dataset.group; state.pos = 'All'; refreshAll(root, D); }
      else if (t.dataset.pos) { state.pos = t.dataset.pos; refreshAll(root, D); }
      else if (t.dataset.sort) { if (state.sort === t.dataset.sort) state.dir *= -1; else { state.sort = t.dataset.sort; state.dir = 1; } root.querySelector('.r-sortsel').value = state.sort; renderList(root, D); }
      else if (t.dataset.view) { var c = root.classList.toggle('v-cards'); t.setAttribute('aria-pressed', c); t.textContent = c ? 'Table view' : 'Card view'; }
      else if (t.dataset.statusonly) { state.statusOnly = !state.statusOnly; refreshAll(root, D); }
    });
    root.querySelector('.r-search').addEventListener('input', function (e) { state.q = e.target.value; renderList(root, D); });
    root.querySelector('.r-sortsel').addEventListener('change', function (e) { state.sort = e.target.value; state.dir = 1; renderList(root, D); });
  }
  function refreshAll(root, D) {
    root.querySelectorAll('[data-group]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.group === state.group)); });
    root.querySelector('.r-poss').innerHTML = posChips(D);
    var so = root.querySelector('[data-statusonly]'); if (so) so.setAttribute('aria-pressed', String(state.statusOnly));
    renderList(root, D);
  }

  function valid(D) { return D && Array.isArray(D.players) && D.players.length > 20; }
  function mount(D) {
    var old = document.getElementById('gbm-rosterpage'); if (old) old.remove();
    styles(); fonts();
    var m = document.createElement('main'); m.id = 'gbm-rosterpage'; m.setAttribute('data-build', BUILD); m.setAttribute('aria-label', 'Florida football roster');
    m.innerHTML = render(D); m.querySelector('.r-sortsel').value = state.sort;
    var anchor = document.getElementById('gbm-mobile-shell-host') || document.getElementById('gbm-site-header');
    if (anchor && anchor.parentNode === document.body) document.body.insertBefore(m, anchor.nextSibling); else document.body.insertBefore(m, document.body.firstChild);
    wire(m, D); renderList(m, D); document.title = 'Florida Football: ' + (D.season || 2026) + ' Roster | GatorBait Media';
    window.__GBM_ROSTER__.ready = true;
  }
  function load() {
    if (!onRoute()) return;
    if (document.getElementById('gbm-rosterpage')) return;
    if (valid(SNAP)) { state.data = SNAP; mount(SNAP); }
    var u = FEED + '?cb=' + Math.floor(Date.now() / 60000);
    fetch(u, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (D) {
      if (!valid(D) || !onRoute()) return; if (state.data && state.data.updated === D.updated && document.getElementById('gbm-rosterpage')) return;
      state.data = D; var keep = { q: state.q }; mount(D); state.q = keep.q;
    }).catch(function () { if (!document.getElementById('gbm-rosterpage')) { var m = document.createElement('main'); m.id = 'gbm-rosterpage'; m.innerHTML = '<div class="r-wrap"><p class="r-err">The roster did not load. See the <a href="https://floridagators.com/sports/football/roster">official roster on FloridaGators.com</a>.</p></div>'; styles(); document.body.insertBefore(m, document.body.firstChild); } });
  }
  function sync() { if (onRoute()) { load(); return; } var r = document.getElementById('gbm-rosterpage'); if (r) r.remove(); window.__GBM_ROSTER__.ready = false; }
  window.__GBM_ROSTER__ = { sync: sync, ready: false, build: BUILD };
  window.addEventListener('popstate', sync); window.addEventListener('gbmroutechange', sync);
  load(); [600, 1800, 4000].forEach(function (ms) { setTimeout(function () { if (onRoute() && !document.getElementById('gbm-rosterpage')) load(); }, ms); });
})();
