# Pricing Plans and Members Area

Money-adjacent. Plan pricing, cancellation, refunds and payment providers change only with Brenden's explicit approval.

## Plans

- Up to 75 active plans. Plans **can't be deleted**, only hidden/archived. Pricing strategy can't change while a plan has active subscriptions.
- Visibility (API Plans v3): `PUBLIC`, or `PRIVATE` (hidden from new buyers except via a direct link; existing buyers keep it). `buyable: false` = owner-assigned only.
- Free trials apply only to **recurring paid** plans (7/14/30/custom days). Card details are collected up front. The buyer gets a reminder email 3 days before the trial ends. No second trial on the same plan. Cancelling during the trial keeps access until the trial ends.
- Policy text: up to 3,000 characters, shown at checkout, with an optional required checkbox. Put the renewal, cancellation and refund terms here.
- Guest checkout (Settings → Pricing Plans Settings → Checkout) **doesn't work for plans with online content**. Readers must be members.
Sources: https://support.wix.com/en/article/creating-a-plan-in-pricing-plans , https://dev.wix.com/docs/api-reference/business-solutions/pricing-plans/plans-v3/create-plan.md , https://support.wix.com/en/article/pricing-plans-offering-your-clients-a-free-trial-period

## Cancellation and refunds

- Self-cancel needs the Members Area + **My Subscriptions** page + the plan's "Allow plan cancellation" toggle. Member path: log in → profile menu → My Subscriptions → More Actions → Cancel Subscription.
- **Cancelling never refunds.** A recurring plan runs to the end of the paid cycle ("Pending Cancellation", undoable), then Canceled. Refunds: Wix Payments via Payments → payment → Refund (processing fees aren't returned). Other providers refund on their own site.
Sources: https://support.wix.com/en/article/pricing-plans-allowing-clients-to-cancel-plans , https://support.wix.com/en/article/pricing-plans-managing-purchased-plans-in-the-wix-app

## Subscription statuses (access)

Active, Free Trial, Pending Cancellation = has access. Pending activation (future start), Suspended/Paused, Grace Period (failed payment), Canceled, Expired = no access, or access at risk. Paused plans shift future billing dates rather than refunding.
Sources: https://support.wix.com/en/article/pricing-plans-managing-purchased-plans-in-the-wix-app , https://support.wix.com/en/article/pricing-plans-temporarily-suspending-a-plan , https://support.wix.com/en/article/pricing-plans-viewing-and-managing-plans-that-clients-purchased

## Members Area

- Installs Account Settings / **My Account** plus pages added by apps (My Subscriptions, Notifications, etc.). Login bar sits in the header with logged-in and logged-out states.
- Our member routes: `/account/my-account` (account), `/account/my-subscriptions` style routes for plans. **Verify the live slugs** in the Editor's Pages & Menu before linking. Wix sets them per install.
- Signup/login/reset pages and popups are customizable with the **Member Authentication** app (Editor → Pages & Menu → Member Authentication). Signup & Login Settings control who can join and whether approval is needed.
- **Roles and badges:** create roles/badges in Site Members settings. Page access by role, badge or plan: Dashboard → **Site Member Access** → Set Access, or per page in Editor → page Settings → Permissions → Site Members → Specific members.
- Member status must be Approved for members-only pages (Approve Member API unblocks too).
Sources: https://support.wix.com/en/article/site-members-adding-and-setting-up-the-members-area , https://support.wix.com/en/article/site-members-managing-member-page-permissions , https://support.wix.com/en/article/site-members-creating-and-managing-member-badges , https://support.wix.com/en/article/wix-site-members-customizing-the-member-authentication-pages-and-popups , https://dev.wix.com/docs/api-reference/crm/members-contacts/members/member-management/members/approve-member

## Design

Plans page and member widgets: Editor Design panels. Plans checkout: not customizable, inherits the theme (site-design-fonts.md).
