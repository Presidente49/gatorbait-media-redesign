#!/usr/bin/env python3
"""Dependency-free tests for bounded controller learning."""

from __future__ import annotations

import unittest

from learning import learning_summary, update_learning_state


CONFIG = {
    "learning": {
        "enabled": True,
        "recurrence_threshold": 3,
        "escalation_threshold": 2,
        "max_incidents": 100,
        "max_candidates": 20,
    }
}


def controller(
    fingerprint: str = "",
    decision: str = "no_action",
    failed_checks: list[str] | None = None,
) -> dict:
    return {
        "failure_fingerprint": fingerprint,
        "decision": decision,
        "failed_checks": failed_checks or [],
    }


class LearningTests(unittest.TestCase):
    def test_polling_same_incident_counts_one_episode(self) -> None:
        first_controller = controller("abc", "verify_again", ["Homepage"])
        state = update_learning_state(
            None,
            first_controller,
            None,
            "2026-09-20T00:00:00Z",
            CONFIG,
        )
        second_controller = controller("abc", "escalate", ["Homepage"])
        state = update_learning_state(
            state,
            second_controller,
            first_controller,
            "2026-09-20T00:02:00Z",
            CONFIG,
        )
        record = state["incidents"]["abc"]
        self.assertEqual(record["episodes"], 1)
        self.assertEqual(record["failed_cycles"], 2)

    def test_recovery_is_recorded(self) -> None:
        failed = controller("abc", "verify_again", ["Homepage"])
        state = update_learning_state(
            None,
            failed,
            None,
            "2026-09-20T00:00:00Z",
            CONFIG,
        )
        healthy = controller()
        state = update_learning_state(
            state,
            healthy,
            failed,
            "2026-09-20T00:05:00Z",
            CONFIG,
        )
        self.assertEqual(state["incidents"]["abc"]["recoveries"], 1)
        self.assertEqual(state["healthy_cycles"], 1)

    def test_three_separate_episodes_become_review_candidate(self) -> None:
        state = None
        previous = None
        for index in range(3):
            failed = controller("abc", "verify_again", ["Homepage"])
            state = update_learning_state(
                state,
                failed,
                previous,
                f"2026-09-20T00:{index * 10:02d}:00Z",
                CONFIG,
            )
            previous = failed
            healthy = controller()
            state = update_learning_state(
                state,
                healthy,
                previous,
                f"2026-09-20T00:{index * 10 + 5:02d}:00Z",
                CONFIG,
            )
            previous = healthy

        self.assertEqual(len(state["candidates"]), 1)
        candidate = state["candidates"][0]
        self.assertEqual(candidate["fingerprint"], "abc")
        self.assertEqual(candidate["episodes"], 3)
        self.assertEqual(candidate["status"], "review_candidate")

    def test_learning_never_self_authorizes(self) -> None:
        state = update_learning_state(
            None,
            controller("abc", "escalate", ["Homepage"]),
            None,
            "2026-09-20T00:00:00Z",
            CONFIG,
        )
        summary = learning_summary(state)
        self.assertFalse(summary["auto_promote_to_doctrine"])
        self.assertFalse(summary["auto_authorize_production_writes"])


if __name__ == "__main__":
    unittest.main()
