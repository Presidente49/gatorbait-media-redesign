# GatorBait Writer — running lessons

Add one dated line when a desk catches a new kind of error or Brenden gives a new rule. Keep each entry short and cite the source (issue #34 comment, post ID or owner message). These are lessons about method, not stored facts: never reuse a number from here in an article.

## Owner rules

- **Oct. 10, 2026:** Brenden does not hand out writer assignments. Outside writers' pieces are published as they arrive under their own bylines; game-day and news pieces written by the Copy Desk run under Brenden Martin.
- **Oct. 11:** Fresh news only. Rankings, records, odds and kickoff times come from the latest release at publish time.
- **Oct. 19:** Trusted writers get a quick check (score, core box-score numbers, opponent/date, byline) plus copy-desk formatting. Do not re-report every observation.
- **Nov. 2:** Writer filings from Buddy, Franz, Loren, Eddie, Carlton and Chris go through the copy desk and publish under their own byline without asking. Staff-written stories still wait for Buddy's "Approved" unless Brenden says otherwise. A game story always runs a current photo from that game; if none exists, make a graphic. Chris Spears's photos are ours. A new media ID of the same photograph is still a reused photo.
- **Nov. 2:** Never cite, name, quote, link or credit Gator Country; tip only.
- **Nov. 6:** "Allow all" on the two-part Oklahoma scouting series: research FloridaGators.com as well as ESPN; publish under Brenden Martin after the fact check unless he says hold.
- **Nov. 21, after the Vanderbilt final:** once a game is final the front page carries nothing that looked ahead to it. Previews, picks, availability reports, pregame columns, the live tracker and the halftime story come off the front page (the posts stay live at their URLs). Mechanism: `STALE_BEFORE` and the title test in `sports-live/broadcast-home-light.js`, moved to the new kickoff after each final, plus `python3 automation/scoreboard_feed.py --force` when `scoreboard.json` has not caught up.
- **Nov. 21:** no ellipses in copy, and nothing that reads as machine-written (dash-spliced quotes, three short sentences making one point, a closer that restates the story). This applies to stories other desks post as well; Brenden asked for one to be cleaned after it was live.

## Method lessons

- **Nov. 5, fact desk:** an "all clear" that did not re-query Wix for new posts is not a check. Query the posts list every pass, then read the bodies. A column was missed for about two hours.
- **Nov. 5:** Buddy edits his own columns in the Wix Editor after they publish. Do not re-save over an edit in progress; flag typos (byline, mismatched quote marks, empty paragraphs) to the post's owner.
- **Nov. 5:** Two posts went live sharing one lead image file. Check prior cover usage across current stories before adding a cover.
- **Nov. 6, Condon story:** a player's shooting line (2-3 FG) contradicted his own points (12) and the team's front-line total (15-23); ESPN's box score said 3-6. Always reconcile a player's line against his points and the group total.
- **Nov. 6, UCF women's story:** hometown typo ("Silver Springs") caught against the ESPN roster ("Silver Spring"); the road game at Chattanooga is listed on ESPN+, not SEC Network+.
- **Nov. 6, Soothsayer column:** all seven SEC records, rankings, kickoff times and networks matched ESPN's standings and scoreboard once the conference record came from the standings endpoint (the scoreboard's second record is the home record). "Three weeks ago" for a game 27 days earlier is loose; spreads moved by game day.
- **Nov. 6, tooling:** a Wix MCP call made from a background workflow agent waits on a permission prompt nobody can answer and stalls. Make Wix reads yourself or in a normal subagent. Large API responses can be saved to a file by the tool harness; read the file with a script rather than retyping.
- **Nov. 6:** The scoreboard dates are UTC. After the first Sunday of November, Eastern is UTC minus 5 hours (7:45 p.m. ET shows as 00:45Z the next day).
- **Nov. 16, owner rule (recruiting):** Brenden started a recruiting lane (football and basketball recruiting, transfer portal, NIL) with its own menu link, and approved crediting On3 and 247Sports by name for recruiting facts ("according to …"). ESPN/FloridaGators.com stay the rule for game statistics. Recruiting stories never take the front-page lead. Protocol: [RECRUITING-DESK.md](RECRUITING-DESK.md).
- **Nov. 16, Kentucky game night:** ESPN's play-by-play was corrected twice in-game (a safety first listed as a pass play was a holding call; a touchdown changed scorer and time). Re-pull the scoring summary before every in-game update, and keep the score out of a running headline.
- **Nov. 21, Vanderbilt game night:** a posted story said a linebacker "forced a fumble and returned it 56 yards." ESPN's play-by-play had a teammate forcing it and a 57-yard return. Read the play text for who forced, who recovered and the return length; the scoring summary carries the yardage.
- **Nov. 21:** to lose an ellipsis or a broken phrase inside a quote, rebuild it from passages that are each an exact substring of the transcript (a short partial quote, then a full sentence). Never close the gap by editing the speaker's words.
- **Nov. 21:** games are not weeks. An open date made "seven weeks" wrong for seven missed games; count from the ESPN schedule and the box scores. "One game to play" ignores a bowl; write "the regular-season finale." A career high is checked against ESPN's game logs for every earlier season, including seasons at another school.
- **Nov. 21:** injury detail (grade, ligament, how it was aggravated) needs an official source or our own earlier reporting. Search our published posts by text before keeping it; otherwise print what the availability report and the box scores show.
- **Nov. 21:** a record must sit next to the thing it measures. A column gave the overall record (7-4) as the SEC record (5-4). Same check for home, road and conference splits.
- **Nov. 21:** a credit or caption typed as the first paragraph takes the opening initial. Put the credit in the cover alt text and, if a line is needed, as an italic last line.
- **Nov. 21:** a writer can be typing a filing into the Wix Editor while the copy desk prepares it. An unpublished draft always shows unpublished changes, so that flag does not help; read the draft's `editedDate` and make every write conditional on it. When it moved, the write stopped itself and the copy-desk notes went on issue #34 instead.
