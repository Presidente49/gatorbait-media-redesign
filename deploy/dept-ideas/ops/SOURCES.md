# Sunday Ledger: which connectors answered, which refused

Checked Sept. 30, 2026, from the Claude Code cloud container, read-only. The report itself (real numbers) lives outside the repo; this file records only who answered.

## Answered

| Connector | Tool | Account or object | Reads | What it gave the ledger |
|---|---|---|---|---|
| Windsor.ai | `mcp__Windsor_ai__get_connectors`, `get_fields`, `get_data` | GA4 property 340655495 (GatorBaitMedia) | 4 | daily sessions/users/views/engaged Sept. 14–27, top pages, channels, devices |
| Windsor.ai | `get_data` | Search Console `sc-domain:gatorbaitmedia.com` | 3 | daily clicks/impressions/CTR/position, top queries, top pages |
| Windsor.ai | `get_data` | Facebook Pages 192930054063033 (Gator Bait Media), 164984480218367 (The Buddy Martin Show), 101360751735365 (Best Fridays in Football) | 2 | page impressions/reach/engagements/video views per day; posts with impressions and reactions |
| Windsor.ai | `get_data` | Instagram 17841444573395911 (gatorbaitmedia), 17841400514891638 (thebuddymartinshow), 17841443053640107 (thebestfridaysinfootball) | 2 | daily reach/views/interactions; media with reach, views, engagement |
| GitHub | `mcp__github__actions_list` (list_workflow_runs, `live-presentation-qc.yml`) | Presidente49/gatorbait-media-redesign | 1 | newest five runs; latest #144 success on f5f8e63 |
| Repo | `gazette-live/posts.json` + `git log` snapshots (19 commits in the week) | — | 0 | 39 stories in the window, by author |
| Repo | `sports-live/scoreboard.json` (ESPN) | — | 0 | Florida 52, Ole Miss 28; next: at Missouri |

Windsor.ai field discovery was needed first because guessed GA4 field IDs (`totalUsers`, `screenPageViews`, …) do not exist there; the real IDs are `active_users`, `newusers`, `screen_page_views`, `engaged_sessions`, `session_default_channel_group`, `devicecategory`, `page_path`.

## Refused or empty (exact text)

| Connector | Tool | Response |
|---|---|---|
| Metricool | `mcp__Metricool_Social_Media_Management__getBrandSettings` | `This brand doesn't have any social network connected yet. Ask the user to connect at least one network before continuing here: https://app.metricool.com/brands/connections?blogId=6946016` |
| Supermetrics | `mcp__Supermetrics_Marketing_Analytics__data_source_discovery` (filter `analytics,social`) | every relevant source carries `authentication_status: NOT_AUTHENTICATED`: `GAWA` Google Analytics, `FB` Facebook Insights, `IGI` Instagram Insights, `YT2` YouTube, `LIP`, `TIKBA`, … |
| Supermetrics | `data_source_discovery` (`search console`) | `id: GW … authentication_status: NOT_AUTHENTICATED` with `login_note: You need to log in with this link before using this data source.` (a one-time login link was returned; not recorded here) |
| PostHog | `mcp__PostHog__exec` `call project-get {}` | project `601216` "Default project": `ingested_event: false`, `completed_snippet_onboarding: false`, `app_urls[0]:` empty. No snippet on gatorbaitmedia.com, so no query was run. |
| Google Drive | `mcp__Google_Drive__search_files` (`title contains 'GatorBait' … and (analytics|weekly|report|ledger)`) | `{}` (no matching files) |
| Claude Code Remote | `mcp__Claude_Code_Remote__list_triggers` (read only) | answered: 15 Routines listed, none named a weekly report. No trigger was created. |

## Not reachable at all

- YouTube: Metricool has no network connected, Supermetrics `YT2` is not authenticated, and Windsor.ai lists no `youtube` account. vidIQ is on the account but outside the ops tool list for this round; it is the obvious next read path for The Buddy Martin Show channel.
- Restream MCP and wix-mcp-remote fail to connect from this container (proxy 403), per TOOLS.md. Not needed for the ledger.

## Reads per run, going forward

11 Windsor reads (4 GA4, 3 Search Console, 2 Facebook, 2 Instagram) and 1 GitHub Actions read. Everything else is repo files and `git log`. No writes anywhere.
