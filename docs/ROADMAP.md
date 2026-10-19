# GatorBait Media roadmap (Oct. 19, 2026)

One page so nobody gets confused. Owner: Brenden Martin. Two workers take turns (Jarvis/Claude and Codex); see `docs/handoffs/codex-20261019.md`. Items marked PROPOSED are our recommendation, not yet approved by Brenden.

## 1. Magazine: how every issue gets made (same steps every time)
The magazine is a custom embed (`1dd74333`) that reads an issue file. Three issue types already exist in `sports-live/`: pregame (`magazine-issue-pregame.json`), postgame (`magazine-issue-postgame.json`) and midweek (`magazine-issue-wednesday.json`). Print PDFs and the phone PDF come from the same content.

1. **Content:** stories are existing published posts (stats only from ESPN or FloridaGators.com). Fact check before anything is built.
2. **Cover:** portrait 1200x1600, Oct. 9 style (Franz's Soothsayer cover) and the Oct. 18 postgame cover are the models. One strong, correct, credited photo; Barlow only; navy, UF orange, white, Gator green #22884C. Save to `deploy/<name>-<date>/`.
3. **Build:** `sports-live/build-magazine.mjs` (`MAG_VARIANT=postgame` for the postgame edition), then the QA script. Bundle must stay under 204,800 bytes.
4. **PDFs:** print PDF plus the phone-first PDF (390x844 pt, one column, 17 pt text, about 2.4 MB). Both uploaded to the Wix Media Manager; the Download button shows the phone PDF first and the print PDF second.
5. **Go live:** guarded in-place patch of embed `1dd74333` (current revision, ESSENTIAL re-sent, fingerprint check, no site publish). Save the rollback file first.
6. **QC:** Chromium at 1366, 1920, 390, 430 with a cache-busting URL. Brenden checks a real iPhone.
7. **Announce:** Spaces announcement draft (Brenden sends it from the Wix owner app) and, only with his explicit yes, a cover email. Email limits: 1 list email per 24 hours, 7 per week.
8. **Record:** one line in GitHub issue #34 with the rollback.

## 2. Magazine calendar (PROPOSED, built around the schedule)
| When | Issue | Notes |
|---|---|---|
| Done Oct. 18 | Postgame: Florida 27, No. 7 Texas 24 | Live. Phone PDF live. Cover email already sent (463 delivered). |
| Oct. 24 (open date) | No issue | Use the bye week to finish the template and covers for Georgia week. |
| Oct. 29-30 | Georgia Week pregame | Georgia Oct. 31, 3:30 p.m. ET, ABC, Mercedes-Benz Stadium in Atlanta. Georgia is No. 5 in the Oct. 18 AP poll. Cover: new portrait, Oct. 9 style. |
| Nov. 1 | Georgia postgame | Same steps; cover from the game. |
| Then | Alternate pregame (Thursday) and postgame (Sunday) on game weeks; one midweek issue only if there is news | Revisit after Georgia with open and click numbers. |

## 3. Covers (the thumbnails and the magazine front)
- Every post and every issue needs a correct, relevant, credited cover. No recycled covers, no Gator Country images, nothing under about 1200 px wide.
- Credits per `docs/PHOTO-ATTRIBUTION.md` (UAA photos; Chris Spears's own photos; Apple TV+ for the Ted Lasso still).
- Alt text on every image.
- Next covers needed: Georgia Week pregame (portrait), Georgia postgame, and thumbnails for new posts. Chris Spears's Baylor column is waiting on his photos.

## 4. Site (what is live and what is waiting)
- Live: homepage colors, magazine, Latest news pages, inner-page navy first paint, phone PDF.
- Waiting on Brenden's go (Editor plus site publish at a quiet moment): soft email signup with confirmation (PR #371), removing the native /magazine body (about 25-30% lighter), dropping four redirected pages from the sitemap, Contact and Policies corrections, header logo second H1.
- Fix next: the Florida stats feed (404; fix PR requested), the membership page placeholder text, one real-iPhone check of the phone PDF and the magazine bar.

## 5. Newsroom
Writers: Franz Beard, Buddy Martin, Loren Meadows, Eddie Gilley, Chris Spears. Rules: copy-desk fixes only, never rewrite a voice, facts from ESPN or FloridaGators.com, newest first and never pinned. Hourly routines are paused to save money; run a fact pass about every 3 hours while active.

## 6. Money (Brenden decides every item)
- Memberships (All Access, free trial): recommendation is no hard paywall yet; run the free email signup for a week and decide with numbers.
- Also on file: YouTube and the Buddy Martin Show, merch through Baker's Sporting Goods, AdSense, the email list.
- Open ask: a one-page summary of list size, plan signups and YouTube numbers.

## 7. Working rhythm (to keep costs down)
One worker at a time, in blocks of 12-24 hours; Brenden says "handoff" to switch. Work in batches, no polling, silent when nothing changed, two or three helpers at most. Each block ends with a return note (`docs/handoffs/RETURN-TEMPLATE.md`).

## Never without Brenden's explicit yes
Subscriber emails, automations on or off, payments and memberships, DNS, Meta or Google account connections, deleting live content, site publish, anything that materially changes the approved homepage.
