# Magazine subscribe prompt - Nov. 3, 2026 (candidate, NOT live)

Brenden, Nov. 3: "we really need to have a light box for non-subscribing members that are gonna come on this magazine page" (`/magazine`).
Built from the PR #471 sign-up lightbox (`jarvis/signup-lightbox-20261031`, commit `f63850f0`), which stays untouched and not live. Nothing in this branch changes a live Wix object.

## What it is

- Bundle: `sports-live/magazine-subscribe-prompt.js` (about 20 KB, vanilla ES5, ASCII only, no dependencies).
- Loader: `loader.template.html` (about 0.9 KB), one new Wix custom embed pinned to an immutable jsDelivr commit, same pattern as `deploy/roster-20261102/loader.template.html`. It loads the bundle only on `/magazine`, and re-checks on `popstate` and `gbmroutechange`.
- `/magazine` and `/magazine/` only. Never on any other route (tested on `/`, `/pricing-plans`, `/gatorbait-media-blogs`).
- It is a prompt over the page. It does not hide, lock or change the issue. No backdrop on phones.
- Copy: headline "Never miss a magazine issue"; line "Current issue: **Bitten in Atlanta**. Join GatorBait to read every issue." (the issue name is read from the page's own `h1`, so it never goes stale; if it cannot be read the line is "Join GatorBait to read every issue of the magazine."). No stats, no score.
- Buttons: **Start your 7-day free trial** (`/pricing-plans?utm_source=site&utm_medium=lightbox&utm_campaign=magazine_prompt`), **Already a member? Sign in** (`/account/my-account`, the link the header uses), **Not now**. Plus the X (44 px).
- Billing line under the button, matching the live plans page: "$0 today, then $99 per year or $9.99 per month. Renews until canceled. Cancel in My Account, My Subscriptions."
- Layout: at 820 px and under, a bottom sheet (no backdrop, at most 60 percent of the screen, about 35 percent at 390 x 844, 48 px primary button, safe-area inset). Above that, a centered 460 px dialog with a navy dim backdrop, `aria-modal`, focus trap, Esc, 44 px close, focus returns to the page.
- Look: white card, navy `#061444` text and button, a single 4 px orange top rule (Brenden: the magazine looks too orange; the QA asserts that is the only orange). Barlow only. Plain same-tab links, no `window.open`, no popup, no `beforeunload`, no cookie, no network request, no form field, no address collected. The dismissal is a first-party `localStorage` key.
- Cookie banner (`consent-banner-root`, z-index 2147483647): the prompt waits up to 15 s for the visitor to answer it, then sits above it (never over its buttons) and has a lower z-index than the banner.

### Which route the site really uses (checked live Nov. 3)

`/pricing-plans` (200) is the plans page that every on-site "Join GatorBait" link uses. `/pricing-plans/subscribe` (200, header JOIN) shows the same plans. `/subscribe` 301s to `/pricing-plans/subscribe`; `/plans-pricing` 301s to `/pricing-plans`. Both live pages say "7 day free trial" and "Try All Access free for 7 days. $0 today; then $99 per year or $9.99 per month ... Cancel anytime in My Account -> My Subscriptions", so the trial wording is confirmed. The button goes to `/pricing-plans`.

## Who sees it (timing and memory)

- Shows after 8 s of visible time, or after half a screen of scroll once 4 s have passed (never earlier than 4 s), and only after the signed-out reading has been steady for 3 s.
- Once per session. **Not now**: 7 days. X, Esc, tap outside (desktop): 1 day. Following the trial link: 7 days. Keys: `gbm-msub-dismissed`, `gbm-msub-closed`, `gbm-msub-followed`, `gbm-msub-member`, `gbm-msub-session`. With storage blocked it shows at most once per page load and no cookie is written.
- Any dismissal also writes the capture bundle's `gbm-capture-dismissed`, so the 55-second free-email invitation does not follow right behind it.

## Member gate: fail closed, and what is NOT verified

Rule: never show to a member. A member, an unknown state or a still-hydrating login bar shows nothing.

Investigated Nov. 3, 2026 (Wix docs tools first, then the live page, anonymous):
- The Wix session cookie `svSession` is httpOnly. No readable member cookie.
- Wix docs: `authentication.loggedIn()` (`@wix/site`) is available only to embedded scripts created with the Wix CLI; the Site host module is not there for a Settings > Custom Code embed (docs article "Embedded Scripts"). The Members SDK (`members.getCurrentMember()`, `siteMembers.getMember()`) needs Velo/site code or a Wix OAuth client, not a custom-code script. So there is no documented member getter we can call.
- `window.wixEmbedsAPI` exposes `promptLogin`, `registerToEvent` (a plain listener list) and `getAccessTokenFunction` (returns nothing for an arbitrary script; the page's `/_api/v1/access-tokens` call is refused to our fetch with "Request not allowed for path"). None reports the member. A new endpoint call is also out of scope.
- What the page does show: the Wix login bar `.wixui-login-social-bar [data-testid="handle-button"]` reads "Log In" for visitors (present in the DOM even though the site's own header hides it at 0 x 0).

How the script decides (`memberState()`):
1. `member` if `gbm-msub-member` is remembered (30 days; written only after two readings in a row), or the login bar button no longer says Log In/Sign In, or either server-rendered hint is set: `viewerModel.siteFeaturesConfigs.siteMembers.smToken` or a member id in `sessionManager.sessionModel`. The hints are empty for an anonymous visitor today and can only HIDE the prompt.
2. `unknown` if the login bar is missing or empty (hydrating), or says Log In but also carries an image. Treated as do not show; it keeps watching for 10 minutes of visible time.
3. `visitor` only if the button says exactly Log In / Sign In, six readings in a row (3 s) after `readyState === complete`.
4. If a member reading appears while the prompt is open it closes at once and never returns. `?gbm_msub=1` only shortens the wait; it never overrides a member.

**I have no member login, so the signed-in appearance of the login bar and of the two hints has NOT been observed.** The tests simulate it (button text changed, bar removed, bar emptied, hint set). If Wix renders a member's button as "Log In", a member would see it; that is exactly what the check below is for. The failure to expect from the fail-closed design is the opposite one: nobody sees it.

Members who are signed in but have no paid plan count as members here (no paid-vs-free signal exists in the browser). If Brenden wants those shown the prompt too, that needs a server-side signal, which is out of scope.

## Must be done signed in as a member before the embed goes live (Jarvis or Brenden)

1. Cold-load `https://www.gatorbaitmedia.com/magazine?cb=<anything>` signed in, wait 15 s.
2. Console: `JSON.stringify(window.__gbmMagSub.debug(), null, 1)`.
3. Expect `"member": "member"`, `"open": false`, and no `#gbm-msub` on the page for a further 30 s at 390 and 1366. Check the `loginBar` text (should be the member's name, not Log In) and `sessionHint` (note whether it reads `siteMembers.smToken` or `sessionModel`).
4. If `member` is `visitor`: STOP, do not ship; send the `loginBar` and `cookieNames` lines (names only, no values) and compare with the same call signed out; a better member signal may show up in `cookieNames` or `sessionHint`.
5. Then sign out, reload, and confirm `"member": "visitor"` and the prompt appears after about 11 s.

`debug()` returns names and booleans only: route, member state, login bar text, hint name, cookie NAMES (never values), suppression reason, banner, busy, issue title, timers.

## Coexistence (tested against the real page)

- Magazine widget (loader embed `1dd74333`, bundle `magazine-georgia-postgame.js`): not touched; `#gbm-magazine-page` has the same nodes before and after the prompt.
- Live strip `79372d76` (top, under the header): the bottom sheet never overlaps it.
- Sign-up capture bundle (PR #433, `capture-candidate.js`, live on `/magazine`: an inline card at the end of the issue and a 55-visible-second invitation). Two prompts never show at once: this script treats the capture invitation, a visible dialog, Share and PR #471's `#gbm-su` as busy, waits 8 s after they clear, and the capture bundle itself stands down while any `role=dialog` is visible. Tested with the capture delay shortened through its own `__GBM_CAPTURE_CFG__` hook: lightbox first, capture held back; capture first, lightbox waits; sampled every 100 ms, never both.
- **Live suppressors (found while testing, important):** embed `a13b04e3` and the header embed hide any `role=dialog`, `aria-modal`, popup, lightbox or modal box whose text contains "newsletter", "subscribe", "gatorbait magazine", "gatorbait weekly" or "today's edition" (to kill the native Wix popup). An earlier draft with "GatorBait Magazine" in the copy was hidden on desktop. The copy therefore avoids those words (the word "Subscriptions" is fine), and the QA fails if they come back. If Brenden wants "GatorBait Magazine" in the headline, `a13b04e3` needs an exception for `#gbm-msub`; that object is not ours to edit here.
- PR #471 (free-email lightbox, not live): different keys, and this script stands down if `#gbm-su` is visible. If both ever ship, decide which one stays on `/magazine`.

## QA

`node deploy/magazine-subscribe-20261103/qa.js` (preinstalled Playwright; real `/magazine`, script injected with `page.addScriptTag` after load, Cloudflare "Just a moment" retried, Subscribe and Sign in stubbed so nothing reaches checkout). Results: `results.json`; screenshots: `shots/`. Last run (Nov. 3, 2026, Chromium): **353 of 353 checks pass**. Two harness fixes along the way are worth knowing: the site's own banner puts a close-button box over its Settings link with or without us (so the test asks that every banner control is still reached inside the banner), and the live newsletter suppressors found above.

Covered: 320, 390, 430, 1366, 1920; plain, Facebook UA, localStorage and sessionStorage blocked, real cookie banner showing; default timings; Not now / X / 7-day return / session; same-tab navigation with no popup; member, hydrating, missing-bar and hint negatives at 390 and 1366; open-then-member closes; copy fallbacks; other routes; coexistence with the capture invitation.

Not covered: a signed-in member session, a real phone, real Facebook/Instagram/X/TikTok/YouTube in-app browsers (user-agent strings and blocked storage only), Safari/WebKit (Chromium only), the live game strip state, and any measurement of conversion. Real-world cache behavior (Wix may serve a cached document) is checked at ship time.

## Ship (controller only; one new embed, nothing existing is edited)

1. Merge this PR. Take the merge commit's full 40-hex SHA that contains `sports-live/magazine-subscribe-prompt.js` (`SHA`).
2. Check `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@SHA/sports-live/magazine-subscribe-prompt.js` returns 200, `text/javascript`, the expected byte count and SHA-256 of the file in the repo.
3. Fresh-read the live embed list; confirm none named like `GBM - Magazine Subscribe Prompt` exists and that `1dd74333` is unchanged. Claim the new object in #34.
4. Create ONE new custom embed: name `GBM - Magazine Subscribe Prompt v1`, category ESSENTIAL, position HEAD, `loadOnce` false, no pageFilter (the loader guards its own route). Body = `loader.template.html` with `__SHA__` replaced by the 40-hex SHA (exactly 2 occurrences). Under 15,000 characters (it is about 1,000).
5. Cold-load `/magazine?cb=<n>` on a fresh profile at 390 and 1366, wait about 12 s: one `#gbm-msub`. Check the ordinary canonical `/magazine` too (Wix can serve an older cached document; see the capture release notes). Check `/` and an article show nothing. Run the signed-in check above. Do not ship if it fails.
6. Record the embed id, revision, SHA and evidence in #34.

## Rollback

PATCH the new embed `enabled:false` (re-send ESSENTIAL), or delete it. The bundle holds no server state; visitors keep harmless `gbm-msub-*` local keys. Pins are immutable, so nothing else is affected. Nothing else was changed.

## Decisions left for Brenden

- Copy: "Never miss a magazine issue" / "Start your 7-day free trial" are drafts. The trial and renewal terms are mandatory next to the offer; the live suppressor blocks the word "subscribe" in the dialog.
- 8 s, once per session, Not now 7 days: design choices, not measured. `dataLayer` events `gbm_magazine_prompt` (shown / not_now / close / go_subscribe / go_signin) are local browser events; nothing forwards them today, so conversion is measured through Wix traffic sources (the link carries `utm_campaign=magazine_prompt`).
- Free (signed-in, no plan) members are treated as members. 
