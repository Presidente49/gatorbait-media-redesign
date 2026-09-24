---
name: gatorbait-wix-studio-branch
description: Use when redesigning gatorbaitmedia.com in Wix Studio, or when any work proposes building, previewing, migrating or cutting over a new GatorBait site design. Covers the branch-versus-separate-site distinction, how to verify which one you are actually working in, and the cutover procedure. Load before creating any Wix site or branch for GatorBait.
---

# GatorBait — Wix Studio branch and cutover

## The mistake this skill exists to prevent

**A new Wix Studio site is not a redesign of gatorbaitmedia.com. A Studio
branch of the existing site is.**

They look identical in the Wix dashboard. They are not remotely the same
thing. On 2026-09-20 two Studio sites were created for GatorBait, and on
2026-09-21 both still held **0 blog posts** against production's **4,531**.
Work done there cannot become the live site.

| | Studio **branch** of the live site | **New** Studio site |
|---|---|---|
| Blog posts | shares the live site's | none — starts empty |
| Members, pricing plans | shared | none |
| Custom domain | shared | `wixsite.com` subdomain |
| Premium plan | shared | free |
| SEO history, `/post/<slug>` URLs | preserved | lost |
| Becomes the live site | yes, by publishing the branch | only by migrating everything |

The GatorBait handoff forbids the migration path outright: *"DO NOT COPY THESE
ARTICLES INTO A NEW CMS."* So a new Studio site is not a slower route to the
same place. It is a dead end.

## Verify which one you are in — always, before building

Never trust the name. Two checks, both read-only.

**1. Does the site have a Studio branch?**

```
POST https://www.wixapis.com/branches/v1/branches/query
body: {"query":{"sort":[{"fieldName":"createdDate","order":"DESC"}],
                "cursorPaging":{"limit":50}}}
site: 18fb3a4e-d7f6-414a-aeb9-3047db3ea115
```

Read `editorType.editorTypeOptions` on each branch. `CLASSIC` is the existing
Editor site. A Studio redesign must appear as a branch with `STUDIO`.

`ORIGINAL_BRANCH` is the live site. `TECHNICAL` branches are created by Wix
itself and are not yours to build in or publish.

**2. Does the thing you are building in actually have the content?**

```
POST https://www.wixapis.com/blog/v3/posts/query
body: {"query":{"cursorPaging":{"limit":1}}}
```

Production returns 4,500+. **If it returns 0, you are in a blank site, not a
branch. Stop and say so before building anything.**

## State verified 2026-09-21

- Production: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`, Classic Editor, Premium,
  custom domain, Velo enabled, 4,531 published posts, 28 categories.
- Branches: `Original-Branch` (CLASSIC, default) plus three `TECHNICAL`
  branches dated Aug 28, Sep 7, Sep 15. **No Studio branch exists.**
- `Gatorbait Media` (`b4032e65…`) and `Gatorbait Media 1` (`4d9e149d…`):
  standalone Studio sites, 0 posts each, free plan. Not branches.
- No Wix Studio Git Integration repository exists on the GitHub account, so
  the Studio workflow in `docs/WIX-STUDIO-TOOLCHAIN.md` is not yet available.

Re-verify rather than trusting this block — it is a snapshot, not a fact
about today.

## Creating the branch

Branch creation is an API call; **the design work itself is editor-only.**
The Branches API states plainly: *"This API allows you to manage branch
metadata only. Editing the branch content itself is only possible in the
editor."*

```
POST https://www.wixapis.com/branches/v1/branches
body: {"branch":{"type":"USER","sourceType":"SOURCE_BRANCH",
                 "sourceBranchProperties":
                   {"branchId":"00000000-0000-0000-0000-000000000000"}}}
```

Then open it in the editor by appending `&branchId=<id>` to the site's editor
URL from `Get Editor URLs`.

Creating a branch is additive and does not touch the live site. Creating one
is safe; **publishing one is not.**

## Cutover

Publishing a branch replaces what visitors see. Before that happens:

1. The branch renders the real blog content, not placeholders.
2. Every existing `/post/<slug>` still resolves. This is non-negotiable — the
   archive is the largest single source of search demand on the site.
3. Header, footer and navigation carry no retired branding: no Monday Chomp,
   no Quick Chomps, no Sidelines, no Rob Browne. Current newsletter is
   **GatorBait Weekly**.
4. Mobile checked at 400px on a real device, not only in the editor.
5. Core Web Vitals measured against the budget in
   `docs/STUDIO-SEO-AI-DISCOVERY-STANDARDS.md` — LCP < 2.5s, CLS < 0.1.
6. Brenden has seen the finished preview and said go. The handoff rule stands:
   *"Do not publish the new design without Brenden explicitly approving the
   completed preview."*

`Set Default Branch` changes which branch API calls target when none is
specified. It is not a publish, and it is not a cutover. Do not reach for it
expecting either.

## Hard rules

- **Never migrate the blog.** 4,531 posts stay where they are. A design that
  requires copying them is the wrong design.
- **Never hide the native site before the replacement is confirmed mounted
  with real content.** See `docs/INCIDENT-2026-09-15-HOMEPAGE-BLANK.md`. The
  current renderer gets this right: it sets `root.innerHTML` first and only
  then adds `gbm-standalone-live`.
- **One production writer.** The custom-embed layer and a Studio branch must
  never both be reshaping the homepage.
- **Do not self-certify.** A cutover is verified by Brenden in a browser, not
  by an API read-back.
- **Check issue #3** before touching live newsroom files. It is the owner's
  coordination thread and asks for a check-in naming branch and files.

## Related

- `docs/WIX-STUDIO-TOOLCHAIN.md` — approved tooling and source-of-truth order
- `docs/STUDIO-MIGRATION-PRESERVATION.md` — what must survive a cutover
- `docs/INCIDENT-2026-09-15-HOMEPAGE-BLANK.md` — the fail-open rule
- `docs/inventory/2026-09-21/README.md` — live embed and branch state
