# GatorBait CRM and Email Inventory

**Date:** 2026-08-14
**Production site:** `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`

## Current authoritative CRM segments

| Purpose | Label key | Legacy label ID | Status |
|---|---|---|---|
| Clean opted-in deliverable marketing audience | `custom.gatorbait-active-email-audience` | `e345fa8e-f66a-4e57-ad00-81707cf8dc15` | ACTIVE / authoritative |
| Paid-plan contacts | `custom.gatorbait-paid-subscribers` | `6ea71d74-c6bf-4d32-8db5-03d5081f2d6f` | ACTIVE / entitlement segment |
| Valid addresses needing fresh opt-in | `custom.gatorbait-re-opt-in-candidates` | `0fc48e9b-e603-4a22-9445-79267969663e` | ACTIVE / do not market until consent |
| Explicit opt-outs | `custom.gatorbait-do-not-market` | `ff79acef-08ff-453c-9e23-da82b37871b3` | ACTIVE / exclusion |

Previously verified counts during cleanup:
- Active Email Audience: 454 subscribed + valid contacts.
- Re-Opt-In Candidates: 807 valid contacts without clear marketing opt-in.
- Do Not Market: 569 explicit opt-outs isolated from marketing.
- Paid Subscribers: 453 pricing-plan-associated contacts; 216 were both subscribed and deliverable and are included in the active marketing audience.

Consent states were not overridden during cleanup.

## Blog-post distribution

### Email automation

Automation ID: `5006baf5-fbbf-440c-a012-a09bdbd95fc9`

- Name: `Notify when a blog post is published`
- Trigger: Wix Blog `wix_blog-new_blog_post`
- Status: ACTIVE
- Audience label ID: `e345fa8e-f66a-4e57-ad00-81707cf8dc15`
- Verified mapping: **GatorBait Active Email Audience** / `custom.gatorbait-active-email-audience`
- `sendToUnsubscribed`: false
- `transactional`: false
- Result: correct marketing-consent behavior for blog promotion.

### Push automation

Automation ID: `824714d4-7e31-4b1d-95b2-ccec04d788af`

- Name: `Send notification when new blog post is published`
- Trigger: Wix Blog `wix_blog-new_blog_post`
- Status: ACTIVE
- Action: push notification to Wix Blog followers.
- No email action remains in this workflow.

**Verified architecture:** one email path + one push path. The previous duplicate-email problem is currently resolved.

## New signup acquisition path

Automation ID: `b0b0a700-80c2-47d1-82fe-fb77cab81ad0`

- Name: `GatorBait Email List - Add to Active Audience`
- Status: ACTIVE
- Trigger: modern Wix Forms submission.
- Form ID: `6babfee8-147f-428a-9e14-6b72f6225835`
- Action: add `custom.gatorbait-active-email-audience` label to the contact.

This is the target architecture for future newsletter signup components on homepage, article pages, footer, and Buddy Martin Show page.

## Legacy mailing-list labels still present

These are not the authoritative send audience and should be treated as historical inputs until contact overlap and automation dependencies are fully mapped:

- `custom.gatorbait-email-list` — **GatorBait Email List**
- `custom.newsletter-subscriber` — **Newsletter Subscriber**
- `custom.email-subscribers` — **Email Subscribers**
- `custom.the-email-list` — **The Email List**
- `custom.join-our-mailing-list` — **Join our mailing list**
- `custom.be-the-first-to-know` — **Be the first to know!**

Additional historical status labels include `Engaged`, `Prospect`, `Lost Subscriber`, `Inactive`, `Bounced`, `Spam Complaints`, and `Subscriptions`.

Do not delete legacy labels until their contact counts and automation/form dependencies are mapped. Deleting a Wix contact label removes it from every contact using it.

## Active user-owned automations requiring review

### Preserve / migrate

1. `824714d4-7e31-4b1d-95b2-ccec04d788af` — blog push notification.
2. `b0b0a700-80c2-47d1-82fe-fb77cab81ad0` — new newsletter signup → active audience label.
3. `ed6833d7-7b15-42d7-a76a-1fa0e9f9ee0d` — failed subscription payment email. Transactional=true; appropriate to preserve if subscription infrastructure remains.

### Review / modernize

4. `5af755ce-054b-4be9-b1c8-b0a2e653a38d` — pricing-plan purchase welcome push. Copy says `LIVE Mon-Thu 9PM ET`, which is stale relative to the current Buddy Martin Show schedule. It also assumes paid-plan acquisition is the primary welcome path, which is not the current free-content/newsletter strategy.

### Legacy-risk candidates

5. `ba4e3990-3a01-4eeb-9db7-5128503b0f39` — `ALL ACCESS ANNUAL`. A purchase of one legacy annual plan adds both `pricingPlans.gatorbait-annual` and `pricingPlans.gatorbait-monthly` labels plus `custom.subscriptions`; likely stale/tangled entitlement logic.

6. `dc606f45-2420-4407-b224-3dc114b8606c` — `MAGAZINE MONTHLY/ANNUAL`. Purchases of either legacy magazine plan add both monthly and annual labels; likely stale/tangled entitlement logic.

7. `d636d37c-5e70-48ee-886f-71310616ed4c` — `Create a task when a form is submitted`. Uses the **legacy Wix Forms & Payments** trigger with no form filter. Its email action is `transactional=false` while `sendToUnsubscribed=true`, then moves/creates a CRM workflow card. This is the highest-priority legacy email-risk automation. Do not disable until the legacy form(s) still capable of triggering it are identified.

## Pricing-plan label history

Wix app-defined pricing labels still present include:

- `pricingPlans.gatorbait-monthly` — ALL ACCESS MONTHLY
- `pricingPlans.gatorbait-annual` — ALL ACCESS ANNUAL
- `pricingPlans.gatorbait-magazine` — GATORBAIT MAGAZINE
- `pricingPlans.magazine-monthly` — MAGAZINE MONTHLY
- `pricingPlans.magazine-annual` — MAGAZINE ANNUAL
- `pricingPlans.guest-checkout`
- old promotional plans: Hurricane Special, Halfoff - QB Clubs, GNK Members Deal

These historical labels reinforce that pricing/subscription logic must be inventoried before any app/plan cleanup.

## Migration decision

- Wix CRM remains the source of truth.
- `GatorBait Active Email Audience` is the current marketing-send audience.
- Paid entitlement and marketing consent remain separate concepts.
- The Studio rebuild should expose one public signup identity and one acquisition path, not recreate the legacy mailing-list label sprawl.
- Sender/domain authentication and reputation recovery remain open deliverability tasks.
