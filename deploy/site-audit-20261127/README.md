# Site audit and bowl-picture research (Nov. 27, 2026)

Work product from the Jarvis session of Nov. 27, saved when that session wrapped up. Nothing here is deployed by this folder. Receipts for what did reach production are in issue #34 (7218633617, 7219261631, 7219718973).

- `sweep-findings.json`: 36 findings from a read-only sweep of the core pages at phone (320/390/430) and desktop/tablet (768/1366/1920) widths: dead space, phone layout, unreadable text, broken widgets, speed. Each has pages, evidence, cause and a proposed fix. **No second pass ran, so every item is unverified.** The article, listing, post-content and embed-inventory finders did not finish. Already shipped from this list: the eager-prefetch removal (`core-phone-1`, `core-desktop-3`).
- `bowl-picture/facts.json` and `bowl-picture/bowls.json`: fact ledgers (value, source URL, how it was read) for a Florida bowl-picture explainer: records, rankings, the eight-win claim recomputed by season, Jadan Baugh's totals, the series, SEC bowl order, bowl dates and sites, named projections. Read the morning of Nov. 27, before Florida at Florida State kicked off. **No story was written or published.** Re-verify anything the game changes before use.
- `tools/gbprobe.cjs`: the rate-limited page checker the sweep used (phone emulation, blank-band detection, contrast, overflow, network weight; `GB_INIT`/`GB_CSS` stage a fix in a test browser without saving it). `tools/stage-wide.js` previews a page at real phone width. `tools/gamewatch.cjs` logs kickoff, scores, quarter ends and the final for one ESPN event.

The sign-up wall audit from the same day is summarised in #34 without member or order counts; its raw output is not stored here.
