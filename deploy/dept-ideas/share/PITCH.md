# Share GatorBait

## The idea

One Share button on every story, on The Road Ahead, on The Tunnel and on The Buddy Martin Show module. It draws a 1200x630 Swamp Night card on the reader's phone with Canvas from the live feeds the homepage already uses (`gazette-live/posts.json`, `sports-live/scoreboard.json`), then opens the phone's native share sheet with the PNG attached and the canonical URL tagged for GA4. Where the Web Share API is missing it shows its own sheet: Copy link, Post on X, Facebook, Save image. Readers pass around GatorBait cards with our name and our link on them instead of screenshots of ESPN.

This is working code, not a mockup: `deploy/dept-ideas/share/share.js` is a drop-in module in the `front-page.js` style, and everything under Evidence was produced by running it in a real browser.

## Why it matters

- Game week is the peak. Florida is 4-0 and No. 8 after beating No. 4 Ole Miss 52-28, next at No. 25 Missouri, Sat., Oct. 3, 3:30 p.m. ET on ABC (ESPN via `sports-live/scoreboard.json`). The feed carries 20 stories from Sept. 27 to Sept. 29 (`gazette-live/posts.json`), and none of them has a share affordance beyond the browser menu.
- Every shared link lands on our page, not a social wall, and is attributable: `utm_source=gatorbait_share`, `utm_medium=native|copy|x|facebook|image`, `utm_campaign=story|season|tunnel|show`. GA4 is already on the site (`docs/HOMEPAGE-BASELINE-LOCK.md`), so the report is a filter. The module also fires a `gbm:share` DOM event and a `gtag('event','share')` call when `gtag` exists, so Copy and Save taps are counted too.
- The card carries "GATORBAIT", the URL and "Source: ESPN" in the pixels, so even a re-screenshot credits us.
- The Tunnel card changes state by itself from the scoreboard feed: countdown before kickoff, live score with quarter and clock during the game, final after. Same object the homepage uses, no desk work.

## Evidence

Tool calls made (all read-only or local; nothing written to Wix, GitHub or Canva):

1. **Playwright 1.56.1, Chromium, local** (`share-qa.mjs`, log in `qa-log.txt`). Fixtures served as `https://www.gatorbaitmedia.com/` and `/post/put-down-the-poll-...` with the real `posts.json` and `scoreboard.json` seeded; Barlow and Barlow Condensed from the container's system fonts.
   - 390 px article page: one `[data-share="story"]` button mounted under the headline; tap opened the sheet (`shots/sheet-story-390.png`); the Share... button called `navigator.share` with `{title:"GatorBait", text:"Put Down the Poll, Gators. Missouri Is Waiting. ... — Buddy Martin on GatorBait", url:".../post/put-down-the-poll-...?utm_source=gatorbait_share&utm_medium=native&utm_campaign=story", files:["gatorbait-story.png image/png 110679"]}`. Zero page errors.
   - 390 px homepage fixture: three buttons mounted (`tunnel`, `season`, `show`), each 44 px tall (`shots/home-390.png`, `shots/sheet-tunnel-390.png`). Zero page errors.
   - 1365 px, no `navigator.share`: fallback sheet (`shots/sheet-season-1365.png`); Post on X opened `https://x.com/intent/post?text=Florida%204-0%2C%20No.%208...&url=...utm_medium%3Dx%26utm_campaign%3Dseason%23gbm-road`; Facebook opened `https://www.facebook.com/sharer/sharer.php?u=...utm_medium%3Dfacebook...`; Copy link wrote the text plus tagged URL to the clipboard; Save image downloaded `gatorbait-season.png`; Escape closed the sheet. Zero page errors.
   - Real generated cards, straight from the canvas: `cards/story.png`, `cards/season.png` (4-0, No. 8, W 66-21 Florida Atlantic, W 52-3 Campbell, W 44-39 at Auburn, W 52-28 No. 4 Ole Miss, next at No. 25 Missouri), `cards/tunnel-countdown.png` (3d 3h 30m at the fixture clock of Sept. 30, noon ET), `cards/tunnel-live.png` (QA fixture score 24-17, Q3 8:14, labeled fixture), `cards/tunnel-final.png` (Florida 52, No. 4 Ole Miss 28), `cards/show.png` (next live Wed. 9 p.m. ET).
2. **terser 5.51.2** (`npx terser -c -m`): `share.js` 22,242 chars source, `share.min.js` 15,276 chars, 6,227 bytes gzipped. Against the 15,000-character Wix embed limit: the module is 276 characters over if pasted inline, so it does not go inline. It rides jsDelivr exactly like `homepage.js` (120,644 chars, served at the commit in `sports-live/current.json`), and the pasted embed is `loader-snippet.html`, 294 characters. If Brenden wants it inline anyway, about 300 characters of CSS come out.
3. **Canva** (three calls). `list-brand-kits`: one Brand Kit on the account, id `kADrKmKAhUs`. `search-brand-templates` (dataset: any): `{"items":[]}`, no Brand Templates exist. `help` on autofill: "Your Pro plan and Owner team role let you publish Brand Templates, but the information I have doesn't establish whether Pro includes data fields or Autofill API access. It does say that filling Brand Templates with your own data through the ChatGPT integration requires Canva Enterprise." Result: Canva cannot render per-post OG cards server-side for us today (no template, and data autofill is an Enterprise feature). Blog OG images stay Wix-managed; the on-device card is the share image.

What Wix limits, honestly: blog post Open Graph tags are set by Wix from the post's cover image and title. A pasted link previews with the cover, not our card. The card travels only when the reader shares the image itself, which is what the native sheet does by default on iOS Safari and Android Chrome (`files` in the share payload above).

## What it needs from Brenden

1. A yes on placement: under the headline on stories, in The Road Ahead header, beside The Tunnel's game-preview button, beside Watch on YouTube on the show module (see `shots/home-390.png`).
2. Two production writes through Master Control, rollback recorded first: (a) add `share.min.js` to the build the Front Page loader runs, or load it from the homepage bundle after first paint; (b) one new custom-code embed on blog post pages, the 294-character loader in `loader-snippet.html`, with `<commit>` set to the main commit that holds `share.min.js`. Move the file to `sports-live/` in that commit so it deploys and rolls back with `current.json`.
3. Confirm the wordmark: plain "GATORBAIT" in Barlow Condensed as in the cards, or the site logo as inline SVG (needs the SVG source; no network image).
4. Optional, game day only: a "Share your seat" prompt in The Tunnel that opens the same sheet with the countdown card. The site never receives or stores reader photos.

## Risks

- Link previews will not match the card (Wix OG). Mitigation: the URL is printed on the card; keep Wix cover images current.
- Wix blog DOM: the article mount is `article h1` or the page's first `h1` plus `link[rel=canonical]`; a Wix template change could move it. Mitigation: the button renders nothing if no `/post/` canonical is found; live QC screenshots after every build.
- Embed failure mode (`docs/INCIDENT-2026-09-15-HOMEPAGE-BLANK.md`). Mitigation: leaf elements appended at the end of existing containers, every handler in try/catch, pointer rollback in one commit, and the homepage runtime is untouched.
- Font timing: the card waits on `document.fonts.load` for Barlow Condensed; if the font never loads it draws in the fallback sans.
- Copy and Save cannot be attributed by destination. Mitigation: `utm_medium=copy` plus the `gbm:share` event and `gtag` share event.
- The QA run is a fixture, not production Wix. Real iOS Safari and Android Chrome hand checks of the file share are the last step before sign-off.
