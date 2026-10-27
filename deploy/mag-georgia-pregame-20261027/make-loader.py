#!/usr/bin/env python3
"""Write the Georgia Week pregame Magazine embed body (embed 1dd74333): the live rev-119 loader (rollback/1dd74333-rev119.html,
read from the provider Oct. 27, 2,769 chars) with only its marker comment, bundle file name and pin changed to
<sha>/sports-live/magazine-pregame.js. Shell CSS, splash and route sync stay byte-identical.
Usage: make-loader.py <40-hex commit containing sports-live/magazine-pregame.js from the merged PR>  (prints the HTML)
Prints char count and both djb2 fingerprints (add variant and xor variant) of the result to stderr.
Jarvis: GET the live embed first; if its HTML is not byte-identical to rollback/1dd74333-rev119.html, save the live body as the new
rollback, replace that file and re-run (the asserts below stop a stale base)."""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parent / 'rollback' / '1dd74333-rev119.html').read_text()
OLD = '7cbf2271d266c2f1440fc3467c447071a68d187c'
old_tag = 'GBM_MAGAZINE_2026_V1 postgame texas-web src=' + OLD + ' immutable=1 bundle=sports-live/magazine-postgame.js'
old_pin = '@' + OLD + '/sports-live/magazine-postgame.js'
assert src.count(old_tag) == 1 and src.count(old_pin) == 1 and src.count('magazine-postgame.js') == 2 and len(src) == 2769, 'rollback/1dd74333-rev119.html is not the rev-119 payload'
out = src.replace(old_pin, '@' + sha + '/sports-live/magazine-pregame.js').replace(old_tag, 'GBM_MAGAZINE_2026_V1 pregame georgia src=' + sha + ' immutable=1 bundle=sports-live/magazine-pregame.js')
assert 'magazine-postgame.js' not in out and out.count(sha) == 2 and len(out) <= 15000
def djb2_add(t):
    h = 5381
    for ch in t: h = (((h << 5) + h + ord(ch)) & 0xFFFFFFFF)
    return format(h, 'x')
def djb2_xor(t):
    h = 5381
    for ch in t: h = ((h * 33) ^ ord(ch)) & 0xFFFFFFFF
    return format(h, 'x')
assert all(ord(c) < 0x10000 for c in out)
sys.stderr.write('chars=%d djb2(add)=%s djb2(xor)=%s (rev-119 base: chars=%d add=%s xor=%s)\n' % (len(out), djb2_add(out), djb2_xor(out), len(src), djb2_add(src), djb2_xor(src)))
sys.stdout.write(out)
