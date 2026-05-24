# The Divorce Club: Recommended Open Source Tech Stack

## GitHub Gems Found

Based on research, here's the battle-tested open source stack for The Divorce Club infrastructure:

| Component | Tool | GitHub Stars | Purpose |
|-----------|------|-------------|---------|
| **Community Platform** | [Discourse](https://github.com/discourse/discourse) | 43k+ | Full-featured forum/community with categories, groups, events plugin |
| **Community Alt** | [Forem](https://github.com/forem/forem) | 22k+ | DEV.to-style community platform, great for content + discussion |
| **Website/Landing** | [Astro](https://github.com/withastro/astro) | 48k+ | Fast static site builder, perfect for landing pages + blog |
| **Email/Newsletter** | [Listmonk](https://github.com/knadh/listmonk) | 15k+ | Self-hosted newsletter & mailing list manager |
| **Event Management** | [Hi.Events](https://github.com/HiEventsDev/hi.events) | 2k+ | Open source event ticketing — built for nightlife, concerts, clubs |
| **Podcast** | [Castopod](https://github.com/ad-aures/castopod) | 700+ | Self-hosted podcast hosting with built-in social features |
| **CRM/Automation** | GoHighLevel (SaaS) | N/A | Already in use — handles pipeline, automations, SMS |

## Recommended Architecture

### Option A: Full Self-Hosted (Maximum Control)
- **Website:** Astro dark theme deployed on GitHub Pages or Vercel
- **Community:** Discourse or Forem (self-hosted on a VPS)
- **Email:** Listmonk for newsletter capture and automation
- **Events:** Hi.Events for ticketing and RSVPs
- **Podcast:** Castopod for hosting episodes
- **CRM:** GoHighLevel for pipeline and SMS automations

### Option B: Hybrid (Fast Launch — RECOMMENDED)
- **Website:** Astro static site on GitHub Pages (free, fast, dark nightclub theme)
- **Community:** GoHighLevel Communities (already paying for it)
- **Email:** GoHighLevel email automation (already built in)
- **Events:** Hi.Events OR GoHighLevel calendar/booking
- **Podcast:** Anchor/Spotify for Podcasters (free, instant distribution)
- **CRM:** GoHighLevel pipeline (per the playbook)

### Option C: Wix (Already Building)
- The Wix site build is already in progress via MCP
- Can serve as the primary website with built-in email capture, events, and blog
- Less control but zero deployment hassle

## Deployment Plan (Option B — Recommended)

1. Build Astro landing site with dark theme → deploy to GitHub Pages
2. Configure GoHighLevel per the playbook (funnels, automations, community)
3. Set up podcast on Spotify for Podcasters
4. Use Hi.Events for ticketing if GHL calendar isn't sufficient
5. Connect Listmonk for advanced email segmentation (realtor vs. general audience)
