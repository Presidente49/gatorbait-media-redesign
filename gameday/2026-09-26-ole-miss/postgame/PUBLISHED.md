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

## Update 00:40-00:50Z: Carlton Reese column, presser story, game-story links (no email)
- **Carlton Reese column:** published 00:40:27Z as post 03c7b5fe-b688-4a78-ad2f-911018304957, "Contenders, Not Hopefuls: Florida's Rout of No. 4 Ole Miss Puts the SEC on Notice." URL: /post/carlton-reese-florida-contenders-not-hopefuls-ole-miss.
  - Byline: Carlton Reese (cd142328). Categories: Gator Football and Carlton Reese.
  - Cover: layered v01, d3cfa5_043359d3e2df42e9b904bb3bfd521384~mv2.jpg. Brenden had no graphic from Carlton and said to use our art.
  - Edits to Carlton's copy: Baugh's yards changed from 144 to 142 (ESPN box: 29 carries, 142 yards, 3 TDs), plus apostrophe and typo fixes. The Muschamp/Texas and betting-line sentences run as Carlton wrote them; Brenden declined a separate check.
- **Presser story:** published 00:44:28Z as post 2bb6c273-e733-4af6-bcf7-5b814f768967, "'It Ain't Fully Awake Yet': Sumrall Says Gators Haven't Arrived After Routing No. 4 Ole Miss." URL: /post/sumrall-postgame-press-conference-ole-miss-not-fully-awake.
  - Byline: GatorBait Staff. Categories: Gator Football and Jon Sumrall.
  - UF's video Abu9k2osBUQ is embedded; the video was not downloaded.
  - Quotes come from the vidIQ transcript (presser/presser-transcript-vidiq.md). Carlton's independent Baugh and Sumrall quotes match it.
  - Speaker names were set from context plus ESPN: Woods made the strip-sack (#0 J.Woods per ESPN); Philo was the QB. A second vidIQ pass hallucinated "Graham Mertz," who is not on the roster.
  - Routine trig_01KhBRuaTr8ixhnsdqN7ERqH checks for the official UF transcript each hour and fixes wording in place.
- **Game story 94127b93:** the "reaction is coming" note now links to the presser story and Carlton's column (UPDATE_PUBLISH).
- **Public check 00:47Z:** all three pages show the correct titles, bylines, og:image covers and links.
- **No email** for any of these. The game's one email is f8ee1c12: delivered 1,804, opened 284, clicked 36, bounced 24 at 00:45Z.

## Update 00:55-01:15Z: official transcript fixes, reaction email SENT, accuracy fixes
- **UF official ASAP transcripts:** 171203 (Sumrall) arrived via Matthew H. at 00:36Z. 171204 is labeled "Jaden Edgecombe", but Edgecombe is a 5'8" WR.
  - That 171204 speaker is **Jayden Woods** (#0 JACK). Evidence: ESPN play-by-play credits "#0 J.Woods" with the strip-sack, and The Alligator quotes the same presser answer as Woods.
  - Baugh and Philo transcripts have not been posted yet (171205-171212 are empty).
- **Presser story 2bb6c273, fixed in place:**
  - Sumrall quotes now match ASAP word for word: "We just played better today", "with outcomes", "worth losing a headset over", "nothing's torn", "to be honest with you".
  - The "least comfortable" quote is now paraphrased, because ASAP has "least uncomfortable".
  - The Woods quote now reads "and first instinct".
  - The embed caption now credits Florida Gators Football on YouTube.
- **YouTube channel:** UF football is **Florida Gators Football, UCGy38_kQ5tV_e87Uhs3VCRQ**. The old "Florida Gators" channel, UC97Ila…, stopped posting in 2022. A separate Sumrall-only cut is VVguTPt-Te8.
- **Game story 94127b93, fixed in place:** By the Numbers said "2018" for the last top-five win, citing WRUF. It now says "2020", attributed to The Alligator and CBS Sports.
- **Reaction email SENT:** campaign 6b056c3f-1ca1-4729-8497-a59942411230, "Sumrall: 'It ain't fully awake yet' and Carlton Reese on the Gators."
  - Brenden said to "make sure that automation email goes." Enabling alert automation 824714d4 would not send for posts already published, so it stays INACTIVE. This campaign is the send.
  - Gates:
    - Strict MJML compile, 0 errors.
    - check-links OK (6 links).
    - No overflow at 390/1000.
    - Preview had the headline, both covers, both CTAs and the Chris Spears credit.
    - The Wix footer matches the sent f8ee1c12.
    - Dedupe clear.
  - Label e345fa8e. Status at 01:12Z: PUBLISHED / SENDING.
  - **Bug found and fixed:** straight double quotes in `<mj-title>` and the subject caused a 500 "http2 exception" from Wix's GenerateHtml on preview. Draft baeebc32 had them; it was deleted unsent.

## Update 01:48Z: presser quotes fully verified
- UF's ASAP transcripts are now up: 171205 is Baugh and 171206 is Philo.
- Presser story 2bb6c273 was fixed in place (no email) to match them:
  - Baugh "We feel we left points on the board"
  - Baugh "I tell the guys, I'm trying to put up 70, trying to put up 60."
- These quotes already matched word for word: Baugh "I feel that no defense in the country could stop us from putting up points", Baugh "I was just so proud of him", and Philo "Makes my job pretty easy. I didn't have to do a whole lot tonight, to be honest."
- Every quote in the story is now checked against the official transcripts. Routine trig_01KhBRuaTr8ixhnsdqN7ERqH was deleted.

## Update 01:55-02:02Z: covers v02, band rev36, Woods Chipper live, scheduled work
- **Cover audit:** four covers shared the diagonal template, and the Baugh inset appeared 3 times.
  - Carlton column: new cover v02 d3cfa5_a0dd1ffb…, duotone editorial style using the frame at 0:00.
  - Presser: new cover v02 d3cfa5_eee33706…, orange quote card with a strip of three frames.
  - Both swapped in place (UPDATE_PUBLISH) and confirmed live via og:image. LESSONS #40 added.
- **Homepage band 96ef5a04 rev35→36** (fp 207140764→3338074962, 14,989 chars, ESSENTIAL):
  - headline "FINAL: Florida 52, No. 4 Ole Miss 28"
  - note: first top-five win since 2020; next at Missouri
  - 2 update lines
  - 3 story links: game story, presser, Carlton
  - 5-row stat tracker and 4 leaders
  - the pregame roster PDF button removed
  - expiry extended to 2026-09-28T04:00Z
  - A live browser pass (TinyFish automation) shows every element.
- **Woods Chipper:** published 01:58Z, post 8d3c0eec, /post/woods-chipper-florida-defense-special-teams-ole-miss.
  - GatorBait Staff, Gator Football. Stat-card cover d3cfa5_1546cc59…, a new light layout family with photo frame f03.
  - Every quote matches ASAP 171203/171204.
  - "31 points" and "0-for-5 on third down in the first half" are GatorBait counts from the ESPN play-by-play; see woods-chipper/SOURCES.md. No email.
- **CFB Saturday wrap:** drafted in cfb-wrap/ with 22 games, 6 still in progress at the draft. Scheduled to refresh and publish at 05:15Z (trig_01CnjeWyu2EENbzZp6SJVJCR).
- **Chomp Up the Charts (AP poll):** scheduled for 18:04Z Sunday (trig_01NyNPP9mzWdG49zXnxPJp1M).
- **Postgame Wrap newsletter:** newsletter/2026-09-27-postgame-wrap-ole-miss.mjml passes every gate (strict compile, check-links, unique images, stack-qc, 390/1000). Not uploaded or sent; waiting on Brenden's go.

## Update 02:10-02:25Z: Magazine fixed; full QC pass and corrections (no email)
- **Magazine embed 1dd74333, rev33→34→35:**
  - Hides the native August Blog Post List in every browser. Before, a `:has()` rule left it visible without `:has` support.
  - A 4-second safety reveal means the page is never blank.
  - The stale "Kickoff is today" link now reads "FINAL · Florida 52, Ole Miss 28" and goes to the game story.
  - The columnist filter now includes Carlton Reese.
  - magazine.js is synced so build.py doesn't undo the fix.
  - A live browser pass shows no quarterback-competition, Campbell, Aug. 14 or pads-on stories, and the FINAL link is present.
  - Rollback: magazine-fix/rollback-magazine-embed.html.
- **QC-A corrections** (qc/QC-A.md):
  - Halftime: Chambliss 10-of-13 for 88 yards, not 71.
  - Halftime: "the SEC's leading rusher" changed to "one of the nation's top rushers".
  - Halftime: the coin-toss line changed to "Ole Miss kicks off to open the game".
  - Woods Chipper: the "blacked out" line is back in its original place in his answer.
  - A correction note was added to halftime.
- **QC-B corrections** (qc/QC-B.md):
  - Carlton column: Baugh and Sumrall quotes now match ASAP word for word; the line is 3.5 points; "kept him out for a play" and "end-around" are gone; a correction note was added.
  - Baugh Runs the SEC: "2025 Doak Walker finalist" (he was only on the watch list) and "second straight 3-TD game" are gone; a correction note was added.
  - Mr. Two Bits: the NFL career is eight seasons (1989-96); the series was 13-13-1 going in; "Since 2009" now reads "In recent years"; the existing correction note was fixed to match.
  - Cyion: Vols Wire is now "earlier this week".
- **Visual QC fixes** (qc/visual/QC-VISUAL.md):
  - The portrait scoreboard photo is now SMALL in the game story and the Cyion story. It had rendered 740x1316.
  - The Lacy story's pointer to the removed Rosters button was deleted.
- **Open, owner call:**
  - Credits missing on the inline images in Mr. Two Bits, Baugh Runs and Game Day; the photographer is unknown.
  - Pre-today covers aren't 1920x1080. They display fine.
