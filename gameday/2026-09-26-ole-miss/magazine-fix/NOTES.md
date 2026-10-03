# Magazine native-content fix (local only, not deployed)

Worker notes from 2026-09-27. No Wix API calls were made and nothing was committed.

## Root cause
- The native Wix /magazine page still holds a Blog Post List widget, `comp-lpkor7th` (Pro Gallery, 12 August posts). It sits in `#SITE_PAGES`, so it is in the server HTML.
- The embed hid it with a single rule: `html:has(#gbm-magazine-page) #SITE_PAGES,.gbm-mq #SITE_PAGES{display:none!important}`. A browser without `:has()` support (Safari before 15.4, Firefox before 121, or an old WebView) drops that entire selector list, including the `.gbm-mq` fallback. The gallery then renders under our Magazine. See `shots/before-nohas-390.png`.
- A second gap: `.gbm-mq` hid the native page with no timeout. If mount failed, the page stayed blank (`before-mountfail-390`).
- The 02:08Z TinyFish `fetch_content` capture is DOM extraction. It returns `<main id=PAGES_CONTAINER>` and ignores CSS. Our `<main id=gbm-magazine-page>` is outside it, so the capture shows only the August list. In modern Chromium the old embed already hid the gallery (0 of 24 items visible). Crawlers and reader modes will keep seeing the August list until the native widget is changed in the Wix Editor. That is owner or controller scope, not this embed.

## Change
1. **Pre-mount:** `.gbm-mq:not(.gbm-magazine-live)` sets the native page and the footer to `opacity:0`. A 4-second CSS animation reveals them if our Magazine never mounts, so the page is never blank. This rule contains no `:has`.
2. **Post-mount:** `.gbm-magazine-live #SITE_PAGES{display:none!important}` hides the native page. A separate `html:has(#gbm-magazine-page)` rule does the same as a backup.
3. **Layout rules:** these now key on `.gbm-magazine-live` instead of `:has`.
4. **JS:** `H.add('gbm-magazine-live')` moved to after the insert succeeds. **The same one-line move must be made in `automation/site-design/magazine.js`**, or `build.py` will revert it.
5. **Trims to fit the cap:** the duplicated mobile `.mast` rule was merged and the unused `--b` var dropped. Screenshots are byte-identical before and after.

| file | before len / fp | after len / fp |
|---|---|---|
| magazine-embed.html (PATCH `1dd74333-ee02-40da-9c93-cf8fd787c129`, keep ESSENTIAL) | 14946 / 1817297743 | 14957 / 3827185681 |
| magazine-style.html (build input, not a separate embed) | 5233 / 3313047473 | 5246 / 802332201 |

`fp`: h=(h*31+charCodeAt(i))>>>0 over UTF-16 units. The before value matches the live "Magazine v8 (14,946)". Diff against a fresh GET before patching.

Rollback: PATCH `1dd74333` with `rollback-magazine-embed.html`, keeping category ESSENTIAL.

## Tests (`node harness.mjs <embed> <label>`, results-*.json, shots/)
Visible native items / Magazine visible:

| case | before | after |
|---|---|---|
| feed 390 / 1366 | 0 / yes | 0 / yes |
| feed timeout 390 / 1366 | 0 / yes | 0 / yes |
| no :has 390 / 1366 | **12 / yes** | 0 / yes |
| mount failure | **blank** | native shown at 4s |
| SPA entry | 0 / yes | 0 / yes |

First paint (feed held): no native paint in either version.

## Fallback list `D`
- `D` is pre-game Ole Miss week: the Cowboy lead plus pregame lines.
- Separately, the hard-coded `GAME DAY` ref says "Kickoff is today in The Swamp". It shows even when the feed works, and it is now stale.
- Recommendation: do not extend the 1.5s timeout, which only delays first paint. A late feed response is discarded after fallback, so refresh `D` from a fresh Wix Blog read instead. Lead: THE SWEET MUSIC CHIMES AGAIN! Lines: Halftime, Lacy-Less, Soothsayer. Also retarget the `GAME DAY` ref to the postgame recap.
- `home-fallback.json` is from 17:23Z Sept. 26 and has no postgame posts. Refreshing takes about 0 chars net if titles and excerpts are similar in length; the 43 chars of headroom is tight.
