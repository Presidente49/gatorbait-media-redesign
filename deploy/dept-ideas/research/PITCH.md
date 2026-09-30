# The Scout

## The idea

The Scout is a script, not a page: `deploy/dept-ideas/research/scout.mjs` reads the next opponent from `sports-live/scoreboard.json`, pulls five ESPN public JSON documents (the pregame summary, the opponent's team record, the opponent's schedule, the opponent's last completed game, Florida's team record), cross-checks them against each other and writes a scouting sheet in which every number carries the URL it came from. It ran for real on Missouri (Oct. 3) and produced `scout-missouri.json` (the data), `scout-missouri.md` (the desk copy) and `preview.html` (the same sheet in the Swamp Night look). Round one's Ledger restyled numbers already in the repo; this makes new numbers from ESPN and proves where each came from.

What the sheet holds for Missouri, all cited: No. 25, 3-1, 0-1 SEC, 10th in the SEC; every result with site, score and margin (143 points for, 83 against); season per-game offense and defense side by side with Florida (Missouri 35.8 points and 418.8 yards a game, 20.8 and 318.5 allowed; Florida 53.5 and 532.8, 22.8 and 351.3 allowed); season leaders (Austin Simmons 70 of 107 for 947 yards and 11 touchdowns, Jamal Roberts 395 rushing yards, Cayden Lee 27 catches for 412 yards, Daeden Hopkins six sacks); the 31-24 loss at Mississippi State by quarter (0-10-14-0), team stats, game leaders and every scoring play; five common opponents with Florida (Ole Miss, Texas, Georgia, Kentucky, Oklahoma) and how each team fared or when each plays them; ESPN's Matchup Predictor (Florida 70.2 percent); kickoff, venue, TV and the forecast at read time. Series history is not in the ESPN documents, so the sheet says so instead of sourcing it elsewhere.

The script refuses to write if the pieces disagree: the record computed from the schedule must equal ESPN's record, the schedule's points must equal ESPN's per-game averages, and the last game's line score must add up to its final. That is the same discipline as `automation/scoreboard_feed.py`.

## Why it matters

- It feeds writers before it feeds readers. Buddy Martin's Monday column and the Friday "first look" today are written from memory and ESPN tabs. The sheet gives the desk a sourced number set in one file the morning after each game, with the cross-checks already done.
- It feeds the homepage without touching it. The Tunnel already renders an opponent record under the opponent's name (`front-page.js` reads `next.opponentRecord`), but the feed never emits that field, so the line is blank on game day. The Scout produces exactly that string, plus a small block The Road Ahead can show under each remaining opponent.
- It repeats for free. Same script, next opponent, every week; it adds the opponent's team, schedule and one summary document to what the scoreboard job already reads.
- It is honest about limits. Ranks on schedule rows are ESPN's at read time, not at kickoff, and the sheet says so on the row.

Proposed feed addition (shape only; `front-page.js` is not edited here, and `validate_scoreboard.py` rejects unknown keys, so both the validator and the feed need a controller-assigned change):

```
next.opponentRecord: "3-1"                       // string; front-page.js already reads it for the Tunnel line
next.scout: { record, conf, standing, ppg, oppPpg, ypg, oppYpg,
              leaders: { pass, rush, rec },        // each { name, pos, line }
              last: { opponent, result, score, date },
              common: [{ opponent, fla, opp }], asOf, sources: [url, ...] }
schedule[i].opponentRecord: "3-1"                 // Road Ahead card subline; null when unknown
```

The Tunnel needs zero code for `opponentRecord`. The Road Ahead needs one line in `roadHtml` to print `g.opponentRecord` under the opponent, and the Tunnel's "More on Missouri" list could take a one-line strip from `next.scout` (points per game, top passer, last result). Both are small and reversible.

## Evidence

Tool calls, in order:

1. `mcp__Exa__web_fetch_exa` on `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/142`: refused, `CRAWL_UNEXPECTED_CONTENT_TYPE` (Exa will not return JSON bodies). Switched to TinyFish per the brief.
2. `mcp__TinyFish__get_wallet`: balance negative, auto-reload unconfigured; fetch is metered per URL, so only two fetch calls were made.
3. `mcp__TinyFish__fetch_content`, three URLs in one call (tool result ID `mcp-TinyFish-fetch_content-1790745284466`, 473,336 characters, `errors: []`): `teams/142` (2,369 ms), `teams/142/schedule?season=2026&seasontype=2` (2,660 ms), `summary?event=401856708` (2,565 ms).
4. `mcp__TinyFish__fetch_content`, two URLs in one call (tool result ID `mcp-TinyFish-fetch_content-1790745339875`, 638,836 characters, `errors: []`): `summary?event=401856703` (393 ms), `teams/57` (238 ms).
5. `node scout.mjs --from-dir espn --html` from the saved responses: `{"opponent":"Missouri","record":"3-1","rank":25,"games":12,"finals":4,"lastGame":"L 24-31 at Mississippi State","common":["Ole Miss","Texas","Georgia","Kentucky","Oklahoma"]}`. All three consistency checks passed.
6. Playwright render of `preview.html` at 390 and 1365 px: no horizontal overflow (see report).

Files in this folder: `scout.mjs` (about 26 KB), `scout-missouri.json` (15 KB), `scout-missouri.md` (6 KB), `preview.html` (8.7 KB, under the 12,000-character cap), and `espn/` holding the five raw ESPN responses exactly as fetched (team-142 19 KB, team-57 19 KB, schedule-142-2026 287 KB, summary-401856708 110 KB, summary-401856703 550 KB) so the run can be repeated offline and audited.

Live mode (`node scout.mjs --save-dir espn --html`) uses Node's `fetch` against the same URLs; it cannot run from this container because direct HTTP to ESPN is blocked here, which is why the saved-response mode exists and is the mode the evidence above used.

## What it needs from Brenden

1. A yes on the name and on where the desk copy goes: a Monday file in the repo (`deploy/dept-ideas/research/scout-<opponent>.md`, or a `sports-live/scout/` folder if promoted), or pasted into the writers' channel.
2. A controller assignment under issue #3 for the feed change: `opponentRecord` on `next` and `schedule[]`, the optional `next.scout` block, the matching `validate_scoreboard.py` rule and a fixture test. Proposed cadence: the existing scoreboard job runs it once after each Florida final and once Thursday morning; no new scheduler. Proposed prompt for the routine, not created here: "run `node deploy/dept-ideas/research/scout.mjs --save-dir espn` and commit the outputs if the consistency checks pass."
3. A ruling on the Matchup Predictor and forecast lines: keep them in the desk copy only, or allow them on the homepage strip. The recommendation is desk copy only.
4. Whether series history should be added from FloridaGators.com game notes (allowed source) as a hand-maintained field, since ESPN's documents do not carry it.

## Risks

- ESPN's site API is public but undocumented. The script fails closed (exit 2, nothing written) on any missing field or failed cross-check, so a bad week leaves last week's sheet in place.
- Ranks on schedule rows drift. The sheet labels them "at read time"; a promoted version should freeze the rank when a game goes final, as the round-one Ledger also noted.
- The `lastFiveGames` and `scoringPlays` objects name teams by display name only; the script resolves them through the ids it has seen and the feed's opponent list, and falls back to ESPN's display name (mascot included) for teams outside both, such as last season's Virginia game.
- Season leaders come from the pregame summary, which ESPN refreshes on its own schedule; the `asOf` stamp and the feed's `updatedAt` are both in the JSON so a stale read is visible.
- The raw `espn/` folder is about 1 MB. If that is too heavy for the repo, keep only `scout-*.json` and re-fetch on demand; the script does not need the raw files once the sheet is written.
