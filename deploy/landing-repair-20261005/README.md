# Landing-page repair — October 5, 2026

Current owner request: fix landing-page 404s and Magazine cover/opening; remove the spin; retain permanent roster, football schedule and Buddy Martin Show schedule links.

## Existing production preserved

The initial inspection found `current.json` 6bcc317 and Home Code revision48. During preparation the owner advanced these to deadd8ee and revision49, adding the explicit inline Magazine mount flag and issue pin88ae0124. This release preserves that newer inline mount, issue pin, FIRST LOSS artwork, existing design, chronological article order and show schedule text.

## Bounded changes

- Replace the malformed iframe closing-script tags with valid generated HTML.
- Keep the inline issue lazy until a reader opens it, without a cover spin, timed wait or smooth-scroll animation.
- Add a visible Close control, keyboard/Escape closing, and reopening at the beginning without reloading the issue.
- Skip the redundant internal cover entrance only inside the inline reader. The standalone Magazine implementation is unchanged.
- Normalize Wix cover identifiers with exactly one `~mv2` suffix, retaining the same current image.
- Add permanent roster, football schedule and Buddy Martin Show schedule shortcuts near the top of the homepage. The latter jumps to the existing show section; no new showtimes are inferred.
- Point Stats to official UF football statistics and Standings to official SEC football standings. Both open in a new tab and say so accessibly. The missing native Wix pages are not created, disguised or redirected.

## Route evidence

The full live Wix inventory has68 embeds. Stats embed756655cf-06e2-451e-afcf-6a5606959cbc exists at revision5; the corresponding native Wix page remains absent. No Standings renderer exists. Do not create a duplicate Stats embed based on a truncated list response.

Destinations verified Oct.5:
- https://floridagators.com/sports/football/stats (resolves to current2026 statistics)
- https://www.secsports.com/standings/football (official Football standings)

## Tests and rollback

Build: cb5f0f83. JavaScript syntax, local deterministic open/close/reopen/Escape and HTML-tag checks pass; full front-page generated-output check passes locally. Run node deploy/landing-repair-20261005/test-reader.cjs from the repository root.

Targeted browser QA uses the existing live-shots workflow on shots/landing-simple-20261005, covering320/390/430/1366 plus390 reduced-motion. Inspect the returned metrics and screenshots, not workflow success alone.

Rollback: previous homepage pointer deadd8eeff9dac05b3658243927a9a32f3b199ab, Home Code revision49. Preserve all other embed HTML and use fresh revision/branch-head guards. Do not restore the earlier17:00 candidate or overwrite a newer owner change.

No article or standalone Magazine publication, email, payment, permissions, member data, routes or broad site publication changed.

Candidate verification: all five cases passed in run37378295349 on candidate015f93a2. Immutable screenshot/metrics evidence34e96afe78eb85ca7de48637b8240a392d669c5b. The exact existing eight-card issue was verified, without adding or removing stories. Aggregate run37377996563 fails on the pre-existing stale weekly sports-live/magazine.js build before runtime tests; source parity and fixture contracts pass. No required branch status checks are configured.

Final same-build verification includes section navigation inside the iframe: all five cases pass in run37378998751 on candidatee74ffb52. Evidence2ab2b87a46a3f6d951707e06eaf382b8b64d06cc. Cover images were decoded before screenshots; phone and desktop artwork and opened issue were visually reviewed. Contents links scroll within the iframe, and reopening returns to0 without reloading it.
