# Postgame story template: Florida vs. Georgia, Oct. 31, 2026

Fill-in skeleton for the quick final story. Byline: **Brenden Martin** (member for brenden@gatorbaitmedia.com; never member `16433bab`). Voice: `tools/voice/HOUSE-VOICE.md`. AP style: numerals, "Oct. 31", "3:30 p.m.", "said". Straight quotes. No decorative em dashes. Straight news, no opinion.

Nothing here is a fact until it is filled from a source. Delete every `[[ ]]` line you cannot fill. A missing item is cut, never guessed.

## Hard rules (check before publishing)

1. **Stats and scoring plays**: ESPN box score or FloridaGators.com box score only (ESPN event 401856734). Copy numbers from one box score. If the two disagree, hold the number until it resolves.
2. **Quotes**: only from a full transcript (UF Athletics postgame transcripts) or a full recording. No quote from a clip, a tweet or a secondhand recap. If no transcript yet, publish without quotes and add them later as one UPDATE_PUBLISH.
3. **No betting lines**, no spread, no over/under, no "favored by". (A published headline mentioning a line is not a license to repeat it.)
4. **Never cite, name, quote, link or credit Gator Country.** Tips only; confirm elsewhere or leave out.
5. **No fabricated facts**: no crowd size, injury, play description or "turning point" you did not see in the box score, play-by-play or a transcript. Rankings and records come from the latest release at the moment of publishing (fresh-news rule). Do not use last week's poll.
6. Run `python3 tools/voice/gb_voice.py story.txt` on headline, deck, body, excerpt and captions. Resolve the issues.
7. Photo: GatorBait's own ("Photo by [[name]], GatorBait Media.") or properly credited UAA ("Photo courtesy UAA and [[photographer]]"). One distinct permanent Wix Media Manager cover. No repeated photo on the front page.

## Headline brainstorm (GatorBait wordplay; pick after the result is known)

Headlines carry personality and a player name, not wire-service dry. Keep it under about 90 characters, no all-caps. Write the win set and the loss set, then delete the set that did not happen.

If Florida wins:
- `[[Player]] [[verb]] Georgia: Gators [[win phrase]] in Atlanta`
- `Dawg Gone: Florida [[beats/stuns]] No. [[rank]] Georgia [[score]]`
- `Peach State Pickle: Gators [[outlast/outrun]] Georgia in Atlanta`
- `Atlanta Heist: [[Player]]'s [[play]] steals the Cocktail Party`
- `Sack Lunch: Florida's defense [[feeds on]] Georgia` (only if sacks support it)
- `Philo Phlight / Philo Good: [[Aaron Philo]] [[stat-backed hook]]` (only if Philo played)
- `Bulldog Bite Back / Gator Bait Worked: Florida [[hook]]`

If Florida loses:
- `Close, Not Cocktail: Georgia [[holds off]] Florida [[score]]`
- `[[Player]] Fights, Dawgs Prevail in Atlanta`
- `Peach Pit: Gators [[fall short]] against No. [[rank]] Georgia`
- `Gators Bitten in Atlanta: [[the one number that decided it]]`

Rules for headline wordplay: the pun must be true to the game, never mock a player, no betting terms, and test it against the dek so the two do not repeat each other. Write 6, pick 1, put 2 spares in the private receipt.

## Story

**Headline:** [[chosen headline]]

**Deck (one sentence, new information, not the headline again):** [[Florida/Georgia result and the single reason it was decided]]

**Excerpt / meta description (about 150 characters; also what the automatic email shows, so name the writer):** [[By Brenden Martin. Result in one sentence.]]

ATLANTA [[Optional: use "ATLANTA" dateline style only as the site does; otherwise drop]] Florida [[beat/lost to]] [[No. rank]] Georgia [[WIN SCORE]]-[[LOSE SCORE]] on Saturday at Mercedes-Benz Stadium [[in front of a crowd of X, only if ESPN lists attendance]].

[[Paragraph 2: why it matters. Florida's record is now [[X-Y]], [[X-Y]] in the SEC (from ESPN after the final). One sentence on the stakes that is already a published fact.]]

[[Paragraph 3: the deciding stretch. Quarter, clock, play, yard line, from the ESPN play-by-play. Example form: "[[Player]] [[did what]] on a [[N]]-yard [[play]] with [[M:SS]] left in the [[quarter]]."]]

**Scoring plays (from ESPN, in order; copy exactly):**
- [[Q# M:SS: Team, player, play, running score]]
- [[...]]

[[Paragraph 4: standout players, stats from the box score only. Passing: [[name]] [[C-of-A, yards, TD, INT]]. Rushing: [[name]] [[carries, yards, TD]]. Receiving: [[name]] [[catches, yards, TD]]. Defense: [[name]] [[tackles, sacks]].]]

[[Paragraph 5: team numbers that explain the result: total yards [[X-Y]], turnovers [[X-Y]], third down [[X-of-Y vs X-of-Y]], possession [[X:XX-Y:YY]]. Use only the ones that matter.]]

[[Optional paragraph 6: quotes. Only from the full transcript. Attribute with "said". Form: "[[verbatim quote]]," [[Jon Sumrall]] said after the game.]]

[[Closer: look ahead, never restate the score. Florida plays Oklahoma at Ben Hill Griffin Stadium on Saturday, Nov. 7 at 7:45 p.m. ET on SEC Network. Add Oklahoma's ranking only after the Sunday, Nov. 1 polls post.]]

**Sourcing line (end of story, no "Editor's note" heading):** Statistics and scoring plays are from the ESPN box score. [[Quotes are from the UF Athletics postgame transcript.]] [[Photo credit line.]] [[Fuller coverage from Buddy Martin and Franz Beard to follow, only if they have actually been promised and not yet filed; never ghostwrite for them.]]

## Publishing checklist (copy desk, after the text is final)

- Native Blog post under Brenden Martin; existing category and exact-label tags (Gator Football; Postgame); excerpt set; descriptive alt text on cover; SEO description via Item SEO Tags.
- Publishing a new post triggers native automation `e4ff0da9` (email + Spaces push). That is a subscriber email: needs Brenden's yes first. See RUNBOOK.md step 0.
- After publish: independent live read of the public URL (byline, one cover, full ending), then the magazine and feed steps.
