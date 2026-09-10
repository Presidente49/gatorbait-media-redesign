# CLAUDE.md — GatorBait Media Redesign

## What This Project Is

GatorBait Media (gatorbaitmedia.com) is a subscription-based Florida Gators sports media site founded by Emmy-winning journalist Buddy Martin with 47 years of GatorBait Magazine history. This repo holds the custom CSS, JavaScript, and strategic documentation for a site-wide redesign to an ESPN+/Athletic dark theme.

**Owner:** Brenden Martin (brenden@gatorbaitmedia.com)
**Sister Property:** Sidelines.live (virtual streaming studio / podcast network)
**Platform:** Wix Business/eCommerce (Full Stack)
**Meta Site ID:** 18fb3a4e-d7f6-414a-aeb9-3047db3ea115

---

## Repository Structure

```
gatorbait-media-redesign/
├── CLAUDE.md                          # This file — AI assistant guide
├── README.md                          # Project overview and design tokens
├── REDESIGN-BLUEPRINT.md             # Full business plan and growth roadmap
├── IMPLEMENTATION-GUIDE.md           # Step-by-step Wix implementation instructions
├── wix-site-management-playbook.md   # Site architecture, SEO, automation plans
├── custom-css-LIVE.css               # CSS currently live on gatorbaitmedia.com (v6)
├── custom-css.css                    # Original CSS draft before deployment
├── masterPage.js                     # Wix Velo global code (copyright, subscribe glow)
└── backups/
    ├── README.md                     # Backup documentation
    └── backup_manifest.json          # Backup tracking
```

---

## Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Platform       | Wix Business/eCommerce         |
| Custom Code    | Wix Velo (masterPage.js)       |
| Styling        | Custom CSS injected via Wix Custom Code (Head) |
| CMS            | Wix Blog                       |
| Community      | Wix Forums + Wix Groups        |
| Members        | Wix Member Areas               |
| Streaming      | Restream.io → YouTube, Facebook, X, IG, TikTok |
| Podcast        | The Buddy Martin Show via Sidelines.live |

---

## Design System

### Colors
| Token            | Hex       | Usage                    |
|------------------|-----------|--------------------------|
| Primary BG       | `#1a1a2e` | Page/header background   |
| Secondary BG     | `#16213e` | Footer background        |
| Card BG          | `#1e1e38` | Blog post cards          |
| Card Border      | `#2a2a4a` | Subtle borders/dividers  |
| Gators Orange    | `#f47521` | CTAs, highlights, hover  |
| Gators Blue      | `#0021a5` | Links, secondary accent  |
| Text Primary     | `#ffffff` | Headlines, nav           |
| Text Body        | `#e0e0e8` | Article body text        |
| Text Muted       | `#a0a0b0` | Metadata, dates          |

### Typography
| Use        | Font                    | Size       |
|------------|-------------------------|------------|
| Headlines  | Bebas Neue / Impact     | 36-48px    |
| Navigation | Montserrat (uppercase)  | 14px       |
| Subheads   | Montserrat              | 22-28px    |
| Body       | Georgia                 | 17px       |
| Metadata   | Montserrat              | 13px       |

---

## Key Files

### `custom-css-LIVE.css`
The production CSS injected into every page via Wix Dashboard > Settings > Custom Code > Head. This is the ESPN+/Athletic dark theme (v6) with lightened palette, blog text fixes, and mobile responsiveness. **Any CSS changes should be made here first, then pasted into the Wix Custom Code panel.**

### `custom-css.css`
The original draft CSS. Kept for reference. The LIVE version is the source of truth.

### `masterPage.js`
Wix Velo code that runs on every page. Currently handles:
- Dynamic copyright year (`#copyrightText`)
- Subscribe button hover glow effect (`#subscribeBtn`)

Deployed by pasting into Wix Velo Dev Mode > masterPage.js.

---

## Development Workflow

1. **Edit locally** in this repo (CSS or JS changes)
2. **Test visually** — no local dev server; Wix is the runtime
3. **Deploy manually** — copy file contents into Wix:
   - CSS → Wix Dashboard > Settings > Custom Code > Head (wrapped in `<style>` tags)
   - JS → Wix Velo Dev Mode > masterPage.js
4. **Preview** in Wix Editor before publishing
5. **Publish** via Wix Editor
6. **Commit** changes back to this repo with clear messages

### Deployment Entry Point
- **Custom Code Name:** GatorBait Dark Theme v5 (Essential, All Pages)
- **Placement:** Head
- **Scope:** All Pages

---

## Content Team

| Author                 | Role                                       |
|------------------------|--------------------------------------------|
| Buddy Martin           | Show host, columnist, founder              |
| Franz Beard            | Primary columnist (SEC, recruiting, analysis) |
| Dan Bond               | Contributor (gymnastics, other sports)     |
| GatorBaitMagazineStaff | Staff byline for news items                |

---

## Business Context

### Revenue Model
- Subscription tiers (5 pricing plans with 7-day trials)
- Display ads (AdSense/Ezoic)
- Affiliate revenue (Fanatics merch 8-10%, StubHub tickets 9%)

### Content
- 4,250+ articles published
- 2,528 contacts in email list
- 24 blog categories
- Live show Mon-Thu 9PM ET
- Podcast with Urban Meyer and Terry Bradshaw

### Distribution Strategy (In Progress)
- Restream.io for multistreaming to YouTube, Facebook, X, Instagram, TikTok
- Show clips → YouTube Shorts, TikTok, IG Reels
- Submissions planned: Google News, Apple News, Flipboard, SmartNews, MSN
- Telegram channel for breaking news

---

## Current Roadmap Status

| Phase                  | Status      |
|------------------------|-------------|
| Foundation (SEO, plans, forums, mobile) | Done |
| Revenue (ads, analytics, affiliates)    | In Progress |
| Distribution (news platforms, Restream, social clips) | In Progress |
| Design Overhaul (Wix Editor pages)      | Planned |
| Content Strategy (daily publishing cadence) | Ongoing |
| Growth Hacks (referrals, giveaways, trackers) | Planned |
| Premium Data Products (NIL, recruiting boards) | Long-term |

---

## Conventions for AI Assistants

1. **Never modify production files without explicit confirmation** — `custom-css-LIVE.css` is live on the site
2. **Maintain the design token system** — all colors and fonts are documented; use them consistently
3. **CSS changes go to `custom-css-LIVE.css`** — the original `custom-css.css` is archived
4. **Keep commit messages descriptive** — this repo's history uses clear summaries (e.g., "Add custom styles for blog post page")
5. **Wix is the runtime** — there is no build step, no local preview server. Changes deploy by pasting into Wix
6. **Backup before major changes** — use the `backups/` directory
7. **Respect the brand** — Gators Orange (#f47521) and Gators Blue (#0021a5) are sacred. Dark theme aesthetic is ESPN+/Athletic inspired
8. **Social media and streaming context** — the team uses Restream.io for multistreaming and wants automated clip-to-social workflows
9. **The business goal is competing with On3, The Athletic, and 247Sports** — every change should move toward a premium, professional sports media experience
10. **Brenden runs this with his dad Buddy** — keep things practical, actionable, and avoid over-engineering

---

*Last Updated: March 18, 2026*
