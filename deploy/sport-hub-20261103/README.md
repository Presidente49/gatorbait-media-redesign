# Sport hub template (Nov. 3, 2026)

One engine, one config per sport. Each hub mounts as a header module above the News Wire on that sport's Wix blog category route. It only adds: the native post list and the News Wire stay in the DOM and are never touched.

- Engine: `sports-live/src/sport-hub.js`. Config and snapshot per sport: `tools/sport-hub/hubs.mjs`. Build: `node tools/sport-hub/build-sport-hub.mjs <hub> [--fetch]` writes `sports-live/sport-hub-<key>.js` (ASCII only). `--fetch` refreshes ESPN JSON only; FloridaGators.com pages are scraped once with Firecrawl and cached in `sports-live/hub-data/` (`tools/sport-hub/parse-roster-md.mjs` turns a roster scrape into JSON).
- Loader: `loader.template.html` + `node tools/sport-hub/make-loader.mjs <hub> <40-hex merge sha>`. One Wix custom embed per hub (HEAD, loadOnce false, ESSENTIAL), pinned to an immutable jsDelivr commit. The loader uses `fastly.jsdelivr.net` (cdn.jsdelivr.net returned 403 "Package size exceeded" for fresh commits).
- First paint is complete: data is inlined, the hub mounts in the same task the native list appears (MutationObserver), every image has fixed dimensions, and live updates only swap text in place. Stories load after mount into six reserved slots.
- Data rules: ESPN or FloridaGators.com only; a missing field is left out. Headshots link to floridagators.com's image host (alt text `Name, Florida position`) with a footer credit line (docs/PHOTO-ATTRIBUTION.md); nothing is re-hosted.
- Rollback for any hub: PATCH its loader embed `enabled:false`. The category page returns to the native list and News Wire.

## Live hubs (Nov. 3, 2026; evidence and rollback in issue #34)

| Hub | Route (under `/gatorbait-media-blogs/categories/`) | Embed id | Pinned merge SHA |
|---|---|---|---|
| Football | `gator-football` | `c193642f-9a9a-4adb-bd3f-b59fcc6f7ec0` | `294d7c48b1990268cac69c80c3e1266ec37f76d7` |
| Women's basketball (new category `c4a75a11-a60e-480f-9a15-d88c894d7ac6`) | `gator-womens-basketball` | `57a3da8f-d1b6-4f7d-87b8-4d6d16472c52` | `9cfca9c692d80ee2223ae74f18f4591926574b0b` |
| Men's basketball (own bundle, `deploy/basketball-20261103/`) | `gator-basketball` | `88f4438b-e4a9-46ff-8f0f-66da381cce0c` | `66b491b55f8fcab1d7c6d55bf6fc8b5bc9d1b7b3` |
| Gymnastics | `gator-gymnastics` | `1dc6f0b2-5561-493f-b3d5-8b73fa876657` | `849daf63431fa5039b20ce4894ec154afc71dd67` |

Rollback for any row: PATCH the embed with `enabled:false` at its current revision. Baseball and softball have category routes but no verified 2027 schedule or roster yet; add one entry to `tools/sport-hub/hubs.mjs` plus two cached FloridaGators.com scrapes per sport.

## Keeping data fresh (FloridaGators.com first, ESPN second)

- Football stats: `node tools/sport-hub/fetch-uf-football-stats.mjs` (plain curl of UF's cume.pdf, no credits), commit `sports-live/hub-data/football-uf-stats.json`, merge. Roster and availability stay in `sports-live/florida-roster.json`. Both are re-read from GitHub Pages on every load, no re-pin.
- Women's basketball stats: re-scrape `https://floridagators.com/sports/womens-basketball/stats`, update `sports-live/hub-data/womens-basketball-uf-stats.json` (same shape), merge. The build warns when ESPN lists more final games than UF has cached.
- Rosters and gymnastics schedule are cached scrapes; re-scrape only when UF changes them, then rebuild and re-pin the loader.
- ESPN supplies schedule, rankings and the live score feed (`site.web.api.espn.com`, allowed in browsers).
