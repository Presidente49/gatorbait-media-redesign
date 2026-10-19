# Blog author first-paint stability, Oct.19

Owner reported Chris Spears's profile portrait briefly appearing then disappearing on article load, plus blue headers. This was reproduced at390/1366: native32px writer avatar becomes visible, then collapses roughly5.7–7.1seconds after navigation. Native image load and an existing late author-simplification rule compete; no intentional portrait animation was found.

## Shipped

Existing News SEO/author embed4d3ab24a-dfc1-4ba7-9458-d1bf54ac2135 moved BODY_END→HEAD, revision6→7. Added only the post-header .fluid-avatar-image display:none rule so the already-suppressed decorative portrait is hidden from first paint rather than waiting for .gbm-author-links. Existing author name/link, website, metadata routine, category ESSENTIAL and enabled state preserved.3436characters, below15000cap. Source verified exactly against pre-read revision6; post-write provider readback verified revision7/HEAD/exact source. No site publish.

## Verification

Bounded browser samples across fresh cache-busted live loads at390/430/1366/1920: zero visible avatar samples (291/300/282/294 samples respectively), correct Chris byline, early rule present in document.head, zero horizontal overflow,4inline photos and16native gallery images. Headline remains white Barlow Condensed on the existing blue gradient; section headings remain navy. This patch is not a header redesign and does not add a hero photo. Real iPhone/Safari not tested. See baseline.json, candidate-qc.json and live-qc.json.

## Rollback

Fresh GET existing embed4d3ab24a, then PATCH with current revision, position BODY_END, embedData.html from rollback/author-r6.html and category ESSENTIAL. Preserve enabled and other fields. Do not roll back unrelated earlier typography fixes or publish saved Editor drafts.

## Learned

ListCustomEmbeds defaults to50 records on this site; current inventory has74. Inspect pagingMetadata.hasNext or request up to100 before concluding no late author-rule owner exists.
