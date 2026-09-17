# GatorBait FCC Model Router

Purpose: use Free Claude Code (FCC) as a local model gateway so routine GatorBait work can run on free/low-cost models while native Claude, native Codex and other trusted/local models remain available for higher-risk work.

## Pin

Audited upstream: `Alishahryar1/free-claude-code`

Pinned commit: `b9aa5a637e106a7bf0cee8ac34f849ae8a98d4ac` (FCC 6.2.31 as inspected 2026-09-15).

Do not auto-upgrade from `main`. Review and deliberately advance the pin.

The current pin already supports both `fcc-claude` and `fcc-codex`, and its OpenAI provider can use a locally authorized ChatGPT connected account. A newer FCC release is not required merely to add Codex/ChatGPT subscription-backed capacity.

## Multi-harness architecture

The GatorBait controller now distinguishes the model **harness** from the actual upstream model/provider:

- `claude` — native Claude Code, using the locally authenticated Anthropic path.
- `fcc-claude` — Claude Code harness routed through FCC; upstream may be a free, paid, subscription or local FCC provider.
- `codex` — native Codex CLI, using the locally authenticated OpenAI path.
- `fcc-codex` — Codex harness routed through FCC; upstream identity must be logged separately.

See `harness-policy.json` for the token-pool and data-lane contract. Harness names must never be treated as model identity.

The default routing intent is:

- public low-risk code → FCC Codex;
- public low-risk editorial/ops → FCC Claude;
- high-reasoning code → native Codex;
- high-reasoning editorial / long-context synthesis → native Claude;
- sensitive work → trusted native harnesses only;
- credentials/secrets → do not put them in a model prompt.

## Anthropic Knowledge Work Plugins

Official upstream: `anthropics/knowledge-work-plugins`.

The initial local set is deliberately small:

- `operations` — runbooks, process documentation, change/risk/status workflows;
- `marketing` — content, brand review, campaigns, SEO and performance analysis;
- `data` — exploration, analysis, validation and dashboard patterns.

These plugins contribute **skills and workflow patterns** only. They do not override GatorBait policy, approval gates, production ownership, Wix rules or the single-controller architecture.

The GatorBait project plugin lives at:

`gatorbait-claude-plugin/`

`task-runner.py` passes that project plugin to Claude workers. The official Anthropic `productivity` plugin is deferred until its `CLAUDE.md`/task-memory conventions are reconciled with Ops Hub's existing state ownership.

## n8n job bridge

n8n remains in Docker and does not receive model credentials or direct host-shell access.

The compose file bind-mounts a gitignored file queue:

`./.state/model-jobs:/jobs`

n8n writes jobs under `/jobs/inbox/`. The host-side `job-worker.py`, installed with launchd, invokes `task-runner.py` and writes results to `/jobs/done/` or `/jobs/failed/`.

This avoids adding a writable HTTP endpoint or mounting Claude/Codex keychains into the n8n container. See `N8N-MULTI-HARNESS.md` for the workflow contract and job schema.

## Local security defaults

- Bind FCC to `127.0.0.1`, never `0.0.0.0`.
- Require proxy authentication.
- Generate a unique local bearer token.
- Keep `~/.fcc/.env` mode `0600` and `~/.fcc` mode `0700` on Unix/macOS.
- Do not put provider keys or the proxy token in Git.
- No router port forwarding or public exposure.
- Model workers are not production writers.
- `task-runner.py` uses a disposable repository snapshot by default; controller safety does not depend solely on a model harness reporting that its sandbox is read-only.

## Data lanes

Use `routing-policy.json` and `harness-policy.json` together as the model-selection contract.

Public, already-published or public-repo material can use FCC free providers. Sensitive customer, billing, account, private-email, legal, personnel or unpublished-confidential material must use an approved trusted model/provider or a local model. Credentials and secrets are not model-prompt material.

FCC model aliases must never be described to humans as actual Anthropic Opus/Sonnet/Haiku or OpenAI GPT models unless the upstream model really is that model. Record the actual provider/model in logs.

## Ecosystem review

Read `ECOSYSTEM-REVIEW.md` before expanding the router stack. It documents real-world Fable/Opus/Sonnet/Haiku mapping patterns, provider regressions seen in FCC issues, the GatorBait benchmark set, and companion-project recommendations.

Near-term companion priorities are:

1. **RTK** for shell-output token reduction.
2. **ccusage** for cross-agent token/model/cost reporting.
3. **Ollama** after the always-on Mac hardware is checked, for a private local lane.

ICM is a later per-project memory pilot. Serena and Repomix require additional license/security review before integration. Langfuse is deferred until the lighter reporting stack proves insufficient.

## Install FCC

On the always-on Mac, from this directory:

```bash
chmod +x install-fcc-pinned.sh
./install-fcc-pinned.sh
```

The script intentionally refuses to install from floating `main`. It installs the pinned commit, creates hardened local config, and prints the next provider step.

Then start:

```bash
fcc-server
```

Open the local Admin UI:

```bash
open http://127.0.0.1:8082/admin
```

Configure at least one provider. Keep first tests to public/repo work.

## Bootstrap all harnesses

After native Claude Code and Codex are installed/authenticated locally and FCC is installed:

```bash
chmod +x bootstrap-multi-harness.sh install-model-worker-launchd.sh
./bootstrap-multi-harness.sh
```

To register the official Anthropic knowledge-work marketplace and install the initial operations/marketing/data plugins:

```bash
./bootstrap-multi-harness.sh --install-knowledge-plugins
```

After the smoke checks pass, install the host-side queue worker:

```bash
./install-model-worker-launchd.sh
```

Then recreate n8n so the `/jobs` bind mount is active:

```bash
cd ..
docker compose up -d
```

## FCC smoke check

With `fcc-server` running:

```bash
TOKEN=$(awk -F= '/^ANTHROPIC_AUTH_TOKEN=/{gsub(/"/,"",$2);print $2}' ~/.fcc/.env)
curl -fsS http://127.0.0.1:8082/health
curl -fsS -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8082/v1/models?limit=20
```

A failed auth check is a blocker. Do not disable proxy auth as a workaround.

## Routing dry run

This does not invoke a model or consume model allowance:

```bash
python3 task-runner.py \
  --lane public_high_reasoning \
  --kind editorial \
  --prompt 'Review the current public magazine package and return gaps only.'
```

Add `--execute` only after the selected local harness is authenticated and the lane is correct.

## Pilot tasks

Start with public/low-risk work:

- repo searches and inventory
- SEO metadata drafts
- public article tagging/classification
- public sports-research preprocessing
- test generation
- CSS/JS lint/review passes
- sanitized log summarization

Do not begin the FCC/free-provider pilot with Gmail, membership, billing, Wix credentials or private customer data.

## Rollback

Stop the model job worker:

```bash
launchctl bootout "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.gatorbait.model-worker.plist" 2>/dev/null || true
```

Stop FCC, then remove the uv tool if required:

```bash
pkill -f fcc-server 2>/dev/null || true
uv tool uninstall free-claude-code
```

The GatorBait production site does not depend on FCC, n8n or any model worker. If a harness or router fails, return the task to the existing trusted controller path; do not make the website unavailable because an AI worker is down.
