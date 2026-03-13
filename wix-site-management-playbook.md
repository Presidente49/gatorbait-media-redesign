# GatorBait Media — Wix Site Management Playbook

## Site Overview

**Primary Site:** GatorBaitMedia.com
**Platform:** Wix Business/eCommerce (Full Stack)
**Meta Site ID:** 18fb3a4e-d7f6-414a-aeb9-3047db3ea115
**Owner:** Brenden Martin (brenden@gatorbaitmedia.com)
**Purpose:** Subscription-based college sports fan site (Florida Gators focus)
**Sister Property:** Sidelines.live (virtual streaming studio / podcast network)

---

## Current Site Architecture

### Pages

| Page | Purpose | Status |
|------|---------|--------|
| Home | Landing page with loyalty points | Needs redesign |
| Loyalty Points Page | Sub-page of Home — rewards program | Active |
| Florida Gators News | Main blog/content feed (currently the default homepage view) | Active — needs modernization |
| About | Company info | Needs update |
| Groups List | Community groups | Active |
| The Buddy Martin Show | Podcast/show page | Active |
| Message Boards | Fan community discussion | Active |
| GatorBait Magazine | Digital magazine archive | Active |
| Gatorbait Magazine (sub) | Magazine content | Active |
| 2021 Gatorbait Magazine (sub) | Archive | Active |
| My Account | Member account management | Active |
| Forum Posts | Forum content | Active |

### Navigation Structure (Current)
- Florida Gators Headlines
- Gator Football
- Thoughts Of The Day - Franz Beard
- Gator Recruiting
- More (dropdown)

### Content Authors
- **Franz Beard** — Primary columnist (SEC Tournament, Gators analysis, recruiting)
- **Buddy Martin** — Show host, columnist (editorial, opinion, coaching coverage)
- **GatorBaitMagazineStaff** — Staff byline for news items
- **Dan Bond** — Contributor (gymnastics, other sports)

### Current Design Elements
- **Header:** GatorBait logo on gradient blue-to-orange banner with "GATOR BAIT MEDIA" text and www.gatorbaitmedia.com URL. "Welcome | Brenden Ma..." member badge in top right.
- **Content Layout:** 4-column blog card grid with article images, author avatars, titles, and preview text. Pagination at bottom (5 pages).
- **Footer:** Search bar, Facebook + YouTube social icons, "CONTACT US" with email, 2024 copyright.
- **Color Scheme:** Blue/orange (Gators colors) — but applied inconsistently.
- **Typography:** Mix of serif and sans-serif, not consistent across elements.

### Wix Features in Use
- Wix Blog (primary content management)
- Wix Member Areas (subscription/account management)
- Wix Forums (Message Boards, Forum Posts)
- Wix Groups
- Social icons (Facebook, YouTube)
- Search functionality

### Wix Features Available but Underutilized
- Wix SEO Wiz / SEO tools
- Wix Automations (email triggers, workflows)
- Wix Analytics
- Wix Stores (for merch potential)
- Wix Video (for podcast/stream embedding)
- Wix Chat (live engagement)
- Wix Bookings (potential for live events)
- Velo by Wix (custom code)

---

## Design Tokens (Target — ESPN+/Athletic Style)

### Colors
```
--primary-bg: #1a1a2e        /* Deep navy/dark background */
--secondary-bg: #16213e      /* Slightly lighter dark */
--accent-orange: #f47521     /* Gators orange — CTAs, highlights */
--accent-blue: #0021a5       /* Gators blue — links, secondary accent */
--text-primary: #ffffff       /* White text on dark bg */
--text-secondary: #a0a0b0    /* Muted text for metadata */
--text-body: #e0e0e8         /* Readable body text on dark */
--card-bg: #1e1e38           /* Card/article background */
--card-border: #2a2a4a       /* Subtle card borders */
--cta-gradient: linear-gradient(135deg, #f47521, #ff6b35)  /* Subscribe button */
--divider: #2a2a4a           /* Section dividers */
```

### Typography
```
--font-headline: 'Bebas Neue', Impact, sans-serif    /* Bold headlines */
--font-subhead: 'Montserrat', 'Helvetica Neue', sans-serif  /* Navigation, subheads */
--font-body: 'Georgia', 'Times New Roman', serif     /* Article body — like The Athletic */
--font-meta: 'Montserrat', sans-serif                /* Author, date, tags */

--size-hero: 48px
--size-h1: 36px
--size-h2: 28px
--size-h3: 22px
--size-body: 17px      /* Slightly larger for readability */
--size-meta: 13px
--size-nav: 14px
```

### Spacing
```
--section-gap: 48px
--card-gap: 24px
--content-max-width: 1200px
--sidebar-width: 320px
--header-height: 64px
--mobile-padding: 16px
```

---

## Redesign Plan — ESPN+/Athletic Competitive Refresh

### Phase 1: Header & Navigation (Priority: CRITICAL)

**Current Problem:** Busy gradient banner with logo, URL text, and member badge feels like a 2015 sports blog. Doesn't communicate "premium subscription."

**Target State:**
- Clean dark header bar (#1a1a2e) with GatorBait logo (simplified) left-aligned
- Horizontal nav links: Home | Football | Basketball | Recruiting | Podcasts | Magazine | More
- Right side: Search icon, Member icon/login, bright orange "SUBSCRIBE" button
- Sticky on scroll (follows user down the page)
- Mobile: Hamburger menu with same nav structure

### Phase 2: Hero Section (Priority: HIGH)

**Current Problem:** No hero section. Page jumps straight from header to blog grid.

**Target State:**
- Full-width featured article with large hero image, headline overlay, author/date, and "READ MORE" CTA
- Below hero: 2-3 secondary featured articles in a horizontal strip
- This mimics ESPN+ and The Athletic's approach of leading with the biggest story

### Phase 3: Content Feed (Priority: HIGH)

**Current Problem:** Uniform 4-column grid of blog cards. Every article looks the same importance. No visual hierarchy.

**Target State:**
- Main column (70%): Article list with large featured images, clear headlines, author bylines, read time, and category tags
- Sidebar (30%): "Most Popular" list, upcoming podcast episodes, subscribe CTA, social follow buttons
- Category tabs above the feed: All | Football | Basketball | Recruiting | Baseball | Gymnastics
- Infinite scroll or "Load More" instead of pagination

### Phase 4: Podcast/Streaming Integration (Priority: HIGH)

**Current Problem:** "The Buddy Martin Show" is a separate page. No podcast presence on the homepage. Sidelines.live is not referenced.

**Target State:**
- Dedicated "Listen Now" section on homepage with latest podcast episodes
- Embedded audio player or link to podcast platforms
- "Powered by Sidelines.live" branding with link
- Cross-promotion between podcast and article content

### Phase 5: Subscription CTA & Conversion (Priority: CRITICAL)

**Current Problem:** No visible subscribe/pay wall messaging. The "Welcome" badge doesn't sell anything.

**Target State:**
- Sticky banner at top or bottom: "Get unlimited access to GatorBait insider coverage. Subscribe now." with orange CTA button
- Mid-page subscription callout between article sections
- Pricing page link in navigation
- Free preview articles (first 2-3 paragraphs) with "Subscribe to continue reading" gate

### Phase 6: Footer (Priority: MEDIUM)

**Current Problem:** Minimal footer with just search, 2 social icons, and contact email.

**Target State:**
- 4-column footer: About | Quick Links | Podcasts | Connect
- Full social links: Twitter/X, Facebook, YouTube, Instagram, Apple Podcasts, Spotify
- Newsletter signup form
- Copyright updated to 2026
- Links to Sidelines.live, Terms, Privacy Policy

---

## SEO Configuration

### Immediate Fixes
- [ ] Update all page meta titles to format: "[Topic] | GatorBait Media — Florida Gators Insider Coverage"
- [ ] Write unique meta descriptions for every page (150-160 characters)
- [ ] Clean up URL slugs (remove dates, use keyword-rich slugs)
- [ ] Add alt text to all images
- [ ] Set up Google Search Console and verify
- [ ] Connect Google Analytics 4
- [ ] Submit XML sitemap
- [ ] Add structured data (NewsArticle schema for blog posts)
- [ ] Set up Open Graph tags for social sharing

### Content SEO Strategy
- [ ] Keyword research for: Florida Gators football, basketball, recruiting, transfer portal
- [ ] Create "pillar" pages for each sport (evergreen, regularly updated)
- [ ] Internal linking strategy between articles
- [ ] Publish cadence: minimum 1 article/day during football/basketball season

---

## Automation Workflows

### Email Automations to Set Up
- [ ] Welcome email sequence (new subscriber → Day 0, Day 3, Day 7)
- [ ] Failed payment notification → retry reminder → account suspension warning
- [ ] Cancellation save flow → "We miss you" email with special offer
- [ ] Weekly newsletter digest of top content
- [ ] Breaking news email blast capability

### Site Automations
- [ ] Auto-share new blog posts to social media
- [ ] Member login tracking for engagement scoring
- [ ] Content recommendation engine based on reading history

---

## Pending Tasks (Priority Order)

### Critical (This Week)
1. Redesign header and navigation (dark theme, sticky, subscribe CTA)
2. Add hero section to homepage
3. Update copyright to 2026
4. Fix content layout — add visual hierarchy to blog feed
5. Add prominent subscription CTA

### Important (Next 2 Weeks)
6. Add podcast integration to homepage
7. Redesign footer with full content
8. SEO audit and meta tag updates for all pages
9. Set up email automation (welcome sequence)
10. Connect Google Analytics 4 and Search Console

### Growth (This Month)
11. Add Sidelines.live cross-promotion
12. Create category landing pages for each sport
13. Launch merchandise store (Wix Stores)
14. Set up newsletter with lead magnet
15. Social media integration and auto-posting

---

## Competitor Reference

| Site | What They Do Well | Learn From |
|------|-------------------|------------|
| ESPN+ | Dark UI, live scores ticker, video integration, clean nav | Premium feel, content hierarchy |
| The Athletic | Typography, long-form readability, subscriber-only badging | Subscription UX, clean design |
| On3 | Recruiting databases, NIL coverage, team-specific portals | Niche depth, data integration |
| 247Sports | Community forums + premium content blend | Fan engagement model |
| Rivals | Team-specific microsites, insider access tiers | Tiered content strategy |

---

*Last Updated: March 13, 2026*
*Maintained by: Claude (GatorBait Growth Engine Skill)*
