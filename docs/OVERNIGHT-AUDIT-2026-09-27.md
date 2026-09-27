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

## Design team (blueprint)

| # | Ticket | Severity | Status | Evidence |
|---|---|---|---|---|
| D1 | Post normalizer turned every bold score line on the CFB wrap into a large orange-bar subhead (26 fake headings) | High (live) | **Fixed** 05:58Z. Embed c91ad133 rev4, fp 4019635659 → 3651458161. Invented subheads now apply only on all-bold pasted posts, and never to a line with a digit. | Local probe on the wrap DOM: 26 → 0 fake heads; Buddy post still 3 real heads. Live browser check: score lines are normal bold text, and real section headings are intact. |
| D2 | Buddy post: gaps between paragraphs; the second browser check reported the body as bold | Medium | **Resolved, measured** (QC run 67, 06:01Z): normalizer `ok-41-41-48`, unbold on, 3 subheads, 0 empty lines taking space, median gap 20px vs line height 33.6px on desktop. The "bold 700" hard fail was my probe reading his styled deck line; fixed the probe to skip normalizer-styled lines. | Three TinyFish runs disagree (bold / not bold); its agent can't run page JavaScript and infers weight from `<strong>` tags. Moved verification to the repo's GitHub live QC, which now measures computed weight, visible empty lines and median paragraph gap (commits 3b7e07e, 1b74f39). |
| D3 | Columnist posts carry the generic "Gators Football" kicker (Buddy's slugs rarely match a URL rule) | Low | **Fixed** 06:00Z. Post template 14a887e3 rev2, fp 3308260479 → 2602050414, 14,772/15,000 chars. With no URL match, posts by Buddy Martin, Franz Beard or Carlton Reese get "Column"; URL rules still win. | Local browser test on 4 mock posts; live QC now asserts the kicker on Buddy's post and the wrap. |
| D4 | Live QC had no guard for the old "Today's Edition" shell, and no post-format checks | Medium | **Fixed** (commits 16d50f9, 3b7e07e, 1b74f39). A TinyFish run claimed "Today's Edition" is visible on home; QC will confirm or refute with `innerText` (hidden text excluded). | **Refuted** by QC run 67: on all 4 sizes the homepage native section is hidden and "Today's Edition" is not in visible text. The TinyFish claim was wrong. |
| D5 | Magazine at 320px: cookie consent panel overlaps the first visible headline (QC hard fail) | Medium | Open: next in the design queue | QC run 67, magazine · phone320 |
| D6 | Buddy post at 320px: kicker blank 8 s after load ("Column" on 390, 430 and desktop) | Low | Watching: re-checked in the next QC run | QC run 67 |
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
