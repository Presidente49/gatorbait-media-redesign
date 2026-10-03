#!/usr/bin/env python3
"""Fill tagger.template.js -> tagger.js for one ExecuteWixAPI run.
   python3 build.py --since 2026-09-27T00:00:00Z --offset 0 --limit 35 [--dry-run]
Roster: the Florida list in gameday/*/rosters-raw.json (update each season)."""
import argparse, json, pathlib, glob
HERE = pathlib.Path(__file__).resolve().parent
ap = argparse.ArgumentParser(); ap.add_argument('--since', required=True); ap.add_argument('--offset', type=int, default=0)
ap.add_argument('--limit', type=int, default=35); ap.add_argument('--dry-run', action='store_true'); a = ap.parse_args()
src = sorted(glob.glob(str(HERE.parent.parent / 'gameday' / '*' / 'rosters-raw.json')))[-1]
names = sorted({r[1].strip() for r in json.load(open(src))['teams']['Florida']})
s = (HERE / 'tagger.template.js').read_text()
s = s.replace('__ROSTER__', json.dumps(names)).replace('__SINCE__', a.since).replace('__OFFSET__', str(a.offset)) \
     .replace('__LIMIT__', str(a.limit)).replace('__APPLY__', 'false' if a.dry_run else 'true')
(HERE / 'tagger.js').write_text(s); print('roster', src, len(names), 'names; wrote tagger.js', len(s), 'chars')
