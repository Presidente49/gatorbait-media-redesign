# QC-A: Florida 52, Ole Miss 28 (Sept. 26, 2026) fact check

Read-only QC. Live page text fetched with TinyFish fetch_content (markdown, ttl 0) at about 02:10Z on Sept. 27, 2026. No Wix, email or git actions.

## Sources

- **BOX**: `gameday/2026-09-26-ole-miss/postgame/espn-final-box.txt`
- **PBP**: `gameday/2026-09-26-ole-miss/woods-chipper/espn-pbp-extract.txt` (ESPN event 401856699 drives/plays)
- **ESPN-JSON**: scratchpad `espn-latest.txt` (pregame records: both teams 3-0, 1-0 SEC; ranks FLA 21, MISS 4; venue Ben Hill Griffin Stadium)
- **T-SUM**: http://asaptext.com/asap_media/media/1109/1358/transcripts/171203.html (Sumrall)
- **T-WOODS**: http://asaptext.com/asap_media/media/1109/1358/transcripts/171204.html (Jayden Woods)
- **ROSTER**: `gameday/2026-09-26-ole-miss/rosters-raw.json`
- **ESPN recap**: https://www.espn.com/college-football/recap/_/gameId/401856699
- **Athletic**: https://www.nytimes.com/athletic/7633535/2026/09/26/florida-ole-miss-score-result-recap/
- **CBS**: https://www.cbssports.com/college-football/news/florida-college-football-playoff-contender-ole-miss-jon-sumrall/
- **Alligator**: https://www.alligator.org/article/2026/09/florida-football-ole-miss-26
- **UAA**: https://floridagators.com/news/2026/9/26/football-quick-slant-florida-vs-ole-miss-sept-26-2026
- **Series**: https://www.winsipedia.com/florida/vs/ole-miss ; https://floridagators.com/sports/football/opponent-history/university-of-mississippi/79 (13-13-1 before this game)
- **Lacy 2025**: https://www.espn.com/college-football/game/_/gameId/401752769/florida-ole-miss ; https://fieldlevelmedia.com/ncaaf/kewan-lacy-no-7-ole-miss-run-past-florida/
- **Missouri kick**: https://floridagators.com/news/2026/9/21/football-no-21-florida-no-19-missouri-game-set-for-3-30-pm-kick-on-abc-or-espn
- **Singleton**: https://sports.yahoo.com/articles/florida-football-wr-eric-singleton-183523524.html ; https://www.on3.com/teams/florida-gators/news/final-availability-report-for-florida-gators-vs-ole-miss-rebels/

## Summary of problems

| # | Page | Sentence | Verdict | Correction / note |
|---|---|---|---|---|
| 1 | Halftime | "He is 10-of-13 for 71 yards at the half." | **WRONG** | 10-of-13 for **88** yards. PBP first-half completions: 7, 5, 14, 8, -5, 6, 8, 18, 10, 17 (the 17-yarder to J. Cook II at Q2 0:02). 71 yards is 9-of-12, before that final play. Reconciles to BOX 25/34, 298 (second half 15/21, 210). |
| 2 | Woods Chipper | "After that, he said, 'I kind of blacked out.'" | **WRONG (context)** | Woods said "I kind of blacked out after I came off the edge freeze" in an earlier answer. His strip-sack walkthrough ends "And after that, I need some time to process." The words are verbatim but "After that" puts them in the wrong place. Suggested: He said he "kind of blacked out" after coming off the edge. (T-WOODS) |
| 3 | Halftime | "Jadan Baugh, the SEC's leading rusher coming in" | **UNVERIFIABLE** | The Athletic calls him "the nation's second-leading rusher entering the week" (458 yds through 3 games per Alligator). No source found that ranks him first in the SEC entering the game. Suggested: "one of the nation's top rushers." |
| 4 | Halftime | "Ole Miss wins the toss and defers." | **UNVERIFIABLE** | PBP shows Ole Miss kicked off and received the second half, which matches either version of the coin toss. No toss record found. Low risk. |
| 5 | Halftime | "held the ball for 19:41 of the first 30 minutes" | VERIFIED (derived) | Ole Miss first-half drive time sums to 10:19 (PBP), so 30:00 - 10:19 = 19:41. Florida drive times sum to 19:28, and 13 seconds are not assigned to either team in the drive chart. Consistent with ESPN possession. |

Everything else checked is VERIFIED (details below).

## 1. Game story: /post/florida-ole-miss-final-baugh-gators-run-over-rebels

| Claim | Verdict | Source |
|---|---|---|
| No. 21 Florida 52, No. 4 Ole Miss 28, Saturday, Ben Hill Griffin Stadium | VERIFIED | BOX; ESPN-JSON ranks/venue |
| Baugh 142 yds, 3 TD | VERIFIED | BOX |
| TDs on first five second-half possessions | VERIFIED | PBP D13, D15, D17, D19, D21 all TD |
| Florida 4-0, 2-0 SEC; Ole Miss 3-1 | VERIFIED | ESPN-JSON pregame 3-0/1-0 both; ESPN recap |
| Series now 14-13-1 Florida | VERIFIED | Series links (13-13-1 before the game) |
| Ole Miss down 17-6 at half; 5 plays, 1:53, 80 yds; Chambliss 8-yd TD run; 2-pt pass to Horatio Fields; 17-14 | VERIFIED | PBP D12; BOX L7; ROSTER (Horatio Fields) |
| Florida answered in 4 plays; Montgomery 41-yd KR; Duke Clark 45-yd TD; 24-14 | VERIFIED | PBP D13 |
| 14-play, 74-yd drive; Chambliss 10-yd TD; 24-21 | VERIFIED | PBP D14 |
| Montgomery 74-yd KR to Ole Miss 26; three plays later Philo 1-yd TD | VERIFIED | PBP D15 |
| Florida never led by fewer than 10 again | VERIFIED | Later margins: 31-21, 38-21, 38-28, 45-28, 52-28 |
| 302 rushing yds on 53 carries; 36:59 possession | VERIFIED | BOX |
| Baugh 29 carries, TD runs of 4, 2, 2 | VERIFIED | BOX; scoring plays |
| Clark 126 on 12; both over 100 | VERIFIED | BOX |
| WR Dallas Wilson 6-yd TD run | VERIFIED | BOX; ROSTER (WR) |
| Philo 16/23, 196; 5-yd TD pass to TE Amir Jackson; rushing TD | VERIFIED | BOX; ROSTER (TE) |
| Singleton was a game-time decision on the SEC availability report, played, and had a 38-yd catch | VERIFIED | BOX; T-SUM "true game-time decision"; Singleton links. The final report listed him "questionable". |
| No Florida turnovers | VERIFIED | BOX |
| Lacy was ruled out | VERIFIED | ESPN recap (shoulder); Athletic |
| Lacy had 224 yds and 3 TD in Ole Miss' 34-24 win last November | VERIFIED | Lacy 2025 links (Nov. 15, 2025) |
| Ole Miss ran for 128 | VERIFIED | BOX |
| Chambliss 298 passing yds and 1 passing TD, plus 2 rushing TD; Alexander 7-134 | VERIFIED | BOX |
| Ole Miss at FLA 40 late in Q3; Woods sack, fumble, Graham recovery | VERIFIED | PBP D16 (Q3 2:47) |
| 57-yd drive; Wilson TD; 38-21 | VERIFIED | PBP D17 |
| 38-28 on Chambliss 2-yd TD pass to Alexander; Philo-Jackson TD pushed lead back to 17 | VERIFIED | Scoring plays |
| Coleman INT at FLA 5 | VERIFIED | PBP D22 |
| Chiles stuffed JT Lindsey on 4th-and-1 in Q1, then Durkin 49-yd FG | VERIFIED | PBP D1-D2 |
| Baugh scored twice before half; Ole Miss had only two Carneiro FGs in first half | VERIFIED | Scoring plays |
| BTN 302 / 53 / 498 | VERIFIED | BOX |
| BTN 268 = 142 + 126 | VERIFIED | BOX |
| BTN 35 second-half points | VERIFIED | 52 - 17 |
| BTN 6 rushing TD (Baugh 3, Clark, Philo, Wilson) | VERIFIED | BOX |
| BTN 0 FLA turnovers; Ole Miss 1 fumble lost, 1 INT | VERIFIED | BOX |
| BTN 36:59, 13:58 more than Ole Miss | VERIFIED | 36:59 - 23:01 = 13:58 |
| BTN 6 of 10 third down; Ole Miss 4 of 11 | VERIFIED | BOX |
| BTN 14-13-1 | VERIFIED | Series links |
| BTN 2020 was the last top-five win before Saturday, per The Alligator and CBS Sports | VERIFIED | Alligator ("first against a top-five-ranked team since it beat then-No. 5 Georgia in 2020"); CBS; Athletic. WRUF's "since 2018 LSU" headline is wrong. The reporter's "2015" in T-WOODS refers to a home top-five win and the highest-ranked opponent beaten (UAA, Alligator). |
| Sold-out crowd | VERIFIED | UAA ("sellout crowd") |
| At Missouri, Sat., Oct. 3, 3:30 p.m. ET | VERIFIED | Missouri kick link; Alligator |

## 2. Halftime: /post/florida-ole-miss-halftime-baugh-gators-lead

| Claim | Verdict | Source |
|---|---|---|
| Florida leads No. 4 Ole Miss 17-6 at half; No. 21 Florida | VERIFIED | BOX linescore |
| Baugh the SEC's leading rusher coming in | **UNVERIFIABLE** | See problem 3 |
| 65-yd opening drive, 4-yd TD; 2-yd TD capping a 15-play, 87-yd drive late in Q2 | VERIFIED | PBP D0, D8 |
| Baugh 83 yds on 17 carries | VERIFIED | PBP first-half carries: 5 for 42, 4 for 21, 6 for 21, 2 for -1 |
| Florida 133 rush yds at 4.9 per carry | VERIFIED | PBP: 27 first-half carries for 133 |
| 19:41 possession | VERIFIED (derived) | See problem 5 |
| Durkin 49 made it 10-0 in Q1 after Chiles' 4th-and-1 stop | VERIFIED | PBP D1-D2 |
| Carneiro 36, then 46 with 1:11 left | VERIFIED | Scoring plays |
| Chambliss 11-yd run midway through Q1, went down, walked off, Ole Miss punted next play, he was back for the next drive | VERIFIED | PBP D3 (Q1 6:51, punt next snap), D5; Alligator; ESPN recap (thigh) |
| Chambliss 10-of-13 for 71 at half | **WRONG** | 10-of-13 for 88. See problem 1 |
| Safety Joenel Aguero was flagged for targeting and disqualified; the play left Stockton down | VERIFIED | PBP D8; Alligator; T-SUM; ROSTER (Joenel Aguero, S) |
| TJ Abrams' 15-yd catch plus the penalty gave first-and-goal at the 5; Baugh scored two plays later | VERIFIED | PBP D8 |
| Vernell Brown III's 67-yd TD was wiped out by holding; delay of game; punt | VERIFIED | PBP D6 |
| 4th-and-2 from Ole Miss 19 in Q1; Philo to Amir Jackson incomplete | VERIFIED | PBP D4 |
| Ole Miss gets the ball to open the second half | VERIFIED | PBP D12 |
| 30 minutes from 4-0 for the first time since 2019 | VERIFIED | ESPN recap |
| Timeline: Ole Miss wins toss and defers | **UNVERIFIABLE** | See problem 4 |
| Timeline: J'Vari Flowers 23-yd opening return to FLA 35 | VERIFIED | PBP D0 |
| Timeline 10:53: 8-play, 65-yd drive; Baugh 12 and 23; Philo 13-yd pass to Luke Harpring | VERIFIED | PBP D0 |
| Timeline 9:16: Chiles, 4-yd loss, forced fumble recovered by Lindsey, FLA ball at Ole Miss 31 | VERIFIED | PBP D1 |
| Timeline 9:00 FG; 6:51 Chambliss; 0:47 4th-and-2 | VERIFIED | PBP (play-start clocks 09:00, 06:51, 00:47) |
| Timeline 12:50: 67-yd TD nullified by holding on Bailey Stockton; delay of game; punt | VERIFIED | PBP D6 |
| Timeline 10:13: KCI on Lagonza Hayward, ball at FLA 48; facemask on Jeramiah McCloud, 15 yds; 10-3 | VERIFIED | PBP D6-D7; ROSTER spellings |
| Timeline 3:52: 3rd-and-8 pass deflected and caught by Abrams, 15 yds; Aguero targeting; Stockton shaken up | VERIFIED | PBP (play-start clock 03:52); Alligator/UAA (ball ricocheted off the hit) |
| Timeline 2:51: 15 plays, 87 yds, 7:17; 17-3 | VERIFIED | PBP D8 |
| Timeline 1:11: Carneiro 46 after Chambliss completions of 18 and 10 to Deuce Alexander | VERIFIED | PBP D9 |
| Timeline 0:29: Alec Clark 70-yd punt out of bounds at Ole Miss 2 | VERIFIED | PBP D10 (play-start clock 00:29) |
| Photo caption: Sept. 19 game at Auburn | VERIFIED | Gators Wire/Yahoo (Auburn, Sept. 19, 2026) |
| FINAL 52-28 banner | VERIFIED | BOX |

## 3. Woods Chipper: /post/woods-chipper-florida-defense-special-teams-ole-miss

| Claim | Verdict | Source |
|---|---|---|
| Baugh and Clark each over 100 | VERIFIED | BOX |
| 31 of 52 points came on possessions that started after a 4th-down stop, a takeaway or a long return | VERIFIED (GatorBait calc) | PBP: D2 FG 3 + D13 7 + D15 7 + D17 7 + D21 7 = 31 |
| Florida 0 turnovers; Ole Miss 2 | VERIFIED | BOX |
| Sumrall: "There's a handful of plays that swing it. And we made a lot of those critical plays tonight." | VERIFIED verbatim | T-SUM |
| Florida led 31-21; Ole Miss at FLA 40; 1st-and-10, 2:47 left in Q3; sack for a 3-yd loss; Graham recovered at FLA 43 | VERIFIED | PBP D16 |
| 57 yds, 7 plays; Wilson 6-yd TD early in Q4; 38-21 | VERIFIED | PBP D17 |
| Woods strip-sack walkthrough quote | VERIFIED verbatim | T-WOODS |
| "After that, he said, 'I kind of blacked out.'" | **WRONG (context)** | See problem 2 |
| Woods: "Our offense was doing their thing all night. So I don't want to credit it to just one play, but it was good to give the ball back to our offense," | VERIFIED verbatim | T-WOODS |
| 4th-and-1 on Ole Miss' opening possession, at its own 35; Chiles, 4-yd loss; Lindsey fumbled and recovered; FLA ball at Ole Miss 31 | VERIFIED | PBP D1 |
| Three plays later, Durkin 49-yd FG, 10-0 | VERIFIED | PBP D2 |
| Sumrall: "I think that just ignited the stadium" / "And unbelievable effort by our guys, Aaron Chiles and those guys that came in to make that stop." | VERIFIED verbatim | T-SUM |
| No Ole Miss TD in first half; two Carneiro FGs | VERIFIED | Scoring plays |
| Ole Miss 0-for-5 on third down before half; 4-of-11 final | VERIFIED | PBP (3rd downs in D1, D3, D5, D7, D9 all failed); BOX |
| Woods: "a bend but don't break mentality" | VERIFIED verbatim | T-WOODS |
| 8-yd TD run and 2-pt pass, 17-14, early Q3; Montgomery 41 to FLA 41; four plays later Clark 45-yd TD | VERIFIED | PBP D12-D13 |
| 10-yd TD, 24-21; Montgomery 74 to Ole Miss 26; three plays later Philo 1-yd TD | VERIFIED | PBP D14-D15 |
| Montgomery 3 KR, 128 yds | VERIFIED | BOX |
| Sumrall: "The first kickoff return that we did bring out wasn't a great one. But the next two were huge plays." | VERIFIED verbatim | T-SUM (the original begins "You know, the first...") |
| Sumrall: "I think we won the special teams battle" / "You could tell that we put a lot of emphasis on it." | VERIFIED verbatim | T-SUM |
| Stockton took "a pretty significant shot to his back" on the targeting play | VERIFIED | T-SUM ("on the shot, on the targeting call") |
| Stockton 25-yd punt return to Ole Miss 44 midway through Q4; holding moved the start to FLA 37; 63 yds, 8 plays; Baugh's third TD; 52-28 | VERIFIED | PBP D20-D21. The box credits the return as 16 yards (to the foul spot); 25 is the PBP play description. |
| Sumrall: "To go out and make the play he did was very impressive" | VERIFIED verbatim | T-SUM |
| Alec Clark 2 punts, 113 yds; 70-yarder out of bounds at Ole Miss 2 | VERIFIED | BOX; PBP D10 |
| Staff hoped to force a fair catch and try a fair-catch kick | VERIFIED | T-SUM |
| Coleman INT: Ole Miss at FLA 22 with 2:36 left, picked at FLA 5 | VERIFIED | PBP D22 |
| Florida 4-0, 2-0 SEC; at Missouri, Sat., Oct. 3, 3:30 p.m. ET, Columbia | VERIFIED | ESPN recap; Missouri kick link |

## 4. Homepage band (as verified live at 02:05Z)

| Claim | Verdict | Source |
|---|---|---|
| Florida No. 21, 4-0; Ole Miss No. 4, 3-1; 52-28 | VERIFIED | ESPN-JSON; ESPN recap |
| "4-0 and a first top-five win since 2020. Next: at Missouri, Oct. 3." | VERIFIED | Alligator; CBS; Athletic; Missouri kick link |
| "Florida ran for 302 yards with zero turnovers." | VERIFIED | BOX |
| "Woods' strip-sack and Coleman's interception stopped two drives." | VERIFIED | PBP D16, D22 |
| Total yards 426/498; Rushing 128/302; 3rd down 4-11/6-10; Turnovers 2/0; Possession 23:01/36:59 | VERIFIED | BOX |
| Baugh 29-142, 3 TD; Clark 12-126, TD; Philo 16/23, 196, TD; Montgomery 3 KR, 128 yds | VERIFIED | BOX |

## Name spellings

Checked against ROSTER, all correct: Jayden Woods, Vernell Brown III, Lagonza Hayward, Eric Singleton Jr., Bailey Stockton, TJ Abrams, Myles Graham, J'Vari Flowers, Dallas Wilson, Amir Jackson, Aaron Chiles, Aaron Philo, Jadan Baugh, Luke Harpring, Duke Clark, London Montgomery, DJ Coleman, Alec Clark, Jeramiah McCloud, Patrick Durkin; Deuce Alexander, Kewan Lacy, Trinidad Chambliss, Joenel Aguero, Horatio Fields, Lucas Carneiro, JT Lindsey. (UAA's "Joenell Aguero" is UAA's typo. The roster spelling is Joenel, which GatorBait uses.)
