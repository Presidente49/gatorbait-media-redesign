# Homepage color pass on the live dark skin (Oct. 18, 2026)

Brenden: more white, UF Core Orange #FA4616, small Gator green #22884C; keep the dark skin. Home loader `0c13f955` (live rev 18, djb2 `fdbf9f2`, 714 chars) is pinned to `10bf364` `sports-live/broadcast-home.js`. This pass serves `sports-live/broadcast-home-color.js` = that exact file + `color-add.css` (colors only), built by `build.mjs`. Main's `broadcast-home.js` is a different (white) skin and is untouched.

- White: brighter secondary text (#d6dcec), white hairlines and card edges, white crest tiles on desktop.
- Orange: header rule, card top rules, section rules, stat bars, winner marker.
- Green (non-text only): status dot, standings marker, thumbnail accents. Section rules carry a short green segment.
- QA (`qa.mjs`, `qa/`): 390/430/1366/1920 page heights equal before/after, no overflow, same lead and order, Barlow only, no new text under AA (two pre-existing low items unchanged).
- Rollback: guarded PATCH of `0c13f955` back to `rollback/0c13f955-rev18.html`, category ESSENTIAL re-sent, no publish.
