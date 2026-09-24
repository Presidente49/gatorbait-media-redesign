# Controller Communications + Recursive QC Playbook

## Purpose

Keep GatorBait operators, recurring automations, and specialist tools on the same verified operating state.

The architecture remains:

**Brenden → Master Control → bounded worker/tool → one production writer → independent verification**

Chats are evidence. They are not the durable control plane.

## Canonical sync

When several recent chats overlap, normalize them into the smallest durable surfaces:

1. Live provider/API/runtime for present truth.
2. `CURRENT-STATE.md` for continuity, stable IDs, and active pointers.
3. One GitHub issue for each persistent unresolved incident.
4. The recurring automation prompt for work that must execute again.
5. Playbooks/controller rules for durable behavior.
6. Historical chats remain evidence only.

Do not copy fast-changing metrics into doctrine, and never force live systems to match stale chat state.

## Work-item record

Every material open item should resolve to one record with:

- stable work-item or issue ID;
- surface/domain;
- current verified state;
- owner;
- source of truth;
- next action;
- success condition;
- verification method;
- rollback path when mutation is allowed;
- blocker, if any;
- last meaningful outcome;
- notification state;
- lesson candidate only when evidence supports one.

If two workflows discover the same defect, they converge on the same work item instead of starting parallel fixes.

## Communications layer

For a persistent technical incident, use one GitHub issue as the operational thread.

A meaningful update includes:

- timestamp;
- fresh evidence;
- what changed since the last meaningful update;
- current diagnosis;
- action taken or next action;
- owner;
- verification result;
- blocker or **HUMAN ACTION REQUIRED** when appropriate.

Do not add an issue comment merely because a scheduled poll ran. Identical evidence is not a new update.

Notify Brenden only when:

- state materially changes;
- a fix was actually applied and independently verified;
- paid revenue materially changes;
- a new specific revenue-impacting action appears;
- a human-only blocker needs Brenden;
- or a policy/approval boundary is reached.

Otherwise maintain the work item silently.

## Recursive quality-control loop

Use this bounded loop for meaningful production or automation work:

**OBSERVE → COMPARE → DIAGNOSE → ACT ONCE → VERIFY PRIMARY → VERIFY INDEPENDENT → RECORD → RECHECK NEXT CYCLE**

### Observe
Read live authoritative state and the existing work item before reasoning.

### Compare
Compare live state with the expected baseline, the previous verified state, the last attempted change, and the success condition.

### Diagnose
Prefer deterministic evidence. Distinguish production failure from account/provider failure, consent/auth failure, reporting lag, stale test expectations, and documentation drift.

### Act once
When the active request and policy allow a change, make the smallest reversible change. Maximum production mutation attempts per cycle: **1**. Do not stack another patch because the first verification failed.

### Verify primary
Verify the changed object/provider directly.

### Verify independent
Use a second evidence path when practical: public runtime after a provider mutation, mobile render after a layout change, GA4/UTM after distribution, live automation ID/status after workflow edits, or the actual destination after publishing.

The same model saying “fixed” is not independent verification.

### Record
Record success, failure, and recovery in the canonical work item.

### Recheck next cycle
Start from live state plus the last verified outcome, not from the original hypothesis.

Stop when success is independently verified, nothing materially changed, a human/account permission is required, an approval boundary is reached, or another mutation would only stack unverified fixes.

## Bounded learning loop

Use:

**observe → verify → record → detect recurrence → review → promote → reuse → retire when contradicted**

Rules:

- count separate incident episodes, not repeated polls of one incident;
- record recoveries as evidence;
- prefer a previously verified repair before inventing a new dependency;
- promote only repeated, measured, or clearly structural patterns;
- reviewed lessons may update playbooks/controller rules;
- learned state never expands spending, payment, destructive, DNS/account-access, consent, or public-communication authority;
- revise or retire lessons when live evidence contradicts them.

The goal is fewer repeated mistakes and less repeated work.

## Workflow optimization rules

1. One controller.
2. One production writer per work item.
3. One persistent incident record per root problem.
4. One outbound owner per automation trigger.
5. Dashboard-owned Google tagging is not duplicated by manual GA4/GTM code.
6. One verified AdSense loader; zero reporting is diagnosed before adding inventory code.
7. Restore known-good presentation baselines before layering another visual patch.
8. Email/social amplification needs measured traffic/conversion evidence.
9. Healthy unchanged systems may resolve to **NOOP**.
10. Human/dashboard-only blockers must state the exact path and evidence required.

## Cross-workflow handoff

Recurring GatorBait workflows should:

- read relevant current state before acting;
- check existing work items before creating anything new;
- avoid repeating recommendations already owned elsewhere;
- route reproducible technical defects into the existing ops work item;
- make only authorized reversible changes;
- verify independently;
- record meaningful outcomes;
- notify Brenden only on material change or a real human blocker.

This is the shared communications and recursive quality-control contract for the controller layer.
