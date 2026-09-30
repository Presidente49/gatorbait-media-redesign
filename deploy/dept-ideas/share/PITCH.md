# Share GatorBait — one-tap sharing on every story, the season card and The Tunnel

## 1) The idea (two sentences)

Every GatorBait story, The Road Ahead season band, The Tunnel game-day opener and The Buddy Martin Show module gets one Share button that opens the phone's native share sheet with a designed Swamp Night image card drawn on the device from the page's own data (the real 52-28 final, the 4-0 record, the Missouri countdown) plus the canonical story URL tagged for analytics. Readers stop screenshotting ESPN and start passing around GatorBait cards that carry our name and our link, and we can see in GA4 exactly how much traffic that brings back.

## 2) Why readers or revenue care

- Game week is the peak. Florida is 4-0 and No. 8 after beating No. 4 Ole Miss 52-28, next at No. 25 Missouri, Sat., Oct. 3, 3:30 p.m. ET on ABC (ESPN via `sports-live/scoreboard.json`). That week produced 20 stories in `gazette-live/posts.json` between Sept. 27 and Sept. 29, and every one of them currently ships with zero share affordance beyond the browser's own menu.
- A share is the cheapest new reader we can buy. Every X post or Facebook share is one link a follower did not have to search for, and the card puts "GATORBAIT" and `gatorbaitmedia.com` in the image itself, so even a re-screenshot still credits us. Screenshots of ESPN credit ESPN.
- It is measurable from day one. Every shared link carries `utm_source=gatorbait_share`, `utm_medium=x|facebook|copy|native`, `utm_campaign=story|season|tunnel|show`. GA4 is already on the site (`docs/HOMEPAGE-BASELINE-LOCK.md`), so the report is a filter, not a build. Assumption, not a measurement: if 2% of article readers tap Share and each share brings one visit, article traffic rises about 2% for near-zero marginal cost. The tags let us kill or keep the feature on numbers in two weeks.
- Revenue follows page views (ads, All Access button), and shared traffic arrives on the story page, not a social wall, so it lands on the pages that carry the ads.
- "Share your seat": I recommend a light version and nothing more. On game day only, The Tunnel adds a second prompt, "Share your seat," which opens the same native sheet with the countdown card and pre-filled text (`#Gators at #Missouri, kickoff in 3h 12m, via gatorbaitmedia.com`). Readers post their own photo alongside it on their own X or Facebook. The site never receives, stores or moderates reader photos, so there is no rights, moderation or member-data problem. A true upload wall does not earn its cost this season.

## 3) How it is built (files, where it lives on Wix, embed size, hours)

- Files: `sports-live/src/share.js` and `share.css` (new, about 6,500 characters combined after the same comment-stripping build the homepage uses), built by `sports-live/build-front-page.mjs` into `sports-live/share.js` and served from jsDelivr at the commit `sports-live/current.json` points at. Build and rollback are the same one-line pointer change as the homepage (`deploy/front-page-2026/README.md`).
- Homepage: no new embed. `front-page.js` already renders The Road Ahead (`#gbm-road`), The Tunnel (`.fp-tunnel`) and the show module; each gets one `<button class="fp-share" data-share="season|tunnel|show">` and the existing loader pulls `share.js` after first paint, so the 1.5-second no-jump budget is untouched. Buttons are 44 px, Barlow, Swamp Night tokens.
- Article pages: one Wix custom-code embed on blog post pages, body end, about 700 characters, the same V3 pointer loader pattern as Home Code (1,063 characters today, `deploy/dept-ideas/web/PITCH.md`). Well under Wix's 15,000-character embed limit. It reads the story's title, byline and canonical URL from the page's own `<h1>`, author block and `<link rel="canonical">`, so it needs no feed fetch and no ID list.
- The card: a 1200x630 `<canvas>` drawn on the device (navy #07122e, blue #0021a5, orange #fa4616, ink #f3f5fa, muted #b9c4dc, Barlow Condensed). Story card shows kicker, headline, byline and URL. Season card shows the record, rank, the four results and the next game. Tunnel card shows the live countdown, and after kickoff the score or the final, all from the same `scoreboard.json` object the homepage already holds. The URL and "Source: ESPN, GatorBait" are printed on every card.
- Share sheet: `navigator.share()` with the PNG attached where `canShare({files})` is true (iOS Safari, Android Chrome), otherwise text plus URL. Fallback for desktop and older browsers is the in-page sheet in the demo: Copy link, Post on X (`x.com/intent/post`), Facebook (`sharer.php`), Save image. Nothing is uploaded anywhere; there is no server.
- What Wix limits, honestly: blog post Open Graph tags are Wix-managed. The link preview a platform draws when someone pastes the URL uses the post's Wix cover image and title, not our generated card, and an embed cannot change that per post. The generated card travels only when the reader shares the image itself (native sheet with file, or Save image and attach). So the plan is both: keep Wix's OG tags clean (cover image, title, description set in the post editor) and ship the card as the attached image. The demo's `preview.html` is a static page, so it carries no OG tags of its own; production stories keep Wix's.
- Effort: 8 hours build (canvas cards, share sheet, homepage hooks, article embed), 2 hours Playwright QC at 320/390/430/1365 using the existing `live-presentation-qc.yml` pattern plus iOS Safari and Android Chrome hand checks for the file share, 1 hour deploy and rollback notes. About 11 hours, no new services.

## 4) What it needs from Brenden

1. A yes on placement: Share button under the byline on stories, in the corner of the season band, and beside the Kickoff-in countdown in The Tunnel. The demo shows the button positions.
2. Whether the "Share your seat" prompt runs on game day. It is a text prompt only; say no and the feature ships without it.
3. Confirm the card wordmark: plain "GATORBAIT" in Barlow Condensed as in the demo, or the site logo as an inline SVG (no network image; I would need the SVG source).
4. Controller sign-off through Master Control for the two writes: the `share.js` addition to the homepage bundle behind the existing pointer, and one new embed on blog post pages, with the rollback recorded first. Magazine stories get the same button; each story keeps one canonical URL, the button never duplicates a story.

## 5) Risks

- Link previews will not match the card (see Wix limit above). Mitigation: put the URL on the card and keep Wix OG cover images current, so the paste-a-link case still looks right.
- Copy link and Save image cannot be attributed by destination, only by `utm_medium=copy`. Mitigation: count Share taps with a `data-share` marker the way the Read Next pitch counts card taps, and read both numbers.
- Font timing on canvas: if Barlow Condensed has not loaded, the card draws in a fallback. Mitigation: draw after `document.fonts.ready`, as the demo does, and the fonts are already loaded by the page.
- Embed failure mode on article pages (`docs/INCIDENT-2026-09-15-HOMEPAGE-BLANK.md`). Mitigation: leaf element at body end, try/catch around everything, renders nothing on any error, pointer rollback in one commit.
- Wix blog DOM changes could move the byline mount point. Mitigation: mount by `<article>`, fall back to the end of `main`, and the QC workflow screenshots after every build.
- Share text is public speech from our domain. Mitigation: text is generated from headline, byline, record and schedule only, AP style, never from reader input.
- The traffic estimate is an assumption. Ship with the UTM tags and read GA4 before calling it a win.
