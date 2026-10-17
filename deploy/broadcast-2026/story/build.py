"""Build the Broadcast story-page candidate for embed a5452619 (Post wide canvas).

Takes the live rev saved in ../a5452619/rev<N>.html unchanged and appends one <style id="gbm-post-broadcast-v1">
built from broadcast-story.css. Nothing in the live HTML is edited, so the rollback is the saved rev file.
`python3 deploy/broadcast-2026/story/build.py` writes a5452619-broadcast.html and prints length and fingerprints.
"""
import pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
BASE_REV = 4
LIMIT = 15000
P = 'html:root body #SITE_PAGES [data-hook=post-page] '
D = '[data-hook=post-description]'


def djb2(t):
    # Lesson 99: h = ((h << 5) + h + code) | 0 per UTF-16 code unit; hex of h >>> 0.
    h = 5381
    for ch in t.encode('utf-16-le').decode('utf-16-le'):
        for unit in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h = ((h << 5) + h + unit) & 0xFFFFFFFF
    return format(h, 'x')


def js_len(t):
    return len(t.encode('utf-16-le')) // 2


src = (HERE / 'broadcast-story.css').read_text()
css = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
css = '\n'.join(l.strip() for l in css.splitlines() if l.strip())
for tok in '`|$\'\\':
    assert tok not in css, f'token {tok!r} already in css'
packed = css.replace('~', '`').replace('§', '|').replace('¡', '$').replace('\n', '')
full = packed.replace('`', P).replace('|', D).replace('$', '!important')
assert full.count('{') == full.count('}'), 'unbalanced braces'
(HERE / 'broadcast-story.expanded.css').write_text(full)
# Same technique as the post template (14a887e3) and header (7fee4de6): the inline script expands the tokens and
# inserts <style id="gbm-post-broadcast">. ` = the post-page prefix, | = the post body hook, $ = !important.
js = ('<script id="gbm-post-broadcast-v1">(function(d,s){if(d.getElementById("gbm-post-broadcast"))return;'
      's=d.createElement("style");s.id="gbm-post-broadcast";s.textContent=\'' + packed + '\''
      '.replace(/`/g,"' + P + '").replace(/\\|/g,"' + D + '").replace(/\\$/g,"!important");'
      '(d.head||d.documentElement).appendChild(s);'
      # Lead photo: tag the first body image only when it comes before any text paragraph.
      'function L(){var D=d.querySelector("[data-hook=post-page] [data-hook=post-description]");if(!D)return;'
      'var f=D.querySelector("[data-hook=figure-IMAGE]"),p=[].find.call(D.querySelectorAll("p"),function(x){return x.textContent.trim()});'
      'if(f&&!f.hasAttribute("data-gbm-lead")&&(!p||f.compareDocumentPosition(p)&4))f.setAttribute("data-gbm-lead","")}'
      # Wix re-renders the post body after hydration (Lesson 60), so a throttled observer re-tags it for 30 s after
      # each arm: DOMContentLoaded and every client-side navigation.
      'var m,q=0,o=0;function W(){if(m)m.disconnect();clearTimeout(o);L();'
      'm=new MutationObserver(function(){if(!q)q=setTimeout(function(){q=0;L()},150)});'
      'm.observe(d.getElementById("SITE_CONTAINER")||d.body,{childList:true,subtree:true});o=setTimeout(function(){m.disconnect()},3e4)}'
      'd.readyState=="loading"?d.addEventListener("DOMContentLoaded",W):W();addEventListener("load",L);'
      'addEventListener("popstate",function(){setTimeout(W,300)});addEventListener("gbmroutechange",function(){setTimeout(W,300)})})(document)</script>')
base = (HERE.parent / 'a5452619' / f'rev{BASE_REV}.html').read_text()
assert 'gbm-post-broadcast' not in base, 'base already carries the skin'
out = base + '\n' + js
css = full
n = js_len(out)
(HERE / 'a5452619-broadcast.html').write_text(out)
print(f'base rev{BASE_REV}: {js_len(base)} chars, djb2 {djb2(base)}')
print(f'candidate: {n} chars, djb2 {djb2(out)}, css {len(css)} chars')
if n >= LIMIT:
    sys.exit(f'over the {LIMIT}-character cap')
