# GatorBait Media — Current Wix Implementation Guide

This file is the source of truth for the live design direction. It supersedes the retired ESPN-style dark-theme instructions.

## Current direction

- A professional digital newsroom built around a strong lead story, clear hierarchy, Florida identity and fast reading.
- The official GatorBait script logo from Wix Media Manager.
- Georgia (or a comparable editorial serif) for headlines and long-form reading.
- Arial/Helvetica for navigation, labels, forms and utility text.
- Original photography should carry the page. New editorial treatments are welcome when they remain readable, responsive and stable.
- Changes must be scoped to their page or component. Never apply global rules to every `p`, `h1`, `article` or Wix app.
- No first-paint fades, permanent DOM polling or competing global themes.

## Official brand asset

- Display name in Wix: `GatorBait Logo - Optimized Web`
- Media ID: `d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp`
- URL: `https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp`
- Intrinsic size: 900 × 241
- Alt text: `GatorBait Media`

Use the intrinsic width and height in markup to reserve space and prevent layout shift. Scale with `width:100%; height:auto`.

## Live custom embeds

| Purpose | Embed ID | Current name |
|---|---|---|
| Desktop header and optimized official logo | `7fee4de6-1886-475e-a3f3-b9c68161c242` | GBM - Compact Optimized Logo + Header v10 |
| Repo-backed unified mobile masthead + off-canvas drawer | `9b3eb505-b0ab-4837-a403-6998278331ad` | GBM - Unified Mobile Shell v1 |
| Magazine digital cover | `1dd74333-ee02-40da-9c93-cf8fd787c129` | GBM - Magazine Digital Cover v3 (repo mobile shell) |
| GatorBait TV, Magazine and story-image SEO | `82c4ca83-98df-4f35-9972-7345a2a71755` | GBM - TV + Magazine + News Images v7 |
| Compact footer, social links and official logo | `f8b950c9-47ce-4390-976f-85a0f040f0c6` | GBM - Compact Optimized Logo + Social Footer v7 |
| Blog feeds and article ordering | `f644781b-8be2-461d-88a9-7bff8d5fef7a` | Blog feeds embed |

The former `GBM - Magazine Mobile QC v1` embed (`c03a5f65-5d49-4343-a3ca-3fcc2869471a`) is retired and must remain disabled. The former separate Header Login Fix is also retired. Mobile navigation is no longer allowed to be implemented by page-specific Wix menus or competing custom-embed overrides.

## Unified mobile navigation

The repo is the source of truth for the mobile shell:

- `newsroom-preview/mobile-shell.css`
- `newsroom-preview/mobile-shell.js`

At widths up to 820 px these files:

1. Hide the native Wix mobile header/navigation.
2. Render one consistent GatorBait masthead on every route.
3. Open one off-canvas slide drawer with Front Page, Magazine, GatorBait TV, Shop, Join, Account & Preferences, Contact and policies access.
4. Keep account/cancellation controls inside the menu/modal flow rather than as persistent floating buttons.
5. Preserve desktop Wix navigation unchanged.
6. Apply the tested Magazine mobile scale corrections using the actual live selectors (`.gbmm-mast`, `.gbmm-main h1`, `.gbmm-lines`, `.gbmm-ref`).

Do not restore the old compressed/accordion-style native mobile menu. Do not add a second mobile menu for a specific page. Any future mobile navigation change must be made in these repo files and deployed through the unified shell loader.

## Newsletter

The publication is called **GatorBait Weekly**. Do not use “The Monday Chomp,” “Monday Chomp,” “Quick Chomps” or “Gatorade Magazine.”

The responsive email source is:

- `backups/gatorbait-weekly-template.html`

Every signup modal must provide:

- A visible 44 × 44 close button.
- Escape-key dismissal.
- A session-level dismissal so the same modal does not reopen immediately.
- A clear value statement and one email field.
- No forced navigation or hidden close control.

## Front page

Treat the homepage as the front page of a magazine:

1. Official masthead.
2. One dominant lead story and photograph.
3. Compact current football result/schedule context.
4. A small chronological set of current stories.
5. Clear routes to GatorBait TV, GatorBait Magazine and membership.

Avoid empty modules, duplicate navigation and animated loading effects. Layout, color, density and editorial modules may evolve when verified on desktop and mobile.

## Article template

Follow `docs/superpowers/specs/2026-08-05-gatorbait-editorial-template-design.md`:

1. Category label.
2. Headline.
3. Deck.
4. Byline and dates.
5. Hero image.
6. Caption and photographer credit.
7. Narrow readable story column.
8. Optional related coverage or newsletter modules only when they have content.

Preserve Wix Blog URLs and metadata. Never inject duplicate schema that overrides accurate Wix fields.

## Mobile quality control

Test near 320 px, 390 px and 430 px widths, plus tablet and desktop regression:

- No horizontal overflow.
- The same unified slide drawer appears on every route.
- Native Wix compressed mobile navigation is not visible behind or alongside the repo shell.
- Logo fits beside the menu control.
- Mobile menu rows remain compact; routine rows should not exceed roughly 56 px unless a deliberate design requires it.
- Headline line height remains open and readable.
- Navigation targets are at least 44 px.
- Story images keep their aspect ratio and do not stretch.
- Text never uses low-contrast dark-on-dark or pale-blue-on-white combinations.
- Account/cancellation controls are menu/modal options, not persistent floating buttons.
- Magazine masthead and cover-story headline remain proportional rather than dominating the viewport.
- Footer and signup controls remain reachable.
- No layout jump from late logo or image sizing.

## Design references

Use `docs/EDITORIAL-DESIGN-REFERENCES.md` before proposing a template, frontend framework, design repository, or new UI dependency. The current decision is to preserve Wix production and borrow proven newsroom layout patterns without importing another stack.

## Retired files

`custom-css-LIVE.css` and `custom-css.css` are historical dark-theme sources. Do not paste, deploy or re-enable them. The landing-page incident is documented in `docs/LANDING-PAGE-QC-2026-09-13.md`.
