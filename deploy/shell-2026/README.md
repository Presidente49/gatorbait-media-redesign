# Shell 2026: Shop Gear button, one menu, footer site map

Brenden, Sept. 30: "We really need to promote the store link for gear ... once we go to the store we can't get back. The pages need to be uniform ... The menu could be updated." Also a site map.

Staged on branch `claude/shell-store-menu`. **Nothing here is live.** No Wix write and no publish was made; every Wix call was a read (`hasMutations: false`). Jarvis deploys.

## What changed

**Header `7fee4de6` (header-v2.html)**
- An orange **Shop Gear ↗** button closes the desktop nav on every inner page.
- On phones it adds a **Shop Gear** button (just **Shop** under 375px) to the unified mobile shell bar, beside Menu. The button is 44px tall.
- The phone drawer now runs in the same order as the desktop nav: Front Page, Latest, Magazine, TV & Podcasts, Scores & Schedule, Roster, Community. Then come an orange **Shop GatorBait Gear ↗** button, a navy **Join GatorBait** button, Sign In / Account and Contact.
- The header reuses the shell's existing drawer links, so fdc2127a's route highlighting and close-on-tap keep working. The separate Podcasts and hidden Message Board items are hidden.
- **One menu sitewide.** It follows the Front Page order: Front Page, Latest, Magazine, TV & Podcasts, Scores & Schedule, Roster, Community, Store.
  - Sign in, Join and Search move to the brand row.
  - Stats is wired but off (`STATS=false`) until `/florida-football-stats` exists. Right now it returns 404.
- **Every store link opens in a new tab.** Header, drawer, footer and homepage links carry `target="_blank" rel="noopener"`.
  - A capture-phase click guard also opens in a new tab any other ItemOrder link (story copy, the Policies page) and the old native `/category/all-products` SHOP item.
  - That old SHOP item was the "can't get back" path. The Site Fixer (`5a43ae83`) sends `/category/all-products` to ItemOrder with `location.replace`, which leaves nothing to go back to.
  - Direct visits to that URL still go through the Site Fixer. That is correct for old links, so no Site Fixer change is needed.
- **Size.** The 8 KB shared-design stylesheet ships as a small script that rebuilds the identical CSS text into `<style id="gbm-shared-site-design-v5">` at the script's own position during parse. The cascade order and timing are the same. `build.mjs` refuses to build unless the text round-trips exactly.
- **Dropped as dead code:**
  - `#gbm-live.gbm-sports-home .sh-lead img`: Front Page 2026 renders no `.sh-lead`.
  - The `#SITE_HEADER #comp-mmz3w23y` native-logo override (CSS plus `brand()`). The native Wix header is hidden on every route: by this header on desktop inner pages, by fdc2127a on phones and by front-page.css on the homepage. So the override only restyled the old shell during the pre-script flash. No live embed references `comp-mmz3w23y`.
  - The newsletter pop-up close button and the "Quick Chomps" / "GatorBait Weekly" renames are kept.

**Footer `f8b950c9` (footer-v2.html)**
- A **GatorBait Gear** band with a 48px **Shop Gear ↗** button: "Shirts, hats and gifts for Gator Nation. The store opens in a new tab, so your story stays right here."
- A **site map** in four groups (two columns on phones, four on desktop). Each group lists these pages:
  - **News:** Front Page, Latest, Breaking News, Recruiting, Basketball, Search.
  - **Voices:** Magazine, Buddy's Blog, Franz Beard, Thoughts of the Day, TV & Podcasts, Podcasts.
  - **Gators Football:** Scores & Schedule, Roster, Stats (off until the page exists), Football, Gators in the NFL, Community.
  - **GatorBait:** Join GatorBait, Sign In / Account, Shop Gear, About, Contact, Policies.
- The base row keeps Facebook, YouTube, the email address and the copyright line.
- **Uniform look.** The footer is now navy on every page. Before, the Light Theme (`c66d5b7f`) turned it light gray on the homepage and the header turned it navy on inner pages; QA saw `rgb(242,245,249)` on `/` with v13.

**Homepage (`sports-live/src/front-page.js`, `front-page.css`, rebuilt `homepage.js` + `frame.html`)**
- The nav Store link opens in a new tab and reads "Store ↗". The nav order is unchanged and matches the sitewide menu.
- CSS change: Store no longer drops out of the nav on laptops. Before, the nav hid Scores and Store at 821–1099px and clipped Store at 1100px.
  - 821–899px: Magazine, Columnists, TV and Scores give way.
  - 900–1099px: Columnists, TV and Scores give way.
  - 1100–1279px: Columnists gives way.
  - The widths and results are in `qa/home-nav-check.txt`.
- Nothing else in front-page.js changed. story-kit.js was not touched.

## Sizes and hashes (djb2: `h=5381; h=((h*33)^c)>>>0`)

| File | Object | Length | djb2 | Cap headroom |
|---|---|---:|---:|---:|
| `header-live.html` | `7fee4de6` **rev 30** (live now) | 14,993 | 3866161232 | 7 |
| `header-v2.html` | proposed | **13,880** | **2936686448** | 1,120 |
| `footer-live.html` | `f8b950c9` **rev 27** (live now) | 2,156 | 2641281746 | 12,844 |
| `footer-v2.html` | proposed | **5,282** | **2832029672** | 9,718 |

- The live files match the live embeds by length and djb2; both were read through the Wix API on Sept. 30. They are byte-identical to `deploy/store-handoff/*.after.json`.
- To rebuild the v2 files from the readable sources in `src/`, run `NODE_PATH=<dir with esbuild> node deploy/shell-2026/build.mjs`. The build fails over 15,000 characters.

## QA (local, mock Wix page served as https://www.gatorbaitmedia.com)

**Shell QA:** `qa/qa-shell.mjs` passed **353/353** (`qa/results.json`, screenshots in `qa/shots/`).
- **Routes and widths:** 6 routes (`/post/…`, `/contact`, `/pricing-plans`, `/the-buddy-martin-show`, `/gatorbait-media-blogs`, `/`) × 5 widths (320, 390, 430, 1024, 1366).
- **Fixtures:**
  - the live mobile shell, extracted verbatim from fdc2127a rev 85 (`qa/fixtures/`);
  - the Light Theme's footer rules;
  - a native header with the old SHOP link;
  - post, pricing-plan, contact-form, TV and newsletter-dialog fixtures.
- **Behavior unchanged, 30/30.** 29 non-shell elements were compared between live and v2 on 22 computed properties each: post title and body, pricing plans, contact form, TV hero, recent posts, newsletter close button, mobile trigger and `#SITE_HEADER`. All are identical.
  - The only exception is body height, which follows the taller footer.
  - The contact button still gets "Send message". The newsletter close X and the renames still apply.
- **Other checks:**
  - No horizontal overflow: 30/30.
  - Barlow is the first family on every visible text element in the shell: 30/30.
  - Every store link opens in a new tab: 30/30.
  - Footer navy on every route: 30/30.
  - Footer Shop button at least 44px: 30/30.
  - Site map present with Stats off: 30/30.
  - Phone Shop button visible, at least 44px and inside the viewport: 18/18.
  - Drawer order: 18/18.
  - Drawer Shop button at least 44px with a new tab: 18/18.
  - Desktop menu, action row and Shop button: 10/10.
  - `aria-current` (Latest on posts, TV on the show page): 10/10.
  - Click guard opens the store in a new tab and the page stays put, for the native SHOP link and a story-copy link: 24/24.
- **Homepage harness** `sports-live/qa-front-page.mjs`: **51/51 passed**. `node sports-live/build-front-page.mjs --check` reports the build current.
- **Limits:**
  - Chromium device emulation only; no physical iPhone.
  - Fonts, images and ItemOrder were stubbed. No request left the machine.
  - Real-page verification is Jarvis's step after the PATCH.

## Deploy plan for Jarvis (one writer, one object at a time; stop-work still applies until Brenden lifts it)

1. Claim in #34: `f8b950c9` + `7fee4de6` + homepage pointer, scope "Shop Gear button, one menu, footer site map", rollback as below.
2. **Footer first.** GET `f8b950c9`. Proceed only if the live HTML is 2,156 characters with djb2 2641281746 (rev 27). If anything drifted, stop.
   - PATCH in place with the current revision and `footer-v2.html`.
   - Keep `enabled: true`, `position: BODY_END`, `category: ESSENTIAL` and `loadOnce: false`.
   - Suggested name: "GBM - Universal Utility Footer v14 (store band + site map)".
   - Read it back and expect 5,282 characters with djb2 2832029672.
3. **Header.** GET `7fee4de6`. Proceed only if the live HTML is 14,993 characters with djb2 3866161232 (rev 30).
   - PATCH with `header-v2.html`.
   - Keep `enabled: true`, `position: HEAD`, `category: ESSENTIAL` and `loadOnce: false`.
   - Suggested name: "GBM - Compact Optimized Logo + Header v13 (Shop Gear, one menu)".
   - Read it back and expect 13,880 characters with djb2 2936686448.
4. **Homepage.** After this branch merges, rebuild on `main`, because another agent is editing `story-kit.js` and the built `homepage.js` bundles it.
   - Run `node sports-live/build-front-page.mjs` and the QA harness (51 checks).
   - Point `sports-live/current.json` at the merge commit. The V3 loader picks it up within a minute.
5. **Verify live** at 320, 390, 430 and 1366 with real-browser shots on `/`, a `/post/` page, `/magazine`, `/contact` and `/pricing-plans`.
   - The Shop button is visible, and tapping it opens ItemOrder in a new tab while GatorBait stays open.
   - The drawer order is right, the footer is navy with the site map, and there is no horizontal overflow.
6. No site publish is needed. Custom embeds go live without one.

**Rollback:**
- Header or footer: read the newest revision. If the live HTML still equals the v2 hash, PATCH it back with `header-live.html` or `footer-live.html`.
- Homepage: point `current.json` back at `eece061f391fc7dffc92e60efd7d9a68148764dd`.
- The two embeds are independent. The header keeps its old footer-color rules, so either embed can roll back alone.

**When `/florida-football-stats` exists:** set `STATS=true` in both `src/*.src.html` and rebuild. That adds about 30 characters to the header.

## Page-uniformity audit (live, Sept. 30)

**Sources:**
- `pages-sitemap.xml` (14 URLs) and `sitemap.xml` (8 child sitemaps), fetched through TinyFish;
- TinyFish fetches of `/`, `/gatorbait-media-blogs`, `/magazine`, `/the-buddy-martin-show`, `/groups` and `/florida-football-stats`;
- Wix API reads of all 58 custom embeds.

The TinyFish wallet is now below zero, so no more pages were fetched. Rows marked "not fetched" are inferred from embeds and repo records.

| Page | Shared shell (header, phone shell, footer) | Fonts and look | Fix |
|---|---|---|---|
| `/` Front Page | Own masthead and nav by design; phone shell; footer | Barlow + Barlow Condensed | Store now opens in a new tab and stays in the nav (this branch). |
| `/gatorbait-media-blogs` Latest | Yes | Latest embed `53e15504` sets Barlow via `--f`; one `Arial` fallback | None |
| `/post/*` stories | Yes, plus post template `14a887e3` and Story Kit | Barlow | Story Kit links Stats to `/florida-football-stats`, which is 404 today. Hide that chip or add the page. |
| `/gatorbait-media-blogs/categories/*` | Yes; Light Theme `html.gbm-cat` | Native blog on Wix theme fonts | Editor: theme fonts (below). |
| `/magazine` | Yes; own cover design | Barlow; one `'Arial Black'` fallback and one `Georgia` string in `1dd74333` | Leave it to PR #38's Georgia purge. Its store link already opens in a new tab. |
| `/the-buddy-martin-show` TV & Podcasts | Yes; TV embed `82c4ca83` | Barlow | None |
| `/groups` Community | Yes | Native Wix Groups on theme fonts | Two spam posts ("Asia Pacific nanobots market", "Alpha Thalassemia market", each with a "Click Me" link) show in the feed. Brenden: delete them in the dashboard and require post approval. Deleting live content is a hard line. |
| `/contact` | Yes; the header restyles the form | Barlow | None |
| `/policies` | Yes; `fb8963cc` | Barlow, Arial fallback | Its ItemOrder link has no `target`; the click guard covers it. Optional: add `target="_blank"` in `fb8963cc`. |
| `/pricing-plans`, `/pricing-plans/subscribe` | Yes; header plan styles; terms note `78528a4b` | Barlow | None |
| `/account/my-account` and member pages (`/profile`, `/my-orders`, `/my-wallet`, `/settings`, `/notifications`, `/my-drafts`, `/blog-likes`, `/blog-comments`, `/blog-posts`, `/my-addresses`) | Yes | Native. The UI layer `a13b04e3` uses `-apple-system, "Segoe UI", Arial` for modal body text and buttons. | Jarvis: switch `a13b04e3`'s system-font stacks to `Barlow,sans-serif` (API, about 5 places). |
| `/about` | Yes (not fetched) | Native theme fonts | Editor: theme fonts. |
| `/search`, `/tags` | Yes (not fetched) | Native theme fonts | Editor: theme fonts. |
| `/category/all-products` | Redirected to ItemOrder by Site Fixer `5a43ae83` | — | Editor: repoint the native menu's SHOP item (below). |
| `/florida-football-stats`, `/standings` | **404** | — | Editor: add the two blank pages. This is already on Brenden's list. |
| Retired and redirected: `/2021-gatorbait-magazine`, `/magazine/2022`, `/event-list`, `/members`, `/projects`, `/product-page/*` | Redirected (Sept. 28) | — | They are still listed in `pages-sitemap.xml`. Editor: hide these pages from search (page SEO) so the sitemap stops listing them. |

**Other findings:**
- **Brand links disagree.** Footer and native footer: facebook.com/gatorbaitmedia. Homepage config: facebook.com/thebuddymartinshow. YouTube: @thebuddymartinshow (footer), @GatorBaitMedia (native), and channel `UCtR8b1…` (homepage). The footer v2 keeps the current footer's links. Brenden: name the canonical Facebook and YouTube accounts, and Jarvis aligns all three places.
- **Founding year disagrees.** The server-rendered homepage text says "since 1980"; the phone drawer and Magazine say 1979. The footer uses 1979.

### Editor-only list for Brenden (short)

1. **Theme fonts to Barlow** (Site Design, Text Themes): Heading and Paragraph. This fixes the native blog category, Groups, About, Search, Tags and member pages in one step.
2. **Main menu cleanup** (Site Menu): remove the member pages from the main menu (My Wallet, Search Results, Profile, Blog Posts, Settings, My Orders, Notifications, My Drafts, Blog Likes, My Addresses, Members, Blog Comments). Point "SHOP" at `https://gatorbait2026.itemorder.com/shop/home/` with "Open in new window", or delete it. Crawlers and the pre-script flash see this menu.
3. **Add the blank pages** `/florida-football-stats` and `/standings`. Then Jarvis sets `STATS=true`.
4. **Hide retired pages from search**: 2021 Magazine, Magazine 2022, Event List, Members, Projects.
5. **Homepage native text:** the server-rendered homepage still carries the old "Today's Edition … since 1980" copy, which crawlers read. Replace it with a one-line description or delete it in the Editor.
6. **ItemOrder dashboard** (not Wix): if ItemOrder lets the store header or logo link to a site, set it to `https://www.gatorbaitmedia.com/`. We can't put a back link on their site ourselves.
7. **Groups**: delete the two spam posts and turn on post approval.
