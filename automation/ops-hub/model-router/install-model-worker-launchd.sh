#!/bin/sh
set -eu

LABEL="com.gatorbait.model-worker"
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../../.." && pwd)
WORKER="$ROOT/automation/ops-hub/model-router/job-worker.py"
RUNNER="$ROOT/automation/ops-hub/model-router/task-runner.py"
STATE="$ROOT/automation/ops-hub/.state/model-jobs"
PLIST="${HOME}/Library/LaunchAgents/${LABEL}.plist"
PYTHON=$(command -v python3 2>/dev/null || true)

[ -n "$PYTHON" ] || { echo "python3 not found on PATH" >&2; exit 1; }
[ -f "$WORKER" ] || { echo "Missing $WORKER" >&2; exit 1; }
[ -f "$RUNNER" ] || { echo "Missing $RUNNER" >&2; exit 1; }

mkdir -p "$STATE/inbox" "$STATE/running" "$STATE/done" "$STATE/failed"
chmod 700 "$ROOT/automation/ops-hub/.state" 2>/dev/null || true
chmod 700 "$STATE" "$STATE/inbox" "$STATE/running" "$STATE/done" "$STATE/failed" 2>/dev/null || true

# Routing-only check: no model invocation and no token usage.
"$PYTHON" "$RUNNER" \
  --lane public_low_risk \
  --kind analysis \
  --prompt 'GatorBait worker installation routing check' >/dev/null

mkdir -p "${HOME}/Library/LaunchAgents"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${PYTHON}</string>
    <string>${WORKER}</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>WorkingDirectory</key><string>${ROOT}</string>
  <key>StandardOutPath</key><string>${ROOT}/automation/ops-hub/.state/model-worker.stdout.log</string>
  <key>StandardErrorPath</key><string>${ROOT}/automation/ops-hub/.state/model-worker.stderr.log</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>HOME</key><string>${HOME}</string>
    <key>PATH</key><string>${PATH}</string>
  </dict>
</dict>
</plist>
EOF

chmod 600 "$PLIST"
UID_NUM=$(id -u)
launchctl bootout "gui/${UID_NUM}" "$PLIST" 2>/dev/null || true
launchctl bootstrap "gui/${UID_NUM}" "$PLIST"
launchctl enable "gui/${UID_NUM}/${LABEL}" || true
launchctl kickstart -k "gui/${UID_NUM}/${LABEL}"

echo "GatorBait model worker installed: ${LABEL}"
echo "Queue: ${STATE}/inbox"
echo "Results: ${STATE}/done and ${STATE}/failed"
echo "Logs: automation/ops-hub/.state/model-worker.*.log"
