# GatorBait Studio Migration Preservation Matrix

Status: DESIGN / REHEARSAL ONLY
Production publish: NOT AUTHORIZED

## Preferred migration path

Use a Wix Studio branch of the existing GatorBait Wix Editor site when available.

Reason:
- same site/dashboard;
- most business data and apps are shared;
- live Editor branch remains published while Studio is built;
- domain stays on the same Wix site;
- lower risk to members, contacts, subscriptions and business data than creating an unrelated duplicate site.

## Do not confuse a site duplicate with a migration

A duplicated Wix site is a separate site and is not a safe membership/data migration mechanism.

Use a duplicate only as a visual/reference archive before the final Studio-branch cutover.

## Inventory table

| Surface | Live count/state | Studio branch state | Shared? | Manual setup needed? | Cutover blocker? | Verified |
|---|---|---|---|---|---|---|
| Site members | TBD live read | TBD | expected shared via site dashboard | verify Members Area UI | YES | NO |
| Contacts | TBD live read | TBD | expected shared | verify labels/consent | YES | NO |
| Email subscribers/consent | TBD live read | TBD | data shared, UI/automation verify | verify forms + labels | YES | NO |
| Pricing Plans | TBD live read | TBD | expected shared | verify pages/permissions | YES | NO |
| Paid orders | TBD live read | TBD | expected shared | verify billing/account surfaces | YES | NO |
| Wix Blog posts | TBD live read | TBD | app/data expected shared | add/configure Blog on branch | YES | NO |
| Blog categories/tags/authors | TBD | TBD | verify | verify templates | YES | NO |
| Store/eCommerce | TBD | TBD | expected shared | verify store app/pages | YES | NO |
| Forms | TBD | TBD | mixed | old-form submissions require special audit | YES | NO |
| Email automations | TBD | TBD | verify | test triggers/actions | YES | NO |
| GA4 | TBD | TBD | verify | verify branch events after publish | YES | NO |
| Search Console | current domain | same domain | domain-level | verify sitemap/indexing | YES | NO |
| AdSense | current publisher | same publisher | verify | preserve ads.txt/script | YES | NO |
| Domain | gatorbaitmedia.com | same site | yes at publish | no transfer if same branch architecture | YES | NO |
| URL slugs | inventory required | match | manual validation | preserve by default | YES | NO |
| Redirects | inventory required | match | verify | copy/retain as required | YES | NO |
| SEO titles/meta | inventory required | align | branch content specific | manual QA | YES | NO |
| Structured data | inventory required | align | branch/page specific | manual QA | YES | NO |
| Podcast/RSS | TBD | TBD | external | embed/link validation | NO | NO |
| YouTube/GatorBait TV | TBD | TBD | external | embed validation | NO | NO |
| SoundCloud | TBD | TBD | external | validate old feed/account | NO | NO |
| Apple Podcasts | TBD | TBD | external | claim/validate existing show | NO | NO |

## Cutover veto conditions

Do not publish Studio branch if any of these are unknown or broken:
- member login;
- member count/data access;
- paid-plan entitlement;
- billing/cancellation;
- email consent/suppression;
- blog article URLs;
- critical redirects;
- domain/SSL;
- analytics;
- payments;
- sitemap/indexability;
- required apps;
- mobile navigation.

## SEO route preservation rule

Default = preserve every established article and high-value page URL.

Redirect only when:
- a page is intentionally consolidated;
- redirect destination is semantically equivalent;
- internal links are updated;
- canonical handling is tested.

Never bulk-change article slugs for aesthetics.
