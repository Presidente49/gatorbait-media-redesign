#!/usr/bin/env python3
"""Refresh sports-live/buddy-videos.json from The Buddy Martin Show's public YouTube RSS feed.

The front-page "Latest from The Buddy Martin Show" row reads this file because YouTube's feed sends no CORS header.
Keeps the last good file when the feed is unreachable or returns fewer than three videos.
"""
import html
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CHANNEL = "UCtR8b1sKFuwaRjKy5BiXRvA"
FEED = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL}"
OUT = Path(__file__).resolve().parent.parent / "sports-live" / "buddy-videos.json"
KEEP = 15


def fetch() -> str:
    req = urllib.request.Request(FEED, headers={"User-Agent": "GatorBait feed refresh"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def parse(xml: str):
    vids = []
    for m in re.finditer(r"<entry>(.*?)</entry>", xml, re.S):
        e = m.group(1)
        vid = re.search(r"<yt:videoId>(.*?)</yt:videoId>", e)
        title = re.search(r"<title>(.*?)</title>", e, re.S)
        pub = re.search(r"<published>(.*?)</published>", e)
        if vid and title and pub:
            vids.append({"id": vid.group(1).strip(), "title": html.unescape(title.group(1)).strip(), "published": pub.group(1).strip()})
    vids.sort(key=lambda v: v["published"], reverse=True)
    return vids[:KEEP]


def main() -> int:
    try:
        vids = parse(fetch())
    except Exception as exc:  # keep last good file
        print(f"feed unavailable, keeping existing file: {exc}")
        return 0
    if len(vids) < 3:
        print("feed returned fewer than three videos, keeping existing file")
        return 0
    old = json.loads(OUT.read_text()) if OUT.exists() else {}
    if [v["id"] for v in old.get("videos", [])] == [v["id"] for v in vids]:
        print("no new videos")
        return 0
    data = {"channelId": CHANNEL, "fetchedAt": datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"), "videos": vids}
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {len(vids)} videos, newest {vids[0]['published']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
