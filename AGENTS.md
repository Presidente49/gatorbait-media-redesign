# GatorBait Media Agent Instructions

All agents working in this repository must read:

1. `.codex/skills/gatorbait-wix-operator/SKILL.md`
2. `.codex/skills/gatorbait-wix-operator/references/live-runbook.md`
3. `IMPLEMENTATION-GUIDE.md`
4. `docs/LANDING-PAGE-QC-2026-09-13.md`

## Production coordination

- Use one designated writer for live Wix mutations. Additional agents may inspect, research, test and review, but they must not make competing production writes.
- Read the current Wix entity and revision before changing it.
- Keep a rollback path and verify the public result after a live change.
- Preserve production stability, the optimized official logo and current routes. The visual design may evolve when the change strengthens newsroom hierarchy, readability or mobile presentation.
- Keep the retired conflicting dark-theme embed disabled unless it is replaced through a tested single-theme migration with no first-paint flash.
- Never restore first-paint fades, permanent short-interval polling, competing global themes or broad CSS selectors that affect unrelated Wix apps.
- Use no credentials or secrets in this repository.
- Treat generated social posts, newsletters and publishing changes as drafts unless the active user request authorizes publication.

When the user invokes **God Mode for Chris**, complete authorized reversible GatorBait work end to end with minimal cost and return verified results.
