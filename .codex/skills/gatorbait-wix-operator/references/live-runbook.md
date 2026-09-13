# GatorBait Media Live Runbook

## Production identity

- Wix site ID: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`
- Live URL: `https://www.gatorbaitmedia.com/`
- Repository: `Presidente49/gatorbait-media-redesign`
- Wix editor type: Editor
- Velo: enabled, but use only when it solves a concrete problem more safely than scoped custom code.
- Site contact email: `brenden@gatorbaitmedia.com`
- Official store: `https://gatorbait2026.itemorder.com/shop/home/`


## Operator mandate

**God Mode for Chris** means the user wants decisive execution within the active GatorBait task. Complete authorized reversible work end to end, use discretion on implementation details, minimize cost and return with verified results instead of a plan. Maintain one writer for live Wix mutations and use additional agents for independent inspection or QA.

## Product and editorial direction

The homepage is the interactive front page of a magazine. Keep it simple:

1. Official masthead.
2. One dominant current story and photograph.
3. Compact Florida football result and schedule context.
4. A short chronological group of current stories.
5. Clear paths to GatorBait TV, GatorBait Magazine and membership.

The visual direction is restrained editorial design: a light paper canvas, deep navy structure, Florida orange accents, strong photography and readable typography. Avoid broadcast dashboards, pale-blue category banners, empty modules, duplicate navigation and decorative clutter.

Feature Buddy Martin, Franz Beard, Loren and active contributors when current content supports it. Do not manufacture dates, results, author credits or photographer credits.

## Brand assets and typography

- Optimized official logo display name: `GatorBait Logo - Optimized Web`
- Wix media ID: `d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp`
- URL: `https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp`
- Intrinsic dimensions: 900 × 241, transparent WebP, approximately 196 KB.
- Header display: 250 × 67 px desktop; 160–195 px responsive mobile range.
- Footer display: approximately 205 px wide.
- Alt text: `GatorBait Media`.

Use Georgia/Times New Roman for editorial headlines and the native system UI stack for body text, navigation and controls. Do not restore the Archivo/Fraunces Google Fonts import. It delayed type rendering, and an `!important` specificity conflict prevented the intended mobile headline size from applying. Headlines use weight 700 rather than 900.

## Newsletter and names

The newsletter is **GatorBait Weekly**. Its source template is `backups/gatorbait-weekly-template.html`.

Do not use:

- The Monday Chomp or Monday Chomp.
- Quick Chomps.
- Gatorade Magazine.
- Trump newsletter wording.

Signup dialogs need a visible 44 × 44 close control, Escape dismissal and session dismissal. Keep the value statement short and the email form simple.

## Routes and navigation

- Homepage: `/`
- Magazine: `/magazine`
- GatorBait TV and The Buddy Martin Show: `/the-buddy-martin-show`
- Membership: `/pricing-plans`
- Policies: `/policies`
- Contact: `/contact`\n- Legacy contact redirect: `/contact-form` → `/contact` (Wix SEO redirect ID `66590679-8a74-41c0-8b82-b723100ecd81`).

Primary navigation should emphasize current content and destinations. Do not list every historical sport or expose category-feed pages as the main visitor experience.

## Current critical embeds

Revisions change after every successful write. Always GET the current entity before PATCH.

| Purpose | Embed ID | Verified name on 2026-09-13 |
|---|---|---|
| Header, optimized logo and newsletter exit behavior | `7fee4de6-1886-475e-a3f3-b9c68161c242` | GBM - Compact Optimized Logo + Header v9 |
| Front-page magazine styles | `3dc5a5ef-5160-4539-8e6d-1c5c4b972c78` | GBM - Fast Readable Magazine Cover v2 |
| Global typography | `0709a98e-e95f-42e1-99a8-5f018ad85457` | GBM - Fast System Typography v2 |
| Stable first paint | `2f57bc6b-e05f-4a96-adf3-cb02e2b18e51` | GBM - Front Page stable boot (no fade) |
| Light theme | `c66d5b7f-c474-45b5-af4d-662ae1eaf67c` | GBM - Light Theme v1 |
| Footer and social links | `f8b950c9-47ce-4390-976f-85a0f040f0c6` | GBM - Compact Optimized Logo + Social Footer v7 |
| TV menu | `796b7ce7-b05e-4cc6-9d90-dcf7a6626270` | GBM - Desktop + Dynamic Mobile TV Menu v4 |
| TV, magazine and news images | `82c4ca83-98df-4f35-9972-7345a2a71755` | GBM - TV + Magazine + News Images v7 |
| Newsletter labels | `ed3718cc-5ca3-485b-a7dc-1c697afdcd5f` | GBM - Newsletter Labels v2 (bounded, no observer) |
| Policies | `fb8963cc-9d47-4162-b00d-8a60ca5fac64` | GBM - Policies & Compliance v1 |
| Store routing | `4409bdd9-abb2-4981-9455-46973dcc9a05` | GBM - Official ItemOrder Store v1 |\n| Global redirects and article metadata | `5a43ae83-690e-4933-971d-4837db00b2f3` | GBM - Site Fixer v7.1 (contact redirect) |

## Known failure patterns

The landing page flashed when three layers competed during first paint: the dark theme and light theme were enabled together, the front page faded from opacity zero, and a DOM patch ran every 200 ms forever.

The retired dark embed must remain disabled:

- ID: `0293e8b3-998d-4e94-881c-f9481749f5f4`
- Name: `GBM - Dark Magazine Theme v8 (OFF - conflicts with light theme)`

The repository files `custom-css-LIVE.css` and `custom-css.css` are historical dark-theme sources. Do not deploy them. Avoid global selectors for all `p`, `h1`, `article` or Wix components. Avoid first-paint opacity animation, permanent observers and permanent short-interval polling.

The official logo's original PNG was 2196 × 598 and approximately 1.4 MB. The optimized WebP should remain the live source. Reserve intrinsic width and height to avoid layout shift, and never constrain width and height independently in a way that distorts the aspect ratio.

## Verification baseline

The latest public checks confirmed:

- Official 900 × 241 logo loaded completely.
- Header logo rendered proportionally at 250 × 67 px.
- One-pixel visual gap between masthead and navigation.
- No horizontal overflow at the checked desktop viewport.
- Landing-page headline used Georgia, weight 700.
- No Google Fonts import remained in the active front-page stylesheet.
- No clipped landing-page text was detected.
- Newsletter heading rendered as GatorBait Weekly.
- No Monday, Chomp or Gatorade Magazine wording appeared in the live page text.

For mobile, verify near 390 px and 430 px: masthead/menu separation, headline wrapping, two-column football stats, 44 px controls, image crops, form dismissal and footer reachability.

## Repository sources of truth

- `IMPLEMENTATION-GUIDE.md`
- `docs/LANDING-PAGE-QC-2026-09-13.md`
- `docs/superpowers/specs/2026-08-05-gatorbait-editorial-template-design.md`
- `backups/gatorbait-weekly-template.html`
- `docs/EDITORIAL-DESIGN-REFERENCES.md`

## Automated quality control\n\n- `.github/workflows/gatorbait-production-health.yml` runs dependency-free public route and homepage-marker checks every six hours.\n- `automation/site_health_check.py` is the deterministic checker and should remain the first line of defense.\n- `.github/workflows/gatorbait-agentic-audit.md` is a manual-only, budget-capped reasoning audit compiled with GitHub Agentic Workflows. It may report verified failures through one safe issue; it must not mutate Wix, DNS, deployments, or repository files.\n