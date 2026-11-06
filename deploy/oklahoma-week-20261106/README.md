# GatorBait Magazine, Oklahoma week edition (Friday, Nov. 6, 2026)

**No live Wix, email or embed changes in this package.** Nothing was written to Wix, no embed was patched, no site publish, no PDF upload, no email campaign, no send, no automation change. Wix was read only (six `GET /blog/v3/posts/{id}?fieldsets=URL&fieldsets=RICH_CONTENT` calls, published versions) plus public page reads and public ESPN box-score reads.

Owner order: #34 comment 6687539275 (Jarvis ack), 6687763254 (send authorization, relayed), 6689912504 and 6690264123 (Meyer and Swamp cover, print format, own photographs). Builder: Claude Code worker under the Jarvis controller. Receipt, image provenance and copy flags: [RECEIPT.md](RECEIPT.md).

## What is here

| Piece | Files | State |
|---|---|---|
| Web magazine bundle | `sports-live/magazine-issue-oklahoma-week.json`, `sports-live/magazine-oklahoma-week.js` (203,072 bytes; cap 217,088), `sports-live/magazine-oklahoma-week-frame.html`, `sports-live/reels/oklahoma-week-cover-20261106.jpg` | Built, render QA passes. Download section is empty until the PDF links are filled (`[[...]]` placeholders). |
| Candidate loader | `candidate-loader.html` (pin is 40 zeros), `make-loader.py`, `live-loader-before.html` | Not applied. Rollback body and rollback pin below. |
| PDF edition | `print-stage/gatorbait-magazine-oklahoma-week-2026-11-06-print-v1.pdf` (US Letter, 17 pages, 2.8 MB), `...-phone-v1.pdf` (5 x 8.9 in, 22 pages, 2.0 MB) | Built with Chromium only. Not uploaded. |
| Email | `newsletter/2026-11-06-oklahoma-week-magazine.mjml` and `.html` | Source and compiled HTML. Not a campaign. PDF button has a placeholder file name. |
| Cover | `tools/magazine-pdf/assets/oklahoma-week-cover-print-20261106.jpg` (print, trim size), poster above (web) | Supplied art, see below. |
| Builders and checks | `magazine/normalize_wix_post.py`, `magazine/verify_against_public.py`, `magazine/issues/2026-11-06-oklahoma-week/` (config, `prepare.py`, `posts.json`, `receipt.json`), `tools/magazine-pdf/build-week-print.mjs`, `tools/magazine-pdf/check-week-pdf.py`, `qa-oklahoma-week.mjs`, `check-no-placeholders.mjs`, `set-pdf-urls.mjs` | Run results below. |

The six stories, in the owner's reading order: (1) First CFP Top 25 (cover story), (2) Thursday show recap, (3) Buddy Martin, Golden Goose, (4) Buddy Martin, Yost, (5) Loren Meadows, McMiller 42, (6) Franz Beard, Condon.

## Cover (decision needed)

The cover is **not mine**. CLAUDE.md says final artwork comes only from the approved original, and #34 comment 6689912504 gives the cover art and layout to Codex. The cover here is Codex's print PDF (`d3cfa5_672df0d97bf64db9bd8b599c4b11c35b.pdf`, comment 6690264123), rasterized at 250 dpi at its TrimBox, unchanged. Two things on it need a decision:

1. Its "INSIDE" list says **Franz Beard's Oklahoma Soothsayer** (post `59a065eb`). That story is not one of the six. Either add it (the builder is data-driven; see "Adding a story") or ask Codex for a cover without it. The web poster alt text describes the cover as it is.
2. The cover's type is Impact, Georgia and Arial (embedded by Codex), not Barlow. Everything the site and PDF set in live type is Barlow.

## Build and check (re-runnable, no secrets)

```
# bodies: save each Blog API response (published version) and normalize; compare with the public pages
python3 -I magazine/normalize_wix_post.py <raw-api.json> magazine/build-cache/posts/<post-id>.json
python3 -I magazine/verify_against_public.py magazine/build-cache/posts <dir of saved public .html>
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

1. **Decide** the cover question above, the Thursday byline, and whether Franz's unpublished edits on `27b79db1` are meant to go live (this build uses the published body, lastPublishedDate `2026-11-06T13:02:24.150Z`). Re-read each post's `lastPublishedDate` against `magazine/issues/2026-11-06-oklahoma-week/receipt.json` just before shipping; if one moved, re-save the API response and rerun `prepare.py` and the builds.
2. **Upload the two PDFs** to the Wix Media Manager (approved step; nothing here uploads). Files: `gatorbait-magazine-oklahoma-week-2026-11-06-phone-v1.pdf` (Media Manager display name suggestion `GatorBait-Magazine-Oklahoma-Week-Phone.pdf`) and `...-print-v1.pdf` (`GatorBait-Magazine-Oklahoma-Week-Print.pdf`). Note both `d3cfa5_<32 hex>.pdf` Media IDs.
3. **Fill the links**: `node deploy/oklahoma-week-20261106/set-pdf-urls.mjs <phone-id>.pdf <print-id>.pdf`, then rebuild the bundle, run `qa-oklahoma-week.mjs --final`, recompile the email, rerun the email checks and `check-no-placeholders.mjs`. Commit and merge. The download section only appears once the URL passes the usrfiles `.pdf` pattern, so the placeholder build cannot show a dead button.
4. **Pin and patch** (claim first): read embed `1dd74333-ee02-40da-9c93-cf8fd787c129` live, save the body (that is the rollback), check its fingerprint, run `python3 deploy/oklahoma-week-20261106/make-loader.py <saved-live-body.html> <40-hex merge SHA> > new-loader.html` (it refuses anything but one 40-hex pin and a body at or under 15,000 characters), patch with the live revision and category `ESSENTIAL`. No site publish is needed. Verify `/magazine?cb=<anything>` at 390, 430 and 1366.
5. **Email**: create the campaign draft from the MJML (or the compiled HTML), provider preview at 390 and 600, then pair it with one Spaces push (CURRENT-STATE, Nov. 2). The send needs Brenden's own explicit yes (see #34 reply from Jarvis).

### Rollback

- Web: re-patch embed `1dd74333` with the body you saved in step 4. As read from the public `/magazine` page at build time (18:4x UTC), the live pin is `b01c08a17501c550b10db165ce740858fc9d44cf` with `sports-live/magazine-georgia-postgame.js`; `live-loader-before.html` is that body (2,780 characters, djb2 `bdc0a142`), derived from the public page. Use it as the rollback only after confirming its fingerprint equals the live embed's `html` (the page copy is not byte-proven to be the embed field).
- PDFs and email: nothing is live until you upload and send; delete the uploaded media or the campaign draft.

### Adding a story (for example the Soothsayer `59a065eb` or Best Fridays `5aa23ca4`)

Save its Blog API response, normalize it, add an entry to `magazine/issues/2026-11-06-oklahoma-week/issue.json` (`posts`, with `hero` and `rules`), add its item to `sports-live/magazine-issue-oklahoma-week.json` (`columns.items` or `coverage.items`) and a card to the MJML, rerun `prepare.py` and the builds. The PDF builder reads the post list from `posts.json`, so the PDFs pick it up without code changes.

## Checks run (real output summaries)

| Check | Result |
|---|---|
| Bodies vs public published pages (`verify_against_public.py`) | 6 of 6 identical (CFP 10 blocks, show 24, Goose 50, Yost 29, McMiller 9, Condon 18) |
| `MAG_VARIANT=oklahoma-week build-magazine.mjs --check` | current; 203,072 bytes of 217,088 (212 KB cap) |
| `qa-oklahoma-week.mjs` at 320/390/430/1366, real photos and fonts | pass: one root, one h1, no horizontal overflow (page and root), all sections, six story links, links site-relative only, no `[[` text, no banned-credit text, every image decoded, no repeated media id, Barlow applied, no page errors; download section correctly absent in placeholder mode. Screenshots in `shots/` |
| `qa-oklahoma-week.mjs --final` with throwaway fake PDF names (then restored byte for byte) | pass; the download section renders |
| `check-week-pdf.py` on the print PDF | pass: 6 of 6 stories complete, 0 missing paragraphs, no `http` in text, no link annotations; 17 pages, US Letter |
| `check-week-pdf.py` on the phone PDF | pass: same; 22 pages, 360 x 641 pt (5 x 8.9 in) |
| `check-links.mjs` on the MJML and the compiled HTML | OK: 20 tracked links, 20 unique, full UTM set on each |
| `validate-unique-images.mjs` | pass: 4 image slots, 4 unique |
| `mjml --config.validationLevel strict` | compiles with no errors |
| Email render at 390 and 600 px | no horizontal overflow, no broken image (`shots/email-*.jpg`) |
| `run-stack-qc.mjs` (the Stack template gate) | fails, as it does on the Nov. 2 v2 model: "Missing GatorBait Magazine Newsletter identity" and "Too many editorial images" (4 > 2). It checks the older Colorlib Stack template, not this white and orange model. Not claimed as passed. |
| `check-no-placeholders.mjs` | fails today by design (PDF links and loader pin not filled yet) |
| `MAG_VARIANT=georgia-postgame build-magazine.mjs --check` | current (unchanged by this PR). `MAG_VARIANT=postgame --check` reports `magazine-postgame.js` out of date; that was already so on `main` before this branch. |
