# The Morning After

## The idea

Every Buddy Martin Show becomes a Buddy Martin column by the next morning, drafted in his voice from the show's own transcript, with every number traced to ESPN and every quote traced to a timecode. The pipeline is three tool calls: Descript exports the transcript of the show that Restream already feeds it, Idiolect writes the column against a Writing Profile trained on Buddy's published columns, and the copy desk (Brenden or staff) checks the draft against the fact trace before Buddy reads it. Buddy edits or rejects; nothing runs without him.

Round one's "Front Porch" was a mockup written by hand. This is the pipeline, run end to end once on the newest show in Descript (Sept. 16, guest Laura Rutledge), with the real transcript, the real profile and the real draft in this folder. It is not a substitute for Buddy writing; it is a first draft that sounds like him, on his desk before he has finished his coffee.

## Why it matters

- Buddy is the editorial lead across the homepage, Magazine and packages. He already does the show. Today the show and the column are two separate jobs; this makes the show produce the column.
- The show is the one place the whole staff's voices are on the record together. A post-show column puts Laura's, Carlton's and Ally's calls in writing, with attribution, the day after, instead of leaving them in an hour of audio.
- Subject lines and bylines carrying Buddy's name are the Magazine's strongest signal (per the editorial skill and the current lead direction). One more Buddy column a week, with no new writing hours from Buddy, is the cheapest way to get more of them.
- It closes the loop that the clips playbook already opened: Restream to Descript is in place for clips, so the transcript is free.
- Discipline is built in: the draft can only use quotes that exist in the transcript and stats that exist in the ESPN feed, and the fact trace lists the timecode for every quote.

## Evidence

All calls made Sept. 30, 2026, read-only or in-account creates. Nothing published, scheduled or sent.

**Exa**
- `web_search_exa` ("Buddy Martin column on gatorbaitmedia.com"): 10 results, including the Buddy's Blog category page and six Buddy columns from 2024-2026.
- `web_fetch_exa`, two calls, six URLs, maxCharacters 12000: full text of the five columns listed in `voice-samples.md` plus the Aug. 29 LSU column (fetched, not used).

**Google Drive**
- `search_files` (fullText contains 'Buddy Martin', documents only): one unrelated private note, not read, not used. No column drafts in Drive under that name.

**Idiolect**
- `manage_profile` view: "No Writing Profile is saved."
- `manage_profile` setup_from_writing, three columns: `needs_evidence`, "1 more distinct writing samples and 0 more characters."
- `manage_profile` setup_from_writing, five columns: `saved`, profileId `54e40516-0e40-4eec-bada-3adda6be0ea2`.
- `write` with that profileId, the transcript quotes and the ESPN facts as material: `complete`, writingJobVersionId `ffb6be79-94ea-4d6b-b3b6-57d54bb60abe`, outputReference `c16fa98a-7cd4-4880-a660-4445c0beb310`, personalization applied `["Writing Profile"]`. Output is in `column-draft.md` unedited (888 words).

**Descript**
- `list_projects` (sort updated_at desc): 11 projects. Newest show project: `GatorBait Buddy Martin Show Highlights 2026-09-16`, id `4722f81b-757d-4169-b528-9479dc40ce4d`. The Sept. 29 project `GatorBait — The Swamp Remembers` (`645daa48-...`) holds only the two-minute anthem, not a show.
- `get_project` 4722f81b: one audio file, 3,579.8 s; five compositions (full show `72916e10-1950-44de-9862-21118a122cbc`, plus Laura Rutledge, Carlton Reese, Florida-Auburn and Best Extra clips). No publishes.
- `export_transcript` (markdown, speaker labels on change, timecodes on paragraphs): 67,846 characters, 694 lines, saved as `transcript.md` with a source header and one wage figure redacted.

**Repo**
- `sports-live/scoreboard.json` (ESPN, updated 2026-09-29T02:17:33Z) for every score, record, rank and kickoff in the draft.
- `automation/ops-hub/show-assets/2026-09-17-buddy-martin-show-laura-rutledge-replay.json` to confirm the show date and the cleared replay segment.

**Not called:** Wispr Flow (no Buddy material expected there; budget kept for the three tools above). Restream is unreachable from this container (proxy 403, per TOOLS.md) and was not attempted.

**Limits found:** The newest show in Descript is Sept. 16. The Sept. 28 Missouri-week show has not been fed from Restream to Descript, so the column is a look-back at the Sept. 16 panel against two games of results rather than a same-night recap. Idiolect profiles have no display name, and this profile is now the account default.

**Files:** `voice-samples.md`, `transcript.md`, `column-draft.md`, `PITCH.md`, `preview.html`. Round-one `draft.md` left in place as the rejected mockup.

## What it needs from Brenden

1. Load the Sept. 28 show (and each show after) into Descript from Restream on the Mac, the same way the clips playbook does. That is the only step this container could not do. Once the audio is in Descript, the transcript and draft take about five minutes.
2. Read `column-draft.md` and decide whether the voice is close enough to send to Buddy. If not, add columns to the profile: `learn_writing_style` with `authored_example` takes more of his published pieces.
3. Decide whether the Buddy profile should stay the account default in Idiolect or whether a second profile (Brenden's, or house style) should be created so the two are not confused.
4. Confirm the copy-desk owner. The draft ships with a fact trace and seven notes; someone has to work them before Buddy sees it.
5. Buddy's yes on the shape: show Tuesday night, draft in his inbox Wednesday morning, he rewrites as much as he likes, one canonical URL in the Magazine.

## Risks

- **Voice drift.** Idiolect reproduced Buddy's structure and register but not his history or his best lines; the draft is plainer than he is. Mitigation: Buddy edits every draft, more samples in the profile, and the copy desk flags any paragraph that reads generic.
- **Transcript errors.** Descript misheard Sumrall, Baugh, Philo and Chambliss. Names were corrected in the material sent to Idiolect, but a future run without that step would print "Jayden Ball." Mitigation: a name-correction list in the transcript header, kept current.
- **Quote provenance.** Anything Buddy repeats on air from memory (the Sumrall family line) arrives in the draft looking like a primary quote. Mitigation: the fact trace marks it; the copy desk verifies or attributes.
- **Stale by morning.** A column drafted from a two-week-old show, as this one is, only works as a look-back. The pipeline is worth it only when the show reaches Descript the same night.
- **Redundancy.** If Buddy also writes his Monday column, two Buddy pieces two days apart can overlap. Mitigation: the post-show column stays on what the panel said; Buddy's own column stays on what he thinks. One canonical URL each, no duplication on the homepage.
- **Account-level profile.** The Buddy profile is the Idiolect default for the whole account until another is added. Any casual `write` call on this account now comes back sounding like Buddy.
