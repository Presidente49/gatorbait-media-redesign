# Competitive Optimization Delta — 2026-09-20

Purpose: optimize from the restored stable newsroom baseline without reintroducing loader complexity.

## Production baseline

Production loader has been restored to the verified 04:18 ET newsroom snapshot:
- snapshot: 4a2bfa8749a763364e1224a27a286d85ea4a8c1b
- loader: GBM - Newsroom Loader v26 baseline restored
- later v10-v14 inline recovery/preload experiments removed
- production republished after restore

Do not modify the loader architecture for visual experiments. Future visual/product improvements belong in the native Studio wireframe.

## Competitor patterns verified 2026-09-20

### On3 / Gators Online
Useful:
- compact schedule/context module
- headline stream rather than oversized card wall
- message-board activity visible on the news product
- quick links to video/social/boards
- recruiting integrated into the same publication
- membership CTA tied to insider/community value

Do not copy:
- proprietary recruiting ratings/NIL data
- competitor branding/names
- aggressive paywall mechanics without a GatorBait business decision

### GatorCountry / SwampGas
Useful:
- clear board hierarchy
- board purpose text
- discussion/message counts
- latest thread/activity
- public vs insider areas
- sortable/paginated thread list
- rules/help surfaces

Do not copy:
- Swamp Gas naming
- exact board names
- visual branding

## GatorBait product delta

### Front Page
Keep:
- one dominant current lead
- chronological latest-news stream
- restrained magazine treatment
- GatorBait TV module

Add in Studio:
- compact score/schedule context
- quick destinations: TV, Magazine, Boards, YouTube
- current board activity once real backend exists
- recruiting snapshot sourced from real GatorBait reporting
- stronger save/watchlist/join utility

Avoid:
- old Today’s Edition architecture
- stale show promos
- category ribbon clutter
- giant repeated cards
- first-paint overlays/loaders

### Article
- clean Athletic-like reading column
- save/follow/share
- photographer credit
- related coverage based on taxonomy
- stable Discuss This Story bridge
- video/audio companion only when relevant
- membership/newsletter CTA after value, not before it

### TV
- current/live hero
- latest episodes
- named show rails
- watchlist/continue watching
- Watch/Listen destinations
- no autoplay audio

### Magazine
- interactive cover
- issue hierarchy
- recurring departments
- photography-led features
- gallery/audio/video companions
- richer motion than News, but reduced-motion safe

### Community
- Football
- Recruiting
- Basketball
- Other Gator Sports
- General/Pub
- Insider/Premium only if real entitlement supports it
- stable board URLs
- follow/watch thread
- latest activity
- story-to-board bridge

## Performance rule

No new production dependency unless it has a specific job and beats native Studio on:
- speed
- mobile
- accessibility
- maintainability

Native Studio first.
