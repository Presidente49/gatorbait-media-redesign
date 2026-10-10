# GatorBait Media — Master Control Entry (Codex, ChatGPT and other tools)

This repository uses **Master Control**, a single-controller operating model. The filename stays `AGENTS.md` for compatibility. Models, sub-agents, plugins, review lanes, scripts and automations are workers: they inspect, research, draft, test and return bounded recommendations. They do not become peer controllers or race production writes.

**Read `docs/START-HERE.md` first.** It names the two live sources (GitHub issue #34 and `skills/master-control/references/CURRENT-STATE.md`), the read order, the standing editorial rules and the hard lines. This file defers to it. `CLAUDE.md` is the same signpost for Claude Code.

Canonical repository: **Presidente49/gatorbait-media-redesign**. Production Wix site: **18fb3a4e-d7f6-414a-aeb9-3047db3ea115** at `https://www.gatorbaitmedia.com/`.

## On open: start read-only

Verify the Git remote, working directory, branch, HEAD and uncommitted state; compare with `main` without resetting or discarding work. Read the newest #34 comments. State the work item the controller assigned; a posted handoff is not an acknowledged one. Then load `skills/master-control/SKILL.md` (via `.codex/skills/master-control/SKILL.md`) and the smallest specialist playbook.

Scheduled monitors (Revenue Watch, Editorial Route, Trend Sweep, Design Review) are read-only for live Wix content, settings, embeds, assets and routing. By the Numbers stays draft-only.

## Production coordination

- One designated controller/writer owns live mutations. Read the current entity and revision before changing it.
- Define success and rollback before the mutation; make the smallest reversible change; verify from public, runtime or provider evidence. A model saying "fixed" is not verification.
- Prefer a shared-layer repair over page-specific hacks. Never restore retired themes, permanent rapid polling, first-paint hiding or broad CSS selectors without a tested reason.
- Generated social, email or publication output is a draft unless the active request authorizes that send.
- **Media permanence gate:** no live article references an image, graphic, roster or schedule until the asset is in the production Wix Media Manager (`MEDIA / ARTICLES / YYYY / MM-MMM / YYYY-MM-DD <Story Name>`). Never hotlink temporary assets. Full rule: `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` section 1A.
- Persistent defects converge on one owned work item; no duplicate fixes or duplicate alerts. After an authorized mutation, run primary verification plus an independent check; do not stack a second production patch in the same cycle.
- Recurring automations keep unchanged incidents silent and tell Brenden only on a material change, a verified fix, a revenue-impacting action or a real human blocker.
- Do not delete repos, folders or Wix sites by name. Older-named directories can still hold live adapters, routing or rollback assets.
- Keep credentials and secrets out of the repo.

## Invocation

When Brenden says **Master Control**, **Controller**, **Chris**, **the Copy Desk** or legacy **God Mode for Chris**, use the canonical Master Control skill and complete authorized reversible work end to end with concise updates and independent verification. Invocation does not lift the scheduled-task read-only boundary.

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
