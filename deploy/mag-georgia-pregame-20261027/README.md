# Georgia Week pregame magazine (Game Day edition), prepared Oct. 27, 2026

**Nothing is live.** No Wix write, upload, embed patch, publish, email or automation change was made. This folder is the ready-to-ship package for Jarvis: the issue file, the cover, both PDFs and the exact loader/patch steps. Live target: Oct. 29-30, ahead of No. 17 Florida vs. No. 3 Georgia, Saturday, Oct. 31, 3:30 p.m. ET, ABC, Mercedes-Benz Stadium, Atlanta (neutral site).

## What is in the issue (`sports-live/magazine-issue-pregame.json`, id `2026-10-30-game-day-georgia`)

Built by `make-issue.py` from ESPN snapshots read Oct. 27 (summary for event 401856734, SEC scoreboard for Oct. 31, AP Top 25 Week 9, both teams' statistics, schedules and rosters) and the published posts (`posts.json`, pulled from the public pages by `tools/magazine-pdf/extract-posts.py`). The figures the issue uses are in `espn-figures.json`. The script asserts every headline number (ranks, records, line, total, predictor, leaders) before it writes.

- **Cover story:** Buddy Martin, "Florida-Georgia: Sumrall Knows the Math. He's Just Not Telling Georgia Who Takes the Snap." (post 3b68fc68)
- **The Lead:** Franz Beard, Thoughts of the Day, Oct. 27 (3e8ceb63)
- **The Big Picture:** Brenden Martin, "Snubbed in Atlanta: GameDay passed, Kirby shrugged, Florida noticed" (ab92eaf5)
- **Georgia week cards (10, newest first):** the Buddy Martin Show live post (567752cb), Franz Oct. 26 (7d100759), Brenden's Georgia-week guide (39fb6170), Buddy "The Ninth Game Is Collecting Its Toll" (6d3f519b), Franz "The Gators still have a pulse" (e06128a4), Franz Oct. 24 (dc93681a), Franz Oct. 23 with the Soothsayer (94d174bf), Buddy on Chris Doering (ccd34030), Buddy on the open date (c217909f), Franz "Jones vs. Philo" (490e2a21)
- **Reference desk:** the roster/schedule guide (`/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#roster`, `#schedule`), the Georgia-week guide, The Buddy Martin Show page. "Next up: Oklahoma, Nov. 7, 7:45 p.m. ET, SEC Network" (FloridaGators.com, Oct. 26).
- **The game:** AP No. 17 Florida 5-2 (3-2) vs. AP No. 3 Georgia 6-1 (4-1); Georgia -11.5, total 55.5 (DraftKings via ESPN pickcenter); ESPN predictor Georgia 82.1, Florida 17.9; series UF trails 44-57-2 (FloridaGators.com; Georgia's count is 58-44-2 with the disputed 1904 game). The series tiles show the last five (all Georgia, all in Jacksonville); `src/magazine-pregame.js` learned `site: "N"` = "Neutral" for them (one-line change).
- **By the numbers, tale of the tape (11 rows), four keys:** ESPN team statistics, seven games each. Points for and against are figured from ESPN's final scores (ESPN's own Georgia "points allowed" line, 108/15.4, is three points under the sum of its final scores, 111/15.9, so the issue says how it was figured).
- **What we're watching:** three lines quoted from the writers' published columns (Buddy, Franz, Brenden). No emailed lines.
- **Availability:** ESPN lists no injuries for either team as of Oct. 27; the official SEC report posts before kickoff. Rosters: ESPN, 100 players each.
- **Saturday in the SEC:** the five SEC games on Oct. 31 with ESPN kickoffs, TV and DraftKings lines; no picks. Franz's Soothsayer picks post Friday; add them to `slate.games[].pick` and rebuild if the issue goes live after they post.
- **How to watch:** FloridaGators.com broadcast information (Oct. 27): ABC (Fowler, Herbstreit, Rowe), ESPN app, Gator Sports Network from 12:15 p.m. ET, SiriusXM 145, WRUF, The Varsity Network; SEC Nation from Atlanta. Links: Monday's live show (YouTube `Uc-hO2his0I`) and the live-show post.
- **Best shots:** five UAA/Hannah White photos from the Texas win that are already in the Media Manager (post covers), credited "Photos courtesy UAA and Hannah White (FloridaGators.com)" in the section, in each alt text and in the masthead. Chris Spears's file photos carry "Photo by Chris Spears, GatorBait Media".
- Stats checked against ESPN: rankings and records also on FloridaGators.com's Oct. 27 broadcast note ("No. 17 Florida Gators and No. 3 Georgia Bulldogs ... 3:30 p.m. ET, airing on ABC").

Two placeholders stay in the issue on purpose until ship time (`check-ready.sh` fails while they are there):
1. `cover.image.id` = `REPLACE_WITH_WIX_MEDIA_ID_AFTER_UPLOAD` (the cover is not in the Media Manager yet).
2. `pdf.url` = `/post/members-read-the-georgia-pregame-magazine` (the members post that holds the PDFs does not exist yet; the renderer only accepts gatorbaitmedia.com links there).

## Cover (`deploy/pregame-cover-georgia-20261027/`)

`pregame-cover-georgia-1200x1600.jpg` (566,695 bytes, sha256 `b1181610…`), rendered from `cover.html` by `render.js` in the Oct. 9/Oct. 18 portrait style: GATORBAIT masthead, "Magazine", matchup call-out, column list, GEORGIA / WEEK headline, dek "Sumrall's first Florida-Georgia, in a new city: Year 11 against Year One" (Buddy's column), a Gator green #22884C "Halloween in Atlanta" badge; Barlow and Barlow Condensed only; navy, UF orange, white, Gator green; no UF logos or marks. Photo: Jon Sumrall before the Sept. 26 Ole Miss game, by Chris Spears, GatorBait Media (`hero-sumrall-walk.jpg`, Wix media `16b519_fb9b6535ba3046ab86e7d0d05b6579bc`, 3000x2000), credited on the cover "Photo by Chris Spears, GatorBait Media (file, Sept. 26, 2026)". It is the same frame Franz's Oct. 27 column uses as its post cover, in a new portrait crop and treatment; no Gator Country image anywhere. If Brenden wants a fresh frame instead, swap the file in `cover.html` and re-run `render.js`.

## Build and QA

```
MAG_VARIANT=pregame NODE_PATH=/opt/node22/lib/node_modules node sports-live/build-magazine.mjs
NODE_PATH=/opt/node22/lib/node_modules node sports-live/qa-magazine-pregame.mjs /tmp/pg-shots
```
`sports-live/magazine-pregame.js`: **186,642 bytes** (builder cap for the pregame variant 188,416; ship cap 204,800), build `0520f43c`, sha256 `18544cb4…`. QA passed at 320/390/430/1366: no overflow, all ten sections, one h1, 17 images, 32 links, countdown live, no off-site links.

## PDFs (`print-stage/`)

- Print: `gatorbait-magazine-georgia-pregame-2026-10-30-print-v1.pdf`, 28 pages US Letter, 4,526,677 bytes, sha256 `8366734e…`. Built with `PRINT_AVAIL_TOP=1 PDF_JPEG=1 COVER_FILE=deploy/pregame-cover-georgia-20261027/pregame-cover-georgia-1200x1600.jpg node tools/magazine-pdf/build-print.mjs sports-live/magazine-issue-pregame.json deploy/mag-georgia-pregame-20261027/posts.json /tmp/georgia-print.html`, then `PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node tools/magazine-pdf/render-pdf.mjs /tmp/georgia-print.html <pdf>`. Extras (desk column with the points chart, masthead): `tools/magazine-pdf/issues/2026-10-30-game-day-georgia.json`. Three small, env-guarded additions to the shared print builder: `COVER_FILE` (a finished local cover), `PDF_JPEG` (PNG illustrations fetched as JPEG; the two collages were 2 MB each as PNG) and `PRINT_AVAIL_TOP` (availability line under the forecast so the briefing stays on one page); defaults unchanged, and the matchup reads "vs." when the venue says neutral.
- Phone: `gatorbait-magazine-georgia-pregame-2026-10-30-phone-v1.pdf`, 129 pages at 390 x 844 pt, 3,474,127 bytes, sha256 `dd89adad…`, same words and numbers, one column, body 17 pt, nothing under 12 pt, full-bleed photos, Barlow/Barlow Condensed, 77 working links. Built with `node deploy/mag-georgia-pregame-20261027/build-phone.mjs sports-live/magazine-issue-pregame.json deploy/mag-georgia-pregame-20261027/posts.json deploy/pregame-cover-georgia-20261027/pregame-cover-georgia-1200x1600.jpg /tmp/georgia-phone.html [print-pdf-url]`, then `PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node deploy/magazine-2026/postgame-texas/render-phone.mjs /tmp/georgia-phone.html <pdf>`. `build-phone.mjs` is generic over the pregame issue file (the Oct. 18 one was hard-coded to the Texas content). Pass the print PDF's Wix URL as the fifth argument and rebuild once it is uploaded, so the contents page links to it.

Both PDFs are committed (8 MB together, in line with the Oct. 18 files in `print-stage/`).

## Ship steps (Jarvis, in order)

1. Fact pass at ship time: re-read ESPN for the line, total, predictor, AP poll (a new poll posts Sunday, Nov. 1, so Week 9 stands through Saturday), injuries (`summary?event=401856734`) and the SEC availability report on FloridaGators.com; re-run `make-issue.py` against fresh snapshots if anything moved (`python3 -I deploy/mag-georgia-pregame-20261027/make-issue.py <espn-dir> deploy/mag-georgia-pregame-20261027/posts.json`; the asserts stop it if a headline number changed, so update the asserts with the new figure). Add Franz's Friday picks to `slate` if they are out.
2. Upload the cover (`deploy/pregame-cover-georgia-20261027/pregame-cover-georgia-1200x1600.jpg`) and both PDFs to the Wix Media Manager (Import File from the commit-pinned jsDelivr URL, byte-identical read-back, as the Oct. 19 phone PDF was). Set the cover's alt text to the credit.
3. Create the members post `/post/members-read-the-georgia-pregame-magazine` with both PDFs (phone first, print second), or change `pdf.url` in the issue to the post you create. Keep both blog-alert automations off; check them before the publish.
4. Put the cover's media id in `cover.image.id`, rebuild the phone PDF with the print PDF URL (optional), rebuild the bundle, run QA, run `deploy/mag-georgia-pregame-20261027/check-ready.sh` (must print READY), commit, merge the PR, take the merge sha.
5. CDN check: `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@<sha>/sports-live/magazine-pregame.js` returns 200 and its sha256 equals `sha256sum sports-live/magazine-pregame.js` at that commit.
6. Loader: `python3 deploy/mag-georgia-pregame-20261027/make-loader.py <sha> > /tmp/loader.html`. It takes the live rev-119 body (`rollback/1dd74333-rev119.html`, 2,769 chars, read from the provider Oct. 27 13:5xZ, byte-identical to `deploy/mag-phone-pdf-20261019/1dd74333-rev119.html`; djb2 `1ba326cd` with the xor variant the Oct. 19 note used, `6d49f483` with the add variant `make-loader.py` prints) and changes only the marker comment, the bundle name (`magazine-postgame.js` to `magazine-pregame.js`) and the pin. Shell CSS, splash and route sync stay byte-identical; result 2,764 chars (cap 15,000); the zero-sha test prints add `69d16572` / xor `db5ee684`, never PATCH it.
7. GET embed `1dd74333-ee02-40da-9c93-cf8fd787c129` (site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`). If its revision is not 119 or its `embedData.html` is not byte-identical to `rollback/1dd74333-rev119.html`, stop: save the live body as the new rollback and re-run step 6 against it.
8. Guarded in-place PATCH at the current revision (119): change only `embedData.html`; re-send `category: "ESSENTIAL"`, `name`, `enabled: true`, `loadOnce: false`, `position: "HEAD"` exactly as read; no site publish. Expect revision 120; read it back and confirm byte-equality.
9. Verify live with a cache-busting URL at 390, 430, 1366 and 1920 (320 if time): `#gbm-magazine-page.pg[data-issue="2026-10-30-game-day-georgia"]` once, h1 is "Sumrall Knows the Math", countdown running, cover image loads from the new media id, members PDF link resolves, no horizontal overflow. Brenden checks a real iPhone.
10. Record one line in #34 with the revision, pin, fingerprints and the rollback.

**Rollback:** guarded PATCH of `embedData.html` back to `rollback/1dd74333-rev119.html` (pin `7cbf2271`, bundle `magazine-postgame.js`) at the then-current revision, category ESSENTIAL re-sent, no publish. Uploaded media and the members post can stay.

## Unverified / for Brenden
- The cover photo choice (Sumrall file photo, also Franz's Oct. 27 post cover). Alternative frames in the Media Manager: the Nov. 2, 2024 Florida-Georgia gang tackle by Chris Spears (`16b519_e1f8990a…`, Brenden's post cover) or the UAA/Hannah White locker-room photo (`d3cfa5_22e00157…`, 2000x1333, would need a 1.2x upscale).
- Two post covers used as card art are below 1,200 px wide (Buddy's "Ninth Game" card, 1024x602; Doering, 1200x1200) and the Doering card carries the post's own "UAA/SEC" credit as given.
- Real-iPhone check of the phone PDF and the live page (Chromium/WebKit emulation only here).
