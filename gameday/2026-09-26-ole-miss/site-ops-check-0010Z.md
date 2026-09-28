# Site-ops check, Sept. 27, 00:10Z (read-only)

## Passing
- /blog-feed.xml: newest item is the postgame story (23:46:39Z); lastBuildDate 00:06Z.
- /gatorbait-media-blogs lists the postgame story first. Robots is "max-image-preview:standard" (no noindex).
- Postgame article: canonical set; og:title, og:description and og:image (FINAL cover, 1600x900) complete; twitter summary_large_image; modified 00:02Z.
- /shop goes to gatorbait2026.itemorder.com (merch store).
- Game band rev35 shows FINAL in the remote-browser render (23:40Z). Header and footer are complete.

## Findings
1. **Duplicate stories on the homepage** (sports-live/homepage.js, served via Home Code embed 622d8ece). This goes against the owner's "avoid redundancies" direction and the #3 rule "no duplicate cards within a surface".
   - The 2 rotating supporting cards come from `others.slice(0,6)`, which is also the Latest list, so both show twice.
   - The columnist rail's Buddy slot is the newest Buddy post, which is the lead story (a second copy).
   - The Franz slot is the Soothsayer, which is also in Latest or More from the newsroom.
   - The fix is to track what's already shown and have each rail skip it. The layout doesn't change.
2. **Stale Game Day box** in the homepage sidebar: "Kickoff is today in The Swamp ... Read the full game-day preview". The game is final. It should point to the postgame story, or be removed after game day.
3. **/signin and /login both go to /pricing-plans/subscribe** (the plans page). Returning members looking to log in land on a paywall page. Needs an owner decision: the in-page nav "Sign in" goes to /account/my-account.
4. The cookie banner covers the "Rosters & Numbers" button on phones (compliance banner; not suppressed).

## Not verifiable from this container
- NewsArticle JSON-LD (the fetcher strips scripts; the "News SEO" embed 4d3ab24a is enabled).
- Facebook pixel PageView/ViewContent. There is no network capture here, and the site is blocked by egress.
