# RENEW49 last-chance reminder (scheduled Nov. 28, 2026)

Second and final email of the lapsed-member win-back. Brenden approved it Nov. 22 ("Yes").

- **Wix campaign:** `210604b6-f47e-4e76-afc7-0d0e929d7945`
- **Subject:** Last chance: come back to GatorBait for $49
- **Preheader:** Your $49 first-year offer ends Monday night, Nov. 30. Use code RENEW49 at checkout.
- **Send time:** Saturday, Nov. 28, 2026, 9:30 a.m. ET (`2026-11-28T14:30:00Z`)
- **Audience:** 60 contacts. The 66 people who got the Nov. 19 email (`26c2f060-6835-434d-aa8b-9692123dc5ba`), minus 6 who are paying members again. Nobody was dropped for an unsubscribe or a bounce. Sent by contact ID with `activeContactsOnly: true`; no list labels.
- **Offer:** code `RENEW49`, $50 off the first year of All Access Annual (7 days free, then $49, then $99 a year). Ends Monday, Nov. 30, 11:59 p.m. ET. Three uses at scheduling time.
- **Source:** `email.mjml` in this folder (built from the Nov. 19 email).

## Checked before scheduling

- Button goes to `/pricing-plans/subscribe` with `utm_campaign=renew49_reminder_20261128` (read out of Wix's click-tracking wrapper in the campaign preview).
- Code, deadline and the $99 renewal price are all in the rendered email; no unfilled placeholders.
- Coupon is active and does not expire before the send.

## State when recorded

Wix returned `distributionStatus: IN_DETECTION`, `sendingState: REVIEW`, `dateScheduled: 2026-11-28T14:30:00Z`. That is Wix's own pre-send review, not a confirmed `SCHEDULED` state. Confirm it shows as scheduled before Saturday.

## Not done

- No Spaces push. Spaces cannot target these 60 people, and a push to everyone would advertise a lapsed-member price to current members.
- No contact IDs or addresses are stored in this repo or on issue #34.

## Change or pull it

- Move it: `POST https://www.wixapis.com/email-marketing/v1/campaigns/210604b6-f47e-4e76-afc7-0d0e929d7945/reschedule` with `{ "sendAt": "<ISO time>" }`.
- Pull it: cancel the scheduled campaign in Wix (Email Marketing, Scheduled) before the send time.
