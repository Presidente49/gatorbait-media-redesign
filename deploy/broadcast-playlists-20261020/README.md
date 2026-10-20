# Broadcast playlists — live Oct. 20, 2026

The broadcast page now has a live-channel box and three separate playlists: Florida Gator Lowdown with Loren Meadows, The Buddy Martin Show Podcast and Shorts.

## Production

- URL: https://www.gatorbaitmedia.com/the-buddy-martin-show
- Existing TV embed: `82c4ca83-98df-4f35-9972-7345a2a71755`, final revision40, **HEAD**, enabled, loadOnce:false, ESSENTIAL. No Wix Editor/site publish.
- Human-readable runtime: `sports-live/broadcast-playlists.js`, PR410 merge `fa039be6f297d29a1849b38e4a52fd6638b3980a`, source SHA256 `e10aa2bdfa85b1c9dce0cd361e3e9f30229a950c3c4ba1dc8e0e582376ff6b7c`.
- Final `embed-after.html`:14867chars, SHA256 `88aebb9150a09527c4f4c02fdf3d2fd337a18285072e295c98588bc01e06fa59`. Reproduce with `python build-inline.py --check` (pinned free Terser5.44.0). CSS literal newline removal + JS minification only; features unchanged. Native hide remains scoped to the real mounted hub, with no permanent blanket hiding. Removed legacy `.mh-*` presentation CSS is unused by this runtime.
- One click-loaded player at a time, no autoplay, explicit YouTube fallbacks. Live-channel language does not claim that a broadcast is currently on air. No stale episode dates or invented counts. Bounded route/mount retries, no interval in production.

## Verified

Exact public playlist URLs independently returned200 with matching YouTube titles; `playlist-primary-check.json` links the read-only public probe. No playlist-item count or playback is inferred from page existence. Two public vidIQ searches consumed10 existing credits; no purchases or account/channel mutations.

The initial external-loader release39 passed final-layout/UI tests but independent cold-load sampling caught the old white Wix welcome page before mounting. A separate bounded correction cycle used the same code inline in HEAD to remove the extra fetch. Fresh full-entity guards matched38→39 and39→40; each PATCH included ESSENTIAL and immediate GET verification. `provider-after.json` records intermediate39; `provider-final.json` is final40.

Final candidate and **actual cache-busted public** Chromium320/390/430/1366/1920 pass: one root, exact three playlists, no document overflow, zero initial iframes,44px controls, four correct player URLs, single-player switching, close/restored focus and route cleanup. Root viewed actual phone top and desktop playlist screenshots. See `inline-final-candidate/` and `live/`. Additional actual390/430 CSS widths pass in `live-css-width/`; iPhone-UA device emulation can otherwise use Wix's existing320px CSS layout viewport.

Final actual cold loads390/1920 have zero native welcome-flash samples over the bounded observation; `inline-head-live/`. Independent initial and final UI/cold-load checks are in `independent/` (revision39 flash is retained as before evidence; final40 is separate). Muse independently passed revision40 at05:17:24Z: zero native flashes across224 observations, correct inline source/IDs, no initial iframe, menu/Escape and cookie settings, no consent save. `independent/final-r40/` contains actual captures and receipt. Read-only repeatable checks: `qc.py` (or `--css-width`) and `paint-qc.py`.

## Limits

Embedded audio/video playback cannot be confirmed because YouTube is unreachable in this container. Player construction, exact destination URLs, external fallbacks and page existence are distinct evidence. Physical iPhone playback has not been tested. Existing desktop `wixTagManager is not defined` remains, recorded in browser receipts; phone runs have no page errors.

Broad repository CI39372808309 fails at an **unchanged magazine byte cap**:188969 >188416. Neither the magazine source nor its build check differs from the base. The workflow's homepage image tests passed; this feature's candidate/live checks passed. Do not report broad CI as green.

## Rollback

`rollback/embed-before.json` is exact pre-task revision38, including HTML and BODY_END. GET the current entity and require it still matches the final40 release fingerprint before rollback. Use its fresh revision; restore original HTML **and BODY_END position**, re-send ESSENTIAL, preserve enabled/loadOnce. Never send an old revision number. No site publish.

No subscriber email/social send, automation toggle, purchase, business/account change or homepage change.
