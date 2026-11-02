# Article-page header flash fix — Mon., Nov. 2, 2026

Brenden: article pages flashed dark, then blue, then white. "Keep the blue one."

## Root cause
`site-light.js` (embed 6e6854b7, async) arrives 1.7 to 3 s after first paint. Until then the page showed earlier dark skins (Header v12 `#040c30`, Light Theme v1 `#0b0d12`, post-broadcast gradient). Then embed fce181f6 added class `gbm-ph`, which turned the post header white at about 3 s.

## Live changes (guarded PATCH, current revision, ESSENTIAL re-sent, no site publish)
1. `6e6854b7` Sitewide Light Skin v1, rev 1 to 2, 574 to 806 chars, djb2 2633901a to 84dfeaac. Repo copy: `deploy/sitewide-light-20261031/loader.html` (updated byte-for-byte in this PR). Adds a hold: site header and post header are `visibility:hidden` until `#gbm-sl-css` exists (3.5 s fail-safe).
2. `fce181f6` Post header compact + phone width v1, rev 9 to 10, 13,470 to 13,422 chars, djb2 dcc2ae83 to a9256617. No repo copy exists. Removed one statement so the white compact header class is no longer added; everything else is untouched.

## Rollback
- `6e6854b7`: re-PATCH `deploy/sitewide-light-20261031/loader.html` from git history (574 chars, djb2 2633901a).
- `fce181f6`: in the `fix()` function, replace the comment `/* gbm-ph class add removed Nov. 2 (keep blue post header) */` with
  `if(n&&n.parentElement&&!n.parentElement.classList.contains('gbm-ph'))n.parentElement.classList.add('gbm-ph');`
- Or disable either embed.

## Verification
Playwright frame polling on a Franz column and the new basketball post: headers hidden through the dark phases, then site header white and post header `rgb(0,33,165)` together, `gbm-ph` absent. Settled shots at 430 and 1366 px. Logged in issue #34 (comment 6579800137).
