# GatorBait Media Editorial Template Design

**Date:** 2026-08-05  
**Status:** Approved design direction; implementation not started  
**Owner:** Brenden Martin  
**Site:** https://www.gatorbaitmedia.com  

## 1. Decision Summary

GatorBaitMedia.com will receive a premium digital-magazine presentation while remaining the primary news and subscriber hub. A separate GatorBait Magazine property may remain a future project.

The approved visual direction is:

- The Athletic-style restraint, readability and editorial hierarchy.
- Sports Illustrated-style emphasis on original photography.
- No ESPN-style broadcast graphics, visual chrome or high-noise sports UI.
- Florida orange and blue used as controlled accents, not dominant decoration.
- Gradual rollout through a reusable template system rather than a sitewide visual rewrite.

## 2. Goals

1. Make GatorBaitMedia.com feel like a credible digital sports magazine rather than an aging Wix blog.
2. Create a repeatable editorial template that can be used for new coverage without manually redesigning every story.
3. Improve hierarchy, readability, photography presentation, mobile behavior and perceived editorial authority.
4. Preserve subscriber continuity, existing URLs, Wix Blog infrastructure and current publishing workflows.
5. Maintain AP-style journalism, correct attribution, fact verification and strong SEO defaults.
6. Build a foundation for multiple editorial story types without overengineering the first release.

## 3. Non-Goals

The first release will not:

- Rebuild the entire website.
- Replace Wix Blog.
- Bulk-convert the full archive.
- Introduce ESPN-style graphics or broadcast overlays.
- Create a separate magazine website.
- Depend on custom fonts that create licensing, privacy or performance problems.
- Publish unverified photo credits, player information or scheduling details.

## 4. Editorial and Photography Rules

### 4.1 Writing and presentation

- AP-style sports journalism is the default for news stories.
- Headlines must be direct, accurate and search-aware without becoming clickbait.
- Decks should clarify the angle rather than repeat the headline.
- Dates, locations, names, classifications, injuries and quotes must be verified.
- Corrections and updates must preserve transparency.
- Article pages should prioritize reading flow over decoration.

### 4.2 Photography

- Chris Spears is the primary photographer whose work should define the long-term visual identity.
- Eddie Gilley and other contributors receive credit only for the specific images they shoot.
- Wix Media Manager and existing media bins are the preferred photo sources.
- Recent original photography should be used before generic graphics, stock images or outside media.
- Every image must include accurate alt text.
- Every editorial image must include a visible caption and photographer credit when that information is available.
- Images must never be stretched, distorted or cropped in a way that materially changes the journalistic meaning.

## 5. Core Article Template

The first implementation will create one dependable template for Featured Article and Gator Football stories.

### 5.1 Story header

Order:

1. Category label.
2. Large editorial headline.
3. Deck/subheadline.
4. Byline.
5. Publication date, updated date when applicable and reading time.
6. Large hero photograph.
7. Caption and photo credit.

The headline should be strong but restrained. It should not use condensed broadcast-display typography such as Bebas Neue or Impact.

### 5.2 Article body

- Narrow readable text column centered within a wider editorial canvas.
- Comfortable body size and line height on desktop and mobile.
- Serif body text or a publication-appropriate editorial serif fallback.
- Sans-serif metadata, navigation and utility labels.
- Strong H2 section headings with controlled accent treatment.
- Pull quotes used sparingly and only for meaningful verified quotations.
- Lists, links and blockquotes styled for readability rather than decoration.
- No giant dark card wrapping the entire story.

### 5.3 Supporting modules

The base template may include:

- What’s Next box.
- Related Coverage links.
- Newsletter or subscription callout.
- Inline video or official news-conference link when relevant.
- Key-stat or context box when the reporting supports it.

Each module must be optional. The story should not display empty containers.

## 6. Planned Template Variants

These will follow after the base template proves stable:

1. **Breaking News** — compact, headline-first, fast-loading.
2. **Feature / Magazine Story** — photography-led, longer-form pacing, pull quotes and deeper visual storytelling.
3. **Analysis / Column** — stronger author identity and more restrained visual treatment.
4. **Game Coverage** — opponent, score, key statistics, photography and recap structure.
5. **Photo Essay** — gallery-led experience built around original photography and captions.

The first release will not implement all five. It will only ensure the base design can support them later.

## 7. Technical Architecture

### 7.1 Wix layer

- Keep Wix Blog as the content system.
- Use Wix Blog rich content for article structure.
- Use site-level CSS or custom embeds only where selectors are stable and scoped.
- Avoid brittle selectors that can unintentionally restyle unrelated Wix apps.
- Preserve the current site header, footer, member area and subscriber workflows during the first release.

### 7.2 Editorial styling layer

Create a versioned editorial stylesheet focused on single-post pages. It should:

- Scope styles to Wix Blog post pages.
- Define headline, deck, metadata, body, heading, caption, pull-quote and module tokens.
- Include desktop, tablet and mobile breakpoints.
- Preserve accessibility contrast.
- Avoid global `p`, `h1`, `article` or broad wildcard rules that affect unrelated site pages.

### 7.3 Content conventions

The publishing workflow should provide consistent rich-content order and labels so the stylesheet can render predictable layouts.

Required fields for premium stories:

- Title.
- Excerpt/deck.
- Author or staff byline.
- Category.
- Publication date.
- Hero image.
- Alt text.
- Caption.
- Photo credit.
- SEO title.
- Meta description.
- Canonical slug.

## 8. SEO Requirements

The redesign must preserve or improve:

- Existing canonical URL.
- Unique SEO title.
- Unique meta description.
- Open Graph title, description and image.
- Twitter/X large-image metadata.
- NewsArticle structured data.
- Correct `datePublished` and `dateModified`.
- Author and publisher attribution.
- Image metadata and alt text.
- Internal links to relevant GatorBait coverage.
- Descriptive anchor text.
- Mobile performance and layout stability.

The design must not hide critical story text inside images, scripts or non-indexable widgets.

## 9. Rollout Strategy

### Phase 1: Prototype

- Use the Aug. 5, 2026 fall-camp article as the first prototype.
- Apply the new template treatment without changing its URL.
- Confirm the correct Eddie Gilley credit for that specific image.
- Evaluate desktop and mobile rendering.

### Phase 2: Controlled production use

- Apply the template to new Featured Article and Gator Football stories.
- Prefer Chris Spears photography from current media bins where editorially appropriate.
- Record rendering, SEO and publishing issues.
- Refine the template based on real stories.

### Phase 3: Expansion

- Add approved variants.
- Selectively upgrade high-value archive stories.
- Expand to recruiting, basketball, baseball and other categories after compatibility is proven.

No automatic archive-wide restyling will occur before Phase 2 is stable.

## 10. Testing and Verification

### 10.1 Visual checks

- Desktop widths at approximately 1440, 1280 and 1024 pixels.
- Tablet around 768 pixels.
- Mobile around 390 and 430 pixels.
- Headline wrapping.
- Hero-image aspect ratio and crop.
- Caption and credit visibility.
- Body line length and spacing.
- Pull-quote behavior.
- Embedded video behavior.
- Related and subscription modules.

### 10.2 Functional checks

- Existing post URL remains valid.
- Header and footer remain visible.
- Comments, categories, author links and social sharing continue to work.
- Subscriber/member flows are unaffected.
- No unrelated Wix page receives article-specific styling.

### 10.3 SEO checks

- Page title and meta description match the article.
- Canonical URL is unchanged.
- Hero image appears in social previews.
- NewsArticle schema is valid and uses real publication data.
- No duplicate schema injector overrides accurate Wix metadata.
- No misleading author or photo attribution appears.

## 11. Error Handling and Rollback

- New styles must be versioned.
- The prototype must be reversible by disabling one Wix custom embed or restoring one prior stylesheet.
- Existing CSS must be backed up before any production change.
- If Wix selectors are unstable, prefer a narrowly scoped Velo or page-specific approach rather than broader global CSS.
- If a premium field is missing, the article should degrade cleanly to a standard article layout.

## 12. Acceptance Criteria

Phase 1 is successful when:

1. The fall-camp article presents as a premium editorial story on desktop and mobile.
2. Original photography is prominent and correctly credited.
3. Typography and spacing resemble a restrained digital magazine rather than a broadcast sports site.
4. The article URL, metadata, comments, categories and publication state remain intact.
5. SEO title, meta description, social image and NewsArticle data are correct.
6. No unrelated Wix page or app is visually broken.
7. The styling can be reused for the next Featured Article without rebuilding it manually.

## 13. Superseded Direction

Older repository references to an “ESPN+/Athletic” visual direction are historical and no longer control the redesign. The approved direction is The Athletic-style editorial restraint with Sports Illustrated-style original photography.
