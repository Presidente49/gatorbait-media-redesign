# News Wire: newspaper layout for Latest / All News (PREVIEW ONLY, Nov. 3, 2026)

Not deployed. No Wix write, embed change, publish or merge. Brenden's Lovable prototype "GatorBait News Wire" was used for layout ideas only.

- Widget source: `sports-live/src/news-paper.js` (standalone vanilla JS, styles embedded). Built by `NODE_PATH=<dir with esbuild> node sports-live/build-news-paper.mjs [--pin <40-hex>]` into `sports-live/news-paper-widget.js` (ASCII, minified) and `deploy/newspaper-20261103/loader.html` (jsDelivr-pinned loader, ~4,000 chars; Wix limit 15,000).
- Data: same approach as Latest Feed v1 (`54eedbe3`, `sports-live/src/latest-feed.js`): `/blog-feed.xml` for the root, native Wix list for category, tag and page routes, native pages for Load more. Embed `53e15504` instead scrapes the native DOM only.
- Video module reads `sports-live/buddy-videos.json` from GitHub Pages; the module hides itself if that fetch fails.
- Test harness: `sports-live/np-harness/harness.mjs` (stand-in Wix routes, real post data in `posts.json`, Playwright screenshots at 390, 430, 1366, 1920).
- Rollback if ever deployed: disable the new embed (re-send ESSENTIAL) and re-enable the previous one.
