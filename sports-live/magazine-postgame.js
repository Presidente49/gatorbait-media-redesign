/* GatorBait Magazine 2026: the weekly web issue on /magazine. Issue 2026-10-04-postgame-missouri, build c8425bc2.
 * BUILT, MINIFIED FILE: edit sports-live/src/magazine.{css,js} or sports-live/magazine-issue.json, then run:
 * NODE_PATH=<dir with esbuild> node sports-live/build-magazine.mjs
 */
(function () {
  'use strict';
  var CSS = "html:has(#gbm-magazine-page.mz26) #SITE_PAGES,html.gbm-magazine-live #SITE_PAGES,html.gbm-magazine-live #pageBackground_nh0hy{display:none!important}\nhtml.gbm-magazine-live #SITE_CONTAINER,html.gbm-magazine-live #masterPage,html.gbm-magazine-live #PAGES_CONTAINER,html.gbm-magazine-live #SITE_PAGES_TRANSITION_GROUP{height:auto!important;min-height:0!important;padding-bottom:0!important;margin-bottom:0!important}\n#gbm-magazine-page.mz26{\n--mz-paper:#f3efe5;--mz-cream:#fffaf0;--mz-ink:#10264b;--mz-ink-2:#42506a;--mz-mute:#526075;--mz-rule:#b5b7b8;--mz-rule-soft:#d9d4c7;\n--mz-blue:#123dc9;--mz-orange:#f15a24;--mz-orange-ink:#a83511;--mz-orange-soft:#ff864d;--mz-shadow:#c9c3b5;\n--mz-cond:\"Barlow Condensed\",\"Barlow\",sans-serif;--mz-sans:\"Barlow\",sans-serif;--mz-mast:\"Bebas Neue\",\"Barlow Condensed\",\"Barlow\",sans-serif;--mz-pad:16px;\ndisplay:block;position:relative;z-index:3;width:100%;min-width:0;overflow-x:clip;\nbackground:var(--mz-paper);color:var(--mz-ink);font:16px/1.5 var(--mz-sans);\npadding:0 0 40px;text-size-adjust:100%;-webkit-text-size-adjust:100%\n}\n#gbm-magazine-page.mz26 *,#gbm-magazine-page.mz26 *::before,#gbm-magazine-page.mz26 *::after{box-sizing:border-box}\n#gbm-magazine-page.mz26 h1,#gbm-magazine-page.mz26 h2,#gbm-magazine-page.mz26 h3,#gbm-magazine-page.mz26 h4,#gbm-magazine-page.mz26 p,#gbm-magazine-page.mz26 ul,#gbm-magazine-page.mz26 ol,#gbm-magazine-page.mz26 figure,#gbm-magazine-page.mz26 table{margin:0;padding:0}\n#gbm-magazine-page.mz26 ul,#gbm-magazine-page.mz26 ol{list-style:none}\n#gbm-magazine-page.mz26 a{color:inherit;text-decoration:none}\n#gbm-magazine-page.mz26 a:focus-visible{outline:3px solid var(--mz-orange);outline-offset:4px}\n#gbm-magazine-page.mz26 img{display:block;max-width:100%;height:auto}\n#gbm-magazine-page.mz26 h1,#gbm-magazine-page.mz26 h2,#gbm-magazine-page.mz26 h3,#gbm-magazine-page.mz26 h4{font-family:var(--mz-cond);font-weight:800;color:var(--mz-ink);overflow-wrap:anywhere;text-wrap:balance}\n#gbm-magazine-page.mz26 .mz-wrap{width:100%;max-width:1184px;margin:0 auto;padding-inline:var(--mz-pad)}\n#gbm-magazine-page.mz26 .mz-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n#gbm-magazine-page.mz26 .mz-kick{display:block;font:700 11px/1.4 var(--mz-sans);letter-spacing:.16em;text-transform:uppercase;color:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-by{font:600 13px/1.4 var(--mz-sans);color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-cr{display:block;font:500 11px/1.4 var(--mz-sans);color:var(--mz-mute);padding-top:6px}\n#gbm-magazine-page.mz26 .mz-cover-fig>a,#gbm-magazine-page.mz26 .mz-feat-fig>a{display:block}\n#gbm-magazine-page.mz26 .mz-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;background:var(--mz-orange);color:var(--mz-ink);font:800 14px/1 var(--mz-cond);letter-spacing:.08em;text-transform:uppercase;box-shadow:3px 3px 0 var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-more{display:inline-flex;align-items:center;min-height:44px;font:800 14px/1 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--mz-blue);border-bottom:3px solid var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-frame{display:block;position:relative;width:100%;background:var(--mz-ink);overflow:hidden}\n#gbm-magazine-page.mz26 .mz-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}\n#gbm-magazine-page.mz26 .mz-src{display:inline-block;margin-left:6px;font:600 11px/1.3 var(--mz-sans);letter-spacing:.04em;text-transform:uppercase;color:var(--mz-mute);white-space:nowrap}\n#gbm-magazine-page.mz26 .mz-num{font-variant-numeric:tabular-nums}\n#gbm-magazine-page.mz26 .mz-head{border-bottom:3px solid var(--mz-ink);padding:18px 0 12px}\n#gbm-magazine-page.mz26 .mz-head-top{display:flex;justify-content:space-between;align-items:center;gap:12px;font:700 10px/1.3 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:var(--mz-mute);padding-bottom:10px;border-bottom:1px solid var(--mz-rule-soft)}\n#gbm-magazine-page.mz26 .mz-head-top span:last-child{text-align:right}\n#gbm-magazine-page.mz26 .mz-mast{display:flex;align-items:flex-end;justify-content:space-between;gap:12px 20px;padding-top:14px}\n#gbm-magazine-page.mz26 .mz-mast img{width:min(300px,62%);height:auto;aspect-ratio:900/241;object-fit:contain;object-position:left bottom}\n#gbm-magazine-page.mz26 .mz-mast b{flex:0 1 auto;min-width:0;font:800 clamp(28px,8vw,56px)/.9 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase;color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-issue{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:12px;padding-top:10px;border-top:2px solid var(--mz-ink);font:700 12px/1.4 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-issue span+span::before{content:\"\";display:inline-block;width:6px;height:6px;margin:0 10px 1px 0;background:var(--mz-orange);transform:rotate(45deg)}\n#gbm-magazine-page.mz26 .mz-issue .mz-week{color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-cover{display:grid;gap:0;margin-top:22px;border:6px solid var(--mz-ink);background:var(--mz-ink);box-shadow:8px 8px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-cover-fig{display:block;min-width:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{background:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-cr{color:#d3dbe9;padding:8px 12px 10px;background:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-cover-type{position:relative;padding:16px 14px 20px;background:var(--mz-blue);color:var(--mz-cream);overflow:hidden}\n#gbm-magazine-page.mz26 .mz-cover-type::after{content:\"\";position:absolute;right:-12px;top:0;width:76px;height:100%;background:repeating-linear-gradient(135deg,transparent 0 8px,#ffffff14 8px 10px);pointer-events:none}\n#gbm-magazine-page.mz26 .mz-cover-type>*{position:relative;z-index:1}\n#gbm-magazine-page.mz26 .mz-cover-type .mz-kick{color:#ffb08f;margin-bottom:8px}\n#gbm-magazine-page.mz26 .mz-cover h1{font:800 clamp(32px,9.2vw,72px)/.92 var(--mz-cond);letter-spacing:-.02em;color:var(--mz-cream);text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-cover h1 a{display:block;min-height:44px}\n#gbm-magazine-page.mz26 .mz-cover .mz-dek{font:500 15px/1.4 var(--mz-sans);color:#e9eefc;margin-top:12px;max-width:60ch}\n#gbm-magazine-page.mz26 .mz-cover .mz-by{color:#c9d3ff;margin-top:10px}\n#gbm-magazine-page.mz26 .mz-cover .mz-btn{margin-top:16px}\n#gbm-magazine-page.mz26 .mz-toc{margin-top:26px;border-top:3px solid var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-toc .mz-kick{padding:10px 0 2px}\n#gbm-magazine-page.mz26 .mz-toc ol{display:grid}\n#gbm-magazine-page.mz26 .mz-toc li{border-bottom:1px solid var(--mz-rule)}\n#gbm-magazine-page.mz26 .mz-toc a{display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;align-items:start;min-height:56px;padding:12px 0}\n#gbm-magazine-page.mz26 .mz-toc b{font:800 28px/1 var(--mz-cond);color:var(--mz-blue);letter-spacing:-.04em}\n#gbm-magazine-page.mz26 .mz-toc small{display:block;font:700 10px/1.3 var(--mz-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--mz-orange-ink);margin-bottom:3px}\n#gbm-magazine-page.mz26 .mz-toc span{display:block;font:700 17px/1.2 var(--mz-cond);color:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-sec{margin-top:40px}\n#gbm-magazine-page.mz26 .mz-sec-h{display:flex;flex-direction:column;gap:6px;border-top:3px solid var(--mz-ink);padding-top:14px;margin-bottom:18px}\n#gbm-magazine-page.mz26 .mz-sec-h h2{font:800 clamp(30px,8vw,44px)/1 var(--mz-cond);letter-spacing:-.02em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-sec-h p{font:500 14px/1.4 var(--mz-sans);color:var(--mz-mute);max-width:52ch}\n#gbm-magazine-page.mz26 .mz-sub{display:flex;align-items:baseline;gap:10px;border-bottom:2px solid var(--mz-ink);padding-bottom:6px;margin-bottom:12px}\n#gbm-magazine-page.mz26 .mz-sub h3{font:800 22px/1 var(--mz-cond);letter-spacing:.02em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-sub small{font:600 12px/1.3 var(--mz-sans);color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-cols{display:grid;gap:18px}\n#gbm-magazine-page.mz26 .mz-col{display:grid;gap:10px;align-content:start;padding:0 0 18px;border-bottom:1px solid var(--mz-rule)}\n#gbm-magazine-page.mz26 .mz-col .mz-frame{box-shadow:5px 5px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-col .mz-who{font:700 11px/1.4 var(--mz-sans);letter-spacing:.16em;text-transform:uppercase;color:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-col h3{font:700 24px/1.1 var(--mz-cond);letter-spacing:-.01em}\n#gbm-magazine-page.mz26 .mz-col p{font:400 15px/1.5 var(--mz-sans);color:var(--mz-ink-2)}\n#gbm-magazine-page.mz26 .mz-col .mz-more{margin-top:2px}\n#gbm-magazine-page.mz26 .mz-feat{display:grid;gap:0;border:4px solid var(--mz-ink);background:var(--mz-cream);box-shadow:6px 6px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-feat-type{padding:16px 14px 20px}\n#gbm-magazine-page.mz26 .mz-feat h3{font:800 clamp(26px,7vw,40px)/1 var(--mz-cond);letter-spacing:-.02em;margin-top:8px}\n#gbm-magazine-page.mz26 .mz-feat h3 a{display:block;min-height:44px}\n#gbm-magazine-page.mz26 .mz-feat .mz-dek{font:500 15px/1.45 var(--mz-sans);color:var(--mz-ink-2);margin-top:10px}\n#gbm-magazine-page.mz26 .mz-feat .mz-by{margin-top:8px}\n#gbm-magazine-page.mz26 .mz-feat .mz-btn{margin-top:14px}\n#gbm-magazine-page.mz26 .mz-feat .mz-cr{padding:6px 12px 8px;background:var(--mz-ink);color:#d3dbe9}\n#gbm-magazine-page.mz26 .mz-pre{background:var(--mz-ink);color:var(--mz-cream);padding:18px 14px 22px;border-top:6px solid var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-pre .mz-kick{color:#ffb08f}\n#gbm-magazine-page.mz26 .mz-pre-match{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:10px;margin-top:10px;padding:12px 0;border-top:1px solid #ffffff2e;border-bottom:1px solid #ffffff2e}\n#gbm-magazine-page.mz26 .mz-pre-team{min-width:0}\n#gbm-magazine-page.mz26 .mz-pre-team:last-child{text-align:right}\n#gbm-magazine-page.mz26 .mz-pre-team b{display:block;font:800 clamp(22px,6.4vw,40px)/1 var(--mz-cond);letter-spacing:-.01em;text-transform:uppercase;color:var(--mz-cream);overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-pre-team small{display:block;font:600 12px/1.3 var(--mz-cond);letter-spacing:.08em;text-transform:uppercase;color:#c9d3ff;margin-top:4px}\n#gbm-magazine-page.mz26 .mz-pre-at{font:800 14px/1 var(--mz-cond);letter-spacing:.1em;color:var(--mz-orange-soft);padding:6px 8px;border:1px solid var(--mz-orange-soft)}\n#gbm-magazine-page.mz26 .mz-pre-when{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:12px;font:700 13px/1.4 var(--mz-cond);letter-spacing:.06em;text-transform:uppercase}\n#gbm-magazine-page.mz26 .mz-pre-when span+span::before{content:\"\";display:inline-block;width:5px;height:5px;margin:0 9px 2px 0;background:var(--mz-orange);transform:rotate(45deg)}\n#gbm-magazine-page.mz26 .mz-pre-series{font:500 15px/1.45 var(--mz-sans);color:#dfe6f7;margin-top:12px}\n#gbm-magazine-page.mz26 .mz-pre-keys{display:grid;gap:8px;margin-top:10px;counter-reset:mzk}\n#gbm-magazine-page.mz26 .mz-pre-keys li{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:start;font:500 15px/1.45 var(--mz-sans);color:#e9eefc;counter-increment:mzk}\n#gbm-magazine-page.mz26 .mz-pre-keys li::before{content:counter(mzk,decimal-leading-zero);font:800 24px/1 var(--mz-cond);color:var(--mz-orange-soft);letter-spacing:-.04em}\n#gbm-magazine-page.mz26 .mz-pre h4{font:800 13px/1.3 var(--mz-cond);letter-spacing:.12em;text-transform:uppercase;color:#ffb08f;margin-top:16px}\n#gbm-magazine-page.mz26 .mz-pre-link{display:grid;gap:4px;margin-top:18px;padding:14px;background:#ffffff12;border-left:4px solid var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-pre-link small{font:700 10px/1.3 var(--mz-sans);letter-spacing:.14em;text-transform:uppercase;color:#ffb08f}\n#gbm-magazine-page.mz26 .mz-pre-link b{font:700 20px/1.15 var(--mz-cond);color:var(--mz-cream)}\n#gbm-magazine-page.mz26 .mz-pre-link p{font:400 14px/1.45 var(--mz-sans);color:#d3dbe9}\n#gbm-magazine-page.mz26 .mz-pre-link .mz-by{color:#c9d3ff}\n#gbm-magazine-page.mz26 .mz-dept{display:grid;gap:28px}\n#gbm-magazine-page.mz26 .mz-dep{min-width:0}\n#gbm-magazine-page.mz26 .mz-sched{width:100%;border-collapse:collapse;table-layout:fixed;font:600 14px/1.3 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-sched th,#gbm-magazine-page.mz26 .mz-sched td{padding:9px 6px 9px 0;text-align:left;border-bottom:1px solid var(--mz-rule);vertical-align:top;overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-sched th{font:700 10px/1.3 var(--mz-sans);letter-spacing:.12em;text-transform:uppercase;color:var(--mz-mute);border-bottom:2px solid var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-sched .mz-d{width:62px;color:var(--mz-mute);font-weight:600}\n#gbm-magazine-page.mz26 .mz-sched .mz-r{width:38%;text-align:right;padding-right:0;font-family:var(--mz-cond);font-weight:800;font-size:16px;letter-spacing:.02em}\n#gbm-magazine-page.mz26 .mz-sched .mz-r small{display:block;font:600 11px/1.3 var(--mz-sans);letter-spacing:.04em;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-sched td.mz-o{font-family:var(--mz-cond);font-weight:700;font-size:16px}\n#gbm-magazine-page.mz26 .mz-sched td.mz-o small{font:500 12px/1.3 var(--mz-sans);color:var(--mz-mute);margin-left:4px}\n#gbm-magazine-page.mz26 .mz-sched .mz-w{color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-sched .mz-l{color:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-sched tr.mz-next td{background:var(--mz-cream);box-shadow:inset 4px 0 0 var(--mz-orange)}\n#gbm-magazine-page.mz26 .mz-sched tr.mz-next td:first-child{padding-left:10px}\n#gbm-magazine-page.mz26 .mz-inj{display:grid;gap:16px}\n#gbm-magazine-page.mz26 .mz-inj h4{font:800 15px/1.2 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--mz-blue);padding-bottom:6px;border-bottom:1px solid var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-inj li{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;padding:8px 0;border-bottom:1px solid var(--mz-rule);font:500 14px/1.4 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-inj li b{font:700 14px/1.4 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-inj li b i{font:700 11px/1 var(--mz-cond);font-style:normal;letter-spacing:.08em;color:var(--mz-mute);margin-right:5px}\n#gbm-magazine-page.mz26 .mz-inj .mz-st{font:800 11px/1 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;padding:4px 6px;color:var(--mz-cream);background:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-inj .mz-st[data-s=out]{background:var(--mz-orange-ink)}\n#gbm-magazine-page.mz26 .mz-inj .mz-st[data-s=questionable],#gbm-magazine-page.mz26 .mz-inj .mz-st[data-s=doubtful]{background:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-inj .mz-src{margin-left:auto}\n#gbm-magazine-page.mz26 .mz-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n#gbm-magazine-page.mz26 .mz-stat{display:grid;gap:2px;align-content:start;padding:12px 12px 10px;background:var(--mz-cream);border:2px solid var(--mz-ink);box-shadow:4px 4px 0 var(--mz-shadow);min-width:0}\n#gbm-magazine-page.mz26 .mz-stat b{font:800 clamp(30px,9vw,44px)/1 var(--mz-cond);letter-spacing:-.03em;color:var(--mz-blue);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-stat span{font:700 13px/1.3 var(--mz-sans);color:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-stat small{font:600 10px/1.3 var(--mz-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-notes li{padding:8px 0 8px 18px;border-bottom:1px solid var(--mz-rule);font:500 14px/1.45 var(--mz-sans);position:relative}\n#gbm-magazine-page.mz26 .mz-notes li::before{content:\"\";position:absolute;left:0;top:14px;width:8px;height:8px;background:var(--mz-orange);transform:rotate(45deg)}\n#gbm-magazine-page.mz26 .mz-shots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n#gbm-magazine-page.mz26 .mz-shot{display:grid;gap:6px;align-content:start;min-width:0}\n#gbm-magazine-page.mz26 .mz-shot .mz-frame{box-shadow:4px 4px 0 var(--mz-shadow)}\n#gbm-magazine-page.mz26 .mz-shot span{display:block;min-height:20px;font:700 13px/1.3 var(--mz-cond);letter-spacing:.02em;color:var(--mz-ink)}\n#gbm-magazine-page.mz26 .mz-shots-cr{margin-top:12px}\n#gbm-magazine-page.mz26 .mz-foot{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 20px;margin-top:40px;border-top:3px solid var(--mz-ink);padding-top:12px}\n#gbm-magazine-page.mz26 .mz-foot .mz-more{font-size:15px}\n#gbm-magazine-page.mz26 .mz-foot small{font:600 12px/1.4 var(--mz-sans);color:var(--mz-mute)}\n@media(hover:hover) and (pointer:fine){\n#gbm-magazine-page.mz26 .mz-col:hover h3,#gbm-magazine-page.mz26 .mz-toc a:hover span,#gbm-magazine-page.mz26 .mz-shot:hover span,#gbm-magazine-page.mz26 .mz-pre-link:hover b{text-decoration:underline;text-decoration-color:var(--mz-orange);text-decoration-thickness:2px;text-underline-offset:4px}\n#gbm-magazine-page.mz26 .mz-more:hover{color:var(--mz-orange-ink)}\n}\n@media(max-width:359px){\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:32px}\n#gbm-magazine-page.mz26 .mz-head-top{font-size:9px;letter-spacing:.08em}\n#gbm-magazine-page.mz26 .mz-mast{gap:12px}\n#gbm-magazine-page.mz26 .mz-mast img{width:52%}\n#gbm-magazine-page.mz26 .mz-mast b{font-size:22px;letter-spacing:.03em}\n#gbm-magazine-page.mz26 .mz-shots{grid-template-columns:1fr}\n#gbm-magazine-page.mz26 .mz-sched .mz-d{width:54px}\n}\n@media(min-width:600px){\n#gbm-magazine-page.mz26 .mz-cols{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}\n#gbm-magazine-page.mz26 .mz-feat{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)}\n#gbm-magazine-page.mz26 .mz-feat-type{padding:22px 22px 26px}\n#gbm-magazine-page.mz26 .mz-toc ol{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px}\n#gbm-magazine-page.mz26 .mz-shots{grid-template-columns:repeat(3,minmax(0,1fr))}\n#gbm-magazine-page.mz26 .mz-inj{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}\n#gbm-magazine-page.mz26 .mz-pre{padding:24px 22px 28px}\n}\n@media(min-width:821px){\n#gbm-magazine-page.mz26{--mz-pad:24px;padding-bottom:56px}\n#gbm-magazine-page.mz26 .mz-head{padding-top:26px}\n#gbm-magazine-page.mz26 .mz-mast img{width:min(360px,40%)}\n#gbm-magazine-page.mz26 .mz-cover{grid-template-columns:minmax(0,1.25fr) minmax(0,.85fr);border-width:8px;box-shadow:10px 10px 0 var(--mz-shadow);margin-top:28px}\n#gbm-magazine-page.mz26 .mz-cover-type{padding:26px 26px 30px;display:flex;flex-direction:column;justify-content:flex-end}\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:clamp(44px,4.6vw,66px)}\n#gbm-magazine-page.mz26 .mz-toc ol{grid-template-columns:repeat(3,minmax(0,1fr));column-gap:32px}\n#gbm-magazine-page.mz26 .mz-sec{margin-top:54px}\n#gbm-magazine-page.mz26 .mz-sec-h{flex-direction:row;justify-content:space-between;align-items:flex-end;gap:20px}\n#gbm-magazine-page.mz26 .mz-sec-h p{text-align:right;max-width:340px}\n#gbm-magazine-page.mz26 .mz-dept{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);column-gap:40px;row-gap:32px}\n#gbm-magazine-page.mz26 .mz-dep-sched{grid-row:span 2}\n#gbm-magazine-page.mz26 .mz-shots{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px}\n}\n@media(min-width:1100px){\n#gbm-magazine-page.mz26 .mz-cols{grid-template-columns:repeat(4,minmax(0,1fr));gap:28px}\n#gbm-magazine-page.mz26 .mz-col h3{font-size:22px}\n}\n@media(prefers-reduced-motion:reduce){#gbm-magazine-page.mz26 *{transition:none!important;animation:none!important;scroll-behavior:auto!important}}\n#gbm-magazine-page.mz26 .mz-staff{display:flex;flex-wrap:wrap;gap:8px 24px;padding:16px 0;border-bottom:1px solid var(--mz-rule);font:13px/1.5 var(--mz-sans)}\n#gbm-magazine-page.mz26 .mz-staff p{margin:0}\n#gbm-magazine-page.mz26 .mz-tools{display:flex;align-items:center;flex-wrap:wrap;gap:16px;padding:22px 0;font-size:14px}\n#gbm-magazine-page.mz26 button{font:700 15px var(--mz-sans);padding:13px 18px;border:2px solid var(--mz-blue);background:white;color:var(--mz-blue);cursor:pointer;min-height:44px}\n#gbm-magazine-page.mz26 .mz-full-story{max-width:760px;margin:70px auto 0;padding-top:34px;border-top:4px solid var(--mz-orange);scroll-margin-top:100px;overflow-wrap:anywhere}\n#gbm-magazine-page.mz26 .mz-full-story h2{font:800 clamp(29px,4.2vw,48px)/1.08 var(--mz-sans);margin:12px 0;color:var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-full-story .mz-story-meta{font-size:14px;margin:14px 0 0}\n#gbm-magazine-page.mz26 .mz-site{display:inline-block;margin:6px 0 24px;font-size:14px;min-height:30px}\n#gbm-magazine-page.mz26 .mz-reading{font:19px/1.75 Georgia,serif;color:#17253b}\n#gbm-magazine-page.mz26 .mz-reading p{margin:0 0 1.1em}\n#gbm-magazine-page.mz26 .mz-reading h3{font:700 26px/1.25 var(--mz-sans);margin:30px 0 14px}\n#gbm-magazine-page.mz26 .mz-reading a,#gbm-magazine-page.mz26 .mz-utilities a{text-decoration:underline;text-underline-offset:3px}\n#gbm-magazine-page.mz26 .mz-body-photo{margin:22px 0}\n#gbm-magazine-page.mz26 .mz-body-photo img{display:block;max-width:100%;width:100%;height:auto;max-height:560px;object-fit:contain}\n#gbm-magazine-page.mz26 figcaption{font:13px/1.5 var(--mz-sans);padding-top:8px;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-story-nav{display:flex;flex-wrap:wrap;gap:10px 24px;padding:20px 0;border-top:1px solid var(--mz-rule);font-size:14px}\n#gbm-magazine-page.mz26 .mz-story-nav a{display:inline-flex;align-items:center;min-height:44px}\n#gbm-magazine-page.mz26 .mz-utilities{max-width:760px;margin:60px auto;padding:28px;background:var(--mz-cream);border-top:4px solid var(--mz-blue)}\n#gbm-magazine-page.mz26 .mz-utilities p{margin:14px 0}\n#gbm-magazine-page.mz26 #mz-contents{scroll-margin-top:100px}\n@media(max-width:600px){#gbm-magazine-page.mz26 .mz-reading{font-size:18px;line-height:1.65}#gbm-magazine-page.mz26 .mz-full-story{margin-top:42px}#gbm-magazine-page.mz26 .mz-staff{display:grid;grid-template-columns:1fr}#gbm-magazine-page.mz26 .mz-utilities{padding:18px}}\n@media print{\n@page{size:A4;margin:17mm 16mm}\nbody>*:not(#gbm-magazine-page){display:none!important}\nhtml,body{background:white!important;color:black!important}\n#gbm-magazine-page.mz26{padding:0;background:white;overflow:visible;font-size:11pt}\n#gbm-magazine-page.mz26 .mz-wrap{max-width:none;padding:0}\n#gbm-magazine-page.mz26 .mz-tools,#gbm-magazine-page.mz26 .mz-story-nav,#gbm-magazine-page.mz26 .mz-foot{display:none}\n#gbm-magazine-page.mz26 .mz-full-story{break-before:page;max-width:none;margin:0;padding-top:12pt;border-top:2pt solid #0021a5}\n#gbm-magazine-page.mz26 .mz-reading{font-size:11pt;line-height:1.5}\n#gbm-magazine-page.mz26 .mz-reading p{orphans:3;widows:3}\n#gbm-magazine-page.mz26 .mz-body-photo{break-inside:avoid}\n#gbm-magazine-page.mz26 .mz-body-photo img{max-height:80mm;width:auto;max-width:100%;margin:auto}\n#gbm-magazine-page.mz26 h2,#gbm-magazine-page.mz26 h3{break-after:avoid}\n#gbm-magazine-page.mz26 .mz-full-story h2{font-size:23pt}\n#gbm-magazine-page.mz26 .mz-cover{break-inside:avoid}\n#gbm-magazine-page.mz26 .mz-toc{break-before:page;break-after:page}\n}\n#gbm-magazine-page.mz26 .mz-writer-promo{max-width:760px;margin:32px auto;padding:24px;border-block:2px solid #163d8c;background:#f2f5fa;color:#14264a}\n#gbm-magazine-page.mz26 .mz-writer-promo h3{font-size:26px;line-height:1.2;margin:8px 0}\n#gbm-magazine-page.mz26 .mz-writer-promo>div{display:flex;flex-wrap:wrap;gap:12px 24px}\n#gbm-magazine-page.mz26 .mz-writer-promo a{display:inline-flex;align-items:center;min-height:44px;text-decoration:underline}\n@media print{#gbm-magazine-page.mz26 .mz-writer-promo{break-inside:avoid;padding:8pt;margin:12pt auto;background:none}#gbm-magazine-page.mz26 .mz-writer-promo h3{font-size:13pt}}\n@media screen {\n#gbm-magazine-page.mz26{--mz-paper:#07122e;--mz-cream:#f7f9ff;--mz-ink:#f7f9ff;--mz-ink-2:#c5cee1;--mz-mute:#b5c2db;--mz-rule:#354563;--mz-rule-soft:#293956;--mz-blue:#dce7ff;--mz-orange:#fa4616;--mz-orange-ink:#ff9877;--mz-shadow:transparent;background:#07122e;color:#f7f9ff}\n#gbm-magazine-page.mz26 .mz-head{border-bottom:1px solid #354563;padding:16px 0 14px}\n#gbm-magazine-page.mz26 .mz-head-top{border:0;font-size:12px}\n#gbm-magazine-page.mz26 .mz-mast{padding-top:4px}\n#gbm-magazine-page.mz26 .mz-mast b{font-size:38px;color:#fff;letter-spacing:.04em}\n#gbm-magazine-page.mz26 .mz-issue{border:0;color:#c5cee1}\n#gbm-magazine-page.mz26 .mz-issue .mz-week{color:#c5cee1}\n#gbm-magazine-page.mz26 .mz-cover{border:1px solid #354563;background:#0d1d3b;box-shadow:none}\n#gbm-magazine-page.mz26 .mz-cover-type{background:#0d1d3b;padding:28px 24px;color:#fff}\n#gbm-magazine-page.mz26 .mz-cover-type::after{display:none}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{background:#07122e}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-cr{background:#0d1d3b;color:#c5cee1}\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:clamp(32px,4.2vw,52px);line-height:1.02;color:#fff}\n#gbm-magazine-page.mz26 .mz-btn,#gbm-magazine-page.mz26 button{background:#132848;color:#fff;border:1px solid #7489ad;border-bottom:3px solid #fa4616;box-shadow:none}\n#gbm-magazine-page.mz26 .mz-toc{border-top:1px solid #354563}\n#gbm-magazine-page.mz26 .mz-toc a:hover{background:#132848;color:#fff}\n#gbm-magazine-page.mz26 .mz-full-story h2,#gbm-magazine-page.mz26 .mz-reading h3{color:#fff}\n#gbm-magazine-page.mz26 .mz-reading{color:#f0f3fa}\n#gbm-magazine-page.mz26 .mz-reading a,#gbm-magazine-page.mz26 .mz-site{color:#b8d5ff}\n#gbm-magazine-page.mz26 .mz-utilities,#gbm-magazine-page.mz26 .mz-writer-promo{background:#0d1d3b;color:#f7f9ff;border-color:#354563;border-top:3px solid #fa4616}\n#gbm-magazine-page.mz26 .mz-writer-promo p,#gbm-magazine-page.mz26 .mz-writer-promo a{font-size:16px}\n}\n@media screen {\n#gbm-magazine-page.mz26 .mz-cover{display:block;position:relative;isolation:isolate;overflow:hidden;border:0;border-radius:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{aspect-ratio:16/10!important;min-height:620px}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame img{object-fit:cover;object-position:center 40%}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-cr{position:absolute;right:16px;top:14px;z-index:3;padding:5px 8px;background:rgba(7,18,46,.85);font-size:12px}\n#gbm-magazine-page.mz26 .mz-cover-type{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(20px,4vw,46px);background:linear-gradient(180deg,rgba(3,9,22,0) 15%,rgba(3,9,22,.24) 35%,rgba(3,9,22,.94) 80%,#030916 100%);pointer-events:none}\n#gbm-magazine-page.mz26 .mz-cover-type a{pointer-events:auto}\n#gbm-magazine-page.mz26 .mz-cover h1{max-width:850px;font-size:clamp(34px,4.6vw,62px);line-height:1.01;text-wrap:balance;text-shadow:0 2px 12px rgba(0,0,0,.6)}\n#gbm-magazine-page.mz26 .mz-cover .mz-dek{font-size:16px;max-width:650px}\n#gbm-magazine-page.mz26 .mz-cover .mz-btn{align-self:flex-start;background:#102342}\n@media(max-width:600px){#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{aspect-ratio:3/4!important;min-height:620px}#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame img{object-position:42% top}#gbm-magazine-page.mz26 .mz-cover-type{padding:22px 18px}#gbm-magazine-page.mz26 .mz-cover h1{font-size:36px}#gbm-magazine-page.mz26 .mz-cover .mz-dek{font-size:15px}}\n}\n@media screen {\n#gbm-magazine-page.mz26 .mz-cover{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto}\n#gbm-magazine-page.mz26 .mz-cover-fig,#gbm-magazine-page.mz26 .mz-cover-type{grid-area:1/1}\n#gbm-magazine-page.mz26 .mz-cover-type{position:relative;inset:auto;min-width:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{height:100%}\n#gbm-magazine-page.mz26 .mz-cover-fig>a{height:100%}\n#gbm-magazine-page.mz26 .mz-passport{display:flex;flex-wrap:wrap;gap:8px 24px;padding:16px 0;border-bottom:1px solid #354563;font-size:15px}\n#gbm-magazine-page.mz26 .mz-passport a{min-height:44px;display:flex;align-items:center;overflow-wrap:anywhere;color:#b8d5ff;text-decoration:underline;max-width:100%}\n#gbm-magazine-page.mz26 .mz-reached{display:block;color:#b8d5ff}\n}\n@media print{#gbm-magazine-page.mz26 .mz-passport,#gbm-magazine-page.mz26 .mz-reached{display:none!important}}\n#gbm-magazine-page.mz26 .mz-five{max-width:900px;margin:48px auto}\n#gbm-magazine-page.mz26 .mz-five h2{font-size:clamp(30px,5vw,48px);margin-bottom:24px}\n#gbm-magazine-page.mz26 .mz-five figure{margin:24px 0;break-inside:avoid}\n#gbm-magazine-page.mz26 .mz-five figcaption{padding:12px 0;font-size:16px;line-height:1.5}\n#gbm-magazine-page.mz26 .mz-five figcaption span{display:block;font-size:13px;color:var(--mz-mute)}\n#gbm-magazine-page.mz26 .mz-five a{display:inline-flex;align-items:center;min-height:44px;text-decoration:underline}\n@media print{#gbm-magazine-page.mz26 .mz-five{break-before:page}#gbm-magazine-page.mz26 .mz-five figcaption{font-size:10pt}}\n@media print{\n#gbm-magazine-page.mz26 .mz-cover{display:block;box-shadow:none;border:0}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame{height:55mm;aspect-ratio:auto!important}\n#gbm-magazine-page.mz26 .mz-cover-fig .mz-frame img{object-fit:contain;max-height:55mm}\n#gbm-magazine-page.mz26 .mz-cover-type{padding:8pt 0;background:none}\n#gbm-magazine-page.mz26 .mz-cover h1{font-size:26pt;line-height:1.1}\n#gbm-magazine-page.mz26 .mz-cover .mz-dek{font-size:10pt}\n#gbm-magazine-page.mz26 .mz-staff{font-size:9pt;margin-block:8pt;padding-block:8pt}\n}\n#gbm-magazine-page.pm{\n--pm-blue:#0021a5;--pm-navy:#061444;--pm-ink:#0b1a44;--pm-orange:#fa4616;--pm-orange-ink:#b93a0e;--pm-orange-lt:#ffb27a;\n--pm-paper:#f6f4ef;--pm-mute:#4a5878;--pm-line:#d9dce6;--pm-on-blue:#dfe6fb;--pm-on-blue-2:#c9d3ee;\nbackground:#fff;color:var(--pm-ink);font:400 17px/1.5 var(--mz-sans);padding:0\n}\nhtml:has(#gbm-magazine-page.pm) #gbm-site-header,html:has(#gbm-magazine-page.pm) #SITE_HEADER,html:has(#gbm-magazine-page.pm) #gbm-mobile-shell-host,html:has(#gbm-magazine-page.pm) #gbm-mobile-shell,html:has(#gbm-magazine-page.pm) #gbm-mobile-drawer-root{display:none!important}\n#gbm-magazine-page.pm .pm-wrap{width:100%}\n#gbm-magazine-page.pm .pm-in{width:100%;max-width:1180px;margin:0 auto;padding:0 var(--mz-pad)}\n#gbm-magazine-page.pm h1,#gbm-magazine-page.pm h2,#gbm-magazine-page.pm h3{font-family:var(--mz-cond);font-weight:800;letter-spacing:-.005em;color:inherit;overflow-wrap:break-word}\n#gbm-magazine-page.pm section,#gbm-magazine-page.pm nav{scroll-margin-top:12px}\n#gbm-magazine-page.pm a{transition:color .15s,background-color .15s,border-color .15s}\n#gbm-magazine-page.pm a:focus-visible{outline:3px solid var(--pm-orange);outline-offset:3px}\n#gbm-magazine-page.pm .mz-frame{background:var(--pm-navy)}\n#gbm-magazine-page.pm .pm-kick{margin:0 0 8px;font:700 13px/1.3 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--pm-orange-ink)}\n#gbm-magazine-page.pm .pm-sh{margin:0 0 22px;max-width:760px}\n#gbm-magazine-page.pm .pm-sh h2{font-size:clamp(36px,10vw,64px);line-height:.98}\n#gbm-magazine-page.pm .pm-dek{margin-top:10px;font-size:18px;line-height:1.45;color:#33405e}\n#gbm-magazine-page.pm .pm-src{margin-top:12px;font:500 13px/1.45 var(--mz-sans);color:var(--pm-mute)}\n#gbm-magazine-page.pm .pm-more{display:inline-block;padding:11px 0 7px;margin-top:10px;font:700 18px/1.25 var(--mz-cond);color:var(--pm-blue);border-bottom:3px solid var(--pm-orange)}\n#gbm-magazine-page.pm .pm-more:hover{color:var(--pm-orange-ink)}\n#gbm-magazine-page.pm .pm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:0 22px;margin-top:18px;background:var(--pm-orange);color:#fff;font:800 19px/1 var(--mz-cond);letter-spacing:.02em;border-radius:4px}\n#gbm-magazine-page.pm .pm-btn:hover{background:var(--pm-blue)}\n#gbm-magazine-page.pm .pm-mast{background:var(--pm-blue);color:#fff;padding:14px 0 18px}\n#gbm-magazine-page.pm .pm-mast-top{display:flex;justify-content:space-between;align-items:center;gap:10px;font:700 12px/1.3 var(--mz-sans);letter-spacing:.12em;text-transform:uppercase;color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-home{display:inline-flex;align-items:center;min-height:44px;color:#fff}\n#gbm-magazine-page.pm .pm-home::before{content:\"\\2190\\00a0\";color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-plate{margin:2px 0 0}\n#gbm-magazine-page.pm .pm-wm{display:block;font:800 clamp(44px,16vw,128px)/.86 var(--mz-cond);letter-spacing:.03em;text-transform:uppercase;color:#fff}\n#gbm-magazine-page.pm .pm-wm em{font-style:normal;color:var(--pm-orange)}\n#gbm-magazine-page.pm .pm-mz{display:flex;align-items:center;gap:12px;margin-top:8px;font:700 clamp(16px,4.8vw,26px)/1 var(--mz-cond);letter-spacing:.3em;text-transform:uppercase;color:#fff}\n#gbm-magazine-page.pm .pm-mz::before,#gbm-magazine-page.pm .pm-mz::after{content:\"\";flex:1;height:3px;background:var(--pm-orange)}\n#gbm-magazine-page.pm .pm-issue{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin-top:14px;font:600 15px/1.3 var(--mz-sans);color:var(--pm-on-blue)}\n#gbm-magazine-page.pm .pm-issue b{background:#fff;color:var(--pm-blue);padding:5px 10px;border-left:5px solid var(--pm-orange);font:800 16px/1.1 var(--mz-cond);letter-spacing:.02em}\n#gbm-magazine-page.pm .pm-cover{background:#fff;padding:0 0 30px}\n#gbm-magazine-page.pm .pm-cover-fig{position:relative;margin:0 calc(var(--mz-pad) * -1)}\n#gbm-magazine-page.pm .pm-cover-fig a{display:block}\n#gbm-magazine-page.pm .pm-cover-fig figcaption{position:absolute;top:8px;right:8px;padding:3px 7px;background:var(--pm-navy);font:600 11px/1.3 var(--mz-sans);color:#fff}\n#gbm-magazine-page.pm .pm-cover-type{position:relative;margin:-44px 6px 0;padding:18px 16px 0;background:#fff;border-top:6px solid var(--pm-orange)}\n#gbm-magazine-page.pm .pm-cover-type h1{font-size:clamp(42px,13.6vw,86px);line-height:.94;letter-spacing:-.01em;color:var(--pm-ink);text-wrap:balance}\n#gbm-magazine-page.pm .pm-cover-type h1 a:hover{color:var(--pm-blue)}\n#gbm-magazine-page.pm .pm-cover-dek{margin-top:14px;font-size:19px;line-height:1.45;color:#2a3655}\n#gbm-magazine-page.pm .pm-by{margin-top:12px;font:700 14px/1.3 var(--mz-sans);color:var(--pm-mute)}\n#gbm-magazine-page.pm .pm-lines{margin:24px 6px 0;padding-top:12px;border-top:2px solid var(--pm-ink)}\n#gbm-magazine-page.pm .pm-lines p{font:700 13px/1.3 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--pm-mute)}\n#gbm-magazine-page.pm .pm-lines li{padding:8px 0;border-bottom:1px solid var(--pm-line);font:700 19px/1.25 var(--mz-cond);color:var(--pm-ink)}\n#gbm-magazine-page.pm .pm-lines li::before{content:\"\";display:inline-block;width:10px;height:10px;margin-right:10px;background:var(--pm-orange);vertical-align:1px}\n#gbm-magazine-page.pm .pm-final{background:var(--pm-navy);color:#fff;padding:18px 0 16px}\n#gbm-magazine-page.pm .pm-final-l{font:800 13px/1 var(--mz-cond);letter-spacing:.2em;text-transform:uppercase;color:var(--pm-orange-lt);margin-bottom:8px}\n#gbm-magazine-page.pm .pm-sc{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n#gbm-magazine-page.pm .pm-team{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding-bottom:6px;border-bottom:3px solid #2b3a74}\n#gbm-magazine-page.pm .pm-team span{font:700 clamp(20px,5.6vw,30px)/1.05 var(--mz-cond);color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-team small{display:block;font:600 12px/1.3 var(--mz-sans);letter-spacing:.06em;color:#aab6da}\n#gbm-magazine-page.pm .pm-team b{font:800 clamp(46px,15vw,84px)/.85 var(--mz-cond);color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-team.pm-won span,#gbm-magazine-page.pm .pm-team.pm-won b{color:#fff}\n#gbm-magazine-page.pm .pm-team.pm-won{border-bottom-color:var(--pm-orange)}\n#gbm-magazine-page.pm .pm-final-m{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:12px;font:600 14px/1.35 var(--mz-sans);color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-toc{padding:20px 0 6px;background:#fff}\n#gbm-magazine-page.pm .pm-toc ol{display:flex;flex-wrap:wrap;gap:8px}\n#gbm-magazine-page.pm .pm-toc a{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:4px 14px 4px 5px;border:1px solid var(--pm-line);border-radius:999px;font:700 16px/1 var(--mz-cond);color:var(--pm-ink)}\n#gbm-magazine-page.pm .pm-toc a:hover{border-color:var(--pm-blue);color:var(--pm-blue)}\n#gbm-magazine-page.pm .pm-toc b{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--pm-blue);color:#fff;font:800 15px/1 var(--mz-cond)}\n#gbm-magazine-page.pm .pm-damage{margin-top:28px;padding:40px 0 34px;background:var(--pm-blue);color:#fff}\n#gbm-magazine-page.pm .pm-damage .pm-kick,#gbm-magazine-page.pm .pm-flow .pm-chart .pm-kick{color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-damage .pm-dek{color:var(--pm-on-blue)}\n#gbm-magazine-page.pm .pm-yl{margin-bottom:10px;font:700 13px/1.3 var(--mz-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-yards{max-width:760px;margin-bottom:30px}\n#gbm-magazine-page.pm .pm-yr{display:grid;grid-template-columns:76px minmax(0,1fr) auto;align-items:center;gap:10px;margin-bottom:10px}\n#gbm-magazine-page.pm .pm-yn{font:700 17px/1.1 var(--mz-cond)}\n#gbm-magazine-page.pm .pm-yb{display:block;height:20px;background:rgba(255,255,255,.14)}\n#gbm-magazine-page.pm .pm-yb i{display:block;height:100%;background:#fff}\n#gbm-magazine-page.pm .pm-us .pm-yb i{background:var(--pm-orange)}\n#gbm-magazine-page.pm .pm-yr b{min-width:52px;text-align:right;font:800 32px/1 var(--mz-cond)}\n#gbm-magazine-page.pm .pm-stats{display:grid;grid-template-columns:1fr 1fr;gap:24px 16px}\n#gbm-magazine-page.pm .pm-stats li{padding-top:10px;border-top:4px solid var(--pm-orange);min-width:0}\n#gbm-magazine-page.pm .pm-stats li:last-child:nth-child(odd){grid-column:1 / -1}\n#gbm-magazine-page.pm .pm-stats b{display:block;font:800 clamp(56px,17vw,96px)/.86 var(--mz-cond);letter-spacing:-.02em;color:#fff}\n#gbm-magazine-page.pm .pm-stats span{display:block;margin-top:8px;font:700 16px/1.25 var(--mz-sans);color:#fff}\n#gbm-magazine-page.pm .pm-stats small{display:block;margin-top:4px;font:500 14px/1.35 var(--mz-sans);color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-cmp{margin-top:32px;max-width:560px}\n#gbm-magazine-page.pm .pm-cmp table{width:100%;border-collapse:collapse}\n#gbm-magazine-page.pm .pm-cmp th,#gbm-magazine-page.pm .pm-cmp td{padding:10px 8px 10px 0;text-align:left;border-bottom:1px solid rgba(255,255,255,.22);vertical-align:bottom}\n#gbm-magazine-page.pm .pm-cmp thead th{font:600 13px/1.25 var(--mz-sans);color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-cmp tbody th{font:700 17px/1.2 var(--mz-cond);color:#fff}\n#gbm-magazine-page.pm .pm-cmp tbody td{font:800 30px/1 var(--mz-cond);color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-cmp tbody td.pm-after{color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-foot-row{margin-top:20px}\n#gbm-magazine-page.pm .pm-damage .pm-src{color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-more-lt{color:#fff}\n#gbm-magazine-page.pm .pm-more-lt:hover{color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-damage a:focus-visible{outline-color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-flow{padding:44px 0 34px;background:#fff}\n#gbm-magazine-page.pm .pm-chart{margin:0}\n#gbm-magazine-page.pm .pm-plot{background:var(--pm-navy);padding:16px 12px 10px 44px;border-radius:4px}\n#gbm-magazine-page.pm .pm-area{position:relative;height:clamp(210px,58vw,400px)}\n#gbm-magazine-page.pm .pm-area svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}\n#gbm-magazine-page.pm .pm-gl{stroke:rgba(255,255,255,.12);stroke-width:1;vector-effect:non-scaling-stroke}\n#gbm-magazine-page.pm .pm-g50{stroke:rgba(255,255,255,.5);stroke-width:1.5;stroke-dasharray:5 5;vector-effect:non-scaling-stroke}\n#gbm-magazine-page.pm .pm-up{fill:#3d63ff;fill-opacity:.55}\n#gbm-magazine-page.pm .pm-dn{fill:var(--pm-orange);fill-opacity:.5}\n#gbm-magazine-page.pm .pm-ln{fill:none;stroke:#fff;stroke-width:2.5;stroke-linejoin:round}\n#gbm-magazine-page.pm .pm-ax{position:absolute;left:-40px;transform:translateY(-50%);font:600 12px/1 var(--mz-sans);color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-mk{position:absolute;display:grid;place-items:center;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:var(--pm-orange);border:2px solid #fff;font:800 14px/1 var(--mz-cond);color:var(--pm-navy)}\n#gbm-magazine-page.pm .pm-qx{position:relative;height:22px;margin-top:6px}\n#gbm-magazine-page.pm .pm-qx span{position:absolute;top:4px;transform:translateX(-50%);font:700 12px/1 var(--mz-sans);letter-spacing:.08em;color:var(--pm-on-blue-2)}\n#gbm-magazine-page.pm .pm-key{counter-reset:pmk;display:grid;gap:10px;margin-top:16px}\n#gbm-magazine-page.pm .pm-key li{counter-increment:pmk;position:relative;padding-left:38px;font:500 16px/1.4 var(--mz-sans);color:#2a3655}\n#gbm-magazine-page.pm .pm-key li::before{content:counter(pmk);position:absolute;left:0;top:0;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--pm-orange);font:800 14px/1 var(--mz-cond);color:var(--pm-navy)}\n#gbm-magazine-page.pm .pm-key b{font:800 20px/1 var(--mz-cond);color:var(--pm-ink);margin-right:4px}\n#gbm-magazine-page.pm .pm-grades{padding:40px 0 36px;background:var(--pm-paper)}\n#gbm-magazine-page.pm .pm-gg{display:grid;grid-template-columns:1fr;gap:8px}\n#gbm-magazine-page.pm .pm-gg li{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:\"u g\" \"n g\";align-items:center;gap:2px 14px;min-height:72px;padding:10px 10px 10px 14px;background:#fff;border:1px solid var(--pm-line);border-left:6px solid var(--pm-line)}\n#gbm-magazine-page.pm .pm-gu{grid-area:u;font:700 19px/1.15 var(--mz-cond);color:var(--pm-ink)}\n#gbm-magazine-page.pm .pm-gg small{grid-area:n;font:500 14px/1.35 var(--mz-sans);color:var(--pm-mute)}\n#gbm-magazine-page.pm .pm-gl{grid-area:g;display:grid;place-items:center;min-width:64px;height:56px;padding:0 6px;border-radius:4px;font:800 40px/1 var(--mz-cond);background:#e8ecf8;color:var(--pm-ink)}\n@media (max-width:359px){\n#gbm-magazine-page.pm .pm-cover-fig img{aspect-ratio:16/9;width:100%;height:auto;object-fit:cover}\n#gbm-magazine-page.pm .pm-cover-type{padding-top:14px}\n#gbm-magazine-page.pm .pm-cover-type h1{font-size:36px}\n#gbm-magazine-page.pm .pm-issue{margin-top:10px}\n}\n@media (min-width:340px){\n#gbm-magazine-page.pm .pm-gg{grid-template-columns:1fr 1fr}\n#gbm-magazine-page.pm .pm-gg li{grid-template-columns:1fr;grid-template-areas:\"g\" \"u\" \"n\";align-content:start;justify-items:start;gap:8px;padding:12px;border-left-width:1px;border-top:5px solid var(--pm-line)}\n#gbm-magazine-page.pm .pm-gg li[data-g]{border-left-color:var(--pm-line)!important}\n#gbm-magazine-page.pm .pm-gg li:last-child:nth-child(odd){grid-column:1 / -1}\n}\n#gbm-magazine-page.pm .pm-gg li[data-g=\"F\"]{border-left-color:var(--pm-orange);border-top-color:var(--pm-orange)}\n#gbm-magazine-page.pm .pm-gg li[data-g=\"F\"] .pm-gl{background:var(--pm-orange);color:#fff}\n#gbm-magazine-page.pm .pm-gg li[data-g=\"D\"]{border-left-color:#ff9b73;border-top-color:#ff9b73}\n#gbm-magazine-page.pm .pm-gg li[data-g=\"D\"] .pm-gl{background:#ffe1d3;color:#9a2e08}\n#gbm-magazine-page.pm .pm-gg li[data-g=\"C\"]{border-left-color:#9aa6c4;border-top-color:#9aa6c4}\n#gbm-magazine-page.pm .pm-gg li[data-g=\"B\"],#gbm-magazine-page.pm .pm-gg li[data-g=\"A\"]{border-left-color:var(--pm-blue);border-top-color:var(--pm-blue)}\n#gbm-magazine-page.pm .pm-gg li[data-g=\"B\"] .pm-gl,#gbm-magazine-page.pm .pm-gg li[data-g=\"A\"] .pm-gl{background:var(--pm-blue);color:#fff}\n#gbm-magazine-page.pm .pm-quotes{padding:44px 0 36px;background:#fff}\n#gbm-magazine-page.pm .pm-qw{display:grid;gap:12px}\n#gbm-magazine-page.pm .pm-q{margin:0;padding:22px 20px 20px;background:var(--pm-blue);color:#fff}\n#gbm-magazine-page.pm .pm-q blockquote{margin:0;padding:0;border:0}\n#gbm-magazine-page.pm .pm-q blockquote p{font:700 clamp(24px,7vw,34px)/1.12 var(--mz-cond);letter-spacing:-.005em;color:inherit}\n#gbm-magazine-page.pm .pm-q blockquote p::before{content:\"\\201C\";display:block;height:.62em;font:800 2.4em/1 var(--mz-cond);color:var(--pm-orange)}\n#gbm-magazine-page.pm .pm-q blockquote p::after{content:\"\\201D\"}\n#gbm-magazine-page.pm .pm-q figcaption{margin-top:16px;font:500 14px/1.4 var(--mz-sans);color:var(--pm-on-blue)}\n#gbm-magazine-page.pm .pm-q figcaption span{display:block}\n#gbm-magazine-page.pm .pm-q figcaption b{display:block;font:800 19px/1.2 var(--mz-cond);color:#fff}\n#gbm-magazine-page.pm .pm-q figcaption a{display:inline-flex;align-items:center;min-height:44px;margin-top:4px;font:700 17px/1 var(--mz-cond);color:#fff;border-bottom:2px solid var(--pm-orange)}\n#gbm-magazine-page.pm .pm-q1{background:var(--pm-navy)}\n#gbm-magazine-page.pm .pm-q2{background:var(--pm-orange);color:var(--pm-navy)}\n#gbm-magazine-page.pm .pm-q2 blockquote p::before{color:#fff}\n#gbm-magazine-page.pm .pm-q2 figcaption,#gbm-magazine-page.pm .pm-q2 figcaption b{color:var(--pm-navy)}\n#gbm-magazine-page.pm .pm-q a:focus-visible{outline-color:#fff}\n#gbm-magazine-page.pm .pm-pack{padding:44px 0 30px;background:#fff;border-top:6px solid var(--pm-ink)}\n#gbm-magazine-page.pm .pm-list{display:grid;gap:0}\n#gbm-magazine-page.pm .pm-it{border-bottom:1px solid var(--pm-line)}\n#gbm-magazine-page.pm .pm-it a{display:grid;grid-template-columns:40px minmax(0,1fr);gap:4px 12px;padding:18px 0;color:inherit}\n#gbm-magazine-page.pm .pm-it.pm-has-img a{grid-template-columns:40px minmax(0,1fr) 88px}\n#gbm-magazine-page.pm .pm-n{font:800 34px/.9 var(--mz-cond);color:var(--pm-orange)}\n#gbm-magazine-page.pm .pm-it-b{display:block;min-width:0}\n#gbm-magazine-page.pm .pm-it .pm-kick{display:block;margin-bottom:5px}\n#gbm-magazine-page.pm .pm-it h3{font-size:clamp(21px,6vw,27px);line-height:1.08;color:var(--pm-ink)}\n#gbm-magazine-page.pm .pm-it a:hover h3{color:var(--pm-blue);text-decoration:underline;text-decoration-color:var(--pm-orange);text-decoration-thickness:3px;text-underline-offset:4px}\n#gbm-magazine-page.pm .pm-it-d{display:block;margin-top:6px;font:400 16px/1.45 var(--mz-sans);color:#33405e}\n#gbm-magazine-page.pm .pm-it-r{display:block;margin-top:6px;font:600 13px/1.3 var(--mz-sans);color:var(--pm-mute)}\n#gbm-magazine-page.pm .pm-thumb{display:block;min-width:0}\n#gbm-magazine-page.pm .pm-it-cr{display:block;margin-top:3px;font:500 12px/1.35 var(--mz-sans);color:var(--pm-mute)}\n#gbm-magazine-page.pm .pm-lead{border-bottom:0}\n#gbm-magazine-page.pm .pm-lead a{padding:20px 16px;margin:0 calc(var(--mz-pad) * -1);background:var(--pm-paper);border-left:6px solid var(--pm-orange)}\n#gbm-magazine-page.pm .pm-lead h3{font-size:clamp(28px,8.4vw,40px);line-height:1}\n#gbm-magazine-page.pm .pm-next{padding:40px 0 40px;background:var(--pm-paper)}\n#gbm-magazine-page.pm .pm-next-grid{display:grid;gap:22px}\n#gbm-magazine-page.pm .pm-game h2{font-size:clamp(38px,11vw,64px);line-height:.96;color:var(--pm-ink)}\n#gbm-magazine-page.pm .pm-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}\n#gbm-magazine-page.pm .pm-meta li{padding:7px 12px;background:#fff;border:1px solid var(--pm-line);font:700 16px/1.1 var(--mz-cond);color:var(--pm-ink)}\n#gbm-magazine-page.pm .pm-meta li:first-child{background:var(--pm-blue);border-color:var(--pm-blue);color:#fff}\n#gbm-magazine-page.pm .pm-pick{margin-top:20px;padding:16px;background:#fff;border:2px dashed var(--pm-orange)}\n#gbm-magazine-page.pm .pm-badge{display:inline-block;padding:4px 8px;background:var(--pm-orange);font:800 13px/1 var(--mz-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--pm-navy)}\n#gbm-magazine-page.pm .pm-pick h3{margin-top:10px;font-size:26px;line-height:1.05;color:var(--pm-ink)}\n#gbm-magazine-page.pm .pm-pick p{margin-top:6px;font:500 16px/1.45 var(--mz-sans);color:#33405e}\nhtml #gbm-magazine-page.pm .gbc{margin:0;padding:16px 16px 14px;border-radius:6px;border-top-width:5px;align-self:start}\nhtml #gbm-magazine-page.pm .gbc .gbc-k{color:var(--pm-orange-lt)!important}\nhtml #gbm-magazine-page.pm .gbc .gbc-h{font-size:26px;color:#fff!important}\nhtml #gbm-magazine-page.pm .gbc .gbc-v{font-size:15px;margin-bottom:10px;color:var(--pm-on-blue)!important}\nhtml #gbm-magazine-page.pm .gbc .gbc-c,html #gbm-magazine-page.pm .gbc .gbc-c span{font-size:14px;color:#fff!important}\nhtml #gbm-magazine-page.pm .gbc .gbc-p{color:var(--pm-on-blue-2)!important}\nhtml #gbm-magazine-page.pm .gbc .gbc-m{color:#fff!important}\nhtml #gbm-magazine-page.pm .gbc a{color:#fff!important}\nhtml #gbm-magazine-page.pm .gbc .gbc-b{font-size:19px;padding:0 14px}\nhtml #gbm-magazine-page.pm .gbc input[type=email]{flex:1 1 140px}\nhtml #gbm-magazine-page.pm .gbc input[type=email]{color:var(--pm-ink)!important;background:#fff!important}\n#gbm-magazine-page.pm .pm-foot{padding:30px 0 40px;background:var(--pm-navy);color:#fff}\n#gbm-magazine-page.pm .pm-foot .pm-kick{color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-foot ul{display:flex;flex-wrap:wrap;gap:4px 18px}\n#gbm-magazine-page.pm .pm-foot li a{display:inline-flex;align-items:center;min-height:44px;font:700 18px/1 var(--mz-cond);color:#fff;border-bottom:2px solid var(--pm-orange)}\n#gbm-magazine-page.pm .pm-foot .pm-src{margin-top:18px;color:var(--pm-on-blue-2);max-width:760px}\n#gbm-magazine-page.pm .pm-top{display:inline-flex;align-items:center;min-height:44px;margin-top:8px;font:700 16px/1 var(--mz-cond);color:var(--pm-orange-lt)}\n#gbm-magazine-page.pm .pm-foot a:focus-visible{outline-color:var(--pm-orange-lt)}\n@media (min-width:700px){\n#gbm-magazine-page.mz26.pm{--mz-pad:28px}\n#gbm-magazine-page.pm .pm-cover-type{margin:-64px 40px 0;padding:24px 28px 0}\n#gbm-magazine-page.pm .pm-lines{margin:24px 40px 0}\n#gbm-magazine-page.pm .pm-stats{grid-template-columns:repeat(3,minmax(0,1fr))}\n#gbm-magazine-page.pm .pm-stats li:last-child:nth-child(odd){grid-column:auto}\n#gbm-magazine-page.pm .pm-qw{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-magazine-page.pm .pm-q0{grid-column:1 / -1}\n#gbm-magazine-page.pm .pm-q0 blockquote p{font-size:44px}\n#gbm-magazine-page.pm .pm-it.pm-has-img a{grid-template-columns:52px minmax(0,1fr) 200px}\n#gbm-magazine-page.pm .pm-it a{grid-template-columns:52px minmax(0,1fr);gap:4px 20px}\n#gbm-magazine-page.pm .pm-n{font-size:44px}\n#gbm-magazine-page.pm .pm-lead a{margin:0;padding:24px 24px}\n#gbm-magazine-page.pm .pm-plot{padding:20px 18px 12px 52px}\n}\n@media (min-width:1000px){\n#gbm-magazine-page.pm .pm-mast{padding:16px 0 22px}\n#gbm-magazine-page.pm .pm-mast .pm-in{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:\"top top\" \"plate issue\";align-items:end;gap:0 40px}\n#gbm-magazine-page.pm .pm-mast-top{grid-area:top}\n#gbm-magazine-page.pm .pm-plate{grid-area:plate;max-width:700px}\n#gbm-magazine-page.pm .pm-issue{grid-area:issue;flex-direction:column;align-items:flex-end;margin:0 0 6px;text-align:right}\n#gbm-magazine-page.pm .pm-issue b{font-size:24px;padding:7px 14px}\n#gbm-magazine-page.pm .pm-cover{padding:36px 0 44px}\n#gbm-magazine-page.pm .pm-cover-in{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);grid-template-areas:\"fig type\" \"lines type\";gap:0 44px;align-items:start}\n#gbm-magazine-page.pm .pm-cover-fig{grid-area:fig;margin:0}\n#gbm-magazine-page.pm .pm-cover-type{grid-area:type;margin:0;padding:18px 0 0}\n#gbm-magazine-page.pm .pm-lines{grid-area:lines;margin:22px 0 0}\n#gbm-magazine-page.pm .pm-lines ul{display:grid;grid-template-columns:1fr 1fr;column-gap:24px}\n#gbm-magazine-page.pm .pm-cover-type h1{font-size:clamp(56px,5.6vw,80px)}\n#gbm-magazine-page.pm .pm-final .pm-in{display:grid;grid-template-columns:auto minmax(0,640px) minmax(0,1fr);align-items:end;gap:0 32px}\n#gbm-magazine-page.pm .pm-final-l{margin:0 0 14px}\n#gbm-magazine-page.pm .pm-final-m{flex-direction:column;align-items:flex-end;margin:0 0 8px;text-align:right}\n#gbm-magazine-page.pm .pm-damage .pm-in{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:10px 56px;align-items:start}\n#gbm-magazine-page.pm .pm-damage .pm-sh,#gbm-magazine-page.pm .pm-yards,#gbm-magazine-page.pm .pm-cmp{grid-column:1}\n#gbm-magazine-page.pm .pm-stats{grid-column:2;grid-row:1 / span 4}\n#gbm-magazine-page.pm .pm-foot-row{grid-column:1 / -1}\n#gbm-magazine-page.pm .pm-cmp{margin-top:6px}\n#gbm-magazine-page.pm .pm-flow .pm-in{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:0 48px;align-items:start}\n#gbm-magazine-page.pm .pm-flow .pm-chart{grid-column:2;grid-row:1 / span 2}\n#gbm-magazine-page.pm .pm-flow .pm-more{grid-column:1;grid-row:2;align-self:start}\n#gbm-magazine-page.pm .pm-gg{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}\n#gbm-magazine-page.pm .pm-gg li:last-child:nth-child(odd){grid-column:auto}\n#gbm-magazine-page.pm .pm-qw{grid-template-columns:repeat(3,minmax(0,1fr))}\n#gbm-magazine-page.pm .pm-q0{grid-column:1 / span 2;grid-row:1 / span 2}\n#gbm-magazine-page.pm .pm-q0 blockquote p{font-size:56px}\n#gbm-magazine-page.pm .pm-list{grid-template-columns:1fr 1fr;column-gap:48px}\n#gbm-magazine-page.pm .pm-lead{grid-column:1 / -1}\n#gbm-magazine-page.pm .pm-lead h3{font-size:48px}\n#gbm-magazine-page.pm .pm-it.pm-has-img a{grid-template-columns:52px minmax(0,1fr) 150px}\n#gbm-magazine-page.pm .pm-next-grid{grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px;align-items:start}\n}\n@media (prefers-reduced-motion:reduce){#gbm-magazine-page.pm *{transition:none!important;animation:none!important;scroll-behavior:auto!important}}\n@media print{\nhtml:has(#gbm-magazine-page.pm) #SITE_FOOTER,html:has(#gbm-magazine-page.pm) #gbm-footer,#gbm-magazine-page.pm .pm-toc,#gbm-magazine-page.pm .gbc{display:none!important}\n#gbm-magazine-page.pm *{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n}";
  var ISSUE = {"id":"2026-10-04-postgame-missouri","layout":"postgame","issue":{"number":"Postgame edition","date":"Sunday, October 4, 2026","week":"Week 5 · Florida at Missouri","home":"GatorBait Media","pageTitle":"GatorBait Magazine | Postgame: Missouri 45, Florida 17"},"cover":{"kicker":"Cover story · Buddy Martin","headline":"Hey Missouri, don’t show me anymore!","dek":"The Tigers did not just beat Florida. They drove over it, backed up, drove over it again and then threw a couple touchdown passes just to make sure nobody mistook the afternoon for a competitive football game.","byline":"By Buddy Martin · 6 min read","cta":"Read Buddy’s column","url":"/post/hey-missouri-don-t-show-me-anymore","image":{"id":"ae876a_a58dcb57990a497b84bcd2b5fab12df3","ext":"jpeg","width":2000,"height":1333,"alt":"Florida’s Emmanuel Oyebadejo (99) gets to Missouri quarterback Austin Simmons","credit":"UAA Photo"},"linesLabel":"Also inside","lines":["The damage: 560 yards to 325","Report card: three Fs","How a 10-10 game got away","Sumrall: “Starts with me”"]},"final":{"label":"Final","teams":[{"rank":"No. 25","name":"Missouri","score":45,"won":true},{"rank":"No. 8","name":"Florida","score":17}],"meta":["Saturday, Oct. 3","Faurot Field, Columbia, Mo.","Florida is 4-1, 2-1 SEC"]},"contents":{"label":"In this issue","items":[{"id":"damage","label":"The damage"},{"id":"flow","label":"Game flow"},{"id":"grades","label":"Report card"},{"id":"quotes","label":"In their words"},{"id":"package","label":"The package"},{"id":"next","label":"Up next"}]},"damage":{"kicker":"By the numbers","title":"The damage","dek":"Florida came in scoring 53.5 points and gaining 532.8 yards a game. Missouri held the Gators to 17 and 325, and ran for 220 of its own.","yards":{"label":"Total yards","rows":[{"name":"Missouri","value":560},{"name":"Florida","value":325,"us":true}]},"stats":[{"value":"42","label":"Florida rushing yards","detail":"25 carries, 1.7 a carry"},{"value":"211","label":"Jamal Roberts rushing yards","detail":"24 carries, 3 touchdowns"},{"value":"340","label":"Austin Simmons passing yards","detail":"23 of 30, 2 touchdowns"},{"value":"35","label":"Straight Missouri points","detail":"After a 10-10 tie"},{"value":"13","label":"Jadan Baugh rushing yards","detail":"12 carries"}],"compare":{"label":"Coming in vs. Saturday","beforeLabel":"Per game, first four","afterLabel":"At Missouri","rows":[{"label":"Points","before":"53.5","after":"17"},{"label":"Total yards","before":"532.8","after":"325"}]},"more":{"label":"By the Numbers: the full breakdown","url":"/post/by-the-numbers-how-missouri-flipped-florida-s-script"},"source":"Box score: ESPN."},"flow":{"kicker":"Game flow","title":"How the win slipped away","dek":"Florida’s chance to win, play by play. The Gators peaked at 80% in the first quarter and were level at 10-10 late in the second. Missouri scored the next 35.","axis":["100%","50%","0%"],"quarters":["Q1","Q2","Q3","Q4"],"quarterStarts":[1,44,90,129],"points":[70.1,71.4,72.2,73.3,72.3,70.5,75.7,73.8,75.1,77.1,78.5,77.3,77.3,80,79.4,78.1,73.7,73.8,73.7,73.4,72.7,72,70.7,71.8,70.1,69.2,65.2,65.5,67.4,70.7,69.7,69.9,71.5,70.5,69,66.8,68.1,66,67.4,68.9,70.7,71.1,70.3,70.3,67.1,65.8,66.3,64.6,66.3,65.4,62.8,63.2,61.1,48.5,47.9,47.2,47.4,43,37.2,37.9,39.6,43.4,47.6,47.1,50.9,52.8,56.8,55.4,55.8,63.5,64.3,63,62.2,56.6,57.5,42.8,43.1,42.5,41.2,39.3,39.2,41,40,41.2,40.7,40.7,39,37,37.1,33.9,28.2,29.4,31.1,22,23.2,14.7,12.1,11.5,9.7,8.8,12.7,11.6,10.5,9.2,7.4,7.9,8.8,8.2,5.4,5.5,6,5,4.1,4.1,4.5,6,3.3,3.6,4,3.7,4.6,3.7,2.4,1.6,1.6,2.1,0.3,0.3,0.3,0.1,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0,0.1,0,0],"marks":[{"i":13,"title":"80%","note":"Florida’s high point, 9:52 left in the first quarter"},{"i":69,"title":"10-10","note":"Philo to Wilson ties it with 4:26 left in the half"},{"i":75,"title":"17-10","note":"Simmons to Goodie Sr.; Missouri leads the rest of the way"},{"i":136,"title":"45-10","note":"Roberts goes 80 yards with 13:33 to play"}],"summary":"Line chart of Florida’s win probability against Missouri. It starts near 70%, peaks at 80% in the first quarter, dips below 50% in the second, climbs back to 64% at 10-10, falls to about 12% early in the third quarter and sits near zero through the fourth.","source":"Win probability: ESPN. GatorBait Media graphic.","more":{"label":"Drink Mix: how Missouri’s blueprint bottled up the Gators","url":"/post/drink-mix-how-missouri-s-blueprint-bottled-up-the-gators"}},"grades":{"kicker":"Report card","title":"Red ink in Columbia","dek":"Three Fs, and only one grade above a C.","items":[{"unit":"Quarterbacks","grade":"C-"},{"unit":"Running backs","grade":"D","note":"Baugh: 12 carries, 13 yards"},{"unit":"Offensive line","grade":"F","note":"42 rushing yards on 25 carries"},{"unit":"Receivers and tight ends","grade":"B-"},{"unit":"Defensive line","grade":"F","note":"Roberts ran for 211"},{"unit":"Linebackers","grade":"D-","note":"Missouri ran for 220"},{"unit":"Secondary","grade":"F","note":"Simmons: 23 of 30, 340 yards"},{"unit":"Special teams","grade":"C"},{"unit":"Coaching","grade":"D","note":"“Starts with the coaching, starts with me.”"}],"more":{"label":"Every grade, with the reasons","url":"/post/red-ink-in-columbia-grading-every-gator-unit-after-missouri"}},"quotes":{"kicker":"In their words","title":"Nobody ducked it","items":[{"text":"Embarrassing performance in every phase. Starts with the coaching, starts with me.","who":"Jon Sumrall","role":"Florida coach, postgame news conference","url":"/post/we-earned-the-loss-sumrall-owns-the-mauling-in-columbia","link":"Sumrall owns it"},{"text":"I take full accountability. I didn’t play my best game at all. Nobody did.","who":"Myles Graham","role":"Florida, to the Orlando Sentinel"},{"text":"…tough teams stop the run, run the ball, and cover kicks.","who":"Eli Drinkwitz","role":"Missouri coach, postgame news conference"}]},"package":{"kicker":"Read the package","title":"Seven stories from Columbia","dek":"Buddy Martin leads. Each story opens on its one home at gatorbaitmedia.com.","items":[{"rubric":"Cover story","author":"Buddy Martin","title":"Hey Missouri, don’t show me anymore!","dek":"The Tigers did not just beat Florida. They drove over it, backed up and drove over it again.","read":"6 min read","url":"/post/hey-missouri-don-t-show-me-anymore","lead":true},{"rubric":"The coach","author":"GatorBait Staff","title":"‘We earned the loss’: Sumrall owns the mauling in Columbia","dek":"Jon Sumrall said Missouri deserved it after a 45-17 rout ended Florida’s unbeaten start. The numbers, who was missing and what comes next.","read":"3 min read","url":"/post/we-earned-the-loss-sumrall-owns-the-mauling-in-columbia","image":{"id":"d3cfa5_fb8dcc167ff64b5c90cc1b6904390bf7","ext":"jpg","width":1600,"height":900,"alt":"Jon Sumrall quote card: We earned the loss. Missouri 45, Florida 17.","credit":"GatorBait Media graphic"}},{"rubric":"Report card","author":"GatorBait Staff","title":"Red ink in Columbia: Grading every Gator unit after Missouri","dek":"Florida ran for 42 yards and gave up 340 through the air, and few position groups escaped the red pen.","read":"4 min read","url":"/post/red-ink-in-columbia-grading-every-gator-unit-after-missouri","image":{"id":"16b519_fb9b6535ba3046ab86e7d0d05b6579bc","ext":"jpg","width":3000,"height":2000,"alt":"Florida Gators against Ole Miss at Ben Hill Griffin Stadium, Sept. 26, 2026","credit":"File photo by Chris Spears, GatorBait Media"}},{"rubric":"By the Numbers","author":"GatorBait Staff","title":"How Missouri flipped Florida’s script","dek":"Florida had been scoring 53.5 points and gaining 532.8 yards a game. The numbers show where it went wrong.","read":"3 min read","url":"/post/by-the-numbers-how-missouri-flipped-florida-s-script","image":{"id":"16b519_ca805b099f49450bb75c33404d8e4b1b","ext":"jpg","width":3000,"height":2000,"alt":"Florida Gators against Ole Miss at Ben Hill Griffin Stadium, Sept. 26, 2026","credit":"File photo by Chris Spears, GatorBait Media"}},{"rubric":"Drink Mix","author":"GatorBait Staff","title":"How Missouri’s blueprint bottled up the Gators","dek":"Eli Drinkwitz spent all week saying tough teams stop the run. Missouri did it Saturday.","read":"3 min read","url":"/post/drink-mix-how-missouri-s-blueprint-bottled-up-the-gators"},{"rubric":"Game recap","author":"GatorBait Staff","title":"Roberts runs away, Missouri routs Florida 45-17","dek":"Jamal Roberts ran for 211 yards and three touchdowns as No. 25 Missouri scored 35 straight points and handed No. 8 Florida its first loss.","read":"2 min read","url":"/post/roberts-runs-away-with-it-no-25-missouri-routs-no-8-florida-45-17"},{"rubric":"Reality Check","author":"GatorBait Staff","title":"What Florida’s first loss exposed, and the road ahead","dek":"Missouri ran for 220 yards and held Florida to 42. With South Carolina, Texas and Georgia next, here is what the loss exposed.","read":"2 min read","url":"/post/reality-check-what-florida-s-first-loss-exposed-and-the-road-ahead","image":{"id":"16b519_d600f2d12282447eb6ceb6bfb0d988f3","ext":"jpg","width":3000,"height":1910,"alt":"The Florida Gators against Ole Miss, Sept. 26, 2026","credit":"File photo by Chris Spears, GatorBait Media"}}]},"next":{"kicker":"Up next","title":"South Carolina at Florida","meta":["Saturday, Oct. 10","Homecoming","The Swamp, Gainesville","Kickoff TBA"],"note":"Then Texas in Austin on Oct. 17. Florida has six days to make sure South Carolina can’t do what Missouri did.","pickem":{"badge":"Coming this week","title":"GatorBait Pick ’Em","text":"Call South Carolina at Florida before kickoff. Pick ’Em opens on GatorBait this week."}},"reference":{"label":"More GatorBait","links":[{"label":"Schedule and results","url":"/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#schedule"},{"label":"Roster","url":"/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#roster"},{"label":"The Buddy Martin Show","url":"/the-buddy-martin-show"},{"label":"GatorBait home","url":"/"}],"top":"Back to the cover"},"asOf":"Score, box score and win probability: ESPN (event 401856708). Quotes: postgame news conferences and the Orlando Sentinel. Issue closed Oct. 4, 2026."};
  var BUILD = "c8425bc2";
  var CREDITS = {"d3cfa5_56a64986c874417c9a8299fae22649ed":"Photo by Chris Spears, GatorBait Media · Faulkner: UAA","d3cfa5_d3190d83cdfc44549b10b6bd025e57a3":"Photo by Chris Spears, GatorBait Media","d3cfa5_2ea58f38e2da4c988ab73065cfe63130":"Photo by Chris Spears, GatorBait Media","d3cfa5_026d2a4d2be04a91b8c32317fed5f623":"Photo by Chris Spears, GatorBait Media","d3cfa5_1043f4b7772245baa5aed5f80c21669a":"Photo by Chris Spears, GatorBait Media","d3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b":"Photo by Chris Spears, GatorBait Media","16b519_a0e407bedc46487ca71033fc8351d0fe":"Photo by Chris Spears, GatorBait Media","d3cfa5_e1f06a6dd4ca414885aafdaf6db6ec35":"Photo: Hannah White / UAA Communications"};
/* GatorBait Capture 2026: "Get GatorBait Magazine free" signup for story pages and the homepage hub.
 * One component, four placements, each tagged with its source:
 *   home           the hub module the Front Page renderer paints (front-page.js calls GBM_CAPTURE.html('home'));
 *   story-inline   mid-article, after the 4th prose paragraph (stories with 6+ prose paragraphs only);
 *   story-end      folded into the Story Kit's "Keep up with the Gators" block;
 *   story-slideup  a small bar that slides up on /post/ pages after 50% scroll or 45 s.
 * Where a signup goes: the site's existing Wix form "GatorBait Email List" (6babfee8-...), which already holds the
 * email field, the unchecked CONTACTS_SUBSCRIBE consent box with DOUBLE_CONFIRMATION, and the user automation that
 * adds the list's audience labels. The browser mints an anonymous visitor token from the site's headless OAuth
 * client (POST https://www.wixapis.com/oauth2/token, grantType "anonymous"; a client ID is public, no secret) and
 * calls Wix Forms' Create Submission (POST /form-submission-service/v4/submissions) as that visitor. Wix then sends
 * its own confirmation email; nobody is subscribed until they click it. Evidence: deploy/capture-2026/README.md.
 * Consent: the checkbox starts unchecked and nothing is sent until the reader checks it; the submission carries
 * subscribe_gatorbait: true only because the reader said yes. A hidden honeypot drops bot fills without a request.
 * Source tagging: every submission tries to carry signup_source (home | story-inline | story-end | story-slideup).
 * Until that hidden field exists on the form, Wix rejects the key as UNKNOWN_VALUE_ERROR and the module resends
 * once without it (and remembers that for the page view). A "gbm:capture" DOM event and a dataLayer push (when a
 * dataLayer exists) record source and outcome either way.
 * Memory (localStorage, every access in try/catch): gbm-capture-joined (signed up here: no slide-up, no story cards,
 * the home module shows its thank-you line) and gbm-capture-dismissed (slide-up closed: quiet for 14 days).
 * The slide-up never covers the Share sheet (#gbm-share.on): it sits below it and steps aside while the sheet is open.
 * Test hooks: window.__GBM_CAPTURE_CFG__ {clientId, formId, sourceField, delayMs} overrides the defaults;
 * window.GBM_CAPTURE exposes {version, html(source), mountStory(ctx), state()}. Nothing here edits a Wix page. */
(function () {
  'use strict';
  if (window.GBM_CAPTURE) return;
  var VERSION = 'capture-2026.1';
  var SITE = 'https://www.gatorbaitmedia.com';
  var API = 'https://www.wixapis.com';
  var seed = window.__GBM_CAPTURE_CFG__ || {};
  var CFG = {
    clientId: seed.clientId || '1565816d-bbbc-45c1-b82a-31f10d3e2c71', // headless OAuth client on site 18fb3a4e (public ID)
    formId: seed.formId || '6babfee8-147f-428a-9e14-6b72f6225835', // "GatorBait Email List", double opt-in
    emailField: 'email_gatorbait', consentField: 'subscribe_gatorbait',
    sourceField: seed.sourceField === undefined ? 'signup_source' : seed.sourceField,
    delayMs: Number(seed.delayMs) > 0 ? Number(seed.delayMs) : 45000,
    quietDays: 14,
  };
  var PRIVACY = SITE + '/policies';
  var K_JOINED = 'gbm-capture-joined', K_DISMISSED = 'gbm-capture-dismissed', K_TOKEN = 'gbm-capture-token';
  function now() { return Date.now(); } // real clock on purpose: the 45 s timer and the 14-day memory follow the reader, not a test's pinned date
  function get(store, k) { try { return window[store].getItem(k); } catch (_) { return null; } }
  function put(store, k, v) { try { window[store].setItem(k, v); } catch (_) {} }
  function joined() { return !!get('localStorage', K_JOINED); }
  function quiet() { var t = Number(get('localStorage', K_DISMISSED)); return Number.isFinite(t) && t > 0 && now() - t < CFG.quietDays * 864e5; }
  function onPost() { return String(location.pathname).indexOf('/post/') === 0; }

  // Barlow only; navy #0021a5, orange #fa4616. The :is(#gbm-live,html) prefix carries an id's weight so the homepage's
  // #gbm-live.fp26 heading and link rules never restyle the card, and it still matches on story pages.
  var P = ':is(#gbm-live,html) ';
  var CSS = [
    P + '.gbc{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;contain:inline-size;margin:24px 0;padding:18px 16px 16px;border-radius:12px;background:#0021a5;color:#fff;text-align:left;direction:ltr;font:500 16px/1.4 "Barlow",sans-serif;border-top:6px solid #fa4616}',
    P + '.gbc *{box-sizing:border-box}' + P + '.gbc input,' + P + '.gbc button{font-family:"Barlow",sans-serif}',
    P + '.gbc .gbc-k{display:block;margin:0 0 6px;padding:0;border:0;font:800 12px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#ffb27a}',
    P + '.gbc .gbc-h{margin:0 0 6px;padding:0;border:0;font:800 26px/1.05 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.01em;text-transform:none;color:#fff;overflow-wrap:break-word}',
    P + '.gbc .gbc-v{margin:0 0 12px;padding:0;font:500 16px/1.4 "Barlow",sans-serif;color:#e8ecf8}',
    P + '.gbc form{margin:0;padding:0}',
    P + '.gbc .gbc-l{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    P + '.gbc .gbc-row{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}',
    P + '.gbc input[type=email]{flex:1 1 180px;min-width:0;width:100%;height:48px;margin:0;padding:0 12px;border:2px solid #fff;border-radius:8px;background:#fff;color:#0b1a44;font:500 17px/1 "Barlow",sans-serif}',
    P + '.gbc input[type=email]:focus{outline:3px solid #fa4616;outline-offset:1px}',
    P + '.gbc .gbc-b{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin:0;padding:0 18px;border:0;border-radius:8px;background:#fa4616;color:#fff;font:800 17px/1 "Barlow Condensed","Barlow",sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap}',
    P + '.gbc .gbc-b:hover,' + P + '.gbc .gbc-b:focus-visible{background:#fff;color:#0021a5;outline:2px solid #fa4616;outline-offset:2px}',
    P + '.gbc .gbc-b[disabled]{opacity:.7;cursor:progress}',
    P + '.gbc .gbc-c{display:flex;align-items:flex-start;gap:10px;min-height:44px;margin:0 0 6px;padding:2px 0;font:500 15px/1.35 "Barlow",sans-serif;color:#fff;cursor:pointer}',
    P + '.gbc .gbc-c input{flex:0 0 auto;width:22px;height:22px;margin:0;accent-color:#fa4616;cursor:pointer}',
    P + '.gbc .gbc-p{margin:0;padding:0;font:500 13px/1.4 "Barlow",sans-serif;color:#c9d3ee}',
    P + '.gbc a,' + P + '.gbc a:visited{color:#fff;text-decoration:underline;text-decoration-color:#fa4616;text-underline-offset:2px}',
    P + '.gbc .gbc-m{margin:8px 0 0;padding:0;font:700 15px/1.35 "Barlow",sans-serif;color:#fff}.gbc .gbc-m:empty{display:none}',
    P + '.gbc .gbc-m[data-tone=err]{color:#ffd2c2}',
    P + '.gbc .gbc-hp{display:none}',
    P + '.gbc[data-state=done] .gbc-f>:not(.gbc-m){display:none}' + P + '.gbc[data-state=done] .gbc-m{margin:0;font:700 17px/1.35 "Barlow",sans-serif}',
    P + '.gbc.gbc-joined{padding:14px 16px}' + P + '.gbc.gbc-joined .gbc-h{font-size:22px;margin:0}',
    // Homepage hub: right under the show on phones, a full row under it on tablets, and on desktop the old email
    // module's slot (last in the grid, columns 10-12 beside the Magazine), so no other module moves.
    '#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{margin:0;border-radius:0}',
    '@media(min-width:600px){#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{grid-column:1/-1}}',
    '@media(min-width:821px){#gbm-live.fp26 .fp-hub-grid>.fp-mod-capture{grid-column:10/13;order:1}}',
    // Slide-up bar: fixed, transform-only (no layout shift), under the Share sheet's layers (9998/9999).
    '#gbc-bar{position:fixed;left:0;right:0;bottom:0;z-index:9990;display:flex;justify-content:center;padding:0 8px calc(8px + env(safe-area-inset-bottom));pointer-events:none;transform:translateY(110%);transition:transform .3s ease;visibility:hidden}',
    '#gbc-bar.on{transform:none;visibility:visible}#gbc-bar.aside{transform:translateY(110%);visibility:hidden}',
    '#gbc-bar .gbc{pointer-events:auto;position:relative;max-width:560px;margin:0;padding:12px 12px 10px;border-top-width:4px;box-shadow:0 -6px 24px rgba(3,8,24,.35)}',
    '#gbc-bar .gbc .gbc-k{display:none}#gbc-bar .gbc .gbc-h{font-size:22px;margin:0 0 2px;padding-right:44px}#gbc-bar .gbc .gbc-v{font-size:14px;margin:0 0 8px;padding-right:44px}',
    '#gbc-bar .gbc .gbc-row{flex-wrap:nowrap;margin:0 0 6px}#gbc-bar .gbc input[type=email]{flex:1 1 120px;height:44px}#gbc-bar .gbc .gbc-b{min-height:44px;padding:0 14px;font-size:16px}',
    '#gbc-bar .gbc .gbc-c{font-size:14px;margin:0 0 2px;min-height:40px}#gbc-bar .gbc .gbc-c input{width:20px;height:20px}#gbc-bar .gbc .gbc-p{font-size:12px}',
    '#gbc-bar .gbc-x{position:absolute;top:4px;right:4px;width:44px;height:44px;margin:0;padding:0;border:0;border-radius:8px;background:transparent;color:#fff;font:700 26px/1 "Barlow",sans-serif;cursor:pointer}',
    '#gbc-bar .gbc-x:focus-visible,#gbc-bar .gbc-x:hover{outline:2px solid #fa4616;background:rgba(255,255,255,.12)}',
    '@media(prefers-reduced-motion:reduce){#gbc-bar{transition:none}}',
  ].join('');
  function css() {
    if (document.getElementById('gbm-capture-css')) return;
    var s = document.createElement('style'); s.id = 'gbm-capture-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- The component ---------- */
  var COPY = {
    kicker: 'Free · GatorBait Magazine',
    head: 'Get GatorBait Magazine free',
    value: "Buddy Martin's columns, the game-week package and Chris Spears' photos in your inbox. One email a day at most.",
    consent: 'Yes, email me GatorBait Magazine and GatorBait Media news about the Florida Gators. I can unsubscribe anytime.',
    fine: "We'll email you a link to confirm.",
    button: 'Sign up free',
    sending: 'Signing you up…',
    done: 'Almost done: check your inbox for an email from GatorBait Media and tap the link to confirm.',
    badEmail: 'Enter a valid email address.',
    noConsent: 'Check the box to say yes to GatorBait emails.',
    failed: "That didn't go through. Try again in a minute.",
    joined: "You're on the GatorBait Magazine list",
    joinedLine: 'Thanks for reading. Watch your inbox for the next issue.',
  };
  var SOURCES = { home: 1, 'story-inline': 1, 'story-end': 1, 'story-slideup': 1 };
  function html(source, opts) {
    css();
    source = SOURCES[source] ? source : 'home';
    var home = source === 'home', tag = home ? 'section' : 'aside', o = opts || {};
    var cls = 'gbc' + (home ? ' fp-mod-capture' : '') + (o.extra ? ' ' + o.extra : '');
    var attrs = ' data-gbm-capture="' + source + '"' + (home ? '' : ' data-story-kit="capture"') + ' aria-label="GatorBait Magazine signup"';
    if (home && joined()) return '<' + tag + ' class="' + cls + ' gbc-joined"' + attrs + ' data-state="joined"><p class="gbc-k">' + COPY.kicker + '</p><h2 class="gbc-h">' + COPY.joined + '</h2><p class="gbc-v" style="margin:6px 0 0">' + COPY.joinedLine + '</p></' + tag + '>';
    var id = 'gbc-' + source;
    return '<' + tag + ' class="' + cls + '"' + attrs + ' data-state="ready">' + (o.close ? '<button type="button" class="gbc-x" aria-label="Close">×</button>' : '') +
      '<p class="gbc-k">' + COPY.kicker + '</p><' + (home ? 'h2' : 'h3') + ' class="gbc-h">' + COPY.head + '</' + (home ? 'h2' : 'h3') + '>' +
      '<p class="gbc-v">' + (o.short ? 'Buddy Martin, the game-week package, Chris Spears’ photos. One email a day at most.' : COPY.value) + '</p>' +
      '<form class="gbc-f" novalidate><label class="gbc-l" for="' + id + '-e">Email address</label>' +
      '<div class="gbc-row"><input type="email" id="' + id + '-e" name="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" placeholder="you@example.com" required><button class="gbc-b" type="submit">' + COPY.button + '</button></div>' +
      '<label class="gbc-c"><input type="checkbox" name="consent" value="yes"><span>' + COPY.consent + '</span></label>' +
      '<div class="gbc-hp" aria-hidden="true"><label>Company<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>' +
      '<p class="gbc-p">' + COPY.fine + ' <a href="' + PRIVACY + '">Privacy policy</a></p>' +
      '<p class="gbc-m" role="status" aria-live="polite"></p></form></' + tag + '>';
  }
  function node(source, opts) { var t = document.createElement('div'); t.innerHTML = html(source, opts); return t.firstChild; }

  /* ---------- Submitting: visitor token, then Create Submission ---------- */
  var sourceFieldOk = true, busy = false;
  function token() {
    try { var c = JSON.parse(get('sessionStorage', K_TOKEN) || 'null'); if (c && c.t && c.x > Date.now() + 60000) return Promise.resolve(c.t); } catch (_) {}
    return fetch(API + '/oauth2/token', { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: CFG.clientId, grantType: 'anonymous' }) })
      .then(function (r) { if (!r.ok) throw new Error('token ' + r.status); return r.json(); })
      .then(function (j) { if (!j || !j.access_token) throw new Error('token'); put('sessionStorage', K_TOKEN, JSON.stringify({ t: j.access_token, x: Date.now() + (Number(j.expires_in) || 14400) * 1000 })); return j.access_token; });
  }
  function submitOnce(tok, email, source, withSource) {
    var values = {}; values[CFG.emailField] = email; values[CFG.consentField] = true;
    if (withSource && CFG.sourceField) values[CFG.sourceField] = source;
    return fetch(API + '/form-submission-service/v4/submissions', { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json', Authorization: tok }, body: JSON.stringify({ submission: { formId: CFG.formId, submissions: values } }) })
      .then(function (r) { return r.text().then(function (t) { return { ok: r.ok, status: r.status, text: t }; }); });
  }
  function submit(email, source) {
    return token().then(function (tok) {
      var tagged = sourceFieldOk && !!CFG.sourceField;
      return submitOnce(tok, email, source, tagged).then(function (res) {
        // The form has no signup_source field yet: Wix names the stray key; resend once without it.
        if (!res.ok && tagged && /UNKNOWN_VALUE_ERROR|signup_source/.test(res.text) && res.status < 500) { sourceFieldOk = false; return submitOnce(tok, email, source, false).then(function (r2) { r2.tagged = false; return r2; }); }
        if (!res.ok && res.status === 401) { put('sessionStorage', K_TOKEN, ''); }
        res.tagged = tagged; return res;
      });
    });
  }
  function report(source, outcome, tagged) {
    var detail = { source: source, outcome: outcome, tagged: !!tagged, version: VERSION };
    try { document.dispatchEvent(new CustomEvent('gbm:capture', { detail: detail })); } catch (_) {}
    try { if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'gbm_capture', gbm_capture_source: source, gbm_capture_outcome: outcome }); } catch (_) {}
  }
  // Probe (never creates a contact): a page opened with ?gbm_capture=probe mints a visitor token and sends an empty
  // submission (no email, no consent). Wix validates only after CORS and the token pass, so a 400 here proves the
  // path works end to end without a contact. The result lands on <html data-gbm-capture-probe> for live shots.
  if (/[?&]gbm_capture=probe(&|$)/.test(location.search)) {
    token().then(function (tok) {
      return fetch(API + '/form-submission-service/v4/submissions', { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json', Authorization: tok }, body: JSON.stringify({ submission: { formId: CFG.formId, submissions: {} } }) })
        .then(function (r) { return r.text().then(function (t) { return { token: true, status: r.status, text: t.slice(0, 220) }; }); });
    }).catch(function (e) { return { token: false, error: String(e).slice(0, 140) }; })
      .then(function (res) { document.documentElement.setAttribute('data-gbm-capture-probe', JSON.stringify(res)); });
  }
  function say(box, text, tone) { var m = box.querySelector('.gbc-m'); if (m) { m.textContent = text; if (tone) m.setAttribute('data-tone', tone); else m.removeAttribute('data-tone'); } }
  function onSubmit(ev) {
    var form = ev.target, box = form && form.closest && form.closest('[data-gbm-capture]');
    if (!box || !form.classList.contains('gbc-f')) return;
    ev.preventDefault();
    if (busy || box.getAttribute('data-state') === 'done') return;
    var source = box.getAttribute('data-gbm-capture'), email = String(form.email.value || '').trim(), hp = form.company && form.company.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) { say(box, COPY.badEmail, 'err'); form.email.focus(); return; }
    if (!form.consent.checked) { say(box, COPY.noConsent, 'err'); form.consent.focus(); return; }
    if (hp) { box.setAttribute('data-state', 'done'); say(box, COPY.done); return; } // bot fill: no request
    busy = true; box.setAttribute('data-state', 'sending'); say(box, COPY.sending);
    var btn = form.querySelector('.gbc-b'); if (btn) btn.disabled = true;
    submit(email, source).then(function (res) {
      busy = false; if (btn) btn.disabled = false;
      if (!res.ok) throw new Error('submission ' + res.status);
      put('localStorage', K_JOINED, String(now()));
      box.setAttribute('data-state', 'done'); say(box, COPY.done);
      report(source, 'submitted', res.tagged);
      if (box.closest('#gbc-bar')) setTimeout(function () { hideBar(false); }, 6000); else hideBar(false);
      // Other story cards on the page step back once the reader is signed up (the one that took the email stays).
      [].slice.call(document.querySelectorAll('[data-gbm-capture]')).forEach(function (o) { if (o !== box && o.getAttribute('data-gbm-capture') !== 'home' && !o.closest('#gbc-bar')) o.hidden = true; });
    }).catch(function () {
      busy = false; if (btn) btn.disabled = false;
      box.setAttribute('data-state', 'ready'); say(box, COPY.failed, 'err');
      report(source, 'failed', false);
    });
  }

  /* ---------- Story pages: inline card after the 4th prose paragraph, and inside "Keep up with the Gators" ---------- */
  function prose(ps) {
    return ps.filter(function (p) {
      var t = String(p.textContent || '').replace(/\s+/g, ' ').trim();
      return t.length > 60 && !p.closest('blockquote,figure,figcaption,[data-story-kit]') && !/^(By\s+[A-Z]|[—–-]\s)/.test(t);
    });
  }
  // Insert without moving what the reader sees: if the anchor is above the viewport, pay the new height back.
  function insertQuiet(anchor, el) {
    var above = anchor.getBoundingClientRect().bottom < 0;
    anchor.insertAdjacentElement('afterend', el);
    if (above) { var h = el.getBoundingClientRect().height + 48; if (h > 0) scrollBy(0, h); }
  }
  function mountStory(ctx) {
    if (!onPost() || joined() || !ctx || !ctx.body) return;
    css();
    if (!document.querySelector('[data-gbm-capture="story-inline"]')) {
      var ps = prose(ctx.paras || []);
      if (ps.length >= 6) {
        var a = ps[3];
        if (a.parentNode && a.parentNode !== ctx.body && a.parentNode.children.length === 1) a = a.parentNode;
        insertQuiet(a, node('story-inline'));
      }
    }
    var more = ctx.more || document.querySelector('[data-story-kit="more"]');
    if (more && !more.querySelector('[data-gbm-capture="story-end"]')) more.appendChild(node('story-end', { extra: 'gbc-end' }));
    watchBar();
  }

  /* ---------- Slide-up bar (story pages) ---------- */
  var t0 = now(), barShown = false, barTimer = 0;
  function shareOpen() { var s = document.getElementById('gbm-share'); return !!(s && s.classList.contains('on')); }
  function cardInView() {
    return [].slice.call(document.querySelectorAll('[data-gbm-capture="story-inline"],[data-gbm-capture="story-end"]')).some(function (c) {
      var b = c.getBoundingClientRect(); return !c.hidden && b.height && b.bottom > 0 && b.top < innerHeight;
    }) || (document.activeElement && document.activeElement.closest && !!document.activeElement.closest('[data-gbm-capture]:not(#gbc-bar *)'));
  }
  function scrolled() { var h = document.documentElement.scrollHeight - innerHeight; return h > 0 && scrollY / h >= 0.5; }
  function bar() { return document.getElementById('gbc-bar'); }
  function hideBar(remember) {
    var b = bar(); if (!b) return;
    b.classList.remove('on');
    if (remember) put('localStorage', K_DISMISSED, String(now()));
  }
  function showBar() {
    if (barShown) return; barShown = true; css();
    var b = document.createElement('div'); b.id = 'gbc-bar';
    b.innerHTML = html('story-slideup', { close: true, short: true });
    document.body.appendChild(b);
    b.querySelector('.gbc-x').addEventListener('click', function () { hideBar(true); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (!shareOpen()) b.classList.add('on'); }); });
    report('story-slideup', 'shown', false);
  }
  function tick() {
    if (!onPost()) return;
    var b = bar();
    // Once up, the bar steps aside for the Share sheet and while a signup card is on screen (never two forms in view).
    if (b) { var inBar = document.activeElement && b.contains(document.activeElement); b.classList.toggle('aside', shareOpen() || (!inBar && cardInView())); if (!b.isConnected) document.body.appendChild(b); return; }
    if (barShown || joined() || quiet() || shareOpen() || cardInView()) return;
    if (scrolled() || now() - t0 >= CFG.delayMs) showBar();
  }
  function watchBar() {
    if (barTimer) return;
    barTimer = setInterval(tick, 1000);
    addEventListener('scroll', function () { tick(); }, { passive: true });
    document.addEventListener('keydown', function (e) { var b = bar(); if (e.key === 'Escape' && b && b.classList.contains('on') && !b.classList.contains('aside') && !shareOpen()) hideBar(true); });
  }

  document.addEventListener('submit', onSubmit, true);
  window.GBM_CAPTURE = {
    version: VERSION, html: html, mountStory: mountStory,
    state: function () { return { joined: joined(), quiet: quiet(), barShown: barShown, sourceFieldOk: sourceFieldOk, cfg: { clientId: CFG.clientId, formId: CFG.formId, sourceField: CFG.sourceField, delayMs: CFG.delayMs } }; },
  };
  if (onPost()) watchBar();
})();

;  /* Runtime for GatorBait Magazine 2026: the weekly web issue on /magazine. CSS, ISSUE and BUILD are injected by
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
    if (D && D.layout === 'postgame' && typeof renderPostgame === 'function') return renderPostgame(D); // src/magazine-postgame.js, postgame bundle only
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
    var m = document.createElement('main'); m.id = 'gbm-magazine-page'; m.className = 'mz26' + (D.layout === 'pregame' ? ' pg' : D.layout === 'postgame' ? ' pm' : '');
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
      '<div class="pg-plate"><span class="pg-wm" role="img" aria-label="GatorBait">Gator<em>Bait</em></span><span class="pg-plate-mz">Magazine</span></div>' +
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
    return fetch('https://site.web.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups=8&dates=' + ymd, { signal: c ? c.signal : undefined, credentials: 'omit', cache: 'no-store' })
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

  /* ================= Postgame layout (issue.layout === 'postgame') =================
   * Same contract as the weekly and pregame layouts: sports-live/magazine-issue-postgame.json holds every word and
   * number; this file only lays them out, and a missing or empty block renders nothing. Helpers (esc, text, num, list,
   * obj, safeUrl, media, frame) come from src/magazine.js. Bundled only into sports-live/magazine-postgame.js
   * (MAG_VARIANT=postgame), together with src/capture.js for the signup. No timers, no feed swap: the lead is curated
   * (Buddy Martin) and stays put; nothing animates. */
  function pmHead(id, D) {
    var k = text(D.kicker, 60), t = text(D.title, 120), d = text(D.dek, 400);
    return t ? '<header class="pm-sh">' + (k ? '<p class="pm-kick">' + esc(k) + '</p>' : '') + '<h2 id="pm-' + id + '-t">' + esc(t) + '</h2>' + (d ? '<p class="pm-dek">' + esc(d) + '</p>' : '') + '</header>' : '';
  }
  function pmMore(m, cls) {
    m = obj(m); var u = m && safeUrl(m.url), l = m && text(m.label, 120);
    return u && l ? '<a class="pm-more' + (cls ? ' ' + cls : '') + '" href="' + esc(u) + '">' + esc(l) + ' <span aria-hidden="true">→</span></a>' : '';
  }
  function pmSrc(s) { s = text(s, 240); return s ? '<p class="pm-src">' + esc(s) + '</p>' : ''; }

  function pmMast(D) {
    var I = obj(D.issue) || {};
    return '<header class="pm-mast"><div class="pm-in"><div class="pm-mast-top"><a class="pm-home" href="/">' + esc(text(I.home, 60) || 'GatorBait Media') + '</a><span>' + esc(text(I.date, 60)) + '</span></div>' +
      '<p class="pm-plate"><span class="pm-wm">Gator<em>Bait</em></span><span class="pm-mz">Magazine</span></p>' +
      '<p class="pm-issue"><b>' + esc(text(I.number, 60)) + '</b><span>' + esc(text(I.week, 120)) + '</span></p></div></header>';
  }
  function pmCover(D) {
    var C = obj(D.cover); if (!C) return '';
    var hl = text(C.headline, 200), url = safeUrl(C.url); if (!hl || !url) return '';
    var fig = frame(C.image, { eager: true, main: 1600, sizes: '(max-width: 999px) 100vw, 58vw' });
    var lines = list(C.lines, 6).map(function (l) { return text(l, 80); }).filter(Boolean);
    return '<section class="pm-cover" id="pm-cover" aria-labelledby="pm-cover-h"><div class="pm-in pm-cover-in">' +
      (fig ? '<figure class="pm-cover-fig"><a href="' + esc(url) + '" tabindex="-1" aria-hidden="true">' + fig + '</a>' + (C.image && text(C.image.credit, 120) ? '<figcaption>' + esc(text(C.image.credit, 120)) + '</figcaption>' : '') + '</figure>' : '') +
      '<div class="pm-cover-type">' + (text(C.kicker, 80) ? '<p class="pm-kick">' + esc(text(C.kicker, 80)) + '</p>' : '') +
      '<h1 id="pm-cover-h"><a href="' + esc(url) + '">' + esc(hl) + '</a></h1>' +
      (text(C.dek, 600) ? '<p class="pm-cover-dek">' + esc(text(C.dek, 600)) + '</p>' : '') +
      (text(C.byline, 80) ? '<p class="pm-by">' + esc(text(C.byline, 80)) + '</p>' : '') +
      '<a class="pm-btn" href="' + esc(url) + '">' + esc(text(C.cta, 60) || hl) + ' <span aria-hidden="true">→</span></a></div>' +
      (lines.length ? '<div class="pm-lines">' + (text(C.linesLabel, 40) ? '<p>' + esc(text(C.linesLabel, 40)) + '</p>' : '') + '<ul>' + lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' : '') +
      '</div></section>';
  }
  function pmFinal(D) {
    var F = obj(D.final), teams = F ? list(F.teams, 2).map(obj).filter(function (t) { return t && text(t.name, 30) && num(t.score) !== null; }) : [];
    if (teams.length < 2) return '';
    var meta = list(F.meta, 4).map(function (m) { return text(m, 60); }).filter(Boolean);
    var label = text(F.label, 20);
    return '<section class="pm-final" aria-label="' + esc(label + ': ' + teams.map(function (t) { return t.name + ' ' + t.score; }).join(', ')) + '"><div class="pm-in">' +
      (label ? '<p class="pm-final-l" aria-hidden="true">' + esc(label) + '</p>' : '') + '<div class="pm-sc" aria-hidden="true">' + teams.map(function (t) {
        return '<p class="pm-team' + (t.won ? ' pm-won' : '') + '"><span>' + (text(t.rank, 12) ? '<small>' + esc(text(t.rank, 12)) + '</small>' : '') + esc(text(t.name, 30)) + '</span><b>' + t.score + '</b></p>';
      }).join('') + '</div>' + (meta.length ? '<p class="pm-final-m">' + meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</p>' : '') + '</div></section>';
  }
  function pmContents(D) {
    var C = obj(D.contents), items = C ? list(C.items, 8).map(obj).filter(function (i) { return i && /^[a-z]+$/.test(text(i.id, 20)) && text(i.label, 40) && obj(D[i.id]); }) : [];
    if (!items.length) return '';
    return '<nav class="pm-toc" aria-label="' + esc(text(C.label, 40) || 'Contents') + '"><div class="pm-in">' + (text(C.label, 40) ? '<p class="pm-kick">' + esc(text(C.label, 40)) + '</p>' : '') + '<ol>' + items.map(function (i, n) {
      return '<li><a href="#pm-' + i.id + '"><b aria-hidden="true">' + (n + 1) + '</b>' + esc(text(i.label, 40)) + '</a></li>';
    }).join('') + '</ol></div></nav>';
  }
  function pmDamage(D) {
    var M = obj(D.damage); if (!M) return '';
    var Y = obj(M.yards), rows = Y ? list(Y.rows, 2).map(obj).filter(function (r) { return r && text(r.name, 30) && num(r.value) !== null; }) : [];
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1]));
    var stats = list(M.stats, 8).map(obj).filter(function (s) { return s && text(s.value, 12) && text(s.label, 60); });
    var Cm = obj(M.compare), cr = Cm ? list(Cm.rows, 4).map(obj).filter(function (r) { return r && text(r.label, 30) && text(r.before, 12) && text(r.after, 12); }) : [];
    return '<section class="pm-damage" id="pm-damage" aria-labelledby="pm-damage-t"><div class="pm-in">' + pmHead('damage', M) +
      (rows.length ? '<div class="pm-yards"><p class="pm-yl">' + esc(text(Y.label, 40)) + '</p>' + rows.map(function (r) {
        return '<div class="pm-yr' + (r.us ? ' pm-us' : '') + '"><span class="pm-yn">' + esc(text(r.name, 30)) + '</span><span class="pm-yb"><i style="width:' + (Math.round(r.value / max * 1000) / 10) + '%"></i></span><b>' + r.value + '</b></div>';
      }).join('') + '</div>' : '') +
      (stats.length ? '<ul class="pm-stats">' + stats.map(function (s) {
        return '<li><b>' + esc(text(s.value, 12)) + '</b><span>' + esc(text(s.label, 60)) + '</span>' + (text(s.detail, 80) ? '<small>' + esc(text(s.detail, 80)) + '</small>' : '') + '</li>';
      }).join('') + '</ul>' : '') +
      (cr.length ? '<div class="pm-cmp"><p class="pm-yl">' + esc(text(Cm.label, 60)) + '</p><table><thead><tr><td></td><th scope="col">' + esc(text(Cm.beforeLabel, 40)) + '</th><th scope="col">' + esc(text(Cm.afterLabel, 40)) + '</th></tr></thead><tbody>' + cr.map(function (r) {
        return '<tr><th scope="row">' + esc(text(r.label, 30)) + '</th><td>' + esc(text(r.before, 12)) + '</td><td class="pm-after">' + esc(text(r.after, 12)) + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '') +
      '<div class="pm-foot-row">' + pmMore(M.more, 'pm-more-lt') + pmSrc(M.source) + '</div></div></section>';
  }
  function pmFlow(D) {
    var F = obj(D.flow), pts = F ? list(F.points, 600).filter(function (v) { return num(v) !== null && v >= 0 && v <= 100; }) : [];
    if (pts.length < 2 || pts.length !== list(F.points, 600).length) return '';
    var n = pts.length - 1;
    function X(i) { return Math.round(i / n * 10000) / 10; } // viewBox 0..1000
    function Y(v) { return Math.round((100 - v) * 40) / 10; } // viewBox 0..400
    var line = pts.map(function (v, i) { return (i ? 'L' : 'M') + X(i) + ',' + Y(v); }).join('');
    var area = line + 'L1000,200L0,200Z';
    var qs = list(F.quarterStarts, 4).filter(function (q) { return num(q) !== null && q >= 0 && q <= n; });
    var ql = list(F.quarters, 4).map(function (q) { return text(q, 6); });
    var grid = [0, 100, 300, 400].map(function (y) { return '<line x1="0" x2="1000" y1="' + y + '" y2="' + y + '" class="pm-gl"/>'; }).join('') + '<line x1="0" x2="1000" y1="200" y2="200" class="pm-g50"/>' +
      qs.slice(1).map(function (q) { return '<line x1="' + X(q) + '" x2="' + X(q) + '" y1="0" y2="400" class="pm-gl"/>'; }).join('');
    var marks = list(F.marks, 6).map(obj).filter(function (m) { return m && num(m.i) !== null && m.i >= 0 && m.i <= n && text(m.title, 20); });
    var axis = list(F.axis, 3).map(function (a) { return text(a, 8); });
    var svg = '<svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><clipPath id="pm-clip-up"><rect x="0" y="0" width="1000" height="200"/></clipPath><clipPath id="pm-clip-dn"><rect x="0" y="200" width="1000" height="200"/></clipPath></defs>' + grid +
      '<path d="' + area + '" class="pm-up" clip-path="url(#pm-clip-up)"/><path d="' + area + '" class="pm-dn" clip-path="url(#pm-clip-dn)"/><path d="' + line + '" class="pm-ln" vector-effect="non-scaling-stroke"/></svg>';
    var plot = '<div class="pm-plot" role="img" aria-label="' + esc(text(F.summary, 600)) + '"><div class="pm-area">' + svg +
      axis.map(function (a, k) { return a ? '<span class="pm-ax" style="top:' + (k * 50) + '%" aria-hidden="true">' + esc(a) + '</span>' : ''; }).join('') +
      marks.map(function (m, k) { return '<span class="pm-mk" style="left:' + (X(m.i) / 10) + '%;top:' + (Y(pts[m.i]) / 4) + '%" aria-hidden="true">' + (k + 1) + '</span>'; }).join('') + '</div>' +
      (qs.length === ql.length && ql.length ? '<div class="pm-qx" aria-hidden="true">' + qs.map(function (q, k) { var end = k + 1 < qs.length ? qs[k + 1] : n; return '<span style="left:' + ((X(q) + X(end)) / 20) + '%">' + esc(ql[k]) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    return '<section class="pm-flow" id="pm-flow" aria-labelledby="pm-flow-t"><div class="pm-in">' + pmHead('flow', F) + '<figure class="pm-chart">' + plot +
      (marks.length ? '<ol class="pm-key">' + marks.map(function (m) { return '<li><b>' + esc(text(m.title, 20)) + '</b> ' + esc(text(m.note, 160)) + '</li>'; }).join('') + '</ol>' : '') +
      (text(F.source, 200) ? '<figcaption class="pm-src">' + esc(text(F.source, 200)) + '</figcaption>' : '') + '</figure>' + pmMore(F.more) + '</div></section>';
  }
  function pmGrades(D) {
    var G = obj(D.grades), items = G ? list(G.items, 12).map(obj).filter(function (g) { return g && text(g.unit, 40) && /^[A-F][+-]?$/.test(text(g.grade, 2)); }) : [];
    if (!items.length) return '';
    return '<section class="pm-grades" id="pm-grades" aria-labelledby="pm-grades-t"><div class="pm-in">' + pmHead('grades', G) + '<ul class="pm-gg">' + items.map(function (g) {
      var gr = text(g.grade, 2);
      return '<li data-g="' + gr.charAt(0) + '"><span class="pm-gu">' + esc(text(g.unit, 40)) + '</span><b class="pm-gl" aria-label="Grade ' + esc(gr.replace('-', ' minus').replace('+', ' plus')) + '">' + esc(gr.replace('-', '−')) + '</b>' + (text(g.note, 100) ? '<small>' + esc(text(g.note, 100)) + '</small>' : '') + '</li>';
    }).join('') + '</ul>' + pmMore(G.more) + '</div></section>';
  }
  function pmQuotes(D) {
    var Q = obj(D.quotes), items = Q ? list(Q.items, 6).map(obj).filter(function (q) { return q && text(q.text, 400) && text(q.who, 60); }) : [];
    if (!items.length) return '';
    return '<section class="pm-quotes" id="pm-quotes" aria-labelledby="pm-quotes-t"><div class="pm-in">' + pmHead('quotes', Q) + '<div class="pm-qw">' + items.map(function (q, k) {
      var u = safeUrl(q.url);
      return '<figure class="pm-q pm-q' + k + '"><blockquote><p>' + esc(text(q.text, 400)) + '</p></blockquote><figcaption><b>' + esc(text(q.who, 60)) + '</b>' + (text(q.role, 120) ? '<span>' + esc(text(q.role, 120)) + '</span>' : '') +
        (u && text(q.link, 60) ? '<a href="' + esc(u) + '">' + esc(text(q.link, 60)) + ' <span aria-hidden="true">→</span></a>' : '') + '</figcaption></figure>';
    }).join('') + '</div></div></section>';
  }
  function pmPackage(D) {
    var P = obj(D.package), items = P ? list(P.items, 12).map(obj).filter(function (s) { return s && safeUrl(s.url) && text(s.title, 200); }) : [];
    if (!items.length) return '';
    return '<section class="pm-pack" id="pm-package" aria-labelledby="pm-package-t"><div class="pm-in">' + pmHead('package', P) + '<ol class="pm-list">' + items.map(function (s, k) {
      var fig = s.image ? frame(s.image, { main: 480, sizes: '(max-width: 699px) 112px, 200px' }) : '';
      return '<li class="pm-it' + (s.lead ? ' pm-lead' : '') + (fig ? ' pm-has-img' : '') + '"><a href="' + esc(safeUrl(s.url)) + '"><span class="pm-n" aria-hidden="true">' + (k < 9 ? '0' : '') + (k + 1) + '</span><span class="pm-it-b"><span class="pm-kick">' + esc([text(s.rubric, 40), text(s.author, 60)].filter(Boolean).join(' · ')) + '</span>' +
        '<h3>' + esc(text(s.title, 200)) + '</h3>' + (text(s.dek, 400) ? '<span class="pm-it-d">' + esc(text(s.dek, 400)) + '</span>' : '') + (text(s.read, 30) ? '<span class="pm-it-r">' + esc(text(s.read, 30)) + '</span>' : '') + (fig && text(s.image.credit, 120) ? '<span class="pm-it-cr">Image: ' + esc(text(s.image.credit, 120)) + '</span>' : '') + '</span>' +
        (fig ? '<span class="pm-thumb">' + fig + '</span>' : '') + '</a></li>';
    }).join('') + '</ol></div></section>';
  }
  function pmSignup() {
    // The site's existing signup (src/capture.js, form "GatorBait Email List", double opt-in). Tagged source "magazine"
    // so a Magazine signup is not counted as a homepage one; capture.js submits whatever data-gbm-capture says.
    var C = window.GBM_CAPTURE; if (!C || typeof C.html !== 'function') return '';
    var h = ''; try { h = String(C.html('home', { short: true, extra: 'pm-cap' }) || ''); } catch (_) { return ''; }
    return h.replace('data-gbm-capture="home"', 'data-gbm-capture="magazine"').replace(' fp-mod-capture', '');
  }
  function pmNext(D) {
    var N = obj(D.next); if (!N || !text(N.title, 120)) return '';
    var meta = list(N.meta, 6).map(function (m) { return text(m, 60); }).filter(Boolean), P = obj(N.pickem);
    return '<section class="pm-next" id="pm-next" aria-labelledby="pm-next-t"><div class="pm-in"><div class="pm-next-grid"><div class="pm-game">' + (text(N.kicker, 40) ? '<p class="pm-kick">' + esc(text(N.kicker, 40)) + '</p>' : '') +
      '<h2 id="pm-next-t">' + esc(text(N.title, 120)) + '</h2>' + (meta.length ? '<ul class="pm-meta">' + meta.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '') +
      (text(N.note, 300) ? '<p class="pm-dek">' + esc(text(N.note, 300)) + '</p>' : '') +
      (P && text(P.title, 60) ? '<div class="pm-pick"><span class="pm-badge">' + esc(text(P.badge, 40)) + '</span><h3>' + esc(text(P.title, 60)) + '</h3><p>' + esc(text(P.text, 300)) + '</p></div>' : '') +
      '</div>' + pmSignup() + '</div></div></section>';
  }
  function pmFoot(D) {
    var R = obj(D.reference), links = R ? list(R.links, 6).map(obj).filter(function (l) { return l && safeUrl(l.url) && text(l.label, 40); }) : [];
    return '<footer class="pm-foot"><div class="pm-in">' + (links.length ? '<nav aria-label="' + esc(text(R.label, 40) || 'More') + '"><p class="pm-kick">' + esc(text(R.label, 40)) + '</p><ul>' + links.map(function (l) { return '<li><a href="' + esc(safeUrl(l.url)) + '">' + esc(text(l.label, 40)) + '</a></li>'; }).join('') + '</ul></nav>' : '') +
      pmSrc(D.asOf) + (R && text(R.top, 40) ? '<a class="pm-top" href="#pm-cover">' + esc(text(R.top, 40)) + ' <span aria-hidden="true">↑</span></a>' : '') + '</div></footer>';
  }
  function renderPostgame(D) {
    return '<div class="pm-wrap">' + pmMast(D) + pmCover(D) + pmFinal(D) + pmContents(D) + pmDamage(D) + pmFlow(D) + pmGrades(D) + pmQuotes(D) + pmPackage(D) + pmNext(D) + pmFoot(D) + '</div>';
  }
})();
