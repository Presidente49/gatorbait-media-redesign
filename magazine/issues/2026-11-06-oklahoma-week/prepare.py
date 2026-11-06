#!/usr/bin/env python3
"""Apply the editorial rules in issue.json to the normalized Wix posts and write posts.json and receipt.json.

Usage: python3 -I magazine/issues/2026-11-06-oklahoma-week/prepare.py [source-dir]
  source-dir defaults to the committed source/ folder next to this script: the six normalized Blog API bodies
  (output of magazine/normalize_wix_post.py, one <post-id>.json each, text exactly as published, lastPublishedDate inside).

posts.json is the input the magazine PDF builder reads: {posts: [{url, title, author, byline, rubric, minutesToRead, html,
caption, pullquote, words}]}. receipt.json lists, per post, the live post id, lastPublishedDate, word counts and every
change made to the body. No outbound link, no banned-credit text and no empty block may survive; the script exits
non-zero if one does.
"""
from __future__ import annotations
import html
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
cache = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'source'
cfg = json.loads((HERE / 'issue.json').read_text(encoding='utf-8'))


def esc(s):
    return html.escape(s, quote=False)


def run_html(r):
    t = esc(r['t'])
    if r.get('i'):
        t = '<em>' + t + '</em>'
    if r.get('b'):
        t = '<strong>' + t + '</strong>'
    return t


def block_html(b):
    inner = ''.join(run_html(r) for r in b['runs'])
    if b['k'] == 'h':
        return '<h3>' + inner + '</h3>'
    if b['k'] == 'q':
        return '<blockquote>' + inner + '</blockquote>'
    return '<p>' + inner + '</p>'


def retext(b, text):
    """Replace a block's text with a plain, single-run version (used only after a recorded rule)."""
    b['text'] = text
    b['runs'] = [{'t': text, **({'i': True} if any(r.get('i') for r in b['runs']) and all(r.get('i') for r in b['runs']) else {})}]


def wordcount(blocks):
    return len(' '.join(b['text'] for b in blocks).split())


posts, receipt_posts = [], []
for spec in cfg['posts']:
    src = json.loads((cache / (spec['id'] + '.json')).read_text(encoding='utf-8'))
    blocks = [dict(b) for b in src['blocks']]
    changes = []
    caption = None
    before_words = wordcount([b for b in blocks if b['k'] in ('p', 'h', 'q', 'li')])
    for rule in spec['rules']:
        op, bid = rule['op'], rule.get('id')
        idx = next((i for i, b in enumerate(blocks) if b['id'] == bid), None)
        if idx is None:
            raise SystemExit('%s: rule %s refers to missing block %s' % (spec['key'], op, bid))
        b = blocks[idx]
        if op == 'drop-id':
            changes.append({'op': op, 'block': bid, 'kind': b['k'], 'text': b.get('text', '')[:140] or b.get('alt', '')[:140], 'reason': rule['reason']})
            del blocks[idx]
        elif op == 'caption-from-id':
            caption = b['text'].strip()
            changes.append({'op': op, 'block': bid, 'text': caption, 'reason': rule['reason']})
            del blocks[idx]
        elif op == 'keep-prefix':
            if not b['text'].startswith(rule['keep']):
                raise SystemExit('%s: block %s does not start with the expected text' % (spec['key'], bid))
            removed = b['text'][len(rule['keep']):]
            retext(b, rule['keep'])
            changes.append({'op': op, 'block': bid, 'removedText': removed, 'reason': rule['reason']})
        elif op == 'replace':
            if rule['from'] not in b['text']:
                raise SystemExit('%s: replace text not found in %s' % (spec['key'], bid))
            new = b['text'].replace(rule['from'], rule['to'], 1)
            # Keep run structure (emphasis) when the block is one run; otherwise rebuild as one run and say so.
            if len(b['runs']) == 1:
                b['runs'][0]['t'] = new
                b['text'] = new
            else:
                retext(b, new)
            changes.append({'op': op, 'block': bid, 'from': rule['from'], 'to': rule['to'], 'reason': rule['reason']})
        elif op == 'split-newline':
            parts = [p for p in b['text'].split('\n') if p.strip()]
            if len(parts) < 2 or len(b['runs']) != 1:
                raise SystemExit('%s: split-newline needs a single-run block with a newline (%s)' % (spec['key'], bid))
            new = [dict(b, id=bid + '-' + str(n), text=p, runs=[{'t': p}]) for n, p in enumerate(parts)]
            blocks[idx:idx + 1] = new
            changes.append({'op': op, 'block': bid, 'parts': len(parts), 'reason': rule['reason']})
        else:
            raise SystemExit('unknown op ' + op)
    # Global rules.
    empties = [b['id'] for b in blocks if b['k'] in ('p', 'h', 'q') and not b['text'].strip()]
    blocks = [b for b in blocks if not (b['k'] in ('p', 'h', 'q') and not b['text'].strip())]
    trimmed = []
    for b in blocks:
        if b['k'] in ('p', 'h', 'q', 'li') and b['text'] != b['text'].strip():
            trimmed.append(b['id'])
            b['runs'][0]['t'] = b['runs'][0]['t'].lstrip()
            b['runs'][-1]['t'] = b['runs'][-1]['t'].rstrip()
            b['text'] = ''.join(r['t'] for r in b['runs'])
    # Hard gates.
    if any(b['k'] in ('img', 'unknown') for b in blocks):
        raise SystemExit('%s: an image block survived: %s' % (spec['key'], [b['id'] for b in blocks if b['k'] == 'img']))
    body_text = ' '.join(b['text'] for b in blocks)
    if re.search(r'https?://|www\.', body_text):
        raise SystemExit('%s: a URL survived in the body' % spec['key'])
    if re.search(r'gator\s*country', body_text, re.I):
        raise SystemExit('%s: banned credit text in body' % spec['key'])
    # Quote-mark audit (reported, not changed).
    quote_flags = []
    for b in blocks:
        opens, closes, straight = b['text'].count('“'), b['text'].count('”'), b['text'].count('"')
        if opens != closes or straight % 2:
            quote_flags.append({'block': b['id'], 'open': opens, 'close': closes, 'straight': straight, 'starts': b['text'][:70]})
    # Pull quote (text must be verbatim from the live body).
    pq = None
    if spec.get('pullquote'):
        spec_pq = spec['pullquote']
        src_block = next(b for b in src['blocks'] if b['id'] == spec_pq['id'])
        txt = src_block['text'].strip()
        if spec_pq.get('from'):
            if spec_pq['from'] not in txt:
                raise SystemExit('%s: pull quote text is not verbatim' % spec['key'])
            txt = spec_pq['from']
        pq = {'text': txt, 'who': spec_pq['who']}
    path = re.sub(r'^https://www\.gatorbaitmedia\.com', '', src['url'])
    out = {
        'id': spec['id'], 'key': spec['key'], 'url': path, 'title': src['title'], 'rubric': spec['rubric'],
        'author': spec['author'], 'byline': spec['byline'], 'minutesToRead': src['source']['minutesToRead'],
        'excerpt': src['excerpt'], 'hero': spec['hero'], 'caption': caption, 'pullquote': pq,
        'html': ''.join(block_html(b) for b in blocks), 'words': wordcount(blocks),
    }
    posts.append(out)
    receipt_posts.append({
        'id': spec['id'], 'key': spec['key'], 'title': src['title'], 'url': src['url'], 'author': spec['author'],
        'lastPublishedDate': src['source']['lastPublishedDate'], 'firstPublishedDate': src['source']['firstPublishedDate'],
        'hasUnpublishedChanges': src['source']['hasUnpublishedChanges'], 'bodyWordsBefore': before_words, 'bodyWordsAfter': out['words'],
        'emptyParagraphsDropped': len(empties), 'whitespaceTrimmedBlocks': trimmed, 'changes': changes, 'quoteMarkAudit': quote_flags,
        'api': src['source']['endpoint'],
    })
    print('%-9s %5d -> %5d words, %2d empty dropped, %d rule changes, %d quote flags' % (spec['key'], before_words, out['words'], len(empties), len(changes), len(quote_flags)))

(HERE / 'posts.json').write_text(json.dumps({'site': 'https://www.gatorbaitmedia.com', 'issue': cfg['id'], 'posts': posts}, ensure_ascii=False, indent=1), encoding='utf-8')
(HERE / 'receipt.json').write_text(json.dumps({'issue': cfg['id'], 'siteId': cfg['siteId'], 'source': 'Wix Blog API, published version, read-only', 'posts': receipt_posts}, ensure_ascii=False, indent=1), encoding='utf-8')
print('wrote posts.json and receipt.json')
