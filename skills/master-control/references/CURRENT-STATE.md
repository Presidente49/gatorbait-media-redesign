# Master Control Current State

**Snapshot date:** 2026-09-19  
**Purpose:** quick continuity only. This file expires by design.

Before any mutation or present-tense business conclusion, re-read the authoritative live system when a connector/API is available.

## Production identity

- Site: GatorBait Media
- Live URL: https://www.gatorbaitmedia.com/
- Wix site ID: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`
- Repository: `Presidente49/gatorbait-media-redesign`
- Contact email: `brenden@gatorbaitmedia.com`
- Wix: Premium site, Wix Editor, Velo enabled

## Current product direction

- Free/public side = traffic + ads + email + community + show discovery + membership funnel.
- GatorBait Magazine = cleaner premium/member experience.
- GatorBait TV / Buddy Martin Show = owned video/live retention surface.
- Community should be lightweight first; longer-term Discourse/SSO remains a possible architecture.
- Major domain redirects are not part of the immediate monetization rollout.

## Publisher monetization verified 2026-09-19

The site's custom ads.txt currently authorizes:

`google.com, pub-6592453291626199, DIRECT, f08c47fec0942fa0`

The Wix **Monetize with AdSense** app was restored on 2026-09-19.

- app definition: `12d5833e-f061-7cc8-5122-e1d404f6c8ae`
- installed instance at verification: `2295701f-3d3d-4402-ba42-3f351eb317e4`

Do not create a second AdSense account.

The remaining operational job is correct ad-unit serving/placement and measurement, not inventing a new publisher identity.

## Analytics sources verified

Connected through current tooling:

- GA4 property/account for GatorBaitMedia
- Google Search Console for `gatorbaitmedia.com`
- Wix Blog metrics
- Wix Email Marketing campaign statistics
- Wix Social Publisher where the channel connection is valid

Recent traffic numbers change quickly; query them live rather than copying this snapshot into decisions.

## Social connection snapshot from 2026-09-19

Wix Social Publisher returned:

- Facebook: connected, including **Gator Bait Media**, **The Buddy Martin Show**, and **Best Fridays in Football** pages.
- Instagram: token/session invalid at the last check; reconnect before relying on Wix Instagram publishing.
- YouTube: reported disconnected in Wix Social Publisher at the last check.
- Google Business Profile: connected.
- LinkedIn/TikTok: not connected at the last check.

Re-query before publishing because OAuth state can change.

## Email / automation identity warning

Do not trust friendly automation names or old runbook text.

Before touching the production blog-email workflow, read live Wix automation state and the current publishing-email playbook. Identify the intended path by stable automation ID + origin + message/action ID + current status.

Repository history contains contradictory mappings from prior troubleshooting. Live state wins.

## Known repo-document status

### Canonical / current
- `skills/master-control/`
- `AGENTS.md`
- `CLAUDE.md`
- `automation/ops-hub/policy.json`
- `automation/ops-hub/controller-rules.json`
- `.codex/skills/gatorbait-wix-operator/`
- current surface playbooks when their facts are verified

### Historical / partially superseded
- `wix-site-management-playbook.md` contains an older dark ESPN+/Athletic redesign direction and March 2026 assumptions. Treat as historical reference, not current UX authority.
- older dated sections inside long runbooks can contain stale revisions, campaign states, or automation mappings. Re-query live objects before acting.

## Current architecture simplification

Preferred:

**Brenden → Master Control → best available worker/tool → verified result**

Native Claude on the Mac has been the preferred local worker when available.

Codex, FCC, n8n, additional agents, and model routers are optional capability layers, not mandatory daily infrastructure.

Do not activate complexity without a defined job.

## Fast state-expiry rules

Treat these as stale unless queried for the task:

- traffic/search/social/email metrics: hours
- campaign send/open/click status: minutes to hours
- OAuth/social connection state: before publishing
- Wix object revision: immediately before mutation
- automation active/inactive state: before mutation
- homepage/story ordering: before changing editorial layout
- ad-serving/revenue state: before monetization conclusions
- member/payment counts: before financial statements

Stable identifiers such as site ID and repo name can remain here unless the business migrates.
