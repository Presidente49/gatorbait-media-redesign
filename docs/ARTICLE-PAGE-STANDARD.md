# GatorBait Article Page Standard

Updated: 2026-09-16

## Purpose

Make every GatorBait story read like a modern professional sports publication while keeping native Wix Blog as the production system. Borrow proven editorial patterns; do not clone The Athletic, ESPN, The New York Times, or another publisher pixel-for-pixel, and do not introduce a replacement frontend just to restyle article pages.

This document is the default article-page contract for Wix, repo previews, agents, and future redesign work.

## Reference pattern

Use the strongest common patterns found across established publisher systems and maintained open-source editorial projects:

- BBC Simorgh: accessible, resilient article hierarchy.
- Wagtail news template: strong lead-story and related-story hierarchy.
- Netlify `nextjs-blog-theme` (MIT): narrow readable prose column, explicit SEO component, responsive post layout, previous/next navigation. Use as a pattern reference only; do not install it into Wix.
- Native Wix Blog: production content model, routing, schema, categories, tags, author records, comments and publishing lifecycle.

The goal is a familiar premium sports-publication experience, not a framework migration.

## Article anatomy

Order the page like this:

1. **Section/kicker** — short category label above the headline.
2. **Headline** — strong H1; visually dominant, left-aligned on article pages.
3. **Deck/excerpt** — one concise paragraph explaining what the reader will get.
4. **Byline row** — author name, author role, publish time, modified time when meaningful.
5. **Author/follow treatment** — author name must be clickable when a valid writer profile exists. Site-follow behavior must remain separate from email/SMS marketing consent.
6. **Share tools** — compact, familiar controls; no floating clutter over text.
7. **Hero image** — authentic photography first; use a consistent landscape treatment where source material allows. Never stretch a portrait image to fake landscape.
8. **Caption + credit** — identify subject, event/context and source/photographer when known.
9. **Article body** — readable prose column, approximately 680–760 px on desktop; generous line-height; normal paragraph rhythm; clear H2/H3 hierarchy.
10. **Context/revenue module** — newsletter, membership or relevant product CTA only when it naturally fits the story.
11. **Related stories** — 2–3 genuinely related stories, not a generic feed dump.
12. **Author card** — short bio/profile/follow treatment where available.
13. **Next/previous or latest stories** — compact continuation path at the bottom.

## Typography and spacing

- Desktop body copy should feel editorial, not dashboard-like.
- Target article body: 18–20 px copy, comfortable line-height, roughly 65–75 characters per line.
- Mobile article body: 17–19 px with no horizontal scrolling.
- Headline should wrap naturally and must not clip at 390 px viewport width.
- Avoid pale-blue headings, excessive cards, gradients behind body copy, oversized rounded containers and app-dashboard visual language.
- Use whitespace and hierarchy rather than decorative chrome.

## Images

Every meaningful image must have:

- accurate alt text,
- known or approved source/rights status,
- caption/credit when available,
- no AI-generated replacement when authentic photography exists,
- sensible crop behavior for mobile and desktop.

Search the Wix Media Manager before generating or sourcing a replacement image. Filenames are not reliable metadata; search likely names, subjects, event terms and existing photo-series prefixes.

### Text-bearing hero art

Text embedded inside hero artwork needs a stricter mobile gate than ordinary photography.

- Never assume a 16:9 desktop graphic can be center-cropped safely on a phone.
- At 390 px and 430 px, verify that headline/logo/sponsor marks embedded in the art remain fully readable.
- If the module uses object-fit: cover, set an intentional focal position or create a mobile-safe crop.
- If safe cropping is impossible, use a contained/full-image treatment rather than cutting off words.
- A screenshot showing clipped text is a publication defect and should be corrected immediately.
- The final Wix hero/cover asset and the live article render both need verification; checking the source image alone is insufficient.

## SEO and structured-data gate

A post is not publication-complete until all of these are checked:

- SEO title is concise and useful; do not simply repeat an overlong on-page headline.
- Meta description is complete, typo-free and useful out of context.
- Up to five focus keywords are set when appropriate.
- Canonical URL resolves correctly.
- Open Graph title/description/image are sensible.
- Twitter/social share image is usable.
- Every meaningful image has alt text.
- Wix-generated JSON-LD is inspected before adding custom schema.
- Do **not** add duplicate JSON-LD when Wix already renders a valid NewsArticle/Article/BlogPosting schema.
- Generated schema author name must not be blank; if it is blank, fix the underlying writer/profile mapping or use the narrowest safe per-item override.
- Headline/description values inside resolved schema should not be truncated by bad source metadata.

## Writer submission rule

Do not assume writers completed metadata, categories, tags, images, SEO, schema, distribution or commerce links.

For **Franz Beard** in particular, treat the submitted story as editorial copy that still requires a full production pass. This is not criticism of the writer; it is an explicit workflow assignment so metadata work has a clear owner.

The production agent must verify:

- author identity,
- headline/deck,
- primary editorial home,
- category and tags,
- hero image and alt text,
- caption/credit,
- SEO title/description/keywords,
- resolved schema,
- related stories,
- email status,
- approved social-distribution status.

## Franz Beard / The Golden Season rule

Store product:

- Product: **The Golden Season — by Franz Beard**
- Wix product ID: `92c8f963-c9f5-4e4d-894e-ade130135c9a`
- Store path: `/product-page/the-golden-season-by-franz-beard`

Use an author-specific article CTA rather than polluting every Franz story with an unrelated content tag.

Preferred treatment near the author card or after the article body:

**Franz Beard is the author of _The Golden Season_.**

Add a compact **Buy The Golden Season** link/button to the live store product. Pull price/availability from Wix when rendered or checked; do not hard-code a stale price into reusable templates.

Do not insert the book CTA into another writer's byline treatment unless the article itself is specifically about the book or Franz.

## Distribution QA

Publishing the article is only half the job.

After publication, verify:

1. Email automation/campaign status.
2. Email subject is meaningful; generic subjects such as `New Blog Post` are a failure state unless deliberately approved.
3. Social post status on the approved channels.
4. Social copy uses the canonical article URL and correct image.
5. Do not auto-publish social or send a new campaign without the owner-approved workflow required by `automation/ops-hub/policy.json` and the Marketing Director rules.
6. If distribution is missing, surface it immediately instead of assuming another automation handled it.

## Editorial-home rule

Every story has exactly one primary editorial home: **Front Page** or **Magazine**. Cross-links, related modules, author pages, email and social promotion do not create a second primary home.

## Implementation boundary

- Wix Blog remains production.
- External repositories are design/reference material unless the adoption gate in `docs/EDITORIAL-DESIGN-REFERENCES.md` is satisfied.
- Do not install a Next.js/React/Vue/Django theme into production just to obtain article styling.
- Implement the pattern with Wix-native article-page capabilities first; repo code may be used for prototypes/specs and low-risk presentation layers.
- Production changes must preserve rollback and avoid reintroducing the blank-homepage/custom-embed failure mode documented in the September 2026 incident notes.


## Continuous benchmark

Before a material article-template change, review docs/CONTINUOUS-DESIGN-BENCHMARK.md. Article design should keep improving against current sports/news competitors without replacing Wix Blog or losing GatorBait's identity.
