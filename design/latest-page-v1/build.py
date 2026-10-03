#!/usr/bin/env python3
"""Build the GatorBait Latest page embed: latest.src.css + latest.js -> latest-embed.html (Wix cap 15,000)."""
import pathlib, re
HERE = pathlib.Path(__file__).resolve().parent
def mincss(s):
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S); s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'\s*([{};,>])\s*', r'\1', s); s = re.sub(r'\s*:\s*(?=[^{}]*[;}])', ':', s)
    return s.replace(';}', '}').strip()
def minjs(s):
    return '\n'.join(l.strip() for l in s.splitlines() if l.strip() and not l.strip().startswith('//'))
css = mincss((HERE / 'latest.src.css').read_text()); js = minjs((HERE / 'latest.js').read_text())
assert '</style' not in css.lower() and '</script' not in js.lower()
embed = '<!-- GBM_LATEST_PAGE_V1 --><style id="gbm-latest-page">' + css + '</style><script id="gbm-latest-page-js">' + js + '</script>'
assert len(embed) <= 15000, len(embed)
(HERE / 'latest-embed.html').write_text(embed)
f = 0
for ch in embed: f = (f * 31 + ord(ch)) & 0xffffffff
print('css', len(css), 'js', len(js), 'embed', len(embed), 'fp', f)
