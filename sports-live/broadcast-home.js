/* GatorBait Broadcast homepage skin (Broadcast rollout S1, Oct. 17, 2026).
 * Loaded on / only by embed 0c13f955 (deploy/broadcast-2026/0c13f955/). Styles the Gazette homepage root
 * #gbm-live.gbm-gazette and adds the ticker, scoreboard, slashed lead and next-up bar from data already on the page:
 * the rendered stories, the Up next card and window.__GBM_GAMEDAY__ (read only; owned by the game-day desk).
 * Design: docs/design/lookbook/ (Broadcast) and docs/design/NETWORK-DESIGN-SYSTEM.md. */
(function(){
'use strict';if(window.__GBM_BC_HOME__)return;window.__GBM_BC_HOME__=1;
var R='#gbm-live.gbm-gazette.gbm-sports-home';
var C="html:has(@) body{background:#061247!important}"+
"@{--o:#fa4616;--nt:#040c30;--tx:#e8edff;--mu:#aebcff;--pk:#ffb39a;--dc:'Barlow Condensed','Barlow',Arial,sans-serif;background:linear-gradient(180deg,#0021a5 0,#0a1a6b 520px,#061247 100%)!important;color:var(--tx)!important}"+
"@ h1,@ h2,@ h3,@ .bc-d{font-family:var(--dc)!important;letter-spacing:0!important;text-transform:uppercase;color:#fff}"+
"@ a{color:inherit}@ a:focus-visible{outline:3px solid #f2b632!important;outline-offset:3px}"+
"@ .sh-meta{color:var(--mu)!important;font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:11px}"+
"@ .sh-kicker{color:var(--pk)!important;letter-spacing:.14em}"+
/* ticker */
"@ .bc-tk{display:flex;height:44px;background:var(--nt);border-bottom:1px solid #ffffff17;overflow:hidden}"+
"@ .bc-bug{flex:none;display:flex;align-items:center;padding:0 24px 0 18px;background:var(--o);color:#08132f;font:800 19px/1 var(--dc);letter-spacing:.06em;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}"+
"@ .bc-tw{flex:1;min-width:0;overflow:hidden}@ .bc-trk{display:flex;width:max-content;animation:bctk 80s linear infinite}"+
"@ .bc-tk:hover .bc-trk,@ .bc-tk:focus-within .bc-trk{animation-play-state:paused}"+
"@ .bc-trk a{display:flex;align-items:center;min-height:44px;padding:0 22px;border-right:1px solid #ffffff24;font:600 16px/1 var(--dc);letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;text-decoration:none;color:#fff}"+
"@ .bc-trk a b{color:var(--pk);font-weight:800;margin-right:8px}@ .bc-trk a:hover{color:var(--pk)}"+
"@keyframes bctk{to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){@ .bc-trk{animation:none}@ .bc-tw{overflow-x:auto}}"+
/* masthead */
"@ .sh-header{max-width:1240px;display:flex;align-items:center;gap:28px;min-height:84px;border-bottom:1px solid #ffffff1a}"+
"@ .sh-brand{display:contents}@ .sh-brand p{display:none}@ .sh-brand>a:first-child{display:flex;align-items:center;min-height:44px}@ .sh-brand>a:first-child img{display:none}"+
"@ .bc-wm{display:flex;align-items:baseline;font:italic 900 40px/1 var(--dc);text-transform:uppercase;color:#fff;white-space:nowrap}@ .bc-wm b{color:var(--o);font-weight:900}"+
"@ .bc-wm small{font:700 10px/1 Barlow,sans-serif;letter-spacing:.3em;color:var(--mu);margin-left:4px}"+
"@ .sh-header nav{order:1;margin-left:auto;border:0!important;min-height:0;gap:2px 16px;justify-content:flex-end}"+
"@ .sh-header nav a{display:flex;align-items:center;min-height:44px;padding:0!important;font:700 16px/1 var(--dc)!important;letter-spacing:.05em!important;text-transform:uppercase;color:#fff!important}"+
"@ .sh-header nav [aria-current]{color:var(--pk)!important;box-shadow:inset 0 -3px 0 var(--o)}"+
"@ .sh-join{order:2;margin:0!important;display:inline-flex!important;align-items:center;min-height:46px;padding:0 24px!important;background:var(--o)!important;color:#08132f!important;font:800 18px/1 var(--dc)!important;letter-spacing:.04em;text-transform:uppercase;transform:skewX(-10deg);white-space:nowrap}"+
"@ .sh-join>span{display:inline-block;transform:skewX(10deg)}"+
"@ main{max-width:1240px}@ .sh-front{border:0!important}"+
/* hero: scoreboard + slashed lead */
"@ .bc-hero{display:grid;grid-template-columns:400px minmax(0,1fr);margin:0 -28px;position:relative;min-height:540px}"+
"@ .bc-hero.bc-solo{grid-template-columns:1fr}"+
"@ .bc-sc{padding:34px 0 30px 28px;display:grid;align-content:start;gap:12px;position:relative;z-index:2}"+
"@ .bc-lbl{display:flex;align-items:center;gap:10px;margin:0;font:800 18px/1.2 var(--dc);letter-spacing:.14em;text-transform:uppercase}"+
"@ .bc-lbl i{width:10px;height:10px;background:var(--o);transform:skewX(-14deg)}@ .bc-lbl span{color:var(--mu);font-weight:600;letter-spacing:.06em;font-size:15px}"+
"@ .bc-tm{display:grid;grid-template-columns:52px minmax(0,1fr) auto;align-items:center;gap:12px;background:#ffffff0f;padding:9px 18px 9px 9px;clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);position:relative}"+
"@ .bc-tm.bc-w{background:#ffffff1f}@ .bc-tm.bc-w:before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--o)}"+
"@ .bc-ab{display:grid;place-items:center;height:52px;background:#fff;color:#0021a5;font:900 21px/1 var(--dc);clip-path:polygon(0 0,100% 0,86% 100%,0 100%)}"+
"@ .bc-nm{font:800 28px/1 var(--dc);text-transform:uppercase;min-width:0;overflow-wrap:anywhere}@ .bc-nm small{display:block;margin-top:4px;font:600 12px/1.2 Barlow,sans-serif;letter-spacing:.14em;color:var(--mu)}"+
"@ .bc-pt{font:900 64px/.8 var(--dc);font-variant-numeric:tabular-nums}@ .bc-tm:not(.bc-w) .bc-pt{color:var(--mu)}"+
"@ .bc-go{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 0}"+
"@ .bc-go a,@ .bc-nx .bc-lk{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:2px solid #ffffff59;font:800 16px/1 var(--dc);letter-spacing:.08em;text-transform:uppercase;text-decoration:none}"+
"@ .bc-go a.bc-o{background:var(--o);border-color:var(--o);color:#08132f}"+
"@ .bc-hero .sh-lead{margin:0!important;min-height:540px;background:var(--nt)!important;clip-path:polygon(90px 0,100% 0,100% 100%,0 100%);border:0!important}"+
"@ .bc-hero.bc-solo .sh-lead{clip-path:none}"+
"@ .bc-hero .sh-lead figure,@ .bc-hero .sh-lead figure>a{position:absolute!important;inset:0;height:100%}"+
"@ .bc-hero .sh-lead img{position:absolute;inset:0;width:100%!important;height:100%!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:60% 35%}"+
"@ .bc-hero .sh-lead figcaption{position:absolute;right:16px;top:12px;z-index:3;color:#dfe5ff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;text-shadow:0 1px 6px #000}"+
"@ .bc-hero .sh-lead:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,#040c30d9 0,#040c3059 45%,#040c3000 72%),linear-gradient(0deg,#040c30f2 0,#040c3099 38%,#040c3000 66%)}"+
"@ .bc-hero .sh-lead-copy{position:absolute!important;left:120px!important;right:44px!important;bottom:34px!important;top:auto!important;z-index:2;padding:0!important;background:none!important;display:grid;gap:12px;max-width:820px}"+
"@ .bc-hero.bc-solo .sh-lead-copy{left:44px!important}"+
"@ .bc-hero .sh-lead-copy>*{margin:0!important}"+
"@ .bc-hero .sh-kicker{justify-self:start;background:var(--o);color:#08132f!important;font:800 15px/1 var(--dc)!important;letter-spacing:.1em;padding:8px 18px 8px 12px;clip-path:polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%)}"+
"@ .bc-hero h1{font:italic 800 clamp(40px,4.4vw,64px)/.92 var(--dc)!important;text-shadow:0 4px 30px #00000080;max-width:780px}"+
"@ .bc-hero .sh-deck{color:#dfe5ff!important;font-size:18px!important;line-height:1.4!important;max-width:640px}"+
"@ .bc-hero .sh-read{justify-self:start;display:inline-flex;align-items:center;min-height:44px;padding:0 18px;background:var(--o);color:#08132f!important;font:800 16px/1 var(--dc)!important;letter-spacing:.08em;text-transform:uppercase}"+
"@ .bc-slash{position:absolute;left:400px;top:0;bottom:0;width:90px;z-index:3;pointer-events:none;background:linear-gradient(115deg,transparent 0 44%,var(--o) 44% 56%,transparent 56%)}"+
/* next up */
"@ .bc-nx{display:grid;grid-template-columns:190px minmax(0,1fr) auto;min-height:112px;margin:0 -28px;background:#fff;color:#0a1a6b}"+
"@ .bc-tag{display:grid;place-items:center;background:var(--o);color:#fff;font:900 30px/1 var(--dc);letter-spacing:.06em;text-transform:uppercase;clip-path:polygon(0 0,100% 0,calc(100% - 26px) 100%,0 100%)}"+
"@ .bc-mu{display:flex;align-items:center;flex-wrap:wrap;gap:6px 24px;padding:12px 24px 12px 32px;min-width:0}"+
"@ .bc-mu .bc-t{font:900 46px/1 var(--dc);text-transform:uppercase;color:#0a1a6b}@ .bc-mu .bc-t small{display:block;font:700 14px/1.2 var(--dc);letter-spacing:.2em;color:#4a5a9c}"+
"@ .bc-mu .bc-at{font:700 22px/1 var(--dc);letter-spacing:.2em;color:#c2380c}"+
"@ .bc-when{margin-left:auto;text-align:right;font:600 15px/1.4 Barlow,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#33427e}@ .bc-when b{display:block;font:800 24px/1.1 var(--dc);color:#0a1a6b}"+
"@ .bc-nx .bc-lk{border-color:#0a1a6b;color:#0a1a6b;margin-top:6px;font-size:14px;min-height:44px}"+
"@ .bc-cd{display:flex;align-items:center;gap:10px;padding:0 26px 0 44px;background:#0021a5;color:#fff;clip-path:polygon(26px 0,100% 0,100% 100%,0 100%)}"+
"@ .bc-cd div{display:grid;justify-items:center;gap:3px}@ .bc-cd b{min-width:70px;padding:6px 8px 2px;background:#041160;border-bottom:3px solid var(--o);text-align:center;font:900 52px/.9 var(--dc);font-variant-numeric:tabular-nums}"+
"@ .bc-cd small{font:700 11px/1 Barlow,sans-serif;letter-spacing:.2em;color:var(--mu);text-transform:uppercase}"+
/* rundown + side */
"@ .sh-front{grid-template-columns:minmax(0,1fr) 400px!important;gap:0!important;padding-top:0!important;margin:0 -28px}"+
"@ .sh-latest{order:-1;padding:34px 40px 30px 28px!important;border:0!important}@ .sh-feature{background:var(--nt);padding:34px 28px 30px;position:relative}"+
"@ .sh-feature:before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--o),transparent)}"+
"@ .sh-section-title{display:flex;align-items:center;gap:14px;border:0!important;padding:0!important;margin:0 0 14px!important;font:900 26px/1 var(--dc)!important;letter-spacing:.06em!important;text-transform:uppercase;color:#fff}"+
"@ .sh-section-title:after{content:'';flex:1;height:3px;background:linear-gradient(90deg,var(--o) 0 120px,#ffffff26 120px);box-shadow:0 0 12px #ff6a2b66}"+
"@ .sh-latest-grid{counter-reset:bc;display:grid!important;grid-template-columns:1fr!important;gap:0!important}"+
"@ .sh-wire-item{counter-increment:bc;display:grid;grid-template-columns:84px minmax(0,1fr);align-items:center;gap:16px;padding:14px 0!important;border:0!important;border-top:1px solid #ffffff1f!important}"+
"@ .sh-wire-item:first-child{border-top:0!important}"+
"@ .sh-wire-item:before{content:counter(bc,decimal-leading-zero);font:italic 900 60px/.8 var(--dc);color:var(--o);letter-spacing:-.03em;font-variant-numeric:tabular-nums}"+
"@ .sh-wire-item img{display:none!important}@ .sh-wire-item h3{font:700 27px/1 var(--dc)!important;margin:0 0 6px}"+
"@ .sh-wire-item a:hover h3,@ .sh-support a:hover h2,@ .sh-coverage a:hover h2{color:var(--pk)}"+
"@ .sh-more{display:inline-flex!important;align-items:center;min-height:44px;margin-top:10px;padding:0 16px!important;border:2px solid var(--o);font:800 16px/1 var(--dc)!important;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}"+
"@ .sh-support{display:grid!important;grid-template-columns:1fr!important;gap:20px!important;border:0!important;padding-top:0!important;margin-top:0!important}"+
"@ .sh-support img,@ .sh-coverage img{aspect-ratio:16/9!important;object-fit:cover!important;clip-path:polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)}"+
"@ .sh-support h2,@ .sh-coverage h2{font:700 24px/1.02 var(--dc)!important;margin-top:4px}"+
/* voices + lower */
"@ .sh-voices{background:linear-gradient(100deg,#0021a5,#0a1a6b)!important;border:0!important;border-top:4px solid var(--o)!important;color:var(--tx)!important;margin-block:34px!important}"+
"@ .sh-voices h2{font:italic 900 34px/.95 var(--dc)!important}@ .sh-voices h3{font:700 26px/1.02 var(--dc)!important}@ .sh-voices article{border-color:#ffffff2e!important}"+
"@ .sh-lower{padding-bottom:40px}@ .sh-lower .sh-section-title{margin-top:0!important}"+
"@ .sh-watch,@ .sh-magazine:not(:has(.sh-mcover)){background:var(--nt)!important;border:0!important;border-top:3px solid var(--o)!important;color:var(--tx)!important;padding:22px!important;clip-path:polygon(0 0,100% 0,100% 100%,14px 100%,0 calc(100% - 14px))}"+
"@ .sh-watch h2,@ .sh-magazine h2{font:800 30px/1 var(--dc)!important}@ .sh-watch p:not(.sh-kicker){color:#dfe5ff!important}"+
"@ .sh-watch a{display:flex;align-items:center;min-height:44px;font:800 16px/1 var(--dc)!important;letter-spacing:.06em;text-transform:uppercase;color:#fff!important}"+
"@ .sh-watch.bc-tv{background:linear-gradient(100deg,#0021a5,#0a1a6b)!important;padding-left:100px!important;position:relative}"+
"@ .sh-watch.bc-tv:before{content:'';position:absolute;left:22px;top:24px;width:60px;height:60px;background:var(--o) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8 5v14l11-7z' fill='%23fff'/%3E%3C/svg%3E\") center/34px no-repeat}"+
"@ a.sh-mcover{border-color:#fff!important}@ .sh-magazine>a:not(.sh-mcover){display:flex;align-items:center;min-height:44px}"+
"@ #sh-freshness a{display:flex;align-items:center;justify-content:center;min-height:44px;background:var(--o);color:#08132f;font:800 16px/1 var(--dc);letter-spacing:.08em;text-transform:uppercase}"+
"@ .sh-gameday{margin-block:18px}"+
"@media(max-width:1100px) and (min-width:821px){@ .sh-header{flex-wrap:wrap;gap:0 24px;padding-block:10px}@ .sh-header nav{order:3;width:100%;margin:0;justify-content:flex-start;border-top:1px solid #ffffff1a!important}@ .sh-join{margin-left:auto!important}@ .bc-hero{grid-template-columns:330px minmax(0,1fr)}@ .bc-slash{left:330px}@ .sh-front{grid-template-columns:minmax(0,1fr) 330px!important}@ .bc-nx{grid-template-columns:150px minmax(0,1fr) auto}@ .bc-tag{font-size:24px}@ .bc-mu .bc-t{font-size:36px}@ .bc-cd b{min-width:56px;font-size:40px}}"+
"@media(max-width:820px){@ .sh-header{display:none!important}"+
"@ .bc-bug{font-size:16px;padding:0 16px 0 12px}@ .bc-trk a{font-size:14px;padding:0 16px}"+
"@ main{padding-inline:18px!important}@ .bc-hero,@ .bc-nx,@ .sh-front{margin:0 -18px}"+
"@ .bc-hero{display:flex;flex-direction:column;min-height:0}@ .bc-slash{display:none}"+
"@ .bc-hero .sh-lead{order:-1;min-height:430px;clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - 36px))!important}"+
"@ .bc-hero .sh-lead:after{background:linear-gradient(0deg,#040c30f7 0,#040c308c 42%,#040c3000 68%)}"+
"@ .bc-hero .sh-lead-copy{left:16px!important;right:16px!important;bottom:44px!important;gap:10px}"+
"@ .bc-hero h1{font-size:clamp(30px,9.4vw,40px)!important;line-height:.93!important}@ .bc-hero .sh-deck{font-size:15px!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}"+
"@ .bc-hero .sh-meta{display:none}@ .bc-hero .sh-read{min-height:44px}"+
"@ .bc-sc{margin:-22px 16px 0;padding:10px 14px;background:#fff;color:#0a1a6b;display:grid;grid-template-columns:auto 1fr 1fr;gap:6px 12px;align-items:center;clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%)}"+
"@ .bc-lbl{font-size:13px;background:var(--o);color:#08132f;padding:5px 8px}@ .bc-lbl i,@ .bc-lbl span{display:none}"+
"@ .bc-tm,@ .bc-tm.bc-w{background:none;clip-path:none;padding:0;grid-template-columns:auto auto;justify-content:start;gap:8px}@ .bc-tm:before{display:none}"+
"@ .bc-ab{height:auto;background:none;color:#0a1a6b;font-size:20px;clip-path:none}@ .bc-nm{display:none}"+
"@ .bc-pt{font-size:32px;color:#0a1a6b!important}@ .bc-tm:not(.bc-w) .bc-pt{color:#4a5a9c!important}"+
"@ .bc-go{grid-column:1/-1;margin:2px 0 0}@ .bc-go a{min-height:44px;font-size:14px;border-color:#0a1a6b55;color:#0a1a6b}@ .bc-go a.bc-o{color:#08132f}"+
"@ .bc-nx{grid-template-columns:auto minmax(0,1fr);min-height:0;background:none;color:var(--tx);padding:16px;gap:12px;border-bottom:1px solid #ffffff1f}"+
"@ .bc-tag{align-self:start;font-size:15px;color:#08132f;padding:7px 10px;clip-path:none;transform:skewX(-10deg)}"+
"@ .bc-mu{padding:0;display:block}@ .bc-mu .bc-t,@ .bc-mu .bc-at{display:inline;font-size:22px;color:#fff;letter-spacing:0}@ .bc-mu .bc-t small{display:inline;font-size:22px;letter-spacing:0;color:#fff;margin-right:.25em}"+
"@ .bc-mu .bc-at{color:var(--pk);margin:0 6px;font-size:18px}@ .bc-when{display:block;margin:4px 0 0;text-align:left;font-size:12px;color:var(--mu)}@ .bc-when b:after{content:' · '}@ .bc-when b{display:inline;font:600 12px/1.4 Barlow,sans-serif;color:var(--mu)}"+
"@ .bc-nx .bc-lk{border-color:#ffffff59;color:#fff;font-size:13px}"+
"@ .bc-cd{grid-column:1/-1;justify-content:flex-start;background:none;clip-path:none;padding:0;gap:8px}@ .bc-cd b{min-width:48px;font-size:30px}"+
"@ .sh-front{display:flex!important;flex-direction:column}@ .sh-latest{padding:20px 16px 8px!important}@ .sh-feature{padding:24px 16px}"+
"@ .sh-wire-item{grid-template-columns:52px minmax(0,1fr);gap:12px;padding:12px 0!important}@ .sh-wire-item:before{font-size:42px}@ .sh-wire-item h3{font-size:21px!important;line-height:1.02!important}"+
"@ .sh-section-title{font-size:22px!important}@ .sh-support h2,@ .sh-coverage h2{font-size:21px!important}@ .sh-voices h2{font-size:28px!important}@ .sh-voices h3{font-size:22px!important}"+
"@ .sh-watch.bc-tv{padding-left:90px!important}}";
function css(){if(document.getElementById('gbm-broadcast-home-css'))return;var s=document.createElement('style');s.id='gbm-broadcast-home-css';s.textContent=C.replace(/@ /g,R+' ').replace(/@\{/g,R+'{').replace(/@\)/g,R+')');(document.head||document.documentElement).appendChild(s);}
css();document.documentElement.classList.remove('gbm-bc-wait');
if(!document.getElementById('gbm-bc-home-fonts')){var ff=document.createElement('style');ff.id='gbm-bc-home-fonts';ff.textContent=[['barlow',400,'normal'],['barlow',500,'normal'],['barlow',600,'normal'],['barlow',700,'normal'],['barlow',800,'normal'],['barlow-condensed',600,'normal'],['barlow-condensed',700,'normal'],['barlow-condensed',800,'normal'],['barlow-condensed',900,'normal'],['barlow-condensed',800,'italic'],['barlow-condensed',900,'italic']].map(function(f){return'@font-face{font-family:"'+(f[0]=='barlow'?'Barlow':'Barlow Condensed')+'";font-weight:'+f[1]+';font-style:'+f[2]+';font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/'+f[0]+'@5.3.0/files/'+f[0]+'-latin-'+f[1]+'-'+f[2]+'.woff2) format("woff2")}';}).join('');document.head.appendChild(ff);}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return'&#'+c.charCodeAt(0)+';';});}
var MO=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'],WD={Tue:'Tues.',Thu:'Thurs.'};
function day(t){var o={};new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',month:'numeric',day:'numeric'}).formatToParts(new Date(t)).forEach(function(x){o[x.type]=x.value;});return(WD[o.weekday]||o.weekday+'.')+', '+MO[o.month-1]+' '+o.day;}
function ab(n){n=String(n||'');return n==='Florida'?'UF':(/\s/.test(n)?n.split(/\s+/).map(function(w){return w.charAt(0);}).join(''):n.slice(0,3)).toUpperCase();}
function team(t,w){return'<div class="bc-tm'+(w?' bc-w':'')+'"><b class="bc-ab" aria-hidden="true">'+esc(ab(t.name))+'</b><span class="bc-nm">'+esc(t.name)+'<small>'+(t.rank?'No. '+esc(t.rank)+' · ':'')+esc(t.record||'')+'</small></span><b class="bc-pt">'+(t.score==null?'–':esc(t.score))+'</b></div>';}
function post(h){return/^\/post\//.test(h||'');}
function build(){
var root=document.querySelector(R);if(!root||root.getAttribute('data-bc'))return;
var main=root.querySelector('#sh-main'),lead=root.querySelector('.sh-lead'),head=root.querySelector('.sh-header');if(!main||!lead)return;
root.setAttribute('data-bc','1');
var g=window.__GBM_GAMEDAY__,band=root.querySelector('.sh-gameday'),ref=root.querySelector('.sh-reference'),now=Date.now();
var ok=g&&g.home&&g.away,fin=ok&&g.status==='final',opp=ok?(g.home.name==='Florida'?g.away.name:g.home.name):'';
var logo=head&&head.querySelector('.sh-brand>a');if(logo&&!logo.querySelector('.bc-wm'))logo.insertAdjacentHTML('beforeend','<span class="bc-wm" aria-hidden="true">Gator<b>Bait</b><small>Media</small></span>');
var join=head&&head.querySelector('.sh-join');if(join&&!join.querySelector('span'))join.innerHTML='<span>'+join.innerHTML+'</span>';
var nx=null;if(ref){var h2=ref.querySelector('h2'),p=ref.querySelector('p:not(.sh-kicker)'),a=ref.querySelector('a[href]'),m=h2&&/^(.+?)\s+(at|vs\.?)\s+(.+)$/.exec(h2.textContent.trim());
if(m&&!(fin&&opp&&(m[1]+' '+m[3]).indexOf(opp)>=0))nx={a:m[1],at:m[2],b:m[3],when:p?p.textContent.split(/\.\s+(?=[A-Z][a-z]+\s)/)[0]:'',href:a&&a.getAttribute('href'),lt:a?a.textContent.replace(/\s*→\s*$/,''):''};}
var items=[];
if(ok&&fin&&post((g.links||[[]])[0][1]))items.push(['Final',g.headline.replace(/^Final:\s*/,''),g.links[0][1]]);
if(nx)items.push(['Next',nx.a+' '+nx.at+' '+nx.b+' · '+nx.when,nx.href||'/']);
[].slice.call(root.querySelectorAll('.sh-lead h1,.sh-support h2,.sh-wire-item h3')).slice(0,7).forEach(function(t){var l=t.closest('a')||lead.querySelector('a');if(l)items.push(['Latest',t.textContent,l.getAttribute('href')]);});
if(items.length>1){var one=items.map(function(i){return'<a href="'+esc(i[2])+'"><b>'+esc(i[0])+'</b>'+esc(i[1])+'</a>';}).join('');
root.insertAdjacentHTML('afterbegin','<div class="bc-tk" role="region" aria-label="GatorBait ticker"><span class="bc-bug" aria-hidden="true">GB</span><div class="bc-tw"><div class="bc-trk"><div style="display:flex">'+one+'</div><div style="display:flex" aria-hidden="true" inert>'+one+'</div></div></div></div>');
var dup=root.querySelectorAll('.bc-trk [aria-hidden] a');for(var i=0;i<dup.length;i++)dup[i].setAttribute('tabindex','-1');}
var hero=document.createElement('section');hero.className='bc-hero';hero.setAttribute('aria-label','Top story');
var sc='';if(ok&&!band&&(fin||now<Date.parse(g.until))){var aw=g.away,hm=g.home,w=fin&&Number(aw.score)>Number(hm.score);
var gl=(g.links||[]).filter(function(l){return post(l[1]);}).slice(0,2);
sc='<section class="bc-sc" aria-label="Scoreboard: '+esc(aw.name)+' at '+esc(hm.name)+'"><p class="bc-lbl"><i></i>'+(fin?'Final':'Game day')+' <span>· '+esc(day(g.kickoff))+'</span></p>'+team(aw,fin&&w)+team(hm,fin&&!w)+(gl.length?'<p class="bc-go">'+gl.map(function(l,k){return'<a'+(k?'':' class="bc-o"')+' href="'+esc(l[1])+'">'+(k?'More':'Game story')+'</a>';}).join('')+'</p>':'')+'</section>';}
hero.innerHTML=sc?sc+'<span class="bc-slash" aria-hidden="true"></span>':'';if(!sc)hero.classList.add('bc-solo');
var front=root.querySelector('.sh-front');main.insertBefore(hero,front);hero.appendChild(lead);
if(nx){var ko=ok&&!fin&&(nx.a+' '+nx.b).indexOf(opp)>=0?Date.parse(g.kickoff):0,bm=/^(No\. \d+)\s+(.+)$/.exec(nx.b);
var parts=nx.when.split(' · ');
var bar=document.createElement('section');bar.className='bc-nx';bar.setAttribute('aria-label','Next game');
bar.innerHTML='<div class="bc-tag">Next up</div><div class="bc-mu"><span class="bc-t">'+esc(nx.a)+'</span><span class="bc-at">'+esc(nx.at)+'</span><span class="bc-t">'+(bm?'<small>'+esc(bm[1])+'</small>'+esc(bm[2]):esc(nx.b))+'</span><span class="bc-when"><b>'+esc(parts[0])+'</b>'+esc(parts.slice(1).join(' · '))+(nx.href&&post(nx.href)?'<br><a class="bc-lk" href="'+esc(nx.href)+'">'+esc(nx.lt)+'</a>':'')+'</span></div>'+(ko>now?'<div class="bc-cd" role="timer" aria-label="Time to kickoff"></div>':'');
main.insertBefore(bar,front);if(ref)ref.style.display='none';
var cd=bar.querySelector('.bc-cd');if(cd){var tick=function(){var s=Math.max(0,ko-Date.now()),mm=Math.floor(s/6e4),u=[[Math.floor(mm/1440),'Days'],[Math.floor(mm/60)%24,'Hrs'],[mm%60,'Min']];if(s<=0){cd.remove();return;}cd.innerHTML=u.map(function(x){return'<div><b>'+(x[0]<10?'0':'')+x[0]+'</b><small>'+x[1]+'</small></div>';}).join('');setTimeout(tick,3e4);};tick();}}
[].slice.call(root.querySelectorAll('.sh-watch:not(.sh-reference)')).forEach(function(w){if(w.querySelector('a[href^="/the-buddy-martin-show"]'))w.classList.add('bc-tv');});
}
function sync(){if(document.querySelector(R+':not([data-bc])'))build();}
document.addEventListener('gbm:gazette-ready',sync);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
