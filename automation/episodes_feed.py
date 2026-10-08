#!/usr/bin/env python3
"""Episodes feed: The Buddy Martin Show's public YouTube RSS -> sports-live/episodes.json for the front page.

The front page's "Recent broadcasts" rail (sports-live/src/front-page.js, gbmRefreshShows) reads this file and
ignores it once checkedAt is more than 24 hours old, so this script rewrites it when the newest uploads change
and at least every 6 hours otherwise. A fetch or parse failure keeps the last good file (exit 2, nothing written).
No Wix writes happen here.

Usage:
  python automation/episodes_feed.py                 # fetch the channel feed now
  python automation/episodes_feed.py --from-file F   # build from a saved feed.xml (tests, offline review)
Exit codes: 0 ok (written or unchanged), 2 fetch/parse failure (nothing written).
"""
import argparse, datetime as dt, json, pathlib, re, sys, urllib.request
import xml.etree.ElementTree as ET

CHANNEL_ID = 'UCtR8b1sKFuwaRjKy5BiXRvA'
FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID
OUT = pathlib.Path(__file__).resolve().parents[1] / 'sports-live/episodes.json'
KEEP = 12
REWRITE_AFTER_H = 6
NS = {'a': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015'}


class EpisodeError(Exception):
    """A fetch or parse check failed; nothing is written."""


def parse(xml_text):
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as e:
        raise EpisodeError('feed is not valid XML: %s' % e)
    if (root.findtext('yt:channelId', default='', namespaces=NS) or CHANNEL_ID) != CHANNEL_ID:
        raise EpisodeError('feed is for a different channel')
    rows = []
    for entry in root.findall('a:entry', NS):
        vid = (entry.findtext('yt:videoId', default='', namespaces=NS) or '').strip()
        title = (entry.findtext('a:title', default='', namespaces=NS) or '').strip()
        published = (entry.findtext('a:published', default='', namespaces=NS) or '').strip()
        if not re.fullmatch(r'[A-Za-z0-9_-]{11}', vid) or not title or len(title) > 300:
            continue
        try:
            dt.datetime.fromisoformat(published.replace('Z', '+00:00'))
        except ValueError:
            continue
        rows.append({'id': vid, 'title': title, 'publishedAt': published})
    if len(rows) < 3:
        raise EpisodeError('feed gave %d usable videos, expected at least 3' % len(rows))
    rows.sort(key=lambda r: dt.datetime.fromisoformat(r['publishedAt'].replace('Z', '+00:00')), reverse=True)
    return rows[:KEEP]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--from-file')
    args = ap.parse_args()
    try:
        if args.from_file:
            text = pathlib.Path(args.from_file).read_text(encoding='utf-8')
        else:
            req = urllib.request.Request(FEED_URL, headers={'User-Agent': 'gatorbait-episodes-feed/1.0'})
            with urllib.request.urlopen(req, timeout=20) as r:
                text = r.read().decode('utf-8')
        rows = parse(text)
    except (EpisodeError, OSError) as e:
        print('episodes feed failed, keeping last good file: %s' % e, file=sys.stderr)
        return 2
    old = json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else {}
    old_by_id = {e['id']: e for e in old.get('episodes', []) if isinstance(e, dict) and 'id' in e}
    for r in rows:  # RSS has no duration; keep the one we already knew
        if r['id'] in old_by_id and old_by_id[r['id']].get('duration'):
            r['duration'] = old_by_id[r['id']]['duration']
    now = dt.datetime.now(dt.timezone.utc)
    try:
        age_h = (now - dt.datetime.fromisoformat(old['checkedAt'].replace('Z', '+00:00'))).total_seconds() / 3600
    except (KeyError, ValueError):
        age_h = 1e9
    if rows == old.get('episodes') and age_h < REWRITE_AFTER_H:
        print('episodes unchanged, checked %.1f h ago' % age_h)
        return 0
    out = {'channelId': CHANNEL_ID, 'channelUrl': old.get('channelUrl', 'https://www.youtube.com/@TheBuddyMartinShow'),
           'checkedAt': now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'episodes': rows}
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print('wrote %d episodes, newest: %s' % (len(rows), rows[0]['title']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
