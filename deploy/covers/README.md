# Story covers

`template.html` composes a 1600x900 layered story cover from query parameters: a Chris Spears photo from the
Wix media manager (`photo=<media id>`), an optional cutout PNG layered on the right (`cutout=`), the kicker
(`kicker=`, `sub=`), headline (`title=`), dek (`dek=`), credit (`credit=`), photo focus (`focus=`) and `side=right`
(copy block on the right, for photos whose subject is on the left).
Navy #07122e wash, one orange #fa4616 rule, Barlow Condensed headline, Barlow dek. No AI art, no fake signage.

This container cannot reach static.wixstatic.com, so the render happens in the live-shots workflow: push a
`shots/<name>` branch whose `automation/vision/live-shots.request.json` has
`{"path":"deploy/covers/template.html?<query>","selector":"#cover","widths":"1600"}`. The workflow opens the
file from the checkout, waits for fonts and the photo, and publishes `element-1600.jpg` to `qa/live-shots`.
Upload that file to the media manager from its raw.githubusercontent.com URL (Wix fetches it), then set it as
the post's cover through the draft-posts PATCH (UPDATE_PUBLISH). Keep a copy in `out/` for the record. Then add the media id to `covers` in `sports-live/front-page.config.json` (with its credit) and rebuild, so the front page shows the cover whole instead of cropping its headline.

History:
- 2026-09-30: Buddy Martin, "The Looming Brilliance of Buster Faulkner" (post 0753a25b). Photo
  16b519_c17395a88d06437d9d7e57086b8f4707 (Chris Spears), cutout ae876a_b8f5f91b591148208d23919fd45072e8 (UAA).
  Replaced a transparent cutout PNG that Brenden did not like.
- 2026-10-07: Franz Beard, "Thoughts of the Day: October 7, 2026" (post 7f5d042f). Photo d3cfa5_49f61d2e3df04d09947775688b8de577
  (UF Athletic Association, Oyebadejo pressuring Simmons), `side=right`. Media d3cfa5_0d1374ffc0884a48aa3b363a54ee0ab3.
  File: `out/thoughts-of-the-day-2026-10-07.jpg`. First use of the standing format below.

## Thoughts of the Day (standing)

**Standing format (Brenden, Oct. 7): the type-led series cover, the same every day.** "The graphic for yesterday was fine for Thoughts of the Day. Why did it change?" The photo-and-quote cover used once on Oct. 7 (Oyebadejo, `out/thoughts-of-the-day-2026-10-07.jpg`) is retired for the series; `template.html` with `side=right` stays available for one-off story covers.

Template: `deploy/covers/thoughts-of-the-day.html`, 1600x900, Barlow only, navy #07122e wash, one orange #fa4616 rule, no photo. The series title is fixed ("THOUGHTS OF THE DAY", orange "DAY"). Query parameters:
- `date=` the column date, for example `October 7, 2026`.
- `hook=` one line, for example `Explosive plays, South Carolina and the SEC across the board`.
- `by=` the byline, for example `Franz Beard` (renders "BY FRANZ BEARD").
- Optional overrides for other series: `k1=`, `k2=` (kicker), `l1=`, `l2=` (headline lines, `l2` in orange), `fs=` (headline px). Leave them off for Thoughts of the Day.

Each day: render through the live-shots workflow (`{"path":"deploy/covers/thoughts-of-the-day.html?date=...&hook=...&by=Franz+Beard","selector":"#cover","widths":"1600"}`), upload to the media manager from the raw URL, set it as the post cover in one UPDATE_PUBLISH (also `og:image` and alt text), keep the file in `out/`, add the media id to `covers` with credit "GatorBait Media" in `sports-live/front-page.config.json`, rebuild, deploy through `current.json`. The front page keeps only the newest "Thoughts of the Day:" post; older ones stay at their URLs and in Latest.

History: Oct. 6 `out/thoughts-of-the-day-2026-10-06.jpg` (media `d3cfa5_9dbc974303bb4e4080580502a1c6b727`); Oct. 7 `out/thoughts-of-the-day-series-2026-10-07.jpg` (media `d3cfa5_76a430063f5b40d6a008010165fbe093`, set by Jarvis).
