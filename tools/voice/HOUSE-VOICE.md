# GatorBait house voice and copy-desk release gate

Every new article receives an editorial review, whatever its byline: Brenden, a named contributor or agent-assisted staff copy. Read the complete filing, preserve the writer's reporting and voice, and review the headline, deck, body, excerpt and captions. This is a publishing standard, not an authorship test or a reason to rewrite a columnist into house boilerplate.

Run the read-only check on the final saved copy before release:

```sh
python3 tools/voice/gb_voice.py story.txt
```

`gb_voice.py` reports deterministic house-style issues separately from advisory editing cues. Exit 1 means a house-style issue needs correction or a recorded editorial exception, such as necessary punctuation in a verified quotation. Exit 0 is not editorial approval. The adapted `check.py` uses the vendored [ai-writing-markers catalog](https://github.com/humzakt/ai-writing-markers) only to locate passages for review. A catalog word, punctuation mark, cluster of matches or sentence statistic never establishes AI authorship. No burstiness target, detector score or blanket word blacklist is a release gate.

## Text review

- **Typography:** straight quotes and apostrophes are GatorBait's house preference, not evidence of who wrote the text. Remove decorative em dashes and use periods, commas or parentheses where appropriate. Preserve verified quote words and meaning; never automatically rewrite quotations or a writer's substantive voice. Record any necessary exception.
- **Formulaic framing:** edit canned contrasts such as "It's not X, it's Y" and question/answer openings when they obscure the actual news. Genuine contrasts, interview questions and a writer's purposeful phrasing require context, not blind replacement.
- **Empty transitions and closers:** cut stock openings such as "Here's the thing," unsupported significance claims, repetitive signposting and conclusions that merely repeat the story. Use specific reporting to connect paragraphs.
- **Rhythm:** read adjacent sentences and paragraphs for repeated openings, identical cadence and forced three-part lists. Let reporting determine sentence length; do not insert fragments or synonyms to manipulate a statistic. A legitimate three-item list stays intact.
- **Specifics and sourcing:** name the play, quarter and yard line when relevant. Verify factual claims against dated primary records, distinguish observation, inference and prediction, and check every quoted passage against its full source/context. Follow the publishing playbook's fact-check scope for trusted filings; Brenden/agent-authored reporting gets the full claim check. Hold or qualify unresolved material claims, never guess.
- **Opinion:** columns and labeled grades may carry the writer's supported judgment; beat stories stay straight. Keep the actual byline and accurate source/photo credits. Remove unresolved chatbot citation tokens or markup before release.

Record editorial disposition and factual corrections in the private story receipt, without storing a manuscript in public git. Publication still requires an independent live check; a clean linter is neither fact verification nor a rendered-page pass.

## Rich formatting and distribution art

Use native Wix rich text: useful headings, readable paragraphs and restrained emphasis. Short straight-news stories usually need no subheadings. Grade/list pieces may use short headings and bold run-ins. A pull quote is optional, must be verified and should not duplicate the same passage in the body. Link meaningful words to related reporting. An end-of-story sourcing line can supply credits without a generic "Editor's note" heading.

Keep one intended visible lead photograph or artwork on the website, with honest credit and alt text. A body photo alone does not establish a feed/app cover. Follow [the publishing playbook's cover gate](../../docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md#1b-feed-and-spaces-cover-gate): read back the permanent image, matching hero and `media.displayed`, then separately inspect the actual Spaces list/card. Preserve an appropriate established drop cap for prose and readable section formatting for schedule-heavy columns. Do not disable feed cover display to hide a repeated body image. Presentation repairs must not replay email or push.

## Evidence behind the policy

[OpenAI withdrew its text classifier for low accuracy](https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/) and documented false positives; it is not a basis for accusing a contributor. [AP's July 2026 newsroom standards](https://www.ap.org/the-definitive-source/announcements/ap-updates-newsroom-standards-for-artificial-intelligence/) retain journalist review, sourcing, verification and accountability for assisted output. These sources support review and provenance, not punctuation-based verdicts. This house style never authorizes invented reporting, false bylines or removal of required disclosures.
