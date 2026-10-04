# Game day modes: pregame, live, postgame

Written Oct. 3, 2026, after Florida at Missouri (ESPN 401856708, final 45-17 Missouri). Brenden's direction: "remember the process of what we put up for pregame, game and postgame, and how we get into each mode... I don't wanna keep altering the site... we don't need to be re-downloading a site every time."

## The rule going forward

One game, three modes, **no site edits during the game.**

- The mode comes from ESPN in the visitor's browser: `pre`, `in` or `post` for the event id. The Game Center already works this way and needed no Wix writes all night.
- Every game-day block reserves its own height and renders all three states in place. Nothing gets inserted, removed or re-inserted after the page mounts. Tonight's jumping came from blocks that inserted themselves under the Tunnel on a timer.
- Wix writes are for editorial links only (game story, halftime report), never for scores.
- Each object has one writer. Claim it in #34 before writing, and stop if someone else holds it.

## What is on the site in each mode (current objects)

| Object | Pregame | Live | Postgame | How it changes today |
|---|---|---|---|---|
| Front page Tunnel (`.fp-tunnel`, front-page bundle) | countdown | score + clock | final | reads `__GBM_GAMEDAY__` / scoreboard feed; `data-phase` |
| Band data `96ef5a04` (`__GBM_GAMEDAY__`) | kickoff, preview links | **hand-written score each score** | final + game story first link | Wix PATCH + publish (desk loop) |
| Chomp Meter `5a7c1f57` | ESPN predictor | **hand-written win prob** | off | Wix PATCH + publish. **Disabled** (jump source) |
| Home tracker `877bdac7` | hidden | field + radio button | hidden | **Disabled** (jump source) |
| Game Center core/extras/banners `bdb6094b` `fdf0a3e3` `b5984d6d` + card `60f89132` | countdown | live field, plays, SEC, ticker | final + recap card | ESPN in browser; card text by hand (Jarvis tonight) |
| Home pins in Home Code `622d8ece` | none | none | timed pin → game story until noon next day | Wix PATCH |
| Post template "Next" pill `14a887e3` | this game | this game | **next game** | Wix PATCH |
| Header NEXT strip + countdown | `sports-live/scoreboard.json` `next` | | flips to next game | refresh workflow (**silently failing since Sept. 29**, PR #121 hand fix) |
| Magazine `1dd74333` | Pregame edition | Game Day edition, live ticker | ticker shows Final itself | jsDelivr pin, Magazine owner |
| Game Graph JSON-LD `1261f2b9` | game `startDate` | | | Wix PATCH when kickoff moves |

## Switching modes today (manual checklist)

**Pregame (game week → kickoff)**
1. Get the ESPN event id and kickoff from the ESPN summary, not the school site. ESPN moved this week's kickoff 3:30 → 3:50 and FloridaGators.com stayed wrong.
2. Set the kickoff in one pass: band `__GBM_GAMEDAY__.kickoff/when`, Game Graph, post-template Next pill, Magazine issue, scoreboard feed. Search all embeds for the old time.
3. Game Center reads the event id `EV` in `bdb6094b`/`fdf0a3e3`. Change it for the new game.

**Live (kickoff → final)**
1. Score loop every 3 min. Use a cache-busted ESPN URL (`&_=<time>`); without it TinyFish served a stale pregame copy for 6 minutes.
2. Confirm each score against ESPN `scoringPlays` before writing (the header can lead the play list).
3. Band only: `status`, `clock`, scores, 3 update lines. No other embed writes.
4. Halftime: band `status:'half'`, short #34 note + paste-ready social.
5. A wakeup can be lost. Tonight one missed 45 minutes. Every inbox routine tick should also check the score.

**Postgame (final → next morning)**
1. Band: `status:'final'`, records, last scores, **first link = the one game story**.
2. **One game story.** Claim it in #34 *before* writing. Tonight two sessions published two finals 90 seconds apart; the later one was unpublished.
3. Home Code timed pin → game story until 16:00Z next day (a newer Buddy Martin piece still wins).
4. Post-template Next pill → next opponent (time TBA unless ESPN has it).
5. Quotes come from the UF transcript (Scott Burns email) when it lands; never invent them.
6. Stop the score loop. No list email unless Brenden says so for that send.
7. When Brenden says "postgame mode" (Oct. 3, 23:33Z: "remove trackers, remove game day"): set the band's `__GBM_GAMEDAY__.until` to now, add the `gbm-postgame-hide` style to the band embed (it hides `#gbm-live .fp-tunnel, .fp-board` with CSS, so nothing moves), disable the Game Center set, and remove the "Game Center" nav links from the header and footer.

**Back to pregame for the next game:** delete the `gbm-postgame-hide` style, set new `__GBM_GAMEDAY__` data (kickoff, opponent, `until`), re-enable the Game Center set with the new `EV`, and restore the nav link.

## Postgame setup right now (Oct. 3, 23:30Z)

- Band `96ef5a04`: Final 45-17, links → `/post/roberts-runs-away-with-it-no-25-missouri-routs-no-8-florida-45-17` (canonical, Jarvis), halftime report second.
- Pin: Home Code `622d8ece` timed pin → same story until 16:00Z Oct. 4.
- Second story: "Reality Check" `62dcd9c0` (angle piece). Duplicate game story `ee91ccc6` unpublished.
- Next pill: vs. South Carolina, Sat., Oct. 10, Time TBA, Gainesville.
- Off: home tracker `877bdac7`, Chomp `5a7c1f57`, Chant player `513eee8c`, Game Center set (Jarvis). Postgame hide style on the band; Game Center nav links removed.
- Game Center shows the final from ESPN by itself; card `60f89132` (Jarvis) links the story.
- Open: header NEXT strip still needs PR #121 merged plus a working scoreboard refresh. Walk-up photos still need a Media Manager upload.

## Target: three setups, one switch (build before South Carolina)

1. **One game-day config** (one small embed, the only thing anyone edits per game):
   `{event:'401856714', opponent:'South Carolina', home:true, kickoff:'<ISO>', links:[[label,path],...], mode:'auto'}`.
   `mode` is `auto` (from ESPN), or a manual override `pre|live|final|off`.
2. **One renderer** inside the front-page root, with a fixed reserved height. It draws the countdown, live score/field/radio link, or final + game story from ESPN plus the config. It is mounted once and only ever has its text updated in place, and it never inserts or removes nodes after mount. It replaces the hand-written band scores, the Chomp Meter and the home tracker.
3. Game Center, Next pill, Game Graph and header strip all read the same config, so a kickoff change or the next opponent is **one edit, one publish**.
4. During a game: **zero Wix writes**. Postgame: one write, the game story link, which is also the pin.

Until that ships, use the manual checklist above and keep the disabled blocks off.

## Byline rule (Brenden, Oct. 4, 2026)

Never byline a story to Wix member `16433bab` ("GatorBait Staff"): it is a paying subscriber's account. Byline the human who wrote it. If no human wrote it, use Brenden Martin, member `93d9f853-336f-4a8e-bcfa-4c621ff96db9`. Check this on every game story, halftime post and desk draft.
