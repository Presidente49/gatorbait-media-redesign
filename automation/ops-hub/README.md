# GatorBait Operations Hub

An inexpensive local control room for the digital side of GatorBait Media. It is designed for an always-on Mac and now uses a **single-controller architecture**: deterministic checks and policy decide scope first; models and specialist workflows are bounded tools inside that controller.

## Working now

- Checks the live homepage, Magazine, GatorBait TV, membership, policies, contact page and official merch store every 15 minutes.
- Verifies HTTPS and required homepage markers.
- Keeps persistent JSONL health history, controller state and a current Markdown brief.
- Serves a local dashboard at `http://127.0.0.1:8765` plus read-only `/api/status` and `/api/controller` endpoints.
- On a first deterministic failure, performs one short confirmation loop after 90 seconds. If the same failure persists, it escalates and returns to the normal interval instead of entering an open-ended self-healing loop.
- Restarts automatically after Mac login when installed with launchd.
- Includes a pinned, local-only n8n service for Gmail, Wix, Metricool and bounded AI workflows.
- Includes a pinned FCC model-router lane for repetitive public work while preserving trusted/local lanes for sensitive work.

## Controller loop

The operating contract is:

`OBSERVE → SCOPE → CLASSIFY → PLAN → ACT → VERIFY → RECORD → LEARN`

The controller owns state, policy, write authority, verification and learning. Deterministic checks run first. Target-specific rules live in `controller-rules.json`. A model can diagnose, draft, compare or recommend inside the selected scope, but it does not become an independent production writer and it cannot verify its own fix.

Recursion is intentionally bounded:

- **Health failure:** one short deterministic recheck, then escalate if persistent.
- **Production mutation:** one reversible mutation per cycle, external verification, then rollback/stop or escalation on failure.
- **Learning:** measured outcomes may suggest a reusable playbook; safety, financial and approval boundaries cannot self-modify.

## Growth playbooks

The controller now has bounded playbooks for the next revenue/editorial build:

- `playbooks/digital-magazine-and-print.md` — web-first magazine structure, issue/archive model and a premium print-on-demand pilot.
- `playbooks/subscriber-winback.md` — former-customer cohorting, controlled offer tests, consent/frequency gates and 30/60/90-day retention learning.
- `playbooks/social-and-show-clips.md` — Restream recording/clip intake, platform-native packaging, Metricool/platform distribution and social monetization feedback.

The Restream playbook is **designed but not yet connected**. Before live automation, the local n8n MCP Client must be OAuth-authorized to Restream and tested read-only against one known recording. No Restream credentials belong in Git.

## Test once

From this directory:

```bash
python3 test_controller.py
python3 ops_hub.py once
```

## Run continuously on the Mac

```bash
chmod +x install-mac.sh ops_hub.py
./install-mac.sh
open http://127.0.0.1:8765
```

The launch service writes runtime files under `.state/`. Do not commit that directory.

## Start the automation canvas

Install Docker Desktop, then:

```bash
cp .env.example .env
openssl rand -hex 32
```

Paste the generated value into `.env`, then run:

```bash
docker compose up -d
open http://127.0.0.1:5678
```

Create the local n8n owner account in the browser. Connect Gmail, Wix, Metricool and any model provider inside n8n; credentials from ChatGPT cannot and should not be copied from this conversation.

The service binds only to `127.0.0.1`. Do not expose ports 5678 or 8765 to the public internet. Remote access should be added later through an authenticated private network.

## Start the FCC model router

The GatorBait FCC integration is under `model-router/` and is pinned to an audited upstream commit rather than floating `main`.

```bash
cd model-router
chmod +x install-fcc-pinned.sh
./install-fcc-pinned.sh
fcc-server
open http://127.0.0.1:8082/admin
```

Configure provider credentials locally in FCC Admin. Do not commit provider keys. Start the pilot with public/repo work. `model-router/routing-policy.json` controls which data lanes may use free providers.

After a provider is configured and the authenticated model check passes, make FCC persistent:

```bash
chmod +x install-fcc-launchd.sh
./install-fcc-launchd.sh
```

That installer refuses to enable the always-on service unless FCC health and authenticated model checks are already passing.

## Automation lanes

1. **Operations:** site, store and route health with bounded verification and deduplicated state.
2. **Customer service:** classify incoming Gmail, retrieve approved policy language and prepare replies.
3. **Editorial:** inventory current articles and shows, validate metadata and maintain the calendar.
4. **Marketing:** create channel-specific drafts and queue them for distribution.
5. **Subscriptions:** move loyal readers and viewers toward clear paid membership offers and retention.
6. **Merchandise:** promote the official ItemOrder store and measure attributable traffic.
7. **Revenue:** combine memberships, merchandise, video, newsletter and sponsorship performance into one brief.
8. **Model Router:** send bounded repetitive public tasks to free/low-cost capacity and preserve trusted/local models for sensitive or consequential work.

`policy.json` is authoritative. Routine organic publishing and reversible maintenance may proceed automatically when the policy's editorial, brand, compliance, mobile QC and rollback gates are satisfied. The actions listed under `approval_required` still require owner approval.

## Files

- `ops_hub.py` — local controller, monitor and dashboard.
- `controller.py` — deterministic controller state transitions.
- `controller-rules.json` — target-specific deterministic gates and bounded reasoning scopes.
- `test_controller.py` — dependency-free controller transition tests.
- `config.json` — monitored systems, timing and controller retry bounds.
- `policy.json` — authoritative action boundaries and learning rules.
- `playbooks/digital-magazine-and-print.md` — digital-magazine and POD operating plan.
- `playbooks/subscriber-winback.md` — lapsed-customer recovery loop.
- `playbooks/social-and-show-clips.md` — Restream-to-social/newsletter monetization loop.
- `agents/model-router.md` — model selection and data-lane contract; the directory name is retained for compatibility.
- `model-router/README.md` — FCC operating guide.
- `model-router/install-fcc-pinned.sh` — pinned/hardened local FCC installer.
- `model-router/install-fcc-launchd.sh` — authenticated health-gated always-on Mac service installer.
- `model-router/fcc.env.example` — secret-free example configuration.
- `model-router/routing-policy.json` — provider/data classification rules.
- `agents/revenue-director.md` — revenue workflow contract under the controller.
- `agents/subscriptions.md` — membership workflow contract under the controller.
- `agents/merchandise.md` — merchandise workflow contract under the controller.
- `docker-compose.yml` — pinned n8n service.
- `install-mac.sh` — macOS launchd installer.
