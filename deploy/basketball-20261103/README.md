# Gator Basketball hub (Nov. 3, 2026)

Route: no basketball page exists (/basketball and /gator-basketball are 404). The hub mounts above the News Wire (`#gbm-np`, embed 29d559b0, untouched) on `/gatorbait-media-blogs/categories/gator-basketball`. Blank page route to add later: `/gator-basketball` (change the route regex in the loader and in `sports-live/src/basketball.js`).

- Data: ESPN only. Snapshot `sports-live/florida-basketball.json` is inlined in the bundle; ESPN schedule, rankings and SEC standings are re-read live on every load, plus the scoreboard header feed (30 s poll only while a game is live or within 90 minutes of tipoff, 480 polls max). Roster is the snapshot.
- Build: `node tools/basketball/build-basketball.mjs --fetch` (refresh snapshot) then the same without `--fetch`. Output `sports-live/basketball-widget.js`, ASCII only.
- Loader: `loader.template.html`, Wix custom embed (HEAD, loadOnce false, ESSENTIAL) pinned to an immutable jsDelivr commit; exactly 2 occurrences of the SHA.
- LIVE: embed `88f4438b-e4a9-46ff-8f0f-66da381cce0c`, 1,044 chars, pinned to merge SHA `8462d25965b9c89cbf4caa3a8aec4e98868a661f`; bundle SHA-256 `8000d22d5e0d19b2509b253ad79acb592fa868e0e1dd40aa4acd80d33f53b28f`. The loader uses `fastly.jsdelivr.net` because `cdn.jsdelivr.net` answered 403 "Package size exceeded the configured limit of 50 MB" for this fresh commit while the fastly and gcore hosts served the exact file.
- Note: the site-light script forces any dark-background element to white, so the hub is light-first (navy text, orange accents).
- Rollback: PATCH the loader embed `enabled:false`; the category page returns to the News Wire alone.
