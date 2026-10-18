# Broadcast S3: story pages (`/post/...`)

Brenden, Oct. 17, 2026: every page in the look book's Broadcast design (`docs/design/BROADCAST-ROLLOUT.md`). This folder is S3's piece: every story page.

## One embed changes: `a5452619` (Post wide canvas)

The post template `14a887e3` is at 14,760 of 15,000 characters, so the skin cannot go there. It goes into `a5452619`, an S3-owned HEAD embed with room, as one appended `<script id="gbm-post-broadcast-v1">`. The live rev 4 HTML is kept byte for byte in front of it, so the rollback is a straight re-PATCH of `../a5452619/rev4.html`.

- `14a887e3` (template, including the `NEXT` "Up next" data), `c91ad133` (normalizer) and `f285a38c` (Share loader) are **not changed**. Their live HTML is saved next to this folder for reference.
- `build.py` reads `broadcast-story.css`, packs it the way `14a887e3` and `7fee4de6` already do (`` ` `` = the post-page prefix, `|` = the body hook, `$` = `!important`) and writes `a5452619-broadcast.html`. `broadcast-story.expanded.css` is the CSS the script inserts; the build checks in Node that the packed script expands to it exactly.
- Every rule starts `html:root body #SITE_PAGES [data-hook=post-page]`, one pseudo-class above the template, normalizer and this embed's own body rule, so the order Wix injects the embeds in does not matter.

## What the reader sees

- **The set:** deep-blue Broadcast background behind the page (the shared header and footer, S4's, are untouched).
- **Story header panel:** orange bug with the kicker, headline in italic Barlow Condensed 800 uppercase (60 px desktop; `clamp(32px, 9.8vw, 44px)` on phones: 32 / 38 / 42 px at 320 / 390 / 430), byline and date strip in spaced uppercase on a hairline, the orange chamfered "Share this story" slab, Story Kit chips as skewed tags, a neon orange rail under the panel.
- **Reading panel:** the article, footer, Keep Reading and comments sit on cream `#fffaf0` with ink text (16.8:1). Body 19 px desktop, 18 px phones, 17 px at 350 px and below, line-height 1.6. Wix's own widgets keep their dark text on a light panel.
- **Lead photo:** when a story opens with an image before any text, that image gets the slashed left edge with an orange slash (tagged by a few lines of JS, `data-gbm-lead`; a 150 ms-throttled observer on `#SITE_CONTAINER` re-tags it for 30 s after load and after each client-side navigation, because Wix re-renders the body about 8 s in, Lesson 60). Other images are not clipped, so photographer signatures and text in graphics stay whole. Captions/credits: spaced uppercase with an orange tick.
- **Subheads** (`h2`/`h3` and the normalizer's hand-made subheads): italic condensed uppercase with the orange-to-hairline rail.
- **Pull quotes** (`blockquote`): blue slab, orange edge, chamfered corner, white italic condensed type.
- **Up next:** white bar, orange tag, condensed italic matchup. Content comes from `14a887e3` unchanged.
- **Share row** (footer): navy chamfered 44 px tiles, orange on hover.
- **Story lists newest first** (Brenden, Oct. 18): Wix's Related Posts widget puts pinned posts first and is a cloned-slide carousel on phones, so it cannot be re-sorted. It is hidden, and the site's own Keep Reading box (`#gbm-kr`, the three newest stories from `/blog-feed.xml`, built by the post template) shows instead. The template hides `#gbm-kr` whenever the widget has items; `#gbm-kr#gbm-kr` outranks that rule.
- Text on orange uses the slab orange `#d33608` (4.9:1); `#fa4616` stays for rails and the slash.

Not touched: story text, headings, captions, links, embeds, the paywall, ads, analytics, SEO and the News SEO / FB pixel embeds.

## Fingerprints (djb2, Lesson 99)

| | revision | chars | djb2 |
|---|---|---|---|
| `a5452619` live, saved as `../a5452619/rev4.html` | 4 | 4,660 | `7333c42f` |
| `../a5452619/rev5.html` (live Oct. 17, 04:10Z, PR #306) | 5 | 13,017 | `4e46ef55` |
| rev 6 (lead tag observer), saved as `../../swamp-night-20261017/rollback/a5452619-rev6.html` | 6 | 13,331 | `8adf6ab2` |
| rev 7 (Swamp Night, Codex), saved as `../../swamp-night-20261017/a5452619-release.html` | 7 | 13,639 | `ce5fe4b2` |
| `a5452619-broadcast.html` (candidate: rev 6 Broadcast + newest-first Keep Reading) | → 8 | 13,077 | `f763a1b3` |
| `14a887e3` live (unchanged) | 20 | 14,760 | `7003636d` |
| `c91ad133` live (unchanged) | 7 | 6,264 | `4fe21601` |
| `f285a38c` live (unchanged) | 3 | 1,024 | `5de39fb5` |

## Apply

GET `a5452619`, confirm the live revision and djb2 are rev 7, `ce5fe4b2`, then PATCH `embedData.html` = `a5452619-broadcast.html` with that `revision` and `embedData.category` `ESSENTIAL`. Name, enabled, position and loadOnce unchanged. No site publish. 

**Rollback:** PATCH `../../swamp-night-20261017/a5452619-release.html` (rev 7, exact) at the then-current revision with category `ESSENTIAL`; `../a5452619/rev4.html` is the pre-Broadcast state.

While Codex's theme shell (`#gbm-broadcast-network-shell-v1`, `#SITE_PAGES#SITE_PAGES`) is live it outranks this skin's headline, subhead and pull-quote type, so those show the theme's look; the test reports them as notes, not failures.

## Test

```
PLAYWRIGHT=/opt/node22/lib/node_modules/playwright/index.mjs node deploy/broadcast-2026/story/test.mjs
```

Loads five real posts (an 8-minute column, Chris Spears' photo story, a members-only post, a column with subheads, the newest story) at 320, 390, 430 and 1366 px with the candidate injected in `<head>`, phones on the live-shots iPhone profile. A live revision's own script is neutralized so the candidate is what runs. Checks: no horizontal scroll, headline unclipped and off the screen edge, Broadcast headline type, AA contrast for every text node in the story header and the first 40 body paragraphs, Barlow only, body 17 to 19 px at 1.6, 44 px tap targets for the share slab, chips, footer share tiles and Up next, the subhead rail a client-side pull-quote probe, exactly one skin style on the page, the Related Posts widget hidden and Keep Reading visible with its links newest first by feed date. Result on the Oct. 18 build: chronology passes at all 20 post/width runs; the one failure is the story-end signup card's white-on-white fine print, which is identical on live without this candidate (theme shell). Screenshots are in `shots/`.
