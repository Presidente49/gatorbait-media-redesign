# Google News / Search readiness, Oct. 18, 2026

Wix REST only (SEO Patterns, Item SEO Tags, SEO Redirects). No Editor, no site publish, no embeds touched.

| # | Surface | Before | After | Rollback |
|---|---|---|---|---|
| 1 | SEO pattern BLOG_POST | title `{{blog-post.title}} | Florida Gators News | GatorBait`; description = excerpt + 71-char boilerplate; JSON-LD BlogPosting, publisher without logo | title/og:title/twitter:title `{{blog-post.title}} | GatorBait`; description = excerpt; NewsArticle JSON-LD with author url, image, publisher NewsMediaOrganization + logo (BlogPosting block from Wix default still renders) | `rollback/BLOG_POST-pattern-before.json` (PATCH body) |
| 2 | Item SEO tags BLOG_POST `1f6355ab-7c5a-4e5f-8423-09cbb6a6e2ea` | description override only | + og:image, twitter:image (site default photo) | PATCH tags = description only |
| 3 | Item SEO tags BLOG_POST `fc9320fa-77d9-4223-ab3c-4f507fb3c5b5`, `ff634071-5ee7-4c9f-985a-ba197369733f` | no overrides | og:image, twitter:image | POST `/promote/seo/v1/item-seo-tags/BLOG_POST/{id}/reset-to-default` |
| 4 | Redirect `/news-sitemap.xml` -> `/blog-feed.xml` | 404 | 301, id `fa582fe6-8730-45f9-86f7-ddd1c567f17f` | DELETE `/seo-redirects-service/v1/redirects/fa582fe6-8730-45f9-86f7-ddd1c567f17f` |

`BLOG_POST-pattern-after.json` is the first applied body (schemaType news-article-preset); the live pattern keys the NewsArticle script to `blog-post-blog-posting-preset`.
