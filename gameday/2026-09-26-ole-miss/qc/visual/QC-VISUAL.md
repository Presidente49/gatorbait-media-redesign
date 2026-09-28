# Visual/link QC, 2026-09-27 ~02:17Z (read-only)

Checked: the homepage, /magazine and 11 posts from Sept. 26-27, using the TinyFish fetch and 3 browser runs. No screenshots were saved; the runs returned only DOM data.

**Clean:**
- Band buttons, "Read the Ole Miss recap", the Cyion and "full game story" links, and all cross-links go to the right stories.
- Five external sources resolve (SI, two On3, Vols Wire, Alligator); the YouTube page loads with the right video title.
- Presser embed Abu9k2osBUQ loads.
- No broken images, no duplicate headlines, and no Today's Edition.
- The game-story and Cyion inline photos carry the Chris Spears credit.

## Problems

1. **Repeats.** Chris Spears celebration frame `d3cfa5_cf3c6da4…` runs inline in both the game story and the Cyion story. The same clip also feeds the presser cover (`eee33706`) and the Carlton cover (`a0dd1ffb`).
   - The Cyion cover `7b723a84` appears to use the "take the field" shot, which is also inline in the game story (`2ea58f38`). The browser pass could only suggest this match; it is not confirmed.
   - The halftime story reuses `16b519_2a79…` (the Soothsayer cover) as a file photo.
   - Fix: swap the Cyion inline photo for a different Spears frame.
2. **Portrait image too big.** `cf3c6da4` renders at 740x1316 in the Cyion story, taller than a phone screen. Fix: crop it to 16:9 or 4:5, or limit its width.
3. **Covers not 1920x1080 (og:image):**

   | Post | Cover | Size |
   |---|---|---|
   | Halftime | `8122d1dc` | 1600x900 |
   | Lacy | `f7398c88` | 1600x900 |
   | Mr. Two Bits | `6095d524` | 2000x1333 |
   | Baugh Runs | `43e9e321` | 3984x2580 |
   | Game Day | `d8a87415` | 3000x969 (panorama) |
   | Soothsayer | `16b519_2a79` | 3000x1777 |

   Fix: re-export these covers at 1920x1080.
4. **Homepage card crop risk.** Cards use a 4:3 fill (303x227) on 16:9 covers, which trims about 12% from each side. The browser pass saw no text cut off, but edge text on the covers is at risk.
5. **Homepage order.** Game Day (17:18Z) is listed after Soothsayer (05:12Z), so the list is not newest-first.
6. **Credits missing.** These inline images have no caption credit: Mr. Two Bits `6095d524`, Baugh Runs `43e9e321`, Game Day `d8a87415`, and the halftime inline `3fb8a7d5` (a player photo captioned "illustration"). Fix: add "Photo by Chris Spears/GatorBait Media" if they are his photos.
7. **Stale reference.** The Lacy story still points readers to the homepage "Rosters & numbers" button, which was removed in band rev36.
