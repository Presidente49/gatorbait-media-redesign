# /magazine phone PDF, embed 1dd74333 rev 118 -> 119 (Oct. 18-19, 2026)

Brenden: "Can you make the PDF mobile friendly please."

- New file: `print-stage/gatorbait-magazine-texas-postgame-2026-10-18-phone-v1.pdf`, 61 pages, 390 x 844 pt portrait, 2,556,951 bytes (2.4 MB), same words and numbers as print v3 (no new stats), one column, body 17 pt, nothing under 12 pt, full-bleed photos, Barlow (Barlow Condensed for display headlines), selectable text, 22 working links (contents page jumps, column links on gatorbaitmedia.com, YouTube, print version). Builder: `deploy/magazine-2026/postgame-texas/build-phone.mjs` + `render-phone.mjs`. Only presentation changes from print: internal "Wix post id" references dropped from the source notes; the line score and box score are stacked for a narrow screen.
- Wix Media Manager (Import File from the commit-pinned jsDelivr URL eee79d52, byte-identical read-back): `d3cfa5_1c595c67708e4a42bf6b8508a4a4b5a8.pdf`. The print PDF `d3cfa5_6fd61c786a0441b5a8dbead1182f2e1d.pdf` is untouched and linked as "Print version".
- Source change (bundle only, sticky bar code untouched): download button "Download for your phone (PDF)" -> phone file; secondary link "Print version (PDF)". `sports-live/magazine-postgame.js` 199,402 bytes (cap 204,800). `qa-magazine-postgame.mjs` passes at 320/390/430/1366/1920.
- Swap: guarded PATCH at rev 118 (djb2 d3811f4d, equal to `rollback/1dd74333-rev118.html`), ESSENTIAL re-sent, name/enabled/loadOnce/position as read, pin c3424ca6 -> 7cbf2271 (2 occurrences), 2,769 chars (cap 15,000), no site publish. Response rev 119, read-back byte-equal, djb2 1ba326cd.
- Live check (Chromium, cache-busting URL, 390/430/1366/1920): HTTP 200, new pin loaded, no horizontal overflow, button and print link present with the right hrefs and `download`, tap heights 60/72 and 46 px.

## Rollback
Guarded PATCH of `embedData.html` to `rollback/1dd74333-rev118.html` (pin c3424ca6, djb2 d3811f4d) at the then-current revision, category ESSENTIAL re-sent, no publish. The phone PDF can stay in the Media Manager unused.
