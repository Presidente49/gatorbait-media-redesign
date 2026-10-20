"""Reproduce the reviewed inline TV artifact from its pinned human-readable source."""
import hashlib, subprocess, tempfile, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
SOURCE_COMMIT='fa039be6f297d29a1849b38e4a52fd6638b3980a'
SOURCE_SHA256='e10aa2bdfa85b1c9dce0cd361e3e9f30229a950c3c4ba1dc8e0e582376ff6b7c'
s=(ROOT/'sports-live/broadcast-playlists.js').read_text()
assert hashlib.sha256(s.encode()).hexdigest()==SOURCE_SHA256,'Source differs from reviewed pin'
a=s.index('var CSS=`')+len('var CSS=`');b=s.index('`;',a)
s=s[:a]+s[a:b].replace('\n','')+s[b:]
with tempfile.TemporaryDirectory() as tmp:
 p=Path(tmp);(p/'source.js').write_text(s)
 subprocess.run(['npx','--yes','--package=terser@5.44.0','terser',str(p/'source.js'),'--compress','--mangle','--output',str(p/'runtime.js')],check=True)
 code=(p/'runtime.js').read_text()
assert '</script' not in code.lower()
css='<style id="gbm-tv-native">html:has(#gbm-media-hub) :is(#SITE_CONTAINER,#SITE_PAGES,#SITE_FOOTER){display:none!important}</style>'
html=css+'<script data-gbm-source="'+SOURCE_COMMIT+'">'+code+'</script>'
assert len(html)<15000
out=Path(__file__).parent/'embed-after.html'
if '--check' in sys.argv:assert out.read_text()==html,'Compiled embed differs'
else:out.write_text(html)
print('PASS',len(html),'chars',hashlib.sha256(html.encode()).hexdigest())
