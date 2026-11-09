#!/usr/bin/env python3
"""Artifact manifest for the Oklahoma-week v2 magazine: paths, SHA-256, sizes, page counts, fonts, link counts and the credit manifest.
Usage: v2-manifest.py <letter.pdf> <phone.pdf> <assets-dir> <out.json>   (run with /usr/bin/python3: needs pypdf)"""
import hashlib
import json
import os
import subprocess
import sys

from pypdf import PdfReader

letter, phone, assets, out = sys.argv[1:5]
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()


def pdf_info(p):
    r = PdfReader(p)
    fonts = sorted({' '.join(l.split()[:1]) for l in subprocess.run(['pdffonts', p], capture_output=True, text=True).stdout.splitlines()[2:] if l.strip()})
    ext = internal = 0
    for pg in r.pages:
        for a in pg.get('/Annots', []) or []:
            a = a.get_object()
            if a.get('/Subtype') != '/Link':
                continue
            if a.get('/A') and a['/A'].get_object().get('/URI'):
                ext += 1
            else:
                internal += 1
    box = r.pages[0].mediabox
    return {'file': p, 'sha256': sha(p), 'bytes': os.path.getsize(p), 'pages': len(r.pages), 'pageSizePt': [round(float(box.width), 2), round(float(box.height), 2)],
            'title': r.metadata.title, 'author': r.metadata.author, 'bookmarks': len(r.outline) and sum(1 for _ in _walk(r.outline)),
            'externalLinks': ext, 'internalLinks': internal, 'fontFamilies': fonts}


def _walk(o):
    for x in o:
        if isinstance(x, list):
            yield from _walk(x)
        else:
            yield x


CREDITS = {
    'cover-v2-football.png': ('Cover', 'Retouched football-only cover (Nov. 7); digital composite (AI-assisted) built from official Florida Gators/UAA photographs: Urban Meyer (2006 vs. South Carolina), Florida Gators/UAA; Tim Tebow (2006 vs. LSU), Jay Metz/UAA Communications; 2008-season championship celebration, Jason Parkhurst/UAA Communications. 130 ppi at Letter size; digital only.'),
    'cover-v2.png': ('Cover (superseded, not printed)', 'Earlier cover raster; it carries a basketball line that the owner ordered out. Not used by either build.'),
    'champ-2008-celebration.jpg': ('Ring of Honor opener', 'Jason Parkhurst/UAA Communications (official UF photograph; game played Jan. 8, 2009)'),
    'tebow-2006-lsu.jpg': ('Best Fridays closer', 'Jay Metz/UAA Communications (official UF photograph; 2006 game against LSU)'),
    'fridays-still.jpg': ('Best Fridays', 'Video still: The Buddy Martin Show / Gator Bait Media'),
    'qb-panel.jpg': ('Tramell Jones Gets the Call', 'Photo by Chris Spears, GatorBait Media'),
    'scouting-huddle.jpg': ('Scouting Oklahoma, Part 1', 'Photo by Chris Spears, GatorBait Media'),
    'soothsayer-baugh.jpg': ('The Soothsayer', 'Archival photo by Chris Spears, GatorBait Media'),
    'swamp-panorama.jpg': ('Game guide', 'Archival photo by Chris Spears, GatorBait Media'),
    'monster-column-art.png': ('The Monster That\u2019s Never Fed (opener)', 'Graphic: GatorBait Media. Original typographic and vector graphic by the graphic desk (HTML, CSS and inline SVG rendered with Playwright; Barlow). No photograph, no person, no AI image. Full 2400 x 1350 master; the opener shows a center crop above the art\u2019s baked-in byline.'),
    'saban-espn-courtesy-crop.jpg': ('The Monster That\u2019s Never Fed (floated portrait)', 'Nick Saban photo courtesy of ESPN. Tight head-and-shoulders crop (390 x 448 px of the 495 x 470 supplied portrait), printed 1.5 in wide (260 ppi). Supplied by Brenden Martin; no other source.'),
    'saban-espn-courtesy-original.jpg': ('The Monster That\u2019s Never Fed (provenance copy, not printed)', 'Nick Saban photo courtesy of ESPN. The portrait as supplied (495 x 470 px); the printed crop is saban-espn-courtesy-crop.jpg.'),
}
credit_rows = []
for f in sorted(os.listdir(assets)):
    p = os.path.join(assets, f)
    from PIL import Image
    w, h = Image.open(p).size
    where, credit = CREDITS.get(f, ('(unlisted)', ''))
    credit_rows.append({'asset': f, 'sha256': sha(p), 'bytes': os.path.getsize(p), 'pixels': [w, h], 'usedFor': where, 'credit': credit})
manifest = {'issue': 'GatorBait Magazine, Oklahoma week (Pregame edition), Friday, Nov. 6, 2026', 'editions': {'letter': pdf_info(letter), 'phone': pdf_info(phone)}, 'creditManifest': credit_rows}
json.dump(manifest, open(out, 'w'), indent=1, ensure_ascii=False)
print('wrote', out)
