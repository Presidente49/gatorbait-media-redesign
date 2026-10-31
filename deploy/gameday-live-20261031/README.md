# Game-day cards in one command: Florida vs. Georgia, Oct. 31, 2026

Kickoff 3:30 p.m. ET (19:30Z), ABC, Mercedes-Benz Stadium, Atlanta. ESPN event `401856734`.

**Local files only.** Nothing here uploads, posts, emails, publishes or touches Wix. The controller decides what happens to a card after it is rendered.

## The command

```
deploy/gameday-live-20261031/render-now.sh <pregame|live|halftime|final> <espn-json-file>
```

Run it from the repo root. It needs Node and Playwright with Chromium (preinstalled in the cloud container; elsewhere see `sports-live/gameday/README-2026-10-31-georgia.md`).

| Phase | Use it | ESPN must say | Output (in `sports-live/gameday/out/`) |
|---|---|---|---|
| `pregame` | Before kickoff | `pre` (scheduled) | `pregame-2026-10-31-georgia.png` |
| `live` | In play, any time after kickoff | `in`, not halftime | `live-2026-10-31-georgia.png` |
| `halftime` | At halftime | `STATUS_HALFTIME` | `halftime-2026-10-31-georgia.png` |
| `final` | After the final | `post` (final) | `final-2026-10-31-georgia.png` |

Every run also writes `<name>-390.png` (the phone-size preview) and `<name>.receipt.json` next to the PNG. All cards are 1080x1350. Set `OUT_DIR=/some/dir` to write elsewhere.

## Step 1: save fresh ESPN JSON

Where ESPN is reachable (the Mac):

```
curl -fsS 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=401856734' -o /tmp/espn-401856734.json
```

In the cloud container (ESPN is blocked): use the Firecrawl scrape tool on that same URL with `maxAge: 0` (a live fetch, not a cached copy), `formats: ["markdown"]` and `onlyMainContent: false`. The result is large, so the tool saves it to a file. Pass that file's path straight to the command; the renderer unwraps the Firecrawl wrapper itself. If the result comes back inline instead, save it to `/tmp/espn-401856734.json`. A file holding only `{"header": ...}` also works.

Fetch again before every card. The script warns if the file is more than 15 minutes old.

## Step 2: render

```
deploy/gameday-live-20261031/render-now.sh pregame  /tmp/espn-401856734.json
deploy/gameday-live-20261031/render-now.sh live     /tmp/espn-401856734.json
deploy/gameday-live-20261031/render-now.sh halftime /tmp/espn-401856734.json
deploy/gameday-live-20261031/render-now.sh final    /tmp/espn-401856734.json
```

A good run prints `wrote` lines and a `RECEIPT` line, for example `RECEIPT final | Georgia 27, Florida 24 | ESPN STATUS_FINAL period 4 clock 0:00 | fonts: Barlow Condensed only | layout audit: clean`. The score line is winner first, so it fills the blanks in `sports-live/gameday/social-captions-2026-10-31-georgia-DRAFT.md` (if Florida wins, flip it as that file says).

## Step 3: check before anyone uses a card

1. Open the PNG and its `-390.png`. Names, scores, "3:30 p.m. ET" style times and "Oct. 31" style dates should be whole and readable.
2. Compare both scores with the ESPN box score. For the Final, also compare with FloridaGators.com, as the postgame runbook says (step 1 of `deploy/postgame-georgia-20261031/RUNBOOK.md`).
3. If a `REFUSED` line appears, read it. It says what ESPN reported. Do not edit around it. `--force` exists only for the controller to use after confirming the real game state.

## What the command refuses

| Exit | Meaning |
|---|---|
| 2 | Bad input, missing file, wrong ESPN event, or scores missing |
| 3 | Layout check (clipped, overlapping, off-canvas text) or font check (anything other than Barlow Condensed) failed |
| 4 | ESPN's status does not match the phase, or the game is delayed, postponed, suspended or canceled |

Full list of checks: `sports-live/gameday/README-2026-10-31-georgia.md`. A final card leaves out a team record that ESPN has not yet updated from the pregame number.

## Rehearse before kickoff

```
deploy/gameday-live-20261031/render-now.sh test
```

Renders all four phases from fabricated numbers into the OS temp dir. Every TEST card has a banner and a tiled watermark and is named `TEST-*`. They are git-ignored. Never post, send or commit them. A JSON file with a top-level `_test_fixture` key is treated the same way, so a fabricated fixture cannot be rendered as if it were real.

## Where the outputs go

Only to `sports-live/gameday/out/` on the machine that ran the command. The script does not commit, upload or post. Previews, receipts and TEST files are git-ignored; a real PNG shows up as an untracked file, and the controller commits it only if wanted. Upload to the Wix Media Manager and any social post are separate steps that need the controller's go-ahead (social also follows `docs/SOCIAL-RULES.md`). The cards are typeset from ESPN numbers and use no generated imagery. If the controller counts them as final social art under the standing art-source rule, route them through Muse and regular ChatGPT Pro like other social art.

## Verified and not verified

- Verified Oct. 31: pregame card rendered from a live ESPN fetch (No. 17 Florida 5-2, No. 3 Georgia 6-1, 3:30 p.m. ET, ABC). The kickoff text the script derives from ESPN's `19:30Z` matches the card text.
- Verified with fabricated TEST data shaped like that response: live, halftime, final, overtime, tie, three-digit scores, long names such as "Georgia Bulldogs", the wrong-phase refusals and the delayed-game refusal. Cards were inspected at full size and at 390 px.
- **Not verified:** a real in-game or final ESPN payload (the game had not started). If the real feed names a status or field differently, the command refuses rather than guessing. Check the first live card against the ESPN game page. Manual fallback, only if the controller says so: `node sports-live/gameday/render-score.mjs --phase final --fla N --uga N`. It prints a warning because nothing checks those numbers.

## Also in this folder

`muse-handoff-postgame-hero-20261031.txt`: prepared brief for the postgame hero art. Prepared only; not sent to anyone.
