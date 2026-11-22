#!/usr/bin/env python3
"""Build the Wix custom embed for the story front. Usage: build.py <40-char commit sha>
The embed holds the small script inline and a stylesheet link to sports-live/story-front.css on jsDelivr at that commit."""
import re, sys, pathlib
here = pathlib.Path(__file__).parent
sha = sys.argv[1] if len(sys.argv) > 1 else ''
if not re.fullmatch(r'[0-9a-f]{40}', sha):
    sys.exit('usage: build.py <40-char commit sha>')
js = (here / 'story-front.inline.js').read_text()
js = re.sub(r'/\*.*?\*/\n?', '', js, flags=re.S).strip()          # drop comments
js = '\n'.join(line.strip() for line in js.splitlines() if line.strip())
css = 'https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@' + sha + '/sports-live/story-front.css'
html = ('<!-- GBM_STORY_FRONT_V1: magazine-style front on story pages (guide strip, label, headline, deck, byline with '
        'AP-style date and reading time, share, cover photo, caption) and the email signup first at the story end. '
        'Styles: sports-live/story-front.css at the pinned commit. Rollback: disable this embed. -->\n'
        '<link id="gbm-sf-css" rel="stylesheet" href="' + css + '">\n'
        '<script id="gbm-sf-boot">' + js + '</script>')
assert len(html) <= 15000, len(html)
(here / 'embed.html').write_text(html + '\n')
print('embed.html', len(html), 'chars')
