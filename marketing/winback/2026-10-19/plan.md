# Returning subscribers and phone-magazine delivery

Owner direction Oct.19: implement a win-back plan, including a deep discount if necessary; include magazine cover and phone PDF for reading on the go. Later correction explicitly rejects the older BEATING TEXAS cover: use the newer artwork made overnight. That replacement has not been located. Do not send, schedule or silently substitute the rejected cover.

## Implemented

- Complete source review:1653 pricing-plan orders and1149 contacts in the current approved email pool. Recomputed historical online paid-order proof, current/paused/pending/draft or still-valid canceled access, suppression labels and current email subscription/deliverability.
- Six former paid readers qualify for the first pilot. All six overlap the current postgame cohort that received Chris's Oct.19 email. No same-day second blast. Nine-person historical former-paid label is stale as a send selector: the full-pool check excludes two hold matches and two undeliverable candidates; do not treat SUBSCRIBED alone as deliverability proof. Eight candidates remain after paid/access/hold checks; six pass email eligibility. No contact consent or existing labels were changed.
- One live coupon created with explicit owner discount authority: f42b78a5-869b-4869-81da-f50e6204cc73. Existing ALL ACCESS ANNUAL plan ae41ee7a-c4c2-4bc0-bb73-df1c242ec14a only;50% first paid billing cycle, one use per customer, six total redemptions, expiration2026-10-29T03:59:59Z (Oct.28 11:59p.m.ET). The private coupon code stays in Wix, not this public repository. No existing plan price, subscription, charge, comp or refund changed.
- Actual Wix price preview verifies a discounted cycle1 followed by full-price cycle2+, with the existing7-day free trial. Terms must state the initial charge, normal annual renewal, automatic renewal until canceled and trial cancellation timing. Never advertise a permanent half-price renewal.
- Media verified: current phone PDF HTTP200,2556951bytes,61pages,390×844pt, tagged/selectable and unencrypted. Permanent URL is in pdf-delivery.json. Real iPhone behavior still untested; Wix may save to Files.

## Release packets prepared next

1. Returning-reader email: specific subject,50% first-paid-year offer, private code, existing native annual signup link, exact trial/renewal terms, deadline, approved cover, free current magazine/PDF preview. Public magazine remains free; no purchase is required for the sample issue. Do not impersonate a writer.
2. Current-subscriber email: approved cover links to the magazine, separate Download Phone PDF button,61pages/2.4MB note, Files/offline instructions, visible attribution, Store/Subscribe/free-confirmed-signup footer, existing mailing address per owner's clarification. No discount to current members.

No Wix campaign for either packet has been created or scheduled. Creation code never ran: artwork lookup halted the release before drafts. The earlier Chris campaign is unrelated and already distributed; never resend it to announce these changes.

## Timing and gates

Known-history earliest capped pilot slot: Oct.21 around3:35p.m.ET; a separate member PDF release can follow at least24hours later if fresh counts still permit. These are proposed queue reservations, NOT scheduled sends. Re-read actual sends, scheduled campaigns, recipient opt-outs and access immediately before release. Both belong in the single controller queue; native blog alerts are already owner-authorized separately and must not be toggled off to satisfy a stale governor.

Before release: identify/view the correct new cover, source/credit/alt checks, ensure permanent Wix asset, build provider-rendered drafts, verify all links/trial/coupon/renewal terms and unsubscribe at390/430/1366/1920, fresh eligible recipient IDs with exact coverage, default sender readback, duplicate checks, then one native scheduled/send call per packet. Record campaign IDs and actual delivery; configured coupon and drafts are not recovered subscribers or revenue.

## Measurement and next phase

Track actual coupon redemption and paid order/transaction outcomes, cancellations, second-cycle retention and email complaints. Separate trial starts, paid starts and cash receipts. No claimed uplift or ROI exists yet. Keep active failed-payment recovery separate from lapsed-customer discounts; do not auto-charge or revoke legacy comps. Further audience expansion requires fresh historical payment proof, no current access, affirmative current consent, deliverability and no holds, not a raw failed-renewal count.

## Blocker and recovery

Newer magazine cover missing. Root checked live Wix cover/magazine/postgame matches and latest100 image uploads reaching Oct.10, repository assets and supplied paths. Muse independently checked19unique saved portraits,5worktrees and generated_images: only older magazine covers plus new social/basketball cards and two logos; no replacement magazine-cover file or Wix ID. Brenden was asked whether he meant Texas magazine or Through the Lens basketball artwork and shown the latter. Do not relabel it as a Texas magazine cover.

Rollback coupon: owner-authorized controller can deactivate this newly created offer if it cannot be used, after fresh read and documented coupon update; never rewrite unrelated1311 historical coupon records. The native create endpoint requires appliesToSubscriptions=true when discountedCycleCount is present despite an opposing documentation note; actual first/later cycle price preview is the deciding evidence.
