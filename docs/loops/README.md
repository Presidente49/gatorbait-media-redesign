# Loops: how the collective works

Brenden, Oct. 15, 2026: "Fix everything as a collective. Give mentality with md loops."

`docs/START-HERE.md` is still the rulebook and wins over this folder. A loop is a short, repeatable cycle that one owner runs on one surface until a metric moves. Each loop lives in its own markdown file. That file is the loop's memory: any worker, whether Claude, Codex or a routine, can pick it up cold, run one turn and leave it better than they found it.

## The mentality

1. **One loop per surface, one owner per loop.** The owner is the only production writer for that surface. Everyone else reads, researches, reviews or proposes in the loop file or in #34.
2. **Every turn is the same eight steps:** OBSERVE → SCOPE → CLASSIFY → PLAN → ACT → VERIFY → RECORD → LEARN (from `skills/master-control/SKILL.md`). A turn may be read-only. A turn that changes nothing and finds nothing new says nothing.
3. **Start from live evidence, never from the last note.** The loop file says what to read; it does not replace reading it.
4. **Small, reversible, verified.** One change per turn, with the rollback written before the write. A change counts as done only after verification at 320/390/430/1366 px or with provider numbers. A model saying "fixed" is not proof.
5. **The metric decides.** Each loop names its scoreboard. If the number doesn't move after a change, the next turn asks why before adding more.
6. **Collective, not crowded.** Parallel agents may research, draft and review at the same time. Only the loop owner writes to production. Hand-offs happen in #34 with the object ID, revision and rollback.
7. **Learn once, write it down.** A failure or a win that repeats becomes one line in the loop's "Lessons" section, and is promoted to `skills/master-control/references/LESSONS.md` when it applies beyond one loop.
8. **Brenden is asked only at the hard lines** (START-HERE section 3), with one recommendation.

## The loops

| Loop | File | Owner (Oct. 15) | Cadence | Scoreboard |
|---|---|---|---|---|
| Front page | [front-page.md](front-page.md) | Codex, via PR #285, for build and deploy; Jarvis for direction | Daily, plus after each game | Clicks from home to stories, scroll to the show shelf, newsletter signups from home |
| Newsroom | [newsroom.md](newsroom.md) | Jarvis (Newsroom desk routine) | Hourly, 6:20 a.m. to 11:20 p.m. ET | Time from filing to live, copy-desk defects per story |
| Conversion | [conversion.md](conversion.md) | Jarvis | Weekly (Monday scorecard), plus after any funnel change | Free signups per 1,000 visits, trials started, paid orders (counts only in public places) |

Game day stays with the game-day desk (session "Chat analysis continuation"). Stats stay with the stats session. Both already run their own loops and are not duplicated here.

## Turn log format

Every turn that ships something adds one line to the loop file's "Turn log" (newest first) and one line in #34:

```
- 2026-10-15 15:30Z · <owner> · <what changed, object ID and revision> · verified <how> · rollback <how>
```

Keep only the last 20 lines in the loop file; git history keeps the rest.
