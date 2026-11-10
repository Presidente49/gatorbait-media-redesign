# Sign-up lightbox — Oct. 31, 2026 (candidate, NOT live)

Asked for by Brenden, Oct. 31: a good email sign-up for visitors who are not members, that social in-app browsers do not block.
This branch changes nothing live. Jarvis ships it after QA.

## What it does

- `signup-lightbox.js` (about 19 KB unminified, vanilla JS, no dependencies, no network requests, no popups).
- Shows one small box: **Get the free email** (links to the existing native hosted form), **Join GatorBait** (existing `/pricing-plans`), **Already a member? Sign in**, **Not now**.
- It never collects an address and has no data store. The form stays exactly as is: `https://buddymartinshow.wixforms.com/f/7517931185469654016` (email plus one **unchecked** consent box; Wix double confirmation unchanged). Verified read-only: the form returns HTTP 200, no `X-Frame-Options`. It is still a plain same-tab link, not an iframe, because iframes depend on third-party cookies that in-app browsers block.
- Timing: not before 4 s of visible time; appears at 10 s of visible time, or after scrolling 0.6 screens (whichever first, never under 4 s), and only once the member signal has been a settled "visitor" for 3 s (below). Once per session, 7 days after **Not now**, 30 days after following either link. The X and Esc close for the session only.
- Layout, phone first: on any screen 820 px wide or less (and for search-engine referrers, the live-game card or an open cookie banner on any screen) it is a **bottom sheet**: no backdrop, at most 60 percent of the screen (about 33 percent at 390 x 844), buttons 46 to 48 px, the close X is 44 px, safe-area inset respected, one tap on X or **Not now** closes it. It sits above the cookie banner and above the orange game-day bar `#gbm-gd10-bar` (it measures both), never over them. On desktop it is a centered box with a dim backdrop, focus trap, Esc and 44 px close. The sheet is deliberately non-modal (no trap) so it never blocks reading or the page; the desktop box traps focus. There is no text field in the lightbox (the address is typed on the existing hosted form), so there is no keyboard or 16 px input-zoom problem to manage here; the hosted form is a separate Wix page.
- Cookie banner (`consent-banner-root`, z-index 2147483647, about 140 px): the lightbox waits up to 25 s for it to be answered; if it is still there, the sheet sits above it. It is always below the banner in stacking order.
- Never on `/pricing-plans`, `/signin`, `/sign-in`, `/login`, `/account`, `/my-account`, `/members`, `/checkout`, `/cart`, `/thank-you`, `/payment`.
- Member gate and suppression: see the section below. Defers while a field has focus or another dialog is open, including the earlier 55-second invitation from `capture-candidate.js`. If either invitation is dismissed or the visitor joined/pending, the other stays quiet (shared keys `gbm-capture-dismissed`, `gbm-capture-joined`, `gbm-capture-pending`).
- Social in-app browsers: no referrer or user-agent check ever hides it. Facebook, Instagram, X, YouTube and TikTok visitors get the same sheet. Links are plain same-tab anchors; the click handler stops the Wix platform link handler (which otherwise re-opens links through `window.open(url, "_self")`) so the browser does native navigation with no `window.open` at all. No popups, no `beforeunload`, no third-party cookies. Storage is read/written inside try/catch with a first-party cookie fallback, then an in-memory fallback (storage and cookies both blocked: it shows at most once per page load).
- Events (browser evidence only, not a confirmed subscriber): `dataLayer` `gbm_signup_lightbox` with `gbm_action` shown / closed / not_now / go_email / go_join / go_signin.
- Barlow only. Colors: Gator blue `#0021A5`, orange `#FA4616` (top stripe, focus ring), white, a 8 px green `#22884C` dot.
- **Existing site script to know about:** the header embed (`deploy/shell-2026`) scans any `role=dialog`, `aria-modal`, or class containing `modal`/`lightbox` whose text contains "newsletter", "subscribe" or "email address", adds its own "Close newsletter" button and may dismiss it. The lightbox copy and class names deliberately avoid those words (an earlier draft collided and got a second close button). Do not add those words to the copy.

## Member gate — ship-blocker, fail closed (item 3)

Rule from Brenden: never show it to a signed-in member. When the member signal is uncertain, **do not show**.

Investigated on the live site with an anonymous browser:
- The Wix session cookie `svSession` is **httpOnly**: script cannot read it. There is no readable member cookie, no `viewerModel.user`, no `wixEmbedsAPI` member getter. The header's custom "Sign In / Account" anchors are static text.
- The most reliable client signal found is the Wix login bar button (`.wixui-login-social-bar [data-testid="handle-button"]`), which reads "Log In" for visitors and the member's name once signed in.

How the script uses it (`memberState()` in `signup-lightbox.js`):
1. `member` = the button is present and no longer says Log In/Sign In (or `gbm-su-member` was stored earlier). A member is remembered for a year, in localStorage/cookie/memory, and nothing ever overrides it, **including `?gbm_su=1`**.
2. `unknown` = no login bar, or the bar is empty (hydrating). Treated as **do not show**; it keeps watching in case the bar settles.
3. It shows only when the state is a positive `visitor` (button says Log In) on 6 consecutive 0.5 s checks (3 s settled) after `document.readyState === 'complete'`, plus the normal 4 s minimum / 10 s dwell. Wix serves a cached anonymous page, then hydrates members, so the wait avoids a flash for members.
4. If a member state appears while the box is open, it closes at once and never returns.

Storage or cookies blocked (social in-app browsers) does not make the signal uncertain: it is read from the page, not from storage, so a visitor is still asked and a member is still detected. Only the "remember" part degrades (shows at most once per page load).

**Limits, stated plainly:** I could not sign in, so the signed-in appearance of the login button is **not observed on the live site**. The QA simulates a member by changing the button text and by removing it. Before shipping, Jarvis must load the live homepage once signed in as a member and confirm `window.__gbmSignup.debug().member === "member"` (and the box never appears over about 15 s at 390 and 1366). If the button does not change the way assumed, the fail-closed rules mean the likely failure is that **nobody** sees it (the state would read `unknown`) or, if the button keeps saying "Log In" for members, that members could see it. That second case is exactly what the pre-ship check is for. Pages without the login bar never show it. The detector also cannot see members whose login bar is hidden by an in-app browser layout; those read as unknown and are not asked.

## QA (item 4)

`node deploy/signup-lightbox-20261031/qa.js` loads the real homepage with `?cb=<ts>&utm_source=qa&fbclid=QA123`, injects the script locally, never submits anything (the form and join destinations are stubbed), and writes `results.json` and `shots/`. Latest run (Oct. 31, 2026, 17:01Z, Chromium): **311 of 312 checks pass**.

Phones first (320, 390, 430; plain, Facebook `FBAN/FBAV`, Instagram and X user agents; localStorage blocked; localStorage and cookies blocked; Google referrer):
- Bottom sheet on every phone case, 206 px tall (about 24 percent of 844 and 22 percent of 932; 45 percent of the 640 px 320 screen), never over 60 percent.
- Clear of the orange game-day bar `#gbm-gd10-bar` (card bottom equals bar top, 15 of 15), and above the open cookie banner (sheet bottom at or above banner top).
- All targets 44 px or more, Barlow, no horizontal overflow, no request to any host that was not already on the page (Wix, analytics and Facebook infrastructure that the site loads lazily on its own is allowed; a static check also proves the script contains no fetch, XMLHttpRequest, sendBeacon, WebSocket, `window.open`, `beforeunload` or `new Image`).
- Appears once, closes on X, Esc and Not now, stays closed; once per session; Not now holds 7 days and returns after 8 days; with storage blocked a close is still honoured after reload (cookie fallback); with storage and cookies both blocked it shows once per page load.
- Not before 10 s by default; a Free-email tap navigates the same tab (main frame) with no popup and no `window.open`.
- Not on `/pricing-plans`, `/signin`, `/checkout`, `/account/my-account` (real pages).

Member negative tests (390 and 1366, 20 of 20): logged-out visitor is read as visitor and sees it; a simulated member (login button showing a name, enforced every 25 ms from page start) never sees it, not after reload, not with `?gbm_su=1`, not in an Instagram user agent with storage and cookies blocked; no login bar (unknown) never shows; empty login bar (hydrating) never shows; if the member state appears while it is open it closes at once.

Desktop (1366, 1920): centered box with backdrop, focus trapped (Tab and Shift+Tab, 9 presses each way), Esc closes, no overflow; Google-referrer desktop gets the sheet.

The one failure in the final run: `320 google-referrer sheet: appears`. On that cold first load the Wix login bar never rendered within the test's 25 s, so the member state stayed `unknown` and the lightbox correctly stayed hidden (fail closed). A rerun of the same case shows it at 12 s. This is the cost of the fail-closed rule: when Wix is slow or does not render the login bar, nobody is asked on that load (the script keeps checking for 10 minutes of visible time).

Screenshots were read and checked by hand at 320, 390, 430 and 1366 (`shots/`). Two defects were found and fixed that way: a stray orange focus ring around the whole card, and a collision with the header embed's newsletter-dialog script (see above).

Not covered: a real phone, real Facebook/Instagram/X/TikTok/YouTube in-app WebViews (user-agent strings and storage-blocked emulation only), a signed-in member session, the live game state (simulated with a "LIVE" element: there is no reliable live-state hook on the homepage, so the detector is a heuristic), Safari/WebKit (Chromium only).

## How Jarvis ships it

1. Merge this PR (or take the merge commit SHA). Use the **full 40-hex commit SHA** that contains `signup-lightbox.js`.
2. Fresh-read the live Wix state; save the rollback HTML first. Create **one new** custom-code embed (not an edit of an existing one): name `GBM - Sign-up lightbox v1`, category **ESSENTIAL**, all pages, load on each new page, position **BODY - end** (or HEAD; the script waits for `DOMContentLoaded`). Only the owner/controller authorizes the write.
3. Embed HTML, same loader pattern as homepage embed `0c13f955`:

```html
<!-- GBM_SIGNUP_LIGHTBOX_V1 src=<SHA7> rollback: delete this embed -->
<script id="gbm-su-loader">(function(){if(window.__gbmSignupLightbox)return;var s=document.createElement('script');s.src='https://rawcdn.githack.com/Presidente49/gatorbait-media-redesign/<40-HEX-SHA>/deploy/signup-lightbox-20261031/signup-lightbox.js';(document.head||document.documentElement).appendChild(s);})();</script>
```

   (rawcdn.githack.com and cdn.jsdelivr.net already load on the site; no new host.) Verify HTTP 200, `text/javascript`, byte count and SHA-256 of the pinned URL before attaching.
4. Cold-load the public homepage on a fresh profile at 390 and 1366 with a `?cb=` query; wait about 11 s; confirm one `#gbm-su`. Check once as a signed-in member (should not show). Check one article, `/pricing-plans` (must not show), and the Facebook/Instagram links from a phone if available. `?gbm_su=1` forces it for review (still skips excluded routes).
5. Order matters for cache: Wix may serve the cached canonical HTML; see the capture release notes about verifying the ordinary canonical URL, not only a query-bearing one.

## Rollback

Delete (or disable) the single new embed. The script holds no server state. Visitors keep harmless local keys (`gbm-su-*`). Pins are immutable, so no other page is affected.

## Limits and decisions for Brenden

- "Join GatorBait" points to `/pricing-plans`, which is the paid plans page, since that is the only existing member join route. If you want a free member sign-up instead, give the target URL and change `joinUrl`.
- Free-email visitors are not members. The hosted form builds the email list only; turning email subscribers into site members is a separate step.
- 10 s / once-per-session / 7 days are design choices, not measured optima. Track `gbm_signup_lightbox` events before tuning.
- Opening the form is not a subscription; Wix double confirmation does that. Real confirmation-email delivery stays unverified.
- The earlier 55-second invitation (PR #433, already in the live capture bundle) still exists; this lightbox coordinates with it but does not replace it. Decide whether to retire one.
