#!/usr/bin/env python3
"""Build sports-live/magazine-issue-vanderbilt.json (Pregame edition, Nov. 21, 2026: Vanderbilt at Florida).
Cover and lead: Franz Beard's Soothsayer (the Florida-Vanderbilt section in full, the rest linked to the one canonical post).
Every number comes from ESPN's public JSON API at build time (event 401856748: kickoff, TV, records, line, total, matchup
predictor, forecast; team statistics; team schedules, 2012-2025 for the series and 2026 for both schedules; both rosters; the
SEC scoreboard for the Sooth Board). Picks and columns are the writers' own words. Run from the repo root. Never sends mail and
never writes to Wix."""
import datetime, html, json, pathlib, re, sys, time, urllib.error, urllib.request
root = pathlib.Path(__file__).resolve().parents[3]
B = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/'
EVENT, FLA, VAN, SEASON = '401856748', '57', '238', 2026
def g(u):
    for wait in (2, 6, None):  # ESPN now and then answers one request in a burst with a 403 or 5xx: three tries, then stop
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=40))
        except (urllib.error.URLError, TimeoutError) as err:
            if wait is None: raise
            print('retrying in %ds: %s (%s)' % (wait, u.split('college-football/')[-1], err)); time.sleep(wait)

# ---- dates and style (AP) ----
AP_MONTH = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
def _sunday(y, m, n):
    d = datetime.date(y, m, 1); d += datetime.timedelta(days=(6 - d.weekday()) % 7)
    return d + datetime.timedelta(weeks=n - 1)
def et(iso):
    """ESPN's UTC stamp as Eastern time (EDT from the second Sunday of March to the first Sunday of November)."""
    u = datetime.datetime.strptime(iso[:16], '%Y-%m-%dT%H:%M')
    edt = datetime.datetime.combine(_sunday(u.year, 3, 2), datetime.time(7)) <= u < datetime.datetime.combine(_sunday(u.year, 11, 1), datetime.time(6))
    return u - datetime.timedelta(hours=4 if edt else 5)
def ap_date(d): return '%s %d' % (AP_MONTH[d.month - 1], d.day)
def ap_time(d):
    if (d.hour, d.minute) == (12, 0): return 'noon'
    if (d.hour, d.minute) == (0, 0): return 'midnight'
    return '%d%s %s' % ((d.hour + 11) % 12 + 1, ':%02d' % d.minute if d.minute else '', 'a.m.' if d.hour < 12 else 'p.m.')
def cap(s): return s[:1].upper() + s[1:]
def ap_num(n): return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][n] if 0 <= n < 10 else str(n)
now = et(datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M'))
TODAY = ap_date(now)
# AP state abbreviations for tables (eight states are never abbreviated)
AP_STATE = {'AL': 'Ala.', 'AK': 'Alaska', 'AZ': 'Ariz.', 'AR': 'Ark.', 'CA': 'Calif.', 'CO': 'Colo.', 'CT': 'Conn.', 'DE': 'Del.', 'DC': 'D.C.', 'FL': 'Fla.', 'GA': 'Ga.',
            'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Ill.', 'IN': 'Ind.', 'IA': 'Iowa', 'KS': 'Kan.', 'KY': 'Ky.', 'LA': 'La.', 'ME': 'Maine', 'MD': 'Md.', 'MA': 'Mass.',
            'MI': 'Mich.', 'MN': 'Minn.', 'MS': 'Miss.', 'MO': 'Mo.', 'MT': 'Mont.', 'NE': 'Neb.', 'NV': 'Nev.', 'NH': 'N.H.', 'NJ': 'N.J.', 'NM': 'N.M.', 'NY': 'N.Y.',
            'NC': 'N.C.', 'ND': 'N.D.', 'OH': 'Ohio', 'OK': 'Okla.', 'OR': 'Ore.', 'PA': 'Pa.', 'RI': 'R.I.', 'SC': 'S.C.', 'SD': 'S.D.', 'TN': 'Tenn.', 'TX': 'Texas',
            'UT': 'Utah', 'VT': 'Vt.', 'VA': 'Va.', 'WA': 'Wash.', 'WV': 'W.Va.', 'WI': 'Wis.', 'WY': 'Wyo.'}
SCHOOL = {'NC State': 'N.C. State'}  # ESPN's short name to AP style
def school(t): return SCHOOL.get(t['team']['location'], t['team']['location'])
def score(t): s = t.get('score'); return int(s['displayValue'] if isinstance(s, dict) else s)
def ranked(t): r = (t.get('curatedRank') or {}).get('current') or 99; return r if r <= 25 else None

# ---- ESPN: the game ----
summ = g(B + 'summary?event=' + EVENT)
comp = summ['header']['competitions'][0]
side = {t['homeAway']: t for t in comp['competitors']}
assert side['home']['team']['id'] == FLA and side['away']['team']['id'] == VAN, 'event %s is not Vanderbilt at Florida' % EVENT
assert comp['status']['type']['name'] == 'STATUS_SCHEDULED', 'the game is no longer scheduled: this is a pregame build'
week = summ['header']['week']
kick = et(comp['date']); kickISO = comp['date'][:16] + ':00Z'
tv = comp['broadcasts'][0]['media']['shortName']
venue = summ['gameInfo']['venue']; city = venue['address']['city']; state = AP_STATE[venue['address']['state']]
rec = {k: {r['type']: r['summary'] for r in side[k]['record']} for k in side}
fla_rank = side['home'].get('rank'); van_rank = side['away'].get('rank')
pc = summ['pickcenter'][0]; book = pc['provider']['name']
spread, total = pc['details'], pc['overUnder']
ml_h, ml_a = pc['homeTeamOdds']['moneyLine'], pc['awayTeamOdds']['moneyLine']
ml = lambda v: ('+%d' if v > 0 else '%d') % v
pred = summ['predictor']; flaP, vanP = float(pred['homeTeam']['gameProjection']), float(pred['awayTeam']['gameProjection'])
wx = summ['gameInfo'].get('weather') or {}
box = {t['team']['id']: {s['name']: float(s['displayValue']) for s in t['statistics']} for t in summ['boxscore']['teams']}
polls = {p['type']: {r['team']['id']: r['current'] for r in p['ranks']} for p in g(B + 'rankings')['rankings']}
cfp, ap = polls.get('cfp', {}).get(FLA), polls.get('ap', {}).get(FLA)
assert fla_rank == cfp, ('the rank ESPN shows on the game is not the CFP ranking', fla_rank, cfp)

if summ.get('injuries'):
    print('NOTICE: ESPN now lists injuries for this game. Add an availability block from this list before release:', json.dumps(summ['injuries'])[:1500])
def stat(tid):
    st = g(B + 'teams/%s/statistics' % tid)
    assert st['season']['year'] == SEASON
    d = {}
    for c in st['results']['stats']['categories']:
        for s in c['stats']:
            if s.get('value') is not None: d.setdefault(s['name'], s['value'])
    return d
F, V = stat(FLA), stat(VAN)
assert abs(F['totalPointsPerGame'] - box[FLA]['totalPointsPerGame']) < 0.06 and abs(V['yardsPerGame'] - box[VAN]['yardsPerGame']) < 0.06
gpF, gpV = int(F['gamesPlayed']), int(V['gamesPlayed'])
r1 = lambda x: round(x, 1)
row = lambda label, f, v, lower=False: {'label': label, 'fla': f, 'miz': v, 'unit': '', 'lower': lower}
tape = [
  row('Points scored', r1(F['totalPointsPerGame']), r1(V['totalPointsPerGame'])),
  row('Points allowed', box[FLA]['totalPointsPerGameAllowed'], box[VAN]['totalPointsPerGameAllowed'], True),
  row('Total yards', r1(F['yardsPerGame']), r1(V['yardsPerGame'])),
  row('Yards allowed', box[FLA]['yardsPerGameAllowed'], box[VAN]['yardsPerGameAllowed'], True),
  row('Rushing yards', r1(F['rushingYardsPerGame']), r1(V['rushingYardsPerGame'])),
  row('Passing yards', r1(F['passingYardsPerGame']), r1(V['passingYardsPerGame'])),
  row('Yards a carry', r1(F['yardsPerRushAttempt']), r1(V['yardsPerRushAttempt'])),
  row('Takeaways (season)', int(F['totalTakeaways']), int(V['totalTakeaways'])),
  row('Giveaways (season)', int(F['totalGiveaways']), int(V['totalGiveaways']), True),
  row('Penalty yards', r1(F['totalPenaltyYards'] / gpF), r1(V['totalPenaltyYards'] / gpV), True),
]

# ---- ESPN: the series since 2012, straight from Florida's schedules (Florida score first) ----
FIRST, LAST = 2012, SEASON - 1
series = []
for y in range(FIRST, LAST + 1):
    for ev in g(B + 'teams/%s/schedule?season=%d' % (FLA, y)).get('events', []):
        c = ev['competitions'][0]; by = {t['team']['id']: t for t in c['competitors']}
        if VAN in by and c['status']['type']['name'] == 'STATUS_FINAL':
            series.append({'year': y, 'site': 'H' if by[FLA]['homeAway'] == 'home' else 'A', 'fla': score(by[FLA]), 'van': score(by[VAN]),
                           'city': c['venue']['address']['city'], 'date': et(ev['date']), 'neutral': bool(c.get('neutralSite'))})
assert len(series) >= 10 and not any(s['neutral'] for s in series) and not any(s['fla'] == s['van'] for s in series), series
wins = sum(1 for s in series if s['fla'] > s['van']); losses = len(series) - wins
home = [s for s in series if s['site'] == 'H']; home_w = sum(1 for s in home if s['fla'] > s['van'])
last = series[-1]; van_last = [s for s in series if s['van'] > s['fla']][-1]
away_city = [s['city'] for s in series if s['site'] == 'A'][-1]
assert last['fla'] > last['van'] and all(s['city'] == city for s in home)
gap = [y for y in range(last['year'] + 1, LAST + 1)]
series_block = {
 'label': 'The series', 'headline': 'Florida %d-%d since %d' % (wins, losses, FIRST) + (', first meeting since %d' % last['year'] if gap else ''),
 'line': 'Florida has won %s of the %s meetings since %d and is %d-%d in %s over that stretch. The teams last met in %d, a %d-%d Florida win in %s. Vanderbilt\'s last win was %d-%d in %s in %d.' % (
     ap_num(wins), ap_num(len(series)), FIRST, home_w, len(home) - home_w, city, last['year'], last['fla'], last['van'], last['city'], van_last['van'], van_last['fla'], van_last['city'], van_last['year']),
 'games': [{'year': s['year'], 'site': s['site'], 'fla': s['fla'], 'mizz': s['van']} for s in series],
 'source': 'ESPN team schedules, %d-%d (Florida score first; H = %s, A = %s).' % (FIRST, LAST, city, away_city) + (' No meeting in %s.' % ' or '.join(map(str, gap)) if gap else '')}

# ---- ESPN: both 2026 schedules and both rosters (the pregame standards) ----
sched = {tid: g(B + 'teams/%s/schedule?season=%d' % (tid, SEASON)) for tid in (FLA, VAN)}
NETWORK = {'SECN+': 'SEC Network+'}  # ESPN's short name to the name viewers know
def games(tid):
    out = []
    for ev in sched[tid]['events']:
        c = ev['competitions'][0]; by = {t['team']['id']: t for t in c['competitors']}; me = by[tid]; opp = [t for t in c['competitors'] if t['team']['id'] != tid][0]
        d = et(ev['date']); neutral = bool(c.get('neutralSite'))
        name = ('No. %d ' % ranked(opp) if ranked(opp) else '') + school(opp) + (' (%s)' % c['venue']['address']['city'] if neutral else '')
        site = 'vs.' if neutral else '' if me['homeAway'] == 'home' else 'at'
        if c['status']['type']['name'] == 'STATUS_FINAL':
            a, b = score(me), score(opp)
            out.append([ap_date(d), site, name, 'W' if a > b else 'L' if a < b else 'T', '%d-%d' % (max(a, b), min(a, b)), '', 0])
        else:
            known = c.get('timeValid') and c['status']['type']['name'] == 'STATUS_SCHEDULED'
            nets = [b['media']['shortName'] for b in c.get('broadcasts', [])]
            out.append([ap_date(d), site, name, '', cap(ap_time(d)) if known else 'TBA', NETWORK.get(nets[0], nets[0]) if known and nets else '', 1 if ev['id'] == EVENT else 0])
    return out
played = {tid: [ev for ev in sched[tid]['events'] if ev['competitions'][0]['status']['type']['name'] == 'STATUS_FINAL'] for tid in sched}
fla_games, van_games = games(FLA), games(VAN)
assert len(fla_games) == 12 and sum(r[6] for r in fla_games) == 1 and sum(r[6] for r in van_games) == 1
tally = lambda rows: '%d-%d' % (sum(1 for r in rows if r[3] == 'W'), sum(1 for r in rows if r[3] == 'L'))
assert tally(fla_games) == rec['home']['total'] and tally(van_games) == rec['away']['total'], 'schedule results do not add up to the records on the game'
# points Florida allowed in its last four games and in the four before them (final scores on the schedule)
allowed = [score([t for t in ev['competitions'][0]['competitors'] if t['team']['id'] != FLA][0]) for ev in played[FLA]]
last4, prev4 = sum(allowed[-4:]) / 4, sum(allowed[-8:-4]) / 4
upcoming = [ev for ev in sched[FLA]['events'] if ev['competitions'][0]['status']['type']['name'] != 'STATUS_FINAL' and ev['id'] != EVENT]
assert spread.startswith('FLA -') and last4 == round(last4), ('the cover dek says Florida is favored and gives a whole number of points allowed', spread, last4)
assert not any([t for t in ev['competitions'][0]['competitors'] if t['team']['id'] == FLA][0]['homeAway'] == 'home' for ev in upcoming), 'the cover dek calls this the home finale'
def next_line(ev):
    c = ev['competitions'][0]; opp = [t for t in c['competitors'] if t['team']['id'] != FLA][0]; d = et(ev['date'])
    where = 'at' if [t for t in c['competitors'] if t['team']['id'] == FLA][0]['homeAway'] == 'away' else 'vs.'
    when = '%s, %s' % (d.strftime('%A'), ap_date(d)) + (', %s ET on %s' % (ap_time(d), c['broadcasts'][0]['media']['shortName']) if c.get('timeValid') and c.get('broadcasts') else '')
    return 'Next up: Florida %s %s, %s.' % (where, school(opp), when)

CLASS = {'FR': 'Fr.', 'SO': 'So.', 'JR': 'Jr.', 'SR': 'Sr.'}
GROUPS = [('offense', 'Offense'), ('defense', 'Defense'), ('specialTeam', 'Special teams'), ('injuredReserveOrOut', 'Injured or out'), ('suspended', 'Suspended'), ('practiceSquad', 'Practice squad')]
def hometown(a):
    bp = a.get('birthPlace') or {}
    if not bp.get('city'): return ''
    if bp.get('country') in (None, 'USA') and bp.get('state') in AP_STATE: return '%s, %s' % (re.sub(r'^Saint ', 'St. ', bp['city']), AP_STATE[bp['state']])  # AP: St. Augustine, Fla.
    return bp.get('displayText') or bp['city']
def roster(tid, label):
    r = g(B + 'teams/%s/roster?limit=1000' % tid)  # without a limit ESPN returns the first 100 athletes only (Florida and Vanderbilt each list 117)
    assert r['team']['id'] == tid and r['season']['year'] == SEASON
    by = {x['position']: x['items'] for x in r['athletes']}
    assert set(by) <= {k for k, _ in GROUPS}, set(by)
    groups, n = [], 0
    for key, name in GROUPS:
        rows = []
        for a in sorted(by.get(key, []), key=lambda a: (int(a['jersey']) if str(a.get('jersey', '')).isdigit() else 999, a.get('lastName', ''))):
            h, w = a.get('height'), a.get('weight')
            rows.append([int(a['jersey']) if str(a.get('jersey', '')).isdigit() else (a.get('jersey') or ''), a['displayName'], (a.get('position') or {}).get('abbreviation', ''),
                         CLASS.get((a.get('experience') or {}).get('abbreviation'), (a.get('experience') or {}).get('abbreviation', '')),
                         '%d-%d' % divmod(int(h), 12) if h else '', int(w) if w else '', hometown(a)])
        if rows: groups.append([name, rows]); n += len(rows)
    coach = ' '.join(filter(None, [(r.get('coach') or [{}])[0].get('firstName'), (r.get('coach') or [{}])[0].get('lastName')]))
    return {'name': label, 'jump': label + ' roster', 'note': '%d players' % n + (' · Head coach %s' % coach if coach else ''), 'groups': groups}, n
fla_roster, fla_n = roster(FLA, 'Florida'); van_roster, van_n = roster(VAN, 'Vanderbilt')
assert 85 <= fla_n < 1000 and 85 <= van_n < 1000, (fla_n, van_n)
# The rows above are ESPN's. Where the repo holds the FloridaGators.com roster (sports-live/florida-roster.json, the roster widget's
# data), say where the two disagree on a name or a jersey number so an editor can settle it; the issue is not changed here.
official = root / 'sports-live/florida-roster.json'
if official.exists():
    uf = json.loads(official.read_text(encoding='utf-8')); uf_no = {p['name']: str(p['no']) for p in uf['players']}
    espn_no = {p[1]: str(p[0]) for _, rows in fla_roster['groups'] for p in rows}
    odd = ['%s (ESPN %s, FloridaGators.com %s)' % (n, espn_no[n], uf_no[n]) for n in espn_no if n in uf_no and espn_no[n] != uf_no[n]]
    only = sorted(set(espn_no) ^ set(uf_no))
    print('roster cross-check with sports-live/florida-roster.json (%s): %d names in both' % (uf.get('updatedLabel', 'no date'), len(set(espn_no) & set(uf_no)))
          + ('; jersey numbers differ: ' + ', '.join(odd) if odd else '; every jersey number agrees') + ('; names in one list only: ' + ', '.join(only) if only else ''))

# ---- ESPN: Saturday's SEC scoreboard for the Sooth Board ----
sb = g(B + 'scoreboard?dates=%s&groups=8&limit=100' % kick.strftime('%Y%m%d'))
slate_ev = {}
for e in sb['events']:
    c = e['competitions'][0]; t = {x['homeAway']: x for x in c['competitors']}
    slate_ev[(t['away']['team']['location'], t['home']['team']['location'])] = (e, c, t)

def pic(i, ext, w, h, alt, credit):
    return {'id': i, 'ext': ext, 'width': w, 'height': h, 'alt': alt, 'credit': credit}
UAA = 'Photo courtesy UAA (University Athletic Association, FloridaGators.com)'
FRANZ = '/post/the-soothsayer-improved-defense-will-carry-gators-to-7th-win'
# Cover: the owner's pick for this magazine (Florida's sideline at Kentucky, Nov. 14). The alt text names no player.
cover_img = pic('d3cfa5_9d90bd2c81974bf39a13495fc5b8eaf9', 'png', 2000, 1061, 'A Florida player holds the football overhead on the sideline as teammates and staff celebrate behind him at Kentucky on Nov. 14, 2026.', UAA)

# ---- Franz Beard, The Soothsayer (published Nov. 20). His words exactly as published: the epigraph, the Florida-Vanderbilt section and
# his pick, in full. check_column() below compares every line here with the public post before the issue is written. ----
EPIGRAPH = '“Patience young Grasshopper” – Master Po to young Kwai Chang Caine from the 1970s television series “Kung Fu”'
lead_paras = [
 'When it comes to defense, patience was in rather short supply during Florida’s first six games of the season, particularly after a four-game stretch against Auburn, Ole Miss, Missouri and South Carolina. The Gators gave up a collective 150 points in those four games – two wins and two losses – an average of 438 total yards, 297 of which came through the air. Florida’s beleaguered secondary surrendered 10 touchdown passes while giving up 297 air yards.',
 'A funny thing happened on the way to a defensive clone of 2020 when the Third and Grantham Gators gave up 428 yards and 30.8 points per game. Midway through the season, the same Brad White whom many in the Gator Nation wanted to see exiled to Akron or UMass began finding a formula that would work. In the four games since the South Carolina disaster, the Gators have held opponents to a very respectable 297.25 yards and 22 points per game.',
 'After half a season of life with the defensive bottom feeders of the Southeastern Conference the Gators have moved up the ranks to 11th in the SEC and 64th nationally. To put it in better perspective, the Gators are giving up only 354.7 yards per game now, which, if it stands will be the best Florida defense since 2019.',
 'The improvement has been mostly subtle but occasionally spectacular. What the Gators did last week especially in the in the fourth quarter turned Kentucky’s playoff dreams into a nightmare finish. The Gators gave up a 15-play, 86-yard touchdown drive on UK’s first possession then held the Wildcats to a short-field touchdown and just 156 yards after that.',
 'On Kentucky’s last two possessions, the Gators got a fourth down stop when Aaron Chiles blitzed up the middle and planted Kenny Minchey just as he was throwing and a four-and-out that was all incompletions. That wouldn’t have happened prior to mid-October.',
 'The key word here has been patience. Head ball coach Jon Sumrall trusted White to bring the defensive troops along. A couple of tweaks that included some fairly exotic blitz packages significantly shortened the time opposing QBs have to throw the ball, lessening the time the young corners have to cover.',
 'It is a formula that has worked well and a reason why the Gators (6-4, 4-4 SEC) are favored by 13.5 points to take down Vanderbilt in the final home game of the season Saturday (12 noon, SEC Network). The Commodores don’t run the ball well at all (102 yards per game) and without the run threat to worry about the Gators should make life miserable for true freshman QB Jared Curtis.',
 'The way The Soothsayer views this one, it won’t take a lot of points to send Vandy packing back to Nashville but it will take another strong effort out of a defense that has matured to secure a seventh win and assure the Gators of just their second regular season winning record since 2020.',
]
SOOTH_LEAD = 'The Sayer Says Sooth!: Three touchdowns should get the job done for Florida which will move one step closer to an 8-win regular season.'
MARK = 'The Sayer Says Sooth!:'
assert SOOTH_LEAD.startswith(MARK)
e = lambda s: html.escape(s, quote=False)
lead_html = '<blockquote><p>%s</p></blockquote>' % e(EPIGRAPH) + ''.join('<p>%s</p>' % e(p) for p in lead_paras) + '<p class="pg-sooth"><strong>%s</strong>%s</p>' % (MARK, e(SOOTH_LEAD[len(MARK):]))

# The Sooth Board: one row for each SEC game the column gives a winner for. (away, home) as ESPN names them, Franz's pick, a few
# of his own words for the note (40 characters at most), and the sentences of his that carry the pick. A game with no stated
# winner is left off the board, never guessed.
SOOTH = [
 ('Vanderbilt', 'Florida', 'Florida', 'Three touchdowns should get the job done',
  ('Three touchdowns should get the job done for Florida which will move one step closer to an 8-win regular season.',)),
 ('Georgia', 'South Carolina', 'Georgia', 'South Carolina can dream',
  ('Georgia is favored by 14.5 points and it could be close for a half, but eventually the Bulldogs superior depth and mistake-free approach will pay off. South Carolina can dream, but that’s about it.',)),
 ('Chattanooga', 'Alabama', 'Alabama', 'Dial-a-score',
  ('Dial-a-score. Alabama will have this one bagged before halftime.',)),
 ('Arkansas', 'Texas', 'Texas', 'The cows win it',
  ('Texas beef vs. Arkansas pork. The cows win it but it’s going to be closer than the spread.',)),
 ('LSU', 'Tennessee', 'LSU', 'LSU knocks the Vols out of the playoff',
  ('Since LSU won’t make the playoff Lane Kiffin will turn this into the Tigers’ Super Bowl. LSU knocks the Vols out of the playoff in a chest clutcher.',)),
 ('Kentucky', 'Missouri', 'Missouri', 'This one is all Mizzou all the time',
  ('Jamal Roberts sets the tone between the tackles and Simmons goes over the top for a couple of touchdowns. Kentucky’s hangover from last week will factor into the outcome. This one is all Mizzou all the time.',)),
 ('Texas A&M', 'Oklahoma', 'Oklahoma', 'Sooners in a white knuckles affair',
  ('There won’t be a lot of points scored in this one, but Brent Venables doesn’t care because promoting Whitten has saved him from the Extinct Species List. Sooners in a white knuckles affair.',)),
 ('Wofford', 'Ole Miss', 'Ole Miss', 'The Grove will be rocking',
  ('There are two chances Ole Miss will lost to Wofford – no way and no how.',
   'At the midway point of the third quarter, the stands will empty and The Grove will be rocking.',)),
 ('Samford', 'Auburn', 'Auburn', 'It won’t be that close',
  ('Seven wins for first year coach Alex Golesh is the closest to a sure thing as you will find on the planet Saturday. Auburn is favored by 48.5 points. It won’t be that close.',)),
]
NO_PICK = {('Tennessee Tech', 'Mississippi State'): 'Mississippi State is favored by 35.5 points. For whom the cowbell tolls!'}  # no winner named
assert set(slate_ev) == {(a, h) for (a, h, *_ ) in SOOTH} | set(NO_PICK), ('ESPN slate and the column do not line up', sorted(slate_ev))
slate = []
for (a, h, pick, note, proof) in SOOTH:
    assert pick in (a, h) and len(note) <= 40 and any(note in p for p in proof), (a, h, note)
    ev, c, t = slate_ev[(a, h)]; o = (c.get('odds') or [{}])[0]; d = et(ev['date']); nets = [n for b in c.get('broadcasts', []) for n in b.get('names', [])]
    game = {'time': cap(ap_time(d)), 'tv': NETWORK.get(nets[0], nets[0]) if nets else '', 'away': {'name': a, 'rec': {r['type']: r['summary'] for r in t['away']['records']}['total']},
            'home': {'name': h, 'rec': {r['type']: r['summary'] for r in t['home']['records']}['total']}, 'line': o.get('details') or '', 'pick': pick, 'note': note}
    for k in ('away', 'home'):
        if ranked(t[k]): game[k]['rank'] = ranked(t[k])
    if o.get('overUnder'): game['ou'] = o['overUnder']
    if ev['id'] == EVENT: game['hero'] = True
    slate.append((ev['date'], 0 if ev['id'] == EVENT else 1, game))
slate = [x[2] for x in sorted(slate, key=lambda x: x[:2])]

def check_column():
    """Franz's words are not ours to change: every line quoted here must appear, character for character, in the public post."""
    try:
        page = urllib.request.urlopen(urllib.request.Request('https://www.gatorbaitmedia.com' + FRANZ, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read().decode('utf-8')
    except (urllib.error.URLError, TimeoutError, OSError) as err:
        print('WARNING: column check skipped, the public post was not reachable (%s). Compare the lead with the post by hand before release.' % err); return
    norm = lambda s: re.sub(r'\s+', ' ', html.unescape(s).replace('\xa0', ' ')).strip()
    text = norm(re.sub(r'<[^>]+>', '', re.sub(r'<(script|style)\b[\s\S]*?</\1>', '', page)))
    lines = [EPIGRAPH] + lead_paras + [SOOTH_LEAD] + [p for row in SOOTH for p in row[4]] + list(NO_PICK.values())
    missing = [l for l in lines if norm(l) not in text]
    if missing: sys.exit('STOP: these lines are not in the public post word for word (did the column change?):\n  ' + '\n  '.join(missing))
    print('column check: %d of %d quoted lines match the public post word for word' % (len(lines), len(lines)))
check_column()

def card(k, d, title, url, ex, img=None):
    c = {'kicker': k, 'date': d, 'title': title, 'url': url, 'excerpt': ex}
    if img: c['image'] = img
    return c
# This week's football stories, from the site's public feed and post pages (titles, bylines and dates as published). A card runs a
# photo only when it is the story's own art, its credit is on the post and it is not a prior-opponent game photo: the two recruiting
# stories (Oklahoma-game file photos), Buddy Martin's Nov. 17 column (its cover looks like the Sept. 26 Ole Miss game, which is
# banned), the Philo video-still story and the Thoughts of the Day (a basketball photo) run as text cards.
cards = [
 card('Buddy Martin · Column', 'Nov. 19', "Senior Day at Florida: A Goodbye We're Not Quite Ready To Say Yet", '/post/senior-day-at-florida-a-goodbye-we-re-not-quite-ready-to-say-goodbye-to-yet',
      'The seniors get their names called Saturday at The Swamp. The rest of us have to figure out when to say goodbye.',
      pic('ae876a_b592a7d28a984e12858c09a4b0ebb45e', 'jpg', 812, 1000, 'A vintage black-and-white photo of a football player in a No. 37 jersey running with the ball.', 'Photo courtesy of Doak Walker Award.')),
 card('GatorBait Staff · Video', 'Nov. 18', "The Week Gator Nation Couldn't Stop Watching", '/post/the-week-gator-nation-couldn-t-stop-watching',
      'The six clips and the Florida Gator Lowdown episode Gator Nation kept watching after the win at Kentucky, all in one place.',
      pic('d3cfa5_8891d99ac9b543d984fe88962cc75cb0', 'jpg', 1080, 608, 'A man in a blue Gators cap and hooded sweatshirt smiles during a news conference in front of a Florida Gators backdrop.', 'Video still: GatorBait Media.')),
 card('FloridaGators.com · Honors', 'Nov. 16', "Philo Earns SEC and Davey O'Brien Weekly Honors Following Performance at Kentucky", '/post/philo-earns-sec-and-davey-o-brien-weekly-honors-following-performance-at-kentucky',
      "Aaron Philo was named SEC Offensive Player of the Week and to the Davey O'Brien Great 8 after Florida's 21-14 win over No. 11 Kentucky.",
      pic('ae876a_df90455b00354189ac0e203add707a0b', 'jpg', 1920, 1080, 'Two men in blue Florida pullovers sit at a table with microphones during a news conference.', 'Photo courtesy University of Florida (UAA).')),
 card('Franz Beard · Column', 'Nov. 18', 'Thoughts of the Day: November 18, 2026', '/post/thoughts-of-the-day-november-18-2026',
      "Franz Beard on Florida's No. 24 CFP ranking and bowl outlook, the coaching carousel and where college sports are headed."),
 card('Buddy Martin · Column', 'Nov. 17', 'WHAT IT IS, WHAT IT WAS, AND WHAT IT SHALL BE!', '/post/what-it-is-what-it-was-and-what-it-shall-be',
      'Two weeks ago you were jumping off the bandwagon with such urgency that the ankle injuries set a record at Shands.'),
 card('GatorBait Staff · Recruiting', 'Nov. 18', 'Florida flips running back Terrance Grant Jr. from Maryland, loses Cain Van Norden', '/post/florida-flips-running-back-terrance-grant-jr-from-maryland-loses-cain-van-norden',
      'Running back Terrance Grant Jr. flipped from Maryland to Florida on Nov. 17, the same day lineman Cain Van Norden decommitted from the Gators.'),
 card('GatorBait Staff · Recruiting', 'Nov. 18', 'Maxwell Hiller, Easton Royal and the state of Florida Gators recruiting: the 2027 class is almost home, and 2028 is already rolling', '/post/maxwell-hiller-easton-royal-and-the-state-of-florida-gators-recruiting-the-2027-class-is-almost-ho',
      "Two top-five players in America, two flips in five days and a 2028 class already rolling: the first Gator Bait Recruiting Report on where Florida's classes stand."),
 card('GatorBait Staff · News', 'Nov. 17', "Philo Took a Kick to the Head From Kentucky's Gadson After His Go-Ahead TD — and No Flag Ever Came", '/post/philo-took-a-kick-to-the-head-from-kentucky-s-gadson-after-his-go-ahead-td-and-no-flag-ever-came',
      "Video of Aaron Philo's go-ahead touchdown at Kentucky appears to show a Kentucky player making a kicking motion toward his head. No flag was thrown."),
]

margin = int(F['totalTakeaways']) - int(F['totalGiveaways'])
issue = {
 '$comment': 'GatorBait Magazine, Pregame edition (Nov. 21, 2026: Vanderbilt at Florida). layout=pregame renders with renderPregame() in sports-live/src/magazine-pregame.js; teamSchedules and teamRosters are the pregame standards (owner rule, Nov. 20), rendered by src/magazine-pregame-standards.js, which the bundler adds only when those keys are present. Numbers: ESPN event %s, ESPN team statistics, schedules and rosters, fetched %s. No keys block (no Keys piece for this game on the site) and no availability block (ESPN lists none). No email or campaign send.' % (EVENT, TODAY),
 'id': '2026-11-21-vanderbilt-at-florida', 'layout': 'pregame', 'liveFeed': False,
 'issue': {'number': 'Vanderbilt Pregame', 'name': 'Vanderbilt at Florida', 'date': '%s, %s, %d' % (kick.strftime('%A'), ap_date(kick), kick.year),
           'week': 'Week %d · %s ET · %s · %s' % (week, cap(ap_time(kick)), tv, venue['fullName']),
           'tagline': 'Independent Florida Gators coverage', 'pageTitle': 'GatorBait Magazine | Pregame: Vanderbilt at Florida | %s, %d' % (ap_date(kick), kick.year)},
 'asOf': 'ESPN data as of %s, %d. Kickoff, line and forecast can move before kickoff; each linked story keeps its own publication date.' % (TODAY, now.year),
 'cover': {'kicker': 'The Soothsayer · Franz Beard', 'headline': 'Improved defense will carry Gators to 7th win',
           'dek': "Florida has held its last four opponents to %.0f points a game, and the Gators are %s-point favorites over Vanderbilt in the home finale. Franz Beard on the patience behind the defense's turnaround, with his picks across the SEC." % (last4, spread.split('-')[-1]),
           'byline': 'By Franz Beard', 'url': FRANZ, 'directLink': False, 'image': cover_img},
 'game': {'label': 'The game', 'kickoffISO': kickISO, 'espnEvent': EVENT, 'kickoff': '%s, %s · %s ET' % (kick.strftime('%A'), ap_date(kick), cap(ap_time(kick))), 'tv': tv,
          'venue': '%s, %s, %s · Senior Day' % (venue['fullName'], city, state),
          'teams': [{'name': 'Vanderbilt', 'record': rec['away']['total'], 'conf': rec['away']['vsconf'] + ' SEC'}, {'name': 'Florida', 'record': rec['home']['total'], 'conf': rec['home']['vsconf'] + ' SEC'}], 'separator': 'at',
          'chips': [{'k': 'Line', 'v': spread}, {'k': 'Total', 'v': '%g' % total}, {'k': 'Moneyline', 'v': 'FLA %s · VAN %s' % (ml(ml_h), ml(ml_a))}],
          'predictor': {'label': 'ESPN matchup predictor', 'florida': flaP, 'missouri': vanP},
          'source': 'ESPN summary and pickcenter (%s), event %s.' % (book, EVENT) + (' Florida is No. %d in the CFP rankings' % cfp + (', No. %d in the AP Top 25.' % ap if ap else '.') if cfp else '') + ' Senior Day: Buddy Martin, Nov. 19.'},
 'series': series_block,
 'numbers': {'label': 'By the numbers', 'note': 'Six figures that frame Saturday', 'items': [
   {'value': spread, 'label': 'Florida, the line', 'note': 'Total %g. %s line via ESPN pickcenter, %s.' % (total, book, TODAY)},
   {'value': '%.1f%%' % flaP, 'label': 'ESPN predictor, Florida', 'note': 'Vanderbilt at %.1f%% in the ESPN matchup predictor.' % vanP},
   {'value': '%d-%d' % (wins, losses), 'label': 'Florida since %d' % FIRST, 'note': 'Last meeting: Florida %d, Vanderbilt %d in %s, %s, %d.' % (last['fla'], last['van'], last['city'], ap_date(last['date']), last['year'])},
   {'value': '%.1f' % last4, 'label': 'Points allowed, last four games', 'note': 'Florida gave up %.1f a game over the four before that.' % prev4},
   {'value': '%+d' % margin, 'label': 'Florida turnover margin', 'note': 'Florida has %d takeaways and %d giveaways; Vanderbilt has %d and %d.' % (F['totalTakeaways'], F['totalGiveaways'], V['totalTakeaways'], V['totalGiveaways'])},
   {'value': '%.1f' % V['rushingYardsPerGame'], 'label': 'Vanderbilt rushing yards a game', 'note': 'Florida allows %.1f on the ground.' % box[FLA]['rushingYardsPerGameAllowed']}],
   'source': 'ESPN game summary, pickcenter, schedules and %d team statistics, %s.' % (SEASON, TODAY)},
 'teamSchedules': {'label': 'The schedules', 'note': "Florida's full %d schedule and Vanderbilt's, with every result so far" % SEASON, 'navLabel': 'Also in this issue', 'jump': 'Schedules', 'cols': ['Date', 'Opponent', 'Result'],
   'teams': [{'name': 'Florida', 'record': '%s, %s SEC' % (rec['home']['total'], rec['home']['vsconf']), 'games': fla_games}, {'name': 'Vanderbilt', 'record': '%s, %s SEC' % (rec['away']['total'], rec['away']['vsconf']), 'games': van_games}],
   'source': "ESPN team schedules, %s, %d. A ranking is the opponent's on game day, as ESPN lists it. Kickoffs are Eastern." % (TODAY, now.year)},
 'tape': {'label': 'Tale of the tape', 'note': 'Season, per game: %s games each' % ap_num(gpF) if gpF == gpV else 'Season, per game: Florida %d games, Vanderbilt %d' % (gpF, gpV),
          'source': 'ESPN %d team statistics and game summary, %s (penalty yards a game: season penalty yards over games played).' % (SEASON, TODAY), 'rows': tape},
 'lead': {'label': 'The Soothsayer', 'kicker': 'Franz Beard · Senior Columnist', 'title': 'Improved defense will carry Gators to 7th win', 'url': FRANZ, 'html': lead_html,
          'continue': 'Read the full column: Franz on every SEC game', 'date': 'Nov. 20, 2026'},
 'slate': {'label': 'The Sooth Board', 'note': '%s of Saturday\'s SEC games with Franz Beard\'s picks' % cap(ap_num(len(slate))),
           'source': 'Kickoffs (Eastern), TV, records and lines: ESPN, %s. Rankings: College Football Playoff. Picks and the words beside them: Franz Beard.' % TODAY, 'games': slate},
 'cards': {'label': 'More from Vanderbilt week', 'items': cards},
 'teamRosters': {'label': 'The rosters', 'note': 'Every player ESPN lists for both teams, by number', 'navLabel': 'Also in this issue', 'cols': ['No.', 'Name', 'Pos.', 'Cl.', 'Ht.', 'Wt.', 'Hometown'],
   'teams': [fla_roster, van_roster], 'source': "ESPN team rosters, %s, %d. Class, height, weight and hometown are ESPN's listings, with place names in AP style." % (TODAY, now.year)},
 'reference': {'label': 'Reference desk', 'links': [{'label': 'All current stories', 'url': '/gatorbait-media-blogs'}, {'label': 'The Buddy Martin Show', 'url': '/the-buddy-martin-show'}],
               'next': next_line(upcoming[0]) if upcoming else ''},
}
if fla_rank: issue['game']['teams'][1] = dict({'rank': 'No. %d' % fla_rank}, **issue['game']['teams'][1])
if van_rank: issue['game']['teams'][0] = dict({'rank': 'No. %d' % van_rank}, **issue['game']['teams'][0])
if wx.get('temperature') is not None:
    issue['game']['forecast'] = '%d°, %d%% chance of rain' % (wx['temperature'], int(wx.get('precipitation') or 0)) + (', gusts to %d mph' % wx['gust'] if wx.get('gust') else '') + ' (ESPN forecast)'

# ---- guards: the renderer trims long text silently, so stop here instead ----
def lim(v, n, what):
    assert isinstance(v, str) and len(v) <= n, '%s is %d characters; the renderer keeps %d: %r' % (what, len(v), n, v)
I, G = issue['issue'], issue['game']
for k, n in (('number', 60), ('name', 60), ('date', 60), ('week', 120), ('tagline', 120), ('pageTitle', 120)): lim(I[k], n, 'issue.' + k)
lim(issue['asOf'], 240, 'asOf'); lim(issue['cover']['dek'], 600, 'cover.dek'); lim(issue['cover']['image']['credit'], 160, 'cover credit'); lim(issue['cover']['image']['alt'], 200, 'cover alt')
for k, n in (('kickoff', 60), ('tv', 20), ('venue', 120), ('source', 160)): lim(G[k], n, 'game.' + k)
lim(G.get('forecast', ''), 120, 'game.forecast')
for c in G['chips']: lim(c['k'], 20, 'chip'); lim(c['v'], 40, 'chip')
for t in G['teams']: lim(t['name'], 30, 'team'); lim(t['record'], 12, 'record'); lim(t['conf'], 20, 'conf')
S = issue['series']; lim(S['headline'], 80, 'series.headline'); lim(S['line'], 300, 'series.line'); lim(S['source'], 160, 'series.source'); assert len(S['games']) <= 16
N = issue['numbers']; lim(N['note'], 120, 'numbers.note'); lim(N['source'], 160, 'numbers.source'); assert len(N['items']) <= 6
for x in N['items']: lim(x['value'], 16, 'number value'); lim(x['label'], 60, 'number label'); lim(x['note'], 120, 'number note')
T = issue['tape']; lim(T['note'], 100, 'tape.note'); lim(T['source'], 160, 'tape.source'); assert len(T['rows']) <= 12 and all(len(r['label']) <= 40 for r in T['rows'])
L = issue['lead']; lim(L['continue'], 160, 'lead.continue'); lim(L['html'], 20000, 'lead.html')
B2 = issue['slate']; lim(B2['note'], 160, 'slate.note'); lim(B2['source'], 160, 'slate.source'); assert len(B2['games']) <= 12
for x in B2['games']: lim(x['time'], 20, 'slate time'); lim(x['tv'], 20, 'slate tv'); lim(x['line'], 20, 'slate line'); lim(x['note'], 40, 'slate note')
assert len(cards) <= 18
for c in cards:
    lim(c['kicker'], 80, 'card kicker'); lim(c['title'], 200, 'card title'); lim(c['excerpt'], 300, 'card excerpt')
    if c.get('image'): lim(c['image']['credit'], 160, 'card credit'); lim(c['image']['alt'], 200, 'card alt')
lim(issue['reference']['next'], 200, 'reference.next')
for sec in ('teamSchedules', 'teamRosters'): lim(issue[sec]['note'], 160, sec + '.note'); lim(issue[sec]['source'], 300, sec + '.source')
for t in issue['teamSchedules']['teams']:
    lim(t['record'], 40, 'schedule record'); assert len(t['games']) <= 16
    for r in t['games']: lim(r[0], 12, 'schedule date'); lim(r[2], 60, 'schedule opponent'); lim(r[4], 20, 'schedule result'); lim(r[5], 30, 'schedule TV')
for t in issue['teamRosters']['teams']:
    lim(t['note'], 80, 'roster note'); assert len(t['groups']) <= 6 and all(len(rows) <= 90 for _, rows in t['groups'])
    for _, rows in t['groups']:
        for p in rows: assert len(p) == 7 and len(str(p[0])) <= 3 and len(p[1]) <= 60 and len(p[2]) <= 6 and len(p[3]) <= 6 and len(p[4]) <= 6 and len(str(p[5])) <= 4 and len(p[6]) <= 40, p
# house rules: no em dash in our own copy (a published headline keeps its own punctuation), one outlet is never named
flat = json.dumps({k: v for k, v in issue.items() if k not in ('lead', 'cards')}, ensure_ascii=False) + json.dumps([[c['kicker'], c['excerpt'], (c.get('image') or {}).get('alt', ''), (c.get('image') or {}).get('credit', '')] for c in cards], ensure_ascii=False)
assert '—' not in flat, 'em dash in copy written for this issue'
assert not re.search(r'gator\s*-?\s*country', json.dumps(issue), re.I)
ids = [issue['cover']['image']['id']] + [c['image']['id'] for c in cards if c.get('image')]
assert len(ids) == len(set(ids)), 'every photo is a distinct file'

def dump(obj):
    """indent=1 like the other issue files, but each roster or schedule row (an array of plain values) stays on one line."""
    s = json.dumps(obj, ensure_ascii=False, indent=1)
    atom = r'(?:"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|null|true|false)'
    out = re.sub(r'\[\n\s+((?:' + atom + r',\n\s+)*' + atom + r')\n\s+\]', lambda m: '[' + re.sub(r',\n\s+', ', ', m.group(1)) + ']', s)
    assert json.loads(out) == obj
    return out + '\n'
out = root / 'sports-live/magazine-issue-vanderbilt.json'
out.write_text(dump(issue), encoding='utf-8')
print('wrote', out, len(out.read_text(encoding='utf-8')), 'chars;', 'compact', len(json.dumps(issue, ensure_ascii=False, separators=(',', ':')).encode('utf-8')), 'bytes')
print('game:', G['kickoff'], '|', G['tv'], '|', G['venue'], '|', [(t.get('rank'), t['name'], t['record'], t['conf']) for t in G['teams']], '|', spread, total, ml(ml_h), ml(ml_a), '| predictor', flaP, vanP, '|', G.get('forecast'))
print('series:', S['headline'], '|', [(x['year'], x['site'], x['fla'], x['mizz']) for x in S['games']])
print('tape:', [(r['label'], r['fla'], r['miz']) for r in tape])
print('board:', [(x['time'], x['tv'], x['away']['name'], x['home']['name'], x['line'], x.get('ou'), x['pick']) for x in slate])
print('schedules:', len(fla_games), 'Florida rows,', len(van_games), 'Vanderbilt rows | rosters:', fla_n, 'Florida,', van_n, 'Vanderbilt')
