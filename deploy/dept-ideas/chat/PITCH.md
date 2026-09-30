# The Stands — a live chat room for game days and show nights

## 1) The idea (two sentences)

The Stands is a phone-first chat room that opens 30 minutes before kickoff inside The Tunnel on the homepage and 30 minutes before Buddy goes live on the show page, with the live score strip on top, a Member badge for paid Wix members, slow mode, a word filter and one-tap reporting. When nobody is talking it never looks empty: the room shows the score, the kickoff countdown and the next show time instead of a blank feed.

## 2) Why readers or revenue care

- Game day is the one time readers are on the site and on a second screen at the same time; today The Tunnel gives them a countdown, a score and a link out (`sports-live/src/front-page.js`, `tunnelHtml`). A room keeps them on gatorbaitmedia.com for the length of the game instead of a 20-second check.
- Show nights already send people off-site: the show module's buttons are "Watch on YouTube" and "Facebook" (`front-page.config.json`, `links.youtubeLive`, `links.facebook`). A room on `/the-buddy-martin-show` gives the audience a reason to open the show page, and gives Buddy a producer screen of reader questions to read on air.
- The Member badge is the first visible perk of a paid plan that costs nothing to fulfil. `docs/HOMEPAGE-BASELINE-LOCK.md` records that Magazine paywall enforcement is still outstanding; a badge and no-wait posting are perks that work before the paywall does.
- The calendar is favorable: Florida is 4-0 and No. 8, off a 52-28 win over No. 4 Ole Miss, with No. 25 Missouri Saturday, then No. 1 Texas (Oct. 17) and No. 2 Georgia (Oct. 31) (`sports-live/scoreboard.json`, built from ESPN's public JSON per `README.md`). Three top-25 games in five weeks is the best window this site will get to form a habit.
- Measurable: posts per game, unique posters per game, and sign-ins that start from the room's "sign in to chat" button. The kill criterion is in section 5.

## 3) How it is built (engine choice with the trade-off, files, embed size, hosting cost per month honestly, hours to launch)

**Engine: (c) a small custom room on Cloudflare Workers + Durable Objects, embedded through the existing Wix custom-embed loader, signed in through Wix Members.**

Why not (a) YouTube live chat: it is free and moderated by YouTube's tools, but it only exists while a stream is live, so there is nothing on Saturday when no show streams; posting requires a Google sign-in, not a GatorBait one; the embed (`youtube.com/live_chat?v=…&embed_domain=…`) is YouTube's UI, so no Swamp Night palette, no Member badge, no score strip, and YouTube can change or block the embed at will. Facebook has no embeddable chat at all. Keep (a) as the zero-cost fallback for show nights only if (c) is not approved.

Why not (b) Wix: Wix Chat is a one-to-one business-to-visitor widget, not a room. Wix Forum and Groups are threaded pages, not real time, and they render Wix's own DOM outside the owned `#gbm-live` container, which is what the unified mobile shell and the no-jump architecture depend on. Neither can sit inside The Tunnel.

Why (c): one Durable Object per room ("game-2026-10-03", "show-2026-10-07") holds the WebSocket connections and the last 200 messages; the Worker verifies a short-lived token, fans messages out and applies slow mode, member-only mode and the word list server-side, so a modified client cannot skip them. The Cloudflare Developer Platform connector is already attached to this workspace (visible in this session's tool list; not called, read-only pass). Trade-off: we own moderation, uptime and abuse handling ourselves, with no vendor doing it for us.

Sign-in: the embed calls a Velo HTTP function (`/_functions/standsToken`) on the same domain, which reads the current member through `wix-members-backend` and the member's active plan through `wix-pricing-plans-backend`, then returns a 10-minute HMAC token with `{memberId, displayName, tier}`. The secret lives in Wix Secrets Manager and as a Worker secret; nothing is written into the embed. Assumption to verify in a one-hour spike: that the HTTP function sees the caller's member session. If it does not, the documented fallback is Velo page code posting the token to the embed with `postMessage`.

Score strip: on the homepage the room subscribes to the same `sb` object `patchTunnel` already updates in place; on the show page, which has no renderer, the embed reads the published `scoreboard.json` from the GitHub Pages origin the frame already uses (`sports-live/frame.html`, `PAGES`). Quiet state: the room renders the countdown to `next.kickoffIso`, the last final and the next show time from the same data, so an empty room is a scoreboard, not a void.

Placement: in `tunnelHtml`, one `<div id="gbm-stands">` under the CTA row, shown on game day only through a `front-page.config.json` flag (`stands.gameday: true`); on `/the-buddy-martin-show`, one custom embed at body end, shown Mondays, Wednesdays and Thursdays from 8:30 p.m. ET until an hour after the show ends. Outside those windows the embed renders nothing, so the pages look exactly as they do today.

Files (all on a branch, no live writes):
- `sports-live/src/stands.js` and `sports-live/src/stands.css`, about 12 KB together, a straight port of `preview.html` (which is 11,204 characters, self-contained except Google Fonts).
- `workers/stands/src/index.ts` (Worker + Durable Object, about 300 lines), `workers/stands/wrangler.toml`.
- `wix/velo/http-functions.js` addition for `standsToken`, recorded in the repo and deployed by the controller.
- `sports-live/src/front-page.js`: one line in `tunnelHtml`; `front-page.config.json`: one flag.
- `workers/stands/words.txt`: the filter list, plain text, editable without a deploy through KV.
- Moderator view: `/mod` route on the Worker, password-protected behind Cloudflare Access (free for up to 50 users), with the report queue, delete, timeout, slow-mode seconds and member-only toggle.

Embed size: the Wix custom embed is the same pointer loader pattern as Home Code, about 700 to 1,100 characters (Home Code is 1,063 characters today per `deploy/dept-ideas/web/PITCH.md`), far under the 15,000-character limit. The chat UI is not in the embed.

Hosting cost per month, honestly: Cloudflare's free plan includes Workers and SQLite-backed Durable Objects with a daily request allowance in the 100,000 range, and WebSocket messages under the Hibernation API are metered at 20 incoming messages per request while outgoing fan-out is not metered; that is from Cloudflare's published pricing as I know it, not fetched in this pass, and it must be confirmed in the dashboard before launch. At a few hundred readers posting for four hours the room stays inside the free plan: $0. If it outgrows that, Workers Paid is $5 per month base. Cloudflare Access for the mod page: $0 at our seat count. Wix: no new app, $0. Total: $0 expected, $5 ceiling.

Hours to launch: Worker + Durable Object 8; embed UI port and quiet state 6; Wix Members token bridge 4 plus a 1-hour spike; moderation tools and report queue 6; Tunnel and show-page integration 4; QA on the mobile shell, no-jump check at 390 px and reduced motion 4. About 33 hours of one worker. Saturday's Missouri game (Oct. 3) is three days out and is not a realistic first run; the honest target is the South Carolina home game Oct. 10 (`scoreboard.json`, time TBA), with a dress rehearsal on the Wednesday, Oct. 7 show.

## 4) What it needs from Brenden

- A yes on engine (c) and on the name. "The Stands" is the recommendation; it reads on the homepage as a place, not a feature.
- One named moderator per window (a staff account on the mod page) and a one-paragraph set of room rules. Without a human on duty the room does not open.
- The badge rule: any active paid plan shows "Member"; staff accounts show "GatorBait". Confirm, or name the plans that count.
- Which surface goes first. Recommendation: the show page on Oct. 7, because Buddy can read questions on air and the audience is already gathered; The Tunnel on Oct. 10.
- Approval for the controller to assign the Cloudflare Worker, the Velo HTTP function and the two embeds as production slots. Nothing in this folder touches the live site.
- The kill criterion (section 5), agreed up front so the room is folded quietly if it does not take.

## 5) Risks (moderation, abuse, legal, dead-room risk)

- Moderation: a 9 p.m. room with a small staff is the real cost. Mitigations: member-only mode for the first five minutes after kickoff and at the show open, slow mode at 30 seconds by default, server-side filter, one-tap report that hides a post at three reports until a mod rules, and a single "close the room" switch. If no mod is on duty the room shows the quiet state, not an unmoderated feed.
- Abuse: spam, slurs, harassment of players and coaches, and links. Defaults: no links from non-members, no images, 240 characters, sign-in required to post, rate limit per member and per IP at the Worker. A word list is weak on its own; the report queue and a human are the control.
- Legal: user content on a news site is generally covered by Section 230 in the U.S., but that is not a substitute for rules and takedowns. Keep the data minimal (member ID, display name, message, timestamp), retain seven days, no DMs, no under-13 accounts (COPPA), and have counsel look once at the room rules and at Florida's minors online statutes. Defamation of a named player by a poster is the likeliest complaint; delete on report and log it.
- Dead-room risk, the biggest one: a room with four posts an hour looks worse than no room. Mitigations built in: open only in scheduled windows, the quiet state shows scores and the countdown instead of an empty feed, staff seeds three posts at open, Buddy mentions the room on air and a mod reads a question back. Kill criterion: fewer than 30 posts from fewer than 10 unique posters per game across the first three windows, and the room is folded and the embed removed, with nothing else on the page changed.
- Platform: Wix hydration can replace document classes; the room must live inside the owned `#gbm-live` DOM like The Tunnel and be QA'd on the mobile shell so nothing jumps. A Cloudflare outage degrades to the quiet state, never to a broken Tunnel.
