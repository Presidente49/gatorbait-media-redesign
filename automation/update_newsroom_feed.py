#!/usr/bin/env python3
"""Refresh newsroom-preview/data/posts.json from the public Wix Blog RSS feed.

Dependency-free on purpose: this runs on GitHub Actions and only writes when the
newest published-story set changes. Existing rich metadata (alt text, dimensions,
section labels, read time) is preserved when a URL is already known.
"""
from __future__ import annotations

import email.utils
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import timezone
from pathlib import Path

FEED_URL = "https://www.gatorbaitmedia.com/blog-feed.xml"
OUT = Path(__file__).resolve().parents[1] / "newsroom-preview" / "data" / "posts.json"
MAX_POSTS = 12
UA = "GatorBaitNewsroomSync/1.0 (+https://www.gatorbaitmedia.com/)"


def clean_markup(value: str | None, limit: int = 360) -> str:
    text = re.sub(r"<[^>]+>", " ", value or "")
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0].rstrip(" ,;:.!—-") + "…"
    return text


def child_text(item: ET.Element, local_name: str) -> str:
    for child in item.iter():
        if child.tag.rsplit("}", 1)[-1].lower() == local_name.lower():
            return (child.text or "").strip()
    return ""


def first_media(item: ET.Element) -> tuple[str, int, int]:
    # RSS enclosure first; then media:content / media:thumbnail.
    for child in item.iter():
        local = child.tag.rsplit("}", 1)[-1].lower()
        if local == "enclosure" and child.attrib.get("url"):
            return child.attrib["url"], int(child.attrib.get("width", 0) or 0), int(child.attrib.get("height", 0) or 0)
    for child in item.iter():
        local = child.tag.rsplit("}", 1)[-1].lower()
        if local in {"content", "thumbnail"} and child.attrib.get("url"):
            url = child.attrib["url"]
            if url.startswith("http"):
                return url, int(child.attrib.get("width", 0) or 0), int(child.attrib.get("height", 0) or 0)
    return "", 0, 0


def iso_date(raw: str) -> str:
    try:
        dt = email.utils.parsedate_to_datetime(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    except Exception:
        return raw


def load_existing() -> dict:
    if not OUT.exists():
        return {"source": "Wix Blog", "posts": []}
    return json.loads(OUT.read_text(encoding="utf-8"))


def fetch_feed() -> bytes:
    request = urllib.request.Request(
        FEED_URL,
        headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8"},
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read()


def parse_feed(payload: bytes) -> list[dict]:
    root = ET.fromstring(payload)
    items = [node for node in root.iter() if node.tag.rsplit("}", 1)[-1].lower() in {"item", "entry"}]
    posts: list[dict] = []
    for item in items:
        title = child_text(item, "title")
        link = child_text(item, "link")
        if not link:
            for child in item.iter():
                if child.tag.rsplit("}", 1)[-1].lower() == "link" and child.attrib.get("href"):
                    link = child.attrib["href"]
                    break
        if not title or "/post/" not in link:
            continue
        published = child_text(item, "pubDate") or child_text(item, "published") or child_text(item, "updated")
        author = child_text(item, "creator") or child_text(item, "author") or "GatorBait Staff"
        description = child_text(item, "description") or child_text(item, "summary") or child_text(item, "content")
        image_url, width, height = first_media(item)
        posts.append(
            {
                "title": title,
                "excerpt": clean_markup(description),
                "url": link,
                "author": clean_markup(author, 80) or "GatorBait Staff",
                "firstPublishedDate": iso_date(published),
                "section": "GatorBait",
                "image": {
                    "src": image_url,
                    "width": width or 1600,
                    "height": height or 900,
                    "alt": f"Featured image for {title}",
                },
            }
        )
    posts.sort(key=lambda p: p.get("firstPublishedDate", ""), reverse=True)
    return posts[:MAX_POSTS]


def merge_preserving_rich_metadata(fresh: list[dict], existing: list[dict]) -> list[dict]:
    by_url = {p.get("url"): p for p in existing if p.get("url")}
    merged: list[dict] = []
    for post in fresh:
        old = by_url.get(post["url"], {})
        # Feed controls freshness/order/title/excerpt/date. Existing API-verified values
        # keep richer editorial metadata when present.
        result = {**old, **post}
        result["image"] = {**post.get("image", {}), **old.get("image", {})}
        if old.get("author"):
            result["author"] = old["author"]
        if old.get("section"):
            result["section"] = old["section"]
        if old.get("minutesToRead"):
            result["minutesToRead"] = old["minutesToRead"]
        if old.get("id"):
            result["id"] = old["id"]
        merged.append(result)
    return merged


def validate(posts: list[dict]) -> None:
    if len(posts) < 4:
        raise RuntimeError(f"Feed returned only {len(posts)} valid posts; refusing to replace newsroom data")
    urls = [p["url"] for p in posts]
    if len(urls) != len(set(urls)):
        raise RuntimeError("Duplicate post URLs in refreshed feed")
    for post in posts:
        if not post.get("title") or not post.get("firstPublishedDate") or not post.get("url"):
            raise RuntimeError(f"Incomplete post record: {post}")


def main() -> None:
    existing_doc = load_existing()
    fresh = parse_feed(fetch_feed())
    merged = merge_preserving_rich_metadata(fresh, existing_doc.get("posts", []))
    validate(merged)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"source": "Wix Blog RSS", "posts": merged}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(merged)} newest posts to {OUT}")
    print(f"Lead: {merged[0]['title']}")


if __name__ == "__main__":
    main()
