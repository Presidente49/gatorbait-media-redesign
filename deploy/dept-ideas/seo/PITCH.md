# Gators Game Graph

Round two. The name survives because the idea now runs on a real audit and real code: an OpenRush audit of gatorbaitmedia.com (14 calls, evidence below), a generator that turns `gazette-live/posts.json` and `sports-live/scoreboard.json` into valid JSON-LD, ten passing shape tests, and the actual output files in this folder. Nothing live was touched.

## The idea

Give Google the entity layer it cannot find on gatorbaitmedia.com today. `deploy/dept-ideas/seo/structured-data.mjs` emits two things from feeds the site already refreshes:

1. **Homepage HEAD embed** (`out/homepage-embed.html`, 11,237 chars, under the 15,000-char Wix custom embed limit): one `@graph` with `NewsMediaOrganization` (GatorBait Media, founded 1980, sameAs YouTube/Facebook/X), `WebSite`, `SportsTeam` Florida Gators, the SEC, Ben Hill Griffin Stadium, a `CollectionPage` whose `ItemList` is the six newest stories with the newest Buddy Martin piece first, and an `ItemList` of all 12 season games as `SportsEvent` nodes. Each game carries the ESPN event id as `sameAs` (the same id Google shows in the "Florida Missouri football game" SERP), home/away teams, `eventStatus`, the final score for finals, kickoff and TV for announced games, and exactly one `subjectOf` story per game.
2. **Per-article `SportsEvent` tag** (`out/article-*.json`, about 1,500 chars each) for the 12 of 20 feed stories whose title names an opponent, shaped as a Wix `seoData.tags` script entry. It is a `SportsEvent`, not a second `NewsArticle`, because Wix already renders one and `docs/ARTICLE-PAGE-STANDARD.md` bans duplicates. The article stub inside it names the writer as a `Person` with the columnist tag URL, which is the authorship signal Wix's native tag lacks.

Rules in code, each covered by a test: no invented kickoffs (South Carolina Oct. 10 becomes a date-only `startDate` until ESPN carries a time); no story invented for a game the feed has not covered; Buddy Martin leads when he has a piece from the last seven days, otherwise newest-first; matching uses titles and URLs only after excerpts produced a false Texas match; output is script-safe and round-trips.

Run: `node deploy/dept-ideas/seo/structured-data.mjs` (writes `out/`), `node --test deploy/dept-ideas/seo/structured-data.test.mjs`.

## Why it matters

The audit says the site is technically healthy and entity-blind:

- On-page score **87.5**, 0 high issues (evidence 03). The problem is not broken pages.
- The homepage ranks for 24 keywords and the real ones are `gator bait and tackle`, `gator bait melrose`, `cast of gator bait` (evidence 05). Google reads the domain as bait shops and a 1970s film, not the Florida Gators.
- The served homepage HTML still leads with `<h1>Today's Edition</h1>` and the old shell copy; the Front Page 2026 renderer is injected by JavaScript (evidence 18). A HEAD JSON-LD embed is the one way to tell crawlers what the page is about without touching that shell, which is locked pending Brenden's approval.
- "Buddy Martin" returns a knowledge graph, the YouTube show, a drag racer and an obituary; no gatorbaitmedia.com URL (evidence 08). "Buddy Martin Gators" ranks the About page with a 2019 snippet, not a column (evidence 14). The `Person` node with the columnist URL is aimed at exactly that.
- "Florida Missouri football game" is owned by floridagators.com, ESPN event 401856708, ticket sites and a YouTube preview; GatorBait's Missouri preview (published Sept. 27) is absent (evidence 10). "Gators Missouri" produces an AI Overview about alligators (evidence 09). The `SportsEvent` nodes with the ESPN `sameAs` are how a publisher attaches its story to the game entity Google already uses.
- Demand is now: `florida football` 823,000 searches in Sept. 2025 against a 301,000 average; `florida gators football schedule` 301,000 in Sept. 2025 (evidence 12).
- AI Overviews already cite the site 7 times, mostly as a "gator blog" (evidence 11). Entity markup is the cheapest way to move from "a blog" to "the publisher describing this team and its games".

What it does not claim: markup makes the pages eligible for Event and richer article treatment and gives Google entity edges; it does not put GatorBait scores in Google's sports box and it does not fix the shell H1. Measurement is Search Console impressions for the SERP set above and the Rich Results Test on the live URLs; no traffic number is promised.

## Evidence

Condensed responses in `deploy/dept-ideas/seo/evidence/` (money columns and follower counts stripped). Full audit narrative with provenance in `audit.md`.

- `mcp__OpenRush__describe_capabilities` (ev. 01); `list_websites` (ev. 02): no Search Console connection, `get_search_performance` unavailable.
- `mcp__OpenRush__audit_site` domain `gatorbaitmedia.com`, max_pages 20 (ev. 03): 2,001 discovered, 20 audited, score 87.5, 0/3/7 issues, `multiple_h1` on 14 pages including `/`; crawl, observed 2026-09-30T05:14:25Z, confidence 0.9. Dataset resource id recorded in the file.
- `mcp__OpenRush__inspect_domain` (ev. 04): 132 keywords, 6 top-3, 18 top-10, recruiting category page at 12 to 16 on 2,900-volume queries.
- `mcp__OpenRush__inspect_page` homepage (ev. 05): 24 keywords, top terms bait-and-tackle. Buddy Martin article (ev. 06): 0 keywords 30 hours after publish.
- `mcp__OpenRush__inspect_serp` x5 (ev. 07, 08, 09, 10, 14): rankings, features and PAA as tabulated in `audit.md`; all live_serp, confidence 0.95.
- `mcp__OpenRush__inspect_ai_visibility` (ev. 11): 7 mentions, sample questions listed.
- `mcp__OpenRush__research_keywords` (ev. 12) and `discover_competitors` seed mode (ev. 13).
- `mcp__vidIQ_for_Claude__vidiq_keyword_research` (ev. 15): refused, "Not enough credits. This tool costs 5 credits..."; switched to OpenRush.
- `mcp__Wix__SearchWixRESTDocumentation` (ev. 16, 17): custom embed html max 15,000 chars; Item SEO Tags / Draft Post `seoData.tags` shape; the native NewsArticle tag seen in `deploy/writer-attributions/before/064b72aa-....json`.
- `mcp__TinyFish__fetch_content` live homepage HTML (ev. 18); `mcp__Exa__web_fetch_exa` (ev. 19, homepage copy stale, discarded).
- Code: `structured-data.mjs` (15,506 bytes), `structured-data.test.mjs` (8,373 bytes, 10 pass / 0 fail on Node 22), `out/` 15 files: `homepage-graph.json`, `homepage-embed.html`, 12 `article-*.json`, `index.json`.

## What it needs from Brenden

1. A yes to a new **HEAD custom embed on the homepage only** (`position: HEAD`, `category: ESSENTIAL`, page-filtered to `/`), created by Master Control through the Custom Embeds API with the exact contents of `out/homepage-embed.html`. Separate embed, so the Home Code loader `622d8ece` and the baseline lock are untouched; rollback is disabling that one embed.
2. A yes to adding the `SportsEvent` script tag to `seoData.tags` on game stories, starting with the Missouri preview and Buddy's column, through the same controller-owned Blog update path used for writer attributions. Wix's own NewsArticle tag stays.
3. A refresh owner: the generator runs after the scoreboard step in the existing feed workflow and commits `out/`; the controller PATCHes the embed once per game week (after the final; when a kickoff or TV is announced), not every five minutes.
4. Connect Search Console in OpenRush so the SERP set above can be measured instead of estimated.
5. Confirmation of the Buddy Martin lead rule (newest piece within seven days) and of the columnist tag URLs as the author profile pages.

## Risks

- Google decides what to show; this is eligibility and entity linking, not a guaranteed rich result.
- Event markup must describe events the page covers. The homepage visibly shows The Road Ahead schedule band and the stories, so the markup matches the page; keep it that way.
- Stale data is worse than none: a final left as scheduled or a wrong kickoff invites a manual action. The build refuses to emit a time ESPN has not carried, the validator fails the run on shape errors, and the PATCH is gated on the validated scoreboard.
- Wix served stale embed revisions for 30 to 45 minutes on Sept. 30; verify with the Rich Results Test on the live URL after each PATCH.
- Away venues other than the next game are omitted (the feed does not carry them), which limits Event eligibility for those games until the feed does.
- The served-HTML "Today's Edition" H1 remains a separate, approval-gated issue; this pitch does not fix it and should not be sold as if it does.
