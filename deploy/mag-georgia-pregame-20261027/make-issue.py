#!/usr/bin/env python3
"""Build sports-live/magazine-issue-pregame.json for the Georgia Week pregame edition (Oct. 31, 2026, Atlanta).

Every number comes from the ESPN snapshots in <espn-dir> (site.api.espn.com, fetched Oct. 27, 2026) or from the
FloridaGators.com pages named in the source lines; the editorial text is quoted or summarized from the published
posts in <posts.json> (tools/magazine-pdf/extract-posts.py). Nothing is typed from memory.

  python3 -I deploy/mag-georgia-pregame-20261027/make-issue.py <espn-dir> <posts.json> [out.json]

ESPN files expected in <espn-dir>: sum.json (summary?event=401856734), sb.json (scoreboard 20261031 groups=8), rank.json,
fla-sched.json, uga-sched.json, fla-stats.json, uga-stats.json (teams/{57,61}/statistics), fla-roster.json, uga-roster.json.
A compact copy of the figures the issue uses is written next to this script as espn-figures.json.
"""
import html, json, os, re, sys

ESPN, POSTS = sys.argv[1], sys.argv[2]
OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(__file__), '..', '..', 'sports-live', 'magazine-issue-pregame.json')
J = lambda n: json.load(open(os.path.join(ESPN, n), encoding='utf8'))
sum_, sb, rank, flaS, ugaS, flaT, ugaT, flaR, ugaR = (J(n) for n in ('sum.json', 'sb.json', 'rank.json', 'fla-sched.json', 'uga-sched.json', 'fla-stats.json', 'uga-stats.json', 'fla-roster.json', 'uga-roster.json'))
posts = {p['url']: p for p in json.load(open(POSTS, encoding='utf8'))['posts']}

# ---- game, line, predictor, ranks, records (ESPN summary + scoreboard + AP poll) ----
comp = sum_['header']['competitions'][0]
assert comp['neutralSite'] is True and comp['date'] == '2026-10-31T19:30Z'
teams = {t['team']['abbreviation']: t for t in comp['competitors']}
rec = lambda t, k: next(r['summary'] for r in teams[t]['record'] if r['type'] == k)
assert rec('FLA', 'total') == '5-2' and rec('FLA', 'vsconf') == '3-2' and rec('UGA', 'total') == '6-1' and rec('UGA', 'vsconf') == '4-1'
ap = next(r for r in rank['rankings'] if r['name'] == 'AP Top 25')
assert ap['occurrence']['displayValue'] == 'Week 9'
apr = {x['team']['abbreviation']: x['current'] for x in ap['ranks']}
assert apr['FLA'] == 17 and apr['UGA'] == 3 and teams['FLA']['rank'] == 17 and teams['UGA']['rank'] == 3
pc = sum_['pickcenter'][0]
assert pc['provider']['name'] == 'DraftKings' and pc['details'] == 'UGA -11.5' and pc['overUnder'] == 55.5
pred = sum_['predictor']
assert pred['homeTeam']['id'] == '61' and pred['awayTeam']['id'] == '57'
p_uga, p_fla = float(pred['homeTeam']['gameProjection']), float(pred['awayTeam']['gameProjection'])
venue = sum_['gameInfo']['venue']
assert venue['fullName'] == 'Mercedes-Benz Stadium' and venue['address']['city'] == 'Atlanta' and venue['grass'] is False
assert sum_.get('injuries', []) == []

# ---- season stats (ESPN team statistics, seven games each) ----
def stat(doc, cat, name, opp=False):
    cats = doc['results']['opponent'] if opp else doc['results']['stats']['categories']
    for c in cats:
        if c['name'] == cat:
            for s in c['stats']:
                if s['name'] == name:
                    return float(s['displayValue'].replace(',', ''))
    raise KeyError((cat, name, opp))
def scores(sched, abbr):
    pf = pa = g = 0
    for e in sched['events']:
        c = e['competitions'][0]
        if c['status']['type']['name'] != 'STATUS_FINAL': continue
        me = next(t for t in c['competitors'] if t['team']['abbreviation'] == abbr)
        them = next(t for t in c['competitors'] if t['team']['abbreviation'] != abbr)
        pf += int(me['score']['displayValue']); pa += int(them['score']['displayValue']); g += 1
    return pf, pa, g
fla_pf, fla_pa, fla_g = scores(flaS, 'FLA'); uga_pf, uga_pa, uga_g = scores(ugaS, 'UGA')
assert fla_g == 7 and uga_g == 7 and stat(flaT, 'general', 'gamesPlayed') == 7 and stat(ugaT, 'general', 'gamesPlayed') == 7
assert round(fla_pf / 7, 1) == stat(flaT, 'scoring', 'totalPointsPerGame') and round(uga_pf / 7, 1) == stat(ugaT, 'scoring', 'totalPointsPerGame')
r1 = lambda x: round(x + 1e-9, 1)
F = {
    'ppg': r1(fla_pf / 7), 'pa': r1(fla_pa / 7),
    'ypg': stat(flaT, 'passing', 'yardsPerGame'), 'rush': stat(flaT, 'rushing', 'rushingYardsPerGame'), 'ypc': stat(flaT, 'rushing', 'yardsPerRushAttempt'),
    'pass': stat(flaT, 'passing', 'netPassingYardsPerGame'), 'rushA': stat(flaT, 'rushing', 'rushingYardsPerGame', True), 'passA': stat(flaT, 'passing', 'netPassingYardsPerGame', True),
    'third': r1(stat(flaT, 'miscellaneous', 'thirdDownConvPct')), 'thirdA': r1(stat(flaT, 'miscellaneous', 'thirdDownConvPct', True)),
    'poss': r1(stat(flaT, 'miscellaneous', 'possessionTimeSeconds') / 7 / 60), 'to': stat(flaT, 'miscellaneous', 'turnOverDifferential'),
    'sacks': stat(flaT, 'defensive', 'sacks'), 'sacksA': stat(flaT, 'passing', 'sacks'),
}
G = {
    'ppg': r1(uga_pf / 7), 'pa': r1(uga_pa / 7),
    'ypg': stat(ugaT, 'passing', 'yardsPerGame'), 'rush': stat(ugaT, 'rushing', 'rushingYardsPerGame'), 'ypc': stat(ugaT, 'rushing', 'yardsPerRushAttempt'),
    'pass': stat(ugaT, 'passing', 'netPassingYardsPerGame'), 'rushA': stat(ugaT, 'rushing', 'rushingYardsPerGame', True), 'passA': stat(ugaT, 'passing', 'netPassingYardsPerGame', True),
    'third': r1(stat(ugaT, 'miscellaneous', 'thirdDownConvPct')), 'thirdA': r1(stat(ugaT, 'miscellaneous', 'thirdDownConvPct', True)),
    'poss': r1(stat(ugaT, 'miscellaneous', 'possessionTimeSeconds') / 7 / 60), 'to': stat(ugaT, 'miscellaneous', 'turnOverDifferential'),
    'sacks': stat(ugaT, 'defensive', 'sacks'), 'sacksA': stat(ugaT, 'passing', 'sacks'),
    'ypcA': stat(ugaT, 'rushing', 'yardsPerRushAttempt', True), 'cmp': stat(ugaT, 'passing', 'completionPct'), 'ypa': stat(ugaT, 'passing', 'yardsPerPassAttempt'),
}
# ESPN's own "points allowed" line for Georgia (108, 15.4) is three points under the sum of its seven final scores (111), so both
# teams' points for and against are figured from ESPN's final scores and the source line says so.
assert fla_pa == 198 and uga_pa == 111

# ---- leaders (ESPN game summary, season to date) ----
L = {}
for t in sum_['leaders']:
    for cat in t['leaders']:
        lead = cat['leaders'][0]
        L[(t['team']['abbreviation'], cat['name'])] = (lead['athlete']['displayName'], lead['displayValue'])
assert L[('FLA', 'rushingYards')] == ('Jadan Baugh', '135 CAR, 763 YDS, 13 TD')
assert L[('UGA', 'passingYards')] == ('Gunner Stockton', '117/158, 1,570 YDS, 16 TD, 4 INT')
assert L[('FLA', 'passingYards')] == ('Aaron Philo', '105/149, 1,341 YDS, 9 TD, 3 INT')
assert L[('FLA', 'receivingYards')] == ('Dallas Wilson', '29 REC, 403 YDS, 3 TD')
assert L[('UGA', 'rushingYards')] == ('Dwight Phillips Jr.', '47 CAR, 348 YDS, 2 TD')
assert L[('UGA', 'receivingYards')] == ('Craig Dandridge', '17 REC, 310 YDS, 1 TD')
assert L[('FLA', 'sacks')] == ('Jayden Woods', '4.5') and L[('UGA', 'sacks')] == ('Raylen Wilson', '4')

# ---- SEC slate, Oct. 31 (ESPN scoreboard, groups=8) ----
ET = {'16:45Z': '12:45 p.m.', '19:30Z': '3:30 p.m.', '20:15Z': '4:15 p.m.', '23:30Z': '7:30 p.m.', '23:45Z': '7:45 p.m.'}
slate = []
for e in sorted(sb['events'], key=lambda e: e['date']):
    c = e['competitions'][0]
    away = next(t for t in c['competitors'] if t['homeAway'] == 'away'); home = next(t for t in c['competitors'] if t['homeAway'] == 'home')
    side = lambda t: {'name': t['team']['location'], 'rec': t['records'][0]['summary'], **({'rank': t['curatedRank']['current']} if t['curatedRank']['current'] <= 25 else {})}
    o = c['odds'][0]
    g = {'time': ET[e['date'][11:]], 'tv': c['broadcasts'][0]['names'][0], 'away': side(away), 'home': side(home), 'line': o['details'].replace('UGA', 'UGA').replace('MISS ', 'MISS ').replace('OU ', 'OU ').replace('TEX ', 'TEX ').replace('MIZ ', 'MIZ '), 'ou': o['overUnder']}
    if e['id'] == '401856734':
        g['hero'] = True; g['note'] = 'Neutral site, Atlanta'
    slate.append(g)
assert len(slate) == 5 and slate[1]['hero']

# ---- rosters (ESPN team rosters, 100 players each) ----
def roster(doc):
    out = []
    for grp in doc['athletes']:
        if grp['position'] not in ('offense', 'defense', 'specialTeam'):
            assert not grp['items'], (grp['position'], [a['displayName'] for a in grp['items']])   # ESPN's out/suspended lists are empty on Oct. 27
            continue
        side = grp['position']
        for a in grp['items']:
            assert not a.get('injuries')
            out.append({'n': a.get('jersey', ''), 'name': a['displayName'], 'pos': a['position']['abbreviation'], 'cls': a.get('experience', {}).get('abbreviation', ''), 'side': side, 'st': ''})
    out.sort(key=lambda p: (int(p['n']) if p['n'].isdigit() else 999, p['name']))
    return out
fla_roster, uga_roster = roster(flaR), roster(ugaR)
assert len(fla_roster) == 100 and len(uga_roster) == 100

# ---- editorial text from the published posts ----
def paras(url, idx, strip_links=True):
    ps = re.findall(r'<(p|h[2-4]|blockquote)>(.*?)</\1>', posts[url]['html'])
    out = []
    for i in idx:
        tag, body = ps[i]
        body = re.sub(r'</?a[^>]*>', '', body) if strip_links else body
        out.append('<%s>%s</%s>' % (tag, body, tag))
    return ''.join(out)
def plain(url, i):
    return html.unescape(re.sub(r'<[^>]+>', '', re.findall(r'<(p|h[2-4]|blockquote)>(.*?)</\1>', posts[url]['html'])[i][1])).strip()
BUDDY = '/post/florida-georgia-sumrall-knows-the-math'; FRANZ = '/post/thoughts-of-the-day-october-27-2026'; BREN = '/post/snubbed-in-atlanta-gameday-kirby-florida'
assert plain(BUDDY, 1) == "You can't buy what Georgia has. You have to grow it."
assert plain(BUDDY, 13) == '"They\'re in Year 11," Sumrall said. "We\'re in Year One."'
assert plain(FRANZ, 10) == 'To put that in perspective, Georgia has won five consecutive games against Florida. The Gators last beat the Bulldogs in 2020.'
assert plain(BREN, 9) == 'Oh, and just one more thing. In Buster\'s offense, Kirby explained, "it doesn\'t require the quarterback to be perfect."'

SPEARS = 'Photo by Chris Spears, GatorBait Media'
UAA = 'Photo courtesy UAA and Hannah White'
img = lambda id_, ext, w, h, alt, credit: {'id': id_, 'ext': ext, 'width': w, 'height': h, 'alt': alt, 'credit': credit}

issue = {
 '$comment': 'GatorBait Magazine, Game Day edition (Georgia Week, Oct. 29-31, 2026): No. 17 Florida vs. No. 3 Georgia, Mercedes-Benz Stadium, Atlanta. Built by deploy/mag-georgia-pregame-20261027/make-issue.py from ESPN snapshots and the published posts; see that folder\'s README before shipping (cover image id and the members PDF post are filled in at ship time).',
 'id': '2026-10-30-game-day-georgia',
 'layout': 'pregame',
 'issue': {'number': 'Game Day Edition', 'name': 'Florida vs. Georgia', 'date': 'Saturday, October 31, 2026', 'week': 'Week 10 · Atlanta', 'tagline': 'Independent Florida Gators coverage', 'pageTitle': 'GatorBait Magazine | Game Day: Florida vs. Georgia'},
 'asOf': 'ESPN game summary (event 401856734), SEC scoreboard, team statistics, rosters and the AP Top 25 (Week 9, Oct. 25), DraftKings line via ESPN pickcenter, all read Oct. 27; FloridaGators.com broadcast information (Oct. 27) and series history. Columns as published on gatorbaitmedia.com.',
 'cover': {
  'kicker': 'Cover story · Buddy Martin',
  'headline': 'Sumrall Knows the Math',
  'dek': 'Year 11 against Year One. Buddy Martin on why Jon Sumrall is not telling Georgia who takes the snap, and on what the Bulldogs have that Florida still has to grow.',
  'byline': 'By Buddy Martin',
  'url': BUDDY,
  'lines': ['"You can\'t buy what Georgia has. You have to grow it." Buddy Martin', '"They\'re in Year 11. We\'re in Year One." Jon Sumrall, via Buddy Martin', '"Kirby isn\'t running a football program so much as a family farm." Buddy Martin'],
  'image': {'id': 'REPLACE_WITH_WIX_MEDIA_ID_AFTER_UPLOAD', 'ext': 'jpg', 'width': 1200, 'height': 1600, 'alt': 'GatorBait Magazine Game Day cover, Georgia Week 2026: Florida coach Jon Sumrall walks the field before kickoff under the GatorBait masthead, with the headline Georgia Week and the columns inside. File photo by Chris Spears, GatorBait Media.', 'credit': SPEARS},
  'poster': True,
  'todo': 'Ship step: upload deploy/pregame-cover-georgia-20261027/pregame-cover-georgia-1200x1600.jpg to the Wix Media Manager and put its media id here, then rebuild.'
 },
 'game': {
  'label': 'The game', 'kickoffISO': '2026-10-31T19:30:00Z', 'espnEvent': '401856734',
  'kickoff': 'Saturday, Oct. 31 · 3:30 p.m. ET', 'tv': 'ABC',
  'venue': 'Mercedes-Benz Stadium, Atlanta. Neutral site',
  'forecast': 'Indoors on artificial turf, per ESPN\'s venue listing. The game leaves Jacksonville for Atlanta this year while EverBank Stadium is renovated.',
  'teams': [
   {'rank': 'No. %d' % apr['FLA'], 'name': 'Florida', 'record': rec('FLA', 'total'), 'conf': rec('FLA', 'vsconf') + ' SEC', 'role': 'AP No. %d' % apr['FLA']},
   {'rank': 'No. %d' % apr['UGA'], 'name': 'Georgia', 'record': rec('UGA', 'total'), 'conf': rec('UGA', 'vsconf') + ' SEC', 'role': 'AP No. %d' % apr['UGA']}],
  'chips': [{'k': 'Line', 'v': 'Georgia -11.5'}, {'k': 'Total', 'v': '55.5'}, {'k': 'Series', 'v': 'UF trails 44-57-2'}],
  'predictor': {'label': 'ESPN matchup predictor', 'florida': p_fla, 'missouri': p_uga},
  'source': 'ESPN game summary and pickcenter (DraftKings), Oct. 27. Kickoff, TV and neutral site also on FloridaGators.com broadcast information, Oct. 27. Series count: FloridaGators.com opponent history.'
 },
 'series': {
  'label': 'The series', 'headline': 'Five straight for Georgia',
  'line': 'FloridaGators.com counts the series at Georgia 57, Florida 44, two ties, since 1915. Georgia has won the last five, all in Jacksonville, by a combined 177-87, the closest 24-20 last Nov. 1. Florida\'s last win was 44-28 in 2020; the Gators are 2-8 in the last 10.',
  'games': [{'year': 2021, 'site': 'N', 'fla': 7, 'mizz': 34}, {'year': 2022, 'site': 'N', 'fla': 20, 'mizz': 42}, {'year': 2023, 'site': 'N', 'fla': 20, 'mizz': 43}, {'year': 2024, 'site': 'N', 'fla': 20, 'mizz': 34}, {'year': 2025, 'site': 'N', 'fla': 20, 'mizz': 24}],
  'source': 'FloridaGators.com, football opponent history vs. Georgia (44-57-2, streak L5, last 10: 2-8; the 2025 final confirmed on ESPN, event 401752755). Georgia\'s own count includes a disputed 1904 game and reads 58-44-2.'
 },
 'numbers': {
  'label': 'By the numbers', 'note': 'Six figures that frame Saturday',
  'items': [
   {'value': '-11.5', 'label': 'Georgia, the line', 'note': 'Total 55.5. DraftKings line via ESPN pickcenter, Oct. 27.'},
   {'value': '%.1f%%' % p_uga, 'label': 'ESPN predictor, Georgia', 'note': 'Florida at %.1f%% in the ESPN matchup predictor.' % p_fla},
   {'value': 'L5', 'label': 'Florida in the series', 'note': 'Five straight Georgia wins. Florida\'s last was 44-28 in 2020. FloridaGators.com has the series at 44-57-2.'},
   {'value': '763', 'label': 'Baugh rushing yards', 'note': 'Jadan Baugh: 135 carries, 13 touchdowns. Georgia allows %.1f rushing yards a game at %.1f a carry.' % (G['rushA'], G['ypcA'])},
   {'value': '%.1f%%' % G['third'], 'label': 'Georgia on third down', 'note': 'Florida\'s defense allows %.1f%% on third down; the Florida offense converts %.1f%%.' % (F['thirdA'], F['third'])},
   {'value': '%.1f' % G['pa'], 'label': 'Georgia points allowed', 'note': 'A game, figured from ESPN\'s seven final scores. Florida scores %.1f and allows %.1f.' % (F['ppg'], F['pa'])}],
  'source': 'ESPN game summary and pickcenter (event 401856734), ESPN 2026 team statistics and schedules, Oct. 27; FloridaGators.com series history.'
 },
 'tape': {
  'label': 'Tale of the tape', 'note': 'Season, per game: both teams through seven games',
  'source': 'ESPN 2026 team statistics, Oct. 27. Points scored and allowed are figured from ESPN\'s final scores; possession minutes from ESPN\'s season possession seconds divided by games played.',
  'rows': [
   {'label': 'Points scored', 'fla': F['ppg'], 'miz': G['ppg'], 'unit': '', 'lower': False},
   {'label': 'Total yards', 'fla': F['ypg'], 'miz': G['ypg'], 'unit': '', 'lower': False},
   {'label': 'Rushing yards', 'fla': F['rush'], 'miz': G['rush'], 'unit': '', 'lower': False},
   {'label': 'Yards a carry', 'fla': F['ypc'], 'miz': G['ypc'], 'unit': '', 'lower': False},
   {'label': 'Passing yards', 'fla': F['pass'], 'miz': G['pass'], 'unit': '', 'lower': False},
   {'label': 'Points allowed', 'fla': F['pa'], 'miz': G['pa'], 'unit': '', 'lower': True},
   {'label': 'Rush yards allowed', 'fla': F['rushA'], 'miz': G['rushA'], 'unit': '', 'lower': True},
   {'label': 'Pass yards allowed', 'fla': F['passA'], 'miz': G['passA'], 'unit': '', 'lower': True},
   {'label': 'Third down %', 'fla': F['third'], 'miz': G['third'], 'unit': '', 'lower': False},
   {'label': 'Opp. third down %', 'fla': F['thirdA'], 'miz': G['thirdA'], 'unit': '', 'lower': True},
   {'label': 'Possession (minutes)', 'fla': F['poss'], 'miz': G['poss'], 'unit': '', 'lower': False}]
 },
 'keys': {
  'label': 'Four keys',
  'items': [
   {'h': 'Baugh against the best run defense he has seen', 'p': 'Jadan Baugh has 763 yards and 13 touchdowns on 135 carries, and Florida runs for %.1f a game. Georgia allows %.1f rushing yards a game at %.1f a carry, both the lowest figures on this page.' % (F['rush'], G['rushA'], G['ypcA'])},
   {'h': 'Third down, both ways', 'p': 'Georgia converts %.1f%% of its third downs and holds opponents to %.1f%%. Florida converts %.1f%% and allows %.1f%%. The Gators\' defense has %d sacks to Georgia\'s %d, and Georgia has allowed only %d.' % (G['third'], G['thirdA'], F['third'], F['thirdA'], F['sacks'], G['sacks'], G['sacksA'])},
   {'h': 'Stockton against a pass defense that allows %.0f a game' % F['passA'], 'p': 'Gunner Stockton is 117 of 158 for 1,570 yards, 16 touchdowns and four interceptions; Georgia completes %.1f%% at %.1f yards an attempt. Florida allows %.1f passing yards a game.' % (G['cmp'], G['ypa'], F['passA'])},
   {'h': 'The quarterback Sumrall will not name', 'p': 'Aaron Philo is 105 of 149 for 1,341 yards, nine touchdowns and three interceptions this season; Tramell Jones Jr. made his first start in the 27-24 win at Texas. Sumrall said Monday he is not telling Georgia who starts. Dallas Wilson leads the receivers with 29 catches for 403 yards.'}],
  'source': 'ESPN 2026 team statistics and game-summary leaders, Oct. 27 (both teams seven games). The quarterback line: Jon Sumrall\'s Monday press conference, as reported in Buddy Martin\'s column.'
 },
 'watching': {
  'label': 'What we’re watching', 'note': 'GatorBait Media writers, in their own words',
  'items': [
   {'by': 'Buddy Martin', 'line': 'You can\'t buy what Georgia has. You have to grow it, and Georgia has been out there fertilizing since the Obama administration.'},
   {'by': 'Franz Beard', 'line': 'Georgia has it. It is Sumrall\'s job to restore some sanity (that\'s from the Florida perspective) to the rivalry. More than half the players who will suit up for Florida Saturday have never played in this game.'},
   {'by': 'Brenden Martin', 'line': 'In Buster\'s offense, Kirby explained, "it doesn\'t require the quarterback to be perfect." I would just like it printed somewhere large, preferably where a Florida locker room can see it all week.'}],
  'source': 'Lines from the writers\' published columns on gatorbaitmedia.com, Oct. 26-27.'
 },
 'injuries': {
  'label': 'Availability',
  'asOf': 'ESPN lists no injuries for either team as of Tuesday, Oct. 27. The official SEC availability report posts later in the week on FloridaGators.com.',
  'teams': [],
  'source': 'Source: ESPN game summary (event 401856734) and team rosters, Oct. 27; official SEC availability report posts before kickoff'
 },
 'lead': {
  'label': 'The Lead', 'kicker': 'Franz Beard', 'author': 'Franz Beard',
  'title': 'Thoughts of the Day: Sumrall\'s first Florida-Georgia',
  'url': FRANZ,
  'html': paras(FRANZ, [1, 2, 3, 8, 10]),
  'continue': 'Read the full column', 'date': 'October 27, 2026',
  'image': img('16b519_fb9b6535ba3046ab86e7d0d05b6579bc', 'jpg', 3000, 2000, 'Florida coach Jon Sumrall walks the field before the Sept. 26, 2026, game against Ole Miss at Ben Hill Griffin Stadium. File photo by Chris Spears, GatorBait Media.', SPEARS),
  'caption': 'Jon Sumrall before the Ole Miss game, Sept. 26. File photo.'
 },
 'feature': {
  'label': 'The Big Picture', 'kicker': 'Brenden Martin on GameDay and Kirby', 'author': 'Brenden Martin', 'date': 'October 27, 2026',
  'title': 'Snubbed in Atlanta: GameDay passed, Kirby shrugged, Florida noticed',
  'dek': 'College GameDay went to Bloomington, Kirby Smart called Florida\'s quarterbacks "completely capable," and the rivalry moved 70 miles from his campus. Brenden Martin reads the transcripts.',
  'url': BREN,
  'continue': 'Read Brenden’s full column',
  'image': img('16b519_e1f8990a67f049c68d5b4da1e5fd17e9', 'jpg', 3000, 2024, 'Florida and Georgia players converge on a ball carrier during the Nov. 2, 2024, rivalry game in Jacksonville. File photo by Chris Spears, GatorBait Media.', SPEARS),
  'caption': 'Florida and Georgia in Jacksonville, Nov. 2, 2024. File photo.',
  'html': paras(BREN, [1, 2, 3, 4, 6, 7, 8, 9, 10])
 },
 'slate': {
  'label': 'Saturday in the SEC',
  'note': 'Five SEC games on Halloween. Kickoffs and TV: ESPN scoreboard. All times ET. The Soothsayer\'s picks post Friday on gatorbaitmedia.com.',
  'source': 'Kickoffs, TV, records, rankings and DraftKings lines: ESPN SEC scoreboard for Oct. 31 and the AP Top 25 (Week 9), read Oct. 27. Alabama, Kentucky, LSU, Tennessee, Texas A&M and Vanderbilt are idle.',
  'games': slate
 },
 'cards': {
  'label': 'Georgia week',
  'items': [
   {'kicker': 'Brenden Martin · Watch', 'title': 'We\'re live: Florida-Georgia talk on The Buddy Martin Show', 'url': '/post/buddy-martin-show-live-florida-georgia-october-26-2026',
    'excerpt': 'Monday\'s show, "Florida Gators: Sumrall Won\'t Name a QB for Georgia," streams on The Buddy Martin Show\'s YouTube channel. Tap through to the broadcast.',
    'image': img('d3cfa5_22e0015707214783949e6a1887a9641e', 'jpg', 2000, 1333, 'Florida coach Jon Sumrall celebrates with players in the locker room after the Oct. 17, 2026, win at Texas. Photo courtesy UAA and Hannah White.', UAA), 'date': 'Oct. 26'},
   {'kicker': 'Franz Beard · Thoughts of the Day', 'title': 'Thoughts of the Day: October 26, 2026', 'url': '/post/thoughts-of-the-day-october-26-2026',
    'excerpt': 'Georgia should be favored, Franz writes, and the people who set the lines agree. A Monday on the Bulldogs\' lone loss, the rivalry\'s two-year trip out of Jacksonville and what Florida has to do about it.',
    'image': img('d3cfa5_6a7cde2e9a71485b89faa934285c5f0e', 'jpg', 1600, 900, 'Florida-Georgia editorial illustration for Franz Beard\'s Thoughts of the Day, Oct. 26, 2026.', 'Illustration: GatorBait Media'), 'date': 'Oct. 26'},
   {'kicker': 'Brenden Martin · Game week', 'title': 'Florida-Georgia week: Atlanta kickoff, quarterback watch and fan plans', 'url': '/post/florida-georgia-week-atlanta-kickoff-quarterback-watch-and-fan-plans',
    'excerpt': 'The Gators return from the open date for a 3:30 p.m. ET Saturday kickoff on ABC. Monday\'s Gator Talk, the Atlanta pregame shows and the week\'s schedule, in one place.',
    'image': img('d3cfa5_22e0015707214783949e6a1887a9641e', 'jpg', 2000, 1333, 'Florida coach Jon Sumrall celebrates with players in the locker room after the Oct. 17, 2026, win at Texas. Photo courtesy UAA and Hannah White.', UAA), 'date': 'Oct. 25'},
   {'kicker': 'Buddy Martin', 'title': 'The Ninth Game Is Collecting Its Toll, One Body at a Time', 'url': '/post/the-ninth-game-is-collecting-its-toll-one-body-at-a-time',
    'excerpt': 'Florida-Georgia used to be about who wanted it more. On Oct. 31 in Atlanta, Buddy writes, it may come down to who has more players who can still walk without a limp.',
    'image': img('d3cfa5_65da416fd88a4a60a2c65e8b8c467e16', 'jpg', 1024, 602, 'Florida\'s defense swarms an Auburn ball carrier at Jordan-Hare Stadium on Sept. 19, 2026. File photo by Chris Spears, GatorBait Media.', SPEARS), 'date': 'Oct. 25'},
   {'kicker': 'Franz Beard', 'title': 'The Gators still have a pulse after Saturday\'s chaos', 'url': '/post/the-gators-still-have-a-pulse-after-saturdays-chaos',
    'excerpt': 'Three weeks ago the obituary was being written. Franz on Florida\'s revived SEC and playoff hopes after a Saturday of upheaval, with the contenders, the pretenders and six SEC recaps.',
    'image': img('d3cfa5_9211723882ad4d0bb44a05383761cff9', 'png', 1672, 941, 'Original GatorBait Media illustration for Franz Beard\'s Oct. 25, 2026, column.', 'Illustration: GatorBait Media'), 'date': 'Oct. 25'},
   {'kicker': 'Franz Beard · Thoughts of the Day', 'title': 'Sumrall restores hope as Texas faces a reckoning', 'url': '/post/thoughts-of-the-day-october-24-2026',
    'excerpt': 'Raise your hand if you thought two weeks ago that 6-6 would be a gift. Franz on Florida\'s renewed hope under Jon Sumrall, Urban Meyer\'s playoff concerns and the pressure on Texas.',
    'image': img('d3cfa5_e23da70ac8cf4fb387592bbc95e4e5c0', 'jpg', 3000, 1853, 'Jon Sumrall on the Florida sideline against Ole Miss at Ben Hill Griffin Stadium on Sept. 26, 2026. File photo by Chris Spears, GatorBait Media.', SPEARS), 'date': 'Oct. 24'},
   {'kicker': 'Franz Beard · The Soothsayer', 'title': 'Gators heal for Georgia as the SEC Soothsayer makes his picks', 'url': '/post/thoughts-of-the-day-october-23-2026',
    'excerpt': 'Both Florida and Georgia had the week off before Atlanta. Franz on the bye-week recovery, last Saturday\'s six SEC matchups and the NCAA\'s latest eligibility fight.',
    'image': img('d3cfa5_f51d42eaf631433485fbf86d44f340ef', 'png', 1672, 941, 'Editorial collage: Vernell Brown III at The Swamp, and Tramell Jones Jr. handing off to Jadan Baugh against Texas. Brown photo by Chris Spears, GatorBait Media; Jones and Baugh photo courtesy UAA and Hannah White.', 'Collage: GatorBait Media; photos by Chris Spears and courtesy UAA and Hannah White'), 'date': 'Oct. 23'},
   {'kicker': 'Buddy Martin · SEC Legends', 'title': 'From The Scout Team To Atlanta: Chris Doering Finally Gets His Due', 'url': '/post/from-the-scout-team-to-atlanta-chris-doering-finally-gets-his-due',
    'excerpt': 'He left in 1995 with 31 touchdown catches, still the school record. Buddy on the scout-team walk-on from P.K. Yonge who is now an SEC Football Legend.',
    'image': img('d3cfa5_29cf2a14d2d24b1387bd60638b380ead', 'jpeg', 1200, 1200, 'Chris Doering, named to the 2026 SEC Football Legends class. Photo: UAA/SEC.', 'Photo: UAA/SEC'), 'date': 'Oct. 22'},
   {'kicker': 'Buddy Martin', 'title': 'Gator Football Feel-Good: The Open Date Is Sweet Music, But Check the Lyrics', 'url': '/post/gator-football-feel-good-the-open-date-is-sweet-music-but-check-the-lyrics',
    'excerpt': 'Two words on a football schedule sound like a Merle Haggard ballad to a coach who has played seven straight Saturdays. Buddy on the open date and the lessons of past bye weeks.',
    'image': img('d3cfa5_90425d069f7d49ac9a55f5dedba27f93', 'jpg', 3000, 969, 'Ben Hill Griffin Stadium seen from the end zone. Photo by Chris Spears, GatorBait Media.', SPEARS), 'date': 'Oct. 21'},
   {'kicker': 'Franz Beard', 'title': 'Jones vs. Philo and other QB perceptions, realities', 'url': '/post/jones-vs-philo-and-other-qb-perceptions-realities',
    'excerpt': 'Five stars project greatness before the first snap. Franz on quarterback recruiting hype, the Aaron Philo and Tramell Jones Jr. decision and the history of Florida\'s five-star quarterbacks.',
    'image': img('d3cfa5_d0c4fd8ad08c4ec8bd70221064f3bdb8', 'jpg', 1320, 880, 'Florida quarterback Tramell Jones Jr. hands off to Jadan Baugh against Texas in Austin on Oct. 17, 2026. Photo courtesy UAA and Hannah White.', UAA), 'date': 'Oct. 21'}]
 },
 'shots': {
  'label': 'Best shots', 'note': 'From Florida 27, No. 7 Texas 24, the last time out',
  'url': '/post/gators-stun-no-7-texas-27-24-in-austin-behind-jones-jr',
  'credit': 'Photos courtesy UAA and Hannah White (FloridaGators.com)',
  'photos': [
   {'id': 'd3cfa5_22e0015707214783949e6a1887a9641e', 'ext': 'jpg', 'width': 2000, 'height': 1333, 'alt': 'Florida coach Jon Sumrall points skyward in the locker room after the win at Texas, Oct. 17, 2026. Photo courtesy UAA and Hannah White.', 'caption': 'Sumrall in the locker room'},
   {'id': 'd3cfa5_d47f942f03dd4051bcf27525bb61e968', 'ext': 'jpg', 'width': 2000, 'height': 1333, 'alt': 'Florida defensive back Kanye Clark (20) points skyward after recovering the game-sealing fumble against Texas, Oct. 17, 2026. Photo courtesy UAA and Hannah White.', 'caption': 'Kanye Clark with the game-sealing fumble'},
   {'id': 'd3cfa5_be419eb42b8f4aa883f5596690c79e0c', 'ext': 'jpg', 'width': 1320, 'height': 880, 'alt': 'Florida quarterback Tramell Jones Jr. (9) scrambles against Texas in Austin, Oct. 17, 2026. Photo courtesy UAA and Hannah White.', 'caption': 'Tramell Jones Jr. on the move'},
   {'id': 'd3cfa5_a38ad2951a7848bdb538476b28eb76c2', 'ext': 'jpg', 'width': 1320, 'height': 880, 'alt': 'Florida defenders gang-tackle a Texas ball carrier in Austin, Oct. 17, 2026. Photo courtesy UAA and Hannah White.', 'caption': 'The defense swarms'},
   {'id': 'd3cfa5_2f6744f26b44456cbbff97d6181203eb', 'ext': 'jpg', 'width': 2000, 'height': 1333, 'alt': 'Florida players, including quarterback Tramell Jones Jr. (9), celebrate in the locker room after beating Texas, Oct. 17, 2026. Photo courtesy UAA and Hannah White.', 'caption': 'The locker room after Austin'}]
 },
 'watch': {
  'label': 'How to watch',
  'items': [
   {'k': 'Kickoff', 'v': 'Saturday, Oct. 31, 3:30 p.m. ET'},
   {'k': 'TV', 'v': 'ABC (Chris Fowler, Kirk Herbstreit, Holly Rowe)'},
   {'k': 'Stream', 'v': 'ESPN app (ESPN on ABC), with a TV-provider login'},
   {'k': 'Radio', 'v': 'Gator Sports Network, pregame from 12:15 p.m. ET; SiriusXM 145 and the SiriusXM app; ESPN Gainesville WRUF and The Varsity Network'},
   {'k': 'Pregame TV', 'v': 'SEC Nation from Atlanta on Saturday morning'},
   {'k': 'Where', 'v': 'Mercedes-Benz Stadium, Atlanta. Neutral site'}],
  'links': [
   {'label': 'Monday\'s Buddy Martin Show: Sumrall won\'t name a QB for Georgia', 'url': 'https://www.youtube.com/watch?v=Uc-hO2his0I'},
   {'label': 'The live-show post, with the watch link', 'url': '/post/buddy-martin-show-live-florida-georgia-october-26-2026'}],
  'source': 'Sources: FloridaGators.com broadcast information (Oct. 27) and SEC Nation announcement (Oct. 24); ESPN game summary'
 },
 'rosters': {
  'label': 'Rosters', 'note': 'Tap a team to see every player. Injury status from the official availability report, once it posts.',
  'source': 'Both rosters: ESPN (read Oct. 27; 100 players listed for each team). Availability: ESPN; the official SEC report posts before kickoff.',
  'teams': [{'name': 'Florida', 'sub': 'Gators', 'players': fla_roster}, {'name': 'Georgia', 'sub': 'Bulldogs', 'players': uga_roster}]
 },
 'reference': {
  'label': 'Reference desk',
  'links': [
   {'label': 'Roster', 'url': '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#roster'},
   {'label': 'Schedule and results', 'url': '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#schedule'},
   {'label': 'Georgia week guide', 'url': '/post/florida-georgia-week-atlanta-kickoff-quarterback-watch-and-fan-plans'},
   {'label': 'Postgame magazine: Texas', 'url': '/magazine'},
   {'label': 'The Buddy Martin Show', 'url': '/the-buddy-martin-show'}],
  'next': 'Next up: Oklahoma in Gainesville, Saturday, Nov. 7, 7:45 p.m. ET, SEC Network.'
 },
 'pdf': {
  'label': 'Members: download this issue (PDF)',
  'url': '/post/members-read-the-georgia-pregame-magazine',
  'note': 'All Access members get the full print edition and the phone edition of every Game Day and postgame issue.',
  'todo': 'Ship step: create the members post at this slug with both PDFs attached (or change the slug here) before the embed is patched.'
 }
}
# The reference link "Postgame magazine: Texas" points at /magazine only until the Georgia edition replaces it; drop it at ship time.
issue['reference']['links'] = [l for l in issue['reference']['links'] if l['url'] != '/magazine']

json.dump(issue, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
json.dump({'read': '2026-10-27', 'event': '401856734', 'ap': {'week': 'Week 9', 'FLA': apr['FLA'], 'UGA': apr['UGA']}, 'records': {'FLA': [rec('FLA', 'total'), rec('FLA', 'vsconf')], 'UGA': [rec('UGA', 'total'), rec('UGA', 'vsconf')]},
           'line': pc['details'], 'total': pc['overUnder'], 'predictor': {'FLA': p_fla, 'UGA': p_uga}, 'florida': F, 'georgia': G, 'points': {'FLA': [fla_pf, fla_pa], 'UGA': [uga_pf, uga_pa]},
           'leaders': {'%s %s' % k: v for k, v in L.items()}, 'slate': slate, 'series': {'source': 'FloridaGators.com opponent history', 'record': '44-57-2', 'streak': 'L5', 'last10': '2-8', 'last5': [[2021, 7, 34], [2022, 20, 42], [2023, 20, 43], [2024, 20, 34], [2025, 20, 24]], 'lastWin': [2020, 44, 28]}},
          open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'espn-figures.json'), 'w', encoding='utf8'), indent=1)
print('wrote', OUT, 'and espn-figures.json;', len(fla_roster), 'Florida and', len(uga_roster), 'Georgia players;', len(slate), 'SEC games')
