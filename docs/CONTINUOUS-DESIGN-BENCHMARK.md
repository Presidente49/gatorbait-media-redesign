# GatorBait Continuous Design Benchmark

Updated: 2026-09-18

## Mandate

GatorBait design is a living system. The controller must keep learning from the strongest current sports/news products, measure GatorBait against them, and adopt only the patterns that improve the reader experience without erasing the GatorBait identity or adding fragile dependencies.

This applies to every public surface:

- Homepage / Front Page
- Article pages
- GatorBait Magazine
- GatorBait TV and show pages
- Email / Story Alert / Magazine newsletter
- Membership and conversion pages
- Store handoff
- Contact, policies and footer
- Mobile behavior across all of the above

## Current competitor set

Review these first because they compete directly for Florida Gators attention:

1. Gators Online / On3 — https://www.on3.com/teams/florida-gators/
2. GatorCountry — https://www.gatorcountry.com/
3. FloridaGators.com — https://floridagators.com/
4. Swamp247 / 247Sports when accessible
5. One or two best-in-class national sports/news products when a specific pattern needs a broader reference.

Competitors are references, not templates. Never clone a page wholesale.

## What the Sept. 18 benchmark shows

### FloridaGators.com
Useful patterns:
- one clear lead story plus a short latest-news list;
- schedule/results utility close to editorial content;
- strong video and gallery destinations;
- obvious sport-specific continuation paths.

GatorBait opportunity:
- preserve the utility and media clarity while staying much leaner and more editorial.

### Gators Online / On3
Useful patterns:
- persistent quick links;
- schedule and recruiting utility;
- current news beside conversion/membership;
- high-interest community/trending content remains easy to find.

GatorBait opportunity:
- keep high-performing stories visible without letting subscription chrome overwhelm journalism.

### GatorCountry
Useful patterns:
- clear reverse-chronological latest stream;
- repeatable feature boxes;
- strong sport/category sections;
- multimedia separated from the main news list.

GatorBait opportunity:
- use the same clarity with stronger art direction and less repetitive list density.

## GatorBait design principles

1. Editorial first. One obvious lead, a disciplined latest stream, then useful continuation modules.
2. Performance aware. High-performing current stories remain visible even when chronology would otherwise push them down.
3. Mobile first. 390 px is the daily design viewport; 430 px and 320 px are secondary checks.
4. Art is part of publishing. Major stories do not ship with blank, weak, duplicate or badly cropped art.
5. No text-bearing image may be blindly center-cropped. If text is embedded in artwork, either create a mobile-safe crop/variant, reserve a safe zone that survives the module crop, or display the full image with a contained treatment. Verify the actual mobile render before calling it complete.
6. Utility without clutter. Schedule, roster, TV, recruiting, membership and shop links should be useful modules, not dashboard chrome.
7. Fast first paint. No opacity boot, competing themes, heavy font imports, permanent observers or short polling.
8. Owned destination first. YouTube, social and third-party shops support GatorBait; the website remains the editorial home.
9. Borrow patterns, not stacks. A competitor feature does not justify a frontend migration, new framework or dependency.
10. One GatorBait visual language. Navy, Florida orange, warm paper/white, strong editorial serif headlines, clean system sans utility copy.

## Page scorecard

Before and after a meaningful design change, check each affected page against:

- 0–2: first-screen hierarchy
- 0–2: mobile readability
- 0–2: image/art treatment
- 0–2: page speed / layout stability
- 0–2: story/content discovery
- 0–2: video/media discovery where relevant
- 0–2: conversion clarity without clutter
- 0–2: accessibility / tap targets / contrast
- 0–2: GatorBait identity
- 0–2: continuation path to another owned GatorBait destination

Do not chase a higher score with decorative complexity.

## Learning loop

1. Observe the live GatorBait page, current metrics and the competitor set.
2. Identify one proven pattern that solves a verified GatorBait problem.
3. Prototype the smallest reversible change.
4. Verify desktop plus 390/430 mobile.
5. Measure engagement, layout stability and reader flow where data exists.
6. Record the successful pattern in the relevant standard/runbook.
7. Reuse it across page types only after the reference implementation is stable.

Repeated owner corrections must become written rules after the second recurrence.

## Performance-driven Front Page rule

Editorial home and Front Page visibility are related but not identical.

- Every story still has exactly one primary editorial home: Front Page or Magazine.
- Separately, the controller maintains a rolling performance-promotion list.
- The top three stories by Wix Blog views inside a seven-day freshness window must remain visible on the Front Page in a Trending Now module.
- A Magazine story may appear in Trending Now without changing its primary Magazine home.
- The same story must not appear twice on the same Front Page render.
- Performance promotion never overrides urgent breaking news for the main lead automatically.

The performance list is refreshed during editorial-routing runs.

## Recurring show state rule

"LIVE NOW" is a temporary distribution state, not a permanent content identity.

For recurring shows such as Best Friday in Football, The Buddy Martin Show and Florida Gator Lowdown:

- while live: a live label/button is allowed;
- after the live window: normalize the title/deck to the evergreen show/date identity;
- preserve the same article URL unless there is a compelling SEO reason to change it;
- change CTA language from live to replay/watch;
- keep Front Page placement based on editorial relevance and performance, not a stale live label.

## Continuous review cadence

- Lightweight competitor scan: weekly.
- Full page-type benchmark: before a material redesign and at least monthly.
- Immediate benchmark: after a reader-visible failure involving crop, hierarchy, mobile overflow, first paint or navigation.

A review should produce a small number of testable improvements, not a redesign backlog for its own sake.
