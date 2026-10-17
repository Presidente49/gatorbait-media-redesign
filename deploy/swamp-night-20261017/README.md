# Swamp Night color repair — Oct. 17, 2026

Brenden's active game-day request is to fix inconsistent colors across the front page, magazine and rest of the website, using the recent Thursday Buddy Martin Show as the reference. The later approved Swamp Night direction is recorded in [issue #34](https://github.com/Presidente49/gatorbait-media-redesign/issues/34#issuecomment-6230312104); it supersedes the earlier Broadcast rollout. The exact Thursday thumbnail could not be visually fetched in this environment, so this repair uses that documented approved palette and does not claim image color sampling.

Use navy-to-black `#07122e` → `#0b0d12`, a restrained ember glow, white Barlow display type and translucent glass modules. Orange `#fa4616` remains on calls to action and numbers. Remove royal-blue slabs, chrome text and slashed bugs. Keep cream story-reading panels.

## Sources and release objects

| Surface | Source | Existing Wix object |
| --- | --- | --- |
| Homepage | `sports-live/broadcast-home.js` | `0c13f955`, before revision 6 |
| Web magazine | `sports-live/src/magazine.css`, `magazine-pregame.css`, issue JSON and generated bundle | `1dd74333`, before revision 109 |
| Shared shell, TV, roster, membership prompts | S4 CSS sources compiled by `build-shell.mjs` into `site-shell.css` | `c66d5b7f`, before revision 9 |
| All News and sections | Existing S2 skin/depth sources and builder | `602fb362` revision 17, `c4b41f6a` revision 2 |
| Story pages | Existing S3 packed stylesheet and builder | `a5452619`, before revision 6 |

One writer owns all Wix changes. Each object is read again immediately before its guarded in-place PATCH; abort on revision or djb2 mismatch. Re-send category ESSENTIAL. No site publish. Exact API HTML backups are in `rollback/`; preserve their bytes, including any final newline. Rollback is an in-place PATCH of the saved HTML at the then-current revision.

The new cover in `cover/` is rendered from the existing HTML source design and exact Chris Spears photograph, using local Barlow Condensed fonts with their OFL license. Original v6 artwork is retained. Only the edition label changes from Friday Pregame to Game Day; player, headline, matchup, photograph, crop and credit stay intact. Production Wix media `d3cfa5_2da2f73321374ea9ac8b6a71583cc142~mv2.jpg` was fetched anonymously at 2204 × 2854 and verified byte-for-byte against the source render before it was referenced by the issue.

## Verification

The source builds reproduce successfully; weekly, pregame and postgame magazine `--check` gates pass, as do canonical six-article parity and the magazine routing contracts. Homepage runtime, 64 links, headlines and photo sources are preserved. S2 markup/scripts and S3 runtime are unchanged. Magazine issue/card JSON changes are confined to cover image metadata. Wednesday's stale generated bundle is deliberately retained unchanged.

Independent browser checks use the actual desktop and phone HTML, real Barlow fonts and candidate code at 320, 390, 430 and 1366 px. They cover the homepage, magazine, All News, an article, About, Contact and TV; the cover receives a separate image review. Candidate and production evidence must remain distinct. The TV iframe's playback cannot be certified from this container, and gradient/photo text contrast receives visual review rather than an unsupported universal automated AA claim. Native Wix consent UI is preserved.

Release pins, provider responses and final public verification are recorded in `release.json` and issue #34 after deployment.
