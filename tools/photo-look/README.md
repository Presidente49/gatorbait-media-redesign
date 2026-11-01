# GatorBait photo look (hero crops)

Story pages show the cover in a wide frame about 940 x 350 px (roughly 2.4:1). A tall photo center-cropped into that frame cuts off heads. `hero-crop.sh` prepares the photo first so the faces stay in frame.

    tools/photo-look/hero-crop.sh <in.jpg> <out.jpg> <focus-y-percent>

- `focus-y-percent`: where the faces sit vertically in the photo (0 is the top, 100 the bottom). The 2.4:1 crop window is centered there. Check the result by eye; nudge the number if a head is clipped.
- Output is 1600 px wide with a light grade (slight saturation lift, soft contrast, light sharpening). Needs ImageMagick (`convert`).
- Upload the result to Wix Media and set it as the post cover (`heroImage` and `media`). Keep the original for the inline photo.
- Rules that still apply: one photo per story (no repeats across stories), credit line "Photo: GatorBait Media" unless a photographer is known (see docs/PHOTO-ATTRIBUTION.md).

The first set, for Brenden's nine Georgia game photos, is in deploy/postgame-georgia-20261031/hero-crops/.
