#!/usr/bin/env python3
"""Pull full article bodies for a magazine issue from the live, server-rendered post pages.

Usage: python3 -I extract-posts.py <issue.json> <out.json>
Reads every post URL the issue references (cover, lead, cards), fetches
https://www.gatorbaitmedia.com<url>, keeps the article text (p, h2-h4, blockquote, lists)
and the inline Wix media ids, and writes one JSON the print builder consumes.
No Wix API, no secrets: public pages only.
"""
import html, json, re, sys, time, urllib.request

SITE = 'https://www.gatorbaitmedia.com'
KEEP = {'p', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'a', 'br'}
MEDIA = re.compile(r'static\.wixstatic\.com/media/([0-9a-f]{6}_[0-9a-f]{32})~mv2\.(jpe?g|png|webp|gif)')


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (GatorBait magazine print)'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf8', 'replace')


def meta(h, prop):
    m = re.search(r'<meta property="%s" content="([^"]*)"' % re.escape(prop), h)
    return html.unescape(m.group(1)) if m else ''


def clean(seg):
    """Reduce Wix's rendered rich content to plain semantic HTML."""
    seg = re.sub(r'<(script|style|svg|button)[^>]*>.*?</\1>', '', seg, flags=re.S)
    out, pos = [], 0
    for m in re.finditer(r'<(/?)([a-zA-Z0-9]+)([^>]*)>', seg):
        out.append(seg[pos:m.start()]); pos = m.end()
        closing, tag, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if tag == 'img':
            mm = MEDIA.search(attrs)
            alt = re.search(r'alt="([^"]*)"', attrs)
            if mm:
                out.append('<img data-media="%s" data-ext="%s" alt="%s">' % (mm.group(1), mm.group(2), alt.group(1) if alt else ''))
            continue
        if tag not in KEEP:
            continue
        if tag == 'a' and not closing:
            href = re.search(r'href="([^"]*)"', attrs)
            out.append('<a href="%s">' % html.escape(html.unescape(href.group(1)), quote=True) if href else '<a>')
            continue
        out.append('<%s%s>' % (closing, tag))
    out.append(seg[pos:])
    s = ''.join(out)
    s = re.sub(r'<(p|h[2-4]|li|blockquote)>\s*</\1>', '', s)        # empty blocks
    s = re.sub(r'<p>\s*(<strong>)?\s*Tags:.*$', '', s, flags=re.S)   # Wix tag footer
    s = re.sub(r'(</(?:p|h[2-4]|li|ul|ol|blockquote)>|^)\s*(<br>\s*)+', r'\1', s)   # spacer breaks between blocks
    s = re.sub(r'<p>\s*(?:<a[^>]*>)?\s*(?:<strong>)?\s*gatorbaitmedia\.com\s*(?:</strong>)?\s*(?:</a>)?\s*</p>', '', s, flags=re.I)
    s = re.sub(r'(<img[^>]+>)\s*<p>((?:Photo|Courtesy)[^<]{0,160})</p>', r'<figure>\1<figcaption>\2</figcaption></figure>', s)
    s = re.sub(r'(?<!<figure>)<img([^>]+)>', r'<figure><img\1></figure>', s)
    s = re.sub(r'\s+', ' ', s).strip()
    s = s.replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'").replace(' ', ' ')
    return s


def article(h):
    i = h.find('data-hook="post-description"')
    if i < 0:
        return ''
    seg = h[i:]
    j = seg.find('</article>')
    seg = seg[:j] if j > 0 else seg[:200000]
    seg = seg[seg.find('>') + 1:]
    return clean(seg)


def main():
    issue = json.load(open(sys.argv[1], encoding='utf8'))
    urls = []
    for key in ('cover', 'lead'):
        u = (issue.get(key) or {}).get('url')
        if u: urls.append(u)
    for c in (issue.get('cards') or {}).get('items') or []:
        if c.get('url'): urls.append(c['url'])
    seen, posts = set(), []
    for u in urls:
        if u in seen: continue
        seen.add(u)
        h = fetch(SITE + u)
        body = article(h)
        og = meta(h, 'og:image'); mm = MEDIA.search(og)
        posts.append({
            'url': u,
            'title': re.split(r' \| ', meta(h, 'og:title'))[0].strip(),
            'description': meta(h, 'og:description'),
            'published': meta(h, 'article:published_time'),
            'author': (re.search(r'<[a-z]+[^>]*data-hook="user-name"[^>]*>([^<]+)<', h) or [None, ''])[1].strip(),
            'cover': {'id': mm.group(1), 'ext': mm.group(2)} if mm else None,
            'coverW': meta(h, 'og:image:width'), 'coverH': meta(h, 'og:image:height'),
            'html': body,
            'words': len(re.sub(r'<[^>]+>', ' ', body).split()),
        })
        print('%6d words  %s  %s' % (posts[-1]['words'], posts[-1]['author'][:18].ljust(18), u), file=sys.stderr)
        time.sleep(0.4)
    json.dump({'site': SITE, 'issue': issue.get('id'), 'fetched': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'posts': posts}, open(sys.argv[2], 'w', encoding='utf8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
