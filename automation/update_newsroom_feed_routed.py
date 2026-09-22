#!/usr/bin/env python3
"""Refresh existing Newsroom and the approved Gazette from one Wix RSS read.
The legacy Newsroom exclusions remain intact. Gazette receives the full public
publication feed for its cover and chronological contents, not member bodies.
"""
from __future__ import annotations
import json
import update_newsroom_feed as base
ROUTING = base.ROOT / 'newsroom-preview' / 'editorial-routing.json'
GAZETTE = base.ROOT / 'gazette-live' / 'posts.json'
FRONT_PAGE_LIMIT = 12
FEED_SCAN_LIMIT = 30

def post_slug(url: str) -> str:
    marker = '/post/'
    if marker not in url:
        return ''
    return url.split(marker, 1)[1].split('?', 1)[0].split('#', 1)[0].strip('/')

def load_front_page_exclusions() -> set[str]:
    if not ROUTING.exists():
        return set()
    payload = json.loads(ROUTING.read_text(encoding='utf-8'))
    return {str(slug).strip() for slug in payload.get('frontPageExclude', []) if str(slug).strip()}

def main() -> None:
    existing_doc = base.load_existing()
    excluded = load_front_page_exclusions()
    base.MAX_POSTS = FEED_SCAN_LIMIT
    full_public_feed = base.parse_feed(base.fetch_feed())
    base.validate(full_public_feed)
    fresh = [post for post in full_public_feed if post_slug(post.get('url', '')) not in excluded][:FRONT_PAGE_LIMIT]
    merged = base.merge_preserving_rich_metadata(fresh, existing_doc.get('posts', []))
    base.validate(merged)
    base.OUT.parent.mkdir(parents=True, exist_ok=True)
    base.OUT.write_text(json.dumps({'source': 'Wix Blog RSS', 'posts': merged}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    base.prerender_index(merged)
    GAZETTE.parent.mkdir(parents=True, exist_ok=True)
    GAZETTE.write_text(json.dumps({'source': 'Wix Blog RSS', 'posts': full_public_feed}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {len(merged)} legacy Newsroom posts and {len(full_public_feed)} Gazette posts from one source read')
    print(f'Legacy routing exclusions retained: {len(excluded)}')
    print(f'Gazette newest: {full_public_feed[0]["title"]}')

if __name__ == '__main__':
    main()
