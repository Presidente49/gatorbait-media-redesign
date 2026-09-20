# GatorBait Studio Master Wireframe Brief

Status: DESIGN SYSTEM / WIREFRAME PHASE
Production impact: none

## Inputs reviewed before wireframing

### Repo references
- superdesigndev/superdesign-skill — design workflow and iterative system thinking
- wagtail/news-template — editorial hierarchy and reusable news page families
- bbc/simorgh — resilient editorial/article patterns and accessibility reference
- discourse/discourse — mature community architecture
- vidstack/player — accessible media-player candidate
- native Wix Studio first for layout, motion, galleries, repeaters and responsive behavior

### Live competitor patterns reviewed
- On3 / Gators Online:
  - lead news + chronological headlines
  - team schedule and quick links
  - recruiting modules
  - message-board continuation
  - subscription conversion integrated into content ecosystem
- GatorCountry / SwampGas:
  - grouped board hierarchy
  - latest-thread metadata
  - replies/views/activity density
  - premium/public board separation
  - clear forum statistics and community scale

Do not copy proprietary layouts or language.

## Global shell

### Header
Desktop:
- official GatorBait logo
- News
- Recruiting
- GatorBait TV
- Magazine
- SwampGas
- Shop
- Search icon
- Saved / Watchlist
- Join / Account

Mobile:
- compact official logo
- menu
- search
- account/watchlist
- no compressed duplicate Wix navigation

### Shared interaction model
- save story
- follow author/topic where supported
- add episode/video to watchlist
- subscribe/join
- share
- continue reading/watching

### Footer
- editorial destinations
- multimedia destinations
- community
- account/help
- newsletter
- social
- policies/contact
- copyright

## Front Page wireframe

1. Compact masthead/navigation
2. Current game/result strip
3. One dominant lead story
4. 2–4 secondary current stories
5. Latest News chronological rail
6. GatorBait TV current/live module
7. Recruiting snapshot
8. Magazine feature/cover
9. SwampGas trending discussions
10. Photo/social media strip
11. Newsletter/member CTA
12. Footer

Rules:
- newest qualifying journalism wins
- no category feeder clutter
- cards go directly to stories
- no stale modules
- no old Today’s Edition/Monday Chomp architecture

## Article wireframe

1. Breadcrumb/category
2. Headline
3. Deck
4. Byline/date
5. Save/follow/share
6. Hero image
7. Caption/photographer
8. Readable story column
9. Inline media where editorially relevant
10. Related coverage
11. Discuss this story -> relevant SwampGas thread/board
12. Newsletter/join CTA
13. Next/latest stories
14. Footer

## GatorBait TV wireframe

1. Live/current hero player
2. Live state / current show
3. Continue Watching / Watchlist
4. Show rail
5. Latest episodes
6. Clips/highlights
7. Audio / Listen:
   - Apple Podcasts
   - YouTube / YouTube Music
   - SoundCloud
   - RSS
8. Social/video embeds
9. Related stories
10. Footer

Interaction:
- streaming-style horizontal rails
- native swipe/touch
- accessible player controls
- no autoplay audio

## Magazine wireframe

1. Interactive current cover
2. Issue/date
3. Main cover story
4. Cover-line hotspots or adjacent links
5. Inside This Issue
6. Feature spreads/cards
7. Photo gallery
8. Audio/video companion
9. Archive covers
10. Subscribe/save issue
11. Footer

Expression:
- editorial and immersive
- motion can be richer here
- still uses same typography, controls, account and navigation system

## SwampGas wireframe

### Board index
1. Community header
2. Search
3. Trending / game-day threads
4. Board groups:
   - Football
   - Recruiting
   - Basketball
   - Other Gator Sports
   - General / Pub
   - Premium / Insider if entitlement strategy supports it
5. Each board row:
   - board name
   - short purpose
   - discussion count
   - message count
   - latest thread
   - latest activity/member
6. Community rules/help
7. Footer

### Thread page
1. Board breadcrumb
2. Thread title
3. Watch/follow thread
4. Sort/page controls
5. Posts
6. member identity/badges
7. reply composer
8. moderation/report controls
9. related/current stories
10. footer

No fake users/activity during prototype phase.

## Recruiting wireframe

1. Latest recruiting lead
2. Chronological recruiting news
3. Commit/visit content where verified
4. Recruiting video
5. Recruiting discussion threads
6. Search/filter
7. newsletter/member conversion
8. footer

Do not invent rankings, stars, NIL values or commitments.

## Search wireframe

- universal search
- tabs/filters:
  - stories
  - video
  - magazine
  - discussions
- date/topic filters where useful
- fast result cards
- no dead/empty category pages

## Membership/account wireframe

Account:
- profile
- subscription
- billing/cancel
- saved stories
- watchlist
- followed authors/topics
- email preferences
- privacy/account controls

Join:
- benefits first
- plans
- comparison
- transparent billing
- existing member sign-in

## Motion spec for wireframe stage

Allowed:
- section reveal
- subtle image depth
- horizontal swipe rails
- live pulse
- magazine cover transition
- reading progress
- drawer transitions
- video hover/tap preview

Not allowed:
- first-paint fade
- scroll-jacking
- continuous decorative particles
- motion required to access content
- heavy animation on every card

## Responsive acceptance

Design first at:
- 390 px mobile
- 430 px mobile
- tablet
- desktop

Then verify 320 px.

Every page must work structurally before motion or visual polish.

## Next execution sequence

1. Convert this brief into low-fidelity page-family wireframes.
2. Lock global design tokens.
3. Build one shared header/footer/navigation prototype.
4. Build Front Page + Article first.
5. Build TV + Magazine.
6. Build SwampGas.
7. Build Recruiting/Search/Account.
8. Apply motion only after structural approval.
9. Wire real Wix data/apps.
10. Run migration-preservation rehearsal before any publish.
