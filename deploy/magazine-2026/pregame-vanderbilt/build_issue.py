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
# Photos (owner direction, Nov. 20: "a bunch of different pictures", and "use anything from the last game at Kentucky", not Oklahoma).
# Every football picture in the issue is from the Nov. 14 win at Kentucky, each a different file, each with the credit its own story on
# the site carries. A player is named only where the jersey number shows and matches the ESPN roster (Philo 12, Wilson 6, Condon 21).
# The second build ran an All Gators image the owner sent; he then asked for a different picture, "another tight shot".
cover_img = pic('ae876a_bb52ae6e52ea458c89c9844843ed96c0', 'jpg', 960, 640, 'Florida quarterback Aaron Philo (12) jogs across the field with teammates during the Nov. 14, 2026, win at Kentucky.', 'Photo courtesy University of Florida (UAA).')
lead_img = pic('d3cfa5_9d90bd2c81974bf39a13495fc5b8eaf9', 'png', 2000, 1061, "A Florida player in a white road jersey raises the football in celebration on the Gators' sideline during the Nov. 14, 2026, win at Kentucky.", UAA + '.')
# Game-day build (Nov. 21): the writers' pieces run in full and take the photos that are their own covers on the site (the chest
# bump for Loren Meadows, Sumrall on the sideline for Eddie Gilley). There are five Kentucky photos in all, so the staff preview takes
# the podium photo and the availability and bowl stories run without one. Every file still runs once.
WRITER_PHOTO = {
 'loren': (pic('ae876a_93ffb4fa4f24421d8e65a421b14bd42f', 'jpg', 720, 480, "Florida's Dallas Wilson (6) and Aaron Philo (12) leap into a chest bump during the Nov. 14, 2026, win at Kentucky.", 'Photo courtesy of UAA.'),
           "Dallas Wilson (6) and Aaron Philo (12) celebrate during Florida's 21-14 win at Kentucky on Nov. 14."),
 'eddie': (pic('ae876a_d5fa38d9c98c4bfeb982f4831abbce73', 'jpg', 720, 480, 'Florida coach Jon Sumrall, in an orange hooded sweatshirt and a headset, gives a thumbs-up on the sideline at Kentucky.', 'Photo courtesy of UAA.'),
           'Florida coach Jon Sumrall on the sideline during the 21-14 win at Kentucky on Nov. 14.'),
 'buddy2': (pic('ae876a_2b633b0e71b64be2bc95275e3c26b484', 'png', 1200, 1200, 'A white Vanderbilt football helmet with a gold V on the side and a black face mask.', 'Photo credit: Riddell'),
            "But don't sleep on this V"),
 'senior': (pic('ae876a_b592a7d28a984e12858c09a4b0ebb45e', 'jpg', 812, 1000, 'A vintage black-and-white photo of a football player in a No. 37 jersey running with the ball.', 'Photo courtesy of Doak Walker Award.'),
            '"The Doaker" was a great player and great person.'),
}
PHOTO = {
 'preview': (pic('ae876a_5917eb4e36404c5daba6ddb47d5e9ef2', 'jpg', 1920, 1080, 'Florida coach Jon Sumrall sits at the podium after the 21-14 win at Kentucky on Nov. 14, 2026.', 'Photo courtesy University of Florida (UAA).'),
             'Jon Sumrall after the win at Kentucky, Florida\'s sixth of the season.'),
 'wooden': (pic('d3cfa5_00121cc44e254a40a9a887b5d0d1351e', 'jpg', 2000, 1333, 'Florida forward Alex Condon (21) shoots a 3-pointer over a Houston defender in Las Vegas on Nov. 18, 2026.', UAA + '.'),
            'Alex Condon shoots a 3-pointer against Houston in Las Vegas on Nov. 18.'),
}

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
 # Loren Meadows' analysis, Eddie Gilley's game-day piece and Buddy Martin's two columns run in full above (issue.features), not as cards.
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
 card('Buddy Martin · Column', 'Nov. 19', "Why I Am Starting To Hate 'The Mother Ship' Yet I Hate Nothing Else.", '/post/why-i-am-starting-to-hate-the-mother-ship-yet-i-hate-nothing-else',
      'ESPN cut its people. Now the people are cutting ESPN.'),
 card('Franz Beard · Column', 'Nov. 16', "The Gators, football, Sumrall and Newton's theory", '/post/the-gators-football-sumrall-and-newton-s-theory',
      "Franz Beard on how Florida's hiring of Jon Sumrall rippled through four SEC games on the weekend of Nov. 14, plus the coaches poll and a team-by-team SEC roundup."),
 card('Eddie Gilley · Grades', 'Nov. 16', 'Keys to the Win', '/post/keys-to-the-win',
      "Eddie Gilley grades the Gators position by position in the 21-14 win at Kentucky, from Jadan Baugh's tone-setting night to Aaron Philo's A-plus."),
]

# ---- Availability report (owner direction, Nov. 20: update the rosters, point everything at Vanderbilt) ----
# The SEC availability report as updated Friday, Nov. 20, as published by Hail Florida Hail on Nov. 21 (single outlet, read through a
# fetch summary), on top of the Thursday update as published by Gators Wire on Nov. 20 (the league's own page is not
# reachable from the build host). Every name is checked against the ESPN roster fetched above, which also supplies the position.
def roster_pos(team, name):
    key = lambda s: re.sub(r'[^a-z]', '', s.lower())
    hit = [p for _, rows in team['groups'] for p in rows if key(p[1]) == key(name)]
    assert len(hit) == 1, ('availability name not found exactly once on the ESPN roster', team['name'], name, [p[1] for _, rows in team['groups'] for p in rows if key(name.split()[-1 if not name.endswith(('Jr.', 'III')) else -2]) in key(p[1])])
    return hit[0]
def avail(team, rows):
    return [dict({'pos': roster_pos(team, n)[2], 'name': roster_pos(team, n)[1], 'status': st}, **({'detail': d} if d else {})) for n, st, d in rows]
FLA_AVAIL = [('Vernell Brown III', 'Out', ''), ('Lacota Dippre', 'Out', 'Jon Sumrall called the injury “pretty substantial” on Monday, Gators Wire reported.'), ('Emeka Ugorji', 'Out', ''),
             ('Jaden Robinson', 'Out', ''), ('DJ Coleman', 'Out', ''), ('Dijon Johnson', 'Out', 'Moved from doubtful to out on Friday.'),
             ('Bailey Stockton', 'Probable', 'Up from questionable. Sumrall: “I’d be shocked if he doesn’t play,” Gators Wire reported.'), ('Bryce Thornton', 'Probable', 'Up from questionable.')]
VAN_AVAIL = [(n, 'Out', '') for n in ('Blaze Berlowitz', 'Cobey Sellers', 'Edwin Kolenge', 'Josiah Broxton', 'Daniel Vollmer Jr.', 'Evan Hampton', 'Aaron Bryant', 'Gunner Givens', 'Ted Gregoire')]
injuries_block = {'label': 'Availability report', 'jump': 'Injury report',
 'asOf': 'SEC availability report as updated Friday, Nov. 20. The final version is due 90 minutes before kickoff.',
 'teams': [{'name': 'Florida', 'items': avail(fla_roster, FLA_AVAIL)}, {'name': 'Vanderbilt', 'items': avail(van_roster, VAN_AVAIL)}],
 'source': 'SEC availability report: Friday update as published by Hail Florida Hail on Nov. 21; earlier statuses per Gators Wire. Positions: ESPN rosters.'}

# ---- Magazine-only stories (owner direction, Nov. 20: "add them as magazine only") ----
# Four GatorBait Staff pieces written for this issue (the availability story also runs as a post on the site). Every football number is either computed above
# from ESPN or checked here against the ESPN summary, so the build stops if a leader line, a class or last season's record changed.
# Basketball: watch lists as reported by WRUF (Nov. 19) and FloridaGators.com; averages computed from ESPN box scores through Nov. 19.
# Bowl projections: Sports Illustrated and CBS Sports as reported by Gators Wire (Nov. 19); they are labelled as projections.
LEAD = {t['team']['id']: {c['name']: (c['leaders'][0]['athlete']['displayName'], c['leaders'][0]['displayValue']) for c in t['leaders']} for t in summ['leaders']}
EXPECT = {FLA: {'passingYards': ('Aaron Philo', '126/180, 1,486 YDS, 9 TD, 5 INT'), 'rushingYards': ('Jadan Baugh', '178 CAR, 905 YDS, 15 TD'), 'receivingYards': ('Dallas Wilson', '38 REC, 483 YDS, 3 TD'),
                'sacks': ('Jayden Woods', '6'), 'totalTackles': ('Myles Graham', '76')},
          VAN: {'passingYards': ('Jared Curtis', '170/264, 1,880 YDS, 8 TD, 8 INT'), 'receivingYards': ('Junior Sherrill', '63 REC, 847 YDS, 4 TD'), 'sacks': ('Issa Ouattara', '4'), 'totalTackles': ('Bryan Longwell', '73')}}
for tid, cats in EXPECT.items():
    for cat, want in cats.items(): assert LEAD[tid][cat] == want, ('the preview quotes this ESPN leader line and it changed', tid, cat, LEAD[tid][cat], want)
assert roster_pos(van_roster, 'Jared Curtis')[3] == 'Fr.', 'the preview calls Jared Curtis a freshman'
assert cfp and upcoming and len(FLA_AVAIL) == 8 and sum(1 for r in FLA_AVAIL if r[1] == 'Out') == 6 and len(VAN_AVAIL) == 9
prior = [e['competitions'][0] for e in g(B + 'teams/%s/schedule?season=%d' % (FLA, SEASON - 1))['events']]
prior_w = sum(1 for c in prior for t in c['competitors'] if t['team']['id'] == FLA and t.get('winner'))
assert (prior_w, len(prior) - prior_w) == (4, 8), ('the bowl story says Florida went 4-8 last season', prior_w, len(prior))
def P(*ps): return ''.join('<p>%s</p>' % p for p in ps)
fav = spread.split('-')[-1]
preview_html = P(
 "Florida (%s, %s SEC) plays its final home game of the season Saturday against Vanderbilt (%s, %s), a %s ET kickoff on %s. It is Senior Day at %s, and a win would be the Gators' seventh."
   % (rec['home']['total'], rec['home']['vsconf'], rec['away']['total'], rec['away']['vsconf'], ap_time(kick), tv, venue['fullName']),
 "Florida is No. %d in the College Football Playoff rankings and a %s-point favorite, with the total at %g, according to the %s line listed by ESPN. ESPN's matchup predictor gives the Gators a %.1f%% chance to win." % (cfp, fav, total, book, flaP),
 "Florida's defense has tightened. The Gators have allowed %.1f points a game over their last four after giving up %.1f a game over the four before that." % (last4, prev4),
 'Quarterback Aaron Philo has completed 126 of 180 passes for 1,486 yards with nine touchdowns and five interceptions. Jadan Baugh has run 178 times for 905 yards and 15 touchdowns, and Dallas Wilson has 38 catches for 483 yards and three scores. Jayden Woods leads the defense with six sacks, Myles Graham with 76 tackles.',
 'Vanderbilt averages %s points a game and allows %s; Florida averages %s and allows %s. Freshman quarterback Jared Curtis has thrown for 1,880 yards with eight touchdowns and eight interceptions, and Junior Sherrill has 63 catches for 847 yards and four touchdowns. Bryan Longwell leads the Commodores with 73 tackles and Issa Ouattara with four sacks.'
   % (tape[0]['miz'], tape[1]['miz'], tape[0]['fla'], tape[1]['fla']),
 'Both teams are short-handed. Florida listed six players out on the SEC availability report as updated Friday, among them wide receiver Vernell Brown III and tight end Lacota Dippre, and Vanderbilt listed nine. The full lists are in the availability report in this issue.',
 'Florida has won %d of the %d meetings since %d, including the last one, %d-%d in %s on %s, %d.' % (wins, wins + losses, FIRST, last['fla'], last['van'], last['city'], ap_date(last['date']), last['year']),
 'After Saturday: ' + next_line(upcoming[0])[len('Next up: '):],
 '<em>Records, statistics, line and predictor: ESPN, %s. Availability: SEC report, updated Nov. 20, as published by Hail Florida Hail.</em>' % TODAY)
wooden_html = P(
 "Florida has three players on the John R. Wooden Award men's preseason Top 50 watch list, announced Wednesday, Nov. 18: Thomas Haugh, Alex Condon and Rueben Chinyelu.",
 'The SEC has 17 players on the list, WRUF reported, and any of the three would be the first Gator to win the award, which has been given since 1977.',
 'Haugh leads the three through seven games at 17.6 points and 6.9 rebounds a game, shooting 57.6% from the field and 18 of 35 on 3-pointers. Condon averages 12.9 points, 8.0 rebounds and 4.1 assists and has blocked 11 shots. Chinyelu averages 8.7 points and 6.9 rebounds and has made 20 of 32 shots, 62.5%.',
 'Florida is 6-1. The Gators host Milwaukee on Tuesday, Nov. 24, at 7 p.m. ET on SEC Network+ and Duke on Dec. 1 at 9:30 p.m. ET on ESPN.',
 "On the women's side, Kiyomi McMiller is on the Wooden Award preseason Top 50, according to FloridaGators.com. She averages 24.0 points, 4.3 rebounds and 3.5 assists through six games for Florida (4-2), which plays West Virginia on Nov. 24 and Davidson on Nov. 26 in the Battle 4 Atlantis.",
 "<em>Watch lists: Wooden Award announcements as reported by WRUF, Nov. 19, and FloridaGators.com. Averages are computed from ESPN box scores through Nov. 19; schedules are ESPN's.</em>")
bowl_html = P(
 'Florida is bowl eligible at %s, and two early projections have the Gators playing their postseason game in Florida.' % rec['home']['total'],
 'Sports Illustrated projects Florida against Nebraska in the ReliaQuest Bowl in Tampa on Dec. 31, Gators Wire reported Thursday. CBS Sports projects Florida against SMU in the Gator Bowl in Jacksonville, according to the same report.',
 'Projections are forecasts, not invitations. Bowl pairings are set after the conference championship games, and where Florida lands depends on how it finishes: Vanderbilt on Saturday, then ' + next_line(upcoming[0])[len('Next up: Florida at '):].split(',')[0] + ' on ' + ap_date(et(upcoming[0]['date'])) + '.',
 'Florida went %d-%d last season.' % (prior_w, len(prior) - prior_w),
 'Franz Beard looked at the bowl picture and Florida\'s No. %d CFP ranking in his <a href="/post/thoughts-of-the-day-november-18-2026">Thoughts of the Day for Nov. 18</a>.' % cfp,
 '<em>Projections: Sports Illustrated and CBS Sports, as reported by Gators Wire on Nov. 19. Records: ESPN.</em>')
injury_html = P(
 'Florida will be without six players Saturday against Vanderbilt, including wide receiver Vernell Brown III and tight end Lacota Dippre, according to the SEC availability report as updated Friday night.',
 'Offensive lineman Emeka Ugorji, linebacker Jaden Robinson and safety DJ Coleman are also listed out, and cornerback Dijon Johnson moved from doubtful to out on Friday. Wide receiver Bailey Stockton and safety Bryce Thornton moved from questionable to probable.',
 "Coach Jon Sumrall called Dippre's injury “pretty substantial” on Monday, Gators Wire reported. Of Stockton, Sumrall said, “I’d be shocked if he doesn’t play.”",
 'Dallas Wilson leads Florida with 38 catches for 483 yards and three touchdowns, according to ESPN.',
 'Vanderbilt listed nine players out: quarterback Blaze Berlowitz, cornerback Cobey Sellers, edge rusher Edwin Kolenge, linebackers Josiah Broxton and Daniel Vollmer Jr., running back Evan Hampton, defensive lineman Aaron Bryant and offensive linemen Gunner Givens and Ted Gregoire. Edge rusher Miles Capers came off the list Thursday, a sign he is cleared to play, Gators Wire reported.',
 'The SEC posts a final version of the report 90 minutes before kickoff. The full lists are in the availability report in this issue.',
 '<em>Player statuses: SEC availability report, Friday update as published by Hail Florida Hail on Nov. 21; earlier statuses and quotes as published by Gators Wire. Positions and statistics: ESPN.</em>')
for nm, pos in (('Vernell Brown III', 'WR'), ('Lacota Dippre', 'TE'), ('Emeka Ugorji', 'OL'), ('Jaden Robinson', 'LB'), ('DJ Coleman', 'S'), ('Dijon Johnson', 'CB'), ('Bailey Stockton', 'WR'), ('Bryce Thornton', 'S')):
    assert roster_pos(fla_roster, nm)[2] == pos, ('the injury story names this position', nm, roster_pos(fla_roster, nm)[2])
for nm, pos in (('Blaze Berlowitz', 'QB'), ('Cobey Sellers', 'CB'), ('Edwin Kolenge', 'EDGE'), ('Josiah Broxton', 'LB'), ('Daniel Vollmer Jr.', 'LB'), ('Evan Hampton', 'RB'), ('Aaron Bryant', 'DL'), ('Gunner Givens', 'OL'), ('Ted Gregoire', 'OL')):
    assert roster_pos(van_roster, nm)[2] == pos, ('the injury story names this position', nm, roster_pos(van_roster, nm)[2])
def STORY(key, kicker, title, dek, html):
    st = {'kicker': kicker, 'title': title, 'dek': dek, 'author': 'GatorBait Staff', 'date': 'Nov. 21, 2026', 'html': html}
    if key in PHOTO: st['image'], st['caption'] = PHOTO[key]
    return st
exclusives_block = {'label': 'Inside this issue', 'note': 'Four GatorBait Staff stories for Vanderbilt week', 'jump': 'Stories', 'items': [
 STORY('preview', 'Game preview · Vanderbilt at Florida', 'Home finale: Florida gets Vanderbilt with a seventh win in reach',
       'Senior Day, %s ET on %s. Florida is a %s-point favorite, and both teams come in short-handed.' % (ap_time(kick), tv, fav), preview_html),
 STORY('injury', 'Availability report', 'Six Gators out, nine Commodores out for the home finale',
       'Vernell Brown III, Lacota Dippre and Dijon Johnson are among the Florida players listed out. Vanderbilt will be without nine.', injury_html),
 STORY('wooden', 'Basketball · Wooden Award', 'Three Gators make the Wooden Award preseason Top 50',
       "Thomas Haugh, Alex Condon and Rueben Chinyelu are on the men's watch list. Kiyomi McMiller is on the women's.", wooden_html),
 STORY('bowl', 'Bowl outlook', 'Early bowl projections keep Florida in the state',
       'Sports Illustrated has the Gators against Nebraska in Tampa. CBS Sports has them against SMU in the Gator Bowl.', bowl_html)]}

# ---- The writers' pregame pieces, in full (owner direction, Nov. 21: "Add all the pregame articles to that magazine") ----
# Their words are not ours to change, so nothing is retyped here: the body of each piece is read from its public post at build
# time, block by block and in order, and the build stops if a piece comes back short or without its known opening and closing.
# Left out is page furniture only, and every block left out is printed: the in-body byline and site line, photo credit lines, the
# desk's pointers to this magazine and to the photo gallery, and the desk's kickoff-and-forecast note on Eddie Gilley's piece (the
# game card above carries the live forecast). Section heads become h3. Each piece ends with a link to its own page.
def esc(t): return html.escape(t, quote=False)
def norm_text(t): return re.sub(r'\s+', ' ', html.unescape(t).replace('\xa0', ' ')).strip()
def inline(inner):
    """Inline markup of one block: bold and italic are kept, links are kept only when they point at this site, the rest is text."""
    out, pos, links = [], 0, []
    for m in re.finditer(r'<(/?)([a-zA-Z0-9]+)\b([^>]*)>', inner):
        out.append(esc(html.unescape(inner[pos:m.start()]).replace('\xa0', ' '))); pos = m.end()
        close, tag, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if tag in ('strong', 'b'): out.append('</strong>' if close else '<strong>')
        elif tag in ('em', 'i'): out.append('</em>' if close else '<em>')
        elif tag == 'br': out.append(' ')
        elif tag == 'a' and close:
            if links and links.pop(): out.append('</a>')
        elif tag == 'a':
            h = re.search(r'href="([^"]*)"', attrs)
            rel = re.sub(r'^https?://(www\.)?gatorbaitmedia\.com', '', html.unescape(h.group(1)) if h else '')
            ok = bool(re.match(r'/[A-Za-z0-9]', rel)) and '"' not in rel
            links.append(ok)
            if ok: out.append('<a href="%s">' % esc(rel))
    out.append(esc(html.unescape(inner[pos:]).replace('\xa0', ' ')))
    t = re.sub(r'\s+', ' ', ''.join(out)).strip()
    for _ in range(3): t = re.sub(r'<(strong|em)>\s*</\1>', '', t)
    return t
def post_blocks(path):
    """(id, tag, inline html, plain text) for every text block of a public post, in page order."""
    page = urllib.request.urlopen(urllib.request.Request('https://www.gatorbaitmedia.com%s?cb=%d' % (path, int(time.time())), headers={'User-Agent': 'Mozilla/5.0'}), timeout=90).read().decode('utf-8')
    blocks = []
    for m in re.finditer(r'<(p|h[1-6]|blockquote|li)\b[^>]*\bid="viewer-([^"]+)"[^>]*>', page):
        tag, depth, pos, rx, n = m.group(1), 1, m.end(), re.compile(r'<(/?)%s\b[^>]*>' % m.group(1)), None
        while depth:
            n = rx.search(page, pos)
            assert n, ('unclosed block', path, m.group(2))
            depth += -1 if n.group(1) else 1; pos = n.end()
        inner = page[m.end():n.start()]
        blocks.append((m.group(2), tag, inline(inner), norm_text(re.sub(r'<[^>]+>', '', inner))))
    return page, blocks
FURNITURE = [r'By (Buddy Martin|Loren Meadows|Eddie Gilley)$', r'gatorbaitmedia\.com$', r'(?i)photo (credit|courtesy)\b.{0,70}$',
             r'Both teams’ rosters and the injury list are in the Vanderbilt pregame magazine\.', r'Photos from the Nov\. 14 game at Kentucky, courtesy UAA']
WRITERS = [
 dict(key='loren', path='/post/pregame-analysis-no-24-florida-gators-6-4-4-4-vs-vanderbilt-commodores-4-6-1-6', author='Loren Meadows', kicker='Loren Meadows · Pregame analysis', date='Nov. 21, 2026',
      title='Pregame Analysis: No. 24 Florida Gators (6-4, 4-4) vs. Vanderbilt Commodores (4-6, 1-6)', dek_id='lm-dek', skip=(), blocks=18,
      first='The Florida Gators have been one of the most enigmatic teams', last='Loren Meadows is GatorBaitMedia.com’s football analyst', must=('Groza semifinalist Brock Taylor', 'Prediction: Florida 21, Vanderbilt 10')),
 dict(key='eddie', path='/post/4-crucial-areas-to-watch-florida-vs-vanderbilt', author='Eddie Gilley', kicker='Eddie Gilley · Game day', date='Nov. 21, 2026',
      title='4 Crucial Areas To Watch: Florida vs. Vanderbilt', dek='The weather, the turf, the cleats and the atmosphere in the Swamp: four things to watch when Florida hosts Vanderbilt at noon.', skip=('eg-note',), blocks=5,
      first='No. 1 – The Weather.', last='Until we get to kickoff, we will not know the answers', must=('No. 2 – The Turf.', 'No. 3 – The Cleats.', 'No. 4 – The Atmosphere.')),
 dict(key='buddy2', path='/post/two-games-to-change-the-story', author='Buddy Martin', kicker='Buddy Martin · Column', date='Nov. 20, 2026',
      title='Two Games To Change the Story. One Saturday Is Not A Turnaround.', dek='', skip=('gqpk0604',), blocks=12,
      first='Beat Vanderbilt. Then beat Florida State.', last='First, take care of Vanderbilt.', must=('What Kentucky showed', 'A finish worth playing for')),
 dict(key='senior', path='/post/senior-day-at-florida-a-goodbye-we-re-not-quite-ready-to-say-goodbye-to-yet', author='Buddy Martin', kicker='Buddy Martin · Senior Day', date='Nov. 19, 2026',
      title="Senior Day at Florida: A Goodbye We're Not Quite Ready To Say Yet", dek='', skip=(), blocks=24,
      first='The seniors get their names called Saturday at The Swamp.', last='Across his entire six-season NFL career, Walker totaled 534 regular-season points', must=('I knew Doak Walker.', "But first there's Saturday.")),
]
def writer_story(w):
    page, blocks = post_blocks(w['path'])
    plain_page = norm_text(re.sub(r'<[^>]+>', '', re.sub(r'<(script|style)\b[\s\S]*?</\1>', '', page)))
    assert norm_text(w['title']) in plain_page, ('the headline is not on the public post as written here', w['title'])
    img, caption = WRITER_PHOTO[w['key']]
    assert norm_text(caption) in plain_page or w['key'] in ('loren', 'eddie'), ('caption is not on the public post', caption)
    dek, body, left_out = w.get('dek', ''), [], []
    for nid, tag, inl, plain in blocks:
        if not plain: continue
        if nid == w.get('dek_id'): dek = plain; continue
        if nid in w['skip'] or any(re.match(rx, plain) for rx in FURNITURE): left_out.append(plain[:70]); continue
        body.append(('<h3>%s</h3>' if tag[0] == 'h' else '<blockquote>%s</blockquote>' if tag == 'blockquote' else '<p>%s</p>') % inl)
    text_only = norm_text(re.sub(r'<[^>]+>', ' ', ''.join(body)))
    first, last = norm_text(re.sub(r'<[^>]+>', '', body[0])), norm_text(re.sub(r'<[^>]+>', '', body[-1]))
    assert len(body) >= w['blocks'], ('the piece came back short', w['key'], len(body))
    assert first.startswith(w['first']) and last.startswith(w['last']), ('opening or closing is not the one expected', w['key'], first[:60], last[:60])
    for needle in w['must']: assert needle in text_only, ('missing from the piece as read', w['key'], needle)
    print('writer piece: %-7s %2d blocks, %4d words; left out: %s' % (w['key'], len(body), len(text_only.split()), left_out))
    body.append('<p><em><a href="%s">Open this story on its own page</a></em></p>' % w['path'])
    return {'kicker': w['kicker'], 'title': w['title'], 'dek': dek, 'author': w['author'], 'date': w['date'], 'image': img, 'caption': caption, 'html': ''.join(body)}
features_block = {'label': 'From our writers', 'note': 'Loren Meadows, Eddie Gilley and Buddy Martin on Vanderbilt and Senior Day, in full', 'jump': 'Writers', 'items': [writer_story(w) for w in WRITERS]}

margin = int(F['totalTakeaways']) - int(F['totalGiveaways'])
issue = {
 '$comment': 'GatorBait Magazine, Pregame edition (Nov. 21, 2026: Vanderbilt at Florida). layout=pregame renders with renderPregame() in sports-live/src/magazine-pregame.js; teamSchedules and teamRosters are the pregame standards (owner rule, Nov. 20), rendered by src/magazine-pregame-standards.js, which the bundler adds only when those keys are present. Numbers: ESPN event %s, ESPN team statistics, schedules and rosters, fetched %s. injuries is the SEC availability report (Friday update, Nov. 20, as published by Hail Florida Hail); features are the pregame pieces by the writers in full, read from their public posts at build time (pgFeatures); exclusives are four GatorBait Staff stories written for this issue (pgExclusives), both in the standards file. No keys block (no Keys piece for this game on the site). The build never sends mail.' % (EVENT, TODAY),
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
 'injuries': injuries_block,
 'features': features_block,
 'exclusives': exclusives_block,
 'lead': {'label': 'The Soothsayer', 'kicker': 'Franz Beard · Senior Columnist', 'title': 'Improved defense will carry Gators to 7th win', 'url': FRANZ, 'image': lead_img, 'caption': 'Florida celebrates on the sideline at Kentucky on Nov. 14.', 'html': lead_html,
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
J = issue['injuries']; lim(J['label'], 40, 'injuries.label'); lim(J['jump'], 30, 'injuries.jump'); lim(J['asOf'], 200, 'injuries.asOf'); lim(J['source'], 160, 'injuries.source')
for t in J['teams']:
    assert len(t['items']) <= 20
    for x in t['items']: lim(x['pos'], 8, 'availability pos'); lim(x['name'], 60, 'availability name'); lim(x['status'], 24, 'availability status'); lim(x.get('detail', ''), 120, 'availability detail')
X = issue['exclusives']; lim(X['label'], 40, 'exclusives.label'); lim(X['note'], 160, 'exclusives.note'); lim(X['jump'], 30, 'exclusives.jump'); assert len(X['items']) <= 6
W = issue['features']; lim(W['label'], 40, 'features.label'); lim(W['note'], 160, 'features.note'); lim(W['jump'], 30, 'features.jump'); assert len(W['items']) <= 6
for x in X['items'] + W['items']:
    lim(x['kicker'], 80, 'story kicker'); lim(x['title'], 200, 'story title'); lim(x['dek'], 300, 'story dek'); lim(x['author'], 60, 'story author'); lim(x['date'], 40, 'story date'); lim(x['html'], 20000, 'story html')
    if x.get('image'): lim(x['caption'], 200, 'story caption'); lim(x['image']['alt'], 200, 'story alt'); lim(x['image']['credit'], 160, 'story credit')
assert all(x.get('image') for x in W['items']), "every writer's piece runs with its picture"
# house rules: no em dash in our own copy (a published headline keeps its own punctuation), one outlet is never named
flat = json.dumps({k: v for k, v in issue.items() if k not in ('lead', 'cards', 'features')}, ensure_ascii=False) + json.dumps([W['label'], W['note'], W['jump']] + [[x['kicker'], x['image']['alt'], x['image']['credit']] for x in W['items']] + [WRITERS[1]['dek']], ensure_ascii=False) + json.dumps([[c['kicker'], c['excerpt'], (c.get('image') or {}).get('alt', ''), (c.get('image') or {}).get('credit', '')] for c in cards], ensure_ascii=False)
assert '—' not in flat, 'em dash in copy written for this issue'
assert not re.search(r'gator\s*-?\s*country', json.dumps(issue), re.I)
lim(L['caption'], 200, 'lead.caption'); lim(L['image']['alt'], 200, 'lead alt'); lim(L['image']['credit'], 160, 'lead credit')
ids = [issue['cover']['image']['id'], L['image']['id']] + [x['image']['id'] for x in X['items'] + W['items'] if x.get('image')] + [c['image']['id'] for c in cards if c.get('image')]
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
