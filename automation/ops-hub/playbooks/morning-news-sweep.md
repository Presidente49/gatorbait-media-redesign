# Morning news sweep

Brenden, Sept. 28, 2026: "Why don't we look at the news the first thing in the morning… Since we are the news, why don't we do that for everything in the morning… all the time. This is the automation I'm talking about."

It runs every day at 6:28 a.m. ET, game day or not, in the game-day desk session. That session is the one writer for posts, the band and home code. The routine is "Morning news sweep". This is the automated form of the "Morning open → Editorial" step in `daily-operations.md`.

Why it exists: on Sept. 26, ESPN had Kewan Lacy ruled out at 9:15 a.m. ET, and GatorBait published about five hours later (Lesson 37). A 7:44 a.m. Jarvis brief reads this sweep's report and tells Brenden.

## 1. Know what we already have
- Wix Blog posts published in the last 48 hours, plus open drafts (title, slug, ID, `hasUnpublishedChanges`).
- Open items and holds in #34. The email hold stays on while `account-details` isn't `ACTIVE`.

## 2. Sweep: every Gators sport, recruiting, and SEC news with a Florida angle
Cover what happened since the last sweep. Stop at about 15 fetches and list anything left unchecked.
- **ESPN team news JSON.** Use TinyFish `fetch_content` with format html and ttl 0; strip the HTML wrapper the same way `automation/florida_stats_import.py` does.
  - Football: `https://site.api.espn.com/apis/site/v2/sports/football/college-football/news?team=57&limit=15`
  - Men's basketball: `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news?team=57&limit=15`
  - Women's basketball, baseball, softball and the rest: the matching ESPN endpoint, when the sport is in season.
- **UF's own releases** come through Gmail: `from:gators.ufl.edu OR from:floridagators.com newer_than:1d`. `floridagators.com` blocks the fetcher.
- **Gators Wire:** `https://gatorswire.usatoday.com/` headlines.
- **Polls, CFP and SEC** releases, Sunday through Tuesday.
- **A TinyFish `search` for "Florida Gators"** over the last 24 hours, for what the feeds missed: Gainesville Sun, the Alligator, On3 and 247 headlines. For paywalled pieces, take the headline and the fact only. Never copy another outlet's text.

## 3. Decide each item
For every item, write down four things: what happened, who reports it, whether it's confirmed, and whether GatorBait already has it.
- **We have it, and it changed:** update the existing post in place, with a dated "Update:" line. Don't make a new post (Lesson 36).
- **Confirmed, and we don't have it:** write and publish a GatorBait story now, in the house voice (`gatorbait-writer` skill).
  - "Confirmed" means an official source (UF, the SEC, a school, or a player's or coach's own on-record words) or two independent credible outlets.
  - Attribute every fact. Never invent a quote.
  - Use a credited photo (the Chris Spears archive first) or a type-led GatorBait graphic. Never AI art.
  - Tag it per `automation/blog-tagging/README.md` and set the category. The byline is GatorBait Staff unless a writer's name applies.
  - Run the copy desk: check names and numbers against `editorial-desk.md`.
- **Breaking** (injury, transfer, commitment, suspension, coaching change, schedule change): follow the "Breaking news = maximum share" order in `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md`. The email step still has to pass the send governor.
- **Unconfirmed, rumor or analysis:** make a draft with [CHECK] on anything unverified, or just list it in the report.
- **No Florida angle:** skip it.

**Front page:** if a morning story is the day's lead, update the Home Code pin and the band through the fingerprinted process. Re-sync the repo copy in the same pass (Lesson 44).

## 4. Email and social
- There's no morning email by default. Any list send runs `automation/newsletter/send-governor.js` first and goes only on `ok: true` (Lesson 48).
- **Social:** write paste-ready copy for Brenden until Metricool has networks connected.

## 5. Report
Post one comment in #34 titled "Morning news sweep, <date>", listing:
- **Published:** title and link.
- **Updated:** what changed.
- **Drafted:** what's still unverified.
- **Skipped:** with the reason.
- **Needs Brenden:** marked `@Jarvis — needs Brenden`.

If there was no news, say so in one line. Log each item in `docs/INBOX-DESK-LOG.md` under "Morning sweep", then commit and push.

## Guardrails
- Only the game-day desk session runs this, so it stays one writer per object.
- Never publish over a post that has unpublished edits. Never republish or resend as a test.
- Don't send email outside the send governor.
