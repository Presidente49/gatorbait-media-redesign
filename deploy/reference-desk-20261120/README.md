# Reference Desk: schedule and next-opponent roster (Nov. 20, 2026)

Brenden, Nov. 20: "Make sure we have rosters for both teams that are up and visible, make sure we have a schedule that's up and visible. These are standards."

Found that day: the site's `SCORES & SCHEDULE` and `ROSTER` links both land on the roster page, where the roster widget (`deploy/roster-20261102`) hides the native post. No schedule was visible anywhere on the site, and there was no opponent roster.

- **Embed:** Wix custom embed `4e41f692-8f37-4ef5-b2ec-7771f0b29f93`, "GBM - Reference Desk: schedule + next-opponent roster v1" (BODY_END, loadOnce true, category ESSENTIAL). Body: `embed.html` in this folder, copied from the live page.
- **What it does:** only where `#gbm-rosterpage` exists, it adds `#gbm-sched` ("2026 Schedule & Results", record, next game, every game with result or kickoff and TV) above the roster widget and `#gbm-opp` (the next opponent's roster: offense, defense, special teams) below it. `#schedule`, `#roster` and `#gbm-opp` links scroll to the visible blocks.
- **Data:** read in the visitor's browser from ESPN's public JSON (`site.web.api.espn.com`, the host the scores strip already uses): `teams/57/schedule` and `teams/<next opponent>/roster?limit=300` (without the limit ESPN returns only the first 100 players). It follows the schedule on its own, so the opponent roster changes each week without an edit. Schedule refreshes every five minutes while the page is open. AP month and state abbreviations; times Eastern.
- **Rollback:** disable or delete the embed.
- **Native post:** the roster post (`aeb4f5a5`), which the Wix mobile app shows, had its schedule table, record and next-game line brought up to date by hand on Nov. 20 (through the Kentucky result). It does not update on its own; refresh it after each game.
- **Not covered:** the roster widget's injury and availability box is edited separately (see `deploy/roster-20261102/README.md`).
