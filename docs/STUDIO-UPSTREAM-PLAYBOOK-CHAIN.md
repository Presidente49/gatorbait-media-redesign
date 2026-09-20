# Upstream Playbook Dependency Chain — GatorBait Studio

Rule: follow upstream playbooks before adding dependencies. Mine recommendations recursively, but stop when a dependency does not have a specific GatorBait job.

## Chain discovered

### wix/skills
Upstream recommends:
- new Wix CLI
- Wix Design System skill
- Wix Manage skill
- Wix docs skill
- optional headless/vibe-headless skills only for headless projects

GatorBait decision:
- ADOPT skills/docs/manage/design-system workflow
- REJECT headless as current architecture; existing Wix Studio canvas is source of truth

### wix/interact
Upstream recommends:
- @wix/interact
- @wix/motion
- @wix/motion-presets
- @wix/interact-validate
- optional @wix/splittext
- Interactor agent skill

GatorBait decision:
- ADOPT Interactor skill for Studio motion work
- ADOPT interact + presets only when a real Studio-native motion gap is identified
- ADOPT validator whenever interact configs are used
- CONDITIONAL splittext for Magazine feature typography only
- no blanket runtime install

### Superdesign
Upstream recommends:
- Superdesign skill/plugin
- @superdesign/cli
- persistent .superdesign/design-system.md
- replica_html_template of existing UI before redesigning a page
- design drafts/branches rather than coding blind

GatorBait decision:
- ADOPT workflow
- create design-system from approved Studio canvas, not from stale Classic shell
- use replicas as design context only
- do not let Superdesign create a competing architecture

### Velora UI
Upstream stack/recommendations:
- shadcn/ui registry
- Motion
- Embla Carousel
- Lucide
- Radix UI
- reduced-motion global handling
- token-driven theming
- component cost/dependency metadata via registry/llms.txt

GatorBait decision:
- ADOPT cost-aware component selection and reduced-motion discipline
- REFERENCE Embla interaction behavior for TV/Magazine rails; native Studio first
- REFERENCE Lucide icon vocabulary; prefer Wix/native icon assets when possible
- REFERENCE Radix accessibility/state patterns
- REJECT Next.js/Tailwind/React stack for the Wix Studio production canvas
- REJECT installing full Velora template

### shadcn/ui
Upstream philosophy:
- own/copy component source
- customize into your own design system
- do not treat it as an opaque package

GatorBait decision:
- ADOPT philosophy
- port structural/accessibility patterns into native Studio components
- do not introduce React solely for shadcn

## Second-order repos to inspect/reference

### radix-ui/primitives
Job: accessible component-state behavior for menus/dialogs/tabs/tooltips.
Decision: REFERENCE ONLY for Studio implementation semantics.

### davidjerleke/embla-carousel
Job: touch-first carousel behavior reference for TV, Magazine and galleries.
Decision: REFERENCE / CONDITIONAL only if Studio rails cannot meet requirements.

### Lucide
Job: consistent icon language.
Decision: REFERENCE; avoid shipping a whole icon runtime if Wix/native SVGs suffice.

### Motion
Job: Velora animation dependency/reference.
Decision: REFERENCE; Wix Interact/Motion is preferred because production is Wix Studio.

## Stop conditions

Do not recursively install:
- Next.js
- Tailwind
- React
- Radix runtime
- Embla runtime
- Motion runtime
- Lucide runtime

unless the existing Wix Studio canvas demonstrates a specific requirement that native Studio + Wix Interact cannot satisfy.

## Build playbook

For each page family:
1. capture/inspect actual Studio canvas
2. check .superdesign design system
3. compare approved competitor patterns
4. search upstream UI registry/component ideas
5. choose lowest-cost pattern
6. implement natively in Studio
7. add Wix Interact only when necessary
8. validate motion config
9. test reduced motion
10. test 390/430/tablet/desktop
11. test keyboard/focus
12. measure load/layout stability
13. record learning

## Priority pattern mine

Front Page:
- shadcn structural hierarchy
- Velora bento only for one controlled feature package
- compact headline stream
- native rails

TV:
- Embla/Velora rail behavior reference
- Wix Interact subtle hover/view transitions
- watchlist controls patterned after accessible primitives

Magazine:
- Velora bento/scroll progress/blur-fade concepts
- Wix Interact scroll progress and view-enter
- optional splittext only for one editorial treatment

Community:
- Radix-style tabs/dialog semantics
- no decorative animation needed

Account/Search:
- shadcn/Radix interaction semantics
- minimal motion
