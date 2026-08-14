# GatorBait Media Rollback Register

**Date:** 2026-08-14

This file records the production baseline that must remain recoverable throughout the Studio migration.

## Production baseline

| Item | Current state | Rollback rule |
|---|---|---|
| Production URL | `https://www.gatorbaitmedia.com/` | Do not change domain assignment before final cutover approval. |
| Wix site ID | `18fb3a4e-d7f6-414a-aeb9-3047db3ea115` | Same site/dashboard must be preserved. |
| Live editor | Classic Wix Editor | Remains live until Studio QA passes. |
| Default branch ID | `00000000-0000-0000-0000-000000000000` | Do not change default branch during migration inventory/design. |
| Default branch revision | `2` at inventory time | Re-query immediately before any branch-sensitive operation. |
| Default branch type | `ORIGINAL_BRANCH` | Must not be deleted. |
| Default branch editor | `CLASSIC` | Current production baseline. |
| Premium/custom domain | Active | Preserve until Studio cutover and plan transition are explicitly ready. |
| Wix Blog | Installed/current content authority | Do not replace or bulk-migrate archive without a separate verified plan. |
| Wix CRM/Contacts | Current source of truth | No mass deletion or consent rewrites. |
| Wix Members/Pricing Plans | Installed | Preserve member/customer continuity. |
| GA4 custom embed | Enabled, `G-9LPC2VVC0V` | Keep until replacement/native analytics path is tested for duplicate events. |
| Site Fixer v6 | Enabled | Keep until redirects, metadata and schema have native verified replacements. |
| Homepage Buddy/schedule embed | Enabled | Keep until Studio homepage equivalent is verified. |
| Buddy Martin Show hub embed | Enabled | Keep until Studio show-page equivalent is verified. |

## Irreversible-risk actions

The following are prohibited before a written go/no-go review:

- Publishing a Studio branch for the first time.
- Changing apex or `www` DNS records.
- Reassigning the primary domain.
- Deleting the original Classic branch.
- Bulk deleting contacts, members, pricing-plan orders, blog posts, categories, redirects or media.
- Replacing marketing consent states.
- Removing production custom code before equivalent behavior is verified.

## Studio migration limitation discovered

The public Branches API rejected Classic-to-`STUDIO_TWO` creation with `EDITOR_TYPE_VALIDATION`. Official Wix product guidance directs Classic-to-Studio migration through the Wix Studio workspace's **Create a version on Studio** action. Until that branch exists, all migration work stays in read-only inventory, GitHub planning/design, and non-destructive business-data cleanup.

## Final cutover backup rule

Before the eventual first Studio publish:

1. Duplicate/export any recoverable design/configuration artifacts that do not share the dashboard.
2. Snapshot current DNS records.
3. Snapshot current active custom embeds and analytics IDs.
4. Export/record redirect map and canonical URLs.
5. Record contact/member/pricing-plan counts.
6. Capture production screenshots and key URL response states.
7. Confirm the Studio branch passes the migration acceptance checklist.
