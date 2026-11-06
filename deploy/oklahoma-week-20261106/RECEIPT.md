# Receipt: Oklahoma week edition, Nov. 6, 2026

Read-only on every live object. Full per-block detail is in `magazine/issues/2026-11-06-oklahoma-week/receipt.json`; the rules that produced it are in `magazine/issues/2026-11-06-oklahoma-week/issue.json`.

## 1. The six posts (Blog API, published versions)

Call: `GET https://www.wixapis.com/blog/v3/posts/{id}?fieldsets=URL&fieldsets=RICH_CONTENT`, site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`, Nov. 6, 2026 (reason "Nov. 6 magazine build, read-only"). Then compared with the public rendered pages: all six bodies identical, block for block.

| # | Story | Post id | lastPublishedDate (UTC) | Unpublished edits | Body words, published to magazine |
|---|---|---|---|---|---|
| 1 | Gators No. 24 in First CFP Top 25 as Miami, Georgia Lead the Way (GatorBait Staff) | `afe70819-bc8a-4c89-abf6-bd4749038259` | 2026-11-04T13:41:39.717Z | no | 339 to 324 |
| 2 | Tramell Jones Gets the Call: Buddy Martin Show Panel Backs Sumrall's QB Decision Before Oklahoma (author shown on the live post: Brenden Martin) | `b907cfa6-7a31-4d16-a687-7a39e9f15cc3` | 2026-11-06T17:32:12.552Z | no | 539 to 408 |
| 3 | The Golden Goose Needs A Checkup — And The Schooner Stays Home (Buddy Martin) | `ee624c8a-268c-4f94-889e-6cd3de939f6f` | 2026-11-05T20:09:57.248Z | no | 1,329 to 1,321 |
| 4 | Apples, Oranges and Fielding Yost (Buddy Martin) | `bd815138-7f0c-4f97-a642-1cb5862e3f5a` | 2026-11-04T17:13:08.525Z | no | 1,071 to 1,052 |
| 5 | Showtime at the O’Dome: McMiller’s Career-High 42 Powers Florida Past UCF, 95-65 (Loren Meadows) | `e0e37d66-2592-443d-8a5e-0058bc507802` | 2026-11-06T04:52:15.454Z | no | 622 to 609 |
| 6 | Condon flirts with triple-double as Gators smack JU (Franz Beard) | `27b79db1-f0e7-40eb-9639-49a60420ac00` | 2026-11-06T13:02:24.150Z | **yes (draft with unpublished edits exists; only the published body is used)** | 1,208 to 1,208 |

Excluded, as ordered: the five stale Georgia pregame filings, McCloud (`6bd5d832`), Kindervater (`554f7e23`). **Possible optional adds, not built:** Franz's Oklahoma Soothsayer picks (`59a065eb`; the supplied cover names it) and Best Fridays (`5aa23ca4`).

## 2. Every change made to a body (nothing else was touched)

Global: empty paragraphs dropped (show 6, Goose 2, Yost 23); leading or trailing whitespace trimmed (Goose 2 paragraphs, Yost 3). No wording was rewritten.

| Story | Change | Why |
|---|---|---|
| CFP | Dropped the inline graphic, the "ADVERTISEMENT" label, the Meldon Law banner (outbound sponsor link) and the "More from GatorBait" link paragraph | Graphic is the story hero (used once); ad and link list are web furniture |
| Show | Lead paragraph (photo credit and caption) moved to the hero caption; dropped "WATCH THE FULL SHOW:" plus bare URL; dropped the heading "PIECES FROM THIS SHOW (YouTube links added as each posts)" and its 7 link-only list items; closing paragraph cut after "Florida hosts Oklahoma on Saturday night at The Swamp." (the rest was two bare URLs and their lead-in words) | No outbound links in the PDF |
| Goose | Dropped the final line "Photo: Spatms, CC BY-SA 4.0, via Wikimedia Commons" | The web lead art it credits is not carried into this edition |
| Yost | Dropped the body byline line "By Buddy Mattin" and the "gatorbaitmedia.com" link line; dropped the archive photo and its credit line; **quote pairing:** `saying ‘I don’t know — I wasn’t born yet!” Then again` became `saying “I don’t know — I wasn’t born yet!” Then again` | Byline comes from the post author; the photo is public-domain archive art, not an owned photograph; mechanical quote pairing only |
| McMiller | Body byline line dropped from the body and used as the story byline: "By Loren Meadows, GatorBaitMedia.com and host of The Gator Lowdown with Loren Meadows" | Display metadata |
| Condon | One literal line break inside paragraph 17 (after "...all year.”") rendered as a paragraph break | Whitespace |

Nothing was corrected in names, numbers or facts. Items I could see but did not touch are in section 4.

## 3. Image provenance

Every image below was downloaded and looked at (full-size or large preview) before use. None carries a third-party watermark or credit, in the frame or in any caption. The web QA, the PDF check and the body preparation also scan the text for banned credits and fail if one appears. No media id is used twice in the issue (the web build, the QA and the PDF builder each enforce it).

| Use | Media id (static.wixstatic.com/media/...) | Credit line used | What I saw |
|---|---|---|---|
| Cover, Urban Meyer panel | `ae876a_4ea1277b27d143cbb903195dcde1bf71~mv2.png` (3024 x 4032; a 1771 x 2168 JPG of the same photo is `ae876a_e23470dd2f8944b39af5a0f3c6054271~mv2.jpg`) | "GatorBait Photo" (credit in live post `7b74a670-807e-46b7-b6cf-1541989d7818`, per comment 6689912504) | Meyer at a Gainesville Quarterback Club panel, no marks other than the event banner |
| Cover, The Swamp panorama | `16b519_bd4db014e3cb488f82927284dbf7f9c2~mv2.jpg` (3000 x 969) | Chris Spears, GatorBait Media | Stadium panorama with the photographer's own "Chris Spears" signature |
| Cover as supplied (email cover image, Wix-hosted print proof) | `d3cfa5_7a38b34f125b4ec9b91f1932bc28b70e~mv2.png` | Cover line: "Meyer: GatorBait archive, The Swamp: Chris Spears" | The finished cover, same art as the Codex PDF |
| 1 CFP hero | `d3cfa5_91591597fa63490993a23e4874d5da53~mv2.png` (2160 x 2700) | Graphic: GatorBait Media. | GBM ranking card, sources line "College Football Playoff, Florida Gators" |
| 2 Show hero | `d3cfa5_886c22d32224408e933692539abaa54c~mv2.jpg` (3000 x 1687) | Photo by Chris Spears, GatorBait Media. Full caption kept from the post: "Aaron Philo, No. 12, at left, and Tramell Jones Jr., No. 9, at right, on Florida's sideline against South Carolina on Oct. 10, 2026." | Sideline huddle, "Chris Spears" signature |
| 3 Goose | none: pull quote from the column (Buddy Martin) | n/a | The live lead art is a Wikimedia (CC BY-SA, "Spatms") Sooner Schooner image shared with the unrelated Kindervater post; not carried into print as a GBM photograph (owner direction, comment 6690264123) |
| 4 Yost | none: pull quote from the column | n/a | Live art is a public-domain 1902 archive photo; replaced by a quote |
| 5 McMiller | none: pull quote from Kiyomi McMiller | n/a | Live art is "UAA Communications photo"; not carried into print |
| 6 Condon hero | `16b519_ace94c11ce5d4031a20650525c423bf3~mv2.jpg` (2263 x 3000) | Photo by Chris Spears, GatorBait Media. | Condon (21) driving against Stetson, October exhibition (as the live alt text says), "Chris Spears" signature |

Looked at and **rejected**: `d3cfa5_8acb17fa05274836baf80421256e7668` (Steve Spurrier, 1280 x 474; credited Chris Spears in earlier issue data, but it has no signature and the credit cannot be checked from the file, so it was dropped for a pull quote); `d3cfa5_90425d069f7d49ac9a55f5dedba27f93` (the same Swamp panorama as the cover, would repeat); `ae876a_370e5a794d734a7ba77d081540849fdb` (basketball photo credited "GatorBait Media" in earlier data, wire-style frame, unverifiable); Meldon Law banner `d3cfa5_5716287c5e2a46cb88586ecc31c14a24`.

Web page photos are requested from Wix by media id at runtime; PDFs request JPEG cuts at render time.

## 4. Copy and fact flags (live posts not changed)

**Verified against ESPN box scores (public site API, Nov. 6):**
- Women, event 401906891: Florida 95, UCF 65; McMiller 42 points (14-25 FG, 7-8 FT); Iwuchukwu 20 (6-7 FG, 8-12 FT). Matches the McMiller story.
- Men, event 401906770: Florida 88, Jacksonville 57. Matches the Condon story on score, Chinyelu 21 (7-9, 7-9), Haugh 14 (5-8, 2-4 three, 7 reb, 4 ast, 1 stl), Aberdeen 4-5 on threes, Klavzar 12 (3-5 on threes), Fland 4 points, three assists, Florida 11-25 on threes, 19-27 at the line, Jacksonville 19-57 and 6-21, bench 25 points, front-line totals 47 points, 27 rebounds, 13 assists, 15-23 FG, 3-6 on threes, 14-17 FT, four blocks.
- **Two numbers in the Condon story differ from ESPN:** paragraph 6 says Condon shot "2-3 ... from the field including 1-2 from three"; ESPN has **3-6 FG**, 1-2 on threes, 5-6 FT (his 12 points only add up with 3-6). Paragraph 15 says Florida outrebounded Jacksonville "51-25"; ESPN shows **52-25**. Left as published.

**Copy problems noticed (left as published):**
- Goose, Meyer quote (5 paragraphs): quote marks open and are not closed paragraph to paragraph, and two stray opening marks appear mid-paragraph ("...you saw a lot of them. “And then there'd be..." and "...all the time. “It’s kind of funny."). The line "“James Bates, etc." names a player with "etc." and is **unverified**; I did not guess a name. Also straight apostrophes inside the quote, "their their son" and "see...and show".
- Goose: the TV audience figures (3.3 million, 5.3 million, 3.6 million, 7.1 million, 6.6 million, 4.9, 4.6; the percent changes; the Nielsen 45 million households and 7.5 percent lift; "22 games drew 10 million") carry no source in the body and are not from ESPN or FloridaGators.com. The magazine adds none and verifies none.
- Yost: body byline typo "By Buddy Mattin" (removed from the magazine, still on the live post); mismatched quote marks (paired in the magazine, listed above); 23 empty paragraphs; historical claims (Stagg "invented the huddle", Warner "invented half the plays", Yost's 55-1-1) are column assertions, not checked.
- Show recap: the live post is under author **Brenden Martin** (owner account); a staff or show byline may be intended. The subhead "PIECES FROM THIS SHOW (YouTube links added as each posts)" is a leftover process note on the live post. All-caps subheads ("MEYER AND THE RING OF HONOR", "THE PANEL FILLS OUT") are not AP style; kept. The sentence "That full conversation is cut as its own segment: watch the Urban Meyer Ring of Honor discussion." points to a link the PDF does not have (words kept). Quotes use straight marks where the rest of the site is curly.
- CFP: "Tell us in the comments below." is a web call to action that points nowhere in a PDF (kept).
- McMiller: "This evening, Florida’s basketball teams..." and the whole opening is one 150-word paragraph; "this evening" is Nov. 5 though the post stamped Nov. 6 and the issue is dated Nov. 6. Records such as "fourth-highest output in Gators history" and "fifth player in school history to score 30 or more points in back-to-back games" name no source.
- Condon: "face Troy tonight" (Nov. 5, dated language); "O-Dome" here versus "O’Dome" in the other story and the headline; "an historic night", "counter intuitive", "decisionmakers", "the Dolphins surrounding Chinyelu" (grammar). The headline is sentence case ("Condon flirts with triple-double as Gators smack JU") unlike the other five titles; kept.

## 5. Supplied cover

`d3cfa5_672df0d97bf64db9bd8b599c4b11c35b.pdf` (Codex, comment 6690264123): 630 x 810 pt with a 612 x 792 pt TrimBox, embedded Impact, Arial Bold, Georgia; photographs at 403 and 343 effective ppi. Used unchanged (rasterized at 250 dpi at the TrimBox for print; scaled to 1200 x 1600 on matching navy for the web poster). It lists "Franz Beard's Oklahoma Soothsayer", which is not in this issue (see README).

## 6. Hashes

- `sports-live/magazine-oklahoma-week.js`: sha256 `0349d905fe4df62e98810898e74a9c00a6b1baaa5c68fe14fb8259ec9500c580` (placeholder-state build `d4cf2287`; it changes when the PDF links are filled)
- print PDF: sha256 `f5ce492ce2bea997d90b892b0f1370fd570ec076701bf1258e983ae5daba88ba`
- phone PDF: sha256 `3a92083647daaa090cd79191cb5d56d4fb93a69514328db23b8cd993efcc0a10`
