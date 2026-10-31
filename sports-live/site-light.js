/* GatorBait sitewide LIGHT skin (Oct. 31, 2026). Brenden: "I hate the black background ... I don't want a dark theme."
 * One external pinned file for every page EXCEPT the homepage ("/", which has its own light skin in broadcast-home-light.js) and /magazine (own skin).
 * Loaded by one ESSENTIAL HEAD embed (deploy/sitewide-light-20261031/loader.html). Vanilla JS, idempotent, no network, no storage, no cookies.
 * It injects ONE <style id="gbm-sl-css"> scoped under html.gb-sl (toggled by route, so it does nothing on / and /magazine), plus a small DOM pass
 * that tags leftover dark Wix containers and the cookie-banner buttons. Rollback: disable the loader embed. Notes: deploy/sitewide-light-20261031/README.md.
 * Brand: Gator blue #0021A5, Gator orange #FA4616, white, surface #F4F6FA, text #111827, green #22884C (tiny marks only). No navy. Barlow only.
 * Orange as TEXT on white is #B8360F (AA); orange is otherwise a fill or rule. */
(function () {
  'use strict';
  if (window.__GBM_SITE_LIGHT__) { if (window.__GBM_SITE_LIGHT__.sync) window.__GBM_SITE_LIGHT__.sync(); return; }
  var doc = document, root = doc.documentElement;
  function route() { return (location.pathname.replace(/\/+$/, '') || '/'); }
  function skip(p) { return p === '/' || /^\/magazine(\/|$)/.test(p); }

  /* Specificity: the macro § becomes html.gb-sl plus two :is() id bumps, so these rules beat the older embed rules (many are html body #SITE_PAGES ... !important). */
  var PFX = 'html.gb-sl:not(.gb-light):is(html,#sl1):is(html,#sl2)';
  var T = '#111827', MU = '#4B5563', LN = '#E1E5EC', BG = '#F4F6FA', BL = '#0021A5', OR = '#FA4616', OT = '#B8360F';
  var CSS = [
    /* ---------- tokens and page surface ---------- */
    '§{--sl-bl:#0021A5;--sl-or:#FA4616;--sl-ot:#B8360F;--sl-bg:#F4F6FA;--sl-tx:#111827;--sl-mu:#4B5563;--sl-ln:#E1E5EC;--sl-gr:#22884C;color-scheme:light;background:#fff!important}',
    '§ body,§ #SITE_CONTAINER,§ #masterPage,§ #SITE_PAGES,§ #PAGES_CONTAINER,§ #SITE_PAGES_TRANSITION_GROUP,§ [id^=pageBackground_],§ [id^=bgLayers_pageBackground_],§ [id^=bgMedia_pageBackground_]{background:#F4F6FA!important;background-image:none!important;COLOR:#111827}',
    '§ body{font-family:Barlow,Arial,sans-serif}',
    '§ #SITE_PAGES{--gb-bg:#F4F6FA;--gb-card:#fff;--gb-line:#E1E5EC;--gb-white:#111827;--gb-body:#111827;--gb-muted:#4B5563}',
    /* generic Wix text on app pages (About, Contact, account, store): dark text, never white on light */
    '§ #SITE_PAGES [data-testid=richTextElement],§ #SITE_PAGES [data-testid=richTextElement] *:not(a):not(button):not(button *):not([data-testid=buttonElement] *):not([data-sl-photo] *):not(#gbm-renew-card *):not(#gbm-gate *):not(#gbm-kr *){color:#111827!important;-webkit-text-fill-color:#111827!important}',
    '§ #SITE_PAGES [data-testid=richTextElement] a{color:#0021A5!important;-webkit-text-fill-color:#0021A5!important}',
    '§ #SITE_PAGES a:focus-visible,§ #SITE_PAGES button:focus-visible,§ #SITE_PAGES input:focus-visible,§ #SITE_PAGES textarea:focus-visible,§ #SITE_PAGES select:focus-visible,§ #SITE_PAGES [tabindex]:focus-visible{outline:3px solid #0021A5!important;outline-offset:2px!important;box-shadow:none!important}',
    '§ [data-sl-dark]{background:#fff!important;background-image:none!important;COLOR:#111827!important;-webkit-text-fill-color:currentColor}',
    '§ [data-sl-dark] :is(h1,h2,h3,h4,h5,h6,p,li,span,label,div):not(a *):not(button *):not([data-testid=buttonElement] *){color:#111827!important;-webkit-text-fill-color:#111827!important}',
    '§ [data-sl-dark] a:not([data-testid=buttonElement]){color:#0021A5!important;-webkit-text-fill-color:#0021A5!important}',

    '§ [data-sl-photo] :is(h1,h2,h3,h4,p,span,div):not(button *):not([data-testid=buttonElement] *){color:#fff!important;-webkit-text-fill-color:#fff!important;text-shadow:0 2px 14px rgba(0,0,0,.6)}',
    '§ img[data-hook=image-viewer],§ [data-hook=image-viewer]{background:#E5E7EB!important}',
    /* ---------- header (desktop) ---------- */
    '§ #gbm-site-header{background:#fff!important;COLOR:#111827!important;border-bottom:0}',
    '§ #gbm-site-header .sh-tick{background:#fff!important;border-bottom:1px solid #E1E5EC!important}',
    '§ #gbm-site-header .sh-bug{background:#F4F6FA!important;color:#111827!important}',
    '§ #gbm-site-header .sh-bug:before{box-shadow:none!important}',
    '§ #gbm-site-header .sh-run a{color:#111827!important;border-right-color:#E1E5EC!important}',
    '§ #gbm-site-header .sh-run a:hover,§ #gbm-site-header .sh-util a:hover,§ #gbm-site-header nav a:hover{color:#0021A5!important}',
    '§ #gbm-site-header .sh-run em{color:#B8360F!important}',
    '§ #gbm-site-header .sh-util a{color:#111827!important}§ #gbm-site-header .sh-util .sh-shop{color:#B8360F!important}',
    '§ #gbm-site-header .sh-bar{background:#fff!important}',
    '§ #gbm-site-header .sh-bar:after{height:3px!important;background:#FA4616!important}',
    '§ #gbm-site-header .sh-logo,§ #gbm-site-header .sh-logo b{color:#111827!important}§ #gbm-site-header .sh-logo b{color:#FA4616!important}§ #gbm-site-header .sh-logo small{color:#4B5563!important}',
    '§ #gbm-site-header nav a{color:#111827!important}',
    '§ #gbm-site-header nav [aria-current]{color:#0021A5!important;box-shadow:inset 0 -3px 0 #FA4616!important}',
    '§ #gbm-site-header .sh-cta,§ #gbm-site-header .sh-cta span{background:#FA4616!important;color:#111827!important;box-shadow:none!important}',
    '§ #gbm-site-header .sh-cta:hover{background:#d33608!important;color:#fff!important}§ #gbm-site-header .sh-cta:hover span{color:#fff!important;background:none!important}',
    '§ #gbm-site-header a:focus-visible{outline-color:#0021A5!important}',

    /* ---------- title band under the header (S4 pages) ---------- */
    '§ #gbm-band{background:#fff!important;COLOR:#111827!important;border-bottom:3px solid #FA4616}',
    '§ #gbm-band:after{display:none!important}',
    '§ #gbm-band p{color:#111827!important;text-shadow:none!important}',
    '§ #gbm-band .gbm-band-k b{background:#FA4616!important;color:#111827!important;border:0!important}',
    '§ #gbm-band .gbm-band-k span{background:#fff!important;color:#0021A5!important;border:1px solid #0021A5!important}',

    /* ---------- footer ---------- */
    '§ body #gbm-footer#gbm-footer{background:#fff!important;COLOR:#111827!important;border-top:4px solid #FA4616!important}',
    '§ body #gbm-footer#gbm-footer:before{display:none!important}',
    '§ #gbm-footer,§ #gbm-footer *{border-color:#E1E5EC!important}',
    '§ #gbm-footer h2,§ #gbm-footer a,§ #gbm-footer li{color:#111827!important}',
    '§ #gbm-footer .gbf-shop p,§ #gbm-footer .gbf-base,§ #gbm-footer .gbf-base *{color:#4B5563!important}',
    '§ #gbm-footer .gbf-map h3{color:#B8360F!important}',
    '§ body #gbm-footer#gbm-footer .gbf-map a:hover{color:#0021A5!important;text-decoration-color:#FA4616!important}',
    '§ body #gbm-footer#gbm-footer a.gbf-btn,§ body #gbm-footer#gbm-footer a.gbf-btn *{background:#FA4616!important;color:#111827!important;box-shadow:none!important}§ body #gbm-footer#gbm-footer a.gbf-btn *{background:none!important}',
    '§ #gbm-footer a:focus-visible{outline-color:#0021A5!important}',
    '§ #SITE_FOOTER [id^=bgMedia_],§ #SITE_FOOTER [id^=bgLayers_]>div{background:#fff!important}',

    /* ---------- phone shell + off-canvas drawer ---------- */
    '@media(max-width:820px){',
    '§ #gbm-mobile-shell{background:#0021A5!important;background-image:none!important;border:0!important;border-bottom:3px solid #FA4616!important;box-shadow:none!important}',
    '§ #gbm-mobile-shell .gbm-ms-logo,§ #gbm-mobile-shell .gbm-ms-logo:before,§ #gbm-mobile-shell .gbm-ms-logo:after{color:#fff!important;-webkit-text-fill-color:#fff!important}',
    '§ #gbm-mobile-shell .gbm-ms-trigger{border-color:#fff!important;color:#fff!important;background:transparent!important}§ #gbm-mobile-shell .gbm-ms-bars i{background:#fff!important}',
    '§ #gbm-mobile-shell .gbm-ms-shop{background:#FA4616!important;color:#111827!important;-webkit-text-fill-color:#111827!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-backdrop{background:rgba(17,24,39,.45)!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-panel{background:#fff!important;background-image:none!important;box-shadow:-18px 0 48px rgba(17,24,39,.22)!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-head{background:#fff!important;border-top:4px solid #FA4616!important;box-shadow:inset 0 -1px 0 #E1E5EC!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-head a{color:#0021A5!important;-webkit-text-fill-color:#0021A5!important}§ #gbm-mobile-drawer-root .gbm-ms-head a:after{color:#B8360F!important;-webkit-text-fill-color:#B8360F!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-close{background:#fff!important;color:#111827!important;border-color:#9CA3AF!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-nav a{background:#fff!important;color:#111827!important;-webkit-text-fill-color:#111827!important;border-bottom-color:#E1E5EC!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-nav a[aria-current=page]{background:#F4F6FA!important;border-left:4px solid #FA4616!important;color:#0021A5!important;-webkit-text-fill-color:#0021A5!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-nav a.gbm-ms-shop{background:#FA4616!important;color:#111827!important;-webkit-text-fill-color:#111827!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-nav a.gbm-ms-join{background:#0021A5!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border-left:0!important}',
    '§ #gbm-mobile-drawer-root .gbm-ms-foot{color:#4B5563!important}§ #gbm-mobile-drawer-root .gbm-ms-foot a{color:#0021A5!important;-webkit-text-fill-color:#0021A5!important}',
    '}',

    /* ---------- cookie banner (Wix) and the game-day bar ---------- */
    '§ .consent-banner-root,§ .consent-banner-root *{background-color:transparent}',
    '§ .consent-banner-root{background:#fff!important;COLOR:#111827!important;border-top:3px solid #FA4616!important;box-shadow:0 -6px 24px rgba(17,24,39,.14)!important}',
    '§ .consent-banner-root :is(p,span,div,a,button,svg){color:#111827!important;fill:currentColor}',
    '§ .consent-banner-root a,§ .consent-banner-root [data-sl=settings]{color:#0021A5!important;text-decoration:underline}',
    '§ .consent-banner-root [data-sl=decline]{background:#fff!important;color:#0021A5!important;border:2px solid #0021A5!important}',
    '§ .consent-banner-root [data-sl=accept]{background:#0021A5!important;color:#fff!important;border:2px solid #0021A5!important}§ .consent-banner-root [data-sl=accept] *{color:#fff!important}',
    '§ .consent-banner-root button:focus-visible{outline:3px solid #FA4616!important;outline-offset:2px}',
    '§ #gbm-gd10-bar{color:#111827!important;box-shadow:0 -4px 18px rgba(17,24,39,.18)!important}§ #gbm-gd10-bar>span{color:#111827!important}§ #gbm-gd10-x{color:#111827!important}',
    '§ #gbm-gd10-bar a.gd-join{background:#0021A5!important;color:#fff!important}',

    /* ---------- article pages (/post/...) ---------- */
    '§ #SITE_PAGES:has([data-hook=post-page]){background:#F4F6FA!important;background-image:none!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div{background:#fff!important;border:1px solid #E1E5EC;box-shadow:0 8px 24px rgba(17,24,39,.08)}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header{background:#0021A5!important;background-image:none!important;box-shadow:none!important;border-bottom:4px solid #FA4616!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header::before{background:#FA4616!important;color:#111827!important;text-shadow:none!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header [data-hook=post-title]{text-shadow:none!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header :is(p,span,a,div,time,li,small,b){color:#fff!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header nav.gbm-kit .gbm-kit-k{color:#fff!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header nav.gbm-kit .gbm-kit-chip.lead{background:#FA4616!important;border-color:#FA4616!important;color:#111827!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header nav.gbm-kit .gbm-kit-chip:is(:hover,:focus-visible){background:#fff!important;color:#0021A5!important}',
    '§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header #gbm-share-btn{background:#FA4616!important;color:#111827!important;text-shadow:none!important}§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header #gbm-share-btn *{color:#111827!important;fill:#111827!important}',
    '§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description],§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] :is(p,li,span,div,strong,em,b,i,td,th):not(blockquote *):not([data-gbm-capture] *):not(#gbm-gate *):not(.gbc *):not(#gbm-kr *):not([data-gbm-stat] *){color:#111827!important}',
    '§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] a:not(#gbm-kr *):not(#gbm-gate *):not(.gbc *){color:#0021A5!important}',
    '§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] :is(h2,h3)[id^=viewer-],§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] p[data-gbm-h]{color:#111827!important;background:linear-gradient(90deg,#FA4616,#FA4616 120px,#E1E5EC 120px) 0 100%/100% 4px no-repeat!important}',
    '§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] blockquote{background:#0021A5!important;background-image:none!important}§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] blockquote *{color:#fff!important}',
    '§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] figure figcaption,§ #SITE_PAGES [data-hook=post-page] [data-hook=post-description] figure figcaption *{color:#4B5563!important}',
    '§ #SITE_PAGES [data-hook=post-page] .gbm-upnext{background:#fff!important;color:#0021A5!important;border:1px solid #E1E5EC!important;box-shadow:0 8px 20px rgba(17,24,39,.1)!important}§ #SITE_PAGES [data-hook=post-page] .gbm-upnext b{color:#0021A5!important}§ #SITE_PAGES [data-hook=post-page] .gbm-upnext small{color:#4B5563!important}§ #SITE_PAGES [data-hook=post-page] .gbm-upnext .gu-c{color:#B8360F!important}§ #SITE_PAGES [data-hook=post-page] .gbm-upnext .gu-l{background:#FA4616!important;color:#111827!important}',
    '§ #SITE_PAGES [data-hook=post-page] [data-hook=post-footer] [data-hook^=share-button]{background:#0021A5!important}§ #SITE_PAGES [data-hook=post-page] [data-hook=post-footer] [data-hook^=share-button]:is(:hover,:focus-visible){background:#FA4616!important}',
    '§ #SITE_PAGES [data-hook=post-page] section:has([data-hook^=wc-root]){background:#fff!important}',
    /* members gate (#gbm-gate) and email capture (.gbc) */
    '§ #gbm-gate{background:#0021A5!important;background-image:none!important;COLOR:#fff!important}',
    '§ #gbm-gate:before{background:#FA4616!important;box-shadow:none!important}',
    '§ #gbm-gate .gg-k b{background:#FA4616!important;color:#111827!important}§ #gbm-gate .gg-k span{background:#fff!important;color:#0021A5!important}',
    '§ #gbm-gate .gg-h,§ #gbm-gate .gg-p{color:#fff!important;text-shadow:none!important}',
    '§ #gbm-gate a.gg-go,§ #gbm-gate a.gg-go span{background:#FA4616!important;color:#111827!important}§ #gbm-gate a.gg-go span{background:none!important}§ #gbm-gate a.gg-go:hover,§ #gbm-gate a.gg-go:hover span{background:#fff!important;color:#0021A5!important}',
    '§ #gbm-gate a.gg-in{color:#fff!important;text-decoration-color:#FA4616!important}§ #gbm-gate a:focus-visible{outline-color:#fff!important}',
    '§ .gbc{background:#0021A5!important}§ .gbc :is(.gbc-h,.gbc-c,.gbc-c span,.gbc-p,.gbc-m,a){color:#fff!important}§ .gbc .gbc-p{opacity:1!important}',
    '§ .gbc .gbc-b,§ .gbc button{background:#FA4616!important;color:#111827!important;border:0!important}',
    '§ .gbc input[type=email],§ .gbc input{background:#fff!important;color:#111827!important;border:1px solid #fff!important}',
    '§ #SITE_PAGES [data-hook=post-page] .gbm-writer-alerts,§ #SITE_PAGES [data-hook=post-page] article[data-hook=post]>div>header .gbm-writer-alerts{background:#FA4616!important;border-color:#FA4616!important;color:#111827!important}',
    /* keep reading module */
    '§ #gbm-kr,§ #gbm-kr .kr-x{background:#fff!important;COLOR:#111827!important;border:1px solid #E1E5EC}',
    '§ #gbm-kr :is(h2,h3,p,span,b,strong,small,div,a){color:#111827!important}',
    '§ #gbm-kr .kr-grid a,§ #gbm-kr .kr-grid img{background:#E5E7EB!important}',
    '§ #gbm-kr .kr-nav a{background:#0021A5!important;color:#fff!important}',
    '§ #gbm-kr .kr-nav a *{color:#fff!important}',
    /* comments */
    '§ [data-hook^=wc-root],§ [data-hook^=wc-root] *,§ [data-hook=comments-container],§ [data-hook=comments-container] *{COLOR:#111827;background-color:transparent}',
    '§ [data-hook^=wc-root] a{color:#0021A5}',

    /* ---------- inputs everywhere ---------- */
    '§ input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=hidden]),§ textarea,§ select{background:#fff!important;color:#111827!important;-webkit-text-fill-color:#111827!important;border:1px solid #6B7280!important;border-radius:6px}',
    '§ input::placeholder,§ textarea::placeholder{color:#4B5563!important;-webkit-text-fill-color:#4B5563!important;opacity:1}',
    '§ #SITE_PAGES label{color:#111827!important}',
    '§ #gbm-lp-search label{color:#111827!important}',

    /* ---------- Latest v2 feed (#gbm-lf) ---------- */
    '§ #gbm-lf{--s:#fff;--s2:#F4F6FA;--ln:#E1E5EC;--tx:#111827;--mu:#4B5563;--pk:#B8360F;--ink:#111827;--g:#22884C;COLOR:#111827}',
    '§ #gbm-lf :is(h2,h3,p){color:#111827}',
    '§ #gbm-lf .lf-title,§ #gbm-lf .lf-lead .lf-lt,§ #gbm-lf .lf-sec-h,§ #gbm-lf .lf-more-h,§ #gbm-lf .lf-sc .lf-ct,§ #gbm-lf .lf-card .lf-ct,§ #gbm-lf .lf-meta b,§ #gbm-lf .lf-chip,§ #gbm-lf .lf-older,§ #gbm-lf .lf-pg a,§ #gbm-lf .lf-search input[type=search]{color:#111827!important;text-shadow:none!important}',
    '§ #gbm-lf .lf-dek,§ #gbm-lf .lf-card .lf-ex,§ #gbm-lf .lf-meta,§ #gbm-lf .lf-status,§ #gbm-lf .lf-date,§ #gbm-lf .lf-sec-h span{color:#4B5563!important}',
    '§ #gbm-lf .lf-kick{color:#B8360F!important}',
    '§ #gbm-lf .lf-tag.lf-alt{background:#E1E5EC!important;color:#111827!important}§ #gbm-lf .lf-tag{color:#111827!important}',
    '§ #gbm-lf .lf-chip,§ #gbm-lf .lf-sc,§ #gbm-lf .lf-card,§ #gbm-lf .lf-older,§ #gbm-lf .lf-pg a{background:#fff!important;border-color:#E1E5EC!important}',
    '§ #gbm-lf .lf-chip:hover,§ #gbm-lf .lf-sc:hover,§ #gbm-lf .lf-card:hover{background:#F4F6FA!important;border-color:#0021A5!important}',
    '§ #gbm-lf .lf-chip[aria-current=page],§ #gbm-lf .lf-pg a[aria-current=page]{background:#0021A5!important;border-color:#0021A5!important;color:#fff!important}',
    '§ #gbm-lf .lf-search input[type=search]{background:#fff!important;border:1px solid #6B7280!important}',
    '§ #gbm-lf .lf-lead{background:#fff!important;border:1px solid #E1E5EC!important;aspect-ratio:auto!important;display:flex!important;flex-direction:column;box-shadow:0 8px 24px rgba(17,24,39,.08)}',
    '§ #gbm-lf .lf-lead::after{display:none!important}',
    '§ #gbm-lf .lf-lead .lf-media{position:relative!important;inset:auto!important;aspect-ratio:16/9}',
    '§ #gbm-lf .lf-lead .lf-body{position:relative!important;padding:18px 22px 22px!important;border-top:4px solid #FA4616;background:#fff}',
    '§ #gbm-lf .lf-lead .lf-lt{font-size:clamp(28px,2.6vw,40px)!important}',
    '§ #gbm-lf .lf-btn,§ #gbm-lf .lf-loadmore,§ #gbm-lf .lf-search button{background:#FA4616!important;color:#111827!important}',
    '§ #gbm-lf .lf-lead:hover .lf-btn,§ #gbm-lf .lf-loadmore:hover{background:#0021A5!important;color:#fff!important}',
    '§ #gbm-lf a:focus-visible,§ #gbm-lf button:focus-visible,§ #gbm-lf input:focus-visible{outline-color:#0021A5!important}',
    '§ #gbm-lf .lf-img{background:#E5E7EB!important}',

    /* ---------- Latest, categories (#gbm-sn nav, #gbm-lp feed, #gbm-lp-search) ---------- */
    '§ #gbm-sn,§ #gbm-lp,§ #gbm-lp-search{--nt:#fff;--mu:#4B5563;--pk:#B8360F;--ed:#E1E5EC;--rail:#E1E5EC}',
    '§ #gbm-sn h1,§ #gbm-lp h1{color:#111827!important;text-shadow:none!important}',
    '§ #gbm-sn .sn-k b,§ #gbm-sn .sn-k i{background:#FA4616!important;color:#111827!important;border-color:#FA4616!important}',
    '§ #gbm-sn nav{background:#fff!important;border:1px solid #E1E5EC!important;box-shadow:none!important;backdrop-filter:none!important}',
    '§ #gbm-sn a{color:#111827!important}§ #gbm-sn a:hover,§ #gbm-sn a:focus-visible{color:#0021A5!important}',
    '§ #gbm-sn a[aria-current=page]{color:#fff!important;background:#0021A5!important;border-color:#0021A5!important}',
    '§ #gbm-sn .sn-2{background:#F4F6FA!important}§ #gbm-sn .sn-2 a{color:#111827!important}§ #gbm-sn .sn-2 a[aria-current=page]{color:#fff!important}§ #gbm-sn .sn-l{color:#B8360F!important}',
    '§ #gbm-lp-search,§ #SITE_PAGES #gbm-lp-search{background:#fff!important;border:1px solid #E1E5EC!important;box-shadow:none!important;backdrop-filter:none!important}',
    '§ #gbm-lp-search input[type=search]{background:#fff!important;color:#111827!important;border:1px solid #6B7280!important}',
    '§ #gbm-lp-search button{background:#FA4616!important;color:#111827!important}§ #gbm-lp-search small{color:#4B5563!important}',
    '§ #gbm-lp .lp-hd,§ #gbm-lp .lp-sec,§ #gbm-lp .lp-rail h2,§ #gbm-lp .lp-rail .lp-hd,§ #gbm-lp .lp-lead .lp-hd{color:#111827!important;text-shadow:none!important}',
    '§ #gbm-lp a:hover .lp-hd,§ #gbm-lp a:focus-visible .lp-hd{color:#0021A5!important}',
    '§ #gbm-lp .lp-by,§ #gbm-lp .lp-rail .lp-by,§ #gbm-lp .lp-date,§ #gbm-lp .lp-pager span,§ #gbm-lp .lp-lead .lp-by{color:#4B5563!important}§ #gbm-lp .lp-by b,§ #gbm-lp .lp-rail .lp-by b,§ #gbm-lp .lp-date b{color:#111827!important}',
    '§ #gbm-lp .lp-cat,§ #gbm-lp .lp-kick,§ #gbm-lp .lp-rail .lp-cat{color:#B8360F!important}',
    '§ #gbm-lp .lp-lead,§ #SITE_PAGES #gbm-lp .lp-lead,§ #gbm-lp .lp-rail,§ #SITE_PAGES #gbm-lp .lp-rail,§ #gbm-lp .lp-card,§ #SITE_PAGES #gbm-lp .lp-card{background:#fff!important;border:1px solid #E1E5EC!important;box-shadow:0 8px 24px rgba(17,24,39,.08)!important;backdrop-filter:none!important}',
    '§ #gbm-lp .lp-rail h2{background:#F4F6FA!important;border-bottom:1px solid #E1E5EC!important}',
    '§ #gbm-lp .lp-rail .lp-row,§ #gbm-lp .lp-grid .lp-card{border-top-color:#E1E5EC!important}',
    '§ #gbm-lp .lp-img{background:#E5E7EB!important}',
    '§ #SITE_PAGES #gbm-lp .lp-lead .lp-img::after{display:none!important}',
    '§ #SITE_PAGES #gbm-lp .lp-lead::before{margin-top:14px!important;background:#FA4616!important;color:#111827!important;border:0!important}',
    '§ #SITE_PAGES #gbm-lp .lp-lead::after{background:#FA4616!important;color:#111827!important}§ #SITE_PAGES #gbm-lp .lp-lead:hover::after,§ #SITE_PAGES #gbm-lp .lp-lead:focus-visible::after{background:#0021A5!important;color:#fff!important}',
    '§ #gbm-lp .lp-pager a{background:#0021A5!important;color:#fff!important}§ #gbm-lp .lp-pager a:hover,§ #gbm-lp .lp-pager a:focus-visible{background:#FA4616!important;color:#111827!important}',
    '§ #gbm-lp .lp-sec::after,§ #gbm-lp .lp-pager{border-color:#E1E5EC!important;background-color:transparent}',
    '§ #gbm-lp .lp-sec::before{background:#22884C!important}',

    /* ---------- native Wix pricing plans ---------- */
    '§ #SITE_PAGES [data-hook=app-title],§ #SITE_PAGES [data-hook=plan-title],§ #SITE_PAGES [data-hook=plan-title] span,§ #SITE_PAGES [data-hook=plan-price],§ #SITE_PAGES [data-hook=plan-price] *{color:#111827!important}',
    '§ #SITE_PAGES [data-hook=plan]>div,§ #SITE_PAGES [data-hook=plan]>div>div:not([data-hook=ribbon]){background:#fff!important;border-color:#E1E5EC!important}',
    '§ #SITE_PAGES [data-hook=plan]>div{border-top:5px solid #0021A5!important;box-shadow:0 8px 24px rgba(17,24,39,.08)!important}',
    '§ #SITE_PAGES [data-hook=plan] :is(p,span,li,div,h3,h4,svg):not([data-hook=plan-cta]):not([data-hook=plan-cta] *):not([data-hook=ribbon]):not([data-hook=ribbon] *){color:#111827!important;fill:currentColor}',
    '§ #SITE_PAGES [data-hook=plan] svg{color:#22884C!important;fill:#22884C!important}',
    '§ #SITE_PAGES [data-hook=ribbon]{background:#0021A5!important;color:#fff!important}§ #SITE_PAGES [data-hook=ribbon] *{color:#fff!important}',
    '§ #SITE_PAGES [data-hook=plan-cta],§ #SITE_PAGES [data-hook=plan-cta] span{background:#FA4616!important;color:#111827!important}',
    '§ #SITE_PAGES [data-hook=plan-cta]:hover,§ #SITE_PAGES [data-hook=plan-cta]:hover span{background:#d33608!important;color:#fff!important}',
    '§ #SITE_PAGES #gbm-renew-card h2{color:#0021A5!important}',
    '§ #SITE_PAGES #gbm-plan-terms,§ #SITE_PAGES [id^=gbm-plan-],§ #SITE_PAGES .gbm-plan-terms{background:#fff!important;COLOR:#111827!important}',
    '§ #SITE_PAGES [id^=gbm-plan-] :is(p,li,span,div,h2,h3,strong,b){color:#111827!important}',
    '§ #SITE_PAGES [id^=gbm-plan-] a{color:#0021A5!important}',

    /* ---------- footer-adjacent embeds, legal, notices ---------- */
    '§ #gbm-legal,§ [class*=gbm-legal],§ #gbm-fp,§ #gbm-404{background:#fff!important;COLOR:#111827!important}',
    '§ #gbm-404 .card,§ #gbm-cta{background:#fff!important;border-color:#E1E5EC!important}',

    /* ---------- show / TV hub (#gbm-media-hub) ---------- */
    '§ #gbm-media-hub#gbm-media-hub{--bp-soft:#4B5563;background:#F4F6FA!important;background-image:none!important;COLOR:#111827!important}',
    '§ body:has(#gbm-media-hub#gbm-media-hub){background:#F4F6FA!important}',
    '§ #gbm-media-hub#gbm-media-hub :is(h1,h2,h3,.bp-eyebrow){color:#111827!important;text-shadow:none!important}',
    '§ #gbm-media-hub#gbm-media-hub :is(p,.bp-jump a,.bp-listen a,.bp-status,.bp-related a,.bp-library-heading p){color:#4B5563!important}',
    '§ #gbm-media-hub#gbm-media-hub :is(.bp-jump a,.bp-listen a,.bp-related a,.bp-direct,p a){color:#0021A5!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-live,§ #gbm-media-hub#gbm-media-hub .bp-module{background:#fff!important;border:1px solid #E1E5EC!important;box-shadow:0 8px 24px rgba(17,24,39,.08)!important}',
    '§ #gbm-media-hub#gbm-media-hub :is(.bp-jump,.bp-related,.bp-module .bp-listen){border-color:#E1E5EC!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-player{background:#0021A5!important;border-color:#0021A5!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-poster,§ #gbm-media-hub#gbm-media-hub .bp-poster:hover{background:#0021A5!important;background-image:none!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-poster:before{display:none!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-poster :is(.bp-mark,.bp-poster-sub){color:#fff!important}§ #gbm-media-hub#gbm-media-hub .bp-poster .bp-mark>span{color:#FFB59A!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-play{background:#FA4616!important;color:#111827!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-close{background:#fff!important;color:#111827!important;border-color:#6B7280!important}',
    '§ #gbm-media-hub#gbm-media-hub .bp-eyebrow:before{background:#FA4616!important}',

    /* ---------- legal page (#gbm-legal) and contact card ---------- */
    '§ #gbm-legal,§ html.gbm-sp-policies #gbm-legal{background:#fff!important;border:1px solid #E1E5EC!important;border-top:4px solid #FA4616!important;COLOR:#111827!important}',
    '§ #gbm-legal :is(h1,h2,p,li,.updated){color:#111827!important}§ #gbm-legal .updated{color:#4B5563!important}',
    '§ #gbm-legal a{color:#0021A5!important}',
    '§ #gbm-legal .notice{background:#F4F6FA!important;border:1px solid #E1E5EC!important;border-left:4px solid #0021A5!important}',
    '§ #gbm-legal nav{background:#0021A5!important}§ #gbm-legal nav a{color:#fff!important}',
    '§ #comp-lii7mqe42{background:#fff!important;COLOR:#111827!important;border:1px solid #E1E5EC!important;border-top:4px solid #FA4616!important}',
    '§ #comp-lii7mqe42 label{color:#111827!important}',
    '§ #comp-lii7mqe42 :is(input,textarea,select){background:#fff!important;color:#111827!important}',
    '§ #comp-lii7mqe42 button,§ #comp-lii7mqe42 button span,§ #comp-lii7mqfp4 button,§ #comp-lii7mqfp4 button span{color:#111827!important}'
  ].join('\n');

  function build() {
    /* every color: also sets -webkit-text-fill-color (older embeds set the fill to white, which beats color) */
    return CSS.split('§').join(PFX).replace(/(^|[{;])color:([^;}]+)(?=[;}])/g, function (m, a, v) { return /^(inherit|currentColor)/.test(v) ? m : a + 'color:' + v + ';-webkit-text-fill-color:' + v; }).replace(/COLOR:/g, 'color:');
  }

  function inject() {
    var s = doc.getElementById('gbm-sl-css');
    if (!s) { s = doc.createElement('style'); s.id = 'gbm-sl-css'; s.textContent = build(); (doc.head || root).appendChild(s); }
    else if (s !== (doc.head || root).lastElementChild && s.parentNode) { s.parentNode.appendChild(s); }
  }

  /* DOM pass: tag leftover dark Wix containers inside #SITE_PAGES, and label the cookie-banner buttons. */
  var lumC = function (c) { var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  function rgba(s) { var m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return null; var p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { c: [p[0], p[1], p[2]], a: p[3] == null || isNaN(p[3]) ? 1 : p[3] }; }
  function dark(el) { var cs = getComputedStyle(el); var b = rgba(cs.backgroundColor); if (b && b.a > 0.6 && lumC(b.c) < 0.09 && Math.max(b.c[0], b.c[1], b.c[2]) - Math.min(b.c[0], b.c[1], b.c[2]) < 80) return true; var bi = cs.backgroundImage; if (bi && bi.indexOf('gradient') > -1 && bi.indexOf('url(') < 0) { var m = bi.match(/rgba?\([^)]+\)/g) || []; if (m.length && m.every(function (x) { var q = rgba(x); return q.a > 0.6 && lumC(q.c) < 0.03; })) return true; } return false; }
  var busy = false, queued = false;
  function pass() {
    if (!root.classList.contains('gb-sl')) return;
    var pages = doc.getElementById('SITE_PAGES');
    if (pages) {
      var ph = pages.querySelectorAll('[id^=bgMedia_] img,[id^=bgMedia_] wow-image,[id^=bgMedia_] video'), q;
      for (q = 0; q < ph.length; q++) { var sec = ph[q].closest('section,[id^=comp-]'); if (sec && !sec.hasAttribute('data-sl-photo')) sec.setAttribute('data-sl-photo', ''); }
      var n = pages.querySelectorAll('section,div,article,aside,li,ul,form,table'), i = 0, el, r;
      for (; i < n.length && i < 2500; i++) {
        el = n[i];
        if (el.hasAttribute('data-sl-dark') || el.closest('[data-hook=post-description],#gbm-lp,#gbm-lf,#gbm-kr,[data-hook=plan-cta],.gbc,#gbm-gate,[data-sl-photo],[data-testid=buttonElement],[data-hook=ribbon],figure,video,[data-gbm-dark-ok]')) continue;
        r = el.getBoundingClientRect(); if (r.width < 120 || r.height < 24) continue;
        if (dark(el)) el.setAttribute('data-sl-dark', '');
      }
    }
    var bn = doc.querySelectorAll('.consent-banner-root button:not([data-sl])');
    for (var j = 0; j < bn.length; j++) { var t = (bn[j].textContent || '').toLowerCase(); bn[j].setAttribute('data-sl', /accept/.test(t) ? 'accept' : /decline|reject/.test(t) ? 'decline' : 'other'); }
    var st = doc.querySelectorAll('.consent-banner-root span:not([data-sl])');
    for (var k = 0; k < st.length; k++) if (/^\s*settings\s*$/i.test(st[k].textContent)) st[k].setAttribute('data-sl', 'settings');
  }
  function schedule() { if (queued) return; queued = true; setTimeout(function () { queued = false; if (busy) return; busy = true; try { pass(); } catch (e) { } busy = false; }, 250); }

  function sync() {
    var p = route();
    if (skip(p)) {
      root.classList.remove('gb-sl'); var s = doc.getElementById('gbm-sl-css'); if (s) s.parentNode.removeChild(s);
      var d = doc.querySelectorAll('[data-sl-dark]'); for (var i = 0; i < d.length; i++) d[i].removeAttribute('data-sl-dark');
      return;
    }
    root.classList.add('gb-sl'); inject(); schedule();
  }

  window.__GBM_SITE_LIGHT__ = { v: 1, sync: sync };
  sync();
  /* SPA routing: Wix swaps pages without a reload */
  ['pushState', 'replaceState'].forEach(function (m) { var o = history[m]; history[m] = function () { var r = o.apply(this, arguments); setTimeout(sync, 0); return r; }; });
  window.addEventListener('popstate', sync); window.addEventListener('gbmroutechange', sync); window.addEventListener('load', schedule);
  try { new MutationObserver(function () { if (root.classList.contains('gb-sl')) { inject(); schedule(); } }).observe(doc.documentElement, { childList: true, subtree: true }); } catch (e) { }
  var tick = 0, iv = setInterval(function () { sync(); if (++tick > 40) clearInterval(iv); }, 500);
})();
