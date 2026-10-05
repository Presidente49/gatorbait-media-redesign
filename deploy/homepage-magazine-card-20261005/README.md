# Homepage Magazine card — October 5, 2026

Owner requested updating the Magazine card. Replace the arbitrary news-post selection and stale Thursday label with the current live postgame issue: Buddy Martin's “Hey Missouri, don’t show me anymore!” The 9:16 preview uses the same UAA photo, crop, headline and centered green MAGAZINE treatment as the live Magazine release e0bf32359c7d560239d15e7baf8a0e64da2a1952. Both cover and button go to /magazine. No article or Magazine-page content changed.

`sports-live/magazine-card.json` is the explicit edition snapshot used by the homepage build. Update it from the next published Magazine issue when rotating the edition. Never select an arbitrary homepage story as the magazine cover.

Checks: compiled JavaScript syntax, generated-output check and whitespace passed. Preview capped at 240px, with reserved 9:16 space and responsive image delivery. Public verification follows deployment.

Rollback: homepage pointer and current Wix HOME_CODE fallback a38ea279cf2de8db9724d28339368735a66e34e1; read fresh Wix revision before changing the fallback. Scope limited to homepage Magazine preview and compiled outputs; prior byline suppression and editorial order retained.
