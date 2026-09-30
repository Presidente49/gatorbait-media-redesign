# What the big paid Gators sites sell, and what we take from it

Brenden, Sept. 30: "find the most expensive top-rated site for what we do that does the most shit and steal all of it."

Sources (Exa search, Sept. 30): 247Sports Florida VIP join page and Swamp247 "DEAL" posts (Sept. 2025, Apr., June, Aug. 2026); On3 Florida Gators / GatorsOnline join page (Apr. 2026); Rivals join page; Iron: Football Stats app listing (July 2026); FanXI app listing (Mar. 2026); Big Red Chat (Nebraska AI chat); SportDataIQ Pick'em docs; Fantasy Nerds "Coach" AI (June 2026).

## What a Swamp247 or GatorsOnline subscription actually is
1. **The VIP message board.** It is the product. Everything else is a reason to keep paying for the board. Swamp247 sells "Alligator Alley," a multi-generation community; On3 sells "Swamp Talk," "the largest Florida fan community."
2. **Insider scoop in short form**: "Tidbits," "Recruiting Scoop," "Insider Intel," live chats with the beat writers.
3. **Text alerts** when a recruit commits or a big story breaks. Members get the news first, by SMS.
4. **Recruiting database + Crystal Ball** predictions with the staff's reasoning. Network-wide, expensive to build; not ours to copy.
5. **Network access**: read every team site in the network (know more about UGA and FSU than their fans do).
6. **Mailbag priority**: VIP members' questions go first on the Swamp247 podcast.
7. **Weekly show + podcast** on 30 platforms; Gators Online Show with rapid-reaction videos.
8. **"In your hand"**: a fast mobile app, dark mode, alerts.
9. **Bundles**: Paramount+ thrown in with 247 VIP.

## What the best fan apps add (Iron, FanXI, Big Red Chat, SportDataIQ)
- Pick'em pools with one invite link, trash talk built in, settled automatically every week; season-long "call your shot" cards; confidence tiers; shareable receipts when you were right.
- Live game chat rooms with an AI **Fan Bot** (team-biased, funny) and a **Neutral Bot** (stats, context); live trivia with leaderboards; real-time polls; points and fan status.
- **Your own Top 25 ballot** feeding a community poll, compared against the committee.
- An **AI chat that answers any question about the team** (Big Red Chat: free, no account, "trained to understand Nebraska sports like a true fan"), grounded in history, schedule, matchups.
- Share cards: any game, stat line or ballot becomes a card built for the group chat.
- Prediction threads that open 90 minutes before kickoff, lock at kickoff, ask in-game questions at halftime and the fourth quarter, settle from the box score, crown a monthly champion.

## The GatorBait steal list (what we build, in order)
| # | Take | Our version | Tool | Owner |
|---|---|---|---|---|
| 1 | The VIP board is the product | GatorBait Game Threads on the installed Wix Groups app now; Discourse later when traffic earns it | Wix Groups API (already read live) | Community |
| 2 | Mailbag priority | **Buddy's Porch**: paid members' questions go on The Buddy Martin Show, with a moderation sheet | Wix Forms/Collections + ask-buddy.mjs | Fans |
| 3 | AI chat + trivia | **Ask GatorBait**: a free, no-account chat grounded in our own archive, the schedule and Buddy's columns, with a daily Gator trivia mode and a Fan Bot voice | Cloudflare Workers AI + KV (no API key, free tier) | AI desk (new) |
| 4 | Pick'em with receipts | **Make the Call**: exact-score picks, live crowd distribution, season ladder, shareable receipt card | Cloudflare Worker + D1 | Web |
| 5 | Live game chat | **The Stands**: opens 30 minutes before kickoff inside The Tunnel, member badge, slow mode, quiet state | Cloudflare Durable Objects | Chat |
| 6 | Share cards | **Share GatorBait**: Canvas-drawn cards for every story, the season band and The Tunnel, with UTM tags | Web Share API, no server | Share |
| 7 | Text alerts | Kickoff and commitment alerts through the existing newsletter stack first; SMS needs a provider decision from Brenden | Newsletter automation | Ops |
| 8 | Weekly matchup graphics | Canva brand template regenerated from scoreboard.json every week | Canva | Design |
| 9 | Show clips that perform | vidIQ on the newest show: clips, titles, thumbnail, best posting windows | vidIQ + Metricool | Social |
| 10 | Insider scoop in short form | Buddy-voice post-show column from the Descript transcript | Idiolect + Descript | Writing |
| 11 | Know the opponent better than their fans | Scouting sheet from ESPN JSON feeding The Tunnel | ESPN API via fetch | Research |
| 12 | "Your Top 25 ballot" | Fan ballot inside Make the Call after the pick'em ships | same Worker | Web, later |

## Gator music
Brenden asked about uploading Gator music. The compositions of "Orange and Blue" and "We Are the Boys from Old Florida" are old enough to be out of copyright, but every recording of them (the band, broadcasts) is not, and the site's audio autoplay would be blocked by browsers anyway. Safe path: a short original brass sting for The Tunnel and the show open, made with vidIQ `generate_music` or licensed from a stock library, played only on a tap. Nothing uploaded without a license.
