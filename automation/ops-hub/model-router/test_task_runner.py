#!/usr/bin/env python3
"""Dependency-free tests for the GatorBait multi-harness router."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
RUNNER_PATH = HERE / "task-runner.py"

spec = importlib.util.spec_from_file_location("gatorbait_task_runner", RUNNER_PATH)
assert spec is not None and spec.loader is not None
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class RoutingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.policy = runner.load_policy()

    def test_public_low_risk_editorial_uses_fcc_claude(self) -> None:
        self.assertEqual(
            runner.choose_harness("public_low_risk", "editorial", None, self.policy),
            "fcc_claude",
        )

    def test_public_low_risk_code_uses_fcc_codex(self) -> None:
        self.assertEqual(
            runner.choose_harness("public_low_risk", "code", None, self.policy),
            "fcc_codex",
        )

    def test_high_reasoning_editorial_uses_native_claude(self) -> None:
        self.assertEqual(
            runner.choose_harness("public_high_reasoning", "editorial", None, self.policy),
            "claude_native",
        )

    def test_high_reasoning_code_uses_native_codex(self) -> None:
        self.assertEqual(
            runner.choose_harness("public_high_reasoning", "code", None, self.policy),
            "codex_native",
        )

    def test_sensitive_non_code_uses_native_claude(self) -> None:
        self.assertEqual(
            runner.choose_harness("sensitive", "operations", None, self.policy),
            "claude_native",
        )

    def test_explicit_fcc_rejected_for_sensitive_lane(self) -> None:
        with self.assertRaises(ValueError):
            runner.choose_harness("sensitive", "analysis", "fcc_claude", self.policy)

    def test_credentials_lane_is_blocked(self) -> None:
        with self.assertRaises(ValueError):
            runner.choose_harness("credentials_and_secrets", "analysis", None, self.policy)


class SafetyTests(unittest.TestCase):
    def test_detects_api_key_assignment(self) -> None:
        self.assertTrue(runner.secret_like("OPENAI_API_KEY=sk-exampleexampleexample"))

    def test_detects_bearer_token(self) -> None:
        self.assertTrue(runner.secret_like("Authorization: Bearer abcdefghijklmnopqrstuvwxyz"))

    def test_normal_prompt_is_not_rejected(self) -> None:
        self.assertFalse(runner.secret_like("Review the public Auburn magazine package."))

    def test_claude_command_is_read_only(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            command = runner.command_for(
                "claude_native",
                "Inspect only",
                Path(temp),
                6,
            )
        self.assertIn("--permission-mode", command)
        self.assertIn("dontAsk", command)
        self.assertIn("Read,Glob,Grep", command)
        self.assertNotIn("Edit", command)

    def test_codex_command_requests_read_only(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            command = runner.command_for(
                "codex_native",
                "Inspect only",
                Path(temp),
                6,
            )
        self.assertIn("--sandbox", command)
        self.assertIn("read-only", command)
        self.assertIn("--ephemeral", command)

    def test_filesystem_snapshot_does_not_copy_git_or_state(self) -> None:
        with tempfile.TemporaryDirectory() as source_temp, tempfile.TemporaryDirectory() as dest_temp:
            source = Path(source_temp)
            (source / "visible.txt").write_text("ok", encoding="utf-8")
            (source / ".state").mkdir()
            (source / ".state" / "secret.txt").write_text("no", encoding="utf-8")
            target = Path(dest_temp) / "snapshot"
            method = runner.make_snapshot(source, target)
            self.assertEqual(method, "filesystem_copy")
            self.assertTrue((target / "visible.txt").exists())
            self.assertFalse((target / ".state").exists())


class CliDryRunTests(unittest.TestCase):
    def test_dry_run_routes_without_harness_binary(self) -> None:
        proc = subprocess.run(
            [
                sys.executable,
                str(RUNNER_PATH),
                "--lane",
                "public_high_reasoning",
                "--kind",
                "editorial",
                "--prompt",
                "Review public copy only.",
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(proc.returncode, 0, proc.stderr)
        payload = json.loads(proc.stdout)
        self.assertTrue(payload["dry_run"])
        self.assertEqual(payload["harness"], "claude_native")
        self.assertFalse(payload["production_write_authorized"])


if __name__ == "__main__":
    unittest.main()
