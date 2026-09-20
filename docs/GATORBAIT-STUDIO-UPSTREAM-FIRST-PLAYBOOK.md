# GatorBait Studio Upstream-First Playbook v1

Status: active build doctrine for the new Studio product.
Scope: Studio development only. Production cutover still requires verification.

## Owner directive

When an approved upstream project publishes an installation or implementation playbook, follow that playbook as written first. Do not prematurely translate it into a different architecture merely to avoid dependencies.

Build the reference implementation, measure it, then decide what reaches production.

## Lab vs production

### Studio Lab
May install and run the complete upstream recommended stack needed to reproduce/evaluate components:
- official Wix agent skills
- Wix Interact skill/packages
- Superdesign skill + CLI
- shadcn tooling
- Velora reference/template and registry components
- Radix primitives
- Embla
- Motion
- Lucide
- other transitive dependencies required by the selected upstream components

### Production Wix Studio
Promotion happens after:
- design usefulness proven
- license checked
- build succeeds
- responsive behavior checked
- accessibility/reduced-motion checked
- page-weight/performance measured
- integration path with Wix business data is understood
- rollback exists

The lab is allowed to be broader than production.

## Required upstream setup

### Wix official skills
Claude Code:
```
/plugin marketplace add wix/skills
/plugin install wix@wix
```

### Wix Interact
```
npx skills add wix/interact -a claude-code
```
When used, follow upstream workflow and install the packages the skill selects, including validator/presets as required.

### Superdesign
Claude Code:
```
/plugin marketplace add superdesigndev/superdesign-skill
/plugin install superdesign@superdesign
npm install -g @superdesign/cli@latest
superdesign login
```

Then follow its SOP:
1. investigate current UI
2. create/extract `.superdesign/design-system.md`
3. create pixel-accurate BEFORE replicas under `.superdesign/replica_html_template/`
4. create project/drafts
5. branch/iterate designs
6. implement approved result

Do not invent improvements inside the BEFORE replica.

### Velora
For the lab/reference implementation, follow upstream:
```
git clone https://github.com/ColorlibHQ/velora-ui.git
cd velora-ui
pnpm install
pnpm dev
```

Use its registry/component metadata to evaluate:
- bento grid
- marquee
- animated list
- expandable card
- direction-aware hover
- scroll progress
- sticky scroll
- blur fade
- floating navbar
- sticky banner
- reduced-motion behavior

Velora's upstream stack includes Next.js, React, Tailwind, shadcn, Motion, Radix, Embla and Lucide. In the LAB, accept those dependencies as upstream specifies.

### shadcn
Follow its copy/own model. Components become editable project source, not opaque black-box UI.

Use its registry/MCP tooling where appropriate in the lab.

### Radix / Embla / Motion / Lucide
When selected by the upstream component/template, use the upstream dependency rather than rewriting it before evaluation.

## Mining workflow

For each GatorBait page family:
1. run the upstream reference implementation
2. select candidate components
3. assemble a GatorBait design draft using real content shape
4. compare against current Studio wireframe
5. remove generic SaaS visual language
6. apply GatorBait tokens, editorial typography and photography
7. test desktop + 390 + 430
8. test keyboard/focus
9. test reduced motion
10. measure component/runtime cost
11. document KEEP / MODIFY / DROP
12. promote approved patterns into the Studio implementation

## Page targets

### Front Page
Mine:
- bento hierarchy
- animated list/headline stream
- sticky banner for live/current context
- restrained hover/reveal
- compact quick destinations

### Article
Mine:
- progress indicator
- clean tabs/dialog/drawer patterns
- save/follow/share
- related coverage presentation

### GatorBait TV
Mine:
- Embla rail behavior
- expandable media cards
- hover/tap previews
- watchlist controls
- video/audio destination UI

### Magazine
Mine aggressively:
- bento
- blur fade
- sticky scroll
- scroll progress
- direction-aware hover
- feature reveals
- cover interaction

### Community
Mine:
- accessible tabs/dialogs/tooltips
- dense list/table hierarchy
- follow/watch controls
Avoid decorative motion.

### Account/Search
Mine:
- shadcn/Radix patterns
- drawers
- command/search behavior
- forms
- dialogs
- tabs

## Visual doctrine

The upstream implementation is a COMPONENT SOURCE, not the GatorBait brand.

Final visual system:
- navy / Florida blue / orange / white
- editorial photography
- strong serif display hierarchy where appropriate
- clean sans UI
- restrained News
- richer Magazine
- cinematic TV
- dense readable Community
- no generic SaaS pricing-page look
- no fake engagement
- no Sidelines branding

## New playbook learning loop

OBSERVE upstream -> INSTALL as documented -> RUN -> ASSEMBLE -> MEASURE -> ADAPT -> VERIFY -> RECORD -> PROMOTE

Record:
- component
- source repo/version
- dependency tree
- page used
- performance
- accessibility
- mobile result
- visual result
- decision
- implementation notes

Do not rewrite upstream guidance before the first successful reference run.
