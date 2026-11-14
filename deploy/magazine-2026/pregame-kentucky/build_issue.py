#!/usr/bin/env python3
"""Build sports-live/magazine-issue-kentucky.json (Friday Pregame edition, Nov. 14, 2026: Florida at Kentucky).
Cover and lead: Franz Beard's Soothsayer (Kentucky section in full). Numbers come from ESPN's public JSON API fetched at build
time (event 401856884: line, total, matchup predictor, forecast; team season statistics; Florida schedules 2012-2025 for the
series). Picks and analysis are the writers' own. Run from the repo root. Never sends mail."""
import json, html, re, pathlib, urllib.request
root = pathlib.Path(__file__).resolve().parents[3]
B = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/'
def g(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=40))

# ---- ESPN ----
summ = g(B + 'summary?event=401856884')
pc = summ['pickcenter'][0]
pred = summ['predictor']
wx = summ['gameInfo']['weather']
spread, total = pc['details'], pc['overUnder']
ml_h = pc['homeTeamOdds'].get('moneyLine'); ml_a = pc['awayTeamOdds'].get('moneyLine')
flaP = float(pred['awayTeam']['gameProjection']); ukP = float(pred['homeTeam']['gameProjection'])
def stat(tid):
    st = g('https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/seasons/2026/types/2/teams/%d/statistics' % tid)
    d = {}
    for c in st['splits']['categories']:
        for s in c['stats']:
            d.setdefault(s['name'], s['value'])
    return d
F, K = stat(57), stat(96)
gp = F['gamesPlayed']; assert gp == K['gamesPlayed'] == 9.0
r1 = lambda x: round(x, 1)
tape = [
  {'label': 'Points scored', 'fla': r1(F['totalPointsPerGame']), 'miz': r1(K['totalPointsPerGame']), 'unit': '', 'lower': False},
  {'label': 'Total yards', 'fla': r1(F['yardsPerGame']), 'miz': r1(K['yardsPerGame']), 'unit': '', 'lower': False},
  {'label': 'Rushing yards', 'fla': r1(F['rushingYardsPerGame']), 'miz': r1(K['rushingYardsPerGame']), 'unit': '', 'lower': False},
  {'label': 'Passing yards', 'fla': r1(F['passingYardsPerGame']), 'miz': r1(K['passingYardsPerGame']), 'unit': '', 'lower': False},
  {'label': 'Yards a carry', 'fla': r1(F['yardsPerRushAttempt']), 'miz': r1(K['yardsPerRushAttempt']), 'unit': '', 'lower': False},
  {'label': 'Takeaways (season)', 'fla': int(F['totalTakeaways']), 'miz': int(K['totalTakeaways']), 'unit': '', 'lower': False},
  {'label': 'Giveaways (season)', 'fla': int(F['totalGiveaways']), 'miz': int(K['totalGiveaways']), 'unit': '', 'lower': True},
  {'label': 'Penalty yards', 'fla': r1(F['totalPenaltyYards'] / gp), 'miz': r1(K['totalPenaltyYards'] / gp), 'unit': '', 'lower': True},
]
series = [(2012,'H',38,0),(2013,'A',24,7),(2014,'H',36,30),(2015,'A',14,9),(2016,'H',45,7),(2017,'A',28,27),(2018,'H',16,27),
          (2019,'A',29,21),(2020,'H',34,10),(2021,'A',13,20),(2022,'H',16,26),(2023,'A',14,33),(2024,'H',48,20),(2025,'A',7,38)]
# verify the table against ESPN schedules (Florida score first)
chk = {}
for y, *_ in series:
    for ev in g(B + 'teams/57/schedule?season=%d' % y).get('events', []):
        if ev['name'].replace('Kentucky Wildcats', 'UK') and 'Kentucky Wildcats' in ev['name']:
            c = ev['competitions'][0]; sc = {t['team']['abbreviation']: int(t['score']['displayValue']) for t in c['competitors']}
            chk[y] = (sc['FLA'], sc['UK'])
assert all(chk[y] == (f, k) for (y, s, f, k) in series), chk
wins = sum(1 for (_, _, f, k) in series if f > k)
# scoreboard lines for the SEC slate
sb = g(B + 'scoreboard?dates=20261114&groups=80&limit=100')
lines = {}
for e in sb['events']:
    c = e['competitions'][0]; o = (c.get('odds') or [{}])[0]
    nm = {t['homeAway']: t['team']['displayName'] for t in c['competitors']}
    lines[(nm['away'], nm['home'])] = (o.get('details'), o.get('overUnder'))
def ln(a, h):
    d, ou = lines.get((a, h), (None, None)); return (d or '', ou)

def pic(i, ext, w, h, alt, credit):
    return {'id': i, 'ext': ext, 'width': w, 'height': h, 'alt': alt, 'credit': credit}
UAA = lambda who: 'Photo courtesy UAA and %s.' % who
FRANZ = '/post/the-soothsayer-kentucky-no-longer-fears-the-gators'
cover_img = pic('d3cfa5_bb403ee551db4d92a76ce3bbcc13ef70', 'jpg', 1920, 1080, 'Florida defenders tackle an Oklahoma receiver on Nov. 7, 2026.', UAA('Cassie Baker'))

lead_paras = [
 'There was a time and not all that long ago when Florida football fans measured the Kentucky game by “how much.” Never was it “will we beat Kentucky” because they were the “Mildcats” and an automatic cure for whatever ailed the Gators. A win was assured so the only question was by how much.',
 'From 1986 until a fateful night in The Swamp in 2018, Kentucky was a mortal lock to lose to the Florida Gators. Twenty-eight straight years the Gators inflicted pain on UK. Yes, there were some close calls but they were like teasers. There was the “Doering’s got a touchdown! Doering’s got a touchdown!” game that immortalized Mick Huber in the minds and hearts of Gator fans everywhere. That night in 1993 was the night the legend of Danny Wuerffel was born, but it was also the coming out party for former walk-on wide receiver Chris Doering, who would go on to set an SEC record for career touchdown receptions that stood for nearly 30 years.',
 'We call that game a teaser because the next year, almost as if he felt the need to atone for a close call win over UK in Lexington, Steve Spurrier and the Gators wore out the Wildcats to the tune of 73-7. For years, it seemed that every time Kentucky made Florida hearts skip a beat, the Wildcats were in for a severe beating the next year.',
 'Then came the night that will live forever in infamy. The Swamp, September 8, 2018, Dan Mullen’s second game as Florida’s head coach. The unthinkable happened. Kentucky ran for 303 yards. On the last play of the game came the ultimate insult. Feleipe Franks fumbled and Kentucky’s Davonte Robinson scooped up the loose ball, ran it in 30 yards for a TD. Kentucky 27, Florida 16.',
 'The fear factor went poof in the humid Florida night and it has never returned. Kentucky no longer fears the Florida Gators. The Wildcats have won five of the last eight meetings with the Gators. Jon Sumrall was the defensive coordinator when Kentucky beat the Gators 20-13 in Lexington in 2021. Brad White was the defensive coordinator at UK when the Wildcats scored wins in 2022, 2023 and last year when Kentucky picked off DJ Lagway three times en route to a 38-7 humiliation of the Gators in Gainesville.',
 'Sumrall is Florida’s head coach now and White is his defensive coordinator. Tonight (6:15 p.m., ESPN) they find out if you can indeed go home again. Kentucky (7-2, 5-2 SEC) is ranked 13th nationally and very much in contention for a berth in the College Football Playoff. If the Wildcats win out in their last three games they are almost assured of the playoff. Who would have ever thought Kentucky would make the playoff much less do it before the Florida Gators?',
 'But it could happen unless the Gators pull one out of the wazzoo. To do it they’ll be without Vernell Brown III for a sixth straight game and with Aaron Philo returning as the starting QB after Tramell Jones Jr.’s bad day at the office last week against Oklahoma.',
 'Kentucky is a 3.5-point favorite. It seems like it should be a wider spread considering the way UK has played all year and the way the Gators have cratered since September. For Kentucky this isn’t the Super Bowl but it’s close because winning is one step closer to college football’s promised land. For Florida, a win could reverse the trend of four losses in five games and would assure the Gators of bowl eligibility.',
 'High stakes drama in Lexington in which the team that commits the fewest turnovers is likely to pull out a win.',
]
sooth = '<strong>The Sayer Says Sooth!:</strong> The SEC Soothsayer knows all too well what a win would mean for Sumrall and White, not to mention the shot of feel good the Gators need so desperately. He is also keenly aware that Kentucky fans are ready to say screw the SEC and it’s big fines, it’s time to storm the field if the Wildcats are ahead when the clock flatlines at zero. Thirty-two years of Florida fear factor are relics of a past that Sumrall wants to resurrect. If you gamble, bet the ranch that Sumrall will restore Florida’s dignity, just not this night. The Soothsayer thinks it’s a chest clutcher Kentucky win. It’s still hard to fathom.'
e = lambda s: html.escape(s, quote=False)
lead_html = ''.join('<p>%s</p>' % e(p) for p in lead_paras) + '<p class="pg-sooth">%s</p>' % sooth

def G(a, h): return ln(a, h)
slate_rows = [
 ('Noon', 'ESPN2', ('Auburn', None, '5-4'), ('Mississippi State', None, '4-5'), 'Auburn', 'Auburn moves within one game of its first winning season since 2020.'),
 ('12:45 p.m.', 'SEC Network', ('Alabama', 3, '7-2'), ('Vanderbilt', None, '4-5'), 'Alabama', ''),
 ('3 p.m.', 'ESPN', ('Tennessee', 8, '7-2'), ('Texas A&M', None, '4-5'), 'Tennessee', ''),
 ('3:30 p.m.', 'ABC', ('Missouri', 22, '6-3'), ('Georgia', 1, '8-1'), 'Georgia', ''),
 ('4:15 p.m.', 'SEC Network', ('Ole Miss', 19, '6-3'), ('Oklahoma', None, '5-4'), 'Oklahoma', ''),
 ('6:15 p.m.', 'ESPN', ('Florida', None, '5-4'), ('Kentucky', 13, '7-2'), 'Kentucky', 'Florida at Kentucky'),
 ('7:30 p.m.', 'ABC', ('Texas', 6, '7-2'), ('LSU', 21, '6-3'), 'Texas', ''),
 ('7:45 p.m.', 'SEC Network', ('South Carolina', 17, '6-3'), ('Arkansas', None, '3-6'), 'South Carolina', ''),
]
disp = {'Auburn': 'Auburn Tigers', 'Mississippi State': 'Mississippi State Bulldogs', 'Alabama': 'Alabama Crimson Tide', 'Vanderbilt': 'Vanderbilt Commodores',
        'Tennessee': 'Tennessee Volunteers', 'Texas A&M': 'Texas A&M Aggies', 'Missouri': 'Missouri Tigers', 'Georgia': 'Georgia Bulldogs', 'Ole Miss': 'Ole Miss Rebels',
        'Oklahoma': 'Oklahoma Sooners', 'Florida': 'Florida Gators', 'Kentucky': 'Kentucky Wildcats', 'Texas': 'Texas Longhorns', 'LSU': 'LSU Tigers',
        'South Carolina': 'South Carolina Gamecocks', 'Arkansas': 'Arkansas Razorbacks'}
slate = []
for (t, tv, a, h, pick, note) in slate_rows:
    d, ou = ln(disp[a[0]], disp[h[0]])
    row = {'time': t, 'tv': tv, 'away': {'name': a[0], 'rec': a[2]}, 'home': {'name': h[0], 'rec': h[2]}, 'line': d, 'pick': pick}
    if a[1]: row['away']['rank'] = a[1]
    if h[1]: row['home']['rank'] = h[1]
    if ou: row['ou'] = ou
    if note: row['note'] = note
    if a[0] == 'Florida': row['hero'] = True
    slate.append(row)

def card(k, d, title, url, ex, img): return {'kicker': k, 'date': d, 'title': title, 'url': url, 'excerpt': ex, 'image': img}
cards = [
 card('Buddy Martin · Column', 'Nov. 14', 'Gators Are Safely In Kentucky, But Now For The Task: How To Beat Kentucky', '/post/gators-are-safely-in-kentucky-but-now-for-the-task-how-to-beat-kentucky', 'Gators a three-point underdog at Kroger Field.',
      pic('ae876a_c96312563ae1474bbc134b0407de2ccd', 'jpg', 960, 641, 'Kentucky’s stadium on game day.', 'Photo courtesy of University of Kentucky.')),
 card('Eddie Gilley · Keys', 'Nov. 13', 'Keys To The Game', '/post/keys-to-the-game', 'Eddie Gilley’s five keys for Florida at Kentucky: Jadan Baugh, the offensive line, Eric Singleton, Aaron Philo and a defense that has to force takeaways.',
      pic('d3cfa5_b546b94712024f87b3039fcbb6fcc8a1', 'jpg', 1920, 1080, 'A Florida ball carrier runs past a diving Oklahoma defender on Nov. 7, 2026.', UAA('Emma Brugna'))),
 card('GatorBait Staff · Notebook', 'Nov. 12', 'Sumrall goes back to Kentucky with Florida’s season on the line: the Thursday notebook', '/post/sumrall-goes-back-to-kentucky-with-florida-s-season-on-the-line-the-thursday-notebook', 'Jon Sumrall takes Florida back to his alma mater Saturday night, with Aaron Philo expected at quarterback, four Gators ruled out and a season down to three games.',
      pic('d3cfa5_56aced269a3d4dc58da9d4a6838a4d01', 'jpg', 1920, 1080, 'Florida head coach Jon Sumrall greets the gator statue on game day.', UAA('Victoria Riccobono'))),
 card('Buddy Martin · Column', 'Nov. 9', 'Sumrall’s My Old Kentucky Home', '/post/sumrall-s-my-old-kentucky-home', 'Buddy Martin on Jon Sumrall’s return to Kentucky, the two former Gators now starting for the Wildcats, a note from Dr. Pete Indelicato and more.',
      pic('d3cfa5_8fd32f1dc4654c8dae6eed1f8508893d', 'jpg', 960, 1200, 'A Kentucky fan on game day.', 'Photo courtesy University of Kentucky.')),
 card('Franz Beard · Column', 'Nov. 9', 'Football relevance at stake for both Florida and Kentucky', '/post/football-relevance-at-stake-for-both-florida-and-kentucky', 'Two first-year coaches, two basketball schools and a football Saturday that tests relevance. Includes the AP and Coaches polls and an SEC team-by-team look.',
      pic('d3cfa5_b5ee34cfd4f444cd90519872cb35d8ec', 'png', 1672, 941, 'GatorBait graphic: Football relevance at stake for both schools.', 'Graphic by GatorBait Media.')),
 card('Franz Beard · Column', 'Nov. 11', 'Florida football: The deficiencies have been there all along', '/post/florida-football-the-deficiencies-have-been-there-all-along', 'How Florida’s September start covered up problems that October exposed, six things the Gators must fix in the offseason and the coaching hot seat.',
      pic('d3cfa5_6fab414f03c84fbc9c56d40a5f8d49e4', 'jpg', 1920, 1280, 'A Florida ball carrier dives toward the pylon against Oklahoma on Nov. 7, 2026.', UAA('Ethan Caruso'))),
 card('Buddy Martin · Column', 'Nov. 12', 'The Quarterback Carousel Spins Again — and It Stops on Aaron Philo', '/post/the-quarterback-carousel-spins-again-and-it-stops-on-aaron-philo', 'Philo started six games, hurt his shoulder, and watched Tramell Jones Jr. steal a 27-24 upset at Texas. Now the carousel stops on Philo again.',
      pic('ae876a_4e496d688a5d4daf9f42adabf984fab9', 'jpg', 480, 349, 'Aaron Philo in a cowboy hat and blue Gators jersey.', 'Photo supplied with the column.')),
 card('Eddie Gilley · Grades', 'Nov. 9', 'Reviewing the Reads After the Loss', '/post/reviewing-the-reads-after-the-loss', 'Eddie Gilley grades the five reads he set before Florida’s 23-7 loss to Oklahoma, from the pass rush and offensive line to Tramell Jones Jr. and penalties.',
      pic('d3cfa5_791928c7bf6c4d0096665ecb1e7daab5', 'jpg', 1440, 960, 'A Florida ball carrier runs past an Oklahoma defender at Ben Hill Griffin Stadium on Nov. 7, 2026.', 'Photo courtesy UAA.')),
 card('Buddy Martin · Column', 'Nov. 12', 'Boom, Redux: Will Muschamp Finally Gets Life Right — in Texas', '/post/boom-redux-will-muschamp-finally-gets-life-right-in-texas', 'The man who should have been the perfect head coach of Florida? Buddy Martin on Will Muschamp and his second act running the Texas defense.',
      pic('d3cfa5_b2ee0d32d4cd47ab8253f7756a9b3e58', 'jpg', 960, 540, 'Texas defensive coordinator Will Muschamp on the sideline.', 'Photo courtesy University of Texas.')),
 card('Recruiting · GatorBait Staff', 'Nov. 13', 'Florida flips 6-foot-7 tackle Moreno Fisher from Virginia', '/post/florida-flips-6-foot-7-tackle-moreno-fisher-from-virginia', 'Florida flipped 6-foot-7 offensive tackle Moreno Fisher from Virginia on Thursday, the Gators’ 27th commitment and fourth offensive lineman in the 2027 class.',
      pic('d3cfa5_2503400ea63241218aeba9371e09b857', 'jpg', 1920, 1080, 'Florida and Oklahoma players tangle in a pile on Nov. 7, 2026.', UAA('Victoria Riccobono'))),
]
shots = {'label': 'Best shots', 'note': 'From Oklahoma 23, Florida 7 (Nov. 7)', 'credit': 'Photos courtesy UAA and Victoria Riccobono, Hannah White and Ethan Caruso.', 'photos': [
  {'id': 'd3cfa5_b6f9c3a88335442994b2dd37db2daaf0', 'ext': 'jpg', 'width': 1920, 'height': 1280, 'alt': 'Florida defenders bring down an Oklahoma ball carrier.', 'caption': 'The defense swarms'},
  {'id': 'd3cfa5_385aeb94c2644c688ca48f2ae58903de', 'ext': 'jpg', 'width': 1920, 'height': 1280, 'alt': 'A Florida runner breaks through the Oklahoma defense.', 'caption': 'Breaking loose'},
  {'id': 'd3cfa5_44380e7cef204f2580492d7f49a44a0d', 'ext': 'jpg', 'width': 1920, 'height': 1280, 'alt': 'Florida and Oklahoma players collide near the sideline.', 'caption': 'Sideline collision'},
  {'id': 'd3cfa5_15d88c9e626440cfab72bee90cfb208a', 'ext': 'jpg', 'width': 1920, 'height': 1280, 'alt': 'Florida defenders close in on an Oklahoma player.', 'caption': 'Closing in'},
  {'id': 'd3cfa5_87521f9dcf454870b5deff7ed6e7c900', 'ext': 'jpg', 'width': 1920, 'height': 1280, 'alt': 'Ben Hill Griffin Stadium under the lights.', 'caption': 'The Swamp at night'}]}

issue = {
 '$comment': 'GatorBait Magazine, Friday Pregame edition (Nov. 14, 2026: Florida at Kentucky). layout=pregame renders with renderPregame() in sports-live/src/magazine-pregame.js. Numbers: ESPN event 401856884 and ESPN team statistics, fetched Nov. 14. No email or campaign send.',
 'id': '2026-11-14-florida-at-kentucky', 'layout': 'pregame', 'liveFeed': False,
 'issue': {'number': 'Kentucky Game Day', 'name': 'Florida at Kentucky', 'date': 'Saturday, November 14, 2026', 'week': 'Week 11 · 6:15 p.m. ET · ESPN · Kroger Field',
           'tagline': 'Independent Florida Gators coverage', 'pageTitle': 'GatorBait Magazine | Pregame: Florida at Kentucky | Nov. 14, 2026'},
 'asOf': 'ESPN data as of Nov. 14, 2026. Kickoff, line and forecast can move before kickoff; each linked story keeps its own publication date.',
 'cover': {'kicker': 'The Soothsayer · Franz Beard', 'headline': 'Kentucky no longer fears the Gators',
           'dek': 'Twenty-eight straight wins, then one fateful night in 2018. Franz Beard on why Florida goes to Lexington tonight as an underdog, with his picks for every SEC game.',
           'byline': 'By Franz Beard', 'url': FRANZ, 'directLink': False, 'image': cover_img},
 'game': {'label': 'The game', 'kickoffISO': '2026-11-14T23:15:00Z', 'kickoff': 'Saturday, Nov. 14 · 6:15 p.m. ET', 'tv': 'ESPN', 'venue': 'Kroger Field, Lexington, Ky.',
          'forecast': '%d°, %s%% chance of rain, gusts to %d mph (ESPN forecast)' % (wx['temperature'], int(wx.get('precipitation') or 0), wx['gust']),
          'teams': [{'name': 'Florida', 'record': '5-4', 'conf': '3-4 SEC'}, {'rank': 'No. 13', 'name': 'Kentucky', 'record': '7-2', 'conf': '5-2 SEC'}], 'separator': 'at',
          'chips': [{'k': 'Line', 'v': spread}, {'k': 'Total', 'v': ('%g' % total)}, {'k': 'Moneyline', 'v': 'UK -155 · FLA +130'}],
          'predictor': {'label': 'ESPN matchup predictor', 'florida': flaP, 'missouri': ukP},
          'source': 'ESPN game summary and pickcenter (DraftKings), event 401856884. Kentucky’s No. 13 ranking as reported by Franz Beard.'},
 'series': {'label': 'The series', 'headline': 'Florida %d-%d since 2012, Kentucky 5 of the last 8' % (wins, len(series) - wins),
            'line': 'Florida has won nine of the 14 meetings since 2012, and is 4-3 in Lexington over that stretch. Kentucky has won five of the last eight, including 38-7 in Gainesville last year.',
            'games': [{'year': y, 'site': s, 'fla': f, 'mizz': k} for (y, s, f, k) in series], 'source': 'ESPN team schedules, 2012-2025 (Florida score first; H = Gainesville, A = Lexington)'},
 'numbers': {'label': 'By the numbers', 'note': 'Six figures that frame Saturday', 'items': [
   {'value': spread.replace('UK ', 'UK '), 'label': 'Kentucky, the line', 'note': 'Total %g. DraftKings line via ESPN pickcenter, Nov. 14.' % total},
   {'value': '%.1f%%' % ukP, 'label': 'ESPN predictor, Kentucky', 'note': 'Florida at %.1f%% in the ESPN matchup predictor.' % flaP},
   {'value': '%d-%d' % (wins, len(series) - wins), 'label': 'Florida since 2012', 'note': 'Last meeting: Kentucky 38, Florida 7 in Gainesville, Nov. 9, 2025.'},
   {'value': '+%d' % (int(F['totalTakeaways']) - int(F['totalGiveaways'])), 'label': 'Florida turnover margin', 'note': 'Florida has %d takeaways and %d giveaways; Kentucky has %d and %d.' % (F['totalTakeaways'], F['totalGiveaways'], K['totalTakeaways'], K['totalGiveaways'])},
   {'value': '%.1f' % (F['totalPenaltyYards'] / gp), 'label': 'Florida penalty yards a game', 'note': 'Kentucky averages %.1f.' % (K['totalPenaltyYards'] / gp)},
   {'value': '%.1f' % F['totalPointsPerGame'], 'label': 'Florida points a game', 'note': 'Kentucky scores %.1f a game.' % K['totalPointsPerGame']}],
   'source': 'ESPN game summary, pickcenter and 2026 team statistics, Nov. 14.'},
 'tape': {'label': 'Tale of the tape', 'note': 'Season, per game: nine games each (defensive per-game figures are not in ESPN’s team feed)', 'source': 'ESPN 2026 team statistics, Nov. 14 (penalty yards a game figured from season penalty yards over games played)', 'rows': tape},
 'keys': {'label': 'Five keys', 'items': [
   {'h': 'Jadan Baugh has to be Superman', 'p': 'Eddie Gilley’s first key: the back hailed as the best in the country and a Heisman contender has to charge the hole instead of dancing, if Florida is going to win in the Bluegrass state.', 'url': '/post/keys-to-the-game'},
   {'h': 'The offensive line has to move the Wildcats', 'p': 'Gilley wants better than the last two weeks: movement in the run game, no defensive linemen living in the backfield, and a center and quarterback on the same page on protections.', 'url': '/post/keys-to-the-game'},
   {'h': 'Eric Singleton has to be the playmaker', 'p': 'Injuries have slowed the receiver promised as the dynamic playmaker. Gilley says offensive coordinator Buster Faulkner has to find ways to get him the ball in space.', 'url': '/post/keys-to-the-game'},
   {'h': 'Aaron Philo has to be boring', 'p': 'Philo takes back the starting job. Gilley’s ask: the solid decision maker he was early in the season, a game manager who cannot give the game away.', 'url': '/post/keys-to-the-game'},
   {'h': 'The defense needs a takeaway or two', 'p': 'Stingy in the second half of the last two games, Gilley says, but Kentucky does not give it up often. One or two takeaways and a short field could send the Gators home with a win.', 'url': '/post/keys-to-the-game'}],
   'source': 'Eddie Gilley, Keys To The Game (GatorBait Media, Nov. 13).'},
 'injuries': {'label': 'Availability', 'asOf': 'GatorBait reporting. The official SEC availability report posts Friday; ESPN lists no injuries for either team.', 'teams': [
   {'name': 'Florida', 'items': [{'pos': 'WR', 'name': 'Vernell Brown III', 'status': 'Out', 'detail': 'Sixth straight game, per Franz Beard'}]}], 'source': 'GatorBait reporting (Franz Beard, Nov. 13)'},
 'lead': {'label': 'The Soothsayer', 'kicker': 'Franz Beard · Senior Columnist', 'title': 'Kentucky no longer fears the Gators', 'url': FRANZ, 'html': lead_html,
          'continue': 'Read the full column: Franz’s picks for all eight SEC games', 'date': 'November 13, 2026'},
 'slate': {'label': 'The Sooth Board', 'note': 'Saturday’s SEC games with Franz Beard’s picks', 'source': 'Kickoffs and TV: Franz Beard’s column. Lines: ESPN. Picks: Franz Beard, The Soothsayer. Rankings as listed in his column.', 'games': slate},
 'cards': {'label': 'More from Kentucky week', 'items': cards},
 'shots': shots,
 'reference': {'label': 'Reference desk', 'links': [{'label': 'All current stories', 'url': '/gatorbait-media-blogs'}, {'label': 'The Buddy Martin Show', 'url': '/the-buddy-martin-show'},
               {'label': 'ESPN Gamecast', 'url': 'https://www.espn.com/college-football/game/_/gameId/401856884/florida-kentucky'}],
               'next': 'Next up: back in The Swamp. Check the schedule for the next kickoff.'},
}
out = root / 'sports-live/magazine-issue-kentucky.json'
out.write_text(json.dumps(issue, ensure_ascii=False, indent=1))
print('wrote', out, len(out.read_text()), 'chars', 'spread', spread, 'total', total, 'pred', flaP, ukP, 'series', wins, len(series))
print([ (r['label'], r['fla'], r['miz']) for r in tape])
print([(s['time'], s['away']['name'], s['home']['name'], s['line']) for s in slate])
