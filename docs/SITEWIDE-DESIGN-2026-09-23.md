# Sitewide design repair — September 23, 2026

Owner requested all connected pages to match the new sports homepage, urgently, after seeing broken Blog layout.

## Findings and repairs
- Native Wix Blog was configured as a photo-overlay Pro Gallery. Old custom feed styles painted a white overlay over the photos and constrained title containers. Replace the existing feed-style owner, not Blog data or pagination, with a responsive flow grid and readable full titles. Native categories, authors, article links and pagination remain in Wix.
- Inner pages used a different header, stale Store/Join/Account routes and an unreliable logo DOM replacement. The existing header owner now mounts one stable body-level header for inner routes. It uses the same logo, system fonts and navigation as the sports homepage. Existing mobile shell remains the only phone menu.
- Magazine root was inserted into a React-managed Wix parent and disappeared after hydration. Move its existing current content to a stable body-level mount. Hide native content only while the replacement root exists. Restyle as a separate magazine spread with Buddy lead and official masthead; correct the roster link to the published canonical URL.
- TV owner was disabled, leaving a native welcome heading and automatic live player. Replace that existing owner with a light on-demand TV/show hub. Load the player only on click, retain YouTube archive/live/clip links and add a podcasts/playlists section. No assertion of live status, schedule, independent podcast RSS feed or new shows.
- `/podcasts` currently redirects to `/the-buddy-martin-show`; navigation now points directly to the `#podcasts` section.
- Native membership prices, trials and checkout controls are preserved while headings, cards and buttons adopt the shared styling. Contact form retains its native submit handler with a readable Send message label.
- Legacy loader's fetch interception excludes magazine stories from native Blog lists. Remove that interception; native public lists should reflect Wix's own content/access rules, not a stale hardcoded exclusion list. No paid access or publication changes.

## Owners
- Header `7fee4de6-1886-475e-a3f3-b9c68161c242`: original14 →16 shared shell, contact/membership styles.
- Blog `602fb362-3917-4e42-9128-57af3a504ef3`: original8 →11 final feed styling.
- Magazine `1dd74333-ee02-40da-9c93-cf8fd787c129`: original21 →22 stable mount + magazine design.
- TV `82c4ca83-98df-4f35-9972-7345a2a71755`: original14 disabled →15 enabled with new bounded media hub.
- Homepage/mobile loader `fdc2127a-845a-4d02-b711-438f1a4a86ce`: original60 →61 route alignment and public-list filter removal.

## Sources and rollback
`automation/site-design/` contains the replacement CSS, header logic and TV HTML. `deploy/sitewide-design/` contains exact full embed HTML and original snapshots with revision/state map. Use the original enabled state when rolling back TV. Read current revisions before every mutation; never PATCH an old revision number.

## Verification
Live browser checks: Blog photos loaded at proportional dimensions and headlines are no longer clipped; Buddy category navigation succeeds; no desktop overflow. Magazine remains mounted directly under BODY after other checks and no longer disappears. TV player button creates the expected YouTube episode iframe; page has no overflow or footer gap. Shared header links use canonical destinations. Native membership and contact forms remain native and were not submitted. Policies content remained intact. This is not physical-iPhone testing, a completed forum, a verified paywall or proof of ad revenue.

## Remaining scope
Message board backend and premium access assignment are separate unfinished work. No new Google script, email campaign, payment change, theme purchase or infrastructure spend was added.
