# Postgame issue, Oct. 11, 2026 (South Carolina 38, No. 16 Florida 19)

Brenden, Oct. 11: "let's get our post game round up magazine ready." Standing order today: Buddy Martin's GAMECLOCKED column is the cover.

**Status: built and QA'd, not deployed.** No embed PATCH, site publish, email or `current.json` change was made. The only live call was a read of embed `1dd74333`.

## How it works (same mechanism as the Missouri edition, `../postgame-missouri/`)

- `sports-live/magazine-issue-postgame.json` now holds this issue. The Missouri issue is archived byte-for-byte at `../postgame-missouri/archive-missouri-issue.json`. Missouri stays reachable at its pinned commit.
- `sports-live/magazine-postgame.js` and `magazine-postgame-frame.html` are rebuilt: `NODE_PATH=/opt/node22/lib/node_modules MAG_VARIANT=postgame node sports-live/build-magazine.mjs`. Bundle is 184,126 bytes against the build's 184,320-byte cap (180 KiB), so only about 190 bytes of headroom. Trim copy before adding anything.
- `sports-live/build-magazine.mjs` now reads the fixture loader from `postgame-sc/candidate-loader.html`.
- `sports-live/src/magazine-postgame.css`: two fixes found by QA that were also failing on main (the "Postgame edition" label was white on orange at 3.53:1, now dark navy; the reader-bar "GatorBait" link was a 22 px target, now 44 px).
- `sports-live/qa-magazine-postgame.mjs`: report-card and game-flow sections are optional (required only when the issue has them), and the stale `.pm-mast` selector is now `.pm-entrance`.

## Issue contents (every number from ESPN event 401856714 unless noted)

Cover Buddy Martin column; final; In this issue; The damage; Game flow (ESPN win probability, 191 points, Florida is the home team so the series is used as given); In their words; The package (4 stories, newest first); Up next; footer.
No report card: GatorBait published none for this game, so the section is dropped, not invented. No "full breakdown" link in The damage for the same reason (no By the Numbers post exists yet). No Pick 'Em teaser (the feature does not exist).
Per-game baselines (53.5 points, 532.8 yards) are ESPN events 401856637, 401856672, 401856687, 401856699: 214 points and 2,131 yards over four games.

## Deploy (Jarvis): one guarded PATCH of embed 1dd74333

1. **Merge the PR**, then note the **merge commit sha** on `main` (full 40 hex). The CDN pin must be a commit that contains `sports-live/magazine-postgame.js` from this PR and stays reachable on GitHub.
2. **Read the embed first.** `GET https://www.wixapis.com/embeds/v1/custom-embeds/1dd74333-ee02-40da-9c93-cf8fd787c129` (site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`). On Oct. 11 it was revision `87`, enabled, `position: HEAD`, `loadOnce: false`, category `ESSENTIAL`, name "GBM - Magazine Live Issue v9 (rotating edition: Thoughts of the Day)", and `embedData.html` byte-identical to `live-loader-before.html` (2,233 chars, pregame bundle pinned at `23fa88386a34dd6eb9e60c3180babd38f1f15a7d`). If the revision or HTML differs, stop: save what you read as the new rollback, replace `live-loader-before.html` and the two pins in `make-loader.py`, then continue.
3. **Generate the candidate:** `python3 deploy/magazine-2026/postgame-sc/make-loader.py <merge sha> > candidate-loader.html`. The committed `candidate-loader.html` is a **placeholder** pinned to forty zeros, used only by the QA fixture. Never PATCH it.
4. **CDN check.** `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@<merge sha>/sports-live/magazine-postgame.js` must return HTTP 200, 184,126 bytes. Compare its sha256 with `sha256sum sports-live/magazine-postgame.js` on that commit.
5. **PATCH** the same embed at the current revision. Change only `embedData.html`. Keep category `ESSENTIAL`, `position`, `enabled`, `loadOnce`. Custom embeds apply without a site publish. Do not publish the site.
6. **Verify live**, without self-certifying, at 390 and 1366 (320 when relevant): open `https://www.gatorbaitmedia.com/magazine?cb=<n>` and confirm `#gbm-magazine-page.pm[data-issue="2026-10-11-postgame-south-carolina"]` is present once; the h1 reads "GAMECLOCKED! No. 500 Was a Lousy Homecoming In The Swamp" and links to `/post/gameclocked-no-500-was-a-lousy-homecoming-in-the-swamp`; all 5 Wix images load (cover plus 4 thumbnails); the 5 story links resolve; the cookie panel does not cover the cover headline; the signup is a compact strip. Do not submit it. Then visit a `/post/` page and come back to confirm unmount and remount.
7. Record the new revision here and in issue #34.

## Rollback

PATCH `embedData.html` back to `live-loader-before.html` (or the exact HTML saved in step 2) at the then-current revision, category unchanged. That restores the pregame bundle at `23fa883`.

## Notes for the controller

- **Texas ranking.** ESPN still shows Texas No. 1 (poll not yet updated), but Texas lost 27-24 to Oklahoma on Saturday. The ranking appears once, in `next.title` ("Florida at No. 1 Texas") of `sports-live/magazine-issue-postgame.json`. Edit it after the Sunday poll, rebuild, and re-pin before deploying. The `next.note` already says the ranking may change. Florida is "No. 16" as of kickoff (ESPN header); it will drop in the new poll, so the final-score card rank may also need editing (`final.teams[1].rank`).
- Kickoff Oct. 17 is 16:00Z = noon ET on ABC (ESPN). Venue name is ESPN's "DKR-Texas Memorial Stadium".
- Photo credits were confirmed by eye (Chris Spears watermark on all five) and match GatorBait's own captions. `front-page.config.json` holds no credits for these ids.
- The cover and the first image in Buddy's column differ (the column's inline photo is credited to UAA); only the Wix cover id is used here.
