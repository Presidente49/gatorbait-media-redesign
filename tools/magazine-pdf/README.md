# Magazine print edition (PDF)

Builds the standalone GatorBait Magazine PDF from the same issue JSON the live `/magazine` loader renders,
with every article in full instead of excerpts.

```
# 1. full article bodies from the live, server-rendered post pages (public pages, no API, no secrets)
python3 -I tools/magazine-pdf/extract-posts.py sports-live/magazine-issue-pregame.json /tmp/posts.json
# 2. one self-contained print HTML (US Letter, Barlow via Google Fonts, Wix media by id)
node tools/magazine-pdf/build-print.mjs sports-live/magazine-issue-pregame.json /tmp/posts.json /tmp/print.html
# 3. Chromium render: waits for fonts and for every image to decode, fails on any broken image
PLAYWRIGHT_PKG=$(npm root -g)/playwright node tools/magazine-pdf/render-pdf.mjs /tmp/print.html /tmp/magazine.pdf
```

Print rules worth keeping: page 1 is a full-bleed navy plate (the white masthead keeps its contrast because
`print-color-adjust: exact` is on), the briefing page is sized to fit one sheet, features start on a new
page, news cards flow, figures never split, and nothing carries a trailing page break, so there is no
blank last page. The renderer exits non-zero if any `<img>` fails to decode.

Behind an egress proxy, `HTTPS_PROXY` is passed to Chromium automatically.
