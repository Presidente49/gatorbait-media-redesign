# GatorBait revenue journey — Oct. 15, 2026

Two scoped production repairs are deployed: the pricing presentation hides its exact unfinished native placeholder, and GatorBait TV opens tonight's verified Philo/Jones broadcast in a click-to-play YouTube player with six current broadcasts. The mobile magazine prototype and revenue model are review artifacts.

## Live repairs

- Pricing embed `78528a4b-6bf4-4642-9a76-5c05226a270f`: revision 4 → 5. The exact Editor component `comp-musf2gox` is hidden only while its normalized content equals the original placeholder. Both native trial buttons and billing notes remain. Delete the native placeholder in the Editor during an independently authorized Editor release; this scoped presentation fix does not remove native source text.
- TV embed `82c4ca83-98df-4f35-9972-7345a2a71755`: revision 34 → 35. Default video `k0vRbdeBlkU`; six newest usable broadcast records from vidIQ's channel-videos read on Oct. 15. No live-now status is inferred from a zero duration. Unknown duration is omitted. The return button selects the latest broadcast rather than an empty logo card. Autoplay remains off.
- Each write compared a fresh revision and the exact archived HTML, preserved `ESSENTIAL`, and returned the exact resulting HTML match. No Editor site publish was performed.

## Rollback

Read the relevant embed's fresh revision, then PATCH the archived `pricing-before.html` or `tv-before.html` with that revision and its existing category. Do not reuse a historical revision. Keep account, plan and automation state intact. Reopen the public route and verify the result.

## Reader prototype

`magazine-preview/index.html` is an original lightweight reader using the existing Oct. 11 postgame issue. Ten source-backed sections demonstrate Contents, previous/next navigation, reading progress, adjustable text and the existing members PDF destination. It contains published excerpts and canonical full-story links, not a completed paid issue. Photography is credited to Chris Spears. Its date and preview status are visible.

The production proposal is in `revenue-model.md`. It includes a 20-page issue budget; it does not pad this demonstration with invented editorial content. Publication cadence, final benefits and entitlement mapping must be verified before a new membership offering is sold.

## Keep-watching candidate

`video-candidate.html` and its fixture are unreleased. The body-level iframe survives simulated SPA route changes without reparenting. Tests at 390 and 1366 preserved the iframe and WindowProxy, mocked playhead 73, one iframe load, close/pause, restore without autoplay, and late cookie-banner handling. This is a fixture result, not proof of real YouTube playback. Verify actual Wix link routing: a full-document navigation destroys an in-page player. Real mobile playback, consent interaction, navigation and packaging remain release gates. The candidate exceeds the custom-embed size limit and needs a pinned repository asset if adopted.

## Measurement evidence and limits

The roundup email snapshot has 482 deliveries, 145 openers, 36 clickers, one bounce and zero complaints. The afternoon snapshot has 297 deliveries, 164 openers, 71 clickers, zero bounces and zero complaints. Compare each campaign against its own delivered audience; do not sum unique people across campaigns or treat clicks as purchases. Campaigns have different ages and audiences.

GA4 results were rejected: a date-dimensional request for Sept. 1–Oct. 14 returned Oct. 15 zero rows. Native Wix traffic and order reads did not produce usable results. Traffic, paid subscriber totals, trial-to-paid conversion, renewals and revenue are unavailable in this pass. vidIQ lists no authorized owned channel, so private channel revenue and retention are unavailable; public video metadata is usable.

The 320-pixel native pricing viewport matches documented legacy Wix behavior. It is an observation, not evidence by itself of a conversion defect. No field Core Web Vitals claim is made.

## Operating lesson

Bound provider reads and permission waits; return partial evidence promptly. Validate requested dates before using metrics. Inspect the current live embed rather than a similarly named old deploy file. Confirm actual media decoding, not merely an image element or a guessed Wix URL. Keep fixture evidence separate from real public playback. Shared evidence/learning rules were already merged in PR #280.
