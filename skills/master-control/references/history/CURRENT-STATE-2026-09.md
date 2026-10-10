# Master Control Current State — history, Sept. 28 to Oct. 2, 2026

Dated entries moved verbatim from `../CURRENT-STATE.md` on Oct. 10, 2026, newest first. Nothing here is current authority: re-read `../CURRENT-STATE.md`, issue #34 and the live provider before acting. Revision numbers and routine states are historical.

## Oct. 2, ~9:45 p.m. ET: Missouri week close-out, members, navigation plan, Brenden's queue (Jarvis)

### Brenden's queue (he adds here; Jarvis takes the next item from the top)
Brenden, Oct. 2: "push this to your shared file and then take your next queue from me there." Items are worked top-down. Each one is claimed in #34 and checked off here with a link to the evidence. Brenden can add a line here on GitHub, or type it in the Control Room message box. That box pings Jarvis, who copies it here.
1. [x] **Story-page "Explore GatorBait" block.** DONE Oct. 3 ~2 a.m. ET: `59e31550` rev 10, verified at 390/430/1366 (#34). The block must mount inside the post body with inline `display:block !important`, because siblings of the body are hidden on live story pages. After Keep Reading on every story, add big plain buttons: Front Page, Latest, Football, Recruiting, Basketball, Magazine, Buddy's Show, Message Board and Your account. Story pages only (embed `59e31550` Keep Reading, rev 2, 3,981 chars). Show Brenden the 390 px preview first. Small and reversible; no homepage change.
2. [ ] **Category cleanup** (waits on Brenden's "go on categories"). There are 21 categories today. Proposed:
   - **Sections:** Football, Recruiting, Basketball, Baseball, More Gator Sports (Softball and Gymnastics), Gators in the NFL.
   - **Columns:** Buddy, Franz (with Thoughts of the Day), Loren, Eddie, Carlton.
   - **Also kept:** Magazine and The Buddy Martin Show.
   - **Folded:** Featured Article (698) and Gator Breaking News (404) become tags; Spring Football (54), SEC Media Days (1), Aaron Philo (9) and Jon Sumrall (21) move into Football and tags.

   First test on one old post that a category-only update does not move `lastPublishedDate` (UPDATE_PUBLISH does, which would bump old posts into Latest). Move posts first. Retire an empty category only with Brenden's OK (deleting live content). The copy desk then files new posts into the new set. The footer site map (`f8b950c9`, four groups) and the header menu get the new sections after the move.
3. [ ] **Members email "Your membership is more than an email"** (`deploy/newsletter/members-online/members-online.html`; preview at 390 sent Oct. 2). It goes to paid members only, as Tuesday's one email, after Brenden's yes on the preview. Run the send governor first. Swap in that week's stories.
4. [~] **Eddie Gilley (published Oct. 2, `/post/something-s-got-to-give`; Loren and the Magazine cards still pending)'s Missouri preview "Somethings Got To Give"** and **Loren Meadows's Missouri preview.** Both are .docx email attachments the Gmail tools cannot open. They wait on Brenden dropping the files in chat. Then publish under each writer and add them to the Magazine Missouri cards.
5. [ ] **Refund leak.** Wix shows zero refunded plan or checkout orders, so refunds have been made in Stripe or by bank dispute, and those buyers keep access. Fix: refund only from Wix (Sales → Orders), require terms acceptance on the All Access plans and pick one refund rule (plan settings are Brenden's call). Jarvis matches a Stripe refund/dispute export to still-active memberships when Brenden provides one.

### Done Oct. 2
- **Magazine email** c0a2d27d, "Florida at Missouri: Franz's picks and 3 keys". Sent 21:20Z to the verified clean list minus HOLD (533). 511 delivered, 8 bounced (1.5%), 0 complaints, about 34% opened in the first hour. Account ACTIVE, rank BAD (unchanged).
- **Magazine embed `1dd74333` rev 62** (pin 6896ba9) fixed the stray `@media` that left phones unstyled. Verified live at 390 and 1365. The repo-only caption fix 7cc8e9f rides the next pin.
- **Copy desk:** Buddy's "Coaches and Fans" republished at 22:54Z. Fixed the cut-off photo credit, alt text, an apostrophe and the show schedule line (Mon., Wed., Thu. at 9 p.m. ET). Flagged "Two things can't be true" for Buddy.
- **Subscriber billing check.** A 2020 member reported he could not pay for the year. Wix shows his All Access Annual active and paid through Oct. 8 with auto-renew on, and four past renewal failures (stale card). Stripe is charging normally. Since mid-August, the only no-card order is a Sept. 29 dashboard "Pay in Person" order, which Brenden confirmed he made. Abandoned checkouts show as DRAFT/UNPAID and grant nothing. On Brenden's word, Jarvis emailed the member the plans link with a sign-in tip.
- **Brenden's insight:** most older members don't know the website exists; they think they are paying for emails. That is the basis for item 3 and the end-of-story navigation in item 1.
- Still open from earlier: "deploy it" for the PR #116 capture fix (pointer → cfc29c0); six desk stories still bylined "Brenden Martin" (proposed: GatorBait Staff).

## Sept. 30, ~6:10 p.m. ET: Speed cut live, audits, betting-zone research (Jarvis)
- **Brenden:** "everything's a little slow... optimize... dispatch someone to look at the dashboard settings and speed... SEO." And: a betting zone with a Kalshi sponsorship.
- **Measured for real** (live shots `PERF=1`, PR #98): homepage LCP on a throttled phone was **27.9 s** because the feed's image URLs asked Wix for 1000 px PNG cuts (lead cover 975 KB). Story pages: TBT 7.7 s on phones from Wix hydration plus our seven document-wide MutationObservers. Audits in `deploy/speed-2026/` (Wix inventory: 58 embeds, 28 enabled, 219 KB injected per page, no page filters; external SEO; bundle analysis).
- **Live now:** pointer → **dc747be** (PR #99: enc_auto image cuts + srcset, fan modules in a lazy chunk, Story Kit out of homepage.js, esbuild minification, embers deferred) and Home Code `622d8ece` rev **29** (V4 loader: preconnects + one non-blocking Barlow stylesheet, PR #100). After-run: phone LCP 27.9 → 10.1 s, desktop 4.6 → 1.7 s, page 4.07 → 2.12 MB. Rollbacks: pointer → fba3a35; loader → `home-code-loader-4cc4ad3.html`.
- **Story-page embeds quieted (PR #102, ~6:35–6:50 p.m. ET):** nine PATCHes, each guarded by rev + djb2: Policies fb8963cc → 5, FB ViewContent 5ab10e7b → 2, News SEO 4d3ab24a → 5, normalizer c91ad133 → 5, wide canvas a5452619 → 3, Site Fixer 5a43ae83 → 19, Inner Page UI a13b04e3 → 4, header 7fee4de6 → **32** (26 KB logo cut, debounced body observer), mobile shell fdc2127a → **86** (logo cut, meta-scoped viewport observer). Observers now watch `#SITE_CONTAINER`/`body` and stop when done; polls replaced. Rollback per embed: PATCH `deploy/speed-2026/embeds/<id>-live.html` back with the current revision. Untouched: 360c9265, 53e15504, 59e31550, f285a38c (no cost found), game-day band, stats, Magazine.
- **Verified after both batches** (run 36784080732, story page): phone TBT 7.7 → 3.8 s, long tasks 166 → 23; desktop TBT 426 → 264 ms; logo request 25.5 KB. Homepage 390: shell renders, images 517 → 342 KB. **Server time, resolved:** the 3 s responses seen after the PATCHes were Wix server-rendering never-seen `?s=N` query URLs; canonical pages answer in 43–247 ms (runs 36786080882, 36786283557). Verification runs use a fresh query only when Wix's HTML cache must be bypassed, and read TTFB with that in mind.
- **Regression fixed and verified on three runs (PR #104, pointer → 2cd7303, 6:40 p.m. ET; Share button and strip present at 390/1365 on canonical and fresh-query URLs):** on slow phone loads the Share button and Story Kit did not come back after Wix's late header re-render because `headline()` required a laid-out h1; the post title is now found by structure with a bounded mount retry (Lesson 63 amended).
- **Fonts, one chain (8:25 p.m. ET):** `0709a98e` rev 5 → 6 keeps only `sitewide-type.css`; the V4 loader serves the Barlow family in `<head>` sitewide. Rollback body in `deploy/speed-2026/embeds/0709a98e-live.html`.
- **Next:** SEO (story descriptions ≤155 chars, Person author in JSON-LD, category titles).
- **Brenden only:** limit the 19 route-specific embeds to their pages in the dashboard (`pageFilter` is read-only in the API); Wix Site Speed + Search Console vitals; uninstall Hotels/Restaurants/Events; Blog settings; remove the "Today's Edition" heading (Editor).
- **Betting zone:** `deploy/betting-zone/RESEARCH.md` (PR #97). Kalshi has no public affiliate program (media@kalshi.com, private deals; live in Florida, circuit split in 2026); PrizePicks has a real partner application; Polymarket US by email. Applications, pitches and contracts are Brenden's; the Control Room ask offers drafted pitch emails and a Betting Zone page.
- The build now needs esbuild: `NODE_PATH=<dir with esbuild> node sports-live/build-front-page.mjs`.

## Sept. 30, ~2:15 p.m. ET: Autonomous mode, message board, capture, Shell 2026 (Jarvis)
- **Brenden's direction (Sept. 30, midday):** "I would like to not make any decisions ... run autonomously with checks on the emails." Stop-work is lifted. Jarvis makes routine editorial, template and site-maintenance calls inside the tested stack and still asks before money, subscriber sends, automations, DNS, Meta/Google connections and deleting live content. Email rule: at most one list email a day, every send runs `automation/newsletter/send-governor.js` first, no story-alert automations.
- **Routines re-enabled on his word:** morning news sweep `trig_01RULitPE99Ch2fcEYhxjSrj`, daily roundup `trig_01JibZfuK6jRddgK16atrrTQ`, desk inbox `trig_01TrguYhktGZ29Wbr4Wz62FH`, tagging `trig_01VgDMSLDLFkkTvhXrXUCUPu`, Thursday preview `trig_011cSGMQcch48p2wpjaBrWGp`, Monday presser `trig_01JKUBvRUZ3ptM5D3kr4V13T`. New: The Morning After `trig_01YMmshPUh1hcRtGoSqqYU1C` (Tue/Thu/Fri 7:05 a.m. ET) and the hourly copy desk `trig_019J7WB6KNvin4Swma9ut7KM`.
- **Message board (his "one big thing") is live on Wix Groups** (`deploy/boards/PLAN.md`, `updates.json`): Gator Football Talk, Game Day Threads, Recruiting Central, Gator Hoops, All Gator Sports, The Insider Board (PRIVATE, member title Insiders), Gold VIP Lounge; the GatorBait Media Group is SECRET. Rules posted on five boards. The 15 Sept. 28 redirects on `/groups` and the board paths were bulk-deleted, and `/groups` shows the feed on phone and desktop (cache-bust the URL to re-test). Still his: lock The Insider Board to ALL ACCESS ANNUAL/MONTHLY and GATORBAIT GOLD and the VIP Lounge to GOLD in the dashboard (pricing plans), pin the Missouri thread and Buddy's Porch, delete two spam posts and turn on post approval.
- **Newsletter capture is live** (PR #93, pointer `677d5c3`, `deploy/capture-2026/README.md`): "Get GatorBait Magazine free" on the homepage hub and inline/end/slide-up cards on every story page, submitting to the existing Wix form `6babfee8` (double opt-in, spam filter) with an anonymous visitor token. Probe-verified on the live site (run 36753071936). Unproven: a real signup through the spam filter. Optional: add a hidden `signup_source` field to the form.
- **Shell 2026 is live** (PR #94, `deploy/shell-2026/`): header `7fee4de6` rev 30→**31** (13,880 chars, djb2 2936686448) with an orange Shop Gear button on desktop and in the phone shell bar, one sitewide menu in the Front Page order (Front Page, Latest, Magazine, TV & Podcasts, Scores & Schedule, Roster, Community, Store), every store link in a new tab; footer `f8b950c9` rev 27→**28** (5,282 / 2832029672), navy on every page, with a Gear band and a four-group site map; homepage pointer → **9653d73** (Store ↗ in a new tab, never clipped). Rollback: PATCH `header-live.html` (14,993 / 3866161232) and `footer-live.html` (2,156 / 2641281746) back only if the live hash still matches v2; pointer → `677d5c3`. Stats links stay off (`STATS=false`) until `/florida-football-stats` exists.
- **Regression caught and fixed:** header rev 31 left the hidden native header h1 first in DOM order, so the story Share button and Guide strip mounted into display:none (live shots run 36754221352). PR #95 (`headline()` picks the first visible h1; QA fixture carries the hidden h1); pointer → **fba3a35** (deploy commit 4089fb2). Lesson 63.
- **Covers:** covers listed in `front-page.config.json` `covers[]` show whole on the front page (PR #92, `fp-cover` contain frame).
- **Cloudflare:** the account still lists 0 Workers; the fan modules (Ask GatorBait, Make the Call, The Stands) stay dormant until Brenden runs the Terminal paste or imports the repo in the dashboard. LibreChat (#167 in the agency registry) duplicates Ask GatorBait; not standing it up.
- **Waiting on Brenden (Control Room asks):** Cloudflare deploy; board plan locks, pins, spam cleanup and post approval; place the Ask Buddy form; delete the "Today's Edition" heading; theme fonts to Barlow; native menu cleanup; blank pages `/florida-football-stats` and `/standings` (then flip `STATS`/`l` flags in header, footer and Story Kit); Metricool network connections; vidIQ credits; Perspective onboarding; canonical social accounts; support email and founding year.

## Sept. 30, ~2 p.m. ET: Story pages overhauled, covers, columnists, copy desk (Jarvis)
- Homepage build pointer `sports-live/current.json` → `eece061` (PRs #82, #83, #85, #86). Story pages (`/post/`, embed `f285a38c` follows the pointer) carry the Story Kit: GatorBait Guide strip after the Share button, first-mention links to the roster/schedule/stats pages, "Keep up with the Gators" cards. Verified by live shots at 320/390/430/1365 (run 36746107824, Lesson 61). Eddie Gilley is on the homepage Columnists rail. Rollback: pointer → `499dca9` (before the Story Kit) or `cfe4b4b` (before Eddie).
- Buddy Martin's Faulkner column `0753a25b`: body un-bolded, five copy fixes, Baugh's average corrected from ESPN, tags fixed, and a new layered cover (`d3cfa5_56a64986…`) from the story-cover renderer (`deploy/covers/`, Lesson 62).
- New routine: hourly copy desk `trig_019J7WB6KNvin4Swma9ut7KM` (7 a.m.–11 p.m. ET) fixes formatting, captions and tags on writer-published posts and checks game numbers against ESPN.
- Skill `skills/gatorbait-site-operations/SKILL.md` now carries #34 claims, stop-work, no site publish and the hard lines (PR #87, after the design-system session's handoff).
- Waiting on Brenden (Control Room asks): Cloudflare deploy of the three fan modules (no Workers exist yet), Ask Buddy form placement, Game Threads and Porch posts (no Groups feed API), Metricool network connections, vidIQ credits, Perspective onboarding, approval to create The Morning After routine (classifier-blocked), plus the cleanup list (draft sites, unused apps, Stores V1 product pages).

## Sept. 30, ~9:15 a.m. ET: Tunnel record, fan-module mounts, Game Graph (Jarvis)
- Homepage build pointer `sports-live/current.json` → `cfe4b4b` (deploy commit 85272eb). The Tunnel shows the opponent record ("No. 25 · 3-1", from `scoreboard.json` `next.opponentRecord`, ESPN summary). Make the Call, Ask GatorBait and The Stands are bundled but mount only once `deploy/cloudflare/endpoints.json` exists on Pages with the three Worker URLs; the Workers deploy from Brenden's Mac (`wrangler login` + `deploy`). Verified by live shots run 36719666693 (build `3699f7f3`, 390 and 1365). Rollback: pointer → `9f166e2`.
- New homepage-only embed `1261f2b9-3dbf-4a2b-96e7-a13063534398` "GBM - Gators Game Graph v1 (homepage JSON-LD)" (HEAD, ESSENTIAL, rev 1, `deploy/seo-2026/home-game-graph-v1.html`). Refreshed by the Tuesday routine. Rollback: disable it.
- Kickoff Watch (`.github/workflows/kickoff-watch.yml`) is armed: Saturday read-only homepage checks, comments on #34 only on failure.
- Waiting on Brenden: Worker URLs from the Mac paste; Editor steps (place the Ask Buddy form `8ab68d60-d973-4cf4-bbd5-47dcdbf94774`, delete the "Today's Edition" heading); the Buddy column Blog draft and the first Game Threads post.

## Sept. 30, ~7:30 a.m. ET: Share GatorBait live (Jarvis)
- Homepage build pointer `sports-live/current.json` → `b4158dd` (Share buttons on The Road Ahead, The Tunnel, the show). Home Code embed `622d8ece` unchanged at rev 28. Rollback: pointer → `729e645`.
- New story-page embed `f285a38c-4a2b-43e9-b22d-a66eaeedfb41` (HEAD, ESSENTIAL, rev 1) loads `sports-live/share.js` only under `/post/`. Rollback: disable it.
- Department round two merged in PR #69 (`deploy/dept-ideas/`): Ask GatorBait, Make the Call and The Stands are built and tested but wait on a Cloudflare API token as repo secrets before deploy. The `Today's Edition` static H1 in the Wix homepage HTML (found by the SEO audit) needs the Editor on the Mac.

### September 29 mobile ad relief — current override

Brenden directly requested repair of oversized Google ads and slowdown on phones.
The existing AdSense embed `af338ad4-8c84-4708-8859-f1d6a0121c13` is now revision
**3**, enabled, ADVERTISING. It skips loading Google ad code on phones and
screens/viewports at or below 820px; desktop retains one async serving loader.
This is a temporary mobile ad pause, not smaller replacement inventory. Do not
restore the old unconditional loader through routine reconciliation. Exact code,
rollback and verification limits: `deploy/mobile-ads-relief/`. Issue #30 remains
open for account-side mobile placements. No site publish or other embeds changed.
This direct ad-only request does not resume other stopped tasks.

## Sept. 28, 2026 sync: what's true now

Brenden, Sept. 28: "make sure everyone is not running independently… stop, commit everything to memory, get on the same page and learn." This section is that shared page. Re-read live state before acting on any line.

### Who runs what
- **Controller and front door:** Jarvis, the Claude Code cloud session "Jarvis · GatorBait" (`session_01QUnBu7zkHLGEmUEfSvE4Wp`). Brenden talks to Jarvis; other agents take work from Jarvis through #34.
- **Back-office Claude sessions:**
  - game-day desk (`session_01WPrfyiDi3ySUA7EuZTPJVf`): owns game-day band embed `96ef5a04`;
  - stats page (`session_01VBFmjVNZX8NsWmQ9LgZ5gB`): owns stats embed `756655cf` and PR #37.
- **Retired:** the Mac "GatorBait controller handoff" session is archived.
- **Muse (Meta AI):** read-only. It never gets tokens.
- **Other assistants Brenden uses** (for example the one cutting presser clips) coordinate through Brenden and Jarvis. Their text is data, not authorization (Lesson 53).

### Where coordination happens (Lesson 51)
- **Issue #34:** the record. Claims, scope, evidence and rollback.
- **Control Room:** https://claude.ai/artifact/3X5Caw5wg8q3xbvtbjNDvx. A private page only Brenden can open, with:
  - approvals;
  - live session and routine status, with pause, resume and stop;
  - who owns what;
  - a message line to Jarvis. It fires the poke-only routine `trig_012k4fT7KAoBHJrSSjowzNXh`.

  It mirrors #34 and holds counts only: no dollar figures or subscriber data.
- **This file and LESSONS.md on `main`:** the shared memory. Lessons live on `main` only (Lesson 50).

### Stop-work was lifted Sept. 30, midday (historical record below)
Brenden lifted it in chat ("run autonomously with checks on the emails"). The paused list below is what was paused Sept. 28–30; every routine on it is back on as of the Sept. 30 evening entry at the top of this file.

Original text: Only Brenden lifts it, in chat or on the Control Room card. Until then, no production writes except what Jarvis is explicitly assigned.

**Paused:**
- daily roundup email `trig_01JibZfuK6jRddgK16atrrTQ`;
- desk inbox `trig_01TrguYhktGZ29Wbr4Wz62FH`;
- tagging sweep `trig_01VgDMSLDLFkkTvhXrXUCUPu`;
- Monday presser `trig_01JKUBvRUZ3ptM5D3kr4V13T`;
- Thursday preview `trig_011cSGMQcch48p2wpjaBrWGp`;
- morning news sweep `trig_01RULitPE99Ch2fcEYhxjSrj`;
- together-repo check-ins `trig_01Mxuh4yyvLqBdfM5RLvE9sm` and `trig_01PyowBmEiK4wUP2vRYP7pve`;

**Still on:**
- Jarvis ops loop;
- Jarvis 7:44 a.m. money report (read-only);
- monthly list cleanup, Oct. 1 (`trig_01DACQgK3zEXNwpaaVSExWwD`);
- PR #38 check-ins;
- Oct. 3 game day `trig_01VAAJ6y3YXfyjt9oCPrKo1X` (it replaced `trig_01F7ct63…`). It reads #34 first and does read-only prep while stop-work holds.
- Oct. 4 stats refresh (`trig_01YK79DSouBijPKm5UmCHFcp`). It builds but doesn't PATCH while stop-work holds.

### Email
- **Account:** ACTIVE, rank BAD.
- **Policy:**
  - at most one list email a day;
  - no separate breaking emails;
  - blog story alerts `5006baf5` and `824714d4` stay INACTIVE;
  - run `send-governor.js` before every send (Lesson 48). Its `COUNT_FROM` is still `null`.
- **List:**
  - clean-list label `POY89`: 1,138 contacts;
  - 161 bounced, spam or inactive contacts moved to label `6CIbP`; rollback is re-adding tags `oHon1`/`1TOl1`;
  - double opt-in is on for form `6babfee8` (rev 2).
- **Sept. 28 Monday roundup:** campaign `435d6183`, sent to 300 engaged contacts on Brenden's one-time override.

### Site
- **Live embed revisions after the Sept. 28 font pass:**
  - homepage `fdc2127a` rev 84;
  - Magazine `1dd74333` rev 41;
  - Home Code `622d8ece` rev 15;
  - `7fee4de6` rev 28, `a13b04e3` rev 3, `82c4ca83` rev 20, `f8b950c9` rev 26, `fb8963cc` rev 4.

  Revision numbers in older sections are historical.
- **Homepage lead:** Home Code pins Franz Beard's "Who are these guys?" story as the lead until Oct. 5 at noon ET, unless a newer Buddy Martin piece or breaking news takes it. After that, the Buddy-first rule resumes. The approved sports-news homepage is otherwise unchanged.
- **Type:**
  - Barlow only. Today the live embeds' Arial overrides were switched to Barlow.
  - PR #38, the Georgia/Times purge plus a CI guard, waits for Brenden's merge.
  - The Wix theme fonts still need an Editor change by Brenden.
- **Redirects added:**
  - `/my-account`, `/login`, `/signin` and `/sign-in` → `/account/my-account`;
  - `/SUBSCRIBE` → `/pricing-plans/subscribe`;
  - `/forums` → `/`.

  Blank extra Wix sites were unpublished.
- **gatorbait.net** belongs to a third party and redirects to an adult site. Never link to it.
- **Paywall and signup audit** (read-only):
  - 0 of the 26 newest posts are gated;
  - Magazine Monthly is missing from gated posts' plan lists;
  - checkout has a "Choose a date" step;
  - the paywall prompt shows no price or trial.

  Proposed rules (gate columns, deep analysis, recruiting and Magazine features; keep news, recaps and galleries free; at most about 30% gated a week) wait on Brenden's "fix the paywall."

- **Design system session, Sept. 28 at Brenden's request** (21:45–22:10Z, during stop-work; Jarvis now owns these):
  - redirects `/message-board` → `/groups` and the About-page hashtag links → `/the-buddy-martin-show` and `/groups`;
  - embed `78528a4b` ("How billing works" note on `/pricing-plans*`, text only);
  - a full site publish at about 22:03Z, after which the 12 static pages' SEO was re-applied. Homepage SEO survived.

  Its design system is PR #1 in Presidente49/together, Barlow only. The Back Porch Sports proposal is PR #2 there, a private artifact waiting on Brenden.

### Video
- **UAA rules:** editorial use only; 3 minutes or less per interview clip; 10 minutes or less a day in total.
- **Sept. 28 Sumrall presser:**
  - Another assistant cut eight vertical clips and keeps an "Ops Hub" Google Doc next to them. That Drive isn't shared with brenden@gatorbaitmedia.com yet (Lesson 52).
  - Jarvis adds word-by-word subtitles in Descript: lower third, Barlow, source resolution, one encode.
  - Clips post natively to Facebook and YouTube, not as embeds on the site. Captions link gatorbaitmedia.com and the story.
  - Brenden approves before anything posts.
- **Story:** "Pay the Toll" (`50399e36`) is the presser story. New material from the clips updates it instead of becoming a duplicate article.

### Waiting on Brenden
- Merge PR #38.
- Wix theme fonts.
- Fix the paywall.
- Refund terms (30 days recommended).
- Checkout date step.
- Win-back email to 58 inactive paying readers.
- Move `backups/crm/2026-09-18-bad-email-purge-inventory.txt` out of this public repo.
- Connect Search Console.
- Delete the old GitHub tokens given to Muse.
- Lift stop-work.
- Share the presser folder with brenden@gatorbaitmedia.com.
- Add the two blank Wix pages (`/florida-football-stats`, `/standings`) in the Editor.
- Finish the FCC key on the Mac (card `fcc-mac-key`).
- Decide on the four draft Wix sites and the unused apps (below).

**Look lock withdrawn (Brenden, Sept. 29 ~11:30 p.m. ET: "I didn't lock anything, you can do anything you want").** Front Page 2026 with Swamp Night stays the everyday look; design changes are Jarvis's call again, small, reversible, tested, recorded in #34. Home Code `622d8ece` is at rev **28**: the **V3 loader** reads `sports-live/current.json` from GitHub Pages each minute and loads `homepage.js` at that commit (fallback baked in: `4cc4ad3`). **Deploy or roll back a build by changing `current.json` on `main`; the embed no longer changes per build** (`deploy/front-page-2026/README.md`). Why: on Sept. 30 Wix served desktop visitors homepage HTML with an embed revision 30–45 minutes old after a PATCH. Live now (`4cc4ad3`, build stamp `478953c7` as `data-fp-build`): The Road Ahead season band (geometry fixed at rev 26 after Brenden's "road ahead look off"; painted from the bundled schedule since rev 27) and **The Tunnel** game-day opener (Brenden: "tunnel"), which shows on Saturday game days or with `?gbm_fp=gameday`. Real-browser screenshots of production: push a `shots/<name>` branch with `automation/vision/live-shots.request.json`, then read branch `qa/live-shots`; each shot records the loader commit served and the build stamp. History in `docs/HOMEPAGE-BASELINE-LOCK.md` and `deploy/front-page-2026/README.md`.

### If Jarvis hits its usage limit (Sept. 29, 8:30 p.m. ET)
Brenden asked to consolidate onto FCC. FCC has no provider key yet (card `fcc-mac-key`), so nothing can run there today. Until it does:
- **Safe on any model, read-only:** the five briefs in `automation/ops-hub/model-router/jobs-pending/`; the daily Money Board row; health reads.
- **Claude only, never FCC:** anything touching Wix embeds, email, members, billing, DNS, accounts, or the Control Room's approvals.
- **Live state to protect:** homepage = Home Code `622d8ece` rev 28, V3 loader; the build it runs is `sports-live/current.json` on `main` (rollbacks in `deploy/front-page-2026/README.md`; rev 22 Gazette body `home-code-rev22.html` is the full fallback); Magazine `1dd74333` rev 48; ad guard `af338ad4` rev 4 (Google ads off sitewide). Codex's Sept. 30 8:30 a.m. rotation may write Magazine only, not `622d8ece`.
- **Open on Brenden:** delete the purge file on GitHub, FCC key, draft sites, unused apps, branch cleanup, blank pages (or tap "Jarvis, add them"), Money Board connections (vidIQ, Metricool, Wix Payments ID), Restream reconnect.
- **Wake path:** Control Room https://claude.ai/artifact/3X5Caw5wg8q3xbvtbjNDvx (Tell Jarvis / Show tab) fires routine `trig_012k4fT7KAoBHJrSSjowzNXh` into the Jarvis session; the 2-hour ops loop and 7:44 a.m. money report keep running.

### Sept. 29 evening sync (Jarvis, about 6:45 p.m. ET)
- **Controller:** Jarvis since about 5:05 p.m. ET (#34 comment 5899619687). Codex released its root claim. Codex's Sept. 30 8:30 a.m. Feature Rotation task may write only Home Code `622d8ece` and Magazine `1dd74333`; Jarvis reads afterward.
- **Homepage (Sept. 29 ~7:45 p.m. ET; rev 25 and 26 followed, see the lock note above):** Front Page 2026 with Swamp Night as the everyday look. Home Code `622d8ece` rev **24** was a 521-char loader pinned to `main` commit 2c4f4f5 (`sports-live/homepage.js`, built from `sports-live/src/front-page.*` and `front-page.config.json`, `look: "swamp-night"`). Live QC run 36644613421 passed at 320/390/430/desktop. Rollback: `deploy/front-page-2026/home-code-rev22.html`, one PATCH. Codex's Feature Rotation must not write `622d8ece`; the renderer holds its own lead rule and Magazine module.
- **Live embeds:** Magazine `1dd74333` rev 48 (14,918 chars, matches `deploy/magazine-urban/` on `main`, PR #47 merged); Home Code `622d8ece` rev 28 (V3 loader; was rev 22 Gazette body until Sept. 29 evening); Home Styles `1255a4cf` rev 6; Latest `53e15504` rev 8; article template `14a887e3` rev 8; header `7fee4de6` rev 30; ad guard `af338ad4` rev 4 (ads off); game-day band `96ef5a04` rev 45 (hidden). Header, Home Styles, Magazine and template are within 100–250 characters of the 15,000 cap.
- **Sessions:** "Design system extraction" (`session_01Cu77eQL88aDsCSGAnQPsaF`) finished its CX audit (doc `e3b71299…`, 8 fixes live, 12 decisions for Brenden); it holds no write authority. Stats page session is blocked on a `send_later` permission prompt in Brenden's desktop app and on the blank page. Game-day desk hit its session limit. The Mac controller-handoff session is archived, so the Wix Editor MCP is unavailable until Brenden opens a new Remote Control session.
- **Store (Catalog V1 on the production site):** six visible products (Franz Beard's *The Golden Season*, four shirts, a mug). They took real orders this year, so they stay visible. No redirects. Everything else in the order list is pricing-plan checkouts.
- **Draft Wix sites, all Free plan, Draft, created Sept. 20, no domain:** "Gatorbait Media 1" `4d9e149d`, "My Site" `468abff9`, "My Site 1" `5c77acfa`, "Gatorbait Media" `b4032e65`. They hold no live adapters. Trashing them is Brenden's call (card `draft-sites`).
- **Apps on the production site with no visible use:** Wix Hotels, Restaurants Menus, Restaurants Orders. Invoices, Pay Links, Events and Forms & Payments may back checkout or old records; do not remove any app without Brenden's yes and a dashboard check (card `unused-apps`).
- **Purge file:** `backups/crm/2026-09-18-bad-email-purge-inventory.txt` is still in this public repo. Two attempts to move it (Drive upload, `git rm`) were refused by the auto-mode classifier. Brenden removes it by hand or allows it explicitly; git history keeps it either way.
- **Control Room routing:** the message routine `trig_012k4fT7KAoBHJrSSjowzNXh` is bound to the Jarvis session. Messages on the hub dated Sept. 30 00:10–01:00Z from "Jarvis" were written by another session without Wix or GitHub tools; the approvals they cite are unconfirmed (asks stay `open`).
- **New connectors seen Sept. 29:** Shopify, Descript `search_drive`, Idiolect writing profiles, Miro board preview. None is wired into a job yet.
- **Group think (Sept. 29 ~7:15 p.m. ET):** `docs/GROUP-THINK-2026-09-29.md` (decisions, job inventory, FCC lane, tool swaps, branch disposition) and `automation/ops-hub/SPEND-GUARDRAILS.md`. Five FCC briefs wait in `automation/ops-hub/model-router/jobs-pending/` for Brenden's key. `ops-hub-cloud-cycle` now runs hourly. GitHub Pages (`pages-build-deployment`, active, builds `main`) serves the repo root, so the purge inventory file is reachable on the web until Brenden removes it.
