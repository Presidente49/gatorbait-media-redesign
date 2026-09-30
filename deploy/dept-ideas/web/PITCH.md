# Read Next — a smart related-story rail for every article page

## 1) The idea (two sentences)

Read Next is a three-card rail at the end of every gatorbaitmedia.com story that picks the next stories for that reader by shared opponent, player and coach names, same writer and freshness, using the feed the homepage already has in hand, and it never shows a story the reader has already opened on that device. It replaces "2–3 genuinely related stories, not a generic feed dump" (docs/ARTICLE-PAGE-STANDARD.md) as a hand-picked chore with something that is right on every story, including the ones nobody had time to tag.

## 2) Why readers or revenue care

- Today Wix's related-posts block only shows stories an editor typed in by ID, up to three, and posts published fast go out with one or none (docs/RELATED-STORIES-2026-09-23.md). A reader who finishes Buddy Martin's "Put Down the Poll, Gators. Missouri Is Waiting" (https://www.gatorbaitmedia.com/post/put-down-the-poll-gators-missouri-is-waiting-and-there-s-a-new-definition-for-one-game-at-a-time) should see "Show-Me State of Mind: A First Look at No. 25 Missouri" (https://www.gatorbaitmedia.com/post/first-look-missouri-florida-gators-show-me-state-of-mind) and "Pay the Toll: Sumrall Buries the Ole Miss Win, Braces for 'Bloody Tuesday' Before Missouri" (https://www.gatorbaitmedia.com/post/pay-the-toll-sumrall-buries-the-ole-miss-win-braces-for-bloody-tuesday-before-missouri). The demo makes exactly that pick, and shows why on each card ("Missouri", "Sumrall", "poll").
- Game week is the moment: Florida is 4-0 and No. 8, next at No. 25 Missouri, Sat., Oct. 3, 3:30 p.m. ET on ABC (ESPN, sports-live/scoreboard.json). Every Missouri story feeds every other Missouri story all week without an editor lifting a finger.
- Revenue lever is pages per session. Each extra story read is one more set of ad impressions and one more pass by the Join All Access button. Assumption, not a measurement: if one reader in 10 taps one more story, article page views rise about 10%. The rail sets `data-rn-pick` on each card so the existing analytics can count taps and prove or kill that number in two weeks.
- The "N new since your last visit" pill gives the return visitor a reason to go back to the front page. Everything is device-local (localStorage), no login, no member or email data touched, nothing sent anywhere.

## 3) How it is built (files, embed size, data source, effort in hours, how it fits the 15,000-character limit)

- Files: `sports-live/src/read-next.js` and `read-next.css` (new, about 5,500 characters combined after the same comment-stripping build as the homepage), built by a 20-line addition to `sports-live/build-front-page.mjs` into `sports-live/read-next.js`, served from jsDelivr at the commit `sports-live/current.json` already points at, so a build and a rollback are the same one-line pointer change the homepage uses (deploy/front-page-2026/README.md).
- Embed: one Wix custom-code embed on blog post pages, body end, about 700 characters: the same V3 pointer loader pattern as Home Code (1,063 characters today). Well under 15,000; the article page's existing embeds are untouched. Nothing on the homepage changes.
- Data source, in this order: (1) the homepage's `sessionStorage` `gbm-public-feed` cache, good for 15 minutes, so a reader who came from the front page costs zero extra requests; (2) one same-origin fetch of `/blog-feed.xml` (the homepage's own path); (3) `presidente49.github.io/gatorbait-media-redesign/gazette-live/posts.json`. Opponent names come bundled at build time from ESPN's schedule in `sports-live/scoreboard.json` (Missouri, South Carolina, Texas, Georgia, Oklahoma, Kentucky, Vanderbilt, Florida State); player and coach names come from a 30-word list in `front-page.config.json` that Brenden or the desk edits.
- Ranking, all client side: shared lexicon terms times 3, same writer +1, minus 0.4 per day old; the current story and anything in the device's read list are excluded; top three render. A story with no match still gets the three freshest unread stories, so the rail is never empty.
- No-jump: the rail reserves its height before paint (`min-height`), paints once inside the 1.5-second budget the homepage uses, and never repaints. Barlow and Barlow Condensed only, Swamp Night tokens, 44 px tap targets, `aria-label="Read next"`.
- Effort: 6 hours build, 2 hours Playwright QC at 320/390/430/1365 using the existing `live-presentation-qc.yml` pattern, 1 hour to write the deploy and rollback notes. About 9 hours total, no new services, no scheduler, no server.

## 4) What it needs from Brenden

1. A yes on the placement: below the story body, above Wix's native related-posts block (which stays as is) or replacing that block's spot. The demo shows the below-body placement.
2. The 30-word name list to start with (players and coaches worth matching on). I can draft it from the last 20 stories in `gazette-live/posts.json` for approval.
3. Confirmation that the rail may go on Magazine stories too, or Front Page stories only. Either way a story keeps one canonical URL and one primary home; the rail links, it never duplicates.
4. Controller sign-off for the one Wix write (a new embed on blog post pages) through Master Control, with the rev-22-style rollback recorded first.

## 5) Risks

- Wrong-feeling picks: keyword matching is not editorial judgment. Mitigation: the "why" chips make every pick explainable, the lexicon is a config file, and an editor's manual `relatedPostIds` still win the top slot when present.
- Embed failure mode: the September blank-homepage incident (docs/INCIDENT-2026-09-15-HOMEPAGE-BLANK.md) came from custom embeds. Mitigation: the rail is a leaf element added at body end, wrapped in try/catch, renders nothing on any error, and is behind the same pointer loader that rolls back in one commit.
- Second front-end fetch on article pages: docs/RELATED-STORIES warns against another front-end fetch to fill native slots. This is a separate, labeled rail, uses the cache first, and makes at most one same-origin request. Brenden should decide whether that trade is acceptable.
- Wix blog DOM changes could move the mount point. Mitigation: mount by the article `<article>` element, fall back to the end of `main`, and the QC workflow screenshots the page after every build.
- Storage blocked (private browsing, consent settings): the rail still works, it just cannot remember what was read. All storage reads and writes are wrapped in try/catch.
- Measurement: the 10% figure is an assumption. Ship with the `data-rn-pick` markers and read the numbers before calling it a win.
