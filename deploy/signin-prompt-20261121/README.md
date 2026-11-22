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

## Version 2, same night: the typed addresses

`/signin`, `/login`, `/sign-in` and `/my-account` were redirects to `/account/my-account`, so a logged-out visitor who typed one still got the 403 page (custom embeds do not run on it).

- The four redirects now go to `/?signin=1`.
- The embed (revision 2, 1,806 characters, name "GBM - Sign in opens the login box v2") gained an on-load step: on `?signin=1` it waits for Wix's login bar and `wixEmbedsAPI`, removes the flag from the address bar, then opens the login box for a logged-out visitor or sends a logged-in member to `/account/my-account`.

Checked live at 390 and 1366 px: each of the four addresses answers 301 to `/?signin=1`, the page loads with status 200, the address bar ends at `/` and the Wix login box (Email, Password, Forgot Password, Google, Facebook) is open.

Still not covered: a logged-out visitor who types `/account/my-account` itself. That is the real members page, and a redirect on it would lock members out. Not exercised: a real login and the logged-in branch.

## Rollback

Disable embed `4ac7e692` (`enabled: false`) and point the four redirects back at `/account/my-account` (create-redirect with `forceReplace: true`). To keep the click fix and drop only version 2, restore the version 1 HTML from this folder's Git history.
