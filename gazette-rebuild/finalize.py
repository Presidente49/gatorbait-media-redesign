#!/usr/bin/env python3
"""Prefix Gazette's literal internal links for an isolated GitHub Pages subdirectory."""
import json
import re
import sys
from pathlib import Path
BASE = '/gatorbait-media-redesign/gazette-preview'
root = Path(sys.argv[1]).resolve()
def prefix(value):
    if value.startswith('/') and not value.startswith('//') and not (value == BASE or value.startswith(BASE + '/')):
        return BASE + value
    return value
for file in root.rglob('*.html'):
    s = file.read_text()
    s = re.sub(r'\b(href|src|poster)=("|\')(/[^"\']*)\2', lambda m: m[1] + '=' + m[2] + prefix(m[3]) + m[2], s)
    def srcset(m):
        parts = []
        for chunk in m[2].split(','):
            fields = chunk.strip().split()
            if fields: fields[0] = prefix(fields[0])
            parts.append(' '.join(fields))
        return 'srcset=' + m[1] + ', '.join(parts) + m[1]
    s = re.sub(r'srcset=("|\')([^"\']*)\1', srcset, s)
    s = re.sub(r'<link\b[^>]*\brel="sitemap"[^>]*>', '', s)
    file.write_text(s)
for file in root.rglob('*.css'):
    s = file.read_text()
    s = re.sub(r'url\(("|\')?(/[^)"\']+)(?:\1)?\)', lambda m: 'url("' + prefix(m[2]) + '")', s)
    file.write_text(s)
# Let crawlers see the per-page noindex. Do not advertise preview sitemaps.
(root / 'robots.txt').write_text('User-agent: *\nDisallow:\n')
for file in root.glob('sitemap*.xml'): file.unlink()
print(json.dumps({'html_pages': len(list(root.rglob('*.html'))), 'base': BASE}))
