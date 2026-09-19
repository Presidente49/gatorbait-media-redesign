# Master Control Audit — 2026-09-19

## Why this change

The GatorBait repository had accumulated several overlapping controller documents, dated handoffs, runbooks, surface skills, and old redesign plans. Some contained contradictory or stale live-state claims.

The problem was not lack of instructions. It was mixing **durable doctrine** with **mutable production state**.

## Audit findings

### 1. The single-controller principle was already correct

Existing `AGENTS.md`, `CLAUDE.md`, the Wix operator skill, and Ops Hub policy all converged on:

- one controller
- one production writer
- bounded workers
- deterministic gates
- rollback
- external verification
- record/learn loop

Master Control preserves this and makes it the canonical entrypoint.

### 2. Mutable facts were embedded inside long-lived doctrine

Examples found during the audit:

- dated Wix embed revisions
- point-in-time automation statuses
- campaign draft/send states
- local Mac tool availability/quota
- OAuth connection status
- traffic/email/social counts

These facts age much faster than brand or production doctrine.

Master Control moves current continuity into `references/CURRENT-STATE.md` and explicitly requires live re-reads.

### 3. Repository docs contained contradictions

A dated live runbook recorded one blog-email automation as disabled and another as active; the newer Sept. 19 handoff later recorded the opposite mapping after correction.

A dated campaign entry also described an ID as a specific unsent pregame draft even though later work reused/changed the campaign state.

Conclusion: automation/campaign friendly names and historical descriptions cannot be production identity.

### 4. An old design plan is materially superseded

`wix-site-management-playbook.md` (March 2026) still advocates a dark ESPN+/Athletic redesign, category-heavy nav, and other assumptions that conflict with the current light magazine/newsroom direction.

It remains useful historical evidence but must not be treated as current UX authority.

### 5. Context overload was already causing operational noise

The repo contained many workers/skills/model-router/n8n/FCC paths. Local diagnostics also reported very large skill context.

Master Control therefore follows progressive disclosure:

- load canonical skill first
- load current state only when needed
- load one relevant specialist surface
- do not preload every historical document or worker

### 6. Business operations need a data-first rule

Recent operating evidence showed:

- high-engagement stories can be underdistributed despite modest views
- duplicate URLs can split value
- targeted email cohorts can beat broad sends
- social metric feeds can lag
- GA4 channel grouping can misclassify owned email traffic
- search pages with strong impressions and weak CTR are monetization opportunities
- unused ad inventory can leave real traffic unmonetized

Master Control makes performance evidence a gate before resend/repost/SEO/ad-expansion decisions.

## Cross-platform skill design

The canonical skill is:

`skills/master-control/SKILL.md`

Thin discovery wrappers are provided for:

- Claude Code: `.claude/skills/master-control/SKILL.md`
- Codex: `.codex/skills/master-control/SKILL.md`

Both point back to the same canonical source.

This follows the Agent Skills model: a focused `SKILL.md` plus optional references, with progressive loading instead of copying a giant permanent prompt into every session.

## New canonical structure

```
skills/master-control/
├── SKILL.md
└── references/
    ├── CURRENT-STATE.md
    ├── DOCTRINE.md
    └── LESSONS.md
```

- **SKILL.md** — operating contract, truth hierarchy, controller loop, permissions, routing.
- **DOCTRINE.md** — durable GatorBait business/product/editorial/monetization rules.
- **LESSONS.md** — repeated failure patterns and measured operating lessons.
- **CURRENT-STATE.md** — intentionally expiring continuity facts.

## Rule for future learning

A new finding belongs in:

- **CURRENT-STATE** if it is volatile.
- **LESSONS** if it is a repeated/evidence-backed operational pattern.
- **DOCTRINE** if it is a durable owner-approved business/product rule.
- a **surface playbook** if it is implementation-specific.
- nowhere permanent if it is a one-off anecdote with no future value.

Never solve drift by endlessly appending exceptions to a giant prompt.

## Follow-up cleanup

Do not delete historical files simply because Master Control exists.

Instead:

1. treat Master Control as canonical
2. label/reframe superseded docs when they are next touched
3. migrate useful current implementation details into the appropriate specialist runbook
4. delete only genuinely retired artifacts after verified replacement/rollback review
