#!/usr/bin/env bash
# Barlow-only guard: fail if any served style source declares a serif font
# (Georgia / Times New Roman). Brenden's standing rule: Barlow typography only.
set -euo pipefail
cd "$(dirname "$0")/.."
hits=$(grep -rniE "font[^;{}]*(georgia|times new roman)" \
  deploy/wix-served automation/site-design newsroom-preview \
  --include='*.css' --include='*.html' --include='*.js' --include='*.mjs' || true)
if [ -n "$hits" ]; then
  echo "Barlow-only violation: serif font declarations found:" >&2
  echo "$hits" | cut -c1-200 >&2
  exit 1
fi
echo "Typography guard: no serif font declarations."
