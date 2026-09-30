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

## Rollback (one PATCH)
1. GET the embed, note `revision`.
2. PATCH with `embedData.html` = the exact contents of `home-code-rev22.html` (14,035 chars, djb2 hash 2150811198), `embedData.category` = `ESSENTIAL`, and the current `revision`.
3. Verify by length and hash, then run the live presentation QC.

No site publish is needed in either direction.
