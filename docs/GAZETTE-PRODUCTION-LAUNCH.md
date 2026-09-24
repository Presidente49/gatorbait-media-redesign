# Gazette production launch

Work item #31. Brenden explicitly authorized taking the original Gazette rebuild live and then checking it on September 22, 2026.

## Prepared and verified

The production presentation package is the original compiled MIT Gazette layout and CSS, not a new imitation or iframe. Original source: ondelva/astro-theme-gazette cee215fd3ec0b78bba6f99d3a59a033b0a5f0b48; customized source build 39abf31576280c881206df625b888ba7ed91b6e7. Integration source and browser checks live on gazette-rebuild, latest verified bundle commit 77c35c9a6e980606c40ec110522c2b31fb26385b under automation/gazette and gazette-live.

Candidate run 35797052112 passed 63/63 public-Wix runtime assertions with the candidate explicitly substituted in disposable browsers. Chromium phone views and WebKit retain Wix's 320px logical mobile viewport; desktop is 1440px. One visible masthead, no horizontal overflow, 12 current story links, loaded cover, footer at the end of content, original canonical metadata, no preview noindex, one AdSense loader, working article/account/membership navigation. Screenshots were independently viewed. Candidate desktop prepaint CLS remains a startup integration concern, so the live loader must hide the obsolete canvas before the new bundle starts. No physical iPhone, authenticated billing transaction or ad revenue claim.

## Current state

Assets and publishing integration prepared; the Wix production switch and unmodified post-launch check must be recorded below before calling the launch complete.

## Safe switch

Replace existing Wix loader fdc2127a-845a-4d02-b711-438f1a4a86ce, not a parallel embed. Preserve its unified mobile menu and account stylesheet. Exact disabled rollback copy: dd2b9790-a520-4000-baca-0fac9f18871a revision 1, copied from active loader revision 54 and verified byte-for-byte. Do not enable both loaders.

Keep native /post/, /magazine, /account/my-account and /pricing-plans pages and current store, email, Google and consent owners unchanged. Gazette homepage story links go directly to canonical Wix articles, not the noindex preview excerpt routes.

## Content freshness

Reuse the existing refresh-newsroom-feed.yml workflow and one RSS request. Gazette gets the complete public feed at gazette-live/posts.json; legacy Newsroom filtering and output remain intact. The existing five-minute schedule is unchanged. Publish only changed data; request the existing native Pages build after GITHUB_TOKEN commits because such commits do not automatically trigger Pages. No competing Pages deploy root or new scheduled worker.

Official API contract: https://docs.github.com/en/rest/pages/pages#request-a-github-pages-build

## Verification and rollback

After the single Wix switch, run automation/gazette/check_public.py in LIVE mode with no resource interception. If the new presentation fails, PATCH the existing active loader back to the disabled backup's HTML using the current revision; do not blindly enable a second loader. Preserve all existing sitemaps and preview directories. Do not change payment, DNS, consent, AdSense or GA4 configuration.
