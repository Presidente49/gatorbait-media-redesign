# GatorBait Writers Desk

Owner request, October 3, 2026: keep the writer portal with the existing GitHub projects, use Wix for ordinary web access, and remove ChatGPT account requirements from the writer flow.

## Current state

- `prototype/` preserves the working simplified React portal source from Sites commit `3d00154430f9e3ce9a32f008b04d52c30373408d`. It still uses Sites authentication, D1 and R2. It is a reference implementation, **not a GitHub Pages application**. No credentials, uploaded stories, staff list or database contents are included.
- Wix form `0ab5d3a7-86ad-4484-9db9-8d05f258fab2`, named **GatorBait Writers Desk**, was created on the existing GatorBait site. It has name, email, headline, pasted story, optional document and optional picture. Upload buttons say **Upload here**; Submit is last. Submissions are restricted to owner and collaborators, and advanced spam protection is enabled. No contact mapping, newsletter opt-in or outbound email automation was added.
- The schema exists and is enabled. **The writer-facing page/share URL is not published or verified yet.** Creating a form schema is not publishing a standalone form.
- Native Wix intake does not yet reproduce the prototype’s draft saving, profile, editor queue or help guide. Do not claim those features migrated.

## Finish in Wix

Open the existing form in the connected GatorBait dashboard and place it on a dedicated writer page, or create its standalone presentation through the Wix form builder. Keep the story upload and optional picture at the bottom before Submit. Publish only the intended writer surface; do not publish unrelated editor drafts. Confirm phone layout and test a paste-only submission plus a document/photo submission, checking actual private dashboard receipt. Do not send staff invitations or notifications as part of testing.

Preserve the existing Wix homepage, Magazine, membership, checkout, email workflows and GitHub Pages publisher. Do not put private submissions into this public repository or Pages.

## Source checks

The preserved prototype passed TypeScript, five domain tests, SQLite storage checks and a production build before this export. The new native Wix form has not had a browser submission test. The old Sites project ID was deliberately removed from the exported config to prevent accidental deployment against it.

## References

- https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/about-form-fields
- https://support.wix.com/en/article/wix-forms-adding-and-setting-up-a-standalone-form

Rollback: revert this new folder only. The form may be disabled independently in Wix; no existing site objects were edited.
