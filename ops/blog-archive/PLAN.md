# Blog archive and category plan (Phase 0, read-only)

Site: 18fb3a4e-d7f6-414a-aeb9-3047db3ea115. Controller: Jarvis. Owner direction: Brenden Martin, Oct. 4, 2026.
Goal: every published post has a correct topical category; every post first published before 2026-08-01 is also filed in a year archive.
Out of scope: `pricingPlanIds` (paywalls) are never changed.

## 1. Inventory (live read, Oct. 4, 2026)

Published posts: **4,597**. Posts with no category: **1,437 (31%)**.

| Year (firstPublishedDate) | Posts | No category |
|---|---|---|
| 2019 | 273 | 66 |
| 2020 | 511 | 147 |
| 2021 | 559 | 125 |
| 2022 | 620 | 214 |
| 2023 | 955 | 44 |
| 2024 | 620 | 279 |
| 2025 | 570 | 417 |
| 2026 | 489 | 145 |

Categories per post: 0 → 1,437; 1 → 1,508; 2 → 935; 3 → 382; 4 → 254; 5 → 60; 6 → 14; 7 → 7. Wix allows 10 per post, so a year category always fits.

Categories (21 of the 100-per-language limit):

| Label | Slug | Posts |
|---|---|---|
| Gator Recruiting | gator-recruiting | 1,363 |
| Gator Football | gator-football | 857 |
| Featured Article | featured-article | 700 |
| Gator Basketball | gator-basketball | 634 |
| Gatorbait Magazine | gatorbait-magazine | 621 |
| Franz Beard - Blog | franz-beard-blog | 427 |
| Gator Breaking News | gator-breaking-news | 405 |
| Thoughts Of The Day | thoughts-of-the-day-franz-beard-1 | 305 |
| Buddy's Blog | buddy-s-blog | 238 |
| Gator Baseball | gator-baseball | 143 |
| Gator Spring Football | gator-spring-football | 54 |
| Gator Softball | gator-softball | 49 |
| The Buddy Martin Show | the-buddy-martin-show | 48 |
| Gator Gymnastics | gator-gymnastics | 40 |
| Jon Sumrall | jon-sumrall | 25 |
| Loren Meadows - Blogs | loren-meadows-blogs | 21 |
| Gators in The NFL | gators-in-the-nfl | 20 |
| Aaron Philo | aaron-philo | 10 |
| Eddie Gilley - Blog | eddie-gilley-blog | 6 |
| Carlton Reese | carlton-reese | 6 |
| SEC Media Days | sec-media-days | 1 |

Sample (oldest 100 posts): uncategorized 2019 items include Gators track and field, UAA budget, Q&As, Franz Beard "Thoughts of the Day" and Buddy Martin's Blog columns. All are routable to existing categories.

## 2. Best practices applied

Wix limits (Categories API docs): up to 100 categories per language, up to 10 per post. Category pages have their own title and SEO fields (the existing categories already carry SEO titles), and categories show in the Category Menu in creation order.

News-site taxonomy practice:
- One primary topical category per post, with additional categories only where a story truly spans topics.
- Descriptive labels and stable slugs. Do not rename existing categories; renames break indexed URLs.
- Avoid thin or duplicate taxonomy pages. Each year page must hold the full year's archive; no category for a year with few posts.
- Year archives are a navigation aid, not a topic. They should not outrank topical pages, so give them unique SEO titles and descriptions and keep them out of the main category menu.
- Tags are for people and opponents, existing tags only.

## 3. Taxonomy plan

Keep the 21 existing topical categories as primary. Create one year archive per past year, labeled "Archive YYYY", slug `archive-YYYY`, with a short SEO description:
- Archive 2019, 2020, 2021, 2022, 2023, 2024, 2025.
- **Archive 2026** for posts first published Jan 1 to Jul 31, 2026 (everything before 2026-08-01 must be archived; this is the one interpretation call, flagged for Brenden). Posts from Aug 1, 2026 on get no archive category.
- 8 new categories total, 29 of 100. No others.

Routing rules for uncategorized and thin posts:
- Football (any year), including recruiting-only items about football: Gator Football; add Gator Recruiting for recruiting stories.
- Basketball, baseball, softball, gymnastics, other sports: the matching sport category. Track and field, swimming and other Olympic-sport items with no matching category: Gator Breaking News (no new category).
- Buddy Martin column: Buddy's Blog. Franz Beard "Thoughts of the Day": Thoughts Of The Day. Other staff columns: the matching author category where one exists.
- Magazine features: Gatorbait Magazine.
- Posts that match nothing clearly: Gator Breaking News as the fallback, and list them in a review file rather than guessing.

## 4. Flags (no action taken)

- **Featured Article** (700 posts) is a presentation label, not a topic; it is not counted as a topical category. It is left as is.
- **Eddie Gilley - Blog** (menu position -1) and **Carlton Reese** (6 posts each) are author-only buckets with tiny counts; thin pages.
- **SEC Media Days** has 1 post; thin.
- **Thoughts Of The Day** has slug `thoughts-of-the-day-franz-beard-1`, which is a leftover duplicate-style slug.
- "Franz Beard - Blog" and "Thoughts Of The Day" overlap heavily (both Franz Beard); possible merge for Brenden to decide.
- Creating the eight archive categories would add them to the Category Menu automatically; they should be hidden from the menu there (needs a decision or Editor step; the REST API has no confirmed menu-visibility switch).
- The latest #34 byline rule is respected: no post is ever set to member `16433bab`.

## 5. Safety gates (every batch)

1. Query automations (trigger `wix_blog-new_blog_post`); both `5006baf5-fbbf-440c-a012-a09bdbd95fc9` and `824714d4-7e31-4b1d-95b2-ccec04d788af` must be INACTIVE or all writes stop.
2. Skip drafts with `hasUnpublishedChanges` true and posts published in the last 2 hours.
3. One `UPDATE_PUBLISH` PATCH per post with a minimal fieldMask. Rollback line goes to `ops/blog-archive/rollback.jsonl` before each change. Progress in `progress.json`, pushed every 100 posts.
4. Never touch title, slug, body meaning, byline, `firstPublishedDate`, `pricingPlanIds`.
