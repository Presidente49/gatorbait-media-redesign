# SEO 2026 — story metadata records

Follows `deploy/speed-2026/external-audit.md` section 3 (fix 5: story meta descriptions, fix 7: category pages). Jarvis is the writer; claims and evidence live in GitHub issue #34.

## Batch 1 — Oct. 1, 2026, ~8:35 a.m. ET (14 posts)

- File: `story-descriptions-batch1.json` (post id + the description written).
- Path: **Item SEO Tags API**, `PATCH https://www.wixapis.com/promote/seo/v1/item-seo-tags/BLOG_POST/{postId}` with body
  `{"itemSeoTags":{"tags":[{"type":"meta","props":{"name":"description","content":"…"}}]},"fieldMask":"tags"}`.
  Read first with `GET` on the same URL: `hasOverride`, `tags` (the item's own) and `resolvedTags` (what renders, with a source such as `TAG_SOURCE_USER_PATTERN` or `TAG_SOURCE_ITEM`).
- Guard: skip any post whose read shows `hasOverride: true` or own tags; these 14 had none.
- Effect on the Blog side: the tag lands in `post.seoData.tags` and the draft post, `hasUnpublishedChanges` stays false and `lastPublishedDate` does not move. (A Blog `UPDATE_PUBLISH` PATCH does move `lastPublishedDate`; use it only when the body changes.)
- Live render: Wix's blog page cache kept serving the old excerpt for a while after the write (same lag as embed PATCHes). Verify with a fresh fetch of the page `<head>` later rather than trusting the API response.
- Rollback per post: `POST …/item-seo-tags/BLOG_POST/{postId}/reset-to-default` (the post inherits the SEO pattern again).

Rules kept: text comes from the writer's own excerpt, 155 characters or fewer, AP style, no body edits, no republish, no site publish.

## Still to do

1. The remaining ~22 of the newest 60 posts without a description, and the 3 at 156–157 chars (same path, same guard).
2. Author `Person` in the native NewsArticle JSON-LD (post author member), per audit fix 5.
3. Category page titles and descriptions (Blog Categories `seoData`), per audit fix 7.
