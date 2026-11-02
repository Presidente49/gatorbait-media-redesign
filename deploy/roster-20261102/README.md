# Live roster page (Nov. 2, 2026)

Brenden: a real-time roster page like FloridaGators.com, with injuries and status. This is the new /roster page.

- Data: `sports-live/florida-roster.json` (117 players, headshots and bios from FloridaGators.com; `status` block holds injuries/availability with source and date). Served by GitHub Pages; the widget re-fetches it on every load, so a merged data change is live within minutes.
- Widget: `sports-live/src/roster.js`, built by `node tools/roster/build-roster.mjs` into `sports-live/roster-widget.js` (ASCII only, roster snapshot inlined as offline fallback).
- Loader: `loader.template.html`, a Wix custom embed (HEAD, loadOnce false) pinned to an immutable jsDelivr commit. It takes over `/roster` and the existing roster post URL. Patch in place with a revision check, exactly 2 occurrences of the pinned SHA.
- Rollback: disable the embed (`enabled:false`), and `/roster` shows the old post with its static table again.
- Status updates: after each SEC availability report (Wed/Thu of game week), Sumrall presser (Mon) and any UF news, edit the `status` block and `updated`/`updatedLabel`, rebuild, PR, merge. Statuses allowed: out, doubtful, questionable, limited, injured, probable, returning. Cite the source URL and date for every entry; no rumors.
