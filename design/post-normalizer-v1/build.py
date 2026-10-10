#!/usr/bin/env python3
"""Build the post formatting normalizer embed (Wix cap 15,000)."""
import pathlib, re
HERE = pathlib.Path(__file__).resolve().parent
SCOPE = 'html body #SITE_PAGES [data-hook=post-page] [data-hook=post-description]'
def mincss(s):
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S); s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'\s*([{};,>])\s*', r'\1', s); s = re.sub(r'\s*:\s*(?=[^{}]*[;}])', ':', s)
    return s.replace(';}', '}').strip()
def minjs(s):
    return '\n'.join(l.strip() for l in s.splitlines() if l.strip() and not l.strip().startswith('//'))
css = mincss((HERE / 'normalizer.src.css').read_text().replace('§', SCOPE))
js = minjs((HERE / 'normalizer.js').read_text())
embed = '<!-- GBM_POST_NORMALIZER_V1 --><style id="gbm-post-norm">' + css + '</style><script id="gbm-post-norm-js">' + js + '</script>'
assert len(embed) <= 15000 and '</script' not in js.lower()
(HERE / 'normalizer-embed.html').write_text(embed)
f = 0
for ch in embed: f = (f * 31 + ord(ch)) & 0xffffffff
print('embed', len(embed), 'fp', f)
