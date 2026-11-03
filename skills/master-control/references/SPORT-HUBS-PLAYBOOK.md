# Sport hubs, staff pages and fast shipping: the playbook (Nov. 3, 2026)

Owner direction (Brenden, Nov. 3): "do all the things that are working again, just with a different sport"; sections should be designed pages with rosters copied from floridagators.com, not just a feeder; a nice writers page that leads to an About Us page; "I liked how swiftly things got up today." This file is how that speed was reached and what not to repeat. Read it before building or changing any section page, hub, roster, staff page, or an API-created post.

## 1. The pattern that works (widget + loader embed)

1. One vanilla-JS widget file under `sports-live/src/` (styles embedded, ASCII-escaped build) plus a small build script in `tools/<name>/`, bundle in `sports-live/<name>-widget.js`. Reference implementations: `roster.js`, `show.js`, `basketball.js`, `news-paper.js`.
2. A tiny loader embed (about 1 KB) that adds one script tag pinned to an immutable jsDelivr commit SHA (full 40 hex). Template: `deploy/roster-20261102/loader.template.html`. One new embed per module; ESSENTIAL, HEAD, `loadOnce:false`; never grow an existing embed near the 15,000-character cap.
3. No new Wix pages can be created from the API. Mount on an existing route (a page that already exists, or the blog category route as a header module above the News Wire list). Tell Brenden which blank page to add if a clean URL is wanted; only the route regex changes afterward.
4. Hide the host content with `html:has(#your-root)` rules; never delete Wix nodes. Always fall back to the native content if the widget fails.

## 2. Ship mechanics (every time)

- Post the scope in issue #34 BEFORE the live write; evidence and rollback after. One production writer per object.
- Branch from `origin/main`, build, PR, merge with merge_method `merge` (not squash) so the pinned SHA stays reachable.
- Verify the jsDelivr copy's sha256 equals the local build. `cdn.jsdelivr.net` once returned 403 "Package size exceeded" for a fresh commit; `fastly.jsdelivr.net` and `gcore` served the identical bytes, so a loader may use the host that serves it.
- Create/patch the embed with a fingerprint check (exact replace count, current revision, category ESSENTIAL re-sent). Patch your own embed; never another owner's.
- Verify live at 390, 430, 1366, 1920 with cache-busting, then run a layout-shift trace at 390 (PerformanceObserver `layout-shift`; target total under 0.1 after load). Chromium in this container cannot test iOS Safari; say so.
- About one in three cold loads in this container falls back to the native page because the proxy returns 429/502 on jsDelivr or ESPN. Retry before calling it a bug.
- Rollback is `enabled:false` on the new embed.

## 3. Data sources for hubs and rosters

- Football and basketball: ESPN JSON. From a shell `site.api.espn.com` works; from a BROWSER inside this container only `https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=<s>&league=<l>` works (CORS `*`). Live score feed: poll every 30 s only while a game is live or within 90 minutes of tipoff.
- Other sports and the official roster layout: floridagators.com (Firecrawl `firecrawl_scrape`, credits are limited: one scrape per roster page, cache the JSON in the repo, refresh by PR). Roster columns to copy: photo, number, name, position, class, height, weight, hometown/high school, previous school. Link headshots from the sidearm/cloudfront host with alt text and a footer credit; do not re-host UAA photos.
- UAA photos need the credit in `docs/PHOTO-ATTRIBUTION.md` (alt text plus a visible closing line with links).
- Never invent a roster, rank, record, bio or date. Missing bios go on a list for Brenden.

## 4. Design rules Brenden has set

- Navy and white with a thin orange accent; he called the site "way too orange". Barlow / Barlow Condensed; Barlow-only was lifted on Nov. 3 for restrained newspaper accents.
- No pop-ups, no heavy lightboxes, no seven-day-trial copy until he decides trial length (pricing is his call). The /magazine lightbox was built, shipped and rolled back the same day: "flashy, oversized on mobile, competing with another." A thin dismissible bar is the maximum.
- Nothing may move after first paint: preload data before the first render, reserve space, update text in place (never remove and re-insert ticker items or strips on a timer), insert a late element once after the header has settled.
- Anything fixed or sticky must sit under the Wix dialog layer (login dialog z-index 100002) or hide with `visibility:hidden` while a `[role=dialog]` is open.

## 5. API-created posts (the recap/live-show pattern)

- Set the cover with BOTH the media id and url (`media.wixMedia.image:{id,url,width,height}`) plus `altText`. A cover given only by url ships with no `og:image` and no article-schema image. After publishing, fetch the post with a Googlebot user agent and confirm `og:image` exists.
- Query recent posts first to avoid a duplicate. Staff copy is bylined GatorBait Staff (member fade11f0). Stats from ESPN/FloridaGators.com only; no quotes without a full transcript.
- Edit a published post with PATCH + fieldMask then `/publish`; the native new-post automation (e4ff0da9) is the only push/email.
- Headlines for straight news name the player or opponent in plain words (Search Console showed game-stat and name searches are the missed clicks).

## 6. Time-critical routines

Scheduled routines wake the session as notifications. The 8:58 p.m. show post was missed by 37 minutes because the session was busy. Between tool bursts call `ReadNotifications`; a time-boxed routine (show post, game final) runs before any other work.

## 7. Parallel work

Use subagents only for independent objects with a named owner each (one embed, one page). Give each the exact ship mechanics above and a rule not to touch anyone else's embed. Do not launch parallel `isolation: worktree` agents in the same call (one failed to create its worktree); stagger them. Avoid sharing one checkout between agents (branch switches landed commits on the wrong branch).
