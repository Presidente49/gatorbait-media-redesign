# Homepage story rhythm — prepared Oct. 21, 2026

Shipped Oct. 21, 2026 at about 12:23Z. Codex applied one guarded homepage skin repin; no Editor/site publish, post-content edit, email send or automation change was part of this homepage release.

## Request and result

Preserve a mixed magazine rhythm while showing fewer stories: one lead, the next two stories as credited image cards with headlines underneath, then two compact briefs. Publication order stays newest-first. Missing attribution or a failed image changes only that card to text; it never hides a fresh headline or promotes an older story. HTML writer/date repeats disappear from homepage cards. Article bylines/dates and dates/names printed inside approved artwork stay unchanged.

Older duplicate coverage, columnist and Best shots pools are removed from the visible homepage. The ticker retains football context rather than repeating article headlines. Magazine, show, next-game and football context remain, as do existing Barlow fonts, palette and responsive lead treatment. All stories remains the route to the complete archive.

## Confirmed production source

- Skin: `0c13f955-74bf-484c-abd9-359a5eef271b`, revision 21, enabled, ESSENTIAL. Its live loader pins `8e72526ea341dd1eb77d88e74539ae9359628af8/sports-live/broadcast-home-color.js`. Exact rollback HTML is in `rollback/loader-rev21.json`.
- Core: `622d8ece-df55-44fc-9e4a-3f580804743b`, revision 63. Read-only capture in `fixtures/core-rev63.json`; do not change this object for the candidate.
- Base styles: `1255a4cf-67c9-4967-9a05-432b14ccfe6e`, revision 6. Read-only capture in `fixtures/base-styles.json`; do not change this object.
- `sports-live/front-page.config.json` has three explicit asset-credit additions. The current lead's UAA/Hannah White credit was independently established during PR #413; Tuesday's original GatorBait series artwork was owner-approved in PR #412. The current public Rays article (`https://www.gatorbaitmedia.com/post/rays-the-roof`) identifies the exact cover through `og:image` and displays `Photo courtesy TBS.` This reuses its existing published cover and credit, with no new rights claim.

## Root cause

The live skin's `freshRows()` discarded the entire eight-photo replacement if any selected image lacked a mapped/RSS credit, or fewer than six qualifying photos existed. The current RSS's three newest covers lacked config credits. The baseline harness reproduces eight text rows while older photo pools remain. The candidate selects the four newest support stories before assessing each individual image, never skipping a current story for an older image.

## Verification and review

Run `node --check sports-live/broadcast-home-color.js` and `python deploy/homepage-story-rhythm-20261021/qc.py`. The harness uses the actual captured core/styles, the exact immutable live skin for baseline, a fresh public RSS snapshot and the current config for baseline. Candidate uses the changed skin/config. Original live image/font requests remain real network requests.

Chromium before/after at 390, 430, 1366 and 1920: five unique current stories, exact four newest supports, unchanged lead and palette variables, two loaded credited image cards with headlines underneath, two text briefs, no visible HTML metadata, no duplicate pools, no nested links, preserved magazine/show/football links, zero horizontal overflow and no JavaScript errors. Additional 390 tests remove one credit and fail both supporting-image requests: all five headlines and their order survive; the first case preserves the other credited image. Results and before/after screenshots are under `qc/`; `index.html` is the comparison viewer. Scout and controller visually inspected the candidate story panels at 390 and 1366. This is local captured-source verification, not public production or physical-iPhone certification.

GitHub run `39598768390` passed its homepage image checks, then failed in the unrelated unchanged magazine build: `magazine.js is 189184 bytes; the limit is 188416`. The same error reproduces locally; this branch changes no magazine source/build files against main. Eight image state/slow-load unit tests pass locally. The broad CI result is a known remaining failure, not a green full-suite claim; do not alter the protected live magazine to conceal it. The independent four-width candidate harness uses the installed system Chromium and passes as recorded above.

## Release / rollback for the controller

PR #415 merged `9d9c5b5262772d7ca450dc67e80acbee4776f312`. Before the live patch, all three public config credits returned HTTP 200 with their intended values, and the immutable jsDelivr source matched the reviewed candidate bytes (SHA-256 `1c45ffdd593ca3368436e28f1f93580cf2bd97298ff83612c754c9db4e9b0219`). Root fresh-read the exact revision-21 loader and applied only its pinned source/comment change with ESSENTIAL re-sent. Provider readback confirms skin `0c13f955` revision 22, exact intended HTML, unchanged enabled/position/loadOnce. Core and base-style objects were not changed.

Root actual cache-busted public HTTP 200 at true CSS widths 390/430/1366/1920 (12:23:29–31Z) verifies the intended merged source pin, unchanged QB lead, exactly four current supports, two loaded credited photo cards, two briefs, no repeated HTML byline/date, no visible duplicate pools, preserved magazine/show links and zero overflow. Muse independently checked the same four public widths and visually reviewed phone/desktop screenshots with the same passing result. Existing desktop `wixTagManager is not defined` noise remains; physical iPhone was not tested. Runtime evidence stays at `/workspace/scratch/homepage-rhythm-live-20261021/` and independent evidence in Muse's private review directory. The broad CI failure described above remains the unchanged magazine bundle cap, not a passing full-site suite.

The release preserved the existing 2.5-second fail-safe and all live settings. No Editor publish was needed. Codex remained the only production writer.

Rollback: restore revision-21 HTML from `rollback/loader-rev21.json` using the then-current revision and ownership check; remove only this candidate's three config entries if reverting its data changes. The old live source SHA above remains the immutable rollback target. Do not revert unrelated later config entries or modify the core/base-style embeds.
