# Source-only operating contract

`contract.json` defines the proposed accountable roles and approval boundaries. Chris is the controller; retained specialists keep their expertise and work within their assigned stage. Flaco / Wix Operations owns controller-assigned site writes. Muse alone owns social distribution. Magazine, newsletter, roundup and Daily News blog releases have separate checks. Wix Dashboard supplies the business metric baseline; observations and reconciliations belong in private storage.

This contract supersedes conflicting role, social-routing, production-builder and email-send instructions in older documents. Original skills, wrappers, lessons and rollback sources remain intact. Preserved instructions are evidence; they do not expand the active owner's authorization. This source change authorizes no service activation, credentials, schedule changes, publication, deployment or email send. Every subscriber campaign needs its own owner approval after audience, consent, preview and governor checks.

The sole production Front Page builder is `sports-live/build-front-page.mjs`. The retained `automation/sports-home/build.py` requires an explicit isolated output directory and rejects the production directory and paths resolving into it. Routine checks use deterministic code. Unchanged events resolve to NOOP, editorial judgment gets at most one model call per revision, and only a proven no-write failure permits one retry.

`DryRunDesk` is an in-memory reference, with invented fixtures and no I/O. A future implementation must authenticate intake, resolve a private trusted-writer registry, persist originals and revisions atomically, deduplicate stable delivery identities, preserve bylines, fence publication claims and read back uncertain outcomes. It must never trust a caller-supplied `trusted` flag as authentication. QC evidence flags are assertions to test, not proof of factual accuracy, rights or permanent media.

A registered delivery replay returns its original receipt without changing current copy. A distinct delivery must match the current `expectedRevision` before deduplication; only a repeat of the current digest is a copy duplicate. Intentional A → B → A submissions with distinct deliveries create three immutable revisions and require fresh QC for the revert.

Publication uses two separate keys: `operationKey` stays stable across the one permitted retry; `attemptKey` changes for each attempt. Every completion/reconciliation result must carry the active `attemptKey`. Delayed results from an older attempt are rejected before any state change. A real private store must atomically persist and compare the attempt fence as well as the idempotency key; the token is not authentication.

Missing rights, ambiguous facts, high-impact exceptions, stale revisions and conflicting canonical identities fail closed. Accepted or timed-out publication requires reconciliation before retry. Only provider and public verification permit a handoff to Muse. Newsletter preparation does not authorize a send.

No inbox, account, contact, unpublished copy, asset link, receipt or business figure belongs in this public repository, including hashed versions. Real adapters require a private durable store, authenticated provider access and end-to-end testing before separately authorized activation. Passing these synthetic tests proves the reference behavior only.

Local checks:

```sh
node --test automation/operations/contract.test.mjs automation/operations/submission-contract.test.mjs
python3 -m unittest automation.operations.test_build_boundary
```
