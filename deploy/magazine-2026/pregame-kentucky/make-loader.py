#!/usr/bin/env python3
"""Write the Kentucky Pregame loader: the rev 56 loader with its bundle URL pinned to <sha> and pointed at magazine-kentucky.js.
Usage: make-loader.py <40-hex commit that contains sports-live/magazine-kentucky.js>   (prints the embed HTML; <= 15,000 chars)"""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parents[1] / 'magazine-loader-v1.html').read_text()
out = re.sub(r'@[0-9a-f]{40}/sports-live/magazine\.js', '@' + sha + '/sports-live/magazine-kentucky.js', src)
out = re.sub(r'src=[0-9a-f]{40}', 'src=' + sha, out).replace('GBM_MAGAZINE_2026_V1 weekly web issue', 'GBM_MAGAZINE_2026_V1 kentucky pregame')
assert 'magazine-kentucky.js' in out and len(out) <= 15000
sys.stdout.write(out)
