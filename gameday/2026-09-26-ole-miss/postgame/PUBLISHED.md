# Postgame story: published Sept. 26, 23:46:39Z (Stack run, Brenden's standing delegation)

- Post 94127b93-7c14-42f3-896b-9b99d6d9bc09
- https://www.gatorbaitmedia.com/post/florida-ole-miss-final-baugh-gators-run-over-rebels
- Cover: d3cfa5_c902c8a849464c49a64841fcef37ed35~mv2.png (FINAL 52-28 graphic)
- Public check 23:50Z: title, body text, canonical, and og:image/twitter image are the FINAL cover. Byline: GatorBait Staff.
- Halftime story bb2287f1 now opens with "FINAL: Florida 52, Ole Miss 28. Read the full postgame story." (link).
- **No email sent.** Story-alert automation 824714d4 was INACTIVE (rev39, switched off 23:07Z from the owner account) before and after publishing; this run did not touch it. Duplicate-send gate: no campaign queued or sending (latest send 3cc1f9f4 at 18:48Z).
- Held: two photos Brenden sent (Baugh TD dive, Gators take the field) are in Wix Media but not in the post until the photo credit is confirmed.
  - d3cfa5_026d2a4d2be04a91b8c32317fed5f623~mv2.jpg
  - d3cfa5_2ea58f38e2da4c988ab73065cfe63130~mv2.jpg
- Magazine postgame cover: d3cfa5_fda8a01da9e94532846c680eb96e6015~mv2.jpg (in Media; not placed).

## Update 23:58Z
Brenden confirmed Chris Spears shot all of today's photos. Both photos were added to the live post in place (UPDATE_PUBLISH), with caption credit "Photo by Chris Spears/GatorBait Media": the Baugh TD dive leads, and the take-the-field shot runs before "The tone was set early." The alert automation stayed INACTIVE; no email.

## Update 00:00Z: By the Numbers and celebration sections
Added in place before the closer: "By the numbers" (nine ESPN-verified stats; the top-five-win line is attributed to WRUF) and "The celebration" write-up. Public check at 00:03Z shows every section plus both Chris Spears photos. The celebration video (8 s, 720x1280 MP4, prepared in the scratchpad) is not placed yet: the Ricos VIDEO node shape isn't documented or present in any recent post, and it won't be guessed on a live story.

## Postgame email: SENT (Brenden: "run the stack ... get the email out")
- Campaign f8ee1c12-b15e-4684-9ca9-c8d72ebd04fa, "FINAL: Gators run over No. 4 Ole Miss, 52-28"
- Source: newsletter/2026-09-26-postgame-ole-miss.mjml (commit 2e65a25), the branded MJML used for Franz and Lacy
- Gates:
  - Strict MJML compile, 0 errors.
  - check-links source and rendered OK (6 tracked links, clean UTMs).
  - No overflow at 390/1000.
  - Wix preview: headline, both photos, 2 Chris Spears credits, numbers, CTA and Buddy text present; 0 placeholders; 0 amp;utm.
  - Tracked-link destinations decoded and verified.
  - Unsubscribe present.
  - Dedupe clear.
- Audience: label e345fa8e (the established opted-in label), same send path as Franz 3cc1f9f4.
- Provider at 00:06Z: PUBLISHED / DISTRIBUTED / SENT. Stats on first read: delivered 1,695; opened 14; clicked 2; bounced 17; complained 0; notSent 0.
- The story-alert automation 824714d4 stays INACTIVE, so this is the game's one email.

## Update 00:15Z
A frame grab from the Chris Spears celebration clip (final scoreboard 52-28, 0:00 Q4) was imported as d3cfa5_cf3c6da48f1a41e48eea9484d677f784~mv2.jpg and added under "The celebration" in place. The post now has 3 photos. No email.

## Update 00:20Z
Cover changed to the thumbnail "Swamp Party" FINAL 52-28 (d3cfa5_a1b1d9987b2a431795a6f88a4bfef3d8~mv2.jpg), built from the Chris Spears celebration frame. Body intact (31 nodes, 3 photos). No email.

## Update 00:45Z
- Homepage dedupe live: Home Code 622d8ece rev2 -> rev3, fp 2679990181. An independent live browser pass shows no headline twice and the "Up next: Florida at Missouri" box.
- Cover changed to the layered master v02 (d3cfa5_74c0faaa50574ad0b505ac84433f71c2~mv2.jpg). Magazine cover v02 is in Media: d3cfa5_edc269515b4043e99026e4c4db8b99d1~mv2.jpg. No email.
