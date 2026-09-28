# GatorBait Publishing & Email Playbook

## Purpose

Turn repeated publishing work into deterministic controller behavior. The controller should not rely on chat memory for rules that have already repeated.

## 1. Article publishing gate

Before a story is published:

1. Verify title, byline, body and destination.
2. Classify the primary editorial home: Front Page or Magazine. One primary home only.
3. Confirm the story has intentional hero/cover art. A major story must not ship with a blank, generic or low-quality writer image.
4. Use the same final hero/cover media in Wix Blog so the homepage and email automation inherit the correct image.
5. Verify alt text and the permanent post URL after publish.

For major stories, create branded art before release when supplied art is weak. Do not use faces unless there is a real supplied/licensed photo.

## 2. Automatic blog email = custom GatorBait article alert

**2026-09-26 18:40 UTC: production alert switched to `824714d4`.** `5006baf5` (message `1dfd5091`) was ACTIVE but had not delivered one email since 2026-08-13. Evidence: List Recipients `lastActivityDate` max 2026-08-13T19:14Z across 2,211 recipients, and nothing was sent for the four posts published after its 13:24 UTC activation. Its action has empty `dynamicParams`. `824714d4` (message `04550418`) delivered to 1,846 recipients on 2026-09-23 and maps title, cover image, description and URL. Both messages now render the same branded "Story Alert · Latest from GatorBait" design; neither says "new blog post". Final state: `824714d4` ACTIVE (rev 22, validated), `5006baf5` INACTIVE (rev 17). Keep exactly one alert ACTIVE.

**ACTIVE is not proof of delivery.** Before trusting an alert, read `GET /email-marketing/v1/campaigns/{messageId}/statistics/recipients?activity=DELIVERED` and check the newest `lastActivityDate`.

**Breaking-news path (one email per story):**
1. Pause `824714d4`.
2. Publish the post.
3. Send a breaking campaign built from `newsletter/2026-09-26-breaking-kewan-lacy.mjml` to label `e345fa8e`.
4. Resume `824714d4`.

Editing a published post uses `PATCH /blog/v3/draft-posts/{id}` with `action: UPDATE_PUBLISH`. Pause the alert around edits as well.

Status changes after the email (for example doubtful → out) are in-place updates with an update note and a refreshed cover. There is no second email and no new post (LESSONS #36).

First use: campaign `16f70ae6` "BREAKING: Ole Miss star Kewan Lacy not expected to play vs. Florida", 2026-09-26 ~18:37 UTC, delivered 1,769, 21 bounced, 0 complaints. Sent once.

**2026-09-26:** Brenden approved turning the alert back on with the branded version. `5006baf5` was validated by Wix and set **ACTIVE** (rev 15→16), with message `1dfd5091` and audience label `e345fa8e`; `824714d4` was confirmed INACTIVE. Emails go out for posts published after this point. Franz's Sept. 26 "Soothsayer" article was published while both alerts were off, so it has not been emailed.

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
- **Never repeat a photo in the same issue.** Uniqueness is by underlying Wix media ID when present, otherwise normalized image URL. If a story does not have unique usable art, make it text-only.
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
- Hero and cover media point to the intended asset.
- Permanent story URL resolves.
- Exactly one relevant automatic email workflow is active.
- Duplicate workflow remains inactive; the active message is the verified custom template.
- Story Alert preview passes brand/title/image/CTA checks.
- Magazine campaign remains DRAFT until repository QC, provider preview, sender, consent/audience and duplicate-send gates pass. Routine sends may then proceed under the standing Master Control delegation.
- Magazine image URLs are unique.
- Mobile layout is checked before send.
- Repo source/runbook are updated with any new persistent rule.

## The easy send: band → newsletter (Sept. 27, 2026)

The homepage game-day band (the `/*GD*/` data in `deploy/wix-served/home-gameday.html`, live in embed `96ef5a04`) is the single source for the quick game newsletter.

**Steps:**
1. Update the band: score, status, note, tracker (`st`), leaders (`ld`) and the story buttons (`links`, Buddy first).
2. Export the linked stories' title, excerpt and cover from the Wix Blog API to `newsletter/band-stories-<date>-<opponent>.json`.
3. Run `node automation/newsletter/band-to-mjml.mjs --stories newsletter/band-stories-<date>-<opponent>.json`.
4. Run the gates: stack-qc, unique images, check-links, and a strict compile.
5. Upload as a Wix DRAFT and preview it.
6. Send only on Brenden's yes.

**What the generator does automatically:**
- Only the first two cards with credited photos get images; graphics and charts stay text-only.
- Summaries are trimmed at a word boundary.
- Links use raw `&`, never `&amp;utm`.

## Breaking news = maximum share (standing order, Brenden, Sept. 27, 2026)

Brenden: "I want this all to be standard operating procedure. I don't need to tell you that it's maximum share."

When a staff writer (Buddy Martin, Franz Beard, Loren Meadows, Carlton Reese, Eddie Gilley, Chris Spears) or Brenden sends a story marked BREAKING, or a clearly breaking item (injury/MRI result, transfer, commitment, suspension, coaching change, schedule change), the desk runs the whole package without waiting for a separate yes:

1. **Publish immediately.** Use the writer's copy verbatim, headline "BREAKING: …", byline as sent. Add only verified context: our transcripts, AP/ESPN stats, and the schedule.
2. **Copy desk:** check names and numbers against editorial-desk.md. Attribute anonymous-source claims ("sources told GatorBait"). No invented quotes or facts. If a core fact can't be sourced at all, hold the story and ask Brenden. That is the only reason to hold.
3. **Photo:** a credited archive photo of the subject (Chris Spears first; see photos-chris-spears/CREDIT.md and SMUGMUG-GALLERY.md). Never AI art. If no real photo exists, use a type-led GatorBait graphic.
4. **Front page:** set `featured`. Move the Home Code (622d8ece) BREAKING pin to the new post until the next day at noon ET. Make the story the first button on the band (96ef5a04), labeled "BREAKING: …".
5. **Breaking email** to the newsletter label e345fa8e. It's short: the red BREAKING bar, the photo, headline, 2–3 sentences, READ button, the All Access CTA, the postal address, and a campaign UTM of breaking_<slug>_<date>. Pass the subject explicitly at publish. Template: newsletter/breaking/2026-09-27-vernell-brown.mjml. This is standing authorization for BREAKING items only. Newsletters, recaps and columns still need Brenden's yes for each send.
6. **Social:** once networks are connected in Metricool (brand 6946016, none connected as of Sept. 27), post to Facebook, X, Instagram and Threads right away with the story link. Until then, give Brenden paste-ready Facebook, X and IG copy.
7. **Verify** the live page, the share card (og:image/title) and email delivery (DISTRIBUTED plus stats). Then tell Brenden in 3 lines: link, what went where, and anything held.

### Follow-up after every breaking story (Brenden: "that means quality control, check up on articles, comments, interaction, social")

Maximum share includes staying on the story. The desk checks at about 1 hour, 4 hours and the next morning:
- **Article QC:** load the live page. Check for typos, broken links or embeds, the photo and credit, the headline on a phone (no clipping), and the share card. Fix in place if needed; never publish over unpublished edits. Add updates (official UF statement, coach comments, practice report) as a dated "Update:" line at the top, not a new duplicate post.
- **Comments:** query Wix comments for the post (POST /comments/v1/comments/query with appId 14bcded7-0066-7c35-14d7-466cb3f09103, filter contextId=post id). Hide spam, abuse or doxxing. Flag real questions or tips for Brenden and the writer. Never argue in comments.
- **Interaction:** post metrics (GET /blog/v3/posts/{id}/metrics: views, likes, comments) plus email stats (delivered, opened, clicked, bounced, complained). Report the numbers, not adjectives. If complaints go above 0.1% or bounces above 2%, stop further sends that day and tell Brenden.
- **Social:** once Metricool has networks connected, read engagement and comments on the social posts. Until then, ask Brenden for screenshots only if something looks off.
- **Report:** at most one short note per check, and only when something changed or needs a decision.

Baseline, first check on the Vernell Brown story (~22:25Z Sept. 27):
- The post had 3 views, 0 comments and 0 likes, minutes after publishing.
- The breaking email (ea362ae3): 1,735 delivered, 60 opened, 3 clicked, 10 bounced, 0 complaints.
- For comparison, the Sunday Edition (2ece0514): 1,811 delivered, 411 opened (22.7%), 75 clicked (4.1%), 15 bounced, 0 complaints.

## List hygiene: bounces and complaints (Brenden: "Clean it", Sept. 27, 2026)

Run this after a heavy send day, and at least once a month. The first run is logged in docs/OVERNIGHT-AUDIT-2026-09-27.md.

1. For every send in the window, pull the BOUNCED and DELIVERED recipients: GET /email-marketing/v1/campaigns/{id}/statistics/recipients?activity=BOUNCED&paging.limit=1000, and the same with activity=DELIVERED.
2. **Suppress** an address only if it bounced 8 or more times in the window AND had 0 deliveries. Upsert it through POST /email-marketing/v1/email-subscriptions/bulk as UNSUBSCRIBED + BOUNCED; that is Wix's own state for a hard bounce. Verify on both the subscription store and the Contacts v5 record.
3. **Keep** these, and don't remove them:
   - Addresses that bounce often but still take some deliveries. Put them on a watch list.
   - The rotating Hotmail/Outlook/MSN/Live addresses that bounce 1–4 times each. That's Microsoft throttling our volume. The fix is fewer list-wide sends per day, not deleting readers.
4. **Never auto-remove:**
   - Staff or contributor addresses. Tell Brenden their mailbox is bouncing instead.
   - Wix system addresses (safety.wix.com, wixsite.online).
5. **Complaints:** count contacts whose email.deliverabilityStatus is SPAM_COMPLAINT and whose email.subscriptionStatus.status is SUBSCRIBED, using POST /contacts/v5/contacts/count. If the count is above 0, set those contacts to UNSUBSCRIBED and keep SPAM_COMPLAINT. Never re-subscribe a complainer.
6. In the day's audit doc, log only masked addresses (first two characters plus the domain), with counts and before/after states.

API notes:
- Query Email Subscriptions returns at most 50 rows per call, even with limit 100. Chunk `$in` lists at 50, or the missing rows look like NO_RECORD.
- Query Email Subscriptions requires an email filter. For counts by status, use Contacts v5 count/search, which can filter on email.deliverabilityStatus and email.subscriptionStatus.status.
- Observed Sept. 27: Wix already skips contacts flagged BOUNCED or SPAM_COMPLAINT, even while they are SUBSCRIBED. But it never flagged the 9 chronic bouncers, so they were mailed on every send until they were suppressed by hand.
- ExecuteWixAPI times out after 60 seconds. Fan the per-campaign calls out with Promise.all.
- Forwarded mailboxes hide bounces from Wix. When a subscriber's host auto-forwards to a dead mailbox, Wix records DELIVERED, and the final bounce goes to brenden@ as a postmaster@outlook.com or mailer-daemon "Undeliverable" notice, because the forwarder keeps our Return-Path. So every hygiene run also searches Brenden's Gmail: `from:postmaster OR from:mailer-daemon OR subject:undeliverable newer_than:30d`. Group the notices by failed address and suppress addresses that fail on every send. Viewing a notice registers an "open" for that subscriber, since the notice carries his tracking pixel, so don't count opens that land after a notice arrives.

1-hour check on the Vernell Brown story (23:25Z Sept. 27):
- Post baa858cf is live, featured, with the correct title. 111 views, 0 likes. The metrics count 1 comment, but the comments query returns none under contextId, resourceId or any status filter. It may have been deleted or be held somewhere else; recheck at 02:25Z.
- Breaking email ea362ae3: 1,810 delivered, 404 opened (22.3%), 64 clicked (3.5%), 14 bounced (0.77%), 0 complaints. The open rate is now on par with the Sunday Edition's 22.7%.
- Social: not connected. No action needed.

4-hour check on the Vernell Brown story (02:25Z Sept. 28):
- Post baa858cf: still live, featured, `hasUnpublishedChanges: false`. 211 views, 0 likes. No typos, broken links or credit issues in the body; cover and alt text intact. No official UF/Sumrall update on Brown since the original story — nothing to add as an "Update:" line.
- The "1 comment" in metrics: re-checked every status (pending/hidden/published/deleted) under both contextId and resourceId — zero rows every time, same as the 1-hour check. Treating this as a stale counter in Wix's own metrics endpoint, not a real comment; not chasing further unless it changes.
- Breaking email ea362ae3: **could not check.** `email-marketing/v1/campaigns/*` now returns a 401 "Account authorization error - site owner action required" on every call — the same block found during tonight's department-tool audit on an unrelated campaign lookup. Confirmed it's scoped to Email Marketing only (Contacts API calls succeed). This needs Brenden to reconnect/re-approve the Email Marketing app in the Wix dashboard before any campaign stats (this one included) can be pulled again.
- Social: Metricool has no networks connected yet (checked directly — `getBrandSettings` returns the connection-setup link). No action needed.
