# GatorBait Media — Master Control Entry

This repository uses **Master Control**, a single-controller operating model.

The filename remains `AGENTS.md` for compatibility. Models, sub-agents, plugins, review lanes, scripts, automations, and external systems are subordinate tools. They may inspect, research, draft, test, or return bounded recommendations; they do not become peer controllers or race production writes.

## Current owner coordination — September 23, 2026

- Canonical repository: `Presidente49/gatorbait-media-redesign`. Production Wix site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115` at `https://www.gatorbaitmedia.com/`.
- Start with the opening and newest comments of GitHub **issue #3**, then `docs/SITEWIDE-DESIGN-AUDIT-2026-09-23.md`. These are the shared current handoff, not a new parallel control system.
- Before local edits, verify the Git remote, working directory, branch, HEAD and uncommitted state. Compare with current main without resetting or discarding work. Do not operate in a similarly named repo or old preview checkout by assumption.
- The current approved product is the **free sports-news homepage with Magazine separate**. Older Newsroom/Gazette-default language in chats, policy examples, snapshots or runbooks is superseded; it never authorizes a restoration.
- Scheduled Revenue Watch, Editorial Route, Trend Sweep and Design Review are **read-only for live Wix content/settings/embeds, production assets and routing**. They may inspect, research and record meaningful findings in existing issues. They must not publish/reschedule articles, send emails, deploy designs or change routing. By the Numbers remains draft-only.
- A worker opening Claude/Codex starts with inspection, not automatic execution of an old task. The active controller must own the work item and delegate any bounded write. Record the actual worker/session and scope in issue #3; an unacknowledged handoff is not completed work.
- Latest owner editorial direction: **Buddy Martin is the editorial lead across the homepage, Magazine and curated multi-story packages, without redundant publication or sends**. Preserve one canonical URL and one primary editorial home per story; keep remaining news lists newest-first. Record and verify the implementation separately rather than claiming this notice changes the live layout.
- Email automation identity must be checked from the actual live automation/action/message and content. The current publishing-email playbook supersedes older USER-origin/PREINSTALLED-origin shortcuts in controller rules. Do not flip live workflows to match stale text. Active configuration and a successful preview are not delivery evidence.

## Canonical read order

After the current-owner preflight above, for substantial GatorBait work:

1. `skills/master-control/SKILL.md`
2. `skills/master-control/references/CURRENT-STATE.md` only when current live facts matter
3. the smallest relevant Master Control reference or specialist skill
4. `automation/ops-hub/policy.json` and `controller-rules.json` when production mutation/automation policy matters
5. `automation/ops-hub/playbooks/controller-communications-qc.md` for recurring automation handoffs, persistent incident routing, alert deduplication, recursive QC, and bounded learning
6. the relevant current surface playbook/runbook

Do **not** load every historical document by default.

The old `wix-site-management-playbook.md` is historical design context, not current UX authority.

For any homepage/front-page work, `docs/HOMEPAGE-BASELINE-LOCK.md` is the canonical presentation authority, read together with the latest owner handoff in issue #3. Preserve the approved free sports-news homepage, separate Magazine, unified mobile shell and no-jump architecture. Do not expose the old Wix shell, Today's Edition or Monday Chomp, and do not materially change the baseline without explicit Brenden approval.

Dated sections in long runbooks are historical evidence unless live provider state confirms them.

## Truth rule

When sources disagree:

**live provider/API/runtime → current object/revision → Master Control current state → durable doctrine/policy → current surface playbook → historical docs/chats → model assumptions**

Friendly names are not sufficient identity for automations, campaigns, embeds, or workflows. Live state establishes what exists; it does not expand the owner's current approval boundaries.

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
- Do not delete repos, folders or Wix sites based on names. Older-named directories can still contain live shared adapters, routing or rollback assets. Verify dependencies before any separately authorized cleanup.

## Invocation

When Brenden says **Master Control**, **Controller**, **Chris**, or legacy **God Mode for Chris**, use the canonical Master Control skill and complete authorized reversible work end to end with concise updates and independent verification. Invocation does not lift the scheduled-task read-only boundary.

@RTK.md
