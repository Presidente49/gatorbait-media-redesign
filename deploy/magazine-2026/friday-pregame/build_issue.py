#!/usr/bin/env python3
"""Build sports-live/magazine-issue-pregame.json (Friday Pregame edition, Oct. 2, 2026).
Franz Beard's Soothsayer column is the lead: its Florida-at-Missouri section runs in full in the issue (the rest of the column,
the SEC slate prose and the hot-seat lists, stays on the canonical post, linked once). Every number comes from ESPN's JSON API
(fetched Oct. 1-2, 2026) or is marked GatorBait reporting. Run from the repo root. Never sends mail."""
import json, re, html, pathlib
root = pathlib.Path(__file__).resolve().parents[3]
HERE = pathlib.Path(__file__).parent
FRANZ_URL = '/post/the-soothsayer-gators-head-to-missouri-where-history-hasn-t-been-kind'  # confirmed after publish (release step)
GUIDE = '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play'
POLL = '/post/chomp-up-the-charts-florida-jumps-to-no-8-in-ap-coaches-polls'
FIRST = '/post/first-look-missouri-florida-gators-show-me-state-of-mind'

# ---- Franz's Missouri section (verbatim from his Oct. 2 file, with the desk fixes logged in #34) ----
runs = json.load(open(HERE / 'soothsayer-runs.json'))
def para(i):
    return ''.join(('**' + r['t'] + '**' if r['b'] else r['t']) for r in runs[i]).strip()
paras = [para(i) for i in range(0, 9)]  # the nine Florida-Missouri paragraphs
paras = [re.sub(r'\s+', ' ', p) for p in paras]
paras = [p.replace('throw for 299 yards', 'throw for 298 yards') for p in paras]
paras[5] = paras[5].rstrip() + ('' if paras[5].rstrip().endswith('.') else '.')
paras = [p.replace('****', '') for p in paras]
def link(p):
    p = p.replace('No. 8 national ranking', '<a href="%s">No. 8 national ranking</a>' % POLL)
    p = p.replace('when Missouri (3-1', 'when <a href="%s">Missouri</a> (3-1' % FIRST)
    p = p.replace('(3:30 p.m., ABC)', '(<a href="%s#schedule">3:30 p.m., ABC</a>)' % GUIDE)
    return p
def md(p):
    p = html.escape(p, quote=False)
    p = p.replace('&lt;a href=&quot;', '<a href="')
    p = re.sub(r'&lt;a href="([^"&]*)"&gt;', r'<a href="\1">', p).replace('&lt;/a&gt;', '</a>')
    p = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', p)
    return p
body = []
for i, p in enumerate(paras):
    p = link(p)
    if p.replace('**', '').startswith('The Sayer Says'):
        flat = p.replace('**', '').strip()
        assert flat.startswith('The Sayer Says Sooth!:')
        p = '**The Sayer Says Sooth!:**' + flat[len('The Sayer Says Sooth!:'):]
        body.append('<p class="pg-sooth">' + md(p) + '</p>')
    elif p.startswith('“We showed our not-our-standard'):
        body.append('<blockquote>' + md(p) + '</blockquote>')
    else:
        body.append('<p>' + md(p) + '</p>')
franz_html = ''.join(body)
plain = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', s))).strip()
assert '298 yards' in plain(franz_html) and '299' not in plain(franz_html)
assert 'Sayer Says Sooth!:' in plain(franz_html)

series = [  # ESPN team schedules 2012-2023, Florida score first
    (2012, 'H', 14, 7), (2013, 'A', 17, 36), (2014, 'H', 13, 42), (2015, 'A', 21, 3), (2016, 'H', 40, 14), (2017, 'A', 16, 45),
    (2018, 'H', 17, 38), (2019, 'A', 23, 6), (2020, 'H', 41, 17), (2021, 'A', 23, 24), (2022, 'H', 24, 17), (2023, 'A', 31, 33)]

def pic(i, w, h, alt, credit):
    pre, rest = i.split('~')[0], None
    return {'id': pre, 'ext': 'jpg', 'width': w, 'height': h, 'alt': alt, 'credit': credit}
SP = 'Photo by Chris Spears, GatorBait Media'

issue = {
  '$comment': 'GatorBait Magazine, Friday Pregame edition (Oct. 2, 2026). layout=pregame renders with renderPregame() in sports-live/src/magazine-pregame.js.',
  'id': '2026-10-02-friday-pregame', 'layout': 'pregame',
  'issue': {'number': 'Friday Pregame Edition', 'name': 'Florida at Missouri', 'date': 'Friday, October 2, 2026', 'week': 'Week 5 · Saturday 3:30 p.m. ET · ABC',
            'tagline': 'Independent Florida Gators coverage', 'pageTitle': 'GatorBait Magazine | Friday Pregame: Florida at Missouri'},
  'asOf': 'ESPN data as of Oct. 1-2, 2026. Kickoff, line and forecast can move before Saturday.',
  'cover': {'kicker': 'The Soothsayer · Franz Beard', 'headline': 'Gators head to Missouri, where history hasn’t been kind',
            'dek': 'No. 8 Florida (4-0) is 2-4 in Columbia since 2012 and has to find an emotional peak right after the biggest win in years. Franz Beard asks if the Gators are tough enough.',
            'byline': 'By Franz Beard', 'url': FRANZ_URL,
            'image': pic('16b519_a0e407bedc46487ca71033fc8351d0fe~mv2.jpg', 3000, 1874, 'Florida’s goal-line push against Ole Miss, with Jadan Baugh (13) in the pile (' + SP + ')', SP)},
  'game': {'label': 'The game', 'kickoffISO': '2026-10-03T19:30:00Z', 'kickoff': 'Saturday, Oct. 3 · 3:30 p.m. ET', 'tv': 'ABC', 'venue': 'Memorial Stadium (Faurot Field), Columbia, Mo.',
           'forecast': '71°, 0% chance of rain, gusts to 10 mph (ESPN forecast, Oct. 1)',
           'teams': [{'rank': 'No. 8', 'name': 'Florida', 'record': '4-0', 'conf': '2-0 SEC', 'role': 'AP No. 8 (up from No. 21)'},
                     {'rank': 'No. 25', 'name': 'Missouri', 'record': '3-1', 'conf': '0-1 SEC', 'role': 'AP No. 25 (down from No. 19)'}],
           'chips': [{'k': 'Line', 'v': 'Florida -5.5'}, {'k': 'Total', 'v': '57.5'}, {'k': 'Moneyline', 'v': 'FLA -218 · MIZ +180'}],
           'predictor': {'label': 'ESPN matchup predictor', 'florida': 70.2, 'missouri': 29.8},
           'source': 'ESPN game summary and pickcenter (DraftKings)'},
  'series': {'label': 'The series', 'headline': 'Six apiece since 2012',
             'line': 'Florida is 4-2 in Gainesville and 2-4 in Columbia in the 12 meetings since Missouri joined the SEC. They did not play in 2024 or 2025.',
             'games': [{'year': y, 'site': s, 'fla': f, 'mizz': m} for (y, s, f, m) in series], 'source': 'ESPN team schedules, 2012-2023'},
  'tape': {'label': 'Tale of the tape', 'note': 'Through four games, per game', 'source': 'ESPN team statistics', 'rows': [
      {'label': 'Points scored', 'fla': 53.5, 'miz': 35.8, 'unit': '', 'lower': False},
      {'label': 'Total yards', 'fla': 532.8, 'miz': 418.8, 'unit': '', 'lower': False},
      {'label': 'Rushing yards', 'fla': 260.0, 'miz': 155.8, 'unit': '', 'lower': False},
      {'label': 'Passing yards', 'fla': 272.8, 'miz': 263.0, 'unit': '', 'lower': False},
      {'label': 'Points allowed', 'fla': 22.8, 'miz': 20.8, 'unit': '', 'lower': True},
      {'label': 'Rush yards allowed', 'fla': 103.0, 'miz': 100.3, 'unit': '', 'lower': True},
      {'label': 'Pass yards allowed', 'fla': 248.3, 'miz': 218.3, 'unit': '', 'lower': True},
      {'label': 'Penalty yards', 'fla': 89.3, 'miz': 73.0, 'unit': '', 'lower': True}]},
  'keys': {'label': 'Three keys', 'items': [
      {'h': 'Baugh against a top-20 run defense', 'p': 'Florida runs for 260 yards a game and has 18 rushing touchdowns, tied for most in the country. Jadan Baugh has 600 yards and 11 touchdowns and has topped 100 in every game. Missouri allows 2.8 yards a carry, 19th nationally, and has given up two rushing touchdowns all season.'},
      {'h': 'Philo’s shots against a bend-don’t-break secondary', 'p': 'Aaron Philo’s 10.5 yards an attempt leads the SEC and he has been sacked twice in 104 throws. Missouri allows just 56% completions, but Mississippi State threw for 360 on the Tigers last week.'},
      {'h': 'Third downs and Austin Simmons', 'p': 'Florida allows 248 passing yards a game, 113th nationally, and opponents convert 41% on third down. Simmons has 11 touchdowns and no interceptions. Missouri has two giveaways, fewest in the SEC; Florida has seven takeaways.'},
      {'h': 'The flags', 'p': 'Florida has 35 penalties for 357 yards, the most yards in the SEC. Missouri has 32 for 292. Read why the bill may come due.', 'url': '/post/florida-keeps-winning-big-and-the-laundry-keeps-piling-up'}],
      'source': 'ESPN team statistics and box scores'},
  'injuries': {'label': 'Availability', 'asOf': 'As of Oct. 1. ESPN lists no injuries for either team; names below are GatorBait reporting.', 'teams': [
      {'name': 'Florida', 'items': [{'pos': 'WR', 'name': 'Vernell Brown III', 'status': 'Questionable', 'detail': 'MRI showed a Grade 1 PCL sprain'}, {'pos': 'WR', 'name': 'Bailey Stockton', 'status': 'Questionable', 'detail': ''}]},
      {'name': 'Missouri', 'items': [{'pos': 'S', 'name': 'JaDon Blair', 'status': 'Out', 'detail': ''}, {'pos': 'RB', 'name': 'Ahmad Hardy', 'status': 'Out', 'detail': ''}, {'pos': 'RB', 'name': 'Malae Fonoti', 'status': 'Out', 'detail': ''}, {'pos': 'OL', 'name': 'Josh Atkins', 'status': 'Out', 'detail': ''}, {'pos': 'TE', 'name': 'Gavin Hoffman', 'status': 'Out', 'detail': ''}, {'pos': 'EDGE', 'name': 'Langden Kitchen', 'status': 'Questionable', 'detail': ''}, {'pos': 'EDGE', 'name': 'Darris Smith', 'status': 'Questionable', 'detail': ''}]}],
      'source': 'GatorBait reporting'},
  'lead': {'label': 'The Soothsayer', 'kicker': 'Franz Beard · Senior Columnist', 'title': 'Gators head to Missouri, where history hasn’t been kind', 'url': FRANZ_URL, 'html': franz_html,
           'continue': 'Read the full column: Franz’s picks for every SEC game, plus Countdown to Firing Day', 'date': 'October 2, 2026',
           'image': pic('16b519_a0e407bedc46487ca71033fc8351d0fe~mv2.jpg', 3000, 1874, 'Florida’s goal-line push against Ole Miss, with Jadan Baugh (13) in the pile (' + SP + ')', SP),
           'caption': 'Florida’s goal-line push against Ole Miss, with Jadan Baugh (13) in the pile. The Gators ran for 302 yards. Missouri will try to take that away.'},
  'slate': {'label': 'The Sooth Board', 'note': 'Saturday’s SEC games with Franz Beard’s picks', 'source': 'Kickoffs, TV and lines: ESPN. Picks: Franz Beard, The Soothsayer.', 'games': [
      {'time': 'Noon', 'tv': 'ABC', 'away': {'rank': 7, 'name': 'Alabama', 'rec': '4-0'}, 'home': {'rank': 16, 'name': 'Mississippi State', 'rec': '4-0'}, 'line': 'ALA -6', 'ou': 60.5, 'pick': 'Alabama'},
      {'time': '12:45 p.m.', 'tv': 'SEC Network', 'away': {'name': 'Vanderbilt', 'rec': '3-1'}, 'home': {'rank': 2, 'name': 'Georgia', 'rec': '4-0'}, 'line': 'UGA -25.5', 'ou': 50.5, 'pick': 'Georgia'},
      {'time': '3:30 p.m.', 'tv': 'ABC', 'away': {'rank': 8, 'name': 'Florida', 'rec': '4-0'}, 'home': {'rank': 25, 'name': 'Missouri', 'rec': '3-1'}, 'line': 'FLA -5.5', 'ou': 57.5, 'pick': 'Florida', 'note': 'by more than 5.5', 'hero': True},
      {'time': '3:30 p.m.', 'tv': 'ESPN', 'away': {'name': 'Auburn', 'rec': '3-1'}, 'home': {'rank': 17, 'name': 'Tennessee', 'rec': '3-1'}, 'line': 'TENN -7', 'ou': 53.5, 'pick': 'Tennessee'},
      {'time': '4:15 p.m.', 'tv': 'SEC Network', 'away': {'rank': 24, 'name': 'Kentucky', 'rec': '3-1'}, 'home': {'name': 'South Carolina', 'rec': '2-2'}, 'line': 'SC -3', 'ou': 54.5, 'pick': 'Kentucky'},
      {'time': '7 p.m.', 'tv': 'ESPN2', 'away': {'name': 'Arkansas', 'rec': '2-2'}, 'home': {'name': 'Texas A&M', 'rec': '2-2'}, 'line': 'TA&M -13.5', 'ou': 50.5, 'pick': 'Texas A&M'},
      {'time': '7:45 p.m.', 'tv': 'SEC Network', 'away': {'name': 'McNeese', 'rec': '2-3'}, 'home': {'rank': 11, 'name': 'LSU', 'rec': '3-1'}, 'line': 'LSU -53.5', 'ou': 62.5, 'pick': 'LSU'}]},
  'cards': {'label': 'More from this week', 'items': [
      {'kicker': 'Buddy Martin · Column', 'title': 'Coaches and Fans Have Different Playbooks. So Have Another Round, Thirsty Gators.', 'url': '/post/coaches-and-fans-have-different-playbooks-so-have-another-round-thirsty-gators', 'excerpt': 'Florida fans have earned the right to brag after four years of misery. Just don’t build a shrine on an early poll before Saturday’s trip to Missouri.', 'image': {'id': 'd3cfa5_408fa442a2d54309aa66050fb0f4d35e', 'ext': 'jpg', 'width': 1024, 'height': 800, 'alt': 'Jon Sumrall reacts on the Florida sideline with an official in the foreground (' + SP + ')', 'credit': SP}, 'date': 'Oct. 1'},
      {'kicker': 'Buddy Martin · Column', 'title': 'The Looming Brilliance of Buster Faulkner: “If It Works Once, We Retire It”', 'url': '/post/the-looming-brilliance-of-buster-faulkner-if-it-works-one-time-we-retire-it', 'excerpt': 'This guy could turn out to be brilliant. Maybe even Steve Spurrier brilliant. But Faulkner has to earn that.', 'image': {'id': 'd3cfa5_56a64986c874417c9a8299fae22649ed', 'ext': 'jpg', 'width': 1600, 'height': 900, 'alt': 'Buddy Martin column: The Looming Brilliance of Buster Faulkner. Photo by Chris Spears, GatorBait Media; Faulkner photo UAA.', 'credit': SP + '; Faulkner photo UAA'}, 'date': 'Sept. 30'},
      {'kicker': 'Analysis · GatorBait Staff', 'title': 'Florida Keeps Winning Big, and the Laundry Keeps Piling Up', 'url': '/post/florida-keeps-winning-big-and-the-laundry-keeps-piling-up', 'excerpt': 'The No. 8 Gators have outscored four opponents by nearly 31 points a game while drawing 35 flags for 357 yards.', 'image': {'id': 'd3cfa5_f130d47a9cb74914b869ac554c67e931', 'ext': 'jpg', 'width': 2576, 'height': 1198, 'alt': 'Officials at the SEC replay monitor on the Florida sideline (' + SP + ')', 'credit': SP}, 'date': 'Oct. 1'},
      {'kicker': 'Franz Beard · Column', 'title': 'When it came to finding a quarterback Sumrall trusted Buster and it paid off', 'url': '/post/when-it-came-to-finding-a-quarterback-sumrall-trusted-buster-and-it-paid-off', 'excerpt': 'Aaron Philo was barely known when the season began. Jon Sumrall trusted Buster Faulkner to find a quarterback, and it paid off.', 'image': {'id': '16b519_00359caad82744778e7c387d8bf98777', 'ext': 'jpg', 'width': 3000, 'height': 1867, 'alt': 'Aaron Philo, Florida quarterback (' + SP + ')', 'credit': SP}, 'date': 'Oct. 1'},
      {'kicker': 'Honors · GatorBait Staff', 'title': 'Jayden Woods Added To Chuck Bednarik Award Watch List', 'url': '/post/jayden-woods-added-to-chuck-bednarik-award-watch-list', 'excerpt': 'The sophomore JACK’s 19 tackles, six TFLs and four sacks through four games have him in the running for college football’s top defensive honor.', 'image': {'id': 'd3cfa5_dc70ea9e65574abebd3b0ace40bd8232', 'ext': 'png', 'width': 1080, 'height': 1350, 'alt': 'Jayden Woods, Florida JACK linebacker (Graphic: GatorBait Media)', 'credit': 'Graphic: GatorBait Media'}, 'date': 'Oct. 1'},
      {'kicker': 'Preview · GatorBait Staff', 'title': 'Show-Me State of Mind: A First Look at No. 25 Missouri', 'url': FIRST, 'excerpt': 'No. 8 Florida’s reward for routing Ole Miss is a trip to No. 25 Missouri, which let a fourth-quarter lead get away at Mississippi State.', 'image': {'id': 'd3cfa5_a67ff355ad6a4d668106c2befa41b208', 'ext': 'png', 'width': 1600, 'height': 900, 'alt': 'Show-Me State of Mind: No. 8 Florida at No. 25 Missouri, Saturday, Oct. 3, 3:30 p.m. ET. GatorBait Media graphic.', 'credit': 'Graphic: GatorBait Media'}, 'date': 'Sept. 27'}]},
  'shots': {'label': 'Best shots', 'note': 'From Florida 52, Ole Miss 28', 'url': '/post/chris-spears-best-shots-vol-2-florida-52-ole-miss-28', 'credit': SP, 'photos': [
      {'id': '16b519_9e6aad749e564c33ab69f6e7e19e9560', 'ext': 'jpg', 'width': 3000, 'height': 1851, 'alt': 'The Swamp before kickoff against Ole Miss.', 'caption': 'The Swamp before kickoff'},
      {'id': '16b519_958769d0cfef4d9e931621ae78bfd008', 'ext': 'jpg', 'width': 3000, 'height': 1848, 'alt': 'Gators players celebrate a touchdown against Ole Miss.', 'caption': 'Celebrating a touchdown'},
      {'id': '16b519_ab5daac7afa94664b9e6a4931049cfb9', 'ext': 'jpg', 'width': 3000, 'height': 1834, 'alt': 'Florida defenders make a tackle against Ole Miss.', 'caption': 'The defense swarms'},
      {'id': 'd3cfa5_ce8defc3525b4e74a6a394170740c270', 'ext': 'jpg', 'width': 1600, 'height': 900, 'alt': 'Jon Sumrall leads the Gators onto the field.', 'caption': 'Sumrall leads the Gators out'},
      {'id': '16b519_f3af81d3cac048ae84d89d9194ddd9eb', 'ext': 'jpg', 'width': 3000, 'height': 2000, 'alt': 'A Florida player speaks with reporters after the win.', 'caption': 'After the win'}]},
  'reference': {'label': 'Reference desk', 'links': [{'label': 'Roster', 'url': GUIDE + '#roster'}, {'label': 'Schedule and results', 'url': GUIDE + '#schedule'}, {'label': 'The Buddy Martin Show', 'url': '/the-buddy-martin-show'}],
                'next': 'Next up: South Carolina, Oct. 10, in The Swamp. Then Texas in Austin on Oct. 17.'},
}
(root / 'sports-live/magazine-issue-pregame.json').write_text(json.dumps(issue, ensure_ascii=False, indent=1))
print('issue json', len((root / 'sports-live/magazine-issue-pregame.json').read_text()), 'chars; Franz excerpt', len(plain(franz_html)), 'chars')
