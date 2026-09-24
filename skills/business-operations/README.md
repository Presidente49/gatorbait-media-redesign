# Business Operations — portable skills and repository catalog

The agency method is reusable. Each business is a separate client profile. This directory is a self-contained knowledge plugin; it is not a new server, queue or controller. The repository currently storing it is not its business identity.

## What is here

- The original business-operations skill and handoff/learning contracts.
- Source-specific adapter skills in `commands/`, plus `catalog` and `install-repo`.
- `catalog/repos.json`: eight inspected installation references and the remaining source-review intake. An entry is not an installed program.
- Three native Claude reviewer definitions in `agents/`: source-auditor, workflow-reviewer and outcome-reviewer. File-read tools only; no automatic execution or experimental team flag.
- Dependency-free structural checks and a tracked-file repo discovery command.

Full upstream libraries remain original installs/checkouts, with their own licenses, skills and dependencies. The existing MarketingSkills submodule is a supported upstream option, not proof of native host discovery. No upstream binaries or full libraries are bundled into this export. Read `references/repository-intake.md` before any install. License metadata with incomplete review stays labeled, not treated as MIT.

## Access in Claude Code

From an approved checkout, replace the example with the REAL absolute path:

```sh
claude plugin validate /absolute/path/to/skills/business-operations
claude --plugin-dir /absolute/path/to/skills/business-operations plugin list --json
claude --plugin-dir /absolute/path/to/skills/business-operations
```

In that session invoke `/business-operations:catalog` or `/business-operations:install-repo`. Source adapters include `/business-operations:marketing-library`, `/business-operations:knowledge-work` and `/business-operations:wix-editor`. Use `/agents` to inspect the three named review roles. Existing unnamespaced project skill wrappers may remain; do not install a second copy under the same name. Native validation/discovery is required on the actual host; local Python tests do not replace it.

For reusable user-scope access, current Claude Code supports a self-contained plugin directory in `~/.claude/skills/business-operations/` with `.claude-plugin/plugin.json`. Copy THIS directory intact only after inspecting collisions/backing up an existing installation. Do not copy a client adapter, credentials, private evidence or the enclosing client repository. Restart the intended Claude session and verify with `claude plugin list --json`; use session `--plugin-dir` if that host version does not support skills-directory plugins. These are documented host methods, not actions already performed by creating this package.

Original sources have THEIR OWN installation instructions in the catalog. For MarketingSkills choose its official Claude marketplace path OR the existing pinned-submodule option; do not use both blindly. For Anthropic role plugins, reuse the existing knowledge-work install path. MCP tools and device runtimes need real installation, permissions and connection checks; a source adapter alone provides no tool access.

## Access in other agents

Codex and other compatible agents can read `SKILL.md` through their supported skill loader; use their native discovery mechanism, not guessed cross-agent installation flags. A connected chat can explicitly retrieve the exact versioned skill and source files. This does not install a personal/global ChatGPT plugin. No tool credentials are shared between applications automatically.

## Choose the client explicitly

Load the selected project's own profile, entry instructions, current owner and work item. No client is the global default. Use the blank profile for a new business. Keep client policy, accounts, private memory and metrics in that client's authorized project/provider. The supplied review roles share methodology and sanitized packets, not a global customer database. The original client controller remains the sole production writer.

## Audit and verify

```sh
python3 skills/business-operations/scripts/catalog.py
python3 skills/business-operations/scripts/catalog.py --repo marketing-library
python3 skills/business-operations/scripts/catalog.py --scan /absolute/path/to/approved/checkout
python3 -m unittest discover -s skills/business-operations/tests -v
```

The scanner only reads safe tracked text; candidates require review. It is not a complete history/account crawl and cannot certify no other dependencies exist. It prints repository names and evidence paths, not source lines or secret values. Scan only an authorized checkout; files with sensitive path names are skipped, not a general DLP guarantee.

## Completion and rollback

DISCOVERED, REVIEWED, PREPARED, INSTALLED, LOADED, CONNECTED and WORKFLOW_VERIFIED are different gates. An installation receipt belongs to a real host/client record, never a fabricated catalog flag. The receiver must acknowledge the actual artifact/version and permitted next stage. Missing host access remains OPEN.

No automatic update, budget change, scheduler, sender, client mutation, native team launch or permission bypass is included. Preserve pre-install files and upstream notices; disable/remove only the exact added component through its native manager, preserving data. Session-only loading ends with that session. Do not run broad deletion commands as rollback.

Official host reference: https://code.claude.com/docs/en/plugins-reference . Installation and source-doc review date: September 24, 2026. Source and permission changes require renewed review.
