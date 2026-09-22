# GatorBait original Gazette rebuild

Owner authorization: September 22, 2026 — check other chats, avoid duplicating existing work, proceed with the rebuild. Continue issue #31; do not create another redesign issue.

## What already exists — preserve, do not recreate

- Lovable Gazette project `6b85e1c3-2b02-41c3-8818-29db0f9337f0`: published prototype. Inspected package.json at commit `6f89166e96c432b15275fe082c61296c5eb506a8`; it is TanStack/React, not an installation of the original Astro theme.
- Lovable News Wire `bb78af89-17a4-4893-b7ae-aab0254e7d04`: separate visual experiment, not the original Gazette source.
- `masthead-wix-refresh` at `6119414`: custom Wix homepage renderer and mobile CSS.
- `masthead-design-quality` at `6aab6ab`: four source corrections and reusable quality guidance. Those fixes remain intact; this build reuses their accuracy/no-empty-content/mobile principles, not their Wix-specific DOM renderer.
- Existing Wix production, current presentation, members, billing, email, consent, article URLs and Google configuration are not modified or rolled back by this build.

## Actual source

Original `ondelva/astro-theme-gazette`, release 1.1.4, pinned commit `cee215fd3ec0b78bba6f99d3a59a033b0a5f0b48`. MIT and third-party notices are retained. This is not another lookalike reconstruction.

The build checks out the upstream source, changes its supported config/theme files and a bounded masthead/navigation overlay, then compiles its real Astro cover, issue, contents, archive and article templates. Preserve the original layout and fonts; apply restrained GatorBait orange/blue, official logo, compact mobile navigation and accurate public excerpts. No new page builder, paid product or runtime framework is added to Wix.

## Data and preview boundary

`prepare.py` fetches a fresh public Wix RSS snapshot at build time. It stores only seven public titles/bylines/dates/excerpts and permitted article images. Excerpts link to canonical Wix articles; it never imports member-only bodies or constructs a fake login/checkout. Named writers are never inferred from another writer's article. Contents remain newest-first; a recent verified Buddy byline can lead the magazine cover separately.

All preview pages are noindex and visibly labelled. Snapshot freshness is explicit in `build-manifest.json`. This is not yet a scheduled publishing sync. No runtime RSS fetch, Google loader, consent change, analytics, or email operation is added.

## Build and evidence

Workflow: `.github/workflows/gazette-preview-build.yml`, triggered only by changes on `gazette-rebuild` or manual invocation. Standard public-repository Ubuntu runner; no larger runner, paid provider, or paid AI call. Node 22.16, pinned pnpm 10.34.5, upstream frozen lockfile. The original source commit and license are checked before applying patches; drift fails closed.

The workflow installs and saves the real customized source under `gazette-rebuild/site/`, compiled output under `flagship/gazette-preview/`, and actual Chromium/WebKit localhost test results/screenshots under `gazette-rebuild/qa/`. These folders exist only AFTER a successful build and QA. Merely committing this workflow is not installation or verification.

Only this isolated branch is written automatically. No main branch, Wix embed or Pages deployment is changed by the build. A subsequent controlled preview publication can add only `flagship/gazette-preview/` to main, allowing the existing Pages workflow to preserve the rest of the flagship site. Never deploy the Gazette output over the entire Pages root.

## Run locally

Use a fresh checkout of the pinned upstream in `.work/gazette`, then:

```sh
python3 gazette-rebuild/prepare.py .work/gazette
pnpm --dir .work/gazette install --frozen-lockfile
pnpm --dir .work/gazette check
pnpm --dir .work/gazette build
python3 gazette-rebuild/finalize.py .work/gazette/dist
```

Do not run `prepare.py` against a dirty or different upstream checkout. It deliberately asserts patch targets. Local setup and an iPhone-control app are not required to view a published preview.
