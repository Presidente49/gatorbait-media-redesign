#!/usr/bin/env python3
"""Check a built week PDF against the prepared story bodies (every story in posts.json).

Usage: python3 -I tools/magazine-pdf/check-week-pdf.py <posts.json> <file.pdf> [--expect-pages N]
For every story in posts.json, every body paragraph must appear in the PDF's extracted text (smart quotes, dashes and whitespace
folded). Also fails on: any 'http' in the extracted text, any /URI or /Annots object in the file (a link annotation), banned-credit
text, or an unexpected page size. Prints one line per story and the page count and size. Needs pdftotext and pdfinfo.
"""
from __future__ import annotations
import json, re, subprocess, sys, html
from pathlib import Path

FOLD = str.maketrans({'“': '"', '”': '"', '‘': "'", '’': "'", '–': '-', '—': '-', ' ': ' ', '­': ''})
fold = lambda s: re.sub(r'\s+', ' ', s.translate(FOLD)).strip()
# Line breaks after a hyphen ('2-' / '4') extract as '2- 4', so paragraphs are compared with all whitespace removed.
compact = lambda s: re.sub(r'\s+', '', s)

def main():
    posts = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))['posts']
    pdf = sys.argv[2]
    text = fold(subprocess.run(['pdftotext', '-raw', pdf, '-'], capture_output=True, text=True, check=True).stdout)
    ctext = compact(text)
    info = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True, check=True).stdout
    pages = int(re.search(r'Pages:\s+(\d+)', info).group(1)); size = re.search(r'Page size:\s+(.*)', info).group(1).strip()
    bad = 0
    for p in posts:
        paras = [fold(html.unescape(re.sub(r'<[^>]+>', '', m[1]))) for m in re.findall(r'<(p|h3|h4|blockquote)>(.*?)</\1>', p['html'])]
        paras = [x for x in paras if x]
        missing = [x for x in paras if compact(x) not in ctext]
        # Full-width pull quotes and headings are checked the same way; a paragraph split by a column or page break is
        # matched by its first and last 40 characters instead.
        really = [x for x in missing if not (compact(x[:40]) in ctext and compact(x[-40:]) in ctext)]
        print('%-9s %2d paragraphs, %2d split across a column or page break, %d missing   %s' % (p['key'], len(paras), len(missing) - len(really), len(really), p['title'][:50]))
        if really:
            bad += 1; print('   first missing:', really[0][:120])
        if compact(fold(p['title'])) not in ctext: bad += 1; print('   title missing')
    raw = Path(pdf).read_bytes()
    problems = []
    if re.search(r'https?:', text, re.I): problems.append('"http" appears in the text')
    if b'/URI' in raw or b'/Annots' in raw: problems.append('link annotations present')
    if re.search(r'gator\s*country', text, re.I): problems.append('banned credit text')
    if len(sys.argv) > 4 and sys.argv[3] == '--expect-pages' and pages != int(sys.argv[4]): problems.append('page count %d' % pages)
    print('pages=%d size=%s bytes=%d http_in_text=%s link_annotations=%s' % (pages, size, len(raw), bool(re.search(r'https?:', text, re.I)), b'/URI' in raw or b'/Annots' in raw))
    if problems or bad:
        print('FAIL:', problems or 'missing text'); sys.exit(1)
    print('PASS: all %d stories present in full, no http, no link annotations' % len(posts))

main()
