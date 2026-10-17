# Reader support — staged September 29, 2026

Owner request: a sitewide Support GatorBait button, optional contributions, and an included year of annual membership above roughly $100. Design uses **$100 or more** as a proposed interpretation. Creative direction: **Keep the GatorBait flame alive.** A Buddy interview is being prepared separately; no invented quotes or exclusive-credit claims.

## Status

- Preview and a guarded header CTA module are built for review. No live Wix code, plans, enrollments, payment settings, customer charges or support tickets have been changed by this work.
- The design preview is `support/preview.html`; portable single-file version is `support/standalone.html`.
- `header-link.js` adds a link to existing desktop and mobile header owners. It is inert by default. It does not replace menus, create a competing header, load a payment SDK, make network calls, collect data or open a checkout.
- Do not activate the module or publish a checkout before the release gates below pass. A JS flag is a deployment guard, not evidence of provider approval.

## Preview validation

Isolated Chromium checks passed at 1440, 768, 390 and 320px: no horizontal overflow, functional menu/keyboard return, 44px header controls, amount thresholds, current-member note, disabled checkout and no external requests. The header module passed default-inert, off-origin rejection and duplicate-protection checks. Screenshots were visually reviewed. These checks do not verify live Wix behavior or payment/member fulfillment.

## Live evidence

- Shared desktop header `7fee4de6-1886-475e-a3f3-b9c68161c242`, revision **30**, enabled, **14,993 / 15,000 characters**. Exact snapshot: `header-before.json`. There is insufficient room for an appended CTA module in that payload; consolidate or use a bounded support-only module after review. Do not truncate existing code.
- All Access Annual `ae41ee7a-c4c2-4bc0-bb73-df1c242ec14a`, revision **8**, $99, YEAR 1, ON_PURCHASE, UNTIL_CANCELLED. It automatically renews. Do not assign it and describe it as a free nonrenewing year.
- Magazine Annual `4349d910-f017-4598-a8d3-1fc73ee6f991`, revision **7**, is a separate $49.99 recurring product. Do not substitute it by name alone.
- All Access Annual currently says purchases are final. This does not establish an approved refund policy for the new contribution offer.
- The connected Stripe receiving account and exact reward-offer eligibility have not been verified. The API discovery available here did not provide a documented merchant-account read for that purpose. Do not claim that installed Wix Pay Links or Pricing Plans verifies Stripe onboarding.

## Provider decision

Stripe's [restricted-business policy](https://stripe.com/legal/restricted-businesses), updated September 22, 2026, includes fundraising by businesses offering rewards for donations. Preserve the owner's actual contribution-plus-membership proposal and obtain confirmation for that exact model. Renaming it a tip is not a workaround. [Stripe tips/donations](https://support.stripe.com/questions/requirements-for-accepting-tips-or-donations) also distinguishes content-related tips and charitable-purpose donations.

[Wix donation guidance](https://support.wix.com/en/article/accepting-donation-payments) requires registered-charity status when using Wix Payments; an external provider's acceptance criteria still apply. A form's availability does not establish eligibility.

[Florida 496.404](https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0400-0499/0496/Sections/0496.404.html) has broad charitable-solicitation definitions. Present commercial reader support accurately. If charitable language is retained, resolve applicability with qualified advice; a tax disclaimer alone is not legal certification. [FTC free-offer guidance](https://www.ftc.gov/legal-library/browse/rules/guide-concerning-use-word-free-similar-representations) supports disclosing material included-benefit terms before payment.

## Nonrenewing membership fulfillment design

1. Confirm the legal receiving business identity, Stripe account and exact approved transaction model. Store approval reference privately; never commit financial credentials or customer records.
2. Create a dedicated private, non-buyable 12-month entitlement with the actual All Access benefits. Start and end dates are explicit; no recurring collection, trial or stored-card authorization. Read and map actual content access, not just plan marketing perks. [Wix one-time plans](https://support.wix.com/en/article/pricing-plans-creating-a-one-time-payment-plan), [free plans](https://support.wix.com/en/article/set-up-a-free-plan-on-your-wix-site), [offline sales](https://support.wix.com/en/article/pricing-plans-selling-plans-offline).
3. Resolve membership BEFORE payment for existing subscribers. Obtain an explicit customer choice/permission for any current renewal change. Never silently cancel, postpone or overlap an existing paid subscription. Existing comps/VIPs remain protected.
4. For new/lapsed readers, display the qualifying threshold, total, exact included access, term, start rule, refund policy, tax treatment and no-renewal terms. Collect account/email through native secure Wix/Stripe UI. Do not subscribe the payer to marketing merely because they paid.
5. Verify final successful Stripe settlement server-side, including currency, amount and receiving account. Use the payment ID as an idempotency key. Never grant access based only on a browser return URL, query-string amount, or front-end success message. Handle async payments and refunds according to the agreed policy.
6. Create the fixed-term Wix entitlement once, link it to the verified member, record transaction and entitlement IDs privately, and send an accurate business receipt/confirmation. Wix manual offline assignment may itself send a confirmation; deduplicate notifications. External Stripe payment alone does not fulfill membership.
7. Demonstrate below-threshold, qualifying $100, custom qualifying, duplicate webhook, failed/async payment, already-member and refund scenarios in a safe test environment. Do not perform a live charge to test without authorization.

## Header integration

Existing targets are `#gbm-site-header .sh-brand`, `#gbm-live .sh-header .sh-brand`, and `#gbm-mobile-shell`. Existing Join and Sign in paths remain available. Mobile link text is Support with full accessible name Support GatorBait. The staged module uses bounded startup retries and existing route events, with no permanent observer/polling. Configure only a verified HTTPS same-origin support destination; no proposed `/support` link is currently assumed to exist.

Before any deployment, reread issue #34 and current header/home/mobile owners. Preserve concurrent Magazine/homepage work. Validate current public desktop and phone-emulated pages with one support CTA per visible header, 44px hit targets, keyboard focus, working menu, no overflow and no fresh first-paint movement. Test representative homepage, article, Magazine, TV, account and pricing routes. The isolated preview is not proof of live Wix behavior.

## Release gates and rollback

- Written provider classification approval for this exact offer, or an owner-approved genuine change to the offer.
- Confirm $100-or-more threshold, business identity, final terms/refund treatment and actual included benefits.
- Receiving-account verification and tested fixed-term fulfillment/current-member handling.
- Published and verified support destination before any live header link.
- Current-revision shared-header and native-route QC, not only preview screenshots.

Rollback any eventual support-only module by disabling that module and verifying its CTA is absent. If an existing embed is modified, retain the immediately preceding response and restore only the owned change using a fresh revision. `header-before.json` is historical rev30 evidence, not permission to overwrite later revisions.

Coordination: [issue #34](https://github.com/Presidente49/gatorbait-media-redesign/issues/34). Design and research workers had no production mutation authority. This folder contains no payment credentials or customer data.
