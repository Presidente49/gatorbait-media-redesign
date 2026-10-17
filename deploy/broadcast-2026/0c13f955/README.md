# Broadcast rollout, S1: homepage `/` (embed 0c13f955)

Plan and rules: `docs/design/BROADCAST-ROLLOUT.md` (on `jarvis/broadcast-rollout`, PR #304). The S1 folders hold the live rollback copies (`deploy/broadcast-2026/<embed-id-8>/rev<N>.html` for 622d8ece, 1255a4cf, fdc2127a and 0c13f955, exact HTML read from Wix on Oct. 17, 2026, about 04:15Z) and the homepage skin.

## How the homepage gets the Broadcast look

- **One embed changes:** `0c13f955` "Mobile rhythm" (rev 2, 740 chars). Its old CSS only targeted `#gbm-live.fp26`, a DOM the live Gazette homepage no longer renders. It becomes a small loader (`make-loader.mjs <main sha>` in this folder), which runs on `/` only. The loader pulls `sports-live/broadcast-home.js` from jsDelivr at a pinned `main` commit and hides the homepage root until the skin applies, for at most 2.5 seconds. If the CDN fails, the root shows immediately in today's Gazette look.
- **Untouched:**
  - Home Code `622d8ece` rev 59, Home Styles `1255a4cf` rev 6 and Sports Home core `fdc2127a` rev 90. Their rollback copies are saved here anyway.
  - Game-day band `96ef5a04` and JSON-LD `1261f2b9`.
  - The shared header, theme and UI layer, which S4 owns.
- **What the skin does:** all of it is scoped to `#gbm-live.gbm-gazette.gbm-sports-home`.
  - Deep-blue set background, plus Barlow and Barlow Condensed (the same jsDelivr fontsource files the S4 shell loads).
  - Ticker strip with the orange GB bug. It shows the last final (from `__GBM_GAMEDAY__` links), the next game (from the Up next card) and the newest headlines. It pauses on hover or focus and stays still under reduced motion.
  - Broadcast masthead on desktop. The phone bar is S4's.
  - Hero with a scoreboard panel beside the slashed lead photo and an italic condensed headline. The scoreboard shows only when the game-day band is not on screen; when the band is up, the lead runs full width under it.
  - White "Next up" bar with the orange tag and a kickoff countdown before kickoff. The bar is hidden when the Up next card names the opponent of a game that is already final.
  - Numbered rundown (01–06), a side panel for the two supporting stories, and Broadcast cards for the voices, newsroom, magazine and show modules.
- **Unchanged:** the feed, the lead rule (newest first), bylines, photos, links, the h1, the skip link, analytics and SEO. The skin reads only data the page already has; `window.__GBM_GAMEDAY__` is read, never written.

## Where the ticker, scoreboard and next-up bar get their data (kept current)

| Item | Source | Refresh while the page is open |
|---|---|---|
| Latest headlines | `/blog-feed.xml` (Wix, live), newest seven | every 3 min and when the tab comes back |
| Next game, last final | `sports-live/scoreboard.json` on GitHub Pages, built from ESPN by `refresh-newsroom-feed.yml` (rotates itself after every final) | every 3 min |
| Live score, and the final before Pages catches up | ESPN's public SEC scoreboard (`site.api.espn.com`, CORS-open), only from 1 hour before kickoff to 6 hours after | every 30 s in that window |
| Fallback when a source fails | the page's Up next card and `__GBM_GAMEDAY__` (read only), with the stale-card guard | — |

The final shows for eight days after the game. The next game hides once it kicks off and returns when the next one is set. A kickoff ESPN hasn't set (04:00Z or 05:00Z) reads "Time TBA" with no countdown. Neutral-site games read "vs." (ESPN `neutralSite`, the new optional `neutral` field in `scoreboard.json`). The ticker re-renders only when its text changes.

## Right rail

The rail runs, top to bottom: Game tape, Best shots (eager-loaded, so they also appear in non-scrolling captures), SEC standings (`scoreboard.json` `standings`, ESPN) and the show tile. On desktop, `balance()` trims standings rows from the bottom, never Florida's, until the rail ends level with the rundown. It drops the table if fewer than four rows fit, and runs again on load, resize and font load. On phones the table shows the top six plus Florida.

## Graphic leads

When the lead's cover is a typeset graphic, its media id is in `front-page.config.json` `covers[]` (read from Pages) or the file is a PNG (photos in this feed are JPG). The lead then shows whole at 16:9 with no text overlay, and the kicker, headline, deck and byline sit on the dark panel below it. Photo leads keep the overlay. This came from Oct. 17: Buddy's column led with the 24-team bracket graphic, and the overlaid headline read busy on phones.

## QA

Built against the exact live embeds plus an 18-story feed fixture taken from the Wix Blog API. Renders are in `qa/`. At 320, 390, 430 and 1366 px:
- no horizontal scroll;
- Barlow and Barlow Condensed only;
- every link or button is at least 44 px tall, except the pre-existing off-screen skip link.

Checked states: stale final with the band expired, pregame band with countdown, postgame band, final after the band expires, and no game data.

## Rollback

PATCH `0c13f955` with the exact contents of `rev2.html` (740 chars, djb2 `3945c8eb`), re-sending `embedData.category` `ESSENTIAL` at the current revision. No site publish.
