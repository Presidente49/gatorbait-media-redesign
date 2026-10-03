#!/usr/bin/env python3
"""Turn saved web-fetch results for ESPN's API into the folder layout florida_stats.py --from-dir reads.

Used when the machine running the pipeline can't reach site.api.espn.com directly and a fetch
connector (TinyFish fetch_content) retrieved the JSON instead. Each input file is that tool's result:
{"results": [{"url": ..., "text": ...}], "errors": [...]}. The connector may wrap the body in
<html><body>…</body></html> and HTML-escape '&' inside strings; both are undone here. The pipeline's
own consistency checks still run on the result, so a garbled fetch stops the build.

Usage: python automation/florida_stats_import.py OUT_DIR RESULT.json [RESULT.json ...]
"""
import html, json, pathlib, re, sys


def unescape(x):
    if isinstance(x, dict):
        return {k: unescape(v) for k, v in x.items()}
    if isinstance(x, list):
        return [unescape(v) for v in x]
    return html.unescape(x) if isinstance(x, str) and '&' in x else x


def name_for(url):
    m = re.search(r'summary\?event=(\d+)', url)
    if m:
        return f'summary-{m.group(1)}.json'
    m = re.search(r'teams/57/schedule\?.*seasontype=(\d)', url)
    if m:
        return f'schedule-{m.group(1)}.json'
    raise SystemExit(f'unrecognized ESPN URL: {url}')


def main(argv):
    out = pathlib.Path(argv[0])
    out.mkdir(parents=True, exist_ok=True)
    for f in argv[1:]:
        doc = json.loads(pathlib.Path(f).read_text())
        for err in doc.get('errors') or []:
            raise SystemExit(f'fetch error in {f}: {err}')
        for r in doc['results']:
            body = re.sub(r'^\s*<html>\s*<body>|</body>\s*</html>\s*$', '', r['text']).strip()
            data = unescape(json.loads(body))
            (out / name_for(r['url'])).write_text(json.dumps(data))
            print(name_for(r['url']))


if __name__ == '__main__':
    main(sys.argv[1:])
