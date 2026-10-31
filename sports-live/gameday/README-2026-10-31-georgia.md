# Game-day graphics kit: Florida vs. Georgia, Oct. 31, 2026

Local files only. Nothing here uploads, publishes, posts or changes Wix. Final distribution stays with the controller.

**Desk usage is one command:** `deploy/gameday-live-20261031/render-now.sh <phase> <espn-json-file>`. See `deploy/gameday-live-20261031/README.md` for the full runbook. This file describes the kit itself.

| File | Purpose |
|---|---|
| `score-graphic-2026-10-31-georgia.html` | 1080x1350 template. Barlow Condensed only (`fonts/`, OFL). Gator blue `#0021A5`, orange `#FA4616`, white, small touches of green `#22884C`. No navy, no UF marks. Scales down below 1080 px wide, no horizontal scroll. Long names shrink, then wrap to two lines. |
| `fonts/` | `BarlowCondensed-700.ttf`, `-800.ttf` and `OFL.txt`. Copied from `deploy/swamp-night-20261017/cover/`. |
| `scoreboard-2026-10-31-georgia.json` | Fallback data: teams, rankings, records, kickoff, network, venue. ESPN data replaces it when given. |
| `render-score.mjs` | Playwright renderer. Writes PNGs to `./out`. Refuses to render when ESPN's status does not match the card, or when a layout or font check fails. |
| `out/pregame-2026-10-31-georgia.png` | Rendered pregame card (real ESPN pregame data). |
| `social-captions-2026-10-31-georgia-DRAFT.md` | Draft captions with blanks. Not posted. |

## What the renderer checks before it writes a card

- ESPN event must be 401856734.
- ESPN status must fit the card: pregame needs `pre`; live needs `in` and not halftime; halftime needs `STATUS_HALFTIME`; final needs `post`. Delayed, postponed, suspended or canceled games are refused. `--force` skips only this check.
- Scores of `null` are never drawn as 0.
- Kickoff time and date come from ESPN and are written in AP style ("3:30 p.m. ET", "Saturday, Oct. 31").
- On a Final card a record that still equals the pregame record is left off (ESPN had not updated it).
- Every glyph on the card comes from Barlow Condensed (checked through the browser's own font report), and no text is clipped, overlapping or outside the canvas.
- Fabricated data must be marked: `--test`, or a top-level `_test_fixture` key in the JSON. TEST cards carry a banner and a tiled watermark, are named `TEST-*`, and default to the OS temp dir. `--all` is TEST-only.

## Run

Playwright with Chromium is required (`npm i -D playwright && npx playwright install chromium`; the script also finds a global install).

```
node render-score.mjs --phase pregame  --espn-file espn.json
node render-score.mjs --phase live     --espn-file espn.json
node render-score.mjs --phase halftime --espn-file espn.json
node render-score.mjs --phase final    --espn-file espn.json
node render-score.mjs --phase final --espn                       # fetch ESPN directly (only where ESPN is reachable)
node render-score.mjs --phase final --fla 24 --uga 27            # manual fallback; not checked against ESPN
node render-score.mjs --all --test --fla 10 --uga 14             # TEST smoke render of all four phases
```

`--espn-file` takes the raw summary JSON, just `{"header": ...}`, or a saved Firecrawl result whose `markdown` holds the JSON.

Options: `--data file.json`, `--out dir`, `--period N`, `--clock "5:12"`, `--preview` (also writes a 390 px wide phone-size PNG), `--check-widths` (overflow report at 1080 and 390), `--test`, `--force`.
Exit codes: 2 bad input or wrong game, 3 layout or font check failed, 4 ESPN status does not match the phase.

Each render also writes `<name>.receipt.json` (phase, score line, ESPN status, source file hash, fonts, time). Previews and receipts are git-ignored.

## Status
- Pregame facts match ESPN (fetched Oct. 31): No. 17 Florida 5-2, No. 3 Georgia 6-1, 3:30 p.m. ET (19:30Z), ABC, Mercedes-Benz Stadium, Atlanta.
- Live, halftime and final cards were rendered and checked from fabricated TEST data shaped like the ESPN pregame response. They have not been run against a real in-game ESPN payload (the game had not started). Rehearse with `render-now.sh test`, and check the first real card against the ESPN game page.
- No photos are used, so no photo credit is needed on these graphics. Add credits per `docs/PHOTO-ATTRIBUTION.md` if a photo is added later.
- Not done by design: any upload, embed, homepage change, publish, email or social post.
