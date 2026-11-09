# GatorBait Magazine, Oklahoma week, v2 revision (Nov. 7, 2026)

**Status: built, QC'd, and held. Nothing was uploaded, patched, published, scheduled or sent.** No Media Manager upload, no embed patch, no campaign, no automation change, no site publish. Brenden's hold on all live magazine steps stands. This package lives only in the repo (PR #531, branch `jarvis/magazine-20261106`).

Owner direction: PR #531 comment 6698992210 (revise the complete Oklahoma-week magazine into the "coolest magazine ever": Barlow, cream, navy and orange; nine complete stories; game guide; both official rosters; Oklahoma depth chart; cover v2). The v1 PDFs are in `print-stage/superseded/` with a "do not upload" note.

## Artifacts

| Edition | File | Pages | Page size | Size | SHA-256 |
|---|---|---:|---|---:|---|
| Digital Letter | `print-stage/gatorbait-magazine-oklahoma-week-2026-11-06-v2-letter.pdf` | 35 | 8.5 x 11 in | 9.9 MB | `af038526695a0091834256dbc2e7cf7c68ab5c03023d12e6a844f9ad871ad3cf` |
| Phone | `print-stage/gatorbait-magazine-oklahoma-week-2026-11-06-v2-phone.pdf` | 53 | 5 x 8.92 in (360 x 642 pt) | 4.4 MB | `b784e238155428b4cf2e00853e83187611b7f32adc306e1e4052843e5e4838d0` |

Both: Barlow and Barlow Condensed only (embedded), 22 bookmarks, tagged structure, titles ending "(Letter edition)" and "(Phone edition)". Letter has 27 outside links and 17 internal links; phone has 27 and 18. Machine-readable detail: `v2-manifest.json`.

Also here: page-by-page contact sheets in `v2-proofs/` (`v2-letter-01..03.jpg`, `v2-phone-01..03.jpg`), copy-parity reports `magazine/issues/2026-11-06-oklahoma-week/data/PARITY-REPORT.md` (Letter) and `PARITY-REPORT-phone.md` (phone), and the builder `tools/magazine-pdf/build-issue-v2.mjs` (plus `finish-pdf.py`, `check-parity.py`, `make-proofs.py`, `v2-manifest.py`).

## What is in the issue

Cover v2 (Urban Meyer, Ring of Honor, The Swamp), contents with linked rows, game guide (Oklahoma at Florida, Saturday, Nov. 7, 7:45 p.m. ET, SEC Network) with a Quarterback Watch box, then nine complete stories as filed: Best Fridays (Urban Meyer), the Buddy Martin Show panel on Tramell Jones, Scouting Oklahoma Part 1, the first CFP rankings, the Soothsayer, Condon, McMiller, the Golden Goose, and Yost. Then the Florida 2026 roster, the Oklahoma Week 10 depth chart and the Oklahoma 2026 roster (official text layers, typeset as tables), a Watch-and-read link list, and a credits and sources page.

## QC results

| Check | Result |
|---|---|
| Copy parity, every story against the writers' filings (Letter and phone) | **PASS, nothing unexplained.** 6 lines dropped by rule (promo or byline or photo-credit lines), 0 unexplained. Final run on the shipped files. |
| Independent visual and structure review, 4 rounds | Round 1 to 3 fixes are in commits `4368a83f`, `a64d4104`, `31a51c32`. **Round 4 (four read-only reviewer agents: Letter all pages; phone pp. 1-27; phone pp. 28-53; structure and copy): no blockers, no majors, verdict "minor-only" from all four.** |
| Round-4 minors fixed in the final build | Date year split across lines in captions ("Jan. 8, 2009" and others, now joined); Letter stranded one-line widow on p. 11 (paragraph moved whole); underlined URL text in Watch-and-read rows (underscores were hidden, now only the label is underlined); Soothsayer drop cap sized to its two-line first paragraph (phone); credits link indent (phone); Contents tap rows for the three reference entries raised from 14 pt to 22 pt tall (phone, still one page); hairline of unpainted edge at the bottom of every phone page (page height is now a whole 642 pt); phone game-band labels 7.0 to 7.8 pt and footer 6.4 to 7 pt. |
| Checked by me after the fixes (not re-reviewed by a separate agent) | Copy parity re-run on both final PDFs; page counts and bookmarks unchanged (35 and 53); changed pages rendered and looked at; link rectangles measured; edge pixels sampled on the cover, a full-bleed page and the back cover. |
| Scope of "independent" | The reviewers were separate read-only agents with no builder context, not human editors. |

## Credit manifest (images in the issue)

| Asset | Pixels | Used for | Credit |
|---|---|---|---|
| `champ-2008-celebration.jpg` | 1920 x 1080 | Ring of Honor opener | Jason Parkhurst/UAA Communications (official UF photograph; game played Jan. 8, 2009) |
| `condon.jpg` | 2000 x 2651 | Condon story | Photo by Chris Spears, GatorBaitMedia.com (October exhibition against Stetson, not the Jacksonville game) |
| `cover-v2.png` | 1103 x 1426 | Cover | Digital composite (AI-assisted) built from official Florida Gators/UAA photographs: Urban Meyer (2006 vs. South Carolina), Florida Gators/UAA; Tim Tebow (2006 vs. LSU), Jay Metz/UAA Communications; 2008-season championship celebration, Jason Parkhurst/UAA Communications. 130 ppi at Letter size; digital only. |
| `fridays-still.jpg` | 1920 x 1080 | Best Fridays | Video still: The Buddy Martin Show / Gator Bait Media |
| `qb-panel.jpg` | 2400 x 1350 | Tramell Jones Gets the Call | Photo by Chris Spears, GatorBait Media |
| `scouting-huddle.jpg` | 2400 x 1384 | Scouting Oklahoma, Part 1 | Photo by Chris Spears, GatorBait Media |
| `soothsayer-baugh.jpg` | 1471 x 838 | The Soothsayer | Archival photo by Chris Spears, GatorBait Media |
| `swamp-panorama.jpg` | 2400 x 775 | Game guide | Archival photo by Chris Spears, GatorBait Media |
| `tebow-2006-lsu.jpg` | 1920 x 1080 | Best Fridays closer | Jay Metz/UAA Communications (official UF photograph; 2006 game against LSU) |

Every photo is a real photograph credited as above; the cover is a labeled digital composite (AI-assisted) built from the credited official photographs. Pull quotes, rosters and depth charts come from the filings and official sources named on the credits page.

## Known limits and accepted deviations

- **Not a print file.** These are digital editions. Full-bleed art would be soft at print size: the cover is about 130 ppi at Letter, the Soothsayer hero about 117 ppi, the 2008 celebration about 177 ppi. A print-ready version needs higher-resolution art.
- **Scouting Oklahoma, phone:** body is 10.6 pt, not 10.8 pt, so the closing editor's note stays on its page. The phone Game Guide body is 9.6 pt (a reference page; raising it adds a page).
- **Part 2** of the scouting series is not in this issue; the story's editor's note says so.
- **Copy kept as published (writers' words, flagged earlier):** "O-Dome" as written in the McMiller headline; the Soothsayer's "bitch-slapped"; the CFP story's "Tell us in the comments below." Disclosed corrections carried (credits page): Condon's shooting line, McMiller's hometown, and the Golden Goose ceremony timing (the Ring of Honor induction is at the end of the first quarter).
- **Roster notes:** Oklahoma roster asterisk difference for Fely and Southard disclosed on the page; #58 "Tank" and James Carrington explained on the depth chart intro. Display tidying of roster rows is listed in `data/ROSTER-VERIFY.md`.
- **Cover** is approved art and carries its own italic serif tagline inside the raster.
- **Small stuff left alone:** a few one-word last lines (runts) in pull quotes and one standfirst; inline links in editor's notes are 10 to 13 pt tall (they sit in running text).
- **Web bundle and email are not updated:** they still use the eight-story set and the old cover.

## Decisions for Brenden

1. Approve the Letter and phone PDFs for upload? (Each live step is a separate go: Media Manager upload, embed patch, campaign.) Recommendation: approve the two digital PDFs for the Media Manager only; hold the embed patch and any campaign until you say.
2. Keep the Soothsayer phrase as published and change only the "Tell us in the comments below." line inside the PDF? Recommendation: keep the phrase; change the comments line in the PDF only.
3. Print version: do you want one? It needs better source art first.

## Rebuild

From the repo root, with Node and Playwright Chromium:

```
node tools/magazine-pdf/build-issue-v2.mjs --out <dir>            # Letter
node tools/magazine-pdf/build-issue-v2.mjs --out <dir> --phone    # phone
/usr/bin/python3 -I tools/magazine-pdf/check-parity.py magazine/issues/2026-11-06-oklahoma-week/posts.json <package>/articles --pdf <dir>/issue-v2.pdf --no-hero-pullquotes
/usr/bin/python3 tools/magazine-pdf/make-proofs.py <pdf> <out-dir> <prefix>
/usr/bin/python3 tools/magazine-pdf/v2-manifest.py <letter.pdf> <phone.pdf> tools/magazine-pdf/assets/week2 <out.json>
```

Rollback: none needed for live systems, since nothing live was touched. To drop this revision, revert the PR #531 commits; the v1 files remain under `print-stage/superseded/`.
