# Publishing, site history and rollback

## What a publish does

- "Publishing a site makes any changes previously saved on the site available on the internet." `POST https://www.wixapis.com/site-publisher/v1/site/publish`, no body. The Editor's Publish button does the same. **No partial or per-page publish.**
- Saved-but-unpublished Editor changes wait in the Editor until someone publishes. Any collaborator's saves go live with yours. Collaborators can also save over each other (single-editor model).
Sources: https://dev.wix.com/docs/api-reference/account-level/sites/site-actions/publish-site , https://support.wix.com/en/article/accessing-your-editor , https://support.wix.com/en/article/wix-editor-differences-in-live-site-and-editor

GatorBait consequence: every "embed PATCH → API publish" in our loop also ships any pending Editor drafts, and re-renders API page SEO from the Editor copy (LESSONS #47).

## Live immediately vs needs publish

| Change | Live without publish? | Evidence |
|---|---|---|
| Redirects (API or Redirect Manager) | Yes, within minutes | site-ops. https://support.wix.com/en/article/setting-up-301-redirects |
| Blog post publish/update | Yes (the post's own publish) | Blog is dashboard/API content |
| Pricing plans, members, roles, badges | Yes | Dashboard/app data |
| Email campaigns, automations, push | Yes, and **outbound** | Dashboard/app actions |
| robots.txt | Yes | Dashboard tool |
| Item SEO tags via API | Yes, but reverted by the next site publish | LESSONS #47 |
| SEO Settings patterns (dashboard) | Dashboard flow ends in "Publish". Verify live | https://support.wix.com/en/article/customizing-your-seo-patterns |
| Custom embeds (API/dashboard) | Unconfirmed in Wix docs. Our practice publishes. Verify first | custom-code.md |
| Checkout design | Its own "Save & Publish" in Checkout Settings | https://support.wix.com/en/article/wix-stores-customizing-the-checkout-page |
| Theme fonts/colors, global.css, page layout, widget Design panels, page permissions, page SEO panel | **No, site publish required** | Editor changes |

## Site history and rollback

- Site History records every Editor save and publish with timestamp and collaborator email. You can filter by Saved/Published/Starred and rename/star a version.
- **Restore** reverts the Editor to that version and "erases any changes made after that specific version". You then publish to make it live.
- A restore does **not** revert: CMS collection content/schema (use CMS backups), Wix app content managed in the dashboard (blog posts, plans, portfolio), media/pro galleries, and several SEO settings. Page design/layout does revert.
Sources: https://support.wix.com/en/article/viewing-and-managing-your-site-history , https://support.wix.com/en/article/restoring-a-saved-version-of-your-site

## Safe publish procedure (GatorBait)

1. **Need check:** does this change need a publish (table above)? If not, don't publish.
2. **Draft check:** Site History → is there any *Saved* entry after the latest *Published*? If yes, identify whose it is and what it contains. Unknown → stop and ask the controller/Brenden.
3. **Snapshot:** star/rename the current published version ("pre-<task> YYYY-MM-DD") so rollback is one click.
4. **Publish once.** One writer.
5. **Re-apply** API page SEO if applicable. Re-verify live with cache-busters after a few minutes (the rollback lands page by page).
6. **Record** in issue #34: what was published, the draft-check result, the snapshot name, and verification.

## Rollback options

- Embed regression: PATCH the previous repo copy back (revision-checked). Faster and narrower than a site restore.
- Editor regression (theme, layout): Site History → restore the starred version → publish. Check the table above for what won't revert.
- Redirect mistake: delete the redirect. Retest with a fresh query string (301 cache).
- Never "roll back" by deleting old-named folders, sites or embeds. Some still hold live adapters (CLAUDE.md).
