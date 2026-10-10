# Start here (every Claude, Codex or ChatGPT session)

One controller, one place to look. This page replaces the scattered handoffs. If a chat, branch or dated runbook disagrees with what is below, this page and the two live sources win.

## The two live sources

1. **GitHub issue #34**, newest comments first. It is the live handoff log: who owns what, every claim before a live write, evidence and rollback after it.
2. **`skills/master-control/references/CURRENT-STATE.md`**. It is the status page: what is live, what is pending, who is waiting on whom.

Everything else is reference. Issue #3 and the dated `docs/*-2026-09-*.md` files are history, not instructions.

## Who runs things

- **Jarvis** (Claude session "Jarvis · GatorBait", `session_01QUnBu7zkHLGEmUEfSvE4Wp`) is the single controller. Every other session, routine, model or tool is a worker.
- A worker opening Claude or Codex starts read-only: report the Git remote, branch, HEAD and uncommitted state; read the newest #34 comments; state which work item it was given. No live write until the controller has assigned it and the scope is claimed in #34.
- Brenden uses "the Copy Desk" to mean the whole team, Jarvis included.

## Read order for real work

1. `skills/master-control/SKILL.md` (the canonical skill; `.claude/skills/master-control` and `.codex/skills/master-control` only point here).
2. `skills/master-control/references/CURRENT-STATE.md` and `LESSONS.md` when current state or a known failure mode matters.
3. The smallest specialist playbook for the surface:
   - homepage or front page: `docs/HOMEPAGE-BASELINE-LOCK.md`;
   - article publishing, blog alerts, Magazine email: `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md`;
   - email list hygiene: `docs/EMAIL-HYGIENE-2026-09-23.md`;
   - social: `docs/SOCIAL-RULES.md` (PR #132 until merged);
   - Wix mechanics: `.codex/skills/gatorbait-wix-operator/references/live-runbook.md`.
4. `automation/ops-hub/policy.json` and `controller-rules.json` only when the task touches money, automation or approval boundaries. Their dated homepage and email-origin shortcuts do not override Brenden's current direction or live provider state.

Do not load everything. Do not create another repo, handoff file, scheduler or renderer to solve a coordination problem.

## Standing editorial rules (Brenden, as of Oct. 9, 2026)

- **Order is chronological, newest first.** No writer is pinned as the lead. The older "Buddy Martin leads" rule is retired.
- One canonical URL per story; no duplicate posts or alerts.
- Barlow only. AP style for dates, times and titles. Straight quotes.
- Every stat from ESPN or FloridaGators.com; every quote from its full source. Convert times to ET.
- Never cite, name, quote, link or credit Gator Country. Read it as a tip only; confirm elsewhere or leave it out.
- Credit the real writer. Brenden's own pieces run under his `brenden@gatorbaitmedia.com` member ("Brenden Martin"). Never use member `16433bab` as a byline.
- Approved homepage: the free sports-news front page in the Gator blue/orange/white game-day look, Magazine separate. Do not materially change it without Brenden's yes.

## Hard lines (never without Brenden's explicit approval)

- Subscriber email sends. At most one list email a day.
- Switching any automation on or off. Both blog alerts (`5006baf5…`, `824714d4…`) stay INACTIVE and are checked before every publish.
- Payments, pricing, refunds, memberships.
- DNS, Meta or Google account connections.
- Deleting live content, repos, folders or Wix sites. Old-named folders can still hold live adapters or rollback files.
- A site publish, unless it is needed and authorized (publishing pushes saved Editor drafts).

## How a live change is made

1. Claim the object in #34 and check nobody else owns it.
2. Read the live object and its revision first. Embeds: under 15,000 characters, in-place PATCH at the current revision with a fingerprint check, category `ESSENTIAL` re-sent.
3. Smallest reversible change, rollback written down before the write.
4. Verify from the live site at 390, 430 and 1366 px (320 when relevant). A model saying "fixed" is not verification.
5. Record evidence and rollback in #34. Counts only in public places, never dollar figures, subscriber data, emails or contact IDs.
6. New failure mode: one line in `LESSONS.md` on a branch, and a prompt change on the routine that repeats the job.

Truth when sources disagree: live provider state, then the current object and revision, then CURRENT-STATE, then policy, then playbooks, then old docs and chats, then the model's memory.

Git: branches and PRs, never a force-push on someone else's branch. Secrets never go in the repo.
