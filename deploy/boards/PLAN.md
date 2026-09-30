# GatorBait Boards: plan and build sheet

Prepared Sept. 30, 2026, for Brenden's request: "a message board or some sort of chat room for my membership so we can have live chats." Read-only against Wix; nothing below has been run. Exact API bodies are in `deploy/boards/updates.json`.

## The answer in one paragraph

Build the board on **Wix Groups**, which already runs on the site, uses the existing member logins and can be tied to the paid plans. Eight of the nine existing groups become the GatorBait boards (six free, two members-only), and the ninth is hidden, not deleted. **The Stands**, the live chat room already built for game days and show nights, supplies the real-time chat that Wix Groups does not have. Jarvis can do nearly all of the setup by API. Brenden has three short items, listed at the bottom.

## Blocker found in this check

**Every board page is currently redirected to the homepage.** On Sept. 28, under Brenden's order to take legacy pages down, 37 redirects went live, including `/groups`, all nine `/group/{slug}` pages and their discussion lists (`deploy/legacy-retirement/applied-redirects.json`). A read-only check on Sept. 30 confirmed four of them are still live (`/groups`, `/group/gator-football-talk`, `/group/swamp-talk`, `/group/gatorbait-gold-vip-lounge`, all to `/`). Until those redirects for the kept boards are removed, no member can reach any board, whatever else we set up. Removing them reverses part of his Sept. 28 order, so it needs his yes (item 1 below), and it waits until the Groups pages pass a check in the current site shell so the old Wix shell does not come back into view.

## What the top Gator boards do (research, Sept. 30)

| Site | Board lineup | Premium model | What stands out |
|---|---|---|---|
| GatorCountry ([gatorcountry.com](https://www.gatorcountry.com/)) | **Premium Insider Forums:** BullGator Den, Insider Recruiting, Full Court Press. **Gator Sports Forums:** **Swamp Gas (general)**, Nuttin' but Net (hoops), Diamond Gators (baseball), Awesome Recruiting, Alligator Alley (other sports). **Community:** GatorTail Pub, Too Hot For Swamp Gas. | A separate premium category; the free general board is Swamp Gas. | Swamp Gas is GatorCountry's **free** general board, not the premium one. Its premium equivalent is BullGator Den. |
| GatorsOnline (Rivals, now on On3), "Swamp Talk" ([on3.com/boards/forums/swamp-talk.56](https://www.on3.com/boards/forums/swamp-talk.56/), redirected from florida.forums.rivals.com) | One main board, 56,300 threads and 1.4 million messages. Sticky "Board Rules" and "Important reminder regarding info on this site"; staff writers start threads on their own stories; "LIVE UPDATES" threads for breaking news (170 replies, 16,000 views on the Aberdeen hearing); "OT:" threads mixed in. | Posts inside premium threads show "This is premium content. Please subscribe to view" while the thread title, poster names and reaction counts stay visible ([example thread](https://www.on3.com/boards/threads/board-rules.1082263/)). Reading the board is free; posting needs an account. | Member ranks by activity (Senior, All-Conference, All-American, Heisman), join dates, post counts, reactions and trophies ([help](https://www.on3.com/boards/help/)). "Install the app" on mobile. |
| 247Sports, Swamp247 ([247sports.com/college/florida/board](https://247sports.com/college/florida/board/)) | One board, "Alligator Alley," 126,831 threads and 3.86 million posts. | VIP membership (running "50% off annual VIP" in September). | Tagline: "For Florida Gators Fans Only. What's said on the Alley, stays on the Alley." |
| Gold standard outside Florida: FSU's "The Tribal Council" on On3 ([on3.com/boards](https://www.on3.com/boards/)) | Main board; Club Level (serious talk, "negative talk and trolling are strictly prohibited"); a private room; Recruiting and Portal Board; Hoops; Baseball; Pro and General Sports; The Locker Room (off-topic, "politics, race and religion topics are prohibited"); a free board. | Premium threads and a paid "Club Level." | The clearest lineup model: one main board, one recruiting board, one per major sport, one off-topic, one premium room. |

What members value, from those pages: one busy main board, staff posting in the threads, a pinned rules post, one thread per breaking story or game, free reading with a login to post, a premium room whose topics are visible but whose posts are locked, ranks and reactions, and a phone app. Big Red Chat was checked as a non-Gator model; bigredchat.com is a parked domain for sale, so it was dropped.

Naming lesson: "Swamp Talk" is GatorsOnline's board name, and "Alligator Alley" is used by both 247 and GatorCountry. GatorBait should not reuse either.

## What Wix Groups can and cannot do (docs and live reads, Sept. 30)

| Need | Wix Groups | Source |
|---|---|---|
| Rename, description, teaser, member title, privacy, settings | **API.** PATCH Update Group. Renaming a public or private group changes its slug. | [Update Group](https://dev.wix.com/docs/api-reference/crm/community/groups/groups/update-group) |
| Rules | **API.** PUT Create Or Replace All Rules. Already set live on Game Day Threads, Gator Football Talk and the Gold VIP Lounge (seven rules each). | [Rules](https://dev.wix.com/docs/api-reference/crm/community/groups/rules/create-or-replace-all-rules) |
| Require a paid plan to join | **Dashboard only.** Groups can be sold through Pricing Plans, and live groups report `accessRestriction.type` (enum includes `PAID_PLANS`), but Update Group has no `accessRestriction` field. | [Pricing Plans intro](https://dev.wix.com/docs/api-reference/business-solutions/pricing-plans/introduction), Update Group schema |
| Approve join requests, add members, member roles | **API.** | [Join requests](https://dev.wix.com/docs/api-reference/crm/community/groups/member-management/join-requests/introduction), [Groups intro](https://dev.wix.com/docs/api-reference/crm/community/groups/introduction) |
| Cover image | Not by API ("You cannot upload your own cover image"). Optional; skipped. | Update Group schema |
| Create feed posts | **No public REST endpoint.** Pinned posts are made by a staff admin in the Groups page or app. | `deploy/dept-ideas/community/evidence/group-contract.json` |
| Hide or delete a group | Privacy `SECRET` hides it; Delete Group exists but is not used here. | [Delete Group](https://dev.wix.com/docs/api-reference/crm/community/groups/groups/delete-group) |
| Group chat room | **None.** The Wix Inbox and Chat APIs are one-to-one business-to-visitor messaging, not a room. | [Inbox intro](https://dev.wix.com/docs/api-reference/crm/communication/inbox/introduction) |
| Spam | AI spam protection is on in all nine groups. | Live read |

Live state on Sept. 30: nine groups, every one with a member count of one except GatorBait Media Group (four, last activity Feb. 10). Every description is still the Wix default ("Welcome to the group! You can connect with other members..."). All nine allow all members to post and comment.

## The recommended lineup

Six free boards, two members-only boards, one hidden. Free boards are PUBLIC: anyone can read, and a free GatorBait login is needed to post, which is how Swamp Gas and Swamp Talk work.

| # | Existing group (ID) | Becomes | Access | One-line description (teaser) | Rules |
|---|---|---|---|---|---|
| 1 | Gator Football Talk (`74041d23…`) | **Gator Football Talk** (main board) | Free | The main board. Florida football every day: games, coaching, roster and hot takes. Free to read, sign in to post. | Already set (7) |
| 2 | Game Day Threads (`1b1232f0…`) | **Game Day Threads** | Free | One thread per game. Opens Tuesday, runs through kickoff and closes after the recap. Live chat runs in The Stands. | Already set (7) |
| 3 | Recruiting Central (`7b8950ba…`) | **Recruiting Central** | Free | Commitments, visits, offers and the transfer portal. Link your source. | New: 8 (core six plus "Link your source," "Do not contact recruits") |
| 4 | Gator Hoops (`75976f5e…`) | **Gator Hoops** | Free | Florida basketball: SEC play, the NCAA Tournament, recruiting and everything hardwood. | New: core six |
| 5 | All Gator Sports (`40bb6c39…`) | **All Gator Sports** | Free | Baseball, softball, gymnastics, track, tennis, golf, soccer and volleyball. If it's orange and blue, it's here. | New: core six |
| 6 | The Swamp Lounge (`73291075…`) | **The Swamp Lounge** (off-topic) | Free | Off-topic. Tailgates, road trips, food, music and life as a Gator. No politics, no religion. | New: 7 (core six plus "No politics, no religion") |
| 7 | Swamp Talk (`590d01c2…`, private) | **The Insider Board**: the premium board, GatorBait's BullGator Den | All Access and Gold ⚑ | The members-only board for All Access and GatorBait Gold. Staff notes, recruiting intel and the real conversation. | New: 8 (core six plus "What's said here stays here," "Staff intel is labeled") |
| 8 | GatorBait Gold VIP Lounge (`a6400ba5…`, private) | **GatorBait Gold VIP Lounge**, home of Buddy's Porch | Gold only ⚑ | GatorBait Gold only. Buddy's Porch, game threads with staff and the monthly AMA with Buddy Martin. | Already set (7) |
| 9 | GatorBait Media Group (`13047ff1…`, 4 members) | **Hidden** (privacy SECRET), not deleted | n/a | n/a | n/a |

Why this lineup:

- It is the Tribal Council and GatorCountry pattern: a main board, game threads, recruiting, one board per major sport, off-topic and a premium room. Nothing is merged, because every one of those boards has a counterpart on the top sites, and the GatorBot "Discuss this story" payloads already target these group IDs.
- "Swamp Talk" is renamed because it is GatorsOnline's board name. It is the right group for the premium board: it is already private, requires admin approval and is the only group with a cover.
- The Insider Board matches plan copy already on sale: ALL ACCESS ANNUAL promises a "Subscriber chat room," and GATORBAIT GOLD promises a "VIP-only live chat room, game day threads with staff" and a "Monthly AMA with Buddy Martin" (`deploy/dept-ideas/community/evidence/plans.json`).
- Buddy Martin leads the premium side: Buddy's Porch in the Gold lounge each game week, questions taken on The Buddy Martin Show, and a monthly AMA. Story links on the boards always point to the one canonical `/post/` URL; the boards never republish articles.
- GatorBait Media Group is hidden, not deleted, per the repo rule against deletion as a shortcut. Its four members and old posts stay, and privacy PUBLIC restores it.

Core six rules on every new rule set: argue the take, not the person; no rumors as fact; no doxxing, no harassment; keep paid content paid; no spam, no promo; staff decisions are final. Full text is in `updates.json`.

Settings on all eight active boards: no automatic daily new-member posts, no automatic "details changed" posts (so our edits do not fill empty feeds with system posts), member list visible, AI spam protection on, and only admins approve join requests. Free boards let members invite friends; the two paid boards do not.

## Live chat plan

- **The Stands** (built, tested 21 of 21, `deploy/dept-ideas/chat/`) is the live chat: game days inside The Tunnel on the homepage and show nights on the show page. It uses the same Wix login through a small Velo token function and gives paid members a Member badge and no slow mode. It covers the "live chats" in Brenden's request, which Wix Groups cannot.
- **Timing:** dress rehearsal Wednesday, Oct. 7, on The Buddy Martin Show (9 p.m. ET), then The Tunnel for South Carolina on Saturday, Oct. 10. The Missouri game on Oct. 3 is too soon.
- **Wix-native fallback:** there is no Wix group chat. If The Stands is not deployed or goes down, the pinned game thread in Game Day Threads acts as the live thread; members comment and refresh, the way Swamp Talk runs "LIVE UPDATES" threads. It is slower than chat but uses nothing new.
- **Hand-off between the two:** the game thread opens Tuesday on the board, The Stands opens at kickoff, and postgame talk returns to the thread when the recap publishes.

## Moderation plan

1. **Rules on every board** (three live, five in `updates.json`), plus a pinned welcome and rules post in each board by a staff admin.
2. **Automatic:** Wix AI spam protection on all groups; The Stands adds slow mode, a word filter, a members-only lock for the first five minutes after kickoff, one-tap reports and auto-hide at three reports.
3. **People:** one named moderator on duty per game window and show night. No moderator, no open room: The Stands stays closed and shows the countdown. Staff writers post in threads on their own stories, as GatorsOnline's writers do.
4. **Ladder:** remove the post, then warn, then remove the member from the board. Doxxing, threats and recruit contact skip straight to removal.
5. **Legal:** rumor-as-fact, recruit contact and harassment are covered by rules. Escalation follows `automation/ops-hub/agents/community-director.md`.
6. **Keep it alive:** GatorBot's Tuesday game thread and "Discuss this story" posts (`deploy/dept-ideas/community/payloads/`) are drafted each week for a staff admin to post, since no API can post to a feed.
7. **Kill test, agreed up front:** if the free boards draw fewer than 30 member posts across the first three game weeks, cut back to three free boards (Football, Game Day, Lounge) and the two paid boards. Nothing is deleted.

## Launch sequence

| When | Step | Who | Type |
|---|---|---|---|
| Day 0 | Canary: PATCH The Swamp Lounge, read it back, confirm post and comment permissions and privacy did not change (`updates.json` step 1) | Jarvis | API write, reversible |
| Day 0 | PATCH the other seven boards (steps 2 to 8), hide GatorBait Media Group (step 9), PUT rules on five boards (steps 10 to 14), read everything back | Jarvis | API write, reversible |
| Day 0 | Connect paid plans to The Insider Board and the Gold VIP Lounge ⚑ | **Brenden** | Dashboard, about five minutes |
| Day 1 | Check the Groups list and a board page at 390 px and desktop in the current site shell: no old Wix header, Today's Edition or Monday Chomp, and no layout jump | Controller (Editor) | Read and QC |
| Day 1 | After Brenden's yes: bulk-delete the 15 board redirects listed in `updates.json` → `routingOnHold`; add a "Boards" link in the member menu | Controller or Jarvis | Routing write, reversible |
| Day 1 | Pin the welcome and rules post in each board; start the Missouri game thread and Buddy's Porch from the GatorBot payloads | Staff admin in the Groups UI | Manual (no post API) |
| Oct. 7 | The Stands dress rehearsal on the show page | Controller after Brenden's deploy | Deploy |
| Oct. 10 | The Stands in The Tunnel for South Carolina | Controller | Config flag |
| Oct. 31 | Review against the kill test | Controller | Read |

## Who does what

**Jarvis by API, as soon as the controller clears it** (`updates.json`, steps 1 to 14):

- Update descriptions, teasers and settings on eight boards, and rename Swamp Talk to The Insider Board (with member title "Insiders").
- Set rules on Recruiting Central, Gator Hoops, All Gator Sports, The Swamp Lounge and The Insider Board.
- Hide GatorBait Media Group (privacy SECRET).
- Approve join requests and assign board admins or moderators when asked.
- After Brenden's yes, bulk-delete the 15 board redirects (`routingOnHold`), checking each ID against the Sept. 28 record first.

**Brenden (kept to three):**

1. **One yes:** reopen the board pages that the Sept. 28 cleanup redirected to the homepage (`/groups` and seven board pages; GatorBait Media Group and old post links stay redirected), and allow a "Boards" link in the member menu.
2. **Dashboard, about five minutes ⚑:** in Wix Groups, set The Insider Board to require a paid plan and select ALL ACCESS ANNUAL, ALL ACCESS MONTHLY and GATORBAIT GOLD; set the Gold VIP Lounge to require GATORBAIT GOLD. This cannot be done by API.
3. **One-time Cloudflare deploy of The Stands** (already on his list from `deploy/dept-ideas/chat/PITCH.md`).

**⚑ Touches membership and pricing.** Only item 2 above: which existing plans unlock the two paid boards. No price, plan, perk text or subscriber changes are proposed. The Magazine plans are left off The Insider Board on purpose, because Magazine stays a separate product. Adding them later is a one-checkbox dashboard change. Existing Gold perk copy already promises the lounge, chat, staff game threads and the AMA, so the plan fulfils promises rather than making new ones.

## Not verified

- Whether a paid-plan group must also be PRIVATE (both paid boards already are, so it does not matter here).
- How the Groups pages look inside the current shell on mobile. This is the Day 1 QC gate, and the redirects stay until it passes.
- Whether a partial `settings` object in Update Group merges or replaces. The canary step checks this before the rest run.
- Whether members can use the Wix mobile app for these groups. Not needed for launch; the boards work in the mobile browser.
- GatorCountry's board sizes and activity: its forum index did not load (404), so only its lineup from the site menu is recorded.

## Brand and style

Board names and copy follow AP style and plain language. Any board graphics, such as covers added later in the dashboard, use Barlow and Barlow Condensed on the Swamp Night palette, like The Stands client.
