#!/usr/bin/env python3
"""Refresh the standalone newsroom from the public Wix Blog RSS feed.

This dependency-free job keeps both the JSON feed and the initial HTML current.
The HTML prerender makes the newest story visible immediately to readers and
crawlers; app.js then keeps an already-open page fresh without a full reload.
"""
from __future__ import annotations

import email.utils
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEED_URL = "https://www.gatorbaitmedia.com/blog-feed.xml"
OUT = ROOT / "newsroom-preview" / "data" / "posts.json"
INDEX = ROOT / "newsroom-preview" / "index.html"
MAX_POSTS = 12
UA = "GatorBaitNewsroomSync/1.1 (+https://www.gatorbaitmedia.com/)"


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


def display_date(raw: str) -> str:
    try:
        dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        return f"{dt.strftime('%b')} {dt.day}, {dt.year}"
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


def e(value: object) -> str:
    return html.escape(str(value or ""), quote=True)


def post_meta(post: dict) -> str:
    bits = [post.get("author") or "GatorBait Staff", display_date(post.get("firstPublishedDate", ""))]
    if post.get("minutesToRead"):
        bits.append(f"{post['minutesToRead']} min read")
    return " · ".join(e(bit) for bit in bits if bit)


def image_html(post: dict, kind: str) -> str:
    image = post.get("image") or {}
    src = image.get("src") or ""
    if not src:
        return ""
    width = int(image.get("width") or 1600)
    height = int(image.get("height") or 900)
    alt = image.get("alt") or f"Featured image for {post.get('title', '')}"
    if kind == "lead":
        return f'<img src="{e(src)}" alt="{e(alt)}" width="{width}" height="{height}" loading="eager" decoding="async" fetchpriority="high">'
    return f'<img src="{e(src)}" alt="{e(alt)}" width="{width}" height="{height}" loading="lazy" decoding="async">'


def render_lead(post: dict) -> str:
    return (
        f'<a class="lead-link" href="{e(post["url"])}">\n'
        f'          <div class="lead-media">{image_html(post, "lead")}</div>\n'
        f'          <div class="leadcopy"><span class="kicker">Latest</span><h1>{e(post["title"])}</h1>'
        f'<p>{e(post.get("excerpt", ""))}</p><div class="meta">{post_meta(post)}</div></div>\n'
        f'        </a>'
    )


def render_compact(post: dict) -> str:
    return (
        f'<a class="compact" href="{e(post["url"])}"><div class="compact-media">{image_html(post, "compact")}</div>'
        f'<div><span class="kicker">{e(post.get("section") or "GatorBait")}</span><h3>{e(post["title"])}</h3>'
        f'<div class="meta">{post_meta(post)}</div></div></a>'
    )


def render_card(post: dict) -> str:
    return (
        f'<a class="card" href="{e(post["url"])}"><div class="card-media">{image_html(post, "card")}</div>'
        f'<span class="kicker">{e(post.get("section") or "GatorBait")}</span><h3>{e(post["title"])}</h3>'
        f'<p>{e(post.get("excerpt", ""))}</p><div class="meta">{post_meta(post)}</div></a>'
    )


def replace_auto_block(source: str, name: str, body: str) -> str:
    pattern = re.compile(
        rf"(<!-- AUTO:{re.escape(name)} START -->).*?(<!-- AUTO:{re.escape(name)} END -->)",
        re.DOTALL,
    )
    replacement = rf"\1\n        {body}\n        \2"
    updated, count = pattern.subn(replacement, source, count=1)
    if count != 1:
        raise RuntimeError(f"Missing or duplicated AUTO block: {name}")
    return updated


def prerender_index(posts: list[dict]) -> None:
    source = INDEX.read_text(encoding="utf-8")
    lead = posts[0]
    preload_src = (lead.get("image") or {}).get("src") or ""
    preload = f'<link rel="preload" as="image" href="{e(preload_src)}" fetchpriority="high">' if preload_src else ""
    source = replace_auto_block(source, "LEAD-PRELOAD", preload)
    source = replace_auto_block(source, "LEAD", render_lead(lead))
    source = replace_auto_block(source, "LATEST", "\n          ".join(render_compact(post) for post in posts[1:5]))
    source = replace_auto_block(source, "INSIDE", "\n        ".join(render_card(post) for post in posts[5:8]))
    if preload_src:
        source = re.sub(
            r'<meta property="og:image" content="[^"]*">',
            f'<meta property="og:image" content="{e(preload_src)}">',
            source,
            count=1,
        )
    INDEX.write_text(source, encoding="utf-8")


def main() -> None:
    existing_doc = load_existing()
    fresh = parse_feed(fetch_feed())
    merged = merge_preserving_rich_metadata(fresh, existing_doc.get("posts", []))
    validate(merged)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"source": "Wix Blog RSS", "posts": merged}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    prerender_index(merged)
    print(f"Wrote {len(merged)} newest posts to {OUT}")
    print(f"Prerendered lead and story rails into {INDEX}")
    print(f"Lead: {merged[0]['title']}")


if __name__ == "__main__":
    main()
