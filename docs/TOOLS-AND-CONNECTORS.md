# Tools, connectors and routines (assessed Nov. 8, 2026)

Read-only assessment by Jarvis. Update this file when a connection changes. Do not store keys here.

## Use first
| Need | Use | Notes |
| --- | --- | --- |
| Site content, embeds, redirects, media | Wix connector (ExecuteWixAPI, docs tools) | Embeds list pages at 50: page with `paging.limit=100` and the cursor (the site has 90 embeds). Drafts have no revision field. |
| Code, PRs, CI, #34 log | GitHub connector | No `gh` CLI in the cloud session. |
| Mail, files, calendar | Gmail, Google Drive, Calendar | Gmail is read and draft only for routines; no subscriber sends without Brenden's yes. |
| Stats | ESPN JSON via `curl`, FloridaGators.com via Exa fetch, College Football Data (free key) | Reconcile team totals to the box score before publishing. |
| Search performance | Windsor connector, Search Console for gatorbaitmedia.com | Connected. Pull pages and queries by date range. |
| Web reading | Exa fetch, WebSearch, WebFetch, Playwright Chromium | gatorbaitmedia.com and ESPN may be blocked by the container proxy for some tools. |
| YouTube data | vidIQ | Linked channel is "Brenden Martin" (@brendenmartin-er3ds), not yet The Buddy Martin Show. |

## Do not use, or limited
| Tool | State |
| --- | --- |
| Firecrawl | Banned by Brenden (paid, credits exhausted). |
| TinyFish | Avoid (low wallet, owner direction Oct. 29). |
| OpenRush | No connections; out of credits for audits. |
| Metricool | Only a Facebook brand called "Divorce Club"; no GatorBait accounts. Social goes through Muse/Marlowe. |
| Supermetrics | Every data source unauthenticated. |
| OpusClip | Needs a Pro plan for the connector. |
| Canva, Figma, Adobe | Final artwork comes from regular ChatGPT Pro per the art rule; use for mockups only. |
| Editor tools (`wix-editor-local`) | Mac-only; unavailable in the cloud session. Pages can only be created in the Wix Editor. |

## Routines (enabled, all fire into the Jarvis session)
- Newsroom desk (Stack v2), about every two hours 6 a.m. to 10 p.m. ET.
- Fact desk, hourly 7:40 a.m. to 10:40 p.m. ET.
- SEC and trending desk, daily 7:17 a.m. ET.
- Storyline scout, daily 3:47 p.m. ET.
- Buddy Martin Show live post, Mon-Thu 8:58 p.m. ET.
- Lisa Lancaster lifetime-comp reminder, one shot in Oct. 2027.
Names now match their schedules. Prompts carry the Nov. 8 facts, the photo rules and the no-Firecrawl line; refresh the "known as of" facts after every game.

## Skills
Reusable newsroom skills live in `skills/` (writer, editorial, intake, publication QC, muse handoff, master control, wix master). A football-analyst skill is being built; see the season-feature work.
