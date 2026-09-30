# Ask Gator Nation

## The idea

A five-minute AI-run conversation, not a form, where Gators fans tell GatorBait what they are watching for in Missouri week, what they want more of from the site, and the one question they would put to Buddy Martin. It runs on Perspective AI, embeds on the homepage and in GatorBait Weekly, and its themes feed Juice's Friday package and a Wednesday "Ask Gator Nation" segment on The Buddy Martin Show. One local partner, chosen from businesses that already sponsor Gators media, puts its name beside it for the rest of the season.

Round one's Game Week Partner was a CSS mockup of a sponsor tag. It is gone. This is a listening product that produces editorial material every week whether or not a partner is sold, and it gives a partner something fans actually use.

## Why it matters

- GatorBait has no first-party fan research. Editorial calls (more recruiting? more Buddy? more galleries?) are guesses. Ask Gator Nation turns them into weekly evidence with quotes, without a survey form nobody finishes.
- The show gets a standing segment with real fan questions by first name, which is Buddy as editorial lead across homepage, Magazine and show (Brenden's standing direction), with one canonical home and no duplicated articles.
- Timing: Florida is 4-0, No. 8, coming off 52-28 over No. 4 Ole Miss, and plays at No. 25 Missouri on Sat., Oct. 3, 3:30 p.m. ET on ABC (ESPN via `sports-live/scoreboard.json`). Interest is at a season high and eight game weeks remain.
- Partners: the ten prospects in `prospects.md` already buy Gators-adjacent media through Gators Sports Properties, Florida Athletics or ESPN WRUF. They do not need the category explained; they need an inventory unit that is not a banner.
- Data respect: first name and optional email only, no list building without a separate opt-in, no transcripts to partners.

## Evidence

Tool calls made this session, in order:

1. `mcp__Perspective_AI__workspace_get_default`: `workspace_id: null`, `onboarding_url` returned (twice, before and after the usage-limit reset).
2. `mcp__Perspective_AI__agent_template_search` (research agents, sports media fan listening): 26 matches; nearest templates `marketing-focus-group` and `customer-interview`, with live demos. Custom brief used instead.
3. `mcp__Perspective_AI__perspective_create` (research, full brief in `perspective.md` section 3): **refused**, `status: "onboarding_required"`, message: "This account has no workspace yet. Give the user this link to finish setting up … Once they confirm they're done, retry the tool." No perspective ID exists; none is claimed.
4. `mcp__Exa__agent_run`: run ID `agent_run_5835ed8e5a62443483e9977b7162c291`, medium effort, 12 searches, `completed`, `schema_satisfied`; returned 10 businesses with source URLs.
5. `mcp__Exa__web_fetch_exa`: one batched fetch of all 10 source URLs. Nine confirmed on the page text; UF Health's quoted claim did not appear in the fetched excerpt and is flagged. Exa's `website` column was shifted by one row and was corrected by hand.
6. `mcp__Gmail__create_draft`: draft ID `r-1050504623129466129`, message ID `1a0f0be2d0681dc1`, thread `1a0f0be2d0681dc1`, no recipient, not sent. Plain-voice partner note from Brenden.
7. `mcp__Google_Calendar__list_events` (Sept. 30–Oct. 8): calendar readable (owner, America/New_York), no events in the window, so no conflict with a Wednesday segment.
8. `mcp__PostHog__exec` (`call project-get {}`, next listening tool per brief rule 6): **denied** by the auto-mode permission classifier ("Exfil Scouting"). `search survey` succeeded (`survey-create`, `survey-launch`, `surveys-responses-list` exist). Not pursued further; a denial is not to be worked around.

Files: `perspective.md` (refusal record, onboarding link, verbatim brief, four-call runbook, insight flow), `prospects.md` (10 cited prospects), `preview.html` (real outputs only: brief, draft ID, prospect table, onboarding link).

## What it needs from Brenden

1. Sign in once at the Perspective onboarding link in `perspective.md` (about two minutes). Then say "done" and the four calls in `perspective.md` section 2 produce the live interview, the preview link and the embed snippets; no further design work.
2. Approve the Wednesday "Ask Gator Nation" segment with Buddy (two or three fan questions by first name).
3. Authorize, through Master Control, the homepage widget placement (a single embed div below The Road Ahead; the homepage look is locked, so this is an additive module, not a redesign) and the newsletter card.
4. Address and send, or edit, Gmail draft `r-1050504623129466129`; start with Meldon Law or the Gainesville/Ocala BMW Dealers per the fit ranking.
5. Decide the label wording: "Ask Gator Nation, with [Partner]" is the recommendation.

## Risks

- Perspective quota: real conversations count toward the workspace plan; preview conversations do not. Check the plan after onboarding before the newsletter link goes out.
- Low response in week one: the segment still runs on whatever comes in; three good questions are enough for air.
- Privacy drift: a partner will ask for the emails. The answer is no; the weekly theme summary is the deliverable, stated in the agreement.
- Editorial independence: the partner's name sits beside the module, never inside the questions or the show answers.
- Homepage lock: the widget is additive and must be approved as a production edit; it ships behind a config flag so nothing renders until approved.
- Prospect freshness: two entries (Davis Automotive, 2017; Gator Collective, 2022) need a current-status check before contact; UF Health's claim is unconfirmed.
- The Gmail draft says the module is opening "this week." If onboarding slips past Missouri week, change it to South Carolina week (Oct. 10) before sending.
