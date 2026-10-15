"""A stale or unrelated upstream feed must not replace newer verified shows."""
import importlib.util
import pathlib
import json
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location(
    'episodes_feed', pathlib.Path(__file__).resolve().parents[1] / 'episodes_feed.py')
feed = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(feed)


def xml(channel=feed.CHANNEL_ID, timezone='Z', duplicate=False):
    entries = []
    for i in range(3):
        video = 'abcdefghij' + str(0 if duplicate else i)
        entries.append('<entry><yt:videoId>%s</yt:videoId><title>Show %d</title>'
                       '<published>2026-10-15T01:00:00%s</published></entry>'
                       % (video, i, timezone))
    return ('<feed xmlns="http://www.w3.org/2005/Atom" '
            'xmlns:yt="http://www.youtube.com/xml/schemas/2015">'
            '<yt:channelId>%s</yt:channelId>%s</feed>' % (channel, ''.join(entries)))


class EpisodesFeedTests(unittest.TestCase):
    def test_valid_channel_feed(self):
        self.assertEqual(len(feed.parse(xml())), 3)

    def test_unrelated_undated_or_duplicate_feed_is_rejected(self):
        for text in (xml(''), xml('other'), xml(timezone=''), xml(duplicate=True)):
            with self.subTest(text=text), self.assertRaises(feed.EpisodeError):
                feed.parse(text)

    def test_cached_rss_cannot_replace_newer_verified_snapshot(self):
        rows = feed.parse(xml())
        with self.assertRaises(feed.EpisodeError):
            feed.prevent_regression(rows, {'episodes': [
                {'publishedAt': '2026-10-15T02:00:00Z'}]})
        feed.prevent_regression(rows, {'episodes': [
            {'publishedAt': '2026-10-14T23:00:00Z'}]})

    def test_date_only_snapshot_accepts_a_newer_rss_check(self):
        with tempfile.TemporaryDirectory() as folder:
            target = pathlib.Path(folder) / 'episodes.json'
            source = pathlib.Path(folder) / 'feed.xml'
            target.write_text(json.dumps({'checkedAt': '2026-10-15', 'episodes': [
                {'id': 'abcdefghij9', 'publishedAt': '2026-10-14T23:00:00Z'}]}))
            source.write_text(xml())
            with patch.object(feed, 'OUT', target), patch('sys.argv', [
                    'episodes_feed.py', '--from-file', str(source)]):
                self.assertEqual(feed.main(), 0)
            result = json.loads(target.read_text())
            self.assertTrue(result['checkedAt'].endswith('Z'))
            self.assertEqual(result['source'], 'YouTube public channel RSS')

    def test_failed_rss_does_not_advance_snapshot_freshness(self):
        with tempfile.TemporaryDirectory() as folder:
            target = pathlib.Path(folder) / 'episodes.json'
            source = pathlib.Path(folder) / 'feed.xml'
            original = json.dumps({'checkedAt': '2026-10-15', 'episodes': [
                {'id': 'abcdefghij9', 'publishedAt': '2026-10-15T02:00:00Z'}]})
            target.write_text(original)
            source.write_text(xml())
            with patch.object(feed, 'OUT', target), patch('sys.argv', [
                    'episodes_feed.py', '--from-file', str(source)]):
                self.assertEqual(feed.main(), 2)
            self.assertEqual(target.read_text(), original)


if __name__ == '__main__':
    unittest.main()
