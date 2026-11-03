# Basketball homework, Nov. 3, 2026

Prepared for Brenden by the basketball desk. Sources: ESPN public JSON (teams/57 schedule, roster, rankings, SEC standings, pulled Nov. 3 at 01:14 UTC) and floridagators.com. Keyword volumes: OpenRush (search index, US, observed Nov. 3). No Gator Country, no betting lines, no quotes.

## 1. Verified facts

| Fact | Value | Source |
|---|---|---|
| Rank | No. 1 AP (47 first-place votes, 1,461 points), No. 1 Coaches (20 first-place votes, 732 points). Both preseason, released Oct. 19. | ESPN rankings; [floridagators.com](https://floridagators.com/news/2026/10/19/mens-basketball-voted-no-1-in-ap-preseason-poll) |
| Coach | Todd Golden | ESPN roster |
| Roster | 15 players (Aberdeen, AJ Brown, Isaiah Brown, Butajevas, Chinyelu, Condon, Fland, Haugh, Ingram, Klavzar, Kovatchev, Jones Lay, Lloyd, Mikic, Petrovic) | ESPN roster |
| Schedule | 30 games, 18 vs. SEC (Texas, Georgia and South Carolina twice) | ESPN schedule |
| Opener | Florida 77, No. 14 Miami 67 (final), Nov. 2, Tampa (Orion180 Tipoff Classic). Florida is 1-0. | ESPN |
| SEC standings | All 16 teams 0-0 in conference play. | ESPN standings |

The Miami final is confirmed in ESPN's schedule feed. Pull box-score numbers from ESPN before any recap runs.

## 2. Landscape

**AP Top 25 (preseason), SEC teams:** No. 1 Florida, No. 7 Texas, No. 8 Tennessee, No. 12 Arkansas, No. 20 Alabama, No. 23 Kentucky, No. 24 Vanderbilt. Seven SEC teams in the AP poll; Missouri also received votes.

**Coaches Poll (preseason), SEC teams:** No. 1 Florida, No. 7 Texas, No. 9 Tennessee, No. 13 Arkansas, No. 18 (tie) Alabama, No. 21 Vanderbilt, No. 23 Kentucky. Texas A&M and Missouri received votes.

**National top five (AP):** Florida, Duke (10 first-place votes), Illinois (2), UConn, Arizona. Miami is No. 14, Notre Dame and Florida State are unranked.

**Next poll:** AP and Coaches polls update on Mondays during the season. The hub reads ESPN on every page load, so the new rank appears without a rebuild. Do not write a rank line until ESPN shows the new poll.

## 3. Marquee games (ET, ESPN data)

| Date | Game | TV |
|---|---|---|
| Nov. 5, 8 p.m. | Jacksonville (home) | SECN+ |
| Nov. 10, 6 p.m. | at Florida State | ESPN2 |
| Nov. 13, 7 p.m. | Merrimack (home) | SEC Network |
| Nov. 17, 4:30 p.m. | vs. Notre Dame, Las Vegas (Players Era) | ESPN |
| Dec. 1, 9:30 p.m. | No. 2 Duke (home, ACC/SEC Challenge) | ESPN |
| Dec. 12, noon | vs. Georgia Tech, Orlando (Hall of Fame Series) | ESPNU |
| Jan. 2, 6 p.m. | at No. 7 Texas (SEC opener) | TBA |
| Jan. 9, 11 a.m. | No. 24 Vanderbilt (home) | ESPN |
| Jan. 16, 2 p.m. | at No. 20 Alabama | TBA |
| Jan. 30 (time TBA) | at No. 8 Tennessee | TBA |
| Feb. 6, noon | No. 7 Texas (home) | ESPN |
| Feb. 27, 3 p.m. | at No. 12 Arkansas | ABC |
| Mar. 6 (time TBA) | No. 23 Kentucky (home, finale) | ESPN |

Ranks are today's AP ranks and will move.

## 4. Where GatorBait is thin

The Basketball category (id `e5f927a8`, 644 posts) is active but sparse: the live list shows about a dozen posts since the exhibitions (Franz Beard, Buddy Martin, staff), roughly one a day around games and nothing between them. There is no page for schedule, TV, roster or the polls; those searches go to ESPN and the school.

Missing and cheap to make:
- Game-by-game previews with TV and how to watch (none for the Duke, Texas or Notre Dame games).
- A running SEC power ranking and poll tracker, updated Mondays.
- Player profiles for the 15 on the roster (one short post each; headshots and bios from floridagators.com).
- A "what to know" explainer for casual football readers: the No. 1 team, the coach, the portal-built roster.
- Postgame same-night stories with ESPN box-score numbers.
- Duke, Texas and Tennessee opponent scouting, one week before each.

## 5. SEO and keywords (OpenRush, monthly US volume)

| Keyword | Volume | Note |
|---|---|---|
| florida basketball | 246,000 | head term, low competition flag |
| florida basketball schedule (and about six near-duplicates) | 33,100 | peak 74,000 in March and November 2025 |
| university of florida basketball schedule (variants) | 12,100 | |
| florida gators basketball roster | 18,100 | 33,100 in Nov. 2025 |
| florida gators basketball score | 8,100 | 40,500 in March 2026 |
| florida gators basketball score today | 320 | game-day only |

Volumes are seasonal; November through March is the window. The hub targets schedule, TV, roster, score and polls with real text and JSON-LD (SportsTeam). It sits on the existing category URL, which already carries the "Gator Basketball" title and description. Do not change that page's SEO tags without a decision; if a dedicated page is added, give it the title "Florida Gators Basketball: Schedule, TV, Roster and News" and a canonical to itself.

## 6. Content calendar, Nov. 3 to Nov. 17

| Date | Item |
|---|---|
| Nov. 3 | Miami recap (77-67) from the ESPN box score; link the hub. |
| Nov. 4 | Todd Golden Wednesday/postgame transcript piece only from a full source; roster rotation take. |
| Nov. 5 | Jacksonville preview and how-to-watch (8 p.m., SECN+); recap after. |
| Nov. 6 | Player profile 1 and 2 (Haugh, Condon). |
| Nov. 9 | Monday poll check: what moved after Week 1 (only after ESPN posts it). |
| Nov. 10 | Florida State preview and recap (6 p.m., ESPN2). |
| Nov. 11 | Player profile 3 and 4 (Fland, Chinyelu). |
| Nov. 12 | Merrimack preview with TV; Notre Dame travel and Players Era explainer. |
| Nov. 13 | Merrimack recap. |
| Nov. 14 | SEC power ranking v1. |
| Nov. 16 | Poll check and Notre Dame preview. |
| Nov. 17 | Notre Dame game, 4:30 p.m. on ESPN. |

## 7. The hub

Route: **no dedicated basketball page exists.** `/basketball` returns 404 on the live site and the pages sitemap lists no basketball page; `/gator-basketball` also returns 404; the blog-categories sitemap has the category `/gatorbait-media-blogs/categories/gator-basketball`. No Wix API for creating an Editor page was found in the Wix docs tools (only create-site-from-template and store-page install). The hub therefore mounts above the News Wire on the category route. If Brenden wants a cleaner URL, add a blank page at `/gator-basketball` in the Editor; the loader route regex is the only change needed.
