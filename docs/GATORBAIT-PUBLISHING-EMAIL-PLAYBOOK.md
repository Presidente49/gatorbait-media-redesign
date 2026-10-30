# GatorBait Publishing & Email Playbook

## Purpose

Turn repeated publishing work into deterministic controller behavior. The controller should not rely on chat memory for rules that have already repeated.

## 1. Article publishing gate

Before a story is published:

1. Verify title, byline, body and destination.
2. Classify the primary editorial home: Front Page or Magazine. One primary home only.
3. Confirm the story has intentional hero/cover art. A major story must not ship with a blank, generic or low-quality writer image.
4. Use the same final hero/cover media in Wix Blog and pass the feed/Spaces cover gate in section 1B; a body image or `og:image` alone does not establish it.
5. Apply [house-voice review](../tools/voice/HOUSE-VOICE.md) to every new article, including named writers and Brenden. Review final headline, deck, body, excerpt and captions, run `tools/voice/gb_voice.py`, resolve typography/markup issues or record a justified exception, and assess formulaic phrasing in context. Preserve substantive writer voice and verified quotation words. Machine cues are not authorship findings or a substitute for the source checks below.
6. Verify alt text, complete saved ending and permanent post URL after publish; obtain independent live QC.

For major stories, create branded art before release when supplied art is weak. Do not use faces unless there is a real supplied/licensed photo.

### 1A. Media permanence gate — owner direction, October 5, 2026

**If an asset is not in the production Wix Media Manager, it is not publication-ready.**

1. Before any image, photo, graphic, thumbnail, roster, schedule, or other visual is attached to a Wix article, upload or import it into the production site's Media Manager first.
2. Never make a live article depend on a temporary local path, chat-generated attachment URL, external hotlink, GitHub raw asset, transfer link, or other non-canonical source. The Wix Media Manager copy is the durable source used by the article.
3. Canonical article storage path: `MEDIA / ARTICLES / YYYY / MM-MMM / YYYY-MM-DD <Story Name>`. Reuse the existing path when it exists; create missing folders before attaching the asset. Keep related cover art, body images, source photos, rosters, schedules, and derivatives in that story folder; add subfolders only when volume requires them.
4. Wait until the Media Manager file is ready for use before publishing or replacing article media. Use the Wix media ID/URL from that stored file for hero, cover, and body references.
5. Use a descriptive file name and meaningful alt text. Preserve photographer/source credit separately in the story caption or metadata when required.
6. When replacing media, store the new asset first, then switch the article to the new Wix media asset. Do not delete the previous asset as part of the replacement unless cleanup is separately verified and authorized.
7. This gate applies to generated graphics as well as supplied photography: create → Media Manager → correct folder → ready/verified → article.

### 1B. Feed and Spaces cover gate

[Wix documents](https://support.wix.com/en/article/wix-blog-sharing-a-blog-post-on-social-media) that **Display Cover Image** enabled supplies the post/custom/recent feeds and social sharing; disabled limits the image to social sharing. This documents feed behavior, not a guarantee that a specific Spaces device has refreshed.

- Before release or a cover repair, read the current native post/revision and preserve its rollback. Set the intended permanent Media Manager image as the custom cover, keep `heroImage` consistent, and enable `media.displayed`. Read back the saved image identity, ready asset, alt/credit, hero and display flag. An inline `IMAGE` node or social preview is a separate surface.
- Keep exactly one intended visible website lead. If a body lead duplicates the native cover, repair that duplicate/layout while preserving caption and full manuscript. Never switch `media.displayed` off to hide duplicate art: that removes the feed cover.
- Verify the canonical public article independently, then inspect the actual post in the Spaces list/card and open it to check the correct destination and loaded art. Record native cover/readback, public article QC and Spaces card/device proof as separate outcomes. If the app/device is unavailable, label that check **UNVERIFIED**, with the precise next check; do not claim app success from API fields or an automation run.
- Preserve canonical ID/URL and original publication time on a presentation repair. Do not create a replacement post or replay email/push; use the authorized in-place correction path and reconcile distribution state before retrying.

### Writer defaults and morning releases — owner direction, October 20, 2026

Brenden approved the Oct. 20 Franz artwork as the official **Thoughts of the Day** visual identity and requested the same standard-cover approach for Buddy, Loren and every regular writer when a filing has no suitable story art.

- Prefer relevant, rights-cleared story photography or commissioned story art. Otherwise reuse that writer's verified default portrait or branded series card. Never substitute an unrelated game photograph, another writer's portrait, an invented face or an unverified asset.
- Resolve the canonical default in [writer-cover-defaults.json](writer-cover-defaults.json). A missing entry is a preparation task, not evidence that a default was made. Use an existing rights-cleared native writer portrait if available; otherwise create a matching branded card with the real writer's name and no fabricated portrait, upload it, wait for READY, and register it before use. The controller handles these routine choices.
- Store reusable originals under `MEDIA / BRAND / WRITER DEFAULTS / <Writer Name>`. Keep each article's final rendition in its canonical dated article folder. Record media IDs, alt text, attribution and rights/source notes. Register actual provider receipts; a local file is not a Media Manager upload.
- The series artwork carries the franchise name. The native article headline beneath it must add that day's editorial hook rather than repeat the artwork's title. Do not change a published permalink or first publication date merely to improve the headline. Keep native author, artwork name and visible byline aligned.
- Franz's locked master is the Oct. 20 design, not permission to put an Oct. 20 date on tomorrow's column. Preserve the visual composition and update/remove edition-specific dates for future renditions; never misdate a new issue. Apply the same rule to opponent names, scores and sport-specific claims on any writer card.
- Set the final Wix Blog cover and hero consistently so the front-page lead, social preview and Story Alert inherit the intended art. Keep key lettering inside thumbnail-safe margins and show the full card on phones.
- This default applies to Franz Beard, Buddy Martin, Loren Meadows, Eddie Gilley, Chris Spears, Carlton Reese and future named contributors. Preserve Chris's separate photography credits. Do not call a column a photo gallery when it is not one.
- An email may not repeat the same default image in multiple visual slots. Use one lead rendition and text-only secondary links when no distinct appropriate art is available.
- A schedule-heavy column uses native headings for sections and teams, explicit ranking rows that preserve supplied rank/tie numbers, and separate bold game/time/network lines. Avoid wide fixed tables, embedded HTML documents, ornamental initials, empty paragraphs and new page-wide CSS. Keep the complete ending and check 390/430/1366/1920.
- Trusted writer filings receive the Oct. 19 newsroom quick-check standard: core score/opponent/date/byline and normal copy desk; preserve their voice. Brenden's current Oct. 20 instruction was to publish his complete supplied column promptly and correct afterward. Record real contradictions for follow-up; never invent a missing ranking or claim a broad fact audit was completed.
- Run [the morning-email skill](../skills/gatorbait-morning-email/SKILL.md) for morning intake, artwork, publication, front-page and email follow-through. `PUBLISHED` is not `EMAIL DELIVERED`. Read the live automation and actual receipts before sending a fallback campaign; do not toggle, test-send, or duplicate an uncertain automatic send.

The Oct. 20 article is `/post/thoughts-of-the-day-october-20-2026`; its distinctive headline is **No. 1 expectations, SEC crossroads and the playoff picture**. The approved original design and live release receipt are recorded in `deploy/franz-thoughts-20261020/`.

### Attribution and fact verification — owner direction, September 28, 2026

Brenden confirmed that his otherwise unnamed or generic Staff AI-assisted writing should credit **Brenden Martin**. This is an authorship instruction, not evidence that an article's factual claims are correct. Preserve genuine named writers, reporting contributions and separate photographer credits. Read the existing body, captions and source notes before replacing a generic native author record; an inline named byline takes precedence over a generic Staff account. Keep the native author, visible byline, cards and structured metadata consistent. Do not relabel Chris Spears' photographs or firsthand reporting as someone else's work.

Use three recorded editorial passes before publication or material republication:

1. **Source check:** identify the material claims and attach dated primary evidence. Check names, roles, dates, scores, records, rankings, injury descriptions and recruiting status against the correct event and season. Use official box scores for game statistics, dated poll releases for rankings, the original interview/transcript for quotations, and the actual ranking service for recruiting ratings. Keep reporting, inference and predictions distinct.
2. **Independent check:** a separate reviewer cross-checks important numbers, chronology, superlatives and quotations using an independent record where practical. Multiple sites repeating one release are one source. Recompute arithmetic and compare historical claims with the original game record; even official releases can contain typos. Quote checks require the exact words, speaker and context; a related article is not proof of an unexamined quote.
3. **Final copy and public check:** reconcile headline, deck, body, author account, inline credits, captions, alt text and article metadata. Confirm the final canonical page and record which claims passed, were corrected or remain unresolved. Preserve rollback and correction notes; the controller is the sole live writer.

For injury or confidential-source claims, record the reporter's evidence privately and obtain editorial verification. A public search failing to corroborate a claim does not prove it false, and an AI-generated statement that "sources said" is not source evidence. Do not label an unresolved claim independently verified or promote it as confirmed in new summaries. Resolve, qualify or remove unsupported material before publishing new copy.

These are publishing requirements, not a claim that an automatic fact-check service is installed or that every archived story has passed. The bounded September 28 review and exact correction evidence are recorded in `deploy/editorial-factcheck/README.md` and `claim-ledger.json`.

## 2. Automatic blog email = custom GatorBait article alert

This is the production single-story automatic email, not a GatorBait Magazine issue.

Live routing verified September 23, 2026, 03:21 UTC:
- Active automation: `5006baf5-fbbf-440c-a012-a09bdbd95fc9`, revision 14 (fresh live read September 24).
- Name: GatorBait Story Alert — New Blog Post.
- Action: `042c6c7c-f7e4-4d60-abd2-5f22fa69cf0e`.
- Message: `1dfd5091-6dbe-48ef-a919-ef0fc75a38ab`.
- Trigger: `wix_blog-new_blog_post`.
- Existing opted-in audience label: `e345fa8e-f66a-4e57-ad00-81707cf8dc15`; sendToUnsubscribed=false.
- This workflow has PREINSTALLED origin but its actual message is now the CUSTOM GatorBait Story Alert. Origin and friendly name do not prove template content.
- Its preview with the scheduled Buddy article payload passed headline, photograph, excerpt, branded masthead, full-story CTA and substitution checks; no unresolved placeholders.

Required dynamic fields: `${title}`, `${coverImageUrl}`, `${description}`, `${url}`.
Required presentation: navy/orange masthead, story image, headline, excerpt, orange READ THE FULL STORY CTA, and compliant business footer.

Pre-activation rule: validate before status changes. Before scheduling, inspect the actual live message and preview with the intended post payload. Preserve the established audience. Never substitute a generic message.

## 3. Prevent duplicate sends and stale routing reversions

- Automation `824714d4-7e31-4b1d-95b2-ccec04d788af`, revision 21, is INACTIVE (fresh live read September 24).
- Its message is `04550418-33d0-4564-ad25-b865f591b2c0`.
- Both workflows currently contain branded custom content. Keep only the verified production route active.
- The September 22 instructions identifying USER origin as the only custom path are superseded by the live content inspection above. Do not flip statuses based solely on those historical instructions.
- No automation status, audience or template was changed during the September 23 Buddy scheduling task.
- A successful preview verifies rendering and configuration; actual delivery must be checked after publication.

## 4. GatorBait Magazine = curated multi-story email

GatorBait Magazine is separate from the Story Alert.

Rules:
1. Publish required articles first so every story has a permanent live URL.
2. Choose one lead story and one lead image.
3. Every visual slot must use a unique image URL. If no unique usable art exists, use a text-only story block or create new art. Never reuse an image in the same issue.
4. GatorBait Magazine issues are controller-reviewed campaigns. They do not auto-send merely because a blog post publishes, but routine Magazine sends are owned by Master Control once the Newsletter Stack gates pass.
5. Keep the issue magazine-like: strong lead, clear hierarchy, short decks, article CTAs, GatorBait TV close.
6. No Magazine photo gallery unless the owner explicitly asks for one. Current owner direction is **no gallery**.
7. Brenden has delegated routine GatorBait Magazine release decisions to Master Control. Do not re-ask for template, story order, ordinary photo selection, audience selection, routine timing, or routine send approval when the work is inside policy. Run the Newsletter Stack and proceed. Escalate only a true approval-required condition or human/access blocker.


## 4A. Newsletter Stack — deterministic release path

For every routine GatorBait Magazine issue, Master Control runs this state machine without asking Brenden routine implementation questions:

`CONTENT_READY → REPO_QC → MJML_COMPILED → PROVIDER_PREVIEW → AUDIENCE_RESOLVED → SENDER_VERIFIED → DUPLICATE_SEND_CLEAR → SENT_OR_SCHEDULED → DELIVERY_VERIFIED → RECORDED`

Required gates:

1. **Content:** current canonical Wix articles, no stale `LIVE NOW` promos, no invented facts, links and bylines verified.
2. **Design:** Colorlib 24 Brief shell + Colorlib 04 Stories multi-story structure from the pinned upstream submodule.
3. **Photography:** serious editorial/game photography when photography is used; no novelty image when a real game photo is available; no repeated photo/media ID in one issue.
4. **Repo QC:** unique-image validator, Stack validator, strict MJML compile, compiled artifact.
5. **Provider preview:** rendered Wix preview has brand, intended stories, CTA destinations, unsubscribe/preferences and no unresolved placeholders.
6. **Audience:** fresh read of the full current contact/subscription state; only SUBSCRIBED + deliverable/allowed contacts; never expand consent.
7. **Sender:** verified Buddy Martin / GatorBait sender unless the issue has an explicitly different approved identity.
8. **Deduplication:** no matching already-distributed campaign/story package to the same audience unless an intentional resend strategy is separately justified.
9. **Delivery:** provider state and recipient outcomes checked after send; configured/accepted is not delivered.
10. **Record:** campaign ID, source commit, audience counts, provider timestamps and meaningful delivery/open/click/bounce outcomes recorded in the existing Master Control work item.

The controller stops only on an approval-required condition, rights/consent uncertainty, provider/access blocker, or a failed QC gate it cannot safely repair in the bounded cycle.

### Magazine newsletter design baseline — September 24, 2026

- Upstream design library: `ColorlibHQ/email-templates`, pinned in this repo at commit `3018557fe943fb1c3e3367aa52d39b2fca44f725` under `vendor/colorlib-email-templates` (MIT).
- Use Colorlib **24 · Brief** for the editorial masthead, issue hierarchy and restrained typography.
- Use Colorlib **04 · Stories** for responsive multi-column story packages.
- GatorBait issue source: `newsletter/templates/gatorbait-magazine-colorlib-v1.mjml`.
- Editorial photography must be real, relevant and licensed/owned. Do not substitute novelty/gimmick artwork when serious game photography exists.
- **Never repeat a photo in the same issue.** The repository gate checks underlying Wix media IDs, normalized remote URLs, and byte-identical inline/data-URI image payloads. It cannot safely infer that separately cropped or re-encoded files depict the same photo; record the originating asset for every chosen image and make a story text-only when that editorial review finds a repeat.
- For the Ole Miss edition currently being corrected, use exactly two serious football photos: one Jadan Baugh game photo and one Aaron Philo game photo. The Cowboy image is excluded from the newsletter.
- Run `node automation/newsletter/run-stack-qc.mjs <issue.mjml>` and `node automation/newsletter/validate-unique-images.mjs <issue.mjml>` before creating or updating a Wix campaign. Any failure is a hard stop.
- GitHub workflow `.github/workflows/newsletter-stack-qc.yml` compiles the real MJML with the pinned Colorlib toolchain and uploads the compiled HTML artifact. It also runs `automation/newsletter/check-links.mjs` against both source and compiled HTML. Every tracked article CTA must carry non-empty `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`; malformed `amp;utm_*` keys are a hard stop. A green source commit, campaign preview, or provider acceptance is not sufficient by itself; all applicable Stack gates must pass.

Current Florida-Auburn pregame campaign:
- Campaign ID: `b8fdc1c7-5ec0-4e55-952c-594ccad59bb0`
- Title: `GatorBait Magazine: Welcome to the Killing Fields`
- State at creation: DRAFT / NOT_STARTED
- Source: `newsletter/2026-09-18-florida-auburn-magazine.mjml`
- Image QC at creation: 7 image slots / 7 unique URLs.

## 5. Sept. 18 Killing Fields lead

Buddy Martin story:
- `Welcome to the Killing Fields: Why Jordan-Hare Eats Gators for Breakfast`
- URL: `/post/welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast`
- Final lead/cover media: `d3cfa5_e0a5961689134b0bbf2f320bd82f6e7a~mv2.png`
- The banner is derived from the saved original `GatorBait: Welcome to the Killing Fields.png` design and carries the approved distressed Killing Fields/Jordan-Hare treatment.

The earlier plain Shug Jordan image may appear inside editorial content when useful, but it is not the lead banner.

## 6. Learning rule

When the same owner correction or workflow recurs, encode it here and in the live runbook after the second recurrence. The controller should then apply the rule automatically on future matching tasks.

Examples already encoded:
- no generic automatic blog emails;
- major stories require intentional hero art;
- curated Magazine is separate from automatic Story Alert;
- no duplicate images inside an issue;
- no Magazine gallery by default;
- preview with real payload before activating an email automation.

## 7. Verification checklist

Before calling a publishing/email task complete:

- Wix post is PUBLISHED when intended.
- Hero and custom cover read back as the intended permanent asset with `media.displayed` enabled; the website has one intended lead. Spaces list/card image and destination are checked separately or explicitly UNVERIFIED.
- Every new article has a recorded house-voice/editorial disposition and applicable claim/source checks; a checker pass is not editorial or factual approval.
- Permanent story URL resolves.
- Exactly one relevant automatic email workflow is active.
- Duplicate workflow remains inactive; the active message is the verified custom template.
- Story Alert preview passes brand/title/image/CTA checks.
- Magazine campaign remains DRAFT until repository QC, provider preview, sender, consent/audience and duplicate-send gates pass. Routine sends may then proceed under the standing Master Control delegation.
- Magazine image URLs are unique.
- Mobile layout is checked before send.
- Repo source/runbook are updated with any new persistent rule.
