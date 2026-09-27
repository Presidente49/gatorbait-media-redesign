# GatorBait Latest page v1 (LIVE since 2026-09-27)

A multi-column news front for the Wix Blog feed pages: `/gatorbait-media-blogs`, its `/page/N` pages and `/categories/*`. It replaces the look of Wix's Pro Gallery list without replacing the data. Wix still renders the list, which stays in the DOM as the data source. This embed reads the title, link, cover, category, author, time and read time, and draws its own layout.

**Live:** embed `53e15504-76c9-4551-90fe-4defe7cad84d` "GBM - Latest page v1 (multi-column news front)"
- Settings: HEAD, **ESSENTIAL**, loadOnce false, revision 4.
- Size: 11,078 chars, fingerprint 1173955600.
- **Rollback:** disable `53e15504`. The styled native list (Sports Feed Cards `602fb362` rev15) then shows again at once.

## Layout
- **Desktop:** a masthead (the page title, "Latest" or the category name, plus the date and last update). Then the lead story, two-thirds wide, beside a navy "Just in" rail with stories 2–4. Then "More stories" as a 4-column grid of stories 5–12. Then its own pager ("← Newer · Page N of M · Older →"), built from Wix's own next/previous/last links.
- **Tablet:** the lead sits above the rail, and the grid has 2 columns.
- **Phone:** the lead runs full-bleed. The rail and grid become scannable rows with the thumbnail on the left.
- Each story appears once, newest first, and every link is the canonical `/post/` URL.

## Safety design
The first deploy (rev1) was wrong. Wix re-renders the blog React tree after first paint and dropped the injected section, but an `html` class kept the native list hidden, so the page went blank. It was disabled within minutes. Since rev3:
- The native list is hidden **only** by `[data-hook=feed-page-root]:has(#gbm-lp)`. If our section is gone, the native list is back instantly and the page is never blank.
- On feed pages a debounced body observer re-mounts after any Wix re-render, pagination or category swap. It disconnects off the feed.
- While mounting (at most 4s), `html.gbm-lp-wait` holds the native list invisible with its space kept, to avoid a flash.

Tested in `lptest` (see `build.py`, Playwright harness in the session scratchpad). The tests replaced the whole feed root, as a hydration would, changed the list, as pagination does, and left the page by SPA navigation. There were no errors, and it re-mounted in under 400ms.

## Verified live 2026-09-27
- Rev3: the big "LATEST" heading, the lead story with the "Just in" rail, the 4-column "More stories" grid, all images showing, never blank, no horizontal overflow.
- Rev4: the "Page 1 of 380" bar with an "Older stories →" button.
- Not verified live on a physical phone or on category pages.

## Build
`python3 build.py` builds `latest.src.css` and `latest.js` into `latest-embed.html` and asserts the 15,000-character cap.
