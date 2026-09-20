# UI Mining Registry — GatorBait Studio

These libraries are reference/component mines for the existing Wix Studio wireframe. They are NOT a replacement frontend stack.

## Approved to mine

### shadcn-ui/ui
- role: structural UI patterns
- use: drawers, dialogs, tabs, search, forms, account controls, accessibility patterns
- adoption: REFERENCE / selective pattern port
- do not install React runtime into Wix merely to use these patterns

### magicuidesign/magicui
- license: MIT per upstream README
- role: polished motion and visual interaction ideas
- use: bento editorial modules, marquee/media rails, subtle animated borders/highlights, number/text micro-motion
- adoption: SELECTIVE PORT
- avoid: SaaS/neon aesthetic, motion on every card

### ColorlibHQ/velora-ui
- license: MIT
- role: complete responsive page/component reference
- use: reduced-motion-aware component ideas, tokenized theming, section composition
- adoption: REFERENCE / selective port
- avoid: importing Next.js/Tailwind/Motion stack into Wix

### DavidHDev/react-bits
- upstream README labels license MIT + Commons Clause
- role: animation idea catalog only
- adoption: REFERENCE ONLY unless a specific component's licensing is separately cleared
- no wholesale production copy

### Aceternity UI
- role: cinematic effect reference
- adoption: REFERENCE ONLY until exact component license is verified
- use sparingly for Magazine/TV concepts, never core News readability

## Wix-native implementation order

1. Native Wix Studio layout/component
2. Native Studio interaction/motion
3. wix/interact if native Studio cannot achieve the approved effect
4. Port the visual idea from an approved UI library using the lightest Wix-native implementation
5. Never add React/Next/Tailwind solely to reproduce an effect

## GatorBait component targets

### Universal shell
- sticky masthead
- responsive drawer
- search
- account/saved/watchlist
- join CTA
- universal footer

### News
- lead package
- chronological headline stream
- compact secondary cards
- score/context strip
- related coverage
- save/follow/share

### TV
- current/live hero
- swipe rails
- episode tiles
- watchlist
- Watch/Listen destinations

### Magazine
- cover interaction
- feature bento
- photo gallery
- archive rail
- tasteful scroll/reveal effects

### Community
- board rows
- thread list
- activity metadata
- watch/follow controls
- real data only

## Performance gate

Any mined effect must:
- preserve semantic text
- work at 390/430
- support reduced motion
- avoid first-paint hiding
- avoid permanent observers/polling where possible
- not require a framework solely for decoration
