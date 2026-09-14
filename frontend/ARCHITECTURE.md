# GatorBait Clean Frontend v1

## Non-negotiable rule

Do **not** build this design on top of the existing Wix Blog page architecture.

The replacement uses blank Wix routes as controlled canvases. Wix remains the publishing backend and article system; the custom frontend owns presentation on brand-defining routes.

## Keep from production

- Wix Blog as the source of published stories.
- Existing `/post/...` article URLs and Wix article publishing workflow.
- Membership and pricing-plan infrastructure.
- Analytics and compliant policies.
- The official optimized GatorBait logo.
- GatorBait Weekly newsletter work.
- Existing media library and original reporting photography.

## New presentation boundary

Each custom route contains one Wix-hosted Custom Element:

`<gatorbait-publication>`

The component uses Shadow DOM. It has:

- no Wix DOM selectors;
- no global CSS;
- no polling;
- no MutationObserver;
- no REST calls;
- no dependence on Wix Blog card markup.

Wix page code queries published content with the documented `@wix/blog` JavaScript SDK and passes normalized story data to the component through the Custom Element `data-json` attribute using `$w(...).setAttribute()`.

## Routes

### `/`
Publication homepage:
- one dominant current story;
- compact latest-news rail;
- chronological Inside GatorBait feed;
- GatorBait TV, Magazine and Join destinations;
- GatorBait Weekly callout.

### `/football`
Blank section page running `mode="section"`, filtered to Florida football content.

### `/recruiting`
Blank section page running `mode="section"`, filtered to recruiting content.

### `/the-buddy-martin-show`
Blank page running `mode="tv"`.
GatorBait TV is the product name. The Buddy Martin Show YouTube channel is the current video source until the product expands.

### `/magazine`
Blank page running `mode="magazine"`.
This is the foundation for a true digital issue experience, not a restyled category grid.

### `/post/...`
Remain native Wix Blog article pages. Give these a separate restrained article-template treatment; do not replace the article engine in v1.

## Magazine / print-on-demand direction

The magazine model should eventually treat an **issue** as a defined collection of published stories, photography and cover metadata. The digital issue and physical issue should derive from that same manifest.

Future flow:

1. Editors assemble an issue from already-published Wix stories.
2. GatorBait Magazine renders the digital issue from the issue manifest.
3. A deterministic print-layout process generates a print-ready PDF from that same manifest.
4. A `Print this issue` action sends the approved print artifact to a print-on-demand fulfillment provider.
5. The provider prints and ships one copy only when ordered, avoiding inventory risk.

Do not integrate a paid fulfillment vendor until the digital issue model is stable and the owner explicitly approves cost and provider selection.

## GatorBait Weekly

Keep the newsletter. It is the email edition of the same newsroom, not a separate brand experiment.

The same approved story metadata should feed:
- website modules;
- GatorBait Magazine;
- GatorBait Weekly;
- GatorBait TV supporting links;
- later social/promotion workflows.

## Wix development rules

- Use Wix JavaScript SDK / Velo APIs for code that runs on a Wix site.
- Do not use REST calls from frontend page code for ordinary site extension work.
- Custom Elements exchange data through attributes/events; their internal code does not call Velo APIs.
- A Wix-hosted custom-element source belongs under `public/custom-elements/` in the actual Wix codebase.
- Page-element access goes through `$w`; do not manipulate Wix page DOM with `document.querySelector` from Velo page code.
- Keep frontend secrets at zero.
- Keep operations bounded; no permanent polling or observers.
- Live Wix mutations still follow the production runbook: inspect current revision, make the smallest responsible change, verify, preserve rollback.

## Rollout

1. Build and review this frontend on the isolated Git branch.
2. Create blank Wix test routes, not replacements over existing live architecture.
3. Add the Wix-hosted Custom Element and page adapter.
4. Feed live Wix Blog data into it.
5. Verify desktop and mobile.
6. Only after approval, switch navigation/home destinations to the new blank routes.
7. Retire old theme embeds after the new presentation is proven, not before.

## Cost rule

Repository code and deterministic tests come first. Use model/tool calls only when they change a decision, unblock implementation, or verify production. Do not spend tokens rediscovering information already recorded in this repository.
