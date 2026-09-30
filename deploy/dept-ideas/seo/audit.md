# GatorBait SEO audit, Sept. 30, 2026 (read-only)

Every number below comes from a tool call made this session. Each finding cites the evidence file in `deploy/dept-ideas/seo/evidence/` (condensed copies of the responses, money columns and follower/subscriber text stripped) and the fact provenance OpenRush attached: `source_class`, `observed_at`, `confidence`. Nothing on Wix, Cloudflare, email or social was touched. Verified fact and inference are labeled.

## 1. Technical health (evidence 03, `audit_site`, crawl, observed 2026-09-30T05:14:25Z, confidence 0.9)

- Sitemap-driven discovery found **2,001 URLs**; 20 sampled across `/`, `/post/*`, `/category/*`, `/product-page/*`. 0 fetch failures, no render warning.
- **On-page score 87.5**: 0 high, 3 medium, 7 low issue clusters.
- Medium: `missing_meta_description` (2 pages: the Baker's Sporting Goods store host and the Golden Season product page), `low_content` (3 old posts at 101 to 143 words: `gators-beat-uconn`, `stampeded-in-texas`, `the-promise-was-not`), `duplicate_title` (the itemorder.com store host only).
- Low: `multiple_h1` on **14 of 20** pages including the homepage; `title_too_long` 6; `no_image_alt` 4 including the homepage; `missing_structured_data` only on the itemorder.com host (so the homepage and posts do render some JSON-LD; the type on the homepage could not be read from this container, see section 2).
- Caveat: the sampler picked the itemorder.com store page six times, which inflates its issue counts. That host is Baker's, not Wix.

## 2. What a crawler sees on the homepage (evidence 18, TinyFish `fetch_content`, live fetch, `ttl: 0`, 430 ms)

- **Verified:** the served HTML's first `<h1>` is `Today's Edition`, followed by the Wix shell copy ("Dive into today's edition... your trusted source since 1980") and six story `<h2>`s. Page title and description are correct. `og:type` is `website`.
- **Inference:** the Front Page 2026 renderer arrives through the Home Code loader at runtime (`deploy/front-page-2026/README.md`), so a crawler that does not execute JavaScript, including the OpenRush audit, indexes the old shell text, and the `multiple_h1` finding on `/` is the shell's H1 plus the renderer's lead H1 when JavaScript runs. This is not a request to change the shell (that needs Brenden's approval per `docs/HOMEPAGE-BASELINE-LOCK.md`); it explains the ranking picture in section 3.
- Exa's fetch of the homepage (evidence 19) returned a mid-September cached copy and was discarded as evidence.

## 3. What the homepage ranks for (evidence 05, `inspect_page`, search_index, observed 05:14:27Z, confidence 0.7)

- 24 indexed keywords, estimated 120 organic visits a month.
- Position 1 for `gatorbait media` and 2 for `gator bait football`. Everything else is entity confusion: `gator bait and tackle` (18), `gator bait melrose` (31), `cast of gator bait` (45), `beef lung gator bait` (27). Not one football-news query.

## 4. Domain picture (evidence 04, `inspect_domain`, search_index, observed 05:14:28Z, confidence 0.7)

- **132 organic keywords**, 6 in the top 3, 18 in the top 10; movement 86 new, 26 up, 12 down, 45 lost, so the footprint churns with the news cycle.
- The best real-demand rankings belong to one category page: `/gatorbait-media-blogs/categories/gator-recruiting` at positions 12 to 16 for `florida gators football recruiting news` (2,900/mo), `florida recruiting news` (2,900), `gators football recruiting news` (2,900), `gator recruiting` (1,600).
- `top_pages` came back empty; the tool's own freshness note says overlap-based competitor ranking is unreliable at a 1,014x keyword gap.

## 5. The Buddy Martin article (evidence 06, `inspect_page`, search_index, observed 05:14:25Z)

- `put-down-the-poll-gators-missouri-is-waiting...` (published 2026-09-28T23:24:43Z per `gazette-live/posts.json`): **0 indexed keywords** 30 hours after publish. Index lag, not a live SERP check, but it shows the story never entered the index window that matters for a Saturday game.

## 6. Live SERPs (all `inspect_serp`, live_serp, confidence 0.95)

| Query | Observed | Who ranks (top organic) | Features | GatorBait |
|---|---|---|---|---|
| Florida Gators football news (ev. 07) | 05:14:38Z | gatorsports.com, reddit r/FloridaGators, floridagators.com, Yahoo, hailfloridahail.com, YouTube, gatorswire | top_stories, perspectives, video, PAA | absent from top 7 |
| Buddy Martin (ev. 08) | 05:14:28Z | YouTube show page, Facebook show page, a Mopar drag racer thread, a 2019 obituary, X posts, gatorcountry.com's 2008 hiring post | knowledge_graph, video, perspectives | no gatorbaitmedia.com URL in top 9 |
| Buddy Martin Gators (ev. 14) | 09:45:49Z | X profile, **gatorbaitmedia.com/about (2)**, LinkedIn, Facebook, YouTube channel, Muck Rack | video, PAA | About page with a 2019 "new Gator Bait Magazine" snippet; no column, no columnist tag page |
| Gators Missouri (ev. 09) | 05:14:32Z | floridagators.com photo gallery, two youth-baseball "Missouri Gators" pages, a 2024-25 basketball replay, a baseball Reddit thread | **AI Overview about alligators in Missouri**, PAA | absent; no football result at all |
| Florida Missouri football game (ev. 10) | 05:14:30Z | floridagators.com opponent history, **ESPN game 401856708**, Ticketmaster, mutigers.com, Winsipedia, YouTube preview, SeatGeek | top_stories, PAA ("What channel...", "odds") | absent from top 7 despite `first-look-missouri` published Sept. 27 |

The ESPN event id in that SERP (401856708) is the same id `sports-live/scoreboard.json` carries for `next.eventId`. Google already keys this game to that entity.

## 7. AI answers (evidence 11, `inspect_ai_visibility`, ai_answer, corpus 2026-09-10 to 09-19, confidence 0.4)

- gatorbaitmedia.com is cited in **7** Google AI Overview answers. Four are "gator blog(s)" lists where it sits beside hailfloridahail.com, gatorcountry.com, onlygators.com and alligatorarmy.com; one is Buddy Martin's Joey Freshwater column cited for "lane kiffin nickname". Google AI Overview only; directional.

## 8. Demand and competitive set

- Keyword ideas off `florida gators football` (evidence 12, search_index): `florida football` 301,000/mo average with 823,000 in Sept. 2025; `gator football` 246,000 average, 823,000 in Sept. 2025; `florida gators football schedule` 90,500 average, 301,000 in Sept. 2025. Demand is seasonal and it is now.
- Who ranks across our five seed queries (evidence 13): espn.com (avg 4.0), floridagators.com (2.0), gatorsports.com (7.7), 247sports.com (9.7), gatorswire (12.0), on3.com (13.0), cbssports, foxsports, si.com, nytimes. GatorBait does not appear.

## 9. Tool limits hit (recorded per brief rule 6)

- `list_websites` (evidence 02): "Nothing is connected on this account yet. Connect Google Search Console..." so `get_search_performance` could not run; no measured clicks or impressions exist in this audit.
- vidIQ `vidiq_keyword_research` (evidence 15) refused verbatim: "Not enough credits. This tool costs 5 credits. No credits were charged..." Switched to OpenRush per the brief.
- Wix docs (evidence 16, 17): custom embed `embedData.html` max **15,000 characters**; posts already carry a native `NewsArticle` script tag (author `Organization "GatorBait Staff"` in the sampled capture), so `docs/ARTICLE-PAGE-STANDARD.md` forbids adding a second NewsArticle.
- OpenRush calls made: 14 (the coordinator's later budget of about 8 arrived after 13 had run; one more SERP was added on request).

## 10. What the audit says to do first

The site's technical base is sound (87.5, no high issues). The gap is entity-level: Google does not connect gatorbaitmedia.com to the Florida Gators team, to its games, or to Buddy Martin as a person. The homepage's crawlable text is the old shell, its top keywords are bait and tackle, the columnist ranks through a 2019 About snippet, and the Missouri game SERP already keys on ESPN event 401856708 while our preview is invisible. `structured-data.mjs` in this folder emits that missing entity layer from the two feeds the site already refreshes: a homepage `@graph` (organization, site, SportsTeam, 12 `SportsEvent` nodes with ESPN `sameAs`, a Buddy-led story list) at 11,237 chars, and a per-article `SportsEvent` tag that does not duplicate Wix's NewsArticle. It does not change anything readers see and does not touch the shell.
