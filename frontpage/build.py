#!/usr/bin/env python3
"""Build the GatorBait front page.

Owner direction (issue #3): Buddy Martin leads everything, no redundancy, one
canonical URL per story, remaining lists newest-first.

Design consequence: today's Buddy column carries a 314x176 image while the
Chris Spears game photograph beside it is 3000x1641. So the lead is set in
type, not photography, and the photograph anchors the section beneath it. A
columnist lead should sell the writing.
"""
import json, os, re
from html import escape

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = "https://www.gatorbaitmedia.com"

AP = {1:"Jan.",2:"Feb.",3:"March",4:"April",5:"May",6:"June",
      7:"July",8:"Aug.",9:"Sept.",10:"Oct.",11:"Nov.",12:"Dec."}

def ap(iso):
    y,m,d = int(iso[0:4]), int(iso[5:7]), int(iso[8:10])
    return "%s %d" % (AP[m], d)

def cdn(url, w, h, q=80):
    """Ask Wix for exactly the pixels we display."""
    if not url or "~mv2." not in url:
        return url
    ext = url.rsplit("~mv2.",1)[1].split("/")[0]
    return "%s/v1/fill/w_%d,h_%d,al_c,q_%d,enc_auto/file.%s" % (url,w,h,q,ext)

def art(p, w, h, eager=False, cls=""):
    src = cdn(p["img"], w, h)
    if not src:
        return '<span class="ph %s"></span>' % cls
    load = ('fetchpriority="high" decoding="async"' if eager
            else 'loading="lazy" decoding="async"')
    return ('<span class="frame %s"><img src="%s" srcset="%s 2x" width="%d" '
            'height="%d" %s alt=""></span>'
            % (cls, escape(src), escape(cdn(p["img"], w*2, h*2, 65)), w, h, load))

def kicker(p):
    for c in p["c"]:
        if c.startswith("Buddy"): return "Buddy Martin"
        if c.endswith("- Blog") or c.endswith("- Blogs"):
            return c.replace(" - Blog","").replace(" - Blogs","")
    for c in p["c"]:
        if c not in ("Featured Article",): return c
    return "GatorBait"

def meta(p):
    bits = [ap(p["d"])]
    if p.get("r"): bits.append("%d min read" % p["r"])
    return '<p class="meta">%s</p>' % escape(" · ".join(bits))

def href(p):
    return escape("%s/post/%s" % (SITE, p["u"]))

def main():
    posts = json.load(open(os.path.join(HERE, "posts.json")))
    by = {p["u"]: p for p in posts}

    lead   = by["sumrall-cussing-wife-wants-him-to-stop-buddy-martin"]
    anchor = by["buster-faulkner-s-offense-is-anything-but-predictable"]
    second = by["jon-sumrall-stayed-home-so-did-his-star-running-back-it-was-a-brilliant-choice"]
    show   = by["live-now-florida-vs-ole-miss-preview-on-gator-lowdown"]

    used = {lead["u"], anchor["u"], second["u"], show["u"]}
    river = [p for p in posts if p["u"] not in used][:6]

    T = open(os.path.join(HERE, "template.html")).read()
    html = (T
        .replace("{{DATE}}", "%s, 2026" % ap(posts[0]["d"]))
        .replace("{{LEAD_HREF}}", href(lead))
        .replace("{{LEAD_HED}}", escape(lead["t"].strip()))
        .replace("{{LEAD_DECK}}", escape(lead["x"]))
        .replace("{{LEAD_META}}", meta(lead))
        .replace("{{SECOND_HREF}}", href(second))
        .replace("{{SECOND_HED}}", escape(second["t"].strip()))
        .replace("{{SECOND_META}}", meta(second))
        .replace("{{ANCHOR_HREF}}", href(anchor))
        .replace("{{ANCHOR_ART}}", art(anchor, 760, 428, eager=True, cls="anchor__img"))
        .replace("{{ANCHOR_HED}}", escape(anchor["t"].strip()))
        .replace("{{ANCHOR_DECK}}", escape(anchor["x"][:130].rstrip()+"…"))
        .replace("{{ANCHOR_META}}", meta(anchor))
        .replace("{{SHOW_HREF}}", href(show))
        .replace("{{SHOW_HED}}", escape(show["t"].strip()))
        .replace("{{RIVER}}", "".join(
            '<article class="riv"><a class="riv__a" href="%s">%s</a>'
            '<div class="riv__t"><span class="kick">%s</span>'
            '<h3 class="riv__h"><a class="lk" href="%s">%s</a></h3>%s</div></article>'
            % (href(p), art(p, 200, 134, cls="riv__img"), escape(kicker(p)),
               href(p), escape(p["t"].strip()), meta(p))
            for p in river)))

    out = os.path.join(os.path.dirname(HERE), "flagship", "front-page", "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w").write(html)
    print("wrote %s (%d bytes, %d stories)" % (out, len(html), 4 + len(river)))

if __name__ == "__main__":
    main()
