# Sitewide design audit — 2026-09-23

User requested checking the rest of the site against the shared GatorBait design.

## Live changes
- Existing gap guard 15302fb2-44ef-4a93-a2a8-899731a6c197 revision8 →9. Only decorative pageBackground_rf27d and pageBackground_c7tja hidden while shared header exists. Contact and Pricing backgrounds had extended to1095px on a936px viewport regardless of content.
- Existing shared header/design 7fee4de6-1886-475e-a3f3-b9c68161c242 revision20 →23. Mouse-only hover underline; native membership pseudo-element blue shadows removed; gray/white inner card backgrounds normalized to publication cream; 24px card padding.
- Contact form retains original native form, fields, required email, validation and submission handler. Replaced legacy radial gradient with cream, restored readable labels/input fonts, reflowed fields to a column, separated Send message from textarea, normalized phone fields and removed specific empty Wix wedge (169px). Success message visibility remains owned by Wix.
- No new embed, script owner, service or dependency. No financial, email, advertising, privacy or access settings modified.

## Verified public routes
Fresh live desktop renders at1363px: homepage, Magazine, Latest/blog index, Buddy category archive, sample Eddie article, TV/Podcasts, Join, Contact, Policies and account login surface. External ItemOrder store renders current GATOR BAIT merchandise. All measured site routes had zero horizontal overflow. Shared inner-page header/footer and homepage publication header use matching logo/navigation/palette. Account shows native login dialog; no login or purchase performed.
Homepage, Magazine, blog/category, article, TV and Policies finish at footer. Join now has document height936px (viewport floor), footer739px, with no artificial scrolling. Final Contact document1079px, footer1078.89px, no overflow; empty spacer display:none, button below textarea. Screenshots reviewed for Contact, Join and Latest.
Article body computed17px/28.56px on desktop; three related article links and loaded images confirmed. Ad slot remains unfilled, not a design revenue fix.
Message Board navigation leads to /#community and accurately says not yet open. No forum functionality claimed. TV podcast anchor is present.

## Limits
No device-emulated mobile or physical-iPhone verification in this pass; responsive CSS reviewed, not certified. Browser has no viewport capability. No authenticated membership checkout, contact submission, full historical article crawl, payment or external store restyling. Wix Editor dashboard is signed out, so existing API-managed presentation owners were repaired.
Previous mobile tests are historical, not evidence for this revision.

## Rollback
Saved exact pre-change shared header rev20 and gap guard rev8 alongside current snapshots. Re-read live revision before restoring HTML. Do not enable duplicate owners or overwrite later unrelated fixes.
