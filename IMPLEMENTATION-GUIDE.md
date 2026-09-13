# GatorBait Media — Current Wix Implementation Guide

This file is the source of truth for the live design direction. It supersedes the retired ESPN-style dark-theme instructions.

## Approved direction

- A restrained digital magazine: white editorial canvas, deep navy structure, Florida orange accents.
- The official GatorBait script logo from Wix Media Manager.
- Georgia (or a comparable editorial serif) for headlines and long-form reading.
- Arial/Helvetica for navigation, labels, forms and utility text.
- Original photography should carry the page. Avoid broadcast-style chrome and decorative clutter.
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
| Header, official logo, mobile drawer and newsletter accessibility | `7fee4de6-1886-475e-a3f3-b9c68161c242` | GBM - Compact Optimized Logo + Header v8 |
| GatorBait TV, Magazine and story-image SEO | `82c4ca83-98df-4f35-9972-7345a2a71755` | GBM - TV + Magazine + News Images v7 |
| Compact footer, social links and official logo | `f8b950c9-47ce-4390-976f-85a0f040f0c6` | GBM - Compact Optimized Logo + Social Footer v6 |
| Direct navigation fixes | `796b7ce7-b05e-4cc6-9d90-dcf7a6626270` | Direct menu embed |
| Blog feeds and article ordering | `f644781b-8be2-461d-88a9-7bff8d5fef7a` | Blog feeds embed |

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

Do not add category banners, large pale-blue subheads, empty modules, duplicate navigation or animated loading effects.

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

Test near 390 px and 430 px widths:

- No horizontal overflow.
- Logo fits beside the menu control.
- Headline line height remains open and readable.
- Navigation targets are at least 44 px.
- Story images keep their aspect ratio and do not stretch.
- Text never uses low-contrast pale blue on white.
- Footer and signup controls remain reachable.
- No layout jump from late logo or image sizing.

## Retired files

`custom-css-LIVE.css` and `custom-css.css` are historical dark-theme sources. Do not paste, deploy or re-enable them. The landing-page incident is documented in `docs/LANDING-PAGE-QC-2026-09-13.md`.
