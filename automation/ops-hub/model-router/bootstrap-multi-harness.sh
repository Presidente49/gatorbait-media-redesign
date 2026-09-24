#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../../.." && pwd)
PLUGIN_DIR="$ROOT/automation/ops-hub/model-router/gatorbait-claude-plugin"
say(){ printf '\n==> %s\n' "$*"; }
check(){
  if command -v "$1" >/dev/null 2>&1; then
    printf 'OK   %-14s %s\n' "$1" "$(command -v "$1")"
    return 0
  fi
  printf 'MISS %-14s\n' "$1"
  return 1
}

# Skills are independent of the optional FCC/n8n worker stack. This is the
# existing upstream installation path, not another installer or scheduler.
case "${1:-}" in
  --verify-knowledge-plugins)
    command -v claude >/dev/null 2>&1 || { printf 'BLOCKED: Claude Code is not installed on this host.\n' >&2; exit 2; }
    claude plugin list --json
    exit 0
    ;;
  --install-knowledge-plugins)
    command -v claude >/dev/null 2>&1 || { printf 'BLOCKED: Claude Code is required on the actual target host.\n' >&2; exit 2; }
    say 'Inspecting existing native plugins before installation'
    claude plugin list --json
    say 'Following the original knowledge-work marketplace installation method'
    # Do not swallow errors. An existing marketplace collision or an install
    # failure must be reconciled from actual host state, not reported as success.
    claude plugin marketplace add anthropics/knowledge-work-plugins
    for plugin in operations marketing data; do
      claude plugin install "${plugin}@knowledge-work-plugins"
    done
    say 'Native installation commands returned success; inspecting inventory'
    claude plugin list --json
    printf '%s\n' 'Verify exact plugin versions, enabled state and load errors in this output, then use the original skills in a fresh session.' \
      'This is not proof of connector authorization, a running team or a successful client workflow.'
    exit 0
    ;;
  '') ;;
  *) printf 'Usage: %s [--install-knowledge-plugins|--verify-knowledge-plugins]\n' "$0" >&2; exit 2 ;;
esac

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
