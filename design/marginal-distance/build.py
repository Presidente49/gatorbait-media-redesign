#!/usr/bin/env python3
"""Marginal Distance - Plate I. Generates the canvas as SVG geometry.

Every mark is placed by computation, not by hand, so the field reads as
uniform while never being mechanical: lengths carry a small deterministic
variation seeded once, the way an instrument drifts across a long session.
"""
import math

W, H = 1400, 1960
ML, MR, MT, MB = 132, 132, 118, 150
CW = W - ML - MR

PAPER   = "#EDE9E0"
INK     = "#10192B"
GRAPH   = "#767E8E"
EMBER   = "#C2451A"

UNITS   = 100          # the measured span
GAP     = 76           # the withheld unit, placed off-centre
ARCS    = 18           # propagation rings

FIELD_TOP = 392
FIELD_H   = 252
BASE_Y    = FIELD_TOP + FIELD_H

# One seeded generator. Same plate every time it is printed.
class R:
    def __init__(self, s): self.s = s
    def next(self):
        self.s = (1103515245 * self.s + 12345) % 2147483648
        return self.s / 2147483648.0

rnd = R(41)
o = []
def add(s): o.append(s)

add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')

# ---- ground -------------------------------------------------------------
add('<defs>')
add('<clipPath id="lower"><rect x="%d" y="%d" width="%d" height="%d"/></clipPath>'
    % (ML, BASE_Y, CW, H - MB - BASE_Y - 92))
add('<clipPath id="field"><rect x="%d" y="%d" width="%d" height="%d"/></clipPath>'
    % (ML, FIELD_TOP - 30, CW, FIELD_H + 30))
# Paper tooth: a very fine noise, barely perceptible, so the ground holds light.
add('<filter id="tooth"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/>'
    '<feColorMatrix type="saturate" values="0"/>'
    '<feComponentTransfer><feFuncA type="linear" slope="0.035"/></feComponentTransfer></filter>')
add('</defs>')
add(f'<rect width="{W}" height="{H}" fill="{PAPER}"/>')
add(f'<rect width="{W}" height="{H}" filter="url(#tooth)" opacity="0.5"/>')

gx = ML + (GAP / (UNITS - 1.0)) * CW

# ---- propagation: consequence dispersing from one deviation --------------
add('<g clip-path="url(#lower)">')
for i in range(ARCS):
    r = 54 + i * 41.5
    op = 0.60 * math.pow(1 - i / float(ARCS), 1.15) + 0.045
    add(f'<circle cx="{gx:.2f}" cy="{BASE_Y}" r="{r:.2f}" fill="none" '
        f'stroke="{INK}" stroke-width="{0.95 - i * 0.022:.2f}" opacity="{op:.3f}"/>')
# The axis the deviation casts downward.
add(f'<line x1="{gx:.2f}" y1="{BASE_Y}" x2="{gx:.2f}" y2="{H - MB - 92}" '
    f'stroke="{EMBER}" stroke-width="0.6" opacity="0.30"/>')

# Accumulated observation: denser where the effect is strongest.
for _ in range(11000):
    px = ML + rnd.next() * CW
    py = BASE_Y + rnd.next() * (H - MB - BASE_Y - 92)
    d = abs(px - gx) / CW
    if rnd.next() > (1.0 - d) ** 1.6 * 0.62 + 0.07:
        continue
    rr = 0.45 + rnd.next() * 0.42
    add(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{rr:.2f}" fill="{INK}" '
        f'opacity="{0.07 + rnd.next() * 0.20:.3f}"/>')
add('</g>')

# ---- the measured field --------------------------------------------------
add('<g clip-path="url(#field)">')
tops = []
for i in range(UNITS):
    x = ML + (i / (UNITS - 1.0)) * CW
    drift = (rnd.next() - 0.5) * 7.0 + math.sin(i * 0.37) * 2.2
    top = FIELD_TOP + 8 + drift
    tops.append(top)
    if i == GAP:
        continue
    major = (i % 10 == 0)
    add(f'<line x1="{x:.2f}" y1="{top:.2f}" x2="{x:.2f}" y2="{BASE_Y}" '
        f'stroke="{INK}" stroke-width="{1.15 if major else 0.72}" '
        f'opacity="{0.90 if major else 0.64}"/>')
add('</g>')

# ---- the withheld unit ---------------------------------------------------
reach   = tops[GAP]                 # where the field reaches
short_y = reach + 58.0              # where this one stops
add(f'<line x1="{gx:.2f}" y1="{short_y:.2f}" x2="{gx:.2f}" y2="{BASE_Y}" '
    f'stroke="{EMBER}" stroke-width="1.5" opacity="0.96"/>')
# The height it did not reach, drawn as an interval and measured.
add(f'<line x1="{gx - 9:.2f}" y1="{reach:.2f}" x2="{gx + 9:.2f}" y2="{reach:.2f}" '
    f'stroke="{EMBER}" stroke-width="0.9" opacity="0.72"/>')
add(f'<line x1="{gx:.2f}" y1="{reach:.2f}" x2="{gx:.2f}" y2="{short_y:.2f}" '
    f'stroke="{EMBER}" stroke-width="0.55" opacity="0.40" stroke-dasharray="1.6 3.4"/>')
bx = gx + 17
add(f'<path d="M {bx:.2f} {reach:.2f} h 7 M {bx + 7:.2f} {reach:.2f} V {short_y:.2f} '
    f'M {bx:.2f} {short_y:.2f} h 7" fill="none" stroke="{EMBER}" '
    f'stroke-width="0.7" opacity="0.66"/>')
lead_y = FIELD_TOP - 84
# The leader rises from the top of the bracket and leaves the field at once.
# Travelling sideways first would drag an ember rule straight through the
# measured marks, and nothing may cross the field but the deviation itself.
add(f'<path d="M {bx + 7:.2f} {reach:.2f} V {lead_y:.2f} H {gx + 108:.2f}" '
    f'fill="none" stroke="{EMBER}" stroke-width="0.6" opacity="0.52"/>')
add(f'<text x="{gx + 116:.2f}" y="{lead_y + 4.2:.2f}" font-family="GeistMono" '
    f'font-size="13" fill="{EMBER}" letter-spacing="1.1">0.9144</text>')
add(f'<text x="{gx + 116:.2f}" y="{lead_y + 21:.2f}" font-family="Jura" '
    f'font-size="9.5" fill="{GRAPH}" letter-spacing="3.4">UNIT WITHHELD</text>')

# ---- baseline rule and scale --------------------------------------------
add(f'<line x1="{ML}" y1="{BASE_Y}" x2="{W - MR}" y2="{BASE_Y}" '
    f'stroke="{INK}" stroke-width="1.1"/>')
for i in range(0, UNITS + 1, 10):
    x = ML + (min(i, UNITS - 1) / (UNITS - 1.0)) * CW
    add(f'<line x1="{x:.2f}" y1="{BASE_Y}" x2="{x:.2f}" y2="{BASE_Y + 11}" '
        f'stroke="{INK}" stroke-width="0.9" opacity="0.72"/>')
    add(f'<text x="{x:.2f}" y="{BASE_Y + 27}" font-family="GeistMono" font-size="9.5" '
        f'fill="{GRAPH}" letter-spacing="0.8" text-anchor="middle">{i:03d}</text>')
add(f'<line x1="{gx:.2f}" y1="{BASE_Y}" x2="{gx:.2f}" y2="{BASE_Y + 15}" '
    f'stroke="{EMBER}" stroke-width="1.2"/>')
add(f'<text x="{gx:.2f}" y="{BASE_Y + 27}" font-family="GeistMono" font-size="9.5" '
    f'fill="{EMBER}" letter-spacing="0.8" text-anchor="middle">{GAP:03d}</text>')

# ---- ruled zones ---------------------------------------------------------
for y in (MT + 54, H - MB - 78):
    add(f'<line x1="{ML}" y1="{y}" x2="{W - MR}" y2="{y}" '
        f'stroke="{INK}" stroke-width="0.7" opacity="0.5"/>')

# ---- typography ----------------------------------------------------------
add(f'<text x="{ML}" y="{MT + 30}" font-family="Jura" font-size="25" fill="{INK}" '
    f'letter-spacing="11.5">MARGINAL DISTANCE</text>')
add(f'<text x="{W - MR}" y="{MT + 30}" font-family="GeistMono" font-size="11.5" '
    f'fill="{GRAPH}" letter-spacing="2.2" text-anchor="end">PL. I</text>')
add(f'<text x="{ML}" y="{MT + 76}" font-family="Jura" font-size="10.5" fill="{GRAPH}" '
    f'letter-spacing="4.6">FIELD OBSERVATION &#183; THE WITHHELD UNIT</text>')
add(f'<text x="{W - MR}" y="{MT + 76}" font-family="GeistMono" font-size="10" '
    f'fill="{GRAPH}" letter-spacing="1.6" text-anchor="end">IV &#183; I</text>')

# The phrase, placed to be found last.
add(f'<text x="{ML}" y="{H - MB - 34}" font-family="Italiana" font-size="30" '
    f'fill="{INK}" letter-spacing="1.4" opacity="0.92">everything after begins here</text>')
add(f'<text x="{W - MR}" y="{H - MB - 38}" font-family="GeistMono" font-size="10" '
    f'fill="{GRAPH}" letter-spacing="1.5" text-anchor="end">t = 41</text>')
add(f'<text x="{W - MR}" y="{H - MB - 22}" font-family="GeistMono" font-size="10" '
    f'fill="{GRAPH}" letter-spacing="1.5" text-anchor="end">n = {UNITS}</text>')

# Ten strokes. Counted, not labelled.
tx = W - MR - 9 * 7
for i in range(10):
    add(f'<line x1="{tx + i * 7:.1f}" y1="{H - MB + 6}" x2="{tx + i * 7:.1f}" '
        f'y2="{H - MB + 22}" stroke="{INK}" stroke-width="1" opacity="0.62"/>')
add(f'<text x="{ML}" y="{H - MB + 20}" font-family="GeistMono" font-size="9.5" '
    f'fill="{GRAPH}" letter-spacing="1.4">MARGINAL DISTANCE &#8212; PLATE I OF I</text>')

# ---- registration --------------------------------------------------------
for cx, cy in ((ML - 46, MT - 46), (W - MR + 46, MT - 46),
               (ML - 46, H - MB + 52), (W - MR + 46, H - MB + 52)):
    add(f'<g stroke="{GRAPH}" stroke-width="0.7" opacity="0.62">'
        f'<line x1="{cx - 8}" y1="{cy}" x2="{cx + 8}" y2="{cy}"/>'
        f'<line x1="{cx}" y1="{cy - 8}" x2="{cx}" y2="{cy + 8}"/>'
        f'<circle cx="{cx}" cy="{cy}" r="4.6" fill="none"/></g>')

add('</svg>')
open("plate.svg", "w").write("\n".join(o))
print("plate.svg written: %d marks" % len(o))
