# Sport hub template (Nov. 3, 2026)

One engine, one config per sport. Each hub mounts as a header module above the News Wire on that sport's Wix blog category route. It only adds: the native post list and the News Wire stay in the DOM and are never touched.

- Engine: `sports-live/src/sport-hub.js`. Config and snapshot per sport: `tools/sport-hub/hubs.mjs`. Build: `node tools/sport-hub/build-sport-hub.mjs <hub> [--fetch]` writes `sports-live/sport-hub-<key>.js` (ASCII only). `--fetch` refreshes ESPN JSON only; FloridaGators.com pages are scraped once with Firecrawl and cached in `sports-live/hub-data/` (`tools/sport-hub/parse-roster-md.mjs` turns a roster scrape into JSON).
- Loader: `loader.template.html` + `node tools/sport-hub/make-loader.mjs <hub> <40-hex merge sha>`. One Wix custom embed per hub (HEAD, loadOnce false, ESSENTIAL), pinned to an immutable jsDelivr commit. The loader uses `fastly.jsdelivr.net` (cdn.jsdelivr.net returned 403 "Package size exceeded" for fresh commits).
- First paint is complete: data is inlined, the hub mounts in the same task the native list appears (MutationObserver), every image has fixed dimensions, and live updates only swap text in place. Stories load after mount into six reserved slots.
- Data rules: ESPN or FloridaGators.com only; a missing field is left out. Headshots link to floridagators.com's image host (alt text `Name, Florida position`) with a footer credit line (docs/PHOTO-ATTRIBUTION.md); nothing is re-hosted.
- Rollback for any hub: PATCH its loader embed `enabled:false`. The category page returns to the native list and News Wire.

## Live hubs

(Filled in as each ships; see issue #34 for evidence.)
