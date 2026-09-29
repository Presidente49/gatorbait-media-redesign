# Email hygiene and sender policy — 2026-09-23

> Historical baseline. For current audience handling, read the September 29 addendum below and live issue #34 before acting.

## Verified changes
Three currently BOUNCED addresses were set UNSUBSCRIBED, preserving deliverability flags and all CRM/member/order records. Bulk results: 3 successes, 0 failures. No recipients were resubscribed. No test blast.

The unfiltered subscription query reported only 50 total records; do not treat it as proof of full CRM coverage. Cross-checked all eight sent campaigns September 14–22: 80 bounce events, 24 unique nondeleted addresses; each campaign returned all bounce recipients without a next cursor. Current states among those 24 before cleanup: 16 VALID, 3 NOT_SET, 4 INACTIVE, 1 BOUNCED. Suppressed the 1 BOUNCED in addition to 2 from the initial query. Preserved all others pending better evidence; historical bounce alone does not establish permanent invalidity. APIs do not distinguish hard vs soft in this report.

## Production sender
Story Alert automation 5006baf5-fbbf-440c-a012-a09bdbd95fc9 revision14 remains ACTIVE; explicit senderDetailsId e789a341-dc7d-4250-9c82-f1f0539b8927 = Buddy Martin | GatorBait Magazine, buddymartinshow@gmail.com, per owner request. sendToUnsubscribed=false, transactional=false. Duplicate 824714d4-7e31-4b1d-95b2-ccec04d788af remains INACTIVE revision20. Site default was not changed.

Wix replaces public-domain sender addresses with its authenticated sending address; a saved Gmail identity is not proof of Gmail SMTP delivery or improved inbox placement. Reference: https://support.wix.com/en/article/email-marketing-understanding-domains-to-send-your-campaigns

## Account health and unresolved check
ACTIVE Ascend_Unlimited account, opens tracking enabled, 13,590 emails used of 1,000,000 quota for Sept9–Oct9. Internal rank BAD; no explanation supplied. Do not equate this unexplained field with a confirmed blacklist.
Sending-domain query for gatorbaitmedia.com failed 428 SENDER_DETAILS_DO_NOT_EXIST/cannot access requested sending domain. Authentication is UNVERIFIED by this task, not proven broken. No DNS change.

## Rules for future sends
- Keep a consistent recognizable sender and the verified custom Story Alert. No duplicate generic alerts.
- Specific story subject, useful excerpt, one primary article CTA, responsive template and genuine images.
- Honor opt-outs and current bounce/complaint flags. Never re-import suppressed emails as subscribed.
- Preserve customer/member/order history; no wholesale contact deletion for historical bounces.
- Use recent clicks and deliveries to form engaged campaign audiences. No bulk resend to non-openers solely because tracking reports no open.
- Inspect bounce and complaint outcomes after sends. No full-list reactivation or deliverability claim based on sender address alone.
- Compare like audiences and time windows; recent campaign performance is not an A/B test of Gmail vs domain.
- Keep the native unsubscribe footer and avoid manual HTML changes that remove compliance controls.

## Current operating addendum — 2026-09-29

**The September 23 sections above are historical evidence, not current automation instructions.** Do not activate a sender from this document. Read live Wix and issue #34; both automatic story senders were subsequently disabled. This addendum changes audience hygiene/classification only, not send authority, billing, membership access, consent, or the send governor.

### Reconciled email cohorts

Owner authorized list cleaning and simplification of legacy subscription labels. Audited all 2,583 CRM contacts and all 1,644 pricing-plan orders. The approved canonical email pool remains bounded to 1,136 contacts, not all contacts, all members, or all paying customers. These are **email-cohort counts**, not financial subscriber totals.

| Role | Stable label key | Tag | Verified count |
| --- | --- | --- | ---: |
| Email-eligible reference pool; not permission to send all | custom.gatorbait-active-email-audience | oHon1 | 1,136 |
| Paid email readers | custom.gatorbait-paid-subscribers | FiVde | 291 |
| Free email readers | custom.gatorbait-nonpaid-email-subscribers-R6Ye0 | R6Ye0 | 781 |
| Former paid email readers | custom.gatorbait-former-paid-subscribers-reengagement-5m4kd | 5m4kd | 9 |
| Active access, payment status unclear — review only | custom.review-active-access-payment-status-unclear-7yuom | 7yuom | 55 |

The four classifications partition the reference pool exactly: no overlaps, missing contacts, or contacts outside the reference pool. All 1,136 had current SUBSCRIBED consent, VALID or NOT_SET deliverability, and no Do Not Market label at verification. NOT_SET **deliverability** is distinct from NOT_SET **consent**, which is excluded. Recheck before every authorized campaign; a saved label is not continuing consent or send permission.

Current paid classification requires a positive-price paid order with current access. Preserve next-payment-date cancellation access until its verified end date. Other current access, pending/paused or ambiguous entitlement is review-only, not automatically free or former paid. Former paid requires historical paid-order evidence and no current access. Do not overwrite system/pricingPlans labels, actual orders, billing, member permissions or subscription consent. Retain historical enrollment labels as provenance, not audience selectors.

Old Good Emails and Clean Email List display names now start LEGACY and point to the canonical pool. September 28/29 send cohorts and engaged-reader lists start SNAPSHOT; do not reuse them without fresh checks. Do Not Market is EXCLUDE; inactive/re-opt-in lists are HOLD. Names changed, stable keys/tags preserved. No labels or customer records were deleted.

### Mandatory lookup and QC safeguards

- Use explicit email batches of **30 or fewer** for email-subscription queries. A request of 100 returned only 50 even with a larger requested limit; attempting offset paging did not resolve the filtered coverage problem.
- Verify every requested email has a returned subscription record. Individually recheck missing records; unresolved records mean UNKNOWN and halt classification changes for affected contacts. Never treat partial/missing API results as proof of absent consent.
- Keep membership/payment classification, marketing consent, deliverability and engagement as separate dimensions. Being paid does not imply opted in. A no-open record does not establish an invalid address.
- Exclude current BOUNCED, SPAM_COMPLAINT and INACTIVE deliverability, unsubscribed/pending/not-set consent, and Do Not Market. Never clear suppression or resubscribe as cleanup. Preserve customer and order records.
- A historical campaign bounce alone is not a confirmed hard bounce. The four September 29 bounced recipients still reported SUBSCRIBED/VALID; the available campaign report did not identify hard versus soft failures. Do not permanently suppress those four from that evidence alone.
- Before mutation, retain exact prior/next label membership privately and calculate a bounded diff. Use exact IDs, not broad cleanup filters. No customer emails or contact IDs in public GitHub.
- Verify both completed bulk-job outcomes AND independent contact membership. A completed job is not sufficient: the new review label initially failed to appear despite success; one bounded add-only repair was independently verified with 55/55 assignments and no failures.
- Update Label's current schema requires nested `{ label: { key, displayName } }`. The older top-level displayName example returned 400. Prefer schema over stale examples, and allow only one evidence-based contract correction.
- Do not enlarge the pool or combine paid/free/former/review lists merely because they are email-eligible. Preserve current owner-approved audience, rolling-24h/7-day governor, verified sender and unsubscribe/footer checks.

### September 29 recovery record

An incomplete subscription lookup was incorrectly interpreted as absent consent, removing audience labels from 659 contacts. This was disclosed and stopped. No contacts, memberships, billing, consent or email delivery were changed. A complete 30-email-batch audit returned 2,581 subscription records for 2,583 CRM addresses (two unresolved records were excluded). Current eligible records were reconciled, rather than blindly restoring obsolete flags; six recovery jobs completed without failures.

Independent post-recovery checks covered all 1,147 relevant email addresses with zero missing. The six repaired audience labels had no currently ineligible records. Subsequent owner-authorized reclassification changed 67 contacts, renamed 13 custom label displays and created the review-only label. Final partition is 291 + 781 + 9 + 55 = 1,136, verified from fresh contact queries. No claim of an exact historical rollback.

### Delivery and ongoing maintenance

This morning's existing campaign `0c20bbab-0cf1-44df-adec-c20822f32035` was owner-authorized elsewhere and distributed September 29 at 07:45:45 ET. Latest verified snapshot: 451 delivered, 202 unique opens, 48 unique clicks, 4 bounces, 0 complaints; total mailsSent 456. The SENT-recipient endpoint returned 455 records, so do not silently reconcile that reporting discrepancy. Account ACTIVE, internal rank BAD. A green builder/quality badge is not exposed by the checked API and has not been visually verified; no reputation-recovery claim.

Existing Newsletter Release Check must reread these cohorts and the morning send receipt before considering any future release. Its timing, send authority and audience cap are not expanded by this cleanup. No new cleanup scheduler was created. CURRENT-STATE records Claude monthly cleanup trigger `trig_01DACQgK3zEXNwpaaVSExWwD`; it was not callable from this session and is not independently verified or updated. Route its policy refresh through existing issue #34, not a duplicate scheduler.

Official guidance:
- https://support.wix.com/en/article/why-some-email-campaigns-get-bounced
- https://support.wix.com/en/article/email-marketing-adding-recipients-to-your-campaign
- https://support.wix.com/en/article/improving-your-email-sender-reputation

## Owner-designated legacy Comps/VIPs — 2026-09-29 09:33 ET

Brenden explicitly directed placing the 53 legacy offline/manual recurring accounts in a separate Comps/VIPs group. This is owner designation for operational handling, not independent proof of every historic comp rationale or VIP relationship.

- Label: GatorBait - Legacy Comps and VIPs (owner designated)
- Stable key: custom.gatorbait-legacy-comps-and-vips-owner-designated-D2VK9
- Tag: D2VK9
- Cohort: 53 existing contacts, 50 annual and 3 monthly legacy plans; no new entitlement or pricing plan.
- The earlier review-only group 7yuom now contains only 2 online-payment exceptions (pending first cycle and failed payment), NOT comps.
- Current email-pool partition supersedes the earlier four-way split: paid 291 + free 781 + former-paid 9 + legacy comps 53 + online-payment review 2 = 1,136. Comp classification does not imply email consent or permission to send.
- Do not undo this owner designation simply because manual orders remain UNPAID. Do not mark orders paid, bill/back-bill, cancel, revoke access, change renewal settings, or initiate dunning based on that flag. No comp expiry/reason/approver other than this owner direction is known. Record future reasons only from actual evidence.

Read-only first-pass audit: 53 distinct emails, all 53 linked to approved member accounts; no duplicate emails within the cohort or matching other CRM primary emails, no login-email mismatches, and no multiple current legacy orders per contact. Email subscriptions: 52 SUBSCRIBED/VALID, 1 SUBSCRIBED/NOT_SET deliverability; zero Do Not Market labels. Twenty contacts have no first/last name in the CRM name field. One still carries a legacy re-opt-in-candidates HOLD; it was not cleared. Five lack a recorded login; 7 have a login within30 days,17 within90. Lack of login, a missing name, or age of an account is NOT fraud evidence. No fraud/security certification claimed; no external email-validation uploads or private subscriber data published.

Next cleanup is targeted record review: establish missing names from verified first-party records, resolve the historical re-opt-in hold before any intended marketing to that contact, check unrated deliverability without test blasts, and document known comp reasons/sponsor/optional review dates. Never auto-expire or remove a comp merely for inactivity. Existing monthly cleanup must preserve this designation and all consent/access boundaries; no duplicate scheduler was created.
