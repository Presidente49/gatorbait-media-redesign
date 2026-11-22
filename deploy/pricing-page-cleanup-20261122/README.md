# Pricing plans page cleanup, Nov. 22, 2026

Owner, Nov. 22: the bottom of the pricing plans page "seems really messy" and the free plan is confusing. Presentation only.
No price, plan, trial length, coupon or plan visibility was changed.

## What changed (live)

- Embed `78528a4b-6bf4-4642-9a76-5c05226a270f` "GBM - Pricing Terms Note v1", revision 5 to 7:
  - The two overlapping text blocks under the plans ("Support independent Gator coverage" and "How billing works") are now one
    "How billing works" box. It states the terms for all four paid plans; before, it named only All Access.
  - The four paid plans share one button label, "Start free trial" (All Access said "Try for free", Magazine "Start Free Trial").
  - The $0 plan's button reads "Sign up free" instead of Wix's default "Buy Now".
  - More space above the billing box on phones.
- Embed `74c4487f-eb9e-4b6d-a686-37a24852823a` "GBM - Renewal clarity + membership page phone fix", revision 4 to 5:
  - No "Renew this plan" button under the $0 plan.
  - The $0 plan's card shows its own description.

`pairs.json` holds every replaced string as `[before, after]`, with the lengths and hashes. Each matched exactly once.

## Rollback

For each embed, read the current revision, apply the pairs in reverse (`after` to `before`), and PATCH with category ESSENTIAL.

## Found, not changed (owner decisions)

- "Free Reader Access" ($0, public, added Nov. 16) has no orders.
- Trials since Aug. 22 (online orders with a 7-day trial): 54 checkouts opened; 26 are paying, 5 are in the trial, 5 left without
  paying, 18 are unfinished checkouts or unpaid.
- The page's renewal card offers code RENEW10 (10% off, active through Nov. 30) while the Nov. 19 email offers RENEW49.
- `/pricing-plans` and the blog list use Wix's 320 px phone layout, scaled up about 1.22 times on a 390 px phone. The home page,
  story pages and the Magazine render at the phone's real width, which is why they look "zoomed out" by comparison.
