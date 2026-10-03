# SEO on Wix

## Where SEO tags come from (precedence, lowest → highest)

1. Site SEO tags (Site SEO Tags API: default share image, site-level indexing, verification tags)
2. Wix's default pattern for the page type
3. Our customized pattern for the page type (SEO Patterns API / Dashboard SEO Settings → Customize defaults)
4. Tags of the page that displays the item
5. Tags of the item itself (Item SEO Tags API / per-page SEO panel)

Read `resolvedTags` from the Item SEO Tags API to see the result and where each value came from. Put conventions in patterns and one-offs on items. Don't write the same title onto 4,570 posts.
Source: https://dev.wix.com/docs/api-reference/business-management/seo/introduction

**GatorBait trap (LESSONS #47):** page SEO written via API is not in the Editor document, and a later full-site publish re-renders pages from the Editor copy. After API page-SEO changes, don't publish in the same pass. After any publish, re-apply and re-verify. The durable fix is typing the values into each page's Editor SEO panel once.

## SEO Settings (dashboard)

Path: **SEO & GEO → Tools and settings → SEO Settings** → pick a page type.
- **Customize defaults**: title/description patterns with variables, robots meta tag, structured data, additional meta tags, social share.
- **Edit by page**: per-item overrides. Bulk "Block indexing / Allow indexing" works for main pages and blog posts.
- Overridable per item: Product, Site, Event, **Blog Post**, **Blog Category** pages. **Not** overridable per item: **Blog Tags**, Pro Gallery expand mode, Challenges. Tag pages are pattern-only.
Source: https://support.wix.com/en/article/customizing-your-seo-patterns

## Blog tag and category pages

- **Blog tag pages are noindex by default** ("Tag Pages are not indexed by default unless you choose to let search engines index them"). Blog category pages are indexed by default. Leave tags noindexed. Our auto-tagger creates many thin tag pages.
- Default blog post markup: Article (BlogPosting). Can be switched to **NewsArticle** via SEO Settings → Blog Posts → Structured data markup → Switch preset. Check this against the NewsArticle JSON-LD our embeds already emit, so there's one article schema per page.
Source: https://support.wix.com/en/article/understanding-your-sites-default-seo-settings-6447365

## Robots meta tag vs robots.txt

- Robots meta (per page or pattern): noindex, nofollow, nosnippet, noarchive, noimageindex, max-* directives. Pattern path: SEO Settings → page type → Customize Defaults → Robots meta tag.
- robots.txt: editable in the Robots.txt Editor under SEO Tools. It controls crawling, not indexing. A blocked URL can still be indexed from external links. **High risk.** Change it only with a controller task and diff before/after.
Sources: https://support.wix.com/en/article/using-the-robots-meta-tag , https://www.wix.com/seo/learn/wix-seo-guide

## Sitemaps

Automatic and split by page type. New file after 10,000 URLs. Excludes noindexed, canonicalized-away and gated (members-only / paywalled) URLs. `/sitemap.xml`. Nothing to maintain. If a URL is missing, check its index/canonical/permission state.
Source: https://www.wix.com/seo/learn/wix-seo-guide

## Redirects

- URL Redirect Manager: SEO & GEO → Tools and settings → URL Redirect Manager → + New Redirect (single or group). Can target external URLs. Wix auto-creates a 301 when a slug changes. Up to **5,000** redirects per site. 301s only work on a connected custom domain. They take "a few minutes" to take effect.
- API redirects are live with no publish, and override a real page at the same path (site-ops). Browsers cache 301s hard.
Sources: https://support.wix.com/en/article/setting-up-301-redirects , https://www.wix.com/seo/learn/resource/redirects

## Structured data

Presets exist for blog posts, products, events and dynamic items. Up to 5 markups per SEO setting. Custom JSON-LD via SEO Settings or a page's Advanced SEO tab (JSON-LD only, no microdata). Custom markup on a page type overrides Wix defaults.
Source: https://support.wix.com/en/article/customizing-your-seo-patterns

## Search Console

Connect via the SEO Setup Checklist (needs a Premium plan + connected domain), or verify manually with a meta tag (Site SEO Tags API / Site Verification tool). Site Inspection in the SEO dashboard reads GSC index status.
Sources: https://support.wix.com/en/article/connecting-your-site-to-google-in-the-wix-seo-setup-checklist , https://support.wix.com/en/article/using-the-wix-seo-dashboard-to-improve-your-sites-seo

## Canonical hygiene (GatorBait)

One canonical article URL per story (LESSONS #8). Consolidate duplicates with a 301 to the canonical post and point all distribution there. Never duplicate a post to make it appear in a second package.
