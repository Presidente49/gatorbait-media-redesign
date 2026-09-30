# The Buddy Line — show-night one-liner cards

**Format:** One 1080x1350 (4:5) card per show night, built around a single Buddy Martin line lifted verbatim from his newest gatorbaitmedia.com column, plus one or two ESPN-cited numbers and the show tease. It is different from Jarvis's homepage work (The Road Ahead season band, The Tunnel game-day opener): those live on the site; this lives on Facebook and YouTube and sends people to the show and the column.

## Cadence

| Slot | Post time | Card angle | Source column |
|---|---|---|---|
| Monday | 6 p.m. ET | Weekend result, Buddy's verdict | Buddy's postgame column (Sat. night/Sun.) |
| Wednesday | 6 p.m. ET | The week's practice storyline (Sumrall's "Bloody Tuesday," "one game at a time") | Buddy's Monday/Tuesday column |
| Thursday | 6 p.m. ET | The look-ahead or big-picture take (polls, FPI, playoff math) | Buddy's midweek column |

Three cards a week, every week of the season, always three hours before the 9 p.m. ET stream on YouTube and facebook.com/thebuddymartinshow. Same card is posted to the Facebook page feed and the YouTube Community tab; the quote line doubles as the stream's thumbnail text when we want it.

## Anatomy of the card

1. Kicker: THE BUDDY LINE (orange block, Barlow Condensed 800).
2. Tag: two or three words naming the beat (Ole Miss recap, Bloody Tuesday, FPI check).
3. The line: Buddy's own words, 5 to 9 words, one word or phrase in orange. Must appear in the published headline or excerpt.
4. Sub line: one sentence of context, also from the published story.
5. Byline: "— Buddy Martin, gatorbaitmedia.com".
6. Stat strip: two numbers, each one cited to ESPN (`sports-live/scoreboard.json`) or to the story.
7. Footer: "Tonight 9 p.m. ET / The Buddy Martin Show / Live" and "YouTube + facebook.com/thebuddymartinshow".

Palette is Swamp Night only: navy #07122e, blue #0021a5, orange #fa4616, ink #f3f5fa. Fonts are Barlow and Barlow Condensed only.

## Who makes it and how long it takes

- **Who:** the social director (me). Buddy does nothing extra; the line comes from a column he has already filed. Brenden approves the first week, then it runs on a standing approval unless a card quotes something he flagged.
- **Time:** about 10 minutes per card, 30 minutes a week: pick the line (3 min), fill the template (4 min), render and post (3 min).
- **Tool:** a static HTML card rendered by our own script, not Canva. `preview.html` in this folder is already the template; the render step is a small `render-buddy-line.mjs` that reads a five-field JSON (day, tag, quote, sub, stats) and uses the same Playwright dependency `sports-live/qa-front-page.mjs` already uses to screenshot the card at exactly 1080x1350. Barlow is loaded from the repo's local font files at render time so the PNG never depends on the network. Canva is the fallback if Brenden would rather drag and drop; the layout translates one-to-one.

## Rules

- Quote only what is published. No paraphrase inside the quote marks.
- Every number carries a source: ESPN scoreboard or the story URL. If a number is not in one of those two places, it does not go on the card.
- AP style: No. 8, Sat., Oct. 3, 3:30 p.m. ET, 9 p.m. ET.
- One card per show night. Never repost the same line twice in a week.
- No clip, no audio, no third-party photos: CSS-only art keeps it free of rights questions and renders in seconds.

## The three captions

### Card 1 — Monday, Sept. 28 (Ole Miss recap)

> "The Swamp gets its swagger back." Buddy Martin on Florida 52, Ole Miss 28, Jadan Baugh's historic day and a 4-0 start for the first time since 2019. The Buddy Martin Show is live tonight at 9 p.m. ET on YouTube and Facebook. Read Buddy's column: https://www.gatorbaitmedia.com/post/the-swamp-gets-its-swagger-back-and-welcomes-the-folks-from-the-grove-in-rude-fashion
>
> #GoGators #Gators #BuddyMartinShow #GatorBait

Card numbers: 52-28 over No. 4 Ole Miss, 4-0, No. 8 (ESPN, `sports-live/scoreboard.json`). "First time since 2019" is from Buddy's story excerpt.

### Card 2 — Wednesday, Sept. 30 (Bloody Tuesday)

> "Put down the poll, Gators. Missouri is waiting." Jon Sumrall is making his team pay the toll on "Bloody Tuesday," and Buddy Martin has a new definition for "one game at a time." No. 8 Florida (4-0) plays at No. 25 Missouri on Sat., Oct. 3, at 3:30 p.m. ET on ABC. Buddy breaks it down live tonight at 9 p.m. ET on YouTube and Facebook. Read the column: https://www.gatorbaitmedia.com/post/put-down-the-poll-gators-missouri-is-waiting-and-there-s-a-new-definition-for-one-game-at-a-time
>
> #GoGators #Gators #BuddyMartinShow #GatorBait #Mizzou

Card numbers: Sat., Oct. 3, 3:30 p.m. ET, ABC, at No. 25 Missouri, Memorial Stadium (ESPN, `sports-live/scoreboard.json`). "Lost three of its last four trips to Columbia," "pay the toll" and "Bloody Tuesday" are from Buddy's story excerpt; "Bloody Tuesday" and "pay the toll" also appear in Brenden's story https://www.gatorbaitmedia.com/post/pay-the-toll-sumrall-buries-the-ole-miss-win-braces-for-bloody-tuesday-before-missouri

### Card 3 — Thursday, Oct. 1 (FPI check)

> "Cue up 'Happy Days Are Here Again.'" Florida's updated ESPN FPI projections have the Gators favored in every remaining game except Texas and Georgia, and Buddy Martin says that math comes out to 10-2 and a ticket to the playoff. Is he right? Tell him tonight at 9 p.m. ET, live on YouTube and Facebook. Read Buddy's column: https://www.gatorbaitmedia.com/post/bound-for-the-cfb-top-ten-cue-up-happy-days-are-here-again
>
> #GoGators #Gators #BuddyMartinShow #GatorBait #CFBPlayoff

Card numbers: 4-0, No. 8, 2-0 SEC, at No. 25 Missouri Sat. 3:30 p.m. ET on ABC (ESPN, `sports-live/scoreboard.json`). The FPI sentence and "10-2" are from Buddy's story excerpt.

## Sources used

- ESPN scoreboard snapshot: `sports-live/scoreboard.json` (updated 2026-09-29T02:17:33Z): Florida 4-0, 2-0 SEC, No. 8; W 52-28 vs. No. 4 Ole Miss on Sept. 26; next at No. 25 Missouri, Oct. 3, 3:30 p.m. ET, ABC, Memorial Stadium.
- Published stories (`gazette-live/posts.json`): the three Buddy Martin columns linked above, plus Brenden Martin's "Pay the Toll" story for the "Bloody Tuesday" cross-check.
