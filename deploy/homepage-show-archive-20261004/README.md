# Homepage full-show archive — October 4, 2026

Owner approved pushing the compact-photo homepage and replacing the old Shorts destination with Buddy Martin Show programming.

Replaced the two hard-coded Auburn Shorts with two full broadcasts observed in the official GatorBait TV Buddy Martin Show playlist: Terry Bradshaw joins us on Best Friday Football Podcast (56 minutes, thbit5tEv8o) and Did Florida Win or Lose With LSU Staying in the SEC? (1 hour, 5 minutes, HQPImxA8WMQ). The section explicitly says archive, not latest. Cards open direct watch links. Browse the show playlist opens https://www.youtube.com/playlist?list=PL1twZqsaZwxkNWlp7UJPZYfKWZGGT6bzG (verified title, owner and 424 entries in public browser; that playlist also includes Shorts, so it is not labeled full-shows-only).

Recent broadcasts, lead selection, compact-photo CSS, named bylines and schedules are unchanged. No Wix Editor publish, email, category, membership or Magazine changes. Source/build parity, syntax and whitespace checks pass. Live render verification follows deployment.

Rollback: restore sports-live/current.json commit to 3417925bb3e10ab0be484b642f02dc3bdd7360ef. Wix HOME_CODE fallback remains that same previous release; no embed change required for this bounded pointer release.

## Live verification

Release af591b211765e18f5590989473a6bfd50ae0c896; pointer e28951c73d91eb211c15fd55fb54076a104a600f; build 7020f576. Pages deployment 37249798681 succeeded. Public browser confirms both direct watch URLs, playlist destination and zero /shorts/ links under the homepage root. Live screenshot run 37249851416 succeeded at 320/390/430/1366: HTTP 200, expected build, no page errors or horizontal overflow at all four widths. Inspected phone390 and desktop archive images: loaded thumbnails, full titles and durations, visible playlist CTA. Existing HOME_CODE fallback intentionally remains 3417925. Browser-local thumbnail failures did not reproduce in independent production screenshots.
