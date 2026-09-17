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
- yesterday night's completed shows have either a recap package in progress or an explicit no-recap reason;
- eligible completed shows have their Restream Clips batch accounted for.

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

## Guest-history context pass

GatorBait and The Buddy Martin Show have long-running relationships with many recurring guests. Do not package a known guest as a generic "special guest" when their history with Buddy Martin, Brenden Martin, GatorBait, Gator Country, the University of Florida or prior shows materially explains why the appearance matters.

Before show promotion, recap writing, clip selection or social packaging:

1. identify the guest's known relationship with Buddy Martin and/or Brenden Martin;
2. note relevant GatorBait, Gator Country, University of Florida or prior-show history;
3. distinguish owner recollection from facts that can be publicly verified;
4. create one short `why this guest matters to us` context line;
5. use that context when it genuinely strengthens the title, description, recap intro, clip hook or social caption;
6. never invent a relationship or inflate a real relationship into an unsupported claim about causing the guest's later success.

For recurring guests, the default assumption is that useful relationship context may exist and should be checked. The context should support the current story, not overwhelm it.

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
- resolve each prior night's exact Restream recording and consume its already-generated Restream Clips batch;
- select only the strongest useful clips instead of regenerating the full show in another editor;
- resolve guest-history context before packaging selected clips;
- build or finish one useful recap post per completed show;
- de-duplicate each selected clip against destinations already published;
- publish the first useful assets to Facebook first while it remains the largest active audience, then other approved connected destinations;
- use Descript only for clips that need custom cleanup, reframing, transcript-based editing or another deliberate repair.

### Midday

- inspect early social/article performance;
- publish only the next useful asset, not filler;
- handle breaking-news changes and update canonical stories rather than duplicating them unnecessarily;
- check member/customer exceptions and failed-payment/service-recovery items.

### Afternoon / show prep

- prepare show title/description/thumbnail/AP Mode package;
- verify guest names, topics, links and scheduled destinations;
- resolve and record the guest-history context pass before final packaging;
- build pre-show social promotion only when the show is confirmed;
- ensure the previous show's content package is not left half-finished.

### Post-show

Follow `restream-clips-first.md` and `social-and-show-clips.md`:

- resolve the exact Restream recording;
- allow/use the existing Restream Clips batch as the default clip source;
- do not create a duplicate full-show clipping job in vidIQ/Descript by default;
- select up to five worthwhile clips from the waiting Restream batch;
- use Descript only when a selected clip needs intentional custom editing;
- build one useful general recap blog post;
- route each clip to the social identity that owns the content or show;
- de-duplicate by source show + source clip/timestamp + platform + destination ID;
- package native social assets;
- record source and publication IDs so the workflow cannot duplicate itself.

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
- which Restream clip IDs/timestamp fingerprints were used and where;
- which guest-history context was newly confirmed or corrected;
- what should roll into tomorrow;
- any measurable result worth learning from.

Do not promote a one-day result into a permanent rule. Reusable playbook changes require repeated evidence or owner review.

## Escalation rules

Escalate instead of looping when:

- the same production failure survives the bounded verification attempt;
- an eligible completed show has no usable Restream Clips and fallback editing would be non-trivial;
- a Wix mutation would require an untested playbook or uncertain rollback;
- customer consent, rights, legal claims, pricing or account access are uncertain;
- a guest-history claim cannot be separated from rumor or unsupported attribution;
- a mobile/desktop regression cannot be reproduced consistently;
- a model recommendation conflicts with deterministic evidence or policy.

## Desired daily brief

The controller's owner-facing daily brief should fit on one screen whenever possible:

- **Status:** healthy / attention required.
- **Freshness:** homepage + Magazine current or stale.
- **Today:** up to five material actions.
- **Distribution:** shows / waiting Restream Clips / Facebook / other social / newsletter state.
- **Guest context:** only newly relevant relationship/history notes that affect packaging.
- **Revenue:** only meaningful changes or exceptions.
- **QC:** desktop/mobile pass, fail or not yet verified.
- **Escalations:** only items needing owner action.
