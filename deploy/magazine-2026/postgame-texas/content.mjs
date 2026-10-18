// Postgame Edition content: Florida 27, No. 7 Texas 24 (Oct. 17, 2026, Austin).
// Every number is ESPN event 401856724 unless a column or the desk story says otherwise (see SOURCES in README.md).
// Straight quotes are fine in strings written here; the builder turns them into curly quotes. Column text already carries curly quotes.

export const ISSUE = {
  number: 'Postgame Edition',
  name: 'Florida 27, No. 7 Texas 24',
  date: 'Sunday, October 18, 2026',
  footer: 'GatorBait Magazine · Postgame Edition · Oct. 18, 2026',
  credit: 'Photo courtesy UAA and Hannah White',
};

// ---- Game story (the desk's published postgame story, Wix post fc2ce412, with ESPN times/figures) ----
export const STORY = {
  kicker: 'The game · Austin',
  title: 'Gators stun No. 7 Texas 27-24 in Austin behind Jones Jr.',
  by: 'By the GatorBait Media Desk',
  date: 'Oct. 17, 2026',
  pull: 'They executed with more detail, more urgency, more violence, more strength.',
  pullCite: 'Jon Sumrall, postgame press conference, as reported by Franz Beard',
  photo: { file: 'scramble.jpg', cap: 'Florida quarterback Tramell Jones Jr. (No. 9) scrambles against Texas in Austin, Oct. 17, 2026.' },
  paras: [
    'AUSTIN, Texas — Florida walked into Darrell K. Royal–Texas Memorial Stadium on Saturday with a backup quarterback making his first career start, fell behind 17-3, and walked out with the win of its season. The Gators (5-2, 3-2 SEC) scored 24 straight points and held on to beat No. 7 Texas 27-24, sealed in the final two minutes when Myles Graham sacked Arch Manning and knocked the ball loose, and Kanye Clark fell on it at the Texas 39. Tramell Jones Jr. got the start with Aaron Philo out.',
    'His moment came just before halftime. Down 17-3 after a 63-yard punt-return touchdown by Ryan Niblett, Jones converted a fourth-and-12 to Dallas Wilson, added a 14-yard keeper, and found Lacota Dippre for a 7-yard touchdown with 18 seconds left in the half. Florida went to the locker room down 17-10 instead of buried.',
    'The second half belonged to the Gators. Jones hit Dippre again from 8 yards out to tie it at 17, finishing a 15-play, 69-yard drive. While the offense ground Texas down, the defense shut the Longhorns out in the third quarter. Texas managed just 8 total yards in the period.',
    'Patrick Durkin’s 28-yard field goal with 10:40 to play gave Florida its first lead, 20-17. Then Jadan Baugh delivered the haymaker: an 11-yard touchdown run with 6:22 left that made it 27-17. Baugh finished with 25 carries for 91 yards, and Durkin was perfect on the day, hitting from 45 and 28 and going 3-for-3 on extra points.',
    'Texas made it interesting late. Manning converted a fourth-and-6 with a 62-yard completion and found Cam Coleman for a 9-yard touchdown with 4:21 remaining to cut it to 27-24. The Longhorns got the ball back with a chance to tie or win. That is when Graham ended it. On second down with 1:58 to play, he got to Manning for a 9-yard sack and stripped the ball. Clark’s recovery let Florida run out the clock on the road.',
    'The numbers matched the scoreboard. Florida outgained Texas 313 yards to 272, converted 8 of 19 third downs to the Longhorns’ 2 of 10, never turned the ball over and held it for 38:11 to Texas’ 21:49. Dippre caught both of Jones’s touchdown passes. Florida moves to 5-2 (3-2 SEC); Texas drops to 4-2 (1-2 SEC). Attendance was 103,989.',
  ],
  source: 'Sources: ESPN game summary (event 401856724); GatorBait Media Desk postgame story, Oct. 17; Franz Beard (Sumrall quote). Time of Graham’s sack and Texas’ third-quarter yardage are from the desk story.',
};

// ---- Scoring by quarter (ESPN) ----
export const LINE = {
  rows: [
    { team: 'Florida', q: [0, 10, 7, 10], f: 27, rec: '5-2 (3-2 SEC)' },
    { team: 'No. 7 Texas', q: [10, 7, 0, 7], f: 24, rec: '4-2 (1-2 SEC)' },
  ],
};

export const TIMELINE = [
  { when: 'Q1', play: 'Texas scores on its first two drives, a touchdown and a field goal', score: 'TEX 10, UF 0', src: 'Beard' },
  { when: 'Q2', play: 'Patrick Durkin 45-yard field goal', score: 'TEX 10, UF 3', src: 'ESPN (only 45-yarder of the day)' },
  { when: 'Q2 11:27', play: 'Ryan Niblett 63-yard punt-return touchdown', score: 'TEX 17, UF 3', src: 'ESPN, time per Beard' },
  { when: 'Q2 0:18', play: 'Tramell Jones Jr. to Lacota Dippre, 7 yards', score: 'TEX 17, UF 10', src: 'ESPN', run: true },
  { when: 'Q3 6:50', play: 'Jones to Dippre, 8 yards', score: 'TIED 17-17', src: 'ESPN', run: true },
  { when: 'Q4 10:40', play: 'Durkin 28-yard field goal', score: 'UF 20, TEX 17', src: 'ESPN', run: true },
  { when: 'Q4 6:22', play: 'Jadan Baugh 11-yard run', score: 'UF 27, TEX 17', src: 'ESPN', run: true },
  { when: 'Q4 4:21', play: 'Arch Manning to Cam Coleman, 9 yards', score: 'UF 27, TEX 24', src: 'ESPN' },
  { when: 'Q4 1:58', play: 'Myles Graham sacks Manning, forces fumble; Kanye Clark recovers at the Texas 39', score: 'Final: UF 27, TEX 24', src: 'Desk story' },
];

export const TILES = [
  { v: '24-0', l: 'Florida’s run', n: 'Florida scored 24 straight after trailing 17-3, from Dippre’s 7-yard catch to Baugh’s 11-yard run.' },
  { v: '0', l: 'Florida turnovers', n: 'Texas lost one: Manning’s fumble.' },
  { v: '38:11', l: 'Time of possession', n: 'Texas held it for 21:49.' },
];

// ---- Box score (ESPN) ----
export const TEAMSTATS = [
  ['First downs', '21', '13'],
  ['Total yards', '313', '272'],
  ['Passing', '155 (22-of-35)', '173 (14-of-20)'],
  ['Rushing', '158 (46 carries)', '99 (30 carries)'],
  ['Third down', '8-of-19', '2-of-10'],
  ['Fourth down', '2-of-2', '1-of-3'],
  ['Penalties', '7-55', '1-15'],
  ['Turnovers', '0', '1 (Manning fumble lost)'],
  ['Possession', '38:11', '21:49'],
];
export const LEADERS = {
  Florida: [
    ['Passing', 'Tramell Jones Jr.: 22-of-35, 155 yards, 2 TD, 0 INT'],
    ['Rushing', 'Jadan Baugh: 25 carries, 91 yards, 1 TD. Jones: 10 carries, 41 yards'],
    ['Receiving', 'Eric Singleton Jr.: 7 catches, 43 yards. Lacota Dippre: 2 catches, 15 yards, 2 TD'],
    ['Kicking', 'Patrick Durkin: 2-of-2 on field goals (45, 28), 3-of-3 on extra points'],
    ['Punting', 'Alec Clark: 6 punts, 51.8 average'],
    ['Defense', 'Myles Graham: 7 tackles. LJ McCray: 4 tackles, 1.5 sacks'],
  ],
  Texas: [
    ['Passing', 'Arch Manning: 14-of-20, 173 yards, 1 TD, 1 fumble lost'],
    ['Rushing', 'Raleek Brown: 8 carries, 47 yards, 1 TD. Hollywood Smothers: 12 carries, 52 yards'],
    ['Receiving', 'Emmett Mosley V: 2 catches, 76 yards. Cam Coleman: 1 TD catch'],
    ['Returns', 'Ryan Niblett: 63-yard punt-return TD'],
    ['Defense', 'Justin Cryer: 11 tackles'],
  ],
};

// ---- Franz Beard column, as published (Wix post c16d53be), with ESPN overrides noted in the README ----
export const FRANZ = {
  kicker: 'Columnist · Franz Beard',
  title: 'It was a good day for an exorcism in Austin',
  by: 'By Franz Beard',
  date: 'Oct. 17, 2026',
  pull: 'Make no mistake about it, this was a total team win.',
  photo: { file: 'defense.jpg', cap: 'Florida defenders gang-tackle a Texas ballcarrier in Austin.' },
  epigraph: '“What an excellent day for an exorcism.” – Linda Blair as Regan MacNeil in the 1973 film “The Exorcist”',
  paras: [
    'Perhaps there is a better explanation for the supernatural event that took place at Darrell K. Royal Stadium in Austin, Texas Saturday afternoon, but for the moment, it does indeed seem as if an exorcism took place either in the Florida locker room or on the sidelines. What other rationale is there? Those same Florida Gators whose defense spent the first six weeks of the season doing a dandy impersonation of a demon-possessed unit channeled their inner Doomsday, haunting Arch Manning into a game he will never forget.',
    'Other than the first two drives of the first quarter that produced a TD and a field goal and a desperation heave late in the fourth quarter that led to a touchdown that gave the game a white knuckles feel to it, the heir to the Manning throne was turned into a very ordinary quarterback. The Gators harassed Manning into poor decisions, a few bad throws and a lost fumble just when 7th-ranked Texas was in dire need of a play to fend off an upset of major proportions.',
    'Florida 27, Texas 24. How in the name of all that is sacred did the Gators manage to pull that off? How did a defense that ranked dead last in the SEC and 110th in the nation sack the heir to the fabled Manning throne five times? How did those same guys from that same defense that both Missouri and South Carolina toyed with find the fire, the passion and intensity to leave the Texas O-line in a side of the road heap gasping for air?',
    '“You know what our guys did?” Sumrall asked in the post game press conference. “They executed with more detail, more urgency, more violence, more strength. They finally took it upon themselves to play with that mentality.”',
    'And since the defense was so busy re-discovering the age-old principle of beating the other team silly, Florida’s offensive line remembered its party invitations and showed up. A little late, mind you, since they spent the first quarter whiffing and flinching away, but it was timely when they, also, cast out the demons of the past two weeks helping Tramell Jones Jr. become the first Florida quarterback to win his first start on the road against a ranked team since Jesse Palmer got a notch in his belt against 6th-ranked Auburn way back in 1997.',
    'Jones played turnover free, completed 22 of his 35 passes for 155 yards and found tight end Lacota Dippre in the end zone twice for touchdowns. That vaunted Texas defense, coached up by Will Muschamp and led by national sack leader Colin Simmons, managed only one sack on Jones, so elusive in the pocket that he must have been coated with Teflon. Like the defense on those first two Texas drives and the offensive line that didn’t figure things out until the final two drives of the first quarter, Jones played like you expect a quarterback who hasn’t started a football game in two years and the O-line was busy absorbing blows from that monstrous Texas front four rather than deliver the punishment.',
    'Following a 63-yard punt return for a touchdown by All-American Ryan Niblett that gave the Longhorns a commanding 17-3 lead with 11:27 left in the first half, a jolt of lightning must have struck Jones and the Florida O-line. From that point onward, Jones was lucid, poised, decisive and in complete command of a risk-avoidance offensive game plan dialed up by Buster Faulkner. Jones spent most of the day finding open receivers for short throws, but when the Gators faced a fourth-and-12 at the Texas 36 with less than a minute to go in the first half, he delivered a 17-yard strike that Dallas Wilson caught and got both feet inbounds going against Bo Mascoe, the Longhorns’ best cover corner. On the next play after that fourth down reprieve, Jones showed his wheels with a decisive 14-yard run. Two plays later he connected with Dippre on a 7-yard pass for a touchdown that cut the deficit to 17-10 with 18 seconds remaining in the half.',
    'The touchdown drive to end the first half and the 15-play, 69-yard drive for a TD to start the second half were defining moments for Jones. In the first quarter he was tentative, choosing the easy throw even when there was an open receiver farther downfield. The final drive of the first half changed the entire complexion of the game. Working with a short field after Ty Jackson decleated Hollywood Smothers on a fourth-and-one, Jones took the Gators down the field 49 yards to a touchdown on nine plays, scoring on the pass to Dippre.',
    'That TD drive was huge from a psychological point of view since going from down 17-3 to within a touchdown at the half took the air out of the Longhorn faithful. To start the second half, the Gators drove methodically, taking 8:03 off the clock. Two possessions later, Jones led the Gators on another time-consuming drive, this one 14 plays for 57 yards that ate up 6:31 of clock time while carrying over into the fourth quarter, ending with a 28-yard field goal by Patrick Durkin that gave UF the lead for good.',
    '“I think he [Jones] started to do some things simple, better in the second half and just take what’s there,” Sumrall said. “Don’t have to do anything crazy, put the ball in play, give guys opportunities and get the ball in the hands of our playmakers.”',
    'By playing turnover free and putting the Gators in plus situations on second and third downs, it backed the Texas safeties out of the box which opened up the running game for Jadan Baugh. Held to just 72 yards combined in the losses to Missouri and South Carolina, Baugh carried 25 times for 91 yards, scoring what proved to be the game-winning touchdown on an 11-yard sweep around the right side with 6:22 left in the game. On the drive, Baugh also had a 13-yard run in which he juked a couple of defenders then ran over two more before he hit the ground.',
    'It was vintage Baugh and in large part, a statement by the O-line, whose first quarter performance was far too reminiscent of the previous two weeks. In the first quarter, the O-line struggled against the Longhorns’ space eaters up front, but they went beast mode, particularly in the third and fourth quarters. In the second half, the Gators had perfect balance, 85 yards on the ground, 85 through the air.',
    '“It’s a whole lot easier to play quarterback when the O-line plays good,” Sumrall said. “And so, no matter who’s the quarterback for us, when the O-line plays better, it’s a lot easier to play quarterback and the last couple weeks, no secret, we haven’t played very good on the O-line. This week, we played better on the O-line, so it made everything tick. Just a little bit cleaner on third down as well. We also ended up in less what felt like third and crazy extra longs today. At times where in the past, I don’t have all the stats in front of me, but last week I felt like every time we looked up it was third and 12.”',
    'The long drives by the offense allowed a rested defense to dominate the second half. A 62-yard Manning to Emmett Mosley V that set up the only Texas score of the second half, accounting for all but 26 of the Longhorns’ second half yards. Florida held the ball for 46 second half plays while Texas only managed 19 snaps after the halftime break.',
    'When Texas cut the Florida lead to 27-24 and then forced a punt, the Longhorn faithful envisioned another come-from-behind win like the one against Ohio State in game two, but on second down at the Texas 48, the Gators brought the house with Myles Graham sacking Manning and forcing a fumble that Kanye Clark recovered at the UT 39. Texas still had three time outs remaining, but on third down Jones sprinted nine yards for a first down at the Texas 27, effectively ending any chance the Longhorns had of a comeback win.',
    'Three kneels from a victory formation by Jones and it was over, Florida’s first win on the road against a ranked opponent since the Gators beat then No. 6 Florida State in Tallahassee.',
    'Make no mistake about it, this was a total team win, but considering the way the defense had played in the previous six games, their effort paved the way for the upset. Texas scored only two offensive touchdowns and managed just 272 total yards. The Gators controlled the football for 38:11 of the 60 minutes. Besides getting sacked five times for -29 yards and fumbling the ball way at the most inopportune moment, Manning was just 14-20 passing for 173 yards. Take away the one big play and he was 13-19 for 111, a miserable 5.84 per attempt.',
    'The win revived hope among a Florida fan base that viewed the second half of the season with serious trepidation. Losing two straight will do that for you. Giving up 84 points points a lot of fingers at the defense but this was their game to shine. Getting a win on the road with the backup QB getting his first collegiate start was also an emotional lift, although Sumrall once again reiterated that he believes the Gators will win games whether it’s Tramell Jones or Aaron Philo at quarterback.',
    'What he doesn’t want is for his team to lose focus just because they just beat a team that two weeks ago was ranked No. 1 nationally.',
    '“We got better today,” Sumrall said, putting it in perspective. “I think if we’ve learned anything about this in this game or in life, you don’t get to go, yeah, it was good last week, so I get to be good next week, right? I guess part of why we got our ass kicked in Missouri and last week at home is because everybody around Gainesville was patting our guys in the back telling them how good they were. And I’m like, guys, we suck. I think I’ve watched this practice. We’re not very good. We still suck. We just suck less. So we have to figure out how to suck less each week. But we’re not like a complete team yet.”',
  ],
  note: 'Column as published by GatorBait Media (Wix post c16d53be). Sumrall quotes are from his postgame press conference as Franz Beard filed them. Print edition conforms three figures to ESPN: the halftime score was 17-10 (Florida was tied at 17 in the third quarter, not at the half), and Emmett Mosley V is spelled as ESPN lists it.',
};

// ---- Loren Meadows, Postgame Thoughts (published Wix post bba317f0, Oct. 18). Text as published, after copy-desk fixes. ----
export const LOREN = {
  kicker: 'Analyst · Loren Meadows',
  title: 'Postgame Thoughts: Florida (5-2, 3-2) v. Texas (4-2, 1-2)',
  by: 'By Loren Meadows',
  date: 'Oct. 18, 2026',
  pull: 'Football matters again at Florida.',
  note: 'As published by GatorBait Media (Wix post bba317f0). Copy-desk fixes: Brendan Bett, Lacota Dippre, Jadan Baugh per ESPN; Wingo and Coleman combined line corrected to 6 catches for 48 yards per the ESPN box score. Not verified: Simmons/Sellers 619 yards and 6 TD, Texas defense ranked 3rd in the SEC, "162 over the past two contests".',
  blocks: [
  [
    "p",
    "Florida finds a way to get out of Austin with a win on a day where they continue to find more about themselves every day."
  ],
  [
    "h",
    "What We Thought"
  ],
  [
    "p",
    "All week pundits, colleagues, and casual fans alike searched for answers and gave opinions on what had happened to Jon Sumrall and the Gators the past two weeks. With the trip to Austin looming and the Gators looking its worst in all three phases, there was no reason to think that there would not be a third straight loss for the Gators."
  ],
  [
    "p",
    "Arch Manning had been up and down all season with most of his highlights coming on a fourth quarter 21-point comeback against Ohio State. A preseason Heisman campaign had all but fallen off with late game heartbreak two late interceptions that doomed Texas in the Red River Rivalry. Unfortunately the Gator defense had been the perfect cocktail for teams coming off of tough losses the previous week. Florida was last in the SEC in pass defense and surrendering 268 yards per game. In the last two games Austin Simmons and Lenoris Sellers had bludgeoned the Gators for 619 yards and 6 touchdowns through the air. Sellers who had struggled most of the season was as elusive and dynamic as he had been all season and rediscovered himself at the hands of the Florida defense."
  ],
  [
    "p",
    "Offensively, a running game that had Jadan Baugh headed to New York had struggled to find any footing the last two weeks and had everyone questioning Buster Faulkner’s playcalling and if Aaron Philo was the quarterback to help “wake the beast up”. The offensive line seemed to catch the most strays as a unit that was the darlings of college football after Ole Miss had many questioning the makeup of this unit as they mustered just 162 over the past two contests. Factor in a Texas defense that was ranked 3rd in the SEC and this looked to be another bad trip to 40 Acres. Finally, late last week it was revealed that Aaron Philo had suffered an injury to his throwing shoulder that meant Tramell Jones would make his first career start in one of college football’s most hostile environments."
  ],
  [
    "h",
    "What We Got"
  ],
  [
    "p",
    "Early in the game it looked as if Florida was in for yet another disappointing outing. Texas would jump out to an early 10-0 lead and Florida once again looked to be struggling to find its footing. Early miscues and penalties would compound as Florida would give up a 63 yard punt return to Ryan Niblett in the second quarter and it looked like the rout was on."
  ],
  [
    "p",
    "Jon Sumrall has talked to his team about being in the moment and while he downplayed the significance of the “middle eight”, Florida seemed to understand that going into the half down 14 points was not a good proposition for an upset. Tramell Jones had played well up to the 2:36 mark of the half but three points was all that the Florida offense had been able to muster. What was evident was that the mobility of Jones looked to be much more pronounced than Philo and that this drive would need his feet more than any. A fourth down stop by the Florida defense left Florida with just 49 yards to score and plenty of time to do it. Jones would have a key 14-yard scamper on the drive and two plays later found Lacota Dippre for a 7-yard touchdown to pull the Gators within seven at the half."
  ],
  [
    "p",
    "The second half would belong to Florida who came out with a balanced 15-play drive that took up over half of the third quarter and was capped by another Jones to Dippre connection where Jones eluded the rush and stepped up to find Dippre in the middle of the end zone. As impressive as the drive was the time of possession may have been the most impressive as it was close to 12 minutes of game time that Arch Manning and the Texas offense had been on the sideline. The Florida defense was improved with the Gators limiting big runs and explosive throws by timely run blitzes and secondary play that challenged the Texas receivers. Ryan Wingo and Cam Coleman are two of the nation’s best playmakers and the Gators held the duo to just 6 catches for 48 yards. While the Gator corners had been under scrutiny all season, they showed up big in key moments against two future pros."
  ],
  [
    "p",
    "Ultimately the game came down to three key plays. After sack of Manning on the Texas 49, Texas coach Steve Sarkisian opted to go for it on 4th and 2 instead of punting to pin the Gators deep. The next play was a stop of Manning for three yard loss by tackle Brendan Bett giving the Gators another short field which would lead to a Florida score to put the Gators up 27-17. Texas would find a way to get points on the next drive and force a Florida punt to set up a game winning drive for Arch Manning and Texas. What followed was another big time defensive play for the Gators that had been missing for the last two weeks. On 2nd and 8 from the Texas 48 Florida would bring a six man pressure that mixed the picture up for Manning who would be sacked by Myles Graham and fumble the ball that was recovered by nickelback Kanye Clark."
  ],
  [
    "p",
    "Florida would run two plays forcing Texas to use two of their time-outs leaving the Gators with a 3rd and 7 from the Texas 37. While many were expecting a Jadan Baugh run or Jones throw, it was the feet of Jones again that provided the final nail in the Texas coffin. Jones pulled the ball from the belly of Baugh and made two Texas defenders miss on his way to a nine yard gain and the Gator win."
  ],
  [
    "h",
    "The Skinny"
  ],
  [
    "p",
    "What is clear is that Florida has found the right guy to lead them back to prominence. It is also clear that he is totally aware of who and what his team is and where they need to improve. Jon Sumrall has taken a lot of questions regarding the X and O’s of his football team but the real juice is in the people and his trust in them to continuously do the work to improve. Forget the play calls on both sides of the ball, forget who was playing quarterback give Buster Faulkner and crew credit for getting Jones ready to play and Brad White for getting his bruised unit back off the mat to fight and fight again. Sumrall makes no secret that the Gators have a long way to go, but he also is clear that while Jones mobility may add another dimension the offense Aaron Philo has made enough plays at big moments to warrant a stay of a permanent change at quarterback. Regardless of who takes the snaps, the mention of recruiting in the off week and a focus on the team’s overall health is what lays foremost on his mind after what many would define as a season-saving win. This was a win that Florida needed, but even at 6-0 would have needed still. The 1-0 mentality works for Sumrall and that mentality is what allows this team to prepare and show up regardless of what happened seven days before. Football matters again at Florida, and for the first time in a while to those inside the building as well."
  ],
  [
    "p",
    "Final Score: Florida 27 Texas 24 (Prediction Texas 31 Florida 14)"
  ]
],
};

// ---- Buddy Martin column (unpublished Wix draft 6e802f31). Magazine cut per Brenden, Oct. 18. ----
// Kept: the opening through "Florida went into Austin...", then the first draft's remaining sections.
// Dropped: the second restart ("Frankly, I almost turned off my television" through "...means everything, as well...") and the
// unverified Georgia-Auburn and Indiana-Ohio State scores. The Tennessee-Alabama 26-10 correction stays.
export const BUDDY = {
  kicker: 'Columnist · Buddy Martin',
  title: 'A Texas Barbecue: Gators Flip the Script — and Jones Changes the Conversation',
  by: 'By Buddy Martin',
  date: 'Oct. 18, 2026',
  photo: { file: 'handoff.jpg', cap: 'Tramell Jones had a spectacular first start.' },
  pull: 'The Gators quit flinching. Let’s see if they can keep it up.',
  blocks: [
    ["p", "It’s just not safe out there for Top Ten Teams. Alabama found out in an upset by Tennessee (26-10). And Texas found out against Florida (27-24)."],
    ["p", "I’m not sure which was the most shocking."],
    ["p", "Nobody saw the Texas loss coming. Not the oddsmakers, not the Longhorn faithful, and not many Gator fans who’d spent two weekends watching their team get pushed around."],
    ["p", "Florida went into Austin with a backup quarterback making his first career start and the worst defense in the Southeastern Conference. The Gators left with a 27-24 win over No. 7 Texas, upside-down “Hook ’em Horns” fingers in the air, and a season that had looked like it was over by Halloween."],
    ["p", "Jon Sumrall didn’t sugarcoat how they got there."],
    ["p", "“We kept fighting. We didn’t do that the past couple of weeks, to be honest with you,” he said. “When things got tough, we flinched the last couple weeks.”"],
    ["p", "Flinched. That’s a coach admitting what everybody had watched. After a 4-0 start pushed Florida to No. 8, the Gators lost two straight blowouts and looked soft, confused and done. Saturday was the first time in 2026 that this team got punched in the mouth on the road and punched back."],
    ["h", "The Kid Who Waited"],
    ["p", "Remember the preseason quarterback battle? Sumrall picked Aaron Philo because he ran the offense and handled things at the line of scrimmage better. Tramell Jones Jr. was told to stay in the competition, stay ready and stay patient."],
    ["p", "He stayed ready. Philo got hurt, and Jones got the keys in one of the toughest road environments in the country."],
    ["p", "The start was rough. Texas went up 17-3 in the second quarter after Ryan Niblett’s 63-yard punt return for a touchdown, and the crowd smelled another Florida collapse. Two weeks ago, that’s where this game ends."],
    ["p", "This time Jones hit Lacota Dippre for a touchdown with 18 seconds left in the half. Then he came out in the third quarter and led a 15-play drive that took eight minutes off the clock, finishing it with another touchdown to Dippre."],
    ["p", "That wasn’t a gunslinger show. It was a grown-up drive, the kind that wears out a defense and quiets 100,000 people a little at a time."],
    ["p", "“I didn’t take it any bigger than it was,” Jones said. “It feels great, but this is just the start. It’s not over.”"],
    ["p", "Spoken like a kid who knows a quarterback job can change week to week. Philo will heal, and Sumrall will have a decision to make. That’s a better problem than the one he had Friday night."],
    ["h", "Same Defense, Different Team"],
    ["p", "Now the part that doesn’t add up on paper."],
    ["p", "The defense that couldn’t stop anybody for two weeks held Texas under 300 yards. It sacked Arch Manning five times. After the first two Texas drives, it took away the Longhorns’ big-play receivers and gave up one first down on Texas’ first three possessions of the second half while Florida took the lead."],
    ["p", "And when the game was on the line, Myles Graham got to Manning one more time and knocked the ball loose on Texas’ final drive. Ballgame."],
    ["p", "I’m not going to tell you one Saturday fixes a defense that ranked last in the league. It doesn’t. But it tells you the problem may have been heart, not talent, and Sumrall can coach heart."],
    ["p", "This one belongs among the biggest road wins in Florida football history. And rarely have the Gators flipped a script quite like this."],
    ["p", "My friend Randy called with a question that pretty much summed up the early proceedings:"],
    ["p", "“How do you fix stupid?”"],
    ["p", "For a while, it looked like Florida was trying to give the game away."],
    ["p", "But let’s get something straight: Texas didn’t hand this one to the Gators."],
    ["p", "Florida took it."],
    ["p", "And while the conversation in Texas will revolve around Arch Manning, the conversation in Florida ought to begin with Tramell Jones Jr."],
    ["p", "Not what their quarterback did wrong."],
    ["p", "What Florida’s quarterback did right."],
    ["p", "Making his first college start, filling in for the injured Aaron Philo, Jones walked into Darrell K Royal–Texas Memorial Stadium and helped pull a wobbling team back onto its feet. He threw two touchdown passes to Lacota Dippre, and Jadan Baugh supplied the fourth-quarter touchdown that helped finish the comeback."],
    ["p", "Spectacular? Not in the video-game sense."],
    ["p", "Something better under these circumstances: tough, composed and good enough to win when the afternoon seemed headed in the opposite direction."],
    ["p", "Jones finished with 155 passing yards, two touchdowns and another 41 yards rushing. Those numbers won’t require anyone to rewrite the Florida record book. The circumstances, however, deserve a prominent place in the memory bank."],
    ["p", "So does the response from Jon Sumrall."],
    ["p", "Some of us probably owe the man an apology. Or, at minimum, a little acknowledgment that we were ready to pronounce judgment before he was finished making his case."],
    ["p", "After the homecoming loss to South Carolina, it was fair to wonder where this team was headed. Another ugly start at Texas made that question louder. Instead, Sumrall’s Gators answered with their first road victory over a top-10 opponent since beating Florida State in 2012."],
    ["p", "Whatever else you want to say about this coach, his team showed toughness and resilience Saturday."],
    ["p", "True grit isn’t something you put on a motivational poster. It’s something you show when you’re down 17-3 on the road and everybody watching thinks they know how the story ends."],
    ["p", "Credit the defense, too. This wasn’t simply a young quarterback riding to the rescue. Florida had to get the ball back, and with Texas threatening late, Myles Graham strip-sacked Manning. Kanye Clark recovered, and the Gators finished the job."],
    ["p", "That will bring another round of uncomfortable questions for Manning and Steve Sarkisian."],
    ["p", "Those are Texas’ problems."],
    ["p", "Florida has a much more interesting one."],
    ["p", "What do you do at quarterback now?"],
    ["p", "Philo’s injury opened the door. Jones walked through it and helped deliver a victory that changed the mood of a season. That doesn’t automatically settle the starting job. It certainly changes the discussion."],
    ["p", "Do we officially have a quarterback controversy?"],
    ["p", "Call it a competition. Call it a decision. Call it whatever keeps everybody comfortable."],
    ["p", "But how do you watch what Jones did in Austin and not give him serious consideration for the next start?"],
    ["p", "In two weeks, Florida faces Georgia. Suddenly, that game looks less like a date to dread and more like an opportunity."],
    ["p", "I nearly turned off the television."],
    ["p", "Good thing the Gators weren’t ready to turn out the lights."],
    ["h", "Baugh Pays It Back"],
    ["p", "Patrick Durkin’s 28-yard field goal gave Florida its first lead. Then Jadan Baugh broke outside for an 11-yard touchdown, and for a few minutes that felt like the game."],
    ["p", "That’s the same Jadan Baugh who had schools lining up to take him in the transfer portal. The same Baugh whose grandmother got a visit from Sumrall on Christmas Eve. Coaches make house calls for moments like this one: fourth quarter, top-10 team, their building, ball in the hands of the guy you fought to keep."],
    ["p", "Texas answered right away. Manning slipped a fourth-down sack, found Emmett Mosley V for 62 yards and hit Cam Coleman for a 9-yard touchdown. But the Gators had the last word."],
    ["h", "Texas Has Bigger Problems"],
    ["p", "Steve Sarkisian looked like a man reading his own autopsy report."],
    ["p", "“We didn’t play good football today. Kind of bled out,” he said."],
    ["p", "He’s right, and it’s getting worse. Texas has lost two straight. Manning has struggled for four games in a row. One of the best defenses in the country gave up second-half scoring drives of 15 and 14 plays, and star edge rusher Colin Simmons left in the fourth quarter with what looked like an ankle injury."],
    ["p", "“It’s not great right now,” Manning said. “Coming off two losses in a row, it stings.”"],
    ["h", "The Verdict"],
    ["p", "This was Florida’s first road win over a top-10 opponent since 2012. Fourteen years. Think about how many coaches, quarterbacks and fresh starts have come and gone in that time."],
    ["p", "Is Florida back? Let’s not get silly. The Gators are 5-2 and play Georgia on Oct. 31. Plenty of teams feeling good about themselves have been humbled in that series."],
    ["p", "But two weeks ago, people were asking whether Sumrall’s team had a spine. On Saturday in Austin, it showed one."],
    ["p", "The Gators quit flinching. Let’s see if they can keep it up."],
  ],
  note: 'As published by GatorBait Media (Wix post 6e802f31), Oct. 18, 2026. Text matches the live column.',
};

// ---- Georgia ----
export const GEORGIA = {
  facts: [
    ['Date', 'Saturday, Oct. 31, 2026'],
    ['Kickoff', '3:30 p.m. ET'],
    ['TV', 'ABC'],
    ['Site', 'Mercedes-Benz Stadium (neutral)'],
    ['Florida', '5-2 overall, 3-2 SEC'],
  ],
  carry: [
    { v: '24', l: 'Straight points', n: 'The run that beat Texas.' },
    { v: '0', l: 'Turnovers', n: 'Florida’s count in Austin.' },
    { v: '7-55', l: 'Penalties', n: 'Texas had 1-15.' },
  ],
  slots: [
    'Georgia record and ranking: pending, we print the latest release only',
    'Line and total: pending',
    'Injury and availability report: pending',
    'The desk’s Georgia preview and the Buddy Martin Show preview: coming this week',
  ],
};

// ---- Back page ----
export const CREDITS = {
  people: [
    ['Buddy Martin', 'Publisher and Editor-in-Chief'],
    ['Brenden Martin', 'Owner and Executive Producer, GatorBait Media and GatorBait TV'],
    ['Franz Beard', 'Columnist'],
    ['Eddie Gilley', 'Writer'],
    ['Loren Meadows', 'Writer'],
    ['UAA and Hannah White', 'Game photography, Texas (courtesy)'],
    ['The GatorBait Media Desk', 'Postgame desk, graphics and production'],
  ],
  lines: [
    'GatorBait Magazine is an independent Florida Gators publication. It was founded by David Stirt and is published today by GatorBait Media.',
    'The Buddy Martin Show streams nightly from GatorBait Media.',
    'Game photos: Photo courtesy UAA and Hannah White. Cover art, charts and layout by GatorBait Media.',
    'Statistics and results: ESPN (event 401856724).',
  ],
  contact: 'www.gatorbaitmedia.com',
  copyright: '© 2026 GatorBait Media. All rights reserved.',
};
