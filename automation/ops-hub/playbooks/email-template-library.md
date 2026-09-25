# GatorBait Email Template Library

Updated: 2026-09-24

Purpose: stop rebuilding email layouts from scratch. Prefer Wix-native reuse first, then adapt vetted open-source patterns into Wix MJML drafts or existing Wix automation emails.

## Wix-native operating rule

1. Reuse or save a proven Wix campaign as a template whenever possible.
2. For new campaign families, use Wix MJML drafts so layout is versionable and portable.
3. For automation emails, edit the existing Wix automation email action in place after reading its current content; never rebuild proprietary WEB composer JSON from scratch.
4. Never activate a second automation on the same trigger without checking the live automation IDs first.
5. Keep transactional emails transactional and marketing drips consent-gated.

## Current GatorBait email capacity

- Wix Email Marketing account: active
- package: Ascend Unlimited / AscendPro
- monthly email allocation: 1,000,000
- campaigns: unlimited
- scheduling: enabled
- multiple senders: enabled
- Wix branding removal: enabled
- open tracking: enabled

## Approved free source libraries

### 1. mjmlio/email-templates
Official MJML community collection.
Use:
- `newsletter.mjml` -> GatorBait Magazine / weekly digest
- `alert.mjml` -> breaking story / urgent alert
- `card.mjml` -> compact single-story or sponsor block

Why: native MJML source, responsive, and directly compatible with Wix campaign creation using campaignEditorType MJML.

Repository: https://github.com/mjmlio/email-templates

### 2. ColorlibHQ/email-templates
Free responsive MJML/HTML collection.
Use:
- Template 24 “Brief” -> editorial/news digest starting point
- Template 27 “Verge” -> winback / re-engagement
- Template 21 “Lume” -> welcome/onboarding

Why: newsletter-first layouts, table-safe HTML, strong editorial structure.

Repository: https://github.com/ColorlibHQ/email-templates
Installed/pinned upstream: `vendor/colorlib-email-templates` at `3018557fe943fb1c3e3367aa52d39b2fca44f725` (MIT). Do not fork-copy individual files when the upstream submodule can remain the source of truth.

### 3. usewaypoint/responsive-transactional-email-templates
Free responsive transactional patterns.
Use:
- `saas-payment-declined.html` -> payment recovery visual/content reference
- `saas-trial-ends-soon.html` -> free-trial ending email
- `saas-welcome.html` -> subscriber welcome
- `saas-subscription-receipt.html` -> renewal/payment receipt

Why: purpose-built transactional flows with tested responsive patterns.

Repository: https://github.com/usewaypoint/responsive-transactional-email-templates

### 4. Mailteorite/mjml-email-templates
MIT-licensed MJML + compiled HTML collection.
Use:
- `newsletter/` -> digest variants
- `reengagement/` -> winback
- `receipt-invoice/` -> billing/receipt references
- `product-launch/` -> special edition / show launch

Repository: https://github.com/Mailteorite/mjml-email-templates

### 5. mailgun/transactional-email-templates
Battle-tested responsive transactional HTML.
Use:
- billing email
- action email
- alert email

Why: mature fallback patterns for plain, high-deliverability transactional mail.

Repository: https://github.com/mailgun/transactional-email-templates

## GatorBait standard families

### A. Story Alert
Trigger: new blog post.
Owner: existing `GatorBait Story Alert — New Blog Post` automation.
Layout: masthead, story image, headline, short dek, one CTA, compact footer.
Do not create a second blog-post email automation.

### B. GatorBait Magazine Digest
Use for weekly/editorial newsletters.
Layout:
- small masthead + date line
- hero story image/headline/dek/CTA
- second story image/headline
- third story headline-only
- optional merch row
- footer/unsubscribe
Source pattern: Colorlib **24 · Brief** editorial shell + Colorlib **04 · Stories** responsive multi-column story grid. Canonical GatorBait baseline: `newsletter/templates/gatorbait-magazine-colorlib-v1.mjml`.

### C. Welcome / Onboarding
Use for new paid/free-trial subscribers.
Suggested sequence:
- immediately: welcome + what they get
- day 2: best current GatorBait content
- day 5: GatorBait TV / Buddy Martin Show
- day 7: membership value / manage subscription
Source pattern: Waypoint SaaS Welcome or Colorlib Lume.

### D. Trial Ending
Use native Pricing Plans free-trial automation.
Message should clearly state:
- trial end date
- next charge amount/frequency
- manage subscription link
- support contact
Source pattern: Waypoint trial-ends-soon.

### E. Payment Recovery
Use the existing active Wix automation:
`Email customers when a subscription payment fails`
Automation ID: `ed6833d7-7b15-42d7-a76a-1fa0e9f9ee0d`

Do not create a duplicate failed-payment automation.
Use a simple recovery layout: problem statement, exact deadline, Submit Payment button, support contact.
Source pattern: Waypoint payment-declined.
The current live email should be edited only by reading and preserving the full Wix WEB composer content first.

### F. Winback / Re-engagement
Audience: previously engaged but lapsed subscribers only.
Layout: one reason to return, one current story/show, one CTA.
Source pattern: Mailteorite reengagement or Colorlib Verge.

## Design rules

- GatorBait navy / Florida orange / white
- 600–640px content width
- one primary CTA per transactional email
- editorial digest may have up to 3 story CTAs
- no fake urgency
- no unnecessary animated backgrounds
- GIFs only when they add real editorial value and remain understandable on the first frame
- mobile-first typography
- always preview/test before publish
- preserve unsubscribe and privacy/compliance footer
- use original/cleared GatorBait photography whenever available
- Magazine baseline: serious editorial/game photography only when photography is used; no novelty/gimmick art when a real game photo is available
- never repeat an image/media ID within one Magazine issue; text-only blocks are preferred to duplicate art
- run the repository Newsletter Stack QC and strict MJML compile before provider preview/send
