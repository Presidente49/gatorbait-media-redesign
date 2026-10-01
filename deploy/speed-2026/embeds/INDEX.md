# speed-2026 — story-page embed v2s (main-thread cost)

Prepared Sept. 30, 2026 for Jarvis (controller). Read-only against Wix: every body below was read with
`GET https://www.wixapis.com/embeds/v1/custom-embeds?paging.limit=100` (58 embeds, one page) through the Wix MCP;
no PATCH/POST was sent, nothing was published. Site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`.

Why: the throttled-phone run in `../perf-story-before-fba3a35.json` (390 px, 4x CPU) measured TBT 7.7 s, 166 long tasks
(16 s main thread), LCP 23.9 s, CLS 0.28 on a story page; desktop TBT 0.4 s. `../wix-inventory.md` §1a and §6 items 1, 4, 8
traced part of that to seven document-wide `MutationObserver`s with `subtree:true`, short polls, and per-mutation work
(`innerText` reads that force layout, whole-document `querySelectorAll`) that Wix blog hydration fires hundreds of times.

djb2 everywhere below: `h=5381; for each char h=((h*33)^c)>>>0`, over the exact `embedData.html` string.

## 1. Live bodies (verbatim, hash-verified against the API response)

| id | name | rev | length | djb2 | category | loadOnce | position | file |
|---|---|---|---|---|---|---|---|---|
| 5a43ae83-690e-4933-971d-4837db00b2f3 | GBM - Site Fixer v7.2 (no street address) | 18 | 10410 | 3930399565 | ESSENTIAL | false | HEAD | `5a43ae83-live.html` |
| 7fee4de6-1886-475e-a3f3-b9c68161c242 | GBM - Compact Optimized Logo + Header v12 (desktop core) | 31 | 13880 | 2936686448 | ESSENTIAL | false | HEAD | `7fee4de6-live.html` (= `deploy/shell-2026/header-v2.html` as built before this work; build reproduces it byte-for-byte) |
| fdc2127a-845a-4d02-b711-438f1a4a86ce | GBM - Sports Home v4 core (fully Wix-served) | 85 | 14152 | 1722435634 | ESSENTIAL | false | HEAD | `fdc2127a-live.html` (repo copy `deploy/wix-served/homepage-embed-cdn.html` is the older V3, not live) |
| a13b04e3-aa21-4528-a0a4-62faa9dd3b95 | GBM - Inner Page UI Layer v1 (Wix-served) | 3 | 13706 | 1064893070 | ESSENTIAL | false | HEAD | `a13b04e3-live.html` |
| c91ad133-194f-4077-b124-3c18cc11d2d7 | GBM - Post formatting normalizer v1 (spacers, all-bold, hand-made subheads) | 4 | 5558 | 877247484 | ESSENTIAL | false | HEAD | `c91ad133-live.html` (contains U+00A0 in `txt()` and U+201D/U+2019 in a regex; kept) |
| a5452619-cb57-4927-9771-3a63f7cb4212 | GBM - Post wide canvas v1 (phones: full-width article column) | 2 | 1543 | 2433794602 | ESSENTIAL | false | HEAD | `a5452619-live.html` |
| 360c9265-3d33-4c5f-99d3-71ac79d011aa | GBM - Permanent Football Roster and Schedule Links | 4 | 5457 | 404958212 | ESSENTIAL | true | HEAD | `360c9265-live.html` (= `deploy/roster-schedule/inserts.html`) |
| 53e15504-76c9-4551-90fe-4defe7cad84d | GBM - Latest page v1 (multi-column news front) | 8 | 13304 | 2918030764 | ESSENTIAL | false | HEAD | `53e15504-live.html` |
| f285a38c-4a2b-43e9-b22d-a66eaeedfb41 | GBM - Share GatorBait v1 (story pages) | 1 | 1003 | 1281193840 | ESSENTIAL | false | HEAD | `f285a38c-live.html` (= `deploy/share-2026/post-share-loader-91523da.html`) |
| 4d3ab24a-dfc1-4ba7-9458-d1bf54ac2135 | GBM - News SEO (NewsArticle + keywords) v1 | 4 | 6495 | 2923250516 | ESSENTIAL | false | BODY_END | `4d3ab24a-live.html` |
| 5ab10e7b-3ea7-497f-a14b-f9f7d796f387 | GBM - FB Pixel ViewContent (articles) v1 | 1 | 557 | 3702192610 | ADVERTISING | false | BODY_END | `5ab10e7b-live.html` |
| 59e31550-1986-4733-8de1-400676b0e8ee | GBM - Keep Reading v1 (article end, 3 newest) | 2 | 3981 | 2175740699 | ESSENTIAL | false | BODY_END | `59e31550-live.html` |
| fb8963cc-9d47-4162-b00d-8a60ca5fac64 | GBM - Policies & Compliance v1 | 4 | 9841 | 26487204 | ESSENTIAL | false | BODY_END | `fb8963cc-live.html` |

All 13 files hash to the values above, which were computed inside the API call on the raw `embedData.html` string and
compared against the saved files (three of them matched existing repo copies byte-for-byte and were copied from there).

## 2. What each v2 changes (rendered result unchanged; selectors, route guards, timers kept unless stated)

`make-v2.mjs` derives each `<id8>-v2.html` from `<id8>-live.html` with exact-match replacements (each must match exactly
once), so everything outside the listed edits is byte-identical to live. The header is the exception: it is built by
`deploy/shell-2026/build.mjs` from `deploy/shell-2026/src/header.src.html` and copied in.

| id | v2 length | v2 djb2 | edits |
|---|---|---|---|
| 5a43ae83 | 10703 | 3652420303 | Post-page observer watches `#SITE_CONTAINER` (falls back to body) and calls `injectAll()` once per animation frame instead of once per mutation batch. Redirect rules, JSON-LD, meta writes, 500/1500/3500 ms timers, 15 s cutoff unchanged. |
| 7fee4de6 | 14120 | 3139560855 | (a) Desktop logo `src` → the 500 px cut `…~mv2.webp/v1/fill/w_500,h_134,al_c,q_85,enc_auto/gatorbait.webp` (26 KB vs 200 KB); `width="900" height="241"` attributes kept. (b) Brand script observer (rename + newsletter close) watches body instead of `<html>` and runs at most once per 100 ms of mutations (was every batch) for the same 12 s. (c) `/contact` watcher checks once per animation frame. Nav order, sync timers 0/200/800/1800/4000/8000, phone drawer, store-tab guard unchanged. Source edited: `deploy/shell-2026/src/header.src.html`; `deploy/shell-2026/header-v2.html` is the rebuilt output. |
| fdc2127a | 14858 | 598061466 | (a) Mobile-shell logo `L=` → the same 500 px cut (aspect 3.731 vs 3.734: rendered height differs by ≤0.05 px inside `max-height:44px` / `width:158px` boxes). (b) Viewport observer watches the viewport `<meta>`'s `content` attribute plus head's direct children, reacting only to an added/removed `<meta>`, instead of every attribute and node under `<head>`. Bootstrap, gazette hides, mobile shell markup, account-tight script unchanged. 142 chars of headroom left. |
| a13b04e3 | 14135 | 3514029755 | `suppressAppInvite()` first reads `document.body.innerText` once and returns unless an app-invite phrase (`join us in our app` / `join our app` / `open in app` / `spaces by wix`+`join`) is on the page; the original per-element `innerText` loop then runs unchanged. Its observer watches body (was `<html>`) with a 100 ms debounce (was 80). Modals, author links, newsletter suppression, route watch, 7 timers, 65 s cutoff unchanged. Edge: an app banner that is already `display:none` when it first appears is hidden by v2 only when it becomes visible (next debounced run or timer), not pre-emptively. |
| c91ad133 | 6265 | 287791892 | One observer on `#SITE_CONTAINER`, armed only on `/post/`, `run()` at most once per 100 ms, released 60 s after each (re)arm; `popstate`/`gbmroutechange` re-arm it or clear `data-gbm-unbold` off `/post/`. `run()`, selectors, attributes, `load` hook unchanged. |
| a5452619 | 2339 | 2003095971 | Observer on `#SITE_CONTAINER` (was whole document), only while `html.gbm-native-wide` (fdc2127a sets it on `/post/`) and `innerWidth<=750`; stops 60 s after each arm; an attribute-only observer on `<html>` plus `resize`/`load` re-arm it. `fit()` unchanged (rAF-coalesced as before). First fit now runs at DOMContentLoaded rather than mid-parse. |
| 4d3ab24a | 6983 | 2895353343 | The 250 ms × 60 poll becomes: one immediate try, a 100 ms-debounced observer on `#SITE_CONTAINER` that disconnects on success, fallback ticks at 1/4/8/15 s, hard stop at 15 s. The 4 s grace before publishing without an author (`n<16`) is kept as `Date.now()-t0<4000`. JSON-LD/keywords content and the second script (author link, 4 timers) unchanged. |
| 5ab10e7b | 639 | 89552181 | `fbq` poll 10 × 1000 ms instead of 25 × 400 ms (same 10 s window, same event payload). |
| fb8963cc | 10103 | 2740013114 | Off `/policies` the boot now returns before creating any observer (live watched the whole document for 15 s on every page). On `/policies` the observer watches `#SITE_CONTAINER`, debounced 100 ms. Page markup/text and the 700/2200 ms retries unchanged. Not added: re-running on client-side navigation into `/policies` (live does not either). |

Not changed (with reasons):

- **360c9265 Roster/Schedule links** — `sync()` returns before creating its observer on every route except `/`, `/magazine`
  and the guide post; on ordinary story pages it costs nothing (harness: 0 callbacks). Its observer is already rAF-coalesced
  and disconnects after 15 s. Left as is.
- **53e15504 Latest page** — confirmed it exits immediately off the blog feed route: `start()` sees neither the feed path
  nor `[data-hook=feed-page-root]`, clears classes and returns without setting the 60 ms interval or observing (0 callbacks,
  0 timers on `/post/`). Left as is.
- **59e31550 Keep Reading** — no observer, three timers and one feed fetch. Nothing to scope. Left as is.
- **f285a38c Share loader** — 800 ms fallback only; its payload `sports-live/src/share.js` keeps an rAF-throttled
  document observer alive on `/post/` (noted per the brief, not changed).

## 3. Verification

`node --check` on every `<script>` block of every live and v2 file: **34/34 pass** (`qa/syntax-check.mjs`).

`qa/embed-qa.mjs` (Playwright, real origin via route interception, 390 px phone) loads each embed alone in a mock Wix story
page, runs 500 body mutations + 250 head-only mutations after `load` (React-style header re-render, new post paragraphs,
replaced viewport meta, a "Join us in our app" banner, a newsletter dialog), then compares the resulting DOM (scripts and
comments stripped; the 500 px logo URL normalised to the live URL) and counts the work the embed did.
`sameDom` was **true for every v2 row**; no page errors. Numbers (live → v2):

| id | route | MO callbacks | DOM queries | innerText reads | timers | observed nodes |
|---|---|---|---|---|---|---|
| 5a43ae83 | /post/ | 123 → 122 | 3278 → 938 | 498 → 138 | 126 → 36 | body+subtree → #SITE_CONTAINER+subtree |
| 7fee4de6 | /post/ | 753 → 502 | 2159 → 111 | 304 → 12 | 9 → 29 | html+subtree → body+subtree |
| fdc2127a | /post/ | 276 → 276 | 303 → 32 | 0 → 0 | 0 → 0 | head+subtree+attr → meta attr + head children |
| a13b04e3 | /post/ | 752 → 500 | 90 → 55 | 8227 → 311 | 29 → 23 | html+subtree → body+subtree |
| c91ad133 | /post/ | 500 → 500 | 1919 → 482 | 0 → 0 | 0 → 20 (debounced runs) | body+subtree → #SITE_CONTAINER+subtree |
| a5452619 | /post/ | 751 → 500 | 153 → 153 | 0 → 0 | 0 → 0 | html+subtree+attr → html attr + #SITE_CONTAINER+subtree+attr |
| 4d3ab24a | /post/ | 0 → 0 | 50 → 50 | 0 → 0 | 4 → 3 | none (author present at first try) |
| 5ab10e7b | /post/ | 0 → 0 | 25 → 25 | 0 → 0 | 18 → 7 | none |
| fb8963cc | /post/ | 750 → 0 | 25 → 25 | 0 → 0 | 2 → 2 | html+subtree → none |
| fb8963cc | /policies | 0 → 0 | 25 → 25 | 0 → 0 | 2 → 2 | none (host present at first try) |
| 360c9265 / 53e15504 / f285a38c / 59e31550 | /post/ | 0 (live only) | 25–29 | 0 | 0–3 | none |

Reading the table: when all mutations land inside the page container the callback count cannot drop (c91ad133,
5a43ae83); the saving is in what each callback does (queries 1919 → 482, innerText 8227 → 311, 3278 → 938). Head-only
mutations, which Wix produces for every chunk it loads, no longer reach the body/container-scoped observers (753 → 502).
Real-page gains will be larger than the harness shows because production has popups, comments and the Wix header
mutating outside `#SITE_CONTAINER`, and thousands more elements for the old per-element `innerText` loop to walk.

Shell QA (`deploy/shell-2026/qa/qa-shell.mjs`, header-v2 + footer-v2 vs the rev 30 header at 320/390/430/1024/1366 on six
routes): **353/353 before this change (header-v2 = live rev 31) and 353/353 after** (rebuilt header with the logo cut and
the debounced brand observer). `deploy/shell-2026/qa/results.json` and `shots/` were refreshed by that run.

Re-run: `NODE_PATH=<dir with playwright+esbuild> PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node deploy/speed-2026/embeds/qa/embed-qa.mjs`
(optionally `<id8> …`), `node deploy/speed-2026/embeds/qa/syntax-check.mjs`, `node deploy/speed-2026/embeds/make-v2.mjs`.

## 4a. Deployed Sept. 30, 6:35–6:50 p.m. ET (Jarvis)

All nine PATCHes went through with the rev + djb2 guard; the API echoed the new body length and hash for each. New revisions (the rollback needs these): fb8963cc **5**, 5ab10e7b **2**, 4d3ab24a **5**, c91ad133 **5**, a5452619 **3**, 5a43ae83 **19**, a13b04e3 **4**, 7fee4de6 **32**, fdc2127a **86**. Records in #34 (two comments). Live verification: `shots/perf-story-after`, `shots/shell-v3-home`, `shots/shell-v3-story` (results in `deploy/speed-2026/`).

## 4b. Sitewide typography embed (Sept. 30, 8:25 p.m. ET)

`0709a98e-e95f-42e1-99a8-5f018ad85457` "GBM - Sitewide Barlow Typography v1", BODY_END, ESSENTIAL, loadOnce false: rev 5 → **6**. The V4 Home Code loader (622d8ece rev 29) carries the Barlow + Barlow Condensed stylesheet and the font preconnects in `<head>` on every page, so this embed now holds only the `sitewide-type.css` link (`0709a98e-v2.html`, 323 / 1386119782). Rollback: PATCH `0709a98e-live.html` (401 / 3507264639) back with the current revision; if the loader is ever returned to V3, restore this one in the same step.

## 4. PATCH order for Jarvis

Endpoint (from https://dev.wix.com/docs/api-reference/business-management/custom-embeds/update-custom-embed):
`PATCH https://www.wixapis.com/embeds/v1/custom-embeds/{id}` with body
`{"customEmbed":{"id":…,"revision":"<current>","name":<as read>,"enabled":true,"loadOnce":<as read>,"position":<as read>,"embedData":{"category":<as read>,"html":<file contents>}}}`.
`embedData.category` is required on every update; re-send name/enabled/loadOnce/position exactly as read so nothing else
moves. Read the embed once more right before each PATCH and use the revision from that read (the table below is as of the
Sept. 30 read). After each PATCH the revision increments by 1; the response echoes the new one — record it, it is what the
rollback needs. One embed at a time, verify, then the next. Suggested order (lowest blast radius first; the two shell
embeds last):

| # | id | name | rev now | send html from | new length | new djb2 | category |
|---|---|---|---|---|---|---|---|
| 1 | fb8963cc-9d47-4162-b00d-8a60ca5fac64 | GBM - Policies & Compliance v1 | 4 | `fb8963cc-v2.html` | 10103 | 2740013114 | ESSENTIAL (BODY_END, loadOnce false) |
| 2 | 5ab10e7b-3ea7-497f-a14b-f9f7d796f387 | GBM - FB Pixel ViewContent (articles) v1 | 1 | `5ab10e7b-v2.html` | 639 | 89552181 | ADVERTISING (BODY_END, loadOnce false) |
| 3 | 4d3ab24a-dfc1-4ba7-9458-d1bf54ac2135 | GBM - News SEO (NewsArticle + keywords) v1 | 4 | `4d3ab24a-v2.html` | 6983 | 2895353343 | ESSENTIAL (BODY_END, loadOnce false) |
| 4 | c91ad133-194f-4077-b124-3c18cc11d2d7 | GBM - Post formatting normalizer v1 | 4 | `c91ad133-v2.html` | 6265 | 287791892 | ESSENTIAL (HEAD, loadOnce false) |
| 5 | a5452619-cb57-4927-9771-3a63f7cb4212 | GBM - Post wide canvas v1 | 2 | `a5452619-v2.html` | 2339 | 2003095971 | ESSENTIAL (HEAD, loadOnce false) |
| 6 | 5a43ae83-690e-4933-971d-4837db00b2f3 | GBM - Site Fixer v7.2 (no street address) | 18 | `5a43ae83-v2.html` | 10703 | 3652420303 | ESSENTIAL (HEAD, loadOnce false) |
| 7 | a13b04e3-aa21-4528-a0a4-62faa9dd3b95 | GBM - Inner Page UI Layer v1 (Wix-served) | 3 | `a13b04e3-v2.html` | 14135 | 3514029755 | ESSENTIAL (HEAD, loadOnce false) |
| 8 | 7fee4de6-1886-475e-a3f3-b9c68161c242 | GBM - Compact Optimized Logo + Header v12 (desktop core) | 31 | `7fee4de6-v2.html` | 14120 | 3139560855 | ESSENTIAL (HEAD, loadOnce false) |
| 9 | fdc2127a-845a-4d02-b711-438f1a4a86ce | GBM - Sports Home v4 core (fully Wix-served) | 85 | `fdc2127a-v2.html` | 14858 | 598061466 | ESSENTIAL (HEAD, loadOnce false) |

Before sending, confirm the file is what this index says: `node -e` with the djb2 above, or `qa/syntax-check.mjs` plus a
length check. Custom embeds go live on the next render with no site publish (do not publish; Lesson 47).

### Live verification after each PATCH (real browser, 390 and 1366, not the API read alone)

Story page for all: `https://www.gatorbaitmedia.com/post/the-looming-brilliance-of-buster-faulkner-if-it-works-one-time-we-retire-it`.

| id | look for |
|---|---|
| fb8963cc | `/policies`: the "Policies & Subscriber Terms" layout (`#gbm-legal`) still replaces the native block, nav chips work. Story page: no `gbm-legal` class on `<html>`, no console error. |
| 5ab10e7b | Story page with a Pixel-enabled session: one `ViewContent` in the Meta Pixel helper / network `tr?ev=ViewContent` within 10 s. |
| 4d3ab24a | Story page `<head>`: `script#gbm-news-ld` (NewsArticle, author = byline name), `meta[name=keywords]` and `meta[name=news_keywords]` present; byline shows the small `gatorbaitmedia.com` link; no avatar. |
| c91ad133 | Story page `<html data-gbm-nr="ok-…">`; hand-made subheads render as orange-bar uppercase blocks, spacer paragraphs hidden; all-bold stories un-bolded; still correct after scrolling and after a client-side hop Latest → story. |
| a5452619 | 390 px: article column is full width (no 320 px centered strip), still full width 30 s later and after rotating; desktop unchanged. |
| 5a43ae83 | Story page: `document.title` = headline + " \| GatorBait Media", og/twitter metas set, "Published <date>" line under the title; `/contact-form`, `/blog/x`, `/category/all-products` still redirect. |
| a13b04e3 | Story page: "Follow / alerts" pill after the byline opens the writer modal; no Wix newsletter popup or "Join us in our app" bar shows; Escape closes modals; account menu item on phone `#SITE_HEADER` (hidden by the shell). |
| 7fee4de6 | 1366 px story page: desktop header with the logo (request URL now ends `/gatorbait.webp`, ~26 KB, still 250 px wide), nav order Front Page…Shop Gear ↗, "Latest" current; 390 px: phone bar has the Shop button, drawer order intact; newsletter popup gets the round × and "Quick Reads" wording. |
| fdc2127a | 390 px: phone bar + drawer with the same logo (26 KB request), viewport is `width=device-width` on `/post/` and the native `width=320` on `/account/my-account`; homepage still mounts the Front Page (`#gbm-live`) with no old-shell flash. |

Then re-run the phone speed probe on the story page and compare TBT / long tasks with `perf-story-before-fba3a35.json`.

### Rollback (per embed, independent)

`PATCH` the same id with `embedData.html` = the matching `<id8>-live.html` (lengths/hashes in §1), the same category, and the
revision returned by the forward PATCH (current+1). For 7fee4de6 the same body is also `deploy/shell-2026/header-v2.html`
at commit `6720745` (pre-change build) — the file in the working tree is now the speed build.

## 5. Working-tree changes (nothing committed, nothing pushed, no secrets)

- `deploy/speed-2026/embeds/*-live.html` (13, verbatim), `*-v2.html` (9), `make-v2.mjs`, `qa/embed-qa.mjs`,
  `qa/syntax-check.mjs`, `qa/results.json`, this `INDEX.md`.
- `deploy/shell-2026/src/header.src.html` (logo cut, debounced brand observer, rAF contact watcher) and the rebuilt
  `deploy/shell-2026/header-v2.html`; `deploy/shell-2026/qa/results.json` + `qa/shots/` refreshed by the QA run.
  `deploy/shell-2026/README.md` still describes header-v2 as the shell handoff; update it when this ships.
