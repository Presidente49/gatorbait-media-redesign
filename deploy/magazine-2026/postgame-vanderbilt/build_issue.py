#!/usr/bin/env python3
"""Postgame edition, Nov. 21, 2026: Florida 34, Vanderbilt 27 (ESPN event 401856748).
Writes sports-live/magazine-issue-vanderbilt-postgame.json for the existing `layout: "postgame"` renderer
(sports-live/src/magazine-postgame.{js,css}). Every number is read from ESPN's summary at build time; the script
stops unless the game is Final, the score is 34-27 and the twelve scoring plays are the ones the copy describes.
Local build only: nothing here writes to Wix, sends mail or pushes.
Usage: python3 deploy/magazine-2026/postgame-vanderbilt/build_issue.py
Then:  MAG_VARIANT=vanderbilt-postgame node sports-live/build-magazine.mjs"""
import json, pathlib, urllib.request
REPO = pathlib.Path(__file__).resolve().parents[3]
EVENT = '401856748'
def get(u): return json.load(urllib.request.urlopen(u, timeout=40))
d = get('https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=' + EVENT)
c = d['header']['competitions'][0]
assert c['status']['type']['description'] == 'Final', c['status']['type']
T = {x['team']['abbreviation']: x for x in c['competitors']}
F, V = int(T['FLA']['score']), int(T['VAN']['score'])
assert (F, V) == (34, 27), (F, V)
def ls(t): return [int(x.get('displayValue') or 0) for x in t.get('linescores', [])]
fq, vq = ls(T['FLA']), ls(T['VAN'])
assert fq == [3, 14, 7, 10] and vq == [3, 21, 0, 3], (fq, vq)
rec = {k: {r.get('type'): r.get('summary') for r in t.get('record', [])} for k, t in T.items()}
assert rec['FLA'].get('total') == '7-4' and rec['FLA'].get('vsconf') == '5-4', rec
rank = T['FLA'].get('rank'); assert rank == 24, rank
# team stats
st = {}
for tm in d['boxscore']['teams']:
    st[tm['team']['abbreviation']] = {s['label']: s['displayValue'] for s in tm['statistics']}
tf, tv = st['FLA'], st['VAN']
# players
pl = {}
for tm in d['boxscore']['players']:
    a = tm['team']['abbreviation']; pl[a] = {}
    for cat in tm['statistics']:
        pl[a][cat['name']] = [dict(zip(['name'] + cat['labels'], [x['athlete']['displayName']] + x['stats'])) for x in cat.get('athletes', [])]
def who(team, cat, name):
    for r in pl[team][cat]:
        if r['name'] == name: return r
    raise SystemExit('missing %s %s %s' % (team, cat, name))
philo = who('FLA', 'passing', 'Aaron Philo'); philor = who('FLA', 'rushing', 'Aaron Philo'); baugh = who('FLA', 'rushing', 'Jadan Baugh')
sing = who('FLA', 'receiving', 'Eric Singleton Jr.'); graham = who('FLA', 'defensive', 'Myles Graham'); durkin = who('FLA', 'kicking', 'Patrick Durkin')
curtis = who('VAN', 'passing', 'Jared Curtis'); alex = who('VAN', 'rushing', 'Sedrick Alexander')
sher = who('VAN', 'receiving', 'Junior Sherrill'); taylor = who('VAN', 'kicking', 'Brock Taylor')
assert taylor['FG'] == '4/4' and durkin['FG'] == '2/2' and graham['TD'] == '1' and philor['TD'] == '2' and baugh['TD'] == '1', (taylor, durkin)
SEASON_BAUGH = 905  # ESPN, through 10 games, before kickoff
btotal = SEASON_BAUGH + int(baugh['YDS']); bneed = 1000 - btotal
assert 0 < bneed < 60, bneed
# scoring plays: the twelve the copy describes, in AP style, checked against ESPN's text
sp = d['scoringPlays']
PLAYS = [
 (1, '10:24', 'VAN', 'B. Taylor 53 yd FG', 'Brock Taylor 53-yard field goal'),
 (1, '4:22', 'FLA', 'P. Durkin 40 yd FG', 'Patrick Durkin 40-yard field goal'),
 (2, '14:17', 'VAN', 'B. Taylor 52 yd FG', 'Brock Taylor 52-yard field goal'),
 (2, '12:43', 'VAN', 'B. Taylor 42 yd FG', 'Brock Taylor 42-yard field goal'),
 (2, '7:23', 'FLA', 'A. Philo run', 'Aaron Philo touchdown run (Patrick Durkin kick)'),
 (2, '5:27', 'FLA', 'recovered by M. Graham', 'Myles Graham %RET%-yard fumble return (Patrick Durkin kick)'),
 (2, '1:46', 'VAN', 'S. Alexander for 9 yds', 'Sedrick Alexander 9-yard pass from Jared Curtis (Curtis pass to Cole Spence for two)'),
 (2, '0:39', 'VAN', 'J. Sherrill for 75 yds', 'Junior Sherrill 75-yard pass from Jared Curtis (Brock Taylor kick)'),
 (3, '4:07', 'FLA', 'A. Philo run for 1 yd', 'Aaron Philo 1-yard touchdown run (Patrick Durkin kick)'),
 (4, '8:27', 'FLA', 'P. Durkin 20 yd FG', 'Patrick Durkin 20-yard field goal'),
 (4, '5:52', 'VAN', 'B. Taylor 51 yd FG', 'Brock Taylor 51-yard field goal'),
 (4, '2:18', 'FLA', 'J. Baugh run for 10 yds', 'Jadan Baugh 10-yard touchdown run (Patrick Durkin kick)'),
]
assert len(sp) == len(PLAYS) == 12, len(sp)
import re
ret = int(re.search(r'recovered by M\. Graham,\s+return\s+for (\d+) y', sp[5]['text']).group(1))
ABBR = {T['FLA']['team']['id']: 'FLA', T['VAN']['team']['id']: 'VAN'}
plays = []
for p, (q, clock, team, needle, text) in zip(sp, PLAYS):
    assert p['period']['number'] == q and p['clock']['displayValue'] == clock and ABBR[p['team']['id']] == team and needle in p['text'], (p['text'], needle)
    plays.append({'when': 'Q%d %s' % (q, clock), 'play': text.replace('%RET%', str(ret)), 'score': 'UF %d, VU %d' % (int(p['homeScore']), int(p['awayScore'])), 'uf': team == 'FLA', 'id': p['id']})
assert plays[-1]['score'] == 'UF 34, VU 27'
# win probability (Florida is the home team)
wp = d['winprobability']; pts = [round(x['homeWinPercentage'] * 100, 1) for x in wp]
assert 100 <= len(pts) <= 600 and pts[-1] == 100.0, (len(pts), pts[-1])
per = {}
for dv in d['drives']['previous']:
    for x in dv.get('plays', []): per[x['id']] = (x['period']['number'], x['clock']['displayValue'])
idx = {x['playId']: i for i, x in enumerate(wp)}
qstarts = [0]
for q in (2, 3, 4):
    qstarts.append(min(i for i, x in enumerate(wp) if per.get(x['playId'], (0,))[0] == q))
assert qstarts == sorted(qstarts) and len(set(qstarts)) == 4, qstarts
def pct(i): return int(round(pts[i]))
def mark(k, title, note):
    i = idx[plays[k]['id']]
    return {'i': i, 'title': title, 'note': '%s; Florida is at %d%%' % (note, pct(i))}
marks = [
 mark(5, '17-9', "Myles Graham's %d-yard fumble return with 5:27 left in the half" % ret),
 mark(7, '24-17', "Jared Curtis hits Junior Sherrill for 75 yards with 39 seconds left in the half"),
 mark(8, '24-24', "Aaron Philo scores from the 1 with 4:07 left in the third quarter"),
 mark(9, '27-24', "Patrick Durkin's 20-yard field goal with 8:27 to play"),
 mark(10, '27-27', "Brock Taylor's 51-yard field goal with 5:52 left"),
 mark(11, '34-27', "Jadan Baugh's 10-yard run with 2:18 left"),
]
start, half = pct(0), pct(qstarts[2] - 1)
low_i = min(range(len(pts)), key=lambda i: pts[i]); low = pct(low_i); low_q = per.get(wp[low_i]['playId'], (0,))[0]
ORD = {1: 'first', 2: 'second', 3: 'third', 4: 'fourth'}
assert low_q in ORD, low_q
CR = 'Photo by Chris Spears, GatorBait Media.'
def img(i, w, h, alt): return {'id': i, 'ext': 'jpg', 'width': w, 'height': h, 'alt': alt + ' ' + CR, 'credit': CR, 'uaa': False}
STORY = '/post/baugh-control-no-24-florida-rallies-past-vanderbilt-34-27-on-senior-day'
def of(s): return s.replace('/', ' of ').replace('-', ' of ')
f2, v2 = fq[2] + fq[3], vq[2] + vq[3]
issue = {
 '$comment': 'Vanderbilt postgame web edition (built Nov. 21, 2026): Florida 34, Vanderbilt 27, Senior Day, Ben Hill Griffin Stadium (ESPN event 401856748). Written by deploy/magazine-2026/postgame-vanderbilt/build_issue.py; every number is from ESPN at build time. No quotes: no transcript had arrived when this was built. Photos: Chris Spears, GatorBait Media, sent by the owner on Nov. 21; no player is named in alt text.',
 'id': '2026-11-21-postgame-vanderbilt',
 'layout': 'postgame',
 'issue': {'number': 'Postgame edition', 'date': 'Saturday, Nov. 21, 2026', 'week': 'Vanderbilt at Florida · Gainesville', 'home': 'GatorBait Media', 'pageTitle': 'GatorBait Magazine | Postgame: Florida %d, Vanderbilt %d' % (F, V)},
 'cover': {
  'kicker': 'Postgame · Senior Day',
  'coverTitle': 'Baugh Control',
  'score': {'away': 'Vanderbilt', 'awayScore': str(V), 'home': 'Florida', 'homeScore': str(F), 'label': 'Final'},
  'headline': 'Baugh Control: No. 24 Florida rallies past Vanderbilt 34-27 on Senior Day',
  'dek': "Jadan Baugh's 10-yard touchdown run with 2:18 left finished Florida's comeback from a 24-17 halftime deficit. The Gators outscored Vanderbilt %d-%d after halftime." % (f2, v2),
  'byline': 'By GatorBait Staff · Photos by Chris Spears',
  'cta': 'Read the game story',
  'url': STORY,
  'image': img('d3cfa5_a0d706482da646dd9b0272531c6adf7e', 970, 854, 'A close view of a Florida player in a blue No. 5 jersey smiling wide as a teammate wraps an arm around his shoulders, with the crowd behind them at Ben Hill Griffin Stadium, Nov. 21, 2026.'),  # owner, Nov. 21: "This great picture should be the cover"; a crop of d3cfa5_c51939d6 that keeps the player centered on the 9:16 phone poster
  'teasers': ["Baugh's 10-yard run with 2:18 left wins it", "Graham's %d-yard fumble return" % ret, 'Philo: %s yards passing, two rushing touchdowns' % philo['YDS'], "Chris Spears' best shots from The Swamp"],
  'linesLabel': 'Also inside',
  'lines': ["Chris Spears' Best Shots: the photo gallery", 'The halftime story and the quarter-by-quarter record', 'By the numbers, score by score and the box score', 'Game flow: how the lead changed hands', 'Up next: Florida at Florida State, Friday, Nov. 27'],
 },
 'final': {'label': 'Final', 'teams': [{'name': 'Vanderbilt', 'score': V}, {'name': 'Florida', 'rank': 'No. %d' % rank, 'score': F, 'won': True}],
           'meta': ['Saturday, Nov. 21', 'Ben Hill Griffin Stadium, Gainesville', 'Senior Day', 'Florida is %s, %s SEC' % (rec['FLA']['total'], rec['FLA']['vsconf'])]},
 'contents': {'label': 'In this issue', 'items': [{'id': 'coverage', 'label': 'The game package'}, {'id': 'damage', 'label': 'By the numbers'}, {'id': 'scoring', 'label': 'Score by score'}, {'id': 'box', 'label': 'Box score'}, {'id': 'flow', 'label': 'Game flow'}, {'id': 'next', 'label': 'Up next'}]},
 'coverage': {
  'kicker': 'The game package', 'title': 'Photos, the halftime story and every score', 'dek': 'Everything GatorBait published from The Swamp on Saturday.',
  'items': [
   {'rubric': 'Photos', 'author': 'Chris Spears', 'title': "Chris Spears' Best Shots: Florida 34, Vanderbilt 27", 'dek': 'Chris Spears had the sideline for the comeback. His best photos from The Swamp on Senior Day.', 'url': '/post/chris-spears-best-shots-florida-34-vanderbilt-27', 'lead': True,
    'image': img('d3cfa5_4b7988a0bd9c44bf9ed3765aac05f5c1', 1280, 854, 'A close view of a Florida player in a blue No. 5 jersey shouting in celebration as a smiling teammate grabs his shoulder.')},
   {'rubric': 'Halftime', 'author': 'GatorBait Staff', 'title': 'Flag Day in The Swamp: Vanderbilt leads No. 24 Florida 24-17 at halftime', 'dek': 'Vanderbilt scored 15 points in the final 1:46 of the half. Florida was flagged six times, three in the last two minutes.', 'url': '/post/flag-day-in-the-swamp-vanderbilt-leads-no-24-florida-24-17-at-halftime',
    'image': img('d3cfa5_1a44d3d034b54dda9c5e95423cad0585', 1620, 1080, 'A Florida player in a blue No. 12 jersey runs with the ball as a Vanderbilt defender in a white No. 24 jersey dives at him while officials look on.')},
   {'rubric': 'Quarter by quarter', 'author': 'GatorBait Staff', 'title': 'Live updates: Vanderbilt at No. 24 Florida', 'dek': 'Every score as it happened, the halftime and final team numbers, and 10 photos from the game.', 'url': '/post/live-updates-vanderbilt-at-no-24-florida',
    'image': img('d3cfa5_44f25c74ac5d4d889e0d38ecb35554ad', 1024, 648, 'Florida defenders in blue jerseys stand near a pile of Vanderbilt players in white at the line of scrimmage while one Florida player points a finger in the air.')},
  ]},
 'damage': {
  'kicker': 'By the numbers', 'title': '%d-%d after halftime' % (f2, v2),
  'dek': 'Florida trailed 24-17 at the half and gave up one field goal the rest of the way. The Gators finished with %s yards to Vanderbilt\'s %s and converted %s third downs.' % (tf['Total Yards'], tv['Total Yards'], of(tf['3rd down efficiency'])),
  'yards': {'label': 'Total yards', 'rows': [{'name': 'Florida', 'value': int(tf['Total Yards']), 'us': True}, {'name': 'Vanderbilt', 'value': int(tv['Total Yards'])}]},
  'stats': [
   {'value': tf['3rd down efficiency'], 'label': 'Florida third downs', 'detail': 'Vanderbilt converted %s.' % of(tv['3rd down efficiency'])},
   {'value': philo['YDS'], 'label': 'Aaron Philo passing yards', 'detail': '%s passing, plus %s rushing yards and two touchdowns.' % (of(philo['C/ATT']), philor['YDS'])},
   {'value': str(ret), 'label': "Yards on Myles Graham's fumble return", 'detail': 'The touchdown put Florida ahead 17-9. Graham also had %s tackles.' % graham['TOT']},
   {'value': '{:,}'.format(btotal) if btotal >= 1000 else str(btotal), 'label': "Jadan Baugh's season rushing yards", 'detail': '%s on Saturday. He needs %d at Florida State for 1,000.' % (baugh['YDS'], bneed)},
   {'value': taylor['FG'].replace('/', '-'), 'label': 'Brock Taylor field goals', 'detail': 'From 53, 52, 42 and 51 yards for Vanderbilt.'},
   {'value': tf['Penalties'], 'label': 'Florida penalties', 'detail': 'Six for 37 yards in the first half. Vanderbilt: %s.' % tv['Penalties']},
  ],
  'source': 'Source: ESPN box score (event %s).' % EVENT},
 'scoring': {
  'kicker': 'Score by score', 'title': 'How the points came',
  'dek': 'Vanderbilt led 24-17 at halftime after scoring 15 points in the final 1:46 of the second quarter. Florida scored the next 10, Vanderbilt tied it at 27 with 5:52 left, and Jadan Baugh scored with 2:18 to play.',
  'cols': ['1', '2', '3', '4', 'F'],
  'rows': [{'team': 'Vanderbilt', 'q': vq, 'f': V}, {'team': 'Florida', 'rank': 'No. %d' % rank, 'q': fq, 'f': F, 'us': True}],
  'plays': [{k: p[k] for k in ('when', 'play', 'score', 'uf')} for p in plays],
  'source': 'Scoring plays and line score: ESPN. Times are game clock.'},
 'box': {
  'kicker': 'Box score', 'title': 'The full box score', 'dek': 'Team stats and the leaders for both teams.',
  'cols': ['Florida', 'Vanderbilt'],
  'rows': [
   ['First downs', tf['1st Downs'], tv['1st Downs']],
   ['Total yards', tf['Total Yards'], tv['Total Yards']],
   ['Passing', '%s, %s yds' % (tf['Comp/Att'], tf['Passing']), '%s, %s yds' % (tv['Comp/Att'], tv['Passing'])],
   ['Rushing', '%s yds on %s carries' % (tf['Rushing'], tf['Rushing Attempts']), '%s yds on %s carries' % (tv['Rushing'], tv['Rushing Attempts'])],
   ['Yards per rush', tf['Yards per rush'], tv['Yards per rush']],
   ['Third downs', tf['3rd down efficiency'], tv['3rd down efficiency']],
   ['Fourth downs', tf['4th down efficiency'], tv['4th down efficiency']],
   ['Penalties', tf['Penalties'], tv['Penalties']],
   ['Turnovers', tf['Turnovers'], tv['Turnovers']],
   ['Time of possession', tf['Possession'], tv['Possession']],
  ],
  'leaders': [
   {'team': 'Florida', 'items': [
    ['Passing', 'Aaron Philo: %s, %s yards' % (of(philo['C/ATT']), philo['YDS'])],
    ['Rushing', 'Jadan Baugh: %s carries, %s yards, 1 TD. Aaron Philo: %s carries, %s yards, 2 TD' % (baugh['CAR'], baugh['YDS'], philor['CAR'], philor['YDS'])],
    ['Receiving', 'Eric Singleton Jr.: %s catches, %s yards' % (sing['REC'], sing['YDS'])],
    ['Defense', 'Myles Graham: %s tackles, %d-yard fumble return for a touchdown' % (graham['TOT'], ret)]]},
   {'team': 'Vanderbilt', 'items': [
    ['Passing', 'Jared Curtis: %s, %s yards, %s TD' % (of(curtis['C/ATT']), curtis['YDS'], curtis['TD'])],
    ['Rushing', 'Sedrick Alexander: %s carries, %s yards' % (alex['CAR'], alex['YDS'])],
    ['Receiving', 'Junior Sherrill: %s catches, %s yards, %s TD' % (sher['REC'], sher['YDS'], sher['TD'])],
    ['Kicking', 'Brock Taylor: 4 of 4 on field goals (53, 52, 42, 51)']]}],
  'source': 'Team stats and leaders: ESPN box score (event %s).' % EVENT},
 'flow': {
  'kicker': 'Game flow', 'title': 'How the lead changed hands',
  'dek': "Florida's chance to win, play by play. The Gators started at %d%%, were at %d%% at halftime and fell as low as %d%% in the %s quarter before the comeback." % (start, half, low, ORD[low_q]),
  'axis': ['100%', '50%', '0%'], 'quarters': ['Q1', 'Q2', 'Q3', 'Q4'], 'quarterStarts': qstarts, 'points': pts, 'marks': marks,
  'summary': "Line chart of Florida's win probability against Vanderbilt. It starts near %d%%, is at %d%% at halftime, falls as low as %d%% in the %s quarter and ends at 100%% after Jadan Baugh's touchdown with 2:18 left and a fourth-down sack with 30 seconds left." % (start, half, low, ORD[low_q]),
  'source': 'Win probability: ESPN. GatorBait Media graphic.'},
 'next': {
  'kicker': 'Up next', 'title': 'Florida at Florida State',
  'meta': ['Friday, Nov. 27', '3:30 p.m. ET', 'Doak Campbell Stadium, Tallahassee'],
  'note': 'Florida is %s overall and %s in the SEC. The trip to Tallahassee closes the regular season.' % (rec['FLA']['total'], rec['FLA']['vsconf']),
  'pickem': {'badge': 'Milestone watch', 'title': 'Baugh at %d' % btotal, 'text': 'Jadan Baugh ran for %s yards and the winning touchdown against Vanderbilt. He has %d for the season and needs %d at Florida State to reach 1,000.' % (baugh['YDS'], btotal, bneed)}},
 'reference': {'label': 'More GatorBait', 'links': [
   {'label': 'Schedule and results', 'url': '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#schedule'},
   {'label': 'Roster', 'url': '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#roster'},
   {'label': 'The Buddy Martin Show', 'url': '/the-buddy-martin-show'},
   {'label': 'GatorBait home', 'url': '/'}], 'top': 'Back to the cover'},
 'credits': {'label': 'Photo credits', 'uaa': False, 'other': ['Photos by Chris Spears, GatorBait Media.']},
 'asOf': 'Score, scoring plays, box score, leaders and win probability: ESPN (event %s), final.' % EVENT,
}
# Florida State's schedule entry, read from ESPN so the date and site are not typed from memory
ev = [e for e in get('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/57/schedule')['events'] if e['date'] > '2026-11-22']
assert ev and ev[0].get('shortName') == 'FLA @ FSU' and ev[0]['date'] == '2026-11-27T20:30Z' and ev[0]['competitions'][0]['venue']['fullName'] == 'Doak Campbell Stadium', ev[:1]
# limits the renderer applies (text is cut silently past these)
def chk(s, n, what): assert isinstance(s, str) and 0 < len(s) <= n, (what, len(s), s)
for t in issue['cover']['teasers']: chk(t, 60, 'teaser')
for t in issue['cover']['lines']: chk(t, 80, 'line')
chk(issue['cover']['coverTitle'], 40, 'coverTitle'); chk(issue['cover']['dek'], 600, 'dek'); chk(issue['cover']['byline'], 80, 'byline')
for m in issue['final']['meta']: chk(m, 60, 'final meta')
for s in issue['damage']['stats']: chk(s['value'], 12, 'stat value'); chk(s['label'], 60, 'stat label'); chk(s['detail'], 80, 'stat detail')
for p in issue['scoring']['plays']: chk(p['when'], 16, 'when'); chk(p['play'], 140, 'play'); chk(p['score'], 20, 'score')
for r in issue['box']['rows']: [chk(x, 30, 'box row') for x in r]
for t in issue['box']['leaders']: [chk(i[1], 160, 'leader') for i in t['items']]
for m in issue['flow']['marks']: chk(m['title'], 20, 'mark title'); chk(m['note'], 160, 'mark note')
chk(issue['flow']['summary'], 600, 'flow summary'); chk(issue['next']['note'], 300, 'next note'); chk(issue['next']['pickem']['text'], 300, 'pickem')
for it in issue['coverage']['items']: chk(it['title'], 200, 'title'); chk(it['dek'], 400, 'dek')
ids = [issue['cover']['image']['id']] + [it['image']['id'] for it in issue['coverage']['items']]
assert len(set(ids)) == len(ids), 'a photo is used twice'
txt = json.dumps(issue, ensure_ascii=False)
assert not re.search(r'gator\s*-?\s*country', txt, re.I) and not re.search('[—‘’“”]', txt), 'house style'
out = REPO / 'sports-live' / 'magazine-issue-vanderbilt-postgame.json'
out.write_text(json.dumps(issue, ensure_ascii=False, indent=1) + '\n')
print('wrote', out.relative_to(REPO), len(txt), 'chars | wp points', len(pts), 'quarter starts', qstarts, '| start %d%% half %d%% low %d%% (Q%d)' % (start, half, low, low_q))
for m in marks: print('  mark', m['i'], m['title'], '|', m['note'])
for p in issue['scoring']['plays']: print('  ', p['when'], '|', p['play'], '|', p['score'])
for s in issue['damage']['stats']: print('  stat', s['value'], '|', s['label'], '|', s['detail'])
print('  dek:', issue['damage']['dek']); print('  flow:', issue['flow']['dek'])
