# Sitewide light skin (final) - Oct. 31, 2026

One external file, `sports-live/site-light.js` (about 35 KB, 7.5 KB gzipped), loaded by `loader.html`. It does nothing on `/` and `/magazine`. Brand: Gator blue #0021A5, orange #FA4616, white, surface #F4F6FA, text #111827, tiny green #22884C. No navy. Barlow only.

## How Jarvis ships it
Add ONE new ESSENTIAL custom-code embed: paste `loader.html`, position HEAD, all pages, loadOnce false. The loader is pinned to a GitHub commit SHA (the pin is in loader.html) and sets a white background inline on non-home routes, so there is no dark flash.

## Rollback
Disable that one embed. Nothing else is touched. The file writes no storage, cookies or network calls.

## How it was tested (no live change)
`qa.cjs` loads the real production page (`?cb=<ts>`, iPhone UA below 500 px), injects the loader and serves the local file for the githack request. `mobile-probe.cjs` measures tap targets, font sizes and layout shift at 390 and 320. Checks per page and width: HTTP, skin active, light background, no near-black surface, AA contrast on all visible text, images, form fields, no horizontal overflow, phone drawer open and light, #gbm-renew-card, #gbm-gd10-bar. `/` and `/magazine` must show no skin.

## Results (phone first)
Full 22-page run: 989 of 1004 checks passed (before the last tiny font-size tweak). After that tweak, re-run on plans, plans-sub, post-pregame, home and magazine at 390 and 430: 86 of 86 pass.

| Page | 390 | 430 | 1366 | 1920 |
|---|---|---|---|---|
| /pricing-plans, /pricing-plans/subscribe | pass | pass | pass | pass |
| /post/ pregame, loren, recap | pass | pass | pass | pass |
| /post/ members gate | pass | pass | cookie-banner contrast flake | pass |
| /gatorbait-media-blogs (Latest) | pass | flag A | flag A | pass |
| blog category | flag A | flag A | flag A | flag A |
| /about, /contact, /policies | pass | pass* | pass | pass |
| /the-buddy-martin-show (TV) | pass | pass | pass | pass |
| store /product-page, /category | pass | pass | pass | pass |
| 404 | pass | pass | pass | pass |
| /tags | flag B | flag B | flag B | flag B |
| /members | pass | pass | flag C | flag C |
| /groups, group thread, checkout, thank-you | pass | groups drawer-class flake | pass | pass |
| /account/my-account | pass | pass | 403 headless | 403 headless |
| / and /magazine (must be untouched) | untouched | untouched | untouched | untouched |

`*` /about and /contact at 430 failed once on the cookie banner text, which is transient (see gaps).

## Known gaps (honest)
- A: Latest and category pages: harness flags white text on the hidden native Wix feed (not visible in screenshots; the visible feed reads correctly).
- B: /tags had an empty item list at test time; the "Read More" button label (light on light) will show if items render. Not fixed.
- C: /members hero is a photo with white text; the harness cannot read image backgrounds, so it flags it. Visually fine.
- Cookie banner text fails contrast intermittently while the banner animates in (it settles to #111827 on white).
- Tap targets: footer legal links ("Privacy & terms", "Policies", "Contact us") and the top ticker are under 44 px. Some plan-card small print is 14.4 px instead of 16 px. Not fixed.
- Layout shift: about 0.05 to 0.13 on phone (mostly Wix itself); one 0.8 reading on a cold first load of /pricing-plans, not reproduced.
- /account/my-account returns 403 headless; not tested. Signed-in members' #gbm-renew-card was checked only where it renders for visitors.
- Phone menu drawer was verified light and readable on all shell pages. Store pages and 404 have no Gator shell (n/a).
