# GatorBait Media homepage audit (read-only), Oct. 15, 2026

Scope: live https://www.gatorbaitmedia.com/ plus one article, /pricing-plans/subscribe, /the-buddy-martin-show and /magazine. Code read from `origin/main` at `52b9845`. No Wix API calls, no writes, no publish.

Method: 7 Firecrawl scrapes with `maxAge: 0` (homepage desktop and mobile; article mobile; /plans-pricing; /pricing-plans/subscribe mobile; /the-buddy-martin-show mobile; /magazine mobile). Firecrawl's desktop render is 1920 px wide. Its mobile render is 360 px wide. Both are emulation, not tests on a real phone. Anything that may be a scraper artifact is marked **(verify)**.

## Screenshots (signed Firecrawl URLs, valid until about 2026-10-21)

Local copies are in `/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/shots/`:
- `desktop.png` (1920x3739). Crops: `live-d0.png`, `live-d1.png`, `live-d2.png`. Lead-area zoom: `lead-zoom.png`.
- `mobile.png` (360x6120). Crops: `live-m0.png` … `live-m4.png`.
- `article.png`, `article-top.png`, `article-end.png`, `pricing.png`, `show.png`, `show-top.png`.

Remote URLs:
- Homepage, desktop full page: https://storage.googleapis.com/firecrawl-scrape-media/screenshot-7b9e19ab-dae1-4823-a392-8436f2c632b2.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1792681380&Signature=MAuisFw1wd1A6PN8Xp3E231tCWrd4kAQm3vQZFIP7jfPZ5mGCWEioc0gQ31uiR3USvXScaE0JV1HtBMJ41dB0OleCvUxJwWgXUpLxl%2BBGafkWzqV1pVqymBv%2FUc%2BkVJ697zv6imN1z6o5wDFv79oShxRp3FXkeckVDehoFyuIVeOIIFauN6ZcwKf9AxQDywAanBp%2BG%2FEvCkTwoYpM8%2F3ZWd7paC9mPEiyM7EthhpDyKUgZHtceLP9KN3ZMaCAD1degi%2BW%2BbnO2haV5d3aIMogVC50cXhUUqHgDTfj8A3%2FI7arsFkSl5OiV2UPMXo%2B%2FyLKA9%2FYOpPfsB0yzlOho2Whw%3D%3D
- Homepage, mobile full page: https://storage.googleapis.com/firecrawl-scrape-media/screenshot-5cb67b42-daca-4ff2-b454-b1c8319844ed.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1792681364&Signature=VSyZq0SKoL0NKNHO7svjd%2BVWinb3kvrWhyNHxfBCRgy4ZVSjtSjX5pKXQLr1%2FwX%2BjkKIanfrsmazq4LF9nAh7CWBKtOG7WERHxscQssBFvmKQzZJRMXW%2FU4olKbx5Cpge8xmMcxiZvgJh8k14N2Qtg7F%2FoZfkcIqh86mkKSA2SwVEKKS3mt8oml4YOESvpfqqIHw9tZyD2vOGVvDsYIxHiT1mNFy6ZDzbwQJVltDF3wfWUbicIzuCimLvUpZIYC%2Fgb8D%2FXpz54XkQq8X44jxqeQlhFLV1Bh2uupiEjZVFA%2FQ0rBuA8JkpRMq2NCMIU0PK1%2B7h4yjw06ZdA11VLr8OA%3D%3D
- Article (Philo), mobile: https://storage.googleapis.com/firecrawl-scrape-media/screenshot-7ad5d170-6728-45c1-9047-52c4097294a6.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1792681441&Signature=KzbRixBhGVke7U6cDF3hmwsMPsuC3cP%2Fx9Ey8AdU9rWyOOkvxS40nL0d5B%2Bx4w6%2BKOM0NYPL6tvgNVx3Z8aS7jRRo9%2FkoVSBiybl%2ByU%2Fq0q%2F986hmr%2B3WjkabWG%2BbnFvkbyd8o0BqxRWqVPuZgUW4ZdcyxyXBCSxqcw1XKM5rDeDrdlIq7EvdKBNg1iKuVEGS5H%2BZjcEh%2FScDKzL3qhp221%2F4dk5uNcHm%2FxEGB6FjajU3QYorsfopecsprY6Jn9Sa4zW1pfxy%2B2U9DBdRCCI0NkOJXmkL66oGJoaayhepc7gaNZGcRVsLL90yQlYMce0ugC%2F%2BvCOURkctz7C1RTV8A%3D%3D
- /plans-pricing (404): https://storage.googleapis.com/firecrawl-scrape-media/screenshot-173d5d75-c0e3-4030-87d1-475deaa5c364.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1792681448&Signature=jbhZNjJQKGxEhBs6WxzNGpmf3lYj7OqOhVH5vItrVpT5efxKFU8gvxXdJAVPgC73851rp3umJOHlXCu92ypjD9Vm%2BDLcoorffIvpaGXeC1Thp9M6NPq%2FuHPiRvlJn240fgZTUcOf4P80XRkL3mh%2FuLwLx7pWg%2F9XULVYd2RQJlO2uT9oDrLy8LIniDTTZSHipSFbXKYSlkTnxE%2BgnrMlgfrinAYlKzvnEn%2Fa9EOytDXtSkW9Www%2BZVPnSq4mTUC%2FuOQY3RniKHAmLm92V7Cuj8KDIPbmT1URF5liquWUwz7k0rG6IjZIc0cBdtnfjWrUa9rn1XGTMMZsyexMmVqmgA%3D%3D
- /pricing-plans/subscribe, mobile: https://storage.googleapis.com/firecrawl-scrape-media/screenshot-c19db32c-60fe-4019-93fa-a243550b7079.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1792681496&Signature=sm%2FiEzLEn2hG8w30OanzpQnPBgDivRv%2FDj3AmNEeX6UHcHVu%2B9iQQhOS%2F6LW%2BT5yfPkGriYXzeoFfMzbyuh0CQA4sEghvjXkuxAvFmQoSsnoaysM2ED6XxtszvvOBS%2BO1hs%2Bb4IyEZiE%2FNYnScj1fM91DLOPvcYaC9%2BDTArL62flHGuR6YC95FTeV69DTlpFz4Xn1BiytUd%2FVDGbN96pCmY6bDlb7lUbo0ZKV1aHQJsOQ6mEXlwVxZ8387fK9DZ59WgK7jn%2FRvQb%2BAAfdwnNEh1KX7fw238%2BlA%2FoByNBhzu7fvDfrubZAX8eGFzCN7C0UcxaQmT2dKVpOM%2BdsNQI0w%3D%3D
- /the-buddy-martin-show, mobile: https://storage.googleapis.com/firecrawl-scrape-media/screenshot-ca6b08b7-802f-47b7-9391-6b07c2d1e97e.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1792681500&Signature=r%2BCXwJsNw3VoA9rAi07sUfenI1hhJRSFa7%2F6b%2F6ZS2D7giM3WovbpH7kvQQrP1yW7HRz9Yn7UTtSuvKqy9sWvxZQ%2FGdnICf%2FEmMqbgMx0QXOjgOk0vNmI%2FUPzIJcYFYsfN2guEPQkvSFgrHLhht9abi1Y2cXBngOFlGA2e9Yj4vh6Cc%2FQ%2FF6dg7v%2FxdJJ5o928H%2F%2Bcb0WmaMKaNQy5sycEyP7c%2FZHm9mZR48%2BZpZxbWRrgfrGr5Byvgsv%2FfShP8Vsi%2F5Vec6bPRp7V6PQ2PihEl2lflq9lP8pwMcllLuSXKtkfqCdijVlu%2B%2FVzXlG7%2FOSlzE2oCeiD2o9B1EvxOfRQ%3D%3D
- /magazine, mobile: https://storage.googleapis.com/firecrawl-scrape-media/screenshot-d907b68c-33e4-40bd-9935-3e2fc04c4fea.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1792681506&Signature=E8JK0aLxLLaWLNztr04wCpHk4Rkw16CU3n2aKfKKNKbJek8QwBkauerM6CxqYPRRge%2FcwTRqUErorse5OUtV6bjgGDXdbgY0iN%2FSW6IjXJohFhyPdeQ53Jeic6XQeN6DDulh6FVI1Zkv64FM%2FwllxwxX%2FNWSy0vO%2FIQtdK4GT4bpv151TUu1kWamMYtXEPbn72J944TDG7kYEUXlxAg9pVK07EHdFuO0YCRWx5Lu9Lzx%2B%2B4m5gSXB2DfJzsT7BSs6kMgl6RIbAFiHJxwbuqBYy24NpuSw6nkOxpZyI%2BOverK9pHUNAkMcraXiUvm5vOXTU7fvdibXX%2BfJNSFqrf0bQ%3D%3D

---

## 1. Current homepage structure

### Desktop (1920 px capture, content column about 1230 px)

| # | Module | Notes |
|---|---|---|
| 0 | Orange top rule, then a blue masthead: "GatorBait Media" wordmark, Sign in, **Try for free** (orange) | Custom header from the homepage bundle |
| 1 | Sub-nav: Latest · Magazine · TV & Podcasts · Our writers · Schedule · Store ↗. Right side: "Independent Florida coverage since 1979" | |
| 2 | **Top layout (co-lead + support rail)** | Above the fold |
| 2a | Left, co-lead 1 (Buddy, h1): "QB1 Philo Hurt. QB2 Jones To Start?" | **The photo is broken ("Photo unavailable"), and no headline is visible in the first screen.** |
| 2b | Left, co-lead 2 (Franz, h2): "Philo's injury could give Tramell Jones Jr. his opening", text over the photo | **Navy headline on a dark photo gradient, close to unreadable** |
| 2c | Right rail, 2 support cards: Eddie Gilley "So You're Saying There's a Chance!?" and "Report: Aaron Philo's status uncertain…" | The cards are stretched to the lead's height, leaving large empty gaps |
| 3 | "More GatorBait reporting": 3 photo cards, plus "All stories →" | |
| 4 | "The voices of GatorBait": 5 initial chips (BM, FB, LM, EG, CS) | |
| 5 | Hub, 3 columns: **The Buddy Martin Show** (next live, YouTube/Facebook/Share, 3-item "Broadcast archive") · **Latest** (5 thumbnails) · **Scores & schedule** (line score, recap link, "Next · Florida at Texas" countdown, 3 games coming up, Schedule/Roster/Stats/Standings) | |
| 6 | Magazine card (navy): "Current issue · Sunday, October 11 · Postgame Edition · Open this issue" | |
| 7 | Two side-by-side CTAs: **Get GatorBait Magazine free** (email, consent checkbox, Sign up free) and **Your Gators. Your magazine.** (Explore All Access) | |
| 8 | **The road ahead**: blue band with 4–2 record, Share the season, horizontal season card rail (Georgia card clipped at the right edge) | |
| 9 | Global footer: GatorBait Gear + Shop Gear, 4 link columns, social links, copyright | |
| — | Cookie bar (fixed, bottom) | |
| hidden | Native Wix page still in the DOM under `display:none`: "Today's Edition" hero + 6-post blog widget + "The Monday Chomp" signup | Hidden by `html:has(#gbm-live.gbm-gazette) #SITE_PAGES{display:none}`. Firecrawl still captured the text, so the native page is still built behind the custom one. |

**Above the fold (1920x1080):** the masthead, the nav, a broken lead photo, the top half of Franz's photo with an unreadable title, and two support cards. **The newest story's headline is not visible on desktop.**

### Mobile (360 px capture)

Masthead (wordmark + Menu) → sub-nav (Latest, Magazine, TV & Podcasts, **Try free**) → Buddy kicker/h1/dek/byline/excerpt (readable) → broken photo placeholder → Franz as a compact row → Eddie card → Report card → More GatorBait reporting (3 rows) → Voices chips → **Latest** (5 rows) → Buddy Martin Show → Scores & schedule → Magazine card → Get Magazine free → All Access → Road ahead (horizontal rail) → footer.

- Above the fold on mobile: the Buddy headline and excerpt. **The cookie sheet covers roughly 205 px of a 640 px first screen (32%), sitting over the lead photo slot.**
- Page height: about 6,100 px, roughly 9.5 phone screens. The show module starts around screen 4. The email signup starts around screen 6.5, and All Access around screen 7.
- **Font (verify):** the mobile capture renders in an Arial/Helvetica-like fallback, not Barlow. The desktop capture is Barlow. `ensureFonts()` waits at most 900 ms, then paints with whatever has loaded. Google Fonts may have been slow or blocked in the emulator, so check on a real device.

### How lead and news ordering works in code (`sports-live/src/front-page.js` → built `sports-live/homepage.js`)

- **Data:** `fetchRss()` reads same-origin `/blog-feed.xml?t=<minute>` with a 4 s abort. On failure it falls back to GitHub Pages `gazette-live/posts.json` with a 3 s timeout. Before either returns, it paints from the bundled snapshot (20 posts baked in at build time, `BUNDLE.posts`), a Wix-served `window.__GBM_HOME_FALLBACK__` if that is newer, or a sessionStorage cache (15 min). **It paints once.** Fresher data only adds a "New stories available — refresh" link and never re-lays out. The paint budget is 1.5 s.
- **`normalize()`:** drops invalid, future (more than 1 day ahead), duplicate-URL and duplicate-title-per-day posts. It also drops "LIVE NOW:" posts older than 6 h, and "Members:" posts. Then it **sorts newest-first by `firstPublishedDate`** and keeps only the newest "Thoughts of the Day:". `gameFocus()` filters to a game-week regex when `gameWeekFocus` is on and at least 8 stories match; the current window ended Oct. 11. The result is capped at 30.
- **`pickLead()`:** a `pins.breaking` path wins first, then `pins.timed` while `until` is in the future (the current timed pin expired Oct. 12). Otherwise `posts[0]` (newest) leads. `window.__GBM_HOME_PINS__` can override at runtime.
- **`pickCoLead()`:** `colead.on: true` in `front-page.config.json`. Buddy's newest piece within 7 days goes left with the page's single h1, and Franz's newest goes right. A breaking pin suppresses it. This is why Franz's Oct. 14 story outranks Eddie's newer Oct. 15 story.
- **Remaining slots:** `take()` fills, in order: support (2), feature (1) and list (2), which together make up "More GatorBait reporting", then **"Latest" (5)**. Each takes the next unshown posts in chronological order, so **"Latest" actually holds stories 8–12**. On Oct. 15 it began with Eddie's "Numbers Don't Lie", not the newest story.
- The render also hides "halftime / live updates" posts for the last final game, adds a game-day band and tunnel when `mode.gameday` is on, and loads the weather strip when `gwCfg()` is set.

## 2. Reader flows (counted from the homepage)

| Goal | Desktop | Mobile | Friction / dead ends |
|---|---|---|---|
| (a) Newest story | 1 click, but the h1 is invisible above the fold (broken photo, no visible text). The reader must click the grey box or Franz's unreadable overlay. | 1 tap; the headline is the first thing on screen. | The broken lead image is a data bug: the RSS enclosure for a post whose cover is a YouTube thumbnail comes through as `https://static.wixstatic.com/media/https://i.ytimg.com/vi/<id>/maxresdefault_live.jpg`. `safeUrl` accepts it (host is wixstatic), `wixCut` can't parse it, and the retry swaps in `mqdefault.jpg` but keeps the bad prefix, so the slot shows "Photo unavailable". The "Latest" label is misleading (see above). No timestamps appear on most cards, only a date. |
| (b) Buddy Martin Show video | Scroll to the hub (about 1.5 screens), then 1 click on "Watch on YouTube", which leaves the site for `/channel/.../live`. That page shows nothing useful when the show isn't live. | Scroll about 4 screens, then 1 tap. | The homepage "Broadcast archive" is **stale**: "checked Oct. 4", showing Oct. 2, Oct. 1 and Sept. 30 episodes. /the-buddy-martin-show has a fresh list through Oct. 14 with an inline player. The homepage never embeds or links the newest episode itself. Its source, `sports-live/episodes.json`, is a build-time snapshot. |
| (b') Podcast | Nav "TV & Podcasts" (1 click) → show page → scroll to the bottom → "Audio archive on Apple Podcasts" (2 clicks, then off site). | Same, after about 3 screens of scrolling on the show page. | The page itself says the Apple feed holds "older audio episodes", so there is no current podcast destination. The show page also has a different header (script logo, SHOP, MENU) from the homepage, and a native "WELCOME TO THE BUDDY MARTIN SHOW" duplicate in its DOM. |
| (c) Newsletter signup | Scroll about 2.3 screens to "Get GatorBait Magazine free". Then enter email, tick the consent box and submit (3 actions), then confirm by email (double opt-in). | Scroll about 6.5 screens. | No header entry point: the header CTA "Try for free" is the **paid** trial. A stray "Company" label appears in the text extract next to the form, likely a honeypot field visible to screen readers **(verify)**. |
| (d) Membership purchase | Header "Try for free" (1) → /pricing-plans/subscribe → plan "Try for free" (2) → Wix sign-up/login (3+) → checkout (4+). | Same via the sub-nav "Try free". | On /pricing-plans/subscribe: **Wix placeholder text is live, "I'm a paragraph. Click here to add your own text and edit me. It's easy."** Prices are duplicated in the accessible text ("$9999$", "$9.999.99$"). The 360 px capture rendered the footer at the top and blank space, with no plan cards in view **(verify)**. **/plans-pricing returns 404**, the Wix default URL that old links and search results may still use. The homepage card "Your Gators. Your magazine. Explore All Access and the member magazine PDF" shows no price, no trial and no benefit list. |
| (e) Magazine | Nav "Magazine" (1) → /magazine cover → "Open this issue" or the contents links (2). Or scroll to the homepage card → "Open this issue" (1). | Same; the homepage card is about 5.5 screens down. | The issue shown is the Oct. 11 postgame edition, 4 days old in Texas week with no pregame issue yet. The free versus paid magazine message is muddled: "Get GatorBait Magazine free" sits right beside "Your magazine… member magazine PDF". The native blog grid inside /magazine's DOM lists August posts **(verify whether it is visible)**. |

## 3. Visual, typography, clutter, components, performance, accessibility

**Visual / layout**
- **The desktop lead is broken.** The first co-lead photo fails (cause above), and its overlaid copy can't be seen on the grey placeholder. Franz's overlay headline is dark navy (`--fp-ink` in day mode) on a dark gradient, so the text fails contrast.
- The support rail is stretched to the lead's height, leaving about 150 px of dead space around each of the two cards.
- The Road ahead rail clips the Georgia card at the right edge on desktop with no scroll affordance.
- The next game appears three times on the homepage (Scores "Next" card, Road ahead card, and the game-day band when on), with two countdown formats: "02d 00h 57m 01s" and "2d 0h 57m".
- The "Schedule" and "Roster" links point to a dated September post (`/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#schedule`), not a schedule page.
- The scores box says "Source checked Oct. 12", which reads as stale on Oct. 15.

**Typography**
- Barlow is loaded from Google Fonts (400–800). The CSS also asks for "Barlow Condensed", which isn't loaded and falls back to Barlow; that is fine under Barlow-only.
- The mobile capture appears to use a system sans **(verify)**.
- The article page mobile capture shows a Times-like serif on the "Watch: …" caption next to the Facebook embed, which breaks the Barlow-only rule.

**Clutter and inconsistent components**
- There are 11 distinct modules on the homepage, and three of them do "subscribe/sign up" in different words: "Try for free", "Try free", "Sign up free", "Explore All Access", "Open this issue".
- Button styles vary: filled orange, filled navy, ghost, outlined, and text arrow.
- There are three share buttons ("Share the show", "Share the season", "Share").
- The headers differ: the homepage has the blue bar wordmark; the show page has a script logo with SHOP and MENU; the article and pricing pages use the native or the shared footer.
- "Since 1979" appears in the header and footer, but "since 1980" is in the native hidden copy.
- On the article page, a "Get GatorBait Magazine free" sheet overlays body text mid-scroll in the mobile capture.

**Performance**
- `sports-live/homepage.js` is **198,682 bytes** raw (minified; the build cap is 260 KB), loaded from jsDelivr at a pinned commit. It also inlines the 82 KB CSS source, share and capture code, and 20 bundled posts.
- Deferred extras:
  - `tsparticles.slim` (about 44 KB, idle-loaded, and only when embers are on).
  - `fan-modules.js` (40.9 KB, only when `deploy/cloudflare/endpoints.json` names Workers).
  - Google Fonts CSS and font files.
  - `scoreboard.json` from GitHub Pages.
  - The RSS fetch.
  - Show thumbnails from i.ytimg.
- **Hidden native Wix page:** "Today's Edition", the 6-post blog widget and the "Monday Chomp" form are still in the DOM behind `display:none`, so Wix still hydrates them and may request their images.
- Images are good: `wixCut()` re-cuts every wixstatic image to its box with `enc_auto` and a 480/800/1200 srcset. Earlier, a 975 KB PNG lead had caused a 28 s throttled LCP.
- The Latest thumbnails request a 480x300 cut for a 64–112 px slot. The `sizes` hint covers this.
- Wix's own runtime and the cookie/consent, analytics and AdSense guard scripts ride on top. Their weight was not measured here: Firecrawl gives no network waterfall, so run Lighthouse or WebPageTest on a device.

**Accessibility**
- The lead headline can't be seen or has too little contrast on desktop.
- "Photo unavailable" is announced as the content of the main link.
- The mobile cookie sheet covers about 32% of the first screen.
- Pricing prices are duplicated in the accessible text.
- There is a possible exposed honeypot label "Company" **(verify)**.
- The Road ahead horizontal rail's keyboard and scroll affordance is unverified.
- The article page's horizontal clipping (below) would also hurt zoom and reflow.
- Good: a "Skip to stories" link, `:focus-visible` outlines, one h1, `aria-label` sections, reduced-motion respected, and alt text from the feed.

**Article page** (`/post/philo-is-the-florida-quarterback-at-least-for-now`, 360 px capture)
- Body text runs off the right edge (horizontal clipping).
- The Facebook video embed shows "Video unavailable" text in the extract.
- The end of the page has a single related story, Wix comments, then the footer.
- A "Latest" pill and an "Up next at No. 7 Texas" card link back to "/".
- CURRENT-STATE says 390/430/1366 checks passed on Oct. 12, so re-check the clipping on a real device **(verify)**.

## 4. Technical constraints for any redesign

**Embed owners** (from docs). These are dated observations; re-read live revisions before any write:
- Homepage loader `fdc2127a-845a-4d02-b711-438f1a4a86ce` (rev 68 on Sept. 24; HEAD, ESSENTIAL).
- "Home Code" `622d8ece-df55-44fc-9e4a-3f580804743b`: a 521-character loader pinned to a `main` commit of `sports-live/homepage.js` (rev 24 → 28 per CURRENT-STATE).
- Home Styles `1255a4cf`.
- Header `7fee4de6` (rev 30).
- Latest `53e15504`.
- Article template `14a887e3`.
- Game-day band `96ef5a04` (hidden).
- Ad guard `af338ad4` (ads off at rev 4).
- Prepaint shield `2f57bc6b`.
- Legacy cleanup `ed3718cc`.
- Utility footer `f8b950c9`.
- Footer-gap guard `15302fb2`.
- Magazine `1dd74333` (rev 48, 14,918 chars), separate from the homepage.
- Disabled backup `dd2b9790` (never enable both).

Points to note:
- Header, Home Styles, Magazine and the article template are each within 100–250 characters of the cap.
- **Pin drift:** the docs disagree about the live pin.
  - `deploy/wix-served/homepage-embed-cdn.html` pins `homepage.js@99d1503` (build.py says rev 71).
  - The Sept. 29 lock note says `2c4f4f5`.
  - `origin/main` now holds build `6228bd77`.
  - Read the live loader before assuming which renderer readers get.

Other constraints:
- **15,000-character cap per Wix custom embed.** Big code therefore lives in a **commit-pinned jsDelivr file** (`cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@<sha>/sports-live/homepage.js`), and the embed is a small loader.
  - The fully inlined `deploy/wix-served/homepage-embed.html` is 55,759 chars, so it can't be a single embed.
  - Patch protocol: GET, then a PATCH at the current revision with a fingerprint check, re-sending category ESSENTIAL. Verify at 320/390/430/1366 and keep a written rollback.
- **Barlow only** (START-HERE §Style; wix-master). No serif, Arial or Montserrat; native Wix theme leaks must be overridden.
- **Data source:** same-origin `/blog-feed.xml` (Wix Blog RSS: title, description, creator, link, pubDate, enclosure). Fallback is `gazette-live/posts.json` from GitHub Pages, refreshed every 5 minutes by `refresh-newsroom-feed.yml`. RSS carries no category, pricing plan, tags or reliable image dimensions. That rules out RSS-driven sections such as recruiting or basketball.
- **Paint-once contract:** one root `#gbm-live.gbm-gazette.gbm-sports-home`, `__GBM_GAZETTE_BOOT__.ready/fallback`, no layout shift after paint, no polling loops or broad observers, and a native fallback on failure.
- **Business owners stay native:** `/pricing-plans/*`, `/account/*`, checkout, Members, consent, AdSense, GA4 and email. A paywall must be real Wix plan enforcement, not CSS.
- The editorial rules make ordering newest-first, with only a breaking pin able to override it. The co-lead and game-week focus are owner-approved exceptions recorded in config.
- **Source of truth:** edit `sports-live/src/front-page.{js,css}` and `front-page.config.json`, then rebuild with `node sports-live/build-front-page.mjs` (esbuild). Never hand-edit `homepage.js`, and never run the legacy `automation/sports-home/build.py` against production.

## 5. Top 10 improvements, ranked by reader and revenue impact

1. **Fix the lead package (desktop top story currently invisible).**
   - Unwrap `static.wixstatic.com/media/https://…` enclosures in `normalize()` back to the inner YouTube URL, or fall back to `hqdefault.jpg` correctly.
   - Never overlay the headline on a failed or placeholder image.
   - Give overlay text a guaranteed white-on-scrim colour in day mode.
   - Small, reversible and high impact.
2. **Make "Latest" truly latest and move it up.** A timestamped newest-first river (relative times, "New" marker) right under the lead, on mobile within the first 2 screens. Rename or merge "More GatorBait reporting" and "Latest" so readers see one chronological list.
3. **Put the free email signup early and in the header.**
   - A compact one-field band after the lead or first river, plus a "Get the free magazine" header link.
   - Keep the checkbox consent.
   - Today the form is about 6.5 phone screens down. Signups grow the audience that every send and the trial funnel depend on.
4. **Repair the paid funnel.**
   - Remove the Wix placeholder paragraph on /pricing-plans/subscribe and fix the duplicated price text.
   - 301 `/plans-pricing` to `/pricing-plans/subscribe`.
   - Show the price and trial on the homepage CTA ("7 days free, then $9.99/mo or $99/yr") with 3 member benefits.
   - Separate the free magazine from the paid PDF in the copy.
   - Fixing these needs Brenden's sign-off on public pricing copy.
5. **Make the show module current.**
   - Feed it the same newest-first episode list the show page already has (Oct. 14), not the frozen `episodes.json` (Oct. 4).
   - Show the latest episode thumbnail as a primary card, and "LIVE now" at 9 p.m. Mon/Wed/Thu.
   - Link to the on-site show page, not only to YouTube `/live`.
6. **One game strip, not three.**
   - Consolidate the scoreboard, countdown and Road ahead into one compact strip near the top on game week, with the full season rail lower.
   - Fix the Schedule/Roster links that point to a September post.
   - Drop "Source checked" wording for readers.
7. **Shrink the mobile cookie sheet** to a slim bottom bar, without hiding the consent choices. It currently covers about 32% of the first screen and the lead photo on every first visit.
8. **Performance budget.**
   - Strip the hidden native homepage widgets (Today's Edition, blog grid, Monday Chomp) from the Wix canvas so Wix stops hydrating them.
   - Split `homepage.js` (199 KB): bundled posts and below-fold modules can lazy-load.
   - Load only the Barlow weights used and preload the 600/800 files.
   - Verify mobile actually gets Barlow.
   - Measure LCP and INP on a real phone.
9. **Unify components and chrome.**
   - One header across home, show, article and pricing.
   - One CTA vocabulary (Free newsletter / Try All Access / Read / Watch) and one button system.
   - Fix the "1979"/"1980" mismatch.
   - Reduce the share buttons to one per page.
10. **Article-to-homepage loop and article mobile QA.**
    - Re-verify the article horizontal clipping and serif caption on a device.
    - Replace the single related story with 3–4 newest-first stories plus the newsletter band.
    - Keep the on-site "Up next" game card.
    - Most traffic lands on articles from social and search, so this is where readers either keep reading or leave.

Verified versus assumed:
- **Verified in Firecrawl renders:** the broken lead photo, the stale show archive, the Wix placeholder on the pricing page, the /plans-pricing 404, the "Latest" ordering, and the hidden native DOM.
- **From code reading:** the cause of the bad image URL, and the module ordering.
- **Flagged (verify):** the mobile font fallback, article clipping, pricing-card rendering, and the honeypot label. These need a real-device check before anyone calls them fixed.
