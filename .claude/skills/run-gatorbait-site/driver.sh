#!/usr/bin/env bash
# Driver for the GatorBait homepage bundle (sports-live/). Run from the repo root.
#   driver.sh setup              install esbuild into $TOOLS (default /tmp/gbm-tools) for the build
#   driver.sh build              rebuild sports-live/homepage.js, share.js, fan-modules.js, frame.html
#   driver.sh check              build --check (exit 1 when committed outputs are stale)
#   driver.sh qa [prefix] [dir]  render the fixture in headless Chromium and run the checks;
#                                prefix = scenario name prefix (QA_ONLY), dir = screenshot folder
#   driver.sh restore            undo the build outputs (git checkout) before committing unrelated work
set -euo pipefail
TOOLS="${TOOLS:-/tmp/gbm-tools}"
PW="${PLAYWRIGHT:-$(npm root -g)/playwright}"
cmd="${1:-}"; shift || true
case "$cmd" in
  setup)
    mkdir -p "$TOOLS" && cd "$TOOLS" && { [ -f package.json ] || npm init -y >/dev/null; } && npm i esbuild@0.24.0 --silent
    echo "esbuild ready in $TOOLS/node_modules" ;;
  build)
    NODE_PATH="$TOOLS/node_modules" node sports-live/build-front-page.mjs ;;
  check)
    NODE_PATH="$TOOLS/node_modules" node sports-live/build-front-page.mjs --check ;;
  qa)
    prefix="${1:-}"; dir="${2:-/tmp/gbm-shots}"
    mkdir -p "$dir"
    QA_ONLY="$prefix" PLAYWRIGHT="$PW" node sports-live/qa-front-page.mjs "$dir" | tee "$dir/qa.log"
    echo "screenshots: $dir" ;;
  restore)
    git checkout -- sports-live/homepage.js sports-live/share.js sports-live/fan-modules.js sports-live/frame.html ;;
  *) sed -n '2,9p' "$0"; exit 2 ;;
esac
