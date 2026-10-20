# Broadcast playlists — Oct. 20, 2026

Requested: separate Lowdown with Loren Meadows, Buddy Martin Show podcast and Shorts playlists, with a live-channel box on `/the-buddy-martin-show`.

## Candidate

- Runtime: `sports-live/broadcast-playlists.js`; existing native TV embed `82c4ca83-98df-4f35-9972-7345a2a71755`, baseline revision38.
- Keep the exact first native-page-hide stylesheet, replace the old TV runtime with a commit-pinned external loader. Enabled/BODY_END/loadOnce:false/ESSENTIAL retained. No Wix Editor publish.
- Three exact public playlist URLs independently returned200 with matching YouTube titles; see `playlist-primary-check.json` and linked Actions run. Public lookup consumed10 existing vidIQ credits; no purchases or channel/account changes.
- No invented live status, counts or episode dates. One click-loaded player, no autoplay, direct YouTube fallbacks. Bounded mount/route cleanup, no interval polling.
- Candidate Chromium at320/390/430/1366/1920: no document overflow, one root, zero page-load players, all four controls create one correctly addressed player, switch/close/focus/route cleanup checks pass; controls at least44px. Captures and machine receipts in `candidate/`. Candidate swaps only the claimed embed in a freshly fetched real public document before scripts execute.
- Visual review caught a global button background/font override; scoped poster styling restores readable navy/orange labels. Last direct-body header/shell anchor retained.

## Limits

Embedded audio/video playback cannot be confirmed in this container because YouTube is unreachable. URL existence, player construction and external fallbacks are verified separately; they do not prove playback. Physical iPhone behavior has not been tested. Existing Wix third-party runtime errors are recorded without attributing them to this change.

## Rollback

`rollback/embed-before.json` is the exact provider baseline, including revision38 HTML. Before any write, GET the current entity and compare its full fingerprint. Restore only its `embedData.html` using the newly read revision and re-send ESSENTIAL. Preserve enabled/position/loadOnce; no site publish. Stop if another owner has changed the entity.

Release revision, source pin and live evidence will be appended after deployment.
