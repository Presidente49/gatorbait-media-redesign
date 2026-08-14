# GatorBait Media Studio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize GatorBaitMedia.com from its legacy Wix Editor architecture into a verified Wix Studio implementation while preserving the live business, content, URLs, CRM, members, subscribers, SEO authority, and domain continuity.

**Architecture:** Keep the current Classic Wix site live while all work happens in two isolated safety layers: GitHub branch `studio-rebuild-2026` for migration documentation/code and a Wix Studio migration branch/version for visual/site work. Audit and normalize infrastructure before rebuilding UI; preserve Wix Blog and Wix CRM as authoritative business systems unless a verified blocker requires replacement. Production cutover is a final, reversible business operation performed only after evidence-based QA passes.

**Tech Stack:** Wix Studio/Wix APIs, Wix Blog, Wix CRM, Wix Forms, Wix Automations, Wix Members, Wix Pricing Plans, Velo where required, GitHub, Figma, Adobe/image tools, public DNS/HTTP verification, Google SEO/Search infrastructure.

## Global Constraints

- Current production site: `https://www.gatorbaitmedia.com/`
- Wix site ID: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`
- GitHub repo: `Presidente49/gatorbait-media-redesign`
- Production site remains live until Studio cutover is explicitly approved.
- Do not alter production DNS during discovery/inventory.
- Do not mass-delete contacts, plans, pages, redirects, apps, or automations before inventory and rollback documentation exist.
- Do not change marketing consent states to inflate audience size.
- Keep Wix Blog unless a verified technical blocker requires otherwise.
- Most editorial content remains free during the rebuild; newsletter acquisition is the primary conversion layer.
- Approved design direction: The Athletic-style editorial restraint + Sports Illustrated-style original photography; Florida orange/blue as controlled accents; no sitewide ESPN-style broadcast chrome.
- The Buddy Martin Show may use a stronger contained broadcast treatment while remaining part of the GatorBait publication system.
- Preserve canonical URLs wherever possible; redirects must be mapped when URLs change.
- Original GatorBait photography outranks generated imagery for editorial use.
- No credentials, API keys, DNS secrets, subscriber exports, or passwords may be committed to GitHub.

---

### Task 1: Establish Isolated Migration State

**Files:**
- Create: `docs/superpowers/plans/2026-08-14-gatorbait-studio-rebuild.md`
- Create: `docs/migration/current-state-inventory.md`
- Create: `docs/migration/rollback-register.md`

**Interfaces:**
- Consumes: current production Wix site and GitHub `main`
- Produces: isolated GitHub branch, verified Wix branch ID/editor type, rollback register used by every later task

- [ ] **Step 1: Verify GitHub migration branch exists**

Check that `studio-rebuild-2026` exists and points to the current `main` baseline before migration writes.

- [ ] **Step 2: Query Wix branches**

Read the site's default/original branch and all user branches. Record branch ID, revision, editor type, default state, and source branch.

- [ ] **Step 3: Verify or create Studio migration branch**

If a Studio/StudioTwo branch already exists for this migration, reuse it. Otherwise create a USER branch sourced from the Classic original branch using the supported cross-editor value `STUDIO_TWO`. Do not set it as default and do not publish it.

- [ ] **Step 4: Re-query Wix and verify**

Success requires Wix to return the new branch with `type=USER`, source pointing to the original branch, and editor type indicating Studio/StudioTwo. An API mutation response alone is not sufficient.

- [ ] **Step 5: Record rollback baseline**

Record current original branch ID/revision, production URL, default branch state, and live editor type in `docs/migration/rollback-register.md`.

### Task 2: Build Read-Only Current-State Inventory

**Files:**
- Create: `docs/migration/current-state-inventory.md`
- Create: `docs/migration/app-inventory.md`
- Create: `docs/migration/url-inventory.md`
- Create: `docs/migration/legacy-code-inventory.md`

**Interfaces:**
- Consumes: Wix site context, GitHub repository, live site responses
- Produces: authoritative inventory for cleanup and migration decisions

- [ ] **Step 1: Inventory Wix apps and platform generations**

Record installed Blog, Forms generations, Members, Pricing Plans, Stores, Events, eCommerce, SEO, and Velo status. Flag duplicate/legacy app generations rather than deleting them.

- [ ] **Step 2: Inventory static pages and canonical URLs**

List current static pages, canonical URLs, indexability/noindex state, and obvious duplicate-home or dead-route candidates. Preserve item IDs for later SEO work.

- [ ] **Step 3: Inventory custom embeds and Velo behavior**

List active custom embeds and inspect `masterPage.js`, `custom-css-LIVE.css`, and related code. Classify each item as RETIRE, REPLACE WITH STUDIO NATIVE, MIGRATE, or INVESTIGATE.

- [ ] **Step 4: Inventory automations**

Record every active blog-post email, push, signup, labeling, member, and subscription automation. Identify duplicate triggers and old mailing-list references.

- [ ] **Step 5: Inventory CRM segments and consent logic**

Verify current counts/definitions for Active Email Audience, Paid Subscribers, Re-Opt-In Candidates, Do Not Market, and relevant legacy labels. No consent mutation in this task.

- [ ] **Step 6: Inventory pricing plans and member dependencies**

Separate current/paid/renewing plan logic from legacy ACTIVE-but-unpaid records. Record which pages, automations, or entitlements depend on Pricing Plans.

### Task 3: DNS, Domain, Email Authentication, and HTTPS Audit

**Files:**
- Create: `docs/migration/dns-inventory.md`
- Create: `docs/migration/dns-rollback-table.md`
- Create: `docs/migration/email-deliverability-baseline.md`

**Interfaces:**
- Consumes: public DNS, Wix domain configuration, email sender configuration
- Produces: safe repair plan with no DNS mutations yet

- [ ] **Step 1: Capture public DNS**

Record registrar/nameserver evidence where observable plus A, AAAA, CNAME, TXT, MX, SPF, DKIM, DMARC and verification records for apex and `www`.

- [ ] **Step 2: Capture Wix expected domain state**

Compare public DNS with Wix's connected-domain expectations and SSL state.

- [ ] **Step 3: Test hostname and redirect behavior**

Verify HTTP/HTTPS, apex/`www`, canonical hostname, redirect chain, certificate validity, and final response status.

- [ ] **Step 4: Audit sender authentication**

Verify sending identity, domain authentication state, SPF/DKIM/DMARC alignment, and any Wix sender-domain precondition errors.

- [ ] **Step 5: Build rollback table**

For every DNS record later proposed for change, record current value, purpose, proposed value, validation method, and exact rollback value before any mutation is allowed.

### Task 4: SEO, Sitemap, Analytics, and AI Discovery Baseline

**Files:**
- Create: `docs/migration/seo-baseline.md`
- Create: `docs/migration/analytics-inventory.md`
- Create: `docs/migration/sitemap-decision.md`

**Interfaces:**
- Consumes: Wix SEO APIs, robots.txt, llms.txt, GitHub sitemap files, live HTML
- Produces: one authoritative indexing/analytics architecture

- [ ] **Step 1: Capture site-level SEO controls**

Record verification tags, robots directives, sitemap declarations, canonical-host behavior, and site-level metadata.

- [ ] **Step 2: Verify llms.txt and Site MCP state**

Read current live AI-facing configuration and confirm GatorBait/Buddy/Franz entity guidance remains accurate.

- [ ] **Step 3: Compare Wix sitemap output with GitHub sitemap files**

Determine whether `sitemap-index.xml`, `news-sitemap.xml`, and `posts-sitemap.xml` are production-serving, supplemental, duplicated, or archival. Do not deploy competing sitemap systems.

- [ ] **Step 4: Audit analytics**

Verify whether historic `UA-152070748-1` and `G-9LPC2VVC0V` are currently active and identify duplicate pageview injection paths.

- [ ] **Step 5: Record current Buddy Martin Show page SEO and homepage SEO**

Preserve current canonical URLs and item IDs before Studio work.

### Task 5: Studio Design System and Global Frame

**Files:**
- Create: `docs/superpowers/specs/2026-08-14-gatorbait-studio-global-frame-design.md`
- Create: `docs/migration/design-tokens.md`

**Interfaces:**
- Consumes: approved Aug. 5 editorial spec, original GatorBait photography, current information architecture
- Produces: responsive Studio-ready header/footer/newsletter component system

- [ ] **Step 1: Establish design tokens**

Define restrained publication colors, typography, spacing, breakpoints, focus states, card treatments, and photography rules consistent with the approved editorial direction.

- [ ] **Step 2: Design responsive header/navigation**

Primary navigation must make Home, Football, Recruiting, other sports, Franz Beard content where appropriate, The Buddy Martin Show, Magazine, Search, Account, and newsletter/subscription action easy to reach.

- [ ] **Step 3: Design footer/newsletter conversion system**

Create a single newsletter acquisition component connected to the modern Wix form/CRM path. Footer includes About, useful links, Buddy Martin Show, social links, contact, newsletter, policies, and current copyright.

- [ ] **Step 4: Implement only on Studio branch**

No Classic production visual replacement in this task.

- [ ] **Step 5: Verify desktop/tablet/mobile**

Check 1440, 1280, 1024, 768, 430, and 390 widths for menu behavior, focus states, tap targets, and layout stability.

### Task 6: Modern Editorial Homepage

**Files:**
- Create: `docs/superpowers/specs/2026-08-14-gatorbait-homepage-design.md`

**Interfaces:**
- Consumes: Wix Blog content, global frame, Buddy Martin Show module, newsletter component
- Produces: real editorial front page with content hierarchy

- [ ] **Step 1: Implement homepage hierarchy**

Order: Header -> Lead Story -> Top News -> Buddy Martin Show -> Latest Stories -> Football -> Recruiting -> Other Sports -> Newsletter -> Magazine/Archive -> Footer.

- [ ] **Step 2: Bind modules to real Wix content**

Avoid static duplicate article data when Wix Blog can supply it.

- [ ] **Step 3: Preserve crawlable editorial text**

Critical headlines, decks, links, and section labels must remain indexable and semantic.

- [ ] **Step 4: Verify responsive visual hierarchy**

Mobile must retain editorial priority without becoming a long undifferentiated card stack.

### Task 7: Canonical Buddy Martin Show Hub

**Files:**
- Create: `docs/superpowers/specs/2026-08-14-buddy-martin-show-studio-design.md`

**Interfaces:**
- Consumes: canonical `/the-buddy-martin-show` URL, official YouTube channel/playlist, prior Sidelines.live live-state patterns
- Produces: live/offline show hub and homepage module

- [ ] **Step 1: Preserve canonical show URL**

Do not create a competing show URL.

- [ ] **Step 2: Implement live/offline video state**

Use official YouTube/live behavior with graceful offline fallback to latest Buddy Martin Show episodes.

- [ ] **Step 3: Implement episode rail/archive**

Use the Buddy Martin Show playlist, not unrelated channel uploads.

- [ ] **Step 4: Add SEO-readable show identity**

Include Buddy Martin, GatorBait Media, Florida Gators football, SEC coverage, interviews, schedule, and subscribe CTA in crawlable text.

- [ ] **Step 5: Verify homepage and show-page behavior**

Test live, offline, mobile, player failure, and external YouTube CTA paths.

### Task 8: Wix Blog Editorial Template

**Files:**
- Use approved spec: `docs/superpowers/specs/2026-08-05-gatorbait-editorial-template-design.md`
- Create: `docs/migration/article-template-qa.md`

**Interfaces:**
- Consumes: Wix Blog rich content and existing article URLs
- Produces: reusable premium editorial article presentation

- [ ] **Step 1: Implement base article anatomy**

Category, headline, deck, byline, dates, hero image, caption/credit, readable body, optional related coverage/video/newsletter/subscription modules.

- [ ] **Step 2: Preserve URL and metadata**

No template rollout may change canonical slugs unless separately mapped.

- [ ] **Step 3: Verify original photography treatment**

No invented photographer credits; accurate alt text and captions required.

- [ ] **Step 4: Verify Blog functionality**

Comments, author links, categories, social sharing, member state, and embedded media must remain functional.

### Task 9: CRM, Newsletter, and Deliverability Repair

**Files:**
- Create: `docs/migration/crm-email-architecture.md`
- Create: `docs/migration/email-reputation-recovery.md`

**Interfaces:**
- Consumes: existing CRM segments, modern Wix signup form, email automations
- Produces: one durable acquisition/send architecture

- [ ] **Step 1: Verify current four-way audience segmentation**

Active Email Audience, Paid Subscribers, Re-Opt-In Candidates, Do Not Market.

- [ ] **Step 2: Verify new-signup labeling automation**

Every qualified submission to the modern GatorBait signup form must automatically join the Active Email Audience.

- [ ] **Step 3: Verify one blog email path and one push path**

Remove or disable only verified duplicate email behavior after rollback details are recorded.

- [ ] **Step 4: Add signup surfaces in Studio**

Homepage, footer, article modules, and Buddy Martin Show page all feed the same form/CRM path.

- [ ] **Step 5: Repair domain authentication where supported**

Use verified Wix/domain instructions. Never force subscription consent or increase send volume to mask a reputation problem.

### Task 10: Legacy Cleanup

**Files:**
- Create: `docs/migration/legacy-retirement-register.md`

**Interfaces:**
- Consumes: inventories from Tasks 2-4 and verified Studio replacements
- Produces: smaller, documented production architecture

- [ ] **Step 1: Retire only replaced legacy visual code**

Disable/remove old global CSS, obsolete page injectors, and brittle Velo only after equivalent Studio behavior is verified.

- [ ] **Step 2: Consolidate old forms and labels**

Do not delete historic submissions or consent evidence. Remove only obsolete acquisition paths after the modern path is live.

- [ ] **Step 3: Clean stale pages/routes**

Dead pages receive intentional redirects or removal decisions based on SEO/business value.

- [ ] **Step 4: Remove duplicate tracking/schema systems**

Keep one authoritative implementation for each analytics/schema responsibility.

### Task 11: Full Regression QA and Go/No-Go Package

**Files:**
- Create: `docs/migration/qa-report.md`
- Create: `docs/migration/redirect-map.md`
- Create: `docs/migration/go-no-go-report.md`

**Interfaces:**
- Consumes: complete Studio branch and all inventories
- Produces: evidence-based cutover decision

- [ ] **Step 1: Run functional QA**

Test Blog, members, account access, forms, newsletter automation, subscription state, Buddy player, navigation, search, social sharing, and key outbound links.

- [ ] **Step 2: Run responsive/accessibility QA**

Test required widths, keyboard behavior, focus states, contrast, labels, alt text, tap targets, and layout shift.

- [ ] **Step 3: Run SEO/HTTP QA**

Verify canonicals, titles, descriptions, Open Graph, NewsArticle/Organization/Person schema, robots, sitemap, llms.txt, HTTPS, and redirect behavior.

- [ ] **Step 4: Validate rollback plan**

Every production-facing change must have a documented rollback action/value.

- [ ] **Step 5: Produce explicit go/no-go report**

Do not publish because the site merely looks complete. Every cutover gate in the Boss Agent charter must have evidence.

### Task 12: Production Cutover

**Files:**
- Update: `docs/migration/go-no-go-report.md`
- Update: `docs/migration/rollback-register.md`

**Interfaces:**
- Consumes: approved go/no-go report
- Produces: production Wix Studio site with monitored rollback path

- [ ] **Step 1: Snapshot pre-cutover state**

Capture live branch, DNS, redirects, SEO state, analytics state, and critical business workflows immediately before cutover.

- [ ] **Step 2: Publish/switch only after all gates pass**

No unrelated DNS changes in the same operation unless technically required and already validated.

- [ ] **Step 3: Verify production immediately**

Re-run critical HTTP, Blog, member, form, email, video, mobile, analytics, and SEO smoke tests against the public domain.

- [ ] **Step 4: Roll back on critical regression**

Use the recorded rollback register rather than improvising production repairs.

- [ ] **Step 5: Merge migration records after stability verification**

Merge only reviewed, non-secret documentation/code from `studio-rebuild-2026` after successful production verification.

## Self-Review

- Spec coverage: all Boss Agent phases 0-12 map to Tasks 1-12.
- Production safety: no early publish or DNS mutation exists in Tasks 1-11.
- Consent safety: no task changes unknown/unsubscribed contacts into marketing subscribers.
- Design conflict: the Aug. 5 editorial direction explicitly controls visual work; the older ESPN+/Athletic dark theme is treated as legacy evidence only.
- Source separation: Sidelines.live patterns may be reused technically, but its brand architecture is not merged into GatorBait.
- Rollback: domain, branch, redirects, and legacy-code retirement require recorded rollback state before production mutation.
