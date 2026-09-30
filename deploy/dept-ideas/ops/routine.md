# Proposed Routine: Sunday Ledger (not created)

Per the round-two brief, no trigger was created. This is the `create_trigger` call for Jarvis to make once Brenden says yes. The 6:49 minute keeps it off the hour per the Routine guidance; it runs in the same session as the Jarvis ops loop so the numbers stay in that private chat.

| Field | Value |
|---|---|
| name | `Sunday Ledger (weekly ops report)` |
| cron_expression | `CRON_TZ=America/New_York 49 6 * * 0` (Sundays, 6:49 a.m. ET; the week it reports is the Monday-to-Saturday just ended plus that Sunday's overnight, i.e. `--week-ending` = today) |
| initiation | `human_request` |
| persistent_session_id | Jarvis's session (the one that owns the ops loop and the Morning Money Report), so the real numbers never leave a private chat |
| connectors | `["Windsor.ai", "GitHub"]` only |
| notifications | none (self-bind Routine; Jarvis's Monday scorecard reads it) |

## Prompt

```
Sunday Ledger. Read-only weekly ops report; nothing on the site, the socials or the email account is written. Do not commit any number.

1. Reads (12 total, no more). Windsor.ai get_data, date_from = 13 days ago, date_to = today's Sunday minus 0 days, i.e. the two ISO weeks ending today:
   - googleanalytics4, account 340655495: (a) date, sessions, active_users, newusers, screen_page_views, engaged_sessions, average_engagement_time_per_session; (b) page_path, screen_page_views, sessions for the last 7 days; (c) session_default_channel_group, sessions, engaged_sessions for the last 7 days; (d) devicecategory, sessions for the last 7 days.
   - searchconsole, account sc-domain:gatorbaitmedia.com: (a) date, clicks, impressions, ctr, position; (b) query, clicks, impressions, position for the last 7 days with clicks > 0; (c) page, clicks, impressions, position for the last 7 days with clicks > 0.
   - facebook_organic, all three pages: (a) date, account_name, page_impressions, page_impressions_unique, page_post_engagements, page_video_views, page_views_total; (b) account_name, post_id, post_created_time, post_message_oneline, post_impressions, post_impressions_unique, post_reactions_total, post_clicks for the last 7 days.
   - instagram, all three accounts: (a) date, account_name, reach, views, total_interactions, accounts_engaged; (b) account_name, media_id, timestamp, media_type, media_caption, media_reach, media_views, media_engagement, media_permalink for the last 7 days.
   - mcp__github__actions_list list_workflow_runs for live-presentation-qc.yml, perPage 30.
   Save each raw response verbatim as JSON in the scratchpad: ledger/inputs/ga4-daily.json, ga4-pages.json, ga4-channels.json, ga4-devices.json, gsc-daily.json, gsc-queries.json, gsc-pages.json, fb-pages-daily.json, fb-posts.json, ig-daily.json, ig-media.json (add "counts": posts per account), live-qc.json ({"runs":[...]}). Write ledger/inputs/sources.json with answered/refused per deploy/dept-ideas/ops/SOURCES.md; if a connector refuses, record the exact text and leave its file out. Do not substitute a mockup.

2. Run, from the repo root on main (git fetch first so the week's posts.json snapshots are present):
   node deploy/dept-ideas/ops/ledger.mjs --inputs <scratchpad>/ledger/inputs --out <scratchpad>/ledger --html
   node deploy/dept-ideas/ops/ledger.mjs --inputs <scratchpad>/ledger/inputs --out <scratchpad>/ledger --redact --compact --html

3. Deliver. Paste the Attention section and the Stories/Games lines into this chat for Brenden (numbers are fine here; this chat is private). Put the redacted ledger-<date>-redacted.md on the Control Room hub as a "log" row if the hub is up. Post nothing to #34 except one line: "Sunday Ledger <date> built; N attention items" (no numbers). Never commit the real report or the inputs; the repo and #34 are public.

4. If the ledger's Attention list names a GA4 gap, a Direct-traffic bot pattern, or a failed live-qc run, add it to the Jarvis week plan as an item with an owner. Otherwise end with NOOP.
```

## Why this shape

- One report, one owner, one time. It feeds the Monday scorecard the Morning Money Report already promises, instead of adding a second scheduler.
- Twelve reads is the whole budget: it ran in one session on Sept. 30 with exactly these calls.
- The script, not the model, does the math and the flagging, so the Routine spends tokens on reading and pasting, not on arithmetic.
- The real numbers stay in the private session; the repo only ever holds the redacted sample.
