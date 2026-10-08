# Friday Pregame issue, South Carolina at Florida (Oct. 10, 2026, Homecoming)

Brenden, Oct. 8 evening: the Wednesday Edition link-card issue "is not what I was looking at this weekend"; put out everything
we have for pregame South Carolina in the magazine look he saw that weekend. Buddy Martin is the cover (his point-spread and
weather column), Franz Beard is the lead (the mud-bowl column), every South Carolina-week story is a card.

**Status: deployed Oct. 8, 21:55 UTC.** Embed `1dd74333-ee02-40da-9c93-cf8fd787c129` went from revision 79 to 80, then to 81 at 22:00 UTC (phone cookie-banner fix, same loader with a new pin). Only
`embedData.html` changed (the jsDelivr pin and the version tag); category ESSENTIAL, position, enabled and loadOnce unchanged.
No site publish, no email, no `current.json` change.

- Issue: `sports-live/magazine-issue-pregame.json` (layout `pregame`), built with `MAG_VARIANT=pregame node sports-live/build-magazine.mjs`.
- Bundle: `sports-live/magazine-pregame.js` at commit `95f52de7296f6e003afb90678d8a7e8923603536` (PR #170), 173,060 bytes,
  sha256 `36a97269e912c5831cb3b08ab899d79df11295d0a0e36a2643ebbfd328320279`, served by jsDelivr with the same bytes.
- Live pin: `@95f52de7296f6e003afb90678d8a7e8923603536/sports-live/magazine-pregame.js`; tag
  `GBM_MAGAZINE_2026_V1 friday-pregame-south-carolina src=95f52de... immutable=1 bundle=sports-live/magazine-pregame.js`.
- QA before deploy: `node sports-live/test-magazine-contracts.mjs` PASS; `qa-magazine-pregame.mjs` passed at 320/390/430/1366
  (no overflow, 10 sections, one h1, site-relative links). Wix photos were stand-ins in the container.
- `make-loader.py <live-loader.html> <sha>` regenerates the candidate from any live loader HTML (one pin, one tag).

- Rev 80 pin (first deploy, 21:55 UTC): `c8a55d46dbf25908e75dc6cdd1c8f9d3bbe62ccc`. Live QC found the Wix cookie banner
  overlapping the cover headline at 390/430; rev 81 shortens the phone masthead and cover photo so the h1 ends above y=700.

## Rollback

PATCH `embedData.html` at the then-current revision, category ESSENTIAL re-sent, back to the revision-79 payload. That payload is
the current HTML with the pin reverted to `@c7fa7193b4109ec147b83d0b3a1690af79f6e265/sports-live/magazine-wednesday.js` and the
tag reverted to `GBM_MAGAZINE_2026_V1 wednesday-edition src=c7fa7193b4109ec147b83d0b3a1690af79f6e265 immutable=1 bundle=sports-live/magazine-wednesday.js`
(2,225 chars). `python3 rollback.py <current-loader.html>` prints it. The weekend look before that (postgame Missouri) is
`deploy/magazine-2026/postgame-missouri/`.
