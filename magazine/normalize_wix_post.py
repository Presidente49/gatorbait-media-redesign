#!/usr/bin/env python3
"""Normalize one Wix Blog API post (GET /blog/v3/posts/{id}?fieldsets=URL&fieldsets=RICH_CONTENT) into the
build-cache shape that magazine/build_issue.py and the week builders read.

Usage: normalize_wix_post.py <raw-api-response.json> <out.json>

Faithful by design: no wording is changed here. Every node becomes one block, links are recorded (not kept as markup),
and empty paragraphs are kept so the editorial pass can count and report them. Editorial cleanup lives in the issue's
prepare step, where each change is written to the receipt.

Block kinds: p (paragraph), h (heading), q (block quote), li (list item), img (image).
Run: {t: text, i: italic, b: bold, link: url or absent}.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

ENDPOINT = 'GET https://www.wixapis.com/blog/v3/posts/{id}?fieldsets=URL&fieldsets=RICH_CONTENT'


def runs_of(node):
    out = []
    for child in node.get('nodes', []):
        if child.get('type') != 'TEXT':
            continue
        data = child.get('textData', {})
        run = {'t': data.get('text', '')}
        for dec in data.get('decorations', []):
            kind = dec.get('type')
            if kind == 'ITALIC' and dec.get('italicData', True):
                run['i'] = True
            elif kind == 'BOLD':
                run['b'] = True
            elif kind == 'LINK':
                url = ((dec.get('linkData') or {}).get('link') or {}).get('url')
                if url:
                    run['link'] = url
        out.append(run)
    return out


def block(kind, node, bid=None):
    runs = runs_of(node)
    return {'k': kind, 'id': bid or node.get('id', ''), 'text': ''.join(r['t'] for r in runs), 'runs': runs}


def blocks_of(nodes):
    out = []
    for node in nodes:
        kind = node.get('type')
        if kind == 'PARAGRAPH':
            out.append(block('p', node))
        elif kind == 'HEADING':
            b = block('h', node)
            b['level'] = (node.get('headingData') or {}).get('level', 2)
            out.append(b)
        elif kind == 'BLOCKQUOTE':
            parts = [block('p', child) for child in node.get('nodes', []) if child.get('type') == 'PARAGRAPH']
            text = '\n'.join(p['text'] for p in parts)
            runs = [r for p in parts for r in p['runs']]
            out.append({'k': 'q', 'id': node.get('id', ''), 'text': text, 'runs': runs})
        elif kind in ('BULLETED_LIST', 'ORDERED_LIST'):
            for item in node.get('nodes', []):
                for child in item.get('nodes', []):
                    if child.get('type') == 'PARAGRAPH':
                        b = block('li', child, item.get('id', ''))
                        b['list'] = 'ul' if kind == 'BULLETED_LIST' else 'ol'
                        out.append(b)
        elif kind == 'IMAGE':
            data = node.get('imageData') or {}
            src = ((data.get('image') or {}).get('src') or {}).get('id', '')
            link = (data.get('link') or {}).get('url')
            out.append({'k': 'img', 'id': node.get('id', ''), 'media': src, 'alt': data.get('altText', ''), 'width': (data.get('image') or {}).get('width'),
                        'height': (data.get('image') or {}).get('height'), **({'link': link} if link else {})})
        else:
            out.append({'k': 'unknown', 'type': kind, 'id': node.get('id', '')})
    return out


def main(src, dst):
    post = json.loads(Path(src).read_text(encoding='utf-8'))['post']
    rich = post.get('richContent') or {}
    media = (post.get('media') or {}).get('wixMedia', {}).get('image') or {}
    result = {
        'id': post['id'],
        'title': post['title'],
        'excerpt': post.get('excerpt', ''),
        'slug': post.get('slug'),
        'url': post['url']['base'] + post['url']['path'],
        'source': {
            'endpoint': ENDPOINT.replace('{id}', post['id']),
            'firstPublishedDate': post.get('firstPublishedDate'),
            'lastPublishedDate': post.get('lastPublishedDate'),
            'hasUnpublishedChanges': post.get('hasUnpublishedChanges'),
            'memberId': post.get('memberId'),
            'minutesToRead': post.get('minutesToRead'),
            'pricingPlanIds': post.get('pricingPlanIds', []),
        },
        'cover': {'id': media.get('id'), 'width': media.get('width'), 'height': media.get('height'),
                  'alt': (post.get('media') or {}).get('altText', ''), 'filename': media.get('filename')},
        'blocks': blocks_of(rich.get('nodes', [])),
    }
    unknown = [b for b in result['blocks'] if b['k'] == 'unknown']
    if unknown:
        raise SystemExit('Unhandled node types in %s: %s' % (post['id'], unknown))
    Path(dst).parent.mkdir(parents=True, exist_ok=True)
    Path(dst).write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding='utf-8')
    print('%s  %d blocks  lastPublished %s  unpublishedChanges=%s' % (post['id'][:8], len(result['blocks']),
                                                                      result['source']['lastPublishedDate'], result['source']['hasUnpublishedChanges']))


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
