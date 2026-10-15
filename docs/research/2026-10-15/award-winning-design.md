# GatorBait Media homepage redesign: design research

Date: 2026-10-15. This was read-only research, done with Firecrawl search and scrape (17 calls).

Labels used below:
- **[V]** means I checked it on a live page during this session.
- **[P]** means it comes from prior knowledge and I did not re-check it.
- **[U]** means it is unverified or a gap.

---

## 1. Recent award winners and honorees (2024-2026)

| # | Site | URL | Award | Status |
|---|---|---|---|---|
| 1 | The New York Times | nytimes.com | SND47 (2026) World's Best-Designed **Digital Presence**. Judges cited interactivity, personalization and "visual-first" stories. | [V] snd.org |
| 2 | The Pudding | pudding.cool | SND47 (2026) Best in Show (shared with WaPo). SND46 (2025) World's Best Designed, Digital. | [V] snd.org |
| 3 | The Washington Post | washingtonpost.com | SND46 (2025) World's Best Designed, Digital. 270+ SND awards. | [V] WaPo PR, snd.org |
| 4 | Politico Europe | politico.eu | SND46 (2025) World's Best Designed | [V] snd.org |
| 5 | ESPN | espn.com | Webby 2026 Honoree, Websites: Sports | [V] Webby gallery |
| 6 | The Players' Tribune | theplayerstribune.com | Webby Nominee, Sports websites, 2024 and 2026 | [V] |
| 7 | The Ring Magazine | ringmagazine.com | Webby 2026 Honoree, Sports (built by Huge) | [V] |
| 8 | CITIUS MAG (independent running media) | citiusmag.com | Webby **Winner** 2024, Sports websites (built by Butter Studio) | [V] |
| 9 | Bleacher Report | bleacherreport.com | Webby People's Voice 2024, Sports websites | [V] |
| 10 | The Dispatch | thedispatch.com | Webby People's Voice 2025, News & Politics websites (membership publisher) | [V] |
| 11 | Frame / The Trace | frame.media / thetrace.org | Webby Winner, News & Politics websites, 2025 / 2026 | [V] |
| 12 | The DONUT | (Webby entry) | Webby 2024 Winner, Independent Publishers | [V] Wikipedia list only |
| 13 | Jacksonville Today (Florida) | jaxtoday.org | 2026 OJA General Excellence, micro newsroom | [V] from an Instagram snippet only; I did not open the OJA page |
| 14 | Lando Norris (OFF+BRAND) | landonorris.com | Webby Winner and People's Voice 2026, Sports. It is a showcase site, not a news site. | [V] |

Gaps:
- **Awwwards and CSS Design Awards** media winners were not searched (budget). [U]
- **SPD digital** was not searched. [U]

**Best-fit takeaways for a small sports publisher.**
- CITIUS MAG is the closest analog: an independent sports outlet whose site won outright.
- The Players' Tribune and The Ring are good references for a magazine feel.
- The Dispatch is the strongest reference for a membership publisher.
- Jacksonville Today shows a Florida micro-newsroom winning on general excellence.

---

## 2. Homepage studies

### Defector (defector.com): employee-owned, subscription-funded sports blog [V, scraped]
- **Grid and hierarchy.** At the top is one huge lead with a full-bleed photo and an H2. Two secondary leads with photos follow. Then comes a text-only "Blogs of Note" rail (5 headlines with bylines) and a 4-up card row with a kicker category. After that, a tagline band reads "The last good website." Below it are repeating **section rails** (Arts & Culture, NFL, Podcasts, Science, MLB, Soccer, Politics, Crosswords, More, Advice). Each rail is 1 lead plus 3-4 stacked items, with a "See All Posts →" link.
- **Typography.** Headings use Neue Haas Grotesk Display, the UI uses DM Mono, and the variable display face is Degular. Body copy is about 20px and card H2 is about 24px. Headlines are big and bold; meta text is small mono.
- **Color.** Cream background `#F3ECE2`, black text, a single hot accent `#CA3000` for primary buttons, and mint `#D8EBD5` as a secondary. Buttons have a 4px radius.
- **Podcasts.** A dedicated "Podcasts" rail of square show art. Each show has a title and a "Listen on Apple Podcasts" link.
- **Conversion.** "Subscribe to skip ads" sits in the ad slot at the top and the bottom, so the ad itself becomes the upsell. The brand tagline band works as a values pitch. Comment counts on every card signal community, which is a members' perk.
- **Mobile.** Rails collapse to a single column; the lead image stays full-bleed. [P]

### The Ringer (theringer.com): sports and pop culture, podcast-first [V partial]
- **Stack.** Next.js with Tailwind. The font is GT America for everything (one family, weight-driven hierarchy). The accent is Ringer green `#00B112` on white with black text. Buttons and inputs are fully rounded pills (9999px). [V branding]
- **Structure.** "The Latest" feed with byline and "N min read", then "Noteworthy Reads", then Videos, then podcast show tiles. [V search excerpt]
- **The Dec 2024 redesign repositioned the homepage around podcasts.** The site was called "officially a podcast site" (Matt Domino, Substack, Dec 2024). Reddit users complained that the RSS feed was removed. [V]
- **Lesson.** Surfacing the show is right, but don't bury the writing or drop RSS.

### Rest of World (restofworld.org): nonprofit, design-led news [V branding only]
- **Type.** Sans headlines (Moderat) paired with **Georgia serif body paragraphs**. Mono (Input Mono) for meta.
- **Color.** Electric blue `#242EF7` primary, deep navy `#0B2566` square-cornered buttons (0 radius), and a pink accent `#FFBEF0`.
- **Structure.** The scrape did not return a usable layout. From prior knowledge: a large lead plus a clean card grid, with a newsletter signup inline mid-page. [P]

### On3 / Gators Online (on3.com/teams/florida-gators): direct competitor [V]
- **Lead and feed.** One lead (image plus headline, author, relative time "1h"), 2 secondary stories, then a long "Gators Online Headlines" text list with "View All →".
- **The video show is treated as a normal headline** ("Gators Online Show"), with no dedicated video module. **This is a gap GatorBait can beat** by giving The Buddy Martin Show a real hero slot.
- **Message-board teasers** show reply counts and "latest reply N minutes ago". That's a strong live-community signal.
- **Conversion.**
  - Offer: "60% off your first year, then billed annually"
  - Pitch: "One subscription: The best Florida Gators coverage and community…"
  - Button: "**Join Now**"
  - Email capture button: "**I'm game**", with a fan-voiced button label.

### The Athletic (nytimes.com/athletic): blocked [U/P]
Firecrawl does not support this site. From prior knowledge [P]:
- Team pages use a white or near-black UI and a serif headline face (Athletic's own).
- A scores strip runs across the top, then a lead story and a 2-column list.
- "Subscribe" is a persistent header button, and a paywall gate sits on the article, not on the homepage.
- Newsletters are offered per team.

### Axios (axios.com): blocked content [U/P]
The scrape returned no body. From prior knowledge [P]:
- Short "Smart Brevity" cards with bold lead-ins.
- Local newsletter signup modules with a single email field placed inline between story groups.

### Common patterns across the exemplars
1. **One clear lead story**, then 2-4 secondaries, then labeled rails.
2. **One sans family** carrying the hierarchy through weight and size. A mono or small-caps meta style is optional.
3. **A neutral background with one brand accent.** No rainbow sections.
4. **Media as a dedicated, labeled module** (Defector, Ringer), not mixed into the headline list (On3's weakness).
5. **Conversion placed in context.** "Subscribe to skip ads", a header button, and one inline email band mid-page. Not a pop-up wall.
6. **Community signals** such as comment and reply counts and relative timestamps.

---

## 3. Free, permissive templates and design systems

Licenses marked [V] were read from the GitHub API via Firecrawl Alexandria.

| Repo | License | Why it fits / how to adapt |
|---|---|---|
| github.com/TryGhost/Source | MIT [V] | Ghost's default theme, tagged magazine/news/newsletter. Its homepage has a lead, a card grid and a signup CTA band. The best single source to lift CSS patterns from. It uses Handlebars, so copy the CSS and HTML structure only. |
| github.com/TryGhost/Headline | MIT [V] | A **local news** theme with topic-section rails and a dense headline layout. The closest match to a Gators news homepage. |
| github.com/TryGhost/Casper | MIT [V] | The classic card grid (2.6k stars). Its responsive post-feed CSS is simple to port. |
| github.com/TryGhost/Edition | MIT [V] | A newsletter-first theme. Use it for the newsletter hero and signup band patterns. |
| github.com/TryGhost/Dawn | MIT [V] | A minimal newsletter or magazine theme. Its list-style feed is a good mobile pattern. |
| github.com/kevquirk/simple.css | MIT [V] | A classless base reset and typography (5k stars). It could seed embed base styles cheaply. |
| github.com/brennanbrown/newsprint | **NOASSERTION** on GitHub. The README says "MIT code, CC BY-SA content". [V] | An 11ty newspaper aesthetic. Confirm the LICENSE file before reuse. |
| css-tricks.com "Responsive Grid Magazine Layout in Just 20 Lines of CSS" | Snippet; license not checked [U] | The `repeat(auto-fit, minmax())` grid technique. Ideal for under 15k-character embeds. |
| Astro "Daily" newspaper template (astro.build/themes) | License not checked [U] | Uses Astro, Tailwind and Alpine, so it is heavy to port. Low fit. |

**Fit note for Wix embeds** (vanilla HTML/CSS/JS, under 15,000 characters each, Barlow only):
- Do not port whole themes. Take the **layout CSS** (grid, card, rail, CTA band), swap the fonts for Barlow and Barlow Condensed (or Barlow at weights 400/600/800), and write it as small, separate embeds:
  - hero
  - show module
  - rails
  - CTA band
- Ghost themes are the cleanest, MIT-licensed source.
- Keep each embed's CSS scoped under one class prefix (for example `.gb-`) to avoid Wix collisions.

---

## 4. Design brief: GatorBait homepage

### Recommended layout pattern: "Lead + Show + Rails"
1. **Top bar.** Logo, sections, and a persistent orange "Join" button. A slim scores and next-game strip (opponent, date, TV) is optional.
2. **Lead package.** One big story on the left (16:9 image, H1) with 3 stacked secondary headlines on the right. On mobile: the image, then the H1, then a 3-item list.
3. **The Buddy Martin Show module.** A dark blue band showing tonight's or the latest episode thumbnail with a play affordance, "Live nightly at [time]" (to be confirmed), and links to YouTube and podcast apps.
4. **Latest feed.** A 3-up card grid (1-up on mobile) with a kicker, headline, byline and relative time.
5. **Newsletter band**, placed mid-page after about 6 stories. One email field and a fan-voiced button.
6. **Section rails.** Football, Basketball, Recruiting, Columns. Each rail is 1 lead plus 3 list items and "All Football →".
7. **Magazine module.** Cover image, issue title and a "Read the issue" button.
8. **Membership band.** Benefits in 3 bullets, a price, and "Join GatorBait".
9. **Footer.** Sections, show links, newsletter and social.

### Type scale (Barlow only; 1.25 ratio, 16px base, mobile then desktop)

| Token | Mobile | Desktop | Weight / style |
|---|---|---|---|
| display/H1 (lead) | 32px | 48px | 800, line-height 1.05, tight tracking (-0.01em) |
| H2 (section / module title) | 24px | 32px | 700, uppercase optional for rail labels |
| H3 (card headline) | 19px | 22px | 700, line-height 1.2 |
| body/dek | 16px | 18px | 400, line-height 1.5 |
| meta/kicker | 12px | 13px | 600, uppercase, letter-spacing 0.06em |
| button | 15px | 16px | 700 |

### Components
- Header with a Join CTA
- Score/next-game strip
- Lead story
- Secondary headline list
- Story card (image, kicker, headline, byline, time)
- Show module (video thumbnail with play button and platform links)
- Section rail
- Newsletter band
- Magazine cover card
- Membership band
- Comment/reply-count chip, optional
- Footer

### Top 8 principles
1. One lead story per screen; hierarchy comes from size, not decoration.
2. One font (Barlow) carries all hierarchy through weight and size.
3. Neutral base (white or off-white, near-black text), Gator blue for structure, orange only for actions.
4. The nightly show gets its own labeled, dark module. Never bury it in the feed (On3's gap).
5. Each conversion ask appears once, in context: header Join, a mid-page newsletter band, and a membership band. No pop-up walls.
6. Every card shows a kicker, byline and relative time. Freshness and people build trust.
7. Mobile-first single column with 16px gutters and tap targets of 44px or more; images keep 16:9 or 3:2.
8. Small scoped embeds (each under 15k characters, `.gb-` prefix), so each module ships, rolls back and is tested independently.

### Unverified items to confirm before the build
- The Athletic and Axios details are from memory (both scrapes were blocked).
- Rest of World layout is from memory.
- Awwwards, CSSDA and SPD were not searched.
- The newsprint license is unclear.
- The Buddy Martin Show air time and platforms were not checked here.
