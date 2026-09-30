# Front Page 2026 — live flip and rollback

Brenden, Sept. 29 evening: "i want this" → "swamp night". Swamp Night is the everyday homepage look.

## What is live
- Home Code embed `622d8ece-df55-44fc-9e4a-3f580804743b` (ESSENTIAL, enabled) holds a small loader that pulls `sports-live/homepage.js` from jsDelivr at a commit on `main`. From rev 28 (V3 loader) the commit comes from `sports-live/current.json` on GitHub Pages, with the commit baked into the loader (`src=` comment) as the fallback when the pointer is slow (800 ms), missing, malformed, or that build fails to download. Reason: on Sept. 30 Wix kept serving desktop visitors homepage HTML with an older embed revision for 30–45 minutes after a PATCH, so the embed itself no longer needs to change for a new build.
- **Deploying a build:** merge the code to `main`, then commit `sports-live/current.json` `{ "commit": "<40-hex main commit>", ... }` to `main` (record it here and in #34). Pages serves it within about a minute and the loader asks for it fresh each minute. Change the embed (a new loader file from `make-loader.mjs`, guarded PATCH) only when the baked fallback should move.
- `make-loader.mjs <commit>` writes the loader for a commit (`--info` prints length and djb2 hash); `test-loader.mjs <loader.html>` proves the pointer and every fallback path in a real browser.
- The renderer is built by `node sports-live/build-front-page.mjs` from `sports-live/src/front-page.{css,js}` and `sports-live/front-page.config.json` (`look: "swamp-night"` keeps the night palette and embers on all day; `?gbm_fp=day` shows the daytime look for QA).
- Loader `fdc2127a`, Home Styles `1255a4cf`, Magazine `1dd74333`, header, ad guard and consent embeds are untouched.

## Revisions
- rev 22: Gazette body (`home-code-rev22.html`), the pre-Front-Page state.
- rev 23: loader pinned to 2bf7e13 (`home-code-loader-2bf7e13.html`), Sept. 29 ~7:10 p.m. ET.
- rev 24: loader pinned to 2c4f4f5 (`home-code-loader-2c4f4f5.html`), Sept. 29 ~7:45 p.m. ET, headline above the photo on phones after live QC run 36643799746 failed at 390px.
- rev 25: loader pinned to db8eec2 (`home-code-loader-db8eec2.html`), Sept. 29 ~11:40 p.m. ET, adds The Road Ahead season band. Rollback for this step: PATCH the rev 24 loader (`home-code-loader-2c4f4f5.html`).
- rev 26: loader pinned to edc420d (`home-code-loader-edc420d.html`, 521 chars, djb2 hash 2534235099), Sept. 30 ~12:10 a.m. ET, after Brenden said the band looked off: route rail through the dots, glow to the next game's dot, phones open on the last result beside the next game, page padding and tokens. Rollback: PATCH the rev 25 loader (band, old geometry) or rev 24 (no band).
- rev 27: loader pinned to 8688c05 (`home-code-loader-8688c05.html`, 521 chars, djb2 hash 236346096), Sept. 30 ~12:30 a.m. ET. Live screenshots (`qa/live-shots`) had shown no band on the iPhone profile when the scoreboard fetch missed the paint budget; the build now bundles the season schedule, the fresh feed swaps the band off screen, and ranked opponents and story links are back. Rollback: PATCH the rev 26 loader (`home-code-loader-edc420d.html`).
- rev 28: **V3 loader** (`home-code-loader-4cc4ad3.html`, 1,063 chars, djb2 hash 3641483271), Sept. 30 ~1:05 a.m. ET: reads `sports-live/current.json` from Pages, baked fallback 4cc4ad3 (The Tunnel game-day opener, build stamp `478953c7` on the page, nav score bug without seconds under 1440px). `current.json` = 4cc4ad3. Rollback of the embed: PATCH the rev 27 loader (`home-code-loader-8688c05.html`).
- pointer → 729e645 (embed unchanged, still rev 28), Sept. 30 ~1:50 a.m. ET: nav links 16px apart at 821–1439px so Store never clips (production at 1365 showed "STOR"). First deploy through `current.json`. Rollback: point `current.json` back to 4cc4ad3.

- pointer → 91523da then **b4158dd** (embed unchanged, still rev 28), Sept. 30 ~7:25 a.m. ET: Share GatorBait bundled into the build (PRs #70, #71): Share buttons on The Road Ahead, The Tunnel CTA row and the show module; cards drawn on the device, Web Share API with fallback sheet; short labels under 600px. Live shots run 36708205702 showed build ad6bec86 on both profiles. Rollback: point `current.json` to 729e645 (no Share).
- pointer → ee6df29 then **9f166e2** (PRs #73, #74), Sept. 30 ~8 a.m. ET: story-page mount survives Wix hydration (observer stays alive on `/post/` pages). Live shots run 36712303637 shows the button at 390.
- pointer → **cfe4b4b** (PRs #79, #80; deploy commit 85272eb), Sept. 30 ~9:10 a.m. ET: The Tunnel shows the opponent's record next to its rank (`next.opponentRecord` from `scoreboard.json`, "No. 25 · 3-1"), and the fan modules (Make the Call, Ask GatorBait, The Stands) are bundled and mount only when `deploy/cloudflare/endpoints.json` on Pages lists their Worker URLs (404 today, so nothing mounts). Live shots run 36719666693: build `3699f7f3` at 390 and 1365, Tunnel found, no errors. Rollback: point `current.json` to 9f166e2 (no record, no mounts) or 729e645 (pre-Share).
- pointer → 499dca9 (PR #82, Eddie Gilley on the Columnists rail), then 8e364ab (PR #83, Story Kit on `/post/` pages), 6dc26d9 (PR #85) and **eece061** (PR #86, the strip contributes no intrinsic width), Sept. 30 ~11:30 a.m.–1:30 p.m. ET. Live shots run 36746107824: h1, Share button and strip at x 0 and full viewport width at 320/390/430. Rollback: 499dca9 (no Story Kit) or cfe4b4b.
- pointer → 3c3942b (PR #92, covers listed in `front-page.config.json` `covers[]` render whole in a 16:9 contain frame), then **677d5c3** (PR #93, newsletter capture: `sports-live/src/capture.js` bundled after story-kit.js; hub signup module on the homepage and inline/end/slide-up cards on `/post/` pages, submitting to Wix form `6babfee8` with an anonymous visitor token), Sept. 30 ~4:40–5:45 p.m. ET. Live shots runs 36750655964 (lead cover whole at 390/1365) and 36753071936 (probe: token OK, 400 on the empty submission, two cards per story). Rollback: eece061 (no covers/capture).
- pointer → **9653d73** (PR #94, Shell 2026 homepage half: Store nav link opens in a new tab and stays in the nav at every desktop width), Sept. 30 ~7:05 p.m. ET, deploy commit d8f68ec. Pairs with the header `7fee4de6` rev 31 and footer `f8b950c9` rev 28 PATCHes (`deploy/shell-2026/`). Rollback: 677d5c3.
- **Story pages:** new custom embed `f285a38c-4a2b-43e9-b22d-a66eaeedfb41` "GBM - Share GatorBait v1 (story pages)", rev 1, HEAD, ESSENTIAL, loadOnce false, 1,003 chars, djb2 1281193840 (`deploy/share-2026/post-share-loader-91523da.html`). Runs only under `/post/`; follows `current.json` for `sports-live/share.js`, baked fallback 91523da. Rollback: disable that one embed, re-sending ESSENTIAL.

## Rollback
- **A build (from rev 28):** commit `sports-live/current.json` back to the previous commit on `main`; live within about a minute, no Wix write.
- **The embed (one PATCH):**
1. GET the embed, note `revision`.
2. PATCH with `embedData.html` = the exact contents of `home-code-rev22.html` (14,035 chars, djb2 hash 2150811198), `embedData.category` = `ESSENTIAL`, and the current `revision`.
3. Verify by length and hash, then run the live presentation QC.

No site publish is needed in either direction.
