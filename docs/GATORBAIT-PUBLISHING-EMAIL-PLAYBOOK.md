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

This is the production single-story automatic email, not a GatorBait Magazine issue.

Live routing verified September 23, 2026, 03:21 UTC:
- Active automation: `5006baf5-fbbf-440c-a012-a09bdbd95fc9`, revision 13.
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

- Automation `824714d4-7e31-4b1d-95b2-ccec04d788af`, revision 20, is INACTIVE.
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
4. GatorBait Magazine issues are manually reviewed campaigns. They do not auto-send on blog publish.
5. Keep the issue magazine-like: strong lead, clear hierarchy, short decks, article CTAs, GatorBait TV close.
6. No Magazine photo gallery unless the owner explicitly asks for one. Current owner direction is **no gallery**.
7. Do not send until the owner explicitly approves the draft.

### Magazine newsletter design baseline — September 24, 2026

- Upstream design library: `ColorlibHQ/email-templates`, pinned in this repo at commit `3018557fe943fb1c3e3367aa52d39b2fca44f725` under `vendor/colorlib-email-templates` (MIT).
- Use Colorlib **24 · Brief** for the editorial masthead, issue hierarchy and restrained typography.
- Use Colorlib **04 · Stories** for responsive multi-column story packages.
- GatorBait issue source: `newsletter/templates/gatorbait-magazine-colorlib-v1.mjml`.
- Editorial photography must be real, relevant and licensed/owned. Do not substitute novelty/gimmick artwork when serious game photography exists.
- **Never repeat a photo in the same issue.** Uniqueness is by underlying Wix media ID when present, otherwise normalized image URL. If a story does not have unique usable art, make it text-only.
- For the Ole Miss edition currently being corrected, use exactly two serious football photos: one Jadan Baugh game photo and one Aaron Philo game photo. The Cowboy image is excluded from the newsletter.
- Run `node automation/newsletter/validate-unique-images.mjs <issue.mjml>` before creating or updating a Wix campaign. Any duplicate image is a hard stop.

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
- Magazine campaign remains DRAFT until owner approval.
- Magazine image URLs are unique.
- Mobile layout is checked before send.
- Repo source/runbook are updated with any new persistent rule.
