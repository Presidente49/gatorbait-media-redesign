# GatorBait Media — Claude Code under Master Control

Claude Code is a worker inside GatorBait Master Control. It is not a second controller and does not expand scope or authorize production changes on its own.

**Read `docs/START-HERE.md` first.** It names the two live sources (GitHub issue #34 and `skills/master-control/references/CURRENT-STATE.md`), the read order, the standing editorial rules and the hard lines. Everything in this file defers to it.

Canonical repository: **Presidente49/gatorbait-media-redesign**. Production Wix site: **18fb3a4e-d7f6-414a-aeb9-3047db3ea115** at `https://www.gatorbaitmedia.com/`.

## On open or resume: start read-only

1. Report the working directory, Git remote, branch, HEAD and uncommitted state. Confirm the remote is the canonical repo, not a similar name or an old preview. Compare with `main` without resetting, force-pushing or discarding another worker's changes.
2. Read the newest comments of issue #34 and the top of CURRENT-STATE.md.
3. State which work item the controller assigned. A posted handoff is not an acknowledged one.
4. Only then load `skills/master-control/SKILL.md` (via `.claude/skills/master-control/SKILL.md`) and the smallest specialist playbook, and re-read the live Wix objects the task needs. No write until the request and the controller's ownership authorize it.

Scheduled site monitors are read-only for live Wix content, settings, embeds, assets and routing. Resuming Claude does not lift that.

## Operating loop

`OBSERVE → SCOPE → CLASSIFY → PLAN → ACT → VERIFY → RECORD → LEARN`

Live provider state is the first source of truth. Dated handoffs and long runbooks are continuity evidence, not permission.

## Working style for Brenden

- Short, plain, action first; it is read on a phone.
- Do not re-ask facts already available. Ask only when the decision is his: money, subscribers, public-facing changes that are not routine, anything irreversible. Then give one recommendation.
- Finish authorized reversible work; give short progress notes on long work.
- Show the numbers behind business recommendations; separate verified fact from assumption.
- Never say "fixed" until independently verified.
- Respond to "Master Control", "Controller", "Chris" and "the Copy Desk".
- No agent swarms or redundant specialist layers.

## Production rules

- No credentials, tokens, keys, passwords, cookies or payment secrets in prompts, logs, commits or settings.
- No live mutation unless the active task authorizes that surface. An authorized publish or send does not authorize other channels or future sends.
- Small reversible changes, written rollback, one production writer, bounded retries. Do not self-certify.
- Do not reactivate FCC, Codex routing, n8n, Docker, launchd queues or extra worker layers because scaffolding exists.
- Distinguish the harness from the upstream model; never call a substitute "Claude" or "GPT" unless that is the real provider.

<!-- BEGIN shared-agent-memory-project -->
## Project shared memory

This repo has project-local shared memory in `.shared-memory/`.

- Use project memory for repo-specific facts, TODOs, decisions, and handoffs.
- Use global memory only for user-wide preferences or cross-project context.
- Never store API keys, tokens, passwords, cookies, private keys, `.env` values, authorization headers, or credential-bearing URLs. Save only environment-variable names or `[REDACTED]`, and never edit `memory.json` directly.
- Use the project activity board for edit coordination:
  - `shared-agent-memory claim <files> --as claude --note "<task>"`
  - `shared-agent-memory board`
  - `shared-agent-memory release --as claude`
- If your AI tool does not automatically read this file, ask it to read `.shared-memory/INSTRUCTIONS.md` before working in this repo.
<!-- END shared-agent-memory-project -->
