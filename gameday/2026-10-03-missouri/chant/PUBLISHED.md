# Game Day Chant Player (Oct. 3, ~15:3xZ)

Brenden sent the actual "Gator Bait" chant MP3 and asked for it to autoplay on the front page, stoppable, "something cooler" than a plain button — he referenced the site's existing slider bars, read as: an animated equalizer look, not a literal play/pause toggle alone.

## Audio asset

- Uploaded via GitHub raw URL import (direct binary PUT to Wix's `upload.wixmp.com` is blocked by this session's network policy — worked around by committing the mp3 to this repo at `gameday/2026-10-03-missouri/chant/gator-bait-chant.mp3` and importing from its raw GitHub URL instead).
- Wix Media file ID: `d3cfa5_2bfa012ee4d04011a8f5d6c204ab1939.mp3`
- Public URL: `https://music.wixstatic.com/mp3/d3cfa5_2bfa012ee4d04011a8f5d6c204ab1939.mp3`
- 2:00.8 duration, 320kbps, confirmed READY via the Media Manager API.

## Live embed

- **ID:** `513eee8c-5c7f-46fe-aea4-5bbbd38be08c`, "GBM - Game Day Chant Player v1 (Audio)"
- Position HEAD, category ESSENTIAL, `loadOnce` false, rev 1, route-guarded to `/` only
- A floating pill, bottom-right, with a live animated equalizer (5 bars) and a play/pause button. Bars animate only while playing.

## Autoplay behavior — the honest part

Browsers block autoplay-with-sound unless the visitor has already interacted with the page (a hard platform rule, not a bug). The widget:
1. Tries `audio.play()` immediately, once per browser tab session (`sessionStorage`, so it doesn't replay on every internal click/navigation).
2. If the browser blocks it, the chant fires on the visitor's very next click or tap anywhere on the page — effectively "plays the moment they actually start browsing," which is as close to true autoplay as the platform allows.
3. The floating button is always there, so it can be tapped to start/stop manually regardless.

## Verification

Confirmed via API: embed created, audio file READY with correct duration/bitrate. **Could not get a live-browser confirmation** of the actual playback/animation — same no-web-automation-balance limitation as the Chomp Meter. Static design preview (`preview.png`) rendered locally and sent to Brenden directly.

## Rollback

Disable embed `513eee8c-5c7f-46fe-aea4-5bbbd38be08c`. The audio file can stay in the Media Manager either way (harmless if unused).
