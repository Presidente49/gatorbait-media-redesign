"""Regressions for the CLI's editorial boundary and read-only behavior.

Run: python3 -m unittest discover -s tools/voice -p 'test_*.py'
"""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import gb_voice


HERE = Path(__file__).resolve().parent


def run_cli(script, text, *args):
    return subprocess.run(
        [sys.executable, str(HERE / script), '-', *args],
        input=text, text=True, capture_output=True, check=False,
    )


class VoiceTests(unittest.TestCase):
    def test_catalog_word_is_advisory_and_cannot_fail_house_style(self):
        result = run_cli('gb_voice.py', 'Florida can leverage its home crowd.')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('leverage: 1', result.stdout)
        self.assertIn('house style: PASS', result.stdout)

    def test_curly_typography_and_single_em_dash_require_editor_action(self):
        for text in ('He said, “Go Gators.”', 'Florida scored—then held on.'):
            with self.subTest(text=text):
                result = run_cli('gb_voice.py', text)
                self.assertEqual(result.returncode, 1, result.stderr)
                self.assertIn('HOUSE STYLE:', result.stdout)

    def test_contrasts_and_question_answer_frames_are_review_cues(self):
        for text in (
            "It's not luck, it's preparation.",
            "This isn't luck. It's preparation.",
            'Not only did Florida score, but it also forced a turnover.',
            'Who starts? Florida has not announced a starter.',
        ):
            with self.subTest(text=text):
                self.assertTrue(gb_voice.find_issues(text, gb_voice.REVIEW_CUES))
                result = run_cli('gb_voice.py', text)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn('EDITOR REVIEW (advisory)', result.stdout)

    def test_verified_quotation_words_are_never_rewritten(self):
        original = 'He said, "It\'s not luck, it\'s preparation."\n'
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'story.txt'
            path.write_text(original, encoding='utf-8')
            result = subprocess.run(
                [sys.executable, str(HERE / 'gb_voice.py'), str(path)],
                text=True, capture_output=True, check=False,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(path.read_text(encoding='utf-8'), original)

    def test_unresolved_citation_markup_requires_editor_action(self):
        result = run_cli('gb_voice.py', 'Florida won. turn12search3')
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn('unresolved tool/citation markup', result.stdout)

    def test_sentence_statistics_have_no_authorship_verdict_or_target(self):
        for text in (
            'Florida won. Georgia lost. Auburn played.',
            'Florida won. Its defense stopped the opponent on each of the final three possessions.',
        ):
            with self.subTest(text=text):
                report = run_cli('check.py', text)
                self.assertEqual(report.returncode, 0, report.stderr)
                self.assertNotIn('human-typical', report.stdout)
                self.assertNotIn('AI-typical', report.stdout)
                self.assertNotIn('>=0.', report.stdout)
                data = json.loads(run_cli('check.py', text, '--json').stdout)
                self.assertIn('sentence_length_cv', data['stats'])
                self.assertNotIn('burstiness', data['stats'])
                self.assertFalse(any('verdict' in key for key in data['stats']))
        catalog = json.loads((HERE / 'markers.json').read_text(encoding='utf-8'))
        self.assertFalse(any('thresholds' in category for category in catalog['categories']))


if __name__ == '__main__':
    unittest.main()
