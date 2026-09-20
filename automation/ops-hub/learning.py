#!/usr/bin/env python3
"""Bounded evidence accumulation for the local GatorBait controller.

This module records repeated operational patterns. It does not authorize writes,
change doctrine, or call models. Promotion into durable rules remains a reviewed
controller action.
"""

from __future__ import annotations

from copy import deepcopy
from typing import Any


def _int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _trim_incidents(
    incidents: dict[str, dict[str, Any]],
    limit: int,
) -> dict[str, dict[str, Any]]:
    if len(incidents) <= limit:
        return incidents
    ordered = sorted(
        incidents.items(),
        key=lambda item: str(item[1].get("last_seen", "")),
        reverse=True,
    )
    return dict(ordered[:limit])


def _candidate_reason(
    record: dict[str, Any],
    recurrence_threshold: int,
    escalation_threshold: int,
) -> str:
    episodes = _int(record.get("episodes"))
    escalations = _int(record.get("escalations"))
    if episodes >= recurrence_threshold:
        return f"recurred across {episodes} separate incident episodes"
    return f"escalated {escalations} times after bounded verification"


def update_learning_state(
    previous_learning: dict[str, Any] | None,
    controller: dict[str, Any],
    previous_controller: dict[str, Any] | None,
    checked_at: str,
    config: dict[str, Any],
) -> dict[str, Any]:
    """Accumulate compact operational evidence from one controller cycle."""

    learning_config = config.get("learning", {})
    if not learning_config.get("enabled", True):
        return previous_learning or {
            "version": 1,
            "enabled": False,
            "total_cycles": 0,
            "healthy_cycles": 0,
            "incident_episodes": 0,
            "incidents": {},
            "candidates": [],
        }

    recurrence_threshold = max(
        2, _int(learning_config.get("recurrence_threshold"), 3)
    )
    escalation_threshold = max(
        1, _int(learning_config.get("escalation_threshold"), 2)
    )
    max_incidents = max(10, _int(learning_config.get("max_incidents"), 100))
    max_candidates = max(1, _int(learning_config.get("max_candidates"), 20))

    state = deepcopy(previous_learning) if previous_learning else {}
    state["version"] = 1
    state["enabled"] = True
    state["total_cycles"] = _int(state.get("total_cycles")) + 1
    state["healthy_cycles"] = _int(state.get("healthy_cycles"))
    state["incident_episodes"] = _int(state.get("incident_episodes"))
    incidents = state.get("incidents")
    if not isinstance(incidents, dict):
        incidents = {}

    fingerprint = str(controller.get("failure_fingerprint", "") or "")
    prior = previous_controller or {}
    prior_fingerprint = str(prior.get("failure_fingerprint", "") or "")
    decision = str(controller.get("decision", "") or "")
    prior_decision = str(prior.get("decision", "") or "")

    if fingerprint:
        record = incidents.get(fingerprint)
        if not isinstance(record, dict):
            record = {
                "fingerprint": fingerprint,
                "failed_checks": [],
                "first_seen": checked_at,
                "last_seen": checked_at,
                "episodes": 0,
                "failed_cycles": 0,
                "escalations": 0,
                "recoveries": 0,
                "last_recovered": None,
            }

        record["failed_checks"] = list(controller.get("failed_checks", []))
        record["last_seen"] = checked_at
        record["failed_cycles"] = _int(record.get("failed_cycles")) + 1

        if fingerprint != prior_fingerprint:
            record["episodes"] = _int(record.get("episodes")) + 1
            state["incident_episodes"] += 1

        if decision == "escalate" and (
            fingerprint != prior_fingerprint or prior_decision != "escalate"
        ):
            record["escalations"] = _int(record.get("escalations")) + 1

        incidents[fingerprint] = record
    else:
        state["healthy_cycles"] += 1
        if prior_fingerprint and prior_fingerprint in incidents:
            record = incidents[prior_fingerprint]
            record["recoveries"] = _int(record.get("recoveries")) + 1
            record["last_recovered"] = checked_at
            incidents[prior_fingerprint] = record

    incidents = _trim_incidents(incidents, max_incidents)
    state["incidents"] = incidents

    candidates = []
    for record in incidents.values():
        episodes = _int(record.get("episodes"))
        escalations = _int(record.get("escalations"))
        if (
            episodes >= recurrence_threshold
            or escalations >= escalation_threshold
        ):
            candidates.append(
                {
                    "fingerprint": record.get("fingerprint", ""),
                    "failed_checks": list(record.get("failed_checks", [])),
                    "episodes": episodes,
                    "failed_cycles": _int(record.get("failed_cycles")),
                    "escalations": escalations,
                    "recoveries": _int(record.get("recoveries")),
                    "first_seen": record.get("first_seen"),
                    "last_seen": record.get("last_seen"),
                    "last_recovered": record.get("last_recovered"),
                    "reason": _candidate_reason(
                        record,
                        recurrence_threshold,
                        escalation_threshold,
                    ),
                    "status": "review_candidate",
                }
            )

    candidates.sort(
        key=lambda item: (
            _int(item.get("episodes")),
            _int(item.get("escalations")),
            str(item.get("last_seen", "")),
        ),
        reverse=True,
    )
    state["candidates"] = candidates[:max_candidates]
    state["last_updated"] = checked_at
    state["policy"] = {
        "auto_promote_to_doctrine": False,
        "auto_authorize_production_writes": False,
        "recurrence_threshold": recurrence_threshold,
        "escalation_threshold": escalation_threshold,
    }
    return state


def learning_summary(state: dict[str, Any] | None) -> dict[str, Any]:
    """Return the small summary safe to attach to every status payload."""

    payload = state or {}
    incidents = payload.get("incidents", {})
    candidates = payload.get("candidates", [])
    return {
        "enabled": bool(payload.get("enabled", True)),
        "total_cycles": _int(payload.get("total_cycles")),
        "healthy_cycles": _int(payload.get("healthy_cycles")),
        "incident_episodes": _int(payload.get("incident_episodes")),
        "tracked_incidents": len(incidents) if isinstance(incidents, dict) else 0,
        "review_candidates": len(candidates) if isinstance(candidates, list) else 0,
        "auto_promote_to_doctrine": False,
        "auto_authorize_production_writes": False,
    }
