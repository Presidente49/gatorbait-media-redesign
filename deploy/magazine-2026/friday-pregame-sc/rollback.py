#!/usr/bin/env python3
"""Print the revision-79 /magazine loader (Wednesday Edition pin) from the current loader HTML. Usage: rollback.py <current-loader.html>"""
import re, sys, pathlib
src = pathlib.Path(sys.argv[1]).read_text()
out = re.sub(r'@[0-9a-f]{40}/sports-live/magazine[\w-]*\.js', '@c7fa7193b4109ec147b83d0b3a1690af79f6e265/sports-live/magazine-wednesday.js', src)
out = re.sub(r'<!-- GBM_MAGAZINE_2026_V1 [^>]*-->', '<!-- GBM_MAGAZINE_2026_V1 wednesday-edition src=c7fa7193b4109ec147b83d0b3a1690af79f6e265 immutable=1 bundle=sports-live/magazine-wednesday.js -->', out)
assert len(out) == 2225, len(out)
sys.stdout.write(out)
