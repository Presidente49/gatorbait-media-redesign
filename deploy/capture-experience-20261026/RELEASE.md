# Capture release — October 26, 2026

The free-email signup experience is published through one existing native Wix custom-code embed. Existing automatic Blog email/push routing, memberships, consent, audiences and billing were not changed.

## Immutable release

- Source: `sports-live/src/capture.js`, SHA256 `7fec039aaa0569e120ccbe9f1fc72670cb5aff908596b8de3cd80afa652e83dc`.
- Standalone21620-byte bundle: `deploy/capture-experience-20261026/capture-candidate.js`, SHA256 `aa68ae05273992935302c7d3ea828ec07764caadf1dd07910673275dc959e741`.
- [Immutable deployed asset](https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@c83906fce450cdc9ee4544c4cd11c3ddf4ca20c5/deploy/capture-experience-20261026/capture-candidate.js): HTTP200 and exact byte comparison passed before attachment.
- SRI: `sha384-5ewXtPHzruKIVlVDlWgR9aOFeRfEuiPmWowWHTOrSY62PcKjWyTGAGjut0ibbLlm`, crossorigin anonymous, synchronous script, no async/defer.
- Existing Site Fixer embed `5a43ae83-690e-4933-971d-4837db00b2f3`: native revision25→26 for the scoped prepend, then native Custom Code Apply→27 to complete the release. Final10742characters; original HTML retained exactly and all embed settings preserved. No site-wide Editor publish. Final visual QC then found an unvisited privacy-link contrast conflict with older story CSS. One scoped rule and exact-rule regression fixed it; immutable asset above released through API revision28 and native Apply revision29, preserving settings and10742characters.

## Verification

- Twelve focused mocked Chromium regressions passed, including consent, pending-only acceptance, timing, frequency, collisions, both actual legacy load orders and current-renderer responsive/SPA behavior. No test submitted to Wix.
- Independent actual Chrome checks passed at320/390/430/1366 on a fresh public document. One correct email CTA,44px phone row after the existing60px shell, preserved logo/Shop/Menu and no overflow. Desktop has the sole link in the actual current navigation.
- Ordinary canonical homepage runtime verified at15:11:02.908Z; ordinary magazine runtime/one warm card/unchecked consent at15:12:14.233Z; ordinary canonical representative article runtime/one warm article-end card/unchecked consent at15:14:12.946Z. Earlier old cached responses are retained in the private receipt; no claim that the first API acceptance alone verified delivery. Final privacy correction verified on the ordinary canonical article at15:25:19.078Z: exact final asset, ink privacy link, one card and unchecked consent.
- Final static security analysis ran68 JavaScript rules on production source and deployed bundle: zero findings,100% parse coverage.
- HawkScan CLI6.5.0 and current skills passed preflight checks, but the existing account's app lookup returned HTTP402 Payment Required. No DAST scan started, no scan ID or pass claimed, and no billing/credentials/account changes were made. Account entitlement remains the precise prerequisite for DAST.

## Separate native app change

Spaces native publication revision27 at14:50:30.201Z adds a free-email explanation and large button at the top of the existing unrestricted Membership screen. The existing hosted form is the destination. Native normalized comparison found zero existing-section or screen-permission changes; existing sign-in, renewal help and paid access remain. No email or push was sent for testing.

Physical-phone signup/login/renewal/push delivery and real confirmation-email delivery remain unproven. The production55-second invitation default has deterministic browser coverage; no existing visitor preferences were cleared to force a live impression. Browser events, a form acceptance and labels do not prove confirmed subscription.

## Rollback and operational record

Restore only the saved pre-bootstrap HTML using the then-current revision and an ownership/fingerprint check. Then cold-reload and verify the old runtime. Private before/after snapshots, native app receipt, aggregate audience audit and public QC remain outside GitHub. The controller work record is [issue34](https://github.com/Presidente49/gatorbait-media-redesign/issues/34). No customer records or private manuscript copy are included in this branch.
