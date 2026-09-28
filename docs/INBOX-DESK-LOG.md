# Desk inbox log

Processed-thread list for the hourly "Desk inbox" routine (`trig_01TrguYhktGZ29Wbr4Wz62FH`, 7 a.m.–11 p.m. ET).

**What it handles:**
- Writer submissions by email.
- UF athletics comms (gators.ufl.edu, ufl.edu, floridagators.com; any "Hutchinson").

**What it does:** builds Wix drafts only. It never publishes or emails; Brenden approves every publish.

| Thread ID | Sender | Subject | Action | Draft |
|---|---|---|---|---|
| 1a0e0a7b95438103 | buddymartinshow@gmail.com | Early buddy Col | Already published before the desk started (post bb1d7484) | none |
| 1a0e060d5641e35e | MatthewH@gators.ufl.edu | FW: ASAP transcript: Jadan Baugh | Source material, used Sept. 27 | none |
| 1a0e0589618f76d0 | MatthewH@gators.ufl.edu | FW: ASAP transcript: Jayden Woods | Source material, used Sept. 27 | none |
| 1a0e04ce141d70dc | MatthewH@gators.ufl.edu | FW: ASAP transcript: Jon Sumrall | Source material, used Sept. 27 | none |
| 1a0d8efdd0c7c32d | ScottB@gators.ufl.edu | Florida vs. Ole Miss gameday media information | Logistics, skipped | none |
| 1a0e3784c4073f2b | reader (Yahoo) | Re: GatorBait Magazine — Postgame Wrap | Reader reply ("GO GATORS"), not a submission; skipped (16:07Z run) | none |
| 1a0e364170a48426 | reply@e.floridagators.com | TICKETS: Beat UGA in ATL | UAA ticket marketing, not a release; skipped | none |
| 1a0df03e7883ab9c | no-reply@usrmailtest.com | Lacy-Less in The Swamp … | Our own test send; skipped | none |
| 1a0deb3b8cf6812b | no-reply@usrmailtest.com | TEST — Game Day: Florida vs. Ole Miss | Our own test send; skipped | none |
| 1a0e3efbf2d2942c | buddymartinshow@gmail.com | Column: use before 4 | Built as a Wix DRAFT (not published), 18:1xZ. Fixes: "like it was a good old days" → "the good old days"; added the missing closing quote on Sumrall's "1-0 every week." Cover: Chris Spears' Baugh first-TD dive (first use as a cover). [CHECK] items sent to Brenden: the ESPN FPI claim (favored in all but Texas and Georgia); the Tebow quote's source and date; "within 48 hours … lock for the Top 10" is now outdated (Coaches Poll has Florida No. 8). | c377ca6a-afa5-4914-a91b-526ec4f8e9cd |

## YouTube (The Buddy Martin Show, UCtR8b1sKFuwaRjKy5BiXRvA)

Baseline, Sept. 27 18:45Z: no Ole Miss postgame or press conference video posted yet. Already seen, so don't embed: YqxjkqSv1jk (Auburn "NO BAD WINS" short), u2dMQ4u3yNY, s9UU8a0wC7s, 8aOQqgnVr7o, sctBnF9Om7c, u1qAJBKZW7E (all pregame).
Target for Ole Miss press conference clips: post 2bb6c273 (Sumrall press conference story).
Checked Sept. 28 02:04Z (via vidIQ channel data; direct RSS fetch is blocked from this sandbox): still no new upload of any kind since 2026-04-22. No Ole Miss postgame/press conference video exists yet — nothing to embed.
Checked Sept. 28 03:04Z: same result, no new upload.
Brenden, Sept. 28 ~03:50Z: postgame video is on Facebook, and one was added to an article. Already embedded, so don't embed again:
- Facebook reel 2330767687457823 in the Baugh Game recap (94127b93).
- Facebook reel 4342698309325942 in "What Happened in College Football Saturday" (9fb69423).
- YouTube Abu9k2osBUQ (press conference) live in the Sumrall presser story 2bb6c273.
- YouTube Short HOWChEGrfF0 now live at the top of 2bb6c273: the pending 02:45Z edit was published at 03:38Z on Brenden's order ("publish it"), after confirming the draft was unchanged since review.
| 1a0e4dcd66fcf561 | buddymartinshow@gmail.com | Hot breaking news exclusive (Vernell Brown MRI) | PUBLISHED on Brenden's order ("posted ASAP… max share"), post baa858cf | Buddy's copy verbatim + verified context (Sumrall transcript, AP stats); cover Chris Spears 7acdfecf |

## Daily roundup — Sept. 28, ~10:4xZ

First run under the new one-a-day email policy (`trig_01JibZfuK6jRddgK16atrrTQ`). Stories since the last send (Vernell Brown breaking, Sept. 27 22:07Z): Chris Spears' Best Shots Vol. 2 (bc01aadb), Best Shots Vol. 1 (67bd8aca), Missouri first look (db2e38da). No Buddy Martin piece in the window, so newest-first. No Franz "thought of the day" found (no new post, no email from him in the last 24h) — left the slot out per the routine's fallback; not re-checked at 14:00Z since it would already be too late for a send blocked anyway (see below).

Built `newsletter/2026-09-28-monday-roundup.mjml` from `templates/gatorbait-magazine-colorlib-v1.mjml`. Gates: check-links (source + rendered) PASS, validate-unique-images PASS (2/2 unique, both Chris Spears/credited), run-stack-qc PASS (7 distinct article links, min 6). 390/1000 overflow check: no layout overflow at either width (confirmed via layoutWidth/bodyWidth match); the check script's image/font network probes failed only due to this sandbox's outbound proxy, not the email itself — verified the images are real, current Wix CDN URLs sourced directly from the live posts' own cover images.

**Send governor: `ok:false`.** 4 list sends in the last 24h (cap 1), 18 in the last 7 days (cap 7) — carryover from yesterday's pre-policy game-day volume. Bounce 1.04%, complaint 0.03% (both fine). Did not send.

**Action:** uploaded as Wix Email Marketing DRAFT campaign `3e89adb2-6f2c-4502-a74e-ecd10bc2f473`, subject "GatorBait Roundup — Best Shots, Vol. 2 + Missouri Next", preview verified (52,875-char rendered HTML, no broken placeholders). Ready to send once the trailing-window caps clear or Brenden approves an exception. Committed source to `fix-native-flash-20260926` (`13cc98a`).
