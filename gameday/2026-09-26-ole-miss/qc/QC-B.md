# QC-B: fact-check of live GatorBait Ole Miss game-day stories

Worker: Claude (read-only QC). Run: 2026-09-27 ~02:20 UTC. Live text fetched with TinyFish fetch_content (markdown, ttl 0).
Status labels: VERIFIED / WRONG / UNVERIFIABLE. No Wix, email or repo changes were made. The only file written is this one.

## Sources used
- ASAP transcripts: asaptext.com/.../1109/1358/transcripts/171203.html (Sumrall), 171204 (Jayden Woods), 171205 (Baugh), 171206 (Philo)
- ESPN final box: gameday/2026-09-26-ole-miss/postgame/espn-final-box.txt, plus a fresh ESPN summary with drives and plays (event 401856699, status Final: FLA 498 yds and 302 rush; MISS 426 yds)
- Rosters: gameday/2026-09-26-ole-miss/rosters-raw.json (FloridaGators.com / OleMissSports.com)
- AP recap on ESPN: espn.com/college-football/story/_/id/50037502
- Others are cited inline.

Note: the first fetch of the Lacy story returned a cached older version with the "Not Expected to Play" headline. A cache-busted fetch (`?qc=2`) returned the current "Ruled Out" version, and that version is the one checked below.

---

## 1. Presser: /post/sumrall-postgame-press-conference-ole-miss-not-fully-awake

| Claim | Status | Source / note |
|---|---|---|
| "Sumrall said he barely had a voice left" | UNVERIFIABLE | Not in the ASAP transcript. It may be in the video, but I did not check the video. |
| "We have not arrived ... outcomes that we have coming up." | VERIFIED | 171203. Two sentences are joined with a comma, and the wording is intact. |
| "It's not asleep, but it ain't fully awake yet" / "I promise you, I didn't come here for us to be average." | VERIFIED | 171203 has "It's not sleep". AP also heard "not asleep". |
| Said during the week that Ole Miss had proven more | VERIFIED | 171203: "they had proven more to date than we had" |
| "I think they're still pretty smart. We just played better today." / 16-2 over the past year / "I don't bet, but if I did, I would never bet against him." | VERIFIED | 171203 |
| Kept Chambliss off balance; "kicked my butt as a head coach twice last year" | VERIFIED | 171203 |
| Chambliss threw for 298 yds and ran for 2 TDs; sacked and stripped late 3Q; intercepted in 4Q | VERIFIED | Box, PBP (3Q 2:47 strip-sack; 4Q 2:36 INT) |
| Baugh 142 yds, 3 TD, 29 carries | VERIFIED | Box |
| Missed a hole on an early drive that could have been a TD | VERIFIED | 171205 |
| Baugh quotes ("Our confidence is high ... honestly." / "no defense in the country could stop us ..." / "trying to put up 70, trying to put up 60") | VERIFIED | 171205 |
| Clark 126 yds on 12 carries; 45-yd TD put Florida back up 10 in 3Q (24-14) | VERIFIED | Box, scoring plays |
| "I thought Duke played out of his mind ... as good as he chooses to be." | VERIFIED | 171203 |
| Livid about the previous play, broke his headset, replacement clicked on in time; "It's worth losing a headset over" | VERIFIED | 171203 |
| Baugh calls Clark his little brother; hands up the whole run; "I was just so proud of him" | VERIFIED | 171205 |
| Stockton: "a pretty significant shot to his back" on the targeting play; "doesn't look like anything that should keep him out long term"; returned a punt; played little in 2H | VERIFIED | 171203 |
| Vernell Brown III knee tweak late 2Q; "Nothing's substantial, nothing's torn" / "Feel pretty good ... too early to know moving forward." | VERIFIED | 171203 |
| Singleton a true game-time decision; played; 38-yd catch; barely practiced; "He's a tough dude, and a guy I'm really proud of" | VERIFIED | 171203, box. "Barely practiced" paraphrases "really didn't practice a lot". |
| Woods strip-sack late 3Q set up the TD for 38-21 | VERIFIED | PBP: sack-fumble at 3Q 2:47 recovered by Graham; Wilson TD at 4Q 13:38 made it 38-21 |
| Woods: "I kind of blacked out after I came off the edge free" | VERIFIED (minor) | 171204 reads "edge freeze". That looks like a transcription error, and "free" is the likely intended word. |
| Woods: "His eyes were downfield, and first instinct is to go for the ball." | VERIFIED | 171204 |
| "Defensively, I thought we rose up ... to be honest with you" | VERIFIED | 171203 |
| Philo on 302 rush yds: "Makes my job pretty easy ... to be honest." | VERIFIED | 171206; box shows 302 |
| "[If] we get a lot of those guys to say yes, we're going to wake the beast up real fast" | VERIFIED | 171203 ("a recruiting list that we get a lot of those guys to say yes...") |
| Cyion Smith committed hours before kickoff | VERIFIED | SI, On3 |
| At Missouri, Sat. Oct. 3, 3:30 p.m. ET | VERIFIED | floridagators.com schedule |

## 2. Carlton Reese column: /post/carlton-reese-florida-contenders-not-hopefuls-ole-miss
Only factual claims are checked here. Opinion is not.

| Claim | Status | Source / note |
|---|---|---|
| 52-28 over No. 4 Ole Miss | VERIFIED | Box |
| Baugh "carried 29 times for 142 yards" | VERIFIED | Box |
| Quote: "Our confidence is high – we feel like we left points off the board," | WRONG (misquote) | 171205: "Our confidence is high. We feel that we can put a bunch of points on the board. We feel we left points on the board, honestly." |
| Quote: "I feel that no defense can stop us from putting up points." | WRONG (misquote) | 171205: "I feel that no defense in the country could stop us from putting up points." |
| Ole Miss won an emotional game over LSU last week | VERIFIED | 32-24 (Rebel Walk, ESPN) |
| Lacy absent | VERIFIED | SEC final availability report |
| Chambliss' early injury "kept him out for a play" | UNVERIFIABLE (partly supported) | AP: he injured his left thigh on the second series and returned. PBP shows no backup QB snap. |
| "Sumrall has achieved something remarkable that Billy Napier never could. He has backed up a signature win with an even more signature win" | QUESTIONABLE / flag | Napier's 2024 team beat No. 21 LSU and then No. 9 Ole Miss in consecutive weeks (UF Baugh bio 2024 game log). The claim is arguable as written. |
| "For the second straight game ... close to 500 yards" against an SEC team | VERIFIED | 495 at Auburn (ESPN 401856687); 498 vs Ole Miss |
| "squandered opportunities early ... still led 17-3" | VERIFIED | Scoring: 17-3 at 2Q 2:51 |
| Ole Miss TD on its opening 2H drive; Florida answered with a 4-play drive after Montgomery's return to the 41; Clark 45-yd TD | VERIFIED | PBP: 41-yd return to FLA41; 4 plays, 59 yds |
| "Twice Ole Miss went for touchdowns to make it a one-score game and twice Florida answered" | VERIFIED | At 17-14 and 24-21, each answered by a TD |
| Montgomery kick return to the Ole Miss 26; Philo to TE Amir Jackson for 23 yds to the 3; Philo keeper TD | VERIFIED | PBP; roster lists Jackson as a TE |
| Woods sack, forced fumble, Myles Graham recovery; "Seven plays later" Dallas Wilson TD | VERIFIED | PBP (drive of 7 plays, 57 yds) |
| Wilson TD was "on an end-around" | UNVERIFIABLE | PBP says only "D.Wilson rush left for 6 yards". |
| Five straight TD possessions, no turnovers, no FG attempts | VERIFIED | Drive chart |
| Quote: "We are still not a finished product today," Sumrall said | WRONG (misquote) | 171203: "We still are not a finished product by any stretch of the imagination." |
| Will Muschamp devising Texas' defense | VERIFIED | Muschamp is Texas DC (texaslonghorns.com). Florida plays at Texas Oct. 17 (floridagators.com schedule). |
| Stockton, Wilson, Singleton, Brown are receivers; Amir Jackson and Luke Harpring are TEs | VERIFIED | Roster |
| "The Vegas bookmakers placed Ole Miss a 3-point underdog" | WRONG | Ole Miss was a 3.5-point underdog (Florida -3.5): Gators Wire, SportsLine, FanDuel, Yahoo, AP recap ("3 1/2-point favorites"). GatorBait's own game-day story says 3.5. |
| Sumrall "seemed aghast" at the line | VERIFIED (characterization) | "There's a lot of good drugs out there" (The Athletic, USA Today) |
| Missouri next, in Columbia | VERIFIED | Schedule |

## 3. Recruiting: /post/cyion-smith-commits-florida-gators-2028-safety

| Claim | Status | Source / note |
|---|---|---|
| Four-star S from Blountstown High; committed hours before kickoff; per Florida Gators On SI | VERIFIED | si.com/college/florida/football/2028-4-star-s-cyion-smith-commits-to-gators-during-visit-01m3fgbb6a6e |
| Second 2028 commit, joining Hollywood Chaminade-Madonna 4-star WR Armani Strong | VERIFIED | SI; On3/Gators Online |
| 6-2, 175 | VERIFIED | On3/Rivals and SI. 247 lists 6-3, 160 and ESPN lists 6-3, 175. The article matches the cited Rivals number. |
| No. 279 overall, No. 30 S, Rivals Industry Ranking | VERIFIED | on3.com/rivals/cyion-smith-242617; On3 commit story; SI |
| Quote "Home. The coaches. Player development ... for a while." | VERIFIED | Rivals (Chad Simmons) via Yahoo: sports.yahoo.com/articles/2028-4-star-safety-cyion-180907835.html |
| About four trips since the staff arrived; summer 7-on-7 when "Florida made a big move" | VERIFIED | Rivals/Yahoo |
| Collins led the recruitment; Gators Online reported near-daily talks since the May offer; Sumrall, Brad White and Dae'one Wilkins involved | VERIFIED | On3 profile ("Recruited by Chris Collins"); On3/Gators Online commit story (Blake Alderman) |
| "They really show they really want me ... I'm ready to give them all I got." | VERIFIED | Rivals/Yahoo |
| Coleman INT at the 5 with Ole Miss at the FLA 22 late 4Q; two takeaways (Woods/Graham, Coleman), zero giveaways | VERIFIED | PBP, box |
| Baugh 142 and 3 TD; Clark 126 with a 45-yd TD; TDs on first five 2H possessions; 302 rush yds | VERIFIED | Box, drives |
| 70+ prospects from 2027-29 per Florida Gators On SI | VERIFIED | SI commit story |
| Offers from Auburn, Miami, South Carolina and USF per his Rivals profile | VERIFIED | On3/Rivals profile |
| Vols Wire "reported last week" that Tennessee offered the former Mississippi State commit | VERIFIED (timing nit) | Vols Wire ran Sept. 21, 2026, which was Monday of the same week. "Earlier this week" would be more precise. |
| 4-0, 2-0 SEC; at Missouri Oct. 3, 3:30 ET | VERIFIED | floridagators.com schedule |

## 4a. Game Day: /post/game-day-swamp-ole-miss
| Claim | Status | Source |
|---|---|---|
| No. 21 FLA (3-0, 1-0) vs No. 4 MISS (3-0, 1-0), 3:30 ET, ABC, Ben Hill Griffin | VERIFIED | SI, Gators Wire |
| SEC Nation in Gainesville 9 a.m.-noon; McDonough/McElroy/George | VERIFIED | Gators Wire 9/23; floridagators.com broadcast info |
| Florida -3.5; "There's a lot of good drugs out there" | VERIFIED | Gators Wire odds; The Athletic/USA Today |
| Baugh leads SEC with 458; 8 rush TDs lead nation | VERIFIED | UF bio (1st SEC, 2nd FBS); CBS 9/22 |
| Chambliss threw for 301 yds and a TD vs Florida in 2025 | VERIFIED | AP 11/15/25 (26-35, 301, 1 TD, 1 INT) |
| Sumrall called Chambliss the best QB in CFB | VERIFIED | USA Today/Yahoo 9/21 |
| Singleton, senior, has not played this season (sprained left ankle); GTD; "feels decent" | VERIFIED | ESPN; roster (Sr.) |
| Lacy (Doak Walker finalist) out with a left shoulder injury; one of 10 out; 224 yds and 3 TD vs UF | VERIFIED | ESPN; Rebel Walk; SMU release; AP |
| First 4-0 since 2019; first 3-0 since 2019 | VERIFIED | AP recap; 171206 question |
| Correction note: Ole Miss ran for 237 | VERIFIED | secsports.com 2025 box |

## 4b. Lacy: /post/kewan-lacy-not-expected-to-play-ole-miss-florida (live "Ruled Out" version)
| Claim | Status | Source |
|---|---|---|
| Ruled out (left shoulder); downgraded to out on the final report Saturday; Golding-to-Thamel "chapel session" quote | VERIFIED | ESPN story 50032888 |
| Hurt in the 32-24 win over then-No. 7 LSU; 9 carries for 43 yds and a TD; left in 3Q; X-rays, then an MRI Sunday; questionable to doubtful Friday | VERIFIED | ESPN; Rebel Walk |
| 10 out, with the list of names (5 DBs, 2 LB, 2 OL) | VERIFIED | Rebel Walk final report |
| 2025 All-American and Doak Walker finalist; records of 306 carries, 1,567 yds, 24 TD in 15 games | VERIFIED | ESPN; SMU finalist release |
| Thigh bruise vs Louisville; 2 TDs vs Charlotte; 191 yds and 4 TD on 39 carries (4.9 avg) | VERIFIED | ESPN |
| Lindsey (#26, So., LSU transfer) 48/12; Frazier (#25, Jr., MSU transfer) 38/9; 86/21 = 4.1 | VERIFIED | ESPN; roster; math |
| Just over 20 carries per game in 2025 | VERIFIED | 306/15 = 20.4 |
| Nov. 15: 224 yds and 3 TD in the 34-24 Oxford win; broke the school single-season rush TD record | VERIFIED | AP; ESPN 401752769 |
| Singleton 58-534-3 at Auburn in 2025 | VERIFIED | ESPN |
| "If Singleton can't go, sophomore Vernell Brown III starts at Z with senior Bailey Stockton in the slot, according to On3" | UNVERIFIABLE | Source not located. Classes match the roster, and the matter is moot because Singleton played. |

## 4c. Baugh: /post/baugh-runs-the-sec
| Claim | Status | Source |
|---|---|---|
| 458 rush yds, 2nd FBS, leads SEC; 8 rush TDs lead nation | VERIFIED | UF bio; CBS; NCAA.com |
| 44-39 at Auburn: 162 yds, 3 TD, 26 carries | VERIFIED | AP; UF bio |
| Third straight game with 130+ yds and multiple rush TDs | VERIFIED | UF bio: FAU 160/3 TD, Campbell 136/2 TD, Auburn 162/3 TD |
| "and his second straight three-touchdown game" | WRONG | He had 2 TDs vs Campbell (UF bio). Auburn was his second 3-TD game of the season (after FAU), not the second in a row. |
| "The 2025 Doak Walker Award finalist" | WRONG | The 2025 finalists were Ahmad Hardy, Kewan Lacy and Jeremiyah Love (SMU release, Nov. 25, 2025). Baugh was on the 2025 and 2026 watch lists (UF bio). |
| Jersey No. 13 | VERIFIED | Roster |

## 4d. Louis Oliver: /post/louis-oliver-mr-two-bits
| Claim | Status | Source |
|---|---|---|
| Honorary Mr. Two Bits for Ole Miss | VERIFIED | floridagators.com 9/22/2026 (Chris Harry) |
| Two-time first-team All-American, two-time first-team All-SEC, two-time Academic All-American, first-round pick | VERIFIED | UF story |
| Played at Florida 1985-88 | VERIFIED (context) | UF story: walk-on true freshman in 1984, "five seasons he suited up", last home game 1988 |
| "a seven-year NFL career with the Miami Dolphins and Cincinnati Bengals", and the correction note "spent seven seasons in the NFL" | WRONG | Eight seasons, 1989-96: UF story ("played eight seasons (1989-96) in the NFL, all but one for the Miami Dolphins"); Wikipedia: MIA 1989-93, CIN 1994, MIA 1995-96 |
| Started 1949 with George Edmondson, a Tampa insurance salesman, nearly 60 years | VERIFIED | Wikipedia; UF |
| "Since 2009, students and famous alumni have taken over the role" | UNVERIFIABLE / conflicting | UF (Chris Harry): the ceremonial Mr. Two Bits tradition "began in 2013". Wikipedia says guests started in 2009 in one line and the celebrity guest started in 2013 in another. Suggest "Since 2013" per UF. |
| "A series tied 13-13-2", and the correction note "the series is tied 13-13-2" | WRONG | Entering the game the series was tied 13-13-1 (Ole Miss Athletics 9/25/2026; Winsipedia). After Saturday, Florida leads 14-13-1 (floridagators.com opponent history). |
| First 4-0 since 2019 on the line | VERIFIED | AP |
