# Legacy route retirement

Owner instruction September 28, 2026: “Those pages should not be live. We have that entire shell. Take all those legacy pages out. We have new stuff.”

Applied 37 exact Wix server redirects: Groups landing page, 9 group roots, 9 discussion lists, 9 indexed group posts, 2021 and 2022 magazine archives, public member directory, old event listing, and 5 old apparel/mug product pages. Group/member pages lead to the current homepage; old archives lead to current Magazine; old events lead to the current show page; old merchandise leads to the active ItemOrder store. Existing Projects and category redirects remain in place.

These are route retirements, not deletion of Wix page/content records. Existing article URLs, paid account/checkout routes, current shell pages and The Golden Season book offer remain intact. No full-site publish was performed. Native records may still appear in Wix-generated sitemaps until separately removed from the editor/indexing configuration. Direct old newsletter campaign links were not revoked.

`applied-redirects.json` records the exact new routes and IDs. `discovered-routes.json` records sitemap evidence and required-route exceptions. `verification.json` records independent HTTP redirect checks. Browser checks confirmed Groups to homepage and 2021 archive to the current Magazine shell.

Verification limitation at 03:42 UTC: 35 of 37 canonical URLs returned the expected HTTP redirect. `/groups` and `/2021-gatorbait-magazine` still returned cached HTTP 200 responses (`x-cache: HIT`, Age 449/418 seconds) on plain URLs; query-bearing fresh browser loads redirected to the expected current shell. Both redirect records were accepted by Wix. No claim that these two warm-cache URLs are fully cleared. The documented REST tag-cache invalidator does not clear site SSR cache; the separate Velo site-cache method needs backend execution, not an invented REST call. No unrelated editor drafts were published to force a cache reset.

Rollback: read current redirects and remove only IDs recorded here if their source and destination still match. Do not force-replace unrelated redirects or restore legacy navigation. No original records were deleted or overwritten by these additions.
