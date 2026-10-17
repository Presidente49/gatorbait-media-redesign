# Broadcast rollout: every page in the network design

> **Current owner direction — Oct. 17, 2026, active design session.** White editorial pages, dark readable text and stronger Gator Orange (`#fa4616`). The recovered Thursday Buddy Martin Show thumbnail informs compact dimensional mastheads, framed photography and layered orange/blue accents. The owner explicitly rejected both the prior Swamp Night result and an overly blue first prototype. Use the existing Gazette content renderer and live game/feed engines, newest-first story chronology and a complete current pregame collection. No saved Sports artifact was selected. Source and release evidence: `deploy/broadcast-network-20261017/`; scoped authorization: [issue #34](https://github.com/Presidente49/gatorbait-media-redesign/issues/34#issuecomment-6235084960). Prior palette notices below are superseded.

> **Palette superseded Oct. 17 by Swamp Night.** [Brenden's later direction in #34](https://github.com/Presidente49/gatorbait-media-redesign/issues/34#issuecomment-6230312104) replaces the Broadcast look below. Retain the object ownership, guarded-write and verification mechanics; use the current notice in `NETWORK-DESIGN-SYSTEM.md` for color and chrome. Do not reintroduce bright-blue slabs or slashed bugs from this historical rollout.

Brenden, Oct. 17, 2026 (about 02:40Z): "Install the artifact GatorBait homepage Look Book" and "work in sessions and make every page of the entire website in this design." Earlier the same night: "I wanna be run like a Network."

**The design** is the **Broadcast** direction of the homepage look book, read together with the network design system:

- `docs/design/lookbook/homepage-lookbook-2026-09-28.html`: the full look book (open it in a browser; Broadcast is section 01, desktop 1440 and phone 390). The stories in it are Sept. 28 placeholders; never copy its copy, scores or photos.
- `docs/design/lookbook/broadcast-direction.css` and `broadcast-direction-markup.html`: the Broadcast CSS and markup pulled out for reference. Class names are the mock's, not production selectors.
- `docs/design/NETWORK-DESIGN-SYSTEM.md`: tokens (`--gb-*`), chrome type, orange slab, neon rail, Barlow-only type. Where the look book and this doc differ, the look book wins for layout and the doc wins for tokens.
- Already live in this design: the magazine (`/magazine`, embed `1dd74333`).

What "Broadcast" means on every page: the deep-blue set background, the orange bug and ticker strip, italic Barlow Condensed display type in uppercase, skewed or chamfered orange buttons and tags, white "next up" bars with an orange tag, slashed photo edges, the neon orange rail under section heads, and the scoreboard treatment for game data. Content, feeds, links, ads, analytics and SEO stay exactly as they are.

## Who owns what (one writer per object)

| Session | Pages | Wix embeds it may write | Do not touch |
|---|---|---|---|
| **S1 Homepage** | `/` | `622d8ece` Home Code, `1255a4cf` Home Styles, `fdc2127a` Sports Home core, `0c13f955` Mobile rhythm | `96ef5a04` (game-day band, owned by the game-day desk session), `1261f2b9` (JSON-LD) |
| **S2 News and sections** | All News `/gatorbait-media-blogs`, category hubs, `/latest` and section pages | `602fb362` Sports Feed Cards, `53e15504` Latest page, `c4b41f6a` Section nav | everything else |
| **S3 Story pages** | every `/post/...` article page | `14a887e3` Post template, `c91ad133` Post normalizer, `a5452619` Post wide canvas, `f285a38c` Share | `4d3ab24a` News SEO, `5ab10e7b` FB pixel |
| **S4 Site shell and other pages** | header and footer on every page; About, The Buddy Martin Show, TV, Shop, membership and pricing, policies, roster and schedule, every page not listed above | `7fee4de6` Header, `c66d5b7f` Light Theme, `a13b04e3` Inner Page UI layer, `5a43ae83` Site Fixer, `82c4ca83` TV + News Images, `360c9265` Roster and schedule links | analytics, ads, consent embeds |
| Jarvis (controller) | `/magazine` (done), coordination | `1dd74333` | |
| Stats session `session_01VBFmjVNZX8NsWmQ9LgZ5gB` | `/florida-football-stats` | `756655cf` | |
| Game-day desk `session_01WPrfyiDi3ySUA7EuZTPJVf` | homepage game-day band | `96ef5a04` | |

S4 owns the header for the whole site. S1 to S3 may style their own page content but never the shared header, footer or theme; ask S4 through #34 if a page needs a shell change. If an embed you need is not in your row, stop and post in #34; do not write it.

## Game-day freeze

Florida plays at No. 7 Texas at noon ET on Saturday, Oct. 17. **No live Wix writes from 14:00Z to 22:30Z on Oct. 17** (10 a.m. to 6:30 p.m. ET). Build, test and open PRs during the freeze; go live before it starts or after it ends. A rollback is always allowed.

## Rules for every live write

Read `docs/START-HERE.md` and `CLAUDE.md` first. Then:

1. **Scope first.** Post one comment in issue #34 headed `Broadcast S<n> · scope` with the embeds, the change, the planned revision bump and the rollback, before the first live write. Check #34 for anyone else on the same object.
2. **Save the rollback.** GET the live embed, save its exact HTML to `deploy/broadcast-2026/<embed-id-8>/rev<N>.html` in your PR.
3. **Build in the repo**, test with Playwright at 320, 390, 430 and 1366 px (no horizontal scroll, text contrast AA, Barlow only, tap targets at least 44 px), open a PR, and merge when render-qc steps 5 to 7 pass (step 8 "Render and audit production" is the known live-site red).
4. **PATCH in place**: GET the embed, check the djb2 fingerprint (`h = 5381; h = ((h << 5) + h + code) | 0` per character; hex of `h >>> 0`) against what you read, keep it under 15,000 characters, PATCH with the current `revision` and re-send `embedData.category` (the API rejects the PATCH without it). **No site publish.**
5. **Verify live** with the `live-shots.yml` workflow (inputs `path`, `selector`, `widths`; results land on branch `qa/live-shots`), including a cache-busting query string.
6. **Record** one comment in #34 headed `Broadcast S<n> · live` with revisions, fingerprints, the live-shots run id and the one-step rollback.

Never: subscriber email, automations on or off, payments, DNS, Meta or Google connections, deleting live content, site publish, changing story text, headlines, feeds, ad slots, analytics or SEO tags. AP style for any label you write. Bounded retries; if a live check goes red, roll back first and diagnose second.

## Order and done

Each session finishes its own pages end to end. Done means: every page in your row matches the Broadcast direction at 320, 390, 430 and 1366 px, live-verified, with rollback files in the repo and a `Broadcast S<n> · done` comment in #34 that lists each page and its live-shots run.
