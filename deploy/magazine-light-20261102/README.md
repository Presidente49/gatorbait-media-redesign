# Magazine overhaul, Nov. 2, 2026 (white and orange, calmer phone type)

Owner order (Brenden, Nov. 2): fonts too big on mobile; use the white-and-orange look of the site; add posts that were not in the issue; PDF edition; better email.

## Live changes (embed `1dd74333-ee02-40da-9c93-cf8fd787c129`, Magazine Live Issue v9)
| Rev | Change | Source commit pinned |
| --- | --- | --- |
| 129 | before: dark navy skin | `bd5866dd240eda4b8d4f6da34957bf0c70fb3744` |
| 130 | white and orange skin, smaller phone type, 11 added stories, ESPN corrections (PR #485) | `a32a03c369e05b6f1f0d655a2f177fd69c5ae3dd` |

Only the jsDelivr pin (marker comment `src=` and the script URL) changes between revs; the shell CSS, splash and route sync are otherwise byte-identical. Bundle bytes at the pinned commit were hash-verified against the local build (sha256 `a2808b54...e4c0`).

## Rollback
Re-patch the embed (current revision, category ESSENTIAL) with the live body where the newer pin is replaced by `bd5866dd240eda4b8d4f6da34957bf0c70fb3744` in both places. No publish needed for a custom-embed patch; verify `/magazine` at 390, 430 and 1366 with a cache-busting query.

## Also shipped
- Staff story `59ee1b7c`: Florida total yards 252 and rushing 54 on 28 carries (1.9), per ESPN event 401856734 (text-only update-publish).
- Magazine PDF (Letter 5.3 MB; phone size 79 pages, 5.3 MB; 22 full stories incl. Eddie Gilley's "Nightmare in Atlanta"; no outbound links), built by `tools/magazine-pdf/build-postgame-print.mjs`; v2 uploaded to the Media Manager as `d3cfa5_6b5ad358cb5b436091f74fbe290a40fc.pdf` (Letter) and `d3cfa5_d99264c82e184c539e728058c824d8ef.pdf` (phone size, 5.3 MB); compressed phone PDF (2.2 MB, same pages) `d3cfa5_cb7aecc78fca415c9ca94e8ea9070ef0.pdf`; phone PDF v6 (2.5 MB, 79 pages, designed cover with the Sumrall photo) `d3cfa5_a65951202cd34788af3049f49ad30e23.pdf` (v7, official FloridaGators.com stats: 246 total, 48 rushing) is what the email uses; v6 `d3cfa5_6ddf1431...` carried ESPN-based numbers and is superseded (cover art live at embed rev 134, pin 27a3a33c; prior rev 133 pin 42f61638). Superseded: `d3cfa5_ab5f4b1a...`. Superseded v1: `d3cfa5_9fcf7b87...` and `d3cfa5_500dfbc7...` (left in place; no deletes).
- Email source `newsletter/2026-11-02-postgame-magazine-v2.mjml/.html` (white and orange, PDF button). Draft only: not created as a campaign, not sent. One list email already went Nov. 2, so any send needs Brenden's yes and a paired Spaces push.

## Build and checks
```
MAG_VARIANT=georgia-postgame node sports-live/build-magazine.mjs
node deploy/postgame-georgia-20261031/qa-georgia-postgame.mjs
```
Postgame bundle cap raised 200 to 212 KB (Nov. 2). The cover now requests up to 2400 px so the portrait crop stays sharp on high-density phones.
