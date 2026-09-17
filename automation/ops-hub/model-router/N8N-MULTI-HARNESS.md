# n8n → GatorBait Claude / Codex Worker Bridge

This bridge lets local n8n orchestrate model work without mounting Claude/Codex credentials or host binaries into the n8n container.

## Architecture

```text
n8n (Docker, localhost only)
  ↓ writes one JSON job
.state/model-jobs/inbox/
  ↓ host launchd worker claims atomically
job-worker.py
  ↓
task-runner.py
  ↓ route by data lane + task kind
native Claude | FCC Claude | native Codex | FCC Codex
  ↓ disposable repo snapshot
structured result
  ↓
.state/model-jobs/done/ or failed/
  ↓ n8n reads result
GatorBait controller verifies / decides next action
```

The model worker is **not** a production writer. Wix, Gmail, social, billing, membership and other shared mutations remain behind the existing controller policy.

## Why a file queue

- n8n stays bound to `127.0.0.1:5678`.
- FCC stays bound to `127.0.0.1:8082`.
- No extra HTTP write endpoint is opened on the Mac.
- n8n never receives Claude/ChatGPT keychain material.
- n8n never gets direct host-shell access.
- Jobs are durable and auditable as small JSON files.

The compose file bind-mounts:

```text
./.state/model-jobs  →  /jobs
```

`.state/` is gitignored.

## Job schema

n8n writes one file to `/jobs/inbox/<id>.json`:

```json
{
  "id": "newsroom-2026-09-18-auburn-copy-review",
  "lane": "public_high_reasoning",
  "kind": "editorial",
  "prompt": "Review the Auburn magazine package in this repo. Return factual gaps, duplicate angles and a recommended reading order. Do not publish or modify production.",
  "max_turns": 8,
  "timeout": 900
}
```

Optional `harness` values:

- `claude_native`
- `fcc_claude`
- `codex_native`
- `fcc_codex`

Normally omit `harness`; `task-runner.py` chooses from `harness-policy.json`.

Never put credentials, OAuth tokens, API keys, passwords, cookies, private payment data or raw secret-bearing config into `prompt`.

## Default routing

| Data lane / work | Default worker |
|---|---|
| public low-risk code | FCC Codex |
| public low-risk editorial/ops | FCC Claude |
| high-reasoning code | native Codex |
| high-reasoning editorial / long context | native Claude |
| sensitive code | native Codex |
| sensitive non-code | native Claude |
| credentials / secrets | blocked |

Actual upstream provider/model must be recorded at runtime. A harness name is not a model identity.

## n8n workflow pattern

Use ordinary n8n nodes; no custom community node is required.

1. **Trigger** — Cron, Webhook, Gmail, or another approved event.
2. **Set / Code** — Build a job object with a unique `id`, `lane`, `kind` and `prompt`.
3. **Convert to File** — JSON text to a file payload.
4. **Read/Write Files from Disk** — Write to `/jobs/inbox/<id>.json`.
5. **Wait / Poll** — Check `/jobs/done/<id>.json` and `/jobs/failed/<id>.json` on a bounded interval.
6. **Read result** — Parse the completed result.
7. **Controller gate** — use the result as evidence/draft input; do not treat it as verification or automatic production authorization.

Do not poll faster than necessary. A 5–15 second bounded poll is enough for interactive workflows; longer recurring work should use lower-frequency checks.

## Host setup

From `automation/ops-hub/model-router/` on the always-on Mac:

```bash
chmod +x bootstrap-multi-harness.sh install-model-worker-launchd.sh
./bootstrap-multi-harness.sh
# optional, after Claude Code is authenticated:
./bootstrap-multi-harness.sh --install-knowledge-plugins
./install-model-worker-launchd.sh
```

Then recreate n8n so the queue bind mount is active:

```bash
cd automation/ops-hub
docker compose up -d
```

## Smoke test without n8n

Create a public low-risk job:

```bash
cat > automation/ops-hub/.state/model-jobs/inbox/smoke.json <<'JSON'
{
  "id": "smoke",
  "lane": "public_low_risk",
  "kind": "analysis",
  "prompt": "Inspect the repository README and return a five-line description. Do not modify files."
}
JSON
```

Run one worker cycle if launchd is not installed yet:

```bash
python3 automation/ops-hub/model-router/job-worker.py --once
cat automation/ops-hub/.state/model-jobs/done/smoke.json
```

If the job lands in `failed/`, inspect that result and the local model-worker stderr log. Do not weaken authentication or production policy to make a smoke test pass.

## Anthropic Knowledge Work Plugins

The initial local plugin set is deliberately small:

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install operations@knowledge-work-plugins
claude plugin install marketing@knowledge-work-plugins
claude plugin install data@knowledge-work-plugins
```

The GatorBait project plugin lives at:

```text
automation/ops-hub/model-router/gatorbait-claude-plugin/
```

`task-runner.py` passes that plugin directory to Claude workers. Official Anthropic plugins contribute role expertise; GatorBait policy remains authoritative.

The Anthropic `productivity` plugin is intentionally deferred because its root `CLAUDE.md`/task-memory conventions need to be reconciled with Ops Hub's existing state ownership before adoption.
