# Florida at Florida State pregame magazine, Nov. 27, 2026

Owner requested launch, all current pregame coverage, Franz Beard and Buddy Martin featured on the cover, Loren Meadows and the Soothsayer included, today's Behind the Sticks, YouTube clips and a combined press-conference preview. Production runs in the cloud.

## Edition

- Input: `sports-live/magazine-issue-fsu.json`. Existing pregame renderer, with both full schedules and open roster tables.
- Full copy: Franz's Nov. 27 Soothsayer; Loren's Nov. 27 analysis; Buddy's Heartburn, Football Matters and Sumrall Thanks columns; Franz's Nov. 24 Thoughts and Nov. 23 Glory Days; the Schumann news story and receiver-room notebook. Original dates and authors retained; photo/byline furniture omitted. Straight quotes and three punctuation-only dash changes; writer voice preserved. Older coaching-search discussion is dated and contextualized. Current ESPN Baugh listing is distinguished from the preserved column.
- Today's Behind the Sticks is post `83559094-841c-4c00-90eb-f1e8720f1464`, `/post/behind-the-sticks-florida-at-florida-state`, published Nov. 27. Current native artwork is `ae876a_352f9f9fecb542bf8ec92038ceb369b5~mv2.jpg`. It runs as a clearly labeled preview and original-page link because native draft access is restricted. The earlier Nov. 8 article is excluded. Franz's subscriber-only Thanksgiving memory is also an excerpt/link, preserving access.
- Cover: `d3cfa5_205d0a41404348efbd6fffca8c12f31b~mv2.png`, 1024x1536, corrected to equal prominent Franz Beard and Buddy Martin billing. Cloud image-tool design authorized by the owner; AI-assisted layout using Chris Spears' Nov. 21 photograph. Not attributed to an external normal-Chat browser session. Loren's permanent supplied Black Friday graphic is `d3cfa5_45b17c01a21648b6817f9299b38fd829~mv2.png`.
- Video: original-audio 107.4-second press preview, two complete Jon Sumrall answers from Nov. 23, courtesy Florida Gators Football/UAA; permanent READY video `d3cfa5_ac2cae45766841a9a1ecf1fa41901e10`. 1280x720, 9,562,478 bytes; SHA-256 `20a98d21280e4538a7d013ba7490a3282cd5d5d14cbaf5785c845586995f2a57`. No paid generation, synthetic narration or public YouTube upload. Additional own-channel YouTube embeds: `GOAFvQcmH-Y` (Philo, Nov. 23) and `4__NPe2N84Q` (preview, Nov. 26).
- Fresh ESPN event `401856759`: Florida 7-4 at Florida State 5-6, Friday 3:30 p.m. ET, ABC. Both 12-game schedules and all 117 Florida/108 FSU roster entries. No prior-week availability report is carried forward.

## Build and verification

`MAG_VARIANT=fsu node sports-live/build-magazine.mjs` builds the existing pipeline; `--check` verifies parity. No custom Python issue builder was created. Optional `issue.videos` alone enables the new video renderer/style and guarded runtime hooks. Editions without videos produce the same bytes as the original builder, verified for Vanderbilt, Kentucky and postgame. FSU alone has a 272 KiB cap for the expanded issue.

Final candidate: build `3a568dd8`, 248,281 bytes. Independent Chromium checks at 320/390/430/1366 verify full-copy equality, all ten rendered story-block endings/bylines, 24 schedule rows, 225 roster rows, real images/fonts, contained cover/Behind artwork, native video metadata and controls, no initial YouTube iframes, correct no-cookie frames on deliberate tap, no overflow or runtime errors. Candidate iframe configuration was tested with a controlled blank YouTube response; this is not proof of YouTube playback. House-voice checker passed; advisory rhetorical markers were reviewed and retained as the writers' voice.

## Release

Single target: existing Magazine embed `1dd74333-ee02-40da-9c93-cf8fd787c129`. Fresh native baseline revision 173. Preserve its ESSENTIAL category, scope, splash and eight-second fallback; change only the immutable edition pin/bundle and name. `rollback-rev173.html` is the exact prior HTML. `make-loader.py <release-sha>` creates the candidate loader. Abort on changed revision or HTML fingerprint.

The owner authorized the website magazine launch. No subscriber email, social send, automation change, account change or Editor site publish is included. Actual provider/public release evidence is recorded separately after execution.
