# GatorBait Operations Hub

An inexpensive local control room for the digital side of GatorBait Media. It is designed for an always-on Mac and uses deterministic checks before any AI work.

## Working now

- Checks the live homepage, Magazine, GatorBait TV, membership, policies, contact page and official merch store every 15 minutes.
- Verifies HTTPS and required homepage markers.
- Keeps persistent JSONL health history and a current Markdown brief.
- Serves a local dashboard at `http://127.0.0.1:8765`.
- Restarts automatically after Mac login when installed with launchd.
- Includes a pinned, local-only n8n service for Gmail, Wix, Metricool and AI workflows.
- Records the unified revenue, subscription and merchandise agent contracts.

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

## Initial automation lanes

1. **Operations:** site, store and route health with deduplicated alerts.
2. **Customer service:** classify incoming Gmail, retrieve approved policy language and prepare replies.
3. **Editorial:** inventory current articles and shows, validate metadata and maintain the calendar.
4. **Marketing:** create channel-specific drafts and queue them for Metricool review.
5. **Subscriptions:** move loyal readers and viewers toward clear paid membership offers and retention.
6. **Merchandise:** promote the official ItemOrder store and measure attributable traffic.
7. **Revenue:** combine memberships, merchandise, video, newsletter and sponsorship performance into one brief.

`policy.json` is authoritative. Financial actions, refunds, production writes, public publishing and account changes require owner approval.

## Files

- `ops_hub.py` — local monitor and dashboard.
- `config.json` — monitored systems and timing.
- `policy.json` — action boundaries.
- `agents/revenue-director.md` — unified sports-publisher revenue loop.
- `agents/subscriptions.md` — membership acquisition and retention instructions.
- `agents/merchandise.md` — merchandise instructions.
- `docker-compose.yml` — pinned n8n service.
- `install-mac.sh` — macOS launchd installer.
