---
name: gatorbait-writer
description: "Use when writing a GatorBait Media article — a game recap, quick postgame update, pregame scouting piece, or news item — from research and/or rough notes, in GatorBait's house voice. Also the copy-desk checklist for writer filings."
---

# GatorBait Writer

Turns research and/or rough notes into a publish-ready GatorBait Media article: a game recap, a quick postgame update, a pregame scouting piece, or a news item. Applies to all GatorBait content: football, basketball, the Buddy Martin Show and the site's expansion. It operates under Master Control; it never authorizes a live write, a subscriber email or an automation change by itself.

This file is the committed copy of the skill. The running log of what the desks have learned is [references/LEARNINGS.md](references/LEARNINGS.md). Add a dated line there (by pull request) whenever a desk catches a new kind of error or the owner gives a new rule.

## Hard rules (these win over everything below)

- **Sources for facts:** every stat, record, ranking, date, time and TV detail comes from ESPN or FloridaGators.com (UAA), and for the opponent's side from the opponent's official athletics site. Never from memory, never from another outlet's number.
- **Gator Country:** never cite, name, quote, link or credit it. Read it only as a tip, then confirm elsewhere or leave the item out. (An older version of this skill listed it as a research source; that is withdrawn.)
- **No invented quotes, stats or names.** Quotes come from a full primary source (UF transcript, press-conference video, our own published post). No transcript yet means write without quotes and say fuller coverage is coming.
- **Fresh news only:** rankings, records, odds and kickoff times come from the latest release at the moment of publishing. If the fresh number is not out, leave the line out.
- **Photos:** a game story runs a current photo from that game; if none exists, make a graphic. Chris Spears's photos are ours. UAA/UF photos follow `docs/PHOTO-ATTRIBUTION.md`. Every cover is distinct and credited, and no photo repeats across current stories (compare the pictures, not the media IDs). Open every image and look for a third-party watermark before using it.
- **Style:** Barlow only, AP style for dates, times and titles, straight quotes in agent-written copy, real rich formatting. Run `tools/voice/HOUSE-VOICE.md` review and `python3 tools/voice/gb_voice.py` on the final headline, deck, body, excerpt and captions.
- **Hard lines:** no subscriber email send, automation on/off, payment or membership change, DNS or account connection, or deletion of live content without Brenden's explicit yes.

## Step 1: Research

Official first, then cross-check:

1. FloridaGators.com: game notes, depth chart, availability, rosters, and the press-conference transcripts UF Athletics emails (Scott Burns; Gmail search `from:Scott Burns transcript`).
2. ESPN JSON, which the cloud container can reach with curl (the gatorbaitmedia.com site itself is not reachable from the container; use the Wix API to read our own posts):
   - scoreboard: `site.api.espn.com/apis/site/v2/sports/{football/college-football|basketball/mens-college-basketball|basketball/womens-college-basketball}/scoreboard?dates=YYYYMMDD&groups={80 football|50 basketball}&limit=400`
   - `summary?event=<id>` for box scores and team totals, `teams/57/schedule` (Florida is team 57 in every sport), `teams/57/roster`, and `apis/v2/sports/football/college-football/standings?group=8` for SEC records.
   - On the scoreboard, `records[1]` is the home record, not the conference record. Use the standings endpoint for conference records. Event dates are UTC; Eastern is UTC minus 5 hours after the first Sunday of November and minus 4 before it.
3. Other outlets (247Sports, On3, Yahoo, CBS, SI, Saturday Down South, OnlyGators) and beat X accounts are leads and context only. Confirm the number on ESPN or FloridaGators.com before it goes in.

A single dedicated recap is more reliable than a live blog or gamecast, which can be served from a stale cache. Cross-check a final score on two independent sources before writing a game as over.

## Step 2: Confirm before writing as final

Never write a game as decided until it is final on ESPN. If sources disagree on a stat, do not average or silently pick one; investigate (the official box score usually settles it) and flag what stays unresolved.

## Step 3: Structure

Beat-writer conventions, not play-by-play.

- **Lede:** the outcome and why it matters.
- **Body:** turning points and standout performances; stats support the narrative; quotes placed to reinforce a point.
- **Closer:** never restates the score. Looks ahead (next opponent, date, TV from ESPN) or ends on a sourced quote.
- **Pregame scouting piece:** open on the stakes and the matchup; a short key-numbers box (record, ranking, yards per game and rank, with the source); "what to watch" by unit (our defense against their offense, our offense against their defense); availability only from the official report or a release, labelled with its date; end on the next date. Use real names from both rosters, which also serves as natural keywords.
- **Two-part series:** Part 1 and Part 2 each stand alone, name each other in plain text, and use different covers.

## Step 4: Headline

GatorBait voice with player-name wordplay and personality ("Baugh Game"), not wire-service dry. YouTube title rules (no punctuation, front-loaded keywords, 50-70 characters) apply to video titles only.

## Step 5: Format and bylines

- Short paragraphs (2-4 sentences). AP style: numerals, "Sept. 12", "5:30 p.m.", "said".
- A writer's piece runs under that writer's member and keeps that writer's voice. Pieces the Copy Desk or an agent writes run under Brenden Martin's verified member (the member for `brenden@gatorbaitmedia.com`), never member `16433bab`, and carry no invented personal byline. Chad Ritch is not staff.
- Voice hierarchy: Franz Beard and Buddy Martin carry the top-tier personal/column voice; Loren Meadows covers football gameday and women's basketball; Eddie Gilley covers everything else; Chris Spears is the credentialed photographer and also files.
- Category, member and tag IDs: read them off a recent live post of the same type (`GET /blog/v3/draft-posts/{id}`); do not trust remembered IDs.
- Cover: custom permanent image in the production Wix Media Manager, matching hero, `media.displayed` on, descriptive alt text that carries the credit. See the cover gate in `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md`.

## Step 6: Copy-desk checklist for writer filings

Quick-check scope for trusted writers (Oct. 19 clarification): score, core box-score numbers, opponent and date, byline. Preserve the voice. Fix only typos, spacing, empty or stray paragraphs, alt text, cover, category, tags, meta and facts the primary sources contradict. Catch list, from real misses:

- Reconcile every individual stat line with the team total and the player's points (a "2-3 from the field" line did not fit 12 points; ESPN had 3-6).
- Hometowns and spellings come from the ESPN roster ("Silver Spring", not "Silver Springs").
- A road game is streamed by the home team's platform (ESPN+), not the SEC's.
- Recompute relative dates ("three weeks ago", "tonight") against the publish date.
- Point spreads and odds move; flag a printed line, do not "correct" it.
- Rebound totals on ESPN include team rebounds; confirm before changing.
- Dates: Florida beat Texas on Saturday, Oct. 17 in Austin (not Oct. 18).
- Quote marks mismatched or stray; one-letter stray paragraphs; blank paragraphs.
- Profanity in a column: flag it to Brenden; do not edit the writer's voice.
- A post with `hasUnpublishedChanges` is being edited by someone in the Editor: read the published version, flag, do not re-save over it.

## Step 7: Publishing and approval (current routing)

- **Writer filings** (Buddy Martin, Franz Beard, Loren Meadows, Eddie Gilley, Carlton Reese, Chris Spears; email or Writer Portal): copy desk, then publish under that writer's byline and member without asking (Brenden, Nov. 2, 2026).
- **Staff and agent-written pieces:** full claim check against the primary sources. They wait for Buddy Martin's reply of "Approved" (buddymartinshow@gmail.com) unless Brenden says otherwise for that piece. Record which applied.
- **Distribution:** publishing a new post fires the native automation `e4ff0da9` (email and Spaces push for each new post). An update-publish of an existing post does not re-fire it. So: write drafts unpublished first, one canonical post per angle, check for duplicates, never publish a test post, never toggle the automation. A hand-built list email (a magazine, a campaign) needs Brenden's own yes and a paired Spaces push, and the daily list-email limit applies.
- **Editing live posts:** one UPDATE_PUBLISH PATCH with a field mask per post; metadata-only edits must not move the publication timestamp.
- **After publishing:** open the page with a cache-busting URL at 390, 430, 1366 and 1920 px wide, check the byline, lead image, full copy and ending, record the canonical URL and checks in GitHub issue #34, then hand the exact item to Muse (`skills/gatorbait-muse-handoff/SKILL.md`).

## Step 8: Quick-update close-out

For a fast straight-news post right after a game, end with an editor's note that deeper coverage is coming, for example:

> *Editor's note: More to come — full postgame analysis from Franz Beard and Buddy Martin.*

## Related skills

[Newsroom Intake](../gatorbait-newsroom-intake/SKILL.md), [Editorial](../gatorbait-editorial/SKILL.md), [Publication QC](../gatorbait-publication-qc/SKILL.md), [Muse handoff](../gatorbait-muse-handoff/SKILL.md).
