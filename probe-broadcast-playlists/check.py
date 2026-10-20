import datetime, json, re, urllib.request
from pathlib import Path

playlists = {
    'lowdown': 'PLIekxRlp1omM',
    'podcasts': 'PL1twZqsaZwxneDPF2RojFUTMXgr-OK41I',
    'shorts': 'PL1twZqsaZwxnM5F4xVYTJlia_-IIIHgKa',
}
results = []
for name, playlist in playlists.items():
    url = 'https://www.youtube.com/playlist?list=' + playlist
    row = {'key': name, 'playlistId': playlist, 'url': url}
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9'})
        with urllib.request.urlopen(req, timeout=25) as response:
            html = response.read().decode('utf-8', 'replace')
            row.update(http=response.status, finalUrl=response.url, bytes=len(html))
        row['pageTitle'] = re.findall(r'<title>(.*?)</title>', html, re.S)[:1]
        row['unavailable'] = list(dict.fromkeys(re.findall(r'(?:This playlist does not exist|The playlist does not exist|This playlist is private|This playlist is unavailable)', html, re.I)))
        match = re.search(r'var ytInitialData\s*=\s*', html)
        if match:
            data, _ = json.JSONDecoder().raw_decode(html[match.end():])
            texts = []
            def walk(value):
                if isinstance(value, dict):
                    if 'playlistVideoRenderer' in value:
                        item = value['playlistVideoRenderer']
                        texts.append({'videoId': item.get('videoId'), 'title': ''.join(x.get('text', '') for x in item.get('title', {}).get('runs', []))})
                    if 'alertRenderer' in value:
                        row.setdefault('alerts', []).append(value['alertRenderer'])
                    for v in value.values(): walk(v)
                elif isinstance(value, list):
                    for v in value: walk(v)
            walk(data)
            row['firstVideos'] = texts[:5]
            row['videoCountInInitialPage'] = len(texts)
    except Exception as error:
        row['error'] = str(error)[:400]
    results.append(row)
output = {'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'results': results}
Path('probe-broadcast-playlists/result.json').write_text(json.dumps(output, indent=2) + '\n')
print(json.dumps(output, indent=2))
