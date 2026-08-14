# GatorBait Media Content Preservation Inventory

**Date:** 2026-08-14
**Wix site:** `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`

## Published article baseline

Wix Blog reports **4,443 published posts**.

This is the primary reason the Studio migration must preserve Wix Blog in place. The migration is a frontend/editor modernization, not an article-export/import project.

## Blog category baseline

Wix Blog reports **25 categories**.

| Category | Published posts | Current category slug |
|---|---:|---|
| Gator Recruiting | 1,362 | `gator-recruiting` |
| Gator Football | 761 | `gator-football` |
| Featured Article | 651 | `featured-article` |
| Gator Basketball | 628 | `gator-basketball` |
| Gatorbait Magazine | 604 | `gatorbait-magazine` |
| Franz Beard - Blog | 415 | `franz-beard-blog` |
| Gator Breaking News | 376 | `gator-breaking-news` |
| Thoughts Of The Day | 300 | `thoughts-of-the-day-franz-beard-1` |
| Buddy's Blog | 203 | `buddy-s-blog` |
| Gator Baseball | 143 | `gator-baseball` |
| Gator Spring Football | 54 | `gator-spring-football` |
| Gator Softball | 49 | `gator-softball` |
| The Buddy Martin Show | 44 | `the-buddy-martin-show` |
| Gator Gymnastics | 40 | `gator-gymnastics` |
| Gators in The NFL | 20 | `gators-in-the-nfl` |
| Gator Women's Basketball | 10 | `gator-women-s-basketball` |
| Loren Meadows - Blogs | 10 | `loren-meadows-blogs` |
| Kyle Curtis - Sweet Sixteen | 7 | `kyle-curtis-sweet-sixteen` |
| Gator Tennis | 5 | `gator-tennis` |
| Carlton Reese | 5 | `carlton-reese` |
| Gator Track & Field | 4 | `gator-track-field` |
| NCAA Transfer Portal | 4 | `ncaa-transfer-portal` |
| Gator Golf | 2 | `gator-golf` |
| Rob Browne SEC Sidelines | 1 | `rob-browne-sec-sidelines` |
| SEC Media Days 2026 Tampa | 1 | `sec-media-days-2026-tampa` |

## URL architecture

Current category pages resolve below:

`/gatorbait-media-blogs/categories/<slug>`

These category URLs already have material search history and many categories have current 2026 SEO titles, descriptions and cover images. Preserve the existing category slugs during the Studio rebuild unless a redirect plan demonstrates a clear SEO benefit.

## Editorial identity represented in categories

The current Blog structure explicitly preserves editorial lanes for:

- Buddy Martin
- Franz Beard
- Loren Meadows
- Kyle Curtis
- Carlton Reese
- Rob Browne / SEC Sidelines

The Studio information architecture may simplify what appears in primary navigation without deleting the underlying editorial categories or URLs.

## Migration rules

1. Keep Wix Blog as the content authority.
2. Do not bulk export/import 4,443 posts into a replacement CMS.
3. Preserve existing `/post/...` URLs and category slugs.
4. Preserve author/member relationships and article publication dates.
5. Preserve original photography/media relationships.
6. Apply the new editorial presentation through Studio templates/components rather than rewriting archive content.
7. Do not auto-gate currently free articles.
8. Future premium content should use Wix Blog/Pricing Plans entitlement features without changing the free-content-first strategy.
9. Category navigation may be consolidated visually, but legacy category URLs remain valid unless individually redirected with evidence.
10. Before Studio cutover, compare the live Studio branch article/category counts with this baseline.

## Cutover acceptance baseline

The Studio version is not eligible for production if:

- published post count is materially lower than 4,443 without an explained publication change;
- high-volume category URLs fail;
- author/category attribution is lost;
- post canonicals change unexpectedly;
- article images, captions or publication metadata disappear.
