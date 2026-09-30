# Ask Gator Nation — Perspective AI record

Date: 2026-09-30. Department: Outreach (round two). Nothing here is a mockup; every ID and URL below came back from a tool call in this session, and anything that does not exist yet is labeled as such.

## 1. Status: blocked at account onboarding, not at the tool

| Call | Result |
|---|---|
| `mcp__Perspective_AI__workspace_get_default` (twice, before and after the coordinator's usage-limit reset) | `workspace_id: null`, `onboarding_url` returned. The Perspective account for brenden@gatorbaitmedia.com has no workspace yet. |
| `mcp__Perspective_AI__agent_template_search` (query: sports media fan listening interview; agent_type research) | 26 matches. Closest fits: `marketing-focus-group` (live demo https://getperspective.ai/interview/SmmC8DrR) and `customer-interview` (live demo https://getperspective.ai/interview/Xsud61wv). Neither was used as the base; the brief below is custom. |
| `mcp__Perspective_AI__perspective_create` (agent_context `research`, description in section 3) | `status: "onboarding_required"`. Exact message: "This account has no workspace yet. Give the user this link to finish setting up: [onboarding_url]. Once they confirm they're done, retry the tool — the workspace will exist by then." |

No perspective ID, preview link or embed snippet exists yet. None is invented here.

**Onboarding link (Brenden, one sign-in, about two minutes):**

https://getperspective.ai/signin?callbackUrl=https%3A%2F%2Fgetperspective.ai%2Fresearch%2Fwelcome%3Finvite%3Dfalse%26discover%3Dfalse%26callbackUrl%3Dhttps%253A%252F%252Fgetperspective.ai%252Fresearch%26login_hint%3Dbrenden%2540gatorbaitmedia.com&login_hint=brenden%40gatorbaitmedia.com

## 2. What happens the moment onboarding is done (four calls, no design work left)

1. `perspective_create` with the exact description in section 3 (`agent_context: "research"`). Returns `job_id`.
2. `perspective_await_job` on that `job_id` until `ready`. Returns `perspective_id`, share URL, direct URL, outline.
3. `perspective_get_preview_link` → stable preview URL (preview conversations do not count toward quota; use it for Brenden and Buddy to test).
4. `perspective_get_embed_options` → `share_url`, `direct_url`, and ready-made snippets: `widget` (for the homepage module), `card` (for the newsletter), `popup`/`float` (site-wide button). Share links accept `name`, `email`, `returnUrl` and tracking keys (`source`, `campaign`), so the newsletter link is `share_url?source=newsletter&campaign=missouri-week` and the site link is `?source=homepage`.

Then fill this table and paste the `widget` and `card` snippets below it:

| Field | Value |
|---|---|
| workspace_id | pending onboarding |
| perspective_id | pending |
| preview_url | pending |
| share_url | pending |
| widget snippet | pending |
| card snippet | pending |

## 3. The interview brief actually sent to `perspective_create` (reuse verbatim)

> "Ask Gator Nation" — a short, respectful listening interview for readers of GatorBait Media (gatorbaitmedia.com), an independent Florida Gators sports-news site with columnist Buddy Martin and The Buddy Martin Show. Audience: Florida Gators football fans. Context: Florida is 4-0 and ranked No. 8 after beating No. 4 Ole Miss 52-28, and plays at No. 25 Missouri on Saturday, Oct. 3 (3:30 p.m. ET, ABC). Goals: (1) hear what fans think about Missouri game week: their biggest worry, the matchup they are watching, their confidence; (2) learn what they want more of from GatorBait: game previews, postgame analysis, recruiting, Buddy Martin's columns, the show, photo galleries, the newsletter; (3) surface one question they would ask Buddy Martin on the show. Keep it to 5 to 7 minutes, conversational, warm, no hype. Collect only a first name and an optional email at the end (for a reply from the newsroom), nothing else; no phone, address, age or other personal data. Tone: plain, curious, respectful of the fan's time. Output should give the editorial team themes, quotes, and the fan's question for the show.

Facts in the brief come from `sports-live/scoreboard.json` (ESPN, updated 2026-09-29T02:17:33Z).

## 4. Data rules (fixed, not negotiable by the sponsor)

- First name and optional email only. No phone, age, address, or account linkage.
- The email is used for one purpose: a reply from the newsroom or a show mention. It is not added to GatorBait Weekly without a separate, explicit opt-in.
- The interview is labeled as GatorBait's; a partner name sits beside it ("with [Partner]"), never inside the questions.
- Transcripts stay in the Perspective workspace; only themes and short quotes leave it.

## 5. How insights flow to Juice (editorial) and The Buddy Martin Show

Weekly loop, Missouri week as the first run:

| When | Who | What | Tool |
|---|---|---|---|
| Sun. evening | Agency | Post the share link on the homepage module and in GatorBait Weekly with `source=` tags | Perspective embed (`widget`, `card`) |
| Mon.–Wed. | Fans | 5–7 minute conversations | Perspective interviewer |
| Wed. noon | Agency | Pull themes and the top three fan questions | `read_insights`, `conversations_data_analysis`, `perspective_get_stats` |
| Wed. show (9 p.m. ET) | Buddy | "Ask Gator Nation" segment: reads two or three fan questions by first name, answers on air | show rundown |
| Thu. | Juice | One item in the Friday package: "What Gator Nation told us this week" (themes + two quotes), plus any story idea the themes surface (e.g., fans asking for more recruiting coverage becomes an assignment, not a guess) | editorial package |
| Fri. | Agency | Partner gets the same one-paragraph theme summary; no transcripts, no emails | email |

Optional automation once live: `automation_create` to forward each completed conversation summary to a Slack channel or email for Juice; not created in round two per the brief.

## 6. Other listening tools tried this session (per brief rule 6)

- PostHog `exec` `call project-get {}`: denied by the Claude Code auto-mode permission classifier ("Exfil Scouting"). PostHog `exec` `search survey` did succeed (tools `survey-create`, `survey-launch`, `surveys-responses-list` exist), but no survey was created because the project read was refused and working around a denial is not allowed. Left for Brenden.
- Cloudflare Worker/D1 form: not attempted; it would duplicate the Fans department's Make the Call backend and the brief says one idea per department.
