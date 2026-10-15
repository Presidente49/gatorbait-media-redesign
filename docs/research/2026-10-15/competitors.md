# Competitor homepage research for GatorBait Media

Date: 2026-10-15 (Florida is 4-2, at No. 8 Texas Sat 10/17). Read-only. Fetched with the Firecrawl MCP: 13 page scrapes and 4 searches.

## How to read this (method and limits)

- **What I could see:** Firecrawl returns page text and structure (markdown), not pixels. Section order, module names, CTA wording, prices and "Advertisement" slots come straight from that output. These are **verified**.
- **What I could not see:** exact above-the-fold layout on mobile versus desktop, ad sizes, and page weight. I **inferred** these from DOM order and from what each platform is known to look like. Those notes are marked *(inferred)*. I did not measure page weight; there are no Lighthouse numbers here.
- **Could not fetch:**
  - **The Athletic** team page (nytimes.com/athletic): Firecrawl returns "we do not support this site", and a search did not turn up the page either. Nothing about The Athletic below comes from this session.
  - **Alligator Army** article pages. The homepage loaded, but it is no longer an article site (see section 4).
  - **247Sports join page.** I took 247's prices from search snippets of 247 promo articles and its help center, not from the live checkout.
- Gator Country was not studied (house rule).

---

## 1. On3 Gators Online (on3.com/teams/florida-gators/)

**DOM order, verified:** team nav (News, Forums, Football, FB Recruiting, Basketball, BB Recruiting, About, Team Store) → "Rivals Database Hub", **Join Now**, Login → **subscription card first in the content area:** "60% off your first year, then billed annually. GatorsOnline+. **One subscription:** The best Florida Gators coverage and community, and all access to the On3 College Sports Network. Join Now" → Commits widget (5 most recent, with ratings) → Quick Links (App, YouTube, X, IG, FB, Boards) → **football schedule with results** (W/L and scores, next game with kickoff time, tabs for Football and Basketball) → 3 lead cards (1 large, 2 medium) → "Gators Online Headlines" river (about 15 items, each with category, a "+" premium marker, author and relative time "1h/23h/2d") → **"Latest on the Message Boards"** (5 live threads with reply and view counts) → **newsletter** ("Gators Online Newsletter … I'm game") → Advertisement → team recruiting rankings → Advertisement → network "Top Headlines" → NIL valuations → footer.

- **Above the fold *(inferred)*:** on mobile, the Join promo and commits or schedule rails probably sit above or beside the first story. On desktop it is a 3-column layout, with the lead story in the center and the schedule and promo in the rails.
- **Lead treatment:** one large photo card plus two smaller cards. All three are the newest items, so the "lead" is chosen by time, not by an editor.
- **Ordering:** reverse chronological. Each item has a category label ("GATORS ONLINE FOOTBALL RECRUITING") and a "+" on premium items, so free and paid stories are mixed in one river.
- **Membership:** "Join Now" is in the header on every page, and a promo card sits high on the homepage. On a premium article (verified on "Recruiting Intel…"), readers see the headline, byline, hero photo and **one-sentence dek**, then "Recommendations" (4 cards), then a hard wall: "60% off your first year, then billed annually at $119.99/year … Join Now / Already a subscriber? Login". The join page shows **4-Week $13.99** and **Annual $47.99 first year, then $119.99** ("BEST DEAL 60% OFF"). Benefits listed: insider access, "Largest Florida Fan Community", full network access, Rivals recruiting, national writers, message boards, app, and an FAQ that includes "Can I cancel anytime?"
- **Newsletter:** one inline block in the middle of the page ("I'm game" button). It is lower priority than the paid pitch.
- **Video and podcast:** shows run as articles in the river ("…: Gators Online Show"). There is no dedicated video module on the homepage. "Podcasts and Shows" sits under About.
- **Game-day:** the schedule widget, with results and the next kickoff time, is the main game module. There is no live-score strip.
- **Ads:** 2 labeled "Advertisement" slots in the homepage body *(the ad density in real browsers is likely higher)*. There is also an affiliate "Team Store" link.
- **Worth copying:** a schedule and results widget near the top; a visible premium marker on teaser items; a live forum preview as social proof; an annual plan framed with a large first-year discount.
- **Worth avoiding:** wall text built around the network ("all of On3") rather than the voice of the Florida writers; the first screen is crowded with widgets before the reader reaches a story.

## 2. 247Sports Swamp247 (247sports.com/college/florida/)

**DOM order, verified:** a very large mega-menu (FB Rec, BK Rec, Transfer Portal, NCAA FB/BK, team Football/FB Rec/Basketball/BK Rec, More → **VIP Membership, Podcast, Newsletter, Text Alerts**) plus CBS cross-links (CBS Sports, SportsLine, MaxPreps, Shop, StubHub, Betting, Paramount+) → Log In / Join → **Quick Links with the VIP sale first: "FOOTBALL SALE: 50% off annual VIP membership"**, then the board, targets, commits and "Subscribe to the Swamp247 Podcast" → recruiting rankings, Crystal Ball, FB/MBK/WBK schedules (these rails come before the news in the DOM) → **lead story with a VIP tag, plus an inline "Join: OCTOBER SALE! 50% off Annual VIP Membership to Swamp247"** → river of about 8 items, many tagged **VIP** → "Featured Videos" (4, mostly CBS national) → separate "Florida Football", "Florida Basketball", "Florida News" and "Florida CBS Sports" lists (6 each) → a **Florida VIP box** ("50% off first year; Chat with Experts & hard-core fans in our premium message boards; Insider news & analysis you can't get anywhere else"; Join Now) → VIP Stories → Trending Community Topics → Trending News (numbered 1–5) → **"Free Florida Gators Newsletter: Get daily insights and the latest scoop on all-things Florida"** → staff cards with X handles → **Latest Podcasts** (date and duration, e.g. "Live postgame reaction… 20:49") → national stories → footer.

- **Price (from search snippets, not the live checkout):** renews at **$139.99/yr or $13.99/mo**. Promos run all season: 50%, 60% and 75% off annual, and a "$1 first month" offer.
- **Above the fold *(inferred)*:** nav, a sale banner and rails push the first story down, especially on mobile. This is the heaviest page in the set.
- **Ordering:** a lead story, then a mixed river, then repeated lists by sport. The same stories appear 2–3 times on the page.
- **Newsletter:** a dedicated "Free … Newsletter" block in the lower right rail. It names a daily rhythm.
- **Podcast:** its own "Latest Podcasts" list with dates and run times, plus a "Subscribe to the podcast" quick link.
- **Game-day:** schedule tables for 3 sports (results, times in the reader's local time).
- **Ads and weight:** CBS network cross-promotion, betting and StubHub links. Likely the slowest page in the set *(inferred from module count)*.
- **Worth copying:** the sale price stated in the CTA itself; a podcast list showing date and duration; a "Trending" top-5 list; staff cards that put a face and handle on the coverage.
- **Worth avoiding:** duplicated lists, network content diluting the team voice, and a "SALE" that is permanent and so trains readers never to pay full price.

## 3. Gators Wire (USA Today Network, gatorswire.usatoday.com)

**DOM order, verified:** a slim nav (Schedule → USA Today sportsdata, Football, Basketball, Baseball, Recruiting, SEC Sports, **Newsletter**) → **lead block: 1 large card ("Thursday's betting odds, predictions for Florida football at Texas") plus 3 small cards** → auto-play video player (it showed "This Video Cannot Be Played") → "More NCAAMB Scores" → "More Top Stories" grid of about 20 thumbnail headlines (with a "Shopping Deals" item mixed in) → text-only headline list → footer.

- **Article page, verified:** category label, headline, byline, "Updated" timestamp and share buttons, then an **auto-play video above the body copy**, then 5 short paragraphs, then a crossword promo, then a gallery link, then 5 related links, then a "Follow us on X/Bluesky/Facebook" line, then "Featured Weekly Ad". Metadata shows `article:content_tier: free`.
- **Membership:** none. Revenue is ads and affiliates.
- **Newsletter:** sits in the top nav and in the footer as a link to a USA Today profile page. There is no inline form.
- **Game-day:** a schedule link out to sportsdata. The "Scores" module was showing basketball scores during football week.
- **Ads and weight:** heavy *(inferred)*: auto-play video, Gannett ad stack and affiliate units.
- **Content tone:** high-volume SEO stories: daily "betting odds, predictions" posts (one on Wednesday and another on Thursday), "series history", "key stats", every quote from the coordinators, bowl projections.
- **Worth copying:** a clean, short nav with "Newsletter" as a top-level item; a simple 1-large + 3-small lead block.
- **Worth avoiding:** auto-play video above the article body; thin, repetitive SEO stories; off-topic modules (crossword, shopping) inside the stories.

## 4. Alligator Army (SB Nation)

**Verified:** the homepage is now **"The Feed: Community discussions to feed your fandom"**, with Create Post, sort tabs (All / Most Recs / Most Replies), SB Nation national "Most Popular", an app download box, newsletter and community links, and gambling-help boilerplate. Posts live at /post/<id> and are fan posts. There are no staff articles, no membership and no game module on the homepage.

- **Takeaway:** the SB Nation team blog in its old form is gone. Its audience is up for grabs. Readers who want a voice-driven, fan-perspective outlet that is not built around recruiting are exactly GatorBait's lane.
- **Worth avoiding:** a homepage made entirely of unmoderated community posts with no editorial anchor.

## 5. FloridaGators.com (official, Sidearm/Learfield)

**DOM order, verified:** a pause control for the rotating slideshow → "Stories Grid" with one featured story attached to an **event carousel** (next event with date and time) → a 4-item "Stories List" with sport codes (FB, MBK, BB) and dates → More Headlines → Ad → Quick Links → **Podcasts** (Gator Tales) → Ad → **"Main Video" plus a "Videos Slider"** (press conferences, coach's show, "Road to Gameday", **vertical 275×366 thumbnails**) → Photo Galleries (image counts) → sponsor slides (Swamp renovation, GatorsNIL, Facilities) → footer.

- **Lead treatment:** the rotating hero shows whichever sport posted last (on this day, diving), not football in game week.
- **Monetization:** sponsors ("presented by UF Health / XRP") and tickets ("SEC Saturday Packs on Sale"). There is no paywall.
- **Video:** the strongest video shelf in the set. It is a dedicated rail with tall, phone-shaped cards, and every press conference is posted the same day.
- **Game-day:** an event carousel tied to the hero.
- **Ads:** "Skip Ad" and "Advertisement" markers appear about 6 times *(this includes site-takeover slots)*.
- **Worth copying:** a video shelf as its own band with vertical cards; tags for each sport; an events carousel.
- **Worth avoiding:** a rotating hero with no editorial priority; slideshows (and their rotation control) taking space at the top of the page.

## 6. Inside the Hall (independent, Indiana; insidethehall.com, WordPress)

**DOM order, verified:** a short nav: **Community** (paid), Schedule, Roster, Stats, Scholarships, Recruiting, Shop, **Podcast**, Tickets (affiliate), Football → "Latest News": **1 large lead story plus 2 secondary stories**, each with relative time and a **comment count** → **"The Notebook: Short dispatches from the beat"** (a short news item shown in full on the homepage, e.g. the availability report) → a chronological river with category labels (Video, Recruiting, Football, Media) and comment counts → Older posts → "Top Stories" (3) → footer with social links.

- **Membership, verified:** a separate "Inside the Hall Basketball Community" on Mighty Networks, **$42.95/yr**, framed as community and support rather than paywalled stories: "home for thoughtful and intelligent Indiana basketball discussion. Trolls, personal attacks and political discussion are not allowed", a regular AMA with the co-founder, staff who join the discussion, and "Our community supports Inside the Hall, the leading independent publisher". Articles stay free.
- **Newsletter:** none visible on the homepage.
- **Ads:** light. No ad markers appeared in the scrape.
- **Weight:** lean WordPress page *(inferred)*.
- **Worth copying:** the "Notebook" strip of short beat items; reference pages kept in the nav (schedule, roster, stats, scholarship count) because they rank in search and get reused all season; a community-first paid pitch built on independence and access to the writers; comment counts as a signal of activity.

## 7. Bald Faced Truth by John Canzano (independent Substack, Oregon / Pac-12 / CFB)

**DOM order, verified:** a **subscribe overlay first**: logo, "Columnist John Canzano on sports, college football, and more. **Over 59,000 subscribers**. Subscribe / No thanks" → nav (Home, BFT on YouTube, conference tags, Human Interest, Archive, Leaderboard, About) → one large lead post with a **dek** ("When an onside kick gets you fired...") plus 2 secondary posts with likes and comments → "Most Popular" → Latest/Top/Discussions tabs → a river where each post has a dek → Recommendations → footer.

- **Recurring franchises are visible in the headlines:** "Monday Mailbag: Your questions. My answers.", "My 'day-after' thoughts", "Week 6 winners, picks, and predictions", "Saturday Special", "A Friday human-interest story."
- **Membership:** Substack free/paid tiers (price not captured). The pitch is the **subscriber count plus the writer's name**.
- **Ads:** none.
- **Weight:** light.
- **Worth copying:** subscriber count as social proof next to the email field; a dek under every headline; recurring branded columns on a fixed weekly schedule; the writer as the brand.
- **Worth avoiding:** the full-screen email gate before any content, which is aggressive for first-time mobile visitors arriving from social.

## 8. The Athletic: not fetched

Firecrawl blocks the site. Nothing about its layout, price or wall was verified this session, so it is left out of the rankings.

---

## Price comparison (verified unless noted)

| Outlet | Monthly | Annual list price | Promo seen | What the pitch sells |
|---|---|---|---|---|
| On3 GatorsOnline+ | $13.99 per 4 weeks | $119.99 | $47.99 first year (60% off) | Insiders, boards, network, recruiting database |
| 247 Swamp247 VIP | $13.99 *(help-center snippet)* | $139.99 *(snippet)* | 50–75% off annual; $1 first month | Premium boards, insider news |
| Inside the Hall Community | none | $42.95 | none | Moderated community, AMA, support the independent publisher |
| **GatorBait All Access** | **$9.99** | **~$99** | n/a | (to define) |

GatorBait is **already $4/mo cheaper than both networks at list price**, but $51 more than On3's first-year promo ($99 vs $47.99). Whether to run a promo is Brenden's call. These numbers are context, not a recommendation.

---

## (1) Top 10 transferable patterns for GatorBait (ranked)

1. **A game-week strip at the top of the homepage** (next opponent, kickoff, TV, record, last result) that switches to a live score or final on Saturday. Every serious competitor puts the schedule high on the page, and none of them does it well on mobile.
2. **An editor-picked lead plus 2 secondary stories with a one-line dek under each** (Inside the Hall, Canzano). This shows editorial judgment, where On3 picks by time and the official site's slideshow rotates.
3. **The Buddy Martin Show as its own shelf near the top**, with vertical or 16:9 cards showing date and run time (the official site's video slider plus 247's podcast list). Video is GatorBait's differentiator, and On3 and Gators Wire bury theirs.
4. **A visible premium marker on teaser cards** ("+" or "All Access") mixed into the free river (On3, 247). It tells readers what membership gets them without a separate page.
5. **A soft wall on premium articles: headline, dek, hero image and first paragraph, then the offer with a monthly/annual toggle and "Cancel anytime"** (On3 wall plus FAQ). State the annual saving in dollars.
6. **An independent, people-first pitch** ("Support independent Gators coverage. Get Buddy and the staff, not a network") modeled on Inside the Hall. It is the one argument On3 and 247 cannot make.
7. **Newsletter signup inline after the 3rd–4th story, naming a rhythm** ("The daily GatorBait. Free.", as 247 does) with **subscriber count as social proof** (Canzano). Also put "Newsletter" in the top nav (Gators Wire).
8. **A "Notebook" or "Quick Hits" strip** of short beat items shown in full (Inside the Hall). It suits quick postgame updates and availability reports without a full article for each.
9. **Recurring branded franchises on a fixed weekly schedule** (Mailbag Monday, Day-After Thoughts, Saturday Picks), as Canzano does. They give readers a reason to come back on set days, and a natural home for paid members-only pieces.
10. **A short nav plus evergreen reference pages** (Schedule, Roster, Magazine, Show, Newsletter, All Access), modeled on Inside the Hall and Gators Wire. Keep it to 6–7 items, with "All Access" as a contrasting button.

## (2) Five anti-patterns to avoid

1. **Auto-play video above the article body** (Gators Wire). It slows the page, annoys readers on phones, and in this session it broke ("This Video Cannot Be Played").
2. **A permanent "SALE" banner and stacked network promos** (247: 50/60/75% off all season, plus CBS, StubHub and betting). It cheapens the product and trains readers to wait for a discount.
3. **A rail-first mobile layout** where commits, rankings and schedule widgets push the first story below the first screen (247, and partly On3).
4. **A rotating hero or slideshow with no editorial priority** (FloridaGators.com showed a diving story at the top in Texas week).
5. **Thin, repetitive SEO posts and duplicated story lists** (Gators Wire's daily "odds/predictions" variants; 247 repeating each story in 2–3 lists). Volume without voice is the opposite of what GatorBait's brand promises.
