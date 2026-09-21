#!/usr/bin/env python3
"""Build the GatorBait Media front page from real Wix Blog records.

Input : studio/data/front-page.json  (captured from Wix Blog v3)
Output: studio/landing.html          (self-contained, zero render-blocking JS)

Design rules enforced here:
  * every href is a real gatorbaitmedia.com URL
  * every <img> carries explicit width/height  -> no layout shift, no flash
  * covers are requested through the Wix image CDN at display size, not full size
  * nothing on the page is invented: headlines, decks, records and scores all
    trace to a published GatorBait post in front-page.json
"""

import json
import os
import re
from html import escape
from string import Template

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data", "front-page.json")
OUT = os.path.join(HERE, "landing.html")

AP_MONTHS = {
    1: "Jan.", 2: "Feb.", 3: "March", 4: "April", 5: "May", 6: "June",
    7: "July", 8: "Aug.", 9: "Sept.", 10: "Oct.", 11: "Nov.", 12: "Dec.",
}


def ap_date(iso):
    """AP style: Sept. 21 — abbreviate all months but March through July."""
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", iso)
    year, month, day = int(m.group(1)), int(m.group(2)), int(m.group(3))
    return "%s %d" % (AP_MONTHS[month], day), year


def cdn(url, w, h, q=78):
    """Ask the Wix image CDN for exactly the pixels we display."""
    if not url:
        return None
    if "~mv2." not in url:
        return url
    ext = url.rsplit("~mv2.", 1)[1].split("/")[0]
    return "%s/v1/fill/w_%d,h_%d,al_c,q_%d,enc_auto/file.%s" % (url, w, h, q, ext)


def img(post, w, h, *, eager=False, cls="thumb"):
    """Photo inside a designed frame.

    The frame carries the aspect ratio and a GatorBait-marked ground. On the
    live site the Wix photo covers it completely. Anywhere the photo cannot be
    fetched (a sandboxed preview, a slow connection, a dead asset) the frame
    still reads as a deliberate editorial block instead of a broken box, and
    because the frame is sized in CSS nothing on the page shifts either way.
    """
    src = cdn(post.get("cover"), w, h)
    mark = '<span class="frame__mark" aria-hidden="true">GatorBait</span>'
    if not src:
        return '<span class="frame %s">%s</span>' % (cls, mark)
    src2x = cdn(post.get("cover"), w * 2, h * 2, q=68)
    loading = ('fetchpriority="high" decoding="async"' if eager
               else 'loading="lazy" decoding="async"')
    return (
        '<span class="frame %s">%s'
        '<img src="%s" srcset="%s 1x, %s 2x" width="%d" height="%d" %s alt="">'
        '</span>' % (cls, mark, escape(src), escape(src), escape(src2x), w, h, loading)
    )


def kicker(post, cat_urls):
    label = post.get("kicker")
    if not label:
        return ""
    href = cat_urls.get(label)
    inner = escape(label)
    if href:
        return '<a class="kicker" href="%s">%s</a>' % (escape(href), inner)
    return '<span class="kicker">%s</span>' % inner


def meta(post):
    day, _ = ap_date(post["date"])
    bits = [day]
    if post.get("read"):
        bits.append("%d min read" % post["read"])
    return '<p class="meta">%s</p>' % escape(" · ".join(bits))


def newest_first(posts):
    """Order any module by publication date, newest first.

    GatorBait coverage tracks a game schedule, so a reader scanning any block
    is reading a timeline. Modules are therefore never hand-ordered — the
    selection above picks which stories appear, this decides the sequence.
    """
    return sorted(posts, key=lambda p: p["date"], reverse=True)


def main():
    with open(DATA) as fh:
        d = json.load(fh)

    by_id = {p["id"]: p for p in d["posts"]}
    cat_urls = d["categoryUrls"]
    st = d["status"]

    lead = by_id["baugh"]
    shoulder = [by_id["yellow-flags"], by_id["loren-postgame"]]
    strip = [by_id["sumrall-presser"], by_id["drought"], by_id["no-bad-wins"], by_id["sixteen-penalties"]]
    river = [by_id["hotty-toddy"], by_id["jimbo"], by_id["killing-fields"],
             by_id["gordon-solie"], by_id["golden"]]
    briefs = [by_id["blood-noise"], by_id["week3-preview"], by_id["urquhart"]]
    columns = [by_id["thoughts"], by_id["vb3"], by_id["readiness"], by_id["by-the-numbers"]]
    show = [by_id["best-friday"], by_id["rutledge-show"], by_id["trenches"]]
    magazine = [by_id["fourteen-days"], by_id["rutledge-feature"]]

    shoulder = newest_first(shoulder)
    strip = newest_first(strip)
    river = newest_first(river)
    briefs = newest_first(briefs)
    columns = newest_first(columns)
    show = newest_first(show)
    magazine = newest_first(magazine)

    # the lead must be the newest story on the page, not merely the newest in
    # its own block — verify rather than assume
    newest = newest_first(d["posts"])[0]
    assert lead["date"] >= newest["date"], (
        "lead %s is older than %s" % (lead["id"], newest["id"]))

    _, year = ap_date(lead["date"])
    today, _ = ap_date(d["captured"])

    def a(post, body):
        return '<a class="link" href="%s">%s</a>' % (escape(post["url"]), body)

    # ---- lead -------------------------------------------------------------
    lead_html = """
<article class="lead">
  <a class="lead__art" href="{url}">{art}</a>
  <div class="lead__text">
    {kick}
    <h2 class="lead__hed">{hed}</h2>
    <p class="deck">{deck}</p>
    {meta}
  </div>
</article>""".format(
        url=escape(lead["url"]),
        art=img(lead, 760, 428, eager=True, cls="lead__img"),
        kick=kicker(lead, cat_urls),
        hed=a(lead, escape(lead["title"])),
        deck=escape(lead["excerpt"]),
        meta=meta(lead),
    )

    shoulder_html = "".join(
        """
<article class="shoulder">
  {kick}
  <h3 class="shoulder__hed">{hed}</h3>
  <p class="deck deck--tight">{deck}</p>
  {meta}
</article>""".format(
            kick=kicker(p, cat_urls),
            hed=a(p, escape(p["title"])),
            deck=escape(p["excerpt"][:150].rstrip() + "…"),
            meta=meta(p),
        )
        for p in shoulder
    )

    strip_html = "".join(
        """
<article class="strip__item">
  <a class="strip__art" href="{url}">{art}</a>
  {kick}
  <h3 class="strip__hed">{hed}</h3>
  {meta}
</article>""".format(
            url=escape(p["url"]),
            art=img(p, 300, 169, cls="strip__img"),
            kick=kicker(p, cat_urls),
            hed=a(p, escape(p["title"])),
            meta=meta(p),
        )
        for p in strip
    )

    river_html = "".join(
        """
<article class="river__item">
  <a class="river__art" href="{url}">{art}</a>
  <div class="river__text">
    {kick}
    <h3 class="river__hed">{hed}</h3>
    <p class="deck deck--tight">{deck}</p>
    {meta}
  </div>
</article>""".format(
            url=escape(p["url"]),
            art=img(p, 220, 147, cls="river__img"),
            kick=kicker(p, cat_urls),
            hed=a(p, escape(p["title"])),
            deck=escape(p["excerpt"][:130].rstrip() + "…"),
            meta=meta(p),
        )
        for p in river
    )

    columns_html = "".join(
        """
<article class="byline">
  <p class="byline__who">{who}</p>
  <h3 class="byline__hed">{hed}</h3>
  {meta}
</article>""".format(
            who=escape(p["kicker"]),
            hed=a(p, escape(p["title"])),
            meta=meta(p),
        )
        for p in columns
    )

    briefs_html = "".join(
        """
<article class="brief">
  <p class="brief__who">{who}</p>
  <h3 class="brief__hed">{hed}</h3>
  {meta}
</article>""".format(
            who=escape(p["kicker"]),
            hed=a(p, escape(p["title"])),
            meta=meta(p),
        )
        for p in briefs
    )

    show_html = "".join(
        """
<article class="show__item">
  <a class="show__art" href="{url}">{art}<span class="show__play" aria-hidden="true"></span></a>
  <h3 class="show__hed">{hed}</h3>
  {meta}
</article>""".format(
            url=escape(p["url"]),
            art=img(p, 340, 191, cls="show__img"),
            hed=a(p, escape(p["title"])),
            meta=meta(p),
        )
        for p in show
    )

    mag_html = "".join(
        """
<article class="mag__item">
  <a class="mag__art" href="{url}">{art}</a>
  <h3 class="mag__hed">{hed}</h3>
  <p class="deck deck--tight">{deck}</p>
  {meta}
</article>""".format(
            url=escape(p["url"]),
            art=img(p, 400, 300, cls="mag__img"),
            hed=a(p, escape(p["title"])),
            deck=escape(p["excerpt"][:120].rstrip() + "…"),
            meta=meta(p),
        )
        for p in magazine
    )

    nav = [
        ("Football", cat_urls["Gator Football"]),
        ("Recruiting", cat_urls["Gator Recruiting"]),
        ("Basketball", cat_urls["Gator Basketball"]),
        ("Breaking", cat_urls["Gator Breaking News"]),
        ("Magazine", cat_urls["Gatorbait Magazine"]),
        ("The Buddy Martin Show", cat_urls["The Buddy Martin Show"]),
    ]
    nav_html = "".join(
        '<a class="nav__link" href="%s">%s</a>' % (escape(h), escape(t)) for t, h in nav
    )

    html = Template(PAGE).substitute(
        year=year,
        today=escape(today),
        record=escape(st["record"]),
        conference=escape(st["conference"]),
        last=escape(st["last"]),
        last_href=escape(st["lastHref"]),
        next=escape(st["next"]),
        next_href=escape(st["nextHref"]),
        nav=nav_html,
        lead=lead_html,
        shoulder=shoulder_html,
        briefs=briefs_html,
        strip=strip_html,
        river=river_html,
        columns=columns_html,
        show=show_html,
        magazine=mag_html,
        football=escape(cat_urls["Gator Football"]),
        magazine_url=escape(cat_urls["Gatorbait Magazine"]),
        show_url=escape(cat_urls["The Buddy Martin Show"]),
        roster=escape(d["rosterHref"]),
    )

    with open(OUT, "w") as fh:
        fh.write(html)
    print("wrote %s (%d bytes)" % (OUT, len(html)))


PAGE = r"""<title>GatorBait Media</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700&display=swap">
<style>
:root{
  --paper:#FBFAF8; --panel:#FFFFFF;
  --ink:#11141C; --ink-2:#3A4150; --muted:#6A7080;
  --rule:#E2DCD2; --rule-strong:#C9C1B3;
  --orange:#FA4616; --orange-ink:#D6380D;
  --navy:#0021A5; --show-bg:#061436; --on-dark:#F4F2EE; --on-dark-mute:#9FA9C2;
  --display:"Newsreader","Iowan Old Style",Georgia,"Times New Roman",serif;
  --cond:"Barlow Condensed","Oswald","Arial Narrow",Arial,sans-serif;
  --sans:"Barlow",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --paper:#0B0E14; --panel:#101621;
    --ink:#F2F0EB; --ink-2:#C6CBD6; --muted:#8E96A7;
    --rule:#232A38; --rule-strong:#394356;
    --orange:#FF6134; --orange-ink:#FF7A52;
    --navy:#5F82FF; --show-bg:#070C16; --on-dark:#F2F0EB; --on-dark-mute:#98A2BA;
  }
}
:root[data-theme="dark"]{
  --paper:#0B0E14; --panel:#101621;
  --ink:#F2F0EB; --ink-2:#C6CBD6; --muted:#8E96A7;
  --rule:#232A38; --rule-strong:#394356;
  --orange:#FF6134; --orange-ink:#FF7A52;
  --navy:#5F82FF; --show-bg:#070C16; --on-dark:#F2F0EB; --on-dark-mute:#98A2BA;
}

*{box-sizing:border-box}
body{
  margin:0; background:var(--paper); color:var(--ink);
  font-family:var(--sans); font-size:16px; line-height:1.5;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
}
img{display:block; max-width:100%; height:auto; background:var(--rule)}
a{color:inherit; text-decoration:none}
:focus-visible{outline:2px solid var(--orange); outline-offset:3px}
h1,h2,h3{margin:0; font-weight:600; text-wrap:balance}
p{margin:0}

.wrap{max-width:1240px; margin-inline:auto; padding-inline:20px}

/* ---------- status bar : real record, real result, real next game ------- */
.status{background:var(--show-bg); color:var(--on-dark)}
.status__in{
  display:flex; align-items:center; gap:0 26px; flex-wrap:wrap;
  padding-block:9px;
  font-family:var(--cond); font-size:14px; font-weight:600;
  text-transform:uppercase; letter-spacing:.09em;
}
.status__team{color:var(--on-dark)}
.status__rec{color:#FF7B4F; font-variant-numeric:tabular-nums}
.status__i{color:var(--on-dark-mute); display:flex; gap:7px}
.status__i b{font-weight:600; color:var(--on-dark)}
.status__sub{
  margin-left:auto; color:#0B0E14; background:var(--orange);
  padding:4px 13px 3px; letter-spacing:.11em;
}
.status__sub:hover{background:#fff}

/* ---------- masthead ---------------------------------------------------- */
.mast{border-bottom:1px solid var(--rule); background:var(--paper)}
.mast__in{
  display:flex; align-items:flex-end; justify-content:space-between;
  gap:20px; padding-block:22px 16px;
}
.mark{display:block; line-height:.82}
.mark__word{
  font-family:var(--cond); font-weight:700;
  font-size:clamp(34px,6.4vw,58px); letter-spacing:-.005em; text-transform:uppercase;
}
.mark__word i{font-style:normal; color:var(--orange)}
.mark__tag{
  display:block; margin-top:9px;
  font-family:var(--cond); font-weight:500; font-size:12px;
  text-transform:uppercase; letter-spacing:.2em; color:var(--muted);
}
.mast__date{
  font-family:var(--cond); font-size:13px; font-weight:500;
  text-transform:uppercase; letter-spacing:.14em; color:var(--muted);
  white-space:nowrap; padding-bottom:6px;
}

.nav{border-bottom:1px solid var(--rule); background:var(--paper)}
.nav__in{display:flex; gap:28px; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none}
.nav__in::-webkit-scrollbar{display:none}
.nav__link{
  flex:none; padding-block:12px; border-bottom:3px solid transparent;
  margin-bottom:-1px;
  font-family:var(--cond); font-weight:600; font-size:16px;
  text-transform:uppercase; letter-spacing:.07em; color:var(--ink-2);
  white-space:nowrap;
}
.nav__link:hover{color:var(--ink); border-bottom-color:var(--orange)}

/* ---------- shared editorial furniture ---------------------------------- */
.kicker{
  display:inline-block; margin-bottom:8px;
  font-family:var(--cond); font-weight:600; font-size:12.5px;
  text-transform:uppercase; letter-spacing:.14em; color:var(--orange-ink);
}
.deck{margin-top:11px; color:var(--ink-2); font-size:16.5px; line-height:1.45; max-width:62ch}
.deck--tight{margin-top:7px; font-size:15px; line-height:1.42}
.meta{
  margin-top:10px; font-family:var(--cond); font-size:12.5px; font-weight:500;
  text-transform:uppercase; letter-spacing:.11em; color:var(--muted);
}
.link:hover{color:var(--orange-ink)}
.frame{
  position:relative; display:block; overflow:hidden;
  background:
    repeating-linear-gradient(135deg, rgba(250,70,22,.11) 0 2px, transparent 2px 10px),
    linear-gradient(158deg, #10214C 0%, #06101F 72%);
}
.frame img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover}
.frame__mark{
  position:absolute; inset:0; display:grid; place-items:center;
  font-family:var(--cond); font-weight:700; font-size:12px;
  text-transform:uppercase; letter-spacing:.34em; color:rgba(255,255,255,.26);
}

.flag{
  display:flex; align-items:baseline; gap:14px;
  border-top:3px solid var(--ink); padding-top:9px; margin-bottom:20px;
}
.flag__t{
  font-family:var(--cond); font-weight:700; font-size:20px; line-height:1;
  text-transform:uppercase; letter-spacing:.07em;
}
.flag__more{
  margin-left:auto;
  font-family:var(--cond); font-weight:600; font-size:12.5px;
  text-transform:uppercase; letter-spacing:.13em; color:var(--orange-ink);
}
.flag__more:hover{text-decoration:underline; text-underline-offset:3px}

/* ---------- lead -------------------------------------------------------- */
.topgrid{
  display:grid; grid-template-columns:minmax(0,2.1fr) minmax(0,1fr);
  gap:0 32px; padding-block:26px 30px;
}
.topgrid__side{border-left:1px solid var(--rule); padding-left:32px}
.lead__img{width:100%; aspect-ratio:16/9}
.lead__text{padding-top:18px}
.lead__hed{
  font-family:var(--display); font-weight:600;
  font-size:clamp(31px,4.4vw,50px); line-height:1.03; letter-spacing:-.018em;
}
.shoulder{padding-block:18px}
.shoulder:first-child{padding-top:0}
.shoulder + .shoulder{border-top:1px solid var(--rule)}
.shoulder__hed{
  font-family:var(--display); font-weight:600;
  font-size:22px; line-height:1.14; letter-spacing:-.011em;
}

.briefs{margin-top:24px; border-top:3px solid var(--ink); padding-top:9px}
.briefs__flag{
  font-family:var(--cond); font-weight:700; font-size:16px; line-height:1;
  text-transform:uppercase; letter-spacing:.08em; margin-bottom:4px;
}
.brief{padding-block:13px; border-top:1px solid var(--rule)}
.brief:first-of-type{border-top:0}
.brief__who{
  font-family:var(--cond); font-weight:600; font-size:11.5px;
  text-transform:uppercase; letter-spacing:.16em; color:var(--orange-ink); margin-bottom:4px;
}
.brief__hed{font-family:var(--display); font-weight:500; font-size:17px; line-height:1.2; letter-spacing:-.006em}
.brief .meta{margin-top:6px; font-size:11.5px}

/* ---------- four-across strip ------------------------------------------- */
.strip{display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:26px}
.strip__img{width:100%; aspect-ratio:16/9; margin-bottom:12px}
.strip__hed{font-family:var(--display); font-weight:600; font-size:18px; line-height:1.18; letter-spacing:-.009em}
.sec{padding-block:30px}
.sec--rule{border-top:1px solid var(--rule)}

/* ---------- main body: river + rail ------------------------------------- */
.body{display:grid; grid-template-columns:minmax(0,1.85fr) minmax(0,1fr); gap:0 44px; padding-block:6px 34px}
.rail{border-left:1px solid var(--rule); padding-left:44px}
.river__item{
  display:grid; grid-template-columns:220px minmax(0,1fr); gap:20px;
  padding-block:22px; border-top:1px solid var(--rule);
}
.river__item:first-of-type{border-top:0; padding-top:0}
.river__img{width:220px; aspect-ratio:3/2}
.river__hed{font-family:var(--display); font-weight:600; font-size:23px; line-height:1.13; letter-spacing:-.012em}

.byline{padding-block:16px; border-top:1px solid var(--rule)}
.byline:first-of-type{border-top:0; padding-top:0}
.byline__who{
  font-family:var(--cond); font-weight:600; font-size:12px;
  text-transform:uppercase; letter-spacing:.16em; color:var(--orange-ink); margin-bottom:6px;
}
.byline__hed{font-family:var(--display); font-weight:500; font-size:19px; line-height:1.18; letter-spacing:-.008em}

/* ---------- the show ---------------------------------------------------- */
.show{background:var(--show-bg); color:var(--on-dark); padding-block:34px 38px; margin-top:8px}
.show .flag{border-top-color:var(--orange)}
.show .flag__t{color:var(--on-dark)}
.show .flag__more{color:#FF8A63}
.show__grid{display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:28px}
.show__art{display:block; position:relative}
.lead__art,.strip__art,.river__art,.mag__art{display:block}
.show__img{width:100%; aspect-ratio:16/9}
.show__play{
  position:absolute; left:14px; bottom:14px; width:38px; height:38px;
  background:var(--orange); display:grid; place-items:center;
}
.show__play::after{
  content:""; width:0; height:0; margin-left:3px;
  border-left:12px solid #0B0E14; border-block:7.5px solid transparent;
}
.show__hed{
  margin-top:13px; font-family:var(--display); font-weight:600;
  font-size:19px; line-height:1.17; color:var(--on-dark);
}
.show__hed .link:hover{color:#FF8A63}
.show .meta{color:var(--on-dark-mute)}

/* ---------- magazine ---------------------------------------------------- */
.mag__grid{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:34px}
.mag__img{width:100%; aspect-ratio:4/3; margin-bottom:14px}
.mag__hed{font-family:var(--display); font-weight:600; font-size:25px; line-height:1.12; letter-spacing:-.013em}

/* ---------- footer ------------------------------------------------------ */
.foot{border-top:3px solid var(--ink); margin-top:14px; padding-block:30px 44px}
.foot__grid{display:flex; flex-wrap:wrap; gap:34px 56px; align-items:flex-start}
.foot__col h4{
  margin:0 0 11px; font-family:var(--cond); font-weight:700; font-size:13px;
  text-transform:uppercase; letter-spacing:.15em; color:var(--ink);
}
.foot__col a, .foot__col p{
  display:block; font-size:14.5px; color:var(--muted); margin-bottom:7px; max-width:34ch;
}
.foot__col a:hover{color:var(--orange-ink)}
.foot__note{
  margin-top:32px; padding-top:18px; border-top:1px solid var(--rule);
  font-family:var(--cond); font-size:12.5px; text-transform:uppercase;
  letter-spacing:.12em; color:var(--muted);
}

/* ---------- responsive -------------------------------------------------- */
@media (max-width:960px){
  .topgrid{grid-template-columns:1fr; gap:0}
  .topgrid__side{border-left:0; border-top:1px solid var(--rule); padding-left:0; padding-top:20px; margin-top:22px}
  .body{grid-template-columns:1fr; gap:0}
  .rail{border-left:0; border-top:3px solid var(--ink); padding-left:0; padding-top:20px; margin-top:26px}
  .strip{grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px}
  .show__grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mag__grid{gap:24px}
}
@media (max-width:600px){
  .status__sub{margin-left:0}
  .mast__in{align-items:flex-start; flex-direction:column; gap:6px}
  .mast__date{padding-bottom:0}
  .river__item{grid-template-columns:112px minmax(0,1fr); gap:14px; padding-block:18px}
  .river__img{width:112px}
  .river__hed{font-size:18px}
  .river__item .deck{display:none}
  .strip{grid-template-columns:1fr; gap:0}
  .strip__item{display:grid; grid-template-columns:112px minmax(0,1fr); gap:14px; padding-block:18px; border-top:1px solid var(--rule)}
  .strip__item:first-child{border-top:0; padding-top:0}
  .strip__art{grid-row:span 3}
  .strip__img{width:112px; aspect-ratio:3/2; margin-bottom:0}
  .strip__hed{font-size:17px}
  .show__grid{grid-template-columns:1fr; gap:24px}
  .mag__grid{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms!important; transition-duration:.01ms!important}
}
</style>

<div class="status">
  <div class="wrap status__in">
    <span class="status__team">Florida</span>
    <span class="status__rec">${record} &middot; ${conference}</span>
    <a class="status__i" href="${last_href}"><b>Last</b> ${last}</a>
    <a class="status__i" href="${next_href}"><b>Next</b> ${next}</a>
    <a class="status__sub" href="https://www.gatorbaitmedia.com/pricing-plans/subscribe">Subscribe</a>
  </div>
</div>

<header class="mast">
  <div class="wrap mast__in">
    <a class="mark" href="https://www.gatorbaitmedia.com/">
      <span class="mark__word">Gator<i>Bait</i></span>
      <span class="mark__tag">Independent Florida Gators journalism</span>
    </a>
    <p class="mast__date">${today}, ${year}</p>
  </div>
</header>

<nav class="nav" aria-label="Sections">
  <div class="wrap nav__in">${nav}</div>
</nav>

<main>
  <div class="wrap">
    <section class="topgrid">
      <div class="topgrid__main">${lead}</div>
      <aside class="topgrid__side">${shoulder}
        <div class="briefs">
          <h2 class="briefs__flag">Also this week</h2>
          ${briefs}
        </div>
      </aside>
    </section>

    <section class="sec sec--rule">
      <div class="flag">
        <h2 class="flag__t">Florida 44, Auburn 39</h2>
        <a class="flag__more" href="${football}">All football</a>
      </div>
      <div class="strip">${strip}</div>
    </section>

    <section class="body">
      <div>
        <div class="flag">
          <h2 class="flag__t">The Latest</h2>
          <a class="flag__more" href="https://www.gatorbaitmedia.com/gatorbait-media-blogs">All coverage</a>
        </div>
        ${river}
      </div>
      <aside class="rail">
        <div class="flag">
          <h2 class="flag__t">Columnists</h2>
        </div>
        ${columns}
      </aside>
    </section>
  </div>

  <section class="show">
    <div class="wrap">
      <div class="flag">
        <h2 class="flag__t">The Buddy Martin Show</h2>
        <a class="flag__more" href="${show_url}">All episodes</a>
      </div>
      <div class="show__grid">${show}</div>
    </div>
  </section>

  <div class="wrap">
    <section class="sec">
      <div class="flag">
        <h2 class="flag__t">GatorBait Magazine</h2>
        <a class="flag__more" href="${magazine_url}">The archive</a>
      </div>
      <div class="mag__grid">${magazine}</div>
    </section>
  </div>
</main>

<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div class="foot__col">
        <h4>Coverage</h4>
        <a href="${football}">Gator Football</a>
        <a href="${magazine_url}">GatorBait Magazine</a>
        <a href="${show_url}">The Buddy Martin Show</a>
        <a href="${roster}">2026 roster &amp; schedule</a>
      </div>
      <div class="foot__col">
        <h4>Newsletter</h4>
        <p>GatorBait Weekly &mdash; Florida coverage from our staff, once a week.</p>
        <a href="https://www.gatorbaitmedia.com/pricing-plans/subscribe">Subscribe</a>
      </div>
      <div class="foot__col">
        <h4>Newsroom</h4>
        <p>Buddy Martin &middot; Franz Beard &middot; Loren Meadows &middot; Eddie Gilley &middot; Carlton Reese &middot; Kyle Curtis</p>
      </div>
      <div class="foot__col">
        <h4>Contact</h4>
        <a href="mailto:brenden@gatorbaitmedia.com">brenden@gatorbaitmedia.com</a>
      </div>
    </div>
    <p class="foot__note">&copy; ${year} GatorBait Media &middot; Gainesville, Florida &middot; Not affiliated with the University of Florida</p>
  </div>
</footer>
"""


if __name__ == "__main__":
    main()
