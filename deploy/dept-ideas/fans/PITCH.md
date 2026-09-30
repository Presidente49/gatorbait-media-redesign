# Make the Call

## 1) The idea (two sentences)

Make the Call is a fan zone on gatorbaitmedia.com where Gator Nation picks the exact score of the next game, watches the crowd's call move live, climbs a season-long ladder, and sends one question to The Buddy Martin Show, all under one handle with no account required. It takes two of the four directions Brenden listed, weekly predictions with a leaderboard and Ask Buddy, and drops the social-wall and photo-wall ideas because free tooling cannot run them cleanly (see section 5).

## 2) Why readers or revenue care

- It is the only thing on the site a fan does rather than reads, and it comes back weekly on its own: the pick locks at kickoff, the score lands after the final, the ladder moves Sunday. Eight Florida game weeks remain on the ESPN schedule (sports-live/scoreboard.json, updated Sept. 29), starting at No. 25 Missouri on Sat., Oct. 3, 3:30 p.m. ET on ABC, then South Carolina, at No. 1 Texas and at No. 2 Georgia. Those last two are the highest-interest picks of the year and arrive inside the first month.
- Every pick is a return visit with a reason: a fan who locks a score Tuesday comes back Saturday night to see it scored and Sunday to see the ladder. Wix Analytics already reports returning-visitor share, so the effect is measurable from week one without new tools.
- Ask Buddy feeds the show with real fan questions three nights a week, in Buddy's role as editorial lead (Brenden's standing direction), and the show reads the handle on air. That is a free reason to say "gatorbaitmedia.com" on YouTube and Facebook every stream, and the answered question posts back to the page with a link to the stream, one canonical URL each way, no duplicate stories.
- The crowd number is content. "Gator Nation's average call: Florida 35-23" (mockup figure) is a line Buddy or Brenden can quote in the Friday column and the show, and a sponsor can own the ladder ("The Ladder, presented by ...") once it has a month of numbers behind it. The site has no first-party fan data today beyond email subscribers, which this project does not touch.
- Cost is effectively zero (section 3), so the downside if it flops is about 20 hours of build time.

## 3) How it is built (what runs where, moderation, hours, cost per month honestly)

**Front end (Wix, live site).** One section rendered by the existing homepage JS renderer (sports-live/src/front-page.js), inserted below The Road Ahead so the next-game card and the pick sit together, plus a standalone /make-the-call page using the same markup in a Wix HTML embed for deep links from the show. Barlow and Barlow Condensed, Swamp Night palette, inline CSS as in the preview. No change to the unified mobile shell, the no-jump architecture, the free sports-news default or the separate Magazine. Facebook and YouTube embeds are not needed; the answered-question card links to the stream instead.

**Back end (Cloudflare, free plan).** One Worker with a D1 database and five routes: `GET /game` (current game, lock time, aggregate bins, average), `POST /pick` (upsert one pick per handle per game), `GET /ladder`, `POST /ask`, and `POST /admin/*` behind Cloudflare Access (free for up to 50 users) for Brenden and one editor. Cloudflare's free Workers plan allows 100,000 requests a day and D1's free tier allows 100,000 row writes and 5 million row reads a day, which is more than the site needs on a game Saturday. KV was rejected because its free tier allows only 1,000 writes a day, which a Missouri week would exceed. Game data (opponent, kickoff, final score) is read from the scoreboard feed the site already publishes, so scoring a week is one admin click after the ESPN final, not data entry.

**Identity without accounts.** A handle plus a random browser token stored in localStorage; one pick per handle per game, updates allowed until kickoff, rate-limited by IP at the Worker. This is deliberately light: no email, no Wix member login, no subscriber data. If a prize is ever attached, the winner verifies by claiming the handle through a Wix Members login at that point, not before.

**Moderation.** Handles pass a banned-word list at submit and are rejected, not stored. Ask Buddy questions land in a `pending` table and are invisible until an editor marks them `show` (used on air) or `hide`. The admin view is a plain HTML table on the Worker; it shows the question, handle, time and IP prefix, and nothing else. Expected volume is small: a few dozen questions a week. The privacy line in the preview is the one the page ships with.

**Hours.** Build: Worker, D1 schema and admin, about 8 hours; renderer section and standalone page, about 6 hours; moderation list, tests and a dry run on a preview Wix site, about 4 hours. Total 18 to 20 hours. Weekly operation: set the next game (automatic from the feed), lock (automatic at kickoff), score (one click after the final), moderate questions (10 to 15 minutes), pick three questions for the show (10 minutes). Under one hour a week.

**Cost per month.** Cloudflare Workers, D1 and Access: $0 on current free tiers at this traffic. Wix: no plan change. Google Fonts: $0. If traffic ever passes the free Workers ceiling, the paid Workers plan is $5 a month. Honest total: $0 now, $5 at most later. No new repo, scheduler or renderer; the Worker lives in the existing repo under automation/ and the section in sports-live/src/.

## 4) What it needs from Brenden

1. A yes on the two-feature scope (picks plus Ask Buddy) and a no, for now, on the social wall and photo wall.
2. Approval to add one section under The Road Ahead in the homepage renderer, since docs/HOMEPAGE-BASELINE-LOCK.md requires explicit approval for anything that changes the front page. It is additive and can be removed with one flag.
3. Cloudflare: confirm the account connector may create one Worker and one D1 database in the GatorBait account (read-only checks only until then). No credentials in the repo; the Worker binds D1 by name.
4. The scoring rule (preview uses 25 exact, 10 winner and margin within 3, 5 winner) and whether the season ladder ends at the regular season or includes bowls.
5. A short banned-word list and who besides Brenden may approve questions.
6. Ten seconds on Wednesday's show: "Pick the score at gatorbaitmedia.com, we read the ladder next week."

## 5) Risks

- **Front-page rule.** The homepage is under a baseline lock and the approved default is the sports-news homepage. The section is additive, but it is still a visible front-page change; it goes nowhere without Brenden's approval and the active controller's assignment, and it ships to a preview site first.
- **Gaming the ladder.** No login means a fan can make several handles. Mitigations: one pick per handle per game, IP rate limits, no cash prizes without verification. Accept that the ladder is for bragging rights until a sponsor asks for more.
- **Low volume looks bad.** A poll with 40 picks reads as empty. Launch the first week with the crowd number hidden until 100 picks are in, and promote it on all three show nights before Missouri.
- **Moderation lapses.** A rude question never appears publicly because nothing is public until approved, but a bad handle on the ladder is visible immediately; the banned-word list must exist before launch and an editor must be able to hide a handle in one click.
- **Why not the social wall.** Facebook's Graph API requires app review to read Page posts and comments, and YouTube's Data API needs an API key with daily quota and returns comments that still need moderation; a free, reliable, moderated live wall is not achievable this month. Native Facebook and YouTube embeds remain available on the live site and can sit beside this section, but they are not this project.
- **Why not the photo wall.** Image uploads require storage (R2 is free to 10 GB) but also human review of every photo for rights, faces and taste before display; at a few hundred uploads on a game day, that is a second job. Revisit if a photographer or intern owns it.
- **Data.** The Worker stores handle, pick, question, token, IP prefix and time. No email or subscriber data is ever read or written, and the privacy line says so.
