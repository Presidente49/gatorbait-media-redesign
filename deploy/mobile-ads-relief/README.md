# Mobile AdSense relief — September 29, 2026

Brenden requested repair of oversized desktop-style Google ads and slow mobile
pages. This change temporarily pauses Google advertising on phones and compact
screens. It does not implement smaller replacement mobile placements.

## Applied change

- Existing Wix serving owner: `af338ad4-8c84-4708-8859-f1d6a0121c13`, revision 2 → 3.
- Only `embedData.html` changed. ADVERTISING consent category, enabled state,
  HEAD position, domain, and loadOnce false are preserved.
- The guard exits before requesting Google's script when the viewport is at
  most 820 CSS pixels, either physical screen dimension is at most 820 CSS
  pixels, or the browser identifies as a phone/Android device.
- A phone requesting a desktop page and a landscape phone remain covered.
- Wider desktop sessions retain the original async loader and publisher ID,
  with a duplicate-load guard. No CSS clips, hides, or rescales Google creatives.
- No timer, observer, extra loader, new ad unit, Google account setting change,
  site publish, or unrelated Wix embed change.

## Evidence and limits

- Complete 56-embed live inventory: one enabled serving loader; all legacy
  serving/presentation/mobile-ad patches disabled.
- `before.json` and `after.json` preserve the provider objects.
- `adsense.html` is byte-identical to the successful revision-3 response.
- `loader-tests.json`: nine isolated JavaScript cases passed, each evaluated
  twice to check repeat execution. Phones/compact screens append no ad script;
  desktop appends exactly one. These are mocked environment tests, not rendered
  device tests or measured network timings.
- Independent fresh public desktop reload on the canonical homepage showed
  `gbm-adsense-desktop-only-v1` and one Google script marked
  `data-gbm-adsense="desktop-only-v1"`. An ad iframe was still present, confirming
  desktop serving was not inadvertently removed. Homepage had one root and no
  horizontal overflow (1363px viewport).
- Public article check also confirmed the new guard and one desktop Google
  loader; see runtime-verification.json for the exact route.
- Raw HTML alone did not contain the guard: Wix injects the advertising embed
  later. Verify the rendered DOM after tag loading, not SSR markup alone.
- Actual iPhone rendering, speed improvement, consent transitions, and revenue
  impact have not been measured. No claim of field Core Web Vitals improvement.
- Already-open pages may retain previously loaded ads until a fresh navigation.

## Follow-up and rollback

Issue #30 remains open for supported compact mobile placements and account-side
Auto Ads controls. Previous Google sign-in work was abandoned by the owner;
this repair does not retry it or alter account credentials. Mobile advertising
revenue is paused while this mitigation is active; desktop inventory remains.

Rollback: read the current embed and revision, then PATCH only embedData using
the exact category and HTML in `before.json`. Never send stale revision 2 and
never enable a second loader. This deliberately restores phone Auto Ads too.

Do not automatically restore mobile ads from a historical verification embed
or a routine integration reconciliation. A compact mobile configuration should
be tested before replacing this mitigation.
