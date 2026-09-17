#!/usr/bin/env python3
"""Dependency-free tests for the GatorBait controller transition rules."""

from __future__ import annotations

import unittest

from controller import evaluate_cycle


CONFIG = {
    "interval_seconds": 900,
    "controller": {
        "failure_recheck_seconds": 90,
        "failure_verification_attempts": 1,
    },
}


def health(ok: bool) -> dict:
    return {
        "checks": [
            {
                "name": "Homepage",
                "ok": ok,
                "status": 200 if ok else 500,
                "error": "" if ok else "unexpected response",
            }
        ]
    }


class ControllerTests(unittest.TestCase):
    def test_healthy_cycle_does_nothing(self) -> None:
        state = evaluate_cycle(health(True), None, CONFIG)
        self.assertEqual(state["phase"], "observe")
        self.assertEqual(state["decision"], "no_action")
        self.assertEqual(state["next_check_seconds"], 900)
        self.assertFalse(state["model_required"])
        self.assertFalse(state["production_write_authorized"])

    def test_first_failure_gets_one_short_verification(self) -> None:
        state = evaluate_cycle(health(False), None, CONFIG)
        self.assertEqual(state["phase"], "verify")
        self.assertEqual(state["decision"], "verify_again")
        self.assertEqual(state["next_check_seconds"], 90)
        self.assertEqual(state["consecutive_failed_cycles"], 1)

    def test_persistent_failure_escalates_instead_of_looping(self) -> None:
        first = evaluate_cycle(health(False), None, CONFIG)
        second = evaluate_cycle(health(False), first, CONFIG)
        self.assertEqual(second["phase"], "escalate")
        self.assertEqual(second["decision"], "escalate")
        self.assertEqual(second["next_check_seconds"], 900)
        self.assertEqual(second["consecutive_failed_cycles"], 2)
        self.assertFalse(second["production_write_authorized"])

    def test_recovery_resets_failure_state(self) -> None:
        failed = evaluate_cycle(health(False), None, CONFIG)
        recovered = evaluate_cycle(health(True), failed, CONFIG)
        self.assertEqual(recovered["decision"], "recovered")
        self.assertEqual(recovered["consecutive_failed_cycles"], 0)
        self.assertEqual(recovered["failed_checks"], [])


if __name__ == "__main__":
    unittest.main()
