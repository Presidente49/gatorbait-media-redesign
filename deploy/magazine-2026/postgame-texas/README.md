# Postgame Edition: Florida 27, No. 7 Texas 24 (Oct. 17, 2026)

Built Oct. 18, 2026 (UTC) from the pregame print pipeline. **Nothing is live.** No Wix upload, page, embed or blog change, no email, no automation. PR only.

## Rebuild

```
node deploy/magazine-2026/postgame-texas/build-print.mjs /tmp/postgame.html
PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node tools/magazine-pdf/render-pdf.mjs /tmp/postgame.html print-stage/gatorbait-magazine-texas-postgame-2026-10-18-print-v1.pdf
```

`build-print.mjs` pulls the house CSS out of `tools/magazine-pdf/build-print.mjs` (US Letter, Barlow and Barlow Condensed, Gator blue and orange) so the two cannot drift, and adds only this issue's page layouts. All words and numbers are in `content.mjs`. The cover is `art/cover.html` rendered to `art/cover.jpg` (1102x1427 at 2x), same recipe as the pregame cover.

## Pages (v2, 21, US Letter; rebuilt Oct. 18 from the live Wix posts)

1. Portrait cover (deploy/postgame-cover-20261018/postgame-cover-1200x1600.jpg, PR #363)
2-5. Franz Beard, "The Gators Sucked Less..." (post 68866a65)
5-7. Franz Beard, "It was a good day for an exorcism in Austin" (c16d53be; "83 points")
8-9. Buddy Martin, "Deep In The Heart Of Texas..." (f71f1821)
10-12. Buddy Martin, "A Texas Barbecue" (6e802f31)
13. AP Top 25, Oct. 18 (5c70943f): Florida No. 20, Texas 19, Georgia 5, Miami 1
14-15. Loren Meadows, Postgame Thoughts (bba317f0; LaNorris Sellers)
16. Game story (fc2ce412), 17. Score by score, 18. Box score
19. Postgame voices (Baugh, Sumrall, Jones; clip titles and published quotes)
20. What's next: Georgia, Oct. 31, 3:30 p.m. ET, ABC, Mercedes-Benz Stadium; open date Oct. 24; Georgia No. 5 per AP
21. Masthead

Articles are in content.mjs and articles2.mjs; build:
`node deploy/magazine-2026/postgame-texas/build-print.mjs /tmp/pg.html` then
`PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node tools/magazine-pdf/render-pdf.mjs /tmp/pg.html print-stage/gatorbait-magazine-texas-postgame-2026-10-18-print-v2.pdf`.
Print edits: Franz's Auburn-Georgia result drops the stale "No. 1" label; a closing quote mark is added to Sumrall's first quote in Franz's column. No placeholders remain.

## Rollback

Nothing is live, so there is nothing to roll back. Close the PR or delete branch `agent/mag-postgame-20261018`. The only generated artifact is `print-stage/gatorbait-magazine-texas-postgame-2026-10-18-print-v1.pdf`.
