# Ask Buddy

## The idea

A fan question line for The Buddy Martin Show that runs on Wix Forms plus a moderation pipeline that already works in this repo. Fans type a handle and one question on the site (no email, no account). Before each show (Mon., Wed., Thu., 9 p.m. ET) an editor runs `node deploy/dept-ideas/fans/ask-buddy.mjs`, which pulls the form submissions, folds duplicates, holds anything with profanity, personal data or no on-air consent, ranks the rest by relevance to the next opponent (ESPN via `sports-live/scoreboard.json`) and the newest stories (`gazette-live/posts.json`), and writes a ranked show sheet (Markdown and HTML) plus JSON payloads for the site and the show graphics. The score-picks half (Make the Call) is the web director's Worker; this is the other half, and it does not overlap.

## Why it matters

- The show gets a producer it does not have. Tonight's sample run turned 16 raw entries into seven air-ready questions in ranked order, each with the GatorBait story it ties to, in under a second. The top three on the sample sheet are about Missouri's front against Jadan Baugh, Vernell Brown III's PCL sprain, and whether Trautwein's line holds up at Texas and Georgia, which is the week's editorial spine.
- It keeps Buddy the editorial lead (Brenden's standing direction) without asking him to do anything new: the questions come to him, sorted, with links to the columns they are reacting to.
- It fulfills a promise the site already makes. The live pricing plans read by the community director include "Monthly AMA with Buddy Martin" on GatorBait Gold and "Subscriber chat room" on All Access (`deploy/dept-ideas/community/evidence/plans.json`, prices stripped). Ask Buddy is the intake for that AMA and gives the Gold VIP Lounge group (the Porch, `a6400ba5-8553-44a6-b627-c8cb3377c171`) a monthly event to post around.
- Reading a handle on air three nights a week is a free, repeatable reason to say the site's name on YouTube and Facebook, and the answered-question card links back to one canonical story URL.
- Every held item is a privacy incident that did not happen: the pipeline stripped a phone number, an email address and a profanity from the sample before a human ever saw the list.

## Evidence

Tool calls made (all read-only, no writes):

1. `mcp__Wix__SearchWixRESTDocumentation` ("query form submissions by namespace, list forms" and "list data collections and query data items") returned the Forms v4 and Wix Data v2 methods: `POST /form-submission-service/v4/submissions/namespace/query`, `GET /form-schema-service/v4/forms`, `GET /wix-data/v2/collections`, `POST /wix-data/v2/items/query`.
2. `mcp__Wix__ReadFullDocsMethodSchema` on QuerySubmissionsByNamespace: submission shape is `id, formId, namespace, status (PENDING|CONFIRMED|...), submissions{target: value}, createdDate, updatedDate, revision, submitter{visitorId|memberId}, seen`; filterable on `formId`, `namespace`, `status`, `createdDate`, `seen`. `submissions.sample.json` follows that shape exactly.
3. `mcp__Wix__ExecuteWixAPI` (site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`, `hasMutations: false`): List Forms in `wix.form_app.form` returned one form, "GatorBait Email List" (`6babfee8-147f-428a-9e14-6b72f6225835`, targets `email_gatorbait`, `subscribe_gatorbait`), which is an email list and out of bounds for this project. List Data Collections returned 39 collections. None holds fan questions. Two are relevant: `BuddyMartinShow` (native; `episodeTitle, description, liveDate, liveTime, thumbnail, isLive, videoUrl`), where an answered question can be linked to its episode, and `Forms/stripsContact02` ("Enter Contest": `name, email, subject, message`), which has a message field but collects email and was rejected for that reason. No submissions were queried; no subscriber data was read.
4. Local build and test: `node ask-buddy.mjs --self-test` passes 18 assertions (dedupe, held reasons, ranking, AP dates, no leaked email or phone). `node ask-buddy.mjs --now 2026-09-30T14:00:00Z` wrote `show-sheet.md`, `show-sheet.html`, `queue.json`, `flagged.json`, `stats.json`: 16 in, 2 duplicates folded, 7 ready, 2 to review, 5 held. `preview.html` is the HTML show sheet from that run.

Wix limits that shape the design: the Form Submission API works only with the Wix Forms app, requires a namespace filter on every query, and returns at most 100 submissions per page (cursor paging). The `wix.form_app.form` namespace records submissions as `CONFIRMED` immediately, so no confirm step is needed.

## What it needs from Brenden

1. Approve one new Wix Form named "Ask Buddy" in the Wix Forms app with four fields and targets `handle` (text, 3 to 18 characters), `question` (paragraph, 280 max), `topic` (choice: Missouri, Poll, Injuries, Road ahead, Other) and `okToReadOnAir` (checkbox). No email field. Creating it is a Jarvis write under issue #34 scope; this department did not create it.
2. Where it lives: the Magazine or a /ask-buddy page via the existing embed pattern, and a one-line link under The Road Ahead on the homepage only if approved separately under `docs/HOMEPAGE-BASELINE-LOCK.md`. The form can ship without touching the front page.
3. Authorize the fetch step: one read of the form's submissions (the documented query above) before each show, run by the editor or as a proposed Routine (`CRON_TZ=America/New_York 0 19 * * 1,3,4`, prompt: run `ask-buddy.mjs` against the latest export and attach `show-sheet.md` to the show prep). No trigger was created.
4. Pick the on-air count (the sheet defaults to eight) and the banned-word list; the current list is a small default in the script.
5. Say whether Gold members' questions should be tagged for the monthly AMA; that needs `submitter.memberId` matched against plan holders, which is a separate, member-scoped read.

## Risks

- **No form exists yet.** Until the "Ask Buddy" form is created, the pipeline runs only on the sample fixture. That step is a write and is not this department's to make.
- **Handles are visible.** A handle is read on air and may appear on the site, so the banned-word check on handles must exist before launch; the script rejects malformed handles now and holds profanity in questions, not yet in handles as a separate rule.
- **Ranking is keyword-based.** It rewards questions that echo the feed's words and can miss a good question in unusual phrasing; the editor still reads the review pile.
- **Volume is unknown.** Under 100 questions a week fits one page; above it, the fetch must page by cursor, which the script's comment documents but the fetch step does not yet exist.
- **Dedupe threshold.** Containment at 0.6 with five-plus keywords folded the two Vernell Brown questions correctly and kept "Go Gators!!" separate, but real traffic will need a look at the threshold after the first week.
- **The AMA promise is marketing copy.** The community evidence notes no verified chat or forum delivery; Ask Buddy is an intake, not proof the AMA is being held.
