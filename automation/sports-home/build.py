#!/usr/bin/env python3
"""Build the single Wix sports-home renderer using the existing public RSS adapter."""
from pathlib import Path
import importlib.util,json,hashlib
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('feed',ROOT/'automation/update_newsroom_feed.py')
feed=importlib.util.module_from_spec(spec);spec.loader.exec_module(feed)
feed.MAX_POSTS=30
posts=feed.parse_feed(feed.fetch_feed());feed.validate(posts)
source=ROOT/'automation/sports-home';out=ROOT/'sports-live';out.mkdir(exist_ok=True)
payload={'css':(source/'homepage.css').read_text(),'fallback':{'source':'Wix Blog RSS','posts':posts}}
code=(source/'runtime.js').read_text().replace('__GAZETTE_PAYLOAD__',json.dumps(payload,ensure_ascii=False).replace('</script','<\\/script'))
(out/'homepage.js').write_text(code)
(out/'manifest.json').write_text(json.dumps({'stories':len(posts),'sha256':hashlib.sha256(code.encode()).hexdigest(),'scope':'public homepage only','feed':'existing gazette-live/posts.json refresh','photo_source':'Wix Media Manager Chris Spears Auburn 2026 set','reference':'Jannah Sport layout; JNews publishing inventory; original implementation'},indent=2)+'\n')
# Static, isolated fixtures: the same compiled production script at phone and desktop widths.
(out/'qa.html').write_text('''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>GatorBait sports homepage QA</title></head><body><p>Same compiled renderer, isolated viewport fixtures.</p>'''+''.join('<iframe title="Viewport '+str(w)+'" width="'+str(w)+'" height="1600" src="frame.html"></iframe>' for w in [390,430,1440])+'</body></html>')
# Runtime deliberately activates only at home. Fixture exposes a home pathname through copied source guard.
(out/'frame.html').write_text('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script>'+code.replace("function home() { return (location.pathname.replace(/\\/+$/, '') || '/') === '/'; }","function home() { return true; }")+'</script></body></html>')
print(json.dumps({'stories':len(posts),'bytes':len(code),'newest':posts[0]['title']}))
