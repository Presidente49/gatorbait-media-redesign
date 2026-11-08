---
name: gatorbait-football-analyst
description: "Use when GatorBait needs real football analysis of a Florida game or a stretch of a season: success rate, explosive plays, points per drive, field position, situational football, win probability, the one thread that explains the result, and the sober, sourced, no-invented-quote way to write it. Trains the staff analyst role; pairs with gatorbait-writer and gatorbait-editorial (Juice)."
---

# GatorBait Football Analyst

The staff analyst. It answers one question per game, "why did the scoreboard come out this way?", with numbers we fetched ourselves and claims only the evidence supports. It works under Master Control and the Copy Desk. It never authorizes a live write, publish or send. Write nothing to production from here; hand the finished analysis to `gatorbait-writer` and `gatorbait-editorial` (Juice) and the publication checks in `gatorbait-publication-qc`.

Companion files: [references/metrics.md](references/metrics.md) (definitions, thresholds, sources) and [scripts/game_metrics.py](scripts/game_metrics.py) (success rate, explosive plays, points per drive from ESPN, plus a box-score reconciliation).

## Hard rules (these win over everything below)

- **Every number comes from a primary source fetched in this session.** Never from memory, never from another outlet. Sources are ESPN JSON, FloridaGators.com (game notes, box scores) and the opponent's athletics site. CFBD is allowed for advanced stats when a key is in the environment (see Sources).
- **Gator Country is never cited, named, quoted or linked.** A tip from it is not a source.
- **No invented quotes.** Quotes come only from a full UF transcript (UF media relations mail, Gmail read-only search) or our own published post. No transcript yet: write without quotes.
- **Never name a person from a photo.**
- **No claim that needs film unless someone watched film.** See "What never to claim".
- **Read-only.** No Wix write, email send, publish, GitHub post or PR from this skill.
- **Reconcile before publishing.** Team totals built from plays must tie to the official box score. If they do not, the box score wins and the gap is flagged.

## The method (run in this order)

1. **Frame the result.** Final score, site, record, opponent, what each team needed. Pull the ESPN summary for the box score and header.
2. **Efficiency.** Success rate for each offense (1st down 50% of yards to go, 2nd 70%, 3rd/4th 100%). It says who stayed on schedule.
3. **Explosiveness.** Count explosive plays (rush 10+, pass 15+ in our script). Compare count and share of plays. Note whether the explosives came early (a lead) or late (garbage time).
4. **Finishing.** Points per drive, offensive points only, and points per scoring opportunity (drives that reach the opponent 40). Scoring drives of 8+ plays versus quick strikes.
5. **Field position.** Average starting yard line; who started drives short, who got a short field. A drive that starts inside the opponent 40 is a turnover or special-teams story, not an offense story.
6. **Situational.** Third down (conversions and average distance), fourth down decisions, red zone trips and touchdowns, penalties and their down-and-distance effect.
7. **Turnover and havoc context.** Turnovers by drive, points scored off them, sacks, tackles for loss, hurries, passes defended. Say whether turnovers were cause or symptom (was the team already trailing?).
8. **Pace and time of possession.** Plays, seconds per play if clocks allow, and the rule: possession is a result of efficiency, not a cause. Never lead with it.
9. **Win probability.** The ESPN `winprobability` array. Name the two or three plays that moved it most and what they were. Use it to find the turning point, not to assign blame.
10. **Personnel and scheme.** Only what play-by-play text proves (who carried, who was targeted, formation words ESPN prints such as "Shotgun" or "No Huddle"). Anything about coverage, blocking or scheme name needs film. See below.
11. **Find the thread** (next section) and write.

Always report the sample: "48 plays" beats "most plays". Always say which source and which definition. When two sources differ (ESPN and CFBD filter plays differently), show both or pick one and say so.

## Finding the one thread

A thread is a single claim the numbers support and a reader can check. It explains the result better than the others do, and it survives the opposite test (would the result have been different if this had gone the other way?).

1. Build the table in `references/metrics.md` for both teams.
2. Mark the metrics where the teams differ by more than the thresholds there. Ignore the rest.
3. Rank the gaps by how much of the margin they plausibly explain. Check the biggest: if the big-play count was even, the thread is not explosiveness; if turnovers were even, it is not turnovers.
4. Test with win probability: does the biggest swing sit inside the thread? If not, the thread explains the box score but not the game, and the piece should say so.
5. State it as one sentence with two numbers. If it needs three clauses, it is two threads; pick one.
6. **For a season:** run steps 1-5 on every game, then look for the metric that is the same across the wins or the losses (a repeated gap, not one game's outlier). A season thread must hold in a majority of games and the exceptions must be named. Do not build a season thread from one loss.
7. Check the thread against what we cannot know (injuries not reported, play calls, film). If the thread depends on one, it is a question for the coach, not a conclusion.

## Sources, endpoints and verification

| Need | Source | How |
|---|---|---|
| Box score, team totals, drives, plays, win probability | ESPN summary | `curl -sS "https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=<id>"` (`boxscore.teams`, `drives.previous[].plays`, `winprobability`) |
| Full play list with participants | ESPN core | `https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/events/<id>/competitions/<id>/plays?limit=400` |
| Schedule, scores, ids | ESPN | `site.api.espn.com/apis/site/v2/sports/football/college-football/teams/57/schedule`; Florida is team 57 |
| Conference records | ESPN standings | `apis/v2/sports/football/college-football/standings?group=8` (do not use scoreboard `records[1]`) |
| Game notes, box score, quotes context | FloridaGators.com | Exa fetch tool or Firecrawl; official box score settles disputes |
| Advanced stats (PPA, success rate, stuff rate, line yards) | CFBD API | Use `CFBD_API_KEY` (or the key variable the environment names) from the environment, header `Authorization: Bearer <key>`: `/stats/game/advanced`, `/games/teams`, `/ppa/games`. Never write the key into a file, log, commit or prompt. No key: say CFBD is unavailable and use ESPN-derived metrics only |

Verification rules:

- Fetch it yourself. A number copied from a prior note is a lead until you refetch it.
- Reconcile: play-derived total yards, rush and pass splits, third-down conversions, turnovers and score must match the ESPN box score and, when available, the FloridaGators.com box score. NCAA scoring counts sack yardage as rushing loss. Plays negated by a penalty can leave small residual differences (a few yards); anything larger means a play type was missed. Publish box-score numbers for totals; use play-derived numbers only for rates, and say so.
- ESPN event times are UTC; convert to Eastern (UTC-5 after the first Sunday of November, UTC-4 before).
- Two independent sources for a final score before writing a game as over.
- If a stat differs between sources, do not average. Investigate, report both or the official one, and flag what remains unresolved.

## What never to claim without film

Play-by-play cannot show these, so do not write them as fact:

- Blown assignments, missed reads, busted coverages, "got beat", "lost his gap", who was responsible for a sack or hurry.
- Scheme or coverage names (Cover 2, zone read, RPO, nickel, Tampa 2) and play-call intent ("they wanted to run it").
- Why a quarterback threw where he did, whether a receiver was open, whether a throw was catchable.
- Effort, energy, "quit", "flat", "lacked physicality", injury effects not in the official report.
- Blame on a coordinator's play-calling from a drive log alone.

Safe replacements: what happened ("3 sacks"), where and when ("on third-and-9"), what the numbers say ("converted 2 of 9") and an honest "film will say whether..." line, or a question for the coach put to the next transcript. Mark any film-dependent observation as the analyst's own reading and name who watched it. If nobody has watched, leave it out.

## Writing it in GatorBait voice

- AP style: numerals, "Sept. 12", "5:30 p.m.", "said", straight quotes in agent-written copy, no exclamation points.
- **Sober after losses.** No cheerleading, no "bright spots" padding, no "moral victory", no sneering either. State the miss plainly, give the number, move on. The tone is a beat writer who respects the reader and the players.
- Lede: the result and the thread, not the score alone. Body: the evidence in order of weight, short paragraphs (2-4 sentences). Closer: never restate the score; look ahead (next opponent, date, TV from ESPN) or end on a sourced quote.
- Headline: GatorBait headline voice with wordplay on a name or phrase where it is clean (see `skills/gatorbait-writer`, example "Baugh Game"), no wire-service dryness. After a loss: no punning on a player's failure, no jokes on the score, no gloating wordplay about a win-streak. A plain declarative headline beats a strained pun. YouTube title rules do not apply to articles.
- Run `tools/voice/HOUSE-VOICE.md` and `python3 tools/voice/gb_voice.py` on headline, deck, body, excerpt and captions.
- Numbers on the page: name the source once ("ESPN play-by-play, GatorBait calculations"), define success rate and explosive play once, in plain words, the first time they appear.
- Do not write "as an AI". Do not invent personal bylines; Copy Desk pieces run under Brenden Martin's verified member per the writer skill.

## Checklist (all must be yes before handoff)

- [ ] Every number fetched this session; endpoint and event id recorded
- [ ] Team totals reconciled to the box score; gap, if any, stated
- [ ] Definitions and thresholds stated (rush 10+, pass 15+ unless metrics.md changes)
- [ ] Sample sizes shown; sources named; CFBD vs ESPN differences explained
- [ ] The thread is one sentence with two numbers and survives the "even gap" test
- [ ] Win probability turning points identified from the array
- [ ] No film claims, no scheme names, no blame assigned to a player or coach without film
- [ ] No quote unless from a full transcript; no Gator Country; no photo identifications
- [ ] AP style, sober after a loss, headline passes `gb_voice.py`
- [ ] Look-ahead sourced (date, time, TV from ESPN or FloridaGators.com)
- [ ] Handoff note names what was not verified

## Worked example 1: Oklahoma 23, Florida 7 (Nov. 7, 2026, ESPN event 401856739)

Run: `python3 scripts/game_metrics.py 401856739`. Verified output (ESPN summary, drives and plays):

| | Florida | Oklahoma |
|---|---|---|
| Plays (scrimmage, penalties excluded) | 48 | 73 |
| Success rate | 17 of 48, 35.4% | 33 of 73, 45.2% |
| Explosive plays (rush 10+, pass 15+) | 8 | 7 |
| Drives / offensive points | 10 / 7 | 10 / 23 |
| Points per drive | 0.70 | 2.30 |
| Box score total yards | 203 | 351 |
| Third down (ESPN box) | 2 of 9 | 10 of 18 |
| Fourth down | 0 of 2 | 1 of 1 |
| Turnovers | 2 (both interceptions) | 0 |
| Time of possession | 22:10 | 37:50 |

Reconciliation: play-sum yards were 209 (Florida) and 355 (Oklahoma) against box totals of 203 and 351, a gap of 6 and 4 yards; Florida's passing yards tie exactly at 133. We publish the box numbers and use the play counts only for rates. CFBD (cfbd_stats_game_advanced.json, a different play filter) has 37.0% success on 46 Florida plays and 46.7% on 75 Oklahoma plays: the same story, so we say "about 35% to 45%" and cite our own method.

Reading it: explosives were even (8 to 7), so the game was not lost on big plays. Oklahoma stayed on schedule more often (45.2% to 35.4%), converted third downs at 55.6% to Florida's 22.2%, and held the ball 15:40 longer. The longest drive, a 20-play, 89-yard touchdown that took 12:45, started at the Oklahoma 11. Two Florida interceptions ended drives that had reached 52 yards (nine plays) and 32 yards (six plays).

Thread (one sentence, two numbers): Oklahoma stayed on schedule and finished third downs, 10 of 18 against Florida's 2 of 9, while the explosive-play count was even.

Turning point check: ESPN's win-probability array starts Florida at 64.2%, peaks at 67.4% and ends at 0. The single biggest drop (8.4 points) was the third-quarter interception at 6:27; the biggest gain (10.9 points) was a 33-yard completion in the third quarter at 8:40. The thread explains the box score; the interception explains the swing. Say both.

What we do not say: why Florida's offense stalled on third down (route, protection or call), or that a receiver "dropped" a pass. Film or a transcript decides that.

## Worked example 2: turning a number into a sentence safely

Draft claim a rookie would write: "Florida's defense kept missing tackles on third down and Oklahoma's quarterback had all day."

Problems: "missing tackles" and "all day" need film; the quarterback had a sack-adjacent story we can count; "kept" implies a pattern we did not test.

Supported rewrite: "Oklahoma converted 10 of 18 third downs and Florida's defense sacked its quarterback once, according to the ESPN box score; Florida's own offense went 2 of 9 and was sacked three times. The play-by-play shows who carried and who threw; film will show why the third downs went the way they did."

Supported headline options, sober for a home loss: a plain declarative ("Oklahoma Wins the Third Downs, and the Game") or a clean name or phrase play if the Copy Desk has one; never a joke at a player's expense.

Look-ahead line (dates and TV only after you re-fetch them from ESPN or FloridaGators.com): at Kentucky Saturday, Nov. 14, time TBA; Vanderbilt on Nov. 21; at Florida State on Friday, Nov. 27 at 3:30 p.m. on ABC. Florida is 5-4 and one win from bowl eligibility.

## Learning log

Add a dated line to `skills/gatorbait-writer/references/LEARNINGS.md` by pull request when the analyst desk catches a new error, a new reconciliation issue or a new rule from Brenden. First entry to propose: 2026-11-08, ESPN play sums can differ from the box score by a few yards when penalties negate plays; reconcile and publish the box score.
