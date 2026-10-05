# Portrait cover opening — deployed

Owner approved implementation directly on October 4, 2026 (America/New_York): “OK, implement us into our design. I like what you did with this magazine.” Sole production writer: Codex / Master Control.

## Release

- Magazine URL: https://www.gatorbaitmedia.com/magazine
- Fresh-request viewing URL: https://www.gatorbaitmedia.com/magazine?gbm_mag=cover-c838f940
- Source commit: fa6930fef1209429c50333266a8e7d36773cb677 on codex/magazine-cover-open.
- Runtime build: c838f940, 182803 bytes, below the existing 180 KiB gate.
- Magazine custom embed: 1dd74333-ee02-40da-9c93-cf8fd787c129, revision 75 → 76. Updated only the immutable bundle SHA. Enabled state, category, placement and all other embeds preserved.
- Previous bundle: 6d803965e330feb8aad0484f1899e3f6c4dd4a54.

## Behavior

Responsive 9:16 cover using the current issue's photograph, Buddy Martin title, date and original UAA credit. User-triggered 480 ms opening to contents. Reduced motion is immediate; Enter/Space opens; Contents/Escape and Cover controls work. Minimum 12 px cover date, credit, edition, writer and week labels. Existing seven-story package, canonical URLs, bylines, stats, signup and homepage are unchanged. No new photo was licensed or substituted.

The issue remains scrollable without opening the cover. Footer Print / save as PDF invokes browser printing; print CSS hides entrance and controls. This is not a claim of complete PDF pagination or seven full article bodies in this issue: the existing package links to the canonical stories.

## Verification

- Build --check, JS syntax, magazine contracts and git diff --check passed.
- jsDelivr exact release bytes equal the local build. SHA-256: 1d707ee97191c46e478de53f6e2579fafc813a602577e50c3e345590138e347a.
- Candidate in the actual Wix shell: run 37261222563, evidence 4019fa15d63bacec4c1938191c99ea5bcb26c58d. 320/390/430/1366 plus reduced motion at 390 all pass. All see c838f940, zero horizontal overflow, loaded photo, correct ratio, seven stories, keyboard/focus/menu/print checks.
- Initial candidate run exposed a test synchronization problem after cookie dismissal. The test now waits for dismissal and bounded focus settlement; production runtime was not patched for it. The repeat passed every case.
- Production canonical URL: run 37261322413, evidence 948866b03e1a4194eae776851d99771f63a02efb. 390/430/1366 and reduced-motion 390 passed on c838f940. The 320 request still received the old cached page (no cover button), not a valid new-build check.
- CUA live fresh URL: c838f940, opens and focuses pm-contents, returns to cover, zero overflow. Visual cover reviewed.
- 320 fresh-request production check passed on c838f940: run 37261447638, evidence 5fa87a3e1217e13de0dfa0204dd466ae9b420767. No page errors or overflow; metadata 12px and all interaction/print checks pass.

Screenshots and metrics: https://github.com/Presidente49/gatorbait-media-redesign/tree/948866b03e1a4194eae776851d99771f63a02efb
These are actual browser viewport checks, not physical iPhone testing. Canonical Wix edge caches may continue serving the previous build temporarily. No full site publish was used to flush caches or risk publishing editor drafts.

## Rollback

Read the current embed and revision, then replace only embedData.html with rollback-loader.html after confirming the live pin is still fa6930fe. Preserve all remaining fields and pass the current revision. This restores the exact revision-75 loader. Do not overwrite a later unrelated release.

## Scope and measurement

No homepage, article, category, email, schema, indexing or analytics changes. No engagement lift is claimed. Prior Design Lab report is historical pre-deployment research; this record supersedes its deployment hold following the owner's direct implementation approval.

## Masthead correction — October 5, 2026

Owner clarified the defect was the word MAGAZINE on the masthead, then requested Gator green around those letters. Centered the GATORBAIT/MAGAZINE lockup, balanced subtitle tracking, and used pale green letter faces (#d4f9de) with green outlines (#248648). MAGAZINE remains at least 13 px.

- Release: e0bf32359c7d560239d15e7baf8a0e64da2a1952; build 9fbb5513; 183008 bytes.
- Embed revision 76 → 77, with exact baseline guard. Only the immutable bundle pin changed.
- Discarded unpromoted photo-crop candidate 0d8a507 after the owner clarified the target; photo remains at the live 48% 38% baseline with original responsive image sizes.
- Build/check, JS syntax and diff checks pass; CDN bytes match SHA-256 fb2add60afcd60b706c595367ea8fe43d3d7ef9269b6f4be30703a26aaaedbb1.
- Same-build candidate in production shell: run 37262674675; evidence d11859e6057017d3e01087b438acb454afccfd01. All 320/390/430/1366 and reduced-motion 390 cases pass with zero overflow; live font-loaded screenshots visually reviewed.
- CUA verified the published 9fbb5513 build, centered green text and zero overflow at https://www.gatorbaitmedia.com/magazine?gbm_mag=masthead-9fbb5513.
- Rollback for this follow-up: rollback-rev76-loader.html. Read current revision, confirm pin e0bf3235, restore only embedData.html and retain category ESSENTIAL. Do not overwrite a later release.
- No article content, photo source, byline, homepage or other embed changes.

- Independent post-deployment browser run 37262838685 passed at 390 and 1366 px with published build 9fbb5513, zero overflow and all cover/contents/keyboard/print checks. Immutable evidence: https://github.com/Presidente49/gatorbait-media-redesign/tree/39b0b2d4028173a3322eeccb60af28687971948c. Phone screenshot: cover-390.jpg. These are actual Chromium viewport checks, not a physical-device claim.
