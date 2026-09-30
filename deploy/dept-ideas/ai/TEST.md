# Ask GatorBait: local test record (Sept. 30, 2026)

Nothing was deployed. No Wix, Cloudflare, GitHub or email writes.

## 1. Cloudflare access (read-only MCP calls)

| Call | Result |
|---|---|
| `mcp__Cloudflare_Developer_Platform__workers_list` | `{"workers":[],"count":0}` (no Workers in the account yet) |
| `mcp__Cloudflare_Developer_Platform__kv_namespaces_list` | one namespace: `GATORBAIT_SOCIAL_KV`, id `b2b1b70ae87047d6ac380b9a839780ef` |

Workers AI needs no API key on the account; the `[ai] binding = "AI"` in `wrangler.toml` is all the Worker uses. The KV namespace for this Worker (`ASK_GATORBAIT_KV`) is not created; `wrangler.toml` carries a placeholder id.

## 2. Build the index

```
$ node deploy/dept-ideas/ai/build-index.mjs
index.json: 20 stories, 16 scoreboard docs, 15 history facts, 16 trivia questions, 535 terms
```

Inputs: `gazette-live/posts.json` (20 stories, title + excerpt + author + date only), `sports-live/scoreboard.json` (record, next game, 12 games, quarter scores, SEC standings), `history.json` (15 cited facts, 12 curated trivia questions; 4 more score questions are generated from finals in the feed).

## 3. `wrangler dev` (wrangler 4.144.0, local)

`wrangler dev` started, resolved the bindings and then refused because Workers AI is a remote-only binding:

```
Binding                                       Resource        Mode
env.ASK_KV (REPLACE_WITH_NEW_NAMESPACE_ID)    KV Namespace    local
env.AI                                        AI              remote
⎔ Establishing remote connection...
✘ [ERROR] Failed to start the remote proxy session. Error reloading remote server: In a non-interactive
environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
[agent-proxy] workers.cloudflare.com:443 — connect_rejected (organization policy)
```

So Workers AI cannot run offline here (expected). The Worker's fetch handler was therefore run in Node with a stub AI binding and an in-memory KV, which exercises every real code path except the model call itself.

## 4. Node harness (`test/harness.mjs`)

The stub model reads the numbered sources out of the real prompt and answers from source [1]; two extra modes return a hallucinated stat and a refusal. Clock fixed at Wed., Sept. 30, 2026, 10 a.m. ET.

```
$ node deploy/dept-ideas/ai/test/harness.mjs
PASS  GET /health  -> 20 stories, 16 scoreboard, 15 history, 16 trivia
PASS  OPTIONS preflight from gatorbaitmedia.com  -> https://www.gatorbaitmedia.com
PASS  POST /ask from a foreign origin is refused  -> status 403
PASS  DEV_ORIGINS allows a local origin  -> http://localhost:8788
PASS  retrieve() ranks the scoreboard "next game" doc first  -> sb:next:9.25, story:put-down-the-poll-gators-missouri-is-waiting-and-there-s-a-new-definition-for-one-game-at-a-time:4.27, story:postgame-analysis-florida-gators-52-ole-miss-rebel-28:3.76, story:bound-for-the-cfb-top-ten-cue-up-happy-days-are-here-again:2.45, hist:swamp:2.39
PASS  prompt contains only the numbered sources + the grounding rule
PASS  history retrieval: Heisman 2007 -> Tebow fact
PASS  story retrieval: injury question -> MRI story  -> story:breaking-vernell-brown-mri-grade-1-pcl-sprain-florida-gators
PASS  POST /ask "When is the next game?"  -> Florida's next game is on the road at No. 25 Missouri on Saturday, Oct. 3, 2026 at 3:30 p.… | source: Next game: at Missouri
PASS  POST /ask "Who won the Heisman for Florida?"  -> Danny Wuerffel won the Heisman Trophy in 1996, the same season Florida won its first natio… | source: Heisman Trophy Danny Wuerffel 1996
PASS  POST /ask "How did the Ole Miss game go?"  -> How The Gators Sealed And Secured A 52-28 Rout Of No. 4 Ole Miss With a Pick, Again. Eddie… | source: How The Gators Sealed And Secured A 52-28 Rout Of No. 4 Ole Miss With a Pick, Again
PASS  POST /ask "What is the injury news?"  -> BREAKING: MRI Confirms Grade 1 PCL Sprain for Gators WR Vernell Brown III. An MRI confirme… | source: BREAKING: MRI Confirms Grade 1 PCL Sprain for Gators WR Vernell Brown III
PASS  POST /ask "How many national championships does Florida have?"  -> Florida won the 2008 BCS National Championship, beating Oklahoma 24-14 on Jan. 8, 2009, in… | source: national championship 2008
PASS  number guard rejects "412 yards" (not in any source)  -> unsourced-number
PASS  model refusal is passed through as a refusal
PASS  off-topic question refused with NO model call  -> no-sources; top hit coverage 0.33
PASS  guardAnswer accepts figures that are in the sources
PASS  too-short question -> 400
PASS  GET /trivia/today  -> How many football SEC championships does Florida recognize?
PASS  same question all day (KV trivia:2026-09-30)  -> t-sec-count
PASS  streak from yesterday carries into today  -> streak 2
PASS  POST /trivia/answer correct -> streak 3 + share line  -> Gator Trivia, Sept. 30: Correct. Streak: 3 days. Play at gatorbaitmedia.com/ask
PASS  second answer the same day does not change the result
PASS  wrong answer (other visitor) -> streak 0  -> Gator Trivia, Sept. 30: Missed it. Streak: 0 days. Play at gatorbaitmedia.com/ask
PASS  out-of-range choice -> 400
PASS  9th /ask in a minute from one IP -> 429  -> Retry-After 60
PASS  a different IP is unaffected
PASS  KV keys never contain a raw IP

28 passed, 0 failed. Model calls made to the stub: 17. KV keys: 18.
```

What that proves, end to end:
- **Retrieval**: BM25 over `index.json` with a small synonym map and a 14-day recency boost for stories. "Next game" hits the scoreboard doc first; "Heisman 2007" hits the Tebow fact; "Vernell Brown" hits the MRI story.
- **Grounding**: the prompt contains only the numbered sources plus the rule to answer from them or refuse. A **number guard** rejects any figure in the model's answer that is not in the retrieved sources ("412 yards" was thrown out). A **coverage gate** refuses without calling the model when fewer than half the question's words appear in the top source ("best pizza in Gainesville": 0 model calls).
- **Trivia**: one question per ET day, deterministic pick stored under `trivia:<ymd>` (editors can overwrite it in KV), one answer per visitor per day, streak carried from yesterday, share line `Gator Trivia, Sept. 30: Correct. Streak: 3 days. Play at gatorbaitmedia.com/ask`.
- **Rate limits**: 8 asks a minute and 60 a day per salted-hashed IP (429 + Retry-After); no raw IP ever lands in KV.
- **CORS**: preflight for gatorbaitmedia.com, 403 for a foreign origin, `DEV_ORIGINS` for local work.

## 5. Client screenshots (Playwright, chromium)

`preview.html` mounts the real `client.js` in a stand-in Swamp Night shell and replays `recorded.json` (the harness's actual responses) through `window.__GBM_ASK_TRANSPORT__`.

```
$ NODE_PATH=<scratchpad>/node_modules node deploy/dept-ideas/ai/test/shots.mjs
390-ask: section 390x994, horizontal overflow: false, answers on page: 2
390-trivia: section 390x765, horizontal overflow: false, answers on page: 2
1365: section 1365x747, horizontal overflow: false, answers on page: 2
```

Also checked at 320, 390 and 430: no horizontal overflow, input font 16px (no iOS zoom), share line renders. Shots: `shots/390-ask.png`, `shots/390-trivia.png`, `shots/1365.png`.

## Not proven here
- The live model's tone and citation discipline (needs one deployed run with `@cf/meta/llama-3.1-8b-instruct`).
- KV counters are eventually consistent, so the per-minute limit is soft; a Durable Object or the Rate Limiting binding would make it exact.
