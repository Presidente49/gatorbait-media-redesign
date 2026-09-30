# Native link / writer archive implementation

Owner request: September 30, 2026, “Let's implement them.” Scope recorded in #34.

## Implemented on branch

- Story Kit 2026.2 respects existing native article anchors and suppresses duplicate destinations, including roster/depth-chart synonyms. Roster and schedule fragments remain distinct. Existing author text, article text, layout and metadata are unchanged.
- A pure writer archive builder validates a declared complete source window, exact visible writer credit, evidence reference, canonical URL uniqueness, dates, precision and recall before rendering. A Wix memberId alone is insufficient. GatorBait Staff has no personal archive.
- Compact native-HTML archive renderer: name plus linked gatorbaitmedia.com, newest first, 12 initial cards, native More stories disclosure, no author portrait or invented bio. Only explicitly credited images are rendered.
- Ten deterministic tests and an isolated browser matrix at 320/390/430/1024/1365, including native links with script off/blocked/on, hydration replacement, 200% text sizing and archive disclosure. Fixture content is synthetic, never a published article.

## Verified locally

Ten writer-data tests passed. JavaScript syntax, generated bundle reproducibility and whitespace checks passed. Browser download failed in the local runtime, so no mobile/desktop render is claimed. The PR-only native-parity workflow is the remaining browser gate. This workflow has read-only contents permission, no production credentials and no deployment step.

## Not deployed / remaining integration

No Wix article was changed. Native anchors in existing stories still require editorial selection and a fresh draft read, preserving any unpublished edits. No live writer route was created or switched; connect the builder to a complete, reviewed published-story dataset first, including explicit bylines that override publisher ownership. The rolling latest-100 window is not a lifetime archive. Do not treat the short RSS feed as complete.

Jarvis remains the live surface owner recorded in CURRENT-STATE and #34. The current production pointer is untouched. Before rollout: inspect CI screenshots, refresh main and the current source data, verify exact named-writer credits and destination completeness, then coordinate the smallest live integration through #34. Public runtime verification must record served build; fixture tests are not live-site or physical-device certification.

No search rankings, AI citations or engagement improvement is claimed. No schema, robots, sitemaps, consent, email, payments, or automation state changed.

## Commands

```
node --test sports-live/test-writer-archive.mjs
node sports-live/build-front-page.mjs
node sports-live/build-front-page.mjs --check
node sports-live/qa-native-parity.mjs
QA_ONLY=story node sports-live/qa-front-page.mjs build/story-kit-parity
```

Rollback before deployment: close the PR; no live state to restore. A later deployment must record its then-current pointer and rollback independently; do not restore an old snapshot over other work.
