#!/usr/bin/env python3
"""GatorBait voice check: the vendored ai-writing-markers report plus house rules.

Usage: gb_voice.py story.txt   (or - for stdin). Exits 1 when a house rule fails.
"""
import pathlib
import re
import subprocess
import sys

here = pathlib.Path(__file__).parent
path = sys.argv[1] if len(sys.argv) > 1 else '-'
text = sys.stdin.read() if path == '-' else open(path, encoding='utf-8').read()

subprocess.run([sys.executable, str(here / 'check.py'), '-'], input=text, text=True)

RULES = [
    (r'[“”‘’]', 'curly quotes or apostrophes: use straight " and \''),
    (r"\bit'?s not (just )?\w+[^.]{0,40}, it'?s\b", '"It\'s not X, it\'s Y" construction'),
    (r"\bhere'?s (the thing|how|why|what)\b", '"Here\'s the thing/how" signpost'),
    (r'\b(in the end|ultimately|notably|let\'s)\b', 'signpost or summary phrase'),
    (r'\b(step (one|two|three)|lessons? (is|are) plain|in one sentence)\b', 'template ladder phrasing'),
    (r'^#*\s*editor.?s note\s*$', '"Editor\'s note" heading: use one italic sourcing line'),
]

fails = 0
for pattern, why in RULES:
    hits = len(re.findall(pattern, text, re.I | re.M))
    if hits:
        print(f'HOUSE RULE: {why}: {hits}')
        fails += 1
dashes = text.count('—')
if dashes > 1:
    print(f'HOUSE RULE: {dashes} em-dashes (max 1)')
    fails += 1

print('house rules: PASS' if not fails else f'house rules: {fails} failing')
sys.exit(1 if fails else 0)
