/* GatorBait News Wire (newspaper layout for the Latest / All News page). PREVIEW BUILD, not live.
   Source of truth for the page: /gatorbait-media-blogs, /categories/*, /tags/*, /page/N.
   Data approach is the same as Latest Feed v1 (sports-live/src/latest-feed.js): /blog-feed.xml (cache-busted, no-store) for the root,
   the native Wix list (12 per page desktop, 5 phone) for category, tag and page routes, native pages 2..n for "Load more".
   Falls back to the native Wix list on any failure. Posts are never touched. No h1 is added. Barlow / Barlow Condensed only.
   Standalone: styles are embedded below (the build collapses them); no other file is required except the optional video list. */
var FEED = /^\/gatorbait-media-blogs(\/|$)/;
var D = document, H = D.documentElement, W = window;
if (!W.__GBM_NP__ && !W.__GBM_LF__ && FEED.test(location.pathname) && !W.__GBM_NP_FAIL__) {
  W.__GBM_NP__ = 1;
  var ROOT_PATH = '/gatorbait-media-blogs';
  var VIDEOS = 'https://presidente49.github.io/gatorbait-media-redesign/sports-live/buddy-videos.json';
  var path = location.pathname.replace(/\/+$/, '');
  var pageNo = +((path.match(/\/page\/(\d+)$/) || [0, 1])[1]);
  var base = path.replace(/\/page\/\d+$/, '');
  var catSlug = (base.match(/\/categories\/([^/]+)$/) || [])[1] || '';
  var isRoot = base === ROOT_PATH && pageNo === 1;
  var FIRST = 30, STEP = 12, CAP = 48, TOP_N = 5, WIRE_N = 10;
  // [RSS category name, short label, slug, nav group]
  var CATS = [
    ['Franz Beard - Blog', 'Franz Beard', 'franz-beard-blog', 1],
    ["Buddy's Blog", 'Buddy Martin', 'buddy-s-blog', 1],
    ['Loren Meadows - Blogs', 'Loren Meadows', 'loren-meadows-blogs', 1],
    ['Eddie Gilley - Blog', 'Eddie Gilley', 'eddie-gilley-blog', 1],
    ['Gator Football', 'Football', 'gator-football', 1],
    ['Gator Basketball', 'Basketball', 'gator-basketball', 1],
    ['Gator Recruiting', 'Recruiting', 'gator-recruiting', 1],
    ['Gatorbait Magazine', 'Magazine', 'gatorbait-magazine', 1],
    ['The Buddy Martin Show', 'The Buddy Martin Show', 'the-buddy-martin-show', 1],
    ['Gator Breaking News', 'Breaking News', 'gator-breaking-news', 2],
    ['Thoughts Of The Day', 'Thoughts of the Day', 'thoughts-of-the-day-franz-beard-1', 2],
    ['Carlton Reese', 'Carlton Reese', 'carlton-reese', 2],
    ['Gator Baseball', 'Baseball', 'gator-baseball', 2],
    ['Gator Softball', 'Softball', 'gator-softball', 2],
    ['Gator Gymnastics', 'Gymnastics', 'gator-gymnastics', 2],
    ['Gators in The NFL', 'Gators in the NFL', 'gators-in-the-nfl', 2]
  ];
  var CAT_BY_NAME = {}, CAT_BY_SLUG = {};
  CATS.forEach(function (c) { CAT_BY_NAME[c[0].toLowerCase()] = c; CAT_BY_SLUG[c[2]] = c; });
  var TAG_ORDER = ['Franz Beard - Blog', "Buddy's Blog", 'Loren Meadows - Blogs', 'Eddie Gilley - Blog', 'Carlton Reese', 'The Buddy Martin Show', 'Gatorbait Magazine', 'Thoughts Of The Day', 'Gator Basketball', 'Gator Recruiting', 'Gator Breaking News', 'Gator Football', 'Gator Baseball', 'Gator Softball', 'Gator Gymnastics', 'Gators in The NFL'];
  var root = null, state = null, PS = 12, nextPage = 2, lastPage = 1, loading = false, exhausted = false, failed = false, videos = null;

  /*CSS*/
  var CSS = `
#gbm-np{--o:#fa4616;--od:#b83208;--n:#10264b;--ink:#07122e;--tx:#14213d;--mu:#4a5670;--ln:#d5dbe6;--paper:#fff;--wash:#f3f5f9;--c:"Barlow Condensed","Barlow",Arial,sans-serif;--f:"Barlow",Arial,sans-serif;
position:relative;display:block;width:var(--np-vw,100vw);max-width:100vw;margin:0 0 0 calc(50% - var(--np-vw,100vw)/2);padding:0;box-sizing:border-box;background:var(--paper);color:var(--tx);font-family:var(--f);text-align:left;text-transform:none;letter-spacing:0;line-height:1.3}
#gbm-np *,#gbm-np *::before,#gbm-np *::after{box-sizing:border-box}
#gbm-np a{color:inherit;text-decoration:none;font-family:inherit}
#gbm-np h2,#gbm-np h3,#gbm-np h4,#gbm-np p,#gbm-np ol,#gbm-np ul{margin:0;padding:0;font-family:var(--c);color:var(--n);text-transform:none;letter-spacing:0;list-style:none}
#gbm-np img{display:block;max-width:none}
#gbm-np .np-in{width:100%;max-width:1360px;margin:0 auto;padding:0 32px}
#gbm-np a:focus-visible,#gbm-np button:focus-visible,#gbm-np input:focus-visible{outline:3px solid var(--o);outline-offset:2px}
#gbm-np a.np-h:hover,#gbm-np a:hover .np-h{color:var(--od);text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}
/* masthead */
#gbm-np .np-top-line{display:flex;justify-content:space-between;gap:8px 20px;flex-wrap:wrap;padding:14px 0 10px;border-bottom:1px solid var(--ln);font:700 13px/1.3 var(--f);letter-spacing:.1em;text-transform:uppercase;color:var(--mu)}
#gbm-np .np-top-line b{color:var(--n);font-weight:800}
#gbm-np .np-mast{padding:18px 0 14px;text-align:center;border-bottom:4px solid var(--n);position:relative}
#gbm-np .np-mast::after{content:"";position:absolute;left:0;right:0;bottom:-9px;height:2px;background:var(--o)}
#gbm-np .np-kick{display:block;margin-bottom:6px;font:800 13px/1 var(--f);letter-spacing:.2em;text-transform:uppercase;color:var(--od)}
#gbm-np .np-title{font:800 clamp(44px,7.2vw,104px)/.9 var(--c);text-transform:uppercase;color:var(--n)}
#gbm-np .np-tag{display:block;margin-top:8px;font:600 15px/1.2 var(--f);letter-spacing:.06em;color:var(--mu)}
/* section bar */
#gbm-np .np-navwrap{display:flex;align-items:stretch;gap:16px;margin-top:20px;border-bottom:1px solid var(--n)}
#gbm-np .np-nav{flex:1 1 auto;min-width:0;display:flex;gap:0;overflow-x:auto;scrollbar-width:thin;scrollbar-color:var(--ln) transparent;-webkit-overflow-scrolling:touch;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent)}
#gbm-np .np-nav a{flex:none;display:inline-flex;align-items:center;min-height:44px;padding:0 14px;font:800 16px/1 var(--c);letter-spacing:.08em;text-transform:uppercase;color:var(--n);white-space:nowrap;border-bottom:4px solid transparent;margin-bottom:-1px}
#gbm-np .np-nav a:hover{color:var(--od)}
#gbm-np .np-nav a[aria-current=page]{border-bottom-color:var(--o);color:var(--ink)}
#gbm-np .np-nav a.np-gap{margin-left:10px;position:relative}
#gbm-np .np-nav a.np-gap::before{content:"";position:absolute;left:-6px;top:12px;bottom:12px;width:1px;background:var(--ln)}
#gbm-np .np-search{flex:none;display:flex;align-items:center;gap:6px;padding:4px 0}
#gbm-np .np-search input[type=search]{width:160px;min-height:40px;padding:0 12px;border:1px solid var(--n);border-radius:0;background:#fff;color:var(--ink);font:500 16px/1 var(--f)}
#gbm-np .np-search input::placeholder{color:#5b667c;opacity:1}
#gbm-np .np-search button{min-height:40px;padding:0 14px;border:0;background:var(--n);color:#fff;font:800 15px/1 var(--c);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
#gbm-np .np-search button:hover{background:var(--od)}
#gbm-np .np-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* strip */
#gbm-np .np-strip{display:flex;align-items:center;gap:12px;margin-top:14px;padding:9px 14px;background:var(--n);color:#fff;min-width:0}
#gbm-np .np-strip b{flex:none;padding:4px 8px 3px;background:var(--o);color:var(--ink);font:800 13px/1 var(--f);letter-spacing:.12em;text-transform:uppercase}
#gbm-np .np-strip a{min-width:0;flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:700 17px/1.2 var(--c);letter-spacing:.02em;color:#fff}
#gbm-np .np-strip a:hover{text-decoration:underline}
#gbm-np .np-strip time{flex:none;font:700 13px/1 var(--f);letter-spacing:.06em;color:#c9d3e6;text-transform:uppercase}
/* front */
#gbm-np .np-front{display:grid;grid-template-columns:minmax(0,2.15fr) minmax(280px,.85fr);gap:36px;padding:26px 0 30px;border-bottom:2px solid var(--n)}
#gbm-np .np-lead{min-width:0;display:block}
#gbm-np .np-sec{display:inline-block;margin-bottom:10px;padding:5px 9px 4px;background:var(--o);color:var(--ink);font:800 12px/1 var(--f);letter-spacing:.12em;text-transform:uppercase}
#gbm-np .np-lt{font:800 clamp(36px,4.5vw,64px)/.98 var(--c);color:var(--n)}
#gbm-np .np-dek{margin-top:12px;font:500 clamp(17px,1.5vw,21px)/1.4 var(--f);color:var(--tx);max-width:62ch;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
#gbm-np .np-by{display:flex;flex-wrap:wrap;gap:2px 14px;margin-top:12px;font:600 13px/1.4 var(--f);letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}
#gbm-np .np-by b{color:var(--n);font-weight:800}
#gbm-np .np-lead .np-media{position:relative;display:block;margin-top:16px;aspect-ratio:16/9;overflow:hidden;background:#0b1226;border-bottom:5px solid var(--o)}
#gbm-np .np-media .np-bg{position:absolute;inset:-20px;background-size:cover;background-position:center;filter:blur(26px) saturate(1.1);opacity:.7}
#gbm-np .np-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
#gbm-np .np-rail{min-width:0;border-top:5px solid var(--o);padding-top:10px}
#gbm-np .np-rail-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font:800 24px/1 var(--c);text-transform:uppercase;color:var(--n)}
#gbm-np .np-rail-h span{font:700 12px/1 var(--f);letter-spacing:.1em;color:var(--mu)}
#gbm-np .np-rail ol>li{display:grid;grid-template-columns:2.2rem minmax(0,1fr);gap:8px;padding:14px 0;border-top:1px solid var(--ln)}
#gbm-np .np-rail ol>li:first-child{margin-top:10px}
#gbm-np .np-num{font:800 38px/.9 var(--c);color:var(--o)}
#gbm-np .np-rt{font:800 23px/1.06 var(--c);color:var(--n);display:block}
#gbm-np .np-meta{display:flex;flex-wrap:wrap;gap:2px 10px;margin-top:6px;font:600 12px/1.4 var(--f);letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}
#gbm-np .np-meta b{color:var(--n);font-weight:800}
#gbm-np .np-meta .np-s{color:var(--od);font-weight:800}
/* mid row: live wire + columns */
#gbm-np .np-mid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,.8fr) minmax(0,.8fr);gap:34px;padding:28px 0 32px;border-bottom:1px solid var(--ln)}
#gbm-np .np-mid.np-solo{grid-template-columns:minmax(0,1fr)}
#gbm-np .np-sh{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:0 0 10px;padding-top:8px;border-top:4px solid var(--n);font:800 26px/1 var(--c);text-transform:uppercase;color:var(--n)}
#gbm-np .np-sh span{font:700 12px/1 var(--f);letter-spacing:.1em;color:var(--od)}
#gbm-np .np-day{padding:14px 0 6px;font:800 14px/1 var(--f);letter-spacing:.12em;text-transform:uppercase;color:var(--mu);border-bottom:1px solid var(--n)}
#gbm-np .np-day:first-of-type{padding-top:6px}
#gbm-np .np-wire li{display:grid;grid-template-columns:5.4rem minmax(0,1fr);gap:10px;padding:11px 0;border-bottom:1px solid var(--ln)}
#gbm-np .np-wtime{font:800 15px/1.2 var(--f);letter-spacing:.02em;color:var(--od);white-space:nowrap}
#gbm-np .np-wt{font:800 21px/1.1 var(--c);color:var(--n);display:block}
#gbm-np .np-col{align-self:start;border-top:5px solid var(--o);background:var(--wash);padding:18px 20px 20px;min-width:0}
#gbm-np .np-col .np-ck{font:800 12px/1.2 var(--f);letter-spacing:.14em;text-transform:uppercase;color:var(--od)}
#gbm-np .np-col .np-ct{display:block;margin-top:14px;font:800 clamp(30px,2.6vw,38px)/1 var(--c);color:var(--n)}
#gbm-np .np-col .np-cd{margin-top:12px;font:500 16px/1.45 var(--f);color:var(--tx);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5;overflow:hidden}
#gbm-np .np-col .np-go{display:inline-block;margin-top:16px;font:800 15px/1 var(--c);letter-spacing:.1em;text-transform:uppercase;color:var(--n);border-bottom:3px solid var(--o);padding-bottom:3px}
#gbm-np .np-col a.np-go:hover{color:var(--od)}
#gbm-np .np-mid.np-c1{grid-template-columns:minmax(0,1.4fr) minmax(0,.8fr)}
/* video */
#gbm-np .np-tv{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,.85fr);gap:34px;padding:28px 0 32px;border-bottom:1px solid var(--ln);min-height:300px}
#gbm-np .np-tv[hidden]{display:none}
#gbm-np .np-vid{position:relative;display:block;aspect-ratio:16/9;overflow:hidden;background:#0b1226}
#gbm-np .np-vid img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#gbm-np .np-play{position:absolute;left:14px;bottom:14px;width:52px;height:52px;border-radius:50%;background:var(--o);display:grid;place-items:center}
#gbm-np .np-play::after{content:"";margin-left:5px;border-style:solid;border-width:10px 0 10px 16px;border-color:transparent transparent transparent var(--ink)}
#gbm-np .np-vt{margin-top:12px;font:800 clamp(26px,2.4vw,34px)/1.02 var(--c);color:var(--n)}
#gbm-np .np-vl li{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;padding:11px 0;border-bottom:1px solid var(--ln);align-items:start}
#gbm-np .np-vl .np-vid{aspect-ratio:16/9}
#gbm-np .np-vl .np-vt2{font:800 19px/1.08 var(--c);color:var(--n);display:block}
/* more stories */
#gbm-np .np-more{padding:28px 0 8px}
#gbm-np .np-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:26px 24px}
#gbm-np .np-grid>li{min-width:0;padding-top:12px;border-top:1px solid var(--n)}
#gbm-np .np-card{display:flex;flex-direction:column;gap:10px;height:100%}
#gbm-np .np-ci{position:relative;display:block;aspect-ratio:3/2;overflow:hidden;background:#0b1226;border-bottom:3px solid var(--o)}
#gbm-np .np-ci img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 28%;transition:transform .35s ease}
#gbm-np a:hover .np-ci img{transform:scale(1.03)}
#gbm-np .np-cs{font:800 12px/1 var(--f);letter-spacing:.12em;text-transform:uppercase;color:var(--od)}
#gbm-np .np-cn{font:800 24px/1.06 var(--c);color:var(--n);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}
#gbm-np .np-cx{font:500 15px/1.4 var(--f);color:var(--tx);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
#gbm-np .np-foot{display:flex;flex-direction:column;align-items:center;gap:14px;margin:30px 0 0;padding:24px 0 56px;border-top:4px solid var(--n)}
#gbm-np .np-status{font:600 14px/1.3 var(--f);letter-spacing:.06em;color:var(--mu);text-transform:uppercase}
#gbm-np .np-loadmore,#gbm-np .np-older{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 34px;border:0;background:var(--n);color:#fff;font:800 19px/1 var(--c);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
#gbm-np .np-loadmore:hover,#gbm-np .np-older:hover{background:var(--od)}
#gbm-np .np-loadmore[disabled]{opacity:.7;cursor:wait}
#gbm-np .np-pg{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
#gbm-np .np-pg a{display:inline-flex;align-items:center;justify-content:center;min-width:46px;min-height:46px;padding:0 14px;border:1px solid var(--n);background:#fff;color:var(--n);font:800 17px/1 var(--c);letter-spacing:.06em;text-transform:uppercase}
#gbm-np .np-pg a:hover{background:var(--n);color:#fff}
#gbm-np .np-pg a[aria-current=page]{background:var(--o);border-color:var(--o);color:var(--ink)}
#gbm-np .np-empty{padding:60px 0;text-align:center;font:600 20px/1.3 var(--f);color:var(--mu)}
/* tablet */
@media(max-width:1099px){
#gbm-np .np-in{padding:0 24px}
#gbm-np .np-front{grid-template-columns:minmax(0,1fr);gap:26px}
#gbm-np .np-rail ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:28px}
#gbm-np .np-rail ol>li:nth-child(2){margin-top:10px}
#gbm-np .np-mid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
#gbm-np .np-wire{grid-column:1/-1}
#gbm-np .np-tv{grid-template-columns:minmax(0,1fr)}
#gbm-np .np-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
}
/* phone */
@media(max-width:699px){
#gbm-np .np-in{padding:0 16px}
#gbm-np .np-top-line{padding-top:10px;font-size:12px;letter-spacing:.06em}
#gbm-np .np-mast{padding:12px 0 10px}
#gbm-np .np-navwrap{flex-wrap:wrap;gap:0;margin-top:16px}
#gbm-np .np-nav{width:100%;flex:1 1 100%}
#gbm-np .np-search{width:100%;padding:8px 0 10px}
#gbm-np .np-search input[type=search]{flex:1;width:auto;min-width:0}
#gbm-np .np-strip{margin:12px -16px 0;padding:9px 16px}
#gbm-np .np-strip time{display:none}
#gbm-np .np-front{padding:20px 0 22px;gap:22px}
#gbm-np .np-lead .np-media{margin-left:-16px;margin-right:-16px}
#gbm-np .np-rail ol{display:block}
#gbm-np .np-rail ol>li:nth-child(2){margin-top:0}
#gbm-np .np-mid{grid-template-columns:minmax(0,1fr);gap:26px;padding:22px 0 26px}
#gbm-np .np-wire li{grid-template-columns:4.6rem minmax(0,1fr);gap:8px}
#gbm-np .np-wt{font-size:20px}
#gbm-np .np-tv{padding:22px 0 26px;gap:20px;min-height:0}
#gbm-np .np-grid{grid-template-columns:minmax(0,1fr);gap:0}
#gbm-np .np-grid>li{padding:14px 0;border-top:1px solid var(--ln)}
#gbm-np .np-grid>li:first-child{border-top:1px solid var(--n)}
#gbm-np .np-card{display:grid;grid-template-columns:116px minmax(0,1fr);gap:4px 14px;align-items:start}
#gbm-np .np-card .np-ci{grid-row:1/4;aspect-ratio:1/1}
#gbm-np .np-card.np-noimg{display:flex}
#gbm-np .np-cn{font-size:21px;-webkit-line-clamp:4}
#gbm-np .np-cx{display:none}
#gbm-np .np-loadmore,#gbm-np .np-older{width:100%}
}
@media(prefers-reduced-motion:reduce){#gbm-np *{transition:none!important}}
`;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function txt(el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
  function feedRoot() { return D.querySelector('[data-hook=feed-page-root]'); }
  function fail(why) {
    try { console.warn('[GatorBait] news wire fell back to the native list:', why); } catch (e) {}
    W.__GBM_NP_FAIL__ = 1;
    if (root && root.parentNode) root.parentNode.removeChild(root);
    var fr = feedRoot(); if (fr) { fr.removeAttribute('inert'); fr.removeAttribute('aria-hidden'); }
    H.classList.remove('gbm-np-pre', 'gbm-np-on');
  }
  // Wix image URLs: whole photo (fit), sized for the slot, webp.
  function size(u, w) {
    if (!u) return '';
    if (u.indexOf('static.wixstatic.com/media/') < 0) return u;
    u = u.replace(/\/v1\/(?:fill|fit)\/[^/]+\//, '/v1/fit/w_' + w + ',h_' + w + ',al_c,q_80/');
    return u.replace(/\/file\.(png|jpe?g)$/i, '/file.webp');
  }
  function srcset(u, ws) { return ws.map(function (w) { return size(u, w) + ' ' + w + 'w'; }).join(', '); }
  function mediaId(u) { var m = (u || '').match(/\/media\/([^/]+)/); return m ? m[1] : u || ''; }

  /* ---------- time (AP style, Eastern) ---------- */
  var AP_MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  var ETF = null;
  function et(ts) {
    try {
      ETF = ETF || new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short' });
      var p = {}; ETF.formatToParts(new Date(ts)).forEach(function (x) { p[x.type] = x.value; });
      var dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
      return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour % 24, n: +p.minute, w: dow };
    } catch (e) { var d = new Date(ts); return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), h: d.getHours(), n: d.getMinutes(), w: d.getDay() }; }
  }
  function dayKey(p) { return p.y * 10000 + p.m * 100 + p.d; }
  function apTime(ts) {
    var p = et(ts);
    if (p.h === 0 && p.n === 0) return 'midnight';
    if (p.h === 12 && p.n === 0) return 'noon';
    var h = p.h % 12 || 12;
    return h + (p.n ? ':' + (p.n < 10 ? '0' : '') + p.n : '') + ' ' + (p.h < 12 ? 'a.m.' : 'p.m.');
  }
  function apDay(p, withYear) { return AP_MONTHS[p.m] + ' ' + p.d + (withYear ? ', ' + p.y : ''); }
  function dayHead(ts) {
    var p = et(ts), n = et(Date.now()), y = et(Date.now() - 864e5);
    if (dayKey(p) === dayKey(n)) return 'Today, ' + DOW[p.w] + ', ' + apDay(p);
    if (dayKey(p) === dayKey(y)) return 'Yesterday, ' + DOW[p.w] + ', ' + apDay(p);
    return DOW[p.w] + ', ' + apDay(p, p.y !== n.y);
  }
  // Short stamp for cards and the wire: a clock time today, otherwise the date.
  function stamp(ts) {
    var p = et(ts), n = et(Date.now());
    if (dayKey(p) === dayKey(n)) return apTime(ts);
    return apDay(p, p.y !== n.y);
  }
  function edition() { var h = et(Date.now()).h; return h < 12 ? 'Morning edition' : h < 17 ? 'Afternoon edition' : 'Evening edition'; }
  function approxTs(t) {
    if (!t) return 0;
    var now = Date.now(), m = t.match(/^(\d+|an?|one)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
    if (m) {
      var n = /^(a|an|one)$/i.test(m[1]) ? 1 : +m[1], u = m[2].toLowerCase();
      return now - n * { second: 1e3, minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5, month: 2592e6, year: 31536e6 }[u];
    }
    if (/^(just now|now)$/i.test(t)) return now;
    if (/^yesterday/i.test(t)) return now - 864e5;
    m = t.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:,?\s+(\d{4}))?/);
    if (m && MONTHS[m[1].toLowerCase()] != null) {
      var y = m[3] ? +m[3] : new Date().getFullYear(), d = new Date(Date.UTC(y, MONTHS[m[1].toLowerCase()], +m[2], 16));
      if (!m[3] && d.getTime() > now + 864e5) d = new Date(Date.UTC(y - 1, MONTHS[m[1].toLowerCase()], +m[2], 16));
      return d.getTime();
    }
    return 0;
  }

  /* ---------- data (same approach as Latest Feed v1) ---------- */
  function canon(u) { try { var a = new URL(u, location.origin); return a.pathname.replace(/\/+$/, ''); } catch (e) { return u; } }
  function parseRss(xml) {
    var doc = new DOMParser().parseFromString(xml, 'text/xml'), out = [];
    var its = doc.getElementsByTagName('item');
    for (var i = 0; i < its.length; i++) {
      var it = its[i], g = function (n) { var e = it.getElementsByTagName(n)[0]; return e ? (e.textContent || '').trim() : ''; };
      var link = g('link'), enc = it.getElementsByTagName('enclosure')[0], cr = it.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0];
      var cats = [], cs = it.getElementsByTagName('category');
      for (var k = 0; k < cs.length; k++) cats.push((cs[k].textContent || '').trim());
      var ts = Date.parse(g('pubDate'));
      if (!link || !ts) continue;
      out.push({ key: canon(link), url: link, title: g('title'), desc: g('description'), img: enc ? enc.getAttribute('url') : '', alt: '', cats: cats, by: cr ? (cr.textContent || '').trim() : '', ts: ts, exact: 1, read: '', ago: '' });
    }
    return out.sort(function (a, b) { return b.ts - a.ts; });
  }
  function nativeItems(scope) {
    var out = [], seen = {}, ws = scope.querySelectorAll('[data-hook=post-list-item]');
    for (var i = 0; i < ws.length; i++) {
      var w = ws[i], t = w.querySelector('[data-hook=post-title]') || w.querySelector('h2,h3');
      var a = (t && t.closest('a')) || w.querySelector('a[href*="/post/"]'), href = a && a.getAttribute('href');
      if (!href) continue;
      var key = canon(href); if (seen[key]) continue; seen[key] = 1;
      var box = w.closest('[data-hook=item-container]') || w.closest('.item-link-wrapper') || w;
      var im = box.querySelector('img[data-hook=gallery-item-image-img]') || box.querySelector('img');
      var src = im ? (im.getAttribute('src') || '') : '';
      var cl = w.querySelector('[data-hook=post-category-label] a');
      var tx = txt(w.querySelector('[data-hook=time-ago]'));
      out.push({ key: key, url: new URL(href, location.origin).href, title: txt(t), desc: '', img: src, alt: im ? (im.getAttribute('alt') || '') : '', cats: cl ? [txt(cl)] : [], catHref: cl ? cl.getAttribute('href') : '', by: txt(w.querySelector('[data-hook=user-name]')), ts: approxTs(tx), exact: 0, read: txt(w.querySelector('[data-hook=time-to-read]')), ago: tx });
    }
    return out;
  }
  var RE_ROOT = /<div[^>]*data-hook="feed-page-root"/, RE_PAG = /<div[^>]*data-hook="(?:feed|category)-pagination-container"/;
  function nativeFromHtml(html) {
    var m = RE_ROOT.exec(html);
    if (!m) return [];
    var rest = html.slice(m.index), e = RE_PAG.exec(rest);
    return nativeItems(new DOMParser().parseFromString(rest.slice(0, e ? e.index : 900000), 'text/html'));
  }
  function merge(list, extra) {
    var by = {}; list.forEach(function (x) { by[x.key] = x; });
    extra.forEach(function (n) {
      var x = by[n.key];
      if (x) {
        if (!x.read && n.read) x.read = n.read;
        if (n.alt && (!x.alt || /^featured image for/i.test(x.alt))) x.alt = n.alt;
        if (!x.img && n.img) x.img = n.img;
        if (!x.cats.length && n.cats.length) x.cats = n.cats;
        if (!x.by && n.by) x.by = n.by;
      } else { list.push(n); by[n.key] = n; }
    });
    return list;
  }
  function order(list) {
    var prev = Infinity;
    list.forEach(function (x, i) {
      x.i = i;
      if (!x.exact) { var t = x.ts || (prev === Infinity ? Date.now() : prev); x.ts = Math.min(t, prev); }
      if (x.ts < prev) prev = x.ts;
    });
    return list.sort(function (a, b) { return b.ts - a.ts || a.i - b.i; });
  }

  /* ---------- render helpers ---------- */
  function tagsFor(x) {
    var names = (x.cats || []).filter(function (c) { return !/^(featured article|archive \d{4})$/i.test(c); });
    names.sort(function (a, b) { var ia = TAG_ORDER.indexOf(a), ib = TAG_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    return names.slice(0, 2).map(function (n) { var c = CAT_BY_NAME[n.toLowerCase()]; return c ? c[1] : n.replace(/\s+-\s+Blogs?$/i, ''); });
  }
  function secOf(x) { return tagsFor(x)[0] || 'GatorBait'; }
  function when(x) { return x.exact ? stamp(x.ts) : x.ago; }
  function timeEl(x) { return when(x) ? '<time' + (x.exact ? ' datetime="' + new Date(x.ts).toISOString() + '"' : '') + '>' + esc(when(x)) + '</time>' : ''; }
  function byHtml(x, lead) {
    var w = timeEl(x);
    return '<div class="' + (lead ? 'np-by' : 'np-meta') + '">' + (x.by ? '<span>By <b>' + esc(x.by) + '</b></span>' : '') + (w ? '<span>' + w + '</span>' : '') + (lead && x.read ? '<span>' + esc(x.read.replace(/\s*read$/i, ' read')) + '</span>' : '') + '</div>';
  }
  function altFor(x) {
    var a = (x.alt || '').trim();
    if (!a || /^featured image for/i.test(a)) a = x.title + ' (photo: GatorBait Media)';
    return a;
  }
  function clip(s, n) {
    s = (s || '').replace(/\s+/g, ' ').trim();
    if (s.length <= n) return s;
    var c = s.slice(0, n); c = c.slice(0, Math.max(c.lastIndexOf(' '), n * .6)); return c.replace(/[\s,;:.\-–—]+$/, '') + '…';
  }
  function leadHtml(x) {
    var big = x.img ? '<span class="np-media">' + '<i class="np-bg" style="background-image:url(' + esc(size(x.img, 480)) + ')"></i><img alt="' + esc(altFor(x)) + '" src="' + esc(size(x.img, 1280)) + '" srcset="' + esc(srcset(x.img, [640, 960, 1280, 1600])) + '" sizes="(min-width:1100px) 62vw,100vw" fetchpriority="high" decoding="async"></span>' : '';
    return '<article class="np-lead"><span class="np-sec">' + esc(secOf(x)) + '</span><h2 class="np-lt"><a class="np-h" href="' + esc(x.url) + '">' + esc(x.title) + '</a></h2>' +
      (x.desc ? '<p class="np-dek">' + esc(x.desc) + '</p>' : '') + byHtml(x, 1) + (big ? '<a class="np-mediaa" href="' + esc(x.url) + '" tabindex="-1" aria-hidden="true" style="display:block">' + big + '</a>' : '') + '</article>';
  }
  function topHtml(items) {
    return '<aside class="np-rail" aria-labelledby="np-top-h"><h2 class="np-rail-h" id="np-top-h">Top Stories<span>Newest first</span></h2><ol>' + items.map(function (x, i) {
      return '<li><span class="np-num" aria-hidden="true">' + (i + 1) + '</span><div><a class="np-rt np-h" href="' + esc(x.url) + '">' + esc(x.title) + '</a><div class="np-meta"><span class="np-s">' + esc(secOf(x)) + '</span>' + (x.by ? '<span>By <b>' + esc(x.by) + '</b></span>' : '') + (when(x) ? '<span>' + timeEl(x) + '</span>' : '') + '</div></div></li>';
    }).join('') + '</ol></aside>';
  }
  function wireHtml(items) {
    var groups = [], cur = null;
    items.forEach(function (x) {
      var d = x.exact ? dayHead(x.ts) : '';
      if (!cur || cur.d !== d) { cur = { d: d, rows: [] }; groups.push(cur); }
      cur.rows.push('<li><span>' + (x.exact ? '<time class="np-wtime" datetime="' + new Date(x.ts).toISOString() + '">' + esc(apTime(x.ts)) + '</time>' : '<span class="np-wtime">' + esc(x.ago) + '</span>') + '</span><div><a class="np-wt np-h" href="' + esc(x.url) + '">' + esc(x.title) + '</a><div class="np-meta"><span class="np-s">' + esc(secOf(x)) + '</span>' + (x.by ? '<span>By <b>' + esc(x.by) + '</b></span>' : '') + '</div></div></li>');
    });
    return '<section class="np-wire" aria-labelledby="np-wire-h"><h2 class="np-sh" id="np-wire-h">Latest<span>Live wire &middot; times ET</span></h2>' + groups.map(function (g) { return (g.d ? '<div class="np-day">' + esc(g.d) + '</div>' : '') + '<ul>' + g.rows.join('') + '</ul>'; }).join('') + '</section>';
  }
  function colHtml(x, kicker) {
    return '<article class="np-col"><div class="np-ck">' + esc(kicker) + '</div><a class="np-ct np-h" href="' + esc(x.url) + '">' + esc(x.title) + '</a>' + (x.desc ? '<p class="np-cd">' + esc(clip(x.desc, 230)) + '</p>' : '') + '<a class="np-go" href="' + esc(x.url) + '">Read the column &rarr;</a><div class="np-meta"><span>By <b>' + esc(x.by) + '</b></span><span>' + timeEl(x) + '</span></div></article>';
  }
  function cardHtml(x, noImg) {
    var im = x.img && !noImg ? '<span class="np-ci"><img alt="' + esc(altFor(x)) + '" src="' + esc(size(x.img, 480)) + '" srcset="' + esc(srcset(x.img, [320, 480, 640])) + '" sizes="(min-width:1100px) 22vw,(min-width:700px) 30vw,116px" loading="lazy" decoding="async"></span>' : '';
    return '<li><a class="np-card' + (im ? '' : ' np-noimg') + '" href="' + esc(x.url) + '">' + im + '<span class="np-cs">' + esc(secOf(x)) + '</span><span class="np-cn np-h">' + esc(x.title) + '</span>' + (x.desc ? '<span class="np-cx">' + esc(x.desc) + '</span>' : '') + byHtml(x) + '</a></li>';
  }
  function pageTitle() {
    if (catSlug) {
      var c = CAT_BY_SLUG[catSlug];
      if (c) return c[1];
      var n = D.querySelector('[data-hook="header-navigation__/categories/' + catSlug + '"]');
      return txt(n) || catSlug.replace(/-/g, ' ');
    }
    var tg = base.match(/\/tags\/([^/]+)/);
    if (tg) { var dt = (D.title || '').split('|')[0].trim(); return dt && !/gatorbait/i.test(dt) ? dt : decodeURIComponent(tg[1]).replace(/-+$/, '').replace(/-/g, ' '); }
    return 'Latest Florida Gators News';
  }
  function navHtml() {
    var h = '<a href="' + ROOT_PATH + '"' + (base === ROOT_PATH ? ' aria-current="page"' : '') + '>All news</a>';
    CATS.forEach(function (c, i) {
      h += '<a' + (c[3] === 2 && CATS[i - 1][3] === 1 ? ' class="np-gap"' : '') + ' href="' + ROOT_PATH + '/categories/' + c[2] + '"' + (catSlug === c[2] ? ' aria-current="page"' : '') + '>' + esc(c[1]) + '</a>';
    });
    return h;
  }
  function pagerHtml() {
    if (isRoot) return '';
    var lastEl = D.querySelector('a[data-hook="pagination__last"]'), lm = lastEl && (lastEl.getAttribute('href') || '').match(/\/page\/(\d+)/), total = lm ? +lm[1] : 0;
    var h = function (n) { return n <= 1 ? base : base + '/page/' + n; }, out = '<nav class="np-pg" aria-label="More pages">';
    if (pageNo > 1) out += '<a href="' + h(pageNo - 1) + '">&larr; Newer</a>';
    for (var n = Math.max(1, pageNo - 2); n <= pageNo + 2 && (!total || n <= total); n++) out += '<a href="' + h(n) + '"' + (n === pageNo ? ' aria-current="page"' : '') + '>' + n + '</a>';
    out += '<a href="' + h(pageNo + 1) + '">Older &rarr;</a></nav>';
    return out;
  }
  function canFetch() { return !exhausted && state.items.length < CAP; }
  function footHtml() {
    var s = state, shown = Math.min(s.shown, s.items.length);
    var h = '<div class="np-status" role="status" aria-live="polite" id="np-status">' + shown + ' stories shown, newest first</div>';
    if (pageNo > 1) return h + pagerHtml();
    if (s.shown < s.items.length || canFetch()) h += '<button type="button" class="np-loadmore" id="np-more">Load more stories</button>';
    else if (!exhausted || failed) h += '<a class="np-older" href="' + base + '/page/' + (lastPage + 1) + '">Older stories &rarr;</a>';
    return h;
  }
  function pick(rest, test) { for (var i = 0; i < rest.length; i++) if (test(rest[i])) return i; return -1; }
  function videoHtml() {
    if (!videos || !videos.length) return '';
    var v = videos[0], rest = videos.slice(1, 4);
    var url = function (x) { return 'https://www.youtube.com/watch?v=' + encodeURIComponent(x.id); };
    var th = function (x) { return 'https://i.ytimg.com/vi/' + encodeURIComponent(x.id) + '/hqdefault.jpg'; };
    var dt = function (x) { var ts = Date.parse(x.published); return ts ? apDay(et(ts), et(ts).y !== et(Date.now()).y) : ''; };
    var nm = function (x) { return String(x.title || '').replace(/\s*\|\s*The Buddy Martin Show\s*$/i, ''); };
    return '<div><h2 class="np-sh">GatorBait TV<span>The Buddy Martin Show</span></h2><a class="np-vid" href="' + url(v) + '" aria-label="Watch: ' + esc(nm(v)) + '"><img alt="" src="' + th(v) + '" loading="lazy" decoding="async"><span class="np-play" aria-hidden="true"></span></a><h3 class="np-vt"><a class="np-h" href="' + url(v) + '">' + esc(nm(v)) + '</a></h3><div class="np-meta"><span>' + esc(dt(v)) + '</span><span>YouTube</span></div></div>' +
      '<div><h2 class="np-sh">More episodes<span>Watch</span></h2><ul class="np-vl">' + rest.map(function (x) { return '<li><a class="np-vid" href="' + url(x) + '" tabindex="-1" aria-hidden="true"><img alt="" src="' + th(x) + '" loading="lazy" decoding="async"></a><div><a class="np-vt2 np-h" href="' + url(x) + '">' + esc(nm(x)) + '</a><div class="np-meta"><span>' + esc(dt(x)) + '</span></div></div></li>'; }).join('') + '</ul></div>';
  }
  function layout() {
    var it = state.items, L = { lead: null, top: [], cols: [], colItems: [], wire: [], grid: [] };
    if (pageNo > 1 || it.length < 4) { L.grid = it.slice(0); return L; }
    L.lead = it[0]; L.top = it.slice(1, 1 + TOP_N);
    var rest = it.slice(1 + TOP_N), used = {};
    if (isRoot) {
      var fi = pick(rest, function (x) { return x.by === 'Franz Beard' && tagsFor(x).indexOf('Thoughts of the Day') >= 0; });
      if (fi < 0) fi = pick(rest, function (x) { return x.by === 'Franz Beard'; });
      var bi = pick(rest, function (x) { return x.by === 'Buddy Martin'; });
      if (fi >= 0) { used[fi] = 1; L.colItems.push(rest[fi]); L.cols.push(colHtml(rest[fi], tagsFor(rest[fi]).indexOf('Thoughts of the Day') >= 0 ? 'Column · Thoughts of the Day' : 'Column · Franz Beard')); }
      if (bi >= 0) { used[bi] = 1; L.colItems.push(rest[bi]); L.cols.push(colHtml(rest[bi], 'Column · Buddy Martin')); }
    }
    rest = rest.filter(function (x, i) { return !used[i]; });
    L.wire = rest.slice(0, WIRE_N); L.grid = rest.slice(WIRE_N);
    return L;
  }
  // After Load more: keep the lead, rail, wire and columns exactly as painted; only the grid tail grows (older stories).
  function regrid(L) {
    if (!L || !L.lead) return layout();
    var used = {}; [L.lead].concat(L.top, L.wire, L.colItems).forEach(function (x) { used[x.key] = 1; });
    L.grid = state.items.filter(function (x) { return !used[x.key]; });
    return L;
  }
  function gridItems(L) { return L.grid.slice(0, Math.max(0, state.shown - (state.items.length - L.grid.length))); }
  function render() {
    var now = Date.now(), p = et(now), L = layout(), it = state.items;
    seenImg = {}; if (L.lead) dupImg(L.lead);
    var newest = it.length ? it[0] : null;
    var h = '<div class="np-in"><div class="np-top-line"><span><b>' + esc(DOW[p.w] + ', ' + apDay(p, true)) + '</b></span><span>' + esc(edition()) + (newest && newest.exact ? ' &middot; Newest story ' + esc(apTime(newest.ts)) + ' ET' : '') + '</span></div>' +
      '<header class="np-mast"><span class="np-kick">GatorBait Media &middot; ' + (catSlug ? 'Section' : 'The Wire') + '</span><h2 class="np-title">' + esc(pageTitle()) + '</h2><span class="np-tag">Independent Florida Gators coverage</span></header>' +
      '<div class="np-navwrap"><nav class="np-nav" aria-label="Browse by writer or section">' + navHtml() + '</nav><form class="np-search" role="search" action="https://www.google.com/search" method="get"><label class="np-sr" for="np-q">Search the GatorBait archive</label><input id="np-q" name="q" type="search" placeholder="Search the archive" required><input type="hidden" name="as_sitesearch" value="gatorbaitmedia.com"><button type="submit">Search</button></form></div>';
    if (!it.length) h += '<p class="np-empty">No stories here yet.</p>';
    else {
      if (L.lead) {
        var brk = L.lead.exact && tagsFor(L.lead).indexOf('Breaking News') >= 0 && now - L.lead.ts < 6 * 36e5;
        h += '<div class="np-strip"><b>' + (brk ? 'Breaking' : 'Just in') + '</b><a href="' + esc(L.lead.url) + '">' + esc(L.lead.title) + '</a>' + (L.lead.exact ? '<time datetime="' + new Date(L.lead.ts).toISOString() + '">' + esc(stamp(L.lead.ts) + (/[ap]\.m\.|noon|midnight/.test(stamp(L.lead.ts)) ? ' ET' : '')) + '</time>' : '') + '</div>';
        h += '<div class="np-front">' + leadHtml(L.lead) + topHtml(L.top) + '</div>';
        h += '<div class="np-mid' + (L.cols.length === 2 ? '' : L.cols.length ? ' np-c1' : ' np-solo') + '">' + wireHtml(L.wire) + L.cols.join('') + '</div>';
        if (isRoot) h += '<div class="np-tv" id="np-tv"' + (videos && videos.length ? '' : ' hidden') + '>' + videoHtml() + '</div>';
      }
      var gi = gridItems(L);
      h += '<section class="np-more" aria-labelledby="np-more-h"><h2 class="np-sh" id="np-more-h">' + (L.lead ? 'More stories' : 'Stories') + '<span>Newest first</span></h2><ul class="np-grid" id="np-grid">' + gi.map(function (x) { return cardHtml(x, dupImg(x)); }).join('') + '</ul></section>';
      state.gridCount = gi.length; state.L = L;
    }
    h += '<div class="np-foot" id="np-foot">' + footHtml() + '</div></div>';
    root.innerHTML = h;
    var btn = root.querySelector('#np-more'); if (btn) btn.addEventListener('click', loadMore);
  }
  // One photo, one story on the visible page: a repeated media asset drops its image on the later card.
  var seenImg = {};
  function dupImg(x) {
    var id = mediaId(x.img); if (!id) return false;
    if (seenImg[id] && seenImg[id] !== x.key) return true;
    seenImg[id] = x.key; return false;
  }
  function appendGrid() {
    var grid = root.querySelector('#np-grid'), L = state.L; if (!grid || !L) return;
    var gi = gridItems(L), from = state.gridCount || 0;
    var tmp = D.createElement('ul'); tmp.innerHTML = gi.slice(from).map(function (x) { return cardHtml(x, dupImg(x)); }).join('');
    var firstNew = tmp.firstElementChild;
    while (tmp.firstChild) grid.appendChild(tmp.firstChild);
    state.gridCount = gi.length;
    return firstNew;
  }
  function refreshFoot() {
    var f = root.querySelector('#np-foot'); if (!f) return;
    f.innerHTML = footHtml();
    var btn = f.querySelector('#np-more'); if (btn) btn.addEventListener('click', loadMore);
  }
  function loadMore() {
    if (loading) return;
    var s = state, from = s.shown, btn = root.querySelector('#np-more');
    var go = function () {
      loading = false;
      s.items = order(s.items);
      s.L = regrid(s.L);
      s.shown = Math.min(s.items.length, from + STEP);
      var added = appendGrid(), a = added && added.querySelector('a');
      refreshFoot();
      if (a) { try { a.focus({ preventScroll: true }); } catch (e) { a.focus(); } }
    };
    if (s.items.length > from) return go();
    loading = true; if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
    (function pull() { if (s.items.length > from || !canFetch()) return go(); fetchPage(nextPage++, function (got) { if (got) lastPage = nextPage - 1; pull(); }); })();
  }
  function fetchPage(p, cb, quiet) {
    var u = base + '/page/' + p + '?gbmnp=' + Date.now();
    fetch(u, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      if (!r.body || !r.body.getReader || !W.TextDecoder) return r.text();
      var rd = r.body.getReader(), dec = new TextDecoder(), buf = '';
      return (function pump() {
        return rd.read().then(function (c) {
          if (c.done) return buf;
          buf += dec.decode(c.value, { stream: true });
          var m = RE_ROOT.exec(buf);
          if ((m && RE_PAG.test(buf.slice(m.index))) || buf.length > 1800000) { try { rd.cancel(); } catch (e) {} return buf; }
          return pump();
        });
      })();
    }).then(function (t) {
      var got = nativeFromHtml(t);
      if (quiet) { var by = {}; state.items.forEach(function (x) { by[x.key] = x; }); got.forEach(function (x) { var y = by[x.key]; if (!y) return; if (x.read) y.read = x.read; if (x.alt) y.alt = x.alt; }); return cb(got.length); }
      if (!got.length) exhausted = true;
      state.items = merge(state.items, got);
      cb(got.length);
    }).catch(function () { if (!quiet) { exhausted = true; failed = true; } cb(0); });
  }

  /* ---------- mount ---------- */
  function place() {
    var fr = feedRoot(); if (!fr || !fr.parentNode) return false;
    if (!root) { root = D.createElement('section'); root.id = 'gbm-np'; root.setAttribute('aria-label', 'Latest stories'); }
    if (root.parentNode !== fr.parentNode || root.nextSibling !== fr) fr.parentNode.insertBefore(root, fr);
    if (!fr.hasAttribute('inert')) { fr.setAttribute('inert', ''); fr.setAttribute('aria-hidden', 'true'); }
    return true;
  }
  function setVw() { var w = H.clientWidth; if (w > 300) H.style.setProperty('--np-vw', w + 'px'); }
  function fonts() {
    if (!D.fonts || !D.fonts.load) return Promise.resolve();
    var f = ['800 24px "Barlow Condensed"', '700 24px "Barlow Condensed"', '400 16px Barlow', '600 14px Barlow', '700 14px Barlow'].map(function (s) { return D.fonts.load(s).catch(function () {}); });
    return Promise.race([Promise.all(f), new Promise(function (r) { setTimeout(r, 900); })]);
  }
  function waitNative(cb, ms) {
    var t0 = Date.now();
    (function tick() {
      var fr = feedRoot(), n = fr ? nativeItems(fr) : [];
      if (n.length || Date.now() - t0 > ms) return cb(n);
      setTimeout(tick, 60);
    })();
  }
  function getRss() {
    var p = W.__GBM_NP_RSS__ || fetch('/blog-feed.xml?gbmnp=' + Date.now(), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
    return p.then(function (x) { return typeof x === 'string' ? x : x.text(); });
  }
  function start() {
    var st = D.createElement('style'); st.id = 'gbm-np-style'; st.textContent = CSS.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*/g, '');
    if (!D.getElementById('gbm-np-style')) (D.head || H).appendChild(st);
    var rss = getRss().then(parseRss).catch(function () { return []; });
    var tasks = [fonts(), new Promise(function (r) { waitNative(r, 2000); }), rss];
    Promise.all(tasks).then(function (res) {
      if (W.__GBM_NP_FAIL__) return;
      var nat = res[1], feed = res[2], items;
      if (isRoot) {
        if (!feed.length) return fail('empty feed');
        items = merge(feed, nat.filter(function (n) { return feed.some(function (x) { return x.key === n.key; }); }));
      } else {
        if (!nat.length) return fail('no native items');
        var by = {}; feed.forEach(function (x) { by[x.key] = x; });
        nat.forEach(function (n) { var x = by[n.key]; if (x) { n.ts = x.ts; n.exact = 1; n.desc = x.desc; n.img = x.img || n.img; n.cats = n.cats.length ? n.cats.concat(x.cats.filter(function (c) { return n.cats.indexOf(c) < 0; })) : x.cats; n.by = x.by || n.by; } });
        items = nat;
      }
      PS = Math.max(1, nat.length);
      nextPage = isRoot ? Math.floor(items.length / PS) + 1 : 2;
      lastPage = nextPage - 1;
      if (!isRoot && !D.querySelector('a[data-hook="pagination__next"]')) exhausted = true;
      state = { items: order(items), shown: pageNo > 1 ? 999 : FIRST };
      if (!place()) return fail('no mount point');
      setVw();
      render();
      H.classList.add('gbm-np-on'); H.classList.remove('gbm-np-pre');
      W.__GBM_NP_OK__ = 1;
      afterMount();
    }).catch(function (e) { fail(e && e.message || e); });
  }
  function loadVideos() {
    if (!isRoot) return;
    var done = false, t = setTimeout(function () { done = true; }, 4000);
    fetch(VIDEOS, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      clearTimeout(t); if (done || !root || !root.isConnected) return;
      videos = (j.videos || []).filter(function (v) { return v && v.id; }).sort(function (a, b) { return Date.parse(b.published) - Date.parse(a.published); });
      var box = root.querySelector('#np-tv'); if (!box || !videos.length) return;
      box.innerHTML = videoHtml(); box.removeAttribute('hidden');
    }).catch(function () {});
  }
  function afterMount() {
    var mo = null, t0 = Date.now();
    if (W.MutationObserver && D.body) {
      mo = new MutationObserver(function () {
        if (Date.now() - t0 > 14000) return mo.disconnect();
        if (root && (!root.isConnected || root.nextSibling !== feedRoot())) place();
      });
      mo.observe(D.body, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 14000);
    }
    var rz = 0; W.addEventListener('resize', function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(setVw); });
    loadVideos();
    var c = navigator.connection || {};
    if (isRoot && !c.saveData && !/^(slow-2g|2g|3g)$/.test(c.effectiveType || '')) {
      var last = Math.ceil(Math.min(20, state.items.length) / PS), p = 2;
      var step = function () {
        if (p > last || !root || !root.isConnected) return;
        fetchPage(p++, function () { patchMeta(); step(); }, 1);
      };
      (W.requestIdleCallback || function (f) { setTimeout(f, 2500); })(step, { timeout: 4000 });
    }
  }
  function patchMeta() {
    if (!root) return;
    var by = {}; state.items.forEach(function (x) { by[x.key] = x; });
    var as = root.querySelectorAll('a.np-card,a.np-mediaa,a.np-rt,a.np-wt');
    for (var i = 0; i < as.length; i++) {
      var x = by[canon(as[i].getAttribute('href'))]; if (!x) continue;
      var im = as[i].querySelector('img');
      if (im && x.alt && !/^featured image for/i.test(x.alt)) im.setAttribute('alt', x.alt);
    }
  }
  // Any link into the feed gets a full page load so the first-paint guard and this build always run.
  D.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || !FEED.test(u.pathname) || (u.pathname === location.pathname && !u.search)) return;
    if (!root || !root.contains(a)) return;
    e.preventDefault(); e.stopPropagation(); location.assign(u.href);
  }, true);
  start();
}
