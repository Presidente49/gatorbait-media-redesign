#!/usr/bin/env bash
# Ship gate for the Georgia Week pregame issue: fails while a placeholder is still in the issue or the built bundle,
# or the bundle is over the 204,800-byte cap. Run from the repo root.
set -u
fail=0
for f in sports-live/magazine-issue-pregame.json sports-live/magazine-pregame.js; do
  if grep -q "REPLACE_WITH_WIX_MEDIA_ID_AFTER_UPLOAD" "$f"; then echo "NOT READY: cover.image.id placeholder in $f"; fail=1; fi
done
if grep -q '"/post/members-read-the-georgia-pregame-magazine"' sports-live/magazine-issue-pregame.json; then
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://www.gatorbaitmedia.com/post/members-read-the-georgia-pregame-magazine")
  if [ "$code" != "200" ]; then echo "NOT READY: pdf.url members post answers HTTP $code (create it or change pdf.url)"; fail=1; fi
fi
bytes=$(wc -c < sports-live/magazine-pregame.js)
if [ "$bytes" -gt 204800 ]; then echo "NOT READY: bundle is $bytes bytes (cap 204800)"; fail=1; fi
MAG_VARIANT=pregame NODE_PATH=/opt/node22/lib/node_modules node sports-live/build-magazine.mjs --check || fail=1
[ "$fail" = 0 ] && echo "READY: bundle $bytes bytes, no placeholders" || exit 1
