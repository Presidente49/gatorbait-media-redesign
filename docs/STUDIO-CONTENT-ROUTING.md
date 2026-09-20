# GatorBait Studio Content Routing

Status: Studio build only
Production mutation: none
Source: live Wix Blog inventory, 2026-09-20

## Current inventory

- Published posts: 4,528
- Blog categories: 28
- Existing `/post/...` URLs: PRESERVE by default

The new Studio pages should consume the existing Wix Blog content. Do not copy posts into a second CMS merely to achieve a new layout.

## Routing principle

A Wix Blog post may appear in more than one presentation surface without changing its canonical article URL.

Example:
- a Buddy Martin football column can appear on Front Page, News, Magazine and Buddy-related modules;
- every card still links to the existing `/post/...` article.

## Primary destination rules

### Front Page

Eligible:
- Gator Breaking News
- Gator Football
- Gator Recruiting
- Gator Basketball
- other current sport categories when recently active
- current Featured Article
- selected recent Buddy/Franz/Eddie/Loren work

Order:
1. editorial priority / live-game state when explicitly set
2. current featured story
3. reverse chronological qualifying stories

Exclude from normal front-page feed:
- stale show notices
- retired network/Sidelines material
- old category landing filler
- duplicate versions of the same story
- archival Magazine material unless deliberately promoted

### News

Broad chronological newsroom.

Feed categories:
- Gator Breaking News
- Gator Football
- Gator Recruiting
- Gator Basketball
- Gator Baseball
- Gator Softball
- Gator Women's Basketball
- Gator Gymnastics
- Gator Golf
- Gator Tennis
- Gator Track & Field
- Gators in The NFL
- NCAA Transfer Portal
- active current-sport categories

Do not create 20 primary navigation tabs.
Use filters/search where useful.

### Recruiting

Primary feed:
- Gator Recruiting
- NCAA Transfer Portal when recruiting-adjacent

Secondary:
- recruiting-tagged football stories where taxonomy supports it

**Data reality check (researched 2026-09-20):** the official NCAA transfer portal
database is member-access-only, not public. 247Sports/On3/CFB Network's
"real-time" portal trackers run on their own reporting networks and paid data
relationships, not a public feed — there is no legitimate free API that
replicates "who just entered the portal right now." Do not attempt to fake a
live tracker table with no real data source behind it. This page family is
built from GatorBait's own `Gator Recruiting` (1,362 posts) and
`NCAA Transfer Portal` (4 posts) Blog categories exactly as the routing above
already says — original reporting is the actual competitive asset here, not a
scraped table.

### GatorBait TV

Primary feed:
- The Buddy Martin Show

Also include:
- show/video posts identified by actual embedded video metadata or approved TV/show taxonomy
- future GatorBait TV show categories

A story can appear here and in News if it is both a show story and a news story.

### Magazine

Primary:
- Gatorbait Magazine

Column/feature contributors eligible for Magazine presentation:
- Buddy's Blog
- Franz Beard - Blog
- Eddie Gilley - Blog
- Loren Meadows - Blogs
- Carlton Reese
- Thoughts Of The Day

Magazine is a presentation/archive layer, not a second copy of the article.

### GatorBait.net

Blog posts do not become fake forum posts.

Instead:
- story pages can expose “Discuss this story”
- relevant discussion threads can link back to canonical `/post/...` stories
- trending forum modules are sourced from the community backend, not Blog categories

### Search

Index all canonical published Blog posts regardless of destination.

Search filters:
- Stories
- Video
- Magazine
- Discussions

## Category classification

### Presentation / editorial categories

These can drive page modules:
- Gator Breaking News
- Gator Football
- Gator Recruiting
- Gator Basketball
- Gator Baseball
- Gator Softball
- Gator Women's Basketball
- Gator Gymnastics
- Gator Golf
- Gator Tennis
- Gator Track & Field
- Gators in The NFL
- NCAA Transfer Portal
- Gatorbait Magazine
- The Buddy Martin Show

### Contributor / column categories

Use for contributor pages, filters and Magazine presentation:
- Buddy's Blog
- Franz Beard - Blog
- Eddie Gilley - Blog
- Loren Meadows - Blogs
- Kyle Curtis - Sweet Sixteen
- Carlton Reese
- Thoughts Of The Day

### Metadata/topic categories

Do not make these primary nav destinations:
- Featured Article
- Jon Sumrall
- Aaron Philo
- Gator Spring Football
- SEC Media Days

They may power badges, filters, related-content modules or seasonal landing modules.

### Retired / blocked from new Studio presentation

- Rob Browne Column

Reason:
GatorBait no longer participates in Sidelines/Rob Browne programming. Preserve historical article URLs if any exist, but do not expose this category in new navigation, homepage modules, TV, Magazine or promotional rails.

Any Sidelines, Sidelines.live or retired Rob Browne branding discovered elsewhere receives the same treatment unless Brenden explicitly restores it.

## Existing category URL rule

Existing Wix category URLs may remain reachable for backward compatibility and SEO.

Do not use them as the primary modern navigation unless that category is intentionally promoted.

The new Studio interface may route navigation into unified News/Recruiting/TV/Magazine experiences while preserving old category URLs underneath.

## Article canonical rule

Never rewrite an established `/post/<slug>` simply because the new Studio design has a different section structure.

Cards in:
- Front Page
- News
- Recruiting
- TV
- Magazine
- search
- related coverage

all link to the existing canonical post URL.

## Duplicate-content handling

When near-duplicate versions exist:
- do not silently delete either URL during design;
- identify the stronger/current canonical candidate;
- review traffic/backlinks before any consolidation;
- only then create a redirect if approved.

## Current routing examples

| Current story | Studio surfaces |
|---|---|
| Jon Sumrall: No Bad Wins, Work the Cut After Florida Beats Auburn | Front Page, News, Football |
| No Bad Wins: Sumrall Issues Warning After Florida's Auburn Win | Front Page, News, Football |
| Sumrall Passed the Test. He Aced It. Next, Please! Hotty Toddy? | Front Page, News, Magazine/Buddy |
| Florida 44 Auburn 39: Gators End Jordan-Hare Drought | Front Page, News, Football |
| FINAL Florida 44 Auburn 39: Gators Survive 16 Penalties | News, Football; suppress from lead when replaced by final analysis |
| Best Friday in Football with Buddy Martin | GatorBait TV, News only when editorially useful |
| Before Laura Rutledge Was Laura Rutledge... | Magazine, GatorBait TV related, News |
| Laura Rutledge Returns to The Buddy Martin Show... | GatorBait TV, News |
| Florida–Auburn By the Numbers... | Front Page when current, News, Magazine |
| What Can “VB3” Do for You? | News, Magazine |
| Personal Recollections Of “14 Days In Gainesville”... | Magazine, News |
| Gator Nation... Basketball | Front Page when current, News, Basketball |

## Items needing taxonomy cleanup before final cutover

Recent posts found with no category assignment:
- Florida-Auburn grudge match: The only thing missing is Gordon Solie
- Thoughts of the Day: September 17, 2026

Do not block Studio prototyping on these. The routing layer should support an editorial fallback, but these should be corrected in Wix Blog before migration rehearsal.

## Studio feed logic

Prefer data-driven modules:
- latest qualifying posts by category
- editorial-feature flag where meaningful
- manual hero override only when needed
- no duplicated article records

Each module needs:
- empty-state behavior
- maximum item count
- image fallback
- date/byline metadata
- mobile layout
- duplicate suppression across adjacent homepage modules

## Next build action

Connect Front Page + Article template first using real Wix Blog records.

Then:
1. News filters
2. Recruiting
3. GatorBait TV
4. Magazine
5. Search
6. GatorBait.net story-to-discussion bridge

This sequence gives every later product the same canonical article layer.
