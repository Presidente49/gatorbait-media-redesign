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

## 2. Automatic blog email = GatorBait Story Alert

This is a single-story automatic email, not a GatorBait Magazine issue.

Production automation:
- Name: `GatorBait Story Alert — New Blog Post`
- Automation ID: `5006baf5-fbbf-440c-a012-a09bdbd95fc9`
- Trigger: `wix_blog-new_blog_post`
- Email action ID: `042c6c7c-f7e4-4d60-abd2-5f22fa69cf0e`
- Audience: cleaned opted-in deliverable audience already configured on the automation.

Required dynamic fields:
- `${title}`
- `${coverImageUrl}`
- `${description}`
- `${url}`

Required presentation:
- GatorBait navy/orange masthead.
- Story hero image.
- Editorial headline.
- Excerpt/deck.
- Orange `READ THE FULL STORY →` CTA.
- GatorBait identity and compliant business footer.
- Never send Wix's generic `New Blog Post` treatment.

Pre-activation rule: render Preview Email Content with a real current post payload and require all four checks to pass: brand, title, image and CTA.

## 3. Generic blog-email workflow stays off

The workflow below was incorrectly described as a push notification but its actual action was a triggered email. It produced the unwanted generic message on Sept. 18, 2026.

- Automation ID: `824714d4-7e31-4b1d-95b2-ccec04d788af`
- Old name: `Send notification when new blog post is published`
- Actual action: `triggered-emails`
- Status: **INACTIVE**
- Disabled at revision 14 on Sept. 18, 2026.

Do not reactivate it unless its action is intentionally repurposed and previewed.

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
- Generic blog-email workflow remains inactive.
- Story Alert preview passes brand/title/image/CTA checks.
- Magazine campaign remains DRAFT until owner approval.
- Magazine image URLs are unique.
- Mobile layout is checked before send.
- Repo source/runbook are updated with any new persistent rule.
