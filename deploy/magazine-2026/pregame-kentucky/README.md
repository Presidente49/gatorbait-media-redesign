# Pregame edition, Nov. 14, 2026 (Florida at Kentucky)

Brenden, Nov. 14: pull the football stories for a pregame magazine, reuse the pregame template and its widgets, no PDF.

- **Layout:** `layout: "pregame"` (same renderer and widgets as the Friday Pregame editions): live kickoff countdown, game card with ESPN line and matchup predictor, series history (2012-2025, checked against ESPN schedules), tale of the tape, five keys (Eddie Gilley), availability, the Soothsayer column and the Sooth Board, story cards, photo mosaic.
- **Build:** `python3 deploy/magazine-2026/pregame-kentucky/build_issue.py` (fetches ESPN event 401856884, team statistics and schedules) then `MAG_VARIANT=kentucky node sports-live/build-magazine.mjs` writes `sports-live/magazine-kentucky.js`.
- **QA:** `node sports-live/qa-magazine-kentucky.mjs <outdir>` (320/390/430/1366).
- **Release:** one PATCH of the Magazine embed `1dd74333` loader pin to the commit holding `magazine-kentucky.js` (`make-loader.py <sha>` in this folder). Rollback: the previous embed body, captured immediately before the patch. No email.
- Every photo is a distinct file with its credit; no Ole Miss (Sept. 26) photo; Oklahoma-game photos credited per docs/PHOTO-ATTRIBUTION.md.
