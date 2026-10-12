# Job: morning

Runs once, 6:05 a.m. ET. Do the three jobs below in one pass, then write ONE line to #34 (or none if nothing changed) and tell Brenden only if something is wrong or needs him. Rules are in `docs/START-HERE.md` and win over anything below.

The sections below retain procedures from routines retired Oct. 9-10, 2026 (`docs/STACK-V2.md`). Old routine IDs, copied permissions, account states, games and session assignments are historical evidence, not instructions to reactivate them. Apply `docs/jobs/controller-sweep.md` for reconciliation and `docs/jobs/newsroom-desk.md` for intake/publication; current owner scope and `docs/START-HERE.md` govern every action. Edit this file, not copied routine prompts, when the job changes.

---

## Daily site evaluation

Old routine: `trig_01HEmZEL8TGRa5YVrPFP2pZ6` (Jarvis: daily site evaluation (first thing, 6:05 a.m. ET))

Daily full-site evaluation on the CURRENT build. Brenden, Oct. 7: "do a full site evaluation on the current build first thing every day... look at the front page and evaluate." Apply the current owner scope and rulebook to verified findings. Free tools only.

1. READ FIRST: docs/HOMEPAGE-BASELINE-LOCK.md, newest #34 comments, the shared Codex/Claude pool: every open PR (mcp__github__list_pull_requests, it is large, save and parse) and issue, Codex branches (codex/*), who last touched each, CI state. Triage each diff against current main, current ownership and authorization; a green old branch is not automatic merge permission. Preserve useful source and rollback branches, and route unresolved work to the current owner. Record counts only.
2. SHOOT THE LIVE SITE (read-only): push a branch shots/eval-<yyyymmdd> carrying automation/vision/live-shots.request.json, e.g. {"path":"/","selector":"","widths":"390,430,1365","perf":"1"}, then repeat for /magazine, the newest /post/ page, /gatorbait-media-blogs, /football-roster-schedule (or the live Schedule route) and /florida-football-stats once it exists. The workflow publishes to branch qa/live-shots (concurrency group live-shots; do not run while the game-day desk is mid-render: check the last commit time first). Read metrics.json and view the JPEGs with Read. Use available public browser checks or the existing CI route; re-check actual environment access rather than assuming a historical container limitation.
3. EVALUATE like a senior editor and product owner: (a) front page: order is chronological, newest first, no writer pinned as lead, no duplicates, game-day band shows the NEXT game (opponent, date, time ET, TV), no stale items, no dead links, first-screen load; (b) mobile 390/430 and desktop 1365 overflow, tap targets, cookie banner height, sticky header, Barlow only; (c) performance numbers; (d) console errors and failed requests; (e) article pages: cover, byline, formatting; (f) SEO: titles, meta, canonical, og:image; (g) monetization surfaces and signup forms (bot spam check); (h) Magazine headroom (embeds near 15,000 characters); (i) email health: both blog alerts state, last list email, bounce and complaint counts; (j) cost: anything paid that can be free.
4. ACT: follow the current controller-sweep job: one owned, authorized reversible repair, fresh object/revision, rollback, and provider plus independent public verification. Assign larger work to an acknowledged current owner. Do not revive remembered worker sessions, old lead pins or game queues; preserve the approved homepage and current chronological news order.
5. AUTHORITY: `docs/START-HERE.md` and the active owner request decide permission. The retired routine's Oct. 7 delegation is history; this job grants no additional email, automation-switch, spending, DNS, destructive-content or member-data authority.
6. REPORT: update the existing #34 work item only for a material finding or verified outcome (public counts only). CURRENT-STATE is continuity; do not create a second status board. Tell Brenden only about a material incident, shipment or exact owner-only blocker.

---

## Morning news sweep

Old routine: `trig_01RULitPE99Ch2fcEYhxjSrj` (Morning news sweep (every day))

Morning news sweep. Brenden, Sept. 28: "Why don't we look at the news the first thing in the morning… we are the news… do that for everything in the morning… all the time." It runs every day, game day or not.

The playbook file never merged to main and is not needed; this is the whole procedure:
1. **Know what we have.** List Wix Blog posts from the last 48 hours, plus open drafts, and the holds in #34.
2. **Sweep** every Gators sport, recruiting, and SEC news with a Florida angle, since the last sweep. Stop at about 15 fetches.
   - ESPN team news JSON through TinyFish fetch_content: football at https://site.api.espn.com/apis/site/v2/sports/football/college-football/news?team=57&limit=15, men's basketball at the same path with basketball/mens-college-basketball, and other sports when in season.
   - UF releases in Gmail (from:gators.ufl.edu OR from:floridagators.com newer_than:1d). floridagators.com blocks the fetcher.
   - Gators Wire headlines.
   - A TinyFish search for "Florida Gators" over the last 24 hours.
3. **For each item:**
   - We have it and it changed: update the post in place (Lesson 36).
   - Confirmed and we don't have it: write and PUBLISH a GatorBait story in house voice. "Confirmed" means an official source or two independent credible outlets. Attribute every fact, invent no quotes, use a credited photo or a type-led graphic, add tags and the category, and run the copy desk.
   - Breaking: follow the breaking-news order.
   - Unconfirmed, rumor or analysis: DRAFT it with [CHECK].
   - No Florida angle: skip.
   - Never publish over unpublished edits.
4. **Email:** none by default from this general sweep. Read current account status and campaign outcomes; the retired WARNED snapshot is not current provider evidence. Any separately authorized list send uses `automation/newsletter/send-governor.js`, the current email playbook and duplicate/consent checks.
5. **Report:** record changed canonical links, verification and real blockers in the existing #34 work item, or stay silent when nothing changed. Keep private intake receipts out of public git and comments. Do not dispatch a remembered brief or department session.

---

## Morning Money Report

Old routine: `trig_01Ryb64b1eMgTGNAWivVVPRm` (Jarvis: Morning Money Report (7:44 a.m. ET))

Morning Money Report. Brenden, Sept. 28: "it's your job every day to tell me how you made us some money."

Read-only data work. Sources:
- **Wix Analytics semantic model 'sales'** (5e701449, POST analytics/semantic-model/v3/semantic-models/query-data) for yesterday's ET day (the day starts at 04:00Z during EDT). Cross-check against the Data API TOTAL_SALES; if they differ by more than $1, mark it UNVERIFIED.
- **pricing-plans/v2/orders**, fully paged inside ExecuteWixAPI and returning aggregates only. Key everything by planId, never planName.
- **ecom/v1/orders/search**, split by app: 1522827f plans, 215238eb Stores/merch.
- **Email:** account-details status and rank, plus yesterday's roundup delivered, opened, clicked, bounced and complained.
- **Blog METRICS** for the top 3 posts; Wix sessions; Windsor GA4/FB/IG only if cheap.
- **Never** em-campaign-actions 1df6b270: it returns other sites' data.

**Classify each non-draft order yesterday** as one of:
- WIN-BACK: the buyer has a prior CANCELED order;
- NEW: no prior order;
- TRIAL STARTED: $0;
- TRIAL CONVERTED;
- RENEWAL.

**Renewals due:** count only ONLINE + PAID + auto-renew orders, for 7 and 30 days. Exclude OFFLINE/UNPAID orders using a fresh read; the historical count is not today's total.

**Alerts go at the top:**
- gross below 50% of the 28-day median;
- any refund;
- new PAYMENT_FAILURE cancellations, with $ at risk;
- an email status or rank change, bounces over 2%, complaints over 0.1%;
- site health not OK.

**Tell Brenden in 8 short lines or fewer**, written to be read aloud on a phone:
1. Yesterday's $ by type: renewals, win-backs, new, merch; plus refunds.
2. vs. the 7-day average.
3. The money moves Jarvis made yesterday and their results.
4. Today's 1–2 moves.

On Mondays, add the weekly scorecard in 10 lines or fewer:
- money by type;
- active paid base;
- churn by cause;
- renewal pipeline;
- win-backs recovered;
- paywall (gated posts, trials);
- traffic;
- top 5 posts;
- email;
- social.

**PRIVACY:** the repo and #34 are PUBLIC. NEVER commit dollar figures or subscriber data to git or post them in #34. Keep the numbers in this chat. Use a verified existing private reporting destination only when available and authorized. Don't ask Brenden to decide anything; report what you did.

