# Site performance

## What Wix measures and where

- **Site Speed dashboard**: real visitor data from Wix Analytics (all browsers), 30-day window, plus a Lighthouse simulation. Prefer it over PageSpeed lab scores when traffic is low.
- **PageSpeed Insights / GSC Core Web Vitals**: Chrome field data (CrUX), 28-day window. The assessment "fails" unless LCP, INP and CLS are all Good, but each metric earns its own ranking boost.
- Wait about 3 weeks after a change before judging it.
Sources: https://support.wix.com/en/article/site-performance-about-core-web-vitals , https://support.wix.com/en/article/site-performance-understanding-pagespeed-insights

## What slows Wix sites (official)

- **Third-party code** (custom code, marketing tags, app scripts): add `defer`, place at body-end, remove what isn't needed, prefer Wix Marketing Integrations for GA/pixels.
- Too many apps/widgets on a page (hurts INP). Heavy galleries, videos and store widgets above the fold. Animating the LCP element (fade-ins start only after full load).
- Custom fonts on text LCP: use system fonts or WOFF2. In Studio, enable default/fallback fonts when the LCP is text in a custom font.
- CLS from ads at the top of the page. Keep AdSense slots below the fold or with reserved space.
- Wix already provides a CDN, image compression, WebP and lazy loading (can't be disabled).
Sources: https://support.wix.com/en/article/site-performance-using-third-party-code-on-your-site , https://support.wix.com/en/article/site-performance-best-practices , https://support.wix.com/en/article/site-performance-how-wix-improves-a-sites-loading-time

## GatorBait-specific

- Our homepage and Magazine are client-rendered from `/blog-feed.xml`, so their LCP depends on the feed fetch and our JS, not Wix SSR. Keep the embeds `ESSENTIAL`, keep code under the 15 KB cap, and avoid permanent polling or observers (LESSONS #5).
- One Barlow loader. Request only the weights we use (400, 500, 700, 800), with `display=swap` and a `preconnect` to fonts.gstatic.com. Duplicate Google Fonts requests across embeds are pure waste. Grep for them.
- Mobile (390/430 px) is the launch gate (LESSONS #6).
