# Mobile photography correction — October 4, 2026

Owner feedback after PR #137: "this is the boring version ... not enough photos ... a lot of titles on mobile." Direct instruction authorizes this follow-up.

Add each article's real image to all six upper supporting stories and the eight Latest rows. Phones use a two-column photo grid, readable 19px headlines and smaller bylines. Main and secondary photography uses 16:9 frames; mobile main excerpt is two lines and the secondary excerpt is omitted. Hide the duplicate masthead only when the existing mobile-shell host is present. Preserve the lead title before its image for the established cookie-panel visibility constraint. Source image URLs, image fallback, lazy loading, dimensions, actual bylines and canonical article links are retained. Existing cover art and portrait images fit without cropping. Top-card photo credits are preserved.

Loren remains the single pinned main feature; Buddy/Franz remain the upper package; Brenden remains lower. No article, writer category, subscription, email or Magazine changes.

Syntax, reproducible build and the existing deterministic current-feed render check pass. Public phone/desktop screenshots will verify photos, image loading and overflow after release.

Rollback: prior homepage release `a76e8cf343e5ac95c3353621d759b6e3b26a099a`, build `a9ec63bf`; repoint sports-live/current.json and the HOME_CODE timeout fallback using its fresh revision. Previous HOME_CODE revision39 is recorded in the earlier deployment notes. Release changes only its fallback SHA, retaining the central pointer and absence of obsolete pins.

## Release verified

PR #138 merged: `4971ff53e55c66527541697350410c69656e04b4`. Pointer commit `6445c9e2408f13fe69f390485ae9868a825a5682`. HOME_CODE revision40 enabled. Build `a8afbb94` is confirmed on the ordinary unversioned homepage. Live DOM confirms 6 upper story photos and 8 Latest photos; all six upper photos loaded successfully; Loren remains the lead.

Production screenshot workflow run `37245117875` completed successfully. At 320, 390, 430 and 1366 pixels: HTTP200, correct build, no page errors and no horizontal overflow. Visually inspected 390px top and supporting grid: photos rendered, photo cards readable, redundant masthead removed and source article links intact. Full phone capture and grid evidence are saved alongside `live-metrics.json`. Existing live styles make the first/last supporting cards full-width around the two-column middle cards.
