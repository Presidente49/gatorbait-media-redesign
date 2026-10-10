# The Chomp Meter — new game-day feature (Oct. 3, ~14:2xZ)

Brenden asked for a new game-day feature to "wow" him. Built: **The Chomp Meter**, a live win-probability gauge styled as a gator bite — a horizontal bar with a jagged "teeth" boundary that slides left/right as the win probability shifts, driven by ESPN's live win-probability feed.

## Live embed

- **ID:** `5a7c1f57-e564-40d6-801f-09087e56020c`, "GBM - Chomp Meter v1 (Win Probability)"
- Position HEAD, category ESSENTIAL, `loadOnce` false, rev 1
- Route-guarded in its own JS to `/` only (same `own()` pattern as other homepage-only widgets)
- Mounts itself right after `#gbm-gd` (the game-day band) via a `MutationObserver` + polling, so it doesn't depend on which embed renders the band
- Did **not** touch the band embed (`96ef5a04`) — it's already at the 15,000-char cap (confirmed by a rejected PATCH attempt), so this shipped as its own embed, same pattern as the stats page (`756655cf`)

## Data contract — `window.__GBM_CHOMP__`

```js
{
  pct: 70.1,            // 0-100, the leader's win probability
  leader: 'away',       // 'away' | 'home' — who pct belongs to
  awayShort: 'FLORIDA', awayName: 'Florida', awayRank: 8,
  homeShort: 'MISSOURI', homeName: 'Missouri', homeRank: 25,
  live: false,          // false = "Pregame projection", true = "Live win probability"
  until: '2026-10-05T04:00:00Z'
}
```

Seeded pregame from ESPN's Matchup Predictor (`summary?event=401856708` → `predictor.awayTeam.gameProjection` = 70.1). The widget re-renders every 3s and on any DOM mutation, so updating this object is enough — no separate call needed.

## For the live score loop (whoever runs it from kickoff)

ESPN's `summary?event=401856708` response has a `winprobability` array — empty pregame, populated with `{homeWinPercentage, ...}` entries once the game starts. Each score-loop tick, after confirming the score change against `scoringPlays`, also:

1. Read the last entry's `homeWinPercentage` (0–1).
2. If `homeWinPercentage >= 0.5`: `leader: 'home'`, `pct: homeWinPercentage*100`.
   Else: `leader: 'away'`, `pct: (1-homeWinPercentage)*100`.
3. Set `live: true`.
4. PATCH embed `5a7c1f57-e564-40d6-801f-09087e56020c`, replacing the `window.__GBM_CHOMP__=...;` object literal in place (same fingerprint-guarded in-place string replace as the band), re-sending `ESSENTIAL`.

At FINAL, set `pct` to the actual final win probability (100 for the winner) and leave `live:true` — or just let `until` expire it with the band.

## Verification

Confirmed via the embeds API: created successfully, revision 1, 4,317 characters, content matches intent. **Could not get a real-browser screenshot of it live** — same limitation noted in earlier sessions' log entries (no Playwright web-automation balance / plain content fetches don't execute JS, and a fetch of the homepage right now shows a stale "Today's Edition" cached snapshot, not the live Front Page 2026 render). A static preview mockup (`preview.png`, same CSS) was rendered locally via Playwright to confirm the design reads correctly — sent to Brenden directly.

## Rollback

Disable embed `5a7c1f57-e564-40d6-801f-09087e56020c`.
