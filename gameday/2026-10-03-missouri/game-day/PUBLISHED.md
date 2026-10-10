# Game Day: Florida at Missouri (Oct. 3, ~14:00Z)

Post `8fec37fb-e3d9-4bdc-8afb-5bb16ff587e0`, /post/game-day-no-8-florida-at-no-25-missouri. GatorBait Staff, Gator Football, no email.

Cover: distinct "scoreboard matchup" layout (new family, no photo, navy/orange/gold, no repeat of the first-look tale-of-the-tape). Rendered via Playwright at 880x495, JPEG q18 to fit upload size limits, uploaded to Wix as `d3cfa5_031b46343079458fb97e18f1617e9626~mv2.jpg`.

Sources:
- AP game notes (opening line UF -4.5), DraftKings (UF -5.5, O/U 56.5)
- Florida's Friday SEC availability report (Vernell Brown III doubtful, Bailey Stockton upgraded) via Yahoo Sports / Gators Wire / 247Sports / On3, cross-checked
- Official Peach Bowl/Bobby Dodd Foundation release (Sumrall Dodd Trophy Coach of the Month, Sept.) — already published separately that morning
- FloridaGators.com opponent history (series 7-6, UF 2-4 on the road); last meeting Missouri 33-31 (2023), from the first-look story's sourcing

Band `96ef5a04-6714-496e-bac9-cea65a994bf6`:
- rev 45 → 46: fixed an expired `until` field (was `2026-09-29`, already past, so the band was rendering empty on the live homepage) to `2026-10-05T04:00:00Z`; refreshed headline/note for game day; added an `updates` entry for the Brown/Stockton availability report.
- rev 46 → 47: added the new Game Day story as the first link.

Live verification: confirmed via the embeds API directly (GET after PATCH matched the intended data block both times). Did not get a browser DOM screenshot of the band itself, since it's injected by JS at runtime and a plain content fetch won't render it — same limitation noted in earlier sessions' log entries.
