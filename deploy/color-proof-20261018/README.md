# Color proof, Oct. 18, 2026 (PROOF ONLY, not deployed)

Brenden (voice): more white, more Gator orange, and the Gator green. Nothing here touches live Wix. No embed was PATCHed, no site publish. A live change needs Brenden's explicit yes.

## Palette (UF Brand Center, brandcenter.ufl.edu/colors, hex as supplied by the coordinator; not re-fetched in this session)
Core Orange #FA4616, Core Blue #0021A5, Dark Blue #002657, Gator green #22884C (PMS 7731), Alachua #F2A900, White #FFFFFF. UF keeps orange and blue most prominent, so green stays small.

## Files
- `before-390.png`, `after-390.png`, `before-1366.png`, `after-1366.png` (full page)
- `color-proof.css` (the only change, 20 declarations, colors only)
- `proof.mjs` (render script), `metrics.json`

Source: `sports-live/broadcast-home.js` (homepage skin of embed 0c13f955) on main 563fe3b, rendered locally with the repo's Gazette runtime and committed feeds. Photos are a neutral placeholder in both runs. Run: `PLAYWRIGHT_PKG=/opt/node22/lib/node_modules node deploy/color-proof-20261018/proof.mjs`

## Exact CSS changes (all scoped to `#gbm-live.gbm-gazette.gbm-sports-home`)
1. White: `background:#fff` on `.bc-side`, `.sh-watch`, `.sh-voices`, `.sh-magazine` (no cover), `.bc-nx` (were #f4f6f9 / #fff8f2), and on the Florida standings row (was #fff0e6).
2. Orange (borders only): `.sh-header` bottom border #FA4616; panel borders #f9b7a0 with #FA4616 top; standings row rules #ffd6c7; `.sh-coverage article` bottom rule #FA4616.
3. Green #22884C (non-text only): Florida standings row marker (3px inset bar) and the thumbnail offset shadow (`.bc-tn`).

No layout change: page heights and widths are identical before and after (`metrics.json`: 7818 px at 390, 4249 px at 1366, no horizontal overflow). Barlow only (computed families: Barlow, Arial fallback, same as before).

## Contrast (WCAG 2.1, on white)
- Green #22884C: 4.47:1. It misses 4.5:1 for normal text, so it is used on no text; as a UI/graphic accent it clears 3:1.
- Orange #FA4616: 3.53:1, also not used for text. Orange text stays #a32e09 (7.11:1); body navy #102040 (16.12:1).
- Navy on orange buttons is unchanged (#102040 on #FA4616 = 4.57:1).
- The softer orange panel borders (#f9b7a0, 1.71:1) are decoration; no information depends on them.

## Rollback
Nothing is live, so nothing to roll back. To discard: close the PR / delete branch `jarvis/color-proof-20261018`. If ever deployed later, remove the `<style id="gbm-color-proof">` block (the contents of `color-proof.css`) and re-pin the previous loader sha; the skin file itself is unchanged.
