# Wix load inventory — gatorbaitmedia.com (site 18fb3a4e)

Read-only audit, 2026-09-30. No Wix writes were made. Source of truth: live Wix REST
reads (Custom Embeds, Marketing Tags, SEO Redirects, App Installer, Blog Posts) plus the
repo copy of the GitHub-served bundles at `main` HEAD 4089fb2. Everything marked
**[verified]** came from a live read or the checked-in file; **[guess]** is inference.

Endpoints used (all GET or read-only POST):
`GET /embeds/v1/custom-embeds` (+ `?paging.cursor=` for page 2), `GET /marketing/v1/tags`,
`GET /seo-redirects-service/v1/redirects`, `GET /apps-installer-service/v1/app-instances`,
`GET /blog/v3/posts?paging.limit=10`. `POST /consent/consent-config/v1/site-apps-and-storage`
returned 403 (see section 2/3).

---

## 0. Headline numbers [verified]

| Metric | Value |
|---|---|
| Custom embeds on the site | **58** (50 on page 1 + 8 on page 2 of the API) |
| Enabled | **28** (24 HEAD-ish incl. 20 HEAD + 8 BODY_END) |
| Disabled (dashboard clutter, not served) | 30 |
| `pageFilter` on any embed | **none** — every enabled embed is injected into **every page** |
| Inline characters injected per page (all 28 enabled) | **219,233 chars** (HEAD 177,130 / BODY_END 42,103) |
| Of that, actually *active* on the homepage (JS runs / CSS applies) | ~109,100 chars in 14 embeds |
| Of that, actually *active* on a /post/ page | ~87,100 chars in 16 embeds |
| Dormant-but-injected on homepage (route-gated code) | ~110,100 chars |
| External bundle on homepage: `sports-live/homepage.js` | **244,409 bytes raw / 68,832 gz** (repo file, Sep 30) |
| External bundle on /post/: `sports-live/share.js` | **64,875 bytes raw / 21,105 gz** |
| Blog posts | 4,579 |
| Redirect rules | 100 (exact-match, 0 group) |
| Marketing tags (Wix "tracking tools") | 2 enabled: Google Tag Manager, Facebook Pixel |
| Installed app instances | 112 rows (~107 unique app IDs) |

Note on "chars": Wix serves the HTML compressed, so wire bytes are lower, but the
browser still has to **parse ~177 KB of inline `<head>` CSS/JS before first paint**.
That is the single most important number in this report.

---

## 1. Custom code embeds

### 1a. Enabled embeds (28) [verified from live read]

Legend: pos = HEAD / BODY_END (Wix has no "body start" embed on this site). loadOnce =
Wix "load once per session" flag. "Runs on" = where the JS/CSS actually takes effect
(from the route guard in the code); *injected* everywhere regardless. MO = MutationObserver;
"subtree" = observes the whole document with `subtree:true` (costly on a Wix page).

| id | name | loadOnce | pos | cat | chars (css/js) | Runs on | External loads | Timers / observers | What it is |
|---|---|---|---|---|---|---|---|---|---|
| 78a9b413 | GA4 Analytics - LIVE | once | HEAD | ANALYTICS | 236 (0/150) | all | `googletagmanager.com/gtag/js` **async** | — | Stock GA4 gtag snippet (G-9LPC…). |
| 5a43ae83 | GBM - Site Fixer v7.2 (no street address) | every | HEAD | ESSENTIAL | 10,410 (0/10,409) | all | — | 1 MO **subtree** | Organization JSON-LD (NewsMediaOrganization) + sitewide DOM fixes. |
| 7fee4de6 | GBM - Compact Optimized Logo + Header v12 | every | HEAD | ESSENTIAL | 13,880 (0/13,880) | all | wixstatic logo webp | 3 MO | Our custom header; injects its own `<style>` from a JS string, hides `#SITE_HEADER`. |
| c66d5b7f | GBM - Light Theme v1 | every | HEAD | ESSENTIAL | 3,528 (3,528/0) | all | — | — | CSS variable overrides (light palette). |
| 602fb362 | GBM - Sports Feed Cards v11 | every | HEAD | ESSENTIAL | 9,586 (9,586/0) | feed pages via `:has()` | — | — | Pure CSS restyle of the native Wix Blog feed. |
| 1dd74333 | GBM - Magazine Live Issue v9 | every | HEAD | ESSENTIAL | 14,918 (7,824/7,093) | JS: /magazine; CSS: all | wixstatic | — | Magazine cover-first page. |
| fdc2127a | GBM - Sports Home v4 core (fully Wix-served) | every | HEAD | ESSENTIAL | 14,152 (5,657/8,444) | homepage | wixstatic | 2 MO | Homepage shell / prepaint guard; hides native header+pages via `html:has(#gbm-gazette-bundle)`; calls `__GBM_HOME_PART__` → Home Code. |
| af338ad4 | AdSense Verification | every | HEAD | ADVERTISING | 310 (0/309) | all | — | — | **No-op**: `return;` on line 1 (ads OFF per Brenden Sept 29). Loads nothing. |
| 1255a4cf | GBM - Home Styles v1 (Wix-served) | every | HEAD | ESSENTIAL | 14,900 (14,780/70) | homepage (CSS keyed on `#gbm-live.gbm-gazette`) | — | — | 14.8 KB homepage stylesheet, inline, on every page. |
| 96ef5a04 | GBM - Home Backup Stories v1 (game-day band) | every | HEAD | ESSENTIAL | 13,308 (4,736/8,524) | **no route guard found** | 6 wixstatic imgs, 6 post URLs | setInterval (status refresh of `#gbm-gd`) | Game-day band + hard-coded 6-story backup list (Ole Miss week). |
| 622d8ece | GBM - Home Code v1 (Wix-served) | every | HEAD | ESSENTIAL | 1,063 (0/977) | homepage (invoked by fdc2127a) | `presidente49.github.io/…/current.json` (fetch, `cache:'no-store'`) → `cdn.jsdelivr.net/gh/…@<commit>/sports-live/homepage.js` **async** | 800 ms fallback timer | Two-hop loader: pointer JSON then 244 KB bundle. |
| a13b04e3 | GBM - Inner Page UI Layer v1 | every | HEAD | ESSENTIAL | 13,706 (0/13,659) | all | — | 1 MO **subtree** | Modals (news alert / account), sitewide UI CSS held in a JS string. |
| 14a887e3 | GBM - Post template v1 | every | HEAD | ESSENTIAL | 14,770 (10,986/3,784) | /post/ | `@font-face` Barlow Condensed 800 from **cdn.jsdelivr.net/npm/@fontsource** (`font-display:optional`) | — | Article page design. |
| 53e15504 | GBM - Latest page v1 | every | HEAD | ESSENTIAL | 13,304 (6,143/7,134) | blog feed (/gatorbait-media-blogs) | google.com/search link | setInterval **60 ms** (≤4 s) + 1 MO **subtree** | Multi-column "Latest" front. |
| c91ad133 | GBM - Post formatting normalizer v1 | every | HEAD | ESSENTIAL | 5,558 (2,453/3,074) | /post/ | — | 1 MO **subtree** | Cleans spacer paragraphs / all-bold. |
| a5452619 | GBM - Post wide canvas v1 | every | HEAD | ESSENTIAL | 1,543 (331/1,210) | post-page (CSS-keyed) | — | 1 MO **subtree** | Full-width article column on phones. |
| 756655cf | GBM - Florida Football Stats v1 | every | HEAD | ESSENTIAL | 12,997 (4,621/8,279) | /florida-football-stats | — | — | Stats page; data baked in. |
| 360c9265 | GBM - Permanent Football Roster and Schedule Links | once | HEAD | ESSENTIAL | 5,457 (2,516/2,939) | all (mounts where target exists) | — | 1 MO **subtree** | Roster/schedule link block. |
| f285a38c | GBM - Share GatorBait v1 (story pages) | every | HEAD | ESSENTIAL | 1,003 (0/911) | /post/ only | `current.json` (no-store) → `cdn.jsdelivr.net/…/share.js` **async** | 800 ms fallback | Share button + Story Kit loader (65 KB). |
| 1261f2b9 | GBM - Gators Game Graph v1 (homepage JSON-LD) | every | HEAD | ESSENTIAL | 12,501 (0/12,446) | homepage (`pathname!=='/'` → return) | — | — | 12 KB of JSON-LD built by JS; injected on every page, executed on `/`. |
| 82c4ca83 | GBM - TV + News Images v9.1 | every | BODY_END | ESSENTIAL | 11,056 (4,120/6,934) | media-hub route (guarded) | **youtube.com** + **i.ytimg.com** (dynamic `.src`) | — | Broadcast/TV hub with YouTube loads. |
| 5ab10e7b | GBM - FB Pixel ViewContent (articles) v1 | every | BODY_END | ADVERTISING | 557 (0/557) | /post/ | — | polls for `fbq` 25 × 400 ms (≤10 s) | Fires FB `ViewContent`. |
| 4d3ab24a | GBM - News SEO (NewsArticle + keywords) v1 | every | BODY_END | ESSENTIAL | 6,495 (1,068/5,427) | /post/ | — | setInterval **250 ms** ≤60 tries (≤15 s) | Builds NewsArticle JSON-LD + hides avatar. |
| f8b950c9 | GBM - Universal Utility Footer v13 | every | BODY_END | ESSENTIAL | 5,282 (2,607/2,675) | all | — | — | Our footer; hides `#SITE_FOOTER`. |
| fb8963cc | GBM - Policies & Compliance v1 | every | BODY_END | ESSENTIAL | 9,841 (2,430/7,410) | /policies (guarded) | — | 1 MO **subtree** | Legal page layout + text. |
| 0709a98e | GBM - Sitewide Barlow Typography v1 | every | BODY_END | ESSENTIAL | 401 (0/0) | all | `<link rel=stylesheet>` **fonts.googleapis.com** (Barlow 400/500/700/800) + **cdn.jsdelivr.net/gh/…@a4b4648/assets/sitewide-type.css**; 2 preconnects | — | Two external stylesheets; `<link>` in body_end = not first-paint-blocking but fires FOUT/re-layout. |
| 59e31550 | GBM - Keep Reading v1 (article end, 3 newest) | every | BODY_END | ESSENTIAL | 3,981 (1,388/2,593) | /post/ | fetch **`/blog-feed.xml`** on every article view | — | "Keep reading" 3 newest. |
| 78528a4b | GBM - Pricing Terms Note v1 | every | BODY_END | ESSENTIAL | 4,490 (1,422/3,068) | pricing plans page | — | 1 MO | Renewal/trial/cancel note. |

Verification against the brief: 622d8ece, 7fee4de6 (13,880), f8b950c9 (5,282), f285a38c,
1dd74333, c66d5b7f, 5a43ae83, fdc2127a, 96ef5a04, 756655cf, a13b04e3 all exist, are
enabled, and match the sizes stated. Additional enabled embeds not in the brief: 78a9b413,
602fb362, af338ad4, 1255a4cf, 14a887e3, 53e15504, c91ad133, a5452619, 360c9265, 1261f2b9,
82c4ca83, 5ab10e7b, 4d3ab24a, fb8963cc, 0709a98e, 59e31550, 78528a4b (17 more).

### 1b. Totals by page (enabled embeds only) [verified counts; "active" classification is by route guard]

**Homepage `/`** — injected: all 28 = **219,233 chars**. Active (JS runs or CSS applies):
78a9b413, 5a43ae83, 7fee4de6, c66d5b7f, fdc2127a, af338ad4, 1255a4cf, 96ef5a04, 622d8ece,
a13b04e3, 360c9265, 1261f2b9, f8b950c9, 0709a98e = **~109,134 chars**, plus the external
**homepage.js 244 KB (69 KB gz)** and its follow-on fetches (see 1c). Dormant but parsed:
~110 KB (Magazine, Post template, Latest, normalizer, wide canvas, stats, Share, TV hub,
FB pixel, News SEO, policies, Keep Reading, pricing, feed-cards CSS).

**Story page `/post/…`** — injected: **219,233 chars**. Active: 78a9b413, 5a43ae83,
7fee4de6, c66d5b7f, af338ad4, a13b04e3, 14a887e3, c91ad133, a5452619, 360c9265, f285a38c,
5ab10e7b, 4d3ab24a, f8b950c9, 0709a98e, 59e31550 = **~87,117 chars**, plus external
**share.js 65 KB (21 KB gz)**, one `current.json` fetch, one `/blog-feed.xml` fetch, the
Google Fonts CSS chain, the jsDelivr Barlow Condensed woff2, and the native Wix Blog post
bundle + comments.

### 1c. External fetches triggered by embeds and bundles

| Source | Host | How loaded | Blocking? |
|---|---|---|---|
| 78a9b413 | www.googletagmanager.com (gtag) | `<script async>` | no |
| Wix tracking tool (GTM) | www.googletagmanager.com (gtm.js) | Wix-managed, async | no |
| Wix tracking tool (FB Pixel) | connect.facebook.net | Wix-managed, async | no |
| 622d8ece (homepage) | presidente49.github.io `current.json` (no-store, cache-busted per minute) → cdn.jsdelivr.net `homepage.js` | dynamic script, `async=true`, 800 ms timeout fallback to pinned commit | no, but **two sequential round-trips** before any story renders |
| f285a38c (/post/) | same two-hop pattern → `share.js` | async | no, two hops |
| 0709a98e (all pages) | fonts.googleapis.com CSS → fonts.gstatic.com woff2; cdn.jsdelivr.net `sitewide-type.css` | `<link rel=stylesheet>` in BODY_END | Not first-paint-blocking; CSS is applied late → **FOUT + style recalc** |
| 14a887e3 (/post/) | cdn.jsdelivr.net/npm/@fontsource Barlow Condensed 800 woff2 | `@font-face` inline, `font-display:optional` | no |
| homepage.js [verified in repo] | fonts.googleapis.com **second** css2 request (Barlow 400–800 + Barlow Condensed 600–800) — overlaps 0709a98e | injected link | no, but duplicate font CSS |
| homepage.js | `/blog-feed.xml` (RSS) with fallback presidente49.github.io `gazette-live/posts.json` (17.5 KB) | fetch after boot | needed for story grid → **third hop** on the critical path |
| homepage.js | presidente49.github.io `sports-live/scoreboard.json` (5.3 KB, 2.5 s timeout), `deploy/cloudflare/endpoints.json` (after first paint) | fetch | no |
| homepage.js | `wixapis.com/oauth2/token` (anonymous visitor token) + `form-submission-service/v4/submissions` — Magazine signup (capture.js) | on interaction | no |
| homepage.js | WebSocket to the Stands Cloudflare Worker (game day only, when endpoints.json names `stands`); `gatorbait-make-the-call.workers.dev`, `ask-gatorbait.…workers.dev` | on interaction / game day | no |
| homepage.js timers [verified] | 9 `setInterval`s: 2 × 30 s ticks, 5 × 1 s (countdowns, stands keepalive/ping, slowLine, quiet), 2 × 500 ms mount retries (≤8/≤16 tries) | — | CPU/battery on phones, not load time |
| 82c4ca83 | www.youtube.com / i.ytimg.com | dynamic `.src` on its route | no |
| 59e31550 (/post/) | `/blog-feed.xml` | fetch on every article view | no |

No `raw.githubusercontent.com` references in any enabled embed. The only GitHub-family
hosts are `presidente49.github.io` (pointer/data JSON) and `cdn.jsdelivr.net/gh` (bundles).
Images in front-page.js use `loading="lazy"` + `decoding="async"`, eager+`fetchpriority=high`
for the lead [verified]. Wix image URLs use `fit/w_1000,h_1000,q_80` transforms [verified].

### 1d. Disabled embeds (30) — not served, but dashboard clutter [verified]

2da582cf AdSense Auto Ads (147) · 2f57bc6b Homepage Safe Prepaint Shield v2 (1,866) ·
00a976dd Remove Franz Morning Promo (1,387) · 15302fb2 Footer Gap Guard v4 (2,462) ·
109a8870 AdSense Free Routes (621) · 8a1dc0f5 Message Board 404 Guard (1,571) ·
471ba402 Homepage Ad Presentation (1,602) · 617d95fb Mobile Optimization v1 (6,232) ·
ed3718cc Legacy Homepage Hard Delete v2 (2,939) · dd2b9790 BACKUP Newsroom loader rev 54
(12,008; references jsDelivr wix-live.js/css) · 72189876 Game Day Rosters Ole Miss (13,731) ·
609d814d Schedule v2 (7,826) · ccddc822 Article Nav v3 (8,565) · 9a4f380c Magazine Gallery v3
(5,163) · f1d3c270 Live Player Restream (1,671) · 75ee2918 Watch Playlists (2,659) ·
4ed79a6f Voices (4,310) · a9f86aa5 Smart 404 Recovery (3,249) · 4409bdd9 ItemOrder Store v2
(5,346) · e093a7a9 BACKUP Category Hub (1,893) · b83aa50c BACKUP Site Footer rev 5 (3,994) ·
796b7ce7 Mobile Pages + TV Menu v5 (4,087) · 21701294 Login Placement v2 (2,823) ·
f644781b Editorial Sections + Clean Feeds v6 (7,001) · 9b3eb505 Unified Mobile Shell v2 (324) ·
9ce1fccf Site Experience Pages + Print (330) · a2238199 Newsletter CTA Bridge v2 (2,208) ·
14048e5a Remove Blog Follow Buttons v2 (2,417) · d3f091bc Mobile Header Unifier (1,031) ·
102d6ddd Latest News overlay patch (2,515).
Disabled embeds are **not** injected into the page (Wix omits `enabled:false`), so they cost
nothing at runtime. Leave the BACKUP ones alone (rollback material).

---

## 2. Tracking / analytics tools [verified]

`GET /marketing/v1/tags` returned exactly two tags, both enabled:

| id | type | id (masked) |
|---|---|---|
| 8a48c8ca | GOOGLE_TAG_MANAGER | GTM-…5KL |
| a526b88e | FACEBOOK_PIXEL | 3872…628 |

Plus the **custom GA4 embed** 78a9b413 (G-9LPC2VVC0V). So the page runs gtag.js + gtm.js +
fbevents.js. **Risk [guess, not verifiable by API]:** if the GTM container also fires a
GA4 config tag, GA4 is double-loaded and pageviews are double-counted. Someone with GTM
access should open the container and check. No Hotjar/Clarity/other tools are registered
in Wix; a third-party script could still be inside the GTM container (unknown).
`POST /consent/consent-config/v1/site-apps-and-storage` (Wix's own list of embedded apps
and cookies) returned **403** with the current token, so the cookie-consent app roster
could not be read.

---

## 3. Installed Wix apps [verified list; names partly inferred]

`GET /apps-installer-service/v1/app-instances` returned **112 instance rows** (some
instance ids repeat with different appDefIds — e.g. b3a88052 ×3, c7b8d6ff ×2, 3ad99cbd ×2;
≈107 unique app IDs). The endpoint returns IDs only, no names. Named via Wix's published
ID table and GetSiteContext:

| App | appDefId | Used? |
|---|---|---|
| Wix Blog | 14bcded7… | yes (4,579 posts) |
| Wix Members Area | 14cc59bc… + member sub-apps (14dbef06…, 14dbefd2…, 14e12b04…, 14ebe801…, 1484cb44… [guess: member pages]) | yes (accounts, alerts) |
| Wix Pricing Plans | 1522827f… | yes (subscribe) |
| Wix Forms (new 225dd912…, old 14ce1214…) | both installed | new one likely; old one = candidate to remove |
| Promote SEO | 1480c568… | yes |
| Wix Groups | 148c2287… | **13 `/group/*` and `/message-board` redirects point to `/` or `/groups`** → effectively retired [verified redirects] |
| Wix Events & Tickets | 140603ad… | `/event-list` redirected to the Buddy Martin Show page → likely unused |
| Wix Stores (V1) 215238eb… + Wix eCommerce (old) 1380b703… + Wix eCommerce 9142e27e… + Pay Links 324cf725… | installed | store moved to ItemOrder (5 `/product-page/*` redirects to itemorder.com) → **likely unused** |
| Wix Hotels | 14bca956… | **unused** for a sports-news site |
| Wix Restaurants Menus (new) b278a256… / Restaurants Orders (new) 9a5d83fd… | installed | **unused** |
| Wix Invoices 13ee94c1…, Wix Subscriptions 8725b255…, Wix Inbox 141fbfae… | installed | dashboard-side only [guess] |
| 14f25dc5… [guess: Wix Forum] | installed | `/forums` redirected → unused |
| 14271d6f… [guess: Pro Gallery], 135c3d92… [guess: Email Marketing/ShoutOut], 1505b775… [guess: marketing tools] | installed | — |
| ~80 remaining IDs | Wix platform/system components (editor, SEO, site-members infra, etc.) — not identifiable via this endpoint | — |

**Not present** (by ID scan) [verified]: Wix Chat (14517e1a…), Instagram Feed (14635256…),
Wix Bookings (13d21c63…), Wix Video (14409595…), Multilingual (14d84998…). So there is no
chat widget or IG feed script; the "Ascend" era apps show up only as Inbox/Email-marketing
IDs, which do not inject visitor-facing scripts unless a widget is on the page.

How this affects speed [guess, with reasoning]: Wix loads an app's frontend bundle only on
pages that contain its widget/page; apps with no widget on `/` or `/post/` mostly add
weight to the site's router/structure manifests and the Members/Blog SDK init, not to the
critical path. Uninstalling Hotels/Restaurants/Events/Groups/Forum/Stores would shrink
the `#SITE_STRUCTURE`/pages map and remove their member pages, but the gain is small
compared with the custom head (section 6).

---

## 4. Redirects [verified]

`GET /seo-redirects-service/v1/redirects` returned **100 rules** — exactly 100, all
exact-match (0 `groupRedirect`), 10 pointing to external URLs (itemorder.com). The docs say
the list is unpaged, but the round number could be a cap; treat "≥100" as the safe reading.

By creation date: **43 on 2024-01-05** (bulk legacy import), 3 in Sept 2025, 1 in Mar 2026,
**53 in Sept 2026** (Groups/store/login cleanup).

Stale / questionable:
- **57 rules land on `/`** — mostly the 2024 batch: `/news/page/NNN`, `/news/archive/YYYY/MM`,
  `/news/categories/*` (tennis, gator-volleyball, gators-in-nfl…), `/amp/<old-post>` (5),
  `/gator-bait-media-news/*` (13). These are soft-404s to the homepage from a 2021-era
  site; harmless for speed, weak for SEO. Candidates to retarget to `/gatorbait-media-blogs`
  or to specific tag pages, or to delete and let Wix 404.
- **3 two-hop chains**: `/2021magazines → /2021-gatorbait-magazine → /magazine`;
  `/gatorbaitmagazine → /magazine/2022 → …`; `/2022 → /magazine/2022 → …`. Each costs an
  extra 301 for the visitor and should point straight at the final URL.
- Odd one: `/gator-bait-media-news/categories/politics → /policies` (looks like a typo target).
- Sept 2026 rules (login/signin/my-account → `/account/my-account`, subscribe → pricing,
  group/* → `/`, product-page/* → itemorder, podcast aliases → Buddy Martin Show) are current.

Redirects are evaluated at Wix's edge before render; **100 exact rules have no measurable
effect on page speed**. Only the chains cost visitors anything (one extra 301 each).

---

## 5. Blog settings that affect speed

There is **no REST endpoint for Wix Blog display settings** (related posts, comments
widget, feed layout). Tried `SearchWixRESTDocumentation` with "blog settings related posts
comments widget configuration" and "blog app settings feed layout…"; results only cover
Posts, Draft Posts, Categories, Tags, Comments API. What *is* visible [verified]:

- The 10 newest posts all have **`commentingEnabled: true`** → the Wix comments widget
  (Wix Comments app bundle + member SDK) loads on every story page.
- `relatedPostIds` is set on 2 of 10 posts (2–3 ids); the native "related posts" section
  is therefore driven by Wix's own logic on the others (unknown whether the section is on —
  owner can see it in Blog Settings → Post page → Related posts).
- No `heroImage` on any of the 10 newest posts (covers are in the first content block).
- Our embeds add on top of the native post page: Post template (14.8 KB), normalizer,
  wide canvas, News SEO (250 ms poll ≤15 s), FB ViewContent poll, Share/Story Kit (65 KB),
  Keep Reading (`/blog-feed.xml` fetch per view) — i.e. **two "related/keep reading"
  systems may be rendering** (native Related Posts + our Keep Reading). Owner check.
- Native feed pages keep Wix's Pro-Gallery-based post list (per 602fb362 comment "keep
  search, categories and pagination native") — that gallery bundle is one of the heavier
  Wix Blog components.

Owner-side (Wix dashboard → Blog → Settings) items that change speed and are not readable
by API: comments on/off per post default, "related posts" section, "post list layout"
(gallery vs. simple), number of posts per page, "load more" vs. pagination, social share
bar, member-login prompts on comments.

---

## 6. Ranked: the 8 most likely causes of "the site feels slow"

Each item: evidence → expected gain → who can change it → rollback.

### 1. ~177 KB of inline `<head>` code on every page, most of it dormant [verified]
Evidence: 20 HEAD embeds = 177,130 chars injected on every URL; on `/post/` ~90 KB of that
is homepage/magazine/stats/latest-page code that exits on line 1 but must still be
downloaded, parsed and (for `<style>`) evaluated before first paint. Largest dormant
offenders on a story page: 1255a4cf Home Styles 14.9 KB, 1dd74333 Magazine 14.9 KB,
fdc2127a Home core 14.2 KB, 96ef5a04 Backup Stories 13.3 KB, 53e15504 Latest 13.3 KB,
756655cf Stats 13.0 KB, 1261f2b9 Game Graph 12.5 KB, 602fb362 Feed cards 9.6 KB.
Gain: roughly halve `<head>` parse (~90 KB fewer chars per story page, ~110 KB fewer
on the homepage from post/magazine/stats code); ~100–300 ms on mid-range phones (guess).
Change: **API/embed change Jarvis can make** — either (a) move route-specific `<style>`
blocks behind a small JS injector that appends the stylesheet only on its route, or
(b) consolidate: one "route styles" embed per page family, or (c) move the big static
CSS (Home Styles, Post template, Magazine CSS) into `assets/*.css` on jsDelivr
(cached, compressed, parallel) and leave a 300-char loader — same pattern already used
for homepage.js. Wix custom embeds expose no `pageFilter` on this site, so gating must
be in code. Rollback: each embed keeps its revision; PATCH back to the previous revision
body (kept in `deploy/`), or re-enable the pre-change copy saved as a disabled BACKUP.

### 2. Three-hop critical path before the homepage shows a story [verified]
Evidence: 622d8ece fetches `current.json` (no-store, github.io) → then loads
`homepage.js` from jsDelivr (244 KB / 69 KB gz) → then `homepage.js` fetches
`/blog-feed.xml` (RSS) with a fallback to `gazette-live/posts.json`, plus
`scoreboard.json`. That is 3 sequential network round-trips (2 on a cold jsDelivr
edge miss for a fresh commit) after HTML parse, and fdc2127a hides the native page
until the bundle mounts. 800 ms fallback timer means a slow github.io response delays
the bundle up to 0.8 s.
Gain: dropping the pointer hop saves one RTT (~100–400 ms mobile); inlining a
pre-rendered story list (first 8 cards) in the Wix-served embed saves the RSS hop for
first paint (~200–600 ms). Bundle split (front-page.js 67 KB + capture 22 KB +
story-kit 18 KB + stands 17 KB + ask 15 KB + make-the-call 12 KB in one file) —
lazy-load capture/stands/ask/call on interaction would cut ~40% of the bundle.
Change: **Jarvis (embed + repo build)**: (a) have the deploy step write the commit hash
into 622d8ece directly (it already carries a pinned default `d=`) and skip
`current.json` unless a `?gbm_fresh` flag is set; (b) build `homepage.js` as core +
lazy chunks; (c) keep RSS but seed the grid from `96ef5a04`'s data first (it already
exists) and swap in when RSS arrives. Rollback: revert 622d8ece to rev 28; repoint
`current.json` to the previous commit (documented in current.json `note`).

### 3. Fonts loaded three different ways [verified]
Evidence: 0709a98e loads Google Fonts CSS (Barlow 400/500/700/800) + jsDelivr
`sitewide-type.css`; homepage.js injects a **second** Google Fonts css2 (Barlow 400–800 +
Barlow Condensed 600–800); 14a887e3 loads Barlow Condensed 800 from
`cdn.jsdelivr.net/npm/@fontsource`. Header/footer/cards all set `font-family:Barlow` so
every page pays the Google CSS → gstatic woff2 chain (2 hosts, 2+ requests) after body
end, causing a visible re-layout (FOUT) — exactly the "feels slow / jumps" sensation.
Gain: one self-hosted or single-origin font set with `font-display:swap`, preloaded in
HEAD (`<link rel=preload as=font>`), removes 2 cross-origin chains and the late swap;
~100–250 ms perceived, plus less CLS.
Change: **Jarvis (embeds 0709a98e, 14a887e3 + homepage.js build)**. Rollback: restore
0709a98e rev 5 body (401 chars, saved here) and re-add the css2 line in front-page.js.

### 4. Nine document-wide MutationObservers + short polls on every page [verified]
Evidence: subtree observers in 5a43ae83, a13b04e3, 53e15504, c91ad133, a5452619,
360c9265, fb8963cc (7 with `subtree:true` on the document) plus 3 in the header and 2 in
Home core; timers: 53e15504 60 ms poll, 4d3ab24a 250 ms ×60, 5ab10e7b 400 ms ×25,
96ef5a04 status interval, homepage.js 9 intervals (five at 1 s). On a Wix page that
mutates the DOM heavily during hydration, each observer callback runs hundreds of
times; on phones this shows as jank/scroll stutter rather than load time.
Gain: input-delay/INP improvement (guess 50–150 ms TBT), better battery.
Change: **Jarvis (embed edits)** — disconnect observers after mount, scope them to the
page container instead of `document`, and replace polls with a single shared
"page ready" event. Rollback: revision PATCH.

### 5. Three tracking loaders (gtag + GTM + FB Pixel), possible GA4 double-fire [verified loaders; double-fire = guess]
Evidence: custom GA4 embed + GTM tag + FB Pixel tag. gtag.js ≈ 90 KB, gtm.js ≈ 100 KB+,
fbevents ≈ 50 KB; all async, but they compete for bandwidth with homepage.js on mobile
and add ~3–6 third-party connections.
Gain: if GA4 lives in GTM, deleting 78a9b413 removes ~90 KB and a duplicate config
(~50–150 ms on mobile); if not, keep it and instead make GTM the single loader.
Change: **Owner decision** (Wix dashboard → Marketing Integrations shows the same two
tags; GTM container contents need Google Tag Manager access). Disabling 78a9b413 is a
one-field embed PATCH Jarvis can do once the owner confirms. Rollback: re-enable embed.

### 6. Story pages run two "next story" systems and two SEO JSON-LD builders [verified]
Evidence: native Wix Blog related posts (relatedPostIds present) + our Keep Reading
(fetches `/blog-feed.xml`, ~100 KB+ of RSS for 4,579-post blog — the feed size is a guess;
verify) on every article view; Site Fixer JSON-LD + News SEO JSON-LD; comments enabled
on all 10 newest posts (Wix Comments bundle + members SDK on every story).
Gain: turning off native related posts (owner) or Keep Reading (Jarvis) removes one
block; caching the RSS fetch (it is fetched with `?t=` cache-bust) or reading
`gazette-live/posts.json` (17.5 KB, CDN-cached) instead saves one large request per
article view. Comments off (owner, Blog Settings) removes the comments widget bundle
on the ~99% of articles with zero comments — check engagement first.
Change: mix — Blog Settings = **owner clicks**; Keep Reading source = **Jarvis embed**.
Rollback: revision PATCH / setting toggle.

### 7. Unused installed apps (Hotels, Restaurants ×2, Events, Groups, Forum, Stores/eCom ×3, old Forms) [verified installed; "unused" inferred from redirects]
Evidence: 13 `/group/*` + `/message-board` redirects, `/forums` redirect, 5
`/product-page/*` → itemorder, `/event-list` redirect, plus Hotels/Restaurants with no
plausible use. Each app keeps pages in the site structure, member sub-pages, and its
SDK registrations in the Wix bootstrap.
Gain: modest and hard to quantify (guess 5–30 KB of site-structure/router JSON per page
and fewer member-area pages); the bigger win is fewer surprises (e.g. Groups pages
resurfacing).
Change: **Owner only** (Wix dashboard → Apps → uninstall; App Installer API does have
uninstall, but CLAUDE.md forbids deleting live content without Brenden's explicit yes
and some apps hold live adapters/rollback material). Uninstall is not reversible without
reinstall + data loss (Groups content, Stores products). Do Hotels/Restaurants first —
zero content risk.

### 8. Header/UI layers ship CSS inside JS strings and hide-then-replace native chrome [verified]
Evidence: 7fee4de6 (13.9 KB) and a13b04e3 (13.7 KB) hold their CSS in JS strings and
create `<style>` at runtime; fdc2127a/1255a4cf hide `#SITE_HEADER`, `#SITE_PAGES`,
`#BACKGROUND_GROUP` with `html:has(...)` selectors. `:has()` on `html` is re-evaluated on
every DOM change, and JS-created styles cannot be applied by the preload scanner; the
native Wix header/footer still download and hydrate (then get `display:none`).
Gain: putting the CSS in real `<style>` tags (or the jsDelivr stylesheet) lets the
browser apply it during parse; removing the native header/footer content in the Wix
Editor (owner) stops shipping ~two hidden component trees per page. Guess 50–150 ms
plus less layout thrash.
Change: CSS move = **Jarvis**; deleting/emptying native header & footer = **owner in the
Editor + site publish**, which is currently forbidden (Lesson 47: publish rolls back
page SEO) — schedule only with a re-apply plan. Rollback: revision PATCH / Editor history.

### Not a cause (checked and cleared)
- Ads: AdSense embeds are disabled and af338ad4 is a no-op — no ad scripts load [verified].
- Redirect count: 100 exact rules, evaluated at the edge; no effect on render [verified].
- Disabled embeds (30): not served [verified].
- Images: front page uses lazy loading + async decode + q_80 transforms [verified].
- No raw.githubusercontent.com or unpinned jsDelivr `@latest` references in enabled
  embeds [verified]; all jsDelivr URLs are pinned to a commit.

---

## Appendix — things this audit could not see
- Velo is **enabled** on the site (GetSiteContext); page code / masterPage.js / backend
  http-functions (`/_functions/standsToken` is referenced by homepage.js) cannot be read
  over REST. If masterPage.js imports anything, it runs on every page and is invisible here.
- GTM container contents, Wix cookie-consent banner config (403 on consent endpoint).
- Actual field timings (LCP/INP). Next step if wanted: run Lighthouse/CrUX for `/` and one
  `/post/` URL at 390 px from a machine that can reach gatorbaitmedia.com and attach the
  waterfall to this folder; this container cannot fetch the live site.
