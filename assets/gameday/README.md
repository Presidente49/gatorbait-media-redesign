# Game-day cards

Type-led graphics in the white "gator-day" look: Gator blue masthead, orange rule, white card, Barlow Condensed
display and Barlow text. Barlow only. No photos, no team logos, no AI art, so nothing here needs a licence check
or the Wix media manager. Facts come from ESPN only.

Nothing here writes to Wix, email or any automation. It renders PNG files; the game-day desk uploads them.

## One command

```
node assets/gameday/render.mjs pregame  --event 401856714      # pregame card (landscape + portrait)
node assets/gameday/render.mjs final    --event 401856714      # final-score card (landscape + portrait)
node assets/gameday/render.mjs halftime --event 401856714      # halftime share card (square + landscape)
node assets/gameday/render.mjs quote    --data my-quote.json   # quote card (square + portrait)
node assets/gameday/render.mjs all      --event 401856714      # pregame + final + halftime
```

PNGs land in `assets/gameday/out/` (git-ignored) named `<type>-<eventId>-<format>.png`.
`--formats landscape,portrait,square` picks sizes, `--out dir` moves the output, `--stats a,b,c` picks the three
strip stats, `--kicker "text"` overrides the top-right line, `--save game.json` writes the data so it can be edited
and re-rendered with `--data game.json`.

Sizes: landscape 1200x675 (X, link previews), portrait 1080x1350 (Instagram/Facebook feed), square 1080x1080.

Needs Node 18+ and Playwright with Chromium. If `import('playwright')` fails, set `PLAYWRIGHT_PKG` to the
package path (same convention as `assets/weather/shot.mjs`). `CHROMIUM_PATH` overrides the browser binary.

## Game day, South Carolina at Florida (ESPN event 401856714, Sat. Oct. 10, 12:45 p.m. ET)

Ready now, built from ESPN at the time of the PR: `ready/pregame-401856714-{landscape,portrait,square}.png`.

At the final:
```
node assets/gameday/render.mjs final --event 401856714
```
It pulls the score, records, ranks and ESPN's team stats and fills the strip with total yards, rushing yards and
turnovers. Pick others with `--stats totalYards,netPassingYards,thirdDownEff`. Stat keys: `totalYards`,
`rushingYards`, `netPassingYards`, `turnovers`, `firstDowns`, `thirdDownEff`, `possessionTime`,
`yardsPerRushAttempt`, `yardsPerPass`, `totalPenaltiesYards`, `completionAttempts`.

At halftime (game in progress, ESPN status "Halftime"): `node assets/gameday/render.mjs halftime --event 401856714`.
The card shows ESPN's live score and live team stats. Re-check the score against ESPN's scoring plays before posting.

## Files

- `card.html`, `card.css`, `card.js`: the template. One page, four types, three sizes (`?type=…&format=…`).
- `espn.mjs`: turns an ESPN summary into the card JSON. The only place facts enter.
- `render.mjs`: the command above. Checks each PNG is the exact size and warns if text overflows.
- `fonts/`: Barlow 400/500/700/800 and Barlow Condensed 600/700/800 (SIL OFL, `fonts/OFL.txt`).
- `sample/`: real ESPN JSON for the Missouri final and South Carolina pregame, a halftime sample built from
  Missouri's first two quarters, and a quote sample.
- `ready/`: finished cards for today's game. `preview/`: the other card types on sample data.

## JSON shape

```
{ "source": "ESPN event 401856714", "eventId": "401856714", "sample": false,
  "status": "pregame|halftime|final|live", "statusText": "Final",
  "kicker": "SEC · Week 6", "date": "2026-10-10T16:45Z", "venue": "Ben Hill Griffin Stadium",
  "city": "Gainesville, Fla.", "tv": "SEC Network", "focus": "FLA",
  "teams": [ { "abbr": "FLA", "name": "Florida", "homeAway": "home", "rank": 16, "record": "4-1",
               "confRecord": "2-1", "confName": "SEC", "score": 38 }, { ... } ],
  "stats": [ { "label": "Total yards", "values": { "FLA": "325", "SC": "560" } } ],
  "line": { "details": "FLA -10.5", "overUnder": 58.5 },
  "quote": { "text": "…", "who": "…", "context": "…", "credit": "…" } }
```

`focus` is the team shown first and in blue on score cards. `sample: true` stamps "Sample data" in the footer so a
demo card can never be mistaken for a real one. Text is set with `textContent`, so quotes with `<` or `&` are safe.

## Rules these cards follow

- Barlow only (Condensed for display). Palette from `sports-live/src/front-page.css` day look: white, ink `#0d1530`,
  Gator blue `#0021a5`, orange `#fa4616`. White text on orange uses the deeper `#d23c0d` (4.8:1).
- ESPN-sourced facts only. Quotes are whatever the desk pastes in, from a transcript or a published column, with the credit line.
- Checked at 390, 430 and 1366 px wide (each PNG laid out at those widths and read): names, scores, kickoff and stats
  stay legible. Footers and the small meta line on landscape cards are small on a phone by nature, so use portrait or
  square for phone-first posts.
