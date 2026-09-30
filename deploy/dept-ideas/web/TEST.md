# Make the Call: test record (Sept. 30, 2026)

Everything below ran in the Claude Code container against the code in this folder. Nothing was deployed. Node 22.22.2, wrangler 4.144.0 (scratchpad install), Playwright 1.56.1 with Chromium 1194, Barlow and Barlow Condensed installed locally so the shots use the real faces.

## 1. Cloudflare account (MCP `Cloudflare_Developer_Platform`)

| Call | Result |
|---|---|
| `workers_list` | `{"workers":[],"count":0}` |
| `kv_namespaces_list` | `GATORBAIT_SOCIAL_KV` `b2b1b70ae87047d6ac380b9a839780ef` (not used) |
| `d1_databases_list` | `[]` before this work |
| `d1_database_create name=gatorbait-dev-make-the-call hint=enam` | `uuid 9d7f90bc-8b98-4182-a4b0-69ab0e9ddc7b`, `created_at 2026-09-30T05:15:42.615Z`, region ENAM |
| `d1_database_query` CREATE TABLE games | `success:true`, served_by v3-prod ATL, `size_after 20480` |
| `d1_database_query` CREATE TABLE picks | `success:true`, `size_after 28672` |
| `d1_database_query` CREATE TABLE rate_limits | `success:true`, `size_after 36864` |
| `d1_database_query` INSERT OR IGNORE games ... RETURNING | `{"id":"401856708","away":"Florida","home":"Missouri","kickoff":"2026-10-03T19:30:00Z","created_at":"2026-09-30T09:37:21Z"}`, `changes:1` |

The real dev D1 therefore holds the three tables from `schema.sql` and the Missouri game row. No picks were written to it.

## 2. Worker harness: `node --no-warnings deploy/dept-ideas/web/test-worker.mjs`

`worker.mjs`'s `fetch(request, env)` runs unmodified; `env.DB` is `d1-shim.mjs` (Node's built-in SQLite loaded with `schema.sql`); `env.NOW_OVERRIDE` pins the clock to 2026-09-30T20:00:00Z and, for the lock checks, to kickoff.

```
ok   GET /v1/health 200  2026-09-30T20:00:00Z
ok   OPTIONS preflight from gatorbaitmedia.com 204 + CORS  GET, POST, OPTIONS
ok   OPTIONS preflight from other origin 403, no ACAO
ok   GET game empty: count 0, six bins, not locked  public, max-age=10, s-maxage=10
ok   GET game carries ACAO + Vary
ok   GET unknown game 404
ok   POST first pick 201, yours echoed, count 1  {"fla":34,"opp":20}
ok   POST same token again 200 (update), count still 1, bin moved
ok   POST tie 422  no ties: pick a winner
ok   POST score 120 422
ok   POST fractional score 422
ok   POST bad token 422
ok   POST invalid JSON 400
ok   POST from other origin 403
ok   POST with no Origin 403
ok   POST valid pick from allowed origin 201; voter stored as a hash, never the token
ok   POST oversized body 413
ok   rate limit: 6 POSTs/min pass, 7th and 8th from same IP 429 with Retry-After  201,201,201,201,201,201,429,429 retry-after=60
ok   rate limit: IP .7 spent by its six earlier POSTs (invalid ones count)
ok   rate limit: next minute window passes again
ok   rate limit: GET budget separate from POST
ok   distribution: bins sum to count  count=49 sum=49 avg=27-20 flaShare=0.76
ok   distribution: most common call is 34-20  {"fla":34,"opp":20,"n":6}
ok   distribution: opponent name in bin labels  Florida by 14+=17 | Florida by 7-13=13 | Florida by 1-6=7 | Missouri by 1-6=6 | Missouri by 7-13=2 | Missouri by 14+=4
ok   one second before kickoff: not locked
ok   one second before kickoff: pick accepted
ok   at kickoff: GET reports locked
ok   at kickoff: POST 409 locked  2026-10-03T19:30:00Z
ok   an hour in: existing voter cannot change a pick either

picks rows=50 rate_limit rows=54 checks=29 failures=0
All Worker checks passed.
```

## 3. `wrangler dev --local` (real workerd, local D1)

```
$ wrangler d1 execute gatorbait-dev-make-the-call --local --file schema.sql --persist-to <scratchpad>/wrangler-state
$ wrangler dev --local --port 8787 --persist-to <scratchpad>/wrangler-state

$ curl -i -H "Origin: https://www.gatorbaitmedia.com" http://127.0.0.1:8787/v1/health
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: https://www.gatorbaitmedia.com
Vary: origin
access-control-allow-headers: content-type
access-control-allow-methods: GET, POST, OPTIONS
access-control-max-age: 86400
x-content-type-options: nosniff
{"ok":true,"serverTime":"2026-09-30T09:45:46Z"}

$ curl -X POST -H "Origin: https://www.gatorbaitmedia.com" -H "content-type: text/plain" \
    --data '{"gameId":"401856708","fla":31,"opp":24,"token":"wrangler_dev_token_0001"}' http://127.0.0.1:8787/v1/pick
{"ok":true,"yours":{"fla":31,"opp":24},"gameId":"401856708","away":"Florida","home":"Missouri","flaHome":false,"kickoff":"2026-10-03T19:30:00Z","locked":false,"final":null,"count":1,"avg":{"fla":31,"opp":24},"flaShare":1,"bins":[{"key":"fla14","label":"Florida by 14+","n":0,"share":0},{"key":"fla7","label":"Florida by 7-13","n":1,"share":1},...],"top":{"fla":31,"opp":24,"n":1},"serverTime":"2026-09-30T09:45:46Z"}

$ (same token, 27-24)            -> second POST same token: HTTP 200
$ (Origin: https://evil.example) -> evil origin: HTTP 403
$ curl -H "Origin: https://www.gatorbaitmedia.com" http://127.0.0.1:8787/v1/game/401856708
{"gameId":"401856708",...,"count":1,"avg":{"fla":27,"opp":24},"flaShare":1,"bins":[...,{"key":"fla1","label":"Florida by 1-6","n":1,"share":1},...],"top":{"fla":27,"opp":24,"n":1},...}
```

wrangler dev was stopped afterwards and its `.wrangler` scratch directory deleted from this folder. That run used the pre-fix build of the update check (same-second edge); the harness in section 2 is the current code.

## 4. Browser QA: `NODE_PATH=<scratchpad>/node_modules node --no-warnings deploy/dept-ideas/web/qa-module.mjs deploy/dept-ideas/web/shots`

Playwright serves `preview.html?gbm_api=live` as `https://www.gatorbaitmedia.com/` (real origin, like `sports-live/qa-front-page.mjs`), serves `module.js`, `module.css` and `sports-live/src/front-page.css` from disk, aborts every other request, and routes `https://gatorbait-make-the-call.workers.dev/**` into `worker.mjs` on the shim after seeding 48 picks through the Worker. Checks per run: one root, no horizontal overflow, nothing past the viewport, every `button`/`input` at least 44x44, no serif or Arial, section height identical at paint, after the crowd feed and after a submit, feed landed, count 48, "Most common call: Florida 34, Missouri 20", "Locks at kickoff · 2d 23h 30m", bins sum to 48; then 31 taps on the Florida plus stepper, Missouri 24, submit → "Your call: Florida 31, Missouri 24 · counted", count 49, own bin highlighted (Florida by 7-13); tie refused in place; update to 31-10 → "updated", bin moves to Florida by 14+; reload → state `set`, button "Update my call", value 31 kept, count 49. Locked run pins the clock 10 minutes after kickoff and expects the disabled form; reduced-motion run expects the same numbers without transitions.

```
ok   pick@320         h=808 count=48 avg=28–22 fla=71% state=pick lock="Locks at kickoff · 2d 23h 30m" 
ok   pick@390         h=799 count=48 avg=28–22 fla=71% state=pick lock="Locks at kickoff · 2d 23h 30m" 
ok   pick@430         h=799 count=48 avg=28–22 fla=71% state=pick lock="Locks at kickoff · 2d 23h 30m" 
ok   pick@1365        h=536 count=48 avg=28–22 fla=71% state=pick lock="Locks at kickoff · 2d 23h 30m" 
ok   locked@390       h=799 count=48 avg=28–22 fla=71% state=locked lock="Picks locked at kickoff" 
ok   reduced-motion@390 h=799 count=48 avg=28–22 fla=71% state=pick lock="Locks at kickoff · 2d 23h 30m" 

API calls served by worker.mjs during the browser run: 21
All Make the Call module checks passed.
```

Screenshots: `shots/call-pick-320.png`, `call-pick-390.png`, `call-pick-430.png`, `call-pick-1365.png`, `call-locked-390.png`, `call-reduced-motion-390.png` (full page, taken after the interaction, so they show the device's own call and 49 calls in).

## 5. Not tested

- The Worker against the real dev D1 over the network (`wrangler dev --remote` or a deploy): Jarvis's step.
- Physical iPhone/Android; these are Chromium viewport emulations.
- `node sports-live/qa-front-page.mjs` was not rerun because `sports-live/src` is untouched; the module is not yet mounted from `front-page.js` (three lines, see `module.js` header).
