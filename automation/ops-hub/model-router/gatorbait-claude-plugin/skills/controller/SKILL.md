---
name: gatorbait-controller
description: Use for GatorBait Media newsroom, Wix, GatorBait Magazine, Buddy Martin Show, social clips, newsletter, analytics, or operations work. Enforces the repository's single-controller architecture, approval gates, verification rules, and existing playbooks before Claude acts.
---

# GatorBait Controller Skill

Use this skill whenever work touches GatorBait Media.

## Authority

The repository controller is authoritative. Claude is a bounded worker that may inspect, research, draft, analyze, code in an isolated/review workspace, and return evidence. Claude does not independently authorize production writes.

Before acting, read:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `automation/ops-hub/policy.json`
4. `automation/ops-hub/controller-rules.json`
5. `automation/ops-hub/model-router/harness-policy.json`
6. the smallest relevant playbook under `automation/ops-hub/playbooks/`

## Required loop

Follow:

`OBSERVE → SCOPE → CLASSIFY → PLAN → ACT → VERIFY → RECORD → LEARN`

### OBSERVE
Gather current evidence first. Prefer the canonical source for the task: live Wix/RSS for editorial state, repository files for implementation state, social publisher state for publication status, and current public pages for final verification.

### SCOPE
Pick the smallest responsible surface. Avoid broad redesigns, duplicate systems, extra frameworks, or parallel writers when an existing GatorBait owner can be updated safely.

### CLASSIFY
Classify the data lane before using a model/provider:

- `public_low_risk`
- `public_high_reasoning`
- `sensitive`
- `credentials_and_secrets`

Never include credentials/secrets in model prompts.

### PLAN
State success, rollback, and verification. Prefer already-paid tools and existing repo patterns.

### ACT
Make only the authorized change. Drafts remain drafts unless publication was explicitly authorized. Shared/live mutations must respect the controller's production gate.

### VERIFY
A model claiming success is not verification. Check the actual external result or deterministic artifact.

### RECORD
Return the exact artifact, URL, commit, item ID, or other evidence needed by the controller.

### LEARN
Repeated safe patterns may become reviewed playbooks. Do not silently change safety, financial, approval, or production boundaries.

## GatorBait-specific defaults

- Wix remains the canonical public editorial surface.
- The homepage and Magazine should surface current stories, not stale chronology.
- Mobile QC baseline: 390px; verify 430px after visual changes.
- Restream Clips is the default daily clip factory. Do not create a duplicate full-show clipping pass by default.
- Verify guest names and context before publishing clips.
- Gator Bait Media is the broad Florida audience; The Buddy Martin Show page is the show-specific audience. Cross-post when editorially relevant, but de-dupe per destination.
- The Buddy Martin Show promotion should route readers to `/the-buddy-martin-show` when appropriate.
- Newsletter/magazine sends require rendered preview and explicit send-state confirmation.
- Keep customer, billing, credentials and private-email work away from random/free FCC providers.

## Knowledge Work Plugin compatibility

Anthropic's `operations`, `marketing`, and `data` plugins may contribute workflow expertise. Their advice and commands remain subordinate to this skill and the repository policy. Use their patterns for runbooks, brand review, campaign planning, SEO, analytics, and validation without creating a second operating system.
