# GatorBait standalone newsroom preview

This is the approved clean-newsroom direction from Sept. 13, 2026, kept separate from the live Wix page so it can be tested without fighting Wix layout layers.

## What is automatic

- `data/posts.json` is the homepage story source.
- `app.js` always sorts by `firstPublishedDate` descending.
- The newest story becomes the lead automatically; the next four fill **Latest**; the next three fill **Inside GatorBait**.
- `.github/workflows/refresh-newsroom-feed.yml` checks the public Wix Blog RSS feed every five minutes and commits only when the published-story set changes.
- Open previews poll `data/posts.json` every five minutes, so an already-open page can move a newly published story into the lead without a manual rebuild.

## DIIB / search-performance work carried into this build

The Sept. 13 DIIB snapshot reported authority 23/100, 63 ranking keywords, 1,785 backlinks, 849 indexed pages and Core Web Vitals needing work. SPF was already configured correctly.

This frontend directly addresses the part a redesign can control:

- no remote web-font download;
- one small local stylesheet and one deferred local script;
- explicit image dimensions/aspect ratios to reduce layout shift;
- lead image uses `fetchpriority="high"` and eager loading;
- lower-page images use native lazy loading and async decoding;
- below-fold sections use `content-visibility:auto`;
- visible 16:9/16:10 editorial image boxes;
- accessible focus states and reduced-motion handling;
- semantic headings/navigation/footer;
- `max-image-preview:large` in robots metadata;
- a single `NewsMediaOrganization` schema on the homepage (no duplicate `NewsArticle` schema);
- canonical points at the production GatorBait domain;
- preview remains `noindex` until an actual cutover, preventing a duplicate-content test URL from competing with production.

## Other Sept. 13 priorities that remain backend/Wix work

The separate handoff also flagged newsletter audience targeting, opt-in consent, duplicate/incomplete form systems, a real welcome email, the broken member account route/public member directory, payment-fraud controls and the `joey freshwater` search-result title/meta opportunity. Those should be handled in their owning Wix/email/payment systems rather than hidden inside frontend CSS.

## Verified social destinations

- Facebook: https://www.facebook.com/gatorbaitmedia
- YouTube: https://www.youtube.com/@GatorBaitMedia?sub_confirmation=1
- Merchandise: https://gatorbait2026.itemorder.com/shop/home/

## Production cutover gate

Before pointing the primary domain at this frontend, change the robots directive from `noindex` to `index`, run mobile checks near 390 px and 430 px, confirm the newsletter/signup flow, and re-run Core Web Vitals against the deployed origin.
