#!/usr/bin/env bash
set -euo pipefail

# GatorBait Master Control mobile bootstrap
# Installs/configures:
#   1) carterlasalle/mac_messages_mcp (read-only newsroom ingest path)
#   2) leeguooooo/iphone-use (optional real-iPhone control path)
#
# This script does NOT grant macOS Full Disk Access, enable iPhone Developer Mode,
# unlock the phone, approve trust, or approve Xcode signing. Apple requires those
# actions to be performed by the user on the Mac/iPhone.
#
# No GatorBait credentials or phone-control bearer tokens are written to this repo
# or to Claude/Codex config. The iphone-use MCP wrapper reads the local LaunchAgent
# secret at runtime.

IPHONE_USE_INSTALL_COMMIT="8188abd3ebf693c278d1d8239c0e4bdae3658076"
IPHONE_USE_INSTALL_URL="https://raw.githubusercontent.com/leeguooooo/iphone-use/${IPHONE_USE_INSTALL_COMMIT}/install.sh"

MC_DIR="${HOME}/.gatorbait/master-control"
BIN_DIR="${HOME}/.local/bin"
IPHONE_WRAPPER="${BIN_DIR}/gatorbait-iphone-use-mcp"
IPHONE_APP="${HOME}/Applications/iPhoneUse.app"
IPHONE_MCP="${IPHONE_APP}/Contents/MacOS/iphone-use-mcp"
IPHONE_PLIST="${HOME}/Library/LaunchAgents/com.leeguoo.iphone-use.plist"
WDA_SETUP="${HOME}/.iphone-use/setup-wda.sh"
MESSAGES_DB="${HOME}/Library/Messages/chat.db"

say()  { printf '\n[Master Control] %s\n' "$*"; }
ok()   { printf '[OK] %s\n' "$*"; }
warn() { printf '[WARN] %s\n' "$*" >&2; }
die()  { printf '[STOP] %s\n' "$*" >&2; exit 1; }

if [ "$(uname -s)" != "Darwin" ]; then
  die "This bootstrap must run on Brenden's Mac."
fi

if [ "${EUID:-$(id -u)}" -eq 0 ]; then
  die "Run as the logged-in Mac user, not root."
fi

mkdir -p "$MC_DIR" "$BIN_DIR"
chmod 700 "$MC_DIR" "$BIN_DIR" 2>/dev/null || true

say "Checking local prerequisites"

if ! command -v brew >/dev/null 2>&1; then
  die "Homebrew is required. Install Homebrew first, then rerun this script."
fi
ok "Homebrew found"

if ! command -v uvx >/dev/null 2>&1; then
  say "Installing uv with Homebrew"
  brew install uv
fi
UVX="$(command -v uvx)"
ok "uvx: $UVX"

if ! command -v iproxy >/dev/null 2>&1; then
  say "Installing libimobiledevice for USB iPhone relay support"
  brew install libimobiledevice
fi
ok "iproxy: $(command -v iproxy)"

say "Checking Messages read permission without reading message content"
if [ -r "$MESSAGES_DB" ] && command -v sqlite3 >/dev/null 2>&1; then
  if sqlite3 "file:$MESSAGES_DB?mode=ro" 'select 1;' >/dev/null 2>&1; then
    ok "Messages database is readable in read-only mode"
  else
    warn "Messages database exists but this launcher cannot read it yet."
    warn "Grant Full Disk Access to the app/terminal that launches Claude/Codex/ChatGPT, then quit and reopen it."
  fi
else
  warn "Messages database is not currently readable."
  warn "Grant Full Disk Access to the launcher under System Settings > Privacy & Security > Full Disk Access."
fi

say "Registering read-only Messages MCP with available local clients"

if command -v claude >/dev/null 2>&1; then
  if claude mcp get mac-messages >/dev/null 2>&1; then
    ok "Claude already has mac-messages MCP"
  else
    claude mcp add --transport stdio --scope user mac-messages -- "$UVX" mac-messages-mcp
    ok "Added mac-messages MCP to Claude user scope"
  fi
else
  warn "Claude CLI not found; skipping Claude MCP registration."
fi

if command -v codex >/dev/null 2>&1; then
  if codex mcp list 2>/dev/null | grep -qE '(^|[[:space:]])mac-messages([[:space:]]|$)'; then
    ok "Codex already has mac-messages MCP"
  else
    codex mcp add mac-messages -- "$UVX" mac-messages-mcp
    ok "Added mac-messages MCP to Codex"
  fi
else
  warn "Codex CLI not found; skipping Codex MCP registration."
fi

say "Installing or preserving iphone-use"

if [ -x "$IPHONE_MCP" ]; then
  ok "iphone-use already installed at $IPHONE_APP"
else
  tmp="$(mktemp -t gatorbait-iphone-use-install.XXXXXX)"
  trap 'rm -f "$tmp"' EXIT
  curl --proto '=https' --tlsv1.2 -fsSL "$IPHONE_USE_INSTALL_URL" -o "$tmp"
  chmod 700 "$tmp"
  /bin/bash "$tmp"
  rm -f "$tmp"
  trap - EXIT
fi

[ -x "$IPHONE_MCP" ] || die "iphone-use install did not produce the expected MCP binary."
ok "iphone-use MCP found"

say "Installing secret-safe iphone-use MCP wrapper"

cat > "$IPHONE_WRAPPER" <<'WRAPPER'
#!/usr/bin/env bash
set -euo pipefail

PLIST="$HOME/Library/LaunchAgents/com.leeguoo.iphone-use.plist"
MCP="$HOME/Applications/iPhoneUse.app/Contents/MacOS/iphone-use-mcp"

[ -x "$MCP" ] || {
  echo "iphone-use MCP binary is missing: $MCP" >&2
  exit 1
}
[ -f "$PLIST" ] || {
  echo "iphone-use LaunchAgent is missing: $PLIST" >&2
  exit 1
}

TOKEN="$(/usr/libexec/PlistBuddy -c 'Print :EnvironmentVariables:PHONE_REMOTE_AGENT_TOKEN' "$PLIST" 2>/dev/null || true)"
if [ -z "$TOKEN" ]; then
  TOKEN="$(/usr/libexec/PlistBuddy -c 'Print :EnvironmentVariables:PHONE_REMOTE_PASSWORD' "$PLIST" 2>/dev/null || true)"
fi
[ -n "$TOKEN" ] || {
  echo "No iphone-use local bearer token/password found in the LaunchAgent." >&2
  exit 1
}

export PHONE_REMOTE_URL="http://127.0.0.1:44321"
export PHONE_REMOTE_TOKEN="$TOKEN"
exec "$MCP" "$@"
WRAPPER
chmod 700 "$IPHONE_WRAPPER"
ok "Installed $IPHONE_WRAPPER"

say "Registering iphone-use MCP with available local clients"

if command -v claude >/dev/null 2>&1; then
  if claude mcp get iphone-use >/dev/null 2>&1; then
    ok "Claude already has iphone-use MCP"
  else
    claude mcp add --transport stdio --scope user iphone-use -- "$IPHONE_WRAPPER"
    ok "Added iphone-use MCP to Claude user scope"
  fi
fi

if command -v codex >/dev/null 2>&1; then
  if codex mcp list 2>/dev/null | grep -qE '(^|[[:space:]])iphone-use([[:space:]]|$)'; then
    ok "Codex already has iphone-use MCP"
  else
    codex mcp add iphone-use -- "$IPHONE_WRAPPER"
    ok "Added iphone-use MCP to Codex"
  fi
fi

say "Checking Xcode and iPhone/WDA prerequisites"

XCODE_OK=0
if command -v xcodebuild >/dev/null 2>&1 && xcodebuild -version >/dev/null 2>&1; then
  devdir="$(xcode-select -p 2>/dev/null || true)"
  if printf '%s' "$devdir" | grep -q '/Xcode.app/Contents/Developer'; then
    XCODE_OK=1
    ok "Full Xcode is selected: $devdir"
  else
    warn "Xcode command line tools are present, but full Xcode.app is not selected."
    warn "Open/install full Xcode and select it before WDA setup."
  fi
else
  warn "Full Xcode is not available yet."
fi

if [ -x "$WDA_SETUP" ]; then
  say "Running iphone-use doctor"
  set +e
  "$WDA_SETUP" doctor
  doctor_rc=$?
  set -e
  if [ "$doctor_rc" -eq 0 ] && [ "$XCODE_OK" -eq 1 ]; then
    say "Doctor passed. Starting WebDriverAgent setup."
    say "Keep the iPhone connected by USB, trusted, unlocked, awake, and in Developer Mode."
    set +e
    "$WDA_SETUP"
    setup_rc=$?
    set -e
    if [ "$setup_rc" -eq 0 ]; then
      ok "WebDriverAgent setup completed"
    else
      warn "WDA setup stopped with code $setup_rc. Follow the blocker it printed, then rerun this script."
    fi
  else
    warn "iPhone/WDA prerequisites are not all ready yet. No phone-control mutation was forced."
  fi
else
  warn "iphone-use setup-wda helper was not found."
fi

say "Local verification"

if [ -f "$IPHONE_PLIST" ]; then
  token="$(/usr/libexec/PlistBuddy -c 'Print :EnvironmentVariables:PHONE_REMOTE_AGENT_TOKEN' "$IPHONE_PLIST" 2>/dev/null || true)"
  [ -n "$token" ] || token="$(/usr/libexec/PlistBuddy -c 'Print :EnvironmentVariables:PHONE_REMOTE_PASSWORD' "$IPHONE_PLIST" 2>/dev/null || true)"
  if [ -n "$token" ]; then
    if curl -fsS --max-time 3 -H "Authorization: Bearer $token" http://127.0.0.1:44321/agent/status >/dev/null 2>&1; then
      ok "iphone-use agent API responds locally"
    else
      warn "iphone-use is installed, but the local agent API is not ready yet."
    fi
  fi
fi

cat <<'NEXT'

[Master Control] Bootstrap complete as far as macOS allows without physical approval.

Apple-only manual gates, if still shown:
1. System Settings > Privacy & Security > Full Disk Access
   Enable the launcher you use (Terminal/Claude/ChatGPT desktop), then quit/reopen it.
2. Connect and trust the iPhone by USB.
3. Enable Developer Mode on the iPhone if requested.
4. In Xcode, sign in and select a development team if WDA signing asks.
5. Rerun:
   ./automation/ops-hub/install-master-control-mobile.sh

After that, Master Control should be able to:
- read Chris Spears' new Messages image attachments through mac-messages (read-only workflow)
- control the iPhone through iphone-use only when a provider/API/read-only path cannot do the job

No message sending is part of the GatorBait game-day workflow.
NEXT
