/* GatorBait Media team directory and About masthead. Adds to /about (below the existing copy, above the footer) and renders the
   same directory on /writers if Brenden later adds a blank page there. Data: sports-live/staff-data.json (real Wix member profiles,
   existing About copy and each author's posts) refreshed with the site RSS /blog-feed.xml. Existing page content is never touched. */
(function () {
  'use strict';
  var BUILD = 'fc5e71ac', SITE = 'https://www.gatorbaitmedia.com';
  var SNAP = /*STAFF*/{"org":{"name":"GatorBait Media","id":"https://www.gatorbaitmedia.com/#organization","url":"https://www.gatorbaitmedia.com","logo":"https://static.wixstatic.com/media/ae876a_33367cf1645c43d18b0d930a68ca747b~mv2.png"},"people":[{"id":"buddy-martin","name":"Buddy Martin","by":"Buddy Martin","group":"lead","role":"Editor-in-Chief and CEO","ld":"Editor-in-Chief and CEO","line":"Emmy-winning journalist and New York Times best-selling author. Hosts The Buddy Martin Show, live Monday through Thursday at 9 p.m. ET.","photo":{"id":"ae876a_e16c7b4ace814386964d2f892f85b470~mv2.jpg","pos":"72% 18%","alt":"Buddy Martin, editor-in-chief of GatorBait Media"},"profile":"/profile/buddymartinshow/profile","read":{"href":"/gatorbait-media-blogs/categories/buddy-s-blog","label":"Read Buddy\u2019s stories"},"stories":[{"t":"Take a Deep Breath. It\u2019s Basketball Season. Or Wait a Minute! They Didn\u2019t Drop Out Of The Top 25 Yet!","p":"/post/take-a-deep-breath-it-s-basketball-season-or-wait-a-minute-they-didn-t-drop-out-of-the-top-25-yet","d":"2026-11-01T22:33:59Z"},{"t":"\"Coach Dumbass\" Owns Up To All His Team's Mistakes \u2013 Including The One He Made.","p":"/post/coach-dumbass-owns-up-to-all-his-team-s-mistakes-including-the-one-he-made","d":"2026-11-01T02:11:47Z"},{"t":"The Receiver Who Caught Everything","p":"/post/the-receiver-who-caught-everything","d":"2026-10-31T16:26:15Z"}]},{"id":"brenden-martin","name":"Brenden Martin","by":"Brenden Martin","group":"lead","role":"Owner and Executive Producer","ld":"Owner and Executive Producer","line":"Co-owner of GatorBait Media and executive producer of GatorBait TV. Produces The Buddy Martin Show.","photo":{"id":"5b5b65_ce8e69216614447788b3d623da32d059~mv2_d_2013_2015_s_2.jpeg","pos":"50% 35%","alt":"Brenden Martin, owner and executive producer of GatorBait Media"},"profile":"/profile/brenden/profile","read":{"href":"/profile/brenden/profile","label":"See Brenden\u2019s author page"},"stories":[{"t":"Snubbed in Atlanta: GameDay passed, Kirby shrugged, Florida noticed","p":"/post/snubbed-in-atlanta-gameday-kirby-florida-1","d":"2026-10-27T04:00:00Z"},{"t":"We're live: Florida-Georgia talk on The Buddy Martin Show","p":"/post/buddy-martin-show-live-florida-georgia-october-26-2026","d":"2026-10-27T01:18:53Z"},{"t":"Four medals, one golden week for Florida's Skye Blakely","p":"/post/four-medals-one-golden-week-florida-skye-blakely","d":"2026-10-25T22:56:22Z"}]},{"id":"franz-beard","name":"Franz Beard","by":"Franz Beard","group":"writer","role":"Senior Columnist","ld":"Senior Columnist","line":"Writes the Thoughts of the Day column. Author of The Golden Season, sold in the GatorBait store.","photo":{"id":"5b5b65_791f6948393c4058be4afcdc0b717af2~mv2_d_2320_3088_s_2.jpeg","pos":"50% 30%","alt":"Franz Beard, senior columnist at GatorBait Media"},"profile":"/profile/franz/profile","read":{"href":"/gatorbait-media-blogs/categories/franz-beard-blog","label":"Read Franz\u2019s stories"},"stories":[{"t":"Florida basketball: Gators start season with sky high expectations","p":"/post/florida-basketball-gators-start-season-with-sky-high-expectations","d":"2026-11-02T14:16:49Z"},{"t":"For the UF offense, it was an October to forget","p":"/post/for-the-uf-offense-it-was-an-october-to-forget","d":"2026-11-02T13:38:50Z"},{"t":"Autopsy Cause of Gators Defeat: Self-Inflicted Wounds","p":"/post/autopsy-cause-of-gators-defeat-self-inflicted-wounds","d":"2026-11-01T15:20:41Z"}]},{"id":"loren-meadows","name":"Loren Meadows","by":"Loren Meadows","group":"writer","role":"Writer","ld":null,"line":"Writes pregame and postgame analysis of Florida football.","photo":{"id":"70130b_d73c231f61fe4ab89c6be6cd67fb91ac~mv2.jpg","pos":"50% 22%","alt":"Loren Meadows, writer at GatorBait Media"},"profile":"/profile/coachmeadows/profile","read":{"href":"/gatorbait-media-blogs/categories/loren-meadows-blogs","label":"Read Loren\u2019s stories"},"stories":[{"t":"Postgame Analysis: Florida Gators (5-3, 3-3) v. Georgia Bulldogs (7-1, 5-1)","p":"/post/postgame-analysis-florida-gators-5-3-3-3-v-georgia-bulldogs-7-1-5-1","d":"2026-11-01T18:27:12Z"},{"t":"Pregame Analysis: Florida Gators (5-2, 3-2) vs. Georgia Bulldogs (6-1, 4-1)","p":"/post/pregame-analysis-florida-gators-5-2-3-2-vs-georgia-bulldogs-6-1-4-1","d":"2026-10-31T14:50:20Z"},{"t":"Postgame Thoughts: Florida (5-2, 3-2) v. Texas (4-2, 1-2)","p":"/post/postgame-thoughts-florida-5-2-3-2-v-texas-4-2-1-2","d":"2026-10-18T16:29:42Z"}]},{"id":"eddie-gilley","name":"Eddie Gilley","by":"Eddie Gilley","group":"writer","role":"Special Contributor","ld":"Special Contributor","line":"Writes columns on Florida football games and the Gators\u2019 season.","photo":null,"profile":"/profile/9322e920-3989-4e86-bfad-6a714ff21fd5/profile","read":{"href":"/gatorbait-media-blogs/categories/eddie-gilley-blog","label":"Read Eddie\u2019s stories"},"stories":[{"t":"Nightmare in Atlanta","p":"/post/nightmare-in-atlanta","d":"2026-11-02T21:48:22Z"},{"t":"Key to a Win in Atlanta","p":"/post/key-to-a-win-in-atlanta","d":"2026-10-30T16:21:53Z"},{"t":"Gators find a spark in Austin","p":"/post/gators-find-a-spark-in-austin","d":"2026-10-19T21:27:49Z"}]},{"id":"carlton-reese","name":"Carlton Reese","by":"Carlton Reese","group":"writer","role":"Writer","ld":null,"line":"Writes Gators columns for GatorBait Media.","photo":null,"profile":"/profile/28879c23-51ea-47d3-ac02-a41cd5376fcd/profile","read":{"href":"/gatorbait-media-blogs/categories/carlton-reese","label":"Read Carlton\u2019s stories"},"stories":[{"t":"Contenders, Not Hopefuls: Florida\u2019s Rout of No. 4 Ole Miss Puts the SEC on Notice","p":"/post/carlton-reese-florida-contenders-not-hopefuls-ole-miss","d":"2026-09-27T00:40:27Z"},{"t":"Personal Recollections Of \u201c14 Days In Gainesville\u201d And The ESPN Documentary","p":"/post/personal-recollections-of-14-days-in-gainesville-and-the-espn-documentary","d":"2026-09-16T21:51:00Z"},{"t":"Did This Season Spell The Death Of The Iconic Football Brand?","p":"/post/dis-this-season-spell-the-death-of-the-iconic-football-brand","d":"2026-02-03T22:46:26Z"}]},{"id":"chris-spears","name":"Chris Spears","by":"Chris Spears","group":"writer","role":"Photographer","ld":"Photographer","line":"Photographs Gators games for GatorBait Media and files sideline notes.","photo":null,"profile":null,"read":{"href":"/post/from-the-sideline-chris-spears-on-the-500th-game-in-the-swamp","label":"Read Chris\u2019s latest"},"stories":[{"t":"Three Things From Courtside: Two Nays and a Yay in Florida's Rocky Start Against Baylor","p":"/post/three-things-from-courtside-florida-baylor-exhibition","d":"2026-10-19T03:26:08Z"},{"t":"From the Sideline: Chris Spears on the 500th Game in The Swamp","p":"/post/from-the-sideline-chris-spears-on-the-500th-game-in-the-swamp","d":"2026-10-11T16:22:47Z"},{"t":"Chris Spears' Best Shots: South Carolina 38, Florida 19","p":"/post/chris-spears-best-shots-south-carolina-38-florida-19","d":"2026-10-11T04:44:19Z"}]},{"id":"gatorbait-staff","name":"GatorBait Staff","by":"GatorBait Staff","group":"writer","org":true,"role":"Newsroom byline","ld":null,"line":"News, previews, game-day updates and show notices published under the staff byline.","photo":null,"profile":"/profile/bfd9ebdd-4d13-4c29-bfe5-efff0560141c20793/profile","read":{"href":"/gatorbait-media-blogs","label":"Read the latest news"},"stories":[{"t":"LIVE NOW: The Buddy Martin Show with Shane Matthews, Franz Beard and Kevin Brockway","p":"/post/live-now-the-buddy-martin-show-with-shane-matthews-franz-beard-and-kevin-brockway","d":"2026-11-03T02:34:15Z"},{"t":"Haugh Stuff: No. 1 Gators Open With 77-67 Win Over No. 14 Miami","p":"/post/haugh-stuff-no-1-gators-open-with-77-67-win-over-no-14-miami","d":"2026-11-03T01:48:42Z"},{"t":"Sumrall: Tom Brady Would Have Been \u2018Under Too Much Duress\u2019 Against Georgia","p":"/post/sumrall-not-even-tom-brady-could-have-performed-against-georgia","d":"2026-11-02T18:25:46Z"}]}]}/*STAFF-END*/;
  var ROUTE = /^\/(about|writers)\/?$/;
  var RID = 'gbm-team';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mode() { var m = ROUTE.exec(location.pathname || ''); return m ? m[1] : ''; }
  function mon(m) { return { Jan: 'Jan.', Feb: 'Feb.', Aug: 'Aug.', Sep: 'Sept.', Oct: 'Oct.', Nov: 'Nov.', Dec: 'Dec.' }[m] || m; }
  function fmt(iso) {
    var d = new Date(iso); if (isNaN(d)) return '';
    var o = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric' }).formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    var cur = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric' }).format(new Date());
    return mon(o.month) + ' ' + o.day + (o.year !== cur ? ', ' + o.year : '');
  }
  var CSS = '' +
    '#gbm-team{--navy:#10264b;--or:#fa4616;--or-ink:#b93a0e;--ink:#0b1b36;--mute:#47566f;--line:#dfe4ec;--soft:#f5f7fb;position:relative;background:#fff;color:var(--ink);font:400 16px/1.5 Barlow,Arial,sans-serif;-webkit-text-size-adjust:100%}' +
    '#gbm-team *{box-sizing:border-box}#gbm-team a{color:var(--navy)}#gbm-team a:focus-visible{outline:3px solid var(--navy);outline-offset:2px}' +
    '#gbm-team .t-wrap{max-width:1180px;margin:0 auto;padding:0 20px}' +
    '#gbm-team .t-mast{background:var(--navy);color:#fff;border-top:4px solid var(--or);padding:34px 0 30px;scroll-margin-top:120px}' +
    '#gbm-team .t-kick{font:700 13px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#c9d5ea}' +
    '#gbm-team h1.t-h,#gbm-team h2.t-h{margin:6px 0 12px;font:800 clamp(34px,6.4vw,58px)/.98 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:#fff;letter-spacing:.005em}' +
    '#gbm-team .t-state{margin:0 0 20px;max-width:46em;font:500 18px/1.55 Barlow,sans-serif;color:#e3eaf6}' +
    '#gbm-team .t-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 24px;margin:0 0 22px;padding:16px 0 0;border-top:1px solid #35507f}' +
    '#gbm-team .t-facts div{min-width:0}#gbm-team .t-facts dt{font:700 12px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#aebfdc}#gbm-team .t-facts dd{margin:2px 0 0;font:600 17px/1.35 Barlow,sans-serif;color:#fff;overflow-wrap:anywhere}#gbm-team .t-facts a{color:#fff}' +
    '#gbm-team .t-acts{display:flex;flex-wrap:wrap;gap:10px}' +
    '#gbm-team .t-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;font:800 17px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;border:2px solid var(--navy);background:var(--navy);color:#fff}' +
    '#gbm-team .t-mast a.t-btn{background:#fff;color:var(--navy);border-color:#fff}#gbm-team .t-mast a.t-btn.sec{background:transparent;color:#fff;border-color:#8ea4cc}' +
    '#gbm-team .t-sec{padding:34px 0 8px;scroll-margin-top:120px}' +
    '#gbm-team h2.t-h2{margin:0 0 6px;font:800 clamp(28px,4.6vw,40px)/1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:var(--navy)}' +
    '#gbm-team h2.t-h2:after{content:"";display:block;width:44px;height:3px;background:var(--or);margin-top:10px}' +
    '#gbm-team .t-intro{margin:12px 0 16px;max-width:46em;color:var(--mute);font-size:17px}' +
    '#gbm-team .t-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px;padding:0;list-style:none}#gbm-team .t-chips a{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border:1px solid var(--line);background:#fff;font:700 15px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.07em;text-transform:uppercase;text-decoration:none}#gbm-team .t-chips a:hover{background:var(--soft)}' +
    '#gbm-team .t-grid{display:grid;grid-template-columns:1fr;gap:18px;margin:0;padding:0;list-style:none}' +
    '#gbm-team .t-card{display:flex;flex-direction:column;border:1px solid var(--line);border-top:3px solid var(--navy);background:#fff;padding:18px 18px 16px;scroll-margin-top:120px;min-width:0}' +
    '#gbm-team .t-head{display:flex;gap:14px;align-items:center}' +
    '#gbm-team .t-ph{flex:none;width:84px;height:84px;background:var(--navy);overflow:hidden;display:flex;align-items:center;justify-content:center;color:#fff;font:800 30px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.04em}#gbm-team .t-ph img{width:100%;height:100%;object-fit:cover;display:block}' +
    '#gbm-team .t-name{margin:0;font:700 25px/1.12 Georgia,"Times New Roman",serif;color:var(--ink)}#gbm-team .t-name a{text-decoration:none;color:inherit}#gbm-team .t-name a:hover{text-decoration:underline}' +
    '#gbm-team .t-role{margin:3px 0 0;font:700 13px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:var(--or-ink)}' +
    '#gbm-team .t-line{margin:12px 0 12px;color:var(--ink);font-size:16px}' +
    '#gbm-team .t-lbl{margin:2px 0 6px;font:700 12px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}' +
    '#gbm-team .t-list{margin:0 0 14px;padding:0;list-style:none;border-top:1px solid var(--line)}#gbm-team .t-list li{padding:9px 0;border-bottom:1px solid var(--line)}' +
    '#gbm-team .t-list a{display:block;font:600 16px/1.3 Barlow,sans-serif;text-decoration:none;color:var(--ink)}#gbm-team .t-list a:hover{text-decoration:underline}#gbm-team .t-list time{display:block;margin-top:2px;font:500 13px Barlow,sans-serif;color:var(--mute)}' +
    '#gbm-team .t-foot{margin-top:auto;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}' +
    '#gbm-team .t-card a.t-btn{min-height:44px;padding:0 16px;font-size:16px;color:#fff}#gbm-team .t-sm{font:600 15px Barlow,sans-serif}' +
    '#gbm-team .t-more{display:grid;grid-template-columns:1fr;gap:12px;margin:26px 0 0;padding:0;list-style:none}' +
    '#gbm-team .t-more a{display:block;height:100%;border:1px solid var(--line);border-left:3px solid var(--or);padding:14px 16px;text-decoration:none;background:#fff}#gbm-team .t-more a:hover{background:var(--soft)}#gbm-team .t-more b{display:block;font:800 22px/1.1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:var(--navy)}#gbm-team .t-more span{display:block;margin-top:3px;color:var(--mute);font-size:15px}' +
    '#gbm-team .t-note{margin:22px 0 0;padding:0 0 40px;color:var(--mute);font-size:14px;max-width:56em}' +
    '@media(min-width:700px){#gbm-team .t-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#gbm-team .t-more{grid-template-columns:repeat(3,minmax(0,1fr))}#gbm-team .t-facts{grid-template-columns:repeat(4,minmax(0,1fr))}}' +
    '@media(min-width:1100px){#gbm-team .t-grid{grid-template-columns:repeat(3,minmax(0,1fr))}#gbm-team .t-card.lead{grid-column:span 1}}' +
    '@media(max-width:699px){#gbm-team .t-facts div:last-child{grid-column:1/-1}}' +
    '@media(max-width:520px){#gbm-team .t-wrap{padding:0 16px}#gbm-team .t-mast{padding:26px 0 24px}#gbm-team .t-btn{flex:1 1 100%}#gbm-team .t-foot .t-btn{flex:1 1 100%}#gbm-team .t-card{padding:16px 16px 14px}}';
  function styles() { if (document.getElementById('gbm-team-css')) return; var s = document.createElement('style'); s.id = 'gbm-team-css'; s.textContent = CSS; document.head.appendChild(s); }
  function fonts() {
    if (document.getElementById('gbm-team-font') || document.querySelector('link[href*="Barlow+Condensed"],link[href*="Barlow%20Condensed"]') || document.getElementById('gbm-bc-fonts')) return;
    var l = document.createElement('link'); l.id = 'gbm-team-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap'; document.head.appendChild(l);
  }
  function mergeStories(p, feed) {
    var seen = {}, out = [];
    (feed[p.by] || []).concat(p.stories || []).forEach(function (s) { if (!s.p || seen[s.p]) return; seen[s.p] = 1; out.push(s); });
    out.sort(function (a, b) { return new Date(b.d) - new Date(a.d); });
    return out.slice(0, 3);
  }
  function parseFeed(xml) {
    var out = {};
    try {
      var doc = new DOMParser().parseFromString(xml, 'application/xml'), items = doc.getElementsByTagName('item');
      for (var i = 0; i < items.length; i++) {
        var it = items[i], g = function (n) { var e = it.getElementsByTagName(n)[0]; return e ? e.textContent : ''; };
        var cr = it.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0], by = cr ? cr.textContent.trim() : '', link = g('link'), m = /^https?:\/\/(?:www\.)?gatorbaitmedia\.com(\/post\/[^?#\s]+)/.exec(link);
        if (!by || !m) continue;
        (out[by] = out[by] || []).push({ t: g('title'), p: m[1], d: new Date(g('pubDate')).toISOString() });
      }
    } catch (e) { return {}; }
    return out;
  }
  function photo(p) {
    if (!p.photo) { var ini = p.name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); return '<div class="t-ph" aria-hidden="true">' + esc(ini) + '</div>'; }
    var src = 'https://static.wixstatic.com/media/' + p.photo.id + '/v1/fit/w_300,h_300,q_80/photo.jpg';
    return '<div class="t-ph"><img src="' + esc(src) + '" width="84" height="84" decoding="async" alt="' + esc(p.photo.alt) + '" style="object-position:' + esc(p.photo.pos || '50% 30%') + '"></div>';
  }
  function card(p, feed, m) {
    var st = mergeStories(p, feed), nm = p.profile ? '<a href="' + esc(p.profile) + '">' + esc(p.name) + '</a>' : esc(p.name);
    var h = '<li class="t-card" id="writer-' + esc(p.id) + '"><div class="t-head">' + photo(p) + '<div><h3 class="t-name">' + nm + '</h3><p class="t-role">' + esc(p.role) + '</p></div></div>' +
      '<p class="t-line">' + esc(p.line) + '</p><div class="t-lbl">Latest stories</div><ol class="t-list">' +
      st.map(function (s) { return '<li><a href="' + esc(s.p) + '">' + esc(s.t) + '</a><time datetime="' + esc(s.d) + '">' + esc(fmt(s.d)) + '</time></li>'; }).join('') + '</ol>' +
      '<div class="t-foot"><a class="t-btn" href="' + esc(p.read.href) + '">' + esc(p.read.label) + '</a>' +
      (p.profile && p.read.href !== p.profile ? '<a class="t-sm" href="' + esc(p.profile) + '">Author page</a>' : '') +
      (m === 'writers' ? '<a class="t-sm" href="/about#writer-' + esc(p.id) + '">About ' + esc(p.name.split(' ')[0]) + '</a>' : '') + '</div></li>';
    return h;
  }
  function ld(D) {
    var org = D.org, mem = D.people.filter(function (p) { return !p.org; }), g = [];
    g.push({ '@type': 'NewsMediaOrganization', '@id': org.id, name: org.name, url: org.url, logo: { '@type': 'ImageObject', url: org.logo },
      contactPoint: { '@type': 'ContactPoint', contactType: 'editorial', url: SITE + '/contact' },
      member: mem.map(function (p) { return { '@id': SITE + '/about#writer-' + p.id }; }) });
    mem.forEach(function (p) {
      var o = { '@type': 'Person', '@id': SITE + '/about#writer-' + p.id, name: p.name, worksFor: { '@id': org.id } };
      if (p.ld) o.jobTitle = p.ld;
      if (p.profile) o.url = SITE + p.profile;
      if (p.photo) o.image = 'https://static.wixstatic.com/media/' + p.photo.id;
      g.push(o);
    });
    return { '@context': 'https://schema.org', '@graph': g };
  }
  function render(D, feed, m) {
    var lead = D.people.filter(function (p) { return p.group === 'lead'; }), wr = D.people.filter(function (p) { return p.group !== 'lead'; });
    var all = lead.concat(wr), h = '';
    if (m === 'about') {
      h += '<section class="t-mast" id="team" aria-labelledby="t-mast-h"><div class="t-wrap"><div class="t-kick">About GatorBait Media</div><h2 class="t-h" id="t-mast-h">The people behind GatorBait Media</h2>' +
        '<p class="t-state">GatorBait Media is independent Florida Gators coverage, since 1979. Buddy Martin is editor-in-chief, and he and his son Brenden are the co-owners of GatorBait Media and GatorBait TV. The writers, columnists and photographer below publish under their own names. The news desk publishes under the GatorBait Staff byline.</p>' +
        '<dl class="t-facts"><div><dt>Coverage since</dt><dd>1979</dd></div><div><dt>Editor-in-chief</dt><dd>Buddy Martin</dd></div><div><dt>Owners</dt><dd>Buddy and Brenden Martin</dd></div><div><dt>Contact</dt><dd><a href="mailto:info@gatorbaitmedia.com">info@gatorbaitmedia.com</a></dd></div></dl>' +
        '<div class="t-acts"><a class="t-btn" href="/contact">Contact the newsroom</a><a class="t-btn sec" href="/the-buddy-martin-show">The Buddy Martin Show</a><a class="t-btn sec" href="/magazine">GatorBait Magazine</a></div></div></section>';
    } else {
      h += '<section class="t-mast" id="team" aria-labelledby="t-mast-h"><div class="t-wrap"><div class="t-kick">GatorBait Media</div><h1 class="t-h" id="t-mast-h">Our writers</h1>' +
        '<p class="t-state">The columnists, writers and photographer who cover the Florida Gators for GatorBait Media, with their latest stories.</p>' +
        '<div class="t-acts"><a class="t-btn" href="/about#team">About GatorBait Media</a><a class="t-btn sec" href="/contact">Contact the newsroom</a></div></div></section>';
    }
    h += '<section class="t-sec" id="writers" aria-labelledby="t-w-h"><div class="t-wrap"><h2 class="t-h2" id="t-w-h">' + (m === 'about' ? 'Writers and staff' : 'Meet the writers') + '</h2>' +
      '<p class="t-intro">Every story on GatorBait Media carries the name of the person who filed it. Tap a name for the latest stories and a link to everything they have written here.</p>' +
      '<ul class="t-chips" aria-label="Jump to a writer">' + all.map(function (p) { return '<li><a href="#writer-' + esc(p.id) + '">' + esc(p.name) + '</a></li>'; }).join('') + '</ul>' +
      '<ul class="t-grid">' + all.map(function (p) { return card(p, feed, m); }).join('') + '</ul>' +
      '<ul class="t-more"><li><a href="/the-buddy-martin-show"><b>The Buddy Martin Show</b><span>Live Monday through Thursday at 9 p.m. ET on YouTube</span></a></li><li><a href="/magazine"><b>GatorBait Magazine</b><span>This week\u2019s issue and the archive</span></a></li><li><a href="/gatorbait-media-blogs"><b>All the latest stories</b><span>Every writer, newest first</span></a></li></ul>' +
      '<p class="t-note">Questions, tips or story ideas? Use the <a href="/contact">contact page</a>. You can also <a href="/pricing-plans">join GatorBait</a>. Read our <a href="/policies">policies</a>.</p></div></section>';
    return h;
  }
  function jsonld(D) {
    var old = document.getElementById('gbm-team-ld'); if (old) old.remove();
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'gbm-team-ld'; s.textContent = JSON.stringify(ld(D)); document.head.appendChild(s);
  }
  function anchorPoint(late) { return document.getElementById('gbm-footer') || (late && document.getElementById('SITE_CONTAINER') && document.getElementById('SITE_CONTAINER').nextSibling) || null; }
  function mount(D, feed, late) {
    var m = mode(); if (!m) return false;
    var foot = anchorPoint(late); if (!foot || !foot.parentNode) return false;
    var old = document.getElementById(RID); if (old) old.remove();
    styles(); fonts();
    var el = document.createElement('div'); el.id = RID; el.setAttribute('data-build', BUILD); el.setAttribute('data-mode', m);
    el.innerHTML = render(D, feed, m);
    foot.parentNode.insertBefore(el, foot);
    if (m === 'about') jsonld(D);
    window.__GBM_TEAM__.ready = true;
    if (location.hash && /^#(team|writers|writer-[\w-]+)$/.test(location.hash)) { var t = document.getElementById(location.hash.slice(1)); if (t && el.contains(t)) setTimeout(function () { t.scrollIntoView(); }, 60); }
    return true;
  }
  var feedP = null, started = false;
  function getFeed() {
    if (feedP) return feedP;
    var t = new Promise(function (r) { setTimeout(function () { r({}); }, 1600); });
    var f = fetch(SITE + '/blog-feed.xml?cb=' + Math.floor(Date.now() / 300000), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(parseFeed).catch(function () { return {}; });
    feedP = Promise.race([f, t]);
    return feedP;
  }
  function load() {
    if (!mode() || document.getElementById(RID) || started) return;
    started = true;
    getFeed().then(function (feed) {
      var tries = 0;
      (function go() { if (!mode()) { started = false; return; } if (mount(SNAP, feed, tries > 25)) { started = false; return; } if (++tries < 150) setTimeout(go, 100); else started = false; })();
    });
  }
  function sync() { if (mode()) { load(); return; } var r = document.getElementById(RID); if (r) r.remove(); var l = document.getElementById('gbm-team-ld'); if (l) l.remove(); window.__GBM_TEAM__.ready = false; feedP = null; }
  window.__GBM_TEAM__ = { sync: sync, ready: false, build: BUILD };
  window.addEventListener('popstate', sync); window.addEventListener('gbmroutechange', sync);
  load(); [1500, 4000, 8000].forEach(function (ms) { setTimeout(function () { if (mode() && !document.getElementById(RID)) load(); }, ms); });
})();
