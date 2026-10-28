# Buddy article headline clearance

The first headline on the October 28 Buddy Martin Rays column runs behind the first-visit consent panel in production QC at 320×740 and 1365×900. Preserve the consent panel and the whole approved photograph; reduce only this article's owned fallback hero to a maximum 42vh, using contain, and reduce its phone header top padding from 22px to 14px.

The four exact route guards become inactive when native hydration replaces the owned fallback. This is a bounded correction for this observed article, not a universal headline reorder. The approved 1000×563 image is landscape; the prior portrait-image diagnosis was incorrect.

## Scope and provenance

- Native target `a5452619-cb57-4927-9771-3a63f7cb4212`, live revision 9. Baseline is byte-identical to `../blog-font-stability-20261019/candidate.html`, independently read October 28.
- Do not rebuild the older broad broadcast package or change photo formatter `14a887e3` revision 28.
- `candidate.html` is the exact baseline plus one named CSS style. All existing HTML, JavaScript, font faces, links, consent settings, source copy and approved image identities remain unchanged.
- Keep enabled true, loadOnce false, HEAD, ESSENTIAL, name and all other properties. Fresh-read revision and full before-body must match before the single native PATCH. Roll back with the saved original body at the then-current revision.

## Verification

`python3 deploy/article-consent-clearance-20261028/build.py --check`

Root's temporary CSS preview on the actual public route used real mobile user agents at 320×740, 390×844, 430×932 and desktop 1365×900. Computed phone header padding is 14px; desktop stays 28px. Headline bottoms are about 506, 565, 600 and 821px; the reported CI consent tops are 536, 689, 792 and 836px. The desktop image/section both shrink from 529 to 378px, with object-fit contain. Body text length stays 3955 and horizontal overflow is absent. The consent panel was not visible in root's existing session; these measurements establish geometry against the recorded bounds, not rendered first-visit consent proof. Ordinary post-deploy checks and a new production QC run are required before declaring both consent failures cleared.

Native source review and root go are required before applying. Do not weaken the QC harness or crop the photograph.
