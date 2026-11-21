#!/usr/bin/env python3
"""Write the Vanderbilt Pregame loader: the live Magazine loader (live-rev161-loader.html in this folder: splash while the
bundle loads, fallback to the native page after 8 seconds) with its bundle URL pinned to <sha>.
Usage: make-loader.py <40-hex commit that contains sports-live/magazine-vanderbilt.js>   (prints the embed HTML; <= 15,000 chars)
Do not rebuild the loader from magazine-loader-v1.html: that older template has no splash and no fallback."""
import re, sys, pathlib
sha = sys.argv[1]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
src = (pathlib.Path(__file__).resolve().parent / 'live-rev161-loader.html').read_text().strip()
out = re.sub(r'[0-9a-f]{40}', sha, src)
assert out.count(sha) == 2 and out.count('magazine-vanderbilt.js') == 2 and len(out) <= 15000
sys.stdout.write(out)
