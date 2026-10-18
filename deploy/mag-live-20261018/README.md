# /magazine live swap, Oct. 18, 2026 (embed 1dd74333 rev 113 -> 114)

Brenden: "yes swap it live." One object: Magazine custom embed `1dd74333-ee02-40da-9c93-cf8fd787c129`, site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`. No site publish, no email, no automation changes, no other embed.

- Merged into `main`, in order, by squash: PR #356 (e5a553fa, Facebook reel cards), PR #358 (ff99574d, Sumrall card on YouTube), PR #359 (3fc54418, desktop scale-up). #358 and #359 needed a merge of main into their branches first (squash vs. stacked branch); the branch side was the exact resolution for #358, and #359 only conflicted on the built bundle, rebuilt from source. QA `qa-magazine-postgame.mjs` passed at 320/390/430/1366 (#358) and 320/390/430/1366/1920 (#359).
- Build at `3fc54418008a793dcca2b2e5e35132a961af0dce`: `MAG_VARIANT=postgame --check` current; `sports-live/magazine-postgame.js` 202,984 bytes (cap 204,800), sha256 `7c69502fb45275fe041bf70ea51107954bcc1cc9100d249d88eeaeff0665e61b`. jsDelivr at that sha served HTTP 200, 202,984 bytes, identical sha256; reel posters `sports-live/reels/*.jpg` HTTP 200.
- Loader: `make-loader.py 3fc54418...` -> `1dd74333-rev114.html`, 2,769 chars (cap 15,000), djb2 `2b24b761`. Differs from the rev-113 loader only in the sha.
- Guarded PATCH (one function): GET read rev 113, djb2 `58168e27`, html byte-equal to `rollback/1dd74333-rev113.html`, category ESSENTIAL, enabled, HEAD, loadOnce false. PATCH at revision 113 with name/enabled/loadOnce/position as read and category ESSENTIAL re-sent. Response rev 114, djb2 `2b24b761`; read-back byte-equal, pin present twice.
- Live verification: read-only Actions probe (`probe/looks-audit-20261018`, `probe-looks/run.js`) in Chrome at 390/430/1366/1920 with a cache-busting URL; results in `live-qc.json`, screenshots `shots/`.

## Rollback
Guarded PATCH of `embedData.html` back to `rollback/1dd74333-rev113.html` (2,769 chars, djb2 `58168e27`; PR #353 loader pinned to 563fe3bc) at the then-current revision, category ESSENTIAL re-sent, no publish. The step before that is `deploy/broadcast-network-20261017/rollback/1dd74333-rev110.html` (djb2 `1f67f870`).
