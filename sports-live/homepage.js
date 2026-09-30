/* GatorBait Front Page 2026: magazine front page, broadcast layer, Swamp Night palette, hub.
 * BUILT FILE: edit sports-live/src/front-page.{css,js} or sports-live/front-page.config.json,
 * then run: node sports-live/build-front-page.mjs
 * Bundled story snapshot: 2026-09-29T20:19:43Z (fallback only; live stories come from /blog-feed.xml).
 */
(function () {
  'use strict';
  var CSS = "html:has(#gbm-live.gbm-gazette) #SITE_HEADER,\nhtml:has(#gbm-live.gbm-gazette) #SITE_PAGES,\nhtml:has(#gbm-live.gbm-gazette) #PAGES_CONTAINER{display:none!important}\nhtml:has(#gbm-live.gbm-gazette),html:has(#gbm-live.gbm-gazette) body{height:auto!important;min-height:100vh!important}\nhtml:has(#gbm-live.gbm-gazette) body{margin:0!important;background:#f7f4ee!important;min-width:0!important}\nhtml:has(#gbm-live.fp-night) body{background:#07122e!important}\nhtml:has(#gbm-live.gbm-gazette) #SITE_CONTAINER,\nhtml:has(#gbm-live.gbm-gazette) #masterPage,\nhtml:has(#gbm-live.gbm-gazette) #SITE_PAGES_TRANSITION_GROUP{min-height:0!important;height:0!important;min-width:0!important;padding-block:0!important;margin-block:0!important}\nhtml:has(#gbm-live.gbm-gazette) #gbm-mobile-drawer-root{overflow:hidden}\nhtml:has(#gbm-live.gbm-gazette) #gbm-footer{position:relative;z-index:3;background:#08132f!important}\nhtml:has(#gbm-live.gbm-gazette) #gbm-footer a{color:#fff!important}\n#gbm-live.fp26{\n--fp-paper:#f7f4ee;--fp-surface:#fffdf9;--fp-hub:#ece6da;--fp-ink:#111629;--fp-ink-2:#454d5e;--fp-rule:#c9c5bb;--fp-rule-strong:#111629;\n--fp-link:#0021a5;--fp-mast:#0021a5;--fp-mast-ink:#fff;--fp-band:#07122e;--fp-band-ink:#fff;--fp-card:#fffdf9;--fp-chip:#e4ddcf;\n--fp-navy:#0021a5;--fp-orange:#fa4616;--fp-cond:\"Barlow Condensed\",\"Barlow\",sans-serif;--fp-sans:\"Barlow\",sans-serif;\n--fp-pad:16px;\ndisplay:block;position:relative;z-index:2;width:100%;min-width:0;overflow-x:clip;\nbackground:var(--fp-paper);color:var(--fp-ink);font-family:var(--fp-sans);font-size:16px;line-height:1.5;\ntext-size-adjust:100%;-webkit-text-size-adjust:100%\n}\n#gbm-live.fp26.fp-night{\n--fp-paper:#07122e;--fp-surface:#0b1d4a;--fp-hub:#0b1d4a;--fp-ink:#f3f5fa;--fp-ink-2:#b9c4dc;--fp-rule:#26386b;--fp-rule-strong:#9fb0d8;\n--fp-link:#a9bbff;--fp-mast:#0b1d4a;--fp-band:#040b1f;--fp-card:#0e2257;--fp-chip:#16295e\n}\n#gbm-live.fp26 *,#gbm-live.fp26 *::before,#gbm-live.fp26 *::after{box-sizing:border-box}\n#gbm-live.fp26 a{color:inherit;text-decoration:none}\n#gbm-live.fp26 a:focus-visible,#gbm-live.fp26 button:focus-visible{outline:3px solid var(--fp-orange);outline-offset:3px}\n@media(hover:hover) and (pointer:fine){#gbm-live.fp26 a:hover .fp-hl,#gbm-live.fp26 a.fp-hl:hover{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}}\n#gbm-live.fp26 h1,#gbm-live.fp26 h2,#gbm-live.fp26 h3,#gbm-live.fp26 h4,#gbm-live.fp26 p,#gbm-live.fp26 figure,#gbm-live.fp26 blockquote,#gbm-live.fp26 ul,#gbm-live.fp26 ol{margin:0;padding:0}\n#gbm-live.fp26 ul,#gbm-live.fp26 ol{list-style:none}\n#gbm-live.fp26 img{display:block;max-width:100%;width:100%;height:auto}\n#gbm-live.fp26 h1,#gbm-live.fp26 h2,#gbm-live.fp26 h3,#gbm-live.fp26 h4{font-family:var(--fp-cond);font-weight:800;letter-spacing:-.005em;overflow-wrap:break-word;text-wrap:balance}\n#gbm-live.fp26 .fp-wrap{width:100%;max-width:1440px;margin:0 auto;padding-inline:var(--fp-pad)}\n#gbm-live.fp26 .fp-skip{position:absolute;left:-10000px;top:0}\n#gbm-live.fp26 .fp-skip:focus{left:16px;top:8px;z-index:20;background:#fff;color:#111629;padding:10px 14px}\n#gbm-live.fp26 .fp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n#gbm-live.fp26 .fp-kick{display:flex;align-items:center;gap:10px;font:700 12px/1.3 var(--fp-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--fp-link)}\n#gbm-live.fp26 .fp-kick::before{content:\"\";flex:0 0 22px;height:2px;background:var(--fp-orange)}\n#gbm-live.fp26 .fp-meta{font:600 12px/1.4 var(--fp-sans);letter-spacing:.02em;color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-cap{font:500 12px/1.4 var(--fp-sans);color:var(--fp-ink-2);display:flex;flex-wrap:wrap;justify-content:space-between;gap:2px 12px;padding-top:6px}\n#gbm-live.fp26 .fp-cap b{font-weight:700;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 16px;background:var(--fp-orange);color:#fff;font:800 15px/1 var(--fp-cond);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}\n#gbm-live.fp26 .fp-btn.fp-ghost{background:transparent;color:var(--fp-ink);box-shadow:inset 0 0 0 2px currentColor}\n#gbm-live.fp26 .fp-more{display:inline-flex;align-items:center;min-height:44px;font:800 14px/1 var(--fp-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--fp-link);border-bottom:2px solid var(--fp-orange)}\n#gbm-live.fp26 .fp-num{font-variant-numeric:tabular-nums}\n#gbm-live.fp26 .fp-ticker{display:flex;align-items:stretch;height:38px;background:var(--fp-band);color:var(--fp-band-ink);font:700 13px/38px var(--fp-cond);letter-spacing:.06em;text-transform:uppercase;overflow:hidden}\n#gbm-live.fp26 .fp-tk-tag{flex:0 0 auto;display:flex;align-items:center;padding:0 12px;background:var(--fp-orange);color:#fff;font-weight:800;letter-spacing:.14em}\n#gbm-live.fp26 .fp-tk-view{position:relative;flex:1 1 auto;min-width:0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent)}\n#gbm-live.fp26 .fp-tk-track{display:flex;width:max-content}\n#gbm-live.fp26 .fp-tk-list{display:flex;flex:0 0 auto;padding-left:16px}\n#gbm-live.fp26 .fp-tk-list li{display:flex;align-items:center;white-space:nowrap;padding-right:28px}\n#gbm-live.fp26 .fp-tk-list li::after{content:\"\";width:5px;height:5px;margin-left:28px;background:var(--fp-orange);transform:rotate(45deg)}\n#gbm-live.fp26 .fp-tk-list b{color:#ffb08f;margin-right:8px}\n#gbm-live.fp26 .fp-tk-list a{display:inline-block;max-width:70vw;overflow:hidden;text-overflow:ellipsis}\n#gbm-live.fp26 .fp-mast{background:var(--fp-mast);color:var(--fp-mast-ink);position:relative;overflow:hidden}\n#gbm-live.fp26 .fp-mast .fp-wrap{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:6px 16px;padding-top:14px;padding-bottom:12px}\n#gbm-live.fp26 .fp-date{grid-column:1/-1;display:flex;justify-content:space-between;gap:12px;font:700 11px/1.3 var(--fp-cond);letter-spacing:.16em;text-transform:uppercase;color:#dfe5ff}\n#gbm-live.fp26 .fp-wordmark{display:flex;align-items:baseline;gap:10px;min-width:0;color:#fff;font:800 clamp(40px,13vw,68px)/.86 var(--fp-cond);letter-spacing:-.01em;text-transform:uppercase}\n#gbm-live.fp26 .fp-wordmark small{font:700 11px/1 var(--fp-sans);letter-spacing:.34em;color:#c9d3ff}\n#gbm-live.fp26 .fp-mast-right{display:flex;align-items:center;gap:14px;padding-bottom:4px}\n#gbm-live.fp26 .fp-signin{display:none;font:700 13px/1 var(--fp-cond);letter-spacing:.1em;text-transform:uppercase;color:#fff;min-height:44px;align-items:center}\n#gbm-live.fp26 .fp-mast .fp-btn{min-height:40px;padding:0 12px;font-size:14px}\n#gbm-live.fp26 .fp-cta-long{display:none}\n#gbm-live.fp26 .fp-nav{background:var(--fp-paper);border-bottom:4px double var(--fp-rule-strong)}\n#gbm-live.fp26 .fp-nav .fp-wrap{display:flex;align-items:center;gap:16px;min-height:52px}\n#gbm-live.fp26 .fp-links{display:none}\n#gbm-live.fp26 .fp-bug{display:flex;align-items:stretch;flex:1 1 auto;min-width:0;margin-inline:calc(var(--fp-pad) * -1);font-family:var(--fp-cond);text-transform:uppercase}\n#gbm-live.fp26 .fp-bug>a{display:flex;align-items:center;gap:8px;min-width:0;min-height:52px;padding:6px 10px}\n#gbm-live.fp26 .fp-bug-last{flex:0 0 auto;background:var(--fp-navy);color:#fff}\n#gbm-live.fp26 .fp-bug-next{flex:1 1 auto;background:var(--fp-surface);color:var(--fp-ink);border-left:4px solid var(--fp-orange);justify-content:space-between}\n#gbm-live.fp26 .fp-bug-tag{font:800 11px/1 var(--fp-cond);letter-spacing:.14em;padding:5px 6px;background:rgba(255,255,255,.14)}\n#gbm-live.fp26 .fp-bug-next .fp-bug-tag{background:var(--fp-orange);color:#fff}\n#gbm-live.fp26 .fp-bug-last .fp-bug-tag[data-state=live]{background:#c8102e}\n#gbm-live.fp26 .fp-bug-team{display:flex;align-items:baseline;gap:5px;font:800 15px/1 var(--fp-cond);letter-spacing:.04em;white-space:nowrap}\n#gbm-live.fp26 .fp-bug-team strong{font-size:22px;font-weight:800;letter-spacing:0}\n#gbm-live.fp26 .fp-bug-team.fp-lose strong{opacity:.7}\n#gbm-live.fp26 .fp-bug-match{min-width:0;font:800 14px/1.1 var(--fp-cond);letter-spacing:.03em}\n#gbm-live.fp26 .fp-bug-match small{display:block;font:600 11px/1.2 var(--fp-cond);letter-spacing:.08em;color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-cd{display:flex;align-items:baseline;gap:1px;font:800 20px/1 var(--fp-cond);font-variant-numeric:tabular-nums;white-space:nowrap}\n#gbm-live.fp26 .fp-cd b{display:inline-block;min-width:.55em;text-align:center;font-weight:800}\n#gbm-live.fp26 .fp-cd i{font-style:normal;font-size:11px;letter-spacing:.06em;color:var(--fp-ink-2);margin:0 4px 0 1px}\n#gbm-live.fp26 .fp-cd .fp-cd-s{display:none}\n#gbm-live.fp26 .fp-board{background:#040b1f;color:#fff;border-bottom:4px solid var(--fp-orange);position:relative;overflow:hidden}\n#gbm-live.fp26 .fp-board::before{content:\"\";position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,rgba(255,255,255,.08) 1px,transparent 1.5px) 0 0/6px 6px;pointer-events:none}\n#gbm-live.fp26 .fp-board .fp-wrap{position:relative;display:grid;gap:12px;padding-block:14px 16px}\n#gbm-live.fp26 .fp-board-top{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;font:700 12px/1.3 var(--fp-cond);letter-spacing:.12em;text-transform:uppercase;color:#c8d3ef}\n#gbm-live.fp26 .fp-pill{background:var(--fp-orange);color:#fff;padding:5px 9px;font-weight:800;letter-spacing:.16em}\n#gbm-live.fp26 .fp-status{padding:4px 9px;border:1px solid rgba(255,255,255,.35);color:#fff;font-weight:800;font-variant-numeric:tabular-nums}\n#gbm-live.fp26 .fp-status[data-state=live]{background:#c8102e;border-color:#c8102e}\n#gbm-live.fp26 .fp-status[data-state=final]{background:#fff;color:#040b1f;border-color:#fff}\n#gbm-live.fp26 .fp-line{width:100%;border-collapse:collapse;font:800 15px/1 var(--fp-cond);font-variant-numeric:tabular-nums;table-layout:fixed}\n#gbm-live.fp26 .fp-line th,#gbm-live.fp26 .fp-line td{padding:8px 2px;text-align:center;border-bottom:1px solid rgba(255,255,255,.12)}\n#gbm-live.fp26 .fp-line thead th{font:700 11px/1 var(--fp-cond);letter-spacing:.12em;color:#9fb0d8}\n#gbm-live.fp26 .fp-line .fp-lt{width:44%;text-align:left}\n#gbm-live.fp26 .fp-line tbody .fp-lt{font-size:20px;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#gbm-live.fp26 .fp-line tbody .fp-lt small{font:600 11px/1 var(--fp-cond);letter-spacing:.06em;color:#9fb0d8;margin-left:6px}\n#gbm-live.fp26 .fp-line .fp-tot{font-size:26px;color:#fff;background:rgba(250,70,22,.16)}\n#gbm-live.fp26 .fp-drive{font:600 14px/1.4 var(--fp-sans);color:#dfe6f7}\n#gbm-live.fp26 .fp-drive b{font:800 12px/1 var(--fp-cond);letter-spacing:.14em;text-transform:uppercase;color:#ffb08f;margin-right:8px}\n#gbm-live.fp26 .fp-board-latest{display:grid;gap:0;border-top:1px solid rgba(255,255,255,.18)}\n#gbm-live.fp26 .fp-board-latest li{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.1);font:500 14px/1.4 var(--fp-sans);color:#e6edf6}\n#gbm-live.fp26 .fp-board-latest b{font:800 12px/1 var(--fp-cond);letter-spacing:.1em;text-transform:uppercase;color:#ffb08f;margin-right:8px}\n#gbm-live.fp26 .fp-board-links{display:flex;flex-wrap:wrap;gap:8px}\n#gbm-live.fp26 .fp-board-links a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;font:800 13px/1 var(--fp-cond);letter-spacing:.08em;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)}\n#gbm-live.fp26 .fp-board-links a:first-child{background:var(--fp-orange);box-shadow:none}\n#gbm-live.fp26 main{display:block;padding-bottom:0}\n#gbm-live.fp26 .fp-lead{position:relative;display:grid;gap:16px;padding-top:18px;isolation:isolate}\n#gbm-live.fp26 #fp-embers{position:absolute;inset:0 calc(var(--fp-pad) * -1);z-index:-1;pointer-events:none;overflow:hidden}\n#gbm-live.fp26 #fp-embers canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}\n#gbm-live.fp26 .fp-night-glow{display:none}\n#gbm-live.fp26.fp-embers-on .fp-night-glow{display:block;position:absolute;right:0;bottom:-10%;width:70%;height:70%;z-index:-2;background:radial-gradient(closest-side,rgba(250,70,22,.28),transparent);pointer-events:none}\n#gbm-live.fp26 .fp-lead-photo{min-width:0}\n#gbm-live.fp26 .fp-frame{position:relative;display:block;overflow:hidden;aspect-ratio:3/2;background:var(--fp-chip)}\n#gbm-live.fp26 .fp-frame img{width:100%;height:100%;object-fit:cover;object-position:50% 30%}\n#gbm-live.fp26 .fp-frame.fp-portrait img{object-fit:contain}\n#gbm-live.fp26 .fp-lead-copy{min-width:0;display:grid;gap:12px;align-content:start}\n#gbm-live.fp26 .fp-lead h1{font-size:clamp(40px,11.5vw,54px);line-height:.94;text-transform:uppercase;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-lead h1[data-len=long]{font-size:clamp(34px,9.6vw,46px)}\n#gbm-live.fp26 .fp-w{display:inline-block}\n@media(max-width:820px){\n#gbm-live.fp26 .fp-lead-copy{display:contents}\n#gbm-live.fp26 .fp-lead-copy>*{order:3}\n#gbm-live.fp26 .fp-lead-copy>.fp-kick,#gbm-live.fp26 .fp-lead-copy>h1{order:1}\n#gbm-live.fp26 .fp-lead-photo{order:2}\n}\n#gbm-live.fp26 .fp-dek{font:700 20px/1.2 var(--fp-cond);color:var(--fp-ink)}\n#gbm-live.fp26 .fp-by{font:700 12px/1.4 var(--fp-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-by span{color:var(--fp-ink-2);font-weight:600;letter-spacing:.06em;margin-left:8px}\n#gbm-live.fp26 .fp-body{font:400 16px/1.6 var(--fp-sans);color:var(--fp-ink)}\n#gbm-live.fp26 .fp-body::first-letter{float:left;font:800 64px/.8 var(--fp-cond);color:var(--fp-navy);padding:6px 8px 0 0}\n#gbm-live.fp26.fp-night .fp-body::first-letter{color:var(--fp-orange)}\n#gbm-live.fp26 .fp-quote{display:grid;gap:10px;margin-top:24px;padding:20px 0;border-block:1px solid var(--fp-rule-strong)}\n#gbm-live.fp26 .fp-quote blockquote{font:800 30px/1.02 var(--fp-cond);text-transform:uppercase;color:var(--fp-navy)}\n#gbm-live.fp26.fp-night .fp-quote blockquote{color:#fff}\n#gbm-live.fp26 .fp-quote blockquote::before{content:\"\\201C\";color:var(--fp-orange)}\n#gbm-live.fp26 .fp-quote blockquote::after{content:\"\\201D\";color:var(--fp-orange)}\n#gbm-live.fp26 .fp-quote cite{font:500 13px/1.45 var(--fp-sans);font-style:normal;color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-quote cite b{display:block;font:800 13px/1.3 var(--fp-cond);letter-spacing:.14em;text-transform:uppercase;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-second{display:grid;gap:24px;padding-block:24px}\n#gbm-live.fp26 .fp-feature{display:grid;gap:10px;align-content:start;min-width:0}\n#gbm-live.fp26 .fp-feature .fp-frame{aspect-ratio:16/10}\n#gbm-live.fp26 .fp-feature h2{font-size:32px;line-height:.98;text-transform:uppercase}\n#gbm-live.fp26 .fp-feature p.fp-ex{font:400 15px/1.55 var(--fp-sans);color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-list{min-width:0;border-top:3px solid var(--fp-rule-strong)}\n#gbm-live.fp26 .fp-list li{border-bottom:1px solid var(--fp-rule)}\n#gbm-live.fp26 .fp-list a{display:grid;gap:6px;padding:14px 0}\n#gbm-live.fp26 .fp-list h3{font-size:22px;line-height:1.02;text-transform:uppercase}\n#gbm-live.fp26 .fp-list p.fp-ex{font:400 14px/1.45 var(--fp-sans);color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-rail{min-width:0}\n#gbm-live.fp26 .fp-rail h2,#gbm-live.fp26 .fp-mod h2{font:800 14px/1 var(--fp-cond);letter-spacing:.2em;text-transform:uppercase;color:var(--fp-ink);padding:12px 0 10px;border-top:3px solid var(--fp-rule-strong)}\n#gbm-live.fp26 .fp-col{display:grid;grid-template-columns:44px minmax(0,1fr);gap:4px 12px;padding:12px 0;border-bottom:1px solid var(--fp-rule)}\n#gbm-live.fp26 .fp-roundel{grid-row:span 2;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:var(--fp-navy);color:#fff;font:800 16px/1 var(--fp-cond);letter-spacing:.04em;box-shadow:0 0 0 2px var(--fp-paper),0 0 0 4px var(--fp-orange)}\n#gbm-live.fp26 .fp-col-name{font:800 14px/1.2 var(--fp-cond);letter-spacing:.12em;text-transform:uppercase;color:var(--fp-ink);align-self:end}\n#gbm-live.fp26 .fp-col-story{font:500 14px/1.35 var(--fp-sans);color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-hub{background:var(--fp-hub);border-top:6px solid var(--fp-navy);padding-block:22px 32px}\n#gbm-live.fp26.fp-night .fp-hub{border-top-color:var(--fp-orange)}\n#gbm-live.fp26 .fp-hub-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 16px;margin-bottom:16px}\n#gbm-live.fp26 .fp-hub-head h2{font:800 40px/.9 var(--fp-cond);text-transform:uppercase;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-hub-head p{font:600 13px/1.4 var(--fp-sans);color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-hub-grid{display:grid;gap:16px}\n#gbm-live.fp26 .fp-mod{min-width:0;background:var(--fp-card);padding:0 16px 16px;display:flex;flex-direction:column;gap:10px}\n#gbm-live.fp26 .fp-mod h2{border-top-color:var(--fp-navy)}\n#gbm-live.fp26.fp-night .fp-mod h2{border-top-color:var(--fp-orange)}\n#gbm-live.fp26 .fp-latest li{border-bottom:1px solid var(--fp-rule)}\n#gbm-live.fp26 .fp-latest a{display:grid;grid-template-columns:52px minmax(0,1fr);gap:10px;padding:10px 0;align-items:start}\n#gbm-live.fp26 .fp-latest time{font:700 12px/1.3 var(--fp-cond);letter-spacing:.06em;text-transform:uppercase;color:var(--fp-link);padding-top:2px}\n#gbm-live.fp26 .fp-latest h3{font:700 17px/1.15 var(--fp-cond);letter-spacing:0;text-transform:none}\n#gbm-live.fp26 .fp-latest .fp-meta{margin-top:3px}\n#gbm-live.fp26 .fp-show-when{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font:800 22px/1.05 var(--fp-cond);text-transform:uppercase;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-live-dot{display:none;width:10px;height:10px;border-radius:50%;background:#c8102e}\n#gbm-live.fp26 .fp-show[data-live=\"1\"] .fp-live-dot{display:inline-block}\n#gbm-live.fp26 .fp-actions{display:flex;flex-wrap:wrap;gap:8px}\n#gbm-live.fp26 .fp-vid{display:grid;grid-template-columns:120px minmax(0,1fr);gap:10px;align-items:center}\n#gbm-live.fp26 .fp-vid .fp-frame{aspect-ratio:16/9}\n#gbm-live.fp26 .fp-vid b{display:block;font:700 16px/1.15 var(--fp-cond)}\n#gbm-live.fp26 .fp-vid span{font:600 12px/1.3 var(--fp-sans);color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-play{position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:var(--fp-orange)}\n#gbm-live.fp26 .fp-play::after{content:\"\";position:absolute;left:13px;top:10px;border:7px solid transparent;border-left:11px solid #fff;border-right:0}\n#gbm-live.fp26 .fp-clips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n#gbm-live.fp26 .fp-clip .fp-frame{aspect-ratio:9/12}\n#gbm-live.fp26 .fp-clip b{display:block;margin-top:6px;font:700 15px/1.15 var(--fp-cond)}\n#gbm-live.fp26 .fp-photos{display:grid;gap:12px}\n#gbm-live.fp26 .fp-photo>b{display:block;margin-top:6px;font:700 17px/1.1 var(--fp-cond);text-transform:uppercase}\n#gbm-live.fp26 .fp-score-head{display:flex;justify-content:space-between;gap:8px;align-items:baseline;font:800 13px/1.2 var(--fp-cond);letter-spacing:.12em;text-transform:uppercase;color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-mini{width:100%;border-collapse:collapse;font:800 15px/1 var(--fp-cond);font-variant-numeric:tabular-nums;table-layout:fixed}\n#gbm-live.fp26 .fp-mini th,#gbm-live.fp26 .fp-mini td{padding:6px 2px;text-align:center;border-bottom:1px solid var(--fp-rule)}\n#gbm-live.fp26 .fp-mini thead th{font:700 11px/1 var(--fp-cond);letter-spacing:.1em;color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-mini .fp-lt{width:34%;text-align:left;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#gbm-live.fp26 .fp-mini .fp-tot{font-size:19px;color:var(--fp-navy)}\n#gbm-live.fp26.fp-night .fp-mini .fp-tot{color:#fff}\n#gbm-live.fp26 .fp-tape{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n#gbm-live.fp26 .fp-tape div{border-bottom:3px solid var(--fp-orange);padding-bottom:6px}\n#gbm-live.fp26 .fp-tape strong{display:block;font:800 34px/1 var(--fp-cond);font-variant-numeric:tabular-nums;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-tape span{font:700 11px/1.2 var(--fp-cond);letter-spacing:.12em;text-transform:uppercase;color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-next{display:grid;gap:4px;padding:10px 12px;background:var(--fp-navy);color:#fff}\n#gbm-live.fp26 .fp-next b{font:800 20px/1.05 var(--fp-cond);text-transform:uppercase}\n#gbm-live.fp26 .fp-next span{font:600 13px/1.35 var(--fp-sans);color:#dfe5ff}\n#gbm-live.fp26 .fp-next .fp-cd i{color:#c9d3ff}\n#gbm-live.fp26 .fp-stand{width:100%;border-collapse:collapse;font:700 14px/1.2 var(--fp-cond);font-variant-numeric:tabular-nums}\n#gbm-live.fp26 .fp-stand td,#gbm-live.fp26 .fp-stand th{padding:5px 2px;border-bottom:1px solid var(--fp-rule);text-align:right}\n#gbm-live.fp26 .fp-stand td:first-child,#gbm-live.fp26 .fp-stand th:first-child{text-align:left}\n#gbm-live.fp26 .fp-stand tr.fp-us td{color:var(--fp-link);font-weight:800}\n#gbm-live.fp26 .fp-chips{display:flex;flex-wrap:wrap;gap:8px}\n#gbm-live.fp26 .fp-chips a{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;background:var(--fp-chip);font:800 13px/1 var(--fp-cond);letter-spacing:.1em;text-transform:uppercase;color:var(--fp-ink)}\n#gbm-live.fp26 .fp-mod p.fp-ex{font:500 15px/1.5 var(--fp-sans);color:var(--fp-ink-2)}\n#gbm-live.fp26 .fp-mag{display:grid;grid-template-columns:minmax(0,1fr) 128px;gap:14px;align-items:center;background:#07122e;color:#fff}\n#gbm-live.fp26 .fp-mag h2{color:#fff;border-top-color:var(--fp-orange)!important}\n#gbm-live.fp26 .fp-mag p.fp-ex{color:#c8d3ef}\n#gbm-live.fp26 .fp-mag-copy{display:flex;flex-direction:column;gap:10px;min-width:0}\n#gbm-live.fp26 .fp-cover{position:relative;display:block;aspect-ratio:3/4;overflow:hidden;background:#0021a5;box-shadow:0 10px 24px rgba(0,0,0,.35);align-self:center}\n#gbm-live.fp26 .fp-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n#gbm-live.fp26 .fp-cover::after{content:\"\";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,33,165,.9) 0,rgba(0,33,165,0) 32%,rgba(4,11,31,0) 50%,rgba(4,11,31,.92) 100%)}\n#gbm-live.fp26 .fp-cover-mh{position:absolute;z-index:1;left:8px;right:8px;top:6px;font:800 19px/.9 var(--fp-cond);text-transform:uppercase}\n#gbm-live.fp26 .fp-cover-mh small{display:block;font:700 7px/1.4 var(--fp-sans);letter-spacing:.2em}\n#gbm-live.fp26 .fp-cover-t{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5;overflow:hidden;position:absolute;z-index:1;left:8px;right:8px;bottom:8px;font:800 14px/.95 var(--fp-cond);text-transform:uppercase;color:#fff}\n#gbm-live.fp26 .fp-cover-t em{display:block;font-style:normal;font-size:9px;letter-spacing:.14em;color:#ffb08f;margin-bottom:3px}\n#gbm-live.fp26 #sh-freshness:not(:empty){padding:10px 0;font:700 14px/1.3 var(--fp-sans)}\n#gbm-live.fp26 #sh-freshness a{color:var(--fp-link);text-decoration:underline;text-underline-offset:3px}\n@media(min-width:600px){\n#gbm-live.fp26{--fp-pad:24px}\n#gbm-live.fp26 .fp-cta-long{display:inline}\n#gbm-live.fp26 .fp-cta-short{display:none}\n#gbm-live.fp26 .fp-cd .fp-cd-s{display:inline-flex}\n#gbm-live.fp26 .fp-hub-grid{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-live.fp26 .fp-mod-latest{grid-row:span 2}\n#gbm-live.fp26 .fp-mag{grid-column:1/-1;grid-template-columns:minmax(0,1fr) 170px}\n#gbm-live.fp26 .fp-photos{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-live.fp26 .fp-second{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-live.fp26 .fp-rail{grid-column:1/-1}\n#gbm-live.fp26 .fp-rail-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px}\n}\n@media(min-width:821px){\n#gbm-live.fp26{--fp-pad:32px}\n#gbm-live.fp26 .fp-mast .fp-wrap{padding-top:18px;padding-bottom:16px}\n#gbm-live.fp26 .fp-date{grid-column:1;justify-content:flex-start;gap:16px}\n#gbm-live.fp26 .fp-wordmark{grid-column:1;font-size:clamp(72px,8.4vw,120px)}\n#gbm-live.fp26 .fp-wordmark small{font-size:13px}\n#gbm-live.fp26 .fp-mast-right{grid-column:2;grid-row:1/3;align-self:start}\n#gbm-live.fp26 .fp-signin{display:inline-flex}\n#gbm-live.fp26 .fp-mast .fp-btn{min-height:44px;padding:0 18px;font-size:15px}\n#gbm-live.fp26 .fp-nav .fp-wrap{min-height:56px;gap:20px}\n#gbm-live.fp26 .fp-links{display:flex;align-items:center;gap:22px;flex:1 1 auto;min-width:0;overflow:hidden;font:800 14px/1 var(--fp-cond);letter-spacing:.12em;text-transform:uppercase}\n#gbm-live.fp26 .fp-links a{display:inline-flex;align-items:center;min-height:44px;white-space:nowrap}\n#gbm-live.fp26 .fp-links a[aria-current]{color:var(--fp-orange);box-shadow:inset 0 -3px 0 var(--fp-orange)}\n#gbm-live.fp26 .fp-bug{flex:0 1 auto;margin:0}\n#gbm-live.fp26 .fp-bug>a{min-height:44px;padding:4px 12px}\n#gbm-live.fp26 .fp-bug-next{flex:0 1 auto;gap:14px}\n#gbm-live.fp26 .fp-board .fp-wrap{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);column-gap:32px;align-items:start}\n#gbm-live.fp26 .fp-board-top,#gbm-live.fp26 .fp-board-links{grid-column:1/-1}\n#gbm-live.fp26 .fp-line tbody .fp-lt{font-size:26px}\n#gbm-live.fp26 .fp-line .fp-tot{font-size:34px}\n#gbm-live.fp26 .fp-line td{font-size:20px}\n#gbm-live.fp26 .fp-board-side{grid-column:2;grid-row:2/4;display:grid;gap:10px;align-content:start}\n#gbm-live.fp26 .fp-lead{grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;padding-top:28px;align-items:start}\n#gbm-live.fp26 .fp-lead-photo{grid-column:1/8}\n#gbm-live.fp26 .fp-lead-copy{grid-column:8/13;gap:14px}\n#gbm-live.fp26 .fp-lead h1{font-size:clamp(56px,6.2vw,88px)}\n#gbm-live.fp26 .fp-lead h1[data-len=long]{font-size:clamp(48px,5vw,70px)}\n#gbm-live.fp26 .fp-dek{font-size:22px}\n#gbm-live.fp26 .fp-quote{grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;align-items:center;margin-top:32px;padding:26px 0}\n#gbm-live.fp26 .fp-quote blockquote{grid-column:2/9;font-size:44px}\n#gbm-live.fp26 .fp-quote figcaption{grid-column:9/13}\n#gbm-live.fp26 .fp-second{grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;padding-block:32px}\n#gbm-live.fp26 .fp-feature{grid-column:1/5}\n#gbm-live.fp26 .fp-list{grid-column:5/9}\n#gbm-live.fp26 .fp-rail{grid-column:9/13}\n#gbm-live.fp26 .fp-rail-cols{display:block}\n#gbm-live.fp26 .fp-hub-grid{grid-template-columns:repeat(12,minmax(0,1fr));gap:24px}\n#gbm-live.fp26 .fp-mod-latest{grid-column:1/5;grid-row:span 2}\n#gbm-live.fp26 .fp-mod-scores{grid-column:5/9;grid-row:span 2}\n#gbm-live.fp26 .fp-mod-show{grid-column:9/13}\n#gbm-live.fp26 .fp-mod-clips{grid-column:9/13}\n#gbm-live.fp26 .fp-mod-photos{grid-column:1/6}\n#gbm-live.fp26 .fp-mag{grid-column:6/10;grid-template-columns:minmax(0,1fr) 120px}\n#gbm-live.fp26 .fp-mod-news{grid-column:10/13}\n#gbm-live.fp26 .fp-photos{grid-template-columns:repeat(2,minmax(0,1fr))}\n#gbm-live.fp26 .fp-hub-head h2{font-size:56px}\n}\n@media(min-width:821px) and (max-width:1439px){#gbm-live.fp26 .fp-nav .fp-cd .fp-cd-s{display:none}}\n@media(min-width:1100px){\n#gbm-live.fp26{--fp-pad:64px}\n}\n@media(max-width:599px){\n#gbm-live.fp26 .fp-bug-last:has(+ .fp-bug-next){display:none}\n#gbm-live.fp26 .fp-bug-match{flex:1 1 auto;white-space:nowrap;overflow:hidden}\n#gbm-live.fp26 .fp-bug-match small{overflow:hidden;text-overflow:ellipsis}\n}\n@media(max-width:429px){#gbm-live.fp26 .fp-wordmark small{display:none}}\n@media(max-width:374px){#gbm-live.fp26 .fp-date span+span{display:none}#gbm-live.fp26 .fp-mast .fp-btn{padding:0 10px;font-size:13px;gap:5px}}\n@media(min-width:821px) and (max-width:1099px){\n#gbm-live.fp26 .fp-links a:nth-child(n+6){display:none}\n}\n@media(max-width:360px){\n#gbm-live.fp26 .fp-bug-team{font-size:13px}\n#gbm-live.fp26 .fp-bug-team strong{font-size:19px}\n#gbm-live.fp26 .fp-bug>a{padding:6px 8px;gap:6px}\n#gbm-live.fp26 .fp-cd{font-size:17px}\n#gbm-live.fp26 .fp-bug-match{font-size:12px}\n#gbm-live.fp26 .fp-vid{grid-template-columns:96px minmax(0,1fr)}\n#gbm-live.fp26 .fp-mag{grid-template-columns:minmax(0,1fr) 100px}\n}\n@media(prefers-reduced-motion:no-preference){\n#gbm-live.fp26 .fp-wordmark{animation:fpSettle .9s cubic-bezier(.2,.7,.2,1) both}\n#gbm-live.fp26 .fp-lead-photo .fp-frame img{animation:fpBurns 22s ease-in-out infinite alternate;transform-origin:60% 40%}\n#gbm-live.fp26 .fp-lead h1 .fp-w{animation:fpWord .55s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i) * 55ms + 120ms)}\n#gbm-live.fp26 .fp-tk-track{animation:fpTicker var(--fp-tk-dur,60s) linear infinite}\n#gbm-live.fp26 .fp-ticker:hover .fp-tk-track,#gbm-live.fp26 .fp-ticker:focus-within .fp-tk-track{animation-play-state:paused}\n#gbm-live.fp26 .fp-cd b.fp-flip{animation:fpFlip .42s cubic-bezier(.3,.7,.3,1)}\n#gbm-live.fp26 .fp-show[data-live=\"1\"] .fp-live-dot{animation:fpPulse 1.4s ease-in-out infinite}\n#gbm-live.fp26 .fp-cover{transition:transform .25s ease,box-shadow .25s ease}\n#gbm-live.fp26 a:hover .fp-cover,#gbm-live.fp26 .fp-cover:hover{transform:translateY(-6px);box-shadow:0 18px 32px rgba(0,0,0,.45)}\n}\n@media(prefers-reduced-motion:reduce){\n#gbm-live.fp26 .fp-tk-view{overflow-x:auto;-webkit-mask-image:none;mask-image:none}\n#gbm-live.fp26 .fp-tk-dup{display:none}\n}\n@keyframes fpSettle{from{transform:translateY(12px);opacity:.001}to{transform:none;opacity:1}}\n@keyframes fpBurns{from{transform:scale(1)}to{transform:scale(1.06) translate(-1%,-1%)}}\n@keyframes fpWord{from{transform:translateY(.35em);opacity:.001}to{transform:none;opacity:1}}\n@keyframes fpTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@keyframes fpFlip{0%{transform:rotateX(90deg);opacity:.2}100%{transform:none;opacity:1}}\n@keyframes fpPulse{50%{opacity:.25}}\n#gbm-live.fp26 #gbm-road{--n:#07122e;--b:#0021a5;--o:#fa4616;--ink:#f3f5fb;--mut:#aab4cc;background:radial-gradient(70% 90% at 100% 100%,rgba(250,70,22,.16),transparent 70%),radial-gradient(90% 100% at 0% 0%,#10306e,transparent 65%),var(--n);color:var(--ink);font-family:var(--fp-sans);padding:28px 0 26px;overflow:hidden;position:relative}\n#gbm-live.fp26 #gbm-road *{box-sizing:border-box}\n#gbm-live.fp26 #gbm-road .hd{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;padding:0 var(--fp-pad) 14px;max-width:1440px;margin:0 auto}\n#gbm-live.fp26 #gbm-road h2{font:800 clamp(30px,6vw,52px)/.92 var(--fp-cond);text-transform:uppercase;margin:0}\n#gbm-live.fp26 #gbm-road h2 span{color:var(--o)}\n#gbm-live.fp26 #gbm-road .rec{flex:0 0 auto;white-space:nowrap;font:700 14px var(--fp-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mut);text-align:right}\n#gbm-live.fp26 #gbm-road .rec b{display:block;font:800 34px/1 var(--fp-cond);color:var(--ink);letter-spacing:0}\n#gbm-live.fp26 #gbm-road .track{position:relative;display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x proximity;scroll-padding-left:var(--fp-pad);padding:26px var(--fp-pad) 12px;max-width:1440px;margin:0 auto;scrollbar-width:none}\n#gbm-live.fp26 #gbm-road .track::-webkit-scrollbar{display:none}\n#gbm-live.fp26 #gbm-road .line{position:absolute;left:var(--fp-pad);right:var(--fp-pad);top:12px;height:3px;background:rgba(255,255,255,.12);border-radius:3px}\n#gbm-live.fp26 #gbm-road .line i{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,var(--b),var(--o));box-shadow:0 0 14px var(--o);border-radius:3px;transition:width 1.4s cubic-bezier(.2,.7,.2,1)}\n#gbm-live.fp26 #gbm-road .g{position:relative;flex:0 0 156px;scroll-snap-align:start;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:16px 12px 12px;min-height:168px;display:flex;flex-direction:column;gap:4px;text-decoration:none;color:inherit}\n#gbm-live.fp26 #gbm-road .g::before{content:\"\";position:absolute;left:14px;top:-19px;width:13px;height:13px;border-radius:50%;background:var(--n);border:3px solid rgba(255,255,255,.35)}\n#gbm-live.fp26 #gbm-road .g.w::before{background:var(--o);border-color:var(--o);box-shadow:0 0 10px var(--o)}\n#gbm-live.fp26 #gbm-road .g.nx{border-color:var(--o);background:rgba(250,70,22,.12)}\n#gbm-live.fp26 #gbm-road .g.nx::before{background:var(--o);border-color:#fff;animation:gbmp 1.6s ease-in-out infinite}\n#gbm-live.fp26 #gbm-road .g.boss{border-color:rgba(255,90,60,.55)}\n#gbm-live.fp26 #gbm-road .dt{font:700 11px var(--fp-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}\n#gbm-live.fp26 #gbm-road .op{overflow-wrap:anywhere;font:800 22px/1 var(--fp-cond);text-transform:uppercase}\n#gbm-live.fp26 #gbm-road .rk{color:var(--o);font-size:14px;margin-right:3px}\n#gbm-live.fp26 #gbm-road .sc{white-space:nowrap;font:800 30px/1 var(--fp-cond);margin-top:auto}\n#gbm-live.fp26 #gbm-road .bar{height:5px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden}\n#gbm-live.fp26 #gbm-road .bar i{display:block;height:100%;width:0;background:var(--o);transition:width 1.2s .3s cubic-bezier(.2,.7,.2,1)}\n#gbm-live.fp26 #gbm-road .sub{font:600 12px var(--fp-sans);color:var(--mut)}\n#gbm-live.fp26 #gbm-road .cd{white-space:nowrap;font:800 22px var(--fp-cond);color:#fff;letter-spacing:.04em}\n@keyframes gbmp{50%{box-shadow:0 0 0 7px rgba(250,70,22,.25)}}\n@media(prefers-reduced-motion:reduce){#gbm-live.fp26 #gbm-road .line i,#gbm-live.fp26 #gbm-road .bar i{transition:none}#gbm-live.fp26 #gbm-road .g.nx::before{animation:none}}\n#gbm-live.fp26 .fp-tunnel{position:relative;isolation:isolate;overflow:hidden;background:#040b1f;color:#fff;border-bottom:4px solid var(--fp-orange);display:grid;align-items:center;min-height:min(72vh,540px)}\n#gbm-live.fp26 .fp-tn-scene{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}\n#gbm-live.fp26 .fp-tn-scene::before{content:\"\";position:absolute;inset:-25%;background:repeating-conic-gradient(from 0deg at 50% 44%,rgba(255,255,255,.05) 0 1.4deg,transparent 1.4deg 11deg);opacity:.9}\n#gbm-live.fp26 .fp-tn-ring{position:absolute;left:50%;top:44%;width:180vw;max-width:2300px;aspect-ratio:2/1;border:1px solid rgba(255,255,255,.16);border-radius:18%/30%;transform:translate(-50%,-50%) scale(var(--s));opacity:var(--o);box-shadow:0 0 30px rgba(0,33,165,.25) inset}\n#gbm-live.fp26 .fp-tn-ring:nth-child(1){--s:.1;--o:.95}\n#gbm-live.fp26 .fp-tn-ring:nth-child(2){--s:.2;--o:.8}\n#gbm-live.fp26 .fp-tn-ring:nth-child(3){--s:.33;--o:.65}\n#gbm-live.fp26 .fp-tn-ring:nth-child(4){--s:.5;--o:.5}\n#gbm-live.fp26 .fp-tn-ring:nth-child(5){--s:.72;--o:.36}\n#gbm-live.fp26 .fp-tn-ring:nth-child(6){--s:1;--o:.24}\n#gbm-live.fp26 .fp-tn-light{position:absolute;left:50%;top:44%;width:42vw;max-width:440px;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,244,230,.95),rgba(250,70,22,.6) 38%,rgba(250,70,22,0) 72%);filter:blur(12px);opacity:.85}\n#gbm-live.fp26 .fp-tunnel[data-phase=live] .fp-tn-light,#gbm-live.fp26 .fp-tunnel[data-phase=half] .fp-tn-light{background:radial-gradient(closest-side,rgba(255,236,236,.95),rgba(200,16,46,.65) 38%,rgba(200,16,46,0) 72%)}\n#gbm-live.fp26 .fp-tunnel[data-phase=final] .fp-tn-light{background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(169,187,255,.5) 38%,rgba(169,187,255,0) 72%)}\n#gbm-live.fp26 .fp-tn-floor{position:absolute;left:-30%;right:-30%;bottom:-3%;height:40%;transform:perspective(600px) rotateX(58deg);transform-origin:50% 0;background:linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px) 0 0/48px 100%,linear-gradient(0deg,rgba(255,255,255,.08) 1px,transparent 1px) 0 0/100% 32px,linear-gradient(180deg,transparent,rgba(0,33,165,.4));-webkit-mask-image:linear-gradient(180deg,transparent,#000 40%);mask-image:linear-gradient(180deg,transparent,#000 40%)}\n#gbm-live.fp26 .fp-tunnel::after{content:\"\";position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(70% 60% at 50% 62%,rgba(4,11,31,.7),rgba(4,11,31,0) 70%)}\n#gbm-live.fp26 .fp-tn-wrap{position:relative;display:grid;gap:16px;justify-items:center;text-align:center;padding-block:30px 26px}\n#gbm-live.fp26 .fp-tn-top{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 12px;margin:0;font:700 12px/1.3 var(--fp-cond);letter-spacing:.12em;text-transform:uppercase;color:#c8d3ef}\n#gbm-live.fp26 .fp-tn-match{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px 14px;width:100%;max-width:980px}\n#gbm-live.fp26 .fp-tn-team{display:grid;gap:6px;min-width:0}\n#gbm-live.fp26 .fp-tn-team small{font:700 12px/1 var(--fp-cond);letter-spacing:.14em;text-transform:uppercase;color:#ffb08f}\n#gbm-live.fp26 .fp-tn-team b{font:800 clamp(30px,8.6vw,84px)/.9 var(--fp-cond);text-transform:uppercase;letter-spacing:-.01em;overflow-wrap:anywhere;text-shadow:0 2px 24px rgba(0,0,0,.5)}\n#gbm-live.fp26 .fp-tn-vs{font:800 clamp(14px,3vw,22px)/1 var(--fp-cond);letter-spacing:.2em;text-transform:uppercase;color:var(--fp-orange)}\n#gbm-live.fp26 .fp-tn-mid{display:grid;gap:8px;justify-items:center}\n#gbm-live.fp26 .fp-tn-pre,#gbm-live.fp26 .fp-tn-kick,#gbm-live.fp26 .fp-tn-live,#gbm-live.fp26 .fp-tn-final{display:none;gap:8px;justify-items:center}\n#gbm-live.fp26 .fp-tunnel[data-phase=pre] .fp-tn-pre,#gbm-live.fp26 .fp-tunnel[data-phase=kick] .fp-tn-kick,#gbm-live.fp26 .fp-tunnel[data-phase=live] .fp-tn-live,#gbm-live.fp26 .fp-tunnel[data-phase=half] .fp-tn-live,#gbm-live.fp26 .fp-tunnel[data-phase=final] .fp-tn-final{display:grid}\n#gbm-live.fp26 .fp-tn-label{margin:0;font:700 13px/1 var(--fp-cond);letter-spacing:.18em;text-transform:uppercase;color:#c8d3ef}\n#gbm-live.fp26 .fp-tunnel .fp-cd{font-size:clamp(34px,11vw,96px);gap:4px;flex-wrap:wrap;justify-content:center;max-width:100%;text-shadow:0 2px 24px rgba(0,0,0,.5)}\n#gbm-live.fp26 .fp-tunnel .fp-cd b{min-width:.56em}\n#gbm-live.fp26 .fp-tunnel .fp-cd i{font-size:clamp(12px,2.6vw,18px);letter-spacing:.1em;color:#ffb08f;margin:0 10px 0 3px}\n#gbm-live.fp26 .fp-tunnel .fp-cd .fp-cd-s{display:inline-flex}\n#gbm-live.fp26 .fp-tn-score{display:flex;align-items:baseline;gap:12px;font:800 clamp(60px,15vw,124px)/1 var(--fp-cond);font-variant-numeric:tabular-nums;text-shadow:0 2px 24px rgba(0,0,0,.5)}\n#gbm-live.fp26 .fp-tn-score span{color:var(--fp-orange);font-size:.6em}\n#gbm-live.fp26 .fp-tn-clock{display:inline-flex;align-items:center;gap:8px;margin:0;padding:6px 10px;background:#c8102e;font:800 13px/1 var(--fp-cond);letter-spacing:.14em;text-transform:uppercase}\n#gbm-live.fp26 .fp-tn-clock::before{content:\"\";width:8px;height:8px;border-radius:50%;background:#fff}\n#gbm-live.fp26 .fp-tunnel[data-phase=final] .fp-tn-clock{background:#fff;color:#040b1f}\n#gbm-live.fp26 .fp-tunnel[data-phase=final] .fp-tn-clock::before{background:var(--fp-orange)}\n#gbm-live.fp26 .fp-tn-drive{margin:0;max-width:640px;font:600 15px/1.45 var(--fp-sans);color:#dfe6f7}\n#gbm-live.fp26 .fp-tn-drive b{font:800 12px/1 var(--fp-cond);letter-spacing:.14em;text-transform:uppercase;color:#ffb08f;margin-right:8px}\n#gbm-live.fp26 .fp-tn-kick p{margin:0;font:800 clamp(28px,7vw,56px)/1 var(--fp-cond);text-transform:uppercase;text-shadow:0 2px 24px rgba(0,0,0,.5)}\n#gbm-live.fp26 .fp-tn-cta{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}\n#gbm-live.fp26 .fp-tn-cta .fp-ghost{color:#fff}\n#gbm-live.fp26 .fp-tn-stories{list-style:none;margin:6px 0 0;padding:14px 0 0;width:100%;max-width:980px;display:grid;gap:10px;border-top:1px solid rgba(255,255,255,.18);text-align:left}\n#gbm-live.fp26 .fp-tn-stories a{display:grid;gap:3px;color:#fff;font:700 15px/1.3 var(--fp-sans)}\n#gbm-live.fp26 .fp-tn-stories span{font:600 12px/1.3 var(--fp-sans);letter-spacing:.02em;color:#c8d3ef}\n@media(min-width:600px){#gbm-live.fp26 .fp-tn-stories{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px 24px}}\n@media(min-width:821px){#gbm-live.fp26 .fp-tunnel{min-height:min(70vh,600px)}#gbm-live.fp26 .fp-tn-wrap{gap:20px;padding-block:40px 34px}#gbm-live.fp26 .fp-tn-match{gap:8px 28px}}\n@media(prefers-reduced-motion:no-preference){\n#gbm-live.fp26 .fp-tn-ring{animation:fpTnRun 7.2s linear infinite;animation-delay:calc(var(--d) * -1.2s)}\n#gbm-live.fp26 .fp-tn-ring:nth-child(1){--d:0}#gbm-live.fp26 .fp-tn-ring:nth-child(2){--d:1}#gbm-live.fp26 .fp-tn-ring:nth-child(3){--d:2}#gbm-live.fp26 .fp-tn-ring:nth-child(4){--d:3}#gbm-live.fp26 .fp-tn-ring:nth-child(5){--d:4}#gbm-live.fp26 .fp-tn-ring:nth-child(6){--d:5}\n#gbm-live.fp26 .fp-tn-light{animation:fpTnGlow 3.2s ease-in-out infinite}\n#gbm-live.fp26 .fp-tn-scene::before{animation:fpTnSweep 90s linear infinite;transform-origin:50% 44%}\n#gbm-live.fp26 .fp-tn-clock::before{animation:fpPulse 1.2s ease-in-out infinite}\n}\n@keyframes fpTnRun{from{transform:translate(-50%,-50%) scale(.06);opacity:0}12%{opacity:.95}to{transform:translate(-50%,-50%) scale(1.15);opacity:0}}\n@keyframes fpTnGlow{50%{opacity:1;filter:blur(16px)}}\n@keyframes fpTnSweep{to{transform:rotate(360deg)}}";
  var BUNDLE = {"snapshot":"2026-09-29T20:19:43Z","build":"b4432aba","look":"swamp-night","pins":{"breaking":null,"timed":{"path":"/post/who-are-these-guys-trautwein-s-troops-in-the-trenches-are-difference-makers","until":"2026-10-05T16:00:00Z","note":"Franz Beard lead until Oct. 5 noon ET unless a newer Buddy Martin piece or a breaking pin takes it (CURRENT-STATE Sept. 28 sync)."}},"quotes":{"/post/put-down-the-poll-gators-missouri-is-waiting":{"text":"You have to humble yourself, or you will be humbled.","who":"Jon Sumrall","context":"to his team Monday, after the \"not our standard\" tape from the Ole Miss win. From Buddy Martin's column."}},"credits":{"d3cfa5_d3190d83cdfc44549b10b6bd025e57a3":"Photo by Chris Spears, GatorBait Media","d3cfa5_2ea58f38e2da4c988ab73065cfe63130":"Photo by Chris Spears, GatorBait Media","d3cfa5_026d2a4d2be04a91b8c32317fed5f623":"Photo by Chris Spears, GatorBait Media","d3cfa5_1043f4b7772245baa5aed5f80c21669a":"Photo by Chris Spears, GatorBait Media","d3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b":"Photo by Chris Spears, GatorBait Media","16b519_a0e407bedc46487ca71033fc8351d0fe":"Photo by Chris Spears, GatorBait Media","d3cfa5_e1f06a6dd4ca414885aafdaf6db6ec35":"Photo: Hannah White / UAA Communications"},"columnists":[{"name":"Buddy Martin","initials":"BM","href":"/gatorbait-media-blogs/tags/buddy-martin"},{"name":"Franz Beard","initials":"FB","href":"/gatorbait-media-blogs/tags/franz-beard"},{"name":"Loren Meadows","initials":"LM","href":"/gatorbait-media-blogs/tags/loren-meadows"},{"name":"Chris Spears","initials":"CS","href":null}],"links":{"subscribe":"/pricing-plans/subscribe","signin":"/account/my-account","latest":"/gatorbait-media-blogs","magazine":"/magazine","show":"/the-buddy-martin-show","podcasts":"/the-buddy-martin-show#podcasts","store":"https://gatorbait2026.itemorder.com/shop/home/","schedule":"/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#schedule","roster":"/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#roster","stats":"/florida-football-stats","standings":"/standings","newsletter":"/magazine","youtubeLive":"https://www.youtube.com/channel/UCtR8b1sKFuwaRjKy5BiXRvA/live","youtubeChannel":"https://www.youtube.com/channel/UCtR8b1sKFuwaRjKy5BiXRvA","facebook":"https://www.facebook.com/thebuddymartinshow"},"show":{"days":[1,3,4],"hour":21,"minutes":60,"episode":{"id":"8b7F5iyYOIk","title":"Laura Rutledge on The Buddy Martin Show","date":"2026-09-16"}},"clips":[{"id":"TzP8RJY0BKw","title":"Auburn quarterback pressure"},{"id":"oiSC0-a3tho","title":"Auburn crowd noise"}],"galleries":[{"title":"Chris Spears' Best Shots, Vol. 2: Florida 52, Ole Miss 28","url":"https://www.gatorbaitmedia.com/post/chris-spears-best-shots-vol-2-florida-52-ole-miss-28","image":"https://static.wixstatic.com/media/16b519_a0e407bedc46487ca71033fc8351d0fe~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","date":"2026-09-28T02:06:00Z"},{"title":"Chris Spears Photo Gallery: Florida vs. Ole Miss","url":"https://www.gatorbaitmedia.com/post/chris-spears-photo-gallery-florida-ole-miss","image":"https://static.wixstatic.com/media/d3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","date":"2026-09-28T01:49:00Z"}],"scoreboard":{"updatedAt":"2026-09-28T12:00:00Z","team":{"name":"Florida","abbr":"FLA","rank":8,"record":"4-0"},"last":{"opponent":"Ole Miss","opponentAbbr":"MISS","opponentRank":4,"home":true,"score":{"fla":52,"opp":28},"quarters":{"fla":[10,7,14,21],"opp":[0,6,15,7]},"stats":{"totalYards":498,"rushYards":302,"firstDowns":27,"attendance":90683},"date":"2026-09-26","venue":"Ben Hill Griffin Stadium, Gainesville, Fla.","recapUrl":"/post/florida-ole-miss-final-baugh-gators-run-over-rebels"},"next":{"opponent":"Missouri","opponentAbbr":"MIZ","opponentRank":25,"home":false,"kickoffIso":"2026-10-03T19:30:00Z","tv":"ABC","venue":"Memorial Stadium, Columbia, Mo.","previewUrl":"/post/first-look-missouri-florida-gators-show-me-state-of-mind"},"standings":[],"schedule":[{"date":"2026-09-05T23:45:00Z","opponent":"Florida Atlantic","opponentRank":null,"home":true,"status":"final","score":{"fla":66,"opp":21},"tv":"SEC Network","storyUrl":""},{"date":"2026-09-12T21:30:00Z","opponent":"Campbell","opponentRank":null,"home":true,"status":"final","score":{"fla":52,"opp":3},"tv":"SEC Network+","storyUrl":""},{"date":"2026-09-19T23:00:00Z","opponent":"Auburn","opponentRank":null,"home":false,"status":"final","score":{"fla":44,"opp":39},"tv":"ESPN","storyUrl":""},{"date":"2026-09-26T19:30:00Z","opponent":"Ole Miss","opponentRank":4,"home":true,"status":"final","score":{"fla":52,"opp":28},"tv":"ABC","storyUrl":"https://www.gatorbaitmedia.com/post/postgame-analysis-florida-gators-52-ole-miss-rebel-28"},{"date":"2026-10-03T19:30:00Z","opponent":"Missouri","opponentRank":25,"home":false,"status":"scheduled","score":null,"tv":"ABC","storyUrl":"https://www.gatorbaitmedia.com/post/first-look-missouri-florida-gators-show-me-state-of-mind"},{"date":"2026-10-10T04:00:00Z","opponent":"South Carolina","opponentRank":null,"home":true,"status":"scheduled","score":null,"tv":"","storyUrl":""},{"date":"2026-10-17T04:00:00Z","opponent":"Texas","opponentRank":1,"home":false,"status":"scheduled","score":null,"tv":"","storyUrl":""},{"date":"2026-10-31T19:30:00Z","opponent":"Georgia","opponentRank":2,"home":false,"status":"scheduled","score":null,"tv":"ABC","storyUrl":""},{"date":"2026-11-07T05:00:00Z","opponent":"Oklahoma","opponentRank":null,"home":true,"status":"scheduled","score":null,"tv":"","storyUrl":""},{"date":"2026-11-14T05:00:00Z","opponent":"Kentucky","opponentRank":24,"home":false,"status":"scheduled","score":null,"tv":"","storyUrl":""},{"date":"2026-11-21T05:00:00Z","opponent":"Vanderbilt","opponentRank":null,"home":true,"status":"scheduled","score":null,"tv":"","storyUrl":""},{"date":"2026-11-27T20:30:00Z","opponent":"Florida State","opponentRank":null,"home":false,"status":"scheduled","score":null,"tv":"ABC","storyUrl":""}]},"posts":[{"title":"Denzel Aberdeen Cleared to Play for Florida Under Temporary Injunction","excerpt":"Denzel Aberdeen wins a temporary injunction allowing him to play for Florida in 2026–27. What the ruling means for the Gators and their backcourt.","url":"https://www.gatorbaitmedia.com/post/denzel-aberdeen-florida-temporary-injunction-2026","author":"GatorBait Staff","firstPublishedDate":"2026-09-29T20:19:43Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_cefbed4d0c2a46988a3929e5d0b85807~mv2.png/v1/fit/w_1000,h_941,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Denzel Aberdeen Cleared to Play for Florida Under Temporary Injunction"}},{"title":"Thoughts of the Day: September 29, 2026","excerpt":"O-line coach Phil Trautwein and family celebrate the win over Ole Miss (Photo by Chris Spears) A few thoughts to jump start your Tuesday morning: Driving home on I-75 from Jon Sumrall’s Monday morning press conference in Gainesville, cruise control set at 77 to keep steady with the flow of traffic, I’m listening to the","url":"https://www.gatorbaitmedia.com/post/thoughts-of-the-day-september-29-2026","author":"Franz Beard","firstPublishedDate":"2026-09-29T11:36:39Z","image":{"src":"https://static.wixstatic.com/media/16b519_c0cae41f73f142ec8c32a0599593365f~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Thoughts of the Day: September 29, 2026"}},{"title":"Senate Passes Protect College Sports Act 77–22","excerpt":"The Senate passed the Protect College Sports Act 77–22 Monday night. What the proposal could mean for Florida, and why it is not law yet.","url":"https://www.gatorbaitmedia.com/post/senate-passes-protect-college-sports-act-florida","author":"GatorBait Staff","firstPublishedDate":"2026-09-29T11:31:17Z","image":{"src":"https://static.wixstatic.com/media/ae876a_92f9918e12f941e3a9621a000db7c07d~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Senate Passes Protect College Sports Act 77–22"}},{"title":"Put Down the Poll, Gators. Missouri Is Waiting. And There's A New Definition For 'One Game At A Time'","excerpt":"Jon Sumrall wants Gator Nation to put down the poll: Florida has lost three of its last four trips to Columbia, and the coach with the raspy voice is making his team pay the toll on \"Bloody Tuesday.\"","url":"https://www.gatorbaitmedia.com/post/put-down-the-poll-gators-missouri-is-waiting-and-there-s-a-new-definition-for-one-game-at-a-time","author":"Buddy Martin","firstPublishedDate":"2026-09-28T23:24:43Z","image":{"src":"https://static.wixstatic.com/media/16b519_af154b6318f44ed59403673bf7060316~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Put Down the Poll, Gators. Missouri Is Waiting. And There's A New Definition For 'One Game At A Time'"}},{"title":"Honor Roll: Baugh, Montgomery and Lovett Collect SEC Weekly Awards After Ole Miss Rout","excerpt":"Jadan Baugh earned his first SEC Offensive Player of the Week award, while London Montgomery and Bryce Lovett received their first SEC weekly honors after Florida’s 52-28 win over No. 4 Ole Miss.","url":"https://www.gatorbaitmedia.com/post/honor-roll-baugh-montgomery-and-lovett-collect-sec-weekly-awards-after-ole-miss-rout","author":"Brenden Martin","firstPublishedDate":"2026-09-28T20:56:09Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_52f12f29b57540dcb22edd0fa545ceb1~mv2.jpg/v1/fit/w_800,h_500,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Honor Roll: Baugh, Montgomery and Lovett Collect SEC Weekly Awards After Ole Miss Rout"}},{"title":"Pay the Toll: Sumrall Buries the Ole Miss Win, Braces for ‘Bloody Tuesday’ Before Missouri","excerpt":"Jon Sumrall told Florida he doesn't want to hear another word about Ole Miss, and he had good news on Vernell Brown III before Saturday's trip to No. 25 Missouri.","url":"https://www.gatorbaitmedia.com/post/pay-the-toll-sumrall-buries-the-ole-miss-win-braces-for-bloody-tuesday-before-missouri","author":"Brenden Martin","firstPublishedDate":"2026-09-28T20:54:04Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_e8c6580b794942ca9296ea0fe8961bd8~mv2.jpg/v1/fit/w_800,h_534,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Pay the Toll: Sumrall Buries the Ole Miss Win, Braces for ‘Bloody Tuesday’ Before Missouri"}},{"title":"Who are these guys? Trautwein's troops in the trenches are difference makers","excerpt":"The guys up front helped Jadan Baugh score another TD against Ole Miss (Photo by Chris Spears) “Who are these guys?” – Paul Newman as Butch Cassidy in the classic film “Butch Cassidy and the Sundance Kid” We could be asking the same question of the Florida offensive line. In their preseason analysis, the fine folks at ","url":"https://www.gatorbaitmedia.com/post/who-are-these-guys-trautwein-s-troops-in-the-trenches-are-difference-makers","author":"Franz Beard","firstPublishedDate":"2026-09-28T11:49:14Z","image":{"src":"https://static.wixstatic.com/media/16b519_a0e407bedc46487ca71033fc8351d0fe~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Who are these guys? Trautwein's troops in the trenches are difference makers"}},{"title":"How The Gators Sealed And Secured A 52-28 Rout Of No. 4 Ole Miss With a Pick, Again","excerpt":"Eddie Gilley breaks down the five plays that decided Florida's 52-28 rout of No. 4 Ole Miss, from a blown fourth-down gamble to DJ Coleman's game-sealing interception.","url":"https://www.gatorbaitmedia.com/post/how-the-gators-sealed-and-secured-a-52-28-rout-of-no-4-ole-miss-with-a-pick-again","author":"Eddie Gilley","firstPublishedDate":"2026-09-28T11:48:00Z","image":{"src":"https://static.wixstatic.com/media/16b519_5d3a0f33184d44d2b887fe9581207f72~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for How The Gators Sealed And Secured A 52-28 Rout Of No. 4 Ole Miss With a Pick, Again"}},{"title":"Chris Spears’ Best Shots, Vol. 2: Florida 52, Ole Miss 28","excerpt":"A second batch of Chris Spears’ work from The Swamp as the Gators put away Ole Miss 52-28 — pregame, the pass rush, the sideline and the celebration after. Photos by Chris Spears, GatorBait Media The Swamp glows before Florida's SEC showdown with Ole Miss. Photo by Chris Spears, GatorBait Media Florida's offense goes t","url":"https://www.gatorbaitmedia.com/post/chris-spears-best-shots-vol-2-florida-52-ole-miss-28","author":"Brenden Martin","firstPublishedDate":"2026-09-28T02:06:47Z","image":{"src":"https://static.wixstatic.com/media/16b519_9e6aad749e564c33ab69f6e7e19e9560~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Chris Spears’ Best Shots, Vol. 2: Florida 52, Ole Miss 28"}},{"title":"Chris Spears' Best Shots: Florida 52, Ole Miss 28","excerpt":"Chris Spears had the sideline for all of it. His best photos from The Swamp as Florida ran over No. 4 Ole Miss, 52-28.","url":"https://www.gatorbaitmedia.com/post/chris-spears-photo-gallery-florida-ole-miss","author":"Brenden Martin","firstPublishedDate":"2026-09-28T01:49:57Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b~mv2.jpg/v1/fit/w_800,h_534,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Chris Spears' Best Shots: Florida 52, Ole Miss 28"}},{"title":"BREAKING: MRI Confirms Grade 1 PCL Sprain for Gators WR Vernell Brown III","excerpt":"An MRI confirmed a Grade 1 PCL sprain, the mildest grade, in Vernell Brown III’s knee, sources told GatorBait. He may not miss any games.","url":"https://www.gatorbaitmedia.com/post/breaking-vernell-brown-mri-grade-1-pcl-sprain-florida-gators","author":"Brenden Martin","firstPublishedDate":"2026-09-27T22:04:07Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_7acdfecf6f3d45289bbdcc93f3ca970c~mv2.jpg/v1/fit/w_800,h_494,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for BREAKING: MRI Confirms Grade 1 PCL Sprain for Gators WR Vernell Brown III"}},{"title":"Show-Me State of Mind: A First Look at No. 25 Missouri","excerpt":"No. 8 Florida’s reward for routing Ole Miss is a trip to No. 25 Missouri, which let a fourth-quarter lead get away at Mississippi State.","url":"https://www.gatorbaitmedia.com/post/first-look-missouri-florida-gators-show-me-state-of-mind","author":"Brenden Martin","firstPublishedDate":"2026-09-27T21:53:54Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_a67ff355ad6a4d668106c2befa41b208~mv2.png/v1/fit/w_1000,h_900,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Show-Me State of Mind: A First Look at No. 25 Missouri"}},{"title":"10 Thoughts From the Sidelines: Florida 52, Ole Miss 28","excerpt":"Photographer Chris Spears had the best seat in The Swamp. Ten things the sideline told him about the Florida team that ran over No. 4 Ole Miss.","url":"https://www.gatorbaitmedia.com/post/chris-spears-10-thoughts-from-the-sidelines-florida-ole-miss","author":"Chris Spears","firstPublishedDate":"2026-09-27T18:39:36Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_2ea58f38e2da4c988ab73065cfe63130~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for 10 Thoughts From the Sidelines: Florida 52, Ole Miss 28"}},{"title":"Chomp Up the Charts: Florida Jumps to No. 8 in AP, Coaches Polls","excerpt":"Florida’s 52-28 win over No. 4 Ole Miss sent the Gators up 13 spots in the AP Top 25 and 14 in the Coaches Poll. They’re No. 8 in both.","url":"https://www.gatorbaitmedia.com/post/chomp-up-the-charts-florida-jumps-to-no-8-in-ap-coaches-polls","author":"Brenden Martin","firstPublishedDate":"2026-09-27T18:20:18Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_1043f4b7772245baa5aed5f80c21669a~mv2.png/v1/fit/w_1000,h_720,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Chomp Up the Charts: Florida Jumps to No. 8 in AP, Coaches Polls"}},{"title":"Bound for the CFB Top Ten: Cue Up “Happy Days Are Here Again”","excerpt":"Florida’s updated ESPN FPI projections now have the Gators favored in every remaining game except Texas and Georgia. That math comes out to 10-2 and a ticket to the playoff.","url":"https://www.gatorbaitmedia.com/post/bound-for-the-cfb-top-ten-cue-up-happy-days-are-here-again","author":"Buddy Martin","firstPublishedDate":"2026-09-27T18:11:27Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_026d2a4d2be04a91b8c32317fed5f623~mv2.jpg/v1/fit/w_1000,h_838,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Bound for the CFB Top Ten: Cue Up “Happy Days Are Here Again”"}},{"title":"Postgame Analysis: Florida Gators 52, Ole Miss Rebels 28","excerpt":"Florida dominated No. 4 Ole Miss for a season-defining win, but Jon Sumrall says the Gators are still a work in progress. Loren Meadows on what he expected, what he got and what comes next.","url":"https://www.gatorbaitmedia.com/post/postgame-analysis-florida-gators-52-ole-miss-rebel-28","author":"Loren Meadows","firstPublishedDate":"2026-09-27T13:50:06Z","image":{"src":"https://static.wixstatic.com/media/d3cfa5_9b92c9cd699d46a7a5c56db9a21317e5~mv2.jpg/v1/fit/w_800,h_500,al_c,q_80/file.png","width":1600,"height":900,"alt":"Featured image for Postgame Analysis: Florida Gators 52, Ole Miss Rebels 28"}}]};
  /* Runtime for GatorBait Front Page 2026. CSS and BUNDLE are injected by build-front-page.mjs.
   * Contract kept from the previous renderer: one root #gbm-live.gbm-gazette.gbm-sports-home,
   * window.__GBM_GAZETTE_RUNTIME__ {sync, ready}, __GBM_GAZETTE_BOOT__.ready/fallback, the
   * gbm:gazette-ready event, the 15-minute session feed cache and paint-once (no jump). */
  var VERSION = 'front-page-2026.1';
  var PAGES = 'https://presidente49.github.io/gatorbait-media-redesign/';
  var RSS = '/blog-feed.xml';
  var TZ = 'America/New_York';
  var TSP = 'https://cdn.jsdelivr.net/npm/@tsparticles/slim@3.9.1/tsparticles.slim.bundle.min.js';
  var FONTS = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap';
  var DAY = 86400000;
  var doc = document.documentElement;
  var L = BUNDLE.links;
  function home() { return (location.pathname.replace(/\/+$/, '') || '/') === '/'; }
  if (window.__GBM_GAZETTE_RUNTIME__) { window.__GBM_GAZETTE_RUNTIME__.sync(); return; }
  var loading = false, tickTimer = 0, particles = null, io = null;

  function now() { var t = Number(window.__GBM_FP_NOW__); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function reduced() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } }
  function prefersDark() { try { return matchMedia('(prefers-color-scheme: dark)').matches; } catch (_) { return false; } }
  // Links: our own site paths, our YouTube/Facebook, the store. Nothing else renders.
  function safeUrl(value, kind) {
    try {
      var u = new URL(String(value), 'https://www.gatorbaitmedia.com');
      if (u.protocol !== 'https:' || u.username || u.password) return '';
      if (kind === 'image') return u.hostname === 'static.wixstatic.com' || u.hostname === 'i.ytimg.com' ? u.href : '';
      if (kind === 'post') return /^(www\.)?gatorbaitmedia\.com$/.test(u.hostname) && u.pathname.indexOf('/post/') === 0 ? u.href : '';
      if (/^(www\.)?gatorbaitmedia\.com$/.test(u.hostname)) return u.pathname + u.search + u.hash;
      if (/^(www\.youtube\.com|www\.facebook\.com|gatorbait2026\.itemorder\.com)$/.test(u.hostname)) return u.href;
      return '';
    } catch (_) { return ''; }
  }
  function path(url) { try { return new URL(url, 'https://www.gatorbaitmedia.com').pathname; } catch (_) { return ''; } }

  /* ---------- Time (America/New_York) ---------- */
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var WDS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  function et(ms) {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { wd: WD[o.weekday], h: Number(o.hour) % 24, m: Number(o.minute), ymd: o.year + '-' + o.month + '-' + o.day, y: Number(o.year), mo: Number(o.month) - 1, d: Number(o.day) };
  }
  function ymdOf(v) { if (/^\d{4}-\d{2}-\d{2}$/.test(String(v || ''))) return String(v); var t = Date.parse(v); return Number.isFinite(t) ? et(t).ymd : ''; }
  function clock(ms) { var e = et(ms), h = e.h % 12 || 12; return h + (e.m ? ':' + String(e.m).padStart(2, '0') : '') + (e.h < 12 ? ' a.m.' : ' p.m.'); }
  function shortDate(ms) { var e = et(ms); return MONTHS[e.mo] + ' ' + e.d; }
  function gameWhen(iso) { var t = Date.parse(iso); if (!Number.isFinite(t)) return ''; var e = et(t); return WDS[e.wd] + ', ' + MONTHS[e.mo] + ' ' + e.d + ' · ' + clock(t) + ' ET'; }
  function ago(date) {
    var mins = Math.max(0, Math.round((now() - date.getTime()) / 60000));
    if (mins < 60) return mins <= 1 ? 'Now' : mins + 'm';
    if (mins < 24 * 60) return Math.round(mins / 60) + 'h';
    return shortDate(date.getTime());
  }
  function dateline() {
    var d = new Date(now());
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: TZ });
  }

  /* ---------- Stories ---------- */
  function normalize(data) {
    var seen = new Set(), t = now();
    return (data && Array.isArray(data.posts) ? data.posts : []).map(function (p) {
      var u = safeUrl(p.url, 'post'), date = new Date(p.firstPublishedDate);
      if (!u || !p.title || !Number.isFinite(date.getTime()) || date.getTime() > t + DAY || seen.has(u)) return null;
      if (/^LIVE NOW:/i.test(String(p.title)) && t - date.getTime() > 21600000) return null;
      seen.add(u);
      var raw = String(p.excerpt || '').replace(/\s+/g, ' ').trim(), cap = '', credit = '';
      // Franz-style excerpts open with the photo caption: "Caption (Photo by Chris Spears) Story..."
      var m = raw.match(/^(.{8,220}?)\s*\(((?:UAA )?Photo(?: by)?[^)]{0,60}|[^)]{0,40} photo)\)\s*(.*)$/i);
      if (m) { cap = m[1]; credit = /spears/i.test(m[2]) ? 'Photo by Chris Spears, GatorBait Media' : m[2].replace(/^photo:?\s*/i, 'Photo: '); raw = m[3]; }
      var image = safeUrl(p.image && p.image.src, 'image');
      var key = (image.match(/media\/([0-9a-f]+_[0-9a-f]+)/) || [])[1] || '';
      if (BUNDLE.credits[key]) credit = BUNDLE.credits[key];
      return { title: String(p.title).trim(), url: u, path: path(u), author: String(p.author || 'GatorBait Staff'), date: date, excerpt: raw,
        cap: cap, credit: credit, image: image, key: key, alt: String(p.image && p.image.alt || p.title),
        portrait: !!(p.image && Number(p.image.width) > 0 && Number(p.image.height) > Number(p.image.width)) };
    }).filter(Boolean).sort(function (a, b) { return b.date - a.date; }).slice(0, 30);
  }
  function isSpears(p) { return /chris spears/i.test(p.author) || /^chris spears/i.test(p.title); }
  function byColumnist(p, name) { return name === 'Chris Spears' ? isSpears(p) : p.author.toLowerCase().indexOf(name.toLowerCase()) >= 0; }

  // Home Code lead rule: breaking pin > timed pin (unless a newer Buddy piece) > newest Buddy <= 7 days > newest.
  function pickLead(posts) {
    var t = now(), pins = {}, extra = window.__GBM_HOME_PINS__;
    ['breaking', 'timed'].forEach(function (k) { pins[k] = extra && extra.hasOwnProperty(k) ? extra[k] : BUNDLE.pins[k]; });
    function find(pin) {
      if (!pin || !pin.path) return null;
      if (pin.until && !(t < Date.parse(pin.until))) return null;
      return posts.find(function (p) { return p.path.indexOf(pin.path) === 0; }) || null;
    }
    var breaking = find(pins.breaking);
    if (breaking) return { post: breaking, why: 'breaking' };
    var buddy = posts.find(function (p) { return /buddy martin/i.test(p.author) && t - p.date.getTime() < 7 * DAY; });
    var timed = find(pins.timed);
    if (timed && !(buddy && buddy.date > timed.date)) return { post: timed, why: 'pin' };
    if (buddy) return { post: buddy, why: 'buddy' };
    return { post: posts[0], why: 'newest' };
  }

  /* ---------- Scoreboard feed (sports-live/scoreboard.json, contract in README "Scoreboard feed") ----------
   * { updatedAt, season, team:{name,rank,record,conf},
   *   last:{opponent,opponentRank,home,date,status,score:{fla,opp},quarters:{fla:[],opp:[]}|null,venue,recapUrl,galleryUrl}|null,
   *   next:{opponent,opponentRank,home,kickoffIso,tv,venue,previewUrl}|null,
   *   schedule:[{date,opponent,opponentRank,home,status,score|null,tv,storyUrl}],
   *   standings:[{team,confRecord,overall}], live:null|{clock,period,score:{fla,opp},possession,lastPlay} }
   * Every field is validated on its own; anything missing or malformed keeps the bundled fact. */
  function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : null; }
  function str(v, max) { return typeof v === 'string' && v.trim() ? v.trim().slice(0, max || 80) : null; }
  function arr(v) { return Array.isArray(v) && v.length <= 8 && v.every(function (x) { return num(x) !== null; }) ? v.slice() : null; }
  function mergeGame(base, g, kind) {
    var out = Object.assign({}, base);
    if (!g || typeof g !== 'object') return out;
    ['opponent', 'opponentAbbr', 'venue', 'tv'].forEach(function (k) { var s = str(g[k], 90); if (s) out[k] = s; });
    ['recapUrl', 'previewUrl', 'galleryUrl'].forEach(function (k) { var u = safeUrl(g[k]); if (u && u.charAt(0) === '/') out[k] = u; });
    if (g.hasOwnProperty('opponentRank') && (num(g.opponentRank) !== null || g.opponentRank === null)) out.opponentRank = num(g.opponentRank);
    if (str(g.opponentRecord, 12)) out.opponentRecord = str(g.opponentRecord, 12);
    if (typeof g.home === 'boolean') out.home = g.home;
    if (kind === 'last') {
      if (g.score && num(g.score.fla) !== null && num(g.score.opp) !== null) out.score = { fla: g.score.fla, opp: g.score.opp };
      if (g.quarters && arr(g.quarters.fla) && arr(g.quarters.opp)) out.quarters = { fla: arr(g.quarters.fla), opp: arr(g.quarters.opp) };
      else if (g.hasOwnProperty('quarters')) out.quarters = null;
      if (g.stats && typeof g.stats === 'object') { var s = {}; ['totalYards', 'rushYards', 'firstDowns', 'attendance'].forEach(function (k) { if (num(g.stats[k]) !== null) s[k] = g.stats[k]; }); out.stats = s; }
      if (ymdOf(g.date)) out.date = g.date;
    } else if (Number.isFinite(Date.parse(g.kickoffIso))) out.kickoffIso = g.kickoffIso;
    return out;
  }
  // Season rows keep the feed's field names (opponentRank, storyUrl) so the band and the hub read one shape; `rank` stays as an alias.
  function normSchedule(list) {
    return Array.isArray(list) ? list.slice(0, 20).map(function (g) {
      if (!g || !str(g.opponent, 40) || !Number.isFinite(Date.parse(g.date))) return null;
      var rank = num(g.opponentRank);
      return { opponent: str(g.opponent, 40), opponentRank: rank, rank: rank, home: g.home === true, date: g.date, status: str(g.status, 16) || '', tv: str(g.tv, 24) || '',
        score: g.score && num(g.score.fla) !== null && num(g.score.opp) !== null ? { fla: g.score.fla, opp: g.score.opp } : null, storyUrl: str(g.storyUrl, 300) || '' };
    }).filter(Boolean) : [];
  }
  function readScoreboard(raw) {
    var fb = BUNDLE.scoreboard, sb = { team: Object.assign({}, fb.team), last: Object.assign({}, fb.last), next: Object.assign({}, fb.next), schedule: normSchedule(fb.schedule), standings: [], live: null, source: 'bundled' };
    if (!raw || typeof raw !== 'object' || !raw.team) return sb;
    sb.source = 'feed';
    if (raw.team.hasOwnProperty('rank') && (num(raw.team.rank) !== null || raw.team.rank === null)) sb.team.rank = num(raw.team.rank);
    if (str(raw.team.record, 12)) sb.team.record = str(raw.team.record, 12);
    // A different opponent replaces the whole game, so old quarters/stats never mix with a new score.
    if (raw.last === null) sb.last = null;
    else if (raw.last && str(raw.last.opponent) && raw.last.opponent !== fb.last.opponent) sb.last = mergeGame({ opponent: '', home: true }, raw.last, 'last');
    else sb.last = mergeGame(sb.last, raw.last, 'last');
    if (raw.next === null) sb.next = null;
    else if (raw.next && str(raw.next.opponent) && raw.next.opponent !== fb.next.opponent) sb.next = mergeGame({ opponent: '', home: false }, raw.next, 'next');
    else sb.next = mergeGame(sb.next, raw.next, 'next');
    if (sb.next && !Number.isFinite(Date.parse(sb.next.kickoffIso))) sb.next = null;
    if (Array.isArray(raw.standings)) sb.standings = raw.standings.slice(0, 16).map(function (r) {
      return r && str(r.team, 40) ? { team: str(r.team, 40), conf: str(r.confRecord, 8) || str(r.conf, 8) || '', overall: str(r.overall, 8) || '' } : null; }).filter(Boolean);
    if (Array.isArray(raw.schedule) && normSchedule(raw.schedule).length) sb.schedule = normSchedule(raw.schedule);
    var lv = raw.live;
    if (lv && typeof lv === 'object' && lv.score && num(lv.score.fla) !== null && num(lv.score.opp) !== null) {
      var clk = str(lv.clock, 16) || '', per = num(lv.period);
      sb.live = { status: /half/i.test(clk) ? 'half' : 'live', clock: (per ? (per > 4 ? 'OT' : 'Q' + per) + (clk ? ' ' : '') : '') + clk, score: { fla: lv.score.fla, opp: lv.score.opp }, quarters: null,
        drive: (lv.possession === 'fla' ? 'Florida ball. ' : lv.possession === 'opp' ? 'Opponent ball. ' : '') + (str(lv.lastPlay, 200) || ''), updates: [] };
    }
    if (str(raw.updatedAt, 40)) sb.updatedAt = raw.updatedAt;
    return sb;
  }
  function abbr(name, given) { return given || ({ Florida: 'FLA', 'Ole Miss': 'MISS', Missouri: 'MIZ', Georgia: 'UGA', Tennessee: 'TENN', LSU: 'LSU', Kentucky: 'UK' })[name] || String(name || '').slice(0, 4).toUpperCase(); }
  function ranked(rank, name) { return (rank ? 'No. ' + rank + ' ' : '') + name; }

  // Game state for the score bug and the Saturday stadium board. Desk data (window.__GBM_GAMEDAY__) wins.
  function gameState(sb) {
    var t = now(), gd = window.__GBM_GAMEDAY__, n = sb.next, l = sb.last;
    if (gd && gd.away && gd.home && !(t > Date.parse(gd.until)) && Number.isFinite(Date.parse(gd.kickoff))) {
      var k = Date.parse(gd.kickoff), phase = gd.status === 'final' ? 'final' : t < k ? 'pre' : gd.status === 'half' ? 'half' : 'live';
      function side(s) { return { name: String(s.name || ''), abbr: abbr(s.name), rank: num(s.rank), record: str(s.record, 12) || '', score: num(s.score), q: arr(s.quarters) || [] }; }
      return { src: 'desk', phase: phase, kickoff: k, clock: str(gd.clock, 24) || '', away: side(gd.away), home: side(gd.home), when: str(gd.when, 90) || gameWhen(gd.kickoff),
        venue: str(gd.venue, 90) || '', drive: str(gd.drive, 160) || (Array.isArray(gd.ld) ? gd.ld.map(String).join(' · ').slice(0, 200) : ''),
        updates: (gd.updates || []).slice(0, 4).map(function (u) { return [String(u[0] || ''), String(u[1] || '')]; }),
        links: (gd.links || []).filter(function (x) { return x && /^\/post\//.test(x[1]); }).slice(0, 4), headline: str(gd.headline, 120) || '' };
    }
    var fla = { name: 'Florida', abbr: 'FLA', rank: sb.team.rank, record: sb.team.record };
    if (n && Number.isFinite(Date.parse(n.kickoffIso))) {
      var kk = Date.parse(n.kickoffIso), opp = { name: n.opponent, abbr: abbr(n.opponent, n.opponentAbbr), rank: n.opponentRank, record: n.opponentRecord || '' };
      var live = sb.live, ph = live ? live.status : t < kk ? 'pre' : 'live';
      if (live || t < kk + 5 * 3600000) {
        var fq = live && live.quarters ? live.quarters.fla : [], oq = live && live.quarters ? live.quarters.opp : [];
        var F = Object.assign({}, fla, { score: live ? live.score.fla : null, q: fq }), O = Object.assign({}, opp, { score: live ? live.score.opp : null, q: oq });
        return { src: 'scoreboard', phase: ph, kickoff: kk, clock: live ? live.clock : '', away: n.home ? O : F, home: n.home ? F : O, when: gameWhen(n.kickoffIso) + (n.tv ? ' · ' + n.tv : ''),
          venue: n.venue || '', drive: live ? live.drive : '', updates: live ? live.updates : [], links: n.previewUrl ? [['Preview', n.previewUrl]] : [], headline: '' };
      }
    }
    if (l && l.score && ymdOf(l.date) === et(t).ymd) {
      var o2 = { name: l.opponent, abbr: abbr(l.opponent, l.opponentAbbr), rank: l.opponentRank, record: l.opponentRecord || '', score: l.score.opp, q: l.quarters ? l.quarters.opp : [] };
      var f2 = Object.assign({}, fla, { score: l.score.fla, q: l.quarters ? l.quarters.fla : [] });
      return { src: 'scoreboard', phase: 'final', kickoff: 0, clock: '', away: l.home ? o2 : f2, home: l.home ? f2 : o2, when: '', venue: l.venue || '', drive: '', updates: [], links: l.recapUrl ? [['Recap', l.recapUrl]] : [], headline: '' };
    }
    return null;
  }
  function gameToday(sb) {
    var today = et(now()).ymd, gd = window.__GBM_GAMEDAY__;
    return [sb.next && sb.next.kickoffIso, sb.last && sb.last.date, gd && gd.kickoff].some(function (d) { return d && ymdOf(d) === today; });
  }
  function modes(sb) {
    var q = ''; try { q = new URLSearchParams(location.search).get('gbm_fp') || ''; } catch (_) {}
    var e = et(now()), gameday = q === 'gameday' || (q !== 'day' && q !== 'night' && e.wd === 6 && gameToday(sb));
    var timeNight = e.h >= 19 || e.h < 6 || (gameday && e.h >= 17);
    // Brenden, Sept. 29: Swamp Night is the everyday look. `look: "swamp-night"` in the config keeps
    // the night palette and embers on all day; ?gbm_fp=day still shows the daytime look for QA.
    var always = BUNDLE.look === 'swamp-night';
    var night = q === 'night' || (q !== 'day' && (always || timeNight || prefersDark()));
    return { gameday: gameday, night: night, embers: night && (q === 'night' || always || timeNight) };
  }

  /* ---------- Markup helpers ---------- */
  function link(href, content, cls, extra) { return href ? '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(href) + '"' + (extra || '') + '>' + content + '</a>' : '<span' + (cls ? ' class="' + cls + '"' : '') + '>' + content + '</span>'; }
  function img(src, alt, eager, w, h) { return src ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"' + (eager ? ' fetchpriority="high"' : '') + ' width="' + (w || 1000) + '" height="' + (h || 667) + '">' : ''; }
  function by(p) { return '<p class="fp-meta">' + esc(p.author) + ' · ' + esc(shortDate(p.date.getTime())) + '</p>'; }
  function kicker(p, why) {
    if (why === 'breaking') return 'Breaking';
    if (/buddy martin/i.test(p.author)) return 'The Column · Buddy Martin';
    if (isSpears(p)) return 'Photographs · Chris Spears';
    return p.author && !/staff/i.test(p.author) ? p.author : 'Top story';
  }
  // Long headlines split at a sentence boundary: the first sentences lead, the rest becomes the dek.
  function splitTitle(title) {
    var parts = title.match(/[^.!?]+[.!?]+['’"”]?\s*|[^.!?]+$/g) || [title], head = '';
    while (parts.length && (head + parts[0]).trim().length <= 56) head += parts.shift();
    if (!head.trim() || !parts.length) return { h: title, dek: '' };
    return { h: head.trim(), dek: parts.join('').trim() };
  }
  function words(text) { return esc(text).split(/\s+/).map(function (w, i) { return '<span class="fp-w" style="--i:' + i + '">' + w + '</span>'; }).join(' '); }
  function cd(iso) { return '<span class="fp-cd" data-fp-count="' + esc(iso) + '" aria-label="Countdown to kickoff"></span>'; }
  function fmtNum(n) { return Number(n).toLocaleString('en-US'); }

  /* ---------- Zones ---------- */
  function tickerHtml(posts, sb, gs) {
    var items = [];
    if (gs && gs.phase !== 'pre') items.push('<li><b>' + (gs.phase === 'final' ? 'Final' : 'Live') + '</b>' + esc(gs.away.name + ' ' + (gs.away.score == null ? '' : gs.away.score) + ', ' + gs.home.name + ' ' + (gs.home.score == null ? '' : gs.home.score)) + '</li>');
    else if (sb.last && sb.last.score) items.push('<li><b>Final</b>' + link(sb.last.recapUrl, esc((sb.last.score.fla > sb.last.score.opp ? 'Florida ' + sb.last.score.fla + ', ' + sb.last.opponent + ' ' + sb.last.score.opp : sb.last.opponent + ' ' + sb.last.score.opp + ', Florida ' + sb.last.score.fla))) + '</li>');
    if (gs) gs.updates.slice(0, 2).forEach(function (u) { items.push('<li><b>' + esc(u[0]) + '</b>' + esc(u[1]) + '</li>'); });
    if (sb.next) items.push('<li><b>Next</b>' + link(sb.next.previewUrl, esc(ranked(sb.team.rank, 'Florida') + (sb.next.home ? ' vs. ' : ' at ') + ranked(sb.next.opponentRank, sb.next.opponent) + ' · ' + gameWhen(sb.next.kickoffIso) + (sb.next.tv ? ' · ' + sb.next.tv : ''))) + '</li>');
    posts.slice(0, 8).forEach(function (p) { items.push('<li><b>' + esc(ago(p.date)) + '</b>' + link(p.url, esc(p.title)) + '</li>'); });
    var list = items.join('');
    return '<div class="fp-ticker" role="region" aria-label="Latest headlines and scores"><span class="fp-tk-tag">Latest</span><div class="fp-tk-view"><div class="fp-tk-track" style="--fp-tk-dur:' + Math.max(40, items.length * 7) + 's"><ul class="fp-tk-list">' + list + '</ul><ul class="fp-tk-list fp-tk-dup" aria-hidden="true">' + list.replace(/<a /g, '<a tabindex="-1" ') + '</ul></div></div></div>';
  }
  function mastHtml() {
    return '<header class="fp-mast"><div class="fp-wrap"><p class="fp-date"><span>' + esc(dateline()) + '</span><span>Gainesville, Fla.</span></p>' +
      '<a class="fp-wordmark" href="/" aria-label="GatorBait Media home">GatorBait<small>Media</small></a>' +
      '<div class="fp-mast-right"><a class="fp-signin" href="' + esc(L.signin) + '">Sign in</a><a class="fp-btn" href="' + esc(L.subscribe) + '"><span class="fp-cta-long">Join All Access</span><span class="fp-cta-short">Join</span> <span aria-hidden="true">→</span></a></div></div></header>';
  }
  function bugHtml(sb, gs) {
    var lastA = '', nextA = '';
    if (gs && gs.phase !== 'pre') {
      lastA = '<a class="fp-bug-last" href="' + esc((gs.links[0] && gs.links[0][1]) || L.schedule) + '"><span class="fp-bug-tag" data-state="' + (gs.phase === 'final' ? 'final' : 'live') + '">' + (gs.phase === 'final' ? 'Final' : gs.phase === 'half' ? 'Half' : 'Live') + '</span>' +
        team(gs.away) + team(gs.home) + '</a>';
    } else if (sb.last && sb.last.score) {
      var w = sb.last.score.fla >= sb.last.score.opp;
      lastA = '<a class="fp-bug-last" href="' + esc(sb.last.recapUrl || L.schedule) + '" aria-label="Final: Florida ' + sb.last.score.fla + ', ' + esc(sb.last.opponent) + ' ' + sb.last.score.opp + '"><span class="fp-bug-tag">Final</span>' +
        '<span class="fp-bug-team' + (w ? '' : ' fp-lose') + '">FLA <strong class="fp-num">' + sb.last.score.fla + '</strong></span><span class="fp-bug-team' + (w ? ' fp-lose' : '') + '">' + esc(abbr(sb.last.opponent, sb.last.opponentAbbr)) + ' <strong class="fp-num">' + sb.last.score.opp + '</strong></span></a>';
    }
    if (sb.next && (!gs || gs.phase === 'pre')) {
      nextA = '<a class="fp-bug-next" href="' + esc(sb.next.previewUrl || L.schedule) + '"><span class="fp-bug-tag">Next</span><span class="fp-bug-match">' + (sb.next.home ? 'vs. ' : 'at ') + esc(ranked(sb.next.opponentRank, abbr(sb.next.opponent, sb.next.opponentAbbr))) +
        '<small>' + esc(gameWhen(sb.next.kickoffIso).replace(/^(\w+\.), \w+\.? \d+ · /, '$1 ') + (sb.next.tv ? ' · ' + sb.next.tv : '')) + '</small></span>' + cd(sb.next.kickoffIso) + '</a>';
    }
    return '<div class="fp-bug" aria-label="Scoreboard">' + lastA + nextA + '</div>';
    function team(s) { return '<span class="fp-bug-team">' + esc(s.abbr) + ' <strong class="fp-num">' + (s.score == null ? '–' : esc(s.score)) + '</strong></span>'; }
  }
  function navHtml(sb, gs) {
    return '<nav class="fp-nav" aria-label="GatorBait sections"><div class="fp-wrap"><div class="fp-links"><a href="/" aria-current="page">Front Page</a><a href="' + esc(L.latest) + '">Latest</a><a href="' + esc(L.magazine) + '">Magazine</a><a href="#fp-columnists">Columnists</a><a href="' + esc(L.show) + '">TV &amp; Podcasts</a><a href="' + esc(L.schedule) + '">Scores</a><a href="' + esc(L.store) + '">Store</a></div>' + bugHtml(sb, gs) + '</div></nav>';
  }
  function lineTable(gs, cls) {
    var n = Math.max(4, gs.away.q.length, gs.home.q.length), head = '', i;
    for (i = 0; i < n; i++) head += '<th scope="col">' + (i < 4 ? i + 1 : 'OT' + (i > 4 ? i - 3 : '')) + '</th>';
    function row(s) {
      var cells = ''; for (var j = 0; j < n; j++) cells += '<td>' + (s.q[j] == null ? '–' : esc(s.q[j])) + '</td>';
      return '<tr><th scope="row" class="fp-lt">' + esc(cls === 'fp-mini' ? s.abbr : s.name) + (cls === 'fp-line' ? '<small>' + esc((s.rank ? 'No. ' + s.rank + ' · ' : '') + s.record) + '</small>' : '') + '</th>' + cells + '<td class="fp-tot fp-num">' + (s.score == null ? '–' : esc(s.score)) + '</td></tr>';
    }
    return '<table class="' + cls + '"><thead><tr><th class="fp-lt" scope="col"><span class="fp-sr">Team</span></th>' + head + '<th scope="col">T</th></tr></thead><tbody>' + row(gs.away) + row(gs.home) + '</tbody></table>';
  }
  function boardHtml(gs) {
    if (!gs) return '';
    var status = gs.phase === 'pre' ? cd(new Date(gs.kickoff).toISOString()) : esc(gs.phase === 'final' ? 'Final' : gs.phase === 'half' ? 'Halftime' : 'Live' + (gs.clock ? ' · ' + gs.clock : ''));
    return '<section class="fp-board" aria-label="Game day scoreboard"><div class="fp-wrap"><div class="fp-board-top"><span class="fp-pill">Game Day</span><span>' + esc(gs.when) + '</span>' + (gs.venue ? '<span>' + esc(gs.venue) + '</span>' : '') +
      '<span class="fp-status" data-state="' + (gs.phase === 'pre' ? 'pre' : gs.phase === 'final' ? 'final' : 'live') + '">' + (gs.phase === 'pre' ? 'Kickoff in ' : '') + status + '</span></div>' +
      lineTable(gs, 'fp-line') +
      '<div class="fp-board-side">' + (gs.drive ? '<p class="fp-drive"><b>Drive</b>' + esc(gs.drive) + '</p>' : gs.headline ? '<p class="fp-drive"><b>Up next</b>' + esc(gs.headline) + '</p>' : '') +
      (gs.updates.length ? '<ul class="fp-board-latest" aria-label="Latest game updates">' + gs.updates.map(function (u) { return '<li><b>' + esc(u[0]) + '</b>' + esc(u[1]) + '</li>'; }).join('') + '</ul>' : '') + '</div>' +
      (gs.links.length ? '<div class="fp-board-links">' + gs.links.map(function (l) { return '<a href="' + esc(l[1]) + '">' + esc(l[0]) + '</a>'; }).join('') + '</div>' : '') + '</div></section>';
  }
  function photoBlock(p, eager, cls) {
    if (!p.image) return '';
    return '<figure class="' + (cls || '') + '">' + link(p.url, img(p.image, p.alt, eager), 'fp-frame' + (p.portrait ? ' fp-portrait' : ''), ' tabindex="-1" aria-hidden="true"') +
      ((p.cap || p.credit) ? '<figcaption class="fp-cap"><span>' + esc(p.cap) + '</span>' + (p.credit ? '<b>' + esc(p.credit) + '</b>' : '') + '</figcaption>' : '') + '</figure>';
  }
  function leadHtml(lead, why) {
    var s = splitTitle(lead.title);
    return '<section class="fp-lead" aria-label="Lead story"><div id="fp-embers" aria-hidden="true"></div><div class="fp-night-glow" aria-hidden="true"></div>' + photoBlock(lead, true, 'fp-lead-photo') +
      '<div class="fp-lead-copy"><p class="fp-kick">' + esc(kicker(lead, why)) + '</p><h1 data-len="' + (s.h.length > 60 ? 'long' : 'short') + '">' + link(lead.url, words(s.h), 'fp-hl') + '</h1>' +
      (s.dek ? '<p class="fp-dek">' + esc(s.dek) + '</p>' : '') + '<p class="fp-by">By ' + esc(lead.author) + '<span>' + esc(shortDate(lead.date.getTime())) + '</span></p>' +
      (lead.excerpt ? '<p class="fp-body">' + esc(lead.excerpt) + '</p>' : '') + '<a class="fp-more" href="' + esc(lead.url) + '">Continue reading <span aria-hidden="true">&nbsp;→</span></a></div></section>';
  }
  function quoteHtml(lead, posts) {
    var q = null, t = now();
    Object.keys(BUNDLE.quotes).some(function (k) { if (lead.path.indexOf(k) === 0) { q = BUNDLE.quotes[k]; return true; } return false; });
    if (!q) posts.some(function (p) { return Object.keys(BUNDLE.quotes).some(function (k) { if (p.path.indexOf(k) === 0 && t - p.date.getTime() < 7 * DAY) { q = Object.assign({ url: p.url }, BUNDLE.quotes[k]); return true; } return false; }); });
    if (!q) return '';
    return '<figure class="fp-quote"><blockquote>' + esc(q.text) + '</blockquote><figcaption><cite><b>' + esc(q.who) + '</b>' + esc(q.context) + '</cite></figcaption></figure>';
  }
  function secondHtml(feature, list, cols) {
    return '<section class="fp-second" aria-label="More top stories">' +
      (feature ? '<article class="fp-feature">' + photoBlock(feature, false) + '<p class="fp-kick">' + esc(kicker(feature)) + '</p>' + link(feature.url, '<h2 class="fp-hl">' + esc(feature.title) + '</h2>') + (feature.excerpt ? '<p class="fp-ex">' + esc(feature.excerpt.slice(0, 220)) + (feature.excerpt.length > 220 ? '…' : '') + '</p>' : '') + by(feature) + '</article>' : '') +
      '<ol class="fp-list" aria-label="Top stories">' + list.map(function (p) { return '<li>' + link(p.url, '<h3 class="fp-hl">' + esc(p.title) + '</h3>' + (p.excerpt ? '<p class="fp-ex">' + esc(p.excerpt.slice(0, 120)) + (p.excerpt.length > 120 ? '…' : '') + '</p>' : '') + by(p)) + '</li>'; }).join('') + '</ol>' +
      '<aside class="fp-rail" id="fp-columnists" aria-label="Columnists"><h2>Columnists</h2><div class="fp-rail-cols">' + cols + '</div></aside></section>';
  }
  function columnistsHtml(posts) {
    return BUNDLE.columnists.map(function (c) {
      var p = posts.find(function (x) { return byColumnist(x, c.name); });
      var page = safeUrl(c.href) || (p && p.url) || L.latest;
      return '<div class="fp-col">' + link(page, esc(c.initials), 'fp-roundel', ' aria-hidden="true" tabindex="-1"') + link(page, esc(c.name), 'fp-col-name') +
        (p ? link(p.url, esc(p.title), 'fp-col-story') : '<span class="fp-col-story">Latest columns</span>') + '</div>';
    }).join('');
  }
  function showNext() {
    var cfg = BUNDLE.show, t = now(), e = et(t), mins = e.h * 60 + e.m, start = cfg.hour * 60;
    if (cfg.days.indexOf(e.wd) >= 0 && mins >= start && mins < start + cfg.minutes) return { live: true, label: 'Live now' };
    for (var d = 0; d < 8; d++) {
      var wd = (e.wd + d) % 7;
      if (cfg.days.indexOf(wd) >= 0 && (d > 0 || mins < start)) return { live: false, label: (d === 0 ? 'Tonight' : d === 1 ? 'Tomorrow' : WDS[wd]) + ', ' + (cfg.hour % 12 || 12) + ' p.m. ET' };
    }
    return { live: false, label: '' };
  }
  /* ---------- The Road Ahead: season band under the lead ---------- */
  function roadHtml(sb) {
    var games = (sb.schedule || []).slice(0, 14);
    if (games.length < 3) return '';
    var W = 0, Ls = 0, nx = -1, fm = new Intl.DateTimeFormat('en-US', { timeZone: TZ, month: 'short', day: 'numeric' });
    var cards = games.map(function (g, i) {
      var fin = g.status === 'final' && g.score, win = fin && g.score.fla > g.score.opp;
      if (fin) { if (win) W++; else Ls++; } else if (nx < 0) nx = i;
      var top = '<div class="dt">' + esc(fm.format(new Date(g.date))) + ' · ' + (g.home ? 'Home' : 'Away') + '</div><div class="op">' + (g.opponentRank ? '<span class="rk">No. ' + g.opponentRank + '</span>' : '') + esc(g.opponent) + '</div>', body;
      if (fin) body = '<div class="sc">' + (win ? 'W ' : 'L ') + g.score.fla + '–' + g.score.opp + '</div><div class="bar"><i data-w="' + Math.max(6, Math.min(100, Math.round((g.score.fla - g.score.opp) / 40 * 100))) + '"></i></div><div class="sub">' + esc(g.tv || 'Final') + '</div>';
      else if (i === nx) body = '<div class="cd" data-k="' + esc(g.date) + '">…</div><div class="sub">to kickoff' + (g.tv ? ' · ' + esc(g.tv) : '') + '</div>';
      else body = '<div class="sub" style="margin-top:auto">' + esc(g.tv || 'Kickoff TBA') + '</div>';
      var cls = 'g' + (win ? ' w' : '') + (i === nx ? ' nx' : '') + (g.opponentRank && g.opponentRank <= 5 && !fin ? ' boss' : '');
      var url = g.storyUrl ? safeUrl(g.storyUrl, 'post') : '';
      return (url ? '<a href="' + esc(url) + '"' : '<div') + ' class="' + cls + '" role="listitem">' + top + body + (url ? '</a>' : '</div>');
    }).join('');
    var sig = games.map(function (g) { return g.date + ':' + g.status + ':' + (g.score ? g.score.fla + '-' + g.score.opp : ''); }).join('|');
    return '<section id="gbm-road" aria-label="Florida season road" data-sig="' + esc(sig) + '"><div class="hd"><h2>The road <span>ahead</span></h2><div class="rec"><b>' + W + '–' + Ls + '</b>' + (sb.team && sb.team.season ? esc(sb.team.season) : '2026') + ' record</div></div><div class="track" id="gr-track" role="list"><div class="line"><i id="gr-line"></i></div>' + cards + '</div></section>';
  }
  function initRoad(root) {
    var T = root.querySelector('#gr-track'); if (!T) return;
    var L = T.querySelector('.line'), nodes = Array.prototype.slice.call(T.querySelectorAll('.g')), nxEl = T.querySelector('.g.nx');
    function tick() {
      var c = T.querySelector('.cd'); if (!c) return;
      var ms = new Date(c.getAttribute('data-k')) - now(); if (ms <= 0) { c.textContent = 'Live'; return; }
      c.textContent = Math.floor(ms / 864e5) + 'd ' + Math.floor(ms % 864e5 / 36e5) + 'h ' + Math.floor(ms % 36e5 / 6e4) + 'm';
    }
    tick(); if (root.__gbmRoadTick) clearInterval(root.__gbmRoadTick); root.__gbmRoadTick = setInterval(tick, 30000);
    function run() {
      var upto = nxEl || nodes[nodes.length - 1]; if (!upto) return;
      var pad = parseFloat(getComputedStyle(T).paddingLeft) || 16;
      // The rail spans the whole scroll width; the glow ends at the next game's dot (14px in, 13px wide).
      L.style.right = 'auto'; L.style.width = (T.scrollWidth - 2 * pad) + 'px';
      L.firstChild.style.width = Math.max(0, upto.offsetLeft + 20.5 - pad) + 'px';
      T.querySelectorAll('.bar i').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
      // Phones: keep the last result and the next game in view together; wider tracks stay at the start.
      var prev = nxEl && nodes[nodes.indexOf(nxEl) - 1];
      if (nxEl && nxEl.offsetLeft + nxEl.offsetWidth > T.clientWidth) T.scrollLeft = Math.max(0, (prev || nxEl).offsetLeft - pad);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { run(); o.disconnect(); } }, { threshold: .25 }).observe(T); else run();
  }

  /* ---------- The Tunnel: game-day opener (Brenden, Sept. 30: "tunnel") ----------
   * Renders all three states (countdown, live score, final) and shows one by data-phase, so the feed can
   * move it from pre to live to final in place. Stories about the opponent ride below, never the lead. */
  function tunnelHtml(gs, sb, posts, leadUrl) {
    if (!gs || !gs.away || !gs.home) return '';
    var phase = gs.phase === 'half' ? 'half' : gs.phase, opp = gs.away.name === 'Florida' ? gs.home : gs.away;
    function team(s) { return '<div class="fp-tn-team"><small>' + esc([s.rank ? 'No. ' + s.rank : '', s.record || ''].filter(Boolean).join(' · ') || ' ') + '</small><b>' + esc(s.name) + '</b></div>'; }
    var re = new RegExp(String(opp.name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\  function hubHtml(latest, sb, posts, used) {'), 'i');
    var about = posts.filter(function (p) { return p.url !== leadUrl && re.test(p.title + ' ' + (p.excerpt || '')); }).slice(0, 3);
    var first = gs.links[0], primary = first ? [first[0], first[1]] : sb.next && sb.next.previewUrl ? ['Game preview', sb.next.previewUrl] : sb.last && sb.last.recapUrl && gs.phase === 'final' ? ['Read the recap', sb.last.recapUrl] : ['Scores & schedule', L.schedule];
    var when = gs.when || '', score = '<div class="fp-tn-score"><b data-tn="away">' + (gs.away.score == null ? '0' : esc(gs.away.score)) + '</b><span>–</span><b data-tn="home">' + (gs.home.score == null ? '0' : esc(gs.home.score)) + '</b></div>';
    return '<section class="fp-tunnel" data-phase="' + esc(phase) + '" aria-label="Game day: ' + esc(gs.away.name + ' at ' + gs.home.name) + '">' +
      '<div class="fp-tn-scene" aria-hidden="true"><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><b class="fp-tn-light"></b><u class="fp-tn-floor"></u></div>' +
      '<div class="fp-wrap fp-tn-wrap"><p class="fp-tn-top"><span class="fp-pill">Game day</span>' + (when ? '<span>' + esc(when) + '</span>' : '') + (gs.venue ? '<span>' + esc(gs.venue) + '</span>' : '') + '</p>' +
      '<div class="fp-tn-match">' + team(gs.away) + '<div class="fp-tn-vs">at</div>' + team(gs.home) + '</div>' +
      '<div class="fp-tn-mid">' +
        '<div class="fp-tn-pre"><p class="fp-tn-label">Kickoff in</p>' + (gs.kickoff ? cd(new Date(gs.kickoff).toISOString()) : '') + '</div>' +
        '<div class="fp-tn-kick"><p>Out of the tunnel</p><p class="fp-tn-label">Kickoff' + (when ? ' · ' + esc(when.replace(/^[^·]*·\s*/, '')) : '') + '</p></div>' +
        '<div class="fp-tn-live">' + score + '<p class="fp-tn-clock" data-tn="clock">' + esc(gs.phase === 'half' ? 'Halftime' : gs.clock || 'Live') + '</p>' + (gs.drive ? '<p class="fp-tn-drive"><b>Drive</b><span data-tn="drive">' + esc(gs.drive) + '</span></p>' : '<p class="fp-tn-drive" hidden><b>Drive</b><span data-tn="drive"></span></p>') + '</div>' +
        '<div class="fp-tn-final">' + score.replace(/data-tn="(away|home)"/g, 'data-tn="$1-final"') + '<p class="fp-tn-clock">Final</p></div>' +
      '</div>' +
      '<div class="fp-tn-cta"><a class="fp-btn" href="' + esc(primary[1]) + '">' + esc(primary[0]) + '</a><a class="fp-btn fp-ghost" href="#gbm-road">The road ahead</a></div>' +
      (about.length ? '<ul class="fp-tn-stories" aria-label="More on ' + esc(opp.name) + '">' + about.map(function (p) { return '<li><a href="' + esc(p.url) + '">' + esc(p.title) + '<span>' + esc(p.author + ' · ' + shortDate(p.date.getTime())) + '</span></a></li>'; }).join('') + '</ul>' : '') +
      '</div></section>';
  }
  // Feed updates after paint: phase, score, clock and drive change in place; nothing moves.
  function patchTunnel(root, sb) {
    var t = root.querySelector('.fp-tunnel'); if (!t) return;
    var gs = gameState(sb); if (!gs || !gs.away || !gs.home) return;
    var phase = gs.phase, cur = t.getAttribute('data-phase');
    if (phase === 'pre' && (cur === 'kick' || cur === 'live' || cur === 'half' || cur === 'final')) phase = cur === 'kick' ? 'kick' : cur;
    function put(sel, v) { var el = t.querySelector('[data-tn="' + sel + '"]'); if (el && v != null && el.textContent !== String(v)) el.textContent = String(v); }
    put('away', gs.away.score == null ? '0' : gs.away.score); put('home', gs.home.score == null ? '0' : gs.home.score);
    put('away-final', gs.away.score == null ? '0' : gs.away.score); put('home-final', gs.home.score == null ? '0' : gs.home.score);
    put('clock', gs.phase === 'half' ? 'Halftime' : gs.clock || 'Live');
    var d = t.querySelector('.fp-tn-drive'); if (d) { put('drive', gs.drive || ''); d.hidden = !gs.drive; }
    if (phase !== cur) t.setAttribute('data-phase', phase);
  }
  function hubHtml(latest, sb, posts, used) {
    var sn = showNext(), ep = BUNDLE.show.episode;
    var mLatest = '<section class="fp-mod fp-mod-latest" aria-label="Latest stories"><h2>Latest</h2><ol class="fp-latest">' + latest.map(function (p) {
      return '<li>' + link(p.url, '<time datetime="' + p.date.toISOString() + '">' + esc(ago(p.date)) + '</time><div><h3 class="fp-hl">' + esc(p.title) + '</h3><p class="fp-meta">' + esc(p.author) + '</p></div>') + '</li>'; }).join('') +
      '</ol><a class="fp-more" href="' + esc(L.latest) + '">All stories <span aria-hidden="true">&nbsp;→</span></a></section>';
    var mShow = '<section class="fp-mod fp-mod-show fp-show" data-live="' + (sn.live ? 1 : 0) + '" aria-label="The Buddy Martin Show"><h2>The Buddy Martin Show</h2><p class="fp-show-when"><span class="fp-live-dot" aria-hidden="true"></span><span data-fp-show>' + esc(sn.live ? 'Live now' : 'Next live: ' + sn.label) + '</span></p>' +
      '<p class="fp-ex">Mondays, Wednesdays and Thursdays at 9 p.m. ET.</p><div class="fp-actions"><a class="fp-btn" href="' + esc(L.youtubeLive) + '" rel="noopener">Watch on YouTube</a><a class="fp-btn fp-ghost" href="' + esc(L.facebook) + '" rel="noopener">Facebook</a></div>' +
      (ep ? '<a class="fp-vid" href="https://www.youtube.com/watch?v=' + esc(ep.id) + '" rel="noopener"><span class="fp-frame">' + img('https://i.ytimg.com/vi/' + ep.id + '/hqdefault.jpg', '', false, 480, 360) + '<span class="fp-play"></span></span><span><b>' + esc(ep.title) + '</b><span>From the show · ' + esc(shortDate(Date.parse(ep.date + 'T16:00:00Z'))) + '</span></span></a>' : '') +
      '<a class="fp-more" href="' + esc(L.show) + '">GatorBait TV &amp; podcasts <span aria-hidden="true">&nbsp;→</span></a></section>';
    var mClips = BUNDLE.clips.length ? '<section class="fp-mod fp-mod-clips" aria-label="Clips"><h2>Clips</h2><div class="fp-clips">' + BUNDLE.clips.slice(0, 2).map(function (c) {
      return '<a class="fp-clip" href="https://www.youtube.com/shorts/' + esc(c.id) + '" rel="noopener"><span class="fp-frame">' + img('https://i.ytimg.com/vi/' + c.id + '/hqdefault.jpg', '', false, 480, 360) + '<span class="fp-play"></span></span><b>' + esc(c.title) + '</b></a>'; }).join('') +
      '</div><a class="fp-more" href="' + esc(L.youtubeChannel) + '" rel="noopener">More on YouTube <span aria-hidden="true">&nbsp;→</span></a></section>' : '';
    var gal = posts.filter(function (p) { return p.image && /spears/i.test(p.title + ' ' + p.author) && /(photo|galler|best shots)/i.test(p.title); }).slice(0, 2)
      .map(function (p) { return { title: p.title, url: p.url, image: p.image }; });
    if (!gal.length) gal = BUNDLE.galleries.slice(0, 2);
    var mPhotos = '<section class="fp-mod fp-mod-photos" aria-label="Photographs"><h2>Photos · Chris Spears</h2><div class="fp-photos">' + gal.map(function (g) {
      return '<a class="fp-photo" href="' + esc(g.url) + '"><span class="fp-frame">' + img(g.image, g.title, false) + '</span><span class="fp-cap"><b>Photo by Chris Spears, GatorBait Media</b></span><b>' + esc(g.title) + '</b></a>'; }).join('') + '</div></section>';
    var l = sb.last, n = sb.next, scores = '';
    if (l && l.score) {
      var F = { abbr: 'FLA', score: l.score.fla, q: l.quarters ? l.quarters.fla : [] }, O = { abbr: abbr(l.opponent, l.opponentAbbr), score: l.score.opp, q: l.quarters ? l.quarters.opp : [] };
      scores += '<div class="fp-score-head"><span>Final · ' + esc(ranked(l.opponentRank, l.opponent)) + '</span><span>' + esc(ymdOf(l.date) ? MONTHS[Number(ymdOf(l.date).slice(5, 7)) - 1] + ' ' + Number(ymdOf(l.date).slice(8)) : '') + '</span></div>' +
        lineTable({ away: l.home ? O : F, home: l.home ? F : O }, 'fp-mini');
      var st = l.stats || {}, tape = [['totalYards', 'Total yards'], ['rushYards', 'Rushing yards'], ['firstDowns', 'First downs'], ['attendance', 'In The Swamp']].filter(function (x) { return st[x[0]] != null; });
      if (tape.length) scores += '<div class="fp-tape">' + tape.map(function (x) { return '<div><strong data-fp-num="' + st[x[0]] + '">' + fmtNum(st[x[0]]) + '</strong><span>' + (x[0] === 'attendance' && !l.home ? 'Attendance' : x[1]) + '</span></div>'; }).join('') + '</div>';
      if (l.recapUrl) scores += '<a class="fp-more" href="' + esc(l.recapUrl) + '">Read the recap <span aria-hidden="true">&nbsp;→</span></a>';
    }
    if (n) scores += '<a class="fp-next" href="' + esc(n.previewUrl || L.schedule) + '"><span>Next · ' + esc(n.tv || '') + '</span><b>' + esc(ranked(sb.team.rank, 'Florida') + (n.home ? ' vs. ' : ' at ') + ranked(n.opponentRank, n.opponent)) + '</b><span>' + esc(gameWhen(n.kickoffIso) + (n.venue ? ' · ' + n.venue : '')) + '</span>' + cd(n.kickoffIso) + '</a>';
    var upcoming = sb.schedule.filter(function (g) { return g.status === 'scheduled' && (!n || g.date !== n.kickoffIso); }).slice(0, 3);
    if (upcoming.length) scores += '<table class="fp-stand"><caption class="fp-sr">Upcoming schedule</caption><thead><tr><th scope="col">Coming up</th><th scope="col">Date</th><th scope="col">TV</th></tr></thead><tbody>' + upcoming.map(function (g) {
      var t = Date.parse(g.date), e = et(t), tba = /T0[45]:00:00/.test(g.date);
      return '<tr><td>' + esc((g.home ? 'vs. ' : 'at ') + ranked(g.rank, g.opponent)) + '</td><td>' + esc(tba ? MONTHS[new Date(t).getUTCMonth()] + ' ' + new Date(t).getUTCDate() : MONTHS[e.mo] + ' ' + e.d) + '</td><td>' + esc(g.tv || 'TBA') + '</td></tr>'; }).join('') + '</tbody></table>';
    if (sb.standings.length) scores += '<table class="fp-stand"><caption class="fp-sr">SEC standings</caption><thead><tr><th scope="col">SEC</th><th scope="col">Conf.</th><th scope="col">Overall</th></tr></thead><tbody>' + sb.standings.slice(0, 6).map(function (r) { return '<tr' + (/^florida$/i.test(r.team) ? ' class="fp-us"' : '') + '><td>' + esc(r.team) + '</td><td>' + esc(r.conf) + '</td><td>' + esc(r.overall) + '</td></tr>'; }).join('') + '</tbody></table>';
    scores += '<div class="fp-chips"><a href="' + esc(L.schedule) + '">Schedule</a><a href="' + esc(L.roster) + '">Roster</a><a href="' + esc(L.stats) + '">Stats</a><a href="' + esc(L.standings) + '">Standings</a></div>';
    var mScores = '<section class="fp-mod fp-mod-scores" aria-label="Scores and schedule"><h2>Scores &amp; Schedule · Florida ' + esc(sb.team.record || '') + '</h2>' + scores + '</section>';
    var cover = posts.find(function (p) { return p.image && !used[p.image] && !p.portrait && !isSpears(p); }) || posts.find(function (p) { return p.image; });
    var mMag = '<section class="fp-mod fp-mag" aria-label="GatorBait Magazine"><div class="fp-mag-copy"><h2>The Thursday Magazine</h2><p class="fp-ex">The columns, characters and photographs worth keeping. The cover lives on the Magazine, not here.</p><div class="fp-actions"><a class="fp-btn" href="' + esc(L.magazine) + '">Open the Magazine <span aria-hidden="true">→</span></a></div></div>' +
      (cover ? '<a class="fp-cover" href="' + esc(L.magazine) + '" aria-label="GatorBait Magazine">' + img(cover.image, '', false) + '<span class="fp-cover-mh">GatorBait<small>Magazine · Thursday</small></span><span class="fp-cover-t"><em>' + esc(cover.author) + '</em>' + esc(splitTitle(cover.title).h) + '</span></a>' : '') + '</section>';
    var mNews = '<section class="fp-mod fp-mod-news" aria-label="Newsletter"><h2>The GatorBait Email</h2><p class="fp-ex">One email a day with the Gators stories that matter. Free to join.</p><div class="fp-actions"><a class="fp-btn fp-ghost" href="' + esc(L.newsletter) + '">Sign up <span aria-hidden="true">→</span></a></div></section>';
    return '<section class="fp-hub" aria-label="The GatorBait hub"><div class="fp-wrap"><div class="fp-hub-head"><h2>The Hub</h2><p>Stories, scores, the show, clips and photos. Everything GatorBait, in one place.</p></div><div class="fp-hub-grid">' +
      mLatest + mScores + mShow + mClips + mPhotos + mMag + mNews + '</div></div></section>';
  }

  /* ---------- Live bits: countdowns, count-up, show status, embers ---------- */
  function renderCountdowns(root) {
    var t = now();
    root.querySelectorAll('[data-fp-count]').forEach(function (el) {
      var k = Date.parse(el.getAttribute('data-fp-count')), s = Math.max(0, Math.floor((k - t) / 1000));
      var parts = [[Math.floor(s / 86400), 'd'], [Math.floor(s / 3600) % 24, 'h'], [Math.floor(s / 60) % 60, 'm'], [s % 60, 's']];
      if (!el.firstChild) el.innerHTML = parts.map(function (p, i) { return '<span' + (i === 3 ? ' class="fp-cd-s"' : '') + '><b></b><b></b><i>' + p[1] + '</i></span>'; }).join('');
      var bs = el.querySelectorAll('b');
      parts.forEach(function (p, i) {
        var two = String(p[0]).padStart(2, '0');
        [0, 1].forEach(function (j) { var b = bs[i * 2 + j]; if (b && b.textContent !== two[j]) { var first = !b.textContent; b.textContent = two[j]; if (!first) { b.classList.remove('fp-flip'); void b.offsetWidth; b.classList.add('fp-flip'); } } });
      });
      el.hidden = s === 0;
      if (s === 0) { var tn = el.closest('.fp-tunnel'); if (tn && tn.getAttribute('data-phase') === 'pre') tn.setAttribute('data-phase', 'kick'); }
      el.setAttribute('aria-label', parts[0][0] + ' days ' + parts[1][0] + ' hours ' + parts[2][0] + ' minutes to kickoff');
    });
    var show = root.querySelector('.fp-show');
    if (show) { var sn = showNext(), label = sn.live ? 'Live now' : 'Next live: ' + sn.label, sp = show.querySelector('[data-fp-show]'); if (sp && sp.textContent !== label) sp.textContent = label; show.setAttribute('data-live', sn.live ? '1' : '0'); }
  }
  function startTicking(root) {
    stopTicking();
    renderCountdowns(root);
    if (!root.querySelector('[data-fp-count]') && !root.querySelector('.fp-show')) return;
    tickTimer = setInterval(function () { if (!document.hidden && root.isConnected) renderCountdowns(root); if (!root.isConnected) stopTicking(); }, 1000);
  }
  function stopTicking() { if (tickTimer) clearInterval(tickTimer); tickTimer = 0; }
  function countUp(root) {
    if (reduced() || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return; io.unobserve(en.target);
        var el = en.target, end = Number(el.getAttribute('data-fp-num')), t0 = performance.now();
        (function step(ts) { var k = Math.min(1, (ts - t0) / 900), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.textContent = fmtNum(v); if (k < 1) requestAnimationFrame(step); })(t0);
      });
    }, { threshold: 0.6 });
    root.querySelectorAll('[data-fp-num]').forEach(function (el) { io.observe(el); });
  }
  function embers(root) {
    if (reduced() || !root.classList.contains('fp-embers-on')) return;
    var opts = { fullScreen: { enable: false }, fpsLimit: 40, detectRetina: true, pauseOnBlur: true, pauseOnOutsideViewport: true, background: { color: 'transparent' },
      particles: { number: { value: innerWidth < 700 ? 45 : 80 }, color: { value: ['#fa4616', '#ff7a3d', '#ffb27a'] }, shape: { type: 'circle' },
        opacity: { value: { min: 0.15, max: 0.75 }, animation: { enable: true, speed: 0.6, sync: false } }, size: { value: { min: 0.8, max: 2.6 } },
        move: { enable: true, direction: 'top', speed: { min: 0.3, max: 1.1 }, random: true, straight: false, outModes: { default: 'out' } } } };
    function go() {
      if (!root.isConnected || !window.tsParticles || !document.getElementById('fp-embers')) return;
      window.tsParticles.load({ id: 'fp-embers', options: opts }).then(function (c) { particles = c; if (document.hidden && c) c.pause(); }).catch(function () {});
    }
    if (window.tsParticles) { go(); return; }
    var s = document.getElementById('gbm-fp-tsparticles');
    if (!s) { s = document.createElement('script'); s.id = 'gbm-fp-tsparticles'; s.src = TSP; s.async = true; s.crossOrigin = 'anonymous'; document.head.appendChild(s); }
    s.addEventListener('load', go, { once: true });
  }
  document.addEventListener('visibilitychange', function () {
    if (!particles) return;
    try { if (document.hidden) particles.pause(); else particles.play(); } catch (_) {}
  });
  function ensureFonts() {
    if (!document.getElementById('gbm-fp-fonts')) {
      var l = document.createElement('link'); l.id = 'gbm-fp-fonts'; l.rel = 'stylesheet'; l.href = FONTS; document.head.appendChild(l);
    }
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.race([Promise.all([document.fonts.load('800 88px "Barlow Condensed"'), document.fonts.load('400 16px "Barlow"')]).catch(function () {}),
      new Promise(function (r) { setTimeout(r, 900); })]);
  }

  /* ---------- Render ---------- */
  function failure(error) {
    loading = false;
    if (window.__GBM_GAZETTE_BOOT__ && window.__GBM_GAZETTE_BOOT__.fallback) window.__GBM_GAZETTE_BOOT__.fallback(error);
    else console.error('[GatorBait front page]', error);
  }
  function render(posts, fresh, sb) {
    if (!home()) { loading = false; return; }
    if (posts.length < 3) throw new Error('Insufficient public stories');
    var existing = document.getElementById('gbm-live');
    if (existing && existing.classList.contains('gbm-gazette')) { loading = false; return; }
    if (existing) throw new Error('Another homepage owner already mounted');
    var picked = pickLead(posts), lead = picked.post, shown = {}, used = {};
    shown[lead.url] = 1; if (lead.image) used[lead.image] = 1;
    function take(list, n, test) { var out = []; list.forEach(function (p) { if (out.length < n && !shown[p.url] && (!test || test(p))) { shown[p.url] = 1; if (p.image) used[p.image] = 1; out.push(p); } }); return out; }
    // Secondary feature: newest columnist story with a photo (Franz first), then any story with a photo.
    var feature = take(posts, 1, function (p) { return p.image && /franz beard/i.test(p.author); })[0] ||
      take(posts, 1, function (p) { return p.image && !/staff/i.test(p.author) && !isSpears(p); })[0] || take(posts, 1, function (p) { return !!p.image; })[0];
    var list = take(posts, 4, function (p) { return !isSpears(p) || !/(photo|galler|best shots)/i.test(p.title); });
    var cols = columnistsHtml(posts);
    var latest = take(posts, 8);
    var gs = gameState(sb), mode = modes(sb);
    var root = document.createElement('div');
    root.id = 'gbm-live';
    root.className = 'gbm-gazette gbm-sports-home fp26' + (mode.night ? ' fp-night' : ' fp-day') + (mode.gameday ? ' fp-gameday' : '') + (mode.embers ? ' fp-embers-on' : '');
    root.setAttribute('data-theme', mode.night ? 'dark' : 'light');
    root.setAttribute('data-fp', VERSION);
    root.setAttribute('data-fp-build', String(BUNDLE.build || ''));
    root.setAttribute('data-fp-lead', picked.why);
    root.setAttribute('data-fp-scoreboard', sb.source);
    root.setAttribute('data-gazette-source', fresh ? 'current-feed' : 'last-known-feed');
    root.setAttribute('data-gazette-newest', posts[0].date.toISOString());
    root.innerHTML = '<a class="fp-skip" href="#sh-main">Skip to stories</a>' + tickerHtml(posts, sb, gs) + mastHtml() + navHtml(sb, gs) +
      (mode.gameday ? tunnelHtml(gs, sb, posts, lead.url) + (gs && gs.phase !== 'pre' ? boardHtml(gs) : '') : '') +
      '<main id="sh-main"><div class="fp-wrap"><div id="sh-freshness"></div>' + leadHtml(lead, picked.why) + quoteHtml(lead, posts) + secondHtml(feature, list, cols) + '</div>' +
      roadHtml(sb) + hubHtml(latest, sb, posts, used) + '</main>';
    if (!document.getElementById('gbm-fp26-styles')) {
      var style = document.createElement('style'); style.id = 'gbm-fp26-styles'; style.textContent = CSS; document.head.appendChild(style);
    }
    // The split Wix-served embeds still inject the old renderer's #gbgz-styles; switch it off, keep the element.
    var old = document.getElementById('gbgz-styles'); if (old && old.media !== 'not all') old.media = 'not all';
    var shell = document.getElementById('gbm-mobile-shell-host');
    if (shell && shell.parentNode) shell.parentNode.insertBefore(root, shell.nextSibling);
    else document.body.insertBefore(root, document.body.firstChild);
    doc.classList.add('gbm-gazette-live', 'gbm-standalone-live');
    try { initRoad(root); } catch (_) {}
    loading = false;
    window.__GBM_GAZETTE_RUNTIME__.ready = true;
    if (window.__GBM_GAZETTE_BOOT__ && window.__GBM_GAZETTE_BOOT__.ready) window.__GBM_GAZETTE_BOOT__.ready();
    requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.remove('gbm-prepaint-v2'); }); });
    startTicking(root); countUp(root); embers(root);
    document.dispatchEvent(new CustomEvent('gbm:gazette-ready', { detail: { stories: posts.length, fresh: fresh, lead: picked.why, version: VERSION } }));
  }
  // After paint the scoreboard can only change values in place (never structure), so nothing moves.
  function patchScores(raw) {
    var root = document.getElementById('gbm-live'); if (!root || !root.classList.contains('fp26')) return;
    var sb = readScoreboard(raw);
    root.setAttribute('data-fp-scoreboard', sb.source);
    if (sb.next) root.querySelectorAll('[data-fp-count]').forEach(function (el) { if (el.getAttribute('data-fp-count') !== sb.next.kickoffIso && Date.parse(sb.next.kickoffIso) > now()) { el.setAttribute('data-fp-count', sb.next.kickoffIso); el.innerHTML = ''; } });
    renderCountdowns(root);
    patchRoad(root, sb);
    patchTunnel(root, sb);
  }
  // The season band is the one block allowed to change after paint: it sits below the fold, so a band that the
  // feed adds or refreshes only swaps while it is off screen (same card count keeps the same height).
  function patchRoad(root, sb) {
    var html = roadHtml(sb); if (!html) return;
    var tmp = document.createElement('div'); tmp.innerHTML = html;
    var fresh = tmp.firstChild, cur = root.querySelector('#gbm-road'), hub = root.querySelector('.fp-hub');
    var anchor = cur || hub; if (!fresh || !anchor) return;
    var box = anchor.getBoundingClientRect(); if (box.bottom > 0 && box.top < innerHeight + 120) return;
    if (cur) {
      if (cur.getAttribute('data-sig') === fresh.getAttribute('data-sig') || cur.querySelectorAll('.g').length !== fresh.querySelectorAll('.g').length) return;
      cur.parentNode.replaceChild(fresh, cur);
    } else hub.parentNode.insertBefore(fresh, hub);
    try { initRoad(root); } catch (_) {}
  }

  function fetchJson(url, ms) {
    var c = new AbortController(), t = setTimeout(function () { c.abort(); }, ms);
    return fetch(url, { signal: c.signal, credentials: 'omit', cache: 'no-store' }).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); });
  }
  function fetchRss() {
    var c = new AbortController(), t = setTimeout(function () { c.abort(); }, 4000);
    return fetch(RSS + '?t=' + Math.floor(Date.now() / 60000), { signal: c.signal, credentials: 'omit', cache: 'no-store' }).then(function (r) {
      clearTimeout(t); if (!r.ok) throw new Error('Content response ' + r.status);
      return r.text().then(function (xml) {
        var feed = new DOMParser().parseFromString(xml, 'text/xml');
        function text(n, key) { var el = Array.from(n.children).find(function (c) { return c.localName === key; }); return el ? el.textContent.trim() : ''; }
        return { posts: Array.from(feed.querySelectorAll('item')).map(function (n) { var enc = n.querySelector('enclosure'); return { title: text(n, 'title'), excerpt: text(n, 'description'), author: text(n, 'creator'), url: text(n, 'link'), firstPublishedDate: text(n, 'pubDate'), image: { src: enc ? enc.getAttribute('url') : '', alt: text(n, 'title') } }; }) };
      });
    });
  }
  function start() {
    if (!home() || loading || document.querySelector('#gbm-live.gbm-gazette')) return;
    loading = true;
    // Fallback: the bundled snapshot, or the Wix-served data part when it is newer.
    var fallback = { posts: BUNDLE.posts }, wixData = window.__GBM_HOME_FALLBACK__, cached;
    try { if (wixData && normalize(wixData).length >= 3 && normalize(wixData)[0].date > normalize(fallback)[0].date) fallback = wixData; } catch (_) {}
    var initial = fallback;
    try { cached = JSON.parse(sessionStorage.getItem('gbm-public-feed') || 'null'); if (cached && Date.now() - cached.saved < 900000 && normalize(cached.data).length >= 3 && normalize(cached.data)[0].date >= normalize(fallback)[0].date) initial = cached.data; } catch (_) {}
    var painted = false, scoreRaw, scoreDone = false, fontsDone = false, feedData = null, deadline = false;
    function paint(data, fresh) {
      if (painted) return; painted = true;
      try { render(normalize(data), fresh, readScoreboard(scoreRaw)); } catch (error) { failure(error); }
    }
    function maybePaint() {
      if (painted || !fontsDone) return;
      if (feedData && (scoreDone || deadline)) paint(feedData, true);
      else if (deadline) paint(initial, initial !== fallback);
    }
    ensureFonts().then(function () { fontsDone = true; maybePaint(); });
    // Same 1.5 s budget as the previous renderer: paint once with the best data in hand, never repaint.
    var timer = setTimeout(function () { deadline = true; fontsDone = true; maybePaint(); }, 1500);
    if (initial !== fallback) feedData = initial;
    fetchJson(PAGES + 'sports-live/scoreboard.json?t=' + Math.floor(Date.now() / 60000), 2500).then(function (raw) {
      if (!painted) { scoreRaw = raw; scoreDone = true; maybePaint(); } else patchScores(raw);
    }).catch(function () { scoreDone = true; maybePaint(); });
    fetchRss().catch(function () { return fetchJson(PAGES + 'gazette-live/posts.json', 3000); }).then(function (data) {
      var posts = normalize(data); if (posts.length < 3) throw new Error('Invalid current content');
      try { sessionStorage.setItem('gbm-public-feed', JSON.stringify({ saved: Date.now(), data: data })); } catch (_) {}
      if (!painted) { feedData = data; maybePaint(); return; }
      var root = document.getElementById('gbm-live');
      if (root && posts[0].date.toISOString() !== root.getAttribute('data-gazette-newest')) {
        var freshness = document.getElementById('sh-freshness');
        if (freshness) { freshness.textContent = ''; var a = document.createElement('a'); a.href = '/'; a.textContent = 'New stories available — refresh'; a.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); location.reload(); }); freshness.appendChild(a); }
      } else if (root) root.setAttribute('data-gazette-source', 'current-feed');
    }).catch(function () { clearTimeout(timer); deadline = true; fontsDone = true; maybePaint(); });
  }

  function sync() {
    if (!home()) {
      var root = document.querySelector('#gbm-live.gbm-gazette'); if (root) root.remove();
      stopTicking(); if (io) { io.disconnect(); io = null; }
      if (particles) { try { particles.destroy(); } catch (_) {} particles = null; }
      doc.classList.remove('gbm-gazette-live', 'gbm-standalone-live');
      window.__GBM_GAZETTE_RUNTIME__.ready = false;
    } else start();
  }
  window.__GBM_GAZETTE_RUNTIME__ = { sync: sync, ready: false, version: VERSION };
  window.addEventListener('popstate', sync);
  window.addEventListener('gbmroutechange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
