# Runbook: Florida-Georgia postgame package, Oct. 31, 2026

Prepared in advance. **Nothing in this directory has touched Wix, email, social or any automation.** Final: ESPN event 401856734, Florida vs. Georgia, Mercedes-Benz Stadium, Atlanta, 3:30 p.m. ET kickoff, ABC. Target: package live within 45 minutes of the final (START-HERE section 5).

Standing rules: one production writer; claim the object in issue #34 before each live write; GET the live object first and save it as the rollback; smallest reversible change; verify live at 390, 430 and 1366 (320 when relevant); never say "fixed" until independently verified; log evidence and rollback in #34 (counts only, no subscriber data). Do not publish the Wix site. Codex is the production writer for Magazine `1dd74333` (START-HERE section 1 historical lanes; the Oct. 19 note says Codex owns the full block). Ask in #34 who holds `1dd74333` before step 5.

## Step 0: What needs Brenden's explicit yes (ask once, one recommendation)

| Action | Why | Recommendation |
|---|---|---|
| Any subscriber email (postgame email MJML, or letting a new post go through `e4ff0da9`) | Hard line. Max one list email per day, and the game-day magazine email already went out today, Oct. 31. | Ask Brenden for a yes to send the postgame email Sunday, Nov. 1 (a new 24-hour window), not tonight. Tonight, publish posts with the email decision made explicitly (see below). |
| Pausing automation `e4ff0da9` so a post does not email | Switching any automation on or off is a hard line | Do not toggle. Ask instead. |
| Publishing the Wix site | Hard line unless needed | Not needed in this package. |

**Critical, native Blog automation `e4ff0da9-65bb-440f-b5a5-5ed94ac3fb31` (rev 4, ACTIVE) emails the subscribed segment and sends a Spaces push on EVERY new post.** Publishing the postgame story is therefore a subscriber email. Because one list email already went out today, publishing a brand-new post tonight would be a second list email in the day. Before the first publish, read the automation and the day's send count, then ask Brenden: "Publishing the postgame story emails the list (second email today). Yes, publish now, or hold the story until after midnight ET?" Do not create, pause or edit any automation or campaign to avoid it. An UPDATE_PUBLISH of an existing post does not replay email (verify on the first one). If Brenden says hold, finish everything below except the new-post publish and the email, and keep the package ready.

## Step 1: Confirm final and gather sources (read only)

1. ESPN event 401856734 is `status: final`. Cross-check the score on FloridaGators.com. Do not write a final score from a live page (stale caches).
2. Save the ESPN box score JSON and play-by-play to the private receipt. All stats come from this.
3. UF postgame transcripts (Scott Burns email) for quotes. No transcript, no quotes.

## Step 2: Write and QC the story

Use `STORY-TEMPLATE.md`. Brenden Martin byline. Run `python3 tools/voice/gb_voice.py story.txt`. Full claim check on every number and name (agent-authored reporting gets the full check). Photo and credit per the template. Publish through the newsroom desk process only after the Step 0 answer.

## Step 3: Feeds that update by themselves (verify, do not patch)

- **Scoreboard and next-game**: `automation/scoreboard_feed.py` runs in workflow `refresh-newsroom-feed` every 5 minutes (hourly off-window, every tick from an hour before kickoff to five hours after). It sets `last` to the Georgia final and `next` to Oklahoma. The story-page "Next:" chip reads `sports-live/scoreboard.json`.
- **Stats page, embed `756655cf`**: the embed reads `https://presidente49.github.io/gatorbait-media-redesign/sports-live/florida-stats.json`, written by `python automation/florida_stats.py --no-embed --feed sports-live/florida-stats.json` in the same workflow, only after the ESPN box score passes the script's consistency checks. **No embed patch is needed.** To force a refresh once the ESPN box score is complete:
  ```
  gh workflow run refresh-newsroom-feed.yml --repo Presidente49/gatorbait-media-redesign
  ```
  (this commits `data:` files to main as the bot; it is the existing job, not a new schedule). Verify: `curl -s https://presidente49.github.io/gatorbait-media-redesign/sports-live/florida-stats.json | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['record'],d['confRecord'],d['through'])"` shows the new record and `through` contains Georgia. If the checks refuse the data, the last good file stays; report it, do not hand-edit the feed.
  Rollback: none needed; the previous good file is in git (`git revert` the bot commit via a PR only if the numbers are wrong).

## Step 4: Up next box, post template embed `14a887e3` (Lesson 91)

Next game: **Oklahoma at Florida, Sat., Nov. 7, 7:45 p.m. ET, SEC Network, Ben Hill Griffin Stadium** (kickoff 2026-11-08T00:45Z).

IMPORTANT: CURRENT-STATE (Oct. 28, rev 29) says the expired Up Next code was removed from this embed, so the `NEXT={...}` string from Lesson 91 may no longer exist. Check first:

```
# 1. GET embed 14a887e3-38ea-4258-ae0b-7d19cf9feead (site 18fb3a4e-d7f6-414a-aeb9-3047db3ea115); save embedData.html to /tmp/14a887e3-live.html
#    and record revision, category (expect ESSENTIAL), position HEAD, enabled, loadOnce=false. This file is the rollback.
node deploy/postgame-georgia-20261031/patch-next-box.mjs /tmp/14a887e3-live.html /tmp/14a887e3-new.html
```
- **Exit 3** (no NEXT object, expected): no patch. Do not add code to the template (it is near the 15,000 cap). Verify instead that a story page chip reads "Next: vs. Oklahoma" once the scoreboard feed has flipped (Step 3).
- **Exit 0**: the script asserts exactly one `var NEXT={...};`, swaps only that object, checks the 15,000-character cap and prints fingerprints (djb2 form from Lesson 99: `h=5381; h=((h<<5)+h+code)|0; (h>>>0).toString(16)`). Compare the "before" fingerprint with the live HTML's fingerprint you compute yourself; abort on mismatch. Then PATCH `embeds/v1/custom-embeds/14a887e3-...` with the **current revision** (re-GET right before), changing only `embedData.html`, re-sending `embedData.category` = `ESSENTIAL` read in that GET, and leaving name, position, enabled, loadOnce and pageFilter as read. Re-GET and confirm the fingerprint equals the "after" value. Verify a story page at 390 and 1366: Up next box says Oklahoma, no other change. No site publish.
- Oklahoma ranking: add only after the Sunday, Nov. 1 polls post (second guarded patch, or via the feed). Never reuse an old ranking.
- Rollback: PATCH `embedData.html` back to `/tmp/14a887e3-live.html` at the then-current revision with category ESSENTIAL.

## Step 5: Postgame magazine on `/magazine` (embed `1dd74333`)

This replaces whatever edition is live (Lesson 92). Say so to Brenden in the one-line report. Skeleton: `sports-live/magazine-issue-georgia-postgame.json`.

1. Fill the JSON (from ESPN and the published posts only). Remove sections you cannot fill (`columns`, `quotes`, `watch`, `damage` are optional; delete the section key and its `contents` item together). Add `flow`, `watch` or `download` only with verified data/assets. Quotes only from a full transcript or the published linked column. Rankings and records fresh, or omitted.
2. Gate: `node deploy/postgame-georgia-20261031/check-no-placeholders.mjs` must exit 0 (no `[[`, no `-1` numbers, no `todo` keys, no Gator Country, no betting terms).
3. Build: `MAG_VARIANT=georgia-postgame node sports-live/build-magazine.mjs` (writes `sports-live/magazine-georgia-postgame.js` and `-frame.html`; the build also fails on a repeated image). Check: `MAG_VARIANT=georgia-postgame node sports-live/build-magazine.mjs --check`. Size cap 200 KB for postgame bundles.
4. Render QA: `node deploy/postgame-georgia-20261031/qa-georgia-postgame.mjs <outdir>` (strict: no placeholders left, no overflow at 320/390/430/1366, all sections, no console errors). Look at the screenshots.
5. Also rebuild the shared bundles and confirm none changed: `for v in "" postgame georgia; do MAG_VARIANT=$v node sports-live/build-magazine.mjs --check; done` (the old `pregame` variant fails on `main` already with a duplicate-image error; not caused by this work).
6. PR with the filled JSON and the generated bundle + frame; merge; take the **merge commit sha** (40 hex).
7. CDN check: `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@<sha>/sports-live/magazine-georgia-postgame.js` returns 200 and its sha256 equals `sha256sum sports-live/magazine-georgia-postgame.js` on that commit (jsDelivr can lag a minute or two). Reels/posters, if used, are static files under `sports-live/reels/` on the same sha.
8. GET embed `1dd74333-ee02-40da-9c93-cf8fd787c129`. Save `embedData.html` as `/tmp/1dd74333-live.html` (rollback) with its revision and fingerprint. Then:
   ```
   python3 deploy/postgame-georgia-20261031/make-loader.py /tmp/1dd74333-live.html <40-hex merge sha> > /tmp/1dd74333-new.html
   ```
   It asserts exactly one 40-hex pin, swaps only sha + bundle name + the marker comment, enforces the 15,000-character cap, and prints input/output chars and djb2 fingerprints to stderr. The input fingerprint must equal the one you compute on the live read.
9. Guarded PATCH of `1dd74333` at the **current revision** (re-GET immediately before): change only `embedData.html`; re-send `embedData.category` = `ESSENTIAL`; keep position, enabled, loadOnce, pageFilter as read. Re-GET: fingerprint must equal the script's output fingerprint. No site publish.
10. Verify live (cache-buster) at 390, 430, 1366: `#gbm-magazine-page.pm[data-issue="2026-10-31-postgame-georgia"]` exactly once, one h1, score correct, every link opens a published post, images load, no `[[`, native page hidden, mobile shell unaffected.
11. Rollback: PATCH `embedData.html` back to `/tmp/1dd74333-live.html` at the then-current revision (category ESSENTIAL). One step. Record the revision numbers in #34.

## Step 6: Homepage and feed hygiene

After the story is published: run the newsroom feed refresh (workflow `refresh-newsroom-feed`, or wait 5 minutes), rebuild the front-page snapshot and deploy by the existing pointer PR (Lesson 87). Do not pin or reorder stories; the order is strictly chronological. No homepage design change. Check the new story's card has a visible `By Brenden Martin` line and a distinct photo.

## Step 7: Postgame email (separate, needs Brenden's yes)

Source: `newsletter/2026-10-31-postgame-georgia.mjml` (draft; not sent; no Wix campaign exists).

1. Brenden's explicit yes to send, and a time. Today's list email already went out, so recommend Sunday, Nov. 1 (next 24-hour window). Run the send governor and the audience check (SUBSCRIBED, VALID or NOT_SET, no hold label, no Do Not Market) from `docs/EMAIL-HYGIENE-2026-09-23.md`; any failure means no send.
2. Fill every `[[ ]]`, `PLACEHOLDER_` and `POSTGAME_*_SLUG` token. Images must be permanent Wix Media Manager assets, distinct. Gate and QC:
   ```
   node deploy/postgame-georgia-20261031/check-no-placeholders.mjs newsletter/2026-10-31-postgame-georgia.mjml
   node automation/newsletter/validate-unique-images.mjs newsletter/2026-10-31-postgame-georgia.mjml
   node automation/newsletter/check-links.mjs newsletter/2026-10-31-postgame-georgia.mjml
   ```
   (`run-stack-qc.mjs` is for the Magazine Newsletter template and also fails the sent game-day email; it is not used here.) Compile check used in prep: `mjml@4.15.3 --config.validationLevel strict`.
3. Build as a Wix draft, preview (unsubscribe footer and business address present), run `automation/newsletter/send-governor.js` and `story-alert-presend.wix.js`. Send only after the yes. Verify delivery from campaign statistics; log campaign id and counts only in #34.
4. Rollback: an email cannot be unsent. Hold it as a draft until the yes; delete an unsent draft only if asked.

## Step 8: Close out

One line to Brenden: what is live, what was replaced (`/magazine` edition), what needs his yes (email). Record in #34: embed revisions and fingerprints, PR and merge sha, rollback files, source checks. At most one "learned:" line.

## Known gaps and traps found while preparing

- Lesson 91's `NEXT` string is probably gone from `14a887e3` (Step 4 handles both cases).
- The stats page embed is feed-driven; Step 3 verifies, not patches.
- `e4ff0da9` emails and pushes on every new post; budget the one-email-a-day cap before publishing.
- The retired Symphony route must not be used. Final artwork, if any new creative is needed, comes only from regular ChatGPT Pro normal Chat; the story and magazine use authentic photos only.
- The magazine skeleton's Georgia-week section uses four already-published posts with verified image ids; the Vernell Brown III Oct. 31 post is left out because its image dimensions are not recorded in the repo.
