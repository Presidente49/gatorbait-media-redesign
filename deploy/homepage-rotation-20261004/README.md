# Owner-directed homepage rotation and Jarvis layout integration — October 4, 2026

Active owner instruction: use the newer layout already worked on with Jarvis/DOT, put Loren Meadows in the main box, move Brenden Martin stories down, and prioritize Buddy Martin, Franz Beard and Loren in the top package. This is a direct interactive rollout, not a scheduled worker run.

## Integrated changes

- Jarvis PR #131, `05d41a7f681b4010f7dc4fd8f418898752fcacb3`: Gator Day white/blue/orange layout, compact sentence-case headlines, lighter masthead and final-score ticker deduplication.
- Jarvis PR #135, `4601ca93a24811358639a00832aa44653e552545`: writer archive links and 48-hour NEW badges. Co-lead remains disabled so Loren has the single main box. Preserve the verified Chris Spears gallery link and newest-first default lead from current main.
- Loren's published October 3 Week 5 Florida–Missouri preview is the timed feature through October 5, 16:00 UTC. This is a labeled preview, not a new postgame article. Buddy, Franz and Loren fill the secondary feature and upper news list; other news stays in the lower Latest module. Publication dates and actual bylines are preserved.
- Bundle 20 fallback stories so the selected writer package is available even if live feed requests fail.

## Archive corrections already applied

Both blog alerts were confirmed INACTIVE immediately before category-only publication: `5006baf5-fbbf-440c-a012-a09bdbd95fc9` rev17 and `824714d4-7e31-4b1d-95b2-ccec04d788af` rev39. No alert configuration changed.

- Franz post `f7f9e0b0-d55c-4af1-bd22-cb05a7714e29`: added category `1feacd08-2894-47d1-a1f4-9b0c7a3a82a6` to an empty category list. PUBLISHED; original firstPublishedDate `2026-10-04T13:33:37Z` preserved.
- Buddy post `04a43828-61f4-457e-abf5-2120b510525b`: retained existing categories `a2061cbb-0984-473d-800e-b8cabab1f470`, `a4577921-a2e9-41bb-8a5d-4a9c56f2eb5b`; added `d87d6b50-11d3-494d-97cd-aad63680bc49`. PUBLISHED; original firstPublishedDate `2026-10-04T01:10:26Z` preserved.

Both records had no unpublished changes immediately before the patch. This does not claim a historical archive backfill.

## Verification before release

JavaScript syntax, reproducible build (`build-front-page.mjs --check`) and whitespace checks pass. A DOM-independent render check against current feed/scoreboard verifies Loren as the pinned lead, light theme, exactly one h1, Buddy/Franz/Loren in the top package, Brenden retained only in the lower package, archive links and no `/null` href. Desktop public-runtime and mobile screenshot verification follow deployment.

## Release and rollback

Previous live pointer: `2009d1857772389679d06424e3f4d71a71d48b6d`; previous visible build stamp: `549b1a0c`.

The current Wix HOME_CODE embed `622d8ece-df55-44fc-9e4a-3f580804743b` revision38 contains an expired Buddy pin that overrides repository selection. The exact previous HTML is saved as `home-code-rev38.html`. Release removes that obsolete override and updates the timeout fallback to the integrated release commit. The pointer remains the central deployment mechanism.

Rollback: restore `sports-live/current.json` to the previous commit and restore the saved embed HTML using its fresh current revision. Revert category-only corrections separately only if necessary, preserving any subsequently added categories or drafts. No broad Wix site publish is required.
