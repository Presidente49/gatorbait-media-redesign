# Master Control Doctrine

This file contains durable product, business, editorial, UX, and revenue rules. Keep volatile IDs, revisions, campaign statistics, and temporary connection states out of this file.

## Business model

GatorBait is a two-engine sports publishing business.

### Free GatorBait
The free/public experience is the acquisition and monetization engine:

- Front Page / daily newsroom
- public stories and columns
- GatorBait TV and The Buddy Martin Show discovery
- free lightweight community/message-board entry
- newsletter acquisition
- search/social distribution
- merchandise discovery
- tasteful display advertising
- membership conversion paths

### GatorBait Magazine
The Magazine is the premium/member product:

- deeper features and columns
- history/archive value
- premium editorial packaging
- selected premium video/audio/community value
- cleaner UX with less advertising than the free side
- conversion and retention value, not another generic category archive

The basic funnel is:

**free reader → repeat reader → email/community/show → member/customer**

No important article should end in a dead end.

## Three primary destinations

Keep the visitor model simple:

1. **Front Page** — current newsroom/free traffic engine.
2. **Magazine** — premium/member editorial product.
3. **GatorBait TV / Buddy Martin Show** — owned video/live destination.

Community, Shop, Join, Account, Contact, and Policies support those three doors.

Do not turn the primary navigation into a list of every sport or historical category.

## Revenue flywheel

**Publish → Distribute → Monetize → Convert → Retain → Measure → Learn**

Revenue stack, in maturity order:

1. display/programmatic advertising,
2. membership subscriptions,
3. direct local/regional digital sponsorship,
4. Buddy Martin Show sponsorship,
5. newsletter sponsorship,
6. merchandise,
7. premium digital/print products,
8. relevant affiliate inventory,
9. clearly labeled sponsored content where editorially appropriate.

Google/display revenue is the floor, not the entire business.

## Public article model

Public stories are journalism and revenue-producing digital assets.

Preferred article flow:

- headline
- hero
- opening section
- responsive in-content ad after the opening section
- main article
- desktop margin/rail inventory where whitespace allows
- end-of-story ad before related content
- related stories
- Buddy Martin Show / TV path
- community path
- Magazine/member path

Advertising must not damage readability, Core Web Vitals, editorial trust, or mobile usability.

Mobile gets fewer units than desktop. Do not create first-screen takeover, narrow body text, horizontal overflow, repeated interruption, or layout shift.

## Editorial and design direction

Brand promise:

**Old school journalism + new tech.**

Protect the distinctive journalism and institutional memory. AI improves research, packaging, distribution, analytics, design, and operations; it does not flatten Buddy Martin, Franz Beard, Loren Meadows, contributors, or original reporting into generic copy.

Current visual direction:

- professional digital sports newsroom / magazine front page,
- Florida orange, blue, and white,
- restrained use of black,
- strong original photography,
- readable typography,
- clear hierarchy,
- fast system fonts where possible,
- newest important content first,
- no light-blue category ribbons,
- no generic AI-slop sports art,
- accurate helmets/logos,
- no invented people or fake likenesses.

For AP-mode broadcast graphics:

- 16:9 / 1920×1080,
- layered high-end broadcast treatment,
- no faces by default unless real supplied photography is appropriate,
- accurate uniforms/helmets/logos,
- title-safe,
- concise mobile-safe SEO title,
- avoid guest names in the title unless materially useful.

## Homepage doctrine

The homepage is the interactive front page of the publication.

Prioritize:

1. dominant current story,
2. strongest current secondary stories,
3. newest chronological free stories,
4. GatorBait TV / Buddy Martin Show,
5. community,
6. membership,
7. merchandise where useful.

Cards should normally go directly to stories. Avoid unnecessary feeder/category pages.

Every prominent Front Page story needs suitable art. Never substitute incorrect team imagery.

## Magazine doctrine

Magazine should feel curated and premium.

Use:

- clear lead and secondary hierarchy,
- unique imagery rather than repeated art,
- columns/features/history,
- watch/listen modules where they add value,
- past issues/archive,
- premium/member conversion.

Do not default to a gallery or flipbook.

## TV / Buddy Martin Show doctrine

The show is part of the retention engine, not a disconnected page.

Use it across:

- homepage,
- relevant articles,
- email,
- community discussion,
- replay/archive.

Do not leave giant dead player whitespace on mobile.

## Community doctrine

Start lightweight:

- latest discussions,
- 3–5 active topics,
- article threads,
- Buddy Martin Show thread,
- post/reply,
- links back into owned content.

Longer-term architecture may use Discourse + GatorBait identity/SSO and premium rooms. Do not overbuild before active participation exists.

Never leave the visitor with a 404 for a promoted Message Board route.

## Email doctrine

Email is a revenue/distribution channel.

- consented recipients only,
- unsubscribed stays unsubscribed,
- bounce/complaint suppression honored,
- targeted engaged cohorts before broad expansion when the data supports it,
- explicit UTM tracking,
- no blind "blast everything" rule,
- compliance footer, sender identity, physical/contact information, unsubscribe,
- newsletter presentation should match the GatorBait magazine/newsroom brand.

When automation identity matters, use stable IDs + origin + message ID. Friendly names have proven misleading.

## Social doctrine

Before a post/repost:

- verify source facts,
- verify destination account,
- use canonical URL,
- apply explicit UTM,
- respect channel format,
- wait for metric feeds to mature before treating zeros as evidence,
- compare social reach with site-attributed traffic and reader quality.

Routine social publishing is not evidence that the story worked. Site behavior matters.

## SEO doctrine

SEO is revenue work.

Prioritize existing pages with:

- high impressions,
- page-one or near-page-one position,
- weak CTR,
- strong on-site engagement.

Improve the existing asset before producing another page targeting the same intent.

Every important story should have:

- correct author,
- categories/tags,
- featured image,
- alt text,
- canonical URL,
- one valid Article/NewsArticle schema,
- search/social metadata,
- internal links.

Avoid duplicate URLs and schema duplication.

## Attribution doctrine

Use explicit UTMs on controllable outbound traffic.

Recommended fields:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- optional `utm_content`

Normalize known owned-channel traffic internally when analytics default groupings are misleading, but preserve raw source/medium in underlying data.

## Membership doctrine

Membership is a core revenue line, not an afterthought.

Free content should create tasteful next steps to:

- another story,
- email,
- show,
- community,
- Magazine membership.

Do not cover every free article in desperate subscription clutter. Conversion works through relevance, trust, and repeated value.

## Merchandise doctrine

Merchandise is part of the revenue stack but may live outside Wix. Do not assume Wix revenue dashboards capture all merchandise revenue.

Current visual preference favors traditional Florida orange/blue/white, blue/white hats and visors, and avoids a black-heavy aesthetic.

## Architecture doctrine

Wix remains the current CMS/business engine.

Protect:

- native blog URLs,
- subscriptions/members,
- store/business data,
- SEO equity,
- analytics,
- canonical content.

The GitHub repo is a companion/control workspace, not automatically the live host.

Move behavior toward stable native Wix/Velo only when it reduces fragility. Preserve tested fallbacks during migration. Stability beats architectural pride.

## Retired / do-not-resurrect items

Unless explicitly re-approved:

- The Monday Chomp
- Quick Chomps
- Today’s Edition
- old "Sign up for free" article clutter
- "Join us on our app" promo
- retired roster blocks
- retired competing dark-theme implementation
- remote font regressions that delayed first paint
- permanent short-interval polling
- broad global CSS selectors
- endless page-specific whitespace hacks
- arbitrary redesign experiments that do not improve stability, revenue, reader experience, distribution, or growth

## Operating KPIs

Maintain a simple control-room view:

### Audience
sessions, users, pageviews, pages/session, returning usage

### Editorial
top stories, high-engagement/low-reach stories, weak-engagement stories, age-adjusted performance

### Search
impressions, clicks, CTR, position, indexed/canonical health

### Email
delivered, opens, clicks, bounces, complaints, unsubscribes

### Social
reach, interactions, referral sessions, on-site engagement

### Advertising
ad impressions, viewability, page RPM, ad revenue, revenue per session

### Membership
active members, new members, cancellations/churn, recurring revenue

### Commerce
merchandise referrals/orders where measurable

The long-term business metric is not pageviews alone. Prefer **total revenue per 1,000 sessions** when the data is trustworthy.
