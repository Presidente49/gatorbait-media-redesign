#!/usr/bin/env bash
# GatorBait hero look: a wide 2.4:1 crop that keeps heads in frame, plus a light grade.
# Usage: hero-crop.sh <in.jpg> <out.jpg> <focus-y-percent>
#   focus-y-percent = where the faces sit vertically in the photo (0 top, 100 bottom). The crop window is centered there.
# Output is 1600 px wide (the story page shows the hero about 940 px wide, 2x for phones).
set -euo pipefail
in="$1"; out="$2"; fy="${3:-35}"
read -r W H < <(convert "$in[0]" -auto-orient -format "%w %h\n" info:)
CH=$(( W * 10 / 24 ))                       # crop height for 2.4:1
if [ "$CH" -ge "$H" ]; then CH=$H; fi
Y=$(( H * fy / 100 - CH / 2 ))
[ "$Y" -lt 0 ] && Y=0
[ $(( Y + CH )) -gt "$H" ] && Y=$(( H - CH ))
convert "$in" -auto-orient -crop "${W}x${CH}+0+${Y}" +repage -resize 1600x \
  -modulate 100,108,100 -sigmoidal-contrast 2,50% -unsharp 0x0.8 -quality 90 "$out"
echo "$out  (crop ${W}x${CH} at y=$Y of ${W}x${H})"
