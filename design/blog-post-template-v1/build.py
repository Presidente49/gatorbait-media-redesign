#!/usr/bin/env python3
"""Build the GatorBait post template (prototype, not deployed).

post-template.src.css  --(expand scope, minify)-->  post-template.css   (cap 12,000 chars)
post-template.css + post-template.js          -->  post-template-embed.html (Wix cap 15,000 chars)
"""
import pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
SCOPE = 'html body #SITE_PAGES [data-hook=post-page]'   # (1,1,2) beats header embed 7fee4de6 (1,1,1)
SHORT = '#SITE_PAGES'  # post-only hooks (hero, stats, up next, related, figures) that no other embed styles
CSS_CAP, EMBED_CAP = 12000, 15000


def minify_css(s):
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'\s*([{};,>])\s*', r'\1', s)
    s = re.sub(r'\s*:\s*(?=[^{}]*[;}])', ':', s)   # only inside declarations
    s = s.replace(';}', '}')
    return s.strip()


def minify_js(s):
    out = []
    for line in s.splitlines():
        t = line.strip()
        if not t or t.startswith('//'):
            continue
        out.append(t)
    return '\n'.join(out)


src = (HERE / 'post-template.src.css').read_text()
css = minify_css(src.replace('§', SCOPE).replace('¤', SHORT))
assert '§' not in css and '¤' not in css and '</style' not in css.lower()
assert len(css) <= CSS_CAP, ('css', len(css))
(HERE / 'post-template.css').write_text(css + '\n')

js = minify_js((HERE / 'post-template.js').read_text())
assert '</script' not in js.lower()
embed = ('<!-- GBM_POST_TEMPLATE_V1 -->'
         '<style id="gbm-post-template">' + css + '</style>'
         '<script id="gbm-post-template-js">' + js + '</script>')
assert len(embed) <= EMBED_CAP, ('embed', len(embed))
(HERE / 'post-template-embed.html').write_text(embed)
print('css', len(css), 'js', len(js), 'embed', len(embed))
