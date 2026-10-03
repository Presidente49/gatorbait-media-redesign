# GatorBait Game Center (Oct. 3, ~19:0xZ)

Brenden asked for a bad-ass game portal page. Built as a full-screen live portal, no Wix Editor step needed.

## Where it lives
- **URL:** `https://www.gatorbaitmedia.com/#gameday` (opens over the homepage). Also mounts on `/gameday` if a blank Wix page with that slug is ever added (Wix's API cannot create static pages). Close goes back to `/`.
- **Entry point:** an orange "Open the Game Center" button inside the homepage Chomp Meter (embed `5a7c1f57`, rev 2). The band cannot take non-/post/ links.
- **Embeds (HEAD, ESSENTIAL, loadOnce false):** style `a3acdf19-7300-4956-aeeb-5f32efede751` (5,636 chars), script `bdb6094b-fa92-40e5-a1ed-f83b5f4ad6cc` (9,965 chars). Source: `gc.css`, `gc.js` here; `embed-style.html` / `embed-script.html` are the exact live bodies.

## How it works
- The visitor's browser polls ESPN (`site.web.api.espn.com`, fallback `site.api.espn.com`, event `401856708`) every 15 s live, 60 s pregame, 5 min after the final. No server, no loop of ours, no Wix writes per score.
- Sections: scoreboard with countdown / live clock / final, Chomp Meter (ESPN win probability, pregame predictor before kickoff), scoring plays feed, team stats (season averages pregame), leaders, watch and listen, latest 6 GatorBait stories newest-first (from `/blog-feed.xml`), share buttons (X, Facebook, copy link).
- Hides the mobile shell header while open; the chant player stays above it so it can still be stopped.

## Verification
Harness `test.mjs` (Playwright, real pregame ESPN summary plus a synthetic live game): no JS errors, no horizontal overflow at 390 and 1366 px, close restores the hash, scores / win probability / scoring plays / stats render. **Not verified on the live site from this sandbox** (no browser reach to gatorbaitmedia.com, and Wix media / ESPN CDN logos are blocked here, so logos only show live).

## Rollback
Disable embeds `a3acdf19` and `bdb6094b`. The Chomp Meter button then points at a hash that does nothing; remove the `cm-go` link from `5a7c1f57` to hide it.

## Known limits
- Event id is hard-coded to this game; the next game needs `EV` changed.
- Kickoff time comes from ESPN (3:50 p.m. ET at last check); FloridaGators.com still said 3:30.
- Watch/listen names are from the official UF game-day page.
