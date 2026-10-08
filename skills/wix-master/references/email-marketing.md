# Wix Email Marketing (Ascend)

Current context (2026-09-28): the account was suspended and reinstated with sender rank **BAD**. Every send is owner-approved. For identity and delivery evidence, `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` governs. This file adds the Wix rules.

## Account status (read-only API)

`GET` Account Details returns `status`:
- `ACTIVE`: can send.
- `WARNED`: owner must accept the terms of use in the dashboard.
- `SUSPENDED`: owner must complete a compliance questionnaire.
- `SUSPENDED_AUTOLIFT`: suspended, may auto-reinstate after the questionnaire.
- `BANNED`: a more rigorous questionnaire.

"There is no public API for changing account status." The Campaign API only works when `ACTIVE`. Account Details is always readable and also returns quota (it resets monthly, even on yearly billing). Opens-tracking settings cover campaigns, automations and triggered emails.
Sources: https://dev.wix.com/docs/api-reference/business-management/marketing/emails/email-marketing/account-details/introduction.md , https://dev.wix.com/docs/api-reference/business-management/marketing/emails/email-marketing/about-email-marketing

Observed: while `SUSPENDED_AUTOLIFT`, even the campaign **composer update** returned 401 "site owner action required" (INBOX-DESK-LOG on the fix branch). Drafts can't be edited either until it clears.

## How Wix escalates (from its help center)

Spam complaints and bounces lead to: emails filtered to spam → **reduced email allowance** (send in smaller groups) → **declined campaigns** until the list is cleaned → **deactivated account** for sustained problems. A "Your Email Marketing Account Was Deactivated" pop-up means "unusual or risky patterns", such as poor list quality, low engagement or high complaints. Wix samples new lists before full sends. Spam traps (recycled addresses) trigger restrictions. Violating the Terms can mean a block Wix "is unable to lift".
Sources: https://support.wix.com/en/article/email-campaigns-marked-as-spam , https://support.wix.com/en/article/email-marketing-campaigns-marked-as-spam , https://support.wix.com/en/article/why-some-email-campaigns-get-bounced , https://support.wix.com/en/article/email-marketing-terms-of-use

## List hygiene (what Wix says, plus ours)

- Send only to people who opted in. No purchased lists, no Facebook/LinkedIn-harvested contacts, no buyers or RSVPs who didn't subscribe.
- Remove contacts you haven't reached in 6–12 months. Clean at least twice a year. Send on a regular cadence.
- Wix auto-labels hard bounces "Bounced" and skips them. Never re-add a bounced contact without re-permission.
- Find complainers: Contacts → filter "Email deliverability status" = spam complaint.
- Ours: also sweep the owner's Gmail for postmaster/mailer-daemon NDRs (LESSONS #46). A valid address isn't consent (LESSONS #12).

## Double opt-in

New Wix Forms only: Editor → select form → **Edit Form** → Subscribe field → **Settings** → **Enable double opt-in**. Contacts stay "Subscription Pending" until they click Confirm. Wix explicitly recommends it to cut bounces.
Source: https://support.wix.com/en/article/wix-forms-enabling-double-opt-in-for-subscribers

## Sender domain authentication

- Without authentication, mail shows a Wix domain or uses a Wix From with our Reply-To. Authenticated domains can use `@gatorbaitmedia.com` in From.
- Flow: verify sender email → sender details → sending domain goes `INITIALIZING` → `NOT_AUTHENTICATED` (CNAME records provided, max 5) → add them at the DNS host → **Authenticate** → `AUTHENTICATED`. Domains on Wix nameservers get the records automatically.
- Gmail/Yahoo rules: a DMARC record is required for custom domains bought outside Wix. Wix's "CNAME 5" sets it. Re-authenticate if CNAME 5 is missing.
- Wix adds 5 DNS keys (3 sendgrid.net, 2 ascendbywix.com) once a campaign is sent. That's expected.
Sources: https://dev.wix.com/docs/api-reference/business-management/marketing/emails/sending-domains/introduction , https://dev.wix.com/docs/api-reference/business-management/marketing/emails/email-domain-setup-flow?apiView=SDK , https://support.wix.com/en/article/understanding-the-changes-to-gmail-and-yahoo-spam-prevention-policies , https://support.wix.com/en/article/improving-the-deliverability-of-your-campaign

## Content rules that help deliverability

Clear unsubscribe link, business name and physical address, no all-caps or spam words, roughly 80/20 text-to-image, no blacklisted links, consistent sender. Test emails come from a Wix test address and may land in spam. That isn't proof the live send is broken.
Sources: https://support.wix.com/en/article/email-campaigns-marked-as-spam , https://support.wix.com/en/article/email-marketing-campaigns-marked-as-spam

## Automations

Triggers include **"New blog post published"**, "Blog post new comment", form submitted, contact created, and plan purchased/canceled/expiring. Actions include send email and push. Automation emails share the monthly quota. The pre-installed blog-notification automation is only partly editable, so duplicate it to customize, and then **disable the original** or both fire.
Sources: https://support.wix.com/en/article/wix-blog-sending-new-post-notifications-to-members-and-site-subscribers , https://dev.wix.com/docs/develop-websites-sdk/code-your-site/developer-environments/integrations/about-zapier-integration.md

## Recovery plan after "rank BAD" (recommendation, not a Wix rule)

1. Keep one outbound owner. No sends until status is `ACTIVE` and Brenden approves.
2. First sends go to the most engaged confirmed subscribers only (opened in the last 60–90 days), in small batches, from the authenticated domain.
3. Watch bounce and complaint rates per send (keep complaints well under 0.1%). Expand only while clean.
4. Turn on double opt-in on every subscribe form. Re-audit NOT_SET/pending contacts, which aren't sendable.
5. Record each step with numbers in issue #34.
