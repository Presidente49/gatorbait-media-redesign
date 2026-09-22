# GatorBait Homepage Baseline Lock

**Status:** CANONICAL DEFAULT  
**Locked by owner:** 2026-09-22
**Current approved refinement:** compact header spacing + strict newest-first story chronology + writer-separated mobile cards + footer Store link, 2026-09-22  
**Applies to:** production homepage `/` on `gatorbaitmedia.com`

## Default production homepage

The GatorBait homepage is the standalone **Newsroom** presentation.

This is the default production state. It is not an experiment, temporary fallback, or design candidate.

### Presentation baseline

- Baseline commit: `f0a2deca30b8080b10efa8216f308414b7a95636`
- All four newsroom presentation assets stay pinned to that same commit:
  - `newsroom-preview/wix-live.css`
  - `newsroom-preview/wix-live-ui.css`
  - `newsroom-preview/wix-live.js`
  - `newsroom-preview/wix-live-ui.js`
- Newsroom loader custom embed: `fdc2127a-845a-4d02-b711-438f1a4a86ce`
  - live verified revision after clean utility-footer restore: `49`
  - required state: **ENABLED**
- Homepage prepaint shield: `2f57bc6b-e05f-4a96-adf3-cb02e2b18e51`
  - live verified revision after restore: `17`
  - required state: **ENABLED**
- Legacy homepage cleanup: `ed3718cc-5ca3-485b-a7dc-1c697afdcd5f`
  - live verified revision after restore: `8`
  - name: `GBM - Legacy Homepage Hard Delete v2 (prepaint bounded)`
  - required state: **ENABLED**

## Non-negotiable homepage behavior

- The Newsroom is the only visible homepage presentation.
- The old native Wix homepage shell must not appear beneath or before the Newsroom.
- **Today's Edition** must never be visible on the homepage.
- **Monday Chomp** must never be visible on the homepage.
- Do not reintroduce the native Wix homepage header/footer/content shell underneath the Newsroom.
- Do not mix newsroom CSS/JS commits.
- Do not add another competing homepage theme, mount, polling loop, or permanent observer.
- Do not add first-paint opacity animations or delayed visual swaps.
- Legacy cleanup must finish inside the bounded prepaint/startup window; it must not remove layout blocks after a reader has begun using the page.
- Preserve a deterministic prepaint followed by one stable Newsroom mount.
- Article and utility routes may continue using their normal Wix shell; this lock is specifically for the homepage.

## What is and is not frozen

The **presentation architecture is locked**.

Editorial content is **not frozen**. The newsroom JavaScript may continue reading the live Wix blog feed so new stories, chronology, images, and editorial routing continue to update normally.

## Change-control rule

A future change that materially alters this homepage baseline requires **explicit Brenden approval for that homepage change**.

Before replacing the baseline:

1. Inspect current live embed revisions.
2. Keep a rollback snapshot.
3. Make one bounded change in draft/staging where possible.
4. Verify desktop plus approximately 390 px and 430 px mobile.
5. Confirm no flash, jump, old shell, Today's Edition, or Monday Chomp.
6. Publish only after the new state is visibly better and rollback remains available.

Routine story publishing, feed refreshes, metadata updates, and editorial ordering do not require unlocking the presentation baseline.

## Recovery rule

If the homepage regresses, restore this baseline first rather than layering another override.


## Footer and whitespace lock — 2026-09-22

- The site uses one compact footer owner: `GBM - Universal Utility Footer v13 (no address)`, embed `f8b950c9-47ce-4390-976f-85a0f040f0c6`, live revision `22`, **ENABLED**.
- The native Wix footer and the old duplicate newsroom footer are not visible.
- Street address must not be rendered in the footer or organization schema.
- `GBM - Sitewide Footer Gap Guard v3`, embed `15302fb2-44ef-4a93-a2a8-899731a6c197`, live revision `6`, **ENABLED**, owns removal of oversized blank page tails on blog/article and other non-account routes.
- Do not reintroduce the retired Magazine-specific footer/menu.
