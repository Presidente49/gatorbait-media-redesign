# Buddy and Eddie live copy-desk correction — Oct. 19, 2026

Brenden reported the articles were now published and requested the fixes. Fresh native reads identified the genuine existing posts: Buddy `014afbf4-0256-4eaf-9c1a-a35458754da5`, first published 21:25:03.752Z; Eddie `fdcc971a-8a40-4006-bed2-927aa7109a82`, first published 21:27:49.745Z. The former missing-source hold is resolved by the actual live manuscripts. Neither post was recreated.

## Changes

- Buddy: verified deficit 7–3 → 17-3 and six remaining regular-season games → five. Removed 53 empty paragraph nodes; preserved the writer's short-paragraph cadence. Added one already-owned native UAA/Hannah White locker-room photo with caption/alt.
- Eddie: Jaden → Jadan Baugh in two places; supplied the missing apostrophe in nation's. Split five very long body paragraphs into 12 without rewriting the text. Added one already-owned native UAA/Hannah White handoff photo with caption/alt.
- Both: retained the existing Texas cover, added descriptive native cover alt, visible linked UAA/Hannah White/galleries closing credit, their existing football and writer categories, concise accurate excerpts and SEO descriptions.

One quick primary ESPN box-score pass checked the final, scoring progression, attendance, passing, rushing and third/fourth downs. See `quick-facts.json`. Five games remain on the existing 12-game schedule after the 5-2 Texas result. Writer observations and opinions were retained; this was not a full re-reporting of either column.

A deterministic text comparison confirms every writer word is preserved except the precise corrections recorded in `receipt.json`; added photo captions/credits are separate. No headline, author, canonical URL, first-publication date, cover asset, pin/order, access or pricing change.

## Guarded production write

Immediately before each write, both native alert configurations matched the currently authorized primary ACTIVE revision19 and duplicate INACTIVE revision39. No automation or audience changes. Each complete current draft and published object exactly matched its reviewed preimage; then one UPDATE_PUBLISH PATCH per article saved only richContent, categoryIds, media, excerpt and seoData with explicit field-mask paths. Buddy correction 21:40:57.212Z; Eddie correction 21:40:58.795Z.

The same invocation independently fetched each published post: exact rich content, categories and excerpt passed, and canonical/author/first-date/original-cover identity were retained. Native cover alt and description matched their intended values. Raw JSON string comparisons for media/SEO differ because key ordering and provider-added default fields differ; this does not indicate a failed save. No retry was made.

## Public verification

The public RSS independently lists Eddie, Buddy, Franz and Chris in original first-publication order and retains the original dates (`public-rss.json`). Early public captures 16–24 seconds after the write still served the previous version. A bounded later fresh pass showed the corrected public body without another write; final screenshot/QC evidence is recorded in `qc/`.

## Rollback

`rollback/` holds only the formerly public affected fields, without private draft session identifiers. Before any restoration, fetch current draft/public versions and compare against this release; preserve any later worker edits. Restore formatting/media metadata only if needed, retaining verified 17-3/five/Jadan corrections, original first date/byline/URL and existing cover. Do not delete, unpublish, redraft, redate or resend. One controller owns any correction.

No subscriber email was separately sent, no social post was duplicated, no account reconnected and no Wix site publish. Actual email/social delivery remains separate evidence; Marlowe retains social ownership per Brenden's latest direction. Physical iPhone not tested.

**Final live results:** both stories passed at 390/430/1366/1920 px: corrected body, loaded and visible actual inline photo, all three photo-credit destination links, and no horizontal overflow. Root inspected phone and desktop screenshots. The existing empty/hidden native hero section is unchanged; cover metadata is not a claim that a top-of-article hero appeared. Keep-reading lazy thumbnails are excluded from the actual photo check. See `qc/summary.json`.

Muse independently checked actual photo screenshots at 21:43:14–16Z. Body CSS remains Barlow, 18px/28.8px on phone and 19px/30.4px on desktop. One pre-existing desktop wixTagManager error remains. See `qc/photo-signoff.json`.
