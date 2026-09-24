# Marginal Distance — Plate I

A design philosophy (`PHILOSOPHY.md`) and its visual expression.

| File | |
|---|---|
| `PHILOSOPHY.md` | the movement, in six parts |
| `build.py` | draws the plate as SVG geometry |
| `page.html` | assembled plate with the typefaces embedded |
| `plate.png` | 2800 × 3920, for screen |
| `plate.pdf` | print master — **not committed**, see below |
| `fonts/` | Jura Light, Geist Mono, Italiana (SIL Open Font License, included) |

## Rebuilding

```sh
python3 build.py
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
"$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --no-pdf-header-footer --print-to-pdf=plate.pdf "file://$PWD/page.html"
```

The PDF is left out of version control at 18.7 MB. Every mark is placed by one
seeded generator, so a rebuild is identical to the original rather than merely
similar — the file is reproducible, not archived.

## The plate

A measured span of 100 units. Ninety-nine reach; one, at 076, falls short by
0.9144. Below the baseline, eighteen rings disperse that single deficit across
the page, thinning as they travel, clipped by the plate edge.

One colour is permitted, and only at the deviation.
