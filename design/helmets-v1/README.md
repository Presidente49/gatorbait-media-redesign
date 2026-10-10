# Helmets v1: team helmets for GatorBait graphics

`helmets.py` draws a side-view football helmet as SVG in a team's colors: shell, stripe, facemask and a text decal with the ESPN abbreviation. It is original GatorBait art. **No school logo files or artwork are used**, so it is safe on editorial graphics without logo licensing.

- `helmet('FLA')` faces right; `helmet('MISS', flip=True)` faces left (use a pair for a face-off).
- Colors come from ESPN team data (`team.color` / `alternateColor`), adjusted to each team's well-known helmet shell (e.g., Texas and Penn State white, Notre Dame gold, LSU gold).
- A light edge behind each facemask keeps navy/black masks visible on the navy tiles.
- Add a team: one line in `T` (shell, stripe, facemask, decal color).
- Keep it off merch: editorial graphics only (Brenden's no-likeness-for-merch rule applies to anything that sells).

First used: CFB Saturday wrap cover, Sept. 27, 2026 (`gameday/2026-09-26-ole-miss/cfb-wrap/build_cover.py`).
Real team logos were not used: this environment can't download them (ESPN's and Wix's image hosts are blocked by the proxy), and helmets avoid trademark questions.
