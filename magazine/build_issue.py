#!/usr/bin/env python3
"""Render a sellable, self-contained GatorBait Magazine issue.

Input:  magazine/issues/<slug>/issue.json  (metadata + ordered post ids)
        magazine/build-cache/posts/<id>.json  (normalized Blog API content)
Output: magazine/issues/<slug>/issue.html  + a build report

Product rules enforced here, not left to the layout:
  * no outbound links anywhere - link decorations are stripped, words kept
  * whole articles, never excerpts
  * trailing "More From" lists and subscribe pitches removed
  * the page must read correctly with no network and no live site

Source quirks this has to survive, all observed in real posts:
  * some articles arrive with EVERY run marked bold (36/37 in the Ole Miss lead)
  * section headers are bold paragraphs, not HEADING nodes
  * photo credit, deck and byline arrive as ordinary leading paragraphs
"""
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "magazine" / "build-cache" / "posts"

CDN = "https://static.wixstatic.com/media/"
CREDIT_RE = re.compile(r"^\s*(uaa\s+photo|photo\b|photos\b|image\b|courtesy\b)", re.I)
BYLINE_RE = re.compile(r"^\s*by\s+\w", re.I)
SITE_RE = re.compile(r"^\s*gatorbait\s*media\s*\.?\s*com\s*$", re.I)
PROMO_RE = re.compile(r"(more from|subscribe to|keep independent gator journalism)", re.I)


def esc(text: str) -> str:
    return html.escape(text, quote=False)


def img_url(media_id: str, width: int, height: int, quality: int = 88) -> str:
    """Ask the Wix CDN for print-scale pixels rather than scaling a thumbnail up."""
    if "~mv2." not in media_id:
        return CDN + media_id
    ext = media_id.rsplit("~mv2.", 1)[1].split("/")[0]
    return "%s%s/v1/fill/w_%d,h_%d,al_c,q_%d,enc_auto/file.%s" % (
        CDN, media_id, width, height, quality, ext,
    )


def run_text(block: dict) -> str:
    return "".join(r.get("t", "") for r in block.get("runs", []))


def mostly_bold(blocks: list) -> bool:
    runs = [r for b in blocks if b["k"] != "img" for r in b.get("runs", [])]
    if len(runs) < 4:
        return False
    return sum(1 for r in runs if r.get("b")) >= len(runs) * 0.8


def render_runs(block: dict, ignore_bold: bool) -> str:
    out = []
    for run in block.get("runs", []):
        piece = esc(run.get("t", ""))
        # The link itself goes; the words stay. A citation reads as it would
        # in print, and the issue owes nothing to a live site.
        if run.get("i"):
            piece = "<em>%s</em>" % piece
        if run.get("b") and not ignore_bold:
            piece = "<strong>%s</strong>" % piece
        out.append(piece)
    return "".join(out).strip()


def looks_like_subhead(text: str) -> bool:
    stripped = text.strip()
    return 3 < len(stripped) <= 60 and not stripped.endswith((".", "!", "?", ":", "”", '"'))


def build_article(art: dict, report: list) -> str:
    blocks = list(art.get("blocks", []))
    ignore_bold = mostly_bold(blocks)

    hero = None
    byline = None
    credit = None
    notes = []

    # Hoist a leading image out of the body so it can run full measure.
    for i, b in enumerate(blocks[:2]):
        if b["k"] == "img":
            hero = blocks.pop(i)
            break
    if hero is None and art.get("cover"):
        cov = art["cover"]
        hero = {"k": "img", "id": cov["id"], "w": cov.get("w") or 1200, "h": cov.get("h") or 800}
        notes.append("hero taken from cover")

    # Pull byline / credit / site line out of the opening paragraphs.
    keep = []
    for b in blocks:
        text = run_text(b).strip()
        if b["k"] != "img" and len(keep) < 5:
            if BYLINE_RE.match(text) and len(text) < 60 and byline is None:
                byline = re.sub(r"^\s*[Bb]y\s+", "", text)
                continue
            if CREDIT_RE.match(text) and len(text) < 140 and credit is None:
                credit = text
                continue
            if SITE_RE.match(text) or not text:
                continue
        keep.append(b)

    # Drop the web furniture: everything from a promo subhead onward.
    cut = None
    for i, b in enumerate(keep):
        text = run_text(b).strip()
        if b["k"] != "img" and PROMO_RE.search(text) and (looks_like_subhead(text) or len(text) < 160):
            cut = i
            break
    if cut is not None:
        notes.append("dropped %d trailing promo block(s)" % (len(keep) - cut))
        keep = keep[:cut]

    parts = ['<article class="story">']
    parts.append('<header class="story-head">')
    parts.append('<p class="kicker">%s</p>' % esc(art.get("kicker") or "GatorBait Media"))
    parts.append("<h2>%s</h2>" % esc(art["title"].strip()))
    if byline:
        parts.append('<p class="byline">By %s</p>' % esc(byline))
    parts.append("</header>")

    if hero:
        parts.append('<figure class="hero">')
        parts.append(
            '<img src="%s" width="%d" height="%d" alt="%s">'
            % (img_url(hero["id"], 1400, max(1, round(1400 * (hero.get("h") or 2) / (hero.get("w") or 3)))),
               1400, max(1, round(1400 * (hero.get("h") or 2) / (hero.get("w") or 3))),
               esc((art.get("cover") or {}).get("alt") or ""))
        )
        if credit:
            parts.append("<figcaption>%s</figcaption>" % esc(credit))
        parts.append("</figure>")

    parts.append('<div class="story-body">')
    subheads = 0
    first_para = True
    for b in keep:
        if b["k"] == "img":
            h = max(1, round(900 * (b.get("h") or 2) / (b.get("w") or 3)))
            parts.append(
                '<figure class="inline"><img src="%s" width="900" height="%d" alt=""></figure>'
                % (img_url(b["id"], 900, h), h)
            )
            continue
        text = run_text(b).strip()
        if not text:
            continue
        if b["k"] == "q":
            parts.append('<blockquote>%s</blockquote>' % render_runs(b, ignore_bold))
            continue
        if b["k"] == "h" or (looks_like_subhead(text) and not first_para):
            subheads += 1
            parts.append("<h3>%s</h3>" % esc(text))
            continue
        cls = ' class="lede"' if first_para else ""
        parts.append("<p%s>%s</p>" % (cls, render_runs(b, ignore_bold)))
        first_para = False
    parts.append("</div></article>")

    report.append({
        "title": art["title"].strip(),
        "byline": byline,
        "credit": credit,
        "boldNeutralised": ignore_bold,
        "subheads": subheads,
        "words": len(re.sub(r"\s+", " ", " ".join(run_text(b) for b in keep if b["k"] != "img")).split()),
        "images": 1 if hero else 0,
        "notes": notes,
    })
    return "\n".join(parts)


def main(issue_dir: str) -> int:
    base = ROOT / issue_dir
    meta = json.loads((base / "issue.json").read_text(encoding="utf-8"))

    articles = []
    missing = []
    for pid in meta["posts"]:
        path = CACHE / ("%s.json" % pid)
        if not path.exists():
            missing.append(pid)
            continue
        articles.append(json.loads(path.read_text(encoding="utf-8")))
    if missing:
        print("::error::missing cached article(s): %s" % ", ".join(missing))
        return 1

    report: list = []
    bodies = [build_article(a, report) for a in articles]

    contents = "\n".join(
        '<li><span class="n">%d</span><span class="t">%s</span></li>' % (i + 1, esc(a["title"].strip()))
        for i, a in enumerate(articles)
    )
    cover_art = articles[0].get("cover") or {}
    cover_src = img_url(cover_art.get("id", ""), 1400, 1120) if cover_art.get("id") else ""

    css = (ROOT / "magazine" / "issue.css").read_text(encoding="utf-8")
    html_doc = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<meta name="robots" content="noindex">
<style>%(css)s</style>
</head><body>
<section class="cover">
  <p class="masthead">GatorBait <span>Magazine</span></p>
  <p class="issue-line">%(issue_line)s</p>
  %(cover_img)s
  <h1>%(cover_title)s</h1>
  <p class="cover-deck">%(deck)s</p>
  <nav class="contents"><p class="contents-title">In this issue</p><ol>%(contents)s</ol></nav>
  <p class="colophon">%(colophon)s</p>
</section>
%(bodies)s
<section class="endmark"><p>GatorBait Media &middot; Florida Gators reporting since 1979</p></section>
</body></html>
""" % {
        "title": esc(meta["title"]),
        "css": css,
        "issue_line": esc(meta["issueLine"]),
        "cover_img": ('<div class="cover-art"><img src="%s" width="1400" height="1120" alt=""></div>' % cover_src) if cover_src else "",
        "cover_title": esc(meta["coverTitle"]),
        "deck": esc(meta.get("coverDeck", "")),
        "contents": contents,
        "colophon": esc(meta.get("colophon", "")),
        "bodies": "\n".join(bodies),
    }

    out = base / "issue.html"
    out.write_text(html_doc, encoding="utf-8")
    (base / "build-report.json").write_text(json.dumps(report, indent=1), encoding="utf-8")

    total = sum(r["words"] for r in report)
    print("issue: %s" % meta["title"])
    print("wrote %s  (%d bytes)" % (out.relative_to(ROOT), out.stat().st_size))
    print("%d articles, %d words total\n" % (len(report), total))
    for r in report:
        print("  %-58s %5d words  byline=%-14s subheads=%d%s"
              % (r["title"][:58], r["words"], (r["byline"] or "-")[:14], r["subheads"],
                 ("  [" + "; ".join(r["notes"]) + "]") if r["notes"] else ""))
        if r["boldNeutralised"]:
            print("      note: source marked nearly every run bold; bold ignored for this story")
    if "<a " in html_doc or "href=" in html_doc:
        print("::error::issue contains a link - it must be self-contained")
        return 1
    print("\nno outbound links: confirmed")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "magazine/issues/2026-09-26-ole-miss"))
