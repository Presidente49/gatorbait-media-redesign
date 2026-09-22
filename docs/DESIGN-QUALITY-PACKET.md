# GatorBait design quality packet

Reviewed September 22, 2026. Work item: #31. Implementation branch: `masthead-design-quality`, based on `masthead-wix-refresh` commit `611941423dc17d349e01775c4912362e89fecb34`.

## Decision

Upgrade the design process, not the number of page builders. Keep the approved Masthead-inspired direction and the existing Wix business. Reuse the repository's Master Control, site-operations skill, `EDITORIAL-DESIGN-REFERENCES.md` and `CONTINUOUS-DESIGN-BENCHMARK.md`. These additions do not supersede the homepage baseline lock.

## Current external resources reviewed

| Resource | Source evidence | Decision |
| --- | --- | --- |
| Impeccable | `pbakaus/impeccable`, skill version 4.3.1, Apache 2.0 declared in skill frontmatter; README blob `2c52ab4374c914513fc1e3ad4857f63e8c56e468`, skill blob `8c591fc56b0fd25c47a93ec5b2078f078cfe02db` | Adapt the audit, critique, typeset, harden, adapt and bounded-verification ideas into original GatorBait guidance. Do not install its binary, global hooks or blanket aesthetic preferences. |
| UI UX Pro Max | `nextlevelbuilder/ui-ux-pro-max-skill`, current README blob `4f0a13340753466048afa98a2b330731d7b0b48f` | Optional design-system reference. A multi-framework generator is not required to refine this existing Wix frontend. Not installed. |
| Playwright | Official emulation documentation; Python Playwright 1.57.0 and Chromium 144.0.7559.96 already available in the execution environment | Use the existing browser tooling for reproducible source-component tests. No new production dependency. Browser simulation is not physical iPhone verification. |

Primary references:

- https://github.com/pbakaus/impeccable
- https://github.com/pbakaus/impeccable/blob/main/plugin/skills/impeccable/SKILL.md
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://playwright.dev/python/docs/emulation

The blob identifiers record the reviewed content rather than implying that a mutable README stays unchanged. No external skill text or library implementation is vendored. GatorBait's brief, accessibility and speed constraints take precedence over generic aesthetic advice.

## What was added

- `skills/gatorbait-design-quality/SKILL.md`: original scoped design packet.
- `.agents/skills/gatorbait-design-quality/SKILL.md`: a thin entry pointing to the canonical packet, without hooks or package installation.
- `newsroom-v2/qa/design_gate.py`: reproducible local source-component gate.
- `newsroom-v2/qa/README.md`: execution instructions and scope limits.
- `newsroom-v2/qa/verification-2026-09-22.json`: timestamped result, source hashes and outstanding verification.

## Draft defects corrected

1. Missing Buddy/Franz data no longer labels an unrelated writer's article as their column.
2. Empty sport sections and their navigation links are omitted instead of reusing unrelated stories to fill space.
3. Unmeasured `Trending` is labelled `More Coverage`; no popularity claim is inferred from feed order.
4. A missing adapter reports a component failure instead of retrying every 30 milliseconds indefinitely. Full Wix loader recovery still requires live verification.

The newer mobile CSS in commit `6119414` was preserved, including the peer workflow's font-size and body-margin fixes. This packet does not claim those changes as its own and does not overwrite that stylesheet or the data adapter.

## Evidence

With the current base source, the gate passed 21 of 25 checks. With the four renderer corrections it passed 25 of 25. At 360, 390, 430, 768 and 1440 pixels the synthetic fixture had no horizontal overflow or out-of-viewport descendants. Computed lead sizes were 30, 30, 34.4, 42 and 61.92 pixels respectively. JavaScript syntax checks also passed.

This is a component result, not production certification. The browser ran the actual CSS, adapter and renderer with synthetic stories and a dummy header slot; one homepage activation line was explicitly simulated in memory because browser navigation was blocked. No browser policy was changed. Screenshots of hand-drawn Figma frames or an AI builder's assurances are not substitutes for this evidence or for live testing.

## Remaining live gate

Before promotion, verify the real Wix preview, existing V1 fallback, mobile drawer, article and account navigation, feed/network failures, real media loading, layout shift, consent and ads. WebKit and a physical iPhone were not tested. Live navigation was blocked by the execution environment; the packet does not claim that adding a testing script fixes that access limitation.

## Change control

No Wix embed, production CDN pin, domain, payment, email, member, consent or Google configuration was changed by this packet. No paid service was activated. Do not merge or publish merely because component tests pass. Review the isolated branch, preserve any intervening work and run the live gate before the existing controller promotes it. Rollback consists of reverting this branch's commit; production has no dependency on these additions.
