# Postgame package prep: Florida vs. Georgia, Oct. 31, 2026

Prepared ahead of the final. No live change was made: no Wix write, embed patch, publish, email, social post, automation toggle or homepage change.

| File | What it is |
|---|---|
| `RUNBOOK.md` | Ordered ship steps after the final, commands, who must say yes, rollback per step |
| `STORY-TEMPLATE.md` | Fill-in postgame story in Brenden Martin's voice, rules, headline brainstorm |
| `make-loader.py` | Builds the Magazine embed `1dd74333` body from the live body with a new jsDelivr pin |
| `patch-next-box.mjs` | Lesson 91 Up next patch for `14a887e3` (exits 3 if the NEXT string no longer exists) |
| `check-no-placeholders.mjs` | Release gate for the magazine JSON and the email MJML |
| `qa-georgia-postgame.mjs` | Render QA for the built magazine bundle |
| `../../sports-live/magazine-issue-georgia-postgame.json` | Magazine skeleton (placeholders marked `[[ ]]` and `-1`) |
| `../../newsletter/2026-10-31-postgame-georgia.mjml` | Email draft (not sent, no Wix campaign) |

Build change: `sports-live/build-magazine.mjs` now treats any variant ending in `-postgame` as the postgame skin (output `sports-live/magazine-<variant>.js`). Existing `""`, `postgame` and `georgia` outputs are unchanged (`--check` passes). Generated bundle files are deliberately not committed.
