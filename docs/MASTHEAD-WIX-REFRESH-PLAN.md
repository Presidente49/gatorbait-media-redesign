# GatorBait Masthead Wix Refresh — Implementation Plan

**Status:** implementation branch only — no production change yet  
**Branch:** `masthead-wix-refresh`  
**Production site:** Wix site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`  
**Design direction:** Masthead newsroom structure + restrained Fyrre polish + 10–15% GatorBait identity  
**Primary rule:** one presentation owner, one deterministic mount, no competing theme layers

## Objective

Modernize the GatorBait front page so it feels like a current sports newsroom without replacing Wix as the business engine.

Keep Wix responsible for:

- Wix Blog / story publishing
- member accounts and pricing plans
- store / ecommerce
- email marketing
- existing production URLs and article routes
- SEO metadata and existing site services
- AdSense / GA4 / consent handling

Use one controlled custom presentation layer only for the front-page newsroom experience.

## Visual target

### 85% newsroom discipline

- compact publication masthead
- strong lead story
- dense but readable headline hierarchy
- top-stories rail
- chronological Latest wire
- section bands for Football / Recruiting / Basketball / Baseball
- clean columnist modules
- GatorBait TV strip
- small Most Read module
- visible timestamps and bylines
- restrained desktop grid and clear mobile stacking

### 15% GatorBait identity

- traditional Florida orange and deep blue
- orange rules/dividers rather than decorative gradients
- white / warm paper backgrounds
- GatorBait masthead and heritage line
- Buddy Martin and Franz Beard editorial signatures
- strong game photography
- compact score / live-status treatment when relevant
- no black-heavy theme
- no glassmorphism
- no rounded-card wall
- no oversized mobile type

## Architecture

### Keep

- current Wix Blog data source
- native article pages
- members / pricing plans
- store
- email workflows
- utility/footer layer
- existing consent-aware analytics and monetization
- existing URLs

### Replace only after approval

The current Newsroom homepage presentation may eventually be replaced by the new Masthead-inspired version, but only after staged verification.

Do not stack the new design on top of the current Newsroom.

### New presentation layer

Build one bounded front-page bundle under the repo, with:

- one CSS owner
- one JS owner
- one data adapter
- one mobile shell
- one deterministic mount
- no permanent polling loop
- no broad late-running DOM cleanup
- no post-paint shell swaps
- no second footer/header owner

## Build sequence

### Phase 1 — Baseline and rollback

1. Record live custom-embed IDs and revisions before any mutation.
2. Preserve the current production Newsroom loader, prepaint shield, legacy cleanup, header, footer, and gap-guard revisions as rollback points.
3. Do not alter production during design work.
4. Treat `docs/HOMEPAGE-BASELINE-LOCK.md` as rollback authority until Brenden explicitly approves the replacement.

### Phase 2 — Build Masthead V2 in GitHub

Create a new isolated V2 implementation rather than editing live assets first.

Suggested structure:

```
newsroom-v2/
  index.html
  masthead.css
  masthead.js
  data-adapter.js
  README.md
```

The data adapter should normalize live Wix story data into:

- headline
- slug / article URL
- hero image
- author
- publish time
- category
- excerpt
- featured / lead state

No Wix business logic moves into the V2 layer.

### Phase 3 — Desktop front page

Build in this order:

1. compact GatorBait masthead
2. desktop section nav
3. lead-story block
4. Top Stories rail
5. Latest chronological wire
6. Franz Beard / Thoughts of the Day
7. Buddy Martin feature
8. GatorBait TV
9. section modules
10. Most Read
11. understated Join + Store links
12. existing utility footer handoff

### Phase 4 — Mobile-first pass

Target 390 px and 430 px explicitly.

Mobile rules:

- single compact masthead
- one Menu button
- no native Wix mobile header underneath
- lead headline restrained
- no horizontal scroll
- no sticky bottom nav
- no back-to-top arrow
- no oversized login block
- no layout movement after first paint
- fixed image aspect ratios
- Latest list readable without cards becoming tall
- tap targets at least ~44 px
- drawer owns navigation while open

### Phase 5 — GatorBait design layer

After the structure works, add only the restrained brand touches:

- orange rules
- deep blue display type
- small section labels
- editorial timestamps
- photographer credits
- columnist signatures
- subtle score/status bar
- slightly more premium spacing on major feature blocks

Do not add decoration that lowers story density or speed.

### Phase 6 — Functional integration check

Verify that the new front page does not interfere with:

- Wix Blog publishing
- article URLs
- article-page SEO
- member login/account routes
- pricing plans
- store links
- newsletter/email automation
- AdSense consent behavior
- GA4
- footer compliance links

### Phase 7 — Verification gate

Before any production switch, verify:

#### Desktop
- lead / rail alignment
- story chronology
- images and alt text
- all article links
- TV / Store / Join links
- no duplicate header/footer

#### Mobile — 390 px and 430 px
- no overflow
- no giant fonts
- no menu collision
- no login collision
- no jump / flash
- no late white gap
- no duplicate shell
- stable media dimensions

#### Runtime
- one mount
- no repeated observers
- no console errors from V2
- current story feed updates correctly
- newest stories remain newest first

## Rollout

1. Keep current Newsroom live while V2 is built.
2. Review V2 visually off-production first.
3. Run desktop + 390 + 430 verification.
4. Snapshot the current live embed revisions immediately before launch.
5. Make one production presentation switch — do not layer V2 beside V1.
6. Verify public homepage after publish.
7. If any flash, jump, missing stories, account regression, or duplicate shell appears, restore the locked Newsroom baseline immediately.

## Success criteria

The redesign is successful only if it:

- looks materially more modern than the current homepage
- shows more useful journalism above the fold
- feels unmistakably GatorBait without looking themed
- remains faster and more stable on mobile
- preserves Wix business functions
- requires fewer presentation layers than the current architecture
- can be rolled back in one controlled step

## Immediate work order

1. Build the isolated V2 skeleton.
2. Feed it current GatorBait story data.
3. Match Masthead hierarchy before adding brand styling.
4. Apply the 10–15% GatorBait visual layer.
5. Test mobile first.
6. Show Brenden the preview.
7. Only then prepare the production embed replacement.
