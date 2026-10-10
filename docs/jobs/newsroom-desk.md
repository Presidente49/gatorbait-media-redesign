# Job: newsroom-desk

Runs hourly 6:20 a.m. to 11:20 p.m. ET; Franz Thoughts of the Day runs on weekday mornings, 6-11 a.m. Read `docs/START-HERE.md`, newest #34 comments and LESSONS-DIGEST first. Resolve date/game from live primary sources. Jarvis owns publication. This is one consolidated pass, not five intake passes over the same messages.

Retired prompts remain in git history. Their breaking-email instructions, writer pins, old games and branch/session assignments are not executable specifications.

## Intake and duplicate check

1. Check existing processed-thread receipts and `scratchpad/copy-desk/seen.json`, then query Wix for matching drafts and published stories before creating anything. Cover the time since the last successful intake so a delayed/failed run does not lose submissions. Check writers once, including Buddy Martin, Franz Beard, Loren Meadows, Carlton Reese and Eddie Gilley. Exclude system notices, bounces and unrelated newsletters.
2. Read complete submitted copy/attachments. For Word files use the reviewed repository extractor when available in this checkout, or a supported document tool; report that specific blocker if neither exists. Do not check out an old department branch or invent missing text. Keep private message identifiers/content in private receipts, not public #34 comments or commits.
3. Separate writer submissions from UF releases/transcripts and new Buddy Martin Show videos. Prioritize verified breaking news without creating another post, pinning a writer or starting an email/social send from this lane.

## Prepare and publish

4. Under Brenden's Oct. 10 standing order, publish incoming staff writer submissions after the copy desk, under their actual bylines, while that order stands. Preserve voice/copy; change only supported facts, formatting and approved metadata. There is no writer-assignment email step. A missing submission is not permission to ghostwrite it.
5. Jarvis/Copy Desk news and postgame pieces follow START-HERE's existing editorial delegation and use Brenden Martin's verified member. Build one canonical story per angle from complete primary sources; unresolved core facts remain held. Read `tools/voice/HOUSE-VOICE.md` and run `tools/voice/gb_voice.py` on agent copy; never rewrite a writer's voice with it.
6. Before each publication or UPDATE_PUBLISH, read both blog alert automations (`5006baf5-fbbf-440c-a012-a09bdbd95fc9`, `824714d4-7e31-4b1d-95b2-ccec04d788af`) and verify INACTIVE. Hold the write and report the blocker if active/unreadable; do not change automation state. Subscriber sends require separate current owner authorization and the email playbook. A passing send governor alone never authorizes a send.
7. Set excerpt, actual writer/member, appropriate existing category/tags, distinct credited cover and descriptive alt text. Store assets in production Wix Media Manager before using their Wix URL; check prior cover usage. Follow `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` for complete attribution, media and publication gates.
8. Set absent story descriptions through Item SEO Tags (`fieldMask: tags`) after checking overrides. Metadata-only edits must not move publication timestamps. Current-news lists stay newest-first; no remembered lead pin or special breaking-band patch is part of intake.

## Copy desk and video

9. Query recent published posts (`POST /blog/v3/posts/query`, `lastPublishedDate DESC`) since the last successful pass. Skip already handled posts and Jarvis's own corrections. GET each draft with rich content; skip `hasUnpublishedChanges`. Batch approved corrections into one UPDATE_PUBLISH PATCH with a field mask and rollback.
10. Fix all-bold body paragraphs, empty leading paragraphs, spacing, obvious typos, missing cover/alt text, category, existing exact-label tags and absent SEO metadata. Preserve writer spacers, headings and voice; use straight quotes in agent copy. Check stats/rankings against ESPN or FloridaGators.com and quotes against full sources. Flag unverified facts rather than guessing.
11. Read The Buddy Martin Show feed (`https://www.youtube.com/feeds/videos.xml?channel_id=UCtR8b1sKFuwaRjKy5BiXRvA`). Resolve the current relevant story through Wix/intake receipts, never a remembered game-specific post ID. Add a relevant new presser/postgame video once as a native VIDEO node or approved Watch link after reading the draft and checking unpublished edits. Never download/re-upload video. Record other clips for the existing owner.
12. Daily tagging uses the reviewed existing tool only when available in the current checkout; preserve tags and skip unpublished edits. Missing tooling is a bounded repo task, not permission to revive a retired branch or bypass a gate.

## Verify and record

13. Read back the changed post and verify its public URL, byline, media, formatting and links. Check the actual destination before claiming publication. Record canonical URL, change, verification, rollback and unresolved flags in #34; advance private receipts only after the outcome is known.
14. Repo changes use a bounded current-main branch. Do not push into the old `fix-native-flash-20260926` draft. New failure modes become one concise lesson/job correction through controller review. If nothing changed, stay silent.
