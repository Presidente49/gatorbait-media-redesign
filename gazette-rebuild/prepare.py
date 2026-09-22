#!/usr/bin/env python3
"""Apply a small GatorBait overlay to the pinned original Gazette checkout.
Public RSS excerpts only. No Wix API credentials, private posts, or runtime feed calls.
"""
from __future__ import annotations
import datetime as dt
import hashlib
import html
import json
import re
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path

UPSTREAM = 'cee215fd3ec0b78bba6f99d3a59a033b0a5f0b48'
BASE = '/gatorbait-media-redesign/gazette-preview'
FEED = 'https://www.gatorbaitmedia.com/blog-feed.xml'
ORIGIN = 'https://www.gatorbaitmedia.com'
LOGO = 'https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp'
ALLOWED = {'www.gatorbaitmedia.com', 'gatorbaitmedia.com', 'static.wixstatic.com'}

class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        valid_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def valid_url(url: str) -> None:
    p = urllib.parse.urlsplit(url)
    if p.scheme != 'https' or p.hostname not in ALLOWED or p.username or p.password:
        raise ValueError('Unapproved source URL')

def download(url: str, limit: int = 8_000_000) -> tuple[bytes, str]:
    valid_url(url)
    opener = urllib.request.build_opener(SafeRedirect())
    req = urllib.request.Request(url, headers={'User-Agent': 'GatorBait-Gazette-Preview/1.0'})
    with opener.open(req, timeout=30) as r:
        data = r.read(limit + 1)
        if len(data) > limit:
            raise ValueError('Source exceeds size limit')
        return data, r.headers.get_content_type()

class PlainText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.hidden = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.hidden += 1
        if tag in ('p', 'br', 'div', 'li'): self.parts.append(' ')
    def handle_endtag(self, tag):
        if tag in ('script', 'style') and self.hidden: self.hidden -= 1
        if tag in ('p', 'div', 'li'): self.parts.append(' ')
    def handle_data(self, data):
        if not self.hidden: self.parts.append(data)

def plain(value: str, limit: int = 360) -> str:
    p = PlainText(); p.feed(value)
    text = re.sub(r'\s+', ' ', ''.join(p.parts)).strip()
    return text if len(text) <= limit else text[:limit].rsplit(' ', 1)[0].rstrip('.,:;') + '…'

def safe_id(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-') or 'gatorbait-staff'

def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text()
    if text.count(old) != 1:
        raise ValueError(f'Pinned-source patch drift: {path.name}')
    path.write_text(text.replace(old, new, 1))

def prepare(root: Path) -> dict:
    actual = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
    if actual != UPSTREAM: raise ValueError('Unexpected Gazette source commit')
    if 'MIT License' not in (root / 'LICENSE').read_text(): raise ValueError('Missing upstream license')
    raw, _ = download(FEED)
    if b'<!DOCTYPE' in raw.upper() or b'<!ENTITY' in raw.upper():
        raise ValueError('Unsafe XML declarations')
    xml = ET.fromstring(raw)
    now = dt.datetime.now(dt.timezone.utc)
    rows, seen = [], set()
    for item in xml.findall('./channel/item'):
        title = item.findtext('title', '').strip()
        source = item.findtext('link', '').strip()
        u = urllib.parse.urlsplit(source)
        if u.scheme != 'https' or u.hostname not in {'www.gatorbaitmedia.com', 'gatorbaitmedia.com'} or not u.path.startswith('/post/'):
            continue
        source = ORIGIN + u.path
        if source in seen or not title: continue
        try:
            date = parsedate_to_datetime(item.findtext('pubDate', ''))
            if date.tzinfo is None: date = date.replace(tzinfo=dt.timezone.utc)
            if date > now + dt.timedelta(days=1): continue
        except (ValueError, TypeError, OverflowError): continue
        who = item.findtext('{http://purl.org/dc/elements/1.1/}creator', '').strip()
        who = who or item.findtext('author', '').strip() or 'GatorBait Staff'
        desc = plain(item.findtext('description', ''))
        image = ''
        for child in item.iter():
            local = child.tag.rsplit('}', 1)[-1]
            candidate = child.get('url', '') if local in ('enclosure', 'content', 'thumbnail') else ''
            if candidate and urllib.parse.urlsplit(candidate).hostname == 'static.wixstatic.com':
                image = candidate; break
        rows.append({'title': title, 'source': source, 'author': who, 'published': date.astimezone(dt.timezone.utc).isoformat(), 'excerpt': desc, 'image': image})
        seen.add(source)
    rows.sort(key=lambda r: r['published'], reverse=True)
    if len(rows) < 3: raise ValueError('Not enough verified public stories; refusing placeholder build')
    # Contents remain newest-first. A recent Buddy article may be the separate magazine cover.
    candidates = rows[:20]
    buddy = next((r for r in candidates if re.search(r'\bbuddy\s+martin\b', r['author'], re.I)), None)
    rows = rows[:7]
    if buddy and buddy not in rows: rows[-1] = buddy; rows.sort(key=lambda r: r['published'], reverse=True)
    lead = buddy or rows[0]
    content = root / 'src/content'
    shutil.rmtree(content / 'articles')
    (content / 'articles').mkdir()
    assets = root / 'src/assets/gatorbait'
    assets.mkdir(parents=True, exist_ok=True)
    authors = {}
    image_warnings = []
    for i, row in enumerate(rows, 1):
        row['id'] = 'story-' + hashlib.sha256(row['source'].encode()).hexdigest()[:12]
        author_id = safe_id(row['author'])
        authors[author_id] = {'name': row['author']}
        row['local_image'] = None
        if row['image']:
            try:
                data, kind = download(row['image'])
                ext = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}.get(kind)
                if not ext: raise ValueError('Unsupported image type')
                path = assets / (row['id'] + '.' + ext)
                path.write_bytes(data)
                row['local_image'] = path.name
            except Exception as exc:
                image_warnings.append({'source': row['source'], 'error': type(exc).__name__})
        fields = {'title': row['title'], 'subtitle': row['excerpt'], 'issue': 'preview-01', 'order': i,
                  'department': 'Feature', 'authors': [author_id], 'dropCap': False, 'draft': False}
        if row['local_image']:
            fields.update(image='../../assets/gatorbait/' + row['local_image'], imageAlt=row['title'])
        fm = '\n'.join(k + ': ' + json.dumps(v, ensure_ascii=False) for k, v in fields.items())
        body = ('<p class="gbm-story-notice">Design-preview excerpt. Published ' + html.escape(row['published'][:10]) +
                '. The complete story and any member access remain on GatorBait.</p>\n\n<p>' + html.escape(row['excerpt']) +
                '</p>\n\n<p><a class="gbm-read-original" href="' + html.escape(row['source'], quote=True) +
                '">Read the full story on GatorBait →</a></p>\n')
        (content / 'articles' / (row['id'] + '.md')).write_text('---\n' + fm + '\n---\n\n' + body)
    # `lead` is one of the same row objects; image/id metadata have been attached above.
    issue = {'number': 1, 'date': now.date().isoformat(), 'coverLine': lead['title'], 'coverArticle': lead['id']}
    if lead['local_image']:
        issue.update(coverImage='../assets/gatorbait/' + lead['local_image'], coverImageAlt=lead['title'])
    (content / 'issues.json').write_text(json.dumps({'preview-01': issue}, indent=2, ensure_ascii=False))
    (content / 'authors.json').write_text(json.dumps(authors, indent=2, ensure_ascii=False))
    logo, kind = download(LOGO)
    if kind != 'image/webp': raise ValueError('Unexpected official logo format')
    (root / 'public/gatorbait-logo.webp').write_bytes(logo)
    overlay = Path(__file__).resolve().parent / 'overlay'
    shutil.copyfile(overlay / 'config.ts', root / 'src/config.ts')
    shutil.copyfile(overlay / 'theme.css', root / 'src/styles/theme.css')
    shutil.copyfile(overlay / 'about.astro', root / 'src/pages/about.astro')
    (root / 'public/favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0021a5"/><path d="M0 0h64v5H0z" fill="#fa4616"/><text x="32" y="47" text-anchor="middle" font-size="43" font-family="Georgia" font-weight="bold" fill="white">G</text></svg>')
    config = root / 'astro.config.mjs'
    replace_once(config, 'site: process.env.SITE_URL ?? site.url,', 'site: process.env.SITE_URL ?? site.url,\n  base: process.env.BASE_PATH ?? ' + json.dumps(BASE) + ',')
    layout = root / 'src/layouts/Base.astro'
    replace_once(layout, '<SEO {...seoProps} />', '<SEO {...seoProps} noindex={true} />')
    replace_once(layout, '<DemoBar />', '<div class="gbm-preview-note">Design preview · Public story excerpts · Full stories stay on GatorBait</div>')
    text = layout.read_text()
    start = text.index('    <header class=')
    end = text.index('    </header>', start) + len('    </header>')
    header = (overlay / 'header.fragment').read_text()
    layout.write_text(text[:start] + header + text[end:])
    home = root / 'src/pages/index.astro'
    replace_once(home, '        {site.name}\n      </h1>', '        <img class="gbm-cover-logo" src="/gatorbait-logo.webp" width="900" height="241" alt={site.name} />\n        <span class="gbm-magazine-word">Magazine</span>\n      </h1>')
    replace_once(home, '<span>{fmt(t.issueNumber, { n: pad(current.data.number) })}</span>', '<span>Design preview · Edition 01</span>')
    replace_once(home, '{lead.data.title}</a>', 'Read the cover story →</a>')
    # Keep license and third-party notices distributed with every built copy.
    shutil.copyfile(root / 'LICENSE', root / 'public/GAZETTE-LICENSE.txt')
    shutil.copyfile(root / 'THIRD-PARTY-NOTICES.md', root / 'public/THIRD-PARTY-NOTICES.txt')
    manifest = {'upstream': UPSTREAM, 'theme': 'Gazette 1.1.4', 'snapshot_at': now.isoformat(),
                'feed': FEED, 'feed_sha256': hashlib.sha256(raw).hexdigest(), 'stories': rows,
                'image_warnings': image_warnings, 'preview_only': True, 'full_articles_on_wix': True,
                'automated_refresh': False, 'noindex': True}
    (root / 'public/build-manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    print(json.dumps({'source': UPSTREAM, 'public_stories': len(rows), 'images': sum(bool(r['local_image']) for r in rows), 'image_warnings': image_warnings, 'snapshot_at': now.isoformat()}))
    return manifest

if __name__ == '__main__':
    prepare(Path(sys.argv[1]).resolve())
