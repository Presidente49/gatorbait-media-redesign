# Job: newsroom-desk

Runs hourly 6:20 a.m. to 11:20 p.m. ET (the Franz Thoughts-of-the-Day job only on weekday mornings 6-11 a.m.). Run every section below in order. A section that finds nothing stays silent. Rules are in `docs/START-HERE.md`; where a section below still names an older rule (for example a pinned lead writer or Missouri week), START-HERE wins.

The sections below are the job specifications carried over verbatim from the retired routines (retired Oct. 9-10, 2026, `docs/STACK-V2.md`). Edit this file, not the routine prompt, to change the job.

---

## Hourly copy desk

Old routine: `trig_019J7WB6KNvin4Swma9ut7KM` (Jarvis: hourly copy desk (writer-published posts))

Hourly copy desk. Brenden, Sept. 30: writers (Buddy Martin especially) publish their own posts and the formatting comes out wrong; fix it without being asked. Oct. 1: "You gotta fix it. You make all the decisions." Oct. 4: writing must not read as AI; use real rich formatting. This is delegated routine editorial work. Jarvis decides and fixes; don't ask.

**STANDING RULE on Gator Country (Brenden, Oct. 7): never cite, name, quote, link or credit Gator Country in anything we publish (posts, captions, emails, social). They are a competitor. You MAY read them as a reference and a tip source, but any fact or quote must be confirmed from a primary source (ESPN, FloridaGators.com, school releases, a full transcript) and then credited to that source in our own words. If you cannot confirm it elsewhere, leave it out. Scan every post you touch and remove any Gator Country mention.**

**House voice.** Read tools/voice/HOUSE-VOICE.md (branch jarvis/house-voice-checker, PR #129, or main once merged). Run tools/voice/gb_voice.py on every story Jarvis or an agent wrote before it publishes. For writer-published posts, change only what the copy rules below say; never rewrite a writer's voice.

**1. Find new posts.** On Wix site 18fb3a4e-d7f6-414a-aeb9-3047db3ea115, query blog posts (POST /blog/v3/posts/query, sort lastPublishedDate DESC, limit 10).
- Take every post whose firstPublishedDate or lastPublishedDate falls in the last 70 minutes and isn't in scratchpad/copy-desk/seen.json.
- Ignore posts whose only recent change is Jarvis's own.

**2. Fix each post.** GET the draft post with RICH_CONTENT and skip it if hasUnpublishedChanges is true. Otherwise make all of these fixes in ONE PATCH /blog/v3/draft-posts/{id} with action UPDATE_PUBLISH and a fieldmask:
- **Bold paragraphs:** remove BOLD from body paragraphs that are entirely bold after the byline or subhead. Keep bold on the first subhead, ALL-CAPS section heads and "By <name>" lines.
- **Empty paragraphs:** remove empty paragraphs at the very top. Keep a writer's blank spacers between paragraphs.
- **Spacing:** turn non-breaking spaces (U+00A0) inside sentences into regular spaces, and double spaces into single.
- **Quotes:** keep STRAIGHT quotes and apostrophes. Never convert to curly. In posts by Jarvis or agents, convert curly to straight.
- **Typos:** fix obvious ones that change no meaning, such as dropped letters or doubled words. Never rewrite a sentence.
- **Photo alt text:** fill it in when missing or generic, naming who is pictured plus the credit. Format captions like "X (UAA Photo)".
- **Cover image:** the field is `media`. If media.wixMedia.image is missing, set it from the post's own lead image. If media.displayed is false, set displayed and custom to true.
- **Category, if missing:**
  - Gator Football a4577921-a2e9-41bb-8a5d-4a9c56f2eb5b for football news and roundups.
  - Buddy's Blog d87d6b50-11d3-494d-97cd-aad63680bc49 for Buddy Martin columns.
  - Otherwise, the writer's last category.
- **Tags:**
  - Add existing tags only, matched by EXACT case-sensitive label. Never create tags.
  - Remove "Breaking News" from columns.
- **Meta description:** if the post has none of its own, write one of 155 characters or fewer. Use the Item SEO Tags API (PATCH https://www.wixapis.com/promote/seo/v1/item-seo-tags/BLOG_POST/{id}, fieldMask "tags"). Read first, and skip if hasOverride is true.
- Never change unverified facts, never publish a draft and never send email.

**3. Stats check.** Check numbers about the last or next Florida game, plus AP rankings, against ESPN (free paths: repo refresh data, WebSearch; TinyFish wallet is empty). Correct anything ESPN states plainly; flag the rest.

**4. Record.**
- Post one line per post in #34: id, what changed, what was flagged and the rollback.
- Append the post to seen.json.
- Add one Control Room log row if something changed.
- If nothing is new, stay silent. Tell Brenden only when a fact was wrong, in one line.

---

## Desk inbox + YouTube

Old routine: `trig_01TrguYhktGZ29Wbr4Wz62FH` (Desk inbox + YouTube: submissions, UF press, press conference clips)

Desk inbox check (Brenden, Sept. 27: writers now just email their story; "we'll handle the rest". Also watch University of Florida athletics comms for press releases we can turn into copy).

1. Read the processed-thread list in /home/user/gatorbait-media-redesign/docs/INBOX-DESK-LOG.md (create it if missing). Only handle Gmail threads that aren't listed there.
2. Gmail, newer_than:1d:
   a. Writer submissions: email from staff (Buddy Martin buddymartinshow@gmail.com, Franz Beard, Loren Meadows, Carlton Reese, Eddie Gilley, Chris Spears) or with a subject starting "SUBMIT". Exclude GitHub notices, bounces, newsletters and Wix/system mail.
   b. UF press: from:gators.ufl.edu OR from:ufl.edu OR from:floridagators.com, or anything mentioning Hutchinson (Brenden thinks a Hutchinson sends UF releases; the senders seen so far are ScottB@, MatthewH@, SullivanB@ and LaurenS@ at gators.ufl.edu). Exclude credential/parking/logistics mail.
3. BREAKING first (Brenden, Sept. 27: "standard operating procedure… I don't need to tell you that it's maximum share"). If a staff submission is marked BREAKING (in the subject or first line, e.g. "Hot breaking news exclusive"), or is clearly breaking (injury/MRI result, transfer, commitment, suspension, coaching change, schedule change), run the full playbook section "Breaking news = maximum share" in docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md right away. That means:
   - PUBLISH the story (writer's copy verbatim, plus verified context only).
   - Set featured, move the Home Code 622d8ece BREAKING pin (until the next day at noon ET), and add the first band button on 96ef5a04.
   - Before sending the breaking email: paste automation/newsletter/send-governor.js into ExecuteWixAPI (hasMutations false; until PR #37 merges, read it via `git show origin/claude/tender-wozniak-rmp60e:automation/newsletter/send-governor.js`) and send only if it returns ok:true. Send to label e345fa8e using the newsletter/breaking template (subject passed explicitly; postal address and All Access CTA included). Log the governor's result (ok/reasons) next to the campaign ID in INBOX-DESK-LOG.md. If ok:false, still do everything else in this step (publish, pin, band, social) but hold the email and post the reasons in #34 marked "@Jarvis — needs Brenden".
   - Post to social via Metricool if networks are connected, otherwise give Brenden paste-ready social copy.
   - Verify it live, then post a short status in #34 (3 lines: headline, IDs, governor result).
   The only reason to hold everything is a core fact that can't be sourced at all; then post in #34 marked "@Jarvis — needs Brenden". This standing authorization covers BREAKING items only.
4. For every other writer submission, build a Wix DRAFT; don't publish it. Use the writer's copy verbatim except for confirmed fixes, and use their subject line as the headline idea. Then:
   - Write a one-sentence excerpt.
   - Check it against agency/brands/gator-bait-media/editorial-desk.md (names, facts) and the copy-desk-audit skill, and put [CHECK] on anything unverifiable.
   - Add a credited cover: honor a photo request if they made one; otherwise a Chris Spears photo from the Wix media library or a GatorBait graphic. Never AI art, never an uncredited photo.
   - Add tags and the author/category.
5. For each UF press release or transcript: if it's newsworthy on its own (injury, signing, award, schedule/time change, honor), build a short DRAFT news story in GatorBait voice per the gatorbait-writer skill. Attribute it ("the University of Florida announced…"), put quotes verbatim with attribution, and never invent anything. Otherwise, just log it as source material (for example, transcripts for quotes). If the UF item is itself breaking (e.g. an official injury or status announcement), treat it as step 3.
6. Outside step 3, never publish new posts, schedule, email subscribers or turn on alert automations without Brenden's yes, recorded in #34 (ask via a post there marked "@Jarvis — needs Brenden"). (Exception: step 7.) Every list email — even one Brenden has already approved — runs the send governor first and sends only on ok:true; going over the 1-a-day/2-a-week cap needs a fresh yes from Brenden for that specific send, via #34.
7. YouTube (Brenden, Sept. 27: "Yes YouTube everything"). Fetch the channel feed https://www.youtube.com/feeds/videos.xml?channel_id=UCtR8b1sKFuwaRjKy5BiXRvA (The Buddy Martin Show; the old @GatorBaitMedia handle is 404). Compare against the "YouTube" section of INBOX-DESK-LOG.md. For each NEW video about the most recent Florida game (postgame or press conference clips from Sumrall or players, highlights, the show's postgame episode):
   - Press conference or postgame clips: embed them in the related published story. For Ole Miss that is the presser story 2bb6c273-e733-4af6-bcf7-5b814f768967, which gets a Wix VIDEO node with the YouTube URL. Embed it after the section about that speaker, or at the end under a "Watch" heading. Use the API only (GET the draft, add the node, PATCH with action UPDATE_PUBLISH). SKIP it if the draft hasUnpublishedChanges, and never download or re-upload video.
   - Other game videos: log them and list them for Brenden as ready to embed.
   Log the video ID, title and action. Don't embed the same video twice.
8. Log each thread ID, sender, subject, action and draft/post/campaign ID in INBOX-DESK-LOG.md, then commit and push to branch fix-native-flash-20260926.
9. If you published breaking news, created drafts or embedded videos, post a short status in #34: headline or video title, where it went, the ID, and any [CHECK] items. If nothing is new, stay silent.

---

## Postgame and overnight story desk

Old routine: `trig_01MUB4wqt3bBfoF1TYua86Rb` (postgame ingest, current game week)

CURRENT WEEK: confirm today's date and the Gators' schedule and opponent from ESPN or FloridaGators.com first (never from memory); if a game was delayed, moved or canceled (for example a hurricane), follow the real schedule. Keep the story automation going and publish when stories arrive; this is delegated routine editorial work, decide and publish.

Every run: (1) Gmail, last 75 minutes: submissions from Franz Beard, Loren Meadows, Eddie Gilley, Buddy Martin, Carlton Reese. Pasted text, Google Doc or .docx: publish under that writer's member after the copy desk, with the current opponent's tag set, a category and a meta description; check every stat against ESPN. Scott Burns or UF transcripts: add 2-3 sourced quotes to the relevant story in one UPDATE_PUBLISH PATCH. Shooter photos: upload with the credit "Photo by <name>, GatorBait Media" and use them as covers. (2) Video: new Buddy Martin Show or UF presser uploads on YouTube get "Watch:" links. (3) Run the copy desk on new posts; one canonical story per angle. (4) One line in #34 per thing shipped; tell Brenden in one line when a story goes live. If nothing arrived, stay silent.

Order is chronological, newest first; no writer is pinned as lead (`docs/START-HERE.md` section 4).

---

## Franz Thoughts of the Day

Old routine: `trig_01EMEo2C9NFQNC1nPeoUTU1Z` (Jarvis: Franz Thoughts of the Day (weekdays, auto-publish))

Franz Beard's daily 'Thoughts of the Day' column. Brenden, Oct. 7: "stop asking me, run my business." He wants it fully automatic, checked, learning and cheap. Delegated routine editorial work: decide and publish, don't ask. Free tools only: no TinyFish (wallet empty), use WebSearch, the repo's GitHub-run game data and Wix/Gmail/GitHub connectors.

1. Gmail: search newer_than:1d from:franzbeard@gmail.com subject 'Thoughts of the Day'. Skip if the Wix blog already has a post titled 'Thoughts of the Day: <Month D, YYYY>' for today (query /blog/v3/draft-posts/query; wix.request takes `body`, not `data`). If no email yet, stay silent. Franz's other emails (any other subject) belong to the postgame-desk routine, not this one; do not publish them twice.
2. Read it: pasted text in the body, or a .docx attachment. Attachments: call Gmail get_message with messageFormat RAW on the Franz message id, then run `python3 -I tools/mail/extract_docx_from_transcript.py <message-id> <scratchpad dir>` (from the repo checkout, main or branch jarvis/franz-cover-20261007 until PR #144 merges). It prints paragraphs with a B flag for bold. Word files often merge several paragraphs into one run-on paragraph after a quote: split them at sentence starts that begin a new thought.
3. Copy desk, then publish ONE post via POST /blog/v3/draft-posts (body {draftPost}) and POST /blog/v3/draft-posts/{id}/publish, modeled on post 7f5d042f (Oct. 7): title 'Thoughts of the Day: <Month D, YYYY>', member c2d49068-1ebe-4a3c-87f5-11e6726a5352, categoryIds [010b45a8-3222-4d0f-9660-a44de2fb1b55], tagIds [c3f073e4-e01e-4e66-b541-a83383717356, 5263f874-d41e-43e4-bec3-4147ab6fefca, 7b36c951-363c-40bc-90b5-8457ef02c83d, 9433a2a6-d8ff-42fa-8d59-239a258d9b02], excerpt one sentence, first line bold, ELSEWHERE IN THE SEC as a level-2 heading, team lead-ins ('No. 6 Alabama (5-0, 3-0 SEC):') bold with body regular, no empty paragraphs, straight quotes, single spaces, '&amp;' to '&', curly quotes to straight. Fix rankings against the ESPN AP poll (check via the repo's refresh data or WebSearch, never invented); other stats are Franz's, flag unverified ones in #34. Then set a meta description of 155 characters or fewer: PATCH https://www.wixapis.com/promote/seo/v1/item-seo-tags/BLOG_POST/{id} with body {itemSeoTags:{tags:[{type:'meta',props:{name:'description',content:'...'}}]}, fieldMask:'tags'} (read first; skip if one exists).
4. COVER (Brenden, Oct. 8: no more type-only covers; "read the title and description and come up with something much better"): read the column's title and excerpt and pick a visual that belongs to that day's hook. Either an owned GatorBait photo (credits in sports-live/front-page.config.json, credit exactly as listed) or an illustration drawn as SVG/HTML and screenshot at 1600x900 with the bundled Chromium (Lesson 70: Canva only returns a 200-px thumbnail here). Commit the JPG under assets/covers/ on a pushed branch, upload with Wix UploadImageToWixSite imageUrls from the raw.githubusercontent.com URL, and set it as `media` in the create body with alt text (what is pictured, "GatorBait Media"). Never reuse yesterday's cover.
5. Before publish, confirm both blog alerts 5006baf5-fbbf-440c-a012-a09bdbd95fc9 and 824714d4-7e31-4b1d-95b2-ccec04d788af are INACTIVE (GET /automations-service/v2/automations/{id}, configuration.status). No automatic list email from this routine.
6. Record: one line in #34 with the post URL, what changed, flags and rollback (unpublish). Add the post id to scratchpad/copy-desk/seen.json. Tell Brenden in one line only when it is live. LEARN: if you hit a new failure mode, add one line to skills/master-control/references/LESSONS.md on a branch.

---

## Daily blog keyword tagging sweep

Old routine: `trig_01VgDMSLDLFkkTvhXrXUCUPu` (Daily blog keyword tagging sweep)

Daily blog tagging sweep (Brenden's standard: tag every blog with roster/people/opponent keywords). In gatorbait-media-redesign, run `python3 automation/blog-tagging/build.py --since <now minus 48h, ISO UTC> --offset 0 --limit 35`, then run the generated automation/blog-tagging/tagger.js through Wix ExecuteWixAPI (site 18fb3a4e-d7f6-414a-aeb9-3047db3ea115, hasMutations true). It only adds tags, keeps existing ones, and skips posts with unpublished edits. Also retry the 9 posts listed as skipped in automation/blog-tagging/README.md if their edits have since been published. Record counts in the README history only if something was tagged. Do not change post text, send email, or touch anything else. If nothing new, stay silent.
