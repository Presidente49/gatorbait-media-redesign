# GatorBait post formatting normalizer v1 (LIVE since 2026-09-27)

**Live:** embed `c91ad133-194f-4077-b124-3c18cc11d2d7` "GBM - Post formatting normalizer v1"
- Settings: HEAD, **ESSENTIAL**, loadOnce false, revision 2.
- Size: 5,307 chars, fingerprint 2424780285.
- **Rollback:** disable `c91ad133`. Posts then fall back to post template v1 (`14a887e3`) alone.

## Why
Brenden: "fix the Buddy Martin post blog template — no rich text." Buddy writes in the Wix editor with habits that the new template flattened into a wall of text:
- Up to half the paragraphs are **empty spacer lines**: 42 of 84 in "The Sweet Music Chimes Again!".
- **Every paragraph is bold**: 42 of 42 in "Sweet Music", 37 of 37 in "Saturday's Bill".
- **Subheads are hand-made**: short bold lines such as "An Hour Worth Remembering", not real headings.
- **Deck and lede lines are 24–36px inline font sizes**, which the template's `span{font-size:inherit}` resets to body size.
- **"By Buddy Martin / GatorBaitMedia.com" is typed into the body.**

This lives in its own embed because post template v1 had only about 400 characters of room left under the 15k cap.

## What it does (article pages only; content is never edited)
- Hides empty spacer blocks. The template's paragraph spacing takes over.
- If at least 60% of text paragraphs are fully bold (5 or more paragraphs), `html[data-gbm-unbold]` renders the body at normal weight.
- A short, fully bold line with no sentence punctuation (at most 60 characters and 9 words, not starting with a digit) is styled like a template H2.
- Inline font size of 30px or more becomes a deck (`data-gbm-dek`); 22–29px becomes a lede (`data-gbm-lede`).
- A "By Name" line, plus a following "GatorBaitMedia.com" line, becomes a small uppercase byline.
- Wix re-renders the article after first paint and drops attributes. A body MutationObserver re-tags synchronously, before paint. A fast-path signature (block count plus tag count) makes unrelated mutations cheap: 200 of them cost 7ms in the mock.

## Tested
`mock-buddy.html` is the template mock with Buddy's real block structure. `render.mjs` and `rerender.mjs` are the test scripts.
- **Tags found:** 18 spacers hidden, 3 subheads, deck, lede, byline, body weight 700 → 400.
- **Re-render:** 3 simulated hydration re-renders gave 0 untagged frames.
- **Layout:** no horizontal overflow at 390 and 1366.

Rev1 set a run-once marker and lost its tags to Wix's re-render on the live site; rev2 fixed that.
