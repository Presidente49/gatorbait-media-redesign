# Latest feed v1, Oct. 18-19, 2026

Embed `54eedbe3-d73c-43d8-9ea3-81967ce113fa` "GBM - Latest Feed v1" (HEAD, ESSENTIAL, loadOnce false, enabled), created rev 1, re-pinned rev 2 and rev 3. Live rev 3: 4,437 chars, djb2 `e0116148`, pin `f41f7d56b729cbb020d3b9a16a3c8e9d2cecde3c` (`sports-live/latest-feed.js`, build 07d258c6, sha256 95ce16c8...). Loader source: `latest-feed-loader-v1.html` (repo copy has a trailing newline; live copy does not). No site publish. Existing objects 53e15504, 602fb362, c4b41f6a, 0e55ea65 not edited: this embed hides `#gbm-lp` and `#gbm-sn` by CSS while it is mounted.

## What it does
- Routes `/gatorbait-media-blogs`, `/categories/*`, `/tags/*`, `/page/N`. Held from first paint (`gbm-lf-pre`, skeleton, fonts preloaded), 2.5 s failsafe reveals the native list and the old renders.
- `/blog-feed.xml` read cache-busted, no-store, started by the loader before the bundle arrives; sorted by pubDate. Lead (whole photo on blurred backdrop, credited alt from the native item) + 3 "Just in" cards + grid, chips for writers and sections (existing category URLs), Google site search kept, Load more to 48+ stories (RSS 20, then native pages read only as far as the post list), "Older stories" link to the next native page.
- Category and page routes use the native list (12 per page on desktop, 5 on phones) enriched from the RSS.
- Native feed DOM stays (1 px clipped, inert, not display:none). No h1 added. Canonical, JSON-LD untouched. Posts untouched.

## Verification (read-only)
Sandbox browser through Playwright request routing (real live pages, real Wix JS) and Actions probe `probe/latest-feed-20261018` (runs 39181687784 candidate, 39187182523/4 live). CLS 0 to 0.0003 on every mounted load at 390/430/1366/1920 (before: 0.14-0.30), overflow 0, order identical to the feed, zero inversions after Load more, 0 broken images, Barlow only. Where Wix's bot challenge answered the probe (blank "verify you are human" page) results are excluded, not counted as passes. Fallback scenarios (RSS 500, bundle 404) reveal the native list. Screenshots: `qa/latest-390.png`, `qa/latest-1366.png`.

## Rollback
PATCH `54eedbe3-d73c-43d8-9ea3-81967ce113fa` `enabled:false` at the current revision, ESSENTIAL re-sent. Nothing depends on it.
