# Email hygiene and sender policy — 2026-09-23

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
