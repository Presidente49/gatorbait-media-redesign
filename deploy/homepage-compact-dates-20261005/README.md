# Compact homepage cards — October 5, 2026

Owner requested removal of dates on live thumbnail article cards so headlines and writer credits fit more cleanly alongside images.

The two compact story lists (Top stories and Latest) now render the actual writer without the date/relative age line. Lead and feature dates remain. Source article dates, chronology, photos/credits, links, show archive and playlist are unchanged. No CSS, Wix article, schema or CMS mutation.

Build: 259c28ef. Prior live build: 7020f576. Source/build parity, JavaScript syntax and whitespace checks passed.

Rollback: restore sports-live/current.json commit to af591b211765e18f5590989473a6bfd50ae0c896. Existing Wix loader fallback remains unchanged. Runtime verification will be recorded after release.

Pre-release same-bundle browser fixture: 320/390/430/1366 frame widths (305/375/415/1351 content widths with scrollbars), zero horizontal overflow; six Top story bylines preserved, eight Latest cards, no Latest time elements, lead date retained. Desktop card spacing visually reviewed.

Live verification: release 1a157fbd24dc029f5eb0654cfd378547bcabab1f, pointer update c9aa8b7. Public browser confirms build 259c28ef, six actual writer bylines in Top stories, eight Latest cards with zero time elements and retained lead date. Independent real-browser run https://github.com/Presidente49/gatorbait-media-redesign/actions/runs/37258354936 passed 320/390/430/1366: HTTP 200, matching build, no page errors, no horizontal overflow. Phone 390 and desktop screenshots visually reviewed. Evidence is included here.
