#!/usr/bin/env python3
"""Write the postgame Magazine embed: the live rev-73 loader (live-rev73-loader.html, read from embed 1dd74333 on Oct. 4)
with only its bundle pin changed to <sha>/sports-live/magazine-postgame.js. Everything else (shell CSS, splash, route sync) is
byte-identical to live. Usage: make-loader.py <40-hex commit containing sports-live/magazine-postgame.js>  (prints the HTML)"""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parent / 'live-rev73-loader.html').read_text()
old_pin = '@9b2017477e4a948d80e243ac6b2cbd34a36ec01f/sports-live/magazine-pregame.js'
old_tag = 'GBM_MAGAZINE_2026_V1 friday pregame src=ad0bc24880f3d3803e1d37a034c4788126e29663'
assert src.count(old_pin) == 1 and src.count(old_tag) == 1, 'live-rev73-loader.html is not the rev-73 payload'
out = src.replace(old_pin, '@' + sha + '/sports-live/magazine-postgame.js').replace(old_tag + ' immutable=1 bundle=sports-live/magazine.js', 'GBM_MAGAZINE_2026_V1 postgame missouri src=' + sha + ' immutable=1 bundle=sports-live/magazine-postgame.js')
assert 'magazine-postgame.js' in out and len(out) <= 15000
sys.stdout.write(out)
