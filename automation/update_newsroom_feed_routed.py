#!/usr/bin/env python3
"""Refresh the newsroom while enforcing editorial home assignments.

This wrapper keeps Magazine-only stories out of the Front Page feed and
prerender without duplicating the feed/render implementation in
update_newsroom_feed.py.
"""
from __future__ import annotations

import json

import update_newsroom_feed as base

ROUTING = base.ROOT / "newsroom-preview" / "editorial-routing.json"
FRONT_PAGE_LIMIT = 12
FEED_SCAN_LIMIT = 30


def post_slug(url: str) -> str:
    marker = "/post/"
    if marker not in url:
        return ""
    return url.split(marker, 1)[1].split("?", 1)[0].split("#", 1)[0].strip("/")


def load_front_page_exclusions() -> set[str]:
    if not ROUTING.exists():
        return set()
    payload = json.loads(ROUTING.read_text(encoding="utf-8"))
    return {str(slug).strip() for slug in payload.get("frontPageExclude", []) if str(slug).strip()}


def main() -> None:
    existing_doc = base.load_existing()
    excluded = load_front_page_exclusions()

    # Scan farther back than the displayed limit so Magazine-only stories do
    # not reduce the number of usable Front Page stories.
    base.MAX_POSTS = FEED_SCAN_LIMIT
    fresh = base.parse_feed(base.fetch_feed())
    fresh = [post for post in fresh if post_slug(post.get("url", "")) not in excluded][:FRONT_PAGE_LIMIT]

    merged = base.merge_preserving_rich_metadata(fresh, existing_doc.get("posts", []))
    base.validate(merged)
    base.OUT.parent.mkdir(parents=True, exist_ok=True)
    base.OUT.write_text(
        json.dumps({"source": "Wix Blog RSS", "posts": merged}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    base.prerender_index(merged)

    print(f"Wrote {len(merged)} Front Page posts to {base.OUT}")
    print(f"Excluded {len(excluded)} Magazine-only slugs from Front Page routing")
    print(f"Prerendered lead and story rails into {base.INDEX}")
    print(f"Lead: {merged[0]['title']}")


if __name__ == "__main__":
    main()
