"""Tests for scoreboard_feed.py and validate_scoreboard.py.

Fixtures in fixtures/scoreboard/ are real ESPN responses captured Sept. 29, 2026 (schedule, SEC standings and the
Florida-Ole Miss summary), trimmed by scoreboard_import.py. The live-game tests derive a synthetic in-progress
game from them; ESPN's live payload itself was not captured (no live game was on).

Run: python -m unittest discover -s automation/tests -p 'test_scoreboard*.py'
"""
import copy, datetime as dt, json, pathlib, sys, tempfile, unittest

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import scoreboard_feed as sf  # noqa: E402
import scoreboard_import as si  # noqa: E402
import validate_scoreboard as vs  # noqa: E402

FIX = HERE / 'fixtures' / 'scoreboard'
NOW = dt.datetime(2026, 9, 29, 3, 0, tzinfo=dt.timezone.utc)
POSTS = {'posts': [
    {'title': "Postgame Analysis: Florida Gators 52, Ole Miss Rebels 28", 'url': 'https://www.gatorbaitmedia.com/post/postgame', 'firstPublishedDate': '2026-09-27T01:00:00Z'},
    {'title': "Chris Spears' Best Shots: Florida 52, Ole Miss 28", 'url': 'https://www.gatorbaitmedia.com/post/shots', 'firstPublishedDate': '2026-09-27T03:00:00Z'},
    {'title': "Chris Spears' Best Shots, Vol. 2: Florida 52, Ole Miss 28", 'url': 'https://www.gatorbaitmedia.com/post/shots-2', 'firstPublishedDate': '2026-09-28T03:00:00Z'},
    {'title': "Show-Me State of Mind: A First Look at No. 25 Missouri", 'url': 'https://www.gatorbaitmedia.com/post/first-look-mizzou', 'firstPublishedDate': '2026-09-26T12:00:00Z'},
    {'title': "Missouri game preview, old news", 'url': 'https://www.espn.com/nope', 'firstPublishedDate': '2026-09-30T12:00:00Z'},
    {'title': "Pay the Toll: Sumrall braces for Missouri", 'url': 'https://www.gatorbaitmedia.com/post/toll', 'firstPublishedDate': '2026-09-28T12:00:00Z'},
]}


def load(name):
    return json.loads((FIX / name).read_text())


def build(schedule=None, standings=None, summaries=None, posts=POSTS, prev=None):
    sm = summaries if summaries is not None else {'401856699': sf.parse_summary(load('summary-401856699.json'))}
    return sf.build(schedule or load('schedule.json'), standings or load('standings.json'), sm, posts, prev, NOW)


def make_live():
    """Synthetic in-progress Missouri game: schedule event flipped to 'in', plus a made-up summary."""
    sch = load('schedule.json')
    ev = next(e for e in sch['events'] if e['id'] == '401856708')
    comp = ev['competitions'][0]
    comp['status'] = {'clock': 312.0, 'displayClock': '5:12', 'period': 3, 'type': {'name': 'STATUS_IN_PROGRESS', 'state': 'in', 'completed': False}}
    for c in comp['competitors']:
        c['score'] = {'displayValue': '17' if c['id'] == '57' else '10'}
    sm = copy.deepcopy(load('summary-401856699.json'))
    h = sm['header']['competitions'][0]
    h['status'] = {'displayClock': '5:12', 'period': 3, 'type': {'state': 'in', 'completed': False}}
    for c in h['competitors']:
        c['score'] = '17' if str(c['id']) == '57' else '10'
        c['linescores'] = [{'displayValue': '7'}, {'displayValue': '10'}]
    sm['situation'] = {'possession': '57', 'lastPlay': {'text': 'J. Baugh run for 6 yds'}}
    return sch, {'401856708': sf.parse_summary(sm)}


class BuildTests(unittest.TestCase):
    def test_contract_shape_from_real_espn_data(self):
        d = build()
        self.assertEqual(list(d), ['updatedAt', 'season', 'team', 'last', 'next', 'schedule', 'standings', 'live'])
        self.assertEqual(d['team'], {'name': 'Florida', 'rank': 8, 'record': '4-0', 'conf': '2-0'})
        self.assertEqual(d['season'], 2026)
        last = d['last']
        self.assertEqual((last['eventId'], last['opponent'], last['opponentRank'], last['home']), ('401856699', 'Ole Miss', 4, True))
        self.assertEqual(last['score'], {'fla': 52, 'opp': 28})
        self.assertEqual(last['quarters'], {'fla': [10, 7, 14, 21], 'opp': [0, 6, 15, 7]})
        self.assertEqual(last['venue'], 'Ben Hill Griffin Stadium')
        self.assertEqual(last['date'], '2026-09-26T19:30:00Z')
        nxt = d['next']
        self.assertEqual((nxt['opponent'], nxt['opponentRank'], nxt['home'], nxt['kickoffIso'], nxt['tv']), ('Missouri', 25, False, '2026-10-03T19:30:00Z', 'ABC'))
        self.assertEqual(len(d['schedule']), 12)
        self.assertEqual([g['status'] for g in d['schedule']].count('final'), 4)
        self.assertIsNone(d['live'])
        self.assertEqual(vs.validate(d), [])

    def test_standings_are_sec_sorted_by_record(self):
        s = build()['standings']
        self.assertEqual(len(s), 16)
        self.assertEqual(set(s[0]), {'team', 'confRecord', 'overall'})
        self.assertIn('Florida', [r['team'] for r in s])
        wins = [int(r['confRecord'].split('-')[0]) for r in s]
        self.assertEqual(wins, sorted(wins, reverse=True))

    def test_tv_names_spelled_out_and_no_espn_links_anywhere(self):
        d = build()
        self.assertEqual(d['schedule'][0]['tv'], 'SEC Network')
        self.assertNotIn('espn.com', json.dumps(d).lower())
        self.assertNotIn('secsports', json.dumps(d).lower())

    def test_stories_only_from_our_posts(self):
        d = build()
        self.assertEqual(d['last']['recapUrl'], 'https://www.gatorbaitmedia.com/post/postgame')
        self.assertEqual(d['last']['galleryUrl'], 'https://www.gatorbaitmedia.com/post/shots')  # earliest gallery
        self.assertEqual(d['next']['previewUrl'], 'https://www.gatorbaitmedia.com/post/first-look-mizzou')  # ESPN-hosted 'preview' ignored, column isn't a preview
        by = {g['opponent']: g['storyUrl'] for g in d['schedule']}
        self.assertIsNone(by['Campbell'])
        self.assertIsNone(by['Texas'])
        self.assertEqual(by['Ole Miss'], d['last']['recapUrl'])

    def test_recap_excludes_halftime_score_update(self):
        g = {'opponent': 'Missouri', 'date': '2026-10-03T19:50:00Z'}
        halftime = {'title': 'Halftime: Simmons Strikes Twice, Missouri Leads Florida 20-10',
                    'url': 'https://www.gatorbaitmedia.com/post/halftime', 'firstPublishedDate': '2026-10-03T21:00:00Z'}
        final = {'title': 'Roberts Runs Away, Missouri Routs Florida 45-17',
                 'url': 'https://www.gatorbaitmedia.com/post/final', 'firstPublishedDate': '2026-10-03T23:00:00Z'}
        self.assertEqual(sf.find_story(g, sf._posts({'posts': [halftime, final]}), 'recap'), final['url'])
        self.assertIsNone(sf.find_story(g, sf._posts({'posts': [halftime]}), 'recap'))

    def test_no_posts_means_null_links(self):
        d = build(posts={})
        self.assertIsNone(d['last']['recapUrl'])
        self.assertIsNone(d['last']['galleryUrl'])
        self.assertIsNone(d['next']['previewUrl'])
        self.assertEqual(vs.validate(d), [])

    def test_story_matching_edges(self):
        g = {'opponent': 'Texas', 'date': '2026-10-17T04:00:00Z'}
        posts = sf._posts({'posts': [
            {'title': 'Texas A&M keys to the game', 'url': 'https://www.gatorbaitmedia.com/post/a', 'firstPublishedDate': '2026-10-15T00:00:00Z'},
            {'title': 'Keys to beating Texas', 'url': 'https://www.gatorbaitmedia.com/post/b', 'firstPublishedDate': '2026-10-15T00:00:00Z'}]})
        self.assertEqual(sf.find_story(g, posts, 'preview'), 'https://www.gatorbaitmedia.com/post/b')
        fsu = {'opponent': 'Florida State', 'date': '2026-11-27T20:30:00Z'}
        p2 = sf._posts({'posts': [{'title': 'FSU preview: what to watch', 'url': 'https://www.gatorbaitmedia.com/post/c', 'firstPublishedDate': '2026-11-25T00:00:00Z'}]})
        self.assertEqual(sf.find_story(fsu, p2, 'preview'), 'https://www.gatorbaitmedia.com/post/c')

    def test_summary_failure_keeps_previous_quarters_or_null(self):
        first = build()
        d = build(summaries={}, prev=first)
        self.assertEqual(d['last']['quarters'], first['last']['quarters'])
        self.assertIsNone(build(summaries={})['last']['quarters'])
        self.assertEqual(vs.validate(build(summaries={})), [])

    def test_quarters_that_do_not_add_up_stop_the_build(self):
        sm = load('summary-401856699.json')
        sm['header']['competitions'][0]['competitors'][0]['linescores'][0]['displayValue'] = '13'
        with self.assertRaises(sf.ScoreError):
            build(summaries={'401856699': sf.parse_summary(sm)})

    def test_record_that_disagrees_with_finals_stops_the_build(self):
        sch = load('schedule.json')
        sch['team']['recordSummary'] = '3-1'
        with self.assertRaises(sf.ScoreError):
            build(schedule=sch)

    def test_live_game(self):
        sch, sm = make_live()
        d = sf.build(sch, load('standings.json'), {**sm, '401856699': sf.parse_summary(load('summary-401856699.json'))}, POSTS, None, NOW)
        self.assertEqual(d['live'], {'eventId': '401856708', 'clock': '5:12', 'period': 3, 'score': {'fla': 17, 'opp': 10},
                                     'possession': 'fla', 'lastPlay': 'J. Baugh run for 6 yds'})
        self.assertEqual(d['next']['eventId'], '401856708')
        self.assertEqual(next(g for g in d['schedule'] if g['eventId'] == '401856708')['status'], 'in-progress')
        self.assertEqual(vs.validate(d), [])

    def test_live_summary_missing_means_live_null_not_a_crash(self):
        sch, _ = make_live()
        d = sf.build(sch, load('standings.json'), {}, POSTS, None, NOW)
        self.assertIsNone(d['live'])


class OpponentRecordTests(unittest.TestCase):
    """next.opponentRecord / schedule[i].opponentRecord: the string The Tunnel prints under the opponent's name."""
    PRE = {'401856699': sf.parse_summary(load('summary-401856699.json')), '401856708': sf.parse_summary(load('summary-401856708.json'))}

    def test_next_record_comes_from_the_pregame_summary(self):
        d = build(summaries=self.PRE)
        self.assertEqual(d['next']['opponent'], 'Missouri')
        self.assertEqual(d['next']['opponentRecord'], '3-1')
        self.assertEqual(list(d['next']), ['eventId', 'opponent', 'opponentRank', 'opponentRecord', 'home', 'kickoffIso', 'tv', 'venue', 'previewUrl'])
        by = {g['opponent']: g for g in d['schedule']}
        self.assertEqual(by['Missouri']['opponentRecord'], '3-1')          # same string on the season row
        self.assertEqual(by['Ole Miss']['opponentRecord'], '3-1')          # a final: ESPN's record after that game
        self.assertEqual(by['Florida Atlantic']['opponentRecord'], '0-1')
        self.assertIsNone(by['Texas']['opponentRecord'])                   # not yet played, no pregame summary read
        self.assertTrue(all('opponentRecord' in g for g in d['schedule']))
        self.assertEqual(vs.validate(d), [])

    def test_no_pregame_summary_means_null_not_a_guess(self):
        d = build()  # only the last final's summary
        self.assertIsNone(d['next']['opponentRecord'])
        self.assertEqual(vs.validate(d), [])

    def test_summary_failure_keeps_the_previous_record_for_the_same_game(self):
        first = build(summaries=self.PRE)
        d = build(prev=first)
        self.assertEqual(d['next']['opponentRecord'], '3-1')
        other = copy.deepcopy(first)
        other['next']['eventId'] = 'someone-else'
        self.assertIsNone(build(prev=other)['next']['opponentRecord'])

    def test_live_game_record_survives_from_the_schedule_row(self):
        sch, sm = make_live()
        ev = next(e for e in sch['events'] if e['id'] == '401856708')
        for c in ev['competitions'][0]['competitors']:
            c['record'] = [{'type': 'total', 'displayValue': '3-1' if c['id'] != '57' else '4-0'}]
        d = sf.build(sch, load('standings.json'), {}, POSTS, None, NOW)  # summary read failed mid-game
        self.assertEqual(d['next']['opponentRecord'], '3-1')
        self.assertEqual(vs.validate(d), [])

    def test_odd_espn_records_are_dropped(self):
        sm = load('summary-401856708.json')
        for c in sm['header']['competitions'][0]['competitors']:
            c['record'] = [{'type': 'total', 'summary': '3-1-1'}]
        d = build(summaries={'401856708': sf.parse_summary(sm)})
        self.assertIsNone(d['next']['opponentRecord'])
        self.assertEqual(vs.validate(d), [])

    def test_validator_accepts_absent_null_or_record_and_refuses_the_rest(self):
        good = build(summaries=self.PRE)
        def check(mutate):
            d = copy.deepcopy(good)
            mutate(d)
            return vs.validate(d)
        self.assertEqual(check(lambda d: d['next'].pop('opponentRecord')), [])
        self.assertEqual(check(lambda d: d['next'].update(opponentRecord=None)), [])
        self.assertEqual(check(lambda d: d['schedule'][0].pop('opponentRecord')), [])
        self.assertEqual(check(lambda d: d['schedule'][0].update(opponentRecord='12-0')), [])
        for bad in ('3-1-0', 'three-one', '', 31, '3-1 ', ' 3-1', '3–1'):
            self.assertTrue(check(lambda d: d['next'].update(opponentRecord=bad)), repr(bad))
            self.assertTrue(check(lambda d: d['schedule'][4].update(opponentRecord=bad)), repr(bad))
        self.assertTrue(check(lambda d: d['last'].update(opponentRecord='3-1')))  # not part of the last block's contract

    def test_committed_feed_carries_the_missouri_record(self):
        doc = json.loads((HERE.parent.parent / 'sports-live' / 'scoreboard.json').read_text())
        self.assertEqual(vs.validate(doc), [])
        self.assertEqual((doc['next']['opponent'], doc['next']['opponentRecord']), ('Missouri', '3-1'))

    def test_main_reads_the_pregame_summary_and_writes_the_record(self):
        with tempfile.TemporaryDirectory() as t:
            out = pathlib.Path(t, 'scoreboard.json')
            self.assertEqual(sf.main(['--from-dir', str(FIX), '--out', str(out), '--now', '2026-09-29T03:00:00Z', '--posts', str(HERE / 'nope.json')]), 0)
            doc = json.loads(out.read_text())
            self.assertEqual(doc['next']['opponentRecord'], '3-1')
            self.assertEqual(next(g for g in doc['schedule'] if g['eventId'] == '401856708')['opponentRecord'], '3-1')
            self.assertEqual(vs.load_and_validate(out), [])


class ValidatorTests(unittest.TestCase):
    def setUp(self):
        self.good = build()

    def bad(self, mutate):
        d = copy.deepcopy(self.good)
        mutate(d)
        return vs.validate(d)

    def test_good_passes(self):
        self.assertEqual(vs.validate(self.good), [])

    def test_refuses_espn_and_sec_links(self):
        for url in ('https://www.espn.com/college-football/game/_/gameId/1', 'https://secsports.com/x', 'http://www.gatorbaitmedia.com/x', 'https://www.gatorbaitmedia.com/'):
            self.assertTrue(self.bad(lambda d: d['last'].update(recapUrl=url)), url)
            self.assertTrue(self.bad(lambda d: d['schedule'][0].update(storyUrl=url)), url)

    def test_refuses_missing_and_unknown_keys(self):
        self.assertTrue(self.bad(lambda d: d.pop('standings')))
        self.assertTrue(self.bad(lambda d: d['team'].pop('conf')))
        self.assertTrue(self.bad(lambda d: d.update(extra=1)))
        self.assertTrue(self.bad(lambda d: d['schedule'][0].update(extra=1)))

    def test_refuses_bad_values(self):
        self.assertTrue(self.bad(lambda d: d['schedule'][0].update(status='over')))
        self.assertTrue(self.bad(lambda d: d['schedule'][0].update(date='2026-09-05 23:45')))
        self.assertTrue(self.bad(lambda d: d['team'].update(rank=99)))
        self.assertTrue(self.bad(lambda d: d['team'].update(record='four-oh')))
        self.assertTrue(self.bad(lambda d: d['last']['score'].update(fla='52')))
        self.assertTrue(self.bad(lambda d: d.update(schedule=[])))
        self.assertTrue(self.bad(lambda d: d['schedule'][1].update(eventId=d['schedule'][0]['eventId'])))
        self.assertTrue(self.bad(lambda d: d['schedule'].reverse()))
        self.assertTrue(self.bad(lambda d: d['schedule'][0].update(score=None)))  # a final needs a score
        self.assertTrue(self.bad(lambda d: d['next'].update(eventId='nope')))

    def test_refuses_quarters_that_do_not_sum(self):
        self.assertTrue(self.bad(lambda d: d['last']['quarters']['fla'].__setitem__(0, 11)))

    def test_live_block_rules(self):
        live = {'eventId': self.good['next']['eventId'], 'clock': '1:00', 'period': 1, 'score': {'fla': 0, 'opp': 0}, 'possession': None, 'lastPlay': None}
        self.assertEqual(self.bad(lambda d: d.update(live=live)), [])
        self.assertTrue(self.bad(lambda d: d.update(live=dict(live, possession='us'))))
        self.assertTrue(self.bad(lambda d: d.update(live=dict(live, period=0))))

    def test_cli_reports_and_exit_codes(self):
        with tempfile.TemporaryDirectory() as t:
            p = pathlib.Path(t, 's.json')
            p.write_text(json.dumps(self.good))
            self.assertEqual(vs.main([str(p)]), 0)
            p.write_text('{not json')
            self.assertEqual(vs.main([str(p)]), 1)
            self.assertEqual(vs.main([str(p) + '.missing']), 1)


class ScheduleGateTests(unittest.TestCase):
    def setUp(self):
        self.prev = build()

    def t(self, s):
        return dt.datetime.fromisoformat(s)

    def test_no_file_is_due(self):
        self.assertTrue(sf.due(None, self.t('2026-09-29T03:33:00+00:00')))

    def test_hourly_outside_game_windows(self):
        self.assertEqual(sf.due(self.prev, self.t('2026-09-29T14:03:00+00:00')), 'hourly')
        self.assertIsNone(sf.due(self.prev, self.t('2026-09-29T14:33:00+00:00')))

    def test_every_tick_inside_the_game_window(self):
        self.assertIn('game window', sf.due(self.prev, self.t('2026-10-03T19:33:00+00:00')))   # kickoff
        self.assertIn('game window', sf.due(self.prev, self.t('2026-10-03T18:47:00+00:00')))   # 43 min before
        self.assertIn('game window', sf.due(self.prev, self.t('2026-10-03T23:41:00+00:00')))   # 4h11 after
        self.assertIsNone(sf.due(self.prev, self.t('2026-10-04T01:33:00+00:00')))              # 5h+ after and off-hour
        self.assertIsNone(sf.due(self.prev, self.t('2026-10-02T15:33:00+00:00')))              # day before

    def test_final_games_do_not_keep_the_window_open(self):
        self.assertIsNone(sf.due(self.prev, self.t('2026-09-26T21:33:00+00:00')))

    def test_in_progress_status_forces_polling(self):
        prev = copy.deepcopy(self.prev)
        prev['schedule'][4]['status'] = 'in-progress'
        self.assertIn('game window', sf.due(prev, self.t('2026-10-04T09:33:00+00:00')))


class MainTests(unittest.TestCase):
    def run_main(self, out, *extra, src=FIX):
        return sf.main(['--from-dir', str(src), '--out', str(out), '--now', '2026-09-29T03:00:00Z', '--posts', str(HERE / 'nope.json'), *extra])

    def test_writes_then_unchanged_run_makes_no_change(self):
        with tempfile.TemporaryDirectory() as t:
            out = pathlib.Path(t, 'sports-live', 'scoreboard.json')
            self.assertEqual(self.run_main(out), 0)
            first = out.read_text()
            self.assertEqual(vs.load_and_validate(out), [])
            sf.main(['--from-dir', str(FIX), '--out', str(out), '--now', '2026-09-29T09:00:00Z', '--posts', str(HERE / 'nope.json')])
            self.assertEqual(out.read_text(), first)  # same numbers, same bytes, updatedAt untouched

    def test_bad_fetch_keeps_last_good_file(self):
        with tempfile.TemporaryDirectory() as t:
            out = pathlib.Path(t, 'scoreboard.json')
            self.assertEqual(self.run_main(out), 0)
            good = out.read_text()
            self.assertEqual(self.run_main(out, src=pathlib.Path(t, 'empty')), 2)
            self.assertEqual(out.read_text(), good)

    def test_invalid_output_is_never_written(self):
        with tempfile.TemporaryDirectory() as t:
            src = pathlib.Path(t, 'src')
            src.mkdir()
            sch = load('schedule.json')
            sch['events'][0]['competitions'][0]['competitors'][0]['team']['location'] = ''  # opponent/name blank -> validator error
            for c in sch['events'][0]['competitions'][0]['competitors']:
                c['team']['location'] = ''
                c['team']['shortDisplayName'] = ''
                c['team']['displayName'] = ''
            (src / 'schedule.json').write_text(json.dumps(sch))
            for n in ('standings.json', 'summary-401856699.json'):
                (src / n).write_text((FIX / n).read_text())
            out = pathlib.Path(t, 'scoreboard.json')
            self.assertEqual(self.run_main(out, src=src), 2)
            self.assertFalse(out.exists())

    def test_not_due_makes_no_request(self):
        with tempfile.TemporaryDirectory() as t:
            out = pathlib.Path(t, 'scoreboard.json')
            self.run_main(out)
            # Off-hour, no game window: must return before touching the (missing) source directory.
            rc = sf.main(['--from-dir', str(pathlib.Path(t, 'missing')), '--out', str(out), '--now', '2026-09-29T14:33:00Z'])
            self.assertEqual(rc, 2)  # --from-dir forces a read, so this fails on the missing dir...
            rc = sf.main(['--out', str(out), '--now', '2026-09-29T14:33:00Z'])
            self.assertEqual(rc, 0)  # ...but a normal scheduled tick is a no-op with no network use


class ImportTests(unittest.TestCase):
    def test_clean_unescapes_and_drops_bulk(self):
        d = si.clean({'name': 'Texas A&amp;M', 'logos': [1], 'x': [{'links': 1, 'ok': 'a&amp;b'}]})
        self.assertEqual(d, {'name': 'Texas A&M', 'x': [{'ok': 'a&b'}]})

    def test_url_names(self):
        self.assertEqual(si.name_for('https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=5'), 'summary-5.json')
        self.assertEqual(si.name_for('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/57/schedule?season=2026&seasontype=2'), 'schedule.json')
        self.assertEqual(si.name_for('https://site.api.espn.com/apis/v2/sports/football/college-football/standings?group=8&season=2026'), 'standings.json')


if __name__ == '__main__':
    unittest.main()
