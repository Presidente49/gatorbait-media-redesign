# Sunday Ledger

## The idea

One weekly ops report, built by a script from what is actually connected, delivered to Brenden every Sunday morning before the Missouri-week planning starts. It answers the questions the daily-operations playbook says the controller should be able to answer and today nobody can without six tabs: what we published (and who led), what happened on the field, what the site did, what search did, what Facebook and Instagram did, and whether the production checks are green. `ledger.mjs` reads twelve raw connector answers plus two repo files and writes `ledger-<date>.md`; the flagging is rule-based, so the model's only job is to make the reads and paste the result.

It was run once, for real, for the week of Sept. 21 to 27. The real report sits outside the repo; the redacted copy (`ledger-2026-09-27-redacted.md`, every audience number printed as "n") and `preview.html` are the exact same output with the numbers removed.

Round one's Kickoff Watch (`script.mjs`, `workflow.yml`) stays in this folder untouched; it watches Saturday, this one closes the week.

## Why it matters

- Brenden's standing order is a Monday scorecard inside the Morning Money Report (traffic, top posts, social, email). That scorecard has no data pipe; the ledger is the pipe, minus the money lines, which stay in the private money report.
- The first real run found things nobody had noticed. GA4 sent no usable data for four of the seven days (Sept. 21 to 24), so any week-over-week traffic line quoted this week would have been wrong. More than half of all sessions were "Direct" with an engaged rate under a tenth of the site's normal, concentrated on Sept. 26 and 27, which is a bot or referrer-stripped pattern, not readers. The Buddy Martin Show Facebook page's reach fell by half against the prior week while the main page carried the game. Best Fridays in Football's Instagram posted nothing. YouTube is on no connected read path at all.
- It settles the "who is leading" question with a count: 39 stories in the week, Buddy Martin and GatorBait Staff tied for most bylines at nine each, then Brenden and Franz at seven. That is the input the "Buddy leads, no redundancies" direction needs every week.
- Twelve reads a week. No writes, no Wix, no email, no scheduler beyond one proposed Routine that fires into the session Jarvis already runs.

## Evidence

Tool calls made Sept. 30, 2026, all read-only. Full text in `SOURCES.md`.

- `mcp__Metricool_Social_Media_Management__getBrandSettings` → refused: "This brand doesn't have any social network connected yet … blogId=6946016". Metricool numbers are benchmarks only until a network is connected.
- `mcp__Supermetrics_Marketing_Analytics__data_source_discovery` (filter `analytics,social`, then `search console`) → GAWA, GW, FB, IGI, YT2 all `authentication_status: NOT_AUTHENTICATED`; GW returned a login link. Nothing queried.
- `mcp__PostHog__exec` `call project-get {}` → project 601216, `ingested_event: false`, `completed_snippet_onboarding: false`. No snippet on the site, so no query.
- `mcp__Google_Drive__search_files` (GatorBait + analytics/weekly/report/ledger) → `{}`.
- `mcp__Claude_Code_Remote__list_triggers` → 15 Routines, none a weekly report; nothing created.
- `mcp__Windsor_ai__get_connectors` → connected: `facebook_organic` (pages 192930054063033, 164984480218367, 101360751735365), `instagram` (17841444573395911, 17841400514891638, 17841443053640107), `googleanalytics4` (340655495), `searchconsole` (`sc-domain:gatorbaitmedia.com`).
- `mcp__Windsor_ai__get_fields` × 4 (GA4 486 fields, Search Console, Facebook organic 323 fields, Instagram) to get real field IDs; the guessed GA4 names did not exist.
- `mcp__Windsor_ai__get_data` × 11, Sept. 14 to 27 for daily series and Sept. 21 to 27 for breakdowns: GA4 daily, pages, channels, devices; Search Console daily, queries, pages; Facebook page daily and posts (147 post rows); Instagram daily and media (57 rows). Raw answers saved as `ledger/inputs/*.json` in the session scratchpad.
- `mcp__github__actions_list` `list_workflow_runs` `live-presentation-qc.yml` → newest run #144 (36671764685) `success` on `claude/dept-ideas` at f5f8e63; #141 cancelled by a newer push, the rest success.
- Repo: `gazette-live/posts.json` unioned over its 19 commits in the week via `git log`/`git show` (the feed alone only reaches back to Sept. 27); `sports-live/scoreboard.json` for Florida 52, No. 4 Ole Miss 28 and the Missouri kickoff.
- Runs: `node deploy/dept-ideas/ops/ledger.mjs --week-ending 2026-09-27 --inputs <scratchpad>/ledger/inputs --out <scratchpad>/ledger --html` wrote the real `ledger-2026-09-27.md` (14,911 bytes), `.json` (51,509) and `.html`; the same command with `--redact --compact --html` produced the committed sample and `preview.html` (11,796 characters).

## What it needs from Brenden

1. A yes on the Routine in `routine.md` (Sundays 6:49 a.m. ET, into Jarvis's session, Windsor.ai and GitHub only). Jarvis creates it; nothing was created here.
2. Two fixes the first run exposed, both his to authorize: check the GA4 tag on the Wix site (four dark days), and decide whether the Direct-traffic spike is worth a PostHog snippet or a GA4 filter. Neither is done here.
3. YouTube: either connect The Buddy Martin Show channel in Windsor.ai or let the ledger use vidIQ `channel_analytics` next round. Until then the YouTube section says "not connected", on purpose.
4. Optional: connect one network to Metricool brand 6946016 so its best-time-to-post and benchmarks stop being empty.

## Risks

- **A gap looks like a drop.** GA4 missed four days; the script flags gaps and prints "days with data" so the delta is never read alone, but a reader skimming the table can still misread it. The Attention block goes first for that reason.
- **Windsor.ai is a single vendor.** Every social and site number comes through it. If its token to Meta or Google lapses, the read fails and the section prints "not available" with the reason; it never falls back to old numbers.
- **Public repo.** The real report and the raw inputs must never be committed; `--redact` exists so the sample is safe, and the Routine prompt says so twice. Story counts, scores and post captions remain in the sample by design; audience metrics do not.
- **Story count depends on snapshot cadence.** The union of `posts.json` commits reached Monday this week (19 snapshots); a quiet week with fewer refreshes could lose Monday's stories, and the script says how far back it reached.
- **Not a live-site probe.** The health line is the latest `live-presentation-qc` run, which only fires on pushes to the design paths. Kickoff Watch and the six-hour production-health job remain the runtime monitors.
