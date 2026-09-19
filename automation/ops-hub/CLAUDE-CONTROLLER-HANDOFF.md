# Claude Controller Handoff — 2026-09-19

This is the current continuity brief for Brenden Martin's GatorBait controller work.

## Interface style for Brenden

When Brenden talks directly to Claude on the Mac, act as the local front-end to the GatorBait controller contract.

Working style:
- concise, direct, action-oriented
- minimize clarification when the answer can be safely inferred from repo/runbook state
- do not re-ask facts already present in the repo or current conversation
- prefer finishing authorized reversible work over narrating plans
- give short progress updates during longer work
- distinguish verified facts from assumptions
- never claim something is fixed until independently verified
- Brenden may call the interface "Controller" or "Chris"; respond naturally
- avoid agent swarms and redundant specialist layers

Architecture:
- one controller
- native Claude on the Mac is the preferred local worker/interface for now
- Codex is optional backup for code-heavy work, not required in the daily loop
- FCC is deferred unless there is a concrete cost/capacity need
- n8n is optional and should exist only for recurring/scheduled automation with a clear job

Use the loop:
OBSERVE → SCOPE → CLASSIFY → PLAN → ACT → VERIFY → RECORD → LEARN

## Source of truth

Repository:
Presidente49/gatorbait-media-redesign

Wix:
- Site ID: 18fb3a4e-d7f6-414a-aeb9-3047db3ea115
- Live URL: https://www.gatorbaitmedia.com/
- Contact: brenden@gatorbaitmedia.com

Read before substantial work:
1. AGENTS.md
2. CLAUDE.md
3. automation/ops-hub/policy.json
4. automation/ops-hub/controller-rules.json
5. .codex/skills/gatorbait-wix-operator/references/live-runbook.md
6. automation/ops-hub/CLAUDE-CONTROLLER-HANDOFF.md
7. docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md when work touches article publishing, automatic article email, or GatorBait Magazine campaigns

## Completed today

### Buddy Martin broadcast page
Route: /the-buddy-martin-show

Live embed:
- ID: 82c4ca83-98df-4f35-9972-7345a2a71755
- known revision after today's edits: 10

Changes:
- added Subscribe on YouTube beneath existing YouTube link
- target: https://www.youtube.com/@thebuddymartinshow?sub_confirmation=1
- bottom padding reduced to 18 px desktop / 12 px mobile
- repo sync merged through PR #15
- merge commit: 72c5190c00215948980fe533cd7057cd9e503690

### Sitewide white-band/footer gap
Brenden identified a recurring large white band between content and footer across posts and other public pages.

Permanent rule:
- use one shared controller-owned fix
- do not add new page-specific white-band hacks unless the shared guard genuinely cannot cover that route

Live guard:
- name: GBM - Sitewide Footer Gap Guard v1
- ID: 15302fb2-44ef-4a93-a2a8-899731a6c197
- enabled
- covers posts, blog/category pages, TV, Magazine, pricing/contact/policies and other public content routes
- excludes homepage and account/login/system routes
- tracked at deploy/sitewide-footer-gap-guard-v1.html
- PR #16 merged
- merge commit: a6b3e9fd6c02c51796a237b8e8dc5e685afd3dac

### Article template cleanup
Disabled globally:
- GBM - Article Subscribe CTA v1
- ID: 180a6ff3-db1a-46cb-9e67-d5e7e65833dd

Do not restore the old:
"Free every morning / Franz Beard Thoughts of the Day / Get it free"

Shared article nav/tail cleanup remains responsible for trailing blank/dead-space cleanup on /post/ pages.

### Live-now blog post
Published:
LIVE NOW: Best Friday in Football with Buddy Martin

Route:
/post/live-now-best-friday-in-football-september-18-2026

CTA is a real rich-text hyperlink:
WATCH LIVE NOW ON GATORBAIT MEDIA →

Target:
https://www.gatorbaitmedia.com/the-buddy-martin-show

### Email automation state — corrected Sept. 19

Production single-story article alert:
- ID: 824714d4-7e31-4b1d-95b2-ccec04d788af
- current Wix name: Send notification when new blog post is published
- origin: USER
- status: ACTIVE
- verified revision: 15
- email message ID: 04550418-33d0-4564-ad25-b865f591b2c0
- sendToUnsubscribed: false

Wix-preinstalled blog automation:
- ID: 5006baf5-fbbf-440c-a012-a09bdbd95fc9
- current Wix name: GatorBait Story Alert — New Blog Post
- origin: PREINSTALLED
- status: INACTIVE
- verified revision: 10
- email message ID: 1dfd5091-6dbe-48ef-a919-ef0fc75a38ab
- keep INACTIVE as the production article-alert path

Important identity rule:
- friendly names became misleading during troubleshooting;
- identify these workflows by automation ID + origin + message ID, not name alone;
- the canonical publishing/email mapping is `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md`.

### Controller diagnostic
Added:
automation/ops-hub/controller-diagnostic.sh

PR #17 merged:
5c704432d9955044dcb6f5c2a9f3bbbb7dbd0d30

Cloud/controller findings:
- policy/config parses
- router/safety tests pass
- model router dry run passes
- public production health passes
- GitHub Pages build/deploy passes
- newsroom loader ON
- TV owner ON
- utility footer ON
- sitewide footer-gap guard ON
- retired dark theme OFF
- retired article subscribe CTA OFF

Previous scheduled health failures were false alarms caused by stale required marker gbm-home-stable-boot. The checker was repaired to recognize the current newsroom boot markers.

## Mac diagnostic state

A clean detached worktree was used at:
/tmp/gatorbait-controller-diag

Base diagnostic:
- Failures: 0
- Warnings: 13

Native Claude:
- installed at ~/.local/bin/claude
- authenticated
- real first-party Anthropic call succeeded
- Claude rejected a canned CLAUDE_OK prompt because it correctly treated the repo instructions as requiring real verification
- consider native Claude operational

Native Codex:
- installed later as v0.155.0
- authenticated
- model selected: gpt-5.6-sol low
- current usage quota exhausted until Sep 20, 2026 12:26 AM
- startup also reported:
  - Robinhood MCP OAuth required
  - one malformed Twilio skill missing YAML frontmatter
  - skill context overloaded: 945 additional skills omitted
- Codex is not required for the controller and should remain optional backup, not part of the primary daily loop

FCC:
- not installed
- intentionally deferred for now to reduce complexity

n8n / Docker:
- not installed/running on the Mac at diagnostic time
- optional; only add if a recurring automation has a concrete business purpose

Launchd model-worker queue:
- not installed
- optional while native Claude is used interactively

## Current simplification decision

Brenden explicitly wants fewer cooks in the kitchen.

Preferred operating setup:
Brenden → Controller contract → native Claude on Mac → verified action

ChatGPT may also operate as the controller interface when Brenden is here, using the same repo policy/runbook. Do not create competing controllers.

Do not reactivate FCC, Codex routing, n8n, or additional agent layers merely because they exist in the repo. Add a layer only when there is a defined job it improves.

## GatorBait working conventions

- Old-school journalism + new tech
- professional, neutral, truth-centered tone
- Florida orange/blue/white
- magazine/front-page feel
- mobile-first QA
- no AI faces for AP-mode sports graphics unless real supplied photography is used
- 16:9 broadcast thumbnails
- accurate helmets/logos
- avoid "AI slop"
- show packaging: strong SEO title, concise description, no guest names in title unless specifically warranted
- newest content first
- keep public UX familiar and publisher-like, not experimental

## If Brenden says "Controller"

Treat it as a request to use this architecture and continuity state.

Before substantial work:
1. read this handoff and current runbook
2. inspect current state rather than relying on old revisions
3. execute within policy
4. verify independently
5. record durable changes back to GitHub/runbook/coordination thread when material

Do not tell Brenden to repeat information already captured here.
