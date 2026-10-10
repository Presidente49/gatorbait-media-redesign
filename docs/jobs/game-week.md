# Job: game-week

Runs 7:10, 10:10 and 13:10 ET every day. Do only the jobs whose weekday and time window are due now and that #34 and the site do not already show done today; do nothing otherwise. Windows: Monday after 13:00 (presser); Tuesday after 7:00 (Morning After, Bloody Tuesday thread after 8:50, Game Graph after 9:20); Thursday after 7:00 (Morning After) and after 9:40 (preview + magazine draft); Friday after 7:00 (Morning After); Sunday after 10:00 (Game Week Card). Rules are in `docs/START-HERE.md` and win over anything below.

The sections below are the job specifications carried over verbatim from the retired routines (retired Oct. 9-10, 2026, `docs/STACK-V2.md`). Edit this file, not the routine prompt, to change the job.

---

## Monday presser + injury check

Old routine: `trig_01JKUBvRUZ3ptM5D3kr4V13T` (Game week: Monday presser + injury check)

Weekly Monday game-week check (Brenden: run the Stack in the cloud).
1. Find this week's opponent and kickoff from the homepage band data (deploy/wix-served/home-gameday.html) and Florida's schedule.
2. Watch for Jon Sumrall's Monday press conference. Sources:
   - UF's ASAP transcripts, forwarded by UF sports information to brenden@gatorbaitmedia.com (search Gmail for "ASAP transcript" newer_than:1d)
   - the ASAP index for the event
   - the Florida Gators Football YouTube channel, UCGy38_kQ5tV_e87Uhs3VCRQ
   Re-arm hourly until 22:00 ET if nothing has posted.
3. When the transcript arrives:
   - Write and publish a Monday presser story: verified quotes, injury updates, and UF's video embedded (never downloaded).
   - Use a distinct layered cover (LESSONS #40).
   - No email unless Brenden says so.
4. Update the homepage band/Up Next with any rank or TV changes, through the fingerprinted process.
5. Record it, commit, push, and give Brenden a 2-line summary.

---

## Tuesday: GatorBot Bloody Tuesday thread

Old routine: `trig_018SriiQdez4Wzg5YaiDGZXs` (GatorBot Bloody Tuesday thread (generate and hand off))

GatorBot Bloody Tuesday (Brenden, Oct. 3: full control of the automations). Generate this week's Game Day Threads post and Buddy's Porch call with deploy/dept-ideas/community/gatorbot.mjs (see PITCH.md), facts from ESPN only (TinyFish fetch_content; verify the next game, ranks, records, kickoff and TV), story links only to canonical gatorbaitmedia.com /post/ URLs from the newest stories. Wix has no API to post into a group feed, so deliver both texts as one Control Room ask (https://claude.ai/artifact/3X5Caw5wg8q3xbvtbjNDvx, collection asks): "Paste into Game Day Threads and pin; Porch call into the Gold VIP Lounge", yesLabel "Posted". Never email, never post to social. Bye week or no next game: NOOP. If the last three threads were marked posted and drew no replies, say so once on the hub so Brenden can decide whether to keep it.

---

## Tuesday: Gators Game Graph refresh

Old routine: `trig_01E2Kx6UiT8C54bKKKvnWfp9` (Jarvis: Gators Game Graph refresh (Tuesday))

Gators Game Graph weekly refresh. Brenden approved on Sept. 30.

1. In the repo on main: `node deploy/dept-ideas/seo/structured-data.mjs` (reads gazette-live/posts.json and sports-live/scoreboard.json, writes deploy/dept-ideas/seo/out/). Then rebuild the homepage-only embed HTML the same way deploy/seo-2026/home-game-graph-v1.html was built: take the JSON from out/homepage-embed.html, apply AP month abbreviations in descriptions (Oct., Nov., Sept., Dec., Jan., Feb., Aug.; a.m./p.m.), and wrap it in the `location.pathname === '/'` injector. Save as deploy/seo-2026/home-game-graph-<YYYY-MM-DD>.html; it must be under 15,000 chars.
2. Claim in #34 in one line (embed 1261f2b9-3dbf-4a2b-96e7-a13063534398, Jarvis), then via mcp__Wix__ExecuteWixAPI (site 18fb3a4e-d7f6-414a-aeb9-3047db3ea115): GET the embed, check its html still starts with the GBM_SEO_GAME_GRAPH marker, then PATCH with the current revision, embedData.category ESSENTIAL and the new html. Verify length and djb2 after. Rollback: PATCH the previous file's html.
3. Commit the new file and a README line on a branch, open and merge a PR. Post the evidence in #34 (id, revision, length, hash). No site publish, no other embed, no dollar figures. If nothing changed in the graph, say so and skip the PATCH.

---

## Thursday preview + magazine draft

Old routine: `trig_011cSGMQcch48p2wpjaBrWGp` (Game week: Thursday preview + magazine draft)

Weekly Thursday game-week package.
1. Preview story for Saturday's opponent:
   - matchups, injury report (SEC availability report when out), key numbers from ESPN/team stats, and the verified line
   - Loren Meadows or GatorBait Staff byline, per Brenden
   - a distinct layered cover (LESSONS #40)
   - publish, no email
2. GatorBait Magazine weekly edition:
   - Build from newsletter/templates/gatorbait-magazine-colorlib-v1.mjml with this week's best stories: Buddy Martin leads, Franz, Carlton, Eddie, and our pieces.
   - Exactly two distinct photos. Run the repo gates (check-links, validate-unique-images, run-stack-qc).
   - Upload as a Wix DRAFT and post in #34 marked "@Jarvis — needs Brenden" for a yes to send (not automatic).
   - Before sending (even after Brenden's yes): paste automation/newsletter/send-governor.js into ExecuteWixAPI (hasMutations false; until PR #37 merges, read it via `git show origin/claude/tender-wozniak-rmp60e:automation/newsletter/send-governor.js`) and send only if it returns ok:true. If ok:false, hold the send and post the reasons in #34 marked "@Jarvis — needs Brenden" instead of sending.
3. Refresh the Magazine page fallback list (deploy/wix-served/magazine-embed.html D={...}; source automation/site-design/magazine.js) to this week's columns if it has headroom. Use the fingerprinted PATCH on 1dd74333, ESSENTIAL.
4. Record it, commit, push, and post a short summary in #34 (include the governor's result if a send was attempted).

---

## Friday/Tuesday/Thursday: The Morning After column draft

Old routine: `trig_01YMmshPUh1hcRtGoSqqYU1C` (Jarvis: The Morning After (post-show column draft))

The Morning After: draft Buddy Martin's post-show column the morning after The Buddy Martin Show (Mon., Wed., Thu. 9 p.m. ET). Brenden, Sept. 30: "I would like to not make any decisions. I would like for this now to run autonomously... I would like for us to be operational" (recorded in #34). This is deploy/dept-ideas/writing (The Morning After). DRAFT ONLY: never publish, never email, never post to social.

1. Find last night's show with mcp__Descript__list_projects (drive from get_drive_info): the newest project for yesterday's show. If none is newer than the last one in scratchpad/morning-after/seen.json (create it), stop silently.
2. Export the transcript (export_transcript, markdown; wait_for_job). Florida facts come from sports-live/scoreboard.json on main (ESPN-sourced); no stat from memory.
3. Write the column with mcp__Idiolect__write using Buddy Martin's profile (profileId 54e40516-0e40-4eec-bada-3adda6be0ea2; see deploy/dept-ideas/writing/voice-samples.md and column-draft.md): 600-800 words, Buddy's first person, built on what he said on the show, quotes verbatim from the transcript, AP style. Copy-desk it: names, facts vs. ESPN, no invented quotes.
4. Create a Wix Blog DRAFT (site 18fb3a4e-d7f6-414a-aeb9-3047db3ea115, POST /blog/v3/draft-posts; memberId ae876af8-9478-4613-8f0b-5218ad33fdc9 = Buddy Martin; category Buddy's Blog d87d6b50-11d3-494d-97cd-aad63680bc49; title prefixed "DRAFT: "), excerpt, existing tags only. Record the draft id and show project id in seen.json; commit the markdown to deploy/dept-ideas/writing/drafts/<date>.md on a branch and open a PR.
5. Tell Brenden in one line: the headline and that the draft is waiting in Wix Blog drafts for Buddy's read. Add one Control Room log row (ArtifactData, https://claude.ai/artifact/3X5Caw5wg8q3xbvtbjNDvx, collection "log"). If Descript or Idiolect refuses, say so in one line and stop.

---

## Sunday: Game Week Card

Old routine: `trig_015krynckrsUzzwTh5iXQzRz` (Game Week Card (Sunday, Canva autofill))

Game Week Card (Brenden, Oct. 3: full control of the automations). Build this week's matchup card per deploy/dept-ideas/design/PITCH.md.
1. Facts first: read the next Florida game from ESPN (TinyFish fetch_content, site.api.espn.com college-football team 57 schedule and the AP Top 25 rankings). If sports-live/scoreboard.json on main disagrees with ESPN on opponent, date, kickoff, TV, ranks or records, use ESPN and note it. No game this week (bye or season over): end with NOOP.
2. node deploy/dept-ideas/design/make-cards.mjs --write with the verified facts, then Canva autofill-design into the tagged design DAHWqVhJoqU's template, export-design PNG. AP style, Barlow Condensed only. Long opponent names: check the headline does not wrap badly; if it does, stop and flag rather than ship.
3. Deliver as a Control Room ask (https://claude.ai/artifact/3X5Caw5wg8q3xbvtbjNDvx, collection asks) with the PNG link, the facts and their ESPN sources, yesLabel "Use it". Never post to social, never email. One line in #34.
