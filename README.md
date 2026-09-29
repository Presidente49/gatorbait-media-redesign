# GatorBait Media Redesign

ESPN+/Athletic Dark Theme for [gatorbaitmedia.com](https://www.gatorbaitmedia.com)

This repository contains the custom CSS, JavaScript, and documentation for the GatorBait Media website redesign to a dark ESPN+/Athletic-style theme.

## Files

- `custom-css-LIVE.css` - The complete CSS currently live on gatorbaitmedia.com (with header/footer visibility fix)
- `custom-css.css` - Original CSS draft before deployment
- `masterPage.js` - Wix Velo masterPage.js with hero and welcome message functions
- `IMPLEMENTATION-GUIDE.md` - Step-by-step implementation guide for Wix
- `site-preview.html` - HTML preview of the site design
- `wix-site-management-playbook.md` - Wix site management playbook

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary BG | `#1a1a2e` | Page background |
| Secondary BG | `#16213e` | Footer background |
| Card BG | `#1e1e38` | Blog post cards |
| Gators Orange | `#f47521` | Accent/hover color |
| Gators Blue | `#0021a5` | Secondary accent |
| Border | `#2a2a4a` | Card/element borders |
| Text Primary | `#ffffff` | Headings |
| Text Body | `#e0e0e8` | Body text |
| Text Muted | `#a0a0b0` | Metadata |

## Platform

- **Host**: Wix Business/eCommerce
- **Injection**: Wix Dashboard > Settings > Custom Code > Head
- **Entry**: GatorBait Dark Theme v5 (Essential, All Pages)
- **Meta Site ID**: 18fb3a4e-d7f6-414a-aeb9-3047db3ea115

## Codex project context

Before changing the live Wix site, load [`.codex/skills/gatorbait-wix-operator/SKILL.md`](.codex/skills/gatorbait-wix-operator/SKILL.md). Its runbook records the verified production IDs, brand assets, design decisions, mobile constraints and failure patterns from the September 13, 2026 stabilization work.

## Scoreboard feed (`sports-live/scoreboard.json`)

A JSON feed of Florida's season for the front page. It is built from ESPN's public JSON and refreshed by the `scoreboard` job in `.github/workflows/refresh-newsroom-feed.yml` (same 5-minute tick as the newsroom feed, no second scheduler). Nothing here writes to Wix.

- `automation/scoreboard_feed.py` fetches and builds the file. It reads ESPN only when due: hourly, or on every tick from 1 hour before kickoff to 5 hours after. GitHub cron can't tick faster than 5 minutes, so that is the live refresh rate.
- `automation/validate_scoreboard.py` is the schema check. The feed script and the workflow both run it, and a file that fails it is never written or committed.
- Story links (`recapUrl`, `galleryUrl`, `previewUrl`, `storyUrl`) come only from our own posts in `gazette-live/posts.json`, matched by opponent name, keywords and date. They are `https://www.gatorbaitmedia.com/...` or `null`. ESPN and SEC links are never emitted.
- On any ESPN failure the last good file stays in place and the step exits non-zero without failing the job. Front-end code should treat an old `updatedAt` as stale.

Live URL once merged: `https://presidente49.github.io/gatorbait-media-redesign/sports-live/scoreboard.json`

```
{ updatedAt, season, team:{name,rank,record,conf},
  last:{eventId,opponent,opponentRank,home,date,status:"final",score:{fla,opp},quarters:{fla:[..],opp:[..]}|null,venue,recapUrl,galleryUrl},
  next:{eventId,opponent,opponentRank,home,kickoffIso,tv,venue,previewUrl},
  schedule:[{eventId,date,opponent,opponentRank,home,status,score:{fla,opp}|null,tv,storyUrl}],
  standings:[{team,confRecord,overall}],           // SEC, best conference record first
  live: null | {eventId,clock,period,score:{fla,opp},possession:"fla"|"opp"|null,lastPlay} }
```

`status` is `scheduled`, `in-progress`, `final`, `postponed` or `canceled`. `next` is the first game not yet final, so during a game it is the game in progress. `last`, `next` and `live` are `null` when they don't apply. Ranks are AP (1-25) or `null`. For a game with no set time, ESPN sends a placeholder kickoff (04:00Z or 05:00Z); the feed passes it through.

Commands:

```
python -m unittest discover -s automation/tests -p 'test_scoreboard*.py'   # tests, offline
python automation/scoreboard_feed.py --force                                # fetch now
python automation/scoreboard_feed.py --from-dir automation/tests/fixtures/scoreboard   # build from saved ESPN JSON
python automation/validate_scoreboard.py                                    # check the committed file
python automation/scoreboard_import.py OUT_DIR RESULT.json ...              # turn TinyFish fetch results into --from-dir files
```

ESPN endpoints: `site.api.espn.com/apis/site/v2/sports/football/college-football/teams/57/schedule?season=2026&seasontype=2`, `.../summary?event=<id>` and `site.api.espn.com/apis/v2/sports/football/college-football/standings?group=8&season=2026`.
