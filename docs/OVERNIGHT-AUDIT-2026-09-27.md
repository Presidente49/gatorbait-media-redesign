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
| D2 | Buddy post: gaps between paragraphs; the second browser check reported the body as bold | Medium | Investigating | Three TinyFish runs disagree (bold / not bold); its agent can't run page JavaScript and infers weight from `<strong>` tags. Moved verification to the repo's GitHub live QC, which now measures computed weight, visible empty lines and median paragraph gap (commits 3b7e07e, 1b74f39). |
| D3 | Columnist posts carry the generic "Gators Football" kicker (Buddy's slugs rarely match a URL rule) | Low | **Fixed** 06:00Z. Post template 14a887e3 rev2, fp 3308260479 → 2602050414, 14,772/15,000 chars. With no URL match, posts by Buddy Martin, Franz Beard or Carlton Reese get "Column"; URL rules still win. | Local browser test on 4 mock posts; live QC now asserts the kicker on Buddy's post and the wrap. |
| D4 | Live QC had no guard for the old "Today's Edition" shell, and no post-format checks | Medium | **Fixed** (commits 16d50f9, 3b7e07e, 1b74f39). A TinyFish run claimed "Today's Edition" is visible on home; QC will confirm or refute with `innerText` (hidden text excluded). | Pending the QC run result |

## Web team (webmaster)

| # | Ticket | Severity | Status | Evidence |
|---|---|---|---|---|
| W1 | Game-day roster embed 72189876 (13.7 KB) still loaded on every page after game day; the band no longer references it (no `rosters` key) | Low (performance) | **Fixed** 06:02Z: disabled (rev3, ESSENTIAL kept). Rollback: enable it. | Band JSON has no `rosters` key, so the button can't render. |

## SEO team (rank)

| # | Ticket | Severity | Status | Evidence |
|---|---|---|---|---|
| S1 | NewsArticle JSON-LD (embed 4d3ab24a) looked for the author with selectors Wix no longer renders, so named bylines (Buddy Martin, Carlton Reese, Franz Beard) fell back to Organization "GatorBait Media". It could also fire before the byline rendered, and `@id` carried query strings (e.g. `?cb=`) | Medium | **Fixed** 06:05Z, rev2, fp 3158064706 → 1016752199. It reads `[data-hook=user-name]` and waits up to 4 s for the byline. Staff bylines stay Organization. `@id` = canonical URL. `articleSection` falls back to the article kicker. Rollback: `deploy/news-seo/rollback-4d3ab24a-rev1.html`. | Browser test: Buddy → Person "Buddy Martin"; "GatorBait Staff" → Organization; a byline rendered 1.5 s late → Person "Carlton Reese"; `@id` without `?cb=1`. |
