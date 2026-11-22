# /magazine link share and SEO tags, Nov. 3, 2026

Owner order (Brenden): the /magazine link share still showed the old Ole Miss game; fix it. Log: issue #34.

## What changed (one object: Wix static page `nh0hy` = /magazine)

Route: Item SEO Tags API, `PATCH https://www.wixapis.com/promote/seo/v1/item-seo-tags/STATIC_PAGE/nh0hy`, `fieldMask: "tags"`, `publish: true` (saves the draft, then updates the published revision; it never publishes the site). Docs: <https://dev.wix.com/docs/api-reference/business-management/seo/item-seo-tags-v1/set-item-seo-tags>. No embed, no site publish, no change to embed `1dd74333`.

New media: `d3cfa5_a91a5b6f1bb345748348c55534113854~mv2.jpg` (1200x630, 99,209 bytes, byte-identical to `magazine-share-1200x630.jpg`), uploaded from the pushed branch via the Wix MCP image upload.

| Tag | Before | After |
| --- | --- | --- |
| title / og:title / twitter:title | GatorBait Magazine \| Florida Gators Columns & Features | GatorBait Magazine \| Postgame: Georgia 27, Florida 8 (same string the loader sets as pageTitle) |
| description / og:description / twitter:description | "GatorBait Magazine has covered Florida Gators sports since 1979: columns from Buddy Martin and Franz Beard, features, and photography by Chris Spears." | "Postgame edition on Georgia 27, Florida 8: columns from Buddy Martin, Franz Beard, Eddie Gilley and Loren Meadows, plus the game story and box score." |
| og:image / twitter:image | `16b519_c22fd77f...~mv2.jpg` fill 2500x1325 (team running out, Ole Miss scoreboard) | `d3cfa5_a91a5b6f...~mv2.jpg` fill 1200x630 |
| og:image:width / height | 2500 / 1325 | 1200 / 630 |
| og:image:alt / twitter:image:alt | "Florida Gators touchdown against Ole Miss. Photo by Chris Spears, GatorBait Media" / none | "GatorBait Magazine postgame edition: Bitten in Atlanta, Georgia 27, Florida 8, with Florida coach Jon Sumrall on the sideline. Photo: GatorBait Media" |
| twitter:card | summary_large_image | summary_large_image (unchanged) |
| canonical, og:url, og:type, og:site_name | https://www.gatorbaitmedia.com/magazine, website | unchanged (default pattern) |
| JSON-LD | only the site-wide NewsMediaOrganization | NewsMediaOrganization kept; new page block `jsonld-magazine.json` (CollectionPage + Periodical + WebSite, BreadcrumbList, primaryImageOfPage) |

Crawler view after the change (facebookexternalhit, Twitterbot, Googlebot and WhatsApp user agents, no JavaScript, cache-busting query): `after-crawler-view-magazine.json`.

## Rollback

`before-nh0hy.json` holds the exact five own tags. Re-send them in one PATCH to the same URL with `{"itemSeoTags":{"tags":[...]},"fieldMask":"tags","publish":true}`. The Media Manager file can stay (unreferenced). Read the page's current tags first and keep anything another writer added.

## Weekly: what changes with each issue

The issue changes weekly; the page tags must follow it. Source of truth for the strings is `sports-live/magazine-issue-*.json` (`issue.pageTitle`, `cover.coverTitle`, `cover.score`, columns bylines).

1. Edit `issue.json` (photo file, edition, title lines, score) and run `node deploy/magazine-seo-20261103/build-share-image.mjs`. Add the new photo under `assets/`.
2. Upload the JPEG to Media Manager (1200x630, under 300 KB so WhatsApp keeps it).
3. Get `STATIC_PAGE/nh0hy`, then one PATCH with `publish: true` changing only: title, description, og:title, og:description, og:image (+ `meta` 1200x630), og:image:alt, twitter:title, twitter:description, twitter:image, twitter:image:alt and the JSON-LD `name`, `description`, `primaryImageOfPage` and `caption`. Everything else stays.
4. Verify with `python3 -I deploy/magazine-seo-20261103/crawler-view.py https://www.gatorbaitmedia.com/magazine`, then ask Brenden to re-scrape in Meta Sharing Debugger (not runnable from the cloud host).

## Not done here (outside the one-object scope), proposed

Read-only crawler view of other pages found the same Ole Miss photo (`16b519_4d80d39e264c45009a3abeba5beee4c1~mv2.jpg`, number 20 running past an Ole Miss player):

| Page | og:image source |
| --- | --- |
| Site default (Site SEO Tags `og:image`) | the Ole Miss photo; every page without its own image inherits it: /subscribe, /contact, /news-3 and the noindexed duplicate home `jqt2w` |
| Home `/` (`eabx0`) | own tag, same photo |
| Latest `/gatorbait-media-blogs` (`nu3pj`) | own tag, same photo |
| /the-buddy-martin-show, /about, /post/... | correct and different (show photo, about photo, article cover) |

Proposed fix, needs the controller to assign the objects: upload `brand-share-1200x630.jpg` (evergreen, no game photo so it cannot go stale), then (1) Site SEO Tags: Get, replace only the `og:image` value, PATCH `/promote/seo/v1/site-seo-tags` with `fieldMask: "tags"` (it replaces all tags in full, so keep description, google-site-verification, fb_admins_meta_tag, keywords); (2) Item SEO Tags `eabx0` and `nu3pj`: replace og:image, og:image:alt, `meta` width/height and add twitter:image, with `publish: true`.

Server-rendered HTML of /magazine has no `<h1>`; the loader embed (`1dd74333`, other owner) injects it in JavaScript from the issue data (`cover.headline`). SEO tags cannot add one. Google renders JavaScript; social crawlers do not need it.

## Applied Nov. 3 (controller-authorized, Brenden "approve all"): site default, homepage, Latest

New media `d3cfa5_c10f152e80fd4bb89f533b8dc8c36c1e~mv2.jpg` (= `brand-share-1200x630.jpg`). Changed: Site SEO Tags og:image (the other four site tags re-sent unchanged; before/after sets identical except the image; `site-before.json`), and on `eabx0` (home) and `nu3pj` (Latest) only og:image (+1200x630 meta), og:image:alt and an explicit twitter:image (`page-images-before.json`). Crawler view (no JS): /, /gatorbait-media-blogs, /news-3, /pricing-plans/subscribe, /contact now serve the new card; /about, /the-buddy-martin-show, /magazine and article posts keep their own images. No design, embed or site publish.
