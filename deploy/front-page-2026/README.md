# Front Page 2026 — live flip and rollback

Brenden, Sept. 29 evening: "i want this" → "swamp night". Swamp Night is the everyday homepage look.

## What is live
- Home Code embed `622d8ece-df55-44fc-9e4a-3f580804743b` (ESSENTIAL, enabled) holds a small loader that pulls `sports-live/homepage.js` from jsDelivr, pinned to a commit on `main`. The commit is in the loader's `src=` comment and in #34.
- The renderer is built by `node sports-live/build-front-page.mjs` from `sports-live/src/front-page.{css,js}` and `sports-live/front-page.config.json` (`look: "swamp-night"` keeps the night palette and embers on all day; `?gbm_fp=day` shows the daytime look for QA).
- Loader `fdc2127a`, Home Styles `1255a4cf`, Magazine `1dd74333`, header, ad guard and consent embeds are untouched.

## Revisions
- rev 22: Gazette body (`home-code-rev22.html`), the pre-Front-Page state.
- rev 23: loader pinned to 2bf7e13 (`home-code-loader-2bf7e13.html`), Sept. 29 ~7:10 p.m. ET.
- rev 24: loader pinned to 2c4f4f5 (`home-code-loader-2c4f4f5.html`), Sept. 29 ~7:45 p.m. ET, headline above the photo on phones after live QC run 36643799746 failed at 390px.
- rev 25: loader pinned to db8eec2 (`home-code-loader-db8eec2.html`), Sept. 29 ~11:40 p.m. ET, adds The Road Ahead season band. Rollback for this step: PATCH the rev 24 loader (`home-code-loader-2c4f4f5.html`).
- rev 26: loader pinned to edc420d (`home-code-loader-edc420d.html`, 521 chars, djb2 hash 2534235099), Sept. 30 ~12:10 a.m. ET, after Brenden said the band looked off: route rail through the dots, glow to the next game's dot, phones open on the last result beside the next game, page padding and tokens. Rollback: PATCH the rev 25 loader (band, old geometry) or rev 24 (no band).
- rev 27: loader pinned to 8688c05 (`home-code-loader-8688c05.html`, 521 chars, djb2 hash 236346096), Sept. 30 ~12:30 a.m. ET. Live screenshots (`qa/live-shots`) had shown no band on the iPhone profile when the scoreboard fetch missed the paint budget; the build now bundles the season schedule, the fresh feed swaps the band off screen, and ranked opponents and story links are back. Rollback: PATCH the rev 26 loader (`home-code-loader-edc420d.html`).

## Rollback (one PATCH)
1. GET the embed, note `revision`.
2. PATCH with `embedData.html` = the exact contents of `home-code-rev22.html` (14,035 chars, djb2 hash 2150811198), `embedData.category` = `ESSENTIAL`, and the current `revision`.
3. Verify by length and hash, then run the live presentation QC.

No site publish is needed in either direction.
