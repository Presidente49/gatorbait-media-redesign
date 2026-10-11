"""No network needed: reject the legacy collision before importing the feed adapter."""
from pathlib import Path
import subprocess
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch
import runpy

ROOT = Path(__file__).resolve().parents[2]
BUILDER = ROOT / 'automation/sports-home/build.py'

class BuildBoundaryTest(unittest.TestCase):
    def test_legacy_default_and_production_paths_fail_before_io(self):
        protected = ['homepage.js', 'frame.html', 'qa.html', 'manifest.json', 'current.json']
        before = {p: (ROOT / 'sports-live' / p).read_bytes() for p in protected}
        args = [[], ['--output-dir', str(ROOT / 'sports-live')], ['--output-dir', str(ROOT / 'sports-live/subdir')]]
        with tempfile.TemporaryDirectory() as temp:
            alias = Path(temp) / 'alias'
            alias.symlink_to(ROOT / 'sports-live', target_is_directory=True)
            args.append(['--output-dir', str(alias)])
            isolated = Path(temp) / 'isolated'
            isolated.mkdir()
            (isolated / 'homepage.js').symlink_to(ROOT / 'sports-live/homepage.js')
            args.append(['--output-dir', str(isolated)])
            for option in args:
                result = subprocess.run(['python3', str(BUILDER), *option], capture_output=True, text=True)
                self.assertEqual(result.returncode, 2)
                self.assertNotIn('fetch_feed', result.stderr)
                self.assertNotIn('Traceback', result.stderr)
        self.assertEqual(before, {p: (ROOT / 'sports-live' / p).read_bytes() for p in protected})

    def test_historical_builder_still_builds_isolated_rollback_fixture(self):
        fixture = [{'title': 'Synthetic fixture story'}]
        feed = SimpleNamespace(fetch_feed=lambda: '', parse_feed=lambda _: fixture, validate=lambda _: None)
        spec = SimpleNamespace(loader=SimpleNamespace(exec_module=lambda _: None))
        protected = (ROOT / 'sports-live/homepage.js').read_bytes()
        with tempfile.TemporaryDirectory() as temp:
            with patch('sys.argv', [str(BUILDER), '--output-dir', temp]), patch('importlib.util.spec_from_file_location', return_value=spec), patch('importlib.util.module_from_spec', return_value=feed):
                runpy.run_path(str(BUILDER), run_name='__main__')
            for name in ['homepage.js', 'manifest.json', 'qa.html', 'frame.html']:
                self.assertTrue((Path(temp) / name).exists())
        self.assertEqual(protected, (ROOT / 'sports-live/homepage.js').read_bytes())

if __name__ == '__main__':
    unittest.main()
