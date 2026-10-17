"""Synthetic fixture only. Preserve rollback tooling without public provider bodies."""
from pathlib import Path
import json
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / 'deploy/customer-repair/prepare-patch.py'

class PrivatePatchTest(unittest.TestCase):
    def test_guarded_private_output_and_stale_revision_hold(self):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            before = {'id': 'fixture-id', 'revision': 1, 'enabled': True, 'loadOnce': True, 'position': 'head', 'domain': None, 'pageFilter': None, 'embedData': {'html': 'SYNTHETIC_BEFORE', 'category': 'ESSENTIAL'}}
            after = {**before, 'embedData': {'html': 'SYNTHETIC_AFTER', 'category': 'ESSENTIAL'}}
            current = {**before, 'revision': 5}
            for name, value in [('fixture-id.before.json', before), ('fixture-id.after.json', after), ('current.json', current)]:
                (directory / name).write_text(json.dumps(value))
            command = ['python3', str(SCRIPT), 'apply', 'fixture-id', '--current', str(directory / 'current.json'), '--snapshot-dir', temp, '--output', str(directory / 'patch.json'), '--expected-revision']
            result = subprocess.run([*command, '5'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0)
            self.assertNotIn('SYNTHETIC_AFTER', result.stdout + result.stderr)
            saved = json.loads((directory / 'patch.json').read_text())
            self.assertEqual(saved['customEmbed']['revision'], '5')
            self.assertEqual(saved['customEmbed']['embedData'], after['embedData'])
            self.assertEqual((directory / 'patch.json').stat().st_mode & 0o777, 0o600)
            (directory / 'patch.json').unlink()
            result = subprocess.run([*command, '4'], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse((directory / 'patch.json').exists())

    def test_public_output_path_rejected_before_read(self):
        result = subprocess.run(['python3', str(SCRIPT), 'rollback', 'fixture-id', '--current', '/tmp/absent-fixture.json', '--snapshot-dir', '/tmp/fixture', '--output', str(ROOT / 'deploy/customer-repair/fixture.json'), '--expected-revision', '1'], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)
        self.assertIn('outside the public checkout', result.stderr)

if __name__ == '__main__':
    unittest.main()
