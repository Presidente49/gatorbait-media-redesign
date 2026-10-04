"""Build deploy/post-template/proposed.html from live-before.html (embed 14a887e3, rev 11).

Every change is an exact, asserted text edit on the live CSS, plus a short block of new rules. The CSS is then
packed into a tiny inline script (the same technique the header embed 7fee4de6 uses) so the embed stays under
Wix's 15,000-character cap: ` = the post-page prefix, | = [data-hook=post-description], $ = !important.
The script expands it back and inserts the <style id="gbm-post-template"> where the old inline <style> sat.
`python deploy/post-template/build.py` rewrites proposed.html and prints the character count and fingerprints.
"""
import hashlib, json, pathlib, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
LIMIT = 15000
P = 'html body #SITE_PAGES [data-hook=post-page] '
D = '[data-hook=post-description]'


def djb2(t):
    h = 5381
    for ch in t:
        h = ((h * 33) ^ ord(ch)) & 0xFFFFFFFF
    return h


def fp(t):
    return {'chars': len(t), 'djb2': djb2(t), 'sha256_16': hashlib.sha256(t.encode()).hexdigest()[:16]}


before = (HERE / 'live-before.html').read_text()
OPEN, CLOSE = '<style id="gbm-post-template">', '</style>'
i, j = before.index(OPEN) + len(OPEN), before.index(CLOSE)
css, rest = before[i:j], before[j + len(CLOSE):]
assert before[:i - len(OPEN)] == '' and rest.startswith('<script id="gbm-post-template-js">'), 'unexpected live layout'


def edit(old, new):
    global css
    assert css.count(old) == 1, f'expected one match for: {old[:80]}'
    css = css.replace(old, new)


# 1. Kicker: a Magazine-style white-on-blue label, block level so it sits left above a left-aligned headline.
edit('content:var(--gbm-kicker,"Gators Football");display:inline-block;margin:0 0 12px;padding:0;background:transparent;color:var(--b);font:800 13px/1 var(--f)',
     'content:var(--gbm-kicker,"Gators Football");display:table;margin:0 0 14px;padding:6px 10px 5px;background:var(--b);color:#fff;font:800 12px/1 var(--f)')
# 2. Header closes on an orange rule, like the Magazine's section rules.
edit('background:#fff!important;border-top:0;border-bottom:1px solid #d5dbe6}', 'background:#fff!important;border-top:0;border-bottom:3px solid var(--o)}')
# 3. Headline: editorial Barlow, bolder and a size up; sentence/title case as written (no all-caps).
edit('font:700 36px/1.12 var(--f)!important;letter-spacing:-.02em!important;text-transform:none!important',
     'font:800 44px/1.06 var(--f)!important;letter-spacing:-.025em!important;text-transform:none!important')
edit('[data-hook=post-title]{font-size:28px!important;line-height:1.14!important;overflow-wrap:break-word}',
     '[data-hook=post-title]{font-size:clamp(28px,8vw,34px)!important;line-height:1.1!important;overflow-wrap:break-word}')
# 4. "By the numbers" boxes: light text must beat the post-wide embed's dark body color (a5452619, same specificity, later).
edit(P + '[data-gbm-stat] p{display:flow-root;', P + D + ' [data-gbm-stat] p{display:flow-root;')

# 5. Signup card (sports-live capture.js) on story pages: no mid-article card (Brenden, Oct. 2 and Oct. 4); the end card
#    is a compact blue strip with white text. Selectors carry one more class than the body-text rules, so post styles
#    can no longer turn its text dark on blue.
G = P + '.gbc'
css += ''.join([
    P + '[data-gbm-capture=story-inline]{display:none!important}',
    G + '{margin:20px 0!important;padding:14px 16px 12px!important;border-radius:0!important;border-top:4px solid var(--o)!important;background:var(--b)!important;box-shadow:none!important}',
    G + ' :is(.gbc-h,.gbc-c,.gbc-c span,.gbc-p,.gbc-m,a){color:#fff!important;-webkit-text-fill-color:#fff!important}',
    G + ' .gbc-h{margin:0 0 10px!important;padding:0!important;border:0!important;font:800 clamp(18px,5.6vw,22px)/1.15 var(--f)!important;letter-spacing:-.01em!important;text-transform:none!important}',
    G + ' :is(.gbc-k,.gbc-v){display:none!important}',
    G + ' :is(.gbc-c,.gbc-c span,.gbc-p,.gbc-m){margin:0!important;font:500 13px/1.35 var(--f)!important}',
    G + ' .gbc-p{margin-top:6px!important;opacity:.85}',
    G + ' .gbc-m:not(:empty){margin-top:8px!important;font-weight:700!important}',
    G + ' .gbc-row{flex-wrap:nowrap!important;gap:8px!important;margin:0 0 8px!important}',
    G + ' input[type=email]{min-width:0!important;height:44px!important;font-size:16px!important}',
    G + ' .gbc-b{min-height:44px!important;padding:0 14px!important;font-size:16px!important}',
])

for ch in '`|$':
    assert ch not in css, f'placeholder {ch!r} already in CSS'
packed = css.replace(P, '`').replace(D, '|').replace('!important', '$')
lit = json.dumps(packed)
loader = ('<script id="gbm-post-template-css">(function(d,c,s){if(d.getElementById("gbm-post-template"))return;'
          's=d.createElement("style");s.id="gbm-post-template";'
          's.textContent=' + lit + '.replace(/`/g,"' + P + '").replace(/\\|/g,"' + D + '").replace(/\\$/g,"!important");'
          'c&&c.parentNode?c.parentNode.insertBefore(s,c):d.head.appendChild(s)})(document,document.currentScript);</script>')
proposed = loader + rest

# The packed CSS must expand to exactly the edited CSS (checked in Node, the way a browser runs it).
check = subprocess.run(['node', '-e', 'const v=' + lit + '.replace(/`/g,' + json.dumps(P) + ').replace(/\\|/g,' + json.dumps(D) +
                        ').replace(/\\$/g,"!important");process.stdout.write(v)'], capture_output=True, text=True, check=True).stdout
assert check == css, 'packed CSS does not round-trip'
assert len(proposed) < LIMIT, f'{len(proposed)} chars, over the {LIMIT} cap'
(HERE / 'proposed.html').write_text(proposed)
(HERE / 'proposed.css').write_text(css)
print(json.dumps({'live_before': fp(before), 'proposed': fp(proposed), 'headroom': LIMIT - len(proposed)}, indent=1))
