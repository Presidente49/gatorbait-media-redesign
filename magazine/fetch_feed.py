#!/usr/bin/env python3
"""Pull full article bodies from the public Wix blog feed into a build cache.

Runs in CI, which can reach gatorbaitmedia.com. The agent session cannot, and
routing whole articles through a chat context is both lossy and expensive, so
the text goes feed -> disk -> issue builder without a detour.

Wix remains the system of record for every article. Nothing here is a CMS:
this is a transient build input for one magazine issue, safe to delete and
regenerate at any time.
"""
from __future__ import annotations

import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEED_URL = "https://www.gatorbaitmedia.com/blog-feed.xml"
OUT = ROOT / "magazine" / "build-cache" / "feed.json"
UA = "GatorBaitMagazineIssueBuilder/1.0 (+https://www.gatorbaitmedia.com/)"

NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
}


def text_of(node) -> str:
    return (node.text or "") if node is not None else ""


def plain(markup: str) -> str:
    stripped = re.sub(r"<[^>]+>", " ", markup or "")
    return re.sub(r"\s+", " ", html.unescape(stripped)).strip()


def main() -> int:
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as resp:
        raw = resp.read()

    root = ET.fromstring(raw)
    items = []
    for item in root.iter("item"):
        encoded = text_of(item.find("content:encoded", NS))
        description = text_of(item.find("description"))
        # content:encoded is the full body; description is the teaser. Prefer
        # the body, and record both lengths so a feed that silently degrades to
        # excerpts is visible rather than quietly shipping a thin issue.
        items.append(
            {
                "title": plain(text_of(item.find("title"))),
                "link": text_of(item.find("link")).strip(),
                "pubDate": text_of(item.find("pubDate")).strip(),
                "author": plain(text_of(item.find("dc:creator", NS))),
                "bodyHtml": encoded,
                "bodyChars": len(plain(encoded)),
                "excerptChars": len(plain(description)),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"feed": FEED_URL, "items": items}, indent=1), encoding="utf-8")

    full = [i for i in items if i["bodyChars"] > i["excerptChars"] + 400]
    print("feed items: %d" % len(items))
    print("items carrying a full body: %d" % len(full))
    print("")
    print("%-9s %-7s  %s" % ("body", "excerpt", "title"))
    for i in items[:25]:
        print("%-9d %-7d  %s" % (i["bodyChars"], i["excerptChars"], i["title"][:66]))
    if not full:
        print("")
        print("::error::feed carries excerpts only - full articles must come from the Blog API instead")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
