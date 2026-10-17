# Broadcast S4: site shell and other pages

Session S4 of the Broadcast rollout (`docs/design/BROADCAST-ROLLOUT.md`). Scope comment: issue #34, "Broadcast S4 · scope".

## What changes

| Embed | Live rev (rollback file) | Candidate | What it does |
|---|---|---|---|
| `7fee4de6` Header | `rev36.html` | `rev37.html` | Ticker strip with the orange GB bug (newest four headlines from `/blog-feed.xml`, then show times and standing links), dark blue header bar, GatorBait type lockup, condensed uppercase nav with the orange underline on the current page, skewed orange "Join GatorBait" button, Search, Sign in and Shop Gear in the ticker's utility area. Phones get the ticker above the sticky bar. Story-page rules from rev36 kept as they were. |
| `c66d5b7f` Theme | `rev8.html` | `rev9.html` | rev8 kept byte for byte (homepage rules). Adds: dark phone bar and drawer (markup is S1's `fdc2127a`, restyled only), Broadcast footer (neon rail, condensed links) on every page with the shared header, and on S4 pages (`html.gbm-bc`) the deep-blue page band with the page name, condensed italic headings, chamfered buttons, membership cards and the contact form. |
| `82c4ca83` TV | `rev37.html` | `rev38.html` | `/the-buddy-martin-show` fully on the deep-blue set. The hub is now placed after the phone bar. Copy, video list and links unchanged. |
| `360c9265` Roster card | `rev4.html` | `rev5.html` | The roster and schedule card in Broadcast styling. Guide-table rules and script unchanged. |
| `360c9265` Roster card | `rev5.html` | `rev6.html` | Mounts on /magazine in every variant: classic and Wednesday in `.mz-ed` as before; pregame and postgame (no `.mz-ed`) before the magazine footer. Heading font pinned past `#gbm-live h2`. |
| `a13b04e3` UI layer | `rev5.html` | `rev6.html` | Account and writer modals: Barlow only (the system font stack is gone), condensed headings, orange bug eyebrow, chamfered buttons. Logic unchanged. |
| `5a43ae83` Site Fixer | `rev24.html` | none | Kept for the record; nothing visual to change. |

Tooling lives in this `s4/` folder (the parent folder's `build.mjs`, `qa.mjs` and `README.md` are S2's). Source is in `s4/src/`; `node deploy/broadcast-2026/s4/build.mjs` writes the candidates and prints length and djb2 for each. Rollback files are the exact HTML served on Oct. 17, 2026, about 03:00Z (taken from the live page's embed config; the magazine's fingerprint matched Jarvis's posted rev 108 value, `a8c8fd13`, which confirms the extraction).

## Why the app pages keep a light panel

Wix app pages (Pricing Plans, checkout, member account, Groups, forms) take their text colors from the Wix site theme. Putting them on the dark set would leave dark text on a dark background wherever an app renders its own color. The design system's reading panel (cream panel, dark set around it) covers this: those pages get the dark header, a dark page band, the dark footer, Broadcast headings and buttons, and keep their light reading surface. Only colors, type and buttons change on app pages; no fields are hidden and no flow changes.

## Test

`node deploy/broadcast-2026/s4/run.mjs` loads real production pages in Chromium and swaps the candidates into the page before it runs (`s4/inject.mjs`), at 320, 390, 430 and 1366 px (phones with a phone user agent, as Wix serves its mobile layout to phones). Checks: horizontal scroll, header links, ticker, page band, phone menu, Barlow-only fonts, contrast and tap targets in the shell. Load pages one at a time; parallel loads trip the site's bot check. `run.mjs --live` runs the same checks against the live site. `node deploy/broadcast-2026/s4/mount-check.mjs <outdir>` reports where the roster card lands on /magazine and / with rev6 swapped in; runs where the served page did not carry rev5 verbatim are retried, since the live embed runs in them.

## Rollback

One step per embed: PATCH the rollback file back at the then-current revision, with `embedData.category` `ESSENTIAL`. No site publish is needed or allowed.
