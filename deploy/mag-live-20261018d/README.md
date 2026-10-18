# /magazine live swaps, Oct. 18, 2026 (embed 1dd74333 rev 115 -> 116 -> 117): final PDF, portrait cover, sticky fix, YouTube watch line

Brenden: "I didn't look, just make sure [the download PDF] is the newest one," and "Approve all." One object: Magazine custom embed `1dd74333-ee02-40da-9c93-cf8fd787c129`, site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`. No site publish, no email, no automation change, no other object.

- New PDF: 21 pages, 2,318,111 bytes, Barlow only, no "No. 1 Georgia", "Jacksonville" or "Instagram" text. Source: `deploy/magazine-2026/postgame-texas/` (content.mjs, articles2.mjs, build-print.mjs), file `print-stage/gatorbait-magazine-texas-postgame-2026-10-18-print-v3.pdf` (commit 711fc204). Imported to Wix Media Manager from the pinned raw GitHub URL (same method as the old file): `d3cfa5_6fd61c786a0441b5a8dbead1182f2e1d.pdf`, READY, bytes equal to the repo file. Two earlier uploads exist and are unused: `d3cfa5_5636c273...` (v3, READY, was live as rev 116) and `d3cfa5_8ad5a3ba...` (FAILED, source commit was not yet pushed). The old `d3cfa5_00220f84...` is untouched.
- Merged by squash: #365 (portrait cover, b0567053), #366 (download url/note, 7ae0e532), #368 (sticky reader bar CSS, rebased #354/#367, 814353c9; #354 and #367 closed as superseded), #373 (YouTube watch line + final PDF url, 5dfd57f3).
- Build at 5dfd57f3: `MAG_VARIANT=postgame --check` current; `sports-live/magazine-postgame.js` 204,777 bytes (cap 204,800); jsDelivr sha256 identical. `qa-magazine-postgame.mjs` passed at 320/390/430/1366/1920.
- rev 115 -> 116 (pin 814353c9, djb2 27d9ed0d) and 116 -> 117 (pin 5dfd57f3, djb2 c01d8e97): each a guarded in-place PATCH at the revision just read, category ESSENTIAL re-sent, name/enabled/loadOnce/position as read, response echoes the new pin.

## Rollback
Guarded PATCH of `embedData.html` to `rollback/1dd74333-rev116.html` (pin 814353c9, djb2 27d9ed0d) or `rollback/1dd74333-rev115.html` (pin 939ef9d2, djb2 cfb01423; before the cover, PDF and sticky changes), at the then-current revision, category ESSENTIAL re-sent, no publish.

## Open
The sticky-bar fix needs a real-iPhone check by Brenden. The Wix media host serves PDFs as `application/octet-stream` (the old PDF does the same), so the "application/pdf" header check cannot pass; the file starts with `%PDF-` and downloads with the `download` attribute.
