# Baugh reel card on YouTube (Oct. 18, 2026)

Baugh card now links YouTube y4GpdY2bzdU, BAUGH: "TRAMELL IS GOING TO BE A GREAT QUARTERBACK" (The Buddy Martin Show, published 2026-10-18T19:56Z). Sumrall was already on YouTube; both postgame reels are now YouTube.
Poster: `sports-live/reels/baugh-yt-y4gpdy2bzdu.jpg` (maxresdefault center-cropped to 9:16, 540x960, committed static file; the page never calls YouTube on load). Old Facebook Baugh poster left in place (unused).
Tap injects https://www.youtube-nocookie.com/embed/y4GpdY2bzdU?autoplay=1&rel=0&playsinline=1 only on tap; fallback link "Watch on YouTube". Credit line unchanged.
QA (`qa-magazine-postgame.mjs`) now taps every reel and derives the expected embed from the card's own id. Passed at 320/390/430/1366/1920; shots in `shots/`.
Postgame bundle 202,978 of 204,800 bytes. `--check` current for weekly, postgame, pregame.
Draft game-story patch `deploy/fb-reels-20261018/game-story-fc2ce412-watch-patch.json` updated to YouTube for both clips (not applied).
Not applied: no Wix write, no loader pointer change. Rollback: revert this PR.
