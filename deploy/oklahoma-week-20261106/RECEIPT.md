# Receipt: Oklahoma week edition, Nov. 6, 2026 (eight stories)

Read-only on every live object. Full per-block detail is in `magazine/issues/2026-11-06-oklahoma-week/receipt.json`; the rules that produced it are in `magazine/issues/2026-11-06-oklahoma-week/issue.json`.

## 1. The eight posts (Blog API, published versions), in reading order

Call: `GET https://www.wixapis.com/blog/v3/posts/{id}?fieldsets=URL&fieldsets=RICH_CONTENT`, site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`, Nov. 6, 2026. The first six were read on the first pass; all eight were read again that evening, after the Condon post was republished at 21:32Z. Both passes were read-only. Then compared with the public rendered pages: **all eight bodies identical, block for block**.

| # | Story | Post id | lastPublishedDate (UTC) | Unpublished edits | Body words, published to magazine |
|---|---|---|---|---|---|
| 1 | **NEW.** Best Fridays: Urban Meyer Looks Back as Florida Turns Toward Oklahoma (live author: Brenden Martin) | `5aa23ca4-73b9-4747-a58b-b0d862a15ce3` | 2026-11-06T17:18:56.502Z | no | 569 to 496 |
| 2 | Tramell Jones Gets the Call: Buddy Martin Show Panel Backs Sumrall's QB Decision Before Oklahoma (author shown on the live post: Brenden Martin) | `b907cfa6-7a31-4d16-a687-7a39e9f15cc3` | 2026-11-06T17:32:12.552Z | no | 539 to 408 |
| 3 | **NEW.** The Soothsayer likes the Gators in a white knuckler (Franz Beard) | `59a065eb-f45f-4e4b-a898-f53481bebf54` | 2026-11-06T16:06:05.184Z | no | 1,629 to 1,599 |
| 4 | Condon flirts with triple-double as Gators smack JU (Franz Beard) | `27b79db1-f0e7-40eb-9639-49a60420ac00` | **2026-11-06T21:32:10.136Z** (was 13:02:24.150Z) | no (was yes) | 1,214 to 1,208 |
| 5 | Showtime at the O’Dome: McMiller’s Career-High 42 Powers Florida Past UCF, 95-65 (Loren Meadows) | `e0e37d66-2592-443d-8a5e-0058bc507802` | 2026-11-06T04:52:15.454Z | no | 622 to 609 |
| 6 | Gators No. 24 in First CFP Top 25 as Miami, Georgia Lead the Way (GatorBait Staff) | `afe70819-bc8a-4c89-abf6-bd4749038259` | 2026-11-04T13:41:39.717Z | no | 339 to 324 |
| 7 | The Golden Goose Needs A Checkup — And The Schooner Stays Home (Buddy Martin) | `ee624c8a-268c-4f94-889e-6cd3de939f6f` | 2026-11-05T20:09:57.248Z | no | 1,329 to 1,321 |
| 8 | Apples, Oranges and Fielding Yost (Buddy Martin) | `bd815138-7f0c-4f97-a642-1cb5862e3f5a` | 2026-11-04T17:13:08.525Z | no | 1,071 to 1,052 |

**Re-read result against the first receipt:** five of the original six did not change (same `lastPublishedDate`, same text fingerprint). **One changed: Condon `27b79db1`.** It was republished at 21:32Z and no longer has unpublished edits. All 18 non-empty article paragraphs are word for word what the 13:02Z version had. The only body difference is two display lines added at the top, "By Franz Beard" and "gator bait media.com" (whose second half links to `http://media.com`); both are dropped by rule, so the magazine's Condon html is identical to the previous build. The live post's cover-photo alt text now ends "Photo by Chris Spears, GatorBaitMedia.com". The two ESPN differences noted before (Condon "2-3" field goals, "51-25" rebounds) are still in the live copy.

Raw responses of the two added posts and of the refreshed Condon post are in `magazine/issues/2026-11-06-oklahoma-week/source/raw/`; normalized bodies of all eight are in `source/`. My copies of those three raw bodies were checked against a text fingerprint computed on the Wix side (Best Fridays `602ac6b6`, Soothsayer `76f8c0fa`, Condon `2ac328d0`): all match.

Excluded, as ordered: the five stale Georgia pregame filings, McCloud (`6bd5d832`), Kindervater (`554f7e23`).

## 2. Every change made to a body (nothing else was touched)

Global: empty paragraphs dropped (Best Fridays 0, show 6, **Soothsayer 24 = 23 empty plus one that held only a space**, Condon 3, Goose 2, Yost 23); leading or trailing whitespace trimmed (Soothsayer 9 paragraphs, Goose 2, Yost 3). No wording was rewritten.

| Story | Change | Why |
|---|---|---|
| Best Fridays | Last paragraph ("Cover: Buddy Martin, left, interviews Urban Meyer in the taped conversation featured on Best Fridays. Video still: The Buddy Martin Show / Gator Bait Media.") became the hero caption, **minus the label "Cover: "** | It is the photo caption and credit; the label would read as a claim about this magazine's cover |
| Best Fridays | Dropped the heading "Watch the full interview and Friday's show"; the paragraph "The complete Urban Meyer interview is available here:" plus its YouTube URL; the paragraph "Friday's Best Fridays show, including the Edgar Thompson conversation and the morning's football and basketball lineup, is available here:" plus its YouTube URL; the two promo lines "Read Gator Bait Media daily:" and "Watch The Buddy Martin Show:" with their URLs | No outbound links in the PDF; the heading would be orphaned |
| Soothsayer | Dropped the body byline line "By Franz Beard" and the line "gatorbaitmedia.com" (a link) | Byline comes from the post author; web furniture |
| Soothsayer | **Dropped the stray one-letter paragraph "K"** (between "...hit hard by the injury bug?" and "Venables, who got a contract extension...") | Stray character, as ordered |
| Soothsayer | Last paragraph ("Cover: Jadan Baugh dives into the end zone against Ole Miss in The Swamp on September 26, 2026. Archival photo by Chris Spears, GatorBait Media.") became the hero caption, minus "Cover: " | Photo caption and credit |
| Soothsayer | Sub-headings keep their level: the section title "THE SEC SOOTHSAYER" is set larger than the seven game lines under it | Formatting only, no words |
| Condon | Dropped the two display lines added in the 21:32Z republish: "By Franz Beard" and "gator bait media.com" | Byline comes from the post author; the second line links to `http://media.com` |
| Condon | One literal line break inside paragraph 17 (after "...all year.”") rendered as a paragraph break | Whitespace |
| CFP | Dropped the inline graphic, the "ADVERTISEMENT" label, the Meldon Law banner (outbound sponsor link) and the "More from GatorBait" link paragraph | Graphic is the story hero (used once); ad and link list are web furniture |
| Show | Lead paragraph (photo credit and caption) moved to the hero caption; dropped "WATCH THE FULL SHOW:" plus bare URL; dropped the heading "PIECES FROM THIS SHOW (YouTube links added as each posts)" and its 7 link-only list items; closing paragraph cut after "Florida hosts Oklahoma on Saturday night at The Swamp." (the rest was two bare URLs and their lead-in words) | No outbound links in the PDF |
| Goose | Dropped the final line "Photo: Spatms, CC BY-SA 4.0, via Wikimedia Commons" | The web lead art it credits is not carried into this edition |
| Yost | Dropped the body byline line "By Buddy Mattin" and the "gatorbaitmedia.com" link line; dropped the archive photo and its credit line; **quote pairing:** `saying ‘I don’t know — I wasn’t born yet!” Then again` became `saying “I don’t know — I wasn’t born yet!” Then again` | Byline comes from the post author; the photo is public-domain archive art, not an owned photograph; mechanical quote pairing only |
| McMiller | Body byline line dropped from the body and used as the story byline: "By Loren Meadows, GatorBaitMedia.com and host of The Gator Lowdown with Loren Meadows" | Display metadata |

Nothing was corrected in names, numbers or facts, and no wording of Franz's, Buddy's or Loren's was removed other than the lines listed above. Items I could see but did not touch are in section 4.

## 3. Image provenance

Every image below was downloaded and looked at (full-size or large preview) before use. None carries a third-party watermark or credit, in the frame or in any caption. The web QA, the PDF check and the body preparation also scan the text for banned credits and fail if one appears. No media id is used twice in the issue (the web build, the QA, the email check and the PDF builder each enforce it).

| Use | Media id (static.wixstatic.com/media/...) | Credit line used | What I saw |
|---|---|---|---|
| Cover, Urban Meyer panel | `ae876a_4ea1277b27d143cbb903195dcde1bf71~mv2.png` (3024 x 4032; a 1771 x 2168 JPG of the same photo is `ae876a_e23470dd2f8944b39af5a0f3c6054271~mv2.jpg`) | "GatorBait Photo" (credit in live post `7b74a670-807e-46b7-b6cf-1541989d7818`, per comment 6689912504) | Meyer at a Gainesville Quarterback Club panel, no marks other than the event banner |
| Cover, The Swamp panorama | `16b519_bd4db014e3cb488f82927284dbf7f9c2~mv2.jpg` (3000 x 969) | Chris Spears, GatorBait Media | Stadium panorama with the photographer's own "Chris Spears" signature |
| Cover as supplied (email cover image, Wix-hosted print proof) | `d3cfa5_7a38b34f125b4ec9b91f1932bc28b70e~mv2.png` | Cover line: "Meyer: GatorBait archive, The Swamp: Chris Spears" | The finished cover, same art as the Codex PDF |
| **1 Best Fridays hero (NEW)** | `d3cfa5_9d5c633efb33434689e9162eab270f7c~mv2.jpg` (1920 x 1080) | "Video still: The Buddy Martin Show / Gator Bait Media." (verbatim from the live body's last paragraph and the post's media alt text) | A produced video-call still: "URBAN MEYER - BUDDY MARTIN" and "BEST FRIDAYS" title art behind two call tiles. Left tile: Buddy Martin in a GatorBait cap, name tag "Buddy Martin / GATORBAITMEDIA.COM" (our own mark). Right tile: a man in a cap and pink shirt, tile letter "M"; the post and caption name him as Urban Meyer (I did not verify the identity from the frame). No third-party watermark, logo or credit anywhere in the frame. It is a video-call composite, not a photograph. |
| 2 Show hero | `d3cfa5_886c22d32224408e933692539abaa54c~mv2.jpg` (3000 x 1687) | Photo by Chris Spears, GatorBait Media. Full caption kept from the post: "Aaron Philo, No. 12, at left, and Tramell Jones Jr., No. 9, at right, on Florida's sideline against South Carolina on Oct. 10, 2026." | Sideline huddle, "Chris Spears" signature |
| **3 Soothsayer hero (NEW)** | `d3cfa5_026d2a4d2be04a91b8c32317fed5f623~mv2.jpg` (1471 x 838; file name "Baugh first TD dive - Florida vs Ole Miss 2026-09-26.jpg") | "Archival photo by Chris Spears, GatorBait Media." (verbatim from the live body's last paragraph and the post's media alt text) | Jadan Baugh (13) diving at the goal line against Ole Miss in The Swamp, scoreboard Ole Miss 0, Florida 0. Only in-stadium signage is visible (SEC Champions banner, ribbon-board ad); no overlay watermark, no third-party credit. **The frame has no photographer signature**, so the Chris Spears credit rests on the live body's credit line, the post's media alt text and the order that names it, not on the file (see flags). |
| 4 Condon hero | `16b519_ace94c11ce5d4031a20650525c423bf3~mv2.jpg` (2263 x 3000) | Photo by Chris Spears, GatorBait Media. | Condon (21) driving against Stetson, October exhibition (as the live alt text says), "Chris Spears" signature. The live alt text now ends "Photo by Chris Spears, GatorBaitMedia.com" (same photographer, site-name spelling). |
| 5 McMiller | none: pull quote from Kiyomi McMiller | n/a | Live art is "UAA Communications photo"; not carried into print |
| 6 CFP hero | `d3cfa5_91591597fa63490993a23e4874d5da53~mv2.png` (2160 x 2700) | Graphic: GatorBait Media. | GBM ranking card, sources line "College Football Playoff, Florida Gators". Now an inside story (it was the web cover story in the first build). |
| 7 Goose | none: pull quote from the column (Buddy Martin) | n/a | The live lead art is a Wikimedia (CC BY-SA, "Spatms") Sooner Schooner image shared with the unrelated Kindervater post; not carried into print as a GBM photograph (owner direction, comment 6690264123) |
| 8 Yost | none: pull quote from the column | n/a | Live art is a public-domain 1902 archive photo; replaced by a quote |

Looked at and **rejected** (first pass): `d3cfa5_8acb17fa05274836baf80421256e7668` (Steve Spurrier, 1280 x 474; credited Chris Spears in earlier issue data, but it has no signature and the credit cannot be checked from the file, so it was dropped for a pull quote); `d3cfa5_90425d069f7d49ac9a55f5dedba27f93` (the same Swamp panorama as the cover, would repeat); `ae876a_370e5a794d734a7ba77d081540849fdb` (basketball photo credited "GatorBait Media" in earlier data, wire-style frame, unverifiable); Meldon Law banner `d3cfa5_5716287c5e2a46cb88586ecc31c14a24`.

Web page photos are requested from Wix by media id at runtime; PDFs request JPEG cuts at render time.

## 4. Copy and fact flags (live posts not changed)

**New in this pass:**
- **Profanity, owner decision.** The Soothsayer's second paragraph says Oklahoma "got bitch-slapped into submission by South Carolina". Kept exactly as written. It is in the two PDFs only; the web bundle and the email carry the title and excerpt, not the body.
- **Soothsayer hero credit.** The Baugh frame has no signature in the file (see section 3). If the owner wants the bar used for the rejected Spurrier frame, swap this story to a pull quote (a one-line change in `issue.json` plus `sports-live/magazine-issue-oklahoma-week.json` and the MJML).
- **Soothsayer facts, as checked by the Nov. 6 fact desk against ESPN (comment 6692229038), not by this build:** records, rankings, kickoff times and TV for the seven SEC games match ESPN. "Three weeks ago" for Oklahoma's win over Texas is almost four (Oct. 10). The spreads (Florida 6.5, Texas 2.5) have since moved on ESPN to 6 and 3. Nobody checked Oklahoma 336.9 yards per game, Florida 13th in the SEC on defense, Stockton 35 catches for 365 yards or Tennessee 35 sacks. Colorful wording and spacing left as published ("alma mammy", "Fighting Clark Leas", "Wazzoo", a double space after "since September.").
- **Best Fridays hero** is a video-call composite, not a photograph, and the guest tile is small. It is the owner-named hero and it is our own show footage.
- **Bylines.** Best Fridays and the Thursday show recap both sit under the owner account (Brenden Martin). A show or staff byline may be intended; the magazine uses the post author.
- **Best Fridays** keeps its dated phrasing ("Friday morning's Best Fridays", "The November 6 edition") and its sentence that Franz Beard "was unable to join".
- **Up next card and email.** Both repeat "Women's basketball: at Chattanooga, Sunday, 2 p.m. ET, SEC Network+" as reported in Loren Meadows' story. The fact desk says ESPN lists that game on ESPN+, but UF's own Oct. 7 TV release (FloridaGators.com, the first source) lists it on SEC+ at 2:00 p.m. ET, so the earlier note is withdrawn. Left as is. "Silver Springs, Maryland" was corrected to "Silver Spring" on the live post at 23:15Z (ESPN roster), and the magazine carries the correction.
- **Condon** (republished 21:32Z): see section 1. The two ESPN differences are still in the live copy and in the magazine.
- **Web cover.** The shared renderer shows at most six "Also inside" lines; the two Buddy Martin columns share the sixth.

**Verified against ESPN box scores (public site API, Nov. 6, first pass):**
- Women, event 401906891: Florida 95, UCF 65; McMiller 42 points (14-25 FG, 7-8 FT); Iwuchukwu 20 (6-7 FG, 8-12 FT). Matches the McMiller story.
- Men, event 401906770: Florida 88, Jacksonville 57. Matches the Condon story on score, Chinyelu 21 (7-9, 7-9), Haugh 14 (5-8, 2-4 three, 7 reb, 4 ast, 1 stl), Aberdeen 4-5 on threes, Klavzar 12 (3-5 on threes), Fland 4 points, three assists, Florida 11-25 on threes, 19-27 at the line, Jacksonville 19-57 and 6-21, bench 25 points, front-line totals 47 points, 27 rebounds, 13 assists, 15-23 FG, 3-6 on threes, 14-17 FT, four blocks.
- **Two numbers in the Condon story differ from ESPN:** paragraph 6 says Condon shot "2-3 ... from the field including 1-2 from three"; ESPN has **3-6 FG**, 1-2 on threes, 5-6 FT (his 12 points only add up with 3-6). Paragraph 15 says Florida outrebounded Jacksonville "51-25"; ESPN shows **52-25**. The field-goal line was **corrected on the live post at 23:15Z** (2-3 became 3-6) and the magazine carries 3-6. The rebound line is left as published (ESPN totals include team rebounds; not confirmed as an error).

**Copy problems noticed (left as published):**
- Goose, Meyer quote (5 paragraphs): quote marks open and are not closed paragraph to paragraph, and two stray opening marks appear mid-paragraph ("...you saw a lot of them. “And then there'd be..." and "...all the time. “It’s kind of funny."). The line "“James Bates, etc." names a player with "etc." and is **unverified**; I did not guess a name. Also straight apostrophes inside the quote, "their their son" and "see...and show".
- Goose: the TV audience figures (3.3 million, 5.3 million, 3.6 million, 7.1 million, 6.6 million, 4.9, 4.6; the percent changes; the Nielsen 45 million households and 7.5 percent lift; "22 games drew 10 million") carry no source in the body and are not from ESPN or FloridaGators.com. The magazine adds none and verifies none.
- Yost: body byline typo "By Buddy Mattin" (removed from the magazine, still on the live post); mismatched quote marks (paired in the magazine, listed above); 23 empty paragraphs; historical claims (Stagg "invented the huddle", Warner "invented half the plays", Yost's 55-1-1) are column assertions, not checked.
- Show recap: the live post is under author **Brenden Martin** (owner account); a staff or show byline may be intended. The subhead "PIECES FROM THIS SHOW (YouTube links added as each posts)" is a leftover process note on the live post. All-caps subheads ("MEYER AND THE RING OF HONOR", "THE PANEL FILLS OUT") are not AP style; kept. The sentence "That full conversation is cut as its own segment: watch the Urban Meyer Ring of Honor discussion." points to a link the PDF does not have (words kept). Quotes use straight marks where the rest of the site is curly. (Best Fridays also uses straight quote marks.)
- CFP: "Tell us in the comments below." is a web call to action that points nowhere in a PDF (kept).
- McMiller: "This evening, Florida’s basketball teams..." and the whole opening is one 150-word paragraph; "this evening" is Nov. 5 though the post stamped Nov. 6 and the issue is dated Nov. 6. Records such as "fourth-highest output in Gators history" and "fifth player in school history to score 30 or more points in back-to-back games" name no source.
- Condon: "face Troy tonight" (Nov. 5, dated language); "O-Dome" here versus "O’Dome" in the other story and the headline; "an historic night", "counter intuitive", "decisionmakers", "the Dolphins surrounding Chinyelu" (grammar). The headline is sentence case ("Condon flirts with triple-double as Gators smack JU") unlike the other titles; kept.

## 5. Supplied cover

`d3cfa5_672df0d97bf64db9bd8b599c4b11c35b.pdf` (Codex, comment 6690264123): 630 x 810 pt with a 612 x 792 pt TrimBox, embedded Impact, Arial Bold, Georgia; photographs at 403 and 343 effective ppi. Used unchanged (rasterized at 250 dpi at the TrimBox for print; scaled to 1200 x 1600 on matching navy for the web poster). Its "INSIDE" list names "Franz Beard's Oklahoma Soothsayer", which is now story 3. **Flag: the cover's type is Impact, Georgia and Arial, not Barlow** (everything built here is Barlow); the cover art was not changed.

## 6. Hashes

- `sports-live/magazine-oklahoma-week.js`: sha256 `35da054634e3276d0e82baf354ceae57013c0521690508022da728155a1cb2b0` (placeholder-state build `2e3a0e2e`; it changes when the PDF links are filled)
- print PDF: sha256 `01610104fdb602d65ca2bb3832a5e98cbaace16d365c6c158d736815bcb20d25`
- phone PDF: sha256 `d579412537c066f0162a8f47a13124c39e40ab119474bc6267402161732e4e1a`
