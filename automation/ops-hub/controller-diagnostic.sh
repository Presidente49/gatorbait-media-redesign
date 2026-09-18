#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
OPS="$ROOT/automation/ops-hub"
ROUTER="$OPS/model-router"
FAIL=0
WARN=0
ACTIVE_MODELS=0

if [ "${1:-}" = "--active-models" ]; then
  ACTIVE_MODELS=1
fi

pass(){ printf 'PASS  %s\n' "$*"; }
warn(){ printf 'WARN  %s\n' "$*"; WARN=$((WARN+1)); }
fail(){ printf 'FAIL  %s\n' "$*"; FAIL=$((FAIL+1)); }
have(){ command -v "$1" >/dev/null 2>&1; }

printf 'GatorBait Controller Diagnostic\n'
printf 'Repo: %s\n\n' "$ROOT"

cd "$ROOT"

printf '== Repository / policy ==\n'
for f in   AGENTS.md   automation/ops-hub/policy.json   automation/ops-hub/controller-rules.json   automation/ops-hub/model-router/harness-policy.json   automation/ops-hub/model-router/task-runner.py   automation/ops-hub/model-router/job-worker.py   automation/ops-hub/docker-compose.yml
do
  [ -f "$f" ] && pass "$f present" || fail "$f missing"
done

if have python3; then
  if python3 - <<'PY'
import json
from pathlib import Path
for p in (
    Path("automation/ops-hub/policy.json"),
    Path("automation/ops-hub/controller-rules.json"),
    Path("automation/ops-hub/model-router/harness-policy.json"),
    Path("automation/ops-hub/model-router/routing-policy.json"),
):
    with p.open(encoding="utf-8") as fh:
        json.load(fh)
print("json-ok")
PY
  then pass "controller policy JSON parses"; else fail "controller policy JSON parse"; fi

  if python3 "$ROUTER/test_task_runner.py" >/tmp/gatorbait-controller-router-tests.log 2>&1; then
    pass "router/safety unit tests"
  else
    fail "router/safety unit tests (see /tmp/gatorbait-controller-router-tests.log)"
  fi

  if python3 "$ROUTER/task-runner.py"       --lane public_low_risk       --kind analysis       --prompt 'GatorBait controller diagnostic dry run'       >/tmp/gatorbait-controller-route.json 2>/tmp/gatorbait-controller-route.err; then
    pass "model router dry-run"
  else
    fail "model router dry-run"
  fi
else
  fail "python3 missing"
fi

if have git; then
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    pass "git repository available"
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
      warn "working tree has local changes"
    else
      pass "working tree clean"
    fi
  else
    fail "not inside a git work tree"
  fi
else
  fail "git missing"
fi

printf '\n== Production health ==\n'
if have python3; then
  if python3 "$ROOT/automation/site_health_check.py" >/tmp/gatorbait-production-health.log 2>&1; then
    pass "public production health"
  else
    fail "public production health (see /tmp/gatorbait-production-health.log)"
  fi
fi

printf '\n== Local harnesses ==\n'
for cmd in claude codex fcc-server fcc-claude fcc-codex; do
  if have "$cmd"; then pass "$cmd present: $(command -v "$cmd")"; else warn "$cmd missing"; fi
done

if have curl; then
  if curl -fsS --max-time 4 http://127.0.0.1:8082/health >/dev/null 2>&1; then
    pass "FCC responds on 127.0.0.1:8082"
  else
    warn "FCC not responding on 127.0.0.1:8082"
  fi

  N8N_CODE=$(curl -sS --max-time 4 -o /dev/null -w '%{http_code}' http://127.0.0.1:5678/ 2>/dev/null || true)
  case "$N8N_CODE" in
    2*|3*|401|403) pass "n8n responds on 127.0.0.1:5678 (HTTP $N8N_CODE)" ;;
    *) warn "n8n not responding normally on 127.0.0.1:5678 (HTTP ${N8N_CODE:-none})" ;;
  esac
else
  warn "curl missing; FCC/n8n HTTP checks skipped"
fi

printf '\n== n8n / queue / launchd ==\n'
if have docker; then
  if (cd "$OPS" && docker compose config -q) >/dev/null 2>&1; then
    pass "docker compose config valid"
  else
    warn "docker compose config unavailable/invalid"
  fi
  if (cd "$OPS" && docker compose ps) >/tmp/gatorbait-controller-compose.log 2>&1; then
    if grep -qi 'n8n' /tmp/gatorbait-controller-compose.log; then
      pass "n8n compose service visible"
    else
      warn "n8n compose service not visible"
    fi
  else
    warn "docker compose ps failed"
  fi
else
  warn "docker missing"
fi

QUEUE="$OPS/.state/model-jobs"
for d in inbox running done failed; do
  [ -d "$QUEUE/$d" ] && pass "queue/$d present" || warn "queue/$d missing"
done

PLIST="$HOME/Library/LaunchAgents/com.gatorbait.model-worker.plist"
if [ -f "$PLIST" ]; then
  pass "model-worker LaunchAgent plist present"
  if launchctl print "gui/$(id -u)/com.gatorbait.model-worker" >/tmp/gatorbait-controller-launchd.log 2>&1; then
    pass "model-worker launchd service loaded"
  else
    warn "model-worker plist exists but service is not loaded"
  fi
else
  warn "model-worker LaunchAgent not installed"
fi

if [ "$ACTIVE_MODELS" -eq 1 ]; then
  printf '\n== Active model smoke tests ==\n'
  if have claude; then
    if claude -p 'Return only CLAUDE_OK' --output-format json --max-turns 1 >/tmp/gatorbait-claude-smoke.json 2>&1; then
      pass "native Claude authenticated"
    else
      warn "native Claude smoke failed"
    fi
  fi
  if have fcc-claude; then
    if fcc-claude -p 'Return only FCC_CLAUDE_OK' --output-format json --max-turns 1 >/tmp/gatorbait-fcc-claude-smoke.json 2>&1; then
      pass "FCC Claude route executes"
    else
      warn "FCC Claude smoke failed"
    fi
  fi
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT HUP INT TERM
  if have codex; then
    if codex exec --json --ephemeral --sandbox read-only --skip-git-repo-check -C "$TMP" -- 'Return only CODEX_OK' >/tmp/gatorbait-codex-smoke.json 2>&1; then
      pass "native Codex authenticated"
    else
      warn "native Codex smoke failed"
    fi
  fi
  if have fcc-codex; then
    if fcc-codex exec --json --ephemeral --sandbox read-only --skip-git-repo-check -C "$TMP" -- 'Return only FCC_CODEX_OK' >/tmp/gatorbait-fcc-codex-smoke.json 2>&1; then
      pass "FCC Codex route executes"
    else
      warn "FCC Codex smoke failed"
    fi
  fi
else
  warn "model authentication not actively tested (rerun with --active-models to consume a minimal model call)"
fi

printf '\n== Summary ==\n'
printf 'Failures: %s  Warnings: %s\n' "$FAIL" "$WARN"
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
if [ "$WARN" -gt 0 ]; then
  exit 2
fi
exit 0
