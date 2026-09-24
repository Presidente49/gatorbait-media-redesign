"""Mock CLI tests, not real Claude installations."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

BOOT=Path(__file__).resolve().parent/'bootstrap-multi-harness.sh'

class BootstrapTests(unittest.TestCase):
    def run_boot(self,arg,fail=''):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);log=root/'calls';cli=root/'claude'
            cli.write_text('#!/bin/sh\nprintf "%s\\n" "$*" >> "$TEST_LOG"\nif [ "$*" = "$FAIL_COMMAND" ]; then exit 17; fi\nprintf "{}\\n"\n')
            cli.chmod(0o700)
            env=dict(os.environ,PATH=str(root)+':/usr/bin:/bin',TEST_LOG=str(log),FAIL_COMMAND=fail)
            p=subprocess.run(['/bin/sh',str(BOOT),arg],capture_output=True,text=True,env=env)
            return p,log.read_text().splitlines() if log.exists() else []
    def test_install_does_not_require_optional_gateways(self):
        p,calls=self.run_boot('--install-knowledge-plugins')
        self.assertEqual(0,p.returncode,p.stderr)
        self.assertEqual(['plugin list --json','plugin marketplace add anthropics/knowledge-work-plugins','plugin install operations@knowledge-work-plugins','plugin install marketing@knowledge-work-plugins','plugin install data@knowledge-work-plugins','plugin list --json'],calls)
    def test_marketplace_failure_stops(self):
        p,calls=self.run_boot('--install-knowledge-plugins','plugin marketplace add anthropics/knowledge-work-plugins')
        self.assertEqual(17,p.returncode);self.assertEqual(2,len(calls))
    def test_plugin_failure_stops(self):
        p,calls=self.run_boot('--install-knowledge-plugins','plugin install operations@knowledge-work-plugins')
        self.assertEqual(17,p.returncode);self.assertEqual(3,len(calls))
    def test_verify_is_read_only(self):
        p,calls=self.run_boot('--verify-knowledge-plugins')
        self.assertEqual(0,p.returncode);self.assertEqual(['plugin list --json'],calls)
    def test_inventory_failure_stops_install(self):
        p,calls=self.run_boot('--install-knowledge-plugins','plugin list --json')
        self.assertEqual(17,p.returncode);self.assertEqual(['plugin list --json'],calls)
    def test_unknown_option_no_cli(self):
        p,calls=self.run_boot('--invented');self.assertEqual(2,p.returncode);self.assertEqual([],calls)
    def test_missing_claude_fails(self):
        with tempfile.TemporaryDirectory() as d:
            Path(d,'dirname').symlink_to(shutil.which('dirname'))
            p=subprocess.run(['/bin/sh',str(BOOT),'--install-knowledge-plugins'],capture_output=True,text=True,env=dict(os.environ,PATH=d))
            self.assertEqual(2,p.returncode);self.assertIn('BLOCKED',p.stderr)

if __name__=='__main__':unittest.main()
