# Shared article drop-cap restoration

The ordinary October 25 and October 24 Franz pages had no drop-cap style or activation script. Their opening prose qualified for the existing recent-article treatment, but the active post template omitted the `gbm-week-rich-style/js` layer already present in `../proposed.html`.

`layer.html` restores that design in existing template embed `14a887e3-38ea-4258-ae0b-7d19cf9feead`, preserving the original template prefix and all embed settings. It marks exactly one actual block (the first Ricos span when block-level, otherwise the paragraph), so nested first-letter styles cannot compound. It clears old markers and deactivates outside article routes. No requests, forms, article text or publication events are added.

The native template changed from revision 24 to 27, with final length 14,935 characters, below Wix's 15,000 limit. `receipt.json` records fingerprints. Before any further change, read the live embed and current revision; never append this layer twice. Rollback removes the final layer from the current template only after confirming the original prefix fingerprint, then PATCHes with category ESSENTIAL at the new current revision. The exact private prechange snapshot is retained in the task output.

Verification: all inline scripts parse; independent review approved one first-letter origin; ordinary public URL shows a floated 87.4px orange Barlow Condensed T, one cover, unchanged full manuscript/headings, and no article overflow at 1366px. Genuine mobile rendering was unavailable. Local JavaScript SAST passed with Semgrep CE 1.182.1: 83 applicable rules across the exact changed layer and all three inline scripts in the private complete template. The Python gate passed 200 applicable rules. All scans returned zero findings, errors or skips; every script passed Node syntax checks. This establishes the stated local source scope. CSS layout, third-party scripts, authenticated endpoints and full-site DAST remain unassessed. HawkScan returned HTTP 402 before starting; no billing or paid account was used.


## Repeatable free gate

Run `python3 deploy/post-template/dropcap/security-check.py`. Requires Python 3.9+, Node.js and `uvx`; no account or API key. Optionally add `--candidate /trusted/current-template.html` to include all inline JavaScript in a private complete template containing the exact layer once. `--output-dir /new-or-empty/private-dir` saves machine-readable results, source hashes, commands and logs; otherwise a private temporary directory is created. Keep complete private template evidence outside the public repository.

The runner pins Semgrep CE 1.182.1, disables metrics, checks syntax and exact target coverage, and fails on findings, scanner errors/skips, missing rules or source drift. Community rule packs are downloaded from the registry and may change; retained results establish the rules and coverage of that run. This is local SAST, not an offline scanner or full-site DAST. The scoped GitHub Actions workflow repeats the committed layer/runner checks with read-only permissions and preserves evidence. It does not contact Wix or execute the template.

## Late Wix rendering

New Buddy articles exposed a race: the header loaded within the original 3.5-second retries, but final Ricos paragraphs arrived later and lacked decoration classes. The layer now observes child-list changes with an 80ms debounce for at most 30 seconds after each supported route/load event. Attribute changes are excluded, so its class updates do not retrigger the observer. CSS, recent-post eligibility, complete article text and the template prefix are unchanged. The layer remains 2,244 bytes and the native template remains 14,935 characters. Revision 27 independently renders one 87.4px B and F on the two Buddy articles with one cover, full copy and no desktop overflow.

Run `node --test deploy/post-template/dropcap/regression.test.mjs`. Seven deterministic tests reproduce the old late-hydration failure and verify recovery, subsequent paragraph replacement, debounce, observer stop, route restart/exit, age and prose qualification, one origin and unchanged text. `legacy-layer.fixture.html` is the original failing script fixture and is not deployed. The complete private revision-27 template also passed the existing free SAST gate. Genuine mobile layout and full-site DAST remain unverified.
