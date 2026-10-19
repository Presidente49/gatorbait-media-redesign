# GBM - Site Pages v1 (Oct. 18-19, 2026)

Live embed `af792630-48d9-4306-836d-cc03d159caaf`, HEAD, ESSENTIAL, loadOnce false, enabled, revision 1, 10,650 chars, djb2 `4dcd2f1e`. Source: `site-pages-v1.html`. Created with no site publish; no existing embed touched.

## What it does (visual only)
- Inline script sets `html.gbm-sp` and one page class (`gbm-sp-about|contact|plans|policies|light|app`) from the path, plus `gbm-sp-pre`.
- Guard: with `gbm-sp-pre` and no `#gbm-band` yet, `#SITE_PAGES` is `visibility:hidden` (stays in the DOM, crawlable) on a #060B1C page; it shows as soon as the theme band exists, or after 2.5 s (CSS animation and a JS timer).
- Desktop band reserve moved to `#SITE_CONTAINER` margin (the theme's `::before` reserve left a 0.10 shift of the container at widths over 820 px).
- Look: navy page, white Barlow Condensed headings, Barlow body `#E6EAF5`, `#FA4616` rules/links/buttons with `#07122E` labels (5.26:1), green `#22884C` mark, surfaces `#101529`/`#161E31` and 14% white borders (same tokens as Latest Feed v1).
- Pages: /about, /contact (form card and fields restyled only), /pricing-plans and /pricing-plans/subscribe (card colors only), /policies, /search, /tags, /groups (heading colors only).

## Not touched
Plans, prices, checkout, payment, membership logic, login/signup, form fields. Homepage embeds, Magazine `1dd74333`, Latest feed embed, Theme `c66d5b7f`, First-paint guard `0e55ea65`. Categories already hold under `0e55ea65` and are navy via `c4b41f6a`. Single posts: no body restyle. `/shop` redirects to gatorbait2026.itemorder.com (not Wix). Wix 404 pages do not draw custom embeds. `/account`, `/profile`, `/members`, checkout, `/event-list` (renders the TV page) were left alone.

## Rollback
PATCH `https://www.wixapis.com/embeds/v1/custom-embeds/af792630-48d9-4306-836d-cc03d159caaf` with `enabled:false`, the current `revision` and `embedData.category:"ESSENTIAL"`. Nothing depends on it.

## Evidence
Probe: `probe-run.js` (read-only; frames at 0.1/0.3/0.6/1/2/4 s, CLS, contrast, overflow, fonts). Branch `probe/sitepages-20261018`, folders `deploy/site-pages-probe-*`. Mobile runs use an iPhone user agent (Wix serves its desktop layout to a desktop UA at 390 px).
