# GatorBait Pick 'Em

A free weekly score-pick contest. A fan enters a callsign, an email, an exact score and an optional tiebreaker. No account is needed. Exact score earns 3 points; the right winner earns 1. Callsigns go on a season leaderboard, and the weekly winner is named on The Buddy Martin Show. A "Presented by" slot carries a sponsor's logo and prize line.

First game: **Florida vs. South Carolina, Sat., Oct. 10, 2026 (homecoming, kickoff TBA)**, ESPN event `401856714` from `sports-live/scoreboard.json`. The same files run every week; only the config changes.

Nothing in this folder has touched the live site. Every step under "Deploy" is a Wix write for Jarvis to run under the active controller.

## How it relates to Make the Call

`deploy/dept-ideas/web/` ("Make the Call", PR #118) is also an exact-score pick module. It runs on Cloudflare (Worker + D1), takes one pick per device with no email, and shows the crowd's distribution. It is not deployed yet: it is waiting on Cloudflare secrets.

Pick 'Em is the Wix-native, sponsor-ready version. It collects an email, an opt-in, a season leaderboard and a weekly winner, and it needs no new infrastructure. The two should not run side by side on the same game: the controller picks one. If both survive, a sensible split is Make the Call's crowd panel shown after a Pick 'Em entry. That is a later decision, not part of this PR.

## Storage: a native Wix Form, not a visitor-writable CMS collection

| | Native Wix Form (chosen) | `PickEm` CMS collection, visitor insert |
|---|---|---|
| Who can read entries | Site admins only (form submissions are never public) | `itemRead: PRIVILEGED` would do it, but one wrong permission click exposes every email |
| Kickoff lock enforced by Wix | Yes: `limitationRule.dateTimeDeadline` disables the form server-side | No. Anyone with the API can insert after kickoff; only the scorer's timestamp filter catches it |
| Spam protection | `spamFilterProtectionLevel: ADVANCED` | None |
| Email opt-in | `CONTACTS_SUBSCRIBE` field maps to a real Wix email subscription (double opt-in), the same as the site signup | A plain boolean. Someone would have to import it into Contacts by hand, which risks consent errors |
| Contact created | Yes (`upsertContact`), so winners can be reached | No |
| Proven on this site | The capture module (`deploy/capture-2026/`) already uses this exact browser path: anonymous visitor token from headless client `1565816d-…`, then Create Submission | Not proven; Wix Data docs say the site code editor must be enabled |

So the embed posts to a Wix Form. No Velo or backend code is needed: the browser gets an anonymous visitor token (`POST /oauth2/token`, `grantType: anonymous`, public client ID, no secret) and calls `POST /form-submission-service/v4/submissions`.

**Trade-off:**
- One-entry-per-email can't be enforced at insert time; Wix Forms has no per-email limit. The scorer enforces it: the earliest valid entry per email per game counts, and later ones are counted as duplicates. The rules on the page say so.
- The embed also remembers a pick in `localStorage` (without the email), so a returning fan sees their pick instead of a second form.

**Leaderboard:** a public `PickEmBoard` collection holds only `season, rank, callsign, points, exact, winners, played, weeklyWins`, with read `ANYONE` and write admin-only. The embed reads it with the same visitor token (`POST /wix-data/v2/items/query`). If that read fails, it falls back to an optional `boardUrl` JSON, then to a "board fills in after the first final" line.

Docs read (read-only):
- [Create Submission](https://dev.wix.com/docs/api-reference/crm/forms/form-submissions/create-submission)
- [About Submission Values](https://dev.wix.com/docs/api-reference/crm/forms/form-submissions/about-submission-values)
- [Create Form](https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/create-form) schema: `limitationRule`, `spamFilterProtectionLevel`, `contactMapping.subscriptionInfo`
- [Query Submissions By Namespace](https://dev.wix.com/docs/api-reference/crm/forms/form-submissions/query-submissions-by-namespace)
- [Retrieve Tokens](https://dev.wix.com/docs/api-reference/business-management/headless/authentication/retrieve-tokens)
- [Data Permissions](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-permissions/introduction)
- [Query Data Items](https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items/query-data-items)
- [Bulk Save Data Items](https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items/bulk-save-data-items)

## Files

| File | What |
|---|---|
| `pickem.html` | The embed (Wix Custom Code, BODY_END). 14.8k chars, under the 15,000 limit. It builds `#gbm-pk` on `/pick-em`, hides only that page's native `#SITE_PAGES`, and leaves the sitewide footer alone. It also renders inside any `#gbm-pickem-slot` element, which allows a homepage module later. |
| `pickem-config.html` | The weekly config (Wix Custom Code, HEAD): game, opponent, label, `lockAt`, `formId`, sponsor. It is the only file edited week to week. |
| `lib.mjs`, `score.mjs` | Scorer. It reads the form export plus ESPN finals and writes the public board and the `PickEmBoard` bulk-save body. It refuses to write output containing an `@`. |
| `games.json` | Season schedule for Pick 'Em weeks (`gameId`, `espnEvent`, `lockAt`). |
| `test/score.test.mjs` | `node --test deploy/pickem/test/score.test.mjs`: 10 tests covering scoring, tiebreaks, duplicates, the late lock, profanity, the no-email guard, the ESPN parser and the CLI. |
| `fixture.html`, `qa.mjs` | `node deploy/pickem/qa.mjs`: 69 Playwright checks at 320/390/1366 against a mocked Wix API. Screenshots go in `shots/`. |

## Anti-abuse

- **One entry per email per game:** the first valid entry counts (scorer). The browser remembers the pick and shows "Your pick is in".
- **Callsign:** 2 to 20 characters; letters, numbers, space and `- _ . '` only.
  - Profanity filter with leetspeak folding: substring stems, plus whole-word matches for short words, so "Gamecock Fan", "Classy" and "Dickens" pass.
  - Reserved names block impersonation (Buddy Martin, GatorBait, admin, official).
  - The embed checks this for fast feedback; the scorer re-checks it and its decision is final.
- **Honeypot:** an off-screen `website` field. A filled honeypot gets a fake success and sends nothing.
- **Spam filter:** the Wix Forms ADVANCED spam filter.
- **Kickoff lock:**
  - the form's `dateTimeDeadline` (server);
  - the embed swaps to "Picks are locked" at `lockAt`;
  - the scorer drops any entry with `createdDate >= lockAt`.
- **Bad picks:** scores must be integers from 0 to 99 and can't be a tie. The tiebreaker must be 0 to 800.

## Deploy (Jarvis; each numbered step is a live Wix write needing controller authorization)

0. **Read-only preflight.**
   - Confirm the `wix_forms` app instance.
   - Confirm OAuth client `1565816d-bbbc-45c1-b82a-31f10d3e2c71` still exists (`POST /oauth-app/v1/oauth-apps/query`).
   - If the capture module (`deploy/capture-2026/`) is live, take its verified results for CORS, token scope and spam filter. Pick 'Em uses the identical path.
1. **Create the form "GatorBait Pick 'Em"** (namespace `wix.form_app.form`).
   - Use the live "GatorBait Email List" form `6babfee8-147f-428a-9e14-6b72f6225835` as the template for the email and subscribe fields: read it with `GET /form-schema-service/v4/forms/6babfee8…` and copy those two field definitions with new targets.
   - Add the others per [About Form Fields](https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/about-form-fields).
   - The targets must be exactly these, because the embed and scorer send and read these keys:

   | target | type | required | notes |
   |---|---|---|---|
   | `email_pickem` | contacts email (MAIN) | yes | |
   | `subscribe_pickem` | contacts subscribe checkbox | **no**, unchecked | `subscriptionInfo.confirmationLevel: DOUBLE_CONFIRMATION`, same as the site signup |
   | `callsign` | short text | yes | max 20 |
   | `game_id` | short text | yes | |
   | `pick_florida` | number | yes | 0 to 99 |
   | `pick_opponent` | number | yes | 0 to 99 |
   | `tiebreak_rush` | number | no | 0 to 800 |

   - Set `spamFilterProtectionLevel: ADVANCED` and `limitationRule.dateTimeDeadline: "2026-10-10T16:00:00Z"`.
   - Turn off form notification emails to fans; Wix's own double-opt-in confirmation is the only email.
   - Afterwards, `GET` the form and check the seven targets match. Record the `formId`.
   - Optional (controller call): add this form to the labeling automation `fea566c1` so opted-in entrants get the list labels. Until then they are still subscribed after confirming; they just lack the label.
2. **Create the CMS collection `PickEmBoard`** ([Create Data Collection](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/create-data-collection)).
   - Fields: `season` NUMBER, `rank` NUMBER, `callsign` TEXT, `points` NUMBER, `exact` NUMBER, `winners` NUMBER, `played` NUMBER, `weeklyWins` NUMBER.
   - Permissions: `itemRead: ANYONE`, `itemInsert/itemUpdate/itemRemove: PRIVILEGED`.
   - It never holds an email.
   - No `PickEm` entries collection is created; the form replaces it.
3. **Add a blank page "Pick 'Em"** at slug `pick-em` with SEO title "GatorBait Pick 'Em: Florida vs. South Carolina". Whether it goes in the menu is the controller's call; a link from the homepage hub and story ends is enough to start.
4. **Add two Custom Code snippets**, both page-scoped to Pick 'Em, category Essential (as the other GBM embeds are):
   - "GBM - Pick 'Em config v1": contents of `pickem-config.html`, **HEAD**, with `formId` filled in.
   - "GBM - Pick 'Em v1": contents of `pickem.html`, **BODY_END**, pasted verbatim.
5. **Verify live** at 390 and 1366.
   - The page renders, there are no console or CORS errors, and the leaderboard line shows.
   - Then make **one test entry with Brenden's own address** (creates one contact). Confirm it appears in Forms → Submissions with all seven values.
   - Delete the test submission.
   - Confirm a second visit shows "Your pick is in".

**Rollback:** disable both Custom Code snippets; the page shows its blank native content again. The form and collection hold no public data and can stay.

## Weekly reset (after each final; about 10 minutes)

1. **Export entries (read-only).**
   - Call `POST /form-submission-service/v4/submissions/namespace/query` with `{"query":{"filter":{"formId":"<id>","namespace":"wix.form_app.form"}}}`, following the cursor until `hasNext` is false.
   - Save the pages as JSON under `deploy/pickem/private/` (git-ignored: it holds emails).
2. **Score:**
   ```
   node deploy/pickem/score.mjs --entries deploy/pickem/private/subs.json \
     --finals deploy/pickem/finals.json --fetch \
     --out deploy/pickem/private/board.json --items deploy/pickem/private/pickemboard-items.json
   ```
   - `--fetch` reads `site.web.api.espn.com/.../summary?event=<id>`; `site.api.espn.com` 403s from GitHub runners. It records the final only once ESPN marks the game completed.
   - `finals.json` holds scores only and can be committed.
3. **Publish the board:** `POST /wix-data/v2/bulk/items/save` with `pickemboard-items.json`. Row ids are `<season>-<callsign-slug>`, so a rerun replaces rows.
4. **Announce the winner:**
   - `lastWeek.winner.callsign` and points go to Buddy for the show.
   - Brenden emails the winner from the private export about the prize.
5. **Set up the next game:**
   - Add its row to `games.json` (`espnEvent` from `sports-live/scoreboard.json`).
   - Edit the config snippet: `gameId`, `opp`, `week`, `label`, `lockAt`.
   - Update the form's `dateTimeDeadline` to the new `lockAt`.
   - While a kickoff is TBA, `lockAt` is noon ET on game day. Move it to the real kickoff in all three places (config, form deadline, `games.json`) once the time is announced.

## Sponsor slot

Set `sponsor:{name, logo, url, prize}` in the config snippet.
- `logo` is a Wix Media URL.
- `url` gets `rel="sponsored noopener"`.
- Leave `name` empty for the unsold state: "Presented by / Your business here. Sponsor GatorBait Pick 'Em", linking to `/contact`.

Packages and pricing are in `deploy/media-kit/`.

**Prize rules:**
- Keep it a free, skill-based contest with modest prizes: no purchase necessary, and prizes delivered by the sponsor.
- Publish one short official-rules page before the first prize is awarded: [FILL: rules page reviewed by Brenden/counsel].
- Florida's game-promotion statute (Fla. Stat. 849.094) has filing and bonding rules for chance-based promotions with total prizes over $5,000. Stay well under that, and skill-based.

## Growth plan

- **Show:** Buddy reads the leaderboard every Monday show and names the weekly winner and the "boldest miss". On Thursday's show he gives his own pick and dares viewers to beat it, with the `/pick-em` link in the YouTube and Facebook descriptions.
- **Facebook post (Tuesday and Friday):** "Call it before kickoff. Florida vs. South Carolina, homecoming. Exact score = 3 points, right winner = 1. Weekly winner gets named on The Buddy Martin Show [and wins PRIZE from SPONSOR]. Free, no account: gatorbaitmedia.com/pick-em"
- **Winner graphic:** a 1080×1350 card made with the existing broadcast-graphics skill. Blue field, orange rule, "PICK 'EM WINNER", callsign, the pick vs. the final, and the "Presented by" logo. Post it Sunday and use it as the show lower-third Monday.
- **Story pages:** a one-line "Make your pick" link at the end of game-week stories.
- **List growth:** every entry is a consent moment. With the box unchecked by default, opted-in entrants join the Magazine list through Wix's double opt-in, the same one the site signup uses.
- **Measure:** entries per week, opt-in rate, and returning entrants. The embed fires `gbm:pickem` DOM events and `dataLayer` pushes for `shown`, `submitted`, `failed` and `late`.

## Not verified yet (needs the one live test entry)

- (a) CORS from `www.gatorbaitmedia.com` to `wixapis.com`;
- (b) the visitor token's scope for Create Submission on this form;
- (c) the ADVANCED spam filter accepting an API submission;
- (d) visitor read of `PickEmBoard` with `itemRead: ANYONE`;
- (e) `Barlow Condensed` loading on the live site. The sitewide type is Barlow; headings fall back to Barlow if the condensed face isn't loaded, as the TV hub's do;
- (f) ESPN's live box-score field `rushingYards`. The scorer reads the same names as `deploy/dept-ideas/research/scout.mjs`. The final-score fixture is synthetic; ESPN is not reachable from this sandbox.

If (a) to (c) fail, the fan sees "That didn't go through. Try again in a minute." Nothing is created. If (d) fails, the board falls back as described above.
