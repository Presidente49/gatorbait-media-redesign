> **Provenance:** written by a research subagent for Jarvis on Oct. 3, 2026 at Brenden's request ("look for a better agent system on open GitHub, just to see"). Jarvis has not independently re-verified the third-party numbers. Treat star counts and dates as of Oct. 3, 2026. Decision: stay put, adopt nothing, borrow three ideas (see the Oct. 3 section of CURRENT-STATE).

# Agent-system survey: is there anything better than our setup?

For Brenden Martin. Research only. **All numbers checked 2026-10-03.**
Nothing was installed, run, cloned, connected or changed. No credentials were used. TinyFish and the GitHub MCP search tools were not used (web search and fetch only).

Pain points, numbered the way I refer to them below:
**P1** a scheduled routine pointed at an archived chat. **P2** no single board of every department chat. **P3** the hub page drifts from reality. **P4** hand-offs by comment are fragile. **P5** usage limits stall long sessions.

## Bottom line (plain English)

**Stay put. Borrow three small ideas. Adopt nothing.**

Nothing on open GitHub fits our setup better than Jarvis + the department chats + the Control Room + issue #34. Every serious project I found is built for a developer running coding agents on their own computer or server. None of them watches Claude Code *cloud* chats, and none would have caught a routine aimed at an archived chat. The only tool aimed at Anthropic's cloud routines and sessions (Stride Agents) has 4 stars, one maintainer and no commits since April 22.

The useful part is three ideas. All three can be built with what we already have (routines, the Control Room database, issue #34). They are in section 6.

## 1. What the repo already has (verified from the clone)

- **Checked first:** working copy `/home/user/gatorbait-media-redesign`; remote `origin` = `https://github.com/Presidente49/gatorbait-media-redesign` (the canonical repo); branch `magazine-2026/friday-pregame`; HEAD `8c6d37a` (2026-10-03 05:51 UTC); working tree clean. I did not read issue #3 or compare with main, because this is research that touches no production object.
- **How we run today:** one controller (CLAUDE.md, AGENTS.md). Jarvis is the front door. The game-day desk and stats page are back-office Claude cloud sessions. Issue #34 is the record (`skills/master-control/references/CURRENT-STATE.md`, "Who runs what" and "Where coordination happens").
- **Already built, tried or decided:** `automation/ops-hub/` holds a Mac launchd monitor with a local dashboard and 15-minute health checks, a pinned local n8n in Docker, and an FCC free-model router lane whose briefs are waiting on an OpenRouter key (`docs/GROUP-THINK-2026-09-29.md`). `docs/AGENT-AUTOMATION-STACK.md` already chose GitHub Actions plus GitHub Agentic Workflows (manual-only) and already deferred openai-agents-python, activepieces and n8n ("do not install both"; n8n flagged for its Sustainable Use License).
- **Symphony:** I searched the working tree (all file types), every local and remote branch, and all commit messages, case-insensitively, on 2026-10-03, and found no "Symphony" text or files. I cannot confirm from this repo what the retired experiment was; it may live in another repo or an old-named folder.

## 2. How I checked

- Stars, last commit and license come from GitHub's public API and repo-page headers, fetched through Exa on 2026-10-03. The first pass returned a cached copy about a month old (LangGraph's "latest commit" showed Aug 28), so I re-fetched with cache-busting URLs. Those show same-day data (many commits dated Oct 2-3). Rows marked *snapshot* were not re-fetched and are as of about Sep 4.
- "Last commit" = newest commit on the default branch. I read the license text itself for Superset and Inngest, the two GitHub lists as "Other".
- Third-party "best framework" posts disagreed with each other (LangGraph quoted at 31k, 34k and 126k stars). I trust only GitHub's own numbers.

## 3. The six projects

| Project | Kind | Stars | Last commit | License | Would fix | Cost / risk for a non-technical owner on a phone | Verdict |
|---|---|---|---|---|---|---|---|
| **Paperclip** [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | Control plane for a team of agents: board, approvals, budgets, heartbeats | 96,407 | 2026-10-03 | MIT | P2, P3, P4 if all work ran through it; P5 partly (budgets pause an agent at a limit) | Free, but you host a Node server and database (hosted "Paperclip Cloud" is only a waitlist). Created 2026-03-02; 6,302 open issues/PRs; commits every few minutes, so fast churn. Wants to be the controller, which clashes with our one-controller rule. Cannot see our cloud chats (it launches its own agents; adapters listed: Claude Code CLI, Codex, Cursor, HTTP). README says "mobile ready"; not tested. | **BORROW THE IDEA** |
| **OpenAI Symphony** [openai/symphony](https://github.com/openai/symphony) | Issue-tracker-driven orchestration (a spec plus an Elixir reference app) | 27,512 | 2026-09-15 | Apache-2.0 | P1 in concept (re-checks reality every cycle, stops stale runs, retries, flags quiet runs); P4 (the issue state is the hand-off) | Free, but a long-running Elixir service on an always-on machine. It drives OpenAI Codex, not Claude, and needs custom issue statuses. Trackers: Linear, GitHub Issues, Jira, Asana, GitLab. Not something to maintain from a phone. | **BORROW THE IDEA** |
| **Agent Orchestrator (AO)** [ComposioHQ/agent-orchestrator](https://github.com/ComposioHQ/agent-orchestrator) (page header now reads Untrivial-ai) | Live Kanban over many coding agents | 12,626 | 2026-10-03 | Apache-2.0 | P2, P3 (each card's column is computed from session, PR, CI and review facts; a "Needs you" lane includes lost signals) | Free, but a desktop app plus a local background service managing agents it launched in git worktrees on that computer. Cannot see claude.ai chats. Remote/mobile support is new (latest commit: "connect to multiple self-hosted AO machines"). | **BORROW THE IDEA** |
| **Backlog.md** [MrLesk/Backlog.md](https://github.com/MrLesk/Backlog.md) | Tasks as files in git, for people and AI agents | 6,928 | 2026-09-28 | MIT | P4 (structured hand-off fields) | Adds a third place for the record next to #34 and the Control Room; our CLAUDE.md warns against another hand-off hierarchy. Command-line tool. | **SKIP** (borrow the fields only) |
| **LangGraph** [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | Developer framework: saved state, pause for human approval, resume | 42,645 | 2026-10-02 | MIT | P1, P4, P5 in concept, but only if departments were rebuilt as code | Needs a Python developer to write and host it; no board of its own; departments would stop being Claude Code chats. | **SKIP** (borrow "pause, save, resume") |
| **Temporal** [temporalio/temporal](https://github.com/temporalio/temporal) | Durable workflow engine | 23,432 | 2026-10-02 | MIT | P1 and P5 only if jobs were code (timers, retries) | A server cluster plus database, or the paid cloud (price not checked), plus developers. Our jobs are prompts to chats, not code. | **SKIP** |

**ADOPT: none.**

## 4. Short notes

- **Paperclip.** Read from the live README: org chart; tasks with review and approval stages; heartbeats that wake agents on a schedule or when work is assigned; company, agent and project budgets with alerts that pause work; scheduled routines; "works with Claude Code, Codex, Cursor...". Borrow: a "last seen alive" stamp per department (heartbeat), budget alerts, an approvals inbox, an audit trail.
- **Symphony.** Read from SPEC.md and the Elixir README. Each cycle it re-reads the tracker, compares that with what is really running, stops runs that are no longer eligible, retries with back-off, and treats a run that goes quiet as stalled (example config: 5 minutes). Policy lives in a repo file (WORKFLOW.md). It needs no database; it rebuilds from the tracker after a restart. That loop is the watchdog in change 1.
- **Agent Orchestrator.** Its README says a card's position is derived from facts, not dragged by a person. That is the cure for hub-page drift (P3).
- **Backlog.md.** Judged from its GitHub description ("managing project collaboration between humans and AI Agents in a git ecosystem"); I did not read its README. Borrow the fields (owner, status, acceptance check), not the tool.
- **LangGraph and Temporal.** Third-party 2026 comparisons describe LangGraph's per-step checkpoints and its pause-for-a-human primitive (interrupt). Temporal's durable timers and retries are from my background knowledge. Neither was re-verified against its own docs. Both assume developers and code.

## 5. Also checked, and dropped

| Project | Stars | Last commit | License | Why dropped |
|---|---|---|---|---|
| Vibe Kanban (BloopAI/vibe-kanban) | 28,249 | 2026-09-19 | Apache-2.0 | The company behind it shut down 2026-04-10 (its own post, "Goodbye bloop"). The README banner says "Vibe Kanban is sunsetting". A community edition was still being discussed (Discussion #3424). Local board for terminal agents. |
| Crystal (stravu/crystal) | 3,123 | 2026-02-26 (219 days ago) | MIT | Renamed Nimbalyst; repo dormant. |
| Claude Squad (smtg-ai/claude-squad) | 8,420 snapshot | 2026-07-30 snapshot | AGPL-3.0 | Terminal (tmux) app on one computer; phone-hostile; AGPL. |
| Superset (superset-sh/superset) | 14,830 | 2026-10-03 | Elastic License 2.0 (read from LICENSE.md) | Source-available, not open source (bars offering it as a hosted service). Desktop app for local agents. |
| Cline Kanban (cline/kanban) | 1,345 | 2026-09-04 | Apache-2.0 | Local web board for terminal agents in git worktrees ("no cloud service, no account"). Tidy, but small and local-only. |
| Emdash (generalaction/emdash) | 5,575 snapshot | 2026-08-05 snapshot | Apache-2.0 | Same class: desktop app for local agents. |
| Conductor | n/a | n/a | n/a | Not open source as far as I know (not re-checked). |
| n8n (n8n-io/n8n) | 203,263 snapshot | pushed 2026-09-04 snapshot | Sustainable Use License (GitHub shows "Other"; our own docs name it) | Not an open-source license; already tried and retired here. |
| Inngest (inngest/inngest) | 5,907 | pushed 2026-10-03 | SSPL 1.0 plus an Apache-2.0 "future license" (read from LICENSE.md) | Not open source; needs developers. |
| CrewAI, Mastra, OpenAI Agents SDK | 58,060 / 27,661 / 29,171 snapshot | pushed 2026-09-03 / 09-03 / 09-02 snapshot | MIT / "Other" (not read) / MIT | Developer frameworks; same fit problem as LangGraph. AG2 and the Claude Agent SDK were not checked. |
| ccpm (automazeio/ccpm) | 8,361 snapshot | 2026-03-18 (199 days ago) | MIT | GitHub-Issues-as-database for local agents; nothing for 6.5 months. |
| Stride Agents (joshpocock/strideagents) | 4 | 2026-04-22 (164 days ago) | MIT | The only one aimed at Claude cloud routines and sessions, but one maintainer, needs an Anthropic API key plus per-routine tokens, uses the Managed Agents API (README: $0.08 per session-hour plus tokens) and runs its own scheduler worker. Nearly dormant. |
| unsnooze, claude-powernap, cc-autoresume | 167 / 8 / 1 | 2026-09-30 / 2026-07-18 / 2026-05-30 | MIT | Auto-resume after usage limits, but they watch the local `claude` command (terminal panes, `~/.claude` files, hooks), not cloud chats. unsnooze is the only one with traction and might help the Mac session only. claude-powernap's README admits it uses an undocumented usage endpoint ("ToS gray area"). |
| Happy (slopus/happy) | 23,555 snapshot | 2026-10-03 | MIT | Phone/web client for local Claude Code and Codex sessions. Our cloud chats are already reachable from the Claude app (inference). |
| Local session monitors (claude-code-monitor, ccboard, ai-session-manager, claude-code-dashboard) | not checked | not checked | not checked | They read local hook events or `~/.claude` files, so they cannot see cloud chats. |

## 6. Recommendation (plain English)

**Stay put on the platform. Make three small changes, all built from what we already run.** None needs new software, new accounts or new money. Turning on the new morning routine is an "automations on/off" call, so it needs Brenden's yes.

1. **A morning check that every scheduled routine still points at a living chat.** (Fixes P1. Borrowed from Symphony's "re-check reality every cycle" and Paperclip's heartbeats.) Each morning, and again the evening before each game day, one read-only routine lists every scheduled routine, finds the chat it will wake, and confirms that chat is not archived, failed or missing. A routine's own "last run" only says the wake-up message was delivered, not that anything happened, so the check must look at the target chat itself. Any problem becomes one line on the Control Room and one de-duplicated note on #34 (for example "Game-day 9 a.m. routine points at an archived chat"). Start the watchdog in a fresh chat each time so it can never point at a dead one. Add one rule: before archiving any chat, look up which routines point at it. The tools to list routines and look up a chat's status exist in this session's toolbox according to their descriptions; I did not run them.
2. **Let the Control Room fill itself in.** (Fixes P2 and P3, helps P5. Borrowed from Agent Orchestrator's "position comes from facts".) The same morning job copies each department chat's real state (working, blocked, ready for review, done, failed) and a "checked at" time into the Control Room database. The page shows how old each check is and turns red after about a day. Nobody types a status. A chat marked "working" with no activity for several hours shows as "maybe stuck (limit?)". Give the job its own rows so Jarvis and the job never write the same object.
3. **Make a hand-off a ticket with a receipt.** (Fixes P4, helps P5. Borrowed from Symphony and Paperclip.) One record per hand-off: from, to, what, due time, and a state of sent, received, done, verified. The receiving chat writes "received" within an agreed time; the morning job flags any hand-off with no receipt. Add a three-line "where I stopped / next step" field so a chat stalled by a usage limit can be picked up by another one (the checkpoint idea from LangGraph and claude-powernap). It lives in the existing Control Room and #34, so there is no new record-keeping.

**Honest limit:** nothing I found fixes usage limits on cloud chats. The auto-resume tools only work on the local command-line app. Changes 2 and 3 make a stall visible and recoverable, not impossible.

**Effort (my estimate, not measured):** one routine, one table, one page section. Reversible by switching the routine off.

**What would make me revisit (about three months out):** a tool that reads claude.ai chats and routines directly without API keys appears; we move departments to servers we control; we pass roughly 10 departments; or the platform itself starts warning about dead routine targets (which would make change 1 unnecessary).

## 7. Verified versus inference

**Verified (read on 2026-10-03):** the repo facts in section 1 (git state, doc contents, Symphony search result); stars, last-commit dates and licenses for every row not marked snapshot; the Vibe Kanban shutdown post and README banner; the Superset and Inngest license texts; the live Paperclip and Agent Orchestrator READMEs; Symphony's SPEC.md and Elixir README (tracker polling, per-issue workspaces, Codex app-server, adapter list, reconcile/back-off/stall handling, no database needed); Stride Agents' README and billing table; the READMEs of the limit-resume tools; the wording of the routine and session tool descriptions in this session (read, not executed).

**Inference (my judgment, not proven):** that none of the six can see claude.ai cloud chats (their READMEs describe local or self-launched agents and my searches found nothing that does, but absence of evidence is not proof); phone-fit and effort judgments; LangGraph and Temporal capabilities (third-party posts plus background knowledge); Backlog.md's details (description only); Conductor being closed source; Mastra's license; that cloud chats are reachable from the Claude app; that the Symphony experiment was ever in this repo (see section 1).

## Sources

- https://github.com/paperclipai/paperclip · https://github.com/openai/symphony (SPEC.md, elixir/README.md) · https://github.com/ComposioHQ/agent-orchestrator · https://github.com/MrLesk/Backlog.md · https://github.com/langchain-ai/langgraph · https://github.com/temporalio/temporal
- https://vibekanban.com/blog/shutdown · https://github.com/BloopAI/vibe-kanban · https://github.com/superset-sh/superset (LICENSE.md) · https://github.com/inngest/inngest (LICENSE.md) · https://github.com/joshpocock/strideagents · https://github.com/saaranshM/unsnooze
- GitHub API repo and commit endpoints for every row, fetched 2026-10-03 (cache-busted).
