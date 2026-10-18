# Postgame Edition: Florida 27, No. 7 Texas 24 (Oct. 17, 2026)

Built Oct. 18, 2026 (UTC) from the pregame print pipeline. **Nothing is live.** No Wix upload, page, embed or blog change, no email, no automation. PR only.

## Rebuild

```
node deploy/magazine-2026/postgame-texas/build-print.mjs /tmp/postgame.html
PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node tools/magazine-pdf/render-pdf.mjs /tmp/postgame.html print-stage/gatorbait-magazine-texas-postgame-2026-10-18-print-v1.pdf
```

`build-print.mjs` pulls the house CSS out of `tools/magazine-pdf/build-print.mjs` (US Letter, Barlow and Barlow Condensed, Gator blue and orange) so the two cannot drift, and adds only this issue's page layouts. All words and numbers are in `content.mjs`. The cover is `art/cover.html` rendered to `art/cover.jpg` (1102x1427 at 2x), same recipe as the pregame cover.

## Pages (13, US Letter)

1. Cover: Florida 27, Texas 24, final-score cover (final)
2-3. The game: desk story, pull quote, why it flipped (final)
4. Score by score: line score and scoring timeline (final)
5. Box score and leaders, ESPN (final)
6-8. Franz Beard column, from the published post c16d53be (final, with three ESPN conforming edits below)
9-10. Loren Meadows, Postgame Thoughts (published Wix post bba317f0, copy-desk fixes noted on the page)
11-13. Buddy Martin column, from the live published Wix post 6e802f31 (matches the site, Oct. 18)
11. Press conference: template page, reserved slots (placeholder)
12. What's next: Georgia (final for date, time, TV, site; Georgia record, ranking, line and injuries are placeholder slots)
13. Masthead and back page (final)

## Placeholder slots (nothing invented)

- Press conference transcripts: none exist yet. Slots are labeled "Reserved, pending transcript". Fill with verbatim transcript quotes only.
- Video links (Buddy Martin Show / GatorBait TV postgame): none supplied. Slot on page 11.
- Georgia record, ranking, line, injury report, preview links: pending. No ranking claim is printed.

## Sources and edits worth knowing

- ESPN event 401856724 for every score, stat, time and name spelling.
- Desk story (Wix post fc2ce412): used with ESPN times (Dippre TD at 0:18, Durkin FG at 10:40). Dropped its "return home next week" line (Georgia is a neutral site) and the Colin Simmons injury line (not in the ESPN list).
- Franz's column: the published text, with three ESPN conforming edits. The published post says the game was tied 17-17 at halftime; ESPN quarter scores put it at 17-10 at the half and tied at 17 in the third quarter. Changed to "cut the deficit to 17-10 with 18 seconds remaining", "scoring on the pass to Dippre" and "within a touchdown at the half". "Mosely" is "Mosley". The Sumrall quote that opens the press-conference passage had no closing quote mark; one was added. Sumrall's quotes are printed as Franz filed them, profanity included.
- Buddy's column, per Brenden: kept the opening through "Florida went into Austin..." and the first draft's remaining sections; dropped the second restart ("Frankly, I almost turned off my television" through "means everything, as well...") and the Georgia-Auburn and Indiana-Ohio State scores. Tennessee-Alabama 26-10 kept. Nothing else changed.
  - Buddy's text says "No. 1 Georgia" and "Jacksonville"; ESPN lists the Oct. 31 game at Mercedes-Benz Stadium (neutral) and this issue claims no Georgia ranking. Left in his voice; needs his or Jarvis's decision before print.
- Photo credit everywhere: "Photo courtesy UAA and Hannah White."

## Rollback

Nothing is live, so there is nothing to roll back. Close the PR or delete branch `agent/mag-postgame-20261018`. The only generated artifact is `print-stage/gatorbait-magazine-texas-postgame-2026-10-18-print-v1.pdf`.
