# Backlinks audit and plan — Nov. 3, 2026

Read-only. Nothing live was changed, no one was contacted, nothing was bought. Drafts at the bottom are **not sent**.

## 1. Where we stand (numbers + source)

Source: OpenRush backlink index and search index, pulled 2026-11-03 15:26 UTC.

| Metric | Value |
|---|---|
| Domain rank (0-1000) | **130** |
| Referring domains | **89** |
| Total backlinks | **296** |
| Dofollow share | **36%** |
| Spam score | 13 (low-moderate) |
| Broken inbound links | 6 |
| Organic keywords (US) | 144 (21 in top 10, 8 in top 3) |
| Est. organic visits/month | ~489 (model estimate, not GA4) |

**What the 89 referring domains really are (my read of the full list):**

- **About 43 are spam** (spam score 50+): link-seller pages, URL shorteners, casino/pharma sites, Cloudflare `pages.dev` and `wixsite.com` throwaways. 28 domains use one identical anchor, "High Quality Dofollow Backlinks ... Premium PBN Network Service gatorbaitmedia.com ...". That is someone's link-selling spam using our name, not something we bought. Google mostly ignores this kind of link.
- **About 15 are podcast directories** (player.fm, podcastplayer.com, ivy.fm, castbox, podyssey, toppodcast, mypodcastdata, libsyn, TuneIn). They all copy the podcast RSS feed's website field, so fixing the feed fixes all of them at once.
- **The real editorial links are few:**
  - **muckrack.com**: 11 links to our stories, dofollow (our outlet page).
  - **sidelinecoverage.com**: 146 links, a fan forum thread ("Florida team notes") that reposts our stories. Nofollow, but it sends readers.
  - **saturdaydownsouth.com**: dofollow citation of Buddy's Urban Meyer interview, anchor "Gator Bait Media's Buddy Martin". This is the model for item 9.
  - **wruf.com**: 2022 dofollow citation of our Napier story.
  - **Wikipedia**: the Shane Matthews article cites our story (plus wikiwand, wiki2 and yoda.wiki mirrors). The cited URL returns 200.
  - **journalistdb.com**: Carlton Reese and Philip Glassman bios, dofollow.
  - **si.com**, **yoursun.com**, **gatorchatter.com**, **xstalk.com**, **feedspot.com** (Florida Gators blogs list, nofollow), and the nbot.ai and dlvr.it aggregators.
- **Most-linked pages:** the homepage (about half of the sampled links, including 8 with a Facebook `fbclid` tracking string, from Shane Matthews' PodUp feed), then individual `/post/` stories, mostly through the forum and Muck Rack. Nothing links to `/the-buddy-martin-show` or `/magazine`.
- **Junk on our own site:** four spam Wix member profile URLs (for example `/profile/Uv-Deluxe-Maya-2016-Crack/profile`) are being linked by spam sites. One already 404s; I could not check the others because Wix rate-limited me.

**Competitor gap: not run (blocked).** OpenRush ran out of credits (HTTP 402) after the profile pull. vidIQ was also out of credits. I did not refill either. Verified competitor domains for the re-run: `alligatorarmy.com` (SB Nation, the biggest keyword overlap) and `gatorsbreakdown.com`, both returning 200. On3 and 247Sports are subfolders of national sites, so a domain-level gap against them would be meaningless. Re-run once credits are restored (about 40 credits):
`compare_backlink_gap(domain="gatorbaitmedia.com", competitors=["alligatorarmy.com","gatorsbreakdown.com"], min_competitors=1)`

**An honest limit:** links from social bios, YouTube and sponsor pages are usually nofollow or sponsored. They help readers find us and help Google connect the brand, but they pass little ranking weight. Real ranking weight comes from editorial citations (section 3).

## 2. Top 10 quick wins (ranked by effort vs. impact)

| # | Win | Effort | Impact | Needs |
|---|---|---|---|---|
| 1 | **Fix the podcast RSS feed website link and restart the feed.** The SoundCloud feed behind Apple Podcasts (id1321645302) has `<link>http://GatorBaitMedia.com</link>`, and its last episode is **May 24, 2023**. About 15 directories copy this field. | 10 min | High: one fix updates ~15 directories, several of them dofollow | SoundCloud login |
| 2 | **Claim Muck Rack** for the outlet page and create free profiles for Buddy, Franz and the other writers, each linking to their GatorBait author page. Muck Rack already gives us 11 dofollow links. | 30 min | Med-High | New Muck Rack accounts (free) |
| 3 | **Meldon Law sponsor link.** Their "Podcast and Radio" page and Community page do not mention us. They already link out to other partners (Pace Center for Girls, Catholic Charities), so there is precedent. | 1 email | Medium: local, relevant law-firm site in Gainesville. Likely tagged sponsored, which is fine. | Brenden sends |
| 4 | **Ask Shane Matthews (PodUp) to clean his link.** His show descriptions link to `gatorbaitmedia.com/?fbclid=...`, a tracking URL. Ask for the clean URL plus a link on podupwithshane.com. | 1 text | Low-Med | Brenden sends |
| 5 | **Google News Publisher Center** (already on Brenden's list). Submit the publication and the sections feed. | 30 min | Medium (discovery, not a backlink) | Google account |
| 6 | **Buddy's author bios.** Update his Amazon Author Central page and his publisher bios (St. Martin's for *Urban's Way*, Sports Publishing for *The Boys from Old Florida*) to name "Editor-in-chief, GatorBait Media" and link `https://www.gatorbaitmedia.com/about`. | 30 min + 2 emails | Medium: book pages are high-authority sites | Amazon login; Brenden sends |
| 7 | **Fix the X bio for @buddyshow.** It now reads "Subscribe on You Tube the Buddymartinshow Read us @http://GatorBaitMedia.com." | 5 min | Low (nofollow), cleaner brand | X login |
| 8 | **Spam member profiles.** Review Wix Members and remove spam accounts like "Uv-Deluxe-Maya-2016-Crack" so these URLs return 404. A disavow file is optional and low priority. | 20 min | Low-Med: hygiene, so spam stops pointing at real pages | Wix dashboard. This deletes live content, so it needs Brenden's yes. |
| 9 | **Pitch quotable exclusives to SEC aggregators.** Saturday Down South already cited Buddy once. Send their tips desk each Buddy exclusive with a quote, such as a coach or legend interview. | 1 email per exclusive | High per hit: dofollow editorial links | Brenden or the desk sends |
| 10 | **YouTube About link.** The link is titled "Gator Bait Media" and points to `www.GatorBaitMedia.com`. Retitle it "GatorBait Media" and set `https://www.gatorbaitmedia.com/`. Video descriptions are already good: 15 of the 15 latest link to the site. | 5 min | Low (nofollow) | YouTube Studio |

## 3. Owned-profile fix list (exact URL to put where)

| Profile | What I found (public read, Nov. 3) | Status | Put this |
|---|---|---|---|
| YouTube @TheBuddyMartinShow (UCtR8b1sKFuwaRjKy5BiXRvA): About links | Facebook, X, "Gator Bait Media" → www.GatorBaitMedia.com, Instagram, merch store | Minor fix | Title "GatorBait Media", URL `https://www.gatorbaitmedia.com/`. Add a second link "Watch & listen: The Buddy Martin Show" → `https://www.gatorbaitmedia.com/the-buddy-martin-show` |
| YouTube channel description | "...Buddy's column: https://gatorbaitmedia.com" (no www, so it redirects) | Minor fix | `https://www.gatorbaitmedia.com/` |
| YouTube video descriptions | The 15 latest (RSS feed) all link to gatorbaitmedia.com; several link to the matching story | OK | Keep the template. Prefer the story URL over the homepage when one exists. |
| Apple Podcasts "The Buddy Martin Show" (SoundCloud feed `soundcloud:users:8482146`) | Feed `<link>` = `http://GatorBaitMedia.com`; last episode May 24, 2023 | **Wrong + stale** | Feed website: `https://www.gatorbaitmedia.com/the-buddy-martin-show`. Restart audio episodes or move the show to a host that is updating. |
| player.fm, podcastplayer.com, ivy.fm, TuneIn, castbox, podyssey | All copy the feed above | Fixed by row above | No separate action |
| Spotify | Not verified (no public check possible) | Unknown | Brenden: confirm in Spotify for Creators that the show exists and the website field is the URL above |
| X @buddyshow | Bio: "...Read us @http://GatorBaitMedia.com." Website field could not be read without login. | **Wrong format** | Website field: `https://www.gatorbaitmedia.com/`. Bio: "Florida Gators talk with Buddy Martin. Live on YouTube Mon-Thu 9 PM ET. Read: gatorbaitmedia.com" |
| Instagram @gatorbaitmedia | Bio link → gatorbaitmedia.com/magazine | OK | Optional: `https://www.gatorbaitmedia.com/` or keep /magazine while the issue is fresh |
| Facebook /thebuddymartinshow and GatorBait page | Login wall, could not read | Unknown | Website field: `https://www.gatorbaitmedia.com/` (show page: `/the-buddy-martin-show`) |
| Buddy Martin: Amazon Author Central, publisher bios | No GatorBait link in the bios I found | **Missing** | `https://www.gatorbaitmedia.com/about` |
| Franz Beard | No outside bio found; only GatorBait pages | **Missing** | Muck Rack profile → his category page `https://www.gatorbaitmedia.com/gatorbait-media-blogs/categories/franz-beard-blog` |
| Muck Rack outlet "gatorbaitmedia" | Exists, 11 dofollow story links | Claim it | Outlet URL `https://www.gatorbaitmedia.com/` |
| journalistdb (Carlton Reese, Philip Glassman) | Link `https://www.gatorbaitmedia.com/` | OK | No action |

Use one form everywhere: `https://www.gatorbaitmedia.com/`. The apex and http versions redirect correctly, but consistent URLs are cleaner.

## 4. Earned-link targets (legitimate only)

| Target | Why it fits | Page that should get the link | The ask |
|---|---|---|---|
| **Meldon Law** (meldonlaw.com/podcast, /community) | Sponsor of Meldon Law Mondays; a Gainesville firm; already lists radio and podcast partners | `/the-buddy-martin-show` | Add "Meldon Law Mondays on The Buddy Martin Show" with a link. Sponsored tag is fine. |
| **WRUF** (wruf.com) | UF's station; already cited us in 2022 | The specific story they cite | Offer Buddy as a guest or commentator and tip their desk on stories they can cite. No link request. |
| **Mainstreet Daily News, Gainesville Sun, WCJB TV20, The Independent Florida Alligator** | Gainesville local news | `/magazine` (new issue) or a story | Press note on the magazine issue or a newsworthy exclusive. They link if they cite it. Offer Buddy as an expert source. |
| **Saturday Down South, SI's Florida site (si.com/college/florida), Sportspyder** | SEC and team aggregators; SDS has cited Buddy before | The exclusive story URL | Send exclusives with a ready quote and a link. Ask Sportspyder to add our RSS feed. |
| **Google News Publisher Center** | Already on Brenden's list | Whole publication | Submit. This brings discovery, not a backlink. |
| **Shane Matthews / PodUp** | Partner show already linking (with a tracking URL) | `/` or `/the-buddy-martin-show` | Clean the link and add one on podupwithshane.com |
| **Book publishers** | High-authority author pages | `/about` | Update Buddy's bio line |
| **Wikipedia** | Already cited on Shane Matthews | Keep `/post/shane-matthews-the-underdog-turned-under-appreciated` live; never change its slug | **No editing by us.** At most, a disclosed suggestion on an article's Talk page, and only where a GatorBait story is a genuine primary source, such as an original interview. |
| **UF-adjacent:** UF Alumni Association, Gator Club newsletters | Fan audience | `/magazine` | Ask to list the magazine as an independent Gators read. To verify: whether they accept non-UF media. |

**Not doing:** paid links, PBNs, link exchanges, guest-post farms or spam directories. The existing spam links are not ours, and we should not reply to any "buy backlinks" offers.

## 5. Draft outreach (NOT sent; for Brenden to send)

**A. Meldon Law (to the marketing contact Brenden already works with)**
> Subject: Meldon Law Mondays: adding us to your Podcast & Radio page
>
> Hi [name], thanks again for backing Meldon Law Mondays on The Buddy Martin Show. One small ask: could you add the show to your Podcast & Radio page (meldonlaw.com/podcast) or the Community page, with a link to https://www.gatorbaitmedia.com/the-buddy-martin-show? It helps your listeners find the Monday show live. Happy to send a logo and a one-line description. Brenden

**B. Shane Matthews (text)**
> Shane, quick one: the GatorBait link in the PodUp show description has a Facebook tracking tail on it (?fbclid=...). Could you swap it for https://www.gatorbaitmedia.com/ and, if you have room, add it on podupwithshane.com? Glad to return the favor on our side. Brenden

**C. WRUF / local news tip (per exclusive)**
> Subject: Exclusive: [headline] (free to cite)
>
> [Name], GatorBait Media published [one-line news fact] today: [story URL]. Buddy Martin is available for a quick on-air comment or a quote. You're free to cite with a link. Brenden Martin, GatorBait Media

**D. Saturday Down South / SI Florida tips desk (per exclusive)**
> [Name], Buddy Martin (GatorBait Media) interviewed [person]. Key quote: "[quote]". Full story: [URL]. Free to aggregate with attribution and a link. Brenden

**E. Publisher bio update (St. Martin's, Sports Publishing)**
> Hello, I'm writing for author Buddy Martin (*Urban's Way*, *The Boys from Old Florida*). Could his author bio be updated to: "Buddy Martin is editor-in-chief of GatorBait Media (https://www.gatorbaitmedia.com/about) and host of The Buddy Martin Show." Thank you. Brenden Martin

## 6. What needs Brenden's logins or decisions

- **Logins:** SoundCloud (podcast feed), Spotify for Creators (check the listing), YouTube Studio, X @buddyshow, the two Facebook pages, Amazon Author Central, Muck Rack (new free accounts), Google News Publisher Center.
- **Decisions (his call):**
  - Removing spam member profiles deletes live content.
  - Whether to refill OpenRush credits for the competitor gap (about 40 credits). This is spending.
  - Sending the outreach notes. Each send is his.
