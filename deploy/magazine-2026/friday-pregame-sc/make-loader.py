#!/usr/bin/env python3
"""Write the South Carolina Friday Pregame Magazine embed: the live loader HTML (read from embed 1dd74333 at deploy time and
saved beside this script as live-loader.html) with only its bundle pin and tag changed to <sha>/sports-live/magazine-pregame.js.
Everything else (shell CSS, splash, route sync) stays byte-identical to live.
Usage: make-loader.py <live-loader.html> <40-hex commit containing sports-live/magazine-pregame.js>  (prints the HTML)"""
import re, sys, pathlib
src = pathlib.Path(sys.argv[1]).read_text()
sha = sys.argv[2]
assert re.fullmatch(r'[0-9a-f]{40}', sha), 'need the full 40-hex commit sha'
pins = re.findall(r'@([0-9a-f]{40})/sports-live/(magazine[\w-]*\.js)', src)
assert len(pins) == 1, 'expected exactly one jsDelivr bundle pin in the live loader, found %r' % (pins,)
old_sha, old_bundle = pins[0]
out = src.replace('@%s/sports-live/%s' % (old_sha, old_bundle), '@%s/sports-live/magazine-pregame.js' % sha)
tag = re.search(r'<!-- GBM_MAGAZINE_2026_V1 [^>]*-->', out)
assert tag, 'no GBM_MAGAZINE_2026_V1 tag in the live loader'
out = out.replace(tag.group(0), '<!-- GBM_MAGAZINE_2026_V1 friday-pregame-south-carolina src=%s immutable=1 bundle=sports-live/magazine-pregame.js -->' % sha)
assert out.count('magazine-pregame.js') == 2 and len(out) <= 15000
sys.stdout.write(out)
