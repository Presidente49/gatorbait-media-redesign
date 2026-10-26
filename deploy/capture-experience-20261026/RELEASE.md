# Capture release — October 26, 2026

The free-email signup experience is published through one existing native Wix custom-code embed. Existing automatic Blog email/push routing, memberships, consent, audiences and billing were not changed.

## Immutable release

- Source: `sports-live/src/capture.js`, SHA256 `3d3edee0dfe439cc5c439016397bd089c5de0c2b650159b3cc86bb19415b9776`.
- Standalone21516-byte bundle: `deploy/capture-experience-20261026/capture-candidate.js`, SHA256 `c4fe35809124c43c81ced0cf0ff5908bd74990859de7c88ec780bd52ae411426`.
- [Immutable deployed asset](https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@3c4320e4b48f48051594854547d65d5136a32a95/deploy/capture-experience-20261026/capture-candidate.js): HTTP200 and exact byte comparison passed before attachment.
- SRI: `sha384-iPDPUJOEXcQwgzP2cQLGUwxE/BwOJtnAs2Rf6YBP1wYP1rOYGoHRWeR3FS3adzPC`, crossorigin anonymous, synchronous script, no async/defer.
- Existing Site Fixer embed `5a43ae83-690e-4933-971d-4837db00b2f3`: native revision25→26 for the scoped prepend, then native Custom Code Apply→27 to complete the release. Final10742characters; original HTML retained exactly and all embed settings preserved. No site-wide Editor publish.

## Verification

- Eleven focused mocked Chromium regressions passed, including consent, pending-only acceptance, timing, frequency, collisions, both actual legacy load orders and current-renderer responsive/SPA behavior. No test submitted to Wix.
- Independent actual Chrome checks passed at320/390/430/1366 on a fresh public document. One correct email CTA,44px phone row after the existing60px shell, preserved logo/Shop/Menu and no overflow. Desktop has the sole link in the actual current navigation.
- Ordinary canonical homepage runtime verified at15:11:02.908Z; ordinary magazine runtime/one warm card/unchecked consent at15:12:14.233Z; ordinary canonical representative article runtime/one warm article-end card/unchecked consent at15:14:12.946Z. Earlier old cached responses are retained in the private receipt; no claim that the first API acceptance alone verified delivery.
- Final static security analysis ran68 JavaScript rules on production source and deployed bundle: zero findings,100% parse coverage.
- HawkScan CLI6.5.0 and current skills passed preflight checks, but the existing account's app lookup returned HTTP402 Payment Required. No DAST scan started, no scan ID or pass claimed, and no billing/credentials/account changes were made. Account entitlement remains the precise prerequisite for DAST.

## Separate native app change

Spaces native publication revision27 at14:50:30.201Z adds a free-email explanation and large button at the top of the existing unrestricted Membership screen. The existing hosted form is the destination. Native normalized comparison found zero existing-section or screen-permission changes; existing sign-in, renewal help and paid access remain. No email or push was sent for testing.

Physical-phone signup/login/renewal/push delivery and real confirmation-email delivery remain unproven. The production55-second invitation default has deterministic browser coverage; no existing visitor preferences were cleared to force a live impression. Browser events, a form acceptance and labels do not prove confirmed subscription.

## Rollback and operational record

Restore only the saved pre-bootstrap HTML using the then-current revision and an ownership/fingerprint check. Then cold-reload and verify the old runtime. Private before/after snapshots, native app receipt, aggregate audience audit and public QC remain outside GitHub. The controller work record is [issue34](https://github.com/Presidente49/gatorbait-media-redesign/issues/34). No customer records or private manuscript copy are included in this branch.
