---
name: gatorbait-design-quality
description: Use for GatorBait frontend design, Masthead/Newsroom refinement, mobile sizing, source integrity, responsive QA, and choosing design tools. Complements Master Control without changing its production authority.
---

# GatorBait design quality

## Read narrowly

Read `skills/master-control/SKILL.md`, then the current target source and `docs/HOMEPAGE-BASELINE-LOCK.md`. Reuse `docs/EDITORIAL-DESIGN-REFERENCES.md` and `docs/CONTINUOUS-DESIGN-BENCHMARK.md`; do not create a competing design authority. The current scope is Masthead-inspired presentation inside the existing Wix business, not a new CMS, app, website or theme installation.

## Design register

The homepage serves scanning; articles serve reading; account screens serve tasks. Preserve the approved orange/blue/white identity, compact masthead, real photographs, accurate bylines, clean chronological lists and modest editorial rules. About 85% publication discipline and 15% brand detail is a design intention, not a measured metric.

Use existing fonts unless a tested replacement earns its loading and layout cost. Generic guidance banning system fonts does not override GatorBait's speed requirement. No new animation, icon, carousel, font-CDN or frontend-framework dependencies for a styling adjustment. No bottom navigation, back-to-top arrow or unsolicited popup.

## Evidence before presentation

- A writer module may contain only that writer's source-backed story. Missing writer data means omission, not relabelling another writer.
- A sport section may contain only matching stories. Do not fill empty sections with another sport or infer a sport solely to fill space.
- Most Read and Trending require measured data, timeframe and retrieval time. Otherwise use an accurate neutral label or omit the module.
- Preserve source headlines, publication dates, article URLs and access restrictions. Fixture text is labelled synthetic and never published.
- Source photographs need source-backed credit. Never infer that every image is by Chris Spears.

## Bounded workflow

1. Inspect existing styles, responsive rules, header/footer owners, source schema and current branch activity.
2. Define the exact defect and a failing check before editing.
3. Fix the responsible source in an isolated branch; no extra live embed or blanket override.
4. Run one combined source/component inspection at 360, 390, 430, 768 and 1440 pixels, then one confirmation after fixes. Additional passes need new evidence, not aesthetic restlessness.
5. Record the exact source hashes, browser, test scope, failure cases and remaining blockers on existing issue #31. AdSense incidents remain #30.

## Fast gate

Use `newsroom-v2/qa/design_gate.py`. It reads actual source files, runs synthetic in-memory fixtures and writes screenshots plus JSON. It makes no external requests and changes no provider state. PASS means component checks passed, NOT production readiness. The homepage activation line is simulated because about:blank has no site route; native routing is outside this gate.

Do not substitute a hand-drawn Figma frame, a Lovable agent statement, or a recreated HTML mockup for a screenshot of the actual implementation. Missing WebKit, blocked navigation and absent physical-device access remain explicit blockers for those checks.

## Production gate stays separate

Before live promotion, test the real Wix preview, original production fallback, actual mobile drawer, article/account navigation, latest feed, failure recovery and consent-aware analytics. Verify no layout movement with loading and failed resources, not just a still screenshot. Do not bypass browser policies or consent. Do not spend money, merge, deploy, alter payment terms or add Google code merely because this skill is active.

Research provenance and tool-selection status: `docs/DESIGN-QUALITY-PACKET.md`.
