# Loop: front page

**Goal:** a reader on a phone reaches the newest story, the show, the newsletter and All Access from the first two screens of gatorbaitmedia.com.

**Owner:** Codex builds and deploys through PR #285 (Home Code `622d8ece`, loader `fdc2127a`, Home Styles, header, footer). Jarvis sets direction and reviews. The game-day band `96ef5a04` belongs to the game-day desk; coordinate in #34 before touching the game strip.

**Inputs:** `docs/research/2026-10-15/` (competitors, award winners, current-site audit), and Brenden's approved preview at https://claude.ai/artifact/9a17maLfNGwbXCde8kRzc1

## Target page, top to bottom

1. Header: short nav (Football, Basketball, Recruiting, Show, Magazine, Newsletter) and an orange **Join All Access** button.
2. One game-week strip (opponent, kickoff, TV, line, countdown). It becomes the live score on game day and the final afterward. There is only one strip on the page.
3. One editor-picked lead with the headline *below* the photo, plus 3 more. Every card shows a label, byline and time ago. Paid stories carry an **All Access** badge.
4. The Buddy Martin Show shelf, fed from the YouTube channel feed, with no stale fallback older than 48 hours.
5. "Latest": a true newest-first list, with the free newsletter signup beside it (on a phone, after story 3).
6. Columnists row (Buddy, Franz, Eddie), each with a face, a beat and a regular slot.
7. Magazine cover, then the All Access pitch. Prices and trial must match the live plans; pitch copy needs Brenden's sign-off.

## Each turn

1. **OBSERVE.** Read the live embeds and revisions, then scrape `/` with a cache-buster at 390 and 1366 px. Check: is the lead image loaded, is the headline readable and not overlapped, is the show's newest episode under 48 hours old, is there document overflow?
2. **SCOPE.** Pick the single highest-ranked open item from the list below.
3. **ACT** in the repo on a branch, building with `sports-live/build-front-page.mjs`. Pin the loader to the new commit only after the jsDelivr asset returns 200.
4. **VERIFY** at 320/390/430/1366 on the live site, using the real Wix shell, not a fixture.
5. **RECORD** a turn-log line here and in #34 with the old and new revision.

## Open items (ranked, Oct. 15)

1. Lead photo fails when the feed hands over a YouTube cover as `static.wixstatic.com/media/https://i.ytimg.com/...`. Normalize it to the raw `i.ytimg.com` URL.
2. Lead headline contrast and overlap on desktop (13:10Z report).
3. "Latest" holds stories 8–12; make it truly newest-first.
4. Free newsletter signup is about 6.5 phone screens down; move it to the second screen and add a nav link.
5. Show module stopped updating Oct. 4; feed it live and hide episodes older than 48 hours.
6. Merge the two game modules into one strip; fix the Schedule and Roster links that point to a September post.
7. The mobile cookie sheet covers about 32% of the first screen; make it a slim bar without hiding the consent choices.
8. `homepage.js` is 199 KB, and the native Wix homepage still renders behind the custom one. Trim both.

## Lessons

- A headline set on top of a photo fails whenever the photo is dark or missing. Put headlines below photos.
- Two widgets showing the same game will drift apart. One source, one strip.

## Turn log

- 2026-10-15 15:30Z · Jarvis · research and preview delivered; brief posted to #34 for PR #285 · no production write · n/a
