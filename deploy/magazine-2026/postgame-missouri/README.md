# Postgame issue, Oct. 4, 2026 (Missouri 45, Florida 17)

Brenden, Oct. 3 night: "We've got enough to roll out our postgame magazine." Buddy Martin is the editorial lead.

**Status: built and QA'd, not deployed.** No embed PATCH, site publish, email or `current.json` change was made.

## How it works (the existing mechanism, unchanged)

Live embed `1dd74333` (rev 73, read Oct. 4) is a ~2.2 KB loader. It hides the native `/magazine` page, then loads a pinned bundle
from jsDelivr (`sports-live/magazine-pregame.js` at `9b20174`). The bundle carries the issue JSON, CSS and the shared renderer
`sports-live/src/magazine.js`. This issue adds one layout to that renderer:

- `sports-live/magazine-issue-postgame.json`: every word and number in the issue (sources in its `$comment`).
- `sports-live/src/magazine-postgame.{js,css}`: the `layout: "postgame"` renderer and skin (Barlow / Barlow Condensed,
  #0021a5, #fa4616, white). The issue has no live feed swap, so the Buddy lead stays put. It has no timers and no animation.
- `sports-live/src/capture.js` is bundled for the signup (the existing "GatorBait Email List" double opt-in form). Its
  submissions are tagged `signup_source: "magazine"`; capture.js already retries without the tag if the form rejects it.
- Build: `MAG_VARIANT=postgame node sports-live/build-magazine.mjs`, which writes `sports-live/magazine-postgame.js`
  (175,668 bytes, under the build's 180 KB cap) and `sports-live/magazine-postgame-frame.html`. The pregame bundle was rebuilt
  only for the two-line layout dispatch, and the weekly output is untouched.
- QA: `node sports-live/qa-magazine-postgame.mjs <outdir> [dir with sumrall-earned-1600x900.jpg]`. It checks 320/390/430/1366
  for overflow, sections, one h1, site-relative links, AA text contrast, 44 px targets, signup tag, no feed/ESPN requests and
  route unmount/remount. Wix photos are stand-ins because the container cannot reach static.wixstatic.com. See `preview/`.

## Deploy (Jarvis): one guarded PATCH of embed 1dd74333

1. **Read first.** `GET https://www.wixapis.com/embeds/v1/custom-embeds/1dd74333-ee02-40da-9c93-cf8fd787c129` (site
   `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`). Expect: revision `73`, enabled, `position: HEAD`, `loadOnce: false`, category `ESSENTIAL`, and
   `embedData.html` byte-identical to `live-rev73-loader.html` (2,210 chars, pin `@9b2017477e4a948d80e243ac6b2cbd34a36ec01f/sports-live/magazine-pregame.js`).
   If the revision or HTML differs, stop. Save the live HTML you read as the rollback, then regenerate the candidate from it.
2. **CDN check.** Fetch `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@784f83271c5e101b228944cb1a5bc0aa04b235a4/sports-live/magazine-postgame.js`.
   Expect HTTP 200, 175,668 bytes and sha256 `a0e3d3af6def1ceb0e9673340817cb669816fd20a443305ca1537f8f3ea7076a`. That commit has to stay
   reachable on GitHub, so do not delete the branch before a merge keeps it.
3. **PATCH** the same embed at the current revision. Change only `embedData.html` to `candidate-loader.html`
   (2,223 chars; equal to `python3 make-loader.py 784f83271c5e101b228944cb1a5bc0aa04b235a4`). Keep category `ESSENTIAL`, `position`, `enabled`
   and `loadOnce`. Renaming the embed to "GBM - Magazine Live Issue v10 (postgame: Missouri)" is optional and cosmetic.
   Custom embeds apply without a site publish. Do not publish the site.
4. **Verify live**, without self-certifying. Open `https://www.gatorbaitmedia.com/magazine?cb=<n>` at 390 and 1366 and confirm:
   - `#gbm-magazine-page.pm[data-issue="2026-10-04-postgame-missouri"]` is present, once;
   - the h1 reads "Hey Missouri, don't show me anymore!" and links to `/post/hey-missouri-don-t-show-me-anymore`;
   - all 5 Wix images load: the UAA cover and the 4 package thumbnails;
   - the 7 package links resolve;
   - the cookie panel does not cover the cover headline at 320/390;
   - the signup renders as a compact blue strip with light text. Do not submit it.

   Then go to a `/post/` page and back to confirm the page unmounts and remounts.
5. Record the new revision in this README and on the controller's issue.

## Rollback

PATCH `embedData.html` back to `live-rev73-loader.html`, or to the exact HTML saved in step 1, at the then-current revision with
the category unchanged. That restores the pregame/"Postgame Edition" Franz issue pinned at `9b20174`. No other object is touched.

## Notes for the controller

- `window.__GBM_MAG_EDITION__` (the homepage Magazine preview hook) will now carry Buddy's column as the Magazine lead. The
  Sept. 29 urban note said the Magazine cover should differ from the homepage lead. The newer owner direction (Buddy leads
  everywhere, one canonical URL, no duplicate cards within a surface) is what this issue follows. If the homepage also leads with
  this column, that is a promotional link, not a second publication. The controller should still confirm the homepage preview
  reads well.
- Pick 'Em is a teaser slot only (no link) until the feature exists.
- Photo credits: the cover is "UAA Photo" and the package thumbnails are Chris Spears file photos (Ole Miss, Sept. 26), labeled as
  file photos. The Sumrall card is a GatorBait Media graphic. The recap's UAA Oyebadejo frame is not reused, because it appears to
  be the same moment as Buddy's cover.
