# GatorBait Pricing Plans Inventory

**Date:** 2026-08-14

## Migration principle

Do not equate an old or archived Pricing Plans record with a safe-to-delete record. Active paid orders still reference both current and historical plan IDs. Preserve entitlement continuity while simplifying what new visitors can buy.

## Plan inventory summary

Wix Pricing Plans V3 returned **18 plan records**.

### Public, active, buyable plans

1. **MAGAZINE ANNUAL**
   - ID: `4349d910-f017-4598-a8d3-1fc73ee6f991`
   - $49.99/year
   - public, active, buyable
   - 7-day trial

2. **ALL ACCESS ANNUAL**
   - ID: `ae41ee7a-c4c2-4bc0-bb73-df1c242ec14a`
   - $99/year
   - public, active, buyable
   - primary plan
   - 7-day trial
   - current perk copy still references `The Buddy Martin Show — LIVE Mon-Thu 9PM ET`; this is a content-cleanup item and should be verified against the current show schedule before editing.

3. **MAGAZINE MONTHLY**
   - ID: `fb3b8e0e-6765-4b7d-9052-a9dd65c27460`
   - $4.99/month
   - public, active, buyable
   - 7-day trial

4. **ALL ACCESS MONTHLY**
   - ID: `fd37a730-da58-4f56-8c43-22fc3556a503`
   - $9.99/month
   - public, active, buyable
   - 7-day trial

### Private but buyable

5. **GATORBAIT GOLD**
   - ID: `af2c283a...` in the current Wix plan inventory
   - $199/year
   - private, active, buyable
   - created in 2026

### Historical/archived/private plan families

The remaining records include prior versions or promotions such as:

- GATORBAIT MAGAZINE variants
- old Magazine Annual records
- O&B Bloods
- O&B Friday Deal
- Mobile Subscriber
- Hurricane Special
- old GatorBait Annual
- GNK Members Deal
- duplicate All Access Annual records
- FREE
- old GATORBAIT GOLD
- Halfoff - QB Clubs

These should remain untouched until all live order references are mapped.

## Active paid orders

The Pricing Plans Orders API returned active, paid recurring customers under a mixture of current and historical plan IDs. This confirms:

- archived/private plans can still be part of a valid customer's entitlement history;
- plan deletion or aggressive label cleanup can break customer/account assumptions;
- the Studio migration must preserve Wix Pricing Plans and Members data rather than recreate subscriptions from scratch.

The operational CRM segment `GatorBait Paid Subscribers` currently contains 453 pricing-plan-associated contacts. Marketing consent remains separate; only paid contacts who are independently opted into marketing belong in the Active Email Audience.

## Legacy automation dependencies

Two old automations demonstrate why plan labels should not be used as the new entitlement architecture:

- `ALL ACCESS ANNUAL` automation `ba4e3990-3a01-4eeb-b1c8-b0a2e653a38d` family logic adds both annual and monthly labels for a single purchase.
- `MAGAZINE MONTHLY/ANNUAL` automation `dc606f45-2420-4407-b224-3dc114b8606c` family logic adds both monthly and annual labels for either purchase.

The actual Pricing Plans order/benefit state should be authoritative for entitlement. Historical contact labels are compatibility metadata until proven unnecessary.

## Target Studio strategy

Current content is mostly free, so the new site should not make paid plans the dominant homepage experience.

Near-term acquisition hierarchy:

1. free original reporting;
2. newsletter signup;
3. repeat audience/member relationship;
4. selective premium articles/features later;
5. paid plan presentation simplified when the premium-content strategy is ready.

Do not remove paid infrastructure. Make it quiet, accurate and ready for future premium content.
