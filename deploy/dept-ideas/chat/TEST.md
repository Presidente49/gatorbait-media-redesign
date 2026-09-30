# The Stands — local test run

- Date: 2026-09-30T09:39:27.942Z
- Mode: wrangler dev (workerd, SQLite-backed Durable Object), local only, nothing deployed
- Versions: node v22.22.2, wrangler 4.144.0, workerd 1.20260926.1, playwright 1.56.1, ws 8.22.0
- Result: 4 passed, 1 failed

## Screenshots



## Console output

```
[  2.8s] wrangler dev is up at http://127.0.0.1:8787 (workerd, SQLite Durable Object)
[  3.0s] room game-2026-10-03; scoreboard.json updatedAt 2026-09-29T02:17:33Z; real kickoff 2026-10-03T19:30:00Z (Missouri, ABC)
[  3.2s] PASS kickoff lock window computed from scoreboard.json — 2026-10-03T19:30:00.000Z to 2026-10-03T19:35:00.000Z
[  3.2s] PASS room open + lock active one minute after kickoff — {"open":true,"lock":true,"why":"game"}
[  3.6s] PASS two browsers joined; presence count reached 2 — TailgateTina · 2 in the room
[ 33.7s] FAIL run completed without an exception — page.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('[data-gbs="msg"]')[22m
[2m    - locator resolved to <input data-gbs="msg" maxlength="240" autocomplete="off" aria-label="Message" placeholder="Say something, Gators"/>[22m
[2m    - fill("Go Gators")[22m
[2m  - attempting fill action[22m
[2m    2 × waiting for element to be visible, enabled and editable[22m
[2m      - element is not visible[22m
[2m    - retrying fill action[22m
[2m    - waiting 20ms[22m
[2m    2 × waiting for element to be visible, enabled and editable[22m
[2m      - element is not visible[22m
[2m    - retrying fill action[22m
[2m      - waiting 100ms[22m
[2m    60 × waiting for element to be visible, enabled and editable[22m
[2m       - element is not visible[22m
[2m     - retrying fill action[22m
[2m       - waiting 500ms[22m

    at send (/home/user/gatorbait-media-redesign/deploy/dept-ideas/chat/test.mjs:99:45)
    at /home/user/gatorbait-media-redesign/deploy/dept-ideas/chat/test.mjs:101:9
[ 33.7s] PASS no browser console errors
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
[wrangler:info] GET / 200 OK (660ms)
[wrangler:info] POST /room/game-2026-10-03/mod 200 OK (189ms)
[wrangler:info] POST /room/game-2026-10-03/mod 200 OK (8ms)
[wrangler:info] GET /token 200 OK (12ms)
[wrangler:info] GET /room/game-2026-10-03/ws 101 Switching Protocols (8ms)
```
