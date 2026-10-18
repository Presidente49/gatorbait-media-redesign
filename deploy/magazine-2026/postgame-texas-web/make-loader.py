#!/usr/bin/env python3
"""Write the Texas postgame web-edition Magazine embed (embed 1dd74333): the rev-111 loader (live-loader-before.html, the body read from
embed 1dd74333 on Oct. 18 01:40Z, 2,762 chars, djb2 31abecc5; it is the pregame Texas loader pinned to 312018fa...) with only its bundle
pin, bundle file name and marker comment changed to <sha>/sports-live/magazine-postgame.js. Shell CSS, splash and route sync stay
byte-identical. Usage: make-loader.py <40-hex commit containing sports-live/magazine-postgame.js from the merged PR>  (prints the HTML)
Prints char count and djb2 fingerprint of the result to stderr. Jarvis: GET the live embed first; if its HTML is not byte-identical to
live-loader-before.html (or its fingerprint is not 31abecc5), save the live body as the new rollback, replace live-loader-before.html and
re-run (the asserts below stop a stale base)."""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parent / 'live-loader-before.html').read_text()
OLD = '312018fa66e644a3f32fe473b6a855d1b114c356'
old_tag = 'GBM_MAGAZINE_2026_V1 pregame texas src=' + OLD + ' immutable=1 bundle=sports-live/magazine-pregame.js'
old_pin = '@' + OLD + '/sports-live/magazine-pregame.js'
assert src.count(old_tag) == 1 and src.count(old_pin) == 1 and src.count('magazine-pregame.js') == 2, 'live-loader-before.html is not the rev-111 payload'
out = src.replace(old_pin, '@' + sha + '/sports-live/magazine-postgame.js').replace(old_tag, 'GBM_MAGAZINE_2026_V1 postgame texas-web src=' + sha + ' immutable=1 bundle=sports-live/magazine-postgame.js')
assert 'magazine-pregame.js' not in out and out.count(sha) == 2 and len(out) <= 15000
def djb2(t):
    h = 5381
    for ch in t:
        h = (((h << 5) + h + ord(ch)) & 0xFFFFFFFF)
    return format(h, 'x')  # same as ((h<<5)+h+code)|0 then >>>0 (BMP-only text)
assert all(ord(c) < 0x10000 for c in out)
sys.stderr.write('chars=%d djb2=%s (rev-111 base: chars=%d djb2=%s)\n' % (len(out), djb2(out), len(src), djb2(src)))
sys.stdout.write(out)
