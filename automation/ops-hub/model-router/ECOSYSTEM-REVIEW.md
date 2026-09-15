# FCC Ecosystem Review — GatorBait

Date: 2026-09-15

Purpose: document how Free Claude Code (FCC) is actually being used in the wild, how Fable/Opus/Sonnet/Haiku routing works, which companion projects are worth adding, and which projects should remain optional or experimental.

## Key finding: Fable is a routing tier, not a provider

FCC treats Fable, Opus, Sonnet, and Haiku as first-class Claude-compatible routing aliases.

- `MODEL` is the global fallback.
- `MODEL_FABLE`, `MODEL_OPUS`, `MODEL_SONNET`, and `MODEL_HAIKU` can each point at a different provider/model.
- A blank tier override inherits `MODEL`.
- The actual upstream does not need to be Anthropic.
- Never describe a mapped alias as real Anthropic Claude unless the upstream provider/model actually is Anthropic.

FCC added Fable as a first-class routing tier in July 2026. Shortly after that, managed Discord/Telegram sessions were changed to default to the Fable tier instead of Opus. That makes Fable the natural high-volume/interactive lane.

## What users are actually doing

Public issue reports show mixed-provider tier maps rather than one model for everything.

Examples observed in FCC issues:

1. **Fable on Groq; heavier tiers on NVIDIA NIM**
   - Fable: Groq Qwen
   - Opus/Sonnet/Haiku: NVIDIA Nemotron
   - Goal: cheap/fast intermediate work while retaining a larger model for heavier reasoning.

2. **Different model families for every tier**
   - Opus: NVIDIA NIM Kimi
   - Sonnet: Groq Kimi
   - Haiku: NVIDIA StepFun
   - Goal: route by expected workload and provider availability rather than brand name.

3. **One family split by size**
   - Fable/Opus: larger GLM/Nemotron style model
   - Sonnet/Haiku: smaller Kimi/flash-style model
   - Goal: predictable provider behavior with cost/latency differences by tier.

4. **All tiers mapped to one free router**
   - `MODEL`, Fable, Opus, Sonnet, Haiku all mapped to `open_router/openrouter/free`.
   - Useful as a first smoke test because it proves the routing path before optimizing each tier.

## Historical issues to account for

FCC is moving quickly and older releases have had provider-specific compatibility bugs.

Observed reports include:

- NVIDIA NIM requests hanging or returning 5xx errors.
- Tier aliases being incorrectly prefixed before provider routing in older releases.
- Groq rejecting unsupported reasoning values.
- Groq output-token ceilings causing 400 errors.
- Gemini receiving conflicting reasoning controls.
- Desktop Hermes using unsupported API paths while the CLI path worked.

Several of these were later marked fixed by the maintainer. The lesson for GatorBait is not to avoid FCC; it is to pin a reviewed commit and benchmark the exact model/provider combination before promoting it into routine work.

## GatorBait recommended routing strategy

### Phase 1 — prove the gateway

Use one public-work provider first.

Suggested initial shape:

- `MODEL`: OpenRouter free router
- `MODEL_FABLE`: inherit `MODEL`
- `MODEL_OPUS`: inherit `MODEL`
- `MODEL_SONNET`: inherit `MODEL`
- `MODEL_HAIKU`: inherit `MODEL`

Run only public/repo tasks until reliability is proven.

### Phase 2 — split the lanes

After provider benchmarking:

- **Fable** = fast/high-volume lane
  - repo searches
  - classification
  - metadata
  - article/tag inventory
  - public research preprocessing
  - messaging/phone-style interactions

- **Haiku** = tiny deterministic helper lane
  - short summaries
  - extraction
  - formatting
  - simple checks

- **Sonnet** = normal production coding/reasoning lane
  - CSS/JS work
  - tests
  - routine implementation
  - medium-complexity debugging

- **Opus** = expensive/high-reasoning lane
  - architecture
  - difficult debugging
  - final review
  - high-consequence decisions

These are workload labels. They do not imply the upstream model is Anthropic.

### Phase 3 — add ordered fallbacks

FCC supports ordered fallback models. The goal is:

1. preferred free/cheap model
2. second free provider
3. local model when appropriate
4. trusted paid model only when needed

Fallbacks should be provider-diverse so one provider outage does not kill the whole lane.

## Companion repos worth adding

### 1. RTK — install with FCC

Repo: `rtk-ai/rtk`

Status: **Recommended / near-term**

Why:

- FCC already has first-class optional RTK integration.
- RTK compresses noisy shell output before an agent sees it.
- It supports git, tests, linting, Docker, AWS, package managers, logs, grep/find, and many other common commands.
- It reports its own savings through `rtk gain`.
- Apache-2.0 licensed.

Important nuance: RTK's claimed 60-90% savings refer to command-output tokens, not the entire LLM bill.

GatorBait use: install globally for Claude Code/Codex/FCC coding workflows after the first FCC smoke test passes.

### 2. ccusage — token/usage reporting

Repo: `ccusage/ccusage`

Status: **Recommended / near-term**

Why:

- Reads local coding-agent usage data.
- Supports Claude Code, Codex, OpenCode, Hermes, Pi, Gemini, Grok, OpenClaw and others.
- Daily, weekly, monthly, session and model breakdowns.
- Useful for answering the owner-level question: "Where are the tokens/credits going?"
- MIT licensed.

GatorBait use: feed a daily summary into Ops Hub so Flaco can report expensive vs free-model usage and provider drift.

### 3. Ollama — private local lane

Repo: `ollama/ollama`

Status: **Recommended after Mac hardware check**

Why:

- FCC already supports Ollama as a local provider.
- Keeps selected private tasks on the GatorBait machine.
- Useful for sanitized logs, private internal text processing, and repetitive tasks where cloud quality is unnecessary.
- MIT licensed.

Do not choose a local model until RAM/CPU/GPU capacity on the always-on Mac is known.

### 4. ICM — cross-agent memory

Repo: `rtk-ai/icm`

Status: **Pilot later / experimental**

Why:

- Permanent memory shared across Claude Code, Codex, Gemini, Cursor, Aider and other MCP clients.
- Supports per-project databases, which is the preferred GatorBait mode.
- Apache-2.0 licensed.
- Could reduce repeated handoffs between Flaco, Opus, Codex and future agents.

Caution: upstream explicitly labels the project experimental/pre-1.0. Start per-project and never make it the only copy of institutional knowledge. GitHub remains canonical.

### 5. Serena — semantic code retrieval/editing

Repo: `oraios/serena`

Status: **Hold for license review**

Why it is interesting:

- Semantic code retrieval and editing via MCP.
- Large active user base.
- Could reduce context load on large repos.

Blocker: GitHub currently reports a non-standard/NOASSERTION license. Do not incorporate or vendor it into GatorBait until the actual license terms are reviewed.

### 6. Repomix — one-off repo packaging

Repo: `yamadashy/repomix`

Status: **Optional, on-demand only**

Why:

- Packs a repo into AI-friendly output.
- Counts tokens and can compress code structure.
- Secretlint integration helps avoid packaging obvious credentials.

Caution: the project has published 2026 security advisories, including historical remote-branch command injection and secret-scanning bypass issues. If used, use a current patched release, pin it, and do not make it an always-on privileged service.

### 7. Langfuse — full observability

Repo: `langfuse/langfuse`

Status: **Later, only if ccusage + Ops Hub are insufficient**

Why:

- LLM traces, sessions, metrics, evaluations and prompt management.
- Self-hostable.

Reason not to add immediately: it is a substantial observability platform. GatorBait can first get 80% of the practical value from FCC logs + RTK + ccusage + Ops Hub without another service/database.

## What NOT to add right now

Avoid stacking multiple model routers/proxies around FCC unless a clear requirement emerges.

Do not add another Claude-Code router, LiteLLM-style gateway, or Claw-specific router merely because it is popular. FCC already owns the model-routing layer. Extra routers increase debugging ambiguity, duplicate credential handling, and make it harder to know which provider actually answered a request.

Likewise, do not install every supported coding harness. Start with Claude Code and Codex. Add Pi/OpenCode/Hermes only when a concrete workflow requires them.

## Recommended GatorBait stack

Near-term:

```text
Brenden / Flaco / Opus
        |
   Ops Hub / n8n
        |
      FCC
   /    |    \
free  trusted  local
models models  Ollama
        |
      RTK
        |
     ccusage
```

Institutional memory remains in GitHub. ICM can later become a convenience memory layer, not the source of truth.

## Activation order when the Mac is available

1. Install pinned FCC and run one-provider smoke test.
2. Enable RTK.
3. Install ccusage and capture a baseline report.
4. Benchmark candidate models on 5-10 representative GatorBait tasks.
5. Split Fable/Haiku/Sonnet/Opus mappings based on measured quality/latency, not hype.
6. Add at least one provider-diverse fallback.
7. Check Mac hardware and add Ollama/local model if worthwhile.
8. Pilot ICM per-project only after the router is stable.
9. Consider Langfuse only when we genuinely need trace-level observability.

## Benchmark set

Use the same tasks for every candidate model:

- classify 25 GatorBait posts Front Page vs Magazine
- generate SEO metadata for 10 public posts
- inspect one real CSS regression without writing
- write tests for one small JS function
- summarize one public sports research packet
- inspect a repo diff and identify risks
- extract structured facts from a public article set

Score each run on accuracy, latency, tool-use reliability, instruction following and retries/errors. Only promote a model to a production lane after it passes its intended task class.
