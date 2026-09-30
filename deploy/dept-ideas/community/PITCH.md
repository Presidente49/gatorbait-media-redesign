# GatorBait Game Threads with GatorBot

## The idea

One thread per Florida game in the Wix Groups board that already exists on the site, opened by GatorBot on Bloody Tuesday from the ESPN scoreboard feed, seeded with the week's stories as Discuss-this-story posts, and closed when the recap publishes. Inside every game week, a members-only Buddy's Porch call in the private Gold lounge where paid subscribers ask questions Buddy takes on The Buddy Martin Show (Mondays, Wednesdays and Thursdays, 9 p.m. ET). The board is the nine real groups on production; the new part is the robot that keeps it alive and the rules that keep it clean.

## Why it matters

- The board is built and dead. The real read on Sept. 30 shows nine groups, including "Game Day Threads," "Gator Football Talk," "Recruiting Central" and a private "GatorBait Gold VIP Lounge," all created March 16, 2026 (one on Sept. 25), each with a member count of one and no activity since the minute it was created. The only older group last moved Feb. 10. No group has rules. Nothing posts into them, so nothing happens in them.
- The paid plans already sell this. Live perk copy on the buyable plans promises a "Subscriber chat room" (ALL ACCESS ANNUAL), "VIP-only live chat room, game day threads with staff" and a "Monthly AMA with Buddy Martin" (GATORBAIT GOLD). Legacy plans promised "Forums & Threads, Groups." Game Threads plus the Porch is the cheapest way to make that copy true with tools already paid for.
- Missouri week is the test case: No. 8 Florida, 4-0, at No. 25 Missouri, Sat., Oct. 3, 3:30 p.m. ET on ABC (ESPN via `sports-live/scoreboard.json`). GatorBot's dry run produced the game thread, the Porch call and 20 Discuss posts from the real feeds in one command.
- Every Discuss post is a canonical `/post/` link, so the board pushes readers back to the site, not away from it, and gives Buddy a listener-mail segment every Wednesday.

## Evidence

All calls read-only on site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`. No writes to Wix, no git.

1. `mcp__Wix__SearchWixRESTDocumentation` x5: found List Groups, Query Groups, List Group Members, Rules (List, Create Or Replace All), Query Plans, Comments. Three searches plus a `SearchWixAPISpec` index scan for a Groups feed-create endpoint returned none; the Forum API intro confirms Wix Forum was deprecated Oct. 15, 2025, and discontinued March 1, 2026.
2. `mcp__Wix__SearchWixAPISpec` x4: read `wix.social.groups.api.v2.Group` (privacy enum PUBLIC/PRIVATE/SECRET; `accessRestriction.type` enum includes `PAID_PLANS`; settings include `aiSpamProtectionEnabled`), `CreateOrReplaceAllRulesRequest` (`rules[].title`, `description`, max 100), Query Plans body, Count Comments body. Transcribed to `evidence/group-contract.json` and `evidence/rules.schema.json`.
3. `mcp__Wix__ExecuteWixAPI` GET `/social-groups-proxy/groups/v2/groups?limit=100`: total 9. IDs: Game Day Threads `1b1232f0-0dca-47ad-b500-cf12c9a3da41` (PUBLIC), Gator Football Talk `74041d23-8785-41f7-8715-7f5562804685` (PUBLIC), Recruiting Central `7b8950ba-2fec-470a-a9c9-3aeaf85989bb`, Gator Hoops `75976f5e-289c-493d-b7ab-ebc869b49e61`, All Gator Sports `40bb6c39-cf82-4b35-a7fc-6ae0124393b3`, The Swamp Lounge `73291075-3751-42b5-b877-ec5ec9349045`, GatorBait Gold VIP Lounge `a6400ba5-8553-44a6-b627-c8cb3377c171` (PRIVATE, ADMIN_APPROVAL), Swamp Talk `590d01c2-5170-4fb8-8f26-2ec65e40b8ab` (PRIVATE, ADMIN_APPROVAL, created Sept. 25), GatorBait Media Group `13047ff1-a8e1-4765-9823-dbe7abc346dd` (PUBLIC, four members, last activity Feb. 10). All have `aiSpamProtectionEnabled: true` and `allowedToCreatePosts: ALL_MEMBERS`. Full result: `evidence/groups.snapshot.json`.
4. `mcp__Wix__ExecuteWixAPI` GET `/social-groups/v2/rules/{groupId}` on four groups: `rules: []` on every one.
5. `mcp__Wix__ExecuteWixAPI` POST `/pricing-plans/v3/plans/query`: 18 plans, four PUBLIC and buyable (ALL ACCESS ANNUAL `ae41ee7a…`, ALL ACCESS MONTHLY `fd37a730…`, MAGAZINE ANNUAL `4349d910…`, MAGAZINE MONTHLY `fb3b8e0e…`) plus GATORBAIT GOLD `af2c283a…` (PRIVATE, buyable). Prices and orders were not saved: `evidence/plans.json`.
6. Built and run: `node deploy/dept-ideas/community/gatorbot.mjs` (dry run, no network). Output `payloads/`: `game-thread-401856708.json`, `porch-401856708.json`, 20 `discuss-*.json`, 3 `rules-*.json`, `manifest.json`. Every payload passed validation against the read schemas: group ID present in the real snapshot, enums in spec, canonical links only, no dollar figures, rules body matching `CreateOrReplaceAllRulesRequest`. `--post` is refused by design.
7. Not verified: whether the Groups pages render on the live site (repo notes say Editor completion is pending), and no group member names were read or stored.

## What it needs from Brenden

1. Yes to using the existing "Game Day Threads" and "Gator Football Talk" groups as the board and the "GatorBait Gold VIP Lounge" as Buddy's Porch, no new groups.
2. Jarvis, under #34 scope, to PUT the three rules payloads and post the Tuesday game thread and Porch call from `payloads/`; GatorBot only generates.
3. A dashboard decision to set the Gold lounge `accessRestriction` to `PAID_PLANS` with the plans in `evidence/plans.json` attached (which plans is his call; no prices change).
4. Buddy's agreement to read the Porch before Wednesday's show.
5. Approval to create the proposed routine `gatorbot-bloody-tuesday` (`CRON_TZ=America/New_York 50 8 * * 2`, generate and hand off only). Not created in round two.
6. Editor completion and mobile QC of the Groups pages before any link goes in the header.

## Risks

- No public REST feed-create endpoint, so the weekly post is a handoff, not a fully automated write. Mitigation: Jarvis posts from the dashboard or a Velo backend; the routine still does the writing.
- Spam, as this feed saw before: mitigated by `aiSpamProtectionEnabled` (already on), a site account to post, rules on every group (none today), and threads that close after the recap.
- Dead board again: the Tuesday routine plus 20 story posts a week means the board is never empty; if Missouri, Week 6 and Week 7 threads draw nothing, stop the routine and nothing is lost.
- Legal exposure from fan posts: rules ban rumor-as-fact, doxxing and harassment; escalation follows `automation/ops-hub/agents/community-director.md`.
- Members-only disappointment if Buddy never answers Porch questions on air: a two-question standing segment and a Thursday note in the thread.
