# Portable operating contract

This document defines checks, not an executor. The selected project's existing controller owns routing and production. Reuse the existing work-item identity across stages.

## Minimum loop definition

Record the objective, inputs/source freshness, baseline, one success measure, existing check cadence, action condition, ordered steps, self-check, original work-item/deduplication key, owner, permissions, rollback, stop/error conditions and output destination. Consult the intact upstream marketing-loops skill for its catalog; do not create every loop in it.

## Stage contract

For each stage record `project_id`, `work_item_id`, `stage`, `sender`, `artifact`, `revision`, scope/non-scope, source/time, QC checks, intended receiver, dispatch outcome, acknowledgment evidence, next action, verification plan, and rollback when relevant. The deduplication key is project + original item + stage + artifact revision.

REQUESTED → DISPATCHED → CLAIMED → PREPARED → APPLIED_UNVERIFIED → VERIFIED_CLOSED describes execution state. Stage advancement separately requires QC plus a receiver acknowledgment for the exact output. BLOCKED, FAILED_VERIFICATION, ROLLED_BACK and NOT_REPRODUCED are explicit alternatives, not automatically successful terminal states.

- The receiver's acknowledgment must be read from an independently recorded event, identify the actual receiving session and match the same project/item/stage/artifact/revision. A sender-authored acceptance, reaction or transport receipt is not sufficient.
- An acknowledged handoff transfers the accepted scope only. It does not close the overall business objective or grant new authority.
- Terminal closure needs objective-specific primary and independent verification, or explicit reviewed rejection/cancellation labeled as such. A screenshot does not certify email delivery; HTTP 200 does not certify revenue.
- Before an irreversible action, re-read provider state and the deduplication key. A network timeout is unknown outcome; check before retrying. Never double-publish/send/charge to test a system.
- Missing acknowledgment leaves the stage open. Use the existing cadence and permitted one-time escalation; never spawn another watcher. Failed transport is not proof the receiver is paused or absent.
- Do not silently steal a stale claim. Return it through the existing controller's reassignment process.

## Local gate use

`python3 skills/business-operations/scripts/gate.py handoff.json`

Exit 0 means the supplied record is structurally eligible to advance; exit 1 means it must stay open. Input must already be checked against the real provider/thread. The script cannot prove identity or evidence authenticity, acquire a lock, dispatch work, authorize actions or store state. A JSON flag is never a substitute for reading the actual acknowledgment.

Tests: `python3 -m unittest discover -s skills/business-operations/tests -v`

## Stop and report honestly

A bounded run ends on objective completion, unchanged state, exhausted authorized attempt, missing external evidence/access, or an approval boundary. The work item can remain open after that run. Only an existing scheduled system can resume it later; do not promise unscheduled background work.
