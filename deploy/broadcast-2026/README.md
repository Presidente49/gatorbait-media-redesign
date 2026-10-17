# Broadcast rollout, S1: homepage `/`

Plan and rules: `docs/design/BROADCAST-ROLLOUT.md` (on `jarvis/broadcast-rollout`, PR #304). This folder holds the live rollback copies (`<embed-id-8>/rev<N>.html`, exact HTML read from Wix on Oct. 17, 2026, about 04:15Z) and the homepage skin.

## How the homepage gets the Broadcast look

- **One embed changes:** `0c13f955` "Mobile rhythm" (rev 2, 740 chars). Its old CSS only targeted `#gbm-live.fp26`, a DOM the live Gazette homepage no longer renders. It becomes a small loader (`0c13f955/make-loader.mjs <main sha>`), which runs on `/` only. The loader pulls `sports-live/broadcast-home.js` from jsDelivr at a pinned `main` commit and hides the homepage root until the skin applies, for at most 2.5 seconds. If the CDN fails, the root shows immediately in today's Gazette look.
- **Untouched:**
  - Home Code `622d8ece` rev 59, Home Styles `1255a4cf` rev 6 and Sports Home core `fdc2127a` rev 90. Their rollback copies are saved here anyway.
  - Game-day band `96ef5a04` and JSON-LD `1261f2b9`.
  - The shared header, theme and UI layer, which S4 owns.
- **What the skin does:** all of it is scoped to `#gbm-live.gbm-gazette.gbm-sports-home`.
  - Deep-blue set background, plus Barlow Condensed (loaded with Barlow from Google Fonts).
  - Ticker strip with the orange GB bug. It shows the last final (from `__GBM_GAMEDAY__` links), the next game (from the Up next card) and the newest headlines. It pauses on hover or focus and stays still under reduced motion.
  - Broadcast masthead on desktop. The phone bar is S4's.
  - Hero with a scoreboard panel beside the slashed lead photo and an italic condensed headline. The scoreboard shows only when the game-day band is not on screen; when the band is up, the lead runs full width under it.
  - White "Next up" bar with the orange tag and a kickoff countdown before kickoff. The bar is hidden when the Up next card names the opponent of a game that is already final.
  - Numbered rundown (01–06), a side panel for the two supporting stories, and Broadcast cards for the voices, newsroom, magazine and show modules.
- **Unchanged:** the feed, the lead rule (newest first), bylines, photos, links, the h1, the skip link, analytics and SEO. The skin reads only data the page already has; `window.__GBM_GAMEDAY__` is read, never written.

## QA

Built against the exact live embeds plus an 18-story feed fixture taken from the Wix Blog API. Renders are in `0c13f955/qa/`. At 320, 390, 430 and 1366 px:
- no horizontal scroll;
- Barlow and Barlow Condensed only;
- every link or button is at least 44 px tall, except the pre-existing off-screen skip link.

Checked states: stale final with the band expired, pregame band with countdown, postgame band, final after the band expires, and no game data.

## Rollback

PATCH `0c13f955` with the exact contents of `0c13f955/rev2.html` (740 chars, djb2 `3945c8eb`), re-sending `embedData.category` `ESSENTIAL` at the current revision. No site publish.
