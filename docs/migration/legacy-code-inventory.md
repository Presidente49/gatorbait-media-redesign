# GatorBait Legacy Code Inventory

**Date:** 2026-08-14

## Decision

The current Classic Wix custom CSS/Velo layer is evidence of legacy behavior, not a codebase to port wholesale into Wix Studio.

The August 5, 2026 approved editorial direction supersedes the older repository's ESPN+/Athletic dark-theme direction.

## `custom-css-LIVE.css`

Classification: **RETIRE / REPLACE WITH STUDIO NATIVE DESIGN SYSTEM**

Major risk patterns:

- forces `#SITE_HEADER` and `#SITE_FOOTER` display/height/visibility with `!important`;
- globally restyles `body`, page containers and Wix-generated internals;
- globally overrides `h1` through `h6`, `p`, `a`, generic `article`, inputs, textareas and selects;
- relies on broad substring selectors such as `[id*="SITE_HEADER"]`, `[class*="forum"]`, `[class*="member"]`, `[class*="dropdown"]` and `[class*="loading"]`;
- includes Wix-generated/private class names such as `.LWbAav`, `.aXOBOn`, `.Kv1aVt`, `.L5x0Fp`, `.vAU8Qm`, `.aSX36E`, `.XDcQnF`, `.WIEJ0e`;
- wraps article views in large dark cards, which conflicts with the approved Aug. 5 editorial design;
- uses extensive `!important`, making app/component upgrades fragile.

Do not port this stylesheet to Studio. Recreate desired behavior through Studio components/tokens and narrowly scoped CSS only when Studio lacks a native control.

## `custom-css.css`

Classification: **ARCHIVE AS HISTORICAL DRAFT**

Older predecessor to the live stylesheet. It does not control the Studio design direction.

## `masterPage.js`

Classification: **MOSTLY RETIRE**

Current behavior:

- updates copyright text only if an element with ID `#copyrightText` exists;
- adds mouse hover background color changes to a button with ID `#subscribeBtn`;
- comments describe sticky header behavior but actual stickiness depends on a Classic Editor setting, not code.

Studio replacement:

- copyright year can be native/static or a tiny scoped component if dynamic behavior is desired;
- CTA hover/focus states belong in the Studio design component, including keyboard focus and touch behavior;
- sticky header belongs in Studio layout/position settings.

No business-critical backend logic is present in this file.

## Live custom embeds

### GA4 Analytics - LIVE
Classification: **VERIFY THEN MIGRATE/CONSOLIDATE**

- GA4 measurement ID: `G-9LPC2VVC0V`.
- Do not allow Studio/native analytics plus custom code to double-count pageviews/events.

### GBM - Site Fixer v6
Classification: **REPLACE THEN RETIRE**

Current responsibilities:

- client-side redirects for old blog/category/tag/login/pricing/home routes;
- client-side document-title/meta rewriting;
- NewsMediaOrganization JSON-LD injection;
- NewsArticle JSON-LD injection.

Problems:

- redirects execute in browser instead of at the platform/server routing layer;
- schema uses fallbacks that can create inaccurate dates/authors;
- title/meta mutation happens after page render;
- one script has too many unrelated responsibilities.

Studio target: native URL/SEO handling, accurate Wix Blog metadata/schema, and narrowly scoped organization markup only where Wix does not already provide it.

### Homepage Schedule + Buddy Martin Show embed
Classification: **REPLACE WITH STUDIO NATIVE COMPONENTS**

DOM-injects hardcoded schedule/show markup before the Classic footer. Preserve the content concept, not the injection architecture.

### Buddy Martin Show Live Hub embed
Classification: **REPLACE WITH STUDIO NATIVE SHOW HUB**

Preserve canonical `/the-buddy-martin-show`, live/offline behavior and episode discovery. Replace DOM injection with responsive Studio layout/components.

### AdSense Auto Ads
Classification: **DISABLED / INVESTIGATE BEFORE REACTIVATION**

Do not turn it on as part of the Studio migration without an explicit monetization/UX decision.

## Migration rule

No legacy custom code is removed from production until the replacement behavior is verified. The migration branch should maintain a replacement-to-retirement matrix and a rollback point for every live embed that is eventually disabled.
