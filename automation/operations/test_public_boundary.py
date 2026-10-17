import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('public-boundary.py')
spec = importlib.util.spec_from_file_location('public_boundary', SCRIPT)
boundary = importlib.util.module_from_spec(spec)
spec.loader.exec_module(boundary)

class PublicBoundaryTest(unittest.TestCase):
    def test_private_categories_rejected_public_sources_kept(self):
        for path in ['backups/crm/fixture.txt', 'deploy/customer-repair/fixture.before.json', 'deploy/customer-repair/fixture.after.json', 'deploy/customer-repair/fixture.playback-fallback.json', 'scratchpad/receipt.json', 'private/state.json', '.shared-memory/state', 'automation/ops-hub/.state/status.json', 'social/queue/fixture.md', 'marketing/outreach/fixture.md', 'receipt.runtime.json', '.env', 'app/.env.local']:
            self.assertTrue(boundary.private_path(path), path)
        for path in ['sports-live/posts.json', 'automation/operations/contract.json', 'apps/writers-desk/prototype/db/schema.ts', '.env.example', 'deploy/backups/loader.html']:
            self.assertFalse(boundary.private_path(path), path)

    def test_artifact_guard_checks_ignored_files_without_printing_content(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root/'sports-live').mkdir()
            (root/'sports-live/homepage.js').write_text('synthetic public fixture')
            result = subprocess.run(['python3', str(SCRIPT), '--artifact-root', temp], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0)
            (root/'backups/crm').mkdir(parents=True)
            (root/'backups/crm/fixture.txt').write_text('SYNTHETIC_PRIVATE_SENTINEL')
            result = subprocess.run(['python3', str(SCRIPT), '--artifact-root', temp], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertNotIn('SYNTHETIC_PRIVATE_SENTINEL', result.stdout + result.stderr)
            self.assertNotIn('fixture.txt', result.stdout + result.stderr)
            (root/'backups/crm/fixture.txt').unlink()
            placeholder = root/'backups/crm/.gitkeep'
            placeholder.write_text('')
            self.assertEqual(subprocess.run(['python3', str(SCRIPT), '--artifact-root', temp], capture_output=True).returncode, 0)
            placeholder.write_text('SYNTHETIC_PRIVATE_SENTINEL')
            self.assertEqual(subprocess.run(['python3', str(SCRIPT), '--artifact-root', temp], capture_output=True).returncode, 1)

if __name__ == '__main__':
    unittest.main()
