#!/usr/bin/env python3
"""GatorBait house-style checks and advisory copy-editing cues, never authorship detection.

Usage: gb_voice.py story.txt (or - for stdin). Exits 1 for house-style issues.
The tool only reports; an editor resolves issues or records a justified exception.
"""
import pathlib
import re
import subprocess
import sys

HOUSE_RULES = [
    (r'[“”‘’]', 'curly quotes or apostrophes: use straight " and \''),
    (r'—', 'em dash: prefer a period, comma or parentheses; review verified quotations separately'),
    (r'contentReference|oaicite|oai_citation|turn\d+(?:search|view)\d+|:::writing',
     'unresolved tool/citation markup: replace with verified publication-ready sourcing'),
]

REVIEW_CUES = [
    (r"\b(?:it'?s not|this isn'?t|this is not)\b[^.!?\n]{0,100}[,;.—]\s*(?:it'?s|but|this is)\b|\bnot only\b[^.!?\n]{0,100}\bbut\b",
     'contrastive framing: state the specific news directly when the contrast adds nothing'),
    (r'\?[^\S\n]+[A-Z][^.!?\n]{0,80}[.!]',
     'question/answer framing: review whether the question is useful (including genuine Q&A)'),
    (r"\bhere'?s (the thing|how|why|what)\b", '"Here\'s the thing/how" signpost'),
    (r'\b(in the end|in conclusion|in summary|ultimately|notably|let\'s)\b', 'possibly empty transition or summary'),
    (r'\b(step (one|two|three)|lessons? (is|are) plain|in one sentence)\b', 'template ladder phrasing'),
    (r'^#*\s*editor.?s note\s*$', '"Editor\'s note" heading: use one italic sourcing line'),
]


def find_issues(text, rules):
    return [(why, len(hits)) for pattern, why in rules
            if (hits := re.findall(pattern, text, re.I | re.M))]


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else '-'
    text = sys.stdin.read() if path == '-' else pathlib.Path(path).read_text(encoding='utf-8')
    here = pathlib.Path(__file__).parent
    subprocess.run([sys.executable, str(here / 'check.py'), '-'],
                   input=text, text=True, check=True)
    issues = find_issues(text, HOUSE_RULES)
    for why, count in issues:
        print(f'HOUSE STYLE: {why}: {count}')
    for why, count in find_issues(text, REVIEW_CUES):
        print(f'EDITOR REVIEW (advisory): {why}: {count}')
    print('house style: PASS' if not issues else f'house style: {len(issues)} issue(s) to resolve')
    print('Editorial review, source fact-check and live/app QC are still required; '
          'no match or score establishes authorship.')
    return 1 if issues else 0


if __name__ == '__main__':
    sys.exit(main())
