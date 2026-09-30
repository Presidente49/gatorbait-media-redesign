# Front-end payload and load path — bundle analysis (Sept. 30, 2026)

Read-only analysis of our own JavaScript on the homepage and `/post/` pages. No Wix write, no commit, no push.
Repo: `Presidente49/gatorbait-media-redesign` at `main` HEAD `4089fb2`; `sports-live/current.json` → `fba3a358`.

Legend: **[V]** verified in this repo or by a live HTTP read from this sandbox · **[E]** estimate derived from verified numbers · **[U]** not verifiable from here (the sandbox proxy refuses `cdn.jsdelivr.net`, `presidente49.github.io`, `static.wixstatic.com` and `gatorbaitmedia.com`; `raw.githubusercontent.com`, `fonts.googleapis.com`, `fonts.gstatic.com` and `registry.npmjs.org` answered).

Measurement tools: `esbuild` 0.28.1 (scratchpad `node_modules`, not used by the build today), Node `zlib` gzip level 9 and brotli quality 11. Minified outputs were written only under the scratchpad (`…/scratchpad/min/`).

## Headline numbers

| Asset | Raw | gzip | brotli | Minified (esbuild) | min+gzip | min+brotli |
|---|---:|---:|---:|---:|---:|---:|
| `sports-live/homepage.js` (homepage) [V] | 244,409 | 68,841 | 55,526 | 188,192 | 54,994 | 46,073 |
| `sports-live/share.js` (`/post/`) [V] | 64,875 | 21,208 | 17,448 | 42,084 | 14,321 | 12,632 |
| tsparticles slim 3.9.1 bundle (loaded on every homepage visit) [V, from the npm tarball] | 152,671 | 42,153 | 36,665 | already minified | — | — |
| Google Fonts CSS (8 faces, all subsets) [V] | 10,274 | (gzip on the wire) | — | — | — | — |
| Barlow/Barlow Condensed latin woff2, 8 faces [V] | 123,020 | n/a | n/a | — | — | — |

Homepage JS from us plus the particle library: **397,080 bytes raw, ~111 KB gzip** before any image. Of the 244,409 in `homepage.js`, **70,771 bytes (29%) cannot run on the homepage today** (see §1).

The output is **not minified** [V]: `build-front-page.mjs` only strips CSS comments and leading whitespace (`minCss`), concatenates the JS sources verbatim, and embeds the CSS as a JSON string. esbuild is present in the repo tooling (used by `deploy/shell-2026/build.mjs` through `NODE_PATH`) but not by this build.

## 1. `homepage.js` by part

Computed the way `sports-live/build-front-page.mjs` composes the file (CSS after `minCss`, then `JSON.stringify` for the string literal). [V]

| Part | Bytes in `homepage.js` | Share | Runs on the homepage today? |
|---|---:|---:|---|
| CSS string literal (`front-page.css` 41,421 stripped + `make-the-call.css` 7,473 stripped, escaped) | 49,420 | 20.2% | `front-page.css` yes; `make-the-call.css` (≈8,000 escaped) is injected into `<style>` but no `.gbm-call` markup ever exists → parsed for nothing |
| `src/front-page.js` runtime | 67,012 | 27.4% | yes (the renderer) |
| `src/share.js` | 23,640 | 9.7% | yes: Share buttons on The Road Ahead, The Tunnel, the show |
| `src/capture.js` | 22,502 | 9.2% | yes: the hub signup (`GBM_CAPTURE.html('home')`); its three `/post/` placements (inline, end, slide-up bar) are dead here (≈1/3 of the file [E]) |
| `src/story-kit.js` | 18,447 | 7.5% | **no** — line 25 `if (location.pathname.indexOf('/post/') !== 0) return;` |
| `src/make-the-call.js` | 12,425 | 5.1% | **no** — mounts only if `deploy/cloudflare/endpoints.json` names a Worker; the file does not exist in the repo and README records a 404 on Pages |
| `src/ask-gatorbait.js` | 15,205 | 6.2% | **no** — same gate |
| `src/the-stands.js` | 16,545 | 6.8% | **no** — same gate, and game day only |
| `BUNDLE` JSON | 18,194 | 7.4% | yes: `posts[]` 16 stories = 11,685 (excerpts capped at 320 chars = 3,191; image URLs 1,937); config incl. 20-game schedule = 6,500 (schedule 1,976) |
| Header comment, IIFE wrapper, separators | 1,019 | 0.4% | — |
| **Total** | **244,409** | 100% | |

Dead weight on the homepage today [V, measured by rebuilding the bundle without those parts]:

| Variant | Raw | gzip | brotli | Saved raw | Saved gzip | Saved brotli |
|---|---:|---:|---:|---:|---:|---:|
| A. Today | 244,409 | 68,841 | 55,526 | — | — | — |
| C. Without the three fan modules + `make-the-call.css` | 192,086 | 54,476 | 45,114 | 52,323 | 14,365 | 10,412 |
| B. Without fan modules and `story-kit.js` | 173,638 | 48,621 | 41,291 | **70,771 (29%)** | **20,220 (29%)** | **14,235 (26%)** |
| B + esbuild minify (CSS and JS) | 134,950 | 39,761 | 34,397 | 109,459 (45%) | 29,080 (42%) | 21,129 (38%) |
| Runtime + CSS + BUNDLE only, minified (no Share/Capture) — for scale | 104,154 | 29,502 | 26,025 | | | |

Per-part minify/compress (each file alone) [V]:

| File | Raw | gzip | brotli | min | min+gz | min+br |
|---|---:|---:|---:|---:|---:|---:|
| front-page.js | 67,012 | 20,800 | 18,101 | 48,137 | 16,597 | 14,726 |
| share.js (src) | 23,640 | 8,414 | 7,362 | 16,243 | 6,555 | 5,842 |
| capture.js | 22,502 | 7,989 | 6,750 | 14,310 | 5,435 | 4,640 |
| story-kit.js | 18,447 | 7,041 | 6,114 | 11,482 | 4,810 | 4,208 |
| make-the-call.js | 12,425 | 4,879 | 4,240 | 8,489 | 3,743 | 3,306 |
| ask-gatorbait.js | 15,205 | 5,133 | 4,344 | 12,494 | 4,309 | 3,652 |
| the-stands.js | 16,545 | 6,110 | 5,298 | 12,107 | 4,851 | 4,225 |
| front-page.css (raw source) | 44,058 | 9,375 | 8,189 | 40,643 | 7,958 | 7,066 |
| front-page.css + make-the-call.css | 52,037 | 10,702 | 9,317 | 47,998 | 9,044 | 7,991 |

Other homepage costs inside the bundle that are live but worth knowing:
- `share.js` on the homepage arms a `MutationObserver` on `documentElement` (subtree) for up to 90 s plus a 500 ms × 8 retry interval until a Share button exists [V]. Cheap, but it runs during the Wix hydration storm.
- `front-page.js` runs a 1 s `setInterval` for countdowns/show status while the page is visible, a 30 s interval for The Road Ahead, and the ticker CSS animation [V].
- With `look: "swamp-night"` the embers are on for every visitor without `prefers-reduced-motion` (`modes()`: `embers = night && (… || always …)`), so **tsparticles (152,671 raw / 42,153 gz) is fetched from `cdn.jsdelivr.net/npm` on every homepage visit** and animates 45 (phones) or 80 particles at 40 fps in the lead [V].

## 2. `share.js` as loaded on `/post/` pages

`sports-live/share.js` (64,875) = `src/share.js` 23,640 + `src/capture.js` 22,502 + `src/story-kit.js` 18,447 + 286 bytes of comments/newlines. [V]

| Part | Bytes | Used on `/post/`? |
|---|---:|---|
| share.js | 23,640 | yes — "Share this story" button, card drawing, sheet. Unused there: the homepage-surface code (season/tunnel/show buttons, `season()`, `tunnel()`, the `SHOW` schedule, their `payload`/`draw` branches) ≈ 3,800–6,000 bytes [E; 35 of 278 lines match those surfaces] |
| capture.js | 22,502 | yes — inline signup after the 4th paragraph, the Story Kit end card, the slide-up bar. Unused: the `home` placement ≈ 1,400 bytes [E] |
| story-kit.js | 18,447 | yes — guide strip, first-mention links, "Keep up with the Gators" |

So roughly 90% of `share.js` is live on story pages; the win there is minification (−22,791 raw, −6,887 gzip [V]) rather than splitting. On `/post/` the bundle also fetches `scoreboard.json` from Pages at load (story-kit, 3 s timeout) and, on first tap, share.js fetches `scoreboard.json` again only if story-kit's copy is not in memory (they do not share state) and `gazette-live/posts.json` unless `sessionStorage['gbm-public-feed']` exists [V]. Both keep a permanent `MutationObserver` on `documentElement` for the life of the page (Wix re-renders the post header after hydration) [V].

## 3. Load path (homepage, cold cache)

The task brief says the loader follows `current.json` then loads from `raw.githubusercontent.com` or Pages. **That is not what the live loader does** [V]: `deploy/front-page-2026/home-code-loader-4cc4ad3.html` (V3, live as Home Code `622d8ece` rev 28) reads `current.json` from **GitHub Pages** and loads `homepage.js` from **`cdn.jsdelivr.net/gh/…@<commit>/`**. `raw.githubusercontent.com` could not work as a script host anyway: a live read today returned `content-type: text/plain` with `x-content-type-options: nosniff` (browsers refuse to execute that as a script), `cache-control: max-age=300`, gzip, 68,861 bytes on the wire [V].

Sequential hops before first paint:

| # | Hop | Host | Blocking? | Notes |
|---|---|---|---|---|
| 0 | Wix HTML with our inline HEAD embeds | `www.gatorbaitmedia.com` | Wix's own | Inline: core `fdc2127a` (14,152 chars; V4 bootstrap + mobile shell), Home Code `622d8ece` (1,063-char V3 loader), and the **old Gazette "Home Data" (`window.__GBM_HOME_FALLBACK__`) and "Home Styles" `1255a4cf` (`#gbgz-styles`)**. Per the rev 84 snapshot in `deploy/store-handoff/`, the V4 core only calls `__GBM_HOME_JS__()` once all three (`code`, `data`, `styles`) exist; at `DOMContentLoaded` it otherwise reveals the native page ("missing …"). That gate is parse-order, not a network wait, but it means the old renderer's data and CSS (up to 15,000 chars each; contents not in this repo [U]) still ship in every homepage HTML, and `front-page.js` neutralises `#gbgz-styles` after paint (`old.media = 'not all'`). Rev 85 is live now (same length 14,152 per the shell fixture) — bootstrap assumed unchanged [U]. |
| 1 | `GET presidente49.github.io/…/sports-live/current.json?t=<minute>` | GitHub Pages | **Yes, sequential**: the `<script>` for `homepage.js` is only created after this resolves, or after the **800 ms** race timer fires (then the baked commit is used) | `cache: 'no-store'`, minute-stamped URL → never from HTTP cache. Same pattern in the `/post/` share loader. Worst case adds 800 ms; typical adds one full RTT + TLS to a host the page has not touched yet (no preconnect). |
| 2 | `GET cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@<sha>/sports-live/homepage.js` | jsDelivr | `async` script, but nothing paints until it runs | 244,409 raw; expect ~68.8 KB gzip / ~55.5 KB brotli on the wire [E from local compression; jsDelivr's actual headers not readable from here — jsDelivr documents brotli+gzip and a one-year immutable cache for commit-pinned `/gh/` URLs [U]]. |
| 3a | `GET fonts.googleapis.com/css2?family=Barlow…&display=swap` | Google | The renderer withholds paint until `document.fonts.load()` resolves for Barlow 400 and Barlow Condensed 800, **capped at 900 ms** (`ensureFonts`) | Injected by JS after the bundle executes, so it starts only after hop 2. Live headers: `cache-control: private, max-age=86400`, gzip; body 10,274 bytes, 24 `@font-face` (3 subsets × 8 faces), `font-display: swap` on all [V]. |
| 3b | woff2 files | `fonts.gstatic.com` | same 900 ms cap | 8 latin faces = 123,020 bytes (14.8–15.8 KB each), `cache-control: public, max-age=31536000` [V]. Second new host on the critical path, again without preconnect. |
| 3c | `GET presidente49.github.io/…/sports-live/scoreboard.json?t=<minute>` (2.5 s timeout) and `GET /blog-feed.xml?t=<minute>` (same-origin, 4 s timeout; falls back to `gazette-live/posts.json` on Pages, 17,521 bytes) | Pages + Wix | Paint gate: `fontsDone && ((feedData && (scoreDone || deadline)) || deadline)`, `deadline` = **1.5 s** | Both `cache: 'no-store'` + minute stamp. `scoreboard.json` is 5,253 bytes in the repo. Repeat visit inside 15 min: `feedData` comes from `sessionStorage` at once, **but paint still waits for the scoreboard fetch or the 1.5 s deadline** (and fonts). |
| 4 | First paint; story `<img>`s are created now | `static.wixstatic.com`, `i.ytimg.com` | — | The LCP image is discovered only after hops 1→2→3, i.e. the fourth sequential network step at best. `fetchpriority="high"` on the lead helps once discovered but cannot start it earlier. |
| 5 | +50 ms: `GET …/deploy/cloudflare/endpoints.json?t=<minute>` (800 ms timeout) | Pages | after paint | **404 on every visit today** (file absent from the repo); one wasted request and a new `AbortController` timer per view [V]. |
| 6 | `GET cdn.jsdelivr.net/npm/@tsparticles/slim@3.9.1/tsparticles.slim.bundle.min.js` | jsDelivr | after paint (`embers()` in `render`) | 152,671 raw / 42,153 gz [V]; then a 40 fps canvas loop in the lead. Competes with the lead image and fonts for bandwidth and main thread right after paint. |

Fetched more than once / cache behaviour [V]:
- `current.json`: once per homepage view and once per `/post/` view, always `no-store`.
- `scoreboard.json`: homepage: once at start (front-page.js); share.js fetches it only on first tap and only if not already in its own memory. `/post/`: story-kit at load, share.js again on first tap (separate copies; no shared cache). All with `no-store` + minute stamp, so GitHub Pages' documented default `Cache-Control: max-age=600` [U] never helps.
- `posts.json`: only as fallback (RSS failure) or by share.js when `sessionStorage` is empty.
- No request is preloaded or preconnected; there is no `<link rel=preconnect>` anywhere in the live embeds or `front-page.js` [V].

Artificial waits [V]:
- 800 ms pointer race in the V3 loader (hop 1) — a real stall when Pages is slow, and a hard sequential RTT when it is fast.
- 900 ms font race and 1.5 s paint budget in `start()` — safety caps, not fixed delays, but on a repeat visit the scoreboard fetch (not the feed) is what usually decides when the page paints.
- The **15 s "render timeout"** in the V4 core (`fdc2127a`) and the 7 s startup timeout in the older CDN embed are watchdogs that reveal the native Wix page if we never call `ready()`; they do not delay anything. Nothing polls for a "front page root" — the old `home-code-rev22.html` Gazette body is not in the chain any more.

## 4. Fonts [V]

- Loaded by JS: `front-page.js` `ensureFonts()` appends `<link id="gbm-fp-fonts" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap">` after the bundle executes. `ask-gatorbait.js` would inject the same link (guarded), but never mounts.
- No `preconnect`/`dns-prefetch` to `fonts.googleapis.com` or `fonts.gstatic.com`; no `preload` of woff2; no self-hosting.
- `display=swap` is on every `@font-face` (24/24), so the browser would paint fallback text — but our renderer itself holds the first paint until the two probe faces load or 900 ms pass, so on a cold phone the page typically pays close to the full 900 ms.
- All 8 requested faces are referenced by `front-page.css`: Barlow 400/500/600/700/800 in 4/5/11/26/45 rules, Condensed 600/700/800 in 2/19/38 rules (`--fp-cond` used in 61 rules). Barlow 500 and Condensed 600 are the low-use ones (≈30.5 KB of woff2 between them).
- The CSS itself never blocks render in the CSSOM sense: it is a JS string injected as `<style id="gbm-fp26-styles">` in the same task that inserts the DOM. The only "blocking CSS" is Wix's own plus the old `#gbgz-styles` in the HTML head (size unknown here [U]).
- `/post/` pages: `share.js` waits (with a race) on `Barlow Condensed 800` for the card, but nothing on `/post/` loads Google Fonts; whether Barlow is present there depends on the Wix theme [U].

## 5. Images [V]

- `img(src, alt, eager, w, h)` in `front-page.js` emits `<img src loading="lazy|eager" decoding="async" [fetchpriority="high"] width="1000" height="667">`. Only the lead is `eager` + `fetchpriority=high`; everything else is `loading="lazy"`.
- **No `srcset`, no `sizes`.** One URL is used at every viewport from 320 px to 1440+ px.
- The URL is the feed's enclosure URL unchanged. All 16 bundled stories use the shape `https://static.wixstatic.com/media/<id>~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png` (widths 672–1000; `w_1000,h_1000` for 11 of 16). The trailing **`file.png`** asks Wix's image service for PNG output — lossless, typically several times a q_80 JPEG/WebP of the same pixels [E; actual bytes not readable from this sandbox]. None use `enc_auto`/`enc_avif`, `/v1/fill/`, or a `.jpg`/`.webp` output name.
- `width/height` are fixed at 1000×667 regardless of the feed's stated 1600×900; the frame is CSS-sized, so no CLS from that, just misleading intrinsic ratios.
- Show/clips thumbnails come from `i.ytimg.com/vi/<id>/hqdefault.jpg` (480×360) — fine.
- The hero is discovered post-paint (see §3 hop 4); there is no image preload.

## 6. Ranked optimizations

Byte figures are measured [V] unless marked; millisecond figures are ranges from the number of eliminated sequential round trips on a mobile connection (one new-host TLS round trip commonly costs 100–300 ms on 4G) and are estimates [E]. All are reversible with one build or one pointer change; items that touch a Wix embed need the controller.

| Rank | Change | Saves | Effort | Risk | Where |
|---|---|---|---|---|---|
| 1 | **Strip the dormant parts from `homepage.js`**: skip the three fan modules and `make-the-call.css` until `deploy/cloudflare/endpoints.json` exists in the repo, and drop `story-kit.js` from the homepage bundle (it already ships in `share.js` for `/post/`). Also skip the `endpoints.json` fetch (a guaranteed 404 + timer) under the same build flag. | **−70,771 raw, −20,220 gzip, −14,235 brotli** (29% of the bundle) on every homepage view, plus one 404 request. | Small: ~10 lines in `build-front-page.mjs` behind a `MODULES` flag; rebuild; run `qa-front-page.mjs`; point `current.json`. | Low. Nothing mounts today anyway; re-enable with one flag when Workers exist. Check the QA harness does not assert `window.GBM_CALL` etc. | build |
| 2 | **Load tsparticles after the page is idle, not at paint** (`requestIdleCallback`/`load` event, only when the lead is in view and not on Save-Data or narrow phones), or make embers desktop-only via config. | Removes **152,671 raw / 42,153 gzip** of third-party JS and a 40 fps canvas loop from the critical window on every homepage visit — 62% the size of our own bundle. Keeps the Swamp Night look; embers simply fade in a second later. | Small: `embers()` already defers to script `load`; add the idle gate. | Low–medium (visual timing; Brenden's chosen look). Reversible by config. | `front-page.js` |
| 3 | **Minify with esbuild in the build** (`transformSync({minify:true, target:'es2017'})` for JS, `loader:'css'` for the CSS string). esbuild is already in the repo's tooling for `deploy/shell-2026`. | `homepage.js` −56,217 raw / −13,847 gzip; `share.js` −22,791 raw / −6,887 gzip. Combined with #1: **134,950 raw / 39,761 gzip / 34,397 brotli vs 244,409 / 68,841 / 55,526 today (−42% gzip)**. Also less parse time on phones. | Small–medium: keep the header comment (`legalComments`), keep `MAX_JS`, make sure `--check`, `frame.html`, `test-loader.mjs` and the `data-fp-build` stamp still work; the QA harness matches by DOM, not by source text. | Low–medium: minifier bugs are rare at ES2017 but verify the fixtures at 320/390/430/1366 before pointing `current.json`. | build |
| 4 | **Preconnect from the loader embed** (`622d8ece`, 1,063 chars, cap 15,000): add `<link rel="preconnect">` for `cdn.jsdelivr.net`, `presidente49.github.io`, `fonts.googleapis.com`, `fonts.gstatic.com` (crossorigin) and `static.wixstatic.com`, and inject the Google Fonts `<link>` from the loader so the font CSS downloads in parallel with the 244 KB bundle instead of after it. Optionally drop Barlow 500 and Condensed 600 (−30,484 bytes of woff2, 7 CSS rules to re-weight). | One TLS setup per host off the critical path (~100–300 ms each on mobile [E]); fonts arrive ~one bundle-download earlier, so the 900 ms font gate rarely binds. | Small, but it is a Wix embed PATCH (controller-owned, one object, guarded by length/hash as usual). | Low. Rollback = previous loader file. | Wix embed `622d8ece` |
| 5 | **Take the pointer hop off the critical path.** Options: (a) serve `homepage.js` straight from GitHub Pages (`presidente49.github.io/…/sports-live/homepage.js`), which removes hop 1 entirely and the 800 ms worst case; deploy = merge to `main` (Pages ~1 min + its documented 10-min cache [U]); rollback = revert on `main`. (b) Keep jsDelivr but cut the race timer to 300–400 ms and add `preconnect` (item 4). (c) Inline `current.json`'s commit into the loader on each deploy (what V2 did) — no. | (a): one sequential round trip (~100–400 ms [E]) plus the 800 ms stall case on every homepage and `/post/` view. | (a) small loader change + one Pages behaviour check (correct `content-type: application/javascript` and compression; not verifiable from here [U]). | Medium: you lose commit-pinned immutability on the URL (mitigate with `?v=<sha>` from a tiny pointer or accept the 10-min cache window). Discuss with the controller before changing the delivery contract in `deploy/front-page-2026/README.md`. | loader |
| 6 | **Right-size images in `img()`**: for `static.wixstatic.com` sources rewrite the Wix transform to `/v1/fill/w_<W>,h_<H>,al_c,q_80,enc_auto/file.jpg` (or `.webp`) and emit `srcset` at 480/800/1200 with `sizes`; keep the `safeUrl` host allowlist. Phones then get ~480–800 px WebP/JPEG instead of a 1000 px lossless PNG. | Per image typically 3–8× fewer bytes than PNG at the same pixels [E; verify one URL in a browser first since the sandbox cannot reach `static.wixstatic.com`]; the lead is the LCP element on every viewport. | Small: one function; the PNG→`enc_auto` claim must be checked on one real URL. | Low–medium: a wrong param 404s the image — test the exact transform on one image before rolling to all. | `front-page.js` |

Also worth doing, smaller or needing a decision:
- **Paint sooner on repeat visits**: when `feedData` is already in `sessionStorage`, paint with the bundled schedule immediately and let `patchScores` update the board (that patch path already exists), instead of waiting for `scoreboard.json` or the 1.5 s deadline. Saves up to 1.5 s of blank time on the second view; zero bytes. Risk: the "paint once, never repaint" rule already allows in-place value patches, so structure is unchanged.
- **Merge the small Pages JSONs** (`scoreboard.json` + a future `endpoints.json` + schedule) into one file and let the browser cache it for the 60 s window instead of `no-store`: one fewer request per view.
- **Old Gazette Home Data / Home Styles embeds**: still inline in the homepage HTML and still gating startup in the V4 core (`code`+`data`+`styles`). Removing that dependency needs a core `fdc2127a` change and a homepage-only test; potential save up to ~30 KB of HTML per homepage view [U — contents not in this repo]. Controller decision; not a build change.
- **`share.js` observers**: on the homepage disconnect the `MutationObserver` as soon as `gbm:gazette-ready` fires instead of waiting for a Share button or 90 s (small main-thread win during Wix hydration).

## What was not measured and why

- Actual on-the-wire headers and sizes from `cdn.jsdelivr.net`, GitHub Pages, `static.wixstatic.com` and `www.gatorbaitmedia.com`: the sandbox proxy answered 403 to those CONNECTs. Compression numbers above are local gzip-9/brotli-11 of the exact files; jsDelivr and Pages both serve compressed responses per their documentation, so the real transfer sizes should be close to those columns.
- Wix's own HTML/JS weight and the Home Data/Home Styles embed sizes: no live capture in the repo (`sports-live/frame.html` is a fixture, not the live page).
- Real paint timings: no Lighthouse/CrUX data in the repo; `qa/live-shots` runs record screenshots, not timings. The next step, if wanted, is one WebPageTest/Lighthouse mobile run against `/` before and after items 1–3 to put milliseconds beside these byte counts.
