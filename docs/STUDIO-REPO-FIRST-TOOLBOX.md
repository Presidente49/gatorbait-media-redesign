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
| flarum/flarum | MIT, checked 2026-09-20 | lighter PHP/Laravel forum backend; smaller extension catalog than Discourse, no Postgres/Redis stack to run | BACKEND CANDIDATE |
| NodeBB/NodeBB | GPLv3, checked 2026-09-20 | realtime-first (Node.js) forum backend; GPLv3 requires source disclosure only if redistributing/reselling, fine for self-hosted internal use | BACKEND CANDIDATE |
| vidstack/player | MIT, checked 2026-09-20 — actively maintained, WCAG 2.2/WAI-ARIA/CVAA compliant, HLS/DASH + live streaming support | accessible video/audio player if Wix native playback is insufficient | COMPONENT CANDIDATE |
| greensock/GSAP | 100% free incl. commercial use since Apr 2025 (Webflow acquired GSAP, license blocker removed) — checked 2026-09-20 | advanced motion choreography | CONDITIONAL (license cleared; still gated on a demonstrated native-Studio limitation) |
| greensock/gsap-skills | same as above | motion implementation patterns | REFERENCE |
| Splidejs/splide | MIT, but single-maintainer and issue/PR backlog growing since mid-2023 — checked 2026-09-20 | lightweight touch carousel/rails; best-in-class built-in ARIA carousel pattern | CONDITIONAL — accessibility strength weighed against maintenance risk |
| nolimits4web/swiper | MIT, checked 2026-09-20 — large contributor base, 40k+ stars, active releases, enterprise adoption | richer touch-first media rails | CONDITIONAL — preferred over Splide if a JS rail is actually needed, purely on maintenance-risk grounds |
| Nodlik/StPageFlip (npm: page-flip) | MIT, checked 2026-09-20 — TypeScript, zero deps, actively maintained | realistic page-turn interaction for Magazine's interactive current cover | COMPONENT CANDIDATE — only if native Studio cover motion can't deliver the effect; must stay optional/skippable per motion rules |
| Studio-1119-Inc/wix-editor-mcp | existing internal tool lane | native Studio canvas inspection/build execution | TOOLING |
| henrygd/ncaa-api | MIT, checked 2026-09-20 — actively maintained, self-hostable via Docker, real scores/stats/standings from ncaa.com, 5 req/sec on the public instance | real live game-result data for the Front Page hero strip (currently hardcoded static text in the studio/ prototype) | COMPONENT CANDIDATE — scores/standings only, not a transfer-portal or recruiting data source |

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
- Flarum (lighter PHP/Laravel stack)
- NodeBB (Node.js, realtime-first)
- official Discourse themes/plugins
- accessible forum navigation patterns

Cost reality check (checked 2026-09-20, for the backend decision, not a commitment):
- Discourse managed hosting: Free tier (500k pageviews/2 staff), Starter ~$20/mo, Pro ~$100/mo, Business ~$500/mo.
- Discourse self-hosted: free software, ~$30/mo all-in infra (VPS + SMTP), needs a Linux-comfortable operator.
- Flarum: MIT, PHP/Laravel, lower resource footprint than Discourse's Rails+Postgres+Redis stack, but a smaller extension catalog (may need custom work for SSO/analytics/moderation depth GatorBait wants).
- NodeBB: GPLv3, Node.js, realtime-first UX; source-disclosure obligation only applies if GatorBait redistributes/resells it, not for internal self-hosted use.

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
- Swiper (preferred over Splide on maintenance grounds — see Shortlist)
- Splide (stronger built-in accessibility pattern, but single-maintainer risk)

### Magazine cover motion
Look first at:
- native Studio cover/section-reveal interactions
- Nodlik/StPageFlip only if native motion can't deliver a convincing page-turn and the effect stays skippable/optional

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
