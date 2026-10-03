/* GatorBait Magazine 2026: the weekly web issue on /magazine. Issue 2026-10-02-friday-pregame, build 8ec91d1b.
 * BUILT, MINIFIED FILE: edit sports-live/src/magazine.{css,js} or sports-live/magazine-issue.json, then run:
 * NODE_PATH=<dir with esbuild> node sports-live/build-magazine.mjs
 */
(function () {
  'use strict';
  var CSS = "html:has(#gbm-magazine-page.mz26) #SITE_PAGES,html.gbm-magazine-live #SITE_PAGES,html.gbm-magazine-live #pageBackground_nh0hy{display:none!important}\nhtml.gbm-magazine-live #SITE_CONTAINER,html.gbm-magazine-live #masterPage,html.gbm-magazine-live #PAGES_CONTAINER,html.gbm-magazine-live #SITE_PAGES_TRANSITION_GROUP{height:auto!important;min-height:0!important;padding-bottom:0!important;margin-bottom:0!important}\n#gbm-magazine-page.mz26{\n--mz-paper:#f3efe5;--mz-cream:#fffaf0;--mz-ink:#10264b;--mz-ink-2:#42506a;--mz-mute:#526075;--mz-rule:#b5b7b8;--mz-rule-soft:#d9d4c7;\n--mz-blue:#123dc9;--mz-orange:#f15a24;--mz-orange-ink:#a83511;--mz-orange-soft:#ff864d;--mz-shadow:#c9c3b5;\n--mz-cond:\"Barlow Condensed\",\"Barlow\",sans-serif;--mz-sans:\"Barlow\",sans-serif;--mz-mast:\"Bebas Neue\",\"Barlow Condensed\",\"Barlow\",sans-serif;--mz-pad:16px;\ndisplay:block;position:relative;z-index:3;width:100%;min-width:0;overflow-x:clip;\nbackground:var(--mz-paper);color:var(--mz-ink);font:16px/1.5 var(--mz-sans);\npadding:0 0 40px;text-size-adjust:100%;-webkit-text-size-adjust:100%\n}\n#gbm-magazine-page.mz26 *,#gbm-magazine-page.mz26 *::before,#gbm-magazine-page.mz26 *::after{box-sizing:border-box}\n#gbm-magazine-page.mz26 h1,#gbm-magazine-page.mz26 h2,#gbm-magazine-page.mz26 h3,#gbm-magazine-page.mz26 h4,#gbm-magazine-page.mz26 p,#gbm-magazine-page.mz26 ul,#gbm-magazine-page.mz26 ol,#gbm-magazine-page.mz26 figure,#gbm-magazine-page.mz26 table{margin:0;padding:0}\n#gbm-magazine-page.mz26 ul,#gbm-magazine-page.mz26 ol{list-style:none}\n#gbm-magazine-page.mz26 a{color:inherit;text-decoration:none}\n#gbm-magazine-page.mz26 a:focus-visible{outline:3px solid var(--mz-orange);outline-offset:4px}\n#gbm-magazine-page.mz26 img{display:block;max-width:100%;height:auto}\n#gbm-magazine-page.mz26 h1,#gbm-magazine-page.mz26 h2,#gbm-magazine-page.mz26 h3,#gbm-magazine-page.mz26 h4{font-family:var(--mz-cond);font-weight:800;color:var(--mz-ink);overflow-wrap:anywhere;text-wrap:balance}\n#gbm-magazine-page.mz26 .mz-wrap{width:100%;max-width:1184px;margin:0 auto;padding-inline:var(--mz-pad)}\n#gbm-magazine-page.mz26 .mz-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n#gbm-magazine-page.mz26 .mz-kick{display:block;font:700 11px/1.4 var(--mz-sans);letter-spacing:.16em;text-transform:uppercase;color:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-by{font:600 13px/1.4 var(--mz-sans);color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-cr{display:block;font:500 11px/1.4 var(--mz-sans);color:var(--mz-mute);padding-top:6px}\n#gbm-magazine-page.mz26 .mz-cover-fig>a,#gbm-magazine-page.mz26 .mz-feat-fig>a{display:block}\n#gbm-magazine-page.mz26 .mz-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;background:var(--mz-orange);color:var(--mz-ink);font:800 14px/1 var(--mz-cond);letter-spacing:.08em;text-transform:uppercase;box-shadow:3px 3px 0 var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-more{display:inline-flex;align-items:center;min-height:44px;font:800 14px/1 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--mz-blue);border-bottom:3px solid var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-frame{display:block;position:relative;width:100%;background:var(--mz-ink);overflow:hidden}\n#gbm-magazine-page.mz26 .mz-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}\n#gbm-magazine-page.mz26 .mz-src{display:inline-block;margin-left:6px;font:600 11px/1.3 var(--mz-sans);letter-spacing:.04em;text-transform:uppercase;color:var(--mz-mute);white-space:nowrap}\n#gbm-magazine-page.mz26 .mz-num{font-variant-numeric:tabular-nums}\n#gbm-magazine-page.mz26 .mz-head{border-bottom:3px solid var(--mz-ink);padding:18px 0 12px}\n#gbm-magazine-page.mz26 .mz-head-top{display:flex;justify-content:space-between;align-items:center;gap:12px;font:700 10px/1.3 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--mz-mute);padding-bottom:10px;border-bottom:1px solid var(--mz-rule-soft)}\n#gbm-magazine-page.mz26 .mz-head-top span:last-child{text-align:right}\n#gbm-magazine-page.mz26 .mz-mast{display:flex;align-items:flex-end;justify-content:space-between;gap:12px 20px;padding-top:14px}\n#gbm-magazine-page.mz26 .mz-mast img{width:min(300px,62%);height:auto;aspect-ratio:900/241;object-fit:contain;object-position:left bottom}\n#gbm-magazine-page.mz26 .mz-mast b{flex:0 1 auto;min-width:0;font:800 clamp(28px,8vw,56px)/.9 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase;color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-issue{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:12px;padding-top:10px;border-top:2px solid var(--mz-ink);font:700 12px/1.4 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-issue span+span::before{content:\"\";display:inline-block;width:6px;height:6px;margin:0 10px 1px 0;background:var(--mz-orange);transform:rotate(45deg)}\n#gbm-magazine-page.mz26 .mz-issue .mz-week{color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-cover{display:grid;gap:0;margin-top:22px;border:6px solid var(--mz-ink);background:var(--mz-ink);box-shadow:8px 8px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-cover-fig{display:block;min-width:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{background:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-cr{color:#d3dbe9;padding:8px 12px 10px;background:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-cover-type{position:relative;padding:16px 14px 20px;background:var(--mz-blue);color:var(--mz-cream);overflow:hidden}\n#gbm-magazine-page.mz26 .mz-cover-type::after{content:\"\";position:absolute;right:-12px;top:0;width:76px;height:100%;background:repeating-linear-gradient(135deg,transparent 0 8px,#ffffff14 8px 10px);pointer-events:none}\n#gbm-magazine-page.mz26 .mz-cover-type>*{position:relative;z-index:1}\n#gbm-magazine-page.mz26 .mz-cover-type .mz-kick{color:#ffb08f;margin-bottom:8px}\n#gbm-magazine-page.mz26 .mz-cover h1{font:800 clamp(32px,9.2vw,72px)/.92 var(--mz-cond);letter-spacing:-.02em;color:var(--mz-cream);text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-cover h1 a{display:block;min-height:44px}\n#gbm-magazine-page.mz26 .mz-cover .mz-dek{font:500 15px/1.4 var(--mz-sans);color:#e9eefc;margin-top:12px;max-width:60ch}\n#gbm-magazine-page.mz26 .mz-cover .mz-by{color:#c9d3ff;margin-top:10px}\n#gbm-magazine-page.mz26 .mz-cover .mz-btn{margin-top:16px}\n#gbm-magazine-page.mz26 .mz-toc{margin-top:26px;border-top:3px solid var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-toc .mz-kick{padding:10px 0 2px}\n#gbm-magazine-page.mz26 .mz-toc ol{display:grid}\n#gbm-magazine-page.mz26 .mz-toc li{border-bottom:1px solid var(--mz-rule)}\n#gbm-magazine-page.mz26 .mz-toc a{display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;align-items:start;min-height:56px;padding:12px 0}\n#gbm-magazine-page.mz26 .mz-toc b{font:800 28px/1 var(--mz-cond);color:var(--mz-blue);letter-spacing:-.04em}\n#gbm-magazine-page.mz26 .mz-toc small{display:block;font:700 10px/1.3 var(--mz-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--mz-orange-ink);margin-bottom:3px}\n#gbm-magazine-page.mz26 .mz-toc span{display:block;font:700 17px/1.2 var(--mz-cond);color:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-sec{margin-top:40px}\n#gbm-magazine-page.mz26 .mz-sec-h{display:flex;flex-direction:column;gap:6px;border-top:3px solid var(--mz-ink);padding-top:14px;margin-bottom:18px}\n#gbm-magazine-page.mz26 .mz-sec-h h2{font:800 clamp(30px,8vw,44px)/1 var(--mz-cond);letter-spacing:-.02em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-sec-h p{font:500 14px/1.4 var(--mz-sans);color:var(--mz-mute);max-width:52ch}\n#gbm-magazine-page.mz26 .mz-sub{display:flex;align-items:baseline;gap:10px;border-bottom:2px solid var(--mz-ink);padding-bottom:6px;margin-bottom:12px}\n#gbm-magazine-page.mz26 .mz-sub h3{font:800 22px/1 var(--mz-cond);letter-spacing:.02em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-sub small{font:600 12px/1.3 var(--mz-sans);color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-cols{display:grid;gap:18px}\n#gbm-magazine-page.mz26 .mz-col{display:grid;gap:10px;align-content:start;padding:0 0 18px;border-bottom:1px solid var(--mz-rule)}\n#gbm-magazine-page.mz26 .mz-col .mz-frame{box-shadow:5px 5px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-col .mz-who{font:700 11px/1.4 var(--mz-sans);letter-spacing:.16em;text-transform:uppercase;color:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-col h3{font:700 24px/1.1 var(--mz-cond);letter-spacing:-.01em}\n#gbm-magazine-page.mz26 .mz-col p{font:400 15px/1.5 var(--mz-sans);color:var(--mz-ink-2)}\n#gbm-magazine-page.mz26 .mz-col .mz-more{margin-top:2px}\n#gbm-magazine-page.mz26 .mz-feat{display:grid;gap:0;border:4px solid var(--mz-ink);background:var(--mz-cream);box-shadow:6px 6px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-feat-type{padding:16px 14px 20px}\n#gbm-magazine-page.mz26 .mz-feat h3{font:800 clamp(26px,7vw,40px)/1 var(--mz-cond);letter-spacing:-.02em;margin-top:8px}\n#gbm-magazine-page.mz26 .mz-feat h3 a{display:block;min-height:44px}\n#gbm-magazine-page.mz26 .mz-feat .mz-dek{font:500 15px/1.45 var(--mz-sans);color:var(--mz-ink-2);margin-top:10px}\n#gbm-magazine-page.mz26 .mz-feat .mz-by{margin-top:8px}\n#gbm-magazine-page.mz26 .mz-feat .mz-btn{margin-top:14px}\n#gbm-magazine-page.mz26 .mz-feat .mz-cr{padding:6px 12px 8px;background:var(--mz-ink);color:#d3dbe9}\n#gbm-magazine-page.mz26 .mz-pre{background:var(--mz-ink);color:var(--mz-cream);padding:18px 14px 22px;border-top:6px solid var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-pre .mz-kick{color:#ffb08f}\n#gbm-magazine-page.mz26 .mz-pre-match{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:10px;margin-top:10px;padding:12px 0;border-top:1px solid #ffffff2e;border-bottom:1px solid #ffffff2e}\n#gbm-magazine-page.mz26 .mz-pre-team{min-width:0}\n#gbm-magazine-page.mz26 .mz-pre-team:last-child{text-align:right}\n#gbm-magazine-page.mz26 .mz-pre-team b{display:block;font:800 clamp(22px,6.4vw,40px)/1 var(--mz-cond);letter-spacing:-.01em;text-transform:uppercase;color:var(--mz-cream);overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-pre-team small{display:block;font:600 12px/1.3 var(--mz-cond);letter-spacing:.08em;text-transform:uppercase;color:#c9d3ff;margin-top:4px}\n#gbm-magazine-page.mz26 .mz-pre-at{font:800 14px/1 var(--mz-cond);letter-spacing:.1em;color:var(--mz-orange-soft);padding:6px 8px;border:1px solid var(--mz-orange-soft)}\n#gbm-magazine-page.mz26 .mz-pre-when{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:12px;font:700 13px/1.4 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-pre-when span+span::before{content:\"\";display:inline-block;width:5px;height:5px;margin:0 9px 2px 0;background:var(--mz-orange);transform:rotate(45deg)}\n#gbm-magazine-page.mz26 .mz-pre-series{font:500 15px/1.45 var(--mz-sans);color:#dfe6f7;margin-top:12px}\n#gbm-magazine-page.mz26 .mz-pre-keys{display:grid;gap:8px;margin-top:10px;counter-reset:mzk}\n#gbm-magazine-page.mz26 .mz-pre-keys li{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:start;font:500 15px/1.45 var(--mz-sans);color:#e9eefc;counter-increment:mzk}\n#gbm-magazine-page.mz26 .mz-pre-keys li::before{content:counter(mzk,decimal-leading-zero);font:800 24px/1 var(--mz-cond);color:var(--mz-orange-soft);letter-spacing:-.04em}\n#gbm-magazine-page.mz26 .mz-pre h4{font:800 13px/1.3 var(--mz-cond);letter-spacing:.12em;text-transform:uppercase;color:#ffb08f;margin-top:16px}\n#gbm-magazine-page.mz26 .mz-pre-link{display:grid;gap:4px;margin-top:18px;padding:14px;background:#ffffff12;border-left:4px solid var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-pre-link small{font:700 10px/1.3 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:#ffb08f}\n#gbm-magazine-page.mz26 .mz-pre-link b{font:700 20px/1.15 var(--mz-cond);color:var(--mz-cream)}\n#gbm-magazine-page.mz26 .mz-pre-link p{font:400 14px/1.45 var(--mz-sans);color:#d3dbe9}\n#gbm-magazine-page.mz26 .mz-pre-link .mz-by{color:#c9d3ff}\n#gbm-magazine-page.mz26 .mz-dept{display:grid;gap:28px}\n#gbm-magazine-page.mz26 .mz-dep{min-width:0}\n#gbm-magazine-page.mz26 .mz-sched{width:100%;border-collapse:collapse;table-layout:fixed;font:600 14px/1.3 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-sched th,#gbm-magazine-page.mz26 .mz-sched td{padding:9px 6px 9px 0;text-align:left;border-bottom:1px solid var(--mz-rule);vertical-align:top;overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-sched th{font:700 10px/1.3 var(--mz-sans);letter-spacing:.12em;text-transform:uppercase;color:var(--mz-mute);border-bottom:2px solid var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-sched .mz-d{width:62px;color:var(--mz-mute);font-weight:600}\n#gbm-magazine-page.mz26 .mz-sched .mz-r{width:38%;text-align:right;padding-right:0;font-family:var(--mz-cond);font-weight:800;font-size:16px;letter-spacing:.02em}\n#gbm-magazine-page.mz26 .mz-sched .mz-r small{display:block;font:600 11px/1.3 var(--mz-sans);letter-spacing:.04em;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-sched td.mz-o{font-family:var(--mz-cond);font-weight:700;font-size:16px}\n#gbm-magazine-page.mz26 .mz-sched td.mz-o small{font:500 12px/1.3 var(--mz-sans);color:var(--mz-mute);margin-left:4px}\n#gbm-magazine-page.mz26 .mz-sched .mz-w{color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-sched .mz-l{color:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-sched tr.mz-next td{background:var(--mz-cream);box-shadow:inset 4px 0 0 var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-sched tr.mz-next td:first-child{padding-left:10px}\n#gbm-magazine-page.mz26 .mz-inj{display:grid;gap:16px}\n#gbm-magazine-page.mz26 .mz-inj h4{font:800 15px/1.2 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--mz-blue);padding-bottom:6px;border-bottom:1px solid var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-inj li{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;padding:8px 0;border-bottom:1px solid var(--mz-rule);font:500 14px/1.4 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-inj li b{font:700 14px/1.4 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-inj li b i{font:700 11px/1 var(--mz-cond);font-style:normal;letter-spacing:.08em;color:var(--mz-mute);margin-right:5px}\n#gbm-magazine-page.mz26 .mz-inj .mz-st{font:800 11px/1 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;padding:4px 6px;color:var(--mz-cream);background:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-inj .mz-st[data-s=out]{background:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-inj .mz-st[data-s=questionable],#gbm-magazine-page.mz26 .mz-inj .mz-st[data-s=doubtful]{background:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-inj .mz-src{margin-left:auto}\n#gbm-magazine-page.mz26 .mz-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n#gbm-magazine-page.mz26 .mz-stat{display:grid;gap:2px;align-content:start;padding:12px 12px 10px;background:var(--mz-cream);border:2px solid var(--mz-ink);box-shadow:4px 4px 0 var(--mz-shadow);min-width:0}\n#gbm-magazine-page.mz26 .mz-stat b{font:800 clamp(30px,9vw,44px)/1 var(--mz-cond);letter-spacing:-.03em;color:var(--mz-blue);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-stat span{font:700 13px/1.3 var(--mz-sans);color:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-stat small{font:600 10px/1.3 var(--mz-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-notes li{padding:8px 0 8px 18px;border-bottom:1px solid var(--mz-rule);font:500 14px/1.45 var(--mz-sans);position:relative}\n#gbm-magazine-page.mz26 .mz-notes li::before{content:\"\";position:absolute;left:0;top:14px;width:8px;height:8px;background:var(--mz-orange);transform:rotate(45deg)}\n#gbm-magazine-page.mz26 .mz-shots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n#gbm-magazine-page.mz26 .mz-shot{display:grid;gap:6px;align-content:start;min-width:0}\n#gbm-magazine-page.mz26 .mz-shot .mz-frame{box-shadow:4px 4px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-shot span{display:block;min-height:20px;font:700 13px/1.3 var(--mz-cond);letter-spacing:.02em;color:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-shots-cr{margin-top:12px}\n#gbm-magazine-page.mz26 .mz-foot{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 20px;margin-top:40px;border-top:3px solid var(--mz-ink);padding-top:12px}\n#gbm-magazine-page.mz26 .mz-foot .mz-more{font-size:15px}\n#gbm-magazine-page.mz26 .mz-foot small{font:600 12px/1.4 var(--mz-sans);color:var(--mz-mute)}\n@media(hover:hover) and (pointer:fine){\n#gbm-magazine-page.mz26 .mz-col:hover h3,#gbm-magazine-page.mz26 .mz-toc a:hover span,#gbm-magazine-page.mz26 .mz-shot:hover span,#gbm-magazine-page.mz26 .mz-pre-link:hover b{text-decoration:underline;text-decoration-color:var(--mz-orange);text-decoration-thickness:2px;text-underline-offset:4px}\n#gbm-magazine-page.mz26 .mz-more:hover{color:var(--mz-orange-ink)}\n}\n@media(max-width:359px){\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:32px}\n#gbm-magazine-page.mz26 .mz-head-top{font-size:9px;letter-spacing:.08em}\n#gbm-magazine-page.mz26 .mz-mast{gap:12px}\n#gbm-magazine-page.mz26 .mz-mast img{width:52%}\n#gbm-magazine-page.mz26 .mz-mast b{font-size:22px;letter-spacing:.03em}\n#gbm-magazine-page.mz26 .mz-shots{grid-template-columns:1fr}\n#gbm-magazine-page.mz26 .mz-sched .mz-d{width:54px}\n}\n@media(min-width:600px){\n#gbm-magazine-page.mz26 .mz-cols{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}\n#gbm-magazine-page.mz26 .mz-feat{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)}\n#gbm-magazine-page.mz26 .mz-feat-type{padding:22px 22px 26px}\n#gbm-magazine-page.mz26 .mz-toc ol{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px}\n#gbm-magazine-page.mz26 .mz-shots{grid-template-columns:repeat(3,minmax(0,1fr))}\n#gbm-magazine-page.mz26 .mz-inj{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}\n#gbm-magazine-page.mz26 .mz-pre{padding:24px 22px 28px}\n}\n@media(min-width:821px){\n#gbm-magazine-page.mz26{--mz-pad:24px;padding-bottom:56px}\n#gbm-magazine-page.mz26 .mz-head{padding-top:26px}\n#gbm-magazine-page.mz26 .mz-mast img{width:min(360px,40%)}\n#gbm-magazine-page.mz26 .mz-cover{grid-template-columns:minmax(0,1.25fr) minmax(0,.85fr);border-width:8px;box-shadow:10px 10px 0 var(--mz-shadow);margin-top:28px}\n#gbm-magazine-page.mz26 .mz-cover-type{padding:26px 26px 30px;display:flex;flex-direction:column;justify-content:flex-end}\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:clamp(44px,4.6vw,66px)}\n#gbm-magazine-page.mz26 .mz-toc ol{grid-template-columns:repeat(3,minmax(0,1fr));column-gap:32px}\n#gbm-magazine-page.mz26 .mz-sec{margin-top:54px}\n#gbm-magazine-page.mz26 .mz-sec-h{flex-direction:row;justify-content:space-between;align-items:flex-end;gap:20px}\n#gbm-magazine-page.mz26 .mz-sec-h p{text-align:right;max-width:340px}\n#gbm-magazine-page.mz26 .mz-dept{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);column-gap:40px;row-gap:32px}\n#gbm-magazine-page.mz26 .mz-dep-sched{grid-row:span 2}\n#gbm-magazine-page.mz26 .mz-shots{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px}\n}\n@media(min-width:1100px){\n#gbm-magazine-page.mz26 .mz-cols{grid-template-columns:repeat(4,minmax(0,1fr));gap:28px}\n#gbm-magazine-page.mz26 .mz-col h3{font-size:22px}\n}\n@media(prefers-reduced-motion:reduce){#gbm-magazine-page.mz26 *{transition:none!important;animation:none!important;scroll-behavior:auto!important}}\n#gbm-magazine-page.mz26 .mz-staff{display:flex;flex-wrap:wrap;gap:8px 24px;padding:16px 0;border-bottom:1px solid var(--mz-rule);font:13px/1.5 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-staff p{margin:0}\n#gbm-magazine-page.mz26 .mz-tools{display:flex;align-items:center;flex-wrap:wrap;gap:16px;padding:22px 0;font-size:14px}\n#gbm-magazine-page.mz26 button{font:700 15px var(--mz-sans);padding:13px 18px;border:2px solid var(--mz-blue);background:white;color:var(--mz-blue);cursor:pointer;min-height:44px}\n#gbm-magazine-page.mz26 .mz-full-story{max-width:760px;margin:70px auto 0;padding-top:34px;border-top:4px solid var(--mz-orange);scroll-margin-top:100px;overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-full-story h2{font:800 clamp(29px,4.2vw,48px)/1.08 var(--mz-sans);margin:12px 0;color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-full-story .mz-story-meta{font-size:14px;margin:14px 0 0}\n#gbm-magazine-page.mz26 .mz-site{display:inline-block;margin:6px 0 24px;font-size:14px;min-height:30px}\n#gbm-magazine-page.mz26 .mz-reading{font:19px/1.75 Georgia,serif;color:#17253b}\n#gbm-magazine-page.mz26 .mz-reading p{margin:0 0 1.1em}\n#gbm-magazine-page.mz26 .mz-reading h3{font:700 26px/1.25 var(--mz-sans);margin:30px 0 14px}\n#gbm-magazine-page.mz26 .mz-reading a,#gbm-magazine-page.mz26 .mz-utilities a{text-decoration:underline;text-underline-offset:3px}\n#gbm-magazine-page.mz26 .mz-body-photo{margin:22px 0}\n#gbm-magazine-page.mz26 .mz-body-photo img{display:block;max-width:100%;width:100%;height:auto;max-height:560px;object-fit:contain}\n#gbm-magazine-page.mz26 figcaption{font:13px/1.5 var(--mz-sans);padding-top:8px;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-story-nav{display:flex;flex-wrap:wrap;gap:10px 24px;padding:20px 0;border-top:1px solid var(--mz-rule);font-size:14px}\n#gbm-magazine-page.mz26 .mz-story-nav a{display:inline-flex;align-items:center;min-height:44px}\n#gbm-magazine-page.mz26 .mz-utilities{max-width:760px;margin:60px auto;padding:28px;background:var(--mz-cream);border-top:4px solid var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-utilities p{margin:14px 0}\n#gbm-magazine-page.mz26 #mz-contents{scroll-margin-top:100px}\n@media(max-width:600px){#gbm-magazine-page.mz26 .mz-reading{font-size:18px;line-height:1.65}#gbm-magazine-page.mz26 .mz-full-story{margin-top:42px}#gbm-magazine-page.mz26 .mz-staff{display:grid;grid-template-columns:1fr}#gbm-magazine-page.mz26 .mz-utilities{padding:18px}}\n@media print{\n@page{size:A4;margin:17mm 16mm}\nbody>*:not(#gbm-magazine-page){display:none!important}\nhtml,body{background:white!important;color:black!important}\n#gbm-magazine-page.mz26{padding:0;background:white;overflow:visible;font-size:11pt}\n#gbm-magazine-page.mz26 .mz-wrap{max-width:none;padding:0}\n#gbm-magazine-page.mz26 .mz-tools,#gbm-magazine-page.mz26 .mz-story-nav,#gbm-magazine-page.mz26 .mz-foot{display:none}\n#gbm-magazine-page.mz26 .mz-full-story{break-before:page;max-width:none;margin:0;padding-top:12pt;border-top:2pt solid #0021a5}\n#gbm-magazine-page.mz26 .mz-reading{font-size:11pt;line-height:1.5}\n#gbm-magazine-page.mz26 .mz-reading p{orphans:3;widows:3}\n#gbm-magazine-page.mz26 .mz-body-photo{break-inside:avoid}\n#gbm-magazine-page.mz26 .mz-body-photo img{max-height:80mm;width:auto;max-width:100%;margin:auto}\n#gbm-magazine-page.mz26 h2,#gbm-magazine-page.mz26 h3{break-after:avoid}\n#gbm-magazine-page.mz26 .mz-full-story h2{font-size:23pt}\n#gbm-magazine-page.mz26 .mz-cover{break-inside:avoid}\n#gbm-magazine-page.mz26 .mz-toc{break-before:page;break-after:page}\n}\n#gbm-magazine-page.mz26 .mz-writer-promo{max-width:760px;margin:32px auto;padding:24px;border-block:2px solid #163d8c;background:#f2f5fa;color:#14264a}\n#gbm-magazine-page.mz26 .mz-writer-promo h3{font-size:26px;line-height:1.2;margin:8px 0}\n#gbm-magazine-page.mz26 .mz-writer-promo>div{display:flex;flex-wrap:wrap;gap:12px 24px}\n#gbm-magazine-page.mz26 .mz-writer-promo a{display:inline-flex;align-items:center;min-height:44px;text-decoration:underline}\n@media print{#gbm-magazine-page.mz26 .mz-writer-promo{break-inside:avoid;padding:8pt;margin:12pt auto;background:none}#gbm-magazine-page.mz26 .mz-writer-promo h3{font-size:13pt}}\n@media screen {\n#gbm-magazine-page.mz26{--mz-paper:#07122e;--mz-cream:#f7f9ff;--mz-ink:#f7f9ff;--mz-ink-2:#c5cee1;--mz-mute:#b5c2db;--mz-rule:#354563;--mz-rule-soft:#293956;--mz-blue:#dce7ff;--mz-orange:#fa4616;--mz-orange-ink:#ff9877;--mz-shadow:transparent;background:#07122e;color:#f7f9ff}\n#gbm-magazine-page.mz26 .mz-head{border-bottom:1px solid #354563;padding:16px 0 14px}\n#gbm-magazine-page.mz26 .mz-head-top{border:0;font-size:12px}\n#gbm-magazine-page.mz26 .mz-mast{padding-top:4px}\n#gbm-magazine-page.mz26 .mz-mast b{font-size:38px;color:#fff;letter-spacing:.04em}\n#gbm-magazine-page.mz26 .mz-issue{border:0;color:#c5cee1}\n#gbm-magazine-page.mz26 .mz-issue .mz-week{color:#c5cee1}\n#gbm-magazine-page.mz26 .mz-cover{border:1px solid #354563;background:#0d1d3b;box-shadow:none}\n#gbm-magazine-page.mz26 .mz-cover-type{background:#0d1d3b;padding:28px 24px;color:#fff}\n#gbm-magazine-page.mz26 .mz-cover-type::after{display:none}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{background:#07122e}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-cr{background:#0d1d3b;color:#c5cee1}\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:clamp(32px,4.2vw,52px);line-height:1.02;color:#fff}\n#gbm-magazine-page.mz26 .mz-btn,#gbm-magazine-page.mz26 button{background:#132848;color:#fff;border:1px solid #7489ad;border-bottom:3px solid #fa4616;box-shadow:none}\n#gbm-magazine-page.mz26 .mz-toc{border-top:1px solid #354563}\n#gbm-magazine-page.mz26 .mz-toc a:hover{background:#132848;color:#fff}\n#gbm-magazine-page.mz26 .mz-full-story h2,#gbm-magazine-page.mz26 .mz-reading h3{color:#fff}\n#gbm-magazine-page.mz26 .mz-reading{color:#f0f3fa}\n#gbm-magazine-page.mz26 .mz-reading a,#gbm-magazine-page.mz26 .mz-site{color:#b8d5ff}\n#gbm-magazine-page.mz26 .mz-utilities,#gbm-magazine-page.mz26 .mz-writer-promo{background:#0d1d3b;color:#f7f9ff;border-color:#354563;border-top:3px solid #fa4616}\n#gbm-magazine-page.mz26 .mz-writer-promo p,#gbm-magazine-page.mz26 .mz-writer-promo a{font-size:16px}\n}\n@media screen {\n#gbm-magazine-page.mz26 .mz-cover{display:block;position:relative;isolation:isolate;overflow:hidden;border:0;border-radius:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{aspect-ratio:16/10!important;min-height:620px}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame img{object-fit:cover;object-position:center 40%}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-cr{position:absolute;right:16px;top:14px;z-index:3;padding:5px 8px;background:rgba(7,18,46,.85);font-size:12px}\n#gbm-magazine-page.mz26 .mz-cover-type{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(20px,4vw,46px);background:linear-gradient(180deg,rgba(3,9,22,0) 15%,rgba(3,9,22,.24) 35%,rgba(3,9,22,.94) 80%,#030916 100%);pointer-events:none}\n#gbm-magazine-page.mz26 .mz-cover-type a{pointer-events:auto}\n#gbm-magazine-page.mz26 .mz-cover h1{max-width:850px;font-size:clamp(34px,4.6vw,62px);line-height:1.01;text-wrap:balance;text-shadow:0 2px 12px rgba(0,0,0,.6)}\n#gbm-magazine-page.mz26 .mz-cover .mz-dek{font-size:16px;max-width:650px}\n#gbm-magazine-page.mz26 .mz-cover .mz-btn{align-self:flex-start;background:#102342}\n@media(max-width:600px){#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{aspect-ratio:3/4!important;min-height:620px}#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame img{object-position:42% top}#gbm-magazine-page.mz26 .mz-cover-type{padding:22px 18px}#gbm-magazine-page.mz26 .mz-cover h1{font-size:36px}#gbm-magazine-page.mz26 .mz-cover .mz-dek{font-size:15px}}\n}\n@media screen {\n#gbm-magazine-page.mz26 .mz-cover{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto}\n#gbm-magazine-page.mz26 .mz-cover-fig,#gbm-magazine-page.mz26 .mz-cover-type{grid-area:1/1}\n#gbm-magazine-page.mz26 .mz-cover-type{position:relative;inset:auto;min-width:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{height:100%}\n#gbm-magazine-page.mz26 .mz-cover-fig>a{height:100%}\n#gbm-magazine-page.mz26 .mz-passport{display:flex;flex-wrap:wrap;gap:8px 24px;padding:16px 0;border-bottom:1px solid #354563;font-size:15px}\n#gbm-magazine-page.mz26 .mz-passport a{min-height:44px;display:flex;align-items:center;overflow-wrap:anywhere;color:#b8d5ff;text-decoration:underline;max-width:100%}\n#gbm-magazine-page.mz26 .mz-reached{display:block;color:#b8d5ff}\n}\n@media print{#gbm-magazine-page.mz26 .mz-passport,#gbm-magazine-page.mz26 .mz-reached{display:none!important}}\n#gbm-magazine-page.mz26 .mz-five{max-width:900px;margin:48px auto}\n#gbm-magazine-page.mz26 .mz-five h2{font-size:clamp(30px,5vw,48px);margin-bottom:24px}\n#gbm-magazine-page.mz26 .mz-five figure{margin:24px 0;break-inside:avoid}\n#gbm-magazine-page.mz26 .mz-five figcaption{padding:12px 0;font-size:16px;line-height:1.5}\n#gbm-magazine-page.mz26 .mz-five figcaption span{display:block;font-size:13px;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-five a{display:inline-flex;align-items:center;min-height:44px;text-decoration:underline}\n@media print{#gbm-magazine-page.mz26 .mz-five{break-before:page}#gbm-magazine-page.mz26 .mz-five figcaption{font-size:10pt}}\n@media print{\n#gbm-magazine-page.mz26 .mz-cover{display:block;box-shadow:none;border:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{height:55mm;aspect-ratio:auto!important}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame img{object-fit:contain;max-height:55mm}\n#gbm-magazine-page.mz26 .mz-cover-type{padding:8pt 0;background:none}\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:26pt;line-height:1.1}\n#gbm-magazine-page.mz26 .mz-cover .mz-dek{font-size:10pt}\n#gbm-magazine-page.mz26 .mz-staff{font-size:9pt;margin-block:8pt;padding-block:8pt}\n}\n#gbm-magazine-page.pg{\n--pg-night:#060b1c;--pg-navy:#0a1740;--pg-deep:#0d2160;--pg-blue:#0021a5;--pg-blue-2:#2b57ff;--pg-orange:#fa4616;--pg-orange-2:#ff8a57;--pg-gold:#f2b632;--pg-green:#2fbf71;\n--pg-cream:#fffaf0;--pg-ink:#10264b;--pg-text:#e8edff;--pg-mute:#9eacd0;--pg-line:#233468;--pg-card:#0f1c4a;--pg-r:14px;\nbackground:var(--pg-night);color:var(--pg-text);padding:0 0 56px;\nbackground-image:radial-gradient(900px 420px at 50% -80px,#1b3aa855,transparent 70%),repeating-linear-gradient(0deg,transparent 0 78px,#ffffff06 78px 80px)\n}\n#gbm-magazine-page.pg h1,#gbm-magazine-page.pg h2,#gbm-magazine-page.pg h3,#gbm-magazine-page.pg h4{color:inherit;font-family:var(--mz-cond);font-weight:800;text-wrap:balance}\n#gbm-magazine-page.pg .pg-wrap{width:100%;max-width:1200px;margin:0 auto;padding:0 var(--mz-pad)}\n#gbm-magazine-page.pg .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n#gbm-magazine-page.pg .pg-kick{display:block;font:700 12px/1.4 var(--mz-sans);letter-spacing:.16em;text-transform:uppercase;color:var(--pg-orange-2)}\n#gbm-magazine-page.pg .pg-src{font:600 11px/1.5 var(--mz-sans);letter-spacing:.04em;color:var(--pg-mute);margin-top:12px}\n#gbm-magazine-page.pg .pg-cr{font:500 11px/1.4 var(--mz-sans);color:var(--pg-mute);padding-top:6px}\n#gbm-magazine-page.pg .pg-cr-c{text-align:center;margin-top:10px}\n#gbm-magazine-page.pg .pg-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;margin-top:16px;background:var(--pg-orange);color:#fff;font:800 15px/1 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;border-radius:3px;box-shadow:0 6px 0 #a82d0b;text-align:center}\n#gbm-magazine-page.pg .pg-btn:active{transform:translateY(3px);box-shadow:0 3px 0 #a82d0b}\n#gbm-magazine-page.pg .pg-more{display:inline-flex;align-items:center;min-height:44px;font:800 14px/1 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--pg-orange-2);border-bottom:3px solid var(--pg-orange)}\n#gbm-magazine-page.pg a:focus-visible{outline:3px solid var(--pg-gold);outline-offset:3px}\n#gbm-magazine-page.pg .mz-frame{background:var(--pg-navy)}\n#gbm-magazine-page.pg .pg-ticker{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 14px;margin:0 calc(var(--mz-pad) * -1);padding:9px var(--mz-pad);background:var(--pg-orange);color:#fff;font:800 12px/1.3 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase}\n#gbm-magazine-page.pg .pg-live{display:inline-flex;align-items:center;gap:8px}\n#gbm-magazine-page.pg .pg-live i{width:9px;height:9px;border-radius:50%;background:#fff;animation:pgpulse 1.6s ease-in-out infinite}\n@keyframes pgpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}\n@media (prefers-reduced-motion:reduce){#gbm-magazine-page.pg .pg-live i{animation:none}}\n#gbm-magazine-page.pg .pg-ticker-c{font-variant-numeric:tabular-nums}\n#gbm-magazine-page.pg .pg-mast{padding:20px 0 6px}\n#gbm-magazine-page.pg .pg-mast-top{display:flex;justify-content:space-between;gap:10px;font:700 10px/1.3 var(--mz-sans);letter-spacing:.16em;text-transform:uppercase;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-wm{display:block;width:100%;height:auto;margin-top:10px;overflow:visible}\n#gbm-magazine-page.pg .pg-wm text{font-family:var(--mz-cond);font-weight:800;text-transform:uppercase}\n#gbm-magazine-page.pg .pg-wm-a,#gbm-magazine-page.pg .pg-wm-b{font-size:204px}\n#gbm-magazine-page.pg .pg-wm-a{fill:#fff}\n#gbm-magazine-page.pg .pg-wm-b{fill:var(--pg-orange)}\n#gbm-magazine-page.pg .pg-wm-m{font-size:96px;fill:var(--pg-text)}\n#gbm-magazine-page.pg .pg-plate{max-width:640px;margin-top:12px;background:var(--pg-cream);border-radius:8px;padding:16px 16px 12px;box-shadow:0 10px 30px #0006}\n#gbm-magazine-page.pg .pg-logo{display:block;width:min(520px,86%);height:auto;margin:0 auto}\n#gbm-magazine-page.pg .pg-plate-mz{display:flex;align-items:center;gap:12px;margin-top:10px;font:400 clamp(18px,5.2vw,30px)/1 var(--mz-mast);letter-spacing:.2em;text-transform:uppercase;color:var(--pg-blue)}\n#gbm-magazine-page.pg .pg-plate-mz::before,#gbm-magazine-page.pg .pg-plate-mz::after{content:\"\";flex:1;height:3px;background:var(--pg-orange)}\n#gbm-magazine-page.pg .pg-plate-mz::after{margin-left:-.2em}\n#gbm-magazine-page.pg .pg-home{color:inherit;text-decoration:none}\n#gbm-magazine-page.pg .pg-home::before{content:\"\\2190\\00a0\";color:var(--pg-orange-2)}\nhtml:has(#gbm-magazine-page.pg) #gbm-site-header,html:has(#gbm-magazine-page.pg) #SITE_HEADER,html:has(#gbm-magazine-page.pg) #gbm-mobile-shell-host,html:has(#gbm-magazine-page.pg) #gbm-mobile-shell,html:has(#gbm-magazine-page.pg) #gbm-mobile-drawer-root{display:none!important}\n#gbm-magazine-page.pg .pg-issue{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;margin-top:14px;padding-top:12px;border-top:2px solid var(--pg-orange);font:700 13px/1.3 var(--mz-cond);letter-spacing:.12em;text-transform:uppercase;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-issue b{color:#fff;background:var(--pg-blue);padding:4px 10px}\n#gbm-magazine-page.pg .pg-cover{position:relative;margin-top:22px;border-radius:var(--pg-r);overflow:hidden;background:var(--pg-navy);border:1px solid var(--pg-line);box-shadow:0 24px 60px #0008}\n#gbm-magazine-page.pg .pg-cover-fig{display:block}\n#gbm-magazine-page.pg .pg-cover-type{position:relative;padding:18px 18px 22px;background:linear-gradient(180deg,var(--pg-deep),var(--pg-navy))}\n#gbm-magazine-page.pg .pg-cover-type::before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(180deg,var(--pg-orange),var(--pg-gold))}\n#gbm-magazine-page.pg .pg-cover h1{font:800 clamp(36px,10.4vw,86px)/.9 var(--mz-cond);letter-spacing:-.015em;text-transform:uppercase;color:#fff;margin-top:8px}\n#gbm-magazine-page.pg .pg-cover h1 a{display:block}\n#gbm-magazine-page.pg .pg-dek{font:500 16px/1.45 var(--mz-sans);color:#dce4ff;margin-top:14px;max-width:62ch}\n#gbm-magazine-page.pg .pg-by{font:700 13px/1.4 var(--mz-sans);letter-spacing:.06em;text-transform:uppercase;color:var(--pg-orange-2);margin-top:10px}\n#gbm-magazine-page.pg .pg-cover>.pg-cr{padding:0 18px 12px;background:var(--pg-navy)}\n#gbm-magazine-page.pg .pg-sh{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid var(--pg-line)}\n#gbm-magazine-page.pg .pg-sh h2{font:800 clamp(28px,7vw,48px)/1 var(--mz-cond);letter-spacing:.02em;text-transform:uppercase;color:#fff}\n#gbm-magazine-page.pg .pg-sh h2::before{content:\"\";display:inline-block;width:.4em;height:.4em;margin-right:.35em;background:var(--pg-orange);transform:rotate(45deg) translateY(-.08em)}\n#gbm-magazine-page.pg .pg-sh p{font:600 14px/1.4 var(--mz-sans);color:var(--pg-mute)}\n#gbm-magazine-page.pg section,#gbm-magazine-page.pg .pg-lead{margin-top:44px;scroll-margin-top:70px}\n#gbm-magazine-page.pg .pg-grid{display:grid;gap:0;margin-top:0}\n#gbm-magazine-page.pg .pg-grid>section:first-child{margin-top:34px}\n#gbm-magazine-page.pg .pg-game{padding:18px 16px 20px;border-radius:var(--pg-r);background:linear-gradient(160deg,var(--pg-deep),var(--pg-navy) 60%);border:1px solid var(--pg-line)}\n#gbm-magazine-page.pg .pg-game-top{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 14px}\n#gbm-magazine-page.pg .pg-game-top h2{font:800 13px/1.3 var(--mz-sans);letter-spacing:.2em;text-transform:uppercase;color:var(--pg-orange-2)}\n#gbm-magazine-page.pg .pg-count{font:800 clamp(20px,5.6vw,30px)/1 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase;color:var(--pg-gold);font-variant-numeric:tabular-nums}\n#gbm-magazine-page.pg .pg-teams{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;margin-top:16px}\n#gbm-magazine-page.pg .pg-team{min-width:0;text-align:center;padding:14px 6px 12px;border-radius:10px;background:#ffffff0d;border:1px solid #ffffff1c}\n#gbm-magazine-page.pg .pg-team small{display:block;font:700 11px/1.2 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-team b{display:block;font:800 clamp(24px,7.6vw,46px)/.95 var(--mz-cond);text-transform:uppercase;overflow-wrap:anywhere;color:#fff;margin-top:4px}\n#gbm-magazine-page.pg .pg-rec{display:block;font:800 clamp(34px,10vw,64px)/1 var(--mz-cond);margin-top:6px}\n#gbm-magazine-page.pg .pg-fla .pg-rec{color:var(--pg-orange)}\n#gbm-magazine-page.pg .pg-miz .pg-rec{color:var(--pg-gold)}\n#gbm-magazine-page.pg .pg-team em{display:block;font:700 12px/1.3 var(--mz-sans);font-style:normal;letter-spacing:.08em;text-transform:uppercase;color:var(--pg-mute);margin-top:4px}\n#gbm-magazine-page.pg .pg-at{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:var(--pg-orange);color:#fff;font:800 14px/1 var(--mz-cond);letter-spacing:.08em;text-transform:uppercase}\n#gbm-magazine-page.pg .pg-when{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:16px;font:600 14px/1.4 var(--mz-sans);color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-when b{flex:1 0 100%;font:800 clamp(20px,5.6vw,28px)/1.1 var(--mz-cond);letter-spacing:.04em;text-transform:uppercase;color:#fff}\n#gbm-magazine-page.pg .pg-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}\n#gbm-magazine-page.pg .pg-chips li{flex:1 1 130px;padding:9px 12px;border-radius:8px;background:#06102f;border:1px solid var(--pg-line)}\n#gbm-magazine-page.pg .pg-chips small{display:block;font:700 10px/1.2 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-chips b{display:block;font:800 20px/1.2 var(--mz-cond);letter-spacing:.03em;color:#fff;margin-top:2px}\n#gbm-magazine-page.pg .pg-prob{margin-top:16px}\n#gbm-magazine-page.pg .pg-prob p{font:700 11px/1.3 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-bar{height:14px;margin-top:7px;border-radius:7px;background:var(--pg-gold);overflow:hidden}\n#gbm-magazine-page.pg .pg-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--pg-orange),var(--pg-orange-2));border-radius:7px 0 0 7px}\n#gbm-magazine-page.pg .pg-prob-n{display:flex;justify-content:space-between;margin-top:6px;font:800 15px/1.2 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase}\n#gbm-magazine-page.pg .pg-prob-n b:first-child{color:var(--pg-orange-2)}\n#gbm-magazine-page.pg .pg-prob-n b:last-child{color:var(--pg-gold)}\n#gbm-magazine-page.pg .pg-lede{font:500 16px/1.5 var(--mz-sans);color:var(--pg-text);max-width:62ch}\n#gbm-magazine-page.pg .pg-yrs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin-top:14px}\n#gbm-magazine-page.pg .pg-yrs li{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px 7px;border-radius:8px;border:1px solid var(--pg-line);background:var(--pg-card);text-align:center;min-width:0}\n#gbm-magazine-page.pg .pg-yrs b{font:800 17px/1 var(--mz-cond);letter-spacing:.04em}\n#gbm-magazine-page.pg .pg-yrs span{font:800 14px/1.1 var(--mz-cond);font-variant-numeric:tabular-nums}\n#gbm-magazine-page.pg .pg-yrs small{font:700 9px/1.2 var(--mz-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-yrs .pg-w{background:linear-gradient(180deg,#0b2f78,#0a2260);border-color:var(--pg-blue-2)}\n#gbm-magazine-page.pg .pg-yrs .pg-w b,#gbm-magazine-page.pg .pg-yrs .pg-w span{color:#fff}\n#gbm-magazine-page.pg .pg-yrs .pg-l{background:#241408;border-color:#6c4710}\n#gbm-magazine-page.pg .pg-yrs .pg-l b,#gbm-magazine-page.pg .pg-yrs .pg-l span{color:var(--pg-gold)}\n#gbm-magazine-page.pg .pg-tally{display:flex;gap:10px;margin-top:12px;font:800 22px/1 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase}\n#gbm-magazine-page.pg .pg-tally .pg-w{color:var(--pg-orange-2)}\n#gbm-magazine-page.pg .pg-tally .pg-l{color:var(--pg-gold)}\n#gbm-magazine-page.pg .pg-legend{display:flex;flex-wrap:wrap;align-items:center;gap:6px 16px;font:800 14px/1.3 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase}\n#gbm-magazine-page.pg .pg-lf{color:var(--pg-orange-2)}#gbm-magazine-page.pg .pg-lm{color:var(--pg-gold)}\n#gbm-magazine-page.pg .pg-legend small{flex:1 0 100%;font:500 12px/1.4 var(--mz-sans);letter-spacing:0;text-transform:none;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-rows{display:grid;gap:14px;margin-top:14px}\n#gbm-magazine-page.pg .pg-row-l{display:block;text-align:center;font:800 14px/1.2 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--pg-mute);margin-bottom:5px}\n#gbm-magazine-page.pg .pg-rbars{display:grid;grid-template-columns:minmax(46px,auto) 1fr 1fr minmax(46px,auto);align-items:center;gap:0 6px}\n#gbm-magazine-page.pg .pg-v{font:800 20px/1 var(--mz-cond);font-variant-numeric:tabular-nums;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-v:last-child{text-align:right}\n#gbm-magazine-page.pg .pg-v.pg-win{color:#fff}\n#gbm-magazine-page.pg .pg-half{height:18px;background:#ffffff0f;display:flex}\n#gbm-magazine-page.pg .pg-hf{justify-content:flex-end;border-radius:9px 0 0 9px}\n#gbm-magazine-page.pg .pg-hm{justify-content:flex-start;border-radius:0 9px 9px 0}\n#gbm-magazine-page.pg .pg-half i{display:block;height:100%;background:#7a3a24}\n#gbm-magazine-page.pg .pg-hf i{border-radius:9px 0 0 9px;background:#8a3a1d}\n#gbm-magazine-page.pg .pg-hm i{border-radius:0 9px 9px 0;background:#6f5a1b}\n#gbm-magazine-page.pg .pg-hf i.pg-win{background:linear-gradient(270deg,var(--pg-orange),var(--pg-orange-2))}\n#gbm-magazine-page.pg .pg-hm i.pg-win{background:linear-gradient(90deg,var(--pg-gold),#ffd36e)}\n#gbm-magazine-page.pg .pg-keys ol{display:grid;gap:12px}\n#gbm-magazine-page.pg .pg-keys li{position:relative;padding:16px 16px 14px 16px;border-radius:var(--pg-r);background:var(--pg-card);border:1px solid var(--pg-line);overflow:hidden}\n#gbm-magazine-page.pg .pg-n{position:absolute;right:10px;top:-14px;font:800 108px/1 var(--mz-cond);color:transparent;-webkit-text-stroke:1.5px #2b57ff66;pointer-events:none}\n#gbm-magazine-page.pg .pg-keys h3{position:relative;font:800 clamp(22px,5.8vw,30px)/1.05 var(--mz-cond);text-transform:uppercase;letter-spacing:.01em;color:#fff;padding-right:60px}\n#gbm-magazine-page.pg .pg-keys p{position:relative;margin-top:8px;font:500 15px/1.5 var(--mz-sans);color:#dbe3ff}\n#gbm-magazine-page.pg .pg-watch dl{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}\n#gbm-magazine-page.pg .pg-watch dl>div{padding:12px 14px;border-radius:var(--pg-r);background:var(--pg-card);border:1px solid var(--pg-line);min-width:0}\n#gbm-magazine-page.pg .pg-watch dt{font:800 12px/1 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--pg-orange-2);margin-bottom:6px}\n#gbm-magazine-page.pg .pg-watch dd{margin:0;font:700 17px/1.3 var(--mz-sans);color:#fff}\n#gbm-magazine-page.pg .pg-wl{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:12px}\n#gbm-magazine-page.pg .pg-ros-grid{display:grid;gap:12px}\n#gbm-magazine-page.pg .pg-team{border-radius:var(--pg-r);background:var(--pg-card);border:1px solid var(--pg-line);overflow:hidden}\n#gbm-magazine-page.pg .pg-team summary{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 12px;padding:14px 16px;cursor:pointer;list-style:none;min-height:44px}\n#gbm-magazine-page.pg .pg-team summary::-webkit-details-marker{display:none}\n#gbm-magazine-page.pg .pg-team summary b{font:800 26px/1 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase;color:#fff}\n#gbm-magazine-page.pg .pg-team summary b::after{content:\" +\";color:var(--pg-orange)}\n#gbm-magazine-page.pg .pg-team[open] summary b::after{content:\" \\2212\"}\n#gbm-magazine-page.pg .pg-team summary span{font:600 13px/1.3 var(--mz-sans);color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-team h3{font:800 14px/1 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--pg-orange-2);padding:12px 16px 6px}\n#gbm-magazine-page.pg .pg-team ul{padding:0 16px 10px}\n#gbm-magazine-page.pg .pg-team li{display:grid;grid-template-columns:34px 1fr auto auto;align-items:center;gap:2px 10px;padding:7px 0;border-bottom:1px solid var(--pg-line);font-variant-numeric:tabular-nums}\n#gbm-magazine-page.pg .pg-team li .pg-no{font:800 16px/1 var(--mz-cond);color:var(--pg-mute);text-align:right}\n#gbm-magazine-page.pg .pg-team li b{font:600 15px/1.25 var(--mz-sans);color:#fff;min-width:0}\n#gbm-magazine-page.pg .pg-team li i{font:800 12px/1 var(--mz-cond);font-style:normal;letter-spacing:.08em;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-team li small{font:700 11px/1 var(--mz-cond);letter-spacing:.08em;color:var(--pg-mute);min-width:22px}\n#gbm-magazine-page.pg .pg-team li .pg-st{grid-column:2/5;justify-self:start}\n#gbm-magazine-page.pg .pg-team li.pg-hurt b{color:var(--pg-orange-2)}\n@media (min-width:900px){#gbm-magazine-page.pg .pg-ros-grid{grid-template-columns:1fr 1fr;align-items:start}}\n@media print{#gbm-magazine-page.pg .pg-team>*{display:block!important}#gbm-magazine-page.pg .pg-team ul{columns:2}}\n#gbm-magazine-page.pg .pg-inj-grid{display:grid;gap:16px}\n#gbm-magazine-page.pg .pg-inj h3{font:800 22px/1 var(--mz-cond);letter-spacing:.08em;text-transform:uppercase;color:var(--pg-orange-2);margin-bottom:8px}\n#gbm-magazine-page.pg .pg-inj li{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:2px 10px;padding:10px 0;border-bottom:1px solid var(--pg-line)}\n#gbm-magazine-page.pg .pg-inj i{font:800 12px/1 var(--mz-cond);font-style:normal;letter-spacing:.08em;padding:4px 7px;border-radius:4px;background:#ffffff14;color:var(--pg-mute);min-width:40px;text-align:center}\n#gbm-magazine-page.pg .pg-inj b{font:700 16px/1.3 var(--mz-sans);color:#fff}\n#gbm-magazine-page.pg .pg-inj small{grid-column:2/4;font:500 12px/1.4 var(--mz-sans);color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-st{font:800 11px/1 var(--mz-cond);letter-spacing:.12em;text-transform:uppercase;padding:5px 8px;border-radius:4px}\n#gbm-magazine-page.pg .pg-st[data-s=\"out\"]{background:#7a1c10;color:#ffd9d1}\n#gbm-magazine-page.pg .pg-st[data-s=\"questionable\"]{background:#6b5410;color:#ffeaa8}\n#gbm-magazine-page.pg .pg-lead{position:relative;padding:22px 16px 28px;border-radius:var(--pg-r);background:var(--pg-cream);color:var(--pg-ink);box-shadow:0 0 0 6px var(--pg-orange),0 30px 60px #0009}\n#gbm-magazine-page.pg .pg-lead .pg-kick{color:#a83511}\n#gbm-magazine-page.pg .pg-lead h2{font:800 clamp(32px,8.4vw,60px)/.95 var(--mz-cond);text-transform:uppercase;letter-spacing:-.01em;color:var(--pg-ink);margin-top:8px}\n#gbm-magazine-page.pg .pg-lead .pg-by{color:#42506a;text-transform:none;letter-spacing:.02em}\n#gbm-magazine-page.pg .pg-fig{margin:18px 0 6px}\n#gbm-magazine-page.pg .pg-fig figcaption{font:500 13px/1.45 var(--mz-sans);color:#42506a;padding-top:8px}\n#gbm-magazine-page.pg .pg-fig figcaption span{display:block;font-size:11px;color:#526075}\n#gbm-magazine-page.pg .pg-prose{max-width:68ch;margin-top:14px}\n#gbm-magazine-page.pg .pg-prose p{font:500 18px/1.65 var(--mz-sans);margin:0 0 1.05em;color:#162a50}\n#gbm-magazine-page.pg .pg-prose>p:first-child::first-letter{float:left;font:800 4.6em/.8 var(--mz-cond);padding:.06em .1em 0 0;color:var(--pg-orange)}\n#gbm-magazine-page.pg .pg-prose a{color:#0a2fc0;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}\n#gbm-magazine-page.pg .pg-prose blockquote{margin:1.4em 0;padding:4px 0 4px 18px;border-left:6px solid var(--pg-orange)}\n#gbm-magazine-page.pg .pg-prose blockquote p{font:700 clamp(21px,5.4vw,28px)/1.25 var(--mz-cond);letter-spacing:.005em;color:var(--pg-ink);margin:0}\n#gbm-magazine-page.pg .pg-prose blockquote{font:600 clamp(20px,5vw,24px)/1.35 var(--mz-cond);letter-spacing:.01em;color:var(--pg-ink)}\n#gbm-magazine-page.pg .pg-prose .pg-sooth{padding:16px 16px 4px;margin-top:1.4em;border-radius:10px;background:var(--pg-ink);color:#e8edff;font-size:17px}\n#gbm-magazine-page.pg .pg-prose .pg-sooth strong{display:block;font:800 22px/1.2 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase;color:var(--pg-orange-2);margin-bottom:6px}\n#gbm-magazine-page.pg .pg-lead .pg-btn{margin-top:8px}\n#gbm-magazine-page.pg .pg-games{display:grid;gap:12px}\n#gbm-magazine-page.pg .pg-g{padding:14px 14px 12px;border-radius:var(--pg-r);background:var(--pg-card);border:1px solid var(--pg-line)}\n#gbm-magazine-page.pg .pg-g.pg-hero{background:linear-gradient(160deg,#4b1a0d,#0f1c4a 70%);border-color:var(--pg-orange)}\n#gbm-magazine-page.pg .pg-gt{display:flex;justify-content:space-between;font:800 14px/1.2 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase}\n#gbm-magazine-page.pg .pg-gt span{color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-g ul{margin-top:8px}\n#gbm-magazine-page.pg .pg-g li{display:grid;grid-template-columns:26px 1fr auto;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #ffffff12}\n#gbm-magazine-page.pg .pg-rk{font:800 14px/1 var(--mz-cond);color:var(--pg-gold);text-align:center}\n#gbm-magazine-page.pg .pg-g li b{font:800 22px/1.1 var(--mz-cond);text-transform:uppercase;letter-spacing:.02em;overflow-wrap:anywhere;color:#d3dcfb}\n#gbm-magazine-page.pg .pg-rc{font:700 13px/1 var(--mz-sans);color:var(--pg-mute);font-variant-numeric:tabular-nums}\n#gbm-magazine-page.pg .pg-g li.pg-picked b{color:#fff}\n#gbm-magazine-page.pg .pg-g li.pg-picked{box-shadow:inset 4px 0 0 var(--pg-orange);padding-left:4px}\n#gbm-magazine-page.pg .pg-gl{display:flex;gap:14px;margin-top:8px;font:700 13px/1.2 var(--mz-sans);letter-spacing:.06em;color:var(--pg-mute);font-variant-numeric:tabular-nums}\n#gbm-magazine-page.pg .pg-pick{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;margin-top:10px;padding:9px 12px;border-radius:8px;background:var(--pg-orange)}\n#gbm-magazine-page.pg .pg-pick small{font:700 10px/1.2 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:#ffe4d8}\n#gbm-magazine-page.pg .pg-pick b{font:800 22px/1.1 var(--mz-cond);letter-spacing:.04em;text-transform:uppercase;color:#fff}\n#gbm-magazine-page.pg .pg-pick em{font:600 12px/1.2 var(--mz-sans);font-style:normal;color:#ffe4d8}\n#gbm-magazine-page.pg .pg-cgrid{display:grid;gap:14px}\n#gbm-magazine-page.pg .pg-card{display:flex;flex-direction:column;gap:8px;padding:12px 12px 14px;border-radius:var(--pg-r);background:var(--pg-card);border:1px solid var(--pg-line)}\n#gbm-magazine-page.pg .pg-card .mz-frame{border-radius:8px;aspect-ratio:16/10!important}\n#gbm-magazine-page.pg .pg-card h3{font:800 clamp(22px,5.8vw,28px)/1.05 var(--mz-cond);letter-spacing:.005em;color:#fff}\n#gbm-magazine-page.pg .pg-card p{font:500 15px/1.45 var(--mz-sans);color:#cdd7f7}\n#gbm-magazine-page.pg .pg-card .pg-cr{padding-top:0}\n#gbm-magazine-page.pg .pg-card .pg-more{align-self:flex-start;margin-top:2px}\n#gbm-magazine-page.pg .pg-mosaic{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}\n#gbm-magazine-page.pg .pg-shot{position:relative;display:block;border-radius:10px;overflow:hidden;background:var(--pg-navy)}\n#gbm-magazine-page.pg .pg-shot span{display:block;padding:7px 10px 9px;font:700 12px/1.3 var(--mz-sans);letter-spacing:.04em;color:#dbe3ff}\n#gbm-magazine-page.pg .pg-s0{grid-column:1/-1}\n#gbm-magazine-page.pg .pg-foot{margin-top:48px;padding:22px 0 0;border-top:3px solid var(--pg-orange)}\n#gbm-magazine-page.pg .pg-foot h2{font:800 14px/1.2 var(--mz-sans);letter-spacing:.2em;text-transform:uppercase;color:var(--pg-mute)}\n#gbm-magazine-page.pg .pg-foot nav{display:flex;flex-wrap:wrap;gap:6px 22px;margin-top:10px}\n#gbm-magazine-page.pg .pg-foot nav a{display:inline-flex;align-items:center;min-height:44px;font:800 18px/1 var(--mz-cond);letter-spacing:.08em;text-transform:uppercase;color:#fff;border-bottom:3px solid var(--pg-orange)}\n#gbm-magazine-page.pg .pg-foot>p:not(.pg-src){margin-top:12px;font:600 15px/1.45 var(--mz-sans);color:var(--pg-text)}\n#gbm-magazine-page.pg .pg-top{display:inline-flex;align-items:center;min-height:44px;margin-top:10px;font:800 14px/1 var(--mz-cond);letter-spacing:.12em;text-transform:uppercase;color:var(--pg-orange-2)}\n@media (min-width:700px){\n#gbm-magazine-page.pg{--mz-pad:24px}\n#gbm-magazine-page.pg .pg-cgrid{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-games{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-keys ol{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-inj-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}\n#gbm-magazine-page.pg .pg-mosaic{grid-template-columns:repeat(3,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-s0{grid-column:span 2}\n#gbm-magazine-page.pg .pg-yrs{grid-template-columns:repeat(12,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-lead{padding:34px 36px 38px}\n}\n@media (min-width:1000px){\n#gbm-magazine-page.pg .pg-mast{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:\"top top\" \"word issue\" \"word2 issue\";align-items:end;gap:0 40px}\n#gbm-magazine-page.pg .pg-mast-top{grid-area:top}\n#gbm-magazine-page.pg .pg-wm{grid-area:2 / 1 / 4 / 2;max-width:760px}\n#gbm-magazine-page.pg .pg-issue{grid-area:issue;flex-direction:column;align-items:flex-end;margin:0 0 8px;padding:0 0 0 26px;border-top:0;border-left:2px solid var(--pg-orange);font-size:16px;text-align:right}\n#gbm-magazine-page.pg .pg-issue b{font-size:26px;padding:6px 14px}\n#gbm-magazine-page.pg .pg-cover-type{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:6px 44px;align-items:start;padding:30px 36px 34px}\n#gbm-magazine-page.pg .pg-cover-type .pg-kick{grid-column:1/-1}\n#gbm-magazine-page.pg .pg-cover h1{grid-column:1;grid-row:2/6;font-size:clamp(52px,6.2vw,84px);margin-top:0}\n#gbm-magazine-page.pg .pg-dek{grid-column:2;margin-top:6px;font-size:18px}\n#gbm-magazine-page.pg .pg-cover .pg-by{grid-column:2}\n#gbm-magazine-page.pg .pg-cover .pg-btn{grid-column:2;justify-self:start}\n#gbm-magazine-page.pg .pg-cover>.pg-cr{padding:0 36px 14px}\n#gbm-magazine-page.pg .pg-lead{max-width:920px;margin-left:auto;margin-right:auto}\n#gbm-magazine-page.pg .pg-grid{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:0 28px;align-items:start}\n#gbm-magazine-page.pg .pg-cgrid{grid-template-columns:repeat(3,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-games{grid-template-columns:repeat(3,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-keys ol{grid-template-columns:repeat(4,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-rows{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 40px}\n#gbm-magazine-page.pg .pg-yrs{grid-template-columns:repeat(6,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-mosaic{grid-template-columns:repeat(4,minmax(0,1fr))}\n#gbm-magazine-page.pg .pg-s0{grid-column:span 2;grid-row:span 2}\n}\n@media print{#gbm-magazine-page.pg{background:#fff;color:#000}#gbm-magazine-page.pg .pg-ticker{display:none}}\n#gbm-magazine-page.pg .pg-print{justify-self:start;margin-top:14px;font:800 15px/1 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase;color:#fff;background:transparent;border:2px solid var(--pg-orange);border-radius:999px;padding:11px 20px;cursor:pointer}\n#gbm-magazine-page.pg .pg-print:hover,#gbm-magazine-page.pg .pg-print:focus-visible{background:var(--pg-orange)}\n@page{size:letter;margin:9mm}\n@media print{\nhtml,body{background:#060b1c!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}\n#SITE_HEADER,#SITE_FOOTER,[id*=\"consent\"],[class*=\"consent\"],[data-hook*=\"consent\"]{display:none!important}\n#gbm-magazine-page.pg{width:100%!important;max-width:none!important;margin:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}\n#gbm-magazine-page.pg *{-webkit-print-color-adjust:exact;print-color-adjust:exact;animation:none!important}\n#gbm-magazine-page.pg .pg-print,#gbm-magazine-page.pg .pg-ticker,#gbm-magazine-page.pg .pg-btn{display:none!important}\n#gbm-magazine-page.pg section,#gbm-magazine-page.pg article,#gbm-magazine-page.pg .pg-card,#gbm-magazine-page.pg .pg-key,#gbm-magazine-page.pg figure,#gbm-magazine-page.pg .pg-sg{break-inside:avoid;page-break-inside:avoid}\n#gbm-magazine-page.pg h2{break-after:avoid}\n#gbm-magazine-page.pg a{text-decoration:none}\n}";
  var ISSUE = {"id":"2026-10-02-friday-pregame","layout":"pregame","issue":{"number":"Game Day Edition","name":"Florida at Missouri","date":"Saturday, October 3, 2026","week":"Week 5 · Saturday 3:50 p.m. ET · ABC","tagline":"Independent Florida Gators coverage","pageTitle":"GatorBait Magazine | Game Day: Florida at Missouri"},"asOf":"ESPN data as of Oct. 1-2, 2026. Kickoff, line and forecast can move before Saturday.","cover":{"kicker":"The Soothsayer · Franz Beard","headline":"Gators head to Missouri, where history hasn’t been kind","dek":"No. 8 Florida (4-0) is 2-4 in Columbia since 2012 and has to find an emotional peak right after the biggest win in years. Franz Beard asks if the Gators are tough enough.","byline":"By Franz Beard","url":"/post/the-soothsayer-gators-head-to-missouri-where-history-hasn-t-been-kind","image":{"id":"16b519_a0e407bedc46487ca71033fc8351d0fe","ext":"jpg","width":3000,"height":1874,"alt":"Florida’s goal-line push against Ole Miss, with Jadan Baugh (13) in the pile (Photo by Chris Spears, GatorBait Media)","credit":"Photo by Chris Spears, GatorBait Media"}},"game":{"label":"The game","kickoffISO":"2026-10-03T19:50:00Z","espnEvent":"401856708","kickoff":"Saturday, Oct. 3 · 3:50 p.m. ET","tv":"ABC","venue":"Memorial Stadium (Faurot Field), Columbia, Mo.","forecast":"71°, 0% chance of rain, gusts to 10 mph (ESPN forecast, Oct. 1)","teams":[{"rank":"No. 8","name":"Florida","record":"4-0","conf":"2-0 SEC","role":"AP No. 8 (up from No. 21)"},{"rank":"No. 25","name":"Missouri","record":"3-1","conf":"0-1 SEC","role":"AP No. 25 (down from No. 19)"}],"chips":[{"k":"Line","v":"Florida -5.5"},{"k":"Total","v":"57.5"},{"k":"Moneyline","v":"FLA -218 · MIZ +180"}],"predictor":{"label":"ESPN matchup predictor","florida":70.2,"missouri":29.8},"source":"ESPN game summary and pickcenter (DraftKings)"},"series":{"label":"The series","headline":"Six apiece since 2012","line":"Florida is 4-2 in Gainesville and 2-4 in Columbia in the 12 meetings since Missouri joined the SEC. They did not play in 2024 or 2025.","games":[{"year":2012,"site":"H","fla":14,"mizz":7},{"year":2013,"site":"A","fla":17,"mizz":36},{"year":2014,"site":"H","fla":13,"mizz":42},{"year":2015,"site":"A","fla":21,"mizz":3},{"year":2016,"site":"H","fla":40,"mizz":14},{"year":2017,"site":"A","fla":16,"mizz":45},{"year":2018,"site":"H","fla":17,"mizz":38},{"year":2019,"site":"A","fla":23,"mizz":6},{"year":2020,"site":"H","fla":41,"mizz":17},{"year":2021,"site":"A","fla":23,"mizz":24},{"year":2022,"site":"H","fla":24,"mizz":17},{"year":2023,"site":"A","fla":31,"mizz":33}],"source":"ESPN team schedules, 2012-2023"},"tape":{"label":"Tale of the tape","note":"Through four games, per game","source":"ESPN team statistics","rows":[{"label":"Points scored","fla":53.5,"miz":35.8,"unit":"","lower":false},{"label":"Total yards","fla":532.8,"miz":418.8,"unit":"","lower":false},{"label":"Rushing yards","fla":260,"miz":155.8,"unit":"","lower":false},{"label":"Passing yards","fla":272.8,"miz":263,"unit":"","lower":false},{"label":"Points allowed","fla":22.8,"miz":20.8,"unit":"","lower":true},{"label":"Rush yards allowed","fla":103,"miz":100.3,"unit":"","lower":true},{"label":"Pass yards allowed","fla":248.3,"miz":218.3,"unit":"","lower":true},{"label":"Penalty yards","fla":89.3,"miz":73,"unit":"","lower":true}]},"keys":{"label":"Three keys","items":[{"h":"Baugh against a top-20 run defense","p":"Florida runs for 260 yards a game and has 18 rushing touchdowns, tied for most in the country. Jadan Baugh has 600 yards and 11 touchdowns and has topped 100 in every game. Missouri allows 2.8 yards a carry, 19th nationally, and has given up two rushing touchdowns all season."},{"h":"Philo’s shots against a bend-don’t-break secondary","p":"Aaron Philo’s 10.5 yards an attempt leads the SEC and he has been sacked twice in 104 throws. Missouri allows just 56% completions, but Mississippi State threw for 360 on the Tigers last week."},{"h":"Third downs and Austin Simmons","p":"Florida allows 248 passing yards a game, 113th nationally, and opponents convert 41% on third down. Simmons has 11 touchdowns and no interceptions. Missouri has two giveaways, fewest in the SEC; Florida has seven takeaways."},{"h":"The flags","p":"Florida has 35 penalties for 357 yards, the most yards in the SEC. Missouri has 32 for 292. Read why the bill may come due.","url":"/post/florida-keeps-winning-big-and-the-laundry-keeps-piling-up"}],"source":"ESPN team statistics and box scores"},"injuries":{"label":"Availability","asOf":"Official SEC availability report, updated Thursday morning, Oct. 1 (FloridaGators.com). Final report comes before kickoff.","teams":[{"name":"Florida","items":[{"pos":"RB","name":"Kelvin Jimenez","status":"Out","detail":"Knee"},{"pos":"WR","name":"Vernell Brown III","status":"Questionable","detail":"Knee. An MRI showed a Grade 1 PCL sprain; game-time decision"},{"pos":"WR","name":"Bailey Stockton","status":"Questionable","detail":"Back"},{"pos":"WR","name":"Eric Singleton Jr.","status":"Probable","detail":"Ankle"}]},{"name":"Missouri","items":[{"pos":"RB","name":"Ahmad Hardy","status":"Out","detail":"Leg"},{"pos":"RB","name":"Malae Fonoti","status":"Out","detail":"Undisclosed"},{"pos":"OL","name":"Josh Atkins","status":"Out","detail":"Undisclosed"},{"pos":"TE","name":"Gavin Hoffman","status":"Out","detail":"Undisclosed"},{"pos":"DB","name":"JaDon Blair","status":"Out","detail":"Undisclosed"},{"pos":"DL","name":"Darris Smith","status":"Questionable","detail":"Lower body"},{"pos":"DL","name":"Langden Kitchen","status":"Questionable","detail":"Lower body"},{"pos":"LB","name":"Bobby Washington Jr.","status":"Questionable","detail":"Undisclosed"}]}],"source":"Source: FloridaGators.com, The Opening Kickoff (SEC availability report)"},"lead":{"label":"The Lead","kicker":"Eddie Gilley","author":"Eddie Gilley","title":"Something’s Got to Give","url":"/post/something-s-got-to-give","html":"<p>Florida wants to run behind Jadan Baugh. Missouri allows about 100 rushing yards a game. Eddie Gilley on which unit gives first in Columbia.</p>","continue":"Read the full column","date":"October 2, 2026","image":{"id":"d3cfa5_e1f06a6dd4ca414885aafdaf6db6ec35","ext":"jpg","width":1600,"height":900,"alt":"Something’s Got to Give (Photo: Hannah White / UAA Communications)","credit":"Photo: Hannah White / UAA Communications"},"caption":""},"slate":{"label":"The Sooth Board","note":"Saturday’s SEC games with Franz Beard’s picks","source":"Kickoffs, TV and lines: ESPN. Picks: Franz Beard, The Soothsayer.","games":[{"time":"Noon","tv":"ABC","away":{"rank":7,"name":"Alabama","rec":"4-0"},"home":{"rank":16,"name":"Mississippi State","rec":"4-0"},"line":"ALA -6","ou":60.5,"pick":"Alabama"},{"time":"12:45 p.m.","tv":"SEC Network","away":{"name":"Vanderbilt","rec":"3-1"},"home":{"rank":2,"name":"Georgia","rec":"4-0"},"line":"UGA -25.5","ou":50.5,"pick":"Georgia"},{"time":"3:50 p.m.","tv":"ABC","away":{"rank":8,"name":"Florida","rec":"4-0"},"home":{"rank":25,"name":"Missouri","rec":"3-1"},"line":"FLA -5.5","ou":57.5,"pick":"Florida","note":"by more than 5.5","hero":true},{"time":"3:30 p.m.","tv":"ESPN","away":{"name":"Auburn","rec":"3-1"},"home":{"rank":17,"name":"Tennessee","rec":"3-1"},"line":"TENN -7","ou":53.5,"pick":"Tennessee"},{"time":"4:15 p.m.","tv":"SEC Network","away":{"rank":24,"name":"Kentucky","rec":"3-1"},"home":{"name":"South Carolina","rec":"2-2"},"line":"SC -3","ou":54.5,"pick":"Kentucky"},{"time":"7 p.m.","tv":"ESPN2","away":{"name":"Arkansas","rec":"2-2"},"home":{"name":"Texas A&M","rec":"2-2"},"line":"TA&M -13.5","ou":50.5,"pick":"Texas A&M"},{"time":"7:45 p.m.","tv":"SEC Network","away":{"name":"McNeese","rec":"2-3"},"home":{"rank":11,"name":"LSU","rec":"3-1"},"line":"LSU -53.5","ou":62.5,"pick":"LSU"}]},"cards":{"label":"Missouri week","items":[{"kicker":"Buddy Martin · Column","title":"Coaches and Fans Have Different Playbooks. So Have Another Round, Thirsty Gators.","url":"/post/coaches-and-fans-have-different-playbooks-so-have-another-round-thirsty-gators","excerpt":"Florida fans have earned the right to brag after four years of misery. Just don’t build a shrine on an early poll before Saturday’s trip to Missouri.","image":{"id":"d3cfa5_408fa442a2d54309aa66050fb0f4d35e","ext":"jpg","width":1024,"height":800,"alt":"Jon Sumrall reacts on the Florida sideline with an official in the foreground (Photo by Chris Spears, GatorBait Media)","credit":"Photo by Chris Spears, GatorBait Media"},"date":"Oct. 1"},{"kicker":"Franz Beard · Column","title":"When it came to finding a quarterback Sumrall trusted Buster and it paid off","url":"/post/when-it-came-to-finding-a-quarterback-sumrall-trusted-buster-and-it-paid-off","excerpt":"Trust was put to the ultimate test back in January.","image":{"id":"16b519_00359caad82744778e7c387d8bf98777","ext":"jpg","width":1600,"height":900,"alt":"When it came to finding a quarterback Sumrall trusted Buster and it paid off (Photo by Chris Spears, GatorBait Media)","credit":"Photo by Chris Spears, GatorBait Media"},"date":"Oct. 1"},{"kicker":"Buddy Martin · Column","title":"The Looming Brilliance of Buster Faulkner: “If It Works Once, We Retire It”","url":"/post/the-looming-brilliance-of-buster-faulkner-if-it-works-one-time-we-retire-it","excerpt":"I’ll be honest. This guy could turn out to be brilliant. Maybe even Steve Spurrier brilliant.","image":{"id":"d3cfa5_56a64986c874417c9a8299fae22649ed","ext":"jpg","width":1600,"height":1440,"alt":"The Looming Brilliance of Buster Faulkner: “If It Works Once, We Retire It” (Photo by Chris Spears, GatorBait Media · Faulkner: UAA)","credit":"Photo by Chris Spears, GatorBait Media · Faulkner: UAA"},"date":"Sept. 30"}]},"shots":{"label":"Best shots","note":"From Florida 52, Ole Miss 28","url":"/post/chris-spears-best-shots-vol-2-florida-52-ole-miss-28","credit":"Photo by Chris Spears, GatorBait Media","photos":[{"id":"16b519_9e6aad749e564c33ab69f6e7e19e9560","ext":"jpg","width":3000,"height":1851,"alt":"The Swamp before kickoff against Ole Miss.","caption":"The Swamp before kickoff"},{"id":"16b519_958769d0cfef4d9e931621ae78bfd008","ext":"jpg","width":3000,"height":1848,"alt":"Gators players celebrate a touchdown against Ole Miss.","caption":"Celebrating a touchdown"},{"id":"16b519_ab5daac7afa94664b9e6a4931049cfb9","ext":"jpg","width":3000,"height":1834,"alt":"Florida defenders make a tackle against Ole Miss.","caption":"The defense swarms"},{"id":"d3cfa5_ce8defc3525b4e74a6a394170740c270","ext":"jpg","width":1600,"height":900,"alt":"Jon Sumrall leads the Gators onto the field.","caption":"Sumrall leads the Gators out"},{"id":"16b519_f3af81d3cac048ae84d89d9194ddd9eb","ext":"jpg","width":3000,"height":2000,"alt":"A Florida player speaks with reporters after the win.","caption":"After the win"}]},"reference":{"label":"Reference desk","links":[{"label":"Roster","url":"/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#roster"},{"label":"Schedule and results","url":"/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#schedule"},{"label":"The Buddy Martin Show","url":"/the-buddy-martin-show"}],"next":"Next up: South Carolina, Oct. 10, in The Swamp. Then Texas in Austin on Oct. 17."},"rosters":{"label":"Rosters","note":"Tap a team to see every player. Injury status from the official availability report.","source":"Rosters: ESPN, Oct. 2. Availability: FloridaGators.com.","teams":[{"name":"Florida","sub":"Gators","players":[{"n":"0","name":"Jayden Woods","pos":"LB","cls":"SO","side":"defense","st":""},{"n":"1","name":"Bryce Thornton","pos":"S","cls":"SR","side":"defense","st":""},{"n":"1","name":"Vernell Brown III","pos":"WR","cls":"SO","side":"offense","st":"Questionable"},{"n":"2","name":"Eric Singleton Jr.","pos":"WR","cls":"SR","side":"offense","st":"Probable"},{"n":"2","name":"Lagonza Hayward","pos":"S","cls":"SO","side":"defense","st":""},{"n":"3","name":"Bailey Stockton","pos":"WR","cls":"SR","side":"offense","st":"Questionable"},{"n":"3","name":"Onis Konanbanny","pos":"CB","cls":"SO","side":"defense","st":""},{"n":"4","name":"TJ Abrams","pos":"WR","cls":"JR","side":"offense","st":""},{"n":"5","name":"Micah Mays Jr.","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"5","name":"Myles Graham","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"6","name":"Dallas Wilson","pos":"WR","cls":"SO","side":"offense","st":""},{"n":"6","name":"J'Vari Flowers","pos":"CB","cls":"SO","side":"defense","st":""},{"n":"7","name":"Amir Jackson","pos":"TE","cls":"JR","side":"offense","st":""},{"n":"7","name":"Ty Jackson","pos":"LB","cls":"SO","side":"defense","st":""},{"n":"8","name":"Aaron Chiles","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"9","name":"Drake Stubbs","pos":"S","cls":"SO","side":"defense","st":""},{"n":"9","name":"Tramell Jones Jr.","pos":"QB","cls":"SO","side":"offense","st":""},{"n":"10","name":"Aaron Williams","pos":"QB","cls":"JR","side":"offense","st":""},{"n":"10","name":"Cam Dooley","pos":"S","cls":"JR","side":"defense","st":""},{"n":"11","name":"LJ McCray","pos":"DL","cls":"JR","side":"defense","st":""},{"n":"11","name":"Will Griffin","pos":"QB","cls":"FR","side":"offense","st":""},{"n":"12","name":"Aaron Philo","pos":"QB","cls":"JR","side":"offense","st":""},{"n":"12","name":"Ben Hanks III","pos":"CB","cls":"SO","side":"defense","st":""},{"n":"13","name":"Jadan Baugh","pos":"RB","cls":"JR","side":"offense","st":""},{"n":"13","name":"Jordy Lowery","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"14","name":"Jaden Edgecombe","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"14","name":"KJ Ford","pos":"LB","cls":"FR","side":"defense","st":""},{"n":"15","name":"CJ Bronaugh","pos":"CB","cls":"FR","side":"defense","st":""},{"n":"15","name":"Luke Harpring","pos":"TE","cls":"JR","side":"offense","st":""},{"n":"16","name":"Aidan Warner","pos":"QB","cls":"SR","side":"offense","st":""},{"n":"16","name":"TJ Bullard","pos":"LB","cls":"SR","side":"defense","st":""},{"n":"17","name":"Lacota Dippre","pos":"TE","cls":"SR","side":"offense","st":""},{"n":"17","name":"Titus Bullard","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"18","name":"Davian Groce","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"19","name":"Jaylen Lloyd","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"20","name":"Duke Clark","pos":"RB","cls":"SO","side":"offense","st":""},{"n":"20","name":"Kanye Clark","pos":"DB","cls":"SR","side":"defense","st":""},{"n":"21","name":"CJ Hester","pos":"CB","cls":"FR","side":"defense","st":""},{"n":"21","name":"Evan Pryor","pos":"RB","cls":"SR","side":"offense","st":""},{"n":"22","name":"Kahleil Jackson","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"22","name":"Kofi Asare","pos":"LB","cls":"SR","side":"defense","st":""},{"n":"23","name":"Javier Jones","pos":"CB","cls":"JR","side":"defense","st":""},{"n":"24","name":"Kamran James","pos":"DL","cls":"SR","side":"defense","st":""},{"n":"24","name":"London Montgomery","pos":"RB","cls":"SR","side":"offense","st":""},{"n":"25","name":"Anthony Rubio","pos":"RB","cls":"SR","side":"offense","st":""},{"n":"25","name":"Cormani McClain","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"27","name":"Byron Louis","pos":"RB","cls":"SO","side":"offense","st":""},{"n":"27","name":"Dijon Johnson","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"28","name":"Elijah Owens","pos":"DB","cls":"SO","side":"defense","st":""},{"n":"29","name":"Jaden Robinson","pos":"LB","cls":"SR","side":"defense","st":""},{"n":"30","name":"Dylan Purter","pos":"DB","cls":"FR","side":"defense","st":""},{"n":"32","name":"Eric Parks","pos":"S","cls":"FR","side":"defense","st":""},{"n":"33","name":"Brian Case","pos":"RB","cls":"SO","side":"offense","st":""},{"n":"33","name":"DJ Coleman","pos":"S","cls":"SR","side":"defense","st":""},{"n":"34","name":"Kaiden Hall","pos":"S","cls":"FR","side":"defense","st":""},{"n":"34","name":"Kelvin Jimenez","pos":"RB","cls":"JR","side":"offense","st":"Out"},{"n":"35","name":"Brayden Slade","pos":"S","cls":"SR","side":"defense","st":""},{"n":"36","name":"Vincent Brown Jr.","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"37","name":"Javion Toombs","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"38","name":"Alec Clark","pos":"P","cls":"SR","side":"specialTeam","st":""},{"n":"39","name":"Carter Milliron","pos":"LS","cls":"SR","side":"specialTeam","st":""},{"n":"40","name":"Brandon Rabasco","pos":"PK","cls":"JR","side":"specialTeam","st":""},{"n":"40","name":"Jayden Gross","pos":"DL","cls":"FR","side":"defense","st":""},{"n":"41","name":"Liam Padron","pos":"PK","cls":"JR","side":"specialTeam","st":""},{"n":"42","name":"Matthew Kade","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"43","name":"Alfonzo Allen Jr.","pos":"S","cls":"SR","side":"defense","st":""},{"n":"44","name":"Myles Johnson","pos":"LB","cls":"SO","side":"defense","st":""},{"n":"47","name":"Miller Fealy","pos":"P","cls":"JR","side":"specialTeam","st":""},{"n":"48","name":"Erich Seager","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"48","name":"Nicholas Inglis","pos":"P","cls":"JR","side":"specialTeam","st":""},{"n":"49","name":"Jalen Wiggins","pos":"DL","cls":"SO","side":"defense","st":""},{"n":"50","name":"Jason Zandamela","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"50","name":"Malik Morris","pos":"LB","cls":"FR","side":"defense","st":""},{"n":"51","name":"Tyler Chukuyem","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"52","name":"Dylan Leighton","pos":"LB","cls":"SO","side":"defense","st":""},{"n":"52","name":"Harrison Moore","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"53","name":"Bryce Lovett","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"54","name":"Javarii Luckas","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"54","name":"Lincoln Anderson","pos":"LS","cls":"FR","side":"specialTeam","st":""},{"n":"55","name":"Charles Emanuel III","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"55","name":"TJ Dice Jr.","pos":"OL","cls":"SO","side":"offense","st":""},{"n":"56","name":"Jahari Medlock","pos":"OL","cls":"SO","side":"offense","st":""},{"n":"56","name":"Stive-Bentley Keumajou-Yondui","pos":"DL","cls":"FR","side":"defense","st":""},{"n":"58","name":"Hunter Solwold","pos":"LS","cls":"SO","side":"specialTeam","st":""},{"n":"59","name":"Corey Brown","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"61","name":"G'Nivre Carr","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"63","name":"Caden Jones","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"64","name":"Eagan Boyer","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"66","name":"Emeka Ugorji","pos":"OL","cls":"SO","side":"offense","st":""},{"n":"67","name":"TJ Shanahan Jr.","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"68","name":"Fletcher Westphal","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"71","name":"Roderick Kearney","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"73","name":"Daniel Pierre Louis","pos":"OL","cls":"SO","side":"offense","st":""},{"n":"76","name":"Mark Faircloth","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"77","name":"Knijeah Harris","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"78","name":"Desmond Green","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"79","name":"Chancellor Campbell","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"80","name":"Jaylen Jordon","pos":"TE","cls":"SR","side":"offense","st":""},{"n":"81","name":"Mason Jordan","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"82","name":"Ace Ciongoli","pos":"WR","cls":"SO","side":"offense","st":""},{"n":"83","name":"Justin Williams","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"84","name":"Micah Jones","pos":"TE","cls":"SO","side":"offense","st":""},{"n":"85","name":"Evan Chieca","pos":"TE","cls":"SR","side":"offense","st":""},{"n":"86","name":"Heze Kent","pos":"TE","cls":"FR","side":"offense","st":""},{"n":"88","name":"Marquez Daniel","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"89","name":"Tripp Brown Jr.","pos":"TE","cls":"FR","side":"offense","st":""},{"n":"90","name":"Brendan Bett","pos":"DL","cls":"SR","side":"defense","st":""},{"n":"91","name":"Jeramiah McCloud","pos":"DL","cls":"SO","side":"defense","st":""},{"n":"91","name":"Patrick Durkin","pos":"PK","cls":"JR","side":"specialTeam","st":""},{"n":"92","name":"Sebastian Scott","pos":"DL","cls":"SR","side":"defense","st":""},{"n":"93","name":"DK Kalu","pos":"DL","cls":"SR","side":"defense","st":""},{"n":"94","name":"Kendall Guervil","pos":"DL","cls":"FR","side":"defense","st":""},{"n":"95","name":"Jamari Lyons","pos":"DL","cls":"SR","side":"defense","st":""},{"n":"96","name":"JaReylan McCoy","pos":"DL","cls":"FR","side":"defense","st":""},{"n":"97","name":"Joseph Mbatchou","pos":"DL","cls":"SO","side":"defense","st":""},{"n":"98","name":"Mason Clinton","pos":"DL","cls":"SR","side":"defense","st":""},{"n":"99","name":"Emmanuel Oyebadejo","pos":"DL","cls":"SR","side":"defense","st":""}]},{"name":"Missouri","sub":"Tigers","players":[{"n":"0","name":"Naeshaun Montgomery","pos":"WR","cls":"SO","side":"offense","st":""},{"n":"0","name":"Robert Woodyard Jr.","pos":"LB","cls":"SR","side":"defense","st":""},{"n":"1","name":"Chris Graves Jr.","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"1","name":"Donovan Olugbode","pos":"WR","cls":"SO","side":"offense","st":""},{"n":"2","name":"Caleb Goodie Sr.","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"2","name":"Sione Laulea","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"3","name":"DaMarion Fowlkes","pos":"WR","cls":"SO","side":"offense","st":""},{"n":"3","name":"Marquis Gracial","pos":"DT","cls":"SR","side":"defense","st":""},{"n":"4","name":"Shaun Terry II","pos":"WR","cls":"SO","side":"offense","st":""},{"n":"4","name":"Trajen Greco","pos":"S","cls":"JR","side":"defense","st":""},{"n":"5","name":"Matt Zollers","pos":"QB","cls":"SO","side":"offense","st":""},{"n":"5","name":"Nicholas Rodriguez","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"6","name":"Jeremiah Beasley","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"7","name":"Gavin Sidwar","pos":"QB","cls":"FR","side":"offense","st":""},{"n":"7","name":"Kensley Louidor-Faustin","pos":"S","cls":"JR","side":"defense","st":""},{"n":"8","name":"Donta Simpson","pos":"DT","cls":"SO","side":"defense","st":""},{"n":"9","name":"Dante McClellan","pos":"LB","cls":"SO","side":"defense","st":""},{"n":"10","name":"Daeden Hopkins","pos":"EDGE","cls":"SO","side":"defense","st":""},{"n":"10","name":"Nick Evers","pos":"QB","cls":"SR","side":"offense","st":""},{"n":"11","name":"Jabari Brady","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"11","name":"Langden Kitchen","pos":"EDGE","cls":"SR","side":"defense","st":"Questionable"},{"n":"12","name":"Devyon Hill-Lomax","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"12","name":"Malik Bryant","pos":"EDGE","cls":"SR","side":"defense","st":""},{"n":"13","name":"Austin Simmons","pos":"QB","cls":"SR","side":"offense","st":""},{"n":"13","name":"Jaden Jones","pos":"EDGE","cls":"SR","side":"defense","st":""},{"n":"14","name":"Brett Brown","pos":"QB","cls":"SR","side":"offense","st":""},{"n":"14","name":"CJ Bass III","pos":"S","cls":"SO","side":"defense","st":""},{"n":"15","name":"Santana Banner","pos":"S","cls":"SR","side":"defense","st":""},{"n":"16","name":"Bobby Washington Jr.","pos":"LB","cls":"SR","side":"defense","st":"Questionable"},{"n":"17","name":"Brian Huff","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"17","name":"Kenric Lanier II","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"18","name":"Isaac Jensen","pos":"TE","cls":"FR","side":"offense","st":""},{"n":"18","name":"JaDon Blair","pos":"S","cls":"SO","side":"defense","st":"Out"},{"n":"19","name":"Blake Craig","pos":"PK","cls":"SR","side":"specialTeam","st":""},{"n":"19","name":"Cayden Lee","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"19","name":"Darris Smith","pos":"EDGE","cls":"SR","side":"defense","st":"Questionable"},{"n":"20","name":"Cameron Keys","pos":"CB","cls":"JR","side":"defense","st":""},{"n":"20","name":"Jamal Roberts","pos":"RB","cls":"SR","side":"offense","st":""},{"n":"21","name":"Jahlil Florence","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"21","name":"Malae Fonoti","pos":"RB","cls":"JR","side":"offense","st":"Out"},{"n":"22","name":"Elijah Dotson","pos":"S","cls":"SO","side":"defense","st":""},{"n":"22","name":"Max Warner","pos":"RB","cls":"FR","side":"offense","st":""},{"n":"24","name":"Nick DeLoach Jr.","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"24","name":"Xai'Shaun Edwards","pos":"RB","cls":"JR","side":"offense","st":""},{"n":"25","name":"Jason King","pos":"LB","cls":"SO","side":"defense","st":""},{"n":"26","name":"Brady Hultman","pos":"RB","cls":"SR","side":"offense","st":""},{"n":"26","name":"Jaxson Gates","pos":"CB","cls":"FR","side":"defense","st":""},{"n":"28","name":"Jayden McGregory","pos":"S","cls":"FR","side":"defense","st":""},{"n":"28","name":"Preston Hatfield","pos":"RB","cls":"FR","side":"offense","st":""},{"n":"29","name":"Ahmad Hardy","pos":"RB","cls":"JR","side":"offense","st":"Out"},{"n":"29","name":"Kamauryn Morgan","pos":"EDGE","cls":"SO","side":"defense","st":""},{"n":"30","name":"Carter Stewart","pos":"S","cls":"FR","side":"defense","st":""},{"n":"31","name":"Anthony Favrow","pos":"RB","cls":"SR","side":"offense","st":""},{"n":"31","name":"Nasir Pogue","pos":"CB","cls":"SR","side":"defense","st":""},{"n":"32","name":"Brody Jones","pos":"S","cls":"FR","side":"defense","st":""},{"n":"32","name":"Gavin Wyatt","pos":"WR","cls":"JR","side":"offense","st":""},{"n":"33","name":"DJ McBride II","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"33","name":"JJ Bush","pos":"LB","cls":"FR","side":"defense","st":""},{"n":"34","name":"Jackson Hancock","pos":"S","cls":"JR","side":"defense","st":""},{"n":"34","name":"Mark Shenouda","pos":"P","cls":"SR","side":"specialTeam","st":""},{"n":"35","name":"Ahmod Billins","pos":"DB","cls":"FR","side":"defense","st":""},{"n":"36","name":"Sean Gross","pos":"LS","cls":"SO","side":"specialTeam","st":""},{"n":"36","name":"Trashundon Neal","pos":"CB","cls":"FR","side":"defense","st":""},{"n":"38","name":"Henry Crosby","pos":"LS","cls":"SO","side":"specialTeam","st":""},{"n":"38","name":"Keenan Harris","pos":"LB","cls":"FR","side":"defense","st":""},{"n":"39","name":"Maddux Hermestroff","pos":"S","cls":"SO","side":"defense","st":""},{"n":"40","name":"Brunno Reus","pos":"PK","cls":"SO","side":"specialTeam","st":""},{"n":"41","name":"Graham Faust","pos":"S","cls":"FR","side":"defense","st":""},{"n":"43","name":"John Butcher","pos":"P","cls":"SR","side":"specialTeam","st":""},{"n":"46","name":"Jackson Daily","pos":"LB","cls":"JR","side":"defense","st":""},{"n":"48","name":"Oliver Robbins","pos":"PK","cls":"JR","side":"specialTeam","st":""},{"n":"49","name":"Brett Le Blanc","pos":"LS","cls":"SR","side":"specialTeam","st":""},{"n":"51","name":"Luke Work","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"52","name":"Demarcus Johnson","pos":"EDGE","cls":"JR","side":"defense","st":""},{"n":"52","name":"Zack Owens","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"53","name":"Tommy Reese","pos":"LB","cls":"SR","side":"defense","st":""},{"n":"54","name":"Josh Atkins","pos":"OL","cls":"SR","side":"offense","st":"Out"},{"n":"55","name":"Cavan Tuley","pos":"EDGE","cls":"SR","side":"defense","st":""},{"n":"55","name":"Will Kemna","pos":"OL","cls":"SO","side":"offense","st":""},{"n":"56","name":"Dominick Giudice","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"57","name":"Mark Hensley","pos":"DT","cls":"SR","side":"defense","st":""},{"n":"58","name":"Khalief Canty Jr.","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"63","name":"Chace Missouri","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"64","name":"Joe Schranz","pos":"OL","cls":"SO","side":"offense","st":""},{"n":"65","name":"Brysen Wessell","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"66","name":"Logan Reichert","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"69","name":"Braylon Ellison","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"70","name":"Cayden Green","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"71","name":"Ryan Jostes","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"72","name":"Colin Sorensen","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"73","name":"Tristan Wilson","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"74","name":"Whit Hafer","pos":"OL","cls":"JR","side":"offense","st":""},{"n":"75","name":"Jack Lange","pos":"OL","cls":"SO","side":"offense","st":""},{"n":"77","name":"Curtis Peagler","pos":"OL","cls":"SR","side":"offense","st":""},{"n":"78","name":"DJ Jones","pos":"OL","cls":"FR","side":"offense","st":""},{"n":"80","name":"Jayden Bolton","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"81","name":"Noah Flaskamp","pos":"WR","cls":"SR","side":"offense","st":""},{"n":"82","name":"Karsten Fiene","pos":"WR","cls":"FR","side":"offense","st":""},{"n":"84","name":"Adam Molitor","pos":"TE","cls":"JR","side":"offense","st":""},{"n":"86","name":"Jordon Harris","pos":"TE","cls":"SR","side":"offense","st":""},{"n":"87","name":"Brett Norfleet","pos":"TE","cls":"SR","side":"offense","st":""},{"n":"88","name":"Gavin Hoffman","pos":"TE","cls":"JR","side":"offense","st":"Out"},{"n":"89","name":"Jude James","pos":"TE","cls":"JR","side":"offense","st":""},{"n":"90","name":"Sterling Webb","pos":"DT","cls":"SR","side":"defense","st":""},{"n":"91","name":"Elias Williams","pos":"DT","cls":"JR","side":"defense","st":""},{"n":"92","name":"Jason Dowell","pos":"DT","cls":"SO","side":"defense","st":""},{"n":"93","name":"Jocques Felix","pos":"DT","cls":"FR","side":"defense","st":""},{"n":"94","name":"Sam Williams","pos":"DT","cls":"SR","side":"defense","st":""},{"n":"95","name":"Jalen Marshall","pos":"DT","cls":"SR","side":"defense","st":""},{"n":"96","name":"Aidan Dubbert","pos":"EDGE","cls":"SR","side":"defense","st":""},{"n":"97","name":"CJ May","pos":"EDGE","cls":"SO","side":"defense","st":""},{"n":"98","name":"Tajh Overton","pos":"DT","cls":"FR","side":"defense","st":""},{"n":"99","name":"Jadon Frick","pos":"DT","cls":"JR","side":"defense","st":""}]}]},"watch":{"label":"How to watch","items":[{"k":"Kickoff","v":"Saturday, Oct. 3, 3:50 p.m. ET"},{"k":"TV","v":"ABC"},{"k":"Stream","v":"ESPN app, with a TV-provider login"},{"k":"Radio","v":"Gator IMG Sports Network, with Sean Kelley"},{"k":"Where","v":"Memorial Stadium (Faurot Field), Columbia, Mo. Missouri homecoming"}],"links":[{"label":"Find your Gators radio station","url":"https://floridagators.com/sports/2015/12/11/_radio_affiliates_"},{"label":"Game Day thread on the Boards","url":"/groups"}],"source":"Sources: ESPN broadcast listing; FloridaGators.com radio network."}};
  var BUILD = "8ec91d1b";
  var CREDITS = {"d3cfa5_56a64986c874417c9a8299fae22649ed":"Photo by Chris Spears, GatorBait Media · Faulkner: UAA","d3cfa5_d3190d83cdfc44549b10b6bd025e57a3":"Photo by Chris Spears, GatorBait Media","d3cfa5_2ea58f38e2da4c988ab73065cfe63130":"Photo by Chris Spears, GatorBait Media","d3cfa5_026d2a4d2be04a91b8c32317fed5f623":"Photo by Chris Spears, GatorBait Media","d3cfa5_1043f4b7772245baa5aed5f80c21669a":"Photo by Chris Spears, GatorBait Media","d3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b":"Photo by Chris Spears, GatorBait Media","16b519_a0e407bedc46487ca71033fc8351d0fe":"Photo by Chris Spears, GatorBait Media","d3cfa5_e1f06a6dd4ca414885aafdaf6db6ec35":"Photo: Hannah White / UAA Communications"};
  /* Runtime for GatorBait Magazine 2026: the weekly web issue on /magazine. CSS, ISSUE and BUILD are injected by
   * sports-live/build-magazine.mjs. Contract: one root #gbm-magazine-page.mz26, mounted on /magazine only and removed on
   * every other route (popstate / gbmroutechange, like the urban embed it replaces); html.gbm-magazine-live while mounted,
   * which is the class the loader and the old embed hide the native page by; window.__GBM_MAG26__ {sync, ready, build};
   * window.__GBM_MAG_EDITION__ + the gbm:magazine-edition event kept from the urban embed for anything that still reads
   * the lead. The renderer prints only what the issue JSON holds: a missing, empty or pending slot renders nothing, and
   * no line of copy, label or number comes from this file. */
  var VERSION = 'magazine-2026.1';
  var SITE = 'https://www.gatorbaitmedia.com';
  var MEDIA = 'https://static.wixstatic.com/media/';
  var FONTS = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap';
  var doc = document.documentElement;
  if (window.__GBM_MAG26__) { window.__GBM_MAG26__.sync(); return; }

  function onRoute() { return window.__GBM_MAG_PREVIEW__ === true || /^\/magazine\/?$/.test(location.pathname || ''); } // __GBM_MAG_PREVIEW__: repo preview page only (deploy/covers/pregame-preview.html), never set on the site
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function text(v, max) { return v == null || typeof v === 'object' ? '' : String(v).replace(/\s+/g, ' ').trim().slice(0, max || 400); }
  function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : null; }
  function list(v, max) { return Array.isArray(v) ? v.filter(function (x) { return x != null; }).slice(0, max || 24) : []; }
  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }
  // Links: our own site only, kept site-relative so one canonical /post/ URL is one href everywhere.
  function safeUrl(value) {
    try {
      var u = new URL(String(value || ''), SITE);
      if (u.protocol !== 'https:' || u.username || u.password) return '';
      return /^(www\.)?gatorbaitmedia\.com$/.test(u.hostname) ? u.pathname + u.search + u.hash : '';
    } catch (_) { return ''; }
  }

  /* ---------- Images: Wix cuts, contain (never crop), srcset ----------
   * An image is {id, ext, width, height, alt, credit} (id = Wix media id without ~mv2) or a full static.wixstatic.com URL.
   * Every cut asks Wix to fit the photo in a box of its own ratio and pick the encoding (enc_auto). */
  function media(img) {
    if (typeof img === 'string') { var m = /^https:\/\/static\.wixstatic\.com\/media\/([0-9a-f]+_[0-9a-f]{32}~mv2\.(?:jpe?g|png|webp|avif))(?:[\/?#].*)?$/i.exec(img); return m ? m[1] : ''; }
    var o = obj(img); if (!o) return '';
    var id = text(o.id, 80), ext = (text(o.ext, 5) || 'jpg').toLowerCase();
    return /^[0-9a-f]+_[0-9a-f]{32}$/.test(id) && /^(jpe?g|png|webp|avif)$/.test(ext) ? id + '~mv2.' + ext : '';
  }
  function cut(file, w, h) { return MEDIA + file + '/v1/fit/w_' + w + ',h_' + h + ',al_c,q_80,enc_auto/gatorbait.jpg'; }
  function picture(img, o) {
    var file = media(img); if (!file) return '';
    var W = num(img.width) || o.w || 1600, H = num(img.height) || o.h || 900, r = H / W;
    var widths = [480, 800, 1200, 1600].filter(function (x) { return x <= Math.max(W, 480); });
    var main = o.main || 1200, set = widths.map(function (x) { return cut(file, x, Math.round(x * r)) + ' ' + x + 'w'; }).join(', ');
    return '<img src="' + esc(cut(file, Math.min(main, W), Math.round(Math.min(main, W) * r))) + '" srcset="' + esc(set) + '" sizes="' + esc(o.sizes || '(max-width: 820px) 100vw, 60vw') + '" alt="' + esc(text(img.alt, 200)) + '" width="' + W + '" height="' + H + '" loading="' + (o.eager ? 'eager' : 'lazy') + '" decoding="async"' + (o.eager ? ' fetchpriority="high"' : '') + '>';
  }
  function frame(img, o) {
    var pic = picture(img, o || {}); if (!pic) return '';
    var W = num(img.width) || 1600, H = num(img.height) || 900;
    return '<span class="mz-frame" style="aspect-ratio:' + W + '/' + H + '">' + pic + '</span>';
  }
  function credit(img) { var c = img && text(img.credit, 160); return c ? '<p class="mz-cr">' + esc(c) + '</p>' : ''; }
  function fonts() {
    if (!document.getElementById('gbm-mag26-fonts') && !document.querySelector('link[rel="stylesheet"][href*="Barlow+Condensed"]')) {
      var l = document.createElement('link'); l.id = 'gbm-mag26-fonts'; l.rel = 'stylesheet'; l.href = FONTS; document.head.appendChild(l);
    }
  }
  function styles() {
    if (document.getElementById('gbm-mag26-css')) return;
    var s = document.createElement('style'); s.id = 'gbm-mag26-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  /* ---------- Sections. Each returns '' when its data is missing, empty or pending. ---------- */
  function sectionHead(id, label, note) { return label ? '<div class="mz-sec-h"><h2 id="' + id + '-title">' + esc(label) + '</h2>' + (note ? '<p>' + esc(note) + '</p>' : '') + '</div>' : ''; }
  function source(s) { s = text(s, 60); return s ? '<small class="mz-src">' + esc(s) + '</small>' : ''; }

  function head(D) {
    var I = obj(D.issue) || {}, M = obj(D.masthead) || {};
    // The masthead is a logo file, used as given (no re-cut): a plain static.wixstatic.com media URL or an {id, ext} like any photo.
    var mast = typeof M.image === 'string' && /^https:\/\/static\.wixstatic\.com\/media\/[0-9a-f]+_[0-9a-f]{32}~mv2\.(?:webp|png|jpe?g)$/i.test(M.image) ? M.image : media(M.image) ? MEDIA + media(M.image) : '';
    var top = text(I.tagline, 120), num = text(I.number, 40), name = text(I.name, 120), date = text(I.date, 60), week = text(I.week, 120);
    if (!mast && !name && !date) return '';
    return '<header class="mz-head">' + (top || num ? '<div class="mz-head-top"><span>' + esc(top) + '</span><span>' + esc(num) + '</span></div>' : '') +
      '<div class="mz-mast"><b>Magazine</b></div>' +
      (name || date || week ? '<p class="mz-issue">' + [name, date].filter(Boolean).map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + (week ? '<span class="mz-week">' + esc(week) + '</span>' : '') + '</p>' : '') + '</header>';
  }
  function cover(D, L) {
    var C = obj(D.cover); if (!C || C.pending) return '';
    var url = safeUrl(C.url), hl = text(C.headline, 200); if (!url || !hl) return '';
    var fig = frame(C.image, { eager: true, main: 1600, sizes: '(max-width: 820px) 100vw, 700px' });
    return '<section class="mz-cover" id="mz-cover" data-mz="cover" aria-labelledby="mz-cover-h">' +
      (fig ? '<div class="mz-cover-fig"><a href="' + esc(url) + '" tabindex="-1" aria-hidden="true">' + fig + '</a>' + credit(C.image) + '</div>' : '') +
      '<div class="mz-cover-type">' + (text(C.kicker, 80) ? '<span class="mz-kick">' + esc(text(C.kicker, 80)) + '</span>' : '') +
      '<h1 id="mz-cover-h"><a href="' + esc(url) + '">' + esc(hl) + '</a></h1>' +
      (text(C.dek, 600) ? '<p class="mz-dek">' + esc(text(C.dek, 600)) + '</p>' : '') + (text(C.byline, 80) ? '<p class="mz-by">' + esc(text(C.byline, 80)) + '</p>' : '') +
      (text(L.read, 40) ? '<a class="mz-btn" href="' + esc(url) + '">' + esc(text(L.read, 40)) + '</a>' : '') + '</div></section>';
  }
  function contents(items, L) {
    if (!items.length || !text(L.contents, 40)) return '';
    return '<nav class="mz-toc" id="mz-contents" data-mz="contents" aria-label="' + esc(text(L.contents, 40)) + '"><span class="mz-kick">' + esc(text(L.contents, 40)) + '</span><ol>' +
      items.map(function (s, i) { return '<li><a href="#' + s.id + '"><b aria-hidden="true">' + (i < 9 ? '0' : '') + (i + 1) + '</b><span><small>' + esc(s.label) + '</small>' + esc(s.note) + '</span></a></li>'; }).join('') + '</ol></nav>';
  }
  function columns(D, L) {
    var C = obj(D.columns), items = C ? list(C.items, 4).map(function (c) {
      c = obj(c); if (!c || c.pending) return null;
      var url = safeUrl(c.url), hl = text(c.headline, 200); return url && hl ? { url: url, hl: hl, who: text(c.columnist, 60), ex: text(c.excerpt, 400), image: obj(c.image) } : null;
    }).filter(Boolean) : [];
    if (items.length < 1) return null;
    return { note: items.map(function (c) { return c.who; }).filter(Boolean).join(' · '), html: '<section class="mz-sec" id="mz-columns" data-mz="columns" aria-labelledby="mz-columns-title">' + sectionHead('mz-columns', text(C.label, 60), text(C.note, 200)) +
      '<div class="mz-cols">' + items.map(function (c) {
        return '<a class="mz-col" href="' + esc(c.url) + '">' + (c.image ? frame(c.image, { main: 800, sizes: '(max-width: 599px) 100vw, (max-width: 1099px) 50vw, 25vw' }) : '') +
          (c.who ? '<span class="mz-who">' + esc(c.who) + '</span>' : '') + '<h3>' + esc(c.hl) + '</h3>' + (c.ex ? '<p>' + esc(c.ex) + '</p>' : '') + (c.image && text(c.image.credit, 160) ? '<span class="mz-cr">' + esc(text(c.image.credit, 160)) + '</span>' : '') +
          (text(L.readColumn, 40) ? '<span class="mz-more">' + esc(text(L.readColumn, 40)) + '</span>' : '') + '</a>';
      }).join('') + '</div></section>' };
  }
  function feature(D, L) {
    var F = obj(D.feature); if (!F || F.pending) return null;
    var url = safeUrl(F.url), hl = text(F.headline, 200); if (!url || !hl) return null;
    var fig = frame(F.image, { main: 1200, sizes: '(max-width: 599px) 100vw, 50vw' });
    return { note: hl, html: '<section class="mz-sec" id="mz-feature" data-mz="feature" aria-labelledby="mz-feature-title">' + sectionHead('mz-feature', text(F.label, 60), text(F.note, 200)) +
      '<div class="mz-feat">' + (fig ? '<div class="mz-feat-fig"><a href="' + esc(url) + '" tabindex="-1" aria-hidden="true">' + fig + '</a>' + credit(F.image) + '</div>' : '') +
      '<div class="mz-feat-type">' + (text(F.kicker, 80) ? '<span class="mz-kick">' + esc(text(F.kicker, 80)) + '</span>' : '') + '<h3><a href="' + esc(url) + '">' + esc(hl) + '</a></h3>' +
      (text(F.dek, 600) ? '<p class="mz-dek">' + esc(text(F.dek, 600)) + '</p>' : '') + (text(F.byline, 80) ? '<p class="mz-by">' + esc(text(F.byline, 80)) + '</p>' : '') +
      (text(L.read, 40) ? '<a class="mz-btn" href="' + esc(url) + '">' + esc(text(L.read, 40)) + '</a>' : '') + '</div></div></section>' };
  }
  function pregame(D) {
    var P = obj(D.pregame); if (!P || P.pending) return null;
    var teams = list(P.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 40); });
    var when = obj(P.when) || {}, whenParts = [text(when.kickoff, 60), text(when.tv, 40), text(when.venue, 120)].filter(Boolean);
    var series = text(P.series, 400), keys = list(P.keys, 6).map(function (k) { return text(k, 300); }).filter(Boolean);
    var pv = obj(P.preview), pvUrl = pv ? safeUrl(pv.url) : '', pvTitle = pv ? text(pv.title, 200) : '';
    var matchup = text(P.matchup, 120);
    if (!matchup && teams.length < 2 && !whenParts.length && !pvUrl) return null;
    return { note: matchup || whenParts[0] || pvTitle, html: '<section class="mz-sec" id="mz-pregame" data-mz="pregame" aria-labelledby="mz-pregame-title">' + sectionHead('mz-pregame', text(P.label, 60), text(P.note, 200)) +
      '<div class="mz-pre">' + (matchup ? '<span class="mz-kick">' + esc(matchup) + '</span>' : '') +
      (teams.length === 2 ? '<div class="mz-pre-match"><div class="mz-pre-team"><b>' + esc(text(teams[0].name, 40)) + '</b>' + (text(teams[0].line, 80) ? '<small>' + esc(text(teams[0].line, 80)) + '</small>' : '') + '</div>' + (text(P.separator, 6) ? '<span class="mz-pre-at">' + esc(text(P.separator, 6)) + '</span>' : '<span></span>') + '<div class="mz-pre-team"><b>' + esc(text(teams[1].name, 40)) + '</b>' + (text(teams[1].line, 80) ? '<small>' + esc(text(teams[1].line, 80)) + '</small>' : '') + '</div></div>' : '') +
      (whenParts.length ? '<p class="mz-pre-when">' + whenParts.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</p>' : '') +
      (series ? '<p class="mz-pre-series">' + esc(series) + '</p>' : '') +
      (keys.length ? (text(P.keysLabel, 60) ? '<h4>' + esc(text(P.keysLabel, 60)) + '</h4>' : '') + '<ol class="mz-pre-keys">' + keys.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ol>' : '') +
      (pvUrl && pvTitle ? '<a class="mz-pre-link" href="' + esc(pvUrl) + '">' + (text(pv.label, 60) ? '<small>' + esc(text(pv.label, 60)) + '</small>' : '') + '<b>' + esc(pvTitle) + '</b>' + (text(pv.excerpt, 400) ? '<p>' + esc(text(pv.excerpt, 400)) + '</p>' : '') + (text(pv.byline, 80) ? '<span class="mz-by">' + esc(text(pv.byline, 80)) + '</span>' : '') + '</a>' : '') +
      '</div></section>' };
  }
  function schedule(S, L) {
    S = obj(S); var games = S ? list(S.games, 16).map(obj).filter(function (g) { return g && text(g.opponent, 40); }) : [];
    if (!games.length) return null;
    var team = obj(S.team) || {}, h = obj(S.headers) || {};
    var rows = games.map(function (g) {
      var r = obj(g.result), fla = r ? num(r.fla) : null, opp = r ? num(r.opp) : null, done = fla !== null && opp !== null;
      var opponent = (g.home === true ? text(L.vs, 6) : text(L.at, 6)) + (num(g.opponentRank) ? ' ' + text(L.rank, 6) + ' ' + num(g.opponentRank) : '') + ' ' + text(g.opponent, 40);
      var cell = done ? '<span class="' + (fla > opp ? 'mz-w' : fla < opp ? 'mz-l' : '') + '">' + esc(fla > opp ? text(L.win, 2) : fla < opp ? text(L.loss, 2) : '') + ' ' + fla + '-' + opp + '</span>' : esc(text(g.kickoff, 40)) + (text(g.tv, 24) ? '<small>' + esc(text(g.tv, 24)) + '</small>' : '');
      return '<tr' + (g.next === true ? ' class="mz-next"' : '') + '><td class="mz-d">' + esc(text(g.date, 20)) + '</td><td class="mz-o">' + esc(opponent.trim()) + (text(g.site, 40) ? '<small>' + esc(text(g.site, 40)) + '</small>' : '') + '</td><td class="mz-r mz-num">' + cell + '</td></tr>';
    }).join('');
    return { label: text(S.label, 60), html: '<div class="mz-dep mz-dep-sched" data-mz="schedule"><div class="mz-sub"><h3>' + esc(text(S.label, 60)) + '</h3>' + (text(team.line, 80) ? '<small>' + esc(text(team.line, 80)) + '</small>' : '') + '</div>' +
      '<table class="mz-sched"><thead><tr><th class="mz-d">' + esc(text(h.date, 20)) + '</th><th>' + esc(text(h.opponent, 20)) + '</th><th class="mz-r">' + esc(text(h.result, 20)) + '</th></tr></thead><tbody>' + rows + '</tbody></table>' + (text(S.foot, 200) ? '<p class="mz-cr">' + esc(text(S.foot, 200)) + '</p>' : '') + '</div>' };
  }
  function injuries(J) {
    J = obj(J); if (!J) return null;
    var groups = list(J.teams, 2).map(obj).map(function (t) {
      var items = t ? list(t.items, 16).map(obj).filter(function (p) { return p && text(p.name, 60); }) : [];
      return t && items.length ? { team: text(t.name, 40), items: items, source: text(t.source, 80) } : null;
    }).filter(Boolean);
    if (!groups.length) return null;
    return { label: text(J.label, 60), html: '<div class="mz-dep" data-mz="injuries"><div class="mz-sub"><h3>' + esc(text(J.label, 60)) + '</h3></div><div class="mz-inj">' + groups.map(function (t) {
      return '<div><h4>' + esc(t.team) + '</h4><ul>' + t.items.map(function (p) {
        var st = text(p.status, 30);
        return '<li><b>' + (text(p.pos, 8) ? '<i>' + esc(text(p.pos, 8)) + '</i>' : '') + esc(text(p.name, 60)) + '</b>' + (st ? '<span class="mz-st" data-s="' + esc(st.toLowerCase()) + '">' + esc(st) + '</span>' : '') + (text(p.detail, 120) ? '<span>' + esc(text(p.detail, 120)) + '</span>' : '') + source(text(p.source, 60) || t.source) + '</li>';
      }).join('') + '</ul></div>';
    }).join('') + '</div></div>' };
  }
  function numbers(N) {
    N = obj(N); var stats = N ? list(N.items, 8).map(obj).filter(function (s) { return s && text(s.value, 20) && text(s.label, 80); }) : [];
    if (!stats.length) return null;
    return { label: text(N.label, 60), html: '<div class="mz-dep" data-mz="numbers"><div class="mz-sub"><h3>' + esc(text(N.label, 60)) + '</h3>' + (text(N.note, 80) ? '<small>' + esc(text(N.note, 80)) + '</small>' : '') + '</div><div class="mz-stats">' +
      stats.map(function (s) { return '<div class="mz-stat"><b>' + esc(text(s.value, 20)) + '</b><span>' + esc(text(s.label, 80)) + '</span>' + (text(s.source, 60) ? '<small>' + esc(text(s.source, 60)) + '</small>' : '') + '</div>'; }).join('') + '</div></div>' };
  }
  function roster(R) {
    R = obj(R); var items = R ? list(R.items, 12).map(obj).filter(function (n) { return n && text(n.text, 300); }) : [];
    if (!items.length) return null;
    return { label: text(R.label, 60), html: '<div class="mz-dep" data-mz="roster"><div class="mz-sub"><h3>' + esc(text(R.label, 60)) + '</h3></div><ul class="mz-notes">' +
      items.map(function (n) { return '<li>' + esc(text(n.text, 300)) + source(n.source) + '</li>'; }).join('') + '</ul></div>' };
  }
  function departments(D, L) {
    var P = obj(D.departments); if (!P) return null;
    var parts = [schedule(P.schedule, L), injuries(P.injuries), numbers(P.numbers), roster(P.roster)].filter(Boolean);
    if (!parts.length) return null;
    return { note: parts.map(function (p) { return p.label; }).filter(Boolean).join(' · '), html: '<section class="mz-sec" id="mz-departments" data-mz="departments" aria-labelledby="mz-departments-title">' + sectionHead('mz-departments', text(P.label, 60), text(P.note, 200)) + '<div class="mz-dept">' + parts.map(function (p) { return p.html; }).join('') + '</div></section>' };
  }
  function shots(D) {
    var B = obj(D.bestShots); var photos = B ? list(B.photos, 6).map(obj).filter(function (p) { return p && media(p) && safeUrl(p.url); }) : [];
    if (photos.length < 1) return null;
    return { note: text(B.credit, 120) || text(B.note, 120), html: '<section class="mz-sec" id="mz-shots" data-mz="shots" aria-labelledby="mz-shots-title">' + sectionHead('mz-shots', text(B.label, 60), text(B.note, 200)) + '<div class="mz-shots">' +
      photos.map(function (p) { return '<a class="mz-shot" href="' + esc(safeUrl(p.url)) + '">' + frame(p, { main: 800, sizes: '(max-width: 359px) 100vw, (max-width: 599px) 50vw, 33vw' }) + (text(p.caption, 120) ? '<span>' + esc(text(p.caption, 120)) + '</span>' : '') + '</a>'; }).join('') + '</div>' +
      (text(B.credit, 120) ? '<p class="mz-cr mz-shots-cr">' + esc(text(B.credit, 120)) + '</p>' : '') + '</section>' };
  }
  function footer(D) {
    var F = obj(D.footer), links = F ? list(F.links, 4).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 40); }) : [];
    if (!links.length && !(F && text(F.line, 200))) return '';
    return '<nav class="mz-foot" data-mz="footer" aria-label="' + esc(text(F.label, 40)) + '">' + links.map(function (l) { return '<a class="mz-more" href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 40)) + '</a>'; }).join('') + (text(F.line, 200) ? '<small>' + esc(text(F.line, 200)) + '</small>' : '') + '</nav>';
  }

  // Shared writer CTA contract: reuse these fields in writer archives/profile templates.
  function writerPromo(name, episode) {
    var shows = {
      'Buddy Martin': {line:'Catch Buddy Martin on The Buddy Martin Show.', role:'Editor', show:'The Buddy Martin Show'},
      'Loren Meadows': {line:'Catch Loren Meadows on Florida Gator Lowdown.', role:'Football Analyst', show:'Florida Gator Lowdown'}
    };
    var p = shows[name];
    var channel='https://www.youtube.com/@TheBuddyMartinShow';
    var watch=channel+'/videos', label='Browse '+(p ? p.show+' and other shows' : 'GatorBait TV shows');
    if(name==='Buddy Martin'){watch=channel+'/live';label='Watch The Buddy Martin Show';}
    if(episode && p && episode.show===p.show && /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(episode.url) && text(episode.title,160)){
      watch=episode.url;label='Watch '+p.show+': '+text(episode.title,160);
    }
    return '<aside class="mz-writer-promo" aria-label="Watch GatorBait TV">'+
      '<p class="mz-kick">GatorBait TV</p><h3>' + esc(p ? p.line : 'Keep up with GatorBait on YouTube.') + '</h3>'+
      (p ? '<p>'+esc(name)+' · '+esc(p.role)+'</p>' : '')+
      '<div><a href="'+esc(watch)+'">'+esc(label)+' →</a>'+
      '<a href="'+channel+'?sub_confirmation=1">Subscribe on YouTube →</a></div></aside>';
  }

  // Five cleared photographs, in editorial order; incomplete packages stay out of the issue.
  function fiveBeats(D) {
    var b=obj(D.fiveBeats), photos=b&&list(b.photos,6);
    if(!b || b.approved!==true || !photos || photos.length!==5 || !text(b.title,160) ||
      !photos.every(function(p){return obj(p)&&media(p)&&text(p.alt,200)&&text(p.caption,400)&&text(p.credit,160)&&safeUrl(p.sourceUrl);}))return '';
    return '<section class="mz-five" id="mz-five-beats" aria-labelledby="mz-five-title"><span class="mz-kick">Five Beats</span><h2 id="mz-five-title">'+esc(b.title)+'</h2>'+photos.map(function(p,i){return '<figure>'+frame(p,{main:1200,sizes:'(max-width: 820px) 100vw, 900px'})+'<figcaption><b>'+String(i+1).padStart(2,'0')+'</b> '+esc(p.caption)+' <span>'+esc(p.credit)+'</span> <a href="'+esc(safeUrl(p.sourceUrl))+'">Source story →</a></figcaption></figure>';}).join('')+'</section>';
  }

  function render(D) {
    if (D && D.layout === 'pregame') return renderPregame(D);
    var stories=D.stories||[], L=D.labels||{};
    var items=stories.map(function(p){return {id:'story-'+p.id,label:p.author,note:p.title};});
    var front=cover(D,L).replaceAll('href="'+safeUrl(D.cover.url)+'"','href="#story-'+stories[0].id+'"');
    var mast='<aside class="mz-staff" aria-label="Magazine masthead"><p><b>Brenden Martin</b> · Publisher</p><p><b>Buddy Martin</b> · Editor</p><p><b>Franz Beard</b> · Senior Columnist</p><p><b>Loren Meadows</b> · Football Analyst</p><p><b>Chris Spears</b> · Photographer</p></aside>';
    var body=stories.map(function(p,i){return '<article class="mz-full-story" id="story-'+esc(p.id)+'" data-post="'+esc(p.id)+'"><header><span class="mz-kick">'+String(i+1).padStart(2,'0')+' / '+esc(p.author)+'</span><h2>'+esc(p.title)+'</h2><p class="mz-story-meta">'+esc(p.author==='GatorBait Media Staff'?'GatorBait Staff':p.author)+' · '+esc(p.date)+'</p><a class="mz-site" href="https://www.gatorbaitmedia.com/">gatorbaitmedia.com</a></header><div class="mz-reading">'+p.html+'</div>'+writerPromo(p.author,p.showEpisode)+'<nav class="mz-story-nav" aria-label="Article navigation"><a href="#mz-contents">Back to contents ↑</a><a href="'+esc(safeUrl(p.url))+'">Original article and discussion ↗</a>'+(stories[i+1]?'<a href="#story-'+esc(stories[i+1].id)+'">Next: '+esc(stories[i+1].author)+' →</a>':'')+'</nav></article>';}).join('');
    var guide='/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play';
    var utility='<section class="mz-utilities" aria-label="GatorBait reference desk"><h2>The reference desk</h2><p><a href="'+guide+'#roster">Florida Gators roster</a> · <a href="'+guide+'#schedule">Schedule and results</a></p><h3>The Buddy Martin Show on GatorBait TV</h3><a href="https://www.youtube.com/@TheBuddyMartinShow/live">Watch The Buddy Martin Show</a></section>';
    return '<div class="mz-wrap">'+head(D)+mast+front+'<div class="mz-tools"><button type="button" data-print>Print / Save as PDF</button><span>Six complete articles · October 1 edition</span></div>'+contents(items,L)+body+fiveBeats(D)+utility+'<div class="mz-tools"><button type="button" data-print>Print / Save as PDF</button><a href="#mz-contents">Back to contents ↑</a></div>'+footer(D)+'</div>';
  }

  // Edition-local reading passport. Reached is a navigation signal, not comprehension.
  var passportCleanup = function () {};
  function passport(root, D) {
    passportCleanup();
    var stories = D.stories || [], toc = root.querySelector('.mz-toc');
    if (!stories.length || !toc || !window.IntersectionObserver) return;
    var key = 'gbm:magazine:reached:' + D.id, reached = [], canStore = true;
    var ids = stories.map(function (s) { return s.id; });
    try {
      var saved = JSON.parse(localStorage.getItem(key) || '[]');
      reached = Array.isArray(saved) ? saved.filter(function (id,i) { return ids.indexOf(id) >= 0 && saved.indexOf(id)===i; }) : [];
      localStorage.setItem(key, JSON.stringify(reached));
    } catch (_) { canStore = false; return; }
    var box = document.createElement('div'); box.className = 'mz-passport';
    var count = document.createElement('span'), resume = document.createElement('a');
    box.append(count, resume); toc.insertBefore(box, toc.querySelector('ol'));
    function paint() {
      count.textContent = reached.length + ' of ' + stories.length + ' story endings reached';
      var next = stories.find(function (s) { return reached.indexOf(s.id) < 0; });
      resume.textContent = next ? 'Resume: ' + next.title : 'Return to contents';
      resume.href = next ? '#story-' + next.id : '#mz-contents';
      stories.forEach(function (s) {
        var link = toc.querySelector('a[href="#story-' + s.id + '"]');
        if (!link) return;
        var label = link.querySelector('.mz-reached');
        if (reached.indexOf(s.id) >= 0 && !label) {
          label = document.createElement('small'); label.className = 'mz-reached';
          label.textContent = 'Reached'; link.querySelector('span').appendChild(label);
        }
      });
    }
    var pending = new Map(), visible = new Set(), seenStarts = new Set();
    function cancel() { pending.forEach(clearTimeout); pending.clear(); }
    function schedule(nav) {
      var id = nav.closest('article').getAttribute('data-post');
      if (document.hidden || !seenStarts.has(id) || pending.has(id) || reached.indexOf(id) >= 0) return;
      pending.set(id, setTimeout(function () {
        pending.delete(id);
        if (document.hidden || !visible.has(nav) || !root.isConnected) return;
        reached.push(id);
        try { if (canStore) localStorage.setItem(key, JSON.stringify(reached)); } catch (_) { canStore = false; }
        paint();
      }, 2000));
    }
    var starts = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !document.hidden) seenStarts.add(e.target.closest('article').getAttribute('data-post')); });
    });
    var ends = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { visible.add(e.target); schedule(e.target); }
        else { visible.delete(e.target); var id = e.target.closest('article').getAttribute('data-post'); clearTimeout(pending.get(id)); pending.delete(id); }
      });
    }, { threshold: 0.5 });
    root.querySelectorAll('.mz-full-story>header').forEach(function (el) { starts.observe(el); });
    root.querySelectorAll('.mz-story-nav').forEach(function (el) { ends.observe(el); });
    function visibility() { cancel(); if (!document.hidden) visible.forEach(schedule); }
    document.addEventListener('visibilitychange', visibility);
    paint();
    passportCleanup = function () { cancel(); starts.disconnect(); ends.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }

  /* ---------- Lifecycle ---------- */
  var retries = [600, 1800, 4000], timers = [];
  function issue() { var o = obj(window.__GBM_MAG_ISSUE__); return o || ISSUE; } // __GBM_MAG_ISSUE__: QA / preview override, same shape
  function expose(D) {
    var C = obj(D.cover) || {}, I = obj(D.issue) || {}, file = media(C.image);
    window.__GBM_MAG_EDITION__ = { id: text(D.id, 80), date: text(I.date, 60), edition: text(I.name, 120), lead: { title: text(C.headline, 200), url: safeUrl(C.url), image: file ? cut(file, 1000, Math.round(1000 * ((num(C.image && C.image.height) || 900) / (num(C.image && C.image.width) || 1600)))) : '', deck: text(C.dek, 600), label: text(C.kicker, 80) }, cover: { headline: text(C.headline, 200), kicker: text(C.kicker, 80) } };
    try { document.dispatchEvent(new Event('gbm:magazine-edition')); } catch (_) {}
  }
  function mount() {
    if (!onRoute()) return;
    var old = document.getElementById('gbm-magazine-page');
    if (old && old.isConnected) return;
    if (old) old.remove();
    var D = issue(), html;
    try { html = render(D); } catch (error) { doc.classList.remove('gbm-mq'); window.__GBM_MAG26__.error = String(error); return; }
    styles(); fonts();
    var m = document.createElement('main'); m.id = 'gbm-magazine-page'; m.className = 'mz26' + (D.layout === 'pregame' ? ' pg' : '');
    if (D.layout === 'pregame' && obj(D.game)) m.setAttribute('data-kickoff', text(D.game.kickoffISO, 40));
    m.setAttribute('data-issue', text(D.id, 80)); m.setAttribute('data-mz-build', BUILD); m.setAttribute('data-mz-version', VERSION);
    if (text((obj(D.issue) || {}).pageTitle, 120)) m.setAttribute('aria-label', text(D.issue.pageTitle, 120));
    m.innerHTML = html;
    m.addEventListener('click', async function(e){
      var printButton=e.target.closest('[data-print]');
      if(printButton){
        var label=printButton.textContent;printButton.disabled=true;printButton.textContent='Preparing photographs…';
        var images=Array.from(m.querySelectorAll('img'));
        images.forEach(function(img){img.loading='eager';});
        await Promise.race([Promise.all(images.map(function(img){return img.decode ? img.decode().catch(function(){}) : Promise.resolve();})),new Promise(function(resolve){setTimeout(resolve,10000);})]);
        try{window.print();}finally{printButton.disabled=false;printButton.textContent=label;}
      }
      var a=e.target.closest('a[href^="#story-"]');
      if(a){var target=m.querySelector(a.getAttribute('href'));var h=target&&target.querySelector('h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
    });
    // Same seat as the urban embed: right after the mobile shell host (or the shared header) when that is a body child.
    var anchor = document.getElementById('gbm-mobile-shell-host') || document.getElementById('gbm-site-header');
    if (anchor && anchor.parentNode === document.body) document.body.insertBefore(m, anchor.nextSibling); else document.body.insertBefore(m, document.body.firstChild);
    doc.classList.add('gbm-mq', 'gbm-magazine-live');
    if (text((obj(D.issue) || {}).pageTitle, 120)) document.title = text(D.issue.pageTitle, 120);
    expose(D);
    passport(m, D);
    if (D.layout === 'pregame') pgStart(m);
    window.__GBM_MAG26__.ready = true;
  }
  function start() {
    mount();
    // Wix can replace body children during a late hydration; look again a few times (bounded, no observer, no polling loop).
    timers.forEach(clearTimeout); timers = retries.map(function (ms) { return setTimeout(function () { if (onRoute()) mount(); }, ms); });
  }
  function sync() {
    if (onRoute()) { start(); return; }
    timers.forEach(clearTimeout); timers = [];
    passportCleanup(); pgStop();
    var root = document.getElementById('gbm-magazine-page'); if (root) root.remove();
    doc.classList.remove('gbm-magazine-live', 'gbm-mq');
    window.__GBM_MAG26__.ready = false;
  }
  window.__GBM_MAG26__ = { sync: sync, ready: false, build: BUILD, version: VERSION };
  window.addEventListener('popstate', sync);
  window.addEventListener('gbmroutechange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
  /* ================= Magazine feed picker (shared by the runtime and sports-live/refresh-magazine-feed.mjs) =================
   * Pure functions, no DOM, no network. Input posts use the homepage shape (front-page.js normalize / fetchRss):
   *   { title, url, author, firstPublishedDate, excerpt, html?, image: { src, width, height, alt } }
   * mfPick(issue, posts, nowMs, credits) returns { lead, items, leadChanged, cardsChanged } for issue.lead and issue.cards.items.
   * Rules (Brenden, Oct. 3; CLAUDE.md): the lead is the freshest column or feature by a named writer, Buddy Martin wins any
   * 12-hour tie, staff/news items never lead; cards are the remaining newest stories, newest first, each story once, never the
   * lead or a story already linked elsewhere on the page, only with a credited Wix photo, at most the current card count.
   * A story already in the issue keeps its curated object byte for byte. */
  var MF_WRITERS = ['Buddy Martin', 'Franz Beard', 'Loren Meadows', 'Eddie Gilley', 'Carlton Reese'];
  var MF_TIE_MS = 12 * 3600000, MF_DAY = 86400000, MF_LEAD_MAX_AGE = 7 * MF_DAY;
  var MF_MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var MF_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function mfStr(v) { return v == null || typeof v === 'object' ? '' : String(v).replace(/\s+/g, ' ').trim(); }
  function mfEsc(v) { return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mfPath(u) {
    try { var x = new URL(String(u || ''), 'https://www.gatorbaitmedia.com'); return x.protocol === 'https:' && /^(www\.)?gatorbaitmedia\.com$/.test(x.hostname) && x.pathname.indexOf('/post/') === 0 ? x.pathname.replace(/\/+$/, '') : ''; } catch (_) { return ''; }
  }
  function mfWriter(author) {
    var a = mfStr(author).toLowerCase();
    for (var i = 0; i < MF_WRITERS.length; i++) if (a === MF_WRITERS[i].toLowerCase()) return MF_WRITERS[i];
    return '';
  }
  // Wix image: https://static.wixstatic.com/media/<id>~mv2.<ext>/v1/... -> { id, ext }
  function mfImage(src) {
    var m = /^https:\/\/static\.wixstatic\.com\/media\/([0-9a-f]+_[0-9a-f]{32})~mv2\.(jpe?g|png|webp|avif)(?:[\/?#].*)?$/i.exec(mfStr(src));
    return m ? { id: m[1], ext: m[2].toLowerCase() } : null;
  }
  function mfEt(ms) {
    var p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month - 1, d: +p.day };
  }
  function mfShortDate(ms) { var e = mfEt(ms); return MF_MONTHS[e.m] + ' ' + e.d; }
  function mfLongDate(ms) { var e = mfEt(ms); return MF_FULL[e.m] + ' ' + e.d + ', ' + e.y; }
  // Excerpts sometimes open with the photo caption: "Caption (Photo by Chris Spears) Story..." (same rule as front-page.js).
  function mfExcerpt(raw) {
    var s = mfStr((typeof raw === 'string' ? raw : '').replace(/<[^>]*>/g, ' ')), cap = '', credit = '';
    var m = s.match(/^(.{8,220}?)\s*\(((?:UAA )?Photo(?: by)?[^)]{0,60}|[^)]{0,40} photo)\)\s*(.*)$/i);
    if (m) { cap = m[1]; credit = /spears/i.test(m[2]) ? 'Photo by Chris Spears, GatorBait Media' : m[2].replace(/^photo:?\s*/i, 'Photo: '); s = m[3]; }
    return { text: s, cap: cap, credit: credit };
  }
  // Teaser: drop everything up to a writer's "By <Name> " in the first 400 characters (photo caption, kicker, dateline),
  // then keep two or three whole sentences. Never a mid-word cut; curly quotes are left as they are.
  var MF_BYLINE = new RegExp('(^|[\\s.!?’”"])By (' + MF_WRITERS.join('|') + ')[.,:]?\\s+', 'i');
  function mfTeaser(raw, max) {
    var s = mfStr(raw), m = MF_BYLINE.exec(s.slice(0, 400 + 40));
    if (m && m.index <= 400) s = s.slice(m.index + m[0].length);
    max = max || 320;
    // A trailing "…" or "..." is Wix truncating the excerpt, not the end of a sentence.
    var re = /[.!?]+[’”"')\]]*(?=\s+[“"‘'(A-Z0-9]|$)/g, ends = [], x;
    while ((x = re.exec(s))) if (!/^\.\./.test(x[0])) ends.push(x.index + x[0].length);
    var out = '';
    for (var i = 0; i < ends.length && i < 3; i++) { var c = s.slice(0, ends[i]).trim(); if (i >= 2 && c.length > max) break; if (i >= 1 && c.length > max * 1.4) break; out = c; }
    if (out) return out;
    if (s.length <= max) return s;
    return s.slice(0, s.lastIndexOf(' ', max)).replace(/[,;:\-–—]+$/, '') + '…';
  }
  // Photo credit stated in the feed itself: "(Photo by X, Y)" or "(Photo: X)" in the image alt text or the caption.
  function mfCreditIn(v) {
    var m = /\((?:UAA )?Photo(?: by|:)\s*([^)]{2,80})\)/i.exec(mfStr(v));
    if (!m) return '';
    return /chris spears/i.test(m[1]) ? 'Photo by Chris Spears, GatorBait Media' : /^photo:/i.test(m[0].slice(1)) ? 'Photo: ' + m[1].trim() : 'Photo by ' + m[1].trim();
  }
  function mfNormalize(posts, nowMs, credits) {
    credits = credits || {};
    var seen = {}, out = [];
    (Array.isArray(posts) ? posts : []).forEach(function (p) {
      if (!p || typeof p !== 'object') return;
      var path = mfPath(p.url), title = mfStr(p.title), t = Date.parse(p.firstPublishedDate || p.date || '');
      if (!path || !title || !isFinite(t) || t > nowMs + MF_DAY || seen[path]) return;
      if (/^LIVE NOW:/i.test(title) && nowMs - t > 21600000) return;
      seen[path] = 1;
      var ex = mfExcerpt(p.excerpt), img = p.image && typeof p.image === 'object' ? p.image : {}, file = mfImage(img.src);
      var w = +img.width > 0 ? Math.round(+img.width) : 0, h = +img.height > 0 ? Math.round(+img.height) : 0;
      // The snapshot's 1600x900 is a placeholder; a non-square Wix fit box in the feed URL carries the photo's real shape.
      var box = /\/fit\/w_(\d+),h_(\d+)/.exec(mfStr(img.src));
      if (box && +box[1] !== +box[2] && (!w || (w === 1600 && h === 900))) { w = 1600; h = Math.round(1600 * box[2] / box[1]); }
      // Verified credit only: the curated/homepage credit map, then a credit the feed states for this photo. Otherwise ''.
      var credit = (file && credits[file.id]) || ex.credit || mfCreditIn(img.alt) || mfCreditIn(img.caption) || '';
      out.push({ title: title, path: path, author: mfStr(p.author) || 'GatorBait Staff', writer: mfWriter(p.author), t: t, excerpt: mfTeaser(ex.text), cap: ex.cap, credit: credit,
        html: typeof p.html === 'string' ? p.html : '', file: file, width: w, height: h, alt: mfStr(img.alt) || title });
    });
    return out.sort(function (a, b) { return b.t - a.t || (a.path < b.path ? -1 : 1); });
  }
  // News items under a writer's name (BREAKING / LIVE NOW / UPDATE) never lead; galleries never lead.
  // A lead needs a photo with a verified credit (Brenden/Jarvis, Oct. 3); the Buddy tie rule applies among those.
  function mfLeadable(p) { return !!p.writer && !!p.file && !!p.credit && !/^(BREAKING|LIVE NOW|UPDATE|WATCH)\b/i.test(p.title) && !/best shots|photo gallery/i.test(p.title); }
  function mfPickLead(posts, nowMs) {
    var c = posts.filter(function (p) { return mfLeadable(p) && nowMs - p.t <= MF_LEAD_MAX_AGE; });
    if (!c.length) return null;
    var top = c[0];
    if (top.writer !== 'Buddy Martin') { var b = c.find(function (p) { return p.writer === 'Buddy Martin'; }); if (b && top.t - b.t <= MF_TIE_MS) top = b; }
    return top;
  }
  // Every /post/ URL the issue links outside the lead and the cards (cover, best shots, keys, reference...), so a card never repeats one.
  function mfLinked(issue) {
    var out = {};
    (function walk(v, key) {
      if (Array.isArray(v)) { v.forEach(function (x) { walk(x, key); }); return; }
      if (v && typeof v === 'object') { Object.keys(v).forEach(function (k) { if (key === '' && (k === 'lead' || k === 'cards')) return; walk(v[k], k); }); return; }
      if (key === 'url' && typeof v === 'string') { var p = mfPath(v); if (p) out[p] = 1; }
    })(issue, '');
    return out;
  }
  // Credits we already know: every credited image in the issue, then the shared homepage credit map, then the excerpt caption.
  function mfCredits(issue, extra) {
    var out = {};
    (function walk(v) {
      if (Array.isArray(v)) { v.forEach(walk); return; }
      if (v && typeof v === 'object') { if (typeof v.id === 'string' && mfStr(v.credit) && !out[v.id]) out[v.id] = mfStr(v.credit); Object.keys(v).forEach(function (k) { walk(v[k]); }); }
    })(issue);
    Object.keys(extra || {}).forEach(function (k) { if (!out[k] && mfStr(extra[k])) out[k] = mfStr(extra[k]); });
    return out;
  }
  function mfImg(p, credit) {
    var alt = /^featured image for /i.test(p.alt) ? p.title : p.alt;
    return { id: p.file.id, ext: p.file.ext, width: p.width || 1600, height: p.height || 900, alt: alt + (credit && alt.indexOf('(') < 0 ? ' (' + credit + ')' : ''), credit: credit };
  }
  function mfKicker(p) {
    if (p.writer === 'Franz Beard' && /^thoughts of the day/i.test(p.title)) return 'Franz Beard · Thoughts of the Day';
    if (p.writer === 'Franz Beard' && /^the soothsayer/i.test(p.title)) return 'Franz Beard · The Soothsayer';
    if (p.writer) return p.writer + ' · Column';
    return 'News · ' + (/staff$/i.test(p.author.replace(/\s+/g, '')) ? 'GatorBait Staff' : p.author);
  }
  // Lead body: the post's own first paragraphs when the feed carries the text, else its excerpt. Never another story's copy.
  function mfLeadHtml(p) {
    var paras = [];
    if (p.html) {
      var re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi, m;
      while ((m = re.exec(p.html)) && paras.length < 4) {
        var inner = m[1].replace(/<a\b[^>]*href="([^"]*)"[^>]*>/gi, function (_, h) { var q = mfPath(h); return q ? '<a href="' + q + '">' : '<a>'; })
          .replace(/<(?!\/?(?:a|strong|em)\b)[^>]*>/gi, '').replace(/<a>([\s\S]*?)<\/a>/gi, '$1').trim();
        var plain = mfStr(inner.replace(/<[^>]*>/g, ''));
        // Nothing before the byline: a paragraph holding "By <Writer>" restarts the body after it; caption lines are skipped.
        var by = MF_BYLINE.exec(plain);
        if (by) { paras = []; if (by.index + by[0].length >= plain.length - 20) continue; inner = mfEsc(plain.slice(by.index + by[0].length)); plain = inner; }
        if (/\((?:UAA )?Photo(?: by|:)/i.test(plain) && plain.length < 260) continue;
        if (plain.length > 20) paras.push('<p>' + inner + '</p>');
      }
    }
    return paras.length ? paras.join('') : (p.excerpt ? '<p>' + mfEsc(p.excerpt) + '</p>' : '');
  }
  function mfPick(issue, posts, nowMs, extraCredits) {
    var D = issue && typeof issue === 'object' ? issue : {}, oldLead = D.lead && typeof D.lead === 'object' ? D.lead : null;
    var oldCards = D.cards && Array.isArray(D.cards.items) ? D.cards.items : [];
    var credits = mfCredits(D, extraCredits), all = mfNormalize(posts, nowMs, credits);
    var res = { lead: oldLead, items: oldCards, leadChanged: false, cardsChanged: false, posts: all.length };
    if (!all.length) return res;
    var pick = mfPickLead(all, nowMs), leadPath = oldLead ? mfPath(oldLead.url) : '';
    if (pick && pick.path !== leadPath) {
      var body = mfLeadHtml(pick);
      if (body) {
        var cr = pick.credit;
        res.lead = { label: 'The Lead', kicker: pick.writer, author: pick.writer, title: pick.title, url: pick.path, html: body,
          'continue': 'Read the full column', date: mfLongDate(pick.t), image: mfImg(pick, cr), caption: pick.cap };
        res.leadChanged = true; leadPath = pick.path;
      }
    }
    var max = oldCards.length || 3, linked = mfLinked(D), byPath = {};
    oldCards.forEach(function (c) { var q = c && mfPath(c.url); if (q) byPath[q] = c; });
    var items = [];
    for (var i = 0; i < all.length && items.length < max; i++) {
      var p = all[i];
      if (p.path === leadPath || linked[p.path]) continue;
      if (byPath[p.path]) { items.push(byPath[p.path]); continue; }
      if (!p.file) continue;
      var credit = p.credit;
      if (!credit) continue;
      items.push({ kicker: mfKicker(p), title: p.title, url: p.path, excerpt: mfTeaser(p.excerpt, 220), image: mfImg(p, credit), date: mfShortDate(p.t) });
    }
    if (items.length && (items.length !== oldCards.length || items.some(function (c, k) { return c !== oldCards[k]; }))) { res.items = items; res.cardsChanged = true; }
    return res;
  }
  // Live score line for the Magazine ticker, from sports-live/scoreboard.json (same contract front-page.js reads).
  // Returns '' outside the game: the countdown then keeps the slot.
  function mfScoreLine(raw, opponent, kickoffISO, nowMs) {
    if (!raw || typeof raw !== 'object') return '';
    var k = Date.parse(kickoffISO || ''), opp = mfStr(opponent);
    if (!isFinite(k) || !opp || nowMs < k - 1800000 || nowMs > k + 12 * 3600000) return '';
    function n(v) { return typeof v === 'number' && isFinite(v) ? v : null; }
    function ab(name) { return ({ Florida: 'FLA', Missouri: 'MIZ', 'Ole Miss': 'MISS', Georgia: 'UGA', Tennessee: 'TENN', LSU: 'LSU', Kentucky: 'UK', 'South Carolina': 'SC', Texas: 'TEX' })[name] || name.slice(0, 4).toUpperCase(); }
    var O = ab(opp), lv = raw.live, nx = raw.next, ls = raw.last;
    if (lv && typeof lv === 'object' && lv.score && n(lv.score.fla) !== null && n(lv.score.opp) !== null && (!nx || mfStr(nx.opponent) === opp)) {
      var clk = mfStr(lv.clock).slice(0, 16), per = n(lv.period);
      var when = /half/i.test(clk) ? 'Half' : ((per ? (per > 4 ? 'OT' : 'Q' + per) : '') + (per && clk ? ' ' : '') + clk);
      return 'FLA ' + lv.score.fla + ' ' + O + ' ' + lv.score.opp + (when ? ' · ' + when : '');
    }
    if (ls && typeof ls === 'object' && mfStr(ls.opponent) === opp && /final/i.test(mfStr(ls.status)) && ls.score && n(ls.score.fla) !== null && n(ls.score.opp) !== null && Math.abs(Date.parse(ls.date || '') - k) < MF_DAY) {
      return 'Final: FLA ' + ls.score.fla + ' ' + O + ' ' + ls.score.opp;
    }
    return '';
  }

  /* ================= Friday Pregame layout (issue.layout === 'pregame') =================
   * Same contract as the weekly layout: the issue JSON holds every word and number; this file only lays them out.
   * Helpers (esc, text, num, list, obj, safeUrl, media, picture, frame, credit) come from the runtime above. */
  var pgTimer = null;
  function pgCount(iso) {
    var t = Date.parse(iso || ''); if (!t) return '';
    var ms = t - Date.now(); if (ms <= 0) return 'Kickoff';
    var m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
    return (d ? d + 'd ' : '') + h + 'h ' + ('0' + mm).slice(-2) + 'm to kickoff';
  }
  function pgTick(root) {
    var iso = root.getAttribute('data-kickoff');
    var sc = root.getAttribute('data-pg-score') || '';
    root.querySelectorAll('[data-pg-count]').forEach(function (el) { el.textContent = sc || pgCount(iso); });
  }
  function pgPrintInit(root) {
    if (root.__pgPrint) return; root.__pgPrint = 1;
    root.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-pg-print]') : null; if (!b) return; e.preventDefault();
      var im = root.querySelectorAll('img'); for (var i = 0; i < im.length; i++) { im[i].loading = 'eager'; }
      var dt = root.querySelectorAll('details'); for (var j = 0; j < dt.length; j++) { dt[j].open = true; }
      setTimeout(function () { window.print(); }, 350);
    });
  }
  function pgStart(root) {
    pgPrintInit(root); pgStop(); pgTick(root); pgTimer = setInterval(function () { if (!root.isConnected) { pgStop(); return; } pgTick(root); }, 30000);
    mfLiveStart(root);
  }
  function pgStop() { if (pgTimer) { clearInterval(pgTimer); pgTimer = null; } mfLiveStop(); }
  function fx(n, d) { return typeof n === 'number' && isFinite(n) ? n.toFixed(d == null ? 1 : d) : ''; }
  function pgHeadSec(id, label, note) { return label ? '<div class="pg-sh"><h2 id="' + id + '-t">' + esc(label) + '</h2>' + (note ? '<p>' + esc(note) + '</p>' : '') + '</div>' : ''; }
  function pgSrc(s) { s = text(s, 160); return s ? '<p class="pg-src">' + esc(s) + '</p>' : ''; }

  function pgTop(D) {
    var G = obj(D.game) || {}, I = obj(D.issue) || {};
    return '<div class="pg-ticker"><span class="pg-live"><i aria-hidden="true"></i>' + esc(text(I.number, 60)) + '</span><span>' + esc(text(I.name, 60)) + '</span><span class="pg-ticker-c" data-pg-count>' + esc(pgCount(G.kickoffISO)) + '</span></div>';
  }
  function pgMast(D) {
    var I = obj(D.issue) || {};
    return '<header class="pg-mast"><div class="pg-mast-top"><a class="pg-home" href="/">' + esc(text(I.tagline, 120) || 'GatorBait Media') + '</a><span>' + esc(text(I.date, 60)) + '</span></div>' +
      '<div class="pg-plate"><img class="pg-logo" src="https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp/v1/fill/w_900,h_241,al_c,q_90,enc_auto/gatorbait.webp" width="900" height="241" alt="GatorBait" decoding="async"><span class="pg-plate-mz">Magazine</span></div>' +
      '<p class="pg-issue"><b>' + esc(text(I.number, 60)) + '</b><span>' + esc(text(I.week, 120)) + '</span></p><button type="button" class="pg-print" data-pg-print>Print the whole magazine</button></header>';
  }
  function pgCoverHref(D) {
    var C = obj(D.cover) || {}, L = obj(D.lead) || {}, cu = safeUrl(C.url), lu = safeUrl(L.url);
    return !cu || !lu || cu === lu ? '#pg-lead' : cu;
  }
  function pgCover(D) {
    var C = obj(D.cover); if (!C) return '';
    var hl = text(C.headline, 200); if (!hl) return '';
    var fig = frame(C.image, { eager: true, main: 1600, sizes: '(max-width: 900px) 100vw, 62vw' }), go = esc(pgCoverHref(D));
    return '<section class="pg-cover" id="pg-cover" aria-labelledby="pg-cover-h">' + (fig ? '<a class="pg-cover-fig" href="' + go + '" tabindex="-1" aria-hidden="true">' + fig + '</a>' : '') +
      '<div class="pg-cover-type">' + (text(C.kicker, 80) ? '<span class="pg-kick">' + esc(text(C.kicker, 80)) + '</span>' : '') + '<h1 id="pg-cover-h"><a href="' + go + '">' + esc(hl) + '</a></h1>' +
      (text(C.dek, 600) ? '<p class="pg-dek">' + esc(text(C.dek, 600)) + '</p>' : '') + (text(C.byline, 80) ? '<p class="pg-by">' + esc(text(C.byline, 80)) + '</p>' : '') +
      '<a class="pg-btn" href="' + go + '">Read the column</a></div>' + (fig && C.image && text(C.image.credit, 160) ? '<p class="pg-cr">' + esc(text(C.image.credit, 160)) + '</p>' : '') + '</section>';
  }
  function pgGame(D) {
    var G = obj(D.game); if (!G) return '';
    var teams = list(G.teams, 2).map(obj).filter(Boolean); if (teams.length < 2) return '';
    var chips = list(G.chips, 4).map(obj).filter(function (c) { return c && text(c.k, 20) && text(c.v, 40); });
    var P = obj(G.predictor), f = P ? num(P.florida) : null, m = P ? num(P.missouri) : null;
    function team(t, cls) { return '<div class="pg-team ' + cls + '">' + (text(t.rank, 12) ? '<small>' + esc(text(t.rank, 12)) + '</small>' : '') + '<b>' + esc(text(t.name, 30)) + '</b><span class="pg-rec">' + esc(text(t.record, 12)) + '</span><em>' + esc(text(t.conf, 20)) + '</em></div>'; }
    return '<section class="pg-game" id="pg-game" aria-labelledby="pg-game-t"><div class="pg-game-top"><h2 id="pg-game-t">' + esc(text(G.label, 40)) + '</h2><b class="pg-count" data-pg-count>' + esc(pgCount(G.kickoffISO)) + '</b></div>' +
      '<div class="pg-teams">' + team(teams[0], 'pg-fla') + '<div class="pg-at" aria-hidden="true">at</div>' + team(teams[1], 'pg-miz') + '</div>' +
      '<p class="pg-when"><b>' + esc(text(G.kickoff, 60)) + '</b><span>' + esc(text(G.tv, 20)) + '</span><span>' + esc(text(G.venue, 120)) + '</span>' + (text(G.forecast, 120) ? '<span>' + esc(text(G.forecast, 120)) + '</span>' : '') + '</p>' +
      (chips.length ? '<ul class="pg-chips">' + chips.map(function (c) { return '<li><small>' + esc(text(c.k, 20)) + '</small><b>' + esc(text(c.v, 40)) + '</b></li>'; }).join('') + '</ul>' : '') +
      (f !== null && m !== null ? '<div class="pg-prob" role="img" aria-label="' + esc(text(P.label, 40) + ': Florida ' + fx(f) + ' percent, Missouri ' + fx(m) + ' percent') + '"><p>' + esc(text(P.label, 40)) + '</p><div class="pg-bar"><i style="width:' + fx(f) + '%"></i></div><div class="pg-prob-n"><b>Florida ' + fx(f) + '%</b><b>Missouri ' + fx(m) + '%</b></div></div>' : '') +
      pgSrc(G.source) + '</section>';
  }
  function pgSeries(D) {
    var S = obj(D.series), games = S ? list(S.games, 16).map(obj).filter(function (g) { return g && num(g.year) && num(g.fla) !== null && num(g.mizz) !== null; }) : [];
    if (!games.length) return '';
    var w = 0, l = 0;
    var tiles = games.map(function (g) { var win = g.fla > g.mizz; if (win) w++; else l++; return '<li class="' + (win ? 'pg-w' : 'pg-l') + '"><b>' + esc("’" + String(g.year).slice(2)) + '</b><span>' + g.fla + '-' + g.mizz + '</span><small>' + (g.site === 'H' ? 'Home' : 'Road') + '</small><i class="sr-only">' + (win ? 'Florida win' : 'Missouri win') + '</i></li>'; }).join('');
    return '<section class="pg-series" id="pg-series" aria-labelledby="pg-series-t">' + pgHeadSec('pg-series', text(S.label, 40), text(S.headline, 80)) + '<p class="pg-lede">' + esc(text(S.line, 300)) + '</p>' +
      '<ol class="pg-yrs">' + tiles + '</ol><p class="pg-tally"><b class="pg-w">Florida ' + w + '</b><b class="pg-l">Missouri ' + l + '</b></p>' + pgSrc(S.source) + '</section>';
  }
  function pgTape(D) {
    var T = obj(D.tape), rows = T ? list(T.rows, 12).map(obj).filter(function (r) { return r && num(r.fla) !== null && num(r.miz) !== null && text(r.label, 40); }) : [];
    if (!rows.length) return '';
    var body = rows.map(function (r) {
      var mx = Math.max(r.fla, r.miz) || 1, fw = Math.round(r.fla / mx * 1000) / 10, mw = Math.round(r.miz / mx * 1000) / 10;
      var fWin = r.lower ? r.fla < r.miz : r.fla > r.miz, mWin = r.lower ? r.miz < r.fla : r.miz > r.fla;
      return '<li class="pg-row"><b class="pg-row-l">' + esc(text(r.label, 40)) + '</b><div class="pg-rbars"><span class="pg-v' + (fWin ? ' pg-win' : '') + '">' + fx(r.fla) + '</span><div class="pg-half pg-hf"><i class="' + (fWin ? 'pg-win' : '') + '" style="width:' + fw + '%"></i></div><div class="pg-half pg-hm"><i class="' + (mWin ? 'pg-win' : '') + '" style="width:' + mw + '%"></i></div><span class="pg-v' + (mWin ? ' pg-win' : '') + '">' + fx(r.miz) + '</span></div></li>';
    }).join('');
    return '<section class="pg-tape" id="pg-tape" aria-labelledby="pg-tape-t">' + pgHeadSec('pg-tape', text(T.label, 40), text(T.note, 100)) + '<p class="pg-legend"><b class="pg-lf">Florida</b><b class="pg-lm">Missouri</b><small>Brighter bar = edge. Lower is better for points, yards allowed and penalties.</small></p><ul class="pg-rows">' + body + '</ul>' + pgSrc(T.source) + '</section>';
  }
  function pgKeys(D) {
    var K = obj(D.keys), items = K ? list(K.items, 6).map(obj).filter(function (k) { return k && text(k.h, 120) && text(k.p, 600); }) : [];
    if (!items.length) return '';
    return '<section class="pg-keys" id="pg-keys" aria-labelledby="pg-keys-t">' + pgHeadSec('pg-keys', text(K.label, 40)) + '<ol>' + items.map(function (k, i) {
      var u = safeUrl(k.url);
      return '<li><span class="pg-n" aria-hidden="true">' + (i + 1) + '</span><h3>' + esc(text(k.h, 120)) + '</h3><p>' + esc(text(k.p, 600)) + '</p>' + (u ? '<a class="pg-more" href="' + esc(u) + '">Read more</a>' : '') + '</li>';
    }).join('') + '</ol>' + pgSrc(K.source) + '</section>';
  }
  function pgInjuries(D) {
    var J = obj(D.injuries), teams = J ? list(J.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && list(t.items, 20).length; }) : [];
    if (!teams.length) return '';
    return '<section class="pg-inj" id="pg-injuries" aria-labelledby="pg-inj-t">' + pgHeadSec('pg-inj', text(J.label, 40), text(J.asOf, 200)) + '<div class="pg-inj-grid">' + teams.map(function (t) {
      return '<div><h3>' + esc(text(t.name, 30)) + '</h3><ul>' + list(t.items, 20).map(obj).filter(function (p) { return p && text(p.name, 60); }).map(function (p) {
        var st = text(p.status, 24);
        return '<li><i>' + esc(text(p.pos, 8)) + '</i><b>' + esc(text(p.name, 60)) + '</b>' + (st ? '<span class="pg-st" data-s="' + esc(st.toLowerCase()) + '">' + esc(st) + '</span>' : '') + (text(p.detail, 120) ? '<small>' + esc(text(p.detail, 120)) + '</small>' : '') + '</li>';
      }).join('') + '</ul></div>';
    }).join('') + '</div>' + pgSrc(J.source) + '</section>';
  }
  function pgWatch(D) {
    var W = obj(D.watch), items = W ? list(W.items, 8).map(obj).filter(function (i) { return i && text(i.k, 20) && text(i.v, 120); }) : [];
    if (!items.length) return '';
    var links = list(W.links, 4).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 60); });
    return '<section class="pg-watch" id="pg-watch" aria-labelledby="pg-watch-t">' + pgHeadSec('pg-watch', text(W.label, 40)) + '<dl>' + items.map(function (i) {
      return '<div><dt>' + esc(text(i.k, 20)) + '</dt><dd>' + esc(text(i.v, 120)) + '</dd></div>';
    }).join('') + '</dl>' + (links.length ? '<p class="pg-wl">' + links.map(function (l) { return '<a class="pg-more" href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 60)) + '</a>'; }).join('') + '</p>' : '') + pgSrc(W.source) + '</section>';
  }
  function pgRosters(D) {
    var R = obj(D.rosters), teams = R ? list(R.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && list(t.players, 160).length; }) : [];
    if (!teams.length) return '';
    var SIDES = [['offense', 'Offense'], ['defense', 'Defense'], ['specialTeam', 'Special teams']];
    return '<section class="pg-ros" id="pg-rosters" aria-labelledby="pg-ros-t">' + pgHeadSec('pg-ros', text(R.label, 40), text(R.note, 160)) + '<div class="pg-ros-grid">' + teams.map(function (t) {
      var ps = list(t.players, 160).map(obj).filter(function (p) { return p && text(p.name, 60); });
      var hurt = ps.filter(function (p) { return text(p.st, 20); }).length;
      return '<details class="pg-team"><summary><b>' + esc(text(t.name, 30)) + '</b><span>' + ps.length + ' players' + (hurt ? ' · ' + hurt + ' on the report' : '') + '</span></summary>' + SIDES.map(function (sd) {
        var grp = ps.filter(function (p) { return text(p.side, 20) === sd[0]; });
        if (!grp.length) return '';
        return '<h3>' + sd[1] + '</h3><ul>' + grp.map(function (p) {
          var st = text(p.st, 20);
          return '<li' + (st ? ' class="pg-hurt"' : '') + '><span class="pg-no">' + esc(text(p.n, 3)) + '</span><b>' + esc(text(p.name, 60)) + '</b><i>' + esc(text(p.pos, 6)) + '</i><small>' + esc(text(p.cls, 4)) + '</small>' + (st ? '<span class="pg-st" data-s="' + esc(st.toLowerCase()) + '">' + esc(st) + '</span>' : '') + '</li>';
        }).join('') + '</ul>';
      }).join('') + '</details>';
    }).join('') + '</div>' + pgSrc(R.source) + '</section>';
  }
  function pgLead(D) {
    var L = obj(D.lead); if (!L || !text(L.html, 20000)) return '';
    var url = safeUrl(L.url), fig = frame(L.image, { main: 1200, sizes: '(max-width: 900px) 100vw, 780px' });
    // html is trusted issue copy built from the canonical post (links already site-relative); keep only the tags the post uses.
    var clean = String(L.html).replace(/<(?!\/?(?:p|a|strong|em|blockquote|h3)\b)[^>]*>/gi, '').replace(/<a\b(?![^>]*href="\/)[^>]*>/gi, '<a>');
    return '<article class="pg-lead" id="pg-lead" aria-labelledby="pg-lead-h"><header><span class="pg-kick">' + esc(text(L.label, 40)) + ' · ' + esc(text(L.kicker, 80)) + '</span><h2 id="pg-lead-h">' + esc(text(L.title, 200)) + '</h2><p class="pg-by">By ' + esc(text(L.author, 60) || 'Franz Beard') + ' · ' + esc(text(L.date, 40)) + '</p></header>' +
      (fig ? '<figure class="pg-fig">' + fig + '<figcaption>' + esc(text(L.caption, 200)) + (L.image && text(L.image.credit, 160) ? ' <span>' + esc(text(L.image.credit, 160)) + '</span>' : '') + '</figcaption></figure>' : '') +
      '<div class="pg-prose">' + clean + '</div>' + (url ? '<a class="pg-btn" href="' + esc(url) + '">' + esc(text(L.continue, 160)) + '</a>' : '') + '</article>';
  }
  function pgSlate(D) {
    var S = obj(D.slate), games = S ? list(S.games, 12).map(obj).filter(function (g) { return g && obj(g.away) && obj(g.home) && text(g.pick, 40); }) : [];
    if (!games.length) return '';
    function side(t, pick) { var r = num(t.rank); return '<li class="' + (text(t.name, 40) === pick ? 'pg-picked' : '') + '"><span class="pg-rk">' + (r ? r : '') + '</span><b>' + esc(text(t.name, 40)) + '</b><span class="pg-rc">' + esc(text(t.rec, 12)) + '</span></li>'; }
    return '<section class="pg-slate" id="pg-slate" aria-labelledby="pg-slate-t">' + pgHeadSec('pg-slate', text(S.label, 40), text(S.note, 160)) + '<div class="pg-games">' + games.map(function (g) {
      return '<article class="pg-g' + (g.hero ? ' pg-hero' : '') + '"><p class="pg-gt"><b>' + esc(text(g.time, 20)) + '</b><span>' + esc(text(g.tv, 20)) + '</span></p><ul>' + side(g.away, text(g.pick, 40)) + side(g.home, text(g.pick, 40)) + '</ul>' +
        '<p class="pg-gl"><span>' + esc(text(g.line, 20)) + '</span><span>O/U ' + fx(num(g.ou)) + '</span></p><p class="pg-pick"><small>Soothsayer picks</small><b>' + esc(text(g.pick, 40)) + '</b>' + (text(g.note, 40) ? '<em>' + esc(text(g.note, 40)) + '</em>' : '') + '</p></article>';
    }).join('') + '</div>' + pgSrc(S.source) + '</section>';
  }
  function pgCard(c) {
    return '<a class="pg-card" href="' + esc(safeUrl(c.url)) + '">' + frame(c.image, { main: 800, sizes: '(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw' }) + '<span class="pg-kick">' + esc(text(c.kicker, 80)) + (text(c.date, 20) ? ' · ' + esc(text(c.date, 20)) : '') + '</span><h3>' + esc(text(c.title, 200)) + '</h3><p>' + esc(text(c.excerpt, 300)) + '</p>' + (c.image && text(c.image.credit, 160) ? '<small class="pg-cr">' + esc(text(c.image.credit, 160)) + '</small>' : '') + '<span class="pg-more">Read</span></a>';
  }
  function pgCards(D) {
    var C = obj(D.cards), items = C ? list(C.items, 9).map(obj).filter(function (c) { return c && safeUrl(c.url) && text(c.title, 200); }) : [];
    if (!items.length) return '';
    return '<section class="pg-cards" id="pg-more" aria-labelledby="pg-more-t">' + pgHeadSec('pg-more', text(C.label, 40)) + '<div class="pg-cgrid">' + items.map(pgCard).join('') + '</div></section>';
  }
  function pgShots(D) {
    var B = obj(D.shots), photos = B ? list(B.photos, 8).map(obj).filter(function (p) { return p && media(p); }) : [], url = B ? safeUrl(B.url) : '';
    if (!photos.length) return '';
    return '<section class="pg-shots" id="pg-shots" aria-labelledby="pg-shots-t">' + pgHeadSec('pg-shots', text(B.label, 40), text(B.note, 120)) + '<div class="pg-mosaic">' + photos.map(function (p, i) {
      var inner = frame(p, { main: 800, sizes: '(max-width: 599px) 50vw, 33vw' }) + (text(p.caption, 80) ? '<span>' + esc(text(p.caption, 80)) + '</span>' : '');
      return (url ? '<a class="pg-shot pg-s' + i + '" href="' + esc(url) + '">' : '<div class="pg-shot pg-s' + i + '">') + inner + (url ? '</a>' : '</div>');
    }).join('') + '</div><p class="pg-cr pg-cr-c">' + esc(text(B.credit, 120)) + '</p></section>';
  }
  function pgFoot(D) {
    var R = obj(D.reference), links = R ? list(R.links, 5).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 40); }) : [];
    return '<footer class="pg-foot"><h2>' + esc(text(R && R.label, 40)) + '</h2><nav aria-label="' + esc(text(R && R.label, 40)) + '">' + links.map(function (l) { return '<a href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 40)) + '</a>'; }).join('') + '<a href="https://www.youtube.com/@TheBuddyMartinShow/live">Watch The Buddy Martin Show live</a></nav>' + (R && text(R.next, 200) ? '<p>' + esc(text(R.next, 200)) + '</p>' : '') + '<p class="pg-src">' + esc(text(D.asOf, 240)) + '</p><a class="pg-top" href="#pg-cover">Back to top ↑</a></footer>';
  }
  function renderPregame(D) {
    return '<div class="pg-wrap">' + pgTop(D) + pgMast(D) + pgCover(D) + '<div class="pg-grid">' + pgGame(D) + pgSeries(D) + '</div>' + pgWatch(D) + pgTape(D) + pgKeys(D) + pgInjuries(D) + pgRosters(D) + pgLead(D) + pgSlate(D) + pgCards(D) + pgShots(D) + pgFoot(D) + '</div>';
  }

  /* ================= Live refresh (pregame layout) =================
   * On mount and every 60 s while the tab is visible: read /blog-feed.xml (same origin, no credentials, no-store), run the
   * shared picker (src/magazine-feed.js, the same rules as sports-live/refresh-magazine-feed.mjs) against the baked issue, and
   * swap the lead column and the card band in place when the story changed. A block the reader can see is never swapped (it
   * waits for the next cycle); a block above the viewport is swapped with the scroll held on what the reader is looking at.
   * Inside the game window the scoreboard (sports-live/scoreboard.json, the feed the homepage reads) puts the live score in the
   * countdown slots, text only. Any failure keeps the baked issue. State lives on the root, never in late-initialised vars. */
  function mfLiveStop() {
    var r = document.getElementById('gbm-magazine-page'), L = r && r.__mfLive;
    if (!L) return;
    clearInterval(L.timer); document.removeEventListener('visibilitychange', L.vis); r.__mfLive = null;
  }
  function mfLiveStart(root) {
    if (root.__mfLive || typeof fetch !== 'function' || typeof DOMParser !== 'function') return;
    var base = issue(), L = root.__mfLive = { last: 0, busy: false, lead: safeUrl((obj(base.lead) || {}).url), cards: mfCardKey((obj(base.cards) || {}).items) };
    function cycle(force) {
      if (!root.isConnected) { mfLiveStop(); return; }
      if (document.hidden || L.busy || (!force && Date.now() - L.last < 55000)) return;
      L.busy = true; L.last = Date.now();
      Promise.all([mfFeed().then(function (posts) { mfApply(root, base, posts); }, function () { if (!root.hasAttribute('data-mz-live')) root.setAttribute('data-mz-live', 'baked'); }),
        mfScore(root, base)]).then(function () { L.busy = false; }, function () { L.busy = false; });
    }
    L.vis = function () { if (!document.hidden) cycle(false); };
    document.addEventListener('visibilitychange', L.vis);
    L.timer = setInterval(function () { cycle(false); }, 60000);
    setTimeout(function () { cycle(true); }, 0);
  }
  function mfCardKey(items) { return list(items, 9).map(function (c) { return safeUrl(c && c.url); }).join(' '); }
  function mfFeed() {
    var c = typeof AbortController === 'function' ? new AbortController() : null, t = setTimeout(function () { if (c) c.abort(); }, 4000);
    return fetch('/blog-feed.xml?t=' + Math.floor(Date.now() / 60000), { signal: c ? c.signal : undefined, credentials: 'omit', cache: 'no-store' }).then(function (r) {
      clearTimeout(t); if (!r.ok) throw new Error('feed ' + r.status);
      return r.text();
    }).then(function (xml) {
      var feed = new DOMParser().parseFromString(xml, 'text/xml');
      function t2(n, key) { var el = Array.from(n.children).find(function (x) { return x.localName === key; }); return el ? el.textContent.trim() : ''; }
      var posts = Array.from(feed.querySelectorAll('item')).map(function (n) { var enc = n.querySelector('enclosure'); return { title: t2(n, 'title'), excerpt: t2(n, 'description'), author: t2(n, 'creator'), url: t2(n, 'link'), firstPublishedDate: t2(n, 'pubDate'), html: t2(n, 'encoded'), image: { src: enc ? enc.getAttribute('url') : '', alt: t2(n, 'title') } }; });
      if (posts.length < 3) throw new Error('feed too short');
      return posts;
    });
  }
  // Replace el with html unless the reader can see it. Returns true when swapped.
  function mfSwap(el, html) {
    if (!el || !el.parentNode || !html) return false;
    var r = el.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight || 800;
    if (r.bottom > 0 && r.top < vh) return false;
    var tmp = document.createElement('div'); tmp.innerHTML = html; var fresh = tmp.firstElementChild; if (!fresh) return false;
    mfHold(el, function () { el.parentNode.replaceChild(fresh, el); });
    return true;
  }
  // Run fn; if el sits above the viewport, keep the first thing below it where it was (no visible jump, with or without native scroll anchoring).
  function mfHold(el, fn) {
    var above = el.getBoundingClientRect().bottom <= 0, ref = null;
    if (above) { for (var n = el; n && !ref; n = n.parentNode) ref = n.nextElementSibling; }
    var y = ref ? ref.getBoundingClientRect().top : 0;
    fn();
    if (ref && ref.isConnected) { var d = ref.getBoundingClientRect().top - y; if (d) window.scrollBy(0, d); }
  }
  function mfApply(root, base, posts) {
    var res = mfPick(base, posts, Date.now(), typeof CREDITS === 'object' && CREDITS ? CREDITS : {}), L = root.__mfLive;
    if (!L || !root.isConnected) return;
    root.setAttribute('data-mz-live', 'feed');
    var D = Object.assign({}, base, { lead: res.lead, cards: Object.assign({}, obj(base.cards) || {}, { items: res.items }) });
    var leadUrl = safeUrl((obj(res.lead) || {}).url);
    if (leadUrl && leadUrl !== L.lead) {
      var oldHref = pgCoverHref(Object.assign({}, base, { lead: { url: L.lead } }));
      if (mfSwap(root.querySelector('#pg-lead'), pgLead(D))) {
        L.lead = leadUrl;
        var go = pgCoverHref(D);
        root.querySelectorAll('#pg-cover a[href]').forEach(function (a) { if (a.getAttribute('href') === oldHref) a.setAttribute('href', go); });
      }
    }
    var key = mfCardKey(res.items);
    if (key && key !== L.cards && mfSwap(root.querySelector('#pg-more'), pgCards(D))) L.cards = key;
  }
  // ESPN scoreboard -> the scoreboard.json shape mfScoreLine reads ({live} in game, {last} when final). null when not started or not found.
  function mfEspn(G, opp) {
    var ev = text(G.espnEvent, 20), k = Date.parse(G.kickoffISO || '');
    if (!/^[0-9]+$/.test(ev) || !isFinite(k)) return Promise.resolve(null);
    var d = new Date(k - 5 * 3600000), ymd = d.getUTCFullYear() + ('0' + (d.getUTCMonth() + 1)).slice(-2) + ('0' + d.getUTCDate()).slice(-2);
    var c = typeof AbortController === 'function' ? new AbortController() : null, tm = setTimeout(function () { if (c) c.abort(); }, 4000);
    return fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups=8&dates=' + ymd, { signal: c ? c.signal : undefined, credentials: 'omit', cache: 'no-store' })
      .then(function (r) { clearTimeout(tm); if (!r.ok) throw new Error('espn ' + r.status); return r.json(); })
      .then(function (j) {
        var e = (j && j.events || []).filter(function (x) { return x && String(x.id) === ev; })[0], cp = e && e.competitions && e.competitions[0];
        if (!cp || !cp.status || !cp.status.type) return null;
        var st = cp.status.type, fla = null, oth = null;
        (cp.competitors || []).forEach(function (x) { var n = num(parseInt(x && x.score, 10)); if (x && x.team && x.team.location === 'Florida') fla = n; else oth = n; });
        if (fla === null || oth === null) return null;
        if (st.state === 'in') return { live: { score: { fla: fla, opp: oth }, clock: /HALFTIME/.test(st.name || '') ? 'Half' : text(cp.status.displayClock, 8), period: num(cp.status.period) } };
        if (st.state === 'post' && st.completed) return { last: { opponent: opp, status: 'final', date: G.kickoffISO, score: { fla: fla, opp: oth } } };
        return null;
      });
  }
  function mfScore(root, base) {
    var G = obj(base.game) || {}, teams = list(G.teams, 2).map(obj), opp = teams[1] ? text(teams[1].name, 40) : '', k = Date.parse(G.kickoffISO || ''), t = Date.now();
    if (!opp || !isFinite(k) || t < k - 1800000 || t > k + 12 * 3600000) return Promise.resolve();
    var c = typeof AbortController === 'function' ? new AbortController() : null, tm = setTimeout(function () { if (c) c.abort(); }, 3000);
    // ESPN's scoreboard first when the issue names the event (the live game), then the repo feed; any failure keeps the baked text.
    return mfEspn(G, opp).catch(function () { return null; }).then(function (espn) {
      if (espn) { clearTimeout(tm); return espn; }
      return fetch('https://presidente49.github.io/gatorbait-media-redesign/sports-live/scoreboard.json?t=' + Math.floor(t / 60000), { signal: c ? c.signal : undefined, credentials: 'omit', cache: 'no-store' })
        .then(function (r) { clearTimeout(tm); if (!r.ok) throw new Error('scoreboard ' + r.status); return r.json(); });
    })
      .then(function (raw) {
        var line = mfScoreLine(raw, opp, G.kickoffISO, Date.now());
        if (!root.isConnected || line === (root.getAttribute('data-pg-score') || '')) return;
        var slots = root.querySelectorAll('[data-pg-count]');
        function set() { if (line) root.setAttribute('data-pg-score', line); else root.removeAttribute('data-pg-score'); pgTick(root); }
        if (slots.length) mfHold(slots[0], set); else set();
      }).catch(function () {});
  }
})();
