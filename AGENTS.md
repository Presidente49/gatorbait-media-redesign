# GatorBait Media — Master Control Entry

This repository uses **Master Control**, a single-controller operating model.

The filename remains `AGENTS.md` for compatibility. Models, sub-agents, plugins, review lanes, scripts, automations, and external systems are subordinate tools. They may inspect, research, draft, test, or return bounded recommendations; they do not become peer controllers or race production writes.

## Current owner coordination — September 23, 2026

- Latest creative mandate and verified rollout: `docs/CREATIVE-DIRECTION-2026-09-23.md`. Owner authorizes controller design decisions and bounded workers; retain one production writer, distinct free homepage/Magazine, and mobile stability. Newsletter publication name is **GatorBait Magazine Newsletter**. Reuse the eight existing Wix Groups records; do not create duplicate communities. Read the stated remaining verification/access limits before claiming completion.

- Canonical repository: `Presidente49/gatorbait-media-redesign`. Production Wix site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115` at `https://www.gatorbaitmedia.com/`.
- Start with the opening and newest comments of GitHub **issue #3**, then `docs/SITEWIDE-DESIGN-AUDIT-2026-09-23.md`. These are the shared current handoff, not a new parallel control system.
- Before local edits, verify the Git remote, working directory, branch, HEAD and uncommitted state. Compare with current main without resetting or discarding work. Do not operate in a similarly named repo or old preview checkout by assumption.
- The current approved product is the **free sports-news homepage with Magazine separate**. Older Newsroom/Gazette-default language in chats, policy examples, snapshots or runbooks is superseded; it never authorizes a restoration.
- Scheduled Revenue Watch, Editorial Route, Trend Sweep and Design Review are **read-only for live Wix content/settings/embeds, production assets and routing**. They may inspect, research and record meaningful findings in existing issues. They must not publish/reschedule articles, send emails, deploy designs or change routing. By the Numbers remains draft-only.
- A worker opening Claude/Codex starts with inspection, not automatic execution of an old task. The active controller must own the work item and delegate any bounded write. Record the actual worker/session and scope in issue #3; an unacknowledged handoff is not completed work.
- Latest owner direction, September 28: preserve the front page and give the **Magazine its own lead article and a distinctly urban portrait cover**. The current edition leads with Franz Beard's "Who Are These Guys?"; do not automatically replace it with the homepage's Buddy lead. Preserve one canonical URL and one primary editorial home per story; keep remaining news lists newest-first. Current implementation and rollback are in `deploy/magazine-urban/`; current coordination is issue #34.
- Credit every story's actual writer. Brenden authorizes **Brenden Martin** for his AI-assisted pieces carrying generic Staff or missing credits; preserve explicit named-writer bylines and separate photographer credits. Do not apply that authorship claim indiscriminately to historical staff archives. Follow the attribution and fact-check gate in `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md`.
- Permanent football reference: reuse the existing guide at `/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play`, with `#roster` and `#schedule` links. Source and maintenance notes are in `deploy/roster-schedule/`. The front-page right column and Magazine contents now link to it; future roster references should use this resource instead of generating another matchup-specific guide. Keep the source-check date accurate; it is not an automatic live data feed.
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
- **Media permanence gate:** no live Wix article may reference an image, photo, graphic, roster, schedule or other visual until that asset is stored in the production Wix Media Manager. Use `MEDIA / ARTICLES / YYYY / MM-MMM / YYYY-MM-DD <Story Name>` for article assets, create missing folders first, and use the resulting Wix media ID/URL. Never hotlink or depend on temporary/local/chat-transfer assets. Full rule: `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` section 1A.
- Measured repeated outcomes may graduate into reviewed playbooks; they do not silently rewrite money, safety, approval, or customer-data boundaries.
- Persistent defects converge on one owned work item/issue instead of spawning duplicate fixes or duplicate alerts.
- After an authorized mutation, run primary verification plus an independent evidence check when practical; do not stack a second production patch in the same cycle.
- Recurring automations should maintain unchanged incidents silently and notify Brenden only on material change, a verified fix, a new revenue-impacting action, or a real human blocker.
- Do not delete repos, folders or Wix sites based on names. Older-named directories can still contain live shared adapters, routing or rollback assets. Verify dependencies before any separately authorized cleanup.

## Invocation

When Brenden says **Master Control**, **Controller**, **Chris**, or legacy **God Mode for Chris**, use the canonical Master Control skill and complete authorized reversible work end to end with concise updates and independent verification. Invocation does not lift the scheduled-task read-only boundary.

@RTK.md

<!-- BEGIN shared-agent-memory-project -->
## Project shared memory

This repo has project-local shared memory in `.shared-memory/`.

- Use project memory for repo-specific facts, TODOs, decisions, and handoffs.
- Use global memory only for user-wide preferences or cross-project context.
- Never store API keys, tokens, passwords, cookies, private keys, `.env` values, authorization headers, or credential-bearing URLs. Save only environment-variable names or `[REDACTED]`, and never edit `memory.json` directly.
- Use the project activity board for edit coordination:
  - `shared-agent-memory claim <files> --as codex --note "<task>"`
  - `shared-agent-memory board`
  - `shared-agent-memory release --as codex`
- If your AI tool does not automatically read this file, ask it to read `.shared-memory/INSTRUCTIONS.md` before working in this repo.
<!-- END shared-agent-memory-project -->
