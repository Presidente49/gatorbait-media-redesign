#!/usr/bin/env python3
"""Read-only structural gate. External evidence must be verified before input."""
from __future__ import annotations
import json
import sys
from pathlib import Path
from typing import Any

IDENTITY = ("project_id", "work_item_id", "stage", "artifact", "revision", "scope")


def _filled(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _evidence(record: Any, expected: dict[str, Any], *, independent: bool) -> bool:
    if not isinstance(record, dict):
        return False
    if record.get("verified") is not True or not _filled(record.get("reference")):
        return False
    if not _filled(record.get("source")) or not _filled(record.get("checked_at")):
        return False
    if any(record.get(key) != expected.get(key) for key in IDENTITY):
        return False
    return not independent or record.get("independent") is True


def validate(record: Any) -> list[str]:
    """Return blocking reasons. No writes, scheduling, networking or permissions."""
    if not isinstance(record, dict):
        return ["record must be an object"]
    errors = [f"missing {key}" for key in (*IDENTITY, "sender") if not _filled(record.get(key))]
    qc = record.get("qc")
    if not isinstance(qc, dict) or qc.get("passed") is not True or not _filled(qc.get("evidence")):
        errors.append("stage QC has not passed with evidence")
    terminal = record.get("terminal", False)
    if not isinstance(terminal, bool):
        errors.append("terminal must be a boolean")
        return errors
    if terminal:
        disposition = record.get("disposition")
        if disposition == "verified":
            p, i = record.get("primary"), record.get("independent")
            if not _evidence(p, record, independent=False):
                errors.append("missing exact primary verification")
            if not _evidence(i, record, independent=True):
                errors.append("missing exact independent verification")
            if isinstance(p, dict) and isinstance(i, dict):
                if p.get("source") == i.get("source") or p.get("reference") == i.get("reference"):
                    errors.append("primary and independent evidence must use different sources and references")
            if not _filled(record.get("success_measure")) or record.get("objective_met") is not True:
                errors.append("business objective not verified")
        elif disposition in ("rejected", "cancelled"):
            review = record.get("review")
            if not _evidence(review, record, independent=True):
                errors.append("missing verified review decision")
            if not isinstance(review, dict) or not _filled(review.get("reviewer")) or review.get("decision") != disposition:
                errors.append("reviewer and matching disposition required")
        else:
            errors.append("terminal disposition must be verified, rejected or cancelled")
        return errors
    receiver = record.get("receiver")
    if not _filled(receiver) or receiver == record.get("sender"):
        errors.append("actual distinct receiving session required")
    ack = record.get("acknowledgment")
    if not _evidence(ack, record, independent=True):
        errors.append("missing independently read exact acknowledgment")
    if not isinstance(ack, dict):
        return errors
    if ack.get("accepted") is not True or ack.get("receiver") != receiver or ack.get("author_session") != receiver:
        errors.append("receiver did not author acceptance for this scope")
    for key in ("scope", "next_action", "verification_plan"):
        if not _filled(ack.get(key)):
            errors.append(f"acknowledgment missing {key}")
    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: gate.py handoff.json", file=sys.stderr)
        return 2
    try:
        record = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(json.dumps({"eligible": False, "error": str(exc)}))
        return 2
    errors = validate(record)
    print(json.dumps({"eligible": not errors, "blockers": errors,
                      "limit": "Structural check only; verify actual provider evidence separately."}, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
