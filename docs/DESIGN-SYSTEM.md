# GatorBait design system — what actually exists

Written for anyone wiring Figma (or any design tool) into this repo. It
describes the codebase as it is on 2026-09-24, not as a template assumes it is.

## Read this first: there is no app framework here

A design-system questionnaire expects React, a token pipeline, Storybook and a
bundler. **None of those exist in this repository, and adding them is not
currently justified.** Measured, excluding `divorce-club/` (an unrelated
business) and `gazette-preview/` (a retired Astro export):

| Expected | Actual |
|---|---|
| React / Vue / Svelte | none — 0 `.jsx`, `.tsx`, `.vue`, `.svelte` files |
| TypeScript | none — 0 `.ts` files |
| Build system / bundler | none — no `package.json`, no Vite/Webpack/Rollup |
| Tailwind or CSS-in-JS | none — no config, no styled-components |
| Storybook / component docs | none |
| Token transformation (Style Dictionary etc.) | none |
| Actual source | 14 `.js` (vanilla ES5-safe), 18 `.py`, 19 `.css` |

**This is correct for what the site is.** Production is a Wix site. The code
here ships as *custom embeds* — HTML/CSS/JS fragments injected into Wix's DOM —
plus Python generators that emit static HTML. Velo page code works through `$w`
against Wix elements, not raw DOM, which is why the renderers stay in embeds.
A framework would have to be loaded inside someone else's page on every view.

So: **Figma output must land as plain CSS custom properties and vanilla
DOM-building JS.** Any Figma export that assumes a React component tree, a JSX
codegen target or a build step cannot be used here without being rewritten by
hand, and rewriting by hand is how the drift below happened.

---

## 1. Token definitions

Tokens are CSS custom properties declared in `:root`. There is no transformation
step — the CSS *is* the token format.

The canonical file is **`studio/assets/tokens.css`**, which says so itself:

```css
/* GatorBait Studio — shared design tokens
   Source of truth for every Studio page family.
   Do not fork per-page color/type values; extend tokens instead. */
:root{
  --gb-orange:#FA4616;
  --gb-navy:#0021A5;
  --gb-navy-deep:#001040;
  --gb-font-display:"Georgia","Times New Roman",serif;
  --gb-size-hero:clamp(1.9rem,4.2vw,3.2rem);
  --gb-space-1:4px;
}
```

It carries brand colour, dark broadcast surfaces, a type scale (`--gb-size-*`,
using `clamp()` for fluid sizing) and a 4px-based spacing scale. It is imported
by `studio/assets/shell.css` and nine `studio/**.html` pages — **and nowhere
else.**

### The finding that matters: seven palettes, and a name collision

Its instruction not to fork values has not held. Every surface defines its own
`:root` with its own prefix and its own hex values:

| File | Prefix | "navy" | "orange" |
|---|---|---|---|
| `studio/assets/tokens.css` | `--gb-` | `#0021A5` | `#FA4616` |
| `newsroom-preview/styles.css` | *(none)* | `#08132f` | `#fa4616` |
| `newsroom-preview/mobile-shell.css` | `--gbm-` | `#08132f` | `#fa4616` |
| `newsroom-preview/site-experience.css` | `--gbx-` | `#08132f` | `#fa4616` |
| `automation/site-design/magazine.css` | `--n/--b/--o` | `#11274a` | `#e84b10` |
| `magazine/issue.css` | *(none)* | `#0A1F44` → fixed | `#FA4616` |
| `custom-css.css` | `--gb-` ⚠ | `#1a1a2e` | `#f47521` |

Two concrete problems:

**a) `custom-css.css` reuses the `--gb-` prefix with different values.** It
declares `--gb-accent-orange:#f47521` while `tokens.css` declares
`--gb-orange:#FA4616`. Both are global `:root` declarations. If they ever load
on the same page, load order decides the brand colour.

**b) One word, two roles.** `--gb-navy` is `#0021A5` — that is Florida's royal
*blue*, the brand colour. Every other file uses "navy" for a near-black chrome
surface (`#08132f`, `#11274a`, `#0A1F44`). These are different jobs and they
need different names. Collapsing them is *why* four values drifted:

```
Brand blue   #0021A5   UF official, used for brand marks and links
Brand orange #FA4616   UF official
Surface navy #11274a   dark chrome — most-used colour in the repo (172 uses)
```

`#11274a` (172 occurrences) and `#FA4616` (121) are what production actually
renders, so any Figma library should be built from those, with `#0021A5`
reserved for the brand mark.

### Rule for Figma work

1. A Figma variable maps to **one** CSS custom property in `studio/assets/tokens.css`.
2. Never introduce a second `:root` palette. Reference `var(--gb-*)`.
3. Never reuse the `--gb-` prefix outside `tokens.css`.
4. Name by **role**, not colour: `--gb-surface-navy`, not `--gb-navy`.
5. Adding a hex literal to a stylesheet that already imports tokens is a defect.

---

## 2. Components

There is no component library. Two patterns do the work.

**Runtime renderers** — vanilla JS that builds DOM inside a Wix embed:

```js
// newsroom-preview/wix-live.js — the production front page renderer
function cdn(url, w, h, q) { /* Wix CDN transform, see §4 */ }
```

Found in `newsroom-preview/wix-live.js`, `mobile-shell.js`,
`sports-live/homepage.js`, `automation/site-design/{shared-header,magazine}.js`,
`automation/sports-home/runtime.js`, `gazette-live/homepage.js`.

**Static generators** — Python emitting HTML from live data:

```python
# magazine/build_issue.py
def img_url(media_id, width, height, quality=88):
    ext = media_id.rsplit("~mv2.", 1)[1].split("/")[0]
    return "%s%s/v1/fill/w_%d,h_%d,al_c,q_%d,enc_auto/file.%s" % (...)
```

Found in `magazine/build_issue.py`, `frontpage/build.py`,
`studio/build_front_page.py`, `automation/gazette/build_wix_bundle.py`.

**A component is whichever function emits that markup.** There is no shared
registry, which is the second half of the drift problem: the same card is
written several times in several files.

### Constraint that outranks design

`docs/INCIDENT-2026-09-21-MULTI-WRITER-HOMEPAGE.md`: **exactly one embed may own
homepage structure.** Six scripts once rewrote the homepage at once and it
flickered between layouts in production. Before any new renderer ships,
enumerate every enabled embed touching `#SITE_PAGES`, `#SITE_HEADER`, root
classes or MutationObservers. A beautiful component that is the seventh writer
takes the site down.

---

## 3. Frameworks, libraries, build

No UI framework, no bundler, no package manager at the repo root. Playwright is
installed ad hoc inside CI jobs only (`npm i -D playwright@1.49.1`).

Build and verification is GitHub Actions:

| Workflow | Job |
|---|---|
| `site-vision.yml` | renders the **live** site in Chromium at 320/390/430/1280, screenshots, audits, commits results back |
| `magazine-issue.yml` | builds and renders the magazine issue to PDF |
| `newsletter-links.yml` | fails a send whose tracking links are malformed |
| `deploy-flagship-pages.yml` | GitHub Pages |

The agent sandbox cannot reach `gatorbaitmedia.com` or `static.wixstatic.com`;
runners can. **Any visual claim must come from a CI render, not from reading
CSS.** Four findings were wrong in exactly that way (`docs/inventory/2026-09-21/README.md`).

---

## 4. Assets

No local image assets and no CDN to configure — **Wix Media is the asset
pipeline.** Images are referenced by Wix media id and resized by URL:

```
https://static.wixstatic.com/media/<id>~mv2.jpg
  /v1/fill/w_1400,h_1120,al_c,q_88,enc_auto/file.jpg
```

Every renderer defines its own `cdn()` / `img_url()` helper doing the same
transform — another duplication candidate. Rules:

- Ask for **display-size pixels**. Never ship a 3000px original into a 760px slot.
- Quality: `q_80` web, `q_88` print/PDF.
- Extension must come from the id (`~mv2.` split); `.png` and `.jpg` both occur.
- **Look at every photograph before publishing.** A frame carrying a visible
  `© Tim Casey / GatorCountry.com` watermark reached the cover of a magazine
  issue intended for sale. No automated check reads a watermark baked into
  pixels.
- One image per slot per issue — `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` §4.3.

## 5. Icons

**There is no icon system.** One favicon in a retired Astro export; no icon
font, no sprite, no SVG set, no naming convention. Icon-like elements are
Unicode glyphs or CSS shapes (e.g. the `×` in `newsroom-preview/wix-live-ui.js`).

If Figma introduces icons, decide the delivery format first. Inline SVG is the
only option that survives inside a Wix embed without another network request —
and it counts against the **15,000-character** per-embed HTML limit.

## 6. Styling

Plain CSS with custom properties. No CSS Modules, no CSS-in-JS, no preprocessor.
Scoping is by prefix convention (`gbm-`, `gbx-`, `gb-`) because embeds share the
global scope with Wix's own stylesheets.

Responsive uses `max-width` media queries. **The breakpoints are not a scale** —
820, 900, 1240, 640, 480, 390, 1380, 1332, 1320, 1272px, mostly one-offs.

Two measured facts that must inform any Figma frame set:

- **Wix serves a 320px CSS layout to the narrowest phones**, below *every*
  breakpoint the embeds define (370/390/420/600/640/750/760), so none of their
  mobile CSS fires there.
- At 320 the usable viewport is **545px tall** and the consent banner covers
  roughly its bottom 230px. Design the first screen against 320×545 minus that
  banner, or the headline lands underneath it — which is what currently happens.

Design at **320, 390, 430 and 1280**. Those are the widths CI measures.

## 7. Project structure

Organised by **surface**, not by feature or layer:

```
newsroom-preview/   production front-page renderer (live source of truth)
automation/         site-design/, sports-home/, gazette/, vision/, newsletter/,
                    lighthouse/, ops-hub/
magazine/           downloadable paid issue builder (print/PDF)
newsletter/         curated teaser email (MJML) — links out, unlike magazine/
studio/             Studio page family + the canonical tokens.css
frontpage/ flagship/ sports-live/ gazette-live/   generators and deploys
docs/ skills/       playbooks, incidents, audits
deploy/             mirrors of live embeds, for rollback
backups/            do not delete; holds live adapters and rollback files
```

Two directories are **not** part of the design system: `divorce-club/`
(unrelated business, ~90% of the working tree) and `gazette-preview/` (retired
Astro export). Excluding them is why the counts above differ from a naive scan.

---

## Checklist before shipping a Figma-derived change

1. Tokens added to `studio/assets/tokens.css` only, named by role.
2. No new `:root` block; no `--gb-` prefix outside that file.
3. No new hex literal in a stylesheet that imports tokens.
4. Images requested at display size from the Wix CDN; every photo eyeballed for
   third-party watermarks.
5. If it renders on the homepage: confirm it is the **only** embed owning
   homepage structure.
6. Verified from a CI render at 320/390/430/1280 — not from reading the CSS.
