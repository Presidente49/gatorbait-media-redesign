# GatorBait Media external speed + SEO audit — Sept. 30, 2026 (read-only)

Scope: `https://www.gatorbaitmedia.com/` (Wix site `18fb3a4e…`) audited from outside. No Wix, GitHub, email or social write was made. Sources and their limits:

| Source | What it gave | What it cannot give |
|---|---|---|
| OpenRush `audit_site` (crawl, 20 of 62 discovered pages, observed 2026-09-30T18:05Z, confidence 0.9) | On-page score, issue clusters, H1 counts, word counts, per-page issues | **No JavaScript execution, no Core Web Vitals, no page-weight or script counts** (stated in the tool's own scope note) |
| OpenRush `inspect_domain` / `inspect_page` / `inspect_search_visibility` / `inspect_backlinks` (search index + backlink index, confidence 0.7) | Rankings, estimated traffic, competitors, link profile | Measured clicks/impressions (Search Console is **not connected** to OpenRush: `list_websites` returned `connection_required: true`) |
| TinyFish `fetch_content` (7 fetches, `ttl: 0`, live) | Titles, metas, canonical, OG/Twitter, article tags, links, image URLs, robots.txt, sitemaps, HTTP status, server-side fetch latency | Returns **cleaned HTML with `<script>`/`<style>` stripped**, so live `<script>` counts, inline-script bytes and JSON-LD text could not be read from the page |
| This repo (`deploy/`, `sports-live/`, `skills/master-control/references/CURRENT-STATE.md`) | Exact bytes and behavior of the custom code the site injects (loader, header, footer, share, JSON-LD embed) | Whether the live embed text still equals the repo copy (the repo says header rev 30 → live is now rev 31; not re-read here) |

`pagespeed.web.dev` was skipped as instructed; the container cannot reach gatorbaitmedia.com directly (proxy 403, verified with curl). TinyFish browser automations were not run.

Legend: **[V]** verified by a tool result or repo file this session; **[G]** inference or estimate.

---

## 1. Speed

### 1.1 What the external tools measured

OpenRush has **no speed data** for this site (raw-HTML crawl only, no CWV). The only timing numbers available are TinyFish's server-side fetch wall-clock per URL, which measure origin response + extraction, not a browser's LCP/CLS/INP:

| URL | HTTP | TinyFish latency | Note |
|---|---:|---:|---|
| `/` | 200 | 1,351 ms | [V] |
| `/post/the-looming-brilliance-of-buster-faulkner-…` | 200 | 1,177 ms | [V] |
| `/robots.txt` | 200 | 638 ms | [V] |
| `/sitemap.xml` (index) | 200 | **19,830 ms** | [V] single observation; the 8 child sitemaps are Wix-generated. Worth re-checking; a slow sitemap index slows Googlebot discovery of new stories |
| `/blog-posts-sitemap.xml` | 200 | 388 ms | [V] 4,526 URLs |
| `/pages-sitemap.xml` | 200 | 28 ms | [V] 14 URLs |
| `/florida-football-stats` | **404** | – | [V] |

No LCP, CLS, INP or TBT number exists in this audit. Getting them is fix #1 below.

### 1.2 What the site itself injects (derived from the repo, the part Jarvis controls)

The Wix page is the base (Thunderbolt runtime, Blog, Members, Groups, Stores, Pricing Plans apps). On top of that, the repo shows these custom-code embeds are live sitewide or on the homepage (CURRENT-STATE.md line 184, front-page-2026/README.md, shell-2026/README.md):

| Embed (Wix custom code) | Where | Size | What it does at load | Status |
|---|---|---:|---|---|
| Home Code `622d8ece` rev 28 (V3 loader) | `/` | 1,063 chars | Fetches `sports-live/current.json` from GitHub Pages (800 ms budget), then loads `sports-live/homepage.js` from jsDelivr at that commit; **re-polls `current.json` every 60 s** (`6e4` interval in `home-code-loader-4cc4ad3.html`) | [V] |
| `sports-live/homepage.js` (the Front Page 2026 renderer) | `/` | **244,409 B raw / 68,832 B gzip** | 10 `fetch()` call sites, 9 `setInterval`s, loads Google Fonts **Barlow ×5 weights + Barlow Condensed ×3 weights** (`display=swap`), pulls YouTube thumbnails, checks 3 Cloudflare Worker URLs (mount only if `endpoints.json` exists; 404 today so nothing mounts). **0 `loading="lazy"`**, 1 `fetchpriority`, 0 `rel=preload` | [V] |
| Loader `fdc2127a` rev 68 (unified mobile shell) | sitewide | not re-read | Mobile shell/drawer | [V] exists; size not measured this session |
| Header `7fee4de6` rev 30/31 | sitewide (removes itself on `/`) | 13,885–14,993 chars | 3 inline scripts. Rebuilds an ~8 KB stylesheet from a string at parse time; runs its DOM pass at 0/200/800/1,800/4,000/8,000 ms; brand script runs at 600/1,600/3,200/5,600 ms **plus a `MutationObserver` on the whole `documentElement` subtree for 12 s**; a second observer on `/contact` for 15 s | [V] from `header-v2.html` |
| Footer `f8b950c9` rev 27 | sitewide | 2,156–5,286 chars | 1 style + 1 script, builds footer once | [V] |
| Home Styles `1255a4cf` rev 6, Latest `53e15504` rev 8, article template `14a887e3` rev 8, Site Fixer `5a43ae83`, Light Theme `c66d5b7f`, consent embeds | sitewide / route-scoped | "within 100–250 characters of the 15,000 cap" for four of them | CSS/JS overrides | [V] per CURRENT-STATE; bytes not re-read |
| Game graph `1261f2b9` rev 1 | `/` | 12,507 B | Injects a NewsMediaOrganization/@graph JSON-LD via script | [V] |
| Ad guard `af338ad4` rev 4 | sitewide | – | **Google ads off sitewide**, so no AdSense weight right now | [V] per CURRENT-STATE |
| Game-day band `96ef5a04` rev 45 | `/` | – | hidden | [V] per CURRENT-STATE |
| Share `f285a38c` rev 1 | `/post/*` only | 1,003 chars loader → `sports-live/share.js` **64,875 B raw / 21,105 B gzip** from jsDelivr | Share button + Story Kit strip, MutationObserver that "stays alive on /post/ pages" | [V] |

Totals Jarvis adds on top of Wix, gzip on the wire: homepage ≈ **69 KB JS + ~15–20 KB of inline embed code + 2 Google Fonts CSS requests (8 weights)**; story page ≈ **21 KB JS + ~15–20 KB inline**. [V for the file sizes; G for the inline total, since live embeds were not re-read.]

Wix's own Thunderbolt + Blog + Members + Groups runtime is the larger share of bytes on any Wix news site (commonly 1–2 MB of JS before app scripts). **[G]** — not measured here; only PageSpeed/CrUX can put a number on it.

### 1.3 Images, fonts, third parties (from fetched HTML)

- Homepage: 15 `<img>` in crawlable HTML (OpenRush "1/15 images" missing alt). Story cards are served by `static.wixstatic.com` as **AVIF (`enc_avif,quality_auto`) at 303×227 with a 334×250 `blur_30` LQIP** — good practice, no change needed. [V]
- Header logo: `<img width="900" height="241">` displayed at 250 px wide → ~3.6× oversized on desktop; a webp, so small in bytes. [V] dimensions; [G] byte cost is minor.
- OG image 2,500×1,330 (homepage) and 1,000×563 (story) are only fetched by social crawlers, not by visitors. [V]
- Fonts: Google Fonts Barlow (8 weights across 2 families) requested by `homepage.js`; the header/footer/mobile shell also set `font-family: Barlow` and rely on that same load. No `preconnect` to `fonts.gstatic.com` or `cdn.jsdelivr.net` found in the loader or renderer. [V]
- Third-party hosts referenced by the custom code: `cdn.jsdelivr.net`, `presidente49.github.io` (Pages), `fonts.googleapis.com`, `static.wixstatic.com`, `i.ytimg.com`, `www.wixapis.com` (OAuth for share), Cloudflare Workers (inactive), `gatorbait2026.itemorder.com` (store, links only). No chat widget, no pop-up app, no analytics pixel found in the repo embeds; Wix's own analytics/consent are not visible in cleaned HTML. [V for repo; G for the Wix side]

### 1.4 Why it "feels slow" — best reading of the evidence [G]

1. Two network hops before the homepage can paint its real content: Wix HTML → loader → `current.json` (Pages) → `homepage.js` (jsDelivr) → fonts + feeds. Each hop is a new origin with no preconnect.
2. Main-thread churn for the first 8–15 s on every inner page from the header's repeated timers and document-wide MutationObservers, on top of Wix hydration. On phones this shows up as INP/TBT, i.e. taps that feel laggy.
3. Zero lazy-loading in the renderer, so all card images below the fold compete with the lead image.
4. The 60-second `current.json` poll keeps a timer and a fetch alive for the whole visit (cheap, but it never lets the page go quiet).

---

## 2. SEO

### 2.1 Page-level facts (TinyFish live fetch, page_metadata)

| Item | Homepage `/` | Story page `/post/the-looming-brilliance-…` |
|---|---|---|
| `<title>` | "GatorBait Media \| Florida Gators News, Recruiting & Analysis" (60 chars) [V] | "The Looming Brilliance of Buster Faulkner: “If It Works Once, We Retire It”" (75 chars, no brand suffix) [V] |
| Meta description | 135 chars, unique [V] | **199 chars** = raw excerpt; will be truncated in SERPs [V] |
| Canonical | `https://www.gatorbaitmedia.com` (self) [V] | self-referencing, exact URL [V] |
| Robots meta / noindex | none on either page [V] | none [V] |
| Viewport | `width=device-width, initial-scale=1` [V] | same [V] |
| Open Graph | title, description, image 2500×1330, url, site_name, `type=website` [V] | full set, `type=article`, `article:published_time` 2026-09-30T14:25Z, `modified_time` 16:10Z, `article:author` "Buddy Martin" [V] |
| Twitter card | `summary_large_image` [V] | `summary_large_image` [V] |
| hreflang | none (single-language site; not needed) [V] | none [V] |
| H1 in crawlable HTML | **`Today’s Edition`** + old shell copy ("Dive into today's edition… your trusted source since 1980"); OpenRush counts **2 h1 tags** [V] | 1 h1 in cleaned HTML (the headline); repo note in `sports-live/current.json` says a **hidden native header h1 now precedes it after header rev 31** [V repo note; G that the crawler sees two] |
| Word count (raw HTML) | 479 [V] | not audited by OpenRush (not in sample) |
| Structured data | Wix native Organization JSON-LD presumed + game-graph embed injects `NewsMediaOrganization` **via JavaScript** (not in raw HTML) [V embed exists; G what Wix emits natively] | Prior audit (`deploy/dept-ideas/seo/audit.md` §9, evidence 16/17) found a native `NewsArticle` script whose **author is `Organization "GatorBait Staff"`, not `Person Buddy Martin`** [V prior audit; not re-read this session] |
| Verification tags | Google, Yandex, Facebook domain verification present [V] (values omitted) | same [V] |

**Key homepage finding [V]:** what a non-JS crawler (and Google's first pass) indexes on `/` is the old Wix shell text with H1 "Today's Edition", not the Front Page 2026 content. The renderer only exists after JavaScript. CLAUDE.md says Today's Edition must not be exposed; it is exposed to crawlers today.

**Duplicate title/description caveat [G]:** OpenRush flags `/` and `/magazine` as sharing a title and description, but its own entity list shows different titles ("GatorBait Media | Florida Gators News…" vs "Gatorbait Magazine | Gatorbait Media"), and its sample contained `/` seven times out of 20. Treat that cluster as a sampler artifact until re-checked; the earlier Sept. 30 05:14Z run did not flag it.

### 2.2 robots.txt [V]

Standard Wix file, no problems: `Allow: /` for all agents; `Disallow: *?lightbox=` and `/_partials*`; `Sitemap: https://www.gatorbaitmedia.com/sitemap.xml`; explicit allows for Googlebot, Googlebot-News, Facebook crawlers; PetalBot and MJ12bot blocked; 10-second crawl-delay for Semrush/Ahrefs/dotbot; AdsBot kept out of `/pro-gallery-webapp/`.

### 2.3 Sitemaps [V]

- Index lists 8 child sitemaps: group-lists, group-posts, store-products, store-categories, blog-posts, blog-categories, pricing-plans, pages.
- `blog-posts-sitemap.xml`: **4,526 post URLs**, all under `/post/`. `/florida-football-stats` is not in any sitemap.
- `pages-sitemap.xml`: 14 URLs, including legacy/thin entries `/2021-gatorbait-magazine`, `/magazine/2022`, `/event-list`, `/projects`, `/tags`, `/members`.
- OpenRush's sampler discovered 62 URLs this run and 2,001 in the 05:14Z run (its own budget, not the site's size).
- `lastmod` values could not be read (TinyFish strips XML to links). Unverified whether Wix emits them.

### 2.4 Broken / questionable links [V unless marked]

- `/florida-football-stats` → **404**. The header and footer gate the "Stats" item off (`STATS=false`), so it is **not in the nav today**; the fetched story page's 38 links do not include it either. But `sports-live/front-page.config.json` line 70 still points `stats` there and CURRENT-STATE line 4 says the Story Kit links "first mentions" to the stats page, so any build that flips the gate will link to a 404. [V for 404, config, nav gating; G for Story Kit output]
- `/message-board` is documented as 404 in `docs/HOMEPAGE-BASELINE-LOCK.md`; not re-fetched. [V doc only]
- Every page's crawlable HTML links to 10 member-area pages (`/my-account`, `/my-wallet`, `/settings`, `/my-orders`, `/my-drafts`, `/blog-likes`, `/my-addresses`, `/notifications`, `/blog-comments`, `/profile-1`). Wix normally noindexes these; they still cost crawl budget on 4,500+ pages. [V links; G noindex]
- Backlink index reports **6 broken backlinks** pointing at the domain (targets not pulled). [V count]

### 2.5 OpenRush site-health clusters (crawl, 20 pages, score 87.7 / 100) [V]

| Issue | Severity | Pages | Examples |
|---|---|---:|---|
| low_content | medium | 6 | `/the-buddy-martin-show` **59 words**, `/contact` 67, `/pricing-plans/subscribe` 79, three `/group/*/discussion` pages 122–125 |
| missing_meta_description | medium | 4 | `/groups`, `/gatorbait-media-blogs/categories/jon-sumrall`, `/pricing-plans/subscribe`, the itemorder.com store host |
| duplicate_title / duplicate_meta_description | medium / low | 2 | `/` and `/magazine` (see caveat above) |
| multiple_h1 | low | **11 of 20** | `/` (2), `/about` (**3**), `/contact`, `/the-buddy-martin-show`, `/groups`, `/gatorbait-media-blogs`, category and group pages |
| no_image_alt | low | 2 | `/` and `/groups` (1 of 15 images each) |
| title_too_short | low | 1 | category page title "Jon Sumrall" (11 chars) |
| missing_canonical / missing_structured_data | low | 1 | only the itemorder.com store host (Baker's, not Wix) |

### 2.6 Search visibility (search index, confidence 0.7, US) [V]

| Metric | Value |
|---|---:|
| Organic keywords indexed | 132 |
| Top-3 / top-10 keywords | 6 / 18 |
| Estimated organic visits / month | **691** |
| Keyword movement | 86 new, 26 up, 12 down, 45 lost |
| Homepage alone | 24 keywords, ~120 visits/mo; #1 "gatorbait media", #2 "gator bait football"; the rest is entity confusion ("gator bait and tackle", "gator bait melrose", "cast of gator bait") |
| Story page (published 14:25Z, checked 18:05Z) | 0 indexed keywords (index lag; expected) |
| Backlinks | domain rank **130 / 1000**, 207 referring domains, 369 backlinks, 61% dofollow, spam score 26, 6 broken |

Position check on 12 target terms (index mode): **unranked** for "florida gators news", "florida gators football news", "gators football news", "florida gators recruiting", "gator bait media", "jon sumrall", "buster faulkner". Ranked: "gatorbait" #4 (`/about`, 2,900/mo), "buddy martin show" #3 (70/mo), "florida gators magazine" #14 (`/magazine`, 210/mo), "buddy martin" #19 (`/…/categories/buddy-s-blog`, 320/mo), "florida gators basketball news" #35 (`/…/categories/gator-basketball`, **4,400/mo**).

The best real-demand rankings all belong to one category page, `/gatorbait-media-blogs/categories/gator-recruiting`: #12–16 for "florida gators football recruiting news" (2,900/mo), "florida recruiting news" (2,900), "gators football recruiting news" (2,900), "gator recruiting" (1,600), "gator recruiting news" (720).

Competitors by overlap: gator-football.com ~8,502 est. visits/mo, alligatorarmy.com 6,558, insidethegators.com 4,249, floridagatorsbaseball.com 1,315, hightopsport.com 799 vs GatorBait 691.

---

## 3. Ranked fixes (top 8)

| # | Fix | Evidence | Expected gain | Who | Rollback |
|---|---|---|---|---|---|
| 1 | **Get real speed numbers before changing anything else.** Open Wix Dashboard → Site Speed (Wix's built-in Lighthouse) and Google Search Console → Core Web Vitals; connect Search Console to OpenRush so `get_search_performance` works. | No tool in this session could produce LCP/CLS/INP; OpenRush GSC connection is `connection_required` [V]. | Turns "feels slow" into a number per template (home vs `/post/`) and lets fixes 2–3 be verified instead of guessed. | **Owner** (two dashboard logins; ~10 min). | None needed (read-only). |
| 2 | **Slim the homepage delivery chain**: add `<link rel="preconnect">` for `cdn.jsdelivr.net`, `presidente49.github.io`, `fonts.gstatic.com` in the loader; cut Google Fonts from 8 weights to ≤4 (e.g. Barlow 400/700, Condensed 700/800); add `loading="lazy"` to every non-lead card image and keep `fetchpriority="high"` on the lead; change the `current.json` poll from 60 s to on-load + one retry (or ≥5 min). | 244 KB / 69 KB gz renderer, 0 lazy images, 8 font weights, 60-s poll [V]. | [G] 200–500 ms off mobile LCP from preconnect + fewer font requests; less bandwidth on card images; page goes idle after load. | **Jarvis** via repo (`sports-live/src/front-page.*`, `deploy/front-page-2026/make-loader.mjs`), deployed by moving `sports-live/current.json`; loader change needs one guarded PATCH of `622d8ece`. | Point `current.json` back to `fba3a35`; PATCH the previous loader file (`home-code-loader-4cc4ad3.html`). |
| 3 | **Quiet the header embed**: replace the 6-timer + 4-timer + 12-s document-wide `MutationObserver` pattern with one `DOMContentLoaded` pass plus a scoped observer on `#SITE_HEADER`/`#gbm-mobile-drawer-root` only; ship the shared CSS as a plain `<style>` instead of rebuilding it in JS. | `header-v2.html` [V]. | [G] Lower INP/TBT on every inner page (story pages are where readers arrive from social). | **Jarvis** via Wix API PATCH of `7fee4de6` (read live revision first; 15,000-char cap). | PATCH back `deploy/shell-2026/header-live.html` (rev 30 text, djb2 recorded in README). |
| 4 | **Give crawlers a real homepage**: change the underlying Wix homepage's H1 and intro copy from "Today's Edition / Dive into today's edition…" to a stable, descriptive H1 ("Florida Gators News, Recruiting & Analysis") and a short intro, so the raw HTML matches the renderer's intent; keep one H1. | Crawlable H1 = "Today's Edition", 2 h1s, 479 shell words [V]; CLAUDE.md forbids exposing Today's Edition. | [G] Fixes the entity confusion on `/` (24 keywords, mostly fishing bait / movie) and gives Google a football-news signal on the page with the most links. | **Owner in Wix Editor** (or Jarvis through the Wix Editor MCP when Remote Control is up). Presentation change → needs Brenden's explicit yes. | Retype the old text; no publish needed beyond the page. |
| 5 | **Fix story-page SEO fields at publish time**: write a ≤155-char meta description per post (not the raw excerpt), set the post author to the Buddy Martin member so the native NewsArticle JSON-LD carries `Person` not `Organization "GatorBait Staff"`, and remove the second (hidden native header) h1 introduced at header rev 31. | 199-char description [V]; JSON-LD author finding from prior audit [V]; 2-h1 note in `current.json` [V]. | [G] Better SERP snippets on the ~4,500 post URLs that make up 99% of the sitemap; author entity for "Buddy Martin" (320/mo, currently #19). | **Jarvis** via Wix Blog API `seoData` on new posts (publishing playbook applies); the h1 via header PATCH (same as #3). Owner: Blog → SEO settings pattern. | Revert `seoData` per post; header rollback as in #3. |
| 6 | **Resolve the Stats 404 one way or the other**: either create `/florida-football-stats` (and `/standings`) in the Editor as CURRENT-STATE line 167 already asks, or drop the `stats` route from `front-page.config.json` and the Story Kit until it exists. Also add a Wix 301 for `/message-board` → `/groups`. | 404 verified; config still points there; nav gated off [V]. | Prevents a 404 from going live on 4,500 story pages the day the gate flips; recovers any old `/message-board` links. | Create page: **Owner** (Editor). Config/Story Kit: **Jarvis** (repo). Redirect: Owner (Dashboard → SEO → URL Redirect Manager) or Jarvis via Wix Redirects API. | Delete the page / revert config commit / delete redirect. |
| 7 | **Feed the pages that already rank**: write titles + 150-char descriptions for blog category pages (recruiting, basketball, buddy-s-blog, jon-sumrall…) and add 150–300 words of real copy to `/the-buddy-martin-show` (59 words) and `/contact` (67). | Category pages hold every top-20 real-demand ranking; "Jon Sumrall" title 11 chars, 4 pages missing descriptions, 6 thin pages [V]. | Most realistic traffic gain in the audit: moving the recruiting category from #12–16 to top-10 on four 1,600–2,900/mo terms is worth **~150–300 visits/mo** [G, from CTR curves]; basketball news (#35, 4,400/mo) is the next lever. | **Jarvis** via Wix Blog Categories API `seoData` (read-only today; needs controller authorization). Show/Contact copy: Owner or Jarvis via Editor MCP. | Revert `seoData`; retype copy. |
| 8 | **Sitemap and crawl hygiene**: hide legacy pages from search (`/2021-gatorbait-magazine`, `/magazine/2022`, `/projects`, `/event-list`, `/tags`) so they leave `pages-sitemap.xml`; re-test the sitemap index response time and open a Wix support ticket if it stays >5 s; ask Wix for the 6 broken backlinks' targets and 301 them. | 19.8-s sitemap index fetch (one observation), 14-URL pages sitemap with legacy entries, 6 broken backlinks [V]. | [G] Faster discovery of new stories on game days; consolidates link equity. | **Owner** (Page SEO settings → "Hide from search"; URL Redirect Manager). Backlink targets: Jarvis via OpenRush `inspect_backlinks view=backlinks` (9 credits). | Untick "Hide from search"; delete redirects. |

Not recommended: adding another JSON-LD NewsArticle on posts (native one exists; `docs/ARTICLE-PAGE-STANDARD.md` forbids a duplicate), re-enabling ads to "test" speed, or adding a second loader/CDN layer.

---

## 4. Numbers at a glance

| Metric | Value | Source |
|---|---:|---|
| OpenRush on-page score | 87.7 / 100 (0 high, 3 medium, 6 low clusters) | audit_site [V] |
| Pages with >1 H1 | 11 of 20 sampled | audit_site [V] |
| Homepage crawlable words / H1 | 479 / "Today's Edition" | audit_site + fetch [V] |
| Story meta description length | 199 chars | fetch [V] |
| Post URLs in sitemap | 4,526 | fetch [V] |
| Sitemap index fetch time | 19.8 s (once) | fetch [V] |
| Custom renderer JS (home) | 244 KB raw / 69 KB gz | repo [V] |
| Custom share JS (story) | 65 KB raw / 21 KB gz | repo [V] |
| Google Fonts weights requested | 8 | repo [V] |
| Lazy-loaded images in renderer | 0 | repo [V] |
| Header DOM passes in first 8 s | 6 (+4 brand passes, +12-s observer) | repo [V] |
| Organic keywords / est. visits/mo | 132 / 691 | inspect_domain [V] |
| Top-3 / top-10 keywords | 6 / 18 | inspect_domain [V] |
| Referring domains / backlinks / domain rank | 207 / 369 / 130 | inspect_backlinks [V] |
| Core Web Vitals | **not available** | none |
| Search Console connected to OpenRush | no | list_websites [V] |

Tool spend this session: OpenRush 9 calls (describe_capabilities, audit_site ×1 at 20 pages, inspect_domain, inspect_page ×2, list_websites, inspect_search_visibility index-mode, inspect_backlinks authority, export_dataset); TinyFish `fetch_content` 7 URLs in 2 calls; no browser automation.
