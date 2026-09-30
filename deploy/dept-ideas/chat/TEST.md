# The Stands — local test run

- Date: 2026-09-30T09:42:33.617Z
- Mode: wrangler dev (workerd, SQLite-backed Durable Object), local only, nothing deployed
- Versions: node v22.22.2, wrangler 4.144.0, workerd 1.20260926.1, playwright 1.56.1, ws 8.22.0
- Result: 21 passed, 0 failed

## Screenshots

- shots/stands-390-live.png (154,184 bytes)
- shots/stands-1365-live.png (80,373 bytes)
- shots/stands-390-quiet.png (139,647 bytes)
- shots/stands-1365-quiet.png (71,207 bytes)

## Console output

```
[  2.1s] wrangler dev is up at http://127.0.0.1:8787 (workerd, SQLite Durable Object)
[  2.1s] room game-2026-10-03; scoreboard.json updatedAt 2026-09-29T02:17:33Z; real kickoff 2026-10-03T19:30:00Z (Missouri, ABC)
[  2.2s] PASS kickoff lock window computed from scoreboard.json — 2026-10-03T19:30:00.000Z to 2026-10-03T19:35:00.000Z
[  2.2s] PASS room open + lock active one minute after kickoff — {"open":true,"lock":true,"why":"game"}
[  2.4s] PASS two browsers joined; presence count reached 2 — TailgateTina · 2 in the room
[  2.5s] PASS kickoff lock: reader blocked for the first five minutes — Members only for the first 5 minutes after kickoff.
[  2.5s] PASS lock lifts ten minutes after kickoff
[  2.5s] PASS desk can hold the room open with the real scoreboard on the strip
[  2.5s] PASS reader post fans out to the other browser
[  2.6s] PASS member post fans out with the Member badge
[  2.6s] PASS slow mode: second reader post inside 30 s refused, input locked — Slow mode: 30 s to go.
[  2.6s] PASS word filter masks on the server, member not slowed
[  2.7s] PASS poster told a word was masked
[  2.9s] saved shots/stands-390-live.png and shots/stands-1365-live.png
[  3.0s] PASS one-tap report acknowledged
[  3.0s] PASS three reports hide the post everywhere
[  3.0s] PASS moderator queue lists the hidden post — 3 reports, 1 hidden
[ 32.6s] PASS member-only mode blocks readers
[ 35.2s] PASS ring buffer holds 200 after 210 more posts — 200 stored
[ 35.2s] PASS bad token refused at the socket — HTTP 401
[ 36.0s] PASS links from readers refused
[ 36.0s] PASS real scoreboard restored: room closed until game day
[ 36.2s] saved shots/stands-390-quiet.png and shots/stands-1365-quiet.png (countdown to kickoff, no empty feed)
[ 36.2s] PASS quiet state (score, countdown, no input) shown when the room is closed
[ 36.2s] PASS no browser console errors
```

## wrangler output (trimmed)

```
▲ [WARNING] Proxy environment variables detected. We'll use your proxy for fetch requests.
[wrangler:warn] Unable to fetch the `Request.cf` object! Falling back to a default placeholder...
Error: Request was cancelled.
    at new DOMException (node:internal/per_context/domexception:76:18)
    at makeAppropriateNetworkError (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/response.js:488:38)
    at httpNetworkFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:1971:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async httpNetworkOrCacheFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:1600:29)
    at async httpFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:1142:33)
    at async mainFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:596:20)
[wrangler:warn] Unable to fetch the `Request.cf` object! Falling back to a default placeholder...
Error: Request was cancelled.
    at new DOMException (node:internal/per_context/domexception:76:18)
    at makeAppropriateNetworkError (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/response.js:488:38)
    at httpNetworkFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:1971:14)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async httpNetworkOrCacheFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:1600:29)
    at async httpFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:1142:33)
    at async mainFetch (/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/undici/lib/web/fetch/index.js:596:20)
[wrangler:info] Ready on http://127.0.0.1:8787
[wrangler:info] GET / 200 OK (9ms)
[wrangler:info] POST /room/game-2026-10-03/mod 200 OK (44ms)
[wrangler:info] POST /room/game-2026-10-03/mod 200 OK (7ms)
[wrangler:info] GET /token 200 OK (3ms)
[wrangler:info] GET /room/game-2026-10-03/ws 101 Switching Protocols (6ms)
```
