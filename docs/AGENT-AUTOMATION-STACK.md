# GatorBait Agent and Automation Stack

## Production decision

Use GitHub Actions as the deterministic control plane and [GitHub Agentic Workflows](https://github.com/github/gh-aw) as the bounded reasoning layer. Keep Wix production changes under the GatorBait Wix operator runbook.

### Installed now

- `.github/workflows/gatorbait-production-health.yml` runs dependency-free route and homepage-marker checks every six hours. It makes no model calls.
- `automation/site_health_check.py` checks the homepage, Magazine, GatorBait TV, membership, policies, contact page and official ItemOrder store.
- `.github/workflows/gatorbait-agentic-audit.md` is manual-only. It runs Codex through GitHub Agentic Workflows with a 500-credit per-run ceiling, eight-turn ceiling, read-only repository access and one validated issue as its only visible output.
- `.github/workflows/gatorbait-agentic-audit.lock.yml` is compiled by gh-aw v0.88.7 in strict mode. Edit the Markdown source and recompile; never hand-edit the lockfile.

The agentic audit cannot edit the repository, call Wix APIs, change DNS, deploy, merge, send messages or expose secrets. It may create one temporary report issue only when it verifies a material failure. Otherwise it must produce a no-op.

### Cost policy

Routine health, link and marker checks stay deterministic. The agentic audit has no schedule and runs only when the owner manually dispatches it. This prevents unattended model use. Do not add a schedule to the agentic workflow without an explicit budget decision.

### Authentication

The agentic audit uses the Codex runtime with the GitHub-hosted `copilot/gpt-5.3-codex` model and `copilot-requests: write`. This avoids placing an OpenAI API key in the repository. It requires GitHub Copilot inference to be available for the repository or organization.

## Local operations hub

`automation/ops-hub/` is the working first release for an always-on Mac:

- `ops_hub.py` performs dependency-free production and official merch-store checks every 15 minutes, writes persistent status/history and serves a local dashboard on `127.0.0.1:8765`.
- `install-mac.sh` installs the monitor as a restart-on-login launchd service.
- `docker-compose.yml` pins n8n 2.38.7 and binds it to `127.0.0.1:5678` for future Gmail, Wix, Metricool and model-backed workflows.
- `policy.json` separates automatic analysis/drafting from approval-controlled publishing, financial and account actions.
- The revenue director unifies editorial, GatorBait TV, GatorBait Weekly, subscriptions, merchandise and sponsorships into one measurable operating loop.

The local release was syntax-checked and exercised against all seven production destinations on 2026-09-13; all returned HTTPS success and the dashboard reported healthy. Connector credentials must be authorized locally on the Mac and never committed.

## Future additions

Use [openai/openai-agents-python](https://github.com/openai/openai-agents-python) only when GatorBait needs a custom hosted service with multi-agent handoffs. Do not add an agent framework solely for scheduled checks.

For cross-service editorial automation, evaluate [activepieces/activepieces](https://github.com/activepieces/activepieces) first. Consider [n8n-io/n8n](https://github.com/n8n-io/n8n) only when its integrations save enough work to justify its Sustainable Use License. Do not install both.

## Candidate workflows

1. New Wix article triggers deterministic metadata and image validation.
2. Approved article produces Facebook, YouTube, Instagram and newsletter drafts for review.
3. New Buddy Martin Show video produces a website link and channel-specific draft copy.
4. GatorBait Weekly assembles from verified current articles.
5. Failed deterministic checks create a single deduplicated internal alert and stop downstream publishing.

## Safety rules

- Reuse one approved summary across channels.
- One supervisor controls production Wix writes.
- Automations do not change DNS, payments, refunds, memberships or customer records.
- Never store credentials in tracked files.
- Log the source URL, prompt version, output and publication status.
- Stop when metadata, attribution or image rights are uncertain.
- Pin released actions, containers and agent tooling.
