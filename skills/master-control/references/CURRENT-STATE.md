# Master Control Current State

**Snapshot date:** 2026-09-24 ET  
**Purpose:** one compact cross-harness continuity snapshot for Claude, Codex, ChatGPT and bounded workers.

Before any mutation or present-tense business conclusion, re-read the authoritative live provider. This file is a routing snapshot, not permission to override fresher evidence.

## Truth and coordination

Truth order:

**live provider/API/runtime → current object/revision → this snapshot → durable Master Control policy → current surface playbook → historical branches/chats/files → assumptions**

Canonical coordination:
- Repository: `Presidente49/gatorbait-media-redesign`
- Production Wix site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`
- Public site: https://www.gatorbaitmedia.com/
- Shared work item: GitHub issue #34, the coordination thread since Sept. 26. Its all-hands comment lists which agent owns which live object. Issue #3 is historical.
- AdSense incident: issue #30
- Single controller / one production writer
- Scheduled monitors remain read-only for live Wix/content/assets/routing.
- Brenden has delegated routine GatorBait newsletter/editorial implementation inside the tested Stack; do not re-ask routine template/photo/order/audience/QC questions.

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
- revision: **40** as of Sept. 28, 2026 (was 26 at this file's snapshot date; re-read live before trusting any revision number in this file)
- enabled: **true**
- source pointer: `485b38a036431c667584aa3990922772288399f3/automation/site-design/magazine.js`
- web Magazine remains separate from the email newsletter and from the downloadable/print reading-edition experiments.
- **The "Inside the issue" grid rebuilds itself live from `/blog-feed.xml` on every page load**, and that rebuild keeps only posts by five named authors (Buddy Martin, Franz Beard, Eddie Gilley, Loren Meadows, Carlton Reese) — see Lesson 45. Any card for anyone outside that list (Chris Spears, GatorBait Staff, a guest byline) must be captured once into a var and force-reinserted after the feed rebuild, or it silently disappears the moment the rebuild runs. A change to only the embed's static fallback JSON is not enough to verify — read the actual runtime logic, not just the data.

## Session update — Sept. 27 night into Sept. 28, 2026

- **Email Marketing:** the account went `WARNED` on Sept. 28 after 18 list sends in 7 days. It's `ACTIVE` again since Brenden accepted the terms (~07:50Z), but its rank is still `BAD`.
  - **Policy (Brenden, Sept. 28):** one roundup email a day through the daily roundup routine, no separate breaking emails, and both blog story alerts (`5006baf5`, `824714d4`) `INACTIVE`.
  - **Audience:** Jarvis's cleanup cut the Active Email Audience to 1,273. The 573 contacts inactive for 6 months are labeled, not deleted, and paid and Plus members were kept.
  - **Before every list email,** run `automation/newsletter/send-governor.js` (1 send a day, 7 a week). See the playbook's "Send governor" section and Lesson 48.
- **Morning news sweep:** every day at 6:28 a.m. ET in the game-day desk session. See `automation/ops-hub/playbooks/morning-news-sweep.md`.
- **Florida stats page:** embed `756655cf` has been live since Sept. 27 (stats session, PR #37). `/florida-football-stats` still 404s because no Wix page exists at that slug.
- **Typography enforcement.** Georgia serif had crept back into the header embed (`7fee4de6`, now rev 26) and the Magazine embed (`1dd74333`) — article-page headlines, account/plan titles, the sidebar "recent post" widget, and every Magazine headline. This directly violated the "Site typography" section above. Swapped all 11 occurrences to Barlow. Re-audit both embeds for Georgia periodically; this has now recurred once.
- **Home Code embed** (`622d8ece`, now rev 12): fixed a real headline bug — `The voices<br>you come for.` had no literal space next to the `<br>`, so a mobile rule that hides the `<br>` for a one-line layout also collapsed the words together ("voicesyou"). Also widened the "Only at GatorBait" columnist box from a hardcoded Buddy+Franz pair to a 5-name priority list (adds Loren Meadows, Carlton Reese, Eddie Gilley), so it varies with what's actually recent instead of always showing the same two names.
- **Embed-repo drift.** All three live-patched embeds above had their repo copies (`deploy/wix-served/header-embed.html`, `magazine-embed.html`, `split/home-code.html`) go stale immediately after each live PATCH tonight — the repo was never re-synced in the same session as the patch. Re-synced all three; character length now verified to match live exactly. Re-sync the repo copy in the *same* tool call chain as any live PATCH going forward, not as a separate later step.
- **Department audits ran for the first time** using the Sept. 27 dispersed skills (`gatorbait-agency/agency/skills-library/{editorial/copy-desk-audit,design/article-visual-qc,web/embed-patch,research/photo-sourcing,marketing/{email-delivery-check,seo-audit}}.md`). Findings: 3 posts with zero tags (tagged), one cover reused across two live posts (fixed — see photo-sourcing rule), one post correctly skipped for an in-progress unpublished edit. See `gatorbait-agency/agency/brands/gator-bait-media/outputs/log.md` for the run record.
- **New content:** "Chris Spears' Best Shots: Florida 52, Ole Miss 28" (`67bd8aca-89e2-4098-b934-4c019b4f588e`, `/post/chris-spears-photo-gallery-florida-ole-miss`) — a 10-photo gallery post, GatorBait's first, added to the Magazine's Inside the Issue grid. Pattern for a future gallery: use only photos already identified/captioned/credited in Wix media (check `gameday/<date>/photos-chris-spears/CREDIT.md`), never the raw uncaptioned SmugMug batch without viewing each one first.
- **Email list hygiene, Sept. 27–28:** suppressed 9 chronically-bouncing addresses (8+ bounces, 0 deliveries across 31 sends since Aug. 1) and unsubscribed 14 contacts who had filed spam complaints but were still marked SUBSCRIBED. Subscribed total: 1,849. Separately, one subscriber's mailbox forwards to a dead Outlook account under GatorBait's own Return-Path, so its bounces arrive as `postmaster@outlook.com` "Undeliverable" notices in Brenden's personal inbox rather than showing up in Wix's own bounce stats — see Lesson 46. A full list-hygiene pass now includes a Gmail NDR sweep for this reason (`docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md`).

## GatorBait Magazine Newsletter — canonical Stack

Production design library:
- upstream: `ColorlibHQ/email-templates`
- pinned commit: `3018557fe943fb1c3e3367aa52d39b2fca44f725`
- primary installed source: `vendor/colorlib-email-templates`
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

**Root-cause finding, Sept. 28, 2026 (still open, nothing changed):** the Homepage (`fdc2127a`) and Magazine (`1dd74333`) embeds each set `#SITE_PAGES`/`#PAGES_CONTAINER` to `display:none!important` to kill the old native-page flash. Auto Ads places in-content ad units by scanning the rendered native page container; a `display:none` container has no box for it to use. Article pages don't hide that container and are unaffected. Practical read: Homepage and Magazine — the two highest-traffic pages — likely serve little beyond anchor/overlay-format ads; in-content Auto Ads units are probably confined to individual article pages. Confirming this needs the Google AdSense dashboard (impressions/RPM by URL), which isn't visible from Wix's API or this session. Do not resurrect the disabled `471ba402` ("Homepage Ad Presentation") or `109a8870` embeds to fix this — they only reposition ad units Auto Ads already placed, and can't create a placement surface Auto Ads never had. A real fix means designing one visible, intentional ad slot inside `#gbm-live`/`#gbm-magazine-page` and requesting a specific ad unit into it — a deliberate layout decision, not a diagnostic patch.

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

## Program facts and newsroom roster (verified Sept. 26, 2026)

Know these facts without re-checking them each session.

**Program**
- Florida's head coach is **Jon Sumrall** (spelled "Jon", never "John"). He is in his first season; Billy Napier is "the previous administration."
- Offensive coordinator: Buster Faulkner. Strength coach: Rusty Whitt (spelling taken from the presser audio; confirm before print).
- Sumrall's running themes are "we have not arrived," "wake the beast" and "not a finished product."
- The week of Ole Miss, Sumrall said publicly that Ole Miss had proven more (16-2 over the last year) and that he would never bet against Trinidad Chambliss. Carlton's "Vegas" line refers to this. After the game he said, "It's not asleep, but it ain't fully awake yet."

**2026 season to date**
- Florida is 4-0 (2-0 SEC) after beating No. 4 Ole Miss 52-28 on Sept. 26.
- Next game: at Missouri, Saturday, Oct. 3, 3:30 p.m. ET.
- Key players: RB Jadan Baugh, RB Duke Clark, QB Aaron Philo, WR Eric Singleton Jr., WR Bailey Stockton, WR Vernell Brown III, TEs Amir Jackson and Luke Harpring, edge Jayden Woods (#0), LB Aaron Chiles, S DJ Coleman, KR London Montgomery, K Patrick Durkin.

**Newsroom and Wix author IDs**
- Buddy Martin: ae876af8 (editorial lead).
- Franz Beard: c2d49068.
- Carlton Reese: cd142328-7f90-4a6b-906a-7963f603afb0. Its display name is "Carlton Reese," so use it for his byline. His older account d64e8755 shows as "carltonreese1306." His category is "Carlton Reese" (7600ea02).
- Eddie Gilley: 2e74ec84.
- Loren Meadows: c6f7996f.
- Muse: 93d9f853. Muse's pieces are drafts only; publish them only with Brenden's yes.
- GatorBait Staff: 16433bab.
- Chris Spears shoots the game photos and video. Credit him as "Photo by Chris Spears/GatorBait Media."

**Email audience**
- Never put straight double quotes in an email's `<mj-title>` or subject. On 9/26 they caused a Wix 500 from GenerateHtml on preview; use curly quotes.
- Each Sept. 25-26 send delivered to about 1,800-1,816 people (label e345fa8e, ~1,830 targeted).
- An "~100" figure is an early open count, not the audience size.

**Video**
- UF football's YouTube channel is **Florida Gators Football**, UCGy38_kQ5tV_e87Uhs3VCRQ. The old "Florida Gators" channel, UC97IlakvONh8RBUODRuk4mA, is stale; don't use it.
- Embed UF's official YouTube video (for example, a presser). Use a Ricos HTML node with `url: https://www.youtube.com/embed/<id>?rel=0`; this shape is proven live in "Before Laura Rutledge Was Laura Rutledge."
- Do not download or re-upload UF's video.

**Transcripts**
- vidIQ `video_watch` gives usable verbatim quotes. Its speaker names are unreliable: it has labeled the QB "Graham Mertz" or "Aaron Chiles."
- Identify each speaker from the questions and ESPN play data. Swap in UF's official ASAP transcript when UF SID forwards it (e.g., Matthew H.). The transcripts live at asaptext.com/asap_media/media/1109/<event>/transcripts/<id>.html.
- ASAP transcripts can mislabel players too: 9/26 labeled Jayden Woods "Jaden Edgecombe." Always check the roster position.

## Open queue

1. **Provider-preview duplicate-draft incident:** VERIFIED_CLOSED. One canonical draft remains.
2. **Automatic Story Alert execution trace:** CLAIMED / BLOCKED_ON_RUN_LOG_ACCESS.
3. **AdSense #30:** CLAIMED / BLOCKED_ON_CONSENT_BROWSER_AND_NATIVE_REPORTING_ACCESS.
4. **Newsletter release:** canonical draft prepared; routine release remains governed by the Newsletter Stack and current content/audience checks.
5. **Local-host reconciliation:** blocked until Desktop Commander/local authorized host connects; when available, inventory existing clones/worktrees before installing anything.

## Session startup rule

Every Claude/Codex/ChatGPT GatorBait session should:
1. verify canonical repo and current `main`
2. read latest issue #3 comments
3. read this file
4. load the canonical Master Control skill
5. load only the smallest relevant playbook
6. read live provider state before mutation
7. update existing work items rather than inventing parallel controllers/issues

Historical chats, branches and files are evidence. They do not outrank live state or this current routing snapshot.

## Cloud game-week schedule (set Sept. 27, 2026; Brenden: "run all that stuff in the cloud")
All of these are Claude Code cloud routines that fire into the controller session. No Mac, FCC or n8n dependency.
- Sun 1:15 a.m. ET: CFB Saturday wrap refresh and publish (trig_01CnjeWyu2EENbzZp6SJVJCR).
- Sun 8:50 a.m. ET: writer-stories QC and covers; upload the Postgame Wrap newsletter as a DRAFT and ask for a yes (trig_01FypHf2prvDbb4LXDcww7tJ).
- Sun 2:04 p.m. ET: AP poll story "Chomp Up the Charts"; band rank update (trig_01NyNPP9mzWdG49zXnxPJp1M).
- Sun 5:50 p.m. ET: Missouri first look; band to Missouri upcoming (trig_015kRs4KTum6Az8EvM1pJqxb).
- Weekly Mon 1:47 p.m. ET: Monday presser and injury story (trig_01JKUBvRUZ3ptM5D3kr4V13T).
- Weekly Thu 9:44 a.m. ET: opponent preview; weekly Magazine draft for a yes; Magazine fallback refresh (trig_011cSGMQcch48p2wpjaBrWGp).
- Sat Oct. 3, 9:50 a.m. ET: Missouri game day, pregame through postgame (trig_01F7ct63dJfvpqG5dVSNV5ht).

Every email is still owner-approved: one postgame email per game, and any other send needs Brenden's yes.

## Blog standards (2026-09-27)
- **Every post:**
  - Post template v1 (`14a887e3`) plus the formatting normalizer (`c91ad133`). Both run on all `/post/` pages.
  - Keyword tags per `automation/blog-tagging/README.md`: people, opponents, Florida Gators Football, roster players. Posts with unpublished edits are skipped.
  - Tag new posts on publish. A daily sweep covers the rest.
- **Latest, category and tag pages:** Latest page v1 (`53e15504`), multi-column; tag pages are titled with the tag name.

