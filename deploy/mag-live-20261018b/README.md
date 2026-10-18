# /magazine live swap, Oct. 18, 2026 (embed 1dd74333 rev 114 -> 115): Baugh reel card on YouTube

Brenden: "Yes live" for PR #361. One object: Magazine custom embed `1dd74333-ee02-40da-9c93-cf8fd787c129`, site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`. No site publish, no email, no automation changes, no other embed.

- PR #361 squash-merged to `main` at `939ef9d282541cb132dba5d2f7b9606d59ae5385` (render-qc green).
- Build at that sha: `MAG_VARIANT=postgame --check` current; `sports-live/magazine-postgame.js` 202,978 bytes (cap 204,800), sha256 `2ca4c36bcc9318df2cc307c4ce2df26f01684feb6ae4ca21c7a03e3854f4de7c`. jsDelivr at the sha: HTTP 200, 202,978 bytes, identical sha256. Poster `sports-live/reels/baugh-yt-y4gpdy2bzdu.jpg` HTTP 200, 59,707 bytes, sha256 `62b5b336...3481` = repo file.
- Loader `make-loader.py 939ef9d2...` -> `1dd74333-rev115.html`, 2,769 chars, djb2 `cfb01423`. Differs from rev 114 only in the sha.
- Guarded PATCH (one function): GET rev 114, djb2 `2b24b761`, 2,769 chars (= `rollback/1dd74333-rev114.html`), enabled, HEAD, loadOnce false; PATCH at revision 114 with name/enabled/loadOnce/position as read and category ESSENTIAL re-sent. Response rev 115; read-back byte-equal to the candidate, djb2 `cfb01423`, new pin present twice.
- Live verification, read-only Actions probe (`probe/looks-audit-20261018`, commit 880ae15, run 39163869063, cache-busting URL): LIVE QC PASSED at 390/430/1366/1920. HTTP 200, served HTML carries the 939ef9d2 pin and marker; one `#gbm-magazine-page.pm[data-issue="2026-10-18-postgame-texas"]`; two `.pm-reel` cards, both Watch on YouTube, posters loaded, 9:16; no Facebook/YouTube request before tap; tapping each injects exactly `youtube-nocookie.com/embed/JexQFsm_wts` and `.../y4GpdY2bzdU` (`?autoplay=1&rel=0&playsinline=1`), zero shift; overflow 0; `.pm-in` 1360 px at 1366 and 1520 px at 1920; 8 images, none broken; download button exact; no Georgia ranking. Residual console `wixTagManager is not defined` is Wix's own. An earlier run (39163643922) passed 430/1366/1920 and got a transient Wix HTTP 503 at 390; the rerun passed all four.

## Rollback
Guarded PATCH of `embedData.html` back to `rollback/1dd74333-rev114.html` (2,769 chars, djb2 `2b24b761`, pin 3fc54418) at the then-current revision, category ESSENTIAL re-sent, no publish. Before that: `deploy/mag-live-20261018/rollback/1dd74333-rev113.html` (PR #360).
