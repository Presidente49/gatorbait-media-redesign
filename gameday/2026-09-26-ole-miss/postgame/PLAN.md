# Postgame package: Florida vs. Ole Miss, Sept. 26, 2026

One canonical story, one email for the game, Buddy Martin as editorial lead.

1. **Final score.** The minute loop sets the homepage band to FINAL once ESPN shows it.
2. **Postgame story.** Staff recap, ESPN-verified, built with the halftime pipeline (article.json → build.py → Ricos). The halftime story gets a one-line pointer to it. This story carries the game's one email.
3. **Quotes.**
   - The official Florida Gators Football YouTube channel (UCGy38_kQ5tV_e87Uhs3VCRQ) posts the postgame presser about 1–1.5 hours after the final. Last week, highlights went up at 03:40Z and the presser at 04:56Z.
   - Pull the transcript with vidiq_video_transcript. Also check Gmail for the Scott Burns ASAP transcript.
   - Quote with attribution and embed UF's video. Never download or re-host it.
4. **Magazine.**
   - The issue builder (magazine/build_issue.py) makes a Buddy-led cover with a real Chris Spears game photo. No competitor or watermarked frames.
   - The story cover is `node render-final.mjs <UF> <OM> "<sub>"`, using cover.tpl.html (FINAL pill).
   - The cover emphasizes Florida's score. Swap the colors if Ole Miss wins.
5. Nothing is published or sent without Brenden's yes.
