# GatorBait Operations Hub

An inexpensive local control room for the digital side of GatorBait Media. It is designed for an always-on Mac and uses deterministic checks before any AI work.

## Working now

- Checks the live homepage, Magazine, GatorBait TV, membership, policies, contact page and official merch store every 15 minutes.
- Verifies HTTPS and required homepage markers.
- Keeps persistent JSONL health history and a current Markdown brief.
- Serves a local dashboard at `http://127.0.0.1:8765`.
- Restarts automatically after Mac login when installed with launchd.
- Includes a pinned, local-only n8n service for Gmail, Wix, Metricool and AI workflows.
- Records the unified revenue, subscription, merchandise, creative, community and model-routing agent contracts.
- Includes a pinned FCC model-router lane for routing repetitive public work to free/low-cost models while preserving trusted/local lanes for sensitive work.

## Test once

From this directory:

```bash
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

## Initial automation lanes

1. **Operations:** site, store and route health with deduplicated alerts.
2. **Customer service:** classify incoming Gmail, retrieve approved policy language and prepare replies.
3. **Editorial:** inventory current articles and shows, validate metadata and maintain the calendar.
4. **Marketing:** create channel-specific drafts and queue them for distribution.
5. **Subscriptions:** move loyal readers and viewers toward clear paid membership offers and retention.
6. **Merchandise:** promote the official ItemOrder store and measure attributable traffic.
7. **Revenue:** combine memberships, merchandise, video, newsletter and sponsorship performance into one brief.
8. **Model Router:** send repetitive public tasks to free/low-cost capacity and preserve trusted/local models for sensitive or consequential work.

`policy.json` is authoritative. Routine organic publishing and reversible maintenance may proceed automatically when the policy's editorial, brand, compliance, Mobile QC and rollback gates are satisfied. The actions listed under `approval_required` still require owner approval.

## Files

- `ops_hub.py` — local monitor and dashboard.
- `config.json` — monitored systems and timing.
- `policy.json` — authoritative action boundaries.
- `agents/model-router.md` — model selection and data-lane contract.
- `model-router/README.md` — FCC operating guide.
- `model-router/install-fcc-pinned.sh` — pinned/hardened local FCC installer.
- `model-router/fcc.env.example` — secret-free example configuration.
- `model-router/routing-policy.json` — provider/data classification rules.
- `agents/revenue-director.md` — unified sports-publisher revenue loop.
- `agents/subscriptions.md` — membership acquisition and retention instructions.
- `agents/merchandise.md` — merchandise instructions.
- `docker-compose.yml` — pinned n8n service.
- `install-mac.sh` — macOS launchd installer.
