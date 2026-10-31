#!/usr/bin/env bash
# One command for the Florida-Georgia game-day cards (Oct. 31, 2026).
#
#   ./render-now.sh <pregame|live|halftime|final> <espn-summary.json> [extra render-score.mjs flags]
#   ./render-now.sh test        # rehearsal: fabricated, stamped TEST cards for all four phases
#
# Local files only. Nothing here uploads, posts, emails or touches Wix. The controller decides distribution.
# Output goes to sports-live/gameday/out/ (override with OUT_DIR=/some/dir). TEST output goes to the OS temp dir.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
kit="$repo/sports-live/gameday"
render="$kit/render-score.mjs"

usage() {
  cat >&2 <<'EOF'
Usage:
  render-now.sh pregame  <espn-summary.json>
  render-now.sh live     <espn-summary.json>
  render-now.sh halftime <espn-summary.json>
  render-now.sh final    <espn-summary.json>
  render-now.sh test                         (rehearsal, fabricated TEST cards, never post)
Extra flags after the file go to render-score.mjs (for example --force, after the controller confirms the real game state).
Fetch the file first: see deploy/gameday-live-20261031/README.md.
EOF
  exit 2
}

command -v node >/dev/null 2>&1 || { echo "node is not installed or not on PATH." >&2; exit 2; }
[ -f "$render" ] || { echo "Cannot find $render. Run this from a checkout of the repo." >&2; exit 2; }

phase="${1:-}"
[ -n "$phase" ] || usage

if [ "$phase" = "test" ]; then
  echo "TEST rehearsal: fabricated data, stamped on every card. Never post or commit these."
  node "$render" --all --test --fla 10 --uga 14 --period 3 --clock 5:12 --preview ${OUT_DIR:+--out "$OUT_DIR"}
  exit $?
fi

case "$phase" in pregame|live|halftime|final) ;; *) echo "Unknown phase: $phase" >&2; usage ;; esac
file="${2:-}"
[ -n "$file" ] || usage
shift 2

[ -s "$file" ] || { echo "ESPN file missing or empty: $file" >&2; exit 2; }
if [ -n "$(find "$file" -mmin +15 2>/dev/null)" ]; then
  echo "WARNING: $file is more than 15 minutes old. Fetch ESPN again so the card shows the current game." >&2
fi

node "$render" --phase "$phase" --espn-file "$file" --preview ${OUT_DIR:+--out "$OUT_DIR"} "$@"
rc=$?
if [ "$rc" -ne 0 ]; then
  echo "" >&2
  echo "No $phase card was produced (exit $rc). Read the REFUSED line above. Do not hand-edit around it." >&2
  exit "$rc"
fi

echo ""
echo "Done. Open the PNG listed on the 'wrote' lines above, plus its -390.png phone preview, before anyone uses it."
echo "Check the score against the ESPN box score once more. Distribution is the controller's call."
