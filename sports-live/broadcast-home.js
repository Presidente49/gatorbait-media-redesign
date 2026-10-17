/* GatorBait Broadcast homepage skin (Broadcast rollout S1, Oct. 17, 2026).
 * Loaded on / only by embed 0c13f955 (deploy/broadcast-2026/0c13f955/). Styles the Gazette homepage root
 * #gbm-live.gbm-gazette and adds the ticker, scoreboard, slashed lead and next-up bar from data already on the page:
 * the rendered stories, the Up next card and window.__GBM_GAMEDAY__ (read only; owned by the game-day desk).
 * Design: docs/design/lookbook/ (Broadcast) and docs/design/NETWORK-DESIGN-SYSTEM.md. */
(function(){
'use strict';if(window.__GBM_BC_HOME__)return;window.__GBM_BC_HOME__=1;
var R='#gbm-live.gbm-gazette.gbm-sports-home';
var C="html:has(@) body{background:#061247!important}"+
"@{--o:#fa4616;--nt:#040c30;--tx:#e8edff;--mu:#aebcff;--pk:#ffb39a;--dc:'Barlow Condensed','Barlow',Arial,sans-serif;background:linear-gradient(115deg,transparent 0 62%,#ffffff0a 62% 63.2%,transparent 63.2%),radial-gradient(ellipse 70% 38% at 72% 0,#2b57ff40,transparent 70%),linear-gradient(180deg,#0021a5 0,#0a1a6b 520px,#061247 100%)!important;color:var(--tx)!important}"+
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
"@ .bc-pre .bc-pt{color:var(--mu);font-size:.6em}@ .bc-ven{margin:0;font:600 15px/1.3 Barlow,sans-serif;color:var(--mu);letter-spacing:.04em}"+
"@ .bc-lbl{display:flex;align-items:center;gap:10px;margin:0;font:800 18px/1.2 var(--dc);letter-spacing:.14em;text-transform:uppercase}"+
"@ .bc-lbl i{width:10px;height:10px;background:var(--o);transform:skewX(-14deg)}@ .bc-lbl span{color:var(--mu);font-weight:600;letter-spacing:.06em;font-size:15px}"+
"@ .bc-tm{display:grid;grid-template-columns:52px minmax(0,1fr) auto;align-items:center;gap:12px;background:#ffffff0f;padding:9px 18px 9px 9px;clip-path:polygon(0 0,100% 0,calc(100% - 14px) 100%,0 100%);position:relative}"+
"@ .bc-tm.bc-w{background:#ffffff1f}@ .bc-tm.bc-w:before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--o)}"+
"@ .bc-ab{display:grid;place-items:center;height:52px;background:#fff;color:#0021a5;font:900 21px/1 var(--dc);clip-path:polygon(0 0,100% 0,86% 100%,0 100%)}"+
"@ .bc-nm{font:800 28px/1 var(--dc);text-transform:uppercase;min-width:0;overflow-wrap:anywhere}@ .bc-nm small{display:block;margin-top:4px;font:600 12px/1.2 Barlow,sans-serif;letter-spacing:.14em;color:var(--mu)}"+
"@ .bc-pt{font:900 64px/.8 var(--dc);font-variant-numeric:tabular-nums}@ .bc-tm:not(.bc-w) .bc-pt{color:var(--mu)}"+
"@ .bc-go{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 0}"+
"@ .bc-go a,@ .bc-nx .bc-lk{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:2px solid #ffffff59;font:800 16px/1 var(--dc);letter-spacing:.08em;text-transform:uppercase;text-decoration:none}"+
"@ .bc-go a.bc-o{background:var(--o);border-color:var(--o);color:#08132f;box-shadow:0 0 14px #ff6a2b80}"+
"@ .bc-ls{display:grid;grid-template-columns:62px repeat(4,1fr) 52px;gap:6px 0;margin:4px 0 0;padding:12px 18px 0 0;border-top:1px solid #ffffff24;font:700 18px/1.1 var(--dc);text-align:center;font-variant-numeric:tabular-nums}"+
"@ .bc-ls span:nth-child(6n+1){text-align:left;color:var(--mu);font-weight:600;letter-spacing:.06em}@ .bc-ls .h{color:var(--mu);font:600 12px/1.4 Barlow,sans-serif;letter-spacing:.14em}@ .bc-ls .t{color:var(--pk);font-weight:900}"+
"@ .bc-ld{display:grid;gap:10px;margin:2px 0 0;padding-top:12px;border-top:1px solid #ffffff24}@ .bc-ld>small{font:700 12px/1 Barlow,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--mu)}"+
"@ .bc-ld p{margin:0;display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 12px}@ .bc-ld b{font:800 24px/1 var(--dc);text-transform:uppercase}@ .bc-ld em{font:normal 700 17px/1.1 var(--dc);color:var(--pk);letter-spacing:.02em}"+
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
"@ .bc-graphic .sh-lead{display:grid!important;grid-template-columns:1fr;align-content:center;gap:20px;padding:30px 40px 30px 112px;background:radial-gradient(ellipse 60% 70% at 78% 50%,#2b57ff33,transparent 70%),linear-gradient(115deg,#040c30 0 55%,#0a1a6b)!important}"+
"@ .bc-graphic .sh-lead:after{display:none}"+
"@ .bc-graphic .sh-lead figure{order:0;max-width:600px;position:relative!important;inset:auto!important;height:auto;padding:8px;background:#0f1c4a;border:1px solid #2a4aa8;box-shadow:0 10px 30px #00000073,0 0 0 1px #00000040,inset 0 1px 0 #ffffff1f}"+
"@ .bc-graphic .sh-lead figure>a{position:static!important;display:block;height:auto}"+
"@ .bc-graphic .sh-lead img{position:static;display:block;width:100%!important;height:auto!important;aspect-ratio:16/9!important;object-fit:contain!important;background:#040c30}"+
"@ .bc-graphic .sh-lead figcaption{position:static;padding:6px 2px 0;text-shadow:none;color:var(--mu)}"+
"@ .bc-graphic .sh-lead-copy{order:1;position:static!important;padding:0!important;max-width:none}"+
"@ .bc-graphic h1{font-size:clamp(32px,3vw,46px)!important;text-shadow:0 3px 18px #00000080}@ .bc-graphic .sh-deck{font-size:16px!important}"+
"@ .bc-slash{position:absolute;left:400px;top:0;bottom:0;width:90px;z-index:3;pointer-events:none;background:linear-gradient(115deg,transparent 0 44%,var(--o) 44% 56%,transparent 56%)}"+
/* next up */
"@ .bc-nx{display:grid;grid-template-columns:190px minmax(0,1fr) auto;min-height:112px;margin:0 -28px;background:linear-gradient(180deg,#fff,#eef1fb);color:#0a1a6b;position:relative;z-index:2;box-shadow:0 10px 30px #00000073,0 -1px 0 #ffffff59}"+
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
"@ .sh-front.bc-moved{display:none!important}"+
"@ .bc-body{display:grid;grid-template-columns:minmax(0,1fr) 400px;margin:0 -28px;position:relative}"+
"@ .bc-run{padding:30px 40px 24px 28px;min-width:0}@ .bc-rows{list-style:none;margin:0;padding:0}"+
"@ .bc-row a{display:grid;grid-template-columns:78px minmax(0,1fr);align-items:center;gap:16px;padding:12px 0;border-top:1px solid #ffffff1f;color:#fff;text-decoration:none}@ .bc-row:first-child a{border-top:0;padding-top:4px}"+
"@ .bc-n{font:italic 900 58px/.8 var(--dc);color:var(--o);letter-spacing:-.03em;font-variant-numeric:tabular-nums;text-shadow:0 0 18px #ff6a2b59}"+
"@ .bc-row h3{font:700 26px/1 var(--dc)!important;margin:0}@ .bc-row a:hover h3{color:var(--pk)}@ .bc-by{display:block;margin-top:6px;font:600 12px/1.3 Barlow,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--mu)}@ .bc-by b{color:var(--pk);font-weight:700}"+
"@ .bc-side{position:relative;display:grid;align-content:start;gap:22px;padding:30px 28px;background:linear-gradient(180deg,#0b1a55,#040c30 62%);box-shadow:0 10px 30px #00000073,inset 1px 0 0 #ffffff14,inset 0 1px 0 #ffffff12}"+
"@ .bc-side:before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--o),transparent);box-shadow:0 0 14px #ff6a2bbf}"+
"@ .bc-h{display:flex;align-items:center;gap:12px;margin:0 0 12px;font:900 21px/1 var(--dc)!important;letter-spacing:.06em!important;text-transform:uppercase;color:#fff}@ .bc-h:after{content:'';flex:1;height:3px;background:linear-gradient(90deg,var(--o) 0 70px,#ffffff26 70px);box-shadow:0 0 12px #ff6a2b66}"+
"@ .bc-note{margin:-6px 0 12px;font:600 12px/1.3 Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--mu)}"+
"@ .bc-stats{display:grid;grid-template-columns:1fr 1fr;gap:16px 22px}@ .bc-stat b{display:block;font:900 54px/.85 var(--dc);font-variant-numeric:tabular-nums;color:#fff;text-shadow:0 2px 12px #00000059}"+
"@ .bc-stat span{display:block;margin-top:6px;font:700 11px/1.2 Barlow,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--mu)}@ .bc-stat i{display:block;height:4px;margin-top:10px;background:linear-gradient(90deg,var(--o) 0 54px,#ffffff1f 54px);box-shadow:0 0 10px #ff6a2b4d}"+
"@ .bc-shots{display:grid;grid-template-columns:1fr 1fr;gap:10px}@ .bc-shot{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;background:#0f1c4a;clip-path:polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)}"+
"@ .bc-shot img{width:100%!important;height:100%!important;object-fit:cover!important;transition:transform .3s}@ .bc-shot:hover img{transform:scale(1.04)}"+
"@ .bc-shot span{position:absolute;left:0;right:0;bottom:0;padding:28px 10px 9px;background:linear-gradient(transparent,#040c30f2);font:800 14px/1.05 var(--dc);text-transform:uppercase;color:#fff;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}"+
"@ .bc-side .sh-watch{margin:0!important;box-shadow:0 10px 30px #00000059}"+
"@ .sh-voices{box-shadow:0 10px 30px #00000073,inset 0 1px 0 #ffffff1f;position:relative;overflow:hidden}@ .sh-voices:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 0 70%,#ffffff0d 70% 71.5%,transparent 71.5%)}"+
"@ .sh-voices,@ .sh-lower{margin-block:28px 0!important}@ .sh-lower{padding-bottom:36px!important}"+
"@ .sh-coverage article{background:linear-gradient(180deg,#0f1c4a,#0a1640);border-top:3px solid var(--o);box-shadow:0 10px 30px #00000059,inset 0 1px 0 #ffffff12;padding:0 0 14px}@ .sh-coverage article>a{display:block}"+
"@ .sh-coverage article .sh-meta,@ .sh-coverage article h2{padding-inline:14px}@ .sh-coverage article img{margin-bottom:10px;clip-path:none}"+
"@ .bc-tbl{list-style:none;margin:0;padding:0;display:grid;gap:3px}@ .bc-tbl li{display:grid;grid-template-columns:24px minmax(0,1fr) 46px 46px;align-items:center;gap:8px;padding:6px 10px;background:#ffffff0a;font:700 17px/1.1 var(--dc);text-transform:uppercase;color:#fff}"+
"@ .bc-tbl li[hidden]{display:none}@ .bc-tbl li.bc-th{background:none;padding-block:0 4px;font:700 11px/1.2 Barlow,sans-serif;letter-spacing:.16em;color:var(--mu)}@ .bc-tbl span{color:var(--mu);font-variant-numeric:tabular-nums}"+
"@ .bc-tbl em,@ .bc-tbl small{font:inherit;font-style:normal;text-align:right;font-variant-numeric:tabular-nums}@ .bc-tbl small{color:var(--mu)}@ .bc-tbl li.bc-th em,@ .bc-tbl li.bc-th small{font:inherit;color:var(--mu)}"+
"@ .bc-tbl li.bc-fl{background:linear-gradient(90deg,#fa46163d,#ffffff0a);box-shadow:inset 3px 0 0 var(--o)}@ .bc-tbl li.bc-fl b{color:var(--pk)}"+
"@ .bc-sd{display:grid;gap:22px}@ .bc-sd:empty{display:none}@ .sh-lower>aside{display:grid;gap:20px;align-content:start}"+
"@ .sh-voices.bc-stack{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;margin:0!important;padding:22px!important}@ .bc-stack .sh-voices-label h2 br{display:none}"+
"@ .bc-stack article{padding:12px 0 0!important;border:0!important;border-top:1px solid #ffffff2e!important}@ .bc-stack h2{font-size:28px!important}@ .bc-stack h3{font-size:23px!important}"+
"@ .sh-coverage{gap:20px!important}@ .sh-watch:not(.bc-tv),@ .sh-magazine{box-shadow:0 10px 30px #00000059}"+
"@media(min-width:1101px){@ .sh-coverage{grid-template-columns:repeat(3,minmax(0,1fr))!important}@ .sh-coverage h2{font-size:21px!important}}"+
"@media(max-width:1100px) and (min-width:821px){@ .bc-body{grid-template-columns:minmax(0,1fr) 330px}@ .bc-graphic .sh-lead{padding:26px 30px 26px 96px}@ .sh-header{flex-wrap:wrap;gap:0 24px;padding-block:10px}@ .sh-header nav{order:3;width:100%;margin:0;justify-content:flex-start;border-top:1px solid #ffffff1a!important}@ .sh-join{margin-left:auto!important}@ .bc-hero{grid-template-columns:330px minmax(0,1fr)}@ .bc-slash{left:330px}@ .sh-front{grid-template-columns:minmax(0,1fr) 330px!important}@ .bc-nx{grid-template-columns:150px minmax(0,1fr) auto}@ .bc-tag{font-size:24px}@ .bc-mu .bc-t{font-size:36px}@ .bc-cd b{min-width:56px;font-size:40px}}"+
"@media(max-width:820px){@ .sh-header{display:none!important}"+
"@ .bc-bug{font-size:16px;padding:0 16px 0 12px}@ .bc-trk a{font-size:14px;padding:0 16px}"+
"@ main{padding-inline:18px!important}@ .bc-hero,@ .bc-nx,@ .sh-front{margin:0 -18px}"+
"@ .bc-hero{display:flex;flex-direction:column;min-height:0}@ .bc-slash{display:none}"+
"@ .bc-hero .sh-lead{order:-1;min-height:430px;clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - 36px))!important}"+
"@ .bc-hero .sh-lead:after{background:linear-gradient(0deg,#040c30f7 0,#040c308c 42%,#040c3000 68%)}"+
"@ .bc-hero .sh-lead-copy{left:16px!important;right:16px!important;bottom:44px!important;gap:10px}"+
"@ .bc-graphic .sh-lead{min-height:0;clip-path:none!important;display:flex!important;flex-direction:column;gap:14px;padding:16px 16px 36px}@ .bc-graphic .sh-lead figure{order:0;padding:6px}@ .bc-graphic .sh-lead-copy{order:1}@ .bc-graphic .sh-lead-copy .sh-meta{display:block}"+
"@ .bc-tbl li.bc-x{display:none}@ .bc-ls,@ .bc-ld{display:none}@ .bc-body{display:block;margin:0 -18px}@ .bc-run{padding:20px 18px 8px}@ .bc-side{padding:24px 18px}"+
"@ .bc-row a{grid-template-columns:52px minmax(0,1fr);gap:12px}@ .bc-n{font-size:42px}@ .bc-row h3{font-size:21px!important;line-height:1.02!important}@ .bc-stat b{font-size:40px}@ .bc-h{font-size:19px!important}"+
"@ .bc-hero h1{font-size:clamp(30px,9.4vw,40px)!important;line-height:.93!important}@ .bc-graphic h1{font-size:clamp(28px,8.4vw,36px)!important}@ .bc-hero .sh-deck{font-size:15px!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}"+
"@ .bc-hero .sh-meta{display:none}@ .bc-hero .sh-read{min-height:44px}"+
"@ .bc-sc{margin:-22px 16px 0;padding:10px 14px;background:#fff;color:#0a1a6b;display:grid;grid-template-columns:auto 1fr 1fr;gap:6px 12px;align-items:center;clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%)}"+
"@ .bc-ven{display:none}@ .bc-lbl{font-size:13px;background:var(--o);color:#08132f;padding:5px 8px}@ .bc-lbl i,@ .bc-lbl span{display:none}"+
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
/* Swamp Night palette correction, Oct. 17: restore the owner's latest direction
 * (#34 comment 6230312104). Keep the existing layout, stories and live game runtime.
 * The night field and glass replace Broadcast's royal-blue slabs and slash chrome. */
C += `
html:has(@) body{background:#0b0d12!important}
@{--nt:#07122e;--tx:#e9ebf1;--mu:#a9b4cc;--pk:#ffb39a;background:radial-gradient(ellipse 850px 500px at 0 100%,rgba(250,70,22,.15),transparent 65%),linear-gradient(180deg,#07122e 0,#0b0d12 900px)!important;color:var(--tx)!important}
@ .bc-tk{background:rgba(7,18,46,.75);border-color:rgba(255,255,255,.1)}
@ .bc-bug{background:rgba(255,255,255,.06);color:#fff;clip-path:none}
@ .sh-header{background:rgba(7,18,46,.45);border-color:rgba(255,255,255,.1)}
@ .bc-wm{font-style:normal}@ .bc-wm b{color:#fff}
@ .sh-header nav [aria-current]{color:#fff!important;box-shadow:inset 0 -2px 0 var(--o)}
@ .bc-hero h1{font-style:normal!important;line-height:1.02!important;text-shadow:0 6px 28px rgba(0,0,0,.6)}
@ .bc-hero .sh-lead{clip-path:none!important;border-radius:12px}
@ .bc-hero .sh-lead:after{background:linear-gradient(0deg,rgba(7,18,46,.96),rgba(7,18,46,.55) 42%,rgba(7,18,46,.08) 75%)}
@ .bc-hero .sh-kicker{background:rgba(7,18,46,.7);color:#e9ebf1!important;clip-path:none;border:1px solid rgba(255,255,255,.14);border-radius:999px}
@ .bc-slash{display:none}
@ .bc-sc,@ .bc-nx,@ .bc-side,@ .sh-voices,@ .sh-watch,@ .sh-magazine,@ .sh-coverage article{
background:rgba(255,255,255,.06)!important;color:var(--tx)!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:14px;box-shadow:0 16px 36px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.06)!important;backdrop-filter:blur(16px)}
/* Let narrow story-card tracks shrink; long staff bylines wrap inside their own card. */
@ .sh-lower>div{min-width:0}
@ .sh-coverage{grid-template-columns:repeat(2,minmax(0,1fr))}
@ .sh-coverage article>a{min-width:0;max-width:100%}
@ .sh-coverage .sh-meta{overflow-wrap:anywhere}
@ .sh-magazine:not(:has(.sh-mcover)){background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.1)!important}
@ .bc-side:before,@ .sh-voices:after{display:none}
@ .bc-tm,@ .bc-tm.bc-w{clip-path:none;border-radius:8px}
@ .bc-tm.bc-w:before{background:rgba(255,255,255,.22)}
@ .bc-ab{background:rgba(255,255,255,.08);color:#fff;clip-path:none;border-radius:6px}
@ .bc-pt{color:#fff!important}@ .bc-tm:not(.bc-w) .bc-pt{color:#a9b4cc!important}
@ .bc-lbl{background:none;color:#ffb39a}@ .bc-lbl i{border-radius:50%;transform:none}
@ .bc-tag{background:none;color:#a9b4cc;clip-path:none;transform:none}
@ .bc-mu .bc-t,@ .bc-mu .bc-t small,@ .bc-when b{color:#fff}
@ .bc-mu .bc-at,@ .bc-when{color:#a9b4cc}
@ .bc-nx .bc-lk,@ .bc-go a{border-color:rgba(255,255,255,.3);color:#fff;border-radius:6px}
@ .bc-cd{background:rgba(7,18,46,.48);clip-path:none;border-radius:0 14px 14px 0}
@ .bc-cd b{background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff}
@ .sh-join,@ .bc-hero .sh-read,@ .bc-go a.bc-o,@ #sh-freshness a{clip-path:none;transform:none;border-radius:6px;background:#fa4616!important;color:#08132f!important;box-shadow:0 6px 20px rgba(250,70,22,.16)}
@ .sh-join>span{transform:none}
@ .sh-section-title:after,@ .bc-h:after{height:1px;background:rgba(255,255,255,.16);box-shadow:none}
@ .sh-voices h2{font-style:normal!important}
@ .sh-watch.bc-tv{background:rgba(255,255,255,.06)!important}
@ .sh-watch.bc-tv:before{border-radius:50%;box-shadow:0 0 20px rgba(250,70,22,.18)}
@ .bc-stat i{background:linear-gradient(90deg,var(--o) 0 54px,rgba(255,255,255,.12) 54px);box-shadow:none}
@ .bc-shot,@ .sh-support img,@ .sh-coverage img{clip-path:none;border-radius:10px}
@ .bc-shot{background:#07122e}@ .bc-shot span{background:linear-gradient(transparent,rgba(7,18,46,.96))}
@ .bc-tbl li.bc-fl{background:rgba(255,255,255,.08);box-shadow:inset 3px 0 0 rgba(255,255,255,.35)}
@ .bc-graphic .sh-lead{background:rgba(7,18,46,.55)!important}
@ .bc-graphic .sh-lead figure{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);border-radius:10px;box-shadow:0 16px 36px rgba(0,0,0,.28)}
@ .bc-graphic .sh-lead img{background:#07122e}
@media(max-width:820px){
@ .bc-hero .sh-lead{clip-path:none!important}
@ .bc-sc{background:rgba(7,18,46,.94)!important}
@ .bc-sc .bc-ab{color:#fff;background:none}
@ .bc-sc .bc-go a{color:#fff;border-color:rgba(255,255,255,.3)}
@ .bc-sc .bc-go a.bc-o{color:#08132f}
@ .bc-nx{background:rgba(255,255,255,.06)!important}
@ .bc-tag{color:#a9b4cc;transform:none}
@ .bc-cd{background:none;border-radius:0}
}
`;
function css(){if(document.getElementById('gbm-broadcast-home-css'))return;var s=document.createElement('style');s.id='gbm-broadcast-home-css';s.textContent=C.replace(/@ /g,R+' ').replace(/@\{/g,R+'{').replace(/@\)/g,R+')');(document.head||document.documentElement).appendChild(s);}
css();document.documentElement.classList.remove('gbm-bc-wait');
if(!document.getElementById('gbm-bc-home-fonts')){var ff=document.createElement('style');ff.id='gbm-bc-home-fonts';ff.textContent=[['barlow',400,'normal'],['barlow',500,'normal'],['barlow',600,'normal'],['barlow',700,'normal'],['barlow',800,'normal'],['barlow-condensed',600,'normal'],['barlow-condensed',700,'normal'],['barlow-condensed',800,'normal'],['barlow-condensed',900,'normal'],['barlow-condensed',800,'italic'],['barlow-condensed',900,'italic']].map(function(f){return'@font-face{font-family:"'+(f[0]=='barlow'?'Barlow':'Barlow Condensed')+'";font-weight:'+f[1]+';font-style:'+f[2]+';font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/'+f[0]+'@5.3.0/files/'+f[0]+'-latin-'+f[1]+'-'+f[2]+'.woff2) format("woff2")}';}).join('');document.head.appendChild(ff);}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return'&#'+c.charCodeAt(0)+';';});}
/* Live data. Headlines: /blog-feed.xml (Wix, live). Next game and last final: sports-live/scoreboard.json on Pages
   (built from ESPN by refresh-newsroom-feed.yml). Live score: ESPN's public scoreboard, read only from one hour before
   kickoff to six hours after, because the Pages file can lag a game by an hour or more. Everything refreshes while the
   page is open; the page's own content (Up next card, __GBM_GAMEDAY__) is only a fallback when a source fails. */
var SB='https://presidente49.github.io/gatorbait-media-redesign/sports-live/scoreboard.json',
ESPN='https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups=8&dates=',
D={feed:null,sb:null,live:null},HR=36e5,DAY=864e5;
function minute(){return Math.floor(Date.now()/6e4);}
function get(u,t){return fetch(u,{cache:'no-store',credentials:'omit'}).then(function(r){if(!r.ok)throw new Error(r.status);return t?r.text():r.json();});}
function loadFeed(){return get('/blog-feed.xml?t='+minute(),1).then(function(x){var d=new DOMParser().parseFromString(x,'text/xml'),out=[];
[].slice.call(d.querySelectorAll('item')).forEach(function(i){var q=function(k){var n=[].slice.call(i.children).find(function(c){return c.localName===k;});return n?n.textContent.trim():'';},u;
try{u=new URL(q('link'),location.href);}catch(e){return;}if(!/(^|\.)gatorbaitmedia\.com$/.test(u.hostname)||u.pathname.indexOf('/post/')!==0||!q('title'))return;
var en=i.querySelector('enclosure');out.push([Date.parse(q('pubDate'))||0,q('title'),u.pathname,q('creator'),en?en.getAttribute('url')||'':'']);});
out.sort(function(a,b){return b[0]-a[0];});if(out.length>=3){D.all=out;D.feed=out.slice(0,7);}}).catch(function(){});}
var CFG='https://presidente49.github.io/gatorbait-media-redesign/sports-live/front-page.config.json';
function loadCfg(){return get(CFG+'?t='+Math.floor(Date.now()/36e5)).then(function(c){if(c&&Array.isArray(c.covers))D.covers=c.covers;}).catch(function(){});}
/* A lead whose cover is a typeset graphic (a covers[] media id, or a PNG; photos here are JPG) shows whole with the headline below it, not over it. */
function graphic(root){var im=root.querySelector('.bc-hero .sh-lead img'),u=im&&(im.currentSrc||im.src)||'',id=(/\/media\/([0-9a-f]+_[0-9a-f]+)/.exec(u)||[])[1];return!!u&&(/~mv2\.png(\/|$|\?)/i.test(u)||!!(id&&D.covers&&D.covers.indexOf(id)>=0));}
function loadSB(){return get(SB+'?t='+minute()).then(function(d){if(d&&d.team&&('next' in d))D.sb=d;}).catch(function(){});}
function ymd(t){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York'}).format(new Date(t)).replace(/-/g,'');}
function window_(){var n=D.sb&&(D.sb.live||D.sb.next);if(!n)return null;var k=Date.parse(n.kickoffIso||n.date);return isFinite(k)&&Date.now()>k-HR&&Date.now()<k+6*HR?{id:String(n.eventId),k:k}:null;}
function loadLive(){var w=window_();if(!w){D.live=null;return Promise.resolve();}
return get(ESPN+ymd(w.k)).then(function(d){var e=(d.events||[]).find(function(e){return String(e.id)===w.id;});if(!e)return;var c=e.competitions[0],
us=c.competitors.find(function(t){return String(t.id||t.team.id)==='57';}),th=c.competitors.find(function(t){return t!==us;});if(!us||!th)return;
var rk=function(t){var r=t.curatedRank&&t.curatedRank.current;return r>=1&&r<=25?r:null;},ty=c.status.type;
D.live={id:w.id,state:ty.state,done:!!ty.completed,detail:ty.shortDetail||'',fla:Number(us.score),opp:Number(th.score),oppName:th.team.location,oppRank:rk(th),flaRank:rk(us),
home:us.homeAway==='home'&&!c.neutralSite,neutral:!!c.neutralSite,date:c.date};}).catch(function(){});}
var MO=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'],WD={Tue:'Tues.',Thu:'Thurs.'};
function et(t){var o={};new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',month:'numeric',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true}).formatToParts(new Date(t)).forEach(function(x){o[x.type]=x.value;});return o;}
function day(t){var o=et(t);return(WD[o.weekday]||o.weekday+'.')+', '+MO[o.month-1]+' '+o.day;}
function clock(t){var o=et(t),h=+o.hour,m=o.minute,pm=/p/i.test(o.dayPeriod||'');if(h===12&&m==='00')return pm?'Noon':'Midnight';return h+(m==='00'?'':':'+m)+(pm?' p.m.':' a.m.');}
function nm(name,rank){return(rank>=1&&rank<=25?'No. '+rank+' ':'')+name;}
function ab(n){n=String(n||'');return n==='Florida'?'UF':(/\s/.test(n)?n.split(/\s+/).map(function(w){return w.charAt(0);}).join(''):n.slice(0,3)).toUpperCase();}
function post(h){return/^\/post\//.test(h||'');}
/* One model for the ticker, the scoreboard panel and the next-up bar. */
function model(root){var sb=D.sb,lv=D.live,g=window.__GBM_GAMEDAY__,now=Date.now(),M={last:null,live:null,next:null};
var fr=sb&&sb.team&&sb.team.rank;
if(lv&&lv.state==='in')M.live={opp:lv.oppName,oppRank:lv.oppRank,flaRank:lv.flaRank,fla:lv.fla,oppS:lv.opp,home:lv.home,neutral:lv.neutral,detail:lv.detail,date:lv.date};
if(lv&&lv.state==='post'&&lv.done)M.last={opp:lv.oppName,oppRank:lv.oppRank,fla:lv.fla,oppS:lv.opp,home:lv.home,neutral:lv.neutral,date:lv.date,links:[]};
else if(sb&&sb.last&&sb.last.score)M.last={opp:sb.last.opponent,oppRank:sb.last.opponentRank,fla:sb.last.score.fla,oppS:sb.last.score.opp,home:sb.last.home,neutral:sb.last.neutral,date:sb.last.date,links:[sb.last.recapUrl,sb.last.galleryUrl].filter(post)};
if(M.last&&sb&&sb.last&&sb.last.score&&M.last.opp===sb.last.opponent&&M.last.fla===sb.last.score.fla&&M.last.oppS===sb.last.score.opp){M.last.q=sb.last.quarters;M.last.tape=sb.last.tape;M.last.leaders=sb.last.leaders;}
if(M.last&&now-Date.parse(M.last.date)>8*DAY)M.last=null;
var n=sb&&sb.next;if(n&&!(lv&&String(n.eventId)===lv.id&&lv.state!=='pre')&&Date.parse(n.kickoffIso)>now-HR)M.next={opp:n.opponent,oppRank:n.opponentRank,flaRank:fr,home:n.home,neutral:n.neutral,k:Date.parse(n.kickoffIso),tv:n.tv,venue:n.venue,href:post(n.previewUrl)?n.previewUrl:''};
if(M.next&&!M.live&&M.next.k-now<DAY){M.pre=M.next;M.pre.flaRec=sb&&sb.team&&sb.team.record;M.pre.oppRec=n.opponentRecord;}
if(!sb){/* fallback: the page's Up next card and the game-day desk's data, with the stale-card guard */
var ok=g&&g.home&&g.away,fin=ok&&g.status==='final',opp=ok?(g.home.name==='Florida'?g.away.name:g.home.name):'',ref=root.querySelector('.sh-reference');
if(ok&&fin&&now-Date.parse(g.kickoff)<8*DAY){var fh=g.home.name==='Florida';M.last={opp:opp,oppRank:(fh?g.away:g.home).rank,fla:(fh?g.home:g.away).score,oppS:(fh?g.away:g.home).score,home:fh,date:g.kickoff,links:(g.links||[]).map(function(l){return l[1];}).filter(post)};}
if(ref){var h2=ref.querySelector('h2'),p=ref.querySelector('p:not(.sh-kicker)'),m=h2&&/^(.+?)\s+(at|vs\.?)\s+(.+)$/.exec(h2.textContent.trim());
if(m&&!(fin&&opp&&(m[1]+' '+m[3]).indexOf(opp)>=0))M.card={a:m[1],at:m[2],b:m[3],when:p?p.textContent.split(/\.\s+(?=[A-Z][a-z]+\s)/)[0]:''};}}
M.links=(M.last&&M.last.links||[]).slice();if(M.last&&!M.links.length&&g&&g.links&&(g.home.name===M.last.opp||g.away.name===M.last.opp))M.links=g.links.map(function(l){return l[1];}).filter(post);
return M;}
function matchup(x){var f=nm('Florida',x.flaRank),o=nm(x.opp,x.oppRank);return x.home?[o,'at',f]:x.neutral?[f,'vs.',o]:[f,'at',o];}
function finalLine(x){var w=x.fla>x.oppS,a=w?['Florida',x.fla]:[x.opp,x.oppS],b=w?[x.opp,x.oppS]:['Florida',x.fla];return a[0]+' '+a[1]+', '+b[0]+' '+b[1];}
function tba(k){var d=new Date(k);return d.getUTCMinutes()===0&&(d.getUTCHours()===4||d.getUTCHours()===5);}
function kick(k){return tba(k)?'Time TBA':clock(k)+' ET';}
function when(x){return day(x.k)+' · '+kick(x.k)+(x.tv?' · '+x.tv:'');}
function tickerItems(root,M){var it=[];
if(M.pre){var pm=matchup(M.pre);it.push(['Game day',pm.join(' ')+' · '+kick(M.pre.k)+(M.pre.tv?' · '+M.pre.tv:''),M.pre.href||'#sh-main']);}
if(M.live)it.push(['Live','Florida '+M.live.fla+', '+M.live.opp+' '+M.live.oppS+(M.live.detail?' · '+M.live.detail:''),'#sh-main']);
else if(M.last)it.push(['Final',finalLine(M.last),M.links[0]||'/gatorbait-media-blogs']);
if(M.next&&!M.pre){var mu=matchup(M.next);it.push(['Next',mu.join(' ')+' · '+when(M.next),M.next.href||'/gatorbait-media-blogs']);}
else if(M.card)it.push(['Next',M.card.a+' '+M.card.at+' '+M.card.b+' · '+M.card.when,'/gatorbait-media-blogs']);
var heads=D.feed?D.feed.map(function(f){return[f[1],f[2]];}):[].slice.call(root.querySelectorAll('.sh-lead h1,.sh-support h2,.sh-wire-item h3')).slice(0,7).map(function(t){var l=t.closest('a')||root.querySelector('.sh-lead a');return[t.textContent,l&&l.getAttribute('href')];});
heads.forEach(function(h){if(h[1])it.push(['Latest',h[0],h[1]]);});return it;}
function teamRow(name,rank,rec,score,win){return'<div class="bc-tm'+(win?' bc-w':'')+'"><b class="bc-ab" aria-hidden="true">'+esc(ab(name))+'</b><span class="bc-nm">'+esc(name)+'<small>'+(rank?'No. '+esc(rank):'')+(rank&&rec?' · ':'')+esc(rec||'')+'</small></span><b class="bc-pt">'+esc(score)+'</b></div>';}
function prePanel(x){var f=['Florida',x.flaRank,x.flaRec],o=[x.opp,x.oppRank,x.oppRec],aw=x.home?o:f,hm=x.home?f:o;
return'<section class="bc-sc bc-pre" aria-label="Game day: '+esc(matchup(x).join(' '))+'"><p class="bc-lbl"><i></i>Game day <span>· '+esc(kick(x.k)+(x.tv?' · '+x.tv:''))+'</span></p>'+
teamRow(aw[0],aw[1],aw[2],'',false)+teamRow(hm[0],hm[1],hm[2],'',false)+(x.venue?'<p class="bc-ven">'+esc(x.venue)+'</p>':'')+(x.href?'<p class="bc-go"><a class="bc-o" href="'+esc(x.href)+'">Preview</a></p>':'')+'</section><span class="bc-slash" aria-hidden="true"></span>';}
function panel(M){if(M.pre&&!M.live)return prePanel(M.pre);var x=M.live||M.last;if(!x)return'';var L=!!M.live,f=[ 'Florida',L?x.flaRank:null,'',x.fla],o=[x.opp,x.oppRank,'',x.oppS],aw=x.home?o:f,hm=x.home?f:o;
var win=L?null:(x.fla>x.oppS?f:o),lk=L?[]:M.links.slice(0,2);
var ls='',q=!L&&x.q;if(q&&q.fla&&q.opp&&q.fla.length===q.opp.length&&q.fla.length>=4){var n=q.fla.length,hdr=[''];for(var i=1;i<=n;i++)hdr.push(i>4?'OT':String(i));hdr.push('T');
var row=function(nm,arr,t){return'<span>'+esc(ab(nm))+'</span>'+arr.map(function(v){return'<span>'+esc(v)+'</span>';}).join('')+'<span class="t">'+esc(t)+'</span>';},aq=x.home?q.opp:q.fla,hq=x.home?q.fla:q.opp;
ls='<div class="bc-ls" aria-label="Score by quarter" style="grid-template-columns:62px repeat('+n+',1fr) 52px">'+hdr.map(function(h){return'<span class="h">'+h+'</span>';}).join('')+row(aw[0],aq,aw[3])+row(hm[0],hq,hm[3])+'</div>';}
var ld=!L&&x.leaders&&x.leaders.length?'<div class="bc-ld"><small>Florida leaders</small>'+x.leaders.slice(0,3).map(function(r){return'<p><b>'+esc(r[1])+'</b><em>'+esc(String(r[2]).replace(/ (YDS|CAR|REC)\b/g,function(m,w){return' '+w.toLowerCase();}))+'</em></p>';}).join('')+'</div>':'';
return'<section class="bc-sc" aria-label="Scoreboard: '+esc(aw[0])+(x.neutral?' vs. ':' at ')+esc(hm[0])+'"'+(L?' aria-live="polite"':'')+'><p class="bc-lbl"><i></i>'+(L?'Live':'Final')+' <span>· '+esc(L?(x.detail||day(x.date)):day(x.date))+'</span></p>'+
teamRow(aw[0],aw[1],aw[2],aw[3],aw===win)+teamRow(hm[0],hm[1],hm[2],hm[3],hm===win)+(lk.length?'<p class="bc-go">'+lk.map(function(h,k){return'<a'+(k?'':' class="bc-o"')+' href="'+esc(h)+'">'+(k?'More':'Game story')+'</a>';}).join('')+'</p>':'')+ls+ld+'</section><span class="bc-slash" aria-hidden="true"></span>';}
function bar(M){var a,at,b,w1,w2,k=0;
if(M.next){var mu=matchup(M.next);a=mu[0];at=mu[1];b=mu[2];w1=day(M.next.k);w2=kick(M.next.k)+(M.next.tv?' · '+M.next.tv:'');k=tba(M.next.k)?0:M.next.k;}
else if(M.card&&!M.live){a=M.card.a;at=M.card.at;b=M.card.b;var ps=M.card.when.split(' · ');w1=ps[0];w2=ps.slice(1).join(' · ');}
else return'';var bm=/^(No\. \d+)\s+(.+)$/.exec(b),am=/^(No\. \d+)\s+(.+)$/.exec(a),t=function(m,s){return m?'<small>'+esc(m[1])+'</small>'+esc(m[2]):esc(s);};
return'<div class="bc-tag">'+(M.pre?'Kickoff':'Next up')+'</div><div class="bc-mu"><span class="bc-t">'+t(am,a)+'</span><span class="bc-at">'+esc(at)+'</span><span class="bc-t">'+t(bm,b)+'</span><span class="bc-when"><b>'+esc(w1)+'</b>'+esc(w2)+'</span></div>'+(k>Date.now()?'<div class="bc-cd" role="timer" aria-label="Time to kickoff" data-k="'+k+'"></div>':'');}
var S={};
function put(el,html,key){if(S[key]===html)return false;S[key]=html;el.innerHTML=html;return true;}
function cdTick(){var cd=document.querySelector(R+' .bc-cd');if(!cd)return;var k=+cd.getAttribute('data-k'),s=k-Date.now();if(s<=0){cd.remove();return;}
var mm=Math.floor(s/6e4),u=[[Math.floor(mm/1440),'Days'],[Math.floor(mm/60)%24,'Hrs'],[mm%60,'Min']];cd.innerHTML=u.map(function(x){return'<div><b>'+(x[0]<10?'0':'')+x[0]+'</b><small>'+x[1]+'</small></div>';}).join('');}
function render(){var root=document.querySelector(R+'[data-bc]');if(!root)return;var M=model(root),band=root.querySelector('.sh-gameday');
var tk=root.querySelector('.bc-tk'),it=tickerItems(root,M);
if(it.length>1){var one=it.map(function(i){return'<a href="'+esc(i[2])+'"><b>'+esc(i[0])+'</b>'+esc(i[1])+'</a>';}).join('');
var html='<span class="bc-bug" aria-hidden="true">GB</span><div class="bc-tw"><div class="bc-trk"><div style="display:flex">'+one+'</div><div style="display:flex" aria-hidden="true" inert>'+one.replace(/<a /g,'<a tabindex="-1" ')+'</div></div></div>';
if(!tk){tk=document.createElement('div');tk.className='bc-tk';tk.setAttribute('role','region');tk.setAttribute('aria-label','GatorBait ticker');root.insertBefore(tk,root.firstChild);}
put(tk,html,'tk');}
var hero=root.querySelector('.bc-hero'),slot=hero&&hero.querySelector('.bc-ps'),ph=band?'':panel(M);
if(hero)hero.classList.toggle('bc-graphic',graphic(root));
if(slot&&put(slot,ph,'ps'))hero.classList.toggle('bc-solo',!ph);
var sd=root.querySelector('.bc-sd');if(sd)put(sd,side(root,M),'sd');setTimeout(balance,0);
var bx=root.querySelector('.bc-nx'),bh=bar(M);if(bx){if(put(bx,bh,'nx'))cdTick();bx.hidden=!bh;var ref=root.querySelector('.sh-reference');if(ref)ref.style.display=bh||D.sb?'none':'';}}
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function shortDate(t){var m=/([A-Z][a-z]+) (\d{1,2}), \d{4}/.exec(t||''),i=m?MONTHS.indexOf(m[1]):-1;return i<0?'':MO[i]+' '+m[2];}
/* Rundown rows from the stories the page already rendered (support stories, then the latest list), newest first as served. */
function rundown(root){var rows=[];[].slice.call(root.querySelectorAll('.sh-support article,.sh-wire-item')).forEach(function(a){var l=a.querySelector('a[href]'),t=a.querySelector('h2,h3'),m=a.querySelector('.sh-meta');
if(!l||!t)return;var mt=m?m.textContent.split(' · '):[];rows.push({h:l.getAttribute('href'),t:t.textContent.trim(),by:(mt[0]||'').trim(),d:shortDate(mt[1]||'')});});
return rows.slice(0,8).map(function(r,i){return'<li class="bc-row"><a href="'+esc(r.h)+'"><span class="bc-n" aria-hidden="true">'+(i<9?'0':'')+(i+1)+'</span><span><h3>'+esc(r.t)+'</h3><span class="bc-by">'+(r.by?'<b>'+esc(r.by)+'</b>':'')+(r.by&&r.d?' · ':'')+esc(r.d)+'</span></span></a></li>';}).join('');}
function img(u,w,h){return/^https:\/\/static\.wixstatic\.com\/media\/[^/]+~mv2\.(jpe?g|png|webp)$/i.test(u)?u+'/v1/fill/w_'+w+',h_'+h+',al_c,q_80,enc_auto/file.jpg':u;}
function side(root,M){var h='',x=M.last,t=x&&x.tape;
if(t&&!M.live){var st=[[t.totalYards,'Total yards'],[t.rushingYards,'Rushing yards'],[t.firstDowns,'First downs'],[t.attendance,'Attendance']].filter(function(v){return v[0]!=null;});
if(st.length)h+='<section aria-label="Game tape"><h2 class="bc-h">Game tape</h2><p class="bc-note">Florida · '+esc(finalLine(x))+'</p><div class="bc-stats">'+st.map(function(v){return'<div class="bc-stat"><b>'+esc(Number(v[0]).toLocaleString('en-US'))+'</b><span>'+v[1]+'</span><i></i></div>';}).join('')+'</div></section>';}
var shots=(D.all||[]).filter(function(f){return/chris spears/i.test(f[3]||'')&&f[4]&&Date.now()-f[0]<30*DAY;}).slice(0,2);
if(shots.length===2)h+='<section aria-label="Best shots"><h2 class="bc-h">Best shots</h2><div class="bc-shots">'+shots.map(function(f){return'<a class="bc-shot" href="'+esc(f[2])+'"><img src="'+esc(img(f[4],480,360))+'" alt="" loading="eager" decoding="async" width="480" height="360"><span>'+esc(f[1])+'</span></a>';}).join('')+'</div></section>';
var sb=D.sb,tb=sb&&Array.isArray(sb.standings)?sb.standings:[];
if(tb.length>=6)h+='<section class="bc-stand" aria-label="SEC standings"><h2 class="bc-h">SEC standings</h2><ol class="bc-tbl"><li class="bc-th" aria-hidden="true"><span></span><b>Team</b><em>SEC</em><small>All</small></li>'+tb.map(function(r,i){var fl=r.team==='Florida';return'<li class="'+(fl?'bc-fl':'')+(i>=6&&!fl?' bc-x':'')+'"><span>'+(i+1)+'</span><b>'+esc(r.team)+'</b><em>'+esc(r.confRecord||'')+'</em><small>'+esc(r.overall||'')+'</small></li>';}).join('')+'</ol></section>';
return h;}
/* Desktop: trim standings rows (never Florida's) until the rail ends level with the rundown, so neither column runs long. */
function balance(){var b=document.querySelector(R+' .bc-body');if(!b)return;var run=b.querySelector('.bc-run'),sd=b.querySelector('.bc-side'),st=b.querySelector('.bc-stand');if(!run||!sd||!st)return;
var rows=[].slice.call(st.querySelectorAll('li:not(.bc-th)'));rows.forEach(function(r){r.hidden=false;});st.hidden=false;if(innerWidth<821)return;
var end=function(el){var l=el.lastElementChild;return l?l.getBoundingClientRect().bottom-el.getBoundingClientRect().top:0;};
for(var i=rows.length-1;i>=0&&end(sd)>end(run)+8;i--){if(!rows[i].classList.contains('bc-fl'))rows[i].hidden=true;}
if(rows.filter(function(r){return!r.hidden;}).length<4)st.hidden=true;}
function build(){
var root=document.querySelector(R);if(!root||root.getAttribute('data-bc'))return;
var main=root.querySelector('#sh-main'),lead=root.querySelector('.sh-lead'),head=root.querySelector('.sh-header'),front=root.querySelector('.sh-front');if(!main||!lead||!front)return;
root.setAttribute('data-bc','1');
var logo=head&&head.querySelector('.sh-brand>a');if(logo&&!logo.querySelector('.bc-wm'))logo.insertAdjacentHTML('beforeend','<span class="bc-wm" aria-hidden="true">Gator<b>Bait</b><small>Media</small></span>');
var join=head&&head.querySelector('.sh-join');if(join&&!join.querySelector('span'))join.innerHTML='<span>'+join.innerHTML+'</span>';
var hero=document.createElement('section');hero.className='bc-hero bc-solo';hero.setAttribute('aria-label','Top story');hero.innerHTML='<div class="bc-ps"></div>';
main.insertBefore(hero,front);hero.appendChild(lead);
var bx=document.createElement('section');bx.className='bc-nx';bx.hidden=true;bx.setAttribute('aria-label','Next game');main.insertBefore(bx,front);
var rows=rundown(root),ttl=root.querySelector('.sh-latest .sh-section-title'),more=root.querySelector('.sh-latest .sh-more');
if(rows){var body=document.createElement('section');body.className='bc-body';body.setAttribute('aria-label','Rundown');
body.innerHTML='<div class="bc-run"><h2 class="sh-section-title">Rundown</h2><ol class="bc-rows">'+rows+'</ol>'+(more?'<a class="sh-more" href="'+esc(more.getAttribute('href'))+'">'+esc(more.textContent)+'</a>':'')+'</div><aside class="bc-side" aria-label="Game tape, best shots and shows"><div class="bc-sd"></div></aside>';
main.insertBefore(body,front);front.classList.add('bc-moved');
var tv=root.querySelector('.sh-watch.bc-tv')||[].slice.call(root.querySelectorAll('.sh-watch:not(.sh-reference)')).find(function(w){return w.querySelector('a[href^="/the-buddy-martin-show"]');});
if(tv){tv.classList.add('bc-tv');body.querySelector('.bc-side').appendChild(tv);}
var voices=root.querySelector('.sh-voices'),la=root.querySelector('.sh-lower>aside');if(voices&&la){la.appendChild(voices);voices.classList.add('bc-stack');}}
[].slice.call(root.querySelectorAll('.sh-watch:not(.sh-reference)')).forEach(function(w){if(w.querySelector('a[href^="/the-buddy-martin-show"]'))w.classList.add('bc-tv');});
render();}
function sync(){if(document.querySelector(R+':not([data-bc])'))build();}
/* Refresh: feed every 3 min, scoreboard every 5 min, ESPN every 30 s inside the game window; all again when the tab comes back. */
function refresh(all){var j=[loadLive()];if(all){j.push(loadFeed(),loadSB());}return Promise.all(j).then(function(){return window_()&&!D.live?loadLive():0;}).then(render);}
loadSB().then(function(){return Promise.all([loadFeed(),loadLive(),loadCfg()]);}).then(render);
var n=0;setInterval(function(){n++;if(document.hidden)return;if(n%6===0)refresh(1);else if(window_())refresh(0);},3e4);
setInterval(function(){if(!document.hidden)cdTick();},3e4);
document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh(1);});
document.addEventListener('gbm:gazette-ready',sync);
var rz=0;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(balance,150);});addEventListener('load',function(){setTimeout(balance,100);});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){setTimeout(balance,50);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
