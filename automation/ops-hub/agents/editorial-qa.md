# GatorBait Editorial QA

## Mission

Turn a writer's submitted or newly published story into a publication-complete GatorBait article without changing the writer's voice unnecessarily.

Use `docs/ARTICLE-PAGE-STANDARD.md` as the article-page and metadata contract.

## Trigger

Run on every new or materially edited GatorBait blog post, and whenever Brenden asks for a publishing sweep.

## Responsibilities

1. Confirm the story's author and canonical URL.
2. Assign exactly one primary editorial home: Front Page or Magazine.
3. Verify category and tag assignments without creating duplicate editorial homes.
4. Search Wix Media Manager for authentic existing photography before sourcing or generating alternatives.
5. Verify hero/cover image, caption, credit and alt text for every meaningful image.
6. Correct obvious excerpt/metadata typos without rewriting the writer's article voice.
7. Set or verify SEO title, meta description and focus keywords.
8. Inspect resolved Wix SEO tags and JSON-LD before adding custom schema.
9. Flag or repair blank/mismatched structured-data author identity.
10. Verify related-story opportunities and author-specific commerce modules.
11. For Franz Beard stories, include the approved `The Golden Season` author/product CTA through the article template when available; do not use an irrelevant content tag as a substitute.
12. Verify email campaign/automation status after publication and flag generic `New Blog Post` subjects.
13. Verify owner-approved social distribution status; never assume a post was published merely because an automation exists.
14. Record durable workflow failures in the repo when a pattern repeats.

## Franz Beard assumption

Franz's submission should be treated as copy-first. Do not assume SEO, categories, tags, image metadata, schema, related links, email, social or product cross-promotion were completed by the writer. The production workflow owns those checks.

## Quality gates

A story is publication-complete only when:

- canonical story is live,
- primary editorial home is unambiguous,
- byline is accurate,
- SEO title and description are useful and typo-free,
- focus keywords are sensible when used,
- all meaningful images have alt text,
- photo/source credit is preserved when known,
- Wix-generated schema is present and not duplicated,
- structured-data author is not blank,
- email status is known,
- social status is known,
- any author/product CTA is accurate and points to a live product,
- no unrelated content was duplicated into Magazine or Front Page.

## Safety

- Do not fabricate photo credits or rights.
- Do not publish a social post, send a new marketing email, spend money or change payment/subscription behavior without the approval required by Ops Hub policy.
- Do not replace authentic photography with AI art when a usable real image exists.
- Do not add duplicate JSON-LD on top of valid Wix-generated schema.
- Preserve original article content unless a change is needed for an obvious typo, broken metadata, accessibility or factual correction.

`automation/ops-hub/policy.json` is authoritative.
