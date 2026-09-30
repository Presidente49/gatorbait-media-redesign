# Make the Call

## The idea

A score-pick module under The Road Ahead on the front page: a fan types Florida's score and Missouri's score, taps Lock my call, and sees Gator Nation's live distribution (calls in, the crowd's average score, the share picking Florida, six margin bins and the most common exact call). Picks lock at kickoff, one call per device with no account, and the whole thing runs on a Cloudflare Worker with a D1 database that exists in the account today and is exercised end to end by tests in this folder. Round one's Read Next is dropped; the fans desk's round-one Make the Call name survives because it now runs on a real backend.

## Why it matters

- It is the first thing on gatorbaitmedia.com a reader does instead of reads, and it renews itself: Missouri on Sat., Oct. 3, 3:30 p.m. ET (ABC), then South Carolina, at Texas, at Georgia. The game comes from `sports-live/scoreboard.json` (ESPN event 401856708), so the module follows the schedule with no data entry.
- The crowd number is content. "Gator Nation's call: Florida 28, Missouri 22, 71 percent pick Florida" is a line for Buddy's Friday column and the show, measured, not guessed. (Those figures are from the local test crowd in `recorded.json`, not real fans.)
- A pick is a reason to return Saturday night and again next week. Wix Analytics' returning-visitor share measures that from week one.
- Cost of running it: Cloudflare's free Workers and D1 tiers cover a game Saturday (the Worker caches the crowd read for 10 seconds at the edge; writes are one row per fan). No new repo, scheduler or renderer: `module.js` mounts from `front-page.js` with three lines, listed in its header.

## Evidence

Cloudflare Developer Platform (read-only proofs, then one reversible create):
- `workers_list` → `{"workers":[],"count":0}` (no Worker deployed; nothing touched).
- `kv_namespaces_list` → one namespace, `GATORBAIT_SOCIAL_KV` (`b2b1b70ae87047d6ac380b9a839780ef`). KV was not used: its free tier allows 1,000 writes a day.
- `d1_databases_list` → empty before this work.
- `d1_database_create` → **`gatorbait-dev-make-the-call`, id `9d7f90bc-8b98-4182-a4b0-69ab0e9ddc7b`**, region ENAM, created 2026-09-30T05:15:42Z. Reversible; delete it if the idea is not wanted.
- `d1_database_query` x4 on that id: `CREATE TABLE games`, `picks`, `rate_limits` (each `success:true`, served by v3-prod ATL, `changed_db:true`), then the seed `INSERT ... RETURNING` → `{"id":"401856708","away":"Florida","home":"Missouri","kickoff":"2026-10-03T19:30:00Z","created_at":"2026-09-30T09:37:21Z"}`. Schema in `schema.sql`.
- `search_cloudflare_documentation` (D1 Worker API): `batch()` runs as one transaction, which is how the Worker tells a first pick (201) from an update (200).

Local proof (full output in `TEST.md`):
- `node deploy/dept-ideas/web/test-worker.mjs`: executes `worker.mjs`'s fetch handler against an in-memory D1 shim (`d1-shim.mjs`, Node's built-in SQLite, same schema file). **29 of 29 checks pass**: health, CORS preflight allowed for gatorbaitmedia.com and refused for another origin, six-bin distribution, 201 first pick and 200 update, tie/range/token/JSON/body-size rejections, 403 without an allowed Origin, 6 POSTs a minute per IP then 429 with Retry-After, lock at kickoff (409) and after, tokens stored only as SHA-256 hashes. It writes `recorded.json` and plants that response into `preview.html`.
- `wrangler dev --local` (wrangler 4.144.0 installed in the scratchpad, real workerd, local D1 loaded from `schema.sql` with `wrangler d1 execute --local`): curl got `/v1/health` 200 with the CORS headers, a first pick, a same-token update as HTTP 200, a cross-origin POST as 403, and the distribution GET. Nothing was deployed; the `.wrangler` scratch directory was removed.
- `node deploy/dept-ideas/web/qa-module.mjs`: Playwright serves `preview.html` as `https://www.gatorbaitmedia.com/` and routes every API call from the browser into `worker.mjs` on the shim. **6 of 6 runs pass** at 320, 390, 430 and 1365, plus a locked (after kickoff) and a reduced-motion run: no horizontal overflow, every button and input at least 44 px, Barlow only, the section's height identical at paint, after the crowd loads and after a submit (no jump), 48 seeded calls shown, the steppers and submit produce "Your call: Florida 31, Missouri 24 · counted" and the count rises to 49, a tie is refused in place, an update returns "updated", and after a reload the device still shows its call. 21 Worker requests served during the browser run. Screenshots in `shots/`.

Files: `worker.mjs` (9.1 KB), `schema.sql`, `wrangler.toml`, `module.js` (12.2 KB), `module.css` (7.9 KB), `d1-shim.mjs`, `test-worker.mjs`, `qa-module.mjs`, `recorded.json`, `preview.html` (4.4 KB; loads the module against the recorded Worker response, or the live Worker code with `?gbm_api=live`), `TEST.md`, `shots/`.

## What it needs from Brenden

1. A yes on one additive section under The Road Ahead. The homepage look lock was lifted Sept. 29; this is still a visible front-page change and goes through Jarvis with a rollback (the three-line mount in `front-page.js` comes out as one commit).
2. Jarvis deploys the Worker: `wrangler deploy` from this folder with `wrangler.toml` as written (it binds the dev D1 above; or create a production D1, apply `schema.sql`, change one id). Then set the module's API constant (or `window.__GBM_CALL_API__` in the loader) to the workers.dev URL. Until then the module paints with dashes and no error: nothing jumps.
3. Confirm the rules: no ties, one call per device, edits until kickoff, 6 posts a minute per IP. Say whether the crowd figures should hide below a threshold (today the line reads "Early returns" under five calls).
4. Ten seconds on Wednesday's show: "Call the score at gatorbaitmedia.com." The kickoff in `games` must be updated by hand if ESPN moves a game time; one SQL line.

## Risks

- No account means a fan with several devices can make several calls. Mitigation: per-IP rate limits, hashed tokens, no prizes without a separate verification step. The number is a crowd meter, not a contest.
- A quiet week looks quiet. Mitigation: the threshold in item 3 and show promotion before Missouri.
- The final-score column exists in `games` but nothing scores picks yet; "you got it right" is a follow-up, not this pitch.
- The homepage would call a workers.dev origin. It already fetches presidente49.github.io; CORS is limited to gatorbaitmedia.com and the Worker never sets cookies. If the Worker is down, the module shows dashes and the form reports "No connection"; the front page itself is unaffected.
- Cloudflare's free D1 daily limits are generous for this traffic, but a viral Saturday would need the paid Workers plan; that decision is Brenden's, not automatic.
- Device time can disagree with the server. The server is the lock authority: a stale page gets a 409 and locks itself.
