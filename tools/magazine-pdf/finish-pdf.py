#!/usr/bin/env python3
"""Finish a Chromium-printed issue PDF: replace its auto-generated bookmarks with clean ones, point internal
(contents) links at the top of the target page, and set document properties.
Usage: finish-pdf.py <issue.pdf> <spec.json>   (spec: {outline:[{title,page,children?}], title, author, subject}; pages are 1-based)
Run with a Python that has pypdf (on this container: /usr/bin/python3)."""
import json
import os
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, BooleanObject, DictionaryObject, NameObject

pdf, spec_path = sys.argv[1], sys.argv[2]
spec = json.load(open(spec_path))
reader = PdfReader(pdf)
writer = PdfWriter(clone_from=reader)

# 1. bookmarks
if '/Outlines' in writer._root_object:
    del writer._root_object['/Outlines']


def add(items, parent=None):
    for it in items:
        ref = writer.add_outline_item(it['title'], it['page'] - 1, parent=parent)
        if it.get('children'):
            add(it['children'], ref)


add(spec['outline'])

# 2. internal links: named destination -> explicit page, fit to page (lands at the top, never mid-page)
names = {str(k).lstrip('/'): v for k, v in reader.named_destinations.items()}
fixed = missing = 0
for page in writer.pages:
    for annot in page.get('/Annots', []) or []:
        a = annot.get_object()
        holder, field = a, '/Dest'
        d = a.get('/Dest')
        if d is None:
            action = a.get('/A')
            if action is None:
                continue
            action = action.get_object()
            if action.get('/S') != '/GoTo':
                continue
            holder, field = action, '/D'
            d = action.get('/D')
        if d is None or isinstance(d, ArrayObject):
            continue
        key = str(d).lstrip('/')
        dest = names.get(key)
        if dest is None:
            missing += 1
            continue
        idx = reader.get_destination_page_number(dest)
        holder[NameObject(field)] = ArrayObject([writer.pages[idx].indirect_reference, NameObject('/Fit')])
        fixed += 1

# 3. document properties
writer.add_metadata({'/Title': spec['title'], '/Author': spec['author'], '/Subject': spec['subject'], '/Creator': 'GatorBait Media magazine builder (Chromium)'})
writer._root_object[NameObject('/PageMode')] = NameObject('/UseOutlines')
prefs = DictionaryObject({NameObject('/DisplayDocTitle'): BooleanObject(True)})
writer._root_object[NameObject('/ViewerPreferences')] = prefs

tmp = pdf + '.tmp'
with open(tmp, 'wb') as f:
    writer.write(f)
os.replace(tmp, pdf)
print('finish-pdf: %d internal links set to page top (%d unresolved), %d bookmarks' % (fixed, missing, len(spec['outline'])))
