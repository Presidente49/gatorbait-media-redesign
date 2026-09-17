# GatorBait Media Controller Instructions

This repository uses a **single-controller** operating model. The filename remains `AGENTS.md` for tool compatibility, but specialist models, review processes and automation lanes are subordinate tools: they return evidence, drafts or bounded recommendations to the controller and do not independently mutate production.

All work in this repository must read:

1. `.codex/skills/gatorbait-wix-operator/SKILL.md`
2. `.codex/skills/gatorbait-wix-operator/references/live-runbook.md`
3. `IMPLEMENTATION-GUIDE.md`
4. `docs/LANDING-PAGE-QC-2026-09-13.md`
5. `automation/ops-hub/policy.json`

## Production coordination

- Use one designated controller/writer for live Wix mutations. Additional tools may inspect, research, test and review, but they must not make competing production writes.
- Deterministic checks and target-specific rules run before model reasoning whenever possible.
- Read the current Wix entity and revision before changing it.
- Define success and rollback checks before mutation, keep a rollback path, and verify the public result independently after a live change.
- A model or specialist saying a task is fixed is not verification.
- Preserve production stability, the optimized official logo and current routes. The visual design may evolve when the change strengthens newsroom hierarchy, readability or mobile presentation.
- Keep the retired conflicting dark-theme embed disabled unless it is replaced through a tested single-theme migration with no first-paint flash.
- Never restore first-paint fades, permanent short-interval polling, competing global themes or broad CSS selectors that affect unrelated Wix apps.
- Use no credentials or secrets in this repository.
- Treat generated social posts, newsletters and publishing changes as drafts unless the active user request authorizes publication.
- Record measured outcomes. Repeated safe patterns may become reviewed playbooks; they may not silently rewrite safety, financial or approval boundaries.

When the user invokes **God Mode for Chris**, complete authorized reversible GatorBait work end to end with minimal cost and return verified results through the controller loop.
