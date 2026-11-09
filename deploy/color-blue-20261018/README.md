# Homepage color pass on the live dark skin (Oct. 18, 2026)

Brenden: more white, UF Core Orange #FA4616, small Gator green #22884C; keep the dark skin. Home loader `0c13f955` (live rev 18, djb2 `fdbf9f2`, 714 chars) is pinned to `10bf364` `sports-live/broadcast-home.js`. This pass serves `sports-live/broadcast-home-color.js` = that exact file + `color-add.css` (colors only), built by `build.mjs`. Main's `broadcast-home.js` is a different (white) skin and is untouched.

- White: brighter secondary text (#d6dcec), white hairlines and card edges, white crest tiles on desktop.
- Orange: header rule, card top rules, section rules, stat bars, winner marker.
- Green (non-text only): status dot, standings marker, thumbnail accents. Section rules carry a short green segment.
- QA (`qa.mjs`, `qa/`): 390/430/1366/1920 page heights equal before/after, no overflow, same lead and order, Barlow only, no new text under AA (two pre-existing low items unchanged).
- Rollback: guarded PATCH of `0c13f955` back to `rollback/0c13f955-rev18.html`, category ESSENTIAL re-sent, no publish.

## SHIPPED (Oct. 18, 2026)
`0c13f955` rev 18 -> 19 by guarded in-place PATCH (live read: rev 18, 714 chars, djb2 `fdbf9f2`; category ESSENTIAL re-sent; read-back byte-equal, 731 chars, djb2 `e7993296`; no site publish). Loader `0c13f955-rev19.html` pins `27c36c3ab64666dd8d60d207af3c5c2f...` (PR #369 merge `27c36c3ab64666dd8d60d207af3c5c24b66a769d`) `sports-live/broadcast-home-color.js`; jsDelivr sha256 equals the repo file. Live probe (branch `probe/home-color-20261018`, read-only, cache-busting URL): pin served, color marker present, at 390/430/1366/1920 no overflow, same lead and order, Barlow only, skin and colors present before the root is first visible (no old-color frame at 0.2/0.5/1/2 s). Phone page height +26-27 px vs the pre-change probe came from a new game card line ("No. 20 Florida vs. No. 5 Georgia" wraps), not from the CSS; desktop heights identical.
Rollback: guarded PATCH to `rollback/0c13f955-rev18.html` (djb2 `fdbf9f2`), ESSENTIAL re-sent, no publish.
