#!/usr/bin/env python3
"""Turn saved web-fetch results for ESPN's API into the folder scoreboard_feed.py --from-dir reads.

Used when the machine can't reach ESPN directly and a fetch connector (TinyFish fetch_content,
format html) retrieved the JSON instead. Each input is that tool's saved result:
{"results": [{"url": ..., "text": ...}], "errors": [...]}. The connector wraps the body in
<html><body><pre>...</pre></body></html> and HTML-escapes '&' inside strings; both are undone here.
Bulky keys the feed never reads (logos, links, tickets, box scores, play lists) are dropped so
the output is small enough to commit as a test fixture.

Usage: python automation/scoreboard_import.py OUT_DIR RESULT.json [RESULT.json ...]
Writes schedule.json, standings.json and summary-<eventId>.json into OUT_DIR.
"""
import html, json, pathlib, re, sys

DROP = {'logos', 'logo', 'links', 'tickets', 'leaders', 'odds', 'pickcenter', 'news', 'article', 'videos',
        'winprobability', 'boxscore', 'scoringPlays', 'againstTheSpread', 'notes', 'headlines',
        'geoBroadcasts', 'format', 'meta'}


def clean(x):
    if isinstance(x, dict):
        return {k: clean(v) for k, v in x.items() if k not in DROP}
    if isinstance(x, list):
        return [clean(v) for v in x]
    return html.unescape(x) if isinstance(x, str) and '&' in x else x


def name_for(url):
    m = re.search(r'summary\?event=(\d+)', url)
    if m:
        return f'summary-{m.group(1)}.json'
    if re.search(r'/teams/57/schedule', url):
        return 'schedule.json'
    if '/standings' in url:
        return 'standings.json'
    raise SystemExit(f'unrecognized ESPN URL: {url}')


def main(argv):
    out = pathlib.Path(argv[0])
    out.mkdir(parents=True, exist_ok=True)
    for f in argv[1:]:
        doc = json.loads(pathlib.Path(f).read_text())
        for err in doc.get('errors') or []:
            raise SystemExit(f'fetch error in {f}: {err}')
        for r in doc['results']:
            body = re.sub(r'^\s*<html>\s*<body>\s*(<pre>)?|(</pre>)?\s*</body>\s*</html>\s*$', '', r['text']).strip()
            data = json.loads(body)
            data = clean_summary(data) if 'summary?' in r['url'] else clean_standings(data) if '/standings' in r['url'] else clean(data)
            (out / name_for(r['url'])).write_text(json.dumps(data, separators=(',', ':')))
            print(name_for(r['url']))


def clean_standings(d):
    """Keep each team's name, id, AP rank and its overall and conference records."""
    ents = []
    for e in (d.get('standings') or {}).get('entries', []):
        t = e.get('team', {})
        ents.append({'team': {k: t[k] for k in ('id', 'location', 'displayName', 'rank') if k in t},
                     'stats': [x for x in e.get('stats', []) if x.get('type') in ('total', 'vsconf')]})
    return clean({'id': d.get('id'), 'name': d.get('name'), 'season': d.get('season'), 'standings': {'entries': ents}})


def clean_summary(d):
    """Keep only what the feed reads from a summary: header, gameInfo, situation and the current drive."""
    keep = {k: d[k] for k in ('header', 'gameInfo', 'situation') if k in d}
    cur = (d.get('drives') or {}).get('current')
    if cur:
        keep['drives'] = {'current': cur}
    return clean(keep)


if __name__ == '__main__':
    main(sys.argv[1:])
