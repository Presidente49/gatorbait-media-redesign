# Florida football stats page: proposal

**Date:** Sept. 27, 2026
**Requested by:** Brenden, Sept. 26, after the one-off Muse "Stat Pack" for Ole Miss.
**Status:** **The embed has been live since Sept. 27, 20:47Z. The page appears once Brenden adds the blank Wix page (one step, below).** Brenden handed the three decisions to the stats session ("do your own research and make the best decision for the company"). What was decided and done is below. The original proposal follows unchanged, for the record.

## Decided and deployed (Sept. 27, 2026)

| Decision | Choice | Why |
|---|---|---|
| Placement | Dedicated page at `/florida-football-stats`, with no homepage, band or Magazine entry point yet | Keeps the approved homepage untouched and gives writers one URL to cite. The band has 4 characters of room. |
| Publish | **Now:** the stats session refreshes the page after each game. **Target:** option A, the workflow writes the data block using a `WIX_STATS_API_KEY` repo secret | Option A needs a Wix API key only Brenden can create. Option B would bring back the GitHub read-time dependency that PR #36 removed. |
| First real snapshot | Fetched ESPN through the TinyFish connector | TinyFish can reach ESPN; this container still can't. |

**Live object.** Custom embed `756655cf-06e2-451e-afcf-6a5606959cbc`, "GBM - Florida Football Stats v1":
- revision 1, HEAD, ESSENTIAL, `loadOnce` false;
- 12,997 characters, built from `deploy/wix-served/florida-stats.html` at `07387bd`. Its HTML was checked against that build (length and fingerprint 662049864) inside the create call.
- Shell fingerprint 2083845296: everything outside the data block. A data-only update checks this first.
- No site publish, since embeds apply without one.

It changes no other embed. The site had 52 embeds before this one.

**Live check (20:51Z).**
- The embed's `#gbm-flstats-v1` tag is served on a live page (`/about`). A made-up control selector on the same fetch came back unmatched.
- Wix's 404 page does not draw it. A browser run on `/florida-football-stats` still showed Wix's "Page Not Found." So the stats need a real page.

**Brenden's one remaining step.** In the Wix Editor, add a blank page:
- slug `florida-football-stats`;
- hidden from the menu;
- SEO title "Florida Gators Football Stats 2026 | GatorBait Media".

Then publish. The embed then draws the page over it with nothing else to deploy. The stats session re-checks the URL at each check-in and records the live evidence in #34.

**Numbers check (Sept. 27).** The pipeline's ESPN checks all passed: 4-0, 2-0 SEC. The snapshot was then compared with FloridaGators.com's official cumulative stats (2026, overall), and these match exactly:
- points;
- total, rushing and passing yards, and their per-game averages;
- carries;
- completions and attempts;
- turnovers;
- penalties;
- time of possession;
- field goals and extra points;
- every passer's line.

The only difference is the Auburn game's third-down attempts. ESPN's box has Florida 7-15 and Auburn 6-12; the official box has 7-16 and 6-13. So the season row reads 21-43 and 26-63, against the official 21-44 and 26-64. The page's source note already says ESPN totals can differ slightly from the official figures.

**SEC Network.**
- The TV column now names SEC Network and SEC Network+ in full.
- SECSports.com's stats page renders only in the browser, so it can't be a machine source.
- SEC Network's stats are ESPN's anyway.

**Fixes found with real data:**
- ESPN's team schedule feed leaves out `conferenceCompetition`, so the SEC record read 0-0. Finals now read the flag from the box-score header, and a disagreement with the schedule stops the run.
- Rounding stays Python's round-half-even, which matches the official sheet: 2,131 yards / 4 = 532.8 and 1,405 / 4 = 351.2.
- Time of possession now always adds up to a full game.
- At 320 px, the team-stats table no longer scrolls sideways.
- The embed's data is written with sorted keys, so `--build-only` and a fresh build produce identical bytes.

Local render check on real data passed at 320, 390, 430 and 1,366 px, plus the other-route and missing-data fallbacks.

**Refresh until option A exists.** After each final, the stats session:
1. fetches ESPN's schedule and new box scores with TinyFish `fetch_content`;
2. runs `automation/florida_stats_import.py` on the saved results;
3. runs `automation/florida_stats.py --from-dir`, with the same checks;
4. commits the snapshot;
5. PATCHes only the embed's `/*FS*/…/*FS-END*/` block, after confirming the live shell fingerprint, and re-sends ESSENTIAL.

**Rollback.** Disable embed `756655cf`, re-sending ESSENTIAL. Nothing else depends on it.

## What it is

It's one permanent page that stays current on its own. It has:

- **Tiles:** record (overall and SEC), points per game (and allowed), yards per game (and allowed), and turnover margin.
- **Game by game:** every scheduled game, with date, opponent (with AP rank), result and running record. Each final score links to its ESPN box score. Upcoming games show kickoff time (Eastern) and TV. A game past kickoff with no final yet reads "In progress".
- **Team stats, Florida vs. opponents:**
  - points, total, rushing and passing yards per game;
  - yards per carry;
  - completions and attempts;
  - first downs;
  - third-down conversions;
  - turnovers;
  - penalties;
  - average time of possession.
- **Season leaders:**
  - passing (top 3);
  - rushing, receiving and defense (top 6 each);
  - kicking;
  - a line naming the team leaders in sacks, tackles for loss and interceptions.
- **Source line:** an "Updated … ET" timestamp and links to ESPN and FloridaGators.com. It also says that season totals are sums of ESPN's game box scores.

The typography is Barlow only. The palette and section rules match the homepage: navy, orange rules and the `#fffdf9` page color.

A local render check used synthetic full-season data: 12 games and deliberately long names.

- **390 px and 1366 px:** no page overflow, no table scrolling at 390 px, and Barlow applied.
- **Mounting:** the page mounts under the shared header or mobile shell in either load order.
- **Fallbacks:** on other routes, or when data is missing, the native page is left untouched.

## Decision 1: placement

**Recommended: a dedicated page at `www.gatorbaitmedia.com/florida-football-stats`.**

- It does not touch the approved homepage (`docs/HOMEPAGE-BASELINE-LOCK.md`). There is no homepage, band or Magazine change in this PR.
- Writers get one canonical URL they can cite, and search engines can index it.
- **One owner step is needed.** In the Wix Editor, add a blank page:
  - slug `florida-football-stats`;
  - hidden from the menu;
  - SEO title "Florida Gators Football Stats 2026 | GatorBait Media".

  Wix's API cannot create static pages. The stats embed then renders over that page the same way `/magazine` does. It hides the native page, keeps the shared header and footer, and uses normal route handling.

**Optional entry points.** Each one changes the homepage or band, so each needs its own approval. None is in this PR.

| Entry point | Where | Room |
|---|---|---|
| "Florida by the numbers" card in the homepage right rail | home code `622d8ece` | ~1.3K characters free (13,730 at `7361c29`) |
| "Season stats" link in the game-day band's links row | band data `96ef5a04` | **4 characters free** (14,996 at `7361c29`): nothing fits unless the band owner trims first |
| Footer or utility link | shell/footer | |

**Not recommended:**

- **Tables on the homepage itself:** this would materially change the approved presentation, and every home part is near the cap.
- **Tables inside the band:** the band disappears between games, so the stats would not be permanent.

## Data source

The source is ESPN's site API, the same one `gameday/2026-09-26-ole-miss/tracker.py` uses:

- `teams/57/schedule?season=2026` for the regular season and postseason;
- `summary?event=<id>` for each final.

**How the numbers are built:**

- Team rows are sums of each game's box-score team totals.
- Player rows are sums of ESPN's per-game player box scores.
- Averages are computed from those sums.
- Nothing is typed by hand.

**Checks.** Any failure stops the run and keeps the last good snapshot:

- The schedule score equals the box-score header score, for both teams.
- Florida's rushing yards match three ways: the sum of player rushing yards, ESPN's rushing total and the team box score.
- Passing and receiving player yards equal ESPN's category totals.
- Receptions equal completions.
- The record computed from finals equals ESPN's `recordSummary`.
- The embed is 15,000 characters or fewer.

**Disclosed on the page:** ESPN's totals can differ slightly from official NCAA figures after stat corrections. The pipeline re-reads each game hourly for three days after it ends.

**Implementation:** `automation/florida_stats.py`, with 15 unit tests in `automation/tests/test_florida_stats.py` that run against synthetic ESPN-shaped fixtures.

## Decision 2: refresh and publish

**Refresh (same for either option): no new scheduler.** The existing `refresh-newsroom-feed.yml`, which runs every 5 minutes, gains one guarded step.

The step reads ESPN only:

- in a game window (kickoff to 8 hours after, until the final posts);
- hourly for 72 hours after each final;
- once a day at 10:00 UTC.

Every other tick is a no-op with no network call. The step is `continue-on-error`, so a bad ESPN read never blocks the newsroom refresh. When the numbers change, it commits `deploy/wix-served/florida-stats.json` and `.html` to `main`.

Two small workflow changes ride along:

- The newsroom steps are now explicitly `main`-only.
- The concurrency group is per branch.

On `main`, behavior is identical.

**Publish (how the live page gets the new numbers). Choose one:**

**A. Wix-served (recommended).** After a changed snapshot, the same step PATCHes only the data block of the one stats embed.

- The data block is the text between `/*FS*/` and `/*FS-END*/`.
- Everything outside that block must match the committed build before the write (fingerprint check).
- The step sends the current revision and re-sends the category read in the same GET (`ESSENTIAL`, per LESSONS #33).
- **Brenden's step:** create a Wix API key with only the custom-embeds permission, and add it as a repository secret named `WIX_STATS_API_KEY`. No worker handles the key.
- The workflow becomes the documented sole writer of that one embed.
- There is no reader-time dependency, which keeps PR #36's fully Wix-served rule.
- The publish step is written after this decision. It is not in the PR yet.

**B. No credential.** The embed fetches `florida-stats.json` from the existing GitHub Pages publish at read time, and falls back to its baked snapshot.

- Nothing new to set up.
- But it reintroduces the GitHub read-time dependency that PR #36 deliberately removed.

**Interim, under either option:** until A's key exists, the controller session applies the data block after each game with one fingerprint-checked PATCH from the committed snapshot. The workflow keeps the repo current, so this is a copy, not a rebuild.

**Live layer (added Oct. 3, 2026, after Brenden asked for stats "as close to real time as possible without spending a lot").** The page still paints entirely from the Wix-served embed and its baked snapshot. Two free reads then run in the reader's browser. Neither one can blank or break the page: a failed read keeps what is on screen.

- **Live score, straight from ESPN.** From kickoff until the final, or for at most 8 hours, the embed reads ESPN's `summary?event=<id>` on `site.web.api.espn.com` once a minute while the tab is visible. That host sends `Access-Control-Allow-Origin: *` and is a few seconds old. On Oct. 3, a live-site Chromium check got a CORS failure (no allow-origin header) from `site.api.espn.com` but a 200 from `site.web.api.espn.com`. The row shows a Live badge, the score with Florida first, and the quarter. At the final it shows the score and "Final" without a W/L, then stops reading. The record, totals and leaders still change only through the checked pipeline.
- **Checked totals, from the Pages feed.** Each page view in that window also reads `sports-live/florida-stats.json` from GitHub Pages and applies it only when it is newer and has the same schema. The workflow writes the feed with `--feed`. It is live only once this is on `main`.
- **Actions fix.** On Oct. 3, `site.api.espn.com` answered 403 to the `GatorBait-Stats/1 (+https://…)` User-Agent from GitHub Actions. `site.web.api.espn.com` served the identical 288,473-byte schedule. `fetch_json` now retries a 403 on that host.
- **Cost.** $0. ESPN and GitHub Pages serve the reads, and Actions minutes are free for this public repository. No TinyFish or other metered fetch is involved.

## Embed or CMS

**This uses one new custom embed** named "GBM - Florida Football Stats v1":

- position HEAD, category `ESSENTIAL`, `loadOnce` false;
- guarded in its own JavaScript to `/florida-football-stats`, like every other GBM surface. None of the site's embeds uses `pageFilter`, and a page-filtered HEAD embed may not load on client-side navigation between inner pages. The site had 48 embeds at my Sept. 27 read. The game-day session has since added two, and both are route-scoped so they can't reach this page:
  - `53e15504` (Latest page) runs only under `/gatorbait-media-blogs`;
  - `14a887e3` (post template) runs only under `/post/`.

**Size:**

- 12,925 characters for a full 12-game season: 9.4K of code and CSS plus 3.6K of data. That leaves about 2K for postseason games.
- About 4.7 KB gzipped on each page load, because Wix embeds load sitewide.

It grows no existing embed. The three nearest the cap, per the builds at `fix-native-flash-20260926` `7361c29`, are:

- `96ef5a04` (band and backup stories): 14,996 characters;
- `1dd74333` (Magazine): 14,963 characters;
- `fdc2127a` (home core): 14,240 characters.

**Why not a Wix CMS collection:**

- A collection still needs a writer, which is the same credential question as option A.
- It also needs a reader. Custom embeds cannot query Wix Data without Velo code or a headless OAuth client.
- A native dataset-bound page would mean Editor design work outside the Barlow shell.

Revisit a collection if writers want a sortable or filterable dashboard later.

**The retired "GBM - Schedule v2" embed** (`609d814d`, disabled) is not reused or re-enabled. It is a dark-theme schedule plus starting-lineup block from the older design.

## Coordination with the game-day session

The "Chat analysis continuation" session owns the game-day band (`96ef5a04`) and PR #36. It also set up the cloud game-week routines recorded in `CURRENT-STATE.md` on Sept. 27. Those routines fire into that session and include:
- Sunday band updates: the rank change, then the switch to Missouri.
- The Oct. 3 Missouri game-day run.

None of them builds season stats, so this page duplicates no work. It also writes a different object than the band.

To keep one writer per surface:
- **Band:** this proposal writes nothing to the band. A "Season stats" band link would be that session's change, made after it frees room.
- **Interim publish:** if Brenden picks the interim path, the stats data-block patch can ride on the postgame step of the existing Oct. 3 game-day routine. That avoids a second session writing to Wix on game night. Changing that routine is Brenden's call.
- **Option A:** the workflow is the only writer of the stats embed, and it never touches the band, home or Magazine objects.

**About the saved Ole Miss box:** `gameday/2026-09-26-ole-miss/postgame/espn-final-box.txt` keeps only the top 4 players per category. It can spot-check the leaders but not full-season sums. The pipeline assumes ESPN's summary lists every player in each category. The first real run confirms that. If it doesn't hold, the receptions-vs-completions and yardage checks stop the run and nothing is written.

## Rollback

- **The page:** disable the one stats embed (`enabled: false`), re-sending its category. The route then shows the blank native Wix page, and nothing else depends on the embed. To abandon the page, also delete the Editor page.
- **Bad numbers:** PATCH the previous data block. Every snapshot is in Git history.
- **The workflow:** revert the one step. The snapshot files are inert without it.
- No homepage, band, Magazine, header or footer object changes in this PR, so there is nothing to roll back there.

## Verification plan

1. **Done, local:**
   - 15 unit tests;
   - the harness at 390 and 1366 px, plus other-route and missing-data fallbacks (synthetic data).
2. **First real snapshot.** It could not run from the worker session: the container's network policy blocks ESPN, and the GitHub integration cannot start workflows. Any one of these produces it:
   - Brenden runs "Refresh GatorBait publication feeds" on branch `claude/tender-wozniak-rmp60e` from the Actions tab. The newsroom steps skip off `main`, so it only builds and commits stats.
   - The PR merges, and the next 5-minute tick builds it, because "no snapshot" counts as due.
   - `site.api.espn.com` is allowed in the worker environment's network settings.
3. **Spot-check the real snapshot against primary sources:**
   - ESPN box scores for each final (Ole Miss: 52-28; Baugh 29-142-3; Philo 16/23, 196, 1 TD, per `gameday/2026-09-26-ole-miss/postgame/espn-final-box.txt`);
   - FloridaGators.com cumulative stats.
4. **After deploy, a live probe:**
   - 390, 430 and 1366 px;
   - the page mounts and the native page is hidden;
   - no overflow;
   - Barlow applied;
   - title, source and timestamp present.
5. Record the embed ID, revision and evidence in issue #34.

## Decisions for Brenden

1. **Placement:** create the `/florida-football-stats` page (recommended). Entry points: none for now, a band link, a homepage card, or a footer link.
2. **Publish:** A, the Wix API key as a repository secret (recommended). Or B, the GitHub Pages fetch. Or interim-only for now.
3. **First real snapshot:** run the workflow on the branch, merge first, or allow ESPN in the worker environment.
