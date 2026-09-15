# GatorBait FCC Model Router

Purpose: use Free Claude Code (FCC) as a local model gateway so routine GatorBait work can run on free/low-cost models while Claude/OpenAI/local models remain available for higher-risk work.

## Pin

Audited upstream: `Alishahryar1/free-claude-code`

Pinned commit: `b9aa5a637e106a7bf0cee8ac34f849ae8a98d4ac` (FCC 6.2.31 as inspected 2026-09-15).

Do not auto-upgrade from `main`. Review and deliberately advance the pin.

## Local security defaults

- Bind FCC to `127.0.0.1`, never `0.0.0.0`.
- Require proxy authentication.
- Generate a unique local bearer token.
- Keep `~/.fcc/.env` mode `0600` and `~/.fcc` mode `0700` on Unix/macOS.
- Do not put provider keys or the proxy token in Git.
- No router port forwarding or public exposure.

## Data lanes

Use `routing-policy.json` as the model-selection contract.

Public, already-published or public-repo material can use FCC free providers. Sensitive customer, billing, account, credential, private-email, legal, personnel or unpublished-confidential material must use an approved trusted model/provider or a local model.

FCC model aliases must never be described to humans as actual Anthropic Opus/Sonnet/Haiku unless the upstream model really is Anthropic. Record the actual provider/model in logs.

## Install

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

Configure at least one provider. For the first pilot, OpenRouter free or NVIDIA NIM are reasonable public-work lanes. Add more providers only after the first lane is stable.

## Smoke check

With `fcc-server` running:

```bash
TOKEN=$(awk -F= '/^ANTHROPIC_AUTH_TOKEN=/{gsub(/"/,"",$2);print $2}' ~/.fcc/.env)
curl -fsS http://127.0.0.1:8082/health
curl -fsS -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8082/v1/models?limit=20
```

A failed auth check is a blocker. Do not disable proxy auth as a workaround.

## Pilot tasks

Start with public/low-risk work:

- repo searches and inventory
- SEO metadata drafts
- public article tagging/classification
- public sports-research preprocessing
- test generation
- CSS/JS lint/review passes
- sanitized log summarization

Do not begin the pilot with Gmail, membership, billing, Wix credentials or private customer data.

## Rollback

Stop FCC, then remove the uv tool:

```bash
pkill -f fcc-server 2>/dev/null || true
uv tool uninstall free-claude-code
```

The GatorBait production site does not depend on FCC. If FCC fails, route the task back to the existing trusted model path; do not make the website unavailable because the router is down.
