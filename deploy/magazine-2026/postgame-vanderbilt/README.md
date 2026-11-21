# Postgame edition, Nov. 21, 2026 (Florida 34, Vanderbilt 27)

Owner direction, Nov. 21 after the game: "Go" on switching the Magazine from the game day edition to a postgame edition built
around the game story and the photo gallery. No list email.

- **Layout:** the existing `layout: "postgame"` renderer and skin (`sports-live/src/magazine-postgame.{js,css}`), unchanged. This
  edition adds only data: `sports-live/magazine-issue-vanderbilt-postgame.json`.
- **Build:** `python3 deploy/magazine-2026/postgame-vanderbilt/build_issue.py` reads ESPN's summary for event 401856748 and
  writes the issue JSON. It stops unless the game is Final, the score is 34-27, the line score is 3-21-0-3 / 3-14-7-10 and the
  twelve scoring plays are the ones the copy describes. Then `MAG_VARIANT=vanderbilt-postgame node sports-live/build-magazine.mjs`
  writes `sports-live/magazine-vanderbilt-postgame.js` (208,841 bytes against the 212 KB postgame cap) and the QA frame.
- **Sections:** cover on the game story ("Baugh Control"), the final, the game package (Chris Spears' photo gallery, the halftime
  story, the quarter-by-quarter post), by the numbers, score by score, box score, the win-probability chart with six marks, and
  the Florida State game. No columns, quotes, video or PDF sections: nothing had been filed and no transcript had arrived when
  this was built. Add them by adding `columns`, `quotes` or `watch` to the issue and rebuilding.
- **Photos:** all Chris Spears, GatorBait Media, sent by the owner on Nov. 21. Cover `d3cfa5_855dd607...` (No. 5 with the ball up
  in the end zone) is not the cover of any story on the site; the three package thumbnails are their own stories' covers. No
  player is named in alt text.
- **QA:** `sports-live/qa-magazine-postgame.mjs` hard-codes the first postgame issue's file names and its PDF, UAA and video
  expectations, so it was run from a copy with the three file names changed. At 320/390/430/1366/1920: no horizontal overflow,
  every section present, one h1, links site-relative, anchors resolve, 44 px tap targets, signup tagged "magazine", no feed swap,
  unmount/remount, no console errors. One contrast flag at every width, in the shared signup component rather than this
  edition: a "Privacy policy" link measured at 1.00. Wix photos are stand-ins in the container.
- **Release:** embed `1dd74333-ee02-40da-9c93-cf8fd787c129`, loader from `make-loader.py <sha>` (the postgame loader with the
  dark splash). Rollback: the game day loader, `deploy/magazine-2026/pregame-vanderbilt/make-loader.py d04e79280926c3410459d665a3d8648729b7231b`.
