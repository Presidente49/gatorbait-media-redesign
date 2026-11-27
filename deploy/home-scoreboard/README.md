# Front-page Top 25 scoreboard (Nov. 21, 2026)

Owner direction, game day: "I want a front page today that is interactive and constantly has a score update so we don't have to tell you."

- **What it is:** `sports-live/home-scoreboard.js`, one dependency-free file. It draws a panel between the header and `#sh-main` on the front page only: the Gators game on top (score, clock, line, TV, links to the game day magazine and the roster), then every ranked game on the slate with tabs (All ranked games, Live now, Final), tap-for-details rows (line, TV, venue, ESPN Gamecast) and a flash when a score changes. Phones show three games and a "Show all" button; desktop shows six.
- **Data:** ESPN's public college football header scoreboard (the feed the site already reads), which carries every ranked game. Polls every 20 seconds while a game is live or within 25 minutes of kickoff, every minute on a slate day, every five minutes otherwise; pauses in a hidden tab and when the visitor is not on the front page. Nothing is written anywhere.
- **Quiet by design:** the panel is drawn only while a ranked game is live, starts within 20 hours or ended within 14 hours. If ESPN is unreachable the last scores stay up with a "reconnecting" note; if nothing was ever read, nothing is drawn.
- **Loader:** `python3 deploy/home-scoreboard/make-loader.py <sha>` prints the body of the Wix custom embed (about 900 characters), which fetches the pinned jsDelivr file on `/` only.
- **Rollback:** disable the embed (`enabled: false`) or point the loader at an earlier commit. No post, page or other embed was changed.
- **QA:** run on the live front page with the script injected and ESPN's feed mocked (pregame, live with score changes, no slate) at 320/390/430/1366 px: no overflow, no script errors, tabs and details work, a score change flashes and updates in place, and the panel stays out on a day without ranked games.

## No-jump update (Nov. 21, 2026, about 12:30 p.m. ET)

Owner report: the front page jumps when it loads. Measured on the live page with a throttled phone (4x CPU, slow 4G): the scoreboard's first version added 0.87 of layout shift because it was inserted after the page had painted (CLS 0.90 with it, 0.003 without). Now the file starts its ESPN request the moment it loads, mounts the panel in the same frame in which `#sh-main` first appears (a MutationObserver, so nothing is pushed down), and falls back to the last slate saved in `localStorage` (12 hours) when ESPN is slower than the page. A reader who has already scrolled keeps their place if the panel arrives late. Measured after: CLS 0.024 on a first visit and 0.032 on a repeat visit (phone); desktop 0.10, down from 0.30 for the page before the scoreboard existed.

Known and not fixed here: on desktop the lead story's photo has no reserved height until it loads (the figure is `fit-content` wide, so its 16:9 box is 0 px tall until the image arrives); that is in the Gazette bundle's styles, not this file.

## Reserved height (Nov. 27, 2026)

Owner report: "We have a little jump when it loads." Measured on the live front page (Chromium layout-shift entries, 390 and 1366 px): when
`home-scoreboard.js` arrives after the stories have drawn, the panel pushes `#sh-main` down by its full height (CLS 0.77 on a phone, 0.52 on
desktop with the script 2.5 seconds late). The Nov. 21 same-frame mount only helps when the script wins that race.

- The script now saves the room the panel takes (`localStorage gbm_lsb_h`: width, height, time), measured from where the panel starts to
  where `#sh-main` starts, so margin collapsing is already counted. It is saved only in the default view (All tab, nothing expanded).
- The loader embed reads that value before anything else and adds one rule that holds the same room open as a top margin on `#sh-main`
  until `#gbm-lsb` is in the page (`:has`), for the same viewport width (media query, plus or minus 24 px) and for six hours.
- When there is nothing to show the script adds `gbm-lsb-off` to `<html>` and clears the saved value, which releases the room at once.
  The loader also removes its rule after eight seconds in case the script never arrives.
- Same test after the change: CLS 0.000 at 390 px and 0.002 at 1366 px with the script 2.5 seconds late.
- Not covered: a first visit with nothing saved still moves once if ESPN answers after the stories draw.
