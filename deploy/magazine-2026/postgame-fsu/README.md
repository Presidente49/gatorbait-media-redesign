# Florida at Florida State postgame edition, Nov. 27, 2026 (ESPN event 401856759)

A generator for the postgame Magazine edition, built before the game ended and tested on a finished game. It uses the existing
`layout: "postgame"` renderer and skin (`sports-live/src/magazine-postgame.{js,css}`), unchanged: this folder adds only data and
tooling. **Nothing here touches Wix, sends mail or posts.** The scripts write local files; Jarvis patches the Wix embed himself.

ESPN supplies everything that is a fact: teams, scores, rank, records, line score, scoring plays (AP style), team stats, box score,
leaders, the "by the numbers" tiles and the win-probability chart (ESPN's series is the **home** team's chance, so it is flipped
when Florida, abbreviation `FLA`, is the away team, as it is today). You write only the copy file.

## After the final whistle (from the repository root, on branch `jarvis/fsu-postgame-magazine-20261127`)

```sh
cp deploy/magazine-2026/postgame-fsu/copy.example.json deploy/magazine-2026/postgame-fsu/copy.json   # then fill it in (see below)
python3 deploy/magazine-2026/postgame-fsu/build_issue.py --copy deploy/magazine-2026/postgame-fsu/copy.json
MAG_VARIANT=fsu-postgame node sports-live/build-magazine.mjs
```

1. `build_issue.py` fetches ESPN (site.web.api.espn.com, then site.api.espn.com) and **stops unless the game is Final**. It lists
   every problem at once and writes nothing until the copy and the numbers pass. Read its log: the scoring plays, the flow marks,
   the tiles, the record line and every `WARNING`. It writes `sports-live/magazine-issue-fsu-postgame.json`.
   Options: `--file summary.json` (a saved ESPN summary, no network), `--out PATH`, `--dry-run`, `--allow-live` (test build of a
   game still in progress; the log and the issue say NOT FINAL, never commit it), `--event ID`.
2. `build-magazine.mjs` writes `sports-live/magazine-fsu-postgame.js` and `sports-live/magazine-fsu-postgame-frame.html`, and stops
   if the bundle is over the postgame cap (212 KB = 217,088 bytes). The Vanderbilt-sized test issue left about 1.9 KB of headroom
   (the generator prints an estimate); if you hit the cap, shorten copy (fewer rows, shorter deks and quotes).
3. QA: `node deploy/magazine-2026/postgame-fsu/qa.mjs /tmp/fsupg-qa`, then look at `pm-390-*.png` and `pm-1366-*.png` (cover, final,
   each section, the win-probability chart). It checks 320/390/430/1366/1920 for overflow, missing sections, one h1, links, anchors,
   contrast, tap targets, the chart's line and one dot per mark, the signup, route unmount/remount and console errors. Photos are
   stand-ins in the container. The shared signup's "Privacy policy" link reads as low contrast (1.00); it is the shared component and
   is reported separately, not as a failure.
4. Commit the copy file and the three generated files (the CDN serves committed bytes only), push, then pin the loader:
   `git add deploy/magazine-2026/postgame-fsu/copy.json sports-live/magazine-issue-fsu-postgame.json sports-live/magazine-fsu-postgame.js sports-live/magazine-fsu-postgame-frame.html`
5. `python3 deploy/magazine-2026/postgame-fsu/make-loader.py "$(git rev-parse HEAD)" > /tmp/fsu-postgame-loader.html` prints the embed
   HTML (about 2,800 characters; the cap is 15,000) and, on stderr, its length, two fingerprints, the bundle's size and sha256 at that
   commit, and the CDN check command. It is the live Magazine loader (dark splash, eight-second fallback, `rollback-rev173.html`
   shape) with only the two pins (marker comment and script URL), the bundle name and the edition tag changed, and it refuses a
   commit that does not contain the bundle (`--no-git-check` skips that).
6. CDN check: `curl -sS <url from step 5> | sha256sum` must equal the printed sha256. `cdn.jsdelivr.net` has answered 403 "Package
   size exceeded 50 MB" for fresh commits of this repository (Oct. 28, Nov. 3): if it does, re-run step 5 with
   `--host fastly.jsdelivr.net` (or `gcore.jsdelivr.net`, or `rawcdn.githack.com`) and check the bytes on that host.
7. Jarvis: GET embed `1dd74333-ee02-40da-9c93-cf8fd787c129` first and save its live HTML as the rollback; guarded in-place PATCH at the
   current revision, changing only `embedData.html`; no site publish. Verify live at 390 and 1366: `#gbm-magazine-page.pm[data-issue]`
   once, the h1 is the cover title, the score chip reads Final, the chart is present, no overflow.
   `node sports-live/qa-magazine-cover.mjs --release --variant fsu-postgame --commit <sha>` also works but expects the
   `cdn.jsdelivr.net` bundle URL, so it flags a different `--host`.

## The copy file (`copy.example.json` has every field with a placeholder and notes)

A `[REQUIRED ...]` or `[HEADLINE]`-style placeholder stops the build. A value that is exactly `[OPTIONAL ...]` is ignored, so leave
optional fields untouched. Keys starting with `_` are notes. Unknown top-level keys stop the build (typos).

| Required | Optional |
|---|---|
| `cover`: kicker, coverTitle (40), headline (200), dek (600), byline (80), cta (60), url (`/post/slug`), image {id, width, height, alt, credit} | `cover.teasers` (4 x 60), `cover.linesLabel`, `cover.lines` (6 x 80) |
| `next.title` (it also holds the email signup form, so keep it) | `next`: kicker, meta, note, pickem |
| | `columns`, `coverage` (each: kicker, title, dek, up to 12 rows; a section with no rows disappears from the page and the contents) |
| | `quotes` (up to 6, verbatim only; omit it and the section and its contents line disappear) |
| | `reference` (defaults to the four evergreen footer links), `credits` (default: built from the photo credits), `asOf` (added to the ESPN source line) |
| | `issue`, `final.extraMeta`, `sections.{damage,scoring,box,flow}` (heading text), `teamNames`, `scoreAbbr`, `set` (last resort, below) |

`set` overrides one finished value by dotted path (`"scoring.plays.3.play": "..."`); it is logged and then validated like everything
else. A number typed there is not from ESPN.

## Renderer gotchas the generator checks for you

- The renderer cuts text **silently** past its limits (listed in `copy.example.json`); the generator fails instead. Photo `alt` is cut
  at 200 characters **including** the credit, which is appended to the alt if missing. (The Vanderbilt issue has two alts of 213
  characters, so the credit at the end of those two is cut off in the alt attribute; the visible credit line is unaffected.)
- A photo needs the real pixel `width` and `height` (the frame's aspect ratio) and a Wix id `d3cfa5_` plus 32 hex characters; each id
  may be used once across cover, columns and coverage. Each article URL may appear once (one canonical URL, one primary home).
  Links must be site-relative or gatorbaitmedia.com. The cover photo is the only image the cover needs; columns and coverage rows
  may omit theirs.
- The win-probability chart is dropped whole if any point is outside 0 to 100 or there are fewer than 2; the generator also skips it
  with a warning when ESPN has under 20 points. Only Q1 to Q4 get quarter lines (overtime plays fall inside Q4; the line score gets
  an `OT` column).
- ESPN's record can lag the final: the generator cross-checks Florida's total record against the schedule and leaves the record line
  out (with a warning) rather than print a stale one. The conference record is shown only when the summary's record is current.
- House style is enforced: no em or en dashes, no curly quotes (straightened for you), no "Gator Country"; AP date and time forms
  are linted as warnings.
- Quotes: only what is read verbatim from a transcript or heard on a recording. None exist yet.

## Tested on

A saved ESPN summary of the finished Vanderbilt game (event 401856748, Florida 34, Vanderbilt 27, Florida home): the computed sections match the committed Vanderbilt issue
(line score, box rows, yards, win-probability series and quarter starts, final block, contents). Also with home/away swapped and the
series flipped (Florida away), and with the abbreviations swapped (Florida losing): the flow series equals Florida's perspective in
each case. The live game was built with `--allow-live` in the first quarter.
