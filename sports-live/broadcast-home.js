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

/* Owner's white editorial canvas, orange depth and compact Broadcast masthead. */
C += `
@ .bn-pg-jump{grid-column:1/-1;display:block;min-height:44px;padding:12px 16px;background:#fff;color:#a32e09!important;border-top:1px solid #e6d6cb;font:700 14px/1.4 Barlow,sans-serif;text-align:right}
html:has(@) body{background:#fff!important}
@{--dc:Barlow,sans-serif;font:400 16px/1.5 Barlow,sans-serif;--o:#fa4616;--nt:#fff;--tx:#102040;--mu:#52657f;--pk:#a32e09;background:#fff!important;color:#102040!important}
@ .sh-meta{text-transform:none!important;letter-spacing:0!important;font-weight:500!important}
@ h1,@ h2,@ h3{font-family:Barlow,sans-serif!important;font-weight:600;color:#102040!important;text-transform:none!important} @ main{max-width:1280px;padding-inline:24px}
@ .bc-tk{display:none!important}
@ .sh-header{max-width:1280px;padding:18px 24px 0;display:flex;flex-wrap:wrap;gap:12px;background:#fff!important;border-bottom:1px solid #d4dce8!important}
@ .sh-brand{display:flex;align-items:center;flex:1 1 100%;width:100%;gap:30px}
@ .sh-brand>a:first-child{display:block;width:600px;max-width:75%;min-height:0;padding:4px;background:linear-gradient(175deg,#eff8ff,#478edc 20%,#133c80 40%,#b8dcff 48%,#286dcd 62%,#071b52 80%,#72a9eb);clip-path:polygon(16px 0,calc(100% - 16px) 0,100% 50%,calc(100% - 16px) 100%,16px 100%,0 50%);filter:drop-shadow(0 5px 3px #0a173a44)}
@ .bc-wm{display:block;font:inherit;white-space:normal}@ .bn-face{display:flex;justify-content:center;align-items:baseline;gap:18px;padding:11px 24px 16px;background:linear-gradient(175deg,#0b3aa9,#031850 48%,#020c30);clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,12px 100%,0 50%);border-block:1px solid #8dbdff;box-shadow:inset 0 -2px 0 #fa4616}
@ .bn-word{font:700 40px/1.1 Barlow,sans-serif;text-transform:none;letter-spacing:-.03em;background:linear-gradient(180deg,#fff 0,#f4f7ff 24%,#aab8ca 46%,#fff 50%,#dae1ec 62%,#95a6bd);background-clip:text;-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 #5b6e91) drop-shadow(1px 4px 0 #010819)}
@ .bn-face>small{font:700 11px/1.2 Barlow,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#c3d8ff;width:80px}
@ .sh-join{margin-left:auto!important;background:#fa4616!important;color:#102040!important;transform:none!important;clip-path:none!important;border:1px solid #df3b0e!important;box-shadow:0 3px 0 #b83208!important;border-radius:0;font-size:17px!important}@ .sh-join>span{transform:none!important}
@ .sh-header nav{order:3;width:100%;margin:0!important;justify-content:flex-start!important;gap:28px;min-height:48px!important;border-top:1px solid #d4dce8!important}
@ .sh-header nav a{color:#12284d!important;font:700 15px/1 Barlow,sans-serif!important;min-height:48px!important}@ .sh-header nav [aria-current]{color:#102040!important;box-shadow:inset 0 -4px 0 #fa4616}
@ .bc-hero,@ .bc-body,@ .bc-nx{margin-inline:0!important}
@ .bc-hero{display:grid!important;grid-template-columns:minmax(0,1.9fr) minmax(270px,1fr)!important;gap:30px;min-height:0;align-items:start;margin-top:24px}
@ .bc-ps,@ .sh-gameday,@ .bc-slash{display:none!important}
@ .bc-hero .sh-lead,@ .bc-graphic .sh-lead{display:flex!important;flex-direction:column;gap:0!important;min-height:0!important;padding:0!important;border:0!important;clip-path:none!important;background:#fff!important;overflow:visible;box-shadow:none!important;border-radius:0}
@ .bc-hero .sh-lead:after{display:none!important}
@ .bc-hero .sh-lead-copy{display:contents!important;position:static!important}
@ .bc-hero .sh-kicker{order:0;margin:0 0 8px!important;padding:0!important;background:none!important;color:#b2340a!important;border:0!important;border-radius:0;clip-path:none;font:700 11px/1.4 Barlow,sans-serif!important}
@ .bc-hero h1{order:1;margin:0 0 18px!important;max-width:none!important;font:700 38px/1.12 Barlow,sans-serif!important;text-transform:none!important;text-shadow:none!important;color:#102040!important}
@ .bc-hero .sh-lead figure,@ .bc-graphic .sh-lead figure{order:2;display:block;position:relative!important;inset:auto!important;margin:0!important;max-width:none!important;padding:4px!important;width:100%;height:auto!important;background:#fff!important;border:1px solid #c8d2df!important;border-radius:0;box-shadow:7px 7px 0 #fa4616,0 10px 20px #12284d18!important}
@ .bc-hero .sh-lead figure>a{display:block;position:static!important;height:auto!important}
@ .bc-hero .sh-lead img,@ .bc-graphic .sh-lead img{display:block;position:static!important;inset:auto!important;width:100%!important;height:auto!important;max-height:370px!important;aspect-ratio:auto!important;object-fit:contain!important;background:#fff!important}
@ .bc-hero .sh-lead figcaption{position:static!important;padding:5px 3px!important;background:#fff;color:#52657f!important;font-size:10px!important;text-shadow:none!important}
@ .bc-hero .sh-deck{order:3;color:#40536b!important;font:400 17px/1.55 Barlow,sans-serif!important;margin:20px 0 0!important;max-width:680px}
@ .bc-hero .sh-meta{order:4;color:#52657f!important;margin:12px 0 0!important;font:500 11px/1.5 Barlow,sans-serif!important;display:block!important}
@ .bc-hero .sh-read{order:5;align-self:flex-start;display:inline-flex!important;margin:14px 0 0!important;background:#fa4616!important;color:#102040!important;min-height:44px;padding:0 18px!important;border:0!important;border-radius:0;font:800 16px/1 Barlow,sans-serif!important;box-shadow:0 3px 0 #b83208!important}
@ .bc-hero .bc-run{padding:18px 20px 8px!important;border:1px solid #d4dce8;border-top:5px solid #fa4616;background:#fff;box-shadow:5px 5px 0 #fff0e7}
@ .sh-section-title,@ .bc-h{color:#102040!important;text-transform:none!important;font:700 26px/1.2 Barlow,sans-serif!important;letter-spacing:0!important}@ .sh-section-title:after,@ .bc-h:after{background:#fa4616!important;box-shadow:none!important;height:3px!important}
@ .bc-row a{grid-template-columns:26px minmax(0,1fr);gap:12px;border-color:#dbe2eb;color:#102040;padding:18px 0}
@ .bc-n{color:#c4390b;font:700 22px/1 Barlow,sans-serif;text-shadow:none}
@ .bc-row h3{color:#102040!important;font:600 21px/1.22 Barlow,sans-serif!important;text-transform:none!important}
@ .bc-by{color:#64758a;font:500 10px/1.45 Barlow,sans-serif;letter-spacing:.03em}@ .bc-by b{color:#a32e09}
@ .sh-more{color:#102040!important;border-color:#fa4616!important;margin-top:12px;font-size:14px!important}
@ .bc-body{display:block!important;margin-top:35px}@ .bc-side{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;background:#f4f6f9!important;color:#102040!important;padding:22px!important;border:1px solid #d4dce8!important;border-top:4px solid #fa4616!important;border-radius:0;box-shadow:none!important}@ .bc-side:before{display:none}
@ .bc-stat b,@ .bc-tbl li b,@ .bc-tbl li em{color:#102040!important}@ .bc-note,@ .bc-stat span,@ .bc-tbl span,@ .bc-tbl small{color:#52657f!important}@ .bc-tbl li{background:#fff;color:#102040!important;border-bottom:1px solid #d9e1ea}@ .bc-tbl li.bc-fl{box-shadow:inset 3px 0 0 #fa4616;background:#fff0e6}
@ .bc-nx{grid-template-columns:110px minmax(0,1fr) auto;min-height:76px;margin-top:22px!important;padding:0!important;background:#fff8f2!important;color:#102040!important;border:1px solid #e4d4c9!important;border-bottom:3px solid #fa4616!important;border-radius:0;box-shadow:4px 4px 0 #fa46161f!important}
@ .bc-tag{align-self:stretch;background:#fa4616!important;color:#102040!important;clip-path:none!important;font:800 20px/1 Barlow,sans-serif;transform:none!important}
@ .bc-mu{padding:12px 18px;gap:8px 18px}@ .bc-mu .bc-t{color:#102040!important;font:800 29px/1 Barlow,sans-serif!important}@ .bc-mu .bc-t small{color:#3f5678!important;font-size:13px!important}@ .bc-mu .bc-at,@ .bc-when,@ .bc-when b{color:#52657f!important}
@ .bc-cd{background:none!important;padding:0 16px;clip-path:none!important;gap:8px}@ .bc-cd b{background:#fff;border:1px solid #d9dfe7;border-bottom:2px solid #fa4616;color:#102040!important;font-size:30px;min-width:42px;padding:5px;border-radius:0}@ .bc-cd small{color:#52657f!important;font-size:8px}
@ .bc-nx>.bc-sc{display:grid!important;grid-template-columns:100px 1fr 1fr;align-items:center;gap:15px;width:100%;grid-column:1/-1;padding:14px 20px!important;border:0!important;background:transparent!important;box-shadow:none!important}
@ .bc-nx .bc-lbl{color:#b2340a!important;background:none!important;font-size:20px}@ .bc-nx .bc-lbl span{font-size:10px;color:#52657f!important}@ .bc-nx .bc-tm{display:flex;justify-content:space-between;background:none!important;padding:0!important;clip-path:none!important}@ .bc-nx .bc-ab,@ .bc-nx .bc-ls,@ .bc-nx .bc-ld,@ .bc-nx .bc-go{display:none!important}@ .bc-nx .bc-nm{display:block!important;color:#102040!important;font-size:27px}@ .bc-nx .bc-nm small{color:#52657f!important}@ .bc-nx .bc-pt{color:#102040!important;font-size:38px}
@ .sh-lower{gap:30px!important}@ .sh-coverage{grid-template-columns:repeat(3,minmax(0,1fr))!important}@ .sh-coverage article{background:#fff!important;border:0!important;border-bottom:1px solid #d4dce8!important;border-radius:0;box-shadow:none!important;color:#102040!important;padding:0 0 18px!important}
@ .sh-coverage article h2{font:600 22px/1.22 Barlow,sans-serif!important;text-transform:none!important;color:#102040!important;padding-inline:0!important}@ .sh-coverage article .sh-meta{color:#52657f!important;padding-inline:0!important;font-size:11px!important;overflow-wrap:anywhere}@ .sh-coverage img{object-fit:contain!important;clip-path:none!important;border:1px solid #d4dce8;border-radius:0;background:#fff!important}
@ .sh-voices,@ .sh-watch,@ .sh-magazine:not(:has(.sh-mcover)){background:#fff8f2!important;color:#102040!important;border:1px solid #e5d5c7!important;border-top:4px solid #fa4616!important;border-radius:0;box-shadow:5px 5px 0 #fa461618!important}@ .sh-watch h2,@ .sh-magazine h2,@ .sh-voices h2,@ .sh-voices h3{color:#102040!important;text-transform:none!important}@ .sh-watch p:not(.sh-kicker),@ .sh-watch a,@ .sh-magazine a{color:#40536b!important}@ .sh-kicker{color:#a32e09!important}
@ .bn-pregame{margin:35px 0;border:1px solid #d7dfe9;border-top:5px solid #fa4616;background:#fff;box-shadow:6px 6px 0 #fa461619;padding:22px}
@ .bn-pregame header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d7dfe9;padding-bottom:15px;margin-bottom:4px}@ .bn-pregame header p{color:#a32e09;font:700 11px/1.4 Barlow,sans-serif;text-transform:uppercase;letter-spacing:.1em}@ .bn-pregame h2{font:700 28px/1.2 Barlow,sans-serif!important;text-transform:none!important}@ .bn-pregame header>span{font:500 11px Barlow,sans-serif;color:#52657f}@ .bn-pregame ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 30px;list-style:none;padding:0;margin:0}@ .bn-pregame li{border-bottom:1px solid #dce3ec}@ .bn-pregame li>a{display:block;padding:16px 0;min-height:44px}@ .bn-pregame h3{font:600 21px/1.22 Barlow,sans-serif!important;text-transform:none!important;color:#102040!important}@ .bn-pregame .bc-by{margin-top:8px}
@media(max-width:820px){@ .sh-header{display:none!important}@ main{padding-inline:16px!important}@ .bc-hero{display:flex!important;flex-direction:column;gap:26px;margin-top:20px}@ .bc-hero .sh-lead{order:0!important;width:100%}@ .bc-hero .sh-lead figure{order:0!important;box-shadow:4px 4px 0 #fa4616!important}@ .bc-hero .sh-kicker{order:1;margin-top:18px!important}@ .bc-hero h1{order:2;font-size:30px!important;line-height:1.12!important;margin-bottom:8px!important}@ .bc-hero .sh-read{order:3;margin-top:6px!important}@ .bc-hero .sh-deck{order:4;margin-top:16px!important;font-size:16px!important;display:block!important;-webkit-line-clamp:unset!important}@ .bc-hero .sh-meta{order:5}@ .bc-hero .bc-run{width:100%}@ .bc-row h3{font-size:21px!important}@ .bc-body{margin-top:25px}@ .bc-side{grid-template-columns:1fr;padding:18px!important}@ .bc-nx{grid-template-columns:82px minmax(0,1fr);gap:10px;padding:0!important;min-height:76px;margin-top:16px!important}@ .bc-tag{font-size:16px;padding:10px 8px}@ .bc-mu{padding:11px 10px;display:block}@ .bc-mu .bc-t{font-size:23px!important}@ .bc-mu .bc-t small{display:inline!important;margin-right:4px}@ .bc-mu .bc-at{font-size:14px!important;margin:0 6px}@ .bc-when{font-size:10px;margin-top:5px}@ .bc-when b{font-size:10px!important}@ .bc-cd{grid-column:1/-1;padding:8px 12px;border-top:1px solid #e3d5c9;justify-content:flex-end}@ .bc-cd b{font-size:24px;min-width:35px}@ .bc-nx>.bc-sc{grid-template-columns:65px 1fr 1fr;padding:12px!important;gap:10px}@ .bc-nx .bc-lbl{font-size:15px}@ .bc-nx .bc-lbl span{display:none}@ .bc-nx .bc-nm{font-size:21px!important}@ .bc-nx .bc-pt{font-size:30px!important}@ .sh-coverage{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:20px 16px!important}@ .sh-coverage h2{font-size:21px!important}@ .bn-pregame{padding:18px;margin-block:28px}@ .bn-pregame ol{grid-template-columns:1fr}@ .bn-pregame h2{font-size:26px!important}@ .bn-pregame h3{font-size:21px!important}}
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
var en=i.querySelector('enclosure');out.push([Date.parse(q('pubDate'))||0,q('title'),u.pathname,q('creator'),en?en.getAttribute('url')||'':'',bnText(q('description'))]);});
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
var qs=function(t){var r=(t.linescores||[]).map(function(l){return Number(l.value);});while(r.length<4)r.push('\u2013');return r;};D.live={id:w.id,state:ty.state,done:!!ty.completed,detail:ty.shortDetail||'',q:{fla:qs(us),opp:qs(th)},fla:Number(us.score),opp:Number(th.score),oppName:th.team.location,oppRank:rk(th),flaRank:rk(us),
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
if(lv&&lv.state==='in')M.live={opp:lv.oppName,oppRank:lv.oppRank,flaRank:lv.flaRank,fla:lv.fla,oppS:lv.opp,home:lv.home,neutral:lv.neutral,detail:lv.detail,date:lv.date,q:lv.q};
if(lv&&lv.state==='post'&&lv.done)M.last={opp:lv.oppName,oppRank:lv.oppRank,fla:lv.fla,oppS:lv.opp,home:lv.home,neutral:lv.neutral,date:lv.date,q:lv.q,links:[]};
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
var ls='',q=x.q;if(q&&q.fla&&q.opp&&q.fla.length===q.opp.length&&q.fla.length>=4){var n=q.fla.length,hdr=[''];for(var i=1;i<=n;i++)hdr.push(i>4?'OT':String(i));hdr.push('T');
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
function render(){var root=document.querySelector(R+'[data-bc]');if(!root)return;var M=model(root),band=root.querySelector('.sh-gameday');bnView(root);
var tk=root.querySelector('.bc-tk'),it=tickerItems(root,M);
if(it.length>1){var one=it.map(function(i){return'<a href="'+esc(i[2])+'"><b>'+esc(i[0])+'</b>'+esc(i[1])+'</a>';}).join('');
var html='<span class="bc-bug" aria-hidden="true">GB</span><div class="bc-tw"><div class="bc-trk"><div style="display:flex">'+one+'</div><div style="display:flex" aria-hidden="true" inert>'+one.replace(/<a /g,'<a tabindex="-1" ')+'</div></div></div>';
if(!tk){tk=document.createElement('div');tk.className='bc-tk';tk.setAttribute('role','region');tk.setAttribute('aria-label','GatorBait ticker');root.insertBefore(tk,root.firstChild);}
put(tk,html,'tk');}
var hero=root.querySelector('.bc-hero'),slot=hero&&hero.querySelector('.bc-ps'),ph=band?'':panel(M);
if(hero)hero.classList.toggle('bc-graphic',graphic(root));
if(slot&&put(slot,ph,'ps'))hero.classList.toggle('bc-solo',!ph);
var sd=root.querySelector('.bc-sd');if(sd)put(sd,side(root,M),'sd');setTimeout(balance,0);
var bx=root.querySelector('.bc-nx'),bh=(M.live||(!M.pre&&M.last))?panel(M):bar(M);if(bx){if(bh)bh+='<a class="bn-pg-jump" href="#bc-pregame">Pregame coverage →</a>';if(put(bx,bh,'nx'))cdTick();bx.hidden=!bh;var ref=root.querySelector('.sh-reference');if(ref)ref.style.display=bh||D.sb?'none':'';}}
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

/* Broadcast presentation adapter. Existing RSS and ESPN model remain authoritative. */
var BN_SEED = [["2026-10-17T10:30:02.154Z", "Aberdeen will be in the lineup against Baylor on Sunday", "/post/aberdeen-will-be-in-the-lineup-against-baylor-on-sunday", "Franz Beard", "https://static.wixstatic.com/media/16b519_290bf3f6c66e455e9386bfc3136bbeb1~mv2.jpg", "Franz Beard: Denzel Aberdeen starts Sunday when preseason No. 1 Florida opens with a Baylor exhibition in Jacksonville, and his fifth-year case should hold up. Plus SEC coaches on the NCAA and 11 international recruits to watch."], ["2026-10-16T20:08:54.995Z", "Is the SEC undergoing a drain of excellence?", "/post/is-the-sec-undergoing-a-drain-of-excellence", "Buddy Martin", "https://static.wixstatic.com/media/d3cfa5_927b7ee1fa71438396dcae09cac639b8~mv2.png", "Parody or parity? Buddy Martin on a 24-team playoff and an SEC that hasn’t lost excellence so much as its monopoly on it. Me, I worry that the scavengers have come for what’s left of college football."], ["2026-10-16T11:06:34.785Z", "The Soothsayer: Texas big unless the UF defense finds an exorcist", "/post/the-soothsayer-texas-big-unless-the-uf-defense-finds-an-exorcist", "Franz Beard", "https://static.wixstatic.com/media/d3cfa5_65da416fd88a4a60a2c65e8b8c467e16~mv2.jpg", "Franz Beard: Florida is the man with the rope around his neck and Texas is the jukebox. The Soothsayer on Tramell Jones Jr.’s first start, Will Muschamp’s defense, an 11.5-point line and every SEC game Saturday."], ["2026-10-16T00:31:58.002Z", "Watch the Replay: Buddy Martin's Philo Injury Exclusive, With Chris Doering", "/post/buddy-martin-show-live-tonight-philo-jones-texas", "Brenden Martin", "https://static.wixstatic.com/media/16b519_5b0ae0716772496c83643fe90f8ec91d~mv2.jpg", "The Buddy Martin Show is live at 9 p.m. ET with the Philo-or-Jones question ahead of Florida at No. 7 Texas. Watch on the show page or YouTube."], ["2026-10-15T14:31:03Z", "QB1 Philo Hurt. QB2 Jones To Start? Explained by That Great Football Mind Ted Lasso", "/post/qb1-philo-hurt-qb2-jones-to-start-explained-by-that-great-football-mind-ted-lasso", "Buddy Martin", "https://static.wixstatic.com/media/ae876a_e7e6b18d0081478cb9f4ab40a7486267~mv2.jpg", "Buddy Martin called in the two greatest minds he knows, Albert Einstein and Ted Lasso, to explain Jon Sumrall's reverse thermostat, why calm is not surrender, and why Gator fans might not be crazy for believing. Members, the biscuits are inside.\n\nEinstein had relativity. Ted Lasso has biscuits. And an amazing attitude. So does Tramell Jones."], ["2026-10-15T11:52:43.840Z", "So You're Saying There's a Chance!?", "/post/so-you-re-saying-there-s-a-chance-1", "Eddie Gilley", "https://static.wixstatic.com/media/d3cfa5_65da416fd88a4a60a2c65e8b8c467e16~mv2.jpg", "Well, the low scoring Longhorns have their struggles, too. I wrote earlier in the week about the similarities of the stats between UF and UM last weekend in every category but the one that matters. Facing the Texas Longhorns on the road in Austin is a tough task for a team that hasn't played well in the last two weeks. The Gators hit the road as a 10.5-point underdog. Is there anything that points to a possible Gator victory? The Gators will face the #3 total defense in the SEC in the Will..."], ["2026-10-14T23:41:40.972Z", "Philo's injury could give Tramell Jones Jr. his opening", "/post/philo-s-injury-could-give-tramell-jones-jr-his-opening", "Franz Beard", "https://static.wixstatic.com/media/d3cfa5_886c22d32224408e933692539abaa54c~mv2.jpg", "Franz Beard considers what a strong game at Texas could mean for Tramell Jones Jr. if Aaron Philo cannot play, plus his latest coaching hot-seat roundup."], ["2026-10-14T19:15:39Z", "Report: Aaron Philo's status uncertain for Florida's trip to Texas", "/post/report-aaron-philo-s-status-uncertain-for-florida-s-trip-to-texas", "Brenden Martin", "https://static.wixstatic.com/media/d3cfa5_8e8e9000b0044c4d8375ed1fd8ee7399~mv2.jpg", "Aaron Philo was limited at practice Wednesday, according to On3. Tramell Jones Jr. would be next in line if Philo cannot play."], ["2026-10-14T13:18:24.923Z", "Thoughts of the Day: Franz Beard, Oct. 14, 2026", "/post/thoughts-of-the-day-october-14-2026", "Franz Beard", "https://static.wixstatic.com/media/d3cfa5_087caa7bb241448d85154f687e83487d~mv2.png", "Florida’s trip to Texas brings familiar faces and pressing questions. Franz Beard examines the Muschamp and Manning storylines, plus the offensive and defensive issues the Gators must address."], ["2026-10-13T15:36:00.173Z", "Buddy Blog: A Gator Ass-Whipping, With Bowl Projections in the Ashes", "/post/buddy-blog-a-gator-ass-whipping-with-bowl-projections-in-the-ashes", "Buddy Martin", "https://static.wixstatic.com/media/d3cfa5_9d0c9cbd2bcd492a8987e073294f6b94~mv2.jpg", "Trying to find two more wins is going to take patience and ibuprofen"], ["2026-10-13T12:51:07Z", "Philo is the Florida quarterback at least for now", "/post/philo-is-the-florida-quarterback-at-least-for-now", "Franz Beard", "https://static.wixstatic.com/media/d3cfa5_9757cdda175141a595ad34d51439d9c6~mv2.jpg", "Because it is universally described as the single most important position in all of team sports, when it comes to football fingers immediately point to the quarterback whenever things go south, which they have the last two weeks for the Florida Gators (4-2, 2-2 SEC). Aaron Philo, whose numbers were just a shade under brilliant in Florida's 4-0 September have taken a serious plunge in losses to Missouri and South Carolina. In the four wins, Philo was 76-104 passing, good for 1,091 yards (10.49..."], ["2026-10-12T22:22:23Z", "Numbers Don't Lie", "/post/numbers-don-t-lie", "Eddie Gilley", "https://static.wixstatic.com/media/16b519_8c09fa34b35448a190b6988b94a45f5f~mv2.jpg", "Florida and South Carolina were nearly even in first downs and yards, but the Gators lost 38-19. Eddie Gilley on the three turnovers and two short fields behind a statistical draw."], ["2026-10-12T21:19:22Z", "No surprise here: Gators picked to win SEC basketball title", "/post/gators-picked-to-win-sec-basketball-title", "Franz Beard", "https://static.wixstatic.com/media/16b519_9448e7a7fd6b42719770cf06b8ba8d74~mv2.jpg", "Florida is the preseason SEC basketball favorite, Tommy Haugh is preseason Player of the Year, and Franz Beard looks at the Gators' frontcourt, UNF scrimmage and preseason outlook."], ["2026-10-12T19:06:37Z", "An Anatomy Of Total Gator Collapse: A Swamp Strewn With Broken Dreams", "/post/an-anatomy-of-total-gator-collapse-a-swamp-strewn-with-broken-dreams", "Buddy Martin", "https://static.wixstatic.com/media/d3cfa5_8acb17fa05274836baf80421256e7668~mv2.jpg", "Buddy Martin examines Florida's consecutive losses and asks whether the failures are separate football problems or symptoms of something larger."], ["2026-10-12T11:34:38.201Z", "Texas opens as a 10-point favorite against Florida", "/post/texas-opens-as-a-10-point-favorite-against-florida", "Franz Beard", "https://static.wixstatic.com/media/d3cfa5_0c63378bb9a24a34884987d24f487fde~mv2.png", "Franz Beard on Florida's response to consecutive losses as Texas opens as a 10-point favorite, plus Easton Royal's commitment and the latest SEC notes."], ["2026-10-11T18:35:56Z", "Gators Drop Out of AP Top 25 After Second Straight Loss", "/post/gators-drop-out-ap-top-25-october-11-2026", "GatorBaitMagazineStaff", "https://static.wixstatic.com/media/d3cfa5_8183df2e1ce141dcaa4f4abaae22aaca~mv2.jpg", "Florida falls out of the Oct. 11 AP Top 25 after a 38-19 loss to South Carolina. Georgia takes No. 1, and the Gators visit No. 7 Texas next."], ["2026-10-11T16:27:39Z", "Buddy Blog: Can Sumrall Swim In The Deep End Of This Cesspool?", "/post/buddy-blog-can-sumrall-swim-in-the-deep-end-of-this-cesspool", "Buddy Martin", "https://static.wixstatic.com/media/16b519_46d2d14e73354d91b7f848e45cceabb5~mv2.jpg", "Buddy Martin on a South Carolina collapse that raises the hard question about Jon Sumrall and a season suddenly at risk."], ["2026-10-11T16:22:47.149Z", "From the Sideline: Chris Spears on the 500th Game in The Swamp", "/post/from-the-sideline-chris-spears-on-the-500th-game-in-the-swamp", "Chris Spears", "https://static.wixstatic.com/media/16b519_79987fbda38743d9842a0ba355b3e83a~mv2.jpg", "Chris Spears on the view from the sideline for the 500th game in The Swamp, from the runout to Bailey Stockton's touchdown."], ["2026-10-11T16:00:00Z", "Members: Read the Texas Pregame Magazine", "/post/members-read-the-texas-pregame-magazine", "Brenden Martin", "https://static.wixstatic.com/media/d3cfa5_c1074801312349d9a08dabde5c4ac23f~mv2.jpg", "Read the Texas pregame magazine on your phone: Buddy Martin on the QB1 question, Franz Beard on Tramell Jones Jr. and the Soothsayer’s SEC picks, and the full preview of Florida at No. 7 Texas. Members can also download the 27-page print edition (PDF)."], ["2026-10-11T13:37:37.127Z", "Members: Read the Postgame Magazine", "/post/members-download-the-postgame-magazine-pdf", "Brenden Martin", "https://static.wixstatic.com/media/16b519_7c43c1e7f1be4ebea73828283b12bd73~mv2.jpg", "Read the current South Carolina postgame magazine on your phone: 10 stories, led by Buddy Martin’s new Sumrall column and closing with Chris Spears’ sideline column. The earlier fixed-layout PDF remains available as an archive."], ["2026-10-11T10:34:55.254Z", "After a second sobering loss, can Florida's season still be salvaged?", "/post/after-a-second-sobering-loss-can-florida-s-season-still-be-salvaged", "Franz Beard", "https://static.wixstatic.com/media/16b519_6c0bd115c2c849bca004f49afa7ae417~mv2.jpg", "Franz Beard on South Carolina 38, Florida 19: a lost line of scrimmage, a quarterback question for Austin and a defense that keeps throwing things at the wall. Can the season still be salvaged?"], ["2026-10-11T04:44:19.522Z", "Chris Spears' Best Shots: South Carolina 38, Florida 19", "/post/chris-spears-best-shots-south-carolina-38-florida-19", "Chris Spears", "https://static.wixstatic.com/media/16b519_60244446a0b246dbbeae06a0cbb1e3c2~mv2.jpg", "36 photos from Chris Spears on the sideline for the 500th game in The Swamp: the runout, Bailey Stockton's 59-yard touchdown and Jon Sumrall during South Carolina's 38-19 win."]];
var BN_MEDIA = {"16b519_290bf3f6c66e455e9386bfc3136bbeb1": {"alt": "Florida’s Alex Condon (21) dunks against UConn in the NCAA Tournament (Photo by Chris Spears, GatorBait Media)", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_927b7ee1fa71438396dcae09cac639b8": {"alt": "How the reported 24-team College Football Playoff would work: four Power Four champions, the top Group of Six team and 19 at-large teams. Graphic: GatorBait Media.", "credit": "Graphic: GatorBait Media"}, "d3cfa5_65da416fd88a4a60a2c65e8b8c467e16": {"alt": "Florida’s defense swarms an Auburn ball carrier at Jordan-Hare Stadium on Sept. 19 (Photo by Chris Spears, GatorBait Media)", "credit": "Photo by Chris Spears, GatorBait Media"}, "16b519_5b0ae0716772496c83643fe90f8ec91d": {"alt": "Buddy Martin asks a question, microphone in hand, at a Florida football press conference. Photo by Chris Spears, GatorBait Media.", "credit": "Photo by Chris Spears, GatorBait Media"}, "ae876a_e7e6b18d0081478cb9f4ab40a7486267": {"alt": "Ted Lasso (Jason Sudeikis) at a press conference in the Apple TV+ series \"Ted Lasso.\" Photo: Apple TV+", "credit": "Photo: Apple TV+"}, "d3cfa5_886c22d32224408e933692539abaa54c": {"alt": "Aaron Philo, No. 12, at left, and Tramell Jones Jr., No. 9, at right, on Florida's sideline against South Carolina on Oct. 10, 2026.", "credit": ""}, "d3cfa5_8e8e9000b0044c4d8375ed1fd8ee7399": {"alt": "Aaron Philo runs against Auburn on Sept. 19, 2026. Archival photo by Chris Spears, GatorBait Media.", "credit": ""}, "d3cfa5_087caa7bb241448d85154f687e83487d": {"alt": "Editorial illustration reading Ghosts in Austin and Franz Beard beside an empty stadium tunnel, with blue and orange light and faint football diagrams.", "credit": ""}, "d3cfa5_9d0c9cbd2bcd492a8987e073294f6b94": {"alt": "Florida's sideline during the South Carolina game at Ben Hill Griffin Stadium on Oct. 10, 2026. Photo by Chris Spears, GatorBait Media.", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_9757cdda175141a595ad34d51439d9c6": {"alt": "Florida quarterback Aaron Philo (No. 12) stands with head coach Jon Sumrall on the Florida sideline during the South Carolina game at Ben Hill Griffin Stadium in Gainesville.", "credit": ""}, "16b519_8c09fa34b35448a190b6988b94a45f5f": {"alt": "Featured image for Numbers Don't Lie", "credit": ""}, "16b519_9448e7a7fd6b42719770cf06b8ba8d74": {"alt": "Featured image for No surprise here: Gators picked to win SEC basketball title", "credit": ""}, "d3cfa5_8acb17fa05274836baf80421256e7668": {"alt": "Steve Spurrier raises an arm on the sideline at Ben Hill Griffin Stadium. Photo by Chris Spears / Gator Bait Media.", "credit": "Photo by Chris Spears / Gator Bait Media"}, "d3cfa5_0c63378bb9a24a34884987d24f487fde": {"alt": "GatorBait editorial illustration reading Texas Ahead for Franz Beard's October 12, 2026 Thoughts of the Day, with a football on the right against a navy background.", "credit": ""}, "d3cfa5_8183df2e1ce141dcaa4f4abaae22aaca": {"alt": "Featured image for Gators Drop Out of AP Top 25 After Second Straight Loss", "credit": ""}, "16b519_46d2d14e73354d91b7f848e45cceabb5": {"alt": "Featured image for Buddy Blog: Can Sumrall Swim In The Deep End Of This Cesspool?", "credit": ""}, "16b519_79987fbda38743d9842a0ba355b3e83a": {"alt": "Featured image for From the Sideline: Chris Spears on the 500th Game in The Swamp", "credit": ""}, "d3cfa5_c1074801312349d9a08dabde5c4ac23f": {"alt": "GatorBait Magazine Friday Pregame cover, Oct. 16, 2026: Aaron Philo and Tramell Jones Jr. set large on a navy and orange field with an OR badge between them under the headline Who’s QB1 in Austin? Photos by Chris Spears, GatorBait Media.", "credit": "Photos by Chris Spears, GatorBait Media"}, "16b519_7c43c1e7f1be4ebea73828283b12bd73": {"alt": "Florida players run out of the tunnel through smoke for the 500th game in The Swamp. Photo by Chris Spears, GatorBait Media.", "credit": "Photo by Chris Spears, GatorBait Media"}, "16b519_6c0bd115c2c849bca004f49afa7ae417": {"alt": "Florida's offensive line works against the South Carolina front at Ben Hill Griffin Stadium on Oct. 10. Photo by Chris Spears, GatorBait Media.", "credit": "Photo by Chris Spears, GatorBait Media"}, "16b519_60244446a0b246dbbeae06a0cbb1e3c2": {"alt": "Bailey Stockton (3) races toward the end zone on his 59-yard touchdown catch against South Carolina at Ben Hill Griffin Stadium on Oct. 10. Photo by Chris Spears, GatorBait Media.", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_76a430063f5b40d6a008010165fbe093": {"alt": "", "credit": "GatorBait Media"}, "d3cfa5_9dbc974303bb4e4080580502a1c6b727": {"alt": "", "credit": "GatorBait Media"}, "d3cfa5_56a64986c874417c9a8299fae22649ed": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media · Faulkner: UAA"}, "d3cfa5_d3190d83cdfc44549b10b6bd025e57a3": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_2ea58f38e2da4c988ab73065cfe63130": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_026d2a4d2be04a91b8c32317fed5f623": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_1043f4b7772245baa5aed5f80c21669a": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media"}, "16b519_a0e407bedc46487ca71033fc8351d0fe": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_e1f06a6dd4ca414885aafdaf6db6ec35": {"alt": "", "credit": "Photo: Hannah White / UAA Communications"}, "16b519_00359caad82744778e7c387d8bf98777": {"alt": "", "credit": "Photo by Chris Spears, GatorBait Media"}, "d3cfa5_49718366a7af45c8b41d687433e56d4f": {"alt": "", "credit": "GatorBait Media"}, "d3cfa5_881bf92c88194db396e3e532bbfc1144": {"alt": "", "credit": "GatorBait Media"}, "d3cfa5_a40ca60a9ebd435dafcdbbad7a5368fc": {"alt": "", "credit": "GatorBait Media"}, "d3cfa5_da6d16c6f8ab464c9f2d7d493bd66050": {"alt": "", "credit": "Photo: Rachel Rusch/UAA Communications"}, "d3cfa5_c214167d15d845ea95c7c5ddecc196dc": {"alt": "", "credit": "Photo: UAA"}};
var BN_PREGAME = ["/post/the-soothsayer-texas-big-unless-the-uf-defense-finds-an-exorcist", "/post/buddy-martin-show-live-tonight-philo-jones-texas", "/post/qb1-philo-hurt-qb2-jones-to-start-explained-by-that-great-football-mind-ted-lasso", "/post/so-you-re-saying-there-s-a-chance-1", "/post/philo-s-injury-could-give-tramell-jones-jr-his-opening", "/post/report-aaron-philo-s-status-uncertain-for-florida-s-trip-to-texas", "/post/thoughts-of-the-day-october-14-2026", "/post/philo-is-the-florida-quarterback-at-least-for-now", "/post/texas-opens-as-a-10-point-favorite-against-florida", "/post/members-read-the-texas-pregame-magazine"];
function bnRows(){var seen=Object.create(null);BN_SEED.forEach(function(p){seen[p[2]]=[Date.parse(p[0]),p[1],p[2],p[3],p[4],p[5]];});(D.all||[]).forEach(function(p){if(!p[2]||p[2].indexOf('/post/')!==0||!p[1])return;var old=seen[p[2]]||[];seen[p[2]]=[p[0]||old[0]||0,p[1],p[2],p[3]||old[3]||'',p[4]||old[4]||'',p[5]||old[5]||''];});return Object.keys(seen).map(function(k){return seen[k];}).sort(function(a,b){return b[0]-a[0]||a[2].localeCompare(b[2]);}).reduce(function(o,r,i,all){/* Game-day lead (Brenden, Oct. 17): hold the Soothsayer on top until 18:30Z; after that the newest story leads on its own. */if(i===0&&Date.now()<Date.parse('2026-10-17T18:30:00Z')){var g=all.filter(function(q){return q[2].indexOf('/post/the-soothsayer-texas-big-unless')===0;})[0];if(g)o.push(g);}if(o[0]!==r)o.push(r);return o;},[]);}
function bnText(v){var d=new DOMParser().parseFromString(v||'','text/html');[].slice.call(d.querySelectorAll('script,style')).forEach(function(n){n.remove();});return(d.body.textContent||'').replace(/\s+/g,' ').trim();}
function bnMedia(u){var mid=(/\/media\/([^/~?]+)/.exec(u||'')||[])[1];return BN_MEDIA[mid]||{};}
function bnPregame(p){if(BN_PREGAME.indexOf(p[2])>=0)return true;if(BN_SEED.some(function(q){return q[2]===p[2];}))return false;var title=p[1]||'',text=title+' '+(p[5]||'');return p[0]>=Date.parse('2026-10-11T00:00:00Z')&&p[0]<Date.parse('2026-10-17T16:00:00Z')&&!/postgame|recap|final score|game result/i.test(title)&&/\b(?:texas|longhorns?|philo|tramell|soothsayer)\b/i.test(text);}
function bnMeta(p){return esc(p[3]||'')+' · '+esc(day(p[0]));}
function bnView(root){
var all=bnRows();if(!all.length)return;var sig=JSON.stringify(all);if(root.__bnNewsSig===sig)return;root.__bnNewsSig=sig;
var top=all[0],lead=root.querySelector('.sh-lead'),seed=BN_SEED.find(function(p){return p[2]===top[2];}),deck=top[5]||(seed&&seed[5])||'',media=bnMedia(top[4]);
if(lead)lead.innerHTML='<figure>'+(top[4]?'<a href="'+esc(top[2])+'"><img src="'+esc(top[4])+'" alt="'+esc(media.alt||top[1])+'" decoding="async" fetchpriority="high"></a>':'')+(media.credit?'<figcaption>'+esc(media.credit)+'</figcaption>':'')+'</figure><div class="sh-lead-copy"><p class="sh-kicker">On the front page</p><h1><a href="'+esc(top[2])+'">'+esc(top[1])+'</a></h1>'+(deck?'<p class="sh-deck">'+esc(deck)+'</p>':'')+'<p class="sh-meta">'+bnMeta(top)+'</p><a class="sh-read" href="'+esc(top[2])+'">Read the story →</a></div>';
var run=root.querySelector('.bc-rows');if(run)run.innerHTML=all.slice(1,4).map(function(p,i){return'<li class="bc-row"><a href="'+esc(p[2])+'"><span class="bc-n">0'+(i+2)+'</span><span><h3>'+esc(p[1])+'</h3><span class="bc-by"><b>'+esc(p[3])+'</b> · '+esc(day(p[0]))+'</span></span></a></li>';}).join('');
var coverage=root.querySelector('.sh-coverage');if(coverage)coverage.innerHTML=all.slice(4).map(function(p,i){return'<article><a href="'+esc(p[2])+'">'+(i<3&&p[4]?'<img src="'+esc(p[4])+'" alt="'+esc(p[1])+'" loading="lazy" decoding="async">':'')+'<p class="sh-meta">'+bnMeta(p)+'</p><h2>'+esc(p[1])+'</h2></a></article>';}).join('');
var pg=all.filter(bnPregame);
var block=root.querySelector('.bn-pregame');if(!block){block=document.createElement('section');block.className='bn-pregame bc-pregame';block.id='bc-pregame';block.setAttribute('aria-labelledby','bn-pregame-title');var lower=root.querySelector('.sh-lower');if(lower)lower.parentNode.insertBefore(block,lower);}
block.innerHTML='<header><div><p>Florida at Texas</p><h2 id="bn-pregame-title">The pregame desk</h2></div><span>'+pg.length+' stories</span></header><ol>'+pg.map(function(p){return'<li><a href="'+esc(p[2])+'"><h3>'+esc(p[1])+'</h3><span class="bc-by"><b>'+esc(p[3])+'</b> · '+esc(day(p[0]))+'</span></a></li>';}).join('')+'</ol><a class="sh-more" href="/gatorbait-media-blogs">Full story archive →</a>';
}

function build(){
var root=document.querySelector(R);if(!root||root.getAttribute('data-bc'))return;
var main=root.querySelector('#sh-main'),lead=root.querySelector('.sh-lead'),head=root.querySelector('.sh-header'),front=root.querySelector('.sh-front');if(!main||!lead||!front)return;
root.setAttribute('data-bc','1');
var logo=head&&head.querySelector('.sh-brand>a');if(logo&&!logo.querySelector('.bc-wm'))logo.insertAdjacentHTML('beforeend','<span class="bc-wm" aria-hidden="true"><span class="bn-face"><span class="bn-word">GatorBait</span><small>Sports Network</small></span></span>');
var join=head&&head.querySelector('.sh-join');if(join&&!join.querySelector('span'))join.innerHTML='<span>'+join.innerHTML+'</span>';
var hero=document.createElement('section');hero.className='bc-hero bc-solo';hero.setAttribute('aria-label','Top story');hero.innerHTML='<div class="bc-ps"></div>';
main.insertBefore(hero,front);hero.appendChild(lead);
var bx=document.createElement('section');bx.className='bc-nx';bx.hidden=true;bx.setAttribute('aria-label','Next game');main.insertBefore(bx,hero);
var rows=rundown(root),ttl=root.querySelector('.sh-latest .sh-section-title'),more=root.querySelector('.sh-latest .sh-more');
if(rows){var body=document.createElement('section');body.className='bc-body';body.setAttribute('aria-label','Rundown');
body.innerHTML='<div class="bc-run"><h2 class="sh-section-title">Rundown</h2><ol class="bc-rows">'+rows+'</ol>'+(more?'<a class="sh-more" href="'+esc(more.getAttribute('href'))+'">'+esc(more.textContent)+'</a>':'')+'</div><aside class="bc-side" aria-label="Game tape, best shots and shows"><div class="bc-sd"></div></aside>';
main.insertBefore(body,front);hero.appendChild(body.querySelector('.bc-run'));front.classList.add('bc-moved');
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
