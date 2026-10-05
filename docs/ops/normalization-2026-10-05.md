# Production normalization — October 5, 2026

## Authority
Owner direction: reconcile Codex, Jarvis and Claude Code work before production changes; preserve newer compatible work and do not merge superseded editorial decisions.

## Normalized
- Merged PR #129 (Jarvis house voice + rich-formatting checker): 18319078ec666494883057f6fe17114eebb6969b.
- Merged PR #130 (Jarvis magazine-style story template): 34a224666acbdc2e822696dd8744baea09db27d9.
- Did not merge PR #142: its forced Buddy homepage lead conflicts with the newer owner rule that ordinary homepage stories are chronological.
- Wix Blog BLOG_POST SEO pattern preserves existing tags and explicitly uses {{blog-post.cover.image}} for og:image and twitter:image, summary_large_image, and Florida Gators/GatorBait title context.
- Homepage Magazine release remains ee3c66595677c718598d869e10e29ea72828b54c: exact FIRST LOSS cover plus inline opening reader.
- Wix HOME_CODE loader revision 45 reads sports-live/current.json directly from raw main instead of the stale GitHub Pages pointer.
- Wix post-template embed 14a887e3-38ea-4258-ae0b-7d19cf9feead revision 15 contains the reviewed PR #130 template inline.

## Guardrails
- Do not merge agent branches merely because they are newer.
- Owner direction and current production behavior win over superseded branch intent.
- Read Wix state before full-replace SEO or embed writes.
- A blog post without a real cover asset must not receive an invented or unrelated social image.
- Story ordering is newest-first unless the owner explicitly marks a breaking-news pin.

## Live QA
The first live browser run found the stale public GitHub Pages release pointer and therefore the old magazine card. That release-path defect was corrected before final QA.
