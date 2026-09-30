# The Morning Cut

## The idea

A next-morning clip package for every Buddy Martin Show, assembled from tools the account already pays for: Descript holds the show and the clip compositions, vidIQ cuts and captions the vertical, Canva makes the on-brand thumbnail, and Metricool says when to post. The controller's morning job shrinks to verify the titles and guest names, pick two clips, and hand the package to whoever posts. Round one (The Buddy Line) was a CSS card; it is retired. This package exists in the accounts today: six real clip records, two of them full vidIQ renders with files on disk at vidIQ, a Canva design ID, and a manifest with show timestamps that were checked against the Descript transcript.

## Why it matters

- The clips playbook already says Restream cuts first and vidIQ/Descript polish the one or two PREMIUM moments. What was missing is the packaging step: verified title, guest name, show timestamp, route, thumbnail and time slot in one file. `manifest.json` is that file.
- Buddy stays the editorial lead. Every clip in the package routes to The Buddy Martin Show identity except the stale Auburn preview, which routes to Gator Bait Media and is marked do-not-post. One canonical show URL, no duplicate posts.
- Guest history is the hook, and it is real: Laura Rutledge crediting the Gator Country days with Buddy and Brenden, Carlton Reese on the 1990 season from inside the Gainesville Sun newsroom. Those are the clips vidIQ scored highest (92, 92, 88, 85) and they are ours.
- It is cheap when it runs: one Descript export per clip, one vidIQ clip job on a 4-minute range (36 credits), one Canva design. It cannot run today because the vidIQ balance is zero; that is the first ask below.

## Evidence

All calls made Sept. 30, 2026, from the worker container. Nothing was published, scheduled or uploaded.

**vidIQ**

- `vidiq_user_channels` -> `channels: []`, authenticated as brenden@gatorbaitmedia.com. No channel is authorized, so `vidiq_channel_analytics` and outliers on our own channel are impossible until YouTube is connected.
- `vidiq_balance` -> `totalCredits: 0`, `maxRenewableCredits: 150`, resets 2026-10-13T06:25Z. Every paid call refused with "Not enough credits. No credits were charged": `vidiq_channel_search` and `vidiq_youtube_search` (5 each), `vidiq_generate_clips` on 8b7F5iyYOIk range 320-560 s (36), `vidiq_generate_music` for the 6-second brass Tunnel sting (25). Not attempted, same reason: `score_title`, `generate_titles`, `generate_thumbnail`, `outliers`, `video_transcript`.
- `vidiq_jobs_list` (free) -> 20 jobs. `vidiq_job_poll` (free) on the completed clip jobs returned real outputs:
  - `job_4d512c35-8fa1-4c99-b5af-b8bcb98df47c` (Sept. 17): clips `0cfcb375-648f-5c9e-a979-f587cff722ec` ("Googling IFB on a flip phone before live TV!", score 92, 33.66-67.88 s) and `c538ffbd-9afa-5142-bdcd-ba5b6d75fc42` ("From 'terrible' to broadcast pro", 88, 204-255 s).
  - `job_97430768-0cfa-4673-b091-566b00891dd8`: `ad7c2b61-8218-53b5-9efd-a62a67fefc1b` ("Behind the Sarkisian Interview Delay: My Camera Broke!", 92).
  - `job_12015d66-9c49-4819-929f-efb50ad95be6`: `82543fde-7a33-5642-a68d-e979bd103786` ("Gainesville Murders: How Football Brought Hope", 85).
  - Sept. 20 jobs `job_ef3809c5` and `job_d0764c7e` are Sumrall press-conference clips (Uf5Pgp4ESWg), listed in the manifest but outside this package.
- The S3 clip files answer HEAD 200: 13.2 MB, 20.2 MB, 24.4 MB, 61.9 MB. Clip `0cfcb375` was downloaded to the scratchpad and probed with PyAV: h264/aac, 1080x1920, 30 fps, 34.3 s, burned captions. A poster frame is in `clip-0cfcb375-frame.jpg` (115 KB). Finding: the auto-crop keeps the Restream logo bed with a small guest window, so this one is PREMIUM (reframe) not STANDARD.

**Descript**

- `list_projects` -> 11 projects; `get_project 4722f81b-757d-4169-b528-9479dc40ce4d` ("GatorBait Buddy Martin Show Highlights 2026-09-16", drive 16741d84-7499-415a-9b51-f6780e337a59): full-show audio 3,579.8 s plus four clip compositions (LAURA RUTLEDGE 75.1 s, CARLTON REESE 64.2 s, FLORIDA AUBURN 55.7 s, BEST EXTRA 55.3 s), `publishes: []`, `list_jobs` empty.
- `export_transcript` x5: the four clip transcripts with timecodes, and the full show as SRT (110,855 characters, 6,166 lines, saved to the scratchpad). I read the clip transcripts in full and searched the full SRT for anchor phrases only; I did not read all 60 minutes. Anchors: IFB 00:05:50, "many things can be true" 00:16:35, "hit my camera" 00:17:40, Ally Wilbur 00:29:02, Florida/Auburn 00:30:25, "litmus test" 00:31:10, "14 Days in Gainesville" 00:43:01, "baseball bats" 00:43:54.

**Canva**

- `list-brand-kits` -> one kit, `kADrKmKAhUs`.
- `generate-design` (youtube_thumbnail, that kit) -> job `5bf4ff5f-9dfe-41a5-9914-7df44a2d7a61`, candidate `dg-ec94b1a9-ae4e-4955-94b6-b29e4403d6aa`; `create-design-from-candidate` -> design `DAHWqWoImOo`, view https://www.canva.com/d/kdo7Wws82oiWMeE; `get-export-formats` -> png supported; `export-design` PNG 1280x720 -> job `7c80d5bd-ccd0-4379-8610-2ee269203962`, success. The PNG could not be pulled into the repo: the egress proxy refuses CONNECT to export-download.canva.com and design.canva.ai (403). The design is private in the account and can be deleted if not wanted.

**Metricool**

- `getBrandSettings` -> "This brand doesn't have any social network connected yet" (brand 6946016).
- `getBestTimeToPostByNetwork` (Sept. 1-30, America/New_York): facebook, youtube and tiktok returned 7-day hourly curves; instagram all zeros; twitter 403 AuthorizationException. Because no network is connected, treat these as Metricool's network benchmark, not our audience. Peaks: Facebook Wed 12:00, Wed 10:00, Mon 10:00; YouTube Wed-Fri 16:00; TikTok Wed-Thu 10:00 and 18:00. Show-night 9 p.m. sits at about 40 percent of the Facebook midday peak.
- `getScheduledPosts` Sept. 23-Oct. 14 -> empty. Nothing queued, no duplicate risk from Metricool.

**Show identity**

- Newest show seen: Monday, Sept. 28 (Missouri week), per Buddy's column published 2026-09-28T23:24Z, which links only to the channel /live URL. YouTube pages do not render through Exa or TinyFish, so the video ID is unresolved. The package uses the newest show with verified in-account assets, Sept. 16 with Laura Rutledge (8b7F5iyYOIk, channel UCtR8b1sKFuwaRjKy5BiXRvA), matching `automation/ops-hub/show-assets/2026-09-17-buddy-martin-show-laura-rutledge-replay.json`.

## What it needs from Brenden

1. vidIQ credits or a plan bump (balance 0, 150 renew Oct. 13). A show package costs about 36 credits for the clip job plus 5 per title score and 22 for a thumbnail.
2. Authorize the GatorBait TV channel in vidIQ (`vidiq_authorize_with_youtube`) so channel analytics and own-channel outliers work.
3. Connect Facebook, YouTube and Instagram to Metricool brand 6946016 so the posting windows become our audience's numbers.
4. A yes on the two Laura Rutledge clips (IFB, Sarkisian camera) as the Sept. 16 PREMIUM pair, and on the clip titles in the manifest, which are AP-style rewrites of vidIQ's drafts and are unscored.
5. The Sept. 28 show's YouTube ID, or the Restream recording, so the next package runs on the newest show.

## Risks

- Stale content: the Auburn preview clip is already dead; the manifest flags it. Packages must run within 24 hours or be archived.
- Crop quality: vidIQ's auto-crop on the Restream layout is not broadcast-ready; every clip gets a look before it runs, and the Descript compositions are the fallback source.
- Sensitivity: the Carlton Reese clip touches the 1990 murders. Keep his framing, no hype title.
- Benchmark windows: until Metricool has our accounts connected, the posting times are generic.
- Signed URLs: Canva export and vidIQ motion-graphics links expire within a day; the IDs in the manifest are what persists.
- Nothing in this package posts by itself; one human stays the outbound owner.
