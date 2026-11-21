# Front-page Top 25 scoreboard (Nov. 21, 2026)

Owner direction, game day: "I want a front page today that is interactive and constantly has a score update so we don't have to tell you."

- **What it is:** `sports-live/home-scoreboard.js`, one dependency-free file. It draws a panel between the header and `#sh-main` on the front page only: the Gators game on top (score, clock, line, TV, links to the game day magazine and the roster), then every ranked game on the slate with tabs (All ranked games, Live now, Final), tap-for-details rows (line, TV, venue, ESPN Gamecast) and a flash when a score changes. Phones show three games and a "Show all" button; desktop shows six.
- **Data:** ESPN's public college football header scoreboard (the feed the site already reads), which carries every ranked game. Polls every 20 seconds while a game is live or within 25 minutes of kickoff, every minute on a slate day, every five minutes otherwise; pauses in a hidden tab and when the visitor is not on the front page. Nothing is written anywhere.
- **Quiet by design:** the panel is drawn only while a ranked game is live, starts within 20 hours or ended within 14 hours. If ESPN is unreachable the last scores stay up with a "reconnecting" note; if nothing was ever read, nothing is drawn.
- **Loader:** `python3 deploy/home-scoreboard/make-loader.py <sha>` prints the body of the Wix custom embed (about 900 characters), which fetches the pinned jsDelivr file on `/` only.
- **Rollback:** disable the embed (`enabled: false`) or point the loader at an earlier commit. No post, page or other embed was changed.
- **QA:** run on the live front page with the script injected and ESPN's feed mocked (pregame, live with score changes, no slate) at 320/390/430/1366 px: no overflow, no script errors, tabs and details work, a score change flashes and updates in place, and the panel stays out on a day without ranked games.
