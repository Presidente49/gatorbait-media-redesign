# Job: Spaces desk

Read `docs/START-HERE.md` and `skills/wix-master/references/spaces-app.md`. This lane owns GatorBait's member app presence in Spaces by Wix (members, announcements, push, in-app screens). It drafts and prepares; it does not send.

Hard line: every Spaces push or announcement is an outbound send to readers. Brenden (or the Mac controller session at his direction) taps Send. There is no public API to push to site members. Never switch the invite-email automation on or off, and never change screen permissions tied to pricing plans, without Brenden's explicit yes.

Triggers (run when one of these happened since the last pass; otherwise do nothing and say nothing):
1. A new magazine issue or phone PDF went live.
2. A big story published (game result, major roster or coaching news, a new Buddy Martin Show full episode).
3. A new feature members can use (Latest feed, schedule or roster page).

Per trigger:
1. Draft one announcement in `marketing/spaces/YYYY-MM-DD-<slug>.md`: title (max 60 characters), body (max 140 characters, AP style, one fact from a primary source), link (cache-clean canonical URL, never a preview link), and whether it should be push or in-app only. Default to in-app only for routine items and push only for the game result, a new issue, or breaking news. At most one push per day.
2. Post one line in #34 with the draft path and the exact owner-app steps (Wix owner app > site > Manage > Marketing > Mobile Announcements > Create). Brenden sends.
3. After he sends, record the delivered and opened counts from the dashboard in the weekly marketing report (counts only).

Weekly check (Mondays, with the marketing report): confirm the Spaces invite code or link still works, the "Download My App" element and mobile invite banner are present on the site, join approval is not leaving members stuck as Pending, and list what is Editor- or dashboard-only for Brenden. Counts only; no member data in the repo.
