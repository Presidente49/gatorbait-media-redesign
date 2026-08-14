# GatorBait Media Current-State Inventory

**Date:** 2026-08-14
**Production:** https://www.gatorbaitmedia.com/
**Wix site ID:** 18fb3a4e-d7f6-414a-aeb9-3047db3ea115
**Migration branch:** studio-rebuild-2026

## Wix platform

- Published Premium site with custom domain.
- Editor: Classic Wix Editor (`Editor` in site context).
- Velo: enabled.
- Default Wix branch: `00000000-0000-0000-0000-000000000000`, revision `2`, type `ORIGINAL_BRANCH`, editor `CLASSIC`, default `true`.
- Query of all branches returned only the Classic original branch. No Studio migration branch currently exists.
- Attempt to create a cross-editor branch through the public Branches API with `STUDIO_TWO` failed with `EDITOR_TYPE_VALIDATION`.
- Official Wix guidance exposes Classic-to-Studio migration through the account/Studio UI action **Create a version on Studio**. Do not substitute a duplicated/new site because it would not preserve the same shared dashboard/data architecture.

## Installed business apps

- Promote SEO
- Wix Blog
- Wix eCommerce
- Wix Events & Tickets
- Wix Forms (new generation app ID `225dd912-7dea-4738-8688-4b8c6955ffc2`)
- Wix Forms & Payments / legacy forms app
- Wix Invoices
- Wix Members Area
- Wix Pay Links
- Wix Pricing Plans
- Wix Restaurants Menus
- Wix Restaurants Orders
- Wix Stores Catalog V1

The presence of both modern Wix Forms and Wix Forms & Payments is a migration-risk area. Restaurant and Stores apps must be confirmed as business-required before being carried into the Studio branch.

## SEO/page findings

- Site-level Google verification exists.
- Buddy Martin Show canonical page is `/the-buddy-martin-show`; SEO title/description were recently corrected.
- Static page item `eabx0` resolves to canonical root `https://www.gatorbaitmedia.com` but currently has `robots=noindex` in saved SEO state.
- Separate static page item `jqt2w` resolves to `/home` and is indexable, with legacy SEO metadata and an additional older Google verification tag.
- This root-vs-`/home` split is a migration defect and must be normalized in Studio without changing production until redirect/canonical behavior is fully mapped.
- Search, cart, and thank-you system pages are intentionally `noindex`.
- About page contains custom JSON-LD and older/stale editorial copy that needs review.

## Active custom embeds

1. **GA4 Analytics - LIVE** — enabled, measurement ID `G-9LPC2VVC0V`.
2. **Google AdSense Auto Ads** — disabled.
3. **GBM - Site Fixer v6 (redirects + title + schema)** — enabled. Performs client-side redirects, rewrites post titles/meta, injects `NewsMediaOrganization` schema and post `NewsArticle` schema.
4. **GBM - Homepage Schedule + Buddy Martin Show v1** — enabled. DOM-injects homepage schedule and latest-show module before the Classic footer.
5. **GBM - Buddy Martin Show Live Hub v1** — enabled. DOM-injects the Buddy Martin Show live/latest hub on the canonical show page.

## Initial migration classification

- GA4: **MIGRATE/VERIFY**, but avoid duplicate native + custom tracking.
- Site Fixer redirects: **REPLACE WITH NATIVE REDIRECTS / STUDIO SEO**, after full URL map.
- Site Fixer schema/title rewriting: **RETIRE AFTER NATIVE SEO/SCHEMA IS VERIFIED**; client-side title/schema mutation is too brittle for the new architecture.
- Homepage Buddy/schedule DOM injection: **REPLACE WITH STUDIO NATIVE COMPONENTS**.
- Buddy Martin Show DOM injection: **REPLACE WITH STUDIO NATIVE COMPONENTS**, preserving `/the-buddy-martin-show`.
- AdSense disabled embed: **INVESTIGATE/ARCHIVE** until ad strategy is confirmed.

## Design authority

The August 5, 2026 approved editorial design supersedes the older ESPN+/Athletic dark-theme documentation. Current direction is restrained digital-magazine editorial design, original photography, controlled Florida orange/blue, and contained broadcast styling only where appropriate.

## Production safety

No production DNS changes, page deletions, app removals, consent changes, or Studio publication have been made as part of this inventory.
