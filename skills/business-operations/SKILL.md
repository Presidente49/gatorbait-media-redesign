---
name: business-operations
description: Run or improve a repeatable business workflow with accountable handoffs, quality gates, measured learning and project-specific context. Use for cross-team operations, reusable business playbooks, stalled handoffs, or turning verified outcomes into portable skills. This is a knowledge skill under the existing project controller, not a new scheduler or autonomous business service.
metadata:
  version: "1.0.0"
---

# Business Operations

Use one portable method with a separate profile for each business. Keep the full upstream specialist library intact; load only the relevant skill, not its entire catalog. A skill is reusable instructions and tests, not a connection, running worker, model-training update or permission grant.

## Start with the selected business

1. Read the current project's entry instructions, active controller/work item and explicit scope. Bind the business identity before reading client data or choosing destinations. Never borrow another client's credentials, audience, examples or permission.
2. Load the project's adapter. Without an adapter, use [the blank profile](references/project-profile.example.json) to identify missing essentials. Work read-only until identity, ownership and action authority are established. Do not create another database or work queue to hold the profile.
3. Resolve prior handoffs and measured outcomes in the existing record before new work. Live provider state wins over snapshots; actual user authorization still bounds what can change.
4. Read [the operating contract](references/operating-contract.md). Preserve the existing cadence, single writer and applicable approval/consent rules.

## Choose the smallest specialist

The full MIT-licensed MarketingSkills repository is the pinned upstream library, not a second controller. Its normal project location in this package is `.agents/marketingskills/`. Verify [sources.lock.json](sources.lock.json) before use. See [installation and portability](README.md).

- Recurring work and business handoffs: `skills/marketing-loops/SKILL.md`, then only the needed loop reference.
- Company, audience and positioning: `skills/product-marketing/SKILL.md`.
- Measurement or attribution: `skills/analytics/SKILL.md` or `skills/attribution/SKILL.md`.
- Revenue-process diagnosis: `skills/revops/SKILL.md`; retention: `skills/churn-prevention/SKILL.md`.
- Reader/customer conversion: `skills/cro/SKILL.md`.
- Content, editorial promotion and email: `skills/content-strategy/SKILL.md`, `skills/copywriting/SKILL.md` or `skills/emails/SKILL.md`.
- Search and canonical hygiene: `skills/seo-audit/SKILL.md` or `skills/schema/SKILL.md`.

Those paths are relative to the upstream root. The local project specialist owns execution when one already exists. Upstream recommendations about scheduling, paid advertising, outreach, installations, prices or account changes never override the project's boundaries. Tool guides and commercial partner suggestions are optional references, not installed capabilities. Do not run upstream shell/CLI code just because it is in the library.

## Run one bounded iteration

**Inspect → compare → diagnose → prepare → check → hand off → verify acceptance → record → recheck.**

State the objective and one success measure, available baseline/time window, authoritative inputs, action condition, owner, smallest allowed action, verification, rollback and stop condition. A check does not require an action. Distinguish a real failure from stale expectations, provider lag, missing permissions and incomplete evidence.

The producing stage remains accountable for follow-through until the actual receiving session accepts the exact work item, stage and artifact revision. A posted ticket or successful dispatch is not acceptance. A deterministic record check can reject incomplete evidence; it cannot authenticate an external event by itself.

Use the existing provider/issue record and [the handoff gate](scripts/gate.py) for structural QC. No new service, scheduler, background process or parallel queue is created by this skill. Follow the existing authorized mutation limit. A failed verification never authorizes a stack of patches or a repeat send.

## Learn at the right level

Read [the learning contract](references/learning-contract.md). Classify each outcome as retained, rejected, inconclusive, or verified recovery. Store observations with their project in its existing record. Only reviewed, supported and de-identified transferable patterns may amend the general skill. Company choices amend only that project's adapter; current metrics and IDs stay in current-state/provider records. Do not turn one successful test into a universal rule or promise a business lift.

A promoted change needs evidence, counterexamples, scope, review, a version change and a regression test. Later contradictions retire or narrow the lesson. Reading a repo alone is not learning; updating a tested reusable method from evidence is.

## Output

Return only what the next stage needs: current state, exact deliverable/revision, QC evidence, real owner/receiver, acceptance reference or missing blocker, next action and one success measure. Label DRAFT, PREPARED, ACCEPTED and VERIFIED distinctly. Keep unfinished handoffs OPEN on the existing cadence without repeated unchanged alerts. Finish the objective when independently verified or explicitly reviewed/rejected; do not invent another stage to keep a loop alive.
