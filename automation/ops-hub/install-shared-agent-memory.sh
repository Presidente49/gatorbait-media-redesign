#!/usr/bin/env bash
set -euo pipefail

# GatorBait Master Control shared-agent-memory bootstrap.
# Installs a project-local, secret-guarded MCP memory shared by Claude Code and Codex.
# GitHub remains the canonical durable source of truth; this memory is an operational cache.

SHARED_MEMORY_COMMIT="29e96c663a43da557c25132c4d569bce9d9e6b12"
PACKAGE="github:dan-calin/shared-agent-memory#${SHARED_MEMORY_COMMIT}"

say()  { printf '\n[Master Control] %s\n' "$*"; }
ok()   { printf '[OK] %s\n' "$*"; }
warn() { printf '[WARN] %s\n' "$*" >&2; }
die()  { printf '[STOP] %s\n' "$*" >&2; exit 1; }

if ! command -v node >/dev/null 2>&1; then
  die "Node.js 18+ is required."
fi

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 18 ]; then
  die "Node.js 18+ is required. Found $(node -v)."
fi

if ! command -v npx >/dev/null 2>&1; then
  die "npx is required."
fi

if [ ! -f "AGENTS.md" ] || [ ! -f "CLAUDE.md" ]; then
  die "Run this from the root of Presidente49/gatorbait-media-redesign."
fi

# Refuse to initialize a private operational store unless Git excludes it.
if ! git check-ignore -q .shared-memory/memory.json; then
  die "Private memory is not ignored by Git. Update .gitignore before installing."
fi
if [ -n "$(git ls-files -- .shared-memory)" ]; then
  die "Memory files are already tracked; review them before continuing."
fi

say "Configuring shared memory MCP"
npx --yes "$PACKAGE" install --manual
ok "Shared memory MCP configured for detected local agents"

say "Initializing project-local GatorBait memory"
npx --yes "$PACKAGE" init --agents codex,claude
ok "Project-local .shared-memory initialized"

say "Enabling advisory edit coordination"
npx --yes "$PACKAGE" coordination on --mode warn
ok "Claude/Codex file-claim warnings enabled"

say "Running memory integrity / secret-safety doctor"
npx --yes "$PACKAGE" doctor

say "Current shared-memory status"
npx --yes "$PACKAGE" status

cat <<'NEXT'

[Master Control] Shared AI memory is configured.

What this changes:
- Claude Code and Codex use one local GatorBait project memory.
- Agents can search prior operational facts instead of repeatedly rereading handoff files.
- Edit coordination is advisory/warn mode, not a hard lock.
- The memory write guard rejects common secret patterns.
- GitHub docs/issues remain authoritative for durable state, incidents, policy, and audit history.

Restart Claude Code and Codex after the first successful install so they load the MCP configuration.

The local .shared-memory directory is intentionally ignored by Git and must not be committed or cloud-synced.
NEXT
