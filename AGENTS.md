# GatorBait Media — Master Control Entry

This repository uses **Master Control**, a single-controller operating model.

The filename remains `AGENTS.md` for compatibility. Models, sub-agents, plugins, review lanes, scripts, automations, and external systems are subordinate tools. They may inspect, research, draft, test, or return bounded recommendations; they do not become peer controllers or race production writes.

## Canonical read order

For substantial GatorBait work:

1. `skills/master-control/SKILL.md`
2. `skills/master-control/references/CURRENT-STATE.md` only when current live facts matter
3. the smallest relevant Master Control reference or specialist skill
4. `automation/ops-hub/policy.json` and `controller-rules.json` when production mutation/automation policy matters
5. the relevant current surface playbook/runbook

Do **not** load every historical document by default.

The old `wix-site-management-playbook.md` is historical design context, not current UX authority.

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

## Invocation

When Brenden says **Master Control**, **Controller**, **Chris**, or legacy **God Mode for Chris**, use the canonical Master Control skill and complete authorized reversible work end to end with concise updates and independent verification.
