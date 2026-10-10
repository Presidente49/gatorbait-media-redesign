# Job: Social

Read `docs/START-HERE.md` and `docs/SOCIAL-RULES.md`. This lane runs on its own and never touches the site, embeds or the front page.

Each run:
1. List posts published on the site since the last run (blog feed or Wix posts API). Skip any story that already has a post packet.
2. For each new story, write one post packet to `social/queue/YYYY-MM-DD-<slug>.md`: one post per platform (X, Facebook, Instagram, plus a short-video caption when there is a clip). Writer credited, own photo or graphic named, link placed per SOCIAL-RULES, times spaced from other packets.
3. If a social network is connected in Metricool (`getBrandSettings` returns it): schedule the packet's native-media posts with `createScheduledPost`, then move the packet to `social/sent/`. If nothing is connected: leave packets in `queue/` and do nothing else.
4. Game day: kickoff reminder, final score card, and one post per writer postgame column, each within the rules above.
5. Record one line in #34 only when posts were scheduled or something is blocked. Otherwise stay silent.

Never: boost or pay for posts, connect accounts, post a roundup, post a story twice, or post anything the site has not published.
