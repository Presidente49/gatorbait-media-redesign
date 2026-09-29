# Writer attribution repair — 2026-09-29

Read-only audit covered all 4,574 published posts in 46 cursor pages. Twenty author identities were present; no published post had an empty memberId. Generic identities accounted for 58 posts (51 GatorBait Staff and 7 GatorBaitMagazineStaff). The 30 most recent generic posts were examined for explicit Ricos text bylines. Chris Spears' explicit column byline overrides generic account ownership. Photographer credit remains separate from writer credit.

## Staged execution

`native-plan.json` lists all 30 recent generic posts and decisions. `execute-native.js` is the root-only Wix ExecuteWixAPI code, with APPLY=false by default. Dry run succeeded on 2026-09-29 for all 29 prepared changes: 26 Brenden author corrections, one Chris author correction, plus two named-author factual corrections. Honor Roll's two factual body corrections and matching excerpt correction are included in its author update. Six existing generic body bylines become By Brenden Martin. Photo captions and genuine named bylines remain intact.

Root can set APPLY=true in the submitted code string after reviewing the dry run. Site ID: 18fb3a4e-d7f6-414a-aeb9-3047db3ea115. No tokens are stored. The script preflights every record, rejects nonpublished posts, existing unpublished edits or wrong source author, and rechecks editedDate before the bulk writes. It sends only memberId and/or changed richContent/excerpt. It does not send firstPublishedDate, slug, title, media or other editorial fields. Afterward it verifies original date and slug, target author and no remaining unpublished changes. There is no API revision precondition; the final read guard reduces but cannot atomically eliminate concurrent edits. Root remains sole writer.

## Exclusions

- aeb4f5a5-3910-4b11-9a63-b05bac96e623: deferred to roster/schedule resource update, which will include Brenden attribution.
- ff634071-5ee7-4c9f-985a-ba197369733f and 10a6bddb-ce48-428f-81a0-cd2c22e6a190: existing unpublished edits; preserve until compared and merged.
- 28 older generic posts: preserve pending evidence. Some contain explicit Phil Huber or guest bylines or name Buddy in the title.

## API evidence and notifications

GET https://www.wixapis.com/blog/v3/draft-posts/{id}?fieldsets=RICH_CONTENT
PATCH https://www.wixapis.com/blog/v3/draft-posts/update, body {draftPosts:[{draftPost:{id,...changedFields}}],action:"UPDATE_PUBLISH"}; maximum20items perrequest. Script uses two bounded batches and records independent per-item failures without discarding prior successes.

Contracts: https://dev.wix.com/docs/api-reference/business-solutions/blog/draft-posts/get-draft-post and https://dev.wix.com/docs/api-reference/business-solutions/blog/draft-posts/update-draft-post . Publish contract explains already published records are updated, not recreated: https://dev.wix.com/docs/api-reference/business-solutions/blog/draft-posts/publish-draft-post . This is not a whole-site publish. API provides no notification-suppression option. Wix official help describes default notifications for new posts; custom update automations have not been audited, so a no-email guarantee is not claimed.

## Rollback

For each successfully applied author patch, native-plan.json records original memberId. Restore it only after a fresh no-unpublished-edits guard. For changed generic body bylines, all-generic-candidates.json records exact original byline text; replace the exact By Brenden Martin paragraph back only on the affected record. Editorial corrections can be inverted using ../editorial-factcheck/corrections.json; Honor Roll original excerpt was: Jadan Baugh, London Montgomery and Bryce Lovett each won their first SEC weekly honor after Florida's 52-28 win over No. 4 Ole Miss. Never rollback an entire stale post object or publish unrelated draft edits.

Homepage already renders RSS author credits; Latest already renders native author fields. Correcting source identities propagates to these surfaces without a competing UI override. Root separately corrected new Magazine bylines and photo credits.

## Bulk and snapshot safeguards

Bulk contract: https://dev.wix.com/docs/api-reference/business-solutions/blog/draft-posts/bulk-update-draft-posts . Complete original draft snapshots including Ricos are saved in before/{postId}.json for all eight modified-body records. Native-plan.json retains original owners for author-only changes. dry-run.json records29ready/3held withzero preflight failures after bulk conversion. The script compares complete Ricos node content and excerpt after mutation in addition to owner/date/slug. It returns each failure independently; inspect outcomes before retries.
