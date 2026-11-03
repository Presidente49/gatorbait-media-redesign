# Gator Basketball hub (Nov. 3, 2026)

Route: no basketball page exists (/basketball and /gator-basketball are 404). The hub mounts above the News Wire (`#gbm-np`, embed 29d559b0, untouched) on `/gatorbait-media-blogs/categories/gator-basketball`. Blank page route to add later: `/gator-basketball` (change the route regex in the loader and in `sports-live/src/basketball.js`).

- Data: ESPN only. Snapshot `sports-live/florida-basketball.json` is inlined in the bundle; ESPN schedule, rankings and SEC standings are re-read live on every load, plus the scoreboard header feed (30 s poll only while a game is live or within 90 minutes of tipoff, 480 polls max). Roster is the snapshot.
- Build: `node tools/basketball/build-basketball.mjs --fetch` (refresh snapshot) then the same without `--fetch`. Output `sports-live/basketball-widget.js`, ASCII only.
- Loader: `loader.template.html`, Wix custom embed (HEAD, loadOnce false, ESSENTIAL) pinned to an immutable jsDelivr commit; exactly 2 occurrences of the SHA.
- Note: the site-light script forces any dark-background element to white, so the hub is light-first (navy text, orange accents).
- Rollback: PATCH the loader embed `enabled:false`; the category page returns to the News Wire alone.
