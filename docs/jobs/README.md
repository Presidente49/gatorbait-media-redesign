# Jobs

The recurring routines each read one file here. The routine prompt is two lines ("read START-HERE, run this file"); the job lives in git, so it can be reviewed and cannot drift across 20 copies.

| Routine | File | Cadence (ET) |
| --- | --- | --- |
| Newsroom desk | `newsroom-desk.md` | hourly, 6:20 a.m. to 11:20 p.m. |
| Publishing & Email QC | `publishing-email-qc.md` | hourly Monday–Saturday, 6:52 a.m. to 11:52 p.m.; Wix/GitHub only while the business inbox is unavailable |
| Controller sweep | `controller-sweep.md` | every 2 hours, 7:52 a.m. to 9:52 p.m. |
| Morning | `morning.md` | 6:05 a.m. |
| Game week | `game-week.md` | 7:10, 10:10, 13:10 daily; only due jobs run |
| Social | `social.md` | 8:30, 11:30, 14:30, 17:30, 20:30 daily |
| Marketing | `marketing.md` | 9:47 a.m. daily; weekly report Mondays |
| Spaces desk | `spaces-desk.md` | On triggers (new issue, big story); weekly check Mondays; drafts only, Brenden sends |

Kept as their own routines: the Daily GatorBait Roundup email (the one list email a day), the Sunday Ledger, the Monthly list cleanup, and the per-game status checks. Plan and rationale: `docs/STACK-V2.md`.

To change a job, edit its file in a PR (docs-only PRs are delegated to Jarvis). To change a rule, edit `docs/START-HERE.md`.

Cadence is not enabled-state evidence. Check the native scheduler: the Muse inbox sweep is paused until the actual newsroom mailbox is connected. The Oct. 20 increased Publishing & Email QC checks are a separate existing read-only lane, not proof that inbox intake or other paused jobs resumed.
