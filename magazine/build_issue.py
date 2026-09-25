#!/usr/bin/env python3
"""Continue the existing full-article issue builder. Draft export only.

Inputs stay frozen in the existing build-cache. No Wix writes, sends, checkout
changes or website deployment. Body wording stays intact; web furniture and
unapproved/duplicate photography are excluded with an explicit build receipt.
"""
from __future__ import annotations
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'magazine' / 'build-cache' / 'posts'
CDN = 'https://static.wixstatic.com/media/'

def esc(value):
    return html.escape(str(value), quote=True)

def text_of(block):
    return block.get('text', ''.join(run.get('t', '') for run in block.get('runs', [])))

def render_text(block):
    # Normalize accidental all-bold CMS formatting, never rewrite the prose.
    if 'text' in block:
        return esc(block['text'])
    return ''.join('<em>' + esc(r.get('t', '')) + '</em>' if r.get('i') else esc(r.get('t', '')) for r in block.get('runs', []))

def photo(meta, used, skipped):
    if not meta or not meta.get('id'):
        return ''
    mid = meta['id']
    if mid in used:
        skipped.append({'id': mid, 'reason': 'already used in this issue'})
        return ''
    if not meta.get('credit'):
        raise ValueError('A selected photograph has no credit: ' + mid)
    used.add(mid)
    return '<figure><img src="%s" width="%s" height="%s" alt="%s"><figcaption>%s</figcaption></figure>' % (
        esc(CDN + mid), int(meta['w']), int(meta['h']), esc(meta.get('alt', '')), esc(meta['credit']))

def main(issue_dir):
    base = ROOT / issue_dir
    meta = json.loads((base / 'issue.json').read_text(encoding='utf-8'))
    articles = [json.loads((CACHE / (pid + '.json')).read_text(encoding='utf-8')) for pid in meta['posts']]
    if len(articles) != len(set(meta['posts'])):
        raise ValueError('Duplicate article IDs in issue')
    report, parts, used = [], [], set()
    skipped = []
    cover_html = photo(meta.get('cover'), used, skipped)
    for pid, article in zip(meta['posts'], articles):
        title = article['title'].strip()
        byline = meta['bylines'][pid]
        blocks, removed = [], []
        for b in article['blocks']:
            if b['k'] == 'img':
                removed.append({'type': 'image', 'id': b.get('id'), 'reason': 'issue-specific credited artwork selection replaces web art'})
                continue
            text = text_of(b).strip()
            if not text:
                continue
            if re.match(r'^More From\b', text, re.I):
                removed.append({'type': 'web-promotion', 'reason': 'trailing related-story and subscribe section omitted'})
                break
            if not blocks and (re.match(r'^By\s', text) or text == 'GatorBaitMedia.com' or text == 'BUDDY MARTIN | COLUMN'):
                removed.append({'type': 'display-metadata', 'text': text})
                continue
            if text.startswith('Photo: Anthony Garro/'):
                removed.append({'type': 'photo-credit', 'reason': 'associated low-resolution web image not selected'})
                continue
            blocks.append(b)
        if not blocks:
            raise ValueError('Empty article: ' + pid)
        prose = ' '.join(text_of(b).strip() for b in blocks)
        word_count = len(prose.split())
        if word_count < meta['minimumWords'][pid]:
            raise ValueError('Full-body completeness floor failed: ' + pid)
        art_image = photo(meta.get('storyImages', {}).get(pid), used, skipped)
        body, first = [], True
        for index, b in enumerate(blocks):
            text = text_of(b).strip()
            if b['k'] == 'h' or text in meta.get('sourceSubheads', {}).get(pid, []):
                body.append('<h3>%s</h3>' % esc(text))
            elif b['k'] == 'q':
                body.append('<blockquote>%s</blockquote>' % render_text(b))
            else:
                body.append('<p%s>%s</p>' % (' class="lede"' if first else '', render_text(b)))
                first = False
        parts.append('<article class="story" id="story-%s"><header class="story-head"><p class="kicker">%s</p><h2>%s</h2><p class="byline">By %s</p></header>%s<div class="story-body">%s</div><p class="end-sign">GATORBAIT</p></article>' % (
            pid, esc(meta['kickers'][pid]), esc(title), esc(byline), art_image, '\n'.join(body)))
        report.append({'id': pid, 'title': title, 'byline': byline, 'words': word_count, 'bodyBlocks': len(blocks), 'omissions': removed, 'source': article.get('source') or meta.get('sources', {}).get(pid), 'fullBodyRequired': True})
    rows = ''.join('<li><div><span class="contents-kicker">%s</span><h3>%s</h3><p>%s</p></div><span class="folio" data-story="%s">—</span></li>' % (
        esc(meta['kickers'][pid]), esc(a['title'].strip()), esc(meta['bylines'][pid]), pid) for pid, a in zip(meta['posts'], articles))
    css = (ROOT / 'magazine' / 'issue.css').read_text(encoding='utf-8')
    output = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>%(title)s</title><style>%(css)s</style></head><body>
<section class="cover"><p class="masthead">GatorBait<span>MAGAZINE</span></p><p class="issue-line">%(issue)s</p><div class="cover-art">%(photo)s</div><p class="cover-author">BUDDY MARTIN</p><h1>%(coverTitle)s</h1><p class="cover-deck">%(deck)s</p><div class="cover-bottom">FOUR COMPLETE ARTICLES<span>OLE MISS WEEK</span></div></section>
<section class="contents"><p class="kicker">THE COMPLETE READING EDITION</p><h2>Inside this issue</h2><p class="contents-intro">Original columns and football analysis from GatorBait Media, collected in one edition to keep and read offline.</p><ol>%(rows)s</ol><div class="edition-note"><h3>About this edition</h3><p>Complete article bodies are reproduced from the published GatorBait originals. Web navigation, subscription pitches and related-story lists have been removed. Reporting, rankings and odds reflect each article’s original publication, not a live update.</p><p>Editorial lead: Buddy Martin<br>Contributors: Franz Beard and Eddie Gilley<br>Photography in this review: Chris Spears</p><p class="review-note">REVIEW COPY · Not released for sale. Final editorial and photography-use approval, price and checkout delivery remain pending.</p></div></section>
%(bodies)s
</body></html>''' % {
        'title': esc(meta['title']), 'css': css, 'issue': esc(meta['issueLine']), 'photo': cover_html,
        'coverTitle': esc(meta['coverTitle']), 'deck': esc(meta['coverDeck']), 'rows': rows, 'bodies': '\n'.join(parts)}
    if re.search(r'<a\b|\bhref\s*=', output, re.I):
        raise ValueError('Outbound link in offline reading edition')
    (base / 'issue.html').write_text(output, encoding='utf-8')
    receipt = {'status': 'DRAFT_REVIEW_ONLY', 'articleCount': len(report), 'words': sum(r['words'] for r in report), 'selectedImages': sorted(used), 'skippedImages': skipped, 'articles': report, 'releaseGates': ['editorial proof', 'photography rights for separate paid issue', 'approved price', 'verified paid-download delivery']}
    (base / 'build-report.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'articleCount': len(report), 'words': receipt['words'], 'images': len(used), 'status': receipt['status']}, indent=2))
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'magazine/issues/2026-09-26-ole-miss'))
