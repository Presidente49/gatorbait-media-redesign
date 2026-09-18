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

The visual direction is a professional digital newsroom with strong photography, clear hierarchy and readable typography. Designers may change layout, color, density and editorial treatments when the result is tested on desktop and mobile. Keep one active theme, stable first paint, accurate content and accessible contrast.

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
- Contact: `/contact`
- Legacy contact redirect: `/contact-form` → `/contact` (Wix SEO redirect ID `66590679-8a74-41c0-8b82-b723100ecd81`).

Primary navigation should emphasize current content and destinations. Do not list every historical sport or expose category-feed pages as the main visitor experience.

## Current critical embeds

Revisions change after every successful write. Always GET the current entity before PATCH.

| Purpose | Embed ID | Verified name on 2026-09-13 |
|---|---|---|
| Header, optimized logo and newsletter exit behavior | `7fee4de6-1886-475e-a3f3-b9c68161c242` | GBM - Compact Optimized Logo + Header v9 |
| Front-page newsroom styles | `3dc5a5ef-5160-4539-8e6d-1c5c4b972c78` | GBM - Newsroom Front Page v3 |
| Global typography | `0709a98e-e95f-42e1-99a8-5f018ad85457` | GBM - Fast System Typography v2 |
| Stable first paint | `2f57bc6b-e05f-4a96-adf3-cb02e2b18e51` | GBM - Front Page stable boot (no fade) |
| Light theme | `c66d5b7f-c474-45b5-af4d-662ae1eaf67c` | GBM - Light Theme v1 |
| Footer and social links | `f8b950c9-47ce-4390-976f-85a0f040f0c6` | GBM - Compact Optimized Logo + Social Footer v7 |
| TV menu | `796b7ce7-b05e-4cc6-9d90-dcf7a6626270` | GBM - Desktop + Dynamic Mobile TV Menu v4 |
| TV, magazine and news images | `82c4ca83-98df-4f35-9972-7345a2a71755` | GBM - TV + Magazine + News Images v7 |
| Newsletter labels | `ed3718cc-5ca3-485b-a7dc-1c697afdcd5f` | GBM - Newsletter Labels v2 (bounded, no observer) |
| Policies | `fb8963cc-9d47-4162-b00d-8a60ca5fac64` | GBM - Policies & Compliance v1 |
| Store routing | `4409bdd9-abb2-4981-9455-46973dcc9a05` | GBM - Official ItemOrder Store v1 |
| Global redirects and article metadata | `5a43ae83-690e-4933-971d-4837db00b2f3` | GBM - Site Fixer v7.1 (contact redirect) |

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

## Automated quality control

- `.github/workflows/gatorbait-production-health.yml` runs dependency-free public route and homepage-marker checks every six hours.
- `automation/site_health_check.py` is the deterministic checker and should remain the first line of defense.
- `.github/workflows/gatorbait-agentic-audit.md` is a manual-only, budget-capped reasoning audit compiled with GitHub Agentic Workflows. It may report verified failures through one safe issue; it must not mutate Wix, DNS, deployments, or repository files.


## 2026-09-13 compact mobile typography

- Active typography embed `0709a98e-e95f-42e1-99a8-5f018ad85457` is revision **4**, named **GBM - Compact Mobile Typography v3**.
- Mobile feed headlines are 18 px with 1.22 line height; front-page story headlines are 19–20 px; article copy is 16 px; primary drawer labels are 15 px.
- Desktop feed headlines remain 20 px and use Georgia at weight 700. Metadata uses the native UI stack at 11.5 px.
- The adjustment is scoped to GatorBait components and Wix Blog data hooks. It does not restore global heading selectors, remote fonts, opacity animation or polling.
- Public verification confirmed the new stylesheet loaded, desktop hierarchy remained intact, the homepage had no horizontal overflow, and all four front-page images loaded with alt text.


## 2026-09-13 Campbell postgame publishing repair

- Created Wix Blog category **Eddie Gilley - Blog** (category ID `e6afe41f-9b9f-4c0a-a3bf-7fcd54658fb7`).
- Published category assignments for Franz Beard's Sumrall post: Gator Football, Gator Breaking News, Franz Beard - Blog and Jon Sumrall.
- Published category assignments for Franz Beard's September 12 Thoughts of the Day: Franz Beard - Blog and Thoughts Of The Day.
- Published category assignments for Eddie Gilley's defensive review: Gator Football, Jon Sumrall and Eddie Gilley - Blog.
- Created a **GatorBait Weekly** Campbell postgame email draft (campaign ID `9bd07477-8eb1-4727-a3fc-9ce114d5e86e`). Distribution status is NOT_STARTED; do not publish/send without explicit owner approval.


## 2026-09-13 homepage postgame story sequence

- Updated homepage embed `cd933ccb-8b1a-42d8-bcc1-738ba0621e8b` to revision **9**, named **GBM - Stable Magazine Cover v4**.
- The lead remains Buddy Martin's Campbell recap.
- The visible Inside GatorBait cards now run newest-first: Franz Beard's Sumrall analysis, Eddie Gilley's defensive review, then Franz Beard's September 12 Thoughts of the Day.
- Public cache-busted verification confirmed all three links and article-specific image alt text.


## 2026-09-17 homepage art + mobile compact alignment

- Added published Wix cover/hero art to `Florida Gators 2026 Roster and Schedule Update: Auburn Opens SEC Play` using Media Manager image `d3cfa5_1b088b6993b340859003979d846fc644~mv2.jpg`.
- Replaced the old Rodney Dangerfield-style cover media on `The Trenches Don’t Lie: Florida’s Defense Dang Better Show Up in Jordan-Hare` with new Florida-Auburn art `d3cfa5_afff5dfb681e4070a45b775a6fa826ee~mv2.png`.
- Updated `newsroom-preview/wix-live.css` to keep mobile Latest thumbnails and text in fixed-height aligned rows with clamped headlines at 640 px and 390 px breakpoints.
- Active loader `fdc2127a-845a-4d02-b711-438f1a4a86ce` is revision 7, named `GBM - Newsroom Loader v5 (stable mobile)`; the former 3-second opacity boot was removed and the loader now references CSS commit `34d3254ac5f0634b90bbf6177572959552f3b612`.
- Published-post API verification confirmed both updated stories expose custom displayed media and hero images; the loader mutation response confirmed no opacity-boot rule remains.


## 2026-09-18 publishing + email controller rules

- Published Buddy Martin's `Welcome to the Killing Fields: Why Jordan-Hare Eats Gators for Breakfast`.
- Replaced the plain lead image with the saved Killing Fields banner crop, Wix media `d3cfa5_e0a5961689134b0bbf2f320bd82f6e7a~mv2.png`.
- Disabled misleading generic blog-email automation `824714d4-7e31-4b1d-95b2-ccec04d788af` at revision 14 after confirming its actual action was `triggered-emails`.
- Rebuilt and activated `GatorBait Story Alert — New Blog Post`, automation `5006baf5-fbbf-440c-a012-a09bdbd95fc9`, revision 9. Preview against Buddy's real post passed brand, title, image and CTA checks before activation.
- Created the Florida-Auburn GatorBait Magazine pregame draft `b8fdc1c7-5ec0-4e55-952c-594ccad59bb0`. It is DRAFT / NOT_STARTED and must not send without owner approval.
- Magazine build enforces unique imagery: 7 visual slots / 7 unique image URLs. Ryan Urquhart is text-only rather than duplicating art.
- Owner direction: no Magazine gallery by default.
- See `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` for the repeatable controller workflow.


## 2026-09-18 housekeeping verification

- Wix public business-contact email was corrected to `brenden@gatorbaitmedia.com` with an email-only site-properties update.
- Email Marketing account verified `ACTIVE`; the Florida-at-Auburn pregame magazine was `SENT`. Audit snapshot: 580 delivered, 90 opened, 11 clicked, 5 bounced, 0 complaints, 0 not-sent.
- `GatorBait Story Alert — New Blog Post` automation `5006baf5-fbbf-440c-a012-a09bdbd95fc9` remains `ACTIVE`; retired generic blog-email automation `824714d4-7e31-4b1d-95b2-ccec04d788af` remains `INACTIVE`.
- GitHub Actions runtime housekeeping merged through PR #12: checkout/setup-python are on the maintained v7 line without changing workflow cadence or production behavior.
- `newsroom-preview/wix-live-ui.js` support address corrected to `brenden@gatorbaitmedia.com` and merged at `52aa887d42310cdd035ce7407716afe9287f35c1`.
- Active custom embed `fdc2127a-845a-4d02-b711-438f1a4a86ce` is now revision 8. It loads the corrected UI JS commit and no longer suppresses the intended `#gbm-live` compliance footer in bootstrap CSS.
- Keep the loader fail-open behavior and existing mobile breakpoints. Do not reintroduce a rule that hides both the native Wix footer and the standalone newsroom footer.
- Still local-only: complete the multi-harness Mac bootstrap/auth/smoke-test/launchd/n8n queue activation gate before recurring model dispatch.

## 2026-09-18 performance + continuous design learning

- Best Friday in Football is a recurring Friday show. Its Sept. 18 article was normalized from the temporary LIVE NOW title to Best Friday in Football with Buddy Martin | September 18, 2026; the URL was preserved.
- Front Page performance promotion is now a separate layer from primary editorial home. The current rolling seven-day top-three view leaders are stored in newsroom-preview/editorial-routing.json and surfaced through a deduplicated Trending Now module.
- Active newsroom loader fdc2127a-845a-4d02-b711-438f1a4a86ce is revision 10, named GBM - Newsroom Loader v6 (performance + stable mobile), and loads wix-live.js commit 28b74a18a0b2a431ff8c4c9acab073122b690db1.
- Continuous live competitor/design review is now governed by docs/CONTINUOUS-DESIGN-BENCHMARK.md.
- Text-bearing article hero art must pass an actual 390/430 px render check; source-image review alone is not sufficient.


## 2026-09-18 landing-page rebuild verification

- Owner-directed top package is now Buddy Martin lead, Franz Beard secondary, Carlton Reese secondary.
- Best Friday in Football and the older Buddy Martin live-show post are explicitly excluded from the landing page.
- Carlton/14 Days article cover and hero use Wix media `d3cfa5_66ca0317b876431b8cfcb910becc6376~mv2.png` with no faces.
- Loren Meadows Week 3 Florida-Auburn preview cover and hero use Wix media `d3cfa5_77949cc88d0e4fb39c78f7f1c2a60728~mv2.png` with no faces.
- Landing page JavaScript commit: `cc45f40ff1be2707f8a262a2138a0c967d0863b8`.
- Landing page CSS commit: `ca8d374ba2764d2c83420499a04530e675c75afc`.
- Editorial routing commit: `1f9e565817ca7174b7f7100d54cf0bc2f37b9a12`.
- Homepage UI branding commit: `49fa2b7f9164e8ba274a87e0294ff9a5bddaacf0`.
- Active loader `fdc2127a-845a-4d02-b711-438f1a4a86ce` is revision 12, named `GBM - Newsroom Loader v8 (verified magazine landing)`.
- Verification caught and fixed a fail-open defect: the safety check still expected the old `.lead/.compact/.card` DOM. It now validates `.feature-lead`, `.feature-side`, `.news-card`, and `.trend-item` so the new homepage is not discarded after rendering.
- GatorBait Weekly wording in the homepage UI layer was normalized to GatorBait Magazine.


## 2026-09-18 mobile stability + embed consolidation

- Deleted 27 disabled/retired/superseded Wix custom embeds after exact-name/state verification. Removed dark-theme experiments, old Magazine card generations, obsolete homepage patches, backups, retired article subscribe CTA, and the outage-era standalone newsroom loader. No active production embed was deleted in that pass.
- Active newsroom loader `fdc2127a-845a-4d02-b711-438f1a4a86ce` is revision **13**, named `GBM - Newsroom Loader v9 (stable mobile no popup)`. It pins the repo UI release that removes the scheduled newsletter modal and removes the old permanent 500 ms / 1200 ms newsroom/UI polling loops.
- Replaced remaining permanent route/layout polling with event-driven + bounded checks:
  - `602fb362-3917-4e42-9128-57af3a504ef3` → revision **4**, `GBM - Sports Feed Cards v10 (event-driven)`
  - `1dd74333-ee02-40da-9c93-cf8fd787c129` → revision **10**, `GBM - Magazine Digital Cover v5.4 (event-driven)`
  - `15302fb2-44ef-4a93-a2a8-899731a6c197` → revision **2**, `GBM - Sitewide Footer Gap Guard v2 (event-driven)`
  - `ccddc822-4ebd-4141-af10-536e58485b26` → revision **6**, `GBM - Article Nav v3 (event-driven stable footer)`
- Bounded the final long-lived DOM observers:
  - `4409bdd9-abb2-4981-9455-46973dcc9a05` → revision **2**, `GBM - Official ItemOrder Store v2 (bounded observer)`
  - `14048e5a-da72-4a2c-9a8f-5e4e105aa0b` → revision **2**, `GBM - Remove Blog Follow Buttons v2 (bounded)`
- Exact rollback snapshots are stored in:
  - `backups/wix-embeds/2026-09-18-pre-no-polling-stability.txt`
  - `backups/wix-embeds/2026-09-18-pre-observer-bounding.txt`
- Verification: the active custom-embed stack no longer has unbounded short-interval polling. Remaining `setInterval` calls are bounded startup/fail-safe retries that explicitly clear themselves.
- Important source-level debt: the native Wix fallback HTML still contains legacy `Today’s Edition` and `The Monday Chomp` content. The repo-backed newsroom hides/suppresses this for the visitor experience, but crawlers/raw native markup can still see it. Remove those native elements at the Wix page/source layer once the site is moved onto Wix Git Integration / Velo site code; do not solve this by adding another permanent DOM polling layer.
