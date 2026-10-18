# Flash and uniformity audit, Oct. 18, 2026

Read-only Actions probe on branch `probe/flash-20261018` (workflow `probe-flash-20261018.yml`; the shared `probe/looks-audit-20261018` branch was being overwritten by another worker). 9 pages x 390/1366 x cold/warm, cache-busting URLs, default TLS. Frames, text/lead sampler, layout-shift observer, fetch and storage logs are in `deploy/flash-audit-*` on that branch.

## Findings

Homepage `/`: one render. No lead change, Barlow only, no stale content (the feed is read with `cache:'no-store'` and a per-minute query; `/blog-feed.xml` is served `max-age=604800` but is never read from HTTP cache). Left alone.

Inner pages (about, pricing, contact, categories, All News):
1. The native Wix page paints first (white body, orange italic native headline, Avenir body), then the Swamp Night shell lands. Cause: theme `c66d5b7f` loaded `site-shell.css` with `fetch()` and injected it, so first paint was unstyled. Cause 2: the page band `#gbm-band` and the `gbm-bc` class are set by script after DOMContentLoaded (desktop: about 160 ms after first paint, a 161 px jump and a restyle of the headline).
2. `/about` body copy rendered in Avenir (7 spans, inline Wix font class).
3. All News and categories: native "Florida Gators Headlines" shows, then the Latest lead (`#gbm-lp`), then `#gbm-sn` (title, tabs, search) mounts and pushes it down, then both re-render at about +2 s (CLS 0.14-0.27). Owners: `53e15504`, `602fb362`, `c4b41f6a`.
4. At 1366 a 0.5355 shift (`div.sh-track`, the ticker/header filling in) appears on some loads on every route.

## Applied live (Theme `c66d5b7f` rev 13 to 17, Typography `0709a98e` rev 6 to 7; guarded, ESSENTIAL re-sent, no site publish)

- Theme rev 14: render-blocking `<link rel=stylesheet>` for the shell CSS placed after the other styles (same cascade order as the injected copy).
- Theme rev 15 to 17: `gbm-bc` and `gbm-band-pre` set synchronously before first paint on inner pages (same route test as the band script); `go()` clears `gbm-band-pre` when the band is inserted; shell CSS re-pinned to `uniform-flash-20261018/site-shell.css`, which adds a first-paint height reserve for the band (collapses by itself after 3 s). Rev 16 reserved on every route and left a 124 px gap on `/` until the 3 s failsafe (homepage regression caught by the probe); rev 17 scopes the reserve to inner pages only.
- Typography rev 7: inline Barlow guard for Wix rich-text spans (`#SITE_PAGES [data-testid="richTextElement"] :is(span,a,strong,em,b,i,u,li,p)`). Headings keep Barlow Condensed (shell rule is more specific). Same rule is appended to `assets/sitewide-type.css` for parity.

## Rollback

- Theme: PATCH html from `rollback/c66d5b7f-rev13.html` (14,309 chars, djb2 `a76f00f2`) at the current revision, ESSENTIAL re-sent. Current bytes: `c66d5b7f-rev17.html` (14,819, `c9b34f31`).
- Typography: PATCH html from `rollback/0709a98e-rev6.html` (323, `618c1420`). Current bytes: `0709a98e-rev7.html` (498, `849532ab`).

## Not changed (proposed)

- Owner palette: the live look is Swamp Night (navy). Off-palette navy shades (#07122E, #0B1A44, #10264B) vs Dark Blue #002657 and Core Blue #0021A5 are a design direction, not a fix; one-word-yes if Brenden wants the navy tokens remapped.
- Buttons: white label on orange (magazine), navy #07122E (All News search), near-black #0B0D12 (pricing), #08132F (contact). Proposal: one label color on #FA4616.
- `/shop` renders in Avenir Next (Baker's / ItemOrder store page, not editable from the site); Wix login and member dialogs render in Madefor (Wix-owned).
- All News/category stacking (finding 3): hide the feed until `#gbm-sn` has mounted and stop the +2 s re-render in `602fb362`/`c4b41f6a`. Needs the Swamp Night owner's objects; not applied.
- Ticker fill-in shift (finding 4): reserve the header only after its cause is isolated (the header shell exists before first paint; the ticker content arrives about 70 ms after).
- `/latest` is a 404 (the Latest page is `/gatorbait-media-blogs`), `/account/my-account` returns 403 to the probe (bot challenge).
