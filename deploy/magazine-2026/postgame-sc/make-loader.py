#!/usr/bin/env python3
"""Write the South Carolina postgame Magazine embed: the live loader (live-loader-before.html, read from embed 1dd74333, rev 87,
on Oct. 11) with only its bundle pin and its marker comment changed to <sha>/sports-live/magazine-postgame.js. Everything else
(shell CSS, splash, route sync) is byte-identical to live. Usage: make-loader.py <40-hex commit containing
sports-live/magazine-postgame.js>  (prints the HTML). If the live HTML is not the one saved here, re-read it, save it as
live-loader-before.html and re-run; the asserts below stop a stale base."""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parent / 'live-loader-before.html').read_text()
old_pin = '@23fa88386a34dd6eb9e60c3180babd38f1f15a7d/sports-live/magazine-pregame.js'
old_tag = 'GBM_MAGAZINE_2026_V1 friday-pregame-south-carolina src=23fa88386a34dd6eb9e60c3180babd38f1f15a7d immutable=1 bundle=sports-live/magazine-pregame.js'
assert src.count(old_pin) == 1 and src.count(old_tag) == 1, 'live-loader-before.html is not the rev-87 payload'
out = src.replace(old_pin, '@' + sha + '/sports-live/magazine-postgame.js').replace(old_tag, 'GBM_MAGAZINE_2026_V1 postgame south-carolina src=' + sha + ' immutable=1 bundle=sports-live/magazine-postgame.js')
assert 'magazine-postgame.js' in out and len(out) <= 15000
sys.stdout.write(out)
