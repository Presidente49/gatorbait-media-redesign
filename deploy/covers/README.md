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

One format for every day's Franz Beard column (Brenden, Oct. 7: "pull the most Gator part of that day's Thoughts
out and focus on it, with a subheading 'Thoughts of the Day'. It has to be consistent"). Same `template.html`,
1600x900, Barlow only, navy #07122e wash, one orange #fa4616 rule.

1. Kicker tag: `kicker=Thoughts of the Day` (the template uppercases it), sub `sub=Franz Beard · <AP date>`, for example `Oct. 7, 2026`.
2. Headline `title=`: the single most Gator-specific item in that day's column, 8 words or fewer. The template sets it in uppercase Barlow Condensed.
3. Dek `dek=`: one line, one stat or quote from the column. Stats are Franz's own; flag any that are not yet checked against ESPN or UF in #34.
4. Photo `photo=<Wix media id>`: a real GatorBait photo (Chris Spears or UAA) that matches the headline topic. Add `cutout=` when a clean cutout exists. Never AI art. Do not reuse the same photo two days running.
5. `credit=Photo: <credit>`; the GatorBait Media mark is bottom left (built in).
6. Use `side=right` when the subject sits on the left of the frame, so the copy never covers the player. Default is copy on the left.

Query for Oct. 7:
`deploy/covers/template.html?photo=d3cfa5_49f61d2e3df04d09947775688b8de577~mv2.jpg&side=right&kicker=Thoughts+of+the+Day&sub=Franz+Beard+%C2%B7+Oct.+7%2C+2026&title=Same+defense.+Same+explosive+plays.&dek=...&credit=Photo%3A+UF+Athletic+Association`

Each day: pick the item, build the query, render through the live-shots workflow, upload, set the cover on the post (one UPDATE_PUBLISH, also set `og:image` and alt text), keep the file in `out/`, add the media id to `covers`. The older type-only series cover (`thoughts-of-the-day.html`, used Oct. 6) is retired for new days; keep it only as a fallback when no matching photo exists.
