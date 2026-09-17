#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../../.." && pwd)
PLUGIN_DIR="$ROOT/automation/ops-hub/model-router/gatorbait-claude-plugin"
INSTALL_PLUGINS=0

if [ "${1:-}" = "--install-knowledge-plugins" ]; then
  INSTALL_PLUGINS=1
fi

say(){ printf '\n==> %s\n' "$*"; }
check(){
  if command -v "$1" >/dev/null 2>&1; then
    printf 'OK   %-14s %s\n' "$1" "$(command -v "$1")"
    return 0
  fi
  printf 'MISS %-14s\n' "$1"
  return 1
}

say "GatorBait multi-harness check"
printf 'Repo: %s\n' "$ROOT"

missing=0
check claude || missing=1
check codex || missing=1
check fcc-server || missing=1
check fcc-claude || missing=1
check fcc-codex || missing=1

if [ -d "$PLUGIN_DIR" ]; then
  printf 'OK   gatorbait plugin %s\n' "$PLUGIN_DIR"
else
  printf 'MISS gatorbait plugin %s\n' "$PLUGIN_DIR"
  missing=1
fi

if [ "$INSTALL_PLUGINS" -eq 1 ]; then
  command -v claude >/dev/null 2>&1 || {
    printf 'error: Claude Code is required before installing Anthropic Knowledge Work Plugins.\n' >&2
    exit 1
  }

  say "Registering Anthropic Knowledge Work Plugins marketplace"
  claude plugin marketplace add anthropics/knowledge-work-plugins || true

  say "Installing initial GatorBait knowledge-work skills"
  for plugin in operations marketing data; do
    claude plugin install "${plugin}@knowledge-work-plugins" || true
  done
fi

say "Local authentication still belongs on this Mac"
printf '%s\n' \
  "- Native Claude: sign in through Claude Code. Native headless claude -p may consume the plan's applicable Agent SDK allowance." \
  "- FCC: keep the pinned local server on 127.0.0.1:8082 with proxy auth enabled." \
  "- FCC OpenAI: connect the ChatGPT account in FCC Admin if you want subscription-backed OpenAI models through FCC." \
  "- Native Codex: sign in locally if using the codex CLI directly." \
  "- Never paste credentials into this repo or into n8n workflow JSON."

say "Verification"
printf '%s\n' \
  "1. Start/verify FCC using model-router/README.md." \
  "2. Run: claude -p 'Return only CLAUDE_OK' --output-format json" \
  "3. Run: fcc-claude -p 'Return only FCC_CLAUDE_OK' --output-format json" \
  "4. Run a read-only codex exec smoke check from a disposable directory." \
  "5. Run model-router/task-runner.py without --execute first to inspect routing."

if [ "$missing" -ne 0 ]; then
  printf '\nOne or more harness commands are missing. Do not enable unattended n8n dispatch until the missing local setup is resolved.\n'
  exit 2
fi

printf '\nAll harness commands are present. This does not prove authentication; run the smoke checks above.\n'
