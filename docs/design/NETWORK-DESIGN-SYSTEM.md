# GatorBait Network Design System

> **Current direction — Oct. 17, 2026: Swamp Night.** Brenden's later choice replaces the Broadcast palette described below. Source: [issue #34, comment 6230312104](https://github.com/Presidente49/gatorbait-media-redesign/issues/34#issuecomment-6230312104), reaffirmed by his active game-day design repair request. Use a navy-to-black set (`#07122e` → `#0b0d12`), a restrained warm ember glow, white Barlow display text and glass panels (`rgba(255,255,255,.06)` with a `rgba(255,255,255,.1)` hairline). Reserve `#fa4616` orange for numbers, calls to action and the glow. Remove bright-blue slabs, chrome text, slashed bugs and skewed chrome. Keep cream story-reading panels for contrast. The historical Broadcast specification below is reference material, not permission to restore its colors. Current implementation: `deploy/swamp-night-20261017/` and each surface's existing source files.

Brenden's direction, Oct. 16, 2026: "I wanna be run like a Network." The Buddy Martin Show broadcast set is the visual system for every GatorBait surface: the magazine (cover and inside, shipped Oct. 16), then the homepage, the All News page, story pages, email and social cards.

Reference renders: `deploy/magazine-2026/pregame-texas/art/v6/cover.html` (cover), `sports-live/src/magazine-pregame.css` (the "Network skin" block at the end). Every department works from this file; if it is not in here, ask before inventing it.

## Tokens

Colors (CSS custom properties; the magazine already uses the `--pg-*` names):

| Token | Value | Use |
|---|---|---|
| `--gb-night` | `#060b1c` | page bottom / darkest set |
| `--gb-navy` | `#0a1740` | panel base |
| `--gb-deep` | `#0d2160` | panel top of gradient |
| `--gb-blue` | `#0021a5` | Florida blue, badges, bars |
| `--gb-blue-2` | `#2b57ff` | glow, highlights |
| `--gb-set` | `radial-gradient(ellipse 90% 40% at 50% 0%, #1a46c4 0%, #0b2a86 38%, #060b1c 100%)` | page background ("the set") |
| `--gb-orange` | `#fa4616` | Florida orange, rails, slabs |
| `--gb-orange-2` | `#ff8a57` | labels on dark |
| `--gb-orange-hi` | `#ff7a3d` | slab top, neon |
| `--gb-orange-lo` | `#d33608` | slab bottom |
| `--gb-gold` | `#f2b632` | opponent bars, focus ring |
| `--gb-cream` | `#fffaf0` | reading panels (lead, feature) |
| `--gb-ink` | `#10264b` | text on cream |
| `--gb-text` | `#e8edff` | body text on the set |
| `--gb-mute` | `#9eacd0` | notes, sources |
| `--gb-line` | `#233468` | hairlines; `#2a4aa8` for lifted panels |
| `--gb-card` | `#0f1c4a` | cards, tiles |

Chrome type (display only, 28px and up): `background: linear-gradient(180deg,#fff 0%,#e3eaf2 32%,#9aa7b7 49%,#f6f9fc 54%,#b7c1cd 78%,#e9eef4 100%); -webkit-background-clip:text; color:transparent; filter: drop-shadow(0 2px 0 #1a2b55) drop-shadow(0 6px 10px rgba(0,0,0,.6))`. Print and reduced-contrast fallbacks: solid `#fff` or `#000`.

Orange slab: `linear-gradient(180deg,#ff7a3d,#f24e14 55%,#d33608)`, chamfered ends with `clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)`, `text-shadow: 0 1px 0 #9a2a06`, glow `box-shadow: 0 0 18px rgba(255,106,43,.6)`.

Neon rail: 4px, `linear-gradient(90deg,#ff7a3d,#fa4616 60%,rgba(250,70,22,0))`, `box-shadow: 0 0 14px rgba(255,106,43,.75)`.

Typography: Barlow only. Display: Barlow Condensed 800, uppercase, tight leading (.84–1). Labels: Barlow 700, uppercase, letter-spacing .08–.16em. Body: Barlow 400/500, 15–17px, line-height 1.5–1.6. Numbers: `font-variant-numeric: tabular-nums`.

## Components

- **Ticker**: orange slab, full width, white uppercase Barlow Condensed 800, 12px, letter-spacing .14em. Left: edition. Center: matchup. Right: countdown.
- **Masthead**: GATORBAIT (BAIT in orange) in Barlow Condensed 800 with "MAGAZINE" (or the surface name) spaced below between two orange rules. Chrome on covers and the set; white on cream.
- **Section head**: chrome h2 with an orange diamond, a 4px neon rail underneath, optional muted note to the right.
- **Panel**: `--gb-card` or deep→navy gradient, 14px radius, `#2a4aa8` edge, lift shadow `0 10px 30px rgba(0,0,0,.45)`, inset top highlight.
- **Tile (big number)**: panel with a 4px orange top rail; value in Barlow Condensed 800 (40–56px), label in orange-2 uppercase, note in mute.
- **Slab button**: orange slab, 48px min height, uppercase, chamfered. Secondary: outlined orange, same chamfer.
- **Cover**: set background with light flares, orange side pillars and top/bottom rails, chrome masthead, orange matchup slab, a bezelled "screen" for the photo, chrome headline, blue bar for the cover-story line, GatorBaitMedia.com footer on orange rules.
- **Reading panel**: cream card with ink text and an orange top border for columns and features; the set stays dark around it.
- **Footer**: neon rail on top, reference-desk links in Barlow Condensed with orange underlines.

## Rules

1. Barlow only. No other families, no system fallbacks in production renders.
2. No team logos or marks unless the asset is in the Wix Media Manager with rights confirmed. Wordmarks in type instead.
3. Chrome type is for display sizes only; never on body text. Body text on the set is `--gb-text`; contrast must stay at 4.5:1 or better.
4. Photos are Chris Spears' or credited in the caption; no AI imagery on covers.
5. AP style in every label (Oct. 17, noon ET, No. 7).
6. One skin file per surface; tokens are shared, not copied with new values.
7. Every surface ships with a 390, 430 and 1366 px render in the PR and a real-browser capture after release.

## Rollout order

1. Magazine cover and inside: shipped Oct. 16 (PRs #295, #296, #297).
2. All News page (`/gatorbait-media-blogs` and the category hubs): CSS skin injected by a site-wide embed, mock first.
3. Homepage (Gazette home code): skin layer over the existing layout; no layout change without Brenden's explicit yes (HOMEPAGE-BASELINE-LOCK).
4. Story pages: header, byline block, reference-desk footer.
5. Email templates and social cards.
