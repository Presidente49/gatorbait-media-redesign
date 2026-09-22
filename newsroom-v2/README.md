# GatorBait Newsroom V2 — Masthead Wix Refresh

This is the isolated front-page presentation layer for the Masthead-inspired Wix refresh.

## Boundaries

- Wix remains the CMS/business engine.
- This layer reads the existing `/blog-feed.xml` only.
- It does not own members, pricing, store, email, analytics, consent, article pages, or the universal footer.
- It mounts only on the homepage.
- Preview activation: `?gbm_preview=masthead-v2`.
- Production activation is intentionally separate and must replace the V1 presentation, never stack beside it.

## Files

- `data-adapter.js` — normalizes Wix RSS into a small story model.
- `masthead.js` — one deterministic render of the homepage.
- `masthead.css` — all V2 presentation CSS, scoped to `#gbm-live.gbm-v2`.

## Mobile

The existing unified Wix mobile shell remains the sole mobile navigation owner. V2 hides its desktop masthead at 820px and below rather than creating a second mobile shell.

## Rollback

The locked V1 Newsroom remains the production fallback until V2 is explicitly promoted.
