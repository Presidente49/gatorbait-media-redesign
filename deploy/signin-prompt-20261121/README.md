# Sign in opens the login box (Nov. 21, 2026)

Owner direction: Brenden delegated the decision after the site-ops audit found the Sign in links landing on a Wix "403 Forbidden" page.

## What was wrong

Every on-site Sign in link (desktop header "SIGN IN", phone menu "SIGN IN / ACCOUNT") points at `/account/my-account`. For a logged-out visitor that is a full page load, and Wix answers a members-only page with its 403 error page and no login prompt. "Try for free" on `/pricing-plans` was not affected; it reaches checkout.

## The fix

Custom embed **"GBM - Sign in opens the login box v1"**, id `4ac7e692-f068-4cdc-811d-79718251bb7a`, revision 1, position HEAD, `loadOnce: false`, category ESSENTIAL, 1,245 characters. Source: [`embed.html`](embed.html).

- One capture-phase click listener on the document. It acts only on same-origin links whose path is `/account/my-account`, and only when the hidden native Wix login bar reads "Log In" (the visitor is logged out).
- It calls Wix's own `window.wixEmbedsAPI.promptLogin({mode:'login'})`, which opens the standard Wix login box (email, password, Forgot Password, Google, Facebook, Sign up), stops the full page load and closes the phone menu.
- Logged-in members are untouched: the link goes to their account page as before. If `wixEmbedsAPI.promptLogin` is missing, the link behaves as before.
- No change to the Members Area, redirects, automations, pricing plans or any other embed. No site publish.

## Checks

Live site, nothing injected, Chromium at 1366 and 390 px: desktop header on `/`, phone menu on `/`, phone menu on a story page. In each, the handler is present, the login box opens, and its email field is the top element (desktop and phone home). Closing the box (Escape) returns the reader to the page they were on. Wix logs one "ViewTransition" abort while the box opens over a pending route change; it is Wix's own and harmless.

Not exercised: a real login (no member credentials in the session), a physical phone or Safari, and the behavior for an already logged-in member.

Not covered: a logged-out visitor who types `/account/my-account`, `/signin` or `/login` directly still gets Wix's 403 page, because custom embeds do not run on that error page. Fixing those means pointing the three redirects at a normal page; left for a separate decision.

## Rollback

Disable embed `4ac7e692` (`enabled: false`). Nothing else to undo.
