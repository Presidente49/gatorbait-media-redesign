# Sitewide font / photo / SEO pass — Sept. 28, 2026 (~03:30–04:30Z)

Brenden: "Go through every page on the site and change fonts or photos and update seo." He chose Chris Spears photos for share images and confirmed brenden@gatorbaitmedia.com is the real contact address.

## Fonts (done, live, verified)
- Removed the last Georgia/Times/Lora declarations from three live embeds, replaced with `Barlow,Arial,sans-serif`, category ESSENTIAL, published:
  - `a13b04e3` Inner Page UI Layer (modal h2) rev 1→2, 13,705 chars — repo `deploy/wix-served/split/ui-layer.html` synced, length matches.
  - `82c4ca83` TV + News Images / media hub (h1/h2) rev 18→19, 5,717 chars — repo copy `deploy/sitewide-design/current-82c4ca83-…html` had already drifted (5,521); rewritten from live, length matches.
  - `fb8963cc` Policies & Compliance (body + h1/h2) rev 2→3, 9,839 chars — no repo copy existed before; none created.
- Two other "Georgia" hits (`96ef5a04` backup stories, `756655cf` stats) are the football team, not fonts. Disabled/BACKUP embeds left alone.

## Share photos (done, live, verified)
- Sitewide default share image: 2020 `GBLogo.jpeg` → Chris Spears csp1 (19 of 75) `16b519_4d80d39e…`. Sitewide default description refreshed. Verification/admin tags preserved.
- Page-specific: Magazine csp1 (63 of 75), Buddy Martin Show csp1 (39 of 75), About csp1 (7 of 75), Home + Latest csp1 (19 of 75). All with `og:image:alt` credit. Could not visually inspect (wixstatic blocked from sandbox); chose multi-player action shots, not tight portraits.

## Page SEO (API correct; live render split — see LESSONS #47)
Written to 13 static pages; canonical values in `docs/PAGE-SEO-2026-09-28.json`:
- Contact: email typo `gatorademedia.com` → `gatorbaitmedia.com`.
- 2021 archive: removed literal "(Title)" placeholder.
- 2022 archive: dropped "@gatorbaitmedia" twitter title and a broken relative twitter:image.
- Magazine: new title/description (dropped the pipe list).
- Tags ("Blog/Tags"), Groups, Events: real titles and descriptions.
- Latest: fixed quoted/stale OG text, `max-image-preview:standard` → `large`, replaced placeholder JSON-LD ("YOUR FOUNDING DATE", "Founder Name(s)", youtube.com/channel/yourchannel, seven links to nonexistent policy pages).
- About: stale twitter description and a JSON-LD image pointing at a nonexistent /images/about-us.jpg.
- /news-3 and /projects (both redirect): noindex so they drop out of the sitemap.

A full-site publish run after these writes (to push the share image) rolled page SEO back to the Editor's copy, rolling out page by page. Two re-publish passes did not converge: consecutive live fetches return a different mix of old and new pages. Durable fix: paste the values from the JSON into each page's SEO panel in the Wix Editor once.

## llms.txt (done, verified)
- "Canonical business contact email" corrected to brenden@gatorbaitmedia.com; removed dead `/message-board` link (404). Repo: fixed the same typo in `newsroom-preview/index.html` and `docs/INCIDENT-2026-09-15-HOMEPAGE-BLANK.md`.

## Side finding
- The media-hub embed links to YouTube `@thebuddymartinshow` — that is the channel's current handle (relevant to the @GatorBaitMedia rename discussion).

# Copy desk + webmaster + design desk vs. competitors — Sept. 28, 2026 (~04:00Z)

Brenden: "roll out copy desk and website master and design, look at competitors' sites and make sure we are not showing old blogs and old pages."

## Old content (webmaster)
- **Deleted 7 dead blog categories** (Brenden approved): Gator Golf, Gator Tennis, Gator Track & Field, Gator Women's Basketball, NCAA Transfer Portal, Kyle Curtis - Sweet Sixteen, Rob Browne Column. Newest posts in them were 2–3+ years old; they sat in the Latest page's category menu and the category sitemap. All 33 posts stay live at their URLs; 8 are now uncategorized, deliberately not re-filed (re-saving old posts risks bumping them into feeds). Backup: `docs/DELETED-CATEGORIES-2026-09-28.json`.
- Seasonal categories left alone (Baseball, Softball, Gymnastics, Spring Football: 4–5 months since last post; they resume in season).
- 100+ posts are still flagged "featured," back to 168+ days. No custom page reads that flag (homepage, Magazine and Latest use the feed, newest first), so bulk-unflagging would be 100+ republishes for no visible change. Not done.
- Homepage, Magazine and Latest all order by newest; no hard-coded old posts found in the Latest page or post-template embeds.
- Still open, needs the Wix Editor: `/event-list` renders "No events at the moment" and is indexed; add noindex there alongside the page-SEO paste (see LESSONS #47).

## Copy desk (newest 12 posts)
- Fixed: Buddy Martin's Ole Miss column (bb1d7484) had **no category**, so it was missing from Buddy's Blog and Gator Football. Added both.
- Fixed: Postgame Analysis (1c12e61d) was filed under "Gators in The NFL." Removed that category.
- Noted, not changed (writer's copy): Postgame Analysis opening line "season defining win" should be "season-defining."
- No unpublished edits on any of the 12; covers, excerpts and tags present on all.

## Design desk: competitor front pages (OnlyGators, Gator Country, On3 Gators Online, Gators Wire, Alligator Army, Swamp247)
- Every live competitor leads with the newest story and dates every item; On3 uses relative time ("3h", "5h"), which reads freshest. We show "Author · September 27, 2026". Option: relative time for stories under 24 hours old.
- Gator Country and Gators Wire post a pregame "Gator Walk" photo gallery and a postgame gallery every home game. We now have postgame galleries; a pregame one would match.
- Gators Wire runs quick utility posts (poll moves, FPI, SP+, TV/broadcast details for the next game). We had the poll story; nobody here has posted Missouri kickoff/TV yet — an easy early post.
- Everyone had the Cyion Smith commitment same day; so did we.
- Share cards: OnlyGators still uses the small summary card; ours is now large-photo on every page.
- Gator Country's own front page shows April/May items in lower sections, the same stale-section problem we just removed.

# Bounce rate + "Keep reading" block — Sept. 28, 2026 (~04:15Z)

Brenden: "66 percent bounce rate is not good."

## What the 66% actually is (GA4 via Windsor, last 7 days)
- 2,526 sessions, 66.9% bounce. Earlier this month bounce ran 24–45%; it jumped to 77% on Sept. 26 and 58% on Sept. 27.
- ~970 sessions (38%) share one fingerprint: Direct, iOS Safari at exactly 390x844 / 320x740 / 430x932, 0–3 seconds, 22 engaged total, from data-center towns (Flint Hill VA, Des Moines, Chicago, San Jose, Boydton VA, Moses Lake WA, Phoenix, Cheyenne). They arrive in bursts (208 at 15:00 on game day, 128 at 11:00 Sunday). Consistent with email link scanners opening every link in our sends. Not confirmed as Microsoft.
- Without them: ~1,560 sessions, ~48% bounce. By channel: Organic Search 23%, Unassigned 32% (~7-min sessions), Organic Social 51% — the real target.
- Real high-bounce landings: Soothsayer 76%, Bound for Top Ten 79%, Swagger Back 63%, Cyion Smith commit 64%. Strong: Chomp poll story 22%, Brown MRI 35%, Baugh recap 36%, Franz column 33%.
- Tracking gap: GA4 recorded 1 session on Sept. 21 and nothing Sept. 22–24.

## Built: "Keep reading" (embed `59e31550-1986-4733-8de1-400676b0e8ee`, rev 1, 3,634 chars, repo `deploy/wix-served/keep-reading.html`)
- On `/post/*` pages, inserts a "Keep reading" block right after the story text with the 3 newest posts from `/blog-feed.xml`, never the current story, nothing older than 14 days, no "LIVE NOW:" posts. Barlow type, brand navy/orange, stacks on phones.
- Went live only after a site publish; page SEO was re-applied from the API in the same call (LESSONS #47). Verified in a real browser run (TinyFish automation): the block shows the three newest stories on the Baugh recap. A plain HTML fetch misses it because it snapshots before the feed loads.
- Page SEO still reads old on Contact, 2021 archive, Tags and Latest after the re-apply. The API re-apply is not holding; the Editor SEO-panel paste from `docs/PAGE-SEO-2026-09-28.json` remains the fix.

# Brenden's fan pass — Sept. 28, 2026 (~04:00Z)

Fixed (live, verified):
- Vol. 2 gallery credit "GatorBait Medias" → "Photos by Chris Spears, GatorBait Media" (my typo from building the post).
- Franz Beard column (d07e9390): "eight penalties for -92 yards" → "92 yards"; "Ole Miss threw for 299 yards" → 298 (ESPN box score: Chambliss 25/34, 298; team passing 298). Added a dated italic "Update, Sunday" line at the top with the new polls (Florida No. 8 AP/Coaches, Missouri No. 25). His own pre-poll prediction ("somewhere between 11 and 15") left as written.
- "By the numbers" box contrast: the post template's generic `[data-hook=post-description] :is(p,li){color:var(--k)!important}` loads later than the stat-box rule at equal specificity, so body text rendered navy on navy. Override (higher specificity) added to the Keep Reading embed (59e31550 rev 2, 3,981 chars, repo synced) because the template embed is 6 characters from its 15,000 cap. Real-browser check: light text on navy, readable.

Checked, not errors:
- Kickoff returns 41 and 74: two different returns (ESPN play-by-play: 41 to the FLA41, 74 to the OLE26), back-to-back after Ole Miss scores.
- "No. 19 Missouri" in the Saturday results lists (Beard column, CFB Saturday wrap) was Missouri's ranking at kickoff before losing to Mississippi State.
- Chambliss 298 is correct everywhere else.

Not changed, needs Brenden:
- Postgame Analysis slug `...-ole-miss-rebel-28`: changing a live URL breaks shared links; recommend leaving it.
- Search: no custom search exists; what flashes is Wix's native header search before the custom header covers it. Only working search is the native one on the Latest page.
- Newsletter signup: none on site. The Email Marketing API is still returning 401 (site owner action required), which also blocks wiring a signup to the subscriber list.
- Message Board: nav link + "not open yet" box live in the header embed (7fee4de6, 30 chars from cap), Home Code (622d8ece) and Sports Home core (fdc2127a).

# Page SEO convergence recheck — Sept. 28, 2026 ~04:14Z (scheduled)

Rechecked all 13 pages live against `docs/PAGE-SEO-2026-09-28.json`. First pass: 4/13 matched (About, Contact, Buddy Martin Show, Home). Re-applied once more (API only, no site publish): 2 more converged (Magazine 2022 Archive, Latest). Final: 6/13 live, 7/13 still stale.

**Still wrong, API not holding — needs the Wix Editor SEO panel:**
- `/event-list` — still "Events | GatorBait Media | Florida Gator News"
- `/magazine` — still "Gatorbait Magazine | Gatorbait Media"
- `/tags` — still "Blog/Tags"
- `/groups` — still "Groups | GatorBait Media | Florida Gator News"
- `/2021-gatorbait-magazine` — still "2021 Gatorbait Magazine (Title) | GatorbaitMedia.com"

Per LESSONS #47, stopping the automated re-apply here rather than retrying indefinitely. Correct wording for all 13 pages remains in `docs/PAGE-SEO-2026-09-28.json`.
