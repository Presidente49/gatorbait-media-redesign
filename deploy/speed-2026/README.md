# Speed 2026: what was slow, what changed, what is left

Brenden, Sept. 30: "It feels like everything's a little slow. Optimize... dispatch someone to look at the dashboard settings and speed... SEO, all that stuff."

## The measurements (real browser, production, Sept. 30 ~2:15 p.m. ET)

`automation/vision/live-shots.mjs` gained a `PERF=1` mode (PR #98): Lighthouse-like throttling (phone 1.6 Mbps / 150 ms RTT / 4x CPU; desktop 10 Mbps / 40 ms), then TTFB, FCP, LCP, CLS, long tasks, total blocking time, when our front page mounted, and every request by host and kind. Raw numbers: `perf-home-before-fba3a35.json` (run 36757168414).

| Homepage, build fba3a35 | Phone 390 | Desktop 1365 |
|---|---:|---:|
| First paint | 1.1 s | 0.2 s |
| Our front page mounted | 8.0 s | ~1.5 s |
| Largest paint (the lead cover image) | **27.9 s** | 4.6 s |
| Total blocking time | 2.1 s | 0.4 s |
| Requests / bytes | 180 / 4.07 MB | ~180 / 4.0 MB |
| Images | **2.43 MB** | 2.34 MB |
| Wix scripts (parastorage) | 1.0 MB | 1.0 MB |
| Our bundle (jsDelivr, gzip) | 67 KB + 44 KB tsParticles | same |

**The one big cause:** the blog feed hands the renderer image URLs that ask Wix for a 1000 px **PNG** cut of a JPEG photo (`/v1/fit/w_1000,h_1000,al_c,q_80/file.png`). The lead cover came back as 975 KB and one card as 1,018 KB. On a throttled phone those two files alone took 20 seconds, and the lead is the largest paint on both profiles.

Second tier: the 44 KB tsParticles library (Swamp Night embers) rode with the first paint; 70 KB of the bundle was dead on the homepage (fan modules with no Workers, the Story Kit that only runs on stories); nothing was minified; the 200 KB header logo webp is served at 900 px for a 250 px slot; two Google Fonts stylesheets load (one from embed 0709a98e, one from the renderer).

Story page (`/post/…`, run 36757172752): phone total blocking time **7.7 s**, 166 long tasks (16 s of main-thread work), LCP 23.9 s, CLS 0.28; desktop TBT 0.4 s. Story pages carry no big images; their cost is main-thread work during Wix blog hydration, where our own embeds run seven document-wide MutationObservers and short polls (next step 3 below). Raw numbers: `perf-story-before-fba3a35.json`.

Image-cut probe (run 36758186268, `deploy/covers/probe-logo.html`): Wix honors `enc_auto` cuts. The same cover at 800 px: **975 KB → 44 KB**; the same card at 480 px: **1,018 KB → 18 KB**; the header logo webp at 500 px: **200 KB → 26 KB**.

Three read-only audits back this up: `wix-inventory.md` (58 custom embeds, 28 enabled, 219 KB injected on every page, no page filters, seven document-wide MutationObservers), `external-audit.md` (SEO and search visibility), `bundle-analysis.md` (byte-level breakdown of our own code).

## What shipped (PR #99, our code only, deployed through `sports-live/current.json`)

- **Images:** every static.wixstatic.com image is re-cut to the box it fills with `enc_auto` (Wix picks AVIF/WebP) and a 480/800/1200 srcset; the feed's original URL stays on the element and comes back if a re-cut ever fails.
- **Bundle:** fan modules moved to `sports-live/fan-modules.js`, fetched only once `deploy/cloudflare/endpoints.json` names a Worker; Story Kit dropped from the homepage bundle (it stays in `share.js` for story pages); esbuild minification of all three outputs. homepage.js 244 KB → 138 KB raw, 69 KB → 40 KB gzip; share.js 65 → 42 KB raw, 21 → 14 KB gzip.
- **Embers:** tsParticles loads after the page settles (1 s plus an idle slot) and never on data-saver or 2G/3G.
- **Fonts:** the renderer skips its own Google Fonts link when a sitewide Barlow + Barlow Condensed stylesheet is already in `<head>` (for the loader change below).

Rollback: point `sports-live/current.json` back to fba3a35.

## Still to do, in order

1. **Header logo** (Wix embeds `7fee4de6` and the mobile shell `fdc2127a`): serve the 900 px webp at 500 px via a Wix cut (`/v1/fill/w_500,h_134,al_c,q_85,enc_auto/gatorbait.webp`, verified 26 KB).
2. **One font chain in `<head>`** from the Home Code loader (preconnect jsDelivr, GitHub Pages, fonts.gstatic; one Barlow stylesheet), then retire the second link in embed `0709a98e`.
3. **Story pages:** quiet our embeds' document-wide observers and polls (Site Fixer, Inner Page UI layer, normalizer, wide canvas, roster links, News SEO, FB ViewContent, header): scope them to the post container and disconnect when done. Each is one embed PATCH with its `-live.html` as rollback.
4. **Wix side, Brenden only:** Site Speed report and Search Console vitals; uninstall Hotels, Restaurants x2, Events; Blog settings (comments default, related posts, gallery list layout); GTM container contents (possible GA4 double-fire with the gtag embed).
5. **SEO** (`external-audit.md` section 3): story meta descriptions at 155 chars, Person author in the native JSON-LD, category page titles, the homepage "Today's Edition" heading (Editor, Brenden), sitemap index response time.
