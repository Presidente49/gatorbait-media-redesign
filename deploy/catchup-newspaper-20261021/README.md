# Oct. 21 catch-up newsletter

Brenden requested one email covering recent stories absent from prior email distributions, presented as a compact newspaper. The six-story edition leads with Franz's Oct. 21 quarterback column, then Buddy's Rays memories, Eddie from Austin, Franz's Baylor analysis, Tuesday's Thoughts of the Day and Buddy's fan thank-you. Repeated story dates are omitted; one edition date appears in the masthead. Barlow, official UF blue/orange, white space, two distinct credited photographs and short paired secondary columns provide the visual rhythm. Store, Subscribe, magazine and TV links remain clear.

Builder: `automation/newsletter/build-catchup-newspaper.cjs`. Run it with a private input JSON containing the six public story objects and the existing approved native mailing footer, then a private output directory. Match stories by stable post ID, never their array position. Its generated MJML, HTML and provider payload contain the private footer and must not be committed to this public repository.

Current successful provider draft: `b55c22a7-0903-4751-b3a9-ffd3e6eac37a`. It supersedes unsent `e5631354-bceb-40ff-94cf-c92fb617b0b5`; Wix rejected updating that draft with “cannot be edited on classic web editor” even though the campaign readback identified MJML. Do not send the superseded draft or the older unsent single-story Oct. 20 draft. Native preview and decoded tracking destinations are checked before release; the presence of six distinct URLs alone does not prove that each displayed headline points to its own article.

Visual QA caught an inherited photo-caption mismatch and two positional story-link mismatches before distribution. Final basketball image is Chris Spears's actual Florida-Baylor action photo `16b519_c07ff77e003342f78fb8b45ff9a084e5~mv2.jpg`, visually inspected with the photographer's signature intact. No identifying player claim is added. Lead photo is UAA/Hannah White with linked credits. White-on-blue footer links were changed to blue-on-light for native Wix rendering. Strict MJML, Stack photo/content and source/rendered UTM checks pass.

One existing small opted-in cohort plus confirmed new signups is used; current consent and deliverability are rechecked completely, without widening to the historical eligible pool. Native sender is verified and unchanged; the existing physical mailing address and native preferences footer are retained. Contact IDs, email addresses, address text and raw recipient receipts remain private.

The rolling weekly limit prevents immediate sending: eight earlier list campaigns remain within seven days at preparation time. At 19:29Z / 3:29 p.m. Eastern on Oct. 21, only six remain, allowing this one edition as the seventh. The 24-hour count is zero; fresh recent bounce and complaint rates remain within the existing policy. Scheduling is enabled on the current Wix plan. Scheduled is not delivered; report the provider state accurately.

Provider accepted the release at 12:17:29Z Oct. 21. Immediate native readback: `IN_DETECTION`, sending state `REVIEW`, `dateScheduled=2026-10-21T19:29:00Z`; 466 eligible contacts, three exclusions and 469 complete consent records. No delivery claim is made before the scheduled time. Last six campaigns that remain within the send-time weekly window have 4,805 delivered, 21 bounced and zero complaints.

No automation status changes, reactivation, test sends, list import, consent mutation, discount, payment setting or site publish belongs to this release. Automatic Story Alert delivery remains a separate existing incident pending its native Activity log; this authorized catch-up send does not prove that incident resolved.

Wix normalizes MJML during import, including converting self-closing tags and link entities. Guard the exact provider composer readback checked against its approved rendered preview, rather than comparing normalized markup byte-for-byte with the pre-import source. The initial source comparison failed safely before any publish; the final release used the unchanged provider-normalized composer.

## Buddy byline correction

Owner separately requested `Rays the Roof` post `e326bea3-69dc-4eb8-851c-cc91599ba11d` credit Buddy Martin. Fresh draft/published content matched with no unpublished changes. A guarded memberId-only UPDATE_PUBLISH changed the native author to Buddy's established member, preserving all text, title, canonical `/post/rays-the-roof` and first publication `2026-10-20T22:34:56Z`. Primary alert ACTIVE rev19 / duplicate INACTIVE rev39 remained unchanged. Exact pre-change content stays private; rollback is a guarded byline-only correction on the same post, never an automatic deletion or date change.

## Rollback

Before distribution, use the documented native pause/reschedule flow on this exact campaign if the owner changes the plan. Do not toggle either blog alert. After sending, a delivered email cannot be edited or recalled; repair landing destinations and correct any material error transparently without an automatic duplicate campaign. Local preparation artifacts can be reverted independently. Keep private before/after and independent QC receipts outside the public repo.
