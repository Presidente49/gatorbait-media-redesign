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

## Update, ~19:3xZ: extras module and nav fix (Brenden: "real game tracker with a little football field", SEC scores, rankings, ticker, message board, nav connected)

New embed `fdf0a3e3-a260-45f3-a298-7820eeaddbef` ("Game Center v1 (extras)", 12,383 chars; source `gcx.js`, `gcx.css`, body `embed-extras.html`). The core embed `bdb6094b` (now 10,148 chars) gained three hooks (`X('field')`, `X('more')`, `X('tick')`) and degrades gracefully if the extras embed is disabled.

- **Field Tracker:** SVG football field, FLA left / MIZ right, yard numbers, blue line of scrimmage, yellow first-down line, ball and drive arrow, down and distance, last play, timeouts. Reads `situation` (or the current drive's last play) from the ESPN summary. **The live `situation` shape was not available to test pre-kickoff**, so it was built against ESPN's documented fields (`possessionText` like "MIZ 41", `downDistanceText`, `possession`, `yardLine`); if ESPN's live payload differs, the field shows the caption and no ball. Check at the first snap.
- **Around the SEC:** ESPN scoreboard, group 8, today's ET date, every 20 s, rankings shown, live games first.
- **Top 25:** ESPN AP rankings, every 10 min; FLA and MIZ highlighted.
- **Breaking and Around the Gators:** ESPN headlines from the summary plus team news (`news?team=57`), links out to ESPN.
- **Scrolling ticker** under the header: SEC live/final scores plus headlines; static scroll for reduced-motion.
- **Fan Board:** links into the real Wix Groups (Game Day Threads, Gator Football Talk, The Swamp Lounge), paths `/groups/<slug>` (not click-tested). A true in-page live chat needs a chat provider account; none is connected.
- **More Ways To Follow:** ESPN Gamecast, UF Live Stats, nationwide scoreboard, full rankings.
- Google News RSS was not used: it sends no CORS headers, so a browser cannot read it without a third-party proxy.

Test: `test2.mjs` (Playwright, real pregame ESPN summary plus synthetic live game, scoreboard, rankings, news): no JS errors, no overflow at 390 and 1366.

### Nav audit (live, via fetch, ~19:3xZ)
OK: /groups, /pricing-plans, /account/my-account, /about, /contact, /policies, /the-buddy-martin-show, /magazine, /gatorbait-media-blogs, /tags, /login, /shop (redirects to the itemorder store).
**Broken and fixed:** header (`7fee4de6` rev 33) and footer (`f8b950c9` rev 31) "Stats" pointed to `/florida-football-stats`, a **404** (Wix's API cannot create static pages; the stats embed `756655cf` has nothing to mount on). Both now read "Game Center" -> `/#gameday`. To restore Stats later: add a blank Wix page with slug `florida-football-stats`, then swap the entry back.
