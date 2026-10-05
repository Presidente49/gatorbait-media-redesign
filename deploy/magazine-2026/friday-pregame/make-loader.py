#!/usr/bin/env python3
"""Write the Friday Pregame loader: the rev 56 loader with its bundle URL pinned to <sha> and pointed at magazine-pregame.js.
Usage: make-loader.py <40-hex commit that contains sports-live/magazine-pregame.js>   (prints the embed HTML; <= 15,000 chars)"""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parents[1] / 'magazine-loader-v1.html').read_text()
out = re.sub(r'@[0-9a-f]{40}/sports-live/magazine\.js', '@' + sha + '/sports-live/magazine-pregame.js', src)
out = re.sub(r'src=[0-9a-f]{40}', 'src=' + sha, out).replace('GBM_MAGAZINE_2026_V1 weekly web issue', 'GBM_MAGAZINE_2026_V1 friday pregame')
assert 'magazine-pregame.js' in out and len(out) <= 15000
sys.stdout.write(out)
