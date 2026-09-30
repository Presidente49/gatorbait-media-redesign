# Kickoff Watch: the Saturday homepage watchdog

Ops department idea for Brenden's "one cool, forward-thinking thing" round. Read-only; nothing here touches production until the two files are merged.

## 1) The idea (two sentences)

A free GitHub Actions cron that, from one hour before kickoff to five hours after, reads the homepage every 10 minutes exactly the way a reader does and posts to issue #34 only when something is wrong: Wix serving an old Home Code revision, GitHub Pages behind `main` on the build pointer, the front-page bundle not downloadable, or the scoreboard feed frozen mid-game. Silence means the homepage is fine, and a recovery note closes the loop when the check passes again.

## 2) Why readers or revenue care (time or money saved, honestly estimated)

- **Game day is the peak-traffic window, and it is the one window nothing watches at speed today.** `gatorbait-production-health` runs every six hours; `ops-hub-cloud-cycle` runs hourly; `live-presentation-qc` only runs on a push. On Sept. 30 a Wix edge served a stale embed for 30 to 45 minutes and nobody saw it until a manual look. On Oct. 3 that would land during the Missouri game.
- **Time:** replaces Brenden refreshing his phone during the game (call it 15 minutes of attention a Saturday) and, more usefully, cuts the time-to-notice for a stale build from "whenever someone looks" to at most 10 minutes. Estimate, not a measurement.
- **Tokens:** health polling in a Claude session is the pattern `SPEND-GUARDRAILS.md` section 4 says to move to free cron. A session read of the homepage plus a state check runs roughly 3,000 to 5,000 tokens; 36 ticks a Saturday is 100,000 to 180,000 tokens the Oct. 3 game-day desk no longer needs to spend on health reads. No dollar figure, per the guardrails; the caps live on the Money Board.
- **Cost:** zero model tokens, zero Wix calls, zero email. Actions minutes on a public repo are free.

## 3) How it is built (files, triggers, minutes of Actions per week)

Two files, both in this folder and ready to move:

| In this folder | Moves to |
|---|---|
| `workflow.yml` | `.github/workflows/kickoff-watch.yml` |
| `script.mjs` | `automation/kickoff-watch.mjs` |

**Triggers.** Cron `*/10 15-23 * 8-12,1 6` and `*/10 0-7 * 8-12,1 0` (UTC: Saturday 11 a.m. ET through Sunday 3:50 a.m. ET, August through January). `workflow_dispatch` with two inputs, `force` (run outside a window) and `post` (comment on #34; off by default, so a hand-run never writes). The script gates the real window from `sports-live/scoreboard.json` on `main` with the same 1-hour-before, 5-hours-after rule as `automation/scoreboard_feed.py`, so a Thursday game needs a dispatch and an off-week tick exits in about a second.

**Checks, in order.** (1) `https://www.gatorbaitmedia.com/` with a real Chrome user agent and no query string: 200 within 8 seconds. (2) The served HTML carries the `GBM_HOME_CODE_V3` loader and none of the retired-shell markers `site_health_check.py` forbids. (3) Pages `sports-live/current.json` is valid and its commit equals `main`'s copy from the sparse checkout (the stale-Pages detector). (4) `homepage.js` at that commit downloads from jsDelivr with its `data-fp-build` stamp. (5) During the game, Pages `scoreboard.json` is at most 30 minutes old, and the comment says whether Pages is behind `main` or `refresh-newsroom-feed` simply has not written.

**Reporting.** Every run writes the table to the job summary. On failure the script lists the last eight hours of #34 comments, and posts only if no comment with the same hidden marker (`event`, `sig`) exists; a stuck Pages build is one comment, not 36. When the check passes again after a posted failure, one recovery note follows. Each failure line carries the next step and points at `deploy/front-page-2026/README.md` for rollback. The comment is what `preview.html` shows.

**Permissions.** `contents: read` for the sparse checkout. `issues: write` is the one write, only to add a comment to #34, with the built-in `GITHUB_TOKEN`; the token is never printed. Drop that line and the job still turns red and GitHub emails the failure, so no-write mode is one deletion.

**Minutes.** In season: about 36 in-window ticks at roughly 25 seconds (sparse checkout, Node setup, five fetches) is about 15 minutes, plus about 66 out-of-window ticks at roughly 12 seconds is about 13 minutes. Call it 30 minutes of Actions a week, none in the offseason. For scale, one `live-presentation-qc` Playwright run is about 5 minutes.

**What it does not duplicate.** No Playwright (that stays in `live-qc.mjs` on push and `live-shots` on demand), no Wix API, no seven-URL sweep (cloud-cycle and production-health already do that), no second scheduler or renderer. It is verified offline against canned responses; the live path runs only once merged.

## 4) What it needs from Brenden

1. Merge a two-file PR (Jarvis opens it; the files are here). No secrets, no Wix change, no new connector.
2. One dispatch with `force` on and `post` off to see a dry run in the log before Oct. 3.
3. A yes or no on `issues: write`. Yes means alerts on #34 where the record lives; no means red runs and GitHub's failure email only.
4. Tell the Oct. 3 game-day desk to stop polling the homepage for health and read #34 instead.

## 5) Risks

- **GitHub cron is best-effort.** The group think noted `refresh-newsroom-feed` is throttled to a few runs a day at `*/5`. Ten-minute ticks will sometimes slip or skip; the `concurrency` group stops pile-ups, but this is a watchdog, not a guarantee.
- **One runner's view.** A Wix edge lag or a slow tick from one Azure region can differ from what readers in Gainesville see. The next-step text asks for a second tick before anyone acts, and the failure comment is never an instruction to write.
- **HTML only.** The plain fetch cannot see the rendered Tunnel or Road Ahead. When a failure needs eyes, push a `shots/<name>` branch for real screenshots; do not add a browser here.
- **Scoreboard staleness may fire often.** If the 5-minute feed is throttled during a game, check 5 fails and says so plainly. That is a real finding, not a false alarm, but it can be noisy; the 30-minute threshold and one-comment-per-signature rule are the dampers.
- **Write scope.** `issues: write` covers every issue in the repo for the run's duration. The script only ever POSTs one comment to the issue in `WATCH_ISSUE`; anyone editing it should keep it that way.
- **Format drift.** The loader marker, `current.json` shape and README revision line are read by regex. If the loader moves to V4, update `script.mjs` in the same PR, or the check reports the loader missing.
