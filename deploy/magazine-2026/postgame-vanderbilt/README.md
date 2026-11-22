# Postgame edition, Nov. 21, 2026 (Florida 34, Vanderbilt 27)

Owner direction, Nov. 21 after the game: "Go" on switching the Magazine from the game day edition to a postgame edition built
around the game story and the photo gallery. No list email.

- **Layout:** the existing `layout: "postgame"` renderer and skin (`sports-live/src/magazine-postgame.{js,css}`), unchanged. This
  edition adds only data: `sports-live/magazine-issue-vanderbilt-postgame.json`.
- **Build:** `python3 deploy/magazine-2026/postgame-vanderbilt/build_issue.py` reads ESPN's summary for event 401856748 and
  writes the issue JSON. It stops unless the game is Final, the score is 34-27, the line score is 3-21-0-3 / 3-14-7-10 and the
  twelve scoring plays are the ones the copy describes. Then `MAG_VARIANT=vanderbilt-postgame node sports-live/build-magazine.mjs`
  writes `sports-live/magazine-vanderbilt-postgame.js` (208,841 bytes against the 212 KB postgame cap) and the QA frame.
- **Sections:** cover on the game story ("Baugh Control"), the final, the game package (Chris Spears' photo gallery, the halftime
  story, the quarter-by-quarter post), by the numbers, score by score, box score, the win-probability chart with six marks, and
  the Florida State game. No columns, video or PDF sections: nothing had been filed. Add them by adding `columns` or `watch` to the issue and
  rebuilding.
- **Quotes (third build, Nov. 21 evening):** "In their words" carries six passages from the UF/ASAP Sports transcripts that UF
  communications forwarded after the game (Jon Sumrall 172992, Myles Graham 172993, Aaron Philo 172994). Each was checked as an
  exact substring of its transcript when it was added to `QUOTES` in the build script; the transcripts are not in the repo.
  The reaction story built from the same transcripts joins the game package, and its Sumrall line replaces one cover teaser.
- **Photos:** all Chris Spears, GatorBait Media, sent by the owner on Nov. 21. Cover `d3cfa5_a0d70648...` (the close-up of No. 5
  celebrating with a teammate; owner, Nov. 21: "This great picture should be the cover") is a crop of `d3cfa5_c51939d6...` made so
  the player stays centered on the 9:16 phone poster, and is not the cover of any story on the site. The first build ran
  `d3cfa5_855dd607...` (No. 5 with the ball up in the end zone); the three package thumbnails are their own stories' covers. No
  player is named in alt text.
- **QA:** `sports-live/qa-magazine-postgame.mjs` hard-codes the first postgame issue's file names and its PDF, UAA and video
  expectations, so it was run from a copy with the three file names changed. At 320/390/430/1366/1920: no horizontal overflow,
  every section present, one h1, links site-relative, anchors resolve, 44 px tap targets, signup tagged "magazine", no feed swap,
  unmount/remount, no console errors. One contrast flag at every width, in the shared signup component rather than this
  edition: a "Privacy policy" link measured at 1.00. Wix photos are stand-ins in the container.
- **Release:** embed `1dd74333-ee02-40da-9c93-cf8fd787c129`, loader from `make-loader.py <sha>` (the postgame loader with the
  dark splash). First release: rev 167, pin `2d1c2a9aaf86fe7ead9f5bda5f66d7b8b105cb06`. The cover change is the next revision. Rollback: the game day loader, `deploy/magazine-2026/pregame-vanderbilt/make-loader.py d04e79280926c3410459d665a3d8648729b7231b`.
- **Columns and the receivers story (fourth build, Nov. 22):** owner direction, Nov. 22: every postgame article goes in the
  Magazine. Adds a `columns` package ahead of the game package (Buddy Martin's two columns, Franz Beard, Eddie Gilley) and the
  receivers story to the game package. Each thumbnail is its story's cover, except Buddy Martin's first column, which runs a
  different Nov. 21 Chris Spears frame because that story's cover is a near-twin of the Magazine cover. The build script's
  scoring-play checks now match ESPN's current wording ("Brock Taylor 53 Yd Field Goal"). ESPN also added an opening
  win-probability point, so the chart starts at 85% instead of 84% and one mark reads 77% instead of 78%. Bundle: 215,228 bytes
  against the 217,088-byte postgame cap. QA from the renamed copy: same profile as the third build (the one shared "Privacy
  policy" contrast flag; no overflow, missing section, bad link or console error at 320/390/430/1366/1920).
- **Email and phone PDF (built Nov. 22, not sent):** owner direction: build the magazine email with a PDF button at the bottom
  and wait for Loren Meadows' story before sending. `email/build_email.py <out.mjml> [DATELINE] [PDF_URL] [PDF_NOTE]` writes the
  MJML: the Nov. 21 game day email's layout with eight story links and a navy "DOWNLOAD THE PDF" button above the footer.
  `{{PDF_URL}}` stays as a token in `email/email.mjml` until the PDF is uploaded. The phone PDF comes from
  `tools/magazine-pdf/phone-edition/` run on this issue: 22 pages, 2.1 MB, Barlow only, 14 links, no overflow; parity is clean
  apart from the two `lead` flags, which are not text. The generator now takes Barlow from the pinned Fontsource packages on
  jsDelivr with curl's own User-Agent instead of asking Google Fonts with a browser User-Agent. To release: add Loren's story to
  the issue and the email, rebuild the PDF, upload it to Wix Media, put its URL in the email and in a `download` block on the
  issue, then send only on the owner's explicit yes (one list email a day, paired with a Spaces push).
