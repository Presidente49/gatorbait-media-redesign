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
| Repo-backed unified mobile masthead + off-canvas drawer | `9b3eb505-b0ab-4837-a403-6998278331ad` | GBM - Unified Mobile Shell v2 |
| Magazine digital cover | `1dd74333-ee02-40da-9c93-cf8fd787c129` | GBM - Magazine Digital Cover v4 (VB3 issue) |
| Repo-backed Podcasts, Message Board and article print/save behavior | `9ce1fccf-d594-41e7-acaa-b1c433c89b0b` | GBM - Site Experience Pages + Print v1 |
| GatorBait TV, Magazine and story-image SEO | `82c4ca83-98df-4f35-9972-7345a2a71755` | GBM - TV + Magazine + News Images v7 |
| Compact footer, social links and official logo | `f8b950c9-47ce-4390-976f-85a0f040f0c6` | GBM - Compact Optimized Logo + Social Footer v7 |
| Blog feeds and article ordering | `f644781b-8be2-461d-88a9-7bff8d5fef7a` | Blog feeds embed |

The former `GBM - Magazine Mobile QC v1` embed (`c03a5f65-5d49-4343-a3ca-3fcc2869471a`) is retired and must remain disabled. The former separate Header Login Fix is also retired. The former `GBM - Mobile Pages + TV Menu v5` embed (`796b7ce7-b05e-4cc6-9d90-dcf7a6626270`) is revision 6 and disabled; site-experience navigation now owns those direct links.

## Unified navigation

The repo is the source of truth for the mobile shell:

- `newsroom-preview/mobile-shell.css`
- `newsroom-preview/mobile-shell.js`

The mobile drawer includes Front Page, Magazine, GatorBait TV, Podcasts, Message Board, Shop, Join, Account & Preferences and Contact.

`newsroom-preview/site-experience.js` adds the corresponding first-class direct destinations to desktop Wix navigation while preserving the native desktop header.

Do not restore the old compressed/accordion-style native mobile menu. Do not add a second mobile menu for a specific page. Any future mobile navigation change must be made in these repo files and deployed through the unified shell loader.

## GatorBait Magazine

`/magazine` is a digital issue, not an eCommerce mockup.

Current cover direction:
- portrait magazine-cover proportions rather than a full-width web hero;
- current GatorBait photography, with Vernell Brown III as the September 2026 cover subject;
- cover story links to `Brown Supplies the Spark as Florida Rolls Past Campbell, 52-3`;
- interactive cover lines link to real GatorBait features;
- supporting sections are Inside This Issue, 2026 season reference and the latest single-game photo gallery;
- print-on-demand and Magazine Only checkout blocks stay off the live page until real fulfillment/pricing exist.

The cover is intentionally built as live web typography and owned photography rather than one giant flattened image. This keeps links interactive, text sharp and revisions lightweight while still preserving magazine-cover composition.

## Podcasts / Multimedia

Canonical route: `/podcasts`.

Repo sources:
- `newsroom-preview/site-experience.css`
- `newsroom-preview/site-experience.js`

The page treats YouTube as the current live/replay home of The Buddy Martin Show and labels Apple Podcasts as the legacy audio archive. Do not imply the old Apple feed is current when its catalog is not current. GatorBait TV remains `/the-buddy-martin-show`.

## GatorBait Message Board

Canonical route: `/message-board`.

The live site route is the first-class branded home for the community. It is allowed to precede the discussion backend, but must clearly label backend build status and must never simulate fake users, posts or activity.

Permanent community rules live in:
- `skills/gatorbait-community/SKILL.md`
- `automation/ops-hub/agents/community-director.md`

Target architecture is Discourse + GatorBait identity/membership + future GatorBot. Do not install or restore Wix Forum; Wix Forum was discontinued in 2026.

## Print / Save PDF

Every Wix Blog post route (`/post/...`) receives a compact `Print / Save PDF` action through `site-experience.js`.

It uses the browser print pipeline and a dedicated print stylesheet so the reader can print or save a clean PDF without navigation/footer clutter. This is deliberately available during the audience-rebuild period. Later membership gating may restrict premium print/download behavior, but do not silently gate it before the membership strategy explicitly changes.

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
2. One dominant current story and photograph.
3. Compact current football result/schedule context.
4. A small chronological set of current stories.
5. Clear routes to GatorBait TV, GatorBait Magazine, Podcasts, Message Board and membership.

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
9. Print / Save PDF utility remains visually secondary to the journalism.

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
- Magazine cover preserves portrait proportions and usable cover-line scale.
- Podcasts and Message Board routes use the same mobile shell and do not create page-specific navigation.
- Footer and signup controls remain reachable.
- No layout jump from late logo or image sizing.

## Design references

Use `docs/EDITORIAL-DESIGN-REFERENCES.md` and `skills/gatorbait-graphic-design/SKILL.md` before proposing a new editorial or marketing visual system. The current decision is to preserve Wix production while using the repo-backed Graphic Design Artist / Creative Director workflow for covers, broadcast graphics, social assets and campaign art.

## Retired files

`custom-css-LIVE.css` and `custom-css.css` are historical dark-theme sources. Do not paste, deploy or re-enable them. The landing-page incident is documented in `docs/LANDING-PAGE-QC-2026-09-13.md`.
