# GatorBait Daily Operations Playbook

## Objective

Give the single controller one repeatable daily operating rhythm for the website, newsroom, social/video distribution, subscriptions, magazine, store and revenue surfaces. The controller should surface exceptions, not create busywork.

This playbook does not replace the 15-minute Ops Hub health loop. It adds a daily editorial/business layer on top of that continuous health monitoring.

## Daily controller cycle

`OPEN → VERIFY → EDITORIAL → DISTRIBUTE → MONETIZE → QC → CLOSE → LEARN`

If everything is healthy and current, the correct outcome is often `NOOP`.

## Morning open

### 1. Verify the business is reachable

Run deterministic health checks first:

- homepage;
- Magazine;
- GatorBait TV / Buddy Martin Show route;
- membership/pricing plans;
- policies and contact;
- official merchandise store.

Persistent health failures escalate under the existing bounded controller loop. Do not let a model diagnose a problem that a deterministic check can already prove.

### 2. Verify newsroom freshness

Compare the public site and Magazine against the newest canonical Wix Blog/RSS content.

Check:

- newest published story is represented where expected;
- homepage lead/supporting order is editorially defensible;
- Magazine current issue/Latest rail is not stale;
- byline, date, image and destination links are correct;
- yesterday night's completed shows have either a recap package in progress or an explicit no-recap reason.

Do not mechanically promote every newest story to the lead position. Freshness and editorial importance are separate decisions.

### 3. Build today's operating queue

Create a short queue with only material work:

- editorial publish/repair;
- homepage or Magazine refresh;
- show recap/clips;
- newsletter work;
- social distribution;
- member/customer issue;
- revenue/merchandise opportunity;
- verified technical defect.

Every item receives one owner, one current state, one next action and one verification method. Models may help reason about an item but do not become its owner.

## Desktop + mobile quality control

### Daily minimum surfaces

Check these after meaningful content/design changes and at least once per operating day when practical:

1. Homepage.
2. `/magazine`.
3. Newest important article.
4. GatorBait TV / latest recap destination.
5. Membership page.

### Desktop baseline

Use a normal editorial desktop viewport around 1365–1440 px wide. Verify:

- masthead/navigation spacing;
- lead-story hierarchy;
- image aspect ratio and crop;
- readable line lengths;
- no horizontal overflow;
- footer and primary CTAs reachable;
- no first-paint flash/theme conflict;
- current stories and destinations are correct.

### Mobile baseline

390 px is the primary daily mobile viewport. Use 430 px after layout/content changes and 320 px as a periodic narrow-screen regression check.

Verify:

- no horizontal overflow;
- headline wrapping is readable;
- masthead/menu separation is clean;
- interactive controls are at least 44 px where required;
- images preserve aspect ratio and useful crops;
- forms/dialogs dismiss correctly;
- footer is reachable;
- video/clip embeds do not overflow;
- subscription and newsletter CTAs do not block reading.

A page is not considered verified because its HTTP response succeeded. Visual/runtime QC is a separate verification layer.

## Editorial + distribution rhythm

### Morning

- publish/repair the strongest current coverage;
- refresh homepage/Magazine hierarchy when needed;
- complete the prior night's show recap and first post-show clips;
- distribute timely stories natively to social channels.

### Midday

- inspect early social/article performance;
- publish only the next useful asset, not filler;
- handle breaking-news changes and update canonical stories rather than duplicating them unnecessarily;
- check member/customer exceptions and failed-payment/service-recovery items.

### Afternoon / show prep

- prepare show title/description/thumbnail/AP Mode package;
- verify guest names, topics, links and scheduled destinations;
- build pre-show social promotion only when the show is confirmed;
- ensure the previous show's content package is not left half-finished.

### Post-show

Follow `social-and-show-clips.md`:

- resolve the exact Restream recording;
- build one useful general recap blog post;
- select up to five worthwhile clips;
- package native social assets;
- record source IDs so the workflow cannot duplicate itself.

## Revenue and retention checks

Daily operations should notice revenue problems without turning every page into a sales funnel.

Check when data is available:

- membership starts/completions/cancellations/payment failures;
- newsletter growth and unsubscribes;
- Facebook/YouTube monetized content performance;
- merchandise destination health;
- high-intent traffic to pricing plans;
- active experiments such as subscriber win-back.

Pricing, discounts, refunds, paid advertising and new financial commitments remain approval-required.

## End-of-day close

Record:

- what materially changed;
- what was verified on desktop/mobile;
- what failed and remains open;
- what content was published/distributed;
- what should roll into tomorrow;
- any measurable result worth learning from.

Do not promote a one-day result into a permanent rule. Reusable playbook changes require repeated evidence or owner review.

## Escalation rules

Escalate instead of looping when:

- the same production failure survives the bounded verification attempt;
- a Wix mutation would require an untested playbook or uncertain rollback;
- customer consent, rights, legal claims, pricing or account access are uncertain;
- a mobile/desktop regression cannot be reproduced consistently;
- a model recommendation conflicts with deterministic evidence or policy.

## Desired daily brief

The controller's owner-facing daily brief should fit on one screen whenever possible:

- **Status:** healthy / attention required.
- **Freshness:** homepage + Magazine current or stale.
- **Today:** up to five material actions.
- **Distribution:** shows/clips/social/newsletter state.
- **Revenue:** only meaningful changes or exceptions.
- **QC:** desktop/mobile pass, fail or not yet verified.
- **Escalations:** only items needing owner action.
