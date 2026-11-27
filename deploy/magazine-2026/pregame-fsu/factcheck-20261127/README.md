# Nov. 27 pregame fact check and front-page order

Owner direction: current official rosters and availability, factual copy corrections, and Soothsayer / Behind the Sticks / Loren as the front-page trio.

- Florida official roster:117 players; FSU official roster:107. Source all7 displayed fields from the school rosters. Fix Florida Edgecombe23 and Lowery26; FSU MarkeyRB and StevenPickardJr. GemariSands is absent from the current official FSU roster. A roster entry does not establish availability.
- Availability: FloridaGators.com Nov.26 OpeningKickoff.6 Florida and15 FSU listings. Label the source date and state that this is not a final game-day list. Dedicated Florida roster removes all Vanderbilt statuses and the unsupported old probable/limited labels.
- Takeaways12/9, giveaways14/18; other matchup tape rows agree with both official cumulative game-note tables. Baugh980/20 follows the newest UF preview and cumulative table; an older internal table said981.
- Correct sourced factual numbers and names while preserving writers' analysis and original dates. Loren's all-five-rushers-out claim is replaced by the actual dated statuses. Current game coach is RickStockstill; GlennSchumann is incoming. Current native Loren and Soothsayer articles were updated separately with original identities/access unchanged.
- Front page: existing current-nine selection and date-bounded package, Soothsayer -> today's Behind the Sticks -> Loren until20:30UTC kickoff. Never import older stories from outside the newest-nine window. Images, bylines and dates come from their own native records. No redesign.
- Reference links allow only existing site destinations or exact official floridagators.com/seminoles.com hosts. Fix the dedicated roster's320px card overflow without changing larger layouts.

## Sources

- https://floridagators.com/sports/football/roster/2026
- https://seminoles.com/sports/football/roster/2026
- https://floridagators.com/news/2026/11/26/football-the-opening-kickoff-no-20-gators-at-florida-state-a-friday-afternoon-sunshine-showdown
- https://floridagators.com/documents/download/2026/11/23/WEEK_12_UF_NOTES_-_FSU_-_PUBLIC.pdf
- https://seminoles.com/documents/download/2026/11/23/12_-_Florida_-_web.pdf
- https://seminoles.com/news/2026/11/23/football-glenn-schumann-named-florida-state-head-coach
- ESPN event401856759 and current team/week scoreboards.

## Validation and release

Existing21 homepage order tests and additional actual-feed/expiry/source-immutability checks pass. Independent candidate Chromium checks at320/390/430/1366 verify the224 roster rows,21 dated injury listings, official links, full article endings/bylines, real assets, unchanged video desk and no overflow. Narrow roster confirmation verifies117 players,6 current availability entries and zero overflow after the320px correction.

Build FSU with `MAG_VARIANT=fsu node sports-live/build-magazine.mjs`; build roster with `node tools/roster/build-roster.mjs`. Current candidates: magazine9bd6c36c; roster2f0a0ef7. Verify immutable CDN bytes before pinning. Fresh-read and guard all3 existing embed revisions and exact prior HTML; preserve ESSENTIAL/position/loadOnce/settings and change only their source pins. No Editor site publish or distribution is part of this change.

Rollback files here are exact current production HTML before release: magazine174, roster2, home43. Fresh-read current revisions before restoring them. Native article originals and comparison receipts remain private in the cloud workspace; the pre-existing Behind the Sticks unpublished access changes are excluded from this release.
