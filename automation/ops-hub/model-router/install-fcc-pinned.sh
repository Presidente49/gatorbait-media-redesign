#!/bin/sh
set -eu

FCC_COMMIT="b9aa5a637e106a7bf0cee8ac34f849ae8a98d4ac"
FCC_ARCHIVE="https://github.com/Alishahryar1/free-claude-code/archive/${FCC_COMMIT}.zip"
FCC_DIR="${HOME}/.fcc"
FCC_ENV="${FCC_DIR}/.env"

say(){ printf '\n==> %s\n' "$*"; }
fail(){ printf 'error: %s\n' "$*" >&2; exit 1; }

command -v uv >/dev/null 2>&1 || fail "uv is required. Install uv first, then rerun this script."
command -v openssl >/dev/null 2>&1 || fail "openssl is required."

say "Installing pinned FCC commit ${FCC_COMMIT}"
uv python install 3.14.0
uv tool install --force --python 3.14.0 "free-claude-code @ ${FCC_ARCHIVE}"

mkdir -p "$FCC_DIR"
chmod 700 "$FCC_DIR" 2>/dev/null || true

TOKEN=$(openssl rand -hex 32)

if [ -f "$FCC_ENV" ]; then
  BACKUP="${FCC_ENV}.backup.$(date +%Y%m%d%H%M%S)"
  cp "$FCC_ENV" "$BACKUP"
  printf 'Existing FCC config backed up to %s\n' "$BACKUP"
fi

cat > "$FCC_ENV" <<EOF
HOST=127.0.0.1
PORT=8082
FCC_OPEN_BROWSER=true
MESSAGING_PLATFORM=none
PROXY_AUTH_ENABLED=true
ANTHROPIC_AUTH_TOKEN="${TOKEN}"
MODEL=open_router/openrouter/free
EOF
chmod 600 "$FCC_ENV" 2>/dev/null || true

say "Installed FCC with GatorBait hardened defaults"
printf '%s\n' \
  "- bound to 127.0.0.1:8082" \
  "- proxy authentication enabled" \
  "- random local token written only to ~/.fcc/.env" \
  "- default pilot model set to open_router/openrouter/free" \
  "- no provider credential was created or stored by this script"

say "Next"
printf '%s\n' \
  "1. Run: fcc-server" \
  "2. Open: http://127.0.0.1:8082/admin" \
  "3. Add an OpenRouter API key locally, or choose another provider." \
  "4. Keep the first tests to public/repo content." \
  "5. Run Claude Code through FCC with: fcc-claude"
