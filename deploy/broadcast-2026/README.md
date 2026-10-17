# Broadcast S2: All News, category hubs and section pages

Session S2 of the Broadcast rollout (`docs/design/BROADCAST-ROLLOUT.md`). Pages: `/gatorbait-media-blogs` (All News, the "Latest" link in the header), every `/gatorbait-media-blogs/categories/<slug>` hub (sections and columnists), topic `/tags/` pages and `/page/<n>`. `/latest` returns 404 on the live site; there is no page at that path, so nothing is changed there.

## What changes

| Embed | Live before | Change |
|---|---|---|
| `602fb362` Sports Feed Cards | rev 15, 9,586 chars, fp `8127b737` | Feed pages: white page becomes the deep-blue set; the native fallback list (shown only if the Latest page script fails) is restyled for dark. |
| `c4b41f6a` Section nav | rev 1, 5,970 chars, fp `3b044e1c` | Adds one `<style id="gbm-bc-s2">` (source `c4b41f6a/broadcast-skin.css`) for `#gbm-sn` and `#gbm-lp`: orange "GB" bug kicker, italic condensed uppercase title with a neon rail, dark section nav, white "Just in" bar with an orange tag, slashed lead photo with an orange slash, chamfered thumbnails and orange buttons. JS: the kicker becomes a two-part bug (same words). |
| `53e15504` Latest page | rev 11, 13,818 chars, fp `e6a71858` | No change. Saved for reference only. |

Unchanged: every link, category, pagination, the archive search, ad slots, analytics, the page `h1` text, the JSON-LD (`#gbm-sn-ld`), reading order. The header, footer and sitewide type sheet (S4) are not touched; the skin overrides that sheet only inside `#gbm-sn` and `#gbm-lp` with two-id selectors. Italic and upright Barlow Condensed 800 load under a private family name, "GB Broadcast", from the same jsDelivr `@fontsource/barlow-condensed@5.3.0` files the site already uses, so no other page changes.

## Build and QA

```
node deploy/broadcast-2026/build.mjs      # rev files + asserted replacements -> <id>/proposed.html, prints length and djb2
node deploy/broadcast-2026/qa.mjs <path> <outdir>   # loads the live page with proposed.html swapped in
```

QA at 320, 390, 430 (iPhone UA) and 1366 on All News, the Football hub, Buddy's Blog and page 2: no horizontal scroll, no text under 4.5:1, no tap target under 44 px, Barlow families only, links, `h1` and JSON-LD unchanged. Renders in `qa/`. On phones Wix lays these pages out at its forced 320 px viewport; that is existing behavior.

## Live write and rollback

PATCH each embed in place at its current revision with the djb2 check, `embedData.category` ESSENTIAL re-sent, no site publish. Rollback for each embed is one PATCH with `<id>/rev<N>.html` verbatim.
