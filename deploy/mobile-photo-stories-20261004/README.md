# Mobile photography correction — October 4, 2026

Owner feedback after PR #137: "this is the boring version ... not enough photos ... a lot of titles on mobile." Direct instruction authorizes this follow-up.

Add each article's real image to all six upper supporting stories and the eight Latest rows. Phones use a two-column photo grid, readable 19px headlines and smaller bylines. Main and secondary photography uses 16:9 frames; mobile main excerpt is two lines and the secondary excerpt is omitted. Hide the duplicate masthead only when the existing mobile-shell host is present. Preserve the lead title before its image for the established cookie-panel visibility constraint. Source image URLs, image fallback, lazy loading, dimensions, actual bylines and canonical article links are retained. Existing cover art and portrait images fit without cropping. Top-card photo credits are preserved.

Loren remains the single pinned main feature; Buddy/Franz remain the upper package; Brenden remains lower. No article, writer category, subscription, email or Magazine changes.

Syntax, reproducible build and the existing deterministic current-feed render check pass. Public phone/desktop screenshots will verify photos, image loading and overflow after release.

Rollback: prior homepage release `a76e8cf343e5ac95c3353621d759b6e3b26a099a`, build `a9ec63bf`; repoint sports-live/current.json and the HOME_CODE timeout fallback using its fresh revision. Previous HOME_CODE revision39 is recorded in the earlier deployment notes. Release changes only its fallback SHA, retaining the central pointer and absence of obsolete pins.
