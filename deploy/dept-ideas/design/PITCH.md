# Game Week Cards

## The idea

One Canva template, seven tagged text fields, refilled every week straight from `sports-live/scoreboard.json` (ESPN-sourced) with one `autofill-design` call, then exported to PNG. This week's card exists: **No. 8 Florida at No. 25 Missouri, Saturday, Oct. 3, 3:30 p.m. ET, ABC, Memorial Stadium**, with last week's 52-28 final over No. 4 Ole Miss as the tail line. Swamp Night navy `#07122E`, one orange `#FA4616` bar, white condensed display type, no photo, no logo, no fake signage.

Round one (Billboards) was a CSS mockup. It is dead. This is the Canva design, its autofill dataset, a second design produced by that dataset, and the script that builds the dataset from the feed.

## Why it matters

- The game-day desk already refreshes `scoreboard.json`. That feed now drives a finished social/broadcast card with zero hand-typed facts: rank, records, kickoff (AP style, ET), TV, venue and last week's final all come from the same JSON the homepage's Swamp Night board reads, so the card and the site can never disagree.
- One matchup card per week is the unit AP Mode (broadcast skill, section E) asks for: teams, verified ranking, verified records, kickoff and TV. It ships to the Buddy Martin Show, Florida Gator Lowdown, the newsletter and the Magazine without redesign.
- Facts stay volatile in data, not baked in art. Rankings change Sunday; the desk reruns the script and the autofill, not a designer.
- Same fields, same labels, so the template can be resized to 16:9 (thumbnail master), 4:5 and 9:16 later with `resize-design` and the dataset still fills them.

## Evidence

Canva connector, calls in order (all in the GatorBait account; every design is private):

1. `list-brand-kits` → one Brand Kit, `kADrKmKAhUs` (no name returned).
2. `search-brand-templates` (dataset: any) → `[]`. No existing templates; nothing to reuse.
3. `generate-design` (instagram_post, brand kit `kADrKmKAhUs`) → job `5604393b-8b67-4a50-acfc-69994ad7da5c`, candidate `dg-688a8aca-9e4d-47ed-a5a6-3a70b0c06ab7`, link `canva.com/d/sEDoa0CP_TG5wiV`.
4. `create-design-from-candidate` → refused: "Could not find design generation job or candidate".
5. `resolve-shortlink sEDoa0CP_TG5wiV` → refused: "Shortlink not found". Candidate path abandoned.
6. `search-designs` (owned, newest) → prior art in the account: `DAHVd1qbhOQ` "GatorBait Weekly — Florida at Auburn Preview v2". Generated candidate not present.
7. `create-design` (format "Instagram Post (Portrait)", brief = the seven lines) → job `9901c13a-44ef-41c5-9e5c-73f8e14d6494`.
8. `get-create-design-async-job` → completed, design **`DAHWqVhJoqU`**, edit `canva.com/d/_ngaRYp3r_DQHE8`, view `canva.com/d/sYd4XyEat8p7m1P`.
9. `export-design DAHWqVhJoqU` PNG → job `96d50fa6-c967-4cf5-b548-751fe1827be2`, success (pre-fix version).
10. `read-design DAHWqVhJoqU` → page 1080x1440, seven text elements, all white bold, `fontRef YAEp6dEg5M8`; text stored lowercase with "•" and " - abc" separators (not verbatim).
11. `get-design-dataset DAHWqVhJoqU` → `{}` (no fields yet).
12. `read-design open_transaction` → `3815066384849928337`.
13. `edit-design` on it → refused: "Editing transaction 3815066384849928337 not found". Transactions are short-lived.
14. `read-design open_transaction` → `7672399468843783761`.
15. `edit-design` 7x `replace_text` (exact uppercase AP copy) + 7x `update_autofill_field` (kicker, headline, records, when, venue, last_week, footer) → applied. After-render showed ghost text: the page background is a baked image (`MAHWqQPmE3Q`) carrying the old copy.
16. `edit-design insert_shape` full-page `#07122E` rect → applied. 17. `edit-design layer_element back` → applied; ghost gone (render in `exports/`). 18. `edit-design commit` → committed.
19. `get-design-dataset DAHWqVhJoqU` → `{footer, records, headline, when, venue, last_week, kicker}`, all `text`. Autofill did not require Enterprise on this account.
20. `export-design DAHWqVhJoqU` PNG lossless → job `1f976058-e84d-4bdd-b50d-c7f8fe3053f3`, success.
21. `autofill-design design_id=DAHWqVhJoqU` with the script's data → job `1476664b-84ab-4159-89a3-6cd70d94df40`, new design **`DAHWqlZYYnA`** "GatorBait Game Week — No. 8 Florida at No. 25 Missouri", edit `canva.com/d/eWYZMy6ecjhJAp2`, view `canva.com/d/GALYpAJiBc1bnNX`.
22. `export-design DAHWqlZYYnA` PNG lossless → job `a236169f-200a-42af-bca8-9bebe0705815`, success.

Export URLs are signed `export-download.canva.com` links that expire the same day; this container's proxy returns 403 to `*.canva.com` media hosts, so the PNGs could not be pulled into the repo. `exports/` holds the two 450x600 renders Canva returned during editing (v00 with ghost text, v01 fixed). Re-running call 22 from Brenden's Mac downloads the full 1080x1440 PNG.

Files: `make-cards.mjs` (reads the feed, mirrors the front page's ET/AP date rules, prints `fields`, the `create-design` body, the `autofill-design` body and the `export-design` body; `--write` saves `cards/<kickoff>_matchup_florida-<opp>.json`), `cards/2026-10-03_matchup_florida-missouri.json` (this week's real payload), `preview.html`.

Not verified: the font. `read-design` reports only `fontRef YAEp6dEg5M8`; the render is a heavy condensed grotesk consistent with Barlow Condensed ExtraBold, but the name is unconfirmed. Missouri's 3-1 comes from `standings[].overall`, not a per-game field.

## What it needs from Brenden

1. Open `DAHWqVhJoqU`, confirm the font is Barlow Condensed (switch it if not; the tags survive), and either keep it as the tagged design or `publish-brand-template` it so the desk fills a template instead of a design.
2. Say yes to the seven-line copy rules (kicker, two-line headline, records, when, venue, last week, footer) and whether `GAME WEEK` should read `SEC` on conference weeks.
3. Approve `resize-design` derivatives: 1920x1080 thumbnail master, 1080x1350 and 1080x1920.
4. Proposed routine (not created): Sunday 10:10 a.m. ET, after the poll, `node deploy/dept-ideas/design/make-cards.mjs --write` → `autofill-design` → `export-design`, PNG posted to the game-day desk thread, never to social.

## Risks

- Facts come from `scoreboard.json` only; if the feed lags the AP poll, the card is wrong with confidence. The script refuses to build when `next.kickoffIso` is missing, but not when a rank is stale.
- Long opponent names (Mississippi State, South Carolina) may wrap the 209 px headline; the first away week with a long name needs a look before the routine runs blind.
- Canva edit transactions expire in minutes; any tagging change must open, edit and commit in one sitting.
- The page background is still the baked image under the navy rect; deleting the rect brings the ghost text back. Replace the background media before publishing as a Brand Template.
- 3:4 page (1080x1440) is not Instagram's 4:5; ship the resize before this hits feed posts.
