#!/usr/bin/env python3
"""Deterministic controller state transitions for the local GatorBait Ops Hub."""

from __future__ import annotations

import hashlib
from typing import Any


def _fingerprint(failures: list[dict[str, Any]]) -> str:
    material = "\n".join(
        f"{item.get('name','')}|{item.get('status',0)}|{item.get('error','')}"
        for item in failures
    )
    return hashlib.sha256(material.encode("utf-8")).hexdigest()[:16] if material else ""


def evaluate_cycle(
    health: dict[str, Any],
    previous: dict[str, Any] | None,
    config: dict[str, Any],
) -> dict[str, Any]:
    """Turn deterministic health evidence into one bounded controller decision."""

    controller_config = config.get("controller", {})
    normal_interval = max(60, int(config.get("interval_seconds", 900)))
    verify_delay = max(
        60, int(controller_config.get("failure_recheck_seconds", 90))
    )
    verification_attempts = max(
        1, int(controller_config.get("failure_verification_attempts", 1))
    )

    failures = [item for item in health.get("checks", []) if not item.get("ok")]
    failed_names = sorted(str(item.get("name", "")) for item in failures)
    fingerprint = _fingerprint(failures)

    prior = previous or {}
    prior_names = sorted(str(value) for value in prior.get("failed_checks", []))
    same_failure = bool(failed_names) and failed_names == prior_names
    consecutive = int(prior.get("consecutive_failed_cycles", 0)) + 1 if same_failure else 1

    if not failures:
        recovered = bool(prior.get("failed_checks"))
        return {
            "architecture": "single-controller",
            "phase": "observe",
            "decision": "recovered" if recovered else "no_action",
            "reason": "deterministic checks are healthy",
            "failed_checks": [],
            "failure_fingerprint": "",
            "consecutive_failed_cycles": 0,
            "next_check_seconds": normal_interval,
            "model_required": False,
            "production_write_authorized": False,
        }

    if consecutive <= verification_attempts:
        return {
            "architecture": "single-controller",
            "phase": "verify",
            "decision": "verify_again",
            "reason": "first deterministic failure; confirm before escalation",
            "failed_checks": failed_names,
            "failure_fingerprint": fingerprint,
            "consecutive_failed_cycles": consecutive,
            "next_check_seconds": verify_delay,
            "model_required": False,
            "production_write_authorized": False,
        }

    return {
        "architecture": "single-controller",
        "phase": "escalate",
        "decision": "escalate",
        "reason": "failure persisted after bounded deterministic verification",
        "failed_checks": failed_names,
        "failure_fingerprint": fingerprint,
        "consecutive_failed_cycles": consecutive,
        "next_check_seconds": normal_interval,
        "model_required": False,
        "production_write_authorized": False,
    }
