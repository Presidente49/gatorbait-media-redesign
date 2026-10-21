# Homepage story rhythm — prepared Oct. 21, 2026

Candidate only. No Wix write, site publish, post edit, send or automation change.

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

Chromium before/after at 390, 430, 1366 and 1920: five unique current stories, exact four newest supports, unchanged lead and palette variables, two loaded credited image cards with headlines underneath, two text briefs, no visible HTML metadata, no duplicate pools, no nested links, preserved magazine/show/football links, zero horizontal overflow and no JavaScript errors. Additional 390 tests remove one credit and fail both supporting-image requests: all five headlines and their order survive; the first case preserves the other credited image. Results and before/after screenshots are under `qc/`; `index.html` is the comparison viewer. Scout visually inspected the candidate story panels at 390 and 1366. This is local captured-source verification, not public production or physical-iPhone certification.

## Release / rollback for the controller

After review and merge, verify the immutable candidate source, fresh-read skin revision and ownership, then replace only the skin loader's old source SHA with the merged candidate SHA. Preserve its 2.5-second fail-safe and all live settings; re-send ESSENTIAL with the fresh revision. No Editor publish is needed. Root owns the production write and independent live verification.

Rollback: restore revision-21 HTML from `rollback/loader-rev21.json` using the then-current revision and ownership check; remove only this candidate's three config entries if reverting its data changes. The old live source SHA above remains the immutable rollback target. Do not revert unrelated later config entries or modify the core/base-style embeds.
