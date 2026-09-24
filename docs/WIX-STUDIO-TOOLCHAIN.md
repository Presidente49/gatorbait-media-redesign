# Wix Studio Toolchain — GatorBait

Purpose: give Claude/Codex the smallest reliable toolbox for finishing the EXISTING Wix Studio wireframe. The Wix Studio canvas remains source of truth. Do not replace it with the repo HTML prototype.

## Approved repo-first stack

### 1. wix/skills — PRIMARY
Official Wix agent skills. MIT. Experimental, so pin/review before upgrades.
Jobs:
- Wix Design System reference
- Wix API/docs discipline
- Wix business data wiring
- Members, Blog, Pricing Plans, CMS and related Wix services

Claude Code install:
```
/plugin marketplace add wix/skills
/plugin install wix@wix
```

### 2. AnthonySeshat/WiXAnything — READ-ONLY SIGHT LAYER
MIT public beta. Use only with the actual Wix Studio Git Integration repo containing wix.config.json.
Jobs:
- expose real element IDs and $w types
- layout/computed-style map
- Media Manager map
- CMS schema map
- stop agents guessing Wix element IDs

Do not treat it as a visual editor. It is a read-only mapping layer.

Install from the Wix Studio Git repo root:
```
npx -y github:AnthonySeshat/WiXAnything#v0.3.0 --repo .
cd visual && npm install && cd ..
```
Then, after Wix CLI login and when a published/previewable URL is appropriate:
```
npm run wix:full -- --url "<page-url>"
```

### 3. wix/interact — MOTION, CONDITIONAL
Official Wix open-source interaction/motion system. MIT.
Use only when native Studio interactions are insufficient.
Jobs:
- view-enter
- scroll-progress
- hover/pointer
- tasteful magazine/TV motion

Agent skill:
```
npx skills add wix/interact -a claude-code
```

Do not add this merely to animate every card.

### 4. superdesigndev/superdesign-skill — DESIGN WORKFLOW
MIT.
Job:
- design direction
- design-system critique
- page/flow iteration
- anti-generic visual thinking

Claude Code:
```
/plugin marketplace add superdesigndev/superdesign-skill
/plugin install superdesign@superdesign
```

Use for design critique/drafts. Do not let it create a second competing site architecture.

### 5. PyModel/designer-skill — QA / ANTI-SLOP, OPTIONAL
MIT.
Job:
- UI/UX reference
- accessibility checks
- deterministic anti-slop review

Do not install unless Superdesign + Wix-native design review leave a real QA gap. Avoid redundant design-agent layers.

## Explicitly NOT approved for the Studio canvas

### naieum/wix-editor-mcp
Useful MIT project, but its own documentation says it targets Classic/Harmony/Odeditor and is NOT for Wix Studio. Do not point it at the new Studio wireframe.

## Execution order

1. Open the existing Wix Studio wireframe.
2. Confirm the correct Wix Studio Git Integration repo/worktree and wix.config.json.
3. Install official wix/skills first.
4. Add WiXAnything to the Studio Git repo so the coding agent can see real element IDs/types/layout.
5. Read generated maps before writing Velo.
6. Use native Studio layout, responsive behavior, repeaters, CMS and interactions first.
7. Use wix/interact only for a demonstrated native-motion gap.
8. Use Superdesign to critique and refine the EXISTING wireframe, not replace it.
9. Wire existing GatorBait Blog/member/business data.
10. Preview, test 390/430/tablet/desktop, accessibility, performance and URL preservation.
11. Publish only after explicit owner approval.

## Repo-first adoption gate

For any new dependency:
- exact job
- license
- maintained?
- Wix-native alternative tested?
- page-weight/runtime impact
- accessibility/mobile impact
- rollback
- ADOPT / REFERENCE / REJECT

No dependency without a job.

## Source of truth hierarchy

1. Existing Wix Studio canvas/wireframe
2. Live Wix business/content data
3. Generated Wix element/CMS/media maps
4. studio-product-system architecture/routing docs
5. GitHub HTML prototype only as visual/reference support

Never invert this hierarchy.
