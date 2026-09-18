# GatorBait Broadcast Page Standard

Updated: 2026-09-17

## Purpose

Use one mobile-first editorial broadcast pattern for The Buddy Martin Show, Florida Gator Lowdown, SEC Sidelines, and future GatorBait TV destinations. This is a design and operating standard for the existing Wix site, not a new frontend framework.

## Architecture decision

Keep Wix as production and update the existing route owner in place. Do not install a podcast theme, headless stack, carousel package, font library, or video-player framework for this redesign.

The existing `GBM - TV + News Images` custom embed already owns `/the-buddy-martin-show`. Modernize that owner rather than adding another competing embed.

External repository review supports the same conclusion:

- BBC Simorgh and the Wagtail news template remain useful for accessibility, content hierarchy, and resilient section pages.
- Podcast website templates found in GitHub searches are useful visual references but do not justify replacing native Wix behavior.
- Podlove Web Player is an established interaction reference for episode playback, but its main repository is archived and is not an adoption candidate.
- The GatorBait repo already contains the stronger pieces we need: newsroom cards, mobile shell rules, route cleanup, article design, footer/header behavior, and controller-driven show assets.

Borrow patterns, not stacks.

## Product goal

A show page should answer four questions immediately:

1. What is this show?
2. Is it live, and when is it normally on?
3. What can I watch right now?
4. Where do I go next inside GatorBait?

The page should feel like a sports-media destination, not a generic YouTube playlist or a dark control-room dashboard.

## Approved visual direction

- Light editorial canvas: warm paper / white cards.
- GatorBait navy for structural blocks and type.
- Florida orange for live state, schedule, and primary actions.
- Georgia / system serif for major editorial headlines; native system sans for utility copy.
- One large 16:9 player above the fold.
- Strong headline hierarchy and short copy; no giant empty hero.
- Landscape media only in content modules.
- No autoplay.
- No floating video that obscures reading.
- No new external font, icon, or animation dependencies.

## Page anatomy

### 1. Show masthead

Eyebrow: `GATORBAIT TV`

Primary title: show name.

One-sentence promise: what viewers get and why this show is distinct.

Schedule chip: e.g. `WEEKNIGHTS · 9 PM ET`.

Primary actions:

- Watch live / latest
- Latest episodes
- Join GatorBait

Keep the action count to three or fewer.

### 2. Live / latest player

Use one 16:9 YouTube player. The Buddy Martin Show route uses the channel live-stream embed so it becomes the live destination automatically when the channel is broadcasting.

The companion text must explain what happens between broadcasts instead of leaving an apparently broken or empty player.

### 3. Quick navigation

Short in-page anchors only:

- Watch
- Episodes
- Clips
- About

Do not create a second site navigation.

### 4. Episode rail

Use a responsive grid, not a JavaScript carousel.

- Primary: latest episodes / uploads playlist.
- Secondary: clips / Shorts playlist.
- 16:9 media ratio.
- Descriptive headings and one sentence of context.

### 5. GatorBait continuation

Every show page should move people deeper into owned media:

- Latest GatorBait stories
- Magazine
- Membership

The website remains the canonical public destination; YouTube and Facebook are distribution platforms.

### 6. Host / show identity

A compact closing section should establish why the host matters. For Buddy, emphasize long-running Florida/SEC journalism, the show’s access to people with history inside the program, and the connection between the live show and GatorBait reporting.

Do not turn this into a long biography.

## Mobile standard

Primary daily viewport: 390 px.

Required checks:

- No horizontal overflow.
- Show title wraps cleanly.
- Live player remains 16:9.
- Schedule and actions fit without shrinking below readable size.
- Buttons / controls are at least 44 px high where practical.
- Episode cards become one column.
- In-page navigation may scroll horizontally, but the page itself must not.
- Footer meets content with no retained Wix transition-wrapper gap.
- Embedded players do not cause layout shift outside their fixed aspect-ratio box.

Secondary checks after meaningful changes: 430 px and 320 px.

## Desktop standard

Baseline: 1365–1440 px.

- Content max-width roughly 1180–1240 px.
- Hero copy and schedule should not compete with the player.
- Keep the player visually dominant.
- Two-column episode grid is sufficient; avoid dense dashboard layouts.

## Sitewide continuation

The broadcast page is the source pattern for GatorBait TV modules elsewhere on the site. Reuse the typography, schedule chip, card treatment, and CTA language on the homepage, articles, and Magazine.

Do not add a sitewide autoplay or fixed floating player by default. If a persistent TV utility is later tested, it should be a small non-autoplay link/rail, respect cookie and safe-area UI, be dismissible, and never cover article text or forms.

## Content rules

- Live time must be verified before promotion.
- Guest names must be verified before display.
- Clips are normal editorial/distribution assets, not subscriber win-back material.
- Latest episode and clip destinations should come from the canonical show/channel source rather than manual duplicate uploads when possible.
- A completed show may create one recap article plus worthwhile clips; the show page remains the evergreen viewing destination.

## Implementation rules

- One live custom-embed owner for the route.
- Update the existing owner in place.
- `loadOnce: false` remains required because Wix uses client-side navigation.
- Route cleanup must remove the custom page when navigating away.
- No permanent short polling. Prefer route events / bounded reconciliation. If a compatibility timer is retained, keep it bounded and document why.
- Preserve article SEO/image behavior currently bundled in the same live embed until it is safely separated into its own owner.
- Verify the public URL after mutation.

## Rollout order

1. The Buddy Martin Show becomes the reference implementation.
2. Verify desktop plus 390 / 430 mobile behavior.
3. Reuse the pattern for other GatorBait TV show pages.
4. Add small GatorBait TV continuation modules to other site surfaces only after the reference page is stable.

## Success criteria

The redesign is successful when a mobile visitor can understand the show, know the next live time, start watching, find recent episodes/clips, and continue into GatorBait content without horizontal overflow, duplicate navigation, autoplay, or a competing frontend system.


## Live-state normalization

"LIVE NOW" is temporary distribution language, not the permanent identity of an episode or show page.

After a broadcast ends:

- normalize article/show titles to the recurring show name plus date or durable topic;
- replace live CTA language with watch/replay language;
- keep the canonical URL unless changing it has a clear editorial/SEO benefit;
- preserve Front Page visibility when the episode remains current or is performing strongly;
- do not let a stale LIVE NOW label determine homepage lead selection.

Best Friday in Football is a recurring Friday show and follows this rule.

## Continuous benchmark

Before a material broadcast-page redesign, compare the current page against the live competitor set and docs/CONTINUOUS-DESIGN-BENCHMARK.md. Borrow useful hierarchy and media-discovery patterns without turning GatorBait TV into a generic streaming dashboard.
