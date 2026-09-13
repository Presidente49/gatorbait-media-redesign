#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_DIR="$SCRIPT_DIR/.state"
PLIST_TARGET="$HOME/Library/LaunchAgents/com.gatorbait.ops-hub.plist"

mkdir -p "$STATE_DIR" "$HOME/Library/LaunchAgents"
sed \
  -e "s|__OPS_HUB_SCRIPT__|$SCRIPT_DIR/ops_hub.py|g" \
  -e "s|__OPS_HUB_DIR__|$SCRIPT_DIR|g" \
  -e "s|__OPS_HUB_STATE__|$STATE_DIR|g" \
  "$SCRIPT_DIR/com.gatorbait.ops-hub.plist.template" > "$PLIST_TARGET"

launchctl bootout "gui/$(id -u)/com.gatorbait.ops-hub" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST_TARGET"
launchctl enable "gui/$(id -u)/com.gatorbait.ops-hub"

echo "GatorBait Ops Hub installed."
echo "Dashboard: http://127.0.0.1:8765"
echo "Status: $STATE_DIR/status.json"
