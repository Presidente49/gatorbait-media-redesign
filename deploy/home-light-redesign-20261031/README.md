# Light homepage redesign, Oct. 31, 2026

Brenden: "We still have this really, really dark website. Go ahead and redesign it." Plus a Facebook Page and the latest Buddy Martin Show videos on the front page. Nothing here is live: no Wix write, no publish, no email or social. Jarvis ships it with one pin change.

## What changed

New file `sports-live/broadcast-home-light.js` (104,513 bytes, SHA-256 `6ff71639e33fb50b1f471afed53af2d63bc441cba896452e1b7da1c994aceba1`). It is `broadcast-home-color.js` (same ticker, game-day, ESPN, feed, photo and byline logic) plus:

- **Light layer** (scoped under `html.gb-light`, appended after the dark rules). Palette per Brenden's correction: Gator blue `#0021A5`, Gator orange `#FA4616`, white, light gray `#F4F6FA`, near-black `#111827` text, green `#22884C` only for small marks (status dot, thumbnail and heading rules). No navy. Orange as TEXT on white uses the darker `#B8360F` (AA); orange is otherwise a fill or rule. Barlow / Barlow Condensed only.
- Header white with an orange rule; phone shell header is solid Gator blue; footer is white (both owned by other embeds, restyled on the front page only through CSS).
- Lead: white card, photo left and headline right on desktop; photo, headline, deck on phones. Photo is never covered by text.
- **Game-day band**: solid `#0021A5`, white text, orange "Football · Kickoff" tag, white countdown tiles with orange underline. The countdown now also shows on phones (it was hidden there). The redundant small game-day card is hidden on phones; on desktop it is replaced by the full-width lead (a live or final scoreboard card still appears beside the lead after kickoff).
- **Follow GatorBait** module right after the band: (a) Buddy Martin Show strip, 3 newest distinct videos (thumbnail, title, date, link out, opens in a new tab); (b) Facebook Page Plugin iframe plus an always-visible "Follow GatorBait on Facebook" button; (c) "More stories" row of 4 recent stories not already on the page. Phones: videos and stories are swipe rows. Everything is below the fold, the iframe and thumbnails load only within 700px of the viewport, space is reserved so nothing shifts.
- Wide screens (1700px and up) widen the content column to 1400px.

## Constants and data sources

All in the `GL` object near the top of the module code.

- `GL.FB_PAGE = https://www.facebook.com/gatorbaitmedia`. Found in the live footer link and the site's JSON-LD. A public Page Plugin iframe only: no Meta account connected, no login, nothing posted.
- Videos: tries the YouTube RSS feed first, then `sports-live/buddy-videos.json` on GitHub Pages, then `sports-live/episodes.json`, and starts from a baked snapshot (Oct. 31) so first paint is never empty. **YouTube's feed sends no CORS header, so the browser read always fails on the live site** (confirmed in QA); the baked snapshot shows until the Pages file is read. Keep the Pages file fresh with `node sports-live/build-buddy-videos.mjs` (added; run it from any existing refresh job; I did not add a schedule). `episodes.json` is stale (Oct. 4), so it is the last resort only.
- Duplicate-title uploads (e.g. the two "The Name Game" uploads) are collapsed to one.

## Pin it (Jarvis)

Embed `0c13f955-74bf-484c-abd9-359a5eef271b` currently loads `.../<40-hex>/sports-live/broadcast-home-color.js` from githack (QA saw `1df90faa97391a38a1dd0c3ff9c6d13b522422b3` live today, not the `a2fb77c9` named in the brief). One change, with the usual revision and fingerprint guard, category ESSENTIAL re-sent:

```
https://rawcdn.githack.com/Presidente49/gatorbait-media-redesign/f0028949320a3e08a59156a6819fbcd1fda4e4b2/sports-live/broadcast-home-light.js
```

`f0028949320a3e08a59156a6819fbcd1fda4e4b2` is the commit that added the file on branch `jarvis/home-light-redesign-20261031` (PR to main; the pin works from the branch commit, and after a squash merge pin the merge SHA instead). Verified: githack returns HTTP 200, `application/javascript`, SHA-256 identical to the file above; jsDelivr (`cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@<sha>/sports-live/broadcast-home-light.js`) also returns 200 today. Lesson from Oct. 28: jsDelivr can refuse new references (50 MB repo limit), so prefer githack.

## Rollback

Re-pin the same embed to the file it serves now: `.../1df90faa97391a38a1dd0c3ff9c6d13b522422b3/sports-live/broadcast-home-color.js` (or `a2fb77c94d707761245d26540ad9fd1ea9c66cc3`, or whatever is live when you start). One PATCH, no data to undo.

## QA (qa.cjs)

`node deploy/home-light-redesign-20261031/qa.cjs` loads the real `https://www.gatorbaitmedia.com/?cb=<ts>`, intercepts the loader's githack or jsDelivr request for `broadcast-home-color.js` and serves the local file. `--before` records production as it is. Last run, 56 of 56 checks at 390, 430, 1366 and 1920: HTTP 200, no skin errors, no horizontal overflow, no broken images, band and countdown present, Barlow loaded, light surface, Follow module present, Facebook iframe present, three YouTube cards with links, More stories row, text contrast AA (99 to 149 elements tested per width, zero failures; no text sits on a photo). Screenshots: `before-<w>-fold|full.png`, `after-<w>-fold|full.png`, phone slices `after-390-s1..s6.png`, `after-430-s*.png`. Screenshot hygiene only: the Wix cookie banner and the fixed GAMEDAY10 promo bar are hidden for the capture; assertions ran with them present.

## Not verified / missing

- **The Facebook plugin does not render in this sandbox** (headless Chromium is redirected to a Facebook login URL), so the iframe appears as an empty gray card here. The iframe, URL and sizing are correct per Meta's spec, but nobody has seen it render on the real page. Jarvis: look at it right after pinning. If Facebook blocks it for a visitor (ad blockers, some regions), the card still shows the "Follow GatorBait on Facebook" button.
- The plugin sets Facebook cookies for visitors; the Meta pixel is already on the site, but I did not wire it to the Wix consent banner. Decide whether that matters.
- Physical iPhone not tested; the mobile checks are Chromium touch emulation. The phone menu drawer (other embed) was not restyled and stays dark.
- Pages file `buddy-videos.json` only goes live on GitHub Pages after this PR merges to main.
- Facebook page text/posts come from Facebook, not from our stories feed; the plugin cannot be filtered to a post type.
