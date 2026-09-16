# Mobile Layout Stability Repair — 2026-09-16

## Problem

Mobile pages were showing inconsistent spacing and a large blank area between content and the custom footer. Navigation between Home, Blog, articles, Magazine, and GatorBait TV could also leave stale route classes or page-specific UI behind.

## Confirmed causes

1. `GBM - Sports Feed Cards v8` contained a broken `/gatorbait-media-blogs` route regex and only evaluated the route once.
2. `GBM - Article Nav v1` forced the inner Wix page wrapper to `height:100%`, which could preserve dead height below article content.
3. `GBM - TV + Magazine + News Images v7` still created the retired Magazine hero underneath the new Magazine Digital Cover, creating duplicate page ownership.
4. Page-specific custom UIs were not consistently cleaned up after Wix client-side navigation.
5. The custom footer replaces the native Wix footer, so retained height in Wix transition wrappers appears visually as a large blank block immediately above `#gbm-footer`.

## Live repairs

The following existing embeds were updated in place; no new emergency overlay embed was added:

- `GBM - Sports Feed Cards v9 (route + gap fix)`
  - repairs Blog route detection
  - re-syncs the Blog class after navigation
  - allows Wix transition/page wrappers to size to actual Blog content

- `GBM - Article Nav v2 (stable footer gap)`
  - removes stale `Keep reading GatorBait` content when leaving an article
  - overrides the old `height:100%` post wrapper with `height:auto`
  - keeps mobile nav and related-story tap targets compact

- `GBM - TV + News Images v8 (Magazine retired)`
  - no longer builds or owns Magazine UI
  - cleans stale TV state when leaving the TV route
  - rechecks the route during client-side navigation

- `GBM - Magazine Digital Cover v5.1 (stable routing)`
  - remains the sole Magazine page owner
  - continuously reconciles route state so the custom Magazine page is removed after navigation away and can build after navigation into Magazine

- `GBM - Social Footer v8 (layout stability)`
  - makes the Wix page-transition wrapper follow real content height on the primary public routes
  - hard-collapses the hidden native footer
  - keeps the custom footer flush to content
  - adds mobile overflow protection and safe-area bottom padding
  - clears stale Blog, TV, and Magazine route state during Wix SPA navigation

## Primary routes covered

- `/`
- `/gatorbait-media-blogs` and descendants
- `/post/*`
- `/magazine`
- `/the-buddy-martin-show`
- `/podcasts`
- `/message-board`
- `/contact`
- `/policies`
- `/pricing-plans`

## Cookie-banner interaction

Cookie consent remains Wix-native. Layout code must not fake consent, hide the banner after an arbitrary timeout, or create its own acceptance state. The banner is currently compact, its revisit button is disabled, and its production state is documented separately in `docs/COOKIE-CONSENT-STATE-2026-09-14.md`.

## Mobile QC status

Code-level route and layout checks passed and the public Home, Magazine, and TV routes remained reachable after the repair. A true visual Mobile QC PASS still requires an actual rendered mobile viewport or real-device screenshot at 320, 375–390, and 430 px widths. Do not mark visual QC complete from source inspection alone.
