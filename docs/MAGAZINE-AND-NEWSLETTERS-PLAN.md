# Magazine vs. homepage, and three email lists

Brenden, Oct. 3, 2026 (after Florida at Missouri): the Magazine page should be one large cover. Tap it and the issue opens; keep the template we built today. Make the Magazine more special and more thought out, out once a week at the same time. Newsletters are a different thing. Readers opt in separately to the Magazine, the daily story emails ("Gator Daily News") and a Monday-morning wrap / postgame edition. Monday morning is preferred over Sunday night.

## 1. What lives where

| | Homepage | Magazine page (`/magazine`) |
|---|---|---|
| Job | Daily sports news, newest first, Buddy Martin as editorial lead | One curated weekly issue |
| First screen | Lead story + latest list (unchanged; game-day block only on game days) | **One large cover**: cover image, GatorBait Magazine masthead, issue date and edition, cover line |
| Interaction | Normal story links | Tap or click the cover → the issue opens in place (today's template: cover story, game section, series, keys, lead panel, slate, more, shots) |
| Updates | All day | Once a week; the issue is frozen after publish, apart from corrections |
| Email | Gator Daily News | GatorBait Magazine |

Build notes for the cover gate (Magazine bundle, branch `magazine-2026/auto-refresh`):
- The cover is the default view. It has a fixed aspect-ratio box, so nothing moves while the image loads.
- "Open the issue" expands the existing template below the cover and scrolls to it. Deep link: `/magazine#issue` opens straight into it. No new page and no re-download: the issue is already in the same bundle.
- The cover image is the issue's cover story photo, credited (Chris Spears or UAA), never AI art. Per the Buddy-leads direction, the cover story should be Buddy Martin's piece unless Brenden picks otherwise (this week's cover was Franz Beard).
- Newsletter sign-up blocks move off the Magazine page; one "Get the Magazine by email" line under the cover links to the preference form.
- QA at 320/390/430/1366 with the existing `qa-magazine-pregame.mjs` harness, plus a no-layout-shift check on cover image load.

## 2. Weekly Magazine schedule (recommendation)

- **Friday, 7 a.m. ET**, every week of the season. Today's Friday Pregame issue showed the format works: preview, keys, injuries, columnists, slate.
- Built Thursday, frozen Friday 7 a.m., emailed once to Magazine opt-ins. Postgame material goes in the Monday wrap, not in a Saturday or Sunday Magazine rebuild.

## 3. Three email lists

| List | What | When | Audience |
|---|---|---|---|
| **GatorBait Magazine** | The weekly issue | Friday 7 a.m. ET | Magazine opt-ins |
| **Gator Daily News** | The day's new stories (one digest, not one email per post) | Once daily, evening (e.g. 7 p.m. ET); breaking news can go solo | Daily opt-ins |
| **Monday Morning Wrap** | Postgame edition: result, game story, columns, photos, what's next | Monday 7 a.m. ET | Wrap opt-ins |

Contact labels to create, one per list (none exist yet; current labels are cleanup snapshots plus `e345fa8e` "Email eligible (not a send-all list)"):
- `List - GatorBait Magazine`
- `List - Gator Daily News`
- `List - Monday Morning Wrap`

How readers get on a list:
1. A preference form on the site with three checkboxes, linked from every email footer, the Magazine cover and the homepage. Each box applies its label.
2. One opt-in email to the current eligible audience (`e345fa8e`, cleaned Oct. 1) asking people to pick lists. **Needs Brenden's yes for that send, and the send governor must pass.**
3. Nobody is added to a list without ticking its box. Existing paid Magazine plan holders (`pricingPlans.gatorbait-magazine`, `magazine-annual`, `magazine-monthly`) get the Magazine email by default, with the usual unsubscribe.

**Send governor:** the current cap is 1 email a day and 2 a week across all lists. A daily digest plus the Magazine plus the Monday wrap doesn't fit. Caps need to move to per-list (Daily: 1/day; Magazine: 1/week; Wrap: 1/week; breaking counts against Daily). That is Brenden's call before the first daily send.

**Story Alert automations** (`824714d4`, `5006baf5`): both were inactive as of Sept. 26. The daily digest replaces them; don't re-enable them.

## 4. Order of work

1. Cover-first Magazine page on the Magazine branch, once the current Magazine owner hands the branch and embed `1dd74333` back. QA, then pin the loader.
2. Create the three labels and the preference form, unlinked.
3. Brenden approves per-list caps and the opt-in email copy. Send the opt-in once.
4. First Monday Morning Wrap: Monday, Oct. 5, 7 a.m. ET (Missouri postgame), to Wrap opt-ins only. If nobody has opted in by then, it's a web edition only.
5. First Friday Magazine on the new schedule: Oct. 9, 7 a.m. ET (South Carolina week).
