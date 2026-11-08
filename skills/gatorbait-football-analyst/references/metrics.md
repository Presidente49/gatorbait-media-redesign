# Metrics: definitions, thresholds and sources

Thresholds are working defaults for GatorBait analysis, not laws. Change them only by editing this file, and say which definition a story uses. "Flag" means a gap large enough to consider as the thread; smaller gaps are noise at one-game samples.

## Efficiency

| Metric | Definition | Flag a team gap of | Source |
|---|---|---|---|
| Success rate | Share of scrimmage plays that gain 50% of yards to go on 1st down, 70% on 2nd, 100% on 3rd and 4th. Turnovers fail; penalties and special teams excluded. | 8 points or more | Standard (Bill Connelly / CFBD definition); computed from ESPN plays by `scripts/game_metrics.py`; CFBD `/stats/game/advanced` `successRate` |
| Yards per play | Box-score yards / scrimmage plays | 1.0 yard | ESPN box (`totalYards`) and play count |
| EPA / PPA | Expected points added per play | 0.10 per play | CFBD `/ppa/games`, `/stats/game/advanced` (key required) |

## Explosiveness

| Metric | Definition | Flag | Source |
|---|---|---|---|
| Explosive play | Rush of 10+ yards or pass of 15+ yards (script constants `EXPL_RUSH`, `EXPL_PASS`). Sacks never count. | 3 or more plays | ESPN plays, `statYardage` |
| Explosive rate | Explosive plays / scrimmage plays | 4 points | Computed |
| CFBD explosiveness (IsoPPP) | Average PPA on successful plays; a different measure, do not mix with the count | 0.25 | CFBD advanced stats |

## Finishing

| Metric | Definition | Flag | Source |
|---|---|---|---|
| Points per drive | Offensive points (no defensive or special-teams scores) / offensive drives. Computed from score change across each drive's plays. | 1.0 | ESPN drives and play scores |
| Points per scoring opportunity | Points on drives that reach the opponent 40 or closer / such drives (play `start.yardsToEndzone` <= 40) | 1.0 | ESPN plays |
| Red-zone touchdown rate | Touchdowns / trips inside the opponent 20 | 20 points, small samples (under 4 trips) are anecdotes | ESPN plays |

## Field position and pace

| Metric | Definition | Flag | Source |
|---|---|---|---|
| Average start | Mean own-yard-line at drive start (opponent territory counts as 50 plus yards) | 5 yards | ESPN drives `start.text` |
| Plays and time of possession | Scrimmage plays; box `possessionTime` | Use as context only, never as a cause | ESPN box |
| Seconds per play | Time of possession in seconds / plays | Context only | Computed |

## Situational

| Metric | Definition | Flag | Source |
|---|---|---|---|
| Third-down rate | Conversions / attempts (ESPN `thirdDownEff`) | 15 points | ESPN box; also check average distance |
| Fourth-down decisions | Attempts, conversions, field position; judged against context, not hindsight | A decision story needs the score, clock and yardline in the sentence | ESPN plays |
| Penalties | Number and yards (`totalPenaltiesYards`), plus the down they changed | 40 yards or a drive-extending foul | ESPN box and plays |

## Turnover and havoc context

| Metric | Definition | Flag | Source |
|---|---|---|---|
| Turnover margin | Takeaways minus giveaways | 2 | ESPN box |
| Points off turnovers | Points scored on the drive after a takeaway | Report both teams | ESPN drives |
| Havoc (our working definition) | Sacks + tackles for loss + passes defended + forced turnovers per defensive play | Cite counts, not a rate, below 40 plays | CFBD `/games/teams` (`sacks`, `tacklesForLoss`, `passesDeflected`, `qbHurries`) and ESPN box |

## Win probability

ESPN `summary.winprobability[]`: `{homeWinPercentage, playId}` per play, home team perspective (Florida is team 57; check `homeAway` in the header). A swing is the change between consecutive entries. Report the largest two or three swings and match `playId` to the play text. Treat it as a model: good for locating turning points, not for blame.

## Personnel and scheme (what plays can and cannot support)

Supported by play-by-play: who carried or threw and how often, formation words ESPN prints, targets, yards by player, snap counts only if a source publishes them. Not supported: blocking assignments, coverage, scheme names, intent. Those need film or a coach's transcript.

## Verification

Every metric above needs a source line and a fetch date in the handoff. Reconcile team totals to the box score (yards, rushes, passes, third down, turnovers). Disagreement between ESPN-derived and CFBD numbers is expected because the play filters differ (garbage time, kneel-downs, penalties); report which one a number came from.
