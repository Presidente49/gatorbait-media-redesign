#!/usr/bin/env python3
from pathlib import Path
import hashlib,sys
HERE=Path(__file__).resolve().parent
BASE=HERE.parent/'blog-font-stability-20261019'/'candidate.html'
baseline=BASE.read_text()
assert hashlib.sha256(baseline.encode()).hexdigest()=="01542fecf284b4d5b87385f92784d307be45a2815a8714233b2a1c3161fe9f83", "Reviewed rev9 baseline changed"
css=(HERE/'delta.css').read_text().strip()
assert css.count('/post/buddy-martin-rays-unlikely-hero-ted-lasso-world-series-game-4')==4
assert 'object-fit:contain!important' in css and 'object-fit:cover' not in css
candidate=baseline+'<style id="gbm-buddy-headline-clearance-20261028">'+css+'</style>'
assert len(candidate.encode())<15000
out=HERE/'candidate.html'
if '--check' in sys.argv:
 assert out.read_text()==candidate, "Rebuild the candidate"
else: out.write_text(candidate)
print('PASS exact baseline plus route-scoped contained-image CSS; '+str(len(candidate.encode()))+' bytes')
