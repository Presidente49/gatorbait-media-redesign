# Story covers

`template.html` composes a 1600x900 layered story cover from query parameters: a Chris Spears photo from the
Wix media manager (`photo=<media id>`), an optional cutout PNG layered on the right (`cutout=`), the kicker
(`kicker=`, `sub=`), headline (`title=`), dek (`dek=`), credit (`credit=`) and photo focus (`focus=`).
Navy #07122e wash, one orange #fa4616 rule, Barlow Condensed headline, Barlow dek. No AI art, no fake signage.

This container cannot reach static.wixstatic.com, so the render happens in the live-shots workflow: push a
`shots/<name>` branch whose `automation/vision/live-shots.request.json` has
`{"path":"deploy/covers/template.html?<query>","selector":"#cover","widths":"1600"}`. The workflow opens the
file from the checkout, waits for fonts and the photo, and publishes `element-1600.jpg` to `qa/live-shots`.
Upload that file to the media manager from its raw.githubusercontent.com URL (Wix fetches it), then set it as
the post's cover through the draft-posts PATCH (UPDATE_PUBLISH). Keep a copy in `out/` for the record.

History:
- 2026-09-30: Buddy Martin, "The Looming Brilliance of Buster Faulkner" (post 0753a25b). Photo
  16b519_c17395a88d06437d9d7e57086b8f4707 (Chris Spears), cutout ae876a_b8f5f91b591148208d23919fd45072e8 (UAA).
  Replaced a transparent cutout PNG that Brenden did not like.
