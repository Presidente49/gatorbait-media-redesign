# GatorBait Studio Repo-First Toolbox

Status: reference and adoption candidates for the separate Studio build.
Production impact: none.

## Rule

Search repositories before custom-building any non-trivial interaction, community, media, accessibility, design-system or motion feature.

A repo is not adopted because it is popular. It is adopted only when it solves a named problem better than native Wix Studio and passes license, maintenance, mobile, accessibility, performance and rollback checks.

## Shortlist

| Repository | License/status checked | Job for GatorBait | Decision |
|---|---|---|---|
| superdesigndev/superdesign-skill | MIT | product-design workflow, design-system extraction, iterative visual drafts | REFERENCE / WORKFLOW |
| wagtail/news-template | BSD-3-Clause | newsroom hierarchy, page families, editorial IA | REFERENCE ONLY |
| bbc/simorgh | inspect before any reuse | resilient article patterns, accessibility, internationalized editorial architecture | REFERENCE ONLY |
| discourse/discourse | GPL-2.0 | mature community architecture and possible GatorBait.net backend | BACKEND CANDIDATE |
| vidstack/player | MIT | accessible video/audio player if Wix native playback is insufficient | COMPONENT CANDIDATE |
| greensock/GSAP | verify current license before adoption | advanced motion choreography | CONDITIONAL |
| greensock/gsap-skills | verify current license before adoption | motion implementation patterns | REFERENCE |
| Splidejs/splide | verify current license/version before adoption | lightweight touch carousel/rails | CONDITIONAL |
| nolimits4web/swiper | verify current license/version before adoption | richer touch-first media rails | CONDITIONAL |
| Studio-1119-Inc/wix-editor-mcp | existing internal tool lane | native Studio canvas inspection/build execution | TOOLING |

## What we should NOT do

- Do not fork a full newsroom framework into Wix.
- Do not rebuild membership, billing or blog systems in a separate stack.
- Do not add JS animation/carousel libraries before testing native Studio interactions.
- Do not copy a competitor's proprietary layout.
- Do not use a repo with unclear licensing for production code.
- Do not let visual experimentation change live routing or data.

## Feature-to-repo lookup

### Editorial / article
Look first at:
- Wagtail News Template
- BBC Simorgh
- existing GatorBait editorial templates

### Community / GatorBait.net
Look first at:
- Discourse core
- official Discourse themes/plugins
- accessible forum navigation patterns

### TV / podcast / multimedia
Look first at:
- Vidstack
- native Wix video/audio
- official platform embeds

### Motion
Look first at:
- native Wix Studio effects
- GSAP official patterns only when native effects cannot provide the desired interaction

### Rails / galleries
Look first at:
- native Studio repeaters/galleries
- Splide
- Swiper

### Product-design workflow
Look first at:
- Superdesign skill
- GatorBait Graphic Design skill
- GatorBait Studio Product Build skill

## Adoption record template

Feature:
Problem:
Native Studio option tested:
Candidate repo:
License:
Maintenance/activity:
Accessibility:
Mobile:
Runtime cost:
Data/privacy impact:
Rollback:
Decision:
Reason:
