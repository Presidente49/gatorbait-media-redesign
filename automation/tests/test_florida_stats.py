"""Tests for automation/florida_stats.py against synthetic ESPN-shaped fixtures (fake teams/players).

Run: python -m unittest automation/tests/test_florida_stats.py
"""
import copy, datetime as dt, io, json, pathlib, sys, tempfile, unittest, urllib.error
from unittest import mock

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import florida_stats as fs  # noqa: E402

FIX = HERE / 'fixtures' / 'florida_stats'


def load(name):
    return json.loads((FIX / name).read_text())


def build(summaries=None, schedule=None):
    sch = schedule or load('schedule-2.json')
    events = [fs.parse_event(ev) for ev in sch['events']]
    boxes = {}
    for g in events:
        if g['final']:
            sm = (summaries or {}).get(g['id']) or load(f'summary-{g["id"]}.json')
            boxes[g['id']] = fs.parse_summary(sm, g['id'])
    return fs.build_snapshot(2026, events, boxes, sch.get('team'))


class ParseTests(unittest.TestCase):
    def test_event_orientation_and_rank(self):
        away = fs.parse_event(load('schedule-2.json')['events'][1])
        self.assertEqual((away['ha'], away['opp'], away['rk'], away['us'], away['them']), ('a', 'Beta Tech', 4, 21, 24))
        upcoming = fs.parse_event(load('schedule-2.json')['events'][2])
        self.assertFalse(upcoming['final'])
        self.assertIsNone(upcoming['us'])
        self.assertIsNone(upcoming['rk'])  # curatedRank 99 = unranked

    def test_ap_labels(self):
        d = fs.et('2026-09-26T19:30Z')
        self.assertEqual(fs.ap_date(d, True), 'Sat., Sept. 26')
        self.assertEqual(fs.ap_time(d), '3:30 p.m.')
        self.assertEqual(fs.ap_time(fs.et('2026-10-03T16:00Z')), 'Noon')
        self.assertEqual(fs.ap_time(fs.et('2026-10-03T23:00Z')), '7 p.m.')


class SnapshotTests(unittest.TestCase):
    def setUp(self):
        self.s = build()

    def test_record_and_log(self):
        self.assertEqual((self.s['record'], self.s['confRecord']), ('1-1', '0-1'))
        log = self.s['games']
        self.assertEqual([g.get('r') for g in log], ['W', 'L', None])
        self.assertEqual(log[1]['o'], 'at No. 4 Beta Tech')
        self.assertEqual(log[1]['s'], '21-24')
        self.assertEqual(log[1]['rec'], '1-1')
        self.assertEqual((log[2]['t'], log[2]['tv']), ('3:30 p.m.', 'ABC'))
        self.assertEqual(self.s['through'], 'Sept. 12 at Beta Tech')

    def test_team_rows_sum_box_scores(self):
        rows = {r[0]: r[1:] for r in self.s['teamRows']}
        self.assertEqual(rows['Points per game'], ['26.0', '17.0'])
        self.assertEqual(rows['Total yards per game'], ['400.0', '335.0'])
        self.assertEqual(rows['Yards per carry'], ['5.3', '4.3'])  # 400/75, 270/63
        self.assertEqual(rows['Completions-attempts'], ['33-50 (66%)', '34-57 (60%)'])
        self.assertEqual(rows['Third-down conversions'], ['11-25 (44%)', '10-25 (40%)'])
        self.assertEqual(rows['Turnovers'], ['3', '4'])
        self.assertEqual(rows['Time of possession (avg.)'], ['31:08', '28:52'])
        tiles = {t[0]: t[1:] for t in self.s['tiles']}
        self.assertEqual(tiles['Turnover margin'], ['+1', '2 games'])

    def test_leaders(self):
        L = self.s['lead']
        self.assertEqual(L['pass'], [['Test Passer', '33-50', '400', '3', '3']])
        self.assertEqual(L['rush'][0], ['Test Runner', '53', '300', '5.7', '3', '40'])
        self.assertNotIn('TEAM', [r[0] for r in L['rush']])  # team kneel rows never lead
        self.assertEqual([r[0] for r in L['rec']], ['Test Catcher', 'Test Tight'])  # 220 vs 180
        # Tied on tackles; tackles for loss break the tie.
        self.assertEqual(L['def'][0], ['Test Backer', '15', '3.5', '2.5', '0', '0'])
        self.assertEqual(L['def'][1], ['Test Safety', '15', '1', '0', '1', '3'])
        self.assertEqual(L['kick'], [['Test Kicker', '3-4', '44', '7-7', '16']])
        self.assertEqual(L['defBest']['SACKS'], ['Test Backer', '2.5'])


class ConferenceAndLabelTests(unittest.TestCase):
    def test_conference_game_read_from_box_score_header(self):
        # ESPN's team schedule feed can omit conferenceCompetition; the box-score header carries it.
        sch = load('schedule-2.json')
        for ev in sch['events']:
            ev['competitions'][0].pop('conferenceCompetition', None)
        sm = load('summary-9002.json')
        sm['header']['competitions'][0]['conferenceCompetition'] = True
        s = build({'9002': sm}, schedule=sch)
        self.assertEqual(s['confRecord'], '0-1')

    def test_schedule_and_box_score_must_agree_on_conference(self):
        sm = load('summary-9002.json')
        sm['header']['competitions'][0]['conferenceCompetition'] = False
        with self.assertRaises(fs.StatsError):
            build({'9002': sm})  # the schedule fixture marks this game as SEC

    def test_sec_network_names_spelled_out(self):
        ev = copy.deepcopy(load('schedule-2.json')['events'][2])
        ev['competitions'][0]['broadcasts'] = [{'media': {'shortName': 'SECN+'}}]
        self.assertEqual(fs.parse_event(ev)['tv'], 'SEC Network+')

    def test_rounding_matches_official_stat_sheet(self):
        # FloridaGators.com, Sept. 27, 2026: 2,131 and 1,405 yards in 4 games -> 532.8 and 351.2.
        self.assertEqual((fs.fmt1(2131 / 4), fs.fmt1(1405 / 4)), ('532.8', '351.2'))


class GuardTests(unittest.TestCase):
    def test_score_mismatch_blocks(self):
        sm = load('summary-9001.json')
        sm['header']['competitions'][0]['competitors'][0]['score'] = '30'
        with self.assertRaises(fs.StatsError):
            build({'9001': sm})

    def test_player_yards_mismatch_blocks(self):
        sm = load('summary-9001.json')
        rush = next(c for c in sm['boxscore']['players'][0]['statistics'] if c['name'] == 'rushing')
        rush['athletes'][0]['stats'][1] = '181'
        with self.assertRaises(fs.StatsError):
            build({'9001': sm})

    def test_receptions_must_match_completions(self):
        sm = load('summary-9002.json')
        rec = next(c for c in sm['boxscore']['players'][0]['statistics'] if c['name'] == 'receiving')
        rec['athletes'][0]['stats'][0] = '9'
        with self.assertRaises(fs.StatsError):
            build({'9002': sm})

    def test_espn_record_cross_check(self):
        sch = load('schedule-2.json')
        sch['team']['recordSummary'] = '2-0'
        with self.assertRaises(fs.StatsError):
            build(schedule=sch)


class EmbedTests(unittest.TestCase):
    def test_embed_under_cap_and_marked(self):
        snap, _ = fs.stamp(build(), None)
        html = fs.build_embed(snap)
        self.assertLessEqual(len(html), fs.LIMIT)
        self.assertEqual(html.count('/*FS*/'), 1)
        self.assertIn('"record":"1-1"', html)
        self.assertNotIn('players', html.split('/*FS*/')[1].split('/*FS-END*/')[0])  # full tables stay in the JSON

    def test_stamp_keeps_time_when_unchanged(self):
        data = build()
        first, changed = fs.stamp(data, None)
        self.assertTrue(changed)
        again, changed = fs.stamp(copy.deepcopy(data), json.loads(json.dumps(first)))
        self.assertFalse(changed)
        self.assertEqual(again['updated'], first['updated'])

    def test_cli_from_dir_writes_outputs(self):
        with tempfile.TemporaryDirectory() as t:
            j, h = pathlib.Path(t, 's.json'), pathlib.Path(t, 's.html')
            self.assertEqual(fs.main(['--from-dir', str(FIX), '--season', '2026', '--out-json', str(j), '--out-html', str(h)]), 0)
            self.assertEqual(json.loads(j.read_text())['record'], '1-1')
            self.assertTrue(h.read_text().startswith('<!-- GBM_FLORIDA_STATS_V1'))


class LiveFeedTests(unittest.TestCase):
    def live_schedule(self):
        sch = load('schedule-2.json')
        comp = sch['events'][2]['competitions'][0]
        comp['status']['type'].update({'state': 'in', 'completed': False, 'shortDetail': '5:21 - 3rd'})
        for c, pts in zip(comp['competitors'], ('24', '21')):
            c['score'] = {'value': float(pts), 'displayValue': pts}
        return sch

    def test_live_status_drops_the_clock(self):
        self.assertEqual(fs.live_status('5:21 - 3rd'), '3rd quarter')
        self.assertEqual(fs.live_status('Halftime'), 'Halftime')
        self.assertEqual(fs.live_status('0:00 - End of 2nd'), 'End of 2nd')
        self.assertEqual(fs.live_status('1:02 - OT'), 'OT')

    def test_in_progress_game_shows_live_score_but_not_in_totals(self):
        s = build(schedule=self.live_schedule())
        g = s['games'][2]
        self.assertEqual((g.get('live'), g.get('s'), g.get('st')), (1, '24-21', '3rd quarter'))
        self.assertNotIn('r', g)
        self.assertEqual(s['record'], '1-1')  # totals still count finals only
        self.assertNotIn('live', s['games'][0])

    def test_cli_feed_only_writes_compact_feed_and_no_embed(self):
        with tempfile.TemporaryDirectory() as t:
            j, h, f = pathlib.Path(t, 'full.json'), pathlib.Path(t, 's.html'), pathlib.Path(t, 'live/feed.json')
            args = ['--from-dir', str(FIX), '--season', '2026', '--out-json', str(j), '--out-html', str(h),
                    '--feed', str(f), '--no-embed']
            self.assertEqual(fs.main(args), 0)
            self.assertFalse(h.exists())
            feed = json.loads(f.read_text())
            self.assertEqual(feed['record'], '1-1')
            self.assertNotIn('players', feed)
            self.assertEqual(feed['src'][0][0], 'ESPN box scores')
            self.assertEqual(feed['updated'], json.loads(j.read_text())['updated'])
            before = f.stat().st_mtime_ns
            self.assertEqual(fs.main(args), 0)  # unchanged numbers: same file, same time
            self.assertEqual(f.stat().st_mtime_ns, before)


class FetchTests(unittest.TestCase):
    def test_403_retries_on_the_web_api_host(self):
        seen = []

        def fake(req, timeout=25):
            seen.append(req.full_url)
            if '//site.api.espn.com/' in req.full_url:
                raise urllib.error.HTTPError(req.full_url, 403, 'Forbidden', {}, None)
            return io.BytesIO(b'{"ok": 1}')

        with mock.patch.object(fs.urllib.request, 'urlopen', fake), mock.patch.object(fs.time, 'sleep'):
            self.assertEqual(fs.fetch_json(fs.API + '/teams/57'), {'ok': 1})
        self.assertEqual([u.split('/')[2] for u in seen], ['site.api.espn.com', 'site.web.api.espn.com'])


class DueTests(unittest.TestCase):
    def setUp(self):
        self.prev = dict(build(), updated='2026-09-12T20:00:00Z')

    def at(self, iso):
        return dt.datetime.fromisoformat(iso.replace('Z', '+00:00'))

    def test_quiet_between_games(self):
        self.assertIsNone(fs.due(self.prev, self.at('2026-09-20T14:22:00Z')))

    def test_game_window_and_daily_check(self):
        self.assertTrue(fs.due(self.prev, self.at('2026-10-03T21:40:00Z')).startswith('game window'))
        self.assertEqual(fs.due(self.prev, self.at('2026-09-20T10:03:00Z')), 'daily schedule check')
        self.assertEqual(fs.due(None, self.at('2026-09-20T14:22:00Z')), 'no snapshot')

    def test_post_game_corrections_hourly(self):
        self.assertTrue(fs.due(self.prev, self.at('2026-09-13T15:02:00Z')).startswith('post-game'))
        self.assertIsNone(fs.due(self.prev, self.at('2026-09-13T15:20:00Z')))


if __name__ == '__main__':
    unittest.main()
