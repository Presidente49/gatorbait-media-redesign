# Ask GatorBait

## The idea
A free chat box on gatorbaitmedia.com, no account, that answers Gators questions from our own material and nothing else: the story feed (`gazette-live/posts.json`), the ESPN scoreboard feed (`sports-live/scoreboard.json`) and a small, cited Gators history file. Every answer links the story or feed it came from. If the question is not covered, it says so instead of guessing. Next to it, **Gator Trivia**: one question a day, a streak, and a one-line result you can paste into the group chat.

It runs on Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct` through the AI binding, no API key) with one KV namespace for the daily question, per-visitor trivia state and rate limits. The client is one section (`.fp-ask`) that drops into the existing `#gbm-live` shell after The Tunnel, in Barlow and the Swamp Night tokens, phone-first.

Brenden's words: "That one AI chat out on like the site that would answer questions or like provide like a trivia question." This is that, built to the benchmark's Big Red Chat line (free, no account, knows the team), with the guardrails a publication needs.

## Why it matters
- **It turns the archive into a front door.** A fan asks "what's the injury news?" and gets the Vernell Brown MRI story with a link; "when's the next game?" gets Missouri, Sat., Oct. 3, 3:30 p.m. ET, ABC, with the first-look story. Every answer is a click into our own reporting.
- **A daily reason to come back.** One trivia question at midnight ET, a streak to protect, a share line that carries `gatorbaitmedia.com/ask`. It costs nothing to keep running and the editors can swap tomorrow's question by writing one KV key.
- **Trust is the product.** The paid sites sell insider access; we cannot outspend them, but we can be the Gators answer box that never invents a stat. The Worker enforces that in code (number guard, coverage gate, refusal text), not in a prompt alone.
- **It uses what is already built.** The same two feeds that paint the homepage feed the index; `build-index.mjs` runs after the scoreboard and newsroom jobs and the answers stay current without anyone touching a model.

## Evidence
Tool calls (read-only, both made this session):
- `mcp__Cloudflare_Developer_Platform__workers_list` → `{"workers":[],"count":0}`. The account has no Workers yet; Workers AI is available on the account plan with no key.
- `mcp__Cloudflare_Developer_Platform__kv_namespaces_list` → one namespace, `GATORBAIT_SOCIAL_KV`, id `b2b1b70ae87047d6ac380b9a839780ef`. Not reused; this Worker wants its own `ASK_GATORBAIT_KV`.

What was built and run (all in `deploy/dept-ideas/ai/`, details in `TEST.md`):
- `build-index.mjs` ran: 20 stories, 16 scoreboard docs, 15 cited history facts, 16 trivia questions → `index.json`.
- `worker.mjs`: `/ask`, `/trivia/today`, `/trivia/answer`, `/health`; BM25 retrieval, grounded prompt, number guard, coverage gate, per-IP limits (8/min, 60/day, salted hash only), CORS for gatorbaitmedia.com.
- `wrangler dev` (4.144.0) resolved the AI and KV bindings, then refused because the AI binding is remote-only and needs `CLOUDFLARE_API_TOKEN` in a non-interactive shell (exact text in TEST.md). So the handler was run in Node with a stub AI binding: **28 of 28 checks passed**, including the guard throwing out a made-up "412 yards", an off-topic question refused with zero model calls, one-answer-per-day trivia with a 3-day streak and share line, and a 429 on the ninth ask in a minute.
- `client.js` mounted in a stand-in Swamp Night shell against the recorded responses; Playwright shots at 390 (ask and trivia) and 1365 in `shots/`, no horizontal overflow at 320/390/430.
- `history.json`: 15 facts, each with floridagators.com, ncaa.com, heisman.com or secsports.com sources (national titles 1996, 2006, 2008; Heismans Spurrier 1966, Wuerffel 1996, Tebow 2007; SEC titles; The Swamp; basketball 2006, 2007, 2025).

## What it needs from Brenden
1. **A yes on the surface.** Where it lives: under The Tunnel on the homepage (the client already mounts there) or a `/ask` page first. Recommendation: `/ask` page for a week, then the homepage slot.
2. **Jarvis deploys it** (#34 scope): create `ASK_GATORBAIT_KV`, set the `HASH_SALT` secret, `wrangler deploy`, then paste the Worker URL into `window.__GBM_ASK_URL__` in the embed. One deploy, reversible by removing the embed.
3. **Ten minutes with the live model** after deploy: ask the four suggested questions plus three traps ("who's starting at QB?", "what did Sumrall say about the poll?", "score prediction?") and read the refusals. Tone knobs are one line in `worker.mjs`.
4. **Approve the history file.** Fifteen facts, all cited; add the ones you want (Buddy's era, the 1990s teams) and the trivia pool grows with them.
5. **Re-run `build-index.mjs` in the feed workflow** so new stories are answerable within the newsroom refresh window; no new scheduler, one extra step in the existing job.

## Risks
- **Model tone drift.** Llama 3.1 8B can editorialize. Mitigation already in code: answers under 80 words, numbers must come from sources, refusal text is fixed, and the guard falls back to the refusal rather than a trimmed answer. Still needs one live read before the homepage.
- **Thin material for some questions.** The index holds excerpts, not full articles, so "why did the fourth-down gamble fail?" gets the story link rather than the paragraph. Adding article bodies is a build-index change, not a Worker change, and worth doing after the excerpt version proves itself.
- **Soft rate limits.** KV counters are eventually consistent; a burst could exceed 8/min briefly. Workers AI usage is capped by the account's free allowance, so the downside is a 503, not a bill. The Rate Limiting binding or a Durable Object makes it exact if traffic warrants.
- **Trivia repeats.** Sixteen questions cycle in about two weeks. The pool grows with every history fact and every final score; a `trivia:<date>` KV key lets an editor plant a question for game week.
- **Not a moderation surface.** It answers; it does not chat back and forth, store conversations or take names. That is deliberate; The Stands (chat) is a separate proposal.
