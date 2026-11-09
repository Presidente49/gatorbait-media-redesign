"""Build the portable review artifact from the maintained preview sources."""
from pathlib import Path
from base64 import b64encode
import re

root = Path(__file__).resolve().parents[2] / 'support'
html = (root / 'preview.html').read_text()
css = (root / 'support.css').read_text()
js = (root / 'support.js').read_text()

def data_url(name, mime):
    return 'data:' + mime + ';base64,' + b64encode((root / name).read_bytes()).decode()

for weight in (400, 700, 800):
    name = f'assets/barlow-{weight}.woff'
    css = css.replace(name, data_url(name, 'font/woff'))
html = re.sub(r'  <link rel="preload"[^>]+>\n', '', html)
html = html.replace('<link rel="stylesheet" href="support.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="support.js" defer></script>', '')
html = html.replace('assets/gatorbait-logo.webp', data_url('assets/gatorbait-logo.webp', 'image/webp'))
html = html.replace('</body>', '<script>\n' + js + '\n</script>\n</body>')
(root / 'standalone.html').write_text(html)
