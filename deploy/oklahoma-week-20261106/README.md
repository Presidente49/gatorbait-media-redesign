# GatorBait Magazine, Oklahoma week edition (Friday, Nov. 6, 2026)

> **v2 revision (Nov. 7, 2026):** the complete nine-story magazine with game guide, both rosters and the Oklahoma depth chart is described in [V2-REVISION.md](V2-REVISION.md) (artifact paths, SHA-256, page counts, credit manifest, QC results, rebuild commands). The v2 PDFs are `print-stage/gatorbait-magazine-oklahoma-week-2026-11-06-v2-letter.pdf` and `...-v2-phone.pdf`. They are held in the repo only; none is uploaded or linked from the web bundle, which still describes the eight-story set below.

**No live Wix, email or embed changes in this package.** Nothing was written to Wix, no embed was patched, no site publish, no PDF upload, no email campaign, no send, no automation change. Wix was read only (`GET /blog/v3/posts/{id}?fieldsets=URL&fieldsets=RICH_CONTENT`, published versions: the first six on the first pass, then all eight again after the Condon post was republished at 21:32Z) plus public page reads and public ESPN box-score reads.

Owner order: #34 comment 6687539275 (Jarvis ack), 6687763254 (send authorization, relayed), 6689912504 and 6690264123 (Meyer and Swamp cover, print format, own photographs; 6689912504 also says the Soothsayer and the Best Fridays wrap belong in the issue). Builder: Claude Code worker under the Jarvis controller. Receipt, image provenance and copy flags: [RECEIPT.md](RECEIPT.md).

## What is here

| Piece | Files | State |
|---|---|---|
| Web magazine bundle | `sports-live/magazine-issue-oklahoma-week.json`, `sports-live/magazine-oklahoma-week.js` (204,656 bytes; cap 217,088), `sports-live/magazine-oklahoma-week-frame.html`, `sports-live/reels/oklahoma-week-cover-20261106.jpg` | Built with eight stories, render QA passes. Download section is empty until the PDF links are filled (`[[...]]` placeholders). |
| Candidate loader | `candidate-loader.html` (pin is 40 zeros), `make-loader.py`, `live-loader-before.html` | Not applied. Rollback body and rollback pin below. |
| PDF edition | `print-stage/gatorbait-magazine-oklahoma-week-2026-11-06-print-v1.pdf` (US Letter, 22 pages, 3.6 MB), `...-phone-v1.pdf` (5 x 8.9 in, 30 pages, 2.5 MB) | Built with Chromium only, eight stories. Not uploaded. |
| Email | `newsletter/2026-11-06-oklahoma-week-magazine.mjml` and `.html` | Source and compiled HTML, eight stories (compliance footer unchanged). Not a campaign. PDF button has a placeholder file name. |
| Cover | `tools/magazine-pdf/assets/oklahoma-week-cover-print-20261106.jpg` (print, trim size), poster above (web) | Supplied art, see below. |
| Builders and checks | `magazine/normalize_wix_post.py`, `magazine/verify_against_public.py`, `magazine/issues/2026-11-06-oklahoma-week/` (config, `prepare.py`, `posts.json`, `receipt.json`, `source/` and `source/raw/`), `tools/magazine-pdf/build-week-print.mjs`, `tools/magazine-pdf/check-week-pdf.py`, `qa-oklahoma-week.mjs`, `check-no-placeholders.mjs`, `set-pdf-urls.mjs` | Run results below. |

The eight stories, in reading order (the coordinator's suggested order, kept; the web issue shows the same order top to bottom): (1) Best Fridays with Urban Meyer, Edgar Thompson and Rob Dotson (leads; it matches the supplied cover), (2) Thursday show recap, (3) Franz Beard, the Oklahoma Soothsayer, (4) Franz Beard, Condon and Jacksonville (kept prominent: lead style on the web, wide photo in the email), (5) Loren Meadows, McMiller 42, (6) First CFP Top 25, (7) Buddy Martin, Golden Goose, (8) Buddy Martin, Yost. Stories without an owned photograph (McMiller, Goose, Yost) carry a verbatim pull quote.

## Cover (decision needed)

The cover is **not mine**. CLAUDE.md says final artwork comes only from the approved original, and #34 comment 6689912504 gives the cover art and layout to Codex. The cover here is Codex's print PDF (`d3cfa5_672df0d97bf64db9bd8b599c4b11c35b.pdf`, comment 6690264123), rasterized at 250 dpi at its TrimBox, unchanged. Of the two things the first pass flagged, one is resolved and one still needs a decision:

1. Its "INSIDE" list says **Franz Beard's Oklahoma Soothsayer** (post `59a065eb`). That story is now in the issue (story 3), so the cover and the contents agree. Resolved.
2. The cover's type is Impact, Georgia and Arial (embedded by Codex), not Barlow. Everything the site and PDF set in live type is Barlow.

## Build and check (re-runnable, no secrets)

```
# bodies: save each Blog API response (published version) and normalize; compare with the public pages
python3 -I magazine/normalize_wix_post.py <raw-api.json> magazine/issues/2026-11-06-oklahoma-week/source/<post-id>.json   # raw responses of the two added posts and of the refreshed Condon post are in source/raw/
python3 -I magazine/verify_against_public.py <dir of the normalized bodies> <dir of saved public .html>   # pages named <slug>.html
python3 -I magazine/issues/2026-11-06-oklahoma-week/prepare.py          # reads the committed source/ bodies, applies the written rules, writes posts.json and receipt.json

# web bundle
MAG_VARIANT=oklahoma-week node sports-live/build-magazine.mjs [--check]
node deploy/oklahoma-week-20261106/qa-oklahoma-week.mjs [outdir] [--final] [--offline]

# PDFs (Chromium only)
node tools/magazine-pdf/build-week-print.mjs magazine/issues/2026-11-06-oklahoma-week/issue.json magazine/issues/2026-11-06-oklahoma-week/posts.json /tmp/letter.html
node tools/magazine-pdf/build-week-print.mjs ... /tmp/phone.html --phone
PLAYWRIGHT_PKG=$(npm root -g)/playwright node tools/magazine-pdf/render-pdf.mjs /tmp/letter.html /tmp/letter.pdf
python3 -I tools/magazine-pdf/check-week-pdf.py magazine/issues/2026-11-06-oklahoma-week/posts.json /tmp/letter.pdf

# email
mjml --config.validationLevel strict newsletter/2026-11-06-oklahoma-week-magazine.mjml -o newsletter/2026-11-06-oklahoma-week-magazine.html
node automation/newsletter/check-links.mjs newsletter/2026-11-06-oklahoma-week-magazine.mjml
node automation/newsletter/check-links.mjs --rendered newsletter/2026-11-06-oklahoma-week-magazine.html
node automation/newsletter/validate-unique-images.mjs newsletter/2026-11-06-oklahoma-week-magazine.mjml
```

## Ship order (each live step needs its own claim and approval; none is done)

1. **Decide** the cover type question above, the bylines (the Thursday recap and Best Fridays both sit under the owner account, Brenden Martin), and the profane wording in the Soothsayer ("bitch-slapped", kept as written; it is in the two PDFs only). The earlier question about Franz's unpublished edits on `27b79db1` is settled: the post was republished at `2026-11-06T21:32:10.136Z` and this build uses that body (only two display lines were added, both dropped). Re-read each of the eight posts' `lastPublishedDate` against `magazine/issues/2026-11-06-oklahoma-week/receipt.json` just before shipping; if one moved, re-save the API response, rerun `prepare.py` and the builds.
2. **Upload the two PDFs** to the Wix Media Manager (approved step; nothing here uploads). Files: `gatorbait-magazine-oklahoma-week-2026-11-06-phone-v1.pdf` (Media Manager display name suggestion `GatorBait-Magazine-Oklahoma-Week-Phone.pdf`) and `...-print-v1.pdf` (`GatorBait-Magazine-Oklahoma-Week-Print.pdf`). Note both `d3cfa5_<32 hex>.pdf` Media IDs.
3. **Fill the links**: `node deploy/oklahoma-week-20261106/set-pdf-urls.mjs <phone-id>.pdf <print-id>.pdf`, then rebuild the bundle, run `qa-oklahoma-week.mjs --final`, recompile the email, rerun the email checks and `check-no-placeholders.mjs`. Commit and merge. The download section only appears once the URL passes the usrfiles `.pdf` pattern, so the placeholder build cannot show a dead button.
4. **Pin and patch** (claim first): read embed `1dd74333-ee02-40da-9c93-cf8fd787c129` live, save the body (that is the rollback), check its fingerprint, run `python3 deploy/oklahoma-week-20261106/make-loader.py <saved-live-body.html> <40-hex merge SHA> > new-loader.html` (it refuses anything but one 40-hex pin and a body at or under 15,000 characters), patch with the live revision and category `ESSENTIAL`. No site publish is needed. Verify `/magazine?cb=<anything>` at 390, 430 and 1366.
5. **Email**: create the campaign draft from the MJML (or the compiled HTML), provider preview at 390 and 600, then pair it with one Spaces push (CURRENT-STATE, Nov. 2). The send needs Brenden's own explicit yes (see #34 reply from Jarvis).

### Rollback

- Web: re-patch embed `1dd74333` with the body you saved in step 4. As read from the public `/magazine` page at build time (18:4x UTC), the live pin is `b01c08a17501c550b10db165ce740858fc9d44cf` with `sports-live/magazine-georgia-postgame.js`; `live-loader-before.html` is that body (2,780 characters, djb2 `bdc0a142`), derived from the public page. Use it as the rollback only after confirming its fingerprint equals the live embed's `html` (the page copy is not byte-proven to be the embed field).
- PDFs and email: nothing is live until you upload and send; delete the uploaded media or the campaign draft.

### Adding a story (the Soothsayer `59a065eb` and Best Fridays `5aa23ca4` were added this way)

Save its Blog API response (`source/raw/`), normalize it into `source/`, add an entry to `magazine/issues/2026-11-06-oklahoma-week/issue.json` (`posts`, with `hero` and `rules`; `caption-from-id` takes an optional `stripPrefix`), add its item to `sports-live/magazine-issue-oklahoma-week.json` (`columns.items` or `coverage.items`) and a card to the MJML, rerun `prepare.py` and the builds. The PDF builder reads the post list from `posts.json`, so the PDFs pick it up without code changes. The shared web renderer shows at most six "Also inside" lines on the cover, so with eight stories the two Buddy Martin columns share the sixth line; nothing in `sports-live/src` was changed (other postgame bundles stay as they were).

## Checks run (real output summaries, Nov. 6, evening, eight stories)

| Check | Result |
|---|---|
| Re-read of the published posts | `lastPublishedDate` unchanged for CFP, show, Goose, Yost and McMiller. **Condon `27b79db1` changed:** now `2026-11-06T21:32:10.136Z` (was `13:02:24.150Z`), no unpublished edits. Text fingerprint (FNV-1a over every text run, computed on the Wix side and again on the saved body): the five originals match; the three saved raw copies (Best Fridays `602ac6b6`, Soothsayer `76f8c0fa`, Condon `2ac328d0`) match their live fingerprints. |
| Fact-desk corrections after the re-read (Nov. 6, 23:15Z) | Two one-phrase UPDATE_PUBLISH patches on the live posts, each read back live: Condon `27b79db1` "2-3" became "3-6" field goals (ESPN box score), McMiller `e0e37d66` "Silver Springs" became "Silver Spring" (ESPN roster). `lastPublishedDate` now `23:15:54.552Z` and `23:15:55.015Z`. Source JSON carries the same two swaps; both PDFs rebuilt, and a word-level diff against the previous PDFs shows exactly those two changes (2-3 to 3-6, Springs to Spring) and nothing else. The web bundle and email do not carry either line (unchanged). The earlier "SEC Network+ should be ESPN+" note is withdrawn: UF's own TV release lists SEC+. |
| Bodies vs public published pages (`verify_against_public.py`, pages fetched after the re-read) | 8 of 8 identical, block for block (Fridays 24 blocks, show 24, Soothsayer 37, Condon 20, McMiller 9, CFP 10, Goose 50, Yost 29) |
| `prepare.py` | the five unchanged stories and Condon produce html identical to the previous build; the two new stories add 496 and 1,599 words |
| `MAG_VARIANT=oklahoma-week build-magazine.mjs --check` | current; 204,656 bytes of 217,088 (212 KB cap) |
| `qa-oklahoma-week.mjs` at 320/390/430/1366, real photos and fonts | pass: one root, one h1, no horizontal overflow (page and root), all sections, eight story links (the cover story from its photo, headline and button, each other story once), links site-relative only, no `[[` text, no banned-credit text, six images all decoded, no repeated media id, Barlow applied, no page errors; download section correctly absent in placeholder mode. Screenshots in `shots/` |
| `qa-oklahoma-week.mjs --final` with throwaway fake PDF names (then restored byte for byte; `--check` current afterwards) | pass; the download section renders |
| `check-week-pdf.py` on the print PDF | pass: 8 of 8 stories complete, 0 missing paragraphs, no `http` in the text, no link annotations; 22 pages, US Letter, 3.6 MB |
| `check-week-pdf.py` on the phone PDF | pass: same; 30 pages, 360 x 641 pt (5 x 8.9 in), 2.5 MB |
| `mjml --config.validationLevel strict` | compiles with no errors |
| `check-links.mjs` on the MJML and the compiled HTML | OK: 26 tracked links, 26 unique, full UTM set on each |
| `validate-unique-images.mjs` | pass: 6 image slots, 6 unique |
| Email render at 390 and 600 px (real images) | no horizontal overflow, 6 of 6 images loaded (`shots/email-*.jpg`) |
| `run-stack-qc.mjs` (the Stack template gate) | **not re-run in this pass.** On the first pass it failed ("Missing GatorBait Magazine Newsletter identity", "Too many editorial images") because it checks the older Colorlib Stack template, not this white and orange model. Not claimed as passed. |
| `check-no-placeholders.mjs` | fails today by design: PDF notes and URLs in the issue JSON and bundle, and the PDF file name in the email, are still placeholders |
| `MAG_VARIANT=georgia-postgame build-magazine.mjs --check` | current (unchanged by this PR). `MAG_VARIANT=postgame --check` reports `magazine-postgame.js` out of date; that was already so on `main` before this branch. |
