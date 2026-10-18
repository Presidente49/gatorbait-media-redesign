# Texas postgame web edition, Oct. 18, 2026 (Florida 27, No. 7 Texas 24)

Brenden, Oct. 18: the Texas postgame issue becomes the live /magazine edition, with a download-only PDF button at the bottom. **Status: built and QA'd, not deployed.** No Wix write, publish, email or `current.json` change was made. Jarvis does the live swap.

## What is in the issue (`sports-live/magazine-issue-postgame.json`, ESPN event 401856724)

Cover Buddy Martin "A Texas Barbecue..." (post 6e802f31) with the UAA/Hannah White handoff photo; Final 27-24; In this issue; Franz Beard's two columns (Sunday column 68866a65, "exorcism" c16d53be), newest first; More postgame coverage: Loren Meadows (bba317f0), then the desk story (fc2ce412), newest first; By the numbers (yards bars and six tiles); Score by score (line score and all nine ESPN scoring plays); Box score (team stats and leaders for both teams); Game flow (ESPN win probability, 174 plays, Florida = 1 - home); In their words (three quotes, each checked against the published column); Watch (the two Oct. 18 reels as link cards, no Instagram script); Up next (Georgia, Oct. 31, 3:30 p.m. ET, ABC, Mercedes-Benz Stadium, neutral; no Georgia ranking or record anywhere); download band; footer with photo credits.
The blog feed on `main` (`gazette-live/posts.json`, 20 posts) holds exactly these five postgame Texas stories; no other postgame story exists. Jarvis re-checks the feed at swap time.

## Photo credits
UAA photos carry "Photo courtesy UAA and Hannah White" on the cover (linked: UAA to floridagators.com, Hannah White to instagram.com/hannahmorganphoto, plus floridagators.com/galleries), in each story row, in each image's alt text and in the footer block. Franz's Sunday-column thumbnail is a Chris Spears photo ("Photo by Chris Spears, GatorBait Media."). No GatorBait gallery of UAA photos. The "running" id in the brief (`d3cfa5_a0a5d806...`) returns 403 from Wix media and is not used.

## Download button
`<a class="pm-dl-btn" href="https://18fb3a4e-d7f6-414a-aeb9-3047db3ea115.usrfiles.com/ugd/d3cfa5_00220f84a15b4cdb8586595080e7b667.pdf" download="GatorBait-Magazine-Texas-Postgame.pdf">Download the full magazine (PDF)</a>` with "PDF, 16 pages, 2.4 MB". No print dialog, no `window.print`, no members PDF link (the `pdf` block is removed from the issue). The URL serves `content-type: application/octet-stream` (HTTP 200, 2,377,018 bytes), so browsers save it. If a browser opens it inline instead, appending `?dn=GatorBait-Magazine-Texas-Postgame.pdf` makes Wix add `Content-Disposition: attachment` (checked on the earlier PDF); not applied, to keep the exact URL.

## Loader (the thing Jarvis PATCHes)
`make-loader.py <40-hex merge sha>` writes the embed HTML to stdout and prints chars and the djb2 fingerprint to stderr. Base is `live-loader-before.html`, the rev-111 body of embed 1dd74333 (2,762 chars, djb2 31abecc5, from `deploy/broadcast-restore-20261018/rollback/1dd74333-rev111.html`, read from the provider Oct. 18 01:40Z). Only the pin, the bundle name and the marker comment change. Result: 2,769 chars (cap 15,000), well under the cap; fingerprint of the output depends on the sha (the zero-sha fixture `candidate-loader.html` is 2,769 chars, djb2 4d453dc1; never PATCH it).

1. Merge the PR; take the merge commit sha.
2. GET embed 1dd74333 (site 18fb3a4e-d7f6-414a-aeb9-3047db3ea115). Compare its `embedData.html` to `live-loader-before.html`: if the revision or djb2 (31abecc5) differs, save the live body as the new rollback and replace `live-loader-before.html` (and the `OLD` pin in `make-loader.py` if the pin differs).
3. `python3 deploy/magazine-2026/postgame-texas-web/make-loader.py <sha> > /tmp/loader.html`; record the stderr chars and djb2.
4. CDN check: `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@<sha>/sports-live/magazine-postgame.js` is HTTP 200 and its sha256 matches `sha256sum sports-live/magazine-postgame.js` on that commit.
5. Guarded in-place PATCH at the current revision: change only `embedData.html`, keep category ESSENTIAL, position, enabled, loadOnce; no site publish.
6. Verify live at 390 and 1366 (320 when relevant): `#gbm-magazine-page.pm[data-issue="2026-10-18-postgame-texas"]` once; h1 is the Buddy headline; download button href exact; UAA credit links present; 9 images load; no Georgia ranking.

Rollback: PATCH `embedData.html` back to `live-loader-before.html` (or the exact HTML saved in step 2) at the then-current revision.
