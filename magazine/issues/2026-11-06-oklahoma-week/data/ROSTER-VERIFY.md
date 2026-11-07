# Roster and depth-chart data: verification

Issue: Florida vs. Oklahoma, Nov. 7, 2026 (magazine week of Nov. 6).
Prepared Nov. 7, 2026 from the official text layers only. No MCP, Wix, GitHub, Gmail or Drive calls. Nothing was committed or pushed. No existing PDF was rebuilt; `sports-live/`, `newsletter/` and `print-stage/` were not touched.

Florida's own Week 10 depth chart (UF PDF p. 42, blurry image) was deliberately not read or transcribed. The only Florida depth fact in the packet is the QB line in `sources/UF-DEPTH-REFERENCE.md` (Aaron Philo OR Tramell Jones Jr.). It was not re-derived here. Both names do exist on the UF roster (Philo, Aaron #12 QB; Jones Jr., Tramell #9 QB).

## Result at a glance

| File | Source pages | Result |
| --- | --- | --- |
| `uf-roster.json` | UF notes pp. 40-41 (`Florida-Roster-Only.pdf` pp. 1-2) | 117 rows, ordered by jersey number |
| `ou-roster.json` | OU notes pp. 8-9 (`Oklahoma-Depth-and-Roster.pdf` pp. 2-3) | 113 rows, ordered by jersey number |
| `ou-depth.json` | OU notes p. 7 (`Oklahoma-Depth-and-Roster.pdf` p. 1) | 91 entries: offense 36 (11 groups), defense 38 (12 groups), specialists 17 (7 groups); 19 OR flags; 74 distinct players |

Extras beyond the requested shape (additive, nothing requested was removed):
- `uf-roster.json` and `ou-roster.json` carry a top-level `notes` object. It holds the verbatim page text outside the roster table: headers, footnotes and legends, pronunciation guide, coaching staff.
- `ou-depth.json` carries top-level `source`, `asOf` and `pageText`. Its `notes` array is empty because OU p. 7 prints no footnotes and no coaching-staff text. The page header, title, section titles and footer are in `pageText`.

## How the data was read

Method for all three files: `pdftotext -bbox` word coordinates, split into columns and rows by x/y position, in plain `python3`. The `-layout` text was used as an independent second reading.

Scripts, kept out of the repo, are in `/tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/tools/`: `words.py`, `uf_parse.py`, `ou_roster_parse.py`, `build_all.py`, `depth.py`, `complete.py`.

All page numbers are 1-based PDF pages of the supplied extracts.

## 1. UF roster (pp. 40-41)

Layout: the left blue box is a numerical list (number, name, position only). The right-hand table is the alphabetical roster with full data. Page 1 has the numerical box on the left and the table on the right. Page 2 reverses this: table on the left, numerical box continued on the right.

The 117 rows come from the alphabetical table, which is the only list with height, weight, class, hometown and school.

| List | Page 1 | Page 2 | Total |
| --- | --- | --- | --- |
| Numerical (num, name, pos) | 68 | 48 | 116 |
| Alphabetical (full data) | 65 | 52 | 117 |

Cross-check of numerical against alphabetical, on (number, name, position):
- 116 of 116 numerical entries match an alphabetical row exactly (same number, same name string, same position).
- 1 alphabetical row has no numerical entry: **#56 Keumajou-Yondui, Stive-Bentley, DL** (flag F1). That row is kept, using the alphabetical data.
- No numerical entry lacks an alphabetical row.

Field checks on all 117 rows:
- Height matches `d-dd`.
- Weight is 3 digits.
- Class, hometown and school are non-empty on every row. No UF row lacked height, weight or class, so no empty-string fields were needed.
- Every row string (`num name pos ht wt cl hometown school`) was found verbatim on a single `-layout` line (117 of 117).

Ordering:
- Rows are sorted by jersey number, numerically. Ties follow the order of the official alphabetical list. That matches the tie order in the printed numerical list for every tie group (checked), so there is no conflict between the two lists.
- Jersey numbers worn by two players: 30 numbers (1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 15, 16, 17, 20, 21, 22, 23, 24, 25, 27, 33, 34, 40, 48, 50, 52, 54, 55, 56, 91). No number is shared by three. #0 is Woods, Jayden only. This is as printed.

Strings kept exactly as printed:
- Class values: `Sr.` 31, `So.` 26, `Fr.` 25, `Jr.` 24, `5th` 6, `5th.` 2, `7th` 1, `6th` 1, `R-So.` 1.
- Positions: OL 20, DL 15, WR 14, CB 11, S 9, ILB 9, RB 8, TE 8, JACK 6, QB 5, LS 3, P 3, STAR 3, K 3.
- Names are in "Last, First" form with suffixes as printed ("Brown III, Vernell", "Jones Jr., Tramell").
- The curly apostrophe in "St. Sebastian’s / Indiana" is kept. The straight apostrophes in "Flowers, J'Vari" and "Carr, G'Nivre" are kept.

Manual handling: none of the rows needed hand edits. The three oddities below are recorded as flags and left as printed:
- The tiny-font name on #56.
- The out-of-order #24 in the numerical list.
- The odd Solwold hometown.

## 2. OU roster (pp. 8-9)

Both pages carry the full row data (No., Player, Pos., Ht., Wt., Yr., Hometown (Previous School)), in two panels per page.
- p. 8 is the numerical roster. It is the primary source for `ou-roster.json`, because the output must be ordered by jersey number.
- p. 9 is the alphabetical roster. It was parsed independently and compared field by field with p. 8.

| Page | Left panel | Right panel | Total |
| --- | --- | --- | --- |
| p. 8 numerical | 76 | 37 | 113 |
| p. 9 alphabetical | 76 | 37 | 113 |

A false match, the p. 8 footer line `8 !!!!!!! 2026 OKLAHOMA FOOTBALL` that begins with a digit, was dropped. It is not a roster row.

Cross-check p. 8 against p. 9:
- 111 of 113 rows are identical on all fields: number, name including asterisks, position, height, weight, year, and hometown with school.
- 2 rows differ only in the letters-earned asterisk on the name (flag F8):
  - #51 Jaydon Southard: p. 8 prints `Jaydon Southard`; p. 9 prints `Jaydon Southard*`.
  - #99 Braxton Fely: p. 8 prints `Braxton Fely`; p. 9 prints `Braxton Fely*`.
  - Both were confirmed on the rendered p. 8 and p. 9 images. The JSON follows p. 8, the primary page, as printed.
- With asterisks ignored, the two lists are identical on all 113 rows.
- p. 8 is in numeric order (checked).
- Every p. 8 row was found verbatim on one `-layout` line (113 of 113).

Hometown and school: OU prints one combined string, `Hometown (Previous School)`. To match the requested shape it was split on the final parenthetical, `hometown` before ` (` and `school` inside the parentheses.
- All 113 splits reassemble exactly to the printed string.
- One row needed handling: **#97 Alex Shieldnight** prints `Wagoner, Okla. Wagoner HS)` with no opening parenthesis, on both p. 8 and p. 9 (flag F9). It is stored as `hometown` "Wagoner, Okla." and `school` "Wagoner HS".

Markers kept exactly as printed:
- `name` keeps the trailing asterisks, meaning letters earned at OU. 40 names carry them: 23 have one, 11 have two, 6 have three.
- `cl` keeps the `^` marker, meaning an undergraduate degree earned: `5th^` 8 rows, `6th^` 2 rows.
- To match against the depth chart or another source, strip trailing `*` from `name` and a trailing `^` from `cl`.
- Class values: `Jr.` 31, `Fr.` 24, `So.` 23, `Sr.` 15, `5th` 10, `5th^` 8, `6th^` 2.
- Positions: DL 20, DB 19, OL 18, WR 14, LB 13, TE 9, RB 8, QB 4, K 4, LS 2, K/P 1, P 1.
- Every row has height, weight and class. No empty-string fields were needed.
- Curly apostrophes (Hau’ula, Hawai’i, Jer’Michael, E’Marion, D’Yoni) are kept.

The column-header row of pp. 8-9 is font-encoded in the text layer and unreadable (flag F12). It was read from the rendered pages: "No. Player Pos. Ht. Wt. Yr. Hometown (Previous School)". That is recorded in `notes.columnHeader`.

`asOf` is "week of Nov. 2, 2026", matching the UF file. The page itself says "Last updated Nov. 2, 2026" and "Weights as of Aug. 4, 2026" (flag F13). Both lines are in `notes.legend`, identical on p. 8 and p. 9.

## 3. OU depth chart (p. 7)

Method: coordinates split the page into Offense (left) and Defense (right) above, and Specialists below in two columns. Each row yields a label (if any), a jersey number, and a "Name (ht, wt, class)" string. An entry followed by `OR` gets `or: true`, meaning it is an either/or with the next entry in the same group.

Groups, in page order:
- Offense: QB, RB, X, TE, LT, LG, C, RG, RT, H, Z (36 entries).
- Defense: LDE, DT, DT, RDE, MIKE, WILL, SAM, CHEETAH, LCB, SS, FS, RCB (38 entries). **DT appears twice** on the page as two separate groups. Both are kept as separate `pos: "DT"` groups in page order.
- Specialists: K, P, KO, KR, PR, LS, H (17 entries).

Independent checks:
- The entry count from a plain regex over the `-layout` text is 91, and the parsed total is 91.
- `OR` token count in the text is 19. Parsed `or:true` count is 19: offense 9, defense 8, specialists 2.
- A second parse built from the `-layout` text (different method) gives identical entry sequences, OR flags and group labels for offense and defense. For specialists the entries and group labels are identical as a multiset (the two parses read the two specialist columns in a different order).
- The same player is deliberately listed in more than one group on the page, as printed:
  - Fred Hinton (72): LT and RT.
  - Ryan Fodje (70): LT and RG.
  - Heath Ozaeta (77): LG and RG.
  - Cole Sullivan (18) and James Nesta (47): MIKE/WILL/SAM overlap.
  - Omarion Robinson (2): SS and FS.
  - Dakoda Fields (9): LCB and RCB.
  - Tate Sandell, Trace Rudd and Liam Evans: K and KO.
  - Jacob Ulrich and Grayson Miller: P and H.
  - Lloyd Avant and Jonathan Hatton Jr.: RB and KR.
  - Isaiah Sategna III, Jacob Jordan and Trell Harris: PR and other groups.
- OR chains are preserved as printed. Example: RG is Fodje OR Best OR Ozaeta, then Hollenbeck, so Fodje and Best both carry `or: true`.

Depth entries checked against the OU roster (number, name, height, weight, class with `^` ignored):
- 89 of 91 entries match a roster row on all fields.
- 2 differ from the roster, flag F10:
  - **#58 "Tank Carrington" (DT, 6-2, 295, Fr.)**: the roster (pp. 8-9) lists #58 as "James Carrington DL 6-2 295 Fr." The first name differs. No player named Tank Carrington exists on the roster.
  - **#3 Reggie Powers III (CHEETAH)**: depth chart class `So.`; the roster says `Jr.` (height 6-0 and weight 214 agree).
- Neither value was changed. Each file carries what its own page prints.
- 74 distinct players (number plus name) are on the chart. 73 of them match a roster row by number and name; the 74th is the Carrington row above.

Class strings: the depth chart prints plain `5th`/`6th` with no `^`. `Omarion Robinson` is printed `(5-11, 212, So. )` with a stray space before the closing parenthesis, twice (SS and FS). It is stored as `cl: "So."` (flag F11).

## 4. Text-completeness check

Test: split `pdftotext` output of the source pages on whitespace. Strip surrounding brackets, commas, colons, asterisks, carets, quotes, pipes and slashes, and trailing periods. Compare the distinct tokens (case-sensitive) with every key and value in the matching JSON file.

| Source | Distinct PDF words | Missing from JSON |
| --- | --- | --- |
| UF pp. 40-41 | 793 | **0** |
| OU p. 7 | 317 | 1: `OR` |
| OU pp. 8-9 | 764 | 8, all unreadable header or footer glyph runs (below) |

Explanation of the misses:
- `OR`: this word is encoded as the boolean `or:true`, not as text. The count is verified separately: 19 `OR` tokens, 19 flags.
- The 8 OU pp. 8-9 tokens are `#$!`, `#0)-#12!3%*)45#6+!789##&`, `$!`, `%#+$!`, `%&'()*!`, `-$!`, `.-$!` and `8!!!!!!!2026`.
  - Seven are the font-encoded garbage of the column-header row. The header was read from the render and stored in `notes.columnHeader`.
  - The eighth is the decorative glyph run `!!!!!!!` fused to the `8` and `2026` of the p. 8 footer. The readable footer text "8 2026 OKLAHOMA FOOTBALL" is in `notes.pageFooters.p8`.
  - None of these carries editorial content.
- Roster completeness is also checked by row: every parsed row string appears verbatim on one `-layout` line.

## 5. Flags

Source discrepancies are recorded, not corrected. Nothing was invented or guessed.

**UF**
- **F1. #56 Keumajou-Yondui, Stive-Bentley (DL, 6-3, 295, Fr., Miami, Fla., Coral Gables) appears only in the alphabetical table, not in the numerical list.** It is set in much smaller type to fit the line. The row is kept, using the alphabetical data. The numerical list therefore shows only Medlock, Jahari at #56. Confirm with UF before running a list that depends on the numerical box.
- **F2. In the numerical list, #24 "James, Kamran" (DL) is printed between #22 and #23**, out of order. The alphabetical table confirms #24 DL, and Montgomery, London is also #24 (RB). The JSON sorts numerically. No data change.
- **F3. Class labels are inconsistent as printed**: `5th.` (Allen Jr., Alfonzo; Asare, Kofi) versus `5th` (6 rows), plus `6th` (Pryor, Evan), `7th` (Jackson, Kahleil) and `R-So.` (Zandamela, Jason). Kept as printed. How to style them in print is the builder's call; `6th` and `7th` are unusual, so confirm before printing them as years of eligibility.
- **F4. Hometown with a trailing slash**: #15 Bronaugh, CJ prints `Orlando, Fla./`. Kept as printed, per the job brief.
- **F5. #58 Solwold, Hunter** prints hometown `Fallston, Md. / Fallston` and school `Washington`. The repeated "Fallston" is as printed; no correction made.
- **F6. The UF pronunciation guide spells three names differently from the roster**: guide `Byrce Lovett` versus roster `Lovett, Bryce`; guide `Emanuel Oyebadejo` versus roster `Oyebadejo, Emmanuel`; guide `Dylar Purter` versus roster `Purter, Dylan`. The guide also prints `Tramell Jones Jr:` with a colon. All are kept as printed in `notes.pronunciationGuide`. **Do not use the guide's spellings in copy.** The roster spelling is the one in `rows`.
- **F7. Stale footnote.** The p. 41 footnote reads "All listed numbers are subject to change ahead of UF's 2026 season opener." That is odd wording for Week 10. It is recorded in `notes.footnotes` but should not be reused.

**OU**
- **F8. Letters-earned asterisk mismatch between p. 8 and p. 9** for #51 Jaydon Southard and #99 Braxton Fely (see section 2). `ou-roster.json` follows p. 8.
- **F9. #97 Alex Shieldnight** hometown/school is printed `Wagoner, Okla. Wagoner HS)` with the opening parenthesis missing, on both pages. The split into "Wagoner, Okla." and "Wagoner HS" keeps the printed words.
- **F10. Depth chart versus roster**: #58 "Tank Carrington" on p. 7 versus "James Carrington" on pp. 8-9, and #3 Reggie Powers III class `So.` on p. 7 versus `Jr.` on pp. 8-9. Neither was changed. If a printed page pairs a roster name with a depth-chart name, confirm Carrington with OU.
- **F11. Stray space in `So. )`** on p. 7 (Omarion Robinson, SS and FS). Normalized to `So.` in the JSON. It is a spacing artifact, not a name, number or stat.
- **F12. The column-header row of pp. 8-9 has an unreadable text layer.** The header text was read from the render. It is the only content on those pages that required visual reading.
- **F13. OU roster weights are "as of Aug. 4, 2026"**, not current. The roster is "Last updated Nov. 2, 2026". Any printed roster that shows OU weights should carry the weights date. UF's pages print no weights date.
- **F14. OU `name` and `cl` keep their footnote markers.** The legend is in `notes.legend` ("* Indicates number of letters earned at OU"; "^ Has earned an undergraduate degree").

**Both teams**
- **F15. Availability.** A roster or depth-chart listing does not establish game-day availability (as `OFFICIAL-SOURCES.md` states). The OU chart contains 19 OR listings. Preserve them exactly. They are not a confirmed lineup.
- **F16. The UF Week 10 depth chart (UF p. 42) was not transcribed**, by design.

**Magazine display (v2 revision, Nov. 7)**
- **F17. Display tidy in the printed tables only; `uf-roster.json` and `ou-roster.json` still hold the source text exactly as printed.** The magazine builder (`tidyRow` in `tools/magazine-pdf/build-issue-v2.mjs`) shows `5th.` as `5th` (Asare, Kofi; Allen Jr., Alfonzo; F3), drops the dangling `/` from `Orlando, Fla./` (Bronaugh, CJ; F4), and re-splits #58 Solwold, Hunter's cells as hometown `Fallston, Md.` and school `Fallston / Washington` (F5), matching how every other UF row lists high school then transfer schools. Source wording is unchanged for everything else, including the letters-earned asterisks (F8): the OU table follows OU's numerical roster, which does not mark Southard or Fely; OU's alphabetical roster does. Re-checked against the OU game notes PDF on Nov. 7: the two lists disagree in the source itself.
