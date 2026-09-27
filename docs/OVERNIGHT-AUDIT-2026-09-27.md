# Overnight audit and ticket log: Sept. 27, 2026

Brenden (05:45Z): "use your new tools and deploy them to your department. Let's do a department by department audit and ticket fix over the night starting with the design team. Stay automated and keep check the shared muse repo every 30 mins. See if any article show up in our gatorbait email or in drafted. I'm going to bed. You have full control."

**Standing limits that still apply:**
- No subscriber email.
- No alert automation switched on.
- Muse output is draft-only.
- One site writer.
- Every live change is reversible and verified.

**Order of work:**
1. Design (blueprint)
2. Web (webmaster)
3. SEO (rank)
4. Social (hype)
5. Writing (scribe)
6. Research (scout)
7. Outreach (bridge)
8. Ops/automation (wrench)

## Article watch (every 30 min, chained one-shot check-ins)

| Check (UTC) | Muse repo (Presidente49/gatorbait) | Gmail | Wix drafts | Action |
|---|---|---|---|---|
| 05:48 baseline | Only "Initial commit" 62c9e55 (README "Muse") | 3 UF ASAP transcripts (Sumrall, Baugh, Woods, 00:36–01:00Z), already used in the presser and Woods stories. 3 bounces to one Outlook address (mailbox full) | No draft newer than Sept. 26 17:44Z ("4-0 for the First Time Since 2019", unpublished) | None |
| 06:18 | No change (62c9e55 only) | No new article submissions. Buddy's "Early buddy Col" (02:17Z) is already live as "The Swamp Gets Its Swagger Back" (04:44Z). **Security, for Brenden:** a Google Account Recovery Request was filed for brenden@gatorbaitmedia.com at 04:21Z. Between 02:39 and 03:14Z, several classic GitHub PATs with admin scopes were created or regenerated ("Ghb", "New", "M2"), a fine-grained PAT "GB8" was created and regenerated, and SSH key "DP Key" was added to Gatorbait-agency. If any of these weren't you, revoke them and check account security. | No new drafts | Logged only; no action taken on account security |
| 10:55 (catch-up) | No change | No new mail since 06:18Z (excluding GitHub notices and bounces) | **New draft:** Franz Beard, "Beating Ole Miss was huge, but the Gators left at least 28 points on the field" (d07e9390; created 10:31Z, edited 10:35Z; 2,062 words; no cover or category yet) | Left alone: it's the writer's own work in progress. **Gap:** the 30-min chain stopped after 06:18Z because the re-arm call never completed. Re-armed 10:56Z. |
| 12:29 | — | — | **Franz Beard's column published on Brenden's order** ("post Franz asap with art") with a new field-diagram cover and 7 fact and typo fixes. See `gameday/2026-09-26-ole-miss/franz-28-points/PUBLISHED.md`. | No email; tagged |

## Design team (blueprint)

| # | Ticket | Severity | Status | Evidence |
|---|---|---|---|---|
| D1 | Post normalizer turned every bold score line on the CFB wrap into a large orange-bar subhead (26 fake headings) | High (live) | **Fixed** 05:58Z. Embed c91ad133 rev4, fp 4019635659 → 3651458161. Invented subheads now apply only on all-bold pasted posts, and never to a line with a digit. | Local probe on the wrap DOM: 26 → 0 fake heads; Buddy post still 3 real heads. Live browser check: score lines are normal bold text, and real section headings are intact. |
| D2 | Buddy post: gaps between paragraphs; the second browser check reported the body as bold | Medium | **Resolved, measured** (QC run 67, 06:01Z): normalizer `ok-41-41-48`, unbold on, 3 subheads, 0 empty lines taking space, median gap 20px vs line height 33.6px on desktop. The "bold 700" hard fail was my probe reading his styled deck line; fixed the probe to skip normalizer-styled lines. | Three TinyFish runs disagree (bold / not bold); its agent can't run page JavaScript and infers weight from `<strong>` tags. Moved verification to the repo's GitHub live QC, which now measures computed weight, visible empty lines and median paragraph gap (commits 3b7e07e, 1b74f39). |
| D3 | Columnist posts carry the generic "Gators Football" kicker (Buddy's slugs rarely match a URL rule) | Low | **Fixed** 06:00Z. Post template 14a887e3 rev2, fp 3308260479 → 2602050414, 14,772/15,000 chars. With no URL match, posts by Buddy Martin, Franz Beard or Carlton Reese get "Column"; URL rules still win. | Local browser test on 4 mock posts; live QC now asserts the kicker on Buddy's post and the wrap. |
| D4 | Live QC had no guard for the old "Today's Edition" shell, and no post-format checks | Medium | **Fixed** (commits 16d50f9, 3b7e07e, 1b74f39). A TinyFish run claimed "Today's Edition" is visible on home; QC will confirm or refute with `innerText` (hidden text excluded). | **Refuted** by QC run 67: on all 4 sizes the homepage native section is hidden and "Today's Edition" is not in visible text. The TinyFish claim was wrong. |
| D5 | Magazine at 320px: cookie consent panel overlaps the first visible headline (QC hard fail in runs 67 and 69) | Medium | **Fixed** 06:30Z. Magazine 1dd74333 rev36, fp 2105632943 → 1533267249 (14,934/15,000). On phones the lead H1 goes from 28px to `clamp(22px,7vw,28px)`, 22.4px at 320px. Buddy's 85-character headline wrapped to about 5 lines starting at y=413 and ran into Wix's 209px first-visit consent banner (y≈531); the old, shorter Cowboy lead fit. Source updated in magazine.css, magazine-style.html and magazine-embed.html. | Pending next QC run |
| D6 | Buddy post at 320px: kicker blank 8 s after load ("Column" on 390, 430 and desktop) | Low | **Explained**: Wix's CDN served stale page copies right after embed deploys. Run 69: 390/430 fully correct (body 400, no cover block, Column, gap 20px); 320 got the previous template and desktop ran no custom scripts. QC now retries article targets with cache-busting reloads (commit 1a87f6c), the same pattern as the band check. | QC runs 67, 69 |
| D7 | **Brenden (06:10Z): "giant blue thing above Buddy… just cut off his article."** The post template always drew a 16:9 cover block with a navy #0d2447 background under the headline, filled with og:image. Buddy's "The Sweet Music Chimes Again!" has no landscape cover (og:image is a square 1000×1000 graphic), so readers got a big cropped blue band. | High (live) | **Fixed** 06:14Z. Template 14a887e3 rev3, fp 2602050414 → 2970573316, 14,985/15,000. The script sets `html[data-gbm-nohero]` when og:image is missing or narrower than 1.3:1, and CSS drops the block. Landscape covers still reserve their space at first paint (no jump). | Browser test: square → none; landscape 2000×1333 → block kept; no image → none. Live QC now hard-fails if Buddy's post draws the block. |

## Web team (webmaster)

| # | Ticket | Severity | Status | Evidence |
|---|---|---|---|---|
| W2 | Site YouTube link pointed to youtube.com/@GatorBaitMedia, which returns 404 (checked twice, both letter cases); the active channel is @thebuddymartinshow (UCtR8b1sKFuwaRjKy5BiXRvA) | Medium | **Fixed** 06:12Z: Utility Footer f8b950c9 rev25 (the footer's YouTube link, with its subscribe prompt) and Site Fixer 5a43ae83 rev16 (Organization `sameAs`). Rollback: swap the handle back. | Read-back shows the new link in both; the only remaining "@gatorbaitmedia" is the email address. |
| W1 | Game-day roster embed 72189876 (13.7 KB) still loaded on every page after game day; the band no longer references it (no `rosters` key) | Low (performance) | **Fixed** 06:02Z: disabled (rev3, ESSENTIAL kept). Rollback: enable it. | Band JSON has no `rosters` key, so the button can't render. |

## SEO team (rank)

| # | Ticket | Severity | Status | Evidence |
|---|---|---|---|---|
| S1 | NewsArticle JSON-LD (embed 4d3ab24a) looked for the author with selectors Wix no longer renders, so named bylines (Buddy Martin, Carlton Reese, Franz Beard) fell back to Organization "GatorBait Media". It could also fire before the byline rendered, and `@id` carried query strings (e.g. `?cb=`) | Medium | **Fixed** 06:05Z, rev2, fp 3158064706 → 1016752199. It reads `[data-hook=user-name]` and waits up to 4 s for the byline. Staff bylines stay Organization. `@id` = canonical URL. `articleSection` falls back to the article kicker. Rollback: `deploy/news-seo/rollback-4d3ab24a-rev1.html`. | Browser test: Buddy → Person "Buddy Martin"; "GatorBait Staff" → Organization; a byline rendered 1.5 s late → Person "Carlton Reese"; `@id` without `?cb=1`. |

## Brenden add-on (06:05Z): "we have shorts that you could take the links and add"

Source: The Buddy Martin Show channel, 50 most recent Shorts (vidIQ public list; vidIQ has no authorized channel for this account). Each Short was added to the end of the story on the same topic: a bold "Watch on The Buddy Martin Show:" line linking to the Short, then a vertical 315×560 YouTube embed. The embed uses the Ricos HTML-node shape proven live in the Laura Rutledge post. Posts were updated in place (UPDATE_PUBLISH); none had pending edits. No email (both new-post automations are INACTIVE, and updates don't trigger them).

| Story | Short |
|---|---|
| No Bad Wins: Sumrall Issues Warning After Florida's Auburn Win | YqxjkqSv1jk "NO BAD WINS: Sumrall Rips 16 Penalties" |
| Florida Escaped Auburn, But The Yellow Flags Followed It Home | YqxjkqSv1jk |
| Controversy, Kiffin and Sumrall: Florida hired the right football coach | WuZ4S-fubUY "Did Florida really dodge a bullet with Lane Kiffin?" |
| Urban Sees The Gators' Bright Future | jTq2Pn7ZeBA "Urban Meyer: Florida's improved lines" |
| Week 3 Preview: Florida v. Auburn | TzP8RJY0BKw "Can Auburn's QB handle the pressure?" |
| Analyzing the win over FAU | z51GTfYSS0Y "Did Florida's defense let FAU throw short passes?" |
| Getting Cut Down To Size! SEC Warns LSU | -YRbRemUOWI "What happens if LSU goes independent?" |
| What Can "VB3" Do for You? | rLmhIOqbttc "Vernell's six catches" |

- **Skipped on purpose:** Gator Bait chant and postcard-history Shorts (sensitive, need an editor's call); Terry Bradshaw, NFL and Arch Manning Shorts (no matching story).
- **Rollback:** delete the two nodes whose ids start `gbmshort` in each post.
- **Found and fixed while verifying (writing lane):** the VB3 story (Eddie Gilley) ended with a truncated line, "tune in to The Buddy Martin S". It now reads "Tune in to The Buddy Martin Show."
- **Live check:** the VB3 story shows the Watch line with the youtube.com/shorts link.
- **06:12Z, Brenden: "Do not post urban mayer only post stuff from today or yesterday."** All 8 Short embeds were removed (16 nodes; all 8 posts republished in place). None of the channel's Shorts is from today or yesterday ET; the newest is Friday 11:51 p.m. ET. The VB3 truncation fix stays.
- **Google Drive:** no videos created or modified since Sept. 20 (newest video in Drive: March 2026). The only Ole Miss game video on hand is Chris Spears' 8 s celebration clip (`gameday/2026-09-26-ole-miss/postgame/video/`). **Blocked:** posting to YouTube needs the Buddy Martin Show channel authorized in vidIQ (it lists no authorized channels for brenden@gatorbaitmedia.com).
- **Proposal, not done** (homepage layout needs Brenden's yes): a Shorts rail on the homepage fed from the channel.

## Brenden (06:15Z): "Facebook does" (today's and yesterday's videos are on Facebook)

GatorBait Media Facebook reels from the last day were added with rewritten titles. Each is a bold "Watch:" line linking to the reel, plus Facebook's public video player (267×476, Ricos HTML node). Posts were updated in place (UPDATE_PUBLISH, none had pending edits). No email.

| Story | Reel | New title |
|---|---|---|
| Baugh Game: Gators Run Over No. 4 Ole Miss (94127b93) | 2330767687457823 | The Swamp was rocking: Gators take down No. 4 Ole Miss 52-28 |
| CFB Saturday wrap (9fb69423) | 4342698309325942 | Field level in The Swamp after Florida 52, Ole Miss 28 |
| It's Game Day in The Swamp (270e8172) | 2000395273993128 | 90 minutes to kickoff in The Swamp |
| It's Game Day in The Swamp (270e8172) | 1098273142610325 | Lights out, phones up: The Swamp sings "Won't Back Down" |
| Baugh Runs the SEC (e5686337) | 2014446072592506 | Is Jadan Baugh the best back in the country? Graham Hall of 247Sports weighs in (the Facebook caption misspells him "Jaden Ball") |
| Week 4 Preview (558b5e49) | 1101081166186967 | Swamp noise and false starts: Graham Hall of 247Sports on Florida's home edge |

- **Skipped:** Tim Tebow on SEC Nation (TV footage), the in-game "leads 38-28" clip (outdated), the "Work the Cut" coach clip (source unclear).
- **Live check:** the postgame story renders the link and the Facebook iframe.
- **Rollback:** delete the nodes whose ids start `gbmfb`.
- **Not possible from here:** fixing the "Jaden Ball" caption on Facebook itself needs Page access.

## Brenden (live, ~13:47Z): "Double logo" fix + Today's Edition finding

Brenden shared a screenshot showing a duplicated GatorBait logo on the front page (site header logo, then a second logo directly below it above the lead story). Diagnosed via the live custom embeds (Wix API), not a screenshot old enough to dismiss:

**D8 — Double logo (FIXED, published):**
- Cause: "GBM - Home Code v1 (Wix-served)" (embed `622d8ece`), the front-page renderer that mounts into `#gbm-live`, was building its own in-page `<header class="sh-header">` with a second `<img>` GatorBait wordmark, directly below the persistent site-wide header logo from "GBM - Compact Optimized Logo + Header v12" (`7fee4de6`).
- Fix: removed the duplicate `<a><img></a>` brand lockup from Home Code v1's `sh-header`, kept the tagline, the "Join GatorBait" button and the full nav (Front Page/Latest/Magazine/TV/Podcasts/Message Board/Store/Sign in) untouched.
- Embed `622d8ece` revision 5 → 6, category re-sent as ESSENTIAL, site published.
- Verified: repeated live fetch after publish shows no duplicate logo image; page structure and links otherwise unchanged. Repo copies (`deploy/wix-served/split/home-code.html`, `deploy/wix-served/homepage-embed.html`) updated to match.

**New finding, unresolved — "Today's Edition" heading is currently rendering live:**
- Three independent live fetches of `https://www.gatorbaitmedia.com/` (spaced minutes apart) all show an `<h1>Today's Edition</h1>` plus "Dive into today's edition... Read Latest" ahead of the real, freshly-updated story list. This is the exact legacy heading `docs/HOMEPAGE-BASELINE-LOCK.md` and AGENTS.md say must never be exposed.
- This is native Wix page content, not a custom embed — it does not match anything in Home Code v1's own markup (which builds its own dynamic `<h1>` per lead article, not a static "Today's Edition").
- A guard embed already exists for exactly this ("GBM - Legacy Homepage Hard Delete v2 (prepaint bounded)", `ed3718cc`) — it scans for an exact-text `/^Today[’']?s Edition$/i` heading plus "Read Latest" and removes it, in a timed burst up to 4s after load.
- Not fixed here: I can't tell from a headless fetch alone whether real visitors ever see it (the guard may be clearing it within the first few seconds, before a normal person looks) or whether it's a genuine persistent leak the guard is failing to catch. Fixing the underlying native Wix block is outside what the embeds API can touch, and I don't have a real browser in this session to watch the removal happen in real time.
- Needs: a visual QC pass with a real browser (load the homepage, watch for a flash of "Today's Edition" in the first ~4 seconds) to confirm whether this is cosmetic/transient or a persistent violation needing a native Wix Editor fix.

## Overnight article watch — final check, ~13:5xZ (past 12:30Z cutoff, watch ends here)

- `/home/user/gatorbait`: HEAD still `62c9e55`, matches baseline. No drift.
- Gmail: no new writer submissions/transcripts since the 10:55Z threshold. Newest relevant items are all from before 04:22Z (already actioned: Buddy's early column, the three ASAP transcripts, three Outlook bounce notices for a full mailbox, a TinyFish low-balance notice, a Google Account Recovery request — all previously flagged, no new action).
- Wix drafts: top 15 by most-recently-updated are all PUBLISHED. No new or pending drafts, including Franz's `d07e9390` (published, already tag-swept).
- Stopping the 30-minute re-arm per the routine's own end condition (past 12:30Z).

## Brenden (~14:40Z): replace the front-page art, headline over the photo, "deploy the editorial division"

**E1: Unfamiliar front-page art (FIXED).**
- Cause: the front page leads with the newest story (the "Chronological lead" rule in Home Styles). The newest story was Loren Meadows' "Postgame Analysis" (`1c12e61d`, published 13:50Z). Its cover was an AI cartoon, "Florida Gator with football chasing a bear with a red jersey on.jpg" (1024 square). A second cartoon, a gator chasing a shark, was in the body.
- Cover replaced with Chris Spears' "Gators take the field" photo (`d3cfa5_2ea58f38…`, 1620×1080, the same photo Brenden sent), credited in the alt text. The in-body cartoon was removed.
- Editorial fixes, in place, with no email:
  - Title "Rebel 28" became "…52, Ole Miss Rebels 28". The slug is unchanged.
  - "Jaden Baugh" became Jadan Baugh (3 places); "Keiwan Lacy" became Kewan Lacy; "Landon Montgomery" became London Montgomery.
  - Kick return "42" became 41, per the ESPN box score.
  - "best offensive minds like DJ Durkin and Pete Golding" became "defensive minds".
  - Typos: know one's, knocking of, group of five, TD's, teams.
  - A clean excerpt replaced the byline text, and 12 tags were added.
- Not verified, left as written and flagged for Loren: "first SEC back since Derrick Henry to score multiple TDs in five straight games" and "best win … in at least four years".

**E2: Headline over photo on the front-page lead (LIVE).**
- Home Styles embed `1255a4cf`, revision 2 → 4: an appended, scoped `gbm-hero-overlay v1` block.
- Layout: full-bleed photo (16:10 desktop, 4:5 phone), with kicker, headline, deck (clamped), meta and link on a navy gradient at the bottom.
- Local render check at 390px and 1280px with the production CSS: no horizontal overflow, copy flush with the photo edge.

**E3: Magazine masthead double logo + cover overlay (LIVE).**
- Brenden's 8:47 screenshot was the Magazine page. Its `.mast` repeated the GatorBait logo image under the site header.
- Correction to D8 above: that change removed a desktop-only duplicate on the homepage (`.sh-header` is hidden at ≤820px), so it wasn't the phone view in the screenshot. This change is the actual fix for that screenshot.
- Magazine embed `1dd74333`, revision 36 → 37, 14,769/15,000 characters:
  - The masthead is now the text "GatorBait Magazine"; the logo image was dropped.
  - The cover-story headline now sits over the full-width cover photo.
- Source updated in `automation/site-design/magazine.{js,css}` and `deploy/wix-served/magazine-embed.html`. The repo copies match the live lengths.

**Correction to the "Today's Edition" finding.** The TinyFish fetcher doesn't run the custom `#gbm-live` / `#gbm-magazine-page` renderers; the selectors aren't found in its output. What it reported was the native Wix layer underneath, which real browsers hide. That finding is downgraded to "unconfirmed, likely a fetch artifact"; confirming it still needs a real browser.

Brenden's postgame celebration photo (800×432) was not used: its photographer is unknown and credit is required. It needs a credit before it goes on the site.

## Brenden (~15:30Z): editorial/facts/copy audit of the front-page rotation, rotation check, email check

**Rotation (verified from the live embed `622d8ece`):**
- The front page is strictly chronological: `lead = posts[0]`, the next 2 are supporting, and the rails take the newest stories not already shown. No per-visit shuffle, no repeats.
- The feed is re-read with a per-minute cache-buster, so each new post pushes everything down automatically.
- Repo drift: `deploy/wix-served/split/home-code.html` still has the older Buddy-lead + sessionStorage-rotation logic. Live code, not the repo copy, is authoritative for lead and rotation.
- Owner-direction conflict to raise with Brenden: CLAUDE.md says Buddy is the editorial lead across the homepage, but live is newest-first (so Loren's analysis leads right now).

**Audit (14 newest posts = everything reachable from the front page):**
- Automated sweep checked names, game facts, copy, excerpts, covers, duplicate covers and tags. No wrong scores, misspelled names, AI covers or duplicate covers remain.
- Fixed in place, no email:
  - Buddy `bb1d7484`: a double space.
  - Carlton `03c7b5fe`: "Eric Singleton Jr., Vernell Brown III" on first reference.
- Flagged, not touched: halftime `bb2287f1` has zero tags but has unpublished edits pending in Wix. Tagging it would publish those edits, so it waits for whoever is editing it.
- False positives dropped: surname-only second references (Singleton) in the presser and Lacy stories.

**Emails (Wix statistics, 15:3xZ):** all 8 sends since Sept. 25 were DISTRIBUTED, each delivering 1,807–1,816.

| Send | Delivered | Opens | Clicks |
|---|---|---|---|
| Postgame Wrap `b3fa395e` | 1,807 | 372 | 51 |
| Buddy+Franz columns `2fb154ff` | 1,810 | 459 | 77 |
| Reaction `6b056c3f` | 1,810 | 619 | 150 |
| FINAL `f8ee1c12` | 1,808 | 631 | 109 |

- No email for Loren's analysis (none authorized).

**Agency repo (Gatorbait-agency PR #2, commits `7dbf76d` and `1465c66`):**
- Today's tools, filed by department:
  - `editorial/copy-desk-audit` (scribe)
  - `design/hero-overlay` (blueprint + webmaster)
  - `web/embed-patch` (webmaster's first skill)
  - `research/photo-sourcing` (scout)
  - `marketing/email-delivery-check` (wrench)
- Also added: `brands/gator-bait-media/editorial-desk.md` (canonical names, verified game facts, photo sources, writer submission rules) and a learnings entry.

## Brenden (~15:45Z): "Pin Buddy as the lead on the front page" (LIVE)

- Home Code embed `622d8ece`, revision 6 → 8, published:
  - Lead = Buddy Martin's newest column, provided it's under 7 days old; otherwise the newest story. Everything else stays chronological and no story repeats. The Voices rail skips the pinned column via `unseen()`.
  - Lead photo credits now render over the photo: Hannah White / UAA for Buddy's Baugh cover, and Chris Spears for his Auburn and entrance photos. The old code only credited one Auburn photo.
- The feed confirms `dc:creator` = "Buddy Martin", so the current lead is "The Swamp Gets Its Swagger Back".
- Repo `deploy/wix-served/split/home-code.html` is re-synced to live: line-by-line fingerprints match and the length is 13,805. It had drifted, still holding the Sept. 26 per-visit rotation and an older feed fetch.
