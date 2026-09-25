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
- Shared work item: GitHub issue #3
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
- revision: **26**
- enabled: **true**
- source pointer: `485b38a036431c667584aa3990922772288399f3/automation/site-design/magazine.js`
- web Magazine remains separate from the email newsletter and from the downloadable/print reading-edition experiments.

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
2. read latest issue #3 comments
3. read this file
4. load the canonical Master Control skill
5. load only the smallest relevant playbook
6. read live provider state before mutation
7. update existing work items rather than inventing parallel controllers/issues

Historical chats, branches and files are evidence. They do not outrank live state or this current routing snapshot.
