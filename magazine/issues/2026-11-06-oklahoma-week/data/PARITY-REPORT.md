# Full-copy parity report

Package source text (articles/*.txt) against the prepared story bodies (`posts.json`), matched by post id through `articles.json`.

- Prepared copy: `magazine/issues/2026-11-06-oklahoma-week/posts.json` (issue `2026-11-06-oklahoma-week`, 9 stories)
- Package: `<package>/articles.json` (manifest acquired 2026-11-06 22:02:56 UTC; latest addition 2026-11-06 22:19:25 UTC; 9 stories)
- Tool: `tools/magazine-pdf/check-parity.py` (read-only); PDF: `print-stage/gatorbait-magazine-oklahoma-week-2026-11-06-v2-letter.pdf`

## Result: PASS: nothing UNEXPLAINED

| # | Story | Source paragraphs | Prepared paragraphs | Identical | Differ | Dropped by rule | UNEXPLAINED | Ending (c) |
|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | Best Fridays: Urban Meyer Looks Back ... `fridays` | 25 | 19 | 19 | 0 | 6 | 0 | dropped by rule |
| 2 | Tramell Jones Gets the Call: Buddy ... `show` | 24 | 14 | 13 | 1 | 10 | 0 | dropped by rule |
| 3 | The Soothsayer likes the Gators in ... `soothsayer` | 37 | 33 | 33 | 0 | 4 | 0 | dropped by rule |
| 4 | Witten Off? Oklahoma's New Play-Caller vs. ... `scouting1` | 31 | 30 | 30 | 0 | 1 | 0 | in prepared copy |
| 5 | Condon flirts with triple-double as Gators ... `condon` | 21 | 19 | 18 | 1 | 2 | 0 | in prepared copy |
| 6 | Showtime at the O’Dome: McMiller’s Career-High ... `mcmiller` | 9 | 8 | 7 | 1 | 1 | 0 | in prepared copy |
| 7 | Gators No. 24 in First CFP ... `cfp` | 10 | 8 | 8 | 0 | 2 | 0 | dropped by rule |
| 8 | The Golden Goose Needs A Checkup ... `goose` | 50 | 49 | 48 | 1 | 1 | 0 | dropped by rule |
| 9 | Apples, Oranges and Fielding Yost `yost` | 29 | 26 | 25 | 1 | 3 | 0 | dropped by rule |

Expected corrections (the only text differences allowed inside a matched paragraph):

- Condon: '2-3 shooting from the field' became '3-6' (ESPN box score): `2-3` to `3-6`, found 1 time(s): ok
- McMiller: 'Silver Springs, Maryland' became 'Silver Spring' (ESPN roster): `Springs` to `Spring`, found 1 time(s): ok
- Yost: a mismatched opening quote mark (single, closed by a double) was paired (recorded desk rule in issue.json): `‘I` to `“I`, found 1 time(s): ok
- Golden Goose: 'enters the Ring of Honor at halftime' became 'at the end of the first quarter' (UF's Nov. 5 Meyer feature; magazine-only until the live post is corrected): `halftime` to `the end of the first quarter`, found 1 time(s): ok

## 1. Best Fridays: Urban Meyer Looks Back as Florida Turns Toward Oklahoma

`fridays` | post `5aa23ca4-73b9-4747-a58b-b0d862a15ce3` | By Brenden Martin | source file `best-fridays-meyer.txt` | 25 source paragraphs (1 blocks held a literal line break), 19 prepared paragraphs

- Header: title identical
- Header: byline identical (`By Brenden Martin`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 6 dropped by rule, 0 UNEXPLAINED

- `20` `Watch the full interview and Friday's show` : **dropped by rule**, link-only/promo line (heading of a section that holds only link/promo lines)
- `21` `The complete Urban Meyer interview is available here: https://www.youtube.com/watch?v=Z9C_z-4MoSQ` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `22` `Friday's Best Fridays show, including the Edgar Thompson conversation and ...` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `23` `Read Gator Bait Media daily: https://www.gatorbaitmedia.com` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `24` `Watch The Buddy Martin Show: https://youtube.com/@TheBuddyMartinShow/live` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `25` `Cover: Buddy Martin, left, interviews Urban Meyer in the taped ...` : **dropped by rule**, photo-credit/caption line (carried as the hero caption)

**(b) Text differences inside matched paragraphs:** 0 paragraph(s)

- none

**(c) Ending (final source paragraph):** `25` `Cover: Buddy Martin, left, interviews Urban Meyer in the taped conversation featured ...`

- The ending is in the dropped-by-rule list (photo-credit/caption line).

**PDF:** 19 prepared paragraphs, first 8 and last 8 words found for 19


## 2. Tramell Jones Gets the Call: Buddy Martin Show Panel Backs Sumrall's QB Decision Before Oklahoma

`show` | post `b907cfa6-7a31-4d16-a687-7a39e9f15cc3` | By Brenden Martin | source file `thursday-qb-panel.txt` | 24 source paragraphs (0 blocks held a literal line break), 14 prepared paragraphs

- Header: title identical
- Header: byline identical (`By Brenden Martin`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 10 dropped by rule, 0 UNEXPLAINED

- `1` `Aaron Philo, No. 12, at left, and Tramell Jones Jr., ...` : **dropped by rule**, photo-credit/caption line (carried as the hero caption)
- `8` `WATCH THE FULL SHOW: https://www.youtube.com/watch?v=czm4gnJPE4w` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `16` `PIECES FROM THIS SHOW (YouTube links added as each posts)` : **dropped by rule**, link-only/promo line (heading of a section that holds only link/promo lines)
- `17` `Full show: https://www.youtube.com/watch?v=czm4gnJPE4w` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `18` `Loren Meadows on the Tramell Jones decision (standalone interview cut): ...` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `19` `Ben Troupe: SEC weekend and CFP preview (standalone interview cut): ...` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `20` `Paul Wilson Jr.: the playoff picture (standalone interview cut): https://www.youtube.com/watch?v=n_QFbB_yMuQ` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `21` `Segment: Urban Meyer Ring of Honor: https://www.youtube.com/watch?v=ZcDpF0jCPGU` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `22` `Segment: the 24-team playoff debate: https://www.youtube.com/watch?v=Us_Nc7LIbtg` : **dropped by rule**, link-only/promo line (short lead-in plus URL)
- `23` `Shorts: "daddy ball," dynasties are over, Notre Dame playing for ...` : **dropped by rule**, link-only/promo line (short line of link labels (18 of 95 characters are links, ends on a link))

**(b) Text differences inside matched paragraphs:** 1 paragraph(s)

- `24` `Florida hosts Oklahoma on Saturday night at The ...` : **dropped by rule** (end of paragraph trimmed), ...at The Swamp. `Catch The Buddy Martin Show live all season: https://youtube.com/@TheBuddyMartinShow/live — and read Gator Bait Media daily at https://www.g...` removed. link-only/promo line: short lead-in plus URL

**(c) Ending (final source paragraph):** `24` `Florida hosts Oklahoma on Saturday night at The Swamp. Catch The Buddy ...`

- The ending is in the dropped-by-rule list (tail trimmed).

**PDF:** 14 prepared paragraphs, first 8 and last 8 words found for 14


## 3. The Soothsayer likes the Gators in a white knuckler

`soothsayer` | post `59a065eb-f45f-4e4b-a898-f53481bebf54` | By Franz Beard | source file `franz-oklahoma-soothsayer.txt` | 37 source paragraphs (0 blocks held a literal line break), 33 prepared paragraphs

- Header: title identical
- Header: byline identical (`By Franz Beard`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 4 dropped by rule, 0 UNEXPLAINED

- `1` `By Franz Beard` : **dropped by rule**, bare byline line
- `2` `gatorbaitmedia.com` : **dropped by rule**, link-only/promo line (bare site name (domain only))
- `9` `K` : **dropped by rule**, stray one-letter paragraph (a one-letter keystroke left in the filing (recorded desk rule in issue.json))
- `37` `Cover: Jadan Baugh dives into the end zone against Ole ...` : **dropped by rule**, photo-credit/caption line (carried as the hero caption)

**(b) Text differences inside matched paragraphs:** 0 paragraph(s)

- none

**(c) Ending (final source paragraph):** `37` `Cover: Jadan Baugh dives into the end zone against Ole Miss in ...`

- The ending is in the dropped-by-rule list (photo-credit/caption line).

**PDF:** 33 prepared paragraphs, first 8 and last 8 words found for 33


## 4. Witten Off? Oklahoma's New Play-Caller vs. the Gators' Pass Rush (Scouting Oklahoma, Part 1)

`scouting1` | post `2d31ea6f-538f-4d40-8bca-e497943d80e1` | By GatorBait Staff | source file `oklahoma-scouting-part1.txt` | 31 source paragraphs (0 blocks held a literal line break), 30 prepared paragraphs

- Header: title identical
- Header: byline identical (`By GatorBait Staff`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 1 dropped by rule, 0 UNEXPLAINED

- `1` `Florida's defense huddles during the game at Auburn on Sept. ...` : **dropped by rule**, photo-credit/caption line (carried as the hero caption)

**(b) Text differences inside matched paragraphs:** 0 paragraph(s)

- none

**(c) Ending (final source paragraph):** `31` `Sources: FloridaGators.com, SoonerSports.com and ESPN. Statistics are through Oct. 31. Availability is ...`

- The ending appears in the prepared copy, word for word.

**PDF:** 30 prepared paragraphs, first 8 and last 8 words found for 30


## 5. Condon flirts with triple-double as Gators smack JU

`condon` | post `27b79db1-f0e7-40eb-9639-49a60420ac00` | By Franz Beard | source file `franz-jacksonville-condon.txt` | 21 source paragraphs (1 blocks held a literal line break), 19 prepared paragraphs

- Header: title identical
- Header: byline identical (`By Franz Beard`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 2 dropped by rule, 0 UNEXPLAINED

- `1` `By Franz Beard` : **dropped by rule**, bare byline line
- `2` `gator bait media.com` : **dropped by rule**, link-only/promo line (bare site name (domain only))

**(b) Text differences inside matched paragraphs:** 1 paragraph(s)

- `8` `Condon’s flirtation with the triple-double included 2-3 shooting ...` : expected correction, ...the triple-double included `2-3` to `3-6`. Condon: '2-3 shooting from the field' became '3-6' (ESPN box score)

**(c) Ending (final source paragraph):** `21` `Next up for the Gators is a trip to Tallahassee for the ...`

- The ending appears in the prepared copy, word for word.

**PDF:** 19 prepared paragraphs, first 8 and last 8 words found for 19


## 6. Showtime at the O’Dome: McMiller’s Career-High 42 Powers Florida Past UCF, 95-65

`mcmiller` | post `e0e37d66-2592-443d-8a5e-0058bc507802` | By Loren Meadows, GatorBaitMedia.com and host of The Gator Lowdown with Loren Meadows | source file `loren-ucf-mcmiller.txt` | 9 source paragraphs (0 blocks held a literal line break), 8 prepared paragraphs

- Header: title identical
- Header: byline `By Loren Meadows, GatorBaitMedia.com and host of The Gator Lowdown with Loren Meadows` is the story's own byline line in the source body (the package header has `By Loren Meadows`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 1 dropped by rule, 0 UNEXPLAINED

- `1` `By Loren Meadows, GatorBaitMedia.com and host of The Gator Lowdown ...` : **dropped by rule**, bare byline line

**(b) Text differences inside matched paragraphs:** 1 paragraph(s)

- `2` `This evening, Florida’s basketball teams took part in ...` : expected correction, ...pick from Silver `Springs,` to `Spring,`. McMiller: 'Silver Springs, Maryland' became 'Silver Spring' (ESPN roster)

**(c) Ending (final source paragraph):** `9` `The Florida women will take the show on the road for the ...`

- The ending appears in the prepared copy, word for word.

**PDF:** 8 prepared paragraphs, first 8 and last 8 words found for 8


## 7. Gators No. 24 in First CFP Top 25 as Miami, Georgia Lead the Way

`cfp` | post `afe70819-bc8a-4c89-abf6-bd4749038259` | By GatorBait Staff | source file `first-cfp-top25.txt` | 10 source paragraphs (0 blocks held a literal line break), 8 prepared paragraphs

- Header: title identical
- Header: byline identical (`By GatorBait Staff`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 2 dropped by rule, 0 UNEXPLAINED

- `9` `ADVERTISEMENT` : **dropped by rule**, link-only/promo line (sponsor/ad label)
- `10` `More from GatorBait: our Florida football coverage, schedule and the ...` : **dropped by rule**, link-only/promo line ('More from GatorBait' promo line)

**(b) Text differences inside matched paragraphs:** 0 paragraph(s)

- none

**(c) Ending (final source paragraph):** `10` `More from GatorBait: our Florida football coverage, schedule and the Florida vs. ...`

- The ending is in the dropped-by-rule list (link-only/promo line).

**PDF:** 8 prepared paragraphs, first 8 and last 8 words found for 8


## 8. The Golden Goose Needs A Checkup — And The Schooner Stays Home

`goose` | post `ee624c8a-268c-4f94-889e-6cd3de939f6f` | By Buddy Martin | source file `buddy-golden-goose.txt` | 50 source paragraphs (0 blocks held a literal line break), 49 prepared paragraphs

- Header: title identical
- Header: byline identical (`By Buddy Martin`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 1 dropped by rule, 0 UNEXPLAINED

- `50` `Photo: Spatms, CC BY-SA 4.0, via Wikimedia Commons` : **dropped by rule**, photo-credit/caption line

**(b) Text differences inside matched paragraphs:** 1 paragraph(s)

- `39` `Urban Meyer enters the Ring of Honor at ...` : expected correction, ...of Honor at `halftime,` to `the end of the first quarter,`. Golden Goose: 'enters the Ring of Honor at halftime' became 'at the end of the first quarter' (UF's Nov. 5 Meyer feature; magazine-only until the live post is corrected)

**(c) Ending (final source paragraph):** `50` `Photo: Spatms, CC BY-SA 4.0, via Wikimedia Commons`

- The ending is in the dropped-by-rule list (photo-credit/caption line).

**PDF:** 49 prepared paragraphs, first 8 and last 8 words found for 49


## 9. Apples, Oranges and Fielding Yost

`yost` | post `bd815138-7f0c-4f97-a642-1cb5862e3f5a` | By Buddy Martin | source file `buddy-yost.txt` | 29 source paragraphs (0 blocks held a literal line break), 26 prepared paragraphs

- Header: title identical
- Header: byline identical (`By Buddy Martin`)
- Header: url path identical

**(a) Source paragraphs missing from the prepared copy:** 3 dropped by rule, 0 UNEXPLAINED

- `2` `By Buddy Mattin` : **dropped by rule**, bare byline line (the name on the line ('Buddy Mattin') is not the post author's ('Buddy Martin'))
- `3` `gatorbaitmedia.com` : **dropped by rule**, link-only/promo line (bare site name (domain only))
- `29` `Top photo: Michigan vs. Minnesota, 1902, by Benham and Allen. ...` : **dropped by rule**, photo-credit/caption line

**(b) Text differences inside matched paragraphs:** 1 paragraph(s)

- `13` `I admire and respect the attempt by younger ...` : expected correction, ...out by saying `‘I` to `“I`. Yost: a mismatched opening quote mark (single, closed by a double) was paired (recorded desk rule in issue.json)

**(c) Ending (final source paragraph):** `29` `Top photo: Michigan vs. Minnesota, 1902, by Benham and Allen. Public domain, ...`

- The ending is in the dropped-by-rule list (photo-credit/caption line).

**PDF:** 26 prepared paragraphs, first 8 and last 8 words found for 26


## All dropped by rule

- `fridays` `20` `Watch the full interview and Friday's show` : link-only/promo line (heading of a section that holds only link/promo lines)
- `fridays` `21` `The complete Urban Meyer interview is available here: ...` : link-only/promo line (short lead-in plus URL)
- `fridays` `22` `Friday's Best Fridays show, including the Edgar Thompson ...` : link-only/promo line (short lead-in plus URL)
- `fridays` `23` `Read Gator Bait Media daily: https://www.gatorbaitmedia.com` : link-only/promo line (short lead-in plus URL)
- `fridays` `24` `Watch The Buddy Martin Show: https://youtube.com/@TheBuddyMartinShow/live` : link-only/promo line (short lead-in plus URL)
- `fridays` `25` `Cover: Buddy Martin, left, interviews Urban Meyer in ...` : photo-credit/caption line (carried as the hero caption)
- `show` `1` `Aaron Philo, No. 12, at left, and Tramell ...` : photo-credit/caption line (carried as the hero caption)
- `show` `8` `WATCH THE FULL SHOW: https://www.youtube.com/watch?v=czm4gnJPE4w` : link-only/promo line (short lead-in plus URL)
- `show` `16` `PIECES FROM THIS SHOW (YouTube links added as ...` : link-only/promo line (heading of a section that holds only link/promo lines)
- `show` `17` `Full show: https://www.youtube.com/watch?v=czm4gnJPE4w` : link-only/promo line (short lead-in plus URL)
- `show` `18` `Loren Meadows on the Tramell Jones decision (standalone ...` : link-only/promo line (short lead-in plus URL)
- `show` `19` `Ben Troupe: SEC weekend and CFP preview (standalone ...` : link-only/promo line (short lead-in plus URL)
- `show` `20` `Paul Wilson Jr.: the playoff picture (standalone interview ...` : link-only/promo line (short lead-in plus URL)
- `show` `21` `Segment: Urban Meyer Ring of Honor: https://www.youtube.com/watch?v=ZcDpF0jCPGU` : link-only/promo line (short lead-in plus URL)
- `show` `22` `Segment: the 24-team playoff debate: https://www.youtube.com/watch?v=Us_Nc7LIbtg` : link-only/promo line (short lead-in plus URL)
- `show` `23` `Shorts: "daddy ball," dynasties are over, Notre Dame ...` : link-only/promo line (short line of link labels (18 of 95 characters are links, ends on a link))
- `show` `24` `Florida hosts Oklahoma on Saturday night at The ...` : end of paragraph trimmed, link-only/promo line: short lead-in plus URL
- `soothsayer` `1` `By Franz Beard` : bare byline line
- `soothsayer` `2` `gatorbaitmedia.com` : link-only/promo line (bare site name (domain only))
- `soothsayer` `9` `K` : stray one-letter paragraph (a one-letter keystroke left in the filing (recorded desk rule in issue.json))
- `soothsayer` `37` `Cover: Jadan Baugh dives into the end zone ...` : photo-credit/caption line (carried as the hero caption)
- `scouting1` `1` `Florida's defense huddles during the game at Auburn ...` : photo-credit/caption line (carried as the hero caption)
- `condon` `1` `By Franz Beard` : bare byline line
- `condon` `2` `gator bait media.com` : link-only/promo line (bare site name (domain only))
- `mcmiller` `1` `By Loren Meadows, GatorBaitMedia.com and host of The ...` : bare byline line
- `cfp` `9` `ADVERTISEMENT` : link-only/promo line (sponsor/ad label)
- `cfp` `10` `More from GatorBait: our Florida football coverage, schedule ...` : link-only/promo line ('More from GatorBait' promo line)
- `goose` `50` `Photo: Spatms, CC BY-SA 4.0, via Wikimedia Commons` : photo-credit/caption line
- `yost` `2` `By Buddy Mattin` : bare byline line (the name on the line ('Buddy Mattin') is not the post author's ('Buddy Martin'))
- `yost` `3` `gatorbaitmedia.com` : link-only/promo line (bare site name (domain only))
- `yost` `29` `Top photo: Michigan vs. Minnesota, 1902, by Benham ...` : photo-credit/caption line

## All UNEXPLAINED

- none

Rules used, so the lists above can be audited: a missing paragraph is "dropped by rule" only if it is a bare byline line (`By Name`, or the story byline), a link-only/promo line (bare URL or domain, a short lead-in plus URL, an ADVERTISEMENT label, a `More from ...:` line, a short line of link labels per the package native snapshot, or the heading of a section that holds only such lines), an empty line, a heading that repeats the story title, or a photo-credit/caption line. Everything else is UNEXPLAINED. This tool does not read `issue.json`: an UNEXPLAINED item may still be a recorded editorial rule in `receipt.json`; it is listed so a person can confirm it.
