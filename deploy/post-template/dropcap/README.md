# Shared article drop-cap restoration

The ordinary October 25 and October 24 Franz pages had no drop-cap style or activation script. Their opening prose qualified for the existing recent-article treatment, but the active post template omitted the `gbm-week-rich-style/js` layer already present in `../proposed.html`.

`layer.html` restores that design in existing template embed `14a887e3-38ea-4258-ae0b-7d19cf9feead`, preserving the original template prefix and all embed settings. It marks exactly one actual block (the first Ricos span when block-level, otherwise the paragraph), so nested first-letter styles cannot compound. It clears old markers and deactivates outside article routes. No requests, forms, article text or publication events are added.

The native template changed from revision 24 to 26, with final length 14,935 characters, below Wix's 15,000 limit. `receipt.json` records fingerprints. Before any further change, read the live embed and current revision; never append this layer twice. Rollback removes the final layer from the current template only after confirming the original prefix fingerprint, then PATCHes with category ESSENTIAL at the new current revision. The exact private prechange snapshot is retained in the task output.

Verification: all inline scripts parse; independent review approved one first-letter origin; ordinary public URL shows a floated 87.4px orange Barlow Condensed T, one cover, unchanged full manuscript/headings, and no article overflow at 1366px. Genuine mobile rendering was unavailable. HawkScan CLI 6.5.0 and skills passed preflight; the platform returned HTTP 402 Payment Required before a scan could start. Security verification remains incomplete.
