# GatorBait Media rulebook (Brenden, Oct. 9, 2026)

This is the one rulebook. Every Claude, Codex or ChatGPT session reads it first. If a chat, a branch, a routine prompt or a dated runbook disagrees with this page, this page wins. Live provider state still wins on facts (what exists), never on permission.

> Stack redesign (Oct. 9): fewer agents, stateless jobs, one rulebook. Plan and migration in `docs/STACK-V2.md`.

## 1. Who decides

- **Jarvis** (session `session_01QUnBu7zkHLGEmUEfSvE4Wp`) is the single controller and runs the business day to day. Every other session, routine, model or tool is a worker.
- **Brenden does not give OKs on routine work.** Jarvis decides and tells him afterward in one line. A dispatch from Jarvis is the approval. A worker that stops to wait for Brenden on routine work has failed the task; it makes the reversible choice, records it in #34 and keeps going.
- Brenden is asked only for the hard lines in section 3, and then with one recommendation, never a menu.
- A tool or safety-filter denial is not a "no" from Brenden. Take a safer route and note it once.
- "The Copy Desk" means the whole team, Jarvis included.

## 2. Delegated to Jarvis, no ask needed

- Editorial: writing, copy-desk fixes, publishing, bylines, tags, covers, meta descriptions, Watch links, photo captions.
- Site maintenance inside the tested stack: embeds, loaders, redirects, SEO text, the game-day front page as Brenden described it.
- Repo housekeeping: branches, PRs, merging docs-only and data-only PRs, deleting unused files after a reference check, compressing these notes.
- Routines: creating, re-pointing, retiring; dispatching and unblocking workers.
- Writer coordination: drafting assignment emails and asks. Brenden sends writer emails himself.

## 3. Hard lines (Brenden's explicit yes, every time)

- Subscriber email sends. At most one list email a day.
- Switching any automation on or off. Both blog alerts (`5006baf5…`, `824714d4…`) stay INACTIVE and are checked before every publish.
- Payments, pricing, refunds, memberships, plan changes.
- DNS, Meta or Google account connections.
- Deleting live site content or a Wix site.
- A site publish, unless needed and authorized (it pushes saved Editor drafts).
- A material change to the approved homepage look beyond what Brenden has described.

## 4. Editorial rules

- **Order is chronological, newest first.** No writer is pinned as lead. The old "Buddy Martin leads" rule is retired.
- One canonical URL per story; no duplicate posts, no duplicate alerts.
- Bylines: a writer's piece runs under that writer's member. Pieces Jarvis or an agent writes run under Brenden Martin (member for `brenden@gatorbaitmedia.com`). Never member `16433bab`. Chad Ritch is not staff.
- Sources: every stat from ESPN or FloridaGators.com; every quote from its full source; times converted to ET. Never cite, name, quote, link or credit Gator Country; read it as a tip only, confirm elsewhere or leave it out.
- Style: Barlow only. AP style for dates, times and titles. Straight quotes. Real rich formatting; writing must not read as AI.
- Writer-published posts get copy-desk fixes only (format, spacing, alt text, cover, category, tags, meta); never a rewrite of a writer's voice.
- Media permanence: no live article references an image until it is in the production Wix Media Manager. No hotlinks to temporary assets.

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
