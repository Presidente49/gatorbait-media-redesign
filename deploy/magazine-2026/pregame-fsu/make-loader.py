#!/usr/bin/env python3
"""Keep the fresh production loader and its eight-second fallback; change only the edition pin."""
from pathlib import Path
import re
import sys

sha = sys.argv[1]
assert re.fullmatch(r'[a-f0-9]{40}', sha), 'Use the complete release commit.'
prior = (Path(__file__).resolve().parent / 'rollback-rev173.html').read_text()
updated = prior.replace('998d06a25771b30ececf3d9d79b046218b11ac63', sha)
updated = updated.replace('magazine-vanderbilt-postgame.js', 'magazine-fsu.js')
updated = updated.replace('postgame vanderbilt', 'pregame florida-state')
assert updated.count(sha) == 2
assert updated.count('magazine-fsu.js') == 2
assert len(updated) < 15000
assert 'setTimeout(fallback,8000)' in updated
print(updated, end='')
