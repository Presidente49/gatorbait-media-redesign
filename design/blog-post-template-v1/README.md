# GatorBait post template v1 (prototype, not deployed)

This prototype restyles Wix Blog article pages (`/post/...`) with a bold sports-news template. It targets the real Wix post DOM and ships as one Wix custom embed. Nothing here has been sent to Wix, and nothing has been committed.

## Files

| File | Purpose |
|---|---|
| `post-template.src.css` | Readable source. `§` = strong scope, `¤` = short scope |
| `post-template.css` | Built, minified CSS: **10,930 chars** (cap 12,000) |
| `post-template.js` | Small helper (3,385 chars minified): hero URL, kicker, stat tagging, Up next strip |
| `post-template-embed.html` | The deployable embed: `<style>` + `<script>`, **14,425 chars** (Wix cap 15,000) |
| `build.py` | Expands the scopes, minifies and asserts both caps |
| `mock.html` | Real Wix post DOM (trimmed from the live Sumrall presser post, fetched 2026-09-27), with the live header-embed post rules copied in as competitors |
| `render.mjs` | Playwright render plus checks: `PW_MODULES=<dir with node_modules/playwright> node render.mjs` |
| `screenshot-390.png`, `screenshot-1366.png` | Full page with the template |
| `screenshot-390-fold.png`, `screenshot-1366-fold.png` | First screen |
| `screenshot-before-390.png`, `screenshot-before-1366.png` | Same mock, template off (stock and today's rules) |

Render results at 390 and 1366 with the template on:
- `scrollWidth` equals the viewport width, and 0 elements fall outside it.
- Layout shift is 0.
- No page errors.
- The headline computes to Barlow Condensed 800, which beats the header embed's Georgia rule.
- 4 stat rows are tagged and the Up next strip renders.

## Selectors used (verified in the live post HTML)

- **Scope:** `[data-hook=post-page]` exists only on post pages.
  - Strong prefix `html body #SITE_PAGES [data-hook=post-page]` has specificity (1,1,2). The header embed `7fee4de6` has (1,1,1) with `html:has(#gbm-site-header) [data-hook="post-page"] ...`, Georgia titles and 16px mobile body, so the strong prefix wins regardless of embed order.
  - Hooks only this template styles use `#SITE_PAGES` alone, to stay under the cap.
- **Hero:** `section[data-hook=post-hero-image]` is rendered **empty** on live posts, because the blog's cover display is off. The CSS reserves it at 16:9 with `:empty`. The JS fills it from `meta[property=og:image]` through `--gbm-hero`.
- **Header:** `[data-hook=post]>div>header` (the kicker is its `::before`), `h1[data-hook=post-title]`. The meta row is `[data-hook=post-title]+div`: `profile-link`, `user-name`, `time-ago`, `time-to-read`, `more-button`, `.fluid-avatar-image`. The UI layer's `.gbm-writer-alerts` is recolored inside the panel.
- **Body:** `[data-hook=post-description]` holds `p`/`li`/`h2`/`h3` inside `div[data-breakout]`. `rcv-block-*` markers sit between blocks. The lede is `[data-hook=rcv-block-first]+div>[data-breakout]:first-child p`. Links are `a[data-hook=web-link]`.
- **Images:** `figure[data-hook=figure-IMAGE]`, `[data-hook=image-viewer]`, `[data-hook=gap-spacer]`, `figcaption`. The CSS overrides Ricos's inline 16px caption padding.
- **Quote:** `blockquote` inside the post body. **Not observed live.** The two fetched posts have no quote block, so this markup follows Ricos convention and needs checking on a post that has one.
- **Share row:** `footer[data-hook=post-footer]`, `[data-hook^=share-button]`.
- **Related stories:** the native `[data-hook=recent-posts]` ("Related Posts" relabeled with CSS), `[data-hook=recent-post-list-item]` and `[data-hook=recent-post__title]`. The view/like skeletons are hidden.
- **Added by the JS:**
  - `[data-gbm-stat-head]` and `[data-gbm-stat]`. These are set only on bold-number paragraphs (`p>span>strong:first-child`, the text has a digit) that directly follow an H2 reading "By the numbers". Editors opt in by writing that H2.
  - `.gbm-upnext`, inserted after the post body.

## Design summary

Fonts are Barlow and Barlow Condensed only. The palette is orange `#FA4616`, navy `#081B35` and blue `#0021A5`. The page reads in this order:
1. Full-width cover.
2. A navy headline panel with an orange top rule and an orange kicker pill.
3. An uppercase condensed headline.
4. A byline, time and read-time row.
5. A 700px reading column at 19px (17.5px on phone), with a larger lede.
6. H2s with an orange bar.
7. Pull quotes with a navy rule and an orange quote mark.
8. Captions with an orange rule.
9. A navy "By the numbers" panel with big orange figures.
10. A navy Up next strip.
11. Reskinned Related stories cards.

The phone layout runs the hero and headline panel edge to edge. The mobile shell and header are not touched.

## Rollout plan (needs controller + Brenden approval; this worker made no Wix writes)

1. **Use a new embed. Do not extend `a13b04e3`.**
   - The UI layer is 13,717/15,000 chars, which leaves about 1.3k of room.
   - It also injects its CSS from JS once the core boot runs. Post styles delivered that way would paint after Wix's own styles and flash.
   - The template must be a static `<style>` parsed in `<head>`.
   - The new embed would be named "GBM - Post template v1": HEAD, **ESSENTIAL**, loadOnce false, all pages or Blog Post pages only. The CSS is inert off `/post/`, and the JS returns immediately there.
2. **Size:** 14,425 chars, leaving 575 chars of headroom. Run `python3 build.py` before every upload, since it asserts both caps.
3. **Staging:** create it disabled, then enable it and check 3 or 4 posts on phone and desktop:
   - one with a quote block
   - one with a "By the numbers" section
   - one without a cover
   - one with a video
   Live QC should assert no horizontal overflow, CLS about 0 on the first screen, and the native article still readable.
4. **Rollback:** disable the embed. That is one toggle with no other owner touched, and posts return to today's presentation at once. Every Update call must re-send category ESSENTIAL.
5. **Up next upkeep:** edit the `NEXT` object in `post-template.js`, rebuild and re-upload. The strip hides itself after `until`. A later version could read the game-day JSON already carried by `96ef5a04`, so the game data has a single owner.

## Risks / open decisions

- **Font request (decision needed).**
  - Barlow Condensed is not loaded live today. The live font stylesheet `0709a98e` carries Barlow, and CURRENT-STATE names "Barlow" as the headline face.
  - The CSS declares Barlow Condensed 800 from jsDelivr with `font-display:optional`. The first uncached view may show Barlow 800 instead, but it never swaps mid-read, so there is no jump.
  - This is a second jsDelivr request. The alternatives are to host the woff2 in Wix Media, or to drop the condensed face and use Barlow 800.
- **The hero depends on the JS and on og:image.**
  - If og:image is missing, the reserved 16:9 box stays navy. It does not collapse, so there is still no jump.
  - The alternative is Wix Blog settings → show cover image in post. That is a settings change outside this scope, and `:empty` then hands the hero back to Wix automatically.
- **Covers have baked-in headlines.** GatorBait covers carry their own title text, so the hero plus the headline panel repeats the headline (visible in the mock). The panel is stacked under the image, not over it, so no cover text is hidden.
- **Wix DOM drift.** The hashed classes are never targeted, only `data-hook`s and structure (`[data-hook=post]>div>header`, `post-title+div`). A Wix Blog update could still move those.
- **React ownership.**
  - The Up next strip and the stat attributes are added into Wix's React tree after load, using the same pattern as the UI layer's writer button.
  - Re-runs are bounded to load, 600, 1800 and 4000 ms, plus route changes. There is no observer and no polling.
  - The strip is inserted below the body, so it does not move content above the reader.
- **Stat opt-in.** Only paragraphs under an H2 that starts "By the numbers" are styled, so bold lead-ins elsewhere are untouched.
- **Kicker.**
  - Wix renders no category on the post page. The kicker uses JSON-LD `articleSection` if Wix emits it (not verified), and otherwise slug rules: Recruiting, Basketball, Diamond Gators, Postgame, Column, and a default of "Gators Football".
  - Slug rules can mislabel a post. The option is reading categories from `/blog-feed.xml`, at the cost of an extra fetch.
- **Other live embeds were not available locally:** Light Theme v1, Site Fixer v7.2, TV + News Images v9.1 and Sports Feed Cards. Any of them could style post hooks too. The (1,1,2) prefix plus `!important` should win, but this has to be confirmed on a live preview.
- **Unverified.**
  - The Wix mobile post layout (`is-mobile`) was not fetched. The mock uses the desktop DOM at 390px.
  - The mock is not physical-device testing.
