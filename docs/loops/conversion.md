# Loop: conversion

**Goal:** more readers become free newsletter subscribers, and more subscribers become All Access members, without spam, dark patterns or untested price moves.

**Owner:** Jarvis. Prices, trials, plan changes, subscriber sends and automation on/off are Brenden's call every time (START-HERE section 3).

**Scoreboard (weekly, Monday):** visits; free signups per 1,000 visits; trials started; paid orders; trial-to-paid rate. Read from Wix order records, not the dashboard's conversion widget, which disagreed with order records in September. Public places get counts only, never dollar figures or subscriber data.

## The funnel as of Oct. 15

| Step | State | Next fix |
|---|---|---|
| Home → free signup | About 6.5 phone screens down, 3 steps plus a confirm email | Second-screen signup (front-page loop item 4) |
| Home → All Access | Header "Try for free" means the paid trial; no price shown on the homepage | Orange "Join All Access" in the header; price and trial on the pitch block |
| `/plans-pricing` | Fixed Oct. 15: redirects to `/pricing-plans` (redirect `183d2253`) | — |
| `/pricing-plans` | Live: $9.99 a month, and a yearly plan whose plan record says $99 (a page scrape read $99.99; confirm on the page); 7-day trial; clips in narrow desktop windows | Codex, PR #285 |
| Paid story in a free list | No label | "All Access" badge (front-page loop item) |
| Bot registrations | About 80 suspicious contacts (task #1) | Keep them out of every audience; review signup protection |

## Competitor prices (Oct. 15, see `docs/research/2026-10-15/competitors.md`)

On3 charges $13.99 every 4 weeks or $119.99 a year, with a $47.99 first year. 247 lists about $139.99 a year and runs near-permanent 50–75% off. At list price, GatorBait is cheaper. Any promo or price test is Brenden's decision; bring one recommendation with the numbers.

## Each turn

1. **OBSERVE.** Pull last week's numbers from Wix order and contact records.
2. **SCOPE.** Pick the single biggest drop-off in the funnel table.
3. **PLAN.** Write a one-change hypothesis and the number it should move.
4. **ACT** only on routine, reversible surfaces (layout, links, labels, redirects). Anything priced or sent goes to Brenden with one recommendation.
5. **VERIFY** the next week. Keep the change, or roll it back.

## Turn log

- 2026-10-15 15:28Z · Jarvis · created redirect `/plans-pricing` → `/pricing-plans` (ID `183d2253-b391-4155-b2c0-8659ee5e50dd`) · verified public 200 on `/pricing-plans` · rollback: delete that redirect ID
