#!/usr/bin/env python3
"""Build the Magazine embed (1dd74333) body that pins the Georgia postgame bundle, from the LIVE body.

Usage: make-loader.py <live-body.html> <40-hex merge sha> > new-loader.html
  <live-body.html>  the exact embedData.html you just read from embed 1dd74333 (save it first: it is also the rollback)
  <sha>             the merge commit that contains sports-live/magazine-georgia-postgame.js (never a branch name)

Only the jsDelivr pin (sha and bundle file name) and the marker comment's src=/bundle= fields change; shell CSS, splash and route sync stay
byte-identical, as in deploy/magazine-2026/postgame-texas-web/make-loader.py. Asserts stop a stale or unexpected base: exactly one
40-hex pin to sports-live/magazine-<name>.js, and the result must stay at or under 15,000 characters. Prints chars and the djb2
fingerprint (Lesson 99 form) of the input and the output to stderr; compare the input fingerprint with the live revision's before patching."""
import re, sys, pathlib

BUNDLE = 'magazine-georgia-postgame.js'
if len(sys.argv) != 3:
    sys.exit(__doc__)
src = pathlib.Path(sys.argv[1]).read_text()
sha = sys.argv[2]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'

def djb2(t):
    h = 5381
    for ch in t:
        h = (((h << 5) + h + ord(ch)) & 0xFFFFFFFF)
    return format(h, 'x')  # same as ((h<<5)+h+code)|0 then >>>0 for BMP-only text (Lesson 99)

assert all(ord(c) < 0x10000 for c in src), 'astral characters change the JS charCode fingerprint; check by hand'
PIN = re.compile(r'(cdn\.jsdelivr\.net/gh/Presidente49/gatorbait-media-redesign@)([0-9a-f]{40})(/sports-live/)(magazine-[\w-]+\.js)')
pins = PIN.findall(src)
assert len(pins) == 1, 'expected exactly one 40-hex jsDelivr pin to sports-live/magazine-*.js in the live body, found %d' % len(pins)
old_sha, old_bundle = pins[0][1], pins[0][3]
out = PIN.sub(lambda m: m.group(1) + sha + m.group(3) + BUNDLE, src)
# Marker comment (first line): update src= and bundle= when present; leave any other text alone.
out = re.sub(r'(GBM_MAGAZINE_2026_V1 )[^>]*?(src=)' + old_sha, lambda m: m.group(0).replace(old_sha, sha), out, count=1)
out = re.sub(r'(GBM_MAGAZINE_2026_V1 )[^>]*?( src=)', r'\1postgame georgia\2', out, count=1)  # label words
out = out.replace('bundle=sports-live/' + old_bundle, 'bundle=sports-live/' + BUNDLE)
assert out.count(sha) >= 1 and old_sha not in out or old_sha == sha, 'old sha still present: marker comment has an unexpected shape, fix by hand'
assert len(out) <= 15000, 'over the 15,000-character embed cap: %d' % len(out)
sys.stderr.write('input : chars=%d djb2=%s pin=%s/%s\n' % (len(src), djb2(src), old_sha, old_bundle))
sys.stderr.write('output: chars=%d djb2=%s pin=%s/%s\n' % (len(out), djb2(out), sha, BUNDLE))
sys.stdout.write(out)
