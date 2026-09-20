# Studio Execution Status — 2026-09-20

## Controller directive

Finish the existing Wix Studio wireframe. Do not create a competing redesign. Do not ask the owner to re-decide architecture already settled.

## Source of truth

1. Existing Wix Studio wireframe/canvas
2. Live GatorBait Wix business/content data
3. Wix-generated element/CMS/media maps once Git Integration is exposed
4. This branch's Studio architecture/routing/migration docs
5. HTML prototype only as supporting reference

## Work consolidated

- Claude Studio redesign work has been fast-forwarded into `studio-product-system`.
- Repo-first Wix Studio toolchain is documented in `docs/WIX-STUDIO-TOOLCHAIN.md`.
- Current content routing, taxonomy audit, migration preservation, product architecture, wireframe brief, competitive audit and SEO/AI discovery standards are all on this branch.
- Existing `studio/` prototype includes Front Page and Article reference implementations plus page-family stubs.
- Old `studio-rebuild-2026` migration plan was reviewed for lessons; its strongest constraints are already represented in current migration-preservation rules.
- Ops Hub learning rules remain bounded and are not allowed to self-authorize production writes.

## Live Wix state verified

Production site:
- Site ID: 18fb3a4e-d7f6-414a-aeb9-3047db3ea115
- URL: https://www.gatorbaitmedia.com/
- Premium
- Classic Editor
- Velo enabled
- Wix Blog, Members Area, Pricing Plans, eCommerce and Stores are installed

Current account site inventory does not expose a separate Wix Studio site corresponding to the new wireframe.

Current Wix Branches API state previously showed no editable USER Studio branch. A generic Classic -> STUDIO_TWO branch-create attempt returned EDITOR_TYPE_VALIDATION and must not be blindly retried.

## Hard execution boundary

The Wix MCP available to the controller can manage business data/APIs but does not expose visual Wix Studio canvas editing.

The official Git Integration path becomes writable by Claude/Codex only after the actual Studio project exposes its Wix-generated Git repository/worktree (identified by `wix.config.json`).

No accessible Presidente49 repository currently contains `wix.config.json`.

Therefore:
- do not pretend repo HTML changes are Studio-canvas changes;
- do not create another production Wix site as a workaround;
- do not publish the HTML prototype over the member/business site;
- do not change DNS;
- do not migrate members to a duplicate.

## Ready-to-execute sequence when Studio Git repo appears

1. Identify repo containing `wix.config.json`.
2. Install official `wix/skills`.
3. Install pinned WiXAnything read-only mapping layer.
4. Generate element/type/layout/CMS/media maps.
5. Map existing Studio canvas against `STUDIO-MASTER-WIREFRAME-BRIEF.md`.
6. Preserve the existing wireframe; optimize rather than replace.
7. Build shared tokens/header/footer.
8. Wire Article + Front Page to existing Wix Blog.
9. Wire Recruiting, TV, Magazine, Search and community surfaces.
10. Connect Members/Pricing Plans/account surfaces without duplicating member data.
11. Use native Studio motion first; Wix Interact only for justified gaps.
12. QA 390, 430, tablet, desktop; accessibility/performance.
13. Route/SEO/member/payment/email migration rehearsal.
14. Generate preview.
15. Owner review.
16. Controlled cutover only after explicit approval.

## Design requirements

- modern, premium sports publication
- Florida orange/navy/white
- editorial photography first
- clean Athletic-like reading restraint
- useful 247/On3-style information density
- strong TV/multimedia presentation
- immersive Magazine treatment
- real community architecture, no fake activity
- no Sidelines or Rob Browne presentation
- no old Today’s Edition / Monday Chomp architecture
- no AI-slop cards
- no first-paint flashing
- no unnecessary framework

## Learning carried forward

- current wins over stale docs/screenshots
- verify externally before saying fixed
- one production writer
- deterministic checks before model reasoning
- native/reversible solution first
- mobile primary QA: 390 and 430
- no new dependency without a specific job
- no self-promotion of learning into production authority
