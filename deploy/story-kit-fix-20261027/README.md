# Story Kit fix, Oct. 27, 2026: no Stats links while the page 404s, no name links to search

Owner-approved; Jarvis (Claude Code) as production writer. Claim: issue #34 comment 6444272408.

## What was wrong (live read, Oct. 27, 14:1xZ)

- The Story Kit's "Florida Stats" card, the "Stats" chip in the GatorBait Guide strip and the first-mention "stats" word link all point at `/florida-football-stats`, which answers HTTP 404 (HEAD and GET).
- The publishing SEO layer wrapped the first mention of twelve Florida names in a same-tab link to `/search-results?q=<name>`, which also answers 404, pulling readers off the article (Franz Oct. 27: 1 link; Brenden Oct. 27: 3).
- The code is not in the post template embed `14a887e3` (rev 27, 14,935 chars, fp 4063019010); it is `sports-live/share.js`, which the Share loader embed `f285a38c` (rev 4) pins by commit on jsDelivr.

## What changed (`sports-live/src/story-kit.js`, rebuilt into `sports-live/share.js`)

1. Every Stats link carries `.gbm-kit-stats` and is hidden (`[hidden]`, `display:none`) unless one same-origin `HEAD` of `LINKS.stats` per session answered OK; the verdict is cached in `sessionStorage` key `gbm-kit-stats` (`1`/`0`). The links come back on their own when the stats page goes live; no code change is needed then. The desktop card grid is `repeat(auto-fit, minmax(180px, 1fr))` so two cards fill the row instead of leaving an empty third column.
2. The name auto-linker (`PEOPLE`, `people()`, `a.gbm-kit-person`) is removed. Names are plain text; writers' own links are untouched (alt-text and table semantics in that layer stay).
3. `VERSION` is `story-kit-2026.2`.

Only `sports-live/src/story-kit.js` and `sports-live/share.js` change; the other build outputs were restored. The post template `14a887e3` is untouched.

## Live change

One PATCH of Share loader `f285a38c`, rev 4 → 5, pinning this PR's head commit with `c155975` (the previous pin) as the fallback. Category `ESSENTIAL` re-sent; enabled, HEAD, `loadOnce:false` unchanged. No site publish.

## Rollback

`rollback/share-loader-rev4.json` is the exact rev-4 loader (680 chars, fp 275025757); re-PATCH its `embedData.html` with category `ESSENTIAL` at the then-current revision. `rollback/14a887e3-rev27.html` is the exact post template at rev 27 (14,935 chars, fp 4063019010), kept because the claim covered that object; it was not changed.

## Verification

`qc.mjs` (scratch) loads both Oct. 27 posts (`3e8ceb63`, `ab92eaf5`) cache-busted at 390/430/1366/1920 and records: bundle commit, `a.gbm-kit-person` and `search-results` link counts, visible/hidden Stats links, visible cards and chips, writers' link hrefs (compared before vs. after), card boxes and document overflow. Candidate run (real origin, candidate bundle substituted): 0 name/search links, Stats chip and card hidden with the verdict cached, two cards at 345 px each on desktop, no overflow, writers' links unchanged. The live run after the pin is recorded in issue #34.
