SEO department pitch: Gators Game Graph. Idea only; read-only, nothing on the live site was touched.

## 1) The idea

Turn the existing canonical roster/schedule guide into a search-built "Florida Gators 2026 schedule, scores and results" hub, and stamp every one of the 12 games with its own `SportsEvent` JSON-LD entity generated from the ESPN feed the site already refreshes every five minutes. Each game entity carries the kickoff, venue, TV, final score and a `subjectOf` link to the one canonical GatorBait story for that game, so Google sees GatorBait as the publisher that describes each Florida game, not just a blog that mentions it.

## 2) Why readers or revenue care

- The highest-intent Gators searches in any given week are utility queries: "Florida Gators schedule," "what time do the Gators play," "what channel is Florida Missouri on," "Florida Ole Miss score." Those queries are answered today by ESPN, Google's own sports box and floridagators.com. GatorBait has no page purpose-built to compete for them; the closest is a blog post whose title tag reads "Florida Football: 2026 Roster & Schedule | GatorBait" (`deploy/roster-schedule/resource-seo-data.json`).
- Google's Event rich results require `name`, `startDate` and `location`. Every Florida game already has all three in `sports-live/scoreboard.json` (ESPN event IDs 401856637 through 401856759), so eligibility costs nothing beyond a build step.
- The `subjectOf` link is the revenue angle: it binds each game entity to one story URL (for example the Ole Miss recap at https://www.gatorbaitmedia.com/post/postgame-analysis-florida-gators-52-ole-miss-rebel-28 and the Missouri preview at https://www.gatorbaitmedia.com/post/first-look-missouri-florida-gators-show-me-state-of-mind). That reinforces Brenden's one-canonical-article rule and gives recaps and previews an entity-level reason to be surfaced next to the game, which is when page views and ad impressions peak.
- The hub is evergreen inside the season: it refreshes weekly rather than dying like a game story, so it can accumulate links from every football story (the roster README already asks stories to link back to it) and from The Road Ahead band on the homepage.
- Why not the alternatives in the brief: FAQ and HowTo rich results were withdrawn by Google for general sites in 2023, so they are a weak bet; author-authority markup for Buddy Martin is worth doing later but is a trust signal, not a demand play. Event markup is the one that maps to real weekly search demand.
- No traffic numbers are claimed. The measurable checks are Search Console impressions for the query set above and Rich Results Test eligibility for the hub URL.

## 3) How it is built

**Files (repo, all new or additive):**

- `deploy/roster-schedule/build_schedule_schema.py`: reads `sports-live/scoreboard.json` and `deploy/roster-schedule/schedule.json`, writes `deploy/roster-schedule/schedule-jsonld.json` (an `ItemList` of 12 `SportsEvent` items plus one `SportsTeam` node). Rules: `startDate` only when ESPN carries an announced kickoff; date-only ISO string otherwise, never an invented time. `description` and `subjectOf` for finals come from the ESPN score and the `storyUrl`/`recapUrl` fields; scheduled games use `previewUrl` when set. Home games use Ben Hill Griffin Stadium, Gainesville, FL; road games use the ESPN venue string.
- `deploy/roster-schedule/resource-seo-data.json`: gains one tag of `type: "script"` with `props.type: "application/ld+json"` and the generated JSON as `children`, plus a retitled title tag ("Florida Gators 2026 Schedule, Scores and Results | GatorBait") and matching meta description. The existing canonical, OG and robots tags stay untouched.
- `deploy/dept-ideas/seo/preview.html`: the reader-facing hub layout and the markup, this folder.

**Where it lives on Wix:** the existing native blog post `aeb4f5a5-3910-4b11-9a63-b05bac96e623`, canonical URL https://www.gatorbaitmedia.com/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play. The JSON-LD goes into that post's `seoData.tags` array through the same controller-owned Blog update workflow the roster guide already uses. No new page, route, embed or loader. Wix keeps rendering its own `BlogPosting` schema; the added script is a different type, so it does not violate the no-duplicate-JSON-LD rule in `docs/ARTICLE-PAGE-STANDARD.md`.

**Data source:** ESPN via `sports-live/scoreboard.json`, refreshed by `.github/workflows/refresh-newsroom-feed.yml` and validated by `automation/validate_scoreboard.py`. Story links from `gazette-live/posts.json`.

**Sources:** ESPN via `sports-live/scoreboard.json` (updated 2026-09-29T02:17:33Z) for the 4-0 record, No. 8 rank, results (66-21 FAU, 52-3 Campbell, 44-39 at Auburn, 52-28 vs. No. 4 Ole Miss), the Missouri kickoff (2026-10-03T19:30Z, ABC, Memorial Stadium), event IDs and opponent ranks; https://www.gatorbaitmedia.com/post/postgame-analysis-florida-gators-52-ole-miss-rebel-28; https://www.gatorbaitmedia.com/post/first-look-missouri-florida-gators-show-me-state-of-mind; https://www.gatorbaitmedia.com/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play.

**Cadence:** the build runs in the existing workflow after the scoreboard step and commits `schedule-jsonld.json` only when it changes. The Wix PATCH is a controller action once per game week (after the final, and again when a kickoff or TV is announced), not every five minutes.

**Effort:** build script and tests, 3 hours; SEO tag assembly and Rich Results Test on a preview, 1 hour; controller PATCH, Search Console URL inspection and rollback note, 1 hour; optional visible schedule refresh in the post body, 2 hours. Total 5 to 7 hours, zero new services or spend.

## 4) What it needs from Brenden

1. A yes on the retitled hub ("Florida Gators 2026 Schedule, Scores and Results") and on adding the script tag to that post's SEO data. Title and description copy are his call.
2. Confirmation that the controller (Master Control) owns the Wix PATCH and the weekly refresh; this desk supplies the generated JSON and the before/after diff.
3. Agreement that the hub links only the single canonical story per game, following the Buddy Martin lead direction, so `subjectOf` never points at two recaps for one game.
4. A decision on whether The Road Ahead band should link to the hub, so homepage and hub reinforce each other.

## 5) Risks

- Google decides what to show. `SportsEvent` markup makes the page eligible for Event rich results and helps entity matching; it does not put GatorBait scores inside Google's live sports box, which is fed by Google's own data partners. Sell it as eligibility and ranking support, not a guaranteed snippet.
- Google's Event guidelines discourage marking up events the page does not primarily cover. The visible schedule table in the post must stay complete and current, which the roster README already requires.
- Stale data is worse than no data. A final that stays "scheduled" or a wrong kickoff in markup can draw a manual action. Mitigation: the build refuses to emit a time unless ESPN has one, and the weekly PATCH is gated on the validated scoreboard.
- Wix served stale embed revisions for 30 to 45 minutes on Sept. 30 (`deploy/front-page-2026/README.md`). Verify the live HTML with the Rich Results Test after each PATCH rather than assuming the tag is live.
- Kickoff windows: South Carolina on Oct. 10 is noon or 12:45 p.m. ET on ABC or SEC Network until Oct. 3 games finish (`deploy/roster-schedule/README.md`). The build must leave that game date-only until ESPN carries the final time.
- Rollback is one PATCH restoring the previous `seoData.tags` from `before.json`; keep that capture current before every change.
