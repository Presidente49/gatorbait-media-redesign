# Job: newsroom-desk

Current owner direction, Oct. 19: Muse owns intake; Codex is the controller and sole production writer. Prepare one hourly sweep Monday through Saturday, 6:20 a.m. to 11:20 p.m. America/New_York. The existing hosted task `6abb42e5aba4819196a8080584891d9a` has this schedule and remains DISABLED because the correct newsroom mailbox is not connected here. This is not evidence that the separate Claude routine was resumed. Read START-HERE, current state and newest relevant #34 receipts. Verify actual mailbox identity before claiming intake coverage; the connected personal Gmail is not a sweep of brenden@gatorbaitmedia.com. One consolidated pass, not overlapping checks.

Retired prompts remain in git history. Their breaking-email instructions, writer pins, old games and branch/session assignments are not executable specifications.

## Intake and duplicate check

1. Check existing processed-thread receipts and `scratchpad/copy-desk/seen.json`, then query Wix for matching drafts and published stories before creating anything. Cover the time since the last successful intake so a delayed/failed run does not lose submissions. Check writers once, including Buddy Martin, Franz Beard, Loren Meadows, Carlton Reese and Eddie Gilley. Exclude system notices, bounces and unrelated newsletters.
2. Read complete submitted copy/attachments. For Word files use the reviewed repository extractor when available in this checkout, or a supported document tool; report that specific blocker if neither exists. Do not check out an old department branch or invent missing text. Keep private message identifiers/content in private receipts, not public #34 comments or commits.
3. Separate writer submissions from UF releases/transcripts and new Buddy Martin Show videos. Prioritize verified breaking news without creating another post, pinning a writer or starting an email/social send from this lane.

## Prepare and publish

Owner clarification, Oct. 19: trusted professional writer filings get a quick check of score/core box-score numbers, opponent/date and byline, plus normal copy-desk formatting. Preserve their voice and reporting. Do not delay publication by re-reporting every observation or demanding a primary transcript for every supplied quote. Resolve an actual material contradiction when evidence identifies one; broad verification is for agent-authored reporting, not a blanket gate on staff columns.

4. Under Brenden's Oct. 10 standing order, publish incoming staff writer submissions after the copy desk, under their actual bylines, while that order stands. Preserve voice/copy; change only supported facts, formatting and approved metadata. There is no writer-assignment email step. A missing submission is not permission to ghostwrite it.
5. Jarvis/Copy Desk news and postgame pieces follow START-HERE's existing editorial delegation and use Brenden Martin's verified member. Build one canonical story per angle from complete primary sources; unresolved core facts remain held. Read `tools/voice/HOUSE-VOICE.md` and run `tools/voice/gb_voice.py` on agent copy; never rewrite a writer's voice with it.
6. Before each publication or UPDATE_PUBLISH, read both story-alert automations and reconcile current owner direction. The owner explicitly enabled primary `5006baf5-fbbf-440c-a012-a09bdbd95fc9` (fresh rev19 ACTIVE) and left duplicate `824714d4-7e31-4b1d-95b2-ccec04d788af` rev39 INACTIVE. Do not turn them off to follow older notes. A new approved post can trigger its already-authorized native alert; verify the intended small/confirmed audience, consent protection and content before release. Do not publish a dummy story to test it, duplicate the alert with a campaign, expand audiences or toggle states. Verify actual send/delivery evidence separately; ACTIVE or rendered preview does not prove delivery. Hold unexpected state or unresolved audience/content gates.
7. Set excerpt, actual confirmed writer/member, appropriate existing category/tags, distinct credited cover and descriptive alt text. The blog trigger exposes title/description/coverImageUrl/url but no verified photo-credit variable. Ensure the excerpt consumed by the automatic email names the writer and carries the cover credit when needed, or use an appropriately credited cover asset. Never hardcode one photographer into the evergreen template. Store assets in production Wix Media Manager before using their Wix URL; check prior cover usage. Follow `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` for complete attribution, media and publication gates.
8. Set absent story descriptions through Item SEO Tags (`fieldMask: tags`) after checking overrides. Metadata-only edits must not move publication timestamps. Current-news lists stay newest-first; no remembered lead pin or special breaking-band patch is part of intake.

## Copy desk and video

9. Query recent published posts (`POST /blog/v3/posts/query`, `lastPublishedDate DESC`) since the last successful pass. Skip already handled posts and Jarvis's own corrections. GET each draft with rich content; skip `hasUnpublishedChanges`. Batch approved corrections into one UPDATE_PUBLISH PATCH with a field mask and rollback.
10. Fix all-bold body paragraphs, empty leading paragraphs, spacing, obvious typos, missing cover/alt text, category, existing exact-label tags and absent SEO metadata. Preserve writer spacers, headings and voice; use straight quotes in agent copy. Check stats/rankings against ESPN or FloridaGators.com and quotes against full sources. Flag unverified facts rather than guessing.
11. Read The Buddy Martin Show feed (`https://www.youtube.com/feeds/videos.xml?channel_id=UCtR8b1sKFuwaRjKy5BiXRvA`). Resolve the current relevant story through Wix/intake receipts, never a remembered game-specific post ID. Add a relevant new presser/postgame video once as a native VIDEO node or approved Watch link after reading the draft and checking unpublished edits. Never download/re-upload video. Record other clips for the existing owner.
12. Daily tagging uses the reviewed existing tool only when available in the current checkout; preserve tags and skip unpublished edits. Missing tooling is a bounded repo task, not permission to revive a retired branch or bypass a gate.

## Verify and record

13. Read back the changed post and verify its public URL, byline, media, formatting and links. Check the actual destination before claiming publication. Record canonical URL, change, verification, rollback and unresolved flags in #34; advance private receipts only after the outcome is known.
14. Repo changes use a bounded current-main branch. Do not push into the old `fix-native-flash-20260926` draft. New failure modes become one concise lesson/job correction through controller review. If nothing changed, stay silent.

## Lessons added Oct. 11 (LESSONS 85-91)

After any publish or cover change: run refresh-newsroom-feed, rebuild the front page snapshot and deploy by pointer PR (Lesson 87). Lesson 86 timed-pinning direction is retired: never pin or reorder stories; strictly chronological (Lesson 104). Use distinct credited covers, Chris Spears' folder first (Lesson 88). Embed clips as native players (Lesson 89). After each game patch the Up next box in embed 14a887e3 (Lesson 91). If an approval stalls a publish, tell Brenden at once (Lesson 85).

Magazine and watches (Oct. 11): read the live embed before any deploy plan (Lesson 92); one reminder chain per job (Lesson 93); use Firecrawl when TinyFish is empty (Lesson 94); postgame magazine recipe and poll-ranking hold (Lesson 95).

## Historical manual story-alert path (Oct. 11; superseded for this block)

Do not execute this manual path while the owner-authorized native primary automation is ACTIVE. It is retained as historical context only; the Oct. 19 native route above owns story email and no additional campaign is created.

Earlier direction: "send an email after you look and make sure the list is OK for every blog".

Brenden's standing yes covers one Gazette-style alert per qualifying story, sent by Jarvis (the Wix blog-alert automations stay INACTIVE; this path does not use them). Recipe, template and checklist: `docs/GAZETTE-STORY-ALERT.md`. For each story just published and verified live:

1. Qualifies when it is a lead story (a Buddy Martin or Franz Beard column, a game or postgame story, or real breaking news). Skip routine or duplicate pieces and anything under copy-desk correction.
2. `node automation/newsletter/build-story-alert.mjs --url <permalink> ...` (cover must already be a Wix Media Manager URL; fresh news only, never a stale ranking or stat).
3. Create the Wix campaign DRAFT, preview it (unsubscribe footer and business address must be present), then run `automation/newsletter/send-governor.js` and `story-alert-presend.wix.js` through ExecuteWixAPI. Any failed check means no send; log one line in #34 and move on.
4. Send only to the dedicated GatorBait Daily News label (SUBSCRIBED, VALID, no hold or Do Not Market labels), never the whole eligible pool `oHon1` (hundreds of its members carry the re-opt-in HOLD label). If that label does not exist yet, hold the alert and tell Brenden once.
5. Caps are the governor's: one list email per 24 hours and seven a week. A second qualifying story inside the window waits for the next window or is skipped; Brenden changes the caps, not a worker.
6. Verify delivery from campaign statistics, record campaign id and counts only in #34, keep the daily open and click numbers for the Monday scorecard.

## Complete distribution handoff — owner Oct.19

Use `docs/loops/newsroom.md` for accepted stage transitions: source received → copy desk → fact review → publication → independent live QC/corrections → native email verification and social packet → connected-channel publication → public verification → relevant video → measured engagement. A timer, queued packet, agent agreement or HTTP transport receipt never substitutes for completed work. Bound each repair to one attempt plus one evidence-based correction; unresolved faults remain open for the next authorized sweep. No perpetual model loops.
