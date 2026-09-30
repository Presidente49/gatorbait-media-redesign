# The Ledger — Research dept. idea

## 1) The idea (two sentences)

The Ledger is Florida's playoff resume as a live page: one line per game with opponent rank at kickoff, site, score and margin, followed by a quarter strip for the last final, a "what Saturday adds" line for the next opponent and a Gauntlet block that totals the record of every remaining SEC opponent. Every figure is drawn from ESPN's public scoreboard as already saved in `sports-live/scoreboard.json`, and every figure carries its source line.

## 2) Why readers or revenue care

- It answers the question Gator fans are asking every Sunday from Oct. 3 on: what does this win (or loss) do to the resume? Nobody else in the Florida market renders that as a single, sourced page that updates itself.
- It is a natural companion to Buddy Martin's poll and playoff columns and to Brenden's Sunday "Chomp Up the Charts" pieces, so it deepens the primary editorial home instead of competing with it. The page links out to those stories; it does not duplicate them.
- It is a repeat-visit surface. Readers return after every game to see the line change, which is the cheapest traffic GatorBait can earn: no new writing, no new photos, no send.
- Different from Jarvis's two features: The Road Ahead shows where the season is going; The Tunnel opens game day. The Ledger shows what the season has already proven and what the next result is worth.
- Verified today from the feed (`sports-live/scoreboard.json`, updated 2026-09-29T02:17Z): 214-91 in points, +30.8 average margin, one win over a ranked team (No. 4 Ole Miss), one SEC road win (Auburn), remaining SEC opponents a combined 21-7 (.750), Texas and Georgia both on the road 14 days apart.

## 3) How it is built (files, data endpoints, refresh cadence, effort in hours)

**Files (all new, none touching the live homepage):**
- `deploy/dept-ideas/research/preview.html` — the prototype in this folder, 8,277 characters, CSS only, Barlow and Barlow Condensed from Google Fonts, Swamp Night palette.
- If approved: `sports-live/src/ledger.js` (a renderer that reads the existing JSON and fills the same page structure) and a `ledger` entry in `sports-live/front-page.config.json`, built by the existing `sports-live/build-front-page.mjs` and checked by `sports-live/qa-front-page.mjs`. No new scheduler, no new repo, no new renderer stack.

**Data already in the repo (used in the preview):**
- `sports-live/scoreboard.json`: `team` (rank, record, conference record), `schedule` (event IDs, dates, opponent rank at kickoff, home/away, final scores, TV), `last.quarters` (Ole Miss only), `standings` (SEC overall and conference records).
- `gazette-live/posts.json`: story links, which is the only place links come from; no ESPN or SEC links are emitted, matching the existing feed rule.

**ESPN public endpoints it reads once live (same host the feed already uses, `site.api.espn.com/apis/site/v2/sports/football/college-football/`):**
- `teams/57/schedule?season=2026&seasontype=2` — Florida's schedule, results, opponent ranks. Already read by `automation/scoreboard_feed.py`.
- `summary?event=<eventId>` for each final (401856637, 401856672, 401856687, 401856699, then 401856708 after Saturday) — quarter scores and box score. The feed today keeps quarters only for the last final; The Ledger asks the feed to keep the `quarters` array on every final so the quarter strip and a first-half/second-half pattern can cover the whole season.
- `scoreboard?groups=8&week=<n>` — SEC results by week, used only to refresh the Gauntlet block's opponent records between Florida games.
- `.../apis/v2/sports/football/college-football/standings?group=8&season=2026` — SEC standings. Already read by the feed.
- `teams/57` — Florida's current rank and record, as a cross-check on the schedule payload.

**Refresh cadence:** none new. The scoreboard job in `.github/workflows/refresh-newsroom-feed.yml` already runs on a five-minute tick and polls from one hour before kickoff to five hours after; The Ledger re-renders whenever that file changes. The only feed change is a small one in `automation/scoreboard_feed.py` to retain quarter arrays for all finals, validated by `automation/validate_scoreboard.py`.

**Effort:** about 6 hours total. Renderer and config, 3 hours; feed change plus a fixture test in `automation/tests/test_scoreboard_feed.py`, 1.5 hours; QA at 390 and 1440 pixels through the existing QA script, 1 hour; source-line copy review, 0.5 hours.

## 4) What it needs from Brenden

1. A yes or no on the concept and the name (The Ledger, or a house name Brenden prefers).
2. Where it lives: a section on the free sports-news homepage below The Road Ahead, or its own page linked from the homepage. The recommendation is its own page with a one-line homepage teaser, so the homepage baseline lock is untouched.
3. Approval to make the small feed change (retain `quarters` on every final). It is read-only against ESPN and adds no request volume; the summary calls already happen.
4. A ruling on the wording "playoff resume." AP style keeps "resume" without accents; if Brenden prefers "ledger" or "case" throughout, the copy changes in one place.
5. A controller assignment under issue #3 before any of the above touches `sports-live/` or the homepage. Nothing here is deployed; the preview lives only in this folder.

## 5) Risks

- **Rank drift.** Opponent rank at kickoff is what the resume should record, but the feed stores ESPN's current rank on the schedule row. Once a game is final the row's rank must be frozen; the renderer should write it to a small `resume` block in the JSON the first time a game goes final, and the source line should say "rank at kickoff."
- **ESPN endpoint changes.** The site API is public but undocumented. Mitigation already exists: `validate_scoreboard.py` refuses to write a bad file, so the last good Ledger stays up.
- **Quarter data is thin today.** Only the Ole Miss game carries quarters in the repo, so the half-by-half pattern is a one-game sample until the feed change ships. The preview says so plainly rather than inferring a trend.
- **Missouri's rank can move before kickoff.** The "what Saturday adds" line is stated as of the feed timestamp and labeled that way; the copy should never promise "a second ranked win" as a certainty.
- **Overlap with columns.** Buddy Martin already writes the playoff-path column. The Ledger must link to his pieces and never restate his projections (the ESPN FPI numbers in his Sept. 27 column are not in the feed and are not shown here).
- **Scope creep.** The obvious next asks (opponent box scores, FPI, SP+) each add endpoints or paid sources. Keep The Ledger to the three public endpoints above until it has run through the Texas and Georgia stretch.
