# GatorBait SEO Baseline

**Date:** 2026-08-14

## Homepage consolidation

### Problem found

The Classic Wix site contained two competing homepage signals:

- Static page item `eabx0` resolves to the canonical root `https://www.gatorbaitmedia.com` but its saved page override contained `robots=noindex`.
- Static page item `jqt2w` resolves to `/home`, was indexable, and carried older homepage metadata plus a second historical Google verification tag.
- Public Google results were surfacing `/home` as the GatorBait homepage.
- The existing client-side Site Fixer already redirects `/home` visitors to `/`, so visitor behavior and search metadata were inconsistent.

### Repair applied

Root item `eabx0`:

- removed `robots=noindex` by replacing the page override set;
- kept default canonical root;
- title: `GatorBait Media | Florida Gators News, Recruiting & Analysis`;
- description: `Independent Florida Gators news, football, recruiting, analysis, original photography and The Buddy Martin Show from GatorBait Media.`;
- aligned Open Graph/Twitter titles and descriptions;
- moved/preserved Facebook domain verification on the root page.

Duplicate `/home` item `jqt2w`:

- set `robots=noindex`;
- added explicit canonical `https://www.gatorbaitmedia.com/`;
- aligned `og:url` to the root;
- replaced stale homepage title/description/social copy with current GatorBait positioning;
- removed the old page-specific Google verification override from the page tag set; site-level Google verification remains active.

Both changes were sent once with `publish:true` and once without `publish` so published and saved static-page revisions are aligned.

Saved-state verification after the mutation confirms:

- root resolved tag set has **no `noindex`** and canonical root;
- `/home` resolved tag set has **`robots=noindex`** and canonical root.

Wix's Static Page Get Item SEO Tags API cannot read back the separate published revision, so live crawler refresh remains an external verification step. The publish calls themselves succeeded.

## Existing site-level verification

Site-level Google verification token remains:

`MOlfZ6G_RjbtyRwr2vmPc9zmeAvtaEKWReL5RmqclxA`

An additional DNS TXT Google verification value also exists:

`google-site-verification=BTY4xoiIzXZ_zRXwxnBtojRR0kYRxOHs8SU1rQATLKk`

Do not remove either DNS/site-level verification signal without confirming which Google property/service uses it.

## Current public-search findings before repair

- Google indexed `/home` as `GatorBait Media | Your Source for Florida Gators Sports`.
- `/subscribe` returns a GatorBait 404.
- `/about` contains materially stale 2019 copy.
- `/the-buddy-martin-show` is indexed but the last public crawler snapshot still showed the old title/content shell; crawler refresh is needed after recent SEO/show-hub changes.
- individual Franz Beard articles are being indexed and attributed by name, confirming author content is discoverable.

## Next SEO migration actions

1. Replace client-side redirect rules with Wix/Studio-native routing where supported.
2. Preserve all high-value `/post/...` URLs.
3. Inventory every static page for dead/ghost pages and thin system pages.
4. Update About page with current company/entity information.
5. Replace dead `/subscribe` path with the single modern newsletter acquisition route.
6. Audit Blog SEO patterns and native NewsArticle output before keeping any custom schema injector.
7. Verify robots.txt, sitemap and llms.txt after Studio cutover.
8. Run post-cutover canonical/HTTPS/indexability checks before requesting recrawl/indexing.
