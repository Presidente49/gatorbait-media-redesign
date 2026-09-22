# GatorBait Media — Master Control Entry

This repository uses **Master Control**, a single-controller operating model.

The filename remains `AGENTS.md` for compatibility. Models, sub-agents, plugins, review lanes, scripts, automations, and external systems are subordinate tools. They may inspect, research, draft, test, or return bounded recommendations; they do not become peer controllers or race production writes.

## Canonical read order

For substantial GatorBait work:

1. `skills/master-control/SKILL.md`
2. `skills/master-control/references/CURRENT-STATE.md` only when current live facts matter
3. the smallest relevant Master Control reference or specialist skill
4. `automation/ops-hub/policy.json` and `controller-rules.json` when production mutation/automation policy matters
5. `automation/ops-hub/playbooks/controller-communications-qc.md` for recurring automation handoffs, persistent incident routing, alert deduplication, recursive QC, and bounded learning
6. the relevant current surface playbook/runbook

Do **not** load every historical document by default.

The old `wix-site-management-playbook.md` is historical design context, not current UX authority.

For any homepage/front-page work, `docs/HOMEPAGE-BASELINE-LOCK.md` is the canonical presentation authority. The locked default is the standalone Newsroom homepage; do not expose the old Wix shell, Today's Edition, or Monday Chomp, and do not materially change the baseline without explicit Brenden approval.

Dated sections in long runbooks are historical evidence unless live provider state confirms them.

## Truth rule

When sources disagree:

**live provider/API/runtime → current object/revision → Master Control current state → durable doctrine/policy → current surface playbook → historical docs/chats → model assumptions**

Friendly names are not sufficient identity for automations, campaigns, embeds, or workflows.

## Production coordination

- One designated controller/writer owns live mutations.
- Read the current entity and revision before changing it.
- Prefer deterministic checks before model reasoning.
- Define success and rollback before mutation.
- Make the smallest effective reversible change.
- Verify from public/runtime/provider evidence.
- A model saying "fixed" is not verification.
- Prefer a shared-layer repair over repeated page-specific hacks.
- Never restore retired competing themes, permanent rapid polling, first-paint hiding, or broad CSS selectors without a tested reason.
- Keep credentials/secrets out of the repo.
- Generated social/email/publication output is draft unless the active request authorizes that publication/send.
- Measured repeated outcomes may graduate into reviewed playbooks; they do not silently rewrite money, safety, approval, or customer-data boundaries.
- Persistent defects converge on one owned work item/issue instead of spawning duplicate fixes or duplicate alerts.
- After an authorized mutation, run primary verification plus an independent evidence check when practical; do not stack a second production patch in the same cycle.
- Recurring automations should maintain unchanged incidents silently and notify Brenden only on material change, a verified fix, a new revenue-impacting action, or a real human blocker.

## Invocation

When Brenden says **Master Control**, **Controller**, **Chris**, or legacy **God Mode for Chris**, use the canonical Master Control skill and complete authorized reversible work end to end with concise updates and independent verification.

@RTK.md
