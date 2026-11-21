#!/usr/bin/env python3
"""Write the Vanderbilt postgame Magazine loader for embed 1dd74333: the postgame loader the build's QA frame uses
(deploy/magazine-2026/postgame-texas-web/candidate-loader.html: dark splash while the bundle loads, fallback to the native
page) with only its bundle pin, bundle file name and marker comment changed.
Usage: make-loader.py <40-hex commit that contains sports-live/magazine-vanderbilt-postgame.js>   (prints the embed HTML)"""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parents[1] / 'postgame-texas-web' / 'candidate-loader.html').read_text().strip()
assert src.count('magazine-postgame.js') == 2 and src.count('postgame texas-web') == 1 and len(re.findall(r'[0-9a-f]{40}', src)) == 2
out = re.sub(r'[0-9a-f]{40}', sha, src).replace('magazine-postgame.js', 'magazine-vanderbilt-postgame.js').replace('postgame texas-web', 'postgame vanderbilt')
assert out.count(sha) == 2 and out.count('magazine-vanderbilt-postgame.js') == 2 and 'magazine-postgame.js' not in out and len(out) <= 15000
def xor(t):
    h = 5381
    for ch in t: h = (((h << 5) + h) ^ ord(ch)) & 0xFFFFFFFF
    return h
sys.stderr.write('chars=%d xor=%d\n' % (len(out), xor(out)))
sys.stdout.write(out)
