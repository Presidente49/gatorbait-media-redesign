# Master Control Current State

## Oct. 9, ~11 p.m. ET: South Carolina week, chronological order, handoff signposts (Jarvis)

- **Order rule changed (Brenden, Oct. 9):** the front page is strictly chronological, newest first. No writer is pinned as lead; the "Buddy Martin leads" rule is retired. Applied to the overnight story-desk routine; the game-day desk is applying it to the front-page code and docs.
- **Game, Sat. Oct. 10:** South Carolina at Florida, 12:45 p.m. ET (ESPN). Hurricane Isaias is making landfall far to the west; Gainesville is outside the warning areas. Status checks run 8:30 and 11:30 a.m. ET.
- **Shipped:** post `21efb548` "Hurricane Isaias reshuffles college football; Gators face rain chance at kickoff", byline Brenden Martin (member for `brenden@gatorbaitmedia.com`), graphics in PR #186. Welcome email campaign `4ee8fd4b` audience verified (16 eligible, 5 removed) for the 8 a.m. ET send. PR #122 (stats data) merged.
- **Dispatched to the game-day desk:** replace the top schedule strip with live NWS weather (current, hourly, kickoff call-out, small KJAX radar loop) and cycle the front page through the game package; fix the stale Missouri item and duplicate titles. Branch + PR first, claim in #34, no site publish.
- **Pending on Brenden:** the Mac Editor session (link previews, plans page, PDF page, sitemap, Donate); the blank Wix page at `/florida-football-stats`; the game-day writer-assignment email is drafted in Gmail, unsent.
- **Handoffs consolidated:** `docs/START-HERE.md` is the one signpost; `CLAUDE.md` and `AGENTS.md` point to it. Issue #34 is the live log and this file is the status page. The `gatorbait-agency` repo is a separate project with its own Codex role and was left alone.

Older dated entries (Oct. 2 back to Sept. 28, 2026) were moved verbatim to `history/CURRENT-STATE-2026-09.md` on Oct. 10, 2026; the standing live facts (embed IDs and revisions, session IDs, store, email list) stay below.

## Oct. 3, ~2:45 a.m. ET: coordination day, game-day desk restored, Chats board, design system status (Jarvis)

### Today's one big thing (Oct. 3)
Brenden, ~2:30 a.m. ET: "sorry coordinate today just to clean it up." Jarvis reads it as: coordinate the whole team and clean up loose ends. He had just asked "what is your one big thing for today? remember??" Nothing earlier is recorded as a daily "one big thing" (checked: the chat transcript, this file, #34, the Control Room, Wispr notes, Gmail). The only "one big thing" on file is the message board (Sept. 28). **From now on Brenden's one big thing for the day is written on this line first, so it survives a context reset.**

### Found and fixed overnight
- **The Game-day desk session (`session_01WPrfyiDi3ySUA7EuZTPJVf`) was ARCHIVED at 05:22Z (1:22 a.m. ET) by an unknown actor.** Seven enabled routines target it: the Oct. 3 game-day routine `trig_01VAAJ6y3YXfyjt9oCPrKo1X` (13:50Z), the morning news sweep `trig_01RULitPE99Ch2fcEYhxjSrj`, the tagging sweep, the hourly desk inbox `trig_01TrguYhktGZ29Wbr4Wz62FH`, the Daily Roundup `trig_01JibZfuK6jRddgK16atrrTQ`, and the Monday and Thursday game-week routines. An archived session cannot receive them, so Saturday's kickoff routine would have done nothing. Jarvis unarchived it at about 06:32Z and queued a one-time, read-only readiness ping (`trig_01RmkDjTxbFfVwx7Qt7Bw6cX`, 06:42Z).
- **Lesson candidate:** a routine whose target session is archived fails silently. Each morning, list the routines with their target sessions and confirm none is ARCHIVED (the Chats board shows this; a watchdog line in the 7:44 a.m. brief would too).
- **Control Room "Chats" tab** (artifact version 7; previous version `1790724352-332f` is the rollback): one column per department chat with live status from the Claude account, a Jarvis note, what it owns, its next routines and an Open chat button. Department notes live in the hub db doc `config/departments`.

### Agent-system survey (Oct. 3, "just to see")
Full write-up: `docs/AGENT-SYSTEM-SURVEY-2026-10-03.md`. **Stay put, adopt nothing, borrow three ideas.** No open-source project watches Claude cloud chats or would have caught a routine aimed at an archived chat. Candidates looked at: Paperclip, OpenAI Symphony, Agent Orchestrator (all "borrow the idea"). The three ideas, none needing new software: (1) a morning and game-eve **watchdog** that confirms every routine's target chat is alive (a new routine, needs Brenden's yes); (2) Control Room status filled from real chat state with a visible "checked at" stamp when stale (the Chats tab does the first half); (3) hand-offs as tickets that need a receipt and a "where I stopped" note.

### Authority and holds (Oct. 3)
- Brenden's words: "unpause" and "lift the pause order" (Control Room, ~2:17 a.m. ET) and "Lift the hold on the staff" (Jarvis chat, ~2 a.m. ET). Jarvis reads these as lifting the Oct. 1 ALL STOP (#34 comment 5938556323) for the Game-day desk's Oct. 3 routines, under the standing protocol (comment 5943370118): fresh live read, rollback snapshot, smallest change, read-back, one writer per object, claims in #34.
- **Still needs Brenden's explicit yes every time: any list email.** The send governor runs first. The Sunday 6:32 a.m. ET Daily Roundup routine (`trig_01JibZfuK6jRddgK16atrrTQ`) is on HOLD by Jarvis's instruction: build only, no send, post "@Jarvis — needs Brenden". The sender rank is still BAD and Brenden said Oct. 2 not to risk it. **The routine's own prompt is unchanged** (its instructions can be edited only from the desk chat), so the hold rests on this note, #34 and the send governor. Safer if Brenden agrees: Jarvis pauses the routine (needs his word).

### Design system (together repo, merged Oct. 3 at 2:23 a.m. ET, commit `1024d65`)
- Brand book, tokens (30 colors, 23 Barlow type styles, spacing, layout), 14 `gb-*` components, Barlow 400/500/700/800, wordmark and four photos. Extracted Sept. 28 from `d696498` (the "Paper" front page).
- **Not wired into this repo.** It predates Swamp Night, and it says "one theme, Paper; dark styling is rejected", which contradicts the live homepage (Front Page 2026, Swamp Night). So it is **not** the homepage rulebook. Do not "restore" Paper from it.
- Palette drift to settle: story-page embeds use navy `#081b35`/`#12305c`; the system's navy is `#11274a` (deep `#08132f`), orange `#fa4616` matches.
- Plan: adopt it as the rulebook for NEW embeds only (a docs line and a color/type check), after updating it for Swamp Night. No homepage change without Brenden's yes.

**Snapshot date:** 2026-09-28 ET. The Sept. 28 sync section below overrides older sections where they conflict.  
**Purpose:** one compact cross-harness continuity snapshot for Claude, Codex, ChatGPT and bounded workers.

Before any mutation or present-tense business conclusion, re-read the authoritative live provider. This file is a routing snapshot, not permission to override fresher evidence.

## Truth and coordination

Truth order:

**live provider/API/runtime → current object/revision → this snapshot → durable Master Control policy → current surface playbook → historical branches/chats/files → assumptions**

Canonical coordination:
- Repository: `Presidente49/gatorbait-media-redesign`
- Production Wix site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`
- Public site: https://www.gatorbaitmedia.com/
- Shared work item: GitHub issue #34 (issue #3 closed Sept. 26)
- AdSense incident: issue #30
- Single controller / one production writer
- Scheduled monitors remain read-only for live Wix/content/assets/routing.
- Brenden has delegated routine GatorBait newsletter/editorial implementation inside the tested Stack; do not re-ask routine template/photo/order/audience/QC questions.

## Standing facts kept from the Sept. 28 and Sept. 29 syncs

Verbatim excerpts. The complete dated entries, including the stop-work list, video, waiting-on-Brenden and usage-limit notes, are in `history/CURRENT-STATE-2026-09.md`. Revision numbers here are the Sept. 28–29 reads; the Oct. 3 entry and live provider reads are newer.

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

### From the Sept. 29 evening sync (Jarvis, about 6:45 p.m. ET)
- **Live embeds:** Magazine `1dd74333` rev 48 (14,918 chars, matches `deploy/magazine-urban/` on `main`, PR #47 merged); Home Code `622d8ece` rev 28 (V3 loader; was rev 22 Gazette body until Sept. 29 evening); Home Styles `1255a4cf` rev 6; Latest `53e15504` rev 8; article template `14a887e3` rev 8; header `7fee4de6` rev 30; ad guard `af338ad4` rev 4 (ads off); game-day band `96ef5a04` rev 45 (hidden). Header, Home Styles, Magazine and template are within 100–250 characters of the 15,000 cap.
- **Sessions:** "Design system extraction" (`session_01Cu77eQL88aDsCSGAnQPsaF`) finished its CX audit (doc `e3b71299…`, 8 fixes live, 12 decisions for Brenden); it holds no write authority. Stats page session is blocked on a `send_later` permission prompt in Brenden's desktop app and on the blank page. Game-day desk hit its session limit. The Mac controller-handoff session is archived, so the Wix Editor MCP is unavailable until Brenden opens a new Remote Control session.
- **Store (Catalog V1 on the production site):** six visible products (Franz Beard's *The Golden Season*, four shirts, a mug). They took real orders this year, so they stay visible. No redirects. Everything else in the order list is pricing-plan checkouts.
- **Draft Wix sites, all Free plan, Draft, created Sept. 20, no domain:** "Gatorbait Media 1" `4d9e149d`, "My Site" `468abff9`, "My Site 1" `5c77acfa`, "Gatorbait Media" `b4032e65`. They hold no live adapters. Trashing them is Brenden's call (card `draft-sites`).
- **Apps on the production site with no visible use:** Wix Hotels, Restaurants Menus, Restaurants Orders. Invoices, Pay Links, Events and Forms & Payments may back checkout or old records; do not remove any app without Brenden's yes and a dashboard check (card `unused-apps`).

## Site typography — current authority

Sitewide typography is standardized on the **Barlow** family:
- body/copy: Barlow 400–500
- UI/navigation/meta: Barlow 700
- editorial/display headlines: Barlow 800
- canonical CSS: `assets/sitewide-type.css`
- homepage source `sports-live/homepage.js` contains no Georgia/Times headline stack
- live Wix typography embed mirrors this system for native blog/article/account/header/footer surfaces.

Do not reintroduce Georgia, Times New Roman or Montserrat into the live presentation layer without an explicit new design decision.

## Website presentation — live provider state

GitHub `main` continues to advance through normal controller/ops commits. Production presentation is pinned through immutable GitHub commits in the existing Wix embeds; a new `main` commit does not itself redeploy the site.

### Homepage
- Wix embed: `fdc2127a-845a-4d02-b711-438f1a4a86ce`
- revision: **68**
- enabled: **true**
- source pointer: `485b38a036431c667584aa3990922772288399f3/sports-live/homepage.js`
- product rule: free sports-news homepage, Buddy Martin editorial lead, remaining current-news lists chronological, separate Magazine.
- old Newsroom/Gazette language in historical files is not authority to restore a retired default.

### Magazine web page
- Wix embed: `1dd74333-ee02-40da-9c93-cf8fd787c129`
- revision: **26**
- enabled: **true**
- source pointer: `485b38a036431c667584aa3990922772288399f3/automation/site-design/magazine.js`
- web Magazine remains separate from the email newsletter and from the downloadable/print reading-edition experiments.

## GatorBait Magazine Newsletter — canonical Stack

Production design library:
- upstream: `ColorlibHQ/email-templates`
- pinned commit: `3018557fe943fb1c3e3367aa52d39b2fca44f725`
- primary installed source: `vendor/colorlib-email-templates` (fetched by `tools/fetch-pinned-sources.sh newsletter`; not a submodule since Sept. 29, 2026)
- **24 · Brief** = editorial shell
- **04 · Stories** = responsive multi-column story package

Canonical GatorBait source:
- `newsletter/templates/gatorbait-magazine-colorlib-v1.mjml`
- visual baseline restored from the preserved September 18 Killing Fields edition: strong GatorBait masthead, cover treatment and editorial rhythm, implemented on top of the current Colorlib Brief/Stories system rather than restoring old content.

Hard rules:
- serious real/cleared game photography when photography is used
- current Ole Miss baseline uses exactly two distinct football photos
- never repeat a photo/media ID in one issue
- Cowboy image is excluded from the newsletter; Cowboy may be a text-only story block
- text-only is preferred to duplicate/novelty art
- no stale `LIVE NOW` promos
- consent/unsubscribe/footer and destination checks required
- no duplicate campaign/send

Repo gates:
- Link-attribution gate: `automation/newsletter/check-links.mjs` now requires `utm_source`, `utm_medium`, `utm_campaign` and `utm_content` on every tracked article CTA in both source and compiled browser-visible form. Current Ole Miss campaign key: `ole_miss_week_2026_09_25`.
- `automation/newsletter/validate-unique-images.mjs`
- `automation/newsletter/run-stack-qc.mjs`
- `automation/newsletter/stack-policy.json`
- `.github/workflows/newsletter-stack-qc.yml`
- visual email proof is part of the same Stack: compiled HTML is rendered at 390px and 1000px, checked for horizontal overflow / required sections / exactly two loaded images, and screenshots are stored with the CI artifact.
- first automated Stack run `36081881578` completed successfully with strict MJML compile and preview artifact.

Current canonical Wix release draft:
- campaign: `1f750191-01aa-47e4-9dea-6fab7dd609e4`
- subject: **GatorBait Magazine: Florida vs Ole Miss Week**
- state: **DRAFT / NOT_STARTED**
- provider preview independently verified with only:
  - `a99769_9cea463d1045446d8550ce6aa803b0d3~mv2.jpeg`
  - `16b519_a0c1b7e3ce9846239402069349deab8c~mv2.jpg`
- denied Cowboy images absent
- prior one-UTM canonical draft `5ba53901-b143-45c8-8f5d-31ff3763ef77` and earlier noncanonical same-title drafts were deleted only after replacement preview verification passed.
- current provider-tracked destinations were decoded and verified with complete `utm_source=gatorbait_magazine_newsletter`, `utm_medium=email`, `utm_campaign=ole_miss_week_2026_09_25`, and unique `utm_content` across all eight article CTAs.
- restored visual baseline commit `f4305e01c3420a37513823d0b0feafe6421c4513` passed Newsletter Stack run `36085189481`; Wix replacement draft `1f750191-01aa-47e4-9dea-6fab7dd609e4` passed provider preview, two-photo and tracked-destination checks. Prior draft `13f1901e-f2cd-41f7-9a68-94ba555afe56` was deleted only after replacement verification.

Do not reuse older Library HTML/PDF reading-edition proofs as the send-ready campaign. They are historical design artifacts unless explicitly promoted through the current Stack.

## Original magazine/publication tool inventory — recovered and canonicalized

The richer publication toolbox previously lived only on branch `tools/magazine-originals-20260924` and in ChatGPT Library setup ZIPs. It is now mirrored source-only on `main` at:

`tools/magazine-originals/`

Original repositories and pins:
- Colorlib email-templates — MIT — `3018557...` — production newsletter design source
- Zine 0.16.0 — Apache-2.0 — native mobile magazine/issue generator
- Baoyu Design 1.3.0 — MIT — design methodology/skill/reference source
- Paged.js 0.5.0-beta.2 — MIT — paged-media engine — **SECURITY HOLD**
- Paged.js CLI 0.4.3 — MIT — PDF CLI — **SECURITY HOLD**
- Vivliostyle CLI 11.3.3 — AGPL-3.0 — alternate publication/PDF engine; license/security review remains open

Historical isolated native validation:
- branch: `tools/magazine-originals-20260924`
- tested code: `787d45cbb6abee0aafaae2b802e8b5e2cf22aac3`
- successful run: `36057942374`
- Colorlib built all 28 templates; templates 4 and 24 passed 390px/1000px geometry checks.
- Zine native starter build succeeded.
- Baoyu installer/discovery succeeded and files matched upstream.
- Paged.js/Paged.js CLI produced PDFs but remain security hold because their audited dependency trees contained high/critical findings.
- Vivliostyle produced a sample PDF; AGPL and dependency review remain qualifications.
- `laravelmail/magazine-news-email-template` remains uninstalled because no license grant was found.

Source inventory presence is not authorization to run security-hold tools on a credential-bearing Mac.

Library artifacts found during the consolidation sweep include:
- `GatorBait_Original_Magazine_Tools_Setup.zip` (and duplicate)
- `GatorBait_Magazine_Production_Source.zip` (and duplicate)
- `GatorBait_Photo_Edition_Source.zip`
- multiple historical PDF/HTML reading-edition proofs
- historical `gatorbait-handoff.md`

Use these as evidence/source material, not as competing current state.

## Automatic Story Alert — live identity and open blocker

Live Wix state:
- production automation: `5006baf5-fbbf-440c-a012-a09bdbd95fc9`
- revision: **14**
- name: **GatorBait Story Alert — New Blog Post**
- origin: **PREINSTALLED**
- status: **ACTIVE**
- trigger: `wix_blog-new_blog_post`
- root action: `042c6c7c-f7e4-4d60-abd2-5f22fa69cf0e`
- action: `triggered-emails`

Duplicate:
- `824714d4-7e31-4b1d-95b2-ccec04d788af`
- revision **21**
- origin **USER**
- status **INACTIVE**

Master Control owns the open execution-trace incident. Config/content/validation evidence is healthy, but automatic delivery remains **UNVERIFIED** because the public Wix API/connector does not expose the required run-log evidence.

Exact blocker:
- Remote Desktop Commander currently reports **zero connected devices**
- therefore there is no authenticated desktop/browser path from this cloud session to Wix Automations → View run log.

Do not republish, resend, test-trigger or flip workflows diagnostically.

## AdSense — live identity and open evidence gates

Live Wix custom-embed state:
- serving owner: `af338ad4-8c84-4708-8859-f1d6a0121c13`
- revision **2**
- enabled
- category **ADVERTISING**
- publisher `ca-pub-6592453291626199`
- legacy `2da582cf-6935-4255-b248-e14add7e82a8` rev8 disabled
- fallback `109a8870-0fb3-4e9f-8b41-cf6c0875472d` rev4 disabled

Issue #30 is claimed by Master Control. Remaining gates:
1. consent-aware browser behavior
2. sufficiently current/native publisher reporting for paid impressions/earnings

Do not add another loader/manual unit or change consent/account/payment settings speculatively.

## Cross-source sweep — what exists and what does not

### GitHub
Code search for newsletter/Colorlib/MJML/GatorBait Magazine across the `Presidente49` account found the current implementation in **`Presidente49/gatorbait-media-redesign`**. No second GatorBait newsletter code repository was found in accessible GitHub code search.

The important missing material was a **branch/folder**, not another production repo:
- branch `tools/magazine-originals-20260924`
- folder `tools/magazine-originals/`

### ChatGPT Library
Historical handoffs and production/source ZIPs exist and were inspected. Old audience/business metrics in `gatorbait-handoff.md` are historical and must be re-read live before use.

### Google Drive
A Google Drive mount is available. Top-level and likely code/download locations were inspected:
- `/Google Drive/Saved from Chrome` — empty
- `/Google Drive/SEC Sidelines Control Room` — empty
- `/Google Drive/MEDIA TRANSFER` — media/license material, not a code repo
- `/Google Drive/Shared with me` — no GatorBait newsletter/code repo identified in the current listing
- root contains substantial GatorBait/Florida media that may be useful editorially, but media presence is not a source-code/control-plane state.

### Local computer
Remote Desktop Commander currently returns **no connected devices**. Therefore local Mac folders, local Git clones/worktrees and local Claude/Codex session state cannot be truthfully inventoried from this cloud session yet. Do not claim local installation or local cleanup until a device connects.

## Open branch / PR disposition

Do not bulk-merge old branches to recover one useful component.

- **PR #29 / `claude/gatorbait-studio-redesign-ysxi79` — OPEN draft / SELECTIVE SOURCE ONLY.** It contains useful isolated components (downloadable magazine builder, site-vision tooling and the original newsletter attribution checker). The attribution checker has now been selectively integrated into the canonical Newsletter Stack. The branch also contains older/stale design assumptions, generated artifacts, font files and experimental work; do not merge wholesale.
- **PR #32 / `skills/portable-business-operations-20260924` — OPEN draft / REVIEW HOLD.** It contains a broad portable business-operations/catalog layer. Current Master Control already provides the canonical cross-harness controller and source inventory; do not merge #32 wholesale or create a second control hierarchy. Extract only a bounded capability after source/license review and a concrete need.
- **PR #2** old magazine theme is closed/superseded; do not restore.
- **PR #5** magazine/growth playbooks are already merged; use current main copies.
- **PR #24** Studio product work was merged to its Studio branch/base history; it is not authority to migrate production Wix.

## Visual QC — current evidence

Read-only GitHub Chromium QC is now part of Master Control:
- workflow: `.github/workflows/live-presentation-qc.yml`
- targets: homepage, public Magazine, current Buddy article
- profiles: 320, 390, 430 and 1365 desktop
- first strict run `36085549728` correctly failed rather than returning a false green.
- desktop surfaces passed structural hard gates.
- mobile evidence shows the rendered layout viewport is **320px even when 390px and 430px are requested**, and the native Wix cookie first-layer overlaps the lead headline on homepage/Magazine.
- the cookie banner itself is native Wix consent UI; do not suppress or bypass it with custom CSS/JS.
- test harness now records the actual viewport meta/screen/visualViewport and performs a **test-only** `width=device-width` candidate reflow when Wix renders a wider phone at 320. Candidate evidence does not mutate production.
- minor Wix telemetry/network noise (aborted panorama/frog requests, Sentry 429, wce-frog certificate failure, GTM ORB in headless Chromium) is recorded separately and is not being treated as article/content failure without provider corroboration.

Newsletter visual proof is separately verified:
- Stack run `36085747162` = SUCCESS
- artifact `10843558599`
- real 390px and 1000px rendered screenshots
- zero horizontal overflow
- exactly two distinct images, both loaded
- restored GatorBait/Killing Fields editorial rhythm visibly present.

## Email audience and consent — fresh September 24 audit

Full Wix population audit:
- contacts / unique emails: **2,580 / 2,580**
- subscription rows resolved: **2,578**; 2 have no subscription record
- SUBSCRIBED: **1,879**
- UNSUBSCRIBED: **670**
- NOT_SET: **25**
- PENDING: **4**
- SUBSCRIBED + VALID: **1,080**
- SUBSCRIBED + deliverability NOT_SET: **15**
- SUBSCRIBED + INACTIVE: **758**
- SUBSCRIBED + BOUNCED: **13**
- SUBSCRIBED + SPAM_COMPLAINT: **13**
- current conservative sendable gate (SUBSCRIBED + VALID/NOT_SET): **1,095**

Historical claims that hundreds of contacts are currently subscription-status NOT_SET are superseded. Only 25 are currently NOT_SET, and only 4 were created in September 2026.

Current Wix Forms inventory has exactly one `wix.form_app.form` schema:
- `6babfee8-147f-428a-9e14-6b72f6225835` — **GatorBait Email List**
- contains visible `CONTACTS_EMAIL`
- contains visible `CONTACTS_SUBSCRIBE` boolean CHECKBOX
- contains submit button

Therefore the two Sep. 21 WIX_FORMS contacts with NOT_SET are **not evidence that the form lacks an opt-in field**; an unchecked subscribe box legitimately produces no marketing subscription. Two Sep. 21 site-member-created NOT_SET contacts likewise must not be auto-marketed without consent.

The major current audience question is Wix's **758 SUBSCRIBED / INACTIVE** contacts. Do not force-send or rewrite their status based on subscription alone. Wix automatically maintains deliverability state; preserve `activeContactsOnly` and current conservative gates until a documented provider-safe re-engagement path is established.

## Open queue

1. **Provider-preview duplicate-draft incident:** VERIFIED_CLOSED. One canonical draft remains.
2. **Automatic Story Alert execution trace:** CLAIMED / BLOCKED_ON_RUN_LOG_ACCESS.
3. **AdSense #30:** CLAIMED / BLOCKED_ON_CONSENT_BROWSER_AND_NATIVE_REPORTING_ACCESS.
4. **Newsletter release:** canonical draft prepared; routine release remains governed by the Newsletter Stack and current content/audience checks.
5. **Local-host reconciliation:** blocked until Desktop Commander/local authorized host connects; when available, inventory existing clones/worktrees before installing anything.

## Session startup rule

Every Claude/Codex/ChatGPT GatorBait session should:
1. verify canonical repo and current `main`
2. read latest issue #34 comments
3. read this file
4. load the canonical Master Control skill
5. load only the smallest relevant playbook
6. read live provider state before mutation
7. update existing work items rather than inventing parallel controllers/issues

Historical chats, branches and files are evidence. They do not outrank live state or this current routing snapshot.
