# The Stands

## The idea

The Stands is a live chat room for game days and show nights, built as a Cloudflare Worker with one Durable Object per room and a client written in the front-page renderer's style, so it drops into The Tunnel on the homepage and onto the show page. The score strip sits on top, paid Wix members get a Member badge and skip slow mode, and the rules live on the server: slow mode, a word filter, member-only mode, a five-minute members-only lock at kickoff read from `sports-live/scoreboard.json`, one-tap reporting (three reports hide a post until a moderator rules) and a 200-message ring buffer. When the room is closed or nobody has talked in ten minutes, readers see the score, the countdown to kickoff and the next show, never an empty feed.

This is working code with a passing local test, not a mockup; the screenshots in `shots/` are the real client talking to the real Worker under `wrangler dev`.

## Why it matters

- Game day is the one time readers are on gatorbaitmedia.com and a second screen at once. The Tunnel (`sports-live/src/front-page.js`, `tunnelHtml`) gives them a countdown, a score and a link out; a room keeps them for the whole game.
- Show nights send people off-site by design: the show module's buttons are "Watch on YouTube" and "Facebook" (`front-page.config.json`, `links`). A room on `/the-buddy-martin-show` gives Buddy reader questions to read on air and the audience a reason to open the show page.
- The Member badge and no-wait posting are the first visible perks of a paid plan that cost nothing to fulfil, and they work before Magazine paywall enforcement, which `docs/HOMEPAGE-BASELINE-LOCK.md` records as outstanding.
- The calendar: Florida is 4-0 and No. 8, off a 52-28 win over No. 4 Ole Miss, with No. 25 Missouri Saturday (Oct. 3, 3:30 p.m. ET, ABC), then No. 1 Texas (Oct. 17) and No. 2 Georgia (Oct. 31), all from `sports-live/scoreboard.json`, which `README.md` says is built from ESPN's public JSON.
- It is measurable from day one: the state endpoint and moderator queue report posts, hidden posts and people in the room per window.

## Evidence

Tool calls made (read-only; nothing deployed, nothing created in the account):

1. `mcp__Cloudflare_Developer_Platform__workers_list` (no arguments), Sept. 30. Result: `{"workers":[],"count":0}`. The Cloudflare account is reachable from this workspace and holds no Workers yet, so `the-stands` would be the first; deploying it is the controller's call.
2. `wrangler dev` (wrangler 4.144.0, workerd 1.20260926.1) run locally from `deploy/dept-ideas/chat/wrangler.toml` against `worker.mjs`, with a SQLite-backed Durable Object, on 127.0.0.1:8787. Wrangler's `Request.cf` proxy warning is cosmetic; the Worker ran.
3. `node test.mjs` (Playwright 1.56.1, Chromium, `ws` 8.22.0): two browser contexts, a phone at 390 by 844 and a desktop at 1365 by 800, plus three raw WebSocket clients, drove the room. Result in `TEST.md`: 21 passed, 0 failed, no console errors. Proved in order: lock window from the real scoreboard (2026-10-03T19:30Z to 19:35Z); a reader one minute after a simulated kickoff refused ("Members only for the first 5 minutes after kickoff"); lock lifts at ten minutes; desk holds the room open with the real scoreboard on the strip; posts fan out with the Member badge; a second reader post inside 30 seconds refused and the input locked; "damn" masked to "d***" server-side; one-tap report; three reports hide the post everywhere and the moderator queue lists it; member-only mode blocks readers; 210 more posts leave exactly 200; bad token gets HTTP 401; a reader's link refused; with no desk override the room is closed until game day and shows the countdown with no input.

Files in `deploy/dept-ideas/chat/`:

- `worker.mjs` (14.8 KB): routes `/room/{game|show}-YYYY-MM-DD/{ws,state,mod}` and dev-only `/token`; `RoomCore` (every rule, no Cloudflare API in it); `StandsRoom` (Durable Object adapter, WebSocket Hibernation API, storage); HMAC tokens; game and show windows.
- `client.js` (15.8 KB): the embed, one owned root, CSS injected once, paint once then patch in place, reconnect with backoff, quiet state with countdown, Barlow and Barlow Condensed, Swamp Night palette.
- `test.mjs` (about 15.7 KB), `test-page.html`, `wrangler.toml` (dev values only, labeled; production secrets go in with `wrangler secret put`).
- `TEST.md`: the console output of the run. `shots/stands-390-live.png`, `stands-1365-live.png`, `stands-390-quiet.png`, `stands-1365-quiet.png`: real screenshots from the run.
- `preview.html`: the four screenshots and the test result, under 12,000 characters.

Rerun: `NODE_PATH=<scratchpad>/node_modules node deploy/dept-ideas/chat/test.mjs` (add `--harness` to run the same `RoomCore` under a plain `ws` server if wrangler is unavailable).

## What it needs from Brenden

- A yes on the name and on Cloudflare as the home. The controller then runs `wrangler deploy` with `TOKEN_SECRET` and `MOD_KEY` as secrets and `SCOREBOARD_URL` pointed at the Pages copy of `scoreboard.json`; `DEV_TOKENS` stays unset in production.
- The sign-in bridge: a Velo HTTP function (`/_functions/standsToken`) that reads the current member with `wix-members-backend`, checks for an active plan with `wix-pricing-plans-backend`, and returns a ten-minute token signed with the same secret. `verifyToken` in `worker.mjs` is the contract. One hour to confirm the function sees the member session; the fallback is page code posting the token to the embed.
- Placement: one `<div id="gbm-stands">` under the CTA row in `tunnelHtml`, behind a `front-page.config.json` flag, and one custom embed on the show page, both the existing loader pattern, rendering nothing outside the open windows.
- One named moderator per window with the mod key, and a one-paragraph set of room rules. No moderator on duty, the room stays closed and shows the countdown.
- Which surface first. Recommendation: the Wednesday, Oct. 7 show as the dress rehearsal, then The Tunnel for South Carolina on Oct. 10 (`scoreboard.json`, time TBA). Saturday at Missouri is too soon to do it properly.

## Risks

- Moderation is the real cost. The defaults (kickoff lock, 30-second slow mode, server-side filter, three-report auto-hide, close switch) reduce the load but do not replace a person. The word list is a starter list and is weak on its own.
- Abuse: harassment of players and coaches, spam and doxxing. Sign-in is required to post, links are members-only, 240 characters, no images, no direct messages. Rate limits per IP at the edge are not in this build yet.
- Legal: user content on a news site; Section 230 covers hosting in the U.S. but not carelessness. Keep the data minimal (member ID, display name, message, timestamp), no under-13 accounts, and have counsel read the room rules once.
- Dead room: the biggest risk. The room opens only in windows, the quiet state shows the score and countdown instead of an empty feed, and staff seeds three posts at open. Kill criterion, agreed up front: fewer than 30 posts from fewer than 10 people per window across the first three windows, and the embed comes out with nothing else on the page changed.
- Platform: the module lives inside the owned `#gbm-live` DOM like The Tunnel and must be checked on the mobile shell so nothing jumps. A Cloudflare outage degrades to the closed state, never a broken Tunnel. The game-day desk should push `scoreboard.json` with the `scoreboard` mod command on the tick it commits the file; the Durable Object's own fetch is the fallback.
