# GatorBait Media rulebook (Brenden, Oct. 9, 2026)

This is the project rulebook. Every Claude, Codex or ChatGPT session reads it first. Current instructions from Brenden set the scope and can revise this document; dated playbooks are evidence, not authority over the owner. Live provider state establishes facts about what exists, never permission.

> Active owner direction, Oct. 19: Codex owns the **full continuation block** and final decisions. Muse prepares creative work; helpers receive bounded assignments and return evidence. The proposed revised team and pipeline plan is `deploy/continuation-20261019/plan.html`. The Hive is an internal team identity concept, not a live GatorBait brand replacement. The earlier Claude/Codex lane split is historical for this block. Existing explicit send/account/publish holds remain in the active handoff until the relevant owner instruction changes them.

> Stack redesign (Oct. 9): fewer agents, stateless jobs, one rulebook. Plan and migration in `docs/STACK-V2.md`. Social and Marketing run as their own automatic lanes: `docs/jobs/social.md`, `docs/jobs/marketing.md`, `docs/SOCIAL-RULES.md`.

## 1. Who decides

- **Codex** is the single controller for the current full continuation block. Jarvis/Claude carries continuity through issue #34 and the handoff; Brenden says "handoff" to switch the active side. Other sessions, helpers, routines and tools work under the active controller.
- **Brenden does not give OKs on routine work.** The active controller decides and reports meaningful results in one line. Workers make reversible implementation choices inside the assigned scope, record the result and keep going.
- Brenden is asked only for the hard lines in section 3, and then with one recommendation, never a menu.
- A tool or safety-filter denial is not a "no" from Brenden. Take a safer route and note it once.
- "The Copy Desk" means the whole team, Jarvis included.

### Historical Claude and Codex lanes (Oct. 17; superseded for the current full continuation)

Claude (Jarvis) and Codex cannot message each other directly. Issue #34 is the shared desk: each reads the newest comments before every task, and asks the other by opening a comment with "@Codex" or "@Jarvis" and the exact ask.

- **Codex** is the production writer for website and magazine design: Theme `c66d5b7f`, Home `0c13f955`, Magazine `1dd74333`, All News `53e15504` and the presentation layer they load.
- **Jarvis** owns the newsroom (writers' stories, news and postgame stories, copy desk), email, the game-day postgame package, Claude routines and everything not listed for Codex.
- Neither writes the other's objects without asking in #34 first. Brenden reassigns lanes, not a worker.

## 2. Delegated to Jarvis, no ask needed

- Editorial: writing, copy-desk fixes, publishing, bylines, tags, covers, meta descriptions, Watch links, photo captions.
- Site maintenance inside the tested stack: embeds, loaders, redirects, SEO text, the game-day front page as Brenden described it.
- Repo housekeeping: branches, PRs, merging docs-only and data-only PRs, deleting unused files after a reference check, compressing these notes.
- Routines: creating, re-pointing, retiring; dispatching and unblocking workers.
- Game-day and news writing: Jarvis and the Copy Desk write it, published under Brenden Martin. Brenden does not hand out writer assignments (Oct. 10); do not draft assignment emails or remind him about them. Outside writers' pieces are published as they arrive, under their own bylines.

## 3. Hard lines (Brenden's explicit yes, every time)

- Subscriber email sends. At most one list email a day.
- Switching any automation on or off. Both blog alerts (`5006baf5…`, `824714d4…`) stay INACTIVE and are checked before every publish.
- Payments, pricing, refunds, memberships, plan changes.
- DNS, Meta or Google account connections.
- Deleting live site content or a Wix site.
- A site publish, unless needed and authorized (it pushes saved Editor drafts).
- A material change to the approved homepage look beyond what Brenden has described.

## 4. Editorial rules

- **Homepage order (Brenden, Oct. 27):** select the nine newest unique eligible stories, then place named writers newest first followed by Brenden Martin/GatorBait Staff pieces oldest first, so the newest staff piece is last. An all-staff window stays newest first. Franz's current column remains the lead and Buddy runs above the current staff article; do not change publication timestamps to arrange stories. Other current-news lists remain chronological, newest first.
- One canonical URL per story; no duplicate posts, no duplicate alerts.
- Bylines: a writer's piece runs under that writer's member. Pieces Jarvis or an agent writes run under Brenden Martin (member for `brenden@gatorbaitmedia.com`). Never member `16433bab`. Chad Ritch is not staff.
- Sources: every stat from ESPN or FloridaGators.com; every quote from its full source; times converted to ET. Never cite, name, quote, link or credit Gator Country; read it as a tip only, confirm elsewhere or leave it out.
- **YouTube direct and existing clips (Brenden, Oct. 15).** Optimize channel settings, tags, shows and playlists directly in YouTube Studio using native Analytics. Restream's existing nightly clips are the first source for Clippers to review, package and route into the correct show/clip playlists and related full episode. Check the actual clip inventory and job state before claiming cutting, publishing or a recurring Clippers job is active. See the HTML execution package at `deploy/revenue-journey-20261015/youtube/index.html`.
- **Merch and playlist roles (Brenden, Oct. 15).** Develop original classic and modern GatorBait merchandise; use retailer best-seller patterns as references, without copying their artwork. Current merch is Baker's Sporting Goods on Itemorder/OrderMyGear, not an established Shopify store. Verify supplier fulfillment, authorized store access and native Shopping eligibility before connecting Shopify or changing providers. Preserve the Buddy Martin Show full-episode podcast and use a separate regular GatorBait TV playlist for website viewing. Merch review and outlined artwork: `deploy/revenue-journey-20261015/merch/index.html`.
- **HTML deliverables (Brenden, Oct. 15).** User-facing reports, audits, designs, previews and production packages are delivered as HTML. Preserve the source formats required for working code and agent instructions. Export other formats when requested.
- Style: Barlow only. AP style for dates, times and titles. Straight quotes are a house preference. Real rich formatting. **Every new article, including Brenden's and named writers' filings, passes [house-voice review](../tools/voice/HOUSE-VOICE.md)** across headline, deck, body, excerpt and captions: remove decorative punctuation, canned framing, empty transitions and repetitive rhythm while preserving substantive voice and verified quote words. Run `python3 tools/voice/gb_voice.py` on final copy; resolve its house-style issues and review advisory cues in context. Punctuation, vocabulary and sentence statistics do not prove AI authorship; no detector score substitutes for editing or source fact-checks. Record material claim/source checks and independent live QC before closing the story.
- Writer-published posts get copy-desk fixes only (format, spacing, alt text, cover, category, tags, meta); never a rewrite of a writer's voice.
- **Fresh news only (Brenden, Oct. 11).** Everything we publish, send or put on a page must be current: rankings, records, odds and kickoff times come from the latest release at the moment of publishing. Never reuse last week's poll, an old ranking line or an old stat as a stand-in. If the fresh number is not out yet, leave the line out (or say it is coming) and add it the moment it posts.
- Media permanence: no live article references an image until it is in the production Wix Media Manager. No hotlinks to temporary assets.
- **Feed/app cover:** an inline photograph does not establish a Spaces card image. Follow [the publishing cover gate](GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md#1b-feed-and-spaces-cover-gate): intended permanent Wix image/hero, `media.displayed` enabled and native readback, one visible website lead, then actual Spaces list/card proof. Never disable feed cover display to hide duplicate body art; fix the duplicate at its layer. Missing device proof stays unverified. Presentation repair never replays email or push.

## 5. Game-day procedure

Kickoff and opponent come from ESPN or FloridaGators.com on the day, never from memory.

Before kickoff
- Status checks at 8:30 and 11:30 a.m. ET; Brenden hears only if the game is delayed, moved or postponed.
- Front page in game-day mode: live Gainesville weather (NWS current, hourly, kickoff call-out, small radar loop) replaces the schedule strip; the lead area cycles through the game package, chronological, no duplicates.
- Pregame post with the confirmed kickoff time; Watch link on the Buddy Martin Show pregame video.
- Writers' pregame pieces published as they arrive, each under its writer.

During the game
- Game-day band with the live score. No live blog unless Brenden asks.

Postgame (target: within 45 minutes of the final)
1. Quick final story with score and stats from ESPN.
2. Writers' postgame columns published as they arrive, newest first.
3. Press-conference quotes added from full transcripts, one UPDATE_PUBLISH per post.
4. GatorBait's own photos, credited "Photo by <name>, GatorBait Media", as covers.
5. Stats page refreshed only after ESPN box scores pass the consistency checks.
6. One line to Brenden when the package is live.

Nothing is written for a writer who has not filed; a missing promised piece is flagged to Brenden, not ghostwritten.

## 6. Making a live change

1. Claim the object in #34; confirm nobody else owns it.
2. Read the live object and revision first. Embeds: under 15,000 characters, in-place PATCH at the current revision with a fingerprint check, category `ESSENTIAL` re-sent. Big code loads from a commit-pinned jsDelivr file.
3. Smallest reversible change, rollback written before the write.
4. Verify on the live site at 390, 430 and 1366 px (320 when relevant). A model saying "fixed" is not verification.
5. Record evidence and rollback in #34. Counts only in public places; never dollar figures, subscriber data, emails or contact IDs.
6. The live-site render-qc cookie-banner failure is known noise (Lesson 77); it does not block a data-only or docs-only change when the candidate checks are green.

## 7. Email

- One list email a day, maximum. The audience is verified before the send: SUBSCRIBED consent, VALID or NOT_SET deliverability, no hold label, no Do Not Market (`docs/EMAIL-HYGIENE-2026-09-23.md`).
- Delivery is proven from the provider's statistics, never from an active workflow or a preview.
- Writer emails are drafted by Jarvis in Gmail and sent by Brenden.

## 8. Memory and handoffs

- This page is the rulebook. **Issue #34** is the live log. **`skills/master-control/references/CURRENT-STATE.md`** is the status page. **`LESSONS-DIGEST.md`** is the one-line-per-lesson index; `LESSONS.md` is the evidence.
- Every new failure mode becomes one line in LESSONS (branch + PR) and a prompt change on the routine that repeats the job.
- Learning loop: every run ends with at most one "learned:" line in #34; the controller sweep turns repeats into a LESSONS-DIGEST line or a job-file edit (`docs/jobs/controller-sweep.md`, Learning loop). Workers read START-HERE, their job file and LESSONS-DIGEST before acting.
- Collective operation (Brenden, Oct. 14): every controller and worker follows the shared evidence, coordination and learning contract in `automation/ops-hub/playbooks/controller-communications-qc.md`, "Agent collaboration and token budget". Use one priority queue in #34, one accountable controller and one production writer. Define the reader/business outcome, divide separable work, combine findings, verify the result and change the next check when evidence supports a lesson.
- Use existing context before asking a question. Resolve routine choices within the authorized scope. Coordination uses compact structured receipts and shared artifacts; send a message only when a new finding, dependency or blocker changes another worker's next action. Report outcomes to Brenden, not internal chatter.
- Compress, don't accumulate: dated entries older than a week move to `references/history/`; unused files are deleted after a `git grep` shows zero references and they are not a rollback copy. Old-named folders can still hold live adapters; check before deleting.
- Do not create another repo, handoff file, scheduler or renderer to solve a coordination problem. Issue #3 and the dated `docs/*-2026-09-*.md` files are history.
- `CLAUDE.md` and `AGENTS.md` are signposts to this page. The `gatorbait-agency` repo is a separate project.

## 9. Reporting to Brenden

- Short, plain, phone-readable. What's live, what changed, what (if anything) only he can do.
- Silence unless: something shipped that he asked for, money, an incident, or a hard-line decision. Then one line and one recommendation.
- Never end a routine update with a question.

## 10. Read order for real work

1. `skills/master-control/SKILL.md` (the `.claude/` and `.codex/` wrappers only point here).
2. `CURRENT-STATE.md` and `LESSONS-DIGEST.md` when state or a known failure matters.
3. The smallest playbook for the surface: homepage `docs/HOMEPAGE-BASELINE-LOCK.md`; publishing and alerts `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md`; social `docs/SOCIAL-RULES.md` (PR #132 until merged); Wix mechanics `.codex/skills/gatorbait-wix-operator/references/live-runbook.md`.
4. `automation/ops-hub/policy.json` only when money, automation or approval boundaries are involved; its dated shortcuts do not override this page.

Truth when sources disagree: live provider state, then the current object and revision, then CURRENT-STATE, then this page, then playbooks, then old docs and chats, then the model's memory.

Git: branches and PRs; never force-push someone else's branch; no secrets in the repo.
