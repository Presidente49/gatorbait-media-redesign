---
name: gatorbait-studio-product-build
description: Professional product-design, Wix Studio branch, migration-preservation, and QA workflow for the next-generation GatorBait Media experience. Use for research, information architecture, route mapping, wireframes, design systems, page families, motion, multimedia, community, Studio implementation, migration rehearsal, and cutover planning. This skill never authorizes publishing the Studio branch.
---

# GatorBait Studio Product Build

## Mission

Build a separate next-generation GatorBait experience that is structurally sound, easy to navigate, modern, multimedia-rich, mobile-first, and competitive with leading sports publishers.

This is a product-development lane. The current live GatorBait site remains production until Brenden separately authorizes a cutover.

## Core principles

1. Journalism first.
2. One shared design system across every page.
3. Preserve current URLs, SEO equity, members, subscriptions, contacts, blog history, analytics, commerce and consent data.
4. Native Wix Studio structure and interactions first.
5. Motion is progressive enhancement, never required to read or navigate.
6. Mobile is a primary canvas.
7. Multimedia is integrated, not bolted on.
8. No Sidelines, Rob Browne, Sidelines.live or retired network branding.
9. No duplicated account, navigation, schema, feed or subscriber systems.
10. No full-framework migration merely for visual polish.
11. A page is not done until navigation, responsive behavior, accessibility, performance and content wiring are verified.
12. Publishing the Studio branch is a separate irreversible approval gate.

## Competitive benchmark

Study current useful patterns from:
- 247Sports / Swamp247
- On3 / Gators Online
- SwampGas / GatorCountry
- USA Today / Gators Wire
- The Athletic
- best-in-class streaming/video and magazine products

Borrow interaction and hierarchy patterns, never proprietary layouts or copy.

## Phase 1 — Discovery

Inventory:
- current content types;
- current routes and indexed pages;
- blog/category/tag patterns;
- members and account flows;
- paid plans and entitlements;
- contacts and marketing consent;
- store/commerce/payment surfaces;
- TV/video;
- podcasts/RSS/Apple/YouTube Music/SoundCloud;
- magazine;
- community/message-board requirements;
- analytics;
- SEO/schema;
- newsletter and automations;
- current brand assets and photography.

Output:
- current-state map;
- opportunity list;
- migration risks;
- design constraints.

## Phase 2 — Information architecture

Create one canonical site map before visual design.

Primary destinations:
- Home / Front Page
- News
- Article
- Recruiting
- GatorBait TV
- Show
- Episode / Clip
- Magazine
- Magazine Issue
- Feature
- Photo Gallery
- Podcasts / Listen
- SwampGas
- Board
- Thread
- Search
- Our Team
- Shop
- Membership / Join
- Account / Billing / Saved / Watchlist
- Contact / Policies

For every current public route, create a route-preservation row:
- current URL;
- page/content type;
- current traffic/search importance;
- proposed Studio destination;
- PRESERVE / REDIRECT / RETIRE;
- canonical handling;
- redirect target if needed;
- migration risk;
- verification result.

Default action = PRESERVE.

## Phase 3 — Wireframes

Wireframe page families before styling:
1. Front Page
2. Section/topic
3. Article
4. GatorBait TV
5. Show detail
6. Magazine
7. Magazine issue/feature
8. SwampGas board index
9. SwampGas thread
10. Recruiting
11. Search
12. Membership/account
13. Team/contact

Wireframes must show:
- hierarchy;
- navigation;
- content density;
- subscription/member surfaces;
- ad-safe areas;
- mobile collapse behavior;
- continuation paths;
- video/audio/social placement.

Do not add motion polish until the wireframe works without motion.

## Phase 4 — Design system

Define reusable tokens:
- colors;
- typography;
- spacing;
- grids;
- breakpoints;
- image ratios;
- borders/radii;
- buttons;
- metadata;
- card density;
- motion durations/easing.

Shared components:
- masthead;
- desktop nav;
- mobile drawer;
- hero story;
- compact story card;
- horizontal rail card;
- live badge;
- score/result module;
- TV tile;
- episode tile;
- magazine cover;
- gallery tile;
- social card/embed;
- podcast platform button;
- forum board row;
- thread row;
- member badge;
- follow/save/watchlist control;
- subscribe CTA;
- related coverage;
- search-result row;
- footer.

## Phase 5 — High-fidelity page system

Apply the design system to every page family.

Expression may vary by product:
- Front Page = fast newsroom
- Magazine = more visual/editorial
- TV = more cinematic
- SwampGas = denser community UI

They must still share:
- masthead;
- typography;
- spacing;
- controls;
- metadata;
- account behavior;
- mobile navigation;
- footer;
- motion language.

## Phase 6 — Motion and interaction

Native Studio interactions first.

Approved motion:
- subtle hero depth;
- section reveal;
- horizontal media rails;
- magazine-cover movement;
- live-status pulse;
- video preview/tap state;
- score/stat transitions;
- reading progress;
- drawer/menu transitions;
- pointer-device hover emphasis.

Rules:
- no essential content hidden behind animation;
- no first-paint fade;
- no permanent polling;
- no heavy motion everywhere;
- reduced-motion support required;
- motion must never delay reading or navigation.

External library adoption gate:
1. verified Studio limitation;
2. specific user benefit;
3. license verified;
4. runtime/page-weight cost measured;
5. mobile/accessibility impact reviewed;
6. rollback path documented.

## Phase 7 — Content and media wiring

Prefer existing data sources over duplicate manual databases.

Plan native connections for:
- Wix Blog;
- CMS where genuinely useful;
- GatorBait photography;
- YouTube / GatorBait TV;
- podcast RSS;
- Apple Podcasts;
- YouTube / YouTube Music;
- SoundCloud if validated;
- social embeds;
- galleries;
- store;
- pricing plans;
- members;
- newsletter.

## Phase 8 — Community

SwampGas should provide:
- clear board hierarchy;
- football/recruiting/general boards;
- trending threads;
- game threads;
- readable chronology;
- member profiles;
- moderation;
- story-to-discussion bridges.

Never fabricate users, posts, counts, online activity, commitments or engagement.

Backend selection is separate from visual design.

## Phase 9 — Preferred Wix migration architecture

### Preferred path: Studio branch of the EXISTING site

Use Wix's current Studio branch capability for the existing Premium Wix Editor site.

Why:
- the current live Editor branch can remain published during the rebuild;
- the Studio branch shares the same site dashboard;
- most business apps and data are shared across branches;
- the domain stays associated with the site and switches to the branch that is published;
- the design itself is rebuilt cleanly in Studio.

This is preferred over creating a duplicate/new site because a duplicate is a different site and does not preserve all member/contact/business data.

### Critical migration warning

Publishing the Studio branch is a major cutover gate.

Current Wix behavior says the original Wix Editor branch cannot simply be republished after the Studio branch is published.

Therefore:
- never publish as a test;
- perform a complete migration rehearsal first;
- take a duplicate/archive of the Editor version for reference before cutover;
- understand that such a duplicate is a backup/reference site, NOT a live-data rollback.

## Phase 10 — Data-preservation audit

Before the Studio branch can be considered cutover-ready, verify each category against live provider data.

### Identity and audience
- Site Members count
- member login/account behavior
- contacts count
- subscriber/marketing consent states
- labels/segments
- member roles/badges
- blocked/reported states if relevant

### Revenue and entitlement
- Pricing Plans
- active/paused/canceled plan holders
- plan benefits/permissions
- paid orders
- billing/cancellation flows
- coupons if used
- payment provider configuration
- tax/shipping/store settings if relevant

### Editorial
- published Wix Blog posts
- authors
- categories
- tags
- displayed cover media
- post URLs/slugs
- post SEO
- comments if used
- canonical URLs
- RSS/blog feed behavior

### Email and automation
- current signup forms
- explicit email consent
- story-alert automations
- newsletter audience labels
- suppression/unsubscribe state
- bounced/spam complaint handling
- sender identity
- triggered emails

### Apps
For every installed app:
- supported in Studio branch?
- automatically present?
- must be manually added to branch?
- data shared or branch-specific?
- settings need manual reconfiguration?
- unsupported replacement plan?

Special warning:
- legacy/old Wix Form submissions are not guaranteed to transfer into the Studio branch.
- unsupported apps must be identified before cutover.

### Analytics and advertising
- GA4 identity
- Google Search Console
- Wix Analytics
- AdSense publisher configuration
- ads.txt
- consent/cookie settings
- event tracking
- UTMs
- revenue attribution

### Domain and SEO
- domain remains on same Wix site
- current sitemap exported
- route-preservation matrix complete
- page titles aligned
- URL slugs aligned
- internal links checked
- canonical tags checked
- redirects tested
- structured data checked
- robots/indexability checked
- Google News-critical article routes preserved

## Phase 11 — Migration rehearsal

Before publish:
1. freeze structural changes to the Studio branch;
2. refresh the live route/data inventory;
3. compare member/contact/plan/app counts;
4. compare route map;
5. compare metadata/canonical behavior;
6. test signup/login/account;
7. test paid-member access;
8. test billing/cancellation;
9. test newsletter consent;
10. test blog/article rendering;
11. test RSS/podcast/video embeds;
12. test store links;
13. test analytics events;
14. test desktop and mobile;
15. test accessibility;
16. test performance;
17. verify no production-only custom code is accidentally required by the new branch.

No publish if any critical row is unknown.

## Phase 12 — Cutover checklist

Publishing requires explicit Brenden approval.

Immediately before publish:
- record live counts and screenshots;
- confirm all required apps installed;
- confirm members/contacts/plans accessible;
- confirm route/SEO matrix;
- confirm domain;
- confirm analytics;
- confirm ads;
- confirm payments;
- confirm automations;
- confirm mobile;
- confirm noindex is NOT accidentally present;
- confirm no legacy staging URLs are canonical.

After publish:
- verify homepage;
- verify 10 highest-value article URLs;
- verify member login;
- verify paid plan access;
- verify checkout/account;
- verify email signup;
- verify analytics;
- verify sitemap/robots;
- verify 404s/redirects;
- verify mobile 390/430;
- verify no layout shift or old-shell flashing.

## Definition of done

The Studio project is not done when it looks impressive.

It is done when:
- the site map is coherent;
- page families are consistent;
- current URLs and data are accounted for;
- members and revenue systems are preserved;
- mobile and accessibility pass;
- motion is restrained and useful;
- multimedia is wired;
- migration rehearsal passes;
- another operator can understand the system from the repo;
- Brenden can review the Studio version before any cutover.
