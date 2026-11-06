#!/usr/bin/env python3
"""Cross-check normalized Wix API bodies against the public, server-rendered post pages (published versions).

Usage: verify_against_public.py <build-cache/posts dir> <dir with saved public html named <slug>.html>
For every normalized post, the ordered list of non-empty paragraph, heading, quote and list-item texts from the API must equal
the same list read from the page's article element (smart quotes, dashes and non-breaking spaces folded). Prints one line per
post and exits non-zero on any difference. No network: save the pages first with curl (public pages, no credentials).
"""
from __future__ import annotations
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

FOLD = str.maketrans({'“': '"', '”': '"', '‘': "'", '’': "'", '–': '-', '—': '-', ' ': ' ', '​': ''})


def fold(s):
    return re.sub(r'\s+', ' ', s.translate(FOLD)).strip()


class Article(HTMLParser):
    BLOCKS = {'p', 'h1', 'h2', 'h3', 'h4', 'li', 'blockquote'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.in_article = False
        self.stack = []
        self.out = []
        self.buf = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if not self.in_article and a.get('data-hook') == 'post-description':
            self.in_article = True
            self.depth = 1
            return
        if not self.in_article:
            return
        if tag not in ('br', 'img', 'hr', 'input', 'meta', 'link', 'source'):
            self.depth += 1
        if tag in self.BLOCKS and self.buf is None:
            self.buf = []
            self.stack.append(self.depth)
        elif tag == 'br' and self.buf is not None:
            self.buf.append('\n')

    def handle_endtag(self, tag):
        if not self.in_article:
            return
        if tag in self.BLOCKS and self.stack and self.stack[-1] == self.depth and self.buf is not None:
            text = fold(''.join(self.buf))
            if text:
                self.out.append(text)
            self.buf = None
            self.stack.pop()
        if tag not in ('br', 'img', 'hr', 'input', 'meta', 'link', 'source'):
            self.depth -= 1
            if self.depth <= 0:
                self.in_article = False

    def handle_data(self, data):
        if self.in_article and self.buf is not None:
            self.buf.append(data)


def api_texts(post):
    out = []
    for b in post['blocks']:
        if b['k'] not in ('p', 'h', 'li', 'q'):
            continue
        # The rendered page folds a literal newline inside a paragraph to a space, so compare one text per API block.
        t = fold(b['text'])
        if t:
            out.append(t)
    return out


def main(cache, pages):
    bad = 0
    for f in sorted(Path(cache).glob('*.json')):
        post = json.loads(f.read_text(encoding='utf-8'))
        page = Path(pages) / (post['slug'] + '.html')
        parser = Article()
        parser.feed(page.read_text(encoding='utf-8', errors='replace'))
        site, api = parser.out, api_texts(post)
        same = site == api
        print('%s %-62s api=%3d page=%3d %s' % (post['id'][:8], post['slug'][:62], len(api), len(site), 'IDENTICAL' if same else 'DIFFERENT'))
        if not same:
            bad += 1
            for i, (x, y) in enumerate(zip(api, site)):
                if x != y:
                    print('   first difference at paragraph %d\n   api : %s\n   page: %s' % (i, x[:200], y[:200]))
                    break
            else:
                print('   length differs: api tail %s | page tail %s' % (api[len(site):][:2], site[len(api):][:2]))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
