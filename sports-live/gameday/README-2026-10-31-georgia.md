# Game-day graphics kit: Florida vs. Georgia, Oct. 31, 2026

Local files only. Nothing here uploads, publishes, posts or changes Wix. Final distribution stays with the controller.

| File | Purpose |
|---|---|
| `score-graphic-2026-10-31-georgia.html` | 1080x1350 template, Barlow only (fonts from `assets/weather/`), navy/orange/royal blue/white, no UF marks. Scales down below 1080 px wide, no horizontal scroll. |
| `scoreboard-2026-10-31-georgia.json` | Data: teams, rankings, records, score, period/clock, kickoff, network, venue. |
| `render-score.mjs` | Playwright renderer, writes PNGs to `./out`. |
| `out/pregame-2026-10-31-georgia.png` | Rendered pregame graphic (verified). |
| `social-captions-2026-10-31-georgia-DRAFT.md` | Draft captions with blanks. Not posted. |

## Run

Playwright with Chromium is required (`npm i -D playwright && npx playwright install chromium`; the script also finds a global install).

```
node render-score.mjs --phase pregame
node render-score.mjs --phase halftime --fla 10 --uga 14
node render-score.mjs --phase final --fla 24 --uga 27
node render-score.mjs --phase final --espn                      # ESPN summary feed
node render-score.mjs --phase halftime --espn-file summary.json # saved ESPN JSON
node render-score.mjs --all --fla 10 --uga 14 --check-widths    # test only
```

Options: `--data file.json`, `--out dir`, `--period N`, `--clock "5:12"`, `--check-widths` (reports overflow at 1080 and 390), `--shots`.
Halftime and final refuse to render without scores (arguments or ESPN). Scores from ESPN: `https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=401856734`.

## Status
- ESPN reachable from this container (HTTP 200). It currently reports the game as scheduled with no scores, so halftime/final cannot be rendered with real numbers until play starts. `--espn-file` is the fallback if the feed is blocked elsewhere.
- Pregame facts match ESPN: No. 17 Florida 5-2, No. 3 Georgia 6-1, 3:30 p.m. ET, ABC, Mercedes-Benz Stadium, Atlanta.
- Overflow check at 390 and 1080 passed for pregame, halftime and final (including a three-digit stress score).
- No photos are used, so no photo credit is needed on these graphics. Add credits per `docs/PHOTO-ATTRIBUTION.md` if a photo is added later.
- Not done by design: any upload, embed, homepage change, publish, email or social post.
