#!/usr/bin/env bash
# Fetch the pinned upstream sources that this repo used to track as git submodules.
#
# Why not submodules: GitHub Pages builds the `main` branch with a recursive
# submodule checkout and then tars it with --dereference. vivliostyle-cli ships
# symlink loops under tests/fixtures/glob (d -> ../.., k -> ../../f), so from
# Sept. 25 to Sept. 29, 2026 every Pages build hung until the next one cancelled
# it, and gazette-live/posts.json and sports-live/scoreboard.json went stale.
# Fetching the same commits at run time keeps the pins without putting them on
# the Pages-served branch.
#
# Usage: tools/fetch-pinned-sources.sh [all|newsletter|magazine]
#   newsletter -> vendor/colorlib-email-templates
#   magazine   -> tools/magazine-originals/upstream/* (pins from manifest.json)
#   all        -> both (default)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT/tools/magazine-originals/manifest.json"
SELECT="${1:-all}"
COLORLIB_REPO="ColorlibHQ/email-templates"
COLORLIB_SHA="3018557fe943fb1c3e3367aa52d39b2fca44f725"

fetch_pinned() { # <relative path> <owner/repo> <commit sha>
  local rel="$1" repo="$2" sha="$3" path
  path="$ROOT/$rel"
  if [ -d "$path/.git" ] && [ "$(git -C "$path" rev-parse HEAD 2>/dev/null)" = "$sha" ]; then
    echo "ok       $rel @ ${sha:0:7}"
    return
  fi
  rm -rf "$path"
  mkdir -p "$(dirname "$path")"
  git init -q "$path"
  git -C "$path" remote add origin "https://github.com/$repo.git"
  git -C "$path" fetch -q --depth 1 origin "$sha"
  git -C "$path" checkout -q --detach FETCH_HEAD
  if [ -f "$path/.gitmodules" ]; then
    # Keep the original tree complete where the upstream itself has submodules
    # (zine/docs). Best effort: the QC gates never read inside them.
    git -C "$path" -c url.https://github.com/.insteadOf=git@github.com: \
      submodule update --init --recursive --depth 1 2>/dev/null \
      || echo "warning: nested submodules of $rel were not fetched"
  fi
  test "$(git -C "$path" rev-parse HEAD)" = "$sha"
  echo "fetched  $rel @ ${sha:0:7}"
}

case "$SELECT" in
  all|newsletter|magazine) ;;
  *) echo "usage: $0 [all|newsletter|magazine]" >&2; exit 2 ;;
esac

if [ "$SELECT" = all ] || [ "$SELECT" = newsletter ]; then
  fetch_pinned vendor/colorlib-email-templates "$COLORLIB_REPO" "$COLORLIB_SHA"
fi

if [ "$SELECT" = all ] || [ "$SELECT" = magazine ]; then
  python3 - "$MANIFEST" <<'PY' | while read -r name repo sha; do
import json, sys
for t in json.load(open(sys.argv[1]))["tools"]:
    print(t["name"], t["repo"], t["sha"])
PY
    fetch_pinned "tools/magazine-originals/upstream/$name" "$repo" "$sha"
  done
fi
