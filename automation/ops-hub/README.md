# GatorBait Operations Hub

An inexpensive local control room for the digital side of GatorBait Media. It is designed for an always-on Mac and uses a **single-controller architecture**: deterministic checks and policy decide scope first; models and specialist workflows are bounded tools inside that controller.

## Working now

- Checks the live homepage, Magazine, GatorBait TV, membership, policies, contact page and official merch store every 15 minutes.
- Verifies HTTPS and required homepage markers.
- Keeps persistent JSONL health history, controller state, bounded learning evidence and a current Markdown brief.
- Serves a local dashboard at `http://127.0.0.1:8765` plus read-only `/api/status`, `/api/controller` and `/api/learning` endpoints.
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
- **Learning:** every cycle updates a compact evidence store. Separate incident episodes, recoveries and escalations are counted; repeated patterns become review candidates. Candidates never auto-promote into doctrine and never authorize production writes.

## Daily operating heartbeat

`playbooks/daily-operations.md` is the controller's overall newsroom/business playbook. It sits above the continuous 15-minute health loop and coordinates:

- morning health + freshness checks;
- a short material-work queue;
- desktop QC around 1365–1440 px;
- primary mobile QC at 390 px, with 430 px after changes and 320 px as a periodic narrow regression check;
- editorial, Magazine, show-recap, social and newsletter state;
- membership/customer/revenue exceptions;
- end-of-day record and learning.

A healthy/current day may correctly resolve to `NOOP`; the controller should not invent maintenance work.

## Growth and product playbooks

- `playbooks/digital-magazine-and-print.md` — web-first magazine structure, issue/archive model and premium print-on-demand pilot.
- `playbooks/subscriber-winback.md` — former-customer cohorting, controlled offer tests, consent/frequency gates and 30/60/90-day retention learning.
- `playbooks/social-and-show-clips.md` — Restream recording intake, one general post-show recap, platform-native clips/social and optional normal newsletter reuse.
- `playbooks/mobile-app-strategy.md` — test the GatorBait member experience in Spaces by Wix first; move to a paid branded native app only when adoption, return use, push performance and retention demonstrate a durable business job.

The Restream playbook is **designed but not yet connected**. Before live automation, the local n8n MCP Client must be OAuth-authorized to Restream and tested read-only against one known recording. No Restream credentials belong in Git.

The mobile-app strategy does **not** authorize a paid app plan or app-store fees. Those remain owner decisions. The public Wix website remains the canonical editorial surface whether GatorBait uses Spaces or later launches a branded app.

## Test once

From this directory:

```bash
python3 test_controller.py
python3 test_learning.py
python3 ops_hub.py once
```

## Run in the cloud (no Mac required)

`.github/workflows/ops-hub-cloud-cycle.yml` runs one deterministic `ops_hub.py once` cycle every 15 minutes on GitHub Actions and commits the resulting bounded state (`automation/ops-hub/cloud-state/`) back to `main` when it changes — the same commit-on-change pattern `refresh-newsroom-feed.yml` already uses for the live blog feed. This covers the observe/health/learning loop only:

- `cloud-state/status.json`, `controller-state.json`, `learning.json`, `latest-brief.md` — same shape as the local `.state/` files, just committed instead of kept on a Mac disk.
- `cloud-state/events.jsonl` is bounded to the most recent 500 events (oldest trimmed) so it never grows unbounded in Git history.
- No write authority: this cycle only ever calls `evaluate_cycle`/`update_learning_state`, which never set `production_write_authorized: true` on their own. Nothing here can mutate the live Wix site, send anything, or spend money.
- Not covered by the cloud cycle: n8n (Gmail/Wix/Metricool workflows), the FCC model router, and any actual production-write action. Those stay local-only/manual until a specific job justifies standing them up — see CLAUDE.md's rule against reactivating worker layers without a defined job.
- Read `cloud-state/latest-brief.md` in the repo for current status instead of running a local dashboard. A live HTTP dashboard would need real hosting (a small always-on service) — not set up here; ask if you want that next.

Run it manually anytime with `workflow_dispatch` from the Actions tab, or trigger a push to any of the paths listed in the workflow file.

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

1. **Operations:** daily operating heartbeat plus site, store and route health with bounded verification and deduplicated state.
2. **Customer service:** classify incoming Gmail, retrieve approved policy language and prepare replies.
3. **Editorial:** inventory current articles and shows, validate metadata and maintain the calendar.
4. **Marketing:** create channel-specific drafts and queue them for distribution.
5. **Subscriptions:** move loyal readers and viewers toward clear paid membership offers and retention.
6. **Merchandise:** promote the official ItemOrder store and measure attributable traffic.
7. **Revenue:** combine memberships, merchandise, video, newsletter and sponsorship performance into one brief.
8. **Mobile product:** validate Spaces/member-app use, notification behavior and app-vs-mobile-web value before any branded-app commitment.
9. **Model Router:** send bounded repetitive public tasks to free/low-cost capacity and preserve trusted/local models for sensitive or consequential work.

`policy.json` is authoritative. Routine organic publishing and reversible maintenance may proceed automatically when the policy's editorial, brand, compliance, mobile QC and rollback gates are satisfied. The actions listed under `approval_required` still require owner approval.

## Files

- `ops_hub.py` — local controller, monitor and dashboard.
- `controller.py` — deterministic controller state transitions.
- `learning.py` — bounded recurrence/recovery evidence and lesson-candidate detection.
- `controller-rules.json` — target-specific deterministic gates and bounded reasoning scopes.
- `test_controller.py` — dependency-free controller transition tests.
- `test_learning.py` — dependency-free learning-loop regression tests.
- `config.json` — monitored systems, timing and controller retry bounds.
- `policy.json` — authoritative action boundaries and learning rules.
- `playbooks/daily-operations.md` — overall daily operating rhythm and desktop/mobile QC.
- `playbooks/mobile-app-strategy.md` — Spaces pilot and branded native-app decision gate.
- `playbooks/digital-magazine-and-print.md` — digital-magazine and POD operating plan.
- `playbooks/subscriber-winback.md` — lapsed-customer recovery loop.
- `playbooks/social-and-show-clips.md` — post-show recap and social monetization loop.
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
