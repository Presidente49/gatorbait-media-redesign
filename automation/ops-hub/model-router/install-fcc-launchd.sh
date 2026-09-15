#!/bin/sh
set -eu

LABEL="com.gatorbait.fcc"
PLIST="${HOME}/Library/LaunchAgents/${LABEL}.plist"
ENV_FILE="${HOME}/.fcc/.env"
SERVER=$(command -v fcc-server 2>/dev/null || true)

[ -n "$SERVER" ] || { echo "fcc-server not found on PATH" >&2; exit 1; }
[ -f "$ENV_FILE" ] || { echo "Missing $ENV_FILE" >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "curl is required" >&2; exit 1; }

TOKEN=$(awk -F= '/^ANTHROPIC_AUTH_TOKEN=/{gsub(/"/,"",$2);print $2}' "$ENV_FILE")
[ -n "$TOKEN" ] || { echo "Missing ANTHROPIC_AUTH_TOKEN in $ENV_FILE" >&2; exit 1; }

echo "Checking running FCC before enabling launchd..."
curl -fsS http://127.0.0.1:8082/health >/dev/null || {
  echo "FCC health check failed. Start fcc-server manually and configure a provider first." >&2
  exit 1
}
curl -fsS -H "Authorization: Bearer $TOKEN" 'http://127.0.0.1:8082/v1/models?limit=20' >/dev/null || {
  echo "Authenticated model check failed. Fix FCC/provider config before enabling launchd." >&2
  exit 1
}

mkdir -p "${HOME}/Library/LaunchAgents"
mkdir -p "${HOME}/.fcc"
chmod 700 "${HOME}/.fcc" 2>/dev/null || true

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array><string>${SERVER}</string></array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>WorkingDirectory</key><string>${HOME}</string>
  <key>StandardOutPath</key><string>${HOME}/.fcc/fcc.stdout.log</string>
  <key>StandardErrorPath</key><string>${HOME}/.fcc/fcc.stderr.log</string>
  <key>EnvironmentVariables</key>
  <dict><key>HOME</key><string>${HOME}</string></dict>
</dict>
</plist>
EOF

chmod 600 "$PLIST"
UID_NUM=$(id -u)
launchctl bootout "gui/${UID_NUM}" "$PLIST" 2>/dev/null || true
launchctl bootstrap "gui/${UID_NUM}" "$PLIST"
launchctl enable "gui/${UID_NUM}/${LABEL}" || true
launchctl kickstart -k "gui/${UID_NUM}/${LABEL}"

echo "FCC is installed as an always-on launchd service: ${LABEL}"
echo "Logs: ~/.fcc/fcc.stdout.log and ~/.fcc/fcc.stderr.log"
