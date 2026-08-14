# GatorBait DNS and Email Authentication Inventory

**Date:** 2026-08-14
**Domain:** `gatorbaitmedia.com`
**Production changes made during audit:** none

## Wix DNS authority

Wix's account-level Domain DNS API returned an active DNS zone for `gatorbaitmedia.com`.

### Current zone

| Type | Host | TTL | Value(s) | Classification |
|---|---|---:|---|---|
| A | `gatorbaitmedia.com` | 3600 | `185.230.63.107`, `185.230.63.186`, `185.230.63.171` | Wix web routing; preserve |
| MX | `gatorbaitmedia.com` | 3600 | `10 aspmx.l.google.com` | Google Workspace legacy MX; supported by Google when already working |
| NS | `gatorbaitmedia.com` | 86400 | `ns9.wixdns.net`, `ns8.wixdns.net` | Wix is authoritative DNS host |
| SOA | `gatorbaitmedia.com` | 3600 | `ns8.wixdns.net. support.wix.com. 2019072322 10800 3600 1209600 3600` | Wix DNS zone authority |
| TXT | `gatorbaitmedia.com` | 3600 | `v=spf1 include:_spf.google.com ~all` | Google Workspace SPF |
| TXT | `gatorbaitmedia.com` | 3600 | `google-site-verification=BTY4xoiIzXZ_zRXwxnBtojRR0kYRxOHs8SU1rQATLKk` | Legacy/current Google domain verification; purpose must be mapped before removal |
| CNAME | `_dmarc.gatorbaitmedia.com` | 3600 | `_dmarc.wixemails.com` | Wix-managed email authentication policy path |
| CNAME | `s1._domainkey.gatorbaitmedia.com` | 3600 | `s1._domainkey.gatorbaitmedia.com.s004.ascendbywix.com` | Wix email DKIM selector |
| CNAME | `s2._domainkey.gatorbaitmedia.com` | 3600 | `s2._domainkey.gatorbaitmedia.com.s004.ascendbywix.com` | Wix email DKIM selector |
| CNAME | `sel1._domainkey.gatorbaitmedia.com` | 3600 | `sel1._domainkey.gatorbaitmedia.com.s004.ascendbywix.com` | Wix email DKIM selector |
| CNAME | `sel2._domainkey.gatorbaitmedia.com` | 3600 | `sel2._domainkey.gatorbaitmedia.com.s004.ascendbywix.com` | Wix email DKIM selector |
| CNAME | `sg.gatorbaitmedia.com` | 3600 | `sg.gatorbaitmedia.com.s004.ascendbywix.com` | Wix email sending infrastructure |
| CNAME | `www.gatorbaitmedia.com` | 3600 | `cdn1.wixdns.net` | Wix web routing; preserve |
| CNAME | `en.gatorbaitmedia.com` | 3600 | `cdn1.wixdns.net` | legacy/localization route; investigate before removal |
| CNAME | `es.gatorbaitmedia.com` | 3600 | `cdn1.wixdns.net` | legacy/localization route; investigate before removal |

DNSSEC is currently disabled.

## Google Workspace MX interpretation

Google's current Workspace documentation recommends a single new MX destination, `smtp.google.com`, for new/current setup. Google also explicitly states that domains that began using Workspace before 2023 may still have legacy MX values beginning with `aspmx`, and that if email is working no change is required. Therefore `10 aspmx.l.google.com` is not, by itself, evidence that GatorBait's inbound mail is broken.

Do not change the MX record during the site migration unless Google Admin diagnostics or actual mail delivery testing shows a problem. Mail routing is business-critical and unrelated to the Wix Studio design cutover.

## Wix sender identities

### Sender Details

1. ID `93675fa4-2c51-44b4-b08c-97f036dd13aa`
   - From name: `Gator Bait Media – Florida Gators News`
   - Email: `brenden@gatorbaitmedia.com`
   - Default: **true**
   - Created 2023-10-23; updated 2026-03-06.

2. ID `991161cf-f6fa-4430-ac41-3d98774d9bf8`
   - From name: `GatorBait Media Team`
   - Email: `info@gatorbaitmedia.com`
   - Default: false
   - Created 2026-07-26.

### Sender Emails

Verified:
- `brenden@gatorbaitmedia.com` — sender email ID `e85d3b60-3cf8-42e9-97c8-65f03505e968`, verified **true**.
- `info@gatorbaitmedia.com` — sender email ID `8b064dec-d2f6-4ec1-b90c-318f3d5b5bc5`, verified **true**.

Unverified/stale candidates:
- `Brenden@gatotbaitmedia.com` — typo domain (`gatotbaitmedia.com`), verified false.
- `updates@gatorbaitmedia.com` — verified false.
- `buddymartinshow@gmail.com` — verified false.
- `gatorbaitmedia@gmail.com` — verified false.

Do not remove these until dependencies are checked, but the typo sender email is a clear legacy-cleanup candidate.

## Sending Domains API inconsistency

A correctly filtered Query Sending Domains request for `gatorbaitmedia.com` returned:

- HTTP 428
- application error `SENDER_DETAILS_DO_NOT_EXIST`
- description `cannot access requested sending domain`

This contradicts the verified sender state above: sender details exist and the relevant sender emails are verified. The DNS zone also already contains Wix/Ascend DKIM, DMARC and sending CNAMEs.

**Migration decision:** do not create duplicate sender identities or rewrite DNS simply to satisfy the new Sending Domains API. Treat this as a legacy Wix/Ascend-to-new-Sending-Domains linkage inconsistency until Wix exposes a supported repair or the dashboard shows the domain as unauthenticated.

## Email Marketing account

Wix Email Marketing account details:

- Status: `ACTIVE`
- Package: `Ascend_Unlimited`
- Group: `AscendPro`
- Billing cycle: yearly
- Monthly email quota: **1,000,000**
- Max campaign audience: **1,000,000**
- Multiple senders: enabled
- Wix branding removal: enabled
- Scheduling: enabled
- Current Wix sender rank: **BAD**

The BAD rank is not caused by insufficient quota. Recovery should prioritize clean consent, engaged targeting, removal of stale/unsafe automations, and consistent sender behavior.

## Safety conclusions

1. Do **not** change web DNS for the Studio rebuild at this stage.
2. Do **not** change Google Workspace MX solely because it uses a supported legacy value.
3. Do **not** create duplicate sender details as a workaround for the Sending Domains API contradiction.
4. Preserve the verified `brenden@gatorbaitmedia.com` default sender.
5. Continue sender-reputation recovery through list hygiene and automation cleanup.
6. Re-check Wix dashboard sending-domain/authentication UI during the Studio migration; the API state alone is not internally consistent on this legacy account.
