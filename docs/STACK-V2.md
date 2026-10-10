# Stack v2: fewer agents, one rulebook (Brenden, Oct. 9, 2026)

Brenden: "It all seems a little too broken. Maybe there's just too many agents involved. Redesign the stack the way it's supposed to work. Don't use anything I told you to use in the past; use whatever is best to keep things in the directive."

The directive: a free Florida Gators sports-news site that runs itself, publishes the writers' work cleanly, and costs Brenden almost none of his attention. Jarvis decides; Brenden is asked only for the hard lines in `START-HERE.md`.

## What is actually broken (evidence from Oct. 9)

1. **Too many long-lived chats.** Eight worker sessions plus Jarvis, each with its own half-remembered context. One sat idle for 2.5 hours waiting for a "yes" it did not need. One (the Mac session) never answered. One died on a usage limit days ago and nobody noticed. The Jarvis session alone has read billions of cached tokens re-reading its own history.
2. **Rules copied into 21 routine prompts.** They drift. Tonight two of them still said "Missouri week" and "Buddy leads" after Brenden had retired both.
3. **Six routines fire every hour** and mostly check an empty inbox. Each wakes a big session to do it.
4. **A tool nobody can reach.** Several fixes (link previews, plans page, sitemap, Donate) wait on the Wix Editor, which only works from Brenden's Mac while he is logged in.
5. **Noisy gates.** render-qc fails on a cookie banner and turns good PRs red; safety filters blocked two routine actions tonight.
6. **State in too many places.** Handoffs in chats, issue #3, issue #34, CURRENT-STATE, docs, and the Control Room page.

## The design

Three layers, no more.

**Layer 1: Brenden talks to one chief of staff (Jarvis).** Jarvis keeps a short context. Memory lives in the repo, not in the chat: `docs/START-HERE.md` (rules), issue #34 (log), `CURRENT-STATE.md` (status), `LESSONS-DIGEST.md` (what went wrong before).

**Layer 2: stateless jobs, not persistent workers.** Every unit of work is one of:
- **A scheduled routine in a fresh session.** Its prompt is a few lines: "Read `docs/START-HERE.md`, do job X, write one line to #34." It never copies the rules, so rules cannot drift. It starts empty, so it cannot be stuck on an old conversation.
- **A one-shot build** for anything bigger (a new module, a redesign): a single session scoped to a branch and a PR, finished when the PR is merged. It is never reused as a standing "department."
- **A deterministic script, no AI.** Anything that is a lookup runs as GitHub Actions or in the visitor's browser: ESPN scores and stats into repo JSON, the NWS forecast and radar in the page, tag/sitemap checks, link checks. AI is for writing and judgment, not for fetching.

**Layer 3: the live systems, written only through the Wix API and GitHub.** Wix REST for posts, embeds, redirects, SEO, email; GitHub for code and the jsDelivr-pinned loaders. The Editor is not in the daily path. Editor-only changes are batched into one list that Brenden clears in a single 15-minute sitting, or dropped if the API route exists.

### Routines: 21 down to 8

| New routine | Replaces | Cadence |
| --- | --- | --- |
| **Newsroom desk** | hourly copy desk, desk inbox + YouTube, postgame ingest, Franz Thoughts of the Day, daily tagging sweep | every 15 min in the 2 hours around a game, hourly 7 a.m. to 11 p.m. otherwise, and quiet when nothing arrived |
| **Controller sweep** | QC and learning loop, Master Control running back, routine watchdog | every 2 hours, 7 a.m. to 11 p.m. |
| **Morning** | daily site evaluation, morning news sweep, Morning Money Report | 6:05 a.m., one run, one #34 line, one note to Brenden only if it matters |
| **Game week** | Monday presser + injury check, Thursday preview + magazine draft, Sunday Game Week Card, Tuesday Game Graph, The Morning After, Bloody Tuesday thread | day-of-week branches inside one routine |
| **Roundup email** | Daily GatorBait Roundup email | unchanged; the one list email a day (hard line) |
| **Game-status** | the one-shot checks | scheduled per game from the ESPN schedule |
| **Sunday ledger** | Sunday Ledger | weekly |
| **List cleanup** | Monthly email list cleanup | monthly |

Nothing is switched off that sends email or controls a Wix automation. Only Jarvis's own scheduled jobs are merged.

### Tools

Keep what is free, scriptable and reachable from the cloud: **GitHub** (state, PRs, Actions), **Wix REST** (every site write), **ESPN and NWS public JSON** (fetched by Actions or the browser), **Gmail** (intake and drafts), **Chromium/Playwright** (verification screenshots), **jsDelivr** (pinned code for embeds). Drop what is flaky or dead: the Mac Editor session, the paid scraping wallet, Codex as a parallel controller, per-department chats, the Control Room page as a second status board (its useful rows move to #34 and CURRENT-STATE).

### Rules for the stack

1. One controller. No worker waits on Brenden; none persists.
2. Rules live in one file. Routine prompts say what to do, never what the rules are.
3. A deterministic script beats an AI call for anything that is a lookup.
4. A job that finds nothing stays silent.
5. Every job ends with one line in #34 or no line at all.
6. A gate that is noisy gets fixed or demoted; a red check that is known noise does not block a docs-only or data-only change.
7. Cost matters: fresh short sessions, small prompts, no re-reading history.

## Status (Oct. 9, ~11:20 p.m. ET): migrated tonight, no freeze

Brenden asked not to freeze tonight, so the routine consolidation was done immediately:

- **Four routines created** (`Newsroom desk`, `Controller sweep`, `Morning`, `Game week`), each a two-line prompt that reads `docs/START-HERE.md` and one file in `docs/jobs/`.
- **17 old routines disabled, not deleted** (rollback: re-enable). Kept as they were: Daily GatorBait Roundup email, Sunday Ledger, Monthly list cleanup, and the 8:30 and 11:30 a.m. game-status checks.
- **One limit found:** the routine tool cannot attach connectors (Wix, Gmail) to a fresh session in this organization, so a fresh-session routine would have no tools. The four routines therefore fire into the controller session, which holds the connectors. True fresh-session routines need connectors attached in the claude.ai routines screen. Until then the controller session carries the load, so keep its prompts short and its context lean.
- **Still to do:** retire the standing worker sessions after their last PRs merge; move the Control Room page's live rows into CURRENT-STATE.

## Migration plan (original)

**Tonight (Oct. 9):** freeze. Game day is Saturday at 12:45 p.m. ET and the front-page rebuild, the weather module and the stats refresh are in flight. No routine is merged or retired before the game. Only the rules were fixed (`START-HERE.md`).

**Sunday, Oct. 11, after the postgame package is live:**
1. Create the eight routines from the table, each with a short prompt pointing at `START-HERE.md`.
2. Run each once beside the old ones and compare #34 lines.
3. Retire the old routines the new ones replace; leave the roundup email and Wix automations untouched.
4. Retire the standing worker sessions after their last PR merges. New work is one-shot.
5. Move the Control Room page's live rows to CURRENT-STATE; leave the page for reading.
6. Post the before/after count in #34.

**Rollback:** the old routines are disabled, not deleted, for one week; re-enable if a new one misses a job.

## What Brenden should expect

After the migration: one thread to talk to, a rulebook that cannot drift, far fewer wake-ups, and quiet unless something needs him. What still needs him: the hard lines, and the short Editor list.
