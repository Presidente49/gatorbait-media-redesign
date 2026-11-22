# Cyber Weekend offer (set up Nov. 21, 2026, runs Nov. 27-30)

Owner direction: Brenden, Nov. 21: "You make the decision on the $49 cyber weekend and if you think it's good, then go for it. If not, change it."

## Decision

**$49 for the first year of All Access Annual, then the regular $99 a year.** The draft that came to the copy desk promised $49 at every renewal with code GATOR49. That was changed.

Numbers behind it (Wix, Nov. 21): 567 active memberships. 430 annual members pay $99 a year (297 on ALL ACCESS ANNUAL, 133 on the older GATORBAIT ANNUAL). A public $49-forever price undercuts all of them and gives up $50 a year, every year, on each new member. A first-year price keeps the half-off hook and matches RENEW49, the lapsed-member offer already running through Nov. 30 (3 uses so far).

## What is live

- **Coupon `CYBER49`** (id `a213b356-e405-4f26-ae08-fdb9074761bd`): $50 off ALL ACCESS ANNUAL (plan `ae41ee7a-c4c2-4bc0-bb73-df1c242ec14a`), first billing cycle only (`discountedCycleCount: 1`), one use per customer, 500 uses total, valid 12 a.m. ET Friday, Nov. 27 through 11:59 p.m. ET Monday, Nov. 30. It cannot be used before then.
- The same settings were checked on RENEW49 with Wix's price preview: cycle 1 is $49, cycle 2 onward is $99, and the plan's seven-day free trial still applies.
- **Story** draft `14c1a123-8b77-481b-83c1-28b68eec57d5`, "Cyber Weekend: GatorBait All Access is $49 for your first year", GatorBait Staff, **scheduled for Friday, Nov. 27, 8 a.m. ET** (13:00 UTC). Text: [`story.txt`](story.txt). Cover `d3cfa5_855dd60738654761930f7c15196fb74e` (Chris Spears, Florida-Vanderbilt, Nov. 21; not used as a cover before), alt text carries the credit and names no one.
- When the story publishes, the normal new-post automation `e4ff0da9` sends it to the email list and the app, as it does for every new post. Nothing was switched on or off.
- `GATOR49` (the $49-at-every-renewal coupon) stays disabled.

## To pull or change it before Friday

- Unschedule the story: PATCH the draft with `action: "UPDATE_CANCEL_SCHEDULE"`.
- Stop the code: PATCH coupon `a213b356` with `active: false`, or delete it.

## Not done

No sitewide banner and no pricing-page change. The membership page still shows $99 with the free trial; the code is entered at checkout.
